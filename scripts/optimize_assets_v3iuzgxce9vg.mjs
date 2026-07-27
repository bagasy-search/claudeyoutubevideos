// optimize_assets_v3iuzgxce9vg.mjs — baja el tarball de ~2.9 GB a <1 GB para que entre en el
// release de GitHub (tope 2 GB). Dos cosas:
//   1) b-roll → 720p, SIN audio, RECORTADO a la duración que realmente usa el build (+margen).
//      Bajar 291 clips completos y mandar 2.2 GB cuando el video usa 4-6s de cada uno es tirar
//      banda: el render sólo lee ese pedacito.
//   2) PNG de gpt-image → JPG q3. ⚠️ Después hay que reescribir las rutas .png en los beats
//      (gotcha conocido: una ruta .png que quedó a mano da 404 y MATA el chunk entero).
import fs from "fs";
import { execFileSync } from "child_process";
import os from "os";

const SLUG = "v3iuzgxce9vg";
const DIR = `public/broll/${SLUG}`;
const MARGEN = 0.8;      // segundos extra por si el RawShot pide un frame de más
const WORKERS = Math.max(2, Math.min(6, os.cpus().length - 2));

const brollSrc = fs.readFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`, "utf8");
const BROLL = JSON.parse(brollSrc.slice(brollSrc.indexOf("= [") + 2, brollSrc.lastIndexOf("]") + 1));

const tareas = BROLL.filter((b) => fs.existsSync(`${DIR}/${b.name}.mp4`));
console.log(`recomprimiendo ${tareas.length} clips a 720p (${WORKERS} en paralelo)...`);

let hechos = 0, fallos = 0;
const uno = (b) => {
  const src = `${DIR}/${b.name}.mp4`;
  const tmp = `${DIR}/${b.name}.opt.mp4`;
  const dur = Math.max(2, (b.dur || 4) + MARGEN);
  try {
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-t", String(dur), "-i", src,
      "-vf", "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720",
      "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "28", "-pix_fmt", "yuv420p", tmp],
      { stdio: "pipe" });
    const st = fs.statSync(tmp);
    if (st.size < 10000) throw new Error("salida vacía");
    fs.renameSync(tmp, src);
    hechos++;
    if (hechos % 50 === 0) console.log(`  ... ${hechos}/${tareas.length}`);
  } catch (e) {
    fallos++;
    try { fs.unlinkSync(tmp); } catch {}   // nunca dejar un archivo roto: ffmpeg se cuelga con ellos
  }
};

// pool simple
const cola = tareas.slice();
const runners = Array.from({ length: WORKERS }, async () => { while (cola.length) uno(cola.shift()); });
await Promise.all(runners);
console.log(`b-roll: ${hechos} ok · ${fallos} fallaron`);
