// dense_tiles.mjs — arma cuadrículas (contact sheets) de los clips densos para el
// auditor Haiku. Por cada clip d### existente extrae 1 frame, lo tila en grids de
// 24 (6x4) con etiqueta "idx · query" en cada celda, y escribe out/cs/grid_NN.png +
// out/cs/manifest.json ([{grid, cell, name, query}]).
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import sharp from "sharp";

const FF = "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe";
const stock = JSON.parse(fs.readFileSync("public/broll/stock_dense.json", "utf8"));
const names = Object.keys(stock).filter((n) => fs.existsSync(`public/broll/${n}.mp4`));
fs.mkdirSync("out/cs/_f", { recursive: true });

const CW = 480, CH = 270, COLS = 6, ROWS = 4, PER = COLS * ROWS;
const LBL = 34;
const manifest = [];
let gi = 0;

for (let g = 0; g < Math.ceil(names.length / PER); g++) {
  const chunk = names.slice(g * PER, g * PER + PER);
  const composites = [];
  for (let i = 0; i < chunk.length; i++) {
    const name = chunk[i];
    const fpath = `out/cs/_f/${name}.jpg`;
    try {
      if (!fs.existsSync(fpath))
        execFileSync(FF, ["-y", "-ss", "1.2", "-i", `public/broll/${name}.mp4`, "-frames:v", "1", "-vf", `scale=${CW}:${CH}`, fpath], { stdio: "ignore" });
    } catch { continue; }
    if (!fs.existsSync(fpath)) continue;
    const col = i % COLS, row = Math.floor(i / COLS);
    const idx = g * PER + i;
    // celda = frame + barra de etiqueta
    const label = Buffer.from(
      `<svg width="${CW}" height="${LBL}"><rect width="100%" height="100%" fill="#0b1418"/><text x="8" y="24" font-family="sans-serif" font-size="22" fill="#7Fe" >${idx} · ${name} · ${String(stock[name]).replace(/[<&]/g, "")}</text></svg>`
    );
    const cell = await sharp(fpath)
      .resize(CW, CH)
      .extend({ bottom: LBL, background: "#0b1418" })
      .composite([{ input: label, top: CH, left: 0 }])
      .toBuffer();
    composites.push({ input: cell, top: row * (CH + LBL), left: col * CW });
    manifest.push({ grid: g, cell: i, idx, name, query: stock[name] });
  }
  await sharp({ create: { width: COLS * CW, height: ROWS * (CH + LBL), channels: 3, background: "#0b1418" } })
    .composite(composites)
    .jpeg({ quality: 70 })
    .toFile(`out/cs/grid_${String(g).padStart(2, "0")}.jpg`);
  gi = g;
}
fs.writeFileSync("out/cs/manifest.json", JSON.stringify(manifest, null, 1));
console.log(`grids: ${gi + 1} · celdas: ${manifest.length} · out/cs/grid_NN.jpg`);
