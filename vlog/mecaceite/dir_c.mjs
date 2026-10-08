// DIRECTOR C — mecaceite: errores 8-9 (30 segundos sin acelerar · revisar fugas a los 10 minutos y los primeros 50 km) · la luz de los
// segundos (la roja de la aceitera: apagar ya, no volver a arrancar, la grúa; la amarilla no es lo mismo) · 2 cosas más (resetear el aviso
// + la etiqueta; guardar la factura) · el repaso de 5 minutos · los errores de la gente · preguntas · una semana después + la libreta
// (párrafos 37-61).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { BAY, GAUGE, DIP, LUBE, JUG, PLUG, FILTER } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const SHOTS = [
  // ── 8 acelerar en frío
  S(37, "", "bi", "b_err8", { q: "pressing gas pedal", p: BI(`Close view of a foot pressing hard on the accelerator pedal of ${CABIN}.`), ov: { c: "ClChip", props: { text: "8 · Acelerar en seguida", alert: true } } }),
  S(37, "el filtro nuevo está vacío", "bi", "b_filtercut", { q: "oil filter cut", p: BI(`A new ${FILTER} cut in half on a workbench, showing its clean empty pleated paper inside.`) }),
  S(37, "dejas andar treinta segundos en marcha lenta", "bi", "b_idle30", { p: BI(`Extreme close view of the tachometer of ${GAUGE} at idle, the engine just started.`), ov: { c: "ClChip", props: { text: "30 segundos" } } }),
  S(37, "Que el aceite llegue arriba", "av", ""),
  // ── 9 fugas
  S(38, "", "bi", "b_err9", { p: BI(`${H} holding a flashlight, looking under the front of ${CAR} in ${DRIVE}.`), ov: { c: "ClChip", props: { text: "9 · No revisar fugas", alert: true } } }),
  S(38, "ni una gota en el tapón ni en el filtro", "bi", "b_underdry", { p: BI(`Low view under an old car with a flashlight beam on a clean dry gray metal oil pan and a blue oil filter, no drops.`) }),
  S(38, "Y los primeros cincuenta kilómetros", "bi", "st_driving", { q: "car driving road", p: BI("A car driving on an ordinary road.") }),
  S(38, "Una gota hoy es un charco en un mes", "bi", "b_puddle", { q: "oil stain driveway", p: BI(`A dark oil puddle on the cement floor of ${DRIVE} under where a car was parked.`), rev: 1 }),
  // ── la luz
  C(39, "", "ClChapter", { n: 5, title: "La luz de los segundos", sub: "qué hacer cuando aparece", alert: true }),
  S(40, "", "c", "ClOilLight", { props: { mode: "red" } }),
  S(40, "Si se prende con el motor andando", "bi", "b_redlightdrive", { q: "dashboard warning lights", p: BI(`Extreme close view of a red oil-can warning light glowing on ${GAUGE} while driving.`) }),
  S(40, "No a la próxima esquina", "av", ""),
  S(40, "En un lugar seguro, y apagas", "kf", "k_pullover", { p: BI(`A silver compact sedan with a plain grille without any emblem pulled over by the curb of a quiet residential street, its orange hazard lights on, seen from the sidewalk.`), d1: "the car slows down by the curb", d2: "the car stops and the hazard lights blink", sound: "tires rolling to a stop" }),
  S(41, "", "av", ""),
  S(41, "Que el motor está girando sin lubricación", "bi", "st_enginerun", { q: "car engine running", p: BI("A car engine running under the hood.") }),
  S(41, "en menos de un minuto", "bi", "b_damage", { p: BI("Extreme close view of a scored, damaged engine bearing shell on a workbench.") }),
  S(42, "", "bi", "b_keyout", { p: BI(`Close view of ${EH} pulling the key out of the ignition of ${CABIN}.`) }),
  S(42, "Mides la varilla, miras debajo si hay un charco", "bi", "b_puddlecheck", { p: BI(`${ELENA} bending to look under ${CAR} parked by a curb, a flashlight in her hand.`) }),
  S(42, "llama al taller y que lo lleven en grúa", "bi", "st_towtruck", { q: "tow truck car", p: BI("A tow truck carrying a car.") }),
  S(42, "La grúa cuesta mucho menos que un motor", "av", ""),
  S(43, "", "c", "ClOilLight", { props: { mode: "amber" } }),
  S(43, "Ésa sólo te recuerda que toca el próximo cambio", "av", ""),
  // ── dos cosas más
  C(44, "", "ClChapter", { n: 6, title: "Dos cosas antes de irte", sub: "del taller" }),
  S(45, "", "bi", "b_resetbtn", { p: BI(`Extreme close view of ${H} pressing the trip reset button on ${GAUGE}.`) }),
  S(45, "En el auto de Elena, la llavecita seguía prendida", "bi", "b_wrenchlight", { q: "car service light", p: BI(`Extreme close view of an amber wrench service light glowing on ${GAUGE}.`) }),
  S(45, "Nadie la había reseteado", "av", ""),
  S(46, "", "kf", "k_sticker", { p: BI(`Close view of ${H} sticking a small blank white reminder sticker on the inside upper corner of the windshield of ${CABIN}.`), d1: "the hand presses the sticker onto the glass", d2: "the thumb smooths the sticker flat", sound: "a sticker being pressed" }),
  S(46, "Si no te la dan, la haces tú con un papelito", "bi", "b_papernote", { p: BI(`Close view of ${EH} taping a small handwritten paper note to the corner of a car windshield, nothing legible.`) }),
  S(46, "Y lo anotas en la libreta", "bi", "b_nbwrite", { p: BI(`Close view of ${EH} writing in a small worn blue notebook on the steering wheel, nothing legible.`) }),
  S(47, "", "bi", "b_invoice", { p: BI(`Close view of a folded plain white receipt slip lying on a gray car seat next to a car key, the printing tiny and faded, nothing readable.`), }),
  S(47, "o si vendes el auto, te la van a pedir", "bi", "st_carsale", { q: "car buyer seller", p: BI("Two people shaking hands next to a used car.") }),
  // ── el repaso
  C(48, "", "ClChapter", { n: 7, title: "El repaso de 5 minutos", sub: "antes de irte" }),
  S(49, "", "c", "ClCheck", { props: { title: "El repaso de 5 minutos", items: ["1. El bidón: número y norma", "2. Filtro viejo con su goma", "3. Varilla, en plano, a los 5 min", "4. Debajo: tapón y filtro", "5. Sin luz roja + aviso reseteado", "6. Etiqueta de próximos km"], fast: true } }),
  S(49, "Dos: pide ver el filtro viejo", "bi", "b_showfilter", { p: BI(`A quick-lube technician in a polo showing an old oil filter to ${ELENA} at the bay, the gasket visible.`) }),
  S(49, "Tres: espera cinco minutos y saca la varilla", "bi", "b_dipcheck2", { p: BI(`Close view of ${EH} pulling ${DIP} at a quick-lube shop.`) }),
  S(50, "", "bi", "b_lookunder", { p: BI(`${ELENA} crouching beside ${CAR} at a quick-lube shop, looking under it with a flashlight.`) }),
  S(50, "Cinco: arranca, que no quede ninguna luz roja", "bi", "st_dashstart", { q: "car dashboard start", p: BI("A car dashboard as the engine starts.") }),
  S(50, "Y seis: la etiqueta con los próximos kilómetros", "bi", "b_stickerdone", { q: "windshield sticker", p: BI(`Close view of a small blank reminder sticker in the upper corner of a car windshield.`) }),
  S(50, "lo dices ahí, antes de pagar", "av", ""),
  // ── errores de la gente
  C(51, "", "ClChapter", { n: 8, title: "Los errores de la gente", sub: "no del taller" }),
  S(52, "", "av", ""),
  S(52, "Completar el aceite con cualquier bidón que tengas en la cochera", "bi", "b_mixjugs", { q: "oil bottles shelf", p: BI(`Several half-used plain motor oil jugs of different colors on a dusty shelf in ${DRIVE}.`) }),
  S(52, "Por eso conviene guardar un litro del mismo que te pusieron", "bi", "b_spareliter", { p: BI(`Close view of ${EH} putting a 1-liter plain oil bottle into the trunk of ${CAR}.`) }),
  S(53, "", "bi", "b_parked", { p: BI(`${CAR} parked in ${DRIVE} with a thin layer of dust, leaves on the windshield.`) }),
  S(53, "por kilómetros o por tiempo, lo que llegue primero", "bi", "b_calendarkm", { q: "kitchen calendar", p: BI(`A paper wall calendar in a kitchen next to the car keys hanging on a hook, nothing legible.`) }),
  S(53, "hace uso severo", "av", ""),
  // ── preguntas
  C(54, "", "ClChapter", { n: 9, title: "Preguntas rápidas", sub: "las que me hacen siempre" }),
  S(55, "", "bi", "st_syntheticoil", { q: "motor oil bottles shelf", p: BI("Motor oil bottles on a store shelf.") }),
  S(55, "Lo que importa es el número y la norma que pide el manual", "av", ""),
  S(56, "", "bi", "b_darkoil", { p: BI(`Extreme close view of ${DIP} with dark brown oil a few days after a change, over a white rag.`) }),
  S(56, "Lo que no es normal es la espuma o el color café con leche", "bi", "b_milky", { q: "oil on rag", p: BI("Extreme close view of a dipstick tip with light-brown milky oil on a white rag.") }),
  S(57, "", "bi", "b_severecol", { p: BI(`Close view of ${EH} pointing at a maintenance table column in a car owner's manual, nothing legible.`) }),
  S(57, "Y no por lo que diga el papelito del lubricentro", "bi", "b_lubesticker", { p: BI("Extreme close view of a small quick-lube reminder sticker on a windshield corner, no legible numbers.") }),
  S(57, "ellos ganan cuando vuelves antes", "av", ""),
  S(58, "", "bi", "b_diyramps", { p: BI(`${H} sliding under the front of ${CAR} up on ramps with wheel chocks, a drain pan ready, in ${DRIVE}.`) }),
  S(58, "y el aceite viejo llevado a reciclar", "bi", "b_recycle", { q: "used oil disposal", p: BI(`Close view of ${H} pouring used black oil from a drain pan into an empty plastic jug through a funnel.`) }),
  S(58, "Ése es el truco", "av", ""),
  S(59, "", "av", ""),
  S(59, "un error de cinco minutos le podía costar el motor", "bi", "st_engineshop", { q: "engine repair shop", p: BI("An engine being taken apart in a repair shop.") }),
  // ── una semana después
  S(60, "", "bi", "b_floorclean", { p: BI(`The clean cement floor of ${DRIVE} under the front of ${CAR}, not a single drop, morning light.`) }),
  S(60, "La varilla, justo debajo de la marca de arriba", "c", "ClDipstick", { props: { mode: "ok" } }),
  S(60, "Y la llavecita del tablero, apagada", "bi", "b_dashclear", { q: "car dashboard gauges", p: BI(`Close view of ${GAUGE} with the engine running and no warning lights on.`) }),
  S(61, "", "bi", "b_strike", { p: BI(`Extreme close view of ${EH} crossing out a line in a small worn blue notebook with a pen, nothing legible.`) }),
  S(61, "La fecha, los kilómetros, cero W veinte, la norma", "c", "ClLogbook", { props: { mode: "two", elena: ["10/2026 · 281.300", "limpieza, silicona gomas", "aceite (lubricentro) ✗", "10/2026 · 281.700", "0W-20 · API SP · filtro", "arandela nueva"] } }),
  S(61, "Como lo hacía Don Ernesto", "bi", "b_twohands", { p: BI(`Extreme close view of an open small blue notebook with short lines of tiny messy handwriting in two inks, blue and black, the writing too small and faint to read.`), rev: 1 }),
  S(61, "Y abajo, un papelito pegado con la lista del repaso", "bi", "b_notetaped", { p: BI("Close view of a small paper note taped inside the cover of a small blue notebook, nothing legible.") }),
];
