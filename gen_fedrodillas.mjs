// gen_fedrodillas.mjs — beatsheet/fedrodillas.json · Canal "Federer Archivos"
// "Camina Así 2 Minutos al Día y tus Rodillas Sanan a los 80". Kit CLÍNICO _fed6.
//
// ⛔ AVATAR PARCIAL: el creador grabó 0..918.741s de un máster de 2760.40s.
//    Desde AVATAR_END el avatar va EN BUCLE y MUTEADO: los labios no sincronizan, así que
//    en esa zona NUNCA queda a la vista — cada momento se cubre al 100% (clip + foto de cola).
//    En la zona AVATAR sí se lo deja respirar en los huecos (es el fondo garantizado).
import fs from "fs";
import { spawnSync } from "child_process";
import { CMP } from "./_cmp_fedrodillas.mjs";

const SLUG = "fedrodillas";
const VIDEO_END = 2760.4;
const AVATAR_END = 918.741;
const HERO_CAP = 3.6;      // foto en zona avatar
const FISH_CAP = 9.0;      // foto en zona fish (tiene que cubrir más)
const FPS = 30;

const has = (p) => fs.existsSync("public/" + p);
const probeDur = (p) => {
  if (!fs.existsSync(p)) return 0;
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], { encoding: "utf8" });
  const d = parseFloat((r.stdout || "").trim());
  return isFinite(d) ? d : 0;
};
const R = (f) => JSON.parse(fs.readFileSync(f, "utf8").replace(/^﻿/, ""));

// ── captions: anclaje por FRASE, tolerante a números y a la deriva del ASR ───
const CAPS = R(`public/captions_${SLUG}.json`);
const NUM = { cero: "0", uno: "1", una: "1", dos: "2", tres: "3", cuatro: "4", cinco: "5", seis: "6",
  siete: "7", ocho: "8", nueve: "9", diez: "10", once: "11", doce: "12", trece: "13", catorce: "14",
  quince: "15", veinte: "20", treinta: "30", cuarenta: "40", cincuenta: "50", sesenta: "60",
  setenta: "70", ochenta: "80", noventa: "90", cien: "100", ciento: "100", mil: "1000" };
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const toks = (s) => norm(s).split(" ").filter(Boolean).map((w) => NUM[w] || w).filter((w) => w !== "y");
const CT = [];
for (const c of (CAPS.words || CAPS)) for (const t of toks(c.text)) CT.push({ t, s: (c.startMs || 0) / 1000 });
// ⛔ Compuerta 3.bis: una compuerta que puede dar cero TIENE que decir cuánto midió.
console.log(`captions: ${CT.length} tokens · último ${CT[CT.length - 1].s.toFixed(1)}s`);

const findMs = (phrase, after = 0) => {
  const p = toks(phrase || "").slice(0, 8);
  if (p.length < 3) return null;
  let best = null, bs = 0;
  for (let i = 0; i <= CT.length - p.length; i++) {
    if (CT[i].s < after) continue;
    let m = 0;
    for (let j = 0; j < p.length; j++) if (CT[i + j].t === p[j]) m++;
    if (m > bs) { bs = m; best = CT[i].s; if (m === p.length) break; }
  }
  return bs >= Math.ceil(p.length * 0.7) ? best : null;
};

// ── MOMENTOS: los 173 anclados por frase + los 97 de relleno (que ya traen ms) ─
const jpg = (p) => p.replace(/\.png$/i, ".jpg");
const pick = (p) => (has(jpg(p)) ? jpg(p) : has(p) ? p : null);
const G = (n) => pick(`img/${n}.png`) || `img/${n}.jpg`;

const DARK = new Set(["fr_024", "fr_122"]);   // luma < 25 → pantalla negra; van con su foto

const MOM = [
  ...R(`_${SLUG}_moments.json`).map((m) => ({ n: m.n, ms: m.ms, dice: m.dice })),
  ...R(`_v3/${SLUG}_gap_imgs.json`).map((m) => ({ n: m.nombre, ms: m.ms, dice: m.dice })),
].filter((m) => has(`img/${m.n}.jpg`) || has(`img/${m.n}.png`))
 .sort((a, b) => a.ms - b.ms);

// dedupe por ms (dos assets en el mismo instante: se queda el primero)
const MOMS = [];
for (const m of MOM) if (!MOMS.length || m.ms - MOMS[MOMS.length - 1].ms > 0.4) MOMS.push(m);
const N = MOMS.length;
const nextStart = (i) => (i + 1 < N ? MOMS[i + 1].ms : VIDEO_END);

// ── capa de contenido ───────────────────────────────────────────────────────
const beats = [], BROLL = [], COVER = [];
let nClip = 0, nFoto = 0, nCola = 0;

for (let i = 0; i < N; i++) {
  const m = MOMS[i];
  const st = m.ms;
  const slot = +(nextStart(i) - st).toFixed(2);
  if (slot < 0.6) continue;
  const zonaFish = st >= AVATAR_END;
  const clip = `broll/${m.n}.mp4`;
  const foto = pick(`img/${m.n}.png`);

  if (has(clip) && !DARK.has(m.n)) {
    const real = probeDur("public/" + clip) || 5.1;
    const cov = +Math.max(0.8, Math.min(slot, real - 0.1)).toFixed(2);
    beats.push({ id: m.n, start: +st.toFixed(2), dur: slot, cov, key: "s", kind: "raw", src: clip, dice: m.dice });
    BROLL.push({ name: m.n, src: clip, start: +st.toFixed(2), dur: slot, cov, query: (m.dice || "").slice(0, 70) });
    COVER.push({ start: +st.toFixed(2), cov, kind: "video", src: clip });
    nClip++;
    // COLA: lo que el clip no llena lo tapa SU MISMA foto (mismo sujeto, otra lectura).
    const resto = +(slot - cov).toFixed(2);
    if (resto > 0.25 && foto) {
      const ts = +(st + cov).toFixed(2);
      const covT = +Math.min(resto, zonaFish ? 13 : HERO_CAP + 2).toFixed(2);
      beats.push({ id: m.n + "_t", start: ts, dur: resto, cov: covT, key: "s", kind: "raw", src: foto, dice: m.dice });
      COVER.push({ start: ts, cov: covT, kind: "photo", src: foto });
      nCola++;
    }
    continue;
  }

  if (!foto) continue;
  let cov = zonaFish ? Math.min(slot, FISH_CAP) : Math.min(slot, HERO_CAP);
  // en ZONA FISH el avatar no puede quedar a la vista: la foto estira hasta tapar el slot
  if (zonaFish && slot - cov > 0.05 && slot <= 13) cov = slot;
  else if (slot - cov > 0.05 && slot - cov < 1.6) cov = slot;   // sin micro-huecos
  cov = +cov.toFixed(2);
  beats.push({ id: m.n, start: +st.toFixed(2), dur: slot, cov, key: "s", kind: "raw", src: foto, dice: m.dice });
  COVER.push({ start: +st.toFixed(2), cov, kind: "photo", src: foto });
  nFoto++;
}

// ── COMPONENTES anclados a la FRASE real ────────────────────────────────────
const capOfDur = { frasecinetica: 5.5, lowerthird: 6, nametag: 6, quote: 8, checklist: 10, stat: 7,
  pizarraexplica: 8.5, malla: 11, bars: 8, mitoverdad: 8.5, lineatiempo: 11, errorstinger: 2.4,
  splitlist: 9, carrusel: 13, callout: 7, recetaescena: 14, hourdial: 6, guardaesto: 10,
  guidecta: 11, rule: 5, process: 9 };

const TODOS = CMP(G);
const missing = [], cmpBeats = [];
for (let k = 0; k < TODOS.length; k++) {
  const spec = TODOS[k];
  const ms = findMs(spec.phrase, 0);
  if (ms == null) { missing.push(spec.phrase); continue; }
  const { phrase, flipPhrase, ...rest } = spec;
  const b = { id: `cmp_${k}_${spec.kind}`, start: +ms.toFixed(2), dur: capOfDur[spec.kind] || 6, key: "s", ...rest };
  if (spec.kind === "mitoverdad") {
    const f = flipPhrase ? findMs(flipPhrase, ms - 1) : null;
    const lastSafe = Math.round(b.dur * FPS) - 26;
    let fr = f != null ? Math.round((f - ms) * FPS) : Math.round(b.dur * FPS * 0.42);
    if (fr < 8 || fr > lastSafe) fr = Math.round(b.dur * FPS * 0.42);
    b.flipAt = fr;
  }
  cmpBeats.push(b);
}
cmpBeats.sort((a, b) => a.start - b.start);

// Los componentes de PANTALLA COMPLETA también cubren: el avatar queda oculto debajo.
// (los OVERLAY flotan encima y NO cuentan como cobertura)
const OVERLAY_K = new Set(["lowerthird", "frasecinetica"]);
for (const b of cmpBeats) {
  if (OVERLAY_K.has(b.kind)) continue;
  const next = cmpBeats.find((x) => x.start > b.start && !OVERLAY_K.has(x.kind));
  const room = next ? next.start - b.start - 0.1 : b.dur;
  COVER.push({ start: b.start, cov: +Math.max(2, Math.min(b.dur, room)).toFixed(2), kind: "comp", src: b.kind });
}

// ── ALINEACIÓN A FRAME (mata los huecos de 1 cuadro entre planos) ───────────
const F = (s) => Math.round(s * FPS);
const raws = beats.filter((b) => b.kind === "raw").sort((a, b) => a.start - b.start);
for (let i = 0; i < raws.length; i++) {
  const c = raws[i], sig = raws[i + 1];
  const f0 = F(c.start);
  let f1 = F(c.start + c.dur);
  if (sig && Math.abs(F(sig.start) - f1) <= 1) f1 = F(sig.start);
  c.start = f0 / FPS;
  c.dur = Math.max(1, f1 - f0) / FPS;
}

const ALL = [...beats, ...cmpBeats].sort((a, b) => a.start - b.start || (a.kind === "raw" ? -1 : 1));
const U = SLUG.toUpperCase();
fs.writeFileSync(`src/_fed6/VideoEdit/${SLUG}_beats.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — NO editar a mano.\n` +
  `export const ${U}_BEATS: any[] = ${JSON.stringify(ALL)};\n` +
  `export const ${U}_BROLL: { name: string; src: string; start: number; dur: number; cov: number; query: string }[] = ${JSON.stringify(BROLL)};\n` +
  `export const ${U}_COVER: { start: number; cov: number; kind: string; src: string }[] = ${JSON.stringify(COVER)};\n` +
  `export const AVATAR_END = ${AVATAR_END};\n` +
  `export const VIDEO_END = ${VIDEO_END};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", beats: ALL }, null, 1));

// ── QA ──────────────────────────────────────────────────────────────────────
const kinds = {}; cmpBeats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const need = new Set();
const walk = (v) => {
  if (typeof v === "string") { if (/^(img|broll|qr_)/.test(v)) need.add(v); return; }
  if (Array.isArray(v)) return v.forEach(walk);
  if (v && typeof v === "object") return Object.values(v).forEach(walk);
};
ALL.forEach(walk);
const miss = [...need].filter((p) => !has(p));

// COBERTURA real (fusionando intervalos) — objetivo ≥90%
const iv = COVER.map((c) => [c.start, c.start + c.cov]).sort((a, b) => a[0] - b[0]);
const mg = [];
for (const x of iv) { if (mg.length && x[0] <= mg[mg.length - 1][1]) mg[mg.length - 1][1] = Math.max(mg[mg.length - 1][1], x[1]); else mg.push([...x]); }
const cubierto = mg.reduce((a, x) => a + (x[1] - x[0]), 0);
// huecos SOLO en zona fish (en zona avatar el avatar es el fondo garantizado)
let libre = 0, peor = 0, t = AVATAR_END;
for (const [a, b] of mg) { if (b <= AVATAR_END) continue; const s = Math.max(a, AVATAR_END); if (s > t) { libre += s - t; peor = Math.max(peor, s - t); } t = Math.max(t, b); }
if (t < VIDEO_END) { libre += VIDEO_END - t; peor = Math.max(peor, VIDEO_END - t); }

// PACING
const durs = raws.map((b) => b.cov ?? b.dur).sort((a, b) => a - b);
const q = (p) => durs[Math.floor(durs.length * p)];

console.log(`\nmomentos ${N} · clips ${nClip} · fotos ${nFoto} · colas ${nCola}`);
console.log(`componentes ${cmpBeats.length} · tipos distintos ${Object.keys(kinds).length}`);
if (missing.length) console.log(`⚠ componentes SIN ancla (${missing.length}): ${missing.map((s) => s.slice(0, 40)).join(" | ")}`);
console.log(`cobertura ${(cubierto / VIDEO_END * 100).toFixed(1)}% · zona FISH sin cubrir ${libre.toFixed(0)}s (peor hueco ${peor.toFixed(1)}s)`);
console.log(`pacing: mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · ≥5s ${(durs.filter((d) => d >= 5).length / durs.length * 100).toFixed(0)}%`);
if (miss.length) { console.log(`⛔ ASSETS FALTANTES (${miss.length}): ${miss.slice(0, 12).join(", ")}`); process.exit(1); }
console.log(`assets verificados en disco: ${need.size} · 0 faltantes`);
