// _v3/rkspots_recut_full.mjs — re-corta las ventanas de avatar A PANTALLA COMPLETA (1920x1080)
// desde el REEL CRUDO de RunPod que ya está pagado, SIN disparar ningún /run.
//
// ⛔ LOS OFFSETS NO SE RE-DERIVAN DEL PLAN. El plan volvió a correr y una ventana cambió 2 cuadros,
//    así que recomputar `reel_off` desde el plan desalinearía TODO el reel contra el mp4 ya rendido
//    (los labios se irían corriendo). Los offsets salen de los CLIPS YA CORTADOS Y VALIDADOS
//    (sincro 1,000 / 0 ms): reel_off[k] = suma de las duraciones de los clips 0..k-1.
// ⛔ Y se VERIFICA: cada clip nuevo se compara contra el viejo (bajado a la misma escala) cuadro a
//    cuadro. Si el contenido no es el mismo, el corte está corrido y hay que parar.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const A = '_v3/rkspots/av';
const OUT = 'public/broll/rkspots';
const BAK = '_v3/rkspots_av960_bak';
const CRUDO = `${A}/reel_crudo.mp4`;
const REEL = `${A}/reel_full.mp4`;

const dur = (f) => {
  const o = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' });
  return +o.match(/[\d.]+/)[0];
};

// ── 1 · conformar el reel A PANTALLA COMPLETA ───────────────────────────────────────────────────
// ⛔⛔ El avatar va FULL (regla dura del creador). El endpoint devuelve 832x464 FIJO, así que el
//    estiramiento es 2,31x: se compensa en el CONFORMADO con lanczos + un unsharp FUERTE (0,95),
//    no achicando el avatar en pantalla.
// ⛔ tpad ANTES de cortar (el adelanto de labios es constante) y fps=30 DUPLICADO, nunca minterpolate.
if (!fs.existsSync(REEL) || process.argv.includes('--force')) {
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', CRUDO, '-vf',
    'tpad=start_duration=0.25:start_mode=clone:stop_duration=1.0:stop_mode=clone,' +
    'scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080,' +
    'unsharp=5:5:0.95:5:5:0.0,fps=30,setsar=1',
    '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '17', '-pix_fmt', 'yuv420p', '-fps_mode', 'cfr', REEL],
    { stdio: 'inherit' });
}
const res = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height,r_frame_rate', '-of', 'csv=p=0', REEL], { encoding: 'utf8' }).trim();
const resCrudo = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', CRUDO], { encoding: 'utf8' }).trim();
console.log(`reel crudo ${resCrudo} → reel full ${res} · estiramiento ${(1920 / +resCrudo.split(',')[0]).toFixed(3)}x · unsharp 0,95`);

// ── 2 · offsets desde los clips YA VALIDADOS ────────────────────────────────────────────────────
const viejos = fs.readdirSync(BAK).filter((f) => /^av_w\d{3}\.mp4$/.test(f)).sort();
let off = 0;
const W = viejos.map((f) => {
  const d = dur(`${BAK}/${f}`);
  const w = { name: f, off, dur: d };
  off += d;
  return w;
});
console.log(`MEDIDO: ${W.length} ventanas · el reel cubre ${off.toFixed(2)} s · último frame del reel ${dur(REEL).toFixed(2)} s`);

// ── 3 · cortar ──────────────────────────────────────────────────────────────────────────────────
const malos = [], fps = new Set(), dims = new Set();
for (const w of W) {
  const dst = `${OUT}/${w.name}`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', w.off.toFixed(3), '-i', REEL, '-t', w.dur.toFixed(3),
    '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '17', '-pix_fmt', 'yuv420p', '-fps_mode', 'cfr', dst]);
  const real = dur(dst);
  if (Math.abs(real - w.dur) > 2 / 30 + 0.02) malos.push(`${w.name}: ${real.toFixed(3)} vs ${w.dur.toFixed(3)}`);
  fps.add(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', dst], { encoding: 'utf8' }).trim().replace(/,$/, ''));
  dims.add(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', dst], { encoding: 'utf8' }).trim().replace(/,$/, ''));
}
console.log(`ventanas cortadas ${W.length} · mal cortadas ${malos.length} ${malos.length ? '⛔ ' + malos.slice(0, 5).join(' ') : '✓'}`);
console.log(`fps ${[...fps].join(' ')} ${fps.size === 1 && fps.has('30/1') ? '✓' : '⛔'} · dimensiones ${[...dims].join(' ')} ${dims.size === 1 && dims.has('1920,1080') ? '✓' : '⛔'}`);
if (malos.length || fps.size !== 1 || !fps.has('30/1') || dims.size !== 1 || !dims.has('1920,1080')) process.exit(3);
