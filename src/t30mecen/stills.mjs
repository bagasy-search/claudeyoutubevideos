// stills (SÓLO fotos sueltas, NUNCA video): node src/t30mecen/stills.mjs <outDir> <publicDir> <seg...>
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const [outDir, publicDir, ...secs] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index_t30mecen.tsx"), publicDir, onSymlinkDetected: () => {}, onProgress: (p) => { if (p % 20 === 0) console.log("bundle", p); } });
console.log("bundle listo");
const browser = await openBrowser("chrome", { chromiumOptions: { gl: "angle" } });
const composition = await selectComposition({ serveUrl, puppeteerInstance: browser, id: "Full", chromiumOptions: { gl: "angle" }, timeoutInMilliseconds: 240000, logLevel: process.env.LOGL || "info" });
for (const s of secs) {
  const f = Math.round(Number(s) * 30);
  try { await renderStill({ serveUrl, composition, puppeteerInstance: browser, frame: f, output: path.join(outDir, `t${Number(s).toFixed(2).padStart(7, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 80, chromiumOptions: { gl: "angle" }, scale: 0.5, timeoutInMilliseconds: 120000, logLevel: process.env.LOGL || "info" }); console.log("ok", s); }
  catch (e) { console.log("ERR", s, String(e).slice(0, 300)); }
}
await browser.close({ silent: true });
