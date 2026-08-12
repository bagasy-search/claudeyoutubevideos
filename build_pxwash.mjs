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
  186000: { comp: "VsDuel", eyebrow: "Two kinds of bleach", title: "Chlorine vs Oxygen", left: { label: "Chlorine bleach", sub: "harsh, scorches plants, lingers", good: false }, right: { label: "Oxygen bleach", sub: "same kill, breaks down to water + oxygen", good: true } },
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
  389000: { comp: "VsDuel", eyebrow: "On wood", title: "Peroxide vs Chlorine", left: { label: "Chlorine", sub: "bleaches it white & blotchy", good: false }, right: { label: "Peroxide", sub: "brightens, restores the wood", good: true } },
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
  950000: { comp: "VsDuel", eyebrow: "On colored fabric", title: "Oxygen vs Chlorine", left: { label: "Chlorine", sub: "fades navy cushions to sad gray", good: false }, right: { label: "Oxygen bleach", sub: "way safer on color", good: true } },
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

// ── recorrer el plan → momentos ordenados (con su ms, tipo, start real) ─────────
const moments = [];
for (const sec of plan.secciones) {
  for (const m of sec.momentos) {
    const t = at(m.dice, 8);
    const start = +(t != null ? t : m.ms / 1000).toFixed(2);
    moments.push({ ...m, section: sec.id, start });
  }
}
moments.sort((a, b) => a.start - b.start || a.ms - b.ms);
// duración = la que fijó el DIRECTOR (m.seg), clampeada para no pisar el próximo momento.
// Cuando seg < hueco al próximo, ese hueco lo cubre el AVATAR full (presentador hablando).
// Así se respeta el pacing del plan (hook cortísimo, etc.) y ningún plano se congela/estira.
for (let i = 0; i < moments.length; i++) {
  const next = i + 1 < moments.length ? moments[i + 1].start : TOTAL;
  const gap = +(next - moments[i].start).toFixed(2);
  const seg = +moments[i].seg || 4;
  // hold hasta ~7.5s (bajo el techo de 12s; RawShot maneja el anti-congelado). Cuando el
  // hueco al próximo momento supera eso, la cola la cubre el avatar full → menos cabeza
  // parlante que tilear entero, sin planos de 20s ni fondo pelado.
  moments[i].dur = +Math.max(1.2, Math.min(gap, Math.max(seg, 6.5), 7.5)).toFixed(2);
}

// ── construir beats ─────────────────────────────────────────────────────────
const beats = [];
const compCount = {};
let nClip = 0, nImg = 0, nAvatar = 0, nPx = 0, nPrem = 0, nMiss = 0;
for (const m of moments) {
  const dur = m.dur;
  if (m.tipo === "avatar") { nAvatar++; continue; } // sin beat: lo cubre el avatar full
  if (m.tipo === "clip") {
    const name = `${SLUG}_${m.section}_${Math.round(m.ms / 1000)}`;
    beats.push({ id: name, start: m.start, dur, kind: "raw", src: `broll/${name}.mp4`, hue: "red", darken: 0.06, noSplit: true });
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
    const p = PROPS[m.ms];
    if (!p) { console.warn("⚠ componente sin props ms=", m.ms, m.kind); nMiss++; continue; }
    if (p.px) {
      const { px, ...props } = p;
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
const snapWord = (tt) => { for (const c of caps) if (c.startMs / 1000 >= tt - 0.05) return c.startMs / 1000; return tt; };
const iv = beats.map((b) => [b.start, +(b.start + b.dur).toFixed(2)]).sort((a, b) => a[0] - b[0]);
const merged = [];
for (const [s, e] of iv) {
  if (merged.length && s <= merged[merged.length - 1][1] + 0.05) merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
  else merged.push([s, e]);
}
const windows = [];
let cur = 0;
for (const [s, e] of merged) {
  if (s > cur + 0.2) windows.push({ start: +snapWord(cur).toFixed(2), mode: "full" }); // hueco → avatar
  windows.push({ start: +s.toFixed(2), mode: "hidden" }); // beat → avatar oculto
  cur = e;
}
if (cur < TOTAL - 0.2) windows.push({ start: +snapWord(cur).toFixed(2), mode: "full" });
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
console.log(`beats ${beats.length}  ·  clips ${nClip}  ·  imgs ${nImg}  ·  peróxido ${nPx}  ·  premium ${nPrem}  ·  avatar-momentos ${nAvatar}  ·  sin-mapear ${nMiss}`);
console.log(`dur ${(TOTAL / 60).toFixed(1)}min (${TOTAL}s)  ·  avatar full ${fullS}s (${Math.round(100 * fullS / TOTAL)}%)  ·  windows ${windows.length}`);
console.log("componentes:", JSON.stringify(compCount));
