// gen_greenbotox.mjs — beatsheet "GREEN BOTOX (okra)" · canal EN "Dr. Federer | Holistic Health".
// Avatar greenbotox_opt.mp4 (~17:37). Guion ultra-humano EN. Material: STOCK Pexels (b-roll) +
// gpt-image-2 low SOLO para el presentador + infografías (lámina + 2 diagramas). Componentes REALES
// del kit _fed6. Pico de conversión = LÁMINA (freezezoom overview→columnas) → reveal guía + QR (guidecta).
import fs from "fs";

const SLUG = "greenbotox";
const r  = (name, o = {}) => ({ t: "raw", name, ...o });                                   // imagen (presenter/hero)
const c  = (kind, props = {}) => ({ t: kind, ...props });
const mv = (myth, truth, o = {}) => ({ t: "mitoverdad", myth, truth, ...o });
const fc = (words, o = {}) => ({ t: "frasecinetica", words, tone: o.tone || "teal", perWord: o.perWord || 10, ...o });
const ak = (items, o = {}) => ({ t: "avatarkeyword", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const lt = (title, o = {}) => ({ t: "lowerthird", title, tone: o.tone || "teal", ...o });
const es = (number, title, o = {}) => ({ t: "errorstinger", number, title, tone: o.tone || "teal", ...o });
const ge = (title, items, o = {}) => ({ t: "guardaesto", title, items, ...o });
const fz = (image, o = {}) => ({ t: "freezezoom", image, ...o });                          // image = ruta relativa a public
const gc = (o = {}) => ({ t: "guidecta", cover: "img/greenbotox_libro.jpg", qr: "med/greenbotox_qr.png", ...o });

const W = { raw: 1.4, talk: 1.0, stat: 1.05, checklist: 1.25, splitlist: 1.15, bars: 1.25, callout: 1.1, chips: 1.1,
  process: 2.7, annotated: 1.3, nametag: 1.3, errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6,
  avatarkeyword: 2.6, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 2.0, guidecta: 3.2 };

const HERO_STYLE = " Casual phone snapshot, real kitchen light, nothing polished, no AI look, low saturation, soft muted colors, natural hands. 16:9.";
const heroPrompts = [];            // gpt-image-2 low (presenter con ref + infografías)
const pushHero = (name, prompt, size) => heroPrompts.push(size ? { name, prompt, size } : { name, prompt });

// ── B-ROLL STOCK (Pexels): {name, query, atPhrase} — anclado por frase ──────────
const BROLL = [];
let bn = 0;
const broll = (query, atPhrase) => { BROLL.push({ name: `${SLUG}_b${String(++bn).padStart(2, "0")}`, query, atPhrase }); };

// ── SECCIONES (ancladas a frases REALES del guion/captions) ─────────────────────
const SECTIONS = [
  // ═══ HOOK ═══
  { key: "hook1", phrase: "slimy little green vegetable sitting", beats: [ c("talk", {}) ] },
  { key: "hook_needles", phrase: "No needles", beats: [
    fc([{ t: "NO" }, { t: "NEEDLES." }, { t: "NO" }, { t: "CLINIC.", hl: true }], { tone: "teal", at: "No clinic" }) ] },
  { key: "hook_iknow", phrase: "And I know", beats: [ c("talk", {}) ] },
  { key: "hook_notmiracle", phrase: "this is not going to erase", beats: [
    ak([{ word: "THIS IS NOT A MIRACLE", sub: "no honest doctor promises to erase 30 years overnight — but firmness is real", tone: "warn", atPhrase: "If anyone ever promises" }], {}) ] },
  { key: "hook_greenbotox", phrase: "people started calling it", beats: [
    lt("They call it “Green Botox”", { kicker: "Firmness, no needles", desc: "A tightening, lifting effect along the jaw and cheeks — from one humble green pod.", tone: "teal", at: "half as a joke" }) ] },
  { key: "hook_usingwrong", phrase: "using it the wrong way", beats: [
    fc([{ t: "USE" }, { t: "IT" }, { t: "RIGHT", hl: true }], { tone: "warn", at: "using it the right way" }) ] },

  // ═══ EL DOLOR: no son las arrugas, es la FIRMEZA ═══
  { key: "mirror", phrase: "Go find a mirror", beats: [ c("talk", {}) ] },
  { key: "shape", phrase: "stop looking at your wrinkles", beats: [ c("talk", {}),
    mv("Your wrinkles are what make you look older", "It’s the loss of FIRMNESS — the scaffolding underneath the skin softens and drifts down", { at: "Look at the shape", flipPhrase: "The problem is firmness" }) ] },
  { key: "trampoline", phrase: "like a trampoline", beats: [ c("talk", {}),
    fz("img/greenbotox_dg_trampoline.png", { x: 0.5, y: 0.5, zoom: 1.05, at: "pulled tight" }) ] },
  { key: "collagen_loss", phrase: "fast after menopause", beats: [
    c("stat", { w: 1.7, big: "30%", label: "of the skin’s collagen can be lost in the first 5 years after menopause", tone: "warn", at: "thirty percent" }) ] },

  // ═══ ELEANOR (prueba emocional) ═══
  { key: "eleanor", phrase: "one of my patients", beats: [
    r("greenbotox_desk", { at: "almost embarrassed", kicker: "A patient — I’ll call her Eleanor, 71", hold: true }) ] },
  { key: "eleanor_photo", phrase: "sent me a photo", beats: [
    lt("“I look like myself again.”", { kicker: "Eleanor — about two months later", desc: "No makeup, plain morning light. The edge of her jaw had come back — firmer, lifted, awake.", tone: "teal", at: "one line" }) ] },

  // ═══ POR QUÉ FALLAN CREMAS Y BOTOX ═══
  { key: "creams", phrase: "exactly why the creams", beats: [ c("talk", {}) ] },
  { key: "creams_roof", phrase: "basically dead cells", beats: [
    mv("A cream reaches the collagen that needs help", "Most of it sits on the top layer — dead cells, a roof. It can’t reach the living collagen in the dermis", { at: "shingled roof", flipPhrase: "cannot go down" }) ] },
  { key: "botox", phrase: "Botox does not tighten", beats: [
    ak([{ word: "BOTOX FREEZES A MUSCLE — IT DOESN’T LIFT", sub: "great for one frown line; it does nothing for that soft, deflated feeling", tone: "warn", atPhrase: "It does nothing" }], {}) ] },
  { key: "fillers", phrase: "the fillers that do add", beats: [
    c("bars", { w: 2.4, title: "What a “lift” really costs", unit: "", bars: [
      { label: "Fillers: needles every few months, a clinic each time", value: 100, tone: "danger", note: "$$$" },
      { label: "A pod of okra from the shop", value: 1, tone: "teal", note: "pennies" } ], at: "hundreds of dollars" }) ] },
  { key: "realq", phrase: "the only question that matters", beats: [
    fc([{ t: "WHAT" }, { t: "REACHES" }, { t: "THE" }, { t: "DEEP" }, { t: "LAYER?", hl: true }], { tone: "teal", at: "reach down into that deeper" }) ] },

  // ═══ LA REVELACIÓN: OKRA ═══
  { key: "okra_reveal", phrase: "okra the ladies", beats: [ c("talk", {}) ] },
  { key: "okra_slime", phrase: "That slime", beats: [
    r("greenbotox_slice", { at: "this clear, glossy gel", kicker: "The slime IS the secret", hold: true }) ] },
  { key: "okra_mucilage", phrase: "Scientists call it mucilage", beats: [ c("talk", {}),
    fz("img/greenbotox_dg_okra.png", { x: 0.5, y: 0.5, zoom: 1.05, at: "two things happen at once" }) ] },
  { key: "okra_two", phrase: "one it pulls moisture", beats: [
    c("splitlist", { w: 2.3, title: "Okra gel does two things at once", items: [
      "PULLS IN MOISTURE — plumps the surface, softens fine lines almost right away",
      "DRIES TO A TIGHTENING FILM — a gentle, needle-free lift you can actually feel" ], tone: "teal", at: "as that gel dries" }) ] },
  { key: "okra_vitc", phrase: "spark plug for making", beats: [ c("talk", {}),
    ak([{ word: "VITAMIN C = THE SPARK PLUG FOR COLLAGEN", sub: "your body cannot build a single new collagen fiber without it", tone: "teal", atPhrase: "non negotiable spark" }], {}) ] },
  { key: "okra_more", phrase: "vitamin K, folate", beats: [
    c("chips", { w: 1.6, title: "What’s packed inside okra", chips: ["Vitamin C", "Vitamin K", "Folate", "Antioxidants", "Flavonoids", "Mucilage gel"], tone: "teal", at: "load of antioxidants" }) ] },

  // ═══ POR QUÉ NADIE TE LO CONTÓ ═══
  { key: "why_none", phrase: "why has no one told me", beats: [ c("talk", {}) ] },
  { key: "no_money", phrase: "there is no money in it", beats: [
    ak([{ word: "NOBODY CAN PATENT A VEGETABLE", sub: "no $200 syringe, no jar with a French name — and pennies don’t buy advertising", tone: "warn", atPhrase: "buy advertising" }], {}) ] },

  // ═══ LOS 3 ERRORES ═══
  { key: "ruin", phrase: "this is exactly where people", beats: [ c("talk", {}) ] },
  { key: "mistakes", phrase: "the three quiet mistakes", beats: [
    c("checklist", { w: 2.7, title: "The 3 mistakes that make okra do nothing", tone: "warn", items: [
      { text: "Cooking it — heat destroys the vitamin C and breaks the gel. Use it RAW.", state: "warn" },
      { text: "Using it once, then quitting — firmness is built by repetition, not one night.", state: "warn" },
      { text: "Rinsing in two minutes — the gel needs time to dry into its tightening film.", state: "warn" } ], at: "Mistake one" }) ] },

  // ═══ LA RECETA ═══
  { key: "recipe_intro", phrase: "two simple pieces", beats: [ c("talk", {}) ] },
  { key: "recipe", phrase: "piece one is what", beats: [
    c("process", { w: 2.9, title: "The okra firmness routine", eyebrow: "Inside + outside", steps: [
      { title: "1 · Okra water", desc: "Slice a few fresh pods into a glass of room-temp water. Soak overnight; it turns silky. Drink on an empty stomach.", image: "img/greenbotox_glass.png" },
      { title: "2 · Okra gel", desc: "Scoop the raw gel from fresh pods. Thin layer on the face, 15–20 min, then rinse — 3–4 nights a week.", image: "img/greenbotox_gel.png" },
      { title: "3 · Consistency", desc: "Inside and outside, together, kept up for weeks. That combination is what they call green Botox.", image: "img/greenbotox_slice.png" } ], at: "what you drink" }) ] },

  // ═══ LÁMINA (PICO DE CONVERSIÓN) ═══
  { key: "lamina_intro", phrase: "pay attention to this next part", beats: [ c("talk", {}) ] },
  { key: "lamina_full", phrase: "This is the full firmness protocol", beats: [
    fz("img/greenbotox_lamina.png", { x: 0.5, y: 0.5, zoom: 1.04, w: 4.4, at: "the whole thing on one page" }) ] },
  { key: "lamina_left", phrase: "On the left", beats: [
    fz("img/greenbotox_lamina.png", { x: 0.17, y: 0.55, zoom: 1.9, label: "Okra water", w: 2.0, at: "how many pods" }) ] },
  { key: "lamina_mid", phrase: "In the middle", beats: [
    fz("img/greenbotox_lamina.png", { x: 0.5, y: 0.55, zoom: 1.9, label: "Okra gel + the step people skip", w: 2.0, at: "how thick to spread" }) ] },
  { key: "lamina_right", phrase: "look at the right side", beats: [
    fz("img/greenbotox_lamina.png", { x: 0.83, y: 0.42, zoom: 1.8, label: "The timeline", w: 2.0 }) ] },
  { key: "lamina_t1", phrase: "day one to three", beats: [
    fz("img/greenbotox_lamina.png", { x: 0.83, y: 0.42, zoom: 2.0, label: "Day 1–3: it tightens", w: 2.0 }) ] },
  { key: "lamina_t2", phrase: "week two to three", beats: [
    fz("img/greenbotox_lamina.png", { x: 0.83, y: 0.56, zoom: 2.0, label: "Week 2–3: hydrated", w: 2.0 }) ] },
  { key: "lamina_t3", phrase: "week six to eight", beats: [
    fz("img/greenbotox_lamina.png", { x: 0.83, y: 0.70, zoom: 2.0, label: "Week 6–8: real firmness", w: 2.0 }) ] },
  { key: "lamina_save", phrase: "Take a screenshot of this", beats: [
    fz("img/greenbotox_lamina.png", { x: 0.5, y: 0.5, zoom: 1.06, label: "SAVE THIS PAGE", w: 3.0 }) ] },

  // ═══ REVEAL: SALIÓ DE LA GUÍA + CTA/QR ═══
  { key: "guide_reveal", phrase: "This is a single page I pulled", beats: [
    gc({ title: "The Youthful Skin Method", kicker: "The complete guide", desc: "Exact measurements · the sensitive-skin version · the foods that rebuild collagen.", at: "the complete guide" }) ] },
  { key: "cta_desc", phrase: "point your camera", beats: [
    lt("Free guide — in the description", { kicker: "or scan the code on screen", desc: "docfederer.com", tone: "teal", at: "point your camera" }) ] },

  // ═══ SEGURIDAD + EXPECTATIVAS ═══
  { key: "safety", phrase: "who this is not for", beats: [ c("talk", {}) ] },
  { key: "safety_check", phrase: "do a patch test", beats: [
    c("checklist", { w: 2.6, title: "Do it safely", tone: "teal", items: [
      { text: "Patch-test first: a dab on the inner wrist, wait a full day, no redness or itch.", state: "done" },
      { text: "Allergic to okra? Then don’t — simple as that.", state: "done" },
      { text: "Anything changing, bleeding or growing on your skin → see your own doctor, in person.", state: "warn" } ], at: "inside of your wrist" }) ] },
  { key: "expect", phrase: "keep them honest", beats: [
    c("stat", { w: 1.6, big: "6–8 WEEKS", label: "for real, deeper firmness — it rewards the one who quietly keeps going", tone: "teal", at: "six to eight week" }) ] },
  { key: "consistency", phrase: "the small, simple thing", beats: [
    fc([{ t: "SMALL." }, { t: "SIMPLE." }, { t: "EVERY" }, { t: "DAY.", hl: true }], { tone: "teal", at: "consistently" }) ] },

  // ═══ INTRIGA RESERVADA A LA DESCRIPCIÓN ═══
  { key: "desc_tease", phrase: "There is a variation", beats: [ c("talk", {}),
    lt("The crepey-skin variation → in the description", { kicker: "thin, papery skin on hands & neck", desc: "Which oil, how much, and when — I left it right at the top of the description.", tone: "teal", at: "one particular oil" }) ] },

  // ═══ CIERRE ═══
  { key: "start", phrase: "please, just start", beats: [ c("talk", {}) ] },
  { key: "close", phrase: "Now you know the secret too", beats: [
    c("nametag", { name: "Dr. Federer", role: "Holistic Health — start tonight, do your patch test", image: "img/greenbotox_kitchen.png" }) ] },
];

// ── B-ROLL: queries de stock ancladas a frases (Pexels) ─────────────────────────
broll("sliced okra pods on a kitchen cutting board", "slimy little green vegetable");
broll("empty modern cosmetic clinic reception", "No clinic");
broll("older woman looking at her face in a bathroom mirror", "Go find a mirror");
broll("close up of an older woman jawline and cheek", "the edge of your jaw");
broll("older woman touching her face gently", "drifted down");
broll("woman looking through old photographs at home", "recognizing herself in photographs");
broll("woman applying moisturizer face cream fingertip", "beautiful little jars");
broll("cosmetic filler injection needle in a clinic", "needles, in your face");
broll("pile of fresh green okra pods on a market table", "okra the ladies");
broll("macro of cut okra showing sticky gel and seeds", "this clear, glossy gel");
broll("hand smoothing a clear gel onto skin", "as that gel dries");
broll("fresh oranges and lemons sliced citrus vitamin c", "spark plug for making");
broll("green leafy vegetables and okra flat lay", "load of antioxidants");
broll("hand putting coins into a jar of savings", "buy advertising");
broll("okra boiling in a pot of water on a stove", "they cook it");
broll("sliced okra soaking in a glass of water overnight", "silky and slightly thick");
broll("older woman with healthy glowing skin smiling", "looks incredible at seventy");
broll("close up of crepey papery skin on the back of a hand", "backs of the hands");
broll("hands slicing fresh okra pods with a knife", "Buy the pods");
broll("glass of water on a wooden kitchen table morning light", "glass of water");

// ── PROMPTS gpt-image-2 low: PRESENTADOR (auto-ref por \"doctor\") + INFOGRAFÍAS ──
pushHero("greenbotox_slice", "The same friendly older doctor from the reference photo, in his own home kitchen, slicing fresh green okra pods on a wooden board, a little clear gel visible on the knife, looking down at his hands, warm afternoon light." + HERO_STYLE);
pushHero("greenbotox_gel", "The same older doctor from the reference photo in his kitchen, holding a small glass bowl of clear okra gel, showing it toward the camera with a calm reassuring look, cutting board with okra behind." + HERO_STYLE);
pushHero("greenbotox_glass", "The same older doctor from the reference photo in his kitchen, holding up a glass of slightly cloudy okra water, sliced okra pods soaking on the counter, gentle morning light." + HERO_STYLE);
pushHero("greenbotox_desk", "The same older doctor from the reference photo, sitting at his consulting-room desk, listening warmly, a few notes and a plant nearby, soft indoor light, kind expression." + HERO_STYLE);
pushHero("greenbotox_kitchen", "The same older doctor from the reference photo standing in his kitchen, fresh okra pods and a glass of water on the counter in front of him, looking at the camera with a warm honest smile." + HERO_STYLE);
// Infografías (16:9) — mismo lenguaje de la lámina (crema/teal/brass)
pushHero("greenbotox_dg_trampoline", "A clean, premium educational diagram on warm cream paper, deep teal ink and brass gold accents, elegant serif title 'WHY SKIN GOES SLACK'. LEFT side labeled 'YOUNG' shows a taut springy net of woven fibers under a smooth skin surface, tight like a trampoline, small label 'firm collagen + elastin'. RIGHT side labeled 'AFTER 50' shows the same net gone loose and saggy, the surface drifting downward, small label 'collagen drops ~1% a year, faster after menopause'. A slim arrow between them. Minimal, correctly spelled short labels, no gibberish, no people, no photo. 16:9.", "1792x1008");
pushHero("greenbotox_dg_okra", "A clean, premium educational diagram on warm cream paper, deep teal ink and brass gold accents, elegant serif title 'HOW OKRA WORKS — INSIDE & OUTSIDE'. A simple skin cross-section on the right with two labeled layers: top 'surface' and deeper 'dermis — where collagen lives'. On the left, an okra pod sliced to show gel. Two brass arrows: one from the gel to the surface labeled 'gel: hydrates + tightening film', one from a small vitamin-C icon down into the dermis labeled 'vitamin C: builds new collagen'. Short correctly-spelled labels, no gibberish, no people. 16:9.", "1792x1008");

// ── escribir insumos ────────────────────────────────────────────────────────────
fs.mkdirSync("public/img", { recursive: true });
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync(`public/img/prompts_${SLUG}.json`, JSON.stringify(heroPrompts, null, 1));

// ── ANCLAJE POR FRASE (idéntico al template validado gen_federer18) ──────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) { if (CW[i].s < after) continue; let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; } if (ok) return CW[i].s; }
  return null;
};
const VIDEO_END = (CW[CW.length - 1]?.s || 1055) + 2;

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

// POST-PASS keyword + mitoverdad (anclaje interno de sub-momentos)
for (const beat of beats) {
  if (beat.kind === "avatarkeyword") {
    let last = 0;
    beat.items = (beat.items || []).map((it) => { let atF = 0; if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - beat.start) * 30)); } last = Math.max(last, atF); const { atPhrase, ...rest } = it; return { ...rest, at: atF }; });
    if (last > 300) { beat.items = beat.items.map((it, i) => ({ ...it, at: i * 90 })); last = (beat.items.length - 1) * 90; }
    beat.dur = +(Math.max(beat.dur, last / 30 + 2.8)).toFixed(2); // sin pre-cut: AvatarKeyword usa el opt.mp4 con avatarFrom
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) { const ms = findMs(beat.flipPhrase, beat.start - 1); const lastSafe = Math.round(beat.dur * 30) - 26; let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42); if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42); beat.flipAt = f; delete beat.flipPhrase; }
  if (beat.at) delete beat.at;
}

// clips del avatarkeyword (para el kit)
const KIT_CLIPS = beats.filter((b) => b.kind === "avatarkeyword").map((b) => ({ name: b.id, start: +b.start.toFixed(2), dur: +(b.dur + 0.4).toFixed(2) }));
fs.writeFileSync(`public/avatar_clips_${SLUG}.json`, JSON.stringify(KIT_CLIPS, null, 1));

// ── B-ROLL: anclar por frase + duración hasta el próximo b-roll (cap 6.5s) ───────
for (const b of BROLL) { const ms = findMs(b.atPhrase, 0); b.start = ms != null ? +ms.toFixed(2) : null; }
const brollA = BROLL.filter((b) => b.start != null).sort((a, b) => a.start - b.start);
for (let i = 0; i < brollA.length; i++) { const nx = i + 1 < brollA.length ? brollA[i + 1].start : VIDEO_END; brollA[i].dur = +Math.min(6.5, Math.max(3.2, nx - brollA[i].start - 0.2)).toFixed(2); }
fs.writeFileSync(`_${SLUG}_broll_plan.json`, JSON.stringify(brollA, null, 1));

// PISO DE DURACIÓN de componentes (aire para leer)
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
if (missing.length) console.log(`⚠ no ancladas (${missing.length}):`, missing.slice(0, 30));
console.log(`beats: ${beats.length} · dur: ${(beats[beats.length-1].start+beats[beats.length-1].dur).toFixed(0)}s · broll: ${brollA.length}`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`heroPrompts(gpt-image): ${heroPrompts.length}`);
