// vision_judge.mjs — la revisión "A OJO" de un clip, hecha por un modelo de visión BARATO.
// Reemplaza al humano en el piloto automático. Ve 4 cuadros y contesta con una LISTA CERRADA de defectos
// (con pregunta abierta los jueces alucinan: medido con el juez de audio de louhash).
// Env: VISION_MODEL (default qwen3-vl-flash) · LLM_BASE / LLM_KEY (AIHubMix por defecto).
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn, spawnSync } from "node:child_process";
import { env } from "./env.mjs";

const BASE = () => env("LLM_BASE") || "https://aihubmix.com/v1";
const KEY = () => env("LLM_KEY") || env("AIHUBMIX_KEY");
const MODEL = () => env("VISION_MODEL") || "qwen3-vl-flash";

export const DEFECTOS = {
  agnes: ["SUJETO_DESAPARECE", "SUJETO_SALE_DE_CUADRO", "OBJETO_SE_DEFORMA", "OBJETO_SE_TRANSFORMA", "CARA_CAMBIA", "TEXTO_QUEMADO", "MARCA_DE_AGUA", "CUADRO_ROTO", "NEGRO"],
  stock: ["PERSONA_RECONOCIBLE", "FUERA_DE_TEMA", "TEXTO_QUEMADO", "MARCA_DE_AGUA", "CUADRO_ROTO", "NEGRO"],
};

function cuadros(mp4, n = 4) {
  const d = Number(spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4], { encoding: "utf8" }).stdout) || 4;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vj-"));
  const out = [];
  for (let i = 0; i < n; i++) {
    const f = path.join(tmp, `${i}.jpg`);
    spawnSync("ffmpeg", ["-v", "error", "-y", "-ss", String((d * (i + 0.5)) / n), "-i", mp4, "-frames:v", "1", "-vf", "scale=512:-1", f]);
    if (fs.existsSync(f)) out.push(f);
  }
  return out;
}

function post(body) {
  return new Promise((ok, mal) => {
    const p = spawn("curl", ["-sS", "--fail-with-body", "--max-time", "180", "--variable", "%VJ_KEY", "--expand-header", "Authorization: Bearer {{VJ_KEY}}",
      "-H", "content-type: application/json", "--data-binary", "@-", `${BASE()}/chat/completions`], { env: { ...process.env, VJ_KEY: KEY() } });
    let out = "", err = "";
    p.stdout.on("data", (d) => { out += d; });
    p.stderr.on("data", (d) => { err += d; });
    p.on("close", (c) => { if (c !== 0) return mal(new Error(`curl ${c}: ${(err + out).slice(0, 300)}`)); try { ok(JSON.parse(out)); } catch { mal(new Error(out.slice(0, 200))); } });
    p.stdin.end(JSON.stringify(body));
  });
}

// tipo: "agnes" (clip animado desde UNA foto: la foto es el cuadro 1) | "stock" (metraje real de Pexels/YouTube)
export async function juzgarClip({ mp4, tipo = "agnes", muestra = "", consulta = "", escena = "", movimiento = "" }) {
  const fs4 = cuadros(mp4);
  if (fs4.length < 2) return { ok: false, defectos: ["CUADRO_ROTO"], motivo: "no se pudieron sacar cuadros", usd: 0 };
  const lista = DEFECTOS[tipo];
  // ⛔ Medido 05-oct: con pregunta de "defectos" el juez RACIONALIZA (aprobó una mano que desaparece
  //    "por el movimiento de cámara"). Ahora MIDE por cuadro y el veredicto lo saca el CÓDIGO.
  const pregunta = tipo === "agnes"
    ? `These are ${fs4.length} frames IN ORDER from a short AI animation of ONE photo. Scene: "${escena || muestra}". `
      + `First name the 1-2 KEY SUBJECTS of the scene (e.g. "the hand", "the plug in the outlet"). Then for EACH frame say if EACH key subject is clearly visible and intact (same object, same shape). `
      + `Also flag only if present in ANY frame: burned-in text overlay/subtitles, watermark, broken/glitched frame, a different person's face.`
    : `These are ${fs4.length} frames from a REAL stock clip searched with "${consulta}", used to illustrate: "${muestra}". `
      + `For EACH frame say: is a human FACE visible? does it show the topic (yes/no)? Also flag burned-in text overlay, watermark, broken frame.`;
  const forma = tipo === "agnes"
    ? `{"sujetos": ["..."], "frames": [{"visibles": [true/false per subject, same order]}], "texto": false, "marca": false, "roto": false, "otra_cara": false}`
    : `{"frames": [{"cara": false, "tema": true}], "texto": false, "marca": false, "roto": false}`;
  const content = [{ type: "text", text: `${pregunta}\nAnswer ONLY with JSON exactly like: ${forma}` },
    ...fs4.map((f) => ({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${fs.readFileSync(f).toString("base64")}` } }))];
  const veredicto = (v) => {
    const d = [], fr = v.frames || [];
    if (v.texto) d.push("TEXTO_QUEMADO");
    if (v.marca) d.push("MARCA_DE_AGUA");
    if (v.roto) d.push("CUADRO_ROTO");
    if (tipo === "agnes") {
      if (v.otra_cara) d.push("CARA_CAMBIA");
      const n = (v.sujetos || []).length || 1;
      for (let k = 0; k < n; k++) {
        const vis = fr.map((f) => (f.visibles || [])[k]);
        if (vis[0] !== false && vis.slice(1).some((x) => x === false)) { d.push("SUJETO_DESAPARECE"); break; }
      }
    } else {
      if (fr.some((f) => f.cara)) d.push("PERSONA_RECONOCIBLE");
      if (fr.filter((f) => f.tema === false).length > fr.length / 2) d.push("FUERA_DE_TEMA");
    }
    return d;
  };
  let ultimo;
  for (let i = 0; i < 3; i++) {
    try {
      const j = await post({ model: MODEL(), messages: [{ role: "user", content }], max_tokens: 600, temperature: 0 });
      const txt = String(j.choices?.[0]?.message?.content || "");
      const v = JSON.parse(txt.slice(txt.indexOf("{"), txt.lastIndexOf("}") + 1));
      const defectos = veredicto(v);
      const u = j.usage || {};
      return { ok: defectos.length === 0, defectos, medido: v, tokens: (u.prompt_tokens || 0) + (u.completion_tokens || 0) };
    } catch (e) { ultimo = e; await new Promise((s) => setTimeout(s, 3000 * (i + 1))); }
  }
  // Fail-closed: si el juez no pudo mirar, el clip NO se aprueba (exit 2 = no midió → se trata como rechazo).
  return { ok: false, defectos: ["NO_MIDIO"], motivo: `el juez no respondió: ${ultimo?.message?.slice(0, 120)}` };
}
