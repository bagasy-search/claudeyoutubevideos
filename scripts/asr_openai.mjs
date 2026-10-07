// asr_openai.mjs — transcripción con timestamps POR PALABRA usando la API de OpenAI (whisper-1).
// ⛔ El modelo va whisper-1: gpt-4o-transcribe rebota verbose_json (sin timestamps por palabra).
// Uso: node scripts/asr_openai.mjs <audio|video> <out.json> [chunkSec=600] [lang=en] [slug]
//   out.json = { duration, text, words:[{word,start,end}] }
//   si se pasa [slug] escribe además public/captions_<slug>.json ([{text,startMs,endMs}] una por palabra)
import fs from "fs";
import path from "path";
import os from "os";
import { execFileSync } from "child_process";

const envFile = path.join(process.cwd(), ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error("Falta OPENAI_API_KEY"); process.exit(1); }

const [src, out, chunkArg = "600", lang = "en", slug] = process.argv.slice(2);
if (!src || !out) { console.error("uso: node scripts/asr_openai.mjs <audio> <out.json> [chunkSec] [lang] [slug]"); process.exit(1); }
const CHUNK = +chunkArg;
const FF = process.env.FFMPEG || "ffmpeg";
const FP = process.env.FFPROBE || "ffprobe";

const dur = parseFloat(execFileSync(FP, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src], { encoding: "utf8" }).trim());
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "asr_"));
const n = Math.ceil(dur / CHUNK);
console.log(`audio ${dur.toFixed(2)}s -> ${n} tramos de ${CHUNK}s`);

const words = []; let text = "";
for (let i = 0; i < n; i++) {
  const t0 = i * CHUNK;
  const f = path.join(tmp, `c${i}.mp3`);
  execFileSync(FF, ["-v", "error", "-y", "-ss", String(t0), "-t", String(CHUNK), "-i", src, "-vn", "-ac", "1", "-ar", "16000", "-b:a", "48k", f]);
  let j = null;
  for (let a = 1; a <= 4 && !j; a++) {
    try {
      const fd = new FormData();
      fd.append("file", new Blob([fs.readFileSync(f)], { type: "audio/mpeg" }), `c${i}.mp3`);
      fd.append("model", "whisper-1");
      fd.append("language", lang);
      fd.append("response_format", "verbose_json");
      fd.append("timestamp_granularities[]", "word");
      fd.append("timestamp_granularities[]", "segment");
      const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST", headers: { Authorization: `Bearer ${KEY}` }, body: fd, signal: AbortSignal.timeout(300000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status} ${(await r.text()).slice(0, 200)}`);
      j = await r.json();
    } catch (e) { console.log(`  tramo ${i} intento ${a} fallo: ${e.message}`); await new Promise((s) => setTimeout(s, 4000 * a)); }
  }
  if (!j) { console.error(`tramo ${i} sin transcribir`); process.exit(2); }
  let last = words.length ? words[words.length - 1].end : 0;
  for (const w of j.words || []) {
    const st = Math.max(last, +(w.start + t0).toFixed(3)); const en = Math.max(st, +(w.end + t0).toFixed(3));
    words.push({ word: w.word, start: st, end: en }); last = st;
  }
  text += (text ? " " : "") + (j.text || "").trim();
  console.log(`  tramo ${i + 1}/${n}: ${(j.words || []).length} palabras`);
}
fs.writeFileSync(out, JSON.stringify({ duration: dur, text, words }, null, 1));
console.log(`OK ${words.length} palabras medidas -> ${out}`);
if (slug) {
  const caps = words.map((w) => ({ text: w.word, startMs: Math.round(w.start * 1000), endMs: Math.round(w.end * 1000) }));
  fs.writeFileSync(`public/captions_${slug}.json`, JSON.stringify(caps));
  console.log(`captions -> public/captions_${slug}.json (${caps.length})`);
}
fs.rmSync(tmp, { recursive: true, force: true });
