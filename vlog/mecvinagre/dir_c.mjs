// DIRECTOR C — mecvinagre: lo que salió del radiador (el frasco color té contra la luz, "y yo pensando que el auto estaba viejo", el depósito
// transparente) · el enjuague (pasos 5-6, oler el agua) · el refrigerante nuevo y la purga de burbujas (paso 7, completar en frío) · la
// libreta (2ª línea de Elena: "nunca más agua de la manguera") · los 4 errores (párrafos 46-64).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { BAY, RES, RAD, GAUGE, VIN, DIST, JAR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const NB = "a small worn blue notebook with rounded corners";
export const SHOTS = [
  C(46, "", "ClChapter", { n: 7, title: "Lo que salió del radiador", sub: "siete años de sarro" }),
  S(47, "", "bi", "b_jarunder", { q: "glass jar hands", p: BI(`Low close view of ${JAR} held under the plastic drain plug of a car radiator by ${H}.`) }),
  S(47, "Salió un líquido color té, con escamas blancas", "kf", "k_jarfill", { p: BI(`Extreme close view of ${JAR} half full of tea-colored liquid with white flakes, under a dripping radiator drain.`), d1: "tea-colored liquid drips into the jar", d2: "white flakes swirl and slowly settle", sound: "liquid dripping into a glass jar" }),
  S(47, "y en el fondo una arenilla gris", "bi", "b_jarbottom", { p: BI(`Extreme close view of the bottom of ${JAR} with a layer of gray grit and white scale flakes under brown liquid.`) }),
  S(47, "despegado de los tubitos", "c", "ClRadiator3D", { props: { mode: "flush" } }),
  S(48, "", "bi", "b_jarlight", { p: BI(`${ELENA} holding up ${JAR} of tea-colored liquid against the daylight of her carport, looking at it in silence.`), rev: 1 }),
  S(48, "y yo pensando que el auto estaba viejo", "cl", "c_listen", { p: CLP(`In ${DRIVE} he stands beside ${CAR} with the hood open, wiping his hands on a red rag, smiling gently at the camera.`) }),
  S(49, "", "bi", "b_rescleanish", { p: BI(`Close view of ${RES} removed from the car on a workbench, almost transparent now, a little white crust left in one corner.`) }),
  S(49, "Con un cepillo de mango largo", "kf", "k_brush", { p: BI(`Close view of ${H} pushing a long-handled bottle brush into ${RES} on a workbench.`), d1: "the brush goes into the reservoir", d2: "the brush scrubs and white flakes come loose", sound: "a brush scrubbing plastic" }),
  // ── el enjuague
  C(50, "", "ClChapter", { n: 8, title: "El enjuague", sub: "lo más importante" }),
  S(51, "", "bi", "b_distfill", { p: BI(`Close view of ${H} pouring clear distilled water from ${DIST} through a funnel into the radiator of ${CAR}.`) }),
  S(51, "calefacción al máximo, diez minutos", "bi", "b_idle10", { p: BI(`${CAR} idling in ${DRIVE} with the hood open, morning light, nobody around.`), ov: { c: "ClChip", props: { text: "10 minutos" } } }),
  S(51, "Apagas, esperas que se enfríe, y vacías", "bi", "b_drain2", { q: "draining car fluid", p: BI("Low close view of pale brownish water running from under a car radiator into a black drain pan.") }),
  S(52, "", "av", ""),
  S(52, "Dos enjuagues, no uno", "c", "ClCheck", { props: { title: "El enjuague", items: ["Agua destilada sola", "10 minutos andando", "Enfriar y vaciar", "Otra vez: dos enjuagues"], fast: true } }),
  S(52, "sigue trabajando contra el metal", "bi", "b_alucorr2", { p: BI("Extreme close view of an aluminum engine water outlet with white pitting corrosion, held in a hand.") }),
  S(53, "", "bi", "b_smell", { p: BI(`Close view of ${H} holding a small cup of drained water near his nose to smell it, ${CAR} behind.`) }),
  S(53, "Si todavía huele a vinagre, un tercer enjuague", "av", ""),
  S(53, "ya salía transparente y sin olor", "bi", "b_clearwater", { q: "water draining", p: BI("Low close view of perfectly clear water running from under a car radiator into a drain pan.") }),
  // ── el refrigerante nuevo
  C(54, "", "ClChapter", { n: 9, title: "El refrigerante nuevo", sub: "y las burbujas" }),
  S(55, "", "bi", "b_greenpour", { p: BI(`Close view of ${H} pouring bright green coolant from a plain jug through a funnel into the radiator of ${CAR}.`) }),
  S(55, "Si es concentrado, se mezcla con agua destilada", "bi", "b_concentrate", { q: "coolant jugs", p: BI(`A plain jug of green coolant and a plain jug of clear water, both with blank white labels, side by side next to a measuring jug on a workbench.`) }),
  S(56, "", "av", ""),
  S(56, "adentro queda aire atrapado", "bi", "st_hosebubble", { q: "car radiator hose", p: BI("Close view of a radiator hose on an engine.") }),
  S(56, "una burbuja de aire en el motor es un hueco donde no llega el líquido", "c", "ClBubbleTest", { props: { mode: "normal" } }),
  S(56, "ese punto se recalienta", "av", ""),
  S(57, "", "bi", "b_capopen", { p: BI(`Close view of the open filler of ${RES} with green coolant inside, ${CAR} idling, ${H} resting on the fender.`) }),
  S(57, "Vas a ver subir burbujas", "kf", "k_bubbles", { p: BI(`Extreme close view down into the open filler neck of a car radiator full of bright green coolant.`), d1: "small air bubbles rise to the surface", d2: "the bubbles pop and the level drops a little", sound: "coolant gurgling" }),
  S(57, "Cuando el nivel baja, completas, hasta que paren", "bi", "b_topup", { q: "filling coolant", p: BI(`Close view of ${H} topping up green coolant from a plain jug into an open radiator neck.`) }),
  S(57, "Algunos autos tienen un tornillito de purga", "bi", "b_bleedscrew", { q: "screwdriver engine", p: BI("Extreme close view of a small brass bleeder screw on top of an engine thermostat housing, a screwdriver next to it.") }),
  S(58, "", "bi", "b_capclose", { p: BI(`Close view of ${H} screwing the black cap back onto ${RES}.`) }),
  S(58, "completas hasta la marca", "bi", "b_resmax", { p: BI(`Extreme close view of ${RES} filled with green coolant exactly up to the MAX line, morning light.`) }),
  S(58, "el líquido se expande con el calor", "av", ""),
  // ── la libreta
  S(59, "", "bi", "b_nbseat", { p: BI(`${ELENA} sitting in the driver's seat of ${CAR} with the door open, ${NB} on the steering wheel, a pen in her hand.`) }),
  S(59, "escribió la segunda", "c", "ClLogbook", { props: { mode: "new", elena: ["10/2026 · 280.400", "PCV, f. aire, aceite", "10/2026 · 280.900", "lavado vinagre, verde"] } }),
  S(59, "Y al costado agregó, con su letra", "bi", "b_writing", { p: BI(`Extreme close view of ${EH} writing in ${NB} with a ballpoint pen, handwriting in two different inks on the page, nothing legible.`) }),
  S(59, "nunca más agua de la manguera", "c", "ClLogbook", { props: { mode: "two", elena: ["10/2026 · 280.400", "PCV, f. aire, aceite", "10/2026 · 280.900", "lavado vinagre, verde", "¡nunca más manguera!"] } }),
  // ── errores
  C(60, "", "ClChapter", { n: 10, title: "Los errores con el vinagre", sub: "los que más veo", alert: true }),
  S(61, "", "bi", "b_err1", { p: BI(`Close view of a hand pouring undiluted vinegar straight from ${VIN} into a car radiator filler.`), ov: { c: "ClChip", props: { text: "1 · Vinagre puro", alert: true } } }),
  S(61, "y también el aluminio", "bi", "b_alupit2", { p: BI("Extreme close view of an aluminum radiator tank with white corrosion pits.") }),
  S(62, "", "bi", "b_err2", { p: BI(`${CAR} driving on a city street, seen from the sidewalk.`), ov: { c: "ClChip", props: { text: "2 · Días adentro", alert: true } } }),
  S(62, "Quince a veinte minutos, nada más", "av", ""),
  S(63, "", "bi", "b_err3", { q: "pouring water engine", p: BI("Close view of a single rinse jug of water being poured into a car radiator, the drain pan below still holding vinegar-brown water."), ov: { c: "ClChip", props: { text: "3 · Un solo enjuague", alert: true } } }),
  S(63, "Dos enjuagues, siempre", "av", ""),
  S(64, "", "c", "ClHotCap", {}),
  S(64, "Ese error no rompe el auto", "av", ""),
  S(64, "Te rompe a ti", "bi", "b_steamface", { p: BI(`Close view of a hot steaming radiator cap on an older car engine, a gloved hand pulled back from it.`), rev: 1 }),
];
