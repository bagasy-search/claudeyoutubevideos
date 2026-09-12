// densify_broll_vlnljrhb5gbv.mjs — la poda dejó 130 clips con spans enormes (hasta 74s) sin beats
// encima → cola negra / estático (los clips Pexels re-encodeados topean a 10s). Este script REPARTE
// los 130 clips EN DISCO en slots de ~4.5s a lo largo de TODO el video (en orden narrativo, evitando
// repetir el mismo clip en slots consecutivos). Reusa los MISMOS archivos → no hay que re-subir assets.
import fs from "fs";
import { execSync } from "child_process";
const SLUG = "vlnljrhb5gbv";
const STEP = 4.5;
const durOf = (rel) => {
  try { return +(+execSync(`ffprobe -v error -select_streams v:0 -show_entries format=duration -of csv=p=0 "public/${rel}"`, { encoding: "utf8" }).trim()).toFixed(2) || 0; }
  catch { return 0; }
};
const path = `src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`;
const txt = fs.readFileSync(path, "utf8");
const kept = JSON.parse(txt.slice(txt.indexOf("= [") + 2, txt.lastIndexOf("]") + 1))
  .filter((b) => fs.existsSync("public/" + b.src))
  .sort((a, b) => a.start - b.start);
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const CW = caps.words || caps;
const VEND = ((CW[CW.length - 1]?.endMs || 1370000) / 1000) + 2;
const t0 = kept[0].start;
const N = kept.length;
const DUR = {};
for (const k of kept) if (!(k.src in DUR)) DUR[k.src] = durOf(k.src);
const out = [];
let prev = -1, i = 0;
for (let t = t0; t < VEND - 0.2; t += STEP) {
  let idx = Math.min(N - 1, Math.round(((t - t0) / (VEND - t0)) * (N - 1)));
  if (idx === prev) idx = Math.min(N - 1, idx + 1);
  prev = idx;
  const next = Math.min(VEND, t + STEP);
  const src = kept[idx].src;
  out.push({ name: `bx_${SLUG}_${String(i).padStart(3, "0")}`, src, start: +t.toFixed(2), dur: +(next - t).toFixed(2), clipDur: DUR[src] || undefined, query: kept[idx].query });
  i++;
}
fs.writeFileSync(path,
  `// AUTO-GENERADO (densify_broll_${SLUG}.mjs) — 130 clips repartidos en slots de ~${STEP}s, sin negros ni spans largos.\n` +
  `export const FEDZ_BROLL: { name: string; src: string; start: number; dur: number; clipDur?: number; query: string }[] = ${JSON.stringify(out)};\n`);
const maxDur = Math.max(...out.map((o) => o.dur));
console.log(`densify: ${N} clips → ${out.length} slots · step ${STEP}s · maxDur ${maxDur}s · fin ${VEND.toFixed(1)}s`);
