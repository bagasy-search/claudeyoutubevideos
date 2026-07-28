// Parte las captions de palabras en FRASES con ms exactos, y las reparte en N rangos
// para los subagentes directores. Uso: node scripts/phrases_vsdjytp30ogs.mjs [N]
import fs from 'node:fs';

const SLUG = 'vsdjytp30ogs';
const N = Number(process.argv[2] || 7);

const words = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, 'utf8'));

// agrupar en frases: cortamos en . ? ! y también en , cuando la frase ya es larga
const phrases = [];
let cur = null;
for (const w of words) {
  const t = (w.text || '').trim();
  if (!t) continue;
  if (!cur) cur = {startMs: w.startMs, endMs: w.endMs, text: t};
  else {
    cur.text += ' ' + t;
    cur.endMs = w.endMs;
  }
  const hardEnd = /[.?!:]$/.test(t);
  const softEnd = /[,;]$/.test(t) && cur.text.length > 70;
  if (hardEnd || softEnd) {
    phrases.push(cur);
    cur = null;
  }
}
if (cur) phrases.push(cur);

const totalMs = words[words.length - 1].endMs;
fs.writeFileSync(`public/phrases_${SLUG}.json`, JSON.stringify(phrases, null, 0));

// repartir por rangos de tiempo iguales
const seg = totalMs / N;
const ranges = [];
for (let i = 0; i < N; i++) {
  const a = Math.round(i * seg);
  const b = i === N - 1 ? totalMs : Math.round((i + 1) * seg);
  const mine = phrases.filter((p) => p.startMs >= a && p.startMs < b);
  const lines = mine
    .map((p) => `[${(p.startMs / 1000).toFixed(2)}s → ${(p.endMs / 1000).toFixed(2)}s] ${p.text}`)
    .join('\n');
  const f = `_dir_${SLUG}_${i}.txt`;
  fs.writeFileSync(f, lines, 'utf8');
  ranges.push({i, aSec: +(a / 1000).toFixed(2), bSec: +(b / 1000).toFixed(2), frases: mine.length, file: f});
}

console.log(`total ${(totalMs / 1000).toFixed(1)}s · ${phrases.length} frases`);
console.table(ranges);
