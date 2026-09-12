// Quick LOCAL preview render of a single component demo (creative approval only).
// Usage: node scripts/_render_demo.mjs <entry> <compId> <outMp4>
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [entry, compId, out] = process.argv.slice(2);
process.env.REMOTION_TIMEOUT = "120000";
console.log("bundling…");
const serveUrl = await bundle({ entryPoint: path.resolve(entry), webpackOverride: (c) => c });
const composition = await selectComposition({ serveUrl, id: compId });
console.log("rendering", composition.durationInFrames, "frames…");
await renderMedia({
  serveUrl,
  composition,
  codec: "h264",
  outputLocation: out,
  concurrency: 6,
  chromiumOptions: { gl: "angle" },
  onProgress: ({ progress }) => {
    if (Math.round(progress * 100) % 20 === 0) console.log("  ", Math.round(progress * 100) + "%");
  },
});
console.log("DONE", out);
