// valvaselina15_lamina.mjs — LÁMINA del recetario (gpt-image-2 LOW, sincrónico, 1536x1024) → public/img/valvaselina15/lamina.jpg
// Uso: node _v3/valvaselina15_lamina.mjs [n_intento]
import fs from 'fs';
import {execFileSync} from 'child_process';
const env = {}; for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) { const m = l.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const n = process.argv[2] || '1';
const prompt = `A premium vintage editorial recipe-book page, landscape layout, photographed flat and filling the whole frame, cream paper texture, espresso-brown ink, thin brass-gold rules and small line icons, elegant large serif typography (like Playfair Display), generous margins, perfectly legible.
TOP HEADER, small caps in gold: "EL RECETARIO DE LA DOCTORA · PÁGINA 8"
BIG TITLE in espresso serif: "La vaselina bien usada"
Subtitle in italic: "Fina · húmeda · al final"
LEFT COLUMN, a section titled "CUÁNTO PONER" with five numbered cards, each with a tiny line icon:
 1. "Un grano de arroz" — "arriba del labio y labios" (icon: grain of rice)
 2. "Medio grano" — "pestañas, con cepillo casi seco" (icon: mascara brush)
 3. "Una arveja" — "toda la cara (guisante)" (icon: small pea)
 4. "Media cucharadita" — "el cuello, de abajo hacia arriba" (icon: teaspoon)
 5. "Una cucharadita" — "las dos manos, o un pie" (icon: hand)
MIDDLE COLUMN, a section titled "EL ORDEN" with three steps joined by a thin arrow line:
 1. "Piel limpia"  2. "Algo con agua"  3. "Vaselina, al final"
 and a small note under it: "De día, en la cara: protector solar"
RIGHT COLUMN, a boxed panel with a terracotta border titled "LOS 3 ERRORES QUE LA ARRUINAN":
 ✗ "Capa gruesa"
 ✗ "Sobre la piel seca"
 ✗ "La almohada enseguida"
 and under the box: "Espere 10 minutos antes de acostarse"
BOTTOM FOOTER strip across the whole width titled "QUÉ ESPERAR, CON HONESTIDAD": "Primera noche: piel más suave · 3 a 4 semanas: menos reseca, rayitas finas menos visibles · No rellena arrugas hondas ni levanta la piel"
No photos of people, no logos, no brand names, no price, no website.
Every word in SPANISH spelled EXACTLY as written, no invented words, no extra text. CRITICAL SPELLING: render every accent and the N-with-tilde exactly: CUÁNTO, PÁGINA, húmeda, día, QUÉ, ESPERAR.`;
const r = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST', headers: {Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'Content-Type': 'application/json'},
  body: JSON.stringify({model: 'gpt-image-2', prompt, size: '1536x1024', quality: 'low', n: 1}), signal: AbortSignal.timeout(300000),
});
const j = await r.json();
if (!j.data?.[0]?.b64_json) { console.log('falla', r.status, JSON.stringify(j).slice(0, 300)); process.exit(1); }
fs.mkdirSync('_work/valvaselina15/lamina', {recursive: true});
const png = `_work/valvaselina15/lamina/lamina_${n}.png`;
fs.writeFileSync(png, Buffer.from(j.data[0].b64_json, 'base64'));
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', png, '-vf', 'scale=-2:1080,pad=1920:1080:(ow-iw)/2:0:color=0xF8F1E4,format=yuvj420p', '-q:v', '2', `_work/valvaselina15/lamina/lamina_${n}.jpg`]);
console.log('ok', png, JSON.stringify(j.usage || {}));
