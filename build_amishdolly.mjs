// build_amishdolly.mjs — Amish AVATAR (canal claudio yoder / @claudioyoder-amish).
// Tema: la plataforma rodante de madera de 4 ruedas ("A 65-Year-Old Amish Genius Invention Shocked Engineers").
// CLIPS-first híbrido: consume los s_NN de _v3/amishdolly_beats.json anclados al ms de Whisper.
// COLD-OPEN = TRAILER (regla amish): cortes rápidos de los payoffs + estampas de texto + VO del avatar.
// AISLADO POR SLUG: broll/amishdolly/ + img/amishdolly/. QR en esquina en las CTAs (QR_WINDOWS).
// Uso: node build_amishdolly.mjs → beatsheet/amishdolly.json + src/VideoEdit/avatar_amishdolly.gen.ts
import fs from "fs";

const TOTAL = 1084.42;
const OPEN = 1.8;
const COLD_END = 44.0;
const OV = 0.5;

const HERO = ", casual documentary phone snapshot, rustic Amish workshop and barn, warm dim window light, natural, nothing polished, no AI look, low saturation, soft muted colors, natural weathered hands, no text, no watermark";
const IMG_STYLE = HERO;
const hero = (id, prompt) => ({ name: `amishdolly/${id}`, prompt: prompt + HERO });

// ── avatar a PANTALLA COMPLETA: aterriza tras el trailer, la anécdota, la CTA del almanaque, el cierre ──
const AV_FULL = [
  [44.0, 62.0],          // tras el trailer: "it's a board... a piece of wood and four wheels"
  [104.0, 158.0],        // la anécdota "it only ever wanted to roll"
  [626.0, 672.0],        // "a whole way of living" + CTA-2 el almanaque
  [1006.0, TOTAL],       // cierre: genius invention + tease ram pump + CTA-3 + "scan the code" + sign-off
];

// ── QR del almanaque en esquina durante las 3 CTAs (la última, más grande) ──
const QR_WINDOWS = [
  { start: 378.0, end: 396.0, big: false },   // CTA-1 seed
  { start: 648.0, end: 672.0, big: false },   // CTA-2 almanaque
  { start: 1030.0, end: TOTAL, big: true },   // CTA-3 cierre + "scan the square code"
];

// ── COLD OPEN = TRAILER (1.8–44): cortes rápidos de los payoffs + 3 estampas + 1 impact ──
const COLD_OPEN = [
  { id: "ad_h_dolly", start: 1.8, dur: 2.6, kind: "raw", src: "img/amishdolly/ad_h_dolly.png", darken: 0,
    gen: { type: "image", ...hero("ad_h_dolly", "a low thick handmade wooden rolling dolly with four black swivel caster wheels sitting on a barn workshop floor") } },
  { id: "ad_h_freezer", start: 4.4, dur: 2.4, kind: "raw", src: "img/amishdolly/ad_h_freezer.png", darken: 0,
    gen: { type: "image", ...hero("ad_h_freezer", "an older Amish man's two fingers pushing a big loaded chest freezer that glides on a low wooden dolly across a concrete barn floor") } },
  { id: "ad_h_impact", start: 6.8, dur: 4.4, kind: "impact", image: "img/amishdolly/ad_h_freezer.png",
    setup: "Four hundred pounds.", impact: "Two fingers.", impactAccent: "good", hitAt: 2.0, boom: 0, darken: 0.42 },
  { id: "ad_h_casters", start: 11.2, dur: 2.4, kind: "raw", src: "img/amishdolly/ad_h_casters.png", darken: 0,
    gen: { type: "image", ...hero("ad_h_casters", "extreme close-up of four black swivel caster wheels on the corners of a wooden platform, spinning, steel plates, rubber tread") } },
  { id: "ad_h_key1", start: 13.6, dur: 3.4, kind: "keyphrase", text: "One man. Alone.", src: "img/amishdolly/ad_h_key1.png", accent: "good", fontSize: 104,
    gen: { type: "image", ...hero("ad_h_key1", "an older Amish man in suspenders and straw hat rolling a heavy load alone on a wooden dolly in a barn, calm and easy") } },
  { id: "ad_h_barrel", start: 17.0, dur: 2.6, kind: "raw", src: "img/amishdolly/ad_h_barrel.png", darken: 0,
    gen: { type: "image", ...hero("ad_h_barrel", "a full fifty-five gallon rain barrel of water rolling on a low wooden dolly across a farmyard, weathered hands guiding it") } },
  { id: "ad_h_anvil", start: 19.6, dur: 2.4, kind: "raw", src: "img/amishdolly/ad_h_anvil.png", darken: 0,
    gen: { type: "image", ...hero("ad_h_anvil", "a heavy black cast iron anvil sitting on a low wooden rolling dolly in a dim workshop") } },
  { id: "ad_h_key2", start: 22.0, dur: 3.6, kind: "keyphrase", text: "A board and four wheels.", src: "img/amishdolly/ad_h_key2.png", accent: "cold", fontSize: 88,
    gen: { type: "image", ...hero("ad_h_key2", "a plain thick wooden board with four caster wheels bolted to the corners, laid on a workbench, honest and simple") } },
  { id: "ad_h_child", start: 25.6, dur: 3.0, kind: "raw", src: "img/amishdolly/ad_h_child.png", darken: 0,
    gen: { type: "image", ...hero("ad_h_child", "a young Amish boy easily pushing a heavy cast iron wood stove across a barn floor on a wooden dolly, grown men watching amazed") } },
  { id: "ad_h_engineer", start: 28.6, dur: 3.2, kind: "raw", src: "img/amishdolly/ad_h_engineer.png", darken: 0,
    gen: { type: "image", ...hero("ad_h_engineer", "a modern engineer with a clipboard staring in disbelief at a simple wooden rolling dolly, shaking his head") } },
  { id: "ad_h_impact2", start: 31.8, dur: 4.2, kind: "impact", image: "img/amishdolly/ad_h_dolly.png",
    setup: "It shouldn't work that well.", impact: "But it does.", impactAccent: "good", hitAt: 2.1, boom: 0, darken: 0.42 },
  { id: "ad_h_notch", start: 36.0, dur: 2.6, kind: "raw", src: "img/amishdolly/ad_h_notch.png", darken: 0,
    gen: { type: "image", ...hero("ad_h_notch", "close-up of a curved hand-notch cut into the front edge of a thick wooden dolly deck, fingers hooking into it") } },
  { id: "ad_h_key3", start: 38.6, dur: 3.4, kind: "keyphrase", text: "Genius. And it's homemade.", src: "img/amishdolly/ad_h_key3.png", accent: "good", fontSize: 92,
    gen: { type: "image", ...hero("ad_h_key3", "a finished handmade wooden rolling dolly on a workbench beside a hand saw and a box of caster wheels, warm shop light") } },
  { id: "ad_h_stack", start: 42.0, dur: 2.0, kind: "raw", src: "img/amishdolly/ad_h_stack.png", darken: 0,
    gen: { type: "image", ...hero("ad_h_stack", "weathered hands rolling a heavy stack of firewood on a low wooden dolly across a barn floor, easy motion") } },
];

// ── CLIPS = beats del cuerpo, desde _v3/amishdolly_beats.json (anclados al ms de Whisper) ──
const BEATS_SRC = JSON.parse(fs.readFileSync("_v3/amishdolly_beats.json", "utf8").replace(/^﻿/, ""));
const CLIPS = BEATS_SRC.map((b) => [ +(b.ms / 1000).toFixed(2), b.name, (b.queries && b.queries.length ? b.queries : [b.desc || b.phrase]), b.desc || b.phrase ]);
CLIPS.sort((a, b) => a[0] - b[0]);

const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const MINGAP = Number(process.env.AD_MINGAP) || 3.6;   // amish PAUSADO: ~6s medio en el cuerpo
const brollImg = (name) => { for (const e of ["jpg", "jpeg", "png"]) if (fs.existsSync(`public/broll/amishdolly/${name}.${e}`)) return `broll/amishdolly/${name}.${e}`; return null; };
const isReal = (name) => fs.existsSync(`public/broll/amishdolly/${name}.mp4`) || !!brollImg(name);
const clips = [];
let lastT = -99;
for (const c of CLIPS.filter((c) => !inFull(c[0]) && c[0] >= COLD_END - 1e-6)) {
  if (c[0] - lastT < MINGAP && !isReal(c[1])) continue;
  clips.push(c);
  lastT = c[0];
}

const have = (name) => fs.existsSync(`public/broll/amishdolly/${name}.mp4`);
const imgSrc = (name) => { for (const e of ["png", "jpg", "jpeg", "webp"]) if (fs.existsSync(`public/img/amishdolly/${name}.${e}`)) return `img/amishdolly/${name}.${e}`; return null; };
const nClip = clips.filter((c) => have(c[1])).length;

const avStarts = AV_FULL.map(([s]) => s);
const bounds = [...clips.map((c) => c[0]), ...avStarts, TOTAL].sort((a, b) => a - b);
const nextBound = (t) => bounds.find((b) => b > t + 1e-6) ?? TOTAL;

const beats = clips.map(([t, name, query, concept]) => {
  const dur = +Math.min(nextBound(t) - t + OV, TOTAL - t).toFixed(2);
  if (have(name)) return { id: name, start: t, dur, kind: "raw", src: `broll/amishdolly/${name}.mp4`, darken: 0 };
  const bi = brollImg(name);
  if (bi) return { id: name, start: t, dur, kind: "raw", src: bi, darken: 0 };
  const im = imgSrc(name);
  if (im) return { id: name, start: t, dur, kind: "raw", src: im, darken: 0 };
  const vq = Array.isArray(query) ? query[0] : query;
  return { id: name, start: t, dur, kind: "raw", src: `img/amishdolly/${name}.png`, darken: 0, gen: { type: "image", name: `amishdolly/${name}`, prompt: (concept || vq) + IMG_STYLE } };
});

// reemplazar los beats del rango cold-open por el TRAILER bespoke
for (let i = beats.length - 1; i >= 0; i--) if (beats[i].start < COLD_END - 1e-6) beats.splice(i, 1);
beats.unshift(...COLD_OPEN);
beats.sort((a, b) => a.start - b.start);

// ── COMPONENTES amish (8 kinds distintos, ~38 para el density_gate) ──
const ck = (text, note) => (note ? { text, note, state: "done" } : { text, state: "done" });
const COMPONENTS = [
  // ── HOOK / REVEAL (44–200) ──
  { t: 95, id: "cmp_shouldnt", kind: "callout", hue: "amber", accent: "good",
    figure: "That should not work", eyebrow: "The engineer's reaction", caption: "a real engineer stood there shaking his head — a board and four wheels moving what four men couldn't",
    bg: "a modern engineer with a clipboard staring in disbelief at a plain wooden rolling dolly in a barn" },
  { t: 128, id: "cmp_load", kind: "stat", hue: "amber", accent: "good",
    value: 400, suffix: " lb", label: "a loaded chest freezer rolling under one hand, two fingers — like it's an empty box", eyebrow: "One man moves" },
  { t: 155, id: "cmp_wanted", kind: "splitlist", palette: "G",
    title: "It only ever wanted to roll", items: ["Four grown men couldn't budge the stove", "The old man slid a board under it", "A ten-year-old pushed it across the barn", "You were trying to carry it — it wanted to roll"] },
  { t: 180, id: "cmp_madeof", kind: "chips", hue: "amber",
    title: "The whole genius invention", chips: ["one thick board", "four swivel wheels", "sixteen bolts", "a hand-notch"],
    bg: "a plain thick wooden board with four caster wheels and a handful of bolts laid out on a workbench" },
  // ── PHYSICS (200–395) ──
  { t: 213, id: "cmp_dragroll", kind: "callout", hue: "amber", accent: "good",
    figure: "Drag vs. Roll", eyebrow: "The one question", caption: "sliding, you fight the whole weight pressed flat on the floor; rolling, you only ever fight the little wheel",
    bg: "split idea of a heavy crate dragging flat on a floor beside the same crate on wheels, dim workshop" },
  { t: 238, id: "cmp_dragbars", kind: "bars", hue: "amber", accent: "good", unit: " lb",
    title: "Force to move 400 lb", eyebrow: "Slide it vs roll it",
    bars: [{ label: "Drag it flat", value: 300, display: "you can't budge it" }, { label: "Roll it on casters", value: 6, display: "two fingers", winner: true }] },
  { t: 268, id: "cmp_neverdrag", kind: "splitlist", palette: "B",
    title: "A wheel never drags", items: ["A flat load grabs the floor across its whole face", "A wheel touches one tiny spot", "It rolls that spot on and picks up a fresh one", "So you fight the wheel — not the weight"] },
  { t: 300, id: "cmp_100x", kind: "stat", hue: "cold", accent: "good",
    value: 100, suffix: "× easier", label: "on good casters and a smooth floor, rolling beats dragging by about a hundred to one — not twice, a hundred times", eyebrow: "Roll vs drag" },
  { t: 318, id: "cmp_suitcase", kind: "callout", hue: "amber", accent: "good",
    figure: "You already know this", eyebrow: "Everyday proof", caption: "the same packed suitcase — add two little wheels and a child tows it, humming. Nothing changed but where the weight meets the ground",
    bg: "a heavy packed suitcase with two small wheels being towed easily, plain floor" },
  { t: 348, id: "cmp_floorchips", kind: "chips", hue: "amber",
    title: "Where it rolls like a dream", chips: ["concrete", "wood floor", "tile", "smooth barn floor"],
    bg: "a smooth concrete barn floor with a wooden dolly rolling across it, warm light" },
  { t: 368, id: "cmp_rough", kind: "mistake", number: "!", eyebrow: "On rough ground",
    title: "Size up the wheels", desc: "On soft dirt, thick gravel or deep grass small wheels sink in and it fights you. A big wheel rolls over the bump a little one falls into — go bigger for rough ground.",
    bg: "a wooden cart with large wheels crossing soft dirt and gravel outdoors, dim light" },
  // ── THE WHEELS (395–540) ──
  { t: 405, id: "cmp_fourswivel", kind: "callout", hue: "amber", accent: "good",
    figure: "All four swivel — not two", eyebrow: "The old-timer's choice", caption: "two fixed wheels only go straight; four swivel casters turn a quarter-ton in place with your pinky",
    bg: "four black swivel caster wheels on a wooden platform, all turned different ways, close-up" },
  { t: 432, id: "cmp_swivelwhy", kind: "splitlist", palette: "G",
    title: "Why all-swivel wins", items: ["Turn it in place, any direction", "No steering, no fighting", "Back it neatly into a corner", "Spin a quarter-ton with one finger"] },
  { t: 452, id: "cmp_rating", kind: "callout", hue: "amber", accent: "good",
    figure: "Read the stamped number", eyebrow: "Every caster has one", caption: "the load rating is printed right on the wheel — and the math almost everyone does is the math that gets them hurt",
    bg: "close-up of a weight rating number stamped into the steel plate of a black caster wheel" },
  { t: 472, id: "cmp_divide", kind: "mistake", number: "÷4", eyebrow: "The mistake that snaps",
    title: "Don't divide by four", desc: "A load never sits evenly on all four wheels. Cross a threshold or a pebble and for one second three come up light and one carries almost everything. That's the second it lets go.",
    bg: "a loaded wooden dolly tilting over a door threshold, one caster taking all the weight" },
  { t: 492, id: "cmp_third", kind: "callout", hue: "cold", accent: "good",
    figure: "⅓ of the whole load — each", eyebrow: "The rule that keeps you safe", caption: "size every single wheel to hold at least a third of the total, not a quarter. Overbuild it. Wheels are cheap; your feet are not",
    bg: "four heavy-duty caster wheels lined up on a workbench beside a wooden deck" },
  { t: 513, id: "cmp_low", kind: "callout", hue: "amber", accent: "good",
    figure: "Low & centered", eyebrow: "The invisible genius", caption: "the lower the deck rides, the less a tall load wants to tip — keep the weight low and centered and it rolls all day without a wobble",
    bg: "a very low wooden rolling dolly deck riding just two inches off a barn floor, side view" },
  { t: 528, id: "cmp_deckbars", kind: "bars", hue: "amber", accent: "good", unit: "",
    title: "Deck height", eyebrow: "Low wins",
    bars: [{ label: "Low deck", value: 3, display: "stable, won't tip", winner: true }, { label: "Tall base", value: 1, display: "tips on a turn" }] },
  // ── NOTCH / THE INVENTION (540–578) ──
  { t: 544, id: "cmp_notch", kind: "callout", hue: "amber", accent: "good",
    figure: "The notch", eyebrow: "You can't see why till you use it", caption: "a hand-hold cut in the front edge — to hook your fingers or a strap, nudge it to start, ease it down off a threshold nice and slow",
    bg: "a curved hand-notch cut into the front edge of a thick wooden dolly deck, fingers hooking in" },
  { t: 566, id: "cmp_invention", kind: "checklist", hue: "good", accent: "good",
    title: "The whole invention", eyebrow: "That's it — that's the genius",
    items: [ck("A low, thick hardwood slab"), ck("Four swivel wheels — each a third of the load"), ck("Bolted through with washers and lock nuts"), ck("A notch in the front to grab")],
    bg: "a finished handmade wooden rolling dolly with four swivel casters on a workbench, warm light" },
  // ── WHAT IT MOVES (578–638) ──
  { t: 586, id: "cmp_moves", kind: "splitlist", palette: "B",
    title: "What one man rolls, alone", items: ["A full chest freezer, out to clean behind it", "A brimming rain barrel to the garden", "The cast anvil, the wood cookstove", "Feed sacks, firewood, the whole workbench"] },
  { t: 606, id: "cmp_barrel", kind: "stat", hue: "cold", accent: "good",
    value: 450, suffix: " lb", label: "a full fifty-five gallon rain barrel — rolled from the downspout to the garden instead of bucketed", eyebrow: "The rain barrel" },
  { t: 626, id: "cmp_gift", kind: "callout", hue: "amber", accent: "good",
    figure: "Years back for your back", eyebrow: "It's not the wheels", caption: "the jobs you used to dread or wait on your sons for — now you roll it over, do it, roll it back, and nothing hurts at the end of the day",
    bg: "an older Amish man standing easy at day's end in a tidy workshop, no strain" },
  // ── CTA-2 (edge, 675) ──
  { t: 675, id: "cmp_oneidea", kind: "splitlist", palette: "G",
    title: "One idea, a hundred uses", items: ["Move heavy loads with two fingers", "Keep food cold with no icebox", "Heat a whole room on one fire", "Pull water uphill with no power"] },
  // ── BUILD (683–804) ──
  { t: 690, id: "cmp_deck", kind: "checklist", hue: "good", accent: "good",
    title: "Build the deck", eyebrow: "A Saturday morning",
    items: [ck("Hardwood — oak, maple, ash if you have it"), ck("Or two layers of ¾-inch plywood, glued & screwed"), ck("About 16 × 24 in — size it to your load"), ck("Round the corners, cut the front notch")],
    bg: "a thick hardwood board being cut to size on a workbench with a hand saw, sawdust" },
  { t: 714, id: "cmp_seal", kind: "callout", hue: "amber", accent: "good",
    figure: "Boiled linseed oil", eyebrow: "If it lives in the barn", caption: "wipe it on, let it dry, wipe it again — bare wood drinks the damp, swells and rots; sealed wood shrugs it off",
    bg: "weathered hands wiping boiled linseed oil onto a wooden board with a rag, warm light" },
  { t: 740, id: "cmp_pickcasters", kind: "chips", hue: "amber",
    title: "Pick your casters", chips: ["swivel", "rubber tread", "⅓-load rated", "smooth-rolling"],
    bg: "a box of new heavy-duty swivel caster wheels on a workbench in a workshop" },
  { t: 762, id: "cmp_bolt", kind: "mistake", number: "!", eyebrow: "Your whole safety, in four bolts",
    title: "Bolt them — never wood screws", desc: "Run a bolt through the deck with a washer and a lock nut on the back side. Wood screws back out under a shaking load, especially in end-grain. A through-bolt with a lock nut never comes loose. Don't cheap out on the bolts.",
    bg: "weathered hands tightening a lock nut and washer under a wooden dolly deck with a wrench" },
  { t: 788, id: "cmp_grip", kind: "callout", hue: "cold", accent: "good",
    figure: "A no-slip top", eyebrow: "A nice touch", caption: "a couple of wood cleats or a strip of no-slip rubber mat keeps the load from walking off the deck when you stop quick",
    bg: "a strip of no-slip rubber mat and small wood cleats fixed on top of a wooden dolly deck" },
  // ── VARIATIONS (804–880) ──
  { t: 812, id: "cmp_versions", kind: "checklist", hue: "good", accent: "good",
    title: "A version for every job", eyebrow: "Once you've built one",
    items: [ck("Brake casters — flip a lever, it stays put"), ck("Bigger & longer — six wheels for grain bins & lumber"), ck("Two fixed wheels so a long one tracks straight"), ck("A lip or cradle for barrels and pipe")],
    bg: "several wooden rolling dollies of different sizes lined up in a workshop, warm light" },
  { t: 840, id: "cmp_straighttight", kind: "bars", hue: "amber", accent: "good", unit: "",
    title: "Which caster layout", eyebrow: "Match it to the job",
    bars: [{ label: "All four swivel", value: 3, display: "tight spaces, spins in place", winner: true }, { label: "2 fixed + 2 swivel", value: 2, display: "long loads, tracks straight" }] },
  { t: 860, id: "cmp_lip", kind: "chips", hue: "amber",
    title: "Add a lip for round loads", chips: ["barrels", "a stack of pipe", "milk cans", "kegs"],
    bg: "a wooden dolly with a low wooden rail lip around the edge cradling a barrel" },
  // ── SAFETY (880–985) ──
  { t: 890, id: "cmp_fiverules", kind: "checklist", hue: "good", accent: "good",
    title: "The five safety rules", eyebrow: "Keep them and it serves 20 years",
    items: [ck("Never go over the wheels' rating"), ck("Load & unload on flat, level ground only"), ck("Steel-toe boots — fingers & toes clear"), ck("Don't ride it — it has no brakes"), ck("Tall loads: low, centered, strapped, slow turns")],
    bg: "a loaded wooden dolly parked safely on a flat clean barn floor, a chock under one wheel" },
  { t: 908, id: "cmp_slope", kind: "callout", hue: "red", accent: "danger",
    figure: "Never on a slope", eyebrow: "The big one — the runaway", caption: "a loaded cart on any grade wants to get away — it'll go through a wall or over a person. Flat ground only; chock a wheel when it's parked",
    bg: "a loaded wooden cart starting to roll away down a sloped ramp, dramatic, dim light" },
  { t: 938, id: "cmp_pinch", kind: "callout", hue: "red", accent: "danger",
    figure: "Casters pinch", eyebrow: "Fingers & toes", caption: "keep your fingers out from under the load and off the floor when you set it down, and wear real boots — a caster will take a fingertip",
    bg: "a heavy steel-toe work boot beside a caster wheel on a barn floor, close-up, cautionary" },
  { t: 950, id: "cmp_ride", kind: "mistake", number: "✗", eyebrow: "It is not a scooter",
    title: "Don't ride it", desc: "No brakes, and it'll dump you on your head. Don't ride it, and don't let the little ones ride it — however much the grandkids beg.",
    bg: "an empty wooden rolling dolly on a barn floor with a clear no-riding feeling, dim light" },
  { t: 968, id: "cmp_tall", kind: "callout", hue: "amber", accent: "good",
    figure: "Low · centered · slow", eyebrow: "So a tall load won't tip", caption: "a tall, top-heavy load on a low cart tips when you turn quick — strap it, keep it low and centered, and take your turns slow and wide",
    bg: "a tall load strapped down low and centered on a wooden dolly, being turned slowly" },
  // ── CLOSE (985–1006, antes del avatar full) ──
  { t: 986, id: "cmp_recap", kind: "checklist", hue: "good", accent: "good",
    title: "The whole genius, again", eyebrow: "Go build one this weekend",
    items: [ck("A thick low slab + four swivel wheels"), ck("Each wheel a third of the load, bolted"), ck("A notch to grab, sealed against damp"), ck("Flat ground, real boots, never ride it")],
    bg: "a finished handmade wooden rolling dolly on a swept workshop floor, warm evening light" },
  { t: 998, id: "cmp_next", kind: "nextvideo", kicker: "Next time",
    title: "Water uphill — all day, no pump, no power",
    sub: "How the old-timers pushed a low creek up to the house with nothing but the water itself. People don't believe it till they see it run." },
  // ── densidad extra tramo 5 (safety/close) — sube kinds distintos a ≥5 ──
  { t: 884, id: "cmp_20yr", kind: "stat", hue: "cold", accent: "good",
    value: 20, suffix: " years", label: "follow these five and this cart serves you faithfully for twenty years and never once hurts you", eyebrow: "Built to last" },
  { t: 976, id: "cmp_payoff", kind: "splitlist", palette: "G",
    title: "The real payoff", items: ["Heavy work you used to dread or put off", "Now one man, two fingers, done", "Nothing hurts at the end of the day", "Years given back to your back"] },
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
  if (bg) { ab.image = `img/amishdolly/${c.id}_bg.png`; ab.gen = { type: "image", name: `amishdolly/${c.id}_bg`, prompt: bg + IMG_STYLE }; }
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
fs.writeFileSync("beatsheet/amishdolly.json", JSON.stringify({ video: "amishdolly", avatar: "amishdolly_opt.mp4", clipsfirst: true, beats }, null, 2));

// ── ventanas de avatar: full en [0,firstHero) + AV_FULL; PiP rotando el resto (solo sobre toma cruda) ──
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = [];
let k = 0;
for (let i = 0; i < beats.length; i++) {
  if (beats[i].kind === "raw" && beats[i].start >= COLD_END && i % 6 === 3) { pip.push([beats[i].start, beats[i].start + Math.min(beats[i].dur, 7), POS[k % POS.length]]); k++; }
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

const avTs = `// avatar_amishdolly.gen.ts — GENERADO por build_amishdolly.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_AMISHDOLLY = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
export const QR_WINDOWS = ${JSON.stringify(QR_WINDOWS, null, 2)};
`;
fs.writeFileSync("src/VideoEdit/avatar_amishdolly.gen.ts", avTs);

const kinds = new Set(beats.filter((b) => b.kind !== "raw" && b.kind !== "keyphrase" && b.kind !== "impact").map((b) => b.kind));
const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0) + firstHero;
console.log(`=== build_amishdolly ===`);
console.log(`beats: ${beats.length} · clips reales: ${nClip} · imágenes: ${beats.length - nClip} · componentes: ${nComp} · kinds: ${[...kinds].join(",")}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP: ${pip.length} · windows: ${windows.length}`);
console.log(`dur min/max: ${Math.min(...beats.map((b) => b.dur))}s / ${Math.max(...beats.map((b) => b.dur))}s`);
