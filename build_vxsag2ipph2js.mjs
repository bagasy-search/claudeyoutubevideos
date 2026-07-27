// build_vxsag2ipph2js.mjs — "No tires el microondas viejo" (The Free Builder / Constructor Libre)
// Consume el plan de los 8 DIRECTORES (_v3/dir/plan_*.json) + los momentos anclados al ms de
// Whisper (_v3/vxsag2ipph2js_clipbeats.json) y emite:
//   beatsheet/vxsag2ipph2js.json         → node beatsheet.mjs beatsheet/vxsag2ipph2js.json
//   src/VideoEdit/avatar_vxsag2ipph2js.gen.ts
//   public/img/prompts_vxsag2ipph2js.json  (lista para gen_gptimage.mjs)
//   public/broll/shots_vxsag2ipph2js.json  (lista para fetchstock.mjs)
import fs from "fs";

const SLUG = "vxsag2ipph2js";
const AVATAR = `${SLUG}_opt.mp4`;

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
const moments = JSON.parse(fs.readFileSync(`_v3/${SLUG}_clipbeats.json`, "utf8"));
const TOTAL = +(caps[caps.length - 1].endMs / 1000 + 1.5).toFixed(2);

// ── plan de los directores ────────────────────────────────────────────────────
const plan = new Map();
for (let k = 0; k < 8; k++) {
  const f = `_v3/dir/plan_${k}.json`;
  if (!fs.existsSync(f)) { console.warn(`⚠ falta ${f}`); continue; }
  const arr = JSON.parse(fs.readFileSync(f, "utf8").replace(/^﻿/, ""));
  for (const e of arr) plan.set(e.idx, e);
}
console.log(`plan: ${plan.size}/${moments.length} momentos dirigidos`);

// ── clips RECHAZADOS por el auditor visual → pasan a imagen generada a medida ──
const rechazados = fs.existsSync(`_v3/${SLUG}_clips_rechazados.json`)
  ? new Set(JSON.parse(fs.readFileSync(`_v3/${SLUG}_clips_rechazados.json`, "utf8").replace(/^﻿/, ""))) : new Set();
const promptsFix = fs.existsSync("_v3/dir/prompts_reemplazo.json")
  ? Object.fromEntries(JSON.parse(fs.readFileSync("_v3/dir/prompts_reemplazo.json", "utf8").replace(/^﻿/, "")).map((p) => [p.name, p.prompt])) : {};
let nFix = 0;
for (const [idx, e] of plan) {
  const nm = e.name || `${SLUG}_s_${String(idx).padStart(3, "0")}`;
  if (e.kind === "clip" && rechazados.has(nm)) { e.kind = "img"; e.prompt = promptsFix[nm] || e.prompt; e.ref = false; nFix++; }
}
if (nFix) console.log(`clips off-topic reemplazados por imagen: ${nFix}`);

// ── alias comp → kind de beatsheet.mjs ────────────────────────────────────────
const KIND = {
  stat: "stat", statbig: "stat",
  headline: "headline", kineticheadline: "headline",
  quote: "quote", kineticquote: "quote",
  chips: "chips", chipscluster: "chips",
  checklist: "checklist", photochecklist: "checklist",
  splitlist: "splitlist",
  process: "process", processsteps: "process",
  bars: "bars", barcompare: "bars",
  cross: "cross", crosssection: "cross",
  rule: "rule", rulenumberscene: "rule",
  chapter: "chapter", chaptertag: "chapter",
  alertwipe: "alertwipe",
  aged: "aged", ageddoc: "aged",
  callout: "callout", calloutmark: "callout",
  mistake: "mistake", mistakecard: "mistake",
  action: "action", actionstepcard: "action",
  numcard: "numcard", numbercard: "numcard",
  countrail: "countrail",
  blurreveal: "blurreveal",
  keyphrase: "keyphrase",
  impact: "impact", impactreveal: "impact",
  annotated: "annotated", annotatedimage: "annotated",
  nextvideo: "nextvideo", nextvideoendcard: "nextvideo",
};
// props que cada kind acepta (todo lo demás se descarta: prop inventada = render roto)
const PROPS = {
  stat: ["value", "prefix", "suffix", "decimals", "label", "eyebrow", "accent", "hue"],
  headline: ["tokens", "eyebrow", "size", "hue"],
  quote: ["text", "eyebrow", "accent", "hue", "fontSize"],
  chips: ["chips", "title", "hue"],
  checklist: ["title", "items", "eyebrow", "accent", "hue", "image"],
  splitlist: ["title", "items", "cross", "palette"],
  process: ["steps", "title", "eyebrow", "accent", "hue"],
  bars: ["bars", "title", "eyebrow", "orientation", "unit", "accent", "hue"],
  cross: ["layers", "title", "eyebrow", "marker", "hue"],
  rule: ["number", "title", "label", "hue"],
  chapter: ["title", "num", "accent"],
  alertwipe: ["text", "accent"],
  aged: ["heading", "lines", "eyebrow", "image", "accent", "hue"],
  callout: ["figure", "image", "eyebrow", "caption", "accent", "hue"],
  mistake: ["number", "title", "desc", "eyebrow", "image"],
  action: ["step", "question", "eyebrow"],
  numcard: ["number", "name", "image", "eyebrow", "total", "accent"],
  countrail: ["rank", "total", "name", "accent"],
  blurreveal: ["title", "eyebrow", "accent"],
  keyphrase: ["text", "src", "accent", "fontSize", "position"],
  impact: ["image", "impact", "setup", "impactAccent", "hitAt", "boom", "darken"],
  annotated: ["image", "annotations", "eyebrow", "caption", "hue"],
  nextvideo: ["title", "kicker", "sub"],
};
const NEEDS_IMG = { impact: "image", annotated: "image" };
const TOPE = { chips: 5, checklist: 6, splitlist: 5, process: 4, bars: 4, cross: 4, aged: 4, annotations: 4, tokens: 12 };

const clean = (kind, raw = {}) => {
  const allow = PROPS[kind] || [];
  const o = {};
  for (const [k, v] of Object.entries(raw)) if (allow.includes(k) && v != null && v !== "") o[k] = v;
  // topes de items
  if (o.chips) o.chips = o.chips.slice(0, TOPE.chips);
  if (o.items) o.items = o.items.slice(0, kind === "checklist" ? TOPE.checklist : TOPE.splitlist);
  if (o.steps) o.steps = o.steps.slice(0, TOPE.process);
  if (o.bars) o.bars = o.bars.slice(0, TOPE.bars);
  if (o.layers) o.layers = o.layers.slice(0, TOPE.cross);
  if (o.lines) o.lines = o.lines.slice(0, TOPE.aged);
  if (o.annotations) o.annotations = o.annotations.slice(0, TOPE.annotations);
  if (o.tokens) o.tokens = o.tokens.slice(0, TOPE.tokens);
  // saneos de forma
  if (kind === "stat") {
    const n = typeof o.value === "number" ? o.value : parseFloat(String(o.value ?? "").replace(/[^\d.,-]/g, "").replace(",", "."));
    if (!Number.isFinite(n)) return null;
    o.value = n;
  }
  if (kind === "headline" && Array.isArray(o.tokens)) {
    o.tokens = o.tokens.map((t) => (typeof t === "string" ? { t } : t)).filter((t) => t && t.t);
    if (!o.tokens.length) return null;
  }
  if (kind === "chips" && Array.isArray(o.chips)) o.chips = o.chips.map((c) => (typeof c === "string" ? c : c?.text || "")).filter(Boolean);
  if (kind === "splitlist" && Array.isArray(o.items)) o.items = o.items.map((c) => (typeof c === "string" ? c : c?.text || "")).filter(Boolean);
  if (kind === "checklist" && Array.isArray(o.items)) o.items = o.items.map((c) => (typeof c === "string" ? { text: c } : c)).filter((c) => c && c.text);
  if (kind === "cross" && Array.isArray(o.layers)) o.layers = o.layers.map((l, i) => ({ ...l, color: l.color || ["#8a6b46", "#b08d5e", "#5d6b73", "#3f4a52"][i % 4] }));
  if (kind === "process" && Array.isArray(o.steps)) o.steps = o.steps.map((s) => (typeof s === "string" ? { title: s } : s)).filter((s) => s && s.title);
  if (kind === "aged" && Array.isArray(o.lines)) o.lines = o.lines.map((l) => (typeof l === "string" ? { text: l } : l)).filter((l) => l && l.text);
  if (kind === "countrail" && o.rank != null) o.rank = Number(o.rank) || 1;
  // KeyPhrase.position solo acepta center|left|right (los directores escriben top/bottom)
  if (kind === "keyphrase") { if (!["center", "left", "right"].includes(o.position)) delete o.position; delete o.src; }
  if (kind === "numcard" && o.number != null) o.number = String(o.number);
  if (kind === "rule" && o.number != null) o.number = String(o.number);
  if (kind === "mistake" && o.number != null) o.number = String(o.number);
  // ⛔ beatsheet.mjs emite los props de TEXTO como  prop={JSON.stringify(v)}  SIN llaves:
  // si le pasás un número queda `total=6` → JSX inválido → se cae el bundle entero.
  // Los únicos props que van entre llaves (numéricos de verdad) son estos:
  const NUM = { stat: ["value", "decimals"], headline: ["size"], quote: ["fontSize"], keyphrase: ["fontSize"],
    countrail: ["rank", "total"], impact: ["hitAt", "boom", "darken"] }[kind] || [];
  for (const [k, v] of Object.entries(o)) {
    if (NUM.includes(k) || Array.isArray(v) || (v && typeof v === "object")) continue;
    if (typeof v === "number" || typeof v === "boolean") o[k] = String(v);
  }

  // obligatorias
  const req = { quote: ["text"], chips: ["chips"], checklist: ["title", "items"], splitlist: ["title", "items"],
    process: ["steps"], bars: ["bars"], cross: ["layers"], rule: ["number", "title"], chapter: ["title"],
    alertwipe: ["text"], aged: ["heading", "lines"], callout: ["figure"], mistake: ["number", "title"],
    action: ["step", "question"], numcard: ["number", "name"], countrail: ["rank", "name"],
    blurreveal: ["title"], keyphrase: ["text"], impact: ["impact"], annotated: ["annotations"],
    nextvideo: ["title"], headline: ["tokens"], stat: ["value"] }[kind] || [];
  for (const r of req) if (o[r] == null || (Array.isArray(o[r]) && !o[r].length)) return null;
  return o;
};

// ── momentos → beats ──────────────────────────────────────────────────────────
const rawBeats = [], compBeats = [], shots = [], prompts = [], avatarFull = [];
const imgAt = []; // [startSec, ruta] para autorrelleno de imagen
let nClip = 0, nImg = 0, nComp = 0, nAvatar = 0, nOverlay = 0, nDrop = 0;
const compCount = {};

for (const m of moments) {
  const p = plan.get(m.idx) || { kind: "avatar" };
  const start = +(m.startMs / 1000).toFixed(2);
  const kind = String(p.kind || "avatar").toLowerCase();

  if (kind === "clip") {
    const src = `broll/${SLUG}/${m.name}.mp4`;
    rawBeats.push({ id: m.name, start, kind: "raw", src, hue: "amber", darken: 0, noSplit: true });
    const q = (p.queries || []).filter(Boolean);
    shots.push({ name: m.name, query: q[0] || m.phrase.slice(0, 48), alt: q[1] || "", type: "video", orientation: "landscape" });
    nClip++;
  } else if (kind === "img") {
    const src = `img/${m.name}.png`;
    rawBeats.push({ id: m.name, start, kind: "raw", src, hue: "amber", darken: 0 });
    prompts.push({ name: m.name, prompt: p.prompt || `real phone photo of an old microwave in a garage, ${m.phrase.slice(0, 60)}, no text, no logo`, ...(p.ref ? { ref: `public/ref_${SLUG}.png` } : {}) });
    imgAt.push([start, src]);
    nImg++;
  } else if (kind === "comp") {
    const k = KIND[String(p.comp || "").toLowerCase()];
    const props = k ? clean(k, p.props) : null;
    if (k && props) {
      compBeats.push({ id: `c_${k}_${m.idx}`, start, kind: k, __needs: NEEDS_IMG[k], ...props });
      compCount[k] = (compCount[k] || 0) + 1;
      nComp++;
    } else { nDrop++; avatarFull.push([start, m.endMs / 1000]); nAvatar++; }
  } else {
    avatarFull.push([start, +(m.endMs / 1000).toFixed(2)]);
    nAvatar++;
  }

  // overlay opcional sobre clip/img
  if ((kind === "clip" || kind === "img") && p.overlay && p.overlay.comp) {
    const k = KIND[String(p.overlay.comp).toLowerCase()];
    const props = k ? clean(k, p.overlay.props) : null;
    if (k && props) {
      compBeats.push({ id: `o_${k}_${m.idx}`, start: +(start + 0.25).toFixed(2), kind: k, overlay: true, __needs: NEEDS_IMG[k], ...props });
      compCount[k] = (compCount[k] || 0) + 1;
      nOverlay++;
    } else nDrop++;
  }
}

// duraciones de los raw: hasta el proximo raw (o hasta el proximo momento avatar)
const marks = [...rawBeats.map((b) => b.start), ...avatarFull.map(([s]) => s), ...compBeats.filter((b) => !b.overlay).map((b) => b.start)]
  .sort((a, b) => a - b);
const nextMark = (t) => { for (const s of marks) if (s > t + 0.05) return s; return TOTAL; };
rawBeats.sort((a, b) => a.start - b.start);
for (const b of rawBeats) b.dur = +Math.max(1.0, nextMark(b.start) - b.start + 0.3).toFixed(2);
for (const b of compBeats) {
  if (b.overlay) b.dur = +Math.min(6.5, Math.max(2.6, nextMark(b.start - 0.25) - b.start + 0.2)).toFixed(2);
  else b.dur = +Math.max(2.2, nextMark(b.start) - b.start + 0.3).toFixed(2);
  // AlertWipe es un BARRIDO, no una placa: estirado queda una banda roja quieta.
  if (b.kind === "alertwipe") b.dur = +Math.min(2.6, Math.max(1.8, b.dur)).toFixed(2);
}

// autorrelleno de imagen para los componentes que la necesitan (la del momento MAS CERCANO)
const nearestImg = (t) => {
  let best = null, bd = 1e9;
  for (const [s, src] of imgAt) { const d = Math.abs(s - t); if (d < bd) { bd = d; best = src; } }
  return best;
};
for (const b of compBeats) {
  if (b.__needs && !b[b.__needs]) { const src = nearestImg(b.start); if (src) b[b.__needs] = src; }
  delete b.__needs;
}
// los que quedaron sin imagen obligatoria se caen
const beforeImgDrop = compBeats.length;
const compOk = compBeats.filter((b) => !(NEEDS_IMG[b.kind] && !b[NEEDS_IMG[b.kind]]));

const beats = [...rawBeats, ...compOk].sort((a, b) => a.start - b.start);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, beats }, null, 1));

// ── ventanas del avatar: full en los momentos dirigidos como "avatar" ─────────
avatarFull.sort((a, b) => a[0] - b[0]);
const fulls = [];
for (const [s, e] of avatarFull) {
  const last = fulls[fulls.length - 1];
  if (last && s <= last[1] + 0.35) last[1] = Math.max(last[1], e);
  else fulls.push([s, e]);
}
// ⛔ el video ABRE con el avatar a pantalla completa: minimo los primeros 2 s
if (!fulls.length || fulls[0][0] > 0.01) fulls.unshift([0, Math.max(2.5, fulls[0]?.[0] || 2.5)]);
else fulls[0][0] = 0;
if (fulls[0][1] < 2.5) fulls[0][1] = 2.5;

const windows = [];
let cursor = 0;
for (const [s, e] of fulls) {
  if (s > cursor + 0.2) windows.push({ start: +cursor.toFixed(2), mode: "hidden" });
  windows.push({ start: +s.toFixed(2), mode: "full" });
  cursor = e;
}
if (cursor < TOTAL - 0.1) windows.push({ start: +cursor.toFixed(2), mode: "hidden" });
if (windows[0].start !== 0) windows.unshift({ start: 0, mode: "full" });
windows.push({ start: TOTAL, mode: "hidden" });

fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\n` +
  `export const TOTAL_VXSAG = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);

fs.mkdirSync("public/img", { recursive: true });
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync(`public/img/prompts_${SLUG}.json`, JSON.stringify(prompts, null, 1));
fs.writeFileSync(`public/broll/shots_${SLUG}.json`, JSON.stringify(shots, null, 1));

const compsDistintos = Object.keys(compCount).length;
console.log(`beats ${beats.length} · clips ${nClip} · imgs ${nImg} · comp-escena ${nComp} · overlays ${nOverlay} · avatar-full ${nAvatar} · descartados ${nDrop + (beforeImgDrop - compOk.length)}`);
console.log(`componentes distintos ${compsDistintos} · usos ${nComp + nOverlay} (${((nComp + nOverlay) / (TOTAL / 60)).toFixed(1)}/min) · ventanas avatar ${windows.length}`);
console.log("uso por componente:", JSON.stringify(compCount));
