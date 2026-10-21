// stills locales del minuto 1 (SÓLO stills; nada de render de video en local)
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { enableTailwind } from "@remotion/tailwind-v4";
import path from "node:path";
const root = "D:/wt/donlupe01";
const ts = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index_donlupe01.tsx"), publicDir: "E:/videos/donlupe01/stillspub", webpackOverride: enableTailwind });
const browser = await openBrowser("chrome", { chromiumOptions: { gl: "angle" } });
const opts = { puppeteerInstance: browser, serveUrl, chromiumOptions: { gl: "angle" }, timeoutInMilliseconds: 240000, inputProps: { nomb: process.env.MB ? false : true } };
const comp = await selectComposition({ ...opts, id: process.env.COMP || "DonLupe01Min1" });
console.log("dur", comp.durationInFrames / 30);
for (const t of ts) {
  const f = Math.min(comp.durationInFrames - 1, Math.round(t * 30));
  const out = path.join(root, "out/stills", `m1_${String(t).replace(".", "_")}.jpg`);
  await renderStill({ ...opts, composition: comp, frame: f, output: out, imageFormat: "jpeg", jpegQuality: 85 });
  console.log("ok", t);
}

await browser.close({ silent: true });
