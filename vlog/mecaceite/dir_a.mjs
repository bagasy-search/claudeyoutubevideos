// DIRECTOR A — mecaceite (Claudio el Mecánico #6, "El auto de Doña Elena" ep. 6: los 9 errores después de cambiar el aceite):
// MINUTO 1 (la varilla goteando muy arriba de la marca → el lubricentro de 15 minutos con café → la varilla 2 días después + la gota en el
// tapón → loop: la luz de los segundos → promesa + antes/después de la varilla → credibilidad + 3 pruebas → capítulo) + la cochera (polaroid
// del ep. 5), por qué pasa tan seguido · cómo se mide bien · la varilla de Elena · lo que hay que pedir (mención 1, pág. 14) (párrafos 0-18).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const BAY = "the engine bay of an older ordinary compact sedan with the hood open, a little dusty, a plastic engine cover";
export const GAUGE = "the plain black analog instrument cluster of an ordinary 2012 compact sedan";
export const DIP = "an engine oil dipstick with a yellow ring handle";
export const LUBE = "a small quick-lube oil change shop in a Latin American town: one open service bay with a pit, a technician in a polo shirt, a small waiting room with a coffee machine, no legible signs";
export const JUG = "a plain yellow 4-liter motor oil jug with a blank label";
export const PLUG = "the oil drain plug on the bottom of the aluminum oil pan of an older car";
export const FILTER = "a plain blue spin-on oil filter with no brand";
const I = "img/mecaceite/";
export const SHOTS = [
  // ── 0:00 · la varilla goteando
  S(0, "", "cl", "c_dipover0", { p: CLP(`In ${DRIVE}, next to the open hood of ${CAR}, he holds ${DIP} up toward the camera: thick shiny golden oil coats the stick far above the two marks near the tip and a fat drop is falling onto a white rag in his other hand, eyebrows raised in disbelief.`), ov: { c: "ClStampOv", props: { text: "+1 LITRO" } } }),
  S(0, "casi todo el mundo", "av", ""),
  S(0, "Y es una de las formas más rápidas de matar un motor", "bi", "st_engineblock", { q: "car engine close", p: BI("Close view of an older car engine.") }),
  S(0, "Mira dónde está el aceite en esta varilla", "c", "ClDipstick", { props: { mode: "over" } }),
  S(0, "Y mira dónde tendría que estar", "bi", "b_dipok0", { p: BI(`Extreme close view of ${DIP} over a white rag, golden oil just below the upper mark.`) }),
  // ── el lubricentro
  S(1, "", "bi", "b_lube0", { p: BI(`${CAR} driving into the service bay of ${LUBE}.`) }),
  S(1, "que te lo hacen en quince minutos", "bi", "st_quicklube", { q: "oil change service", p: BI("A technician draining oil from a car in a quick-lube bay.") }),
  S(1, "con café gratis en la sala de espera", "bi", "b_waiting", { p: BI(`${ELENA} sitting in the small waiting room of ${LUBE} with a paper cup of coffee, looking through the window at her car.`) }),
  S(1, "Salió contenta", "bi", "b_elenaleave", { p: BI(`${ELENA} driving ${CAR} out of ${LUBE}, smiling.`) }),
  S(1, "Su auto tenía aceite nuevo", "bi", "st_freshoil", { q: "pouring motor oil", p: BI("Fresh golden motor oil pouring into an engine.") }),
  // ── 2 días después
  S(2, "", "bi", "b_drivewayday", { p: BI(`${CAR} parked in ${DRIVE} with the hood open, ${H} reaching for the dipstick, midday.`) }),
  S(2, "saqué la varilla por costumbre", "kf", "k_dippull", { p: BI(`Close view of ${H} gripping the yellow ring of ${DIP} in ${BAY}.`), d1: "the hand pulls the dipstick out", d2: "the dipstick comes out dripping golden oil", sound: "a metal dipstick sliding out" }),
  S(2, "y no lo podía creer", "av", ""),
  S(2, "Le habían puesto casi un litro de más", "bi", "b_litro", { p: BI(`${JUG} standing on the fender of ${CAR} next to the open hood.`), ov: { c: "ClChip", props: { text: "+1 litro", alert: true } } }),
  S(2, "una gota nueva, colgando", "kf", "k_plugdrip", { p: BI(`Low view under the engine of an old car: the gray metal oil pan with its drain plug, a fresh golden oil drop forming on the plug, a cement floor below.`), d1: "the oil drop slowly grows on the plug", d2: "the drop falls", sound: "a tiny drip" }),
  // ── el loop de la luz
  S(3, "", "bi", "b_dashnight", { p: BI(`Close view of ${GAUGE} lit at dusk with the engine running.`) }),
  S(3, "te da segundos para apagar el motor", "c", "ClOilLight", { props: { mode: "red" } }),
  S(3, "Te la muestro en un rato", "av", ""),
  // ── la promesa
  S(4, "", "bi", "st_oilpour2", { q: "oil change engine", p: BI("Close view of motor oil being poured into an engine through a funnel.") }),
  S(4, "Lo cambies tú o lo cambie el taller", "bi", "b_lubebay", { p: BI(`A technician in a polo working under a car in the pit of ${LUBE}.`) }),
  S(4, "son los que reviso siempre antes de irme", "cl", "c_check", { p: CLP(`In ${SHOP} he crouches and looks under the front of ${CAR} with a flashlight, then glances at the camera.`) }),
  S(4, "Así estaba la varilla de Elena", "bi", "b_dipbefore", { p: BI(`A long thin metal engine oil dipstick lying on a white rag: shiny honey-colored oil coats more than half of its length, a big oily stain on the rag around it.`), ov: { c: "ClChip", props: { text: "Así estaba", alert: true } } }),
  S(4, "Y así quedó", "bi", "b_dipafter", { p: BI(`Extreme close view of the tip of ${DIP} lying on a white rag: golden oil reaches exactly to just below the upper of the two small holes, the rest of the stick dry and clean.`), ov: { c: "ClChip", props: { text: "Así quedó" } } }),
  // ── credibilidad
  S(5, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "35 años de mecánico" } } }),
  S(5, "Y al final te doy", "bi", "b_cardnight", { p: BI(`Night, a flattened cardboard sheet under the front of ${CAR} on a cement floor, lit by a flashlight.`) }),
  S(5, "de diez minutos", "bi", "b_lightswall", { p: BI(`Evening, the front of ${CAR} with a plain grille without any emblem, facing a white wall with its headlights on.`), ov: { c: "ClChip", props: { text: "$0 · 10 minutos" } } }),
  S(5, "a cualquier taller", "bi", "st_shopstreet", { q: "car repair shop", p: BI("An ordinary small car repair shop seen from the street.") }),
  C(6, "", "ClChapter", { n: 1, title: "Lo que encontré en la cochera", sub: "la varilla y la gota" }),
  // ── polaroid del ep. 5
  C(7, "", "ClVideoRef", { thumb: I + "th_mecbebe.jpg", title: "13 trucos con aceite para bebé", tag: "VIDEO ANTERIOR" }),
  S(7, "el sedán plateado del 2012", "bi", "b_carside", { p: BI(`The whole side of ${CAR} parked in ${DRIVE} in daylight.`) }),
  S(7, "le sacamos el aceite de bebé de los pedales y del volante", "bi", "b_pedalclean", { p: BI(`Low close view of clean matte rubber pedals in ${CABIN}.`) }),
  S(7, "Te dejo ese video aquí", "av", ""),
  // ── Elena no hizo nada mal
  S(8, "", "av", ""),
  S(8, "Antes del viaje a la playa con su hermana", "bi", "b_beachbag", { p: BI(`A straw beach bag and a folded beach umbrella in the open trunk of ${CAR} in ${DRIVE}.`) }),
  S(8, "Lo anotó en la libreta azul con su letra", "c", "ClLogbook", { props: { mode: "new", elena: ["10/2026 · 281.300", "limpieza, silicona gomas", "10/2026 · 281.700", "aceite (lubricentro)"] } }),
  S(8, "Fue lo que no se revisó", "av", ""),
  S(9, "", "bi", "st_oilchange3", { q: "mechanic oil change", p: BI("A mechanic changing the oil of a car.") }),
  S(9, "alguien saca todo el aceite del motor", "bi", "b_draining", { p: BI(`Low view under a car on a lift: black old oil pouring from ${PLUG} into a drain pan.`) }),
  S(9, "Con prisa, con otros cinco autos esperando", "bi", "b_queue", { q: "cars waiting line", p: BI(`Several cars waiting in line outside ${LUBE}.`) }),
  S(9, "Por eso es justo ahí donde más motores se arruinan", "av", ""),
  S(10, "", "av", ""),
  S(10, "Hay talleres buenísimos", "bi", "st_goodshop", { q: "auto repair shop clean", p: BI("A clean, organized car repair shop.") }),
  S(10, "qué mirar en cinco minutos, antes de irte", "bi", "b_checkunder", { p: BI(`${EH} holding a small flashlight, bending to look under the front of ${CAR} outside a quick-lube shop.`) }),
  // ── cómo se mide
  C(11, "", "ClChapter", { n: 2, title: "Cómo se mide bien", sub: "la varilla, sin trampa" }),
  S(12, "", "c", "ClDipstick", { props: { mode: "how" } }),
  S(12, "no en la bajada de la cochera", "bi", "b_slope", { p: BI(`${CAR} parked on the sloped cement ramp of ${DRIVE}, nose down.`), ov: { c: "ClChip", props: { text: "Así no", alert: true } } }),
  S(12, "Y el motor apagado por lo menos cinco minutos", "bi", "b_keyoff", { q: "turning off car key", p: BI(`Close view of ${H} turning the ignition key of ${CABIN} off and pulling it out.`), ov: { c: "ClChip", props: { text: "5 minutos" } } }),
  S(13, "", "kf", "k_wipe", { p: BI(`Close view of ${H} wiping ${DIP} clean with a white rag next to the open hood of ${CAR}.`), d1: "the rag slides down the dipstick", d2: "the dipstick is wiped clean and shiny", sound: "a rag on metal" }),
  S(13, "la vuelves a meter hasta el fondo", "bi", "b_dipin", { q: "checking oil dipstick", p: BI(`Extreme close view of ${H} pushing ${DIP} all the way into its tube in ${BAY}.`) }),
  S(13, "Porque en el trapo blanco también ves el color del aceite", "bi", "b_ragcolor", { q: "oily rag", p: BI("Extreme close view of a white rag with a golden-amber oil smear on it.") }),
  S(14, "", "bi", "b_marks", { q: "engine oil dipstick", p: BI(`Extreme close view of the tip of ${DIP} with two small holes and a cross-hatched zone between them, clean.`) }),
  S(14, "más cerca de la de arriba", "c", "ClDipstick", { props: { mode: "ok" } }),
  S(14, "Y nunca por debajo de la de abajo", "c", "ClDipstick", { props: { mode: "low" } }),
  // ── la varilla de Elena
  S(15, "", "bi", "b_diphalf", { q: "dipstick oil level", p: BI(`Extreme close view of ${DIP} held up against the light, golden oil reaching halfway up the stick, way above the marks.`) }),
  S(15, "Le pasé el dedo y goteaba", "bi", "b_fingerdrip", { p: BI(`Extreme close view of a fingertip of ${H} touching oil on a dipstick, a drop falling.`) }),
  S(15, "el aceite de un bidón entero", "bi", "b_jugempty", { p: BI(`An empty ${JUG} lying in a trash bin at ${LUBE}.`) }),
  S(15, "sin medir cuánto le entra a su motor", "av", ""),
  // ── lo que hay que pedir
  C(16, "", "ClChapter", { n: 3, title: "Lo que tienes que pedir", sub: "siempre" }),
  S(17, "", "bi", "st_partsstore", { q: "auto parts store", p: BI("An ordinary auto parts store counter with shelves behind.") }),
  S(17, "el aceite que dice mi manual", "c", "ClReceipt", { props: { head: "LO QUE PIDES", lines: [["Aceite", "el número del manual"], ["Filtro", "marca · modelo · año · motor"], ["Arandela del tapón", "nueva"]], total: ["Ejemplo", "0W-20"] } }),
  S(17, "y una arandela nueva para el tapón del cárter", "bi", "b_washerhand", { p: BI(`Extreme close view of a small new copper crush washer in the palm of ${H}.`) }),
  S(17, "En el Manual del Mecánico te dejé esa frase exacta", "c", "ClBookPage", { props: { page: I + "page14.jpg", pageNo: 14, stamp: "La frase, en la página" } }),
  S(18, "", "av", ""),
  S(18, "Ya vas a ver por qué es la culpable de la gota de Elena", "bi", "b_plugoily", { p: BI(`Low close view of ${PLUG} with an oily wet ring around it.`) }),
];
