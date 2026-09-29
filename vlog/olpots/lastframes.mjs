// Cuadro final quieto (_last.jpg) de cada clip más corto que su plano (el montaje lo congela en vez de repetir el clip).
import fs from "node:fs"; import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/olpots/public/";
const ts = fs.readFileSync("D:/Proyectos/video2-wt/olpots/src/olpots/timeline_olpots.gen.ts", "utf8");
const TL = JSON.parse(ts.match(/export const TL: any\[\] = (.*);/)[1]);
let n = 0;
for (const c of TL) if (c.clip && c.clipF < c.dur) { const o = R + c.clip.replace(/\.mp4$/, "_last.jpg"); if (!fs.existsSync(o)) { execFileSync("ffmpeg", ["-v", "error", "-y", "-sseof", "-0.1", "-i", R + c.clip, "-frames:v", "1", "-q:v", "2", o]); n++; } }
console.log("last frames", n);
