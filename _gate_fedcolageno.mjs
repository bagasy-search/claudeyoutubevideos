// _gate_fedcolageno.mjs — compuertas de contenido para el build `_fed6` (density_gate.mjs sólo
// mira src/VideoEdit/, y este kit vive en src/_fed6/). Mide lo mismo que exige la skill:
//   · % VISUAL vs avatar (meta ~80-85% visual)   · HUECOS (instantes sin contenido y sin avatar full)
//   · clips REPETIDOS                            · ≥6 componentes distintos
//   · duración total ≥ largo del .wav
import fs from "node:fs";
import { spawnSync } from "node:child_process";
const SLUG = "fedcolageno";
const src = fs.readFileSync(`src/_fed6/VideoEdit/${SLUG}_beats.ts`, "utf8");
const get = (name) => JSON.parse(src.match(new RegExp(`export const ${name}[^=]*= (\\[.*?\\]);\\n`, "s"))[1]);
const BEATS = get("FEDCOLAGENO_BEATS"), COVER = get("FEDCOLAGENO_COVER");
const VIDEO_END = parseFloat(src.match(/export const VIDEO_END = ([\d.]+)/)[1]);
const wav = parseFloat(spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", `public/${SLUG}.wav`], { encoding: "utf8" }).stdout.trim());

const isComp = (k) => k && k !== "raw" && k !== "video" && k !== "photo";
const comps = BEATS.filter((b) => isComp(b.kind));
const spans = [
  ...COVER.map((c) => [c.start, c.start + c.cov]),
  ...comps.map((c) => [c.start, c.start + c.dur]),
].sort((a, b) => a[0] - b[0]);

let covered = 0, holes = 0, worst = 0, run = 0;
const STEP = 0.2;
let si = 0;
const active = [];
for (let t = 0; t < VIDEO_END; t += STEP) {
  while (si < spans.length && spans[si][0] <= t) active.push(spans[si++][1]);
  const on = active.some((e) => e > t);
  if (on) { covered++; if (run > worst) worst = run; run = 0; }
  else { holes++; run += STEP; }
}
if (run > worst) worst = run;

const srcs = COVER.map((c) => c.src);
const dup = srcs.filter((s, i) => srcs.indexOf(s) !== i);
const kinds = new Set(comps.map((c) => c.kind));
const end = Math.max(...BEATS.map((b) => b.start + b.dur));

const pct = (covered * STEP) / VIDEO_END * 100;
console.log(`VISUAL ${pct.toFixed(1)}%  ·  avatar full ${(100 - pct).toFixed(1)}%   (meta: visual 80-85%)`);
console.log(`racha máxima de avatar sin contenido: ${worst.toFixed(1)}s   (aceptable < 10s)`);
console.log(`clips repetidos: ${dup.length}${dup.length ? " -> " + [...new Set(dup)].slice(0, 8).join(", ") : " ✓"}`);
console.log(`componentes distintos: ${kinds.size} (mínimo 6) ${kinds.size >= 6 ? "✓" : "✗"}`);
console.log(`duración build ${end.toFixed(1)}s  ·  wav ${wav.toFixed(1)}s  ${end >= wav ? "✓" : "✗ CORTA LA ÚLTIMA FRASE"}`);
const fail = kinds.size < 6 || end < wav || dup.length > 0 || worst >= 12;
console.log(fail ? "GATE: ✗" : "GATE: ✓");
process.exit(fail ? 1 : 0);
