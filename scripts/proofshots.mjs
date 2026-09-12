// ═══════════════════════════════════════════════════════════════════════════
// proofshots.mjs — stills del BANCO DE PRUEBAS del kit premium, con UN SOLO
// bundle. `npx remotion still` re-bundlea y recarga las fuentes en CADA
// llamada (~3 min por still); acá se bundlea una vez y se rinden N frames
// (~10 s por frame). Es la forma de ITERAR sobre componentes.
//
//   node scripts/proofshots.mjs <outDir> [comp] [entry]
//   node scripts/proofshots.mjs _proof/after
//
// Los frames salen del centro de cada página del StageProof (página*90+62).
// ═══════════════════════════════════════════════════════════════════════════
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const OUT = process.argv[2] || "_proof/after";
const COMP = process.argv[3] || "StageProof";
const ENTRY = process.argv[4] || "src/index-proof.ts";
const PAGE = 180;

// El .bin de node_modules quedó sin linkear en esta máquina y Remotion re-baja
// el chrome-headless-shell (EPERM si otro proceso lo tiene). Usamos el que ya está.
const BROWSER = path.resolve(
  "node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe",
);

const outDir = path.resolve(OUT);
fs.mkdirSync(outDir, { recursive: true });

// C: vive al borde y public/ pesa ~32 GB: el bundler la copia ENTERA al TEMP.
// Para el banco de pruebas alcanza un public MÍNIMO (_proof/pub) y el bundle
// va a D:. Sin esto: ENOSPC.
const SLIM_PUB = path.resolve("_proof/pub");
const BUNDLE_DIR = "D:/tmp/remotion-proof-bundle";
for (const d of ["D:/tmp", BUNDLE_DIR]) fs.mkdirSync(d, { recursive: true });
process.env.TMPDIR = process.env.TEMP = process.env.TMP = "D:/tmp";

console.log("→ bundle…");
const serveUrl = await bundle({
  entryPoint: path.resolve(ENTRY),
  outDir: BUNDLE_DIR,
  publicDir: fs.existsSync(SLIM_PUB) ? SLIM_PUB : undefined,
  onProgress: (p) => {
    if (p % 25 === 0) process.stdout.write(`  ${p}%\r`);
  },
});
console.log("\n→ composición…");
const browserExecutable = fs.existsSync(BROWSER) ? BROWSER : undefined;
const composition = await selectComposition({ serveUrl, id: COMP, inputProps: {}, browserExecutable });
const pages = Math.round(composition.durationInFrames / PAGE);
console.log(`  ${composition.width}x${composition.height}, ${pages} páginas`);

// DOS muestras por página: una a mitad de beat y otra casi al final. La segunda
// es la que caza lo que aparece TARDE (sellos, tildes finales, CTA) — que es
// justo donde estaban las colisiones que el still del medio no mostraba.
const OFFSETS = [70, 150];
for (let i = 0; i < pages; i++) {
  for (const off of OFFSETS) {
    const frame = i * PAGE + off;
    const output = path.join(outDir, `p${i}${off === OFFSETS[0] ? "" : "_late"}.png`);
    process.stdout.write(`→ p${i}@${off} (frame ${frame})… `);
    const t0 = Date.now();
    await renderStill({
      composition,
      serveUrl,
      output,
      frame,
      browserExecutable,
      overwrite: true,
      logLevel: "error",
    });
    console.log(`${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
}
console.log(`\n✓ ${pages * OFFSETS.length} stills en ${OUT}`);
