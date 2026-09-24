// gen_greenglove.mjs — beatsheet "The GREEN GLOVE (rosemary)" · canal EN "Dr. Federer | Holistic Health".
// Clon del molde validado gen_greenlift.mjs. Avatar greenglove_opt.mp4 (FlashHead Lite, ~17:28). Guion ultra-humano EN.
// Material: STOCK Pexels (b-roll) + gpt-image-2 low SOLO presentador. Láminas gpt-image = freezezoom LIMPIO.
// Pico = LÁMINA maestra "THE GREEN GLOVE PROTOCOL" → reveal guía + QR. Dolor = manchas en las manos.
import fs from "fs";

const SLUG = "greenglove";
const r  = (name, o = {}) => ({ t: "raw", name, ...o });
const c  = (kind, props = {}) => ({ t: kind, ...props });
const mv = (myth, truth, o = {}) => ({ t: "mitoverdad", myth, truth, ...o });
const fc = (words, o = {}) => ({ t: "frasecinetica", words, tone: o.tone || "teal", perWord: o.perWord || 10, ...o });
const ak = (items, o = {}) => ({ t: "avatarkeyword", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const ap = (items, o = {}) => ({ t: "avatarpizarra", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const cr = (cards, o = {}) => ({ t: "carousel", cards, ...o });
const lt = (title, o = {}) => ({ t: "lowerthird", title, tone: o.tone || "teal", ...o });
const fz = (image, o = {}) => ({ t: "freezezoom", image, ...o });
const gc = (o = {}) => ({ t: "guidecta", cover: "img/greenglove_libro.jpg", qr: "med/greenglove_qr.png", ...o });

const W = { raw: 1.4, talk: 1.0, stat: 1.05, checklist: 1.25, splitlist: 1.15, bars: 1.6, callout: 1.1, chips: 1.1,
  process: 2.7, annotated: 1.3, nametag: 1.3, errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6,
  avatarkeyword: 2.6, avatarpizarra: 3.6, carousel: 3.0, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 2.0, guidecta: 3.2 };

const BROLL = [];

// ── SECCIONES (ancladas a frases REALES de captions_greenglove.json) ─────────────
const SECTIONS = [
  // ═══ HOOK ═══
  { key: "hook1", phrase: "little green sprig", beats: [ c("talk", {}) ] },
  { key: "hook_sleep", phrase: "while you sleep", beats: [
    fc([{ t: "WHILE YOU" }, { t: "SLEEP." }, { t: "SEVEN" }, { t: "NIGHTS.", hl: true }], { tone: "teal", at: "seven nights" }) ] },
  { key: "hook_honest", phrase: "sell you magic", beats: [
    ak([{ word: "NOT MAGIC — JUST HOW SKIN WORKS", sub: "no honest doctor erases a twenty-year spot in a week — but the first change is real, and it comes fast", tone: "warn", atPhrase: "went spotty" }], {}) ] },

  // ═══ EL DOLOR: las manos te delatan ═══
  { key: "aged_first", phrase: "aged before the rest", beats: [ c("talk", {}) ] },
  { key: "humiliations", phrase: "the little things", beats: [
    lt("You catch them in every photo", { kicker: "The hands you cannot hide", desc: "Palm turned down at the store. Rings left in the drawer. Thin gloves in July.", tone: "teal", at: "palm up" }) ] },
  { key: "nobody", phrase: "nobody tells you", beats: [ c("talk", {}) ] },
  { key: "hands_first", phrase: "real reason", beats: [ c("talk", {}),
    ak([{ word: "REASON 1 — YOUR HANDS TAKE THE MOST SUN", sub: "years of sun on the backs of your hands; your face gets shade, your hands get none", tone: "warn", atPhrase: "more sun than" }], {}) ] },
  { key: "thin", phrase: "the second reason", beats: [
    mv("Age spots are just part of getting old", "The skin here is paper-thin, with no fat cushion — so the sun reaches the pigment cells directly", { at: "no fat cushion", flipPhrase: "no fat cushion" }) ] },
  { key: "lentigo", phrase: "solar lentigo", beats: [
    lt("A solar lentigo", { kicker: "the spot the sun gave you", desc: "Pigment cells stuck in the on position, dumping melanin into one cluster.", tone: "teal", at: "solar lentigo" }) ] },
  { key: "two_problems", phrase: "two problems", beats: [
    ak([{ word: "A SPOT IS TWO PROBLEMS", sub: "the brown melanin — plus a rusty, oxidized pigment called lipofuscin, stacked on top", tone: "warn", atPhrase: "coffee pot" }], {}) ] },

  // ═══ POR QUÉ FALLAN LAS CREMAS ═══
  { key: "creams", phrase: "why the creams do not", beats: [ c("talk", {}) ] },
  { key: "roof", phrase: "water and oil on top", beats: [
    mv("A fancy cream erases the spot", "It only sits on the surface as water and oil — the spot lives deeper, in the pigment layer", { at: "lives underneath", flipPhrase: "lives underneath" }) ] },
  { key: "tap", phrase: "turn off the tap", beats: [ c("talk", {}) ] },
  { key: "three_jobs", phrase: "three jobs", beats: [
    ap([
      { card: "A spot = 2 problems", sub: "brown pigment + rusty oxidation" },
      { card: "1 · Turn it down", sub: "quiet the pigment factory (tyrosinase)" },
      { card: "2 · Lift it up", sub: "shed the top, pigment-stuffed cells" },
      { card: "3 · Mop it out", sub: "neutralize the trapped oxidation" },
      { card: "All three — overnight", sub: "one green glove, while the skin is off duty" } ]) ] },

  // ═══ LA REVELACIÓN: ROMERO ═══
  { key: "reveal", phrase: "it is rosemary", beats: [
    lt("Rosemary", { kicker: "Rosmarinus officinalis", desc: "The kitchen herb — one of the most antioxidant-rich plants we have.", tone: "teal", at: "it is rosemary" }) ] },
  { key: "cost", phrase: "costs almost nothing", beats: [
    c("bars", { w: 2.4, title: "What fading spots usually costs", unit: "", bars: [
      { label: "Laser / clinic sessions", value: 100, tone: "danger", note: "$$$" },
      { label: "Fancy hand creams — jar after jar", value: 45, tone: "warn", note: "$$" },
      { label: "A sprig of rosemary + a spoon of yogurt", value: 2, tone: "teal", winner: true, note: "pennies" } ], at: "on a windowsill" }) ] },
  { key: "earn", phrase: "actually earn this", beats: [ c("talk", {}),
    r("greenglove_rosemary", { at: "inside a rosemary leaf", kicker: "What is actually inside the leaf", hold: true }) ] },
  { key: "rosmarinic", phrase: "rosmarinic acid", beats: [
    ak([{ word: "ROSMARINIC ACID — TURNS THE FACTORY DOWN", sub: "in the lab it slows tyrosinase, the enzyme that makes the melanin", tone: "teal", atPhrase: "slows it down" }], {}) ] },
  { key: "carnosic", phrase: "carnosic acid", beats: [
    ak([{ word: "CARNOSIC ACID — MOPS THE RUST", sub: "one of the most powerful antioxidants in any common plant; it clears the oxidation", tone: "teal", atPhrase: "the mop" }], {}) ] },
  { key: "one_plant", phrase: "one plant", beats: [ c("talk", {}) ] },

  // ═══ LA RECETA: EL GUANTE VERDE ═══
  { key: "glove_intro", phrase: "the green glove", beats: [
    cr([
      { image: "img/greenglove_crush.png", index: "1", name: "Crush the rosemary" },
      { image: "img/greenglove_mix.png", index: "2", name: "Mix into yogurt" },
      { image: "img/greenglove_wrap.png", index: "3", name: "Wrap and sleep" } ], { intro: true, at: "the green glove" }) ] },
  { key: "recipe", phrase: "here is what it is", beats: [
    c("process", { w: 2.9, title: "The green glove", eyebrow: "Overnight", steps: [
      { title: "1 · Crush", desc: "Crush fresh rosemary until it is almost a paste and you can smell it fill the room.", image: "img/greenglove_crush.png" },
      { title: "2 · Mix", desc: "Fold it into a spoonful of plain yogurt — a thick green paste.", image: "img/greenglove_mix.png" },
      { title: "3 · Frost + wrap", desc: "Spread over the backs of both hands, wrap loosely with cotton gloves, sleep, and rinse in the morning.", image: "img/greenglove_apply.png" } ], at: "crush it" }) ] },
  { key: "handmap", phrase: "frosting them", beats: [
    fz("img/greenglove_handmap.png", { x: 0.5, y: 0.5, zoom: 1.05, w: 2.2, at: "over the spots" }) ] },
  { key: "wrap", phrase: "why the wrap", beats: [ c("talk", {}),
    r("greenglove_wrap", { at: "eight hour treatment", kicker: "The wrap = an 8-hour treatment", hold: true }) ] },
  { key: "practical", phrase: "practical things", beats: [
    c("checklist", { w: 2.6, title: "Get it right", eyebrow: "SMALL DETAILS", tone: "teal", items: [
      { text: "Fresh rosemary is best; dried works too — use a little less and let it sit a few minutes.", state: "done" },
      { text: "Plain, slightly sour yogurt — that is the one with the lactic acid we want.", state: "done" },
      { text: "A thin, even green layer over the spots — a thick blob just slides off.", state: "done" } ], at: "fresh rosemary is better" }) ] },
  { key: "yogurt", phrase: "why the yogurt", beats: [
    ak([{ word: "LACTIC ACID — LIFTS THE OLD PIGMENT", sub: "the gentle acid in plain yogurt loosens the dead, pigment-stuffed cells so they let go", tone: "teal", atPhrase: "gently loosens" }], {}) ] },
  { key: "three_done", phrase: "all three jobs", beats: [
    fc([{ t: "TURN DOWN." }, { t: "LIFT UP." }, { t: "MOP OUT." }, { t: "ONE GLOVE.", hl: true }], { tone: "teal", at: "all three jobs" }) ] },
  { key: "overnight", phrase: "be a night", beats: [
    mv("Do it any time of day", "At night the pigment cells are calm — daytime sun would just undo the work", { at: "when the body is listening", flipPhrase: "no sunlight" }) ] },

  // ═══ PARA QUIÉN ES ═══
  { key: "whofor", phrase: "who this is really for", beats: [
    c("checklist", { w: 2.4, title: "Who this is for", eyebrow: "WHO THIS IS FOR", tone: "teal", items: [
      { text: "Light, newer spots → fast, happy results.", state: "done" },
      { text: "Dark, older spots → it still works, it just asks for weeks of patience.", state: "done" },
      { text: "Barely any yet → the best possible time to start.", state: "done" } ], at: "who this is really for" }) ] },

  // ═══ LÁMINA (PICO DE CONVERSIÓN) ═══
  { key: "lamina_intro", phrase: "close attention", beats: [ c("talk", {}) ] },
  { key: "lamina_full", phrase: "protocol on one page", beats: [
    fz("img/greenglove_lamina.png", { x: 0.5, y: 0.5, zoom: 1.05, w: 4.4, at: "on one page" }) ] },
  { key: "lamina_left", phrase: "on the left", beats: [
    fz("img/greenglove_lamina.png", { x: 0.20, y: 0.55, zoom: 1.85, label: "The glove", w: 2.2, at: "the rosemary the yogurt" }) ] },
  { key: "lamina_mid", phrase: "in the middle look", beats: [
    fz("img/greenglove_lamina.png", { x: 0.50, y: 0.55, zoom: 1.8, label: "Why it works", w: 2.6, at: "three different depths" }) ] },
  { key: "lamina_right", phrase: "on the right", beats: [
    fz("img/greenglove_lamina.png", { x: 0.82, y: 0.30, zoom: 1.7, label: "The honest timeline", w: 2.0, at: "honest timeline" }) ] },
  { key: "lamina_t1", phrase: "nights one and two", beats: [
    fz("img/greenglove_lamina.png", { x: 0.82, y: 0.30, zoom: 2.0, label: "Nights 1–2 · skin adjusts", w: 2.0 }) ] },
  { key: "lamina_t2", phrase: "three and four", beats: [
    fz("img/greenglove_lamina.png", { x: 0.82, y: 0.47, zoom: 2.0, label: "Nights 3–4 · brighter", w: 2.0 }) ] },
  { key: "lamina_t3", phrase: "five six and seven", beats: [
    fz("img/greenglove_lamina.png", { x: 0.82, y: 0.62, zoom: 2.0, label: "Nights 5–7 · edges soften", w: 2.0 }) ] },
  { key: "lamina_t4", phrase: "the deep spots", beats: [
    fz("img/greenglove_lamina.png", { x: 0.82, y: 0.78, zoom: 2.0, label: "Weeks 4–8 · deep spots fade", w: 2.4 }) ] },
  { key: "lamina_save", phrase: "that page again", beats: [
    fz("img/greenglove_lamina.png", { x: 0.5, y: 0.5, zoom: 1.06, label: "SAVE THIS PAGE", w: 2.6 }) ] },

  // ═══ REVEAL: SALIÓ DE LA GUÍA + CTA/QR ═══
  { key: "guide_reveal", phrase: "complete guide", beats: [
    gc({ title: "The Youthful Skin Method", kicker: "The complete guide", desc: "Exact grams · the wrap technique · the full eight-week calendar.", at: "complete guide" }) ] },
  { key: "cta", phrase: "scan the little code", beats: [
    lt("Free guide — in the description", { kicker: "or scan the code on screen", desc: "docfederer.com", tone: "teal", at: "top of the description" }) ] },

  // ═══ SEGURIDAD ═══
  { key: "warn_intro", phrase: "now the warnings", beats: [ c("talk", {}) ] },
  { key: "warn_check", phrase: "patch test", beats: [
    c("checklist", { w: 2.7, title: "Do it safely", eyebrow: "SAFETY FIRST", tone: "warn", items: [
      { text: "Patch-test first: a dab on the inner wrist, wait a few hours, no sting or redness.", state: "warn" },
      { text: "Never on broken skin. Rinse it off in the morning.", state: "warn" },
      { text: "In the morning, protect the backs of your hands from the sun — or you undo it.", state: "warn" },
      { text: "Pregnant, or a spot that is changing, itching or bleeding → see your doctor, in person.", state: "warn" } ], at: "patch test" }) ] },

  // ═══ INTRIGA RESERVADA A LA DESCRIPCIÓN ═══
  { key: "desc_tease", phrase: "stronger version", beats: [ c("talk", {}),
    lt("The stronger version → in the description", { kicker: "for stubborn, set-in spots", desc: "One extra ingredient + the press technique — right under the guide link.", tone: "teal", at: "in the description" }) ] },

  // ═══ CIERRE ═══
  { key: "close_do", phrase: "frost your hands", beats: [
    fc([{ t: "CRUSH." }, { t: "FROST." }, { t: "WRAP." }, { t: "SLEEP.", hl: true }], { tone: "teal", at: "frost your hands" }) ] },
  { key: "close", phrase: "belong to you again", beats: [
    c("nametag", { name: "Dr. Federer", role: "Holistic Health — start tonight, do your patch test", image: "img/greenglove_kitchen.png" }) ] },
];

// ── B-ROLL: queries de stock ancladas a frases (Pexels), broad para VIDEO real ────
const bv = (name, query, atPhrase) => BROLL.push({ name, query, atPhrase });
bv("greenglove_v01", "close up wrinkled elderly hands", "aged before the rest");
bv("greenglove_v02", "senior woman looking at her hands", "the little things");
bv("greenglove_v03", "older person hands resting on lap", "more sun than");
bv("greenglove_v04", "extreme close up skin texture pores macro", "no fat cushion");
bv("greenglove_v05", "woman applying hand cream", "water and oil on top");
bv("greenglove_v06", "fresh rosemary herb plant growing", "it is rosemary");
bv("greenglove_v07", "rosemary sprigs close up macro", "actually earn this");
bv("greenglove_v08", "mortar and pestle crushing herbs", "crush it");
bv("greenglove_v09", "bowl of plain yogurt with spoon", "plain yogurt");
bv("greenglove_v10", "hands with soft white cotton gloves", "wrap your hands");
bv("greenglove_v11", "older woman sleeping peacefully at night", "go to sleep");
bv("greenglove_v12", "applying sunscreen lotion on hands", "protect them");
bv("greenglove_v13", "shelf of cosmetic cream jars and bottles", "eighty dollar cream");
bv("greenglove_v14", "morning sunlight through a kitchen window", "belong to you again");
bv("greenglove_v15", "green herbs steeping in water bowl", "get them to sit");
bv("greenglove_v16", "older couple hands together warm", "held people");

// ── escribir insumos ────────────────────────────────────────────────────────────
fs.mkdirSync("public/img", { recursive: true });
fs.mkdirSync("public/broll", { recursive: true });

// ── ANCLAJE POR FRASE (idéntico al template validado gen_greenlift) ───────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) { if (CW[i].s < after) continue; let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; } if (ok) return CW[i].s; }
  return null;
};
const VIDEO_END = (CW[CW.length - 1]?.s || 1048) + 2;

let cursorSec = -1; const missing = [];
for (const sec of SECTIONS) {
  let ms = findMs(sec.phrase, cursorSec + 1);
  if (ms == null) { missing.push(sec.phrase); ms = cursorSec + 6; }
  sec.start = ms;
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
  const pin = sec.beats.map((b, i) => { if (i === 0) return start; const ph = b.at; if (!ph) return null; const ms = findMs(ph, start + 0.4); return ms != null && ms > start + 0.8 && ms < end - 1.2 ? ms : null; });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.2) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i); fixed.push(n);
  const startT = new Array(n);
  for (let f = 0; f < fixed.length - 1; f++) { const a = fixed[f], b = fixed[f + 1]; const ta = pin[a], tb = b === n ? end : pin[b]; let sw = 0; for (let i = a; i < b; i++) sw += ws[i]; let acc = ta; for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); } }
  sec.beats.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2); const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2); let dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`; const beat = { id, start: cursor, dur, key: sec.key };
    if (b.t === "talk") { beat.kind = "talk"; }
    else if (b.t === "raw") { beat.kind = "raw"; beat.src = `img/${b.name}.png`; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true; }
    else { beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur; beat.key = sec.key;
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it)); }
    beats.push(beat);
  });
}

for (const beat of beats) {
  if (beat.kind === "avatarpizarra") {
    const per = 165;
    beat.items = (beat.items || []).map((it, i) => { const { atPhrase, ...rest } = it; return { ...rest, at: i * per }; });
    beat.dur = +(((beat.items.length - 1) * per) / 30 + 4).toFixed(2);
  } else if (beat.kind === "avatarkeyword") {
    let last = 0;
    beat.items = (beat.items || []).map((it) => { let atF = 0; if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - beat.start) * 30)); } last = Math.max(last, atF); const { atPhrase, ...rest } = it; return { ...rest, at: atF }; });
    if (last > 300) { beat.items = beat.items.map((it, i) => ({ ...it, at: i * 90 })); last = (beat.items.length - 1) * 90; }
    beat.dur = +(Math.max(beat.dur, last / 30 + 2.8)).toFixed(2);
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) { const ms = findMs(beat.flipPhrase, beat.start - 1); const lastSafe = Math.round(beat.dur * 30) - 26; let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42); if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42); beat.flipAt = f; delete beat.flipPhrase; }
  if (beat.at) delete beat.at;
}

const KIT_CLIPS = beats.filter((b) => b.kind === "avatarkeyword").map((b) => ({ name: b.id, start: +b.start.toFixed(2), dur: +(b.dur + 0.4).toFixed(2) }));
fs.writeFileSync(`public/avatar_clips_${SLUG}.json`, JSON.stringify(KIT_CLIPS, null, 1));

for (const b of BROLL) { const ms = findMs(b.atPhrase, 0); b.start = ms != null ? +ms.toFixed(2) : null; }
const brollA = BROLL.filter((b) => b.start != null).sort((a, b) => a.start - b.start);
for (let i = 0; i < brollA.length; i++) { const nx = i + 1 < brollA.length ? brollA[i + 1].start : VIDEO_END; brollA[i].dur = +Math.min(6.5, Math.max(3.2, nx - brollA[i].start - 0.2)).toFixed(2); }
fs.writeFileSync(`_${SLUG}_broll_plan.json`, JSON.stringify(brollA, null, 1));

const COMPK = new Set(["stat","chips","splitlist","checklist","callout","bars","nametag","annotated","process","lowerthird","guardaesto","errorstinger","mitoverdad","frasecinetica","freezezoom","guidecta"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) { const i = compIx[k]; const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END; const capDur = nextComp - beats[i].start - 0.1; beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2); }

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync(`src/_fed6/VideoEdit/${SLUG}_beats.ts`, `export const GB_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync(`src/_fed6/VideoEdit/${SLUG}_hooks.ts`, `export const TALKS_GB: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", beats }, null, 1));

const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
if (missing.length) console.log(`⚠ no ancladas (${missing.length}):`, missing.slice(0, 40));
console.log(`beats: ${beats.length} · dur: ${(beats[beats.length-1].start+beats[beats.length-1].dur).toFixed(0)}s · broll: ${brollA.length}/${BROLL.length}`);
console.log("kinds:", JSON.stringify(kinds));
