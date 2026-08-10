// encode_e7hdoc.mjs — conforma TODO el b-roll del documental a 30fps CFR 1080p.
// Mismo fix que el hook: fps mezclados (24/25/60/29.97) en timeline 30fps = judder.
// Detecta el fps de origen y elige el modo: sub-30 → mci (interpola), resto → fps=30 (remuestrea).
// Recorta a LEN s para que el tar del farm no explote. Respalda en _e7hdoc_raw/.
import {execFileSync} from 'child_process';
import fs from 'fs';

const BIN = 'C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin';
const FF = `${BIN}/ffmpeg.exe`, FP = `${BIN}/ffprobe.exe`;
const LEN = Number(process.env.LEN || 9);          // segundos que conservo de cada clip
const SCALE = 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1';

fs.mkdirSync('_e7hdoc_raw', {recursive: true});
const clips = fs.readdirSync('public/broll').filter((f) => f.startsWith('e7hd_') && f.endsWith('.mp4'));
console.log(`${clips.length} clips a conformar (${LEN}s c/u)\n`);

let ok = 0, fail = 0, saltados = 0;
for (const file of clips) {
  const src = `public/broll/${file}`;
  const bak = `_e7hdoc_raw/${file}`;
  if (!fs.existsSync(bak)) fs.copyFileSync(src, bak);

  // fps real del ORIGINAL
  let fps = 30;
  try {
    const r = execFileSync(FP, ['-v', 'error', '-select_streams', 'v:0', '-show_entries',
      'stream=r_frame_rate', '-of', 'csv=p=0', bak], {encoding: 'utf8'}).trim();
    const [n, d] = r.split('/').map(Number);
    fps = d ? n / d : n;
  } catch {}

  // ya está en 30 exacto y del largo correcto → no lo toco
  const yaOk = Math.abs(fps - 30) < 0.001;
  const mode = fps < 29.9 ? 'mci' : 'fps';
  const vf = mode === 'mci'
    ? `${SCALE},minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`
    : `${SCALE},fps=30`;

  const tmp = `public/broll/_tmp_${file}`;
  process.stdout.write(`${file.padEnd(28)} ${fps.toFixed(2).padStart(6)}fps ${yaOk ? '(ya 30)' : `→ ${mode}`} ... `);
  try {
    execFileSync(FF, ['-y', '-i', bak, '-t', String(LEN), '-vf', vf, '-an',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart', tmp], {stdio: ['ignore', 'ignore', 'pipe'], timeout: 300000});
    fs.renameSync(tmp, src);
    console.log('ok');
    ok++;
  } catch (e) {
    console.log('FAIL:', String(e.stderr || e).slice(-200));
    try { fs.unlinkSync(tmp); } catch {}
    fail++;
  }
}
console.log(`\n${ok} ok · ${fail} fallaron · ${saltados} saltados`);
console.log('DONE');
