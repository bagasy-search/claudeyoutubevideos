// Barrido LOCAL obligatorio (ver _BUGS_fed6_integracion.md): bundle + renderStill sobre UN frame
// del medio de CADA beat de componente del Main. Cada bug que sale acá ahorra un render de ~30 min.
// Imprime RESUMEN: ok / fallas con motivo (primeras 5).
import { bundle } from '@remotion/bundler';
import { selectComposition, renderStill } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
process.env.TEMP = 'D:/rtmp/tmp'; process.env.TMP = 'D:/rtmp/tmp'; process.env.TMPDIR = 'D:/rtmp/tmp';

const OUT = 'D:/rtmp/fcspuntos_sweep'; fs.mkdirSync(OUT, { recursive: true });
const FPS = 30;
const main = fs.readFileSync('src/_fed6/VideoEdit/Main_fcspuntos.tsx', 'utf8');
const beats = [];
// ⚠ Los componentes-overlay se emiten como FRAGMENTO (`<><ReframedVideo …/><PremiumOverlay>…`),
//    así que el viejo `=> <(\w+)` no los matcheaba y el barrido los SALTEABA en silencio —
//    justo las cues donde vivía el bug #6. Ahora se toma el resto de la línea y se nombra
//    el componente real: el de adentro del PremiumOverlay si es un fragmento.
for (const m of main.matchAll(/key:\s*"componente_(\d+)",\s*startSec:\s*([\d.]+),\s*dur:\s*([\d.]+),\s*el:\s*\(d: number\) => (.*)$/gm)) {
  const f0 = +m[1], dur = +m[3], el = m[4];
  const comp = el.startsWith('<>')
    ? (el.match(/<PremiumOverlay[^>]*><(\w+)/) || el.match(/<(\w+)/) || [, 'Fragmento'])[1]
    : (el.match(/^<(\w+)/) || [, 'Desconocido'])[1];
  beats.push({ f0, frame: f0 + Math.max(1, Math.floor((dur * FPS) / 2)), comp });
}
console.log(`beats de componente: ${beats.length} · tipos ${new Set(beats.map(b => b.comp)).size}`);

const serveUrl = await bundle({ entryPoint: path.resolve('src/index_fcspuntos.tsx'), onProgress: () => {} });
console.log('bundle OK');
const composition = await selectComposition({ serveUrl, id: 'Fcspuntos' });

const fallas = [];
let ok = 0;
for (const b of beats) {
  try {
    await renderStill({ serveUrl, composition, frame: b.frame, output: path.join(OUT, `${b.comp}_${b.f0}.png`), overwrite: true, scale: 0.35 });
    ok++;
  } catch (e) {
    fallas.push(`${b.comp}@f${b.frame}: ${String(e.message || e).split('\n')[0].slice(0, 200)}`);
  }
}
console.log(`=== BARRIDO · ok ${ok} · fail ${fallas.length} ===`);
fallas.slice(0, 5).forEach((f) => console.log('  ⛔ ' + f));
if (fallas.length) process.exit(1);
