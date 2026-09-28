// ASR por palabra con whisper-1 (respaldo de Modal) -> out/tfbpintura/asr.json {"voz": [{text,startMs,endMs}]}
import fs from "fs";
const env = Object.fromEntries(fs.readFileSync(new URL("../../.env", import.meta.url), "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const [, , inp, out] = process.argv;
const fd = new FormData(); fd.append("model", "whisper-1"); fd.append("language", "es"); fd.append("response_format", "verbose_json");
fd.append("timestamp_granularities[]", "word"); fd.append("file", new Blob([fs.readFileSync(inp)], { type: "audio/mpeg" }), "a.mp3");
const r = await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: "Bearer " + env.OPENAI_API_KEY }, body: fd, signal: AbortSignal.timeout(600000) });
const j = await r.json(); if (!j.words) { console.error("NO MIDIÓ", JSON.stringify(j).slice(0, 300)); process.exit(2); }
fs.writeFileSync(out, JSON.stringify({ voz: j.words.map(w => ({ text: w.word, startMs: Math.round(w.start * 1000), endMs: Math.round(w.end * 1000) })) }));
console.log("palabras", j.words.length, "dur", j.duration);
