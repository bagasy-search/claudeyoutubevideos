// stills de apex04 (sólo fotos sueltas para revisar, NUNCA video): node src/apex04/stills.mjs <comp> <outDir> <seg...>
// pub = D:/rtmp/apex/apex04/pub (junction a public/apex04 → el bundler la reenvía como enlace, no copia 3 GB)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const [id, outDir, ...secs] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index_apex04.tsx"), publicDir: "E:/videos/apex04/pub", onSymlinkDetected: () => {} });
const composition = await selectComposition({ serveUrl, id, chromiumOptions: { gl: "angle" } });
for (const s of secs) {
  const f = Math.round(Number(s) * 30);
  try { await renderStill({ serveUrl, composition, frame: f, output: path.join(outDir, `t${Number(s).toFixed(2).padStart(6, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 80, chromiumOptions: { gl: "angle" }, scale: 0.5 }); console.log("ok", s); }
  catch (e) { console.log("ERR", s, String(e).slice(0, 300)); }
}
