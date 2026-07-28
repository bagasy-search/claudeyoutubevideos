// preflight_media_v2pd88ko0ud8.mjs — corré esto SIEMPRE antes del farm.
// Caza los dos fallos que sólo se ven después de rendear:
//   · asset ilegible / 0 bytes / sin stream  → el chunk muere con 404 o "undefined"
//   · clip DEMASIADO OSCURO (luma < 34)      → sale un bache negro y lo caza blackdetect
// Los rechazados se APARTAN a public/broll/<slug>/_rechazados/ — NUNCA se borran
// (2026-07-27: un validador con dos -show_entries leyó NaN y borró 72 clips buenos;
//  la forma correcta es UN flag con grupos separados por ':').
//   node scripts/preflight_media_v2pd88ko0ud8.mjs
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const SLUG = "v2pd88ko0ud8";
const parse = (f) => JSON.parse(fs.readFileSync(f, "utf8").replace(/^[\s\S]*?=\s*/, "").replace(/;\s*$/, ""));
const beats = parse(`src/_fed6/VideoEdit/${SLUG}_beats.ts`);
const bro = parse(`src/_fed6/VideoEdit/${SLUG}_broll.ts`);
const REJ = `public/broll/${SLUG}/_rechazados`;

const faltan = [], oscuros = [], rotos = [];

// ── imágenes / rutas del build ───────────────────────────────────────────────
const refs = new Set();
for (const b of beats) { if (b.src) refs.add(b.src); if (b.image) refs.add(b.image); for (const it of b.items || []) if (it && it.image) refs.add(it.image); }
for (const r of refs) {
  const f = path.join("public", r);
  if (!fs.existsSync(f) || fs.statSync(f).size < 1024) { faltan.push(r); continue; }
  const h = fs.readFileSync(f, { start: 0, end: 3 });
  if (/\.(png|jpg|jpeg)$/i.test(f) && !(h[0] === 0x89 || (h[0] === 0xff && h[1] === 0xd8))) rotos.push(r);
}

// ── clips: legibles + brillo ────────────────────────────────────────────────
for (const b of bro) {
  const f = path.join("public", b.src);
  if (!fs.existsSync(f) || fs.statSync(f).size < 12000) { faltan.push(b.src); continue; }
  let info = "";
  try {
    // UN solo -show_entries, grupos separados por ':' (el 2º flag anula al 1º)
    info = execFileSync("ffprobe", ["-v", "error", "-show_entries", "stream=width,height:format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1", f], { encoding: "utf8" });
  } catch { rotos.push(b.src); continue; }
  const nums = info.split(/\s+/).map(Number).filter((n) => !isNaN(n) && n > 0);
  if (nums.length < 3) { rotos.push(b.src); continue; }
  // luma media (signalstats escribe en STDERR, no en stdout)
  let luma = 999;
  try {
    execFileSync("ffmpeg", ["-hide_banner", "-t", "2", "-i", f, "-vf", "signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-f", "null", "-"], { encoding: "utf8" });
  } catch (e) {
    const txt = String(e.stderr || "");
    const vals = [...txt.matchAll(/YAVG=([\d.]+)/g)].map((m) => +m[1]);
    if (vals.length) luma = vals.reduce((a, x) => a + x, 0) / vals.length;
  }
  if (luma < 34) oscuros.push({ src: b.src, luma: Math.round(luma) });
}

if (oscuros.length) {
  fs.mkdirSync(REJ, { recursive: true });
  for (const o of oscuros) {
    const f = path.join("public", o.src);
    if (fs.existsSync(f)) fs.renameSync(f, path.join(REJ, path.basename(f)));
    faltan.push(o.src);
  }
}

console.log(`preflight · refs ${refs.size} + clips ${bro.length}`);
console.log(`  faltan/apartados: ${faltan.length}${faltan.length ? " → " + [...new Set(faltan)].slice(0, 40).join(", ") : ""}`);
console.log(`  ilegibles: ${rotos.length}${rotos.length ? " → " + rotos.join(", ") : ""}`);
console.log(`  oscuros (luma<34, apartados): ${oscuros.length}${oscuros.length ? " → " + oscuros.map((o) => `${o.src}(${o.luma})`).join(", ") : ""}`);
fs.writeFileSync(`_faltan_${SLUG}.json`, JSON.stringify([...new Set([...faltan, ...rotos])], null, 1));
if (faltan.length + rotos.length) { console.error("\nHay agujeros: generá los reemplazos y volvé a correr."); process.exit(1); }
console.log("media ✓");
