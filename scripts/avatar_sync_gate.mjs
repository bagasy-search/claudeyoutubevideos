// avatar_sync_gate.mjs — COMPUERTA DE SINCRO DEL AVATAR. Correr ANTES de montar nada.
//   node scripts/avatar_sync_gate.mjs <avatar.mp4> <master.wav>
//
// Por que existe (medido en grcoffee, 2026-08-23): se asumio que el audio del avatar ERA el
// master de Fish y se monto el video entero encima. No lo era: el generador **volvio a
// sintetizar la voz** un 23% mas lenta (150 wpm contra 177). Mismas palabras, otro timing:
// calzaba solo en el segundo 0 y a los 30s ya iba 2.4s corrido; al final del tramo, 61s.
// Se descubrio con el video ya entregado. Este chequeo tarda ~2 minutos.
//
// Que hace: compara la ENVOLVENTE de energia de los dos audios por correlacion cruzada.
//   correlacion alta con desfase ~0  -> el avatar SI fue lipsyncado a ese wav
//   correlacion baja                 -> es OTRO audio (re-sintetizado, re-timed u otra toma)
//
// Si da bajo: pedir el avatar de nuevo en modo AUDIO-DRIVEN (lipsync sobre el wav), no en
// modo texto->avatar. Montar igual garantiza un video fuera de sincro de punta a punta.
//
// ⚠️ NO CONFUNDIR CON EL 0.2% DEL FARM (medido en grcoffee, y lo tienen TODOS los videos).
// El mp4 que sale del farm dura ~0.195% mas que la composicion (60 chunks x ~57 ms de padding
// de prime del encoder AAC). Si corres este gate sobre el MP4 FINAL contra el wav fuente vas a
// ver una deriva que crece lineal (+0.05s a los 5s, +3.0s a los 25 min) y vas a pensar que el
// lipsync se rompio. NO se rompio: se estiran los DOS streams casi igual
//   video 0.1937%  ·  audio 0.1963%  ->  desfase A/V REAL = 9 ms en 331 s
// y 9 ms esta muy por debajo del umbral perceptible (~40 ms). Lo unico que pasa es que el video
// corre 0.2% mas lento de lo nominal.
// REGLA: este gate se corre sobre el AVATAR CRUDO vs el WAV, ANTES de montar. Sobre el mp4 final
// no sirve — ahi el estiramiento del farm enmascara la medicion.
import { execFileSync } from "node:child_process";
import { readFileSync, unlinkSync } from "node:fs";

const [AV, WAV] = process.argv.slice(2);
if (!AV || !WAV) { console.error("uso: node scripts/avatar_sync_gate.mjs <avatar.mp4> <master.wav>"); process.exit(1); }
const FF = process.env.FFMPEG || "ffmpeg";
const SECS = +(process.env.SYNC_SECS || 120);

const pcm = (src, out) => {
  execFileSync(FF, ["-y", "-v", "error", "-i", src, "-vn", "-ac", "1", "-ar", "16000",
                    "-t", String(SECS), "-c:a", "pcm_s16le", out]);
  const b = readFileSync(out);
  const n = (b.length - 44) >> 1;
  const d = new Float32Array(n);
  for (let i = 0; i < n; i++) d[i] = b.readInt16LE(44 + i * 2);
  return d;
};
const env = (d, win = 160) => {            // RMS cada 10 ms
  const m = Math.floor(d.length / win), o = new Float32Array(m);
  for (let i = 0; i < m; i++) { let s = 0; for (let j = 0; j < win; j++) { const v = d[i*win+j]; s += v*v; } o[i] = Math.sqrt(s/win); }
  const mu = o.reduce((a,b)=>a+b,0)/m;
  const sd = Math.sqrt(o.reduce((a,b)=>a+(b-mu)**2,0)/m) || 1;
  for (let i = 0; i < m; i++) o[i] = (o[i]-mu)/sd;
  return o;
};
const a = env(pcm(AV, "_sync_a.wav")), b = env(pcm(WAV, "_sync_b.wav"));
const L = Math.min(a.length, b.length);
let best = -1e9, lag = 0;
for (let k = -500; k <= 500; k++) {         // +-5 s
  let s = 0, n = 0;
  for (let i = Math.max(0, -k); i < Math.min(L, L - k); i++) { s += a[i+k]*b[i]; n++; }
  if (n > 100) { const c = s/n; if (c > best) { best = c; lag = k; } }
}
for (const f of ["_sync_a.wav", "_sync_b.wav"]) { try { unlinkSync(f); } catch {} }

const MIN = +(process.env.SYNC_MIN || 0.35);
console.log(`── SINCRO AVATAR · primeros ${SECS}s`);
console.log(`   correlación máx: ${best.toFixed(3)}  ·  desfase: ${(lag/100).toFixed(2)}s`);
if (best >= MIN && Math.abs(lag) <= 15) {
  console.log(`✅ el avatar FUE lipsyncado a ese wav — se puede montar`);
  process.exit(0);
}
console.log(`\n⛔ El audio del avatar NO es ese wav (correlación < ${MIN}).`);
console.log(`   Casi siempre significa que se generó en modo TEXTO→avatar (vuelve a sintetizar la`);
console.log(`   voz, con otro ritmo) en vez de modo AUDIO→avatar (lipsync sobre el wav).`);
console.log(`   Montar igual = video fuera de sincro. Pedí el avatar de nuevo en modo audio-driven.`);
process.exit(1);
