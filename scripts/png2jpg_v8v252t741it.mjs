// png2jpg_v8v252t741it.mjs — convierte los PNG de ESTE video a JPG de calidad alta.
// gpt-image-2 devuelve PNG de 1792x1008 (~2.4 MB cada uno); 305 imágenes son ~725 MB y el asset
// de release del farm topea en 2 GB. En JPG q88 pesan ~10x menos sin diferencia visible a 1080p.
// Sólo toca archivos de este slug. Deja el PNG borrado y el JPG con el MISMO nombre base, así el
// resto del pipeline sólo cambia la extensión.
import fs from "fs";
import { execFileSync } from "child_process";

const SLUG = "v8v252t741it";
const DIR = "public/img";
const files = fs.readdirSync(DIR).filter((f) => /\.png$/i.test(f) && f.includes(SLUG) && !/_blur\./i.test(f));
console.log(`PNG de este video: ${files.length}`);

const mb = (b) => b / 1048576;
let antes = 0, despues = 0, ok = 0, err = 0;
for (const f of files) {
  const src = `${DIR}/${f}`;
  const dst = src.replace(/\.png$/i, ".jpg");
  antes += fs.statSync(src).size;
  if (fs.existsSync(dst) && fs.statSync(dst).size > 20000) { despues += fs.statSync(dst).size; fs.rmSync(src); ok++; continue; }
  try {
    execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-i", src, "-q:v", "3", dst], { stdio: "pipe" });
    if (fs.existsSync(dst) && fs.statSync(dst).size > 20000) { despues += fs.statSync(dst).size; fs.rmSync(src); ok++; }
    else err++;
  } catch { err++; }
}
console.log(`convertidas ${ok} · fallaron ${err}`);
console.log(`peso imágenes: ${mb(antes).toFixed(0)} MB → ${mb(despues).toFixed(0)} MB`);
