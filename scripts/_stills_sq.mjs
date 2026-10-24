// stills de revisión de sgardensquirrel (un solo bundle, public chico, tiempos de espera largos por la máquina cargada)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const [entry, compId, outDir, framesCsv] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const BROWSER = path.resolve("node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe");
const browserExecutable = fs.existsSync(BROWSER) ? BROWSER : undefined;
const T = 300000;
console.log("bundling…", !!browserExecutable);
const serveUrl = await bundle({ entryPoint: path.resolve(entry), publicDir: "E:/videos/tmp/sgsq/pub", outDir: "E:/videos/tmp/sgsq/bundle_" + Date.now() });
const comp = await selectComposition({ serveUrl, id: compId, browserExecutable, timeoutInMilliseconds: T, chromiumOptions: { gl: "angle" } });
for (const f of framesCsv.split(",").map(Number)) {
  await renderStill({ serveUrl, composition: comp, output: path.join(outDir, `f_${f}.png`), frame: f, scale: 0.5, browserExecutable, timeoutInMilliseconds: T, chromiumOptions: { gl: "angle" }, overwrite: true });
  console.log("still", f);
}
console.log("done");
