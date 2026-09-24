// ⛔ DEPRECADO (jul 2026): este script es del pipeline v3 VIEJO de la raíz. Usar la
// carpeta match_v3/ (lib+2_search_mosaics+split_judge+3_assemble+4_stills+5_apply_verdicts),
// que tiene los fixes de geometría por fragmento, filtro duro pre-juez, blocklist y
// verificación obligatoria. Este archivo queda solo por compatibilidad con corridas viejas.
console.error('⛔ DEPRECADO: usá la carpeta match_v3/ (ver match_v3/README.md). Este script raíz tiene bugs ya corregidos allá.');
// match_v3_probe.mjs — BANCO DE PRUEBAS para afinar el matcheo "editado a mano".
// Dada una lista chica de beats {name, desc, queries[]}, para cada uno:
//   1) busca candidatos con la YouTube Data API (reusa la lógica de match_sb),
//   2) baja el STORYBOARD (mosaico de miniaturas = hoja de contactos del video),
//   3) guarda cada mosaico como PNG etiquetado con id + geometría (cols/rows/interval),
//      para que un HUMANO/VLM lo mire y elija el mejor video + el tile/segundo exacto.
// NO decide con CLIP: la decisión la toma quien mira los mosaicos (el objetivo es calibrar).
//
// Uso: node match_v3_probe.mjs <beatsJson> <outDir> [candsPorBeat=4] [fragsPorCand=2]
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

// ── .env (YT_API_KEY, YT_API_KEY2..) ──
try {
  for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
} catch {}
const YT_API_KEYS = [process.env.YT_API_KEY, process.env.YT_API_KEY2, process.env.YT_API_KEY3, process.env.YT_API_KEY4]
  .map((k) => (k || "").trim()).filter(Boolean);
const YTDLP = process.env.YTDLP || "yt-dlp";
const FF = process.env.FFMPEG || "ffmpeg";

const [beatsArg, outArg, candsArg, fragsArg] = process.argv.slice(2);
if (!beatsArg || !outArg) { console.error("Uso: node match_v3_probe.mjs <beatsJson> <outDir> [cands=4] [frags=2]"); process.exit(1); }
const beats = JSON.parse(fs.readFileSync(beatsArg, "utf8").replace(/^﻿/, ""));
const NCAND = +(candsArg || 4);
const NFRAG = +(fragsArg || 2);
fs.mkdirSync(outArg, { recursive: true });
const TMP = "_v3probe"; fs.rmSync(TMP, { recursive: true, force: true }); fs.mkdirSync(TMP);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = (b, s) => b + Math.floor(Math.random() * s);
let keyPtr = 0;
const apiGet = async (buildUrl, ctx) => {
  for (let attempt = 0; attempt < 4; attempt++) {
    const key = YT_API_KEYS[keyPtr % YT_API_KEYS.length]; keyPtr++;
    if (!key) return null;
    try {
      await sleep(jitter(120, 200));
      const res = await fetch(buildUrl(key), { signal: AbortSignal.timeout(30000) });
      const j = await res.json().catch(() => ({}));
      if (!j.error) return j;
      const reason = j.error.errors?.[0]?.reason || j.error.code;
      if (reason === "quotaExceeded") { console.error(`  quota agotada key …${key.slice(-4)}`); continue; }
      if (res.status === 429) { await sleep(jitter(1000 * 2 ** attempt, 400)); continue; }
      console.error(`  API err ${res.status} ${reason}`); return null;
    } catch (e) { await sleep(jitter(1000 * 2 ** attempt, 400)); }
  }
  return null;
};
const apiSearch = async (q) => {
  const j = await apiGet((k) => `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=15`
    + `&relevanceLanguage=es&q=${encodeURIComponent(q)}&key=${k}`, `search "${q}"`);
  return (j?.items || []).map((it) => ({ id: it.id?.videoId, title: it.snippet?.title || "" })).filter((r) => r.id);
};

// storyboard metadata via yt-dlp -J (local: sí anda)
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
for (const b of beats) {
  const { name, desc = "", queries = [] } = b;
  console.log(`\n=== ${name} ===  "${desc}"`);
  // buscar candidatos: unir resultados de todas las queries, dedup, tope NCAND
  const seen = new Map();
  for (const q of queries) {
    const rows = await apiSearch(q);
    console.log(`  q="${q}" → ${rows.length} cands`);
    for (const r of rows) if (!seen.has(r.id)) seen.set(r.id, r);
    if (seen.size >= NCAND * 3) break;
  }
  const cands = [...seen.values()].slice(0, NCAND);
  const beatOut = { desc, queries, candidates: [] };
  let ci = 0;
  for (const cand of cands) {
    ci++;
    const info = ytInfo(cand.id);
    if (!info) { console.log(`  c${ci} ${cand.id}: sin -J`); continue; }
    const sb = pickStoryboard(info);
    const duration = info.duration || 0;
    if (!sb || !duration) { console.log(`  c${ci} ${cand.id}: sin storyboard`); continue; }
    const totalTiles = sb.columns * sb.rows * sb.fragments.length;
    const interval = duration / totalTiles;
    // bajar hasta NFRAG fragmentos (mosaicos)
    const savedFrags = [];
    for (let fi = 0; fi < Math.min(NFRAG, sb.fragments.length); fi++) {
      const dest = path.join(outArg, `${name}__c${ci}__${cand.id}__f${fi}__c${sb.columns}r${sb.rows}_int${interval.toFixed(1)}_base${fi * sb.columns * sb.rows}.png`);
      if (curl(sb.fragments[fi].url, dest)) savedFrags.push(path.basename(dest));
    }
    console.log(`  c${ci} ${cand.id}: ${sb.columns}x${sb.rows}/frag, ${sb.fragments.length} frags, dur ${duration}s, int ${interval.toFixed(1)}s → ${savedFrags.length} mosaicos | ${cand.title.slice(0, 55)}`);
    beatOut.candidates.push({ id: cand.id, title: cand.title, cols: sb.columns, rows: sb.rows, interval: +interval.toFixed(2), duration, frags: savedFrags });
  }
  summary[name] = beatOut;
}
fs.writeFileSync(path.join(outArg, "_probe.json"), JSON.stringify(summary, null, 2));
fs.rmSync(TMP, { recursive: true, force: true });
console.log(`\n→ ${path.join(outArg, "_probe.json")} + mosaicos en ${outArg}`);
console.log(`Para el timestamp de un tile: mirá el mosaico (grilla cols×rows, row-major desde base).`);
console.log(`  ts = (base + fila*cols + col + 0.5) × interval  [todo en el nombre del archivo]`);
