// prep_clips_vxsag2ipph2js.mjs — post-proceso de los clips de stock bajados:
//  1) blackdetect: caza clips que abren con fundido desde negro o que son negros casi enteros
//  2) recorta una ventana limpia y re-encodea a 720p/crf26 sin audio (tarball < 2 GB)
// Los que no se pueden salvar se listan en _v3/vxsag2ipph2js_clips_malos.json → caen a imagen.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "vxsag2ipph2js";
const DIR = `public/broll/${SLUG}`;
const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith(".mp4") && !f.endsWith(".720.mp4")) : [];
const malos = [];
let ok = 0;

const probe = (f) => {
  try {
    return +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", f], { encoding: "utf8" }).trim();
  } catch { return 0; }
};
const blackRanges = (f) => {
  try {
    const out = execFileSync("ffmpeg", ["-hide_banner", "-i", f, "-vf", "blackdetect=d=0.4:pic_th=0.96", "-an", "-f", "null", "-"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return out;
  } catch (e) { return String(e.stderr || ""); }
};

for (const f of files) {
  const full = path.join(DIR, f);
  const dur = probe(full);
  if (!dur || dur < 1.2) { malos.push(f.replace(/\.mp4$/, "")); fs.rmSync(full, { force: true }); continue; }
  const log = blackRanges(full);
  const blacks = [...log.matchAll(/black_start:([\d.]+) black_end:([\d.]+)/g)].map((m) => [+m[1], +m[2]]);
  const blackTotal = blacks.reduce((s, [a, b]) => s + (b - a), 0);
  if (blackTotal > dur * 0.5) { malos.push(f.replace(/\.mp4$/, "")); fs.rmSync(full, { force: true }); continue; }
  // arranca en una ventana que no pise ningun tramo negro
  let ss = 0;
  for (const [a, b] of blacks) if (ss < b && a <= ss + 0.1) ss = b + 0.15;
  if (ss > dur - 2.2) ss = 0;
  const out = full.replace(/\.mp4$/, ".720.mp4");
  try {
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", String(ss.toFixed(2)), "-i", full,
      "-t", String(Math.min(14, dur - ss).toFixed(2)),
      "-vf", "scale='min(1280,iw)':-2", "-c:v", "libx264", "-preset", "veryfast", "-crf", "26",
      "-pix_fmt", "yuv420p", "-an", out]);
    fs.rmSync(full, { force: true });
    fs.renameSync(out, full);
    ok++;
  } catch { malos.push(f.replace(/\.mp4$/, "")); fs.rmSync(full, { force: true }); fs.rmSync(out, { force: true }); }
}

fs.writeFileSync(`_v3/${SLUG}_clips_malos.json`, JSON.stringify(malos, null, 1));
console.log(`clips ok ${ok} · descartados ${malos.length}`);
