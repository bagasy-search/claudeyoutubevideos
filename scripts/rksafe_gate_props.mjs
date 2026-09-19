// scripts/rksafe_gate_props.mjs — 5ª FAMILIA: el componente se ve LLENO y está MAL.
//   node scripts/rksafe_gate_props.mjs <slug>
//
// Las otras familias crashean o vacían el componente y por eso se notan. Ésta no: renderiza su
// DEFAULT —texto de otro video, casi siempre en español— y pasa densidad, visión y tipos.
// Y la variante peor: los campos de los ELEMENTOS de un array (`items:[{t}]` donde el JSX lee
// `.text`) dibujan la tarjeta, el título y las viñetas… y adentro no hay NADA.
//
// Mide tres cosas y dice CUÁNTAS midió en cada una:
//  1. toda prop con DEFAULT de texto que el cue no pisa (y marca las que están en español),
//  2. todo campo que el JSX le pide a los ELEMENTOS de un array y el cue no trae,
//  3. toda prop REQUERIDA (sin `?` en la firma) que falta.
import fs from 'node:fs';
import path from 'node:path';

const SLUG = process.argv[2];
if (!SLUG) { console.error('uso: node scripts/rksafe_gate_props.mjs <slug>'); process.exit(1); }
const cfg = await import('file:///' + path.resolve(process.cwd(), `_v3/${SLUG}_cfg.mjs`).replace(/\\/g, '/'));
const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, 'utf8'));

const ES = /\b(el|la|los|las|de|del|que|para|con|una|un|más|cómo|qué|sí|no|tu|su|esto|esta|mito|verdad|paso|pasos|guardá|mirá|acá)\b/i;
const usos = plan.beats.filter((b) => b.kind === 'componente');
let problemas = [], nProps = 0, nArrays = 0, nReq = 0;

for (const comp of new Set(usos.map((u) => u.comp))) {
  const rel = cfg.IMPORTS[comp];
  const file = path.resolve('src/VideoEdit', rel + '.tsx');
  if (!fs.existsSync(file)) { problemas.push(`${comp}: no encuentro ${file}`); continue; }
  const src = fs.readFileSync(file, 'utf8');

  // firma: React.FC<{ ... }> = ({ ... }) => {
  const firma = (src.match(new RegExp(`export const ${comp}: React\\.FC<\\{([\\s\\S]*?)\\}>`)) || [])[1] || '';
  const requeridas = [...firma.matchAll(/^\s{2}([A-Za-z_][\w]*)(\??):/gm)].filter((m) => m[2] !== '?').map((m) => m[1]);
  const destr = (src.match(new RegExp(`export const ${comp}[\\s\\S]*?=\\s*\\(\\{([\\s\\S]*?)\\}\\)\\s*=>`)) || [])[1] || '';
  const defaults = [...destr.matchAll(/([A-Za-z_][\w]*)\s*=\s*("(?:[^"\\]|\\.)*"|\[[\s\S]*?\])/g)].map((m) => [m[1], m[2]]);
  // campos que el JSX le pide a los ELEMENTOS de cada array: `x.map((it) => … it.campo …)`
  const arrays = {};
  for (const m of src.matchAll(/([A-Za-z_][\w]*)\.map\(\s*\(?\s*([A-Za-z_][\w]*)/g)) {
    const campos = new Set([...src.matchAll(new RegExp(`\\b${m[2]}\\.([A-Za-z_][\\w]*)`, 'g'))].map((x) => x[1]));
    if (campos.size) arrays[m[1]] = [...campos];
  }

  for (const u of usos.filter((x) => x.comp === comp)) {
    const p = u.props || {};
    for (const [k, v] of defaults) {
      nProps++;
      // un default de ARRAY VACÍO no dibuja nada de otro video (ScrewHero.decoyImages): no es la 5ª familia
      const vacio = v.replace(/[\s\n]/g, "") === "[]";
      if (p[k] === undefined && k !== "bed" && k !== "durationInFrames" && !vacio) {
        problemas.push(`${comp}.${k} usa su DEFAULT ${v.slice(0, 48)}${ES.test(v) ? '  ⛔ ESTÁ EN ESPAÑOL' : ''}`);
      }
    }
    for (const r of requeridas) { nReq++; if (p[r] === undefined) problemas.push(`${comp}.${r} es REQUERIDA y el cue no la trae`); }
    for (const [arr, campos] of Object.entries(arrays)) {
      if (!Array.isArray(p[arr])) continue;
      for (const [i, el] of p[arr].entries()) {
        nArrays++;
        if (!campos.some((c) => el[c] !== undefined)) problemas.push(`${comp}.${arr}[${i}] no trae ninguno de ${campos.join('/')} → la tarjeta sale VACÍA`);
      }
    }
  }
}
const unicos = [...new Set(problemas)];
console.log('═'.repeat(70));
console.log(`GATE DE PROPS · ${SLUG} · ${usos.length} usos de ${new Set(usos.map((u) => u.comp)).size} componentes`);
console.log(`  defaults de texto evaluados: ${nProps} · props requeridas: ${nReq} · elementos de array: ${nArrays}`);
console.log(`  PROBLEMAS: ${unicos.length}`);
for (const p of unicos.slice(0, 25)) console.log('   ⛔ ' + p);
console.log('═'.repeat(70));
process.exit(unicos.length ? 2 : 0);
