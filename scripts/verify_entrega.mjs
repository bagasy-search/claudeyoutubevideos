// verify_entrega.mjs — compuertas sobre el MP4 YA re-encodeado, antes de entregarlo.
//   node scripts/verify_entrega.mjs <final.mp4> <master.wav>
//
// ⛔ DOS BUGS DE MEDICIÓN QUE TUVO LA PRIMERA VERSIÓN DE ESTO (12-sep-2026, rkfob):
//  1. `ffprobe -of csv=p=0` devuelve el valor CON UNA COMA AL FINAL ("30/1,"), así que
//     `rfr === '30/1'` daba FALSO sobre un archivo perfecto y cantaba "⛔ deriva".
//  2. `pkt_pts_time` ya NO existe en ffprobe nuevo (es `pts_time`): la consulta devolvía CERO
//     cuadros y el chequeo imprimía **"0 fuera de cadencia ✓"**. Un verde sobre cero mediciones.
//     Por eso cada compuerta de acá imprime CUÁNTO midió y aborta si midió nada.
import fs from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';

const MP4 = process.argv[2];
const WAV = process.argv[3];
if (!MP4 || !fs.existsSync(MP4)) { console.error('uso: node scripts/verify_entrega.mjs <final.mp4> <master.wav>'); process.exit(1); }

const probe = (args) => execFileSync('ffprobe', ['-v', 'error', ...args]).toString().trim();
const limpio = (s) => s.replace(/,+\s*$/, '').trim();       // ⛔ la coma de csv=p=0
const num = (s) => { const m = String(s).match(/-?[0-9.]+/); return m ? +m[0] : NaN; };

console.log('═'.repeat(66));
console.log('ARCHIVO: ' + MP4 + '  (' + (fs.statSync(MP4).size / 1048576).toFixed(0) + ' MB)');
let fallas = 0;

// 1) streams
const streams = probe(['-show_entries', 'stream=codec_type,codec_name,channels,sample_rate', '-of', 'csv=p=0', MP4]);
const hayAudio = /audio/.test(streams);
const hayVideo = /video/.test(streams);
console.log('\n1) STREAMS       video ' + (hayVideo ? '✓' : '⛔') + ' · audio ' + (hayAudio ? '✓' : '⛔ NO TIENE'));
console.log('   ' + streams.split('\n').join('\n   '));
if (!hayAudio || !hayVideo) fallas++;

// 2) cadencia — comparando VALORES LIMPIOS
const rfr = limpio(probe(['-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', MP4]));
const afr = limpio(probe(['-select_streams', 'v:0', '-show_entries', 'stream=avg_frame_rate', '-of', 'csv=p=0', MP4]));
const cadOk = rfr === afr && rfr === '30/1';
console.log('\n2) CADENCIA      r_frame_rate=' + rfr + ' · avg_frame_rate=' + afr + '  ' + (cadOk ? '✓' : '⛔ deriva del farm sin corregir'));
if (!cadOk) fallas++;

// 3) color
const pix = limpio(probe(['-select_streams', 'v:0', '-show_entries', 'stream=pix_fmt', '-of', 'csv=p=0', MP4]));
const rango = limpio(probe(['-select_streams', 'v:0', '-show_entries', 'stream=color_range', '-of', 'csv=p=0', MP4]));
const colOk = pix === 'yuv420p' && rango === 'tv';
console.log('3) COLOR         ' + pix + ' / ' + rango + '  ' + (colOk ? '✓' : '⛔ (va yuv420p + tv; yuvj420p/pc es el del farm)'));
if (!colOk) fallas++;

// 4) duración contra el wav máster
if (WAV && fs.existsSync(WAV)) {
  const dV = num(probe(['-show_entries', 'format=duration', '-of', 'csv=p=0', MP4]));
  const dA = num(probe(['-show_entries', 'format=duration', '-of', 'csv=p=0', WAV]));
  const ms = Math.abs(dV - dA) * 1000;
  console.log('4) DURACIÓN      ' + dV.toFixed(3) + ' s vs wav ' + dA.toFixed(3) + ' → ' + ms.toFixed(0) + ' ms  ' +
    (ms < 250 ? '✓' : '⛔ deliver_card lo rechaza'));
  if (ms >= 250) fallas++;
} else console.log('4) DURACIÓN      (sin wav para comparar)');

// 5) nivel de audio en 4 puntos, el último DENTRO del último minuto
const dur = num(probe(['-show_entries', 'format=duration', '-of', 'csv=p=0', MP4]));
console.log('\n5) NIVEL DE AUDIO:');
let mudos = 0, medidos = 0;
for (const t of [30, Math.round(dur * 0.35), Math.round(dur * 0.7), Math.round(dur - 40)]) {
  const s = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-ss', String(t), '-t', '8', '-i', MP4,
    '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = String(s.stderr || '').match(/mean_volume:\s*(-?[\d.]+)/);
  if (!m) { console.log('   t=' + t + 's  ⛔ no pude medir'); mudos++; continue; }
  medidos++;
  const v = parseFloat(m[1]);
  const malo = v < -50;
  if (malo) mudos++;
  console.log('   t=' + String(t).padStart(5) + 's  mean ' + v.toFixed(1) + ' dB  ' + (malo ? '⛔ SILENCIO' : '✓'));
}
console.log('   medidos ' + medidos + '/4' + (medidos < 4 ? '  ⛔ NO confíes en el verde' : ''));
if (mudos || medidos < 4) fallas++;

// 6) CADENCIA REAL cuadro a cuadro — `pts_time`, NO `pkt_pts_time` (ya no existe)
const pk = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
  '-show_entries', 'frame=pts_time', '-read_intervals', '%+#1200', '-of', 'csv=p=0', MP4], { encoding: 'utf8', maxBuffer: 32 << 20 });
const ts = String(pk.stdout || '').split('\n').map(limpio).map(num).filter(x => Number.isFinite(x));
let fuera = 0;
for (let i = 1; i < ts.length; i++) if (Math.abs((ts[i] - ts[i - 1]) - 1 / 30) > 0.004) fuera++;
console.log('\n6) CUADROS FUERA DE 1/30:  medidos ' + ts.length + ' · fuera ' + fuera + '  ' +
  (ts.length < 100 ? '⛔ MEDÍ CASI NADA — el medidor está roto, no el archivo' : fuera === 0 ? '✓' : '⛔'));
if (ts.length < 100 || fuera) fallas++;

// 7) negros
const bd = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', MP4, '-vf', 'blackdetect=d=0.5:pix_th=0.10', '-an', '-f', 'null', '-'],
  { encoding: 'utf8', maxBuffer: 64 << 20 });
const negros = [...String(bd.stderr || '').matchAll(/black_start:([\d.]+)[^\n]*black_duration:([\d.]+)/g)];
console.log('\n7) NEGROS ≥0,5 s: ' + negros.length + (negros.length ? '  ⛔' : '  ✓'));
for (const n of negros.slice(0, 10)) console.log('   ⛔ ' + Math.floor(+n[1] / 60) + ':' + String(Math.round(+n[1] % 60)).padStart(2, '0') + '  ' + (+n[2]).toFixed(2) + ' s');
if (negros.length) fallas++;

console.log('\n' + '═'.repeat(66));
console.log(fallas ? '⛔ ' + fallas + ' compuerta(s) en rojo — NO entregar' : '✓ TODAS LAS COMPUERTAS EN VERDE');
process.exit(fallas ? 2 : 0);
