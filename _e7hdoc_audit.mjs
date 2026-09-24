// _e7hdoc_audit.mjs — AUDITOR del documental: saca frames del MP4 que rindió el farm y arma
// contact sheets por bloque. Elige los momentos por el TIMELINE (no a ojo): prioriza los planos
// que llevan componente, que son los que pueden salir ilegibles o pisados.
import {execFileSync} from 'child_process';
import fs from 'fs';

const BIN = 'C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin';
const MP4 = process.argv[2] || 'D:/videosdeclaude/e7hdoc.mp4';
const OUT = '_e7hdoc_a';
fs.mkdirSync(OUT, {recursive: true});

const tl = JSON.parse(fs.readFileSync('_v3/e7hdoc_timeline.json', 'utf8'));
const BLOQUES = ['pro', 'bk', 'gz', 'sq', 'pp', 'kl', 'yg', 'gt', 'cl'];

// por bloque: hasta 5 planos CON componente, tomando el frame a 2/3 del plano (ya animó del todo)
const elegidos = [];
for (const id of BLOQUES) {
  const conOv = tl.beats.filter((b) => b.bloque === id && (b.ov || []).length);
  const paso = Math.max(1, Math.floor(conOv.length / 5));
  for (let i = 0; i < conOv.length && elegidos.filter((e) => e.bloque === id).length < 5; i += paso) {
    const b = conOv[i];
    elegidos.push({bloque: id, comp: b.ov.map((o) => o.c).join('+'),
      s: b.s + Math.min(b.dur * 0.66, 2.6), at: b.at});
  }
}
console.log(`${elegidos.length} frames a extraer`);

elegidos.forEach((e, i) => {
  const n = Math.round(e.s * 30);
  const dest = `${OUT}/f${String(i).padStart(2, '0')}_${e.bloque}.jpg`;
  try {
    execFileSync(`${BIN}/ffmpeg.exe`, ['-y', '-v', 'error', '-i', MP4,
      '-vf', `select=eq(n\\,${n})`, '-vsync', '0', '-frames:v', '1', '-q:v', '3', dest],
      {timeout: 300000});
    process.stdout.write('.');
  } catch { console.log(`\nFALLÓ frame ${n} (${e.bloque})`); }
});
console.log('');

// una hoja por cada 6 frames
const files = fs.readdirSync(OUT).filter((f) => f.startsWith('f') && f.endsWith('.jpg')).sort();
for (let h = 0; h * 6 < files.length; h++) {
  const grupo = files.slice(h * 6, h * 6 + 6);
  const ins = grupo.flatMap((f) => ['-i', `${OUT}/${f}`]);
  let fc = grupo.map((_, i) => `[${i}]scale=620:349,setsar=1[v${i}];`).join('');
  fc += grupo.map((_, i) => `[v${i}]`).join('');
  fc += grupo.length > 3 ? `xstack=inputs=${grupo.length}:layout=0_0|620_0|1240_0|0_349|620_349|1240_349`
                          : `hstack=${grupo.length}`;
  try {
    execFileSync(`${BIN}/ffmpeg.exe`, ['-y', '-v', 'error', ...ins, '-filter_complex', fc,
      '-frames:v', '1', '-q:v', '4', `${OUT}/hoja${h + 1}.jpg`], {timeout: 120000});
    console.log(`hoja${h + 1}.jpg  ← ${grupo.map((g) => g.slice(4, -4)).join(' ')}`);
  } catch (err) { console.log(`hoja${h + 1} falló:`, String(err).slice(-160)); }
}
fs.writeFileSync(`${OUT}/_mapa.json`, JSON.stringify(elegidos, null, 1));
console.log(`\nlisto → ${OUT}/`);
