// img_verify_sheets.mjs <slug> <prefix> — monta las imágenes reales (public/real/<prefix>*.png) en
// grillas de 24 para el VERIFY ESTRICTO (agentes rechazan texto/logo/watermark/collage/off-topic).
//   node scripts/img_verify_sheets.mjs jardin jd_s_
// Salida: _v3/<slug>_realsheets/sheet_NN.jpg + manifest.json
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
const slug = process.argv[2], PREFIX = process.argv[3] || slug + "_s_";
const FF = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffmpeg";
const REAL = "public/real";
const OUT = `_v3/${slug}_realsheets`;
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const RX = new RegExp("^" + PREFIX.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\d+(_[a-z])?\\.png$");
const files = fs.readdirSync(REAL).filter((f) => RX.test(f)).sort();
console.log(`${files.length} imágenes a verificar`);
const PER = 24, COLS = 6, ROWS = 4;
const manifest = [];
for (let s = 0; s * PER < files.length; s++) {
  const batch = files.slice(s * PER, s * PER + PER);
  const sheetName = `sheet_${String(s).padStart(2, "0")}.jpg`;
  const inputs = []; batch.forEach((f) => inputs.push("-i", path.join(REAL, f)));
  const scaleParts = batch.map((_, i) => `[${i}:v]scale=480:270:force_original_aspect_ratio=increase,crop=480:270,setsar=1,format=rgb24[t${i}]`).join(";");
  const catIn = batch.map((_, i) => `[t${i}]`).join("");
  const filter = `${scaleParts};${catIn}concat=n=${batch.length}:v=1:a=0[cat];[cat]tile=${COLS}x${ROWS}:padding=4:color=white[out]`;
  const r = spawnSync(FF, ["-y", "-v", "error", ...inputs, "-filter_complex", filter, "-map", "[out]", "-q:v", "3", path.join(OUT, sheetName)], { encoding: "utf8", timeout: 120000 });
  if (r.status !== 0) { console.error("tile fail", s, (r.stderr || "").slice(0, 200)); continue; }
  manifest.push({ sheet: sheetName, tiles: batch.map((f, i) => ({ idx: i, row: Math.floor(i / COLS), col: i % COLS, name: f.replace(/\.png$/, "") })) });
  process.stdout.write(".");
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 1));
console.log(`\n${manifest.length} sheets → ${OUT}`);
