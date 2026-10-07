// DIRECTOR C — fbporcelanato: DÓNDE NO (entrada del auto, patio al sol; dónde sí) · VARIANTES (mesada, escalones, pared, dos colores)
// · MANTENER · PREGUNTAS · RESUMEN · CTA 3 = QR · PRÓXIMO (goteras) (párrafos 55-79).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { ROOM, FLOOR, HANDS, TROWEL, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbporcelanato/";
export const SHOTS = [
  // ── dónde no
  C(55, "", "ClChapter", { n: 7, title: "Dónde no hacerlo", sub: "aunque te tiente" }),
  S(55, "aunque te tiente", "av", ""),
  S(56, "", "bi", "st_cardriveway", { q: "car parking driveway", p: BI(`A car pulling into a home driveway.`), ov: { c: "ClChip", props: { text: "Entrada del auto: no", alert: true } } }),
  S(56, "el caucho caliente se pega al sellador", "bi", "b_tirestick", { p: BI(`Extreme close view of a car tire turning on a thin glossy coating, black rubber marks left behind.`) }),
  S(56, "un piso de cemento de verdad, grueso", "bi", "st_concretepour", { q: "concrete pouring driveway", p: BI(`Concrete being poured for a driveway slab.`) }),
  S(57, "", "bi", "st_sunpatio", { q: "sunny patio concrete", p: BI(`An open concrete patio in strong sun.`), ov: { c: "ClChip", props: { text: "Patio al sol: no", alert: true } } }),
  S(57, "la helada levanta las capas finitas", "bi", "st_frost", { q: "frost on ground", p: BI(`Frost on a concrete patio in the morning.`) }),
  S(57, "Galerías con techo, sí", "bi", "b_coveredporch", { p: BI(`A covered porch with ${FLOOR}, wicker chairs, rain falling outside beyond the roof edge.`) }),
  S(58, "", "bi", "b_livingroom", { q: "living room interior", p: BI(`A cozy living room with ${FLOOR}, a sofa and a rug.`) }),
  S(58, "un baño", "bi", "b_bathroom", { q: "small bathroom interior", p: BI(`A small bright bathroom with a seamless glossy pale gray polished cement floor.`) }),
  S(58, "de baldosas gastadas, siempre que estén firmes", "bi", "st_oldtiles", { q: "old worn floor tiles", p: BI(`Old worn floor tiles in a house.`) }),
  // ── variantes
  C(59, "", "ClChapter", { n: 8, title: "Dónde más queda bien", sub: "cuatro ideas" }),
  S(60, "", "bi", "b_laundry", { p: BI(`A laundry room countertop finished in seamless smooth white polished cement, a sink set in it.`) }),
  S(60, "mesadas de diseño de las revistas", "bi", "st_designkitchen", { q: "concrete countertop kitchen", p: BI(`A designer kitchen with a polished concrete countertop.`) }),
  S(61, "", "bi", "b_steps", { q: "house entrance steps", p: BI(`Three front entrance steps finished in glossy deep green polished cement, a potted plant on the side.`) }),
  S(61, "parecen nuevos", "bi", "b_stepsbefore", { q: "old concrete steps", p: BI(`Close view of worn chipped old concrete front steps.`) }),
  S(62, "", "bi", "b_bathwall", { p: BI(`A bathroom wall behind a white sink finished in seamless smooth pale gray polished cement, no tiles, no grout.`) }),
  S(62, "no junta hongos como la pastina", "bi", "st_moldgrout", { q: "mold on tile grout", p: BI(`Black mold on bathroom tile grout.`) }),
  S(63, "", "bi", "b_tapepattern", { p: BI(`Top view of blue painter's tape laid on a floor in a diamond pattern, half the diamonds already filled with terracotta-red cement.`) }),
  S(63, "sacas la cinta al otro día", "bi", "b_tapepeel", { p: BI(`A hand peeling blue painter's tape off a two-tone floor of terracotta and cream polished cement in a diamond pattern.`) }),
  S(63, "sin una sola junta", "bi", "b_twotone", { p: BI(`A floor of terracotta and cream polished cement in an old-style diamond tile pattern, glossy, no grout lines.`) }),
  // ── mantener
  C(64, "", "ClChapter", { n: 9, title: "Que dure años", sub: "tres costumbres" }),
  C(65, "Nada de ácido muriático", "ClDoDont", { yes: { label: "Trapo y detergente", img: I + "b_wipe.jpg" }, no: { label: "Ácido o antisarro", img: I + "b_acid.jpg" } }),
  S(66, "", "bi", "b_felt", { q: "chair legs floor", p: BI(`Close view of a hand sticking a round felt pad under the leg of a wooden chair on ${FLOOR}.`) }),
  S(67, "", "bi", "b_worn", { p: BI(`A teal polished cement floor in a doorway where the shine is dull in a worn walking path.`) }),
  S(67, "sólo en esa parte", "bi", "b_touchup", { p: BI(`A small roller applying sealer only on a dull worn path of a teal cement floor.`) }),
  // ── preguntas
  C(68, "", "ClChapter", { n: 10, title: "Lo que siempre me preguntan", sub: "seis respuestas cortas" }),
  S(69, "", "bi", "b_tilesanding", { p: BI(`An old glossy floor tile being scuffed with coarse sandpaper on a block.`), ov: { c: "ClAsk", props: { q: "¿Va arriba de baldosas?", sign: "" } } }),
  S(69, "rellenas primero las juntas", "bi", "b_grout", { p: BI(`A trowel filling the grout lines of old floor tiles with cement paste.`) }),
  S(70, "", "bi", "b_grayfloor", { q: "polished concrete floor", p: BI(`A small room with a seamless glossy dark charcoal-gray polished cement floor.`), ov: { c: "ClAsk", props: { q: "¿Con cemento gris?", sign: "" } } }),
  S(71, "", "bi", "b_wetfloor", { p: BI(`A bare foot stepping on a glossy cement bathroom floor with a few water drops.`), ov: { c: "ClAsk", props: { q: "¿Resbala?", sign: "" } } }),
  S(72, "", "bi", "b_crackthrough", { p: BI(`A thin crack running across a glossy teal cement floor, following an old crack below.`), ov: { c: "ClAsk", props: { q: "¿Se raja?", sign: "" } } }),
  S(73, "", "bi", "st_calendar", { q: "wall calendar", p: BI(`A wall calendar.`), ov: { c: "ClAsk", props: { q: "¿Cuánto se tarda?", sign: "" } } }),
  S(74, "", "bi", "b_paintcans", { p: BI(`Two cans of paint side by side on a workbench, one exterior acrylic latex, one glossy oil enamel, plain labels.`), ov: { c: "ClAsk", props: { q: "¿Cualquier pintura?", sign: "" } } }),
  // ── resumen
  C(75, "", "ClChapter", { n: 11, title: "Todo junto", sub: "para que lo tengas" }),
  S(75, "Dos kilos de cemento blanco", "c", "ClCheck", { props: { title: "La receta", items: ["Piso firme, limpio y húmedo", "2 kg cemento blanco + ½ l látex", "Agua de a chorritos", "Color: óxido en seco", "2 capas finitas, 24 h", "Quemar con la llana", "5 días húmedo · 2 manos de sellador"] } }),
  S(75, "La pintura pega, el óxido pinta, y la llana lustra", "av", ""),
  // ── CTA 3
  C(76, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "la receta escrita + otras 9, gratis" }),
  // ── próximo
  S(77, "", "bi", "b_roofleak", { q: "roof leak drip", p: BI(`Water dripping from a crack in a concrete ceiling into a bucket.`) }),
  S(77, "silicona con acetona", "bi", "b_siliconejar", { p: BI(`A glass jar with white silicone sealant and a splash of clear acetone being stirred with a stick on a workbench.`) }),
  C(77, "cómo hacerlo para que no se te arruine el cartucho", "ClVideoRef", { thumb: I + "th_next.jpg", title: "Silicona + acetona: las goteras", next: true }),
  // ── cierre
  S(78, "", "av", ""),
  S(78, "el verde para el quincho", "bi", "b_neighborwave", { p: BI(`${NEIGHBOR} waving over a backyard fence holding up a small bag of green pigment, grinning.`) }),
  S(79, "", "av", ""),
];
