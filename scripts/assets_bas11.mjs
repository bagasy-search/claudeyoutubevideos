// assets_bas11.mjs — arma _bastidarenal11_assets.txt. Red de seguridad: TODOS los assets del slug
// (img jpg + _blur + broll clips) viajan, + los staticFile INTERNOS de cada componente usado
// (AlertSignalsScene, FilterMechanismScene, etc. cargan imágenes que no vienen por props → 404).
import fs from 'node:fs';
import path from 'node:path';

const found = new Set();

// 1) TODOS los assets del slug (red de seguridad contra rutas por template literal)
for (const f of fs.readdirSync('public/img')) {
  if (/^bas11_.*\.(jpg|png)$/.test(f)) found.add(`img/${f}`);
}
for (const f of fs.readdirSync('public/broll')) {
  if (/^bas11_.*\.mp4$/.test(f)) found.add(`broll/${f}`);
}

// 2) fijos del montaje
['renal/avatar11.mp4', 'renal/bas_qr_bastida.png', 'renal/bastida_cutout.png',
 'renal/music/bas_music_quiet_pulse_bed_a.mp3'].forEach((a) => found.add(a));

// 3) staticFile INTERNOS de cada componente usado (recorre imports del Main, 1 nivel)
const main = 'src/bastida/Main_bastidarenal11.tsx';
const files = new Set([main]);
const importRe = /from\s+['"](\.[^'"]+)['"]/g;
let m;
const mainsrc = fs.readFileSync(main, 'utf8');
while ((m = importRe.exec(mainsrc))) {
  for (const ext of ['.tsx', '.ts', '']) {
    const p = path.join('src/bastida', m[1] + ext);
    if (fs.existsSync(p)) { files.add(p); break; }
  }
}
const litRe = /staticFile\(\s*['"]((?:img|renal|broll)\/[^'"$`]+?\.(?:png|jpg|jpeg|webp|mp4|m4a|mp3))['"]\s*\)/g;
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  const src = fs.readFileSync(f, 'utf8');
  while ((m = litRe.exec(src))) found.add(m[1]);
}

// 4) hermanos _blur.jpg de cada foto
for (const a of [...found]) {
  const mm = a.match(/^(img\/.+)\.(png|jpg|jpeg|webp)$/);
  if (!mm) continue;
  const blur = `${mm[1]}_blur.jpg`;
  if (fs.existsSync(path.join('public', blur))) found.add(blur);
}

const missing = [...found].filter((a) => !fs.existsSync(path.join('public', a)));
const ok = [...found].filter((a) => fs.existsSync(path.join('public', a))).sort();
fs.writeFileSync('_bastidarenal11_assets.txt', ok.join('\n') + '\n');
console.log(`assets: ${ok.length} (img+broll+fijos+internos) · _bastidarenal11_assets.txt`);
if (missing.length) {
  console.error(`\n⛔ FALTAN EN DISCO (${missing.length}):`);
  missing.forEach((mm) => console.error('  ·', mm));
  process.exit(1);
}
