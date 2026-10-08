// DIRECTOR B — mecvinagre: de dónde salió el sarro (la libreta de Don Ernesto: refrigerante verde cada 2 años · el sobrino y la manguera
// del jardín · los 2 trabajos del refrigerante · la regla) · por qué funciona el vinagre (ácido + caliza · la trampa del aluminio · internet ·
// el aviso honesto) · el lavado pasos 1-4 (motor frío, vaciar, marrón, no tirarlo, la mezcla 1:4, calefacción al máximo, 15-20 min) ·
// mención 2 (ClBookPage pág. 12) (párrafos 25-45).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { BAY, RES, RAD, GAUGE, VIN, DIST, JAR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/mecvinagre/";
const NB = "a small worn blue notebook with rounded corners";
export const SHOTS = [
  C(25, "", "ClChapter", { n: 4, title: "De dónde salió el sarro", sub: "la libreta lo dice" }),
  // ── la libreta
  S(26, "", "bi", "b_nbopen", { p: BI(`Close view of ${EH} opening ${NB} on the passenger seat of ${CABIN}, handwritten lines in blue ink, nothing legible.`) }),
  S(26, "Él había cambiado el refrigerante cada dos años", "c", "ClLogbook", { props: { mode: "ernesto", rows: [["03/13", "15.200", "refrig. verde", ""], ["04/15", "41.800", "refrig. verde", ""], ["05/17", "88.300", "refrig. verde", ""], ["…", "…", "…", ""], ["06/19", "251.000", "refrig. verde", ""]], tag: "Cada 2 años, el verde" } }),
  S(26, "La última vez, siete años atrás", "c", "ClLogbook", { props: { mode: "last", rows: [["03/13", "15.200", "refrig. verde", ""], ["04/15", "41.800", "refrig. verde", ""], ["05/17", "88.300", "refrig. verde", ""], ["…", "…", "…", ""], ["06/19", "251.000", "refrig. verde", ""]], note: ["La última vez", "siete años atrás"] } }),
  // ── el sobrino
  S(27, "", "bi", "b_elenaremember", { p: BI(`${ELENA} sitting in the passenger seat of ${CAR} with ${NB} on her lap, looking out the window, remembering.`) }),
  S(27, "su sobrino le ponía agua", "bi", "b_nephew", { p: BI(`A young man in his twenties in a t-shirt pouring water from a garden hose into ${RES} of ${CAR} in ${DRIVE}, smiling, from behind and the side.`) }),
  S(27, "De la manguera del jardín", "kf", "k_hosefill", { p: BI(`Extreme close view of the brass nozzle of a green garden hose pushed into the opening of ${RES}.`), d1: "water starts running from the hose nozzle into the reservoir", d2: "the water level rises in the reservoir", sound: "water running from a garden hose" }),
  S(27, "Con todo el cariño del mundo, para ayudarla", "bi", "b_nephewhug", { p: BI(`${ELENA} patting the arm of a young man in a t-shirt next to ${CAR} in ${DRIVE}, both smiling, a garden hose on the floor.`) }),
  S(27, "Durante años", "bi", "b_hoseyears", { p: BI(`A green garden hose coiled on a hook on the low white wall of ${DRIVE}, faded by the sun.`) }),
  S(28, "", "av", ""),
  S(28, "alguna vez alguien le dijo que era lo mismo", "bi", "st_hosecar", { q: "garden hose car", q2: "garden hose watering", p: BI("A garden hose lying next to a parked car.") }),
  // ── los dos trabajos
  S(29, "", "bi", "b_coolantjug", { p: BI(`Close view of ${H} holding a plain jug of green antifreeze coolant with a blank label in ${SHOP}.`) }),
  S(29, "que el líquido no hierva ni se congele", "c", "ClCheck", { props: { title: "El refrigerante", items: ["No hierve con el calor", "No se congela con el frío", "No deja oxidar el metal"], fast: true } }),
  S(29, "El agua de la llave no hace ninguna de las dos cosas", "bi", "b_rustytube", { q: "rusty hose", p: BI("Extreme close view of the cut end of an old radiator hose with a rusty brown crust inside.") }),
  S(29, "Y además deja minerales", "bi", "b_crust2", { p: BI(`Extreme close view of white mineral crust on the inner wall of ${RES}, a fingertip touching it.`) }),
  // ── la regla
  S(30, "", "av", ""),
  S(30, "al radiador, nunca agua de la llave", "bi", "b_nohose", { p: BI(`Close view of ${H} pulling a garden hose nozzle away from the open coolant reservoir of an older car.`), ov: { c: "ClStampOv", props: { text: "NUNCA" } } }),
  S(30, "Si te quedas sin refrigerante en la ruta", "bi", "st_roadside", { q: "car broken down roadside", q2: "car hood open roadside", p: BI("A car stopped on the shoulder of a highway with its hood open.") }),
  S(30, "Pero después se vacía y se pone el correcto", "av", ""),
  // ── por qué funciona
  C(31, "", "ClChapter", { n: 5, title: "Por qué funciona el vinagre", sub: "y dónde hace daño" }),
  S(32, "", "bi", "b_vinpour", { p: BI(`${VIN} being poured into a glass measuring cup on a kitchen counter.`) }),
  S(32, "el sarro es básicamente piedra caliza", "bi", "st_limestone", { q: "limestone rock", p: BI("Close view of a piece of white limestone rock.") }),
  S(32, "El ácido la disuelve", "kf", "k_fizz", { p: BI("Extreme close view of a white limescale flake dropped into a glass of clear vinegar on a kitchen counter."), d1: "tiny bubbles start to rise from the white flake", d2: "the flake fizzes and slowly shrinks", sound: "a soft fizz" }),
  S(32, "cuando dejas la regadera una noche en una bolsa con vinagre", "bi", "b_showerbag", { q: "cleaning shower head", p: BI("A shower head wrapped in a clear plastic bag filled with vinegar, tied with a rubber band, in an ordinary tiled bathroom.") }),
  S(32, "a la mañana sale limpia", "bi", "st_showerclean", { q: "shower head water", p: BI("A clean shower head spraying water.") }),
  S(33, "", "av", ""),
  S(33, "El vinagre también ataca el aluminio", "bi", "b_alupit", { q: "corroded metal", p: BI("Extreme close view of a pitted, corroded aluminum radiator tank end with white corrosion spots, on a workbench.") }),
  S(33, "muchos radiadores y piezas del motor son de aluminio", "bi", "st_aluminumparts", { q: "aluminum engine part", p: BI("Close view of an aluminum engine part.") }),
  S(33, "lo pones puro o no enjuagas", "bi", "b_purevin", { q: "pouring vinegar", p: BI(`Close view of ${H} about to pour undiluted vinegar straight from ${VIN} into a radiator, stopping.`), ov: { c: "ClChip", props: { text: "Puro: no", alert: true } } }),
  S(33, "empieza a comerse el metal", "av", ""),
  S(34, "", "bi", "st_phonevideo", { q: "watching video phone", p: BI("Close view of hands holding a smartphone playing a video.") }),
  S(34, "Las dos cosas pueden ser verdad", "av", ""),
  S(34, "Diluido, un rato corto y bien enjuagado, funciona", "c", "ClCheck", { props: { title: "Vinagre: sí, así", items: ["Diluido 1 : 4", "15 a 20 minutos", "Dos enjuagues"], fast: true } }),
  S(34, "Puro y por días, hace daño", "bi", "b_aludamage", { p: BI("Extreme close view of a damaged aluminum radiator neck with white powdery corrosion.") }),
  S(35, "", "av", ""),
  S(35, "si el manual del auto dice que no se hagan lavados del sistema", "bi", "b_manualnew", { q: "reading car manual", p: BI(`Close view of ${H} reading a page of a car owner's manual about cooling system maintenance, nothing legible.`) }),
  S(35, "Usa el limpiador de radiador que venden en la refaccionaria", "bi", "b_cleanerbottle", { q: "car care products", p: BI("A plain bottle of radiator flush cleaner with a blank label on the counter of a small auto parts store.") }),
  S(35, "o pide el servicio en el taller", "bi", "st_mechanicshop", { q: "mechanic car service", p: BI("A mechanic working on a car in a repair shop.") }),
  // ── el lavado, pasos 1-4
  C(36, "", "ClChapter", { n: 6, title: "El lavado, paso por paso", sub: "siempre con el motor frío" }),
  S(37, "", "av", ""),
  S(37, "siempre con el motor frío, apagado varias horas", "bi", "b_morning", { q: "car morning dew", p: BI(`Early morning, ${CAR} parked in ${DRIVE} with dew on the windshield, the hood closed.`) }),
  S(37, "Si apoyas la mano en el capó y está tibio", "bi", "b_handhood", { q: "hand on car hood", p: BI(`Close view of ${H} resting flat on the hood of ${CAR} to feel the warmth.`), ov: { c: "ClChip", props: { text: "Tibio = todavía no", alert: true } } }),
  S(38, "", "bi", "b_drainpan", { p: BI(`Low view of ${H} sliding a large black drain pan under the front of ${CAR} parked on ramps in ${DRIVE}.`) }),
  S(38, "hay un tapón de plástico que se desenrosca con la mano", "kf", "k_draincock", { p: BI("Extreme close view of fingers turning a small plastic drain plug at the bottom corner of an old car radiator."), d1: "the fingers turn the plastic plug", d2: "brown coolant starts to trickle out", sound: "a plastic creak and a trickle" }),
  S(38, "se suelta la manguera de abajo", "bi", "b_lowerhose", { q: "radiator hose clamp", p: BI("Close view of pliers squeezing the spring clamp on the lower radiator hose of an older car.") }),
  S(38, "Y dejas salir todo el líquido viejo", "bi", "b_draining", { q: "draining coolant car", p: BI("Low close view of brown coolant pouring from under a car radiator into a black drain pan.") }),
  S(39, "", "bi", "b_brownpan", { q: "dirty water bucket", p: BI("Close view inside a black drain pan full of dark brown coolant with small white flakes floating on top.") }),
  S(39, "esto es lo que tenía mi auto en las venas", "bi", "b_elenalook", { p: BI(`${ELENA} bending down in ${DRIVE} looking into a drain pan of brown liquid, a hand on her cheek.`) }),
  S(40, "", "av", ""),
  S(40, "Es tóxico y tiene gusto dulce, y los perros se lo toman", "bi", "st_dogdrive", { q: "dog driveway", p: BI("A dog sniffing the ground in a driveway.") }),
  S(40, "En botellas cerradas, al taller o al reciclaje", "bi", "b_bottles", { q: "plastic bottles garage", p: BI(`Close view of ${H} screwing the cap on a used plastic bottle filled with brown old coolant, two more beside it on the cement floor.`) }),
  S(40, "Casi todos te lo reciben gratis", "av", ""),
  S(41, "", "c", "ClMixJug", { props: { mode: "mix" } }),
  S(41, "Un litro de vinagre y cuatro de agua", "bi", "b_jugmix", { p: BI(`Close view of ${H} pouring distilled water into a large clear measuring jug that already has some vinegar in it, on a workbench in ${SHOP}.`) }),
  S(41, "Nunca vinagre puro", "av", ""),
  S(41, "Cierras el tapón y llenas despacio, con el embudo", "kf", "k_funnel", { p: BI("Extreme close view of a plastic funnel in the filler neck of an older car radiator."), d1: "clear liquid is poured into the funnel", d2: "the liquid level in the funnel drops as it drains in", sound: "liquid gurgling into a funnel" }),
  S(42, "", "bi", "b_heatermax", { q: "car heater knob", p: BI(`Extreme close view of ${H} turning the temperature knob of the heater in ${CABIN} all the way to red.`) }),
  S(42, "con el ventilador al máximo", "bi", "b_fanknob", { q: "car air conditioning knob", p: BI(`Extreme close view of the fan speed knob on the dashboard of ${CABIN} turned to maximum.`) }),
  S(42, "Adentro del tablero hay otro radiador chiquito", "bi", "st_heatercore", { q: "car heater core", p: BI("A small car heater core radiator on a workbench.") }),
  S(42, "la mezcla tiene que pasar también por ahí", "c", "ClRadiator3D", { props: { mode: "flush" } }),
  S(43, "", "c", "ClMixJug", { props: { mode: "timer" } }),
  S(43, "Y nunca dejes la mezcla adentro días", "bi", "b_calendar", { q: "wall calendar", p: BI("Close view of a paper wall calendar in a kitchen with several days crossed out in red pen, nothing legible."), ov: { c: "ClChip", props: { text: "Días: no", alert: true } } }),
  S(43, "Ése es el error que rompe radiadores", "av", ""),
  S(44, "", "bi", "b_cooldown", { p: BI(`${CAR} parked in ${DRIVE} with the hood open, the engine off, afternoon shadow.`) }),
  S(44, "Aquí viene lo lindo", "av", ""),
  // ── mención 2
  C(45, "", "ClBookPage", { page: I + "page12.jpg", pageNo: 12, stamp: "Los tiempos, en la página" }),
  S(45, "Con una tablita para que anotes cuánto líquido le entra a tu radiador", "bi", "b_writecap", { p: BI(`Close view of ${EH} writing with a pen in a printed table on a car seat, a jug of coolant beside it, nothing legible.`) }),
];
