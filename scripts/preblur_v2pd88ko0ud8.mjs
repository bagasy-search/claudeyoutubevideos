// preblur_v2pd88ko0ud8.mjs — OBLIGATORIO antes de rendear.
// FocusCards deriva la ruta borrosa EN TIEMPO DE EJECUCIÓN (image.replace(ext,"_blur.jpg")),
// así que esos archivos NO aparecen en los beats ni en el pre-vuelo de assets: si no existen,
// el chunk muere con 404 y el matrix cancela el render entero.
//   node scripts/preblur_v2pd88ko0ud8.mjs
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const SLUG = "v2pd88ko0ud8";
const beats = JSON.parse(
  fs.readFileSync(`src/_fed6/VideoEdit/${SLUG}_beats.ts`, "utf8").replace(/^[\s\S]*?=\s*/, "").replace(/;\s*$/, "")
);

// toda imagen que un componente pueda blurear en runtime
const need = new Set();
for (const b of beats) {
  for (const it of b.items || []) if (it && it.image) need.add(it.image);
  if (b.image) need.add(b.image);
}

let made = 0, miss = [];
for (const img of need) {
  const src = path.join("public", img);
  const out = path.join("public", img.replace(/\.(png|jpg|jpeg|webp)$/i, "_blur.jpg"));
  if (!fs.existsSync(src)) { miss.push(img); continue; }
  if (fs.existsSync(out)) continue;
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-vf", "gblur=sigma=22", "-q:v", "4", out]);
  made++;
}
console.log(`preblur · necesarias ${need.size} · generadas ${made} · faltan en disco ${miss.length}`);
if (miss.length) { console.error("SIN IMAGEN BASE:", miss.join(", ")); process.exit(1); }
