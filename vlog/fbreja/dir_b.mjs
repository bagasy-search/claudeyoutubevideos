// DIRECTOR B — fbreja: POR QUÉ el aflojatodo adentro arruina la pintura (aceite que no seca, la chapa con huella, se pela en tiras) ·
// DOS MANOS FINITAS (blanda abajo, poros, filos) · LOS 5 ERRORES · LO DEL VECINO (portón pegajoso, se peló como cáscara de banana) ·
// LA PRUEBA (cuadrícula + cinta, la llave, manguera una semana) · CTA 2 (párrafos 30-58).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { RUSTY, PAINTED, CAN, HANDS, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbreja/";
export const SHOTS = [
  // ── por qué
  C(30, "", "ClChapter", { n: 3, title: "Por qué adentro la arruina", sub: "lo que muestra el video viral" }),
  S(30, "un chorro de aflojatodo en el tarro de pintura", "bi", "b_viraltin", { p: BI(`Top view of an open tin of black enamel with ${CAN} squirting into it, a stirring stick resting on the rim.`), anim: "the squirt hits the paint" }),
  S(31, "", "bi", "b_oildrop", { p: BI(`Extreme macro of a thin golden drop of penetrating oil creeping into the seam between two rusty iron parts.`) }),
  S(31, "soltar lo trabado", "bi", "st_rustybolt", { q: "rusty bolt nut", p: BI(`A rusty bolt and nut.`) }),
  S(31, "que echa el agua", "bi", "b_oilfilm", { p: BI(`Water drops beading on an oily film over a rusty metal plate.`) }),
  S(32, "", "bi", "b_dripdry", { p: BI(`Close view of a black enamel coat on iron drying to a hard satin finish.`) }),
  S(32, "la dejas aceitosa por dentro", "bi", "b_oilsep", { p: BI(`A stirring stick lifted from black paint with oily rainbow streaks separating on the surface.`) }),
  S(33, "", "av", ""),
  S(33, "Esta chapa la pinté con la mezcla del video", "cl", "c_twoplates", { p: CLP(`He holds up two small black-painted steel plates side by side in his backyard workshop, frowning at the left one.`) }),
  S(33, "me deja la huella del dedo", "bi", "b_fingerprint", { p: BI(`Extreme close view of a fingertip lifting off a black painted steel plate, leaving a sticky fingerprint in the soft paint.`), ov: { c: "ClStampOv", props: { text: "PEGA" } } }),
  S(33, "se secó en unas horas", "bi", "b_dryplate", { p: BI(`A fingertip touching a hard dry glossy black painted steel plate, no mark left.`) }),
  S(34, "", "bi", "b_peelstrips", { q: "peeling paint metal", p: BI(`Black paint peeling off an iron gate bar in long strips, orange rust underneath.`) }),
  S(34, "Y vuelve el óxido, peor que antes", "bi", "st_winterrust", { q: "rusty metal rain", p: BI(`Rain on a rusty metal railing.`) }),
  S(35, "", "c", "ClDoDont", { props: { yes: { label: "Aflojatodo ANTES", img: I + "b_spray.jpg" }, no: { label: "Aflojatodo ADENTRO", img: I + "b_oilyswirl.jpg" } } }),
  S(35, "Lo mismo que con las goteras", "c", "ClVideoRef", { props: { thumb: I + "th_prev.jpg", title: "Silicona + acetona: las goteras" } }),
  // ── dos manos
  C(36, "", "ClChapter", { n: 4, title: "Dos finitas, no una gruesa", sub: "por qué duran más" }),
  S(37, "", "bi", "b_thickcoat", { p: BI(`Close view of a thick glossy black paint coat on an iron bar, soft and sagging at the bottom.`) }),
  S(37, "se arruga como la nata de la leche hervida", "bi", "b_wrinkle", { p: BI(`Extreme close view of a thick black paint coat on metal wrinkled like the skin on boiled milk.`), ov: { c: "ClStampOv", props: { text: "ARRUGA" } } }),
  S(38, "", "bi", "b_pores", { p: BI(`Extreme macro of a single thin black paint layer on iron with tiny pinholes showing gray metal through.`) }),
  S(38, "Con dos manos finas", "c", "ClPins", { props: { img: I + "b_section.jpg", pins: [{ x: 0.5, y: 0.25, label: "2ª mano tapa los poros" }, { x: 0.5, y: 0.55, label: "1ª mano" }, { x: 0.5, y: 0.82, label: "fondo" }] } }),
  S(39, "", "bi", "b_edge", { p: BI(`Extreme close view of the sharp edge of a square iron bar where the paint is thin and a speck of rust shows.`) }),
  S(39, "La segunda mano es la que cubre los filos", "bi", "b_edgecoat", { p: BI(`A small brush running along the sharp edge of a black iron bar, laying the second coat.`), anim: "the brush runs along the edge" }),
  // ── errores
  C(40, "", "ClChapter", { n: 5, title: "Los 5 errores", sub: "de mayor a menor" }),
  S(41, "", "bi", "b_mixstir", { p: BI(`A stick stirring penetrating oil into a tin of black enamel.`), ov: { c: "ClChip", props: { text: "1 · Mezclarlo con la pintura", alert: true } } }),
  S(42, "", "bi", "b_greasybar", { p: BI(`A shiny oily iron bar with black paint beading and crawling on it instead of covering.`), ov: { c: "ClChip", props: { text: "2 · Sin alcohol", alert: true } } }),
  S(42, "Al año se pela entera", "bi", "st_peeling", { q: "peeling paint", p: BI(`Old paint peeling off a surface.`) }),
  S(43, "", "bi", "b_overcrust", { p: BI(`Fresh black paint brushed right over thick lumpy rust on an iron bar, the lumps showing through.`), ov: { c: "ClChip", props: { text: "3 · Sobre la cáscara", alert: true } } }),
  S(44, "", "bi", "b_rustweld", { p: BI(`A welded corner of a black painted gate with a rust stain bleeding out of the weld and running down the bar.`), ov: { c: "ClChip", props: { text: "4 · Sin fondo en uniones", alert: true } } }),
  S(45, "", "bi", "b_dusty", { p: BI(`A thick soft black paint coat on a gate bar with dust and a small leaf stuck in it.`), ov: { c: "ClChip", props: { text: "5 · Mano gruesa o apurada", alert: true } } }),
  // ── el vecino
  C(46, "", "ClChapter", { n: 6, title: "Lo del vecino", sub: "como en el video viral" }),
  S(47, "", "bi", "b_neighborphone", { p: BI(`${NEIGHBOR} sitting on his porch watching a video on his phone, eyebrows raised.`) }),
  S(47, "le echó un buen chorro al tarro de esmalte", "bi", "b_neighborsquirt", { p: BI(`${NEIGHBOR} squirting a spray can of penetrating oil into a tin of black enamel on his patio.`) }),
  S(47, "pintó el portón esa misma tarde", "bi", "b_neighborgate", { p: BI(`${NEIGHBOR} brushing black paint on his rusty iron garden gate in the afternoon sun.`) }),
  S(48, "", "bi", "b_stickygate", { p: BI(`Close view of a black painted iron gate bar with dry leaves, a dead fly and a smudged handprint stuck in the tacky paint.`) }),
  S(48, "la marca de la mano del cartero", "bi", "st_mailman", { q: "mailman delivering letters", p: BI(`A mail carrier delivering letters at a house.`) }),
  S(49, "", "bi", "st_frost", { q: "frost cold morning", p: BI(`Frost on a cold morning.`) }),
  S(49, "se empezó a levantar en tiras", "bi", "b_neighborpeel", { p: BI(`A strip of black paint peeling off an iron gate bar in one piece, orange rust underneath.`), anim: "the strip curls off" }),
  S(49, "como una cáscara de banana", "bi", "b_neighborstrip", { p: BI(`${NEIGHBOR} at a front door holding up a long curled strip of black paint, sheepish face.`) }),
  S(50, "", "cl", "c_together", { p: CLP(`He and a mustached neighbour in a light-blue checked shirt crouch side by side scrubbing a rusty iron garden gate with wire brushes, laughing.`) }),
  S(50, "alcohol hasta que el trapo salió limpio", "bi", "b_neighborrag", { p: BI(`${NEIGHBOR} holding up a clean white rag next to a bare iron gate, nodding.`) }),
  S(51, "", "bi", "b_neighbortalk", { p: BI(`${NEIGHBOR} at a fence explaining to another neighbour, pointing at a glossy black iron gate.`) }),
  // ── la prueba
  C(52, "", "ClChapter", { n: 7, title: "La prueba del vecino", sub: "cinta, llave y manguera" }),
  S(53, "", "bi", "b_crosshatch", { p: BI(`A utility knife cutting a tiny crosshatch grid into black paint on an iron bar.`), anim: "the blade cuts the grid" }),
  S(53, "pegó cinta de embalar y la arrancó de un tirón", "bi", "b_tapepull", { p: BI(`A strip of clear packing tape being ripped off a crosshatched black painted iron bar.`) }),
  S(53, "No se llevó ni un cuadradito", "bi", "b_cleantape", { p: BI(`A clean strip of packing tape held up in front of a black iron gate, no paint on it.`) }),
  S(54, "", "bi", "b_keyscratch", { p: BI(`A house key scratching a thin line in glossy black paint on an iron bar, gray primer showing in the line.`) }),
  S(55, "", "bi", "b_hosebottom", { p: BI(`A garden hose spraying the bottom rail of a black iron gate where it meets the patio.`) }),
  S(55, "Ni una manchita naranja", "bi", "b_bottomclean", { p: BI(`Close view of the bottom rail of a black iron gate, wet and glossy, no rust anywhere.`) }),
  S(56, "", "bi", "b_neighborlook", { p: BI(`${NEIGHBOR} straightening up in front of a glossy black iron gate, nodding, a reluctant smile under his mustache.`) }),
  S(56, "Bueno, me callo", "cl", "c_laugh", { p: CLP(`He laughs heartily in front of a glossy black iron gate, a mustached neighbour beside him shrugging.`) }),
  // ── CTA 2
  S(57, "", "av", ""),
  S(57, "setenta y seis", "c", "ClBookPage", { props: { page: I + "book_cover.jpg", pageNo: 76, qr: I + "qr.jpg", stamp: "Las 10 mezclas, gratis" } }),
  S(57, "Madera, óxido, humedad", "bi", "st_rustytools", { q: "rusty tools", p: BI(`Old rusty hand tools on a workbench.`) }),
  S(58, "", "bi", "b_shedtools", { q: "tools pegboard", p: BI(`A pegboard in a backyard shed with old rusty pliers, wrenches and a saw hanging on it.`) }),
  S(58, "No te apuro", "av", ""),
];
