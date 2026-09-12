// chunkplan.mjs — reparte los chunks por COSTO DE RENDER, no por cantidad de cuadros.
//
// ⛔ POR QUE EXISTE. El reloj de un render lo marca el chunk MAS LENTO, y partiendo por cuadros
// los chunks salen brutalmente desparejos. MEDIDO en fedagua60 (47 min, 200 chunks, 1-sep-2026):
// el mas lento tardo 35,1 min contra 4,3 de promedio — 8x. Y no se arregla partiendo mas chico:
// pasar de 60 a 200 chunks (3,3x) solo bajo la cola de 49,8 a 35,1, porque el costo NO esta
// repartido parejo: hay escenas 3D del kit que cuestan varias veces mas por cuadro que una foto.
//
// LOS PESOS SON MEDIDOS POR REGRESION, no estimados a ojo. Se ajusto por minimos cuadrados
// (no-negativos) sobre 400 chunks reales de DOS corridas de fedagua60: tiempo_del_chunk =
// suma(segundos de cada kind x costo del kind). Error medio 1,01 min sobre un promedio de 4,4.
// `raw` (foto quieta) = 0,183 min de CPU por segundo de video; el resto va en multiplos de eso.
//
// ⛔ EL PRIMER INTENTO REPARTIO EL TIEMPO DEL CHUNK PROPORCIONAL A LOS SEGUNDOS DE CADA KIND, y
// eso SUBESTIMA sistematicamente lo caro: le regala a la foto parte del costo de la escena que
// comparte el chunk. Daba malla 5.3x cuando la realidad es 17.8x. Medido: un chunk con 3,1 s de
// malla tardo 14,2 min (4,6 min por segundo de video).
// Para re-medir sobre otro video: duracion por job (gh run view --json jobs) + los rangos usados,
// y ajustar la misma regresion.
//
//   node scripts/chunkplan.mjs <beatsheet.json> <totalFrames> <chunks> [fps=30]
//   -> imprime "a-b,a-b,..." (rangos INCLUSIVOS, listos para -f ranges=)
import fs from "node:fs";

const PESO = { malla: 17.8, whynight: 14.2, ingredientduo: 10.8, skinlayer: 10.6,
  beforeafter: 8, lineatiempo: 7.3, bodymap: 6.9, carrusel: 4.6, bars: 4.6, listaflotante: 4.1,
  colador: 4.1, comparaprof: 3.7, pliegue: 3.7, datoimpacto: 3.6, barcompare: 3.1,
  recetaescena: 2.8, pricewar: 2.8, guidecta: 2.1, splitcompare: 1.8,
};
const PESO_DEFAULT = 1.0;

const [bsPath, totalStr, chunksStr, fpsStr] = process.argv.slice(2);
const total = Number(totalStr), N = Number(chunksStr), fps = Number(fpsStr || 30);
if (!bsPath || !total || !N) { console.error("uso: chunkplan.mjs <beatsheet.json> <totalFrames> <chunks> [fps]"); process.exit(1); }

let beats;
try { beats = JSON.parse(fs.readFileSync(bsPath, "utf8")).beats; } catch { beats = null; }
if (!Array.isArray(beats) || !beats.length) {
  // sin beatsheet no hay nada que pesar: reparto uniforme (mismo resultado que antes)
  const size = Math.ceil(total / N);
  const out = [];
  for (let i = 0; i < N; i++) { const a = i * size, b = Math.min((i + 1) * size - 1, total - 1); out.push(a > b ? `${total - 1}-${total - 1}` : `${a}-${b}`); }
  console.log(out.join(","));
  process.exit(0);
}

// peso por SEGUNDO = el mas caro de los beats que lo tapan (un componente encima de una foto
// cuesta lo del componente, no lo de la foto)
const dur = (b) => (b.cov != null ? b.cov : b.dur);
const segs = Math.ceil(total / fps);
const w = new Float64Array(segs).fill(PESO_DEFAULT);
for (const b of beats) {
  const p = PESO[b.kind] ?? PESO_DEFAULT;
  if (p <= PESO_DEFAULT) continue;
  const s = Math.max(0, Math.floor(b.start)), e = Math.min(segs - 1, Math.ceil(b.start + dur(b)));
  for (let t = s; t <= e; t++) if (p > w[t]) w[t] = p;
}
// costo acumulado por FRAME (interpolando el peso del segundo al que pertenece)
const cum = new Float64Array(total + 1);
for (let f = 0; f < total; f++) cum[f + 1] = cum[f] + w[Math.min(segs - 1, Math.floor(f / fps))];
const objetivo = cum[total] / N;

const out = [];
let start = 0;
for (let i = 0; i < N; i++) {
  if (start >= total) { out.push(`${total - 1}-${total - 1}`); continue; }
  if (i === N - 1) { out.push(`${start}-${total - 1}`); start = total; continue; }
  const meta = cum[start] + objetivo;
  // busqueda binaria del frame donde el acumulado alcanza la meta
  let lo = start + 1, hi = total;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] < meta) lo = mid + 1; else hi = mid; }
  const end = Math.max(start, Math.min(total - 1, lo - 1));
  out.push(`${start}-${end}`);
  start = end + 1;
}
console.log(out.join(","));
