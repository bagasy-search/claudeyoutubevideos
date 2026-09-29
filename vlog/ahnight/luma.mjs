// luma.mjs — compuerta de luminancia sobre TODO clip del plan de ahnight (archivo a_*, stock n_*, agnes).
// Mide YAVG cuadro a cuadro (signalstats escribe en STDERR → spawnSync con stderr) y marca oscuro si:
//   la media < 40, o hay una racha >= 0,4 s por debajo de 24. Falla (exit 2) si no midió algún clip.
// Salida: _v3/ahnight_oscuros.json (nombres de archivo; plan.mjs los excluye y re-elige)
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
const REPO = "D:/Proyectos/video2-wt/ahnight/";
const t = fs.readFileSync(REPO + "src/ah/plans/ahnight.ts", "utf8");
const plan = JSON.parse(t.slice(t.indexOf("= ") + 2, t.lastIndexOf(";")));
const vids = new Set();
const walk = (o) => { if (typeof o === "string" && /\.mp4$/.test(o)) vids.add(o); else if (o && typeof o === "object") Object.values(o).forEach(walk); };
walk(plan);
const prev = fs.existsSync(REPO + "_v3/ahnight_oscuros.json") ? JSON.parse(fs.readFileSync(REPO + "_v3/ahnight_oscuros.json", "utf8")) : [];
// las escenas pre-renderizadas (pre_*.mp4) son tarjetas de diseño, no b-roll a reemplazar: se miden aparte, nunca se excluyen
const out = new Set(prev.filter((n) => !n.startsWith("pre_")));
let medidos = 0, nuevos = 0;
for (const v of vids) {
  if (path.basename(v).startsWith("pre_")) continue;
  const f = REPO + "public/" + v;
  const r = spawnSync("ffmpeg", ["-v", "info", "-i", f, "-an", "-vf", "scale=160:90,signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 1 << 28 });
  const ys = [...(r.stderr + r.stdout).matchAll(/YAVG=([0-9.]+)/g)].map((m) => +m[1]);
  if (ys.length < 10) { console.log("⛔ NO MIDIÓ", v); continue; }
  medidos++;
  const mean = ys.reduce((a, b) => a + b, 0) / ys.length;
  let run = 0, maxRun = 0; for (const y of ys) { run = y < 24 ? run + 1 : 0; maxRun = Math.max(maxRun, run); }
  if (mean < 40 || maxRun >= 12) { const n = path.basename(v); if (!out.has(n)) nuevos++; out.add(n); console.log(`oscuro ${n} media ${mean.toFixed(0)} racha ${(maxRun / 30).toFixed(1)}s`); }
}
fs.writeFileSync(REPO + "_v3/ahnight_oscuros.json", JSON.stringify([...out], null, 1));
console.log(`medidos ${medidos}/${vids.size} · oscuros nuevos ${nuevos} · total ${out.size}`);
process.exit(medidos < vids.size ? 2 : nuevos ? 1 : 0);
