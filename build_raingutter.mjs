// build_raingutter.mjs — "This Amish Rain Gutter Trick Gives You a Zero Water Bill"
// Canal Claudio Yoder (@claudioyoder-amish · INGLÉS). Avatar full en tramos retóricos +
// b-roll REAL (stock Pexels) + fotos reales de la web (Bing) + presentador gpt-image-2 (avatar ref)
// + kit premium THEME_EARTH. CTA = The Plain Almanac (sin precio/link en voz).
// Salida: beatsheet/raingutter.json + src/VideoEdit/avatar_raingutter.gen.ts
import fs from "fs";

const SLUG = "raingutter";
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
const AV_DUR = 1007.6;
const TOTAL = Math.min(+((Wc[Wc.length - 1].e) / 1000 + 0.6).toFixed(2), AV_DUR);

const P = (x) => `img/${x}.png`;   // presentador gpt-image-2 (ref = avatar)
const O = (x) => `img/${x}.jpg`;   // foto real de la web (Bing), normalizada a jpg en img/
const S = (x) => `broll/${x}.mp4`; // stock real (Pexels)

// ── GRID DIRECTOR: [phrase(anchor verbatim), src, maxTok, isVid] ── cada plano anclado a SUS palabras
const VIS = [
  // ── HOOK / COLD OPEN (0–95) — empaque trailer: cortes cortos, agua fuerte ──
  ["there s a barrel sitting behind my shed", P("rg_p_by_barrel"), 8, false],
  ["55 gallons and the last time it rained", S("rg_s_rainroof"), 6, true],
  ["that barrel filled to the top and started spilling", S("rg_s_barreloverflow"), 7, true],
  ["over in about 20 minutes", S("rg_s_rainheavy"), 4, true],
  ["that same rain the exact same rain ran off your roof", S("rg_s_rainroof2"), 9, true],
  ["and it went straight down the gutter", S("rg_s_raingutter"), 6, true],
  ["into the downspout out to the curb", O("rg_o_downspout"), 6, false],
  ["and down the drain gone", S("rg_s_downdrain"), 4, true],
  ["you turned on your tap", S("rg_s_tapwater"), 5, true],
  ["you paid the town to pump that same kind of water", S("rg_s_tapfill"), 9, true],
  ["you paid for the sky", O("rg_o_rainsky"), 5, false],
  ["i want to show you how to stop doing that", P("rg_p_amish_intro"), 8, false],
  ["my name s claudio i m amish", P("rg_p_amish_intro"), 5, false],
  ["there s a cistern under the ground on our place", O("rg_o_cistern"), 8, false],
  ["and it catches the rain off the barn roof", S("rg_s_barnroofrain"), 7, true],
  ["no motor no meter no monthly envelope", S("rg_o_watermeter"), 5, true],
  ["just a roof and gravity and a hole in the ground", O("rg_o_rainbarrel"), 9, false],
  ["a green buggy mess that i m scared to use", O("rg_o_greenbarrel"), 8, false],
  ["how to get pressure out of it without electricity", P("rg_p_by_barrel"), 8, false],
  ["a warning near the end a real one", P("rg_p_serious_safety"), 7, false],
  ["this is a weekend less than a weekend", P("rg_p_amish_intro"), 6, false],

  // ── THE ROOF IS A COLLECTOR / THE MATH (95–210) ──
  ["let me start with the roof", P("rg_p_point_roof"), 5, false],
  ["you are already standing under a rain collector", O("rg_o_roofrain"), 7, false],
  ["for every one inch of rain that falls", S("rg_s_rainroof"), 7, true],
  ["a thousand square feet of roof", O("rg_o_bigroof"), 5, false],
  ["most houses the roof s bigger than that", O("rg_o_househouse"), 6, false],
  ["a single decent rainstorm an inch two inches", S("rg_s_rainstorm"), 7, true],
  ["landing on your house and running away from you", S("rg_s_raindownspout"), 7, true],
  ["we get oh 40 inches of rain a year", S("rg_s_rainfield"), 8, true],
  ["you re letting all of it run to the curb", S("rg_s_rainstreet"), 8, true],
  ["stop the water from running away", S("rg_s_gutteroverflow"), 5, true],
  ["put it somewhere you can use it", O("rg_o_rainbarrel"), 6, false],

  // ── CATCHING: GUTTER + CLEAN + SCREEN (210–320) ──
  ["let s do the catching first", P("rg_p_point_downspout"), 5, false],
  ["the rain hits the roof runs to the edge", S("rg_s_guttergush"), 7, true],
  ["that vertical pipe that carries it down to the ground", O("rg_o_downspout"), 8, false],
  ["cut into that downspout and send the water into a barrel", O("rg_o_downspout_diverter"), 9, false],
  ["clean the gutter first i mean it", O("rg_o_cloggedgutter"), 6, false],
  ["get the leaves out get the shingle grit out", S("rg_s_cleangutter"), 8, true],
  ["put a screen over the mouth of the gutter", P("rg_p_hold_mesh"), 8, false],
  ["just a mesh quarter inch is fine", S("rg_o_meshscreen"), 6, true],
  ["and this is the important one the mosquitoes", S("rg_s_mosquito"), 6, true],
  ["mosquitoes need still water to lay their eggs", S("rg_s_stillwater"), 7, true],
  ["top of the downspout and the lid of the barrel both", O("rg_o_screenedbarrel"), 9, false],

  // ── BARREL + DIVERTER + FOOD-GRADE (320–430) ──
  ["now you re going to put your barrel under the downspout", O("rg_o_rainbarrel"), 9, false],
  ["the simplest the one i d tell you to do", P("rg_p_by_barrel"), 7, false],
  ["is a diverter it s a little kit", O("rg_o_downspout_diverter"), 6, false],
  ["it has a hose that runs over to your barrel", O("rg_o_diverterhose"), 8, false],
  ["when the barrel s full it just sends the extra", S("rg_s_barrelfill"), 8, true],
  ["you don t come home to a flooded yard", S("rg_s_floodyard"), 7, true],
  ["get a food grade barrel please", O("rg_o_bluedrum"), 5, false],
  ["a 55 gallon food grade drum the blue ones", O("rg_o_bluedrum"), 8, false],
  ["a barrel that held some chemical", O("rg_o_chemdrum"), 5, false],
  ["and now it s in your tomatoes", S("rg_s_tomatoes"), 5, true],

  // ── SCALING: barrels → totes → cistern (430–520) ──
  ["one barrel fills fast", O("rg_o_fullbarrel"), 4, false],
  ["think of it as the proof", P("rg_p_by_barrel"), 5, false],
  ["the cheapest way to grow is to link barrels together", O("rg_o_barrels_linked"), 9, false],
  ["run them along the side of the shed", O("rg_o_barrelrow"), 6, false],
  ["what s called an ibc tote", S("rg_o_ibctote"), 5, true],
  ["those big square tanks in a metal cage", S("rg_o_ibctote"), 7, true],
  ["two of those totes on the shady side of the house", S("rg_o_twototes"), 9, true],
  ["that s a cistern a big tank in the ground", O("rg_o_cistern"), 8, false],
  ["holds thousands of gallons through the dry months", S("rg_s_dryearth"), 6, true],

  // ── FIRST FLUSH (520–610) ──
  ["the first water off your roof is dirty", P("rg_p_point_roof"), 7, false],
  ["collecting dust pollen bird droppings soot", S("rg_o_dirtyroof"), 5, true],
  ["that first gush of water sweeps all of that off the roof", S("rg_s_roofrunoff"), 10, true],
  ["the fix is called a first flush", S("rg_o_firstflush"), 6, true],
  ["a piece of pvc pipe standing straight up", S("rg_o_firstflush"), 7, true],
  ["the water rises past it and flows on into your barrel", S("rg_s_pvcwater"), 9, true],
  ["you put a tiny drip hole or a little valve", S("rg_o_valvepvc"), 8, true],
  ["throw away about the first 10 gallons", P("rg_p_first_flush"), 6, false],
  ["build the first flush everybody skips it", S("rg_o_firstflush"), 6, true],

  // ── PRESSURE (610–680) ──
  ["a sad little dribble", S("rg_s_dribble"), 4, true],
  ["you lift the barrel up height is pressure", P("rg_p_lift_barrel"), 7, false],
  ["you put your barrel up on cinder blocks", S("rg_o_cinderblocks"), 7, true],
  ["get it two three four feet off the ground", S("rg_o_barrelstand"), 8, true],
  ["run a soaker hose across the whole garden", S("rg_s_soakerhose"), 7, true],
  ["water falling is water with pressure", S("rg_s_spigotflow"), 5, true],
  ["there s an amish pump that does exactly that", P("rg_p_point_desc"), 7, false],

  // ── OVERFLOW (680–720) ──
  ["let me talk about overflow", P("rg_p_by_barrel"), 4, false],
  ["the water has to go somewhere", S("rg_s_overflowwater"), 5, true],
  ["water against a foundation is how basements flood", S("rg_o_dampbasement"), 7, true],
  ["put an overflow outlet near the top of the barrel", S("rg_o_overflowhose"), 9, true],
  ["aim it away from the house downhill", S("rg_s_gardenflow"), 6, true],

  // ── MYTH: ACID RAIN + WATER ITSELF IS CLEAN (720–800) ──
  ["isn t it acid rain", S("rg_s_rainwindow"), 5, true],
  ["is some of the cleanest water there is", S("rg_s_raindropripple"), 7, true],
  ["it s distilled basically nature evaporated it", S("rg_s_clouds"), 6, true],
  ["what touches the rain is the problem", O("rg_o_downspout"), 6, false],
  ["your tomatoes will be happier with rain water", S("rg_s_gardengrow"), 7, true],

  // ── WARNING 1: POTABILITY (800–860) ──
  ["do not assume this water is safe to drink", P("rg_p_serious_safety"), 8, false],
  ["washing the car flushing a toilet washing clothes", S("rg_s_laundry"), 7, true],
  ["that alone is going to gut your water bill", S("rg_o_waterbill"), 8, true],
  ["you need good filtration and you need to disinfect it", S("rg_s_boilwater"), 9, true],
  ["there s sand filtration there s settling", S("rg_o_sandfilter"), 5, true],

  // ── WARNING 2: LEGAL (860–930) ──
  ["it is against the rules to collect the rain", P("rg_p_serious_safety"), 8, false],
  ["a handful of states out west especially", S("rg_o_usmap"), 6, true],
  ["some limit how much you can store", O("rg_o_rainbarrel"), 5, false],
  ["some towns will give you a rebate for it", O("rg_o_barrels_linked"), 7, false],
  ["check your own state and your own town", P("rg_p_point_desc"), 7, false],

  // ── RECAP (930–990) ──
  ["here s your weekend here s the whole thing in order", P("rg_p_point_desc"), 9, false],
  ["clean your gutter and put a screen on the down spout", S("rg_s_cleangutter"), 9, true],
  ["get a food grade barrel 55 gallons to start", O("rg_o_bluedrum"), 8, false],
  ["put the barrel up on blocks two feet at least", S("rg_o_cinderblocks"), 8, true],
  ["add an overflow near the top aimed away from your house", S("rg_o_overflowhose"), 9, true],
  ["put a spigot near the bottom", S("rg_o_spigot"), 5, true],
  ["watch clean water come out that you did not pay a soul for", S("rg_s_spigotflow"), 10, true],

  // ── CTA + CLOSE (990–1007) ──
  ["i put all of that the whole water side", P("rg_p_hold_book"), 7, false],
  ["they cannot shut off the sky", O("rg_o_rainsky"), 5, false],
  ["are you going to put a barrel under it", P("rg_p_by_barrel"), 7, false],
  ["leave a comment and tell me where you re at", P("rg_p_point_desc"), 8, false],
  ["the next one i want to show you is the pump", S("rg_o_rampump"), 8, true],
  ["is already falling on you for free", S("rg_s_rainhands"), 6, true],
  ["go put the barrel out i ll see you on the next one", P("rg_p_close_smile"), 10, false],
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
  C("HighlightSweep", "you paid for the sky", 4.8, "top", {
    pre: "Every time it rains,", highlight: "you pay for the sky", post: " — twice.", note: "the rain runs off your roof to the curb, and then you buy that same water back from the town",
  }, 5),
  C("BigStatReveal", "for every one inch of rain that falls", 4.8, "topLeft", {
    eyebrow: "One inch of rain on 1,000 sq ft of roof =", value: 623, suffix: " gallons", support: "call it 600 gallons — off a roof that size, from a single ordinary inch of rain, running straight to the curb",
  }, 7),
  C("HighlightSweep", "and then buying it back by the gallon", 4.8, "top", {
    pre: "Tens of thousands of gallons a year —", highlight: "landing free, then bought back", post: ".", note: "forty inches of rain a year on your roof adds up fast, and all of it runs away",
  }, 7),
  C("HighlightSweep", "stop the water from running away", 4.6, "top", {
    pre: "The whole job:", highlight: "stop the water running away, and put it where you can use it", post: ".", note: "everything else is just detail",
  }, 5),
  C("FlowSteps", "the rain hits the roof runs to the edge", 6.2, "full", {
    kicker: "HOW IT WORKS", title: "How a roof becomes a rain catcher", nodes: [
      { label: "Rain hits the roof", sub: "your whole roof is already a collector" },
      { label: "Gutter → downspout", sub: "it's all funneled to one pipe" },
      { label: "Interrupt the downspout", sub: "send it to a barrel, not the curb" },
    ],
  }, 7),
  C("ChecklistReveal", "that mesh is going to keep out the leaves", 6.2, "topLeft", {
    kicker: "WHAT THE SCREEN STOPS", title: "A simple screen keeps out", items: [
      "Leaves and twigs off the roof",
      "Shingle grit and roof debris",
      "Mosquitoes — no still water to breed in",
      "Screen the downspout AND the barrel lid",
    ],
    stamp: "SCREEN IT",
  }, 8),
  C("BigStatReveal", "is a diverter it s a little kit", 4.6, "topLeft", {
    eyebrow: "A downspout diverter kit runs about", value: 30, prefix: "$20–", suffix: "", support: "cut a section out of the downspout, slide it in — and when the barrel's full, the extra just goes back down the normal way",
  }, 6),
  C("HighlightSweep", "food grade that s the rule", 4.6, "top", {
    pre: "One rule on the barrel:", highlight: "food-grade only", post: ".", note: "it held food or drink before, never a chemical — you'll never fully rinse that out, and it ends up in your tomatoes",
  }, 5),
  C("BigStatReveal", "275 gallons each", 4.6, "topLeft", {
    eyebrow: "Ready to scale up? One IBC tote holds", value: 275, suffix: " gallons", support: "that's five barrels' worth in one square tank — often $50–100 used. Link barrels, add totes, and the ladder goes all the way to a cistern",
  }, 4),
  C("BigStatReveal", "the first water off your roof is dirty", 4.8, "topLeft", {
    eyebrow: "The first water off the roof is the", value: 1, prefix: "#", suffix: " thing people skip", support: "dust, pollen, bird droppings, soot and grit — the first gush is the dirtiest water of the whole storm",
  }, 7),
  C("FlowSteps", "you can build a first flush diverter", 6.4, "full", {
    kicker: "HOW IT WORKS", title: "The first-flush diverter", nodes: [
      { label: "Dirty first water fills a standing pipe", sub: "a length of PVC beside the downspout" },
      { label: "Once it's full, clean water rises past", sub: "and flows on into your barrel" },
      { label: "A drip hole empties it after the storm", sub: "resets itself for next time" },
    ],
  }, 7),
  C("BigStatReveal", "throw away about the first 10 gallons", 4.6, "topLeft", {
    eyebrow: "Rule of thumb — first flush about", value: 10, suffix: " gallons", support: "a gallon or two for every 100 sq ft of roof. Rough is fine — even a crude first flush makes the barrel water dramatically cleaner",
  }, 6),
  C("BeforeAfter", "a sad little dribble", 5.2, "top", {
    eyebrow: "Same barrel, same water", beforeLabel: "On the ground: a dribble", afterLabel: "Up on blocks: real force", caption: "height is pressure — raise the barrel 2–4 feet and gravity runs a soaker hose across the whole garden, no pump",
  }, 4),
  C("BigStatReveal", "water against a foundation is how basements flood", 4.8, "topLeft", {
    eyebrow: "A 5-minute overflow saves you a", value: 5000, prefix: "$", suffix: " problem", support: "put an overflow near the top and aim it downhill, away from the house — trapped water against the foundation is how basements flood",
  }, 8),
  C("MythTruth", "isn t it acid rain", 5.4, "topLeft", {
    myth: "Rainwater is dirty 'acid rain' — not safe",
    truth: "The rain itself is nearly distilled — some of the cleanest water there is. It's the roof, gutter and barrel that need handling, not the rain",
    mythLabel: "MYTH", truthLabel: "TRUTH",
  }, 5),
  C("ChecklistReveal", "do not assume this water is safe to drink", 6.6, "topLeft", {
    kicker: "USE IT RIGHT", title: "Drinking vs. everything else", items: [
      "Garden, lawn, laundry, flushing, animals — perfect",
      "That alone guts most of a household's water bill",
      "Drinking / cooking: filter AND disinfect first",
      "Boil, proper filter, or UV — then test it",
    ],
    stamp: "DON'T DRINK IT RAW",
  }, 8),
  C("ChecklistReveal", "it is against the rules to collect the rain", 6.4, "topLeft", {
    kicker: "KNOW THE LAW", title: "Before a big system — check the law", items: [
      "A few western states restrict rainwater",
      "Some just want you to register it",
      "Most of the country: fine, even rebates",
      "Search: '[your state] rainwater harvesting law'",
    ],
    stamp: "CHECK YOUR STATE",
  }, 8),
  C("NumberedSteps", "here s your weekend here s the whole thing in order", 7.2, "left", {
    eyebrow: "This weekend — in order", title: "Your whole rain-catcher", steps: [
      { title: "Check your local rule", sub: "ten minutes, before anything else" },
      { title: "Clean the gutter + screen it", sub: "leaves and bugs out" },
      { title: "Food-grade barrel on blocks", sub: "2+ feet up = free pressure" },
      { title: "Diverter + first flush + overflow", sub: "clean water in, spillover aimed away" },
    ],
  }, 9),
  C("BigStatReveal", "that s a 50 maybe 80 project", 4.8, "topLeft", {
    eyebrow: "The whole first barrel runs about", value: 80, prefix: "$50–", suffix: "", support: "and the next time it rains, you turn a spigot and clean water comes out that you didn't pay a soul for",
  }, 7),
  C("CtaCard", "i put all of that the whole water side", 6.4, "topLeft", {
    eyebrow: "The whole water side, written down", title: "The Plain Almanac",
    bullet: "how the Amish size a cistern to carry a house through a dry spell, and the $40 ram pump that moves your rainwater uphill on no power — it's the water section. Link's up at the top of the description", price: 0, cta: "LINK IN THE DESCRIPTION",
  }, 7),
  C("DuelColumns", "they cannot shut off the sky", 6.2, "left", {
    title: "Two ways to get water", leftName: "Rain off your roof", rightName: "The town's meter",
    rows: [
      { attr: "Free — it always was", leftWins: true },
      { attr: "Still there in a dry summer", leftWins: true },
      { attr: "No monthly bill, no restrictions", leftWins: true },
      { attr: "Something they can shut off", leftWins: false },
    ],
  }, 6),
  C("PullQuote", "is already falling on you for free", 5.6, "topLeft", {
    quote: "Most of what you need is already falling on you for free. You just have to put something under it.",
  }, 7),
  // ── refuerzos de variedad por tramo (density_gate ≥5 tipos/tramo) ──
  C("MythTruth", "we don t pay a water bill the way you do", 5.4, "topLeft", {
    myth: "A 'zero water bill' sounds too good to be true",
    truth: "It's not magic — catch the rain off your own roof and you stop buying most of what a household actually uses",
    mythLabel: "MYTH", truthLabel: "TRUTH",
  }, 8),
  C("PullQuote", "just a roof and gravity and a hole in the ground", 5.4, "topLeft", {
    quote: "No motor. No meter. No monthly envelope from the county. Just a roof, gravity, and a hole in the ground.",
  }, 9),
  C("NumberedSteps", "you ll know how to catch the rain off your own roof", 6.6, "left", {
    eyebrow: "By the end of this video", title: "You'll know how to", steps: [
      { title: "Catch the rain", sub: "off your own roof, into a barrel" },
      { title: "Keep it clean", sub: "screen it and first-flush it" },
      { title: "Get pressure", sub: "without a pump or a watt of power" },
    ],
  }, 9),
  C("DuelColumns", "a barrel that held some chemical", 6.0, "left", {
    title: "Which barrel?", leftName: "Food-grade drum", rightName: "Any old chemical drum",
    rows: [
      { attr: "Held food or drink before", leftWins: true },
      { attr: "Safe for the garden and your tomatoes", leftWins: true },
      { attr: "$20–30 used, easy to find", leftWins: true },
      { attr: "Residue you can never rinse out", leftWins: false },
    ],
  }, 5),
  C("ChecklistReveal", "here s how you grow it without spending a fortune", 6.4, "topLeft", {
    kicker: "SCALING UP", title: "Growing your storage, cheap", items: [
      "Link barrels — they fill as one",
      "IBC tote = 275 gallons (five barrels)",
      "Totes on the shady side of the house",
      "A cistern holds thousands of gallons",
    ],
    stamp: "ONE BARREL → CISTERN",
  }, 9),
  C("PullQuote", "build the first flush everybody skips it", 5.2, "topLeft", {
    quote: "Build the first flush. Everybody skips it. Don't be everybody.",
  }, 6),
  C("HighlightSweep", "height is pressure that s the whole secret", 4.8, "top", {
    pre: "The whole secret:", highlight: "height is pressure", post: ".", note: "every foot you raise the barrel adds pressure — get it 2–4 feet up and gravity runs a soaker hose on its own",
  }, 7),
  C("BeforeAfter", "your tomatoes will be happier with rain water", 5.2, "top", {
    eyebrow: "Rain vs. tap, for your garden", beforeLabel: "Tap: chlorinated", afterLabel: "Rain: plants love it", caption: "rainwater is nearly distilled — your garden will be happier with it than the treated stuff from the hose",
  }, 7),
];

const compBeats = [];
let nOv = 0; const compCount = {};
for (const p of PREMIUM) {
  const s = atc(p.at, p.maxTok);
  if (s == null) continue;
  compBeats.push({ id: `ov_${p.comp.toLowerCase()}_${Math.round(s)}`, start: +s.toFixed(2), dur: p.dur, kind: "premium", overlay: true, comp: p.comp, theme: "earth", zone: p.zone, ...p.props });
  nOv++; compCount[p.comp] = (compCount[p.comp] || 0) + 1;
}

const coverExtra = [...compBeats];
const compSpans = coverExtra.map((b) => [b.start, +(b.start + (b.dur || 3)).toFixed(2)]);
const inComp = (t) => compSpans.some(([s, e]) => s <= t && e > t);

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

const beats = [...rawBeats, ...compBeats].sort((a, b) => a.start - b.start);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, beats }, null, 1));
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);

const fullCount = windows.filter((w) => w.mode === "full").length;
const avSecs = windows.reduce((a, w, i) => a + (w.mode === "full" ? ((windows[i + 1]?.start ?? TOTAL) - w.start) : 0), 0);
console.log(`beats ${beats.length} (b-roll ${rawBeats.length}) · premium ${nOv} · avatar full x${fullCount} (${avSecs.toFixed(0)}s / ${TOTAL.toFixed(0)}s = ${(avSecs / TOTAL * 100).toFixed(0)}%) · dur ${(TOTAL / 60).toFixed(1)}min`);
console.log("componentes:", JSON.stringify(compCount));
