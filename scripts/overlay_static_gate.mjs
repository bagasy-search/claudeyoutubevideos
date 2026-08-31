// overlay_static_gate.mjs — COMPUERTA: PLACA PEGADA (overlay de pantalla completa que no se va).
//
// Por que existe: en `fedrodillas` el endcard se anclaba al ULTIMO beat `nametag`, y el unico
// nametag del video era la ficha de un personaje a los 1:44. La placa "Suscribite" —que es
// PANTALLA COMPLETA— quedo pegada encima del video desde 1:44 hasta el final: 44 min de 46.
// Ninguna compuerta lo vio: no es un prop invalido, ni un chunk muerto, ni un frame negro.
// El video renderizo "bien" y se entrego tapado.
//
// Como lo mide (sin modelo, deterministico): una placa fija ocupa el CENTRO del cuadro y no
// cambia con el b-roll. Se muestrean N cuadros a lo largo del video, se recorta el centro,
// se calcula el cuadro MEDIANA y se mide cuantas muestras son casi identicas a esa mediana.
// Video sano: el centro cambia todo el tiempo -> pocas muestras pegadas a la mediana.
// Video tapado: el centro es la misma placa -> casi todas pegadas.
//
//   node scripts/overlay_static_gate.mjs <video.mp4> [--samples 48] [--max-pct 35]
//   exit 1 = hay una placa pegada, NO entregues
import { execFileSync } from "child_process";

const V = process.argv[2];
if (!V) { console.error("uso: node scripts/overlay_static_gate.mjs <video.mp4> [--samples N] [--max-pct P]"); process.exit(1); }
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const N = arg("--samples", 48);
const MAXPCT = arg("--max-pct", 35);   // % de muestras casi-identicas al centro mediano
const NEAR = arg("--near", 6);         // MAD (0-255) por debajo de la cual dos centros son "el mismo"

const W = 64, H = 48, PX = W * H;
const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration",
  "-of", "default=nw=1:nk=1", V]).toString().trim());
if (!isFinite(dur) || dur <= 0) { console.error("no pude leer la duracion"); process.exit(1); }

// centro del cuadro: donde vive una placa (50% ancho x 46% alto, centrada)
const CROP = `crop=iw*0.5:ih*0.46:iw*0.25:ih*0.27,scale=${W}:${H},format=gray`;
const grab = (t) => execFileSync("ffmpeg", ["-nostdin", "-v", "error", "-ss", String(t), "-i", V,
  "-frames:v", "1", "-vf", CROP, "-f", "rawvideo", "-"], { maxBuffer: 1 << 22 });

const ts = [], samples = [];
for (let i = 0; i < N; i++) {
  const t = (dur * (i + 0.5)) / N;
  let b; try { b = grab(t); } catch { continue; }
  if (b.length < PX) continue;
  ts.push(t); samples.push(b);
}
if (samples.length < 8) { console.error("muy pocas muestras utiles"); process.exit(1); }

// cuadro mediana pixel a pixel
const med = Buffer.alloc(PX);
const col = new Uint8Array(samples.length);
for (let p = 0; p < PX; p++) {
  for (let s = 0; s < samples.length; s++) col[s] = samples[s][p];
  const sorted = Array.from(col).sort((a, b) => a - b);
  med[p] = sorted[sorted.length >> 1];
}
const mad = (a, b) => { let s = 0; for (let p = 0; p < PX; p++) s += Math.abs(a[p] - b[p]); return s / PX; };

const d = samples.map((s) => mad(s, med));
const stuck = d.map((v, i) => ({ t: ts[i], v })).filter((x) => x.v < NEAR);
const pct = (stuck.length / samples.length) * 100;
const f = (t) => `${Math.floor(t / 60)}:${String(Math.round(t % 60)).padStart(2, "0")}`;

console.log(`video ${f(dur)} · ${samples.length} muestras · centro 50%x46%`);
console.log(`muestras casi-identicas al centro mediano: ${stuck.length}/${samples.length} = ${pct.toFixed(1)}%  (umbral ${MAXPCT}%)`);
if (stuck.length) {
  const a = stuck[0].t, b = stuck[stuck.length - 1].t;
  console.log(`  tramo pegado: ${f(a)} -> ${f(b)}  (${((b - a) / dur * 100).toFixed(0)}% del video)`);
  console.log(`  MAD mediana de las pegadas: ${(stuck.reduce((s, x) => s + x.v, 0) / stuck.length).toFixed(2)}`);
}
if (pct > MAXPCT) {
  console.error(`\n❌ PLACA PEGADA: el centro del cuadro no cambia en ${pct.toFixed(0)}% del video.`);
  console.error(`   Casi seguro un overlay de pantalla completa (endcard/CTA/scrim) con la ventana mal anclada.`);
  process.exit(1);
}
console.log("\n✓ sin placa pegada");
