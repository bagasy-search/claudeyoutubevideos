// gen_retire5countries.mjs — canal "Retire Abroad" · "5 Countries Practically Begging
// Americans to Retire in 2026 (On Just Social Security)". Look finance-avatar (theme_ben)
// SESGADO CÁLIDO: ámbar/oro/verde para los 5 países (aspiracional), ROJO solo en avisos.
// Avatar host (retire5countries_opt.mp4 = audio). KeyPhrase + componentes reales + clips
// reales de destino + imágenes host-ref (gpt-image-2 LOW). EN. Ancla por frase a
// captions_retire5countries.json (whisperX, forced alignment → sync milimétrico).
//
// Emite: beatsheet/retire5countries.json · public/img/prompts_retire5countries_ref.json
//        (host-ref, gen_images_ref.mjs) · public/img/prompts_retire5countries_props.json
//        (cutouts transparentes) · public/broll/match_retire5countries.json (clips stock).
import fs from "fs";

const SLUG = "retire5countries";
const IMGPFX = "ra_";
const CLIPFX = "rac_";
const HOSTREF = "ra_hostref.png"; // copia de _ref_host/host_90.jpg en public/img/

// ── estética foto casual imperfecta (regla anti "cara de IA") ──
const IMPERF = "casual phone snapshot, nothing polished, no AI look, low saturation, soft muted colors, natural hands, slightly uneven light, real and imperfect. Negative: studio, CGI, oversharp, glossy, stock-photo, watermark, text.";
// HOST = mismo hombre de la referencia
const HOSTDESC = "the SAME man from the reference image (American man, early 60s, thick silver-gray tousled hair, clean-shaven, ruddy warm complexion, light linen shirt)";
const PH = (d) => `Realistic handheld 16:9 photo. ${HOSTDESC}, ${d}. ${IMPERF}`;
const PP = (d) => `${d}. A single object centered on a clean, plain, softly-lit neutral dark surface, product-style, realistic, some imperfection, no clutter. Negative: text, watermark, busy background.`;

// ── registros de assets ──
const HOSTIMG = []; // {name, ref, prompt}
const PROPS = [];   // {name, prompt, transparent}
const CLIPS = [];   // {name, concept, query, dur}

// host image → beat raw (sin gen: la genera gen_images_ref.mjs)
const hi = (name, prompt, o = {}) => {
  const nm = IMGPFX + name;
  if (!HOSTIMG.find((x) => x.name === nm)) {
    if (o.noref) HOSTIMG.push({ name: nm, prompt: `Realistic handheld 16:9 photo. ${prompt}. ${IMPERF}` });
    else HOSTIMG.push({ name: nm, ref: [HOSTREF], prompt: PH(prompt) });
  }
  const { noref, ...rest } = o;
  return { t: "raw", name: nm, ...rest };
};
// prop cutout transparente → floatprop
let fpi = 0;
const fp = (name, desc, o = {}) => {
  const nm = IMGPFX + name;
  if (!PROPS.find((x) => x.name === nm)) PROPS.push({ name: nm, prompt: PP(desc) });
  const bg = o.bg || `broll/${CLIPFX}${FP_BG[fpi++ % FP_BG.length]}.mp4`;
  return { t: "floatprop", src: `img/${nm}.png`, ...o, bg };
};
// clip real de stock → beat raw broll (sin gen)
const real = (name, concept, query, o = {}) => {
  const nm = CLIPFX + name;
  if (!CLIPS.find((x) => x.name === nm)) CLIPS.push({ name: nm, concept, query, dur: o.dur || 5 });
  return { t: "raw", name: nm, broll: true, ...o };
};
// reusar clip ya registrado (no re-baja)
const clip = (name, o = {}) => ({ t: "raw", name: CLIPFX + name, broll: true, ...o });
const c = (kind, props = {}) => ({ t: kind, ...props });
// keyphrase: highlight ÁMBAR por defecto (rojo SOLO en avisos, que pasan accent:"danger").
const kp = (text, o = {}) => c("keyphrase", { text, ...o, accent: o.accent || "amber" });

// pool de fondos para floatprops (clips ya registrados abajo)
const FP_BG = ["beach_ocean", "market_produce", "passport_stamp", "cafe_table", "couple_beach", "airplane_window", "money_count", "doctor_clinic"];

const W = { raw: 1.3, keyphrase: 1.4, statpills: 1.3, floatprop: 1.5, rule: 1.0, checklist: 1.7, splitlist: 1.4,
  bars: 1.5, callout: 1.3, mistake: 1.5, action: 1.5, signature: 1.7, vsmed: 1.6, nextvideo: 1.4, quote: 1.1, chips: 1.1, stat: 1.2 };

// ════════════════════════ SECCIONES (ancla = frase verbatim del transcript) ═══════════════
const SECTIONS = [
  // ░░ HOOK ░░
  { key: "hook", phrase: null, start: 1.4, beats: [
    c("talk", {}),
    hi("beach_porch", "sitting relaxed on a tropical beach porch in the morning, a coffee mug in hand, looking out at the ocean, content half-smile", { hold: true, w: 0.9 }),
    real("beach_ocean", "calm tropical ocean and palm beach, slow", "tropical beach ocean palm slow calm", { w: 0.5 }),
    kp("My total spending this month? About *$1,300*", { src: "img/ra_beach_porch.png", at: "about $1,300", w: 0.6 }),
    real("beach_town", "a quiet seaside town street in latin america, warm morning", "seaside town street latin america morning", { w: 0.45 }),
    kp("My Social Security check makes me feel *rich*", { src: "broll/rac_beach_ocean.mp4", at: "it makes me feel rich", w: 0.55 }),
    c("statpills", { pills: ["Rent ~$400", "Dinner ~$5", "Beach 2 min"], accent: "amber", slider: false }),
    real("cafe_table", "coffee cup on a table by the sea, relaxed", "coffee cup table sea relaxed", { w: 0.45 }),
  ]},
  // ░░ STORY — Ohio kitchen table ░░
  { key: "ohio", phrase: "Two years ago", beats: [
    hi("ohio_night", "a few years younger and tired, sitting alone at a worn kitchen table at night in an Ohio home, a laptop and a spreadsheet glowing, worried, dim warm lamp light", { kicker: "Ohio, two years ago", hold: true }),
    kp("Worked *40 years*. Paid the house down.", { src: "img/ra_ohio_night.png", at: "worked 40 years", w: 0.7 }),
    kp("By the time everything's paid... *nothing left*", { src: "img/ra_ohio_night.png", at: "there's nothing left", w: 0.7 }),
    hi("empty_chair", "an empty wooden kitchen chair across the table, soft melancholic light, absence", { kicker: "Her chair, still there", w: 0.8 }),
  ]},
  // ░░ RAY ░░
  { key: "ray", phrase: "my buddy Ray", beats: [
    hi("phone_call", "at the kitchen table at night holding an old phone to his ear, a small surprised smile starting", { kicker: "11 o'clock, a phone call", hold: true }),
    real("phone_night", "an older man on a phone at night at home, warm lamp", "older man phone night home lamp", { w: 0.5 }),
    kp("*You're doing the math in the wrong country*", { src: "img/ra_phone_call.png", at: "you're doing the math in the wrong country", w: 0.9 }),
    fp("plane_ticket", "a single paper airline boarding pass, round trip", { caption: "One ticket. *Round trip.*", accent: "amber", scale: 0.8 }),
  ]},
  // ░░ PROMISE / red carpet ░░
  { key: "promise", phrase: "there are countries right now", beats: [
    real("redcarpet", "a red carpet rolled out, welcome, symbolic", "red carpet welcome rolled out", { w: 0.5 }),
    kp("They are *begging* Americans to come", { src: "broll/rac_redcarpet.mp4", at: "begging us to come", w: 0.7 }),
    real("law_book", "an official law book and stamp, government", "law book government stamp official", { w: 0.45 }),
    kp("Cutting your bills in half — *by law*", { src: "broll/rac_law_book.mp4", at: "cutting your bills in half", w: 0.6 }),
    c("mistake", { number: "!", eyebrow: "STAY FOR THIS", title: "One mistake", desc: "It can turn this whole dream into the most expensive lesson of your life. I almost made it.", accent: "amber" }),
  ]},
  // ░░ ROADMAP ░░
  { key: "roadmap", phrase: "five countries that are practically", beats: [
    c("statpills", { pills: ["Avg check ~$1,900/mo", "Just the check"], accent: "good", slider: true }),
    kp("Not a pension. Not investments. *Just the check.*", { src: "broll/rac_money_count.mp4", at: "just the check", w: 0.6 }),
    real("money_count", "hands counting a few US dollar bills at a table", "hands counting dollar bills table", { w: 0.45 }),
    c("splitlist", { title: "The 5 countries", items: ["Costa Rica", "Colombia", "Portugal", "Ecuador", "Panama"], palette: "A" }),
  ]},
  // ░░ #5 COSTA RICA ░░
  { key: "costarica", phrase: "Number five, Costa Rica", beats: [
    c("rule", { number: "05", label: "N°", title: "Costa Rica" }),
    real("cr_rainforest", "costa rica lush green rainforest and waterfall, aerial", "costa rica rainforest waterfall aerial green", { w: 0.55, hold: true }),
    real("cr_town", "a colorful small town in costa rica central valley, mountains", "costa rica central valley town mountains", { w: 0.5 }),
    c("statpills", { pills: ["Pensionado visa", "$1,000/mo income"], accent: "amber", slider: false }),
    kp("If your check clears *$1,000*, you qualify", { src: "broll/rac_cr_town.mp4", at: "if your social security check clears", w: 0.6 }),
    real("cr_toucan", "a toucan or sloth in a green costa rica tree, wildlife", "toucan sloth costa rica wildlife tree", { w: 0.45 }),
    c("checklist", { title: "Public healthcare (the Caja)", accent: "good", items: ["Legal resident pays in by income", "~$60–$130 a month", "Doctor visits · prescriptions · surgery"] }),
    kp("But the public system *has waits* — be honest", { src: "broll/rac_doctor_clinic.mp4", at: "the public system has waits", accent: "amber", w: 0.6 }),
    real("doctor_clinic", "a friendly doctor with an older patient in a bright clinic", "doctor older patient clinic bright", { w: 0.45 }),
    kp("*Pura vida* — a slower way through the day", { src: "broll/rac_cr_rainforest.mp4", at: "pura vida", w: 0.6 }),
    c("statpills", { pills: ["Couple ~$2,000–2,500", "Rent $500–$700"], accent: "amber", slider: true }),
  ]},
  // ░░ #4 COLOMBIA ░░
  { key: "colombia", phrase: "Number four", beats: [
    c("rule", { number: "04", label: "N°", title: "Colombia" }),
    real("co_medellin", "medellin colombia city skyline in a green valley, aerial", "medellin colombia skyline green valley aerial", { w: 0.55, hold: true }),
    kp("The picture in your head is *30 years* out of date", { src: "broll/rac_co_medellin.mp4", at: "frozen in time about 30 years ago", accent: "amber", w: 0.6 }),
    real("co_flowers", "colorful flowers and a plaza in medellin, spring, people", "medellin flowers plaza spring people", { w: 0.45 }),
    kp("The *City of Eternal Spring* — 72°, every day", { src: "broll/rac_co_flowers.mp4", at: "the city of eternal spring", w: 0.6 }),
    c("statpills", { pills: ["Pensioner visa", "~$900–$1,000/mo"], accent: "amber", slider: false }),
    real("co_apartment", "a modern apartment balcony with a valley view, morning", "modern apartment balcony valley view morning", { w: 0.45 }),
    c("callout", { image: "co_apartment_c", figure: "$1,200", caption: "Linda's all-in monthly spend — everything", accent: "good", _genImg: "co_apartment_c", _prompt: PH("meeting a friendly retired American woman on a bright modern apartment balcony overlooking a green valley") }),
    kp("Learn some *Spanish* — you'll really need it", { src: "broll/rac_co_medellin.mp4", at: "you've got to learn some spanish", accent: "amber", w: 0.55 }),
  ]},
  // ░░ #3 PORTUGAL ░░
  { key: "portugal", phrase: "Number three, Portugal", beats: [
    c("rule", { number: "03", label: "N°", title: "Portugal" }),
    real("pt_algarve", "algarve portugal golden cliffs and blue atlantic ocean, aerial", "algarve portugal cliffs atlantic ocean aerial", { w: 0.55, hold: true }),
    real("pt_cobblestone", "a cobblestone street with little cafes in a portuguese town", "portugal cobblestone street cafe town", { w: 0.5 }),
    kp("This is *Europe*. On a Social Security check.", { src: "broll/rac_pt_cobblestone.mp4", at: "this is western europe", w: 0.7 }),
    c("statpills", { pills: ["D7 visa", "~€870/mo floor"], accent: "amber", slider: false }),
    kp("The average check qualifies you for the *European Union*", { src: "broll/rac_pt_algarve.mp4", at: "to live in the european union", accent: "good", w: 0.7 }),
    real("pt_market", "a fresh fish and wine market in portugal, cheap food", "portugal fish market wine fresh food", { w: 0.45 }),
    kp("Portugal got *popular* — look inland to save", { src: "broll/rac_pt_cobblestone.mp4", at: "portugal got popular", accent: "amber", w: 0.6 }),
    fp("wine_bottle", "a bottle of red wine with two glasses", { caption: "Good wine, a few *dollars* a bottle", accent: "good", scale: 0.7 }),
  ]},
  // ░░ #2 ECUADOR ░░
  { key: "ecuador", phrase: "Number two, Ecuador", beats: [
    c("rule", { number: "02", label: "N°", title: "Ecuador" }),
    real("ec_cuenca", "cuenca ecuador colonial city with blue domed cathedral, andes", "cuenca ecuador cathedral colonial andes", { w: 0.55, hold: true }),
    fp("us_dollar", "a US one dollar bill, cash", { caption: "Ecuador uses the *US dollar*", accent: "good", scale: 0.7 }),
    kp("No exchange rate. *What you see is what you get.*", { src: "broll/rac_ec_cuenca.mp4", at: "there is no exchange rate", w: 0.65 }),
    c("statpills", { pills: ["Pensioner visa", "~$1,400/mo"], accent: "amber", slider: false }),
    kp("This is where Ecuador starts *begging*", { src: "broll/rac_ec_market.mp4", at: "where ecuador starts begging", w: 0.6 }),
    c("checklist", { title: "Senior discounts — by law (65+)", accent: "good", items: ["50% off airline tickets", "50% off public transportation", "50% off cultural & sporting events", "Sales tax refunded to you"] }),
    real("ec_market", "a colorful andean produce market with cheap fresh fruit", "ecuador andean produce market fresh fruit", { w: 0.45 }),
    c("statpills", { pills: ["Single ~$1,200–1,300", "Rent $300–$500"], accent: "amber", slider: true }),
    kp("Roads and paperwork need *patience* — honest", { src: "broll/rac_ec_market.mp4", at: "the infrastructure isn't switzerland", accent: "amber", w: 0.5 }),
  ]},
  // ░░ #1 PANAMA ░░
  { key: "panama", phrase: "Number one, Panama", beats: [
    c("rule", { number: "01", label: "N°", title: "Panama" }),
    real("pa_skyline", "panama city skyline at golden hour, modern towers, ocean", "panama city skyline towers ocean golden hour", { w: 0.55, hold: true }),
    kp("The *most generous* retirement program I've ever seen", { src: "broll/rac_pa_skyline.mp4", at: "the most generous retirement program", w: 0.7 }),
    c("statpills", { pills: ["Pensionado visa", "$1,000/mo", "US dollar"], accent: "amber", slider: false }),
    c("checklist", { title: "Pensioner discounts — by law", accent: "good", items: ["25% off airline tickets", "25% off restaurants", "20% off doctor visits & medicine", "25% off electric & phone bills", "50% off movies & shows"] }),
    kp("They wrote *we want you* right into the law", { src: "broll/rac_pa_skyline.mp4", at: "they wrote it into the code", accent: "good", w: 0.65 }),
    real("pa_boquete", "boquete panama green mountains, coffee farms, river", "boquete panama mountains coffee farm river", { w: 0.5 }),
    hi("marisol", "chatting and laughing with an older latina woman in an apron at a colorful fruit stand in a small tropical town, morning light", { kicker: "Marisol, at the fruit stand", w: 0.8 }),
    kp("A little house, *one street back* from the water", { src: "img/ra_little_house.png", at: "one street back from the water", w: 0.7 }),
    hi("little_house", "a modest pastel one-story beach house one street back from the water in a latin american town, plants, no people", { noref: true }),
    real("pa_hospital", "a modern private hospital room, clean, world class", "modern private hospital room clean", { w: 0.4 }),
    c("callout", { image: "pa_hospital", figure: "$40–50k", caption: "What that surgery would've cost back home", accent: "amber" }),
  ]},
  // ░░ RECAP ░░
  { key: "recap", phrase: "with the door wide open", beats: [
    c("splitlist", { title: "The door is wide open", items: ["Costa Rica", "Colombia", "Portugal", "Ecuador", "Panama"], palette: "A" }),
    kp("Set at a number your check can *actually clear*", { src: "broll/rac_beach_ocean.mp4", at: "your social security check can actually clear", accent: "good", w: 0.6 }),
  ]},
  // ░░ WARNINGS — MEDICARE (rojo) ░░
  { key: "warnings", phrase: "this part, the warnings", beats: [
    hi("host_serious", "leaning in, serious and caring, a raised hand, warm concern", { kicker: "Now the honest part", hold: true }),
    c("vsmed", { eyebrow: "The #1 mistake", leftTitle: "MEDICARE in the US", leftItems: [{ text: "Covers you", ok: true }], rightTitle: "MEDICARE abroad", rightItems: [{ text: "Does NOT come with you", ok: false }, { text: "Does not work overseas", ok: false }] }),
    kp("Medicare *does not* work outside the US", { src: "broll/rac_doctor_clinic.mp4", at: "it does not work outside the united states", accent: "danger", w: 0.7 }),
    c("checklist", { title: "So instead", accent: "good", items: ["Get onto the local system", "Or buy international health insurance", "Keep Medicare Part A for big stuff back home", "Have a plan — don't wing it"] }),
  ]},
  // ░░ WARNINGS — TAXES (rojo) ░░
  { key: "taxes", phrase: "Second, taxes", beats: [
    real("tax_form", "US tax forms and a calculator on a desk, close up", "us tax form calculator desk", { w: 0.5, hold: true }),
    kp("The US taxes your *worldwide income* — you always file", { src: "broll/rac_tax_form.mp4", at: "you still file a u.s. tax return", accent: "danger", w: 0.7 }),
    fp("fbar_form", "a treasury bank-account report form, official paper", { caption: "Over $10k in a bank? *File the FBAR*", accent: "danger", scale: 0.8 }),
    kp("Call an accountant who *knows expat taxes*", { src: "broll/rac_money_count.mp4", at: "an accountant who knows expat taxes", accent: "amber", w: 0.6 }),
  ]},
  // ░░ WARNINGS — THE HOUSE (rojo) ░░
  { key: "house", phrase: "this is the mistake I almost", beats: [
    c("mistake", { number: "3", eyebrow: "THE BIG ONE", title: "Don't sell everything on trip one", desc: "Rent for a year before you buy. Keep your exit door open. Keep a cushion back home.", accent: "danger" }),
    kp("Paradise for two weeks is *different* on a Tuesday", { src: "broll/rac_beach_town.mp4", at: "a different animal when it's your tuesday", accent: "amber", w: 0.65 }),
    hi("welder_condo", "a worried heavier older american man in a work shirt looking up at a half-finished abandoned concrete condo building, construction site", { kicker: "A man I knew", w: 0.8, noref: true }),
    kp("His money was just... *gone*. An ocean away.", { src: "img/ra_welder_condo.png", at: "his money was just", accent: "danger", w: 0.7 }),
    c("action", { eyebrow: "The rule", step: "Rent before you buy — for a year", question: "If you wanted to come home in six months, could you?" }),
  ]},
  // ░░ RULES CHANGE + MEXICO ░░
  { key: "mexico", phrase: "what about Mexico", beats: [
    kp("Rules *change* — confirm with the consulate", { src: "broll/rac_passport_stamp.mp4", at: "countries change them", accent: "amber", w: 0.6 }),
    real("passport_stamp", "a passport being stamped at an immigration desk, close up", "passport stamp immigration desk", { w: 0.45 }),
    kp("Mexico *quietly raised* the income bar", { src: "broll/rac_beach_town.mp4", at: "mexico quietly raised the income", accent: "amber", w: 0.6 }),
    c("statpills", { pills: ["Mexico income", "now > avg check"], accent: "amber", slider: false }),
  ]},
  // ░░ CLOSE ░░
  { key: "close", phrase: "the most expensive country in the world", beats: [
    hi("beach_walk", "walking a quiet beach at golden hour, sandals in hand, profile, relaxed and free", { kicker: "For the first time in years", hold: true }),
    kp("It was never that I didn't have *enough money*", { src: "img/ra_beach_walk.png", at: "i didn't have enough money", w: 0.7 }),
    kp("The moment I moved the check... *everything changed*", { src: "broll/rac_beach_ocean.mp4", at: "everything changed", accent: "good", w: 0.7 }),
    c("statpills", { pills: ["No alarm", "Real food", "Money left over"], accent: "good", slider: false }),
  ]},
  // ░░ CTA ░░
  { key: "cta", phrase: "walks through each of these five", beats: [
    c("action", { eyebrow: "Free — in the description", step: "Grab the free step-by-step guide", question: "Exact income numbers, visa paperwork, real budgets, and a scouting-trip checklist." }),
    kp("It's *completely free* — link in the description", { src: "broll/rac_cafe_table.mp4", at: "it's completely free", accent: "good", w: 0.6 }),
  ]},
  // ░░ SUBSCRIBE / OUTRO ░░
  { key: "outro", phrase: "do me a favor and subscribe", beats: [
    c("nextvideo", { kicker: "Coming up", title: "Inside each country", sub: "The actual neighborhoods, the actual apartments, the actual grocery bills." }),
    c("signature", { eyebrow: "Ray was right", lines: [{ text: "I was doing the math" }, { text: "in the wrong country." }, { text: "Come do the math down here.", gold: true }] }),
    hi("outro_smile", "on the beach porch giving a warm goodbye, kind smile, golden hour", { hold: true, kicker: "The water's warm" }),
  ]},
];

// ════════════════════════ ANCLAJE POR FRASE (whisperX) ═══════════════════════
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1420) + 1.5;
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
  // tope de duración por tipo: si el beat es más corto que el hueco al próximo,
  // el resto queda como AVATAR FULL (L0 persistente) → ritmo en olas + anti-hueco.
  const CAP = { keyphrase: 4.6, statpills: 5.0, checklist: 8.5, rule: 3.2, callout: 5.0,
    mistake: 6.5, splitlist: 6.0, bars: 6.0, vsmed: 7.5, action: 6.5, signature: 6.5, nextvideo: 6.0,
    floatprop: 5.0, quote: 4.5, chips: 4.5, stat: 5.0 };
  sec.beats.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2);
    const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2);
    const gap = +(nextR - cursor).toFixed(2);
    // clips reales: hold hasta ~7s, normal ~5s; imágenes host ~4.5s; componentes por CAP.
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
    beats.push(beat);
  });
}

// ── RELLENO DE HUECOS: b-roll distinto en los gaps largos del avatar (densidad + anti-hueco) ──
// Pool de clips de destino/genéricos DISTINTOS (se registran en CLIPS al usarse).
const POOL = [
  ["cr_beach", "costa rica pacific beach with palm trees", "costa rica beach palm trees pacific"],
  ["cr_market", "a colorful fruit market stall in costa rica", "costa rica fruit market stall colorful"],
  ["cr_coffee", "coffee plantation green hills costa rica", "costa rica coffee plantation green hills"],
  ["co_street", "a lively street in medellin colombia with people", "medellin colombia street people day"],
  ["co_food", "a plate of fresh latin american food at a restaurant", "latin american food plate restaurant fresh"],
  ["co_cablecar", "medellin cable car over the green city", "medellin cable car city green"],
  ["pt_tram", "a yellow tram on a lisbon portugal street", "lisbon portugal yellow tram street"],
  ["pt_castle", "an old stone castle in portugal, blue sky", "portugal stone castle blue sky"],
  ["pt_coast", "atlantic coast waves and cliffs in portugal", "portugal atlantic coast cliffs waves"],
  ["ec_plaza", "a colonial plaza and church in ecuador with people", "ecuador colonial plaza church people"],
  ["ec_andes", "green andes mountains and valley in ecuador", "ecuador andes mountains valley green"],
  ["ec_llama", "a llama in the andes highlands ecuador", "llama andes highlands ecuador"],
  ["pa_canal", "a large ship passing through the panama canal", "panama canal ship passing"],
  ["pa_beach", "a calm caribbean beach in panama", "panama caribbean beach calm"],
  ["pa_oldtown", "casco viejo old town panama city colorful buildings", "casco viejo panama city old town colorful"],
  ["older_couple_walk", "an older couple walking together on a beach at sunset", "older couple walking beach sunset"],
  ["airport", "travelers walking with luggage in an airport terminal", "airport terminal travelers luggage walking"],
  ["suitcase", "hands packing a suitcase for a trip", "packing suitcase trip hands"],
  ["passport_book", "a US passport and boarding pass on a table", "us passport boarding pass table"],
  ["market_fish", "fresh fish on ice at a seaside market", "fresh fish ice seaside market"],
  ["coffee_pour", "pouring coffee into a cup, cozy morning", "pouring coffee cup morning cozy"],
  ["apartment_interior", "a bright modern apartment living room interior", "modern apartment living room bright interior"],
  ["pharmacy", "a pharmacist handing medicine over a counter", "pharmacist medicine counter pharmacy"],
  ["doctor_talk", "a doctor talking with an older patient, friendly", "doctor older patient talking friendly"],
  ["house_for_sale", "a for sale sign in front of a suburban house", "for sale sign suburban house"],
  ["moving_boxes", "cardboard moving boxes in an empty room", "moving boxes empty room cardboard"],
  ["video_call", "an older person on a video call with family, smiling", "older person video call family smiling"],
  ["beach_sunset", "a golden sunset over a tropical ocean", "tropical ocean golden sunset"],
  ["town_square", "a warm evening in a small latin american town square", "latin american town square evening warm"],
  ["hands_coffee_talk", "two people talking over coffee at an outdoor cafe", "two people coffee outdoor cafe talking"],
  ["palm_road", "a coastal road lined with palm trees, driving", "coastal road palm trees driving"],
  ["fruit_hands", "hands holding fresh tropical fruit at a market", "hands fresh tropical fruit market"],
  ["boat_harbor", "small fishing boats in a calm tropical harbor", "fishing boats tropical harbor calm"],
  ["cathedral", "an ornate latin american cathedral facade", "latin american cathedral facade ornate"],
  ["mountain_town", "a small town nestled in green mountains, aerial", "small town green mountains aerial"],
  ["cafe_people", "people relaxing at a sidewalk cafe in a warm town", "sidewalk cafe people warm town"],
  ["hammock", "a hammock swinging on a tropical porch", "hammock tropical porch swinging"],
  ["street_food", "a street food vendor cooking in a latin market", "street food vendor latin market cooking"],
  ["sunrise_sea", "sunrise over a calm sea horizon", "sunrise calm sea horizon"],
  ["old_couple_cook", "an older couple cooking together in a kitchen", "older couple cooking kitchen together"],
  ["bank_desk", "a person signing papers at a bank desk", "person signing papers bank desk"],
  ["calendar_plan", "hands writing on a calendar and notebook, planning", "hands calendar notebook planning writing"],
  ["window_view", "looking out a window at a green tropical view", "window green tropical view looking"],
  ["dog_beach", "a dog running on an empty tropical beach", "dog running empty tropical beach"],
];
beats.sort((a, b) => a.start - b.start);
const filled = [];
let pi = 0;
for (let i = 0; i < beats.length; i++) {
  filled.push(beats[i]);
  const curEnd = beats[i].start + beats[i].dur;
  const nextStart = i + 1 < beats.length ? beats[i + 1].start : VIDEO_END;
  let gap = nextStart - curEnd;
  // rellená gaps grandes con 1-2 clips distintos (deja ~4s de avatar al final del gap).
  let cursor = curEnd + 0.25;
  while (gap > 6.5) {
    const [nm, concept, query] = POOL[pi % POOL.length];
    const cn = CLIPFX + nm;
    if (!CLIPS.find((x) => x.name === cn)) CLIPS.push({ name: cn, concept, query, dur: 6 });
    const d = Math.min(5.0, nextStart - cursor - 3.0);
    if (d < 3) break;
    filled.push({ id: `fill_${pi}`, start: +cursor.toFixed(2), dur: +d.toFixed(2), kind: "raw", src: `broll/${cn}.mp4`, hue: "amber" });
    cursor += d + 2.6; // deja respiro de avatar entre fillers
    gap = nextStart - cursor;
    pi++;
  }
}
beats.length = 0; beats.push(...filled);

// ── COLA: beat de avatar (talk, sin overlay) hasta el fin REAL del audio (1426.6s) para
//    no cortar la última frase; el gate mide max(start+dur) de los beats.
{
  const lastEnd = Math.max(...beats.map((b) => b.start + b.dur));
  const tailEnd = Math.max(lastEnd, 1427.8);
  if (!CLIPS.find((x) => x.name === CLIPFX + "beach_sunset")) CLIPS.push({ name: CLIPFX + "beach_sunset", concept: "a golden sunset over a tropical ocean", query: "tropical ocean golden sunset", dur: 6 });
  if (tailEnd > lastEnd + 0.1) beats.push({ id: "tail", start: +lastEnd.toFixed(2), dur: +(tailEnd - lastEnd).toFixed(2), kind: "raw", src: `broll/${CLIPFX}beach_sunset.mp4`, hue: "amber", hold: true });
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
