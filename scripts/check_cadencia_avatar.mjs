// check_cadencia_avatar.mjs — ¿el avatar de 25 fps se llevó a 30 con DUPLICACIÓN o con INTERPOLACIÓN?
//   node scripts/check_cadencia_avatar.mjs <avatar.mp4> [t1 t2 t3...]
//
// ⛔ POR QUÉ IMPORTA (medido en cmetemu, y costó CINCO reportes de "se ve lageado"):
//    25→30 fps se puede hacer de dos formas y sólo UNA se ve bien.
//      · `fps=30` (duplicación)  → ciclo de 6: 5 pasos PAREJOS + 1 cuadro REPETIDO  ✅ validado por el creador
//      · `minterpolate mci`      → ciclo de 6: los 6 pasos DISTINTOS y DESPAREJOS   ⛔ se lee como tirón
//    El movimiento irregular se lee peor que una repetición pareja, justamente por ser irregular.
//
// LA COMPUERTA: en cada tramo, medir la diferencia media entre cuadros consecutivos por POSICIÓN
// dentro del ciclo de 6. Tiene que haber EXACTAMENTE UNA posición por debajo de 0,5.
// Si no hay ninguna → se coló `minterpolate`. Si hay más de una → el video está quieto ahí
// (elegí otro tramo: hay que medir donde el presentador se MUEVE).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const mp4 = process.argv[2];
if (!mp4 || !fs.existsSync(mp4)) { console.error('uso: node scripts/check_cadencia_avatar.mjs <avatar.mp4> [t1 t2 t3]'); process.exit(1); }
const tiempos = process.argv.slice(3).map(Number).filter(n => !isNaN(n));
const TS = tiempos.length ? tiempos : [120, 400, 700];

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cad-'));
console.log('═'.repeat(64));
console.log('AVATAR: ' + mp4);
let tramosOk = 0, tramosMedidos = 0;

for (const t of TS) {
  // ⛔ La 1ª versión sacaba 60 PNG y después abría UN ffmpeg POR PNG para leerlos: 180 procesos
  //    por corrida, minutos de reloj, y le robaba la CPU al Whisper que corría al lado.
  //    ✅ UNA sola invocación: 60 cuadros directo a rawvideo gris por stdout, y se parten acá.
  const W = 96, H = 54, FR = W * H;
  const raw = execFileSync('ffmpeg', ['-v', 'error', '-ss', String(t), '-i', mp4,
    '-vf', `crop=iw/3:ih/3:iw/3:ih/6,scale=${W}:${H},format=gray`,
    '-frames:v', '60', '-vsync', '0', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'],
    { maxBuffer: 64 << 20 });
  const nF = Math.floor(raw.length / FR);
  if (nF < 30) { console.log('  t=' + t + 's: sólo ' + nF + ' cuadros, salteo'); continue; }
  const bufs = Array.from({ length: nF }, (_, i) => raw.subarray(i * FR, (i + 1) * FR));
  const diffs = [];
  for (let i = 1; i < bufs.length; i++) {
    let s = 0; const a = bufs[i - 1], b = bufs[i];
    const n = Math.min(a.length, b.length);
    for (let k = 0; k < n; k++) s += Math.abs(a[k] - b[k]);
    diffs.push(s / n);
  }
  // mediana por posición del ciclo de 6
  const ciclo = [];
  for (let p = 0; p < 6; p++) {
    const v = diffs.filter((_, i) => i % 6 === p).sort((x, y) => x - y);
    ciclo.push(v.length ? v[Math.floor(v.length / 2)] : 0);
  }
  const bajos = ciclo.filter(v => v < 0.5).length;
  const veredicto = bajos === 1 ? '✓ DUPLICACIÓN (correcto)'
    : bajos === 0 ? '⛔ INTERPOLACIÓN — se coló minterpolate'
      : '⚠️ ' + bajos + ' posiciones quietas: el avatar no se mueve acá, medí en otro tramo';
  console.log('  t=' + String(t).padStart(4) + 's  ciclo [' + ciclo.map(v => v.toFixed(2)).join(', ') + ']  → ' + veredicto);
  tramosMedidos++;
  if (bajos === 1) tramosOk++;
  // (ya no se escriben archivos intermedios)
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log('');
console.log('TRAMOS MEDIDOS: ' + tramosMedidos + '  ·  con cadencia correcta: ' + tramosOk);
if (tramosMedidos === 0) { console.error('⛔ no medí ningún tramo — no confíes en el verde'); process.exit(1); }
console.log('═'.repeat(64));
process.exit(tramosOk === tramosMedidos ? 0 : 2);
