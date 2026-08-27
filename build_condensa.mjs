// build_condensa.mjs — IMAGE-FIRST (clon del molde azotea2/oxidoporton) con AVATAR PARCIAL.
//   · tramo 1 (0 → AVATAR_END): el mp4 del creador con SU PROPIO audio (lipsync garantizado)
//   · costura POR PALABRA: la cola sale del master Fish cortado en el silencio entre
//     "…aguanta ahí meses." y "Cuando llega la primavera…"
//   · tramo 2 (AVATAR_END → TOTAL): el MISMO mp4 EN BUCLE y MUDO como fondo garantizado
//     (regla anti-hueco: el avatar es el fondo; el contenido cubre sólo su cobertura real)
import fs from "fs";

const SLUG = "condensa";
const AVATAR = `${SLUG}_opt.mp4`;
const AV_DUR = 649.258;      // ffprobe del mp4 del creador
const GAP = 0.30;            // silencio entre el final del avatar y la cola
const TAIL_DUR = 788.267;    // ffprobe de public/condensa_tail.wav
const TAIL_AT = +(AV_DUR + GAP).toFixed(3);
const TOTAL = +(TAIL_AT + TAIL_DUR + 0.5).toFixed(2);

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}_full.json`, "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = caps.map((c) => ({ n: norm(c.text), ms: c.startMs, e: c.endMs }));

const at = (phrase, maxTok = 8) => {
  const toks = norm(phrase).split(" ").filter(Boolean).slice(0, maxTok);
  if (!toks.length) return null;
  for (let i = 0; i <= Wc.length - toks.length; i++) {
    let ok = true;
    for (let j = 0; j < toks.length; j++) if (Wc[i + j].n !== toks[j]) { ok = false; break; }
    if (ok) return Wc[i].ms / 1000;
  }
  // fallback: prefijo más corto
  for (let k = toks.length - 1; k >= 4; k--) {
    const t2 = toks.slice(0, k);
    for (let i = 0; i <= Wc.length - t2.length; i++) {
      let ok = true;
      for (let j = 0; j < t2.length; j++) if (Wc[i + j].n !== t2[j]) { ok = false; break; }
      if (ok) return Wc[i].ms / 1000;
    }
  }
  return null;
};
const atc = (p, m) => { const v = at(p, m); if (v == null) console.warn("⚠ anchor missing:", p.slice(0, 55)); return v; };

// ── SECCIONES (del §0 DIRECTOR) ───────────────────────────────────────────────
const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^﻿/, ""));
const SECS = [
  ["S1", "Son las siete de la mañana"],
  ["S2", "Y sé exactamente lo que vas a hacer"],
  ["S3", "Hoy vamos a terminar con eso"],
  ["S4", "Y no es que no lo hayas intentado"],
  ["S5", "Déjame contarte cómo aprendí yo esto"],
  ["S6", "Así que quédate conmigo hasta el final"],
  ["S7", "Vamos al principio"],
  ["S8", "Ahora presta atención, porque esto es el corazón"],
  ["S9", "Y ahora la pregunta que casi nadie se hace"],
  ["S10", "Entonces, ¿qué es lo que sí sirve?"],
  ["S11", "Para subir la temperatura del vidrio no hay que calentarlo"],
  ["S12", "Se hace así. Primero limpia el vidrio"],
  ["S13", "Y acá tengo que contarte por qué lo limpias"],
  ["S14", "Por eso la solución no es un producto milagroso"],
  ["S15", "Ahora quiero que prestes muchísima atención a esta imagen"],
  ["S16", "Y ahora seguimos, porque todavía falta"],
  ["S17", "Y ahora sí, llegamos al error"],
  ["S18", "Así que quédate con esta regla"],
];
const secById = Object.fromEntries(plan.secciones.map((s) => [s.id, s]));
const bounds = [];
for (let i = 0; i < SECS.length; i++) {
  const s = atc(SECS[i][1], 8);
  bounds.push({ id: SECS[i][0], start: s == null ? null : s });
}
for (let i = 0; i < bounds.length; i++) {
  if (bounds[i].start == null) bounds[i].start = i ? bounds[i - 1].start + 30 : 0;
  bounds[i].end = i + 1 < bounds.length ? null : TOTAL;
}
for (let i = 0; i < bounds.length - 1; i++) bounds[i].end = bounds[i + 1].start;
bounds[0].start = 0;

// ── MOMENTOS: ritmo VARIADO (mediana ~4,4s · ~40% ≥5s · techo 12s) ────────────
const CYCLE = [3.6, 3.2, 5.2, 4.0, 3.4, 6.8, 3.8, 4.8, 3.4, 6.0, 4.2, 3.2, 8.0, 3.8, 5.0];
const moments = [];
let ci = 0;
for (const b of bounds) {
  const ws = caps.filter((c) => c.startMs / 1000 >= b.start - 0.001 && c.startMs / 1000 < b.end);
  if (!ws.length) continue;
  let t0 = ws[0].startMs / 1000;
  for (let i = 0; i < ws.length; i++) {
    const tgt = CYCLE[ci % CYCLE.length];
    const tw = ws[i].endMs / 1000;
    if (tw - t0 >= tgt || i === ws.length - 1) {
      const end = i === ws.length - 1 ? b.end : ws[Math.min(i + 1, ws.length - 1)].startMs / 1000;
      if (end - t0 > 0.9) moments.push({ sec: b.id, ms: Math.round(t0 * 1000), span: +(end - t0).toFixed(2) });
      t0 = end; ci++;
    }
  }
}

// ── ASSETS por sección (del plan) ─────────────────────────────────────────────
const exists = (p) => fs.existsSync(`public/${p}`);
const rawBeats = [];
const useCount = {};
const globalClips = new Set();
for (const b of bounds) {
  const S = secById[b.id];
  if (!S) continue;
  const imgs = (S.imagenes || []).map((n) => `img/${n}.png`).filter(exists);
  const clips = (S.clips || []).map((n) => `broll/${n}.mp4`).filter(exists);
  const mine = moments.filter((m) => m.sec === b.id);
  let ii = 0, ki = 0;
  mine.forEach((m, idx) => {
    // 1 de cada 4 momentos va a CLIP real (movimiento); el resto, imagen
    const useClip = clips.length && idx % 4 === 3;
    let src;
    if (useClip) {
      // preferí un clip que TODAVÍA no se usó en ninguna sección (el gate exige ≥35 distintos)
      const fresh = clips.find((c) => !globalClips.has(c));
      src = fresh || clips[ki % clips.length];
      globalClips.add(src); ki++;
    }
    else { src = imgs.length ? imgs[ii % imgs.length] : (clips.length ? clips[ki++ % clips.length] : null); ii++; }
    if (!src) return;
    useCount[src] = (useCount[src] || 0) + 1;
    rawBeats.push({
      id: `b_${b.id}_${idx}`, start: +(m.ms / 1000).toFixed(2), _span: m.span,
      src, kind: "raw", hue: "amber", darken: 0,
      ...(src.endsWith(".mp4") ? { noSplit: true } : { isImg: true }),
    });
  });
}
rawBeats.sort((a, b) => a.start - b.start);

// ── LÁMINA sostenida (arma de conversión) ─────────────────────────────────────
const LAMINA = [
  "Mira lo que tienes ahí",
  "Si afuera hay 10 grados",
  "Esa es la línea invisible",
  "Abajo a la izquierda tienes el corte",
  "Y abajo a la derecha, los tres lugares",
];
for (const ph of LAMINA) {
  const s = at(ph, 9);
  if (s == null) { console.warn("⚠ LAMINA anchor missing:", ph.slice(0, 45)); continue; }
  let bi = -1, bd = 1e9;
  rawBeats.forEach((b, i) => { const d = b.start - s; if (d >= -1.2 && Math.abs(d) < bd) { bd = Math.abs(d); bi = i; } });
  if (bi < 0) continue;
  rawBeats[bi].src = "img/condensa_lamina.png"; rawBeats[bi].lamina = true; rawBeats[bi].isImg = true; delete rawBeats[bi].noSplit;
}

// ── FORCE_CLIP: clips clave clavados a SU frase (mejor que dejarlos al reparto) ──
const FORCE_CLIP = [
  { src: "broll/cond_vaho_vidrio.mp4", at: "El vidrio entero empañado" },
  { src: "broll/cond_gotas_ventana.mp4", at: "Toda la noche, gota tras gota" },
  { src: "broll/cond_ropa_interior.mp4", at: "Una tanda de ropa tendida adentro" },
  { src: "broll/cond_vaso_frio.mp4", at: "Lo apoyas en la mesa y a los tres minutos" },
  { src: "broll/cond_limpiar_vidrio.mp4", at: "Primero limpia el vidrio del lado de adentro" },
  { src: "broll/cond_burbujas_manos.mp4", at: "apoya el plástico con el lado de las burbujas" },
];
for (const f of FORCE_CLIP) {
  const s2 = at(f.at, 9);
  if (s2 == null) { console.warn("⚠ FORCE_CLIP anchor missing:", f.at.slice(0, 45)); continue; }
  let bi = -1, bd = 1e9;
  rawBeats.forEach((b, i) => { const d = b.start - s2; if (d >= -1.2 && Math.abs(d) < bd) { bd = Math.abs(d); bi = i; } });
  if (bi < 0) { console.warn("⚠ FORCE_CLIP sin beat:", f.at.slice(0, 45)); continue; }
  const b = rawBeats[bi];
  b.src = f.src; b.noSplit = true; delete b.isImg; delete b.lamina;
  console.log(`FORCE_CLIP ${f.src.split("/").pop()} @${b.start.toFixed(0)}s`);
}

// ── FORCE: CTA (portada / landing) ────────────────────────────────────────────
const FORCE = [
  { src: "img/condensa_portada.png", at: "Es una de las páginas de la guía completa", cta: true },
  { src: "img/condensa_landing.png", at: "La tienes en la descripción", cta: true },
];
for (const f of FORCE) {
  const s = at(f.at, 9);
  if (s == null) { console.warn("⚠ FORCE anchor missing:", f.at.slice(0, 45)); continue; }
  let bi = -1, bd = 1e9;
  rawBeats.forEach((b, i) => { const d = b.start - s; if (d >= -1.2 && Math.abs(d) < bd) { bd = Math.abs(d); bi = i; } });
  if (bi < 0) { console.warn("⚠ FORCE sin beat:", f.at.slice(0, 45)); continue; }
  const b = rawBeats[bi];
  b.src = f.src; b.cta = true; b.isImg = true; delete b.lamina; delete b.noSplit;
  console.log(`FORCE ${f.src.split("/").pop()} @${b.start.toFixed(0)}s`);
}

// ── duración real de cada beat (cobertura real de clips: anti-hueco) ──────────
const clipDur = JSON.parse(fs.readFileSync(`_v3/${SLUG}_clipdur.json`, "utf8"));
for (let i = 0; i < rawBeats.length; i++) {
  const next = i + 1 < rawBeats.length ? rawBeats[i + 1].start : TOTAL;
  const gap = next - rawBeats[i].start;
  const isClip = rawBeats[i].src.endsWith(".mp4");
  const cov = isClip ? Math.min(gap, (clipDur[rawBeats[i].src.split("/").pop()] || 6) - 0.1, 11) : gap;
  const cap = rawBeats[i].lamina ? 12 : rawBeats[i].cta ? 5.0 : isClip ? 11 : 9;
  rawBeats[i].dur = +Math.max(0.9, Math.min(rawBeats[i]._span + 0.25, cov + 0.15, cap)).toFixed(2);
  delete rawBeats[i]._span; delete rawBeats[i].isImg;
}

// ── FLOAT: QR al lado del avatar hablando (regla dura del nicho) ──────────────
const FLOATS = [
  { at: "apunta la cámara de tu teléfono a este código", src: "img/condensa_qr_land.png", side: "right", kicker: "Escanea con tu celular", hue: "amber", dur: 8 },
];
const floatBeats = [];
for (const f of FLOATS) {
  const s = at(f.at, 9);
  if (s == null) { console.warn("⚠ FLOAT anchor missing:", f.at.slice(0, 45)); continue; }
  const e = s + f.dur;
  for (let i = rawBeats.length - 1; i >= 0; i--) if (rawBeats[i].start >= s - 0.6 && rawBeats[i].start < e - 0.4) rawBeats.splice(i, 1);
  floatBeats.push({ id: `float_qr_${Math.round(s)}`, start: +s.toFixed(2), dur: f.dur, kind: "float", overlay: true, src: f.src, side: f.side, kicker: f.kicker, hue: f.hue });
  console.log(`FLOAT qr @${s.toFixed(0)}s (avatar full detrás)`);
}

// ── COMPONENTES ───────────────────────────────────────────────────────────────
const cplan = JSON.parse(fs.readFileSync(`_v3_${SLUG}_plan.json`, "utf8").replace(/^﻿/, ""));
const _DUR = { BigStatReveal: 5.4, VsDuel: 6.2, MythTruth: 6.0, HighlightSweep: 5.2, NumberedSteps: 6.6, ChecklistReveal: 6.4, CtaCard: 7.0 };
const compBeats = []; const compCount = {};
for (const c of cplan.componentes) {
  const s = atc(c.at, 8);
  if (s == null) continue;
  const dur = c.dur || _DUR[c.comp] || 5.4;
  compBeats.push({ id: `ov_${c.comp.toLowerCase()}_${Math.round(s)}`, start: +s.toFixed(2), dur, kind: "premium", overlay: true, comp: c.comp, theme: "earth", zone: c.zone || "topLeft", ...c.props });
  compCount[c.comp] = (compCount[c.comp] || 0) + 1;
}
const compSpans = compBeats.map((b) => [b.start, +(b.start + b.dur).toFixed(2)]);

// ── VENTANAS DE AVATAR FULL ───────────────────────────────────────────────────
// Tramo 1 (lipsync real): presencia normal. Tramo 2 (BUCLE, sin lipsync): presencia
// reducida — el avatar es el FONDO garantizado, pero se lo tapa casi siempre.
const snapWord = (tt) => { for (const c of caps) if (c.startMs / 1000 >= tt - 0.05) return c.startMs / 1000; return tt; };
const overlapsComp = (a, b) => compSpans.some(([s, e]) => a < e && b > s);
const fulls = [[0, snapWord(9)]];
const pushFull = (target, slot) => {
  const s = snapWord(target), e = s + slot;
  if (!overlapsComp(s, e)) fulls.push([s, e]);
};
for (let t = 9 + 15; t < AV_DUR - 10; t += 15) pushFull(t, 5.0);            // tramo 1
for (let t = AV_DUR + 14; t < TOTAL - 14; t += 27) pushFull(t, 3.0);       // tramo 2 (bucle)
const csw = snapWord(TOTAL - 7);
if (!overlapsComp(csw, TOTAL)) fulls.push([csw, TOTAL - 0.05]);
const inFull = (t) => fulls.some(([s, e]) => t >= s - 0.01 && t < e - 0.2);
const keptRaw = rawBeats.filter((b) => b.cta || b.lamina || !inFull(b.start));

// ── ventanas = COMPLEMENTO EXACTO de la cobertura (0 huecos por construcción) ──
const rawSpans = keptRaw.map((b) => [b.start, +(b.start + b.dur).toFixed(3)]);
// ⛔ los COMPONENTES son OVERLAY: van ENCIMA del avatar, NO en su lugar. Si se los
//    metiera acá, el avatar quedaría oculto detrás de un componente sin b-roll debajo
//    y se vería el fondo muerto (bug medido en `estoalos70`). El avatar es la CAMA.
const spans = [...rawSpans].sort((a, b) => a[0] - b[0]);
const merged = [];
for (const [s, e] of spans) {
  if (merged.length && s <= merged[merged.length - 1][1] + 0.001) merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
  else merged.push([s, e]);
}
const D = 0.07;
const hid = merged.map(([s, e]) => [s + D, e - D]).filter(([s, e]) => e - s > 0.05);

const mkWindows = (from, to, rebase) => {
  const out = [];
  const push = (start, mode) => { const st = +Math.max(0, start - rebase).toFixed(3); if (!out.length || out[out.length - 1].mode !== mode) out.push({ start: st, mode }); };
  const first = hid.find(([s, e]) => e > from && s <= from + 0.02);
  push(from, first ? "hidden" : "full");
  for (const [s, e] of hid) {
    if (e <= from || s >= to) continue;
    push(Math.max(s, from), "hidden");
    push(Math.min(e, to), "full");
  }
  out.push({ start: +(to - rebase).toFixed(3), mode: "hidden" });
  return out;
};
const WIN_A = mkWindows(0, AV_DUR, 0);
const WIN_B = mkWindows(AV_DUR, TOTAL, AV_DUR);

for (const b of keptRaw) { delete b.cta; delete b.lamina; }
const beats = [...keptRaw, ...compBeats, ...floatBeats].sort((a, b) => a.start - b.start);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, beats }, null, 1));
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\n` +
  `import type { AvatarWindow } from "./scenes/AvatarLayer";\n` +
  `export const TOTAL_CONDENSA = ${TOTAL};\n` +
  `export const AVATAR_END = ${AV_DUR};\n` +
  `export const TAIL_AT = ${TAIL_AT};\n` +
  `export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(WIN_A, null, 2)};\n` +
  `export const AVATAR_WINDOWS_LOOP: AvatarWindow[] = ${JSON.stringify(WIN_B, null, 2)};\n`);

// ── métricas ──────────────────────────────────────────────────────────────────
const avSecs = (win, from, to) => win.reduce((a, w, i) => a + (w.mode === "full" ? ((win[i + 1]?.start ?? (to - from)) - w.start) : 0), 0);
const a1 = avSecs(WIN_A, 0, AV_DUR), a2 = avSecs(WIN_B, AV_DUR, TOTAL);
const durs = keptRaw.map((b) => b.dur).sort((a, b) => a - b);
const med = durs[Math.floor(durs.length / 2)], p75 = durs[Math.floor(durs.length * 0.75)];
const pct5 = (100 * durs.filter((d) => d >= 5).length / durs.length).toFixed(0);
const cov = merged.reduce((a, [s, e]) => a + Math.min(e, TOTAL) - s, 0);
const nClip = keptRaw.filter((b) => b.src.endsWith(".mp4")).length;
console.log(`beats ${beats.length} (raw ${keptRaw.length}/${rawBeats.length} · ${nClip} clips + ${keptRaw.length - nClip} imgs) · componentes ${compBeats.length} (${Object.keys(compCount).length} tipos)`);
console.log(`pacing: mediana ${med}s · p75 ${p75}s · ${pct5}% ≥5s · techo ${durs[durs.length - 1]}s`);
console.log(`avatar full: tramo1 ${a1.toFixed(0)}s/${AV_DUR.toFixed(0)}s (${(100 * a1 / AV_DUR).toFixed(0)}%) · tramo2 BUCLE ${a2.toFixed(0)}s/${(TOTAL - AV_DUR).toFixed(0)}s (${(100 * a2 / (TOTAL - AV_DUR)).toFixed(0)}%)`);
console.log(`cobertura de contenido ${(100 * cov / TOTAL).toFixed(0)}% · dur ${(TOTAL / 60).toFixed(2)} min · ${Math.round(TOTAL * 30)} frames`);
console.log("componentes:", JSON.stringify(compCount));
