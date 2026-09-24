// match_v3/4_stills.mjs — stills REALES de cada clip bajado + GATE TÉCNICO determinista.
// Cierra la brecha "el tile se veía bien" → "el clip real de 5s sirve":
//   1) ffprobe: clip truncado (<70% de la ventana), vertical (w<h), o <480p de alto
//      → techFail (rechazo automático, no gasta ojos del verificador)
//   2) 3 stills (inicio/medio/fin de la ventana) para el agente VERIFICADOR (visión)
//
// Corre DESPUÉS de fetch_clips (public/broll/<name>.mp4).
// Uso: node match_v3/4_stills.mjs <matched.json> <outDir> [brollDir=public/broll]
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { FF, probeMedia } from "./lib.mjs";

const [matchedArg, outArg, brollArg] = process.argv.slice(2);
if (!matchedArg || !outArg) { console.error("Uso: node 4_stills.mjs <matched.json> <outDir> [brollDir]"); process.exit(1); }
const BROLL = brollArg || "public/broll";
const clips = JSON.parse(fs.readFileSync(matchedArg, "utf8").replace(/^﻿/, ""));
fs.mkdirSync(outArg, { recursive: true });

const MIN_H = +(process.env.V3_MIN_HEIGHT || 480);

const grab = (src, t, dest) => {
  const r = spawnSync(FF, ["-y", "-hide_banner", "-loglevel", "error", "-ss", String(t), "-i", src, "-frames:v", "1", "-q:v", "3", dest], { encoding: "utf8", timeout: 30000 });
  return r.status === 0 && fs.existsSync(dest);
};

const index = {};
let ok = 0, miss = 0, tech = 0;
for (const c of clips) {
  const src = path.join(BROLL, `${c.name}.mp4`);
  if (!fs.existsSync(src)) { miss++; console.log(`  ✗ ${c.name}: no bajado`); index[c.name] = { desc: c.concept, techFail: "no bajado" }; continue; }
  const dur = c.dur || 6;
  // ── gate técnico ──
  const meta = probeMedia(src);
  let techFail = null;
  if (!meta) techFail = "ffprobe falló (archivo corrupto)";
  else if (meta.duration < dur * 0.7) techFail = `truncado ${meta.duration.toFixed(1)}s de ${dur}s`;
  else if (meta.width && meta.height && meta.width < meta.height) techFail = `vertical ${meta.width}x${meta.height}`;
  else if (meta.height && meta.height < MIN_H) techFail = `baja res ${meta.width}x${meta.height}`;
  if (techFail) {
    tech++;
    index[c.name] = { desc: c.concept, phrase: c.phrase || "", url: c.url, techFail };
    console.log(`  ⛔ ${c.name}: ${techFail}`);
    continue;
  }
  // ── stills para el verificador ──
  const usable = Math.min(dur, meta.duration || dur);
  const times = [Math.min(0.5, usable * 0.15), usable * 0.5, Math.max(usable - 0.5, usable * 0.85)];
  const stills = [];
  times.forEach((t, i) => { const fn = `${c.name}_s${i + 1}.jpg`; if (grab(src, t.toFixed(2), path.join(outArg, fn))) stills.push(fn); });
  if (stills.length) { index[c.name] = { desc: c.concept, phrase: c.phrase || "", shot: c.shot || "", url: c.url, stills }; ok++; }
  else { index[c.name] = { desc: c.concept, url: c.url, techFail: "no se pudieron sacar stills" }; tech++; }
}
fs.writeFileSync(path.join(outArg, "_stills.json"), JSON.stringify(index, null, 2));
console.log(`stills de ${ok} clips · ${tech} rechazo técnico automático · ${miss} sin bajar → ${outArg}/  + _stills.json`);
console.log(`Siguiente: agente VERIFICADOR (visión) mira los stills → verdicts.json → 5_apply_verdicts.mjs`);
console.log(`(los techFail se rechazan solos en 5_apply_verdicts, no hace falta que el agente los mire)`);
