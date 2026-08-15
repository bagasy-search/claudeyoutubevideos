// build_waterwell.mjs — Amish AVATAR (canal Claudio Yoder Amish), pozo de agua SIN energía ("Free Water Forever").
// CLIPS-first híbrido: consume los s_NN de _v3/waterwell_beats.json anclados al ms de Whisper.
// COLD-OPEN = TRAILER (regla amish): montaje rápido con VO del avatar + estampas de texto.
// AISLADO POR SLUG: broll/waterwell/ + img/waterwell/ (gotcha colisión carpeta compartida).
// CTA: 3 toques a la guía + QR en esquina (overlay en Main_waterwell.tsx) — voz sin precio/URL.
// Uso: node build_waterwell.mjs → beatsheet/waterwell.json + src/VideoEdit/avatar_waterwell.gen.ts
import fs from "fs";

const TOTAL = 1289.81;
const OPEN = 1.8;
const COLD_END = 66.0;
const OV = 0.5;

const HERO = ", casual documentary phone snapshot, rustic Amish farm, old iron hand pump and stone well, warm natural daylight, natural, nothing polished, no AI look, low saturation, soft muted colors, natural hands, no text, no watermark";
const IMG_STYLE = HERO;
const hero = (id, prompt) => ({ name: `waterwell/${id}`, prompt: prompt + HERO });

// ── avatar a PANTALLA COMPLETA: settle tras trailer, la historia del abuelo, el cierre+CTA ──
const AV_FULL = [
  [66.0, 94.0],        // tras el trailer: "we've walked a long road... a family can't go three days without water. Water."
  [908.0, 980.0],      // "let me tell you about my grandfather's place" (historia)
  [1240.0, TOTAL],     // no hurry + open loop (rain) + sign-off
];

// ── COLD OPEN = TRAILER (1.8–66): cortes rápidos de los payoffs + estampas + impact ──
const COLD_OPEN = [
  { id: "ww_h_pumphand", start: 1.8, dur: 2.6, kind: "raw", src: "img/waterwell/ww_h_pumphand.png", darken: 0,
    gen: { type: "image", ...hero("ww_h_pumphand", "weathered old hands gripping the iron handle of an old red pitcher water pump in a rustic farm yard, warm morning light") } },
  { id: "ww_h_gush", start: 4.4, dur: 2.2, kind: "raw", src: "img/waterwell/ww_h_gush.png", darken: 0,
    gen: { type: "image", ...hero("ww_h_gush", "clear cold water gushing out of the iron spout of a hand water pump into cupped hands, splashing, close up") } },
  { id: "ww_h_impact", start: 6.6, dur: 4.6, kind: "impact", image: "img/waterwell/ww_h_gush.png",
    setup: "No wire. No pump.", impact: "Free water.", impactAccent: "good", hitAt: 2.0, boom: 0, darken: 0.42 },
  { id: "ww_h_well", start: 11.2, dur: 2.8, kind: "raw", src: "img/waterwell/ww_h_well.png", darken: 0,
    gen: { type: "image", ...hero("ww_h_well", "an old wide stone-lined dug well with a wooden windlass and a bucket in a green Amish farmyard, warm light") } },
  { id: "ww_h_key1", start: 14.0, dur: 3.8, kind: "keyphrase", text: "No electricity.", src: "img/waterwell/ww_h_key1.png", accent: "cold", fontSize: 104,
    gen: { type: "image", ...hero("ww_h_key1", "a lone old iron hand pump standing in a quiet farmyard, no wires anywhere, soft golden light") } },
  { id: "ww_h_ram", start: 17.8, dur: 2.8, kind: "raw", src: "img/waterwell/ww_h_ram.png", darken: 0,
    gen: { type: "image", ...hero("ww_h_ram", "a small cast iron hydraulic ram pump sitting beside a flowing creek, two brass valves and an air chamber, no motor, dim mossy light") } },
  { id: "ww_h_uphill", start: 20.6, dur: 2.6, kind: "raw", src: "img/waterwell/ww_h_uphill.png", darken: 0,
    gen: { type: "image", ...hero("ww_h_uphill", "a thin pipe running up a grassy hillside from a creek toward a wooden barrel, water trickling into the barrel at the top") } },
  { id: "ww_h_key2", start: 23.2, dur: 3.8, kind: "keyphrase", text: "Uphill. On nothing.", src: "img/waterwell/ww_h_key2.png", accent: "good", fontSize: 92,
    gen: { type: "image", ...hero("ww_h_key2", "water trickling into a barrel at the top of a hill, a creek far below, no machinery visible, natural") } },
  { id: "ww_h_windmill", start: 27.0, dur: 3.0, kind: "raw", src: "img/waterwell/ww_h_windmill.png", darken: 0,
    gen: { type: "image", ...hero("ww_h_windmill", "a tall old skeleton farm windmill with a spinning fan standing over a stock tank in a wide field, low sun") } },
  { id: "ww_h_creek", start: 30.0, dur: 2.8, kind: "raw", src: "img/waterwell/ww_h_creek.png", darken: 0,
    gen: { type: "image", ...hero("ww_h_creek", "a small clear creek flowing over stones with a little drop, mossy banks, dim green woodland light") } },
  { id: "ww_h_dig", start: 32.8, dur: 3.0, kind: "raw", src: "img/waterwell/ww_h_dig.png", darken: 0,
    gen: { type: "image", ...hero("ww_h_dig", "a man's boots and shovel beside a wide half-dug well hole lined with fieldstone, dirt piled up, farm") } },
  { id: "ww_h_key3", start: 35.8, dur: 4.0, kind: "keyphrase", text: "Free water forever.", src: "img/waterwell/ww_h_key3.png", accent: "good", fontSize: 100,
    gen: { type: "image", ...hero("ww_h_key3", "cupped weathered hands full of clear cold water held up in warm sunlight, drops falling") } },
  { id: "ww_h_blackout", start: 39.8, dur: 3.0, kind: "raw", src: "img/waterwell/ww_h_blackout.png", darken: 0.15,
    gen: { type: "image", ...hero("ww_h_blackout", "a dark modern kitchen during a blackout, a hand turning a faucet with nothing coming out, dim cold light") } },
  { id: "ww_h_pumpwork", start: 42.8, dur: 3.2, kind: "raw", src: "img/waterwell/ww_h_pumpwork.png", darken: 0,
    gen: { type: "image", ...hero("ww_h_pumpwork", "an old iron hand pump on a porch giving water in the daylight, calm and working, warm natural light") } },
  { id: "ww_h_bucket", start: 46.0, dur: 3.2, kind: "raw", src: "img/waterwell/ww_h_bucket.png", darken: 0,
    gen: { type: "image", ...hero("ww_h_bucket", "a wooden bucket coming up full of water on a rope from a stone well, hands hauling it, warm light") } },
  { id: "ww_h_drink", start: 49.2, dur: 3.2, kind: "raw", src: "img/waterwell/ww_h_drink.png", darken: 0,
    gen: { type: "image", ...hero("ww_h_drink", "a child drinking cold clear water from cupped hands at a farm pump, soft golden documentary light") } },
  { id: "ww_h_key4", start: 52.4, dur: 3.6, kind: "keyphrase", text: "The old way pays you back.", src: "img/waterwell/ww_h_key4.png", accent: "good", fontSize: 84,
    gen: { type: "image", ...hero("ww_h_key4", "wide peaceful Amish farm at golden hour with a windmill and a well, quiet and self-sufficient") } },
  { id: "ww_h_settle", start: 56.0, dur: 4.0, kind: "raw", src: "img/waterwell/ww_h_settle.png", darken: 0,
    gen: { type: "image", ...hero("ww_h_settle", "a still close up of clear water in a wooden bucket reflecting the sky, calm, warm light") } },
];

// ── CLIPS = beats del cuerpo, desde _v3/waterwell_beats.json (s_NN ya en disco, aislados en waterwell/) ──
const BEATS_SRC = JSON.parse(fs.readFileSync("_v3/waterwell_beats.json", "utf8").replace(/^﻿/, ""));
const CLIPS = BEATS_SRC.map((b) => [ +(b.ms / 1000).toFixed(2), b.name, (b.queries && b.queries.length ? b.queries : [b.desc || b.phrase]), b.desc || b.phrase ]);
CLIPS.sort((a, b) => a[0] - b[0]);

const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const MINGAP = Number(process.env.WATERWELL_MINGAP) || 3.6;   // amish PAUSADO: ~5-6s medio en el cuerpo
const brollImg = (name) => { for (const e of ["jpg", "jpeg", "png"]) if (fs.existsSync(`public/broll/waterwell/${name}.${e}`)) return `broll/waterwell/${name}.${e}`; return null; };
const isReal = (name) => fs.existsSync(`public/broll/waterwell/${name}.mp4`) || !!brollImg(name);
const clips = [];
let lastT = -99;
for (const c of CLIPS.filter((c) => !inFull(c[0]) && c[0] >= COLD_END - 1e-6)) {
  if (c[0] - lastT < MINGAP && !isReal(c[1])) continue;
  clips.push(c);
  lastT = c[0];
}

const have = (name) => fs.existsSync(`public/broll/waterwell/${name}.mp4`);
const imgSrc = (name) => { for (const e of ["png", "jpg", "jpeg", "webp"]) if (fs.existsSync(`public/img/waterwell/${name}.${e}`)) return `img/waterwell/${name}.${e}`; return null; };
const nClip = clips.filter((c) => have(c[1])).length;

const avStarts = AV_FULL.map(([s]) => s);
const bounds = [...clips.map((c) => c[0]), ...avStarts, TOTAL].sort((a, b) => a - b);
const nextBound = (t) => bounds.find((b) => b > t + 1e-6) ?? TOTAL;

const beats = clips.map(([t, name, query, concept]) => {
  const dur = +Math.min(nextBound(t) - t + OV, TOTAL - t).toFixed(2);
  if (have(name)) return { id: name, start: t, dur, kind: "raw", src: `broll/waterwell/${name}.mp4`, darken: 0 };
  const bi = brollImg(name);
  if (bi) return { id: name, start: t, dur, kind: "raw", src: bi, darken: 0 };
  const im = imgSrc(name);
  if (im) return { id: name, start: t, dur, kind: "raw", src: im, darken: 0 };
  const vq = Array.isArray(query) ? query[0] : query;
  return { id: name, start: t, dur, kind: "raw", src: `img/waterwell/${name}.png`, darken: 0, gen: { type: "image", name: `waterwell/${name}`, prompt: vq + IMG_STYLE } };
});

// reemplazar los beats del rango cold-open por el TRAILER bespoke
for (let i = beats.length - 1; i >= 0; i--) if (beats[i].start < COLD_END - 1e-6) beats.splice(i, 1);
beats.unshift(...COLD_OPEN);
beats.sort((a, b) => a.start - b.start);

// ── COMPONENTES amish (≥6 kinds distintos, ~40 para el density_gate) ──
const ck = (text, note) => (note ? { text, note, state: "done" } : { text, state: "done" });
const COMPONENTS = [
  // ── REFRAME / SETUP (94–190) ──
  { t: 100, id: "cmp_notpower", kind: "callout", hue: "amber", accent: "good",
    figure: "You don't need power", eyebrow: "The whole trick", caption: "the water is already under your feet — the trick isn't making electricity, it's not needing any",
    bg: "an old iron hand pump standing alone in a quiet farmyard, no wires, warm light" },
  { t: 128, id: "cmp_watts", kind: "stat", hue: "cold", accent: "good",
    value: 0, suffix: " watts", label: "the old world got its water for ten thousand years with not one watt of electricity anywhere on earth", eyebrow: "Ten thousand years" },
  { t: 165, id: "cmp_twotricks", kind: "splitlist", palette: "G",
    title: "Only two problems to solve", items: ["Reach the water — get a hole down to it", "Lift the water — get it up and out", "Power just does both for you", "Do both the old way, with none"] },
  // ── FINDING (190–330) ──
  { t: 205, id: "cmp_watertable", kind: "callout", hue: "cold", accent: "good",
    figure: "The water table", eyebrow: "It's almost surely there", caption: "the depth where the ground is soaked full like the bottom of a wrung-out sponge — dig far enough and you hit it",
    bg: "a cross section of green earth with a shovel, showing the wet dark soil of the water table below" },
  { t: 240, id: "cmp_signs", kind: "checklist", hue: "good", accent: "good",
    title: "Reading the land", eyebrow: "Where water sits near the top",
    items: [ck("Low ground, hollows, near a creek"), ck("Willows, cattails, rushes"), ck("Grass that stays green in a dry spell"), ck("Where the morning mist settles")],
    bg: "a low green hollow with willows and cattails growing, morning mist, soft light" },
  { t: 272, id: "cmp_shallow", kind: "stat", hue: "cold", accent: "good",
    value: 15, suffix: " ft", label: "in low ground near a creek the water table can sit this close to the top — sometimes less", eyebrow: "Shockingly close" },
  { t: 300, id: "cmp_dowsing", kind: "mistake", number: "?", eyebrow: "An honest word on dowsing",
    title: "No promises — but no harm", desc: "The old folks walked the land with a forked willow branch and swore it pulled down over water. I've got no science for it. It costs nothing to try. But the reading of the land — green grass, low ground, willows — that part I'll stand behind all day.",
    bg: "weathered hands holding a forked willow dowsing stick walking over green ground" },
  // ── THE HOLE (330–483) ──
  { t: 340, id: "cmp_threeways", kind: "splitlist", palette: "B",
    title: "Three ways to reach it", items: ["Drive a sand-point — shallow & sandy", "Bore it with a hand auger — a bit deeper", "Dig it wide & stone-line it — the old way", "Easiest to hardest"] },
  { t: 360, id: "cmp_sandpoint", kind: "checklist", hue: "good", accent: "good",
    title: "The driven sand-point well", eyebrow: "Almost too easy",
    items: [ck("A pointed well point with a screen"), ck("Drive it down with a maul, foot by foot"), ck("Thread on more pipe and keep driving"), ck("Screw a pump right onto the top")],
    bg: "a pointed steel well point and pipe being driven into the ground with a heavy maul, farmyard" },
  { t: 388, id: "cmp_sandwhere", kind: "chips", hue: "amber",
    title: "Where the sand-point works", chips: ["shallow water", "sandy or gravelly", "no rock", "an afternoon's work"],
    bg: "sandy gravelly ground with a driven pipe standing up, farm" },
  { t: 412, id: "cmp_auger", kind: "checklist", hue: "good", accent: "good",
    title: "The hand-bored auger well", eyebrow: "A bit deeper, some clay",
    items: [ck("A giant earth auger on a pipe"), ck("Turn it by hand, round and round"), ck("Pull it up full and dump the dirt"), ck("Add pipe as the hole gets deeper")],
    bg: "two people turning a large hand earth auger boring a hole in soft ground, farm" },
  { t: 440, id: "cmp_augerbars", kind: "bars", hue: "amber", accent: "good", unit: "",
    title: "Hand auger — what it beats", eyebrow: "Arms and patience",
    bars: [{ label: "Soft ground, clay, sand", value: 3, display: "bore 40–50 ft by hand", winner: true }, { label: "Rock", value: 1, display: "stops you" }] },
  { t: 462, id: "cmp_dugwell", kind: "callout", hue: "amber", accent: "good",
    figure: "The deep hand-dug well", eyebrow: "The oldest way there is", caption: "a wide hole a man climbs into, pick and shovel and a bucket on a rope, lined with stone as you go — some give water 200 years",
    bg: "a wide stone-lined dug well with a curb and a windlass in a farmyard, warm light" },
  // ── THE WARNING (483–612) — serio, derecho ──
  { t: 492, id: "cmp_danger", kind: "mistake", number: "!", eyebrow: "Stop — this is dead serious",
    title: "The most dangerous thing here", desc: "A deep hand-dug well can kill you, and it has killed people. Two things can kill you down in a well, and you must respect both. Do not miss this.",
    bg: "looking down into a dark deep stone well shaft, dim and ominous" },
  { t: 518, id: "cmp_caveins", kind: "callout", hue: "red", accent: "danger",
    figure: "The walls cave in", eyebrow: "Danger one", caption: "a deep hole wants to collapse — never go down one that isn't shored and stone-lined solid as you go. You line it as you descend, not after",
    bg: "the inside of a stone-cribbed well shaft being lined with fieldstone, dim" },
  { t: 545, id: "cmp_badair", kind: "mistake", number: "!", eyebrow: "Danger two — nobody sees it",
    title: "Bad air — the damps", desc: "A heavy poisoned air pools at the bottom of a deep well. You cannot see it or smell it. A man climbs down into it and it takes his breath before anyone knows. Then someone climbs down to save him, and it takes them too.",
    bg: "the dark bottom of a deep well shaft, heavy dim air, ominous" },
  { t: 566, id: "cmp_candletest", kind: "checklist", hue: "good", accent: "good",
    title: "Test the air — every time", eyebrow: "Before any person goes down",
    items: [ck("Lower a lit candle or lantern on a rope"), ck("Flame burns bright all the way = good air"), ck("Flame guts, dims, or dies = bad air"), ck("Clear it and test again — nobody goes down till it's bright")],
    bg: "a lit lantern being lowered on a rope into a dark stone well shaft, small flame" },
  { t: 590, id: "cmp_neveralone", kind: "callout", hue: "red", accent: "danger",
    figure: "Never go down alone", eyebrow: "Not once — not ever", caption: "there is always a strong person up top, on the rope, watching you the whole time. Respect the well and it gives water 200 years",
    bg: "a person up top holding a rope at the mouth of a well while another descends" },
  // ── LIFTING (612–796) ──
  { t: 620, id: "cmp_lifting", kind: "splitlist", palette: "G",
    title: "Lifting it — no power", items: ["A hand pump for a shallow well", "A cylinder pump for a deep one", "A bucket, a windlass, a rope pump", "A windmill — and a ram"] },
  { t: 636, id: "cmp_handpump", kind: "checklist", hue: "good", accent: "good",
    title: "The hand pump", eyebrow: "The plainest way",
    items: [ck("Bolt it right on top of the pipe"), ck("Work the handle, it draws water up"), ck("Perfect for a shallow well"), ck("A pitcher pump or an iron farm pump")],
    bg: "an old red pitcher hand pump bolted to a well pipe, water in the spout, farmyard" },
  { t: 654, id: "cmp_suction", kind: "stat", hue: "amber", accent: "danger",
    value: 25, suffix: " ft max", label: "how far a suction pump can pull water up — honestly closer to 22 in the real world. Deeper than that, you need a different rig", eyebrow: "The one honest number" },
  { t: 682, id: "cmp_cylinder", kind: "callout", hue: "amber", accent: "good",
    figure: "The deep-well cylinder pump", eyebrow: "For the deep ones", caption: "the working part sits down in the water; a long rod works it from up top, pushing water up from below — no 25-foot limit",
    bg: "a cast iron deep well cylinder hand pump head with a long rod, farmyard" },
  { t: 706, id: "cmp_cylbars", kind: "bars", hue: "amber", accent: "good", unit: " ft",
    title: "Suction vs cylinder pump", eyebrow: "How deep each reaches",
    bars: [{ label: "Suction pump", value: 25, display: "~25 ft" }, { label: "Deep-well cylinder", value: 300, display: "200–300 ft by hand", winner: true }] },
  { t: 726, id: "cmp_nopump", kind: "chips", hue: "amber",
    title: "No pump at all", chips: ["bucket & windlass", "rope pump", "windmill", "the ram"],
    bg: "a wooden bucket on a windlass over a stone well, farmyard" },
  { t: 738, id: "cmp_ropepump", kind: "checklist", hue: "good", accent: "good",
    title: "The rope pump", eyebrow: "A poor man's wonder",
    items: [ck("A loop of rope with rubber washers"), ck("Runs up a pipe over a wheel you turn"), ck("Each washer drags a slug of water up"), ck("Waters a whole garden — for a bicycle wheel")],
    bg: "a homemade rope pump with washers running over a wheel, water coming up a pipe" },
  { t: 762, id: "cmp_windmill", kind: "callout", hue: "cold", accent: "good",
    figure: "The windmill", eyebrow: "Let the wind pump", caption: "the fan does what your arm does on the handle — it pumps water into a tank all day and all night, every hour the wind blows",
    bg: "a tall skeleton farm windmill spinning over a full stock tank, wide field, low sun" },
  // ── THE RAM REVEAL (796–905) ──
  { t: 802, id: "cmp_ram", kind: "callout", hue: "amber", accent: "good",
    figure: "The hydraulic ram", eyebrow: "The one you came for", caption: "no motor, no electricity, nothing to plug in — it pushes water uphill on the water's own weight, and never stops",
    bg: "a small cast iron hydraulic ram pump beside a creek, two valves and an air chamber" },
  { t: 828, id: "cmp_ramhow", kind: "checklist", hue: "good", accent: "good",
    title: "How the ram works", eyebrow: "A beautiful trick",
    items: [ck("Falling creek water rushes down a pipe"), ck("It slams a valve shut all at once"), ck("That force shoves a squirt uphill"), ck("Slam and push, every second, forever")],
    bg: "a diagram-like real view of a hydraulic ram: drive pipe from a creek, valve, delivery pipe up a hill" },
  { t: 862, id: "cmp_ram10", kind: "stat", hue: "cold", accent: "good",
    value: 10, suffix: "× the fall", label: "the rough old rule — for every foot the water falls coming in, a ram can push a share of it about ten feet up", eyebrow: "Water uphill, free" },
  { t: 888, id: "cmp_ram100", kind: "stat", hue: "amber", accent: "good",
    value: 100, suffix: " years+", label: "there are ram pumps in England still running, untouched, for over a century — as close to free water forever as there is", eyebrow: "The ram" },
  // ── SAFETY (982–1056) ──
  { t: 988, id: "cmp_clean", kind: "checklist", hue: "good", accent: "good",
    title: "Keep the water clean", eyebrow: "The one you can't get wrong",
    items: [ck("Keep the well away from the outhouse & barnyard"), ck("Always uphill from the privy and manure"), ck("Cap and cover it — no dirt or runoff in"), ck("If ever in doubt, boil it first")],
    bg: "a clean capped well head set well away from a wooden outhouse, uphill, farm" },
  { t: 1010, id: "cmp_distance", kind: "stat", hue: "amber", accent: "danger",
    value: 50, suffix: " ft min", label: "at least this far from any outhouse or manure — a hundred feet is better, and always uphill so nothing drains toward your water", eyebrow: "The rule that matters most" },
  { t: 1040, id: "cmp_boil", kind: "callout", hue: "cold", accent: "good",
    figure: "When in doubt, boil it", eyebrow: "New well, old spring, after a flood", caption: "a hard rolling boil for one minute makes near any water safe to drink — it costs you nothing but firewood",
    bg: "a pot of water at a rolling boil over a wood fire, steam, warm light" },
  // ── STAKES (1056–1140) ──
  { t: 1073, id: "cmp_blackout", kind: "callout", hue: "red", accent: "danger",
    figure: "Power out — water out", eyebrow: "The modern house", caption: "the taps go dry, the toilets won't fill — a house full of pipes and not one gives up a cup, because it only ever worked while the wire held",
    bg: "a dark modern kitchen in a blackout, a dry faucet, dim cold light" },
  { t: 1098, id: "cmp_stakesbars", kind: "bars", hue: "amber", accent: "good", unit: "",
    title: "When the grid goes down", eyebrow: "Same storm",
    bars: [{ label: "Electric well pump", value: 1, display: "taps go dry" }, { label: "Hand pump, windmill, ram", value: 3, display: "water right through", winner: true }] },
  { t: 1118, id: "cmp_security", kind: "stat", hue: "cold", accent: "good",
    value: 0, suffix: " / month", label: "what the ground, the wind and the falling creek charge you for water — no line coming in from the road", eyebrow: "The deepest security" },
  // ── RECAP (1140–1200) ──
  { t: 1146, id: "cmp_recapreach", kind: "checklist", hue: "good", accent: "good",
    title: "To reach the water", eyebrow: "No power",
    items: [ck("Drive a sand-point where it's shallow"), ck("Bore with a hand auger a bit deeper"), ck("Dig & stone-line it the old way"), ck("Shore the walls · test the air · never alone")],
    bg: "a stone well, a driven pipe and a hand auger together in a farmyard, warm light" },
  { t: 1175, id: "cmp_recaplift", kind: "checklist", hue: "good", accent: "good",
    title: "To lift the water", eyebrow: "No power",
    items: [ck("Hand pump for a shallow well"), ck("Cylinder pump for the deep ones"), ck("Windlass, rope pump, or a windmill"), ck("A ram on the creek — uphill, forever")],
    bg: "an iron hand pump, a windmill and a creek ram pump together, warm farm light" },
  // ── CTA (1200–1240) — la grande + QR (overlay en Main) ──
  { t: 1207, id: "cmp_almanac", kind: "callout", hue: "amber", accent: "good",
    figure: "The Plain Almanac", eyebrow: "Below this video — scan the code", caption: "Amos & Rebecca gathered ninety old methods into one almanac — the water pages, the ram, the rain, laid out step by step. Link in the description",
    bg: "an old vintage almanac book open on a wooden table beside a lantern, warm light" },
  // ── OPEN LOOP (1240–TOTAL) — avatar full; una tarjeta de próximo ──
  { t: 1246, id: "cmp_next", kind: "nextvideo", kicker: "Next time",
    title: "Catch the rain off your own roof",
    sub: "Tens of thousands of gallons a year running off into the mud — caught, kept clean, saved for the dry months. Easier than any well." },

  // ── densidad + variedad (cada uno explica una idea CONCRETA del guion, no relleno) ──
  { t: 112, id: "cmp_needlist", kind: "splitlist", palette: "D", cross: true,
    title: "What you're told it takes", items: ["A drilling company and a truck", "A crew, and thousands of dollars", "A big electric pump underground", "One more wire that can fail you"] },
  { t: 318, id: "cmp_landchips", kind: "chips", hue: "cold",
    title: "The land tells you where", chips: ["willows", "cattails", "green in a dry spell", "morning mist"],
    bg: "a low green hollow with willows and cattails and a bright green patch of grass, soft morning mist" },
  { t: 428, id: "cmp_augersplit", kind: "splitlist", palette: "G",
    title: "Bore it where the ground is", items: ["Soft ground, clay, or sand", "No rock — rock will stop you", "Turn the auger, pull, and dump", "40–50 ft by hand and patience"] },
  { t: 470, id: "cmp_dugstat", kind: "stat", hue: "amber", accent: "good",
    value: 200, suffix: " years+", label: "a stone-lined dug well, walled proper, outlasts the house beside it — some give water two and three centuries", eyebrow: "The old dug well" },
  { t: 605, id: "cmp_twokillers", kind: "splitlist", palette: "D", cross: true,
    title: "The two things that kill", items: ["The walls cave in — shore & stone-line", "The bad air pools — test with a flame", "Never go down a well alone", "Always a strong person up top"] },
  { t: 650, id: "cmp_pumpwhere", kind: "splitlist", palette: "G",
    title: "The hand pump is for", items: ["A shallow well", "Water under about 25 feet", "One iron handle, no power", "Bolted right on top of the pipe"] },
  { t: 815, id: "cmp_ramcost", kind: "stat", hue: "cold", accent: "good",
    value: 0, suffix: " power", label: "the ram runs on the water's own weight — no motor, no wire, not one moving part you have to feed", eyebrow: "The hydraulic ram" },
  { t: 845, id: "cmp_ramslam", kind: "splitlist", palette: "B",
    title: "The ram's beat — forever", items: ["Falling water rushes down the pipe", "It slams a valve shut all at once", "That force shoves a squirt uphill", "The valve opens — and it slams again"] },
  { t: 1000, id: "cmp_privybars", kind: "bars", hue: "amber", accent: "good", unit: " ft",
    title: "Keep the well clear of the privy", eyebrow: "Uphill, always",
    bars: [{ label: "Right beside the outhouse", value: 5, display: "poisons the water" }, { label: "50–100 ft & uphill", value: 100, display: "safe & clean", winner: true }] },
  { t: 1085, id: "cmp_drytaps", kind: "splitlist", palette: "D", cross: true,
    title: "When the power dies", items: ["The taps go dry", "The toilets won't fill", "People fight over bottled water", "The porch pump doesn't care one bit"] },
  { t: 1130, id: "cmp_neverdry", kind: "splitlist", palette: "G",
    title: "Water right through the storm", items: ["Hand pump — works in the blackout", "Windmill — pumps on the wind", "Ram — runs right through the ice storm", "Cold water, on demand, for free"] },
  { t: 142, id: "cmp_shortcut", kind: "callout", hue: "amber", accent: "good",
    figure: "Power is just the shortcut", eyebrow: "Not the water itself", caption: "electricity is only the modern shortcut — take it away and the water's still right there, right where it's always been, under your feet",
    bg: "a quiet farmyard with an old hand pump and a windmill, no power lines anywhere, soft light" },
  { t: 392, id: "cmp_afternoon", kind: "stat", hue: "cold", accent: "good",
    value: 1, suffix: " afternoon", label: "a man and a strong boy can drive a sand-point well in one afternoon — a hundred dollars in pipe and a point", eyebrow: "The driven well" },
  { t: 760, id: "cmp_windmillstat", kind: "stat", hue: "amber", accent: "good",
    value: 24, suffix: " / 7", label: "the windmill pumps every hour the wind blows, day and night, filling a tank for a whole herd — no hand on it", eyebrow: "The windmill" },
  { t: 1060, id: "cmp_waterbill", kind: "callout", hue: "red", accent: "danger",
    figure: "It all hangs on the wire", eyebrow: "The modern way", caption: "a water bill every month, or an electric pump humming underground — and it only works as long as the power company says it can",
    bg: "an electric water pump and pressure tank in a dim basement, wires running to it" },
  { t: 181, id: "cmp_bothjobs", kind: "splitlist", palette: "B",
    title: "The modern world vs the old", items: ["Modern: power reaches the water", "Modern: power lifts the water", "The old way: reach it with none", "The old way: lift it with none"] },
  { t: 228, id: "cmp_shallowdeep", kind: "splitlist", palette: "G",
    title: "How deep is the water?", items: ["Some places, way down deep", "Low ground near a creek: 10–15 ft", "Sometimes shockingly close to the top", "Read the land to guess how far"] },
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
  if (bg) { ab.image = `img/waterwell/${c.id}_bg.png`; ab.gen = { type: "image", name: `waterwell/${c.id}_bg`, prompt: bg + IMG_STYLE }; }
  let rm = 1;
  while (idx + rm < beats.length && beats[idx + rm].start < start + D - 0.05 && !placed.has(beats[idx + rm].id)) rm++;
  beats.splice(idx, rm, ab);
  placed.add(c.id);
  const next = beats[idx + 1];
  const nextAv = avStarts.filter((s) => s > start + 0.01).sort((a, b) => a - b)[0] ?? TOTAL;
  ab.dur = +(Math.min(next ? next.start : TOTAL, nextAv, start + 8.8) - start).toFixed(2);
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
fs.writeFileSync("beatsheet/waterwell.json", JSON.stringify({ video: "waterwell", avatar: "waterwell_opt.mp4", clipsfirst: true, maxRawDur: 9, beats }, null, 2));

// ── ventanas de avatar: full en [0,firstHero) + AV_FULL; PiP rotando el resto ──
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

const avTs = `// avatar_waterwell.gen.ts — GENERADO por build_waterwell.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_WATERWELL = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`;
fs.writeFileSync("src/VideoEdit/avatar_waterwell.gen.ts", avTs);

const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0) + firstHero;
console.log(`=== build_waterwell ===`);
console.log(`beats: ${beats.length} · clips reales: ${nClip} · imágenes: ${beats.length - nClip} · componentes: ${nComp}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP: ${pip.length} · windows: ${windows.length}`);
console.log(`dur min/max: ${Math.min(...beats.map((b) => b.dur))}s / ${Math.max(...beats.map((b) => b.dur))}s`);
