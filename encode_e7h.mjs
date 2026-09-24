// encode_e7h.mjs — conforma los clips del HOOK a 30fps CFR 1080p SIN inventar ni duplicar frames.
//
// v1: fps mezclados (24/25/60/29.97) en timeline 30fps → judder.
// v2: se usó minterpolate (mci) en los sub-30 → INVENTA frames por estimación de movimiento y
//     deforma en agua/follaje/drones. Se percibe como que el clip se traba. Ese fue el bug real.
// v3 (esto): 24 y 25 fps se RALENTIZAN con setpts para que cada frame original ocupe exactamente
//     un frame de la timeline. 60 → se toma 1 de cada 2. Ni un frame inventado ni duplicado.
import {execFileSync} from 'child_process';
import fs from 'fs';

const BIN = 'C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin';
const FF = `${BIN}/ffmpeg.exe`, FP = `${BIN}/ffprobe.exe`;
fs.mkdirSync('_e7h_raw', {recursive: true});

// name, largo_necesario_s  (al ralentizar sobra material, así que el largo pedido siempre entra)
const CLIPS = [
  ['stone_texture', 7.0], ['crane_modern', 5.0], ['pyramids_giza', 5.0], ['chisel_tool', 5.0],
  ['quarry_block', 5.0], ['machu_aerial', 4.5], ['inca_wall', 6.5], ['pyramid_close', 7.0],
  ['workers_silhou', 6.5], ['stars_time', 5.5], ['desert_ruins', 5.5], ['temple_columns', 9.5],
];

const SCALE = 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1';
let ok = 0, fail = 0;
for (const [name, len] of CLIPS) {
  const src = `public/broll/e7h_${name}.mp4`;
  const bak = `_e7h_raw/e7h_${name}.mp4`;
  if (!fs.existsSync(bak)) fs.copyFileSync(src, bak);

  let fps = 30;
  try {
    const r = execFileSync(FP, ['-v', 'error', '-select_streams', 'v:0', '-show_entries',
      'stream=r_frame_rate', '-of', 'csv=p=0', bak], {encoding: 'utf8'}).trim();
    const [n, d] = r.split('/').map(Number);
    fps = d ? n / d : n;
  } catch {}

  const vf = fps >= 59
    ? `${SCALE},fps=30`                                                  // diezmado exacto 2:1
    : `${SCALE},setpts=PTS*${(30 / fps).toFixed(6)},fps=30`;             // ralentizado exacto
  const modo = fps >= 59 ? 'diezmado 2:1' : `ralentizado ×${(30 / fps).toFixed(3)}`;

  const tmp = `public/broll/_tmp_${name}.mp4`;
  process.stdout.write(`${name.padEnd(18)} ${fps.toFixed(2).padStart(6)}fps → ${modo.padEnd(18)} `);
  try {
    execFileSync(FF, ['-y', '-i', bak, '-vf', vf, '-t', String(len), '-an',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart', tmp], {stdio: ['ignore', 'ignore', 'pipe'], timeout: 300000});
    fs.renameSync(tmp, src);
    console.log('ok');
    ok++;
  } catch (e) {
    console.log('FAIL:', String(e.stderr || e).slice(-160));
    try { fs.unlinkSync(tmp); } catch {}
    fail++;
  }
}
console.log(`\n${ok} ok · ${fail} fallaron`);
console.log('DONE');
