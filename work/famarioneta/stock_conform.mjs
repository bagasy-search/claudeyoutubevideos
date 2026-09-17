import fs from "node:fs";
import { execFileSync } from "node:child_process";
const P = JSON.parse(fs.readFileSync("_v3/famarioneta_stock_pick.json", "utf8"));
const probe = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }));
const luma = (f, ss) => { const o = execFileSync("ffmpeg", ["-v", "info", "-ss", String(ss), "-t", "0.7", "-i", f, "-an", "-vf", "scale=320:180,signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-f", "null", "-"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); return 0; };
let n = 0;
for (const [name, p] of Object.entries(P)) {
  const out = `public/broll/famarioneta/stock/${name}.mp4`;
  if (fs.existsSync(out)) { n++; continue; }
  const d = probe(p.raw);
  const ss = d > 9 ? 1.0 : 0.4;
  const t = Math.min(14, d - ss - 0.3);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(ss), "-i", p.raw, "-t", t.toFixed(2), "-an", "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1,format=yuv420p", "-c:v", "libx264", "-preset", "veryfast", "-crf", "21", "-g", "30", "-r", "30", out]);
  n++; console.log(name, t.toFixed(1));
}
import { spawnSync } from "node:child_process";
const malos = []; let medidos = 0;
for (const name of Object.keys(P)) {
  const f = `public/broll/famarioneta/stock/${name}.mp4`;
  const r = spawnSync("ffmpeg", ["-v", "info", "-t", "0.7", "-i", f, "-an", "-vf", "signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-f", "null", "-"], { encoding: "utf8" });
  const v = [...(r.stderr || "").matchAll(/YAVG=([\d.]+)/g)].map((m) => +m[1]);
  if (!v.length) continue; medidos++;
  if (Math.min(...v) < 40) malos.push(name + " " + Math.min(...v).toFixed(0));
}
console.log(`luma arranque: medidos ${medidos}/${Object.keys(P).length} · <40: ${malos.join(", ") || "ninguno"}`);
spawnSync("ffmpeg", ["-v", "error", "-y", ...Object.keys(P).flatMap((n) => ["-ss", "3", "-i", `public/broll/famarioneta/stock/${n}.mp4`]), "-filter_complex", Object.keys(P).map((n, i) => `[${i}:v]scale=320:180,trim=end_frame=1[v${i}]`).join(";") + ";" + Object.keys(P).map((n, i) => `[v${i}]`).join("") + `xstack=inputs=${Object.keys(P).length}:layout=${Object.keys(P).map((n, i) => `${(i % 8) * 320}_${Math.floor(i / 8) * 180}`).join("|")}`, "-frames:v", "1", "work/famarioneta/stock_sheet.jpg"]);
console.log("MEDIDO conformados", n, "de", Object.keys(P).length, Object.keys(P).join(" "));
