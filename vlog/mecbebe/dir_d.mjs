// DIRECTOR D — mecbebe: preguntas rápidas (vaselina en bornes, cuero, plásticos de afuera, bisagras, WD-40 en otro video, motor nunca) ·
// una semana después (la foto, la calcomanía que ya no está, las herramientas, las gomas con silicona, la puerta que cierra suave, la 3ª
// línea en la libreta y la firma de la nieta) · las 3 pruebas · el regalo + el Manual (QR /r, mención 3) · gancho al ep. 6 (adelantar el
// cambio de aceite antes de la playa, el lubricentro de 15 minutos, la varilla muy arriba y la gota en el tapón) · cierre (párrafos 59-77).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { BABY, RAG, GIRL, GH, GAUGE, SIL } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/mecbebe/";
const NB = "a small worn blue notebook with rounded corners";
export const SHOTS = [
  C(59, "", "ClChapter", { n: 9, title: "Preguntas rápidas", sub: "las que me hacen siempre" }),
  S(60, "", "bi", "b_vaseline", { q: "petroleum jelly", p: BI("A small plain jar of petroleum jelly with a blank label on a workbench next to a car battery.") }),
  S(60, "sí en los bornes de la batería", "bi", "b_terminal", { q: "car battery terminal", p: BI(`Extreme close view of a clean car battery terminal, ${H} with a fingertip of petroleum jelly.`), d1: "the fingertip approaches the terminal", d2: "a thin film of jelly is spread on the terminal", sound: "a soft smear" }),
  S(60, "y no en gomas, pedales ni volante", "av", ""),
  S(61, "", "bi", "st_leatherseat", { q: "leather car seat", p: BI("A leather car seat.") }),
  S(61, "El cuero se cuida con un producto para cuero", "bi", "b_leathercare", { q: "leather car seat cleaning", p: BI("A plain bottle of leather conditioner with a blank label on a car leather seat next to a cloth.") }),
  S(62, "", "bi", "b_bumpergray", { q: "car bumper", p: BI(`Close view of the faded grayish-white plastic bumper corner of an old car.`) }),
  S(62, "chorrea por la pintura en rayas negras", "bi", "b_streaks", { p: BI(`Close view of the black plastic lower trim of a silver car after rain, dark oily streaks running down from the trim onto the silver paint.`) }),
  S(62, "Para eso hay productos para plásticos exteriores", "av", ""),
  S(63, "", "bi", "b_hinge", { p: BI(`Close view of the door hinge of ${CAR} with the door half open.`), d1: "the door starts to swing", d2: "the hinge moves, a little rust visible", sound: "a squeaky door hinge" }),
  S(63, "Para las bisagras, grasa blanca en aerosol", "bi", "b_whitegrease", { q: "spray lubricant hinge", p: BI(`Close view of ${H} spraying white lithium grease from a plain can onto a car door hinge.`) }),
  S(64, "", "bi", "b_wd40", { q: "spray can garage", p: BI("A plain blue and yellow spray can of penetrating oil with no brand or text, on a workbench.") }),
  S(64, "Te lo muestro en otro video", "av", ""),
  S(65, "", "av", ""),
  S(65, "El aceite de bebé no es aceite de motor", "bi", "st_engineoil", { q: "engine oil cap", p: BI("Close view of an engine oil filler cap on an engine.") }),
  // ── una semana después
  S(66, "", "bi", "b_photo", { p: BI(`Close view of an old smartphone in ${EH} showing a photo of a clean silver car in a carport.`) }),
  S(66, "pero de jabón y agua, no de aceite", "bi", "b_cleancar", { p: BI(`${CAR} in ${DRIVE} clean and shining naturally after a wash, sunny morning.`) }),
  S(66, "La calcomanía de la agencia ya no estaba", "bi", "b_trunkclean", { p: BI(`Close view of the clean silver trunk lid of ${CAR}, no sticker, no marks.`) }),
  S(66, "las herramientas del baúl, limpias, en su bolsa", "bi", "b_toolsbag", { p: BI(`Close view of a clean car jack and lug wrench in a small canvas bag in the open trunk of ${CAR}.`) }),
  S(67, "", "bi", "b_sealgood", { p: BI(`Extreme close view of a clean dark matte rubber door seal of ${CAR}, ${H} pressing it with a fingertip.`) }),
  S(67, "ahora cerraba con un sonido suave", "kf", "k_doorclose", { p: BI(`Close view of ${EH} pushing the driver's door of ${CAR} closed.`), d1: "the door swings toward the frame", d2: "the door closes softly and seals", sound: "a soft solid car door close" }),
  S(67, "suena como cuando era nuevo", "bi", "b_elenasmile", { p: BI(`${ELENA} standing next to ${CAR} in ${DRIVE} with a hand on the door, smiling.`) }),
  S(68, "", "c", "ClLogbook", { props: { mode: "new", elena: ["10/2026 · 280.900", "lavado vinagre, verde", "10/2026 · 281.300", "limpieza, silicona gomas", "aceite bebé: sólo paño"] } }),
  S(68, "Y al costado: nunca en los pedales", "c", "ClLogbook", { props: { mode: "two", elena: ["10/2026 · 280.900", "lavado vinagre, verde", "10/2026 · 281.300", "limpieza, silicona gomas", "¡nunca en los pedales!", "— Elena y su nieta"] } }),
  S(68, "La nieta firmó abajo", "bi", "b_girlsign", { p: BI(`Close view of ${GH} signing at the bottom of a page in ${NB} with a pink pen, nothing legible.`), rev: 1 }),
  // ── las 3 pruebas
  C(69, "", "ClChapter", { n: 10, title: "Las 3 pruebas antes del taller", sub: "10 minutos, $0" }),
  S(70, "", "bi", "b_cardplace", { p: BI(`Evening, ${H} sliding a flattened cardboard sheet under the front of ${CAR} in ${DRIVE}.`) }),
  S(70, "A la mañana miras", "bi", "b_cardmorning", { p: BI(`Morning, ${EH} lifting the edge of a flattened cardboard sheet from under ${CAR}, a few small spots on it.`) }),
  S(70, "Agua sin olor, del lado del acompañante", "c", "ClColorCode", { props: { pick: 1, items: [{ c: "#BFD9E8", name: "Agua sin olor", what: "Aire acondicionado", fix: "Normal" }, { c: "#2A1A0E", name: "Marrón o negro", what: "Aceite", fix: "Mide la varilla" }, { c: "#46A85A", name: "Verde, rosa o naranja", what: "Refrigerante", fix: "Taller" }] } }),
  S(70, "hoy mismo mides la varilla", "bi", "b_dipstick", { p: BI(`Close view of ${H} pulling the engine oil dipstick of ${CAR} over a white rag.`) }),
  S(71, "", "bi", "b_lightswall2", { p: BI(`Evening, the front of ${CAR} with a plain grille without any emblem, facing a white garage wall with its headlights on.`) }),
  S(71, "Si se apagan casi del todo", "bi", "b_dimlights", { p: BI(`Evening, the front of ${CAR} with a plain grille without any emblem, its headlights dimmed to a weak glow on a white wall.`) }),
  S(71, "Si sólo parpadean con el motor andando", "c", "ClCheck", { props: { title: "La prueba de los faros", items: ["Se apagan al arrancar → batería", "Parpadean andando → otra cosa", "No cambies la batería todavía"], fast: true } }),
  S(72, "", "av", ""),
  S(72, "Arrancas y miras qué luces quedan prendidas", "bi", "st_dashboard", { q: "car dashboard warning lights", p: BI("A car dashboard with warning lights at engine start.") }),
  S(72, "Rojo es parar", "bi", "b_redoil", { p: BI(`Extreme close view of a red warning light glowing on ${GAUGE}.`), ov: { c: "ClChip", props: { text: "Rojo · parar", alert: true } } }),
  S(72, "Amarillo es revisar pronto", "bi", "b_amber", { q: "check engine light", p: BI(`Extreme close view of an amber engine warning light glowing on ${GAUGE}.`), ov: { c: "ClChip", props: { text: "Amarillo · revisar pronto" } } }),
  S(72, "te dice que vayas hoy mismo", "av", ""),
  // ── el regalo
  S(73, "", "av", ""),
  C(73, "en una hoja gratis que se llama Antes del Taller", "ClQRCard", { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "las 3 pruebas, gratis", kicker: "REGALO · ANTES DEL TALLER" }),
  C(73, "el Manual del Mecánico está en esa misma página", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "todos los trucos del taller", kicker: "EL MANUAL · US$27" }),
  // ── gancho al ep. 6
  S(74, "", "av", ""),
  S(74, "Antes de un viaje a la playa con su hermana", "bi", "b_beachbag", { p: BI(`${ELENA} putting a straw beach bag and a folding umbrella into the open trunk of ${CAR} in ${DRIVE}.`) }),
  S(74, "fue a uno de esos lugares que te lo cambian en quince minutos", "bi", "st_quicklube", { q: "quick oil change service", p: BI("A quick oil change service bay with a car inside.") }),
  S(74, "Barato y rápido", "bi", "b_lubesign", { p: BI("A small roadside quick-lube shop with an open bay and a technician in a polo, no legible signs.") }),
  S(75, "", "bi", "b_dippull", { p: BI(`Close view of ${H} pulling the engine oil dipstick of ${CAR} parked in ${DRIVE}.`) }),
  S(75, "Y el aceite estaba muy por encima de la marca, goteando", "kf", "k_dipdrip", { p: BI("Extreme close view of an engine oil dipstick with fresh golden oil far above the upper mark, held over a white rag."), d1: "the dipstick is held still", d2: "a drop of oil runs down and drips off the tip", sound: "a tiny drip" }),
  S(75, "Y debajo del auto, una gota nueva en el tapón", "bi", "b_drainplugdrip", { q: "oil pan drain plug", p: BI(`Low view under the engine of an old car: the gray metal oil pan with its drain plug, one fresh golden oil drop hanging from the plug, a cement floor below.`), rev: 1 }),
  S(75, "los nueve errores que se cometen después de cambiar el aceite", "c", "ClVideoRef", { props: { thumb: I + "th_mecaceite.jpg", title: "NUNCA hagas esto después de cambiar el aceite", next: true } }),
  // ── cierre
  S(76, "", "av", ""),
  S(76, "Escríbemelo en los comentarios", "bi", "b_comment", { p: BI(`Close view of ${EH} typing on an old smartphone in a kitchen.`) }),
  S(77, "", "cl", "c_end", { p: CLP(`In ${DRIVE} he hands ${BABY} back to an old woman's hand and smiles at the camera.`) }),
  S(77, "Nos vemos la semana que viene", "av", ""),
];
