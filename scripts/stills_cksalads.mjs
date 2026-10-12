// stills de Remotion para revisión: node scripts/stills_cksalads.mjs <outDir> <comp> s1 s2 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const [outDir, compId, ...rest] = process.argv.slice(2);
const secs = rest.map(Number);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index_cksalads.tsx"), publicDir: path.resolve("public") });
const comp = await selectComposition({ serveUrl, id: compId });
for (const s of secs) {
  const out = path.join(outDir, `t${String(s.toFixed(2)).padStart(6, "0")}.jpg`);
  await renderStill({ composition: comp, serveUrl, output: out, frame: Math.round(s * 30), imageFormat: "jpeg", jpegQuality: 85, scale: 0.5 });
  console.log("ok", s, out);
}
