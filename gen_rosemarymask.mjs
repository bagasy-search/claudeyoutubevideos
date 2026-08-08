// gen_rosemarymask.mjs — beatsheet/rosemarymask.json (Canal "Dr. Federer | Holistic Health" · EN · THE ROSEMARY NIGHT MASK / manchas de la CARA, máscara nocturna).
// Avatar rosemarymask_opt.mp4 (~18.5min, EN "you"). Anclaje por FRASE a captions_rosemarymask.json.
// MATERIAL: b-roll = SOLO stock Pexels (cama MASK_BROLL). IA = SOLO el presentador (rm_federer_*.png, gpt-image-2 con ref).
// Diagramas = componentes REALES data-driven (reprintscan/hourdial/pricewar/errorstinger/avatarkeyword/frasecinetica/mitoverdad/checklist/bars/stat/guardaesto/lowerthird), NUNCA imagen IA.
// HOOK v3 (2 componentes NUEVOS): freezezoom macro de la mancha → REPRINTSCAN (la piel "re-imprime" la mancha) → HOURDIAL (se enciende 1 hora nocturna) → PRICEWAR ($2 vs $90) → avatar full.
// Reframe del video: "no es una mancha, es una FOTO que tu piel RE-IMPRIME; solo deja de imprimirla a una hora." Error 9/10 = la ENJUAGAN a los 15 min (se la sacan antes de la ventana de reparación nocturna).
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
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.9, pricewar: 2.6, reprintscan: 2.6, hourdial: 2.4 };

const SECTIONS = [
  // ░░ HOOK v3 — 4 golpes de componente antes de que aparezca la cara ░░
  { key: "hook", phrase: null, start: 0.3, beats: [
    // 0:00 — macro brutal de la mancha (NO la cara), push lento
    c("freezezoom", { image: "img/hook_spot_macro.jpg", x: 0.5, y: 0.5, zoom: 1.7, label: "This isn't a stain.", tone: "teal" }),
  ]},
  // 0:05 — GUERRA DE PRECIOS ($2 romero vs $90 crema) mientras el avatar dice los dos números
  { key: "pricewar", phrase: "2 herb from your", beats: [
    c("pricewar", { leftImage: "img/hook_jar.jpg", rightImage: "img/hook_cream.jpg", leftPrice: "$2", rightPrice: "$90", strike: "/ jar", leftLabel: "Rosemary, spread thin overnight", rightLabel: "“Brightening” night cream", subtitle: "Fades the spots faster than the $90 jar on your shelf ever did." }),
  ]},
  // 0:20 — REPRINTSCAN: la piel RE-IMPRIME la mancha (el wow del canal)
  { key: "reprint", phrase: "picture your skin keeps", beats: [
    c("reprintscan", { image: "img/hook_spot_macro.jpg", spot: { x: 0.5, y: 0.48, r: 0.16 }, passes: 3, label: "Your skin keeps RE-PRINTING it — every day.", tone: "teal" }),
  ]},
  // 0:26 — HOURDIAL: solo deja de imprimir a UNA hora (firma nocturna, visual)
  { key: "onehour", phrase: "one single hour of", beats: [
    c("hourdial", { hour: 2, big: "1", unit: "hour", label: "It only stops at ONE hour of the day.", tone: "gold" }),
  ]},
  // 0:30 — recién ACÁ el doctor, full, cercano
  { key: "dontgetup", phrase: "look down at the back", beats: [
    c("talk", {}),
  ]},
  // ░░ INVENTARIO SENSORIAL — participación física (sin espejo) ░░
  { key: "twospots", phrase: "picture the two spots", beats: [
    c("freezezoom", { image: "img/hook_hand.jpg", x: 0.6, y: 0.42, zoom: 2.0, label: "The two you already know by shape.", tone: "teal" }),
  ]},
  { key: "presstest", phrase: "press gently right on", beats: [
    ak([{ word: "THE PRESS TEST", sub: "press the skin between your knuckles, let go — slow to fill back in? that is the same story as the spot", tone: "teal", atPhrase: "press gently right on" }], {}),
  ]},
  { key: "samestory", phrase: "same story same underneath", beats: [
    fc([{ t: "Slow" }, { t: "snap-back." }, { t: "Brown" }, { t: "spots." }, { t: "SAME", hl: true }, { t: "STORY.", hl: true }], { tone: "teal", at: "same story same underneath" }),
  ]},
  { key: "readout", phrase: "your skin telling you", beats: [
    lt("A spot is a READOUT — not a flaw", { kicker: "One layer down", desc: "Most people treat the spot as a cosmetic thing to hide. It is actually your skin reporting what is happening one layer down — treat that, and the spot is one of the first things to move.", tone: "teal", at: "your skin telling you" }),
  ]},
  // ░░ POR QUÉ SE FORMAN — arithmetic / ledger ░░
  { key: "whyform", phrase: "why do these even", beats: [
    c("talk", {}),
  ]},
  { key: "ledger", phrase: "your skin kept a ledger", beats: [
    ak([{ word: "YOUR SKIN KEPT A LEDGER", sub: "every hour of sun you ever caught got tallied — and cashed in during your 50s and 60s", tone: "teal", atPhrase: "your skin kept a ledger" }], {}),
  ]},
  { key: "twohalves", phrase: "overproduction plus under cleanup", beats: [
    fc([{ t: "Too" }, { t: "much" }, { t: "pigment." }, { t: "Too" }, { t: "little" }, { t: "CLEANUP.", hl: true }], { tone: "teal", at: "overproduction plus under cleanup" }),
  ]},
  // ░░ EL REFRAME DE LA IMPRESORA (nobody tells you) ░░
  { key: "nobody", phrase: "part nobody tells you and", beats: [
    c("talk", {}),
  ]},
  { key: "notdirt", phrase: "not damage you scrub away", beats: [
    mv("A dark spot is dirt — or damage you scrub off", "It is pigment — melanin a cell factory keeps printing on a schedule", { flipPhrase: "it is pigment melanin" }),
  ]},
  { key: "printer", phrase: "nobody showed you the printer", beats: [
    fc([{ t: "You" }, { t: "treated" }, { t: "the" }, { t: "print." }, { t: "Nobody" }, { t: "showed" }, { t: "you" }, { t: "the" }, { t: "PRINTER.", hl: true }], { tone: "teal", at: "nobody showed you the printer" }),
  ]},
  // ░░ REVEAL ROMERO + PRECIO + OPEN LOOP ░░
  { key: "reveal", phrase: "grows in a pot on", beats: [
    c("talk", {}),
    r("rm_federer_rosemary", { at: "rosemary yeah rosemary two", kicker: "Two dollars a bunch — or free from the windowsill" }),
  ]},
  { key: "rosemary", phrase: "rosemary yeah rosemary two", beats: [
    ak([{ word: "ROSEMARY", sub: "the herb that talks to the printer — $2 a bunch, common, in every store", tone: "teal", atPhrase: "rosemary yeah rosemary two" }], {}),
  ]},
  { key: "openloop", phrase: "nine out of ten people", beats: [
    es("!", "9 out of 10 ruin it — one move cancels the whole thing", { tone: "warn", w: 3.2, eyebrow: "Revealed at the end" }),
  ]},
  { key: "desc1", phrase: "into a simple guide and", beats: [
    ge("Exact recipe → in the description", ["How much rosemary", "What to infuse it into", "How thin, how many nights"], { at: "into a simple guide and" }),
  ]},
  // ░░ PRESENTACIÓN (~min 4) ░░
  { key: "intro", phrase: "a physician and for a", beats: [
    c("talk", {}),
    c("nametag", { name: "Dr. Federer", role: "Physician — the plain chemistry of aging skin", image: "img/rm_federer_nametag.png", at: "a physician and for a" }),
  ]},
  // ░░ EXPECTATIVAS — 3 RESULTADOS con timelines reales ░░
  { key: "expect", phrase: "what can you actually expect", beats: [
    c("talk", {}),
  ]},
  { key: "result1", phrase: "within about the first week", beats: [
    es("01", "~Day 7: calmer, brighter, less angry — the printer slowing", { tone: "teal", w: 3.0, eyebrow: "Result" }),
  ]},
  { key: "result2", phrase: "give it around four to", beats: [
    es("02", "Weeks 4–6: spots lift at the edges, blur outward", { tone: "teal", w: 3.0, eyebrow: "Result" }),
  ]},
  { key: "result3", phrase: "the deep old ones the", beats: [
    es("03", "Old spots: months — fading & softening, never deleting", { tone: "teal", w: 3.0, eyebrow: "Result" }),
  ]},
  { key: "nolie", phrase: "anyone who tells you a", beats: [
    mv("A 10-year-old spot vanishes in a week", "Months to truly fade — I would rather lose you now than lie to you", { flipPhrase: "rather lose you now" }),
  ]},
  // ░░ MECANISMO — TIROSINASA ░░
  { key: "science", phrase: "now the science and stay", beats: [
    c("talk", {}),
  ]},
  { key: "tyros", phrase: "say it once out loud", beats: [
    ak([{ word: "TYROSINASE", sub: "the enzyme foreman — the switch that turns a building block into melanin. say it with me", tone: "teal", atPhrase: "say it once out loud" }], {}),
  ]},
  { key: "secret90", phrase: "the secret they charge 90", beats: [
    fc([{ t: "Every" }, { t: "brightener" }, { t: "just" }, { t: "slows" }, { t: "ONE", hl: true }, { t: "enzyme." }, { t: "$90", hl: true }, { t: "for" }, { t: "that." }], { tone: "teal", at: "the secret they charge 90" }),
  ]},
  // ░░ 3 COMPUESTOS ░░
  { key: "compounds", phrase: "three of them and they", beats: [
    c("talk", {}),
  ]},
  { key: "carnosic", phrase: "the first is carnosic acid", beats: [
    ak([{ word: "CARNOSIC ACID", sub: "the bodyguard — soaks up the oxidation sparks that scream 'make more pigment'", tone: "teal", atPhrase: "the first is carnosic acid" }], {}),
  ]},
  { key: "apple", phrase: "carnosic acid is the lemon", beats: [
    fc([{ t: "Carnosic" }, { t: "is" }, { t: "the" }, { t: "LEMON", hl: true }, { t: "on" }, { t: "the" }, { t: "apple." }], { tone: "teal", at: "carnosic acid is the lemon" }),
  ]},
  { key: "rosmarinic", phrase: "second rosemarinic acid this", beats: [
    es("02", "Rosmarinic acid — the peacemaker: calms the quiet inflammation", { tone: "teal", w: 3.0, eyebrow: "Compound" }),
  ]},
  { key: "ursolic", phrase: "third the one people never", beats: [
    es("03", "Ursolic acid — the glue: holds the barrier & water in", { tone: "teal", w: 3.0, eyebrow: "Compound" }),
  ]},
  { key: "threejobs", phrase: "it makes the skin itself", beats: [
    ge("One $2 herb — three jobs", ["Carnosic → guards, mops up sparks", "Rosmarinic → calms inflammation", "Ursolic → seals the barrier"], { at: "it makes the skin itself" }),
  ]},
  // ░░ POR QUÉ DE NOCHE — firma del canal ░░
  { key: "whynight", phrase: "do it at the wrong", beats: [
    c("talk", {}),
    fc([{ t: "Why" }, { t: "at" }, { t: "NIGHT?", hl: true }], { tone: "teal", at: "do it at the wrong" }),
  ]},
  { key: "daydefense", phrase: "during daylight your skin is", beats: [
    mv("Any hour works — rub it on in the morning", "By DAY the sun floors tyrosinase — you fight a losing battle", { flipPhrase: "flooring the gas pedal" }),
  ]},
  { key: "nightrepair", phrase: "your skin flips from defense", beats: [
    ak([{ word: "NIGHT = REPAIR MODE", sub: "sun's switch off, skin clears old pigment cells — the herb finally gets a clean shot", tone: "teal", atPhrase: "your skin flips from defense" }], {}),
  ]},
  { key: "circadian", phrase: "first few hours of real", beats: [
    ak([{ word: "THE FIRST HOURS OF SLEEP", sub: "turnover speeds up, the cleanup crews clock in — you hand them the tool", tone: "teal", atPhrase: "first few hours of real" }], {}),
  ]},
  { key: "bothhalves", phrase: "both halves one hour", beats: [
    c("hourdial", { hour: 2, big: "1", unit: "hour", label: "Both halves — in one hour of the night.", tone: "gold" }),
  ]},
  // ░░ PATRÓN DE PACIENTES ░░
  { key: "patients", phrase: "hundreds of dollars on serums", beats: [
    c("talk", {}),
    lt("Hundreds spent — spots unmoved. Always the timing.", { kicker: "Patient after patient", desc: "The correction step was always at the wrong hour, washed off too soon, or buried under other product. Fix the timing and the same face that 'tried everything' starts moving in a month.", tone: "teal", at: "hundreds of dollars on serums" }),
  ]},
  // ░░ VILLANO COMERCIAL ░░
  { key: "villain", phrase: "walk into any store and", beats: [
    c("talk", {}),
    c("bars", { title: "Two bottles, two prices — one job (night)", bars: [
      { label: "Day 'brightener'", value: 50, tone: "danger", note: "sold to you" },
      { label: "Night 'brightener'", value: 50, tone: "danger", note: "also sold to you" } ], at: "there s a day brightener" }),
  ]},
  { key: "onejob", phrase: "one job one time of", beats: [
    fc([{ t: "One" }, { t: "job." }, { t: "One" }, { t: "HOUR.", hl: true }, { t: "Two" }, { t: "DOLLARS.", hl: true }], { tone: "teal", at: "one job one time of" }),
  ]},
  // ░░ CÓMO HACERLO — 3 CAPAS ░░
  { key: "howto", phrase: "alright the how three", beats: [
    c("talk", {}),
    r("rm_federer_mix", { at: "each one has a reason", kicker: "Three layers — each one for a reason" }),
  ]},
  { key: "layer1", phrase: "layer one bare clean skin", beats: [
    ak([{ word: "LAYER 1 · BARE, CLEAN SKIN", sub: "no sunscreen, no makeup, no serum first — any of that is a wall the herb sits on and dries out", tone: "warn", atPhrase: "layer one bare clean skin" }], {}),
  ]},
  { key: "layer2", phrase: "layer two the rosemary", beats: [
    r("rm_federer_apply", { at: "spreading a thin layer", kicker: "A thin film — thin enough to see your skin through it" }),
    ak([{ word: "LAYER 2 · A THIN FILM", sub: "rosemary infused into a light carrier — spread thin over the spots, not a thick clay mask", tone: "teal", atPhrase: "layer two the rosemary" }], {}),
  ]},
  { key: "film", phrase: "not a thick clay mask", beats: [
    fc([{ t: "Not" }, { t: "a" }, { t: "clay" }, { t: "mask." }, { t: "A" }, { t: "FILM.", hl: true }], { tone: "teal", at: "not a thick clay mask" }),
  ]},
  { key: "layer3", phrase: "layer three a light seal", beats: [
    ak([{ word: "LAYER 3 · A LIGHT SEAL", sub: "a touch of plain oil or moisturizer on top — keeps it in contact all night. the layer everybody skips", tone: "teal", atPhrase: "layer three a light seal" }], {}),
  ]},
  { key: "donots", phrase: "rosemary is potent your", beats: [
    c("checklist", { title: "Go gentle — two more do-nots", eyebrow: "Do not", tone: "warn", items: [
      { text: "Not every single night at first — a few nights a week", state: "warn" },
      { text: "Not thicker — more is not faster, it is irritation", state: "warn" },
      { text: "Not with retinol/acid the same night — alternate", state: "warn" } ], at: "rosemary is potent your" }),
  ]},
  // ░░ EL ERROR — pago del open loop ░░
  { key: "mistake", phrase: "and now the mistake the", beats: [
    c("talk", {}),
    es("!", "They RINSE it off at 15 minutes", { tone: "warn", w: 3.2, eyebrow: "The mistake" }),
  ]},
  { key: "notmask", phrase: "this is not a 15", beats: [
    mv("A mask — rinse after 10–15 minutes", "The repair window opens hours later — rinsing it off early throws the medicine away", { flipPhrase: "not a 15 minute mask" }),
  ]},
  { key: "leaveiton", phrase: "one instruction leave it on", beats: [
    fc([{ t: "Leave." }, { t: "It." }, { t: "ON.", hl: true }], { tone: "teal", at: "one instruction leave it on" }),
  ]},
  // ░░ ESCUDO DE HONESTIDAD ░░
  { key: "honesty", phrase: "straight with you about the", beats: [
    c("talk", {}),
    c("checklist", { title: "Be honest — what this will NOT do", eyebrow: "The honest truth", tone: "warn", items: [
      { text: "Bleach your skin — it evens, gently, over weeks", state: "warn" },
      { text: "Blank your face in 7 days (calmer & brighter, yes)", state: "warn" },
      { text: "'Detox' you — there are no toxins to pull out", state: "warn" },
      { text: "Replace sun protection by day", state: "warn" } ], at: "straight with you about the" }),
  ]},
  { key: "patchtest", phrase: "small test on the inside", beats: [
    ak([{ word: "TEST ON YOUR ARM FIRST", sub: "inside of the arm, wait a day — red or itchy? this one is not for you, and that is fine", tone: "warn", atPhrase: "small test on the inside" }], {}),
  ]},
  { key: "meds", phrase: "run it past your own", beats: [
    ak([{ word: "PREGNANT OR ON MEDS? ASK FIRST", sub: "a concentrated infusion is stronger than a sprig on the potatoes — check with your own doctor", tone: "warn", atPhrase: "run it past your own" }], {}),
  ]},
  { key: "redflag", phrase: "changing shape growing has ragged", beats: [
    ak([{ word: "A SPOT THAT CHANGES → SEE A DOCTOR", sub: "growing, ragged edges, or ever bleeds — that is a job for a doctor in person, soon", tone: "warn", atPhrase: "changing shape growing has ragged" }], {}),
  ]},
  // ░░ RECAP 5 PASOS ░░
  { key: "recap", phrase: "put the whole thing back", beats: [
    c("talk", {}),
    ge("The Rosemary Night Mask — 5 steps", ["1 · Slow the factory, not scrub the paper", "2 · Rosemary hits tyrosinase — 3 compounds", "3 · Night only — the repair window", "4 · Bare skin → thin film → light seal", "5 · Leave it on all night; rinse at dawn"], { at: "put the whole thing back" }),
  ]},
  // ░░ CTA GUÍA + COMENTARIO + TEASER + CIERRE ░░
  { key: "guide", phrase: "first thing linked in the", beats: [
    lt("The full card is in the description", { kicker: "Read it before your first night", desc: "Exact amounts, what to infuse it into, how thin, how many nights a week, and the gentle way to test it first — doing it gently matters more than doing it strong.", tone: "teal", at: "first thing linked in the" }),
  ]},
  { key: "comment", phrase: "rinsing your masks off after", beats: [
    ak([{ word: "TELL ME: RINSED, OR LEFT ON?", sub: "have you been rinsing your masks off at 15 minutes this whole time, thinking that was right?", tone: "teal", atPhrase: "rinsing your masks off after" }], {}),
  ]},
  { key: "teaser", phrase: "show you the morning half", beats: [
    ak([{ word: "NEXT: THE 2-MINUTE MORNING MOVE", sub: "the daytime half that makes the night mask work twice as hard by the time you sleep", tone: "teal", atPhrase: "show you the morning half" }], {}),
  ]},
  { key: "cierre", phrase: "back of your hand one", beats: [
    c("nametag", { name: "Dr. Federer", role: "Those spots were never who you are. Tonight, tell the printer to stop.", image: "img/rm_federer_serious.png", at: "back of your hand one" }),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_rosemarymask.json", "utf8").replace(/^﻿/, ""));
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
    beat.clip = `avatar_clips/rosemarymask/${beat.id}.mp4`;
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
fs.writeFileSync("public/avatar_clips_rosemarymask.json", JSON.stringify(KIT_CLIPS, null, 1));

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
fs.writeFileSync("src/_fed6/VideoEdit/rosemarymask_beats.ts",
  `// AUTO-GENERADO por gen_rosemarymask.mjs — beats (presenter IA rm_federer_*.png + componentes data-driven).\n` +
  `export const MASK_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/rosemarymask_hooks.ts",
  `// AUTO-GENERADO por gen_rosemarymask.mjs — rangos talk.\n` +
  `export const TALKSR: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/rosemarymask.json", JSON.stringify({ video: "rosemarymask", avatar: "rosemarymask_opt.mp4", theme: "medico", beats }, null, 1));

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
