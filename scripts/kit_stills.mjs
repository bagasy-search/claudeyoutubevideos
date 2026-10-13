// scripts/kit_stills.mjs — STILLS de componentes con UN solo bundle (entrada, medio, salida).
//   node scripts/kit_stills.mjs <entry.tsx> <outDir> <Id>[,<Id>...] [fracs=0.12,0.5,0.9]
// `npx remotion still` re-empaqueta el proyecto en CADA llamada (~30 s): para 16 componentes x 3 cuadros
// son 25 minutos. Acá se empaqueta una vez y se sacan todos los cuadros. Después se arma la hoja de
// contactos y se MIRA (una compuerta numérica no ve un componente mal dibujado).
import fs from 'node:fs';
import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderStill } from '@remotion/renderer';

const [entry, outDir, ids, fr = '0.12,0.5,0.9'] = process.argv.slice(2);
if (!entry || !outDir || !ids) { console.error('uso: node scripts/kit_stills.mjs <entry> <outDir> <Id,Id> [fracs]'); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });
const fracs = fr.split(',').map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve(entry), publicDir: path.resolve('public') });
const comps = await getCompositions(serveUrl);
let n = 0;
for (const id of ids.split(',')) {
  const c = comps.find((x) => x.id === id);
  if (!c) { console.log(`  ⛔ no existe la composición ${id}`); continue; }
  for (const q of fracs) {
    const frame = Math.min(c.durationInFrames - 1, Math.round(c.durationInFrames * q));
    const out = path.join(outDir, `${id}_${String(Math.round(q * 100)).padStart(2, '0')}.jpg`);
    await renderStill({ composition: c, serveUrl, output: out, frame, imageFormat: 'jpeg', jpegQuality: 80 });
    n++;
  }
}
console.log(`MEDIDO: ${n} stills en ${outDir}`);
