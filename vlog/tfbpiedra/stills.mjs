// stills de una composición (bundle UNA vez): node vlog/tfbpiedra/stills.mjs <comp> <outDir> <frame> [frame…] [--scale=0.5]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs"; import path from "node:path";
const args = process.argv.slice(2), fl = Object.fromEntries(args.filter(a => a.startsWith("--")).map(a => a.slice(2).split("=")));
const [comp, outDir, ...frames] = args.filter(a => !a.startsWith("--"));
fs.mkdirSync(outDir, { recursive: true });
const R = "D:/Proyectos/video2-wt/tfbpiedra/";
const serveUrl = await bundle({ entryPoint: path.join(R, "src/index_tfbpiedra.tsx"), publicDir: path.join(R, "public"), onProgress: () => {} });
const composition = await selectComposition({ serveUrl, id: comp });
for (const f of frames.map(Number)) {
  const output = path.join(outDir, `${comp}_${String(f).padStart(6, "0")}.jpg`);
  await renderStill({ serveUrl, composition, frame: f, output, imageFormat: "jpeg", jpegQuality: 80, scale: +(fl.scale || 0.5) });
  console.log(output);
}
