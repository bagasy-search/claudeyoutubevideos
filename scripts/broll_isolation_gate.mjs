// scripts/broll_isolation_gate.mjs <slug>
// GATE DE AISLAMIENTO DE B-ROLL. Falla (exit 1) si el build de un video referencia clips de b-roll
// que NO están aislados bajo public/broll/<slug>/. Esa era la causa del cruce de clips entre videos
// (el video de la sábila salió con clips de KIWI de otro video hecho a la par): el b-roll se bajaba a
// public/broll/ con nombres genéricos dNNN.mp4 y el fetcher salteaba los que ya existían, así que el
// 2º video heredaba los del 1º. Regla: cada video referencia SOLO broll/<slug>/... — nada a pelo.
import fs from "fs";
import path from "path";

const slug = process.argv[2];
if (!slug) { console.error("uso: node scripts/broll_isolation_gate.mjs <slug>"); process.exit(2); }

// junta los archivos de build relevantes de este slug (Main/index/broll/dense) + los que lo nombran
const files = [];
(function walk(dir) {
  let entries; try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!/node_modules|\.git/.test(p)) walk(p); }
    // SOLO los archivos de build de ESTE slug (su Main/index/broll/beats/dense lo llevan en el nombre).
    // NO el catch-all genérico: eso agarraba los *_broll.ts de OTROS videos y daba falsos positivos.
    else if (/\.(tsx?|jsx?|mjs|json)$/.test(e.name) && e.name.includes(slug)) files.push(p);
  }
})("src");
const manifest = `public/broll/dense_${slug}.json`;
if (fs.existsSync(manifest)) files.push(manifest);

// Busca CUALQUIER literal string que sea un .mp4 (con o sin "broll/" adelante — el kit _fed6 referencia
// los clips por nombre PELADO con la carpeta como constante aparte, así que exigir "broll/" tenía un
// punto ciego). Un clip GENÉRICO (dNNN / rbNNN / cNNN…) que NO lleva el slug es colisión entre videos.
const reLit = /["'`]([^"'`]*?\.mp4)["'`]/g;
const genericClip = /^[a-z]{1,5}\d{2,4}\.mp4$/i;   // d000.mp4, rb087.mp4, c12.mp4, dvl003.mp4, etc.
const bad = new Set();
let total = 0, isolated = 0;
for (const f of files) {
  let txt; try { txt = fs.readFileSync(f, "utf8"); } catch { continue; }
  let m;
  while ((m = reLit.exec(txt))) {
    const ref = m[1];                        // p.ej. "d000.mp4" · "broll/d000.mp4" · "broll/<slug>/d000.mp4" · "<slug>_d000.mp4"
    const base = ref.split("/").pop();       // nombre del archivo
    if (!genericClip.test(base)) continue;   // ignora imágenes con nombre propio / assets no-clip
    total++;
    // AISLADO si el slug aparece en el path (subcarpeta broll/<slug>/…) o en el nombre (<slug>_…).
    if (ref.includes(slug)) { isolated++; continue; }
    bad.add(`${path.relative(".", f)}  →  ${ref}`);
  }
}

if (bad.size) {
  console.error(`\n❌ B-ROLL SIN AISLAR — ${bad.size} referencia(s) de ${total} apuntan a broll/ compartida (riesgo de CRUCE de clips entre videos):`);
  for (const b of [...bad].slice(0, 25)) console.error("   " + b);
  if (bad.size > 25) console.error(`   … y ${bad.size - 25} más`);
  console.error(`\nFIX: bajá el b-roll con  node fetchstock.mjs public/broll/dense_${slug}.json --slug ${slug}`);
  console.error(`     (deja los clips en public/broll/${slug}/) y referencialos en el Main como  broll/${slug}/dNNN.mp4`);
  process.exit(1);
}
console.log(`✓ b-roll AISLADO: ${isolated}/${total} referencias van bajo broll/${slug}/ — sin riesgo de cruce.`);
