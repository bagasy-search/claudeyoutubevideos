/**
 * finalize_vsdjytp30ogs.mjs — cierra la biblioteca de assets ANTES del render.
 *  1. Verifica en disco TODAS las rutas que pide el build.
 *  2. Los clips de Pexels que no bajaron se reemplazan por una imagen IA (queda MÁS on-topic
 *     que un stock genérico) → escribe _imgs_fill_<slug>.json para generarlas.
 *  3. Mide el BRILLO de cada clip (Pexels devuelve tomas nocturnas que quedan como bache negro)
 *     y marca las que dan luma < 34.
 *  4. Reescribe beats_<slug>.ts con las rutas ya resueltas.
 *
 * Uso: node scripts/finalize_vsdjytp30ogs.mjs [--check-luma]
 */
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const SLUG = 'vsdjytp30ogs';
const BEATS_FILE = `src/VideoEdit/beats_${SLUG}.ts`;

const src = fs.readFileSync(BEATS_FILE, 'utf8');
const m = src.match(/export const BEATS: VBeat\[\] = ([\s\S]*);\n$/);
if (!m) throw new Error('no pude leer BEATS');
const beats = JSON.parse(m[1]);

const exists = (p) => fs.existsSync(`public/${p}`);
const IMG_STYLE =
  'real amateur photo taken with a phone camera, natural imperfect lighting, slight grain and noise, ' +
  'shallow depth of field, no text, no watermark, no illustration, no 3d render, photorealistic, candid';

// prompts de reemplazo por query de Pexels (para los clips que no bajaron)
const shots = JSON.parse(fs.readFileSync(`public/broll/shots_${SLUG}.json`, 'utf8'));
const queryOf = Object.fromEntries(shots.map((s) => [`broll/${SLUG}/${s.name}.mp4`, s.query]));

const fill = [];
let faltanClip = 0;
let faltanImg = 0;
const missingImgs = [];

const fixField = (b, field) => {
  const p = b.props?.[field];
  if (!p || typeof p !== 'string') return;
  if (exists(p)) return;
  if (p.endsWith('.mp4')) {
    // clip que no bajó → imagen IA con la misma idea
    faltanClip++;
    const name = `${SLUG}_fill_${p.split('/').pop().replace('.mp4', '')}`;
    const q = queryOf[p] || 'elderly hands close up';
    if (!fill.some((f) => f.name === name) && !exists(`img/${name}.png`)) {
      fill.push({name, prompt: `${q}, close up, warm domestic light. ${IMG_STYLE}`});
    }
    b.props[field] = `img/${name}.png`;
    if (field === 'src') b.props.video = false;
  } else {
    faltanImg++;
    missingImgs.push(p);
  }
};

for (const b of beats) {
  for (const f of ['src', 'image', 'imageA', 'imageB', 'clip', 'bg']) fixField(b, f);
}

// las imágenes que faltan (gpt-image caído): se apuntan a la imagen generada más cercana que SÍ existe
const okImgs = beats
  .map((b) => b.props?.src)
  .filter((p) => typeof p === 'string' && p.startsWith('img/') && exists(p));
if (missingImgs.length && okImgs.length) {
  const near = (start) => {
    let best = null;
    let bd = Infinity;
    for (const b of beats) {
      const p = b.props?.src;
      if (typeof p !== 'string' || !p.startsWith('img/') || !exists(p)) continue;
      const d = Math.abs(b.start - start);
      if (d < bd) {
        bd = d;
        best = p;
      }
    }
    return best;
  };
  for (const b of beats) {
    for (const f of ['src', 'image', 'imageA', 'imageB']) {
      const p = b.props?.[f];
      if (typeof p === 'string' && !exists(p) && !p.endsWith('.mp4')) {
        const n = near(b.start);
        if (n) b.props[f] = n;
        else delete b.props[f];
      }
    }
  }
}

// brillo de los clips
if (process.argv.includes('--check-luma')) {
  const clips = [...new Set(beats.map((b) => b.props?.src).filter((p) => p?.endsWith('.mp4')))];
  const oscuros = [];
  for (const c of clips) {
    try {
      const out = execFileSync(
        'ffmpeg',
        ['-hide_banner', '-ss', '1', '-t', '1', '-i', `public/${c}`, '-vf', 'signalstats,metadata=print', '-f', 'null', '-'],
        {encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']}
      );
      void out;
    } catch (e) {
      // signalstats escribe en STDERR, no en stdout (gotcha documentado)
      const err = String(e.stderr || '');
      const vals = [...err.matchAll(/YAVG:([\d.]+)/g)].map((x) => Number(x[1]));
      if (vals.length) {
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        if (avg < 34) oscuros.push({c, avg: avg.toFixed(1)});
      }
    }
  }
  if (oscuros.length) console.log('⚠ clips OSCUROS (luma<34):', JSON.stringify(oscuros));
  else console.log('brillo: sin clips oscuros');
}

// reescribir
const nuevo = src.replace(
  /export const BEATS: VBeat\[\] = [\s\S]*;\n$/,
  `export const BEATS: VBeat[] = ${JSON.stringify(beats, null, 1)};\n`
);
fs.writeFileSync(BEATS_FILE, nuevo, 'utf8');

if (fill.length) fs.writeFileSync(`_imgs_fill_${SLUG}.json`, JSON.stringify(fill, null, 1), 'utf8');

// verificación final
const rotas = [];
for (const b of beats) {
  for (const f of ['src', 'image', 'imageA', 'imageB', 'clip', 'bg']) {
    const p = b.props?.[f];
    if (typeof p === 'string' && /^(img|broll|real|med)\//.test(p) && !exists(p)) rotas.push(p);
  }
}

console.log(`clips faltantes cubiertos con imagen IA: ${faltanClip} (${fill.length} nuevas a generar)`);
console.log(`imágenes faltantes reapuntadas: ${faltanImg}`);
console.log(rotas.length ? `❌ RUTAS ROTAS: ${[...new Set(rotas)].length}` : '✅ todas las rutas existen en disco');
if (rotas.length) console.log([...new Set(rotas)].slice(0, 15).join('\n'));
