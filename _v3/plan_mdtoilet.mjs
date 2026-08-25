// plan_mdtoilet.mjs — EL DIRECTOR de `mdtoilet`, determinístico y anclado al ms REAL de Whisper.
//
//   node _v3/plan_mdtoilet.mjs      → escribe _v3/mdtoilet_plan.json
//
// Reglas que impone (no son sugerencias):
//  · El avatar dura los 17:01 completos y es el FONDO GARANTIZADO: cuando nada lo tapa, va full.
//  · Los 6 MOVIMIENTOS premium ocupan su ventana entera y tapan el avatar.
//  · PACING ULTRA-DINÁMICO del canal: cortes de 0,6 s a 5 s, con VARIANZA. Lo que se evita no
//    son los planos largos: es la sucesión pareja (el metrónomo).
//  · Cada corte cae en un límite de PALABRA real de Whisper, nunca en una cuenta matemática.
//  · ⛔ Whisper devolvió este audio SIN puntuación de oración, así que los "finales de oración"
//    se derivan de las PAUSAS reales (hueco ≥ 220 ms entre palabras). Sin esto, `snapSent`
//    colapsaba todos los planos largos al mismo instante.
import fs from "node:fs";

const caps = JSON.parse(fs.readFileSync("public/captions_mdtoilet.json", "utf8").replace(/^﻿/, ""));
const A = JSON.parse(fs.readFileSync("_v3/mdtoilet_anchors.json", "utf8"));
const an = (k) => { const v = A.anchors[k]; if (!v || v.s == null) throw new Error(`falta ancla ${k}`); return v.s; };
// ⛔ La comp tiene que durar AL MENOS lo que el .wav: Whisper termina en la última PALABRA
// (1020,9 s) pero el archivo dura 1021,127 s. Si la comp se corta ahí, se come la respiración
// final. Se le da cola.
const WAV_S = 1021.127;
const TOTAL = Math.max(A.totalMs / 1000, WAV_S) + 0.6;

const flatW = [];
for (const c of caps) {
  const n = c.text.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  if (!n) continue;
  for (const w of n.split(" ")) flatW.push({ w, s: c.startMs / 1000 });
}
const findPhrase = (phrase) => {
  const q = phrase.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim().split(" ");
  for (let i = 0; i + q.length <= flatW.length; i++) {
    let ok = true;
    for (let j = 0; j < q.length; j++) if (flatW[i + j].w !== q[j]) { ok = false; break; }
    if (ok) return flatW[i].s;
  }
  return null;
};

const wordAt = caps.map((c) => c.startMs / 1000);
// PAUSAS = donde de verdad respira. Son los buenos lugares para un plano largo.
const sentEnd = [];
for (let i = 0; i < caps.length - 1; i++) {
  if (caps[i + 1].startMs - caps[i].endMs >= 160) sentEnd.push(caps[i].endMs / 1000);
}
sentEnd.push(caps[caps.length - 1].endMs / 1000);
const snap = (t, arr) => { let best = arr[0], bd = Infinity; for (const x of arr) { const d = Math.abs(x - t); if (d < bd) { bd = d; best = x; } } return best; };
const snapWord = (t) => snap(t, wordAt);
// ⛔ snap ACOTADO: `snap` global elige el más cercano de TODO el array. En este audio hay tramos
// de 90 s sin una sola pausa larga, así que un snap sin ventana saltaba al otro extremo del
// video y dejaba un plano de 93 s (medido). Si no hay pausa cerca, se corta en palabra.
const snapNear = (t, arr, win) => {
  let best = null, bd = Infinity;
  for (const x of arr) { const d = Math.abs(x - t); if (d < bd && d <= win) { bd = d; best = x; } }
  return best;
};
const snapSent = (t) => snapNear(t, sentEnd, 0.75) ?? snapWord(t);

// ── POOL de clips por sección (los 64 i2v de Mike haciendo CADA microacción del guion) ───────
const P = {
  hook:      ["h01_handle", "h02_sbend", "h03_gurgle", "h04_rimfinger"],
  rim:       ["h04_rimfinger", "h05_mirror", "h06_scrubwrong", "h07_pointbowl"],
  give:      ["h08_valve", "h09_drain", "h10_bottle", "h11_squirtrim", "h12_paperring", "h13_soakpaper", "h14_tanklid", "h15_pourtank", "h16_wait", "h17_brushring"],
  biointro:  ["h18_pointring", "h20_wipecolor", "h19_twobottles"],
  bioperox:  ["h21_breakfilm", "h22_calendar", "h19_twobottles", "h10_bottle", "h18_pointring"],
  tankstory: ["h23_tubedge", "h24_pumice", "h25_phonecall", "h26_liftlid", "h27_blackfinger", "h28_flapper", "h29_invoice"],
  ordintro:  ["h07_pointbowl", "h23_tubedge"],
  ordvalve:  ["h08_valve", "h30_valveweep", "h31_newvalve", "h09_drain"],
  ordrim:    ["h11_squirtrim", "h32_phonerim", "h33_phonelook", "h05_mirror", "h04_rimfinger"],
  ordring:   ["h12_paperring", "h13_soakpaper", "h34_walkout", "h17_brushring"],
  ordtank:   ["h14_tanklid", "h15_pourtank", "h35_brushtank", "h28_flapper", "h36_newflapper", "h37_bluetablet", "h38_sticker"],
  jets2:     ["h40_wirejet", "h41_goodswirl", "h39_vinegar"],
  ordnobody: ["h42_hingecap", "h43_toothbrushbolt", "h44_handle", "h45_baseseam"],
  ordbrush:  ["h46_caddy", "h47_rinsebrush", "h48_wedgebrush", "h49_pourcaddy"],
  plume:     ["h50_closelid", "h51_toothbrushcup"],
  room:      ["h52_wallbehind", "h51_toothbrushcup", "h44_handle", "h45_baseseam", "h50_closelid"],
  honest:    ["h53_hardring", "h24_pumice", "h54_pinkfixture", "h55_waxring", "h56_cupwater"],
  safe2:     ["h60_label", "h61_windowsill", "h62_gloves", "h59_apart", "h57_gelbottle", "h58_bleachdown"],
  close:     ["h63_checklist", "h64_finalstand", "h10_bottle", "h07_pointbowl"],
};
const clipDurF = 121; // 121 frames a 24 fps = 5,04 s por clip de origen

// ── EL MAPA ──────────────────────────────────────────────────────────────────────────────────
const MAP = [
  { id: "hook",      a: 0,                    b: an("HOOK_siphon"),   kind: "mix", pool: "hook",      temp: "calmo",  avatarBias: 0.58 },
  { id: "siphon",    a: an("HOOK_siphon"),    b: an("RIM_made"),      kind: "mov", comp: "MovSiphon" },
  { id: "rimmade",   a: an("RIM_made"),       b: an("GIVE_start"),    kind: "mix", pool: "rim",       temp: "normal", avatarBias: 0.44 },
  { id: "give",      a: an("GIVE_start"),     b: an("BIO_start"),     kind: "mix", pool: "give",      temp: "rafaga", avatarBias: 0.30 },
  { id: "biointro",  a: an("BIO_start"),      b: an("BIO_colony"),    kind: "mix", pool: "biointro",  temp: "calmo",  avatarBias: 0.62 },
  { id: "biofilm",   a: an("BIO_colony"),     b: an("BIO_peroxide"),  kind: "mov", comp: "MovBiofilm" },
  { id: "bioperox",  a: an("BIO_peroxide"),   b: an("TANK_start"),    kind: "mix", pool: "bioperox",  temp: "normal", avatarBias: 0.46 },
  { id: "tankstory", a: an("TANK_start"),     b: an("ORDER_start"),   kind: "mix", pool: "tankstory", temp: "calmo",  avatarBias: 0.55 },
  { id: "ordintro",  a: an("ORDER_start"),    b: an("ORDER_valve"),   kind: "mix", pool: "ordintro",  temp: "normal", avatarBias: 0.60 },
  { id: "ordvalve",  a: an("ORDER_valve"),    b: an("ORDER_rim"),     kind: "mix", pool: "ordvalve",  temp: "normal", avatarBias: 0.38 },
  { id: "ordrim",    a: an("ORDER_rim"),      b: an("ORDER_ring"),    kind: "mix", pool: "ordrim",    temp: "rafaga", avatarBias: 0.34 },
  { id: "ordring",   a: an("ORDER_ring"),     b: an("ORDER_tank"),    kind: "mix", pool: "ordring",   temp: "normal", avatarBias: 0.36 },
  { id: "ordtank",   a: an("ORDER_tank"),     b: an("ORDER_jets"),    kind: "mix", pool: "ordtank",   temp: "normal", avatarBias: 0.40 },
  { id: "jets",      a: an("ORDER_jets"),     b: 560.0,               kind: "mov", comp: "MovJets" },
  { id: "jets2",     a: 560.0,                b: an("ORDER_nobody"),  kind: "mix", pool: "jets2",     temp: "normal", avatarBias: 0.34 },
  { id: "ordnobody", a: an("ORDER_nobody"),   b: an("ORDER_brush"),   kind: "mix", pool: "ordnobody", temp: "rafaga", avatarBias: 0.34 },
  { id: "ordbrush",  a: an("ORDER_brush"),    b: an("PLUME_start"),   kind: "mix", pool: "ordbrush",  temp: "normal", avatarBias: 0.36 },
  { id: "plumein",   a: an("PLUME_start"),    b: an("PLUME_lasers"),  kind: "mix", pool: "plume",     temp: "calmo",  avatarBias: 0.60 },
  { id: "plume",     a: an("PLUME_lasers"),   b: an("ROOM_smell"),    kind: "mov", comp: "MovPlume" },
  { id: "room",      a: an("ROOM_smell"),     b: an("HONEST_start"),  kind: "mix", pool: "room",      temp: "normal", avatarBias: 0.42 },
  { id: "honest",    a: an("HONEST_start"),   b: an("SAFE_start"),    kind: "mix", pool: "honest",    temp: "calmo",  avatarBias: 0.50 },
  { id: "safety",    a: an("SAFE_start"),     b: an("SAFE_light"),    kind: "mov", comp: "MovSafety" },
  { id: "safe2",     a: an("SAFE_light"),     b: an("CLOSE_start"),   kind: "mix", pool: "safe2",     temp: "normal", avatarBias: 0.44 },
  { id: "close",     a: an("CLOSE_start"),    b: an("CLOSE_cta"),     kind: "mov", comp: "MovClose" },
  { id: "cta",       a: an("CLOSE_cta"),      b: TOTAL,               kind: "mix", pool: "close",     temp: "calmo",  avatarBias: 0.58 },
];

// ── EL RITMO ────────────────────────────────────────────────────────────────────────────────
const LADDER = {
  rafaga: [0.7, 1.0, 0.8, 2.2, 0.6, 1.3, 0.9, 3.6, 0.8, 1.1, 0.7, 2.6, 1.6, 0.9, 4.2],
  normal: [1.8, 2.6, 1.2, 3.4, 2.0, 1.4, 4.6, 2.2, 1.0, 3.0, 1.6, 2.8],
  calmo:  [2.6, 4.2, 1.8, 3.6, 5.0, 2.2, 3.2, 4.6],
};
const seedRnd = (k) => { const x = Math.sin(k * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };

// ── CAPÍTULOS ────────────────────────────────────────────────────────────────────────────────
// ⛔ `number` va como STRING (adentro hace number.match) y la card necesita ≥3 s y ≤9,5 s.
const CHAPTERS = {
  give:      { number: "0", title: "THE 90-SECOND VERSION", sub: "the whole fix, right now" },
  ordvalve:  { number: "1", title: "THE VALVE", sub: "stop cleaning underwater" },
  ordrim:    { number: "2", title: "THE RIM", sub: "where the ring is made" },
  ordring:   { number: "3", title: "THE RING", sub: "paper holds it there" },
  ordtank:   { number: "4", title: "THE TANK", sub: "the end nobody opens" },
  ordnobody: { number: "5", title: "THE PARTS NOBODY DOES", sub: "hinges, handle, the base" },
  ordbrush:  { number: "6", title: "THE BRUSH", sub: "and the cup it lives in" },
};
const CHAP_DUR = 4.2;

const beats = [];
let ci = 0;
const usedClip = {};
let lastClip = null;

for (const S of MAP) {
  if (S.kind === "mov") {
    beats.push({ ms_in: Math.round(S.a * 1000), ms_out: Math.round(S.b * 1000), tipo: "movimiento", componente: S.comp, sec: S.id, avatar: "hidden" });
    continue;
  }
  const pool = P[S.pool];
  const lad = LADDER[S.temp];
  let t = S.a, i = 0;
  if (CHAPTERS[S.id]) {
    const end = snapWord(S.a + CHAP_DUR);
    beats.push({ ms_in: Math.round(S.a * 1000), ms_out: Math.round(end * 1000), tipo: "componente", componente: "ChapterTrailCard", sec: S.id, avatar: "hidden", props: CHAPTERS[S.id] });
    t = end;
  }
  while (t < S.b - 0.35) {
    const want = lad[i % lad.length];
    let end = Math.min(S.b, t + want);
    end = want >= 2.4 ? snapSent(end) : snapWord(end);
    if (end <= t + 0.4) end = Math.min(S.b, t + Math.max(0.6, want));
    if (S.b - end < 0.5) end = S.b;

    const r = seedRnd(beats.length * 3.1 + i);
    if (r < S.avatarBias) {
      beats.push({ ms_in: Math.round(t * 1000), ms_out: Math.round(end * 1000), tipo: "avatar", sec: S.id, avatar: "full" });
    } else {
      let pick = pool[(usedClip[S.pool] = (usedClip[S.pool] || 0)) % pool.length];
      usedClip[S.pool]++;
      if (pick === lastClip && pool.length > 1) { pick = pool[usedClip[S.pool] % pool.length]; usedClip[S.pool]++; }
      lastClip = pick;
      const durF24 = Math.ceil((end - t) * 24) + 2;
      const maxStart = Math.max(0, clipDurF - durF24 - 2);
      const start = Math.round(maxStart * ((ci * 0.37) % 1));
      ci++;
      beats.push({ ms_in: Math.round(t * 1000), ms_out: Math.round(end * 1000), tipo: "clip", sec: S.id, avatar: "hidden", clip: `mdtoilet_${pick}`, startFrom: start, flash: (end - t) < 1.2 });
    }
    t = end; i++;
  }
}

beats.sort((a, b) => a.ms_in - b.ms_in);
for (let i = 0; i < beats.length - 1; i++) beats[i].ms_out = beats[i + 1].ms_in;
beats[beats.length - 1].ms_out = Math.round(TOTAL * 1000);

// PISO DE 0,6 s — un plano de 0,4 s no se lee como corte rápido sino como error.
for (let i = beats.length - 1; i > 0; i--) {
  if (beats[i].ms_out - beats[i].ms_in < 600) { beats[i - 1].ms_out = beats[i].ms_out; beats.splice(i, 1); }
}

// ⛔ TECHO DE 4,6 s PARA LOS CLIPS: el material i2v dura 5,04 s (121f @24). Un beat más largo
// que eso pide frames que NO EXISTEN dentro del mp4 → el último cuadro se congela o sale negro.
// El avatar sí puede sostener un plano largo (es el fondo garantizado), así que el beat pasa a él.
let capped = 0;
for (const b of beats) {
  if (b.tipo === "clip" && b.ms_out - b.ms_in > 4600) {
    b.tipo = "avatar"; b.avatar = "full"; delete b.clip; delete b.startFrom; delete b.flash; capped++;
  }
}
if (capped) console.log(`  · ${capped} plano(s) de más de 4,6 s pasaron al avatar (el clip no da tanto metraje)`);

// ⛔ RECALCULAR `startFrom` AL FINAL. Se elegía cuando el beat se creaba, pero después el beat se
// ESTIRA dos veces (al cerrar solapes y al absorber los planos de menos de 0,6 s). Un beat que
// creció con un startFrom viejo le pide al mp4 frames que ya no existen. Medido: 1 beat de 126f
// sobre un clip de 121f.
for (const b of beats) {
  if (b.tipo !== "clip") continue;
  const durF24 = Math.ceil(((b.ms_out - b.ms_in) / 1000) * 24) + 2;
  const maxStart = Math.max(0, clipDurF - durF24 - 2);
  b.startFrom = Math.min(b.startFrom || 0, maxStart);
}

// ── OVERLAYS: la CAPA DE IDEAS sobre el b-roll ───────────────────────────────────────────────
// Van ENCIMA del plano que ya corre (no abren ventana de avatar). Cada uno anclado a la FRASE
// REAL. ⛔ Todos los labels en INGLÉS: los defaults del kit están en español.
const OV = [
  ["we scrub the porcelain", 6.4, "HookCaption", "center",
    { words: [{ text: "WE SCRUB" }, { text: "THE ONE PART", boxed: true }, { text: "THAT RINSES", boxed: true }, { text: "ITSELF" }] }],
  ["reach behind the toilet down low", 9.5, "NumberedSteps", "left",
    { eyebrow: "THE 90-SECOND VERSION", title: "Five moves, twenty minutes", steps: [
      { title: "Shut the valve", sub: "behind the bowl, clockwise" },
      { title: "Flush it dry", sub: "hold the handle down" },
      { title: "Peroxide under the rim", sub: "into the holes, all the way round" },
      { title: "Paper on the ring", sub: "soak it, walk away" },
      { title: "Two cups in the tank", sub: "brush, open the valve, flush twice" }] }],
  ["and paper makes it sit for 20 minutes", 6.0, "BigStatReveal", "topLeft",
    { eyebrow: "DWELL TIME ON THE RING", value: 20, suffix: " MIN", support: "a liquid on a vertical wall is gone in six seconds" }],
  ["that's it that's the video go do it", 5.6, "HighlightSweep", "top",
    { pre: "That's the whole fix.", highlight: "Go do it now", post: ".", note: "the rest of this is why it works" }],
  ["so you didn't clean it you mowed it", 6.4, "MythTruth", "topLeft",
    { myth: "The stain came back", truth: "It never left — you took its colour off", mythLabel: "WHAT IT LOOKS LIKE", truthLabel: "WHAT HAPPENED" }],
  ["the second treatment is the one", 6.2, "HighlightSweep", "top",
    { pre: "Break it up, treat it,", highlight: "and treat it again next week", post: ".", note: "nobody tells you that — nobody sells a second treatment" }],
  ["i put my name on the invoice", 6.6, "PullQuote", "center",
    { quote: "I was scrubbing a bowl spotless and refilling it from a tank that looked like a pond.", author: "Mike Dalton", role: "eleven years, lid on" }],
  ["they're about eight dollars", 5.2, "BigStatReveal", "topLeft",
    { eyebrow: "A SHUTOFF VALVE COSTS", value: 8, prefix: "$", support: "if it weeps and won't stop, that valve is telling you something" }],
  ["get your phone hold it under the rim", 7.0, "ChecklistReveal", "left",
    { kicker: "BEFORE YOU SPRAY", title: "Take the photo first", items: ["Seat up, phone under the rim", "Screen facing up, one picture", "Orange, black, or a hard crust", "That is what feeds your bowl"], stamp: "LOOK" }],
  ["it's a five dollar part", 5.4, "BigStatReveal", "topLeft",
    { eyebrow: "A NEW FLAPPER COSTS", value: 5, prefix: "$", support: "soft, slippery, black on your fingers — that's why it runs at 2 a.m." }],
  ["kohler puts a sticker inside the tank", 7.4, "HighlightSweep", "top",
    { pre: "The manufacturer put the warning", highlight: "inside the tank", post: " — the one place you'd only see it if you opened the lid.", note: "in-tank cleaners void the warranty and destroy parts" }],
  ["that chlorine sits in there", 6.4, "BulletCascade", "left",
    { eyebrow: "WHAT THE BLUE TABLET ACTUALLY DOES", bullets: [
      { pre: "It isn't cleaning the ring,", key: "it can't reach it" },
      { pre: "It sits on rubber", key: "twenty-four hours a day" },
      { pre: "It doesn't save a job,", key: "it costs you a flapper" }] }],
  ["those two plastic caps flip up", 6.6, "ChecklistReveal", "left",
    { kicker: "THE PARTS NOBODY DOES", title: "Thirty seconds each", items: ["Under the seat hinge caps", "The flush handle", "The seam at the base", "The wall behind the tank"], stamp: "DONE" }],
  ["here's the sequence you have been doing", 6.0, "MythTruth", "topLeft",
    { myth: "The bowl is the dirty part", truth: "The wet brush in a closed cup is", mythLabel: "WHAT YOU ASSUME", truthLabel: "WHAT IT IS" }],
  ["so when you're done scrubbing open the valve", 7.0, "NumberedSteps", "left",
    { eyebrow: "THE BRUSH", title: "Three moves, every time", steps: [
      { title: "Rinse it in the flush", sub: "hold it in the clean stream" },
      { title: "Wedge it under the seat", sub: "let it drip dry ten minutes" },
      { title: "Peroxide in the cup", sub: "not a rinse — peroxide" }] }],
  ["wipe the wall behind and beside the toilet", 6.8, "ChecklistReveal", "left",
    { kicker: "THE ACTUAL LIST", title: "Where the smell really lives", items: ["The wall behind and beside", "The side of the vanity", "The floor around the base", "The underside of the seat"], stamp: "WEEKLY" }],
  ["that's pumice stone", 6.6, "VsDuel", "center",
    { eyebrow: "WHEN THE RING IS A RAISED SHELF", title: "Peroxide or pumice?", left: { label: "PEROXIDE", sub: "kills what's alive — will not dissolve rock", good: false }, right: { label: "PUMICE", sub: "wet stone on wet porcelain, softer than the glaze", good: true } }],
  ["pour a cup of water in there once a month", 6.4, "HighlightSweep", "top",
    { pre: "Nothing is dirty —", highlight: "the trap dried out", post: ".", note: "two to four weeks unused and you're smelling the sewer line" }],
  ["print it tape it inside the cabinet door", 7.0, "ChecklistReveal", "left",
    { kicker: "IN THE DESCRIPTION", title: "The printed checklist", items: ["The order, room by room", "Every dwell time", "Weekly vs once a year", "What never goes near what"], stamp: "PRINT IT" }],
];

const overlays = [];
for (const [phrase, dur, comp, zone, props] of OV) {
  const t = findPhrase(phrase);
  if (t == null) { console.warn(`  ⚠ overlay sin ancla: "${phrase}" (${comp})`); continue; }
  overlays.push({ ms_in: Math.round(t * 1000), ms_out: Math.round((t + dur) * 1000), componente: comp, zone, props });
}
overlays.sort((a, b) => a.ms_in - b.ms_in);
const movRanges = beats.filter((b) => b.tipo === "movimiento").map((b) => [b.ms_in, b.ms_out]);
const clean = [];
for (const o of overlays) {
  if (movRanges.some(([a, b]) => o.ms_in < b && o.ms_out > a)) { console.warn(`  ⚠ overlay ${o.componente} cae dentro de un movimiento — lo salteo`); continue; }
  if (clean.length && o.ms_in < clean[clean.length - 1].ms_out + 400) { console.warn(`  ⚠ overlay ${o.componente} muy pegado al anterior — lo salteo`); continue; }
  clean.push(o);
}

const durs = beats.filter((b) => b.tipo !== "movimiento").map((b) => (b.ms_out - b.ms_in) / 1000);
const srt = [...durs].sort((a, b) => a - b);
const pct = (p) => srt[Math.floor(srt.length * p)];
const cov = (k) => beats.filter((b) => b.tipo === k).reduce((s, b) => s + (b.ms_out - b.ms_in), 0) / 1000;

fs.writeFileSync("_v3/mdtoilet_plan.json", JSON.stringify({ totalMs: Math.round(TOTAL * 1000), beats, overlays: clean }, null, 1));
console.log(`beats ${beats.length} · total ${(TOTAL / 60).toFixed(2)} min`);
console.log(`  avatar     ${cov("avatar").toFixed(0)}s (${(cov("avatar") / TOTAL * 100).toFixed(0)}%)`);
console.log(`  clips      ${cov("clip").toFixed(0)}s (${(cov("clip") / TOTAL * 100).toFixed(0)}%)  · ${beats.filter((b) => b.tipo === "clip").length} planos`);
console.log(`  movimiento ${cov("movimiento").toFixed(0)}s (${(cov("movimiento") / TOTAL * 100).toFixed(0)}%)  · ${beats.filter((b) => b.tipo === "movimiento").length} piezas premium`);
console.log(`  corte: min ${srt[0].toFixed(2)}s · p25 ${pct(0.25).toFixed(2)}s · mediana ${pct(0.5).toFixed(2)}s · p75 ${pct(0.75).toFixed(2)}s · max ${srt[srt.length - 1].toFixed(2)}s`);
console.log(`  ≥5s: ${(durs.filter((d) => d >= 5).length / durs.length * 100).toFixed(0)}% · ≤1.2s: ${(durs.filter((d) => d <= 1.2).length / durs.length * 100).toFixed(0)}%`);
console.log(`  overlays   ${clean.length} · ${[...new Set(clean.map((o) => o.componente))].length} componentes distintos`);
