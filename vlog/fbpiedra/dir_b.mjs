// DIRECTOR B — fbpiedra: POR QUÉ EL HERVOR LAS RAJA (vapor en los poros, golpes, la rajada por dentro, aparece a la semana) · POR QUÉ
// EL CALOR ACELERA (reacción, semanas vs horas, siempre caliente, las fábricas) · LOS 5 ERRORES · LO DEL VECINO (a borbotones → la
// cortadora → media piedra en cada mano) · LA PRUEBA (caída, choque, invierno) · CTA 2 (párrafos 30-59).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { YARD, STONES, POT, HANDS, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbpiedra/";
export const SHOTS = [
  // ── por qué el hervor
  C(30, "", "ClChapter", { n: 3, title: "Por qué el hervor las raja", sub: "lo que muestra el video viral" }),
  S(30, "las piedras saltando adentro", "bi", "b_viralboil", { p: BI(`Gray cement balls jumping in a pot of furiously boiling water, foam and splashes.`) }),
  S(31, "", "bi", "b_poremacro", { p: BI(`Extreme macro of the porous surface of fresh gray cement with tiny water-filled pores.`) }),
  S(31, "el vapor empuja desde adentro", "c", "ClPins", { props: { img: I + "b_section.jpg", pins: [{ x: 0.5, y: 0.45, label: "agua en los poros → vapor" }, { x: 0.72, y: 0.7, label: "rajaduras finitas por dentro" }] } }),
  S(32, "", "bi", "b_knock", { p: BI(`Close view of two gray cement balls knocking together at the bottom of a pot of boiling water.`) }),
  S(33, "", "av", ""),
  S(33, "Ésta la herví fuerte", "cl", "c_twostones", { p: CLP(`He holds a gray cement stone in each hand in ${YARD}, about to knock them together, eyebrows raised at the camera.`) }),
  S(33, "se parte al medio", "bi", "b_breaks", { p: BI(`A gray cement stone splitting in two halves as it is knocked against another stone over a patio.`), ov: { c: "ClStampOv", props: { text: "RAJADA" } } }),
  S(33, "una rajadura de lado a lado", "bi", "b_brokenhalf", { p: BI(`Close view of a smooth gray cement pebble split in two halves on patio tiles, the flat sandy gray inside showing a thin crack line.`) }),
  S(34, "", "bi", "b_lookgood", { p: BI(`Smooth gray cement stones fresh out of a pot steaming on a towel, looking perfect.`) }),
  S(34, "con el primer golpe o la primera helada", "bi", "st_frostgrass", { q: "frost on grass", p: BI(`Frost on grass.`) }),
  S(35, "", "c", "ClDoDont", { props: { yes: { label: "Que humee", img: I + "b_steam.jpg" }, no: { label: "A borbotones", img: I + "b_ragingboil.jpg" } } }),
  S(35, "Lo mismo que con la cola blanca", "c", "ClVideoRef", { props: { thumb: I + "th_prev.jpg", title: "Cola blanca + aceite: la manguera" } }),
  // ── el calor
  C(36, "", "ClChapter", { n: 4, title: "Horas, no semanas", sub: "el calor acelera" }),
  S(37, "", "bi", "b_hardening", { p: BI(`A gray cement stone resting in warm water, tiny bubbles clinging to its surface.`) }),
  S(37, "con calor va más rápido", "bi", "st_steamwater", { q: "steam hot water", p: BI(`Steam rising from hot water.`) }),
  S(38, "", "bi", "b_shade", { p: BI(`Gray cement stones sitting in a bucket of water in the shade of a backyard.`), ov: { c: "ClChip", props: { text: "Al aire: semanas" } } }),
  S(38, "en unas horas ya está dura", "bi", "b_scratch", { p: BI(`A screwdriver tip scratching a cured gray cement stone and barely marking it.`), ov: { c: "ClChip", props: { text: "Agua caliente: horas" } } }),
  S(39, "", "bi", "b_keepwarm", { q: "gas burner knob", p: BI(`A hand adjusting the gas knob of a backyard burner under a steaming pot.`) }),
  S(40, "", "bi", "st_blockfactory", { q: "concrete block factory", p: BI(`Concrete blocks stacked in a factory yard.`) }),
  S(40, "en una olla vieja", "bi", "b_oldpot", { q: "old cooking pot", p: BI(`${POT} on a backyard burner with steam rising, a brick wall behind.`) }),
  // ── errores
  C(41, "", "ClChapter", { n: 5, title: "Los 5 errores", sub: "de mayor a menor" }),
  S(42, "", "bi", "b_boilerr", { p: BI(`A pot boiling hard with gray stones rattling inside, steam everywhere.`), ov: { c: "ClChip", props: { text: "1 · A borbotones", alert: true } } }),
  S(43, "", "bi", "b_watery", { q: "wet mortar trowel", p: BI(`A runny gray mortar dripping off a trowel, too much water.`), ov: { c: "ClChip", props: { text: "2 · Mezcla aguada", alert: true } } }),
  S(44, "", "bi", "b_early", { p: BI(`A soft gray cement ball deforming in a hand right after peeling the balloon, mud oozing.`), ov: { c: "ClChip", props: { text: "3 · Cortar antes del día", alert: true } } }),
  S(45, "", "bi", "b_coldwater", { p: BI(`Hot steaming stones being dropped into a bucket of cold water.`), ov: { c: "ClChip", props: { text: "4 · Frío de golpe", alert: true } } }),
  S(46, "", "bi", "b_pure", { p: BI(`A pale gray stone made of pure cement with a network of fine cracks on its surface.`), ov: { c: "ClChip", props: { text: "5 · Sin arena", alert: true } } }),
  // ── el vecino
  C(47, "", "ClChapter", { n: 6, title: "Lo del vecino", sub: "a borbotones, una hora" }),
  S(48, "", "bi", "b_neighborballoons", { p: BI(`${NEIGHBOR} at a table filling balloons with gray mortar through a funnel, focused.`) }),
  S(48, "a fuego fuerte, a borbotones, una hora", "bi", "b_neighborpot", { p: BI(`${NEIGHBOR} watching a big pot boil hard on an outdoor burner, gray balls tumbling inside.`), anim: "the water boils hard" }),
  S(49, "", "bi", "b_neighborbed", { p: BI(`${NEIGHBOR} proudly showing a flower bed edged with gray stones to his wife.`) }),
  S(50, "", "bi", "b_neighborhalves", { p: BI(`${NEIGHBOR} at a front door holding half a broken gray stone in each hand, sheepish face.`) }),
  S(50, "Había pasado la cortadora de pasto", "bi", "st_mower", { q: "lawn mower cutting grass", p: BI(`A lawn mower cutting grass.`) }),
  S(50, "había otras tres rajadas solas", "bi", "b_cracked3", { p: BI(`Three gray cement stones with cracks along a flower bed edge.`) }),
  S(51, "", "cl", "c_together", { p: CLP(`He and a mustached neighbour in a light-blue checked shirt sit on stools by a steaming pot on a backyard burner, the neighbour peering into it, both laughing.`) }),
  S(51, "mirando el fondo como si fuera la tele", "bi", "b_neighborstare", { p: BI(`${NEIGHBOR} sitting on a stool staring intently into a steaming pot, chin in hand.`) }),
  S(52, "", "bi", "b_neighbortalk", { p: BI(`${NEIGHBOR} at a fence explaining to another neighbour, holding up a smooth gray stone.`) }),
  // ── la prueba
  C(53, "", "ClChapter", { n: 7, title: "La prueba del vecino", sub: "caída, choque e invierno" }),
  S(54, "", "bi", "b_drop", { p: BI(`A smooth gray cement stone falling from waist height onto a concrete patio.`) }),
  S(54, "Una se peló un poquito en la punta", "bi", "b_chip", { p: BI(`Close view of a gray cement stone with a tiny chip on one tip, otherwise intact.`) }),
  S(55, "", "bi", "b_clack", { p: BI(`Two hands knocking two smooth gray stones together hard.`) }),
  S(56, "", "bi", "b_frozenbed", { q: "frost garden", p: BI(`Gray stones along a flower bed edge covered in frost on a winter morning.`) }),
  S(56, "En la primavera", "bi", "b_spring", { q: "spring flower bed", p: BI(`Smooth gray stones edging a flower bed with spring flowers blooming.`) }),
  S(57, "", "bi", "b_neighborwet", { p: BI(`${NEIGHBOR} crouching to splash water on a gray stone and admiring its shine, a reluctant smile.`) }),
  S(57, "Bueno, me callo", "cl", "c_laugh", { p: CLP(`He laughs heartily next to a flower bed edged with gray stones in ${YARD}, a mustached neighbour beside him shrugging.`) }),
  // ── CTA 2
  S(58, "", "av", ""),
  S(58, "setenta y seis", "c", "ClBookPage", { props: { page: I + "book_cover.jpg", pageNo: 76, qr: I + "qr.jpg", stamp: "Las 10 mezclas, gratis" } }),
  S(58, "Cemento, madera, humedad", "bi", "st_concretepath", { q: "concrete garden path", p: BI(`A concrete garden path.`) }),
  S(59, "", "bi", "b_washedstone", { p: BI(`A patio floor of exposed-aggregate washed concrete with small pebbles showing.`) }),
  S(59, "No te apuro", "av", ""),
];
