// shrink_assets_v0w7c4w70kfg.mjs — deja el tarball del farm en un tamaño que SÍ sube.
// Historial del canal: desde esta PC los assets >400 MB dan 404 al subir el release,
// y el tope duro del release son 2 GB. Crudo esto pesa ~1,1 GB (326 MB de PNG + 622
// de b-roll + 137 del avatar).
//   · PNG de gpt-image → JPG q4          (326 MB → ~25 MB)
//   · b-roll → 960 px CRF 31 RECORTADO a la duración que usa el build (622 → ~60 MB)
// ⛔ Los originales NO se borran (son assets pagos): se APARTAN a _orig_<slug>/.
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const SLUG = "v0w7c4w70kfg";
const IMG = `public/img/${SLUG}`;
const BROLL = `public/broll/${SLUG}`;
const CUES = fs.readFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`, "utf8");

const mb = (p) => (fs.existsSync(p) ? fs.statSync(p).size / 1048576 : 0);
const dirMb = (d) => (fs.existsSync(d) ? fs.readdirSync(d).reduce((a, f) => a + mb(path.join(d, f)), 0) : 0);

/* ── 1) imágenes PNG → JPG q4 ─────────────────────────────────────────────── */
const ORIGIMG = `public/img/_orig_${SLUG}`;
fs.mkdirSync(ORIGIMG, { recursive: true });
const antesImg = dirMb(IMG);
let convertidas = 0;
for (const f of fs.readdirSync(IMG)) {
  if (!/\.png$/i.test(f)) continue;
  const src = path.join(IMG, f);
  const dst = src.replace(/\.png$/i, ".jpg");
  if (fs.existsSync(dst)) continue;
  try {
    execFileSync("ffmpeg", ["-y", "-v", "error", "-i", src, "-q:v", "4", dst], { stdio: "pipe" });
    if (fs.existsSync(dst) && fs.statSync(dst).size > 8000) {
      fs.renameSync(src, path.join(ORIGIMG, f)); // APARTAR, no borrar
      convertidas++;
    } else if (fs.existsSync(dst)) {
      fs.unlinkSync(dst); // el jpg salió roto: me quedo con el png
    }
  } catch { /* si falla, se queda el png */ }
}
console.log(`imágenes: ${convertidas} PNG→JPG · ${antesImg.toFixed(0)} MB → ${dirMb(IMG).toFixed(0)} MB (originales en ${ORIGIMG})`);

/* ── 2) b-roll: 960 px, CRF 31, RECORTADO a lo que usa el build ───────────── */
// Sin recortar, un clip de 30s viaja entero para mostrarse 3s. Ese recorte es
// lo que más peso saca (más que la resolución).
const usoPorClip = new Map();
const re = /start: [\d.]+, dur: ([\d.]+)(?:, cut: true)?, node: \(\s*<FedFullShot[^>]*broll\/v0w7c4w70kfg\/([a-z0-9_]+)\.mp4/g;
let m;
while ((m = re.exec(CUES))) {
  const d = Math.ceil(+m[1]) + 2; // +2s de colchón por el solape de la transición
  usoPorClip.set(m[2], Math.max(usoPorClip.get(m[2]) || 0, d));
}
const ORIGBR = `public/broll/_orig_${SLUG}`;
fs.mkdirSync(ORIGBR, { recursive: true });
const antesBr = dirMb(BROLL);
let recomp = 0, saltados = 0;
for (const f of fs.readdirSync(BROLL)) {
  if (!/\.mp4$/i.test(f)) continue;
  const name = f.replace(/\.mp4$/i, "");
  const src = path.join(BROLL, f);
  if (!usoPorClip.has(name)) { fs.renameSync(src, path.join(ORIGBR, f)); saltados++; continue; } // no se usa: fuera del tarball
  const tmp = path.join(BROLL, `_tmp_${f}`);
  try {
    execFileSync("ffmpeg", ["-y", "-v", "error", "-t", String(usoPorClip.get(name)), "-i", src,
      "-vf", "scale=960:-2", "-c:v", "libx264", "-crf", "31", "-preset", "veryfast",
      "-pix_fmt", "yuv420p", "-an", tmp], { stdio: "pipe" });
    if (fs.existsSync(tmp) && fs.statSync(tmp).size > 10000) {
      fs.renameSync(src, path.join(ORIGBR, f));  // APARTAR el original
      fs.renameSync(tmp, src);
      recomp++;
    } else if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  } catch { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); }
}
console.log(`b-roll: ${recomp} recomprimidos · ${saltados} apartados (no los usa el build) · ${antesBr.toFixed(0)} MB → ${dirMb(BROLL).toFixed(0)} MB`);

console.log(`\nTOTAL que viaja: avatar ${mb(`public/${SLUG}_opt.mp4`).toFixed(0)} MB + img ${dirMb(IMG).toFixed(0)} MB + broll ${dirMb(BROLL).toFixed(0)} MB + sfx ${dirMb("public/sfx").toFixed(0)} MB`);
