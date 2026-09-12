// broll_finalize_vs9t3drvl5q6.mjs — tras fetchstock: valida cada clip (existe, >8KB, ffprobe OK),
// re-encoda los válidos a 720p mudo (tarball liviano) y REESCRIBE federer_vs9t3drvl5q6_broll.ts
// SOLO con los clips que existen (dur = hueco hasta el próximo válido). Evita 404 y crash por vacío.
import fs from "fs";
import { execFileSync } from "child_process";
const SLUG = "vs9t3drvl5q6";
const DIR = "public/broll";
const thinned = JSON.parse(fs.readFileSync(`${DIR}/dense_thinned_${SLUG}.json`, "utf8"));
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const CAPW = caps.words || caps;
const VEND = ((CAPW[CAPW.length - 1]?.startMs || 1370000) / 1000) + 2;

const probeOk = (f) => {
  try {
    const out = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=codec_type", "-of", "csv=p=0", f], { encoding: "utf8" });
    return /video/.test(out);
  } catch { return false; }
};

let kept = [], dropped = 0, reenc = 0;
for (const k of thinned) {
  const src = `${DIR}/${k.name}.mp4`;
  if (!fs.existsSync(src) || fs.statSync(src).size < 8192 || !probeOk(src)) { dropped++; try { if (fs.existsSync(src)) fs.rmSync(src); } catch {} continue; }
  // re-encode 720p mudo
  const tmp = `${DIR}/${k.name}_720.mp4`;
  try {
    execFileSync("ffmpeg", ["-y", "-i", src, "-an", "-vf", "scale=1280:-2", "-c:v", "libx264", "-preset", "veryfast", "-crf", "28", "-pix_fmt", "yuv420p", "-movflags", "+faststart", tmp], { stdio: "ignore" });
    if (fs.existsSync(tmp) && fs.statSync(tmp).size > 8192) { fs.rmSync(src); fs.renameSync(tmp, src); reenc++; }
    else { try { fs.rmSync(tmp); } catch {} }
  } catch { try { if (fs.existsSync(tmp)) fs.rmSync(tmp); } catch {} }
  kept.push(k);
}

const broll = kept.map((k, i) => ({
  name: k.name, src: `broll/${k.name}.mp4`,
  start: k.t, dur: +(((i + 1 < kept.length ? kept[i + 1].t : VEND) - k.t)).toFixed(2), query: k.query,
}));
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`,
  `// AUTO-GENERADO por scripts/broll_finalize_${SLUG}.mjs — b-roll denso 720p (solo clips existentes).\n` +
  `export const FEDZ_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(broll)};\n`);
console.log(`b-roll: ${thinned.length} pedidos → ${kept.length} válidos (720p ${reenc}) · descartados ${dropped}`);
