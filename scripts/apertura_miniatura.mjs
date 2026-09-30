// apertura_miniatura.mjs — arma la APERTURA del video: la MINIATURA del canal como primer fotograma,
// animada apenas con agnes, para que al hacer clic el espectador aterrice en la misma imagen que vio.
// (regla del creador, 20-sep-2026 · el corte glitch y el corrimiento de todo lo demás los hace
//  factory/lib/apertura.mjs en 60_build; esto sólo produce los dos assets)
//
//   node scripts/apertura_miniatura.mjs <slug> <miniatura.png|jpg> "<motion en 6-10 palabras>"
//
// Deja:  public/img/<slug>/<slug>_thumb.jpg      (la miniatura a 1920x1080, respaldo exacto)
//        public/broll/<slug>/<slug>_apertura.mp4 (2 s a 0,5x = 4,03 s a 30 CFR, por agnes)
//
// ⛔ COMPUERTA: el cuadro 0 del clip tiene que SER la miniatura. agnes redibuja ~14 % de lo que le dan;
//    si redibuja ésta, el truco no se lee y el script FALLA en vez de entregar un calce roto.
//    Se mide a 640x360 (no a 1920x1080): agnes genera en baja y sube, y a resolución completa una
//    apertura SANA da ~19,6 dB — el umbral alto marcaba "redibujo" cuando era pérdida de resolución.
//    Medido en tdcfreno: apertura sana = 20,1 dB a 640x360. Umbral 17.
//    `motion` va LO MÁS SIMPLE posible: pedirle movimiento continuo sube el defecto de 23 % a 36 %.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const [SLUG, SRC, MOTION] = process.argv.slice(2);
if (!SLUG || !SRC) { console.error('uso: node scripts/apertura_miniatura.mjs <slug> <miniatura.png> "<motion>"'); process.exit(1); }
if (!fs.existsSync(SRC)) { console.error(`no existe la miniatura ${SRC}`); process.exit(1); }
const motion = MOTION || "the scene stays still, only a slow drift";

const IMGDIR = path.join("public", "img", SLUG);
const OUTDIR = path.join("public", "broll", SLUG);
fs.mkdirSync(IMGDIR, { recursive: true });
fs.mkdirSync(OUTDIR, { recursive: true });
const NOMBRE = `${SLUG}_apertura`;
const JPG = path.join(IMGDIR, `${SLUG}_thumb.jpg`);
const MP4 = path.join(OUTDIR, `${NOMBRE}.mp4`);
const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8", maxBuffer: 1 << 26 });

// 1. la miniatura a 1920x1080 exactos (cover, sin barras): es el cuadro 0 de referencia
sh("ffmpeg", ["-v", "error", "-y", "-i", SRC, "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080", "-q:v", "2", JPG]);
// agnes lee <imgDir>/<nombre>.jpg
fs.copyFileSync(JPG, path.join(IMGDIR, `${NOMBRE}.jpg`));

// 2. animación con agnes por el camino ÚNICO (2 s a 0,5x, ralentí por defecto)
const lista = path.join(OUTDIR, "_apertura_lista.json");
fs.writeFileSync(lista, JSON.stringify([{ nombre: NOMBRE, motion, harden: true }], null, 2));
console.log(`agnes: ${NOMBRE} · motion="${motion}"`);
sh("node", ["scripts/agnes_i2v.mjs", lista, SLUG, IMGDIR, OUTDIR]);
if (!fs.existsSync(MP4)) { console.error(`⛔ agnes no dejó ${MP4}`); process.exit(1); }

// 3. COMPUERTA: el cuadro 0 del clip contra la miniatura (PSNR). Mide y dice cuánto midió.
const f0 = path.join(OUTDIR, "_apertura_f0.png");
sh("ffmpeg", ["-v", "error", "-y", "-i", MP4, "-frames:v", "1", "-vf", "scale=640:360", f0]);
const ref = path.join(OUTDIR, "_apertura_ref.png");
sh("ffmpeg", ["-v", "error", "-y", "-i", JPG, "-vf", "scale=640:360", ref]);
let psnr = NaN;
// ⛔ ffmpeg escribe el resumen de `psnr` por STDERR y execFileSync no lo devuelve cuando el comando
//    sale bien: leerlo de stdout daba "NO MIDIÓ" con el clip perfectamente generado. Va a ARCHIVO.
const stats = path.join(OUTDIR, "_apertura_psnr.txt");
sh("ffmpeg", ["-v", "error", "-y", "-i", f0, "-i", ref, "-lavfi", `psnr=stats_file=${stats.split(path.sep).join("/")}`, "-f", "null", "-"]);
try {
  const linea = fs.readFileSync(stats, "utf8").trim().split(/[\r\n]+/).pop() || "";
  psnr = Number((linea.match(/psnr_avg:([0-9.]+|inf)/) || [])[1] === "inf" ? 99 : (linea.match(/psnr_avg:([0-9.]+)/) || [])[1]);
} catch { psnr = NaN; }
const dur = Number(sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", MP4]).trim());
console.log(`GATE aperturaCalzaMiniatura: PSNR cuadro0 vs miniatura = ${Number.isFinite(psnr) ? psnr.toFixed(2) : "NO MIDIÓ"} dB · clip ${dur.toFixed(2)} s`);
if (!Number.isFinite(psnr)) { console.error("⛔ la compuerta NO MIDIÓ (psnr vacío) — no se entrega una apertura sin medir"); process.exit(2); }
if (psnr < 17) {
  console.error(`⛔ agnes REDIBUJÓ la miniatura (PSNR ${psnr.toFixed(2)} < 17 dB a 640x360): el primer cuadro no calza con lo que el espectador clickeó.`);
  console.error(`   Probá otra vez con un motion MÁS SIMPLE, o dejá la miniatura quieta: el build usa public/img/${SLUG}/${SLUG}_thumb.jpg como respaldo exacto.`);
  process.exit(2);
}
for (const f of [f0, ref, lista, stats]) { try { fs.unlinkSync(f); } catch {} }
console.log(`✅ apertura lista: ${MP4} + ${JPG}`);
