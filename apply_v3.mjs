// apply_v3.mjs — aplica el proceso v3 al set de clips según verdicts_<slug>.json:
//   · keep-clean            → se queda tal cual
//   · texto en BORDE/esquina→ CROP in-place (recorta la franja, salva el clip). Backup en _orig/
//   · slide FULL de texto   → se saca (a _rejected/): no salvable
//   · off-topic (fútbol...) → se saca (a _rejected/): el crop no sirve
// Preserva máxima variedad (solo saca lo insalvable) y limpia el resto con crop.
//   node apply_v3.mjs <slug> [--dir public/broll]
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const slug = process.argv[2] || "artefactos";
const di = process.argv.indexOf("--dir");
const DIR = di > 0 ? process.argv[di + 1] : "public/broll";
const verd = JSON.parse(fs.readFileSync(`${DIR}/verdicts_${slug}.json`, "utf8"));
const ORIG = path.join(DIR, "_orig"), REJ = path.join(DIR, "_rejected");
fs.mkdirSync(ORIG, { recursive: true }); fs.mkdirSync(REJ, { recursive: true });
const ff = (a) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...a], { timeout: 120000 });

const BAND = ["bottom", "top", "corner"];
let cropped = 0, removed = 0, kept = 0;
const log = { crop: [], rm: [] };
for (const v of verd) {
  const f = path.join(DIR, v.name + ".mp4");
  if (!fs.existsSync(f)) continue;
  if (v.keep) { kept++; continue; }                       // clean → nada
  // OFF-TOPIC (fútbol/cartoons/ads) → afuera SIEMPRE (el crop no salva lo ajeno)
  if (v.on_topic === false) { fs.renameSync(f, path.join(REJ, v.name + ".mp4")); removed++; log.rm.push(v.name + "[off-topic]"); continue; }
  // ON-TOPIC con texto en BORDE → crop. ON-TOPIC full-slide → se QUEDA (variedad, criterio AS-IS)
  const band = v.has_text && BAND.includes(v.loc);
  if (band) {
    // CROP in-place: backup original, recorta franja/esquina, reescala a 1080p
    if (!fs.existsSync(path.join(ORIG, v.name + ".mp4"))) fs.copyFileSync(f, path.join(ORIG, v.name + ".mp4"));
    const tmp = f + ".crop.mp4";
    ff(["-i", f, "-vf", "crop=iw*0.88:ih*0.80:iw*0.06:0,scale=1920:1080", "-c:a", "copy", tmp]);
    fs.renameSync(tmp, f);
    cropped++; log.crop.push(v.name + "(" + v.loc + ")");
  } else {
    // full-slide ON-TOPIC → se QUEDA tal cual (criterio AS-IS: variedad > sacar texto).
    // Reversible: si molesta, se mueven a _rejected después.
    kept++;
  }
}
console.log(`v3 aplicado: ${kept} clean · ${cropped} CROP in-place · ${removed} removidos`);
console.log("CROP:", log.crop.join(" ") || "—");
console.log("REMOVED:", log.rm.join(" ") || "—");
console.log("→ ahora: node build_dense.mjs " + slug + " && node beatsheet.mjs beatsheet/" + slug + ".json");
