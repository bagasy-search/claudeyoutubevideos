// plan_mdtank.mjs — DIRECTOR §0 para "Dump HYDROGEN PEROXIDE into your Toilet and WATCH WHAT HAPPENS"
// (canal Mike Dalton, EN). Genera `_v3/mdtank_plan.json` = { beats, totalMs, overlays }.
//
//   node plan_mdtank.mjs
//
// Reglas que impone este planner (video-pipeline + skill agua-oxigenada):
//   · TODO anclado al ms REAL de las captions de Whisper (nunca por matemática).
//   · El avatar es el FONDO GARANTIZADO: lo que no cubre un clip/componente queda `avatar full`.
//   · Cobertura real por clip: cov = min(slot, duración_real_del_clip − 0,1 s). Nunca se estira.
//   · PACING ULTRA DINÁMICO 0,6–5 s (pedido explícito del creador para este canal; pisa la regla 1
//     de video-pipeline). Lo que se evita es el METRÓNOMO: la varianza manda, no la velocidad.
//   · Cada clip hero se ancla a SU PROPIA frase (regla 8: una query por frase, no por sección).
import fs from "fs";

const W = JSON.parse(fs.readFileSync("public/captions_mdtank.json", "utf8").replace(/^﻿/, ""));
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
  { k: "hook",    a: 0 },
  { k: "story",   a: at("and i have to tell you how i found") },
  { k: "give",    a: at("okay let me give you the whole thing") },
  { k: "fizz",    a: at("alright if you're still here") },
  { k: "map",     a: at("so let's read the map") },
  { k: "quiet",   a: at("so here's how to read the quiet ones") },
  { k: "tank",    a: at("now the tank because that is where") },
  { k: "timer",   a: at("which brings me to the fizz") },
  { k: "honesty", a: at("okay honesty section") },
  { k: "safety",  a: at("now the safety part") },
  { k: "close",   a: at("here's what i want you to take out of this") }
];
for (let i = 0; i < SEC.length; i++) SEC[i].b = i + 1 < SEC.length ? SEC[i + 1].a : END + 300;
const secOf = (ms) => (SEC.find((s) => ms >= s.a && ms < s.b) || SEC[SEC.length - 1]).k;

// ── LOS 52 CLIPS HERO, cada uno anclado a SU frase ───────────────────────────────────────────
// (el orden es el del guion; `dur` es lo que dura el plano principal de ese clip)
const CLIPS = [
  ["mdtank_h01_fizzwatch",   "that fizzing you're about to see", 0, 3.2],
  ["mdtank_h02_pourring",    "pour some in the bowl", 0, 2.6],
  ["mdtank_h03_cabinet",     "i was cleaning out the cabinet", 0, 3.0],
  ["mdtank_h04_oldbottle",   "there's a brown bottle back there", 0, 3.4],
  ["mdtank_h05_dumpbottle",  "so i dumped it in the toilet", 0, 2.8],
  ["mdtank_h06_lightswitch", "went to bed", 0, 1.8],
  ["mdtank_h07_morninglook", "next morning i go in there", 0, 3.0],
  ["mdtank_h08_ringbefore",  "that came back every single week", 0, 2.6],
  ["mdtank_h09_pumice",      "a pumice stone in there like an idiot", 0, 2.4],
  ["mdtank_h10_threebottles","blue stuff the gel that clings", 0, 2.2],
  ["mdtank_h11_customerbath","other people's bathrooms", 0, 3.2],
  ["mdtank_h12_valve",       "there's a little oval valve", 0, 3.0],
  ["mdtank_h13_flushhold",   "now flush and hold the handle down", 0, 2.4],
  ["mdtank_h14_drybowl",     "the bowl empties and it does not refill", 0, 3.0],
  ["mdtank_h15_pourtank",    "pour a couple cups in the tank", 0, 3.2],
  ["mdtank_h16_squirtrim",   "into the little holes under the rim", 0, 3.4],
  ["mdtank_h17_watchwait",   "don't walk away", 0, 2.6],
  ["mdtank_h18_brushrim",    "brush up under the rim", 0, 2.2],
  ["mdtank_h19_brushtank",   "brush the tank walls", 0, 1.8],
  ["mdtank_h20_valveon",     "open the valve let it fill", 0, 2.0],
  ["mdtank_h21_cutfizz",     "you know how peroxide foams on a cut", 0, 3.6],
  ["mdtank_h22_bottleup",    "you already own that test", 0, 3.0],
  ["mdtank_h23_saucertest",  "on a colony", 0, 2.8],
  ["mdtank_h24_sinkdrain",   "that foam is the oxygen coming off", 0, 3.0],
  ["mdtank_h25_phonerim",    "get down there with your phone light", 0, 3.4],
  ["mdtank_h26_lidoff",      "take the lid off", 0, 2.8],
  ["mdtank_h27_lidfloor",    "set it flat on the floor", 0, 2.6],
  ["mdtank_h28_tankwater",   "look at the water then the walls", 0, 3.0],
  ["mdtank_h29_boltheads",   "around the bolt heads", 0, 2.6],
  ["mdtank_h30_flapper",     "that lifts when you flush", 0, 3.0],
  ["mdtank_h31_noreaction",  "and it just lies there flat", 0, 3.0],
  ["mdtank_h32_fingernail",  "you can catch a fingernail on", 0, 2.8],
  ["mdtank_h33_vinegarjug",  "white vinegar or a proper descaler", 0, 3.0],
  ["mdtank_h34_ironstreak",  "running down from where the water comes in", 0, 3.2],
  ["mdtank_h35_gloveslime",  "black or dark purple slime", 0, 3.2],
  ["mdtank_h36_slimeclose",  "handfuls of dark gelatinous goo", 0, 3.0],
  ["mdtank_h37_plunger",     "he plunged it", 0, 2.4],
  ["mdtank_h38_tanklook",    "nobody looks in the tank", 0, 3.0],
  ["mdtank_h39_bluetablet",  "the blue tablet", 0, 3.0],
  ["mdtank_h40_deadflapper", "the flapper is rubber", 0, 2.6],
  ["mdtank_h41_washers",     "replacing the rubber washers", 0, 3.0],
  ["mdtank_h42_sticker",     "a sticker inside the tank", 0, 3.2],
  ["mdtank_h43_glassbubbles","a little oxygen that goes into the air", 0, 3.0],
  ["mdtank_h44_fizzstop",    "the fizzing stops when the peroxide is used up", 0, 3.4],
  ["mdtank_h45_calendar",    "do it once more in a week", 0, 3.0],
  ["mdtank_h46_brushpress",  "the brush takes the body off", 0, 2.8],
  ["mdtank_h47_gloves",      "anybody promising a no scrubbing version", 0, 2.8],
  ["mdtank_h48_nomix",       "never bleach and peroxide together", 0, 3.2],
  ["mdtank_h49_windowsill",  "on the windowsill since last summer", 0, 3.2],
  ["mdtank_h50_markerbrush", "write toilet on the handle", 0, 3.0],
  ["mdtank_h51_tapesheet",   "tape it inside the cabinet door", 0, 3.0],
  ["mdtank_h52_donelook",    "ask it tonight", 0, 3.4]
];

// ── LÁMINAS = PÁGINAS DE LA GUÍA (componente MdGuidePage) ────────────────────────────────────
// Se presentan como páginas del material de la descripción, con tag de esquina. El guion las
// nombra una vez en voz ("those are pages out of the guide I keep in the description").
const LAM = [
  { ph: "so here's how to read the quiet ones", dur: 5.4, src: "img/mdtank_lam_fizztest.jpg", tag: "PAGE 01 · THE COMPLETE METHOD", title: "The fizz test" },
  { ph: "the rim is the factory", dur: 5.0, src: "img/mdtank_lam_rimcut.jpg", tag: "PAGE 04 · THE COMPLETE METHOD", title: "Under the rim" },
  { ph: "look at the water then the walls", dur: 4.6, src: "img/mdtank_lam_tankmap.jpg", tag: "PAGE 05 · THE COMPLETE METHOD", title: "Inside the tank" },
  { ph: "minutes come back", dur: 5.2, src: "img/mdtank_lam_routine.jpg", tag: "PAGE 02 · THE COMPLETE METHOD", title: "The twenty minute routine" },
  { ph: "one of the fastest enzymes", dur: 4.8, src: "img/mdtank_lam_catalase.jpg", tag: "PAGE 03 · THE COMPLETE METHOD", title: "Why it foams" },
  { ph: "chlorine sitting on rubber", dur: 4.6, src: "img/mdtank_lam_tablet.jpg", tag: "PAGE 06 · THE COMPLETE METHOD", title: "What the tablet does" },
  { ph: "that's not a disappointment", dur: 4.8, src: "img/mdtank_lam_timer.jpg", tag: "PAGE 07 · THE COMPLETE METHOD", title: "The fizz is a timer" },
  { ph: "acid plus bleach makes chlorine gas", dur: 5.2, src: "img/mdtank_lam_nevermix.jpg", tag: "PAGE 08 · THE COMPLETE METHOD", title: "Never mix" }
];

// ── COMPONENTES CURADOS del kit del canal (shapes REALES, ver skill agua-oxigenada §normProps) ──
const CUR = [
  { ph: "that fizzing you're about to see", dur: 3.0, comp: "HookCaption", props: { words: [{ text: "The foam" }, { text: "is not" }, { text: "CLEANING", boxed: true }], sub: "it is something defending itself" } },
  { ph: "which means the foam is a map", dur: 3.4, comp: "HookCaption", props: { words: [{ text: "The foam" }, { text: "is a" }, { text: "MAP", boxed: true }], sub: "where it fizzes, something is alive" } },
  { ph: "the brown bottle the dollar one", dur: 3.6, comp: "BottleHero", props: { eyebrow: "THE WHOLE TOOLKIT", phrase: "*3%* hydrogen peroxide, the dollar bottle" } },
  { ph: "million molecules of peroxide", dur: 3.2, comp: "BigStatReveal", props: { value: 40, suffix: "M", eyebrow: "CATALASE, PER SECOND", label: "molecules torn apart by one enzyme" } },
  { ph: "it's called the catalase test", dur: 4.0, comp: "MythTruth", props: { myth: "The foam means it is working", truth: "The foam means something is alive there", mythLabel: "WHAT WE ASSUME", truthLabel: "WHAT IT IS" } },
  { ph: "so let's read the map", dur: 4.4, comp: "LightTrailCards", props: { eyebrow: "READING THE MAP", number: "5", phrase: "five places|*five different* answers", cards: 5, goldCard: 3 } },
  { ph: "rock has no immune system", dur: 4.2, comp: "MythTruth", props: { myth: "Peroxide did not work on my ring", truth: "That ring was never alive", mythLabel: "MYTH", truthLabel: "TRUTH" } },
  { ph: "two treatments a week apart", dur: 4.0, comp: "HighlightSweep", props: { pre: "Two treatments", highlight: "a week apart", post: "beat one left overnight", note: "nobody sells you the second one" } },
  { ph: "in tank cleaners void the warranty", dur: 3.4, comp: "BigStatReveal", props: { value: 3, prefix: "every ", suffix: " months", eyebrow: "ONE VIEWER, BECAUSE OF A TABLET", label: "replacing the rubber washers" } },
  { ph: "flush first empty bowl", dur: 4.2, comp: "BulletCascade", props: { bullets: [{ key: "Flush first" }, { key: "Empty bowl" }, { key: "One thing at a time" }], eyebrow: "BEFORE YOU POUR" } },
  { ph: "that's a diagnosis for a dollar", dur: 4.0, comp: "HookCaption", props: { words: [{ text: "A diagnosis" }, { text: "for a" }, { text: "DOLLAR", boxed: true }], sub: "the only product that answers you" } }
];

// ── CHAPTER CARDS (los cortes de sección) ────────────────────────────────────────────────────
const CHAP = [
  { ph: "okay let me give you the whole thing", dur: 3.8, number: "1", title: "THE WHOLE FIX", sub: "in ninety seconds, then you can go" },
  { ph: "alright if you're still here", dur: 3.8, number: "2", title: "WHY IT FOAMS", sub: "an enzyme two billion years old" },
  { ph: "so here's how to read the quiet ones", dur: 3.8, number: "3", title: "WHAT DOESN'T FIZZ", sub: "the half that saves you money" },
  { ph: "now the tank because that is where", dur: 3.8, number: "4", title: "INSIDE THE TANK", sub: "the room nobody opens" },
  { ph: "now the safety part", dur: 3.8, number: "5", title: "SAFETY", sub: "this is where people get hurt" }
];

// ── MOVIMIENTOS premium (4-6 actos encadenados) ──────────────────────────────────────────────
const MOV = [
  { ph: "hydrogen peroxide is water with one extra oxygen", comp: "MovOxygen", dur: 22 },
  { ph: "and the manufacturers already told you", comp: "MovTank", dur: 17 },
  { ph: "never mix peroxide and vinegar", comp: "MovSafety", dur: 20 },
  { ph: "your toilet has been trying to tell you", comp: "MovClose", dur: 15 }
];

// ── CTA con QR (cierre) ──────────────────────────────────────────────────────────────────────
const CTA = { ph: "point your phone camera at it", dur: 6.0, comp: "MdQrCta", props: { image: "img/mdtank_qrcard.jpg", eyebrow: "THE REST OF THE PAGES", title: "Point your camera", bullet: "Amounts · dilution chart · never-mix chart · room by room", cta: "also first in the description" } };

// ══════════════════════════════════════════════════════════════════════════════════════════════
// Montaje del timeline
// ══════════════════════════════════════════════════════════════════════════════════════════════
const CLIP_DUR_S = 5.04, SRC_FPS = 24;
const placed = [];          // {ms_in, ms_out, tipo, ...}
const push = (o) => { if (o.ms_in != null && o.ms_out > o.ms_in) placed.push(o); };

// 1) componentes curados + chapter cards + láminas + movimientos + CTA (tienen prioridad de ancla)
for (const c of CUR) {
  const ms = at(c.ph); if (ms == null) continue;
  push({ ms_in: ms, ms_out: ms + c.dur * 1000, tipo: "componente", componente: c.comp, sec: secOf(ms), avatar: "hidden", props: c.props });
}
for (const c of CHAP) {
  const ms = at(c.ph); if (ms == null) continue;
  push({ ms_in: ms, ms_out: ms + c.dur * 1000, tipo: "componente", componente: "ChapterTrailCard", sec: secOf(ms), avatar: "hidden", props: { number: c.number, title: c.title, sub: c.sub } });
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

// 2) los 52 clips hero en su ancla
const clipAnchor = [];
for (const [name, ph, occ, dur] of CLIPS) {
  const ms = at(ph, occ);
  if (ms == null) { continue; }
  clipAnchor.push({ name, ms });
  push({ ms_in: ms, ms_out: ms + Math.min(dur, CLIP_DUR_S - 0.1) * 1000, tipo: "clip", clip: name, startFrom: 0, sec: secOf(ms), avatar: "hidden", flash: false });
}
clipAnchor.sort((a, b) => a.ms - b.ms);

// 3) resolver solapes por PRIORIDAD (movimiento > componente > clip): el de menor prioridad cede
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

// 4) RELLENO: los huecos se reparten entre avatar full y ráfagas de clip (pacing 0,6-5 s con varianza)
//    El clip de relleno es SIEMPRE el hero más cercano en el guion (contexto), entrando por otro
//    punto del metraje (`startFrom`) para que el reuso no se note.

// ── POOL POR SECCIÓN (2ª tanda de clips) ─────────────────────────────────────────────────────
// ⛔ Por qué existe: en la v1 el relleno agarraba "el clip anclado más cercano" y terminaba
// repitiendo el MISMO plano hasta 15 veces (el density_gate lo avisó y lo dejé pasar). agnes es
// gratis: la respuesta correcta es GENERAR MÁS, no reciclar. Estos 72 clips son microacciones
// extra de la MISMA sección, así que el contexto sigue pegando frase a frase.
const POOL = {
  hook: ["mdtank_h53_mapfinger", "mdtank_h125_scrubwrong", "mdtank_h127_lookup", "mdtank_h149_bowlpoint",
         "mdtank_h150_foamlean"],
  story: ["mdtank_h54_shelfclear", "mdtank_h55_acidtell", "mdtank_h128_expiredlabel",
          "mdtank_h130_gelsqueeze", "mdtank_h131_ringweek", "mdtank_h132_notepad"],
  give: ["mdtank_h56_watchwait", "mdtank_h133_valvefind", "mdtank_h134_tankfill",
         "mdtank_h136_pourcup", "mdtank_h137_kneelfloor"],
  fizz: ["mdtank_h57_bandaid", "mdtank_h58_cottonball", "mdtank_h59_bottlecap", "mdtank_h60_dropperdrop",
         "mdtank_h61_smearfoam", "mdtank_h62_bubbleclose", "mdtank_h63_handwash", "mdtank_h64_clockmorning",
         "mdtank_h66_spoonfoam", "mdtank_h67_bottleshelf", "mdtank_h68_thumbtest",
         "mdtank_h69_lightbulb"],
  map: ["mdtank_h70_ringclose", "mdtank_h73_chainflapper", "mdtank_h143_ringtrace", "mdtank_h144_rimlight",
        "mdtank_h145_lidedge", "mdtank_h146_tankinside", "mdtank_h147_boltclose", "mdtank_h148_flapperlift"],
  quiet: ["mdtank_h74_chalkyclose", "mdtank_h75_vinegarpour", "mdtank_h76_descaler", "mdtank_h77_rustclose",
          "mdtank_h78_sheenwater", "mdtank_h79_slimebucket", "mdtank_h80_flushfail", "mdtank_h81_towelwipe",
          "mdtank_h82_wellsink"],
  tank: ["mdtank_h83_tanklidon", "mdtank_h84_darktank", "mdtank_h85_tabletjar", "mdtank_h86_fillvalve",
         "mdtank_h87_diaphragm", "mdtank_h88_sealring", "mdtank_h89_night3am", "mdtank_h90_toolbag",
         "mdtank_h91_tankbolts", "mdtank_h92_handintank", "mdtank_h93_flapperseat", "mdtank_h94_tabletdrop",
         "mdtank_h95_stickerlean"],
  timer: ["mdtank_h96_glasswater", "mdtank_h97_vinegarbottle", "mdtank_h99_fullbowlpour",
          "mdtank_h100_dryringdose", "mdtank_h101_brushbreak", "mdtank_h102_weeklater"],
  honesty: ["mdtank_h105_slimewipe", "mdtank_h106_beforeafter", "mdtank_h107_scrub40",
            "mdtank_h108_strongbottle", "mdtank_h109_glovehand", "mdtank_h110_shrugcamera", "mdtank_h111_brushrinse",
            "mdtank_h112_bowlclean"],
  safety: ["mdtank_h113_gelbottle", "mdtank_h114_bleachpour", "mdtank_h115_windowopen", "mdtank_h116_cappedbottle",
           "mdtank_h117_cabinetline", "mdtank_h118_calendarmonth", "mdtank_h119_brushcaddy", "mdtank_h120_septiclid",
           "mdtank_h121_labelcheck"],
  close: ["mdtank_h124_lightsout", "mdtank_h138_shelfrow",
          "mdtank_h139_bottleset", "mdtank_h140_pointdown", "mdtank_h141_doorframe", "mdtank_h142_lastlook"],
};
const useCount = {};
// El relleno tira del POOL DE SU SECCIÓN y elige el MENOS USADO (nunca el anterior). Sólo si la
// sección se quedó sin pool cae al clip anclado más cercano.
let lastFill = null;
const nearestClip = (ms) => {
  const pool = POOL[secOf(ms)] || [];
  const cand = pool.filter((n) => n !== lastFill);
  if (cand.length) {
    cand.sort((a, b) => (useCount[a] || 0) - (useCount[b] || 0));
    const pick = cand[0];
    useCount[pick] = (useCount[pick] || 0) + 1;
    lastFill = pick;
    return pick;
  }
  const rank = clipAnchor.map((c) => ({ n: c.name, d: Math.abs(c.ms - ms) })).sort((a, b) => a.d - b.d);
  const pick = (rank.find((r) => r.n !== lastFill) || rank[0] || {}).n || null;
  lastFill = pick;
  return pick;
};
const reuse = {};
const burstPlan = [
  // varianza a propósito: nada de metrónomo. Hay ráfagas de 0,7 s y planos sostenidos de 4,9 s.
  [1.1, 0.8, 2.4], [2.0, 4.6], [0.9, 1.6, 1.0, 2.2], [3.0, 1.2, 0.8], [1.4, 4.9],
  [0.7, 0.9, 1.3, 0.8], [2.8, 1.2, 3.6], [1.8, 4.2], [1.0, 3.4, 0.9], [1.5, 0.8, 1.9, 4.4],
  [4.8], [0.8, 0.7, 1.0, 2.6], [3.2, 1.1], [2.2, 0.9, 4.0], [1.3, 2.8, 0.7]
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
  // arranque en avatar (que se lo vea hablar) y después ráfaga
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
    // respiro de avatar entre ráfagas, con varianza (no en cada corte: sería un metrónomo)
    if (t < g1 - 900 && (pi % 2 === 0)) {
      const br = 600 + ((bi * 373 + pi * 211) % 1500);
      const br2 = Math.min(br, g1 - t);
      if (br2 > 300) { filled.push({ ms_in: t, ms_out: t + br2, tipo: "avatar", sec: secOf(t), avatar: "full" }); t += br2; }
    }
  }
  if (t < g1) filled.push({ ms_in: t, ms_out: g1, tipo: "avatar", sec: secOf(t), avatar: "full" });
}

const beats = [...keep, ...filled].sort((a, b) => a.ms_in - b.ms_in);

// ── COMPUERTA: 0 instantes sin cobertura (simulación cada 100 ms) ────────────────────────────
let holes = 0;
for (let t = 0; t < END; t += 100) {
  const b = beats.find((x) => t >= x.ms_in && t < x.ms_out);
  if (!b) holes++;
}

// ── métricas de pacing ───────────────────────────────────────────────────────────────────────
const visuals = beats.filter((b) => b.tipo !== "avatar").map((b) => (b.ms_out - b.ms_in) / 1000).sort((a, b) => a - b);
const q = (p) => visuals[Math.floor(visuals.length * p)] || 0;
const tipos = {};
for (const b of beats) tipos[b.tipo] = (tipos[b.tipo] || 0) + 1;
const avatarMs = beats.filter((b) => b.tipo === "avatar").reduce((s, b) => s + (b.ms_out - b.ms_in), 0);

fs.writeFileSync("_v3/mdtank_plan.json", JSON.stringify({ beats, totalMs: END + 1500, overlays: [] }, null, 1));

console.log(`beats ${beats.length} · ${JSON.stringify(tipos)}`);
console.log(`clips distintos ${new Set(beats.filter((b) => b.tipo === "clip").map((b) => b.clip)).size}/52 · componentes ${new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente)).size} distintos · movimientos ${new Set(beats.filter((b) => b.tipo === "movimiento").map((b) => b.componente)).size}`);
console.log(`pacing visuales: mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · p90 ${q(0.9).toFixed(2)}s · ≥5s ${(visuals.filter((v) => v >= 5).length / visuals.length * 100).toFixed(0)}%`);
console.log(`avatar full ${(avatarMs / END * 100).toFixed(0)}% · HUECOS ${holes}`);
const useByClip = {};
for (const b of beats) if (b.tipo === "clip") useByClip[b.clip] = (useByClip[b.clip] || 0) + 1;
const vv = Object.values(useByClip).sort((a, b) => b - a);
console.log(`reuso por clip: max ${vv[0]} · mediana ${vv[Math.floor(vv.length / 2)]} · promedio ${(vv.reduce((a, b) => a + b, 0) / vv.length).toFixed(1)}`);
if (nulls.length) { console.log(`\n⚠️ ${nulls.length} anclas NULAS:`); [...new Set(nulls)].forEach((p) => console.log("   " + p)); }
