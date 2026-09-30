// último cuadro de cada clip animado (broll/olcabin/*.mp4 y broll/olcabin_st30/*.mp4) → <clip>_last.jpg (lo usa Main cuando el plano dura más que el clip)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/olcabin/public/";
let n = 0;
for (const d of ["broll/olcabin/", "broll/olcabin_st30/"]) {
  for (const f of fs.readdirSync(R + d).filter((x) => x.endsWith(".mp4"))) {
    const out = R + d + f.replace(/\.mp4$/, "_last.jpg");
    if (fs.existsSync(out)) continue;
    execFileSync("ffmpeg", ["-v", "error", "-y", "-sseof", "-0.12", "-i", R + d + f, "-frames:v", "1", "-q:v", "3", out], { windowsHide: true }); n++;
  }
}
console.log("últimos cuadros:", n);
