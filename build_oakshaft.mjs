// build_oakshaft.mjs — "Before Electricity: How Solid Oak Becomes a Water Wheel Shaft (1935)"
// Canal Claudio Yoder (@claudioyoder-amish · INGLÉS · modo avatar amish). Avatar full en tramos retóricos +
// ~44 imágenes IA (gpt-image-2 low, presenter barba gris 1:1 a su frase) + ~24 clips stock Pexels + kit premium THEME_EARTH.
// CTA = The Plain Almanac (sin precio ni link en voz). Salida: beatsheet/oakshaft.json + avatar_oakshaft.gen.ts
import fs from "fs";

const SLUG = "oakshaft";
const AVATAR = `${SLUG}_opt.mp4`;

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = [];
for (const c of caps) { for (const w of norm(c.text).split(" ").filter(Boolean)) Wc.push({ n: w, ms: c.startMs, e: c.endMs }); }
const at = (phrase, maxTok = 8) => {
  const words = norm(phrase).split(" ").filter(Boolean);
  const t = words.slice(0, Math.min(maxTok, words.length));
  for (let i = 0; i <= Wc.length - t.length; i++) {
    let ok = 1;
    for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return Wc[i].ms / 1000;
  }
  return null;
};
const atc = (phrase, maxTok) => { const v = at(phrase, maxTok); if (v == null) console.warn("⚠ anchor missing:", phrase.slice(0, 55)); return v; };
const AV_DUR = 1000.40;
const TOTAL = Math.min(+((Wc[Wc.length - 1].e) / 1000 + 0.6).toFixed(2), AV_DUR);

const imgExists = (base) => {
  for (const ext of ["jpg", "jpeg", "png", "webp"]) if (fs.existsSync(`public/img/${SLUG}_${base}.${ext}`)) return `img/${SLUG}_${base}.${ext}`;
  return null;
};

// ── MAPA IMAGEN → FRASE (cada plano anclado a SUS sustantivos, en orden del guion) ──
const IMAGES = [
  // HOOK / TRAILER
  ["there s a piece of white oak", "giant_white_oak_forest", 6],
  ["that log became the one thing", "squared_oak_shaft_beam", 6],
  ["they called it the shaft", "wooden_shaft_through_mill", 5],
  ["if you picked the wrong tree", "millwright_looking_up_oak", 6],
  ["they d fell it in the dead of winter", "two_men_crosscut_saw_snow", 8],
  ["square it by hand", "man_hewing_log", 6],
  ["sometimes three years", "seasoning_shed_stacked_timber", 4],
  ["a single stick of timber", "squared_timber_flat_face", 5],
  // MILL 1935
  ["if you d walked into a mill", "old_water_mill_exterior", 7],
  ["this slow heavy groan", "mill_interior_dark_gears", 6],
  ["the pretty part in the paintings", "old_restored_mill_wheel", 6],
  ["turning a big log that runs straight through", "wooden_shaft_through_mill", 8],
  ["to the gears to the millstones", "millstones_grinding", 6],
  ["almost like it was alive", "old_craftsman_hands", 6],
  // CHOOSING THE TREE
  ["it had to be white oak", "white_oak_trunk_bark", 6],
  ["a tree that had grown slow and straight", "tall_oaks_canopy_up", 8],
  ["a knot in the wrong spot", "knot_in_oak_wood", 6],
  ["stand at the base of an oak and look up", "millwright_looking_up_oak", 8],
  ["a blaze on the bark", "blaze_mark_on_bark", 5],
  // FELLING + HEWING
  ["deep winter when the sap is down", "snowy_oak_forest_winter", 7],
  ["two or three men out with a crosscut saw", "two_men_crosscut_saw_snow", 8],
  ["this trunk that s maybe four feet through", "huge_trunk_four_feet", 8],
  ["when that oak finally leans and cracks", "tree_falling_forest", 7],
  ["snap a chalk line down the length", "chalk_line_on_log", 8],
  ["chip after chip after chip", "man_hewing_log", 6],
  ["curls of white oak thick as your hand", "pale_wood_chips_pile", 8],
  ["the old millwrights", "archival_millwrights_1930s", 3],
  ["as square and as flat as if it came off", "squared_timber_flat_face", 8],
  // SEASONING
  ["you ve got to season the wood", "seasoning_shed_stacked_timber", 7],
  ["up off the ground up on blocks", "timber_ends_drying", 7],
  ["they d knock on it and green wood answers", "hand_knocking_wood", 8],
  ["touch the end grain to their cheek", "seasoned_timber_grain_end", 7],
  // CTA SEED
  ["got gathered up into a book", "claudio_almanac_book", 6],
  // TURNING THE JOURNAL
  ["now they can shape it for real", "drawknife_rounding_end", 7],
  ["work it down with a draw", "spokeshave_on_wood", 6],
  ["a set of dividers checking it", "wooden_dividers_calipers", 7],
  // WOODEN COGS
  ["the pit wheel they called it", "wooden_gear_pit_wheel", 6],
  ["those teeth were wood too", "wooden_gear_teeth_macro", 6],
  ["apple wood or horn beam", "miller_whittling_cog", 5],
  ["hang them on a nail ready", "spare_cogs_on_nail", 7],
  // IRON + RAISING + FIRST TURN
  ["they d fit iron into the ends", "iron_gudgeon_shaft_end", 7],
  ["the gudgeons iron pins", "blacksmith_forging_iron", 6],
  ["the bearings themselves", "stone_bearing_block", 5],
  ["you hang the wheel on it", "old_restored_mill_wheel", 6],
  ["raising it was its own drama", "men_raising_beam_pulleys", 6],
  ["just block and tackle rope and pulleys", "block_and_tackle_rope", 8],
  ["somebody pulls the gate up", "water_gate_race_opening", 6],
  ["it fills the first bucket on the wheel", "water_filling_wheel_buckets", 8],
  ["the wheel takes a breath and starts to turn", "water_wheel_turning_close", 8],
  // MEANING + CLOSE
  ["the wire finally reached up into those hollows", "power_line_pole_valley", 8],
  ["a motor that did in a small steel box", "old_electric_motor_box", 8],
  ["nobody needed him anymore", "old_craftsman_hands", 5],
  ["people used to be able to do this", "claudio_reflective_window", 7],
  ["build something that outlasts you", "claudio_warm_close", 6],
];

// ── STOCK real (Pexels) — movimiento/atmósfera anclado a frases sensoriales ──
const STOCK = [
  ["the first thing you d have heard is the water", "oakshaft_s_waterwheel"],
  ["the same sound it had made for 80", "oakshaft_s_stream"],
  ["the whole heart of the place", "oakshaft_s_gears"],
  ["it just catches the water", "oakshaft_s_wheelsplash"],
  ["where it had to reach for the light", "oakshaft_s_canopy"],
  ["the grain ran long and tight and true", "oakshaft_s_woodgrain"],
  ["cut it in january", "oakshaft_s_snowforest"],
  ["middle of winter snow on the ground", "oakshaft_s_snowfall"],
  ["they go at this trunk", "oakshaft_s_sawing"],
  ["the whole woods shakes", "oakshaft_s_windtrees"],
  ["steady wet chunking", "oakshaft_s_chopping"],
  ["a little pile of pale chips", "oakshaft_s_shavings"],
  ["out of the rain but open to the breeze", "oakshaft_s_barnlight"],
  ["there s just time and air", "oakshaft_s_dustbeam"],
  ["with a spoke shave", "oakshaft_s_handplane"],
  ["whittled out a hard tough", "oakshaft_s_carving"],
  ["then the iron", "oakshaft_s_blacksmith"],
  ["a blacksmith s job", "oakshaft_s_sparks"],
  ["the water comes down the channel", "oakshaft_s_rushingwater"],
  ["fills the first bucket", "oakshaft_s_wheelbuckets"],
  ["and starts to turn", "oakshaft_s_wheelturn"],
  ["that oak will turn day and night", "oakshaft_s_millwheel"],
  ["one of those old wheels turning", "oakshaft_s_restoredwheel"],
  ["grain came in on wagons", "oakshaft_s_flourmill"],
  ["a tree somebody chose", "oakshaft_s_oaktree"],
];

const rawList = [];
for (const [phrase, base, mt] of IMAGES) {
  const src = imgExists(base);
  if (!src) { console.warn("⚠ image missing:", base); continue; }
  const t = at(phrase, mt);
  if (t == null) { console.warn("⚠ anchor missing (img):", phrase.slice(0, 45), "→", base); continue; }
  rawList.push({ start: +t.toFixed(2), src, vid: false });
}
let nStock = 0;
for (const [phrase, name] of STOCK) {
  const src = `broll/${name}.mp4`;
  if (!fs.existsSync("public/" + src)) { console.warn("⚠ stock missing file:", name); continue; }
  const t = at(phrase, 8);
  if (t == null) { console.warn("⚠ anchor missing (stock):", phrase.slice(0, 40)); continue; }
  rawList.push({ start: +t.toFixed(2), src, vid: true }); nStock++;
}
rawList.sort((a, b) => a.start - b.start);
const rawBeats = [];
for (let i = 0; i < rawList.length; i++) {
  const next = i + 1 < rawList.length ? rawList[i + 1].start : TOTAL;
  const gap = next - rawList[i].start;
  const dur = +Math.max(1.5, Math.min(gap, 8)).toFixed(2); // Amish: sostener 5-8s, techo 8
  rawBeats.push({ id: `${SLUG}_${i}`, start: rawList[i].start, kind: "raw", src: rawList[i].src, hue: "amber", darken: 0, dur, ...(rawList[i].vid ? { noSplit: true } : {}) });
}
console.log(`imágenes IA: ${rawBeats.length - nStock} · clips stock: ${nStock} · raw total ${rawBeats.length}`);

const P = (comp, atPhrase, dur, zone, props = {}, maxTok) => ({ comp, at: atPhrase, dur, zone, props, maxTok });

// ── COMPONENTES (kit premium THEME_EARTH), anclados al TEXTO REAL de las captions (INGLÉS) ──
const PREMIUM = [
  // HOOK — el número (3 años)
  P("BigStatReveal", "spend three years of his life", 4.8, "topLeft", {
    eyebrow: "They spent", value: 3, suffix: " years drying one shaft", support: "before it ever turned — a tree chosen, felled in winter, hewn by hand, then seasoned longer than most folks will wait for anything",
  }, 6),
  // MECANISMO — dónde va la fuerza
  P("FlowSteps", "the wheel itself doesn t really do the work", 6.6, "full", {
    kicker: "How a water mill works", title: "Where the power goes", nodes: [
      { label: "The wheel catches the falling water", sub: "the pretty part — but it only turns the log" },
      { label: "The oak shaft carries it inside", sub: "one squared log runs straight through the building" },
      { label: "Gears and millstones do the work", sub: "everything the mill does runs through that one piece of oak" },
    ],
  }, 8),
  // ELEGIR EL ÁRBOL — white vs red oak
  P("MythTruth", "red oak they d leave", 5.4, "topLeft", {
    mythLabel: "MYTH", truthLabel: "TRUTH",
    myth: "Any big oak would do for a mill shaft",
    truth: "Only white oak — dense, and it holds up wet its whole life. Red oak wicks water like a straw and rots from the inside",
  }, 6),
  // HACHAR — score & hew
  P("NumberedSteps", "snap a chalk line", 6.8, "left", {
    eyebrow: "Squaring a log by hand", title: "Score and hew", steps: [
      { title: "Snap a chalk line", sub: "one true line down the whole length of the log" },
      { title: "Score across the grain", sub: "little cuts, chop-chop, every few inches" },
      { title: "Hew to the line", sub: "knock the chunks off flat with the broadaxe" },
      { title: "Roll a quarter turn", sub: "four faces — near enough four whole mornings" },
    ],
  }, 6),
  // SECADO — 1 año por pulgada
  P("BigStatReveal", "a year of drying for every inch", 4.8, "topLeft", {
    eyebrow: "The old-timers' rule", value: 1, suffix: " year of drying per inch", support: "a foot-thick shaft meant years in the shed — so they raised the next one while the old one still turned",
  }, 8),
  // reflexión
  P("PullQuote", "we get impatient when a page takes", 5.2, "topLeft", {
    quote: "We get impatient when a page takes three seconds to load. These men measured a single project in the growing of their own children.",
  }, 7),
  // COGS — CTA reminder (make the cheap part break)
  P("ChecklistReveal", "a wooden tooth is going to wear out", 6.2, "topLeft", {
    kicker: "Why the gear teeth were wood", title: "Make the cheap part the part that breaks", items: [
      "Softer than the iron it runs against — so it wears first",
      "One breaks, you knock it out — not the whole gear",
      "A new cog is an hour with a knife and applewood",
      "Spares whittled ahead, hung ready on a nail",
    ],
    stamp: "OLD-TIMER WISDOM",
  }, 8),
  // recordatorio embudo (ligero, sobre el espíritu)
  P("HighlightSweep", "make the cheap part the part that breaks", 4.8, "top", {
    pre: "That's the whole spirit of the plain book —", highlight: "make it so it can be fixed", post: ".", note: "make it out of what you've got; there's a couple hundred years of that kind of wisdom in the description",
  }, 8),
  // HIERRO — dead center
  P("HighlightSweep", "it had to be dead center", 4.8, "top", {
    pre: "Every single turn depended on one thing —", highlight: "the iron set dead center", post: ".", note: "a hair off the true center line and the shaft throws itself off, out and back, until it tears the mill apart",
  }, 6),
  // PESO
  P("BigStatReveal", "thousands of pounds", 4.6, "topLeft", {
    eyebrow: "Wheel, shaft and water together", value: 2, suffix: " tons on two iron ends", support: "all of it balanced on two greased stone blocks — and raised onto its bearings with rope, levers and a mule",
  }, 5),
  // OFICIO PERDIDO — old way vs motor
  P("DuelColumns", "a motor that did in a small steel box", 6.0, "left", {
    title: "When the wire reached the valley", leftName: "The oak shaft", rightName: "The steel motor",
    rows: [
      { attr: "A tree you chose, hewn true, dried three years", leftWins: true },
      { attr: "Outlasted the man who made it — fifty years", leftWins: true },
      { attr: "Easier, smaller, bought in a box", leftWins: false },
      { attr: "And the man who could read an oak — no longer needed", leftWins: false },
    ],
  }, 8),
  // remate
  P("PullQuote", "permanent is patience", 5.2, "topLeft", {
    quote: "We think permanent is a thing you buy. They knew permanent is a thing you make — slow, out of the best tree, dried longer than you want to wait. Permanent is patience.",
  }, 4),
  P("PullQuote", "an ordinary man with an axe", 5.2, "topLeft", {
    quote: "An ordinary man, with an axe and his patience and his eye, could make the beating heart of a machine out of a tree in his own woods. And it would outlast him.",
  }, 6),
  // ── DISTRIBUCIÓN POR TRAMO (variedad ≥5 tipos/tramo, todo contextual) ──
  // 0-3
  P("HighlightSweep", "shake itself to pieces", 4.6, "top", {
    pre: "Get the shaft wrong and", highlight: "the whole mill shakes itself to pieces", post: ".", note: "rush it, or pick the wrong tree, and it tears itself apart inside a single season",
  }, 5),
  P("PullQuote", "the mill lived or died on it", 5.0, "topLeft", {
    quote: "The old millwrights treated the shaft almost like it was alive — because in a way, the mill lived or died on it.",
  }, 7),
  // 3-7
  P("PullQuote", "like money in the bank", 5.0, "topLeft", {
    quote: "They'd mark a young oak and just leave it standing — like money in the bank. A tree they were saving for a job ten years off.",
  }, 5),
  P("MythTruth", "cut a tree in july", 5.4, "topLeft", {
    mythLabel: "MYTH", truthLabel: "TRUTH",
    myth: "Fell the tree whenever you need the wood",
    truth: "Fell it in deep winter — sap down, tree asleep. Cut it in July full of sap and it fights you the whole way and cracks as it dries",
  }, 6),
  P("HighlightSweep", "hurry is how you cut past the line", 4.8, "top", {
    pre: "Why a man took four mornings on one log —", highlight: "hurry is how you cut past the line", post: ".", note: "and once you're past the line, there's no putting the wood back",
  }, 8),
  // 7-10
  P("ChecklistReveal", "they d heft a timber", 6.2, "topLeft", {
    kicker: "No meter, no gauge", title: "How they knew the wood was dry", items: [
      "Heft it — dry wood is lighter; they knew the weight of dry",
      "Knock it — green rings dull, dry rings and sings",
      "Touch the end grain to your cheek — cool means damp still",
    ],
    stamp: "KNOWING BY HAND",
  }, 6),
  P("MythTruth", "perfectly round and perfectly true", 5.4, "topLeft", {
    mythLabel: "MYTH", truthLabel: "TRUTH",
    myth: "Close enough is good enough for the journal",
    truth: "It had to be perfectly round and true. A hair of wobble on something this heavy, turning day and night, tears a mill apart",
  }, 6),
  P("FlowSteps", "some mills had a way to rig", 6.6, "full", {
    kicker: "Turning the journal by hand", title: "Round and true, by eye", nodes: [
      { label: "Rough it round with a drawknife", sub: "peeling the corners off the squared end" },
      { label: "True it with a spokeshave", sub: "fine shavings, checking as you go" },
      { label: "Test it with wooden dividers", sub: "turn, check, turn again — round enough to ride fifty years" },
    ],
  }, 7),
  P("HighlightSweep", "fit iron into the ends of the shaft", 4.8, "top", {
    pre: "Wood alone would crush and burn at the ends, so", highlight: "they fit iron into the very ends", post: ".", note: "the gudgeons — hand-forged iron pins that actually rode in the bearings",
  }, 8),
  // 10-13
  P("PullQuote", "the whole mill would develop a little click", 5.2, "topLeft", {
    quote: "A cog went bad and the whole mill got a little click, once around — and the miller's head came up. He knew that machine by its voice.",
  }, 8),
  P("NumberedSteps", "you ve got to get it up onto", 6.8, "left", {
    eyebrow: "No crane, no motor", title: "Raising the shaft", steps: [
      { title: "Block and tackle", sub: "rope and pulleys to take the weight" },
      { title: "Levers and rollers", sub: "ease a beam that weighs what a small car weighs" },
      { title: "Every man, boy and mule", sub: "all of it rounded up for the lift" },
      { title: "Slow", sub: "if it got away it'd take a leg — so, slow" },
    ],
  }, 8),
  // 13-17
  P("HighlightSweep", "the sound tells you everything", 4.8, "top", {
    pre: "At the first turn, every man listens —", highlight: "the sound tells you everything", post: ".", note: "a deep steady groan and you've done it; a knock or a shudder and something's not true",
  }, 6),
  P("BigStatReveal", "for fifty years sixty", 4.6, "topLeft", {
    eyebrow: "When it's right, that oak turns for", value: 50, suffix: " years, day and night", support: "longer than the man who made it will live — some are still sound a hundred years on",
  }, 4),

  // CTA — The Plain Almanac
  P("CtaCard", "that plain book i mentioned", 6.0, "topLeft", {
    eyebrow: "The old plain ways, written down", title: "The Plain Almanac",
    bullet: "how the old folks seasoned, sealed, built and repaired so a thing lasts a lifetime — link at the top of the description", price: 0, cta: "LINK IN THE DESCRIPTION",
  }, 6),
];

const compBeats = [];
let nOv = 0; const compCount = {};
for (const p of PREMIUM) {
  const s = atc(p.at, p.maxTok);
  if (s == null) continue;
  compBeats.push({ id: `ov_${p.comp.toLowerCase()}_${Math.round(s)}`, start: +s.toFixed(2), dur: p.dur, kind: "premium", overlay: true, comp: p.comp, theme: "earth", zone: p.zone, ...p.props });
  nOv++; compCount[p.comp] = (compCount[p.comp] || 0) + 1;
}
const compSpans = compBeats.map((b) => [b.start, +(b.start + (b.dur || 3)).toFixed(2)]);
const inComp = (t) => compSpans.some(([s, e]) => s <= t && e > t);

// ── COBERTURA SIN HUECOS ──
rawBeats.sort((a, b) => a.start - b.start);
const nextCover = (t) => {
  let best = TOTAL;
  for (const b of rawBeats) if (b.start > t + 0.01 && b.start < best) best = b.start;
  for (const [s] of compSpans) if (s > t + 0.01 && s < best) best = s;
  return best;
};
for (const b of rawBeats) {
  const end = +(b.start + b.dur).toFixed(2);
  for (const [s] of compSpans) if (s > b.start + 0.01 && s < end) b.dur = +(s - b.start - 0.02).toFixed(2);
  if (b.dur < 0.8) b.dur = 0.8;
}
for (const b of rawBeats) {
  const end = +(b.start + b.dur).toFixed(2);
  const nc = nextCover(b.start);
  if (nc - end > 0 && nc - end < 1.2) b.dur = +(nc - b.start).toFixed(2);
}
const rawSpans = rawBeats.map((b) => [b.start, +(b.start + b.dur).toFixed(2)]);
const covered = (t) => rawSpans.some(([s, e]) => s <= t && e > t) || inComp(t);
const STEP = 0.1;
const windows = [];
let cur = null;
for (let t = 0; t < TOTAL - 0.001; t = +(t + STEP).toFixed(2)) {
  const mode = covered(t) ? "hidden" : "full";
  if (mode !== cur) { windows.push({ start: +t.toFixed(2), mode }); cur = mode; }
}
if (!windows.length || windows[0].start > 0) windows.unshift({ start: 0, mode: covered(0) ? "hidden" : "full" });
windows.push({ start: +TOTAL.toFixed(2), mode: "hidden" });

const beats = [...rawBeats, ...compBeats].sort((a, b) => a.start - b.start);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, beats }, null, 1));
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);

const fullCount = windows.filter((w) => w.mode === "full").length;
const avSecs = windows.reduce((a, w, i) => a + (w.mode === "full" ? ((windows[i + 1]?.start ?? TOTAL) - w.start) : 0), 0);
console.log(`beats ${beats.length} (img ${rawBeats.length}) · premium ${nOv} · avatar full x${fullCount} (${avSecs.toFixed(0)}s / ${TOTAL.toFixed(0)}s = ${(avSecs / TOTAL * 100).toFixed(0)}%) · dur ${(TOTAL / 60).toFixed(1)}min`);
console.log("componentes:", JSON.stringify(compCount));
