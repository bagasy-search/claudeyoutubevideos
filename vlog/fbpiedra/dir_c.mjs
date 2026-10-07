// DIRECTOR C — fbpiedra: LO QUE NO ARREGLA (decorativas, nunca en el fuego, no gigantes) · VARIANTES (maceta, camino plano, colores,
// pisapapeles) · MANTENER · PREGUNTAS · RESUMEN · CTA 3 = QR · CIERRE DE LA SERIE → el video 1 (granito) (párrafos 60-84).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { YARD, STONES, POT, HANDS, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbpiedra/";
export const SHOTS = [
  // ── límite
  C(60, "", "ClChapter", { n: 8, title: "Lo que esto no arregla", sub: "son decorativas" }),
  S(60, "no quiero que gastes un fin de semana", "av", ""),
  S(61, "", "bi", "b_path", { q: "garden path stones", p: BI(`Gray cement stones bordering a garden path in a sunny backyard.`), ov: { c: "ClChip", props: { text: "Decorar: sí" } } }),
  S(61, "ni para nada que cargue peso", "bi", "st_stonewall", { q: "stone wall", p: BI(`A stone retaining wall.`), ov: { c: "ClChip", props: { text: "Muro o carga: no", alert: true } } }),
  S(62, "", "bi", "st_campfire", { q: "campfire stones", p: BI(`A campfire ringed with stones.`), ov: { c: "ClChip", props: { text: "Cerca del fuego: nunca", alert: true } } }),
  S(63, "", "bi", "b_huge", { p: BI(`A huge cracked gray cement ball the size of a watermelon on a lawn.`) }),
  // ── variantes
  C(64, "", "ClChapter", { n: 9, title: "Dónde más sirve", sub: "cuatro ideas" }),
  S(65, "", "bi", "b_potstones", { q: "pebbles plant pot", p: BI(`A big terracotta plant pot with small gray cement stones covering the soil around the plant.`) }),
  S(66, "", "bi", "b_stepping", { q: "stepping stones lawn", p: BI(`Flat round gray cement stepping stones set into a lawn, leading to a back door.`) }),
  S(66, "con el globo bien aplastado, como un pan", "bi", "b_flatten", { p: BI(`A gloved hand flattening a mortar-filled balloon on sand into a flat round shape.`), anim: "the hand presses it flat" }),
  S(67, "", "bi", "b_pigment", { p: BI(`A spoon of red iron-oxide pigment powder added to dry cement and sand in a tub.`) }),
  S(67, "Rojizas, ocres, negras", "bi", "b_colors", { p: BI(`Smooth cement stones in reddish, ochre, black and gray tones mixed along a flower bed edge.`) }),
  S(68, "", "bi", "b_paperweight", { q: "stone on desk", p: BI(`A small polished gray cement stone used as a paperweight on a stack of papers on a wooden desk.`) }),
  // ── mantener
  C(69, "", "ClChapter", { n: 10, title: "Que duren años", sub: "tres costumbres" }),
  S(70, "", "bi", "b_rewax", { q: "garden stones", p: BI(`A rag rewaxing gray stones along a flower bed edge on a sunny day.`), anim: "the rag rubs the wax" }),
  S(71, "", "bi", "b_brushclean", { q: "cleaning stone brush", p: BI(`A soft brush and a little water cleaning soil off a gray stone.`) }),
  S(72, "", "bi", "b_mowerborder", { q: "lawn edge garden bed", p: BI(`A strip of uncut grass left around a flower bed edged with gray stones, a lawn mower parked further away.`) }),
  // ── preguntas
  C(73, "", "ClChapter", { n: 11, title: "Lo que siempre me preguntan", sub: "seis respuestas cortas" }),
  S(74, "", "bi", "b_white", { q: "white pebbles", p: BI(`Pale white cement stones next to gray ones on a table.`), ov: { c: "ClAsk", props: { q: "¿Con cemento blanco?", sign: "" } } }),
  S(75, "", "bi", "b_sandpile", { q: "pile of sand", p: BI(`A small pile of fine sand next to a bag of cement.`), ov: { c: "ClAsk", props: { q: "¿Sin arena?", sign: "" } } }),
  S(76, "", "bi", "b_roughpot", { q: "old metal pot", p: BI(`The rough gray-stained inside of an old pot used for cement.`), ov: { c: "ClAsk", props: { q: "¿La olla de la cocina?", sign: "" } } }),
  S(77, "", "bi", "b_bucketshade", { q: "bucket of water garden", p: BI(`A bucket of water with gray stones inside in the shade of a tree.`), ov: { c: "ClAsk", props: { q: "¿Sin agua caliente?", sign: "" } } }),
  S(78, "", "bi", "st_aquarium", { q: "fish aquarium", p: BI(`A home fish aquarium.`), ov: { c: "ClAsk", props: { q: "¿Para la pecera?", sign: "" } } }),
  S(79, "", "bi", "b_bubblesup", { p: BI(`Close view of bubbles starting to rise from the bottom of a pot of water with a stone inside.`), ov: { c: "ClAsk", props: { q: "¿Sin termómetro?", sign: "" } } }),
  // ── resumen
  C(80, "", "ClChapter", { n: 12, title: "Todo junto", sub: "para que lo tengas" }),
  S(80, "Una de cemento y dos de arena fina", "c", "ClCheck", { props: { title: "La receta", items: ["1 cemento + 2 arena fina", "Espeso como puré", "Al globo, 24 h en arena", "Agua que humea, 2-3 h", "Enfriar en el agua", "Lija al agua + cera"] } }),
  S(80, "Que humee, que no hierva", "av", ""),
  // ── CTA 3
  C(81, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "la receta escrita + otras 9, gratis" }),
  // ── el primero de la serie
  S(82, "", "bi", "b_tenmixes", { p: BI(`A backyard table with small samples of ten home projects: a granite-look cement tile, an oiled wood block, a black painted iron bar, a shiny pot, smooth gray stones.`) }),
  S(82, "la del cemento con barniz que parece granito", "bi", "b_granite2", { p: BI(`A cement tabletop with a glossy varnish finish that looks like dark speckled granite.`) }),
  C(82, "Es la que más me preguntan", "ClVideoRef", { thumb: I + "th_next.jpg", title: "Cemento + barniz: parece granito" }),
  // ── cierre
  S(83, "", "av", ""),
  S(83, "quiere las piedras rojizas", "bi", "b_neighborred", { p: BI(`${NEIGHBOR} holding up a reddish cement stone next to his flower bed, grinning.`) }),
  S(84, "", "av", ""),
];
