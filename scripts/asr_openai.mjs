#!/usr/bin/env node
// asr_openai.mjs — respaldo de ASR con OpenAI whisper-1 (timestamps POR PALABRA).
//
//   node scripts/asr_openai.mjs <wav> <out.json> <tramoSeg=600> <lang> [slug]
//
// Misma salida que modal_whisper.py: public/captions_<slug>.json = [{text,startMs,endMs,timestampMs,confidence}]
// (text con espacio adelante, como faster-whisper). <out.json> guarda la respuesta cruda por tramo.
// - El 3er arg son SEGUNDOS por tramo (pasar 5 hizo inventar frases en tcbriquetas): se rechaza < 60.
// - Los tramos se cortan en el SILENCIO más cercano al límite: cortar a mitad de palabra se comía ~10 palabras.
// - gpt-4o-transcribe rebota verbose_json (400): va whisper-1.
// - Cada fetch con timeout; progreso por tramo.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync, spawnSync } from "node:child_process";

const [wav, outJson, tramoArg = "600", lang = "es", slugArg] = process.argv.slice(2);
if (!wav || !outJson) { console.error("uso: node scripts/asr_openai.mjs <wav> <out.json> <tramoSeg> <lang> [slug]"); process.exit(1); }
const tramo = Number(tramoArg);
if (!(tramo >= 60)) { console.error(`tramo ${tramoArg} s: tiene que ser >= 60 (son SEGUNDOS por tramo)`); process.exit(1); }
const slug = slugArg || path.basename(wav).replace(/(_16k)?\.(wav|m4a|mp3|mp4)$/i, "");

function envKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  const t = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
  const m = t.match(/^OPENAI_API_KEY=(.+)$/m);
  if (!m) throw new Error("falta OPENAI_API_KEY");
  return m[1].trim().replace(/^["']|["']$/g, "");
}
const KEY = envKey();
const ff = (args) => execFileSync("ffmpeg", args, { stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 28 });
const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav], { encoding: "utf8" }).trim().replace(/,$/, ""));

// silencios del archivo entero (para cortar entre palabras)
let sil = [];
{
  const r = require_stderr(["-v", "info", "-i", wav, "-af", "silencedetect=n=-35dB:d=0.25", "-f", "null", "-"]);
  const starts = [...r.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
  const ends = [...r.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
  sil = starts.map((s, i) => (s + (ends[i] ?? s)) / 2);
}
// ffmpeg escribe silencedetect a STDERR aun cuando sale 0: hay que leer stderr siempre
function require_stderr(args) {
  return String(spawnSync("ffmpeg", args, { encoding: "utf8", maxBuffer: 1 << 28 }).stderr || "");
}
const bordes = [0];
while (dur - bordes.at(-1) > tramo * 1.15) {
  const ideal = bordes.at(-1) + tramo;
  const cand = sil.filter((s) => Math.abs(s - ideal) < 45);
  bordes.push(cand.length ? cand.reduce((a, b) => (Math.abs(b - ideal) < Math.abs(a - ideal) ? b : a)) : ideal);
}
bordes.push(dur);
console.log(`ASR whisper-1 · ${dur.toFixed(1)} s · ${bordes.length - 1} tramos · ${sil.length} silencios medidos`);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "asr-"));
const caps = [];
const crudo = [];
for (let i = 0; i < bordes.length - 1; i++) {
  const a = bordes[i], b = bordes[i + 1];
  const mp3 = path.join(tmp, `t${i}.mp3`);
  ff(["-v", "error", "-y", "-ss", a.toFixed(3), "-t", (b - a).toFixed(3), "-i", wav, "-ac", "1", "-ar", "16000", "-b:a", "64k", mp3]);
  let j;
  for (let intento = 1; intento <= 4; intento++) {
    try {
      const fd = new FormData();
      fd.append("file", new Blob([fs.readFileSync(mp3)], { type: "audio/mpeg" }), `t${i}.mp3`);
      fd.append("model", "whisper-1");
      fd.append("language", lang);
      fd.append("response_format", "verbose_json");
      fd.append("timestamp_granularities[]", "word");
      fd.append("timestamp_granularities[]", "segment");
      const r = await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: `Bearer ${KEY}` }, body: fd, signal: AbortSignal.timeout(300_000) });
      j = await r.json();
      if (!r.ok) throw new Error(`HTTP ${r.status} ${JSON.stringify(j).slice(0, 200)}`);
      break;
    } catch (e) {
      console.error(`tramo ${i} intento ${intento}: ${e.message}`);
      if (intento === 4) process.exit(1);
      await new Promise((r) => setTimeout(r, 5000 * intento));
    }
  }
  crudo.push({ desde: a, hasta: b, ...j });
  let last = caps.length ? caps.at(-1).endMs : 0;
  for (const w of j.words || []) {
    const s = Math.max(last, Math.round((w.start + a) * 1000));
    const e = Math.max(s, Math.round((w.end + a) * 1000));
    caps.push({ text: " " + w.word, startMs: s, endMs: e, timestampMs: e, confidence: 1 });
    last = s;
  }
  console.log(`tramo ${i + 1}/${bordes.length - 1} ${a.toFixed(1)}-${b.toFixed(1)} s · ${(j.words || []).length} palabras`);
}
fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(crudo, null, 1));
const capsPath = path.join("public", `captions_${slug}.json`);
fs.writeFileSync(capsPath, JSON.stringify(caps, null, 2));
fs.writeFileSync(path.join("public", `transcript_${slug}.txt`), caps.map((c) => c.text).join("").trim());
console.log(`✓ ${caps.length} palabras · ${capsPath}`);
