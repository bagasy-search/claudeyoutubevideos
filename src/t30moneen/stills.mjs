// stills de revisión t30moneen (SÓLO fotos sueltas a escala 0.5, NUNCA video): node src/t30moneen/stills.mjs <outDir> <publicDir> <seg...>
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const [outDir, publicDir, ...secs] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve(process.env.ENTRY || "src/index_t30moneen.tsx"), publicDir, onSymlinkDetected: () => {} });
console.log("bundled", new Date().toISOString());
const composition = await selectComposition({ serveUrl, id: process.env.COMP || "Full", chromiumOptions: {}, timeoutInMilliseconds: 240000, logLevel: process.env.LL || "info" });
console.log("selected", new Date().toISOString());
for (const s of secs) {
  const f = Math.round(Number(s) * 30);
  try { await renderStill({ serveUrl, composition, frame: f, output: path.join(outDir, `t${Number(s).toFixed(2).padStart(6, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 80, chromiumOptions: {}, scale: 0.5, timeoutInMilliseconds: 180000 }); console.log("ok", s, new Date().toISOString()); }
  catch (e) { console.log("ERR", s, String(e).slice(0, 300)); }
}
