// match_v3/3_assemble.mjs — elecciones del juez + beats → clips_<slug>_matched.json.
// Formato compatible con match_sb (name, concept, url, start, dur) para fetch_clips.
//
// VALIDA EN CÓDIGO lo que antes se confiaba al juez:
//   · pick.id debe estar entre los candidatos del beat en el manifest (VLM no puede alucinar ids)
//   · el ts se RECALCULA de la geometría real del manifest si el juez dio {frag,row,col}
//     (preferido; el ts "calculado a mano" por el juez queda solo como fallback)
//   · clamp anti-borde: ts ∈ [max(3, 2%·dur), dur − clip − max(3, 2%·dur)] → nunca cae
//     en el título quemado del arranque ni en la end-card "SUSCRIBITE"
//   · pick inválido NO desaparece en silencio: cae a _needstock (bug del pipeline viejo)
//
// El clip se baja con +MARGIN s de cola (start igual) → si el beat en el timeline quedó
// más largo que lo previsto, Media/RawShot tienen material para cubrirlo sin congelarse.
//
// _score sale 0.5 y _verified:false: el VERIFICADOR (4_stills + 5_apply_verdicts) es
// PASO OBLIGATORIO — recién él sube _score a 0.99. Si alguien saltea la verificación y
// corre stockfallback (umbral 0.85), todo lo no verificado se va a stock: quality-first.
//
// picks.json (agente-juez): { "<beat>": {id, frag, row, col, reason?} | {id, ts} | {src:"stock"|"photo"} | {skip:true} }
//
// Uso: node match_v3/3_assemble.mjs <beatsAutorados.json> <picks.json> <matchedOut.json> [manifest.json]
import fs from "fs";
import { tileTsFrag } from "./lib.mjs";

const [beatsArg, picksArg, outArg, manifestArg] = process.argv.slice(2);
if (!beatsArg || !picksArg || !outArg) { console.error("Uso: node 3_assemble.mjs <beats.json> <picks.json> <matched.json> [manifest.json]"); process.exit(1); }
const rd = (f) => JSON.parse(fs.readFileSync(f, "utf8").replace(/^﻿/, ""));
const rawBeats = rd(beatsArg);
const beats = Array.isArray(rawBeats) ? rawBeats : rawBeats.beats || [];
const picks = rd(picksArg);
const manifest = manifestArg && fs.existsSync(manifestArg) ? rd(manifestArg) : null;

const MARGIN = +(process.env.V3_FETCH_MARGIN || 2); // s extra de cola al bajar (anti-freeze)
const matched = [];
const needStock = [];   // beats a resolver por stock (cascada Pexels→Pixabay en stockfallback)
const needPhoto = [];   // beats a resolver por foto real (still o archivo)
let skipped = 0, invalid = 0, clamped = 0;

for (const b of beats) {
  const p = picks[b.name] || {};
  const toStock = (why) => needStock.push({ name: b.name, concept: b.desc || b.phrase, query: b.queries, dur: b.dur, why });
  if (b.src === "stock" || p.src === "stock") { toStock("autoria/juez → stock"); continue; }
  if (b.src === "photo" || p.src === "photo") { needPhoto.push({ name: b.name, concept: b.desc || b.phrase, dur: b.dur }); continue; }
  if (p.skip) { skipped++; continue; }
  if (!p.id) { toStock("juez sin elección"); continue; }

  // ── validar contra el manifest ──
  let cand = null;
  if (manifest) {
    cand = (manifest[b.name]?.candidates || []).find((c) => c.id === p.id) || null;
    if (!cand) { invalid++; toStock(`pick ${p.id} no está entre los candidatos`); continue; }
  }

  // ── ts: recalcular de la geometría (preferido) o tomar el del juez ──
  let ts = null;
  if (cand && p.frag != null && p.row != null && p.col != null) {
    const geo = { cols: cand.cols, frags: cand.geo || [] };
    if (geo.frags.length) ts = tileTsFrag(geo, +p.frag, +p.row, +p.col);
  }
  if (ts == null && p.ts != null) ts = +p.ts;
  if (ts == null) { invalid++; toStock("pick sin ts ni frag/row/col"); continue; }

  // ── clamp anti-borde (títulos quemados al inicio, end-cards al final) ──
  const D = cand?.duration || 0;
  if (D) {
    const edge = Math.max(3, D * 0.02);
    const lo = edge, hi = Math.max(lo, D - (b.dur || 6) - edge);
    const c0 = ts;
    ts = Math.min(Math.max(ts, lo), hi);
    if (ts !== c0) clamped++;
  }

  matched.push({
    name: b.name, concept: b.desc || b.phrase, url: `https://youtu.be/${p.id}`,
    start: Math.max(0, +ts.toFixed(1)),
    dur: +((b.dur || 6) + MARGIN).toFixed(1), // ventana de DESCARGA (con cola anti-freeze)
    _beatDur: b.dur || 6,                      // duración real del beat en el timeline
    _score: 0.5, _verified: false,             // ← sube a 0.99 SOLO tras 5_apply_verdicts
    _sb: true, _v3: true, shot: b.shot || "", ms: b.ms,
    _video: p.id, _tile: p.frag != null ? `f${p.frag}r${p.row}c${p.col}` : `ts${ts}`,
  });
}
fs.writeFileSync(outArg, JSON.stringify(matched, null, 2));
const stem = outArg.replace(/\.json$/, "");
if (needStock.length) fs.writeFileSync(`${stem}_needstock.json`, JSON.stringify(needStock, null, 2));
if (needPhoto.length) fs.writeFileSync(`${stem}_needphoto.json`, JSON.stringify(needPhoto, null, 2));
console.log(`${matched.length} clips YouTube → ${outArg}${manifest ? " (validados contra manifest)" : " ⚠ SIN manifest → sin validación de ids"}`);
console.log(`  stock: ${needStock.length}${needStock.length ? ` → ${stem}_needstock.json` : ""}  ·  foto: ${needPhoto.length}  ·  skip: ${skipped}  ·  picks inválidos→stock: ${invalid}  ·  ts clampeados: ${clamped}`);
console.log(`Siguiente: fetch_clips → match_v3/4_stills → agente VERIFICADOR → 5_apply_verdicts (OBLIGATORIO: sin él, stockfallback manda todo a stock).`);
