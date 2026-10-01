// Stills de verificación del kit (local, livianos): node vlog/ollarder/stills.mjs <ids|all> <seg,seg,...>
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
const ids = process.argv[2], secs = (process.argv[3] || "2,6,10").split(",").map(Number);
const out = "D:/rtmp/ollarder/stills/"; fs.mkdirSync(out, { recursive: true }); fs.mkdirSync("D:/rtmp/ollarder/emptypub", { recursive: true });
const serveUrl = await bundle({ entryPoint: "src/index_ollarder_test.tsx", publicDir: "D:/rtmp/ollarder/emptypub" });
const names = ids === "all" ? null : ids.split(",");
const { getCompositions } = await import("@remotion/renderer");
const comps = await getCompositions(serveUrl);
for (const c of comps) {
  if (names && !names.includes(c.id)) continue;
  for (const s of secs) {
    const f = Math.min(c.durationInFrames - 1, Math.round(s * 30));
    try { await renderStill({ composition: c, serveUrl, output: out + c.id + "_" + s + ".png", frame: f, imageFormat: "jpeg", jpegQuality: 70, chromiumOptions: { gl: "angle" }, timeoutInMilliseconds: 90000 }); console.log("ok", c.id, s); }
    catch (e) { console.log("ERR", c.id, s, String(e.message).slice(0, 300)); }
  }
}
