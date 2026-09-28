// scripts/rksafe_gate_prompts.mjs <slug> — COMPUERTA sobre el POOL DEL DIRECTOR, antes de gastar un centavo.
//   node scripts/rksafe_gate_prompts.mjs <slug>
//
// ⛔ IMPRIME SIEMPRE CUÁNTO MIDIÓ. Una compuerta que puede dar 0 por no encontrar nada tiene que
//    decir sobre cuántos elementos trabajó; si el número sale sospechosamente redondo, el roto es
//    el MEDIDOR, no el material (ya pasó dos veces el mismo día).
//
// La vara (cross-nicho, medida sobre ~900 prompts de videos entregados):
//   presentador en cuadro ≥55 % · de ésos, con la EMOCIÓN de la cara nombrada ≥90 %
//   plano cerrado ≤20 % · medio ≥50 % · abierto ≥25 % · objetos de entorno: mediana ≥5
//   0 tokens prohibidos · 0 `mo` con agencia humana · ninguna racha de LUGAR >8
import path from 'node:path';

const SLUG = process.argv[2];
if (!SLUG) { console.error('uso: node scripts/rksafe_gate_prompts.mjs <slug>'); process.exit(1); }
const { ITEMS } = await import('file:///' + path.resolve(process.cwd(), `_v3/${SLUG}_prompts.mjs`).replace(/\\/g, '/'));

// ⛔ `nothing blurred out` es parte de la fórmula CORRECTA: hay que sacarlo antes de buscar `blur`.
const PROHIBIDOS = /\b(cinematic|35\s?mm|bokeh|8k|highly detailed|grainy|muted colou?rs?|low saturation|soft muted|nothing polished|out of focus|blurr?y|soft focus|shallow depth of field|subject isolation|stock photo|golden hour|photorealistic)\b/i;
// ⛔ sin `\b` FINAL: con él, `smiling`, `looking` y `raised` NO matchean y el medidor miente.
const EMOCION = /\b(eyebrow|brow|mouth|smil|frown|jaw|eye|look|grin|laugh|scowl|lip|nod|amused|tired|expression|chin|cheek|teeth|tongue|narrow|raise|purse|shrug|squint|unimpressed|serious|wry|earnest|sheepish|conviction|resign|scept|warm|proud|curious|deadpan|content)/i;
// ⛔ el medidor viejo no conocía variantes en singular y marcaba planos que SÍ traen la cláusula.
const ENV = /(Around (them|it|him|her|his hands?|the work|the [a-z ]+)|Between them|On (and around )?the (bench|table|mat|step|counter)|Below them|Behind (him|it|the [a-z]+)|In the (hall|garage|van|room|kitchen)|Along it|The (garage|room|hall|hallway|kitchen|street|bench) (has|holds)|Inside the van|The yard has|The hallway has)/;

// ⛔ EL MEDIDOR MINTIÓ UNA VEZ ACÁ: sólo conocía la forma "Around it: ..." y marcaba como "sin
//    entorno" 29 prompts que enumeran su entorno después de DOS PUNTOS ("photographed from waist
//    height: a scuffed white door, a worn mat, ..."). Se acepta cualquiera de las dos listas.
const objsDe = (s) => {
  const m = s.match(ENV);
  const i1 = m ? s.indexOf(m[0]) + m[0].length : -1;
  const i2 = s.indexOf(':');
  const start = Math.max(i1, i2);
  if (start < 0) return -1;
  const cola = s.slice(start);
  return (cola.match(/,\s*(a|an|two|three|four|five|six|thirty|the)\s+[a-z]/gi) || []).length + 1;
};

const fallas = [];
const vistos = new Set();
for (const it of ITEMS) {
  if (vistos.has(it.id)) fallas.push(`${it.id}: id DUPLICADO`);
  vistos.add(it.id);
  if (!it.prompt || it.prompt.length < 220) fallas.push(`${it.id}: prompt demasiado corto (${(it.prompt || '').length})`);
  const limpio = String(it.prompt).replace(/nothing blurred out/gi, '');
  if (PROHIBIDOS.test(limpio)) fallas.push(`${it.id}: token PROHIBIDO → ${limpio.match(PROHIBIDOS)[0]}`);
  if (!['wide', 'medium', 'close'].includes(it.enc)) fallas.push(`${it.id}: encuadre inválido → ${it.enc}`);
  if (it.c && !EMOCION.test(it.prompt)) fallas.push(`${it.id}: presentador SIN emoción nombrada`);
  if (!it.mo) fallas.push(`${it.id}: sin movimiento \`mo\` (toda foto que se monte va animada)`);
  // ⛔ AGENCIA HUMANA en el `mo` de un plano SIN cara: agnes dibuja una persona entera que no existe
  //    (medido en pinvacas: 69 de 117 planos con un señor desconocido). Voz de OBJETO.
  // ⛔ `they`/`their` daban FALSOS sobre objetos: "the coats sway on their hooks", "the tracks stay
  //    where they are". Lo que de verdad hace que agnes dibuje una persona entera es la tercera
  //    persona del SINGULAR y los sintagmas explícitos.
  if (it.mo && !it.c && /\b(he|his|she|her|somebody|someone|a man|a person|a woman)\b/i.test(it.mo))
    fallas.push(`${it.id}: \`mo\` con AGENCIA HUMANA en un plano sin presentador → «${it.mo}»`);
  if (!it.sec) fallas.push(`${it.id}: sin sección`);
  if (!it.lugar) fallas.push(`${it.id}: sin lugar (la racha no se puede medir)`);
}

const n = ITEMS.length;
const cN = ITEMS.filter((i) => i.c).length;
const cEmo = ITEMS.filter((i) => i.c && EMOCION.test(i.prompt)).length;
const enc = { wide: 0, medium: 0, close: 0 };
for (const i of ITEMS) if (enc[i.enc] !== undefined) enc[i.enc]++;
const objs = ITEMS.map((it) => objsDe(it.prompt));
const sinEnv = ITEMS.filter((_, i) => objs[i] < 0).map((it) => it.id);
const ok = objs.filter((x) => x >= 0).sort((a, b) => a - b);
const medObj = ok.length ? ok[Math.floor(ok.length / 2)] : 0;
const largos = ITEMS.map((i) => i.prompt.length).sort((a, b) => a - b);

let rmax = 0, r = 1, rl = '';
for (let i = 1; i < n; i++) {
  if (ITEMS[i].lugar === ITEMS[i - 1].lugar) { r++; if (r > rmax) { rmax = r; rl = ITEMS[i].lugar; } } else r = 1;
}
const lugares = {};
for (const i of ITEMS) lugares[i.lugar] = (lugares[i.lugar] || 0) + 1;

const pc = (x) => (x / n * 100).toFixed(1) + '%';
const linea = (etq, val, ok2) => console.log('  ' + (ok2 ? '✓' : '⛔') + ' ' + etq.padEnd(42) + val);

console.log('═'.repeat(74));
console.log(`MEDIDO SOBRE ${n} PLANOS del pool de ${SLUG} (largo de prompt: min ${largos[0]} · mediana ${largos[Math.floor(n / 2)]} · max ${largos[n - 1]})`);
linea('presentador en cuadro (vara ≥55 %)', `${cN} = ${pc(cN)}`, cN / n >= 0.55);
linea('  de ésos, con emoción nombrada (≥90 %)', `${cEmo}/${cN} = ${cN ? (cEmo / cN * 100).toFixed(1) + '%' : '—'}`, cN === 0 || cEmo / cN >= 0.90);
linea('plano CERRADO (≤20 %)', `${enc.close} = ${pc(enc.close)}`, enc.close / n <= 0.20);
linea('plano MEDIO (≥50 %)', `${enc.medium} = ${pc(enc.medium)}`, enc.medium / n >= 0.50);
linea('plano ABIERTO (≥25 %)', `${enc.wide} = ${pc(enc.wide)}`, enc.wide / n >= 0.25);
linea('objetos de entorno, MEDIANA (≥5)', `${medObj}  · midió ${ok.length} de ${n} prompts`, medObj >= 5 && sinEnv.length === 0);
if (sinEnv.length) console.log('      sin cláusula de entorno reconocida: ' + sinEnv.slice(0, 12).join(' ') + (sinEnv.length > 12 ? ' …' : ''));
linea('racha máxima en el mismo LUGAR (≤8)', `${rmax || 1}${rl ? ' (' + rl + ')' : ''}`, (rmax || 1) <= 8);
console.log('  lugares: ' + Object.entries(lugares).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · '));
linea('fallas duras', String(fallas.length), fallas.length === 0);
for (const f of fallas.slice(0, 25)) console.log('      ⛔ ' + f);
if (fallas.length > 25) console.log('      … y ' + (fallas.length - 25) + ' más');
console.log('═'.repeat(74));

const duro = fallas.length > 0 || cN / n < 0.55 || (cN && cEmo / cN < 0.90) || enc.close / n > 0.20
  || enc.medium / n < 0.50 || enc.wide / n < 0.25 || medObj < 5 || sinEnv.length > 0 || (rmax || 1) > 8;
process.exit(duro ? 1 : 0);
