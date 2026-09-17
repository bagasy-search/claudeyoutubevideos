// valvaselina15_imgitems.mjs — arma los items de gpt-image (Batch low 1088x608) desde el plan.
// Salida: _work/valvaselina15/img_items.json  · nombres = los que lee el build (img/valvaselina15/<name>.jpg)
import fs from 'fs';
import crypto from 'crypto';
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
import { SECCIONES, CARDS, QA } from './valvaselina15_plan.mjs';

const DOC = 'The same woman doctor from the reference photo (same face): around 60 years old, long straight silver-grey hair, tortoiseshell glasses, white doctor coat fully BUTTONED up to the collarbone over a closed high-neck cream blouse, modest, no cleavage, no name tag, no badge, no embroidery on the coat. ';
const STYLE = ' Candid photo taken on a modern smartphone, bright natural light, true-to-life colors, sharp focus, deep depth of field with the whole room in focus, ordinary everyday objects around that stay readable, nothing blurred out, realistic skin texture with natural wrinkles, natural hands with correct fingers, people look 60 to 80 years old, no filter, no ai look, no text, no letters, no labels, no brand names, no logos.';
const VINT = ' Authentic old photograph look, nothing blurred out, no text, no letters, no logos.';
const L = [];
const add = (name, p, ref) => L.push({ name, prompt: (ref ? DOC : '') + p.trim().replace(/\.$/, '') + '.' + (/1950s|1960s/.test(p) ? VINT : STYLE), ...(ref ? { ref: 'public/ref_valvaselina15_face.png' } : {}) });

CARDS.forEach((c, k) => add(`card${k}`, c.ip));
QA.qa.questions.forEach((q, k) => add(`qa${k}`, q.ip));
let i = 0;
for (const s of SECCIONES) for (const m of s.m) {
  i++; const id = 'k' + crypto.createHash('sha1').update(norm(m.d)).digest('hex').slice(0, 7);
  if (m.t === 'G') { add(id, m.p); add(`${id}b`, m.p + '. A few seconds later in the same scene, seen from a different camera angle, closer framing, the action has moved on naturally'); }
  if (m.t === 'H') { add(id, 'Scene: ' + m.p, true); add(`${id}b`, 'Scene: ' + m.p + '. A few seconds later, a closer framing on her face and hands from a different angle', true); }
  const c = m.c || {};
  for (const k of ['ip', 'ipA', 'ipB', 'ipMyth', 'ipTruth', 'ipL', 'ipR']) if (c[k]) add(`${id}_${k}`, c[k]);
  (c.items || []).forEach((it, k) => { if (it.ip) add(`${id}_it${k}`, it.ip); if (it.newIp) add(`${id}_it${k}n`, it.newIp); });
}
fs.mkdirSync('_work/valvaselina15', { recursive: true });
fs.writeFileSync('_work/valvaselina15/img_items.json', JSON.stringify(L, null, 1));
console.log(`items ${L.length} · con ref ${L.filter((x) => x.ref).length}`);
