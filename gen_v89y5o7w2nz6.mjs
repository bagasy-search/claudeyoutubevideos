// gen_v89y5o7w2nz6.mjs — beatsheet del video "No bebas agua sola después de los 60"
// Canal Federer Archivos (ES, voseo). Kit _fed6. Avatar v89y5o7w2nz6_opt.mp4 (~28.8 min).
// Lee los 6 mapas de dirección (_dir_t1..t6.json) + captions y emite beats/hooks + lista de b-roll.
import fs from "fs";
const SLUG = "v89y5o7w2nz6";

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1,
  bars: 1.2, callout: 1.1, chips: 1.1, diagram: 3.4, board: 4.0, nametag: 1.3, annotated: 1.3,
  process: 3.6, talk: 2.6, errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6,
  avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.8, freezezoom: 2.2, focuscards: 3.4, looplock: 2.0 };

// ── cargar dirección ─────────────────────────────────────────────────────────
const SECTIONS = [];
const BROLL_RAW = [];
for (let i = 1; i <= 6; i++) {
  const d = JSON.parse(fs.readFileSync(`_dir_t${i}.json`, "utf8"));
  for (const s of d.secciones) SECTIONS.push(s);
  for (const b of d.broll) BROLL_RAW.push(b);
}

// ── normalización de rutas de imagen ─────────────────────────────────────────
const imgPath = (v) => {
  if (!v) return v;
  let s = String(v);
  s = s.replace(/dg_v89y5o7w2nz6_dg_/g, "dg_v89y5o7w2nz6_");     // doble prefijo de un director
  if (!s.startsWith("img/")) s = "img/" + s;
  if (!/\.(png|jpg|jpeg|webp)$/i.test(s)) s += ".png";
  return s;
};
const P = (n) => `img/p_${SLUG}_${n}.png`;

const missingAssets = new Set();
const chk = (p) => { if (p && !fs.existsSync("public/" + p)) missingAssets.add(p); return p; };

for (const sec of SECTIONS) {
  for (const b of sec.beats) {
    if (b.t === "raw") { b.src = chk(P(b.name)); }
    if (b.image) b.image = chk(imgPath(b.image));
    if (Array.isArray(b.slides)) b.slides = b.slides.map((s) => ({ ...s, image: chk(imgPath(s.image)) }));
    if (Array.isArray(b.items)) b.items = b.items.map((it) => (it && it.image ? { ...it, image: chk(imgPath(it.image)) } : it));
    if (Array.isArray(b.steps)) b.steps = b.steps.map((st) => (st && st.image ? { ...st, image: chk(imgPath(st.image)) } : st));
  }
}

// ── anclaje por frase ────────────────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 })).filter((x) => x.t);
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i <= CW.length - p.length; i++) {       // <= : arregla el off-by-one de la última frase
    if (CW[i].s < after) continue;
    let ok = true;
    for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);
const VIDEO_END = (CW[CW.length - 1]?.s || 1729) + 2.2;

let cursorSec = 0;
const missing = [];
for (const sec of SECTIONS) {
  const ms = findMs(sec.phrase, cursorSec + 0.8);
  if (ms == null) missing.push(sec.phrase);
  sec.start = ms != null ? ms : (cursorSec < 0.5 ? 1.3 : cursorSec + 6);
  cursorSec = sec.start;
}
SECTIONS.sort((a, b) => a.start - b.start);

// ── reparto de duraciones ────────────────────────────────────────────────────
const beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const start = sec.start;
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 2.6; if (b.w) w *= b.w; return w; });
  const pin = sec.beats.map((b, i) => {
    if (i === 0) return start;
    const ph = pinPhrase(b); if (!ph) return null;
    const ms = findMs(ph, start + 0.4);
    return ms != null && ms > start + 0.8 && ms < end - 1.0 ? ms : null;
  });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.0) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i);
  fixed.push(n);
  const startT = new Array(n);
  for (let f = 0; f < fixed.length - 1; f++) {
    const a = fixed[f], b = fixed[f + 1];
    const ta = pin[a], tb = b === n ? end : pin[b];
    let sw = 0; for (let i = a; i < b; i++) sw += ws[i];
    let acc = ta;
    for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); }
  }
  sec.beats.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2);
    const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2);
    const dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`;
    const beat = { id, start: cursor, dur, key: sec.key };
    if (b.t === "talk") beat.kind = "talk";
    else if (b.t === "raw") { beat.kind = "raw"; beat.src = b.src; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true; }
    else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t;
      beat.id = id; beat.start = cursor; beat.dur = dur; beat.key = sec.key;
      if (beat.kind === "checklist" && Array.isArray(beat.items))
        beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (beat.kind === "board" && Array.isArray(beat.items))
        beat.items = beat.items.map((it) => (typeof it === "string" ? { title: it } : it));
    }
    beats.push(beat);
  });
}

// ── post-pass milimétrico ────────────────────────────────────────────────────
for (const beat of beats) {
  if (beat.kind === "avatarkeyword" || beat.kind === "avatarpizarra" || beat.kind === "focuscards") {
    let last = 0;
    beat.items = (beat.items || []).map((it) => {
      let atF = 0;
      if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 1.5); if (ms != null) atF = Math.max(0, Math.round((ms - beat.start) * 30)); }
      last = Math.max(last, atF);
      const { atPhrase, ...rest } = it; return { ...rest, at: atF };
    });
    const GAP = 90;
    if (last > 420) { beat.items = beat.items.map((it, i) => ({ ...it, at: i * GAP })); last = (beat.items.length - 1) * GAP; }
    // El componente interpola con [6, 20, at, at+16]: un `at` entre 1 y 23 frames deja ese rango
    // NO monotónico y Remotion tira "inputRange must be strictly monotonically increasing"
    // (mató 4 chunks del primer render). at=0 tiene camino propio y funciona; el resto se corre a 24.
    // Además dos items no pueden compartir el mismo `at`, por lo mismo.
    let prevAt = -1;
    beat.items = beat.items.map((it) => {
      let a = it.at > 0 && it.at < 24 ? 24 : it.at;
      if (a <= prevAt) a = prevAt + 12;
      prevAt = a;
      return { ...it, at: a };
    });
    last = Math.max(last, ...beat.items.map((i) => i.at));
    const hold = beat.kind === "avatarpizarra" ? 4.2 : beat.kind === "focuscards" ? 4.5 : 2.8;
    beat.dur = +(last / 30 + hold).toFixed(2);
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) {
    const ms = findMs(beat.flipPhrase, beat.start - 1);
    const lastSafe = Math.round(beat.dur * 30) - 26;
    let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42);
    if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42);
    beat.flipAt = f; delete beat.flipPhrase;
  }
  if (beat.kind === "freezezoom") {           // x/y en 0..1 (÷100 si vinieron en 0..100)
    if (beat.x > 1) beat.x = beat.x / 100;
    if (beat.y > 1) beat.y = beat.y / 100;
  }
  // un board de 2 renglones deja una tarjeta enorme medio vacía (lo cazó la cuadrícula):
  // esos van como chips, que es un formato compacto y se lee.
  if (beat.kind === 'board' && Array.isArray(beat.items) && beat.items.length < 3) {
    beat.chips = beat.items.map((i) => (i.sub ? i.title + ": " + i.sub : i.title));
    delete beat.items; delete beat.side; beat.kind = 'chips';
  }
  // Una lista de UN SOLO ítem revienta el render: con count=1, `spreadAt` del kit devuelve
  // siempre el paso mínimo de 9 frames, y `useRack` interpola en [at-6, at+8, next-2, next+14]
  // → next-2 (19) cae ANTES que at+8 (20), el inputRange deja de ser creciente y Remotion aborta
  // ese frame. No hay duración que lo arregle. Esos van como zócalo, que no usa rack-focus.
  {
    const LIST = ["checklist", "splitlist", "process", "guardaesto", "chips", "bars", "board", "ingredients"];
    const arr = beat.items || beat.steps || beat.chips || beat.bars;
    if (LIST.includes(beat.kind) && Array.isArray(arr) && arr.length === 1) {
      const it = arr[0];
      const txt = typeof it === "string" ? it : (it.text || it.title || it.label || "");
      const sub = typeof it === "object" ? (it.sub || it.desc || it.note || "") : "";
      beat.desc = sub || txt;
      beat.kicker = beat.eyebrow || beat.title || "";
      beat.title = beat.title && txt !== beat.title ? beat.title : txt;
      beat.tone = beat.tone || "teal";
      delete beat.items; delete beat.steps; delete beat.chips; delete beat.bars; delete beat.side; delete beat.unit;
      beat.kind = "lowerthird";
    }
  }
  if (beat.at) delete beat.at;
  if (beat.name) delete beat.name;
}

// ── piso de duración de los componentes estructurados ────────────────────────
const COMPK = new Set(["headline","stat","quote","chips","splitlist","checklist","callout","bars","diagram",
  "rule","nametag","board","annotated","process","lowerthird","guardaesto","errorstinger","mitoverdad",
  "frasecinetica","freezezoom","looplock"]);
const MINC = 4.6;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) {
  const i = compIx[k];
  const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END;
  const capDur = nextComp - beats[i].start - 0.1;
  beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2);
}

// ── salida ───────────────────────────────────────────────────────────────────
const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.mkdirSync("src/_fed6/VideoEdit", { recursive: true });
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs\nexport const FEDZ_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_hooks.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs\nexport const TALKSZ: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "federer_dark", clipsfirst: true, beats }, null, 1));

// ── lista de b-roll anclada ──────────────────────────────────────────────────
const seenQ = new Map();
const shots = [];
let bcur = 0, bmiss = 0;
for (const b of BROLL_RAW) {
  const ms = findMs(b.at, bcur + 0.3);
  if (ms == null) { bmiss++; continue; }
  bcur = ms;
  let q = b.query.trim().toLowerCase();
  const nth = (seenQ.get(q) || 0) + 1; seenQ.set(q, nth);
  shots.push({ start: +ms.toFixed(2), query: q, page: nth });
}
shots.sort((a, b) => a.start - b.start);
const brollList = shots.map((s, i) => ({
  name: `bd_${SLUG}_${String(i).padStart(3, "0")}`,
  src: `broll/bd_${SLUG}_${String(i).padStart(3, "0")}.mp4`,
  start: s.start,
  dur: +(Math.min(shots[i + 1] ? shots[i + 1].start - s.start : 6, 8)).toFixed(2),
  query: s.query, page: s.page,
}));
fs.writeFileSync(`public/broll/shots_${SLUG}.json`,
  JSON.stringify(brollList.map((b) => ({ name: b.name, query: b.query, page: b.page })), null, 1));
fs.writeFileSync(`_broll_plan_${SLUG}.json`, JSON.stringify(brollList, null, 1));

// ── QA ───────────────────────────────────────────────────────────────────────
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const durs = beats.filter((b) => b.kind !== "talk").map((b) => b.dur).sort((a, b) => a - b);
const med = durs[Math.floor(durs.length / 2)];
const p90 = durs[Math.floor(durs.length * 0.9)];
const largos = durs.filter((d) => d >= 5).length;
console.log(`secciones: ${SECTIONS.length} · beats: ${beats.length} · talk: ${kinds.talk || 0} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min)`);
console.log(`ritmo → mediana ${med?.toFixed(2)}s · p90 ${p90?.toFixed(2)}s · ${(100*largos/durs.length).toFixed(0)}% de planos >=5s`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`b-roll: ${brollList.length} clips planificados (${bmiss} queries sin anclar)`);
if (missing.length) console.log(`⚠ secciones no ancladas (${missing.length}):`, missing.slice(0, 12));
if (missingAssets.size) console.log(`⚠ ASSETS FALTANTES (${missingAssets.size}):`, [...missingAssets].slice(0, 20));
