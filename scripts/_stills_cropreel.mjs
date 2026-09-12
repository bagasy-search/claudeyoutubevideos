import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const OUT = "D:/rtmp/cropreel";
fs.mkdirSync(OUT, { recursive: true });
process.env.REMOTION_TIMEOUT = "120000";

console.log("bundling…");
const serveUrl = await bundle({
  entryPoint: path.resolve("src/index_cropreeldemo.tsx"),
  webpackOverride: (c) => c,
});
console.log("bundled. selecting comp…");
const comp = await selectComposition({ serveUrl, id: "CropReelDemo" });

const frames = [22, 48, 74, 112, 152, 226];
for (const f of frames) {
  await renderStill({
    serveUrl,
    composition: comp,
    output: path.join(OUT, `f_${f}.png`),
    frame: f,
    scale: 0.5,
    chromiumOptions: { gl: "angle" },
  });
  console.log("still", f);
}
console.log("done");
