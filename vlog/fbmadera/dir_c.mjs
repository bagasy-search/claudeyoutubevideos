// DIRECTOR C — fbmadera: EL LÍMITE (huerta, gallinero, chicos, pozo → aceite de lino cocido; guantes y trapos) · VARIANTES · CÓMO SE
// CLAVA (cemento = vaso, piedra abajo) · DE DÓNDE VIENE · MANTENER · PREGUNTAS · RESUMEN · CTA 3 = QR · PRÓXIMO (porcelanato) (55-84).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { POST, SEALED, CAN, MIX, HANDS, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbmadera/";
export const SHOTS = [
  // ── el límite
  C(55, "", "ClChapter", { n: 7, title: "Dónde no usarlo nunca", sub: "aunque funcione" }),
  S(55, "aunque funcione", "av", ""),
  S(56, "", "bi", "st_oilpan", { q: "draining engine oil", p: BI(`Black used engine oil draining from a car into a pan.`) }),
  S(56, "que no quieres en la tierra donde comes", "bi", "b_lettuce", { q: "lettuce garden soil", p: BI(`Fresh lettuce growing in dark garden soil.`) }),
  S(57, "", "bi", "st_vegrows", { q: "vegetable garden rows", p: BI(`Rows of vegetables in a home garden.`), ov: { c: "ClChip", props: { text: "Huerta: no", alert: true } } }),
  S(57, "nada de gallinero", "bi", "st_chickencoop", { q: "chicken coop wooden", p: BI(`Chickens in a wooden backyard coop.`), ov: { c: "ClChip", props: { text: "Gallinero: no", alert: true } } }),
  S(57, "nada de juegos de chicos", "bi", "st_swing", { q: "wooden swing backyard", p: BI(`A wooden swing set in a backyard.`), ov: { c: "ClChip", props: { text: "Juegos: no", alert: true } } }),
  S(57, "nada cerca de un pozo de agua", "bi", "st_well", { q: "water well", p: BI(`An old water well in a rural yard.`), ov: { c: "ClChip", props: { text: "Pozo: no", alert: true } } }),
  S(58, "", "bi", "b_linseed", { p: BI(`A metal can of boiled linseed oil next to grated white wax in a tin can on a garden bench, tomato plants behind.`) }),
  S(58, "con la misma parafina, en la misma medida", "c", "ClPasteRecipe", { props: { a: 1, b: 3, aLabel: "parafina", bLabel: "aceite de lino", note: "la versión para la huerta" } }),
  S(58, "al lado de los tomates tranquilo", "bi", "b_tomatoes", { q: "tomato plants stake", p: BI(`Tomato plants tied to honey-colored waxed wooden stakes in a sunny garden.`) }),
  S(59, "", "bi", "st_gloves", { q: "putting on work gloves", p: BI(`Hands pulling on black work gloves.`) }),
  S(59, "los trapos sucios no los quemes", "bi", "b_rags", { p: BI(`Oily rags spread out flat to dry on a wire fence in the sun, not bunched up.`), ov: { c: "ClChip", props: { text: "Extendidos, nunca en bollo", alert: true } } }),
  // ── variantes
  C(60, "", "ClChapter", { n: 8, title: "Dónde más sirve", sub: "cuatro ideas" }),
  S(61, "", "bi", "st_gate", { q: "wooden farm gate", p: BI(`An old wooden farm gate.`) }),
  S(61, "las tablas de abajo", "bi", "b_gatebottom", { p: BI(`${HANDS} brushing dark wax mix on the bottom boards and legs of a wooden garden gate.`), anim: "the brush coats the bottom board" }),
  S(62, "", "bi", "st_gardentools", { q: "garden tools shovel handle", p: BI(`Garden tools with wooden handles leaning on a wall.`) }),
  S(62, "no se rajan ni te sacan astillas", "bi", "b_handle", { p: BI(`A gloved hand rubbing dark wax mix into the wooden handle of a spade with a rag.`) }),
  S(63, "", "bi", "b_shedbottom", { p: BI(`The bottom boards of a wooden garden shed where they rest on the ground, freshly coated dark with wax.`) }),
  S(63, "Sólo las patas, ojo", "bi", "b_tablelegs", { p: BI(`An outdoor wooden table with only its legs coated dark with wax, the top left natural.`), ov: { c: "ClChip", props: { text: "Arriba mancha la ropa", alert: true } } }),
  S(64, "", "c", "ClSplit", { props: { img: I + "b_twotones.jpg", left: ["MÁS ACEITE", "color nogal"], right: ["MENOS ACEITE", "color miel"] } }),
  S(64, "La madera vieja y gris recupera color", "c", "ClBeforeAfter", { props: { before: I + "b_postgray.jpg", after: I + "b_postdone.jpg", note: "una mano tibia" } }),
  // ── cómo se clava
  C(65, "", "ClChapter", { n: 9, title: "Cómo clavarlo", sub: "el error que no es de la mezcla" }),
  S(66, "", "bi", "st_concretepost", { q: "setting fence post concrete", p: BI(`Wet concrete poured into a post hole around a wooden post.`) }),
  S(66, "hace como un vaso", "bi", "b_cupsection", { p: BI(`A cutaway view of a wooden post set in a cup of concrete in the ground, rainwater pooled at the bottom around the wood, the post base dark and rotting.`), ov: { c: "ClStampOv", props: { text: "EL AGUA SE JUNTA" } } }),
  S(67, "", "bi", "b_gravelhole", { p: BI(`Top view into a freshly dug post hole in garden soil with a layer of crushed gravel at the bottom, a dark waxed pine post being lowered in.`) }),
  S(67, "tierra apisonada de a poco", "bi", "st_tamping", { q: "tamping soil post", p: BI(`A tamping bar packing soil around a fence post.`), anim: "the bar tamps the soil" }),
  S(67, "en forma de cono", "c", "ClPins", { props: { img: I + "b_cone.jpg", pins: [{ x: 0.5, y: 0.78, label: "piedra abajo" }, { x: 0.3, y: 0.5, label: "cono: el agua escurra" }] } }),
  S(68, "", "bi", "b_tar", { p: BI(`An old farmer's hands holding the end of a wooden post over a small campfire to char it, a rural field behind.`) }),
  S(68, "con lo que hoy tienes a mano", "cl", "c_cans", { p: CLP(`He holds up a white candle in one hand and a jug of dark oil in the other, smiling, in the backyard workshop.`) }),
  // ── mantener
  C(69, "", "ClChapter", { n: 10, title: "Que dure años", sub: "tres costumbres" }),
  S(70, "", "bi", "b_checkbase", { p: BI(`A man crouching at the base of a dark waxed fence post, sprinkling water from his hand to check whether it still beads.`) }),
  S(71, "", "bi", "b_cone", { p: BI(`The base of a dark waxed pine post in garden soil with the soil mounded around it in a neat cone sloping away.`) }),
  S(72, "", "bi", "b_drillhole", { q: "drilling wood", p: BI(`A drill boring a hole through a dark waxed fence rail, pale fresh wood inside the hole.`) }),
  S(72, "pinta el corte", "bi", "b_paintcut", { p: BI(`A small brush dabbing dark wax mix into a freshly sawn pale end of a waxed wooden board.`), anim: "the brush dabs the fresh cut" }),
  // ── preguntas
  C(73, "", "ClChapter", { n: 11, title: "Lo que siempre me preguntan", sub: "seis respuestas cortas" }),
  S(74, "", "bi", "st_garage", { q: "home garage workshop", p: BI(`A home garage workshop.`), ov: { c: "ClAsk", props: { q: "¿Tiene olor?", sign: "" } } }),
  S(75, "", "bi", "b_paintpeel", { p: BI(`White paint peeling and beading off a dark waxed wooden board.`), ov: { c: "ClAsk", props: { q: "¿Se puede pintar encima?", sign: "" } } }),
  S(76, "", "bi", "st_lumberyard", { q: "fresh lumber stack", p: BI(`Fresh pale lumber stacked in a lumber yard.`), ov: { c: "ClAsk", props: { q: "¿Y la madera nueva, verde?", sign: "" } } }),
  S(77, "", "bi", "b_greenwood", { p: BI(`A stack of greenish pressure-treated pine posts in a yard.`), ov: { c: "ClAsk", props: { q: "¿Y la madera tratada?", sign: "" } } }),
  S(78, "", "bi", "st_oldfence", { q: "old wooden fence", p: BI(`An old wooden fence in a backyard.`), ov: { c: "ClAsk", props: { q: "¿Cuánto dura?", sign: "" } } }),
  S(79, "", "bi", "st_beeswax", { q: "beeswax block", p: BI(`A block of yellow beeswax.`), ov: { c: "ClAsk", props: { q: "¿Y sin parafina?", sign: "" } } }),
  // ── resumen
  C(80, "", "ClChapter", { n: 12, title: "Todo junto", sub: "para que lo tengas" }),
  S(80, "Una de parafina, tres de aceite colado", "c", "ClCheck", { props: { title: "La receta", items: ["1 parafina · 3 aceite colado", "Baño María, nunca fuego directo", "Madera seca, siempre", "Tibio, no hirviendo", "30 cm de abajo + la punta sumergida", "2ª mano al otro día · repaso anual", "Lejos de la huerta y del pozo"] } }),
  S(80, "Y lejos de la huerta y del pozo", "av", ""),
  // ── CTA 3
  C(81, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "la receta escrita + otras 9, gratis" }),
  // ── próximo
  S(82, "", "bi", "b_whitecement", { q: "white cement powder", p: BI(`A paper sack of white cement and a can of turquoise acrylic paint on a workbench.`) }),
  S(82, "un piso que parece porcelanato", "bi", "b_floorblue2", { p: BI(`Low angle view across a glossy turquoise-blue cement floor reflecting a window like porcelain tile, a bare foot stepping onto it.`) }),
  C(82, "qué es lo que de verdad le da el color", "ClVideoRef", { thumb: I + "th_next.jpg", title: "Cemento blanco + pintura: el piso", next: true }),
  // ── cierre
  S(83, "", "av", ""),
  S(83, "El vecino ya me pidió la lata", "bi", "b_neighborwave", { p: BI(`${NEIGHBOR} waving over a backyard fence holding up an empty tin can, grinning.`) }),
  S(84, "", "av", ""),
];
