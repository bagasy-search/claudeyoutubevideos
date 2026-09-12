// rkalarm_asr.mjs — transcripcion con timestamps POR PALABRA del master del avatar.
//
// whisper-1 topea en 25 MB, y 27 min de audio no entran: se parte en trozos y se reponen los
// offsets. Los cortes caen en cualquier lado, pero eso NO importa: el anclaje posterior NO busca
// frases en el ASR, hace una alineacion GLOBAL guion<->ASR con difflib, que absorbe unas pocas
// palabras rotas en los bordes.
//
//   node scripts/rkalarm_asr.mjs <wav16k> <outJson> [minutosPorTrozo]
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import "dotenv/config";

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error("falta OPENAI_API_KEY"); process.exit(1); }
const [WAV, OUT, MINS = "5"] = process.argv.slice(2);
const CHUNK = Number(MINS) * 60;
const TMP = "D:/rkalarm/audio/_asr";
fs.mkdirSync(TMP, { recursive: true });

const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", WAV], { encoding: "utf8" }).trim());
const n = Math.ceil(dur / CHUNK);
console.log(`audio ${dur.toFixed(1)}s · ${n} trozos de ${CHUNK}s`);

const palabras = [];
let textoTotal = "";
for (let i = 0; i < n; i++) {
  const t0 = i * CHUNK;
  const mp3 = path.join(TMP, `c${String(i).padStart(2, "0")}.mp3`);
  if (!fs.existsSync(mp3)) {
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(t0), "-t", String(CHUNK), "-i", WAV,
      "-c:a", "libmp3lame", "-b:a", "64k", mp3]);
  }
  const mb = fs.statSync(mp3).size / 1048576;
  const fd = new FormData();
  fd.append("file", new Blob([fs.readFileSync(mp3)]), "a.mp3");
  fd.append("model", "whisper-1");
  fd.append("language", "en");
  fd.append("response_format", "verbose_json");
  fd.append("timestamp_granularities[]", "word");
  process.stdout.write(`  trozo ${i + 1}/${n} (${mb.toFixed(1)} MB, t0=${t0}s) ... `);
  const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST", headers: { Authorization: "Bearer " + KEY }, body: fd,
    signal: AbortSignal.timeout(600000),
  });
  const d = await r.json();
  if (!r.ok) { console.log(`HTTP ${r.status}`, JSON.stringify(d).slice(0, 300)); process.exit(2); }
  const ws = d.words || [];
  for (const w of ws) palabras.push({ w: w.word, t: +(w.start + t0).toFixed(3), e: +(w.end + t0).toFixed(3) });
  textoTotal += (textoTotal ? " " : "") + (d.text || "").trim();
  console.log(`${ws.length} palabras`);
}

// ⛔ una compuerta que puede dar 0 sin mirar tiene que decir CUANTO midio
console.log(`\npalabras totales: ${palabras.length}`);
if (!palabras.length) { console.error("⛔ 0 palabras: el ASR no devolvio timestamps"); process.exit(1); }
const huecos = palabras.slice(1).filter((p, i) => p.t < palabras[i].t).length;
console.log(`palabras fuera de orden (deberia ser 0): ${huecos}`);
console.log(`cobertura: ${palabras[0].t.toFixed(1)}s -> ${palabras[palabras.length - 1].e.toFixed(1)}s de ${dur.toFixed(1)}s`);
fs.writeFileSync(OUT, JSON.stringify({ dur, words: palabras, text: textoTotal }, null, 1));
console.log(`escrito: ${OUT}`);
