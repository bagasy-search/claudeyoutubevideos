// gen_retire7rich.mjs — canal "Retire Abroad" · "7 Countries Where Your Social
// Security Check Makes You Rich". Look finance-avatar (theme_ben) SESGADO CÁLIDO:
// ámbar/oro/verde para los países (aspiracional), ROJO solo en avisos. Motor keyword-snap
// clonado de gen_retire5countries.mjs. Avatar host (retire7rich_opt.mp4 = audio).
// Ancla por frase a captions_retire7rich.json (whisper.cpp word-level). EN.
// Mejora vs v1: RELLENO DE HUECOS por REGIÓN (Asia no recibe fillers de Latinoamérica).
//
// Emite: beatsheet/retire7rich.json · public/img/prompts_retire7rich_ref.json (host-ref)
//        public/img/prompts_retire7rich_props.json (cutouts) · public/broll/match_retire7rich.json
import fs from "fs";

const SLUG = "retire7rich";
const IMGPFX = "ra_";
const CLIPFX = "rac_";
const HOSTREF = "ra_hostref.png";

const IMPERF = "casual phone snapshot, nothing polished, no AI look, low saturation, soft muted colors, natural hands, slightly uneven light, real and imperfect. Negative: studio, CGI, oversharp, glossy, stock-photo, watermark, text.";
const HOSTDESC = "the SAME man from the reference image (American man, early 60s, thick silver-gray tousled hair, clean-shaven, ruddy warm complexion, light linen shirt)";
const PH = (d) => `Realistic handheld 16:9 photo. ${HOSTDESC}, ${d}. ${IMPERF}`;
const PP = (d) => `${d}. A single object centered on a clean, plain, softly-lit neutral dark surface, product-style, realistic, some imperfection, no clutter. Negative: text, watermark, busy background.`;

const HOSTIMG = [];
const PROPS = [];
const CLIPS = [];

const hi = (name, prompt, o = {}) => {
  const nm = IMGPFX + name;
  if (!HOSTIMG.find((x) => x.name === nm)) {
    if (o.noref) HOSTIMG.push({ name: nm, prompt: `Realistic handheld 16:9 photo. ${prompt}. ${IMPERF}` });
    else HOSTIMG.push({ name: nm, ref: [HOSTREF], prompt: PH(prompt) });
  }
  const { noref, ...rest } = o;
  return { t: "raw", name: nm, ...rest };
};
let fpi = 0;
const fp = (name, desc, o = {}) => {
  const nm = IMGPFX + name;
  if (!PROPS.find((x) => x.name === nm)) PROPS.push({ name: nm, prompt: PP(desc) });
  const bg = o.bg || `broll/${CLIPFX}${FP_BG[fpi++ % FP_BG.length]}.mp4`;
  return { t: "floatprop", src: `img/${nm}.png`, ...o, bg };
};
const real = (name, concept, query, o = {}) => {
  const nm = CLIPFX + name;
  if (!CLIPS.find((x) => x.name === nm)) CLIPS.push({ name: nm, concept, query, dur: o.dur || 5 });
  return { t: "raw", name: nm, broll: true, ...o };
};
const clip = (name, o = {}) => ({ t: "raw", name: CLIPFX + name, broll: true, ...o });
const c = (kind, props = {}) => ({ t: kind, ...props });
const kp = (text, o = {}) => c("keyphrase", { text, ...o, accent: o.accent || "amber" });

const FP_BG = ["beach_ocean", "market_produce", "passport_stamp", "cafe_table", "couple_beach", "airplane_window", "money_count", "doctor_clinic"];

const W = { raw: 1.3, keyphrase: 1.4, statpills: 1.3, floatprop: 1.5, rule: 1.0, checklist: 1.7, splitlist: 1.4,
  bars: 1.5, callout: 1.3, mistake: 1.5, action: 1.5, signature: 1.7, vsmed: 1.6, nextvideo: 1.4, quote: 1.1, chips: 1.1, stat: 1.2,
  globe3d: 2.6, city3d: 1.9, number3d: 1.3, oner3d: 4.0 };

// ── componentes 3D (three.js) — hero moments ──
const GOLD = "#FFC400";
const n3d = (num, country) => c("number3d", { num, country, accent: GOLD });   // cuenta regresiva extruída
const globe3d = (o = {}) => c("globe3d", o);                                     // globo de los 7 países
const city3d = (o = {}) => c("city3d", o);                                       // ciudad nocturna "makes you rich"
const oner3d = (o = {}) => c("oner3d", o);                                        // 🎬 el ONER: espacio→globo→ciudad

// región de cada sección (para el relleno de huecos on-topic)
const SEC_REGION = { hook:"any", ohio:"any", ray:"any", promise:"any", roadmap:"any",
  mexico:"mx", colombia:"co", ecuador:"ec", transition:"any", thailand:"th", philippines:"ph",
  vietnam:"vn", panama:"pa", recap:"any", warnings:"any", taxes:"any", house:"any", rules:"any", close:"any", cta:"any", outro:"any" };

// ════════════════════════ SECCIONES (ancla = frase verbatim del transcript) ═══════════════
const SEVEN = ["Mexico", "Colombia", "Ecuador", "Thailand", "Philippines", "Vietnam", "Panama"];
const SECTIONS = [
  // ░░ HOOK ░░ (0–64s) muy dinámico
  { key: "hook", phrase: null, start: 1.4, beats: [
    c("talk", {}),
    hi("beach_porch", "sitting relaxed on a tropical beach porch in the morning, a coffee mug in hand, looking out at the ocean, content half-smile", { hold: true, w: 0.9 }),
    kp("*$1,900* a month. That's the whole budget.", { src: "img/ra_beach_porch.png", at: "that s the whole budget", w: 0.6 }),
    real("beach_ocean", "calm tropical ocean and palm beach, slow", "tropical beach ocean palm slow calm", { w: 0.45 }),
    kp("A small number... in the *wrong zip code*", { src: "broll/rac_beach_ocean.mp4", at: "in the wrong zip code", accent: "amber", w: 0.6 }),
    kp("That same check makes me feel *rich*", { src: "img/ra_beach_porch.png", at: "it makes me feel rich", w: 0.6 }),
    c("statpills", { pills: ["Cleaning lady 2×/wk", "Eat out anytime", "Never check the price"], accent: "amber", slider: false }),
    real("cafe_table", "coffee cup on a table by the sea, relaxed", "coffee cup table sea relaxed", { w: 0.4 }),
    kp("*7 countries* where your check makes you rich", { src: "broll/rac_beach_town.mp4", at: "seven of them", accent: "good", w: 0.65 }),
    real("beach_town", "a quiet seaside town street in latin america, warm morning", "seaside town street latin america morning", { w: 0.4 }),
  ]},
  // ░░ STORY — Ohio kitchen table ░░
  { key: "ohio", phrase: "two years ago", beats: [
    hi("ohio_night", "a few years younger and tired, sitting alone at a worn kitchen table at night in an Ohio home, a laptop and a spreadsheet glowing, worried, dim warm lamp light", { kicker: "Ohio, two years ago", hold: true }),
    kp("Worked *40 years*. Paid the house down.", { src: "img/ra_ohio_night.png", at: "forty years of work", w: 0.7 }),
    kp("By the end there's *nothing left*", { src: "img/ra_ohio_night.png", at: "there s nothing", w: 0.7 }),
    hi("empty_chair", "an empty wooden kitchen chair across the table, soft melancholic light, absence", { kicker: "Her chair, still there", w: 0.8 }),
  ]},
  // ░░ RAY ░░
  { key: "ray", phrase: "my buddy ray", beats: [
    hi("phone_call", "at the kitchen table at night holding an old phone to his ear, a small surprised smile starting", { kicker: "11 o'clock, a phone call", hold: true }),
    real("phone_night", "an older man on a phone at night at home, warm lamp", "older man phone night home lamp", { w: 0.5 }),
    kp("*You're doing the math in the wrong country*", { src: "img/ra_phone_call.png", at: "you re doing the math in the wrong country", w: 0.9 }),
    fp("plane_ticket", "a single paper airline boarding pass, round trip", { caption: "So I bought *one ticket*", accent: "amber", scale: 0.8 }),
  ]},
  // ░░ PROMISE / red carpet ░░
  { key: "promise", phrase: "rolling out the red carpet", beats: [
    real("redcarpet", "a red carpet rolled out, welcome, symbolic", "red carpet welcome rolled out", { w: 0.5 }),
    kp("They are *begging* Americans to come", { src: "broll/rac_redcarpet.mp4", at: "practically begging", w: 0.65 }),
    real("law_book", "an official law book and stamp, government", "law book government stamp official", { w: 0.45 }),
    kp("Passing laws to *cut your bills in half*", { src: "broll/rac_law_book.mp4", at: "cut your bills in half", w: 0.6 }),
    c("statpills", { pills: ["Avg check ~$1,900/mo", "Just the check"], accent: "good", slider: true }),
  ]},
  // ░░ ROADMAP ░░
  { key: "roadmap", phrase: "seven countries", beats: [
    oner3d({ w: 1.0 }),                                    // 🎬 ONER (dueño de toda la sección): espacio → globo 7 países → dive → ciudad
  ]},
  // ░░ #7 MEXICO ░░
  { key: "mexico", phrase: "number seven", beats: [
    n3d("07", "Mexico"),
    real("mx_merida", "merida mexico colonial city, yellow and colorful facades, yucatan, sunny", "merida mexico colonial yellow street yucatan", { w: 0.55, hold: true }),
    kp("The one your nervous spouse will *say yes* to", { src: "broll/rac_mx_merida.mp4", at: "your nervous spouse will actually say yes", w: 0.6 }),
    real("mx_lake", "ajijic lake chapala mexico, mountains, calm lake town", "lake chapala ajijic mexico mountains town", { w: 0.5 }),
    c("callout", { image: "mx_courtyard", figure: "~$600", caption: "A two-bedroom with a courtyard in Mérida", accent: "good", _genImg: "mx_courtyard", _prompt: PH("standing in a bright colonial Mexican courtyard home with plants and tiled floor, warm sun") }),
    c("statpills", { pills: ["Biggest US retiree town on earth", "Lake Chapala"], accent: "amber", slider: false }),
    kp("Mexico *quietly raised* the income bar", { src: "broll/rac_mx_market.mp4", at: "mexico quietly raised the income", accent: "amber", w: 0.6 }),
    real("mx_market", "a colorful mexican market with food stalls and produce", "mexican market food stalls produce colorful", { w: 0.45 }),
    kp("The softest possible *first step*", { src: "broll/rac_mx_merida.mp4", at: "the softest possible first step", w: 0.55 }),
  ]},
  // ░░ #6 COLOMBIA ░░
  { key: "colombia", phrase: "number six", beats: [
    n3d("06", "Colombia"),
    real("co_medellin", "medellin colombia city skyline in a green valley, aerial", "medellin colombia skyline green valley aerial", { w: 0.55, hold: true }),
    kp("The picture in your head is *30 years* out of date", { src: "broll/rac_co_medellin.mp4", at: "frozen in time thirty years ago", accent: "amber", w: 0.6 }),
    real("co_flowers", "colorful flowers and a plaza in medellin, spring, people", "medellin flowers plaza spring people", { w: 0.45 }),
    kp("The *City of Eternal Spring* — 72°, every day", { src: "broll/rac_co_flowers.mp4", at: "city of eternal spring", w: 0.6 }),
    c("statpills", { pills: ["Pensioner visa", "~$900–$1,000/mo"], accent: "amber", slider: false }),
    c("callout", { image: "co_apartment_c", figure: "$1,200", caption: "Linda's all-in — doorman, gym, valley view, maid 2×/wk", accent: "good" }),
    kp("She lived like a woman *with money*", { src: "broll/rac_co_apartment.mp4", at: "she lived like a woman with money", accent: "good", w: 0.6 }),
    kp("Learn some *Spanish* — you'll really need it", { src: "broll/rac_co_street.mp4", at: "you ve got to learn some spanish", accent: "amber", w: 0.55 }),
  ]},
  // ░░ #5 ECUADOR ░░
  { key: "ecuador", phrase: "number five", beats: [
    n3d("05", "Ecuador"),
    real("ec_cuenca", "cuenca ecuador colonial city with blue domed cathedral, andes", "cuenca ecuador cathedral colonial andes", { w: 0.55, hold: true }),
    fp("us_dollar", "a US one dollar bill, cash", { caption: "Ecuador uses the *US dollar*", accent: "good", scale: 0.7 }),
    kp("No exchange rate. *What you see is what you get.*", { src: "broll/rac_ec_cuenca.mp4", at: "there s no exchange rate", w: 0.65 }),
    c("statpills", { pills: ["Pensioner visa", "~$1,300–1,400/mo"], accent: "amber", slider: false }),
    kp("This is where Ecuador starts *begging*", { src: "broll/rac_ec_market.mp4", at: "ecuador start flat out begging", w: 0.6 }),
    c("checklist", { title: "Senior discounts — by law (65+)", accent: "good", items: ["50% off airline tickets", "50% off public transport", "50% off cultural & sporting events", "Part of your sales tax refunded"] }),
    real("ec_market", "a colorful andean produce market with cheap fresh fruit", "ecuador andean produce market fresh fruit", { w: 0.45 }),
    c("statpills", { pills: ["Single lives well ~$1,200–1,300", "Rent $300–$500"], accent: "amber", slider: true }),
  ]},
  // ░░ TRANSITION — a Asia ░░
  { key: "transition", phrase: "the other side of the world", beats: [
    real("world_map", "a vintage world map or a globe, travel, warm tone", "vintage world map globe travel", { w: 0.5 }),
    kp("Now it gets *uncomfortable to say out loud*", { src: "broll/rac_airplane_window.mp4", at: "uncomfortable to say out loud", accent: "amber", w: 0.6 }),
    real("airplane_window", "a view out an airplane window over clouds, long flight", "airplane window clouds long flight", { w: 0.45 }),
  ]},
  // ░░ #4 THAILAND ░░
  { key: "thailand", phrase: "number four", beats: [
    n3d("04", "Thailand"),
    real("th_chiangmai", "chiang mai thailand golden temple and old city, mountains behind", "chiang mai thailand temple golden old city", { w: 0.55, hold: true }),
    kp("Your dollar does things it *can't do* back home", { src: "broll/rac_th_chiangmai.mp4", at: "your dollar does things", w: 0.6 }),
    c("statpills", { pills: ["Long-stay 'O-A' visa (50+)", "~$1,900/mo income OR bank deposit"], accent: "amber", slider: false }),
    hi("asia_street", "walking through a warm lantern-lit asian night market street in the evening, curious delighted smile, food stalls glowing", { kicker: "Chiang Mai, evening", w: 0.85 }),
    c("bars", { title: "What your money buys", accent: "good", unit: "$", items: [{ label: "1-hr Thai massage", value: 8 }, { label: "Street-food meal", value: 1.5 }, { label: "Apartment w/ pool /mo", value: 350 }] }),
    real("th_streetfood", "thai street food being cooked at a busy night market, wok flames", "thai street food night market cooking wok", { w: 0.45 }),
    kp("Eat *every meal out* — still under $1,000/mo", { src: "broll/rac_th_streetfood.mp4", at: "eat every single meal out", accent: "good", w: 0.6 }),
    kp("The catch: that visa is a *yearly dance*", { src: "broll/rac_th_market.mp4", at: "that visa is a yearly dance", accent: "amber", w: 0.55 }),
    real("th_market", "a bright thai fresh market with tropical fruit stalls", "thailand fresh market tropical fruit stalls", { w: 0.4 }),
  ]},
  // ░░ #3 PHILIPPINES ░░
  { key: "philippines", phrase: "number three", beats: [
    n3d("03", "Philippines"),
    real("ph_beach", "a stunning philippines tropical beach, turquoise water, palm trees", "philippines tropical beach turquoise palm", { w: 0.55, hold: true }),
    kp("They speak *English* — everywhere", { src: "broll/rac_ph_beach.mp4", at: "they speak english", accent: "good", w: 0.7 }),
    kp("The *softest landing* on the planet", { src: "broll/rac_ph_town.mp4", at: "the softest landing on this entire planet", w: 0.6 }),
    c("statpills", { pills: ["SRRV retirement visa", "Deposit from ~$10k (50+)"], accent: "amber", slider: false }),
    kp("The deposit is *yours* — you just park it", { src: "broll/rac_ph_market.mp4", at: "you re not spending it you re parking it", accent: "good", w: 0.6 }),
    real("ph_town", "a philippines town street with tricycles and friendly people, day", "philippines town street tricycle people day", { w: 0.45 }),
    real("ph_market", "a philippines fish market with fresh fish on ice by the sea", "philippines fish market fresh fish sea", { w: 0.4 }),
    c("checklist", { title: "Honest catch", accent: "amber", items: ["Island infrastructure — internet has moods", "Power blinks in a storm", "Serious care? Fly to Manila or Thailand"] }),
  ]},
  // ░░ #2 VIETNAM ░░
  { key: "vietnam", phrase: "number two", beats: [
    n3d("02", "Vietnam"),
    city3d({ w: 0.8, tOffset: 7 }),                                   // 🌆 Da Nang, "a modern city on the coast"
    real("vn_danang", "da nang vietnam modern beach city with a river and bridge, aerial", "da nang vietnam beach city river bridge aerial", { w: 0.55, hold: true }),
    kp("Maybe the *best value on earth* right now", { src: "broll/rac_vn_danang.mp4", at: "the single best value on the face of the earth", accent: "good", w: 0.7 }),
    c("bars", { title: "Da Nang prices", accent: "good", unit: "$", items: [{ label: "Apartment near water /mo", value: 350 }, { label: "Bowl of pho", value: 1.5 }, { label: "Dinner for two", value: 11 }] }),
    hi("pho_table", "sitting at a low plastic-stool street table with a steaming bowl of vietnamese noodle soup, delighted, casual", { kicker: "A $1.50 bowl of pho", w: 0.85 }),
    real("vn_coffee", "a glass of vietnamese iced coffee on a small cafe table", "vietnamese iced coffee cafe table", { w: 0.4 }),
    kp("On a check, you are the *wealthy guy*. Full stop.", { src: "broll/rac_vn_street.mp4", at: "you are the wealthy guy", accent: "good", w: 0.65 }),
    c("mistake", { number: "!", eyebrow: "BIGGEST CATCH ON THE LIST", title: "No simple retirement visa", desc: "You stay on renewable longer-term visas and the rules have shifted. Best math, least tidy paperwork — do NOT burn any boats. A full Vietnam video is coming.", accent: "amber" }),
    real("vn_street", "a busy vietnam street with motorbikes and lanterns, evening", "vietnam street motorbikes lanterns evening", { w: 0.4 }),
  ]},
  // ░░ #1 PANAMA ░░
  { key: "panama", phrase: "number one", beats: [
    n3d("01", "Panama"),
    city3d({ w: 0.9, tOffset: 7 }),                                   // 🌆 skyline "like Miami" (en el guion)
    real("pa_skyline", "panama city skyline at golden hour, modern towers, ocean", "panama city skyline towers ocean golden hour", { w: 0.55, hold: true }),
    kp("The *most generous* retirement program I've ever seen", { src: "broll/rac_pa_skyline.mp4", at: "the most generous retirement program", w: 0.7 }),
    c("statpills", { pills: ["Pensionado visa", "$1,000/mo", "US dollar"], accent: "amber", slider: false }),
    fp("us_dollar", "a US one dollar bill, cash", { caption: "US dollar — *no exchange rate, ever*", accent: "good", scale: 0.7 }),
    c("checklist", { title: "Pensioner discounts — by law", accent: "good", items: ["25% off airline tickets & restaurants", "20% off doctor visits & medicine", "25% off electric & phone bills", "50% off movies & shows", "Half off hotels Mon–Thu"] }),
    kp("They wrote *we want you* right into the law", { src: "broll/rac_pa_skyline.mp4", at: "they wrote it into the code", accent: "good", w: 0.65 }),
    real("pa_boquete", "boquete panama green mountains, coffee farms, river", "boquete panama mountains coffee farm river", { w: 0.5 }),
    hi("marisol", "chatting and laughing with an older latina woman in an apron at a colorful fruit stand in a small tropical town, morning light", { kicker: "Marisol, at the fruit stand", w: 0.8 }),
    kp("A little house, *one street back* from the water", { src: "img/ra_little_house.png", at: "one street back from the water", w: 0.7 }),
    hi("little_house", "a modest pastel one-story beach house one street back from the water in a latin american town, plants, no people", { noref: true }),
    c("callout", { image: "pa_hospital", figure: "$400/mo", caption: "The widow's little house — I've been there ever since", accent: "good" }),
  ]},
  // ░░ RECAP ░░
  { key: "recap", phrase: "seven countries in 2026", beats: [
    c("splitlist", { title: "The door is open", items: SEVEN, palette: "A" }),
    kp("The same check that *scared you* makes you rich", { src: "broll/rac_beach_ocean.mp4", at: "makes you feel", accent: "good", w: 0.6 }),
  ]},
  // ░░ WARNINGS — MEDICARE (rojo) ░░
  { key: "warnings", phrase: "medicare does not", beats: [
    hi("host_serious", "leaning in, serious and caring, a raised hand, warm concern", { kicker: "Now the honest part", hold: true }),
    c("vsmed", { eyebrow: "The #1 mistake", leftTitle: "MEDICARE in the US", leftItems: [{ text: "Covers you", ok: true }], rightTitle: "MEDICARE abroad", rightItems: [{ text: "Does NOT come with you", ok: false }, { text: "Does not work overseas", ok: false }] }),
    kp("Medicare *does not* work outside the US", { src: "broll/rac_doctor_clinic.mp4", at: "it does not work outside the united states", accent: "danger", w: 0.7 }),
    c("checklist", { title: "So instead", accent: "good", items: ["Get onto the local system", "Or buy international health insurance", "Keep Medicare for big stuff back home", "Have a plan — don't wing it"] }),
  ]},
  // ░░ WARNINGS — TAXES (rojo) ░░
  { key: "taxes", phrase: "second taxes", beats: [
    real("tax_form", "US tax forms and a calculator on a desk, close up", "us tax form calculator desk", { w: 0.5, hold: true }),
    kp("The US taxes your *worldwide income* — you always file", { src: "broll/rac_tax_form.mp4", at: "you still file a u s return", accent: "danger", w: 0.7 }),
    fp("fbar_form", "a treasury bank-account report form, official paper", { caption: "Over $10k in a bank? *File the FBAR*", accent: "danger", scale: 0.8 }),
    kp("Call an accountant who *knows expat taxes*", { src: "broll/rac_money_count.mp4", at: "an accountant who knows expat taxes", accent: "amber", w: 0.6 }),
  ]},
  // ░░ WARNINGS — THE HOUSE + payoff del loop (rojo) ░░
  { key: "house", phrase: "the mistake i almost made", beats: [
    hi("phone_doubt", "sitting on the edge of a rented bed at night, hand resting on a phone, homesick and doubting, tired, dim warm light", { kicker: "Four months in, my hand on the phone", hold: true }),
    kp("*You still got your exit door open?*", { src: "img/ra_phone_doubt.png", at: "you still got your exit door open", accent: "amber", w: 0.85 }),
    c("mistake", { number: "3", eyebrow: "THE BIG ONE", title: "Don't sell everything on trip one", desc: "Rent for a year before you buy. Keep your exit door open. Keep a cushion back home.", accent: "danger" }),
    kp("Paradise for two weeks is *different* on a Tuesday", { src: "broll/rac_beach_town.mp4", at: "a different animal when it s a wet tuesday", accent: "amber", w: 0.6 }),
    hi("welder_condo", "a worried heavier older american man in a work shirt looking up at a half-finished abandoned concrete condo building, construction site", { kicker: "A man I knew", w: 0.8, noref: true }),
    kp("His money was just... *gone*. An ocean away.", { src: "img/ra_welder_condo.png", at: "his money was just gone", accent: "danger", w: 0.7 }),
    c("action", { eyebrow: "The rule", step: "Rent before you buy — for a year", question: "If you wanted to come home in six months, could you?" }),
  ]},
  // ░░ RULES CHANGE ░░
  { key: "rules", phrase: "countries change them", beats: [
    kp("Rules *change* — confirm with the consulate", { src: "broll/rac_passport_stamp.mp4", at: "confirm the current rules", accent: "amber", w: 0.6 }),
    real("passport_stamp", "a passport being stamped at an immigration desk, close up", "passport stamp immigration desk", { w: 0.45 }),
  ]},
  // ░░ CLOSE ░░
  { key: "close", phrase: "the most expensive country in the world", beats: [
    hi("beach_walk", "walking a quiet beach at golden hour, sandals in hand, profile, relaxed and free", { kicker: "For the first time in years", hold: true }),
    kp("It was never that I didn't have *enough money*", { src: "img/ra_beach_walk.png", at: "i didn t have enough money", w: 0.7 }),
    kp("I moved the same check... the fear just *left*", { src: "broll/rac_beach_ocean.mp4", at: "the fear just left", accent: "good", w: 0.7 }),
    c("statpills", { pills: ["No alarm", "Real food", "Money left over"], accent: "good", slider: false }),
  ]},
  // ░░ CTA ░░
  { key: "cta", phrase: "walks through all seven", beats: [
    c("action", { eyebrow: "Free — in the description", step: "Grab the free step-by-step guide", question: "All 7 countries: exact income numbers, visa paperwork, real budgets, scouting-trip checklist." }),
    kp("It's *completely free* — link in the description", { src: "broll/rac_cafe_table.mp4", at: "it s completely free", accent: "good", w: 0.6 }),
  ]},
  // ░░ SUBSCRIBE / OUTRO ░░
  { key: "outro", phrase: "do me a favor and subscribe", beats: [
    c("nextvideo", { kicker: "Coming up", title: "Inside each country", sub: "The actual neighborhoods, the actual apartments, the actual grocery bills." }),
    c("signature", { eyebrow: "Ray was right", lines: [{ text: "I was doing the math" }, { text: "in the wrong country." }, { text: "Come do the math down here.", gold: true }] }),
    hi("outro_smile", "on the beach porch giving a warm goodbye, kind smile, golden hour", { hold: true, kicker: "The water's warm" }),
  ]},
];

// ════════════════════════ ANCLAJE POR FRASE ═══════════════════════
const CAP_PATH = `public/captions_${SLUG}.json`;
const CAPS = JSON.parse(fs.readFileSync(CAP_PATH, "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 7);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const findWords = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after - 0.5) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return p.map((_, j) => CW[i + j].s);
  }
  return null;
};
const pinPhrase = (b) => b.at || (b.t === "keyphrase" && b.text ? b.text.replace(/\*/g, "") : null);
const VIDEO_END = (CW[CW.length - 1]?.s || 1500) + 1.5;
const HUES = ["amber", "amber", "good"];

let cursorSec = 0;
for (const s of SECTIONS) {
  if (s.start != null) { cursorSec = s.start; continue; }
  const ms = findMs(s.phrase, cursorSec + 1);
  if (ms == null) console.warn(`⚠ frase no encontrada: "${s.phrase}" (sección ${s.key})`);
  s.start = ms != null ? ms : cursorSec + 5;
  cursorSec = s.start;
}
SECTIONS.sort((a, b) => a.start - b.start);

const beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const start = sec.start;
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 1.7; if (b.w) w *= b.w; return w; });
  const pin = sec.beats.map((b, i) => {
    if (i === 0) return start;
    const ph = pinPhrase(b); if (!ph) return null;
    const ms = findMs(ph, start + 0.5);
    return ms != null && ms > start + 1 && ms < end - 1.5 ? Math.max(start + 0.5, ms - 0.3) : null;
  });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.2) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i);
  fixed.push(n);
  const startT = new Array(n);
  for (let f = 0; f < fixed.length - 1; f++) {
    const a = fixed[f], b = fixed[f + 1];
    const ta = pin[a], tb = b === n ? end : pin[b];
    let sw = 0; for (let i = a; i < b; i++) sw += ws[i];
    let acc = ta;
    for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); }
  }
  const CAP = { keyphrase: 4.6, statpills: 5.0, checklist: 8.5, rule: 3.2, callout: 5.0,
    mistake: 6.5, splitlist: 6.0, bars: 6.5, vsmed: 7.5, action: 6.5, signature: 6.5, nextvideo: 6.0,
    floatprop: 5.0, quote: 4.5, chips: 4.5, stat: 5.0, globe3d: 15.0, city3d: 8.5, number3d: 5.0, oner3d: 20.0 };
  sec.beats.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2);
    const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2);
    const gap = +(nextR - cursor).toFixed(2);
    let cap;
    if (b.t === "raw") cap = b.broll ? (b.hold ? 7.5 : 5.0) : (b.hold ? 5.5 : 4.5);
    else cap = CAP[b.t] ?? 5.0;
    const dur = +Math.min(gap, cap).toFixed(2);
    const id = `${sec.key}_${i}`;
    const hue = b.hue || HUES[(si + i) % HUES.length];
    const beat = { id, start: cursor, dur };
    if (b.t === "raw") {
      beat.kind = "raw"; beat.src = b.broll ? `broll/${b.name}.mp4` : `img/${b.name}.png`;
      beat.hue = hue; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true;
    } else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur;
      delete beat._genImg; delete beat._prompt; delete beat.broll; delete beat.w;
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (!beat.hue) beat.hue = hue;
    }
    if (beat.kind === "keyphrase" && beat.text) {
      const wds = findWords(beat.text.replace(/\*/g, ""), beat.start - 0.6);
      if (wds) beat.times = wds.map((s) => Math.max(0, Math.round((s - beat.start) * 30)));
    }
    beat._region = SEC_REGION[sec.key] || "any";
    beats.push(beat);
  });
}

// ── RELLENO DE HUECOS POR REGIÓN: b-roll on-topic en los gaps largos ──
// pool = {region, name, concept, query}. "any" = genérico emocional/viaje (sirve en todos lados).
const POOL = [
  // genéricos / emocionales (any)
  ["any","older_couple_walk","an older couple walking together on a beach at sunset","older couple walking beach sunset"],
  ["any","airport","travelers walking with luggage in an airport terminal","airport terminal travelers luggage walking"],
  ["any","suitcase","hands packing a suitcase for a trip","packing suitcase trip hands"],
  ["any","passport_book","a US passport and boarding pass on a table","us passport boarding pass table"],
  ["any","coffee_pour","pouring coffee into a cup, cozy morning","pouring coffee cup morning cozy"],
  ["any","video_call","an older person on a video call with family, smiling","older person video call family smiling"],
  ["any","beach_sunset","a golden sunset over a tropical ocean","tropical ocean golden sunset"],
  ["any","market_fish","fresh fish on ice at a seaside market","fresh fish ice seaside market"],
  ["any","hands_coffee_talk","two people talking over coffee at an outdoor cafe","two people coffee outdoor cafe talking"],
  ["any","calendar_plan","hands writing on a calendar and notebook, planning","hands calendar notebook planning writing"],
  ["any","bank_desk","a person signing papers at a bank desk","person signing papers bank desk"],
  ["any","sunrise_sea","sunrise over a calm sea horizon","sunrise calm sea horizon"],
  ["any","street_food","a street food vendor cooking in a busy market","street food vendor market cooking"],
  ["any","hammock","a hammock swinging on a tropical porch","hammock tropical porch swinging"],
  ["any","old_couple_cook","an older couple cooking together in a kitchen","older couple cooking kitchen together"],
  // Mexico
  ["mx","mx_beachtown","a mexican pacific beach town, palms, colorful","mexico beach town palms colorful pacific"],
  ["mx","mx_plaza","a warm colonial plaza in mexico with people, evening","mexico colonial plaza people evening"],
  ["mx","mx_tacos","mexican street tacos being made at a stall","mexican street tacos stall making"],
  // Colombia
  ["co","co_cablecar","medellin cable car over the green city","medellin cable car city green"],
  ["co","co_food","a plate of fresh latin american food at a restaurant","latin american food plate restaurant fresh"],
  ["co","co_street","a lively street in medellin colombia with people","medellin colombia street people day"],
  // Ecuador
  ["ec","ec_plaza","a colonial plaza and church in ecuador with people","ecuador colonial plaza church people"],
  ["ec","ec_andes","green andes mountains and valley in ecuador","ecuador andes mountains valley green"],
  ["ec","ec_llama","a llama in the andes highlands ecuador","llama andes highlands ecuador"],
  // Thailand
  ["th","th_temple","an ornate golden buddhist temple in thailand","thailand golden buddhist temple ornate"],
  ["th","th_longtail","a longtail boat on turquoise thai water with limestone cliffs","thailand longtail boat turquoise cliffs"],
  ["th","th_pool","a modern apartment with a tropical pool in thailand","thailand modern apartment tropical pool"],
  ["th","th_monk","buddhist monks walking in orange robes, thailand morning","thailand monks orange robes morning"],
  // Philippines
  ["ph","ph_palm","a palm-lined tropical beach in the philippines, turquoise","philippines palm beach turquoise tropical"],
  ["ph","ph_boat","a philippine bangka outrigger boat on the sea","philippines bangka outrigger boat sea"],
  ["ph","ph_rice","green rice terraces in the philippines highlands","philippines rice terraces green highlands"],
  // Vietnam
  ["vn","vn_bay","ha long bay vietnam with limestone islands and boats","ha long bay vietnam limestone islands boats"],
  ["vn","vn_market","a vietnamese market with conical hats and fresh produce","vietnam market conical hats produce"],
  ["vn","vn_lantern","hoi an vietnam colorful lanterns at night","hoi an vietnam lanterns night colorful"],
  // Panama
  ["pa","pa_canal","a large ship passing through the panama canal","panama canal ship passing"],
  ["pa","pa_beach","a calm caribbean beach in panama","panama caribbean beach calm"],
  ["pa","pa_oldtown","casco viejo old town panama city colorful buildings","casco viejo panama city old town colorful"],
];
const poolByRegion = {};
for (const [r, nm, concept, query] of POOL) (poolByRegion[r] ||= []).push({ nm, concept, query });
// Contadores SEPARADOS: regional (por región) + un ÚNICO global para "any" (así los clips
// genéricos rotan por TODO el video y no se reinician en cada país → sin older_couple×10).
const regIdx = {};
let anyIdx = 0;
const pickAny = () => poolByRegion.any[anyIdx++ % poolByRegion.any.length];
const pickFiller = (region) => {
  const rp = poolByRegion[region];
  if (!rp || !rp.length) return pickAny();            // sección genérica → global any
  const step = (regIdx[region] = (regIdx[region] || 0)); regIdx[region] = step + 1;
  // intercalá: par → clip regional (on-topic), impar → genérico global (variedad sin repetir)
  return step % 2 === 0 ? rp[(step >> 1) % rp.length] : pickAny();
};

beats.sort((a, b) => a.start - b.start);
const filled = [];
for (let i = 0; i < beats.length; i++) {
  const cur = beats[i];
  const region = cur._region || "any";
  delete cur._region;
  filled.push(cur);
  const curEnd = cur.start + cur.dur;
  const nextStart = i + 1 < beats.length ? beats[i + 1].start : VIDEO_END;
  let cursor = curEnd + 0.25;
  let gap = nextStart - cursor;
  while (gap > 6.5) {
    const e = pickFiller(region);
    const cn = CLIPFX + e.nm;
    if (!CLIPS.find((x) => x.name === cn)) CLIPS.push({ name: cn, concept: e.concept, query: e.query, dur: 6 });
    const d = Math.min(5.0, nextStart - cursor - 3.0);
    if (d < 3) break;
    filled.push({ id: `fill_${i}_${cn}`, start: +cursor.toFixed(2), dur: +d.toFixed(2), kind: "raw", src: `broll/${cn}.mp4`, hue: "amber" });
    cursor += d + 2.6;
    gap = nextStart - cursor;
  }
}
beats.length = 0; beats.push(...filled);

// ── COLA: avatar/clip hasta el fin REAL del audio para no cortar la última frase ──
{
  const lastEnd = Math.max(...beats.map((b) => b.start + b.dur));
  const tailEnd = Math.max(lastEnd, VIDEO_END);
  const tn = CLIPFX + "beach_sunset";
  if (!CLIPS.find((x) => x.name === tn)) CLIPS.push({ name: tn, concept: "a golden sunset over a tropical ocean", query: "tropical ocean golden sunset", dur: 6 });
  if (tailEnd > lastEnd + 0.1) beats.push({ id: "tail", start: +lastEnd.toFixed(2), dur: +(tailEnd - lastEnd).toFixed(2), kind: "raw", src: `broll/${tn}.mp4`, hue: "amber", hold: true });
}

// callout image field → img/<name>.png + host-ref prompt si trae _prompt
const extraHost = [];
SECTIONS.forEach((s) => s.beats.forEach((b) => { if (b._genImg && b._prompt) extraHost.push({ name: IMGPFX + b._genImg, ref: [HOSTREF], prompt: b._prompt }); }));
const fixImg = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(fixImg); return; } if (typeof o.image === "string" && !o.image.includes("/") && !o.image.includes(".")) o.image = `img/${IMGPFX}${o.image.replace(/^ra_/, "")}.png`; for (const k of Object.keys(o)) fixImg(o[k]); };
beats.forEach(fixImg);

fs.mkdirSync("beatsheet", { recursive: true });
fs.mkdirSync("public/img", { recursive: true });
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, beats }, null, 1));
fs.writeFileSync(`public/img/prompts_${SLUG}_ref.json`, JSON.stringify([...HOSTIMG, ...extraHost], null, 2));
fs.writeFileSync(`public/img/prompts_${SLUG}_props.json`, JSON.stringify(PROPS, null, 2));
fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(CLIPS, null, 1));

const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const long = beats.filter((b) => b.dur > 12).length;
console.log(`beats: ${beats.length} · dur: ${dur.toFixed(0)}s (${(dur / 60).toFixed(1)}min) · host-img: ${HOSTIMG.length + extraHost.length} · props: ${PROPS.length} · clips: ${CLIPS.length} · >12s: ${long}`);
console.log("kinds:", JSON.stringify(kinds));
console.log("distinct component kinds:", Object.keys(kinds).filter((k) => k !== "raw" && k !== "talk").length);
