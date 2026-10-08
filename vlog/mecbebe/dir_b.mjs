// DIRECTOR B — mecbebe: los 7 usos donde sí (calcomanía de la agencia, savia, alquitrán, manos, placa y tornillos, herramientas del baúl,
// la prueba del faro) · mención 2 (ClBookPage pág. 13) · lo que pasó con el freno (marcha atrás, el zapato que resbala, medio metro del poste)
// (párrafos 20-37).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { BABY, RAG, GIRL, GH, GAUGE, SIL } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/mecbebe/";
export const SHOTS = [
  C(20, "", "ClChapter", { n: 4, title: "Los 7 usos donde sí sirve", sub: "y te ahorran dinero" }),
  // ── 1 calcomanía
  S(21, "", "c", "ClOilMap13", { props: { n: 1 } }),
  S(21, "Elena tenía en el baúl, desde hace doce años", "bi", "b_trunkback", { p: BI(`The back of ${CAR} parked in ${DRIVE}, an old dealership sticker on the trunk lid, no legible text.`) }),
  S(21, "Media despegada, con el pegamento negro alrededor", "bi", "b_stickerglue", { q: "removing sticker", q2: "sticker", p: BI("Extreme close view of the curled corner of an old car sticker with a black ring of dirty adhesive on silver paint, no legible text.") }),
  S(22, "", "bi", "b_ragpress", { p: BI(`Close view of ${H} pressing ${RAG} with a few drops of baby oil flat onto old sticker glue on a silver car trunk.`) }),
  S(22, "y esperas cinco minutos", "bi", "b_wait5", { p: BI(`The rear trunk lid of ${CAR} with a folded light-blue microfiber cloth lying flat on an old sticker, a small white kitchen timer next to it.`), ov: { c: "ClChip", props: { text: "5 minutos" } } }),
  S(22, "Después frotas suave, y sale enrollado como una goma de borrar", "kf", "k_glueroll", { p: BI(`Extreme close view of ${H} rubbing ${RAG} over loosened sticker glue on silver car paint.`), d1: "the cloth rubs gently in small strokes", d2: "the glue rolls up into little dark crumbs like eraser rubbings", sound: "a soft cloth rubbing" }),
  S(22, "Sin raspar la pintura", "av", ""),
  S(23, "", "bi", "b_soapwash", { p: BI(`Close view of ${H} washing a spot on the silver trunk of ${CAR} with a soapy sponge from a bucket.`) }),
  S(23, "Y si tienes etiquetas de precio en un accesorio nuevo", "bi", "b_pricetag", { q: "peeling label", q2: "price tag", p: BI("Close view of a sticky price-tag residue on a new black plastic car accessory, a cloth next to it, no legible text.") }),
  // ── 2 savia
  S(24, "", "c", "ClOilMap13", { props: { n: 2 } }),
  S(24, "La cochera de Elena tiene un árbol al lado", "bi", "b_tree", { p: BI(`A leafy tree hanging over ${DRIVE} where ${CAR} is parked.`) }),
  S(24, "el techo del auto estaba lleno de gotitas pegajosas y duras", "bi", "b_sap", { q: "tree sap car", q2: "tree sap", p: BI("Extreme close view of hard amber drops of tree sap on the silver roof of a car.") }),
  S(25, "", "kf", "k_saprub", { p: BI(`Extreme close view of ${H} rubbing ${RAG} in small circles over sap drops on silver car paint.`), d1: "the cloth circles over the sap", d2: "the sap softens and wipes away", sound: "soft cloth rubbing" }),
  S(25, "Y otra vez, después, jabón para autos", "bi", "st_carsoap", { q: "washing car sponge", p: BI("A sponge with soap washing a car.") }),
  S(25, "Nunca con una esponja de cocina ni con la uña", "bi", "b_scratch", { q: "car paint scratches", q2: "car scratch", p: BI("Extreme close view of fine swirl scratches on silver car paint in sunlight, a green kitchen scouring sponge beside it."), ov: { c: "ClChip", props: { text: "Así se raya", alert: true } } }),
  // ── 3 alquitrán
  S(26, "", "c", "ClOilMap13", { props: { n: 3 } }),
  S(26, "Esas manchitas negras detrás de las ruedas", "bi", "b_tar", { p: BI(`Extreme close view of small black tar spots on the silver paint behind the rear wheel of ${CAR}.`) }),
  S(26, "Paciencia y el paño suave", "bi", "b_tarrub", { p: BI(`Close view of ${H} wiping tar spots off the lower door of ${CAR} with ${RAG}.`) }),
  // ── 4 manos
  S(27, "", "c", "ClOilMap13", { props: { n: 4 } }),
  S(27, "Después de revisar el motor, o de cambiar una lámpara", "bi", "st_handsgrease", { q: "mechanic dirty hands", p: BI("A mechanic's hands black with grease.") }),
  S(27, "Aceite primero, frotas bien", "bi", "b_handsoil", { q: "washing greasy hands", p: BI(`Close view of ${H} black with grease rubbing baby oil between the fingers over a workshop sink.`), d1: "the hands rub the oil in", d2: "the black grease loosens and smears off", sound: "hands rubbing" }),
  S(27, "La grasa se va mucho más rápido que con jabón solo", "bi", "b_cleanhands", { q: "washing hands sink", p: BI(`Close view of ${H} clean after washing with soap over a workshop sink.`) }),
  // ── 5 cromo
  S(28, "", "c", "ClOilMap13", { props: { n: 5 } }),
  S(28, "Los tornillos de la placa, el marco de la placa", "bi", "b_platescrew", { q: "license plate screw", p: BI("Extreme close view of a slightly rusty chrome license-plate screw on a plain plate frame, the plate surface blank."), }),
  S(28, "Una película finita de aceite con el paño", "bi", "b_chromewipe", { p: BI(`Close view of ${H} wiping a chrome plate frame with ${RAG}, the plate blank.`) }),
  S(28, "Finita. Que no gotee", "av", ""),
  // ── 6 herramientas
  S(29, "", "c", "ClOilMap13", { props: { n: 6 } }),
  S(29, "El gato y la llave de ruedas", "bi", "b_jackrust", { p: BI(`Close view of an old scissor car jack and a lug wrench with rust spots lying under the lifted trunk carpet of ${CAR}.`) }),
  S(29, "Los limpiamos y les pasamos el paño aceitado", "bi", "b_jackwipe", { p: BI(`Close view of ${H} wiping a rusty lug wrench with an oily cloth on the bumper of ${CAR}.`), d1: "the cloth slides along the wrench", d2: "the metal is left clean and lightly shiny", sound: "a cloth on metal" }),
  S(29, "El día que tenga una llanta pinchada", "bi", "st_flattire", { q: "flat tire car", p: BI("A flat car tire on a street.") }),
  // ── 7 la prueba del faro
  S(30, "", "c", "ClOilMap13", { props: { n: 7 } }),
  S(30, "Si tus faros están amarillos y opacos", "bi", "b_yellowlight", { p: BI(`Extreme close view of the yellowed, cloudy plastic headlight of ${CAR}.`) }),
  S(30, "pones una gota de aceite en un dedo", "bi", "b_fingerdrop", { q: "oil drop", p: BI(`Extreme close view of a drop of baby oil on the fingertip of ${H} next to a cloudy headlight.`) }),
  S(30, "Si esa parte se pone transparente", "c", "ClDropTest", { props: { mode: "surface" } }),
  S(31, "", "c", "ClDropTest", { props: { mode: "inside" } }),
  S(31, "humedad o el plástico quemado", "bi", "b_lightinside", { q: "foggy headlight", q2: "car headlight", p: BI("Extreme close view of a car headlight with water droplets condensed on the inside of the lens."), }),
  S(31, "un kit de pulir faros o no", "bi", "st_headlightpolish", { q: "headlight restoration", p: BI("A headlight being polished by hand.") }),
  S(32, "", "av", ""),
  S(32, "El aceite en el faro dura hasta la primera lluvia", "bi", "st_rainheadlight", { q: "rain on car", p: BI("Rain drops on a car in the street.") }),
  S(32, "Después de mirar, lo limpias", "bi", "b_lightclean", { p: BI(`Close view of ${H} wiping a headlight of ${CAR} with a clean dry microfiber cloth.`) }),
  S(32, "El faro brillante de los videos de internet es eso", "bi", "b_babyfaro2", { p: BI(`${BABY} on the bumper of ${CAR} next to a glossy headlight.`) }),
  // ── mención 2
  C(33, "", "ClBookPage", { page: I + "page13.jpg", pageNo: 13, stamp: "La lista honesta, en la página" }),
  S(33, "La lista honesta, la de dónde sí y dónde no", "c", "ClOilMap13", { props: { all: true } }),
  // ── el freno
  C(34, "", "ClChapter", { n: 5, title: "Lo que pasó con el freno", sub: "medio metro", alert: true }),
  S(35, "", "bi", "b_reverse", { p: BI(`Early morning, ${CAR} backing out of ${DRIVE} toward the street, seen from the sidewalk.`) }),
  S(35, "el zapato se le resbaló del pedal", "c", "ClGrip", { props: { mode: "oiled" } }),
  S(35, "El auto siguió para atrás un poco más de lo que ella quería", "kf", "k_pole", { p: BI(`Low view from the sidewalk of the rear bumper of ${CAR} rolling slowly backward toward a concrete street-light pole.`), d1: "the car rolls backward slowly", d2: "the car stops half a meter from the pole", sound: "tires creaking on cement" }),
  S(35, "y frenó a medio metro del poste de la luz", "bi", "b_pole", { p: BI(`The rear bumper of ${CAR} stopped half a meter from a concrete street-light pole at the edge of a sidewalk, morning.`), ov: { c: "ClChip", props: { text: "50 cm", alert: true } } }),
  S(36, "", "bi", "b_elenacall", { p: BI(`${ELENA} sitting in ${CAR} in the street with the door open, holding a phone to her ear, shaken.`) }),
  S(36, "para que la goma quedara negra y brillante", "bi", "b_pedalgloss", { q: "car brake pedal", q2: "car pedal", p: BI(`Extreme close view of the ribbed black rubber pad of a car brake pedal, shiny and wet with oil, inside the driver's footwell of an ordinary car.`) }),
  S(36, "es como un pie sobre hielo", "bi", "st_ice", { q: "icy sidewalk", p: BI("An icy frozen sidewalk glistening in the morning.") }),
  S(37, "", "bi", "st_crosswalk", { q: "pedestrian crossing rain", p: BI("A pedestrian crosswalk on a rainy street corner.") }),
  S(37, "Medio metro es la diferencia entre un susto y una desgracia", "av", ""),
  S(37, "Por eso hoy hay una segunda lista", "c", "ClOilMap13", { props: { upto: 13, n: 8 } }),
];
