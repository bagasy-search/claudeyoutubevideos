import { bundle } from "@remotion/bundler"; import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs"; import path from "node:path";
const [entry, id, list, out] = process.argv.slice(2);
const L = JSON.parse(fs.readFileSync(list, "utf8")); fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve(entry), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id });
for (const [i, x] of L.entries()) { await renderStill({ composition, serveUrl, frame: x.f, output: `${out}/${String(i).padStart(2, "0")}_${x.n}.jpg`, imageFormat: "jpeg", jpegQuality: 70, scale: 0.5 }); process.stdout.write("."); }
console.log("ok");
