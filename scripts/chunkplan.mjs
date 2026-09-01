// chunkplan.mjs — reparte los chunks por COSTO DE RENDER, no por cantidad de cuadros.
//
// ⛔ POR QUE EXISTE. El reloj de un render lo marca el chunk MAS LENTO, y partiendo por cuadros
// los chunks salen brutalmente desparejos. MEDIDO en fedagua60 (47 min, 200 chunks, 1-sep-2026):
// el mas lento tardo 35,1 min contra 4,3 de promedio — 8x. Y no se arregla partiendo mas chico:
// pasar de 60 a 200 chunks (3,3x) solo bajo la cola de 49,8 a 35,1, porque el costo NO esta
// repartido parejo: hay escenas 3D del kit que cuestan varias veces mas por cuadro que una foto.
//
// LOS PESOS SON MEDIDOS, no inventados: se cruzo la duracion real de los 200 chunks contra el
// contenido de cada rango, repartiendo el tiempo entre los kinds presentes. Costo en minutos de
// CPU por segundo de video, con la foto (`raw`) = 1:
//     malla 5.3 · skinlayer 3.9 · whynight 3.5 · ingredientduo 3.5 · lineatiempo 3.0 · bodymap 2.6
//     bars 2.3 · carrusel 1.8 · pizarraglicacion 1.8 · colador 1.7 · listaflotante 1.7
//     beforeafter 1.7 · el resto ~1
// Para re-medir sobre otro video: duracion por job de la corrida (gh run view --json jobs) cruzada
// con los beats de cada rango.
//
//   node scripts/chunkplan.mjs <beatsheet.json> <totalFrames> <chunks> [fps=30]
//   -> imprime "a-b,a-b,..." (rangos INCLUSIVOS, listos para -f ranges=)
import fs from "node:fs";

const PESO = {
  malla: 5.3, skinlayer: 3.9, whynight: 3.5, ingredientduo: 3.5, lineatiempo: 3.0,
  bodymap: 2.6, bars: 2.3, carrusel: 1.8, pizarraglicacion: 1.8, colador: 1.7,
  listaflotante: 1.7, beforeafter: 1.7,
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
