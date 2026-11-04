// Render de una película canvas (window.seek/READY/END) a MP4: cada cuadro sale como JPEG por toDataURL y va a ffmpeg.
// uso: node canvas/render.mjs <film.html> <out.mp4> [fps]
import puppeteer from "puppeteer";
import { spawn } from "node:child_process";
import path from "node:path";
const [html, out, fpsArg] = process.argv.slice(2);
const fps = +(fpsArg || 60);
const b = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--allow-file-access-from-files", "--disable-web-security"] });
const p = await b.newPage();
p.on("pageerror", e => console.log("pageerror", String(e)));
await p.setViewport({ width: 1080, height: 1920 });
await p.goto("file://" + path.resolve(html), { waitUntil: "load" });
await p.waitForFunction("window.READY === true", { timeout: 60000 });
const END = await p.evaluate(() => window.END);
const N = Math.round(END * fps);
const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-",
  "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], { stdio: ["pipe", "inherit", "inherit"] });
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  const d = await p.evaluate(async (t) => { await window.seek(t); return document.querySelector("canvas").toDataURL("image/jpeg", 0.95); }, i / fps);
  if (!ff.stdin.write(Buffer.from(d.split(",")[1], "base64"))) await new Promise(r => ff.stdin.once("drain", r));
  if (i % 300 === 0) console.log(`${i}/${N} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
ff.stdin.end();
await new Promise(r => ff.on("close", r));
await b.close();
console.log("listo", out, N, "cuadros");
