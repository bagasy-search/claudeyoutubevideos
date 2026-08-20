// gen_darkspots.mjs — beatsheet/darkspots.json (Canal "Dr. Federer | Holistic Health" · EN · "THE MELANIN BRAKE" / bearberry-arbutin = fade age spots).
// Avatar darkspots_opt.mp4 (~18min, EN "you"). Anclaje por FRASE a captions_darkspots.json (avatar = TTS del guion textual).
// MATERIAL: b-roll = SOLO stock Pexels (DS_BROLL). IA = SOLO el presentador (ds_federer_*.png, gpt-image-2 con ref) + hero stills Pexels.
// Diagramas/reveal/láminas = gpt-image-2 (lamina_board / reveal / dg_switch / cmp_serum) + componentes REALES data-driven, NUNCA texto quemado suelto.
// Estrategia conversión: dolor(manchas) → no es sol es SWITCH → qué ES una mancha (jam + cinta lenta) → mistake(limón/crema) → paciente → BEARBERRY/ARBUTIN(freno) → $80 serum = la hoja → por qué NOCHE → receta → LÁMINA → revelar guía+QR → truco reservado descripción → seguridad.
import fs from "fs";

const r  = (name, o = {}) => ({ t: "raw", name, ...o });
const c  = (kind, props = {}) => ({ t: kind, ...props });
const es = (number, title, o = {}) => ({ t: "errorstinger", number, title, tone: o.tone || "teal", ...o });
const mv = (myth, truth, o = {}) => ({ t: "mitoverdad", myth, truth, ...o });
const fc = (words, o = {}) => ({ t: "frasecinetica", words, tone: o.tone || "teal", perWord: o.perWord || 10, ...o });
const ak = (items, o = {}) => ({ t: "avatarkeyword", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const lt = (title, o = {}) => ({ t: "lowerthird", title, tone: o.tone || "teal", ...o });
const fz = (image, o = {}) => ({ t: "freezezoom", image, x: o.x ?? 0.5, y: o.y ?? 0.45, zoom: o.zoom ?? 1.9, label: o.label, tone: o.tone || "teal", ...o });

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1, bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, annotated: 1.3, cross: 1.6, process: 2.6, talk: 1.0,
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.9, pricewar: 2.6, reprintscan: 2.6, hourdial: 2.4 };

const LAM = "img/darkspots_lamina_board.png";
const REVEAL = "img/darkspots_reveal.png";

const SECTIONS = [
  // ░░ HOOK — cold open sobre las MANCHAS, sin cara ░░
  { key: "hook", phrase: null, start: 0.3, beats: [
    fz("img/ds_hook_spots.jpg", { x: 0.5, y: 0.5, zoom: 1.5, label: "Not dirt. Not a stain.", tone: "teal" }),
  ]},
  { key: "hooksw", phrase: "not really a sun problem", beats: [
    ak([{ word: "A SWITCH STUCK ON", sub: "the sun that made them left years ago — what is left is a pigment switch that never got switched back off", tone: "teal", atPhrase: "not really a sun problem" }], {}),
  ]},
  { key: "hookleaf", phrase: "a plain quiet little leaf", beats: [
    fc([{ t: "One" }, { t: "quiet" }, { t: "little" }, { t: "LEAF.", hl: true }], { tone: "teal", at: "a plain quiet little leaf" }),
  ]},
  // ░░ HONESTIDAD ░░
  { key: "honesty", phrase: "here to sell you a miracle", beats: [
    c("talk", {}),
    ak([{ word: "THIS IS NOT MAGIC", sub: "it will not hand a 70-year-old hand back the skin it had at 25 — and never by the weekend. What it does is slower, and far more interesting.", tone: "teal", atPhrase: "this is not magic" }], {}),
  ]},
  // ░░ EL DOLOR — mirate la mano ░░
  { key: "lookhand", phrase: "look at the back of it", beats: [
    c("talk", {}),
    ak([{ word: "AGE SPOTS", sub: "flat, brown, coffee-colored patches — 'liver spots', though your liver has nothing to do with them", tone: "teal", atPhrase: "the flat brown patches" }], {}),
  ]},
  { key: "cannothide", phrase: "the ones you cannot hide", beats: [
    fc([{ t: "You" }, { t: "cover" }, { t: "your" }, { t: "face." }, { t: "Not" }, { t: "your" }, { t: "HANDS.", hl: true }], { tone: "teal", at: "makeup on the back of your" }),
  ]},
  // ░░ QUÉ ES UNA MANCHA — el freno jammed + la cinta lenta ░░
  { key: "whatspot", phrase: "one of these spots actually is", beats: [
    c("talk", {}),
  ]},
  { key: "melano", phrase: "are called melanocytes", beats: [
    ak([{ word: "MELANOCYTES", sub: "tiny cells deep in your skin whose only job is to make melanin — brown pigment, your body's own sunscreen", tone: "teal", atPhrase: "are called melanocytes" }], {}),
  ]},
  { key: "stuck", phrase: "those little cells get stuck", beats: [
    ak([{ word: "THE ACCELERATOR JAMS ON", sub: "after decades of sun, some pigment cells get stuck ON — foot flat on the gas, printing melanin in one spot, never letting off", tone: "warn", atPhrase: "accelerator jammed all the way down" }], {}),
  ]},
  { key: "slowbelt", phrase: "skin is like a slow conveyor", beats: [
    fz("img/darkspots_dg_switch.png", { x: 0.5, y: 0.5, zoom: 1.1, label: "Too much made · too little cleared", tone: "teal" }),
  ]},
  { key: "pileup", phrase: "too much made too little cleared", beats: [
    fc([{ t: "Too" }, { t: "much" }, { t: "MADE.", hl: true }, { t: "Too" }, { t: "little" }, { t: "CLEARED.", hl: true }], { tone: "warn", at: "too much made too little cleared" }),
  ]},
  // ░░ RE-HOOK ░░
  { key: "rehook", phrase: "was a lot of biology", beats: [
    c("talk", {}),
    fc([{ t: "On" }, { t: "top?" }, { t: "Or" }, { t: "at" }, { t: "the" }, { t: "SWITCH?", hl: true }], { tone: "teal", at: "aimed underneath at the switch" }),
  ]},
  // ░░ POR QUÉ FALLAN limón / cremas ░░
  { key: "everybody", phrase: "nearly everybody does about it", beats: [
    c("talk", {}),
  ]},
  { key: "lemon", phrase: "they rub lemon on it", beats: [
    es("!", "The lemon trick — it can make the spots come back DARKER", { tone: "warn", w: 3.2, eyebrow: "Please stop" }),
  ]},
  { key: "lemonmyth", phrase: "sensitive to sunlight not less", beats: [
    mv("Lemon juice fades age spots", "Lemon makes skin MORE sun-sensitive — the spot comes back darker", { flipPhrase: "comes back darker than when" }),
  ]},
  { key: "polishing", phrase: "them are polishing the surface", beats: [
    ak([{ word: "CREAMS POLISH THE TOP", sub: "while the cell underneath keeps its foot on the gas — so the spot just refills", tone: "teal", atPhrase: "them are polishing the surface" }], {}),
  ]},
  { key: "mopping", phrase: "mopping the floor with the tap", beats: [
    mv("Bleach the pigment off the top", "Ease the switch OFF — or you mop the floor with the tap still running", { flipPhrase: "never turned off the water" }),
  ]},
  // ░░ VIÑETA DE PACIENTE ░░
  { key: "patient", phrase: "tell you about a patient", beats: [
    c("talk", {}),
    lt("\"All I can see is the back of my hand\"", { kicker: "One patient — Ruth, 68", desc: "She came about her blood pressure. At the door she held out her hands and said that in the loveliest photo of her granddaughter's wedding, all she could see was the back of her hand. Every cream on her shelf aimed at the wrong target.", tone: "teal", at: "tell you about a patient" }),
  ]},
  // ░░ EL REVEAL — BEARBERRY / ARBUTIN = EL FRENO ░░
  { key: "reveal", phrase: "the one i promised you", beats: [
    c("talk", {}),
    r("ds_federer_leaf", { at: "the one i promised you", kicker: "Bearberry leaf — uva-ursi, pennies a bag" }),
    ak([{ word: "BEARBERRY (UVA-URSI)", sub: "not the berry — the LEAF; a seriously studied plant for exactly this problem", tone: "teal", atPhrase: "it is bearberry bearberry leaf" }], {}),
  ]},
  { key: "arbutin", phrase: "it is called arbutin", beats: [
    ak([{ word: "ARBUTIN = THE MELANIN BRAKE", sub: "it gets in the way of tyrosinase — the enzyme your skin must have to build brown pigment. The first thing that presses the brake.", tone: "teal", atPhrase: "it is called arbutin" }], {}),
  ]},
  { key: "tyros", phrase: "enzyme it is called tyrosinase", beats: [
    ak([{ word: "TYROSINASE = THE PIGMENT ENGINE", sub: "no tyrosinase, no new pigment — arbutin quietly gets in its way", tone: "teal", atPhrase: "enzyme it is called tyrosinase" }], {}),
  ]},
  { key: "brake", phrase: "actually presses the brake", beats: [
    fc([{ t: "The" }, { t: "MELANIN", hl: true }, { t: "brake." }], { tone: "teal", at: "actually presses the brake" }),
  ]},
  // ░░ LA BRONCA — el serum de $80 ES la hoja ░░
  { key: "anger", phrase: "part that is going to make", beats: [
    c("talk", {}),
    fz("img/darkspots_cmp_serum.png", { x: 0.5, y: 0.5, zoom: 1.06, label: "You already own the ingredient", tone: "gold" }),
  ]},
  { key: "buying", phrase: "you have been buying the leaf", beats: [
    mv("The $80 serum has a secret active", "It is usually arbutin — from the leaf you can buy for pocket change", { flipPhrase: "buying it with about seventy" }),
  ]},
  // ░░ POR QUÉ DE NOCHE — firma del canal ░░
  { key: "whynight", phrase: "we do this at night", beats: [
    c("talk", {}),
    fc([{ t: "Why" }, { t: "at" }, { t: "NIGHT?", hl: true }], { tone: "teal", at: "we do this at night" }),
  ]},
  { key: "trigger", phrase: "flips that pigment switch on", beats: [
    ak([{ word: "SUNLIGHT IS THE TRIGGER", sub: "by day the sun flips the switch back on all day long — at night the trigger is gone and the cell goes quiet", tone: "teal", atPhrase: "flips that pigment switch on" }], {}),
  ]},
  { key: "daynight", phrase: "day is when the spots are made", beats: [
    fc([{ t: "DAY", hl: true }, { t: "makes" }, { t: "them." }, { t: "NIGHT", hl: true }, { t: "unmakes" }, { t: "them." }], { tone: "teal", at: "day is when the spots are made" }),
  ]},
  // ░░ LA RECETA — él lo hace (presenter), amounts a la lámina ░░
  { key: "how", phrase: "little bear berry night compress", beats: [
    c("talk", {}),
    r("ds_federer_brew", { at: "little bear berry night compress", kicker: "Brew it strong — much stronger than a tea" }),
  ]},
  { key: "nodrink", phrase: "not going to drink this", beats: [
    ak([{ word: "DO NOT DRINK IT", sub: "bearberry by mouth, day after day, is hard on the liver — this is for the skin, on the skin, only", tone: "warn", atPhrase: "not going to drink this" }], {}),
  ]},
  { key: "apply", phrase: "soak a cotton pad and press", beats: [
    r("ds_federer_apply", { at: "soak a cotton pad and press", kicker: "Press — do not rub — on the spots, at night" }),
  ]},
  { key: "applynight", phrase: "you put sunscreen on", beats: [
    ak([{ word: "MORNING: RINSE + SUNSCREEN", sub: "the one step you cannot skip — the sun undoes everything; SPF is what makes the fade stick", tone: "warn", atPhrase: "you put sunscreen on" }], {}),
  ]},
  { key: "rhythm", phrase: "night the bear berry morning the shield", beats: [
    fc([{ t: "Night:" }, { t: "the" }, { t: "BEARBERRY.", hl: true }, { t: "Morning:" }, { t: "the" }, { t: "SHIELD.", hl: true }], { tone: "teal", at: "night the bear berry morning the shield" }),
  ]},
  // ░░ ★ LÁMINA — valor puro, zoom por zona ░░
  { key: "lamina", phrase: "onto one single page", beats: [
    fz(LAM, { x: 0.5, y: 0.42, zoom: 1.12, label: "The Melanin Brake Protocol — one page", tone: "teal" }),
  ]},
  { key: "lam_brew", phrase: "the left that is the treatment", beats: [
    fz(LAM, { x: 0.3, y: 0.46, zoom: 2.0, label: "Brew · Compress · Where", tone: "teal" }),
  ]},
  { key: "lam_jobs", phrase: "actually happening under your skin", beats: [
    fz(LAM, { x: 0.52, y: 0.46, zoom: 2.0, label: "What happens while you sleep", tone: "teal" }),
  ]},
  { key: "lam_time", phrase: "is the timeline what actually happens", beats: [
    fz(LAM, { x: 0.74, y: 0.5, zoom: 2.0, label: "Week 1 → Week 12", tone: "gold" }),
  ]},
  { key: "lam_blur", phrase: "edges of the spots start to blur", beats: [
    fz(LAM, { x: 0.74, y: 0.62, zoom: 2.3, label: "Week 3-4 — the edges blur", tone: "gold" }),
  ]},
  { key: "screenshot", phrase: "take a screenshot of this page", beats: [
    fz(LAM, { x: 0.5, y: 0.5, zoom: 1.0, label: "Take a screenshot — save this page", tone: "gold" }),
  ]},
  // ░░ ★ REVELAR QUE SALIÓ DE LA GUÍA + QR ░░
  { key: "reveal_guide", phrase: "this is one page one", beats: [
    fz(REVEAL, { x: 0.5, y: 0.5, zoom: 1.04, label: undefined, tone: "teal" }),
  ]},
  { key: "reveal_name", phrase: "whole thing is called the", beats: [
    fz(REVEAL, { x: 0.42, y: 0.48, zoom: 1.2, label: undefined, tone: "teal" }),
  ]},
  { key: "descfree", phrase: "sitting in the description right below", beats: [
    lt("The full guide → free, in the description", { kicker: "Every amount, to the spoon", desc: "The complete protocol — exact measurements, a gentler version for very thin, reactive skin, and the foods and habits that stop new spots forming. Free, just below this video.", tone: "teal", at: "sitting in the description right below" }),
  ]},
  { key: "reveal_qr", phrase: "point your phone camera at it", beats: [
    fz(REVEAL, { x: 0.74, y: 0.56, zoom: 1.4, label: undefined, tone: "teal" }),
  ]},
  // ░░ 2ª ESTRATEGIA — truco reservado a la descripción ░░
  { key: "reserved", phrase: "is a stronger version of this", beats: [
    c("talk", {}),
    lt("The stronger version → top of the description", { kicker: "For the stubborn spots", desc: "For the old, deep, 15-to-20-year spots: how to make the bearberry work harder, safely, with one extra everyday ingredient — plus the exact morning step that stops a faded spot from creeping back. It is right under the guide link.", tone: "teal", at: "is a stronger version of this" }),
  ]},
  { key: "stubborn", phrase: "old deep dark spots that have", beats: [
    ak([{ word: "FOR OLD, STUBBORN SPOTS", sub: "a stronger, safe way to concentrate the bearberry + the one extra ingredient — it is at the top of the description", tone: "teal", atPhrase: "old deep dark spots that have" }], {}),
  ]},
  // ░░ ESCUDO DE HONESTIDAD / SEGURIDAD ░░
  { key: "safety", phrase: "safety because i am a doctor", beats: [
    c("talk", {}),
  ]},
  { key: "patchtest", phrase: "patch test first always", beats: [
    ak([{ word: "PATCH-TEST FIRST", sub: "a dab on the inside of your wrist, wait a full day — no redness, no itch, you are good", tone: "warn", atPhrase: "patch test first always" }], {}),
  ]},
  { key: "danger", phrase: "a spot that is changing", beats: [
    c("checklist", { title: "See a doctor in person if a spot is…", eyebrow: "This one is firm", tone: "warn", stamp: "GET IT CHECKED", items: [
      { text: "Growing, or getting darker on its own", state: "warn" },
      { text: "Ragged or uneven at the edges", state: "warn" },
      { text: "More than one color in it", state: "warn" },
      { text: "Itching, or bleeding", state: "warn" } ], at: "a spot that is changing" }),
  ]},
  // ░░ CIERRE ░░
  { key: "close", phrase: "one quiet little leaf a few", beats: [
    c("nametag", { name: "Dr. Federer", role: "One quiet little leaf, a few cents, at night — and the patience to let your own skin do the work.", image: "img/ds_federer_close.png", at: "one quiet little leaf a few" }),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado handsage) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_darkspots.json", "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);
const VIDEO_END = (CW[CW.length - 1]?.s || 1090) + 2;

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
    const id = `${sec.key}_${i}`;
    const beat = { id, start: cursor, dur, key: sec.key };
    if (b.t === "talk") { beat.kind = "talk"; }
    else if (b.t === "raw") { beat.kind = "raw"; beat.src = `img/${b.name}.png`; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true; }
    else { beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur; beat.key = sec.key;
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
    }
    beats.push(beat);
  });
}

// ── POST-PASS MILIMÉTRICO (avatarkeyword + mitoverdad) ───────
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
    // NO pre-cut clips (evita 404 avatar_clips/darkspots/*.mp4): renderComp usa darkspots_opt.mp4 + avatarFrom=start*30
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) {
    const ms = findMs(beat.flipPhrase, beat.start - 1);
    const lastSafe = Math.round(beat.dur * 30) - 26;
    let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42);
    if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42);
    beat.flipAt = f; delete beat.flipPhrase;
  }
  if (beat.kind === "errorstinger" && !beat.eyebrow) { beat.eyebrow = "Step"; }
  if (beat.at) delete beat.at;
}
fs.writeFileSync("public/avatar_clips_darkspots.json", JSON.stringify(KIT_CLIPS, null, 1));

// ── PISO DE DURACIÓN ──
const COMPK = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "callout", "bars", "diagram", "rule", "nametag", "board", "annotated", "cross", "process", "lowerthird", "guardaesto", "errorstinger", "mitoverdad", "frasecinetica", "freezezoom", "pricewar", "reprintscan", "hourdial"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) {
  const i = compIx[k];
  const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END;
  const capDur = nextComp - beats[i].start - 0.1;
  beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2);
}

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/_fed6/VideoEdit/darkspots_beats.ts",
  `// AUTO-GENERADO por gen_darkspots.mjs — beats (presenter IA ds_federer_*.png + componentes data-driven).\n` +
  `export const DS_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/darkspots_hooks.ts",
  `// AUTO-GENERADO por gen_darkspots.mjs — rangos talk.\n` +
  `export const TALKSR: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/darkspots.json", JSON.stringify({ video: "darkspots", avatar: "darkspots_opt.mp4", theme: "medico", beats }, null, 1));

// ── QA ──
const need = new Set();
beats.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); if (b.leftImage) need.add(b.leftImage); if (b.rightImage) need.add(b.rightImage); if (Array.isArray(b.slides)) b.slides.forEach((s) => s.image && need.add(s.image)); if (Array.isArray(b.items)) b.items.forEach((it) => it && it.image && need.add(it.image)); });
const miss = [...need].filter((p) => !fs.existsSync("public/" + p));
if (missing.length) console.log(`⚠ frases no ancladas (${missing.length}):`, missing);
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw(presenter): ${raw} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min) · VIDEO_END ${VIDEO_END.toFixed(0)}s`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`imágenes referenciadas: ${need.size} · faltantes: ${miss.length}`);
console.log("MISS:", miss.join(" "));
