// shrink_v89y5o7w2nz6.mjs — baja el peso del tarball del farm (tope práctico ~400 MB desde esta PC).
//  · b-roll → 960px CRF 31, RECORTADO a la duración que usa el build (+0.4 s de colchón)
//  · imágenes PNG → JPG q4 y reapunta TODAS las rutas generadas (beats, broll, shim)
//  · NO borra los PNG originales (assets pagos): el tar se arma con la lista explícita
import fs from "fs";
import { execFileSync } from "child_process";
const SLUG = "v89y5o7w2nz6";
const ff = (args) => execFileSync("ffmpeg", ["-y", "-v", "error", ...args], { stdio: "pipe" });

// ── b-roll ───────────────────────────────────────────────────────────────────
const broll = JSON.parse(fs.readFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`, "utf8")
  .match(/=\s*(\[.*\]);/s)[1]);
let n = 0;
for (const b of broll) {
  const src = "public/" + b.src;
  const tmp = src.replace(/\.mp4$/, "_s.mp4");
  if (!fs.existsSync(src)) continue;
  if (fs.existsSync(tmp)) { fs.renameSync(tmp, src); continue; }
  const t = Math.min(b.dur + 0.6, 9);
  try {
    ff(["-i", src, "-t", String(t), "-an", "-vf", "scale='min(960,iw)':-2", "-c:v", "libx264",
        "-crf", "31", "-preset", "veryfast", "-pix_fmt", "yuv420p", tmp]);
    if (fs.statSync(tmp).size > 8000) { fs.rmSync(src); fs.renameSync(tmp, src); n++; }
    else fs.rmSync(tmp);
  } catch { try { fs.rmSync(tmp); } catch {} }
}
console.log(`b-roll recomprimido: ${n}/${broll.length}`);

// ── imágenes PNG → JPG ───────────────────────────────────────────────────────
const pngs = fs.readdirSync("public/img").filter((f) => f.includes(SLUG) && f.endsWith(".png"));
let m = 0;
for (const f of pngs) {
  const jpg = "public/img/" + f.replace(/\.png$/, ".jpg");
  if (fs.existsSync(jpg)) { m++; continue; }
  try { ff(["-i", "public/img/" + f, "-q:v", "4", jpg]); m++; } catch {}
}
console.log(`imágenes a JPG: ${m}/${pngs.length}`);

// ── reapuntar rutas .png → .jpg en TODO lo generado ──────────────────────────
const files = [
  `src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`,
  `src/VideoEdit/Main_${SLUG}.tsx`,
  `beatsheet/${SLUG}.json`,
];
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  const s = fs.readFileSync(f, "utf8");
  fs.writeFileSync(f, s.replace(new RegExp(`(img/[a-z0-9_]*${SLUG}[a-z0-9_]*)\\.png`, "gi"), "$1.jpg"));
}
// los _blur ya son .jpg; blurOf() reemplaza la extensión, así que sigue resolviendo

// ── verificación: ninguna ruta rota ──────────────────────────────────────────
const beats = JSON.parse(fs.readFileSync(`beatsheet/${SLUG}.json`, "utf8")).beats;
const need = new Set();
for (const b of beats) {
  if (b.src && /^img\//.test(b.src)) need.add(b.src);
  if (b.image) need.add(b.image);
  (b.slides || []).forEach((s) => s.image && need.add(s.image));
  (b.items || []).forEach((i) => i && i.image && need.add(i.image));
  (b.steps || []).forEach((s) => s && s.image && need.add(s.image));
}
const roto = [...need].filter((p) => !fs.existsSync("public/" + p));
console.log(roto.length ? `⛔ RUTAS ROTAS (${roto.length}): ${roto.slice(0, 10)}` : "✓ todas las rutas de imagen existen");

// ── lista explícita para el tar ──────────────────────────────────────────────
const list = [
  ...[...need],
  ...[...need].map((p) => p.replace(/\.(png|jpg|jpeg|webp)$/i, "_blur.jpg")).filter((p) => fs.existsSync("public/" + p)),
  ...broll.map((b) => b.src).filter((p) => fs.existsSync("public/" + p)),
  `${SLUG}_opt.mp4`, `${SLUG}.wav`,
];
fs.writeFileSync(`_${SLUG}_assets.txt`, [...new Set(list)].join("\n"));
let bytes = 0;
for (const p of new Set(list)) { try { bytes += fs.statSync("public/" + p).size; } catch {} }
console.log(`tar: ${new Set(list).size} archivos · ${(bytes / 1048576).toFixed(0)} MB (+ sfx/med)`);
