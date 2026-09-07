// gen_dale8_plan.mjs — DIRECTOR → _v3/dale8_plan.json  (canal Dale Kessler, NARRADOR PURO)
//
//   node gen_dale8_plan.mjs        # momentos + assets en disco -> plan
//   node build_dale8.mjs           # plan -> cues + Main + index + _dale8_assets.txt
//
// ⛔ Sin avatar NO hay fondo garantizado: cada momento DEBE tener asset o queda pantalla plana.
//    El build aborta con cobertura <98%.
// ⛔ El CTA (RayCta) va en overlays[], NUNCA como cue base: no dibuja fondo propio -> 13 s de negro.
// ⛔ TIEMPO DE LECTURA: el piso de un componente sale del TEXTO, no del slot vecino
//    (2,8s + 0,28s por palabra más allá de 3, tope 13s). Los momentos que caen adentro se ABSORBEN.
// ⛔ NUEVO EN dale8: compuerta que ABORTA si un componente absorbe el momento ancla de OTRO
//    componente. En dale8 eso se resolvía a mano con un comentario; acá lo caza el script.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "dale8";
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
  // ── HOOK ───────────────────────────────────────────────────────────────────────────────────────
  { frag: "That file closed at two thousand nine hundred", comp: "SplitVs",
    props: { leftLabel: "COREEN, ORCHARD STREET, WILLARD", leftValue: "$12,700 ON A $14,000 LOSS",
      rightLabel: "FREMONT, THREE WEEKS LATER", rightValue: "$2,900",
      verdict: "Almost the same house. Almost the same policy. I read both of them." } },
  { frag: "It is closer to one in forty", comp: "BigStat",
    props: { value: "1 IN 40", unit: "FAMILIES HAD THE PHOTOGRAPHS BEFOREHAND",
      caption: "Twenty minutes on an ordinary Tuesday night was the whole difference between those two checks.", tone: "brass" } },
  // ── INTRO ──────────────────────────────────────────────────────────────────────────────────────
  { frag: "I walked into roughly four thousand houses", comp: "BigStat",
    props: { value: "4,000", unit: "HOUSES, THE MORNING AFTER", caption: "Thirty one years in Ohio with a metal clipboard and a camera on a cord. I never once saw the man who did it.", tone: "brass" } },
  // ── BLOQUE 1: ESTA NOCHE ───────────────────────────────────────────────────────────────────────
  { frag: "Here is the first group", comp: "CheckCard",
    props: { kicker: "GROUP ONE", title: "Four things to do tonight", items: [
      { text: "Ten · photograph every room from the doorway" },
      { text: "Nine · four serial numbers on one page" },
      { text: "Eight · tell one neighbour which cars are yours" },
      { text: "Seven · decide who calls, and in what order" }] } },
  { frag: "Everybody thinks the photographs are for proving", comp: "MythTruth",
    props: { kicker: "WHAT THE PHOTOGRAPH IS ACTUALLY FOR",
      myth: "It proves the thing existed.",
      truth: "It proves the condition it was in, and condition is where the money lives. With no photograph I had to write down the ordinary answer, and the ordinary answer is a used television of unknown age." } },
  { frag: "They are on the back of the television", comp: "RayChecklist",
    props: { kicker: "FOUR NUMBERS, TEN MINUTES, ONE FLASHLIGHT", title: "Where the serial number actually is", items: [
      { text: "On the back of the television" },
      { text: "Underneath the laptop" },
      { text: "Inside the battery door of the camera" },
      { text: "Stamped in the bicycle frame by the crank" }] } },
  { frag: "A recovered item and an identified item", comp: "SplitVs",
    props: { leftLabel: "RECOVERED", leftValue: "A TELEVISION IN A ROOM FULL OF THEM", rightLabel: "IDENTIFIED", rightValue: "COREEN'S TELEVISION",
      verdict: "In Shelby a family got a call fourteen months after I closed the file, because twelve digits were written on a page." } },
  { frag: "That blue truck is my brother", comp: "PullQuote",
    props: { quote: "That blue truck is my brother, he comes Thursdays. Anybody else in the driveway on a weekday, that is not us.", attrib: "The whole conversation. Thirty seconds." } },
  { frag: "Here is the order that works", comp: "RouteFlow",
    props: { kicker: "THE FIRST TWO HOURS", title: "The order, and it only works in this order", steps: [
      { label: "Police first" }, { label: "Report number written down before the officer leaves" },
      { label: "The insurer that same night, not the morning" }, { label: "Only then start listing things" }] } },
  { frag: "the second of the three", comp: "RayCta",
    props: { eyebrow: "WRITTEN WITH MY BROTHER RAY", title: "The $1,500 Phone Call",
      sub: "The first night, in order · what to say and what not to say · the report number · the letter you send when a file goes quiet",
      domain: "raykessler.vercel.app" }, overlay: true },
  // ── BLOQUE 2: ESTA SEMANA ──────────────────────────────────────────────────────────────────────
  { frag: "Here is the second group", comp: "CheckCard",
    props: { kicker: "GROUP TWO", title: "Three things to do this week", items: [
      { text: "Six · find the thing of yours that is helping" },
      { text: "Five · read four lines of your policy out loud" },
      { text: "Four · put a name on the mail and the driveway" }] } },
  { frag: "It is the aluminum ladder", comp: "WorstSpots",
    props: { kicker: "IT IS YOURS AND IT HAS BEEN THERE FOR YEARS", title: "What I photographed in your own yard", spots: [
      { label: "The ladder along the side of the garage" }, { label: "The wheelie bin against the fence" },
      { label: "The patio chair by the deck rail" }, { label: "Firewood stacked to the back wall" }] } },
  { frag: "Your dwelling amount", comp: "RayChecklist",
    props: { kicker: "THE DECLARATIONS PAGE, FRONT OF THE POLICY", title: "Four lines. Read them out loud to each other", items: [
      { text: "Your dwelling amount" }, { text: "Your personal property amount" },
      { text: "Your deductible" }, { text: "Special limits, or sub-limit, with dollars beside categories" }] } },
  { frag: "Fifteen minutes and a page you already own", comp: "RayCta",
    props: { eyebrow: "THE OTHER SIDE OF THIS, WITH MY BROTHER RAY", title: "What your policy actually pays",
      sub: "The sub-limits that quietly cap what you are owed · three short guides · no system, no subscription",
      domain: "raykessler.vercel.app" }, overlay: true },
  // ── BLOQUE 3: ESTE ANO ─────────────────────────────────────────────────────────────────────────
  { frag: "Here is the last group", comp: "CheckCard",
    props: { kicker: "GROUP THREE", title: "Three things to do this year", items: [
      { text: "Three · photograph and value the irreplaceable thing" },
      { text: "Two · five minutes at the kitchen table" },
      { text: "One · pick a date and do number ten again" }] } },
  { frag: "It is three sentences", comp: "ProcessChips",
    props: { kicker: "SAY IT ONCE, ON AN ORDINARY EVENING", title: "The only item here that is not about money", steps: [
      { title: "Door open? Do not go in" }, { title: "Call from the car" },
      { title: "Hear it inside? Nearest door out" }, { title: "Everybody meets at the same place" }] } },
  // ── CIERRE ─────────────────────────────────────────────────────────────────────────────────────
  { frag: "were never the families with the most equipment", comp: "PullQuote",
    props: { quote: "Not once in thirty one years were they the families with the most equipment. Coreen had twenty minutes on a Tuesday night and a neighbour who knew her husband's truck.",
      attrib: "Dale Kessler · 4,000 houses, the morning after" } },
  { frag: "It is at raykessler dot vercel dot app", comp: "RayCta",
    props: { eyebrow: "RAY PUT THINGS BACK. I ONLY EVER PHOTOGRAPHED THEM.", title: "The three we got tired of explaining in doorways",
      sub: "What your policy pays after a break-in · the phone call for that first night, in order · the letter you send when a file goes quiet",
      domain: "raykessler.vercel.app" }, overlay: true },
];

// ── BEATS ────────────────────────────────────────────────────────────────────────────────────────
const CLIP_DIR = `broll/${SLUG}`;
// ⛔⛔ AGNES REDIBUJA LA ESCENA, Y LO HACE ANTES DEL PRIMER SEGUNDO. Medido en dale8: en los clips
//    fallados SOLO el frame 0 es fiel a la foto; a los 0,3 s ya es otro lugar u otra persona. Por eso
//    NO alcanza con recortar la duracion (se probo y fallo): el clip entero se descarta y el momento
//    vuelve a la FOTO con Ken-Burns, que ademas se ve mas fluido.
//    Deteccion: frame 0 vs frame a 0,5 s (ver /d/rtmp/salto8.mjs). Comparar contra el FINAL no sirve:
//    mide ZOOM, no redibujo.
const REDIBUJADO = new Set(JSON.parse(fs.readFileSync(`_v3/${SLUG}_redibujados.json`, "utf8")));
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
  const cd = (existe(clip) && !REDIBUJADO.has(m.i)) ? durDe(clip) : 0;
  if (cd > 0.8) {
    // clip normal si entra; a 0,5x cuando el momento es largo (el creador lo pidió explícito)
    const usable = cd - 0.15;
    if (m.dur <= usable) beats.push({ tipo: "clip", ms_in, ms_out, clip: `${SLUG}/${SLUG}_${String(m.i).padStart(3, "0")}` });
    else beats.push({ tipo: "clipslow", ms_in, ms_out, rate: Math.min(1, Math.max(0.45, usable / m.dur)),
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
