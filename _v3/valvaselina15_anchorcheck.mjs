import fs from 'fs';
import { SECCIONES } from './valvaselina15_plan.mjs';
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const G = norm(fs.readFileSync('GUION_valvaselina15.txt', 'utf8')).split(' ');
const find = (s, from) => { const t = norm(s).split(' '); for (let i = from; i <= G.length - t.length; i++) { let ok = true; for (let j = 0; j < t.length; j++) if (G[i + j] !== t[j]) { ok = false; break; } if (ok) return i; } return -1; };
let cur = 0, bad = 0, n = 0; const cnt = {};
for (const s of SECCIONES) for (const m of s.m) {
  n++; cnt[m.t] = (cnt[m.t] || 0) + 1;
  const f = find(m.d, cur); if (f < 0) { console.log('✗', s.id, m.d); bad++; continue; } cur = f + 1;
  const c = m.c || {}; const phr = [c.hitAt, c.truthAt, c.stampAt, c.chipAt, ...(c.flags || []).map((x) => x.at), ...(c.items || []).flatMap((x) => [x.at, x.hitAt]), ...(c.flips || [])].filter((x) => typeof x === 'string');
  for (const p of phr) if (find(p, f) < 0) { console.log('  ✗ frase interna', s.id, p); bad++; }
}
console.log(`momentos ${n} · fallas ${bad} · tipos`, JSON.stringify(cnt));
