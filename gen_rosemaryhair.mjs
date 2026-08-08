// gen_rosemaryhair.mjs — beatsheet/rosemaryhair.json (Canal "Dr. Federer | Holistic Health" · EN · ROSEMARY for HAIR).
// Avatar rosemaryhair_opt.mp4 (~17.5min, EN "you"). Anclaje por FRASE a captions_rosemaryhair.json.
// MATERIAL: b-roll = SOLO stock Pexels (cama HAIR_BROLL). IA = SOLO el presentador (rh_federer_*.png) + 3 imgs hook.
// Componentes REALES data-driven. HOOK v3: freezezoom(sprig) → pricewar VERDICT(=/SAME HAIR) → errorstinger(9/10)
//   → mitoverdad(never a hair problem) → SCALPDIVE(dead strand→living root) → freezezoom(hairline participation).
// 17 bloques: hook→reframe→inventario→reveal ROMERO→mecanismo(DHT/5aR)→3 compuestos→WHY NIGHT(firma)→villano comercial
//   →rutina 3 capas(SCALP not hair)→timeline honesto→escudo honestidad→PAGO del loop(lo ponen en el PELO)→recap→CTAs→cierre.
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
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.9, pricewar: 2.6, scalpdive: 2.8 };

const SECTIONS = [
  // ░░ HOOK v3 — abre en el OBJETO, choque de precios con veredicto, buceo a la raíz ░░
  { key: "hook", phrase: null, start: 0.3, beats: [
    c("freezezoom", { image: "img/hook_sprig.png", x: 0.5, y: 0.5, zoom: 1.6, label: "About two dollars.", tone: "teal", w: 0.7 }),
    // el CHOQUE: $2 herb vs $80 drug → VS muta a "=" → SAME HAIR · 6 MONTHS
    c("pricewar", { leftImage: "img/hook_sprig.png", rightImage: "img/hook_bottle.png", leftPrice: "$2", rightPrice: "$80", strike: "/ bottle", leftLabel: "A $2 kitchen herb", rightLabel: "The #1 baldness drug", subtitle: "In a real 6-month trial…", verdict: "SAME HAIR · 6 MONTHS", w: 1.7 }),
  ]},
  // 0:18 — recién ACÁ el doctor, full (rompe la tensión)
  { key: "iknow", phrase: "know how that sounds", beats: [ c("talk", {}) ]},
  // 0:40 — OPEN LOOP trabado antes del minuto 1
  { key: "openloop_early", phrase: "nine out of ten women", beats: [
    es("!", "9 of 10 try it — see NOTHING. One mistake.", { tone: "warn", w: 3.0, eyebrow: "Revealed at the end" }),
  ]},
  // 0:52 — REFRAME: no es pelo, es RAÍZ
  { key: "reframe", phrase: "never really a hair problem", beats: [
    mv("It's a HAIR problem — buy another serum", "It's a ROOT problem — the living follicle is being strangled", { flipPhrase: "was never really a hair" }),
  ]},
  // 1:03 — ⭐ SCALPDIVE: el pelo está muerto → buceo a la raíz viva
  { key: "deadstrand", phrase: "your hair is already dead", beats: [
    c("scalpdive", { labelTop: "The strand you brush is DEAD", labelRoot: "buried down in your scalp" }),
  ]},
  { key: "strangled", phrase: "poor blood flow and a", beats: [
    ak([{ word: "TWO THINGS STRANGLE THE ROOT", sub: "poor blood flow + a hormone — and both answer to rosemary at ONE hour", tone: "warn", atPhrase: "poor blood flow and a" }], {}),
  ]},
  { key: "onehour", phrase: "at one hour of the", beats: [
    fc([{ t: "Both" }, { t: "fixable." }, { t: "At" }, { t: "ONE", hl: true }, { t: "hour." }], { tone: "teal", at: "at one hour of the" }),
  ]},
  // ░░ INVENTARIO SENSORIAL — participación física (sin espejo) ░░
  { key: "inventory", phrase: "run it along your hairline", beats: [
    c("freezezoom", { image: "img/hook_hairline.png", x: 0.5, y: 0.32, zoom: 1.9, label: "THIS is where it happens — not the ponytail.", tone: "teal", at: "run it along your hairline" }),
  ]},
  // ░░ PRESENTACIÓN (~min 2) + ESCUDO DE ENTRADA + ANÉCDOTA ░░
  { key: "intro", phrase: "spend my days on the", beats: [
    c("talk", {}),
    c("nametag", { name: "Dr. Federer", role: "Physician — the real chemistry of what reaches a follicle", image: "img/rh_federer_nametag.png", at: "boring unglamorous chemistry of what" }),
  ]},
  { key: "anecdote", phrase: "tell you about someone because", beats: [
    lt("“I don't recognize myself in photos anymore.”", { kicker: "One patient — $400 in a year, nothing", desc: "Not the wrinkles — the part. The way the light went straight through to her scalp in every picture.", tone: "teal", at: "recognize myself in photos anymore" }),
  ]},
  { key: "backup", phrase: "let me actually back up", beats: [ c("talk", {}) ]},
  // ░░ MECANISMO — miniaturización / DHT / 5-alpha-reductasa ░░
  { key: "miniat", phrase: "that shrinking has a name", beats: [
    ak([{ word: "MINIATURIZATION", sub: "each hair comes back finer until the follicle quits — THAT is the enemy, not falling hair", tone: "teal", atPhrase: "say that word once out" }], {}),
  ]},
  { key: "dht", phrase: "a hormone called dht", beats: [
    ak([{ word: "DHT", sub: "made from testosterone via an enzyme — 5-alpha-reductase — it chokes the follicle down to nothing", tone: "warn", atPhrase: "say that one too dht" }], {}),
  ]},
  { key: "mechanism", phrase: "in the lab rosemary appears", beats: [
    ak([{ word: "ROSEMARY BLOCKS THE ENZYME", sub: "less 5-alpha-reductase → less DHT on the follicle → less strangling", tone: "teal", atPhrase: "it seems to block that" }], {}),
  ]},
  { key: "study", phrase: "they took people with pattern", beats: [
    c("bars", { title: "2015 trial · hair gained over 6 months", bars: [
      { label: "Rosemary oil", value: 82, tone: "teal", note: "+ less scalp itch" },
      { label: "Minoxidil (the drug)", value: 84, tone: "danger", note: "the standard" } ], at: "gained a comparable amount of" }),
  ]},
  { key: "studyverdict", phrase: "reason to spend 2 before", beats: [
    fc([{ t: "Spend" }, { t: "$2" }, { t: "before" }, { t: "you" }, { t: "spend" }, { t: "$80.", hl: true }], { tone: "teal", at: "reason to spend 2 before" }),
  ]},
  { key: "mistaketease", phrase: "the difference between new hair", beats: [
    es("!", "The mistake: new hair vs 3 wasted months", { tone: "warn", w: 3.0, eyebrow: "Revealed at the end" }),
  ]},
  // ░░ 3 COMPUESTOS (carnosic / rosmarinic / cineole) ░░
  { key: "compounds", phrase: "each compound has its own", beats: [ c("talk", {}) ]},
  { key: "carnosic", phrase: "a compound called carnosic acid", beats: [
    ak([{ word: "CARNOSIC ACID — THE BODYGUARD", sub: "antioxidant that shields the follicle from cellular 'rust' so it keeps making hair", tone: "teal", atPhrase: "think of it as the" }], {}),
  ]},
  { key: "rosmarinic", phrase: "the second is rosmarinic acid", beats: [
    es("02", "Rosmarinic acid — the peacemaker, calms scalp inflammation", { tone: "teal", w: 3.0 }),
  ]},
  { key: "cineole", phrase: "the piney sharp part of", beats: [
    es("03", "Cineole — the wake-up call, pulls blood to the follicle", { tone: "teal", w: 3.0 }),
  ]},
  { key: "threejobs", phrase: "bodyguard peacemaker wake up call", beats: [
    ge("One $2 herb — three jobs", ["Carnosic → guards the follicle", "Rosmarinic → calms the fire", "Cineole → feeds blood to the root"], { at: "bodyguard peacemaker wake up call" }),
  ]},
  // ░░ WHY NIGHT — firma del canal ░░
  { key: "morning", phrase: "why at night", beats: [
    c("talk", {}),
    fc([{ t: "Why" }, { t: "at" }, { t: "NIGHT?", hl: true }], { tone: "teal", at: "why at night" }),
  ]},
  { key: "nightwindow", phrase: "exactly one window in your", beats: [
    ak([{ word: "ONE WINDOW: NIGHT", sub: "6–8 uninterrupted hours on the scalp — nothing washes it out, blood flow relaxes in", tone: "teal", atPhrase: "where all three of those" }], {}),
  ]},
  { key: "cortisol", phrase: "the stress signal the cortisol", beats: [
    ak([{ word: "THE MASSAGE LOWERS CORTISOL", sub: "the stress hormone that locks follicles asleep — right before bed you tell the roots it's safe to grow", tone: "teal", atPhrase: "the stress signal the cortisol" }], {}),
  ]},
  // ░░ VILLANO COMERCIAL ░░
  { key: "villain", phrase: "walk down the hair aisle", beats: [
    c("talk", {}),
    c("bars", { title: "'Growth serum' in a bottle — what you pay for", bars: [
      { label: "Active ingredient", value: 12, tone: "danger", note: "a rumor" },
      { label: "Water, fragrance & a story", value: 88, tone: "danger", note: "most of it" } ], at: "just enough plant extract to" }),
  ]},
  { key: "notvillain", phrase: "2 of real rosemary used", beats: [
    fc([{ t: "Two" }, { t: "dollars." }, { t: "One" }, { t: "hour." }, { t: "Beats" }, { t: "the" }, { t: "whole" }, { t: "SHELF.", hl: true }], { tone: "teal", at: "2 of real rosemary used" }),
  ]},
  // ░░ CÓMO HACERLO — 3 CAPAS (SCALP, not hair) ░░
  { key: "howto", phrase: "how to actually do this", beats: [
    c("talk", {}),
    r("rh_federer_scalp", { at: "steep a good handful of", kicker: "Three layers — and where it goes is everything" }),
  ]},
  { key: "layer1", phrase: "layer 1 is the rosemary", beats: [
    es("01", "Infuse gently in a carrier oil — never boil it", { tone: "teal", w: 2.6, eyebrow: "Layer" }),
    r("rh_federer_infuse", { at: "steep a good handful of", kicker: "Jojoba or light olive — warm, off the heat, patience" }),
  ]},
  { key: "infuse", phrase: "the important word there is", beats: [
    mv("Crank the heat = stronger medicine", "A hard boil COOKS the carnosic acid out — gentle warmth only", { flipPhrase: "cook the medicine right out" }),
  ]},
  { key: "layer2", phrase: "it goes on the scalp", beats: [
    ak([{ word: "ON THE SCALP — NOT THE HAIR", sub: "the follicle is in your scalp, not your ponytail; the ends are already dead", tone: "warn", atPhrase: "it goes on the scalp" }], {}),
  ]},
  { key: "layer3", phrase: "layer 3 is the massage", beats: [
    es("03", "Massage 2 min, fingertips — pushes blood, wakes stem cells", { tone: "teal", w: 2.6, eyebrow: "Layer" }),
    r("rh_federer_massage", { at: "with the pads of your", kicker: "Small circles, move the scalp over the bone — never nails" }),
  ]},
  { key: "donots", phrase: "a couple of do nots", beats: [
    c("checklist", { title: "Do NOT", eyebrow: "These matter", tone: "warn", items: [
      { text: "Use essential oil undiluted (it burns → more shedding)", state: "warn" },
      { text: "Massage with your nails — fingertips only", state: "warn" },
      { text: "Rinse it out fast — it needs the overnight hours", state: "warn" } ], at: "rosemary essential oil undiluted straight" }),
  ]},
  // ░░ TIMELINE HONESTO — mes a mes ░░
  { key: "timeline", phrase: "actually see and when because", beats: [ c("talk", {}) ]},
  { key: "week12", phrase: "the first 2 3 weeks", beats: [
    es("01", "Weeks 1–3: maybe MORE shedding — old hair making room. Don't quit.", { tone: "warn", w: 3.0, eyebrow: "Timeline" }),
  ]},
  { key: "week46", phrase: "around week 4 to 6", beats: [
    es("02", "Weeks 4–6: scalp calmer, less tight — you feel it before you see it", { tone: "teal", w: 3.0, eyebrow: "Timeline" }),
  ]},
  { key: "month2", phrase: "by month 2 two and", beats: [
    es("03", "Month 2–2½: baby hairs — fine fuzz along the hairline", { tone: "teal", w: 3.0, eyebrow: "Timeline" }),
  ]},
  { key: "month46", phrase: "and by month 4 to", beats: [
    es("04", "Month 4–6: baby hairs longer, darker — the part looks narrower", { tone: "teal", w: 3.0, eyebrow: "Timeline" }),
  ]},
  { key: "anecpay", phrase: "at about month 5 she", beats: [
    lt("She stopped hiding her part", { kicker: "$2 of rosemary — after $400 of serum", desc: "Same lighting, same spot. The part had closed up enough that she didn't need to hide it anymore.", tone: "teal", at: "same lighting same spot on" }),
  ]},
  { key: "desc1", phrase: "waiting for you in the", beats: [
    ge("Exact recipe → in the description", ["How much rosemary per cup", "How many drops / how many nights", "The carrier oil + the step-by-step card"], { at: "waiting for you in the" }),
  ]},
  // ░░ EL ERROR (pago del open loop) — LO PONEN EN EL PELO ░░
  { key: "mistakepay", phrase: "people put it on their", beats: [
    c("talk", {}),
    mv("Rosemary just doesn't work for me", "It was on the HAIR, rinsed fast — never on the scalp, never overnight", { flipPhrase: "onto the living follicle" }),
  ]},
  { key: "threerules", phrase: "scalp overnight every night", beats: [
    fc([{ t: "SCALP." }, { t: "OVERNIGHT." }, { t: "EVERY" }, { t: "NIGHT.", hl: true }], { tone: "teal", at: "scalp overnight every night" }),
  ]},
  // ░░ ESCUDO DE HONESTIDAD ░░
  { key: "honesty", phrase: "where rosemary does not work", beats: [
    c("talk", {}),
    c("checklist", { title: "Be honest — what rosemary will NOT do", eyebrow: "The honest truth", tone: "warn", items: [
      { text: "Raise a dead follicle — a smooth, shiny scalp is gone", state: "warn" },
      { text: "Work overnight — this is a 3–6 month project", state: "warn" },
      { text: "Skip the early shed — that's often the first sign it works", state: "warn" },
      { text: "Fix sudden or patchy loss — see a doctor (thyroid, iron)", state: "warn" } ], at: "if a patch of your" }),
  ]},
  { key: "caution", phrase: "do a patch test first", beats: [
    ak([{ word: "PATCH TEST · KEEP FROM EYES", sub: "some skin reacts; sudden or patchy loss → check thyroid & iron with your own doctor", tone: "warn", atPhrase: "a little on your inner" }], {}),
  ]},
  { key: "noconsp", phrase: "nobody is hiding this from", beats: [
    fc([{ t: "No" }, { t: "conspiracy." }, { t: "Just" }, { t: "a" }, { t: "cheap," }, { t: "UNPATENTABLE", hl: true }, { t: "plant." }], { tone: "teal", at: "nobody is hiding this from" }),
  ]},
  // ░░ RECAP 5 PASOS ░░
  { key: "recap", phrase: "five steps so you leave", beats: [
    c("talk", {}),
    ge("Wake the Roots — 5 steps", ["1 · Infuse gently — never boil", "2 · On the SCALP, not the lengths", "3 · Massage 2 min, fingertips", "4 · Overnight, every night — wash out AM", "5 · Give it 3–6 months — ride the early shed"], { at: "one get real rosemary onto" }),
  ]},
  // ░░ CTAs + CIERRE ░░
  { key: "ctacoment", phrase: "tell me down in the", beats: [
    ak([{ word: "TELL ME: PART, TEMPLES, OR CROWN?", sub: "where are you seeing it most? just tell me the spot — it tells me what to make next", tone: "teal", atPhrase: "where are you seeing it" }], {}),
  ]},
  { key: "teaser", phrase: "there is a second herb", beats: [
    ak([{ word: "NEXT: THE HERB THAT STOPS THE SHEDDING", sub: "works from the INSIDE — the two together are the closest thing to a real routine", tone: "teal", atPhrase: "one you almost certainly have" }], {}),
  ]},
  { key: "subscribe", phrase: "so subscribe so it actually", beats: [
    fc([{ t: "Subscribe" }, { t: "—" }, { t: "I'm" }, { t: "the" }, { t: "only" }, { t: "AD", hl: true }, { t: "they've" }, { t: "got." }], { tone: "teal", at: "so subscribe so it actually" }),
  ]},
  { key: "cierre", phrase: "the water down to the", beats: [
    c("nametag", { name: "Dr. Federer", role: "You were never watering a dead plant — you just had to reach the root. Go wake them up.", image: "img/rh_federer_serious.png", at: "go wake them up" }),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_rosemaryhair.json", "utf8"));
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
    beat.clip = `avatar_clips/rosemaryhair/${beat.id}.mp4`;
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
fs.writeFileSync("public/avatar_clips_rosemaryhair.json", JSON.stringify(KIT_CLIPS, null, 1));

// ── PISO DE DURACIÓN ──
const COMPK = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "callout", "bars", "diagram", "rule", "nametag", "board", "annotated", "cross", "process", "lowerthird", "guardaesto", "errorstinger", "mitoverdad", "frasecinetica", "freezezoom", "pricewar", "scalpdive"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) {
  const i = compIx[k];
  const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END;
  const capDur = nextComp - beats[i].start - 0.1;
  beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2);
}

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/_fed6/VideoEdit/rosemaryhair_beats.ts",
  `// AUTO-GENERADO por gen_rosemaryhair.mjs — beats (presenter IA rh_federer_*.png + componentes data-driven).\n` +
  `export const HAIR_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/rosemaryhair_hooks.ts",
  `// AUTO-GENERADO por gen_rosemaryhair.mjs — rangos talk.\n` +
  `export const TALKSR: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/rosemaryhair.json", JSON.stringify({ video: "rosemaryhair", avatar: "rosemaryhair_opt.mp4", theme: "medico", beats }, null, 1));

// ── QA ──
const need = new Set();
beats.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); if (b.leftImage) need.add(b.leftImage); if (b.rightImage) need.add(b.rightImage); });
const miss = [...need].filter((p) => !fs.existsSync("public/" + p));
if (missing.length) console.log(`⚠ frases NO ancladas (${missing.length}):`, missing);
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw(presenter): ${raw} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min) · VIDEO_END ${VIDEO_END.toFixed(0)}s · kit_clips ${KIT_CLIPS.length}`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`imágenes referenciadas: ${need.size} · faltantes ${miss.length}:`, miss.join(" "));
