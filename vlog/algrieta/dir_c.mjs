// DIRECTOR C — algrieta: 5 errores → preguntas → la prueba de $0 (la foto con la moneda) → resumen → regalo + Manual US$27 → el ropero
// de Don Ernesto (gancho al ep. 6) → cierre (párrafos 49-72).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
import { H, HALL, CRACK, BOY } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/algrieta/";
export const SHOTS = [
  C(49, "", "ClChapter", { n: 5, title: "Los 5 errores", sub: "cada uno la vuelve a abrir", alert: true }),
  S(50, "", "bi", "b_quickfill", { p: BI("A hand quickly smearing filler over a wide crack with a putty knife without checking it, the crack edges uneven.") , ov: { c: "ClChip", props: { text: "Error 1", alert: true } } }),
  S(51, "", "bi", "b_hardcrack", { p: BI("Hard white gypsum filler in a wall crack, cracked down the middle again.") , ov: { c: "ClChip", props: { text: "Error 2", alert: true } } }),
  S(52, "", "bi", "b_novgroove", { p: BI("White filler sitting only on top of a thin crack on a painted wall, peeling off at the edges.") , ov: { c: "ClChip", props: { text: "Error 3", alert: true } } }),
  S(53, "", "bi", "b_dustcrack", { p: BI("Extreme close view of a crack full of white dust and loose debris before filling.") , ov: { c: "ClChip", props: { text: "Error 4", alert: true } } }),
  S(54, "", "bi", "b_stuckdoor", { p: BI("A wooden interior door scraping against its frame at the top corner, with a diagonal crack running up from that corner on the wall.") , ov: { c: "ClChip", props: { text: "Error 5", alert: true } } }),
  C(55, "", "ClChapter", { n: 6, title: "Lo que siempre me preguntan", sub: "rapidito" }),
  S(56, "", "bi", "b_hairmap", { p: BI("A painted plaster wall with a web of fine hairline cracks, side light.") }),
  S(57, "", "bi", "b_siliconecrack", { p: BI("A dirty gray strip of silicone squeezed into a wall crack, dust stuck to it, looking bad against the paint.") }),
  S(58, "", "bi", "b_ceilingcrack", { p: BI("A fine straight crack along a white ceiling of an old room.") }),
  S(59, "", "bi", "st_newhouse", { q: "new house interior empty", p: BI("An empty newly built house interior with fresh white walls.") }),
  S(60, "", "bi", "b_rentphoto", { p: BI("A hand holding a smartphone photographing a dated plaster pill across a crack in an apartment wall.") }),
  S(61, "", "bi", "b_supplies5", { p: BI("A small bag of gypsum plaster and a tub of elastic crack filler with plain blank labels and a putty knife on a wooden stool.") }),
  S(62, "", "bi", "b_facadecrack", { p: BI("A crack on the outside front wall of an old house covered with a strip of fiberglass mesh and fresh filler, ready to paint.") }),
  S(63, "", "bi", "b_pillhard", { p: BI("Close view of a fingertip tapping a small hardened white plaster pill on a wall.") }),
  // ── la prueba de $0
  S(64, "", "av", ""),
  S(64, "sáquele una foto con el celular", "cl", "c_photo", { p: CLP(`He holds a coin flat against the wall next to the crack in ${HALL} and takes a photo with his phone.`) }),
  S(65, "", "kf", "k_compare", { p: BI("Close view of a smartphone screen showing a photo of a crack with a coin next to it for scale, a finger swiping to the next photo.") , d1: "the phone shows a crack photo with a coin", d2: "the finger swipes and an almost identical photo appears", sound: "a soft phone swipe" }),
  S(65, "Si se ve igual, está quieta", "av", ""),
  S(66, "", "bi", "b_saturdays", { p: BI("A smartphone gallery grid of many nearly identical photos of a small white plaster pill on a green wall, taken on different days.") }),
  S(66, "y Doña Marta durmió tranquila", "av", ""),
  C(67, "", "ClCheck", { title: "Todo en 30 segundos", items: ["La moneda", "Las 4 señales", "Testigo: 4 semanas", "Abrir en V · masilla elástica", "Señal = profesional"], fast: true }),
  // ── CTA 3
  S(68, "", "av", ""),
  S(68, "junto con la del aluminio y la de la cinta", "bi", "b_threetests5", { p: BI("A square of aluminum foil taped on a plaster wall, a coin standing in a thin crack beside it and a strip of brown packing tape stuck below.") }),
  C(68, "Es gratis", "ClQRCard", { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "las 3 pruebas, gratis", kicker: "REGALO · ANTES DE PINTAR" }),
  C(68, "el Manual del Albañil está en esa misma página", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "los 66 arreglos", kicker: "EL MANUAL · US$27" }),
  // ── el ropero de Don Ernesto (gancho al ep. 6)
  S(69, "", "av", ""),
  C(69, "Doña Marta me pidió que guardara la escalera", "ClHouseMap", { done: ["dormitorio", "arriba", "pared", "techo", "grieta"], next: "ropero" }),
  S(69, "Abrí la puerta, y me pegó un olor a guardado", "cl", "c_smell", { p: CLP(`He opens the doors of an old dark-wood wardrobe at the end of a hallway, recoiling slightly, wrinkling his nose at the musty smell.`) }),
  S(69, "Adentro estaba colgada toda la ropa de Don Ernesto", "bi", "b_ernestoclothes", { p: BI("Inside an old dark-wood wardrobe: a row of men's suits, white shirts and a gray felt hat on the shelf, a few faint gray spots on the shoulders, dim light.") }),
  S(70, "", "bi", "b_martahat", { p: BI(`${MARTA} holding an old gray felt man's hat against her chest in front of an open wardrobe full of men's suits, eyes down.`) }),
  C(70, "La semana que viene le muestro", "ClVideoRef", { thumb: I + "th_alolor.jpg", title: "El ropero de Don Ernesto", next: true }),
  // ── cierre
  S(71, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿La moneda entra en su grieta?" } } }),
  S(71, "Y si tiene una grieta que le da miedo", "bi", "b_fearcrack", { p: BI("A worried hand touching a crack in the corner of a window frame in an ordinary home.") }),
  S(71, "Leo todos", "av", ""),
  S(72, "", "av", ""),
];
