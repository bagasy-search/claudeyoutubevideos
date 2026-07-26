// cut_kit_clips_v8v252t741it.mjs — recorta un clip corto del avatar por cada beat
// avatarpizarra / avatarkeyword (lista en public/avatar_clips_<slug>.json, escrita por gen_).
// Motivo: el PiP de esos componentes tiene que arrancar en el frame 0 de SU clip; con
// trimBefore sobre el mp4 completo el seek profundo por-chunk sale NEGRO en el farm.
import fs from "fs";
import { execFileSync } from "child_process";

const SLUG = "v8v252t741it";
const list = JSON.parse(fs.readFileSync(`public/avatar_clips_${SLUG}.json`, "utf8"));
const avatar = `public/${SLUG}_opt.mp4`;
if (!fs.existsSync(avatar)) { console.error("No existe el avatar:", avatar); process.exit(1); }
const outDir = `public/avatar_clips/${SLUG}`;
fs.mkdirSync(outDir, { recursive: true });

let hechos = 0, saltados = 0;
for (const c of list) {
  const out = `${outDir}/${c.name}.mp4`;
  if (fs.existsSync(out) && fs.statSync(out).size > 20000) { saltados++; continue; }
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error",
    "-ss", String(c.start), "-i", avatar, "-t", String(Math.max(1.5, c.dur)),
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "26", "-an", "-pix_fmt", "yuv420p",
    "-g", "15", out], { stdio: "inherit" });
  hechos++;
}
console.log(`clips de kit: ${hechos} nuevos · ${saltados} ya estaban · total ${list.length} → ${outDir}/`);
