// dense_replace.mjs — junta los veredictos del auditor (out/cs/bad_*.json),
// borra los clips MALOS y escribe un mapa de re-fetch {name: query} para que la
// cascada de stock (dedup global) traiga OTRO candidato distinto.
import fs from "fs";
const manifest = JSON.parse(fs.readFileSync("out/cs/manifest.json", "utf8"));
const byIdx = Object.fromEntries(manifest.map((m) => [m.idx, m]));
const stock = JSON.parse(fs.readFileSync("public/broll/stock_dense.json", "utf8"));

const bad = [];
for (const f of ["bad_A", "bad_B", "bad_C"]) {
  const p = `out/cs/${f}.json`;
  if (!fs.existsSync(p)) continue;
  try { JSON.parse(fs.readFileSync(p, "utf8")).forEach((x) => bad.push(x)); } catch {}
}
// queries que producen gráficos/animaciones/off-topic → reemplazar por footage REAL
const BADWORDS = /(animation|molecule|render|graphic|diagram|schematic|calendar|shield|abstract|neon|sparkle|planet|3d|logo|button|comments|number|text|propaganda|sign)/i;
const SAFE = [
  "fresh rosemary sprig macro", "elderly hands close up", "herbal oil dripping",
  "senior person calm portrait", "rosemary leaves detail", "hands massaging leg",
  "glass jar herbs kitchen", "old person walking outdoors", "wrinkled skin close up",
  "olive oil pouring bowl", "doctor talking patient clinic", "elderly knee closeup",
];
let si = 0;
const seen = new Set();
const refetch = {};
for (const b of bad) {
  const m = byIdx[b.idx]; if (!m || seen.has(m.name)) continue; seen.add(m.name);
  fs.rmSync(`public/broll/${m.name}.mp4`, { force: true });
  const q = stock[m.name];
  refetch[m.name] = BADWORDS.test(q) ? SAFE[si++ % SAFE.length] : q; // remap si la query da gráficos
}
fs.writeFileSync("public/broll/stock_refetch.json", JSON.stringify(refetch, null, 1));
console.log(`malos: ${bad.length} · a re-bajar: ${Object.keys(refetch).length}`);
console.log(Object.entries(refetch).slice(0, 12).map(([n, q]) => `${n}:${q}`).join(" | "));
