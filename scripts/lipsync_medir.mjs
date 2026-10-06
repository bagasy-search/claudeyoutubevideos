// lipsync_medir.mjs — ¿cuánto se adelantan los LABIOS respecto del audio? Medición objetiva.
//
//   node scripts/lipsync_medir.mjs <video.mp4> [audio.wav] [--roi 0.55]
//
// ⛔ POR QUÉ HACÍA FALTA: `avatar_sync_gate.mjs` compara la ENVOLVENTE DE DOS AUDIOS — prueba que el
//    avatar se lipsincó a ese wav, y da "correlación 1,00 · desfase 0 ms" aunque los labios estén
//    corridos medio segundo. Los labios no entran en esa cuenta. Este script mide la IMAGEN.
//
// Cómo: por cada cuadro, la energía de CAMBIO en la franja de la boca (diferencia absoluta contra el
// cuadro anterior, sólo en la banda vertical central-baja de la cara). Eso sube cuando la boca se
// abre/cierra. Se correlaciona con la energía del audio y se busca el desfase que maximiza.
//   El lag que maximiza compara boca[i+lag] con audio[i]:
//     lag < 0  →  la boca se mueve ANTES que el audio: LABIOS ADELANTADOS (retrasar el video |lag|)
//     lag > 0  →  la boca se mueve DESPUÉS: LABIOS ATRASADOS (adelantar el video lag)
//   ⛔ Este rótulo estuvo INVERTIDO en la primera versión y me hizo leer "0,10 atrasados" cuando eran
//      0,10 ADELANTADOS. Un instrumento con el signo al revés es peor que no tenerlo: se validó
//      corriendo el mismo reel con un retraso conocido de +0,25 s y comprobando que el número se
//      mueve en la dirección esperada (de -0,100 a +0,133).
import { execFileSync } from "node:child_process";
import fs from "node:fs";

// `--auto` barre bandas: la BOCA es la región que más se mueve al hablar, así que se elige la banda
// cuya señal de movimiento correlaciona MÁS con el audio, y se informa la correlación de cada una.
// Sin esto hay que adivinar dónde cae la boca y una banda mal elegida da un número inventado
// (medido: correlaciones de 0,04 con desfases que se contradicen entre sí).
const AUTO = process.argv.includes("--auto");
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const [VID, WAV0] = args;
const ROI = Number((process.argv.find((a) => a.startsWith("--roi=")) || "").split("=")[1] || 0.55);
if (!VID) { console.error("uso: node scripts/lipsync_medir.mjs <video.mp4> [audio.wav]"); process.exit(1); }
const FPS = 30, W = 64, H = 64;
const tmp = (n) => `${process.env.TEMP || "."}/_lip_${process.pid}_${n}`;

const medirBanda = (roi, px = 0.25) => {
const raw = tmp("v.gray");
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", VID,
  "-vf", `crop=iw*0.4:ih*0.16:iw*${px}:ih*${roi},scale=${W}:${H},format=gray,fps=${FPS}`,
  "-f", "rawvideo", raw]);
const buf = fs.readFileSync(raw); fs.rmSync(raw, { force: true });
const F = W * H, n = Math.floor(buf.length / F);
if (n < 30) { console.error(`⛔ NO MIDIÓ: sólo ${n} cuadros`); process.exit(2); }
const mov = new Float64Array(n);
for (let f = 1; f < n; f++) { let s = 0; for (let i = 0; i < F; i++) s += Math.abs(buf[f * F + i] - buf[(f - 1) * F + i]); mov[f] = s / F; }
return mov;
};

// 2. energía del audio a la misma tasa
const pcm = tmp("a.pcm");
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", WAV0 || VID, "-ac", "1", "-ar", String(FPS * 160), "-f", "s16le", pcm]);
const a = fs.readFileSync(pcm); fs.rmSync(pcm, { force: true });
const m = Math.floor(a.length / 2 / 160);
const ene = new Float64Array(m);
for (let f = 0; f < m; f++) { let s = 0; for (let i = 0; i < 160; i++) { const v = a.readInt16LE((f * 160 + i) * 2) / 32768; s += v * v; } ene[f] = Math.sqrt(s / 160); }

// 3. correlación cruzada, normalizada, sobre las señales centradas
const norm = (x, len) => { let mu = 0; for (let i = 0; i < len; i++) mu += x[i]; mu /= len; const y = new Float64Array(len); let sd = 0; for (let i = 0; i < len; i++) { y[i] = x[i] - mu; sd += y[i] * y[i]; } sd = Math.sqrt(sd) || 1; for (let i = 0; i < len; i++) y[i] /= sd; return y; };
const correr = (mov, n) => {
const L = Math.min(n, m), A = norm(mov, L), B = norm(ene, L);
const MAX = Math.round(0.8 * FPS);
let mejor = { lag: 0, r: -2 };
for (let lag = -MAX; lag <= MAX; lag++) {
  let s = 0, c = 0;
  for (let i = 0; i < L; i++) { const j = i + lag; if (j < 0 || j >= L) continue; s += A[j] * B[i]; c++; }
  if (c < L * 0.5) continue;
  const r = s * (L / c);
  if (r > mejor.r) mejor = { lag, r };
}
return { ...mejor, L };
};
// GRILLA: la boca puede estar en cualquier parte del cuadro (el avatar a pantalla completa no está
// centrado como en el reel). Se barre en X y en Y y gana la celda que más correlaciona con el audio.
const ys = AUTO ? [0.28, 0.36, 0.44, 0.52, 0.60, 0.68] : [ROI];
const xs = AUTO ? [0.10, 0.30, 0.50] : [0.25];
let top = { r: -2 };
for (const y of ys) for (const x of xs) {
  const mv = medirBanda(y, x); const n2 = mv.length;
  const res = correr(mv, n2);
  if (AUTO && res.r > 0.12) console.log(`  celda x${x} y${y.toFixed(2)} → r ${res.r.toFixed(3)} · lag ${(res.lag / FPS).toFixed(3)} s`);
  if (res.r > top.r) top = { ...res, banda: `x${x} y${y}` };
}
const mejor = top, L = top.L;
const seg = (mejor.lag / FPS);
console.log(`cuadros medidos: ${L} (${(L / FPS).toFixed(1)} s) · banda ${mejor.banda} · correlación máx ${mejor.r.toFixed(3)}`);
if (mejor.r < 0.15) console.log("⚠️ correlación DEMASIADO BAJA: el número de abajo no es confiable, no decidas con él");
console.log(`DESFASE DE LABIOS: ${seg >= 0 ? "+" : ""}${seg.toFixed(3)} s  (${mejor.lag} cuadros)`);
console.log(seg < -0.02 ? `→ LABIOS ADELANTADOS ${(-seg).toFixed(3)} s: hay que RETRASAR el video (lipLeadSec = ${(-seg).toFixed(3)})`
  : seg > 0.02 ? `→ LABIOS ATRASADOS ${seg.toFixed(3)} s: hay que ADELANTAR el video (lipLeadSec = ${(-seg).toFixed(3)})`
  : "→ EN SINCRO (|desfase| ≤ 1 cuadro)");
