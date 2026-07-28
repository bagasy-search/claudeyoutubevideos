/**
 * shrink_vsdjytp30ogs.mjs — baja el peso del tarball de assets del farm.
 *   · b-roll → 960 px, CRF 31, RECORTADO a la duración que realmente usa el build (+0,6 s)
 *   · imágenes PNG de gpt-image → JPG q4  (los PNG originales NO se borran: son assets pagos)
 *   · reescribe las rutas .png → .jpg en beats_<slug>.ts Y verifica que ninguna quede rota
 *   · emite _assets_<slug>.txt (lista explícita para farm.mjs)
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const SLUG = 'vsdjytp30ogs';
const BEATS_FILE = `src/VideoEdit/beats_${SLUG}.ts`;
const FPS = 30;

let src = fs.readFileSync(BEATS_FILE, 'utf8');
const m = src.match(/export const BEATS: VBeat\[\] = ([\s\S]*);\n$/);
const beats = JSON.parse(m[1]);

const SMALL = `broll/${SLUG}_s`;
fs.mkdirSync(`public/${SMALL}`, {recursive: true});

/* ---------------------------- 1 · b-roll -------------------------------- */
// duración máxima usada por clip
const useSec = {};
for (const b of beats) {
  const p = b.props?.src;
  if (typeof p === 'string' && p.endsWith('.mp4')) {
    useSec[p] = Math.max(useSec[p] || 0, b.dur / FPS);
  }
}
let vIn = 0;
let vOut = 0;
for (const [p, sec] of Object.entries(useSec)) {
  if (!fs.existsSync(`public/${p}`)) continue;
  const name = path.basename(p);
  const dst = `${SMALL}/${name}`;
  vIn += fs.statSync(`public/${p}`).size;
  if (!fs.existsSync(`public/${dst}`)) {
    try {
      execFileSync(
        'ffmpeg',
        ['-y', '-loglevel', 'error', '-i', `public/${p}`, '-t', String((sec + 0.6).toFixed(2)),
         '-vf', 'scale=960:-2', '-c:v', 'libx264', '-crf', '31', '-preset', 'veryfast',
         '-an', '-pix_fmt', 'yuv420p', `public/${dst}`],
        {stdio: 'ignore'}
      );
    } catch {
      continue;
    }
  }
  if (fs.existsSync(`public/${dst}`)) {
    vOut += fs.statSync(`public/${dst}`).size;
    for (const b of beats) if (b.props?.src === p) b.props.src = dst;
  }
}

/* ---------------------------- 2 · imágenes ------------------------------ */
let iIn = 0;
let iOut = 0;
const pngs = new Set();
for (const b of beats) {
  for (const f of ['src', 'image', 'imageA', 'imageB', 'bg']) {
    const p = b.props?.[f];
    if (typeof p === 'string' && p.endsWith('.png') && p.startsWith('img/')) pngs.add(p);
  }
}
for (const p of pngs) {
  if (!fs.existsSync(`public/${p}`)) continue;
  const jpg = p.replace(/\.png$/, '.jpg');
  iIn += fs.statSync(`public/${p}`).size;
  if (!fs.existsSync(`public/${jpg}`)) {
    try {
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', `public/${p}`, '-q:v', '4', `public/${jpg}`], {
        stdio: 'ignore',
      });
    } catch {
      continue;
    }
  }
  if (fs.existsSync(`public/${jpg}`)) {
    iOut += fs.statSync(`public/${jpg}`).size;
    for (const b of beats) {
      for (const f of ['src', 'image', 'imageA', 'imageB', 'bg']) {
        if (b.props?.[f] === p) b.props[f] = jpg;
      }
    }
  }
}

/* ------------------------- 3 · reescribir y validar --------------------- */
src = src.replace(
  /export const BEATS: VBeat\[\] = [\s\S]*;\n$/,
  `export const BEATS: VBeat[] = ${JSON.stringify(beats, null, 1)};\n`
);
fs.writeFileSync(BEATS_FILE, src, 'utf8');

const usados = new Set();
const rotas = [];
for (const b of beats) {
  for (const f of ['src', 'image', 'imageA', 'imageB', 'clip', 'bg']) {
    const p = b.props?.[f];
    if (typeof p !== 'string' || !/^(img|broll|real|med)\//.test(p)) continue;
    if (fs.existsSync(`public/${p}`)) usados.add(p);
    else rotas.push(p);
  }
}

// lista explícita para farm.mjs
const lista = [...usados].sort();
lista.push(`${SLUG}.wav`, `${SLUG}_opt.mp4`);
fs.writeFileSync(`_assets_${SLUG}.txt`, lista.join('\n') + '\n', 'utf8');

const mb = (n) => (n / 1048576).toFixed(0) + ' MB';
console.log(`b-roll: ${mb(vIn)} → ${mb(vOut)}`);
console.log(`imágenes: ${mb(iIn)} → ${mb(iOut)}`);
console.log(`assets en la lista: ${lista.length}`);
console.log(rotas.length ? `❌ ROTAS: ${[...new Set(rotas)].join(', ')}` : '✅ ninguna ruta rota');
process.exit(rotas.length ? 1 : 0);
