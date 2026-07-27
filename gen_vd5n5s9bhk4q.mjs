// gen_vd5n5s9bhk4q.mjs — beatsheet del video "El GUANTE de ROMERO para los BRAZOS"
// (Canal Federer Archivos). Avatar vd5n5s9bhk4q_opt.mp4 (~27.3min). Anclaje por FRASE a
// captions_vd5n5s9bhk4q.json. Look CLÍNICO teal. Imágenes gpt-image-2: p_vd5n5s9bhk4q_*.png +
// dg_vd5n5s9bhk4q_*.png. Kit _fed6 COMPLETO. Estructura NOVELA (doña Amanda, 68 + don Julio, 76):
// cold-open → mecanismo (agua/glándulas/riego) → romero → oclusión → paso a paso → límites honestos
// → el ERROR (la ventanilla, UVA) → recap FocusCards. 3 injertos guía.
import fs from "fs";
import { SECTIONS } from "./sections_vd5n5s9bhk4q.mjs";
const SLUG = "vd5n5s9bhk4q";

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1, bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, annotated: 1.3, cross: 1.6, process: 2.6, talk: 1.0,
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.6 };

// ── ANCLAJE POR FRASE ─────────────────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
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
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);
const VIDEO_END = (CW[CW.length - 1]?.s || 1635) + 2;

let cursorSec = 0;
const missing = [];
for (const sec of SECTIONS) {
  if (sec.start != null) { cursorSec = sec.start; continue; }
  const ms = findMs(sec.phrase, cursorSec + 1);
  if (ms == null) missing.push(sec.phrase);
  sec.start = ms != null ? ms : cursorSec + 5;
  cursorSec = sec.start;
}
SECTIONS.sort((a, b) => a.start - b.start);

const beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const start = sec.start;
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 1.7; if (b.w) w *= b.w; return w; });
  const pin = sec.beats.map((b, i) => {
    if (i === 0) return start;
    const ph = pinPhrase(b); if (!ph) return null;
    const ms = findMs(ph, start + 0.4);
    return ms != null && ms > start + 0.8 && ms < end - 1.2 ? ms : null;
  });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.2) pin[i] = null; else lastPin = pin[i]; } }
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
    let dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${si}_${i}`;
    const beat = { id, start: cursor, dur, key: sec.key };
    if (b.t === "talk") { beat.kind = "talk"; }
    else if (b.t === "raw") { beat.kind = "raw"; beat.src = `img/${b.name}.png`; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true; }
    else { beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur; beat.key = sec.key;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
    }
    beats.push(beat);
  });
}

// ── POST-PASS MILIMÉTRICO ───────
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
    // sin clip aparte: AvatarKeyword/Pizarra usan el avatar completo con avatarFrom (menos peso en el tarball)
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

// ── PISO DE DURACIÓN ──
const COMPK = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "callout", "bars", "diagram", "rule", "nametag", "board", "annotated", "cross", "process", "lowerthird", "guardaesto", "errorstinger", "mitoverdad", "frasecinetica", "freezezoom"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) {
  const i = compIx[k];
  const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END;
  const capDur = nextComp - beats[i].start - 0.1;
  beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2);
}

// ── PNG → JPG: las imágenes se comprimen a .jpg para que el tarball del farm no pese 300 MB.
// Se reescriben acá TODAS las rutas generadas (si no, quedan 404 y el chunk MUERE — gotcha jul 2026).
const toJpg = (v) => (typeof v === "string" && v.endsWith(".png") && fs.existsSync("public/" + v.replace(/\.png$/, ".jpg")) ? v.replace(/\.png$/, ".jpg") : v);
for (const beat of beats) {
  if (beat.src) beat.src = toJpg(beat.src);
  if (beat.image) beat.image = toJpg(beat.image);
  if (Array.isArray(beat.slides)) beat.slides = beat.slides.map((s) => (s && s.image ? { ...s, image: toJpg(s.image) } : s));
  if (Array.isArray(beat.items)) beat.items = beat.items.map((it) => (it && it.image ? { ...it, image: toJpg(it.image) } : it));
  if (Array.isArray(beat.steps)) beat.steps = beat.steps.map((it) => (it && it.image ? { ...it, image: toJpg(it.image) } : it));
}

// ── MANIFIESTO para scripts/density_gate.mjs ─────────────────────────────────
// El build real vive en src/_fed6/VideoEdit/Main_<slug>.tsx y renderiza por BEATS (un ternario que
// instancia el componente que toca), así que leyendo el JSX el gate vería 1 uso por componente en vez
// de los cientos reales. Este archivo es el "Main_ manifiesto" que el propio gate documenta: la lista
// plana, en orden cronológico, de cada visual que el video pone en pantalla.
const TAG = {
  avatarkeyword: "AvatarKeyword", avatarpizarra: "AvatarPizarra", lowerthird: "LowerThird",
  mitoverdad: "MitoVerdad", frasecinetica: "FraseCinetica", errorstinger: "ErrorStinger",
  guardaesto: "GuardaEsto", freezezoom: "FreezeZoom", focuscards: "FocusCardsVd5",
  looplock: "LoopLockVd5", diagram: "DiagramBoard", stat: "FedStat", bars: "FedBars",
  checklist: "FedChecklist", splitlist: "FedSplitList", chips: "FedChips", quote: "FedQuote",
  callout: "FedCallout", annotated: "FedAnnotated", process: "FedProcess", nametag: "FedNametag",
  cross: "FedCross", rule: "FedRule", board: "FedBoard", headline: "FedHeadline", raw: "RawShot",
};
let broll = [];
try { broll = JSON.parse(fs.readFileSync(`public/broll/anchored_${SLUG}.json`, "utf8")); } catch {}
const manRows = [];
for (const b of beats) {
  if (b.kind === "talk") continue;
  const tag = TAG[b.kind] || "FedComp";
  const asset = b.src || b.image || (b.slides && b.slides[0] && b.slides[0].image) || "";
  manRows.push({ t: b.start, line: `//   ${String(b.start).padStart(8)}s  <${tag}/>${asset ? `  "${asset}"` : ""}` });
}
broll.forEach((a, i) => manRows.push({ t: a.start, line: `//   ${String(a.start).padStart(8)}s  <RawShot/>  "broll/${SLUG}/d${String(i).padStart(3, "0")}.mp4"` }));
manRows.sort((x, y) => x.t - y.t);
const manLines = manRows.map((x) => x.line);
fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`,
  `// MANIFIESTO de densidad de ${SLUG} — NO es el build. El build real es\n` +
  `// src/_fed6/VideoEdit/Main_${SLUG}.tsx (kit _fed6, render por beats) y se registra en\n` +
  `// src/index_${SLUG}.tsx. Este archivo lo genera gen_${SLUG}.mjs para que\n` +
  `// scripts/density_gate.mjs pueda contar los visuales reales del video.\n` +
  `// ASSET_MANIFEST / COMPONENT_MANIFEST (orden cronológico):\n` +
  manLines.join("\n") + "\n" +
  `export const TOTAL_FRAMES_MANIFEST_${SLUG.toUpperCase()} = ${Math.round(VIDEO_END * 30)};\n`);

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — beats (imágenes p_${SLUG}_*.png / dg_${SLUG}_*.png).\n` +
  `export const FEDZ_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_hooks.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — rangos talk.\n` +
  `export const TALKSZ: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", clipsfirst: true, beats }, null, 1));

// ── QA ──
const need = new Set();
beats.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); if (Array.isArray(b.slides)) b.slides.forEach((s) => s.image && need.add(s.image)); if (Array.isArray(b.items)) b.items.forEach((it) => it && it.image && need.add(it.image)); });
const miss = [...need].filter((p) => !fs.existsSync("public/" + p));
if (missing.length) console.log(`⚠ frases no ancladas (${missing.length}):`, missing);
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100*raw/beats.length).toFixed(0)}%) · diagramas: ${kinds.diagram||0} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min)`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`assets referenciados: ${need.size} · faltantes: ${miss.length}`);
fs.writeFileSync(`_img_needed_${SLUG}.txt`, [...need].join("\n"));
