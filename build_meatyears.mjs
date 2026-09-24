// build_meatyears.mjs — Amish AVATAR, "Store Meat for 10+ Years — Refrigeration NOT Required".
// Video #4 de la serie de Claudio (herbs→onions→tomatoes→MEAT). Aislado: broll/meatyears/ + img/meatyears/.
// COLD-OPEN = TRAILER. 5 métodos: salt · smoke · fat · jar (canning) · pemmican (10+ años, el héroe).
import fs from "fs";
const SLUG = "meatyears";
const TOTAL = 1308.8;
const OPEN = 1.8;
const COLD_END = 48.0;
const OV = 0.5;
const HERO = ", casual documentary phone snapshot, rustic Amish farm cellar and kitchen, warm window light, natural, nothing polished, no AI look, low saturation, soft muted colors, natural weathered hands, appetizing cured meat not gory, no text, no watermark";
const IMG_STYLE = HERO;
const hero = (id, prompt) => ({ name: `${SLUG}/${id}`, prompt: prompt + HERO });

const AV_FULL = [
  [48.0, 61.0],
  [1117.5, 1145.0],
  [1275.0, TOTAL],
];

const COLD_OPEN = [
  { id: "m_h_cellar", start: 1.8, dur: 2.6, kind: "raw", src: "img/meatyears/m_h_cellar.png", darken: 0,
    gen: { type: "image", ...hero("m_h_cellar", "a cool dark stone root cellar with cured hams hanging in the dim lamplight, wrapped in cloth") } },
  { id: "m_h_ham", start: 4.4, dur: 2.2, kind: "raw", src: "img/meatyears/m_h_ham.png", darken: 0,
    gen: { type: "image", ...hero("m_h_ham", "weathered hands lifting a cloth-wrapped salt-cured ham dusted white with salt") } },
  { id: "m_h_impact", start: 6.6, dur: 4.6, kind: "impact", image: "img/meatyears/m_h_cellar.png",
    setup: "No fridge. No freezer.", impact: "Ten years.", impactAccent: "good", hitAt: 2.0, boom: 0, darken: 0.42 },
  { id: "m_h_salt", start: 11.2, dur: 2.6, kind: "raw", src: "img/meatyears/m_h_salt.png", darken: 0,
    gen: { type: "image", ...hero("m_h_salt", "coarse white curing salt being poured over slabs of pork packed in a stoneware crock") } },
  { id: "m_h_key1", start: 14.0, dur: 3.8, kind: "keyphrase", text: "Ten years. No power.", src: "img/meatyears/m_h_key1.png", accent: "good", fontSize: 96,
    gen: { type: "image", ...hero("m_h_key1", "an old glass jar of preserved meat on a dark cellar shelf, lamplight") } },
  { id: "m_h_smoke", start: 17.8, dur: 2.6, kind: "raw", src: "img/meatyears/m_h_smoke.png", darken: 0,
    gen: { type: "image", ...hero("m_h_smoke", "a whole ham hanging in a smokehouse with cool woodsmoke curling around it") } },
  { id: "m_h_fat", start: 20.4, dur: 2.6, kind: "raw", src: "img/meatyears/m_h_fat.png", darken: 0,
    gen: { type: "image", ...hero("m_h_fat", "a stoneware crock of cooked meat sealed under a hard white cap of fat") } },
  { id: "m_h_key2", start: 23.0, dur: 3.8, kind: "keyphrase", text: "The way it was always done.", src: "img/meatyears/m_h_key2.png", accent: "good", fontSize: 78,
    gen: { type: "image", ...hero("m_h_key2", "cured and smoked meats hanging from old barn rafters in warm light") } },
  { id: "m_h_jar", start: 26.8, dur: 3.0, kind: "raw", src: "img/meatyears/m_h_jar.png", darken: 0,
    gen: { type: "image", ...hero("m_h_jar", "glass mason jars of home-canned cooked meat lined up on a rustic cellar shelf") } },
  { id: "m_h_pem", start: 29.8, dur: 3.4, kind: "raw", src: "img/meatyears/m_h_pem.png", darken: 0,
    gen: { type: "image", ...hero("m_h_pem", "dense dark pressed pemmican cakes of dried meat and fat on a wooden board") } },
  { id: "m_h_hog", start: 33.2, dur: 3.0, kind: "raw", src: "img/meatyears/m_h_hog.png", darken: 0,
    gen: { type: "image", ...hero("m_h_hog", "vintage sepia photograph of a farm butchering day in autumn, film grain") } },
  { id: "m_h_key3", start: 36.2, dur: 4.0, kind: "keyphrase", text: "Salt. Smoke. Fat. And time.", src: "img/meatyears/m_h_key3.png", accent: "good", fontSize: 82,
    gen: { type: "image", ...hero("m_h_key3", "salt, a smoking fire, and rendered fat beside cuts of meat on a table") } },
  { id: "m_h_pantry", start: 40.2, dur: 3.4, kind: "raw", src: "img/meatyears/m_h_pantry.png", darken: 0,
    gen: { type: "image", ...hero("m_h_pantry", "a full winter cellar of hanging cured meat, crocks and jars on rustic shelves") } },
  { id: "m_h_hands", start: 43.6, dur: 4.4, kind: "raw", src: "img/meatyears/m_h_hands.png", darken: 0,
    gen: { type: "image", ...hero("m_h_hands", "weathered hands hanging a cured ham on a hook in a dark cellar") } },
];

const BEATS_SRC = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8").replace(/^﻿/, ""));
const CLIPS = BEATS_SRC.map((b) => [ +(b.ms / 1000).toFixed(2), b.name, (b.queries && b.queries.length ? b.queries : [b.desc || b.phrase]), b.desc || b.phrase ]);
CLIPS.sort((a, b) => a[0] - b[0]);

const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const MINGAP = Number(process.env.MEAT_MINGAP) || 4.6;
const clips = [];
let lastT = -99;
for (const c of CLIPS.filter((c) => !inFull(c[0]) && c[0] >= COLD_END - 1e-6)) { if (c[0] - lastT < MINGAP) continue; clips.push(c); lastT = c[0]; }

const have = (name) => fs.existsSync(`public/broll/${SLUG}/${name}.mp4`);
const imgSrc = (name) => { for (const e of ["png", "jpg", "jpeg", "webp"]) if (fs.existsSync(`public/img/${SLUG}/${name}.${e}`)) return `img/${SLUG}/${name}.${e}`; return null; };
const nClip = clips.filter((c) => have(c[1])).length;

const avStarts = AV_FULL.map(([s]) => s);
const bounds = [...clips.map((c) => c[0]), ...avStarts, TOTAL].sort((a, b) => a - b);
const nextBound = (t) => bounds.find((b) => b > t + 1e-6) ?? TOTAL;

const beats = clips.map(([t, name, query]) => {
  const dur = +Math.min(nextBound(t) - t + OV, TOTAL - t).toFixed(2);
  if (have(name)) return { id: name, start: t, dur, kind: "raw", src: `broll/${SLUG}/${name}.mp4`, darken: 0 };
  const im = imgSrc(name);
  if (im) return { id: name, start: t, dur, kind: "raw", src: im, darken: 0 };
  const vq = Array.isArray(query) ? query[0] : query;
  return { id: name, start: t, dur, kind: "raw", src: `img/${SLUG}/${name}.png`, darken: 0, gen: { type: "image", name: `${SLUG}/${name}`, prompt: vq + IMG_STYLE } };
});
for (let i = beats.length - 1; i >= 0; i--) if (beats[i].start < COLD_END - 1e-6) beats.splice(i, 1);
beats.unshift(...COLD_OPEN);
beats.sort((a, b) => a.start - b.start);

const ck = (text) => ({ text, state: "done" });
const bg = (id, prompt) => ({ image: `img/${SLUG}/${id}_bg.png`, gen: { type: "image", name: `${SLUG}/${id}_bg`, prompt: prompt + IMG_STYLE } });
const COMPONENTS = [
  // ── HOOK / PROMISE (60–165) ──
  { t: 63, id: "c_fiveways", kind: "splitlist", palette: "G", title: "Five ways to keep meat", items: ["Salt — a crock of salt pork", "Smoke — the old smokehouse", "Fat — sealed under a fat cap", "The jar — pressure-canned", "Pemmican — 10+ years"] },
  { t: 110, id: "c_impossible", kind: "callout", hue: "amber", accent: "good", figure: "They say it's impossible", eyebrow: "The modern world", caption: "meat goes bad in a day, they tell you — only a machine on a wire can save it. It was not always so.", bgp: "a humming electric freezer versus a dark cellar of hanging meat" },
  { t: 150, id: "c_teasepem", kind: "callout", hue: "amber", accent: "good", figure: "The fifth one", eyebrow: "Almost nobody knows it", caption: "the single most powerful way to keep meat humans ever found — armies marched on it, explorers lived on it for years", bgp: "dark pressed pemmican cakes on a wooden board" },
  // ── THE ENEMY (169–241) ──
  { t: 176, id: "c_enemy", kind: "mistake", number: "!", eyebrow: "Understand the enemy", title: "Meat doesn't rot on its own", desc: "What spoils it is life — tiny living things that land on it, grow, and turn it. And they need the very same things every time.", bgp: "close macro of a raw cut of meat on a wooden board" },
  { t: 202, id: "c_law", kind: "splitlist", palette: "B", title: "Three things the enemy needs", items: ["Water — to grow in", "Warmth — to move fast", "Air — to breathe", "Take even one away, and it's helpless"] },
  { t: 228, id: "c_rob", kind: "callout", hue: "amber", accent: "good", figure: "Starve the enemy", eyebrow: "The whole secret", caption: "salt pulls the water, smoke dries and shields, fat locks out the air, the jar kills it outright — one law, five ways", bgp: "salt, smoke and fat beside cuts of meat" },
  // ── METHOD 1 · SALT (241–421) ──
  { t: 250, id: "c_saltwhy", kind: "callout", hue: "amber", accent: "good", figure: "Salt is thirsty", eyebrow: "Why it works", caption: "it reaches into the flesh and pulls the water out, and salts the meat too — the enemy can't live with no water and no room", bgp: "coarse salt drawing moisture from a slab of pork" },
  { t: 270, id: "c_cure", kind: "curediagram", eyebrow: "How the salt cure works", title: "Salt is thirsty", saltTag: "Salt packed all around", waterTag: "Pulls the water out", keepTag: "No water — no rot" },
  { t: 300, id: "c_saltpork", kind: "checklist", hue: "good", accent: "good", title: "Dry-salt cure (salt pork)", eyebrow: "The everyday way", items: [ck("Bed of salt in a clean crock"), ck("Pack meat, bury every side in salt"), ck("Layer up, salt over the top"), ck("Keep it cool — soak before you cook")], bgp: "slabs of pork buried in white salt in a stoneware crock" },
  { t: 342, id: "c_saltcheap", kind: "stat", hue: "amber", accent: "good", value: 2, suffix: " dollars", label: "a plain box of salt — once worth its weight in silver, the most powerful food-keeper there is", eyebrow: "The cost of it" },
  { t: 375, id: "c_saltmonths", kind: "stat", hue: "cold", accent: "good", value: 1, suffix: " year", label: "salt pork keeps in a cool place — months and months, no cold needed", eyebrow: "Salted" },
  { t: 405, id: "c_saltrule", kind: "mistake", number: "!", eyebrow: "Don't go light to save pennies", title: "Use enough salt", desc: "The salt is the whole protection. A skimpy cure is a spoiled crock. Use plenty, keep it cool, keep it clean — and salt will not fail you.", bgp: "a generous hand pouring salt over curing meat" },
  // ── METHOD 2 · SMOKE (421–563) ──
  { t: 432, id: "c_smoketwo", kind: "splitlist", palette: "G", title: "Smoke does two things", items: ["Dries the meat deep — no water", "Lays down a coat the enemy hates", "Partners with the salt underneath", "Dried + shielded, both at once"] },
  { t: 468, id: "c_smokehouse", kind: "checklist", hue: "good", accent: "good", title: "In the smokehouse", eyebrow: "Low and slow", items: [ck("Salt or brine the meat first"), ck("Hang it in cool smoke"), ck("Hardwood fire, smoldering low"), ck("A day or more — never let it flame")], bgp: "a ham hanging in a small rustic smokehouse over a low fire" },
  { t: 505, id: "c_smokewood", kind: "chips", hue: "amber", title: "Hardwoods only", chips: ["hickory", "apple", "oak", "maple", "never pine"], bgp: "split hardwood logs beside a smokehouse fire" },
  { t: 528, id: "c_coldhot", kind: "bars", hue: "cold", accent: "good", unit: "", title: "Cold smoke vs hot smoke", eyebrow: "Which one keeps it", bars: [{ label: "Hot smoke — cooks it", value: 3, display: "flavor", tone: "amber" }, { label: "Cold smoke + cure", value: 9, display: "keeps for months", winner: true }] },
  { t: 550, id: "c_hammonths", kind: "stat", hue: "cold", accent: "good", value: 1, suffix: " year", label: "a cured, cold-smoked ham hangs in the cool, wrapped from the flies — the better part of a year", eyebrow: "Smoked" },
  // ── METHOD 3 · FAT / CONFIT (563–655) ──
  { t: 578, id: "c_fatair", kind: "callout", hue: "amber", accent: "good", figure: "Take the air away", eyebrow: "The forgotten trick", caption: "cook the meat, pack it down, and drown it under its own fat — the enemy needs air, and there is none", bgp: "warm fat being poured over cooked meat packed in a crock" },
  { t: 608, id: "c_confit", kind: "checklist", hue: "good", accent: "good", title: "Potting in fat", eyebrow: "Confit, the old farm way", items: [ck("Cook the meat gentle in fat"), ck("Pack it into a clean crock"), ck("Cover it all under liquid fat"), ck("Let it set hard — seal, cool, dark")], bgp: "a crock of meat sealed under a hard white cap of fat" },
  { t: 638, id: "c_fatmonths", kind: "stat", hue: "cold", accent: "good", value: 1, suffix: " season", label: "a fat-sealed crock keeps for months in the cool and the dark — dig a piece out, press the fat back down", eyebrow: "Sealed in fat" },
  // ── METHOD 4 · JAR / CANNING (655–794) ──
  { t: 668, id: "c_canyears", kind: "stat", hue: "cold", accent: "good", value: 3, suffix: " years", label: "pressure-canned meat sits ready on the shelf — jars of tender cooked meat for any pot", eyebrow: "Canned" },
  { t: 692, id: "c_lowacid", kind: "mistake", number: "!", eyebrow: "The one you never guess at", title: "Meat is low-acid", desc: "One enemy grows in the sealed low-acid quiet of a jar and makes a poison you can't see, smell, or taste. Done right it's perfectly safe — but you must do it right.", bgp: "sealed glass jars of canned meat on a shelf" },
  { t: 720, id: "c_canner", kind: "mistake", number: "!", eyebrow: "The rule you never bend", title: "A pressure canner — always", desc: "Never a boiling water bath for meat. Only a pressure canner gets hot enough to kill the hidden enemy. Follow a current chart to the letter — no shortcuts, no guessing.", bgp: "a pressure canner with a dial gauge steaming on a stove" },
  { t: 758, id: "c_cansteps", kind: "checklist", hue: "good", accent: "good", title: "Canning meat safely", eyebrow: "By the book", items: [ck("Pack clean jars, leave headspace"), ck("Pressure canner — not a water bath"), ck("Current chart: pressure, time, altitude"), ck("Cool, check every seal, store dark")], bgp: "jars of raw-packed meat going into a pressure canner" },
  // ── METHOD 5 · PEMMICAN (794–1013) — EL HÉROE ──
  { t: 800, id: "c_pemhero", kind: "callout", hue: "amber", accent: "good", figure: "Pemmican", eyebrow: "The one you came for", caption: "the longest-keeping meat humans ever found — ten years, twenty, and more. Not magic: the whole law, done all at once", bgp: "dark dense pemmican cakes on a wooden board in warm light" },
  { t: 838, id: "c_pemmake", kind: "checklist", hue: "good", accent: "good", title: "Making pemmican", eyebrow: "Four plain steps", items: [ck("Dry lean meat bone-hard, snap-dry"), ck("Pound it to a coarse powder"), ck("Render clean fat (beef suet)"), ck("Mix near equal, press into cakes")], bgp: "grinding bone-dry meat into powder beside rendered fat" },
  { t: 885, id: "c_pemlaw", kind: "splitlist", palette: "B", title: "Why it keeps for ten years", items: ["Water — dried clean away", "Air — sealed inside the fat", "Kept cool and dry", "All three parts of the law, at once"] },
  { t: 920, id: "c_pemyears", kind: "stat", hue: "cold", accent: "good", value: 10, suffix: "+ years", label: "kept cool and dry, a cake of good pemmican outlasts near anything — a whole ration in a brick", eyebrow: "Pemmican" },
  { t: 958, id: "c_pemhistory", kind: "callout", hue: "amber", accent: "good", figure: "It fed armies", eyebrow: "The record of it", caption: "fur traders, polar explorers, families crossing a wild continent — they lived on it for years, with no cold at all", bgp: "vintage sepia photo of explorers with provisions, film grain" },
  { t: 992, id: "c_pemsecret", kind: "mistake", number: "!", eyebrow: "Where the ten years is earned", title: "The secret is the drying", desc: "The meat must be truly, snap-dry before it meets the fat, and the fat clean-rendered so it keeps. Rush the drying and it won't last the ages. Do it thorough, and ten years is no boast.", bgp: "thin strips of lean meat drying hard on a rack" },
  // ── RECAP (1013–1117) ──
  { t: 1022, id: "c_recap", kind: "checklist", hue: "good", accent: "good", title: "The five ways", eyebrow: "Carry them home", items: [ck("Salt — bury it in a crock"), ck("Smoke — cure, then cool smoke"), ck("Fat — seal out the air"), ck("Jar — pressure-can, no shortcuts"), ck("Pemmican — dried & bound, 10+ years")], bgp: "salt pork, a smoked ham, a fat crock, jars and pemmican together" },
  { t: 1075, id: "c_onelaw", kind: "splitlist", palette: "G", title: "It was always one law", items: ["Take away the water", "Take away the warmth", "Take away the air", "Understand the enemy — and starve it"] },
  // ── CELLAR MEANS / STAKES (1117–1224) ──
  { t: 1150, id: "c_onehog", kind: "stat", hue: "amber", accent: "good", value: 1, suffix: " hog", label: "butchered in the fall and put up — hams, bacon, salt pork, a fat crock and a winter's pemmican, nothing wasted", eyebrow: "The old cellar" },
  { t: 1172, id: "c_freezerfail", kind: "mistake", number: "!", eyebrow: "Right up until the power goes", title: "A freezer needs a wire", desc: "Three days without power and a full freezer is a barrel of spoiled meat and a heartbreak. Meat put up the old ways asks for no power at all — not a watt, not ever.", bgp: "a dark powerless kitchen during a winter storm" },
  { t: 1200, id: "c_nopower", kind: "stat", hue: "cold", accent: "good", value: 0, suffix: " watts", label: "no wire, no bill, no machine to fail — meat on your own shelf that no storm can shut off", eyebrow: "What it costs to run" },
  // ── CTA (1224–1290) ──
  { t: 1232, id: "c_almanac", kind: "callout", hue: "amber", accent: "good", figure: "The Plain Almanac", eyebrow: "Waiting below this video", caption: "ninety old methods — the salting, the smoking, the potting, the canning, the safe way written out plain, with what each costs and saves", bgp: "an old vintage almanac book on a wooden table, warm light" },
  // ── CLOSE / TEASE (1290–TOTAL) ──
  { t: 1258, id: "c_next", kind: "nextvideo", kicker: "Next in the series", title: "The pantry staples — no fridge", sub: "Grain, beans, roots in the sand, eggs, butter and milk kept the old plain way — the piece that ties the whole pantry together." },

  // ── SEGUNDA TANDA (densidad: bajar raw%, variedad por tramo) ──
  { t: 88, id: "c_series", kind: "splitlist", palette: "B", title: "The series so far", items: ["Herbs — a jar of salt", "Onions — firm to spring", "Tomatoes — August in a jar", "Now: the meat"] },
  { t: 132, id: "c_centuries", kind: "callout", hue: "amber", accent: "good", figure: "Before the freezer", eyebrow: "Every century", caption: "armies were fed on it, oceans crossed on it, a whole continent settled on it — salt, smoke, fat and time", bgp: "cured meats hanging in an old cellar, lamplight" },
  { t: 189, id: "c_life", kind: "callout", hue: "amber", accent: "good", figure: "It's alive", eyebrow: "The spoiler", caption: "too small to see — it lands, it grows, it turns the meat. Starve it of what it needs and it can't touch your food", bgp: "close macro of a raw cut of meat on a board" },
  { t: 285, id: "c_saltsilver", kind: "stat", hue: "amber", accent: "good", value: 1000, suffix: " years", label: "salt kept the world's meat — worth its weight in silver, cities built and wars fought over it", eyebrow: "The salt trade" },
  { t: 320, id: "c_saltsoak", kind: "chips", hue: "amber", title: "Salt pork, ready to cook", chips: ["soak overnight", "change the water", "then fry or stew"], bgp: "a slab of salt pork soaking in a bowl of fresh water" },
  { t: 358, id: "c_saltbrine", kind: "callout", hue: "amber", accent: "good", figure: "The brine tells you", eyebrow: "It's working", caption: "in a day or two the salt draws the water out into the bottom — the enemy's water, marched out the door", bgp: "brine gathering in the bottom of a crock of salted pork" },
  { t: 390, id: "c_saltuses", kind: "chips", hue: "amber", title: "It flavors the whole pot", chips: ["a pot of beans", "a winter soup", "a mess of greens"], bgp: "salt pork simmering in a pot of beans on a woodstove" },
  { t: 450, id: "c_smokepartner", kind: "callout", hue: "amber", accent: "good", figure: "Salt and smoke", eyebrow: "Partners", caption: "they nearly always work hand in hand — the salt keeps, the smoke dries and shields, and together they carry the meat", bgp: "a salted ham going into a smokehouse" },
  { t: 488, id: "c_smokebuild", kind: "chips", hue: "amber", title: "A smokehouse is simple", chips: ["a tight little shed", "even a barrel", "a cool, low fire"], bgp: "a small rustic smokehouse shed on a farm" },
  { t: 565, id: "c_smokewrap", kind: "chips", hue: "amber", title: "Then it hangs", chips: ["cool dry cellar", "wrapped in cloth", "flies kept off"], bgp: "a cloth-wrapped smoked ham hanging on a cellar hook" },
  { t: 595, id: "c_fatold", kind: "callout", hue: "amber", accent: "good", figure: "Every farm wife knew it", eyebrow: "Potting in fat", caption: "the French called it confit, but folks on every continent did it — cook it, then drown it under fat away from the air", bgp: "cooked meat being packed down into a crock of fat" },
  { t: 653, id: "c_fatuse", kind: "chips", hue: "amber", title: "When you want a meal", chips: ["dig a piece out", "warm it up", "press the fat back down"], bgp: "lifting a piece of potted meat from under its fat cap" },
  { t: 705, id: "c_canready", kind: "splitlist", palette: "G", title: "Jars of ready dinners", items: ["Chunks of beef, pork, chicken", "Broth and all, sealed in glass", "Falls into any soup or hash", "Years of suppers on a shelf"] },
  { t: 740, id: "c_canchart", kind: "chips", hue: "amber", title: "Follow the chart to the letter", chips: ["your pressure", "your time", "your altitude"], bgp: "a canning chart beside a pressure canner and jars" },
  { t: 778, id: "c_canwins", kind: "splitlist", palette: "B", title: "Canned meat, done right", items: ["Pressure canner — never a water bath", "A current, trustworthy chart", "Never guess, never shortcut", "Then years of safe, ready meat"] },
  { t: 862, id: "c_pemration", kind: "callout", hue: "amber", accent: "good", figure: "A whole ration in a brick", eyebrow: "Fat and protein both", caption: "light to carry, nothing to do to it — eat it as is, or drop a chunk in a pot for a rich hot stew", bgp: "a pemmican cake broken to show the dense dried-meat inside" },
  { t: 905, id: "c_pemwho", kind: "chips", hue: "amber", title: "Who lived on it", chips: ["fur traders", "polar explorers", "families crossing the plains"], bgp: "vintage sepia photo of frontier provisions, film grain" },
  { t: 940, id: "c_pemtwo", kind: "splitlist", palette: "G", title: "Two halves, then married", items: ["Lean meat dried snap-hard", "Pounded to a coarse powder", "Clean rendered fat, poured warm", "Pressed into a cake that keeps"] },
  { t: 1008, id: "c_pemcool", kind: "chips", hue: "cold", title: "Keep it right", chips: ["cool", "dry", "out of the light"], bgp: "pemmican cakes stored in a cool dark pantry" },
  { t: 1050, id: "c_fivestat", kind: "stat", hue: "amber", accent: "good", value: 5, suffix: " ways", label: "salt, smoke, fat, the jar, and pemmican — one law worked five ways, from months to ten years and more", eyebrow: "What you carry home" },
  { t: 1095, id: "c_pantrystand", kind: "splitlist", palette: "B", title: "A cellar that can't be shut off", items: ["Hams and bacon in the smoke", "Salt pork down in the crock", "Jars and a fat crock on the shelf", "Pemmican for the coldest days"] },
  { t: 1210, id: "c_security", kind: "callout", hue: "amber", accent: "good", figure: "Not being afraid", eyebrow: "What it's really about", caption: "not of a storm, an outage, an empty week — meat on your own shelf, and no man or machine can take it", bgp: "a calm full winter cellar of preserved food, lamplight" },
];

let nComp = 0;
const placed = new Set();
for (const c of [...COMPONENTS].sort((a, b) => a.t - b.t)) {
  let idx = -1;
  for (let i = 0; i < beats.length; i++) { if (beats[i].start <= c.t + 0.01) { if (!placed.has(beats[i].id)) idx = i; } else break; }
  if (idx < 0) continue;
  const start = beats[idx].start;
  const { t, bgp, kind, ...rest } = c;
  const ab = { id: c.id, start, dur: 6.2, kind };
  delete rest.id;
  Object.assign(ab, rest);
  if (bgp) Object.assign(ab, bg(c.id, bgp));
  let rm = 1;
  while (idx + rm < beats.length && beats[idx + rm].start < start + 6.2 - 0.05 && !placed.has(beats[idx + rm].id)) rm++;
  beats.splice(idx, rm, ab);
  placed.add(c.id);
  const next = beats[idx + 1];
  const nextAv = avStarts.filter((s) => s > start + 0.01).sort((a, b) => a - b)[0] ?? TOTAL;
  ab.dur = +(Math.min(next ? next.start : TOTAL, nextAv, start + 7.5) - start).toFixed(2);
  nComp++;
}

beats.sort((a, b) => a.start - b.start);

// ── GAP-FILLER: break any hold >8s with unused adjacent body-beat images (no dead planes) ──
const usedIds = new Set(beats.map((b) => b.id));
const inFullR = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const poolImg = (name) => { for (const e of ["png", "jpg", "jpeg", "webp"]) if (fs.existsSync(`public/img/${SLUG}/${name}.${e}`)) return `img/${SLUG}/${name}.${e}`; return null; };
for (let pass = 0; pass < 3; pass++) {
  beats.sort((a, b) => a.start - b.start);
  const inserts = [];
  for (let i = 0; i < beats.length; i++) {
    const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
    const gap = nextStart - beats[i].start;
    if (gap <= 8.0) continue;
    // find a merged body beat whose ms lands mid-gap, unused, with an image on disk, not in an AV_FULL window
    const lo = beats[i].start + 3.4, hi = nextStart - 1.5;
    const cand = BEATS_SRC.filter((m) => { const t = m.ms / 1000; return t > lo && t < hi && !usedIds.has(m.name) && !inFullR(t) && (poolImg(m.name) || fs.existsSync(`public/broll/${SLUG}/${m.name}.mp4`)); }).sort((a, b) => Math.abs((a.ms / 1000) - (beats[i].start + gap / 2)) - Math.abs((b.ms / 1000) - (beats[i].start + gap / 2)));
    if (!cand.length) continue;
    const m = cand[0]; const t = +(m.ms / 1000).toFixed(2);
    const src = fs.existsSync(`public/broll/${SLUG}/${m.name}.mp4`) ? `broll/${SLUG}/${m.name}.mp4` : poolImg(m.name);
    inserts.push({ id: m.name, start: t, dur: 4, kind: "raw", src, darken: 0 });
    usedIds.add(m.name);
  }
  if (!inserts.length) break;
  beats.push(...inserts);
}

const avStartsAll = AV_FULL.map(([s]) => s);
beats.sort((a, b) => a.start - b.start);
for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
  const avAfter = avStartsAll.filter((s) => s > b.start + 1e-6).sort((x, y) => x - y)[0] ?? Infinity;
  let end = Math.min(nextStart, TOTAL); if (avAfter < end) end = avAfter;
  const ov = b.kind === "raw" ? OV : 0;
  b.dur = +(Math.max(0.2, Math.min(end + ov, TOTAL) - b.start)).toFixed(2);
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, clipsfirst: true, beats }, null, 2));

const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = []; let k = 0;
for (let i = 0; i < beats.length; i++) { if (beats[i].start >= COLD_END && i % 6 === 3) { pip.push([beats[i].start, beats[i].start + Math.min(beats[i].dur, 7), POS[k % POS.length]]); k++; } }
const firstHero = COLD_OPEN[0].start;
const modeAt = (t) => { if (t < firstHero - 1e-6) return "full"; if (AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6)) return "full"; const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6); return p ? p[2] : "hidden"; };
const pts = [...new Set([0, firstHero, ...AV_FULL.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = []; let cur = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, `// avatar_${SLUG}.gen.ts — GENERADO. NO editar.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_MEATYEARS = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);

console.log(`=== build_${SLUG} ===`);
console.log(`beats: ${beats.length} · clips: ${nClip} · imágenes: ${beats.length - nClip} · componentes: ${nComp}`);
console.log(`dur min/max: ${Math.min(...beats.map((b) => b.dur))}s / ${Math.max(...beats.map((b) => b.dur))}s`);
