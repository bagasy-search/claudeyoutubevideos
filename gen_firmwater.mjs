// gen_firmwater.mjs — beatsheet/firmwater.json (Canal "Dr. Federer | Holistic Health" · EN · "THE COLLAGEN LOCK" / hibiscus water = firma la piel).
// Avatar firmwater_opt.mp4 (~20.1min, EN "you"). Anclaje por FRASE a captions_firmwater.json (avatar leyó el guion textual).
// MATERIAL: b-roll = SOLO stock Pexels (FW_BROLL). IA = SOLO el presentador (fw_federer_*.png, gpt-image-2 con ref) + hooks (fw_hook_*).
// Diagramas/reveal = componentes REALES data-driven + láminas gpt-image-2 (lamina_board / reveal), NUNCA texto quemado suelto.
// HOOK: freezezoom macro hibisco → PRICEWAR ($2 vs $90) → avatar full recién en "dontgetup".
// LÁMINA: 5 freezezoom sobre lamina_board (zoom por zona) → reveal card (guía+QR) → guardaesto "en la descripción".
import fs from "fs";

const r  = (name, o = {}) => ({ t: "raw", name, ...o });
const c  = (kind, props = {}) => ({ t: kind, ...props });
const es = (number, title, o = {}) => ({ t: "errorstinger", number, title, tone: o.tone || "teal", ...o });
const mv = (myth, truth, o = {}) => ({ t: "mitoverdad", myth, truth, ...o });
const fc = (words, o = {}) => ({ t: "frasecinetica", words, tone: o.tone || "teal", perWord: o.perWord || 10, ...o });
const ak = (items, o = {}) => ({ t: "avatarkeyword", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const lt = (title, o = {}) => ({ t: "lowerthird", title, tone: o.tone || "teal", ...o });
const ge = (title, items, o = {}) => ({ t: "guardaesto", title, items, ...o });
const fz = (image, o = {}) => ({ t: "freezezoom", image, x: o.x ?? 0.5, y: o.y ?? 0.45, zoom: o.zoom ?? 1.9, label: o.label, tone: o.tone || "teal", ...o });

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1, bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, annotated: 1.3, cross: 1.6, process: 2.6, talk: 1.0,
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.9, pricewar: 2.6, reprintscan: 2.6, hourdial: 2.4 };

const LAM = "img/firmwater_lamina_board.png";
const REVEAL = "img/firmwater_reveal.png";

const SECTIONS = [
  // ░░ HOOK — antes de la cara ░░
  { key: "hook", phrase: null, start: 0.3, beats: [
    fz("img/fw_hook_hibiscus_macro.png", { x: 0.5, y: 0.5, zoom: 1.7, label: "This isn't a cup of tea.", tone: "teal" }),
  ]},
  { key: "notfeed", phrase: "it stops the thing", beats: [
    mv("Firming means ADDING collagen to your skin", "No — it STOPS the enzyme quietly cutting yours apart", { flipPhrase: "it stops the thing" }),
  ]},
  { key: "pricewar", phrase: "it costs about", beats: [
    c("pricewar", { leftImage: "img/fw_hook_hibiscus.png", rightImage: "img/fw_hook_serum.png", leftPrice: "$2", rightPrice: "$90", strike: "/ bottle", leftLabel: "Dried hibiscus, at night", rightLabel: "A 'firming serum'", subtitle: "One holds an enzyme down. The other holds your wallet down." }),
  ]},
  // ░░ INVENTARIO SENSORIAL (sin espejo) ░░
  { key: "dontgetup", phrase: "just take the hand", beats: [
    c("talk", {}),
    ak([{ word: "THE BACK OF YOUR HAND", sub: "flatter than it was, looser over the tendons — the exact same thing is happening on your face", tone: "teal", atPhrase: "look at the back of" }], {}),
  ]},
  { key: "enzymejob", phrase: "an enzyme doing its job", beats: [
    ak([{ word: "AN ENZYME, WORKING TOO WELL", sub: "the very process softening the line at the corner of your mouth and the edge of your jaw", tone: "teal", atPhrase: "an enzyme doing its job" }], {}),
  ]},
  // ░░ REFRAME: SCISSORS, NOT SUPPLY ░░
  { key: "nobody", phrase: "the part nobody explains", beats: [
    c("talk", {}),
    ak([{ word: "COLLAGEN + ELASTIN", sub: "collagen = the firmness and scaffolding; elastin = the snap that springs back when you smile", tone: "teal", atPhrase: "your skin is built on two" }], {}),
  ]},
  { key: "demolish", phrase: "you started demolishing faster", beats: [
    mv("After 60 the collagen factory shuts down", "It never shuts down — you're DEMOLISHING it faster than you build", { flipPhrase: "you started demolishing" }),
  ]},
  { key: "scissors", phrase: "the main one is called", beats: [
    ak([{ word: "COLLAGENASE + ELASTASE = SCISSORS", sub: "enzymes that cut old collagen and elastin into pieces — after 50, with sun and sugar, they get too busy", tone: "teal", atPhrase: "the main one is called" }], {}),
  ]},
  { key: "scissorsbusy", phrase: "those scissors get busy", beats: [
    fc([{ t: "They" }, { t: "cut" }, { t: "FASTER", hl: true }, { t: "than" }, { t: "you" }, { t: "REBUILD.", hl: true }], { tone: "warn", at: "those scissors get busy" }),
  ]},
  { key: "question", phrase: "something you could put on", beats: [
    ak([{ word: "SOMETHING THAT JAMS THE SCISSORS?", sub: "cheap, safe, every night — that slows the demolition long enough for your own building to catch up", tone: "teal", atPhrase: "something you could put on" }], {}),
  ]},
  // ░░ REVEAL HIBISCO + OPEN LOOP ░░
  { key: "reveal", phrase: "telling patients about it", beats: [
    c("talk", {}),
    r("fw_federer_hibiscus", { at: "this flower", kicker: "A firming treatment you refill for the price of a coffee" }),
    ak([{ word: "HIBISCUS — \"THE COLLAGEN LOCK\"", sub: "the deep-red flower — used ON the skin, at night, the right way. Not sipped in a mug.", tone: "teal", atPhrase: "this flower" }], {}),
  ]},
  { key: "openloop", phrase: "nine out of ten people", beats: [
    es("!", "9 out of 10 just DRINK it — and it does nothing. The real mistake, later.", { tone: "warn", w: 3.2, eyebrow: "Revealed at the end" }),
  ]},
  // ░░ PRESENTACIÓN (~min 5) ░░
  { key: "intro", phrase: "let me back up and", beats: [
    c("talk", {}),
    c("nametag", { name: "Dr. Federer", role: "General physician — the real chemistry of mature skin", image: "img/fw_federer_hibiscus.png", at: "my name is dr federer" }),
  ]},
  // ░░ VIÑETA DE PACIENTE ░░
  { key: "patient", phrase: "let me tell you about", beats: [
    c("talk", {}),
    lt("She canceled the needle — after 8 weeks with a cup of red water", { kicker: "One patient", desc: "She'd booked the injection and priced it out. Eight weeks in, she pressed her cheek and it pushed back the way it hadn't in years — and she canceled the appointment herself.", tone: "teal", at: "she pressed her cheek with" }),
  ]},
  // ░░ EXPECTATIVAS — 3 RESULTADOS ░░
  { key: "expect", phrase: "so let me tell you honestly", beats: [
    c("talk", {}),
  ]},
  { key: "result1", phrase: "the first one is quick", beats: [
    es("01", "First nights: brighter, smoother — the dull, papery top layer lifts", { tone: "teal", w: 3.0, eyebrow: "Result" }),
  ]},
  { key: "result2", phrase: "the second thing takes longer", beats: [
    es("02", "Weeks 3–4: the bounce — skin springs back off your finger", { tone: "teal", w: 3.0, eyebrow: "Result" }),
  ]},
  { key: "result3", phrase: "the third thing is the", beats: [
    es("03", "Week 8: your own collagen, finally getting to STAY", { tone: "teal", w: 3.0, eyebrow: "Result" }),
  ]},
  { key: "namelock", phrase: "i call it the collagen", beats: [
    fc([{ t: "THE", hl: true }, { t: "COLLAGEN", hl: true }, { t: "LOCK." }, { t: "A" }, { t: "flower." }, { t: "Warm" }, { t: "water." }, { t: "At" }, { t: "night." }], { tone: "teal", at: "i call it the collagen" }),
  ]},
  // ░░ MECANISMO ░░
  { key: "science", phrase: "let me show you why it", beats: [
    c("talk", {}),
    r("fw_federer_steep", { at: "actually inside this red", kicker: "Deep red water — two jobs at once" }),
  ]},
  { key: "twojobs", phrase: "the water pulls out two", beats: [
    ak([{ word: "TWO JOBS AT ONCE", sub: "red pigments that block the scissors + gentle fruit acids that clear the dull surface", tone: "teal", atPhrase: "the water pulls out two" }], {}),
  ]},
  { key: "lock", phrase: "slot onto collagenase and elastase", beats: [
    ak([{ word: "ANTHOCYANINS BLOCK THE SCISSORS", sub: "myricetin slots onto collagenase & elastase and slows them down — a hand on the blades", tone: "teal", atPhrase: "slot onto collagenase and elastase" }], {}),
  ]},
  { key: "lockline", phrase: "a hand on the blades", beats: [
    fc([{ t: "A" }, { t: "hand" }, { t: "on" }, { t: "the" }, { t: "BLADES.", hl: true }, { t: "That's" }, { t: "the" }, { t: "LOCK.", hl: true }], { tone: "teal", at: "a hand on the blades" }),
  ]},
  { key: "acids", phrase: "a set of gentle fruit", beats: [
    ak([{ word: "GENTLE FRUIT ACIDS (AHAs)", sub: "citric & malic acid loosen the dull, dead top layer — that's the brightness in the first week", tone: "teal", atPhrase: "a set of gentle fruit" }], {}),
  ]},
  { key: "appetizer", phrase: "the enzyme lock is the", beats: [
    fc([{ t: "Polish" }, { t: "=" }, { t: "the" }, { t: "APPETIZER." }, { t: "The" }, { t: "enzyme" }, { t: "LOCK", hl: true }, { t: "=" }, { t: "the" }, { t: "MEAL.", hl: true }], { tone: "teal", at: "the enzyme lock is the" }),
  ]},
  { key: "calm", phrase: "hibiscus is loaded with antioxidants", beats: [
    es("03", "Antioxidants + vitamin C calm the inflammation feeding the scissors", { tone: "teal", w: 3.0, eyebrow: "Third job" }),
  ]},
  { key: "buildbreak", phrase: "build more break less", beats: [
    fc([{ t: "Build" }, { t: "MORE.", hl: true }, { t: "Break" }, { t: "LESS.", hl: true }, { t: "Calm" }, { t: "the" }, { t: "FIRE.", hl: true }], { tone: "teal", at: "build more break less" }),
  ]},
  // ░░ EL ERROR — pago del open loop ░░
  { key: "mistake", phrase: "here is the mistake", beats: [
    c("talk", {}),
    es("!", "Half one: they DRINK it — a rumor of a dose, never on the skin", { tone: "warn", w: 3.2, eyebrow: "The mistake" }),
  ]},
  { key: "drinkmyth", phrase: "hibiscus tea is a lovely", beats: [
    mv("Drinking hibiscus tea firms your face", "A drink is diluted body-wide — to work, it must go ON the skin", { flipPhrase: "the red water has to" }),
  ]},
  { key: "toohot", phrase: "they pour boiling water on", beats: [
    r("fw_hook_boiling", { at: "they pour boiling water on", kicker: "Boiling + strong = it stings. That's overdoing it, not the flower." }),
  ]},
  { key: "warmweak", phrase: "weak and warm beats strong", beats: [
    fc([{ t: "WARM,", hl: true }, { t: "not" }, { t: "boiling." }, { t: "WEAK,", hl: true }, { t: "not" }, { t: "strong." }], { tone: "teal", at: "weak and warm beats strong" }),
  ]},
  { key: "bottle", phrase: "if you go buy a", beats: [
    mv("A store 'hibiscus toner' = real hibiscus", "Mostly water, fragrance, dye — and drying ALCOHOL near the top", { flipPhrase: "a drying alcohol somewhere near" }),
  ]},
  // ░░ POR QUÉ DE NOCHE — firma del canal ░░
  { key: "whynight", phrase: "you do this at night", beats: [
    c("talk", {}),
    fc([{ t: "Why" }, { t: "at" }, { t: "NIGHT?", hl: true }], { tone: "teal", at: "you do this at night" }),
  ]},
  { key: "repairmode", phrase: "your skin runs its repair", beats: [
    ak([{ word: "NIGHT = REPAIR MODE", sub: "fibroblasts build collagen, skin recovers water — and the scissors are most active, right while you sleep", tone: "teal", atPhrase: "your skin runs its repair" }], {}),
  ]},
  { key: "apply", phrase: "but if you press a", beats: [
    r("fw_federer_apply", { at: "but if you press a", kicker: "A thin layer at night — then seal it in" }),
  ]},
  { key: "hourwindow", phrase: "holding those enzymes down", beats: [
    c("hourdial", { hour: 2, big: "1", unit: "window", label: "Hold the enzymes down — through the night repair window.", tone: "gold" }),
  ]},
  // ░░ VILLANO COMERCIAL ░░
  { key: "villain", phrase: "there is an entire industry", beats: [
    c("talk", {}),
    c("bars", { title: "Sold a permanent problem", bars: [
      { label: "$90 'collagen-boosting' serum", value: 70, tone: "danger", note: "molecules too big to absorb" },
      { label: "$90 'plumping' day cream", value: 45, tone: "danger", note: "sold to you" },
      { label: "$90 'plumping' night cream", value: 45, tone: "danger", note: "also sold to you" } ], at: "there is an entire industry" }),
  ]},
  { key: "fornothing", phrase: "flower does most of the", beats: [
    fc([{ t: "One" }, { t: "flower." }, { t: "Most" }, { t: "of" }, { t: "the" }, { t: "JOB.", hl: true }, { t: "Two" }, { t: "DOLLARS.", hl: true }], { tone: "teal", at: "flower does most of the" }),
  ]},
  // ░░ ★ LÁMINA — valor puro, zoom por zona ░░
  { key: "lamina", phrase: "look at this this is", beats: [
    fz(LAM, { x: 0.5, y: 0.40, zoom: 1.15, label: "\"The Collagen Lock\" — one page", tone: "teal" }),
  ]},
  { key: "lam_steps", phrase: "see the three steps down", beats: [
    fz(LAM, { x: 0.55, y: 0.42, zoom: 2.0, label: "Steep · Press · Seal", tone: "teal" }),
  ]},
  { key: "lam_steep", phrase: "a tablespoon of dried hibiscus", beats: [
    fz(LAM, { x: 0.55, y: 0.34, zoom: 2.2, label: "Warm water — not boiling", tone: "teal" }),
  ]},
  { key: "lam_seal", phrase: "the step everybody skips you", beats: [
    fz(LAM, { x: 0.55, y: 0.58, zoom: 2.2, label: "Seal it — a few drops of oil", tone: "teal" }),
  ]},
  { key: "lam_time", phrase: "look down here at the", beats: [
    fz(LAM, { x: 0.5, y: 0.72, zoom: 2.0, label: "Night 1 → Week 3 → Week 8", tone: "gold" }),
  ]},
  // ░░ ★ REVELAR QUE SALIÓ DE LA GUÍA ░░
  { key: "reveal_guide", phrase: "one single page i pulled", beats: [
    fz(REVEAL, { x: 0.5, y: 0.5, zoom: 1.06, label: undefined, tone: "teal" }),
  ]},
  { key: "reveal_hold", phrase: "if one page can do", beats: [
    fz(REVEAL, { x: 0.72, y: 0.55, zoom: 1.3, label: undefined, tone: "teal" }),
  ]},
  { key: "desc1", phrase: "leave the whole thing for", beats: [
    ge("The full guide → in the description", ["The exact amounts", "How many nights a week", "The sealing oil to pick", "The brown-spot variation"], { at: "leave the whole thing for" }),
  ]},
  // ░░ ESCUDO DE HONESTIDAD ░░
  { key: "honesty", phrase: "let me tell you what this will", beats: [
    c("talk", {}),
    c("checklist", { title: "Be honest — what this will NOT do", eyebrow: "The honest truth", tone: "warn", stamp: "THE HONEST TRUTH", items: [
      { text: "Erase a deep-set wrinkle or rebuild a hollow cheek", state: "warn" },
      { text: "Last without the habit — week-one glow is partly surface", state: "warn" },
      { text: "Let you skip sunscreen — the acids make skin sun-sensitive", state: "warn" },
      { text: "'Detox' anything — and no, no one is hiding it from you", state: "warn" },
      { text: "Replace a real talk with your own doctor", state: "warn" } ], at: "let me tell you what this will" }),
  ]},
  { key: "patchtest", phrase: "do a patch test first", beats: [
    ak([{ word: "PATCH-TEST ON YOUR ARM FIRST", sub: "a dab on the inside of the arm, wait a full day — red or itchy? this one isn't for you, and that's fine", tone: "warn", atPhrase: "do a patch test first" }], {}),
  ]},
  // ░░ PAGO DEL LOOP + RECAP ░░
  { key: "payloop", phrase: "warm weak on the skin", beats: [
    fc([{ t: "Warm." }, { t: "Weak." }, { t: "On" }, { t: "the" }, { t: "SKIN.", hl: true }, { t: "OVERNIGHT.", hl: true }], { tone: "teal", at: "warm weak on the skin" }),
  ]},
  { key: "recap", phrase: "five clean steps so", beats: [
    ge("The Collagen Lock — 5 steps", ["1 · A tbsp dried hibiscus in warm (not boiling) water", "2 · Press it in at night with a cotton pad", "3 · Seal with a few drops of plain oil", "4 · Leave it on; rinse in the morning", "5 · 4–5 nights a week — give it eight weeks"], { at: "five clean steps so" }),
  ]},
  // ░░ 2ª ESTRATEGIA — descripción ░░
  { key: "desc2", phrase: "a variation of this that", beats: [
    c("talk", {}),
    lt("The brown-spot variation → in the description", { kicker: "One more thing — on purpose", desc: "For the age spots on the hands and the cheek, one more pantry ingredient stirred in, in one exact ratio, turns this into a spot-fader — without getting harsh. I wrote it out, right under the guide.", tone: "teal", at: "i put it in the" }),
  ]},
  // ░░ CTA: comentario → teaser → suscripción → cierre ░░
  { key: "comment", phrase: "tell me in the comments", beats: [
    ak([{ word: "TELL ME WHERE YOU'RE WATCHING FROM", sub: "and — had anyone ever told you firming is less about ADDING collagen than stopping the enzyme that steals it?", tone: "teal", atPhrase: "tell me in the comments" }], {}),
  ]},
  { key: "teaser", phrase: "a second plant a green", beats: [
    ak([{ word: "NEXT: THE GREEN PLANT FOR YOUR NECK", sub: "a second plant you already cook with — it firms crepey neck and chest skin through a completely different door", tone: "teal", atPhrase: "a second plant a green" }], {}),
  ]},
  { key: "cierre", phrase: "so that deep red flower", beats: [
    c("nametag", { name: "Dr. Federer", role: "The gentlest, oldest lock there is for the collagen you've still got. Steep a cup tonight.", image: "img/fw_federer_hibiscus.png", at: "so that deep red flower" }),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_firmwater.json", "utf8").replace(/^﻿/, ""));
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
    beat.clip = `avatar_clips/firmwater/${beat.id}.mp4`;
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
fs.writeFileSync("public/avatar_clips_firmwater.json", JSON.stringify(KIT_CLIPS, null, 1));

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
fs.writeFileSync("src/_fed6/VideoEdit/firmwater_beats.ts",
  `// AUTO-GENERADO por gen_firmwater.mjs — beats (presenter IA fw_federer_*.png + componentes data-driven).\n` +
  `export const FW_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/firmwater_hooks.ts",
  `// AUTO-GENERADO por gen_firmwater.mjs — rangos talk.\n` +
  `export const TALKSR: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/firmwater.json", JSON.stringify({ video: "firmwater", avatar: "firmwater_opt.mp4", theme: "medico", beats }, null, 1));

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
