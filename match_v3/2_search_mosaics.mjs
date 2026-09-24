// match_v3/2_search_mosaics.mjs — beats autorados → candidatos LIMPIOS + mosaicos de storyboard.
// Para cada beat:
//   1) enforceAnchor: toda query lleva el NOMBRE del sujeto (si falta, se antepone — regla #1)
//   2) busca (API multi-key, fallback ytsearch), junta filas de todas las queries
//   3) FILTRO DURO en código (antes solo prompt): blocklist persistente, título/canal
//      basura (shorts/compilaciones/talking-heads/vlogs), duración 60s–40min, live
//   4) rank léxico → top NCAND, baja NFRAG mosaicos con GEOMETRÍA REAL POR FRAGMENTO:
//      <beat>__c<rank>__<id>__f<frag>__c<COLS>r<ROWS>_int<INTERVAL>_fs<FRAGSTART>.png
//      ts de un tile = FRAGSTART + (fila*cols + col + 0.5) × INTERVAL   (todo en el nombre)
//   5) beats con <2 candidatos limpios → scarce:true (el assemble los manda a stock
//      si el juez no eligió nada; >40% scarce = tema flaco → conviene stock-first).
//
// Uso: node match_v3/2_search_mosaics.mjs <beatsAutorados.json> <outDir> [NCAND=6] [NFRAG=2]
//   --anchors "sujeto,sinonimo"  (o campo "anchor" por beat / "anchors" global en el JSON)
import fs from "fs";
import path from "path";
import { apiSearch, filterAndRank, apiDurations, ytInfo, pickStoryboard, sbGeometry, curl, searchStats, enforceAnchor, loadBlocklist } from "./lib.mjs";

const argv = process.argv.slice(2);
const anchorsArg = (argv.find((a) => a.startsWith("--anchors")) || "").split("=")[1]
  || (argv.includes("--anchors") ? argv[argv.indexOf("--anchors") + 1] : "");
const pos = argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--anchors");
const [beatsArg, outArg, ncArg, nfArg] = pos;
if (!beatsArg || !outArg) { console.error("Uso: node 2_search_mosaics.mjs <beats.json> <outDir> [NCAND=6] [NFRAG=2] [--anchors \"sujeto,...\"]"); process.exit(1); }
const NCAND = +(ncArg || 6), NFRAG = +(nfArg || 2);
const raw = JSON.parse(fs.readFileSync(beatsArg, "utf8").replace(/^﻿/, ""));
const beats = Array.isArray(raw) ? raw : raw.beats || [];
const globalAnchors = (anchorsArg || (Array.isArray(raw) ? "" : (raw.anchors || [])).toString())
  .split(",").map((s) => s.trim()).filter(Boolean);
fs.mkdirSync(outArg, { recursive: true });
const blocklist = loadBlocklist();

// IDEMPOTENTE: si ya hay un manifest previo con candidatos, no lo pisamos con vacío (un reintento
// rate-limiteado no debe borrar lo bueno). Reusamos entradas previas cuando la nueva corrida no trae nada.
const manifestPath = path.join(outArg, "_manifest.json");
const prevManifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};

const ytBeats = beats.filter((b) => (b.src || "youtube") === "youtube" && (b.queries || []).length);
console.log(`${beats.length} beats · ${ytBeats.length} a YouTube (resto stock/foto) · NCAND=${NCAND} NFRAG=${NFRAG}`
  + (globalAnchors.length ? ` · ancla global: ${globalAnchors.join("/")}` : ""));

// 1) buscar candidatos de cada beat (queries ancladas, corte temprano si ya hay de sobra)
const perBeat = {};
let anchorFixes = 0;
for (const b of ytBeats) {
  const anchors = [...(Array.isArray(b.anchor) ? b.anchor : b.anchor ? [b.anchor] : []), ...globalAnchors];
  const enforced = enforceAnchor(b.queries, anchors);
  anchorFixes += enforced.fixed;
  b.queries = enforced.queries;
  const rows = [];
  const qs = process.env.MAXQ ? b.queries.slice(0, +process.env.MAXQ) : b.queries;
  for (const q of qs) {
    const r = await apiSearch(q);
    if (r) rows.push(...r);
    if (rows.length >= NCAND * 5) break; // 1 search.list ya trae ~20 — no gastar cuota de más
  }
  perBeat[b.name] = rows;
}
if (anchorFixes) console.log(`⚓ ${anchorFixes} queries sin ancla de sujeto → ancla antepuesta`);

// 2) duraciones de todos los ids (batch, 1 unidad/50) — se usan para FILTRAR, no solo fallback
const allIds = [...new Set(Object.values(perBeat).flat().map((c) => c.id).filter(Boolean))];
const durMap = await apiDurations(allIds);

// 3) filtro duro + rank + bajar mosaicos por candidato
const manifest = {};
let scarceCount = 0;
for (const b of ytBeats) {
  const cands = filterAndRank(perBeat[b.name], b.queries, NCAND, durMap, blocklist);
  const d = cands._dropped || {};
  const droppedTxt = Object.entries(d).filter(([, v]) => v).map(([k, v]) => `${k}:${v}`).join(" ");
  const entry = { phrase: b.phrase, desc: b.desc, shot: b.shot || "", ms: b.ms, dur: b.dur, candidates: [] };
  let ci = 0;
  for (const cand of cands) {
    ci++;
    const info = ytInfo(cand.id);
    if (!info) { console.log(`    ${b.name} c${ci} ${cand.id}: sin -J`); continue; }
    const sb = pickStoryboard(info);
    const duration = info.duration || durMap.get(cand.id) || 0;
    if (!sb || !duration) { console.log(`    ${b.name} c${ci} ${cand.id}: sin storyboard`); continue; }
    const geo = sbGeometry(sb, duration);
    const frags = [];
    for (let fi = 0; fi < Math.min(NFRAG, geo.frags.length); fi++) {
      const g = geo.frags[fi];
      const fn = `${b.name}__c${ci}__${cand.id}__f${fi}__c${geo.cols}r${geo.rows}_int${g.interval.toFixed(2)}_fs${g.start.toFixed(1)}.png`;
      const dest = path.join(outArg, fn);
      if (fs.existsSync(dest) && fs.statSync(dest).size > 500) frags.push(fn);        // ya bajado → reusar
      else if (curl(sb.fragments[fi].url, dest)) frags.push(fn);
    }
    if (frags.length) entry.candidates.push({
      rank: ci, id: cand.id, title: cand.title, channel: cand.channel || "",
      cols: geo.cols, rows: geo.rows, duration, geo: geo.frags.slice(0, NFRAG), frags,
    });
  }
  entry.scarce = entry.candidates.length < 2;
  if (entry.scarce) scarceCount++;
  // si esta corrida no trajo candidatos pero había una previa buena, conservar la previa
  if (!entry.candidates.length && prevManifest[b.name]?.candidates?.length) {
    manifest[b.name] = prevManifest[b.name];
    console.log(`  ${b.name}: 0 nuevos → conservo manifest previo (${prevManifest[b.name].candidates.length} cands)`);
  } else {
    manifest[b.name] = entry;
    console.log(`  ${b.name}: ${entry.candidates.length} cands limpios${entry.scarce ? " ⚠ ESCASO" : ""}${droppedTxt ? `  (filtrados ${droppedTxt})` : ""}  «${(b.phrase || "").slice(0, 46)}»`);
  }
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
const scarcePct = ytBeats.length ? Math.round((scarceCount / ytBeats.length) * 100) : 0;
console.log(`\nqueries únicas (≈ búsquedas API): ${searchStats().uniqueQueries}`);
console.log(`beats escasos (<2 candidatos limpios): ${scarceCount}/${ytBeats.length} (${scarcePct}%)`);
if (scarcePct > 40) console.log(`⚠ TEMA FLACO en YouTube → conviene STOCK-FIRST: marcar más beats src:"stock" en la autoría y reservar YouTube para lo específico.`);
console.log(`→ ${manifestPath} + mosaicos en ${outArg}/`);
