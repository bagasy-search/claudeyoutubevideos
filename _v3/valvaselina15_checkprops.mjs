// COMPUERTA DE CONTRATOS: cada prop que emite el build tiene que estar REENVIADA por el Main (clon de _check_props_vn).
import fs from 'node:fs';
const src = fs.readFileSync('src/vvs/cues_valvaselina15.gen.ts', 'utf8');
const BEATS = JSON.parse(src.slice(src.indexOf('BEATS: any[] = ') + 15, src.lastIndexOf(';')));
const main = fs.readFileSync('src/vvs/Main_valvaselina15.tsx', 'utf8');
const IGN = new Set(['id', 'start', 'dur', 'kind', 'seed', 'real', 'gen', 'still', 'part', 'page', 'aq', 'group']);
const faltan = new Set();
for (const b of BEATS) for (const k of Object.keys(b)) if (!IGN.has(k) && !main.includes('cue.' + k)) faltan.add(b.kind + '.' + k);
let mal = 0;
for (const b of BEATS) {
  if (b.kind === 'checklist' && !b.items.every((i) => typeof i === 'string')) { console.log('⛔ items', b.id); mal++; }
  if (b.hot && b.title && !b.hot.every((h) => b.title.includes(h))) { console.log('⚠ hot fuera de title', b.id, b.hot); mal++; }
  for (const it of b.items || []) if (typeof it === 'object') for (const k of ['label', 'img']) if (!it[k]) { console.log('⛔ item sin', k, b.id); mal++; }
  if (b.kind === 'routineswap' && b.mode === 'new') for (const it of b.items) if (!it.newLabel || !it.newImg || it.flipAt == null) { console.log('⛔ swap new incompleto', b.id); mal++; }
  if (b.kind === 'redflags') for (const f of b.flags) if (!f.text || f.at == null) { console.log('⛔ flag', b.id); mal++; }
  if (b.kind === 'selfcheck') for (const q of b.questions) if (!q.text || !q.img || q.at == null) { console.log('⛔ q', b.id); mal++; }
  for (const c of b.cards || []) if (!c.image || !c.name) { console.log('⛔ card', b.id); mal++; }
}
const refs = new Set(); const walk = (o) => { if (typeof o === 'string' && /\.(jpg|png|mp4|mp3|m4a|wav)$/.test(o)) refs.add(o); else if (o && typeof o === 'object') Object.values(o).forEach(walk); };
walk(BEATS); walk(JSON.parse(src.slice(src.indexOf('SFX: any[] = ') + 13, src.indexOf(';\n', src.indexOf('SFX: any[] = ')))));
const miss = [...refs].filter((r) => !fs.existsSync('public/' + r));
const list = new Set(fs.readFileSync('_valvaselina15_assets.txt', 'utf8').split('\n').filter(Boolean));
const noList = [...refs].filter((r) => !list.has(r));
console.log(`props no reenviadas: ${faltan.size ? [...faltan].join(', ') : 'ninguna'} · formas mal ${mal} · rutas ${refs.size} · faltan en disco ${miss.length} ${miss.slice(0, 5).join(' ')} · fuera de la lista de assets ${noList.length} ${noList.slice(0, 5).join(' ')}`);
process.exitCode = faltan.size || mal || miss.length || noList.length ? 1 : 0;
