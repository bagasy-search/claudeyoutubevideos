// Verifica que TODO staticFile() referenciado por el build exista en public/.
// Un solo asset faltante hace 404 en el farm y se cae el chunk entero.
import fs from 'fs';

const s = fs.readFileSync('src/beats_vn2vhn3n8eqs.ts', 'utf8');
const refs = [...s.matchAll(/staticFile\('([^']+)'\)/g)].map((m) => m[1]);
const uniq = [...new Set(refs)];
const missing = uniq.filter((r) => !fs.existsSync('public/' + r));
const zero = uniq.filter((r) => {
  try {
    return fs.existsSync('public/' + r) && fs.statSync('public/' + r).size < 1024;
  } catch {
    return false;
  }
});

console.log('referencias únicas:', uniq.length);
console.log('  imágenes:', uniq.filter((r) => r.startsWith('img/')).length);
console.log('  clips   :', uniq.filter((r) => r.startsWith('broll/')).length);
console.log('  avatar  :', uniq.filter((r) => r.endsWith('.mp4') && !r.startsWith('broll/')).length);
if (zero.length) {
  console.log('\n⚠ ARCHIVOS VACÍOS/CORRUPTOS (' + zero.length + '):');
  zero.forEach((m) => console.log('  ' + m));
}
if (missing.length) {
  console.log('\n❌ FALTAN ' + missing.length + ':');
  missing.forEach((m) => console.log('  ' + m));
  process.exit(1);
}
console.log('\n✅ todos los assets presentes');
