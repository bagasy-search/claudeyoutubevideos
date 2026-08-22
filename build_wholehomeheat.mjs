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
// Escenas FloatCards: cada tarjeta entra en el ms EXACTO en que el narrador nombra
// esa cosa. Son OVERLAY (no tapan el avatar) y no cuentan como cobertura.
const fcards  = JSON.parse(fs.readFileSync(`_v3/${SLUG}_floatcards.json`, "utf8").replace(/^﻿/, ""));

// ── B-ROLL ────────────────────────────────────────────────────────────────────
// Cada momento trae su clip Y su foto de respaldo (mismo prompt). Si el hueco es
// más largo que el clip, entra la foto a taparle la cola: un corte más, mismo tema,
// en vez de dejar avatar suelto (agnes-broll §1).
// Etiqueta de la tarjeta flotante, sacada del nombre del momento (whh_chimney_outside
// -> "Chimney outside"). Le da el aire "diseñado" que tiene una tarjeta con rótulo.
const KICKER_FIX = { co: "CO", "50": "50°F" };
const kickerOf = (name) => name.replace(/^whh_/, "").split("_")
  .map((w) => KICKER_FIX[w] || w).join(" ")
  .replace(/^./, (c) => c.toUpperCase());
const compSpans = comps.map((c) => [c.start, +(c.start + c.dur).toFixed(2)]);
const underComp = (a, b) => compSpans.some(([s2, e2]) => a < e2 && b > s2);

const raw = [];
let nClip = 0, nPhoto = 0, nTail = 0, nFloat = 0, missing = [];
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

  // ★ COLD OPEN = TRAILER (regla dura de amish-doc + pasada HOOK del pipeline).
  // Los primeros ~30s deciden la retención de TODO el video: cortes de 1,4-2,6s,
  // nada de fotos sostenidas. Recién después baja al ritmo pausado del cuerpo.
  const TRAILER = m.ms < 30;
  const trailerCut = [1.6, 2.6, 2.0, 2.6, 1.8, 2.4][i % 6];   // variado, no metrónomo
  let slot = Math.min(gap, TRAILER ? trailerCut : 9);
  // En los momentos MUY amplios el visual no llena todo el hueco: los últimos ~1,8s
  // vuelven al AVATAR. Sube la presencia del presentador (piso 28%) y da respiro
  // antes del próximo corte, que es la identidad Amish (pausado, deja respirar).
  if (slot >= 7) slot = +(slot - 1.8).toFixed(2);          // techo Amish: sostener, pero no clavar
  // ⛔ ANTI-METRONOMO (regla 1): si TODO momento se corta a los 4s del clip, la
  // mediana y el p75 dan 4,00 y el video "cambia una por segundo, cansa". Hace falta
  // que ~4 de cada 10 planos pasen los 5s. El clip agnes dura 4,04s fijos, así que
  // los planos LARGOS los sostiene la FOTO (Ken Burns lento = identidad Amish).
  const roomy = !TRAILER && slot >= 4.6;
  const holdPhoto = roomy && hasJpg && (i % 10 < 6);  // ~60% de los momentos amplios: foto SOSTENIDA
  if (holdPhoto) {
    raw.push({ start: m.ms, dur: +slot.toFixed(2), src: jpg, vid: false });
    nPhoto++;
  } else if (hasMp4) {
    const d = +Math.min(slot, CLIP_DUR).toFixed(2);
    // ★ EL CLIP DENTRO DE UNA ESCENA, no suelto a pantalla completa.
    // FloatingInsert = tarjeta que entra con resorte, con sombra y flotación, y el
    // PRESENTADOR queda vivo detrás (los floats son overlay sobre el avatar full).
    // Se alternan los lados y se evita pisar un componente. El resto del metraje sí
    // va a sangre: la mezcla es lo que hace que no se sienta ni plano ni repetitivo.
    const canFloat = !TRAILER && d >= 3.0 && !underComp(m.ms, m.ms + d);
    if (canFloat && nFloat * 3 < nClip + 1) {
      raw.push({ start: m.ms, dur: d, src: mp4, vid: true, float: true,
                 side: nFloat % 2 ? "left" : "right", kicker: kickerOf(m.name) });
      nFloat++;
    } else {
      raw.push({ start: m.ms, dur: d, src: mp4, vid: true });
    }
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
    raw.push({ start: m.ms, dur: +Math.min(slot, 8).toFixed(2), src: jpg, vid: false });   // sin piso: forzar 2,2s pisaba el momento siguiente
    nPhoto++;
  }
}
raw.sort((a, b) => a.start - b.start);

const rawBeats = raw.map((b, i) => (b.float
  ? { id: `${SLUG}_f${i}`, start: b.start, kind: "float", src: b.src, side: b.side,
      kicker: b.kicker, hue: "amber", dur: b.dur }
  : { id: `${SLUG}_${i}`, start: b.start, kind: "raw", src: b.src, hue: "amber", darken: 0,
      dur: b.dur, ...(b.vid ? { noSplit: true } : {}) }));

// ── COMPONENTES (overlay premium) ─────────────────────────────────────────────
const cardBeats = fcards.map((f, i) => ({
  id: `fc_${i}`, start: f.start, dur: f.dur, kind: "floatcards", overlay: true, cards: f.cards,
}));

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
// ⛔ Los floats son tarjetas SOBRE el avatar: no cuentan como cobertura, o el avatar
// se ocultaría y la tarjeta flotaría sobre un fondo vacío.
const rawSpans = rawBeats.filter((b) => b.kind === "raw")
  .map((b) => [b.start, +(b.start + b.dur).toFixed(2)]);
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
// ⛔ ANTI-DESTELLO (reportado: "por milésimas se ve el fondo vacío al cambiar de
// avatar a b-roll"). Causa: `sec()` redondea segundos->frames, y el borde de la
// ventana del avatar y el arranque del Sequence del b-roll pueden caer en frames
// distintos => 1 frame (33ms) sin nada. Afinar el muestreo NO alcanza: hay que
// SOLAPAR. La ventana "hidden" se angosta HANDOFF a cada lado, así en cada relevo
// el avatar sigue vivo debajo del b-roll (invisible, pero tapando el agujero).
const HANDOFF = 0.14;   // ~4 frames a 30fps
const windows = [];
let t0 = 0;
for (let [s, e] of merged) {
  if (e - s > HANDOFF * 2 + 0.1) { s = +(s + HANDOFF).toFixed(2); e = +(e - HANDOFF).toFixed(2); }
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
for (let f = 0; f < Math.round(TOTAL * 30); f++) {
  const t = +(f / 30).toFixed(4);
  let mode = "full";
  for (const w of windows) { if (w.start <= t) mode = w.mode; else break; }
  if (mode !== "full" && !covered(t)) { holes++; if (firstHole === null) firstHole = t; }
}

const beats = [...rawBeats, ...compBeats, ...cardBeats].sort((a, b) => a.start - b.start);
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

console.log(`b-roll ${rawBeats.length}  (clips ${nClip} · TARJETAS FLOTANTES ${nFloat} · colas-foto ${nTail} · fotos ${nPhoto})`);
if (missing.length) console.log(`⚠ SIN ASSET (${missing.length}): ${missing.slice(0, 10).join(", ")}`);
console.log(`pacing: mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · ≥5s ${(durs.filter(d => d >= 5).length / durs.length * 100).toFixed(0)}% · techo ${durs[durs.length - 1].toFixed(1)}s`);
console.log(`escenas FloatCards ${cardBeats.length} (${cardBeats.reduce((a,c)=>a+c.cards.length,0)} tarjetas)`);
console.log(`componentes ${compBeats.length} · tipos ${Object.keys(kinds).length} · 1ª mitad ${compBeats.filter(c => c.start < half).length} / 2ª ${compBeats.filter(c => c.start >= half).length}`);
console.log(`avatar full ${avSecs.toFixed(0)}s / ${TOTAL.toFixed(0)}s = ${(avSecs / TOTAL * 100).toFixed(0)}%`);
console.log(holes === 0 ? "✅ COMPUERTA ANTI-HUECO: 0 instantes sin contenido" : `⛔ ${holes} instantes vacíos (1º @ ${firstHole}s)`);
console.log(`total ${(TOTAL / 60).toFixed(2)} min · beats ${beats.length}`);
if (holes > 0) process.exit(1);
