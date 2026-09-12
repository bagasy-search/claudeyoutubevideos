// prune_broll_vlnljrhb5gbv.mjs — poda federer_vlnljrhb5gbv_broll.ts a los clips que EXISTEN en disco
// (Pexels throttle deja algunos sin bajar) y recalcula dur = next.start - this.start para que no haya
// huecos ni referencias a mp4 inexistentes (que saldrían negros en el render).
import fs from "fs";
const SLUG = "vlnljrhb5gbv";
const path = `src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`;
const txt = fs.readFileSync(path, "utf8");
const arr = JSON.parse(txt.slice(txt.indexOf("= [") + 2, txt.lastIndexOf("]") + 1));
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const CW = caps.words || caps;
const VEND = ((CW[CW.length - 1]?.endMs || 1370000) / 1000) + 2;
const kept = arr.filter((b) => fs.existsSync("public/" + b.src));
kept.sort((a, b) => a.start - b.start);
for (let i = 0; i < kept.length; i++) {
  const next = i + 1 < kept.length ? kept[i + 1].start : VEND;
  kept[i].dur = +(next - kept[i].start).toFixed(2);
}
fs.writeFileSync(path,
  `// AUTO-GENERADO + PODADO (prune_broll_${SLUG}.mjs) — solo clips en disco, durs contiguas.\n` +
  `export const FEDZ_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(kept)};\n`);
const gaps = kept.slice(1).map((k, i) => k.start - kept[i].start);
const avg = gaps.reduce((a, b) => a + b, 0) / (gaps.length || 1);
console.log(`b-roll podado: ${arr.length} → ${kept.length} clips en disco · sep media ${avg.toFixed(2)}s · fin ${VEND.toFixed(1)}s`);
