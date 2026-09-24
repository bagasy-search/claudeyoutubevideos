// transcribe_cuda.mjs — transcripción en GPU (whisper.cpp CUDA), GRATIS y rápida.
// Reemplaza a los transcribe_<slug>.mjs de CPU (que usaban @remotion/install-whisper-cpp
// en 4 hilos, lentísimo). Acá usa el build cuBLAS 12.4 en whisper_cuda/Release/ sobre
// la RTX 3060 → ~25 min de audio en ~2 min. Salida en el MISMO formato captions que
// toCaptions ({text,startMs,endMs,timestampMs,confidence}).
//
// Uso:  node transcribe_cuda.mjs <slug>
//   espera  public/<slug>_16k.wav  (o public/<slug>.wav)  ·  modelo whisper.cpp/ggml-medium.en.bin
//   escribe public/captions_<slug>.json + transcript_<slug>.txt + transcript_<slug>_timed.txt
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const slug = process.argv[2];
if (!slug) {
  console.error("Uso: node transcribe_cuda.mjs <slug>");
  process.exit(1);
}
const root = process.cwd();
const exe = path.join(root, "whisper_cuda", "Release", "whisper-cli.exe");
// Idioma por env (default español para los videos del usuario). El modelo .en SOLO
// sirve para inglés; para español/multilingüe hay que usar ggml-medium.bin.
const LANG = process.env.WHISPER_LANG || "es";
const model = path.join(
  root,
  "whisper.cpp",
  LANG === "en" ? "ggml-medium.en.bin" : "ggml-medium.bin",
);
let wav = path.join(root, "public", `${slug}_16k.wav`);
if (!fs.existsSync(wav)) wav = path.join(root, "public", `${slug}.wav`);
for (const [label, p] of [["exe", exe], ["model", model], ["wav", wav]]) {
  if (!fs.existsSync(p)) {
    console.error(`No existe ${label}: ${p}`);
    process.exit(1);
  }
}

const tmpBase = path.join(root, "whisper_cuda", `out_${slug}`);
console.log(`Transcribiendo ${slug} en GPU (CUDA)…`);
const t0 = Date.now();
// -ml 1 -sow = un segmento por palabra (timestamps por palabra); -oj = JSON; -of = base salida
execFileSync(
  exe,
  ["-m", model, "-f", wav, "-t", "8", "-ml", "1", "-sow", "-oj", "-of", tmpBase, "-l", LANG],
  { stdio: ["ignore", "inherit", "inherit"] },
);
const secs = ((Date.now() - t0) / 1000).toFixed(1);

const raw = JSON.parse(fs.readFileSync(`${tmpBase}.json`, "utf8"));
const captions = (raw.transcription || [])
  .filter((s) => s.text !== "")
  .map((s) => {
    const startMs = s.offsets.from;
    const endMs = s.offsets.to;
    return { text: s.text, startMs, endMs, timestampMs: endMs, confidence: 1 };
  });

fs.writeFileSync(
  path.join(root, "public", `captions_${slug}.json`),
  JSON.stringify(captions, null, 2),
);
const plain = captions.map((c) => c.text).join("");
fs.writeFileSync(path.join(root, `transcript_${slug}.txt`), plain.trim());
const fmt = (ms) => {
  const s = ms / 1000;
  const m = Math.floor(s / 60);
  const r = (s - m * 60).toFixed(2).padStart(5, "0");
  return `${String(m).padStart(2, "0")}:${r}`;
};
fs.writeFileSync(
  path.join(root, `transcript_${slug}_timed.txt`),
  captions.map((c) => `[${fmt(c.startMs)}] ${c.text}`).join("\n"),
);
fs.rmSync(`${tmpBase}.json`, { force: true });

console.log(`\n=== DONE en ${secs}s · ${captions.length} palabras · captions_${slug}.json ===`);
