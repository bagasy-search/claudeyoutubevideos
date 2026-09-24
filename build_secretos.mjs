// build_secretos.mjs — Levi Lapp Jardín (ES) · "30 Secretos de Jardín Amish".
// Clips-first modo AVATAR. Cada beat YA tiene su asset resuelto por nombre:
//   clip real verificado (broll/<beat>.mp4)  ELSE  imagen bespoke (img/secretos_<beat>.jpg|png).
// Componentes "pizarra" (numcard por secreto + annotated/callout/checklist/bars/process/quote/
// gridreveal + diagram avatar+lámina) anclados al ms EXACTO (forced-aligned). Layouts variados:
// avatar full en hook/cierre, PiP rotando (incl. left/right = split), oculto en ráfagas.
//   node build_secretos.mjs   → beatsheet/secretos.json + avatar_secretos.gen.ts
import fs from "fs";

const TOTAL = 1056.42;                 // duración exacta del avatar (ffprobe)
const SLUG = "secretos", AVATAR = "secretos_opt.mp4";
const OPEN = 2.0;

// ── captions MILIMÉTRICAS (forced-aligned) ──
const caps = JSON.parse(fs.readFileSync("public/captions_secretos_aligned.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const W = caps.map((c) => ({ n: norm(c.text), ms: c.startMs }));
function at(phrase) {
  const t = norm(phrase).split(" ");
  for (let i = 0; i <= W.length - t.length; i++) {
    let ok = 1; for (let j = 0; j < t.length; j++) if (W[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return W[i].ms / 1000;
  }
  return null;
}
const atc = (p) => { const v = at(p); if (v == null) console.warn("⚠ anchor missing:", p); return v; };

// kphrase: karaoke sincronizado al ms por palabra (overlay)
const capW = caps.map((c) => ({ n: norm(c.text), raw: c.text.trim(), ms: c.startMs }));
let _kid = 0;
function kphrase(phrase, emph = []) {
  const tw = norm(phrase).split(" ");
  for (let i = 0; i <= capW.length - tw.length; i++) {
    let ok = 1; for (let j = 0; j < tw.length; j++) if (capW[i + j].n !== tw[j]) { ok = 0; break; }
    if (ok) {
      const span = capW.slice(i, i + tw.length);
      const t0 = span[0].ms;
      const eset = new Set(emph.map((e) => norm(e)));
      const words = span.map((w) => ({ t: w.raw, at: +((w.ms - t0) / 1000).toFixed(2), ...(eset.has(w.n) ? { hl: true } : {}) }));
      const dur = +(((span[span.length - 1].ms - t0) / 1000) + 1.7).toFixed(2);
      return { id: `kl${++_kid}`, start: +(t0 / 1000).toFixed(2), dur, kind: "kineticline", overlay: true, accent: "amber", words };
    }
  }
  console.warn("⚠ kphrase no encontrada:", phrase);
  return null;
}

// ── beats + assets (per-beat) ──
const B = JSON.parse(fs.readFileSync("_v3/secretos_beats.json", "utf8"));
const matched = JSON.parse(fs.readFileSync("public/broll/clips_secretos_matched.json", "utf8"));
const marr = Array.isArray(matched) ? matched : Object.values(matched);
const verified = new Set(marr.filter((c) => (c._score || 0) >= 0.9).map((c) => c.beat || c.name));
const have = (nm) => fs.existsSync(`public/broll/${nm}.mp4`);
const imgAsset = (nm) => {
  for (const e of ["jpg", "png", "jpeg", "webp"]) if (fs.existsSync(`public/img/secretos_${nm}.${e}`)) return `img/secretos_${nm}.${e}`;
  return null;
};
// fuente visual de un beat: clip verificado > su imagen bespoke
const assetFor = (nm) => (verified.has(nm) && have(nm)) ? `broll/${nm}.mp4` : imgAsset(nm);

// beats crudos contiguos, anclados al ms del aligned
const byName = Object.fromEntries(B.map((b) => [b.name, b]));
const order = B.map((b) => b.name);
let beats = [];
for (let i = 0; i < B.length; i++) {
  const b = B[i];
  const start = +(b.ms / 1000).toFixed(2);
  const next = i + 1 < B.length ? B[i + 1].ms / 1000 : TOTAL;
  const dur = +Math.max(0.6, next - start).toFixed(2);
  const src = assetFor(b.name);
  if (!src) { console.warn("⚠ sin asset:", b.name); continue; }
  beats.push({ id: b.name, start, dur, kind: "raw", src, darken: 0 });
}
const nClip = beats.filter((x) => x.src.startsWith("broll/")).length;
console.log(`beats crudos: ${beats.length} · clips reales: ${nClip} · imágenes: ${beats.length - nClip}`);

// ── 30 SECRETOS: numcard por secreto (número + nombre), fondo = asset del beat ──
const ORD = ["uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
  "once", "doce", "trece", "catorce", "quince", "dieciseis", "diecisiete", "dieciocho", "diecinueve", "veinte",
  "veintiuno", "veintidos", "veintitres", "veinticuatro", "veinticinco", "veintiseis", "veintisiete", "veintiocho", "veintinueve", "treinta"];
const NAMES = ["La moneda de cobre", "El agua de huevo", "Los posos de café", "Sembrar con la luna", "El té de estiércol",
  "La cáscara de huevo", "El té de consuelda", "La ortiga", "La ceniza de leña", "El pelo contra venados",
  "Albahaca con tomate", "Las caléndulas", "Trampa de cerveza", "Spray de leche", "Ajo y pimienta",
  "Cáscara de banana", "Clavos oxidados", "El abono verde", "El mantillo", "Guardar semillas",
  "Canela en los brotes", "Papas en un barril", "Lluvia en barriles", "Riego hondo", "Podar los chupones",
  "Cartón anti-maleza", "Rotación de cultivos", "Harina de hueso", "Gallinas y huerta", "Observa tus plantas"];
// beat de cada secreto (para el fondo del numcard) — el primer beat cuya frase arranca el secreto
const secretBeat = {};
for (const b of B) {
  const m = norm(b.phrase).match(/secreto numero (\w+)/);
  if (m) { const idx = ORD.indexOf(m[1]); if (idx >= 0 && !secretBeat[idx]) secretBeat[idx] = b.name; }
}
const SIGNCARDS = [];
for (let i = 0; i < 30; i++) {
  const t = atc(`secreto numero ${ORD[i]}`);
  if (t == null) continue;
  const bn = secretBeat[i];
  const card = { t, id: `cmp_sec_${i + 1}`, kind: "numcard", number: String(i + 1), name: NAMES[i], total: "30",
    accent: i === 29 ? "good" : "amber", dur: 2.6, eyebrow: i === 29 ? "El más importante" : "Secreto" };
  card.image = (bn && assetFor(bn)) || FALLBACK_IMG;
  SIGNCARDS.push(card);
}
console.log(`numcards de secretos: ${SIGNCARDS.length}/30`);

// ── COMPONENTES "pizarra" (annotated/callout/checklist/bars/process/splitlist/quote/gridreveal/diagram) ──
const ck = (text) => ({ text, state: "done" });
// imagen de fondo GARANTIZADA (nunca undefined): imagen bespoke del beat > fallback global
const _allImgs = fs.readdirSync("public/img").filter((f) => /^secretos_.*\.(png|jpe?g|webp)$/i.test(f));
const FALLBACK_IMG = _allImgs.length ? `img/${_allImgs[Math.floor(_allImgs.length / 2)]}` : null;
const pic = (...names) => { for (const nm of names) { const a = imgAsset(nm); if (a) return a; } return FALLBACK_IMG; };
const bgOf = pic;
const COMPONENTS = [
  // HOOK — el marco anti-químico (callout)
  { t: atc("porque alguien prefería"), id: "cmp_hook", kind: "callout", hue: "amber", accent: "danger",
    figure: "30", eyebrow: "Secretos que te ocultaron", caption: "de abuelo a nieto, sin químicos ni tienda", clipBg: bgOf("s_04") },
  // S2 — vaso de leche / calcio (callout)
  { t: atc("un quince por ciento mas de vigor"), id: "cmp_calcio", kind: "callout", hue: "amber", accent: "good",
    figure: "+15%", eyebrow: "Más vigor", caption: "el calcio del agua de huevo fortalece cada célula", clipBg: bgOf("s_16") },
  // S4 — luna: arriba vs abajo (splitlist)
  { t: atc("planta segun la luna"), id: "cmp_luna", kind: "splitlist", palette: "D", dur: 6.0,
    title: "Sembrar con la luna", items: ["Creciente → fruto arriba (tomate, maíz)", "Menguante → raíz abajo (papa, cebolla)", "Hasta 20% más cosecha"] },
  // S6 — cáscara de huevo, calcio (annotated)
  { t: atc("hazla polvo fino como harina"), id: "cmp_cascara", kind: "annotated", hue: "amber", eyebrow: "Cáscara de huevo",
    annotations: [{ kind: "circle", x: 0.5, y: 0.45, w: 0.24, label: "Polvo = calcio", color: "good" },
      { kind: "arrow", x: 0.72, y: 0.6, fromX: 0.92, fromY: 0.85, label: "Bordes = anti-babosa", color: "amber" }],
    bg: bgOf("s_40") || bgOf("s_39") },
  // S13 — trampa de cerveza (process)
  { t: atc("hundes un frasquito al ras del suelo"), id: "cmp_cerveza", kind: "process", hue: "amber", accent: "good", dur: 6.0,
    title: "Trampa de cerveza", eyebrow: "Adiós babosas",
    steps: [{ title: "Frasco al ras del suelo" }, { title: "Un dedo de cerveza" }, { title: "A la mañana, lleno" }] },
  // S20 — guardar semillas: comprada vs propia (bars)
  { t: atc("con hasta un noventa por ciento de exito"), id: "cmp_semillas", kind: "bars", hue: "amber", accent: "good", unit: "%", dur: 6.0,
    title: "Éxito de germinación", eyebrow: "Tus semillas vs compradas",
    bars: [{ label: "Semillas propias", value: 90, display: "90%", winner: true }, { label: "Compradas", value: 60, display: "60%", tone: "danger" }] },
  // S24 — riego hondo (splitlist cross)
  { t: atc("riega a fondo dos o tres veces por semana"), id: "cmp_riego", kind: "splitlist", palette: "D", cross: true, dur: 6.0,
    title: "Riego hondo, no diario", items: ["Poco y diario → raíz holgazana", "Hondo 2-3×/sem → raíz profunda", "Aguanta la sequía"] },
  // S27 — rotación (process)
  { t: atc("no siembres lo mismo en el mismo lugar"), id: "cmp_rotacion", kind: "process", hue: "amber", accent: "good", dur: 6.0,
    title: "Rotación de cultivos", eyebrow: "La tierra descansa",
    steps: [{ title: "Año 1: tomate" }, { title: "Año 2: fríjol (repone N)" }, { title: "Año 3: zanahoria" }] },
  // S29 — el círculo gallina-huerta (diagram avatar+lámina)
  { t: atc("este es el circulo entero"), id: "cmp_circulo", kind: "checklist", hue: "amber", accent: "good", dur: 6.0,
    title: "El círculo cerrado", eyebrow: "Nada se pierde",
    items: [ck("Restos → gallinas"), ck("Gallinas → huevos + abono"), ck("Abono → tierra"), ck("Tierra → más verdura")], bg: bgOf("s_188") },
  // CIERRE — recap de secretos (gridreveal)
  { t: atc("asi que ve"), id: "cmp_grid", kind: "gridreveal", dur: 7.0,
    title: "30 secretos · 0 químicos", subtitle: "La vieja escuela Amish",
    tiles: NAMES.slice(0, 12).map((n, i) => ({ number: String(i + 1), name: n })) },
  // CIERRE — la frase del abuelo (quote)
  { t: atc("yo no siembro para mi"), id: "cmp_quote", kind: "quote", hue: "amber", accent: "amber", fontSize: 76,
    text: "Yo no siembro para mí. *Siembro para ti.*", bg: bgOf("s_202") || bgOf("s_204") },
];

// ── insertar componentes (reemplazan beats que cubren) ──
const avStartsPH = [];   // se llena abajo con AV_FULL
function insertComps(list, placedC) {
  let nComp = 0;
  const overlays = [];
  for (const c of [...list].sort((a, b) => (a.t ?? 0) - (b.t ?? 0))) {
    if (c.t == null) continue;
    const { t, bg, clipBg, kind, overlay, ...rest } = c;
    if (overlay) { const ab = { id: c.id, start: +t.toFixed(2), dur: c.dur || 3.0, kind, overlay: true }; delete rest.id; delete rest.dur; Object.assign(ab, rest); overlays.push(ab); nComp++; continue; }
    let idx = -1;
    for (let i = 0; i < beats.length; i++) { if (beats[i].start <= t + 0.01) { if (!placedC.has(beats[i].id)) idx = i; } else break; }
    if (idx < 0) continue;
    const start = beats[idx].start;
    const D = c.dur || 3.0;
    const ab = { id: c.id, start, dur: D, kind }; delete rest.id; Object.assign(ab, rest);
    if (bg) ab.image = bg;
    if (clipBg) ab.image = clipBg;
    if (c.image && !clipBg && !bg) ab.image = c.image;
    for (const kk of Object.keys(ab)) if (ab[kk] === undefined) delete ab[kk];
    let rm = 1;
    while (idx + rm < beats.length && beats[idx + rm].start < start + D - 0.05 && !placedC.has(beats[idx + rm].id)) rm++;
    beats.splice(idx, rm, ab);
    placedC.add(c.id);
    const next = beats[idx + 1];
    const nextAv = avStartsPH.filter((s) => s > start + 0.01).sort((a, b) => a - b)[0] ?? TOTAL;
    ab.dur = +(Math.min(next ? next.start : TOTAL, nextAv, start + D + 1) - start).toFixed(2);
    nComp++;
  }
  return { nComp, overlays };
}

// ── avatar full: apertura + cierre emocional ──
const closeStart = atc("asi que ve") ?? (TOTAL - 60);
const AV_FULL = [[0, OPEN], [closeStart, TOTAL]];
avStartsPH.push(...AV_FULL.map(([s]) => s));

const placedC = new Set();
const r1 = insertComps(SIGNCARDS, placedC);
const r2 = insertComps(COMPONENTS, placedC);
const overlayComps = [...r1.overlays, ...r2.overlays];
const nComp = r1.nComp + r2.nComp;

// ── tiling: cero pantallas vacías ──
beats.sort((a, b) => a.start - b.start);
const avStarts = AV_FULL.map(([s]) => s);
for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
  const avAfter = avStarts.filter((s) => s > b.start + 1e-6).sort((x, y) => x - y)[0] ?? Infinity;
  let end = Math.min(nextStart, TOTAL); if (avAfter < end) end = avAfter;
  const OV = b.kind === "raw" ? 0.5 : 0;
  b.dur = +(Math.max(0.4, Math.min(end + OV, TOTAL) - b.start)).toFixed(2);
}

// ── kphrases (karaoke) + overlays sobre clips, nunca sobre componentes ──
const KPHRASES = [
  kphrase("no es magia hijo", ["magia"]),
  kphrase("el alimento mas poderoso y mas barato que existe", ["barato"]),
  kphrase("lo que mas te pica de niño es lo que mas te cuida de viejo", ["cuida"]),
  kphrase("es el que te hace libre", ["libre"]),
  kphrase("nada se pierde nada se compra", ["nada"]),
  kphrase("las plantas te hablan hijo", ["hablan"]),
].filter(Boolean);
{
  const comps = beats.filter((b) => !b.overlay && b.kind !== "raw");
  const overComp = (o) => comps.some((c) => o.start < c.start + c.dur - 0.2 && o.start + o.dur > c.start + 0.2);
  const all = [...KPHRASES, ...overlayComps].sort((a, b) => a.start - b.start);
  const kept = []; let dropped = 0;
  for (const o of all) {
    if (overComp(o) || kept.some((k) => o.start < k.start + k.dur && o.start + o.dur > k.start)) { dropped++; continue; }
    kept.push(o);
  }
  beats.push(...kept);
  console.log(`overlays: ${kept.length} (${dropped} descartados)`);
}

beats.sort((a, b) => a.start - b.start);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, clipsfirst: true, beats }, null, 2));

// ── ventanas de avatar: full apertura/cierre · PiP rotando (incl left/right = split) · resto hidden ──
const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const POS = ["cornerTR", "left", "cornerBL", "right", "cornerTL", "cornerBR"];
const pip = []; let k = 0;
const _bw = beats.filter((b) => !b.overlay && b.kind === "raw");
for (let i = 0; i < _bw.length; i++) {
  if (i % 4 === 2 && !inFull(_bw[i].start)) { pip.push([_bw[i].start, _bw[i].start + Math.min(_bw[i].dur, 6), POS[k % POS.length]]); k++; }
}
const modeAt = (t) => {
  if (t < OPEN - 1e-6) return "full";
  if (inFull(t)) return "full";
  const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
  return p ? p[2] : "hidden";
};
const pts = [...new Set([0, OPEN, ...AV_FULL.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = []; let cur = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync("src/VideoEdit/avatar_secretos.gen.ts", `// avatar_secretos.gen.ts — GENERADO por build_secretos.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_SECRETOS = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0);
console.log(`=== build_secretos ===`);
console.log(`beats: ${beats.length} · componentes: ${nComp} · overlays: ${overlayComps.length + KPHRASES.length}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP: ${pip.length} · windows: ${windows.length}`);
