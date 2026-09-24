import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { SCENES } from "./guion_src.mjs";
const R = "D:/Proyectos/video2-wt/faoliva/", V = R + "vlog/faoliva/";
const tr = JSON.parse(fs.readFileSync(V + "tramos.json", "utf8"));
fs.mkdirSync(V + "tramos", { recursive: true });
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a]);
const dur = f => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const voz = SCENES.flatMap(s => s.lines.filter(l => l.k !== "w"));
if (voz.length !== tr.length) throw new Error(`voz ${voz.length} != tramos ${tr.length}`);
voz.forEach((l, i) => {
  if (l.k !== "lam" && tr[i].t !== l.t) throw new Error("desfase " + l.id);
  const o = V + "tramos/" + l.id + ".wav";
  if (l.k === "lam") ff("-i", R + "out/faoliva_lam/master.wav", "-af", "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.15,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.3,areverse,silenceremove=stop_periods=-1:stop_threshold=-45dB:stop_duration=0.45:stop_silence=0.45", "-ac", "1", "-ar", "44100", o);
  else ff("-ss", tr[i].s.toFixed(3), "-to", tr[i].e.toFixed(3), "-i", R + "out/faoliva/master.wav", "-ac", "1", "-ar", "44100", o);
});
const d = voz.map(l => [l.id, dur(V + "tramos/" + l.id + ".wav")]);
console.log("tramos", d.length, "LAM", d.find(x => x[0] === "LAM")[1].toFixed(2), ">11.8:", d.filter(x => x[0] !== "LAM" && x[1] > 11.8).map(x => x.join(":")).join(" "));
