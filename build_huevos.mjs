// build_huevos.mjs — "Why the Amish Never Refrigerate Their Eggs — Fresh for a Full Year"
// Clon del 4.3M (Homesteading Family), fórmula Elias. Canal claudio yoder. Anclado al ms de Whisper.
// PiP QUIETO en cornerBR (no rota). 3 menciones de guía (theplainalmanac) → overlays.
// Modo: node build_huevos.mjs match | node build_huevos.mjs
import fs from "fs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const SLUG = "huevos";
const caps = JSON.parse(fs.readFileSync("public/captions_huevos.json", "utf8"));
const TOTAL = +(caps[caps.length - 1].endMs / 1000).toFixed(2);
const OPEN = 0.1;
const DLDUR = 6;

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const W = [];
for (const c of caps) for (const w of norm(c.text).split(" ")) if (w) W.push({ w, ms: c.startMs });
const words = W.map((x) => x.w);
const warn = [];
function at(phrase, fromMs = 0) {
  const p = norm(phrase).split(" ");
  let s = 0;
  if (fromMs > 0) { s = W.findIndex((x) => x.ms >= fromMs); if (s < 0) s = 0; }
  for (let i = s; i <= words.length - p.length; i++) {
    let ok = true;
    for (let j = 0; j < p.length; j++) if (words[i + j] !== p[j]) { ok = false; break; }
    if (ok) return +(W[i].ms / 1000).toFixed(2);
  }
  if (fromMs > 0) return at(phrase, 0);
  warn.push(phrase);
  return null;
}

// ── AV FULL: momentos personales ──
const AV_FULL = [
  [OPEN, at("full to the brim with eggs")],                    // apertura
  [at("My name is Claudio"), at("hardest winter")],            // credenciales + promesa
  [at("There was a winter"), at("help that never quite comes")],// anécdota del invierno
  [at("come and subscribe"), TOTAL],                           // sign-off
].filter((w) => w[0] != null && w[1] != null);

// ── CLIPS: [frase-ancla, name, query(EN visual), concepto] ──
const CLIPS = [
  // HOOK
  ["a stone crock in my cellar", "hu_crock_cellar", ["an old stone crock in a dark cellar", "large earthenware crock on a cellar shelf"], "la vasija de piedra en el sótano"],
  ["Whole, fresh eggs", "hu_crock_eggs", ["a crock or bucket full of eggs", "many eggs stored in a container"], "la vasija llena de huevos"],
  ["laid last summer", "hu_basket_eggs", ["a basket of fresh brown farm eggs", "wicker basket full of eggs"], "huevos frescos de la granja"],
  ["There is no refrigerator in this house", "hu_no_fridge", ["an old rustic farmhouse kitchen no fridge", "simple amish kitchen no appliances"], "una cocina sin heladera"],
  ["crack it in the skillet", "hu_fry_egg", ["frying a fresh egg in a cast iron skillet", "egg cooking in a pan"], "friendo un huevo en la sartén"],
  ["The yolk stands tall and orange", "hu_yolk", ["close up of a firm orange egg yolk", "fresh egg cracked standing yolk"], "la yema firme y naranja"],
  ["one small bag of white powder", "hu_lime_bag", ["a bag of white pickling lime powder", "white powder in a paper bag"], "una bolsita de polvo blanco"],
  // ENEMY / PRINCIPLE
  ["the grocery store will never", "hu_store_eggs", ["cartons of eggs on a supermarket shelf", "grocery store egg cooler"], "los huevos del supermercado"],
  ["an egg is a delicate, perishable thing", "hu_egg_counter", ["a single egg sitting on a kitchen counter", "one egg on a wooden table"], "un huevo en la mesada"],
  ["look close at the shell", "hu_shell_close", ["extreme close up of an eggshell surface", "macro texture of an egg shell"], "el cascarón de cerca"],
  ["7 000 tiny holes", "hu_pores", ["magnified porous eggshell surface", "microscopic pores of an egg"], "los miles de poros del cascarón"],
  ["a little pocket of air", "hu_air_cell", ["a candled egg showing the air cell", "egg held to light showing air pocket"], "la bolsa de aire del huevo"],
  ["a fresh egg sinks in a glass of water", "hu_float_glass", ["an egg sinking in a glass of water", "egg submerged in a clear glass"], "el huevo fresco se hunde"],
  ["the old folks call it the bloom", "hu_hen_lay", ["a hen sitting on eggs in a nest", "brown hen with fresh laid eggs"], "la gallina y el huevo recién puesto"],
  ["The store scrubs every egg", "hu_egg_wash", ["eggs being washed and graded on a conveyor", "industrial egg washing line"], "la industria lava cada huevo"],
  ["coming back to their cooler twice a week", "hu_cooler", ["a refrigerated grocery egg case", "cold store shelf of eggs"], "volver a la heladera del super"],
  // EUROPE
  ["In Europe", "hu_euro_market", ["a european market with eggs on a shelf", "eggs sold at room temperature in a shop"], "en Europa, en el mercado"],
  ["against the law to wash an egg", "hu_euro_eggs", ["unwashed brown eggs on an open shelf", "farm eggs stacked at room temperature"], "huevos sin lavar en la góndola"],
  // METHOD
  ["you want them unwashed", "hu_unwashed", ["dirty unwashed fresh farm eggs", "eggs with a bit of dirt from the nest"], "huevos frescos sin lavar"],
  ["take a minute to candle them", "hu_candle", ["candling an egg against a bright light", "holding an egg up to a flashlight in the dark"], "mirar el huevo a contraluz"],
  ["a crock, or a big glass jar", "hu_jar_crock", ["a big glass jar and a stone crock", "large mason jar beside a crock"], "un frasco de vidrio o una vasija"],
  ["pickling lime", "hu_pickling_lime", ["a container of pickling lime hydrated lime", "bag of food grade hydrated lime"], "la cal de conserva"],
  ["one ounce of pickling lime", "hu_scale", ["weighing white powder on a kitchen scale", "measuring lime on a scale"], "pesando una onza de cal"],
  ["it will go cloudy and milky", "hu_limewater", ["cloudy milky white water in a jar", "whisking lime into water"], "el agua turbia y lechosa"],
  ["settle them down into", "hu_lower_eggs", ["lowering eggs into a jar of liquid", "hand placing eggs into a crock of water"], "bajando los huevos al agua"],
  ["every egg has got to stay under the water", "hu_submerged", ["eggs fully submerged in cloudy water", "jar of eggs covered in liquid"], "los huevos cubiertos por el agua"],
  ["carry it down to the coolest, darkest corner", "hu_pantry", ["crocks of eggs on a dark pantry shelf", "storage crocks in a cool cellar"], "a la despensa fresca y oscura"],
  ["the crock fills as the hens lay", "hu_gather_eggs", ["collecting eggs from a hen house", "gathering fresh eggs in the morning"], "juntando los huevos cada día"],
  ["A five-gallon crock will hold better than two hundred", "hu_bucket_eggs", ["a five gallon bucket full of eggs", "large pail packed with eggs"], "más de doscientos huevos en un balde"],
  ["if you keep ducks or geese", "hu_duck_eggs", ["duck eggs in a basket", "large white duck eggs"], "huevos de pato, más gruesos"],
  // SCIENCE / HISTORY
  ["caps every one of those", "hu_sealed", ["a smooth sealed eggshell close up", "egg shell coated and sealed"], "la cal sella los poros"],
  ["water glass sodium silicate", "hu_old_crock", ["an antique stoneware crock", "vintage kitchen crock with eggs"], "el viejo waterglass"],
  ["The old sailing ships", "hu_ship", ["an old wooden sailing ship at sea", "tall ship on the ocean"], "los barcos de vela antiguos"],
  ["The pioneers carried eggs across the plains", "hu_wagon", ["a covered pioneer wagon on the plains", "old west wagon train"], "los pioneros cruzando las llanuras"],
  ["the two great wars", "hu_war_kitchen", ["a 1940s wartime farm kitchen", "vintage ration era pantry"], "las cocinas de las guerras"],
  // MYTH / OTHER METHODS
  ["baked her prize cakes for the county fair", "hu_cake", ["a homemade cake at a county fair", "baking a cake in a rustic kitchen"], "las tortas premiadas de la abuela"],
  ["grease the shell", "hu_grease", ["rubbing an egg with oil or lard", "coating an egg with grease by hand"], "engrasar el cascarón"],
  ["pack them dry", "hu_pack_sand", ["eggs packed in a box of sawdust or sand", "eggs buried in dry salt in a crate"], "huevos guardados en arena o aserrín"],
  // USE
  ["the float test", "hu_float_test", ["an egg floating in a glass of water", "testing an egg in water bad egg floats"], "la prueba del flotado"],
  ["frying, scrambling, baking", "hu_scramble", ["scrambled eggs in a pan", "cooking eggs on a stove"], "huevos revueltos, fritos, horneados"],
  ["side by side in two pans", "hu_two_eggs", ["two fried eggs side by side comparison", "two eggs cooking in one pan"], "dos huevos comparados"],
  // MISTAKES
  ["never, ever use washed or store eggs", "hu_carton", ["a supermarket carton of washed white eggs", "store bought eggs in a carton"], "nunca huevos de super lavados"],
  ["a cracked one is a waste", "hu_cracked", ["a cracked egg shell", "egg with a hairline crack"], "un huevo rajado, descartar"],
  ["mark it with the month", "hu_label", ["writing a date on a storage crock with chalk", "labeling a jar with a date"], "marcar la vasija con la fecha"],
  // STAKES
  ["the store shelves in the valley went bare", "hu_empty_shelves", ["empty grocery store shelves", "bare supermarket shelves shortage"], "las góndolas vacías del pueblo"],
  ["a basket of eggs to the two or three families", "hu_egg_gift", ["carrying a basket of eggs to a neighbor", "a basket of eggs in the snow"], "una canasta de huevos a los vecinos"],
  ["the price of a dozen eggs", "hu_egg_price", ["expensive eggs price sign at a store", "a carton of eggs with a high price"], "el precio disparado de los huevos"],
  // RECAP / CTA
  ["find yourself some fresh, unwashed eggs", "hu_farm_market", ["fresh eggs at a farmers market stall", "buying farm eggs from a farmer"], "conseguir huevos frescos sin lavar"],
  ["kept butter sweet", "hu_butter", ["a crock of fresh butter in cold water", "homemade butter kept cool"], "la manteca fresca (próximo video)"],
];

// ── resolver ──
let cur = 0;
const clipsR = [];
for (const [phrase, name, query, concept] of CLIPS) {
  const t = at(phrase, cur > 0 ? cur - 0.3 : 0);
  if (t == null) continue;
  cur = t;
  clipsR.push([t, name, query, concept]);
}
clipsR.sort((a, b) => a[0] - b[0]);
const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const MINGAP = 2.6;
const clips = [];
let lastT = -99;
for (const c of clipsR.filter((c) => !inFull(c[0]))) { if (c[0] - lastT < MINGAP) continue; clips.push(c); lastT = c[0]; }

if (MODE === "match") {
  const match = clips.map(([t, name, query, concept]) => ({ name, concept, query, dur: DLDUR }));
  fs.mkdirSync("public/broll", { recursive: true });
  fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(match, null, 2));
  console.log(`match_${SLUG}.json: ${match.length} clips a matchear`);
  if (warn.length) console.log(`⚠ NO encontradas (${warn.length}):\n  ` + warn.join("\n  "));
  process.exit(0);
}

const have = (name) => fs.existsSync(`public/broll/${name}.mp4`);
const IMG_STYLE = ", documentary photo that looks like a real casual snapshot, slightly soft focus, uneven natural light, real texture, small imperfections, nothing polished, no AI look, low saturation, muted colors, no text, no captions, no watermark, no logo";
const nClip = clips.filter((c) => have(c[1])).length;
const avStarts = AV_FULL.map(([s]) => s);
const OV = 0.5;
const bounds = [...clips.map((c) => c[0]), ...avStarts, TOTAL].sort((a, b) => a - b);
const nextBound = (t) => bounds.find((b) => b > t + 1e-6) ?? TOTAL;
let beats = clips.map(([t, name, query, concept]) => {
  const dur = +Math.min(nextBound(t) - t + OV, TOTAL - t).toFixed(2);
  if (have(name)) return { id: name, start: t, dur, kind: "raw", src: `broll/${name}.mp4`, darken: 0 };
  return { id: name, start: t, dur, kind: "raw", src: `img/${name}.png`, darken: 0, gen: { type: "image", name, prompt: (Array.isArray(query) ? query[0] : query) + IMG_STYLE } };
});

// ── COMPONENTES ──
const ck = (text, note) => (note ? { text, note, state: "done" } : { text, state: "done" });
const atC = (phrase) => at(phrase, 0);
const COMPONENTS = [
  { p: "you would not be able to tell it from an egg laid an hour ago", id: "cmp_hook", kind: "impact", image: "img/cmp_hook_bg.png",
    setup: "A year old.", impact: "Fresh as the day it was laid. No fridge.", impactAccent: "cold", hitAt: 1.2, boom: 0, darken: 0.42,
    bg: "a crock full of eggs and one fresh egg cracked into a pan, rustic kitchen" },
  { p: "seal the doors", id: "cmp_secret", kind: "impact", image: "img/cmp_secret_bg.png",
    setup: "The whole secret:", impact: "Seal the pores of the shell.", impactAccent: "cold", hitAt: 1.2, boom: 0, darken: 0.42,
    bg: "extreme close up of an eggshell being sealed, macro" },
  { p: "against the law to wash an egg", id: "cmp_europe", kind: "callout", hue: "amber", accent: "danger",
    figure: "ILLEGAL", eyebrow: "In Europe", caption: "it is against the law to WASH an egg — they keep them on the shelf, unrefrigerated. Only here do we wash off the seal and then must chill them.",
    bg: "brown eggs on an open unrefrigerated european store shelf" },
  { p: "Here is everything you need", id: "cmp_materials", kind: "checklist", hue: "cold", accent: "good",
    title: "The whole method", eyebrow: "~$2 · keeps a year",
    items: [ck("Fresh UNWASHED eggs"), ck("Pickling lime (1 oz per quart, by weight)"), ck("A crock or glass jar of water"), ck("Cover them · cool, dark spot")],
    bg: "a crock, a bag of pickling lime, and fresh eggs on a table" },
  { p: "there are only four", id: "cmp_mistakes", kind: "checklist", hue: "amber", accent: "danger",
    title: "The 4 mistakes", eyebrow: "…and every one is easy to avoid",
    items: [ck("Never use washed / store eggs"), ck("Only whole, sound, clean eggs"), ck("Keep them under the water, cool"), ck("No rusting metal · mark the date")],
    bg: "a crock of eggs in limewater with a few eggs beside it" },
  { p: "right up into the 1940s", id: "cmp_history", kind: "timeline", eyebrow: "It is not new", title: "Proven for centuries",
    events: [{ year: "1800s", label: "waterglass on farms & ships", accent: "amber" }, { year: "1940s", label: "wartime kitchens everywhere", accent: "amber" }, { year: "Now", label: "the fridge made folks forget", accent: "danger" }] },
  { p: "put the pennies to it", id: "cmp_cost", kind: "bars", hue: "amber", accent: "good", unit: "USD",
    title: "A year of eggs", eyebrow: "Store vs. the crock",
    bars: [{ label: "Store, twice a week", value: 100, display: "$100s/yr", sub: "+ empty shelves when it's bad", tone: "danger" }, { label: "A crock + lime", value: 2, display: "~$2", sub: "keeps a year, no power", winner: true }] },
  { p: "here is exactly what I want you to do this week", id: "cmp_recap", kind: "process", hue: "cold", accent: "good",
    title: "This week", eyebrow: "Start one crock",
    steps: [{ title: "Get fresh unwashed eggs" }, { title: "1 oz lime per quart of water" }, { title: "Submerge · cover · cool & dark" }] },
  { p: "kept butter sweet", id: "cmp_next", kind: "nextvideo", kicker: "Next time",
    title: "Keep butter sweet for a year — no icebox", sub: "Buried in nothing but a crock of cold water and one thing drawn up from the well." },
];
let nComp = 0;
const placed = new Set();
for (const c of COMPONENTS) {
  const ct = atC(c.p);
  if (ct == null) continue;
  let idx = -1;
  for (let i = 0; i < beats.length; i++) { if (beats[i].start <= ct + 0.01) { if (!placed.has(beats[i].id)) idx = i; } else break; }
  if (idx < 0) continue;
  const start = beats[idx].start;
  const D = 6.2;
  const { p, bg, kind, ...rest } = c;
  const ab = { id: c.id, start, dur: D, kind };
  delete rest.id;
  Object.assign(ab, rest);
  if (bg) { ab.image = `img/${c.id}_bg.png`; ab.gen = { type: "image", name: `${c.id}_bg`, prompt: bg + IMG_STYLE }; }
  let rm = 1;
  while (idx + rm < beats.length && beats[idx + rm].start < start + D - 0.05 && !placed.has(beats[idx + rm].id)) rm++;
  beats.splice(idx, rm, ab);
  placed.add(c.id);
  nComp++;
}

// ── tiling ──
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

// ── OVERLAYS (data tags + 3 guías) ──
const st = (p, value, suffix, label, corner = "TL") => { const t = at(p); return t == null ? null : { id: `ov_${Math.round(t)}`, start: t, dur: 3.6, kind: "stattag", overlay: true, value, suffix, label, corner, accent: "cold" }; };
const stx = (p, text, label, corner = "TL") => { const t = at(p); return t == null ? null : { id: `ovx_${Math.round(t)}`, start: t, dur: 3.6, kind: "stattag", overlay: true, text, label, corner, accent: "amber" }; };
const ph = (p, text, pos = "bottom", accent = "cold") => { const t = at(p); return t == null ? null : { id: `ovp_${Math.round(t)}`, start: t, dur: 3.4, kind: "phrasetag", overlay: true, text, pos, accent }; };
const guide = (p, text) => { const t = at(p); return t == null ? null : { id: `ovg_${Math.round(t)}`, start: t, dur: 4.2, kind: "phrasetag", overlay: true, text, pos: "bottom", accent: "amber" }; };
const OVERLAYS = [
  ph("There is no refrigerator in this house", "A year of eggs · no fridge", "top", "amber"),
  ph("7 000 tiny holes", "7,000 pores in every shell", "bottom", "cold"),
  ph("The washed egg keeps you a customer forever", "Washed = you must keep buying", "bottom", "danger"),
  stx("against the law to wash an egg", "ILLEGAL", "to wash eggs in Europe", "TR"),
  st("one ounce of pickling lime", 1, " oz", "lime per quart (by weight)", "TL"),
  guide("free guide i left in the comments", "📌 Free guide — pinned in the comments"),
  ph("floating egg is filled with gas", "Floats = bad · sinks = good", "bottom", "cold"),
  guide("in that same free guide in the comments", "📌 All the methods — free guide (comments)"),
  ph("The store wants you helpless and coming back", "The crock makes you free", "bottom", "cold"),
  guide("in the free guide sitting right down there in the comments", "📌 Free guide + 90 old skills — in the comments"),
];
beats.push(...OVERLAYS.filter((o) => o && !inFull(o.start)));

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, clipsfirst: true, maxRawDur: 8, beats }, null, 2));

// ── ventanas avatar: PiP QUIETO cornerBR ──
const timeline = beats.filter((b) => !b.overlay).sort((a, b) => a.start - b.start);
const CORNER = "cornerBR";
const pip = [];
for (let i = 0; i < timeline.length; i++) {
  if (i % 3 === 1 && !inFull(timeline[i].start)) {
    const s = timeline[i].start;
    const e = Math.min(s + 6.5, timeline[i].start + (timeline[i].dur || 5));
    pip.push([s, e, CORNER]);
  }
}
const firstClip = clips.length ? clips[0][0] : OPEN;
const modeAt = (t) => {
  if (t < firstClip - 1e-6) return "full";
  if (AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6)) return "full";
  const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
  return p ? p[2] : "hidden";
};
const pts = [...new Set([0, firstClip, ...AV_FULL.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = [];
let curM = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== curM) { windows.push({ start: +t.toFixed(2), mode: m }); curM = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, `// avatar_${SLUG}.gen.ts — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_HUEVOS = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0);
console.log(`=== build_${SLUG} ===`);
console.log(`beats: ${timeline.length} (+${beats.length - timeline.length} overlays) · clips: ${nClip} · imágenes: ${timeline.length - nClip - nComp} · componentes: ${nComp}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP(${CORNER}): ${pip.length} · windows: ${windows.length}`);
if (warn.length) console.log(`⚠ NO encontradas (${warn.length}):\n  ` + warn.join("\n  "));
