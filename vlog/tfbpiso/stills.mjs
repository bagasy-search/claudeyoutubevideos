// stills de revisión: node vlog/tfbpiso/stills.mjs <entry> <compId> <outDir> <frame,frame,...>
import { bundle } from "@remotion/bundler"; import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs"; import path from "node:path";
const [entry, id, out, frames] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve(entry), publicDir: path.resolve("public"), webpackOverride: c => c });
const composition = await selectComposition({ serveUrl, id });
for (const f of frames.split(",").map(Number)) {
  await renderStill({ serveUrl, composition, frame: f, output: path.join(out, `f${String(f).padStart(6, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 80 });
  console.log("ok", f);
}
