// rksmart_entrega.mjs — RE-ENCODE DE ENTREGA + las compuertas que el creador cazó mirando el video.
//   node _v3/rksmart_entrega.mjs <mp4 crudo del farm> <salida.mp4>
//
// ⛔ EL MP4 DEL FARM NO SE ENTREGA CRUDO. Sale `yuvj420p` en rango `pc` con keyframes de hasta 9 s:
//    se ve "lageado" y "con un filtro que aumenta el brillo" aunque mida perfecto en cuadros.
// ⛔ Con `stitch_raw=1` el concat NO rehace los PTS → `setpts=N/30/TB -r 30 -fps_mode cfr` acá.
// ⛔⛔ InfiniteTalk adelanta los labios ~0,25 s de forma CONSTANTE (no es deriva). Se corrige
//    RETRASANDO EL VIDEO 0,25 s con `tpad` (clona el primer cuadro) y dejando el audio intacto.
//    ⛔ NO se corre el audio (la locución arranca en el cuadro 0 y se comería la 1ª palabra), y
//    ⛔ NO se desplazan las cues del avatar (son VENTANAS: dejaría un hueco al inicio de cada una).
// ⛔ El máster es MONO → `-af pan=stereo|c0=c0|c1=c0`, nunca `-ac 2` (deja el audio 3 dB abajo).
// ⛔ Se escribe a `.part` y se renombra: un re-encode cortado que conserva el nombre final se REUSA.
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const [CRUDO, OUT] = process.argv.slice(2);
if (!CRUDO || !OUT) { console.error("uso: node _v3/rksmart_entrega.mjs <crudo.mp4> <salida.mp4>"); process.exit(1); }
const WAV = "public/rksmart.wav";
const sh = (c, a) => execFileSync(c, a, { encoding: "utf8", maxBuffer: 512 * 1024 * 1024 });
const num = (s) => +String(s).match(/[\d.]+/)[0];
const dur = (f) => num(sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]));

const wavS = dur(WAV);
console.log(`crudo ${dur(CRUDO).toFixed(2)} s · máster ${wavS.toFixed(2)} s`);

const PART = OUT + ".part";
if (fs.existsSync(PART)) fs.rmSync(PART);
sh("ffmpeg", ["-v", "error", "-y", "-i", CRUDO, "-i", WAV,
  "-filter_complex", "[0:v]setpts=N/30/TB,tpad=start_duration=0.25:start_mode=clone,scale=in_range=full:out_range=limited,format=yuv420p[v]",
  "-map", "[v]", "-map", "1:a:0",
  "-r", "30", "-fps_mode", "cfr",
  "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
  "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
  "-g", "60", "-keyint_min", "60", "-sc_threshold", "0", "-maxrate", "8M", "-bufsize", "12M",
  "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-af", "pan=stereo|c0=c0|c1=c0",
  "-shortest", "-movflags", "+faststart", PART]);
fs.renameSync(PART, OUT);

// ── COMPUERTAS, todas con NÚMERO ───────────────────────────────────────────
const L = [];
const st = sh("ffprobe", ["-v", "error", "-select_streams", "v", "-show_entries", "stream=pix_fmt,color_range,color_space,r_frame_rate,avg_frame_rate,nb_frames", "-of", "csv=p=0", OUT]).trim().split(",");
L.push(["color/pix_fmt", `${st[0]},${st[1]},${st[2]}`, st[0] === "yuv420p" && st[1] === "tv" && st[2] === "bt709"]);
L.push(["r_frame_rate = avg_frame_rate", `${st[3]} / ${st[4]}`, st[3] === st[4]]);

const streams = sh("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type,channels", "-of", "csv=p=0", OUT]).trim().split("\n");
L.push(["pistas (video + audio)", streams.join(" | "), streams.some((s) => s.startsWith("video")) && streams.some((s) => s.startsWith("audio"))]);

// PTS: ni un solo cuadro fuera de 1/30 (la firma del tirón de las costuras del concat)
const pts = sh("ffprobe", ["-v", "error", "-select_streams", "v", "-show_entries", "packet=pts_time,dts_time", "-of", "csv=p=0", OUT])
  .trim().split("\n").map((l) => l.replace(/,$/, "").split(",").map(Number));
const desor = pts.filter(([p, d]) => Number.isFinite(p) && Number.isFinite(d) && Math.abs(p - d) > 1e-6).length;
const t = pts.map((x) => x[0]).filter(Number.isFinite).sort((a, b) => a - b);
let saltos = 0;
for (let i = 1; i < t.length; i++) if (Math.abs(t[i] - t[i - 1] - 1 / 30) > 0.004) saltos++;
L.push(["cuadros medidos", t.length, t.length > 40000]);
L.push(["pts != dts", desor, desor === 0]);
L.push(["deltas fuera de 1/30 ±4 ms", saltos, saltos === 0]);

// audio: nivel en 4 puntos, incluido el ÚLTIMO minuto (un -91 dB es silencio)
const D = dur(OUT);
const niveles = [30, D * 0.35, D * 0.7, D - 40].map((p) => {
  const o = execFileSync("ffmpeg", ["-hide_banner", "-nostats", "-ss", String(Math.max(0, p)), "-t", "4", "-i", OUT, "-vn", "-af", "volumedetect", "-f", "null", "-"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  return +(String(o).match(/mean_volume:\s*(-?[\d.]+)/) || [])[1];
});
L.push(["mean_volume en 4 puntos (dB)", niveles.map((n) => n.toFixed(1)).join(" "), niveles.every((n) => n > -60)]);
L.push(["duración vs máster (s)", `${D.toFixed(2)} vs ${wavS.toFixed(2)}`, Math.abs(D - wavS) < 0.8]);

let malos = 0;
console.log("═".repeat(72));
for (const [e, v, ok] of L) { if (!ok) malos++; console.log(`${ok ? "✓" : "⛔"} ${String(e).padEnd(32)} ${v}`); }
console.log("═".repeat(72));
console.log(`→ ${OUT}  (${(fs.statSync(OUT).size / 1048576).toFixed(0)} MB)`);
process.exit(malos ? 3 : 0);
