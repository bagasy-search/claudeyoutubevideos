// build_oidio.mjs — Levi Lapp Jardín (ES) · "Despertar Semillas Viejas con Agua Oxigenada".
// Clips-first modo AVATAR + peróxido. Por beat: clip REAL verificado > clip ANIMADO propio
// (vid/) > imagen bespoke. Pool de Levi animados repartido para identidad (si existe).
// Componentes premium anclados al ms. Diagramas/objetos como stills (texto nítido).
//   node build_oidio.mjs   → beatsheet/semillas.json + avatar_oidio.gen.ts
import fs from "fs";

const TOTAL = 1507.43;
const SLUG = "oidio", AVATAR = "oidio_opt.mp4";
const OPEN = 2.0;

const caps = JSON.parse(fs.readFileSync("public/captions_oidio_aligned.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const W = caps.map((c) => ({ n: norm(c.text), ms: c.startMs }));
function at(phrase) {
  const t = norm(phrase).split(" ");
  for (let i = 0; i <= W.length - t.length; i++) { let ok = 1; for (let j = 0; j < t.length; j++) if (W[i + j].n !== t[j]) { ok = 0; break; } if (ok) return W[i].ms / 1000; }
  return null;
}
const atc = (p) => { const v = at(p); if (v == null) console.warn("⚠ anchor missing:", p); return v; };
const capW = caps.map((c) => ({ n: norm(c.text), raw: c.text.trim(), ms: c.startMs }));
let _kid = 0;
function kphrase(phrase, emph = []) {
  const tw = norm(phrase).split(" ");
  for (let i = 0; i <= capW.length - tw.length; i++) { let ok = 1; for (let j = 0; j < tw.length; j++) if (capW[i + j].n !== tw[j]) { ok = 0; break; }
    if (ok) { const span = capW.slice(i, i + tw.length); const t0 = span[0].ms; const eset = new Set(emph.map((e) => norm(e)));
      const words = span.map((w) => ({ t: w.raw, at: +((w.ms - t0) / 1000).toFixed(2), ...(eset.has(w.n) ? { hl: true } : {}) }));
      const dur = +(((span[span.length - 1].ms - t0) / 1000) + 1.7).toFixed(2);
      return { id: `kl${++_kid}`, start: +(t0 / 1000).toFixed(2), dur, kind: "kineticline", overlay: true, accent: "amber", words }; } }
  console.warn("⚠ kphrase no encontrada:", phrase); return null;
}

// ── assets por beat ──
const B = JSON.parse(fs.readFileSync("_v3/oidio_beats.json", "utf8"));
const matchedPath = "public/broll/clips_oidio_matched.json";
const marr = fs.existsSync(matchedPath) ? (() => { const m = JSON.parse(fs.readFileSync(matchedPath, "utf8")); return Array.isArray(m) ? m : Object.values(m); })() : [];
const verified = new Set(marr.filter((c) => (c._score || 0) >= 0.9).map((c) => c.beat || c.name));
const has = (p) => fs.existsSync("public/" + p);
const vidOf = (nm) => has(`vid/oidio_${nm}.mp4`) ? `vid/oidio_${nm}.mp4` : null;   // clip animado propio
const imgExt = (base) => { for (const e of ["jpg", "png", "jpeg", "webp"]) if (has(`img/${base}.${e}`)) return `img/${base}.${e}`; return null; };
const imgOf = (nm) => imgExt(`oidio_${nm}`);
// secuencia de tomas: semillas_<nm>_a/_b/_c/... → [paths] (para partir el beat en sub-tomas dinámicas)
const seqOf = (nm) => { const out = []; for (const s of ["a", "b", "c", "d", "e"]) { const p = imgExt(`oidio_${nm}_${s}`); if (p) out.push(p); } return out; };
// pool de extras (recetas/diagramas/escenas caseras) para rellenar fallbacks
const extrasPool = fs.existsSync("public/img") ? fs.readdirSync("public/img").filter((f) => /^oidio_s_extra\d+(_[a-e])?\.(jpg|png|jpeg|webp)$/i.test(f)).map((f) => `img/${f}`) : [];
let extraIdx = 0;
// pool de Levi animados (identidad) — si existen
const leviPool = fs.existsSync("public/vid") ? fs.readdirSync("public/vid").filter((f) => /^oidio_levi_\d+\.mp4$/.test(f)).map((f) => `vid/${f}`) : [];
let poolIdx = 0;
const GLOBAL_IMG = imgOf("s_01") || "img/_avatar_ref_oidio.jpg";

// beats crudos contiguos
let beats = [];
for (let i = 0; i < B.length; i++) {
  const b = B[i]; const nm = b.name;
  const start = +(b.ms / 1000).toFixed(2);
  const next = i + 1 < B.length ? B[i + 1].ms / 1000 : TOTAL;
  const dur = +Math.max(0.6, next - start).toFixed(2);
  // prioridad: clip real verificado > clip animado propio > secuencia de tomas > imagen simple > extra > fallback global
  const isClip = verified.has(nm) && has(`broll/${nm}.mp4`);
  const seq = isClip ? [] : seqOf(nm);
  let src, isStatic = false, seqPaths = null;
  if (isClip) { src = `broll/${nm}.mp4`; }
  else if (vidOf(nm)) { src = vidOf(nm); }
  else if (seq.length >= 2) { seqPaths = seq; src = seq[0]; isStatic = true; }   // secuencia dinámica
  else if (seq.length === 1) { src = seq[0]; isStatic = true; }
  else if (imgOf(nm)) { src = imgOf(nm); isStatic = true; }
  else if (extrasPool.length && extraIdx < extrasPool.length) { src = extrasPool[extraIdx++]; isStatic = true; }
  else { src = GLOBAL_IMG; isStatic = true; }
  beats.push({ id: nm, start, dur, kind: "raw", src, darken: 0, _static: isStatic, _seq: seqPaths });
}
// PASADA DE IDENTIDAD: cada 3er beat que quedó IMAGEN estática (no fórmula/objeto), meterle un Levi animado del pool
const isFormula = (nm) => /_fx_/.test(nm);
let injected = 0;
for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  if (!b._static) continue;
  if (isFormula(b.id)) continue;
  if (i % 3 !== 0) continue;
  if (poolIdx >= leviPool.length) break;
  b.src = leviPool[poolIdx++]; b._static = false; injected++;
}
const nClip = beats.filter((x) => x.src.startsWith("broll/")).length;
const nVid = beats.filter((x) => x.src.startsWith("vid/")).length;
console.log(`beats: ${beats.length} · clips reales: ${nClip} · animados: ${nVid} (pool inyectado: ${injected}) · imágenes: ${beats.length - nClip - nVid}`);

// ── COMPONENTES PREMIUM (anclados a frases reales del guion) ──
const COMPONENTS = [
  { t: atc("soy levi"), id: "cmp_pres", kind: "presenter", name: "LEVI LAPP", subtitle: "Huerta a la vieja usanza · 3ª generación", accent: "amber", dur: 4.5, overlay: true },
  { t: atc("un hongo"), id: "cmp_break1", kind: "breaking", accent: "danger", label: "AL DESCUBIERTO", badge: "OJO",
    headline: "Ese polvo blanco está VIVO", ticker: "No es polvo: es un hongo comiéndose tu planta", overlay: true, dur: 4.2 },
  { t: atc("ya hay diez"), id: "cmp_stat", kind: "statslam", eyebrow: "Cómo se contagia", figure: "1 → 10", caption: "ves una hoja blanca, hay diez contagiadas", accent: "danger", dur: 4.0, overlay: true },
  { t: atc("la mezcla"), id: "cmp_ticker", kind: "ticker", label: "DATO", accent: "amber", dur: 7.0, overlay: true,
    items: ["Agua oxigenada al 3% — la de la farmacia, monedas", "6 cucharadas por litro de agua, ni una más", "Rociá las DOS caras de la hoja, que chorree", "Siempre temprano o al atardecer, nunca al sol del mediodía"] },
  { t: atc("paso uno"), id: "cmp_step1", kind: "steptrack", step: 1, total: 3, label: "PASO", accent: "amber", dur: 6.0, overlay: true },
  { t: atc("paso dos"), id: "cmp_step2", kind: "steptrack", step: 2, total: 3, label: "PASO", accent: "amber", dur: 6.0, overlay: true },
  { t: atc("paso tres"), id: "cmp_step3", kind: "steptrack", step: 3, total: 3, label: "PASO", accent: "amber", dur: 6.0, overlay: true },
  { t: atc("seis cucharadas"), id: "cmp_verif", kind: "verified", text: "6 CUCHARADAS · POR LITRO", accent: "good", dur: 3.2, overlay: true },
  { t: atc("nunca al sol"), id: "cmp_alert", kind: "alertwipe", text: "NUNCA AL SOL", accent: "danger", dur: 1.1, overlay: true },
  { t: atc("el error"), id: "cmp_break2", kind: "breaking", accent: "danger", label: "CUIDADO", badge: "EL ERROR",
    headline: "Doble dosis: quemás tu planta", ticker: "Más no es más fuerte contra el hongo, es contra tu planta", overlay: true, dur: 4.2 },
  { t: atc("nueve de cada diez"), id: "cmp_stat2", kind: "statslam", eyebrow: "No seas de estos", figure: "9 de 10", caption: "lo hace mal y dice que no sirve", accent: "danger", dur: 4.0, overlay: true },
];

const overlayComps = [];
let nComp = 0;
const placedC = new Set();
for (const c of [...COMPONENTS].sort((a, b) => (a.t ?? 0) - (b.t ?? 0))) {
  if (c.t == null) continue;
  const { t, kind, overlay, dur, ...rest } = c;
  if (overlay) { const ab = { id: c.id, start: +t.toFixed(2), dur: dur || 3.5, kind, overlay: true }; delete rest.id; Object.assign(ab, rest); for (const k of Object.keys(ab)) if (ab[k] === undefined) delete ab[k]; overlayComps.push(ab); nComp++; continue; }
  let idx = -1;
  for (let i = 0; i < beats.length; i++) { if (beats[i].start <= t + 0.01) { if (!placedC.has(beats[i].id)) idx = i; } else break; }
  if (idx < 0) continue;
  const start = beats[idx].start; const D = dur || 4.5;
  const ab = { id: c.id, start, dur: D, kind }; delete rest.id; Object.assign(ab, rest); for (const k of Object.keys(ab)) if (ab[k] === undefined) delete ab[k];
  let rm = 1; while (idx + rm < beats.length && beats[idx + rm].start < start + D - 0.05 && !placedC.has(beats[idx + rm].id)) rm++;
  beats.splice(idx, rm, ab); placedC.add(c.id); nComp++;
}

// ── avatar full: apertura (todo el hook) + cierre ──
const closeStart = atc("hace dos cosas por mi") ?? (TOTAL - 45);
const OPEN_FULL = atc("quedate hasta el final") ?? 8.0;  // avatar full hasta el fin del hook
const AV_FULL = [[0, OPEN_FULL], [closeStart, TOTAL]];

// tiling
beats.sort((a, b) => a.start - b.start);
const avStarts = AV_FULL.map(([s]) => s);
for (let i = 0; i < beats.length; i++) {
  const b = beats[i]; const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
  const avAfter = avStarts.filter((s) => s > b.start + 1e-6).sort((x, y) => x - y)[0] ?? Infinity;
  let end = Math.min(nextStart, TOTAL); if (avAfter < end) end = avAfter;
  const OV = b.kind === "raw" ? 0.5 : 0;
  b.dur = +(Math.max(0.4, Math.min(end + OV, TOTAL) - b.start)).toFixed(2);
}

// ── EXPANSIÓN DE SECUENCIAS: un beat con _seq [a,b,c] → N sub-beats consecutivos (video dinámico) ──
let seqExpanded = 0, subShots = 0;
{
  const out = [];
  for (const b of beats) {
    if (b.kind === "raw" && Array.isArray(b._seq) && b._seq.length >= 2 && b.dur >= 2.0) {
      const n = Math.min(b._seq.length, Math.max(2, Math.round(b.dur / 1.7)));  // ~1.7s por toma
      const paths = b._seq.slice(0, n);
      const each = +(b.dur / paths.length).toFixed(2);
      paths.forEach((p, k) => {
        out.push({ id: `${b.id}_${k}`, start: +(b.start + each * k).toFixed(2), dur: each, kind: "raw", src: p, darken: 0, kbPhase: k, trans: k > 0 ? 7 : undefined });
        subShots++;
      });
      seqExpanded++;
    } else {
      const { _seq, _static, ...clean } = b; out.push(clean);
    }
  }
  beats = out;
  beats.sort((a, b) => a.start - b.start);
  console.log(`secuencias expandidas: ${seqExpanded} beats → ${subShots} sub-tomas`);
}

// kphrases + overlays sobre clips, no sobre componentes
const KPHRASES = [
  kphrase("no es polvo", ["polvo"]),
  kphrase("seis cucharadas por litro", ["seis"]),
  kphrase("mas no es mejor", ["mas"]),
].filter(Boolean);
{
  const comps = beats.filter((b) => !b.overlay && b.kind !== "raw");
  const overComp = (o) => comps.some((c) => o.start < c.start + c.dur - 0.2 && o.start + o.dur > c.start + 0.2);
  const all = [...KPHRASES, ...overlayComps].sort((a, b) => a.start - b.start);
  const kept = []; let dropped = 0;
  for (const o of all) { if (overComp(o) || kept.some((k) => o.start < k.start + k.dur && o.start + o.dur > k.start && (k.kind !== "steptrack" && o.kind !== "steptrack"))) { dropped++; continue; } kept.push(o); }
  beats.push(...kept);
  console.log(`overlays: ${kept.length} (${dropped} descartados)`);
}

beats.sort((a, b) => a.start - b.start);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, clipsfirst: true, maxRawDur: 8, beats }, null, 2));

// avatar windows
const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const POS = ["cornerTR", "left", "cornerBL", "right", "cornerTL", "cornerBR"];
const pip = []; let k = 0;
const _bw = beats.filter((b) => !b.overlay && b.kind === "raw");
for (let i = 0; i < _bw.length; i++) { if (i % 4 === 2 && !inFull(_bw[i].start)) { pip.push([_bw[i].start, _bw[i].start + Math.min(_bw[i].dur, 6), POS[k % POS.length]]); k++; } }
const modeAt = (t) => { if (t < OPEN - 1e-6) return "full"; if (inFull(t)) return "full"; const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6); return p ? p[2] : "hidden"; };
const pts = [...new Set([0, OPEN, ...AV_FULL.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = []; let cur = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync("src/VideoEdit/avatar_oidio.gen.ts", `// avatar_oidio.gen.ts — GENERADO por build_oidio.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_OIDIO = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);
console.log(`=== build_oidio === beats: ${beats.length} · componentes: ${nComp} · PiP: ${pip.length} · windows: ${windows.length}`);
