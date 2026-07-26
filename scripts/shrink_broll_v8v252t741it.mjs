// shrink_broll_v8v252t741it.mjs — recomprime el b-roll bajado de Pexels a 720p y lo RECORTA a la
// duración que realmente usa el build (+0.6s de colchón). Dos motivos:
//   1) El asset de release del farm tiene tope de 2 GB. 400 clips HD de 10-30s no entran ni cerca.
//   2) El clip se reproduce desde su frame 0, así que todo lo que sobra del clip es peso muerto.
// Escribe sobre el mismo archivo (vía .tmp) y avisa cuánto bajó el total.
import fs from "fs";
import { execFileSync } from "child_process";

const SLUG = "v8v252t741it";
const DIR = `public/broll/${SLUG}`;
const TS = `src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`;
if (!fs.existsSync(TS)) { console.error("falta", TS); process.exit(1); }
const rows = JSON.parse(fs.readFileSync(TS, "utf8").match(/=\s*(\[[\s\S]*\]);/)[1]);

const mb = (b) => b / 1048576;
let antes = 0, despues = 0, hechos = 0, faltan = 0, saltados = 0;
for (const r of rows) {
  const f = `${DIR}/${r.name}.mp4`;
  if (!fs.existsSync(f)) { faltan++; continue; }
  const size0 = fs.statSync(f).size;
  antes += size0;
  const need = Math.max(1.5, r.dur + 0.6);
  // si ya está chico Y corto, no lo tocamos
  let dur0 = 999;
  try { dur0 = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }).trim(); } catch {}
  if (mb(size0) < 1.2 && dur0 <= need + 1.5) { despues += size0; saltados++; continue; }
  const tmp = `${DIR}/${r.name}.tmp.mp4`;
  try {
    execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-i", f, "-t", String(need),
      "-vf", "scale=1280:-2:flags=fast_bilinear", "-c:v", "libx264", "-preset", "veryfast", "-crf", "28",
      "-pix_fmt", "yuv420p", "-g", "30", "-an", "-threads", "4", "-movflags", "+faststart", tmp], { stdio: "pipe" });
    if (fs.existsSync(tmp) && fs.statSync(tmp).size > 10000) {
      fs.rmSync(f); fs.renameSync(tmp, f); hechos++;
    } else { try { fs.rmSync(tmp); } catch {} }
  } catch (e) { try { fs.rmSync(tmp); } catch {} }
  despues += fs.existsSync(f) ? fs.statSync(f).size : 0;
}
console.log(`b-roll: ${hechos} recomprimidos · ${saltados} ya estaban livianos · ${faltan} no bajaron`);
console.log(`peso: ${mb(antes).toFixed(0)} MB → ${mb(despues).toFixed(0)} MB`);
