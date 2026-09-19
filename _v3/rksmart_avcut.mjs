// rksmart_avcut.mjs — parte el reel de RunPod en UN clip por ventana, 1920x1080 30/1 CFR, sin audio.
//   node _v3/rksmart_avcut.mjs
// ⛔ Cada clip tiene que durar lo que su ventana ±2 cuadros: si se va de rango, el montaje deja un
//    hueco (y acá un hueco es NEGRO, no avatar de fondo).
// ⛔ La sincronía se mide sobre el REEL CRUDO contra SU wav, antes de montar nada.
import fs from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";

const A = "_v3/rksmart/av", OUT = "public/broll/rksmart";
const W = JSON.parse(fs.readFileSync("_v3/rksmart_windows.json", "utf8"));
fs.mkdirSync(OUT, { recursive: true });
const dur = (f) => +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }).match(/[\d.]+/)[0];

const malos = [], fps = new Set();
for (const w of W) {
  const d = w.end - w.start;
  const dst = `${OUT}/av_w${String(w.k).padStart(3, "0")}.mp4`;
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", w.reel_off.toFixed(3), "-i", `${A}/reel.mp4`, "-t", d.toFixed(3),
    "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1",
    "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", dst]);
  const real = dur(dst);
  if (Math.abs(real - d) > 2 / 30 + 0.02) malos.push(`w${w.k}: ${real.toFixed(3)} vs ${d.toFixed(3)}`);
  fps.add(execFileSync("ffprobe", ["-v", "error", "-select_streams", "v", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", dst], { encoding: "utf8" }).trim().replace(/,$/, ""));
}
console.log(`MEDIDO: ventanas cortadas ${W.length} · mal cortadas ${malos.length} ${malos.length ? "⛔ " + malos.slice(0, 5).join(" ") : "✓"}`);
console.log(`fps de los clips de avatar: ${[...fps].join(" ")} ${fps.size === 1 && fps.has("30/1") ? "✓" : "⛔"}`);

// sincronía labios/audio sobre el reel crudo
const s = spawnSync("node", ["scripts/avatar_sync_gate.mjs", `${A}/reel.mp4`, `${A}/reel.wav`], { encoding: "utf8" });
const txt = (s.stdout || "") + (s.stderr || "");
const corr = Number((txt.match(/correlaci[oó]n m[aá]x:\s*(-?[\d.]+)/) || [])[1]);
const lag = Number((txt.match(/desfase:\s*(-?[\d.]+)s/) || [])[1]);
console.log(`SINCRO del reel: correlación ${corr} (piso 0,35) · desfase ${(lag * 1000).toFixed(0)} ms (techo 40) ` +
  (corr >= 0.35 && Math.abs(lag) <= 0.04 ? "✓" : "⚠️ revisar"));
if (!Number.isFinite(corr)) console.log("  ⚠️ el medidor de sincro no imprimió número — NO es un OK:\n" + txt.slice(0, 400));
if (malos.length || fps.size !== 1 || !fps.has("30/1")) process.exit(3);
