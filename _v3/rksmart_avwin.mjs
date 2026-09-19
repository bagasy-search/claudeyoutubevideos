// rksmart_avwin.mjs — VENTANAS DE AVATAR: funde los momentos `av` del DIRECTOR en ventanas,
// corta su audio del máster y arma el REEL que va en UN solo /run de RunPod.
//   node _v3/rksmart_avwin.mjs
// ⛔ REGLA 1.bis: el video ABRE con el avatar hablando, piso de 3 s. La primera ventana arranca en 0.
// ⛔ CAP MEDIDO DE RUNPOD ~595 s de video por job: si el reel se pasa, el 2º /run va SÓLO con la cola
//    cortada en un BORDE DE VENTANA. Acá se imprime el largo del reel para saberlo ANTES de pagar.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { ITEMS } from "./rksmart_prompts.mjs";

const TOTAL = 1588.824;
const PAD = 0.35, FUSION = 0.7, APERTURA = 3.0;
const mom = JSON.parse(fs.readFileSync("_v3/rksmart_mom.json", "utf8"));
const av = ITEMS.filter((i) => i.k === "av").map((i) => i.m).sort((a, b) => a - b);

const W = [];
for (const k of av) {
  const m = mom[k];
  const a = Math.max(0, m.t - PAD), z = Math.min(TOTAL, m.t + m.dur + PAD);
  if (W.length && a <= W.at(-1).end + FUSION) { W.at(-1).end = Math.max(W.at(-1).end, z); W.at(-1).n.push(k); }
  else W.push({ start: a, end: z, n: [k] });
}
if (W[0].n[0] === 0) { W[0].start = 0; W[0].end = Math.max(W[0].end, APERTURA); }

fs.mkdirSync("_v3/rksmart/av", { recursive: true });
const lst = [];
let off = 0;
for (let k = 0; k < W.length; k++) {
  const w = W[k];
  const f = `_v3/rksmart/av/w${String(k).padStart(3, "0")}.wav`;
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", w.start.toFixed(3), "-t", (w.end - w.start).toFixed(3),
    "-i", "public/rksmart.wav", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", f]);
  const real = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
    { encoding: "utf8" }).match(/[\d.]+/)[0];
  w.k = k; w.start = +w.start.toFixed(3); w.end = +(w.start + real).toFixed(3);
  w.reel_off = +off.toFixed(3); off += real;
  lst.push(`file '${process.cwd().replace(/\\/g, "/")}/${f}'`);
}
fs.writeFileSync("_v3/rksmart/av/cat.txt", lst.join("\n"));
execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "_v3/rksmart/av/cat.txt",
  "-c:a", "pcm_s16le", "_v3/rksmart/av/reel.wav"]);
const reelSec = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
  "_v3/rksmart/av/reel.wav"], { encoding: "utf8" }).match(/[\d.]+/)[0];

fs.writeFileSync("_v3/rksmart_windows.json", JSON.stringify(W, null, 1));
const solapa = W.some((w, i) => i && w.start < W[i - 1].end);
console.log("═".repeat(70));
console.log(`MEDIDO: momentos de avatar ${av.length} → VENTANAS ${W.length}`);
console.log(`  visibles ${reelSec.toFixed(1)} s de ${TOTAL.toFixed(1)} s = ${(100 * reelSec / TOTAL).toFixed(1)} %`);
console.log(`  ventana más corta ${Math.min(...W.map((w) => w.end - w.start)).toFixed(2)} s · más larga ${Math.max(...W.map((w) => w.end - w.start)).toFixed(2)} s`);
console.log(`  apertura: la ventana 0 arranca en ${W[0].start} y dura ${(W[0].end - W[0].start).toFixed(2)} s (piso ${APERTURA}) ${W[0].start === 0 && W[0].end - W[0].start >= APERTURA ? "✓" : "⛔"}`);
console.log(`  solapes entre ventanas: ${solapa ? "⛔ SÍ" : "no ✓"}`);
console.log(`  REEL ${reelSec.toFixed(1)} s → ${reelSec <= 595 ? "UN job de RunPod ($0,25) ✓" : "⛔ pasa el cap ~595 s: habrá 2º /run con la cola"}`);
console.log("═".repeat(70));
if (W.length < 5) { console.error("⛔ medí muy pocas ventanas"); process.exit(2); }
if (solapa) process.exit(3);
