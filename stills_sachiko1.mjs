import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const out = process.env.OUT || "D:/rtmp/abuela_jp/v1/stills";
fs.mkdirSync(out, { recursive: true });
const secs = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index_sachiko1.tsx"), publicDir: path.resolve("public") });
const comp = await selectComposition({ serveUrl, id: "Full" });
for (const s of secs) {
  try {
    await renderStill({ composition: comp, serveUrl, output: `${out}/t${s.toFixed(2).padStart(7, "0")}.jpg`, frame: Math.round(s * 30), imageFormat: "jpeg", jpegQuality: 70, scale: 0.5 });
    console.log("ok", s);
  } catch (e) { console.log("ERR", s, String(e).slice(0, 300)); }
}
