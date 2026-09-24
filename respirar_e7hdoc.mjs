// respirar_e7hdoc.mjs — alarga las PAUSAS de la narración sin regenerarla.
// El clon habla a ~149 palabras/min: apurado para documental (el registro del género va a 120-130).
// Detecta los silencios que ya existen y los expande, así el texto respira y la duración sube.
// No toca la voz: corta en los silencios y vuelve a pegar con más aire.
import {execFileSync, spawnSync} from 'child_process';
import fs from 'fs';

const BIN = 'C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin';
const FF = `${BIN}/ffmpeg.exe`, FP = `${BIN}/ffprobe.exe`;
const OBJETIVO = Number(process.env.OBJETIVO || 1500);   // segundos de VO que quiero
const SR = 24000;

const partes = fs.readdirSync('_e7hdoc_partes').filter((f) => /^\d\d_.*\.wav$/.test(f)).sort();
const dur = (f) => Number(execFileSync(FP, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], {encoding: 'utf8'}).trim());

// 1) inventario de silencios
const info = [];
let totalVoz = 0, totalSil = 0, nSil = 0;
for (const p of partes) {
  const f = `_e7hdoc_partes/${p}`;
  // ffmpeg reporta silencedetect por STDERR, no por stdout
  const r = spawnSync(FF, ['-v', 'info', '-i', f, '-af', 'silencedetect=noise=-38dB:d=0.18', '-f', 'null', '-'],
    {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024});
  const salida = (r.stderr || '') + (r.stdout || '');
  // parsear starts y ends por SEPARADO y aparearlos en orden (el regex combinado se desalineaba)
  const starts = [...salida.matchAll(/silence_start: ([\d.-]+)/g)].map((x) => Number(x[1]));
  const ends = [...salida.matchAll(/silence_end: ([\d.-]+)/g)].map((x) => Number(x[1]));
  const sil = [];
  for (let i = 0; i < Math.min(starts.length, ends.length); i++) {
    const a = Math.max(0, starts[i]), b = ends[i];
    if (b > a + 0.05) sil.push([a, b]);
  }
  const d = dur(f);
  const s = sil.reduce((a, [x, y]) => a + (y - x), 0);
  info.push({f, d, sil});
  totalVoz += d; totalSil += s; nSil += sil.length;
}
console.log(`VO actual   : ${totalVoz.toFixed(1)}s`);
console.log(`silencios   : ${nSil} · ${totalSil.toFixed(1)}s (${(totalSil / totalVoz * 100).toFixed(0)}%)`);

const falta = OBJETIVO - totalVoz;
if (!nSil) { console.error('⛔ no detecté silencios — revisá el umbral'); process.exit(1); }
if (falta <= 2) { console.log('ya está en el objetivo, no toco nada'); process.exit(0); }
const extra = falta / nSil;
console.log(`objetivo    : ${OBJETIVO}s → faltan ${falta.toFixed(1)}s`);
console.log(`→ +${extra.toFixed(3)}s por pausa (${nSil} pausas)\n`);

// 2) cortar en cada silencio y volver a pegar con más aire
fs.mkdirSync('_e7hdoc_resp', {recursive: true});
const silFile = '_e7hdoc_resp/_pausa.wav';
execFileSync(FF, ['-y', '-v', 'error', '-f', 'lavfi', '-t', extra.toFixed(3),
  '-i', `anullsrc=r=${SR}:cl=mono`, '-c:a', 'pcm_f32le', silFile]);   // MISMO formato que la voz

const lista = [];
for (const {f, d, sil} of info) {
  const base = f.split('/').pop().replace('.wav', '');
  let cur = 0, k = 0;
  for (const [ini, fin] of sil) {
    if (fin <= cur + 0.02) continue;              // silencios solapados: los salteo
    const trozo = `_e7hdoc_resp/${base}_${String(k).padStart(3, '0')}.wav`;
    // corto voz + su silencio original, y después pego el aire extra
    execFileSync(FF, ['-y', '-v', 'error', '-i', f, '-ss', cur.toFixed(3), '-to', fin.toFixed(3),
      '-c', 'copy', trozo]);
    lista.push(trozo, silFile);
    cur = fin; k++;
  }
  const fin = `_e7hdoc_resp/${base}_${String(k).padStart(3, '0')}.wav`;
  execFileSync(FF, ['-y', '-v', 'error', '-i', f, '-ss', cur.toFixed(3), '-c', 'copy', fin]);
  lista.push(fin);
  process.stdout.write('.');
}
console.log(`
pausas insertadas: ${lista.filter((x) => x === silFile).length}`);

const txt = lista.map((x) => `file '${x.split('/').pop()}'`).join('\n');
fs.writeFileSync('_e7hdoc_resp/_concat.txt', txt + '\n');
fs.copyFileSync(silFile, '_e7hdoc_resp/_pausa.wav');
execFileSync(FF, ['-y', '-v', 'error', '-f', 'concat', '-safe', '0',
  '-i', '_e7hdoc_resp/_concat.txt', '-c', 'copy', 'public/e7hdoc.wav']);

console.log(`\nVO nuevo: ${dur('public/e7hdoc.wav').toFixed(1)}s`);
