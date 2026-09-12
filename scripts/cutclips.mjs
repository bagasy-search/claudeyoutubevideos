// cutclips.mjs — downloader ROBUSTO de los clips ya matcheados. Reemplaza a fetch_clips
// (que se frena a ~30). Receta probada jul 2026: Deno en PATH + SIN cookies + proxy vivo +
// ffmpeg COMPLETO de WinGet (el de Remotion crashea al cortar). Un clip por entrada, salta
// existentes válidos, rota SOLO proxies vivos, reintenta 3 proxies por clip, sigue ante error.
// Uso: node scripts/cutclips.mjs [clips_matched.json] [outDir]
import fs from "fs";
import path from "path";
import { spawnSync, execFileSync } from "child_process";

const LIST = process.argv[2] || "public/broll/clips_comidas_matched.json";
const OUT = process.argv[3] || "public/broll";
const YTDLP = path.join(process.cwd(), "bin", "yt-dlp.exe");
const FFDIR = process.env.FETCH_FFDIR || "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin";
const FFPROBE = path.join(FFDIR, "ffprobe.exe");
const MIN_H = +(process.env.CUT_MIN_H || 480);

// asegurar Deno en PATH del proceso (para el JS-challenge de yt-dlp)
const DENO = "C:/Users/bauti/.deno/bin";
if (!process.env.PATH.includes(".deno")) process.env.PATH = process.env.PATH + path.delimiter + DENO;

const clips = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));

// proxies: probar cuáles tunelan (descartar muertos)
let proxies = [];
try { proxies = fs.readFileSync("cookies/proxies.txt", "utf8").split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#")); } catch {}
const live = [];
for (const px of proxies) {
  try { const ip = execFileSync("curl", ["-s", "--proxy", px, "--max-time", "12", "https://api.ipify.org"], { encoding: "utf8" }).trim(); if (/\d+\.\d+\.\d+\.\d+/.test(ip)) live.push(px); } catch {}
}
console.log(`proxies vivos: ${live.length}/${proxies.length}`);
if (!live.length) { console.error("sin proxies vivos"); process.exit(1); }

const valid = (dest, wantDur) => {
  try {
    const out = execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,duration", "-of", "csv=p=0", dest], { encoding: "utf8" }).trim();
    const [w, h, d] = out.split(",");
    const W = +w, H = +h, D = +(d || 0);
    if (!W || !H) return "sin video";
    if (H > W) return `vertical ${W}x${H}`;
    if (H < MIN_H) return `baja ${W}x${H}`;
    if (D && D < Math.min(2, wantDur * 0.5)) return `corto ${D}s`;
    return null;
  } catch { return "ilegible"; }
};

let pi = 0;
const dl = (url, s, e, dest) => {
  for (let a = 0; a < 3; a++) {
    const px = live[pi++ % live.length];
    const r = spawnSync(YTDLP, [
      url, "--proxy", px,
      "--download-sections", `*${s}-${e}`, "--force-keyframes-at-cuts",
      "-f", `bv*[height<=1080][height>=${MIN_H}]+ba/b[height<=1080][height>=${MIN_H}]`,
      "--ffmpeg-location", FFDIR, "--merge-output-format", "mp4", "--no-playlist",
      "-o", dest, "--force-overwrites", "--no-playlist",
      "--retries", "2", "--fragment-retries", "2", "--socket-timeout", "20",
      "--quiet", "--no-warnings",
    ], { encoding: "utf8", timeout: 120000 });
    if (r.status === 0 && fs.existsSync(dest)) return null; // ok
  }
  return "descarga falló (3 proxies)";
};

let ok = 0, skip = 0, fail = 0, drop = 0;
for (const c of clips) {
  const { name, url, start, dur = 5 } = c;
  if (!name || !url || start == null) { continue; }
  const dest = path.join(OUT, `${name}.mp4`);
  if (fs.existsSync(dest) && !valid(dest, dur)) { skip++; continue; }
  const why = dl(url, start, +(start + dur).toFixed(1), dest);
  if (why) { fail++; process.stdout.write(`✗ ${name}: ${why}\n`); continue; }
  const vwhy = valid(dest, dur);
  if (vwhy) { fs.rmSync(dest, { force: true }); drop++; process.stdout.write(`✗ ${name}: bajó pero ${vwhy}\n`); continue; }
  ok++; process.stdout.write(`✓ ${name}\n`);
}
console.log(`\n=== ${ok} nuevos · ${skip} ya estaban · ${fail} fallo dl · ${drop} descartados (vertical/baja) · total en disco: ${fs.readdirSync(OUT).filter((f) => /^cc_.*\.mp4$/.test(f)).length} ===`);
