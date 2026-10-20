// stills del kit neon (sólo fotos sueltas, NUNCA video): node src/kits/neon/stills.mjs <outDir> <publicDir = E:/videos/neon_pub> <seg...>
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const [outDir, publicDir, ...secs] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve(process.env.ENTRY || "src/index_neon.tsx"), publicDir, onSymlinkDetected: () => {} });
const composition = await selectComposition({ serveUrl, id: process.env.COMP || "NEONDEMO", chromiumOptions: { gl: "angle" }, timeoutInMilliseconds: 180000 });
console.log("dur", (composition.durationInFrames / 30).toFixed(2), "s");
for (const s of secs) {
  const f = Math.round(Number(s) * 30);
  try { await renderStill({ serveUrl, composition, frame: f, output: path.join(outDir, `t${Number(s).toFixed(2).padStart(6, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 82, chromiumOptions: { gl: "angle" }, scale: 0.5, timeoutInMilliseconds: 180000 }); console.log("ok", s); }
  catch (e) { console.log("ERR", s, String(e).slice(0, 400)); }
}
