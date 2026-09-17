// reel crudo RunPod → conformado 30 CFR y plantado al largo EXACTO del reel.wav (avatar_assemble) → un clip por ventana
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const dir = "_v3/famarioneta_av";
const W = JSON.parse(fs.readFileSync("_v3/famarioneta_avwin.json", "utf8"));
const LAG = fs.existsSync("_v3/famarioneta_avlag.json") ? JSON.parse(fs.readFileSync("_v3/famarioneta_avlag.json", "utf8")) : {};
const dur = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }));
const nb = (f) => execFileSync("ffprobe", ["-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries", "stream=nb_read_frames,r_frame_rate", "-of", "csv=p=0", f], { encoding: "utf8" }).trim();
const reelWav = dur(`${dir}/reel.wav`);
const raw = `${dir}/parte1_raw.mp4`;
const [fr, rate] = nb(raw).split(",").reverse();
console.log(`crudo: header ${dur(raw).toFixed(3)} s · cuadros ${fr} @ ${rate} · reel.wav ${reelWav.toFixed(3)} s`);
if (!fs.existsSync(`${dir}/reel30.mp4`)) execFileSync("node", ["scripts/avatar_assemble.mjs", `${dir}/reel30.mp4`, `${dir}/reel.wav`, `${raw}:0:${reelWav.toFixed(3)}`], { stdio: "inherit" });
fs.mkdirSync("public/broll/famarioneta/av", { recursive: true });
const malos = [];
for (const w of W) {
  const d = w.end - w.start;
  const out = `public/broll/famarioneta/av/w${String(w.k).padStart(3, "0")}.mp4`;
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", Math.max(0, w.reel_off + (LAG[w.k]?.lm || 0)).toFixed(3), "-i", `${dir}/reel30.mp4`, "-t", d.toFixed(3), "-an", "-vf", "fps=30,setsar=1,format=yuv420p", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-r", "30", out]);
  const r = dur(out); if (Math.abs(r - d) > 0.1) malos.push(`w${w.k} ${r.toFixed(2)} vs ${d.toFixed(2)}`);
}
console.log(`MEDIDO ventanas cortadas ${W.length} · mal cortadas ${malos.length}`, malos.join("; "));
