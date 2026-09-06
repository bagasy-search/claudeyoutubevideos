// gen_dale6_plan.mjs — DIRECTOR → _v3/dale6_plan.json  (canal Dale Kessler, NARRADOR PURO)
//
//   node gen_dale6_plan.mjs        # momentos + assets en disco -> plan
//   node build_dale6.mjs           # plan -> cues + Main + index + _dale6_assets.txt
//
// ⛔ Sin avatar NO hay fondo garantizado: cada momento DEBE tener asset o queda pantalla plana.
//    El build aborta con cobertura <98%.
// ⛔ El CTA (RayCta) va en overlays[], NUNCA como cue base: no dibuja fondo propio -> 13 s de negro.
// ⛔ TIEMPO DE LECTURA: el piso de un componente sale del TEXTO, no del slot vecino
//    (2,8s + 0,28s por palabra más allá de 3, tope 13s). Los momentos que caen adentro se ABSORBEN.
// ⛔ NUEVO EN dale6: compuerta que ABORTA si un componente absorbe el momento ancla de OTRO
//    componente. En dale3 eso se resolvía a mano con un comentario; acá lo caza el script.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "dale6";
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
  { frag: "had paid four thousand eight hundred dollars", comp: "BigStat",
    props: { value: "$4,800", unit: "ELEVEN WINDOWS, EVERY ONE SENSORED", caption: "The window they came through had a sensor on it. It was armed. It had also been open since June.", tone: "brass" } },
  { frag: "I do not have a story about luck", comp: "SplitVs",
    props: { leftLabel: "MARJORIE, KILBOURNE STREET", leftValue: "NINE PIECES OF A BROOM HANDLE", rightLabel: "ELLIS, FOUR BLOCKS OVER", rightValue: "$4,800 AND A STICKER ON EVERY PANE",
      verdict: "Same town. Same spring. One of them still has everything he owned." } },
  { frag: "counted backward from twenty to one", comp: "CheckCard",
    props: { kicker: "WHAT THIS LIST IS", title: "Twenty windows I wrote up the morning after", items: [
      { text: "Nothing here costs more than forty dollars" },
      { text: "Most of it costs nothing at all" },
      { text: "Every one came out of a house I stood inside" }] } },
  { frag: "I walked into roughly four thousand houses", comp: "BigStat",
    props: { value: "4,000", unit: "HOUSES, THE MORNING AFTER", caption: "Thirty one years with a metal clipboard and a camera, writing down what was gone.", tone: "brass" } },
  { frag: "The gravel under the sill", comp: "WorstSpots",
    props: { kicker: "ALREADY COVERED IN THE OTHER VIDEO", title: "Four window fixes that are not on this list", spots: [
      { label: "Pea gravel under the sill" }, { label: "A motion bulb in the porch fixture" },
      { label: "Shrubs cut below the sill line" }, { label: "A stick-on alarm for the open window" }] } },
  { frag: "why the factory latch is not the thing that saves you", comp: "MythTruth",
    props: { mythLabel: "WHAT PEOPLE ASSUME", truthLabel: "WHAT I WROTE DOWN", kicker: "THE LATCH ON A SLIDING WINDOW",
      myth: "The latch that came with the window is the lock.",
      truth: "It is a hooked lever screwed into thin vinyl, and it was engineered to hold the sash against a draft. A length of broom handle in the track is not a lock either. It is a stop, and a stop has nothing to defeat." } },
  { frag: "It is a shelf at eye level", comp: "RayChecklist",
    props: { kicker: "WHAT A LIT SILL PUTS ON DISPLAY", title: "The window is a shelf with the light behind it", items: [
      { text: "A camera and a laptop, charging by the outlet" },
      { text: "Three weeks of the same two objects in the same rectangle" },
      { text: "Nothing else in that house was touched" }] } },
  { frag: "A screen is a bug net", comp: "MythTruth",
    props: { mythLabel: "WHAT IT LOOKS LIKE", truthLabel: "WHAT I PHOTOGRAPHED", kicker: "THE INSECT SCREEN",
      myth: "A screen is one more layer between the room and the yard.",
      truth: "In thirty one years I never wrote a file where a screen slowed anything down. I photographed them leaning against the siding, in perfect condition, not cut and not bent." } },
  { frag: "sunk below the grade of the yard", comp: "CrossSection",
    props: { hue: "amber", title: "The one place a person is out of sight standing still",
      caption: "A window well is below the line of the lawn", labels: [
      { text: "Two or three feet under the grass" }, { text: "Nothing to see from the sidewalk" },
      { text: "Directly against your foundation" }] } },
  { frag: "Film that is bonded into the frame itself", comp: "SplitVs",
    props: { leftLabel: "FILM ON THE PANE ONLY", leftValue: "BUYS NOISE AND TIME", rightLabel: "FILM BONDED INTO THE FRAME", rightValue: "HOLDS THE GLASS TO THE HOUSE",
      verdict: "I photographed a whole filmed pane lying flat on a lawn like a tray. The film did its job. The window was still open." } },
  { frag: "That is the entire idea", comp: "ProcessChips",
    props: { kicker: "A DOLLAR, ONCE", title: "Two dots you can read from the doorway", steps: [
      { title: "A dot on the lever" }, { title: "A dot on the frame" },
      { title: "In line only when it is thrown" }, { title: "A two second glance" }] } },
  { frag: "the house behind it was untouched and unentered", comp: "BigStat",
    props: { value: "$4,000", unit: "IN TOOLS, OUT OF A DETACHED GARAGE", caption: "Thirty years of a woodworking bench, lined up along the wall directly opposite the only window.", tone: "danger" } },
  { frag: "Four inches moves almost as much air as eight", comp: "CheckCard",
    props: { kicker: "THE SUMMER WINDOW", title: "You are not choosing between air and a locked house", items: [
      { text: "Open, and open four inches, are different things" },
      { text: "A pin, a dowel, or a stop in the track" },
      { text: "Set it once in the spring and leave it all summer" }] } },
  { frag: "It will be the basement, or the laundry, or the bathroom", comp: "RouteFlow",
    props: { kicker: "ELEVEN MINUTES, TONIGHT", title: "Where the one you find is going to be", steps: [
      { label: "The basement" }, { label: "The laundry" }, { label: "The bathroom" },
      { label: "Over the garage roof" }, { label: "Behind the dryer" }] } },
  { frag: "It became a vent, or a shelf", comp: "WorstSpots",
    props: { kicker: "WHAT IT STOPPED BEING", title: "It was not neglected. It was reclassified.", spots: [
      { label: "A vent" }, { label: "A shelf" }, { label: "The thing behind the dryer" },
      { label: "The frame around a box fan" }] } },
  { frag: "Marjorie's husband went around that house one Saturday", comp: "PullQuote",
    props: { quote: "Not one window in that house was allowed to quietly become something else.",
      attrib: "Kilbourne Street, Bellevue · nine pieces of a broom handle" } },
  { frag: "written guide about exactly what a homeowner policy pays", comp: "RayCta",
    props: { eyebrow: "WRITTEN WITH MY BROTHER RAY", title: "The Thousand Dollar Afternoon",
      sub: "What your policy actually pays after a break-in · the sub-limits nobody reads · the 11 p.m. phone call · the letter that gets your money back",
      domain: "raykessler.vercel.app", showQr: false }, overlay: true },
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
