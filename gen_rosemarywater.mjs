// gen_rosemarywater.mjs — beatsheet/rosemarywater.json (Canal "Dr. Federer | Holistic Health" · EN · THE ROSEMARY GLASS / agua de romero que se BEBE).
// Avatar rosemarywater_opt.mp4 (~18min, EN "you"). Anclaje por FRASE a captions_rosemarywater.json.
// MATERIAL: b-roll = SOLO stock Pexels (cama WATER_BROLL). IA = SOLO el presentador (rw_federer_*.png, gpt-image-2 con ref).
// Diagramas = componentes REALES data-driven (errorstinger/avatarkeyword/frasecinetica/mitoverdad/checklist/bars/stat/guardaesto/lowerthird), NUNCA imagen IA.
// Estructura 17 bloques: HOOK reframe ("no es superficie, es SUMINISTRO — desde adentro, a una hora") → inventario sensorial (lip test, sin espejo)
// → glass-not-jar → reveal ROMERO + $2 + antioxidante + OPEN LOOP (el error) → promise stack + 1a descripción + presentación + anécdota paciente
// → 3 cosas (carnosic/rosmarinic/AGUA) → apple/lemon → WHY MORNING (firma adaptada) + water loss → villano comercial (beauty waters) → cómo hacerlo (3 cosas, HOT NOT BOIL)
// → por qué cara/manos primero → honestidad + med caution → PAGO DEL LOOP (LA HIERVEN) → recap 5 pasos → CTA guía + comentarios + teaser + cierre callback.
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
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.9, pricewar: 2.6 };

const SECTIONS = [
  // ░░ HOOK v2 — escalera de golpes (abre en el VASO, no en la cara) ░░
  { key: "hook", phrase: null, start: 0.3, beats: [
    // 0:00 — cold-open sobre el vaso de romero (NO la cara), zoom lento
    c("freezezoom", { image: "img/hook_glass.jpg", x: 0.5, y: 0.5, zoom: 1.5, label: "About two dollars.", tone: "teal" }),
    // 0:04 — GUERRA DE PRECIOS: $2 vs $60, split
    c("pricewar", { leftImage: "img/hook_glass.jpg", rightImage: "img/hook_bottle.jpg", leftPrice: "$2", rightPrice: "$60", strike: "/ year", leftLabel: "Rosemary + a glass of water", rightLabel: "“Beauty collagen water”", subtitle: "Does more for over-60 skin than a $60 bottle does in a year.", at: "60 beauty collagen water" }),
  ]},
  // 0:14 — recién ACÁ el doctor, full, se gana la confianza
  { key: "iknow", phrase: "know exactly how that sounds", beats: [
    c("talk", {}),
  ]},
  // 0:23 — OPEN LOOP trabado en los primeros 30s
  { key: "openloop_early", phrase: "does absolutely nothing for others", beats: [
    es("!", "Works for some — NOTHING for others. One mistake.", { tone: "warn", w: 3.0, eyebrow: "Revealed at the end" }),
  ]},
  // 0:30 — REFRAME: MITO → VERDAD con flip físico
  { key: "reframe", phrase: "not a surface problem", beats: [
    mv("Dull skin is a SURFACE problem — buy another cream", "It's a SUPPLY problem — starved & thirsty from the INSIDE", { flipPhrase: "a supply problem" }),
  ]},
  { key: "one_hour", phrase: "one hour of the day", beats: [
    ak([{ word: "FIX IT FROM THE INSIDE", sub: "your skin is starved & thirsty — you supply it at the one hour your body is paying attention", tone: "teal", atPhrase: "your body is actually paying" }], {}),
  ]},
  // ░░ INVENTARIO SENSORIAL — participación física (sin espejo) ░░
  { key: "inventory", phrase: "look at the back of your hand", beats: [
    // FreezeZoom que clava y hace zoom a la mano crepé real
    c("freezezoom", { image: "img/hook_hand.jpg", x: 0.62, y: 0.42, zoom: 2.0, label: "A little flatter, a little duller than it was?", tone: "teal", at: "look at the back of your hand" }),
    ak([{ word: "THE LIP TEST", sub: "run your tongue over your lips — a little dry? that same dryness is in your skin", tone: "teal", atPhrase: "run your tongue lightly over" }], {}),
  ]},
  { key: "fixable", phrase: "the single most fixable thing", beats: [
    lt("The cheapest fix is a glass — not a jar", { kicker: "The most fixable thing about aging skin", desc: "Morning dryness in your face and hands is the single most fixable thing — and almost nobody's told you it's a glass, not a jar.", tone: "teal", at: "the cheapest way to fix" }),
  ]},
  // ░░ REVEAL ROMERO + PRECIO + ANTIOXIDANTE + OPEN LOOP ░░
  { key: "reveal", phrase: "plain rosemary a small handful", beats: [
    c("talk", {}),
    c("stat", { value: 2, prefix: "$", eyebrow: "The price", label: "A handful of rosemary + a glass of water — vs a $60 'beauty water'", tone: "teal", at: "steeping in kitchens for 400" }),
  ]},
  { key: "antiox_reveal", phrase: "one of the most antioxidant", beats: [
    ak([{ word: "ANTIOXIDANT-DENSE PLANT", sub: "one of the most antioxidant-dense plants there is — common, cheap, in every store", tone: "teal", atPhrase: "one of the most antioxidant" }], {}),
  ]},
  { key: "openloop", phrase: "9 out of 10 people who try", beats: [
    es("!", "9 out of 10 ruin it — one mistake making it", { tone: "warn", w: 3.2, eyebrow: "One mistake" }),
  ]},
  { key: "desc1", phrase: "one simple guide", beats: [
    ge("Exact recipe → in the description", ["Rosemary per cup", "Fresh vs dried", "The water temperature that keeps it alive"], { at: "the amount of rosemary per cup" }),
  ]},
  // ░░ PROMISE STACK — 3 RESULTADOS ░░
  { key: "results", phrase: "if you do this the right way", beats: [
    c("talk", {}),
  ]},
  { key: "result1", phrase: "the first week to two weeks", beats: [
    es("01", "Weeks 1–2: puffiness settles, less tight & papery", { tone: "teal", w: 3.0 }),
  ]},
  { key: "result2", phrase: "week 4 to 6", beats: [
    es("02", "Weeks 4–6: brighter, more even — the 'glow'", { tone: "teal", w: 3.0 }),
  ]},
  { key: "result3", phrase: "the darker spots the loss of firmness", beats: [
    es("03", "2–3 months: firmness returns, spots ease (never erase)", { tone: "teal", w: 3.0 }),
  ]},
  { key: "honest_time", phrase: "it does not erase", beats: [
    mv("A glass of water erases dark spots", "It EASES — spots don't vanish from water, and I won't pretend they do", { flipPhrase: "it does not erase" }),
  ]},
  // ░░ PRESENTACIÓN (~min 4) + ANÉCDOTA ░░
  { key: "intro", phrase: "my name is dr federer", beats: [
    c("talk", {}),
    c("nametag", { name: "Dr. Federer", role: "Physician — natural plant chemistry for mature skin", image: "img/rw_federer_nametag.png", at: "a physician and for years" }),
  ]},
  { key: "anecdote", phrase: "let me tell you about one woman", beats: [
    lt("“Did you do something?” — her granddaughter", { kicker: "One patient, $500 in a year", desc: "Her skin wasn't damaged — it was thirsty and underfed. She dropped the powders and drank one glass every morning before coffee.", tone: "teal", at: "her granddaughter had asked" }),
  ]},
  // ░░ 3 COSAS (carnosic / rosmarinic / AGUA) ░░
  { key: "compounds", phrase: "three things working in that little glass", beats: [
    c("talk", {}),
    ak([{ word: "CARNOSIC ACID", sub: "the antioxidant — travels in your blood and stands guard over your collagen", tone: "teal", atPhrase: "say it with me" }], {}),
  ]},
  { key: "rosmarinic", phrase: "the second is rosmarinic acid", beats: [
    es("02", "Rosmarinic acid — calms quiet inflammation from within", { tone: "teal", w: 3.0 }),
  ]},
  { key: "water_compound", phrase: "the most obvious thing in", beats: [
    es("03", "The water itself — a glass at your most dehydrated minute", { tone: "teal", w: 3.0 }),
  ]},
  { key: "three_jobs", phrase: "three things one antioxidant bodyguard", beats: [
    ge("One $2 herb, three jobs", ["Carnosic → guards collagen", "Rosmarinic → calms redness", "Water → hydrates & carries it in"], { at: "one glass of water at the right" }),
  ]},
  { key: "apple", phrase: "cut an apple in half", beats: [
    fc([{ t: "Carnosic" }, { t: "acid" }, { t: "is" }, { t: "the" }, { t: "LEMON", hl: true }, { t: "on" }, { t: "the" }, { t: "apple." }], { tone: "teal", at: "carnosic acid is the lemon" }),
  ]},
  // ░░ WHY MORNING — firma del canal (adaptada a la bebida) ░░
  { key: "morning", phrase: "now the hour", beats: [
    c("talk", {}),
    fc([{ t: "Why" }, { t: "the" }, { t: "MORNING?", hl: true }], { tone: "teal", at: "why the morning" }),
  ]},
  { key: "clock", phrase: "your body has a clock", beats: [
    mv("Any hour works — just drink it sometime", "By MORNING you're at your most dehydrated — that's when a glass lands hardest", { flipPhrase: "most dehydrated point of the" }),
  ]},
  { key: "water_loss", phrase: "transepidermal water loss", beats: [
    ak([{ word: "TRANSEPIDERMAL WATER LOSS", sub: "all night your skin evaporates into the room — you wake up running a quart low", tone: "teal", atPhrase: "your skin quietly evaporating" }], {}),
  ]},
  { key: "begging", phrase: "feeding the skin at the precise", beats: [
    fc([{ t: "Drink" }, { t: "it" }, { t: "when" }, { t: "it's" }, { t: "BEGGING.", hl: true }], { tone: "teal", at: "at the precise minute" }),
  ]},
  // ░░ VILLANO COMERCIAL ░░
  { key: "villain", phrase: "walk the aisle", beats: [
    c("talk", {}),
    c("bars", { title: "'Beauty water' in a bottle — what you pay for", bars: [
      { label: "Active ingredient", value: 15, tone: "danger", note: "a pinch" },
      { label: "Water, sugar & a story", value: 85, tone: "danger", note: "most of it" } ], at: "a pinch of something sugar" }),
  ]},
  { key: "not_villain", phrase: "2 dollars of an herb", beats: [
    fc([{ t: "Two" }, { t: "dollars" }, { t: "of" }, { t: "herb." }, { t: "A" }, { t: "glass" }, { t: "of" }, { t: "WATER.", hl: true }], { tone: "teal", at: "2 dollars of an herb" }),
  ]},
  // ░░ CÓMO HACERLO — 3 COSAS (HOT, NOT BOIL) ░░
  { key: "howto", phrase: "there are really only 3 things", beats: [
    c("talk", {}),
    r("rw_federer_steep_cup", { at: "into your cup", kicker: "A small handful — fresh or dried, both work" }),
  ]},
  { key: "thing1", phrase: "fresh sprigs if you can get", beats: [
    es("01", "Fresh OR dried — the compounds survive drying", { tone: "teal", w: 2.8, eyebrow: "Thing" }),
  ]},
  { key: "thing2_boil", phrase: "the water must be hot but", beats: [
    r("rw_federer_kettle_pour", { at: "you bring the water to a boil", kicker: "Boil, then take it OFF the heat — never pour it boiling" }),
    ak([{ word: "HOT, NOT BOILING", sub: "boil, take it off the heat a minute, THEN pour over the rosemary — steep covered 5–10 min", tone: "warn", atPhrase: "you take it off the heat" }], {}),
  ]},
  { key: "thing3", phrase: "drink it first before the coffee", beats: [
    es("03", "One glass, first thing — before coffee & food", { tone: "teal", w: 2.8, eyebrow: "Thing" }),
  ]},
  // ░░ POR QUÉ CARA / MANOS PRIMERO ░░
  { key: "thin_skin", phrase: "why do those age first", beats: [
    lt("Face & hands age first: thinnest skin, always exposed", { kicker: "Why here, first", desc: "The thinnest skin you have, and the skin that never gets to hide — sun, wind, cold, and the least blood flow to spare. That's why they respond so well when you finally supply them.", tone: "teal", at: "the thinnest skin on your whole" }),
  ]},
  { key: "now_start", phrase: "the second best is tomorrow morning", beats: [
    ak([{ word: "THE SECOND-BEST MORNING IS TOMORROW", sub: "skin holds water less each year — the sooner you supply it, the more there is to keep", tone: "teal", atPhrase: "second best is tomorrow morning" }], {}),
  ]},
  // ░░ ESCUDO DE HONESTIDAD ░░
  { key: "honesty", phrase: "the honest doctor for a minute", beats: [
    c("talk", {}),
    c("checklist", { title: "Be honest — what rosemary water will NOT do", eyebrow: "The honest truth", tone: "warn", items: [
      { text: "Erase a wrinkle or delete a dark spot (it eases)", state: "warn" },
      { text: "'Detox' you — your liver already does that free", state: "warn" },
      { text: "Work in three days — give it weeks", state: "warn" },
      { text: "Replace your sun protection", state: "warn" } ], at: "it will not erase a deep" }),
  ]},
  { key: "caution", phrase: "on regular medication especially a blood", beats: [
    ak([{ word: "ON MEDS? ASK YOUR DOCTOR FIRST", sub: "a strong daily infusion is more concentrated than a sprig — pregnant or on blood thinners, check first", tone: "warn", atPhrase: "run it past your own doctor" }], {}),
  ]},
  // ░░ EL ERROR (pago del open loop) — LA HIERVEN ░░
  { key: "error", phrase: "the mistake 9 out of 10", beats: [
    c("talk", {}),
    es("!", "They BOIL it", { tone: "warn", w: 3.2, eyebrow: "The mistake" }),
  ]},
  { key: "boil_kills", phrase: "those delicate compounds", beats: [
    mv("Boil it hard = stronger medicine", "A hard boil DESTROYS the carnosic & rosmarinic acid — you drink dead water", { flipPhrase: "break them down and steam" }),
  ]},
  { key: "gentler", phrase: "the exact opposite of more is stronger", beats: [
    fc([{ t: "With" }, { t: "this" }, { t: "plant," }, { t: "GENTLER", hl: true }, { t: "is" }, { t: "STRONGER.", hl: true }], { tone: "teal", at: "gentler is stronger" }),
  ]},
  // ░░ RECAP 5 PASOS ░░
  { key: "recap", phrase: "put the whole thing together", beats: [
    c("talk", {}),
    ge("The Rosemary Glass — 5 steps", ["1 · A handful — fresh or dried", "2 · Boil, then OFF the heat — never pour it boiling", "3 · Cover & steep gently 5–10 min", "4 · Drink first thing, before coffee", "5 · One glass most days — give it 8 weeks"], { at: "5 steps so you can" }),
  ]},
  // ░░ CTA GUÍA + COMENTARIOS + TEASER + CIERRE ░░
  { key: "guide", phrase: "linked at the top of the", beats: [
    lt("The full card is in the description", { kicker: "Read it before your first glass", desc: "Exact amounts, fresh-vs-dried, the water temperature, days per week — doing it gently matters more than doing it strong.", tone: "teal", at: "before your first glass" }),
  ]},
  { key: "cta_coment", phrase: "down in the comments", beats: [
    ak([{ word: "TELL ME: BOILED OR STEEPED?", sub: "have you been boiling your herbs this whole time, thinking harder was better?", tone: "teal", atPhrase: "just tell me boiled or steeped" }], {}),
  ]},
  { key: "teaser", phrase: "in the next video", beats: [
    ak([{ word: "NEXT: THE EVENING DRINK THAT DRIES YOUR SKIN", sub: "one 'relaxing' drink that quietly pulls water OUT of your skin all night", tone: "teal", atPhrase: "one warm drink most people" }], {}),
  ]},
  { key: "cierre", phrase: "back of your hand one more", beats: [
    c("nametag", { name: "Dr. Federer", role: "Thirsty and underfed — not broken. A glass, at the right hour. Tomorrow.", image: "img/rw_federer_serious.png", at: "give it 8 weeks" }),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_rosemarywater.json", "utf8"));
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
    beat.clip = `avatar_clips/rosemarywater/${beat.id}.mp4`;
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
fs.writeFileSync("public/avatar_clips_rosemarywater.json", JSON.stringify(KIT_CLIPS, null, 1));

// ── PISO DE DURACIÓN ──
const COMPK = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "callout", "bars", "diagram", "rule", "nametag", "board", "annotated", "cross", "process", "lowerthird", "guardaesto", "errorstinger", "mitoverdad", "frasecinetica", "freezezoom", "pricewar"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) {
  const i = compIx[k];
  const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END;
  const capDur = nextComp - beats[i].start - 0.1;
  beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2);
}

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/_fed6/VideoEdit/rosemarywater_beats.ts",
  `// AUTO-GENERADO por gen_rosemarywater.mjs — beats (presenter IA rw_federer_*.png + componentes data-driven).\n` +
  `export const WATER_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/rosemarywater_hooks.ts",
  `// AUTO-GENERADO por gen_rosemarywater.mjs — rangos talk.\n` +
  `export const TALKSR: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/rosemarywater.json", JSON.stringify({ video: "rosemarywater", avatar: "rosemarywater_opt.mp4", theme: "medico", beats }, null, 1));

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
