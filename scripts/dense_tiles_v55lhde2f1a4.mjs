import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const slug = "v55lhde2f1a4";
const clipsDir = `public/broll/${slug}`;
const mode = process.argv[2] === "supplemental" ? "supplemental" : "stock";
const listPath =
  mode === "supplemental"
    ? path.join(clipsDir, "supplemental_index.json")
    : `public/broll/dense_${slug}.json`;
const outDir = `public/_audit/${slug}/${mode}`;
const framesDir = path.join(outDir, "frames");
const shots = JSON.parse(fs.readFileSync(listPath, "utf8")).filter((s) => !s.error);
const available = shots.filter((s) => fs.existsSync(path.join(clipsDir, `${s.name}.mp4`)));

fs.mkdirSync(framesDir, { recursive: true });

const cols = 5;
const rows = 4;
const perSheet = cols * rows;
const cellWidth = 384;
const cellHeight = 216;
const labelHeight = 54;
const manifest = [];

for (let sheet = 0; sheet < Math.ceil(available.length / perSheet); sheet++) {
  const batch = available.slice(sheet * perSheet, (sheet + 1) * perSheet);
  const composites = [];
  for (let index = 0; index < batch.length; index++) {
    const shot = batch[index];
    const framePath = path.join(framesDir, `${shot.name}.jpg`);
    if (!fs.existsSync(framePath)) {
      execFileSync(
        "ffmpeg",
        [
          "-y",
          "-v",
          "error",
          "-ss",
          "1.2",
          "-i",
          path.join(clipsDir, `${shot.name}.mp4`),
          "-frames:v",
          "1",
          "-vf",
          `scale=${cellWidth}:${cellHeight}:force_original_aspect_ratio=increase,crop=${cellWidth}:${cellHeight}`,
          "-q:v",
          "4",
          framePath,
        ],
        { stdio: "ignore" },
      );
    }
    const safe = `${shot.name} · ${shot.query}`.replace(/[<&]/g, "").slice(0, 56);
    const label = Buffer.from(
      `<svg width="${cellWidth}" height="${labelHeight}"><rect width="100%" height="100%" fill="#172016"/><text x="8" y="22" font-family="Arial" font-size="15" fill="#f4ead4">${safe}</text><text x="8" y="43" font-family="Arial" font-size="13" fill="#b8c49a">sheet ${sheet} · cell ${index}</text></svg>`,
    );
    const cell = await sharp(framePath)
      .resize(cellWidth, cellHeight, { fit: "cover" })
      .extend({ bottom: labelHeight, background: "#172016" })
      .composite([{ input: label, top: cellHeight, left: 0 }])
      .toBuffer();
    const row = Math.floor(index / cols);
    const col = index % cols;
    composites.push({ input: cell, left: col * cellWidth, top: row * (cellHeight + labelHeight) });
    manifest.push({ sheet, index, name: shot.name, query: shot.query });
  }
  await sharp({
    create: {
      width: cols * cellWidth,
      height: rows * (cellHeight + labelHeight),
      channels: 3,
      background: "#172016",
    },
  })
    .composite(composites)
    .jpeg({ quality: 82 })
    .toFile(path.join(outDir, `sheet_${String(sheet).padStart(2, "0")}.jpg`));
}

fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`${available.length}/${shots.length} clips · ${Math.ceil(available.length / perSheet)} hojas → ${outDir}`);
