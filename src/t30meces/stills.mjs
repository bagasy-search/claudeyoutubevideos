// stills (SÓLO fotos sueltas, NUNCA video): node src/t30meces/stills.mjs <outDir> <publicDir> <seg...>
// un solo navegador para todos los cuadros y plazos largos (la laptop va cargada con otras sesiones)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const [outDir, publicDir, ...secs] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = process.env.SERVE_URL || await bundle({ entryPoint: path.resolve("src/index_t30meces.tsx"), publicDir, onSymlinkDetected: () => {} });
console.log("bundle", serveUrl);
const chromiumOptions = { gl: "angle" };
const puppeteerInstance = await openBrowser("chrome", { chromiumOptions, timeoutInMilliseconds: 240000 });
const composition = await selectComposition({ serveUrl, id: "Full", chromiumOptions, puppeteerInstance, timeoutInMilliseconds: 240000 });
for (const s of secs) {
  const f = Math.round(Number(s) * 30);
  try { await renderStill({ serveUrl, composition, frame: f, output: path.join(outDir, `t${Number(s).toFixed(2).padStart(7, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 80, chromiumOptions, puppeteerInstance, scale: 0.5, timeoutInMilliseconds: 180000 }); console.log("ok", s); }
  catch (e) { console.log("ERR", s, String(e).slice(0, 300)); }
}
await puppeteerInstance.close({ silent: true });
