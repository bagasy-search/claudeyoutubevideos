// Ancla frases del guion a los ms de Whisper. Uso: node scripts/anchors_vn2vhn3n8eqs.mjs "frase" ...
import fs from 'fs';

const SLUG = 'vn2vhn3n8eqs';
export const words = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, 'utf8'));

const norm = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9ñ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// texto plano + mapa char->indice de palabra
let flat = '';
const charToWord = [];
for (let i = 0; i < words.length; i++) {
  const t = norm(words[i].text);
  if (!t) continue;
  if (flat) {
    flat += ' ';
    charToWord.push(i);
  }
  for (let k = 0; k < t.length; k++) charToWord.push(i);
  flat += t;
}

export function find(phrase, fromMs = 0) {
  const p = norm(phrase);
  let idx = -1;
  let search = 0;
  while (true) {
    idx = flat.indexOf(p, search);
    if (idx === -1) return null;
    const wi = charToWord[idx];
    if (words[wi].startMs >= fromMs) break;
    search = idx + 1;
  }
  const wi = charToWord[idx];
  const wj = charToWord[Math.min(flat.length - 1, idx + p.length - 1)];
  return {
    startMs: words[wi].startMs,
    endMs: words[wj].endMs,
    startSec: +(words[wi].startMs / 1000).toFixed(2),
    endSec: +(words[wj].endMs / 1000).toFixed(2),
    text: phrase,
  };
}

export function findAll(phrase) {
  const p = norm(phrase);
  const out = [];
  let search = 0;
  while (true) {
    const idx = flat.indexOf(p, search);
    if (idx === -1) break;
    const wi = charToWord[idx];
    const wj = charToWord[Math.min(flat.length - 1, idx + p.length - 1)];
    out.push({
      startSec: +(words[wi].startMs / 1000).toFixed(2),
      endSec: +(words[wj].endMs / 1000).toFixed(2),
    });
    search = idx + 1;
  }
  return out;
}

export const TOTAL_SEC = words[words.length - 1].endMs / 1000;

if (process.argv[2]) {
  for (const a of process.argv.slice(2)) {
    console.log(a, '→', JSON.stringify(find(a)));
  }
} else {
  console.log('TOTAL_SEC', TOTAL_SEC, '| palabras', words.length);
}
