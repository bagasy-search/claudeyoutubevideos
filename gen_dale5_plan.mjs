// gen_dale5_plan.mjs — DIRECTOR → _v3/dale5_plan.json  (canal Dale Kessler, NARRADOR PURO)
//
//   node gen_dale5_plan.mjs        # momentos + assets en disco -> plan
//   node build_dale5.mjs           # plan -> cues + Main + index + _dale5_assets.txt
//
// ⛔ Sin avatar NO hay fondo garantizado: cada momento DEBE tener asset o queda pantalla plana.
//    El build aborta con cobertura <98%.
// ⛔ Los componentes van como cue BASE (pantalla completa) y SIEMPRE con `bed` = la foto de ese
//    mismo momento, para que el marco de 60px no muestre fondo liso.
// ⛔ TIEMPO DE LECTURA: el piso de un componente sale del TEXTO, no del slot vecino
//    (2,8s + 0,28s por palabra más allá de 3, tope 13s). Los momentos que caen adentro se ABSORBEN.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "dale5";
const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const durDe = (rel) => {
  try { return parseFloat(execFileSync(FFPROBE, ["-v","error","-show_entries","format=duration","-of","csv=p=0",
    path.join("public", rel)], { encoding: "utf8" }).trim()) || 0; } catch { return 0; }
};
const existe = (rel) => fs.existsSync(path.join("public", rel));

const MOM = JSON.parse(fs.readFileSync(`_v3/${SLUG}_moments.json`, "utf8").replace(/^\uFEFF/, ""));
const WAV_S = durDe(`${SLUG}.wav`);
const TOTAL_S = Math.max(MOM[MOM.length - 1].t + MOM[MOM.length - 1].dur, WAV_S);

// ── COMPONENTES: anclados por FRASE, no por índice a mano ────────────────────────────────────────
const buscar = (frag) => {
  const k = MOM.findIndex((m) => m.txt.toLowerCase().includes(frag.toLowerCase()));
  if (k < 0) console.warn(`⚠ no encontré la frase: "${frag.slice(0, 50)}"`);
  return k;
};
const COMPS = [
  { frag: "Two piles of money", comp: "SplitVs",
    props: { leftLabel: "CAROL, THE BEDROOM", leftValue: "$6,000 IN JEWELRY, GONE", rightLabel: "THE LAUNDRY ROOM", rightValue: "$3,100 IN CASH, ALL THERE",
      verdict: "One house. Eleven minutes. The only difference was which room it was sitting in." } },
  { frag: "in every income bracket", comp: "BigStat",
    props: { value: "4,000", unit: "FILES, ONE ROOM", caption: "The master bedroom is where the loss was. Not usually. Every category, every income bracket, every town.", tone: "brass" } },
  { frag: "you start seeing a route", comp: "RouteFlow",
    props: { kicker: "THE SAME ROUTE, FOUR THOUSAND TIMES", title: "You stop seeing bad luck and you start seeing a route", steps: [
      { label: "Front door" }, { label: "Past the front room" }, { label: "Up the stairs" }, { label: "Master bedroom" }, { label: "The dresser" }] } },
  { frag: "It is arithmetic", comp: "MythTruth",
    props: { kicker: "THE DRAWER FACE DOWN ON THE CARPET",
      myth: "Somebody was in a rage in here.",
      truth: "Searching a drawer of folded clothes takes forty seconds. Turning it over takes two. It is not rage, it is arithmetic." } },
  { frag: "converting a stack into a layer", comp: "SplitVs",
    props: { leftLabel: "A STACK", leftValue: "HAS TO BE SEARCHED", rightLabel: "A LAYER", rightValue: "ONLY HAS TO BE LOOKED AT",
      verdict: "He is not destroying your room. He is converting one into the other." } },
  { frag: "Documents. Medication.", comp: "WorstSpots",
    props: { kicker: "WHY THAT ROOM AND NOT THE FRONT ROOM", title: "Five questions inside twelve square feet", spots: [
      { label: "Jewelry" }, { label: "Cash" }, { label: "Documents" }, { label: "Medication" }, { label: "Firearms" }] } },
  { frag: "He is not clever", comp: "PullQuote",
    props: { quote: "He does not know your house. He knows houses. And so do I, which is why I knew what I was about to photograph before I got to the top of the stairs.",
      attrib: "Dale Kessler · thirty one years, four thousand files" } },
  { frag: "Now count what is actually in that", comp: "RouteFlow",
    props: { kicker: "NINETY SECONDS, IN THE ORDER I PHOTOGRAPHED IT", title: "Five moves, and not one of them is a decision", steps: [
      { label: "Nightstand" }, { label: "Dresser top" }, { label: "The drawers" }, { label: "Closet shelf" }, { label: "The bed corner" }] } },
  { frag: "the shelf above the coats in the closet", comp: "WorstSpots",
    props: { kicker: "WHAT I PHOTOGRAPHED UNTIL I COULD DRAW IT", title: "The five I would retire from the language", spots: [
      { label: "The jewelry box" }, { label: "The sock drawer" }, { label: "Under the mattress" }, { label: "The nightstand" }, { label: "The closet shelf" }] } },
  { frag: "they were already there", comp: "ProcessChips",
    props: { kicker: "WHY ANYTHING SURVIVED THAT ROOM", title: "Never because it was clever", steps: [
      { title: "Boring" }, { title: "Heavy" }, { title: "Already there" }] } },
  { frag: "quietly caps", comp: "MythTruth",
    props: { kicker: "THE PAGE IN THE MIDDLE NOBODY READS",
      myth: "My contents limit is a big number, so I am covered.",
      truth: "None of that number is available for the pile on the bedroom carpet. Cash, jewelry, coins and firearms each sit under a cap of their own." } },
  { frag: "no record of a single one of them", comp: "BigStat",
    props: { value: "31", unit: "PIECES, NOT ONE PHOTOGRAPH", caption: "Myrtle Avenue, Willard, 2007. The policy paid the special limit. It was the correct payment. That is what makes it hard.", tone: "danger" } },
  { frag: "convert an argument into a document", comp: "RayChecklist",
    props: { kicker: "FORTY MINUTES, ONCE", title: "Photograph that room, not the house", items: [
      { text: "Every piece on a plain towel with a ruler beside it" },
      { text: "The paper inside the box the watch came in" },
      { text: "The inside of the band where the date is engraved" },
      { text: "The photographs kept somewhere that is not the house" }] } },
  { frag: "Write the three numbers down", comp: "CheckCard",
    props: { kicker: "TWO SENTENCES TO YOUR AGENT", title: "Ask, then write it down", items: [
      { text: "What is my special limit on jewelry, cash and firearms" },
      { text: "What would it cost to schedule the three I would be upset about" },
      { text: "In thirty one years I never had a scheduled claim go badly" }] } },
  { frag: "one room is all he is going to get", comp: "SplitVs",
    props: { leftLabel: "ALL IN ONE ROOM", leftValue: "NINETY SECONDS PAYS", rightLabel: "SPREAD ACROSS THE HOUSE", rightValue: "NINETY SECONDS PAYS NOTHING",
      verdict: "Not hiding better. Spreading out. He budgeted for one room." } },
  { frag: "that is my brother Ray", comp: "RayCta",
    props: { eyebrow: "WRITTEN WITH MY BROTHER RAY", title: "The Thousand Dollar Afternoon",
      sub: "What your policy actually pays after a break-in · the sub-limits nobody reads · the 11 p.m. phone call · the letter that gets your money back",
      domain: "raykessler.vercel.app", showQr: false }, overlay: true },
];

// ── BEATS ────────────────────────────────────────────────────────────────────────────────────────
const CLIP_DIR = `broll/${SLUG}`;
const beats = [];
const compAt = new Map();
for (const c of COMPS) { const k = buscar(c.frag); if (k >= 0) compAt.set(k, c); }

const palabras = (p) => Object.values(p).flatMap((v) =>
  typeof v === "string" ? v.split(/\s+/) : Array.isArray(v) ? v.flatMap((o) => String(Object.values(o)[0]).split(/\s+/)) : []).length;

const overlaysOut = [];
let absorbidos = 0;
for (let i = 0; i < MOM.length; i++) {
  const m = MOM[i];
  if (m.__skip) { absorbidos++; continue; }
  const img = `img/${SLUG}_${String(m.i).padStart(3, "0")}.jpg`;
  const clip = `${CLIP_DIR}/${SLUG}_${String(m.i).padStart(3, "0")}.mp4`;
  const c = compAt.get(i);

  if (c && c.overlay) {
    // ⛔ RayCta y cia. estan hechos para ir ENCIMA de metraje. Como cue BASE quedan solos sobre el
    //    fondo de marca => 13 s casi negros (medido). Van a overlays y el momento conserva su plano.
    const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3));
    overlaysOut.push({ componente: c.comp, props: c.props,
      ms_in: Math.round(m.t * 1000), ms_out: Math.round((m.t + Math.max(m.dur, piso)) * 1000) });
    compAt.delete(i);
  }
  if (c && !c.overlay) {
    // TIEMPO DE LECTURA: piso por texto; absorbe los momentos siguientes que caigan adentro.
    const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3));
    let out = m.t + Math.max(m.dur, piso);
    for (let j = i + 1; j < MOM.length && MOM[j].t < out; j++) { MOM[j].__skip = true; }
    const sig = MOM.find((x) => x.t >= out && !x.__skip);
    if (sig) out = Math.max(out, sig.t);   // ESTIRA hasta el próximo beat real (recortar deja hueco)
    beats.push({ tipo: "componente", ms_in: Math.round(m.t * 1000), ms_out: Math.round(out * 1000),
      componente: c.comp, props: (() => { const q = { ...c.props }; const nb = q.__nobed; delete q.__nobed; return nb ? q : { ...q, bed: existe(img) ? img : undefined }; })() });
    continue;
  }

  const ms_in = Math.round(m.t * 1000);
  const ms_out = Math.round((m.t + m.dur) * 1000);
  const cd = existe(clip) ? durDe(clip) : 0;
  if (cd > 0.8) {
    // clip normal si entra; a 0,5x cuando el momento es largo (el creador lo pidió explícito)
    if (m.dur <= cd - 0.15) beats.push({ tipo: "clip", ms_in, ms_out, clip: `${SLUG}/${SLUG}_${String(m.i).padStart(3, "0")}` });
    else beats.push({ tipo: "clipslow", ms_in, ms_out, rate: Math.min(1, Math.max(0.45, (cd - 0.15) / m.dur)),
      clip: `${SLUG}/${SLUG}_${String(m.i).padStart(3, "0")}` });
  } else {
    beats.push({ tipo: "imagen", ms_in, ms_out, imagen: `${SLUG}_${String(m.i).padStart(3, "0")}` });
  }
}

// ── COMPUERTA DE COBERTURA: sin avatar, todo hueco es pantalla plana. Estirar el vecino de la izquierda.
beats.sort((a, b) => a.ms_in - b.ms_in);
const FIN = Math.round((TOTAL_S + 1.2) * 1000);
for (let i = 0; i < beats.length; i++) {
  const sig = i + 1 < beats.length ? beats[i + 1].ms_in : FIN;
  if (beats[i].ms_out < sig) beats[i].ms_out = sig;               // cero huecos por construcción
}
const plan = { slug: SLUG, totalMs: Math.round(TOTAL_S * 1000), beats, overlays: overlaysOut };
fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify(plan, null, 1));

const n = (t) => beats.filter((b) => b.tipo === t).length;
console.log(`plan: ${beats.length} beats · clip ${n("clip")} · clipslow ${n("clipslow")} · imagen ${n("imagen")} · componente ${n("componente")} (absorbidos ${absorbidos})`);
console.log(`overlays: ${overlaysOut.length}`);
console.log(`componentes distintos: ${new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente)).size}`);
console.log(`total ${(TOTAL_S / 60).toFixed(2)} min · wav ${(WAV_S / 60).toFixed(2)} min`);
