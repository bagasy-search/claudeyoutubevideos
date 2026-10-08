// DIRECTOR C — mecmillon: hábitos 4-9 (varilla y color, el motor que gasta aceite, refrigerante en frío, líquido de frenos, correa de
// distribución, no andar en reserva, ruido nuevo, llantas, turbo) · LA LIBRETA DE DON ERNESTO (= pago del loop: la guantera, las entradas,
// la nota de la playa, la última línea, por qué llegó a 280 mil, vale dinero, Elena escribe la primera línea nueva) (párrafos 32-50).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { PCV, BAY } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const NB = "a small worn blue notebook with rounded corners";
export const SHOTS = [
  // ── 4 · la varilla
  S(32, "", "bi", "st_dipstick", { q: "engine oil dipstick", p: BI(`Close view of ${H} pulling out an engine oil dipstick.`) }),
  S(32, "la limpias con un papel", "kf", "k_wipe", { p: BI(`Close view of ${H} wiping an engine oil dipstick with a white paper towel over the open engine bay.`), d1: "the paper towel grips the dipstick", d2: "the hand slides the towel down the dipstick wiping it clean", sound: "a paper towel rub" }),
  S(32, "El aceite tiene que estar entre las dos marcas", "bi", "b_marks", { p: BI("Extreme close view of the tip of an engine oil dipstick with two small holes as marks, an amber oil film right between them.") }),
  S(33, "", "c", "ClColorCode", { props: { pick: 0, items: [{ c: "#C8902E", name: "Ámbar o marrón", what: "Aceite sano", fix: "Seguir" }, { c: "#1B1A16", name: "Negro y espeso", what: "Ya toca cambio", fix: "Cambiar" }, { c: "#CBB59A", name: "Café con leche", what: "No es normal", fix: "Taller" }] } }),
  S(33, "con espuma o color café con leche", "bi", "b_milky", { p: BI("Extreme close view of the underside of an engine oil filler cap with a light brown milky sludge on it, held by fingertips.") }),
  S(34, "", "av", ""),
  S(34, "Mide cada mil kilómetros", "c", "ClLogbook", { props: { mode: "consume" } }),
  S(34, "Muchas veces el motor gastado era una valvulita tapada", "bi", "b_pcvpalm", { p: BI(`Extreme close view of an old greasy ${PCV} lying in the palm of ${H}.`) }),
  // ── 5-6 · refrigerante y frenos
  S(35, "", "bi", "st_coolant", { q: "coolant reservoir car", p: BI("Close view of a car coolant reservoir with its level marks.") }),
  S(35, "con el motor frío, a la mañana", "bi", "b_coolantlevel", { p: BI(`Morning, close view of the translucent coolant reservoir in ${BAY}, the colored liquid between the MIN and MAX lines, ${H} pointing.`) }),
  S(35, "nunca abras la tapa del radiador con el motor caliente", "c", "ClCheck", { props: { title: "El refrigerante", items: ["Mirarlo con el motor frío", "Entre las dos marcas", "Nunca abrir caliente"], fast: true } }),
  S(36, "", "bi", "st_brakefluid", { q: "brake fluid reservoir", p: BI("Close view of a brake fluid reservoir in an engine bay.") }),
  S(36, "con el tiempo absorbe humedad", "bi", "b_brakefluid", { p: BI("Two small glass jars side by side on a workbench: one with fresh clear golden brake fluid, one with old dark brown brake fluid.") }),
  S(36, "justo cuando más los necesitas", "av", ""),
  // ── 7-8 · correa y reserva
  S(37, "", "bi", "st_timingbelt", { q: "timing belt engine", p: BI(`Close view of ${H} holding a rubber timing belt over an open engine.`) }),
  S(37, "Si se corta andando", "bi", "b_brokenbelt", { p: BI("A snapped old rubber timing belt lying on a workbench next to a new one, frayed ends.") }),
  S(37, "Busca en el manual si tu motor tiene correa o cadena", "av", ""),
  S(38, "", "bi", "b_fuelreserve", { p: BI(`Extreme close view of the fuel gauge of ${CABIN} with the needle almost on empty and the low fuel light on.`) }),
  S(38, "La bomba de gasolina está adentro del tanque", "bi", "b_fuelpump", { p: BI("A used car fuel pump assembly with its float arm lying on a workbench in a workshop.") }),
  S(38, "Carga cuando llegues a un cuarto", "bi", "st_fuelling", { q: "refueling car gas station", p: BI("A car being refueled at a gas station pump.") }),
  // ── 9 · ruido / llantas / turbo
  S(39, "", "av", ""),
  S(39, "no le subas el volumen a la radio", "bi", "b_radio", { p: BI(`Close view of ${EH} reaching for the volume knob of the radio in ${CABIN}.`) }),
  S(39, "Un ruido a tiempo es una pieza", "bi", "b_partsmall", { p: BI(`Close view of ${H} holding a small worn engine pulley bearing on a workbench.`) }),
  S(39, "Un ruido de seis meses es un motor", "bi", "st_engineblock", { q: "engine block repair", p: BI("A disassembled engine block on a stand in a workshop.") }),
  S(40, "", "bi", "b_tiregauge", { p: BI(`Close view of ${H} pressing a tire pressure gauge onto the valve of a front tire of ${CAR}.`) }),
  S(40, "el motor hace más fuerza para lo mismo", "av", ""),
  S(41, "", "bi", "st_turbo", { q: "car turbocharger", p: BI("Close view of a car turbocharger in an engine bay.") }),
  S(41, "déjalo andar treinta segundos antes de apagarlo", "bi", "b_turbowait", { p: BI("Close view of a hand resting on a car key in the ignition, not turning it yet, the dashboard lit.") }),
  // ── la libreta de Don Ernesto
  C(42, "", "ClChapter", { n: 5, title: "La libreta de Don Ernesto", sub: "el hábito más importante" }),
  S(43, "", "bi", "b_glovesearch", { p: BI(`Close view of ${H} lifting an owner's manual out of the open glovebox of ${CABIN}, papers underneath.`) }),
  S(43, "había una libreta chiquita de tapa azul", "kf", "k_notebook", { p: BI(`Close view inside an open car glovebox: ${NB} lying under papers, ${EH} reaching toward it.`), d1: "the hand reaches into the glovebox", d2: "the hand pulls out the small blue notebook", sound: "paper rustling" }),
  S(43, "con las esquinas gastadas", "bi", "b_nbcorner", { p: BI(`Extreme close view of the worn rounded corners of ${NB} in ${EH}.`) }),
  S(44, "", "c", "ClLogbook", { props: { mode: "ernesto" } }),
  S(44, "Cada cinco mil kilómetros, sin faltar uno", "bi", "b_nbpages", { p: BI(`Close view of ${EH} slowly turning pages of ${NB} filled with neat handwritten columns of dates and numbers.`) }),
  S(44, "Filtro de aire, líquido de frenos, todo", "bi", "b_nbentry", { p: BI("Extreme close view of a page of a small notebook with neat block-letter handwriting in blue ink, columns of dates and numbers, slightly smudged.") }),
  S(45, "", "c", "ClLogbook", { props: { mode: "last" } }),
  S(45, "Y después, hojas en blanco", "bi", "b_blankpages", { p: BI(`Close view of ${NB} open on a car seat, the right page completely blank, the left page with the last handwritten line.`), rev: 1 }),
  S(46, "", "bi", "b_nbnote", { p: BI("Extreme close view of a handwritten note in a different blue ink squeezed in the margin of a small notebook page, next to an oil change entry.") }),
  S(46, "llantas nuevas antes del viaje a la playa con Elena", "bi", "b_beachphoto", { p: BI("A faded printed photo tucked into a small notebook: a gray-haired man with a mustache and a woman with dark hair in a bun smiling next to a silver sedan at a beach parking lot.") }),
  S(46, "Ella se rió y se le llenaron los ojos", "bi", "b_elenatears", { p: BI(`${ELENA} sitting in the driver seat of ${CAR} holding a small blue notebook, smiling with wet eyes.`) }),
  S(47, "", "bi", "b_elenanb", { p: BI(`${ELENA} standing next to ${CAR} in ${SHOP} holding the small blue notebook against her chest, looking at it.`) }),
  S(47, "el auto iba a durar más que los dos", "av", ""),
  S(48, "", "av", ""),
  S(48, "Llegó porque durante años alguien lo cuidó a tiempo", "bi", "b_ernestocare", { p: BI("A faded printed family photo: a gray-haired man with a mustache checking the oil of a silver sedan with the hood open in a driveway, smiling.") }),
  S(48, "Lo que le hizo daño fueron los seis años en blanco", "c", "ClLogbook", { props: { mode: "gap" } }),
  S(49, "", "bi", "st_sellcar", { q: "selling used car handshake", p: BI("Two people shaking hands next to a used car with keys being handed over.") }),
  S(49, "y paga más", "av", ""),
  S(50, "", "bi", "b_pen", { p: BI(`Close view of ${EH} taking a pen out of a small handbag next to an open blue notebook on the hood of ${CAR}.`) }),
  S(50, "escribió la primera línea nueva", "c", "ClLogbook", { props: { mode: "new" } }),
  S(50, "Con su letra", "bi", "b_twohands", { p: BI("Extreme close view of a small notebook page with two different handwritings one under the other, the newer one shakier, a pen resting on it."), rev: 1 }),
];
