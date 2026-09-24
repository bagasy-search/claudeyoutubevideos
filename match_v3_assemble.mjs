// ⛔ DEPRECADO (jul 2026): este script es del pipeline v3 VIEJO de la raíz. Usar la
// carpeta match_v3/ (lib+2_search_mosaics+split_judge+3_assemble+4_stills+5_apply_verdicts),
// que tiene los fixes de geometría por fragmento, filtro duro pre-juez, blocklist y
// verificación obligatoria. Este archivo queda solo por compatibilidad con corridas viejas.
console.error('⛔ DEPRECADO: usá la carpeta match_v3/ (ver match_v3/README.md). Este script raíz tiene bugs ya corregidos allá.');
// match_v3_assemble.mjs — arma clips_<slug>_matched.json a partir de las decisiones del
// JUEZ-VLM (que miró los mosaicos de storyboard) + la geometría de _probe.json.
//
// El VLM devuelve, por beat: el video elegido (id) y el TILE (frag, row, col) que matchea
// la frase. Acá se calcula el segundo exacto con la geometría del storyboard:
//   base = frag * cols * rows ;  ts = (base + row*cols + col + 0.5) * interval
// Beats sin footage bueno → el VLM pone {src:"stock"|"photo"} → van a una lista aparte
// para stockfallback/foto (NO se fuerza un match malo — regla #5 de match_v3).
//
// Uso: node match_v3_assemble.mjs <slug> <probeDir> <picksJson> [durDefault=6]
//   picksJson: { "<beat>": {id,frag,row,col} | {src:"stock"} | {src:"photo"} , ... }
// Salida:
//   public/broll/clips_<slug>_matched.json   (name,url,start,dur,_v3,_video,_tile)
//   public/broll/_v3_<slug>_stock.json        (beats para stock/foto)
import fs from "fs";

const [slug, probeDir, picksArg, durArg] = process.argv.slice(2);
if (!slug || !probeDir || !picksArg) {
  console.error("Uso: node match_v3_assemble.mjs <slug> <probeDir> <picksJson> [durDefault=6]");
  process.exit(1);
}
const DUR = +(durArg || 6);
const probe = JSON.parse(fs.readFileSync(`${probeDir}/_probe.json`, "utf8"));
const picks = JSON.parse(fs.readFileSync(picksArg, "utf8").replace(/^﻿/, ""));

const matched = [];
const stock = [];
let ok = 0, stk = 0, miss = 0, bad = 0;

for (const [name, pick] of Object.entries(picks)) {
  const beat = probe[name];
  if (!pick || pick.src === "stock" || pick.src === "photo" || pick.src === "none") {
    stock.push({ name, desc: beat?.desc || "", src: pick?.src || "stock" });
    stk++;
    continue;
  }
  if (!beat) { console.warn(`⚠ ${name}: no está en _probe.json`); miss++; continue; }
  const cand = (beat.candidates || []).find((c) => c.id === pick.id);
  if (!cand) { console.warn(`⚠ ${name}: id ${pick.id} no está entre los candidatos`); bad++; continue; }
  const cols = cand.cols, rows = cand.rows, interval = cand.interval;
  const frag = +(pick.frag || 0), row = +(pick.row || 0), col = +(pick.col || 0);
  if (row < 0 || row >= rows || col < 0 || col >= cols) { console.warn(`⚠ ${name}: tile (${row},${col}) fuera de ${rows}x${cols}`); bad++; continue; }
  const base = frag * cols * rows;
  let ts = +(((base + row * cols + col + 0.5) * interval).toFixed(2));
  if (cand.duration && ts > cand.duration - 1) ts = Math.max(0, cand.duration - DUR);
  matched.push({
    name, url: `https://youtu.be/${pick.id}`, start: ts, dur: DUR,
    _v3: true, _video: pick.id, _tile: `f${frag}r${row}c${col}`, _title: cand.title,
  });
  ok++;
}

fs.writeFileSync(`public/broll/clips_${slug}_matched.json`, JSON.stringify(matched, null, 2));
fs.writeFileSync(`public/broll/_v3_${slug}_stock.json`, JSON.stringify(stock, null, 2));
console.log(`✓ clips: ${ok} → public/broll/clips_${slug}_matched.json`);
console.log(`  stock/foto: ${stk} → public/broll/_v3_${slug}_stock.json`);
if (miss || bad) console.log(`  ⚠ sin probe: ${miss} | pick inválido: ${bad}`);
console.log(`Siguiente: fetch_clips (proxies+Deno) sobre el matched.json + stockfallback sobre el _stock.json`);
