// ⛔ DEPRECADO (jul 2026): este script es del pipeline v3 VIEJO de la raíz. Usar la
// carpeta match_v3/ (lib+2_search_mosaics+split_judge+3_assemble+4_stills+5_apply_verdicts),
// que tiene los fixes de geometría por fragmento, filtro duro pre-juez, blocklist y
// verificación obligatoria. Este archivo queda solo por compatibilidad con corridas viejas.
console.error('⛔ DEPRECADO: usá la carpeta match_v3/ (ver match_v3/README.md). Este script raíz tiene bugs ya corregidos allá.');
// match_v3_dlsb.mjs — baja los MOSAICOS de storyboard de IDs YA conocidos (sin API/quota).
// Sirve para (a) el flujo search-local→score-farm (candidatos pre-buscados) y (b) testear
// el juez-VLM sin gastar cuota. Escribe el MISMO _probe.json + PNGs que match_v3_probe.mjs.
//
// Entrada: JSON { "<beat>": { "desc":"...", "ids":["id1","id2",...] }, ... }
//   (o ids como string único). Uso: node match_v3_dlsb.mjs <candsJson> <outDir> [frags=2]
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const [candsArg, outArg, fragsArg] = process.argv.slice(2);
if (!candsArg || !outArg) { console.error("Uso: node match_v3_dlsb.mjs <candsJson> <outDir> [frags=2]"); process.exit(1); }
const NFRAG = +(fragsArg || 2);
const YTDLP = process.env.YTDLP || "yt-dlp";
const cands = JSON.parse(fs.readFileSync(candsArg, "utf8").replace(/^﻿/, ""));
fs.mkdirSync(outArg, { recursive: true });

const ytInfo = (id) => {
  const r = spawnSync(YTDLP, [`https://youtu.be/${id}`, "-J", "--skip-download", "--no-warnings", "--socket-timeout", "30"],
    { encoding: "utf8", maxBuffer: 1 << 28, timeout: 60000, killSignal: "SIGKILL" });
  if (r.status !== 0 || !r.stdout) return null;
  try { return JSON.parse(r.stdout); } catch { return null; }
};
const pickStoryboard = (info) => {
  const sbs = (info.formats || []).filter((f) => String(f.format_id || "").startsWith("sb") && (f.fragments || []).length && f.columns && f.rows);
  if (!sbs.length) return null;
  sbs.sort((a, b) => (a.format_id === "sb0" ? -1 : b.format_id === "sb0" ? 1
    : (b.columns * b.rows * b.fragments.length) - (a.columns * a.rows * a.fragments.length)));
  return sbs[0];
};
const curl = (url, dest) => {
  const r = spawnSync("curl", ["-s", "-L", "--max-time", "30", url, "-o", dest], { encoding: "utf8", timeout: 40000 });
  return r.status === 0 && fs.existsSync(dest) && fs.statSync(dest).size > 500;
};

const summary = {};
for (const [name, spec] of Object.entries(cands)) {
  const desc = spec.desc || "";
  const ids = Array.isArray(spec.ids) ? spec.ids : (spec.id ? [spec.id] : (spec.ids ? [spec.ids] : []));
  console.log(`\n=== ${name} ===  "${desc}"  (${ids.length} ids)`);
  const beatOut = { desc, queries: spec.queries || [], candidates: [] };
  let ci = 0;
  for (const id of ids) {
    ci++;
    const info = ytInfo(id);
    if (!info) { console.log(`  c${ci} ${id}: sin -J`); continue; }
    const sb = pickStoryboard(info); const duration = info.duration || 0;
    if (!sb || !duration) { console.log(`  c${ci} ${id}: sin storyboard`); continue; }
    const totalTiles = sb.columns * sb.rows * sb.fragments.length;
    const interval = duration / totalTiles;
    const savedFrags = [];
    for (let fi = 0; fi < Math.min(NFRAG, sb.fragments.length); fi++) {
      const dest = path.join(outArg, `${name}__c${ci}__${id}__f${fi}__c${sb.columns}r${sb.rows}_int${interval.toFixed(1)}_base${fi * sb.columns * sb.rows}.png`);
      if (curl(sb.fragments[fi].url, dest)) savedFrags.push(path.basename(dest));
    }
    console.log(`  c${ci} ${id}: ${sb.columns}x${sb.rows}, ${sb.fragments.length} frags, dur ${duration}s, int ${interval.toFixed(1)}s → ${savedFrags.length} mosaicos | ${(info.title||'').slice(0,50)}`);
    beatOut.candidates.push({ id, title: (info.title || "").slice(0, 80), cols: sb.columns, rows: sb.rows, interval: +interval.toFixed(2), duration, frags: savedFrags });
  }
  summary[name] = beatOut;
}
fs.writeFileSync(path.join(outArg, "_probe.json"), JSON.stringify(summary, null, 2));
console.log(`\n→ ${path.join(outArg, "_probe.json")} + mosaicos en ${outArg}`);
