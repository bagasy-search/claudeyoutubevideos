// build_cywater.mjs — Amish AVATAR (canal @claudioyoder-amish), off-grid WATER: spring box + gravity ("still working after 80 years").
// CLIPS-first híbrido: consume los s_NN de _v3/cywater_beats.json anclados al ms de Whisper.
// COLD-OPEN = TRAILER (regla amish): montaje rápido con VO del avatar + estampas de texto.
// AISLADO POR SLUG: broll/cywater/ + img/cywater/ (gotcha colisión carpeta compartida).
// Uso: node build_cywater.mjs → beatsheet/cywater.json + src/VideoEdit/avatar_cywater.gen.ts
import fs from "fs";

const TOTAL = 1035.28;
const OPEN = 1.8;
const COLD_END = 48.0;
const OV = 0.5;

const HERO = ", casual documentary phone snapshot, rustic Appalachian homestead, green mossy hillside spring, cold clear water, warm natural daylight, nothing polished, no AI look, low saturation, soft muted colors, natural weathered hands, no text, no watermark";
const IMG_STYLE = HERO;
const hero = (id, prompt) => ({ name: `cywater/${id}`, prompt: prompt + HERO });

// ── avatar a PANTALLA COMPLETA: aterriza tras el trailer, la historia de la bisabuela, el cierre ──
const AV_FULL = [
  [48.0, 62.0],        // tras el trailer: "let me back up... how he did it"
  [636.0, 660.0],      // la historia personal: "my great-grandmother kept her whole dairy in the springhouse"
  [1010.0, TOTAL],     // cierre: next time + "go find your green spot... drink up"
];

// ── COLD OPEN = TRAILER (1.8–48): cortes rápidos de los payoffs de AGUA + estampas + 1 impact ──
const COLD_OPEN = [
  { id: "cw_h_cup", start: 1.8, dur: 2.6, kind: "raw", src: "img/cywater/cw_h_cup.png", darken: 0,
    gen: { type: "image", ...hero("cw_h_cup", "weathered hands holding an old tin cup full of clear cold spring water, water droplets, dim green hillside behind") } },
  { id: "cw_h_spring", start: 4.4, dur: 2.2, kind: "raw", src: "img/cywater/cw_h_spring.png", darken: 0,
    gen: { type: "image", ...hero("cw_h_spring", "clear cold water flowing out of a green mossy rock on a wooded hillside, ferns, wet stones") } },
  { id: "cw_h_impact", start: 6.6, dur: 4.6, kind: "impact", image: "img/cywater/cw_h_spring.png",
    setup: "Running since the 1940s.", impact: "Still cold.", impactAccent: "cold", hitAt: 2.0, boom: 0, darken: 0.42 },
  { id: "cw_h_pipe", start: 11.2, dur: 2.8, kind: "raw", src: "img/cywater/cw_h_pipe.png", darken: 0,
    gen: { type: "image", ...hero("cw_h_pipe", "a black poly water pipe running down an open dug trench on a grassy green hillside toward a farmhouse below") } },
  { id: "cw_h_key1", start: 14.0, dur: 3.8, kind: "keyphrase", text: "No pump. No power.", src: "img/cywater/cw_h_box.png", accent: "cold", fontSize: 100,
    gen: { type: "image", ...hero("cw_h_box", "a concrete spring box lid mounded with grass on a hillside, a pipe coming out the low side, water trickling") } },
  { id: "cw_h_dig", start: 17.8, dur: 2.6, kind: "raw", src: "img/cywater/cw_h_dig.png", darken: 0,
    gen: { type: "image", ...hero("cw_h_dig", "weathered hands digging a shovel into a wet green hillside where clear water is seeping out") } },
  { id: "cw_h_eye", start: 20.4, dur: 2.6, kind: "raw", src: "img/cywater/cw_h_eye.png", darken: 0,
    gen: { type: "image", ...hero("cw_h_eye", "clear cold water welling up and filling a small dug hollow in gravel on a hillside, the eye of a spring") } },
  { id: "cw_h_key2", start: 23.0, dur: 3.8, kind: "keyphrase", text: "Free. For 80 years.", src: "img/cywater/cw_h_house.png", accent: "good", fontSize: 96,
    gen: { type: "image", ...hero("cw_h_house", "an old white farmhouse at the bottom of a green hill, a wooded spring hillside rising above it, golden light") } },
  { id: "cw_h_springhouse", start: 26.8, dur: 3.0, kind: "raw", src: "img/cywater/cw_h_springhouse.png", darken: 0,
    gen: { type: "image", ...hero("cw_h_springhouse", "cold spring water running through a stone trough inside a small springhouse, crocks and glass jugs of milk sitting in the cold water") } },
  { id: "cw_h_grandpa", start: 29.8, dur: 4.0, kind: "raw", src: "img/cywater/cw_h_grandpa.png", darken: 0,
    gen: { type: "image", ...hero("cw_h_grandpa", "vintage sepia photograph of a young homesteader in the 1940s digging a spring on a hillside with a shovel, nostalgic, film grain") } },
  { id: "cw_h_faucet", start: 33.8, dur: 3.0, kind: "raw", src: "img/cywater/cw_h_faucet.png", darken: 0,
    gen: { type: "image", ...hero("cw_h_faucet", "cold clear water pouring hard from a simple kitchen tap into an enamel basin, no pump, gravity fed") } },
  { id: "cw_h_key3", start: 36.8, dur: 4.0, kind: "keyphrase", text: "Gravity does the work.", src: "img/cywater/cw_h_hill.png", accent: "good", fontSize: 92,
    gen: { type: "image", ...hero("cw_h_hill", "a wide green wooded hillside rising above a small farm, a spring near the top, morning mist") } },
  { id: "cw_h_overflow", start: 40.8, dur: 3.4, kind: "raw", src: "img/cywater/cw_h_overflow.png", darken: 0,
    gen: { type: "image", ...hero("cw_h_overflow", "clear water running out of a screened overflow pipe from a spring box and down a mossy hillside") } },
  { id: "cw_h_drink", start: 44.2, dur: 3.8, kind: "raw", src: "img/cywater/cw_h_drink.png", darken: 0,
    gen: { type: "image", ...hero("cw_h_drink", "an old man's weathered hand dipping a tin cup into cold clear spring water welling up from the ground") } },
];

// ── CLIPS = beats del cuerpo, desde _v3/cywater_beats.json (s_NN ya en disco, aislados en cywater/) ──
const BEATS_SRC = JSON.parse(fs.readFileSync("_v3/cywater_beats.json", "utf8").replace(/^﻿/, ""));
const CLIPS = BEATS_SRC.map((b) => [ +(b.ms / 1000).toFixed(2), b.name, (b.queries && b.queries.length ? b.queries : [b.desc || b.phrase]), b.desc || b.phrase ]);
CLIPS.sort((a, b) => a[0] - b[0]);

const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const MINGAP = Number(process.env.CYWATER_MINGAP) || 3.6;   // amish PAUSADO: ~6s medio en el cuerpo
const brollImg = (name) => { for (const e of ["jpg", "jpeg", "png"]) if (fs.existsSync(`public/broll/cywater/${name}.${e}`)) return `broll/cywater/${name}.${e}`; return null; };
const realJpg = (name) => { for (const e of ["jpg", "jpeg", "png"]) if (fs.existsSync(`public/broll/cywater/${name}.${e}`)) return `broll/cywater/${name}.${e}`; return null; };
const isReal = (name) => fs.existsSync(`public/broll/cywater/${name}.mp4`) || !!brollImg(name);
const clips = [];
let lastT = -99;
for (const c of CLIPS.filter((c) => !inFull(c[0]) && c[0] >= COLD_END - 1e-6)) {
  if (c[0] - lastT < MINGAP && !isReal(c[1])) continue;
  clips.push(c);
  lastT = c[0];
}

const have = (name) => fs.existsSync(`public/broll/cywater/${name}.mp4`);
const imgSrc = (name) => { for (const e of ["png", "jpg", "jpeg", "webp"]) if (fs.existsSync(`public/img/cywater/${name}.${e}`)) return `img/cywater/${name}.${e}`; return null; };
const nClip = clips.filter((c) => have(c[1])).length;

const avStarts = AV_FULL.map(([s]) => s);
const bounds = [...clips.map((c) => c[0]), ...avStarts, TOTAL].sort((a, b) => a - b);
const nextBound = (t) => bounds.find((b) => b > t + 1e-6) ?? TOTAL;

const beats = clips.map(([t, name, query, concept]) => {
  const dur = +Math.min(nextBound(t) - t + OV, TOTAL - t).toFixed(2);
  if (have(name)) return { id: name, start: t, dur, kind: "raw", src: `broll/cywater/${name}.mp4`, darken: 0 };
  const bi = brollImg(name);
  if (bi) return { id: name, start: t, dur, kind: "raw", src: bi, darken: 0 };
  const im = imgSrc(name);
  if (im) return { id: name, start: t, dur, kind: "raw", src: im, darken: 0 };
  const vq = Array.isArray(query) ? query[0] : query;
  return { id: name, start: t, dur, kind: "raw", src: `img/cywater/${name}.png`, darken: 0, gen: { type: "image", name: `cywater/${name}`, prompt: vq + IMG_STYLE } };
});

// cold-open: preferir FOTO REAL (Bing) sobre IA (material real; IA solo si no hay)
for (const c of COLD_OPEN) {
  if (c.kind === "impact") {
    const nm = (c.image || "").split("/").pop().replace(/\.(png|jpg|jpeg)$/, "");
    const rj = realJpg(nm) || realJpg(c.id);
    if (rj) c.image = rj;
  } else {
    const rj = realJpg(c.id);
    if (rj) { c.src = rj; delete c.gen; }
  }
}

// reemplazar los beats del rango cold-open por el TRAILER bespoke
for (let i = beats.length - 1; i >= 0; i--) if (beats[i].start < COLD_END - 1e-6) beats.splice(i, 1);
beats.unshift(...COLD_OPEN);
beats.sort((a, b) => a.start - b.start);

// ── COMPONENTES amish (≥8 kinds distintos, ~45 para el density_gate) ──
const ck = (text, note) => (note ? { text, note, state: "done" } : { text, state: "done" });
const COMPONENTS = [
  // ── WHY / ENEMY (48–150) ──
  { t: 55, id: "cmp_threeways", kind: "splitlist", palette: "B",
    title: "The old ways to get water", items: ["Dig a well and pump it by hand", "Catch the rain off the roof", "Find a spring — gravity does it free", "The spring was always the good one"] },
  { t: 72, id: "cmp_notpuddle", kind: "callout", hue: "cold", accent: "good",
    figure: "A spring is not a puddle", eyebrow: "What a spring really is", caption: "it's where the water inside the hill finds a crack and pushes up out of the ground on its own",
    bg: "clear water welling up out of gravel and rock at the base of a green hillside" },
  { t: 93, id: "cmp_gravityfree", kind: "callout", hue: "amber", accent: "good",
    figure: "Let gravity do the work", eyebrow: "Free, forever", caption: "no bill, no line from the road, no motor — just the ground being higher up there than it is down here",
    bg: "a green wooded hillside rising above a small farmhouse, water running downhill" },
  { t: 108, id: "cmp_sponge", kind: "splitlist", palette: "G",
    title: "The hill is a giant sponge", items: ["Rain soaks down through the ridge", "It travels underground, filtered", "It comes out lower, cold and clean", "Storage, not weather — steady in August"] },
  { t: 130, id: "cmp_coldtemp", kind: "stat", hue: "cold", accent: "good",
    value: 52, suffix: "°F", label: "the steady, cold temperature of water coming straight up out of the ground, all year round", eyebrow: "Underground" },
  // ── FIND THE SPRING (144–200) ──
  { t: 144, id: "cmp_find", kind: "checklist", hue: "good", accent: "good",
    title: "Find the spring", eyebrow: "Do it in the dry season",
    items: [ck("Walk the hill in the driest part of summer"), ck("Look for the one green wet spot"), ck("Push a stick in — it comes up cold and wet"), ck("Follow it up to the highest wet point")],
    bg: "a person walking a brown dry August hillside with one bright green wet stripe of grass" },
  { t: 155, id: "cmp_greenstripe", kind: "callout", hue: "good", accent: "good",
    figure: "The green stripe is water", eyebrow: "On a dry hillside", caption: "when everything else is brown, the one place that stays green and soft is water sitting close to the surface",
    bg: "a single bright green damp stripe running down an otherwise dry brown hillside" },
  { t: 178, id: "cmp_eye", kind: "callout", hue: "cold", accent: "good",
    figure: "Dig to the eye", eyebrow: "Clean water pushes UP", caption: "not surface mud draining in — the good water rises out of solid ground from below; that spot is the eye of the spring",
    bg: "clear water pushing up through clean gravel in a small dug hollow" },
  // ── MEASURE THE FLOW (200–290) ──
  { t: 209, id: "cmp_measure", kind: "checklist", hue: "good", accent: "good",
    title: "Measure the flow", eyebrow: "With a bucket, before you build",
    items: [ck("Get the water running into one spot"), ck("Hold a 5-gallon bucket under it"), ck("Time how long it takes to fill"), ck("Write that number down")],
    bg: "a five-gallon bucket filling under a pipe of clear spring water, a wristwatch nearby" },
  { t: 222, id: "cmp_fast", kind: "stat", hue: "cold", accent: "good",
    value: 7200, suffix: " gal/day", label: "what a spring giving five gallons a minute delivers — that is a great deal of water", eyebrow: "Fast spring" },
  { t: 230, id: "cmp_perperson", kind: "stat", hue: "amber", accent: "good",
    value: 50, suffix: "-100 gal", label: "what one person uses a day for everything — drinking, washing, cooking, the animals", eyebrow: "Per person / day" },
  { t: 240, id: "cmp_slowvsfast", kind: "bars", hue: "amber", accent: "good", unit: "",
    title: "Even a slow spring is enough", eyebrow: "It never stops filling",
    bars: [{ label: "Slow spring ½ gal/min", value: 700, display: "700 gal/day — plenty", winner: true }, { label: "A family of four needs", value: 400, display: "~400 gal/day" }] },
  { t: 246, id: "cmp_slowwins", kind: "callout", hue: "good", accent: "good",
    figure: "A slow spring + a tank", eyebrow: "Beats a fast well", caption: "it trickles all night into your storage while you sleep — a slow spring with a tank beats a fast well with a dead pump",
    bg: "a slow steady trickle of clear water filling a storage tank in a cool cellar" },
  // ── SPRING BOX (281–420) — el mecanismo ──
  { t: 290, id: "cmp_boxwhy", kind: "callout", hue: "amber", accent: "good",
    figure: "The spring box", eyebrow: "The smartest simple thing", caption: "left alone a spring is a muddy wet spot — cows, leaves, dirt. The box turns it into clean water you can trust",
    bg: "a stone-and-concrete spring box built into a green hillside with a lid and a pipe" },
  { t: 300, id: "cmp_boxhow", kind: "checklist", hue: "cold", accent: "good",
    title: "How the box works", eyebrow: "Clean water, every time",
    items: [ck("Clean water rises up through gravel from below"), ck("Dirt and sand settle to the bottom"), ck("Only the settled water off the top leaves"), ck("A tight lid keeps leaves, bugs and mice out")],
    bg: "cutaway of a spring box: gravel bottom, clear water filling, an outlet pipe near the top, a lid" },
  { t: 342, id: "cmp_boxbuild", kind: "splitlist", palette: "G",
    title: "Building the box", items: ["Dig down to the eye, to solid ground", "Concrete, stone laid tight, or cedar", "Bottom sits on the clean gravel", "Mound it over with dirt and grass"] },
  { t: 352, id: "cmp_80yrs", kind: "stat", hue: "cold", accent: "good",
    value: 80, suffix: " years", label: "how long a well-built spring box lasts — poured in the 1940s, the water is still clean as the day he closed it", eyebrow: "One box" },
  { t: 379, id: "cmp_overflow", kind: "callout", hue: "amber", accent: "good",
    figure: "Give it an overflow", eyebrow: "Number one", caption: "the spring keeps producing whether you need it or not — a second pipe up top lets the extra run off, so it never backs up and chokes",
    bg: "a screened overflow pipe running clear water off the downhill side of a spring box" },
  { t: 399, id: "cmp_overflowsign", kind: "chips", hue: "cold",
    title: "Overflow running = alive", chips: ["box is full", "spring is alive", "screened", "no backup"],
    bg: "clear water trickling steadily out of an overflow pipe onto mossy stones" },
  { t: 404, id: "cmp_screen", kind: "mistake", number: "!", eyebrow: "Number two — never skip",
    title: "Screen every pipe", desc: "Quarter-inch hardware cloth, stainless if you can, on the overflow, the outlet, every opening. If a mouse, snake or frog can get into your water, one day it will — and it'll die in there. Screen everything.",
    bg: "quarter-inch stainless screen fitted over the end of a water pipe" },
  // ── GRAVITY LINE (426–660) — el 2º mecanismo ──
  { t: 435, id: "cmp_gravity", kind: "callout", hue: "good", accent: "good",
    figure: "Gravity never breaks", eyebrow: "The whole trick", caption: "it needs no power, it doesn't care about the weather — water runs downhill, always has, always will",
    bg: "clear water running steadily downhill along an open pipe on a green slope" },
  { t: 455, id: "cmp_higher", kind: "callout", hue: "amber", accent: "good",
    figure: "The spring must be higher", eyebrow: "This decides everything", caption: "spring above the house, water comes free; spring below the house, you need a different trick (coming up)",
    bg: "a spring near the top of a hill and a farmhouse lower down, showing the drop" },
  { t: 481, id: "cmp_psi", kind: "stat", hue: "cold", accent: "good",
    value: 0.43, suffix: " psi / ft", label: "the water pressure you get for every foot of drop from the spring down to your tap — write it down", eyebrow: "The rule" },
  { t: 490, id: "cmp_droptable", kind: "bars", hue: "amber", accent: "good", unit: " psi",
    title: "Drop turns into pressure", eyebrow: "Normal house = 40–60 psi",
    bars: [{ label: "100 ft of drop", value: 43, display: "43 psi — a real shower", winner: true }, { label: "60 ft of drop", value: 26, display: "26 psi — runs a kitchen" }, { label: "30 ft of drop", value: 13, display: "13 psi — fills a tank" }] },
  { t: 518, id: "cmp_frost", kind: "mistake", number: "!", eyebrow: "The one that ruins your winter",
    title: "Bury it below the frost line", desc: "A pipe of water that freezes is a pipe that splits, and then you're digging up the whole line looking for the crack. Below the frost line the ground never freezes and the water keeps moving. Dig deep once and never think about it again.",
    bg: "a water pipe laid deep in a dug trench, dark soil walls, below the frost line" },
  { t: 546, id: "cmp_frostdepth", kind: "stat", hue: "cold", accent: "good",
    value: 4, suffix: " ft down", label: "a common frost depth — call your county extension office, they'll tell you yours for free", eyebrow: "Below the frost line" },
  { t: 555, id: "cmp_runline", kind: "checklist", hue: "good", accent: "good",
    title: "Running the line", eyebrow: "From the box to the house",
    items: [ck("Steady downhill the whole way"), ck("No low U-traps — air gets stuck"), ck("Air valve on top of any rise"), ck("Buried below the frost line")],
    bg: "a black poly pipe running steadily downhill in an open trench toward a farmhouse" },
  { t: 569, id: "cmp_airlock", kind: "callout", hue: "red", accent: "danger",
    figure: "Air lock stops the water", eyebrow: "Why no U-traps", caption: "an air bubble trapped at a high spot in a gravity line will stop your water cold — keep it going down, or burp the air with a valve",
    bg: "a pipe going down then up over a rise, an air bubble trapped at the top" },
  // ── SPRINGHOUSE (636–720) ──
  { t: 648, id: "cmp_springhouse", kind: "checklist", hue: "good", accent: "good",
    title: "The springhouse", eyebrow: "A fridge that never quits",
    items: [ck("Spring water runs through a stone trough"), ck("The cold water keeps the room cold"), ck("Milk, butter, cream, eggs sit in it"), ck("Same water feeds the house on the way through")],
    bg: "milk cans and crocks of butter sitting in a stone trough of cold running spring water" },
  { t: 700, id: "cmp_twojobs", kind: "splitlist", palette: "B",
    title: "One spring, two jobs", items: ["Feeds the house — drinking, washing", "Keeps the food cold on the way through", "52°F running water, year round", "Costs nothing, never quits"] },
  // ── RAM PUMP + RAIN (668–766) ──
  { t: 676, id: "cmp_rampump", kind: "callout", hue: "amber", accent: "good",
    figure: "Water below you? Ram pump", eyebrow: "Still zero electricity", caption: "the hydraulic ram uses the fall of the water itself to punch a little of it uphill — no motor, day and night",
    bg: "a small iron and brass hydraulic ram pump beside a creek, no motor" },
  { t: 693, id: "cmp_rampumphow", kind: "splitlist", palette: "G",
    title: "The ram pump (link below)", items: ["Uses the weight and fall of the water", "Punches a smaller amount way uphill", "Clunks along day and night, no power", "Fills a tank that gravity-feeds the house"] },
  { t: 728, id: "cmp_raincistern", kind: "checklist", hue: "good", accent: "good",
    title: "Rain cistern — the backup", eyebrow: "Catch what's already coming",
    items: [ck("Gutters off the roof"), ck("First-flush diverter throws the dirty first bit"), ck("A screen over the tank"), ck("Store it up high so it gravity-feeds")],
    bg: "rain gutters running roof water through a first-flush diverter into a big storage tank" },
  { t: 735, id: "cmp_600gal", kind: "stat", hue: "cold", accent: "good",
    value: 600, suffix: " gal", label: "what one inch of rain gives you off a thousand square feet of roof — a second free source that fills itself", eyebrow: "1 inch of rain" },
  // ── WARNINGS (770–830) ──
  { t: 790, id: "cmp_test", kind: "mistake", number: "!", eyebrow: "Say it plain",
    title: "Test the water first", desc: "Spring water is not automatically safe. A farm field, a barnyard, a septic system uphill can travel down into it, and you can't see it, smell it or taste it. Before you drink one drop, get a real lab test.",
    bg: "a lab water-test kit and a glass jar of clear spring water on a table" },
  { t: 796, id: "cmp_testfor", kind: "chips", hue: "amber",
    title: "Test for — every year", chips: ["coliform", "E. coli", "nitrates", "county lab, cheap"],
    bg: "a water sample vial and a lab test form on a wooden table" },
  { t: 816, id: "cmp_uphill", kind: "callout", hue: "good", accent: "good",
    figure: "Keep the uphill clean", eyebrow: "And the water stays clean", caption: "no animals penned up above the spring, no fuel stored up there, nothing — keep the ground above it clean and it stays clean",
    bg: "a clean fenced-off green hillside above a spring, no animals, no clutter" },
  { t: 829, id: "cmp_rules", kind: "callout", hue: "cold", accent: "good",
    figure: "Check your local rules", eyebrow: "Five minutes first", caption: "some states have laws about developing a spring or catching rain — usually fine for your own use, but ask the county before you dig",
    bg: "a county office form and a pen on a table beside a map of a rural property" },
  // ── MISTAKES (851–905) ──
  { t: 851, id: "cmp_mist_spot", kind: "mistake", number: "1", eyebrow: "The big one",
    title: "Building in the wrong spot", desc: "They box in surface runoff instead of digging up to the eye where clean water pushes out of solid ground. Dig to the eye. Always up to the eye.",
    bg: "muddy surface water pooling versus clear water rising from clean gravel" },
  { t: 869, id: "cmp_mist_seal", kind: "mistake", number: "2", eyebrow: "The choke",
    title: "Sealed with no overflow", desc: "They seal the box airtight, it backs up on itself and quits, and they swear the spring went dry. It didn't. You strangled it. Give it the overflow.",
    bg: "a spring box backed up and overflowing with no outlet pipe" },
  { t: 887, id: "cmp_mist_shallow", kind: "mistake", number: "3", eyebrow: "No shortcuts",
    title: "Pipe laid too shallow", desc: "To save on digging they lay it shallow, and the first hard winter splits the line. There is no shortcut on the frost line. Dig deep or dig twice.",
    bg: "a shallow water pipe split open by ice in frozen winter ground" },
  { t: 893, id: "cmp_mist_test", kind: "mistake", number: "4", eyebrow: "The sad one",
    title: "Never testing the water", desc: "They drink it for years, and one day the whole family's sick and can't figure out why. It's the water. Test it — the first time, and every year after.",
    bg: "a family water tap and a neglected, dusty untouched water-test kit" },
  // ── RECAP (913–958) ──
  { t: 913, id: "cmp_recap", kind: "checklist", hue: "good", accent: "good",
    title: "The whole thing, start to finish", eyebrow: "Seven steps",
    items: [ck("1. Find the spring — dig to the green wet eye"), ck("2. Build the box — clean up, settle, off the top, lid"), ck("3. Give it an overflow so it never chokes"), ck("4. Bury the line downhill below the frost line"), ck("5. Store it in a tank or a springhouse"), ck("6. Below you? Ram pump. Backup? Catch the rain"), ck("7. Test the water, keep the uphill clean")] },
  { t: 958, id: "cmp_ahole", kind: "splitlist", palette: "B",
    title: "A hole, a box, a pipe", items: ["And the ground being higher up there", "80 years, never a bill", "Never lost it in a storm", "Never once had it quit"] },
  // ── CTA + NEXT (983–1035) ──
  { t: 986, id: "cmp_almanac", kind: "callout", hue: "amber", accent: "good",
    figure: "The Plain Almanac", eyebrow: "Link below this video", caption: "the whole set written out — the spring, the cistern, the root cellar — step by step with the real measurements and numbers",
    bg: "an old vintage homestead almanac book open on a wooden table in warm window light" },
  { t: 1014, id: "cmp_next", kind: "nextvideo", kicker: "Next time",
    title: "The springhouse, up close",
    sub: "How to build the cold room that holds food all summer on nothing but the water running through it." },
  // ── densidad extra (spread, baja el % de toma cruda) ──
  { t: 122, id: "cmp_steady", kind: "callout", hue: "cold", accent: "good",
    figure: "It doesn't run dry", eyebrow: "Not weather — storage", caption: "a creek dries up in August; a spring keeps coming because the whole hill above it is holding the water",
    bg: "clear spring water flowing in late summer while the surrounding grass is dry and brown" },
  { t: 218, id: "cmp_fivegal", kind: "stat", hue: "amber", accent: "good",
    value: 5, suffix: " gal/min", label: "a bucket that fills in one minute — three hundred gallons an hour, day and night", eyebrow: "The measure" },
  { t: 335, id: "cmp_settle", kind: "chips", hue: "cold",
    title: "Inside the box", chips: ["up through gravel", "dirt settles", "clean off the top", "tight lid"],
    bg: "cutaway of clear water settling in a spring box, sediment on the gravel bottom" },
  { t: 466, id: "cmp_belowfix", kind: "splitlist", palette: "G",
    title: "Match the trick to the land", items: ["Spring above you — gravity feeds free", "Spring below you — a ram pump lifts it", "No spring — catch the rain off the roof", "One way or another, no power needed"] },
  { t: 642, id: "cmp_dairy", kind: "stat", hue: "cold", accent: "good",
    value: 52, suffix: "°F", label: "the cold of the running spring water that kept a whole dairy — milk, butter, cream — before anyone had a fridge", eyebrow: "The springhouse" },
  { t: 745, id: "cmp_twosource", kind: "splitlist", palette: "B",
    title: "Never trust one source", items: ["A spring up the hill for the house", "A cistern catching the roof", "Rain for the garden and the animals", "Two free sources that fill themselves"] },
  { t: 808, id: "cmp_safe", kind: "checklist", hue: "good", accent: "good",
    title: "Keep it safe", eyebrow: "Your family's water",
    items: [ck("Lab test for coliform and nitrates"), ck("Test the first time you develop it"), ck("Re-test once a year, no skipping"), ck("Keep everything uphill of it clean")],
    bg: "a clean spring box on a fenced hillside with a water sample jar in the foreground" },
  { t: 976, id: "cmp_world", kind: "callout", hue: "amber", accent: "good",
    figure: "A whole world of this", eyebrow: "The old ways", caption: "water, heat, keeping food — the everyday things done without the bill and without the grid, still sitting there for the taking",
    bg: "a cozy off-grid homestead kitchen with jars, a lantern and cold spring water, warm light" },
];

// DUMP para el gap-fill de Bing (cold-open + fondos de componentes) — material real
if (process.env.DUMP_BING) {
  const gap = [];
  for (const c of COLD_OPEN) { if (c.gen && c.gen.prompt) gap.push({ name: c.id, query: c.gen.prompt.split(",")[0], count: 1 }); }
  for (const c of COMPONENTS) { if (c.bg) gap.push({ name: `${c.id}_bg`, query: c.bg, count: 1 }); }
  fs.writeFileSync("_v3/cywater_bing_cold_cmp.json", JSON.stringify(gap, null, 0));
  console.log("DUMP_BING:", gap.length, "queries → _v3/cywater_bing_cold_cmp.json");
  process.exit(0);
}

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
  if (bg) {
    const rj = realJpg(`${c.id}_bg`);
    if (rj) { ab.image = rj; }
    else { ab.image = `img/cywater/${c.id}_bg.png`; ab.gen = { type: "image", name: `cywater/${c.id}_bg`, prompt: bg + IMG_STYLE }; }
  }
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
fs.writeFileSync("beatsheet/cywater.json", JSON.stringify({ video: "cywater", avatar: "cywater_opt.mp4", clipsfirst: true, beats }, null, 2));

// ── ventanas de avatar: full en [0,firstHero) + AV_FULL; PiP rotando el resto ──
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = [];
let k = 0;
for (let i = 0; i < beats.length; i++) {
  // ⛔ NUNCA PiP sobre un componente (AUDITOR §4). Solo sobre toma cruda.
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

const avTs = `// avatar_cywater.gen.ts — GENERADO por build_cywater.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_CYWATER = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`;
fs.writeFileSync("src/VideoEdit/avatar_cywater.gen.ts", avTs);

const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0) + firstHero;
console.log(`=== build_cywater ===`);
console.log(`beats: ${beats.length} · clips reales: ${nClip} · imágenes: ${beats.length - nClip} · componentes: ${nComp}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP: ${pip.length} · windows: ${windows.length}`);
console.log(`dur min/max: ${Math.min(...beats.map((b) => b.dur))}s / ${Math.max(...beats.map((b) => b.dur))}s`);
