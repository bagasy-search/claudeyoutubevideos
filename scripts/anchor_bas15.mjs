// Anclaje frase->frame para #16, usando _bastidarenal15_wordms.json (palabras del guion + ms).
import fs from 'fs';
const FPS = 30;
const wm = JSON.parse(fs.readFileSync('_bastidarenal15_wordms.json', 'utf8'));
const norm = (s) => s.toLowerCase().replace(/[áéíóúüñ]/g, (c) => ({'á':'a','é':'e','í':'i','ó':'o','ú':'u','ü':'u','ñ':'n'}[c])).replace(/[^0-9a-z ]/g, ' ').split(/\s+/).filter(Boolean);
const GW = wm.words.map((w) => norm(w)[0] || '');
export function anchorMs(phrase) {
  const q = norm(phrase);
  if (!q.length) return null;
  // buscar la subsecuencia q dentro de GW
  for (let i = 0; i + q.length <= GW.length; i++) {
    let ok = true;
    for (let k = 0; k < q.length; k++) if (GW[i + k] !== q[k]) { ok = false; break; }
    if (ok) return wm.ms[i];
  }
  // fallback: match de las primeras 3 palabras
  const q3 = q.slice(0, 3);
  for (let i = 0; i + q3.length <= GW.length; i++) {
    let ok = true;
    for (let k = 0; k < q3.length; k++) if (GW[i + k] !== q3[k]) { ok = false; break; }
    if (ok) return wm.ms[i];
  }
  return null;
}
export function anchorFrame(phrase) {
  const ms = anchorMs(phrase);
  return ms == null ? null : Math.round((ms / 1000) * FPS);
}
// CLI: node scripts/anchor_bas16.mjs "frase1" "frase2" ...
if (process.argv[2]) {
  for (const p of process.argv.slice(2)) {
    const f = anchorFrame(p);
    console.log(`${f == null ? 'NULL' : f}\t${p.slice(0, 60)}`);
  }
}
