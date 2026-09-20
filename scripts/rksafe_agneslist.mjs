// scripts/rksafe_agneslist.mjs <slug> [cuantos=90] — arma la lista de agnes i2v del canal Ray Kessler.
//   node scripts/rksafe_agneslist.mjs rkknock 90   →  _v3/<slug>_agneslist.json
//
// ⛔ SÓLO PLANOS SIN PRESENTADOR. Medido en el canal: los `c:1` se rechazan el DOBLE (agnes le
//    deforma la cara al hombre de la referencia), y una cara mal animada en un canal cuya identidad
//    ES el presentador cuesta más de lo que aporta el movimiento.
// ⛔ EL `motion` VA EN VOZ DE OBJETO. Con agencia humana (`his hand writes`, `he keeps talking`)
//    sobre una foto donde NO se ve una cara, agnes dibuja una persona ENTERA — y como i2v no recibe
//    la referencia de identidad, inventa a cualquiera. Medido en otro canal: 69 de 117 planos con un
//    señor desconocido. El `mo` del pool ya está escrito así y acá se vuelve a verificar.
// ⛔ La cláusula `change` declara la escena VACÍA y explícitamente sin gente: es lo que bajó de 69
//    a 16 los planos poblados.
import fs from 'node:fs';
import path from 'node:path';

const SLUG = process.argv[2];
const CUANTOS = +(process.argv[3] || 90);
if (!SLUG) { console.error('uso: node scripts/rksafe_agneslist.mjs <slug> [cuantos]'); process.exit(1); }
const { ITEMS } = await import('file:///' + path.resolve(process.cwd(), `_v3/${SLUG}_prompts.mjs`).replace(/\\/g, '/'));

const VACIA = 'The scene stays exactly as it is and it is UNOCCUPIED: there is nobody in the frame, no person '
  + 'appears at any moment, nobody walks in, nobody sits down, no face and no body become visible. Only the '
  + 'objects already in the picture move. No cut, no new place, no camera move.';

const AGENCIA = /\b(he|his|she|her|somebody|someone|a man|a person|a woman)\b/i;

const cand = [];
let sinFoto = 0, conPres = 0, conAgencia = 0;
for (const it of ITEMS) {
  const nombre = `${SLUG}_${it.id}`;
  if (it.c) { conPres++; continue; }
  if (!fs.existsSync(`public/img/${nombre}.jpg`)) { sinFoto++; continue; }
  if (AGENCIA.test(it.mo || '')) { conAgencia++; continue; }
  cand.push({ nombre, motion: it.mo, change: VACIA, gente: false, sec: it.sec });
}

// repartido por sección, para que el movimiento no se concentre en un tramo
const porSec = {};
for (const c of cand) (porSec[c.sec] ||= []).push(c);
const orden = [];
let quedan = true;
for (let i = 0; quedan; i++) {
  quedan = false;
  for (const k of Object.keys(porSec).sort()) {
    if (porSec[k][i]) { orden.push(porSec[k][i]); quedan = true; }
  }
}
const lista = orden.slice(0, CUANTOS).map(({ sec, ...r }) => r);
fs.writeFileSync(`_v3/${SLUG}_agneslist.json`, JSON.stringify(lista, null, 1));

console.log('═'.repeat(70));
console.log(`MEDIDO sobre ${ITEMS.length} planos del pool:`);
console.log(`   ${conPres} descartados por llevar al presentador (se rechazan el doble)`);
console.log(`   ${sinFoto} descartados por no tener foto en public/img/`);
console.log(`   ${conAgencia} descartados por \`mo\` con agencia humana`);
console.log(`   ${cand.length} candidatos → se animan ${lista.length} (${(lista.length / ITEMS.length * 100).toFixed(0)} % del pool)`);
console.log(`   → _v3/${SLUG}_agneslist.json`);
console.log(`   node scripts/agnes_i2v.mjs _v3/${SLUG}_agneslist.json ${SLUG} public/img public/broll/${SLUG}`);
console.log('═'.repeat(70));
