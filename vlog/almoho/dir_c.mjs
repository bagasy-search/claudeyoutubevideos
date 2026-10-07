// DIRECTOR C — almoho: si vuelve (el mueble, los 5 cm) → las 4 costumbres → cuándo llamar → 5 errores → preguntas → la prueba de $0
// (cinta de embalar) → resumen → regalo "Antes de Pintar" con QR + Manual US$27 → el cuarto de arriba (gancho al ep. 2) → cierre
// (párrafos 45-71).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
import { H, ROOM, WALL, WARD } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/almoho/";
const UP = "a small upstairs room of an old house right under a flat concrete roof slab, with a narrow single bed, a small window and bare plastered walls";
export const SHOTS = [
  // ── si vuelve
  S(45, "", "av", ""),
  S(45, "Repita el vinagre, y busque el mueble", "bi", "b_sofa", { p: BI("An old sofa pushed tight against an outside wall of a modest living room, black mold dots peeking out above its back.") }),
  S(45, "la cómoda", "bi", "b_dresser", { p: BI("An old wooden chest of drawers pulled away from a plaster wall revealing a patch of black mold behind it.") }),
  S(45, "Detrás de un mueble el aire no se mueve", "bi", "b_behindbed", { p: BI("A view down into the narrow gap between a wooden headboard and a cold plaster wall, gray mold dots on the wall in the dark gap.") }),
  C(46, "", "ClWardrobeGap", { label: "5 cm" }),
  S(46, "Un puño de distancia, más o menos", "bi", "b_fist", { p: BI(`Close view of ${H} making a fist and placing it in the gap between ${WARD} and a clean white wall to show the distance.`) }),
  // ── las 4 costumbres
  C(47, "", "ClCheck", { title: "Cuatro costumbres", items: ["Ventana 10 minutos cada mañana", "Ropa a secar, afuera del cuarto", "Cocinar: puerta cerrada, ventana abierta", "Ducha: puerta cerrada, ventana abierta"] }),
  S(48, "", "bi", "st_openwindow", { q: "opening window morning", p: BI("A person opening a window in the morning, fresh air moving the curtain.") }),
  C(48, "Lo que se va es el aire mojado", "ClHygrometer", { peak: 76, end: 50 }),
  // ── cuándo llamar
  S(49, "", "bi", "b_bigmold", { q: "black mold wall", p: BI("A whole bedroom wall of an old house covered in large black mold patches from floor to ceiling, far more than one square meter.") , ov: { c: "ClChip", props: { text: "+1 m²", alert: true } } }),
  S(49, "alguien de la casa tiene asma", "bi", "st_inhaler", { q: "asthma inhaler", p: BI("An older person holding an asthma inhaler at home.") }),
  S(49, "Eso no es para ahorrar", "av", ""),
  // ── errores
  C(50, "", "ClChapter", { n: 3, title: "Los 5 errores", sub: "cada uno hace que vuelva", alert: true }),
  S(51, "", "bi", "b_bleachbottle", { p: BI("A bottle of bleach with a plain label and a wet rag on the floor below a black mold stain on a plaster wall.") , ov: { c: "ClChip", props: { text: "Error 1", alert: true } } }),
  S(52, "", "bi", "b_paintonmold", { p: BI("A paint brush painting white paint directly over fuzzy black mold on a wall, the mold smearing gray into the paint.") , ov: { c: "ClChip", props: { text: "Error 2", alert: true } } }),
  S(52, "Primero se mata, después se pinta", "av", ""),
  S(53, "", "kf", "k_scrape", { p: BI("Close view of a steel putty knife scraping dry black mold off a plaster wall, dark dust puffing into the air.") , d1: "the putty knife scrapes the dry moldy wall", d2: "a puff of dark dust rises into the air from the wall", sound: "a dry metal scrape on plaster" , ov: { c: "ClChip", props: { text: "Error 3", alert: true } } }),
  S(53, "al mes tiene moho en el techo del baño", "bi", "b_bathceiling", { q: "mold ceiling", p: BI("The white ceiling of a small bathroom above the shower with spreading black mold spots.") }),
  S(54, "", "bi", "b_bubbles", { q: "peeling paint wall", p: BI("Close view of fresh paint on a plaster wall bubbling and peeling in blisters, damp underneath.") , ov: { c: "ClChip", props: { text: "Error 4", alert: true } } }),
  S(55, "", "bi", "b_pushback", { p: BI(`Two people pushing ${WARD} back tight against a freshly painted white wall.`) , ov: { c: "ClChip", props: { text: "Error 5", alert: true } } }),
  S(55, "es justo lo que pasó en la casa de Doña Marta", "av", ""),
  // ── preguntas
  C(56, "", "ClChapter", { n: 4, title: "Lo que siempre me preguntan", sub: "rapidito" }),
  S(57, "", "bi", "st_applevinegar", { q: "apple cider vinegar", p: BI("A bottle of apple cider vinegar next to a bottle of clear white vinegar on a kitchen counter.") }),
  S(58, "", "bi", "b_openwin2", { p: BI(`The open window of ${ROOM} on a bright morning with a vinegar spray bottle on the sill.`) }),
  S(59, "", "bi", "b_bathfan", { p: BI("A small bathroom with a white ceiling, a window cracked open and a ceiling extractor fan, steam clearing after a shower.") }),
  S(60, "", "bi", "st_dehumidifier", { q: "dehumidifier home", p: BI("A small home dehumidifier standing in the corner of a bedroom.") }),
  S(61, "", "bi", "b_wallclean", { p: BI(`A clean bright white bedroom wall corner in ${ROOM}, ${WARD} standing a few centimeters away from it, morning light.`) }),
  S(62, "", "bi", "st_apartment", { q: "renting apartment keys", p: BI("A hand holding apartment keys at an open door.") }),
  S(62, "la prueba del aluminio es su prueba", "av", ""),
  // ── la prueba de $0
  S(63, "", "av", ""),
  S(63, "Corte un pedazo de cinta de embalar", "bi", "b_tapecut", { q: "packing tape roll", p: BI(`Close view of ${H} tearing a strip of brown packing tape off its roll in front of a painted wall.`) }),
  C(63, "frótelo con la uña", "ClTapeTest", { result: "paint" }),
  C(64, "", "ClTapeTest", { result: "clean" }),
  C(64, "Y si sale con un polvito blanco", "ClTapeTest", { result: "salt" }),
  S(65, "", "cl", "c_tapelayers", { p: CLP(`He holds up a strip of brown packing tape toward the camera in ${ROOM}; stuck to it are three thin layers of peeled white paint; he raises his eyebrows.`) }),
  S(65, "Cinco segundos, y él nunca la hizo", "av", ""),
  // ── resumen
  C(66, "", "ClCheck", { title: "Todo en 30 segundos", items: ["Nada de cloro", "Aluminio: 48 horas", "Vinagre, 1 hora, cepillo suave", "2 días secando · 2 manos antihongos", "Muebles a 5 cm"], fast: true }),
  // ── CTA 3: el regalo
  S(67, "", "av", ""),
  S(67, "la del aluminio", "bi", "b_foiltwo", { p: BI(`A square of aluminum foil taped on a plaster wall with brown packing tape on all four sides, a pencil date written on the tape.`) }),
  S(67, "la de la moneda", "bi", "b_coin", { p: BI(`Close view of ${H} pushing the edge of a coin into a thin diagonal crack in a painted plaster wall.`) }),
  S(67, "y la de la cinta", "bi", "b_tapestrip", { p: BI(`A strip of brown packing tape stuck on a painted wall with one end lifted, ready to be pulled.`) }),
  S(67, "Antes de Pintar", "av", ""),
  C(67, "Es gratis", "ClQRCard", { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "las 3 pruebas, gratis", kicker: "REGALO · ANTES DE PINTAR" }),
  C(67, "el Manual del Albañil está en esa misma página", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "los 66 arreglos", kicker: "EL MANUAL · US$27" }),
  // ── el cuarto de arriba (gancho al episodio 2)
  S(68, "", "av", ""),
  C(68, "el que está debajo del techo", "ClHouseMap", { done: ["dormitorio"], next: "arriba" }),
  S(68, "Subí la escalera", "bi", "b_stairs", { q: "old staircase", p: BI("A narrow old concrete staircase with an iron handrail going up to a small door on the upper floor of an old house, harsh afternoon light from above.") }),
  S(68, "me pegó en la cara un calor de horno", "cl", "c_heat", { p: CLP(`He stands in the doorway of ${UP}, the air hazy with heat, wiping sweat from his forehead with the back of his hand, grimacing.`) }),
  S(68, "el termómetro de la pared marcaba treinta y ocho grados", "bi", "b_thermo", { p: BI(`An old round wall thermometer hanging on a bare plastered wall of ${UP}, its needle near the top in the red zone, harsh late afternoon sun on the wall.`), ov: { c: "ClChip", props: { text: "38 °C", alert: true } } }),
  S(69, "", "bi", "b_emptybed", { p: BI(`The narrow empty single bed of ${UP} with a folded blanket and a child's backpack on it, a small fan on the floor, the afternoon light harsh and hot.`) }),
  C(69, "La semana que viene le muestro", "ClVideoRef", { thumb: I + "th_alfresco.jpg", title: "El cuarto de arriba, sin aire", next: true }),
  // ── cierre
  S(70, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Qué encontró detrás de su mueble?" } } }),
  S(71, "", "av", ""),
];
