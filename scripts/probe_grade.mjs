// scripts/probe_grade.mjs — NORMALIZACIÓN de color entre clips de fuentes dispares.
// No es un "look" (regla dura: colores naturales, cero filtros creativos): mide el
// brillo (YAVG) y la saturación (SATAVG) de cada clip con signalstats, calcula la
// MEDIANA del lote y emite por clip una corrección suave hacia esa mediana
// (brightness/saturate CSS, clamp ±8%) → los cortes entre YouTube crudo, Pexels y
// foto IA dejan de "saltar" de exposición.
//
// Salida: public/broll/_grade_<slug>.json  { "<asset sin ext>": "brightness(1.04) saturate(0.96)" }
// beatsheet.mjs lo levanta solo y lo pasa como prop `grade` a RawShot→Media.
//
// Uso: node scripts/probe_grade.mjs <slug> [dir=public/broll] [--include-img]
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const [slug, dirArg] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!slug) { console.error("Uso: node scripts/probe_grade.mjs <slug> [dir]"); process.exit(1); }
const DIR = dirArg || "public/broll";
// el ffmpeg de Remotion es un build recortado SIN el muxer null (falla signalstats) →
// preferir un ffmpeg completo: FFMPEG env → WinGet → PATH.
const winget = path.join(process.env.LOCALAPPDATA || "", "Microsoft", "WinGet", "Links", "ffmpeg.exe");
const FF = process.env.FFMPEG || (fs.existsSync(winget) ? winget : "ffmpeg");

// stats de un clip: muestrea ~6 frames repartidos, promedia YAVG/SATAVG
function stats(file) {
  const r = spawnSync(FF, ["-hide_banner", "-i", file, "-vf", "select='not(mod(n\\,24))',signalstats,metadata=print:file=-", "-frames:v", "6", "-f", "null", "-"],
    { encoding: "utf8", timeout: 40000, maxBuffer: 1 << 24 });
  const txt = (r.stdout || "") + (r.stderr || "");
  const ys = [...txt.matchAll(/signalstats\.YAVG=([\d.]+)/g)].map((m) => +m[1]);
  const ss = [...txt.matchAll(/signalstats\.SATAVG=([\d.]+)/g)].map((m) => +m[1]);
  if (!ys.length) return null;
  const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  return { y: avg(ys), sat: ss.length ? avg(ss) : 0 };
}

// medir SOLO los clips del video (beatsheet/<slug>.json); sin beatsheet, todo el dir
let files = fs.readdirSync(DIR).filter((f) => /\.mp4$/i.test(f) && !f.startsWith("_"));
const bsPath = path.join("beatsheet", `${slug}.json`);
if (fs.existsSync(bsPath)) {
  const wanted = new Set();
  const walk = (o) => {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o)) return o.forEach(walk);
    for (const k of Object.keys(o)) {
      if (typeof o[k] === "string" && /\.(mp4|webm|mov)$/i.test(o[k])) wanted.add(path.basename(o[k]));
      else walk(o[k]);
    }
  };
  walk(JSON.parse(fs.readFileSync(bsPath, "utf8")).beats);
  const inBs = files.filter((f) => wanted.has(f));
  if (inBs.length) files = inBs;
}
if (!files.length) { console.error(`sin mp4 en ${DIR}`); process.exit(1); }
console.log(`midiendo ${files.length} clips…`);
const meas = [];
for (const f of files) {
  const s = stats(path.join(DIR, f));
  if (s) { meas.push({ name: f.replace(/\.mp4$/i, ""), ...s }); process.stdout.write("."); }
}
console.log("");
if (meas.length < 3) { console.error("muy pocos clips medibles"); process.exit(1); }

const med = (arr) => { const s = [...arr].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const ty = med(meas.map((m) => m.y));
const tsat = med(meas.map((m) => m.sat).filter((v) => v > 0)) || 0;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const out = {};
for (const m of meas) {
  // corrección PARCIAL (60%) hacia la mediana, clamp ±8% — sutil, invisible como "filtro"
  const bright = clamp(1 + ((ty - m.y) / 255) * 0.6, 0.92, 1.08);
  const sat = m.sat > 0 && tsat > 0 ? clamp(1 + (tsat / m.sat - 1) * 0.6, 0.92, 1.08) : 1;
  const parts = [];
  if (Math.abs(bright - 1) > 0.015) parts.push(`brightness(${bright.toFixed(3)})`);
  if (Math.abs(sat - 1) > 0.015) parts.push(`saturate(${sat.toFixed(3)})`);
  if (parts.length) out[m.name] = parts.join(" ");
}
const outPath = path.join("public", "broll", `_grade_${slug}.json`);
fs.writeFileSync(outPath, JSON.stringify(out, null, 1));
console.log(`mediana Y=${ty.toFixed(1)} SAT=${tsat.toFixed(1)} · ${Object.keys(out).length}/${meas.length} clips con corrección → ${outPath}`);
console.log(`(beatsheet.mjs lo aplica solo en el próximo build)`);
