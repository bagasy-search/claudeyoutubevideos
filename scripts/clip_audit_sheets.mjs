// clip_audit_sheets.mjs — COMPUERTA per-clip: extrae 1 frame del MEDIO de cada clip del
// good-set y los monta en grillas de 24 (6x4) para que agentes visión caceen los OFF-TOPIC.
//   node scripts/clip_audit_sheets.mjs <slug>
// Salida: _v3/<slug>_clipsheets/sheet_NN.jpg + _v3/<slug>_clipsheets/manifest.json
//   manifest: [{sheet:"sheet_00.jpg", tiles:[{idx,row,col,name}, ...]}, ...]
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const slug = process.argv[2];
const PREFIX = process.argv[3] || (slug === "techo5" ? "t5_s_" : slug === "jardin" ? "jd_s_" : slug === "techo7" ? "t7_s_" : slug + "_s_");
if (!slug) { console.error("Uso: node scripts/clip_audit_sheets.mjs <slug> [prefix]"); process.exit(1); }
const RX = new RegExp("^" + PREFIX.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\d+\\.mp4$");
const FF = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffmpeg";
const FP = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe";
const BROLL = "public/broll";
const OUT = `_v3/${slug}_clipsheets`;
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const TMP = path.join(OUT, "_frames");
fs.mkdirSync(TMP, { recursive: true });

const clips = fs.readdirSync(BROLL).filter((f) => f.startsWith(`${slug === "techo5" ? "t5_s_" : slug}`) && f.endsWith(".mp4")).sort();
// techo5 usa prefijo t5_s_
const names = fs.readdirSync(BROLL).filter((f) => RX.test(f)).sort();
const list = names.length ? names : clips;
console.log(`${list.length} clips a auditar`);

const dur = (f) => {
  const r = spawnSync(FP, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" });
  return parseFloat((r.stdout || "0").trim()) || 3;
};
const frames = [];
for (const f of list) {
  const src = path.join(BROLL, f);
  const name = f.replace(/\.mp4$/, "");
  const mid = Math.max(0.3, dur(src) / 2);
  const dest = path.join(TMP, `${name}.jpg`);
  const r = spawnSync(FF, ["-y", "-v", "error", "-ss", String(mid), "-i", src, "-frames:v", "1",
    "-vf", "scale=480:270:force_original_aspect_ratio=increase,crop=480:270,setsar=1,format=rgb24", "-q:v", "4", dest],
    { encoding: "utf8", timeout: 30000 });
  if (r.status === 0 && fs.existsSync(dest)) frames.push({ name, file: dest });
  else process.stdout.write("x");
}
console.log(`\n${frames.length} frames extraídos`);

// montar en grillas de 24 (6 cols x 4 rows)
const PER = 24, COLS = 6, ROWS = 4;
const manifest = [];
for (let s = 0; s * PER < frames.length; s++) {
  const batch = frames.slice(s * PER, s * PER + PER);
  const sheetName = `sheet_${String(s).padStart(2, "0")}.jpg`;
  const inputs = [];
  batch.forEach((fr) => { inputs.push("-i", fr.file); });
  // filtro: escalar cada input → concat en un solo stream → tile (el tile muestrea N frames)
  const scaleParts = batch.map((_, i) => `[${i}:v]scale=480:270,setsar=1,format=rgb24[t${i}]`).join(";");
  const catIn = batch.map((_, i) => `[t${i}]`).join("");
  const filter = `${scaleParts};${catIn}concat=n=${batch.length}:v=1:a=0[cat];[cat]tile=${COLS}x${ROWS}:padding=4:color=white[out]`;
  const dest = path.join(OUT, sheetName);
  const r = spawnSync(FF, ["-y", "-v", "error", ...inputs, "-filter_complex", filter, "-map", "[out]", "-q:v", "3", dest],
    { encoding: "utf8", timeout: 60000 });
  if (r.status !== 0) { console.error("tile fail sheet", s, r.stderr?.slice(0, 300)); continue; }
  manifest.push({
    sheet: sheetName,
    tiles: batch.map((fr, i) => ({ idx: i, row: Math.floor(i / COLS), col: i % COLS, name: fr.name })),
  });
  console.log(`${sheetName}: ${batch.length} clips`);
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 1));
console.log(`\n${manifest.length} sheets → ${OUT}`);
