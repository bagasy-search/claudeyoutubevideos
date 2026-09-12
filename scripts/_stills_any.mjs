// Usage: node scripts/_stills_any.mjs <entry> <compId> <outDir> <f1,f2,...>
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [entry, compId, outDir, framesCsv] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
process.env.REMOTION_TIMEOUT = "120000";

console.log("bundling…");
const serveUrl = await bundle({ entryPoint: path.resolve(entry), webpackOverride: (c) => c });
const comp = await selectComposition({ serveUrl, id: compId });
for (const f of framesCsv.split(",").map(Number)) {
  await renderStill({ serveUrl, composition: comp, output: path.join(outDir, `f_${f}.png`), frame: f, scale: 0.5, chromiumOptions: { gl: "angle" } });
  console.log("still", f);
}
console.log("done");
