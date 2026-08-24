// assets_bas7.mjs — arma @_bastidarenal7_assets.txt barriendo TODAS las rutas de assets
// citadas en el Main y en las escenas del video #7 (incluye los staticFile hardcodeados de
// los componentes del kit, que ya costaron un chunk muerto en videos anteriores).
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const FILES = [
  'src/bastida/Main_bastidarenal7.tsx',
  ...fs.existsSync('src/bastida/scenes7')
    ? fs.readdirSync('src/bastida/scenes7').filter((f) => f.endsWith('.tsx')).map((f) => `src/bastida/scenes7/${f}`)
    : [],
];


const RE = /['"`](img\/[^'"`$]+?\.(?:png|jpg|jpeg|webp)|renal\/[^'"`$]+?\.(?:mp4|m4a|mp3|png|jpg)|broll\/[^'"`$]+?\.mp4)['"`]/g;
const found = new Set();
for (const f of FILES) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  const src = fs.readFileSync(p, 'utf8');
  let m;
  while ((m = RE.exec(src))) found.add(m[1]);
}

// fijos del montaje
['renal/avatar7.mp4', 'renal/bastida7_cola.m4a', 'renal/bas_qr_bastida.png',
 'renal/music/bas_music_quiet_pulse_bed_a.mp3',
 'img/ill/bas_ill_kidney.png'].forEach((a) => found.add(a));
// sfx usados
for (const s of fs.readdirSync('public/renal/sfx').filter((f) => f.endsWith('.mp3'))) found.add(`renal/sfx/${s}`);

// hermanos _blur.jpg de cada foto (el kit los pide en runtime)
for (const a of [...found]) {
  const m = a.match(/^(img\/.+)\.(png|jpg|jpeg|webp)$/);
  if (!m) continue;
  const blur = `${m[1]}_blur.jpg`;
  if (fs.existsSync(path.join('public', blur))) found.add(blur);
}

const missing = [...found].filter((a) => !fs.existsSync(path.join('public', a)));
const ok = [...found].filter((a) => fs.existsSync(path.join('public', a))).sort();
fs.writeFileSync('_bastidarenal7_assets.txt', ok.join('\n') + '\n');
console.log(`assets: ${ok.length} · escritos en _bastidarenal7_assets.txt`);
if (missing.length) {
  console.error(`\n⛔ FALTAN EN DISCO (${missing.length}):`);
  missing.forEach((m) => console.error('  ·', m));
  process.exit(1);
}
