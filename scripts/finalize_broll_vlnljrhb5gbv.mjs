// finalize_broll_vlnljrhb5gbv.mjs — toma el track ANCLADO (dense_prep, cada clip en su ms de narración,
// SIN repetir), lo poda a los clips que EXISTEN en disco, recalcula dur contiguo (sin huecos ni refs
// rotas) y mide clipDur de cada mp4 (así RawShot/Media loopea y NUNCA hay negro). Mantiene el sync.
import fs from "fs";
import { execSync } from "child_process";
const SLUG = "vlnljrhb5gbv";
const path = `src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`;
const txt = fs.readFileSync(path, "utf8");
const arr = JSON.parse(txt.slice(txt.indexOf("= [") + 2, txt.lastIndexOf("]") + 1));
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const CW = caps.words || caps;
const VEND = ((CW[CW.length - 1]?.endMs || 1370000) / 1000) + 2;
const durOf = (rel) => { try { return +(+execSync(`ffprobe -v error -select_streams v:0 -show_entries format=duration -of csv=p=0 "public/${rel}"`, { encoding: "utf8" }).trim()).toFixed(2) || 0; } catch { return 0; } };
const kept = arr.filter((b) => fs.existsSync("public/" + b.src)).sort((a, b) => a.start - b.start);
const DUR = {};
for (let i = 0; i < kept.length; i++) {
  const next = i + 1 < kept.length ? kept[i + 1].start : VEND;
  kept[i].dur = +(next - kept[i].start).toFixed(2);
  if (!(kept[i].src in DUR)) DUR[kept[i].src] = durOf(kept[i].src);
  kept[i].clipDur = DUR[kept[i].src] || undefined;
}
fs.writeFileSync(path,
  `// AUTO-GENERADO + FINALIZADO (finalize_broll_${SLUG}.mjs) — track anclado (sync), solo clips en disco, sin repetir, con clipDur.\n` +
  `export const FEDZ_BROLL: { name: string; src: string; start: number; dur: number; clipDur?: number; query: string }[] = ${JSON.stringify(kept)};\n`);
const dupes = kept.length - new Set(kept.map((k) => k.src)).size;
const maxDur = Math.max(...kept.map((k) => k.dur));
console.log(`finalize: ${arr.length} → ${kept.length} clips en disco · repetidos: ${dupes} · maxHold ${maxDur}s · sep media ${((VEND - kept[0].start) / kept.length).toFixed(2)}s`);
