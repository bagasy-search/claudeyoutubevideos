// check_timestamps.mjs — COMPUERTA DE TIMESTAMPS sobre el MP4 final del farm.
//
// ⛔ Caza la familia de defectos que NINGUNA otra compuerta ve, porque cada cuadro está perfecto y
// lo que está mal es CUÁNDO se muestra: el `concat -c copy` del stitch deja un salto de tiempo en
// CADA costura de chunk (medido: 59 costuras, 88 ms en vez de 33,3, una cada 25 s). Se ve como
// TIRÓN de punta a punta y estuvo en TODOS los videos entregados hasta el 29-ago-2026.
//
//   node scripts/check_timestamps.mjs <final.mp4> [fps=30]     · exit 1 = NO entregar
import { execFileSync } from "node:child_process";
const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const [mp4, fpsArg] = process.argv.slice(2);
if (!mp4) { console.error("uso: node scripts/check_timestamps.mjs <final.mp4> [fps]"); process.exit(2); }
const FPS = Number(fpsArg || 30), DT = 1 / FPS;

const pr = (args) => execFileSync(FFPROBE, ["-v", "error", ...args, mp4], { encoding: "utf8", maxBuffer: 1 << 28 });

// 1) atajo de 2 segundos: si la cadencia declarada y la real no coinciden, ya está mal
const [r, avg] = pr(["-select_streams", "v", "-show_entries", "stream=r_frame_rate,avg_frame_rate", "-of", "csv=p=0"])
  .trim().split(",");
const val = (x) => { const [a, b] = x.split("/").map(Number); return b ? a / b : a; };
console.log(`declarado ${r} (${val(r).toFixed(3)}) · real ${avg} (${val(avg).toFixed(3)})`);

// 2) la medición que manda: cada delta entre cuadros tiene que ser 1/fps
const pts = pr(["-select_streams", "v", "-show_entries", "frame=pts_time", "-of", "csv=p=0"])
  .split("\n").map((s) => parseFloat(s)).filter(Number.isFinite).sort((a, b) => a - b);
const malos = [];
let muerto = 0;
for (let i = 1; i < pts.length; i++) {
  const d = pts[i] - pts[i - 1];
  if (Math.abs(d - DT) > 0.004) { malos.push([pts[i - 1], d]); muerto += d - DT; }
}
console.log(`cuadros ${pts.length} · saltos irregulares ${malos.length} · tiempo muerto ${muerto.toFixed(2)}s`);
malos.slice(0, 6).forEach(([t, d]) => console.log(`   en ${t.toFixed(3)}s -> ${(d * 1000).toFixed(1)} ms`));

if (malos.length) {
  console.error(`\n⛔ ${malos.length} saltos de tiempo: el video TIEMBLA cada ${(pts.length / FPS / malos.length).toFixed(1)}s.`);
  console.error(`   Arreglo sin re-rendear (copia de stream, ~2 min):`);
  console.error(`   ffmpeg -y -i ${mp4} -map 0:v -c:v copy -bsf:v h264_mp4toannexb -f h264 v.h264`);
  console.error("   ffmpeg -y -fflags +genpts -r " + FPS + " -i v.h264 -i public/<slug>.wav \\");
  console.error("     -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart ok.mp4");
  process.exit(1);
}
console.log("\n✓ timestamps perfectos: sin saltos, cadencia constante.");
