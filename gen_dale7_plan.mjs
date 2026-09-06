// gen_dale7_plan.mjs — DIRECTOR → _v3/dale7_plan.json  (canal Dale Kessler, NARRADOR PURO)
//
//   node gen_dale7_plan.mjs        # momentos + assets en disco -> plan
//   node build_dale7.mjs           # plan -> cues + Main + index + _dale7_assets.txt
//
// ⛔ Sin avatar NO hay fondo garantizado: cada momento DEBE tener asset o queda pantalla plana.
//    El build aborta con cobertura <98%.
// ⛔ El CTA (RayCta) va en overlays[], NUNCA como cue base: no dibuja fondo propio -> 13 s de negro.
// ⛔ TIEMPO DE LECTURA: el piso de un componente sale del TEXTO, no del slot vecino
//    (2,8s + 0,28s por palabra más allá de 3, tope 13s). Los momentos que caen adentro se ABSORBEN.
// ⛔ NUEVO EN dale7: compuerta que ABORTA si un componente absorbe el momento ancla de OTRO
//    componente. En dale3 eso se resolvía a mano con un comentario; acá lo caza el script.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "dale7";
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
  { frag: "three thousand six hundred dollars on a monitored system", comp: "BigStat",
    props: { value: "$9,400", unit: "CLAIM, ON A HOUSE WITH A $3,600 SYSTEM", caption: "The entry point on my report was the door from the garage. It was not forced. There was nothing on it to photograph.", tone: "danger" } },
  { frag: "I had a habit problem", comp: "SplitVs",
    props: { leftLabel: "HAROLD AND IVA, SANDUSKY STREET", leftValue: "$0 IN THIRTY FIVE YEARS", rightLabel: "PEACH STREET, TWO STREETS OVER", rightValue: "$3,600 AND A STICKER IN THE WINDOW",
      verdict: "One of them lost nothing. The other one lost nine thousand four hundred dollars through an unlocked door." } },
  { frag: "I walked into roughly four thousand houses", comp: "BigStat",
    props: { value: "4,000", unit: "HOUSES, THE MORNING AFTER", caption: "Thirty one years with a metal clipboard and a camera, writing down what was gone.", tone: "brass" } },
  { frag: "This is a day", comp: "CheckCard",
    props: { kicker: "WHAT THIS LIST IS", title: "One ordinary Tuesday in a house", items: [
      { text: "Twenty five habits, in the order the day happens" },
      { text: "Every one of them costs nothing" },
      { text: "Every one is a thing a person does, not a thing a person buys" }] } },
  { frag: "The habit was not the lock", comp: "MythTruth",
    props: { kicker: "THE UNLOCKED FRONT DOOR",
      myth: "That family was careless, and they got away with it.",
      truth: "The lock was doing almost no work in that house. A person was doing the work. When the person went out to a job and nobody changed the lock habit, that is the exact house I got sent to." } },
  { frag: "What it stopped was the man who tries a handle", comp: "PullQuote",
    props: { quote: "It would not stop anybody who wanted through it. It was never supposed to.",
      attrib: "The hook and eye on a screen door · Sandusky Street, Monroeville" } },
  { frag: "He calls it Nothing To Buy", comp: "RayCta",
    props: { eyebrow: "WRITTEN BY MY BROTHER RAY, THE LOCKSMITH", title: "Nothing To Buy",
      sub: "Every security thing he knows of that costs zero dollars · key management across a household · what to do in a rental · the garage without the internet tricks",
      domain: "raykessler.vercel.app", showQr: false }, overlay: true },
  { frag: "There was a script, and the children knew it", comp: "SplitVs",
    props: { leftLabel: "WHAT A 1970 CHILD SAID", leftValue: "MY FATHER IS IN THE BACK", rightLabel: "WHAT THE BOY IN ATTICA SAID", rightValue: "MY MOTHER IS AT WORK UNTIL SIX",
      verdict: "That is exactly what happened to that family, and I wrote it down." } },
  { frag: "the single most common thing I photographed", comp: "WorstSpots",
    props: { kicker: "WHAT I SHOT ON THE WAY UP THE WALK", title: "Before I ever photographed the house", spots: [
      { label: "A mailbox too full to shut" }, { label: "Three papers in yellow bags on the step" },
      { label: "A package leaning against the siding" }, { label: "A flyer still wedged in the door" }] } },
  { frag: "It was in Dorothy", comp: "WorstSpots",
    props: { kicker: "WHERE I ACTUALLY RECOVERED KEYS", title: "None of these is a hiding place", spots: [
      { label: "Under the mat" }, { label: "Inside a plastic frog" },
      { label: "On top of the door casing" }, { label: "Inside a hollow porch post" }] } },
  { frag: "That door is usually hollow", comp: "CrossSection",
    props: { title: "The door your family stopped counting as a door",
      caption: "Garage to kitchen", labels: [
      { text: "Hollow core, not an exterior slab" }, { text: "A button in the knob, not a deadbolt" },
      { text: "Propped open with a laundry basket" }] } },
  { frag: "is a thirty second correction", comp: "SplitVs",
    props: { leftLabel: "FOUND UNLOCKED AT SIX", leftValue: "THIRTY SECONDS, LIGHTS ON", rightLabel: "FOUND UNLOCKED AT ELEVEN", rightValue: "A THING YOU TALK YOURSELF OUT OF",
      verdict: "The round happened at dusk, while everybody was awake and moving." } },
  { frag: "four or five free checks a night", comp: "BigStat",
    props: { value: "5x", unit: "A NIGHT, ON THE DOOR MOST LIKELY TO BE LEFT OPEN", caption: "The dog went out and came back through the same door, and every one of those trips ended with a hand on the lock.", tone: "brass" } },
  { frag: "Front door, storm door hook", comp: "RouteFlow",
    props: { kicker: "THE SAME ORDER, EVERY NIGHT", title: "He had been walking it since Nixon", steps: [
      { label: "Front door" }, { label: "Storm door hook" }, { label: "Kitchen to the patio" },
      { label: "The door to the garage" }, { label: "Basement, at the foot of the stairs" }, { label: "Porch light" }] } },
  { frag: "He was at his daughter", comp: "MythTruth",
    props: { kicker: "THE CAR IN THE DRIVEWAY",
      myth: "I left the side door open because my truck was out front and anybody would think I was home.",
      truth: "His truck was out front. He was at his daughter's, in Tiffin. The car in the driveway was never a security measure, and it was never treated as one." } },
  { frag: "A phone call to a person, with the real dates", comp: "ProcessChips",
    props: { kicker: "TWO MINUTES, BEFORE YOU LEAVE", title: "The one I still do myself", steps: [
      { title: "A person, not a timer" }, { title: "The real dates" },
      { title: "The day you come back" }, { title: "Where the car will be" }] } },
  { frag: "she was still walking the route at night", comp: "PullQuote",
    props: { quote: "Front door, kitchen, garage, basement, porch light. By herself, at eighty eight.",
      attrib: "Iva Lamb · a hardware store aisle in Norwalk, after Harold died" } },
  { frag: "Pick three from this list tonight", comp: "RayChecklist",
    props: { kicker: "NOT TWENTY FIVE. THREE.", title: "Do them tonight and again tomorrow", items: [
      { text: "In about nine days you stop choosing to do them" },
      { text: "That is the entire point" },
      { text: "The 1970 family was not thinking about any of this either" }] } },
];

// ── BEATS ────────────────────────────────────────────────────────────────────────────────────────
const CLIP_DIR = `broll/${SLUG}`;
const beats = [];
const compAt = new Map();
const anclas = new Set();
for (const c of COMPS) { const k = buscar(c.frag); if (k >= 0) { compAt.set(k, c); anclas.add(k); } }
if (anclas.size !== COMPS.length) { console.error(`⛔ ${COMPS.length - anclas.size} componentes sin ancla o con ancla COLISIONADA`); process.exit(1); }

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
    // RayCta y cia. estan hechos para ir ENCIMA de metraje. Como cue BASE quedan solos sobre el
    // fondo de marca => 13 s casi negros (medido en dale1). Van a overlays y el momento conserva su plano.
    const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3));
    overlaysOut.push({ componente: c.comp, props: c.props,
      ms_in: Math.round(m.t * 1000), ms_out: Math.round((m.t + Math.max(m.dur, piso)) * 1000) });
    compAt.delete(i);
  }
  if (c && !c.overlay) {
    // TIEMPO DE LECTURA: piso por texto; absorbe los momentos siguientes que caigan adentro.
    const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3));
    let out = m.t + Math.max(m.dur, piso);
    for (let j = i + 1; j < MOM.length && MOM[j].t < out; j++) {
      // ⛔ COMPUERTA: un componente NO puede comerse el ancla de otro (queda mudo y sin aviso).
      if (anclas.has(j)) { console.error(`⛔ el componente ${c.comp} (momento ${i}) absorbe el ancla del componente en el momento ${j}. Movelo de frase.`); process.exit(1); }
      MOM[j].__skip = true;
    }
    const sig = MOM.find((x) => x.t >= out && !x.__skip);
    if (sig) out = Math.max(out, sig.t);   // ESTIRA hasta el próximo beat real (recortar deja hueco)
    beats.push({ tipo: "componente", ms_in: Math.round(m.t * 1000), ms_out: Math.round(out * 1000),
      componente: c.comp, props: { ...c.props, bed: existe(img) ? img : undefined } });
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
