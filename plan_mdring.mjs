// plan_mdring.mjs — DIRECTOR §0 para "Recurring Toilet Ring — Top 3 Solutions tested — Problem Solved"
// (canal Mike Dalton, EN). Genera `_v3/mdring_plan.json` = { beats, totalMs, overlays }.
//
//   node plan_mdring.mjs
//
// Clon del director de `mdtank` con las reglas del canal:
//   · TODO anclado al ms REAL de las captions de Whisper (nunca por matemática).
//   · El avatar es el FONDO GARANTIZADO. Acá es COMPLETO (19:34, dice el guion entero) → sin costura.
//   · cov = min(slot, duración_real_del_clip − 0,1 s). El i2v dura 5,04 s → techo útil 4,94 s.
//   · PACING ULTRA DINÁMICO 0,6–5 s con VARIANZA (pedido del creador; pisa la regla 1 del pipeline).
//   · Una query por FRASE: cada uno de los 70 clips hero está anclado a SU propia frase.
import fs from "fs";

const W = JSON.parse(fs.readFileSync("public/captions_mdring.json", "utf8").replace(/^﻿/, ""));
const N = W.length;
const END = W[N - 1].endMs;
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const nulls = [];

function at(phrase, occ = 0) {
  const toks = phrase.toLowerCase().split(" ").map(norm).filter(Boolean);
  let seen = 0;
  for (let i = 0; i <= N - toks.length; i++) {
    let ok = true;
    for (let j = 0; j < toks.length; j++) if (norm(W[i + j].text) !== toks[j]) { ok = false; break; }
    if (ok) { if (seen++ === occ) return W[i].startMs; }
  }
  nulls.push(phrase);
  return null;
}

// ── SECCIONES ────────────────────────────────────────────────────────────────────────────────
const SEC = [
  { k: "hook",     a: 0 },
  { k: "shield",   a: at("now hear the rest") },
  { k: "test",     a: at("okay that's the rare one") },
  { k: "give",     a: at("but before any of that") },
  { k: "method",   a: at("why i started counting days") },
  { k: "pits",     a: at("and on day one i did something") },
  { k: "shore",    a: at("and one more thing about the shape of it") },
  { k: "bleach",   a: at("all right contender one") },
  { k: "acid",     a: at("contender two the acid side") },
  { k: "perox",    a: at("contender 3") },
  { k: "dilution", a: at("i took bleach and i gave it the peroxide treatment") },
  { k: "curve",    a: at("okay now the part you actually came here for") },
  { k: "fix",      a: at("which is the fix") },
  { k: "reseed",   a: at("two more things reseeding it") },
  { k: "cta",      a: at("now one more because her toilet was worse") },
  { k: "safety",   a: at("all right safety and i'm doing this part straight") },
  { k: "close",    a: at("so that's it bleach nine days") },
];
for (let i = 0; i < SEC.length; i++) SEC[i].b = i + 1 < SEC.length ? SEC[i + 1].a : END + 300;
const secOf = (ms) => (SEC.find((s) => s.a != null && ms >= s.a && ms < s.b) || SEC[0]).k;

// ── LOS 70 CLIPS HERO, cada uno anclado a SU frase (orden del guion) ─────────────────────────
const CLIPS = [
  ["mdring_h01_doorwaylook",     "if the ring in your toilet is dark", 0, 3.2],
  ["mdring_h02_ringcloseup",     "that might not be your water", 0, 2.8],
  ["mdring_h03_fillvalve",       "i changed the fill valve", 0, 2.6],
  ["mdring_h04_flapper",         "changed the flapper", 0, 2.2],
  ["mdring_h05_tookmoney",       "and took his money", 0, 2.8],
  ["mdring_h06_handwash",        "i go to wash my hands", 0, 2.6],
  ["mdring_h07_cleanbowlsurprise","and it's clean", 0, 3.0],
  ["mdring_h08_tubthink",        "and that's where it stopped being a coincidence", 0, 3.2],
  ["mdring_h09_testbox",         "that's a cheap test at the pharmacy", 0, 3.4],
  ["mdring_h10_handsopen",       "i am not diagnosing anybody through a toilet", 0, 3.2],
  ["mdring_h11_bottleup",        "hydrogen peroxide the brown bottle", 0, 3.0],
  ["mdring_h12_shutoffvalve",    "little oval valve", 0, 3.2],
  ["mdring_h13_holdhandle",      "now flush and hold the handle down", 0, 2.6],
  ["mdring_h14_emptybowl",       "the bowl drains and it does not refill", 0, 3.2],
  ["mdring_h15_pouronring",      "pour it right on the ring at the water line", 0, 3.4],
  ["mdring_h16_paperlay",        "lay it flat on the porcelain over the ring", 0, 3.2],
  ["mdring_h17_soakpaper",       "and soak the paper", 0, 2.6],
  ["mdring_h18_timer",           "20 minutes minimum", 0, 2.4],
  ["mdring_h19_brushring",       "brush water back on", 0, 2.4],
  ["mdring_h20_wateron",         "water back on", 0, 2.0],
  ["mdring_h21_flushtwice",      "flush twice", 0, 2.2],
  ["mdring_h22_weeklysplash",    "half as much two minutes no paper", 0, 3.0],
  ["mdring_h23_bluetape",        "taped a piece of blue tape to the floor", 0, 3.2],
  ["mdring_h24_phoneonmark",     "to stand my phone on", 0, 2.6],
  ["mdring_h25_calendar",        "started writing numbers on a calendar", 0, 3.0],
  ["mdring_h26_standlook",       "standing there like a normal person", 0, 2.8],
  ["mdring_h27_headinbowl",      "got my head down in there with a flashlight", 0, 4.0],
  ["mdring_h28_magnifier",       "and a magnifying glass", 0, 3.0],
  ["mdring_h29_fingertip",       "the bowl was pitted", 0, 3.4],
  ["mdring_h30_papertowel",      "little craters", 0, 2.6],
  ["mdring_h31_oldtoilet",       "the heavy kind at your grandmother's house", 0, 3.2],
  ["mdring_h32_storetoilet",     "from the big orange store", 0, 3.0],
  ["mdring_h33_dockpiling",      "think about a dock piling", 0, 3.6],
  ["mdring_h34_bleachpour",      "bleach and the blue tablet together", 0, 3.0],
  ["mdring_h35_bleachwatch",     "four five minutes", 0, 2.6],
  ["mdring_h36_bluetablet",      "and the tablet was worse than the bottle", 0, 3.0],
  ["mdring_h37_lidoff",          "a sticker inside the tank", 0, 2.8],
  ["mdring_h38_stickerintank",   "the reason you've never read it", 0, 3.0],
  ["mdring_h39_furryflapper",    "the sealing edge was soft", 0, 3.2],
  ["mdring_h40_boxwarning",      "prints it in capitals on the box", 0, 2.8],
  ["mdring_h41_scratchcrust",    "hard white chalky buildup", 0, 3.0],
  ["mdring_h42_gelunderrim",     "your thick clinging gel cleaners", 0, 3.0],
  ["mdring_h43_vinegarpour",     "vinegar for the mild stuff", 0, 2.6],
  ["mdring_h44_pumicehold",      "and now the pumice stone", 0, 3.0],
  ["mdring_h45_pumicescrub",     "i put a pumice stone on my 11 day toilet", 0, 3.2],
  ["mdring_h46_pumiceregret",    "i gave it more pits", 0, 3.0],
  ["mdring_h47_foamtest",        "foams up white and busy", 0, 3.4],
  ["mdring_h48_nofoam",          "just sits there wet", 0, 3.0],
  ["mdring_h49_bleachpoultice",  "straight onto the dry ring", 0, 3.2],
  ["mdring_h50_cupoverfullbowl", "into a bowl with water in it", 0, 3.4],
  ["mdring_h51_pointfullbowl",   "a gallon and a half of water", 0, 3.2],
  ["mdring_h52_calendarmarks",   "that's what i was measuring for four months", 0, 3.0],
  ["mdring_h53_doorwaysatisfied","hasn't had a ring in five months", 0, 3.0],
  ["mdring_h54_spraywaterline",  "two squirts at the water line", 0, 2.8],
  ["mdring_h55_spraybottleontank","spray bottle of plain white vinegar on the tank", 0, 3.2],
  ["mdring_h56_brushshake",      "so shake it out", 0, 2.6],
  ["mdring_h57_brushunderseat",  "clamp it under the seat to drip", 0, 2.8],
  ["mdring_h58_brushcup",        "down in the cup itself", 0, 3.0],
  ["mdring_h59_rimholes",        "squirt peroxide straight up into those holes", 0, 3.4],
  ["mdring_h60_phonescan",       "point your phone camera at it", 0, 3.2],
  ["mdring_h61_printedpages",    "the exact products in the exact order", 0, 3.0],
  ["mdring_h62_photoonphone",    "she sent me a photo at 11 weeks", 0, 3.2],
  ["mdring_h63_ceramiccoat",     "a ceramic glass coating", 0, 3.4],
  ["mdring_h64_nevermix",        "never mix bleach with any acid cleaner", 0, 3.2],
  ["mdring_h65_flushbetween",    "flush in between", 0, 2.6],
  ["mdring_h66_brownvsclear",    "keep it in the brown bottle it came in", 0, 3.2],
  ["mdring_h67_gloves",          "gloves crack a window", 0, 2.0],
  ["mdring_h68_windowfan",       "crack a window or run the fan", 0, 2.6],
  ["mdring_h69_valvefinal",      "go shut your water off", 0, 3.0],
  ["mdring_h70_wipehands",       "thanks bye", 0, 3.0],
];

// ── LÁMINAS = PÁGINAS DE LA GUÍA (MdGuidePage, con tag de esquina) ───────────────────────────
const LAM = [
  { ph: "and here's how you find out in 10 seconds", dur: 5.4, src: "img/mdring_lam_ringtest.jpg", tag: "PAGE 01 · THE COMPLETE METHOD", title: "The ten second test" },
  { ph: "and then seven days later you do it again", dur: 5.2, src: "img/mdring_lam_routine.jpg", tag: "PAGE 02 · THE COMPLETE METHOD", title: "The routine" },
  { ph: "you're not cleaning a surface", dur: 5.0, src: "img/mdring_lam_pits.jpg", tag: "PAGE 03 · THE COMPLETE METHOD", title: "Why yours comes back" },
  { ph: "your ring is a shoreline", dur: 4.8, src: "img/mdring_lam_shoreline.jpg", tag: "PAGE 04 · THE COMPLETE METHOD", title: "Why it is a ring" },
  { ph: "worst number in the whole test", dur: 4.8, src: "img/mdring_lam_daysback.jpg", tag: "PAGE 05 · THE COMPLETE METHOD", title: "Days until it comes back" },
  { ph: "toilet became an 8 day toilet", dur: 5.0, src: "img/mdring_lam_pumice.jpg", tag: "PAGE 06 · THE COMPLETE METHOD", title: "What pumice costs" },
  { ph: "it was never the product", dur: 5.2, src: "img/mdring_lam_dilution.jpg", tag: "PAGE 07 · THE COMPLETE METHOD", title: "You watered it down" },
  { ph: "got built in the last two days", dur: 5.4, src: "img/mdring_lam_curve.jpg", tag: "PAGE 08 · THE COMPLETE METHOD", title: "It did not come back overnight" },
  { ph: "do not store peroxide mixed with vinegar", dur: 5.2, src: "img/mdring_lam_nevermix.jpg", tag: "PAGE 09 · THE COMPLETE METHOD", title: "Never mix" },
];

// ── COMPONENTES CURADOS del kit (shapes REALES — skill agua-oxigenada §normProps) ────────────
// ⛔ TODOS con microcopy en INGLÉS: los defaults del kit están en español.
const CUR = [
  { ph: "that might not be your water", dur: 3.2, comp: "HookCaption", props: { words: [{ text: "That might" }, { text: "not be your" }, { text: "WATER", boxed: true }], sub: "that might be a person" } },
  { ph: "the brown bottle the dollar one", dur: 3.6, comp: "BottleHero", props: { eyebrow: "THE WHOLE TOOLKIT", phrase: "*3%* hydrogen peroxide, the dollar bottle" } },
  { ph: "they all clean it", dur: 3.4, comp: "MythTruth", props: { myth: "Which one cleans it best", truth: "Which one is still gone in three weeks", mythLabel: "THE TEST EVERYBODY DOES", truthLabel: "THE TEST THAT MATTERS" } },
  { ph: "porcelain isn't porcelain", dur: 3.4, comp: "HookCaption", props: { words: [{ text: "The glaze" }, { text: "is" }, { text: "GLASS", boxed: true }], sub: "and yours is full of craters" } },
  { ph: "round two nine days", dur: 3.2, comp: "BigStatReveal", props: { value: 9, suffix: " days", eyebrow: "BLEACH, POURED INTO A FULL BOWL", support: "worst number in the whole test" } },
  { ph: "tablets void the warranty", dur: 3.6, comp: "HighlightSweep", props: { pre: "In-tank tablets", highlight: "void the warranty", post: "on the flush valve", note: "the sticker is inside the tank, so you never read it" } },
  { ph: "bleach does not dissolve mineral", dur: 3.6, comp: "MythTruth", props: { myth: "More bleach will get the hard white stuff", truth: "Bleach only changes its colour", mythLabel: "MYTH", truthLabel: "TRUTH" } },
  { ph: "you cannot put glaze back on", dur: 3.4, comp: "HookCaption", props: { words: [{ text: "You cannot" }, { text: "put glaze" }, { text: "BACK ON", boxed: true }], sub: "a scratched bowl stains faster forever" } },
  { ph: "bleach went from 9 to 19", dur: 3.6, comp: "VsDuel", props: { left: { label: "POURED IN", sub: "9 days" }, right: { label: "WATER OFF", sub: "19 days", good: true }, eyebrow: "SAME BLEACH. SAME TOILET.", title: "It was never the product" } },
  { ph: "they double", dur: 3.2, comp: "BigStatReveal", props: { value: 90, suffix: "%", eyebrow: "OF THE RING", support: "is built in the last two days" } },
  { ph: "the fix is smaller not bigger", dur: 4.0, comp: "NumberedSteps", props: { eyebrow: "THE MAINTENANCE DOSE", title: "The dose that keeps it gone", steps: [{ title: "Half a cup", sub: "at the waterline" }, { title: "Once a week", sub: "on a bowl that looks fine" }, { title: "Two minutes", sub: "water stays on" }] } },
  { ph: "two more things reseeding it", dur: 4.0, comp: "BulletCascade", props: { eyebrow: "WHAT PUTS IT BACK", bullets: [{ key: "The brush" }, { key: "Its closed cup" }, { key: "The holes under the rim" }] } },
  { ph: "three percent the brown bottle from the drug store", dur: 4.0, comp: "ChecklistReveal", props: { kicker: "SAFETY", title: "The three that matter", stamp: "3% ONLY", items: ["3% only, not 35%, not food grade", "Keep it in the brown bottle", "Gloves, and crack a window"] } },
];

// ── CHAPTER CARDS ────────────────────────────────────────────────────────────────────────────
// ⛔ `number` SIEMPRE STRING: ChapterTrailCard hace number.match() y un number crudo mata el chunk.
const CHAP = [
  { ph: "okay that's the rare one", dur: 3.8, number: "1", title: "THE TEST", sub: "three toilets, a phone and a calendar" },
  { ph: "all right contender one", dur: 3.8, number: "2", title: "BLEACH & THE TABLET", sub: "fastest to look clean" },
  { ph: "contender two the acid side", dur: 3.8, number: "3", title: "ACID & PUMICE", sub: "right tool, wrong problem" },
  { ph: "contender 3", dur: 3.8, number: "4", title: "PEROXIDE", sub: "last place on day one" },
  { ph: "okay now the part you actually came here for", dur: 3.8, number: "5", title: "WHY IT COMES BACK", sub: "it never left" },
  { ph: "all right safety and i'm doing this part straight", dur: 3.8, number: "6", title: "SAFETY", sub: "this is where people get hurt" },
];

// ── MOVIMIENTOS premium propios (4-6 actos encadenados, src/mdring/) ─────────────────────────
const MOV = [
  { ph: "i tested which one is still gone three weeks later", comp: "MovVerdict", dur: 32 },
  { ph: "not the part that matters", comp: "MovPits", dur: 40 },
  { ph: "why is it a ring", comp: "MovShoreline", dur: 30 },
  { ph: "when you pour a cup of anything", comp: "MovDilution", dur: 36 },
  { ph: "your ring is a colony", comp: "MovCurve", dur: 38 },
  { ph: "separate plumbers told her the same thing", comp: "MovCta", dur: 26 },
  { ph: "never mix bleach with ammonia", comp: "MovSafety", dur: 28 },
];

// ── CTA con QR ───────────────────────────────────────────────────────────────────────────────
const CTA = { ph: "there's a qr code on the screen right now", dur: 7.0, comp: "MdQrCta", props: { image: "img/mdring_qrcard.jpg", eyebrow: "THE REST OF THE PAGES", title: "Point your camera", bullet: "Exact products · exact order · dilution chart · never-mix chart", cta: "it opens by itself — nothing to type" } };

// ══════════════════════════════════════════════════════════════════════════════════════════════
// Montaje del timeline
// ══════════════════════════════════════════════════════════════════════════════════════════════
const CLIP_DUR_S = 5.04, SRC_FPS = 24;
const placed = [];
const push = (o) => { if (o.ms_in != null && o.ms_out > o.ms_in) placed.push(o); };

for (const c of CUR) {
  const ms = at(c.ph); if (ms == null) continue;
  push({ ms_in: ms, ms_out: ms + c.dur * 1000, tipo: "componente", componente: c.comp, sec: secOf(ms), avatar: "hidden", props: c.props });
}
for (const c of CHAP) {
  const ms = at(c.ph); if (ms == null) continue;
  push({ ms_in: ms, ms_out: ms + c.dur * 1000, tipo: "componente", componente: "ChapterTrailCard", sec: secOf(ms), avatar: "hidden", props: { number: String(c.number), title: c.title, sub: c.sub } });
}
for (const l of LAM) {
  const ms = at(l.ph); if (ms == null) continue;
  push({ ms_in: ms, ms_out: ms + l.dur * 1000, tipo: "componente", componente: "MdGuidePage", sec: secOf(ms), avatar: "hidden", props: { src: l.src, tag: l.tag, title: l.title } });
}
for (const m of MOV) {
  const ms = at(m.ph); if (ms == null) continue;
  push({ ms_in: ms, ms_out: ms + m.dur * 1000, tipo: "movimiento", componente: m.comp, sec: secOf(ms), avatar: "hidden" });
}
{
  const ms = at(CTA.ph);
  if (ms != null) push({ ms_in: ms, ms_out: ms + CTA.dur * 1000, tipo: "componente", componente: CTA.comp, sec: secOf(ms), avatar: "hidden", props: CTA.props });
}

// los 70 clips hero en su ancla
const clipAnchor = [];
for (const [name, ph, occ, dur] of CLIPS) {
  const ms = at(ph, occ);
  if (ms == null) continue;
  if (!fs.existsSync("public/broll/" + name + ".mp4")) { console.log("  (sin clip en disco, salteo) " + name); continue; }
  clipAnchor.push({ name, ms });
  push({ ms_in: ms, ms_out: ms + Math.min(dur, CLIP_DUR_S - 0.1) * 1000, tipo: "clip", clip: name, startFrom: 0, sec: secOf(ms), avatar: "hidden", flash: false });
}
clipAnchor.sort((a, b) => a.ms - b.ms);

// resolver solapes por PRIORIDAD (movimiento > componente > clip)
const PRI = { movimiento: 3, componente: 2, clip: 1 };
placed.sort((a, b) => a.ms_in - b.ms_in || PRI[b.tipo] - PRI[a.tipo]);
const keep = [];
for (const b of placed) {
  const last = keep[keep.length - 1];
  if (last && b.ms_in < last.ms_out) {
    if (PRI[b.tipo] > PRI[last.tipo]) { last.ms_out = b.ms_in; if (last.ms_out - last.ms_in < 500) keep.pop(); }
    else { b.ms_in = last.ms_out; }
  }
  if (b.ms_out - b.ms_in >= 500) keep.push(b);
}

// RELLENO con ráfagas de clip + respiros de avatar
let lastFill = null;
const nearestClip = (ms) => {
  const rank = clipAnchor.map((c) => ({ n: c.name, d: Math.abs(c.ms - ms) })).sort((a, b) => a.d - b.d);
  const pick = rank.find((r) => r.n !== lastFill) || rank[0];
  lastFill = pick ? pick.n : null;
  return pick ? pick.n : null;
};
const reuse = {};
const burstPlan = [
  [1.1, 0.8, 2.4], [2.0, 4.6], [0.9, 1.6, 1.0, 2.2], [3.0, 1.2, 0.8], [1.4, 4.9],
  [0.7, 0.9, 1.3, 0.8], [2.8, 1.2, 3.6], [1.8, 4.2], [1.0, 3.4, 0.9], [1.5, 0.8, 1.9, 4.4],
  [4.8], [0.8, 0.7, 1.0, 2.6], [3.2, 1.1], [2.2, 0.9, 4.0], [1.3, 2.8, 0.7],
];
let bi = 0;
const filled = [];
keep.sort((a, b) => a.ms_in - b.ms_in);
let cursor = 0;
const GAPS = [];
for (const b of keep) { if (b.ms_in > cursor) GAPS.push([cursor, b.ms_in]); cursor = Math.max(cursor, b.ms_out); }
if (cursor < END + 200) GAPS.push([cursor, END + 200]);

for (const [g0, g1] of GAPS) {
  let t = g0;
  const gap = g1 - g0;
  if (gap < 900) { filled.push({ ms_in: g0, ms_out: g1, tipo: "avatar", sec: secOf(g0), avatar: "full" }); continue; }
  const head = Math.min(gap * 0.26, 2100);
  filled.push({ ms_in: t, ms_out: t + head, tipo: "avatar", sec: secOf(t), avatar: "full" });
  t += head;
  let plan = burstPlan[bi++ % burstPlan.length];
  let pi = 0;
  while (t < g1 - 300) {
    const d = plan[pi++];
    if (d === undefined) { plan = burstPlan[bi++ % burstPlan.length]; pi = 0; continue; }
    const name = nearestClip(t);
    if (!name) break;
    const dur = Math.min(d, (g1 - t) / 1000, CLIP_DUR_S - 0.1);
    if (dur < 0.6) break;
    const k = (reuse[name] = (reuse[name] || 0) + 1);
    const maxStart = Math.max(0, Math.floor((CLIP_DUR_S - dur) * SRC_FPS) - 2);
    const startFrom = maxStart > 0 ? (k * 29) % maxStart : 0;
    filled.push({ ms_in: t, ms_out: t + dur * 1000, tipo: "clip", clip: name, startFrom, sec: secOf(t), avatar: "hidden", flash: dur <= 1.2 });
    lastFill = name;
    t += dur * 1000;
    if (t < g1 - 900 && (pi % 2 === 0)) {
      const br = 600 + ((bi * 373 + pi * 211) % 1500);
      const br2 = Math.min(br, g1 - t);
      if (br2 > 300) { filled.push({ ms_in: t, ms_out: t + br2, tipo: "avatar", sec: secOf(t), avatar: "full" }); t += br2; }
    }
  }
  if (t < g1) filled.push({ ms_in: t, ms_out: g1, tipo: "avatar", sec: secOf(t), avatar: "full" });
}

const beats = [...keep, ...filled].sort((a, b) => a.ms_in - b.ms_in);

// ── COMPUERTA: 0 instantes sin cobertura ─────────────────────────────────────────────────────
let holes = 0;
for (let t = 0; t < END; t += 100) {
  const b = beats.find((x) => t >= x.ms_in && t < x.ms_out);
  if (!b) holes++;
}

const visuals = beats.filter((b) => b.tipo !== "avatar").map((b) => (b.ms_out - b.ms_in) / 1000).sort((a, b) => a - b);
const q = (p) => visuals[Math.floor(visuals.length * p)] || 0;
const tipos = {};
for (const b of beats) tipos[b.tipo] = (tipos[b.tipo] || 0) + 1;
const avatarMs = beats.filter((b) => b.tipo === "avatar").reduce((s, b) => s + (b.ms_out - b.ms_in), 0);

fs.writeFileSync("_v3/mdring_plan.json", JSON.stringify({ beats, totalMs: END + 1500, overlays: [] }, null, 1));

console.log(`beats ${beats.length} · ${JSON.stringify(tipos)}`);
console.log(`clips distintos ${new Set(beats.filter((b) => b.tipo === "clip").map((b) => b.clip)).size}/${CLIPS.length} · componentes ${new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente)).size} distintos · movimientos ${new Set(beats.filter((b) => b.tipo === "movimiento").map((b) => b.componente)).size}/7`);
console.log(`pacing visuales: mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · p90 ${q(0.9).toFixed(2)}s · ≥5s ${(visuals.filter((v) => v >= 5).length / visuals.length * 100).toFixed(0)}%`);
console.log(`avatar full ${(avatarMs / END * 100).toFixed(0)}% · HUECOS ${holes} · total ${(END / 60000).toFixed(2)} min`);
if (nulls.length) { console.log(`\n⚠️ ${nulls.length} anclas NULAS:`); [...new Set(nulls)].forEach((p) => console.log("   " + p)); }
