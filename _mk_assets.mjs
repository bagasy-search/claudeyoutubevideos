// _mk_assets.mjs — arma _fedcolageno_assets.txt para el farm: todo lo que referencia el beatsheet
// + los hermanos `_blur.jpg` de cada imagen (el pre-vuelo BLUER aborta si falta alguno).
import fs from "node:fs";
const SLUG = "fedcolageno";
const need = JSON.parse(fs.readFileSync(`_${SLUG}_need.json`, "utf8"));
const out = new Set();
const missing = [];
for (const p of need) {
  if (!fs.existsSync("public/" + p)) { missing.push(p); continue; }
  out.add(p);
  if (/\.(png|jpe?g)$/i.test(p)) {
    const blur = p.replace(/\.(png|jpe?g)$/i, "_blur.jpg");
    if (fs.existsSync("public/" + blur)) out.add(blur); else missing.push(blur);
  }
}
fs.writeFileSync(`_${SLUG}_assets.txt`, [...out].sort().join("\n") + "\n");
console.log(`assets ${out.size} -> _${SLUG}_assets.txt`);
if (missing.length) { console.log(`⚠ FALTAN ${missing.length}:`); console.log(missing.slice(0, 20).join("\n")); }
let bytes = 0; for (const p of out) bytes += fs.statSync("public/" + p).size;
for (const p of [`${SLUG}_opt.mp4`, `${SLUG}.wav`]) if (fs.existsSync("public/" + p)) bytes += fs.statSync("public/" + p).size;
console.log(`peso aproximado del tar: ${(bytes / 1e9).toFixed(2)} GB (tope 2 GB antes de partirse)`);
