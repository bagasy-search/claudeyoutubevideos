// gen_abuela3_plan.mjs — DIRECTOR → _v3/abuela3_plan.json  (canal Abuela Rosa, NARRADOR PURO)
//
//   node gen_abuela3_plan.mjs        # momentos + assets en disco -> plan
//   node build_abuela3.mjs           # plan -> cues + Main + index + _dale6_assets.txt
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

const SLUG = "abuela3";
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
  { frag: "el pan no se tira nunca", comp: "RayChecklist",
    props: { kicker: "LA REGLA DE LA CASA", title: "En una casa pobre el pan no se tira nunca", items: [
      { text: "El pan de hoy se come" },
      { text: "El pan de ayer se moja en el caldo" },
      { text: "El pan de tres dias es budin, migas o pan rallado" }] } },
  { frag: "Éramos siete", comp: "BigStat",
    props: { value: "7", unit: "PLATOS, TODAS LAS NOCHES", caption: "Siete hijos en una casa donde nunca hubo dinero. Ninguno se fue a dormir con la panza vacia.", tone: "brass" } },
  { frag: "Y quiero que entiendas una cosa", comp: "CheckCard",
    props: { kicker: "ANTES DE EMPEZAR", title: "Esta no es una lista de comida triste", items: [
      { text: "No comiamos esto porque no habia otra cosa" },
      { text: "Comiamos esto y estaba rico" },
      { text: "La casa olia, y esa es la parte que se perdio" }] } },
  { frag: "pero lo conocen mal", comp: "MythTruth",
    // ⛔ MythTruth NO tiene mythLabel/truthLabel (los ignora en silencio): sus props son
    //    kicker | myth | truth | bed. Lo caza scripts/check_props.mjs.
    props: { kicker: "EL BUDIN DE PAN · LO QUE SE CREE Y LO QUE ERA",
      myth: "Un postre de reposteria, con crema, dulce de leche y pasas.",
      truth: "Pan de tres dias remojado en leche hasta hacerse papilla, azucar quemada en el molde, y nada mas. Pan viejo, leche y paciencia." } },
  { frag: "era la caja fuerte de la casa", comp: "PullQuote",
    props: { quote: "Mientras hubiera harina, no habia hambre.",
      attrib: "La bolsa de harina · la caja fuerte de una casa pobre" } },
  { frag: "Hoy la gente compra carne", comp: "SplitVs",
    props: { leftLabel: "HOY", leftValue: "SE COMPRA CARNE", rightLabel: "ANTES", rightValue: "SE COMPRABA HUESO",
      verdict: "De un hueso salian dos comidas y la semana entera. De un bife sale un plato." } },
  { frag: "la carnicería te tira o te lo regala", comp: "BigStat",
    props: { value: "$0", unit: "LO MAS RICO DE LA SEMANA", caption: "El tuetano del hueso, untado en pan caliente con sal. Le tocaba al mas chico de la mesa.", tone: "danger" } },
  { frag: "que era el supermercado de atrás de casa", comp: "WorstSpots",
    props: { kicker: "DE DONDE SALIA TODO", title: "La huerta y el gallinero", spots: [
      { label: "Acelga" }, { label: "Berenjena" }, { label: "Calabaza" },
      { label: "Guisantes" }, { label: "Huevos" }] } },
  { frag: "dos horas revolviendo a fuego bajo", comp: "ProcessChips",
    props: { kicker: "DULCE DE LECHE CASERO", title: "Una tarde entera de tres mujeres", steps: [
      { title: "Leche, azucar y bicarbonato" }, { title: "Fuego bajo, dos horas" },
      { title: "Revolver sin distraerse" }, { title: "Por turnos con la cuchara" }] } },
  { frag: "Porque no era una comida de pobre", comp: "PullQuote",
    props: { quote: "Era una comida de alguien que te queria y no tenia con que demostrartelo, y encontro la manera igual.",
      attrib: "Sopas de leche · el plato numero uno" } },
  { frag: "Todo esto, con las medidas de verdad", comp: "RayCta",
    props: { eyebrow: "PARA LOS QUE COCINAN PARA UNO", title: "El Recetario para la Mesa de Uno",
      sub: "Las medidas exactas · las cantidades para una sola persona · el orden en que se hacen · y las hojas para anotar las tuyas",
      domain: "Abajo, en la descripcion", showQr: false }, overlay: true },
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
