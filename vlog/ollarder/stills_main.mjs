// Stills del MONTAJE real (Main_ollarder) en segundos dados: node vlog/ollarder/stills_main.mjs 5,30,95
import { bundle } from "@remotion/bundler";
import { renderStill, getCompositions } from "@remotion/renderer";
import fs from "node:fs";
const secs = process.argv[2].split(",").map(Number);
const out = "D:/rtmp/ollarder/main/"; fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: "src/index_ollarder.tsx", publicDir: "public" });
const [c] = (await getCompositions(serveUrl)).filter((x) => x.id === "Ollarder");
for (const s of secs) {
  const f = Math.min(c.durationInFrames - 1, Math.round(s * 30));
  try { await renderStill({ composition: c, serveUrl, output: out + "m_" + String(s).padStart(5, "0") + ".jpg", frame: f, imageFormat: "jpeg", jpegQuality: 70, chromiumOptions: { gl: "angle" }, timeoutInMilliseconds: 120000 }); console.log("ok", s); }
  catch (e) { console.log("ERR", s, String(e.message).slice(0, 300)); }
}
