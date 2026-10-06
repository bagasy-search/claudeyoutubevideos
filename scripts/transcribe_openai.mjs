// transcribe_openai.mjs — Whisper por la API de OpenAI (NUBE, no toca la GPU/CPU local).
// Reemplazo de `modal_whisper.py` cuando Modal se queda sin presupuesto. MISMA salida:
//   public/captions_<slug>.json  (una entrada por PALABRA: {text,startMs,endMs,timestampMs,confidence})
//   transcript_<slug>.txt · transcript_<slug>_timed.txt
//
//   node scripts/transcribe_openai.mjs <slug> [wav] [lang]
//
// Notas:
//  - El limite de subida es 25 MB, asi que el wav se pasa a mp3 mono 64k (19 min ~ 9 MB) y,
//    si aun asi no entra, se parte en tramos con OFFSET (los ms se corrigen al mergear).
//  - `timestamp_granularities[]=word` exige `response_format=verbose_json`.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import "dotenv/config";

const [SLUG, WAV_IN, LANG = "es"] = process.argv.slice(2);
if (!SLUG) { console.error("uso: node scripts/transcribe_openai.mjs <slug> [wav] [lang]"); process.exit(1); }
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error("falta OPENAI_API_KEY"); process.exit(1); }

const wav = WAV_IN || (fs.existsSync(`public/${SLUG}_16k.wav`) ? `public/${SLUG}_16k.wav` : `public/${SLUG}.wav`);
if (!fs.existsSync(wav)) { console.error(`no existe ${wav}`); process.exit(1); }

const TMP = "_v3/_tx";
fs.mkdirSync(TMP, { recursive: true });
const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav]).toString().trim());
const TRAMO = 900;                                   // 15 min por pedazo: entra comodo en los 25 MB
const partes = Math.max(1, Math.ceil(dur / TRAMO));
console.log(`${wav} · ${dur.toFixed(1)} s · ${partes} tramo(s)`);

const caps = [];
for (let i = 0; i < partes; i++) {
  const off = i * TRAMO;
  const mp3 = path.join(TMP, `${SLUG}_${i}.mp3`);
  if (!fs.existsSync(mp3)) {
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(off), "-t", String(TRAMO), "-i", wav,
      "-ac", "1", "-ar", "16000", "-b:a", "64k", mp3]);
  }
  const mb = (fs.statSync(mp3).size / 1e6).toFixed(1);
  const form = new FormData();
  form.append("file", new Blob([fs.readFileSync(mp3)]), path.basename(mp3));
  form.append("model", "whisper-1");
  form.append("language", LANG);
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "word");
  process.stdout.write(`  tramo ${i + 1}/${partes} (${mb} MB) … `);
  const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST", headers: { Authorization: `Bearer ${KEY}` }, body: form,
  });
  const t = await r.text();
  if (!r.ok) { console.error(`\nHTTP ${r.status} ${t.slice(0, 300)}`); process.exit(2); }
  const j = JSON.parse(t);
  for (const w of j.words || []) {
    const s = Math.round((w.start + off) * 1000);
    const e = Math.round((w.end + off) * 1000);
    caps.push({ text: w.word, startMs: s, endMs: e, timestampMs: Math.round((s + e) / 2), confidence: 1 });
  }
  console.log(`${(j.words || []).length} palabras`);
}

caps.sort((a, b) => a.startMs - b.startMs);
fs.writeFileSync(`public/captions_${SLUG}.json`, JSON.stringify(caps, null, 2));
const plain = caps.map((c) => c.text).join(" ").replace(/\s+([,.;:!?])/g, "$1");
fs.writeFileSync(`transcript_${SLUG}.txt`, plain);
const fmt = (ms) => `${String(Math.floor(ms / 60000)).padStart(2, "0")}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}.${String(ms % 1000).padStart(3, "0")}`;
fs.writeFileSync(`transcript_${SLUG}_timed.txt`, caps.map((c) => `[${fmt(c.startMs)}] ${c.text}`).join("\n"));
console.log(`✓ ${caps.length} palabras · public/captions_${SLUG}.json`);
