// stills sueltos de apex06 v2 (sólo fotos, NUNCA video): node src/apex06v2/stills.mjs <outDir> <comp> <seg...>
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const [outDir, comp, ...secs] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index_apex06v2.tsx"), publicDir: process.env.PUB || "E:/videos/apex06v2_pub", onSymlinkDetected: () => {} });
const composition = await selectComposition({ serveUrl, id: comp, chromiumOptions: { gl: "angle" } });
for (const s of secs) {
  const f = Math.round(Number(s) * 30);
  try { await renderStill({ serveUrl, composition, frame: f, output: path.join(outDir, `t${Number(s).toFixed(2).padStart(6, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 80, chromiumOptions: { gl: "angle" }, scale: 0.5 }); console.log("ok", s); }
  catch (e) { console.log("ERR", s, String(e).slice(0, 400)); }
}
