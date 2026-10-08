// DIRECTOR D — mecvinagre: preguntas rápidas (qué vinagre, el radiador igual, cuánto cuesta, dónde va la aguja) · una semana después (la foto
// del tablero en el semáforo, la calefacción que calienta, el presupuesto guardado en la libreta) · las 3 pruebas · el regalo + el Manual (QR
// /r, mención 3) · gancho al ep. 5 (la nieta y el aceite de bebé en todo el auto, el freno) · cierre (párrafos 65-81).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { BAY, RES, RAD, GAUGE, VIN, DIST, JAR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/mecvinagre/";
const NB = "a small worn blue notebook with rounded corners";
const BABY = "a small pink plastic bottle of baby oil with a blank label";
export const SHOTS = [
  C(65, "", "ClChapter", { n: 11, title: "Preguntas rápidas", sub: "las que me hacen siempre" }),
  S(66, "", "bi", "b_vintypes", { p: BI("Three plain bottles side by side on a kitchen counter: clear white vinegar, amber apple vinegar and red wine vinegar, blank labels.") }),
  S(66, "El blanco común, el de cinco por ciento", "bi", "b_vinwhite", { p: BI(`Close view of ${EH} holding ${VIN} in a small grocery store aisle.`) }),
  S(66, "Ni de manzana ni de vino", "av", ""),
  S(67, "", "av", ""),
  S(67, "si pierde o está roto por dentro", "bi", "b_radleak", { p: BI("Extreme close view of a green coolant drip on the seam of an old car radiator tank.") }),
  S(67, "Pero aunque lo cambies, hay que lavar el resto", "bi", "st_newradiator", { q: "new car radiator", p: BI("A brand-new car radiator on a workbench.") }),
  S(67, "en un año está tapado otra vez", "c", "ClRadiator3D", { props: { mode: "scale" } }),
  S(68, "", "c", "ClReceipt", { props: { head: "LO QUE GASTÓ ELENA", lines: [["Vinagre blanco", "1-2 dólares"], ["Agua destilada", "otro poco"], ["Refrigerante", "tocaba igual"], ["Una mañana", "de su tiempo"]], total: ["vs. radiador nuevo", "sin comparación"] } }),
  S(68, "Contra un radiador nuevo y la mano de obra", "bi", "b_shopbill", { p: BI(`The counter of a small Latin American car repair shop: a mechanic in a navy work shirt sliding a long printed bill toward ${EH}, the printing too small to read.`) }),
  S(68, "no hay comparación", "av", ""),
  S(69, "", "bi", "b_gaugemid", { p: BI(`Extreme close view of the round temperature gauge of an old car dashboard with the letter C on the far left and H on the far right, no numbers, the orange needle pointing straight up at twelve o'clock, exactly halfway between C and H.`) }),
  S(69, "Si llega al rojo, paras en un lugar seguro", "c", "ClTempGauge", { props: { mode: "red" } }),
  S(69, "Nunca sigas manejando con la aguja en el rojo", "av", ""),
  // ── una semana después
  S(70, "", "bi", "b_sunday", { p: BI(`${CAR} in Sunday afternoon traffic on the same wide avenue, seen from the car behind.`) }),
  S(70, "Me mandó una foto del tablero desde un semáforo", "bi", "b_phonephoto", { p: BI(`Close view of ${EH} holding an old smartphone up to the dashboard of ${CABIN} to take a photo, a red traffic light outside the windshield.`) }),
  S(70, "La aguja, en el medio", "c", "ClTempGauge", { props: { mode: "fixed" } }),
  S(71, "", "bi", "b_heatercar", { p: BI(`${ELENA} in the driver's seat of ${CAR} holding her hands in front of a dashboard air vent, smiling, a winter coat on the passenger seat.`) }),
  S(71, "el radiadorcito del tablero también estaba tapado", "bi", "st_heatercore2", { q: "car heater core", p: BI("A small car heater core on a workbench.") }),
  S(71, "manejaba con el abrigo puesto", "bi", "b_coat", { p: BI(`${ELENA} driving ${CAR} in a thick wool coat and scarf on a gray winter morning.`) }),
  S(71, "y pensaba que era normal en un auto viejo", "av", ""),
  S(72, "", "bi", "b_quotenb", { p: BI(`Close view of ${EH} folding a printed radiator quote and tucking it between the pages of ${NB}, no legible numbers.`) }),
  S(72, "Gastó en todo menos que la primera hora de mano de obra", "av", ""),
  // ── las 3 pruebas
  C(73, "", "ClChapter", { n: 12, title: "Las 3 pruebas antes del taller", sub: "10 minutos, $0" }),
  S(74, "", "bi", "b_cardplace", { p: BI(`Evening, ${H} sliding a flattened cardboard sheet under the front of ${CAR} in ${DRIVE}.`) }),
  S(74, "A la mañana miras", "bi", "b_cardmorning", { p: BI(`Morning, ${EH} lifting the edge of a flattened cardboard sheet from under ${CAR}, a few small spots on it.`) }),
  S(74, "Agua sin olor, del lado del acompañante", "c", "ClColorCode", { props: { pick: 3, items: [{ c: "#BFD9E8", name: "Agua sin olor", what: "Aire acondicionado", fix: "Normal" }, { c: "#2A1A0E", name: "Marrón o negro", what: "Aceite", fix: "Mide la varilla" }, { c: "#C9302C", name: "Rojo", what: "Transmisión", fix: "Taller" }, { c: "#46A85A", name: "Verde, rosa o naranja", what: "Refrigerante", fix: "Tu sistema pierde" }] } }),
  S(74, "tu sistema pierde", "av", ""),
  S(75, "", "bi", "b_lightswall2", { p: BI(`Evening, the front of ${CAR} with a plain grille without any emblem, facing a white garage wall with its headlights on.`) }),
  S(75, "Si se apagan casi del todo", "bi", "b_dimlights", { p: BI(`Evening, the front of ${CAR} with a plain grille without any emblem, its headlights dimmed to a weak glow on a white wall.`) }),
  S(75, "Si sólo parpadean con el motor andando", "c", "ClCheck", { props: { title: "La prueba de los faros", items: ["Se apagan al arrancar → batería", "Parpadean andando → otra cosa", "No cambies la batería todavía"], fast: true } }),
  S(76, "", "av", ""),
  S(76, "Rojo es parar", "bi", "b_redoil", { q: "dashboard warning light", p: BI(`Extreme close view of a red warning light glowing on ${GAUGE}.`), ov: { c: "ClChip", props: { text: "Rojo · parar", alert: true } } }),
  S(76, "Amarillo es revisar pronto", "bi", "b_amber", { q: "check engine light", p: BI(`Extreme close view of an amber engine warning light glowing on ${GAUGE}.`), ov: { c: "ClChip", props: { text: "Amarillo · revisar pronto" } } }),
  S(76, "Y la aguja de la temperatura", "bi", "b_tempneedle", { q: "temperature gauge car", p: BI(`Extreme close view of a car temperature gauge with C on the far left and H on the far right, no numbers, the white needle pointing straight up at twelve o'clock, halfway between them.`) }),
  // ── el regalo
  S(77, "", "av", ""),
  C(77, "en una hoja gratis que se llama Antes del Taller", "ClQRCard", { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "las 3 pruebas, gratis", kicker: "REGALO · ANTES DEL TALLER" }),
  C(77, "el Manual del Mecánico está en esa misma página", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "todos los trucos del taller", kicker: "EL MANUAL · US$27" }),
  // ── gancho al ep. 5
  S(78, "", "av", ""),
  S(78, "Su nieta había visto en internet", "bi", "b_granddaughter", { p: BI(`A teenage girl of about 16 in ${DRIVE} watching a video on her phone next to ${CAR}, ${BABY} in her other hand.`) }),
  S(78, "Y le pasó aceite de bebé a todo", "bi", "b_babyrag", { p: BI(`Close view of a teenage girl's hands rubbing a cloth soaked in baby oil over the dashboard of ${CABIN}, ${BABY} on the seat.`), rev: 1 }),
  S(78, "Los faros, el tablero, el volante, los pedales", "bi", "b_shinypedal", { q: "car pedals", p: BI(`Extreme close view of the three black rubber pedals of an ordinary car glistening wet with oil, the gray carpet around them.`) }),
  S(79, "", "bi", "b_babyheadlight", { p: BI(`Close view of ${BABY} standing on the bumper of ${CAR} next to a shiny freshly wiped headlight.`) }),
  S(79, "Otras son peligrosas de verdad", "av", ""),
  S(79, "los trece usos del aceite de bebé en el auto", "c", "ClVideoRef", { props: { thumb: I + "th_mecbebe.jpg", title: "13 trucos con aceite para bebé", next: true } }),
  S(79, "Y lo que pasó cuando Elena pisó el freno", "bi", "b_brakefoot", { p: BI(`Low view inside the driver's footwell of an ordinary car: an elderly woman's foot in a beige flat shoe pressing a glossy, oil-wet black rubber brake pedal, only the foot and the ankle in the frame.`), rev: 1 }),
  // ── cierre
  S(80, "", "av", ""),
  S(80, "Escríbemelo en los comentarios", "bi", "b_comment", { q: "typing on phone", p: BI(`Close view of ${EH} typing on an old smartphone in a kitchen.`) }),
  S(81, "", "cl", "c_end", { p: CLP(`In ${DRIVE} he closes the hood of ${CAR} with both hands and pats it, smiling at the camera.`) }),
  S(81, "Nos vemos la semana que viene", "av", ""),
];
