// DIRECTOR B — fbimpermeable: POR QUÉ LA COLA SE DESHACE (hecha con agua, la tabla de leche, el aceite no se mezcla, colas de exterior)
// · COCINA vs LINO (no seca/rancio vs se endurece, cocido vs crudo, sacar el de cocina) · LOS 5 ERRORES · LO DEL VECINO (banco blanco,
// fritura, el pantalón) · LA PRUEBA (uña, gota con reloj, manguera, noche de lluvia + pantalón bueno) · CTA 2 (párrafos 28-58).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { YARD, BENCH, OILED, GLUE, LINSEED, HANDS, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbimpermeable/";
export const SHOTS = [
  // ── por qué la cola
  C(28, "", "ClChapter", { n: 3, title: "Por qué la cola se deshace", sub: "lo que vende el video viral" }),
  S(28, "la cola seca queda brillante, como plástico", "bi", "b_glossyglue", { p: BI(`A pine board with a dry glossy coat of white glue shining in the sun like plastic.`) }),
  S(29, "", "bi", "b_gluedrip", { p: BI(`Extreme close view of white glue dripping from the nozzle of a bottle.`) }),
  S(29, "Es un plástico finito, disuelto en agua", "c", "ClPins", { props: { img: I + "b_glueboard.jpg", pins: [{ x: 0.35, y: 0.4, label: "seca: el agua se va" }, { x: 0.65, y: 0.65, label: "llueve: el agua vuelve y la ablanda" }] } }),
  S(29, "y la ablanda", "bi", "st_rainwood", { q: "rain on wood", p: BI(`Rain falling on wooden boards.`) }),
  S(30, "", "av", ""),
  S(30, "Esta tabla tiene sólo cola", "cl", "c_board", { p: CLP(`He holds up a pine board with a glossy white glue coat in ${YARD}, a garden hose in the other hand, looking at the camera.`) }),
  S(30, "se pone blanca como leche", "bi", "b_whiten", { p: BI(`A glue-coated board under running water, the coat turning milky white.`), anim: "the coat turns milky", ov: { c: "ClStampOv", props: { text: "BLANCA" } } }),
  S(30, "si la toco, pega", "bi", "b_sticky", { p: BI(`A fingertip pulling away from a soft wet white glue film, strings of glue stretching.`) }),
  S(31, "", "bi", "b_jarsplit", { p: BI(`A glass jar where yellow oil has separated on top of white glue, a spoon beside it.`) }),
  S(31, "manchas de cola por un lado y de aceite por el otro", "bi", "b_blotchy", { p: BI(`Close view of a board painted with glue and oil: oily shiny patches and dull white glue patches side by side.`) }),
  S(32, "", "bi", "b_extglue", { q: "wood glue", p: BI(`A bottle of exterior wood glue with a plain label next to a bottle of ordinary white glue.`) }),
  S(33, "", "c", "ClDoDont", { props: { yes: { label: "Cola = fondo", img: I + "b_primed.jpg" }, no: { label: "Cola = terminación", img: I + "b_milky.jpg" } } }),
  S(33, "Lo mismo que con el gel del óxido", "c", "ClVideoRef", { props: { thumb: I + "th_prev.jpg", title: "Gel quita-óxido de 2 ingredientes" } }),
  // ── aceites
  C(34, "", "ClChapter", { n: 4, title: "Cocina no, lino sí", sub: "uno seca, el otro no" }),
  S(35, "", "bi", "st_cookingoil", { q: "cooking oil bottle", p: BI(`Bottles of cooking oil.`) }),
  S(35, "pegajoso, junta tierra", "bi", "b_dirtyoil", { p: BI(`A wooden slat wet with cooking oil with dirt, a dead leaf and an ant stuck on it.`) }),
  S(35, "se pone rancio y huele mal", "bi", "b_rancid", { p: BI(`A man wrinkling his nose next to an old oily wooden bench.`) }),
  S(36, "", "bi", "b_hardened", { p: BI(`Extreme close view of oiled pine with the oil hardened inside the grain, satin and dry to the touch.`) }),
  S(36, "como una resina adentro de los poros", "bi", "b_resin", { p: BI(`Extreme macro of wood pores filled with a hardened amber resin.`) }),
  S(37, "", "bi", "b_twocans", { q: "paint cans shelf", p: BI(`Two cans of linseed oil with plain labels side by side, one raw and one boiled, on a paint store counter.`), ov: { c: "ClChip", props: { text: "COCIDO: 1 día por mano" } } }),
  S(38, "", "bi", "b_scrub", { p: BI(`A brush scrubbing an old oily bench slat with hot soapy water in a bucket.`) }),
  S(38, "el de lino no se agarra", "bi", "b_beadoil", { p: BI(`Linseed oil beading and refusing to soak into a slat still greasy with cooking oil.`) }),
  // ── errores
  C(39, "", "ClChapter", { n: 5, title: "Los 5 errores", sub: "de mayor a menor" }),
  S(40, "", "bi", "b_mixerr", { p: BI(`A spoon stirring cooking oil into white glue in a mayonnaise jar.`), ov: { c: "ClChip", props: { text: "1 · Mezclar cola y aceite", alert: true } } }),
  S(41, "", "bi", "b_outdoorglue", { p: BI(`A garden chair coated in white glue turned blotchy white in the rain.`), ov: { c: "ClChip", props: { text: "2 · Cola como terminación", alert: true } } }),
  S(42, "", "bi", "b_tackylayer", { p: BI(`A thick glossy sticky layer of oil on a wooden tabletop with dust and pollen stuck to it.`), ov: { c: "ClChip", props: { text: "3 · Sin sacar el sobrante", alert: true } } }),
  S(43, "", "bi", "b_thickoil", { p: BI(`A wooden slat with a dark wrinkled soft skin of thick oil on top.`), ov: { c: "ClChip", props: { text: "4 · Una mano gruesa", alert: true } } }),
  S(44, "", "bi", "b_bin", { p: BI(`Crumpled oily rags stuffed into a plastic trash bin in a garage.`), ov: { c: "ClChip", props: { text: "5 · Trapos en bollo", alert: true } } }),
  // ── el vecino
  C(45, "", "ClChapter", { n: 6, title: "Lo del vecino", sub: "el banco del jardín" }),
  S(46, "", "bi", "b_mayojar", { p: BI(`${NEIGHBOR} in his kitchen shaking a mayonnaise jar of white glue and sunflower oil.`) }),
  S(46, "le dio tres manos al banco del jardín", "bi", "b_neighborpaint", { p: BI(`${NEIGHBOR} brushing a shiny streaky coat onto ${BENCH} in his front garden.`) }),
  S(46, "Quedó brillante, y él orgulloso", "bi", "b_proud", { p: BI(`${NEIGHBOR} standing hands on hips next to a glossy coated wooden bench, very proud.`) }),
  S(47, "", "bi", "st_rain", { q: "rain garden", p: BI(`Rain falling on a garden.`) }),
  S(47, "el banco estaba blanco", "bi", "b_whitebench2", { p: BI(`A wooden garden bench in the morning after rain covered in a blotchy milky white film.`) }),
  S(47, "olía a fritura vieja", "bi", "b_sniff", { p: BI(`${NEIGHBOR} bending over his wooden bench sniffing it, grimacing.`) }),
  S(48, "", "bi", "b_trousers", { p: BI(`${NEIGHBOR} at a front door holding up a pair of trousers with a white sticky stain on the seat, sheepish face.`) }),
  S(48, "Le dije que me trajera el banco a casa", "av", ""),
  S(49, "", "bi", "b_washbench", { p: BI(`A brush with hot soapy water scrubbing a white sticky film off wooden bench slats.`), anim: "the brush scrubs the film off" }),
  S(49, "La segunda la hicimos juntos", "cl", "c_together", { p: CLP(`He and a mustached neighbour in a light-blue checked shirt kneel on each side of a wooden bench in ${YARD}, oiling the slats with brushes, laughing.`) }),
  S(49, "con los trapos estirados en la soga", "bi", "b_clothesline", { p: BI(`Oily rags hung spread out on a backyard clothesline next to some laundry.`) }),
  S(50, "", "bi", "b_neighbortalk", { q: "neighbors talking fence", p: BI(`${NEIGHBOR} at a fence explaining to another neighbour, pointing at a honey-colored oiled bench.`) }),
  // ── la prueba
  C(51, "", "ClChapter", { n: 7, title: "La prueba del vecino", sub: "uña, gota, manguera y lluvia" }),
  S(52, "", "bi", "b_nail", { p: BI(`A thumbnail scraping across an oiled honey-colored bench slat, leaving no mark.`) }),
  S(53, "", "bi", "b_watch", { p: BI(`A round water drop on an oiled bench slat next to a wristwatch laid on the wood.`) }),
  S(53, "abajo, la madera seca", "bi", "b_dryunder", { p: BI(`A fingertip wiping away a water drop from oiled wood, the wood dry underneath.`) }),
  S(54, "", "bi", "b_hosebench2", { p: BI(`A garden hose spraying an oiled wooden bench for minutes, water running off.`), anim: "the hose sprays" }),
  S(54, "buscando una mancha blanca", "bi", "b_crouch", { p: BI(`${NEIGHBOR} crouching beside a wet oiled bench, peering sideways along the slats.`) }),
  S(55, "", "bi", "st_nightrain", { q: "rain at night garden", p: BI(`Rain at night in a garden.`) }),
  S(55, "se sentó con su pantalón bueno", "bi", "b_sit", { p: BI(`${NEIGHBOR} in pressed trousers sitting down carefully on a damp oiled wooden bench in the morning.`) }),
  S(55, "se miró atrás, y nada", "bi", "b_lookback", { p: BI(`${NEIGHBOR} standing up and twisting to look at the seat of his trousers, clean.`) }),
  S(56, "", "bi", "b_relax", { p: BI(`${NEIGHBOR} settling back comfortably on an oiled wooden bench, arms spread on the backrest, smiling.`) }),
  S(56, "Bueno, me callo", "cl", "c_laugh", { p: CLP(`He laughs heartily next to an oiled wooden bench in ${YARD}, a mustached neighbour sitting on it shrugging.`) }),
  // ── CTA 2
  S(57, "", "av", ""),
  S(57, "setenta y seis", "c", "ClBookPage", { props: { page: I + "book_cover.jpg", pageNo: 76, qr: I + "qr.jpg", stamp: "Las 10 mezclas, gratis" } }),
  S(57, "Humedad, madera, óxido", "bi", "st_dampwall", { q: "damp wall stain", p: BI(`A damp stained wall.`) }),
  S(58, "", "bi", "b_dampcorner", { p: BI(`A damp corner of a room with peeling paint and a dark stain.`) }),
  S(58, "No te apuro", "av", ""),
];
