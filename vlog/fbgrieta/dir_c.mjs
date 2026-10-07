// DIRECTOR C — fbgrieta: LO QUE NO ARREGLA (diagonal desde ventana/puerta, > 3 mm o un lado más alto, la que crece) · VARIANTES (marco,
// escalón, maceta, junta vereda-pared) · MANTENER · PREGUNTAS · RESUMEN · CTA 3 = QR · PRÓXIMO (óxido) (párrafos 59-83).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { WALL, CRACK, FILLED, MIX, HANDS, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbgrieta/";
export const SHOTS = [
  // ── límite
  C(59, "", "ClChapter", { n: 8, title: "Lo que esto no arregla", sub: "no todas las grietas son iguales" }),
  S(59, "no todas las grietas son iguales", "av", ""),
  S(60, "", "bi", "b_diagonal", { q: "diagonal crack wall window", p: BI(`A stepped diagonal crack running up from the top corner of a window in a plastered wall.`), ov: { c: "ClChip", props: { text: "Diagonal desde la ventana: no", alert: true } } }),
  S(60, "alguien que la vea", "cl", "c_serious", { p: CLP(`He stands by a window with a diagonal crack above it, serious, one hand raised in a stop gesture, looking at the camera.`) }),
  S(61, "", "bi", "b_keytip", { p: BI(`The tip of a house key fitting inside a wide crack in a wall.`), ov: { c: "ClChip", props: { text: "Más de 3 mm: no", alert: true } } }),
  S(61, "si un lado está más alto que el otro", "bi", "b_offset", { p: BI(`Close side view of a crack in a wall where one side sticks out higher than the other.`) }),
  S(62, "", "bi", "b_pencilmark", { p: BI(`A pencil line and a date written at the tip of a crack in a plastered wall.`) }),
  S(62, "al mes pasó la marca", "bi", "b_grown", { p: BI(`Close view of a crack in a wall that has grown past a pencil mark drawn across its tip.`), ov: { c: "ClStampOv", props: { text: "CRECE" } } }),
  // ── variantes
  C(63, "", "ClChapter", { n: 9, title: "Dónde más sirve", sub: "cuatro ideas" }),
  S(64, "", "bi", "b_doorframe", { p: BI(`A thin crack between a painted wooden door frame and a wall.`) }),
  S(64, "Masilla, alisada", "bi", "b_framefill", { p: BI(`A gloved finger smoothing putty into the joint between a door frame and a wall.`) }),
  S(65, "", "bi", "b_stepcrack", { q: "concrete steps patio", p: BI(`A concrete patio step with a crack across the middle.`) }),
  S(65, "porque es gris como el escalón", "bi", "b_stepfilled", { p: BI(`A concrete patio step with a gray filled crack that blends in with the concrete.`) }),
  S(66, "", "bi", "b_pot", { q: "large concrete planter", p: BI(`A big concrete planter with a crack down its side, a plant in it.`) }),
  S(66, "no se sigue abriendo cuando riegas", "bi", "b_watering", { p: BI(`A watering can pouring water into a large concrete planter with a gray filled crack on its side.`), anim: "the water pours" }),
  S(67, "", "bi", "b_sidewalkjoint", { p: BI(`An open gap between a concrete sidewalk and the base of a house wall, with a little water in it.`) }),
  S(67, "el agua corre para afuera", "bi", "b_jointfilled", { p: BI(`Water running away from a house along a sidewalk, over a gray filled joint at the base of the wall.`) }),
  // ── mantener
  C(68, "", "ClChapter", { n: 10, title: "Que dure años", sub: "tres costumbres" }),
  S(69, "", "bi", "b_lookcrack", { q: "man looking at wall", p: BI(`A man in an olive-green shirt looking closely at a gray filled crack on a wall with a flashlight.`) }),
  S(69, "Anótala", "bi", "b_notebook", { q: "writing notebook", p: BI(`A small notebook with a pencil sketch of a wall and its cracks, dates written beside them.`) }),
  S(70, "", "bi", "b_paintaround", { q: "painting wall brush", p: BI(`A small brush painting a wall right up to the edge of a gray putty line, leaving the line uncovered.`), anim: "the brush paints along the edge" }),
  S(71, "", "bi", "b_dampcrack", { q: "damp wall mold corner", p: BI(`A cracked wall with a damp dark stain and peeling paint around the crack.`) }),
  // ── preguntas
  C(72, "", "ClChapter", { n: 11, title: "Lo que siempre me preguntan", sub: "seis respuestas cortas" }),
  S(73, "", "bi", "b_twotubes", { q: "caulk tubes", p: BI(`Two silicone cartridges with plain labels side by side on a workbench.`), ov: { c: "ClAsk", props: { q: "¿Acética o neutra?", sign: "" } } }),
  S(74, "", "bi", "b_twocements", { p: BI(`Two small piles of cement powder, one gray and one white, on a board.`), ov: { c: "ClAsk", props: { q: "¿Gris o blanco?", sign: "" } } }),
  S(75, "", "bi", "b_sand", { q: "sand pile", p: BI(`A small pile of sand next to a plastic cup of gray putty.`), ov: { c: "ClAsk", props: { q: "¿Con arena?", sign: "" } } }),
  S(76, "", "bi", "b_sanding", { p: BI(`Sandpaper rubbing a gray silicone line on a wall, the silicone tearing into stringy bits.`), ov: { c: "ClAsk", props: { q: "¿Se puede lijar?", sign: "" } } }),
  S(77, "", "bi", "b_roofref", { p: BI(`A flat gray concrete roof with a crack sealed by a wide band of white silicone coating, sunny.`), ov: { c: "ClAsk", props: { q: "¿Sirve para el techo?", sign: "" } } }),
  S(78, "", "bi", "b_trashcup", { p: BI(`A used plastic cup with leftover hardened gray putty being dropped into a trash bag.`), ov: { c: "ClAsk", props: { q: "¿Y lo que sobra?", sign: "" } } }),
  // ── resumen
  C(79, "", "ClChapter", { n: 12, title: "Todo junto", sub: "para que lo tengas" }),
  S(79, "Grieta abierta en ve y sin polvo", "c", "ClCheck", { props: { title: "La receta", items: ["Abierta en V y sin polvo", "Bordes apenas húmedos", "Silicona + cemento, 1 a 1", "Sólo lo de una grieta", "Alisar con detergente", "48 horas sin tocar", "¿Se pinta? Acrílico pintable"] } }),
  S(79, "La silicona no se pinta, el acrílico sí", "av", ""),
  // ── CTA 3
  C(80, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "la receta escrita + otras 9, gratis" }),
  // ── próximo
  S(81, "", "bi", "b_rustytools", { q: "rusty tools", p: BI(`Old rusty pliers, a wrench and a hand saw on a workbench in a backyard shed.`) }),
  S(81, "para las herramientas oxidadas del galpón", "bi", "b_gel", { p: BI(`A thick beige homemade paste spread over a rusty wrench on a workbench, a bowl and a spoon beside it.`) }),
  C(81, "te muestro cuál es", "ClVideoRef", { thumb: I + "th_next.jpg", title: "Gel quita-óxido de 2 ingredientes", next: true }),
  // ── cierre
  S(82, "", "av", ""),
  S(82, "El vecino ya me mostró la del garaje", "bi", "b_neighborgarage", { p: BI(`${NEIGHBOR} in his garage pointing at a crack in the wall, grinning.`) }),
  S(83, "", "av", ""),
];
