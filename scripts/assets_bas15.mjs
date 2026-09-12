// assets_bas15.mjs — arma _bastidarenal15_assets.txt (mismo patrón que bas11).
import fs from 'node:fs';
import path from 'node:path';
const found = new Set();
// 1) TODOS los assets del slug
for (const f of fs.readdirSync('public/img')) if (/^bas15_.*\.(jpg|png)$/.test(f)) found.add(`img/${f}`);
if (fs.existsSync('public/broll')) for (const f of fs.readdirSync('public/broll')) if (/^bas15_.*\.mp4$/.test(f)) found.add(`broll/${f}`);
// 2) fijos del montaje + reusados EXPLÍCITOS (no salen de staticFile literal)
['renal/avatar15.mp4', 'renal/bas_qr_bastida.png', 'renal/bastida_cutout.png',
 'img/bas6_broll_kidney.jpg', 'img/bas6_broll_kidney_blur.jpg',
 'img/bas6_p_basura_desecho.jpg', 'img/bas6_p_basura_desecho_blur.jpg',
 'img/bas6_p_rinon_filtro.jpg', 'img/bas6_p_rinon_filtro_blur.jpg',
 'img/bas6_p_sangre_tubo.jpg', 'img/bas6_p_sangre_tubo_blur.jpg'].forEach((a) => found.add(a));
// 3) staticFile INTERNOS de cada componente importado por el Main (1 nivel)
const main = 'src/bastida/Main_bastidarenal15.tsx';
const files = new Set([main]);
const importRe = /from\s+['"](\.[^'"]+)['"]/g;
let m; const mainsrc = fs.readFileSync(main, 'utf8');
while ((m = importRe.exec(mainsrc))) {
  for (const ext of ['.tsx', '.ts', '']) { const p = path.join('src/bastida', m[1] + ext); if (fs.existsSync(p)) { files.add(p); break; } }
}
const litRe = /staticFile\(\s*['"]((?:img|renal|broll)\/[^'"$`]+?\.(?:png|jpg|jpeg|webp|mp4|m4a|mp3))['"]\s*\)/g;
for (const f of files) { if (!fs.existsSync(f)) continue; const src = fs.readFileSync(f, 'utf8'); while ((m = litRe.exec(src))) found.add(m[1]); }
// 4) hermanos _blur.jpg
for (const a of [...found]) { const mm = a.match(/^(img\/.+)\.(png|jpg|jpeg|webp)$/); if (!mm) continue; const blur = `${mm[1]}_blur.jpg`; if (fs.existsSync(path.join('public', blur))) found.add(blur); }
const missing = [...found].filter((a) => !fs.existsSync(path.join('public', a)));
const ok = [...found].filter((a) => fs.existsSync(path.join('public', a))).sort();
fs.writeFileSync('_bastidarenal15_assets.txt', ok.join('\n') + '\n');
console.log(`assets: ${ok.length} · _bastidarenal15_assets.txt`);
if (missing.length) { console.error(`\n⛔ FALTAN EN DISCO (${missing.length}):`); missing.forEach((mm) => console.error('  ·', mm)); process.exit(1); }
