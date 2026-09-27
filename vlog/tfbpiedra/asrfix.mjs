// re-transcribe ventanas del máster ORIGINAL (whisper-1 por palabra) y reemplaza esas palabras en public/captions_tfbpiedra.json
// node asrfix.mjs <t0_orig_s> <dur_s> [...]
import fs from "node:fs"; import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/tfbpiedra/";
const env = Object.fromEntries(fs.readFileSync(R + ".env", "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const CF = R + "public/captions_tfbpiedra.json"; let caps = JSON.parse(fs.readFileSync(CF, "utf8"));
const a = process.argv.slice(2).map(Number);
for (let i = 0; i < a.length; i += 2) {
  const t0 = a[i], d = a[i + 1], w = R + "vlog/tfbpiedra/_fix.wav";
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(t0), "-t", String(d), "-i", R + "out/tfbpiedra/master.wav", "-ac", "1", "-ar", "16000", w]);
  const fd = new FormData(); fd.append("model", "whisper-1"); fd.append("language", "es"); fd.append("response_format", "verbose_json"); fd.append("timestamp_granularities[]", "word");
  fd.append("file", new Blob([fs.readFileSync(w)]), "a.wav");
  const j = await (await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: "Bearer " + env.OPENAI_API_KEY }, body: fd })).json();
  const nw = j.words.map(x => ({ text: x.word, startMs: Math.round((t0 + x.start) * 1000), endMs: Math.round((t0 + x.end) * 1000), timestampMs: Math.round((t0 + x.start) * 1000), confidence: 1 }));
  // margen de 1 s a cada lado para no pisar palabras cortadas en el borde
  const lo = (t0 + 1) * 1000, hi = (t0 + d - 1) * 1000;
  const keep = caps.filter(c => c.startMs < lo || c.startMs > hi), ins = nw.filter(c => c.startMs >= lo && c.startMs <= hi);
  caps = [...keep, ...ins].sort((x, y) => x.startMs - y.startMs);
  console.log(t0, "→", ins.length, "palabras:", ins.map(x => x.text).join(" ").slice(0, 160));
}
fs.writeFileSync(CF, JSON.stringify(caps, null, 1));
