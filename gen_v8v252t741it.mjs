// gen_v8v252t741it.mjs — beatsheet del video "Cardiólogo Advierte: Millones Hacen ESTO Cada Mañana"
// (Canal Federer Archivos). Avatar v8v252t741it_opt.mp4 (~34.6 min, DOS tandas de HeyGen: la 2ª
// arranca en 1325.09s → el anclaje es SIEMPRE hacia adelante con cursor, y cada tramo tiene su piso
// `minAfter`, que es el `afterMs` de la memoria reference_video_dos_tandas_heygen).
// Lee los mapas de escena de los 3 DIRECTORES (_beats_segN_v8v252t741it.json), ancla por FRASE a
// captions_v8v252t741it.json y emite:
//   src/_fed6/VideoEdit/federer_v8v252t741it_beats.ts   (FEDZ_BEATS)
//   src/_fed6/VideoEdit/federer_v8v252t741it_hooks.ts   (TALKSZ)
//   src/VideoEdit/Main_v8v252t741it.tsx                 (puente + manifiesto de densidad REAL)
//   public/avatar_clips_v8v252t741it.json               (recortes de avatar para pizarra/keyword)
import fs from "fs";
const SLUG = "v8v252t741it";
const TANDA2 = 1325.09; // arranque de la 2ª tanda de HeyGen

// pesos relativos de duración por tipo de beat
const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1,
  bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, annotated: 1.3, cross: 1.6,
  process: 2.6, talk: 1.0, errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6,
  avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.6, focuscards: 3.4, looplock: 1.6 };

// ── cargar los 3 mapas de escena (DIRECTOR fan-out) ───────────────────────────
const SEG_FLOOR = { 1: 0, 2: 700, 3: 1400 };
const SECTIONS = [];
for (const n of [1, 2, 3]) {
  const f = `_beats_seg${n}_${SLUG}.json`;
  if (!fs.existsSync(f)) { console.error(`✗ falta ${f}`); process.exit(1); }
  for (const s of JSON.parse(fs.readFileSync(f, "utf8"))) SECTIONS.push({ ...s, minAfter: SEG_FLOOR[n] });
}

// ── ANCLAJE POR FRASE ─────────────────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 })).filter((x) => x.t);
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i <= CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const VIDEO_END = (CW[CW.length - 1]?.s || 2073) + 1.6;

// nombre pelado → ruta del asset. Las imágenes se convierten a JPG (scripts/png2jpg) para que el
// tarball del farm entre en los 2 GB, así que se resuelve contra lo que HAY en disco.
const imgPath = (n) => {
  const base = String(n).replace(/^img\//, "").replace(/\.(png|jpg|jpeg)$/i, "");
  for (const ext of ["jpg", "png"]) if (fs.existsSync(`public/img/${base}.${ext}`)) return `img/${base}.${ext}`;
  return `img/${base}.png`;
};

let cursorSec = 0;
const missing = [];
for (const sec of SECTIONS) {
  if (sec.start != null) { cursorSec = Math.max(cursorSec, sec.start); continue; }
  const after = Math.max(cursorSec + 1, sec.minAfter || 0);
  const ms = findMs(sec.phrase, after);
  if (ms == null) missing.push(`${sec.key}: ${sec.phrase}`);
  sec.start = ms != null ? ms : cursorSec + 8;
  cursorSec = sec.start;
}
SECTIONS.sort((a, b) => a.start - b.start);

const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? String(b.text).replace(/\*/g, "") : null);

const beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const start = sec.start;
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  const n = sec.beats.length;
  if (!n) continue;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 1.7; if (b.w) w *= b.w; return w; });
  const pin = sec.beats.map((b, i) => {
    if (i === 0) return start;
    const ph = pinPhrase(b); if (!ph) return null;
    const ms = findMs(ph, start + 0.4);
    return ms != null && ms > start + 0.8 && ms < end - 1.2 ? ms : null;
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
    const id = `${sec.key}_${si}_${i}`;
    const beat = { id, start: cursor, dur, key: sec.key };
    if (b.t === "talk") { beat.kind = "talk"; }
    else if (b.t === "raw") { beat.kind = "raw"; beat.src = imgPath(b.name); if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true; }
    else if (b.t === "diagram") { beat.kind = "diagram"; beat.slides = [{ image: imgPath(b.name) }]; }
    else {
      // ⚠ `name` sólo es un nombre de imagen en raw/diagram. En `nametag` es el nombre de la
      // PERSONA ("Dr. Federer") y borrarlo dejaba la tarjeta de cierre sin nombre.
      beat.kind = b.t; Object.assign(beat, b); delete beat.t;
      if (beat.kind !== "nametag") delete beat.name;
      beat.id = id; beat.start = cursor; beat.dur = dur; beat.key = sec.key;
      if (beat.image) beat.image = imgPath(beat.image);
      if (Array.isArray(beat.items)) beat.items = beat.items.map((it) => (it && it.image ? { ...it, image: imgPath(it.image) } : it));
      if (Array.isArray(beat.steps)) beat.steps = beat.steps.map((it) => (it && it.image ? { ...it, image: imgPath(it.image) } : it));
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      // ── NORMALIZACIÓN de props: los directores escriben el schema "humano", el kit espera otro.
      // BarCompare lee beat.bars (no items); BigStatReveal lee value/suffix (no big/unit).
      if (beat.kind === "bars" && !beat.bars && Array.isArray(beat.items)) { beat.bars = beat.items; delete beat.items; }
      if (beat.kind === "stat") {
        if (beat.value == null && beat.big != null) beat.value = beat.big;
        if (beat.suffix == null && beat.unit != null) beat.suffix = beat.unit;
        delete beat.big; delete beat.unit;
      }
    }
    beats.push(beat);
  });
}

// ── POST-PASS MILIMÉTRICO (items anclados al ms dentro del beat) ──────────────
const KIT_CLIPS = [];
for (const beat of beats) {
  if (beat.kind === "avatarpizarra" || beat.kind === "avatarkeyword") {
    let last = 0;
    beat.items = (beat.items || []).map((it) => {
      let atF = 0;
      if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - beat.start) * 30)); }
      last = Math.max(last, atF);
      const { atPhrase, ...rest } = it; return { ...rest, at: atF };
    });
    const GAP = 90;
    if (last > 300) { beat.items = beat.items.map((it, i) => ({ ...it, at: i * GAP })); last = (beat.items.length - 1) * GAP; }
    const hold = beat.kind === "avatarpizarra" ? 4.2 : 2.8;
    beat.dur = +(last / 30 + hold).toFixed(2);
    beat.clip = `avatar_clips/${SLUG}/${beat.id}.mp4`;
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "focuscards") {
    let last = 0;
    beat.items = (beat.items || []).map((it) => {
      let atF = 0;
      if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - beat.start) * 30)); }
      last = Math.max(last, atF);
      const { atPhrase, ...rest } = it; return { ...rest, at: atF };
    });
    beat.dur = +(last / 30 + 4.5).toFixed(2);
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) {
    const ms = findMs(beat.flipPhrase, beat.start - 1);
    const lastSafe = Math.round(beat.dur * 30) - 26;
    let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42);
    if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42);
    beat.flipAt = f; delete beat.flipPhrase;
  }
  if (beat.at) delete beat.at;
}
fs.writeFileSync(`public/avatar_clips_${SLUG}.json`, JSON.stringify(KIT_CLIPS, null, 1));

// ── PISO DE DURACIÓN de componentes ───────────────────────────────────────────
const COMPK = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "callout", "bars",
  "diagram", "rule", "nametag", "board", "annotated", "cross", "process", "lowerthird", "guardaesto",
  "errorstinger", "mitoverdad", "frasecinetica", "freezezoom", "looplock"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) {
  const i = compIx[k];
  const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END;
  const capDur = nextComp - beats[i].start - 0.1;
  beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2);
}

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — NO editar a mano.\n` +
  `export const FEDZ_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_hooks.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — rangos talk (avatar FULL).\n` +
  `export const TALKSZ: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", clipsfirst: true, beats }, null, 1));

// ── PUENTE PARA LOS GATES ─────────────────────────────────────────────────────
// density_gate.mjs busca el build en src/VideoEdit/Main_<slug>.tsx, pero este kit vive en
// src/_fed6/. Este archivo re-exporta el Main real y publica un manifiesto DERIVADO de los datos
// (no escrito a mano): cada entrada es un momento visual real con su segundo y su componente.
const TAG = { avatarkeyword: "AvatarKeyword", avatarpizarra: "AvatarPizarra", lowerthird: "LowerThird",
  mitoverdad: "MitoVerdad", frasecinetica: "FraseCinetica", errorstinger: "ErrorStinger",
  guardaesto: "GuardaEsto", freezezoom: "FreezeZoom", focuscards: "FocusCardsV8", looplock: "LoopLockV8",
  diagram: "DiagramBoard", bars: "Bars", callout: "Callout", annotated: "Annotated", splitlist: "SplitList",
  checklist: "Checklist", process: "Process", quote: "Quote", chips: "Chips", nametag: "NameTag",
  headline: "Headline", stat: "Stat", board: "Board", cross: "Cross", rule: "Rule" };
const BROLL_TS = `src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`;
let brollRows = [];
if (fs.existsSync(BROLL_TS)) {
  const m = fs.readFileSync(BROLL_TS, "utf8").match(/=\s*(\[[\s\S]*\]);/);
  if (m) brollRows = JSON.parse(m[1]);
}
const manifest = [];
for (const b of beats) {
  if (b.kind === "talk") continue;
  if (b.kind === "raw") { manifest.push({ startSec: b.start, shot: b.src }); continue; }
  const tag = TAG[b.kind]; if (!tag) continue;
  const asset = b.image || (b.slides && b.slides[0] && b.slides[0].image) || null;
  manifest.push({ startSec: b.start, comp: `<${tag}>`, ...(asset ? { asset } : {}) });
}
for (const c of brollRows) manifest.push({ startSec: c.start, shot: c.src });
manifest.sort((a, b) => a.startSec - b.startSec);
fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — PUENTE. El build real de este video vive en el kit _fed6:\n` +
  `//   src/_fed6/VideoEdit/Main_${SLUG}.tsx  (4 capas: b-roll · fotos · AvatarLayer · componentes)\n` +
  `// Acá se re-exporta y se publica el MANIFIESTO DE DENSIDAD derivado de los datos reales del\n` +
  `// beatsheet + el track de b-roll, para que scripts/density_gate.mjs pueda medir este build.\n` +
  `export { MainV8, TOTAL_FRAMES_V8 } from "../_fed6/VideoEdit/Main_${SLUG}";\n\n` +
  `export const DENSITY_MANIFEST = ${JSON.stringify(manifest)};\n`);

// ── QA ────────────────────────────────────────────────────────────────────────
const need = new Set();
beats.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image);
  if (Array.isArray(b.slides)) b.slides.forEach((s) => s.image && need.add(s.image));
  if (Array.isArray(b.items)) b.items.forEach((it) => it && it.image && need.add(it.image));
  if (Array.isArray(b.steps)) b.steps.forEach((it) => it && it.image && need.add(it.image)); });
const miss = [...need].filter((p) => !fs.existsSync("public/" + p));
if (missing.length) console.log(`⚠ secciones NO ancladas (${missing.length}):`, missing.slice(0, 12));
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const raw = beats.filter((b) => b.kind === "raw").length;
const comps = beats.filter((b) => COMPK.has(b.kind) || ["avatarkeyword", "avatarpizarra", "focuscards"].includes(b.kind)).length;
console.log(`beats: ${beats.length} · raw: ${raw} · componentes: ${comps} · distintos: ${Object.keys(kinds).length} · dur: ${dur.toFixed(0)}s (${(dur / 60).toFixed(1)}min)`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`assets referenciados: ${need.size} · faltantes: ${miss.length}`);
if (miss.length) console.log("FALTAN:", miss.slice(0, 20).join(" "));
