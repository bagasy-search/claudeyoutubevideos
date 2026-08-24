// gen_fcsvarices.mjs — beatsheet/fcsvarices.json · Canal "Federer Consejos Salud" · ROMERO/VÁRICES.
// PARTICULARIDAD: el avatar cubre SOLO 0→AVATAR_END (20:21). Después NO hay avatar, así que el
// tramo 2 necesita cobertura CONTINUA propia (clip + foto que estira hasta el próximo contenido).
// Material: clips agnes (public/broll_fcsvarices/fvNNN.mp4) + fotos agnes (img/fvNNN.png)
// + hero gpt-image (img/fvheroNNN.png) + láminas de diagrama (img/fvdgNNN.png) + kit _fed6.
import fs from "fs";
import { spawnSync } from "child_process";

const SLUG = "fcsvarices";
const VIDEO_END = 3203.7;      // ≥ largo del wav compuesto
const AVATAR_END = 1221.18;    // fin REAL del mp4 del avatar (no tocar: es su propio audio)

const probeDur = (p) => {
  if (!fs.existsSync(p)) return 0;
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], { encoding: "utf8" });
  const d = parseFloat((r.stdout || "").trim());
  return isFinite(d) ? d : 0;
};

// ── captions del audio COMPUESTO (avatar + cola TTS) ───────────────────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findAll = (phrase, minWords = 4) => {
  const p = norm(phrase || "").split(" ").filter(Boolean).slice(0, 7);
  const out = [];
  if (p.length < minWords) return out;
  for (let i = 0; i < CW.length - p.length; i++) {
    let ok = true;
    for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) out.push(CW[i].s);
  }
  return out;
};

// ── momentos + plan del director ───────────────────────────────────────────────
const MOM = JSON.parse(fs.readFileSync(`_v3/${SLUG}_moments.json`, "utf8").replace(/^﻿/, ""));
const PLAN = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^﻿/, ""));
const byI = Object.fromEntries(PLAN.map((x) => [x.i, x]));
const N = MOM.length;

// ── anclaje: cada momento por SUS primeras palabras, eligiendo la ocurrencia más cercana
//    a la posición esperada (evita el runaway del cursor con frases repetidas) ────
const AVG_GAP = VIDEO_END / N;
const WINDOW = 70;
const cand = MOM.map((m) => findAll(m));
const hard = new Array(N).fill(null);
let lastMs = 0, lastI = -1, anchored = 0;
for (let i = 0; i < N; i++) {
  const expected = lastMs + AVG_GAP * (i - lastI);
  const opts = cand[i].filter((s) => s > lastMs + 0.05);
  let best = null, bestD = Infinity;
  for (const s of opts) { const d = Math.abs(s - expected); if (d < bestD) { bestD = d; best = s; } }
  if (best != null && bestD <= WINDOW) { hard[i] = best; lastMs = best; lastI = i; anchored++; }
}
const start = new Array(N);
for (let i = 0; i < N; i++) {
  if (hard[i] != null) { start[i] = hard[i]; continue; }
  let a = i - 1; while (a >= 0 && hard[a] == null) a--;
  let c = i + 1; while (c < N && hard[c] == null) c++;
  const sA = a >= 0 ? hard[a] : 0;
  const sC = c < N && hard[c] != null ? hard[c] : VIDEO_END;
  const iA = a >= 0 ? a : -1;
  const iC = c < N && hard[c] != null ? c : N;
  start[i] = +(sA + (sC - sA) * ((i - iA) / (iC - iA))).toFixed(3);
}
const MINGAP = 0.5;
for (let i = 1; i < N; i++) if (start[i] < start[i - 1] + MINGAP) start[i] = +(start[i - 1] + MINGAP).toFixed(3);
console.log(`anclados duro: ${anchored}/${N} (el resto interpolado entre anclas)`);

const slotOf = (i) => +((i + 1 < N ? start[i + 1] : VIDEO_END) - start[i]).toFixed(2);

// ── CAPA 1/2 — cobertura visual ────────────────────────────────────────────────
// clip real primero (su duración REAL, −0.1 para no congelar el último frame),
// y la foto del MISMO momento estira hasta el próximo momento. En el tramo sin
// avatar eso es lo único que impide ver el fondo, así que no lleva tope.
const BROLL = [];   // clips
const PHOTOS = [];  // fotos (bed)
const HERO_CAP_AV = 3.6;   // con avatar detrás, la foto no necesita estirarse
for (let i = 0; i < N; i++) {
  const p = byI[i]; if (!p) continue;
  const st = start[i], slot = slotOf(i);
  const conAvatar = st + slot <= AVATAR_END;
  const id3 = String(i).padStart(3, "0");
  const clipPath = `public/broll/${SLUG}/fv${id3}.mp4`;
  const photoRel = p.k === "hero" ? `img/fvhero${id3}.png` : `img/fv${id3}.png`;
  const photoAbs = `public/${photoRel}`;
  let used = 0;
  if (p.k === "clip" && fs.existsSync(clipPath)) {
    const real = probeDur(clipPath) || 4;
    const cov = +Math.max(0.8, Math.min(slot, real - 0.1)).toFixed(2);
    BROLL.push({ name: `fv${id3}`, src: `broll/${SLUG}/fv${id3}.mp4`, start: +st.toFixed(2), cov, dur: cov, i });
    used = cov;
  }
  const rest = +(slot - used).toFixed(2);
  if (fs.existsSync(photoAbs) && rest > 0.5) {
    // con avatar: foto topeada (el avatar tapa el resto). sin avatar: la foto CUBRE todo el resto.
    const cov = conAvatar ? +Math.min(rest, HERO_CAP_AV).toFixed(2) : rest;
    PHOTOS.push({ name: `ph${id3}`, src: photoRel, start: +(st + used).toFixed(2), cov, dur: cov, i, hero: p.k === "hero" });
  } else if (!fs.existsSync(photoAbs) && rest > 0.5) {
    // momento de COMPONENTE sin foto propia → CAMA prestada del vecino más cercano.
    // Va en TODO el video, no solo en el tramo sin avatar: los componentes a pantalla
    // completa del kit dejan un marco de ~60px, y con el avatar oculto ese marco mostraba
    // el fondo plano (lo cazó el AUDITOR en el render). Con la cama siempre hay algo vivo.
    let j = i, ph = null;
    for (let d = 1; d < 24 && !ph; d++) {
      for (const k of [i - d, i + d]) {
        const k3 = String(k).padStart(3, "0");
        if (k >= 0 && k < N && fs.existsSync(`public/img/fv${k3}.png`)) { ph = `img/fv${k3}.png`; j = k; break; }
      }
    }
    if (ph) PHOTOS.push({ name: `bed${id3}`, src: ph, start: +st.toFixed(2), cov: slot, dur: slot, i, bed: true, from: j });
  }
}

// ── CAPA 4 — COMPONENTES (props autorados en _v3/<slug>_comps.json) ────────────
const COMPS_SRC = fs.existsSync(`_v3/${SLUG}_comps.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_comps.json`, "utf8").replace(/^﻿/, "")) : [];
const CMP = [];
for (const c of COMPS_SRC) {
  const i = c.i;
  if (i == null || start[i] == null) continue;
  const st = start[i];
  const slot = slotOf(i);
  const dur = +Math.max(3.2, Math.min(c.dur || slot, slot + (c.over || 0))).toFixed(2);
  const { i: _i, dur: _d, over: _o, ...props } = c;
  CMP.push({ id: `c${String(i).padStart(3, "0")}`, start: +st.toFixed(2), dur, ...props });
}

// ── VENTANAS DE AVATAR — base FULL hasta AVATAR_END, hidden donde hay contenido ─
// Regla anti-hueco: el avatar es el fondo garantizado del tramo 1. Después de
// AVATAR_END queda hidden para siempre (no existe más video de avatar).
const OVERLAY = new Set(["lowerthird", "frasecinetica", "errorstinger"]);
const covers = [];
for (const b of BROLL) if (b.start < AVATAR_END) covers.push({ a: b.start, b: Math.min(b.start + b.cov, AVATAR_END) });
for (const p of PHOTOS) if (p.start < AVATAR_END) covers.push({ a: p.start, b: Math.min(p.start + p.cov, AVATAR_END) });
for (const c of CMP) if (c.start < AVATAR_END && !OVERLAY.has(c.kind)) covers.push({ a: c.start, b: Math.min(c.start + c.dur, AVATAR_END) });
covers.sort((x, y) => x.a - y.a);
const merged = [];
for (const c of covers) {
  const last = merged[merged.length - 1];
  if (last && c.a <= last.b + 0.05) last.b = Math.max(last.b, c.b);
  else merged.push({ ...c });
}
// AvatarLayer consume PUNTOS DE CAMBIO {start, mode}, no rangos.
const pts = [];
const push = (start, mode) => { const l = pts[pts.length - 1]; if (!l || l.mode !== mode) pts.push({ start: +Math.max(0, start).toFixed(2), mode }); };
push(0, "full");
let cur = 0;
for (const m of merged) {
  if (m.a > cur + 0.3) push(cur, "full");
  push(m.a, "hidden");
  cur = m.b;
}
if (cur < AVATAR_END - 0.3) push(cur, "full");
push(AVATAR_END, "hidden");
const AVATAR_WINDOWS = pts;

// ── COMPUERTA: simular el timeline cada 0.2s y exigir 0 instantes muertos ──────
const modeAt = (t) => { let m = "full"; for (const w of AVATAR_WINDOWS) if (t >= w.start) m = w.mode; return m; };
const paint = (t) => {
  if (t < AVATAR_END && modeAt(t) === "full") return "avatar";
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
// PASE DE RELLENO — todo residuo se tapa estirando la foto que viene justo antes
// (o adelantando la siguiente). Sin esto, en el tramo sin avatar se ve el fondo.
for (let pass = 0; pass < 3; pass++) {
  const { hs } = scan();
  if (!hs.length) break;
  for (const [a, b] of hs) {
    const prev = PHOTOS.filter((p) => p.start + p.cov <= a + 0.25).sort((x, y) => (y.start + y.cov) - (x.start + x.cov))[0];
    if (prev) { prev.cov = +(b - prev.start).toFixed(2); prev.dur = prev.cov; continue; }
    const next = PHOTOS.filter((p) => p.start >= b - 0.25).sort((x, y) => x.start - y.start)[0];
    if (next) { next.cov = +(next.cov + (next.start - a)).toFixed(2); next.start = +a.toFixed(2); next.dur = next.cov; }
  }
}
const { dead, hs: holes } = scan();
console.log(`HUECOS: ${holes.length} tramos, ${(dead * 0.2).toFixed(1)}s muertos`);
if (holes.length) console.log("  primeros:", JSON.stringify(holes.slice(0, 12)));

// ── salidas ────────────────────────────────────────────────────────────────────
const ts = (n, v) => "export const " + n + ": any[] = " + JSON.stringify(v, null, 1) + ";" + String.fromCharCode(10);
fs.writeFileSync(`src/_fed6/VideoEdit/${SLUG}_beats.ts`,
  `// GENERADO por gen_${SLUG}.mjs — no editar a mano\n` +
  ts("FCSVARICES_BROLL", BROLL) + ts("FCSVARICES_PHOTOS", PHOTOS) +
  ts("FCSVARICES_BEATS", CMP) + ts("AVATAR_WINDOWS", AVATAR_WINDOWS) +
  `export const VIDEO_END = ${VIDEO_END};\nexport const AVATAR_END = ${AVATAR_END};\n` +
  `export const TOTAL_FRAMES_FCSVARICES = ${Math.ceil(VIDEO_END * 30)};\n`);

const ALL = [
  ...BROLL.map((b) => ({ id: b.name, kind: "raw", src: b.src, start: b.start, dur: b.cov })),
  ...PHOTOS.map((p) => ({ id: p.name, kind: "raw", src: p.src, start: p.start, dur: p.cov })),
  ...CMP,
].sort((a, b) => a.start - b.start);
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", beats: ALL }, null, 1));

const durs = [...BROLL.map((b) => b.cov), ...PHOTOS.map((p) => p.cov)].sort((a, b) => a - b);
const q = (p) => durs[Math.floor(durs.length * p)];
console.log(`beats: ${ALL.length} · clips ${BROLL.length} · fotos ${PHOTOS.length} · comps ${CMP.length}`);
console.log(`pacing visual — mediana ${q(0.5)}s · p75 ${q(0.75)}s · p90 ${q(0.9)}s · ≥5s: ${(durs.filter((d) => d >= 5).length / durs.length * 100).toFixed(0)}%`);
console.log(`kinds distintos: ${[...new Set(CMP.map((c) => c.kind))].join(", ")}`);
