// Extrae dos muestras ligeras por clip y crea el manifiesto de encaje literal para Agnes.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const list = JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", "cmecalor_needstock.json"), "utf8"));
const clips = path.join(ROOT, "public", "broll", "cmecalor");
const stills = path.join(ROOT, "_v3", "cmecalor_stock_stills");
fs.mkdirSync(stills, { recursive: true });

const manifest = [];
for (const item of list) {
  const clip = path.join(clips, `${item.name}.mp4`);
  if (!fs.existsSync(clip)) continue;
  let dur = 8;
  try {
    dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", clip], { encoding: "utf8" }).trim()) || 8;
  } catch {}
  for (const [label, ratio] of [["a", 0.28], ["b", 0.68]]) {
    const t = Math.max(0.2, dur * ratio).toFixed(2);
    const out = path.join(stills, `${item.name}_${label}.jpg`);
    execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", t, "-i", clip, "-frames:v", "1", "-vf", "scale=960:-2", out]);
    manifest.push({
      name: `${item.name}_${label}`,
      clip: path.relative(ROOT, clip).replaceAll("\\", "/"),
      path: path.relative(ROOT, out).replaceAll("\\", "/"),
      phrase: item.concept,
      nouns: item.nouns,
      action: item.action,
      sample_s: Number(t),
    });
  }
}
fs.writeFileSync(path.join(ROOT, "_v3", "cmecalor_stock_imgaudit.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(JSON.stringify({ clips: list.length, samples: manifest.length, manifest: "_v3/cmecalor_stock_imgaudit.json" }));
