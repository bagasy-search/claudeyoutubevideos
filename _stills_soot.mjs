// stills (SÓLO fotos sueltas, NUNCA video): node _stills_soot.mjs <entry> <id> <publicDir> frames...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
const [entry, id, publicDir, ...rest] = process.argv.slice(2);
const frames = rest.map(Number);
const serveUrl = process.env.SERVE_URL || await bundle({ entryPoint: path.resolve(entry), publicDir, onSymlinkDetected: () => {} });
console.log("bundle", serveUrl);
const chromiumOptions = { gl: "angle" };
const puppeteerInstance = await openBrowser("chrome", { chromiumOptions, timeoutInMilliseconds: 300000 });
const comp = await selectComposition({ serveUrl, id, chromiumOptions, puppeteerInstance, timeoutInMilliseconds: 300000 });
for (const f of frames) {
  try { await renderStill({ serveUrl, composition: comp, frame: f, output: `${process.env.OUT || "E:/videos/tmp/soot"}/${id}_${String(f).padStart(5,"0")}.jpg`, imageFormat: "jpeg", jpegQuality: 72, scale: 0.5, chromiumOptions, puppeteerInstance, timeoutInMilliseconds: 240000 });
  console.log("ok", f); } catch (e) { console.log("ERR", f, String(e.message).slice(0, 300)); }
}
await puppeteerInstance.close({ silent: true });
