// avatar_assemble.mjs — ENSAMBLA los reels de InfiniteTalk en un avatar SIN drift de lipsync.
//
// ⛔ POR QUÉ EXISTE (medido teamind60, 16-sep-2026): InfiniteTalk (RunPod) devuelve el mp4 a **25 fps**
//    y **TRUNCA ~0.3-0.4 s de audio por llamada** (el header a veces MIENTE la duración). Si concatenás
//    los reels crudos, el 2º reel arranca ANTES de su origen real de audio → toda la 2ª mitad adelanta
//    ~0.3 s → "arranca bien y al final se desincroniza". El fix es PLANTAR cada reel en su span EXACTO
//    del máster (padear/recortar) y conformar a 30 CFR. Compuerta: dur(avatar) == dur(máster).
//
// Uso:
//   node scripts/avatar_assemble.mjs <out.mp4> <master.wav> <reel1.mp4:startS:endS> [<reel2.mp4:startS:endS> ...]
//   - Un solo reel:  node scripts/avatar_assemble.mjs out.mp4 master.wav reel.mp4:0:1077.19
//   - startS/endS = el span de ESE reel en el TIEMPO DEL MÁSTER (los mismos offsets con que cortaste el audio).
//     El reel se estira/recorta a (endS-startS): el pad (clone del último frame) cae en el silencio del corte
//     o en la cola, así que es invisible. Si el reel vino MÁS LARGO que su span, se recorta.
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const FF = process.env.FFMPEG || "ffmpeg";
const FP = process.env.FFPROBE || "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe";
const args = process.argv.slice(2);
if (args.length < 2) { console.error("uso: node scripts/avatar_assemble.mjs <out.mp4> <master.wav> <reel.mp4:startS:endS> [...]"); process.exit(1); }
const [OUT, MASTER, ...reelSpecs] = args;
const TMP = process.env.AVATAR_TMP || (process.env.TMPDIR || "D:/rtmp") + "/_avatar_asm";
fs.mkdirSync(TMP, { recursive: true });

// duración REAL por el último frame decodable (el header miente tras la truncación de RunPod)
const realDur = (f) => {
  const r = spawnSync(FP, ["-v", "error", "-select_streams", "v:0", "-show_entries", "frame=best_effort_timestamp_time",
    "-of", "csv=p=0", "-read_intervals", "99999%+#2", f], { encoding: "utf8" }); // últimos frames
  const hdr = spawnSync(FP, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" });
  const nb = spawnSync(FP, ["-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries", "stream=nb_read_frames,r_frame_rate", "-of", "csv=p=0", f], { encoding: "utf8" });
  const [frames, fr] = (nb.stdout || "").trim().split(",");
  const fps = fr && fr.includes("/") ? (+fr.split("/")[0] / +fr.split("/")[1]) : 30;
  const byFrames = frames ? (+frames) / fps : NaN;
  const byHdr = parseFloat((hdr.stdout || "").trim());
  return isFinite(byFrames) ? byFrames : byHdr; // frames*fps es lo fiable
};
const durOf = (f) => { const r = spawnSync(FP, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }); return parseFloat((r.stdout || "").trim()); };
const run = (a) => { const r = spawnSync(FF, a, { stdio: "inherit" }); if (r.status !== 0) { console.error("ffmpeg falló:", a.join(" ")); process.exit(1); } };

const masterDur = durOf(MASTER);
console.log(`máster: ${masterDur.toFixed(3)}s · reels: ${reelSpecs.length}`);
const parts = [];
let spanSum = 0;
for (let i = 0; i < reelSpecs.length; i++) {
  const m = reelSpecs[i].match(/^(.*\.mp4):([0-9.]+):([0-9.]+)$/i);
  if (!m) { console.error(`spec inválida (usá reel.mp4:startS:endS): ${reelSpecs[i]}`); process.exit(1); }
  const [, file, s, e] = m; const span = +(+e - +s).toFixed(3); spanSum += span;
  const rd = realDur(file);
  console.log(`  reel${i + 1}: real ${rd.toFixed(3)}s → span ${span.toFixed(3)}s (${rd < span ? "PAD" : "trim"} ${Math.abs(span - rd).toFixed(3)}s)`);
  const outp = path.join(TMP, `r${i}.mp4`);
  // conformar a 1920x1080@30 CFR + fijar duración EXACTA al span (tpad clona el último frame; -t recorta el sobrante)
  run(["-v", "error", "-y", "-i", file,
    "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,tpad=stop_mode=clone:stop_duration=2",
    "-t", String(span), "-an", "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", outp]);
  parts.push(outp);
}
// concat
const cat = path.join(TMP, "cat.txt");
fs.writeFileSync(cat, parts.map((p) => `file '${p.replace(/\\/g, "/")}'`).join("\n") + "\n");
run(["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", cat, "-c", "copy", OUT]);

// COMPUERTA: dur(avatar) ≈ dur(máster)
const outDur = durOf(OUT);
const diff = Math.abs(outDur - masterDur);
console.log(`AVATAR ${OUT}: ${outDur.toFixed(3)}s  (máster ${masterDur.toFixed(3)}s, spans ${spanSum.toFixed(3)}s, diff ${diff.toFixed(3)}s)`);
if (diff > 0.15) { console.error(`⛔ dur(avatar) difiere del máster ${diff.toFixed(3)}s (>0.15). Los spans no cubren el máster → drift. Revisá los offsets.`); process.exit(2); }
console.log("✓ avatar ensamblado, alineado al máster (sin drift de lipsync)");
