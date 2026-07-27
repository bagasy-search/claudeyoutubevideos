// preblur_v8v252t7cjxe.mjs — genera las versiones BORROSAS que pide FocusCards.
// `FocusCards_<slug>.tsx` deriva la ruta con `blurOf()`: cambia la extensión por `_blur.jpg` y espera
// que ese archivo EXISTA. No lo genera solo. Si falta, Remotion tira 404 y el chunk MUERE (pasó:
// el render se cayó entero por 5 imágenes `_blur.jpg` que nunca se habían generado).
// Es el paso "preblur" del pipeline de la skill, que me había salteado.
import fs from "fs";
import { execFileSync } from "child_process";

const SLUG = "v8v252t7cjxe";
const beats = JSON.parse(fs.readFileSync(`beatsheet/${SLUG}.json`, "utf8")).beats;

// las imágenes que FocusCards va a pedir borrosas
const need = new Set();
for (const b of beats) {
  if (b.kind !== "focuscards") continue;
  for (const it of b.items || []) if (it && it.image) need.add(it.image);
}
// + todas las fotos hero del slug, por si otro beat de focuscards se agrega después
for (const f of fs.readdirSync("public/img")) {
  if (f.startsWith(`p_${SLUG}_`) && /\.(png|jpg|jpeg|webp)$/i.test(f) && !f.includes("_blur")) need.add(`img/${f}`);
}

let n = 0, ya = 0;
for (const rel of need) {
  const src = `public/${rel}`;
  const dst = `public/${rel.replace(/\.(png|jpg|jpeg|webp)$/i, "_blur.jpg")}`;
  if (!fs.existsSync(src)) { console.warn(`  ⚠ no existe el original: ${rel}`); continue; }
  if (fs.existsSync(dst)) { ya++; continue; }
  try {
    execFileSync("ffmpeg", ["-y", "-i", src, "-vf", "gblur=sigma=22", "-q:v", "6", dst], { stdio: "ignore" });
    if (fs.statSync(dst).size < 1024) { fs.rmSync(dst, { force: true }); console.warn(`  ⚠ salió vacío: ${dst}`); continue; }
    n++;
  } catch { console.warn(`  ⚠ falló: ${rel}`); }
}
console.log(`preblur: ${n} generadas · ${ya} ya estaban`);

// verificación dura: NINGUNA imagen de focuscards puede quedar sin su _blur
const faltan = [];
for (const b of beats) {
  if (b.kind !== "focuscards") continue;
  for (const it of b.items || []) {
    if (!it || !it.image) continue;
    const d = `public/${it.image.replace(/\.(png|jpg|jpeg|webp)$/i, "_blur.jpg")}`;
    if (!fs.existsSync(d)) faltan.push(d);
  }
}
if (faltan.length) { console.error("⛔ faltan blur de FocusCards:", faltan); process.exit(1); }
console.log("✓ todas las imágenes de FocusCards tienen su _blur.jpg");
