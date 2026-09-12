// split_avatar_diagrams.mjs — extrae un CLIP CORTO del avatar por cada beat `diagram`
// (la ventana visible del diagrama), para que el PiP del avatar en DiagramBoard se
// reproduzca DESDE EL FRAME 0 (sin trimBefore / deep-seek). Eso arregla el bug de
// "avatar negro en el render del farm" (el seek profundo por-chunk devuelve negro).
//
// Uso: node scripts/split_avatar_diagrams.mjs <slug>
//   lee beatsheet/<slug>.json + public/<avatar>_opt.mp4 (bs.avatar)
//   escribe public/avatar_clips/<beatId>.mp4 (fast-decode, MUTED) por cada diagram.
import fs from "fs";
import { execFileSync } from "child_process";

const slug = process.argv[2];
if (!slug) { console.error("Uso: node scripts/split_avatar_diagrams.mjs <slug>"); process.exit(1); }
const bs = JSON.parse(fs.readFileSync(`beatsheet/${slug}.json`, "utf8"));
const avatar = `public/${bs.avatar}`;
if (!fs.existsSync(avatar)) { console.error("No existe el avatar:", avatar); process.exit(1); }

const outDir = `public/avatar_clips/${slug}`;
fs.mkdirSync(outDir, { recursive: true });

const diagrams = (bs.beats || []).filter((b) => b.kind === "diagram" || b.kind === "avpizarra");
console.log(`clips avatar (diagram+avpizarra): ${diagrams.length} · avatar: ${avatar}`);

for (const b of diagrams) {
  const out = `${outDir}/${b.id}.mp4`;
  // un pelín de cola extra para cubrir el fade de salida
  const dur = (b.dur + 0.4).toFixed(2);
  execFileSync("npx", [
    "remotion", "ffmpeg", "-y",
    "-ss", String(b.start), "-i", avatar, "-t", dur,
    "-an", // MUTED (el audio lo da el AvatarLayer global)
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "26",
    "-g", "30", "-keyint_min", "30", "-tune", "fastdecode", "-pix_fmt", "yuv420p",
    out,
  ], { stdio: "ignore", shell: true });
  console.log(`↓ ${b.id}.mp4  (${b.start}s +${dur}s)`);
}
console.log("=== LISTO ===");
