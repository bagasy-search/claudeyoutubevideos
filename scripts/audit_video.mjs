// scripts/audit_video.mjs — CONTACT SHEET del video ARMADO para el agente AUDITOR
// (match_v3/PROMPTS.md §4). El paso que más calidad compra: el 90% de los problemas
// no se ven leyendo el guión, se ven MIRANDO el frame con la frase que suena al lado.
//
// DOS CAMINOS:
//   A) RÁPIDO (recomendado): ya existe un render/preview del video
//      node scripts/audit_video.mjs <slug> --video out/<slug>.mp4 [--every 12]
//      → extrae 1 frame cada N s del mp4 con ffmpeg (segundos, no minutos).
//   B) SIN RENDER: stills directo de la composición Remotion (más lento, ~10-20min)
//      node scripts/audit_video.mjs <slug> --comp <CompId> [--every 12] [--total <sec>]
//      → npx remotion still por muestra (usa el cache de bundle de Remotion).
//
// Salida en _audit_<slug>/:
//   sheet_NN.jpg           mosaicos 4x3 con el timestamp quemado en cada tile
//   _audit_manifest.json   { "<t>": "<frase de la narración en ese segundo>" }
// El agente AUDITOR mira los mosaicos + manifest → issues.json → fixes:
//   mismatch/burned/ugly de beats raw → scripts/stockfallback.mjs --list (re-ruteo stock)
//   dead/illegible → tocar el beatsheet (maxRawDur / dur / tamaño del componente).
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : def; };
if (!slug) { console.error("Uso: node scripts/audit_video.mjs <slug> (--video out/x.mp4 | --comp <CompId> [--total sec]) [--every 12]"); process.exit(1); }
const VIDEO = opt("video", null);
const COMP = opt("comp", null);
const EVERY = +opt("every", 12);
const OUT = `_audit_${slug}`;
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// ffmpeg COMPLETO (el de Remotion es un build recortado sin drawtext/tile):
// FFMPEG env → WinGet → PATH.
const winget = path.join(process.env.LOCALAPPDATA || "", "Microsoft", "WinGet", "Links", "ffmpeg.exe");
const FF = process.env.FFMPEG || (fs.existsSync(winget) ? winget : "ffmpeg");
const FONT = "C\\:/Windows/Fonts/arialbd.ttf";

// ── 1) narración por segundo (Whisper) ───────────────────────────────────────
const capPath = path.join("public", `captions_${slug}.json`);
let sentences = []; // {t, text}
if (fs.existsSync(capPath)) {
  const words = JSON.parse(fs.readFileSync(capPath, "utf8").replace(/^﻿/, ""));
  const ws = Array.isArray(words) ? words : words.segments || [];
  let cur = "", curT = null;
  for (const w of ws) {
    const st = (w.startMs ?? w.start * 1000) / 1000;
    if (curT == null) curT = st;
    cur += (w.text || "") + " ";
    if (/[.!?…]\s*$/.test((w.text || "").trim())) { sentences.push({ t: curT, text: cur.replace(/\s+/g, " ").trim() }); cur = ""; curT = null; }
  }
  if (cur.trim()) sentences.push({ t: curT ?? 0, text: cur.trim() });
} else console.warn(`⚠ sin ${capPath} → manifest sin frases`);
const phraseAt = (t) => {
  let best = "";
  for (const s of sentences) { if (s.t <= t) best = s.text; else break; }
  return best;
};

// ── 2) duración total ─────────────────────────────────────────────────────────
let total = +opt("total", 0);
if (!total && VIDEO) {
  const r = spawnSync(FF, ["-i", VIDEO], { encoding: "utf8" });
  const m = ((r.stderr || "").match(/Duration: (\d+):(\d+):(\d+\.\d+)/) || []);
  if (m.length) total = +m[1] * 3600 + +m[2] * 60 + +m[3];
}
if (!total && sentences.length) total = sentences[sentences.length - 1].t + 6;
if (!total) { console.error("No pude determinar la duración (--total)"); process.exit(1); }

const times = [];
for (let t = 1; t < total; t += EVERY) times.push(+t.toFixed(1));
console.log(`${times.length} muestras cada ${EVERY}s sobre ${total.toFixed(0)}s`);

// ── 3) extraer frames ─────────────────────────────────────────────────────────
const frameFiles = [];
if (VIDEO) {
  for (const t of times) {
    const dest = path.join(OUT, `f_${String(Math.round(t)).padStart(4, "0")}.jpg`);
    const r = spawnSync(FF, ["-y", "-v", "error", "-ss", String(t), "-i", VIDEO, "-frames:v", "1",
      "-vf", `scale=512:-1,drawtext=fontfile='${FONT}':text='${Math.floor(t / 60)}\\:${String(Math.round(t % 60)).padStart(2, "0")}':x=8:y=8:fontsize=30:fontcolor=yellow:box=1:boxcolor=black@0.6`,
      "-q:v", "4", dest], { encoding: "utf8", timeout: 30000 });
    if (r.status === 0 && fs.existsSync(dest)) frameFiles.push(dest);
  }
} else if (COMP) {
  // stills de la composición (bundle cacheado entre llamadas por Remotion)
  const fps = 30;
  for (const t of times) {
    const dest = path.join(OUT, `f_${String(Math.round(t)).padStart(4, "0")}.jpg`);
    const ENTRY = opt("entry", null);
    const stillArgs = ENTRY ? ["remotion", "still", ENTRY, COMP, dest] : ["remotion", "still", COMP, dest];
    const r = spawnSync("npx", [...stillArgs, `--frame=${Math.round(t * fps)}`, "--jpeg-quality=70", "--scale=0.5", "--log=error"],
      { encoding: "utf8", shell: true, timeout: 180000, env: { ...process.env, TMP: process.env.TMP || "D:\\rtmp\\tmp", TEMP: process.env.TEMP || "D:\\rtmp\\tmp" } });
    if (r.status === 0 && fs.existsSync(dest)) { frameFiles.push(dest); process.stdout.write("."); }
    else process.stdout.write("x");
  }
  console.log("");
} else { console.error("Pasá --video o --comp"); process.exit(1); }
console.log(`${frameFiles.length}/${times.length} frames extraídos`);

// ── 4) mosaicos 4x3 (menos Reads para el agente) ─────────────────────────────
let sheet = 0;
for (let i = 0; i < frameFiles.length; i += 12) {
  sheet++;
  const batch = frameFiles.slice(i, i + 12);
  const inputs = batch.flatMap((f) => ["-i", f]);
  const dest = path.join(OUT, `sheet_${String(sheet).padStart(2, "0")}.jpg`);
  // todos los frames salen del mismo video/composición → mismas dimensiones → concat+tile
  const r = spawnSync(FF, ["-y", "-v", "error", ...inputs,
    "-filter_complex", `concat=n=${batch.length}:v=1:a=0,tile=4x3`, "-q:v", "4", dest], { encoding: "utf8", timeout: 60000 });
  if (r.status !== 0) console.warn(`  mosaico ${sheet} falló; quedan los frames sueltos en ${OUT}/`);
}

// ── 5) manifest frase-por-frame ───────────────────────────────────────────────
const manifest = {};
for (const t of times) manifest[t] = phraseAt(t);
fs.writeFileSync(path.join(OUT, "_audit_manifest.json"), JSON.stringify(manifest, null, 1));
console.log(`→ ${OUT}/ (sheets + frames + _audit_manifest.json)`);
console.log(`Siguiente: agente AUDITOR (match_v3/PROMPTS.md §4) mira los sheets → ${OUT}/issues.json`);
console.log(`  raw con mismatch/burned/ugly → stockfallback --list · dead/illegible → beatsheet (maxRawDur/dur)`);
