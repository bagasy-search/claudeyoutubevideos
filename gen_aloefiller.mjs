// gen_aloefiller.mjs — beatsheet/aloefiller.json (Canal "Dr. Federer | Holistic Health" · EN · "THE GREEN FILLER" / aloe = relleno natural).
// Avatar aloefiller_opt.mp4 (~17.6min, EN "you"). Anclaje por FRASE a captions_aloefiller.json (avatar leyó el guion textual).
// MATERIAL: b-roll = SOLO stock Pexels (ALOE_BROLL). IA = SOLO el presentador (al_federer_*.png, gpt-image-2 con ref) + hooks (al_hook_*).
// Diagramas/reveal = componentes REALES data-driven + láminas gpt-image-2 (lamina_board / reveal), NUNCA texto quemado suelto.
// HOOK: freezezoom macro de aloe → PRICEWAR ($2 vs $700) → MITOVERDAD "el relleno es AGUA" → avatar full.
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

const LAM = "img/aloefiller_lamina_board.png";
const REVEAL = "img/aloefiller_reveal.png";

const SECTIONS = [
  // ░░ HOOK — 3 golpes antes de la cara ░░
  { key: "hook", phrase: null, start: 0.3, beats: [
    fz("img/al_hook_aloe_macro.png", { x: 0.5, y: 0.5, zoom: 1.7, label: "This isn't a moisturizer.", tone: "teal" }),
  ]},
  { key: "pricewar", phrase: "one of them costs about", beats: [
    c("pricewar", { leftImage: "img/al_hook_leaf.png", rightImage: "img/al_hook_syringe.png", leftPrice: "$2", rightPrice: "$700", strike: "/ 6 months", leftLabel: "One aloe leaf, at night", rightLabel: "A filler syringe, at a clinic", subtitle: "Plumps a deep line on the very same principle — no needle." }),
  ]},
  // ░░ INVENTARIO SENSORIAL (sin espejo) ░░
  { key: "dontgetup", phrase: "just take the hand", beats: [
    c("talk", {}),
    ak([{ word: "THE BACK OF YOUR HAND", sub: "flatter than it used to be, looser over the tendons — the exact same thing is happening on your face", tone: "teal", atPhrase: "look at the back of" }], {}),
  ]},
  // ░░ REFRAME: EL RELLENO ES AGUA ░░
  { key: "nobody", phrase: "the part nobody explains", beats: [
    c("talk", {}),
  ]},
  { key: "watermagnet", phrase: "hyaluronic acid is a water", beats: [
    ak([{ word: "IT'S A WATER MAGNET", sub: "one tiny bit of hyaluronic acid grabs and holds a huge amount of water — that trapped water is what plumps the line", tone: "teal", atPhrase: "hyaluronic acid is a water" }], {}),
  ]},
  { key: "fillerwater", phrase: "the water is the filler", beats: [
    mv("Filler works like spackle filling a hole", "It's just trapped WATER, holding the skin back up", { flipPhrase: "the injection is just a" }),
  ]},
  // ░░ REVEAL ALOE + OPEN LOOP ░░
  { key: "reveal", phrase: "recommending it to patients for", beats: [
    c("talk", {}),
    r("al_federer_leaf", { at: "recommending it to patients for", kicker: "A filler you refill for the price of a coffee" }),
    ak([{ word: "ALOE — \"THE GREEN FILLER\"", sub: "the clear inner gel, not the green bottle — used the right way, at the right hour", tone: "teal", atPhrase: "recommending it to patients for" }], {}),
  ]},
  { key: "openloop", phrase: "9 out of 10 people", beats: [
    es("!", "9 out of 10 use the WRONG part — one move ruins it", { tone: "warn", w: 3.2, eyebrow: "Revealed at the end" }),
  ]},
  // ░░ PRESENTACIÓN (~min 4) ░░
  { key: "intro", phrase: "let me back up and", beats: [
    c("talk", {}),
    c("nametag", { name: "Dr. Federer", role: "Physician — the real chemistry of mature skin", image: "img/al_federer_leaf.png", at: "my name is dr federer" }),
  ]},
  // ░░ VIÑETA DE PACIENTE ░░
  { key: "patient", phrase: "let me tell you about", beats: [
    c("talk", {}),
    lt("She cancelled the needle — after 8 weeks with the plant", { kicker: "One patient", desc: "She'd booked the injection and priced it out. Eight weeks in, the deep line she'd stared at for years had gone soft — and she cancelled the appointment herself.", tone: "teal", at: "she looked in the mirror one" }),
  ]},
  // ░░ EXPECTATIVAS — 3 RESULTADOS ░░
  { key: "expect", phrase: "so let me tell you what", beats: [
    c("talk", {}),
  ]},
  { key: "result1", phrase: "the first one is fast", beats: [
    es("01", "First nights: crepey skin looks fuller, softer — that's water", { tone: "teal", w: 3.0, eyebrow: "Result" }),
  ]},
  { key: "result2", phrase: "the second thing takes longer", beats: [
    es("02", "Weeks 3–4: the bounce comes back — skin springs off your finger", { tone: "teal", w: 3.0, eyebrow: "Result" }),
  ]},
  { key: "result3", phrase: "the third thing is the", beats: [
    es("03", "Week 8: your own collagen, quietly catching up", { tone: "teal", w: 3.0, eyebrow: "Result" }),
  ]},
  { key: "namegf", phrase: "i call it the green", beats: [
    fc([{ t: "THE", hl: true }, { t: "GREEN", hl: true }, { t: "FILLER." }, { t: "$2." }, { t: "At" }, { t: "night." }, { t: "Your" }, { t: "own" }, { t: "hands." }], { tone: "teal", at: "i call it the green" }),
  ]},
  // ░░ MECANISMO ░░
  { key: "science", phrase: "let me show you why it", beats: [
    c("talk", {}),
    r("al_federer_scoop", { at: "the clear jelly in the", kicker: "The clear inner gel — not the green skin" }),
  ]},
  { key: "poly", phrase: "these long ropey sugar", beats: [
    ak([{ word: "POLYSACCHARIDES", sub: "long sugar molecules (acemannan) that grab water and won't let go — a soft film that stops it evaporating overnight", tone: "teal", atPhrase: "these long ropey sugar" }], {}),
  ]},
  { key: "sameprinciple", phrase: "same principle as the injection", beats: [
    fc([{ t: "Same" }, { t: "principle." }, { t: "No" }, { t: "NEEDLE.", hl: true }], { tone: "teal", at: "same principle as the injection" }),
  ]},
  { key: "sliptest", phrase: "run a finger over the", beats: [
    ak([{ word: "THE SLIP TEST", sub: "slick, stringy, almost like raw egg white — that slipperiness IS the water-holding molecules; the bottle stuff has almost none", tone: "teal", atPhrase: "run a finger over the" }], {}),
  ]},
  { key: "fibro", phrase: "onto skin cells called fibroblasts", beats: [
    ak([{ word: "FIBROBLASTS = COLLAGEN FACTORIES", sub: "aloe sterols nudge them to build more collagen and your own hyaluronic acid — studies suggest", tone: "teal", atPhrase: "onto skin cells called fibroblasts" }], {}),
  ]},
  { key: "calm", phrase: "aloe calms things down", beats: [
    c("talk", {}),
    es("03", "It calms the low simmer of inflammation that breaks collagen down", { tone: "teal", w: 3.0, eyebrow: "Third job" }),
  ]},
  { key: "buildbreak", phrase: "build more break less", beats: [
    fc([{ t: "Build" }, { t: "MORE.", hl: true }, { t: "Break" }, { t: "LESS.", hl: true }], { tone: "teal", at: "build more break less" }),
  ]},
  // ░░ EL ERROR — pago del open loop ░░
  { key: "mistake", phrase: "the thing nine out of", beats: [
    c("talk", {}),
    es("!", "They reach for the BOTTLE — the bright-green store gel", { tone: "warn", w: 3.2, eyebrow: "The mistake" }),
    r("al_hook_greenbottle", { at: "the green gel in the", kicker: "Mostly water, dye — and drying alcohol" }),
  ]},
  { key: "bottlemyth", phrase: "carrying an ingredient whose entire", beats: [
    mv("Bottled green 'aloe gel' = aloe", "Mostly water, dye and drying ALCOHOL — it quietly dries your skin out", { flipPhrase: "quietly drying it out" }),
  ]},
  { key: "realthing", phrase: "the clear jelly scooped straight", beats: [
    r("al_hook_cleargel", { at: "the clear jelly scooped straight", kicker: "Clear — not green. Fresh from the leaf." }),
    r("al_federer_cut", { at: "not green clear and you", kicker: "Scoop the clear gel — leave the yellow layer" }),
  ]},
  // ░░ POR QUÉ DE NOCHE — firma del canal ░░
  { key: "whynight", phrase: "you do this at night", beats: [
    c("talk", {}),
    fc([{ t: "Why" }, { t: "at" }, { t: "NIGHT?", hl: true }], { tone: "teal", at: "you do this at night" }),
  ]},
  { key: "repairmode", phrase: "your skin does its repair", beats: [
    ak([{ word: "NIGHT = REPAIR MODE", sub: "water recovery ramps up, fibroblasts build, and the barrier leaks water fastest — right while you sleep", tone: "teal", atPhrase: "your skin does its repair" }], {}),
  ]},
  { key: "apply", phrase: "but if you put a", beats: [
    r("al_federer_apply", { at: "but if you put a", kicker: "A thin layer at night — then seal it in" }),
  ]},
  { key: "hourwindow", phrase: "during the exact window when", beats: [
    c("hourdial", { hour: 2, big: "1", unit: "window", label: "Hold the water in — during the night repair window.", tone: "gold" }),
  ]},
  // ░░ VILLANO COMERCIAL ░░
  { key: "villain", phrase: "there is an entire industry", beats: [
    c("talk", {}),
    c("bars", { title: "Sold a permanent problem", bars: [
      { label: "$700 syringe / 6 months", value: 70, tone: "danger", note: "the needle" },
      { label: "$90 'plumping' day cream", value: 45, tone: "danger", note: "sold to you" },
      { label: "$90 'plumping' night cream", value: 45, tone: "danger", note: "also sold to you" } ], at: "there is an entire industry" }),
  ]},
  { key: "fornothing", phrase: "for the price of nothing", beats: [
    fc([{ t: "One" }, { t: "plant." }, { t: "Two" }, { t: "of" }, { t: "three" }, { t: "jobs." }, { t: "For" }, { t: "NOTHING.", hl: true }], { tone: "teal", at: "for the price of nothing" }),
  ]},
  // ░░ ★ LÁMINA — valor puro, zoom por zona ░░
  { key: "lamina", phrase: "look at this this is", beats: [
    fz(LAM, { x: 0.5, y: 0.42, zoom: 1.15, label: "\"The Green Filler\" — one page", tone: "teal" }),
  ]},
  { key: "lam_steps", phrase: "see the three steps down", beats: [
    fz(LAM, { x: 0.57, y: 0.425, zoom: 2.0, label: "Harvest · Apply · Seal", tone: "teal" }),
  ]},
  { key: "lam_scoop", phrase: "you scoop out only the", beats: [
    fz(LAM, { x: 0.57, y: 0.34, zoom: 2.2, label: "Only the clear inner gel", tone: "teal" }),
  ]},
  { key: "lam_seal", phrase: "and this is the one", beats: [
    fz(LAM, { x: 0.57, y: 0.52, zoom: 2.2, label: "Seal it — a few drops of oil", tone: "teal" }),
  ]},
  { key: "lam_time", phrase: "look down here at the", beats: [
    fz(LAM, { x: 0.5, y: 0.71, zoom: 2.0, label: "Night 1 → Week 3 → Week 8", tone: "gold" }),
  ]},
  // ░░ ★ REVELAR QUE SALIÓ DE LA GUÍA ░░
  { key: "reveal_guide", phrase: "this is one page one", beats: [
    fz(REVEAL, { x: 0.5, y: 0.5, zoom: 1.06, label: undefined, tone: "teal" }),
  ]},
  { key: "reveal_hold", phrase: "if a single page can", beats: [
    fz(REVEAL, { x: 0.72, y: 0.55, zoom: 1.3, label: undefined, tone: "teal" }),
  ]},
  { key: "desc1", phrase: "leave the whole thing for", beats: [
    ge("The full guide → in the description", ["The exact amounts", "How many nights a week", "The sealing oil to pick", "The under-eye variation"], { at: "leave the whole thing for" }),
  ]},
  // ░░ ESCUDO DE HONESTIDAD ░░
  { key: "honesty", phrase: "let me tell you what this will", beats: [
    c("talk", {}),
    c("checklist", { title: "Be honest — what this will NOT do", eyebrow: "The honest truth", tone: "warn", stamp: "THE HONEST TRUTH", items: [
      { text: "Replace an injection for deep, structural volume loss", state: "warn" },
      { text: "Last without the habit — the first-week plump is water", state: "warn" },
      { text: "Suit everyone — patch-test; skip the yellow layer", state: "warn" },
      { text: "'Detox' anything — and no, no one's hiding it", state: "warn" },
      { text: "Replace your daytime sunscreen", state: "warn" } ], at: "let me tell you what this will" }),
  ]},
  { key: "patchtest", phrase: "you do a patch test", beats: [
    ak([{ word: "PATCH-TEST ON YOUR ARM FIRST", sub: "inside of the arm, wait a full day — red or itchy? this one isn't for you, and that's fine", tone: "warn", atPhrase: "you do a patch test" }], {}),
  ]},
  // ░░ PAGO DEL LOOP + RECAP ░░
  { key: "payloop", phrase: "clear thin sealed overnight", beats: [
    fc([{ t: "Clear." }, { t: "Thin." }, { t: "Sealed." }, { t: "OVERNIGHT.", hl: true }], { tone: "teal", at: "clear thin sealed overnight" }),
  ]},
  { key: "recap", phrase: "five steps so", beats: [
    ge("The Green Filler — 5 steps", ["1 · One fresh leaf — only the clear inner gel", "2 · A thin layer at night, on clean skin", "3 · Seal it with a few drops of plain oil", "4 · Leave it on all night; rinse at dawn", "5 · Stay consistent — give it eight weeks"], { at: "five steps so" }),
  ]},
  // ░░ 2ª ESTRATEGIA — descripción ░░
  { key: "desc2", phrase: "a variation of this that", beats: [
    c("talk", {}),
    lt("The under-eye variation → in the description", { kicker: "One more thing — on purpose", desc: "For the crepey, papery skin under the eyes and on the thinnest part of the neck, there's a gentler variation. I wrote it out step by step, right under the guide.", tone: "teal", at: "i put it in the description" }),
  ]},
  // ░░ CTA: comentario → teaser → suscripción → cierre ░░
  { key: "comment", phrase: "tell me in the comments", beats: [
    ak([{ word: "TELL ME WHERE YOU'RE WATCHING FROM", sub: "and — had anyone ever told you that filler is really just trapped water?", tone: "teal", atPhrase: "tell me in the comments" }], {}),
  ]},
  { key: "teaser", phrase: "a second plant a green", beats: [
    ak([{ word: "NEXT: THE GREEN PLANT FOR YOUR NECK", sub: "a second plant you already cook with — it firms crepey neck and chest skin through a completely different door", tone: "teal", atPhrase: "a second plant a green" }], {}),
  ]},
  { key: "cierre", phrase: "so that plant on the", beats: [
    c("nametag", { name: "Dr. Federer", role: "The gentlest, oldest little filler there is — waiting on the windowsill. Use it tonight.", image: "img/al_federer_leaf.png", at: "so that plant on the" }),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_aloefiller.json", "utf8").replace(/^﻿/, ""));
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
    beat.clip = `avatar_clips/aloefiller/${beat.id}.mp4`;
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
fs.writeFileSync("public/avatar_clips_aloefiller.json", JSON.stringify(KIT_CLIPS, null, 1));

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
fs.writeFileSync("src/_fed6/VideoEdit/aloefiller_beats.ts",
  `// AUTO-GENERADO por gen_aloefiller.mjs — beats (presenter IA al_federer_*.png + componentes data-driven).\n` +
  `export const ALOE_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/aloefiller_hooks.ts",
  `// AUTO-GENERADO por gen_aloefiller.mjs — rangos talk.\n` +
  `export const TALKSR: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/aloefiller.json", JSON.stringify({ video: "aloefiller", avatar: "aloefiller_opt.mp4", theme: "medico", beats }, null, 1));

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
