// cut_kit_vezegakr5r53.mjs — corta un CLIP corto del avatar por cada beat avatarkeyword/avatarpizarra
// (lee public/avatar_clips_vezegakr5r53.json = KIT_CLIPS {name,start,dur}) → public/avatar_clips/vezegakr5r53/<name>.mp4
// desde el frame 0 (fast-decode, MUTED). Evita el deep-seek que da avatar negro en el farm.
import fs from "fs";
import { execFileSync } from "child_process";
const SLUG = "vezegakr5r53";
const avatar = `public/${SLUG}_opt.mp4`;
if (!fs.existsSync(avatar)) { console.error("No existe el avatar:", avatar); process.exit(1); }
const clips = JSON.parse(fs.readFileSync(`public/avatar_clips_${SLUG}.json`, "utf8"));
const outDir = `public/avatar_clips/${SLUG}`;
fs.mkdirSync(outDir, { recursive: true });
console.log(`cortando ${clips.length} clips de kit del avatar…`);
let done = 0;
for (const c of clips) {
  const out = `${outDir}/${c.name}.mp4`;
  if (fs.existsSync(out)) { done++; continue; }
  const dur = (c.dur).toFixed(2);
  try {
    execFileSync("ffmpeg", [
      "-y", "-ss", String(c.start), "-i", avatar, "-t", dur,
      "-an",
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "24",
      "-g", "30", "-keyint_min", "30", "-tune", "fastdecode", "-pix_fmt", "yuv420p",
      "-movflags", "+faststart", out,
    ], { stdio: "ignore" });
    done++;
  } catch (e) { console.warn(`✗ ${c.name}: ${String(e.message || e).slice(0, 100)}`); }
}
console.log(`=== LISTO · ${done}/${clips.length} clips en ${outDir} ===`);
