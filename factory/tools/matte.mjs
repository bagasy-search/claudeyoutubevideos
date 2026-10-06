// matte.mjs — recorte del presentador de UNA ventana de avatar, como WebM VP9 con ALFA
// (lo lee <OffthreadVideo transparent> en AvatarVentana para el compositing `fx`).
//   node factory/tools/matte.mjs <ventana.mp4> <salida_fg.webm>
// El cómputo pesado (RVM) corre en Modal; en local sólo ffmpeg une color + alfa.
// Compuerta: el alfa tiene que tener los MISMOS cuadros que la ventana y un sujeto que ocupe entre
// 3 % y 70 % del cuadro (0 % = no recortó nada; 100 % = recortó el fondo entero). Exit 2 si no midió.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT } from "../lib/env.mjs";

const [src, out] = process.argv.slice(2);
if (!src || !out || !fs.existsSync(src)) { console.error("uso: node factory/tools/matte.mjs <ventana.mp4> <salida_fg.webm>"); process.exit(2); }
const alpha = out.replace(/\.webm$/, "_alpha.mp4");
const nf = (f) => Number(String(execFileSync("ffprobe", ["-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", f])).match(/\d+/)?.[0] || 0);

if (!fs.existsSync(alpha)) {
  try {
    execFileSync("python", ["-m", "modal", "run", path.join(ROOT, "factory", "py", "modal_matte.py"), "--src", src, "--out", alpha],
      { stdio: "inherit", env: { ...process.env, PYTHONUTF8: "1" }, timeout: 25 * 60_000 });
  } catch (e) {
    // 30-sep-2026: Modal sin saldo ("spend limit") → respaldo local en CPU (rembg + suavizado temporal)
    console.log(`matte: Modal falló (${String(e.message).split("\n")[0].slice(0, 120)}) → respaldo local CPU`);
    fs.rmSync(alpha, { force: true });
    execFileSync("python", [path.join(ROOT, "factory", "py", "local_matte.py"), "--src", src, "--out", alpha],
      { stdio: "inherit", env: { ...process.env, PYTHONUTF8: "1" }, timeout: 40 * 60_000 });
  }
}
const a = nf(src), b = nf(alpha);
console.log(`matte: ventana ${a} cuadros · alfa ${b} cuadros`);
if (!a || !b) process.exit(2);
if (Math.abs(a - b) > 1) { console.error(`⛔ el alfa tiene ${b} cuadros y la ventana ${a}: el recorte se correría`); process.exit(1); }

// cobertura media del sujeto sobre 5 cuadros
const cob = [];
for (const t of [0.1, 0.3, 0.5, 0.7, 0.9]) {
  const dur = a / 30;
  const buf = execFileSync("ffmpeg", ["-v", "error", "-ss", String((dur * t).toFixed(2)), "-i", alpha, "-frames:v", "1", "-vf", "scale=96:54,format=gray", "-f", "rawvideo", "-"]);
  cob.push(buf.reduce((s, v) => s + (v > 127 ? 1 : 0), 0) / buf.length);
}
const med = cob.reduce((s, v) => s + v, 0) / cob.length;
console.log(`matte: sujeto ocupa ${(med * 100).toFixed(1)} % del cuadro (5 muestras: ${cob.map((c) => (c * 100).toFixed(0)).join(" ")})`);
if (med < 0.03 || med > 0.7) { console.error("⛔ recorte fuera de rango (3-70 %)"); process.exit(1); }

execFileSync("ffmpeg", ["-v", "error", "-y", "-i", src, "-i", alpha, "-filter_complex",
  "[1:v]format=gray[al];[0:v][al]alphamerge,format=yuva420p",
  "-an", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-auto-alt-ref", "0", "-b:v", "0", "-crf", "24", "-row-mt", "1", "-deadline", "good", "-cpu-used", "4", "-r", "30", out],
  { stdio: "inherit", timeout: 20 * 60_000 });
const c = nf(out);
console.log(`matte: ✓ ${out} (${c} cuadros)`);
if (Math.abs(c - a) > 1) { console.error("⛔ el webm no tiene los cuadros de la ventana"); process.exit(1); }
