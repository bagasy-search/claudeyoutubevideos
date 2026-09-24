// Arma @_fcsaguapiel_assets.txt = TODO lo que el beatsheet cita + sus hermanos _blur.jpg.
import fs from "fs";
const SLUG = "fcsaguapiel";
const bs = JSON.parse(fs.readFileSync(`beatsheet/${SLUG}.json`, "utf8"));
const need = new Set();
for (const b of bs.beats) {
  for (const k of ["src", "image", "cover", "qr", "leftImage", "rightImage", "leftImg", "rightImg"]) if (b[k]) need.add(b[k]);
  for (const s of b.slides || []) if (s.image) need.add(s.image);
  // arrays de items con foto: items[] (carrusel/ingredients), steps[] (recetaescena/process), marks[] (lineatiempo)
  for (const key of ["items", "steps", "marks"])
    for (const it of b[key] || []) if (it && typeof it === "object" && it.image) need.add(it.image);
}
const out = new Set();
const falta = [];
for (const p of need) {
  if (!fs.existsSync("public/" + p)) { falta.push(p); continue; }
  out.add(p);
  if (/\.(png|jpe?g)$/i.test(p) && !/_blur\.jpg$/i.test(p)) {
    const bl = p.replace(/\.(png|jpe?g)$/i, "_blur.jpg");
    if (fs.existsSync("public/" + bl)) out.add(bl);
    else falta.push(bl + "  (BLUR — corré node preblur.mjs)");
  }
}
fs.writeFileSync(`_${SLUG}_assets.txt`, [...out].sort().join("\n") + "\n");
console.log(`assets: ${out.size} en la lista · FALTAN ${falta.length}`);
if (falta.length) console.log("  " + falta.slice(0, 12).join("\n  "));
