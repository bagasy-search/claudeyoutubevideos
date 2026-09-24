// gen_rosemaryrub.mjs — beatsheet/rosemaryrub.json (Canal "Dr. Federer | Holistic Health" · EN · THE ROSEMARY PRESS / arrugas cara).
// Avatar rosemaryrub_opt.mp4 (~19min, EN "you"). Anclaje por FRASE a captions_rosemaryrub.json.
// MATERIAL: b-roll = SOLO stock Pexels (cama RUB_BROLL). IA = SOLO el presentador (rub_federer_*.png, gpt-image-2 con ref).
// Diagramas = componentes REALES data-driven (errorstinger/avatarkeyword/frasecinetica/mitoverdad/checklist/bars/stat/guardaesto/lowerthird), NUNCA imagen IA.
// Estructura 17 bloques: HOOK reframe ("no es la planta, es la DIRECCIÓN de tus dedos + la HORA") → inventario sensorial (sin espejo)
// → wrinkle=lost bounce → reveal ROMERO + $2 + carnosic + open loop → promise stack + 1a descripción + presentación + anécdota paciente
// → 3 compuestos → apple/lemon (antioxidante) → WHY AT NIGHT (firma) + water loss → villano comercial (2 frascos) → rutina 3 capas
// → por qué cara/manos primero → LAYER 3 = "press, not drag" (el THIS way) → honestidad + patch test → PAGO DEL LOOP (el sello)
// → recap 5 pasos → CTA guía + comentarios + teaser + cierre callback.
import fs from "fs";

const r  = (name, o = {}) => ({ t: "raw", name, ...o });
const c  = (kind, props = {}) => ({ t: kind, ...props });
const es = (number, title, o = {}) => ({ t: "errorstinger", number, title, tone: o.tone || "teal", ...o });
const mv = (myth, truth, o = {}) => ({ t: "mitoverdad", myth, truth, ...o });
const fc = (words, o = {}) => ({ t: "frasecinetica", words, tone: o.tone || "teal", perWord: o.perWord || 10, ...o });
const ak = (items, o = {}) => ({ t: "avatarkeyword", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const lt = (title, o = {}) => ({ t: "lowerthird", title, tone: o.tone || "teal", ...o });
const ge = (title, items, o = {}) => ({ t: "guardaesto", title, items, ...o });

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1, bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, annotated: 1.3, cross: 1.6, process: 2.6, talk: 1.0,
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.6 };

const SECTIONS = [
  // ░░ HOOK — reframe loquísimo ░░
  { key: "hook", phrase: null, start: 1.0, beats: [
    c("talk", {}),
    r("rub_federer_hold_rosemary", { at: "common kitchen herb", kicker: "One $2 kitchen herb." }),
  ]},
  { key: "reframe", phrase: "not really about the rosemary", beats: [
    fc([{ t: "It's" }, { t: "not" }, { t: "the" }, { t: "rosemary." }, { t: "It's" }, { t: "HOW", hl: true }, { t: "you" }, { t: "rub" }, { t: "it." }], { tone: "teal", at: "not really about the rosemary" }),
  ]},
  { key: "one_hour", phrase: "the hour of the day you do it", beats: [
    ak([{ word: "DIRECTION + THE HOUR", sub: "which way your fingers move, and when you do it — that decides everything", tone: "teal", atPhrase: "the hour of the day" }], {}),
  ]},
  // ░░ INVENTARIO SENSORIAL (sin espejo) ░░
  { key: "inventory", phrase: "back of your hand for a second", beats: [
    c("talk", {}),
    ak([{ word: "THE 2-FINGER TEST", sub: "rest two fingers at the corner of your eye — feel where it wants to fold", tone: "teal", atPhrase: "rest two fingers very lightly" }], {}),
  ]},
  { key: "bounce", phrase: "lost its ability to bounce back", beats: [
    lt("A wrinkle isn't just 'missing collagen'", { kicker: "What's really happening", desc: "The skin lost its spring — and every downward drag teaches it to fold along the same line. You're ironing the crease in.", tone: "teal", at: "teaching it to fold along" }),
  ]},
  { key: "reframe2", phrase: "at night while you sleep", beats: [
    fc([{ t: "You" }, { t: "reverse" }, { t: "it" }, { t: "at" }, { t: "ONE", hl: true }, { t: "hour:" }, { t: "at" }, { t: "NIGHT.", hl: true }], { tone: "teal", at: "actually reverse a little" }),
  ]},
  // ░░ REVEAL ROMERO + PRECIO + CARNOSIC + OPEN LOOP ░░
  { key: "reveal", phrase: "plain rosemary", beats: [
    c("talk", {}),
    c("stat", { value: 2, prefix: "$", eyebrow: "The price", label: "A jar of rosemary that lasts months — vs a $90 cream", tone: "teal", at: "dried kind in the jar" }),
  ]},
  { key: "carnosic_reveal", phrase: "compound called carnosic acid", beats: [
    ak([{ word: "CARNOSIC ACID", sub: "one of the strongest antioxidants in a common plant — it protects the collagen you have", tone: "teal", atPhrase: "one of the most powerful" }], {}),
  ]},
  { key: "notlie", phrase: "not builds new youth overnight", beats: [
    mv("It builds brand-new young skin", "It PROTECTS the collagen you already have — and lets the skin repair", { flipPhrase: "protects what you" }),
  ]},
  { key: "openloop", phrase: "9 out of 10 people who try", beats: [
    es("!", "9 out of 10 get nothing from it", { tone: "warn", w: 3.2, eyebrow: "One mistake" }),
  ]},
  { key: "desc1", phrase: "at the top of the description", beats: [
    ge("Exact recipe → in the description", ["How much rosemary", "How many drops", "The full step-by-step card"], { at: "one simple guide" }),
  ]},
  // ░░ PROMISE STACK — 3 RESULTADOS ░░
  { key: "results", phrase: "if you do this the right way", beats: [
    c("talk", {}),
  ]},
  { key: "result1", phrase: "first two weeks", beats: [
    es("01", "Weeks 1–2: softer, plumper, less papery", { tone: "teal", w: 3.0 }),
  ]},
  { key: "result2", phrase: "little ones at the corners", beats: [
    es("02", "Weeks 4–6: fine lines soften & blur", { tone: "teal", w: 3.0 }),
  ]},
  { key: "result3", phrase: "deeper folds", beats: [
    es("03", "2–3 months: deep folds ease (never vanish)", { tone: "teal", w: 3.0 }),
  ]},
  { key: "honest_time", phrase: "gone in a week they were selling", beats: [
    mv("Deep wrinkles gone in a week", "Weeks into months — anyone promising overnight was selling", { flipPhrase: "they were selling" }),
  ]},
  // ░░ PRESENTACIÓN (~min 4) + ANÉCDOTA ░░
  { key: "intro", phrase: "my name is dr federer", beats: [
    c("talk", {}),
    c("nametag", { name: "Dr. Federer", role: "Physician — natural plant chemistry for mature skin", image: "img/rub_federer_nametag.png", at: "i am a physician" }),
  ]},
  { key: "anecdote", phrase: "about one woman", beats: [
    lt("“My daughter asked what I was doing different”", { kicker: "One patient, $400 in a year", desc: "Her skin wasn't 'done' — she was sweeping every cream straight DOWN her cheeks. We changed two things: the hour, and the motion.", tone: "teal", at: "my daughter asked what" }),
  ]},
  // ░░ 3 COMPUESTOS ░░
  { key: "compounds", phrase: "three compounds in that leaf", beats: [
    c("talk", {}),
    ak([{ word: "CARNOSIC ACID", sub: "the antioxidant — the bodyguard in front of your collagen", tone: "teal", atPhrase: "say the first one" }], {}),
  ]},
  { key: "rosmarinic", phrase: "second one is rosmarinic acid", beats: [
    es("02", "Rosmarinic acid — calms quiet inflammation", { tone: "teal", w: 3.0 }),
  ]},
  { key: "ursolic", phrase: "third is ursolic acid", beats: [
    es("03", "Ursolic acid — rebuilds the barrier, holds water", { tone: "teal", w: 3.0 }),
  ]},
  { key: "three_jobs", phrase: "three compounds three jobs one leaf", beats: [
    ge("One $2 herb, three jobs", ["Carnosic → protects collagen", "Rosmarinic → calms redness", "Ursolic → holds moisture"], { at: "three compounds three jobs" }),
  ]},
  { key: "apple", phrase: "cutting an apple", beats: [
    fc([{ t: "Carnosic" }, { t: "acid" }, { t: "is" }, { t: "the" }, { t: "LEMON", hl: true }, { t: "on" }, { t: "the" }, { t: "apple." }], { tone: "teal", at: "carnosic acid is the lemon" }),
  ]},
  // ░░ WHY AT NIGHT — firma del canal ░░
  { key: "night", phrase: "why at night", beats: [
    c("talk", {}),
    fc([{ t: "Why" }, { t: "at" }, { t: "NIGHT?", hl: true }], { tone: "teal", at: "why at night" }),
  ]},
  { key: "clock", phrase: "your skin runs on a clock", beats: [
    mv("Day and night, skin works the same", "By DAY it defends. By NIGHT it repairs — that's when you feed it", { flipPhrase: "flips over into its repair" }),
  ]},
  { key: "water_loss", phrase: "loses water fastest", beats: [
    ak([{ word: "TRANSEPIDERMAL WATER LOSS", sub: "at night your skin evaporates into the room — exactly when a sealed oil helps most", tone: "teal", atPhrase: "there is a real term" }], {}),
  ]},
  { key: "night_shift", phrase: "you feed it when", beats: [
    fc([{ t: "Feed" }, { t: "it" }, { t: "when" }, { t: "it's" }, { t: "BUILDING.", hl: true }], { tone: "teal", at: "feed it when it's building" }),
  ]},
  // ░░ VILLANO COMERCIAL ░░
  { key: "villain", phrase: "walk down the aisle", beats: [
    c("talk", {}),
    c("bars", { title: "Day cream vs night cream — often the difference is…", bars: [
      { label: "Active difference", value: 18, tone: "danger", note: "small" },
      { label: "Label + perfume", value: 82, tone: "danger", note: "most of it" } ], at: "the label and the perfume" }),
  ]},
  { key: "not_villain", phrase: "you need one plant and the right hour", beats: [
    fc([{ t: "One" }, { t: "plant." }, { t: "The" }, { t: "right" }, { t: "HOUR.", hl: true }, { t: "Not" }, { t: "two" }, { t: "jars." }], { tone: "teal", at: "one plant and the right hour" }),
  ]},
  // ░░ RUTINA 3 CAPAS ░░
  { key: "routine", phrase: "three layers", beats: [
    c("talk", {}),
    es("01", "Damp skin first — seal in water, not dryness", { tone: "teal", w: 2.8, eyebrow: "Layer" }),
  ]},
  { key: "layer2", phrase: "the rosemary oil itself", beats: [
    r("rub_federer_oil_bottle", { at: "steeped in a mild carrier oil", kicker: "Rosemary steeped in a mild oil — never neat essential oil" }),
    es("02", "A few drops of rosemary-in-oil (never neat)", { tone: "warn", w: 2.8, eyebrow: "Layer" }),
  ]},
  { key: "thin_skin", phrase: "why do these age first", beats: [
    lt("Your face & hands age first: thin + always exposed", { kicker: "Why here, first", desc: "The thinnest skin you have, and the skin that never gets to hide — sun, wind, cold, every day. That's why it responds so well when you finally feed it.", tone: "teal", at: "thinnest skin you have" }),
  ]},
  // ░░ LAYER 3 = EL "THIS WAY" (press, not drag) ░░
  { key: "thisway", phrase: "this is the this way", beats: [
    c("talk", {}),
    r("rub_federer_press_demo", { at: "you do not rub it in", kicker: "Don't drag down. PRESS up." }),
  ]},
  { key: "dragbad", phrase: "gravity is already pulling", beats: [
    mv("Rub the cream downward, like always", "Dragging thin skin DOWN folds the crease in deeper, night after night", { flipPhrase: "folding the crease in deeper" }),
  ]},
  { key: "press", phrase: "what you do instead", beats: [
    r("rub_federer_point_up", { at: "press and lift", kicker: "Press & lift — up and out, toward the hairline" }),
    ak([{ word: "PRESS UP, NEVER DOWN", sub: "little firm presses up and out along each line — 60 seconds", tone: "teal", atPhrase: "up and out along the line" }], {}),
  ]},
  { key: "circulation", phrase: "brings blood up to the surface", beats: [
    fc([{ t: "Warm." }, { t: "Pink." }, { t: "That's" }, { t: "CIRCULATION", hl: true }, { t: "arriving." }], { tone: "teal", at: "a little warm a little pink" }),
  ]},
  { key: "now", phrase: "best night to have started", beats: [
    ak([{ word: "THE SECOND-BEST NIGHT IS TONIGHT", sub: "skin repairs a little less each year — the sooner you protect it, the more there is to protect", tone: "teal", atPhrase: "second best is tonight" }], {}),
  ]},
  // ░░ ESCUDO DE HONESTIDAD ░░
  { key: "honesty", phrase: "honest doctor for a minute", beats: [
    c("talk", {}),
    c("checklist", { title: "Be honest — what rosemary will NOT do", eyebrow: "The honest truth", tone: "warn", items: [
      { text: "Erase a deep wrinkle (it softens, not deletes)", state: "warn" },
      { text: "Work in three days — give it weeks", state: "warn" },
      { text: "Replace your sunscreen", state: "warn" } ], at: "will not erase a deep" }),
  ]},
  { key: "patch_test", phrase: "inside of your wrist", beats: [
    r("rub_federer_wrist_test", { at: "a little on the inside", hold: true, kicker: "Patch-test first — inner wrist or behind the ear, wait a day" }),
    ak([{ word: "PATCH TEST FIRST", sub: "never put undiluted essential oil on skin — always in a carrier oil", tone: "warn", atPhrase: "rosemary can irritate" }], {}),
  ]},
  // ░░ EL ERROR (pago del open loop) — EL SELLO ░░
  { key: "error", phrase: "the mistake 9 out of 10 people make", beats: [
    c("talk", {}),
    es("!", "They rub it ALL the way in", { tone: "warn", w: 3.2, eyebrow: "The mistake" }),
  ]},
  { key: "seal", phrase: "they just remove the seal", beats: [
    ak([{ word: "THEY WIPE OFF THE SEAL", sub: "the thin film left on top is the lid — it stops the overnight water loss", tone: "warn", atPhrase: "that thin film of oil" }], {}),
  ]},
  { key: "fix", phrase: "leave the sheen", beats: [
    fc([{ t: "Press" }, { t: "up." }, { t: "Then" }, { t: "STOP.", hl: true }, { t: "Leave" }, { t: "the" }, { t: "SHEEN.", hl: true }], { tone: "teal", at: "so press it up and out" }),
  ]},
  // ░░ RECAP 5 PASOS ░░
  { key: "recap", phrase: "put it all together", beats: [
    c("talk", {}),
    ge("The Rosemary Press — 5 steps", ["1 · At night, not morning", "2 · Damp skin first", "3 · Rosemary in a mild oil", "4 · Press UP, don't drag — leave the sheen", "5 · Sleep, let the night build"], { at: "five steps so you can" }),
  ]},
  // ░░ CTA GUÍA + COMENTARIOS + TEASER + CIERRE ░░
  { key: "guide", phrase: "the full patch test steps", beats: [
    lt("The full card is in the description", { kicker: "Read it before your first night", desc: "Exact amounts, which carrier oil, the patch-test steps — doing it right matters more than doing it fast.", tone: "teal", at: "linked at the top of the description" }),
  ]},
  { key: "cta_coment", phrase: "down in the comments", beats: [
    ak([{ word: "TELL ME: UP OR DOWN?", sub: "have you been dragging your cream downward this whole time?", tone: "teal", atPhrase: "just tell me up or down" }], {}),
  ]},
  { key: "teaser", phrase: "in the next video", beats: [
    ak([{ word: "NEXT: THE 'HEALTHY' BREAKFAST THAT AGES YOU", sub: "one food you eat most mornings that speeds up wrinkles faster than the sun", tone: "teal", atPhrase: "one food you're probably eating" }], {}),
  ]},
  { key: "cierre", phrase: "back of your hand one more time", beats: [
    c("nametag", { name: "Dr. Federer", role: "Fed at the wrong hour, touched the wrong way. Change those two — tonight.", image: "img/rub_federer_serious.png", at: "change those two things" }),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_rosemaryrub.json", "utf8"));
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1300) + 2;

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
    beat.clip = `avatar_clips/rosemaryrub/${beat.id}.mp4`;
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
fs.writeFileSync("public/avatar_clips_rosemaryrub.json", JSON.stringify(KIT_CLIPS, null, 1));

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

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/_fed6/VideoEdit/rosemaryrub_beats.ts",
  `// AUTO-GENERADO por gen_rosemaryrub.mjs — beats (presenter IA rub_federer_*.png + componentes data-driven).\n` +
  `export const RUB_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/rosemaryrub_hooks.ts",
  `// AUTO-GENERADO por gen_rosemaryrub.mjs — rangos talk.\n` +
  `export const TALKSR: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/rosemaryrub.json", JSON.stringify({ video: "rosemaryrub", avatar: "rosemaryrub_opt.mp4", theme: "medico", beats }, null, 1));

// ── QA ──
const need = new Set();
beats.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); if (Array.isArray(b.slides)) b.slides.forEach((s) => s.image && need.add(s.image)); if (Array.isArray(b.items)) b.items.forEach((it) => it && it.image && need.add(it.image)); });
const miss = [...need].filter((p) => !fs.existsSync("public/" + p));
if (missing.length) console.log(`⚠ frases no ancladas (${missing.length}):`, missing);
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw(presenter): ${raw} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min) · VIDEO_END ${VIDEO_END.toFixed(0)}s`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`imágenes presenter referenciadas: ${need.size} · faltantes: ${miss.length}`);
console.log("MISS:", miss.join(" "));
