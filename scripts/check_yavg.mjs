// check_yavg.mjs — COMPUERTA 8 de `narrator-video`: escaneo de LUMINANCIA frame a frame.
//
//   node scripts/check_yavg.mjs D:/videosdeclaude/<slug>.mp4
//
// ⛔⛔ `blackdetect=d=0.5` pide MEDIO SEGUNDO de negro, así que NO ve un frame negro suelto.
//    En `fedvet2` había ~180 destellos negros de 33 ms — uno en CADA corte de clip, por un
//    `enter(frame, 6)` en el componente `Clip` — y las 7 compuertas dieron VERDE, y el AUDITOR
//    de frames sueltos también (un frame al azar casi nunca cae justo en la costura).
//
// Cómo se lee la salida:
//   · tramos LARGOS de YAVG bajo  = componentes con scrim (por DISEÑO, no es falla)
//   · frames SUELTOS oscuros, repetidos decenas de veces = EL DEFECTO
//
// ⛔ Guarda anti-compuerta-muda: si midió menos de 1000 frames, FALLA (no puede pasar por verde).
import { spawn } from "node:child_process";

const MP4 = process.argv[2];
const UMBRAL = Number(process.argv[3] || 24);      // YAVG por debajo = "oscuro"
const MAX_SUELTOS = Number(process.argv[4] || 5);  // tolerancia de frames sueltos oscuros
if (!MP4) { console.error("uso: node scripts/check_yavg.mjs <mp4> [umbral=24] [max_sueltos=5]"); process.exit(2); }

const FF = process.env.HOME + "/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe";
const p = spawn(FF, ["-v", "info", "-i", MP4, "-an",
  "-vf", "scale=160:90,signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-f", "null", "-"]);

let buf = "";
const vals = [];
let pend = null;
const consumir = (chunk) => {
  buf += chunk;
  const lines = buf.split("\n");
  buf = lines.pop();
  for (const ln of lines) {
    const t = ln.match(/pts_time:([0-9.]+)/);
    if (t) { pend = parseFloat(t[1]); continue; }
    const y = ln.match(/lavfi\.signalstats\.YAVG=([0-9.]+)/);
    if (y && pend !== null) { vals.push([pend, parseFloat(y[1])]); pend = null; }
  }
};
p.stderr.on("data", (d) => consumir(String(d)));
p.stdout.on("data", (d) => consumir(String(d)));

p.on("close", () => {
  if (vals.length < 1000) {
    console.log(`⛔ COMPUERTA MUDA: sólo midió ${vals.length} frames. No puede pasar por verde.`);
    process.exit(1);
  }
  // agrupar los frames oscuros en tramos contiguos
  const tramos = [];
  let cur = null;
  for (let i = 0; i < vals.length; i++) {
    const oscuro = vals[i][1] < UMBRAL;
    if (oscuro) { if (!cur) cur = { ini: vals[i][0], n: 0, min: 999 }; cur.n++; cur.min = Math.min(cur.min, vals[i][1]); cur.fin = vals[i][0]; }
    else if (cur) { tramos.push(cur); cur = null; }
  }
  if (cur) tramos.push(cur);

  const sueltos = tramos.filter((t) => t.n <= 2);
  const largos = tramos.filter((t) => t.n > 2);
  const min = Math.min(...vals.map((v) => v[1]));
  console.log(`frames medidos ${vals.length} · YAVG mínimo ${min.toFixed(1)} · umbral ${UMBRAL}`);
  console.log(`tramos oscuros: ${tramos.length}  (largos >2 frames: ${largos.length} · SUELTOS <=2 frames: ${sueltos.length})`);
  for (const t of largos.slice(0, 8)) console.log(`   tramo largo t=${t.ini.toFixed(2)}s  ${t.n} frames  YAVG min ${t.min.toFixed(1)}  (probable componente con scrim)`);
  for (const t of sueltos.slice(0, 12)) console.log(`   ⚠ suelto t=${t.ini.toFixed(2)}s  ${t.n} frame(s)  YAVG ${t.min.toFixed(1)}`);
  if (sueltos.length > MAX_SUELTOS) {
    console.log(`⛔ ${sueltos.length} frames oscuros SUELTOS (> ${MAX_SUELTOS}). Es el destello por corte: revisá el fade de entrada del componente Clip.`);
    process.exit(1);
  }
  console.log("✓ sin destellos negros por corte");
});
