// vallimon_imgitems.mjs — arma el items.json de gpt-image (H = doctora /edits con ref de cara · G = /generations) + la lámina.
import fs from 'fs';
const DOC = 'The same woman doctor as in the reference photo (same face): about 62 years old, long straight silver-grey hair, tortoiseshell glasses, small gold earrings, a white doctor coat fully BUTTONED up to the collarbone over a closed high-neck cream blouse, modest, no cleavage, no name tag, no badge, no embroidery. ';
const STYLE = ' Real candid photo taken with a modern smartphone, bright natural light, true-to-life colors, sharp focus, deep depth of field with the whole scene in focus, nothing blurred out, ordinary everyday objects around, realistic skin texture and natural hands, no filter, no text, no letters, no logos, no labels.';
const needs = JSON.parse(fs.readFileSync('_work/vallimon/needs_gen.json', 'utf8'));
const items = needs.map((n) => (n.kind === 'H'
  ? {name: `vn_${n.id}`, ref: 'public/ref_vallimon_face.png', prompt: DOC + n.p + '.' + STYLE}
  : {name: `vn_${n.id}`, prompt: n.p.charAt(0).toUpperCase() + n.p.slice(1) + '.' + STYLE}));
if (process.argv.includes('--lamina')) items.push({name: 'lamina', prompt: fs.readFileSync('_v3/vallimon_lamina_prompt.txt', 'utf8').trim()});
fs.writeFileSync('_work/vallimon/img_items.json', JSON.stringify(items, null, 1));
console.log('items', items.length, '· edits', items.filter((i) => i.ref).length);
