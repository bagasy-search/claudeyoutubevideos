// build_endlessheat.mjs — "This Amish Trick Gives Your Home Endless Heat Without Electricity"
// Canal Claudio Yoder (@claudioyoder-amish · INGLÉS). Avatar full en tramos retóricos +
// b-roll REAL (stock Pexels) + fotos reales de la web (Bing) + presentador gpt-image-2 (avatar ref)
// + kit premium THEME_EARTH + MassHeaterDiagram. CTA = The Plain Almanac (sin precio/link en voz).
// Salida: beatsheet/endlessheat.json + src/VideoEdit/avatar_endlessheat.gen.ts
import fs from "fs";

const SLUG = "endlessheat";
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
const AV_DUR = 1057.47;
const TOTAL = Math.min(+((Wc[Wc.length - 1].e) / 1000 + 0.6).toFixed(2), AV_DUR);

const P = (x) => `img/${x}.png`;   // presentador gpt-image-2 (ref = avatar)
const O = (x) => `img/${x}.jpg`;   // foto real de la web (Bing), normalizada a jpg en img/
const S = (x) => `broll/${x}.mp4`; // stock real (Pexels)

// ── GRID DIRECTOR: [phrase(anchor verbatim), src, maxTok, isVid] ── cada plano anclado a SUS palabras
const VIS = [
  // HOOK (0–85)
  ["there s a wood stove sitting in the front room", P("eh_p_by_stove"), 8, false],
  ["and it went cold about", S("eh_s_embers"), 5, true],
  ["my wife s got her sleeves rolled up", O("eh_o_warmstoveglow"), 7, false],
  ["one fire built it this morning", S("eh_s_stovefire"), 5, true],
  ["still giving heat this afternoon with no flame", O("eh_o_warmstoveglow"), 7, false],
  ["the folks down the road with the propane furnace", O("eh_o_propanefurnace"), 8, false],
  ["when the power went out last february", S("eh_s_powerlines"), 6, true],
  ["that furnace just stopped", O("eh_o_propanefurnace"), 4, false],
  ["it runs on electricity that moves the gas", O("eh_o_propanefurnace"), 7, false],
  ["while your pipes start to freeze", S("eh_s_frostwindow"), 5, true],
  ["this stove doesn t have a plug", P("eh_p_point_stove"), 6, false],
  ["an old cast iron box and a few feet of pipe", O("eh_o_castiron"), 8, false],
  ["we ve heated this way for a hundred", O("eh_o_vintagefamily"), 6, false],
  // BIG WASTE (85–150)
  ["when you burn wood in a normal stove", S("eh_s_woodstove2"), 7, true],
  ["goes straight up the chimney gone", S("eh_s_chimneysmoke"), 5, true],
  ["hold your hand near the stove pipe up top", P("eh_p_hand_stovepipe"), 8, false],
  ["you cut that wood or you bought it", S("eh_s_splitwood"), 7, true],
  ["the amish trick the real one", P("eh_p_by_stove"), 5, false],
  ["one fire in the morning keeps a room comfortable", O("eh_o_warmstoveglow"), 7, false],
  ["and zero electricity not a watt", S("eh_s_candleflame"), 5, true],
  // PART 1 — THERMAL MASS (150–330)
  ["metal heats up fast and it cools down fast", O("eh_o_castiron"), 8, false],
  ["mass brick stone tile", S("eh_s_brickwall"), 4, true],
  ["they burned one hot fire and the mass held it", S("eh_s_matches"), 8, true],
  ["so what we do is we build a wall of it", O("eh_o_heatshield"), 8, false],
  ["that brick is quietly soaking up the heat", S("eh_s_brickwall"), 6, true],
  ["all night that brick just radiates", O("eh_o_heatshield"), 5, false],
  ["you don t need a mason", S("eh_s_stackbrick"), 5, true],
  ["reclaim brick old pavers", O("eh_o_reclaimbrick"), 3, false],
  ["this is a saturday", P("eh_p_stack_brick"), 4, false],
  ["i helped my uncle put a stone wall behind his stove", O("eh_o_woodstovebrick"), 8, false],
  ["he put his hand on that stone", P("eh_p_hand_on_stone"), 6, false],
  ["you build the whole stove out of mass that s a masonry heater", O("eh_o_masonryheater"), 8, false],
  ["one fire a day that s the end game", O("eh_o_masonryheater"), 7, false],
  ["a stove that s warm to lean on around the clock", P("eh_p_by_masonry"), 8, false],
  ["i ll put the exact numbers down in the description", P("eh_p_point_desc"), 8, false],
  // PART 2 — HEAT RECLAIMER (330–470)
  ["remember that stove pipe", O("eh_o_stovepipe"), 4, false],
  ["we re going to rob it politely", P("eh_p_hand_stovepipe"), 5, false],
  ["the old plain way is what s called a double barrel setup", O("eh_o_doublebarrel"), 8, false],
  ["two steel drums and a kit from the hardware store", O("eh_o_barrelstove"), 8, false],
  ["is a heat exchanger you clamp right onto the stove pipe", O("eh_o_reclaimer"), 8, false],
  ["it s a set of tubes hollow tubes", S("eh_s_copperpipe"), 6, true],
  ["hot air rises that s the whole motor", S("eh_s_heatshimmer"), 6, true],
  ["same wood you re just not throwing it away anymore", O("eh_o_reclaimer"), 8, false],
  ["you burn a log", S("eh_s_flames"), 3, true],
  ["a rocket mass version of this that s honestly the best", O("eh_o_rocketbench"), 8, false],
  ["you burn a small fierce upright fire", S("eh_s_rocketflame"), 6, true],
  ["into a long bench a big cob and stone bench", O("eh_o_rocketbench"), 8, false],
  ["runs on sticks runs on nothing", S("eh_s_twigs"), 5, true],
  // PART 3 — THERMOSIPHON (470–600)
  ["moving the heat to another room", O("eh_o_oldradiator"), 5, false],
  ["it s called a thermosiphon", O("eh_o_watercoil"), 4, false],
  ["a coil of pipe copper in or against the firebox", O("eh_o_watercoil"), 8, false],
  ["run that pipe up to a tank or a radiator in the next room", O("eh_o_oldradiator"), 8, false],
  ["the hot water rises on its own", S("eh_s_boilwater"), 6, true],
  ["gives its heat off there", S("eh_s_radiatorsteam"), 5, true],
  ["and around it goes forever", S("eh_s_waterflow"), 5, true],
  ["the part where people get hurt", P("eh_p_serious_safety"), 6, false],
  ["read up or have someone who knows help you", P("eh_p_serious_safety"), 7, false],
  ["when the neighbors heat pumps are dead silent", S("eh_s_snowcabin"), 7, true],
  // PART 4 — SEAL DRAFTS (600–690)
  ["every old house has gaps", O("eh_o_weatherstrip"), 5, false],
  ["walk the house on a windy day with your hand out", P("eh_p_feel_draft"), 8, false],
  ["weather stripping a rolled towel under the door", O("eh_o_towelunderdoor"), 7, false],
  ["the biggest leak in most houses isn t down low", O("eh_o_attichatch"), 8, false],
  ["get up in the attic seal the top of the house", S("eh_s_atticinsul"), 8, true],
  ["hang a heavy blanket or a quilt over them", O("eh_o_quiltwindow"), 7, false],
  ["uncover them in the morning to let the sun back in", O("eh_o_quiltwindow"), 8, false],
  // WHY / HISTORY / ENEMY (690–830)
  ["europe was building those in the 1500s", O("eh_o_kachelofen"), 6, false],
  ["the german tile stove", O("eh_o_kachelofen"), 4, false],
  ["the russian stove the big one the whole family slept", O("eh_o_russianstove"), 8, false],
  ["our great great grandparents", O("eh_o_vintagefamily"), 4, false],
  ["it s easy you set a dial", S("eh_s_thermostat"), 6, true],
  ["we got sold the furnace", O("eh_o_propanefurnace"), 4, false],
  ["the day the grid goes down", S("eh_s_darkhouse"), 5, true],
  ["the day of the ice storm", S("eh_s_icestorm"), 5, true],
  // MYTHS (830–900)
  ["10 12 hours easy", S("eh_s_handsfire"), 4, true],
  ["cleaner and less wood people have it backwards", S("eh_s_flames"), 6, true],
  ["a mass system can cut your wood down by half", S("eh_s_woodpile"), 8, true],
  ["you burn hot once and coast", O("eh_o_woodstovebrick"), 5, false],
  // STAKES (900–960)
  ["think about the worst night", S("eh_s_snowfall"), 4, true],
  ["there s little ones in the house or somebody older", S("eh_s_familyfire"), 8, true],
  ["everybody on the block is in the dark", S("eh_s_snowroad"), 6, true],
  ["your house is warm", O("eh_o_warmstoveglow"), 4, false],
  ["because your heat never depended on anybody", S("eh_s_warmwindow"), 6, true],
  // RECAP (960–1010)
  ["one this weekend build the mass", O("eh_o_heatshield"), 5, false],
  ["two add a reclaimer to your stove pipe", O("eh_o_reclaimer"), 6, false],
  ["three seal your drafts", O("eh_o_weatherstrip"), 4, false],
  // CTA + CLOSE (1010–1057)
  ["the link s up at the top of the description", P("eh_p_hold_book"), 8, false],
  ["how to keep a room warm overnight with something", S("eh_s_winterforest"), 7, true],
  ["tell me down in the comments where you re heating from", P("eh_p_point_desc"), 8, false],
  ["the people who kept themselves warm with their own two hands", O("eh_o_vintagefamily"), 8, false],
  ["one fire and a warm house long after it s out", P("eh_p_close_warm"), 8, false],
  ["stay warm out there", P("eh_p_close_warm"), 4, false],
];

const rawList = [];
let missImg = 0, missAnchor = 0;
for (const [phrase, src, mt, isVid] of VIS) {
  if (!fs.existsSync("public/" + src)) { console.warn("⚠ asset missing:", src, "←", phrase.slice(0, 40)); missImg++; continue; }
  const t = at(phrase, mt);
  if (t == null) { console.warn("⚠ anchor missing:", phrase.slice(0, 45)); missAnchor++; continue; }
  rawList.push({ start: +t.toFixed(2), src, vid: !!isVid });
}
rawList.sort((a, b) => a.start - b.start);
const rawBeats = [];
let nStock = 0;
for (let i = 0; i < rawList.length; i++) {
  const next = i + 1 < rawList.length ? rawList[i + 1].start : TOTAL;
  const gap = next - rawList[i].start;
  const dur = +Math.max(2.2, Math.min(gap, 8)).toFixed(2); // Amish: sostener 5–8s, techo 8
  if (rawList[i].vid) nStock++;
  rawBeats.push({ id: `${SLUG}_${i}`, start: rawList[i].start, kind: "raw", src: rawList[i].src, hue: "amber", darken: 0, dur, ...(rawList[i].vid ? { noSplit: true } : {}) });
}
console.log(`b-roll: img ${rawBeats.length - nStock} · stock ${nStock} · total ${rawBeats.length} · missing img ${missImg} anchor ${missAnchor}`);

const C = (comp, atPhrase, dur, zone, props = {}, maxTok) => ({ comp, at: atPhrase, dur, zone, props, maxTok });

// ── COMPONENTES (kit premium THEME_EARTH), anclados al TEXTO REAL ──
const PREMIUM = [
  C("HighlightSweep", "it s just physics that most people forgot", 4.8, "top", {
    pre: "This isn't a trick —", highlight: "it's just physics we forgot", post: ".", note: "catch the heat you already make instead of letting it fly up the chimney",
  }, 8),
  C("BigStatReveal", "somewhere north of 70", 4.6, "topLeft", {
    eyebrow: "A normal stove throws away", value: 70, suffix: "% up the chimney", support: "most of your fire's heat leaves as hot smoke — heat you cut, split and carried in",
  }, 4),
  C("BigStatReveal", "it ll be four five hundred degrees", 4.6, "topLeft", {
    eyebrow: "That stove pipe runs", value: 500, prefix: "400–", suffix: "°F", support: "four to five hundred degrees of heat you paid for, escaping straight into the cold sky",
  }, 6),
  C("HighlightSweep", "stop letting the heat run away", 4.8, "top", {
    pre: "The whole Amish trick:", highlight: "stop letting the heat run away", post: ".", note: "catch it, hold it in mass, and let it out slow for hours after the fire dies",
  }, 6),
  C("MythTruth", "endless heat well not endless", 5.2, "topLeft", {
    myth: "'Endless' heat, forever, from one fire",
    truth: "Nothing's endless — but one morning fire in enough mass keeps a room warm till the next one, on zero electricity",
  }, 5),
  C("NumberedSteps", "there s really there s four parts", 6.8, "left", {
    eyebrow: "Do one, or stack all four", title: "Four ways to keep the heat", steps: [
      { title: "Thermal mass", sub: "store the heat in brick and stone" },
      { title: "Heat reclaimer", sub: "rob the hot flue before it escapes" },
      { title: "Thermosiphon", sub: "move heat to another room, no pump" },
      { title: "Seal the drafts", sub: "stop the heat leaking back out" },
    ],
  }, 6),
  C("HighlightSweep", "we call it a heat shield but", 4.8, "top", {
    pre: "That brick wall behind the stove isn't a heat shield —", highlight: "it's a heat battery", post: ".", note: "it soaks heat all day and radiates it back all night, long after the fire's out",
  }, 6),
  C("PullQuote", "one wall of rock changed how he heated", 5.2, "topLeft", {
    quote: "One wall of rock changed how he heated for the rest of his life. It isn't hard — it's just been forgotten.",
  }, 7),
  C("BigStatReveal", "for the next 12 18 some", 4.6, "topLeft", {
    eyebrow: "A masonry heater radiates for", value: 24, prefix: "12–", suffix: " hours", support: "burn one hot fire, and a ton of warm stone gives heat back gentle and even, all day long",
  }, 6),
  C("FlowSteps", "room air rises up through the tubes", 6.2, "full", {
    title: "How the heat reclaimer works", nodes: [
      { label: "Hot flue in the middle", sub: "400° smoke, about to escape up the chimney" },
      { label: "Cold room air rises around it", sub: "convection — warm air wants to rise" },
      { label: "Warm air pours out the top", sub: "no fan, no power — just physics" },
    ],
  }, 7),
  C("MythTruth", "no fan and that s important no fan", 5.2, "topLeft", {
    myth: "You need a fan to move the heat around",
    truth: "A fan dies the moment the power does. This runs on the plain fact that hot air rises — that's the whole motor",
  }, 8),
  C("BigStatReveal", "people measure 10 15 sometimes 20 degrees", 4.6, "topLeft", {
    eyebrow: "Same fire, same wood — a reclaimer adds", value: 20, prefix: "10–", suffix: "° warmer", support: "ten to twenty degrees of extra warmth in the room, just by not throwing the flue heat away",
  }, 7),
  C("BigStatReveal", "something like a third to a half of", 5.0, "topLeft", {
    eyebrow: "The smoke up your flue carries off", value: 50, suffix: "% of the heat", support: "up to half of everything in that log leaves as hot exhaust — the single biggest waste in the system",
  }, 8),
  C("ChecklistReveal", "without a pump without ductwork without electricity", 6.2, "topLeft", {
    title: "A thermosiphon needs none of this", items: [
      "No pump — hot water rises on its own",
      "No ductwork, no blower",
      "No electricity, not a watt",
      "Just a coil of copper and gravity",
    ],
    stamp: "IT RUNS ON GRAVITY",
  }, 6),
  C("FlowSteps", "water when it gets hot rises when it", 6.2, "full", {
    title: "The thermosiphon loop", nodes: [
      { label: "Fire heats water in a coil", sub: "copper against the firebox" },
      { label: "Hot water rises on its own", sub: "up to a radiator in the next room" },
      { label: "Cooled water sinks back", sub: "and around it goes, as long as there's a fire" },
    ],
  }, 8),
  C("ChecklistReveal", "you must leave it open to the air", 6.4, "topLeft", {
    title: "Water + fire — the safety rules", items: [
      "Never seal the loop — leave an open tank up top",
      "Or fit a proper pressure-relief valve",
      "Trapped, heated water builds dangerous pressure",
      "First time? Read up or get help — do this one right",
    ],
    stamp: "DO NOT SKIP THIS",
  }, 8),
  C("DuelColumns", "you traded a thing that works on gravity", 6.2, "left", {
    title: "What we traded away", leftName: "The old way", rightName: "The modern furnace",
    rows: [
      { attr: "Runs on gravity, fire and stone", leftWins: true },
      { attr: "Still works when the grid is down", leftWins: true },
      { attr: "Needs power, filters, a technician", leftWins: false },
      { attr: "A bill to the gas company for life", leftWins: false },
    ],
  }, 8),
  C("BeforeAfter", "they didn t have furnaces and they didn t freeze", 5.2, "top", {
    eyebrow: "Our great-great-grandparents", beforeLabel: "No furnace", afterLabel: "Never froze", caption: "one hot fire a day, and a ton of stone that held it — for centuries",
  }, 8),
  C("HighlightSweep", "the exact day you need heat the most", 4.8, "top", {
    pre: "The ice storm, the grid down —", highlight: "the exact day you need heat, the furnace quits", post: ".", note: "no power means no blower, no gas, no heat. A fire and stone don't care about the grid",
  }, 7),
  C("PullQuote", "no money in teaching a man to never", 5.2, "topLeft", {
    quote: "A furnace that runs forever on nothing doesn't sell you anything next month. There's no money in teaching a man to never need you again.",
  }, 8),
  C("MythTruth", "i d have to feed the fire all", 5.2, "topLeft", {
    myth: "You'd have to feed the fire all night",
    truth: "That's the whole point of the mass. Burn one hot fire and the stone radiates 10–12 hours — some setups a full day. Nobody's up at 3 a.m.",
  }, 8),
  C("MythTruth", "isn t a wood fire dirty smokey", 5.2, "topLeft", {
    myth: "Wood heat is dirty and smoky",
    truth: "A rocket-style burn goes hot, clean and complete before the smoke ever hits the mass — cleaner than the old stove, and it uses less wood",
  }, 6),
  C("MythTruth", "this must take a ton of wood other", 5.2, "topLeft", {
    myth: "This must burn a ton of wood",
    truth: "The opposite — catching and storing the heat means you burn hot once and coast. A mass system can cut your wood in half",
  }, 8),
  C("PullQuote", "that s about your family being okay on", 5.4, "topLeft", {
    quote: "This isn't really about a heating bill. It's about your family being warm on the one night the grid goes down — the night it actually counts.",
  }, 8),
  C("NumberedSteps", "let me pull it all together", 6.8, "left", {
    eyebrow: "This weekend — simplest to hardest", title: "Your whole plan", steps: [
      { title: "Build the mass", sub: "stack brick or stone behind the stove" },
      { title: "Add a reclaimer", sub: "double barrel or clamp-on tubes — no fan" },
      { title: "Seal the drafts", sub: "boring, free, essential" },
      { title: "Add a thermosiphon", sub: "when you're ready, done safely" },
    ],
  }, 6),
  C("CtaCard", "it s the first section of a little", 6.2, "topLeft", {
    eyebrow: "A hundred old methods, written down", title: "The Plain Almanac",
    bullet: "the plain-folk ways to heat, cool and keep a home off the bill cycle — the heating chapter is the first section. Link up at the top of the description", price: 0, cta: "LINK IN THE DESCRIPTION",
  }, 8),
  C("PullQuote", "it was never magic it was never expensive", 5.4, "topLeft", {
    quote: "It was never magic. It was never expensive. It was just the heat you already make — and refusing to let it get away.",
  }, 7),
];

// ── DIAGRAMAS MassHeaterDiagram (escena completa, kind massheater) ──
const MASS = [
  { at: "the fire s not the heater the fire just charges", mt: 8, dur: 8.0, mode: "flow",
    eyebrow: "Part one — the masonry heater", title: "Burn hot, store it in stone",
    fire: { text: "Fierce fire", sub: "1–2 hours, burns clean" },
    mass: { text: "Stone drinks the heat", sub: "winding smoke channels" },
    out: { text: "Radiates 12–24 hrs", sub: "gentle, even warmth" },
    coolTag: "smoke leaves cool", effTag: "one fire a day" },
  { at: "a rocket mass version of this", mt: 6, dur: 9.0, mode: "rocket",
    eyebrow: "Part two — the rocket mass heater", title: "Anatomy of a rocket mass heater",
    fire: { text: "J-tube feed", sub: "wood stands on end" },
    mass: { text: "Cob & stone bench", sub: "clay, sand, straw — nearly free" },
    out: { text: "A heated seat", sub: "warm for hours, runs on sticks" },
    coolTag: "smoke burns twice", effTag: "−90% wood" },
];

const compBeats = [];
let nOv = 0; const compCount = {};
for (const p of PREMIUM) {
  const s = atc(p.at, p.maxTok);
  if (s == null) continue;
  compBeats.push({ id: `ov_${p.comp.toLowerCase()}_${Math.round(s)}`, start: +s.toFixed(2), dur: p.dur, kind: "premium", overlay: true, comp: p.comp, theme: "earth", zone: p.zone, ...p.props });
  nOv++; compCount[p.comp] = (compCount[p.comp] || 0) + 1;
}
// massheater beats (full scene, cuentan como cobertura → avatar oculto)
const diagBeats = [];
for (const m of MASS) {
  const s = atc(m.at, m.mt);
  if (s == null) continue;
  diagBeats.push({ id: `diag_${m.mode}_${Math.round(s)}`, start: +s.toFixed(2), dur: m.dur, kind: "massheater",
    mode: m.mode, eyebrow: m.eyebrow, title: m.title, fire: m.fire, mass: m.mass, out: m.out, coolTag: m.coolTag, effTag: m.effTag });
  compCount["MassHeaterDiagram"] = (compCount["MassHeaterDiagram"] || 0) + 1;
}

const coverExtra = [...compBeats, ...diagBeats];
const compSpans = coverExtra.map((b) => [b.start, +(b.start + (b.dur || 3)).toFixed(2)]);
const inComp = (t) => compSpans.some(([s, e]) => s <= t && e > t);

// El MassHeaterDiagram es escena OPACA (no overlay): ningún raw puede empezar dentro de su span
// (quedaría dibujado ENCIMA del diagrama). Los descartamos; el diagrama cubre ese momento.
const diagSpans = diagBeats.map((b) => [b.start, +(b.start + b.dur).toFixed(2)]);
for (let i = rawBeats.length - 1; i >= 0; i--) {
  const b = rawBeats[i];
  if (diagSpans.some(([s, e]) => b.start >= s - 0.01 && b.start < e)) rawBeats.splice(i, 1);
}

// ── COBERTURA SIN HUECOS: recortar imgs bajo componente; slivers <1.2s se cierran; ≥1.2s → AVATAR full ──
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

const beats = [...rawBeats, ...compBeats, ...diagBeats].sort((a, b) => a.start - b.start);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, beats }, null, 1));
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);

const fullCount = windows.filter((w) => w.mode === "full").length;
const avSecs = windows.reduce((a, w, i) => a + (w.mode === "full" ? ((windows[i + 1]?.start ?? TOTAL) - w.start) : 0), 0);
console.log(`beats ${beats.length} (b-roll ${rawBeats.length}) · premium ${nOv} · massheater ${diagBeats.length} · avatar full x${fullCount} (${avSecs.toFixed(0)}s / ${TOTAL.toFixed(0)}s = ${(avSecs / TOTAL * 100).toFixed(0)}%) · dur ${(TOTAL / 60).toFixed(1)}min`);
console.log("componentes:", JSON.stringify(compCount));
