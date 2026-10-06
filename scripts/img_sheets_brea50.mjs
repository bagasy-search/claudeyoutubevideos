// img_sheets_brea50.mjs — tilea las fotos real/brea50_*.png en grillas 6x4 para audit visión.
import fs from "fs"; import path from "path"; import { spawnSync } from "child_process";
const FF = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffmpeg";
const OUT = "_v3/brea50_imgsheets";
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const TMP = path.join(OUT, "_f"); fs.mkdirSync(TMP, { recursive: true });
const imgs = fs.readdirSync("public/real").filter((f) => /^brea50_.*\.png$/.test(f) && !/_blur\./.test(f)).sort();
const norm = [];
for (const f of imgs) {
  const name = f.replace(/\.png$/, "");
  const dest = path.join(TMP, `${name}.jpg`);
  spawnSync(FF, ["-y", "-v", "error", "-i", path.join("public/real", f),
    "-vf", "scale=480:270:force_original_aspect_ratio=increase,crop=480:270,setsar=1,format=rgb24", "-q:v", "4", dest]);
  norm.push({ name, jpg: dest });
}
const PER = 24, manifest = [];
for (let i = 0; i < norm.length; i += PER) {
  const batch = norm.slice(i, i + PER);
  const idx = String(i / PER).padStart(2, "0");
  const sheet = path.join(OUT, `sheet_${idx}.jpg`);
  const args = ["-y", "-v", "error"];
  for (const b of batch) args.push("-i", b.jpg);
  args.push("-filter_complex", `concat=n=${batch.length}:v=1:a=0,tile=6x4`, "-q:v", "4", sheet);
  spawnSync(FF, args);
  manifest.push({ sheet: `sheet_${idx}.jpg`, tiles: batch.map((b, k) => ({ idx: k, row: Math.floor(k / 6), col: k % 6, name: b.name })) });
  console.log(`sheet_${idx}.jpg: ${batch.length}`);
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 1));
console.log(`${manifest.length} sheets`);
