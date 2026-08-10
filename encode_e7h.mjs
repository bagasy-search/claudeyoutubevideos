// encode_e7h.mjs — conforma los clips a 30fps CFR 1080p para matar el judder por fps-mismatch.
// mci (minterpolate) para los sub-30 con movimiento; fps=30 (muestreo) para el resto. Trim al largo usado.
import {execFileSync} from 'child_process';
import fs from 'fs';
const FF = 'C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe';
fs.mkdirSync('_e7h_raw', {recursive: true});

// name, largo_necesario_s, modo
const CLIPS = [
  ['stone_texture', 6.0, 'mci'],   // 25fps, push lento sobre muro casi estatico -> mci limpio
  ['crane_modern', 4.2, 'mci'],    // 23.976fps, movimiento simple
  ['pyramids_giza', 4.2, 'mci'],   // 23.976fps, paneo drone lento
  ['chisel_tool', 4.2, 'fps'],     // 24fps pero manos -> fps (evita smear de dedos)
  ['quarry_block', 4.0, 'fps'],    // 29.97
  ['machu_aerial', 3.6, 'fps'],    // 60
  ['inca_wall', 5.6, 'fps'],       // 60
  ['pyramid_close', 6.0, 'fps'],   // 29.97
  ['workers_silhou', 5.6, 'fps'],  // 60
  ['stars_time', 4.6, 'fps'],      // 59.94
  ['desert_ruins', 4.6, 'fps'],    // 29.97
  ['temple_columns', 8.6, 'fps'],  // 29.97
];

const SCALE = 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1';
for (const [name, len, mode] of CLIPS) {
  const src = `public/broll/e7h_${name}.mp4`;
  const bak = `_e7h_raw/e7h_${name}.mp4`;
  if (!fs.existsSync(bak)) fs.copyFileSync(src, bak); // backup original una vez
  const tmp = `public/broll/_tmp_${name}.mp4`;
  const vf = mode === 'mci'
    ? `${SCALE},minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`
    : `${SCALE},fps=30`;
  const args = ['-y', '-i', bak, '-t', String(len), '-vf', vf, '-an',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', tmp];
  process.stdout.write(`encoding ${name} (${mode}, ${len}s) ... `);
  try {
    execFileSync(FF, args, {stdio: ['ignore', 'ignore', 'pipe'], timeout: 300000});
    fs.renameSync(tmp, src);
    console.log('ok');
  } catch (e) {
    console.log('FAIL:', String(e.stderr || e).slice(-400));
  }
}
console.log('DONE');
