// build_vvct6o98iqgr.mjs — Levi Lapp Jardín · "sal de Epsom / magnesio"
// Junta los 8 tramos del DIRECTOR (_v3/sec1..8.json), decide las VENTANAS DE AVATAR FULL,
// genera los OVERLAYS de tipografía sincronizada al ms y emite:
//   beatsheet/vvct6o98iqgr.json          → lo consume beatsheet.mjs
//   src/VideoEdit/avatar_vvct6o98iqgr.gen.ts
import fs from "fs";

const SLUG = "vvct6o98iqgr";
const AVATAR = `${SLUG}_opt.mp4`;
const TOTAL = 1250.4; // ffprobe del avatar cortado

// ── captions (palabra por palabra) ───────────────────────────────────────────
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const W = caps.map((c) => ({ n: norm(c.text), raw: c.text, ms: c.startMs, end: c.endMs }));

// ── tramos del director ──────────────────────────────────────────────────────
let mom = [];
for (let i = 1; i <= 8; i++) {
  const p = `_v3/sec${i}.json`;
  if (!fs.existsSync(p)) { console.warn(`⚠ falta ${p}`); continue; }
  const arr = JSON.parse(fs.readFileSync(p, "utf8").replace(/^﻿/, ""));
  arr.forEach((m) => mom.push({ ...m, _sec: i }));
}
mom.sort((a, b) => a.t - b.t);
// saneo: sin solapes, sin huecos absurdos, duración mínima
for (let i = 0; i < mom.length; i++) {
  const nxt = mom[i + 1];
  const max = nxt ? nxt.t - mom[i].t : TOTAL - mom[i].t;
  if (mom[i].seg > max) mom[i].seg = +max.toFixed(2);
  if (mom[i].seg < 1.6) mom[i].seg = 1.6;
}
mom = mom.filter((m) => m.t >= 0 && m.t + 0.5 < TOTAL && m.seg >= 1.6);
console.log(`momentos del director: ${mom.length}`);

// ── VENTANAS DE AVATAR FULL ──────────────────────────────────────────────────
// Piso duro: 28 % del metraje (compuerta legibilidad). Apunto a ~32 %.
const SPLICES = [16.55, 911.69, 1232.03];       // empalmes de edición: ahí SIEMPRE visual
const nearSplice = (a, b) => SPLICES.some((s) => s > a - 2.5 && s < b + 2.5);

const OPEN_END = 6.2;                            // apertura: avatar full limpio
const CLOSE_START = 1236.0;                      // cierre emocional a cara descubierta
const fullWins = [[0, OPEN_END], [CLOSE_START, TOTAL]];

// El resto se reparte: cada ~24 s de visual, una ventana de ~12 s de avatar full.
// Preferimos abrirla en un momento PERSONAL (habla de sí mismo → su cara vale más que un b-roll).
{
  let acc = 0;
  let i = 0;
  while (i < mom.length) {
    const m = mom[i];
    if (m.t < OPEN_END || m.t >= CLOSE_START) { i++; continue; }
    acc += m.seg;
    if (acc >= 28) {
      // buscar dentro de los próximos 4 momentos uno personal para arrancar ahí
      let j = i;
      for (let k = i; k < Math.min(i + 4, mom.length); k++) if (mom[k].personal) { j = k; break; }
      const start = mom[j].t;
      let end = start;
      let k = j;
      while (k < mom.length && end - start < 11.5) { end = mom[k].t + mom[k].seg; k++; }
      if (end > CLOSE_START) break;
      if (!nearSplice(start, end)) { fullWins.push([+start.toFixed(2), +end.toFixed(2)]); acc = 0; i = k; continue; }
      acc = 0;
    }
    i++;
  }
}
fullWins.sort((a, b) => a[0] - b[0]);
const inFull = (t) => fullWins.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const fullSecs = fullWins.reduce((n, [s, e]) => n + (e - s), 0);
console.log(`avatar full: ${fullWins.length} ventanas · ${fullSecs.toFixed(1)}s = ${((fullSecs / TOTAL) * 100).toFixed(1)}%`);

// los momentos que caen dentro de una ventana full se sacan de pantalla completa
const visibles = mom.filter((m) => !inFull(m.t + 0.05));
console.log(`momentos a pantalla completa: ${visibles.length}`);

// ── helpers de assets ────────────────────────────────────────────────────────
const norm2 = (name) => (name || "").replace(/\.mp4$/i, "");
const canon = (name) => {
  const n = norm2(name);
  if (fs.existsSync(`public/broll/${SLUG}/${n}.mp4`)) return n;
  if (fs.existsSync(`public/broll/${SLUG}/${SLUG}_${n}.mp4`)) return `${SLUG}_${n}`;
  return null;
};
const clipOf = (name) => `broll/${SLUG}/${canon(name) || norm2(name)}.mp4`;
const haveClip = (name) => !!canon(name);
const haveReal = (f) => fs.existsSync(`public/real/${f}`);
const personalImg = (n) => `img/${SLUG}_p${String(n).padStart(2, "0")}.png`;

const CLIPS = fs.readdirSync(`public/broll/${SLUG}`).filter((f) => f.endsWith(".mp4")).map((f) => f.replace(/\.mp4$/, ""));
let clipRR = 0;
const anyClip = () => CLIPS[clipRR++ % CLIPS.length];

function resolveAsset(m, pIdx) {
  if (m.personal) return personalImg(pIdx);
  const a = m.asset;
  if (!a) return null;
  if (/\.(jpg|jpeg|png|webp)$/i.test(a)) return haveReal(a) ? `real/${a}` : null;
  if (haveClip(a)) return clipOf(a);
  return null;
}

// ── beats ────────────────────────────────────────────────────────────────────
const beats = [];
const prompts = [];
let pIdx = 0;
let lastKind = "";
const GRADES = ["", "", "saturate(1.05)", "", "contrast(1.04) saturate(1.03)"];

visibles.forEach((m, i) => {
  const id = `m_${String(i + 1).padStart(3, "0")}`;
  const start = +m.t.toFixed(2);
  const dur = +m.seg.toFixed(2);

  if (m.personal) {
    pIdx++;
    prompts.push({ name: `${SLUG}_p${String(pIdx).padStart(2, "0")}`, prompt: m.imgprompt || m.muestra, ref: `public/ref_${SLUG}.png` });
  }
  const src = resolveAsset(m, pIdx);

  if (m.tipo === "componente" && m.kind && m.kind !== "raw") {
    const props = { ...(m.props || {}) };
    // la imagen de un componente sale del inventario
    if (props.image && /^broll\//.test(props.image)) {
      const base = props.image.split("/").pop();
      if (haveClip(base)) props.image = clipOf(base); else delete props.image;
    }
    if (props.image && !/^(real|img|broll)\//.test(props.image)) {
      if (haveReal(props.image)) props.image = `real/${props.image}`;
      else if (haveClip(props.image)) props.image = clipOf(props.image);
      else delete props.image;
    }
    if (props.image && /^real\//.test(props.image) && !haveReal(props.image.slice(5))) delete props.image;
    // beatsheet serializa los números como JSX pelado (number=5 → error de sintaxis).
    // Los props que son ETIQUETA y no magnitud van SIEMPRE como string.
    for (const k of ["number", "total", "num", "rank", "step", "figure", "display", "unit"]) {
      if (typeof props[k] === "number") props[k] = String(props[k]);
    }
    beats.push({ id, start, dur, kind: m.kind, ...props });
    lastKind = m.kind;
    return;
  }

  // toma cruda (clip o imagen)
  const fallback = clipOf(anyClip());
  beats.push({
    id, start, dur, kind: "raw",
    src: src || fallback,
    darken: 0,
    grade: GRADES[i % GRADES.length] || undefined,
    kbPhase: i % 4,
    trans: i % 6 === 0 ? 9 : undefined,
  });
  lastKind = "raw";
});

// ── OVERLAYS: tipografía sincronizada al ms, encima del avatar ───────────────
// Van sobre todo en las ventanas de avatar full: suman componentes del kit sin tapar la cara.
function kwords(startMs, maxTok = 7) {
  const i0 = W.findIndex((w) => w.ms >= startMs);
  if (i0 < 0) return null;
  const seq = W.slice(i0, i0 + maxTok).filter((w) => w.raw && w.raw.trim());
  if (seq.length < 3) return null;
  const t0 = seq[0].ms;
  return {
    start: +(t0 / 1000).toFixed(2),
    dur: +(((seq[seq.length - 1].end - t0) / 1000) + 1.5).toFixed(2),
    words: seq.map((w, k) => ({ t: w.raw.trim().replace(/[.,;:]$/, ""), at: +((w.ms - t0) / 1000).toFixed(2), ...(k === seq.length - 1 ? { hl: true } : {}) })),
  };
}

const overlays = [];
let oi = 0;
for (const [s, e] of fullWins) {
  if (e - s < 5) continue;
  // 1 a 3 líneas cinéticas por ventana, repartidas
  const n = Math.min(4, Math.max(1, Math.floor((e - s) / 3.5)));
  for (let k = 0; k < n; k++) {
    const at = s + 0.6 + k * ((e - s - 1.2) / n);
    const kw = kwords(at * 1000);
    if (!kw) continue;
    if (kw.start + kw.dur > e - 0.2) kw.dur = +(e - 0.2 - kw.start).toFixed(2);
    if (kw.dur < 2.2) continue;
    overlays.push({ id: `kl_${++oi}`, start: kw.start, dur: kw.dur, kind: "kineticline", overlay: true, accent: "amber", words: kw.words });
  }
}
// etiquetas documentales repartidas (más usos de kit, cero estorbo)
const LABELS = [
  [52, "Epsom, Inglaterra", "1618"],
  [212, "Azufre", "antes llovía gratis"],
  [300, "Magnesio", "no es un oligoelemento"],
  [392, "La firma", "venas verdes, hoja amarilla"],
  [498, "Forma 1", "la regadera"],
  [604, "Prepararlo", "siempre en agua tibia"],
  [742, "Mito", "no es sal de mesa"],
  [820, "El error", "por qué no te funcionó"],
  [944, "Arreglo 2", "usá el rociador"],
  [1012, "La prueba", "dos verdes distintos"],
  [1108, "Esta semana", "paso uno"],
  [1196, "Próximo video", "la olla de barro"],
];
LABELS.forEach(([t, label, sub], i) => {
  if (t + 4 > TOTAL) return;
  overlays.push({ id: `dl_${i + 1}`, start: t, dur: 4.2, kind: "doclabel", overlay: true, label, sub, accent: "amber", corner: i % 2 ? "bl" : "tl" });
});


// ── COMPUERTA DE LEGIBILIDAD (la resuelve el DIRECTOR, acá se ejecuta la decisión) ───────────
// Para cada cartel: si le falta poco tiempo y el vecino puede prestarlo → se lo damos.
// Si no, se RECORTA el texto (los carteles son titulares, no párrafos).
const SYSK = new Set(["id","start","dur","kind","overlay","src","darken","grade","kbPhase","trans","focus","noSplit","sfx","reframe","gen","anec"]);
const isText = (v) => typeof v === "string" && v.length >= 2 && !/^[a-z_]+$/.test(v) &&
  !/\.(png|jpg|jpeg|webp|mp4|webm)$/i.test(v) && !/^(img|broll|vid|real)\//.test(v);
function collect(v, out) {
  if (Array.isArray(v)) v.forEach((x) => collect(x, out));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) { if (!SYSK.has(k)) collect(x, out); }
  else if (isText(v)) out.push(v);
}
const palabras = (b) => { const o = []; for (const [k, v] of Object.entries(b)) if (!SYSK.has(k)) collect(v, o);
  return o.join(" ").split(/\s+/).filter((w) => /[a-zA-ZáéíóúñÁÉÍÓÚÑ0-9]/.test(w)).length + 1 + numArr(b); };
// el gate lee el TSX ya serializado: los `"at":0.31` de dentro de un array le cuentan como palabra
function numArr(v, inArr = false) {
  if (Array.isArray(v)) return v.reduce((n, x) => n + numArr(x, true), 0);
  if (v && typeof v === "object") return Object.entries(v).reduce((n, [k, x]) => (SYSK.has(k) && !inArr ? n : n + numArr(x, inArr)), 0);
  return inArr && typeof v === "number" ? 1 : 0;
}
const req = (pal) => Math.min(8, Math.max(2.5, 0.8 + pal / 2.5));

// paso 1 — prestar tiempo del vecino cuando falta poco
const fullBeats = beats.slice().sort((a, b) => a.start - b.start);
for (let i = 0; i < fullBeats.length; i++) {
  const b = fullBeats[i];
  if (b.kind === "raw") continue;
  const falta = req(palabras(b)) - 0.05 - b.dur;
  if (falta <= 0) continue;
  const nx = fullBeats[i + 1];
  if (falta <= 1.5 && nx && nx.dur - falta >= 2.4) {
    b.dur = +(b.dur + falta).toFixed(2);
    nx.start = +(nx.start + falta).toFixed(2);
    nx.dur = +(nx.dur - falta).toFixed(2);
  }
}
// paso 2 — recortar el texto de lo que siga sin entrar
function trim(b, cupo) {
  const drop = (obj) => {
    for (const k of ["items", "bars", "steps", "tiles", "layers", "annotations", "words", "pills", "slides", "waypoints", "events", "chips"]) {
      if (Array.isArray(obj[k]) && obj[k].length > 2) { obj[k] = obj[k].slice(0, obj[k].length - 1); return true; }
    }
    // si no hay listas, acortar el string más largo
    let best = null;
    const walk = (o) => { for (const [k, v] of Object.entries(o)) { if (SYSK.has(k)) continue;
      if (isText(v) && v.split(/\s+/).length > 3 && (!best || v.length > best.v.length)) best = { o, k, v };
      else if (v && typeof v === "object") walk(v); } };
    walk(obj);
    if (best) { const w = best.v.split(/\s+/); best.o[best.k] = w.slice(0, w.length - 1).join(" "); return true; }
    return false;
  };
  let guard = 0;
  while (palabras(b) > cupo && guard++ < 60) { if (!drop(b)) break; }
}
for (const b of [...beats, ...overlays]) {
  if (b.kind === "raw") continue;
  const cupo = Math.max(3, Math.floor((Math.min(b.dur + 0.05, 8) - 0.8) * 2.5));
  if (palabras(b) > cupo) trim(b, cupo);
}

// los overlays no pueden pisarse entre sí (dos líneas encimadas se leen como un borrón)
// solo entre SÍ: las etiquetas de esquina (doclabel) conviven con la línea cinética del centro
{
  const kl = overlays.filter((o) => o.kind === "kineticline").sort((a, b) => a.start - b.start);
  for (let i = 0; i < kl.length - 1; i++) {
    const gap = kl[i + 1].start - 0.25 - kl[i].start;
    if (kl[i].dur > gap) kl[i].dur = +Math.max(1.8, gap).toFixed(2);
  }
}

const all = [...beats, ...overlays].sort((a, b) => a.start - b.start);

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, clipsfirst: true, beats: all }, null, 2));
fs.mkdirSync("_v3", { recursive: true });
fs.writeFileSync(`_v3/${SLUG}_imgprompts.json`, JSON.stringify(prompts, null, 2));

// ── avatar_<slug>.gen.ts ─────────────────────────────────────────────────────
const pts = [...new Set([0, ...fullWins.flat(), TOTAL])].sort((a, b) => a - b);
const windows = [];
let cur = null;
for (const t of pts) {
  if (t >= TOTAL - 1e-6) break;
  const m = inFull(t + 1e-3) ? "full" : "hidden";
  if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; }
}
windows.push({ start: TOTAL, mode: "hidden" });

fs.writeFileSync(
  `src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO por build_${SLUG}.mjs. NO editar a mano.\n` +
    `import type { AvatarWindow } from "./scenes/AvatarLayer";\n` +
    `export const TOTAL_VVCT6O98IQGR = ${TOTAL};\n` +
    `export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`
);

// ── resumen ──────────────────────────────────────────────────────────────────
const durs = beats.map((b) => b.dur).sort((a, b) => a - b);
const med = durs[Math.floor(durs.length / 2)];
const p75 = durs[Math.floor(durs.length * 0.75)];
const largos = durs.filter((d) => d >= 5).length;
const comps = all.filter((b) => b.kind !== "raw").length;
const kinds = new Set(all.filter((b) => b.kind !== "raw").map((b) => b.kind));
console.log(`beats totales   : ${all.length}  (raw ${beats.filter((b) => b.kind === "raw").length} · componentes ${comps})`);
console.log(`kinds distintos : ${kinds.size}  → ${[...kinds].join(", ")}`);
console.log(`usos comp/min   : ${(comps / (TOTAL / 60)).toFixed(1)}   (mínimo 7)`);
console.log(`mediana ${med}s · p75 ${p75}s · ${((largos / durs.length) * 100).toFixed(0)}% ≥5s`);
console.log(`imágenes personales a generar: ${prompts.length}`);
