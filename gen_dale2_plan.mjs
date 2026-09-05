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

const SLUG = "dale2";
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
  { frag: "Eleven dollars, total", comp: "BigStat",
    props: { value: "$11", unit: "FOR THE YEAR", caption: "Everything Arlene spent on security. A rubber wedge, a lamp timer, and a bag of gravel.", tone: "brass" } },
  { frag: "two thousand nine hundred dollars on a system", comp: "SplitVs",
    props: { leftLabel: "ARLENE", leftValue: "$11", rightLabel: "GARY, FOUR DOORS DOWN", rightValue: "$2,900",
      verdict: "Nobody ever came through Arlene's door. They came through Gary's twice." } },
  { frag: "My name is Dale Kessler", comp: "BigStat",
    props: { value: "4,000", unit: "HOUSES", caption: "Every one of them the morning after. Clipboard, camera, and a form to fill in.", tone: "brass" } },
  { frag: "Number twenty.", comp: "CheckCard",
    props: { kicker: "WHAT THIS LIST IS", title: "Twenty fixes, none of them a product", items: [
      { text: "Every one costs between nothing and forty dollars" },
      { text: "Every one I saw missing in a house that got hit" },
      { text: "Every one I saw present in a house that never did" }] } },
  { frag: "Number eighteen.", comp: "CrossSection",
    props: { title: "The sill line", caption: "Anything above the height of the window sill is cover. Below it, there is nowhere to stand unseen.",
      labels: [{ text: "Sill height" }, { text: "Trim below it" }, { text: "No cover left" }] } },
  { frag: "Number fourteen.", comp: "BigStat",
    props: { value: "90", unit: "SECONDS", caption: "The time he needs at a door, out in the open. Take those away and the job is gone.", tone: "danger" } },
  { frag: "Number twelve.", comp: "MythTruth",
    props: { mythLabel: "WHAT PEOPLE ASSUME", truthLabel: "WHAT I WROTE DOWN",
      kicker: "THE DOG THAT DOES NOT EXIST", myth: "You need the dog for the dog to work.",
      truth: "A worn bowl and a chain by the back door did the same job in every file I ever wrote." } },
  { frag: "Number eight.", comp: "ProcessChips",
    props: { kicker: "TWO MINUTES, EVERY NIGHT", title: "The walk that costs nothing", steps: [
      { title: "Front door" }, { title: "Back door" }, { title: "Slider" }, { title: "Garage" }] } },
  { frag: "Number seven.", comp: "CheckCard",
    props: { kicker: "THE TWO SECOND FIX", title: "The remote does not live in the car", items: [
      { text: "The car outside is a pane of glass away" },
      { text: "The remote on the visor opens a private room" },
      { text: "Pocket it, or use the app, or park inside" }] } },
  { frag: "Number three.", comp: "BigStat",
    props: { value: "$10", unit: "DOOR WEDGE ALARM", caption: "Missing from more of my claim files than any other single item on this list.", tone: "danger" } },
  { frag: "Number one.", comp: "PullQuote",
    props: { quote: "You already own the light. It is pointed at the wrong side of the house.",
      attrib: "Dale Kessler · 31 years, claims" } },
  { frag: "It covers the sublimits", comp: "WorstSpots",
    props: { kicker: "WHAT THE POLICY QUIETLY CAPS", title: "The sub-limits nobody reads", spots: [
      { label: "Jewellery" }, { label: "Cash" }, { label: "Electronics" }, { label: "Tools" }] } },
  { frag: "Ray and I put our names on this guide", comp: "RayCta",
    props: { eyebrow: "WRITTEN WITH MY BROTHER RAY", title: "The Thousand Dollar Afternoon",
      sub: "What your policy actually pays after a break-in · the sub-limits nobody reads · the 11 p.m. phone call · the letter that gets your credit back",
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
