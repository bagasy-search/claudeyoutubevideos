// gen_vezegakr5r53.mjs — beatsheet del video EN "The Rosemary NIGHT Trick: Erases Dark Spots,
// Melasma and Wrinkles While You Sleep" (canal "Dr. Federer | Holistic Health"). Avatar
// vezegakr5r53_opt.mp4 (~19.4min). Anclaje por FRASE a captions_vezegakr5r53.json. Look CLÍNICO teal.
// Imágenes gpt-image-2: p_vezegakr5r53_*.png + dg_vezegakr5r53_*.png. Kit _fed6 COMPLETO.
// Estructura de 17 bloques (brief del creador): cold-open reframe → inventario sensorial → verdad
// oculta → reveal planta + loop del error → promise stack → intro Dr. Federer → payoff 3 resultados →
// mecanismo (tirosinasa) → 3 compuestos → POR QUÉ DE NOCHE → villano comercial → rutina 3 capas +
// rosemary glove → escudo honestidad → EL ERROR (pago del loop) → recap 5 pasos → CTAs → teaser → cierre.
import fs from "fs";
const SLUG = "vezegakr5r53";

const r  = (name, o = {}) => ({ t: "raw", name, ...o });
const c  = (kind, props = {}) => ({ t: kind, ...props });
const dg = (name, _eyebrow, o = {}) => ({ t: "diagram", slides: [{ image: `img/${name}.png` }], ...o });
const es = (number, title, o = {}) => ({ t: "errorstinger", number, title, tone: o.tone || "teal", ...o });
const mv = (myth, truth, o = {}) => ({ t: "mitoverdad", myth, truth, ...o });
const fc = (words, o = {}) => ({ t: "frasecinetica", words, tone: o.tone || "teal", perWord: o.perWord || 10, ...o });
const ak = (items, o = {}) => ({ t: "avatarkeyword", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const ap = (items, o = {}) => ({ t: "avatarpizarra", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const lt = (title, o = {}) => ({ t: "lowerthird", title, tone: o.tone || "teal", ...o });
const ge = (title, items, o = {}) => ({ t: "guardaesto", title, items, ...o });
const fz = (image, o = {}) => ({ t: "freezezoom", image: `img/${image}.png`, ...o });

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1, bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, annotated: 1.3, cross: 1.6, process: 2.6, talk: 1.0,
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.6 };

const P = (n) => `p_${SLUG}_${n}`;   // foto hero
const D = (n) => `dg_${SLUG}_${n}`;  // diagrama

const SECTIONS = [
  // ░░ BLOQUE 1 — COLD-OPEN REFRAME ░░
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),                                                   // avatar full 0-2.2 + scrim
    r(P("hands_phone_spots"), { at: "the back of the hand", kicker: "Look now — the hand holding your phone", hold: true }),
  ]},
  { key: "hook", phrase: "run a fingertip slowly", beats: [
    r(P("cheek_melasma"), { at: "along the side of your cheek", kicker: "The patch a shade darker" }),
    ak([{ word: "NOT A SKIN PROBLEM", sub: "it's a repair problem — fixed at one time of day", tone: "teal", atPhrase: "you know exactly where your spots" }], {}),
  ]},
  // ░░ BLOQUE 3 — LA VERDAD OCULTA ░░
  { key: "hook", phrase: "here is the truth", beats: [
    r(P("woman_bare_face_night"), { at: "here is the truth", kicker: "The truth almost nobody tells you" }),
  ]},
  { key: "hook", phrase: "your skin does almost none", beats: [
    mv("Your skin repairs itself during the day", "By day it only defends — the real repair happens at night", { flipPhrase: "the real rebuilding" }),
  ]},
  { key: "hook", phrase: "most women sleep straight through", beats: [
    r(P("woman_sleeping_peaceful"), { at: "most women sleep straight through", kicker: "Sleeping through the repair window" }),
  ]},
  // ░░ BLOQUE 4 — REVEAL PLANTA + $2 + LOOP DEL ERROR ░░
  { key: "hook", phrase: "there is a plant sitting", beats: [
    c("talk", {}),
    r(P("rosemary_sprig_kitchen"), { at: "there is a plant sitting", kicker: "In most kitchens right now" }),
  ]},
  { key: "hook", phrase: "it is rosemary", beats: [
    ak([{ word: "ROSEMARY · ABOUT $2", sub: "the most powerful spot-fading tool you own", tone: "teal", atPhrase: "it is rosemary" }], {}),
    r(P("essential_oil_bottle"), { at: "the concentrated essential oil", kicker: "NOT this little bottle" }),
  ]},
  { key: "hook", phrase: "the exact mistake that ruins", beats: [
    c("looplock", { title: "The mistake that ruins it for 9 of 10", sub: "used wrong, it makes your spots DARKER — I'll show you why at the end", at: "later in this video" }),
  ]},
  // ░░ BLOQUE 5 — PROMISE STACK + 1ª MENCIÓN DESCRIPCIÓN ░░
  { key: "hook", phrase: "here is what you are going", beats: [
    c("checklist", { title: "What you walk away with tonight", items: [
      { text: "Why your creams keep failing", state: "done" },
      { text: "The 3-layer night routine, with amounts", state: "done" },
      { text: "The rosemary glove for your hands", state: "done" },
      { text: "The real science — compounds named", state: "done" } ] }),
  ]},
  { key: "hook", phrase: "the full recipe card", beats: [
    lt("The exact measurements are in the description", { kicker: "So you never pause to scribble", desc: "The full recipe card — down to the spoon and the drop — is at the top of the description.", tone: "teal", at: "at the top of the description" }),
  ]},
  // ░░ BLOQUE 6 — INTRO DR. FEDERER (~min 4) ░░
  { key: "story", phrase: "my name is dr federer", beats: [
    c("talk", {}),
    c("nametag", { name: "Dr. Federer", role: "General doctor · Holistic Health", image: `img/${P("federer_kitchen")}.png`, at: "my name is dr federer" }),
  ]},
  { key: "story", phrase: "the rosemary water i am about", beats: [
    r(P("federer_kitchen"), { at: "recommended to patient after patient", kicker: "The chemistry, not the marketing" }),
  ]},
  // ░░ BLOQUE 7 — PAYOFF: 3 RESULTADOS ░░
  { key: "principio", phrase: "let me start with the payoff", beats: [
    c("talk", {}),
    es("01", "The dark spots soften", { w: 3.4 }),
    r(P("hands_spots_before"), { at: "the small dark spots", kicker: "3–4 weeks" }),
  ]},
  { key: "principio", phrase: "the hard border blurs", beats: [
    fc([{ t: "The" }, { t: "hard" }, { t: "border" }, { t: "blurs", hl: true }, { t: "first" }], { tone: "teal", at: "the hard border blurs" }),
  ]},
  { key: "principio", phrase: "the deep melasma", beats: [
    es("02", "The melasma calms down", { w: 3.4 }),
    r(P("cheek_melasma"), { at: "the deep melasma", kicker: "6–8 weeks" }),
  ]},
  { key: "principio", phrase: "the crepey skin around", beats: [
    es("03", "The skin feels tighter", { w: 3.4 }),
    r(P("eye_area_closeup"), { at: "the crepey skin around", kicker: "Less like tissue paper" }),
  ]},
  { key: "principio", phrase: "the green botox", beats: [
    ak([{ word: "THE GREEN BOTOX", sub: "the collagen effect — I'll name the exact compound", tone: "teal", atPhrase: "the green botox" }], {}),
  ]},
  // ░░ BLOQUE 8 — MECANISMO (tirosinasa) ░░
  { key: "principio", phrase: "why does a 2 herb", beats: [
    c("talk", {}),
    c("bars", { title: "What fades a spot", unit: "", items: [
      { label: "$2 rosemary (right way)", value: 100, winner: true },
      { label: "$50 day cream", value: 25 } ] }),
  ]},
  { key: "principio", phrase: "deep in your skin", beats: [
    dg(D("melanocyte"), "Melanocytes make the pigment"),
  ]},
  { key: "principio", phrase: "the enzyme is called tyrosinase", beats: [
    ak([{ word: "TYROSINASE", sub: "say it once — the factory switch for pigment", tone: "teal", atPhrase: "the enzyme is called tyrosinase" }], {}),
  ]},
  { key: "principio", phrase: "that enzyme is the factory switch", beats: [
    dg(D("pigment_switch"), "Switch too hot → a brown patch that stays"),
    ak([{ word: "TURN THE SWITCH DOWN", sub: "you don't bleach the skin — you calm the switch", tone: "teal", atPhrase: "turn the factory switch down" }], {}),
  ]},
  // ░░ BLOQUE 9 — LOS 3 COMPUESTOS ░░
  { key: "principio", phrase: "three compounds inside that little sprig", beats: [
    dg(D("three_compounds"), "3 compounds · one job each"),
  ]},
  { key: "principio", phrase: "the first is rosmarinic acid", beats: [
    c("splitlist", { title: "Rosmarinic acid — quiets the switch", items: ["Interferes with tyrosinase", "Mops up the free radicals", "Works both ends at once"], palette: "T" }),
  ]},
  { key: "principio", phrase: "the second is carnosic acid", beats: [
    r(P("rosemary_extract_food"), { at: "stop fats and oils from going", kicker: "So strong food factories use it" }),
    ak([{ word: "CARNOSIC ACID", sub: "the antioxidant bodyguard, all night", tone: "teal", atPhrase: "the second is carnosic acid" }], {}),
  ]},
  { key: "principio", phrase: "the third is ursolic acid", beats: [
    dg(D("collagen_scaffold"), "Ursolic acid feeds the collagen scaffold"),
    fc([{ t: "It" }, { t: "feeds" }, { t: "the" }, { t: "structure", hl: true }], { tone: "teal", at: "it simply feeds the structure" }),
  ]},
  // ░░ BLOQUE 10 — POR QUÉ DE NOCHE (firma) ░░
  { key: "causa1", phrase: "that word night is the whole", beats: [
    c("talk", {}),
    ak([{ word: "WHY AT NIGHT", sub: "this is where most skincare quietly falls apart", tone: "teal", atPhrase: "that word night is the whole" }], {}),
  ]},
  { key: "causa1", phrase: "cell turnover speeds up", beats: [
    dg(D("night_repair_clock"), "At night: turnover nearly doubles"),
    c("stat", { big: "2×", unit: "cell turnover", label: "your skin literally replaces itself faster while you sleep.", tone: "teal" }),
  ]},
  { key: "causa1", phrase: "your body releases growth hormone", beats: [
    c("splitlist", { title: "Every force is on your side at night", items: ["Growth hormone — a repair signal", "Cortisol at its lowest", "The barrier lets things sink deeper"], palette: "T" }),
  ]},
  { key: "causa1", phrase: "now put the enemy back", beats: [
    dg(D("day_vs_night"), "By day, UV flips the factory back on"),
  ]},
  { key: "causa1", phrase: "like bailing water out", beats: [
    fz(P("boat_bailing"), { x: 0.5, y: 0.5, label: "Applying by day = bailing a boat with the hole open", zoom: 1.4, tone: "warn", at: "the hole still wide open" }),
  ]},
  { key: "causa1", phrase: "you lay the rosemary down", beats: [
    ak([{ word: "RIGHT INGREDIENT, RIGHT HOUR", sub: "either one alone is only half the job", tone: "teal", atPhrase: "right ingredient right hour" }], {}),
  ]},
  // ░░ BLOQUE 11 — VILLANO COMERCIAL ░░
  { key: "enemigo", phrase: "here is the part that quietly", beats: [
    c("talk", {}),
    lt("The villain is not a person. It's a business model", { kicker: "Let me be careful here", desc: "Not a doctor. A model built to sell you the same face twice.", tone: "warn", at: "it is a business model" }),
  ]},
  { key: "enemigo", phrase: "they sell you a day cream", beats: [
    r(P("day_cream_jars"), { at: "a day cream", kicker: "Charged twice for the same face" }),
    mv("A new jar every six weeks is normal", "The jar is designed to run empty on schedule — that's the business", { flipPhrase: "run empty in six weeks" }),
  ]},
  { key: "enemigo", phrase: "no company on earth", beats: [
    fc([{ t: "No" }, { t: "billboard" }, { t: "for" }, { t: "rosemary", hl: true }], { tone: "warn", at: "there is no billboard for rosemary" }),
  ]},
  // ░░ BLOQUE 12 — LA RUTINA (3 capas) ░░
  { key: "causa2", phrase: "all right the routine", beats: [
    c("talk", {}),
    dg(D("three_layers"), "3 layers · all at night"),
  ]},
  { key: "causa2", phrase: "layer one is rosemary water", beats: [
    es("L1", "Rosemary water — the calming base", { w: 3.6 }),
    r(P("rosemary_water_cup"), { at: "layer one is rosemary water", kicker: "A handful per cup" }),
  ]},
  { key: "causa2", phrase: "do not boil it hard", beats: [
    c("checklist", { title: "Rosemary water — the do-nots", items: [
      { text: "A handful fresh / a teaspoon dried per cup", state: "done" },
      { text: "Pour hot water over it — do NOT boil hard", state: "warn" },
      { text: "Steep till cool, keep 5 days in the fridge", state: "done" } ] }),
  ]},
  { key: "causa2", phrase: "after you wash your face", beats: [
    r(P("cotton_pad_toner"), { at: "sweep it over your skin", kicker: "Your night toner" }),
    ak([{ word: "DON'T MAKE IT STING", sub: "stronger is not better here", tone: "warn", atPhrase: "stronger is not better" }], {}),
  ]},
  // ── LAYER 2 ──
  { key: "causa3", phrase: "layer two is where the real", beats: [
    c("talk", {}),
    es("L2", "Rosemary-infused oil — the power", { w: 3.6 }),
    r(P("infused_oil_jar"), { at: "rosemary infused oil", kicker: "NOT the essential oil" }),
  ]},
  { key: "causa3", phrase: "roughly one tablespoon of dried", beats: [
    c("stat", { big: "1 tbsp", unit: "dried per 100 ml oil", label: "dried rosemary only — fresh will turn the whole batch rancid.", tone: "teal" }),
  ]},
  { key: "causa3", phrase: "jojoba oil is my favorite", beats: [
    c("bars", { title: "Which carrier oil", unit: "", items: [
      { label: "Jojoba — closest to skin's own oil", value: 100, winner: true },
      { label: "Rosehip — brings vitamin A", value: 90 } ] }),
    r(P("jojoba_rosehip_bottles"), { at: "rosehip oil is a beautiful", kicker: "Two treatments in one bottle" }),
  ]},
  { key: "causa3", phrase: "warm two or three drops", beats: [
    r(P("oil_drops_fingertips"), { at: "warm two or three drops", kicker: "2–3 drops is the whole dose" }),
    ak([{ word: "DON'T DROWN YOUR FACE", sub: "more will only clog you", tone: "warn", atPhrase: "do not drown your face" }], {}),
  ]},
  { key: "causa3", phrase: "massage in slow circles", beats: [
    r(P("massage_face_night"), { at: "massage in slow circles", kicker: "30 seconds carries it deeper" }),
  ]},
  // ── EL ROSEMARY GLOVE ──
  { key: "causa4", phrase: "here is that little trick", beats: [
    c("talk", {}),
    r(P("hands_aged_spots"), { at: "the backs of your hands take", kicker: "The hands age first, ignored most" }),
  ]},
  { key: "causa4", phrase: "the fix the rosemary glove", beats: [
    ak([{ word: "THE ROSEMARY GLOVE", sub: "heavier oil on the hands, cotton gloves, sleep in them", tone: "teal", atPhrase: "the fix the rosemary glove" }], {}),
  ]},
  { key: "causa4", phrase: "a pair of thin cotton gloves", beats: [
    r(P("cotton_gloves_bed"), { at: "thin cotton gloves", kicker: "8 hours of sealed contact" }),
    r(P("hands_younger_after"), { at: "stopped announcing your age", kicker: "One month later" }),
  ]},
  // ── LAYER 3 ──
  { key: "causa5", phrase: "layer three is optional", beats: [
    c("talk", {}),
    es("L3", "Gentle weekly buff (optional)", { w: 3.6 }),
    r(P("washcloth_exfoliate"), { at: "a soft washcloth", kicker: "Only for stubborn old spots" }),
  ]},
  { key: "causa5", phrase: "do not scrub", beats: [
    ak([{ word: "DO NOT SCRUB", sub: "scrubbing is inflammation — it flips the switch back on", tone: "warn", atPhrase: "do not scrub" }], {}),
  ]},
  { key: "causa5", phrase: "the exact card every ratio", beats: [
    lt("Every ratio & the 21-day plan — in the description", { kicker: "Read it before you start", desc: "With a natural remedy the dose is the difference between it working and doing nothing.", tone: "teal", at: "the exact card every ratio" }),
  ]},
  // ░░ BLOQUE 13 — ESCUDO DE HONESTIDAD ░░
  { key: "honesto", phrase: "now the honest part", beats: [
    c("talk", {}),
    ak([{ word: "WHAT ROSEMARY WILL NOT DO", sub: "if I only tell you the good, I'm no better than the ads", tone: "warn", atPhrase: "here is what rosemary will not" }], {}),
  ]},
  { key: "honesto", phrase: "give it six to eight weeks", beats: [
    c("checklist", { title: "The honest limits", items: [
      { text: "Not overnight — it's the work of many nights", state: "warn" },
      { text: "Not a cure. I'll never use that word", state: "warn" },
      { text: "Not a replacement for sun protection", state: "warn" } ] }),
  ]},
  { key: "honesto", phrase: "it is not a replacement", beats: [
    r(P("sunscreen_hat_shade"), { at: "a gentle mineral sunscreen", kicker: "The other half of this" }),
  ]},
  { key: "honesto", phrase: "you must patch test first", beats: [
    r(P("patch_test_arm"), { at: "the inside of your arm", kicker: "Patch test · wait 24 hours" }),
    lt("Patch test on your arm — wait a full 24 hours", { kicker: "Before your face", desc: "If it reddens or itches, this is simply not for your skin, and that's okay.", tone: "warn", at: "wait a full 24 hours" }),
  ]},
  { key: "honesto", phrase: "consistency beats intensity", beats: [
    fc([{ t: "Consistency" }, { t: "beats" }, { t: "intensity", hl: true }], { tone: "teal", at: "consistency beats intensity" }),
  ]},
  // ░░ BLOQUE 14 — EL ERROR (pago del loop) ░░
  { key: "error", phrase: "now the mistake the one", beats: [
    c("talk", {}),
    es("!", "The mistake that makes it worse", { tone: "warn", w: 3.6 }),
  ]},
  { key: "error", phrase: "they reach for the essential oil", beats: [
    r(P("essential_oil_bottle"), { at: "they reach for the essential oil", kicker: "Concentrated hundreds of times" }),
    ak([{ word: "NEVER THE NEAT BOTTLE", sub: "essential oil undiluted = a different, aggressive thing", tone: "warn", atPhrase: "not a stronger remedy" }], {}),
  ]},
  { key: "error", phrase: "put it on your face undiluted", beats: [
    c("checklist", { title: "Undiluted, it does two kinds of damage", items: [
      { text: "Burns & inflames → flips the switch ON", state: "warn" },
      { text: "Leaves skin reactive to sunlight", state: "warn" },
      { text: "Next morning the spot goes DARKER", state: "warn" } ] }),
  ]},
  { key: "error", phrase: "that concentrated oil can leave", beats: [
    r(P("sun_on_skin"), { at: "the sun hits skin", kicker: "Primed to overproduce pigment" }),
  ]},
  { key: "error", phrase: "same plant opposite outcome", beats: [
    mv("Stronger rosemary must work faster", "The infused oil fades spots — the neat essential oil can set them on fire", { flipPhrase: "the version that can set them" }),
  ]},
  // ░░ BLOQUE 15 — RECAP 5 PASOS ░░
  { key: "recap", phrase: "let me pull it all together", beats: [
    c("talk", {}),
    c("process", { title: "Start tonight — 5 steps", eyebrow: "Calmly and correctly", steps: [
      { title: "Rosemary water", desc: "handful per cup, your toner", image: `img/${P("rosemary_water_cup")}.png` },
      { title: "Infused oil", desc: "spoon per 100 ml, ready in 2 weeks", image: `img/${P("infused_oil_jar")}.png` },
      { title: "Every night", desc: "water, then 2–3 drops, 30s", image: `img/${P("massage_face_night")}.png` } ] }),
  ]},
  { key: "recap", phrase: "for the hands the rosemary glove", beats: [
    c("focuscards", { title: "The 5-step night ritual", items: [
      { image: `img/${P("rosemary_water_cup")}.png`, label: "1 · Rosemary water", atPhrase: "make your rosemary water" },
      { image: `img/${P("infused_oil_jar")}.png`, label: "2 · Infused oil", atPhrase: "start an infused oil" },
      { image: `img/${P("massage_face_night")}.png`, label: "3 · Every night", atPhrase: "every night rosemary water first" },
      { image: `img/${P("cotton_gloves_bed")}.png`, label: "4 · Rosemary glove", atPhrase: "for the hands the rosemary glove" },
      { image: `img/${P("sunscreen_hat_shade")}.png`, label: "5 · Sun by day", atPhrase: "protect that skin from the sun" },
    ], at: "for the hands the rosemary glove" }),
  ]},
  // ░░ BLOQUE 16 — CTAs (descripción → comentario → teaser → suscripción) ░░
  { key: "recap", phrase: "everything you need is waiting", beats: [
    r(P("guide_phone"), { at: "at the top of the description", hold: true }),
    c("chips", { bg: "image", image: `img/${P("guide_phone")}.png`, imageDarken: 0.62, title: "The full recipe card", chips: ["Every exact measurement · both oils", "The full night routine + 21-day plan", "At the top of the description"] }),
  ]},
  { key: "recap", phrase: "in the comments tell me", beats: [
    lt("Where are your spots — and how many years?", { kicker: "Tell me in the comments", desc: "Hands? Cheeks? Melasma from a pregnancy? The questions you ask decide what I teach next.", tone: "teal", at: "where are your spots" }),
  ]},
  // ░░ TEASER + SUSCRIPCIÓN ░░
  { key: "teaser", phrase: "speaking of next in the coming", beats: [
    c("talk", {}),
    r(P("kitchen_ingredient_teaser"), { at: "a single humble kitchen ingredient", kicker: "Next: one thing you drink" }),
    lt("Next: the kitchen thing most people throw away", { kicker: "Don't miss it", desc: "Drink it, and it changes what your skin can repair overnight. Not water. Not lemon.", tone: "teal", at: "it is not water" }),
  ]},
  { key: "teaser", phrase: "if you want to be there", beats: [
    ak([{ word: "SUBSCRIBE NOW", sub: "so the other half of the story lands in front of you", tone: "teal", atPhrase: "subscribe now so it lands" }], {}),
  ]},
  // ░░ BLOQUE 17 — CIERRE (callback al cold-open) ░░
  { key: "close", phrase: "so remember this", beats: [
    c("talk", {}),
    fc([{ t: "A" }, { t: "repair" }, { t: "problem", hl: true }, { t: "fixed" }, { t: "at" }, { t: "night", hl: true }], { tone: "teal", at: "at one time of day" }),
  ]},
  { key: "close", phrase: "your skin was designed to heal", beats: [
    r(P("woman_sleeping_peaceful"), { at: "heal itself in the dark", kicker: "Designed to heal in the dark" }),
    c("nametag", { name: "Dr. Federer", role: "Holistic Health — repair while you sleep", image: `img/${P("federer_signoff")}.png` }),
  ]},
];

// ── ANCLAJE POR FRASE ─────────────────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1164) + 2;

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
beats.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); if (Array.isArray(b.slides)) b.slides.forEach((s) => s.image && need.add(s.image)); if (Array.isArray(b.items)) b.items.forEach((it) => it && it.image && need.add(it.image)); if (Array.isArray(b.steps)) b.steps.forEach((s) => s && s.image && need.add(s.image)); });
const miss = [...need].filter((p) => !fs.existsSync("public/" + p));
if (missing.length) console.log(`⚠ frases no ancladas (${missing.length}):`, missing);
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100*raw/beats.length).toFixed(0)}%) · diagramas: ${kinds.diagram||0} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min)`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`assets referenciados: ${need.size} · faltantes: ${miss.length}`);
console.log("IMG_NEEDED:" + [...need].join(","));
