// DIRECTOR B — jpgasto: cosas 4 (cajas organizadoras), 5 (adornos + mención 2 "la lista completa, pág. 11"), 6 (aparatitos de cocina) y
// 7 (la que casi todos pagamos: las suscripciones). Párrafos 27-51.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH } from "../claudio/lib.mjs";
import { H, SATOP, KITCHEN, R } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jpgasto/";
export const SHOTS = [
  // ══ 4 · las cajas
  C(27, "", "ClRule", R(4, "Las cajas para organizar", "¿qué vas a guardar que no usas?")),
  S(27, "Una vez compré en Tokio unas cajas de plástico", "bi", "b_boxestokyo", { p: BI("A small staff dormitory room in Tokyo with a stack of new clear plastic storage boxes still in their wrapping on the floor.") }),
  C(27, "¿qué vas a guardar ahí que no usas?", "ClSato", { img: SATOP, quote: "¿Qué vas a guardar ahí que no usas?" }),
  S(28, "", "bi", "b_binsstack", { q: "plastic storage boxes", p: BI("A stack of plastic storage boxes full of mixed things in a corner of a Latin American bedroom.") }),
  S(28, "Compras la caja, metes las cosas adentro", "kf", "k_boxfill", { p: BI(`Close view of ${H} dropping old cables, papers and a broken toy into a plastic storage box.`), d1: "the hands hold old things over the box", d2: "the things fall into the box", sound: "objects dropped into a plastic box" }),
  S(28, "queda tapado, como un aromatizante", "bi", "b_boxlid", { p: BI("A hand pressing the lid down on an overfull plastic storage box.") }),
  S(29, "", "bi", "b_jproom", { q: "minimalist japanese room", p: BI("A small Japanese apartment living room with tatami, a low table, one plant and almost nothing else, sunlight.") }),
  S(29, "es que todo está en su lugar", "bi", "b_jpdrawer", { q: "organized drawer", p: BI("An open drawer with a few things neatly placed, each in its own spot, in a Japanese home.") }),
  S(30, "", "av", ""),
  S(30, "Necesitas soltarlo", "bi", "b_donate", { q: "donation box clothes", p: BI("A cardboard donation box with folded clothes and a couple of kitchen items, by a front door.") }),
  S(31, "", "bi", "b_garage", { q: "garage storage boxes", p: BI("A cluttered garage corner with stacked cardboard and plastic boxes, dusty, an old bicycle leaning on them.") }),
  S(31, "Y además las pagaste", "cl", "c_boxes", { p: CLP(`He lifts the lid of a dusty storage box in a garage and looks inside with a puzzled face.`) }),

  // ══ 5 · los adornos (mención 2)
  C(32, "", "ClRule", R(5, "Los adornos", "lo que no sirve, junta polvo")),
  S(32, "En el hotel, las habitaciones no tenían ni un adorno", "bi", "b_bareroom", { q: "simple hotel room", p: BI(`A bare, calm room of ${HOTEL}: a bed, one small plant and a tea cup on a tray, nothing on the walls.`) }),
  C(32, "lo que no sirve, junta polvo", "ClSato", { img: SATOP, quote: "Lo que no sirve, junta polvo." }),
  S(33, "", "bi", "b_decor", { q: "home decor shelf", p: BI(`A living room shelf in ${HOUSE} crowded with candles, small framed signs with no readable text, vases and figurines.`) }),
  S(33, "un cojín del color de la temporada", "bi", "b_cushions", { q: "sofa cushions", p: BI("A sofa covered with many decorative cushions of the season's colors.") }),
  S(33, "Después el ojo se acostumbra", "av", ""),
  S(34, "", "kf", "k_dust", { p: BI("Close view of a finger wiping a line through the dust on a shelf crowded with small ornaments."), d1: "the finger touches the dusty shelf", d2: "the finger draws a clean line through the dust", sound: "a finger sliding on wood" }),
  S(35, "", "bi", "b_teapot", { q: "japanese teapot", p: BI("A cast iron teapot and a ceramic cup on a light-wood table, a neatly folded cloth beside them.") }),
  S(35, "pregúntate qué trabajo va a hacer en tu casa", "cl", "c_vase", { p: CLP(`He holds up a small decorative vase in ${HOUSE}, studying it with a skeptical frown.`) }),
  S(36, "", "bi", "b_countthings", { p: BI(`A living room in ${HOUSE} with a coffee table and shelves full of ornaments, afternoon light.`) }),
  S(36, "En Japón ese tiempo se usa para otra cosa", "bi", "b_jpwalk", { q: "japanese family park", p: BI("A Japanese grandmother and grandchild walking in a park on a sunny afternoon.") }),
  S(37, "", "bi", "b_gift", { q: "gift fruit basket", p: BI("A small gift box of fruit and a bag of tea being handed over at a front door.") }),
  // mención 2
  S(38, "", "av", ""),
  C(38, "está en la página once", "ClBookPage", { page: I + "x_page11.jpg", pageNo: 11, stamp: "La lista completa" }),
  S(38, "para que la lleves al supermercado", "bi", "b_supermarket", { q: "supermarket shopping list", p: BI("A hand holding a printed page as a shopping list in a bright supermarket aisle.") }),

  // ══ 6 · los aparatitos de cocina
  C(39, "", "ClRule", R(6, "Los aparatitos de cocina", "un cuchillo, una tabla, una sartén")),
  S(39, "busqué el exprimidor", "bi", "b_gadgets", { q: "kitchen gadgets", p: BI("A pile of single-use kitchen gadgets on a counter: a citrus squeezer, a garlic peeler, an egg slicer, an avocado tool.") }),
  S(39, "Había un cuchillo, una tabla de madera, y una sartén", "kf", "k_knife", { p: BI(`A good kitchen knife slicing a cucumber on a wooden board in a small Japanese kitchen, a pan on the stove behind.`), d1: "the knife rests on the cucumber", d2: "the knife slices through the cucumber", sound: "a knife slicing on a wooden board" }),
  S(40, "", "bi", "b_drawerjunk", { q: "cluttered kitchen drawer", p: BI(`An open kitchen drawer in ${KITCHEN} crammed with gadgets, an avocado slicer, a strawberry huller and a garlic press.`) }),
  S(40, "el prensador de ajo que nunca usas", "bi", "b_garlicpress", { q: "garlic press", p: BI("A dirty garlic press with bits of garlic stuck in it, lying in a sink.") }),
  S(40, "esta vez sí ibas a cocinar más", "av", ""),
  S(41, "", "bi", "b_threetools", { p: BI("A kitchen knife, a wooden cutting board and a frying pan laid out on a light-wood counter.") , ov: { c: "ClChip", props: { text: "1 · 1 · 1" } } }),
  S(42, "", "kf", "k_sharpen", { p: BI(`Close view of ${H} sharpening a kitchen knife on a whetstone with water.`), d1: "the blade rests on the whetstone", d2: "the blade slides along the stone", sound: "a knife sliding on a wet whetstone" }),
  S(43, "", "cl", "c_drawer", { p: CLP(`He empties a kitchen drawer full of gadgets onto a table in ${KITCHEN}, looking at the pile with amused surprise.`) }),
  S(43, "Lo demás va a una caja con fecha", "bi", "b_datedbox", { p: BI("A cardboard box with kitchen gadgets inside and a handwritten date on a strip of masking tape, no other text.") }),

  // ══ 7 · la que casi todos pagamos: las suscripciones
  C(44, "", "ClRule", R(7, "Las suscripciones", "lo que se cobra solo", { star: true })),
  S(45, "", "bi", "b_letter", { q: "handwritten letter envelope", p: BI("An envelope with Japanese stamps and a handwritten single-line note on white paper lying on a light-wood table, the writing unreadable.") }),
  C(45, "¿cuántas cosas pagas todos los meses", "ClSato", { img: SATOP, quote: "¿Cuántas cosas pagas cada mes que ya no usas?", role: "la carta de Sato-san" }),
  S(46, "", "bi", "b_tvapps", { q: "tv streaming remote", p: BI(`A television in ${HOUSE} showing a blank menu screen, a remote on the sofa, nobody watching.`) }),
  S(46, "El gimnasio al que vas a volver el lunes", "bi", "b_gymbag", { q: "gym bag unused", p: BI("An unused gym bag with a water bottle sitting by a front door, slightly dusty.") }),
  S(46, "La revista que llega cerrada", "bi", "b_magazines", { q: "magazines stack", p: BI("A stack of magazines still in their plastic wrap on a side table, no readable covers.") }),
  S(47, "", "bi", "b_phone", { q: "smartphone in hand", p: BI("A hand holding a smartphone showing a simple list of monthly charges as plain gray bars with no text at all.") }),
  S(47, "la garantía extendida que te vendieron en la caja", "bi", "b_checkout", { q: "store checkout payment", p: BI("A checkout counter of an electronics store with a boxed appliance and a card terminal.") }),
  S(48, "", "av", ""),
  S(48, "Por eso no la ves", "kf", "k_card", { p: BI("Close view of a credit card on a table next to a phone that lights up with a notification, no readable text."), d1: "the phone screen is dark", d2: "the phone screen lights up", sound: "a soft phone notification buzz" }),
  S(49, "", "bi", "b_jpbank", { q: "japanese person budget notebook", p: BI("A Japanese woman writing in a small household budget notebook at a kitchen table, a calculator beside her.") }),
  S(50, "", "kf", "k_circle", { p: BI(`Close view of ${H} circling lines on a printed card statement with a red pen, no readable text.`), d1: "the pen touches the statement", d2: "the pen draws a red circle around a line", sound: "a pen on paper" }),
  C(50, "Al lado de cada uno", "ClNumbers", { title: "La revisión de los cobros", rows: [["El resumen", "el del mes pasado"], ["Cada cobro que se repite", "un círculo"], ["Al lado", "la última vez que lo usaste"], ["Lo que no usaste este mes", "se cancela hoy"]], page: 11 }),
  S(51, "", "cl", "c_statement", { p: CLP(`He sits at a kitchen table holding a printed card statement and a red pen, raising his eyebrows at the camera.`) }),
  S(51, "eran casi lo mismo que pagaba de luz", "bi", "b_lightbill", { q: "electricity bill", p: BI("A paper electricity bill next to a printed card statement on a table, numbers unreadable, a light bulb beside them.") }),
];
