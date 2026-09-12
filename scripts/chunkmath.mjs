// chunkmath.mjs — calcula el rango de frames [start,end] (INCLUSIVE) de un pedazo.
// Uso:  node scripts/chunkmath.mjs <totalFrames> <chunks> <idx>
// Imprime para GITHUB_OUTPUT:
//   start=<n>
//   end=<n>
const [total, chunks, idx] = process.argv.slice(2).map(Number);
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
