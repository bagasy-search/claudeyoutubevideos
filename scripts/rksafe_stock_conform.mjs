// scripts/rksafe_stock_conform.mjs <slug> [srcDir] — conforma el METRAJE REAL de stock a 1920x1080
// 30/1 CFR y lo deja en `public/broll/<slug>_real/`. Camino compartido del canal Ray Kessler.
//
// ⛔⛔ NO SE SUPONE NADA DEL ARCHIVO DE ORIGEN. Medido: Pexels devuelve 4:3, 24/25/50/60 fps y clips
//    MÁS CORTOS que el slot. Cada archivo se mide con ffprobe DESPUÉS de conformar.
// ⛔ `minterpolate` está PROHIBIDO para una tanda (200 s por clip contra 1,3 s con `fps=30`): el
//    requisito duro es el CFR 30/1, no cuadros interpolados.
// ⛔ EL DEFECTO DE LUMA VIVE EN EL ARRANQUE, NO EN LA MEDIA: mucho clip de stock abre con un fundido
//    desde negro. Se mide el YAVG MÍNIMO de los primeros 0,7 s y se recorta el fundido con `-ss`.
// ⛔ El metraje real NO se ralentiza: se reproduce a 1x (el 0,5x existe para esconder los artefactos
//    de agnes y sobre cámara real se ve como cámara lenta rara).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const SLUG = process.argv[2];
if (!SLUG) { console.error('uso: node scripts/rksafe_stock_conform.mjs <slug> [srcDir]'); process.exit(1); }
const SRC = process.argv[3] || `_v3/${SLUG}_stock`;
const DST = `public/broll/${SLUG}_real`;
const BAK = `_v3/bak_pool_${SLUG}`;
fs.mkdirSync(DST, { recursive: true });
fs.mkdirSync(BAK, { recursive: true });

const ff = (args) => execFileSync('ffmpeg', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const probe = (p, campos) => {
  try {
    return execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries', campos,
      '-of', 'csv=p=0', p], { encoding: 'utf8' }).trim();
  } catch { return ''; }
};
const lumaMin = (p, t) => {
  // ⛔ `-v info` y se lee STDERR: con `-v error` el medidor devuelve vacío y se lee como OK.
  let salida = '';
  try {
    salida = ff(['-v', 'info', '-t', String(t), '-i', p, '-an', '-vf',
      'scale=160:90,signalstats,metadata=print:key=lavfi.signalstats.YAVG', '-f', 'null', '-']);
  } catch (e) { salida = String(e.stderr || ''); }
  const vals = [...salida.matchAll(/YAVG=([\d.]+)/g)].map((m) => +m[1]);
  return vals.length ? { min: Math.min(...vals), n: vals.length } : { min: null, n: 0 };
};

const files = fs.readdirSync(SRC).filter((f) => /\.mp4$/i.test(f));
console.log('═'.repeat(74));
console.log(`MEDIDO: ${files.length} archivos de stock en ${SRC}`);
if (!files.length) { console.error('⛔ nada que conformar'); process.exit(1); }

const filas = [];
let recortados = 0;
for (const f of files) {
  const src = path.join(SRC, f);
  const dst = path.join(DST, f);
  if (!fs.existsSync(path.join(BAK, f))) fs.copyFileSync(src, path.join(BAK, f));
  // 1) ¿arranca en negro? el fundido se recorta con -ss, no se tira el clip
  const pre = lumaMin(src, 0.7);
  let ss = 0;
  if (pre.min !== null && pre.min < 40) { ss = 0.8; recortados++; }
  const filtro = 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,fps=30';
  const args = ['-v', 'error', '-y'];
  if (ss) args.push('-ss', String(ss));
  args.push('-i', src, '-t', '8.2', '-an', '-vf', filtro, '-r', '30', '-fps_mode', 'cfr',
    '-c:v', 'libx264', '-crf', '19', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', dst);
  try { ff(args); } catch (e) { console.log(`  ⛔ ${f}: ffmpeg falló`); continue; }
  const dur = +(probe(dst, 'stream=duration').match(/[\d.]+/) || [0])[0];
  const fps = probe(dst, 'stream=r_frame_rate');
  const dim = probe(dst, 'stream=width,height');
  const post = lumaMin(dst, 0.7);
  filas.push({ f, dur, fps, dim, luma0: post.min, n: post.n });
}

const malFps = filas.filter((x) => x.fps !== '30/1');
const malDim = filas.filter((x) => x.dim !== '1920,1080' && x.dim !== '1920x1080');
const negras = filas.filter((x) => x.luma0 === null || x.luma0 < 40);
const cortas = filas.filter((x) => x.dur < 4.6);
const durs = filas.map((x) => x.dur).sort((a, b) => a - b);

console.log(`   conformados ${filas.length} · fundido de arranque recortado en ${recortados}`);
console.log(`   duración: min ${durs[0]?.toFixed(2)} · mediana ${durs[durs.length >> 1]?.toFixed(2)} · max ${durs[durs.length - 1]?.toFixed(2)} s`);
console.log(`   ${malFps.length ? '⛔' : '✓'} fuera de 30/1 CFR: ${malFps.length}${malFps.length ? ' → ' + malFps.map((x) => x.f + ' ' + x.fps).slice(0, 6).join(' · ') : ''}`);
console.log(`   ${malDim.length ? '⛔' : '✓'} fuera de 1920x1080: ${malDim.length}${malDim.length ? ' → ' + malDim.map((x) => x.f + ' ' + x.dim).slice(0, 6).join(' · ') : ''}`);
console.log(`   ${negras.length ? '⛔' : '✓'} arrancan casi en negro (YAVG<40 en los primeros 0,7 s): ${negras.length}${negras.length ? ' → ' + negras.map((x) => x.f + ' ' + (x.luma0 ?? 'NO MEDÍ')).slice(0, 6).join(' · ') : ''}`);
console.log(`   ${cortas.length ? '⚠️' : '✓'} más cortos que 4,6 s (el plan no les puede dar un slot largo): ${cortas.length}${cortas.length ? ' → ' + cortas.map((x) => x.f + ' ' + x.dur.toFixed(2)).join(' · ') : ''}`);
console.log(`   → ${DST}  (originales respaldados en ${BAK})`);
console.log('═'.repeat(74));
fs.writeFileSync(`_v3/${SLUG}_stock_medido.json`, JSON.stringify(filas, null, 1));
process.exit(malFps.length || malDim.length || negras.length ? 2 : 0);
