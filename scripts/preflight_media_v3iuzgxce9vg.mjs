// preflight_media_v3iuzgxce9vg.mjs — COMPUERTA barata contra el fallo más caro del pipeline:
// un componente al que le falta un campo de medio y hace staticFile(undefined) → "undefined was
// passed to staticFile()" → el chunk MUERE a mitad del render. En la 1ª corrida tiró 5 de 20 chunks
// (~15 min de farm) por 5 beats de blurexplainer sin `clip`.
//
// Chequea, para cada kind que usamos, que estén TODOS los campos de medio que su componente
// pasa a staticFile()/Media, y que cada ruta exista en disco.
import fs from "fs";

const SLUG = "v3iuzgxce9vg";
const rd = (p) => { const s = fs.readFileSync(p, "utf8"); return JSON.parse(s.slice(s.indexOf("= [") + 2, s.lastIndexOf("]") + 1)); };
const BEATS = rd(`src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`);
const BROLL = rd(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`);

// campos de medio OBLIGATORIOS por kind (mirados en el componente que los renderiza)
const REQ = {
  raw: ["src"],
  quote: ["image"], chips: ["image"], callout: ["image"], annotated: ["image"],
  freezezoom: ["image"], nametag: ["image"],
  blurexplainer: ["image", "clip"],          // Media(clip) + Img(image) — los DOS
};
// arrays cuyos elementos llevan imagen obligatoria
const REQ_ARR = { process: ["steps", "image"], ingredients: ["items", "image"],
  diagram: ["slides", "image"], focuscards: ["items", "image"] };

const fallos = [];
const rutas = new Set();
const reg = (p, quien) => { if (typeof p === "string" && /^(img|broll|vid)\//.test(p)) rutas.add(p); else fallos.push(`${quien}: ruta inválida (${JSON.stringify(p)})`); };

for (const b of BEATS) {
  for (const f of REQ[b.kind] || []) {
    if (!b[f]) fallos.push(`${b.id} (${b.kind}) @${b.start}s: falta "${f}" → staticFile(undefined) mata el chunk`);
    else reg(b[f], `${b.id}.${f}`);
  }
  const ra = REQ_ARR[b.kind];
  if (ra) {
    const [campo, sub] = ra;
    (b[campo] || []).forEach((it, i) => {
      if (!it[sub]) fallos.push(`${b.id} (${b.kind}) @${b.start}s: ${campo}[${i}] sin "${sub}"`);
      else reg(it[sub], `${b.id}.${campo}[${i}]`);
    });
  }
  // cualquier otro campo que parezca una ruta
  for (const [k, v] of Object.entries(b)) if (typeof v === "string" && /^(img|broll|vid)\//.test(v)) rutas.add(v);
  // focuscards además usa el _blur.jpg derivado
  if (b.kind === "focuscards") for (const it of b.items || []) if (it.image) rutas.add(it.image.replace(/\.(png|jpg|jpeg|webp)$/i, "_blur.jpg"));
}
for (const c of BROLL) reg(c.src, c.name);

const enDisco = [...rutas].filter((p) => !fs.existsSync("public/" + p));
for (const p of enDisco) fallos.push(`asset faltante en disco: public/${p}`);

console.log(`preflight de medios · ${BEATS.length} beats · ${rutas.size} rutas`);
if (fallos.length) {
  console.error(`\n✗ ${fallos.length} PROBLEMA(S) — el render moriría:\n`);
  for (const f of fallos.slice(0, 30)) console.error("  ·", f);
  process.exit(1);
}
console.log("✓ ningún componente se queda sin su medio y todas las rutas existen — podés rendear.");
