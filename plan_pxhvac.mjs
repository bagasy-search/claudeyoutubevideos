// plan_pxhvac.mjs — DIRECTOR §0 para "9 Hydrogen Peroxide Tricks HVAC Technicians Don't Want You to Know (#6 $900)" (EN).
// Genera _v3/pxhvac_plan.json (beats) + _v3/pxhvac_imgprompts.json (name→prompt gpt-image LOW).
// Snap a los ms REALES de las captions de Whisper. B-roll = SOLO imágenes gpt-image LOW + componentes firma.
import fs from "fs";

const W = JSON.parse(fs.readFileSync("public/captions_pxhvac.json", "utf8").replace(/^﻿/, ""));
const N = W.length;
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
// anchor: ms de inicio de la N-ésima aparición de una frase
function at(phrase, occ = 0) {
  const toks = phrase.toLowerCase().split(" ").map(norm);
  let seen = 0;
  for (let i = 0; i <= N - toks.length; i++) {
    let ok = true;
    for (let j = 0; j < toks.length; j++) if (norm(W[i + j].text) !== toks[j]) { ok = false; break; }
    if (ok) { if (seen++ === occ) return W[i].startMs; }
  }
  return null;
}

// ── SECCIONES (ms) — del mapa de anclas ──────────────────────────────────────
const SEC = [
  { k: "hook",   a: 0,        b: at("let me start right") },                 // cold open
  { k: "quim",   a: at("let me start right"), b: at("trick number one") },  // química
  { k: "t1",     a: at("trick number one"),   b: at("trick number two") },
  { k: "t2",     a: at("trick number two"),   b: at("before we keep going") },
  { k: "cta1",   a: at("before we keep going"),b: at("trick number three") },
  { k: "t3",     a: at("trick number three"), b: at("trick number four") },
  { k: "t4",     a: at("trick number four"),  b: at("trick number five") },
  { k: "t5",     a: at("trick number five"),  b: at("number six", 1) },      // dishwasher → coil
  { k: "t6",     a: at("number six", 1),       b: at("on the expensive one") },
  { k: "cta2",   a: at("on the expensive one"),b: at("trick number seven") },
  { k: "t7",     a: at("trick number seven"), b: at("trick number eight") },
  { k: "t8",     a: at("trick number eight"), b: at("number nine") },
  { k: "t9",     a: at("number nine"),         b: at("those are the nine") },
  { k: "safety", a: at("those are the nine"), b: at("there you have it") },
  { k: "cierre", a: at("there you have it"),   b: W[N - 1].endMs + 200 },
];
for (const s of SEC) if (s.a == null || s.b == null) throw new Error("ancla nula en " + s.k + " " + s.a + "/" + s.b);

// ── COMPONENTES CURADOS (anclados a frase) ───────────────────────────────────
// shapes exactos (normProps del build los traduce, pero mando los correctos).
const IMGSTYLE = "casual phone snapshot, slightly imperfect framing, natural available light, low saturation, soft muted colors, nothing polished, no AI look, realistic hands";
const RP = "ultra-realistic candid amateur phone photo of a real ordinary American";
const CUR = [
  // ===== HOOK (denso, ~9 componentes) =====
  { sec: "hook", ph: "nine hundred dollars", occ: 0, comp: "BigStatReveal", dur: 2.6, props: { value: 900, prefix: "$", eyebrow: "THE QUOTE", label: "Evaporator coil cleaning" } },
  { sec: "hook", ph: "this little brown bottle", comp: "BottleHero", dur: 3.4, props: {} },
  { sec: "hook", ph: "99 cents", comp: "HighlightSweep", dur: 2.4, props: { pre: "It costs", highlight: "99 cents", post: "at any drugstore", note: "3% hydrogen peroxide" } },
  { sec: "hook", ph: "white blood cells", comp: "HookCaption", dur: 3.2, props: { words: [{ text: "Your body" }, { text: "already" }, { text: "MAKES it", boxed: true }], sub: "one of the oldest disinfectants alive" } },
  { sec: "hook", ph: "operating rooms", comp: "HookCaption", dur: 2.8, props: { words: [{ text: "Hospitals" }, { text: "sterilize with" }, { text: "THIS", boxed: true }], sub: "a stronger version, between surgeries" } },
  { sec: "hook", ph: "nine places", comp: "LightTrailCards", dur: 4.2, props: { number: "9", phrase: "9 tricks they *never* mention", cards: 9, goldCard: 5 } },
  { sec: "hook", ph: "the electrical the compressor", comp: "BulletCascade", dur: 3.6, props: { bullets: [{ key: "Refrigerant" }, { key: "Electrical" }, { key: "Compressor" }], eyebrow: "PAY A PRO FOR" } },
  // ===== QUÍMICA =====
  { sec: "quim", ph: "water and oxygen", comp: "FlowSteps", dur: 5.0, props: { nodes: [{ label: "Hydrogen peroxide", sub: "3%" }, { label: "Water", sub: "H₂O" }, { label: "Oxygen", sub: "kills mold" }], kicker: "WHY IT WORKS" } },
  { sec: "quim", ph: "bleach eats aluminum", comp: "MythTruth", dur: 4.6, props: { myth: "Bleach cleans the coil", truth: "Bleach corrodes the aluminum", mythLabel: "WHAT PROS AVOID", truthLabel: "WHY PEROXIDE" } },
  // ===== T1 drain line =====
  { sec: "t1", ph: "trick number one", comp: "ChapterTrailCard", dur: 4.0, props: { number: 1, title: "The AC Drain Line", sub: "the #1 summer call" } },
  { sec: "t1", ph: "two cups", comp: "NumberedSteps", dur: 5.2, props: { steps: [{ title: "Turn the unit off" }, { title: "Find the white PVC + cap" }, { title: "Pour 2 cups of 3%", sub: "no diluting" }, { title: "1 cup every 3 months" }], eyebrow: "DRAIN LINE" } },
  { sec: "t1", ph: "in some places", comp: "BigStatReveal", dur: 2.8, props: { value: 500, prefix: "$", eyebrow: "A PLUMBER CHARGES", label: "to clear one clog" } },
  { sec: "t1", ph: "green slime", comp: "GluGluPour", dur: 3.0, props: {} },
  // ===== T2 window AC =====
  { sec: "t2", ph: "trick number two", comp: "ChapterTrailCard", dur: 4.0, props: { number: 2, title: "The Window Unit", sub: "a mold factory" } },
  { sec: "t2", ph: "spray bottle", comp: "NumberedSteps", dur: 5.0, props: { steps: [{ title: "Unplug it — always" }, { title: "Pull the grille + filter" }, { title: "Spray the fins & coil" }, { title: "Dry FULLY before plugging in" }], eyebrow: "WINDOW UNIT" } },
  { sec: "t2", ph: "the driveway", comp: "BigStatReveal", dur: 2.6, props: { value: 100, prefix: "$", eyebrow: "A SHOP CHARGES", label: "for this clean" } },
  // ===== CTA1 (guía + QR) =====
  { sec: "cta1", ph: "the amount", comp: "MythTruth", dur: 4.2, props: { myth: "The trick is the peroxide", truth: "The trick is the AMOUNT", mythLabel: "EVERYONE THINKS", truthLabel: "THE REAL SECRET" } },
  { sec: "cta1", ph: "qr code", comp: "CtaCard", dur: 5.5, props: { eyebrow: "THE MEASUREMENTS SHEET", title: "Every trick, the exact amount", bullet: "Scan the QR — or the first link below", image: "pxhvac_qrcard", cta: "hydrogen-peroxide-ventas.vercel.app" } },
  // ===== T3 washer =====
  { sec: "t3", ph: "trick number three", comp: "ChapterTrailCard", dur: 4.0, props: { number: 3, title: "The Washing Machine", sub: "that sour smell" } },
  { sec: "t3", ph: "rubber door gasket", comp: "FoamClean", dur: 3.2, props: {} },
  { sec: "t3", ph: "the labor", comp: "BigStatReveal", dur: 2.6, props: { value: 300, prefix: "$", eyebrow: "A SERVICE CALL", label: "smell & mold" } },
  // ===== T4 fridge =====
  { sec: "t4", ph: "trick number four", comp: "ChapterTrailCard", dur: 4.0, props: { number: 4, title: "The Refrigerator", sub: "the hidden drip pan" } },
  { sec: "t4", ph: "drip pan", comp: "NumberedSteps", dur: 5.0, props: { steps: [{ title: "Unplug the fridge" }, { title: "Pull the drip pan (bottom/back)" }, { title: "Soap + 1 cup peroxide" }, { title: "No pan? Pour down the drain hole" }], eyebrow: "FRIDGE" } },
  { sec: "t4", ph: "over a smell", comp: "BigStatReveal", dur: 2.6, props: { value: 400, prefix: "$", eyebrow: "A FRIDGE CALL", label: "over a smell" } },
  // ===== T5 dishwasher =====
  { sec: "t5", ph: "trick number five", comp: "ChapterTrailCard", dur: 4.0, props: { number: 5, title: "The Dishwasher", sub: "cloudy dishes" } },
  { sec: "t5", ph: "runs around", comp: "BigStatReveal", dur: 2.6, props: { value: 200, prefix: "$", eyebrow: "A DISHWASHER CALL", label: "usually just cleaning" } },
  // ===== T6 THE COIL ($900) — trato premium =====
  { sec: "t6", ph: "number six", occ: 0, comp: "ChapterTrailCard", dur: 4.4, props: { number: 6, title: "The Evaporator Coil", sub: "the $900 job" } },
  { sec: "t6", ph: "works like a coat", comp: "MythTruth", dur: 4.6, props: { myth: "It ran out of refrigerant", truth: "A blanket of mold insulates the cold", mythLabel: "WHAT YOU THINK", truthLabel: "WHAT IT REALLY IS" } },
  { sec: "t6", ph: "cut the breaker", comp: "NumberedSteps", dur: 5.4, props: { steps: [{ title: "Cut power AND the breaker", sub: "both" }, { title: "Open the access panel" }, { title: "Even coat on the coil & fins", sub: "don't soak" }, { title: "Let it dry fully, reassemble" }], eyebrow: "THE COIL — SAFELY" } },
  { sec: "t6", ph: "nine hundred", occ: 1, comp: "BigStatReveal", dur: 3.2, props: { value: 900, prefix: "$", eyebrow: "PULL & DEEP-CLEAN", label: "you do it for $1" } },
  // ===== CTA2 (Ricardo) =====
  { sec: "cta2", ph: "the exact dilution", comp: "HighlightSweep", dur: 3.6, props: { pre: "The exact number is", highlight: "in the description", post: "with the QR", note: "don't guess on a $900 part" } },
  { sec: "cta2", ph: "like new", comp: "CtaCard", dur: 5.0, props: { eyebrow: "REAL RESULT", title: "Ricardo skipped the repair call", bullet: "the gasket step — right off the sheet", image: "pxhvac_cta2_ricardo_washer", cta: "hydrogen-peroxide-ventas.vercel.app" } },
  // ===== T7 disposal =====
  { sec: "t7", ph: "trick number seven", comp: "ChapterTrailCard", dur: 4.0, props: { number: 7, title: "The Garbage Disposal", sub: "the drain funk" } },
  { sec: "t7", ph: "half a cup", comp: "FoamClean", dur: 3.4, props: {} },
  // ===== T8 humidifier =====
  { sec: "t8", ph: "trick number eight", comp: "ChapterTrailCard", dur: 4.0, props: { number: 8, title: "The Humidifier", sub: "breathing mold" } },
  { sec: "t8", ph: "two parts water", comp: "NumberedSteps", dur: 5.0, props: { steps: [{ title: "Empty + wash with soap" }, { title: "2 parts water : 1 part 3%" }, { title: "Soak 20–30 min" }, { title: "RINSE well — never run with peroxide in" }], eyebrow: "HUMIDIFIER" } },
  // ===== T9 car =====
  { sec: "t9", ph: "number nine", comp: "ChapterTrailCard", dur: 4.0, props: { number: 9, title: "The Car AC", sub: "gym-sock smell" } },
  { sec: "t9", ph: "fresh air", comp: "NumberedSteps", dur: 5.0, props: { steps: [{ title: "Engine on, fan on max" }, { title: "Fresh air — not recirculate" }, { title: "Spray the outside intakes" }, { title: "Let the fan dry it — avoid the seats" }], eyebrow: "CAR AC" } },
  // ===== SAFETY =====
  { sec: "safety", ph: "never mix hydrogen", comp: "ChecklistReveal", dur: 6.0, props: { items: ["NEVER mix with vinegar in a closed container", "NEVER mix with bleach or ammonia", "Unplug + dry fully before power on", "Wear gloves · test a hidden spot", "Store in the dark brown bottle"], title: "Safety — for real", kicker: "READ THIS" } },
  { sec: "safety", ph: "parasitic acid", comp: "MythTruth", dur: 4.4, props: { myth: "Peroxide + vinegar = better", truth: "= peracetic acid + pressure", mythLabel: "THE INTERNET SAYS", truthLabel: "WHAT ACTUALLY HAPPENS" } },
  // ===== CIERRE (CTA3) =====
  { sec: "cierre", ph: "the evaporator coil", occ: 1, comp: "LightTrailCards", dur: 4.4, props: { number: "9", phrase: "All nine — *one* dollar bottle", cards: 9, goldCard: 5 } },
  { sec: "cierre", ph: "point your phone", comp: "CtaCard", dur: 6.0, props: { eyebrow: "GET THE SHEET", title: "Every amount, every appliance", bullet: "Point your camera at the QR — or link below", image: "pxhvac_qrcard", cta: "hydrogen-peroxide-ventas.vercel.app" } },
];

// ── PROMPTS de imagen por sección (subjetos concretos, rotados) ───────────────
const SHOTS = {
  hook: [
    ["ac_dead", `${RP} homeowner sweating in a hot dim living room, hand on a silent wall air conditioner, frustrated, ${IMGSTYLE}`],
    ["ac_puddle", `close-up of a small water puddle spreading on the floor under an indoor AC air handler, ${IMGSTYLE}`],
    ["tech_van", `an HVAC technician writing a quote on a clipboard by a house, ${IMGSTYLE}`],
    ["cabinet", `a brown 3% hydrogen peroxide bottle sitting in a cluttered bathroom medicine cabinet, ${IMGSTYLE}`],
  ],
  quim: [
    ["fizz", `macro close-up of hydrogen peroxide fizzing white bubbles on a dirty metal surface, ${IMGSTYLE}`],
    ["coil_alu", `close-up of thin aluminum AC coil fins, silver metal, ${IMGSTYLE}`],
    ["pour_clear", `pouring a clear liquid from a brown bottle onto a grimy surface, ${IMGSTYLE}`],
  ],
  t1: [
    ["pvc", `close-up of a white PVC AC condensate drain pipe standing up near an indoor unit, with a cap, ${IMGSTYLE}`],
    ["algae", `green-brown algae slime clogging a thin plastic drain line, gross, ${IMGSTYLE}`],
    ["funnel", `hands pouring hydrogen peroxide into a white drain pipe using a funnel, ${IMGSTYLE}`],
    ["ceiling", `a brown water stain spreading on a white ceiling from an AC leak, ${IMGSTYLE}`],
  ],
  t2: [
    ["window_ac", `a window air conditioner unit pulled out on a driveway, front grille off, ${IMGSTYLE}`],
    ["moldy_fins", `moldy dusty metal fins inside a window AC unit, ${IMGSTYLE}`],
    ["spray_fins", `hands spraying hydrogen peroxide onto AC fins with a spray bottle, ${IMGSTYLE}`],
    ["filter_wash", `washing a dirty AC filter in a sink, ${IMGSTYLE}`],
  ],
  cta1: [
    ["sheet", `a printable one-page cleaning cheat sheet on a workbench next to a brown bottle, ${IMGSTYLE}`],
    ["phone_scan", `${RP} pointing a phone camera at a QR code on a laptop screen, ${IMGSTYLE}`],
  ],
  t3: [
    ["gasket", `close-up of black mold in the rubber door gasket folds of a front-load washing machine, ${IMGSTYLE}`],
    ["spray_gasket", `hands spraying and wiping the rubber gasket of a washer, ${IMGSTYLE}`],
    ["laundry", `pulling laundry out of a front-load washer, ${IMGSTYLE}`],
  ],
  t4: [
    ["fridge_back", `the back bottom of a refrigerator pulled out, compressor and drip pan visible, ${IMGSTYLE}`],
    ["drip_pan", `a grimy refrigerator drip pan held in gloved hands, ${IMGSTYLE}`],
    ["fridge_open", `${RP} sniffing and frowning at an open clean refrigerator, ${IMGSTYLE}`],
  ],
  t5: [
    ["dishwasher_filter", `a dirty dishwasher filter pulled out of the bottom of a dishwasher, food gunk, ${IMGSTYLE}`],
    ["cloudy_dishes", `cloudy foggy drinking glasses fresh out of a dishwasher, ${IMGSTYLE}`],
    ["spray_tub", `spraying the inside tub and gasket of a dishwasher, ${IMGSTYLE}`],
  ],
  t6: [
    ["coil_moldy", `close-up of an AC evaporator coil covered in a gray blanket of mold and grime, ${IMGSTYLE}`],
    ["breaker", `a hand flipping an electrical breaker in a gray breaker panel, ${IMGSTYLE}`],
    ["coil_spray", `hands giving an even spray coat to an AC evaporator coil inside an open access panel, ${IMGSTYLE}`],
    ["coil_clean", `a clean shiny AC evaporator coil after cleaning, ${IMGSTYLE}`],
    ["invoice", `a real HVAC service invoice with a high dollar line item, on a kitchen table, ${IMGSTYLE}`],
  ],
  cta2: [
    ["ricardo_washer", `${RP} man in his 50s smiling next to his front-load washing machine, thumbs up, ${IMGSTYLE}`],
    ["sheet2", `a printed cheat sheet held next to a brown peroxide bottle in a garage, ${IMGSTYLE}`],
  ],
  t7: [
    ["disposal", `looking down a kitchen sink garbage disposal drain, rubber splash guard, ${IMGSTYLE}`],
    ["disposal_foam", `white foam rising up out of a kitchen sink drain, ${IMGSTYLE}`],
  ],
  t8: [
    ["humid_tank", `standing water and black mold inside a humidifier tank, ${IMGSTYLE}`],
    ["humid_mist", `a humidifier releasing mist in a dim bedroom at night, ${IMGSTYLE}`],
    ["humid_rinse", `rinsing a humidifier tank in a bathroom sink, ${IMGSTYLE}`],
  ],
  t9: [
    ["car_vent", `close-up of a car dashboard AC vents, hand adjusting them, ${IMGSTYLE}`],
    ["car_intake", `spraying into the fresh-air intake at the base of a car windshield, hood up, ${IMGSTYLE}`],
    ["car_cabin", `${RP} turning on the AC in a car, slight frown at the smell, ${IMGSTYLE}`],
  ],
  safety: [
    ["no_mix", `two spray bottles with a big red X between them, warning, ${IMGSTYLE}`],
    ["gloves", `gloved hands holding a brown peroxide bottle, ${IMGSTYLE}`],
    ["brown_bottle", `a dark brown 3% hydrogen peroxide bottle on a shelf away from sunlight, ${IMGSTYLE}`],
  ],
  cierre: [
    ["saturday", `${RP} relaxed man in slippers with a coffee mug and a brown peroxide bottle on a Saturday morning kitchen, ${IMGSTYLE}`],
    ["jorge_measure", `${RP} man carefully measuring hydrogen peroxide into a cup, focused, ${IMGSTYLE}`],
    ["bottle_hero2", `a brown 3% hydrogen peroxide bottle standing on a clean counter, warm light, ${IMGSTYLE}`],
  ],
};

// ── construir beats: recorrer cada sección, chunkear en momentos ~4.5s ────────
const beats = [];
const imgprompts = {}; // name → prompt
const secImgIdx = {};
function nextImg(sec) {
  const shots = SHOTS[sec] || SHOTS.hook;
  const i = (secImgIdx[sec] = (secImgIdx[sec] || 0)) % shots.length;
  secImgIdx[sec]++;
  const [suf, prompt] = shots[i];
  const name = `pxhvac_${sec}_${suf}`;
  imgprompts[name] = prompt;
  return name;
}
// mapa de curados por sección con su ms resuelto
const curBySec = {};
for (const c of CUR) {
  const ms = at(c.ph, c.occ || 0);
  if (ms == null) { console.warn("⚠️ curado sin ancla:", c.sec, c.ph); continue; }
  (curBySec[c.sec] ||= []).push({ ...c, ms });
}
for (const k in curBySec) curBySec[k].sort((x, y) => x.ms - y.ms);

// índice de palabra por ms
function wordIdxAtMs(ms) { for (let i = 0; i < N; i++) if (W[i].startMs >= ms) return i; return N - 1; }

// DOS PASADAS: (1) fijar TODOS los componentes curados sin solape; (2) rellenar huecos.
let avToggle = 0;
function fillGap(a, b, sec) {
  // rellena [a,b) alternando avatar-full (holds largos) e imagen (Ken-Burns), con planos LARGOS
  // (variedad real: ~40% ≥5s). Si el gap entra casi entero en un plano, se toma entero (sin colitas).
  while (b - a >= 900) {
    const gap = b - a;
    const useAvatar = (avToggle % 3 === 0);
    const durMs = useAvatar ? [7000, 8500, 7500, 9000][avToggle % 4] : [5000, 4400, 5600, 5200][avToggle % 4];
    avToggle++;
    let end;
    if (gap <= durMs * 1.45) end = b;           // swallow: un solo plano largo
    else end = a + durMs;
    if (useAvatar) beats.push({ ms_in: a, ms_out: end, tipo: "avatar", avatar: "full", sec });
    else beats.push({ ms_in: a, ms_out: end, tipo: "clip", avatar: "hidden", sec, clip: nextImg(sec) });
    a = end;
  }
  if (b - a >= 250) beats.push({ ms_in: a, ms_out: b, tipo: "avatar", avatar: "full", sec });
}
for (const s of SEC) {
  const curs = curBySec[s.k] || [];
  // resolver componentes fijos sin pisar el próximo (min 700ms o cae; el build igual guarda <900→clip)
  const fixed = [];
  for (let i = 0; i < curs.length; i++) {
    const c = curs[i];
    const nextMs = i + 1 < curs.length ? curs[i + 1].ms : s.b;
    const start = c.ms;
    const end = Math.min(start + Math.round(c.dur * 1000), nextMs, s.b);
    if (end - start >= 700) fixed.push({ ms_in: start, ms_out: end, tipo: "componente", avatar: "hidden", sec: s.k, componente: c.comp, props: c.props });
  }
  // recorrer: rellenar hueco antes de cada fijo, insertar el fijo
  let pointer = s.a;
  for (const f of fixed) {
    if (f.ms_in - pointer > 250) fillGap(pointer, f.ms_in, s.k);
    beats.push(f);
    pointer = f.ms_out;
  }
  if (s.b - pointer > 250) fillGap(pointer, s.b, s.k);
}
// limpiar solapes/orden
beats.sort((a, b) => a.ms_in - b.ms_in);
for (let i = 0; i < beats.length - 1; i++) if (beats[i].ms_out > beats[i + 1].ms_in) beats[i].ms_out = beats[i + 1].ms_in;
const clean = beats.filter((b) => b.ms_out - b.ms_in >= 250);

fs.writeFileSync("_v3/pxhvac_plan.json", JSON.stringify({ beats: clean }, null, 0));
fs.writeFileSync("_v3/pxhvac_imgprompts.json", JSON.stringify(imgprompts, null, 2));

// stats
const durs = clean.map((b) => (b.ms_out - b.ms_in) / 1000).sort((x, y) => x - y);
const med = durs[Math.floor(durs.length / 2)];
const p75 = durs[Math.floor(durs.length * 0.75)];
const ge5 = durs.filter((d) => d >= 5).length;
const nA = clean.filter((b) => b.tipo === "avatar").length;
const nI = clean.filter((b) => b.tipo === "clip").length;
const nC = clean.filter((b) => b.tipo === "componente").length;
const comps = new Set(clean.filter((b) => b.componente).map((b) => b.componente));
console.log(`beats: ${clean.length} (${nA} avatar / ${nI} imagen / ${nC} componente)`);
console.log(`componentes distintos: ${comps.size} → ${[...comps].join(", ")}`);
console.log(`imágenes únicas a generar: ${Object.keys(imgprompts).length}`);
console.log(`pacing: mediana ${med.toFixed(2)}s · p75 ${p75.toFixed(2)}s · ≥5s: ${ge5} (${(100 * ge5 / durs.length).toFixed(0)}%)`);
console.log(`TOTAL: ${(clean[clean.length - 1].ms_out / 1000 / 60).toFixed(1)}min`);
