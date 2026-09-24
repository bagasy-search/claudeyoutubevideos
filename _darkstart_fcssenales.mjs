// _darkstart_fcssenales.mjs — caza los clips que ARRANCAN en negro.
// ⛔ El promedio de luma no los ve: el clip puede promediar 80 y aun así abrir con 0.6 s
// de negro (fade-in del generador). Ese negro dispara `blackdetect` en el render final.
import fs from "fs";
import { spawnSync } from "child_process";
const DIR = "public/broll", SLUG = "fcssenales";
const files = fs.readdirSync(DIR).filter((f) => f.startsWith(SLUG + "_") && f.endsWith(".mp4"));
const y0 = (p) => {
  const r = spawnSync("ffmpeg", ["-v", "error", "-t", "0.6", "-i", p, "-vf", "signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-", "-f", "null", "-"], { encoding: "utf8" });
  const v = [...(((r.stdout || "") + (r.stderr || "")).matchAll(/YAVG=([0-9.]+)/g))].map((m) => parseFloat(m[1]));
  return v.length ? Math.min(...v) : -1;
};
const bad = [];
let n = 0;
for (const f of files) {
  const v = y0(`${DIR}/${f}`);
  if (v >= 0 && v < 30) bad.push(f.replace(SLUG + "_", "").replace(".mp4", ""));
  if (++n % 50 === 0) console.log(`  ${n}/${files.length}`);
}
const prev = fs.existsSync(`_${SLUG}_dark.json`) ? JSON.parse(fs.readFileSync(`_${SLUG}_dark.json`, "utf8")) : [];
const all = [...new Set([...prev, ...bad])];
fs.writeFileSync(`_${SLUG}_dark.json`, JSON.stringify(all));
console.log(`clips ${files.length} · arrancan oscuros ${bad.length} → descartados (los cubre su foto): ${bad.join(" ")}`);
