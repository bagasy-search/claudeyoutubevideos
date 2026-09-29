// mezcla.mjs — AUDIO FINAL (voz + ambiente/música con ducking + SFX + foley) con ffmpeg desde timeline_tfbpiso.gen.ts,
// igual que lo suena Main_tfbpiso → public/tfbpiso.wav (el wav máster que va sobre el video en la entrega).
import fs from "node:fs"; import { execFileSync } from "node:child_process";
const T = fs.readFileSync("src/tfbpiso/timeline_tfbpiso.gen.ts", "utf8");
const g = n => JSON.parse(T.split("\n").find(l => l.startsWith(`export const ${n}:`)).replace(/^[^=]*= /, "").replace(/;\s*$/, ""));
const TOTAL = +T.match(/TOTAL_FRAMES_TFBPISO = (\d+)/)[1], FPS = 30, D = TOTAL / FPS;
const VOICE = T.match(/export const VOICE = "([^"]+)"/)[1];
const ins = ["-i", "public/" + VOICE], fl = [`[0:a]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur=${D.toFixed(3)}[v0]`], mix = ["[v0]"];
let n = 1;
const add = (s, loop, ss, d, vol, fade) => { if (loop) ins.push("-stream_loop", "-1"); ins.push("-i", "public/" + s.src); const ms = Math.round(s.from / FPS * 1000);
  fl.push(`[${n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=${ss.toFixed(3)}:${(ss + d).toFixed(3)},asetpts=PTS-STARTPTS,volume=${vol}${fade ? `,afade=t=in:d=0.13,afade=t=out:st=${Math.max(0, d - 0.17).toFixed(3)}:d=0.17` : ""},adelay=${ms}|${ms}[a${n}]`); mix.push(`[a${n}]`); n++; };
for (const m of g("MUSIC")) add(m, true, (m.startFrom || 0) / FPS, m.dur / FPS, m.vol, false);
for (const s of g("FOLEY")) add(s, false, (s.startFrom || 0) / FPS, s.dur / FPS, s.vol, true);
for (const s of g("SFX")) add(s, false, 0, (s.dur || 90) / FPS, s.vol, false);
fl.push(`${mix.join("")}amix=inputs=${mix.length}:normalize=0:duration=first,atrim=0:${D.toFixed(3)},alimiter=limit=0.97[out]`);
fs.writeFileSync("out/mezcla_graph.txt", fl.join(";\n"));
execFileSync("ffmpeg", ["-v", "error", "-y", ...ins, "-/filter_complex", "out/mezcla_graph.txt", "-map", "[out]", "-ar", "48000", "-c:a", "pcm_s16le", "public/tfbpiso.wav"], { stdio: "inherit", windowsHide: true, maxBuffer: 1 << 26 });
const dur = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", "public/tfbpiso.wav"], { windowsHide: true }).toString();
console.log(`public/tfbpiso.wav ${dur.toFixed(3)} s (video ${D.toFixed(3)} s) · inputs ${n}`);
