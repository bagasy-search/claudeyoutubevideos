// assets_vxsag2ipph2js.mjs — arma _vxsag2ipph2js_assets.txt escaneando el cues generado.
// Rutas RELATIVAS a public/ (farm.mjs NO strippea el prefijo public/).
import fs from "node:fs";

const SLUG = "vxsag2ipph2js";
const cues = fs.readFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`, "utf8");
const set = new Set();

// refs explicitas del cues
for (const m of cues.matchAll(/"((?:img|broll|vid)\/[^"]+\.(?:png|jpg|jpeg|webp|mp4))"/g)) set.add(m[1]);
// _blur.jpg que ImageBackdrop DERIVA en runtime (no aparece en el cues → 404 y se caen los chunks)
for (const r of [...set]) if (r.startsWith("img/")) {
  const blur = r.replace(/\.(png|jpg|jpeg|webp)$/, "_blur.jpg");
  if (fs.existsSync(`public/${blur}`)) set.add(blur);
}
// avatar + wav
set.add(`${SLUG}_opt.mp4`);
if (fs.existsSync(`public/${SLUG}.wav`)) set.add(`${SLUG}.wav`);

const missing = [...set].filter((r) => !fs.existsSync(`public/${r}`));
const list = [...set].filter((r) => fs.existsSync(`public/${r}`)).sort();
fs.writeFileSync(`_${SLUG}_assets.txt`, list.join("\n") + "\n");

let bytes = 0;
for (const r of list) bytes += fs.statSync(`public/${r}`).size;
console.log(`assets ${list.length} · ${(bytes / 1e6).toFixed(0)} MB`);
if (missing.length) {
  console.error(`✖ FALTAN EN DISCO ${missing.length} (van a dar 404 en el farm):`);
  for (const m of missing.slice(0, 25)) console.error("   " + m);
  process.exit(1);
}
