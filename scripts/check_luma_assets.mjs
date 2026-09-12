// check_luma_assets.mjs — COMPUERTA TÉCNICA DE LUMINANCIA sobre los assets del PLAN.
//
//   node scripts/check_luma_assets.mjs <slug> [minYAVG=32]
//
// ⛔⛔ El juez de VISIÓN del pool aprueba por CONTENIDO y deja pasar purés grises y clips casi
//    negros: en `fedvet5` un `f5pool_boca_06` con YAVG medio 16 metió 1,63 s de PANTALLA NEGRA que
//    `blackdetect` cazó recién sobre el mp4 de entrega, con el farm ya gastado.
//    La compuerta de la Fase 6.5 existía sólo para el archivo Prelinger; acá aplica a TODO clip.
// Salida: _v3/<slug>_oscuros.json con los `clip` a descartar (el plan los manda a foto).
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const SLUG = process.argv[2];
const MIN = Number(process.argv[3] || 32);
if (!SLUG) { console.error("uso: node scripts/check_luma_assets.mjs <slug> [minYAVG=32]"); process.exit(2); }
const FF = process.env.HOME + "/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe";

const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^﻿/, ""));
const clips = [...new Set(plan.beats.filter((b) => b.tipo === "clip" || b.tipo === "clipslow").map((b) => b.clip))];
const imgs = [...new Set(plan.beats.filter((b) => b.tipo === "imagen").map((b) => `img/${b.imagen}.jpg`))];

const yavgDe = (rel, esVideo) => {
  // ⛔ signalstats/metadata=print escribe en STDERR: con execFileSync (que devuelve sólo stdout)
  //    la compuerta mide 0 frames y se lee como verde. Hay que juntar los dos.
  const r0 = spawnSync(FF, ["-v", "info", "-i", `public/${rel}`, "-an",
    "-vf", "scale=160:90,signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-f", "null", "-"],
    { encoding: "utf8", maxBuffer: 128 * 1024 * 1024 });
  const out = String(r0.stdout || "") + String(r0.stderr || "");
  const v = [...out.matchAll(/lavfi\.signalstats\.YAVG=([0-9.]+)/g)].map((m) => +m[1]);
  if (!v.length) return null;
  // ⛔⛔ EL PROMEDIO NO ES EL DEFECTO. Lo que `blackdetect` caza en el mp4 de entrega es un TRAMO
  //    de >=0,5 s casi negro DENTRO del clip; un clip con media 45 y medio segundo a 12 pasa el
  //    promedio y mete pantalla negra igual. Se mide la RACHA más larga por debajo del piso.
  let racha = 0, peor = 0;
  for (const y of v) { if (y < MIN) { racha++; peor = Math.max(peor, racha); } else racha = 0; }
  return { med: v.reduce((a, b) => a + b, 0) / v.length, max: Math.max(...v), n: v.length,
           rachaS: peor / 30 };
};

const oscuros = [];
let n = 0;
for (const c of clips) {
  const rel = `broll/${c}.mp4`;
  let r;
  try { r = yavgDe(rel, true); } catch { console.log(`  ⚠ no pude medir ${rel}`); continue; }
  n++;
  if (!r) { console.log(`  ⛔ ${rel}: 0 frames medidos (compuerta muda)`); process.exit(1); }
  // oscuro = el clip ENTERO por debajo del piso, o el pico también bajo (no hay nada que ver)
  // racha >= 0,4 s por debajo del piso = pantalla negra en el montaje (blackdetect pide 0,5 s)
  if (r.rachaS >= 0.4 || r.med < 18) { oscuros.push(c); console.log(`  ⛔ ${c}  racha oscura ${r.rachaS.toFixed(2)} s · YAVG medio ${r.med.toFixed(1)} · pico ${r.max.toFixed(1)}`); }
}
console.log(`clips medidos ${n} de ${clips.length} · oscuros ${oscuros.length} (piso ${MIN})`);
if (n < clips.length) { console.log("⛔ no medí todos: compuerta incompleta"); process.exit(1); }

// las fotos también, por si alguna salió a oscuras
const fotosOscuras = [];
for (const rel of imgs) {
  try {
    const r = yavgDe(rel, false);
    if (r && r.med < MIN) { fotosOscuras.push(rel); console.log(`  ⚠ FOTO oscura ${rel}  YAVG ${r.med.toFixed(1)}`); }
  } catch {}
}
console.log(`fotos medidas ${imgs.length} · oscuras ${fotosOscuras.length}`);

fs.writeFileSync(`_v3/${SLUG}_oscuros.json`, JSON.stringify(oscuros, null, 1));
if (oscuros.length) { console.log(`→ _v3/${SLUG}_oscuros.json (el plan los manda a FOTO)`); process.exit(1); }
console.log("✓ ningún clip por debajo del piso de luminancia");
