// split_avatar.mjs — corta el video del avatar en CLIPS CORTOS por ventana visible,
// para acelerar el render (buscar dentro de un clip de ~10s es mucho más barato que
// dentro de uno de 50 min). NO cambia nada de lo que se ve/oye: es el mismo material.
//
// Modelo de uso (estándar nuevo, jun 2026):
//   · El AUDIO de la narración va como UNA pista continua (public/<slug>.wav) en el Main,
//     NO desde el video del avatar. (AvatarLayer deja de proveer el audio.)
//   · El VIDEO del avatar se muestra solo en las ventanas donde aparece, desde clips
//     cortos MUDOS (-an). En las ventanas "hidden" no se decodifica NADA de video.
//   · Cada clip se ubica en el timeline en el mismo from de donde se cortó → sincroniza
//     con el audio continuo automáticamente (es el mismo metraje, misma posición).
//
// Input:  public/avatar_windows_<slug>.json = [{ "name":"w1", "from":44.9, "to":56.0 }, ...]
//         (SOLO las ventanas VISIBLES: full/right/left/cornerTR. Las "hidden" no se cortan.)
// Output: public/avatar_clips/<name>.mp4  (mudo, fast-decode)
//
// Uso:  node split_avatar.mjs <slug>           (avatar = public/<slug>_opt.mp4 o el master)
//       node split_avatar.mjs fly fly_opt.mp4  (segundo arg = archivo fuente explícito)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const slug = process.argv[2];
if (!slug) {
  console.error("Uso: node split_avatar.mjs <slug> [archivoFuente.mp4]");
  process.exit(1);
}
const SRC = path.join("public", process.argv[3] || `${slug}_opt.mp4`);
const WINDOWS = path.join("public", `avatar_windows_${slug}.json`);
const OUTDIR = path.join("public", "avatar_clips", slug);

// ffmpeg: usa el binario del compositor de Remotion en Windows; si no, 'ffmpeg' del PATH
// (en el VPS Linux estará en el PATH).
const winFf = path.join("node_modules", "@remotion", "compositor-win32-x64-msvc", "ffmpeg.exe");
const FF = fs.existsSync(winFf) ? winFf : "ffmpeg";

if (!fs.existsSync(SRC)) { console.error("No existe la fuente:", SRC); process.exit(1); }
if (!fs.existsSync(WINDOWS)) { console.error("No existe la lista de ventanas:", WINDOWS); process.exit(1); }
fs.mkdirSync(OUTDIR, { recursive: true });

const windows = JSON.parse(fs.readFileSync(WINDOWS, "utf8"));
let made = 0;
for (const w of windows) {
  const dur = +(w.to - w.from).toFixed(3);
  if (dur <= 0) { console.warn(`✗ ventana ${w.name} sin duración`); continue; }
  const out = path.join(OUTDIR, `${w.name}.mp4`);
  // -ss antes de -i = seek rápido; re-encode = corte limpio y frame-accurate; -an = sin audio.
  execFileSync(
    FF,
    [
      "-y", "-ss", String(w.from), "-i", SRC, "-t", String(dur),
      "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "28",
      "-g", "30", "-keyint_min", "30", "-tune", "fastdecode", "-pix_fmt", "yuv420p",
      out,
    ],
    { stdio: ["ignore", "ignore", "ignore"] },
  );
  made++;
  console.log(`↓ ${w.name}.mp4  (${w.from}s → ${w.to}s · ${dur}s)`);
}
console.log(`\nsplit_avatar: ${made}/${windows.length} clips en ${OUTDIR}`);
console.log(`Recordá: en el Main, audio = <Audio src="${slug}.wav"> continuo, y cada ventana`);
console.log(`visible usa su clip mudo avatar_clips/<name>.mp4 ubicado en su 'from'.`);
