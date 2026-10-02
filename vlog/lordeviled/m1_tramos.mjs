// Ventanas de los clips hablados (de _v3/lordeviled_shots.json) → _v3/lordeviled_m1.json + tramos wav del máster. node vlog/lordeviled/m1_tramos.mjs [ids…]
import fs from "node:fs"; import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/lordeviled/";
const j = JSON.parse(fs.readFileSync(R + "_v3/lordeviled_shots.json", "utf8")), W = JSON.parse(fs.readFileSync(R + "_v3/lordeviled_wordms.json", "utf8"));
const only = process.argv.slice(2); const file = R + "_v3/lordeviled_m1.json";
const out = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
fs.mkdirSync(R + "vlog/lordeviled/tramos", { recursive: true });
for (const [k, v] of Object.entries(j.vl)) {
  if (only.length && !only.includes(k)) continue;
  const s = Math.max(0, v.s - 0.03), e = v.e;
  const text = W.filter((w) => w.s >= v.s - 0.1 && w.e <= v.e + 0.1).map((w) => w.w).join(" ");
  out[k] = { s: +s.toFixed(3), e: +e.toFixed(3), text };
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", s.toFixed(3), "-to", e.toFixed(3), "-i", R + "public/lordeviled.wav", "-ac", "1", "-ar", "44100", R + `vlog/lordeviled/tramos/${k}.wav`], { windowsHide: true });
  console.log(k, (e - s).toFixed(2), text.slice(0, 70));
}
fs.writeFileSync(file, JSON.stringify(out, null, 1));
