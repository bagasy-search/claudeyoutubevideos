// gen_dale4_plan.mjs — DIRECTOR → _v3/dale4_plan.json  (canal Dale Kessler, NARRADOR PURO)
//   (clon de gen_dale3_plan.mjs — sólo cambian SLUG y la tabla de COMPONENTES)
//
//   node gen_dale4_plan.mjs        # momentos + assets en disco -> plan
//   node build_dale4.mjs           # plan -> cues + Main + index + _dale4_assets.txt
//
// ⛔ Sin avatar NO hay fondo garantizado: cada momento DEBE tener asset o queda pantalla plana.
//    El build aborta con cobertura <98%.
// ⛔ Los componentes van como cue BASE (pantalla completa) y SIEMPRE con `bed` = la foto de ese
//    mismo momento, para que el marco de 60px no muestre fondo liso.
// ⛔ `RayCta` NO acepta `bed` y está hecha para ir ENCIMA de metraje: como cue BASE deja 13 s de
//    pantalla casi negra (medido en dale1). Va marcada `overlay: true`.
// ⛔ TIEMPO DE LECTURA: el piso de un componente sale del TEXTO, no del slot vecino
//    (2,8s + 0,28s por palabra más allá de 3, tope 13s). Los momentos que caen adentro se ABSORBEN.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "dale4";
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
// ⚠️ `MythTruth` de src/dale NO tiene mythLabel/truthLabel (usa iconos X / ✓). No pasarlos.
const COMPS = [
  // ── HOOK: los dos montones de plata que se contradicen ──
  { frag: "The second number was what the policy paid", comp: "SplitVs",
    props: { leftLabel: "WHAT WENT OUT THE DOOR", leftValue: "$18,000",
      rightLabel: "WHAT THE POLICY PAID", rightValue: "$6,100",
      verdict: "Nobody cheated them. Every dollar of that gap was written down in advance." } },
  { frag: "was capped somewhere around two hundred dollars", comp: "BigStat",
    props: { value: "$200", unit: "THE CASH LINE, ON MOST POLICIES I OPENED",
      caption: "On a policy insuring a house for a couple hundred thousand.", tone: "danger" } },
  { frag: "Seven of them, in the order they arrive", comp: "RouteFlow",
    props: { kicker: "NOT A LIST. A TIMELINE.", title: "The order I watched them land on people",
      steps: [{ label: "The morning after" }, { label: "The form" }, { label: "The check" }, { label: "The renewal" }] } },

  // ── INTRO: el descargo, como compuerta visual de honestidad ──
  { frag: "I am not an insurance agent", comp: "CheckCard",
    props: { kicker: "BEFORE I START", title: "What I am not", items: [
      { text: "I never sold anybody a policy" },
      { text: "I am not telling you what to buy" },
      { text: "Every number here is the ordinary one I saw, not a promise about yours" }] } },

  // ── S1: no hay entrada forzada ──
  { frag: "A recorded statement", comp: "RouteFlow",
    props: { kicker: "WHAT THE FILE TURNS INTO", title: "It stops being a form and starts being an investigation",
      steps: [{ label: "Recorded statement" }, { label: "Everyone with a key" }, { label: "Who left last, and when" }, { label: "Weeks, not days" }] } },

  // ── S2: el efectivo ──
  { frag: "It is in a jar on top of the refrigerator", comp: "WorstSpots",
    props: { kicker: "WHERE THE CASH ACTUALLY LIVES", title: "Never in a safe", spots: [
      { label: "The takeout menu drawer" }, { label: "A jacket in the hall closet" },
      { label: "The vacation jar" }, { label: "The change dish by the door" }] } },

  // ── S3: las joyas ──
  { frag: "That limit was a total", comp: "BigStat",
    props: { value: "$1,500", unit: "FOR EVERYTHING, NOT PER RING",
      caption: "Jewelry, watches and furs. One loss. All of it together.", tone: "danger" } },
  { frag: "It is a thing called scheduling", comp: "SplitVs",
    props: { leftLabel: "IN THE CATEGORY", leftValue: "THE SUB-LIMIT", rightLabel: "WRITTEN DOWN BY NAME", rightValue: "THE APPRAISAL",
      verdict: "The families paid what their jewelry was worth are the ones who listed it before anything happened." } },

  // ── S4: las herramientas ──
  { frag: "Eleven thousand four hundred dollars", comp: "BigStat",
    props: { value: "$11,400", unit: "ONE ROLLING CHEST, THIRTY YEARS",
      caption: "The single biggest line on that whole claim. Bigger than the jewelry. Bigger than the electronics.", tone: "brass" } },
  { frag: "stop treating them as your household property", comp: "MythTruth",
    props: { kicker: "THE QUESTION IN THE FIRST TEN MINUTES",
      myth: "They are my tools, in my garage, on my policy.",
      truth: "If they earn money, even on weekends, some policies call them business property — and business property has a small limit of its own, smaller still out in the truck." } },

  // ── S5: la franquicia ──
  { frag: "the check is three hundred dollars", comp: "ProcessChips",
    props: { kicker: "THE ARITHMETIC NOBODY RUNS FIRST", title: "What is left standing after it", steps: [
      { title: "$2,200 paid" }, { title: "$1,300 depreciated" }, { title: "minus $1,000 deductible" }, { title: "$300 check" }] } },

  // ── S6: depreciado vs reposición ──
  { frag: "Replacement cost means what it would cost", comp: "SplitVs",
    props: { leftLabel: "ACTUAL CASH VALUE", leftValue: "WHAT IT WAS WORTH THAT DAY", rightLabel: "REPLACEMENT COST", rightValue: "WHAT IT COSTS TO BUY AGAIN",
      verdict: "The difference between a check that stings and a check that makes people call back angry." } },
  { frag: "It is called recoverable depreciation", comp: "CheckCard",
    props: { kicker: "MONEY WITH YOUR NAME ALREADY ON IT", title: "Waiting on a receipt", items: [
      { text: "The first check is the depreciated value" },
      { text: "Replace the item and send the receipt" },
      { text: "Inside the window written into the policy" }] } },

  // ── S7: los dos años ──
  { frag: "it seemed like something a person ought to be told", comp: "PullQuote",
    props: { quote: "It seems like something a person ought to be told beforehand, rather than afterward.",
      attrib: "A man in Crestline, Ohio, with a pocket calculator and four old renewal notices" } },

  // ── CIERRE ──
  { frag: "put together a short guide called", comp: "RayCta",
    props: { eyebrow: "WRITTEN WITH MY BROTHER RAY", title: "The $1,500 Phone Call",
      sub: "The call you make before anything happens · what to ask about your own limits · where the sub-limits sit on the page · the two ways of getting paid · four minutes with a phone camera",
      domain: "raykessler.vercel.app", showQr: false }, overlay: true },
  { frag: "Find the line for money", comp: "RayChecklist",
    props: { kicker: "SOME EVENING THIS WEEK", title: "Five lines on one page", items: [
      { text: "The line for money" },
      { text: "The line for jewelry and watches" },
      { text: "The line for tools" },
      { text: "Your deductible" },
      { text: "Which of the two ways your policy pays" }] } },
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
    //    fondo de marca => 13 s casi negros (medido en dale1). Van a overlays y el momento conserva su plano.
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
