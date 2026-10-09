// _last.jpg (último cuadro) de cada clip de stock / agnes v2: el plano más largo que su clip se queda en el último cuadro (sin loop). node vlog/olsup/prep_last.mjs
import fs from "node:fs"; import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/olsup/public/"; let n = 0;
for (const d of ["broll/olsup_st30/", "broll/olsup/"]) {
  if (!fs.existsSync(R + d)) continue;
  for (const f of fs.readdirSync(R + d).filter((x) => x.endsWith(".mp4"))) {
    const out = R + d + f.replace(/\.mp4$/, "_last.jpg"); if (fs.existsSync(out)) continue;
    try { execFileSync("ffmpeg", ["-v", "error", "-y", "-sseof", "-0.08", "-i", R + d + f, "-frames:v", "1", "-vf", "scale=1920:1080", "-q:v", "3", out], { windowsHide: true }); n++; } catch (e) { console.log("fallo", f); }
  }
}
console.log("_last.jpg nuevos:", n);
