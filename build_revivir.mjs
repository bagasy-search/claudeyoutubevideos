// build_revivir.mjs — Levi Lapp Jardín (ES) · "Mi Planta se Estaba Muriendo…".
// Clips-first modo AVATAR + peróxido. Por beat: clip REAL verificado > clip ANIMADO
// propio (vid/) > imagen bespoke. Pool de 74 Levi animados repartido para identidad.
// Componentes premium (BreakingReveal/StatSlam/StepTracker/PresenterTag/VerifiedStamp/
// NewsTicker/AlertWipe) anclados al ms. Fórmulas/libro como stills (texto nítido).
//   node build_revivir.mjs   → beatsheet/revivir.json + avatar_revivir.gen.ts
import fs from "fs";

const TOTAL = 1082.76;
const SLUG = "revivir", AVATAR = "revivir_opt.mp4";
const OPEN = 2.0;

const caps = JSON.parse(fs.readFileSync("public/captions_revivir_aligned.json", "utf8"));
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
const B = JSON.parse(fs.readFileSync("_v3/revivir_beats.json", "utf8"));
const matched = JSON.parse(fs.readFileSync("public/broll/clips_revivir_matched.json", "utf8"));
const marr = Array.isArray(matched) ? matched : Object.values(matched);
const verified = new Set(marr.filter((c) => (c._score || 0) >= 0.9).map((c) => c.beat || c.name));
const has = (p) => fs.existsSync("public/" + p);
const vidOf = (nm) => has(`vid/revivir_${nm}.mp4`) ? `vid/revivir_${nm}.mp4` : null;   // clip animado propio
const imgOf = (nm) => { for (const e of ["jpg", "png", "jpeg", "webp"]) if (has(`img/revivir_${nm}.${e}`)) return `img/revivir_${nm}.${e}`; return null; };
// pool de Levi animados (identidad) — los que NO son de un beat s_/mix
const leviPool = fs.readdirSync("public/vid").filter((f) => /^revivir_levi_\d+\.mp4$/.test(f)).map((f) => `vid/${f}`);
let poolIdx = 0;

// beats crudos contiguos
let beats = [];
for (let i = 0; i < B.length; i++) {
  const b = B[i]; const nm = b.name;
  const start = +(b.ms / 1000).toFixed(2);
  const next = i + 1 < B.length ? B[i + 1].ms / 1000 : TOTAL;
  const dur = +Math.max(0.6, next - start).toFixed(2);
  // prioridad: clip real verificado > clip animado propio > imagen
  let src = (verified.has(nm) && has(`broll/${nm}.mp4`)) ? `broll/${nm}.mp4` : (vidOf(nm) || imgOf(nm));
  if (!src) { console.warn("⚠ sin asset:", nm); continue; }
  beats.push({ id: nm, start, dur, kind: "raw", src, darken: 0, _static: !!imgOf(nm) && src === imgOf(nm) });
}
// PASADA DE IDENTIDAD: cada 3er beat que quedó IMAGEN estática (no fórmula/libro), meterle un Levi animado del pool
const isFormula = (nm) => /_fx_/.test(nm) || false;
let injected = 0;
for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  if (!b._static) continue;
  if (isFormula(b.id)) continue;        // dejar fórmulas/objetos como still (texto nítido)
  if (i % 3 !== 0) continue;
  if (poolIdx >= leviPool.length) break;
  b.src = leviPool[poolIdx++]; b._static = false; injected++;
}
const nClip = beats.filter((x) => x.src.startsWith("broll/")).length;
const nVid = beats.filter((x) => x.src.startsWith("vid/")).length;
console.log(`beats: ${beats.length} · clips reales: ${nClip} · animados: ${nVid} (pool inyectado: ${injected}) · imágenes: ${beats.length - nClip - nVid}`);

// ── COMPONENTES PREMIUM (anclados a frases reales) ──
const bgOf = (nm) => imgOf(nm) || (leviPool[0]);
const COMPONENTS = [
  // Placa de presentador al arrancar
  { t: atc("escucha este dato"), id: "cmp_pres", kind: "presenter", name: "LEVI LAPP", subtitle: "Huerta a la vieja usanza · 3ª generación", accent: "amber", dur: 4.5, overlay: true },
  // Stat slam 9 de cada 10
  { t: atc("nueve de cada diez"), id: "cmp_stat", kind: "statslam", eyebrow: "El dato que nadie te dice", figure: "9 de cada 10", caption: "mueren ahogadas, no de sed", accent: "danger", dur: 4.0, overlay: true },
  // Ticker de datos
  { t: atc("las raices respiran"), id: "cmp_ticker", kind: "ticker", label: "DATO", accent: "danger", dur: 7.0, overlay: true,
    items: ["Agua oxigenada al 3% — cuesta monedas", "1½ cucharada por litro para el rescate", "Se degrada con la luz: guardala en botella oscura", "Nunca al sol fuerte del mediodía"] },
  // Alert wipe antes de la trampa
  { t: atc("le das mas agua"), id: "cmp_alert", kind: "alertwipe", text: "ATENCIÓN", accent: "danger", dur: 1.1, overlay: true },
  // Breaking: el error revelado
  { t: atc("se esta ahogando"), id: "cmp_break1", kind: "breaking", accent: "danger", label: "AL DESCUBIERTO", badge: "AHORA",
    headline: "Estás ahogando tu planta con agua", ticker: "El error que comete casi todo el mundo", overlay: true, dur: 4.0 },
  // Step tracker en cada paso
  { t: atc("paso uno"), id: "cmp_step1", kind: "steptrack", step: 1, total: 3, label: "PASO", accent: "amber", dur: 6.0, overlay: true },
  { t: atc("paso dos"), id: "cmp_step2", kind: "steptrack", step: 2, total: 3, label: "PASO", accent: "amber", dur: 6.0, overlay: true },
  { t: atc("paso tres"), id: "cmp_step3", kind: "steptrack", step: 3, total: 3, label: "PASO", accent: "amber", dur: 6.0, overlay: true },
  // Verified stamp en la dosis
  { t: atc("una cucharada y media por litro"), id: "cmp_verif", kind: "verified", text: "LA DOSIS JUSTA", accent: "good", dur: 3.2, overlay: true },
  // Breaking: la señal (hoja nueva)
  { t: atc("una hoja nueva"), id: "cmp_break2", kind: "breaking", accent: "good", label: "LA SEÑAL", badge: "GANASTE",
    headline: "Una hoja nueva = va a vivir", ticker: "La señal de que la raíz ya se recuperó", overlay: true, dur: 4.2 },
  // Verified en el cierre anti-sistema
  { t: atc("la salvaste vos"), id: "cmp_verif2", kind: "verified", text: "GRATIS", accent: "good", dur: 3.0, overlay: true },
];

// insertar componentes: los overlay van encima; los no-overlay reemplazan beats
const avStartsPH = [];
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

// ── avatar full: apertura + cierre ──
const closeStart = atc("no te apures a rendirte") ?? (TOTAL - 40);
const OPEN_FULL = atc("los tres pasos exactos") ?? 7.0;  // avatar full hasta el fin del hook
const AV_FULL = [[0, OPEN_FULL], [closeStart, TOTAL]];
avStartsPH.push(...AV_FULL.map(([s]) => s));

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

// kphrases + overlays sobre clips, no sobre componentes
const KPHRASES = [
  kphrase("la tierra tambien se enferma", ["enferma"]),
  kphrase("rega menos y mejor", ["menos"]),
  kphrase("mueren de cariño mal dado", ["cariño"]),
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
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, clipsfirst: true, beats }, null, 2));

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
fs.writeFileSync("src/VideoEdit/avatar_revivir.gen.ts", `// avatar_revivir.gen.ts — GENERADO por build_revivir.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_REVIVIR = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);
console.log(`=== build_revivir === beats: ${beats.length} · componentes: ${nComp} · PiP: ${pip.length} · windows: ${windows.length}`);
