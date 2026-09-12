// prune_broll_coagulos.mjs — deja en COAG_BROLL solo los clips que EXISTEN en disco y recalcula
// dur = (próximo clip existente).start - this.start (sin huecos). Idempotente.
import fs from "fs";
const TS = "src/_fed6/VideoEdit/coagulos_broll.ts";
const s = fs.readFileSync(TS, "utf8");
const i = s.indexOf("= [") + 2;
const arr = JSON.parse(s.slice(i, s.lastIndexOf("]") + 1));
const kept = arr.filter((b) => fs.existsSync("public/" + b.src));
const VEND = arr.length ? arr[arr.length - 1].start + arr[arr.length - 1].dur : 0;
for (let k = 0; k < kept.length; k++) {
  const next = k + 1 < kept.length ? kept[k + 1].start : VEND;
  kept[k].dur = +(next - kept[k].start).toFixed(2);
}
fs.writeFileSync(TS,
  `// AUTO-PODADO por scripts/prune_broll_coagulos.mjs — solo clips en disco, sin huecos.\n` +
  `export const COAG_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(kept)};\n`);
const gaps = kept.slice(1).map((k, i) => k.start - kept[i].start);
const avg = gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0;
console.log(`podado: ${arr.length} → ${kept.length} clips en disco · sep media ${avg.toFixed(2)}s · maxdur ${Math.max(...kept.map(k=>k.dur)).toFixed(1)}s`);
