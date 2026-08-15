// build_meat.mjs — Amish AVATAR (canal Amish Off-Grid Claudio), conservar CARNE sin heladera ("Better Than Jerky").
// CLIPS-first híbrido: consume los s_NN de _v3/meat_beats.json anclados al ms de Whisper.
// COLD-OPEN = TRAILER (regla amish): montaje rápido con VO del avatar + estampas de texto.
// AISLADO POR SLUG: broll/meat/ + img/meat/ (gotcha colisión carpeta compartida).
// Uso: node build_meat.mjs → beatsheet/meat.json + src/VideoEdit/avatar_meat.gen.ts
import fs from "fs";

const TOTAL = 1322.52;
const OPEN = 1.8;
const COLD_END = 48.0;
const OV = 0.5;

const HERO = ", casual documentary phone snapshot, rustic Amish smokehouse and farmhouse, warm dim light, natural, nothing polished, no AI look, low saturation, soft muted colors, natural hands, no text, no watermark";
const IMG_STYLE = HERO;
const hero = (id, prompt) => ({ name: `meat/${id}`, prompt: prompt + HERO });

// ── avatar a PANTALLA COMPLETA: aterriza tras el trailer, la historia de la faena, el cierre ──
const AV_FULL = [
  [48.0, 61.0],        // tras el trailer: el avatar "aterriza" con la tira de carne
  [868.4, 902.0],      // "let me tell you about hog-killing day" (la faena en lo del abuelo)
  [1250.0, TOTAL],     // CTA almanaque + tease #5 + cierre + sign-off
];

// ── COLD OPEN = TRAILER (1.8–48): cortes rápidos de los payoffs + estampas + 1 impact ──
const COLD_OPEN = [
  { id: "mt_h_smoke", start: 1.8, dur: 2.6, kind: "raw", src: "img/meat/mt_h_smoke.png", darken: 0,
    gen: { type: "image", ...hero("mt_h_smoke", "interior of a dim rustic Amish smokehouse with whole cured hams and dark strips of meat hanging on strings in the cool dark, thin blue woodsmoke") } },
  { id: "mt_h_biltong", start: 4.4, dur: 2.2, kind: "raw", src: "img/meat/mt_h_biltong.png", darken: 0,
    gen: { type: "image", ...hero("mt_h_biltong", "extreme macro of dark red-brown air-dried beef biltong strips hanging on a wire, rich and dense, dim warm light") } },
  { id: "mt_h_impact", start: 6.6, dur: 4.6, kind: "impact", image: "img/meat/mt_h_biltong.png",
    setup: "Hung since last winter.", impact: "Still good.", impactAccent: "good", hitAt: 2.0, boom: 0, darken: 0.42 },
  { id: "mt_h_hams", start: 11.2, dur: 2.8, kind: "raw", src: "img/meat/mt_h_hams.png", darken: 0,
    gen: { type: "image", ...hero("mt_h_hams", "rows of whole salt-cured hams and slabs of bacon hanging from hooks in a dark smoke shed, dim shaft of light") } },
  { id: "mt_h_key1", start: 14.0, dur: 3.8, kind: "keyphrase", text: "A whole year.", src: "img/meat/mt_h_key1.png", accent: "good", fontSize: 108,
    gen: { type: "image", ...hero("mt_h_key1", "a single cured ham glowing on a hook in a dim smokehouse, warm shaft of light") } },
  { id: "mt_h_salt", start: 17.8, dur: 2.6, kind: "raw", src: "img/meat/mt_h_salt.png", darken: 0,
    gen: { type: "image", ...hero("mt_h_salt", "weathered hands rubbing coarse white salt heavy onto a raw slab of pork belly on a wooden board") } },
  { id: "mt_h_hang", start: 20.4, dur: 2.6, kind: "raw", src: "img/meat/mt_h_hang.png", darken: 0,
    gen: { type: "image", ...hero("mt_h_hang", "dark strips of raw salted beef hung to dry on a wire in cool moving air, dim airy room") } },
  { id: "mt_h_key2", start: 23.0, dur: 3.8, kind: "keyphrase", text: "No fridge. No freezer.", src: "img/meat/mt_h_key2.png", accent: "cold", fontSize: 96,
    gen: { type: "image", ...hero("mt_h_key2", "a rustic Amish kitchen with no refrigerator, cured meat hanging in a cool pantry, dim window light") } },
  { id: "mt_h_freezer", start: 26.8, dur: 3.0, kind: "raw", src: "img/meat/mt_h_freezer.png", darken: 0,
    gen: { type: "image", ...hero("mt_h_freezer", "a chest freezer full of meat with the power out in a dark blackout, condensation, spoiling") } },
  { id: "mt_h_hog", start: 29.8, dur: 4.0, kind: "raw", src: "img/meat/mt_h_hog.png", darken: 0,
    gen: { type: "image", ...hero("mt_h_hog", "vintage sepia photograph of an Amish family on hog-killing day in late fall, crocks of salt, hanging meat, nostalgic, film grain") } },
  { id: "mt_h_spice", start: 33.8, dur: 3.0, kind: "raw", src: "img/meat/mt_h_spice.png", darken: 0,
    gen: { type: "image", ...hero("mt_h_spice", "coarse salt, cracked black pepper and toasted coriander seed pressed onto raw beef strips on a wooden board") } },
  { id: "mt_h_key3", start: 36.8, dur: 4.0, kind: "keyphrase", text: "Better than jerky.", src: "img/meat/mt_h_key3.png", accent: "good", fontSize: 100,
    gen: { type: "image", ...hero("mt_h_key3", "a hand holding up a dark rich strip of air-dried biltong, tender and beefy, dim warm light") } },
  { id: "mt_h_shelf", start: 40.8, dur: 3.4, kind: "raw", src: "img/meat/mt_h_shelf.png", darken: 0,
    gen: { type: "image", ...hero("mt_h_shelf", "a cool dark cellar with cured hams and crocks of salt pork and hanging dried meat, warm documentary light") } },
  { id: "mt_h_take", start: 44.2, dur: 3.8, kind: "raw", src: "img/meat/mt_h_take.png", darken: 0,
    gen: { type: "image", ...hero("mt_h_take", "weathered hands taking a dark strip of cured meat down off a string in a dim smokehouse, warm light") } },
];

// ── CLIPS = beats del cuerpo, desde _v3/meat_beats.json (s_NN ya en disco, aislados en meat/) ──
const BEATS_SRC = JSON.parse(fs.readFileSync("_v3/meat_beats.json", "utf8").replace(/^﻿/, ""));
const CLIPS = BEATS_SRC.map((b) => [ +(b.ms / 1000).toFixed(2), b.name, (b.queries && b.queries.length ? b.queries : [b.desc || b.phrase]), b.desc || b.phrase ]);
CLIPS.sort((a, b) => a[0] - b[0]);

const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const MINGAP = Number(process.env.MEAT_MINGAP) || 3.6;   // amish PAUSADO: ~6s medio en el cuerpo
const brollImg = (name) => { for (const e of ["jpg", "jpeg", "png"]) if (fs.existsSync(`public/broll/meat/${name}.${e}`)) return `broll/meat/${name}.${e}`; return null; };
const isReal = (name) => fs.existsSync(`public/broll/meat/${name}.mp4`) || !!brollImg(name);   // clip/foto real verificada = precioso
const clips = [];
let lastT = -99;
for (const c of CLIPS.filter((c) => !inFull(c[0]) && c[0] >= COLD_END - 1e-6)) {
  // los clips reales (stock verificado on-topic) NUNCA se descartan; el resto respeta MINGAP
  if (c[0] - lastT < MINGAP && !isReal(c[1])) continue;
  clips.push(c);
  lastT = c[0];
}

const have = (name) => fs.existsSync(`public/broll/meat/${name}.mp4`);
const imgSrc = (name) => { for (const e of ["png", "jpg", "jpeg", "webp"]) if (fs.existsSync(`public/img/meat/${name}.${e}`)) return `img/meat/${name}.${e}`; return null; };
const nClip = clips.filter((c) => have(c[1])).length;

const avStarts = AV_FULL.map(([s]) => s);
const bounds = [...clips.map((c) => c[0]), ...avStarts, TOTAL].sort((a, b) => a - b);
const nextBound = (t) => bounds.find((b) => b > t + 1e-6) ?? TOTAL;

const beats = clips.map(([t, name, query, concept]) => {
  const dur = +Math.min(nextBound(t) - t + OV, TOTAL - t).toFixed(2);
  if (have(name)) return { id: name, start: t, dur, kind: "raw", src: `broll/meat/${name}.mp4`, darken: 0 };
  const bi = brollImg(name);
  if (bi) return { id: name, start: t, dur, kind: "raw", src: bi, darken: 0 };
  const im = imgSrc(name);
  if (im) return { id: name, start: t, dur, kind: "raw", src: im, darken: 0 };
  const vq = Array.isArray(query) ? query[0] : query;
  return { id: name, start: t, dur, kind: "raw", src: `img/meat/${name}.png`, darken: 0, gen: { type: "image", name: `meat/${name}`, prompt: vq + IMG_STYLE } };
});

// reemplazar los beats del rango cold-open por el TRAILER bespoke
for (let i = beats.length - 1; i >= 0; i--) if (beats[i].start < COLD_END - 1e-6) beats.splice(i, 1);
beats.unshift(...COLD_OPEN);
beats.sort((a, b) => a.start - b.start);

// ── COMPONENTES amish (≥6 kinds distintos, ~40 para el density_gate) ──
const ck = (text, note) => (note ? { text, note, state: "done" } : { text, state: "done" });
const COMPONENTS = [
  // ── ENEMY / FIX (48–200) ──
  { t: 90, id: "cmp_methods", kind: "splitlist", palette: "G",
    title: "Three ways to keep meat a year", items: ["Salt — cure it hard and cold", "Smoke — hang it in the smokehouse", "Air-dry — biltong, better than jerky", "Bonus: potted under a cap of fat"] },
  { t: 128, id: "cmp_changeform", kind: "callout", hue: "amber", accent: "good",
    figure: "Change its form", eyebrow: "The whole trick", caption: "you don't keep meat fresh — nobody can. You turn it into a thing the rot can't live in",
    bg: "weathered hands packing a slab of pork in coarse salt in a wooden crock" },
  { t: 160, id: "cmp_enemy", kind: "callout", hue: "red", accent: "danger",
    figure: "Water · Warmth · Time", eyebrow: "The enemy", caption: "meat doesn't die of old age — it rots. Starve the rot of even one of these and it keeps",
    bg: "macro of raw meat with tiny life, cool dim light, ominous" },
  { t: 182, id: "cmp_saltpulls", kind: "callout", hue: "amber", accent: "good",
    figure: "Salt is thirsty", eyebrow: "Why it all works", caption: "salt pulls the water right out of the flesh and poisons the well besides — no water, no rot",
    bg: "coarse white salt drawing moisture from a piece of raw meat, macro" },
  // ── SALT (200–418) ──
  { t: 214, id: "cmp_salt", kind: "checklist", hue: "good", accent: "good",
    title: "The salt cure", eyebrow: "The foundation",
    items: [ck("Rub it heavy, all over, with coarse salt"), ck("Pack it in a crock, skin down"), ck("Keep it cold — cellar-cool, not frozen"), ck("About a week per two pounds thick")],
    bg: "hands rubbing coarse salt onto a ham, packed in a stoneware crock" },
  { t: 250, id: "cmp_drywet", kind: "splitlist", palette: "B",
    title: "Two ways with salt", items: ["Dry cure — ham, bacon, salt pork", "Wet cure — a strong cold brine", "Brine gives you corned beef", "Both drive the water out"] },
  { t: 290, id: "cmp_saltpork", kind: "stat", hue: "cold", accent: "good",
    value: 1, suffix: " year+", label: "a barrel of salt pork was survival — it flavored a whole winter of beans and greens", eyebrow: "Salt pork" },
  { t: 320, id: "cmp_thickness", kind: "stat", hue: "amber", accent: "good",
    value: 7, suffix: " days / 2 lb", label: "the old rule of thumb for how long the salt needs to reach the middle", eyebrow: "Dry cure" },
  { t: 345, id: "cmp_curingsalt", kind: "mistake", number: "!", eyebrow: "The one honest catch",
    title: "Use the curing salt", desc: "For long, low-air cures eaten uncooked — hams, bacon, dry sausage — use pink curing salt (a little nitrite), the exact small amount. It's your seatbelt against the poison you can't see. Don't skip it.",
    bg: "a small dish of pink curing salt beside coarse white salt on a board" },
  { t: 385, id: "cmp_saltwins", kind: "splitlist", palette: "G",
    title: "Why salt is the mother method", items: ["Pulls the water out, deep", "Takes the water's place in the flesh", "Rot gets no foothold", "Every other method sits on top of it"] },
  // ── SMOKE (418–547) ──
  { t: 428, id: "cmp_smoke", kind: "checklist", hue: "good", accent: "good",
    title: "Smoke — salt's partner", eyebrow: "Salt first, always",
    items: [ck("Salt it first to pull the water"), ck("Hang it in cool woodsmoke, days"), ck("The smoke dries the skin hard"), ck("A salted, cold-smoked ham hangs near a year")],
    bg: "cool woodsmoke rising around hams hanging in a dim smoke shed" },
  { t: 466, id: "cmp_coldhot", kind: "bars", hue: "amber", accent: "good", unit: "",
    title: "Cold smoke vs hot smoke", eyebrow: "Know the difference",
    bars: [{ label: "Cold smoke — keeps it", value: 365, display: "hangs a year", winner: true }, { label: "Hot smoke — eat it that week", value: 7, display: "cooked, spoils" }] },
  { t: 500, id: "cmp_smokedoes", kind: "splitlist", palette: "B",
    title: "Smoke does three things", items: ["Dries the surface into a hard skin", "Lays on its own preserving coat", "That deep dark flavor nothing else gives", "Then hang it in the cold"] },
  { t: 528, id: "cmp_shed", kind: "callout", hue: "amber", accent: "good",
    figure: "A humble shed", eyebrow: "It needn't be grand", caption: "an old barrel, a scrap-wood box, a board shed no bigger than an outhouse — with the fire set far off",
    bg: "a tiny weathered board smokehouse shed with a fire pit outside, dim light" },
  // ── BILTONG (547–723) ──
  { t: 560, id: "cmp_biltong", kind: "checklist", hue: "good", accent: "good",
    title: "Biltong — the one you came for", eyebrow: "No smoke, no heat, never cooked",
    items: [ck("Lean beef sliced along the grain"), ck("Douse in vinegar, salt it heavy"), ck("Coarse salt, black pepper, coriander"), ck("Hang in cool moving air, a few days")],
    bg: "raw beef strips doused in vinegar and coated in coarse salt and pepper on a board" },
  { t: 600, id: "cmp_vsjerky", kind: "bars", hue: "amber", accent: "good", unit: "",
    title: "Biltong vs jerky", eyebrow: "It's not close",
    bars: [{ label: "Store jerky — cooked hard", value: 1, display: "a salty board" }, { label: "Biltong — cured raw, air-dried", value: 3, display: "rich & tender", winner: true }] },
  { t: 640, id: "cmp_biltongwhy", kind: "callout", hue: "amber", accent: "good",
    figure: "Never cooked", eyebrow: "Why it works", caption: "salt pulls the water and sets the meat; the vinegar sours the surface so nothing can grow on it",
    bg: "dark biltong strips hanging on a wire in cool moving air" },
  { t: 675, id: "cmp_biltongkeep", kind: "stat", hue: "cold", accent: "good",
    value: 2, suffix: " months+", label: "how long biltong keeps in a cloth bag or jar, cool and dry, dried through", eyebrow: "The air-dried" },
  { t: 700, id: "cmp_notclose", kind: "splitlist", palette: "G",
    title: "Better than jerky", items: ["Never cooked — stays rich and beefy", "Tender enough to bite clean through", "A cheap cut, vinegar, and patience", "You'll never buy a bag again"] },
  // ── DETAILS (723–868) ──
  { t: 735, id: "cmp_cut", kind: "bars", hue: "amber", accent: "good", unit: "",
    title: "Which meat to dry", eyebrow: "Lean is your friend",
    bars: [{ label: "Lean muscle — round, loin", value: 3, display: "dries & keeps", winner: true }, { label: "Marbled fat", value: 1, display: "goes rancid" }] },
  { t: 770, id: "cmp_lean", kind: "chips", hue: "amber",
    title: "Best cuts to air-dry", chips: ["beef round", "loin", "trimmed lean", "silverside"],
    bg: "lean cuts of beef with the outside fat trimmed off on a wooden board" },
  { t: 795, id: "cmp_temp", kind: "callout", hue: "cold", accent: "good",
    figure: "Cool · Dry · Moving air", eyebrow: "The quiet thing", caption: "cure and dry in the cool — the old-timers butchered in late fall, when the world turned into a free walk-in cooler",
    bg: "cool late-autumn farm light, meat drying in a cold airy shed" },
  { t: 830, id: "cmp_confit", kind: "checklist", hue: "good", accent: "good",
    title: "Potting — sealed under fat", eyebrow: "The old bonus method",
    items: [ck("Cook the meat slow in its own fat"), ck("Pack it down into a crock"), ck("Pour fat over till it's drowned and sealed"), ck("Cool cellar — it keeps for months")],
    bg: "cooked meat packed in a stoneware crock sealed under a solid cap of white lard" },
  // ── SAFETY (957–1056) ──
  { t: 968, id: "cmp_safety", kind: "checklist", hue: "good", accent: "good",
    title: "The safety rules", eyebrow: "Keep them and you're safe",
    items: [ck("Keep it cool — cellar-cool, never summer heat"), ck("Enough salt; curing salt for long cures"), ck("Keep it clean — hands, crocks, knives"), ck("Look and smell before you eat")],
    bg: "clean hands, a clean crock and knife beside salted meat, cool light" },
  { t: 1008, id: "cmp_whendoubt", kind: "mistake", number: "!", eyebrow: "The rule you never break",
    title: "When in doubt, throw it out", desc: "Slimy, sour, a smell that says no, a fuzzy mold that isn't the good white bloom — you throw it out and don't argue with yourself. A cheap cut is not worth your health.",
    bg: "hands inspecting and smelling a piece of cured meat in dim light" },
  { t: 1035, id: "cmp_seatbelt", kind: "callout", hue: "amber", accent: "good",
    figure: "Wear the seatbelt", eyebrow: "The curing salt", caption: "the exact small amount the recipe gives — not less, which isn't safe, not more — against the one poison you can't see",
    bg: "a careful pinch of pink curing salt measured onto a scale" },
  // ── STAKES (1056–1118) ──
  { t: 1064, id: "cmp_freezer", kind: "callout", hue: "red", accent: "danger",
    figure: "The freezer owns you", eyebrow: "When the grid fails", caption: "three days of ice storm and a whole freezer of meat turns to garbage in the dark — a cured ham doesn't blink",
    bg: "a chest freezer of thawing meat in a dark blackout kitchen" },
  { t: 1088, id: "cmp_stakesbars", kind: "bars", hue: "amber", accent: "good", unit: "",
    title: "When the grid goes down", eyebrow: "Same storm",
    bars: [{ label: "Freezer full of meat", value: 1, display: "hundreds lost" }, { label: "Smokehouse & crock", value: 3, display: "keeps right through", winner: true }] },
  { t: 1104, id: "cmp_offgrid", kind: "stat", hue: "cold", accent: "good",
    value: 0, suffix: " / month", label: "what it costs to keep your family's meat off the grid — salt, vinegar, a cool dry corner", eyebrow: "Real security" },
  // ── RECAP / CLOSE (1118–1250) ──
  { t: 1126, id: "cmp_recap", kind: "checklist", hue: "good", accent: "good",
    title: "The three ways", eyebrow: "Do it this fall",
    items: [ck("Salt it — cure hard, cellar-cool & dark"), ck("Smoke it — cold smoke to keep, hot to eat"), ck("Air-dry it — biltong, better than jerky"), ck("Look & smell before every bite")],
    bg: "cured hams, a crock of salt pork and hanging biltong in a cool cellar" },
  { t: 1170, id: "cmp_pantry", kind: "splitlist", palette: "G",
    title: "A pantry on its own two feet", items: ["Herbs — seasoning every pot", "Onions — the start of every meal", "Tomatoes — August in a jar", "Meat — a whole supper, no freezer"] },
  { t: 1210, id: "cmp_almanac", kind: "callout", hue: "amber", accent: "good",
    figure: "The Plain Almanac", eyebrow: "Below this video", caption: "the whole pantry in order — the salting, the smoking, the drying, the cellar and the crocks — ninety old methods",
    bg: "an old vintage almanac book on a wooden table in warm smokehouse light" },
  // ── extra densidad (spread, ≥5 kinds/tramo, baja toma cruda) ──
  { t: 110, id: "cmp_neverbought", kind: "stat", hue: "amber", accent: "good",
    value: 0, suffix: "", label: "meat my great-grandparents ever refrigerated — they cured a whole winter, no plug in the wall", eyebrow: "The old way" },
  { t: 300, id: "cmp_saltjobs", kind: "splitlist", palette: "B",
    title: "What the salt does", items: ["Draws the water out through the flesh", "Soaks in and takes the water's place", "Makes the place too harsh for rot", "Your country ham, your salt pork"] },
  { t: 484, id: "cmp_smokekeep", kind: "stat", hue: "cold", accent: "good",
    value: 1, suffix: " year", label: "how long a salted, cold-smoked ham hangs in the cold and stays good", eyebrow: "Salt + smoke" },
  { t: 620, id: "cmp_biltongsteps", kind: "splitlist", palette: "B",
    title: "The whole of biltong", items: ["Vinegar, coarse salt, pepper, coriander", "Sit a few hours, turn it once", "Hang in cool moving air — never sun", "Dry it through to keep it long"] },
  { t: 760, id: "cmp_trimfat", kind: "callout", hue: "red", accent: "danger",
    figure: "Trim the fat", eyebrow: "For the long keepers", caption: "fat doesn't dry and it turns rancid over the months — dry your lean, and let the salt and smoke protect the ham",
    bg: "trimming the outer fat off a lean cut of beef with a knife" },
  { t: 850, id: "cmp_lawoffat", kind: "splitlist", palette: "G",
    title: "Same old law, dressed up in lard", items: ["Fat sealed tight keeps air away", "No air means no spoiling", "Cut down, take what you need", "Smooth the fat back, it holds"] },
  { t: 990, id: "cmp_crossed", kind: "stat", hue: "amber", accent: "good",
    value: 100, suffix: "s of yrs", label: "whole civilizations crossed oceans on salted meat — done right, it's one of the safest foods there is", eyebrow: "Proven" },
  { t: 1148, id: "cmp_built", kind: "splitlist", palette: "B",
    title: "Look what you've built", items: ["Seasoning, onions, tomatoes — and meat", "A whole supper in the dead of February", "No store, no freezer, no line from the road", "Out of the seasons, with salt and smoke"] },
  { t: 1230, id: "cmp_next", kind: "nextvideo", kicker: "Next time",
    title: "Keep meat not for months — but for YEARS",
    sub: "The little dark cake the old trappers carried across a whole continent. Folks refuse to believe it." },
  // ── densidad extra 2 (baja el % de toma cruda, sube componentes/min) ──
  { t: 145, id: "cmp_enemy3", kind: "chips", hue: "amber",
    title: "Starve any one of these", chips: ["water", "warmth", "time"],
    bg: "raw meat in cool dim light, macro" },
  { t: 232, id: "cmp_crock", kind: "callout", hue: "amber", accent: "good",
    figure: "Skin side down", eyebrow: "Packing the crock", caption: "lay it in a stoneware crock or a wooden box, cover it over in salt, and set it somewhere cellar-cold",
    bg: "a slab of pork packed skin-down in coarse salt in a stoneware crock" },
  { t: 366, id: "cmp_country", kind: "stat", hue: "cold", accent: "good",
    value: 6, suffix: " months+", label: "how long a firm, dry, salt-cured country ham keeps hung in the cold and the dark", eyebrow: "The country ham" },
  { t: 448, id: "cmp_smokewhat", kind: "chips", hue: "amber",
    title: "What goes in the smoke", chips: ["hams", "bacon", "sausage", "fish"],
    bg: "hams, bacon and sausage hanging together in a dim smoke shed" },
  { t: 516, id: "cmp_smokemistake", kind: "mistake", number: "!", eyebrow: "Keep it cool",
    title: "Cook it and it's not a keeper", desc: "Let the fire run hot and you've cooked the meat — and cooked meat spoils like cooked meat. Keep the smoke cool, the fire set far off, and it just dries and takes the smoke.",
    bg: "a low fire pit set well away from a smoke shed, thin cool smoke drawn in" },
  { t: 588, id: "cmp_biltongspice", kind: "chips", hue: "amber",
    title: "The old biltong cure", chips: ["coarse salt", "brown vinegar", "black pepper", "coriander"],
    bg: "coarse salt, brown vinegar, cracked pepper and coriander seed beside raw beef strips" },
  { t: 660, id: "cmp_biltongair", kind: "callout", hue: "cold", accent: "good",
    figure: "Cool moving air — never sun", eyebrow: "Where it hangs", caption: "a spare room, a pantry, a porch out of the weather with a little fan to stir the air — three days to a week",
    bg: "dark beef strips hanging on a wire with a small fan stirring the cool air" },
  { t: 748, id: "cmp_cutrule", kind: "callout", hue: "amber", accent: "good",
    figure: "Lean dries · fat protects", eyebrow: "The whole rule", caption: "trim the fat for the air-dried and the long-hung; leave it on the ham where salt and smoke guard it",
    bg: "a lean trimmed cut of beef beside a fatty salted ham on a board" },
  { t: 940, id: "cmp_potstat", kind: "stat", hue: "cold", accent: "good",
    value: 3, suffix: " months+", label: "how long meat keeps drowned and sealed under a solid cap of fat in a cool cellar", eyebrow: "Potted / confit" },
  { t: 1002, id: "cmp_bloom", kind: "callout", hue: "amber", accent: "good",
    figure: "Know the good bloom", eyebrow: "Look before you eat", caption: "a cured ham wears a white bloom that belongs; slimy, sour, or a fuzzy wrong mold does not — then out it goes",
    bg: "a cured ham with a natural white surface bloom in dim cellar light" },
  { t: 1074, id: "cmp_blackout", kind: "splitlist", palette: "B",
    title: "Three days without power", items: ["Freezer — meat thaws and spoils", "Cured ham — hangs on, unbothered", "Biltong — keeps right through", "Salt pork — blinks at nothing"] },
  { t: 1196, id: "cmp_recapchips", kind: "chips", hue: "amber",
    title: "Put up your meat this fall", chips: ["salt", "smoke", "air-dry", "pot it in fat"],
    bg: "cured hams, hanging biltong and a crock of salt pork in a cool cellar" },
];

let nComp = 0;
const placed = new Set();
for (const c of [...COMPONENTS].sort((a, b) => a.t - b.t)) {
  let idx = -1;
  for (let i = 0; i < beats.length; i++) { if (beats[i].start <= c.t + 0.01) { if (!placed.has(beats[i].id)) idx = i; } else break; }
  if (idx < 0) continue;
  const start = beats[idx].start;
  const D = 6.2;
  const { t, bg, kind, ...rest } = c;
  const ab = { id: c.id, start, dur: D, kind };
  delete rest.id;
  Object.assign(ab, rest);
  if (bg) { ab.image = `img/meat/${c.id}_bg.png`; ab.gen = { type: "image", name: `meat/${c.id}_bg`, prompt: bg + IMG_STYLE }; }
  let rm = 1;
  while (idx + rm < beats.length && beats[idx + rm].start < start + D - 0.05 && !placed.has(beats[idx + rm].id)) rm++;
  beats.splice(idx, rm, ab);
  placed.add(c.id);
  const next = beats[idx + 1];
  const nextAv = avStarts.filter((s) => s > start + 0.01).sort((a, b) => a - b)[0] ?? TOTAL;
  ab.dur = +(Math.min(next ? next.start : TOTAL, nextAv, start + 7.5) - start).toFixed(2);
  nComp++;
}

// ── TILING FINAL: cero pantallas vacías ──
beats.sort((a, b) => a.start - b.start);
const avStartsAll = AV_FULL.map(([s]) => s);
for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
  const avAfter = avStartsAll.filter((s) => s > b.start + 1e-6).sort((x, y) => x - y)[0] ?? Infinity;
  let end = Math.min(nextStart, TOTAL);
  if (avAfter < end) end = avAfter;
  const ov = b.kind === "raw" ? OV : 0;
  b.dur = +(Math.max(0.2, Math.min(end + ov, TOTAL) - b.start)).toFixed(2);
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/meat.json", JSON.stringify({ video: "meat", avatar: "meat_opt.mp4", clipsfirst: true, beats }, null, 2));

// ── ventanas de avatar: full en [0,firstHero) + AV_FULL; PiP rotando el resto ──
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = [];
let k = 0;
for (let i = 0; i < beats.length; i++) {
  if (beats[i].start >= COLD_END && i % 6 === 3) { pip.push([beats[i].start, beats[i].start + Math.min(beats[i].dur, 7), POS[k % POS.length]]); k++; }
}
const firstHero = COLD_OPEN.length ? COLD_OPEN[0].start : OPEN;
const modeAt = (t) => {
  if (t < firstHero - 1e-6) return "full";
  if (AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6)) return "full";
  const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
  return p ? p[2] : "hidden";
};
const pts = [...new Set([0, firstHero, ...AV_FULL.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = [];
let cur = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });

const avTs = `// avatar_meat.gen.ts — GENERADO por build_meat.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_MEAT = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`;
fs.writeFileSync("src/VideoEdit/avatar_meat.gen.ts", avTs);

const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0) + firstHero;
console.log(`=== build_meat ===`);
console.log(`beats: ${beats.length} · clips reales: ${nClip} · imágenes: ${beats.length - nClip} · componentes: ${nComp}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP: ${pip.length} · windows: ${windows.length}`);
console.log(`dur min/max: ${Math.min(...beats.map((b) => b.dur))}s / ${Math.max(...beats.map((b) => b.dur))}s`);
