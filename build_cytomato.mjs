// build_cytomato.mjs — "Preserve Fresh Tomatoes for Years — The Old Amish Way"
// Canal Claudio Yoder (@claudioyoder-amish · INGLÉS · modo avatar · amish-doc).
// Avatar de 6:47 EN BUCLE (horneado en cytomato_opt.mp4 con el master de audio) + 257 clips agnes
// + foto de respaldo agnes por clip (tapa la cola del momento) + 21 fotos hero gpt-image-2 (ref avatar)
// + kit premium THEME_EARTH. CTA = The Plain Almanac (sin precio ni link en voz).
// Salida: beatsheet/cytomato.json + src/VideoEdit/avatar_cytomato.gen.ts
import fs from "fs";
import { execFileSync } from "child_process";

const SLUG = "cytomato";
const TOTAL = 1240.2;                 // master = 1239.48s · opt.mp4 = 1240.88s
const CLIP_LOOP = 406.84;             // costuras del bucle de avatar
const FF = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffprobe.exe";

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = [];
for (const c of caps) for (const w of norm(c.text).split(" ").filter(Boolean)) Wc.push({ n: w, ms: c.startMs });
const at = (phrase, maxTok = 8) => {
  const t = norm(phrase).split(" ").filter(Boolean).slice(0, maxTok);
  for (let i = 0; i <= Wc.length - t.length; i++) {
    let ok = 1;
    for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return Wc[i].ms / 1000;
  }
  return null;
};

// ── B-ROLL: momentos del DIRECTOR (_v3/cytomato_moments.json) ────────────────────────────────
const mom = JSON.parse(fs.readFileSync("_v3/cytomato_moments.json", "utf8").replace(/^\uFEFF/, ""));
const dur = (p) => { try { return +execFileSync(FF, ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", p]).toString().trim(); } catch { return 0; } };

const rawBeats = [];
let nClip = 0, nPhoto = 0, nHero = 0, missing = [];
for (let i = 0; i < mom.length; i++) {
  const m = mom[i];
  const start = m.start;
  const slot = m.dur;
  if (m.k === "hero") {
    const p = `img/${SLUG}/cytp_${m.n}.jpg`;
    if (!fs.existsSync("public/" + p)) { missing.push(p); continue; }
    rawBeats.push({ id: `${SLUG}_h${i}`, start, kind: "raw", src: p, hue: "amber", darken: 0, dur: slot });
    nHero++;
    continue;
  }
  const vid = `broll/cyt_${m.n}.mp4`;
  const img = `img/${SLUG}/cyt_${m.n}.jpg`;
  const hasVid = fs.existsSync("public/" + vid);
  const hasImg = fs.existsSync("public/" + img);
  if (!hasVid && !hasImg) { missing.push(vid); continue; }
  if (hasVid) {
    const real = Math.max(1.2, dur("public/" + vid) - 0.08);
    const cov = +Math.min(slot, real).toFixed(2);
    rawBeats.push({ id: `${SLUG}_${i}`, start, kind: "raw", src: vid, hue: "amber", darken: 0, dur: cov, noSplit: true });
    nClip++;
    // cola del momento → la foto del MISMO prompt (un corte más, mismo tema)
    const tail = +(slot - cov).toFixed(2);
    if (tail >= 1.0 && hasImg) {
      rawBeats.push({ id: `${SLUG}_${i}t`, start: +(start + cov).toFixed(2), kind: "raw", src: img, hue: "amber", darken: 0, dur: tail });
      nPhoto++;
    }
  } else {
    rawBeats.push({ id: `${SLUG}_${i}`, start, kind: "raw", src: img, hue: "amber", darken: 0, dur: slot });
    nPhoto++;
  }
}
// ── VENTANAS DE AVATAR FULL ──────────────────────────────────────────────────────────────────
// El avatar sincroniza labios SOLO en los primeros 406,84 s (lo demás es el bucle sobre el master
// de Fish). Por eso el tiempo de presentador se concentra ahí: aire para la cara donde ES exacto.
const AV_FORCE = [
  [0, 2.8], [22.3, 27.6], [41.1, 46.6], [50.8, 56.6], [76.5, 84.0], [97.0, 101.7],
  [120.6, 126.8], [141.9, 150.0], [159.5, 163.1], [185.2, 189.1], [219.9, 224.5],
  [243.0, 249.4], [263.2, 268.4], [286.9, 291.0], [302.3, 306.8], [323.9, 330.5],
  [350.9, 355.3], [383.3, 386.3],
  // más adelante, tramos cortos de respiro donde el bucle no molesta (frases personales)
  [600.1, 604.3], [675.8, 679.6], [809.0, 812.9], [944.3, 948.0], [973.6, 978.5],
  [1067.7, 1071.7], [1204.7, 1208.3], [1231.4, 1236.3],
];
const inForce = (a, b) => AV_FORCE.some(([s, e]) => a < e && b > s);
const kept = [];
let cutForce = 0;
for (const b of rawBeats) {
  const end = +(b.start + b.dur).toFixed(2);
  if (!inForce(b.start, end)) { kept.push(b); continue; }
  // recortar el beat para que no invada la ventana de avatar
  const w = AV_FORCE.find(([s, e]) => b.start < e && end > s);
  if (b.start < w[0] && w[0] - b.start >= 1.2) { b.dur = +(w[0] - b.start).toFixed(2); kept.push(b); }
  else if (end > w[1] && end - w[1] >= 1.2) { b.dur = +(end - w[1]).toFixed(2); b.start = w[1]; kept.push(b); }
  else cutForce++;
}
rawBeats.length = 0; rawBeats.push(...kept);
console.log(`b-roll: clips ${nClip} · fotos ${nPhoto} · hero ${nHero} · faltantes ${missing.length} · beats cedidos al avatar ${cutForce}`);
if (missing.length) console.log("  faltan:", missing.slice(0, 12).join(" "), missing.length > 12 ? `… +${missing.length - 12}` : "");

// ── COMPONENTES (kit premium THEME_EARTH, labels en INGLÉS) ──────────────────────────────────
// El COPY vive en _v3/cytomato_comps.json (corto por diseño) y la DURACIÓN sale de la aritmética
// de lectura: entrada 0.8s + caracteres/14 + respiro 1.0s (scripts/readtime.mjs). Deuda objetivo 0.
const PREMIUM = JSON.parse(fs.readFileSync("_v3/cytomato_comps.json", "utf8").replace(/^﻿/, ""));
const textOf = (v, out = []) => {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => textOf(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => textOf(x, out));
  return out;
};
const readSecs = (props) => {
  const strs = textOf(props).filter((s) => s.length > 1 && !s.includes("/") && !s.endsWith(".png"));
  const chars = strs.reduce((a, s) => a + s.length * (s.length < 26 ? 0.75 : 1), 0);
  return { chars: Math.round(chars), min: +(0.8 + chars / 14 + 1.0).toFixed(2) };
};

const compBeats = [];
let missAnchor = 0;
const placed = [];
for (const p of PREMIUM) {
  const s = at(p.at, p.maxTok);
  if (s == null) { console.warn("⚠ anchor missing:", p.at.slice(0, 55)); missAnchor++; continue; }
  const { chars, min } = readSecs(p.props);
  placed.push({ ...p, start: +s.toFixed(2), need: min, chars });
}
placed.sort((a, b) => a.start - b.start);
let debt = 0, over = [];
for (let i = 0; i < placed.length; i++) {
  const p = placed[i];
  const room = (placed[i + 1] ? placed[i + 1].start - 0.4 : TOTAL) - p.start;
  const d = +Math.min(Math.max(p.need, 4.0), Math.max(room, 4.0)).toFixed(2);
  if (d + 0.01 < p.need) { debt += +(p.need - d).toFixed(2); over.push(`${p.comp}@${Math.round(p.start)}s -${(p.need - d).toFixed(1)}s`); }
  compBeats.push({ id: `ov_${p.comp.toLowerCase()}_${Math.round(p.start)}`, start: p.start, dur: d, kind: "premium", overlay: true, comp: p.comp, theme: "earth", zone: p.zone, ...p.props });
}
if (debt > 0) console.log(`⚠ DEUDA DE LECTURA: ${debt.toFixed(1)}s · ${over.join(" · ")}`);
else console.log("lectura: deuda 0 (todo componente dura lo que se tarda en leerlo)");
console.log(`componentes: ${compBeats.length}/${PREMIUM.length} (${new Set(compBeats.map((b) => b.comp)).size} tipos) · anchors perdidos ${missAnchor}`);

// ── COBERTURA: el avatar es el FONDO. Base full; el contenido cubre SOLO su span real ────────
const spans = [...rawBeats.map((b) => [b.start, +(b.start + b.dur).toFixed(2)])];
const covered = (t) => spans.some(([s, e]) => s <= t && e > t);
const STEP = 0.1;
const windows = [];
let cur = null;
for (let t = 0; t < TOTAL; t = +(t + STEP).toFixed(2)) {
  const mode = covered(t) ? "hidden" : "full";
  if (mode !== cur) { windows.push({ start: t, mode }); cur = mode; }
}
if (!windows.length || windows[0].start > 0) windows.unshift({ start: 0, mode: "full" });

// huecos: instantes sin avatar-full y sin contenido → 0 por construcción, pero se verifica
let holes = 0;
for (let t = 0; t < TOTAL; t = +(t + STEP).toFixed(2)) {
  const w = [...windows].reverse().find((x) => x.start <= t);
  if (w.mode !== "full" && !covered(t)) holes++;
}
const avSecs = windows.reduce((a, w, i) => a + (w.mode === "full" ? ((windows[i + 1]?.start ?? TOTAL) - w.start) : 0), 0);
console.log(`ventanas ${windows.length} · avatar full ${avSecs.toFixed(0)}s (${(avSecs / TOTAL * 100).toFixed(1)}%) · HUECOS ${holes}`);

// costuras del bucle: tiene que haber un corte de b-roll exacto en cada una
for (let k = 1; k * CLIP_LOOP < TOTAL; k++) {
  const s = +(k * CLIP_LOOP).toFixed(2);
  const hit = rawBeats.some((b) => Math.abs(b.start - s) < 0.15);
  console.log(`costura ${s}s → ${hit ? "CUBIERTA" : "⚠ DESCUBIERTA"}`);
}

const beats = [...rawBeats, ...compBeats].sort((a, b) => a.start - b.start);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ slug: SLUG, total: TOTAL, beats }, null, 1));
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// generado por build_${SLUG}.mjs\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS = ${JSON.stringify(windows)} as const;\n`);
console.log(`→ beatsheet/${SLUG}.json (${beats.length} beats) · src/VideoEdit/avatar_${SLUG}.gen.ts`);
