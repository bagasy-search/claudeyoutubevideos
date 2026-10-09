// Clips agnes 2.5 (mejor versión según check) → public/vid/ollarder2/<id>.mp4 a 30/1 CFR 1920x1080 sin audio;
// los `detail` (keyframe) dejan además su FOLEY real normalizado a -30 LUFS (≈ -14 LU bajo la voz) en <id>_foley.m4a.
import fs from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/ollarder2/", OUT = R + "public/vid/ollarder2/";
fs.mkdirSync(OUT, { recursive: true });
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a], { windowsHide: true });
const J = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : {});
let n = 0;
for (const plan of ["M1", "COCINA"]) {
  const CL = R + `vlog/ollarder2/${plan}/clips/`;
  const st = { ...J(CL + "state.json") }, det = J(CL + "state_det.json");
  for (const [id, v] of [...Object.entries(st), ...Object.entries(det)]) {
    const src = CL + v.file, dst = OUT + id + ".mp4";
    if (!fs.existsSync(src)) continue;
    if (fs.existsSync(dst) && fs.statSync(dst).mtimeMs > fs.statSync(src).mtimeMs) continue;
    ff("-i", src, "-an", "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,format=yuv420p", "-r", "30", "-c:v", "libx264", "-crf", "19", "-preset", "veryfast", dst);
    if (det[id]) {
      const lufs = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", src, "-vn", "-af", "ebur128=framelog=quiet", "-f", "null", "-"], { encoding: "utf8", windowsHide: true }).stderr || "";
      const m = /I:\s+(-?[0-9.]+) LUFS/.exec(lufs); const I = m ? +m[1] : -30;
      if (I > -70) ff("-i", src, "-vn", "-af", `volume=${(-30 - I).toFixed(1)}dB,afade=t=in:d=0.15`, "-ar", "48000", "-c:a", "aac", "-b:a", "128k", OUT + id + "_foley.m4a");
    }
    n++; console.log("✓", plan, id);
  }
}
console.log("clips preparados:", n);
