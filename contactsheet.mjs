// contactsheet.mjs — arma UNA imagen-grilla con el frame medio de cada CLIP + cada IMAGEN
// usada en el video, etiquetada por nombre, para que el usuario revise el FIT de un vistazo
// y marque las que no pegan (luego se regeneran solo esas). 0 tokens de Claude.
//   node contactsheet.mjs <slug>   → D:\videosdeclaude\<slug>_contactsheet.png
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import sharp from "sharp";

const slug = process.argv[2];
if (!slug) { console.error("Uso: node contactsheet.mjs <slug>"); process.exit(1); }
const FF = path.join(process.cwd(), "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe");
const bs = JSON.parse(fs.readFileSync(`beatsheet/${slug}.json`, "utf8"));

// juntar refs únicas (clips broll/vid + imágenes img/real, sin avatar_clips ni _blur)
// FIX: antes solo broll/+img/ → los videos que usan real/ (76 imágenes en ventilador)
// quedaban sin auditar en la hoja de contactos.
const refs = new Map(); // src -> kind
const add = (s) => {
  if (typeof s !== "string" || s.includes("_blur")) return;
  if (/^(broll|vid)\//.test(s) && /\.(mp4|webm|mov)$/i.test(s)) refs.set(s, "clip");
  else if (/^(img|real)\//.test(s)) refs.set(s, "img");
};
const walk = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) return o.forEach(walk); if (o.src) add(o.src); if (o.image) add(o.image); for (const s of o.slides || []) add(s.image); for (const w of o.waypoints || []) add(w.image); for (const k of Object.keys(o)) if (k !== "gen") walk(o[k]); };
walk(bs.beats);

const items = [...refs.keys()].sort();
const TMP = "_cs"; fs.mkdirSync(TMP, { recursive: true });
const TW = 360, TH = 220, LBL = 30, COLS = 6, GAP = 8;
const cellH = TH + LBL;

const tiles = [];
for (const src of items) {
  const name = src.split("/").pop().replace(/\.(mp4|png|jpg|webp)$/i, "");
  let imgBuf;
  try {
    if (refs.get(src) === "clip") {
      const fp = path.join(TMP, `${name}.jpg`);
      execFileSync(FF, ["-y", "-ss", "2", "-i", path.join("public", src), "-frames:v", "1", "-q:v", "4", fp], { stdio: "ignore" });
      imgBuf = fs.readFileSync(fp);
    } else {
      imgBuf = fs.readFileSync(path.join("public", src));
    }
    const thumb = await sharp(imgBuf).resize(TW, TH, { fit: "cover" }).jpeg().toBuffer();
    const label = Buffer.from(`<svg width="${TW}" height="${cellH}"><rect width="${TW}" height="${cellH}" fill="#111"/><text x="6" y="${TH + 21}" fill="#FFC400" font-family="Arial" font-size="18" font-weight="bold">${refs.get(src) === "clip" ? "🎬 " : ""}${name}</text></svg>`);
    const cell = await sharp(label).composite([{ input: thumb, top: 0, left: 0 }]).png().toBuffer();
    tiles.push({ name, cell });
  } catch (e) { console.log(`✗ ${name}: ${e.message}`); }
}

const rows = Math.ceil(tiles.length / COLS);
const W = COLS * (TW + GAP) + GAP, H = rows * (cellH + GAP) + GAP;
const canvas = sharp({ create: { width: W, height: H, channels: 3, background: "#000" } });
const comp = tiles.map((t, i) => ({ input: t.cell, left: GAP + (i % COLS) * (TW + GAP), top: GAP + Math.floor(i / COLS) * (cellH + GAP) }));
const out = `D:/videosdeclaude/${slug}_contactsheet.png`;
await canvas.composite(comp).png().toFile(out);
fs.rmSync(TMP, { recursive: true, force: true });
console.log(`hoja de contactos: ${tiles.length} assets → ${out}`);
