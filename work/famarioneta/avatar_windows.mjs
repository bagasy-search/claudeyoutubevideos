// ventanas de avatar desde el SPEC (momentos t:"A") → _v3/famarioneta_avwin.json + reel.wav
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { SPEC } from "./spec.mjs";
const M = JSON.parse(fs.readFileSync("_v3/famarioneta_moments.json", "utf8"));
const TOT = 1534.189;
const W = [];
for (const m of M) {
  if (SPEC[m.name]?.t !== "A") continue;
  const a = Math.max(0, m.t - 0.08), z = Math.min(TOT, m.t + m.dur - 0.08);
  if (W.length && a - W.at(-1).end < 0.6) { W.at(-1).end = z; W.at(-1).n.push(m.name); }
  else W.push({ start: a, end: z, n: [m.name] });
}
W[0].start = 0;
const dir = "_v3/famarioneta_av"; fs.mkdirSync(dir, { recursive: true });
let off = 0; const lst = [];
W.forEach((w, k) => {
  const f = `${dir}/w${String(k).padStart(3, "0")}.wav`;
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", w.start.toFixed(3), "-t", (w.end - w.start).toFixed(3), "-i", "public/famarioneta.wav", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", f]);
  const real = parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }));
  w.k = k; w.end = +(w.start + real).toFixed(3); w.start = +w.start.toFixed(3); w.reel_off = +off.toFixed(3); off += real;
  lst.push("file " + JSON.stringify(f.split("/").pop()).replace(/"/g, String.fromCharCode(39)));
});
fs.writeFileSync(`${dir}/cat.txt`, lst.join("\n"));
execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", `${dir}/cat.txt`, "-c:a", "pcm_s16le", `${dir}/reel.wav`]);
fs.writeFileSync("_v3/famarioneta_avwin.json", JSON.stringify(W, null, 1));
const reel = parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", `${dir}/reel.wav`], { encoding: "utf8" }));
let gap = 0, prev = 0; for (const w of W) { gap = Math.max(gap, w.start - prev); prev = w.end; }
console.log(`ventanas ${W.length} · reel ${reel.toFixed(1)} s (${(100 * reel / TOT).toFixed(1)} % del total) · suma ${off.toFixed(1)} · hueco máx sin avatar ${gap.toFixed(1)} s`);
