// gen_dale1_plan.mjs — DIRECTOR → _v3/dale1_plan.json  (canal Dale Kessler, NARRADOR PURO)
//
//   node gen_dale1_plan.mjs        # momentos + assets en disco -> plan
//   node build_dale1.mjs           # plan -> cues + Main + index + _dale1_assets.txt
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

const SLUG = "dale3";
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
  { frag: "a retired machinist named Walt", comp: "BigStat",
    props: { value: "$9,000", unit: "IN GOLD, IN THE HOUSE", caption: "Two men were inside Walt's house for six minutes. He lost a television. He did not lose one coin.", tone: "brass" } },
  { frag: "Walt lost a television and a laptop", comp: "SplitVs",
    props: { leftLabel: "RUTH, BLYMYER AVENUE", leftValue: "A DISH ON THE DRESSER", rightLabel: "WALT, TWO STREETS OVER", rightValue: "A CAN IN THE GARAGE",
      verdict: "Same street. Same spring. Same list of houses. One of them still has it." } },
  { frag: "My name is Dale Kessler", comp: "BigStat",
    props: { value: "4,000", unit: "HOUSES, THE MORNING AFTER", caption: "Thirty one years of walking in with a clipboard and a camera to write down what was gone.", tone: "brass" } },
  { frag: "Twenty five of them.", comp: "CheckCard",
    props: { kicker: "WHAT THIS LIST IS", title: "Twenty five spots I never had to photograph", items: [
      { text: "Not one of them costs a dollar" },
      { text: "Every one came from a house that kept it" },
      { text: "Each one paired with the obvious spot right next to it" }] } },
  { frag: "It is the first thing that gets pulled", comp: "WorstSpots",   // ⛔ NO anclar en "Number one.": el CheckCard anterior lo absorbe por tiempo de lectura
    props: { kicker: "WHAT I PHOTOGRAPHED, OVER AND OVER", title: "The four I could draw from memory", spots: [
      { label: "The hollow book" }, { label: "The sock drawer" }, { label: "Under the mattress" }, { label: "The toilet tank" }] } },
  { frag: "Number four.", comp: "MythTruth",
    props: { mythLabel: "WHAT PEOPLE ASSUME", truthLabel: "WHAT I WROTE DOWN",
      kicker: "THE FOURTH POCKET", myth: "A good hiding place is one he cannot find.",
      truth: "A good hiding place is one that costs him more seconds than he has. He is running a search, and a search that stops paying stops running." } },
  { frag: "Number eight.", comp: "CheckCard",
    props: { kicker: "THE WORD IS NOT HIDDEN", title: "Unremarkable", items: [
      { text: "It already lives there" },
      { text: "It already looks used" },
      { text: "Nothing about it is newer than the room" }] } },
  { frag: "Now we are in the room where my job actually happened", comp: "RouteFlow",
    props: { kicker: "THE SAME ROUTE, FOUR THOUSAND TIMES", title: "It is the first room, and very often the only room", steps: [
      { label: "Front door" }, { label: "Master bedroom" }, { label: "The dresser" }, { label: "The closet shelf" }, { label: "Under the mattress" }] } },
  { frag: "Number twelve.", comp: "RayChecklist",
    props: { kicker: "WHY THE CHILD'S ROOM IS SKIPPED", title: "Nothing in it is worth carrying out", items: [
      { text: "He is an adult looking where an adult would put something" },
      { text: "Twenty identical soft objects is not a search, it is a job" },
      { text: "In thirty one years I wrote a door frame and a window screen" }] } },
  { frag: "Number fourteen.", comp: "MythTruth",
    props: { mythLabel: "WHAT THE MOVIES TAUGHT EVERYBODY", truthLabel: "WHAT WAS ON THE BATH MAT",
      kicker: "THE TANK ON THE BACK OF THE TOILET", myth: "Nobody would think to look in there.",
      truth: "Everybody raised on the same films looks there first. In Galion I photographed the lid on the mat and a wet bag beside it with nothing in it." } },
  { frag: "Number seventeen.", comp: "SplitVs",
    props: { leftLabel: "A SAFE YOU CAN LIFT", leftValue: "GONE WHOLE", rightLabel: "A TIN OF BUTTONS", rightValue: "STILL THERE",
      verdict: "One has a handle on it. The other rattles, weighs nothing and is worth nothing." } },
  { frag: "Number nineteen.", comp: "BigStat",
    props: { value: "$1,100", unit: "NINETEEN YEARS, THIRD CAN FROM THE LEFT", caption: "It weighed exactly what a can of screws weighs. That is the whole trick.", tone: "brass" } },
  { frag: "It is arithmetic.", comp: "WorstSpots",
    props: { kicker: "WHAT THE POLICY QUIETLY CAPS", title: "The sub-limits nobody reads", spots: [
      { label: "Jewellery" }, { label: "Cash" }, { label: "Coins" }, { label: "Tools" }] } },
  { frag: "And photograph what stays.", comp: "CheckCard",
    props: { kicker: "BEFORE ANYTHING HAPPENS", title: "The four minutes that write your own claim", items: [
      { text: "Every piece on a plain surface, with a ruler beside it" },
      { text: "The appraisal, if you have one" },
      { text: "The photographs kept somewhere that is not the house" }] } },
  { frag: "The point of that box was to be the moment the search ended", comp: "PullQuote",
    props: { quote: "A man in my bedroom has got one question in his head. So I answer it for him, in the first ten seconds, with something he can put in his pocket.",
      attrib: "Walt · Sturges Avenue, 2011" } },
  { frag: "So if you do one thing off this list", comp: "ProcessChips",
    props: { kicker: "THE DECOY, IN THREE MOVES", title: "Answer the question before he asks it", steps: [
      { title: "Findable" }, { title: "Cheap" }, { title: "At the front of the room" }, { title: "The real thing three rooms away" }] } },
  { frag: "is a written guide about exactly that", comp: "RayCta",
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
