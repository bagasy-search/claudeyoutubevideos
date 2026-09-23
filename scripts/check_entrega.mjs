// scripts/check_entrega.mjs <mp4 | url>  —  COMPUERTA DE ENTREGA. exit 1 = NO se entrega.
//
// ⛔ El MP4 que sale del farm NUNCA se entrega crudo. Trae `yuvj420p` + rango `pc` + matriz
// `bt470bg` (PAL, en un 1080p) y keyframes de hasta 8 s. El creador lo reporta como "se ve
// lageado" y "le pusiste un filtro de brillo", y el archivo mide perfecto en cuadros decodificados
// — el defecto NO está ahí. Medido: el 13,7 % de la imagen cae por debajo de 16 (las sombras);
// con los datos en rango completo pero etiquetados `tv`, el reproductor los aplasta a negro plano.
//
// ⛔ Y NO ALCANZA CON PONER LAS ETIQUETAS: hay que CONVERTIR. La receta que pasa esta compuerta:
//   ffmpeg -y -i <farm>.mp4 -i public/<slug>.wav -map 0:v -map 1:a \
//     -vf "scale=in_range=full:out_range=limited:in_color_matrix=bt470bg:out_color_matrix=bt709,format=yuv420p" \
//     -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
//     -c:v libx264 -preset faster -crf 20 -maxrate 5M -bufsize 10M \
//     -g 60 -keyint_min 60 -sc_threshold 0 -threads 6 \
//     -af "pan=stereo|c0=c0|c1=c0" -c:a aac -b:a 192k -ar 48000 -movflags +faststart <entrega>.mp4
//   ⚠️ `-ac 2` NO: si el máster es MONO (los nuestros lo son) el upmix deja el audio 3 dB abajo.
//      Va el `pan`, que duplica el canal a nivel completo.
import { execFileSync } from "node:child_process";

const src = process.argv[2];
if (!src) { console.error("uso: node scripts/check_entrega.mjs <mp4 | url>"); process.exit(1); }
// El retorno de carro se quita SIEMPRE: en Windows ffprobe lo deja pegado al valor y toda
// comparacion por igualdad falla en silencio -> la compuerta rechaza un archivo correcto.
const probe = (args) => execFileSync("ffprobe", ["-v", "error", ...args, src], { encoding: "utf8" }).split(String.fromCharCode(13)).join("").trim();

const v = Object.fromEntries(probe(["-select_streams", "v:0", "-show_entries",
  "stream=pix_fmt,color_range,color_space,width,height,duration,has_b_frames", "-of", "default=nw=1"])
  .split("\n").map((l) => l.split("=")));
const a = Object.fromEntries(probe(["-select_streams", "a:0", "-show_entries",
  "stream=codec_name,channels,duration", "-of", "default=nw=1"])
  .split("\n").filter(Boolean).map((l) => l.split("=")));

const fallos = [];
const ok = [];
const exigir = (cond, bien, mal) => (cond ? ok.push(bien) : fallos.push(mal));

exigir(v.pix_fmt === "yuv420p", `pix_fmt ${v.pix_fmt}`, `pix_fmt=${v.pix_fmt} (crudo del farm: falta el re-encode)`);
exigir(v.color_range === "tv", `rango ${v.color_range}`, `color_range=${v.color_range} — el reproductor va a aplastar los negros`);
exigir(v.color_space !== "bt470bg", `matriz ${v.color_space}`, `color_space=bt470bg (matriz PAL en un ${v.width}x${v.height})`);
exigir(!!a.codec_name, `audio ${a.codec_name} ${a.channels}ch`, "NO HAY PISTA DE AUDIO");

// duración: el audio no puede sobrar ni faltar más de 0,7 s (el farm lo estira ~60 ms por chunk)
if (a.duration && v.duration) {
  const d = Math.abs(Number(a.duration) - Number(v.duration));
  exigir(d < 0.7, `audio y video a ${d.toFixed(2)}s`,
    `audio y video difieren ${d.toFixed(2)}s — el audio tiene que salir del WAV MÁSTER, no del concat`);
}

// keyframes: con GOPs largos el navegador tironea cada vez que se queda sin buffer
const kf = probe(["-select_streams", "v:0", "-skip_frame", "nokey", "-show_entries", "frame=pts_time",
  "-read_intervals", "%+120", "-of", "csv=p=0"]).split("\n").map(Number).filter((x) => !isNaN(x));
if (kf.length > 2) {
  const gap = Math.max(...kf.slice(1).map((x, i) => x - kf[i]));
  exigir(gap <= 3.0, `keyframes cada ${gap.toFixed(1)}s`, `keyframes cada ${gap.toFixed(1)}s (máximo 3 s: con GOPs largos el buffer no recupera)`);
}

// ⛔⛔ LA COMPUERTA QUE ME FALTABA: si el stream tiene B-frames, el contenedor TIENE que declarar
// pts != dts. Los B-frames se decodifican en un orden y se MUESTRAN en otro; si el mp4 dice
// pts == dts en todos los cuadros, le esta pidiendo al reproductor que los muestre en orden de
// DECODIFICACION, que es el orden equivocado.
// Lo rompi yo con una pasada "para regenerar timestamps": extraer el video a Annex-B crudo pierde
// los tiempos, y al remuxear con -r 30 ffmpeg los reinventa en fila -> pts == dts.
// Los reproductores de escritorio lo corrigen solos (reordenan por POC) y se ve bien; CHROME
// obedece al contenedor y muestra los cuadros desordenados. Se lee como tiron SOLO donde hay
// movimiento continuo (el avatar); sobre fotos casi fijas es invisible.
// ⚠️ NO alcanza con medir que los timestamps sean PAREJOS — los mios lo eran. Hay que medir que
// esten BIEN. Mi compuerta anterior daba verde con el archivo roto.
const nb = Number(v.has_b_frames || 0);
if (nb > 0) {
  const pd = probe(["-select_streams", "v:0", "-show_entries", "packet=pts_time,dts_time",
                    "-read_intervals", "%+3", "-of", "csv=p=0"])
    .split(String.fromCharCode(10)).filter((l) => l.includes(",")).map((l) => l.split(","));
  const reordena = pd.some(([p2, d2]) => Math.abs(Number(p2) - Number(d2)) > 1e-4);
  exigir(reordena, `reordenamiento de B-frames declarado (${nb})`,
    `el stream tiene ${nb} B-frames pero pts == dts en todos los cuadros — Chrome va a mostrarlos DESORDENADOS (tiron). No regenerar timestamps sobre un stream con B-frames.`);
}

for (const x of ok) console.log("   ✓", x);
for (const x of fallos) console.log("   ⛔", x);
if (fallos.length) {
  console.log(`\n⛔ NO ENTREGAR. ${fallos.length} problema(s). La receta está en la cabecera de este archivo.`);
  process.exit(1);
}
console.log(`\n✓ apto para entregar (${ok.length} chequeos)`);
