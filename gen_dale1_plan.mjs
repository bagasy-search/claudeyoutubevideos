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

const SLUG = "dale1";
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
  { frag: "They were inside for forty-one minutes", comp: "BigStat",
    props: { value: "41", unit: "MINUTES", caption: "How long they were inside. The neighbour heard the dog and looked at the clock.", tone: "danger" } },
  { frag: "About four thousand of them", comp: "BigStat",
    props: { value: "4,000", unit: "HOUSES", caption: "Every one of them the morning after. Clipboard and camera.", tone: "brass" } },
  { frag: "The right question is what the houses", comp: "MythTruth",
    props: { mythLabel: "THE QUESTION EVERYBODY ASKS", truthLabel: "THE QUESTION THAT MATTERS", kicker: "THE WRONG QUESTION", myth: "What did the houses that got robbed have in common?", truth: "What were the houses that never got robbed MISSING?" } },
  { frag: "I found keys under the third flowerpot", comp: "WorstSpots",
    props: { kicker: "FOUND IN MY FILES", title: "Where the key actually was", spots: [
      { label: "Under the third flowerpot from the door" }, { label: "Taped inside the mailbox lid" },
      { label: "Magnetic case under the gas meter" }, { label: "On the ledge above the door frame" }] } },
  { frag: "The key is not the hole. The key is the tell", comp: "PullQuote",
    props: { quote: "The key is not the hole. The key is the tell.", attrib: "Dale Kessler · 31 years, claims" } },
  { frag: "no forced entry means the company gets to ask questions", comp: "CheckCard",
    props: { kicker: "THE MONEY PART", title: "No forced entry is a problem on your claim", items: [
      { text: "No damage means no proof of how he got in" }, { text: "The adjuster has to ask who else has a key" },
      { text: "Put the spare at the neighbour's, not on the property" }] } },
  { frag: "The whole job is the ninety seconds", comp: "BigStat",
    props: { value: "90", unit: "SECONDS", caption: "That is the whole job: the time he stands there in the open, where somebody might look.", tone: "danger" } },
  { frag: "What I noticed was that in the clean houses", comp: "RayChecklist",
    props: { kicker: "THE CLEAN HOUSES", title: "That side of the property was USED", items: [
      { text: "A bench nobody had moved in years" }, { text: "A bike leaning against the wall" },
      { text: "Tomato plants in pots, a hose reel" }, { text: "An opened bag of soil" }] } },
  { frag: "Out on the porch he has ninety seconds", comp: "SplitVs",
    props: { leftLabel: "ON YOUR PORCH", leftValue: "90 seconds", rightLabel: "INSIDE YOUR GARAGE", rightValue: "an hour",
      verdict: "Once the garage door is down behind him, he can make noise." } },
  { frag: "That door was made to give somebody privacy in a bathroom", comp: "CrossSection",
    props: { title: "The door between the garage and the kitchen", caption: "A hollow interior door with a thumb button, doing the job of a front door.",
      labels: [{ text: "Hollow core" }, { text: "Privacy latch, not a lock" }, { text: "No deadbolt" }, { text: "Opens into your house" }] } },
  { frag: "his tools are covered to a couple of thousand dollars", comp: "BigStat",
    props: { value: "$2,000", unit: "SUB-LIMIT", caption: "Tools, total — not each. And it comes off the same pile as the bikes and the freezer.", tone: "danger" } },
  { frag: "There were two newspapers on the driveway", comp: "WorstSpots",
    props: { kicker: "GROVE STREET, 9 A.M.", title: "What I could see before I got out of the car", spots: [
      { label: "Two newspapers on the driveway" }, { label: "Bins still at the curb on a Thursday" },
      { label: "A box on the porch, sitting in Tuesday's rain" }] } },
  { frag: "who brings your bins in", comp: "ProcessChips",
    props: { kicker: "FREE, AND IT WORKS", title: "In the clean houses there was always a name", steps: [
      { title: "Bins away" }, { title: "Paper picked up" }, { title: "Box inside the door" }] } },
  { frag: "I never once photographed a lock that had been picked", comp: "MythTruth",
    props: { mythLabel: "WHAT YOU HAVE SEEN ON TELEVISION", truthLabel: "WHAT I PHOTOGRAPHED", kicker: "31 YEARS OF PHOTOGRAPHS", myth: "They pick the lock. The tension wrench, the whole routine.", truth: "Not one. In 4,000 files I never photographed a picked lock. What I photographed was wood." } },
  { frag: "there were two screws in it", comp: "CrossSection",
    props: { title: "What is behind your strike plate", caption: "The lock held. The bolt was still out. What let go was the frame around it.",
      labels: [{ text: "Strike plate" }, { text: "Two screws, 3/4 inch" }, { text: "Pine trim board" }, { text: "The 2x4 they never reach" }] } },
  { frag: "ran between two and four thousand dollars", comp: "BigStat",
    props: { value: "$2,000–$4,000", unit: "PER CLAIM", caption: "Door, frame, trim, paint and what was taken — before the deductible, and before two years of higher premium.", tone: "danger" } },
  { frag: "So that is the five", comp: "RayChecklist",
    props: { kicker: "THE FIVE", title: "What I never found in a clean house", items: [
      { text: "A key somewhere outside the house" }, { text: "A side of the house nobody could see" },
      { text: "A garage treated like it is outside" }, { text: "A house that announces when it is empty" },
      { text: "A door frame still holding the builder's screws" }] } },
  { frag: "There is a walkthrough down below", comp: "RayCta",
    props: { eyebrow: "WRITTEN WITH MY BROTHER RAY", title: "The Thousand Dollar Afternoon",
      sub: "What your policy actually pays after a break-in · the sub-limits nobody reads · the 11 p.m. phone call · the letter that gets your credit back",
      domain: "raykessler.vercel.app", showQr: false, __nobed: true } },
];

// ── BEATS ────────────────────────────────────────────────────────────────────────────────────────
const CLIP_DIR = `broll/${SLUG}`;
const beats = [];
const compAt = new Map();
for (const c of COMPS) { const k = buscar(c.frag); if (k >= 0) compAt.set(k, c); }

const palabras = (p) => Object.values(p).flatMap((v) =>
  typeof v === "string" ? v.split(/\s+/) : Array.isArray(v) ? v.flatMap((o) => String(Object.values(o)[0]).split(/\s+/)) : []).length;

let absorbidos = 0;
for (let i = 0; i < MOM.length; i++) {
  const m = MOM[i];
  if (m.__skip) { absorbidos++; continue; }
  const img = `img/${SLUG}_${String(m.i).padStart(3, "0")}.jpg`;
  const clip = `${CLIP_DIR}/${SLUG}_${String(m.i).padStart(3, "0")}.mp4`;
  const c = compAt.get(i);

  if (c) {
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
const plan = { slug: SLUG, totalMs: Math.round(TOTAL_S * 1000), beats, overlays: [] };
fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify(plan, null, 1));

const n = (t) => beats.filter((b) => b.tipo === t).length;
console.log(`plan: ${beats.length} beats · clip ${n("clip")} · clipslow ${n("clipslow")} · imagen ${n("imagen")} · componente ${n("componente")} (absorbidos ${absorbidos})`);
console.log(`componentes distintos: ${new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente)).size}`);
console.log(`total ${(TOTAL_S / 60).toFixed(2)} min · wav ${(WAV_S / 60).toFixed(2)} min`);
