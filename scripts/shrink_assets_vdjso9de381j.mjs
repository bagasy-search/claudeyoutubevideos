// shrink_assets_vdjso9de381j.mjs — el release del farm topea en 2 GB.
// · b-roll → 720p RECORTADO a la duración que realmente usa el build (+0.5s de cola)
// · imágenes PNG → JPG q3, y se REAPUNTAN las rutas .png→.jpg en TODO lo generado
//   (los PNG originales NO se borran: son assets pagos; se manda sólo el JPG por lista explícita)
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const SLUG = "vdjso9de381j";
const BROLL = JSON.parse(fs.readFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`, "utf8").replace(/^[\s\S]*?=\s*/, "").replace(/;\s*$/, ""));

// ── b-roll: 720p recortado a lo que usa el build ─────────────────────────────
let a0 = 0, a1 = 0, nb = 0;
for (const c of BROLL) {
  const src = `public/${c.src}`;
  if (!fs.existsSync(src)) continue;
  const tmp = src.replace(/\.mp4$/, "_s.mp4");
  a0 += fs.statSync(src).size;
  try {
    execFileSync("ffmpeg", ["-y", "-i", src, "-t", String(Math.min(c.dur + 0.6, 8)),
      "-vf", "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720",
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "28", "-pix_fmt", "yuv420p", "-an", tmp], { stdio: "ignore" });
    fs.renameSync(tmp, src);
    a1 += fs.statSync(src).size; nb++;
  } catch { a1 += fs.statSync(src).size; }
}
console.log(`b-roll: ${nb} clips ${(a0 / 1048576).toFixed(0)} → ${(a1 / 1048576).toFixed(0)} MB`);

// ── imágenes PNG → JPG q3 ────────────────────────────────────────────────────
let i0 = 0, i1 = 0, ni = 0;
const conv = new Set();
for (const f of fs.readdirSync("public/img")) {
  if (!f.includes(SLUG) || !/\.png$/i.test(f)) continue;
  const src = path.join("public/img", f);
  const dst = src.replace(/\.png$/i, ".jpg");
  i0 += fs.statSync(src).size;
  if (!fs.existsSync(dst)) {
    try { execFileSync("ffmpeg", ["-y", "-i", src, "-q:v", "3", dst], { stdio: "ignore" }); } catch { continue; }
  }
  i1 += fs.statSync(dst).size; ni++;
  conv.add("img/" + f.replace(/\.png$/i, ""));
}
console.log(`imágenes: ${ni} PNG ${(i0 / 1048576).toFixed(0)} → ${(i1 / 1048576).toFixed(0)} MB en JPG`);

// ── reapuntar .png → .jpg en TODO lo generado + verificar que no quede roto ──
// (gotcha: las rutas escritas A MANO también hay que grepearlas, no sólo lo generado)
const files = [
  `src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`,
  `beatsheet/${SLUG}.json`,
  `src/VideoEdit/Main_${SLUG}.tsx`,
];
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, "utf8");
  const before = s;
  s = s.replace(/(img\/[a-z0-9_\-]*vdjso9de381j[a-z0-9_\-]*)\.png/gi, "$1.jpg");
  if (s !== before) { fs.writeFileSync(f, s); console.log(`  reapuntado ${f}`); }
}

// ── lista explícita de assets para el tarball (@_assets_<slug>.txt) ─────────
const beats = JSON.parse(fs.readFileSync(`beatsheet/${SLUG}.json`, "utf8")).beats;
const need = new Set([`${SLUG}_opt.mp4`, `${SLUG}.wav`]);  // el .wav lo pide AvatarLayer (borde audio-reactive) → sin él, 404 y muere el chunk
const add = (p) => { if (typeof p === "string" && p) need.add(p.replace(/^\/?public\//, "")); };
for (const b of beats) {
  add(b.src); add(b.image); add(b.clip);
  (b.slides || []).forEach((s) => add(s.image));
  (Array.isArray(b.items) ? b.items : []).forEach((it) => it && add(it.image));
}
for (const c of BROLL) add(c.src);
// resolver extensión real + agregar el _blur de focuscards
const out = new Set();
const miss = [];
for (const p of need) {
  const cands = [p, `${p}.jpg`, `${p}.png`, `${p}.mp4`];
  const hit = cands.find((c) => fs.existsSync(`public/${c}`));
  if (hit) out.add(hit); else miss.push(p);
}
for (const b of beats) {
  if (b.kind !== "focuscards") continue;
  for (const it of b.items || []) {
    const bl = `${String(it.image).replace(/\.(png|jpg|jpeg|webp)$/i, "")}_blur.jpg`;
    if (fs.existsSync(`public/${bl}`)) out.add(bl); else miss.push(bl);
  }
}
for (const f of fs.readdirSync("public/sfx")) out.add(`sfx/${f}`);      // el matrix cancela sin sfx/
for (const f of fs.readdirSync("public/med")) if (/.(png|jpg)$/i.test(f)) out.add(`med/${f}`);  // sólo los defaults, no los 880 MB de la carpeta compartida
fs.writeFileSync(`_assets_${SLUG}.txt`, [...out].sort().join("\n") + "\n");
let total = 0;
for (const p of out) total += fs.statSync(`public/${p}`).size;
console.log(`\nlista: ${out.size} archivos · ${(total / 1048576).toFixed(0)} MB`);
if (miss.length) { console.log(`⛔ FALTAN ${miss.length}:`, miss.slice(0, 12)); process.exit(1); }
