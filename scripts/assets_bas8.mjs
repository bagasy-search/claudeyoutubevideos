// assets_bas8.mjs — arma @_bastidarenal8_assets.txt para el farm.
// Escanea SOLO el Main (refs explícitas) + agrega los fijos + los 2 assets HARDCODEADOS de
// FilterMechanismScene (no son props, siempre se renderizan) + los clips de agnes + los _blur.
// NO escanea los internals del kit: capturaría defaults (bas6/bas7) que piso con props → falsos faltantes.
import fs from 'node:fs';
import path from 'node:path';

const EXT = '(?:png|jpg|jpeg|webp)';
const RE_FULL = new RegExp(`['"\`](img/[^'"\`$]+?\\.${EXT}|renal/[^'"\`$]+?\\.(?:mp4|m4a|mp3|png|jpg)|broll/[^'"\`$]+?\\.mp4)['"\`]`, 'g');

// (b) nombres PELADOS en props img de BRoll (el componente antepone img/ y .png) — gotcha del #7
const RE_BARE = /\bimg:\s*['"`]([\w.\-]+)['"`]/g;
const found = new Set();
const src = fs.readFileSync('src/bastida/Main_bastida8.tsx', 'utf8');
let m;
while ((m = RE_FULL.exec(src))) found.add(m[1]);
while ((m = RE_BARE.exec(src))) {
  const v = m[1];
  if (v.startsWith('img/') || v.startsWith('renal/') || v.startsWith('broll/')) continue; // ya es ruta
  found.add(v.includes('.') ? `img/${v}` : `img/${v}.png`);
}

// fijos del montaje
['renal/avatar8.mp4', 'renal/bastida8_cola.m4a', 'renal/bas_qr_bastida.png',
 'renal/bastida_cutout.png', 'renal/music/bas_music_quiet_pulse_bed_a.mp3',
 // hardcodeados (no props) de FilterMechanismScene:
 'img/bas6_broll_kidney.jpg', 'img/bas6_p_basura_desecho.jpg'].forEach((a) => found.add(a));

// sfx
for (const s of fs.readdirSync('public/renal/sfx').filter((f) => f.endsWith('.mp3'))) found.add(`renal/sfx/${s}`);

// clips de agnes de ESTE slug (broll/bastidarenal8/*.mp4)
const brollDir = 'public/broll/bastidarenal8';
if (fs.existsSync(brollDir)) {
  for (const c of fs.readdirSync(brollDir).filter((f) => f.endsWith('.mp4'))) found.add(`broll/bastidarenal8/${c}`);
}

// hermanos _blur.jpg de cada foto
for (const a of [...found]) {
  const mm = a.match(/^(img\/.+)\.(png|jpg|jpeg|webp)$/);
  if (!mm) continue;
  const blur = `${mm[1]}_blur.jpg`;
  if (fs.existsSync(path.join('public', blur))) found.add(blur);
}

const missing = [...found].filter((a) => !fs.existsSync(path.join('public', a)));
const ok = [...found].filter((a) => fs.existsSync(path.join('public', a))).sort();
fs.writeFileSync('_bastidarenal8_assets.txt', ok.join('\n') + '\n');
console.log(`assets: ${ok.length} · escritos en _bastidarenal8_assets.txt`);
if (missing.length) {
  console.error(`\n⛔ FALTAN EN DISCO (${missing.length}):`);
  missing.forEach((mm) => console.error('  ·', mm));
  process.exit(1);
}
