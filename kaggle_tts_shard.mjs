// kaggle_tts_shard.mjs — TTS voz clonada MÁS RÁPIDO: parte el guion en N shards y corre N
// kernels de Kaggle EN PARALELO (kernel-slug distinto por shard → no chocan). Cada shard hace
// su PROPIO Whisper word-level + forced alignment (transcripción EXACTA, no se sacrifica), y
// acá se mergean wav + captions + timing con OFFSET de tiempo. ~N× más rápido (techo real ~2×
// por el límite de GPU concurrentes de Kaggle free).
//
//   node kaggle_tts_shard.mjs --text guion.txt --slug artefactos [--shards 2] [--seed 1234] [--lang es]
//
// Salida idéntica a kaggle_tts.mjs: public/<slug>.wav + <slug>_timing.json + captions_<slug>.json
import fs from "fs";
import { spawn, execFileSync } from "child_process";

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) { const t = argv[i]; if (t.startsWith("--")) { const k = t.slice(2); const n = argv[i + 1]; if (n === undefined || n.startsWith("--")) a[k] = true; else { a[k] = n; i++; } } }
  return a;
}
const args = parseArgs(process.argv.slice(2));
const slug = args.slug, textArg = args.text;
if (!slug || !textArg) { console.error("Uso: node kaggle_tts_shard.mjs --text guion.txt --slug <slug> [--shards 2] [--seed 1234] [--lang es]"); process.exit(1); }
const N = Math.max(2, +(args.shards || 2));
const SEED = args.seed || "1234";
const LANG = args.lang || "es";
const FFPROBE = process.env.FFPROBE || "ffprobe";
const FFMPEG = process.env.FFMPEG || "ffmpeg";

// ── partir el guion en N tramos contiguos, cortando en LÍMITES DE PÁRRAFO (pausas naturales
//    del narrador → el empalme entre shards cae en un silencio, sin salto de prosodia) ──
const raw = fs.existsSync(textArg) ? fs.readFileSync(textArg, "utf8") : textArg;
const paras = raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const totalLen = paras.reduce((s, p) => s + p.length, 0);
const target = totalLen / N;
const parts = Array.from({ length: N }, () => []);
let pi = 0, acc = 0;
for (const p of paras) {
  parts[pi].push(p);
  acc += p.length;
  if (pi < N - 1 && acc >= target * (pi + 1)) pi++;
}
const partFiles = parts.map((ps, k) => {
  const f = `guion_${slug}_p${k}.txt`;
  fs.writeFileSync(f, ps.join("\n\n") + "\n");
  return f;
});
console.log(`shards=${N} · ${paras.length} párrafos → ${parts.map((p) => p.length).join("/")} párrafos por shard`);

// ── lanzar N kaggle_tts.mjs EN PARALELO (kernel-slug propio por shard) ──
function runShard(k) {
  return new Promise((resolve) => {
    const sub = `${slug}_p${k}`;
    const a = ["kaggle_tts.mjs", "--text", partFiles[k], "--slug", sub,
      "--kernel-slug", `reppo-tts-s${k}`, "--seed", SEED, "--lang", LANG];
    console.log(`  ▶ shard ${k}: kernel reppo-tts-s${k} · slug ${sub}`);
    const p = spawn("node", a, { stdio: ["ignore", "pipe", "pipe"] });
    let tail = "";
    const cap = (d) => { tail = (tail + d).slice(-2000); };
    p.stdout.on("data", cap); p.stderr.on("data", cap);
    p.on("close", (code) => {
      const wav = `public/${sub}.wav`;
      const ok = code === 0 && fs.existsSync(wav);
      console.log(`  ${ok ? "✓" : "✗"} shard ${k} (code ${code})${ok ? "" : " — tail:\n" + tail.slice(-400)}`);
      resolve({ k, ok, sub });
    });
  });
}

const res = await Promise.all(Array.from({ length: N }, (_, k) => runShard(k)));
const bad = res.filter((r) => !r.ok);
if (bad.length) { console.error(`✗ ${bad.length} shard(s) fallaron → aborto el merge. Reintentá esos.`); process.exit(1); }

// ── merge: concat wav + offset de captions/timing por la duración REAL de cada wav previo ──
const wavDurMs = (f) => Math.round(parseFloat(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }).trim()) * 1000);

let offMs = 0;
const capsAll = [], timeAll = [];
const listFile = `_ttscat_${slug}.txt`;
const wavList = [];
for (let k = 0; k < N; k++) {
  const sub = `${slug}_p${k}`;
  const wav = `public/${sub}.wav`;
  wavList.push(`file '${process.cwd()}/${wav}'`);
  const caps = JSON.parse(fs.readFileSync(`public/captions_${sub}.json`, "utf8"));
  for (const c of caps) capsAll.push({ ...c, startMs: (c.startMs || 0) + offMs, endMs: (c.endMs || 0) + offMs, timestampMs: (c.timestampMs || c.endMs || 0) + offMs });
  const tm = JSON.parse(fs.readFileSync(`public/${sub}_timing.json`, "utf8"));
  const offSec = offMs / 1000;
  for (const t of tm) timeAll.push({ ...t, start: +(t.start + offSec).toFixed(3) });
  offMs += wavDurMs(wav);
}
// concat de audio sin recodificar (todos mismo codec/sr → -c copy)
fs.writeFileSync(listFile, wavList.join("\n") + "\n");
execFileSync(FFMPEG, ["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", `public/${slug}.wav`], { stdio: "ignore" });
fs.writeFileSync(`public/captions_${slug}.json`, JSON.stringify(capsAll, null, 2));
fs.writeFileSync(`public/captions_${slug}_aligned.json`, JSON.stringify(capsAll, null, 2));
fs.writeFileSync(`public/${slug}_timing.json`, JSON.stringify(timeAll));

// limpieza de intermedios (dejo los part .txt por si querés revisar el split)
try { fs.rmSync(listFile); } catch {}
console.log(`\n✅ merge listo → public/${slug}.wav · ${capsAll.length} palabras · ${(offMs / 60000).toFixed(1)} min (transcripción exacta, offset por wav real)`);
