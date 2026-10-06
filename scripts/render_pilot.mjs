// render_pilot.mjs — rinde el piloto a MP4 CON AUDIO (narración + SFX + tipeo).
// Los stills no muestran animación ni sonido; esto sí.
//
//   node scripts/render_pilot.mjs [salida.mp4] [comp] [entry]
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const OUT = path.resolve(process.argv[2] || "D:/videosdeclaude/moho_piloto_min1.mp4");
const COMP = process.argv[3] || "MohoPilot";
const ENTRY = process.argv[4] || "src/index-mohopilot.ts";

const BROWSER = path.resolve(
  "node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe",
);
const SLIM_PUB = path.resolve("_proof/pub");
const BUNDLE_DIR = "D:/tmp/remotion-pilot-bundle";
for (const d of ["D:/tmp", BUNDLE_DIR, path.dirname(OUT)]) fs.mkdirSync(d, { recursive: true });
process.env.TMPDIR = process.env.TEMP = process.env.TMP = "D:/tmp";

console.log("→ bundle…");
const serveUrl = await bundle({
  entryPoint: path.resolve(ENTRY),
  outDir: BUNDLE_DIR,
  publicDir: fs.existsSync(SLIM_PUB) ? SLIM_PUB : undefined,
  onProgress: (p) => { if (p % 25 === 0) process.stdout.write(`  ${p}%\r`); },
});

const browserExecutable = fs.existsSync(BROWSER) ? BROWSER : undefined;
const composition = await selectComposition({ serveUrl, id: COMP, inputProps: {}, browserExecutable });
console.log(`\n→ ${composition.width}x${composition.height} · ${composition.durationInFrames} frames (${(composition.durationInFrames / composition.fps).toFixed(1)}s)`);

let last = -1;
await renderMedia({
  composition,
  serveUrl,
  codec: "h264",
  outputLocation: OUT,
  browserExecutable,
  concurrency: 4,
  crf: 20,
  onProgress: ({ progress }) => {
    const pct = Math.floor(progress * 100);
    if (pct !== last && pct % 5 === 0) { last = pct; process.stdout.write(`  render ${pct}%\r`); }
  },
});
console.log(`\n✓ ${OUT}`);
