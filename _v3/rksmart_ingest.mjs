// rksmart_ingest.mjs — pasa el pool de gpt-image a `public/img/`: PNG → JPG (el tar baja ~94 %),
// hermano `_blur.jpg` para las camas de los componentes, y las compuertas de ASPECTO y LUMA.
//   node _v3/rksmart_ingest.mjs
//
// ⛔ El directorio de trabajo es PRIVADO (_v3/rksmart/img): `scripts/gptimg.mjs` guarda su estado
//    reanudable en `<outDir>/_gptimg_batches.json`, y con outDir=public/img ese archivo es
//    COMPARTIDO con las otras sesiones. Medido hoy: otra sesión canceló mis dos batches a mitad
//    (47/70 y 4/141) porque su estado y el mío vivían en el mismo archivo.
// ⛔ ASPECTO: el kit dibuja con objectFit:"cover" — una imagen fuera de 16:9 pierde el 22 % arriba
//    y abajo. 1088x608 = 1,789 contra 1,778: desvío 0,012, adentro de la tolerancia 0,06.
// ⛔ LUMA: la media MIENTE (un reescalado infla el valor). Se mide sobre el frame ENTERO y se
//    LISTAN las más oscuras para mirarlas, no se decide sólo con el número.
import fs from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";

const SRC = "_v3/rksmart/img", DST = "public/img";
const esperados = JSON.parse(fs.readFileSync("_v3/rksmart_imglist.json", "utf8")).map((i) => i.name);
fs.mkdirSync(DST, { recursive: true });

const hay = (n) => ["png", "jpg"].map((e) => `${SRC}/${n}.${e}`).find((p) => fs.existsSync(p));
const faltan = esperados.filter((n) => !hay(n));
console.log(`MEDIDO: esperadas ${esperados.length} · en ${SRC} ${esperados.length - faltan.length} · faltan ${faltan.length}`);
if (faltan.length) { console.log("  faltan: " + faltan.slice(0, 12).join(", ")); process.exit(2); }

const aspecto = [], oscuras = [];
let convertidas = 0, blurs = 0;
for (const n of esperados) {
  const src = hay(n), jpg = `${DST}/${n}.jpg`, blur = `${DST}/${n}_blur.jpg`;
  if (!fs.existsSync(jpg) || fs.statSync(jpg).mtimeMs < fs.statSync(src).mtimeMs) {
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", src, "-q:v", "4", jpg]);
    convertidas++;
  }
  if (!fs.existsSync(blur) || fs.statSync(blur).mtimeMs < fs.statSync(jpg).mtimeMs) {
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", jpg, "-vf", "scale=480:-2,gblur=sigma=18", "-q:v", "6", blur]);
    blurs++;
  }
  const [w, h] = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", jpg], { encoding: "utf8" }).trim().split("x").map(Number);
  const r = w / h;
  if (Math.abs(r - 16 / 9) > 0.06) aspecto.push(`${n}=${w}x${h} (${r.toFixed(3)})`);
  // ⛔ `metadata=print` escribe en STDERR y `-v error` lo SILENCIA: con execFileSync (que devuelve
  //    stdout) el medidor daba vacio y la compuerta habria pasado en verde sin medir nada. Va `-v info`
  //    y se lee stderr.
  const rr = spawnSync("ffmpeg", ["-v", "info", "-i", jpg, "-vf", "signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-f", "null", "-"], { encoding: "utf8" });
  const y = +((rr.stderr + rr.stdout).match(/YAVG=([\d.]+)/) || [])[1];
  if (!(y > 0)) { console.error(`⛔ no pude medir la luma de ${n} — el medidor está roto`); process.exit(2); }
  if (y < 45) oscuras.push(`${n}=${y.toFixed(0)}`);
}
console.log(`convertidas a jpg ${convertidas} · hermanos _blur ${blurs}`);
console.log(`ASPECTO: ${esperados.length} medidas · fuera de 16:9 ${aspecto.length} ${aspecto.length ? "⛔ " + aspecto.slice(0, 5).join(" ") : "✓"}`);
console.log(`LUMA: ${esperados.length} medidas · por debajo de 45 ${oscuras.length} ${oscuras.length ? "→ mirar: " + oscuras.join(" ") : "✓"}`);
if (aspecto.length) process.exit(3);
