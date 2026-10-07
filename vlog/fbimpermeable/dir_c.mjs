// DIRECTOR C — fbimpermeable: LO QUE NO ARREGLA (membrana del techo, pared con humedad, piso de mucho paso) · VARIANTES (yeso nuevo,
// revoque que suelta polvo, mangos, puerta/mesa, cajón de plantas) · MANTENER · PREGUNTAS · RESUMEN · CTA 3 = QR · PRÓXIMO (piedra)
// (párrafos 59-84).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { YARD, BENCH, OILED, GLUE, LINSEED, HANDS, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbimpermeable/";
export const SHOTS = [
  // ── límite
  C(59, "", "ClChapter", { n: 8, title: "Lo que esto no arregla", sub: "para que no pierdas un fin de semana" }),
  S(59, "no quiero que gastes un fin de semana", "av", ""),
  S(60, "", "bi", "st_roofmembrane", { q: "roof membrane", p: BI(`A roof membrane on a flat roof.`), ov: { c: "ClChip", props: { text: "Techo: membrana", alert: true } } }),
  S(60, "no para tapar por donde entra el agua", "bi", "b_leak", { p: BI(`A water stain spreading on a ceiling with drops falling into a bucket.`) }),
  S(61, "", "bi", "b_wetwall", { q: "damp wall peeling paint", p: BI(`A damp lower wall with bubbling paint and a white salty bloom.`), ov: { c: "ClChip", props: { text: "Pared con humedad: no", alert: true } } }),
  S(61, "Pintar encima sólo la esconde", "bi", "b_paintover", { q: "painting wall roller", p: BI(`A roller painting over a damp stain on a wall, the stain still showing faintly through.`) }),
  S(62, "", "bi", "st_deck", { q: "wooden deck outdoor", p: BI(`An outdoor wooden deck.`) }),
  // ── variantes
  C(63, "", "ClChapter", { n: 9, title: "Dónde más sirve", sub: "cinco ideas" }),
  S(64, "", "bi", "b_drywall", { p: BI(`A brush priming a new plaster wall with thin milky glue primer before painting.`) }),
  S(64, "y la pintura no se chupa", "bi", "b_evenpaint", { q: "freshly painted wall", p: BI(`A freshly painted wall with an even, uniform finish, a roller tray on the floor.`) }),
  S(65, "", "bi", "b_powdery", { p: BI(`A hand brushing an old dusty render wall, dust falling.`) }),
  S(65, "lo fija", "bi", "b_fixed", { p: BI(`A brush laying milky primer on an old render wall, the surface darkening and settling.`) }),
  S(66, "", "bi", "b_toolhandles", { q: "garden tools wooden handles", p: BI(`Garden tools with dry gray cracked wooden handles leaning on a shed wall.`) }),
  S(66, "no se rajan ni te sacan astillas", "bi", "b_oilhandle", { p: BI(`A rag rubbing linseed oil into a dry wooden spade handle, the wood turning golden.`), anim: "the rag rubs the handle" }),
  S(67, "", "bi", "b_door", { q: "wooden door house exterior", p: BI(`A weathered wooden front door of a house.`) }),
  S(67, "o la mesa del jardín", "bi", "b_table", { q: "wooden garden table", p: BI(`A wooden garden table freshly oiled honey-colored in a sunny patio.`) }),
  S(68, "", "bi", "b_planter", { q: "wooden planter flowers", p: BI(`A wooden planter box with flowers, its outside freshly oiled, a plastic liner visible inside.`) }),
  // ── mantener
  C(69, "", "ClChapter", { n: 10, title: "Que dure años", sub: "tres costumbres" }),
  S(70, "", "bi", "b_droptest", { p: BI(`A water drop soaking into dull gray wood on an old bench instead of beading.`), ov: { c: "ClChip", props: { text: "Si la gota entra: otra mano" } } }),
  S(71, "", "bi", "b_wash", { q: "cleaning wooden bench", p: BI(`A rag with mild soapy water wiping an oiled wooden bench.`) }),
  S(72, "", "bi", "st_autumn", { q: "autumn leaves garden", p: BI(`Autumn leaves in a garden.`) }),
  S(72, "Madera seca, mano finita", "bi", "b_yearcoat", { q: "staining wood brush", p: BI(`A brush laying a thin yearly coat of linseed oil on a slightly weathered bench on a dry sunny day.`) }),
  // ── preguntas
  C(73, "", "ClChapter", { n: 11, title: "Lo que siempre me preguntan", sub: "seis respuestas cortas" }),
  S(74, "", "bi", "b_twocans2", { p: BI(`Two cans of linseed oil with plain labels on a workbench.`), ov: { c: "ClAsk", props: { q: "¿Crudo o cocido?", sign: "" } } }),
  S(75, "", "bi", "b_sunflower", { p: BI(`A bottle of sunflower oil next to a sticky dirty wooden board.`), ov: { c: "ClAsk", props: { q: "¿Aceite de cocina?", sign: "" } } }),
  S(76, "", "bi", "b_indoor", { p: BI(`A small indoor wooden shelf coated with diluted white glue, dry and slightly glossy.`), ov: { c: "ClAsk", props: { q: "¿Cola como barniz?", sign: "" } } }),
  S(77, "", "bi", "b_honey", { p: BI(`A pine board half oiled honey-colored next to its pale unoiled half.`), ov: { c: "ClAsk", props: { q: "¿Cambia el color?", sign: "" } } }),
  S(78, "", "bi", "b_airing", { p: BI(`A small oiled wooden cabinet airing out in a shaded backyard.`), ov: { c: "ClAsk", props: { q: "¿Huele?", sign: "" } } }),
  S(79, "", "bi", "b_roofband", { p: BI(`A flat gray concrete roof with a crack sealed by a wide band of white silicone coating, sunny.`), ov: { c: "ClAsk", props: { q: "¿Sirve para el techo?", sign: "" } } }),
  // ── resumen
  C(80, "", "ClChapter", { n: 12, title: "Todo junto", sub: "para que lo tengas" }),
  S(80, "La cola y el aceite no se mezclan", "c", "ClCheck", { props: { title: "Lo que sí funciona", items: ["Cola y aceite NO se mezclan", "Cola + 3 de agua = fondo", "Lino cocido para afuera", "Sobrante a los 20 min", "3 manos, 1 día entre", "Trapos estirados"] } }),
  S(80, "La cola es fondo, no terminación", "av", ""),
  // ── CTA 3
  C(81, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "la receta escrita + otras 9, gratis" }),
  // ── próximo
  S(82, "", "bi", "b_boilpot", { p: BI(`Gray cement balls sitting in a steaming old pot of hot water on an outdoor burner.`) }),
  S(82, "quedaron piedras que parecen de río", "bi", "b_riverstones", { p: BI(`Smooth rounded gray cement stones that look like river stones bordering a garden bed.`) }),
  C(82, "te muestro la temperatura justa", "ClVideoRef", { thumb: I + "th_next.jpg", title: "Herví cemento: piedra de río", next: true }),
  // ── cierre
  S(83, "", "av", ""),
  S(83, "El vecino ya me trajo la mesa del jardín", "bi", "b_neighbortable", { p: BI(`${NEIGHBOR} carrying a weathered wooden garden table through a gate into a patio, grinning.`) }),
  S(84, "", "av", ""),
];
