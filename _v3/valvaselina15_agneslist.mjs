// valvaselina15_agneslist.mjs — lista de agnes i2v para los planos generados (G = gente/escena, H = la doctora) que usa el build.
import fs from 'fs';
import crypto from 'crypto';
import {SECCIONES} from './valvaselina15_plan.mjs';
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const only = process.argv[2]; // 'G' | 'H' | undefined
const L = [];
for (const s of SECCIONES) for (const m of s.m) {
  if (!['G', 'H'].includes(m.t) || (only && m.t !== only)) continue;
  const id = 'k' + crypto.createHash('sha1').update(norm(m.d)).digest('hex').slice(0, 7);
  const vintage = /1950s|1960s/.test(m.p);
  const person = !/nobody|EMPTY/.test(m.p);
  for (const n of [id, `${id}b`]) {
    if (!fs.existsSync(`public/img/valvaselina15/${n}.jpg`)) continue;
    L.push({
      nombre: n,
      motion: vintage ? 'the woman in the old photograph moves very little: a slow blink and a tiny turn of the head' : m.t === 'H' ? `the doctor continues slowly and naturally: ${m.p}` : `the scene continues slowly and naturally: ${m.p}`,
      ...(m.t === 'H' ? {pres: true} : person ? {gente: true, person: true} : {}),
      harden: true,
    });
  }
}
fs.writeFileSync(`_work/valvaselina15/agnes_${only || 'all'}.json`, JSON.stringify(L, null, 1));
console.log('agnes items', L.length);
