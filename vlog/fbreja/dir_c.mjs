// DIRECTOR C — fbreja: LO QUE NO ARREGLA (perforado/hojaldre → cortar y soldar, el golpe del mango, base enterrada) · VARIANTES
// (baranda, sillas de jardín, bisagras sólo aflojatodo, herramientas → gel) · MANTENER · PREGUNTAS · RESUMEN · CTA 3 = QR ·
// PRÓXIMO (olla) (párrafos 59-83).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { RUSTY, PAINTED, CAN, HANDS, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbreja/";
export const SHOTS = [
  // ── límite
  C(59, "", "ClChapter", { n: 8, title: "Lo que esto no arregla", sub: "para que no pierdas un fin de semana" }),
  S(59, "no quiero que gastes un fin de semana", "av", ""),
  S(60, "", "bi", "b_holed", { q: "rusted through metal hole", p: BI(`Close view of an iron gate bar rusted through with a hole in it, flaky edges.`), ov: { c: "ClChip", props: { text: "Perforado: no", alert: true } } }),
  S(60, "como un hojaldre", "bi", "b_layered", { p: BI(`Extreme close view of rusted iron splitting into thin layers like puff pastry under a wire brush.`) }),
  S(60, "Ese tramo hay que cortarlo y soldar uno nuevo", "bi", "st_welding", { q: "welding metal sparks", p: BI(`A welder welding a metal bar, sparks flying.`) }),
  S(61, "", "bi", "b_tapbar", { p: BI(`The handle of a screwdriver tapping a rusty iron gate bar.`), anim: "the handle taps the bar" }),
  S(61, "Si suena firme, sirve", "bi", "b_solidbar", { q: "metal fence bars", p: BI(`A brushed dark iron gate bar, solid and straight, a screwdriver resting against it.`), ov: { c: "ClChip", props: { text: "Suena firme: sí" } } }),
  S(61, "ese pedazo está podrido por dentro", "bi", "b_dent", { p: BI(`A screwdriver handle denting a rusty iron bar that crumbles inward.`), ov: { c: "ClChip", props: { text: "Suena hueco: no", alert: true } } }),
  S(62, "", "bi", "b_buried", { p: BI(`The bottom of an iron gate post buried in a cracked concrete floor, rust bleeding out of the crack around it.`) }),
  S(62, "Ahí hay que picar alrededor", "bi", "b_chisel", { p: BI(`A hammer and cold chisel chipping the concrete around the base of a rusty iron post.`) }),
  // ── variantes
  C(63, "", "ClChapter", { n: 9, title: "Dónde más sirve", sub: "cuatro ideas" }),
  S(63, "Te muestro dónde más sirve", "av", ""),
  S(64, "", "bi", "st_railing", { q: "iron balcony railing", p: BI(`An iron balcony railing.`) }),
  S(64, "deja secar bien antes de usarla", "bi", "b_wetpaintrail", { q: "black stair railing", p: BI(`A freshly painted glossy black stair railing with a piece of cardboard tied to it, nobody touching it.`) }),
  S(65, "", "bi", "b_gardenchairs", { q: "wrought iron garden chairs", p: BI(`Two old iron garden chairs and a small round iron table on a lawn, rust on the legs.`) }),
  S(65, "unos taquitos de goma abajo", "bi", "b_rubberfeet", { p: BI(`Close view of a freshly painted black iron chair leg with a small rubber foot cap on the grass.`) }),
  S(66, "", "bi", "b_padlock", { q: "rusty padlock", p: BI(`The red straw of a spray can squirting oil into the keyhole of an old padlock on a gate.`) }),
  S(66, "abres y cierras diez veces", "bi", "b_hingeswing", { p: BI(`A hand swinging a black iron gate open and closed, the hinge glistening with fresh oil.`) }),
  S(66, "y limpias lo que chorrea", "bi", "b_wipehinge", { p: BI(`A rag wiping a trickle of oil off a black painted gate below the hinge.`) }),
  S(67, "", "bi", "b_rustyplier", { q: "rusty pliers tools", p: BI(`A pair of old rusty pliers and a rusty wrench on a wooden workbench.`) }),
  S(67, "un gel casero de dos ingredientes", "bi", "b_gelbowl", { p: BI(`A small bowl of thick beige homemade paste next to a bottle of white vinegar and a bag of flour on a workbench, rusty tools beside it.`) }),
  // ── mantener
  C(68, "", "ClChapter", { n: 10, title: "Que dure años", sub: "tres costumbres" }),
  S(69, "", "bi", "b_inspect", { q: "man inspecting gate", p: BI(`A man crouching in front of a black iron gate, looking closely at the bottom rail and the welded joints.`) }),
  S(69, "Si ves un puntito naranja", "bi", "b_rustspeck", { p: BI(`Extreme close view of a tiny orange rust speck on a glossy black painted iron bar.`), ov: { c: "ClStampOv", props: { text: "ESE MISMO DÍA" } } }),
  S(70, "", "bi", "b_touchup", { p: BI(`A fine artist brush dabbing gray primer on a tiny scraped spot on a black iron bar.`), anim: "the fine brush dabs the spot" }),
  S(71, "", "bi", "st_seaside", { q: "seaside town houses", p: BI(`Houses in a seaside town.`) }),
  S(71, "le pasas agua dulce con la manguera", "bi", "b_rinse", { q: "hose washing gate", p: BI(`A garden hose gently rinsing a black iron gate of a house near the sea.`), anim: "the water rinses down the bars" }),
  // ── preguntas
  C(72, "", "ClChapter", { n: 11, title: "Lo que siempre me preguntan", sub: "seis respuestas cortas" }),
  S(73, "", "bi", "b_oilcan", { q: "oil can machine", p: BI(`An old metal oil can with a long spout dripping machine oil on a workbench.`), ov: { c: "ClAsk", props: { q: "¿Aceite de máquina?", sign: "" } } }),
  S(74, "", "bi", "b_converter", { p: BI(`A brush applying a milky rust converter liquid on a rusty bar, the rust turning dark.`), ov: { c: "ClAsk", props: { q: "¿Convertidor de óxido?", sign: "" } } }),
  S(75, "", "bi", "st_spraypaint", { q: "spray painting metal", p: BI(`Spray painting a metal object.`), ov: { c: "ClAsk", props: { q: "¿En aerosol?", sign: "" } } }),
  S(76, "", "bi", "b_twotins", { q: "paint cans", p: BI(`A tin of gray primer and a tin of black enamel with plain labels on a patio wall.`), ov: { c: "ClAsk", props: { q: "¿Sin fondo?", sign: "" } } }),
  S(77, "", "bi", "st_wintermorning", { q: "cold winter morning street", p: BI(`A cold misty winter morning on a residential street.`), ov: { c: "ClAsk", props: { q: "¿En invierno?", sign: "" } } }),
  S(78, "", "bi", "b_oldgood", { q: "iron fence house", p: BI(`A black iron gate a few years old, slightly weathered but with no rust, in front of a house in the sun.`), ov: { c: "ClAsk", props: { q: "¿Cuánto dura?", sign: "" } } }),
  // ── resumen
  C(79, "", "ClChapter", { n: 12, title: "Todo junto", sub: "para que lo tengas" }),
  S(79, "Aflojatodo en lo oxidado", "c", "ClCheck", { props: { title: "La receta", items: ["Aflojatodo, 10 minutos", "Cepillo: sin polvo naranja", "Alcohol: trapo limpio", "Fondo en uniones y soldaduras", "2 manos finas, 8 h entre manos", "También por abajo"] } }),
  S(79, "El aflojatodo trabaja antes, no adentro", "av", ""),
  // ── CTA 3
  C(80, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "la receta escrita + otras 9, gratis" }),
  // ── próximo
  S(81, "", "bi", "b_burntpot", { q: "burnt pot", p: BI(`A stainless steel pot with a black burnt bottom in a kitchen sink.`) }),
  S(81, "para la olla quemada", "bi", "b_shinypot", { p: BI(`A clean shiny stainless steel pot on a kitchen counter in daylight.`) }),
  C(81, "te muestro cuál", "ClVideoRef", { thumb: I + "th_next.jpg", title: "Gaseosa cola + pasta de dientes: la olla", next: true }),
  // ── cierre
  S(82, "", "av", ""),
  S(82, "El vecino ya me trajo las sillas del jardín", "bi", "b_neighborchairs", { p: BI(`${NEIGHBOR} carrying two rusty iron garden chairs through a gate into a backyard workshop, grinning.`) }),
  S(83, "", "av", ""),
];
