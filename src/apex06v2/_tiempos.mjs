import { bundle } from "@remotion/bundler";
import { renderFrames, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [comp, ...secs] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index_apex06v2.tsx"), publicDir: "E:/videos/apex06v2_pub", onSymlinkDetected: () => {} });
const composition = await selectComposition({ serveUrl, id: comp, timeoutInMilliseconds: 120000 });
for (const s of secs) {
  const f = Math.round(Number(s) * 30); const t0 = Date.now();
  await renderFrames({ serveUrl, composition, frameRange: [f, f + 5], outputDir: "E:/videos/apex06v2/tf", imageFormat: "jpeg", concurrency: 1, timeoutInMilliseconds: 120000, onStart: () => {}, onFrameUpdate: () => {} });
  console.log("t", s, ((Date.now() - t0) / 6000).toFixed(2), "s/cuadro");
}
