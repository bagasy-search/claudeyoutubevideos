// stills.mjs <compId> <outDir> <frame,frame,…> [scale] — UN bundle y muchos renderStill (para pruebas y el AUDITOR)
import path from "node:path"; import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
const [, , comp, outDir, frames, scale = "0.5"] = process.argv;
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, "$1"), "../..");
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src/index_tfbcola.tsx"), publicDir: path.join(ROOT, "public"), onProgress: () => {} });
const composition = await selectComposition({ serveUrl, id: comp });
for (const f of frames.split(",").map(Number)) {
  const output = path.join(outDir, `${comp}_${String(f).padStart(6, "0")}.jpg`);
  await renderStill({ serveUrl, composition, frame: f, output, imageFormat: "jpeg", jpegQuality: 80, scale: Number(scale) });
  console.log("ok", output);
}
