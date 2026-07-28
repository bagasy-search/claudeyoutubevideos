// shrink_assets_v2pd88ko0ud8.mjs — el release del farm se cae con tarballs grandes
// (404 intermitente en uploads.github.com desde esta PC con >400 MB). Objetivo ~270 MB.
//   node scripts/shrink_assets_v2pd88ko0ud8.mjs
// · b-roll → 960px CRF 31, RECORTADO a la duración que usa el build (+1s de colchón)
// · imágenes PNG → JPG q4  (los PNG originales NO se borran: son assets pagos)
// · reescribe las rutas .png → .jpg en TODO lo generado y verifica que no quede rota
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const SLUG = "v2pd88ko0ud8";
const BROLL = `public/broll/${SLUG}`;
const beatsFile = `src/_fed6/VideoEdit/${SLUG}_beats.ts`;
const brollFile = `src/_fed6/VideoEdit/${SLUG}_broll.ts`;
const parse = (f) => JSON.parse(fs.readFileSync(f, "utf8").replace(/^[\s\S]*?=\s*/, "").replace(/;\s*$/, ""));

// ── 1. b-roll: recomprimir recortado a lo que usa el build ───────────────────
const bro = parse(brollFile);
let vOk = 0, vSkip = 0;
for (const b of bro) {
  const f = path.join("public", b.src);
  if (!fs.existsSync(f)) { vSkip++; continue; }
  const st = fs.statSync(f);
  if (st.size < 900000) continue; // ya chico
  const tmp = f.replace(/\.mp4$/, "_s.mp4");
  try {
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-t", String(b.dur + 1.2), "-i", f,
      "-vf", "scale=960:-2", "-c:v", "libx264", "-crf", "31", "-preset", "veryfast", "-an", tmp]);
    if (fs.statSync(tmp).size > 20000 && fs.statSync(tmp).size < st.size) { fs.renameSync(tmp, f); vOk++; }
    else fs.unlinkSync(tmp);
  } catch { try { fs.unlinkSync(tmp); } catch {} }
}

// ── 2. imágenes PNG → JPG (sin borrar los PNG) ───────────────────────────────
const pngs = fs.readdirSync("public/img").filter((f) => /^v2pd_.*\.png$/.test(f));
let iOk = 0;
for (const p of pngs) {
  const src = path.join("public/img", p);
  const out = src.replace(/\.png$/, ".jpg");
  if (!fs.existsSync(out)) {
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-q:v", "4", out]);
  }
  iOk++;
}

// ── 3. reapuntar .png → .jpg en TODO lo generado (incluye rutas a mano) ──────
for (const f of [beatsFile, brollFile, `src/VideoEdit/Main_${SLUG}.tsx`]) {
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, "utf8");
  s = s.replace(/(img\/v2pd_[a-z0-9_]+)\.png/gi, "$1.jpg");
  fs.writeFileSync(f, s);
}

// ── 4. verificar que ninguna ruta quedó rota ────────────────────────────────
const beats = parse(beatsFile);
const missing = [];
const check = (r) => { if (r && /^(img|broll)\//.test(r) && !fs.existsSync(path.join("public", r))) missing.push(r); };
for (const b of beats) { check(b.src); check(b.image); for (const it of b.items || []) check(it && it.image); }
for (const b of parse(brollFile)) check(b.src);

console.log(`shrink · b-roll recomprimidos ${vOk} (faltaban ${vSkip}) · jpg ${iOk}`);
if (missing.length) { console.error("RUTAS ROTAS:", [...new Set(missing)].join(", ")); process.exit(1); }
console.log("rutas ✓ todas existen");
