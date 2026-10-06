import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
const SRC = "D:/Proyectos/raykessler-guias/laminas";
const DST = "D:/Proyectos/raykessler-guias/laminas_jpg";
fs.mkdirSync(DST, { recursive: true });
const files = fs.readdirSync(SRC).filter((f) => /\.png$/i.test(f)).sort();
let tot = 0, totj = 0;
for (const f of files) {
  const s = path.join(SRC, f), d = path.join(DST, f.replace(/\.png$/i, ".jpg"));
  tot += fs.statSync(s).size;
  await sharp(s).jpeg({ quality: 82 }).toFile(d);
  totj += fs.statSync(d).size;
}
console.log(`${files.length} imgs · PNG ${(tot / 1e6).toFixed(1)} MB -> JPG ${(totj / 1e6).toFixed(1)} MB`);

// hojas de contacto (una por orientación) para auditar de un vistazo
const mk = async (list, out, cols, tw) => {
  if (!list.length) return;
  const th = Math.round(tw * (out.includes("_v") ? 1536 / 1024 : 1024 / 1536));
  const rows = Math.ceil(list.length / cols);
  const pad = 26;
  const canvas = sharp({ create: { width: cols * tw, height: rows * (th + pad), channels: 3, background: "#111" } });
  const comps = [];
  for (let i = 0; i < list.length; i++) {
    const buf = await sharp(path.join(DST, list[i])).resize(tw, th, { fit: "cover" }).toBuffer();
    comps.push({ input: buf, left: (i % cols) * tw, top: Math.floor(i / cols) * (th + pad) });
    const label = list[i].replace(/\.jpg$/, "");
    const svg = `<svg width="${tw}" height="${pad}"><rect width="${tw}" height="${pad}" fill="#111"/><text x="6" y="18" font-family="monospace" font-size="15" fill="#E0B354">${label}</text></svg>`;
    comps.push({ input: Buffer.from(svg), left: (i % cols) * tw, top: Math.floor(i / cols) * (th + pad) + th });
  }
  await canvas.composite(comps).jpeg({ quality: 80 }).toFile(out);
  console.log("hoja:", out, `(${list.length})`);
};
const all = fs.readdirSync(DST).filter((f) => /\.jpg$/i.test(f)).sort();
await mk(all.filter((f) => f.startsWith("rk_h") || f.startsWith("rk_lam")), "D:/Proyectos/raykessler-guias/_contact_h.jpg", 4, 460);
await mk(all.filter((f) => f.startsWith("rk_v")), "D:/Proyectos/raykessler-guias/_contact_v.jpg", 5, 340);
