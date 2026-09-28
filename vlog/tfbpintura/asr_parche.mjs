// re-transcribe ventanas [a,b] (s) del voz.wav con whisper-1 y reemplaza esas palabras en asr.json
import fs from "fs"; import { execFileSync } from "child_process";
const env = Object.fromEntries(fs.readFileSync(new URL("../../.env", import.meta.url), "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const O = "out/tfbpintura/", A = JSON.parse(fs.readFileSync(O + "asr.json", "utf8"));
let w = A.voz;
for (const win of process.argv.slice(2)) {
  const [a, b] = win.split(":").map(Number);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(a), "-to", String(b), "-i", O + "voz.wav", "-ac", "1", "-ar", "16000", O + "_win.wav"]);
  const fd = new FormData(); fd.append("model", "whisper-1"); fd.append("language", "es"); fd.append("response_format", "verbose_json"); fd.append("timestamp_granularities[]", "word");
  fd.append("file", new Blob([fs.readFileSync(O + "_win.wav")], { type: "audio/wav" }), "a.wav");
  const j = await (await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: "Bearer " + env.OPENAI_API_KEY }, body: fd })).json();
  if (!j.words) { console.error("NO MIDIÓ", win); process.exit(2); }
  const nw = j.words.map(x => ({ text: x.word, startMs: Math.round((x.start + a) * 1000), endMs: Math.round((x.end + a) * 1000) }));
  w = [...w.filter(x => x.endMs < a * 1000 || x.startMs > b * 1000), ...nw].sort((p, q) => p.startMs - q.startMs);
  console.log(win, "->", j.text);
}
fs.writeFileSync(O + "asr.json", JSON.stringify({ voz: w }));
