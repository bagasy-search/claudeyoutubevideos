// build_pxwash.mjs — canal "Agua Oxigenada / Hydrogen Peroxide Tricks" (EN, avatar).
// Video "9 Hydrogen Peroxide Tricks Pressure Washing Companies Don't Want You to Know".
// Handyman honesto: la botella de $1 vs la factura de $400 de las empresas. 14 secciones.
//
// ARQUITECTURA (clon de build_aceite.mjs):
//   · BASE (kind:"raw", full-bleed): los clips reales del coverage + las 2 imágenes IA.
//   · FIRMA peróxido (kind:"pxhero/pxfan/pxchap/pxtoggle/pxfoam", full-bleed, avatar HIDDEN):
//       BottleHero / LightTrailCards(9-intro) / ChapterTrailCard(#1..#9) / NodeRingToggle / FoamClean.
//   · PREMIUM (kind:"premium", overlay, THEME_PEROXIDE, avatar HIDDEN): BigStatReveal, MythTruth,
//       VsDuel, FlowSteps, BeforeAfter, PullQuote, CtaCard, HighlightSweep, NumberedSteps,
//       ChecklistReveal, HookCaption, BulletCascade. Todo el microcopy en INGLÉS.
//   · AVATAR full↔hidden (sin PiP): full SÓLO en los momentos tipo:"avatar"; hidden en el resto.
//   Tileo contiguo: cada beat dura hasta el próximo momento (que no asome el fondo).
// Salida: beatsheet/pxwash.json + src/VideoEdit/avatar_pxwash.gen.ts
//   → node beatsheet.mjs beatsheet/pxwash.json  (emite cues_pxwash.gen.tsx)
import fs from "fs";

const SLUG = "pxwash";
const AVATAR = `${SLUG}_opt.mp4`;
const THEME = "peroxide";

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = caps.map((c) => ({ n: norm(c.text), ms: c.startMs }));
const at = (phrase, maxTok = 8) => {
  const words = norm(phrase).split(" ").filter(Boolean);
  const t = words.slice(0, Math.min(maxTok, words.length));
  if (!t.length) return null;
  for (let i = 0; i <= Wc.length - t.length; i++) {
    let ok = 1;
    for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return Wc[i].ms / 1000;
  }
  return null;
};
const TOTAL = +((caps[caps.length - 1].endMs) / 1000 + 1.2).toFixed(2);

// Las 2 imágenes IA (imposibles de stockear) por su ms
const IMG = { 140000: "pxwash_h2o2_molecule", 674000: "pxwash_gloeocapsa_magma" };

// ── PROPS de cada momento tipo:"componente" (INGLÉS). Keyed por ms. ─────────────
// premium → { comp, ...props }.  firma peróxido → { px:"pxhero|pxfan|pxchap|pxtoggle|pxfoam", ...props }.
const PROPS = {
  // HOOK
  3000: { px: "pxhero", eyebrow: "The $1 bottle", phrase: "just *a dollar* at the drugstore" },
  12000: { comp: "BigStatReveal", eyebrow: "What the pros charge", prefix: "$", value: 400, support: "to come out and clean the exact same stuff a $1 bottle handles" },
  19000: { comp: "BulletCascade", eyebrow: "All of it is on the list", bullets: [{ key: "Green algae", post: " · siding" }, { key: "Black streaks", post: " · roof" }, { key: "Slippery film", post: " · deck" }] },
  28000: { comp: "MythTruth", myth: "Hydrogen peroxide is just for a scraped knee", truth: "It kills algae, mold & mildew outside your house", mythLabel: "Myth", truthLabel: "Truth" },
  60000: { comp: "HighlightSweep", pre: "They quoted my buddy ", highlight: "$240 to spray one wall", post: " of green film.", note: "he didn't know the green stuff is alive" },
  117000: { px: "pxfan", eyebrow: "Hydrogen peroxide, outside the house", phrase: "*9 ways* the pros won't tell you", number: "#1" },
  123000: { comp: "BigStatReveal", eyebrow: "Number five", prefix: "$", value: 400, suffix: " saved", support: "the one trick that's saved people around $400 in a single afternoon — stick around" },
  // QUIMICA
  152000: { comp: "FlowSteps", title: "Why it works", kicker: "H2O2 = water + one extra oxygen", nodes: [{ label: "H2O2" }, { label: "Weak bond breaks" }, { label: "Oxygen burst" }, { label: "Rips the gunk apart" }, { label: "Back to water + oxygen" }] },
  163000: { px: "pxfoam", eyebrow: "The reaction you can see", title: "It foams and lifts the gunk", cleanLabel: "CLEAN!" },
  186000: { comp: "VsDuel", eyebrow: "Two kinds of bleach", title: "Chlorine vs Oxygen", left: { label: "Chlorine bleach", sub: "harsh, scorches plants", image: "img/pxwash_bleach.png", good: false }, right: { label: "Oxygen bleach", sub: "same kill, gone to water + air", image: "img/pxwash_oxygen.png", good: true } },
  212000: { px: "pxtoggle", eyebrow: "Right next to the garden", phrase: "harsh → *safe by the beds*" },
  // TRICK 1
  228000: { px: "pxchap", number: "#1", title: "Siding", sub: "the green film on the north side" },
  241000: { comp: "HighlightSweep", pre: "That green film is ", highlight: "not dirt — it's living algae", post: ".", note: "it's alive" },
  250000: { comp: "BigStatReveal", eyebrow: "What a softwash charges", prefix: "$", value: 250, support: "a bleach mix on your siding — it can yellow your shrubs and kill the grass" },
  278000: { comp: "NumberedSteps", eyebrow: "The recipe", title: "Siding, how I do it", steps: [{ title: "Mix 1:1", sub: "one part 3% peroxide, one part water" }, { title: "Wet the siding first" }, { title: "Spray bottom to top" }, { title: "Wait 10–15 min" }] },
  306000: { px: "pxfoam", eyebrow: "You'll see it work", title: "It foams where the algae is thickest", cleanLabel: "CLEAN!" },
  316000: { comp: "BeforeAfter", eyebrow: "Rinse top to bottom", beforeLabel: "Green film", afterLabel: "Gone", caption: "the green's gone" },
  325000: { comp: "BigStatReveal", eyebrow: "A $200 service call", prefix: "$", value: 200, suffix: " → pocket change", support: "you just did it for pocket change" },
  // TRICK 2
  352000: { px: "pxchap", number: "#2", title: "Wood deck", sub: "gray, green & slippery" },
  369000: { comp: "BigStatReveal", eyebrow: "A restoration crew charges", prefix: "$", value: 700, support: "$600–$700 for a deck a $1 bottle can bring back" },
  389000: { comp: "VsDuel", eyebrow: "On wood", title: "Peroxide vs Chlorine", left: { label: "Chlorine", sub: "bleaches it white & blotchy", image: "img/pxwash_bleach.png", good: false }, right: { label: "Peroxide", sub: "brightens, restores the wood", image: "img/pxwash_oxygen.png", good: true } },
  399000: { comp: "NumberedSteps", eyebrow: "The recipe (stronger than #1)", title: "Deck, how I do it", steps: [{ title: "Sweep the deck" }, { title: "Mix 2:1 peroxide to water" }, { title: "Add a tiny squirt of dish soap" }, { title: "Work in sections" }, { title: "Wait 15–20 min" }] },
  432000: { comp: "BeforeAfter", eyebrow: "Scrub with the grain", beforeLabel: "Gray & green", afterLabel: "Warm, clean tone", caption: "that was under there the whole time" },
  // TRICK 3
  444000: { px: "pxchap", number: "#3", title: "Concrete", sub: "the black-green slip hazard" },
  463000: { comp: "BigStatReveal", eyebrow: "They charge by the square foot", prefix: "$", value: 200, suffix: "+", support: "a couple hundred dollars, easy, for concrete" },
  484000: { px: "pxfoam", eyebrow: "Straight 3%, no diluting", title: "It bubbles up through the pores", cleanLabel: "CLEAN!" },
  523000: { comp: "PullQuote", quote: "The pressure washer rinses. The peroxide cleans.", role: "the secret of the whole video" },
  538000: { comp: "VsDuel", eyebrow: "Which one lasts", title: "Blast only vs Kill first", left: { label: "Blast only", sub: "looks great for 3 weeks, then it's back", good: false }, right: { label: "Kill first", sub: "the algae is dead — it stays gone", good: true } },
  // TRICK 4
  558000: { px: "pxchap", number: "#4", title: "Driveway stains", sub: "two kinds: rust & oil" },
  576000: { comp: "MythTruth", myth: "Bleach removes rust stains", truth: "Bleach only kills living stuff — it ignores oxidized metal", mythLabel: "Myth", truthLabel: "Truth" },
  589000: { comp: "FlowSteps", title: "Rust is different", kicker: "chemistry, not biology", nodes: [{ label: "Peroxide" }, { label: "Reacts with the iron" }, { label: "Breaks the oxidation" }, { label: "The stain lifts" }] },
  613000: { px: "pxfoam", eyebrow: "For oil: baking soda + peroxide", title: "That satisfying fizz", cleanLabel: "CLEAN!" },
  625000: { comp: "ChecklistReveal", title: "Honest limits", items: ["Works: rust stains", "Works: fresh oil", "Doesn't: a 10-year-old oil stain"], stamp: "BEATS RESURFACING" },
  // TRICK 5 (premium beat — el de $400)
  639000: { px: "pxchap", number: "#5", title: "The roof", sub: "the $400 one" },
  661000: { px: "pxtoggle", eyebrow: "Not shingle failure", phrase: "'failing' → *it's alive*" },
  688000: { comp: "BigStatReveal", eyebrow: "A pro roof soft-wash", prefix: "$", value: 600, support: "$400–$600 on average to remove it professionally" },
  700000: { comp: "ChecklistReveal", title: "Roof safety — critical", items: ["Spray from a ladder at the edge", "Better: from the ground with reach", "NEVER walk on the roof"], stamp: "A WET ROOF IS DANGEROUS" },
  728000: { comp: "BeforeAfter", eyebrow: "It's not instant", beforeLabel: "Week 1: lighter", afterLabel: "Week 2: basically gone", caption: "let the rain and gravity rinse it" },
  746000: { px: "pxtoggle", eyebrow: "That slow fade", phrase: "streaks → *the algae dying off*" },
  758000: { comp: "BigStatReveal", eyebrow: "The payoff", prefix: "$", value: 400, suffix: " saved", support: "with a $2 bottle and an afternoon" },
  768000: { comp: "HighlightSweep", pre: "A partial re-roof is thousands — ", highlight: "that difference is somebody's commission", post: ".", note: "a salesman called a living stain 'shingle failure'" },
  // MIDROLL
  813000: { comp: "ChecklistReveal", title: "What it will NOT do", items: ["Fix a cracked driveway", "Restain your fence", "Repair real damage → call a pro"], stamp: "BE HONEST ABOUT IT" },
  831000: { comp: "HookCaption", words: [{ text: "Routine" }, { text: "cleaning,", boxed: true }, { text: "not" }, { text: "a" }, { text: "four-figure", boxed: true }, { text: "invoice" }], sub: "most of what they charge a premium for is just maintenance" },
  // TRICK 6
  851000: { px: "pxchap", number: "#6", title: "Fence", sub: "same story, vertical" },
  864000: { comp: "BigStatReveal", eyebrow: "A clean & seal service", prefix: "$", value: 300, support: "another few hundred dollars" },
  871000: { comp: "NumberedSteps", eyebrow: "The recipe", title: "Fence, how I do it", steps: [{ title: "Mix 1:1 + a squirt of dish soap" }, { title: "Spray bottom to top", sub: "always, on anything vertical" }, { title: "Wait 15 min" }, { title: "Soft brush, then rinse" }] },
  888000: { comp: "BeforeAfter", eyebrow: "Back to wood color", beforeLabel: "Sad weathered gray", afterLabel: "Actual wood color", caption: "neighbors will think you replaced it" },
  907000: { comp: "MythTruth", myth: "Just stain right over the green", truth: "You laminate the mildew under the sealer — it comes back", mythLabel: "Myth", truthLabel: "Truth" },
  921000: { comp: "HighlightSweep", pre: "", highlight: "Kill it first, then finish", post: ".", note: "noticing the pattern yet?" },
  // TRICK 7
  927000: { px: "pxchap", number: "#7", title: "Cushions & fabric", sub: "the black mildew speckles" },
  940000: { comp: "BigStatReveal", eyebrow: "They just throw them out", support: "a new cushion set can cost more than the whole list combined" },
  950000: { comp: "VsDuel", eyebrow: "On colored fabric", title: "Oxygen vs Chlorine", left: { label: "Chlorine", sub: "fades navy to sad gray", image: "img/pxwash_bleach.png", good: false }, right: { label: "Oxygen bleach", sub: "way safer on color", image: "img/pxwash_oxygen.png", good: true } },
  961000: { comp: "NumberedSteps", eyebrow: "The recipe", title: "Fabric, how I do it", steps: [{ title: "Mix 1:1, spray till damp" }, { title: "Let it sit a good 30 min" }, { title: "Scrub with a soft brush" }, { title: "Rinse, dry in the sun" }] },
  986000: { comp: "ChecklistReveal", title: "Test first", items: ["Test a hidden corner for colorfastness", "Bottom of a cushion", "Inside seam"], stamp: "PROTECT THE COLOR" },
  // TRICK 8
  998000: { px: "pxchap", number: "#8", title: "Brick & pavers", sub: "moss in the joints" },
  1012000: { comp: "MythTruth", myth: "Just power-wash the pavers", truth: "A high blast blows out the joint sand — then they upsell you re-sanding", mythLabel: "Myth", truthLabel: "Truth" },
  1036000: { comp: "NumberedSteps", eyebrow: "The recipe", title: "Pavers, how I do it", steps: [{ title: "Straight 3% into the joints" }, { title: "Let it foam ~20 min" }, { title: "Stiff brush" }, { title: "GENTLE rinse — keep the joint sand" }] },
  1049000: { px: "pxfoam", eyebrow: "Down in the porous joints", title: "It reaches where a rinse never does", cleanLabel: "CLEAN!" },
  1054000: { comp: "BeforeAfter", eyebrow: "The moss browns out & dies", beforeLabel: "Black moss", afterLabel: "Real brick color", caption: "killed at the root — stays gone longer" },
  // TRICK 9
  1070000: { px: "pxchap", number: "#9", title: "Trash cans", sub: "that summer smell" },
  1085000: { comp: "MythTruth", myth: "Just hose out the can", truth: "Rinsing only moves the slime — the bacteria stays and the smell returns", mythLabel: "Myth", truthLabel: "Truth" },
  1092000: { px: "pxfoam", eyebrow: "A cup or two of 3% + water", title: "It foams up the sides", cleanLabel: "CLEAN!" },
  1119000: { comp: "BulletCascade", eyebrow: "Same trick also works on", bullets: [{ key: "Recycling bin" }, { key: "The base of a grill" }, { key: "A dog area on the patio" }] },
  // SEGURIDAD
  1136000: { comp: "BigStatReveal", eyebrow: "Concentration matters", value: 3, suffix: "% only", support: "the standard brown bottle — 35% food grade can burn your skin" },
  1153000: { comp: "MythTruth", myth: "Mixing makes it stronger", truth: "Peroxide + vinegar in one bottle makes peracetic acid — irritates skin & lungs", mythLabel: "Myth", truthLabel: "Truth" },
  1169000: { comp: "ChecklistReveal", title: "Safety kit", items: ["Never mix with bleach either", "Gloves + eye protection up high", "Store cool & dark", "If it doesn't fizz, it's flat"], stamp: "SAY IT PLAINLY" },
  1193000: { px: "pxfoam", eyebrow: "The fizz test", title: "No fizz? The bottle's gone flat", cleanLabel: "TOSS IT" },
  1218000: { comp: "PullQuote", quote: "The tricks are for routine cleaning — not for risking a fall.", role: "be smart about it" },
  // CIERRE
  1228000: { px: "pxhero", eyebrow: "A dollar bottle", phrase: "there's *no invoice* in a dollar" },
  1247000: { comp: "BigStatReveal", eyebrow: "A $2 bottle just saved you", prefix: "$", value: 400, suffix: " saved", support: "a $400 roof cleaning — your wallet's going to be fine" },
  1257000: { comp: "CtaCard", eyebrow: "All 9 — exact mixes & soak times", title: "Free printable guide", bullet: "link's down in the description", price: 0, cta: "LINK IN DESCRIPTION" },
  1273000: { comp: "HookCaption", words: [{ text: "Is" }, { text: "this" }, { text: "stuff" }, { text: "ALIVE?", boxed: true }], sub: "if you remember one thing, ask that" },
  1281000: { comp: "HighlightSweep", pre: "", highlight: "Green · black · streaks · moss · mildew", post: " — that's all living.", note: "that's the whole game" },
};

// zona de composición por componente premium (variedad — dónde se apoya el texto)
const ZONE = {
  BigStatReveal: "topLeft", BulletCascade: "left", MythTruth: "topLeft", HighlightSweep: "top",
  FlowSteps: "top", VsDuel: "left", NumberedSteps: "left", BeforeAfter: "top",
  PullQuote: "topLeft", ChecklistReveal: "topLeft", HookCaption: "top", CtaCard: "topLeft",
};

// ── FIX #4 PRIMER MINUTO: clips H3 del avatar/promesa intercalados en el HOOK ────
// Cortes cortos y punchy (2–3.5s) que prometen "cosas locas": el VERTIDO que erupciona
// espuma, el macro del fizz, las rayas de techo cine, señalar el siding. Se inyectan como
// momentos tipo:"hookclip" → NO llenan hasta el próximo (dur corta), el resto lo cubre el
// avatar full. Reusar clips está OK (baraja chica). ms → nombre del clip en public/broll/.
const HOOK_CLIPS = [
  { ms: 14000, src: "pxwash_hook_foam_pour",   seg: 4.5 }, // LA promesa: vierte y erupciona la espuma
  { ms: 24000, src: "pxwash_hook_fizz_macro",  seg: 3.2 }, // macro del fizz vivo
  { ms: 33000, src: "pxwash_hook_roof_dramatic", seg: 3.4 }, // rayas de techo cine
  { ms: 68000, src: "pxwash_hook_point_siding", seg: 3.0 }, // señala el film verde del siding
  { ms: 88000, src: "pxwash_alt_roof_2",     seg: 3.2 }, // zona muerta 78–117: rompe el avatar largo (footage REAL, no repetir el H3)
  { ms: 100000, src: "pxwash_fill_foam_1",   seg: 3.2 }, // re-promesa antes del abanico (foam real; el foam_pour H3 queda solo en 14000)
  { ms: 110000, src: "pxwash_fill_foam_3",   seg: 3.0 }, // último punch antes de LightTrailCards (fizz real; el fizz_macro H3 queda solo en 24000)
];
const HOOK_BOTTLE = { ms: 6500, src: "pxwash_hook_bottle_up", seg: 2.4 }; // botella a cámara, apertura fuerte
HOOK_CLIPS.push(HOOK_BOTTLE);

// ── FIX #6 GOLD #5: en el abanico intro de los 9 la carta #5 sobresale DORADA cuando
// el guion teasea "number five … saved $400". goldCard=4 (0-based) · goldAt = frame local.
const T_NUMBER5 = at("number five is the one", 8); // ~123s
// ms del momento que se ABSORBE en el abanico intro (el BigStat #5 del hook): el tease
// de #5 lo lleva ahora la carta dorada, no un cartel aparte → el abanico respira 13s.
const DROP = new Set([123000]);

// ── FIX #5 TARJETAS AL LADO DEL AVATAR (avatar VISIBLE): ~7 momentos de tips/notas que
// hoy oscurecen todo pasan a TypeCardBeside (lado opuesto, tipeo). Los HÉROES (BigStat,
// MythTruth, VsDuel, LightTrailCards, BottleHero, BeforeAfter, FoamClean, Checklist de
// seguridad crítica) quedan full/centrados. ms → { side, title, lines[] }.
const TYPEBESIDE = {
  60000:   { side: "right", title: "The quote",     lines: ["$240 — one wall", "Just green film", "He didn't know it's alive"] },
  241000:  { side: "right", title: "Reality check", lines: ["That green film", "is NOT dirt", "It's living algae"] },
  625000:  { side: "left",  title: "Honest limits", lines: ["Works: rust stains", "Works: fresh oil", "Not: 10-year-old oil"] },
  813000:  { side: "right", title: "It won't…",     lines: ["Fix a cracked driveway", "Restain your fence", "Repair real damage"] },
  921000:  { side: "left",  title: "The pattern",   lines: ["Kill it first", "THEN finish", "Noticing it yet?"] },
  986000:  { side: "right", title: "Test first",    lines: ["A hidden corner", "Bottom of a cushion", "Check colorfastness"] },
  1119000: { side: "left",  title: "Also works on", lines: ["Recycling bin", "Base of a grill", "Dog patio area"] },
};

// ════════════════════════════════════════════════════════════════════════════
// RE-EDIT INMERSIVO — b-roll real casi CONTINUO bajo la narración; el AVATAR full
// es un ACENTO (aperturas/giros/remates), no el relleno. Baja avatar-full 49%→~28%.
// ════════════════════════════════════════════════════════════════════════════

// ── REEMPLAZO turbo-H3 → footage REAL (rule 3): SOLO los H3 macro (fizz/roof/moss),
//    NUNCA los H3 con el presentador en cuadro (esos son el diferencial y quedan).
//    Keyed por el nombre derivado del clip del plan → asset real verificado.
const CLIP_OVERRIDE = {
  pxwash_quimica_201: "pxwash_fill_moss_1",   // macro de alga/biofilm real
  pxwash_trick1_230:  "pxwash_alt_siding_1",  // film verde en siding real
  pxwash_trick2_355:  "pxwash_alt_deck_2",    // deck gris/verde real
  pxwash_trick3_499:  "pxwash_fill_foam_1",   // fizz sobre superficie real
  pxwash_trick5_648:  "pxwash_alt_roof_1",    // rayas negras de techo real (beat estrella #5)
  pxwash_trick8_1003: "pxwash_alt_pavers_2",  // musgo en juntas real
};

// ── ACENTOS de avatar full: momentos tipo:"avatar" que SOSTIENEN la cara todo el
//    tramo (apertura, giro emocional, remate). El resto de los momentos avatar
//    ceden a b-roll tras un lead corto de cara (FACE_CAP). ms del plan.
const ACCENT = new Set([
  0,       // apertura: botella a cámara
  78000,   // hook: complicidad "the green stuff is alive"
  130000,  // "stick around" — arranca retención
  221000,  // química: remate de sección
  511000,  // trick3: "kill first, then rinse" — el patrón central
  551000,  // trick3: "let that sink in"
  790000,  // trick5: remate honesto del $400
  807000,  // midroll: pivote "pump the brakes"
  1240000, // cierre: misión del canal
  1290000, // cierre: complicidad final
]);
const FACE_CAP = 8.0;    // seg de cara al inicio de un momento avatar NO-acento; luego b-roll
const ACCENT_CAP = 14.0; // seg máx de cara en un acento antes de ceder a b-roll
const CONTENT_FACE = 3.8; // seg de cara al abrir un hueco tras una demo (breve "a cámara" y corte al mundo)
const FILL_MIN = 1.8;    // hueco mínimo (s) que vale la pena rellenar con b-roll
const FILL_LEN = 5.0;    // largo objetivo de cada corte de relleno (respira ~4.5–6s)

// ── POOL de relleno on-topic por sección (clips reales + FOTOS con Ken-Burns).
//    Mezcla acción (manos/espuma/pressure), texturas del problema y las fotos de
//    closeup exacto que el video no tenía. Rotación evita repetir consecutivo.
const isPhoto = (n) => n.startsWith("pxwash_photo_");
const FILL = {
  hook:      ["pxwash_fill_pressure_3", "pxwash_fill_softwash_1", "pxwash_fill_moss_1", "pxwash_alt_roof_1", "pxwash_fill_house_1", "pxwash_fill_foam_2", "pxwash_alt_concrete_1", "pxwash_fill_house_3"],
  quimica:   ["pxwash_fill_foam_2", "pxwash_fill_rinse_1", "pxwash_fill_shrubs_1", "pxwash_fill_rinse_2", "pxwash_fill_shrubs_2", "pxwash_fill_house_2"],
  trick1:    ["pxwash_alt_siding_1", "pxwash_photo_sidingalgae_1", "pxwash_fill_sprayer_1", "pxwash_fill_softwash_1", "pxwash_photo_sidingalgae_2", "pxwash_fill_shrubs_1", "pxwash_fill_foam_1", "pxwash_fill_house_2"],
  trick2:    ["pxwash_alt_deck_2", "pxwash_photo_deckmildew_1", "pxwash_fill_hands_scrub_1", "pxwash_photo_deckmildew_2", "pxwash_fill_foam_3", "pxwash_fill_pressure_3"],
  trick3:    ["pxwash_alt_concrete_1", "pxwash_photo_concretefilm_1", "pxwash_alt_concrete_2", "pxwash_fill_pressure_3", "pxwash_fill_foam_2", "pxwash_fill_rinse_2"],
  trick4:    ["pxwash_alt_rust_1", "pxwash_photo_ruststain_1", "pxwash_alt_oil_1", "pxwash_photo_oilstain_1", "pxwash_fill_pour_1", "pxwash_photo_ruststain_2", "pxwash_fill_hands_scrub_1", "pxwash_fill_foam_1"],
  trick5:    ["pxwash_alt_roof_1", "pxwash_photo_roofstreaks_2", "pxwash_alt_roof_2", "pxwash_fill_ladder_1", "pxwash_fill_sprayer_2", "pxwash_fill_ladder_2", "pxwash_fill_rinse_1"],
  midroll:   ["pxwash_fill_tools_2", "pxwash_fill_house_1", "pxwash_fill_foam_2", "pxwash_fill_sunny_patio_1", "pxwash_fill_house_3", "pxwash_fill_pressure_3", "pxwash_fill_softwash_1", "pxwash_fill_hands_gloves_1"],
  trick6:    ["pxwash_alt_fence_2", "pxwash_photo_fencemildew_1", "pxwash_alt_fence_1", "pxwash_photo_fencemildew_2", "pxwash_fill_sprayer_1", "pxwash_fill_foam_3"],
  trick7:    ["pxwash_alt_cushion_1", "pxwash_photo_cushionmildew_1", "pxwash_alt_awning_1", "pxwash_fill_sunny_patio_1"],
  trick8:    ["pxwash_alt_pavers_2", "pxwash_photo_mossjoints_1", "pxwash_photo_jointsand_1", "pxwash_fill_moss_1", "pxwash_photo_jointsand_2", "pxwash_fill_foam_2", "pxwash_fill_hands_scrub_1"],
  trick9:    ["pxwash_alt_trash_1", "pxwash_photo_bingrime_1", "pxwash_fill_hose_1", "pxwash_photo_bingrime_2", "pxwash_fill_rinse_1"],
  seguridad: ["pxwash_fill_ladder_2", "pxwash_fill_ladder_1", "pxwash_fill_hands_gloves_1", "pxwash_fill_foam_1", "pxwash_fill_house_1"],
  cierre:    ["pxwash_fill_tools_2", "pxwash_fill_sunny_patio_1", "pxwash_fill_house_3", "pxwash_fill_hands_gloves_1"],
};
const SEC_BOUNDS = plan.secciones.map((s) => ({ id: s.id, a: s.msStart / 1000, b: s.msEnd / 1000 }));
const sectionOf = (t) => { for (const s of SEC_BOUNDS) if (t >= s.a && t < s.b) return s.id; return SEC_BOUNDS[SEC_BOUNDS.length - 1].id; };
const _fillCursor = {};
function pickFill(section, avoid) {
  const pool = FILL[section] || FILL.midroll;
  if (_fillCursor[section] == null) _fillCursor[section] = -1;
  for (let k = 0; k < pool.length; k++) {
    _fillCursor[section] = (_fillCursor[section] + 1) % pool.length;
    const cand = pool[_fillCursor[section]];
    if (cand !== avoid) return cand;
  }
  return pool[0];
}

// ── recorrer el plan → momentos ordenados (con su ms, tipo, start real) ─────────
const moments = [];
for (const sec of plan.secciones) {
  for (const m of sec.momentos) {
    if (DROP.has(m.ms)) continue; // absorbido por el abanico dorado
    const t = at(m.dice, 8);
    const start = +(t != null ? t : m.ms / 1000).toFixed(2);
    moments.push({ ...m, section: sec.id, start });
  }
}
// inyectar los clips H3 del hook como momentos propios (start = ms fijo, no hay caption)
for (const h of HOOK_CLIPS) {
  moments.push({ ms: h.ms, tipo: "hookclip", section: "hook", src: h.src, seg: h.seg, start: +(h.ms / 1000).toFixed(2) });
}
moments.sort((a, b) => a.start - b.start || a.ms - b.ms);
// ── FIX #1 CERO DESTELLOS: TILEO 100% CONTIGUO ──────────────────────────────────
// Regla dura: cada plano visible dura EXACTO hasta el próximo momento (dur = hueco) para
// que NUNCA asome el fondo entre planos. Solo cuando el hueco supera HOLDCAP (tramo de
// avatar hablando genuino) el plano se topa y el resto lo cubre el avatar full — y ahí el
// hueco es grande (>1.2s) así que la ventana de avatar entra sin dejar slivers.
// Excepción: los clips H3 del hook son PUNCH cortos (2–3.5s) y ceden a avatar full; si el
// remanente al próximo es chico (<1.2s) se estiran a contiguo para no dejar destello.
const HOLDCAP = 9.0;
for (let i = 0; i < moments.length; i++) {
  const next = i + 1 < moments.length ? moments[i + 1].start : TOTAL;
  const gap = +(next - moments[i].start).toFixed(2);
  const seg = +moments[i].seg || 4;
  // FIX #6: el abanico intro (ms 117000) es SHOWCASE — se sostiene hasta el próximo momento
  // (absorbió el BigStat #5) para que la carta #5 se vuelva DORADA justo en "number five" y
  // respire. Sube el techo a 12s (tope del plan) solo para este plano.
  if (moments[i].tipo === "componente" && moments[i].ms === 117000) {
    moments[i].dur = +Math.max(1.2, Math.min(gap, 12)).toFixed(2);
    continue;
  }
  if (moments[i].tipo === "hookclip") {
    let dur = Math.max(1.6, Math.min(gap, seg));
    if (gap - dur < 1.2) dur = gap; // remanente chico → contiguo (sin sliver de fondo)
    moments[i].dur = +dur.toFixed(2);
  } else if (gap <= HOLDCAP) {
    moments[i].dur = +Math.max(1.2, gap).toFixed(2); // CONTIGUO exacto
  } else {
    // hueco largo → plano al tope y el resto lo cubre el avatar full (cabeza parlante real)
    moments[i].dur = +Math.max(1.2, Math.min(Math.max(seg, 6.5), 7.5)).toFixed(2);
  }
}

// ── construir beats ─────────────────────────────────────────────────────────
const beats = [];
const compCount = {};
let nClip = 0, nImg = 0, nAvatar = 0, nPx = 0, nPrem = 0, nMiss = 0, nHook = 0, nBeside = 0;
for (const m of moments) {
  const dur = m.dur;
  if (m.tipo === "avatar") { nAvatar++; continue; } // sin beat: lo cubre el avatar full
  if (m.tipo === "hookclip") {
    // FIX #4/#7: clip H3 del hook (o footage extra). raw full-bleed, corte punchy.
    const id = `${SLUG}_h3_${Math.round(m.ms / 1000)}`;
    beats.push({ id, start: m.start, dur, kind: "raw", src: `broll/${m.src}.mp4`, hue: "red", darken: 0.06, noSplit: true, trans: 9 });
    nHook++;
    continue;
  }
  if (m.tipo === "clip") {
    const name = `${SLUG}_${m.section}_${Math.round(m.ms / 1000)}`;
    // rule 3: turbo-H3 macro (fizz/roof/moss) → footage REAL más nítido; avatar-H3 intocado.
    const src = CLIP_OVERRIDE[name] || name;
    const ph = isPhoto(src);
    beats.push(ph
      ? { id: name, start: m.start, dur, kind: "raw", src: `img/${src}.png`, hue: "red", darken: 0.05, noSplit: true, fit: "blur", zoom: [1.06, 1.16] }
      : { id: name, start: m.start, dur, kind: "raw", src: `broll/${src}.mp4`, hue: "red", darken: 0.06, noSplit: true });
    nClip++;
    continue;
  }
  if (m.tipo === "imagen") {
    const name = IMG[m.ms];
    if (!name) { console.warn("⚠ imagen sin mapear ms=", m.ms); nMiss++; continue; }
    beats.push({ id: name, start: m.start, dur, kind: "raw", src: `img/${name}.png`, hue: "red", darken: 0.06, noSplit: true, fit: "blur" });
    nImg++;
    continue;
  }
  if (m.tipo === "componente") {
    // FIX #5: momentos de tip/nota → TARJETA AL LADO del avatar (avatar visible), no full.
    const tb = TYPEBESIDE[m.ms];
    if (tb) {
      beats.push({ id: `tb_${Math.round(m.ms / 1000)}`, start: m.start, dur, kind: "typebeside", overlay: true, ...tb });
      nBeside++; compCount.TypeCardBeside = (compCount.TypeCardBeside || 0) + 1;
      continue;
    }
    const p = PROPS[m.ms];
    if (!p) { console.warn("⚠ componente sin props ms=", m.ms, m.kind); nMiss++; continue; }
    if (p.px) {
      const { px, ...props } = p;
      // FIX #6: el abanico intro de los 9 → carta #5 DORADA cuando el guion teasea "#5 = $400".
      if (px === "pxfan" && m.ms === 117000) {
        props.goldCard = 4;
        props.goldAt = Math.max(40, Math.round(((T_NUMBER5 != null ? T_NUMBER5 : 123) - m.start) * 30));
      }
      beats.push({ id: `px_${px}_${Math.round(m.ms / 1000)}`, start: m.start, dur, kind: px, ...props });
      nPx++; compCount[px] = (compCount[px] || 0) + 1;
    } else {
      const { comp, ...props } = p;
      beats.push({ id: `ov_${comp.toLowerCase()}_${Math.round(m.ms / 1000)}`, start: m.start, dur, kind: "premium", overlay: true, comp, theme: THEME, zone: ZONE[comp] || "topLeft", ...props });
      nPrem++; compCount[comp] = (compCount[comp] || 0) + 1;
    }
    continue;
  }
}
beats.sort((a, b) => a.start - b.start);

// ── RE-EDIT INMERSIVO: B-ROLL REAL BAJO CADA TRAMO DE NARRACIÓN ─────────────────
// Recorre la secuencia de momentos y rellena los HUECOS que hoy quedan como avatar
// full con b-roll real on-topic (avatar hidden, la narración sigue). Regla:
//   · momento CONTENIDO (clip/foto/componente) más corto que el hueco al próximo →
//     el remanente se cubre ENTERO con b-roll (nada de cara en medio de una demo).
//   · momento AVATAR → se conserva un lead de cara (FACE_CAP; acentos ACCENT_CAP) y
//     el resto del tramo pasa a b-roll. Así el avatar full queda como ACENTO.
// Cortes 4.5–6s, contiguos (sin slivers), FOTOS con Ken-Burns (fit blur + zoom).
const fillBeats = [];
function addFills(s0, e0, section) {
  const s = +s0.toFixed(2), e = +e0.toFixed(2);
  const L = +(e - s).toFixed(2);
  if (L < FILL_MIN) return;
  const n = Math.max(1, Math.round(L / FILL_LEN));
  const step = +(L / n).toFixed(2);
  let last = null;
  for (let k = 0; k < n; k++) {
    const cs = +(s + k * step).toFixed(2);
    const cd = k === n - 1 ? +(e - cs).toFixed(2) : step;
    if (cd < 1.2) continue;
    const name = pickFill(section, last); last = name;
    fillBeats.push(isPhoto(name)
      ? { id: `fill_${Math.round(cs * 100)}`, start: cs, dur: cd, kind: "raw", src: `img/${name}.png`, hue: "red", darken: 0.05, noSplit: true, fit: "blur", zoom: [1.06, 1.16] }
      : { id: `fill_${Math.round(cs * 100)}`, start: cs, dur: cd, kind: "raw", src: `broll/${name}.mp4`, hue: "red", darken: 0.06, noSplit: true });
  }
}
for (let i = 0; i < moments.length; i++) {
  const m = moments[i];
  const nextStart = i + 1 < moments.length ? moments[i + 1].start : TOTAL;
  if (m.tipo === "avatar") {
    const gap = +(nextStart - m.start).toFixed(2);
    const face = ACCENT.has(m.ms) ? Math.min(gap, ACCENT_CAP) : Math.min(gap, FACE_CAP);
    addFills(m.start + face, nextStart, sectionOf(m.start));
  } else {
    // hueco tras una demo: breve lead de cara (el presentador remata a cámara) y al mundo.
    const end = +(m.start + (m.dur || 0)).toFixed(2);
    const lead = nextStart - end > CONTENT_FACE + FILL_MIN ? CONTENT_FACE : 0;
    if (nextStart - (end + lead) >= FILL_MIN) addFills(end + lead, nextStart, sectionOf(m.start));
  }
}
// id único garantizado
{
  const seen = new Set(beats.map((b) => b.id));
  for (const b of fillBeats) { let id = b.id, k = 1; while (seen.has(id)) id = `${b.id}_${k++}`; b.id = id; seen.add(id); }
}
let nFill = fillBeats.length, nFillPhoto = fillBeats.filter((b) => b.src.startsWith("img/")).length;
beats.push(...fillBeats);
beats.sort((a, b) => a.start - b.start);

// ── FIX #2 GLITCH: transición glitch suave (~0.4s) en los cortes de sección + tras el
// PRIMER clip. Elegante, NO en todos lados. Overlay: no oculta avatar ni cuenta como tile.
const GLITCH_DUR = 0.4;
const glitchAts = [];
// arranque de cada sección (salvo el hook) = el primer beat con start dentro de la sección
{
  const secStart = {};
  for (const m of moments) {
    if (m.tipo === "avatar") continue;
    if (secStart[m.section] == null || m.start < secStart[m.section]) secStart[m.section] = m.start;
  }
  for (const sec of plan.secciones) {
    if (sec.id === "hook") continue;
    const s = secStart[sec.id];
    if (s != null) glitchAts.push(+(s - 0.2).toFixed(2));
  }
  // tras el PRIMER clip real/H3 del video (regla dura del canal)
  const firstClip = beats.find((b) => b.kind === "raw");
  if (firstClip) glitchAts.push(+(firstClip.start + firstClip.dur - 0.2).toFixed(2));
}
let nGlitch = 0;
for (const a0 of [...new Set(glitchAts)].sort((x, y) => x - y)) {
  const a = Math.max(0, a0);
  beats.push({ id: `glitch_${Math.round(a * 100)}`, start: a, dur: GLITCH_DUR, kind: "glitch", overlay: true });
  nGlitch++;
}
beats.sort((a, b) => a.start - b.start);

// beat repetido (mismo id) = error
{
  const seen = new Map();
  for (const b of beats) seen.set(b.id, (seen.get(b.id) || 0) + 1);
  const dups = [...seen.entries()].filter(([, c]) => c > 1);
  if (dups.length) { console.error("✖ BEATS REPETIDOS:", dups.map(([n, c]) => `${n}×${c}`).join(", ")); process.exit(1); }
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, beats }, null, 1));

// ── AVATAR WINDOWS full↔hidden (sin PiP) — HIDDEN bajo cada beat, FULL en los huecos ──
// El avatar cubre TODO lo que no ocupa un beat (clip/imagen/peróxido/premium), incluidos
// los momentos tipo:"avatar" y las colas de narración donde el director no puso visual.
// NOHIDE = overlays que NO ocultan el avatar: la tarjeta al lado (avatar visible) y el
// glitch de transición (velo encima). No participan de las ventanas hidden → el avatar
// queda FULL debajo de ellos.
const NOHIDE = new Set(["typebeside", "glitch"]);
const iv = beats.filter((b) => !NOHIDE.has(b.kind)).map((b) => [b.start, +(b.start + b.dur).toFixed(2)]).sort((a, b) => a[0] - b[0]);
const merged = [];
for (const [s, e] of iv) {
  if (merged.length && s <= merged[merged.length - 1][1] + 0.05) merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
  else merged.push([s, e]);
}
const windows = [];
let cur = 0;
for (const [s, e] of merged) {
  // FIX #1: el avatar full arranca EXACTO donde termina el plano anterior (sin snap a la
  // palabra siguiente) → cero frames de fondo pelado entre un plano y la cara.
  if (s > cur + 0.2) windows.push({ start: +cur.toFixed(2), mode: "full" }); // hueco → avatar
  windows.push({ start: +s.toFixed(2), mode: "hidden" }); // beat → avatar oculto
  cur = e;
}
if (cur < TOTAL - 0.2) windows.push({ start: +cur.toFixed(2), mode: "full" });
if (!windows.length || windows[0].start !== 0) windows.unshift({ start: 0, mode: windows[0]?.mode === "hidden" ? "hidden" : "full" });
// dedup starts iguales
for (let i = windows.length - 1; i > 0; i--) if (windows[i].start === windows[i - 1].start) windows.splice(i, 1);
windows.push({ start: TOTAL, mode: "hidden" });

fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);

const fullS = (() => {
  let s = 0;
  for (let i = 0; i < windows.length - 1; i++) if (windows[i].mode === "full") s += windows[i + 1].start - windows[i].start;
  return Math.round(s);
})();
// ── _pxwash_assets.txt (manifiesto del farm) — TODOS los src usados, 0 faltantes ──
{
  const used = [];
  const seen = new Set();
  for (const b of beats) {
    if (!b.src || seen.has(b.src)) continue;
    seen.add(b.src); used.push(b.src);
    if (/\.(png|jpg|jpeg)$/i.test(b.src)) {
      const blur = b.src.replace(/\.(png|jpg|jpeg)$/i, "_blur.jpg");
      if (fs.existsSync(`public/${blur}`) && !seen.has(blur)) { seen.add(blur); used.push(blur); }
    }
  }
  const missing = used.filter((p) => !fs.existsSync(`public/${p}`));
  fs.writeFileSync(`_${SLUG}_assets.txt`, used.join("\n") + "\n");
  if (missing.length) { console.error(`✖ ASSETS FALTANTES EN DISCO (${missing.length}):`, missing.join(", ")); process.exit(1); }
  console.log(`assets: ${used.length} archivos → _${SLUG}_assets.txt  ·  0 faltantes ✓`);
}

console.log(`beats ${beats.length}  ·  clips ${nClip}  ·  fills ${nFill} (fotos ${nFillPhoto})  ·  hookH3 ${nHook}  ·  imgs ${nImg}  ·  peróxido ${nPx}  ·  premium ${nPrem}  ·  beside ${nBeside}  ·  glitch ${nGlitch}  ·  avatar-momentos ${nAvatar}  ·  sin-mapear ${nMiss}`);
console.log(`dur ${(TOTAL / 60).toFixed(1)}min (${TOTAL}s)  ·  avatar full ${fullS}s (${Math.round(100 * fullS / TOTAL)}%)  ·  windows ${windows.length}`);
console.log("componentes:", JSON.stringify(compCount));
