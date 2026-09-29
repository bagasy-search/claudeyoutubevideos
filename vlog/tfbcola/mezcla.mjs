// mezcla.mjs — arma el AUDIO FINAL (voz + cama + SFX + foley + ambiente) con ffmpeg desde timeline.gen.ts, igual que lo
// suena Main_tfbcola, y lo deja en public/tfbcola.wav = el wav MÁSTER que el stitch del farm pone sobre el video.
// (Renderizar el audio con Remotion obliga a pasar por todos los cuadros: >10 min. Esto tarda segundos.)
import fs from "node:fs"; import { execFileSync } from "node:child_process";
const T = fs.readFileSync("src/tfbcola/timeline.gen.ts", "utf8");
const g = (n) => JSON.parse(T.match(new RegExp(`export const ${n}[^=]*= (\\[.*\\]);`))[1]);
const TOTAL = +T.match(/TOTAL_FRAMES_TFBCOLA = (\d+)/)[1], FPS = 30, D = TOTAL / FPS;
const VOICE = T.match(/export const VOICE = "([^"]+)"/)[1];
const AMB = (T.match(/AMB[^=]*= \{ src: "([^"]+)", vol: ([\d.]+) \}/) || []).slice(1);
const SFX = g("SFX"), MUS = g("MUSIC");
const ins = ["-i", "public/" + VOICE], fl = [], mix = ["[v0]"];
fl.push(`[0:a]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur=${D.toFixed(3)}[v0]`);
let n = 1;
if (AMB.length) { ins.push("-stream_loop", "-1", "-i", "public/" + AMB[0]); fl.push(`[${n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${D.toFixed(3)},volume=${AMB[1]}[a${n}]`); mix.push(`[a${n}]`); n++; }
for (const m of MUS) {
  ins.push("-stream_loop", "-1", "-i", "public/" + m.src);
  const ss = (m.startFrom || 0) / FPS, d = m.dur / FPS, fi = m.fadeIn / FPS, fo = m.fadeOut / FPS, ms = Math.round(m.from / FPS * 1000);
  fl.push(`[${n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=${ss.toFixed(3)}:${(ss + d).toFixed(3)},asetpts=PTS-STARTPTS,volume=${m.vol},afade=t=in:d=${fi.toFixed(2)},afade=t=out:st=${(d - fo).toFixed(2)}:d=${fo.toFixed(2)},adelay=${ms}|${ms}[a${n}]`);
  mix.push(`[a${n}]`); n++;
}
for (const s of SFX) {
  ins.push("-i", "public/" + s.src); const ms = Math.round(s.from / FPS * 1000), d = s.dur / FPS;
  fl.push(`[${n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${d.toFixed(3)},volume=${s.vol},adelay=${ms}|${ms}[a${n}]`); mix.push(`[a${n}]`); n++;
}
fl.push(`${mix.join("")}amix=inputs=${mix.length}:normalize=0:duration=first,atrim=0:${D.toFixed(3)},alimiter=limit=0.97[out]`);
fs.writeFileSync("out/mezcla_graph.txt", fl.join(";\n"));
execFileSync("ffmpeg", ["-v", "error", "-y", ...ins, "-/filter_complex", "out/mezcla_graph.txt", "-map", "[out]", "-ar", "48000", "-c:a", "pcm_s16le", "public/tfbcola.wav"], { stdio: "inherit", windowsHide: true, maxBuffer: 1 << 26 });
const dur = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", "public/tfbcola.wav"], { windowsHide: true }).toString();
console.log(`public/tfbcola.wav ${dur.toFixed(3)} s (video ${D.toFixed(3)} s) · ${SFX.length} sfx · ${MUS.length} música`);
