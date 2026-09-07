// gen_dale9_plan.mjs — DIRECTOR → _v3/dale9_plan.json  (canal Dale Kessler, NARRADOR PURO)
//
//   node gen_dale9_plan.mjs        # momentos + assets en disco -> plan
//   node build_dale9.mjs           # plan -> cues + Main + index + _dale9_assets.txt
//
// ⛔ Sin avatar NO hay fondo garantizado: cada momento DEBE tener asset o queda pantalla plana.
//    El build aborta con cobertura <98%.
// ⛔ El CTA (RayCta) va en overlays[], NUNCA como cue base: no dibuja fondo propio -> 13 s de negro.
// ⛔ TIEMPO DE LECTURA: el piso de un componente sale del TEXTO, no del slot vecino
//    (2,8s + 0,28s por palabra más allá de 3, tope 13s). Los momentos que caen adentro se ABSORBEN.
// ⛔ Compuerta: aborta si un componente absorbe el momento ancla de OTRO componente.
//
// ⭐ NUEVO EN dale9: RaySecurityCam. NO es una tarjeta de texto, es un TRATAMIENTO sobre el plano
//    (viñeta gran angular, desaturado frío, barrido, ruido, timestamp, REC). Por eso NO lleva piso
//    por tiempo de lectura ni absorbe vecinos: ocupa EXACTAMENTE el momento, como un clip o una foto.
//    Si le aplicáramos el piso de texto se comería los momentos del hook y rompería el pacing.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "dale9";
const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const durDe = (rel) => {
  try { return parseFloat(execFileSync(FFPROBE, ["-v","error","-show_entries","format=duration","-of","csv=p=0",
    path.join("public", rel)], { encoding: "utf8" }).trim()) || 0; } catch { return 0; }
};
const existe = (rel) => fs.existsSync(path.join("public", rel));

const MOM = JSON.parse(fs.readFileSync(`_v3/${SLUG}_moments.json`, "utf8").replace(/^\uFEFF/, ""));
const WAV_S = durDe(`${SLUG}.wav`);
const TOTAL_S = Math.max(MOM[MOM.length - 1].t + MOM[MOM.length - 1].dur, WAV_S);

// ── CÁMARA DE SEGURIDAD: el hook (el pasillo de Marion, 2:14 de la mañana) y su callback del cierre.
//    Cada uno es OTRO rincón de la misma casa, y el reloj corre de verdad dentro del componente.
const CAM = {
  0:   { label: "CAM 01 · HALL",        clockStart: 8040 },   // 02:14:00
  1:   { label: "CAM 02 · LANDING",     clockStart: 8046 },
  2:   { label: "CAM 03 · LIVING RM",   clockStart: 8052 },
  4:   { label: "CAM 04 · BEDROOM DR",  clockStart: 8061 },
  5:   { label: "CAM 05 · KITCHEN",     clockStart: 8067 },
  202: { label: "CAM 01 · HALL",        clockStart: 8040 },   // el callback: la misma cinta
};
const CAM_DATE = "03 / 12 / 2013";

// ── COMPONENTES: anclados por FRASE, no por índice a mano ────────────────────────────────────────
const buscar = (frag) => {
  const k = MOM.findIndex((m) => m.txt.toLowerCase().includes(frag.toLowerCase()));
  if (k < 0) console.warn(`⚠ no encontré la frase: "${frag.slice(0, 50)}"`);
  return k;
};

// ✅ VERIFICADO ABRIENDO raykessler.vercel.app EL 2026-09-07: la guía DOS se llama
//    "THE $1,500 PHONE CALL" (29 pág, 8 cap) y los capítulos citados son el 10 (la noche que
//    te quedas afuera, $150-450 -> $1.500), el 11 (tres guiones de teléfono para las once de la
//    noche) y el 15 (el crédito del seguro, la carta que lo reclama). NADA en la landing habla de
//    sub-límites ni de "lo que paga tu póliza": por eso el CTA no lo promete.
// ⛔ EL CTA SE ATIENE A LOS CAPÍTULOS QUE LA GUÍA REALMENTE TIENE (medido abriendo la landing en
//    dale5: de seguros hay UNO solo, el de la carta del crédito). No prometer sub-límites ni
//    "lo que paga tu póliza": eso NO está en la guía y el creador no piensa actualizarla.
const CTA_SUB = "The night a $150 call becomes $1,500 · three phone scripts for eleven at night · " +
  "the letter that claims the insurance credit you are owed";

const COMPS = [
  // ── HOOK ───────────────────────────────────────────────────────────────────────────────────────
  { frag: "The check was for fifteen hundred", comp: "SplitVs",
    props: { leftLabel: "WHAT CAME OFF THE DRESSER", leftValue: "$19,400",
      rightLabel: "WHAT THE POLICY PAID", rightValue: "$1,500",
      verdict: "Every piece documented. Every piece accepted. Nobody argued with her once." } },
  { frag: "I closed roughly four thousand", comp: "BigStat",
    props: { value: "4,000", unit: "HOUSES, THE MORNING AFTER",
      caption: "In thirty one years I can count on my hands the families who knew that line was there before I showed them.", tone: "brass" } },
  // ── INTRO: el escudo de honestidad, también EN PANTALLA ────────────────────────────────────────
  { frag: "I have never sold an insurance policy", comp: "CheckCard",
    props: { kicker: "BEFORE WE GO ANY FURTHER", title: "What I am not", items: [
      { text: "I never sold a policy. I am not an agent" },
      { text: "I am not paid if you buy anything, and I am not telling you what to buy" },
      { text: "The dollar figures are the ordinary ones I read on the forms" },
      { text: "Yours will be different, which is the whole point" }] } },
  // ── LA PÁGINA ──────────────────────────────────────────────────────────────────────────────────
  { frag: "Special Limits of Liability", comp: "RayChecklist",
    props: { kicker: "PAST THE DECLARATIONS PAGE, IN THE MIDDLE OF THE BOOKLET", title: "What you are looking for", items: [
      { text: "A heading that says Special Limits of Liability" },
      { text: "Some companies call them sub-limits" },
      { text: "About half a page, no longer" },
      { text: "Categories down one side, a dollar figure beside each one" }] } },
  { frag: "Nothing on that page says the word no", comp: "MythTruth",
    props: { kicker: "WHY NOBODY EVER STOPS ON THAT PAGE",
      myth: "It is the part that says you are not covered.",
      truth: "It never says no. Every category on it is covered. It says yes up to a number, and the number was decided years before anything happened to you." } },
  // ── LA PALABRA ─────────────────────────────────────────────────────────────────────────────────
  { frag: "The cap is not on jewelry", comp: "PullQuote",
    props: { quote: "The cap is not on jewelry. The cap is on jewelry being stolen.",
      attrib: "One word on that line does all of the work." } },
  { frag: "Same ring. Same drawer", comp: "SplitVs",
    props: { leftLabel: "CARRIED OUT THE DOOR", leftValue: "CAPPED AT $1,500",
      rightLabel: "BURNED IN THE SAME DRESSER", rightValue: "NOT CAPPED AT ALL",
      verdict: "Same ring. Same policy. Same page. The only thing that changed is which bad thing happened." } },
  // ── LA ARITMÉTICA ──────────────────────────────────────────────────────────────────────────────
  { frag: "It is not a floor under each piece", comp: "BigStat",
    props: { value: "$1,500", unit: "FOR THE WHOLE DRAWER, NOT FOR EACH PIECE",
      caption: "The ring, the watch, the two chains, the earrings and the bracelet collapse into one number for the one loss.", tone: "brass" } },
  { frag: "the same block of text usually caps cash", comp: "WorstSpots",
    props: { kicker: "THE REST OF THE SAME HALF PAGE", title: "The neighbours of that line", spots: [
      { label: "Cash, around two hundred dollars" },
      { label: "Silverware, somewhere near twenty five hundred" },
      { label: "Firearms, somewhere near twenty five hundred" },
      { label: "Every one of them a ceiling, not a floor" }] } },
  // ── LA NOCHE ───────────────────────────────────────────────────────────────────────────────────
  { frag: "So here is the evening", comp: "RouteFlow",
    props: { kicker: "ONE EVENING, AT THE KITCHEN TABLE", title: "Four things, and then I will get out of your way", steps: [
      { label: "Read the line out loud to somebody you live with" },
      { label: "Put the pieces on a towel and photograph them" },
      { label: "For most families it ends here, and that is a real answer" },
      { label: "If one or two carry the weight, get those appraised" }] } },
  { frag: "One photograph of all of it together", comp: "ProcessChips",
    props: { kicker: "FIFTEEN MINUTES, AND IT COSTS NOTHING", title: "How to photograph a drawer", steps: [
      { title: "All of it together, so it reads as one household" },
      { title: "Each piece with a coin beside it for scale" },
      { title: "The inscription, if there is one" }] } },
  { frag: "Schedule is the word they will recognize", comp: "RayChecklist",
    props: { kicker: "THE WORD THEY WILL RECOGNISE ON THE OTHER SIDE OF THE DESK", title: "Ask what it costs to schedule those pieces", items: [
      { text: "Schedule is the word" },
      { text: "Some companies say a floater" },
      { text: "Some say a rider" },
      { text: "Some say an endorsement, and it all means the same thing" }] } },
  { frag: "It becomes all risk", comp: "SplitVs",
    props: { leftLabel: "ON THE LIST ON PAGE 22", leftValue: "THEFT ONLY, UP TO THE CAP",
      rightLabel: "SCHEDULED BY NAME AND VALUE", rightValue: "ALL RISK, AT THE APPRAISED VALUE",
      verdict: "The stone that falls out at the grocery store. The ring down the drain. On most of them the deductible does not apply either." } },
  // ── CIERRE ─────────────────────────────────────────────────────────────────────────────────────
  { frag: "They were the families where somebody", comp: "PullQuote",
    props: { quote: "They were never the families with the most equipment bolted to the outside of the house. They were the families where somebody read one line out loud on an ordinary evening.",
      attrib: "Dale Kessler · 4,000 houses, the morning after" } },
  // ── LOS TRES CTA (overlay SIEMPRE: RayCta no dibuja fondo propio) ──────────────────────────────
  { frag: "My brother Ray and I wrote", comp: "RayCta",
    props: { eyebrow: "WRITTEN WITH MY BROTHER RAY", title: "The $1,500 Phone Call",
      sub: CTA_SUB, domain: "raykessler.vercel.app" }, overlay: true },
  { frag: "You take that appraisal", comp: "RayCta",
    props: { eyebrow: "AND IF IT ALREADY HAPPENED TO YOU", title: "The $1,500 Phone Call",
      sub: CTA_SUB, domain: "raykessler.vercel.app" }, overlay: true },
  { frag: "There is nothing to buy from me", comp: "RayCta",
    props: { eyebrow: "RAY PUT THINGS BACK. I ONLY EVER PHOTOGRAPHED THEM.", title: "The three we got tired of explaining in doorways",
      sub: "Twenty-four chapters · the afternoon that stops a kick-in · the phone scripts for eleven at night · the letter that claims the insurance credit",
      domain: "raykessler.vercel.app" }, overlay: true },
];

// ── BEATS ────────────────────────────────────────────────────────────────────────────────────────
const CLIP_DIR = `broll/${SLUG}`;
// ⛔⛔ AGNES REDIBUJA LA ESCENA, Y LO HACE ANTES DEL PRIMER SEGUNDO. Medido en dale8: en los clips
//    fallados SOLO el frame 0 es fiel a la foto; a los 0,3 s ya es otro lugar u otra persona. Por eso
//    NO alcanza con recortar la duracion: el clip entero se descarta y el momento vuelve a la FOTO
//    con Ken-Burns, que ademas se ve mas fluido. Deteccion: frame 0 vs frame a 0,5 s.
const REDIB_F = `_v3/${SLUG}_redibujados.json`;
const REDIBUJADO = new Set(fs.existsSync(REDIB_F) ? JSON.parse(fs.readFileSync(REDIB_F, "utf8")) : []);
if (!fs.existsSync(REDIB_F)) console.warn(`⚠ todavía no corrió check_redibujo.mjs (${REDIB_F})`);

const beats = [];
const compAt = new Map();
const anclas = new Set();
for (const c of COMPS) { const k = buscar(c.frag); if (k >= 0) { compAt.set(k, c); anclas.add(k); } }
if (anclas.size !== COMPS.length) { console.error(`⛔ ${COMPS.length - anclas.size} componentes sin ancla o con ancla COLISIONADA`); process.exit(1); }
for (const i of Object.keys(CAM).map(Number)) if (anclas.has(i)) { console.error(`⛔ el momento ${i} es de cámara de seguridad Y ancla de un componente`); process.exit(1); }

const palabras = (p) => Object.values(p).flatMap((v) =>
  typeof v === "string" ? v.split(/\s+/) : Array.isArray(v) ? v.flatMap((o) => String(Object.values(o)[0]).split(/\s+/)) : []).length;

const overlaysOut = [];
let absorbidos = 0, camOut = 0;
for (let i = 0; i < MOM.length; i++) {
  const m = MOM[i];
  if (m.__skip) { absorbidos++; continue; }
  const nn = String(m.i).padStart(3, "0");
  const img = `img/${SLUG}_${nn}.jpg`;
  const clip = `${CLIP_DIR}/${SLUG}_${nn}.mp4`;
  const c = compAt.get(i);
  const ms_in = Math.round(m.t * 1000);
  const ms_out = Math.round((m.t + m.dur) * 1000);
  const clipVivo = existe(clip) && !REDIBUJADO.has(m.i) && durDe(clip) > 0.8;

  // ── CÁMARA DE SEGURIDAD: es un PLANO, no una tarjeta. Ocupa exactamente su momento.
  if (CAM[i]) {
    if (!existe(img)) { console.error(`⛔ falta la foto del plano de cámara ${i}: ${img}`); process.exit(1); }
    beats.push({ tipo: "componente", ms_in, ms_out, componente: "RaySecurityCam",
      props: { image: img, ...(clipVivo ? { clip } : {}), label: CAM[i].label, date: CAM_DATE,
        clockStart: CAM[i].clockStart, intensity: 1, push: !clipVivo } });
    camOut++;
    continue;
  }

  if (c && c.overlay) {
    // RayCta y cia. estan hechos para ir ENCIMA de metraje. Como cue BASE quedan solos sobre el
    // fondo de marca => 13 s casi negros (medido en dale1). Van a overlays y el momento conserva su plano.
    const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3));
    overlaysOut.push({ componente: c.comp, props: c.props,
      ms_in, ms_out: Math.round((m.t + Math.max(m.dur, piso)) * 1000) });
    compAt.delete(i);
  }
  if (c && !c.overlay) {
    // TIEMPO DE LECTURA: piso por texto; absorbe los momentos siguientes que caigan adentro.
    const piso = Math.min(13, 2.8 + 0.28 * Math.max(0, palabras(c.props) - 3));
    let out = m.t + Math.max(m.dur, piso);
    for (let j = i + 1; j < MOM.length && MOM[j].t < out; j++) {
      // ⛔ COMPUERTA: un componente NO puede comerse el ancla de otro (queda mudo y sin aviso),
      //    ni un plano de cámara de seguridad (se perdería el hook entero).
      if (anclas.has(j)) { console.error(`⛔ el componente ${c.comp} (momento ${i}) absorbe el ancla del componente en el momento ${j}. Movelo de frase.`); process.exit(1); }
      if (CAM[j]) { console.error(`⛔ el componente ${c.comp} (momento ${i}) absorbe el plano de cámara ${j}. Movelo de frase.`); process.exit(1); }
      MOM[j].__skip = true;
    }
    const sig = MOM.find((x) => x.t >= out && !x.__skip);
    if (sig) out = Math.max(out, sig.t);   // ESTIRA hasta el próximo beat real (recortar deja hueco)
    beats.push({ tipo: "componente", ms_in, ms_out: Math.round(out * 1000),
      componente: c.comp, props: { ...c.props, bed: existe(img) ? img : undefined } });
    continue;
  }

  if (clipVivo) {
    const cd = durDe(clip);
    // clip normal si entra; a 0,5x cuando el momento es largo (el creador lo pidió explícito)
    const usable = cd - 0.15;
    if (m.dur <= usable) beats.push({ tipo: "clip", ms_in, ms_out, clip: `${SLUG}/${SLUG}_${nn}` });
    else beats.push({ tipo: "clipslow", ms_in, ms_out, rate: Math.min(1, Math.max(0.45, usable / m.dur)),
      clip: `${SLUG}/${SLUG}_${nn}` });
  } else {
    beats.push({ tipo: "imagen", ms_in, ms_out, imagen: `${SLUG}_${nn}` });
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
const comps = new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente));
for (const o of overlaysOut) comps.add(o.componente);
console.log(`plan: ${beats.length} beats · clip ${n("clip")} · clipslow ${n("clipslow")} · imagen ${n("imagen")} · componente ${n("componente")} (absorbidos ${absorbidos})`);
console.log(`cámara de seguridad: ${camOut} planos · overlays: ${overlaysOut.length}`);
console.log(`componentes distintos: ${comps.size} (${[...comps].sort().join(", ")})`);
console.log(`total ${(TOTAL_S / 60).toFixed(2)} min · wav ${(WAV_S / 60).toFixed(2)} min`);
