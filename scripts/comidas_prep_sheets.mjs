// comidas_prep_sheets.mjs — (1) re-encode fotos nuevas (dNN_/e_) a JPEG baseline,
// (2) agrupa por comida (prefijo antes del último _N), (3) arma un contact sheet
// NUMERADO por comida para que un juez Haiku diga qué índices son on-topic+limpios.
// Salida: public/real/<name>.jpg (baseline) + _v3/sheets/<dish>.jpg + _v3/sheets/manifest.json
import fs from "fs";
import path from "path";
import sharp from "sharp";

const REAL = "public/real";
const OUT = "_v3/sheets";
fs.mkdirSync(OUT, { recursive: true });

// juntar fotos nuevas por comida: nombre = <dish>_<qi>[_i].<ext>  → dish = todo antes del "_<qi>_" o "_<qi>."
const files = fs.readdirSync(REAL).filter((f) => /^(d\d\d_|e_)/.test(f) && /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
const dishOf = (f) => {
  // d07_arrozguisado_2_3.jpg → d07_arrozguisado ; e_viejo_come_2_5.jpg → e_viejo_come
  return f.replace(/\.[a-z0-9]+$/i, "").replace(/(_\d+)+$/, "");
};
const groups = {};
for (const f of files) (groups[dishOf(f)] = groups[dishOf(f)] || []).push(f);

const manifest = {};
let reenc = 0, sheets = 0;
for (const dish of Object.keys(groups).sort()) {
  const list = groups[dish].sort();
  const okFiles = [];
  const thumbs = [];
  for (const f of list) {
    const src = path.join(REAL, f);
    const jpg = f.replace(/\.(jpeg|png|webp|gif)$/i, ".jpg");
    const dst = path.join(REAL, jpg);
    try {
      // baseline JPEG (no progresivo) + tope 1600px
      const buf = await sharp(fs.readFileSync(src), { failOn: "none" }).rotate().resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 88, progressive: false, mozjpeg: false }).toBuffer();
      fs.writeFileSync(dst, buf);
      if (jpg !== f) fs.rmSync(src, { force: true });
      reenc++;
      okFiles.push("real/" + jpg);
      const t = await sharp(buf).resize(360, 202, { fit: "cover" }).jpeg({ quality: 80 }).toBuffer();
      thumbs.push(t);
    } catch (e) { if (reenc === 0) console.error("REENC FAIL", f, "::", e.message.slice(0, 120)); }
  }
  if (!thumbs.length) continue;
  manifest[dish] = okFiles;
  // montage numerado 5 cols
  const cols = 5, tw = 360, th = 202, pad = 3, lh = 26;
  const rows = Math.ceil(thumbs.length / cols);
  const W = cols * tw + (cols + 1) * pad, H = rows * (th + lh) + (rows + 1) * pad;
  const comps = [];
  for (let i = 0; i < thumbs.length; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const x = pad + c * (tw + pad), y = pad + r * (th + lh + pad);
    comps.push({ input: thumbs[i], left: x, top: y + lh });
    const label = Buffer.from(`<svg width="${tw}" height="${lh}"><rect width="100%" height="100%" fill="#111"/><text x="6" y="19" font-family="Arial" font-size="18" fill="#fff">#${i} · ${dish}</text></svg>`);
    comps.push({ input: label, left: x, top: y });
  }
  await sharp({ create: { width: W, height: H, channels: 3, background: "#000" } }).composite(comps).jpeg({ quality: 82 }).toFile(path.join(OUT, dish + ".jpg"));
  sheets++;
  console.log(`${dish}: ${thumbs.length} fotos → sheet`);
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 1));
console.log(`\n=== prep: ${reenc} fotos baseline · ${sheets} contact sheets · manifest con ${Object.keys(manifest).length} comidas ===`);
