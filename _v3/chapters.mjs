// node _v3/chapters.mjs <slug> "<ancla>|<título>" ...  → imprime capítulos mm:ss desde wordms
import fs from 'fs';
const [slug, ...pairs] = process.argv.slice(2);
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const G = norm(fs.readFileSync(`GUION_${slug}.txt`, 'utf8')).split(' ');
const W = JSON.parse(fs.readFileSync(`_v3/${slug}_wordms.json`, 'utf8'));
let cur = 0;
for (const p of pairs) { const [a, t] = p.split('|'); const tk = norm(a).split(' '); let at = -1;
  for (let k = cur; k <= G.length - tk.length && at < 0; k++) if (tk.every((w, j) => G[k + j] === w)) at = k;
  if (at < 0) { console.log('NO', a); continue; } cur = at + 1; const s = at === 0 ? 0 : Math.floor(W[at]);
  console.log(`${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')} ${t}`); }
