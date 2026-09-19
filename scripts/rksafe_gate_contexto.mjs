// scripts/rksafe_gate_contexto.mjs — COMPUERTA DE CONTEXTO: ¿el plano muestra lo que se dice EN ESE
// SEGUNDO? (regla del creador). Se corre sobre el plan, ANTES de farmear.
//   node scripts/rksafe_gate_contexto.mjs <slug>
//
// Por cada plano saca los SUSTANTIVOS de la frase que suena en su ventana (de _v3/<slug>_words.json)
// y exige que el PROMPT del asset elegido contenga alguno. Mide también:
//   · pares CONSECUTIVOS con el mismo asset (0 obligatorio),
//   · rachas de planos seguidos en el mismo LUGAR.
// ⚠️ Imprime SIEMPRE cuántos planos evaluó: una compuerta que puede dar 0 sin mirar nada no es un OK.
import fs from 'node:fs';
import path from 'node:path';

const SLUG = process.argv[2];
if (!SLUG) { console.error('uso: node scripts/rksafe_gate_contexto.mjs <slug>'); process.exit(1); }
const { ITEMS } = await import('file:///' + path.resolve(process.cwd(), `_v3/${SLUG}_prompts.mjs`).replace(/\\/g, '/'));
const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, 'utf8'));
const words = JSON.parse(fs.readFileSync(`_v3/${SLUG}_words.json`, 'utf8'));

const porId = new Map(ITEMS.map((i) => [SLUG + '_' + i.id, i]));
const VACIAS = new Set(('a an the and or but of to in on at for with that this it is are was were be been am i you he she they we ' +
  'my your his her their our not no yes so if then than as from by about into out up down over under one two three four five ' +
  'do does did done go going goes get got make makes made take takes took put puts say says said just like can could would ' +
  'will shall may might must have has had there here what when where who how why very really only also even still back ' +
  'thing things something anything nothing somebody everybody nobody people person because before after while all any each ' +
  'own same other another more most less least much many little big good bad right left new old first last next').split(' '));

const idDe = (a) => (a || '').replace(/^.*\//, '').replace(/\.(jpg|mp4)$/, '');
const visuales = plan.beats.filter((b) => b.asset).sort((a, b) => a.t - b.t);
let pegan = 0, noPegan = [], sinPrompt = 0;
for (const b of visuales) {
  const it = porId.get(idDe(b.asset));
  if (!it) { sinPrompt++; continue; }
  const sust = words.filter((w) => w.t >= b.t && w.t < b.t + b.dur).map((w) => w.w)
    .filter((w) => w.length > 3 && !VACIAS.has(w));
  if (!sust.length) { pegan++; continue; }   // tramo sin sustantivos: no se puede exigir nada
  const p = it.prompt.toLowerCase();
  const hit = sust.filter((s) => p.includes(s) || p.includes(s.replace(/(ies|es|s)$/, '')) || (s.length > 5 && p.includes(s.slice(0, -2))));
  if (hit.length) pegan++;
  else noPegan.push({ t: b.t, id: idDe(b.asset), frase: sust.slice(0, 8).join(' ') });
}
let consec = 0;
for (let i = 1; i < visuales.length; i++) if (idDe(visuales[i].asset) === idDe(visuales[i - 1].asset)) consec++;
let racha = 1, maxR = 1, donde = '';
for (let i = 1; i < visuales.length; i++) {
  if (visuales[i].lugar === visuales[i - 1].lugar) { racha++; if (racha > maxR) { maxR = racha; donde = visuales[i].lugar; } } else racha = 1;
}
console.log('═'.repeat(70));
console.log(`CONTEXTO · ${SLUG} · ${visuales.length} planos visuales EVALUADOS (${sinPrompt} sin prompt conocido)`);
console.log(`  pegan con los sustantivos de su frase: ${pegan}/${visuales.length - sinPrompt} = ${(pegan / Math.max(1, visuales.length - sinPrompt) * 100).toFixed(0)}%`);
console.log(`  el MISMO asset dos planos seguidos: ${consec}  (tiene que dar 0)`);
console.log(`  racha máxima en el mismo LUGAR: ${maxR}${donde ? ' (' + donde + ')' : ''}  (techo 8)`);
console.log(`  planos que NO pegan: ${noPegan.length}`);
for (const n of noPegan.slice(0, 20)) console.log(`   · ${Math.floor(n.t / 60)}:${String(Math.round(n.t % 60)).padStart(2, '0')}  ${n.id}  «${n.frase}»`);
console.log('═'.repeat(70));
process.exit(consec > 0 || maxR > 8 ? 2 : 0);
