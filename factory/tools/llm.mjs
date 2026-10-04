// llm.mjs — lo creativo con un modelo BARATO (Qwen/DeepSeek vía API compatible OpenAI) en vez de Claude.
// Experimento E1 (PLAN_FABRICA §4): ¿un modelo de US$0,16/M llena la dirección y pasa las compuertas?
//
//   node factory/tools/llm.mjs guion  <slug> --tema "<tema>" [--seg 180]   → escribe el guion en spec.guion
//   node factory/tools/llm.mjs direct <slug> [--intentos 3]                → DIRECTOR_PROMPT.md → dir_A.json…
//
// `direct` corre 30_direct, y si la compuerta falla le devuelve los errores al modelo (sólo de su tramo).
// Mide y loguea tokens y US$ de cada llamada: el número es lo que decide si esto sirve.
// Env: LLM_BASE (default AIHubMix) · LLM_KEY (default AIHUBMIX_KEY) · LLM_MODEL (default qwen3.8-flash)
//      LLM_USD_IN / LLM_USD_OUT por millón (default 0,16 / 0,47, precio OpenRouter de qwen3.8-flash).
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { env, ROOT } from "../lib/env.mjs";
import { loadSpec } from "../lib/spec.mjs";
import { slugPaths } from "../lib/paths.mjs";

const BASE = env("LLM_BASE") || "https://aihubmix.com/v1";
const KEY = env("LLM_KEY") || env("AIHUBMIX_KEY");
const MODEL = env("LLM_MODEL") || "qwen3.8-flash";
const USD_IN = Number(env("LLM_USD_IN") || 0.16), USD_OUT = Number(env("LLM_USD_OUT") || 0.47);
const tot = { in: 0, out: 0, llamadas: 0, seg: 0 };

async function chat(messages, { json = false, maxTokens = 16000 } = {}) {
  if (!KEY) throw new Error("falta LLM_KEY / AIHUBMIX_KEY en .env");
  const t0 = Date.now();
  for (let i = 0; i < 4; i++) {
    const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 600_000);
    try {
      // STREAM: los modelos que razonan tardan >300 s en mandar la 1ª cabecera y undici corta la espera.
      const r = await fetch(`${BASE}/chat/completions`, {
        method: "POST", signal: ctl.signal,
        headers: { "content-type": "application/json", authorization: `Bearer ${KEY}` },
        body: JSON.stringify({ model: MODEL, messages, max_tokens: maxTokens, temperature: 0.7, stream: true, stream_options: { include_usage: true }, ...(json ? { response_format: { type: "json_object" } } : {}) }),
      });
      if (!r.ok) { const body = await r.text(); if (r.status >= 500 || r.status === 429) { await new Promise((s) => setTimeout(s, 2000 * 2 ** i)); continue; } throw new Error(`${r.status} ${body.slice(0, 400)}`); }
      let txt = "", u = {}, buf = "";
      const dec = new TextDecoder();
      for await (const chunk of r.body) {
        buf += dec.decode(chunk, { stream: true });
        let nl;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const l = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1);
          if (!l.startsWith("data:") || l === "data: [DONE]") continue;
          const j = JSON.parse(l.slice(5));
          txt += j.choices?.[0]?.delta?.content || "";
          if (j.usage) u = j.usage;
        }
      }
      tot.in += u.prompt_tokens || 0; tot.out += u.completion_tokens || 0; tot.llamadas++; tot.seg += (Date.now() - t0) / 1000;
      console.log(`   llm ${MODEL}: ${u.prompt_tokens} in / ${u.completion_tokens} out · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
      return txt;
    } catch (e) {
      if (i === 3 || /^\d{3} /.test(e.message)) throw e;
      console.log(`   llm: ${e.cause?.code || e.message} → reintento`);
    } finally { clearTimeout(to); }
  }
  throw new Error("el modelo no respondió tras 4 intentos");
}

const costo = () => `${tot.llamadas} llamadas · ${tot.in} in / ${tot.out} out · ${tot.seg.toFixed(0)} s · US$ ${((tot.in * USD_IN + tot.out * USD_OUT) / 1e6).toFixed(4)}`;

function sacarJson(txt) {
  const s = txt.replace(/^[\s\S]*?```(?:json)?\s*/i, (m) => (/```/.test(m) ? "" : m)).replace(/```[\s\S]*$/, "");
  const a = s.indexOf("["), o = s.indexOf("{");
  const ini = a >= 0 && (o < 0 || a < o) ? a : o;
  const v = JSON.parse(s.slice(ini, Math.max(s.lastIndexOf("]"), s.lastIndexOf("}")) + 1));
  return Array.isArray(v) ? v : v.planos || v.plans || v.shots || Object.values(v).find(Array.isArray) || [];
}

async function guion(slug, { tema, seg }) {
  const spec = loadSpec(slug);
  const chars = Math.round(seg * (spec.style.frases?.cps || 14));
  const txt = await chat([
    { role: "system", content: `You write YouTube voice-over scripts for the channel "${spec.style.nombre}". Dialect/voice rules: ${spec.style.dialecto}` },
    { role: "user", content: [
      `Write the full spoken script for a video about: ${tema}`,
      `Length: about ${chars} characters (~${seg} seconds read aloud). Plain spoken text ONLY: no headings, no stage directions, no brackets, no emojis, no lists with symbols.`,
      "Open with a strong hook in the first two sentences. Concrete, practical, specific details a viewer can act on today.",
      `Near the end include, word for word, a sentence that starts with "${spec.cta.ancla}" and invites to subscribe.`,
      "Do not mention prices of any product of the channel, links or anything free.",
    ].join("\n") },
  ], { maxTokens: 4000 });
  fs.mkdirSync(path.dirname(spec.guion), { recursive: true });
  fs.writeFileSync(spec.guion, txt.trim() + "\n");
  console.log(`guion → ${spec.guion} (${txt.trim().length} car., objetivo ${chars}) · ${costo()}`);
}

function correr30(slug) {
  const r = spawnSync(process.execPath, [path.join(ROOT, "factory", "run.mjs"), "run", slug, "--from", "30_direct", "--hasta", "30_direct"], { encoding: "utf8", env: process.env });
  return { code: r.status, log: (r.stdout || "") + (r.stderr || "") };
}

async function direct(slug, { intentos }) {
  const P = slugPaths(slug);
  const pf = path.join(P.dirDir, "DIRECTOR_PROMPT.md");
  if (!fs.existsSync(pf)) throw new Error(`no existe ${pf}: corré antes run ${slug} --hasta 30_direct`);
  const prompt = fs.readFileSync(pf, "utf8");
  const [cabeza, tabla] = prompt.split("## Momentos");
  const filas = tabla.split("\n").filter((l) => /^\| p\d{3} /.test(l));
  const TR = 60, tramos = [];
  for (let i = 0; i < filas.length; i += TR) tramos.push(filas.slice(i, i + TR));
  const sys = { role: "system", content: "You are the film DIRECTOR of a YouTube video factory. You answer ONLY with a JSON object {\"planos\": [...]} following the rules and format exactly. No prose." };
  const pedir = (k, extra = []) => [sys, { role: "user", content: [cabeza, "## Momentos de ESTE tramo (escribí TODOS, en orden, con sus segundos planos `x` cuando correspondan)", "| n | sec | dur s | dice |", "|---|---|---|---|", ...tramos[k], "", ...extra].join("\n") }];

  for (const f of fs.readdirSync(P.dirDir).filter((f) => /^dir_[A-Z]+\.json$/.test(f))) fs.unlinkSync(path.join(P.dirDir, f));
  const letra = (k) => String.fromCharCode(65 + k);
  await Promise.all(tramos.map(async (_, k) => {
    const planos = sacarJson(await chat(pedir(k), { json: true }));
    fs.writeFileSync(path.join(P.dirDir, `dir_${letra(k)}.json`), JSON.stringify(planos, null, 1));
    console.log(`   dir_${letra(k)}.json: ${planos.length} planos para ${tramos[k].length} momentos`);
  }));

  for (let n = 1; n <= intentos; n++) {
    const r = correr30(slug);
    const errores = r.log.split("\n").filter((l) => /⛔|GATE|Error|falló|sin segundo plano/.test(l));
    console.log(`── 30_direct intento ${n}: exit ${r.code}\n${errores.slice(0, 25).join("\n")}`);
    if (r.code === 0) { console.log(`✅ la dirección de ${MODEL} pasó TODAS las compuertas · ${costo()}`); return; }
    if (n === intentos) break;
    // Devuelve a cada tramo sus errores (los que nombran sus pNNN) + los globales.
    const nombres = (k) => new Set(tramos[k].map((l) => l.split("|")[1].trim()));
    await Promise.all(tramos.map(async (_, k) => {
      const mios = errores.filter((e) => [...nombres(k)].some((nm) => e.includes(nm)));
      const globales = errores.filter((e) => !/p\d{3}/.test(e));
      if (!mios.length && !globales.length) return;
      const actual = fs.readFileSync(path.join(P.dirDir, `dir_${letra(k)}.json`), "utf8");
      const planos = sacarJson(await chat(pedir(k, ["## Tu versión anterior", "```json", actual, "```",
        "## La compuerta la RECHAZÓ por esto. Corregí SÓLO lo necesario y devolvé el tramo COMPLETO:", ...mios, ...globales]), { json: true }));
      fs.writeFileSync(path.join(P.dirDir, `dir_${letra(k)}.json`), JSON.stringify(planos, null, 1));
    }));
  }
  console.log(`⛔ no pasó tras ${intentos} intentos · ${costo()}`); process.exitCode = 1;
}

const [cmd, slug, ...rest] = process.argv.slice(2);
const opt = (k, d) => { const i = rest.indexOf(`--${k}`); return i >= 0 ? rest[i + 1] : d; };
if (cmd === "guion") await guion(slug, { tema: opt("tema"), seg: Number(opt("seg", 180)) });
else if (cmd === "direct") await direct(slug, { intentos: Number(opt("intentos", 3)) });
else { console.log("uso: llm.mjs guion <slug> --tema \"…\" [--seg 180] | llm.mjs direct <slug> [--intentos 3]"); process.exitCode = 2; }
