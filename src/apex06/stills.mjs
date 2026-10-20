// stills del kit btg (sólo fotos sueltas, NUNCA video): node src/apex06/stills.mjs <outDir> <publicDir = E:/videos/btg_pub> <seg...>
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const [outDir, publicDir, ...secs] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index_apex06.tsx"), publicDir, onSymlinkDetected: () => {} });
const composition = await selectComposition({ serveUrl, id: "AP6FULL", chromiumOptions: { gl: "angle" } });
for (const s of secs) {
  const f = Math.round(Number(s) * 30);
  try { await renderStill({ serveUrl, composition, frame: f, output: path.join(outDir, `t${Number(s).toFixed(2).padStart(6, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 80, chromiumOptions: { gl: "angle" }, scale: 0.5 }); console.log("ok", s); }
  catch (e) { console.log("ERR", s, String(e).slice(0, 300)); }
}
