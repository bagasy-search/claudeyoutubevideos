// chunkmath.mjs — calcula el rango de frames [start,end] (INCLUSIVE) de un pedazo.
// Uso:  node scripts/chunkmath.mjs <totalFrames> <chunks> <idx>
// Imprime para GITHUB_OUTPUT:
//   start=<n>
//   end=<n>
const [totalS, chunksS, idxS, ranges] = process.argv.slice(2);
const [total, chunks, idx] = [totalS, chunksS, idxS].map(Number);
// ⛔ RANGOS EXPLICITOS (chunkplan.mjs): reparto por COSTO de render, no por cuadros. El reloj lo
// marca el chunk mas lento y las escenas 3D del kit cuestan hasta 5x mas por cuadro que una foto.
// Si vienen, mandan; si no, se cae al reparto uniforme de siempre.
if (ranges) {
  const r = ranges.split(",")[idx];
  if (r) {
    const [a, b] = r.split("-").map(Number);
    if (Number.isFinite(a) && Number.isFinite(b) && a <= b) {
      console.log(`start=${a}`);
      console.log(`end=${b}`);
      process.exit(0);
    }
  }
  console.error(`chunkmath: rango invalido para idx=${idx} — caigo al reparto uniforme`);
}
const size = Math.ceil(total / chunks);
const start = idx * size;
const end = Math.min((idx + 1) * size - 1, total - 1);
if (start > end || start >= total) {
  // pedazo vacío (puede pasar si chunks no divide exacto) → rango degenerado de 1 frame
  console.log(`start=${total - 1}`);
  console.log(`end=${total - 1}`);
} else {
  console.log(`start=${start}`);
  console.log(`end=${end}`);
}
