// _fixdark_fcssenales.mjs — sube el brillo de las FOTOS casi negras del beatsheet.
// ⛔ Medido en el render de fcssenales: `blackdetect` marcó 13 tramos y 9 venían de FOTOS
// oscuras (escenas nocturnas de Modal/agnes), no de clips. Un plano que se sostiene 9-11 s
// en la zona Fish con luma <30 dispara el detector y se lee como pantalla negra.
// Acá se miden todas las imágenes del beatsheet y se re-exportan las oscuras con `eq`.
import fs from "fs";
import { spawnSync } from "child_process";

const SLUG = "fcssenales";
const beats = JSON.parse(fs.readFileSync(`beatsheet/${SLUG}.json`, "utf8")).beats;
const imgs = new Set();
const add = (v) => { if (typeof v === "string" && v.startsWith("img/")) imgs.add(v); };
for (const b of beats) {
  ["src", "image", "cover", "leftImage", "rightImage", "leftImg", "rightImg", "before", "after", "bed"].forEach((k) => add(b[k]));
  for (const arr of ["cards", "plates", "items"]) for (const it of b[arr] || []) if (it && typeof it === "object") add(it.image);
}
const luma = (p) => {
  const r = spawnSync("ffmpeg", ["-v", "error", "-i", p, "-vf", "signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-", "-frames:v", "1", "-f", "null", "-"], { encoding: "utf8" });
  const m = ((r.stdout || "") + (r.stderr || "")).match(/YAVG=([0-9.]+)/);
  return m ? parseFloat(m[1]) : -1;
};

const UMBRAL = 34;       // por debajo de esto el plano largo se lee como negro
let n = 0, fixed = [];
for (const rel of [...imgs].sort()) {
  const p = "public/" + rel;
  if (!fs.existsSync(p)) continue;
  const y = luma(p);
  if (y < 0 || y >= UMBRAL) { n++; continue; }
  // levantar brillo + un poco de contraste, preservando el color
  const tmp = p.replace(/\.png$/i, "_lift.png");
  const boost = Math.min(0.34, (UMBRAL - y) / 150 + 0.10);
  const r = spawnSync("ffmpeg", ["-v", "error", "-y", "-i", p, "-vf", `eq=brightness=${boost.toFixed(3)}:contrast=1.06:saturation=1.05`, tmp], { encoding: "utf8" });
  if (r.status === 0 && fs.existsSync(tmp)) {
    fs.renameSync(tmp, p);
    fixed.push([rel, y.toFixed(1), luma(p).toFixed(1)]);
  }
  n++;
}
console.log(`imágenes del beatsheet: ${imgs.size} · medidas ${n} · levantadas ${fixed.length}`);
for (const [f, a, b] of fixed) console.log(`  ${f}  ${a} → ${b}`);
fs.writeFileSync(`_fixdark_${SLUG}.json`, JSON.stringify(fixed, null, 1));
