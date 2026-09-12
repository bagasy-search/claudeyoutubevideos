// broll_assemble_vgv2q0an50ik.mjs — arma el track continuo de b-roll para el Main.
// Cada momento (dense_thinned) = clip real broll/<name>.mp4 si existe y es válido; si no,
// imagen Modal img/<name>.png. Los que no tengan NINGUNO se saltean (dur al próximo válido).
// Escribe src/_fed6/VideoEdit/federer_vgv2q0an50ik_broll.ts (FEDZ_BROLL contiguo, sin huecos ni 404).
import fs from "fs";
import { execFileSync } from "child_process";
const SLUG = "vgv2q0an50ik";
const thin = JSON.parse(fs.readFileSync(`public/broll/dense_thinned_${SLUG}.json`, "utf8"));
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const CAPW = caps.words || caps;
const VEND = ((CAPW[CAPW.length - 1]?.startMs || 1370000) / 1000) + 2;

const okVid = (f) => { try { return /video/.test(execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=codec_type", "-of", "csv=p=0", f], { encoding: "utf8" })); } catch { return false; } };
const okImg = (f) => { try { return fs.existsSync(f) && fs.statSync(f).size > 4096; } catch { return false; } };

let kept = [], clips = 0, imgs = 0, dropped = 0;
for (const k of thin) {
  const mp4 = `public/broll/${k.name}.mp4`;
  const png = `public/img/${k.name}.png`;
  let src = null;
  if (fs.existsSync(mp4) && fs.statSync(mp4).size > 8192 && okVid(mp4)) { src = `broll/${k.name}.mp4`; clips++; }
  else if (okImg(png)) { src = `img/${k.name}.png`; imgs++; }
  else { dropped++; continue; }
  kept.push({ name: k.name, src, t: k.t, query: k.query });
}
const broll = kept.map((k, i) => ({
  name: k.name, src: k.src, start: k.t,
  dur: +(((i + 1 < kept.length ? kept[i + 1].t : VEND) - k.t)).toFixed(2), query: k.query,
}));
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`,
  `// AUTO-GENERADO por scripts/broll_assemble_${SLUG}.mjs — b-roll continuo (clip real o imagen Modal).\n` +
  `export const FEDZ_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(broll)};\n`);
console.log(`b-roll ensamblado: ${kept.length}/${thin.length} momentos · clips reales ${clips} · imágenes ${imgs} · descartados ${dropped}`);
