// gen_parpados60.mjs — beatsheet/parpados60.json · Canal "Federer - Más Salud, Más Vida" (id70)
// ¿PÁRPADOS CAÍDOS? HAZ ESTO — Levanta tus Párpados Después de los 60
//
// PARTICULARIDADES (adaptado de gen_fcsdeterioro.mjs):
//  · Avatar PARCIAL: el creador grabó 0 -> AVATAR_END (12:22). Después el avatar sigue como
//    FONDO EN BUCLE (AvatarLayerLoopFcs), así que NUNCA hay hueco negro — pero el lipsync ya
//    no calza, así que después de AVATAR_END se exige COBERTURA ALTA de clips/fotos.
//  · Los assets se indexan por el ÍNDICE DEL MOMENTO (nunca por un contador corrido: eso
//    desfasa todo el video un lugar — medido en cmetemu, 22 de 52 planos mostrando al vecino).
//  · Los start/dur se emiten YA ALINEADOS A FRAME (si no, el redondeo por separado deja
//    huecos de 1 frame = destellos de 33 ms que blackdetect no ve).
import fs from "fs";
import { spawnSync } from "child_process";

const SLUG = "parpados60";
const FPS = 30;
const MAX_PLANO = +(process.env.MAX_PLANO || 8);
const HERO_CAP_AV = 3.8;   // con el avatar detrás la foto no necesita estirarse

const rd = (p) => JSON.parse(fs.readFileSync(p, "utf8").replace(/^﻿/, ""));
const SEAM = rd(`_${SLUG}_seam.json`);
const VIDEO_END = +SEAM.VIDEO_END.toFixed(2);
const AVATAR_END = +SEAM.AVATAR_MP4_DUR.toFixed(3);

const probeDur = (p) => {
  if (!fs.existsSync(p)) return 0;
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], { encoding: "utf8" });
  const d = parseFloat((r.stdout || "").trim());
  return isFinite(d) ? d : 0;
};

const MOM = rd(`_v3/${SLUG}_moments.json`);       // [{i,name,ms(seg),frase}]
const SPEC = rd(`_v3/${SLUG}_img.json`);          // [{name,prompt,frase}] mismo orden que el spec
const kindOf = Object.fromEntries(rd(`_v3/${SLUG}_spec_kinds.json`).map((x) => [x.name, x.kind]));
const N = MOM.length;
const start = MOM.map((m) => m.ms);
const slotOf = (i) => +((i + 1 < N ? start[i + 1] : VIDEO_END) - start[i]).toFixed(2);

const IMGDIR = `img/${SLUG}`;
const CLIPDIR = `broll/${SLUG}`;
const LUMA = fs.existsSync(`_luma_${SLUG}.json`) ? rd(`_luma_${SLUG}.json`) : {};
// clips rechazados por el AUDITOR de movimiento (corte de escena / cambio imposible / frame roto).
// ⛔ No se borran del disco (feedback_no_borrar_assets_pagos): el build simplemente no los monta
//    y el momento cae a su propia foto, que tiene el MISMO prompt.
const REJ = new Set(fs.existsSync(`_v3/${SLUG}_clip_rejects.json`) ? rd(`_v3/${SLUG}_clip_rejects.json`) : []);
// clips REPARADOS (2ª pasada con el bloque de camara fija) que SI pasaron el auditor de movimiento.
// Si el original fue rechazado pero su `_r2` aprobo, se monta el _r2.
const R2 = new Set((fs.existsSync(`_v3/${SLUG}_r2_ok.json`) ? rd(`_v3/${SLUG}_r2_ok.json`) : [])
  .map((n) => String(n).replace(/\.mp4$/, "")));

const BROLL = [], PHOTOS = [];
const oscuros = [], sinAsset = [];

for (let i = 0; i < N; i++) {
  const nm = MOM[i].name;
  const st = start[i], slot = slotOf(i);
  const conAvatar = st + slot <= AVATAR_END;

  // 1) CLIP real — su duración REAL menos 0.1 (no congelar el último frame)
  const clipPath = `public/${CLIPDIR}/${nm}.mp4`;
  const luma = LUMA[nm];
  const oscuro = luma != null && luma < 25;
  if (oscuro) oscuros.push(`${nm}(${luma.toFixed(0)})`);
  let used = 0;
  const r2Path = `public/${CLIPDIR}/${nm}_r2.mp4`;
  const usaR2 = REJ.has(nm) && R2.has(`${nm}_r2`) && fs.existsSync(r2Path);
  const buenoOriginal = !REJ.has(nm) && fs.existsSync(clipPath);
  if (kindOf[nm] === "clip" && !oscuro && (buenoOriginal || usaR2)) {
    const usePath = usaR2 ? r2Path : clipPath;
    const useRel = usaR2 ? `${CLIPDIR}/${nm}_r2.mp4` : `${CLIPDIR}/${nm}.mp4`;
    const real = probeDur(usePath) || 5.1;
    const cov = +Math.max(0.8, Math.min(slot, real - 0.1)).toFixed(2);
    BROLL.push({ name: usaR2 ? `${nm}_r2` : nm, src: useRel, start: +st.toFixed(2), cov, dur: cov, i });
    used = cov;
  }

  // 2) FOTO del MISMO momento (nunca la del vecino: la 2ª lectura del mismo sujeto)
  const rel = `${IMGDIR}/${nm}.jpg`;
  const hay = fs.existsSync(`public/${rel}`);
  let rest = +(slot - used).toFixed(2);
  if (hay && rest > 0.5) {
    if (conAvatar) {
      PHOTOS.push({ name: `ph_${nm}`, src: rel, start: +(st + used).toFixed(2), cov: +Math.min(rest, HERO_CAP_AV).toFixed(2), i });
    } else {
      PHOTOS.push({ name: `ph_${nm}`, src: rel, start: +(st + used).toFixed(2), cov: rest, i });
    }
  } else if (!hay && rest > 0.5) {
    // CAMA prestada del vecino más cercano (los componentes full-screen dejan ~60px de marco)
    if (!kindOf[nm] || !fs.existsSync(clipPath)) sinAsset.push(nm);
    let ph = null;
    for (let d = 1; d < 30 && !ph; d++) {
      for (const k of [i - d, i + d]) {
        if (k < 0 || k >= N) continue;
        const cand = `${IMGDIR}/${MOM[k].name}.jpg`;
        if (fs.existsSync(`public/${cand}`)) { ph = cand; break; }
      }
    }
    if (ph) PHOTOS.push({ name: `bed_${nm}`, src: ph, start: +(st + used).toFixed(2), cov: rest, i, bed: true });
  }
}

// ── COMPONENTES ────────────────────────────────────────────────────────────────
const COMPS_SRC = fs.existsSync(`_v3/${SLUG}_comps.json`) ? rd(`_v3/${SLUG}_comps.json`) : [];
const CMP = [];
for (const c of COMPS_SRC) {
  const i = c.i;
  if (i == null || start[i] == null) continue;
  const slot = slotOf(i);
  // TIEMPO DE LECTURA: piso por TEXTO, no por slot. Los overlay pueden pasarse del slot.
  const dur = +Math.max(3.4, Math.min(c.dur || slot, slot + (c.over || 0))).toFixed(2);
  const { i: _i, dur: _d, over: _o, ...props } = c;
  CMP.push({ id: `c${String(i).padStart(3, "0")}`, start: +start[i].toFixed(2), dur, ...props });
}

// ── VENTANAS DE AVATAR — base FULL (el avatar es el fondo garantizado, en bucle) ───
const OVERLAY = new Set(["lowerthird", "frasecinetica", "errorstinger", "headline"]);
const covers = [];
for (const b of BROLL) covers.push({ a: b.start, b: b.start + b.cov });
for (const p of PHOTOS) covers.push({ a: p.start, b: p.start + p.cov });
for (const c of CMP) if (!OVERLAY.has(c.kind)) covers.push({ a: c.start, b: c.start + c.dur });
covers.sort((x, y) => x.a - y.a);
const merged = [];
for (const c of covers) {
  const last = merged[merged.length - 1];
  if (last && c.a <= last.b + 0.05) last.b = Math.max(last.b, c.b);
  else merged.push({ ...c });
}
const pts = [];
const push = (s, mode) => { const l = pts[pts.length - 1]; if (!l || l.mode !== mode) pts.push({ start: +Math.max(0, s).toFixed(2), mode }); };
push(0, "full");
let cur = 0;
for (const m of merged) {
  if (m.a > cur + 0.3) push(cur, "full");
  push(m.a, "hidden");
  cur = m.b;
}
if (cur < VIDEO_END - 0.3) push(cur, "full");
const AVATAR_WINDOWS = pts;

// ── COMPUERTA 1: 0 instantes muertos (el avatar en bucle siempre está de fondo) ──
const modeAt = (t) => { let m = "full"; for (const w of AVATAR_WINDOWS) if (t >= w.start) m = w.mode; return m; };
const paint = (t) => {
  if (modeAt(t) === "full") return "avatar";
  for (const b of BROLL) if (t >= b.start && t < b.start + b.cov) return "clip";
  for (const p of PHOTOS) if (t >= p.start && t < p.start + p.cov) return "foto";
  for (const c of CMP) if (t >= c.start && t < c.start + c.dur && !OVERLAY.has(c.kind)) return "comp";
  return null;
};
const scan = () => {
  let dead = 0, from = null; const hs = [];
  for (let t = 0; t < VIDEO_END; t += 0.2) {
    if (paint(t) == null) { dead++; if (from == null) from = t; }
    else if (from != null) { hs.push([+from.toFixed(2), +t.toFixed(2)]); from = null; }
  }
  if (from != null) hs.push([+from.toFixed(2), VIDEO_END]);
  return { dead, hs };
};
for (let pass = 0; pass < 4; pass++) {
  const { hs } = scan();
  if (!hs.length) break;
  for (const [a, b] of hs) {
    const prev = PHOTOS.filter((p) => p.start + p.cov <= a + 0.25).sort((x, y) => (y.start + y.cov) - (x.start + x.cov))[0];
    if (prev) { prev.cov = +(b - prev.start).toFixed(2); continue; }
    const next = PHOTOS.filter((p) => p.start >= b - 0.25).sort((x, y) => x.start - y.start)[0];
    if (next) { next.cov = +(next.cov + (next.start - a)).toFixed(2); next.start = +a.toFixed(2); }
  }
}
const { dead, hs: holes } = scan();

// ── TECHO DE PLANO: partir los planos quietos largos remontando la misma imagen ──
{
  const partidos = [];
  let largos = 0;
  for (const p of PHOTOS) {
    if (p.cov <= MAX_PLANO + 0.5) { partidos.push(p); continue; }
    largos++;
    // ⛔ NO en trozos iguales: eso da mediana y p75 pegados = el metrónomo que el creador
    //    describe como "cambia una por segundo, cansa". Se corta con una ESCALERA VARIADA
    //    (determinista por índice, así el build es reproducible).
    const ESC = [3.1, 5.6, 4.2, 7.0, 3.5, 6.2, 4.8];
    let off = 0, j = 0, e = p.i % ESC.length;
    while (off < p.cov - 0.05) {
      let cov = ESC[(e + j) % ESC.length];
      if (p.cov - off - cov < 2.2) cov = +(p.cov - off).toFixed(2);   // no dejar una colita
      cov = Math.min(cov, +(p.cov - off).toFixed(2));
      partidos.push({ ...p, name: `${p.name}_${j}`, start: +(p.start + off).toFixed(2), cov: +cov.toFixed(2) });
      off = +(off + cov).toFixed(2); j++;
    }
  }
  if (largos) console.log(`planos > ${MAX_PLANO}s partidos: ${largos}`);
  PHOTOS.length = 0; PHOTOS.push(...partidos);
}
PHOTOS.forEach((p) => { p.dur = p.cov; });
BROLL.forEach((b) => { b.dur = b.cov; });

// ── ALINEADO A FRAME (mata los huecos de 1 frame en las fronteras) ──────────────
const F = (s) => Math.round(s * FPS);
const alinear = (arr) => {
  arr.sort((a, b) => a.start - b.start);
  for (let k = 0; k < arr.length; k++) {
    const f0 = F(arr[k].start);
    let f1 = F(arr[k].start + arr[k].dur);
    const sig = arr[k + 1];
    if (sig && Math.abs(F(sig.start) - f1) <= 1) f1 = F(sig.start);
    arr[k].start = +(f0 / FPS).toFixed(4);
    arr[k].dur = +(Math.max(1, f1 - f0) / FPS).toFixed(4);
    arr[k].cov = arr[k].dur;
  }
};
alinear(BROLL); alinear(PHOTOS); alinear(CMP);

// ── salidas ────────────────────────────────────────────────────────────────────
const ts = (n, v) => "export const " + n + ": any[] = " + JSON.stringify(v, null, 1) + ";\n";
fs.writeFileSync(`src/_fed6/VideoEdit/${SLUG}_beats.ts`,
  `// GENERADO por gen_${SLUG}.mjs — no editar a mano\n` +
  ts("P60_BROLL", BROLL) + ts("P60_PHOTOS", PHOTOS) +
  ts("P60_BEATS", CMP) + ts("AVATAR_WINDOWS", AVATAR_WINDOWS) +
  `export const VIDEO_END = ${VIDEO_END};\nexport const AVATAR_END = ${AVATAR_END};\n` +
  `export const AVATAR_FRAMES = ${Math.round(AVATAR_END * FPS)};\n` +
  `export const TOTAL_FRAMES_P60 = ${Math.ceil(VIDEO_END * FPS)};\n`);

const ALL = [
  ...BROLL.map((b) => ({ id: b.name, kind: "raw", src: b.src, start: b.start, dur: b.dur })),
  ...PHOTOS.map((p) => ({ id: p.name, kind: "raw", src: p.src, start: p.start, dur: p.dur })),
  ...CMP,
].sort((a, b) => a.start - b.start);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", beats: ALL }, null, 1));

// ── informe ────────────────────────────────────────────────────────────────────
const durs = [...BROLL.map((b) => b.dur), ...PHOTOS.map((p) => p.dur)].sort((a, b) => a - b);
const q = (p) => durs[Math.floor(durs.length * p)];
const visual = BROLL.reduce((s, b) => s + b.dur, 0) + PHOTOS.reduce((s, p) => s + p.dur, 0);
const post = [...BROLL, ...PHOTOS].filter((x) => x.start >= AVATAR_END).reduce((s, x) => s + x.dur, 0);
console.log(`HUECOS: ${holes.length} tramos, ${(dead * 0.2).toFixed(1)}s muertos`);
if (oscuros.length) console.log(`clips OSCUROS descartados: ${oscuros.join(", ")}`);
if (sinAsset.length) console.log(`momentos SIN asset propio (cama prestada): ${sinAsset.length}`);
console.log(`beats: ${ALL.length} · clips ${BROLL.length} · fotos ${PHOTOS.length} · comps ${CMP.length} · kinds ${[...new Set(CMP.map((c) => c.kind))].length}`);
console.log(`pacing — mediana ${q(0.5)}s · p75 ${q(0.75)}s · p90 ${q(0.9)}s · max ${durs[durs.length - 1]}s · >=5s ${(durs.filter((d) => d >= 5).length / durs.length * 100).toFixed(0)}%`);
console.log(`cobertura visual ${(visual / VIDEO_END * 100).toFixed(0)}% · tramo POST-avatar ${(post / (VIDEO_END - AVATAR_END) * 100).toFixed(0)}%`);
