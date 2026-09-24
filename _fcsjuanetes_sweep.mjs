// Barrido LOCAL obligatorio (_BUGS_fed6_integracion.md): bundle + renderStill sobre UN frame del
// medio de CADA beat de componente Y de CADA overlay. Cada bug que sale acá ahorra ~30 min de farm.
//
// ⚠ El barrido sólo ve lo que su regex matchea. En fcspuntos matcheaba `=> <(\w+)` y salteaba EN
//   SILENCIO los componentes emitidos como fragmento — justo los del bug #6. Acá se toma el resto
//   de la línea y, además, se COMPARA el conteo con el del plan: si no coinciden, el barrido miente
//   y aborta antes de despachar el farm.
import { bundle } from '@remotion/bundler';
import { selectComposition, renderStill } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
process.env.TEMP = 'D:/rtmp/tmp'; process.env.TMP = 'D:/rtmp/tmp'; process.env.TMPDIR = 'D:/rtmp/tmp';

const OUT = 'D:/rtmp/fcsjuanetes_sweep'; fs.mkdirSync(OUT, { recursive: true });
const FPS = 30;
const src = fs.readFileSync('src/VideoEdit/cues_fcsjuanetes.gen.tsx', 'utf8');

const nombre = (el) => el.startsWith('<>')
  ? (el.match(/<PremiumOverlay[^>]*><(\w+)/) || el.match(/<(\w+)/) || [, 'Fragmento'])[1]
  : (el.match(/^<(\w+)/) || [, 'Desconocido'])[1];

const beats = [];
for (const m of src.matchAll(/\{ key: "(componente|ov)_(\d+)", start: ([\d.]+), dur: ([\d.]+), el: \(d\) => (.*?) \},$/gm)) {
  const [, tipo, id, start, dur, el] = m;
  // DOS frames por beat: el del MEDIO y el PRIMERO. Los 5 tramos negros de fcsunaclavada duraban
  // 0,3 s y caían en el PRIMER frame del beat — muestreando sólo el medio, el barrido no los veía.
  const f0 = Math.round(+start * FPS);
  beats.push({ tipo, id, comp: nombre(el), pos: 'mid', frame: f0 + Math.max(1, Math.floor((+dur * FPS) / 2)) });
  beats.push({ tipo, id, comp: nombre(el), pos: 'in', frame: f0 });
}

// COMPUERTA anti-barrido-mentiroso: el conteo tiene que coincidir con el plan.
const plan = JSON.parse(fs.readFileSync('_v3/fcsjuanetes_plan.json', 'utf8'));
const espComp = plan.beats.filter((b) => b.tipo === 'componente').length;
const espOv = (plan.overlays || []).length;
const gotComp = beats.filter((b) => b.tipo === 'componente' && b.pos === 'mid').length;
const gotOv = beats.filter((b) => b.tipo === 'ov' && b.pos === 'mid').length;
console.log(`barridos: componente ${gotComp}/${espComp} · overlay ${gotOv}/${espOv} · tipos ${new Set(beats.map((b) => b.comp)).size}`);
if (gotComp !== espComp || gotOv !== espOv) {
  console.error('⛔ el barrido NO ve todos los beats del plan: la regex se está salteando cues. No despachar el farm.');
  process.exit(1);
}
if (beats.some((b) => b.comp === 'Desconocido' || b.comp === 'Fragmento')) {
  console.error('⛔ hay cues cuyo componente no se pudo nombrar:', beats.filter((b) => b.comp === 'Desconocido' || b.comp === 'Fragmento').slice(0, 5));
  process.exit(1);
}

// ⛔ `public/` pesa 72 GB (47 GB son broll de OTROS videos) y en Windows Remotion SIEMPRE lo COPIA
//    entero a cada bundle (`symlinkPublicDir` no tiene efecto acá). Con eso el bundle llenaba D: y
//    bundle() volvía "OK" habiendo emitido un directorio SIN bundle.js — el barrido moría después
//    sin renderizar un solo cuadro. Se le pasa un publicDir PODADO con los 626 assets de ESTE video
//    (763 MB), que además es más estricto: si un componente pide un asset que no está en
//    _fcsjuanetes_assets.txt, acá se cae en vez de pasar inadvertido.
const PUB = 'D:/rtmp/pub_fcsjuanetes';
if (!fs.existsSync(path.join(PUB, 'broll'))) {
  console.error(`⛔ falta el publicDir podado ${PUB}. Regeneralo desde _fcsjuanetes_assets.txt.`);
  process.exit(1);
}
const serveUrl = await bundle({ entryPoint: path.resolve('src/index_fcsjuanetes.tsx'), publicDir: PUB, onProgress: () => {} });
if (!fs.existsSync(path.join(serveUrl, 'bundle.js'))) {
  console.error(`⛔ bundle() dijo OK pero NO emitió bundle.js en ${serveUrl} (disco lleno?). NO es un verde.`);
  process.exit(1);
}
console.log('bundle OK');
const composition = await selectComposition({ serveUrl, id: 'Fcsjuanetes' });

const fallas = [];
let ok = 0;
for (const b of beats) {
  try {
    await renderStill({ serveUrl, composition, frame: b.frame, output: path.join(OUT, `${b.tipo}_${b.comp}_${b.id}_${b.pos}.png`), overwrite: true, scale: 0.35 });
    ok++;
  } catch (e) {
    fallas.push(`${b.comp}@f${b.frame}: ${String(e.message || e).split('\n')[0].slice(0, 200)}`);
  }
}
console.log(`=== BARRIDO · ok ${ok} · fail ${fallas.length} ===`);
fallas.slice(0, 5).forEach((f) => console.log('  ⛔ ' + f));
if (fallas.length) process.exit(1);
