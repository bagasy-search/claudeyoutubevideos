// DIRECTOR C — alhumedad: la barrera (cuando no alcanza) → 5 errores → preguntas → la prueba de $0 (la raya de lápiz) → resumen →
// regalo "Antes de Pintar" + Manual US$27 → la gotera de la cocina (gancho al ep. 4) → cierre (párrafos 49-73).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
import { H, SALA, WALLB, NIECE } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/alhumedad/";
export const SHOTS = [
  // ── la barrera
  S(49, "", "av", ""),
  S(49, "Una fila de agujeros a quince centímetros del piso", "bi", "b_holes", { q: "drill holes brick wall", p: BI("A row of small drilled holes about fifteen centimeters above the floor along the bottom of a brick wall, evenly spaced, a drill lying on the floor.") }),
  S(49, "se inyecta una crema contra la humedad", "kf", "k_inject", { p: BI(`Close view of ${H} squeezing white damp-proofing cream from a caulking gun into a drilled hole at the bottom of a brick wall.`), d1: "the nozzle goes into the hole", d2: "the white cream fills the hole to the brim", sound: "a caulking gun clicking" }),
  S(50, "", "bi", "st_drill", { q: "drilling wall drill", p: BI("A drill making a hole in a brick wall, dust coming out.") }),
  S(50, "saque la tierra primero", "bi", "b_soilaway", { p: BI("A small pile of dark soil in a wheelbarrow in a patio next to an emptied brick planter against a house wall.") }),
  // ── errores
  C(51, "", "ClChapter", { n: 5, title: "Los 5 errores", sub: "cada uno la infla otra vez", alert: true }),
  S(52, "", "bi", "b_glossyroll", { q: "painting wall roller", p: BI("A roller loaded with shiny waterproof paint rolling over a damp stained wall bottom.") , ov: { c: "ClChip", props: { text: "Error 1", alert: true } } }),
  S(53, "", "bi", "b_wash", { q: "washing wall sponge", p: BI("A hand washing a salty white wall bottom with a wet sponge, water dripping down the wall.") , ov: { c: "ClChip", props: { text: "Error 2", alert: true } } }),
  S(54, "", "bi", "b_smallpatch", { p: BI("A small neat patch of fresh render only over a stain at the bottom of a wall, with new white salt already appearing just above the patch.") , ov: { c: "ClChip", props: { text: "Error 3", alert: true } } }),
  S(55, "", "bi", "b_wetrender", { p: BI("A roller painting over a still dark, wet-looking fresh cement render at the bottom of a wall.") , ov: { c: "ClChip", props: { text: "Error 4", alert: true } } }),
  S(56, "", "bi", "b_planterfull", { p: BI("A brick planter full of wet soil and flowers pressed against the outside wall of a house, the wall above it dark with damp.") , ov: { c: "ClChip", props: { text: "Error 5", alert: true } } }),
  // ── preguntas
  C(57, "", "ClChapter", { n: 6, title: "Lo que siempre me preguntan", sub: "rapidito" }),
  S(58, "", "bi", "b_plasterfail", { p: BI("A patch of white gypsum plaster at the bottom of a wall crumbling and falling apart, damp and stained.") }),
  S(59, "", "bi", "st_dehumid", { q: "dehumidifier", p: BI("A small dehumidifier on the floor of a living room.") }),
  S(60, "", "bi", "b_woodskirting", { p: BI("A wooden skirting board on a wall bottom, rotten and black at its lower edge, the wall above it stained higher with damp.") }),
  S(61, "", "bi", "st_newhouse", { q: "new house construction", p: BI("A new small house under construction with fresh brick walls.") }),
  S(62, "", "bi", "st_landlord", { q: "landlord tenant talking", p: BI("Two people talking at the door of a house.") }),
  S(63, "", "bi", "b_supplies", { q: "construction materials bags", p: BI("A bag of cement, a bag of fine sand, a plastic jug with a plain blank label and a wire brush lined up on a patio floor.") }),
  S(64, "", "bi", "st_calendar", { q: "calendar wall month", p: BI("A paper wall calendar with days crossed out with a pen.") }),
  // ── la prueba de $0
  S(65, "", "av", ""),
  S(65, "Con un lápiz, marque una rayita", "cl", "c_pencil", { p: CLP(`He crouches in ${SALA} drawing a pencil line along the top edge of a damp stain at the bottom of the wall and writing a date beside it.`) }),
  C(66, "", "ClPencilLine", { result: "up" }),
  C(66, "Si la mancha está quieta en la raya", "ClPencilLine", { result: "still" }),
  S(67, "", "bi", "b_lineup", { p: BI("A pencil line with a date on a painted wall, a damp gray stain now clearly rising four fingers above the line, rain on the window beside it.") }),
  S(67, "había que ir al patio", "av", ""),
  // ── resumen + CTA 3
  C(68, "", "ClCheck", { title: "Todo en 30 segundos", items: ["Zócalo, ampollas y sal", "Nunca impermeable", "Primero el agua de afuera", "Picar + 30 cm, 1 semana al aire", "Hidrófugo · 4 semanas · que respire"], fast: true }),
  S(69, "", "av", ""),
  S(69, "la del aluminio, la de la moneda y la de la cinta", "bi", "b_threetests2", { p: BI(`A square of aluminum foil taped on a plaster wall, a coin pressed into a thin crack next to it and a strip of brown packing tape stuck below, in an old house.`) }),
  C(69, "Es gratis", "ClQRCard", { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "las 3 pruebas, gratis", kicker: "REGALO · ANTES DE PINTAR" }),
  C(69, "el Manual del Albañil está en esa misma página", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "los 66 arreglos", kicker: "EL MANUAL · US$27" }),
  // ── la gotera (gancho al ep. 4)
  S(70, "", "av", ""),
  C(70, "una noche de tormenta", "ClHouseMap", { done: ["dormitorio", "arriba", "pared"], next: "techo" }),
  S(70, "Doña Marta estaba en la cocina con un balde en el piso", "bi", "b_bucketkitchen", { p: BI(`An old kitchen at night lit by one bulb: a plastic bucket on the tile floor catching drops falling from the ceiling, ${MARTA} standing beside it in a robe holding a towel.`) }),
  S(70, "Caía una gota del techo", "kf", "k_drip", { p: BI("Close view at night of a water drop falling from a brown stain on a kitchen ceiling into a plastic bucket on the floor.") , d1: "a drop forms on the brown stain of the ceiling", d2: "the drop falls and splashes into the bucket", sound: "drops splashing into a bucket during rain" }),
  S(70, "en el techo de la cocina, una mancha marrón", "bi", "b_stainceiling", { p: BI("A brown water stain with dark rings spreading on the white ceiling of an old kitchen, near the light bulb.") }),
  S(71, "", "cl", "c_roof", { p: CLP(`He stands on the flat concrete roof of the old house the morning after a storm, puddles around, looking down at something near a drain with a frown.`) }),
  C(71, "La semana que viene le muestro", "ClVideoRef", { thumb: I + "th_algotera.jpg", title: "La gotera de la cocina", next: true }),
  // ── cierre
  S(72, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Su pared tiene las 3 señas?" } } }),
  S(72, "Escríbamelo en los comentarios", "bi", "b_otherside", { p: BI(`The outside of an old house wall seen from a patio, a flower bed against it, the bottom of the wall darker with damp.`) }),
  S(72, "Leo todos", "av", ""),
  S(73, "", "av", ""),
];
