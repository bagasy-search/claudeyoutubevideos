// gen_rosemaryglove.mjs — beatsheet/rosemaryglove.json (Canal "Dr. Federer | Holistic Health" · EN · THE ROSEMARY GLOVE / manos).
// Avatar rosemaryglove_opt.mp4 (~17.8min, EN "you"). Anclaje por FRASE a captions_rosemaryglove.json.
// Look CLÍNICO teal. Imágenes gpt-image-2 (.png): rose_*.png + dg_rose_*.png. Kit premium COMPLETO.
// Estructura (17 bloques del canal): HOOK reframe ("no es piel, es reparación → una hora del día") → inventario sensorial
// (pinch test, sin espejo) → por qué las manos primero (sol+lavado) → reveal ROMERO + precio $2 + open loop (error 9/10)
// → promise stack + 1a descripción + presentación (~min4) + anécdota → mecanismo tyrosinase → 3 compuestos → WHY AT NIGHT
// (firma) → villano comercial (4 frascos) → rutina 3 capas (glove) → escudo de honestidad + reveal del error → recap 5 pasos
// → injerto guía + CTA comentarios + teaser + cierre callback. Diagramas SIN eyebrow. Salida a src/_fed6/VideoEdit/.
import fs from "fs";

const r  = (name, o = {}) => ({ t: "raw", name, ...o });
const c  = (kind, props = {}) => ({ t: kind, ...props });
const dg = (name, _eyebrow, o = {}) => ({ t: "diagram", slides: [{ image: `img/${name}.png` }], ...o });
const es = (number, title, o = {}) => ({ t: "errorstinger", number, title, tone: o.tone || "teal", ...o });
const mv = (myth, truth, o = {}) => ({ t: "mitoverdad", myth, truth, ...o });
const fc = (words, o = {}) => ({ t: "frasecinetica", words, tone: o.tone || "teal", perWord: o.perWord || 10, ...o });
const ak = (items, o = {}) => ({ t: "avatarkeyword", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const lt = (title, o = {}) => ({ t: "lowerthird", title, tone: o.tone || "teal", ...o });
const ge = (title, items, o = {}) => ({ t: "guardaesto", title, items, ...o });
const fz = (image, o = {}) => ({ t: "freezezoom", image: `img/${image}.png`, ...o });

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1, bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, annotated: 1.3, cross: 1.6, process: 2.6, talk: 1.0,
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.6 };

const SECTIONS = [
  // ░░ HOOK — reframe loquísimo ░░
  { key: "hook", phrase: null, start: 1.0, beats: [
    c("talk", {}),
    r("rose_hands_spots_phone", { at: "look at the hand", kicker: "The backs of your hands." }),
    r("rose_hands_spots_close", { at: "those little brown patches", hold: true }),
  ]},
  { key: "reframe", phrase: "a repair problem", beats: [
    fc([{ t: "Not" }, { t: "a" }, { t: "skin" }, { t: "problem." }, { t: "A" }, { t: "REPAIR", hl: true }, { t: "problem." }], { tone: "teal", at: "they were never really" }),
  ]},
  { key: "one_hour", phrase: "one single hour of the day", beats: [
    ak([{ word: "FIXED AT ONE HOUR OF THE DAY", sub: "not morning, not afternoon — at night, while you sleep", tone: "teal", atPhrase: "at one single hour" }], {}),
  ]},
  // ░░ INVENTARIO SENSORIAL (sin espejo) ░░
  { key: "inventory", phrase: "look at the hand", beats: [
    c("talk", {}),
    r("rose_hands_phone_back", { at: "holding your phone with", kicker: "Turn it over. Look at the back." }),
  ]},
  { key: "pinch", phrase: "pinch it gently", beats: [
    r("rose_pinch_test", { at: "on the back of the hand", hold: true }),
    ak([{ word: "THE PINCH TEST", sub: "does the skin tent up for a second before it settles?", tone: "teal", atPhrase: "that little tent of skin" }], {}),
  ]},
  { key: "bounce", phrase: "made them bounce", beats: [
    lt("That's not wrinkles — it's lost bounce", { kicker: "What you're really seeing", desc: "The skin lost the thing that let it snap back. And your hands lose it first — before your face, before your neck. Here's why.", tone: "teal", at: "losing the one thing" }),
  ]},
  // ░░ POR QUÉ LAS MANOS PRIMERO ░░
  { key: "hands_first", phrase: "your hands take more sun", beats: [
    c("talk", {}),
    dg("dg_rose_hands_first", "Most sun + most washing + thinnest care = hands age first"),
  ]},
  { key: "washed", phrase: "they get washed", beats: [
    r("rose_hands_washing", { at: "10 15 20 times a day", hold: true }),
    ak([{ word: "MOST WORK, LEAST CARE", sub: "10, 15, 20 washes a day strip the barrier right off", tone: "teal", atPhrase: "strips the oil and the barrier" }], {}),
  ]},
  { key: "car_window", phrase: "the car window", beats: [
    r("rose_hand_car_window_sun", { at: "sits by the car window", hold: true }),
    lt("One hand is often more spotted than the other", { kicker: "A sunburn in slow motion", desc: "It's almost always the hand by the car window, catching the light on every drive, year after year. That's not aging — it's sun.", tone: "teal", at: "a sunburn in slow motion" }),
  ]},
  // ░░ REVEAL ROMERO + PRECIO + OPEN LOOP ░░
  { key: "reveal", phrase: "sitting in your spice rack", beats: [
    c("talk", {}),
    r("rose_sprig_fresh", { at: "now the herb it", kicker: "It's rosemary." }),
    r("rose_dried_jar", { at: "a bag that will last", hold: true }),
  ]},
  { key: "price", phrase: "steep it gently", beats: [
    c("stat", { value: 2, prefix: "$", eyebrow: "The price", label: "A bag of rosemary that lasts months — vs a $90 cream", tone: "teal", at: "will last you months" }),
    r("rose_oil_steeping", { at: "into a mild oil", hold: true }),
  ]},
  { key: "glove_name", phrase: "the rosemary glove", beats: [
    ak([{ word: "THE ROSEMARY GLOVE", sub: "rosemary oil wrapped over your hands, all night", tone: "teal", atPhrase: "wrap your hands in it" }], {}),
  ]},
  { key: "openloop", phrase: "nine out of ten people", beats: [
    es("!", "9 out of 10 get nothing from it", { tone: "warn", w: 3.2, eyebrow: "One mistake" }),
    r("rose_glove_hands_oil", { at: "one small silly mistake", hold: true }),
  ]},
  // ░░ PROMISE STACK — 3 RESULTADOS ░░
  { key: "results", phrase: "if you do this properly", beats: [
    c("talk", {}),
  ]},
  { key: "result1", phrase: "stop feeling like paper", beats: [
    es("01", "Hands stop feeling like paper", { tone: "teal", w: 3.0 }),
    r("rose_hands_morning_tight", { at: "first thing in the morning", hold: true }),
  ]},
  { key: "result2", phrase: "those brown spots begin", beats: [
    es("02", "Spots lift at the edges (4–8 weeks)", { tone: "teal", w: 3.0 }),
    mv("The spots vanish overnight", "They lighten gradually, over weeks — never overnight", { flipPhrase: "vanish overnight" }),
  ]},
  { key: "result3", phrase: "that lost bounce", beats: [
    es("03", "The bounce slowly comes back", { tone: "teal", w: 3.0 }),
    r("rose_hands_softer", { at: "the barrier heals underneath", hold: true }),
  ]},
  { key: "desc1", phrase: "in the description", beats: [
    ge("Exact amounts → in the description", ["How many drops", "How many nights", "The measurement card"], { at: "the exact amounts how many" }),
  ]},
  // ░░ PRESENTACIÓN (~min 4) + ANÉCDOTA ░░
  { key: "intro", phrase: "introduce myself properly", beats: [
    c("talk", {}),
    c("nametag", { name: "Dr. Federer", role: "General physician — natural chemistry for mature skin", image: "img/rose_federer_kitchen.png", at: "a general physician" }),
  ]},
  { key: "anecdote", phrase: "an older woman years ago", beats: [
    r("rose_nightstand_jar", { at: "a little jar of something", hold: true }),
    lt("“It's the rosemary, dear”", { kicker: "The hands that made me look", desc: "An older woman with the softest, evenest hands I'd ever seen. Her secret wasn't expensive — her mother did it, and her mother.", tone: "teal", at: "the softest evenest hands" }),
  ]},
  // ░░ MECANISMO — TYROSINASE ░░
  { key: "mechanism", phrase: "called melanin", beats: [
    c("talk", {}),
    r("rose_melanin_spot_macro", { at: "too much of a pigment", kicker: "A dark spot = too much melanin, in one cluster" }),
  ]},
  { key: "melanin_sunscreen", phrase: "melanin is actually the sunscreen", beats: [
    dg("dg_rose_melanin_factory", "Melanin is the skin's own sunscreen — but the factory gets stuck ON"),
  ]},
  { key: "tyrosinase", phrase: "name is tyrosinase", beats: [
    ak([{ word: "TYROSINASE", sub: "the one enzyme that runs the pigment factory — say it: tie-ROSS-in-ase", tone: "teal", atPhrase: "say it with me" }], {}),
  ]},
  { key: "rosmarinic", phrase: "called rosmarinic acid", beats: [
    dg("dg_rose_tyrosinase", "Rosmarinic acid puts the brakes on tyrosinase → the spot can fade"),
  ]},
  { key: "not_bleach", phrase: "not promising you a bleach", beats: [
    mv("Rosemary bleaches your spots away", "It slows the enzyme that makes pigment — a real, named mechanism", { flipPhrase: "a real named" }),
  ]},
  // ░░ 3 COMPUESTOS ░░
  { key: "compounds", phrase: "one member of the crew", beats: [
    c("talk", {}),
    dg("dg_rose_three_compounds", "Three compounds, three jobs: spots · wrinkles · dryness"),
  ]},
  { key: "carnosic", phrase: "called carnosic acid", beats: [
    es("02", "Carnosic acid — the antioxidant", { tone: "teal", w: 3.0 }),
    r("rose_sprig_macro", { at: "one of the strongest antioxidants", hold: true }),
  ]},
  { key: "free_radicals", phrase: "free radicals", beats: [
    ak([{ word: "FREE RADICALS CHEW YOUR SKIN", sub: "carnosic acid takes the hit so your skin doesn't", tone: "teal", atPhrase: "hold your skin firm" }], {}),
  ]},
  { key: "ursolic", phrase: "ursolic acid", beats: [
    es("03", "Ursolic acid — rebuilds the barrier", { tone: "teal", w: 3.0 }),
  ]},
  { key: "three_jobs", phrase: "three different jobs", beats: [
    c("chips", { bg: "image", image: "img/rose_sprig_fresh.png", imageDarken: 0.55, title: "One $2 herb, three jobs", chips: ["Spots (tyrosinase)", "Wrinkles (antioxidant)", "Dryness (barrier)"], at: "one 2 herb" }),
  ]},
  // ░░ WHY AT NIGHT — firma del canal ░░
  { key: "night", phrase: "why at night", beats: [
    c("talk", {}),
    fc([{ t: "Why" }, { t: "at" }, { t: "NIGHT?", hl: true }], { tone: "teal", at: "why at night" }),
  ]},
  { key: "clock", phrase: "runs on a clock", beats: [
    dg("dg_rose_skin_clock", "By day: defense. At night: repair — cell turnover climbs while you sleep"),
  ]},
  { key: "water_loss", phrase: "lose water faster overnight", beats: [
    dg("dg_rose_night_water_loss", "Hands lose water fastest at night — exactly when a sealed oil helps most"),
    r("rose_night_bedroom_hands", { at: "right against the skin", hold: true }),
  ]},
  { key: "night_shift", phrase: "the night shift", beats: [
    ak([{ word: "THE NIGHT SHIFT", sub: "7–8 hours, uninterrupted, no sun, no washing", tone: "teal", atPhrase: "7 8 hours straight" }], {}),
  ]},
  // ░░ VILLANO COMERCIAL ░░
  { key: "villain", phrase: "walking you in a circle", beats: [
    c("talk", {}),
    r("rose_four_cream_bottles", { at: "then a completely separate night", kicker: "Day cream. Night cream. Hand cream. Spot corrector." }),
  ]},
  { key: "four_bottles", phrase: "water then glycerin then fragrance", beats: [
    c("bars", { title: "First three ingredients of most creams", bars: [
      { label: "Water", value: 100, tone: "danger", note: "#1" },
      { label: "Glycerin", value: 62, tone: "danger" },
      { label: "Fragrance", value: 40, tone: "danger" } ], at: "beautifully scented water" }),
  ]},
  { key: "not_villain", phrase: "the person behind the counter", beats: [
    lt("The business needs the answer to feel complicated", { kicker: "It isn't", desc: "The person at the counter isn't a villain. But the whole thing only works if you keep believing the answer is expensive and comes from them. It doesn't.", tone: "warn", at: "has to be complicated" }),
  ]},
  // ░░ RUTINA 3 CAPAS ░░
  { key: "routine", phrase: "three thin layers", beats: [
    c("talk", {}),
    dg("dg_rose_glove_layers", "The Rosemary Glove: damp hands → oil → cotton glove (the seal)"),
  ]},
  { key: "layer1", phrase: "just slightly damp", beats: [
    es("01", "Damp — not soaking", { tone: "teal", w: 2.8 }),
    r("rose_splash_water_hands", { at: "a little splash of water", hold: true }),
  ]},
  { key: "layer2", phrase: "few drops of your rosemary oil", beats: [
    es("02", "A few drops — press, don't scrub", { tone: "teal", w: 2.8 }),
    r("rose_press_oil_hands", { at: "press don t scrub", hold: true }),
  ]},
  { key: "layer3", phrase: "thin cotton gloves", beats: [
    es("03", "Thin cotton gloves = the seal", { tone: "teal", w: 2.8 }),
    r("rose_cotton_gloves", { at: "that is the seal", hold: true }),
  ]},
  // ░░ ESCUDO DE HONESTIDAD ░░
  { key: "honesty", phrase: "what this simply cannot do", beats: [
    c("talk", {}),
    c("checklist", { title: "Be honest — what rosemary will NOT do", eyebrow: "The honest truth", tone: "warn", items: [
      { text: "Erase a deep wrinkle", state: "warn" },
      { text: "Lighten a spot in a day or a week", state: "warn" },
      { text: "Replace your sunscreen", state: "warn" } ], at: "will not erase a deep" }),
  ]},
  { key: "patch_test", phrase: "genuinely sensitive to rosemary", beats: [
    r("rose_patch_test_wrist", { at: "the soft inside of your wrist", hold: true }),
    ak([{ word: "PATCH TEST FIRST", sub: "never put undiluted essential oil on skin — always in a carrier oil", tone: "warn", atPhrase: "undiluted rosemary essential oil" }], {}),
  ]},
  { key: "see_doctor", phrase: "a spot on your hand is changing", beats: [
    lt("A spot that changes, grows, or bleeds → see a doctor", { kicker: "This one matters most", desc: "Growing, changing color, a strange or ragged border, or bleeding — that is not a job for rosemary or a screen. Go see a doctor in person.", tone: "warn", at: "a doctor you can sit" }),
  ]},
  // ░░ EL ERROR (pago del open loop) ░░
  { key: "error", phrase: "onto bone dry hands", beats: [
    c("talk", {}),
    es("!", "They put the oil on bone-dry hands", { tone: "warn", w: 3.2, eyebrow: "The mistake" }),
  ]},
  { key: "oil_traps", phrase: "oil traps it", beats: [
    dg("dg_rose_damp_first", "Oil doesn't add water — it traps it. No water underneath = an empty glove"),
  ]},
  { key: "fix", phrase: "then the oil", beats: [
    fc([{ t: "Damp" }, { t: "first." }, { t: "THEN" }, { t: "the" }, { t: "oil", hl: true }], { tone: "teal", at: "dump first" }),
  ]},
  // ░░ RECAP 5 PASOS ░░
  { key: "recap", phrase: "put the whole thing together", beats: [
    c("talk", {}),
    dg("dg_rose_recap", "The Rosemary Glove — five steps"),
  ]},
  { key: "recap_steps", phrase: "handful of dried rosemary", beats: [
    c("process", { title: "Five steps", eyebrow: "The whole routine", steps: [
      { title: "Steep", desc: "dried rosemary in a cup of almond/jojoba, warm & strain", image: "img/rose_recipe_ingredients.png" },
      { title: "Damp + press", desc: "damp hands, warm a few drops, press it in", image: "img/rose_press_oil_hands.png" },
      { title: "Seal + repeat", desc: "cotton gloves, 3–4 nights a week, patience", image: "img/rose_cotton_gloves.png" } ], at: "sweet almond or jojoba" }),
  ]},
  { key: "patience", phrase: "which is patience", beats: [
    ak([{ word: "THE HARDEST INGREDIENT: PATIENCE", sub: "give it the weeks it honestly asks for", tone: "teal", atPhrase: "the weeks it honestly" }], {}),
  ]},
  // ░░ CTA GUÍA + COMENTARIOS + TEASER + CIERRE ░░
  { key: "guide", phrase: "waiting for you in the description", beats: [
    fz("rose_recipe_book", { at: "wrote the whole thing out", kicker: "The full card · link in the description" }),
  ]},
  { key: "cta_coment", phrase: "down in the comments", beats: [
    lt("What do your hands do for you all day?", { kicker: "Tell me below", desc: "Garden hands? Piano hands? Did they raise a family, hold a lot of other hands? Tell me — I read every one.", tone: "teal", at: "what do your hands do" }),
  ]},
  { key: "teaser", phrase: "a video coming next", beats: [
    ak([{ word: "NEXT: 3 KITCHEN OILS FOR YOUR HANDS", sub: "and the one 'natural' oil that's secretly staining them darker", tone: "teal", atPhrase: "three ordinary kitchen oils" }], {}),
  ]},
  { key: "cierre", phrase: "a repair problem and now", beats: [
    c("nametag", { name: "Dr. Federer", role: "They were never a skin problem. Go be good to those hands.", image: "img/rose_federer_kitchen.png", at: "good be good to those" }),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_rosemaryglove.json", "utf8"));
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
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
    }
    beats.push(beat);
  });
}

// ── POST-PASS MILIMÉTRICO (avatarpizarra/keyword + mitoverdad) ───────
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
    beat.clip = `avatar_clips/rosemaryglove/${beat.id}.mp4`;
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) {
    const ms = findMs(beat.flipPhrase, beat.start - 1);
    const lastSafe = Math.round(beat.dur * 30) - 26;
    let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42);
    if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42);
    beat.flipAt = f; delete beat.flipPhrase;
  }
  if (beat.kind === "errorstinger" && !beat.eyebrow) {
    beat.eyebrow = "Step";
  }
  if (beat.at) delete beat.at;
}
fs.writeFileSync("public/avatar_clips_rosemaryglove.json", JSON.stringify(KIT_CLIPS, null, 1));

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
fs.writeFileSync("src/_fed6/VideoEdit/rosemaryglove_beats.ts",
  `// AUTO-GENERADO por gen_rosemaryglove.mjs — beats (imágenes rose_*.png / dg_rose_*.png).\n` +
  `export const ROSE_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/rosemaryglove_hooks.ts",
  `// AUTO-GENERADO por gen_rosemaryglove.mjs — rangos talk.\n` +
  `export const TALKSR: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/rosemaryglove.json", JSON.stringify({ video: "rosemaryglove", avatar: "rosemaryglove_opt.mp4", theme: "medico", beats }, null, 1));

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
console.log("MISS:", miss.join(" "));
