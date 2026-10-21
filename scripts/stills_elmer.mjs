// stills_at.mjs — rinde FRAMES PUNTUALES de una composición con UN solo bundle.
//   node scripts/stills_at.mjs <outDir> <comp> <entry> <frame,frame,...>
// (proofshots.mjs barre el video entero; esto sirve para mirar 3 frames elegidos.)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [OUT, COMP, ENTRY, FRAMES] = process.argv.slice(2);
const frames = FRAMES.split(",").map(Number);
const BROWSER = path.resolve("node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe");
const SLIM = path.resolve("_proof/pub");
const BUNDLE_DIR = "D:/tmp/rs-elmer01";
for (const d of ["D:/tmp", BUNDLE_DIR, path.resolve(OUT)]) fs.mkdirSync(d, { recursive: true });
process.env.TMPDIR = process.env.TEMP = process.env.TMP = "D:/tmp";

const serveUrl = await bundle({ entryPoint: path.resolve(ENTRY), outDir: BUNDLE_DIR, publicDir: fs.existsSync(SLIM) ? SLIM : undefined });
const browserExecutable = fs.existsSync(BROWSER) ? BROWSER : undefined;
const composition = await selectComposition({ serveUrl, id: COMP, inputProps: {}, browserExecutable });
for (const f of frames) {
  const output = path.join(path.resolve(OUT), `f${f}.png`);
  if (process.env.SKIP_EXISTING && fs.existsSync(output)) continue;
  try {
    await renderStill({ composition, serveUrl, output, frame: f, browserExecutable, overwrite: true, timeoutInMilliseconds: 120000 });
    console.log("✓", output);
  } catch (err) { console.log("✗", f, String(err.message || err).slice(0, 200)); process.exitCode = 1; }
}
