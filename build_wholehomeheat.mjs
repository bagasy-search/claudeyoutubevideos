// build_wholehomeheat.mjs — "How the Amish Heat Their Whole Home Without Gas or Electricity"
// Canal claudio yoder (@claudioyoder-amish · INGLÉS). Avatar 5:14 HORNEADO EN BUCLE a 18:27
// con el master de audio (parte 1 = HeyGen del creador, parte 2 = Fish clonado cy_enfatico).
// B-roll: clips agnes (texto-a-video) + su foto de respaldo del MISMO prompt para tapar la cola.
// Componentes: kit premium THEME_EARTH, labels TODOS en inglés. CTA = The Plain Almanac (sin precio).
// Salida: beatsheet/wholehomeheat.json + src/VideoEdit/avatar_wholehomeheat.gen.ts
import fs from "fs";

const SLUG = "wholehomeheat";
const AVATAR = `${SLUG}_opt.mp4`;
const TOTAL = 1107.35;
const CLIP_DUR = 4.0;           // agnes 97f @24fps = 4,04s; dejo 4,0 de margen

const moments = JSON.parse(fs.readFileSync(`_v3/${SLUG}_moments.json`, "utf8").replace(/^﻿/, ""));
const comps   = JSON.parse(fs.readFileSync(`_v3/${SLUG}_comps.json`,   "utf8").replace(/^﻿/, ""));

// ── B-ROLL ────────────────────────────────────────────────────────────────────
// Cada momento trae su clip Y su foto de respaldo (mismo prompt). Si el hueco es
// más largo que el clip, entra la foto a taparle la cola: un corte más, mismo tema,
// en vez de dejar avatar suelto (agnes-broll §1).
const raw = [];
let nClip = 0, nPhoto = 0, nTail = 0, missing = [];
const sorted = [...moments].sort((a, b) => a.ms - b.ms);

for (let i = 0; i < sorted.length; i++) {
  const m = sorted[i];
  const next = i + 1 < sorted.length ? sorted[i + 1].ms : TOTAL;
  const gap = +(next - m.ms).toFixed(2);
  if (gap < 0.6) continue;

  const mp4 = `broll/${m.name}.mp4`;
  const jpg = `img/${m.name}.jpg`;
  const hasMp4 = fs.existsSync("public/" + mp4);
  const hasJpg = fs.existsSync("public/" + jpg);
  if (!hasMp4 && !hasJpg) { missing.push(m.name); continue; }

  let slot = Math.min(gap, 9);
  // En los momentos MUY amplios el visual no llena todo el hueco: los últimos ~1,8s
  // vuelven al AVATAR. Sube la presencia del presentador (piso 28%) y da respiro
  // antes del próximo corte, que es la identidad Amish (pausado, deja respirar).
  if (slot >= 7) slot = +(slot - 1.8).toFixed(2);          // techo Amish: sostener, pero no clavar
  // ⛔ ANTI-METRONOMO (regla 1): si TODO momento se corta a los 4s del clip, la
  // mediana y el p75 dan 4,00 y el video "cambia una por segundo, cansa". Hace falta
  // que ~4 de cada 10 planos pasen los 5s. El clip agnes dura 4,04s fijos, así que
  // los planos LARGOS los sostiene la FOTO (Ken Burns lento = identidad Amish).
  const roomy = slot >= 4.6;
  const holdPhoto = roomy && hasJpg && (i % 10 < 6);  // ~60% de los momentos amplios: foto SOSTENIDA
  if (holdPhoto) {
    raw.push({ start: m.ms, dur: +slot.toFixed(2), src: jpg, vid: false });
    nPhoto++;
  } else if (hasMp4) {
    const d = +Math.min(slot, CLIP_DUR).toFixed(2);
    raw.push({ start: m.ms, dur: d, src: mp4, vid: true });
    nClip++;
    // Cola SOLO si da para un plano de verdad (≥2,2s). Una colita de 1s es un corte
    // de relleno que aplana el pacing; ese hueco lo llena el AVATAR, que además está
    // por debajo del piso de presencia si se tapa todo con b-roll.
    const left = +(slot - d).toFixed(2);
    if (left >= 2.2 && hasJpg) {
      raw.push({ start: +(m.ms + d).toFixed(2), dur: left, src: jpg, vid: false });
      nTail++;
    }
  } else {
    raw.push({ start: m.ms, dur: +Math.max(2.2, Math.min(slot, 8)).toFixed(2), src: jpg, vid: false });
    nPhoto++;
  }
}
raw.sort((a, b) => a.start - b.start);

const rawBeats = raw.map((b, i) => ({
  id: `${SLUG}_${i}`, start: b.start, kind: "raw", src: b.src, hue: "amber", darken: 0,
  dur: b.dur, ...(b.vid ? { noSplit: true } : {}),
}));

// ── COMPONENTES (overlay premium) ─────────────────────────────────────────────
const compBeats = comps.map((c) => ({
  id: `ov_${c.comp.toLowerCase()}_${Math.round(c.start)}`,
  start: c.start, dur: c.dur, kind: "premium", overlay: true,
  comp: c.comp, theme: "earth", zone: c.zone, ...c.props,
}));

// ── VENTANAS DEL AVATAR ───────────────────────────────────────────────────────
// ⛔ FIX ANTI-PANTALLA-NEGRA (video-pipeline regla 2, 2ª causa): los componentes
// OVERLAY van ENCIMA del avatar — NO lo ocultan y NO recortan el b-roll de abajo.
// Si contaran como "cubierto", en un overlay parcial (HighlightSweep/PullQuote en
// zona "top") no quedaría ni b-roll ni avatar => segundos de NEGRO.
// Base = FULL: el avatar es el fondo garantizado.
const rawSpans = rawBeats.map((b) => [b.start, +(b.start + b.dur).toFixed(2)]);
const covered = (t) => rawSpans.some(([s, e]) => s <= t && e > t);

// Las ventanas se construyen por INTERVALOS EXACTOS (unión de los spans del b-roll),
// no muestreando cada 0,1s: muestrear deja el borde entre dos puntos de la grilla y
// aparecen milisegundos en que la ventana dice "hidden" pero ya no hay nada debajo.
const merged = [];
for (const [s, e] of [...rawSpans].sort((a, b) => a[0] - b[0])) {
  const last = merged[merged.length - 1];
  if (last && s <= last[1] + 0.001) last[1] = Math.max(last[1], e);
  else merged.push([s, e]);
}
const windows = [];
let t0 = 0;
for (const [s, e] of merged) {
  if (s > t0 + 0.001) windows.push({ start: +t0.toFixed(2), mode: "full" });
  windows.push({ start: +Math.max(s, 0).toFixed(2), mode: "hidden" });
  t0 = Math.min(e, TOTAL);
}
if (t0 < TOTAL - 0.001) windows.push({ start: +t0.toFixed(2), mode: "full" });
if (!windows.length || windows[0].start > 0) windows.unshift({ start: 0, mode: "full" });
windows.push({ start: +TOTAL.toFixed(2), mode: "hidden" });

// ── COMPUERTA OBJETIVA: 0 instantes sin nada en pantalla ──────────────────────
// Simula el timeline REAL (misma lógica que las ventanas) y exige que en ningún
// momento el avatar esté oculto sin b-roll debajo.
let holes = 0, firstHole = null;
for (let t = 0; t < TOTAL; t = +(t + 0.05).toFixed(2)) {
  let mode = "full";
  for (const w of windows) { if (w.start <= t) mode = w.mode; else break; }
  if (mode !== "full" && !covered(t)) { holes++; if (firstHole === null) firstHole = t; }
}

const beats = [...rawBeats, ...compBeats].sort((a, b) => a.start - b.start);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, beats }, null, 1));
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);

// ── INFORME ───────────────────────────────────────────────────────────────────
const avSecs = windows.reduce((a, w, i) => a + (w.mode === "full" ? ((windows[i + 1]?.start ?? TOTAL) - w.start) : 0), 0);
const durs = rawBeats.map((b) => b.dur).sort((a, b) => a - b);
const q = (p) => durs[Math.floor(durs.length * p)];
const kinds = {}; for (const c of compBeats) kinds[c.comp] = (kinds[c.comp] || 0) + 1;
const half = TOTAL / 2;

console.log(`b-roll ${rawBeats.length}  (clips ${nClip} · colas-foto ${nTail} · fotos ${nPhoto})`);
if (missing.length) console.log(`⚠ SIN ASSET (${missing.length}): ${missing.slice(0, 10).join(", ")}`);
console.log(`pacing: mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · ≥5s ${(durs.filter(d => d >= 5).length / durs.length * 100).toFixed(0)}% · techo ${durs[durs.length - 1].toFixed(1)}s`);
console.log(`componentes ${compBeats.length} · tipos ${Object.keys(kinds).length} · 1ª mitad ${compBeats.filter(c => c.start < half).length} / 2ª ${compBeats.filter(c => c.start >= half).length}`);
console.log(`avatar full ${avSecs.toFixed(0)}s / ${TOTAL.toFixed(0)}s = ${(avSecs / TOTAL * 100).toFixed(0)}%`);
console.log(holes === 0 ? "✅ COMPUERTA ANTI-HUECO: 0 instantes sin contenido" : `⛔ ${holes} instantes vacíos (1º @ ${firstHole}s)`);
console.log(`total ${(TOTAL / 60).toFixed(2)} min · beats ${beats.length}`);
if (holes > 0) process.exit(1);
