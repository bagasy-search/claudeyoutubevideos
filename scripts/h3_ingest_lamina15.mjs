// h3_ingest_lamina15.mjs — mete los clips de H3 al pipeline del video.
//
//   node scripts/h3_ingest_lamina15.mjs [--dry]
//
// Qué hace con cada `public/h3/vast_<name>.mp4`:
//  1) CONSERVA EL AUDIO pero NIVELADO Y BAJO. H3 genera ambiente nativo y el creador
//     lo quiere puesto (da realismo), sólo que discreto debajo de la locución. Cada
//     clip sale con niveles distintos, así que se normaliza a -24 LUFS: con todos los
//     clips en el mismo nivel, el volumen final se controla con UNA perilla en el
//     render en vez de clip por clip. El mute definitivo NO va: lo pidió con audio.
//  2) Lo escala/recorta a 1280 de ancho y lo re-encodea a crf 26 (el tarball del farm
//     tiene tope duro de 2 GB y ya vamos por 334 MB).
//  3) Lo guarda como `public/broll/lamina15_<name>.mp4`, que es el nombre que el build
//     busca ANTES que la imagen — así el momento pasa solo de foto quieta a clip.
//  4) Deja la imagen original en disco (no se borra nada: si un clip sale mal, se
//     quita el mp4 y el build vuelve a caer en la foto).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const FF = path.join(process.env.LOCALAPPDATA, "Microsoft", "WinGet", "Links", "ffmpeg.exe");
const FP = path.join(process.env.LOCALAPPDATA, "Microsoft", "WinGet", "Links", "ffprobe.exe");
const SLUG = "lamina15";
const SRC = "public/h3/lamina15";
const DRY = process.argv.includes("--dry");

if (!fs.existsSync(SRC)) { console.error("no existe", SRC); process.exit(1); }
const files = fs.readdirSync(SRC).filter((f) => f.startsWith("vast_") && f.endsWith(".mp4"));
console.log(`${files.length} clips de H3 en ${SRC}`);

let ok = 0, skip = 0;
const ingested = [];
const short = [];
for (const f of files) {
  const name = f.replace(/^vast_/, "").replace(/\.mp4$/, "");
  const dest = `public/broll/${SLUG}_${name}.mp4`;
  const src = path.join(SRC, f);
  // sanidad: un clip de menos de 2s casi seguro salió cortado
  let dur = 0;
  try {
    dur = parseFloat(execFileSync(FP, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src], { encoding: "utf8" }).trim());
  } catch { }
  if (!dur || dur < 2) { short.push(`${name} (${dur || 0}s)`); skip++; continue; }
  if (DRY) { console.log(`  [dry] ${f} → ${dest}  (${dur.toFixed(1)}s)`); ok++; continue; }
  try {
    execFileSync(FF, ["-y", "-i", src, "-vf", "scale='min(1280,iw)':-2", "-c:v", "libx264", "-crf", "26", "-preset", "veryfast",
      "-af", "loudnorm=I=-24:TP=-3:LRA=11", "-c:a", "aac", "-b:a", "96k", "-ac", "2", dest, "-loglevel", "error"]);
    ingested.push(`${SLUG}_${name}`);
    ok++;
  } catch (e) { console.log("  falló", name, String(e.message).slice(0, 80)); skip++; }
}
// manifiesto: qué clips son de H3 (los únicos que llevan cama de ambiente;
// los de Pexels siguen mudos como todo el b-roll del canal)
fs.writeFileSync(`_v3/${SLUG}_h3_ingested.json`, JSON.stringify(ingested, null, 1), "utf8");
console.log(`\ningestados ${ok} · salteados ${skip}  → _v3/${SLUG}_h3_ingested.json`);
if (short.length) console.log("demasiado cortos (revisar):", short.join(", "));
console.log("ahora: node build_lamina15.mjs && node beatsheet.mjs beatsheet/lamina15.json && node scripts/rewire_lamina15.mjs");
