// stitch_local.mjs — pega los chunks del farm ACÁ, en segundos, en vez de esperar el `stitch`.
//
//   node scripts/stitch_local.mjs <run_id> <total_frames> [salida.mp4]
//   ej: node scripts/stitch_local.mjs 34683073871 42277 _v3/rkfob_cat.mp4
//
// ⭐ POR QUÉ EXISTE (medido 12-sep-2026, rkfob): el paso `stitch` del workflow NO "pega" los
//    pedazos — hace un RE-ENCODE COMPLETO con `libx264 -preset fast -crf 18` de todo el video en
//    un runner de DOS núcleos. Reales de este repo: clembudo 13-17 min · fasenales17 85 min ·
//    fasilla 101 min. Y está DUPLICADO: el re-encode de ENTREGA es obligatorio igual y ya aplica
//    el mismo `setpts=N/30/TB -r 30 -fps_mode cfr`.
//    El concat crudo con `-c copy` tarda SEGUNDOS: medido, 42.277 cuadros en 2,42 s a 583x.
//
//    Desde ahora `farm.mjs` manda `stitch_raw=1` por default, así que esto es el RESCATE para
//    corridas viejas (o para no esperar una que ya salió sin el flag).
//
// ⛔⛔ FALTA UN PEDAZO = NO SE CONCATENA. El demuxer `concat` de ffmpeg, si un archivo no está,
//    arma un MP4 truncado en el primer hueco SIN FALLAR. Por eso acá se exige que la suma de
//    cuadros de los chunks dé EXACTO el total de la composición.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const [runId, totalArg, outArg] = process.argv.slice(2);
if (!runId || !totalArg) {
  console.error('uso: node scripts/stitch_local.mjs <run_id> <total_frames> [salida.mp4]');
  process.exit(1);
}
const TOTAL = +totalArg;
const OUT = outArg || `_v3/cat_${runId}.mp4`;
const DIR = `_v3/chunks_${runId}`;

// ⛔ `-of csv=p=0` devuelve el valor CON UNA COMA AL FINAL ("705,") y `+"705," === NaN`.
//    No es que `nb_frames` venga N/A: ése es un diagnóstico falso. El roto es el parseo.
const num = (s) => { const m = String(s).match(/-?[0-9]+/); return m ? +m[0] : NaN; };
const cuadros = (p) => num(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
  '-show_entries', 'stream=nb_frames', '-of', 'csv=p=0', p]).toString());

if (!fs.existsSync(DIR) || !fs.readdirSync(DIR).length) {
  fs.mkdirSync(DIR, { recursive: true });
  console.log('bajando los artifacts del run ' + runId + ' …');
  const r = spawnSync('gh', ['run', 'download', runId, '-D', DIR], { stdio: 'inherit' });
  if (r.status !== 0) { console.error('⛔ no pude bajar los artifacts'); process.exit(2); }
}

const dirs = fs.readdirSync(DIR).filter(d => /^chunk-\d+$/.test(d))
  .sort((a, b) => +a.split('-')[1] - +b.split('-')[1]);
console.log('═'.repeat(66));
console.log('CHUNKS: ' + dirs.length + ' en ' + DIR);
if (!dirs.length) { console.error('⛔ 0 chunks — el medidor no midió nada'); process.exit(1); }

const root = process.cwd().replace(/\\/g, '/');
const lines = [];
const faltan = new Set(Array.from({ length: dirs.length }, (_, i) => i));
let suma = 0, rotos = [];
for (const d of dirs) {
  faltan.delete(+d.split('-')[1]);
  const f = fs.readdirSync(path.join(DIR, d)).find(x => x.endsWith('.mp4'));
  if (!f) { rotos.push(d + ' (sin mp4)'); continue; }
  const p = `${DIR}/${d}/${f}`;
  const n = cuadros(p);
  if (!Number.isFinite(n) || n <= 0) { rotos.push(d + ' (sin cuadros legibles)'); continue; }
  suma += n;
  lines.push(`file '${root}/${p}'`);
}
console.log('ROTOS   : ' + rotos.length + (rotos.length ? '  ⛔ ' + rotos.join(' · ') : '  ✓'));
console.log('ÍNDICES FALTANTES: ' + (faltan.size ? [...faltan].join(' ') + '  ⛔' : 'ninguno  ✓'));
console.log('CUADROS : ' + suma + ' vs ' + TOTAL + ' esperados → ' +
  (suma === TOTAL ? '✓ EXACTO' : '⛔ difieren en ' + (TOTAL - suma)));
if (rotos.length || faltan.size || suma !== TOTAL) {
  console.error('\n⛔ NO concateno: saldría un MP4 truncado en el primer hueco, sin que ffmpeg falle.');
  process.exit(3);
}

const lista = `${DIR}/_concat.txt`;
fs.writeFileSync(lista, lines.join('\n'));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
console.log('\nconcatenando con -c copy …');
const r = spawnSync('ffmpeg', ['-v', 'error', '-stats', '-f', 'concat', '-safe', '0',
  '-i', lista, '-c', 'copy', '-y', OUT], { stdio: ['ignore', 'inherit', 'inherit'] });
if (r.status !== 0) { console.error('⛔ el concat falló'); process.exit(4); }

const nb = num(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-count_packets',
  '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', OUT]).toString());
console.log('\nSALIDA  : ' + OUT + '  ·  cuadros ' + nb + '  ' + (nb === TOTAL ? '✓' : '⛔'));
console.log('⚠️ Este archivo TIENE el salto de tiempo en cada costura y NO es CFR — es lo esperado.');
console.log('   Lo arregla el RE-ENCODE DE ENTREGA, que es obligatorio igual.');
console.log('═'.repeat(66));
process.exit(nb === TOTAL ? 0 : 5);
