// scripts/stills_sheet.mjs — STILLS de varios cuadros de una composición con UN solo bundle, y hoja
// de contactos. Genérico (no por slug): sirve para verificar componentes nuevos antes del farm.
//   node scripts/stills_sheet.mjs <entry.tsx> <outDir> <Comp:f1,f2,f3> [<Comp:...> ...]
//   -> <outDir>/<Comp>_<f>.jpg y <outDir>/_sheet.jpg (3 columnas, 640 px)
// ⛔ `npx remotion still` re-empaqueta en CADA llamada (~35 s): 36 stills = 20 min. Acá se empaqueta
//    una vez y cada still cuesta ~1-2 s.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { bundle } from '@remotion/bundler';
import { selectComposition, renderStill } from '@remotion/renderer';

const [entry, outDir, ...specs] = process.argv.slice(2);
if (!entry || !outDir || !specs.length) { console.error('uso: node scripts/stills_sheet.mjs <entry> <outDir> <Comp:f1,f2> ...'); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve(entry), publicDir: path.resolve('public') });
const hechos = [];
for (const s of specs) {
  const [id, fr] = s.split(':');
  const composition = await selectComposition({ serveUrl, id, inputProps: {} });
  for (const f of fr.split(',').map(Number)) {
    const out = path.join(outDir, `${id}_${f}.jpg`);
    await renderStill({ composition, serveUrl, output: out, frame: Math.min(f, composition.durationInFrames - 1), imageFormat: 'jpeg', jpegQuality: 80 });
    hechos.push(out);
  }
  console.log(`✓ ${id} · ${fr}`);
}
// hoja de contactos 3 columnas
const cols = 3, filas = Math.ceil(hechos.length / cols);
const inputs = hechos.flatMap((h) => ['-i', h]);
while (inputs.length / 2 < filas * cols) inputs.push('-f', 'lavfi', '-i', 'color=c=black:s=1920x1080:d=1');
const n = filas * cols;
const esc = Array.from({ length: n }, (_, i) => `[${i}:v]scale=640:360,setsar=1[v${i}]`).join(';');
const layout = Array.from({ length: n }, (_, i) => `${(i % cols) * 640}_${Math.floor(i / cols) * 360}`).join('|');
execFileSync('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex',
  `${esc};${Array.from({ length: n }, (_, i) => `[v${i}]`).join('')}xstack=inputs=${n}:layout=${layout}[o]`, '-map', '[o]', '-frames:v', '1', path.join(outDir, '_sheet.jpg')], { windowsHide: true });
console.log(`MEDIDO: ${hechos.length} stills -> ${path.join(outDir, '_sheet.jpg')}`);
