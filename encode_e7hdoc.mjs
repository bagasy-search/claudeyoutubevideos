// encode_e7hdoc.mjs — conforma el b-roll a 30fps CFR SIN INVENTAR NI DUPLICAR FRAMES.
//
// Historia del bug (medido, no teórico):
//   v1: clips con fps mezclados (24/25/60/29.97) en timeline 30fps → judder.
//   v2: se "arregló" con minterpolate (mci) en los sub-30. Eso INVENTA frames por estimación de
//       movimiento y, en agua/follaje/drones/multitudes, deforma → se ve como que el clip se traba.
//       23 de 46 clips pasaron por ahí: por eso "la mayoría" se veían mal.
//   v3 (esto): para 24 y 25 fps se RALENTIZA el clip con setpts, de modo que cada frame original
//       ocupe EXACTAMENTE un frame de la timeline. Ni un frame inventado, ni uno duplicado.
//       El b-roll queda 20-25% más lento, que en documental juega a favor.
//   Para 60 → 30 se toma 1 de cada 2 (exacto). Para 29.97 → 30, setpts mínimo (0,1% más lento).
import {execFileSync} from 'child_process';
import fs from 'fs';

const BIN = 'C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin';
const FF = `${BIN}/ffmpeg.exe`, FP = `${BIN}/ffprobe.exe`;
const LEN = Number(process.env.LEN || 18);
const PREFIJO = process.env.PREFIJO || 'e7hd_';
const RAW = process.env.RAW || '_e7hdoc_raw';
const SCALE = 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1';

fs.mkdirSync(RAW, {recursive: true});
const clips = fs.readdirSync('public/broll').filter((f) => f.startsWith(PREFIJO) && f.endsWith('.mp4'));
console.log(`${clips.length} clips · destino 30fps CFR exacto · ${LEN}s\n`);

let ok = 0, fail = 0;
const resumen = {};
for (const file of clips) {
  const src = `public/broll/${file}`;
  const bak = `${RAW}/${file}`;
  if (!fs.existsSync(bak)) fs.copyFileSync(src, bak);

  let fps = 30;
  try {
    const r = execFileSync(FP, ['-v', 'error', '-select_streams', 'v:0', '-show_entries',
      'stream=r_frame_rate', '-of', 'csv=p=0', bak], {encoding: 'utf8'}).trim();
    const [n, d] = r.split('/').map(Number);
    fps = d ? n / d : n;
  } catch {}

  // factor de ralentización para que 1 frame original = 1 frame de timeline
  let vf, modo;
  if (fps >= 59) {                       // 60 o 59.94 → me quedo con la mitad de los frames (exacto)
    vf = `${SCALE},fps=30`;
    modo = 'diezmado 2:1';
  } else if (fps > 29.9) {               // 29.97 o 30 → prácticamente idéntico
    vf = `${SCALE},setpts=PTS*${(30 / fps).toFixed(6)},fps=30`;
    modo = `setpts ×${(30 / fps).toFixed(3)}`;
  } else {                               // 24, 23.976, 25 → RALENTIZO, no invento
    vf = `${SCALE},setpts=PTS*${(30 / fps).toFixed(6)},fps=30`;
    modo = `ralentizado ×${(30 / fps).toFixed(3)}`;
  }
  resumen[modo] = (resumen[modo] || 0) + 1;

  const tmp = `public/broll/_tmp_${file}`;
  process.stdout.write(`${file.padEnd(28)} ${fps.toFixed(2).padStart(6)}fps → ${modo.padEnd(18)} `);
  try {
    execFileSync(FF, ['-y', '-i', bak, '-vf', vf, '-t', String(LEN), '-an',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
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
console.log('modos:', Object.entries(resumen).map(([k, v]) => `${k}=${v}`).join(' · '));
console.log('DONE');
