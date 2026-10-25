// stills (SÓLO fotos sueltas, NUNCA video): node src/t30tornies/stills.mjs <outDir> <publicDir> <seg...>
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const [outDir, publicDir, ...secs] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index_t30tornies.tsx"), publicDir, onSymlinkDetected: () => {} });
const composition = await selectComposition({ serveUrl, id: "Full", chromiumOptions: { gl: "angle" }, timeoutInMilliseconds: 240000 });
for (const s of secs) {
  const f = Math.round(Number(s) * 30);
  try { await renderStill({ serveUrl, composition, frame: f, output: path.join(outDir, `t${Number(s).toFixed(2).padStart(7, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 80, chromiumOptions: { gl: "angle" }, scale: 0.5, timeoutInMilliseconds: 120000 }); console.log("ok", s); }
  catch (e) { console.log("ERR", s, String(e).slice(0, 300)); }
}
