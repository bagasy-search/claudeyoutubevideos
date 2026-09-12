// audit_frames.mjs <mp4> — COMPUERTA OBLIGATORIA antes de entregar cualquier video.
// Detecta FRAMES MUERTOS (fondo navy/negro sin nada encima) con blackdetect.
// Uso: node scripts/audit_frames.mjs D:/videosdeclaude/federerN.mp4
import { execFileSync } from "child_process";
import fs from "fs";
const mp4 = process.argv[2];
if (!mp4 || !fs.existsSync(mp4)) { console.error("no existe:", mp4); process.exit(1); }
const FF = fs.readdirSync("C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages").filter(d => d.startsWith("Gyan.FFmpeg")).map(d => {
  const base = `C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/${d}`;
  const sub = fs.readdirSync(base).find(x => x.startsWith("ffmpeg-"));
  return `${base}/${sub}/bin/ffmpeg.exe`;
})[0];
let out = "";
try { out = execFileSync(FF, ["-nostdin", "-i", mp4, "-vf", "blackdetect=d=0.4:pic_th=0.85:pix_th=0.10", "-an", "-f", "null", "-"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); }
catch (e) { out = String(e.stderr || ""); }
const segs = [...out.matchAll(/black_start:([\d.]+) black_end:([\d.]+) black_duration:([\d.]+)/g)]
  .map(m => ({ start: +m[1], end: +m[2], dur: +m[3] }));
// MUERTOS = segmentos oscuros LARGOS (>1.5s). Los cortos (<1.5s) suelen ser transiciones/clips oscuros ok.
const dead = segs.filter(s => s.dur > 1.5);
const fmt = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
console.log(`segmentos oscuros: ${segs.length} · MUERTOS (>1.5s): ${dead.length}`);
for (const d of dead) console.log(`  ⛔ ${fmt(d.start)}–${fmt(d.end)} (${d.dur.toFixed(1)}s)`);
if (dead.length) { console.log("❌ NO ENTREGAR — hay frames muertos. Arreglar el b-roll/avatar y re-rendear."); process.exit(2); }
console.log("✅ sin frames muertos — se puede entregar.");
