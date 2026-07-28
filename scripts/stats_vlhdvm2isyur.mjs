// stats_vlhdvm2isyur.mjs — lee los .ts generados, calcula TOTAL_FRAMES y reporta densidad.
import fs from "fs";
const rd = (f) => {
  const s = fs.readFileSync(f, "utf8");
  const a = s.indexOf("= [") + 2;
  const b = s.lastIndexOf("]") + 1;
  return JSON.parse(s.slice(a, b));
};
const B = rd("src/_fed6/VideoEdit/federer_vlhdvm2isyur_beats.ts");
const R = rd("src/_fed6/VideoEdit/federer_vlhdvm2isyur_broll.ts");
const end =
  Math.max(Math.max(...B.map((x) => x.start + x.dur)), R.length ? R[R.length - 1].start + R[R.length - 1].dur : 0) + 1.2;
const fr = Math.round(end * 30);
fs.writeFileSync("public/_frames_vlhdvm2isyur.txt", String(fr));

console.log(`beats ${B.length} · broll ${R.length}`);
console.log(`VIDEO_END ${end.toFixed(2)}s (${(end / 60).toFixed(1)} min) · TOTAL_FRAMES ${fr}`);

// referencias de b-roll: todas tienen que ir bajo broll/vlhdvm2isyur/
const bad = R.filter((x) => !x.src.startsWith("broll/vlhdvm2isyur/"));
console.log(`refs b-roll aisladas: ${R.length - bad.length}/${R.length}${bad.length ? " ⚠ " + bad[0].src : ""}`);

// bloques de 5 min sin componentes
const comps = B.filter((b) => b.kind !== "talk");
for (let t = 0; t < end; t += 300) {
  const n = comps.filter((c) => c.start >= t && c.start < t + 300).length;
  const nb = R.filter((c) => c.start >= t && c.start < t + 300).length;
  console.log(`  bloque ${(t / 60).toFixed(0)}-${Math.min(end, t + 300) / 60 | 0} min: ${n} componentes · ${nb} clips`);
}
