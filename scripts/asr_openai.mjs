// asr_openai.mjs — transcripcion con timestamps POR PALABRA, por la API de OpenAI.
// Reemplaza a `transcribe_cuda.mjs` (Whisper local) y a `modal_whisper.py`: no se usa mas
// Whisper en la maquina ni en Modal.
//
//   node scripts/asr_openai.mjs <wav_o_mp4> <outJson> [minutosPorTrozo=5] [idioma=en]
//
// ⛔⛔ EL MODELO VA `whisper-1` Y NO SE "ACTUALIZA". Medido 2026-09-12 contra la API:
//       whisper-1              verbose_json + word  -> OK, 16 palabras con timestamp
//       gpt-4o-transcribe      verbose_json         -> HTTP 400 "not compatible"
//       gpt-4o-mini-transcribe verbose_json         -> HTTP 400 "not compatible"
//     Los modelos nuevos son mejores transcribiendo pero NO dan timestamps por palabra, que es
//     justo lo unico que el anclaje necesita. Cambiarlos rompe el anclaje EN SILENCIO.
//
// ⛔ whisper-1 topea en 25 MB: el audio se parte en trozos y se reponen los offsets. Los cortes
//    caen en cualquier lado y NO importa: el anclaje posterior hace una alineacion GLOBAL
//    guion<->ASR con difflib, que absorbe unas pocas palabras rotas en los bordes.
//
// ⛔ Y el ASR NUNCA escribe lo que dice el guion: pone "20 minutes" donde el guion dice "twenty
//    minutes" y "¾ inch" donde dice "three-quarter inch". Por eso el anclaje no busca frases.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import "dotenv/config";

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error("falta OPENAI_API_KEY en .env"); process.exit(1); }
const [SRC, OUT, MINS = "5", LANG = "en"] = process.argv.slice(2);
if (!SRC || !OUT) { console.error("uso: node scripts/asr_openai.mjs <wav|mp4> <outJson> [min] [lang]"); process.exit(1); }

const CHUNK = Number(MINS) * 60;
const TMP = fs.mkdtempSync(path.join(process.env.ASR_TMP || os.tmpdir(), "asr_"));

// si viene un mp4 (o un wav pesado), primero a 16k mono
let wav = SRC;
if (!/\.wav$/i.test(SRC)) {
  wav = path.join(TMP, "in16k.wav");
  console.log("extrayendo audio a 16k mono ...");
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", SRC, "-vn", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", wav]);
}

const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav], { encoding: "utf8" }).trim());
const n = Math.ceil(dur / CHUNK);
console.log(`audio ${dur.toFixed(1)}s · ${n} trozos de ${CHUNK}s · modelo whisper-1 (el unico con word timestamps)`);

const palabras = [];
let texto = "";
for (let i = 0; i < n; i++) {
  const t0 = i * CHUNK;
  const mp3 = path.join(TMP, `c${String(i).padStart(2, "0")}.mp3`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(t0), "-t", String(CHUNK), "-i", wav, "-c:a", "libmp3lame", "-b:a", "64k", mp3]);
  const mb = fs.statSync(mp3).size / 1048576;
  if (mb > 24) { console.error(`⛔ trozo ${i} pesa ${mb.toFixed(1)} MB (>25): baja los minutos por trozo`); process.exit(2); }

  const fd = new FormData();
  fd.append("file", new Blob([fs.readFileSync(mp3)]), "a.mp3");
  fd.append("model", "whisper-1");
  fd.append("language", LANG);
  fd.append("response_format", "verbose_json");
  fd.append("timestamp_granularities[]", "word");
  process.stdout.write(`  trozo ${i + 1}/${n} (${mb.toFixed(1)} MB, t0=${t0}s) ... `);
  let d, intento = 0;
  while (true) {
    const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST", headers: { Authorization: "Bearer " + KEY }, body: fd,
      signal: AbortSignal.timeout(600000),
    }).catch((e) => ({ ok: false, status: 0, _e: e.message }));
    if (r.ok) { d = await r.json(); break; }
    if (++intento >= 3) { console.log(`HTTP ${r.status || "?"} tras 3 intentos`); process.exit(2); }
    await new Promise((s) => setTimeout(s, 5000 * intento));
  }
  const ws = d.words || [];
  for (const w of ws) palabras.push({ w: w.word, t: +(w.start + t0).toFixed(3), e: +(w.end + t0).toFixed(3) });
  texto += (texto ? " " : "") + (d.text || "").trim();
  console.log(`${ws.length} palabras`);
}

// ⛔ toda compuerta imprime CUANTO midio: una que puede dar 0 sin mirar no es una compuerta
console.log(`\npalabras totales: ${palabras.length}`);
if (!palabras.length) { console.error("⛔ 0 palabras: el ASR no devolvio timestamps"); process.exit(1); }
const fuera = palabras.slice(1).filter((p, i) => p.t < palabras[i].t).length;
const cob = 100 * (palabras.at(-1).e - palabras[0].t) / dur;
console.log(`fuera de orden: ${fuera} (deberia ser 0) · cobertura ${cob.toFixed(1)}% (${palabras[0].t.toFixed(1)}s -> ${palabras.at(-1).e.toFixed(1)}s de ${dur.toFixed(1)}s)`);
fs.writeFileSync(OUT, JSON.stringify({ dur, words: palabras, text: texto }, null, 1));
console.log(`escrito: ${OUT}`);
try { fs.rmSync(TMP, { recursive: true, force: true }); } catch {}
if (fuera > 0 || cob < 90) { console.error("⛔ transcripcion sospechosa"); process.exit(1); }
