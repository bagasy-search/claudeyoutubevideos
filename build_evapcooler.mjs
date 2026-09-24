// build_evapcooler.mjs — CLON on-brand del cooler evaporativo (Jennies 2.3M) · Amish Off-Grid Claudio.
// "This $12 Amish Trick Drops a Room 20° in the Worst Heat — No AC, No Power."
// Enfriamiento evaporativo PASIVO (paño/arpillera mojada + brisa). Anclado al ms de Whisper.
// PiP QUIETO en cornerBR (no rota). 3 menciones de guía (theplainalmanac) → overlays.
// Modo: node build_evapcooler.mjs match | node build_evapcooler.mjs
import fs from "fs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const SLUG = "evapcooler";
const caps = JSON.parse(fs.readFileSync("public/captions_evapcooler.json", "utf8"));
const TOTAL = +(caps[caps.length - 1].endMs / 1000).toFixed(2);
const OPEN = 0.1;
const DLDUR = 6;

// ── anchoring por FRASE ──
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

// ── AV FULL: momentos personales (avatar full) ──
const AV_FULL = [
  [OPEN, at("Go on")],                                        // apertura
  [at("kept this house cool through heat"), at("wander off")],// promesa: te enseño
  [at("The summer I was a boy"), at("be forgotten")],         // anécdota del calor mortal
  [at("come and subscribe"), TOTAL],                          // sign-off
].filter((w) => w[0] != null && w[1] != null);

// ── CLIPS: [frase-ancla, name, query(EN visual+sujeto), concepto] en orden ──
const CLIPS = [
  // HOOK
  ["on that porch today", "ec_porch_heat", ["hot dry summer farm at midday heat haze", "scorched field under blazing sun"], "el calor aplastante afuera"],
  ["The dogs won't move", "ec_dog_heat", ["a dog lying panting in the shade heat", "farm dog flat in the shade summer"], "los perros no se mueven del calor"],
  ["keeps a shawl on the chair", "ec_cool_parlor", ["cool dim old farmhouse parlor interior", "shaded rustic living room cool"], "adentro, fresco"],
  ["no air conditioner in this house", "ec_no_ac", ["old window air conditioner unit turned off", "empty farmhouse window no ac"], "sin aire acondicionado"],
  ["no wire running to a single thing", "ec_no_wire", ["bare farmhouse wall no outlets no wires", "simple room with no electricity"], "ni un cable"],
  ["heat that wilted the corn", "ec_wilted_corn", ["wilted drooping corn field in drought heat", "dry cracked field in a heat wave"], "el maíz marchito por el calor"],
  ["nothing but water, a little cloth", "ec_water_cloth", ["a bucket of water and a cloth rag", "wet cloth and pail on a table"], "solo agua y un paño"],
  ["in your own window, for about twelve dollars", "ec_window_cheap", ["open farmhouse window with a wet cloth", "simple window cooler setup"], "en tu ventana, doce dólares"],
  // SECRET
  ["climbed out of a river", "ec_river_wet", ["person wet climbing out of a river breeze", "wet swimmer shivering in wind"], "salir mojado del río y tener frío"],
  ["fanned a wet arm", "ec_wet_arm", ["water drops evaporating off skin close up", "wet forearm drying in the air"], "un brazo mojado al viento"],
  ["turns from wet into vapor", "ec_evaporation", ["water evaporating into vapor close up", "steam rising off wet surface"], "el agua se vuelve vapor"],
  ["it has to steal heat to do it", "ec_heat_steal", ["heat shimmer rising off a hot surface", "thermal heat waves in air"], "roba calor para irse"],
  ["the same reason sweat cools a man", "ec_sweat", ["sweat on a brow in the heat close up", "farmer wiping sweat forehead"], "por eso el sudor enfría"],
  ["a wet clay jug keeps water cold", "ec_clay_jug", ["porous clay water jug sweating cool", "earthenware pot with water desert"], "la jarra de barro fría"],
  ["the breeze off a lake is cool", "ec_lake_breeze", ["cool breeze over a lake surface", "wind across water on a hot day"], "la brisa del lago, fresca"],
  ["hanging the wet sheet", "ec_wet_sheet1", ["a wet white sheet hanging in a breeze", "damp bedsheet drying on a line"], "colgar la sábana mojada"],
  ["95 degrees outside", "ec_thermo_hot", ["outdoor thermometer reading high heat", "thermometer in the sun 95 degrees"], "termómetro alto afuera"],
  ["down around 75", "ec_thermo_cool", ["indoor thermometer reading cool", "thermometer showing a lower temperature"], "adentro, mucho más fresco"],
  // OLD WAYS
  ["you wet it through with cold well water", "ec_well_water", ["drawing cold water from an old well bucket", "hand well pump cold water"], "agua fría del pozo"],
  ["hang it right across an open window", "ec_sheet_window", ["wet sheet hung across an open window", "damp cloth over a window opening"], "la sábana cruzada en la ventana"],
  ["like it came out of a cellar", "ec_cellar_cool", ["cool air drifting from a stone cellar", "cold draft from a root cellar door"], "fresco como de un sótano"],
  ["wet a bath towel", "ec_towel_test", ["wet towel hung in a window test", "damp towel over a windowsill breeze"], "probalo con una toalla mojada"],
  ["a porous clay pot", "ec_olla", ["unglazed porous clay pot full of water", "earthen olla pot on a windowsill"], "una olla de barro porosa"],
  // BUILD
  ["something to hold water at the top", "ec_bucket", ["a plain bucket of water on a shelf", "pail of water raised up high"], "un balde de agua arriba"],
  ["your cooling cloth", "ec_pad_hero", ["a thick wet evaporative cooler pad", "damp fibrous cooling pad close up"], "el pad, el corazón del asunto"],
  ["Burlap is the old standby", "ec_burlap", ["rough burlap feed sack cloth texture", "wet burlap sack hanging"], "la arpillera"],
  ["that stiff blue-and-white honeycomb pad", "ec_honeycomb_pad", ["blue and white honeycomb evaporative cooler pad", "swamp cooler aspen pad"], "el pad panal azul y blanco"],
  ["a simple frame to hang it in", "ec_frame", ["a simple wooden frame with a screen", "old window screen frame wood"], "un marco simple"],
  ["a pan or a trough at the bottom", "ec_catch_pan", ["a shallow pan catching dripping water", "water tray under a cooler pad"], "una bandeja abajo"],
  ["you let it drip, slow and steady", "ec_drip", ["water dripping slowly down a wet pad", "slow drip onto a cloth pad"], "el goteo lento y parejo"],
  ["the water wicks down through the burlap", "ec_wick", ["water wicking down damp cloth close up", "moisture spreading through burlap"], "el agua baja por la arpillera"],
  ["Set that wet pad in a window on the shady side", "ec_window_shade", ["wet cooler pad in a shaded window", "damp pad in a north-facing window"], "el pad en la ventana a la sombra"],
  // Texas cooler + materials
  ["a Texas cooler, or a cooler box", "ec_cooler_box", ["homemade wooden window cooler box", "old texas swamp cooler in a window"], "el cooler box de tres lados"],
  ["wet pad on three sides", "ec_three_sides", ["a box with wet pads on three sides", "window cooler box with screen sides"], "pads en tres caras"],
  ["Plain burlap — feed sacks", "ec_feed_sacks", ["stacked burlap feed sacks", "old jute grain sacks"], "sacos de arpillera"],
  ["hard water leaves a white crust of lime", "ec_lime_scale", ["white mineral lime crust on a pad", "hard water scale buildup"], "la costra de cal tapa el pad"],
  // PLACEMENT + night flush
  ["it must be on the SHADED side", "ec_shade_house", ["shaded north side of a farmhouse", "house wall in cool shade"], "el lado sombreado de la casa"],
  ["give the cool air somewhere to GO", "ec_airflow", ["air flowing through an open house", "cross breeze through a room"], "el aire tiene que salir"],
  ["a window on the far side", "ec_high_window", ["an open upstairs window high up", "attic gable vent open"], "una ventana alta del otro lado"],
  ["the hot air, which rises", "ec_hot_rises", ["hot air rising heat shimmer indoors", "warm air venting out a high window"], "el aire caliente sube y sale"],
  ["the room you sleep in", "ec_bedroom", ["a simple cool rustic bedroom window", "old farmhouse bedroom shaded"], "el cuarto donde dormís"],
  ["heat lives in the walls and the floors", "ec_thick_walls", ["thick old stone farmhouse walls", "heavy timber and stone wall interior"], "el calor vive en las paredes"],
  ["throw every window and door wide open", "ec_windows_open", ["all windows open at dusk farmhouse", "open windows cool evening breeze"], "abrir todo de noche"],
  ["you shut the house up tight", "ec_shut_house", ["closing shutters and curtains against sun", "drawing curtains in the morning"], "cerrar todo de día"],
  ["north wall near two foot of stone", "ec_stone_wall", ["thick stone farmhouse wall exterior", "two foot thick stone wall"], "muro de piedra de dos pies"],
  // HONEST LIMIT
  ["works like a wonder in DRY heat", "ec_dry_heat", ["dry desert heat cracked ground", "arid plains under hot sun"], "funciona en calor SECO"],
  ["out west, in the plains", "ec_plains", ["dry open western plains landscape", "arid grassland heat"], "el oeste, las llanuras"],
  ["in wet, muggy, coastal heat", "ec_humid", ["humid muggy coastal air haze", "sticky tropical humidity"], "el calor húmedo pegajoso"],
  ["wet your finger and hold it up", "ec_finger_test", ["a wet finger held up to test the air", "hand testing the breeze"], "el dedo mojado al aire"],
  // BOOST + water
  ["set a small fan behind the wet pad", "ec_fan", ["a small fan behind a wet cooler pad", "fan blowing through damp pad"], "un ventilador chico detrás"],
  ["a small solar fan", "ec_solar_fan", ["a small solar panel powering a fan", "off grid solar fan setup"], "un ventilador solar"],
  ["a bigger barrel up high", "ec_barrel", ["a raised water barrel feeding a drip", "elevated rain barrel with tubing"], "un barril arriba"],
  ["a rain barrel up on the roof", "ec_rain_barrel", ["a rain barrel collecting roof water", "rooftop rain catchment barrel"], "un barril de lluvia en el techo"],
  // MISTAKES
  ["a dry pad does nothing", "ec_dry_pad", ["a dried out crusty cooler pad", "dry cracked cloth pad"], "un pad seco no hace nada"],
  ["A cooler in a sunny window", "ec_sunny_window", ["harsh sun blazing on a window", "sunlight beating on a windowsill"], "el sol pegándole a la ventana"],
  // SCALING + body
  ["you set a few small ones", "ec_multi", ["several wet pads in different windows", "multiple window coolers in a house"], "varios coolers chicos"],
  ["wet kerchief tied around the back", "ec_wet_neck", ["a wet bandana on the back of the neck", "damp cloth on neck in heat"], "un pañuelo mojado en la nuca"],
  ["the bare feet set in a pan of cool water", "ec_feet_water", ["bare feet soaking in a pan of water", "feet in a basin of cool water"], "los pies en agua fresca"],
  // HISTORY
  ["the people of Persia", "ec_persia", ["ancient persian desert city ruins", "old middle eastern adobe town"], "los persas, hace milenios"],
  ["tall towers, wind-catchers", "ec_windcatcher", ["ancient persian windcatcher tower badgir", "tall desert wind tower architecture"], "las torres atrapa-viento"],
  ["made and kept ice", "ec_yakhchal", ["ancient persian yakhchal ice house dome", "desert mud dome ice pit"], "el yakhchāl que hacía hielo"],
  ["old farmhouses out west had a", "ec_cooler_room", ["old western farmhouse cooler pantry", "screened cooler room window burlap"], "el cuarto frío de las chacras viejas"],
  ["the electric came, and the machine came", "ec_ac_unit", ["modern air conditioner unit on a house", "electric ac condenser outdoor"], "llegó el aire acondicionado"],
  ["came with a meter on it", "ec_meter", ["an electric meter spinning fast", "power meter on a house wall"], "vino con un medidor"],
  // PAYOFF
  ["heat that shimmered off the road", "ec_shimmer_road", ["heat haze shimmering off a hot road", "mirage heat on asphalt summer"], "el calor temblando en el camino"],
  ["the cool draft come off that dripping pad", "ec_cool_pad2", ["cool air off a dripping wet cooler pad", "damp pad cooling a room breeze"], "la corriente fresca del pad"],
  ["you can hang one this very afternoon", "ec_hang_today", ["hanging a wet cloth cooler in a window", "setting up a window cooler pad"], "lo colgás esta misma tarde"],
];

// ── resolver clips con cursor ──
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
for (const c of clipsR.filter((c) => !inFull(c[0]))) {
  if (c[0] - lastT < MINGAP) continue;
  clips.push(c);
  lastT = c[0];
}

if (MODE === "match") {
  const match = clips.map(([t, name, query, concept]) => ({ name, concept, query, dur: DLDUR }));
  fs.mkdirSync("public/broll", { recursive: true });
  fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(match, null, 2));
  console.log(`match_${SLUG}.json: ${match.length} clips a matchear`);
  if (warn.length) console.log(`⚠ NO encontradas (${warn.length}):\n  ` + warn.join("\n  "));
  process.exit(0);
}

// ── BUILD HÍBRIDO ──
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

// ── COMPONENTES (kinds existentes, anclados por frase) ──
const ck = (text, note) => (note ? { text, note, state: "done" } : { text, state: "done" });
const atC = (phrase) => at(phrase, 0);
const COMPONENTS = [
  { p: "Drying water pulls the heat out of the air", id: "cmp_secret", kind: "impact", image: "img/cmp_secret_bg.png",
    setup: "The whole secret:", impact: "Drying water pulls heat out of the air.", impactAccent: "cold", hitAt: 1.2, boom: 0, darken: 0.42,
    bg: "water evaporating off a wet cloth in a sunny window, cool mist" },
  { p: "drop a hot room 15 20 degrees", id: "cmp_stat20", kind: "stat", hue: "cold", accent: "good",
    value: 20, prefix: "-", suffix: "°", label: "in a hot dry room, from a bucket of water", eyebrow: "The drop" },
  { p: "Here is everything you need", id: "cmp_materials", kind: "checklist", hue: "amber", accent: "good",
    title: "The whole cooler", eyebrow: "~$12 · any hardware store",
    items: [ck("A bucket of water (up top)"), ck("A wet pad — burlap or aspen"), ck("A frame / old window screen"), ck("A catch pan below")],
    bg: "a bucket, burlap cloth, wooden frame and a pan on a workbench" },
  { p: "on the SHADED side", id: "cmp_place", kind: "checklist", hue: "cold", accent: "good",
    title: "Where to put it", eyebrow: "Get this right or it does nothing",
    items: [ck("Shady side of the house"), ck("Open a HIGH window far side"), ck("Let the house breathe through")],
    bg: "a wet cooler pad in a shaded farmhouse window, breeze" },
  { p: "the Pennsylvania Dutch always did", id: "cmp_nightflush", kind: "process", hue: "cold", accent: "good",
    title: "Night flush", eyebrow: "Costs nothing",
    steps: [{ title: "Open wide at night" }, { title: "Flush the heat from the walls" }, { title: "Shut tight by day" }] },
  { p: "works like a wonder in DRY heat", id: "cmp_climate", kind: "splitlist", palette: "B",
    title: "Honest limit", items: ["DRY heat → drops 15-20° (a wonder)", "MUGGY heat → weak by day", "Run it at night when air dries"] },
  { p: "Let me give you the mistakes now", id: "cmp_mistakes", kind: "checklist", hue: "amber", accent: "danger",
    title: "4 mistakes to avoid", eyebrow: "Then it just works",
    items: [ck("Never let the pad go dry"), ck("Give the air a way out"), ck("Keep it out of the sun"), ck("Ease off on muggy days")],
    bg: "a wet cloth cooler in a window with tools beside it" },
  { p: "the people of Persia cooled their homes", id: "cmp_history", kind: "timeline", eyebrow: "It is not new", title: "3,000 years old",
    events: [{ year: "1000 BC", label: "Persian wind-catchers & ice houses", accent: "amber" }, { year: "1800s", label: "farmhouse cooler rooms", accent: "amber" }, { year: "1900s", label: "the AC & the meter buried it", accent: "danger" }] },
  { p: "thirty, forty, fifty dollars a month", id: "cmp_cost", kind: "bars", hue: "amber", accent: "good", unit: "USD",
    title: "Cost over 10 summers", eyebrow: "Staying cool",
    bars: [{ label: "Window AC", value: 100, display: "~$1000s", sub: "power + replace", tone: "danger" }, { label: "Wet pad cooler", value: 1, display: "$12 once", sub: "water off the roof", winner: true }] },
  { p: "one more forgotten skill like this", id: "cmp_next", kind: "nextvideo", kicker: "Next time",
    title: "Keep a whole cellar of food cold all summer", sub: "No ice, no power — the old way to store a season's food underground." },
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
  ph("no wire running to a single thing", "No AC · no fan · no power", "top", "amber"),
  ph("Drying water pulls the heat out of the air", "Drying water = cooling", "bottom", "cold"),
  st("95 degrees outside", 95, "°", "outside", "TR"),
  st("down around 75", 78, "°", "inside", "TL"),
  guide("grab it and follow along", "📌 Free build guide — in the comments"),
  ph("Open wide at night", "Open at night · shut by day", "bottom", "cold"),
  ph("works like a wonder in DRY heat", "Works best in DRY heat", "top", "amber"),
  guide("how big a pad for how big a room", "📌 Sizing table — in the free guide (comments)"),
  ph("a dry pad does nothing", "Keep the pad wet — always", "bottom", "danger"),
  stx("thirty, forty, fifty dollars a month", "$1000s", "AC over 10 yrs", "TR"),
  ph("No wire. No motor. No bill", "No wire · no motor · no bill", "bottom", "cold"),
  guide("in the guide I put together for you", "📌 Free guide + 90 old skills — in the comments"),
];
beats.push(...OVERLAYS.filter((o) => o && !inFull(o.start)));

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({
  video: SLUG, avatar: `${SLUG}_opt.mp4`, clipsfirst: true, maxRawDur: 8, beats,
}, null, 2));

// ── ventanas de avatar: PiP QUIETO en cornerBR ──
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
export const TOTAL_EVAPCOOLER = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0);
console.log(`=== build_${SLUG} ===`);
console.log(`beats: ${timeline.length} (+${beats.length - timeline.length} overlays) · clips: ${nClip} · imágenes: ${timeline.length - nClip - nComp} · componentes: ${nComp}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP(${CORNER}): ${pip.length} · windows: ${windows.length}`);
if (warn.length) console.log(`⚠ NO encontradas (${warn.length}):\n  ` + warn.join("\n  "));
