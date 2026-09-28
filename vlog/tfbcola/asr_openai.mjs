// asr_openai.mjs <audio> <out.json> — whisper-1 por palabra (respaldo de Modal) → {<audio>: [{text,startMs,endMs}]}
import fs from "node:fs";
const env = Object.fromEntries(fs.readFileSync(new URL("../../.env", import.meta.url), "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const [, , f, out] = process.argv;
const fd = new FormData(); fd.append("model", "whisper-1"); fd.append("language", "es"); fd.append("response_format", "verbose_json"); fd.append("timestamp_granularities[]", "word");
fd.append("file", new Blob([fs.readFileSync(f)], { type: "audio/mpeg" }), "a.mp3");
const j = await (await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: "Bearer " + env.OPENAI_API_KEY }, body: fd })).json();
if (!j.words) { console.error(JSON.stringify(j).slice(0, 400)); process.exit(1); }
fs.writeFileSync(out, JSON.stringify({ [f]: j.words.map(w => ({ text: w.word, startMs: Math.round(w.start * 1000), endMs: Math.round(w.end * 1000) })) }));
console.log("palabras", j.words.length, "dur", j.duration);
