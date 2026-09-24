// COMPUERTA DE CONTRATOS: cada prop que emite el build tiene que estar REENVIADA por el Main.
// (gotcha del pipeline: la prop existe en el beat, el Main no la pasa, el componente usa su
//  DEFAULT — texto de otro video/idioma o una imagen que no existe → chunk muerto o cartel vacío)
import fs from 'node:fs';

const src = fs.readFileSync('src/valeria/cues_valerianariz.gen.ts', 'utf8');
const BEATS = JSON.parse(src.slice(src.indexOf('BEATS: Cue[] = ') + 15, src.lastIndexOf(';')));
const main = fs.readFileSync('src/valeria/Main_valerianariz.tsx', 'utf8');

const IGNORAR = new Set(['id', 'start', 'dur', 'kind', 'video', 'noSplit']);
const faltan = new Set();
for (const b of BEATS) {
  for (const k of Object.keys(b)) {
    if (IGNORAR.has(k)) continue;
    if (!main.includes('cue.' + k)) faltan.add(b.kind + '.' + k);
  }
}
console.log('props NO reenviadas por el Main:', faltan.size ? [...faltan].join(', ') : 'ninguna ✔');

// formas que el kit realmente lee
let mal = 0;
for (const b of BEATS) {
  if (b.items && !b.items.every((i) => typeof i === 'string')) { console.log('⛔ items mal:', b.id); mal++; }
  if (b.nodes && !b.nodes.every((n) => n && typeof n.label === 'string')) { console.log('⛔ nodes mal:', b.id); mal++; }
  if (b.hot && b.title && !b.hot.every((h) => b.title.includes(h))) { console.log('⚠ hot fuera de title:', b.id, JSON.stringify(b.hot)); mal++; }
}
console.log('formas incorrectas:', mal);

// toda ruta citada existe en disco
const miss = [];
for (const b of BEATS) for (const k of ['src', 'image', 'imageA', 'imageB']) {
  if (typeof b[k] === 'string' && !/^https?:/.test(b[k]) && !fs.existsSync('public/' + b[k])) miss.push(b.id + ' -> ' + b[k]);
}
console.log('assets faltantes en disco:', miss.length ? miss.slice(0, 8).join(' | ') : 'ninguno ✔');


// ⛔ props con DEFAULT del video de romero: si no se pasan, el kit escribe texto de OTRO video
const OBLIGATORIAS = {
  chapter: ['kicker', 'index', 'title'],
  hero: ['kicker', 'title', 'image'],
  stat: ['kicker', 'label', 'image', 'suffix'],
  quote: ['kicker', 'quote', 'author', 'role'],
  molecule: ['kicker', 'title', 'centerLabel', 'image', 'nodes'],
  step: ['title', 'image'],
  beforeafter: ['kicker', 'title', 'labelA', 'labelB', 'imageA', 'imageB'],
  checklist: ['kicker', 'title', 'items'],
  cta: ['kicker', 'title', 'sub', 'buttonLabel', 'image'],
  lowerthird: ['name', 'role', 'topic'],
};
let defaults = 0;
for (const b of BEATS) {
  const req = OBLIGATORIAS[b.kind];
  if (!req) continue;
  for (const k of req) if (b[k] === undefined) { console.log('⛔ DEFAULT del kit:', b.id, b.kind + '.' + k); defaults++; }
}
console.log('props que caerian al default:', defaults);

const kinds = {};
for (const b of BEATS) kinds[b.kind] = (kinds[b.kind] || 0) + 1;
console.log('beats:', BEATS.length, JSON.stringify(kinds));
process.exit(faltan.size || mal || miss.length || defaults ? 1 : 0);
