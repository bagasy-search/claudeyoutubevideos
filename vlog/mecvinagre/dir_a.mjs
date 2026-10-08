// DIRECTOR A — mecvinagre (Claudio el Mecánico #4, "El auto de Doña Elena" ep. 4: el lavado del sistema de enfriamiento con vinagre):
// MINUTO 1 (el chorro de vinagre + el antes/después del radiador → la aguja que sube en el tráfico y la gasolinera → el presupuesto del radiador
// con "motor nuevo" en letra chica → loop de lo que alguien le hizo al auto → promesa + antes/después → credibilidad + 3 pruebas → capítulo) +
// la gasolinera (polaroid del ep. 3), la tapa caliente, el depósito marrón con costra, el sarro, los tubitos · la prueba de la junta · lo que hay
// que pedir (mención 1, pág. 12) (párrafos 0-24).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const BAY = "the engine bay of an older ordinary compact sedan with the hood open, a little dusty, a plastic engine cover";
export const RES = "the translucent white plastic coolant overflow reservoir beside the radiator of an older car, with MIN and MAX lines molded on its side";
export const RAD = "the aluminum-and-plastic radiator of an older compact sedan seen from above behind the grille, its black radiator cap on top";
export const GAUGE = "the plain black analog instrument cluster of an ordinary 2012 compact sedan";
export const VIN = "a plain gallon jug of white vinegar with a blank white label";
export const DIST = "a plain gallon jug of distilled water with a blank label";
export const STATION = "a small roadside gas station in a Latin American city with a little convenience shop and a coffee machine";
export const JAR = "a clean clear glass jar";
const I = "img/mecvinagre/";
export const SHOTS = [
  // ── 0:00 · el chorro de vinagre + "antes de firmar"
  S(0, "", "bi", "b_pour0", { p: BI(`Extreme close view of ${H} pouring a stream of clear diluted vinegar from a measuring jug through a funnel into ${RES}, the engine bay of an older car around it.`), ov: { c: "ClStampOv", props: { text: "US$ 1" } } }),
  S(0, "ese presupuesto", "av", ""),
  S(0, "Un frasco de vinagre de la cocina", "bi", "b_vinkitchen", { p: BI(`${VIN} on a kitchen counter in a modest Latin American house, next to a measuring cup.`) }),
  S(0, "de un dólar", "bi", "st_vinegar", { q: "white vinegar bottle", p: BI("A plain bottle of white vinegar on a shelf.") }),
  S(0, "Y lo que salió de adentro de un radiador", "kf", "k_brownflow", { p: BI(`Low view under the front of an old car parked on ramps: rusty brown coolant starting to pour from the plastic drain plug at the bottom corner of the radiator into a clean clear glass jar held below, a cement floor.`), d1: "brown liquid starts to run from the drain", d2: "the brown liquid fills the bottom of the jar with white flakes swirling", sound: "liquid pouring into glass" }),
  S(0, "que la agencia quería cambiar", "bi", "b_quoterad0", { p: BI("Close view of a printed dealership quote with a small drawing of a car radiator on it, lying on the passenger seat of a car, no legible numbers."), rev: 1 }),
  // ── la aguja en el tráfico
  S(1, "", "bi", "b_traffic0", { p: BI(`${CAR} stuck in heavy afternoon traffic on a wide avenue, seen from the car behind, heat shimmering off the asphalt.`) }),
  S(1, "y la aguja de la temperatura empezó a subir", "c", "ClTempGauge", { props: { mode: "traffic" } }),
  S(1, "No hasta el rojo", "bi", "b_elenawheel", { p: BI(`${ELENA} at the wheel of ${CAR} in traffic, glancing worriedly down at the dashboard.`) }),
  S(1, "Se asustó tanto que paró el auto en una gasolinera", "bi", "b_station0", { p: BI(`${CAR} parked at the edge of ${STATION} with its hood closed, afternoon.`) }),
  S(1, "y me llamó con la voz temblando", "bi", "b_elenaphone", { p: BI(`${ELENA} standing next to ${CAR} at a gas station holding an old smartphone to her ear with a worried face.`) }),
  // ── el papel de la agencia
  S(2, "", "bi", "b_quoteread", { p: BI(`Close view of an old woman's thin hands with a gold wedding ring holding a printed sheet with a small drawing of a car radiator and rows of tiny gray lines too small to read, reading glasses resting on it.`) }),
  S(2, "Y abajo, con letra chiquita", "bi", "b_fineprint", { p: BI(`Extreme close view of the bottom of a printed sheet with rows of tiny gray lines of print too small to read, an old woman's fingertip under one of them.`) }),
  S(2, "hay que pensar en un motor nuevo", "bi", "st_engineout", { q: "car engine replacement", p: BI("A car engine hanging from an engine hoist in a repair shop.") }),
  S(2, "Ese papel lo tenía guardado en la carpeta del auto", "bi", "b_folder", { p: BI(`Close view of an old woman's thin hands sliding a printed sheet into a worn blue plastic folder full of papers on a kitchen table, the sheets showing only tiny gray lines too small to read.`) }),
  // ── el loop
  S(3, "", "bi", "b_radcap0", { p: BI(`Extreme close view of the black radiator cap on top of ${RAD}, dusty, a little white crust around its edge.`) }),
  S(3, "con la mejor intención del mundo", "bi", "b_hose0", { p: BI("A green garden hose lying coiled on the cement floor of a Latin American carport next to a parked silver car, morning.") }),
  S(3, "Y casi seguro que en tu casa también lo hicieron", "bi", "st_hosewater", { q: "garden hose water", p: BI("Water running from a garden hose nozzle.") }),
  S(3, "Te lo muestro en un rato", "av", ""),
  // ── la promesa
  S(4, "", "bi", "b_hoodup", { p: BI(`Close view of ${H} lifting the hood of ${CAR} in ${DRIVE} and setting the prop rod, morning light.`) }),
  S(4, "el lavado del sistema de enfriamiento con vinagre", "c", "ClRadiator3D", { props: { mode: "flush" } }),
  S(4, "cuánto, cuánto tiempo", "c", "ClMixJug", { props: { mode: "mix" } }),
  S(4, "y la prueba que va antes", "bi", "b_resopen0", { p: BI(`Close view of ${H} unscrewing the cap of ${RES}, the engine cold, morning light.`) }),
  S(4, "porque hay un caso en que ningún lavado te salva", "bi", "st_whitesmoke", { q: "car exhaust white smoke", p: BI("Thick white smoke coming out of the exhaust pipe of an old car.") }),
  S(4, "Así salía el agua del radiador de Elena", "bi", "b_jarbefore", { p: BI(`Close view of a clean clear glass jar full of rusty brown coolant with white flakes floating, held up against the bright daylight of an open garage door, only a mechanic's hand and navy sleeve in the frame.`), ov: { c: "ClChip", props: { text: "Así salía", alert: true } } }),
  S(4, "Y así salió al final", "bi", "b_jarafter", { p: BI(`${JAR} full of clear green coolant held up against the daylight of a garage door.`), ov: { c: "ClChip", props: { text: "Al final" } } }),
  // ── credibilidad
  S(5, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "35 años de mecánico" } } }),
  S(5, "Y al final te doy", "bi", "b_cardnight", { p: BI(`Night, a flattened cardboard sheet under the front of ${CAR} on a cement floor, lit by a flashlight.`) }),
  S(5, "de diez minutos", "bi", "b_lightswall", { p: BI(`Evening, the front of ${CAR} with a plain grille without any emblem, facing a white wall with its headlights on.`), ov: { c: "ClChip", props: { text: "$0 · 10 minutos" } } }),
  S(5, "a cualquier taller", "bi", "st_shopstreet", { q: "car repair shop", p: BI("An ordinary small car repair shop seen from the street.") }),
  C(6, "", "ClChapter", { n: 1, title: "La llamada de Doña Elena", sub: "la aguja que subía" }),
  // ── polaroid del ep. 3
  C(7, "", "ClVideoRef", { thumb: I + "th_mecmillon.jpg", title: "Hábitos para que tu auto dure 1 millón de km", tag: "VIDEO ANTERIOR" }),
  S(7, "el sedán plateado del 2012", "bi", "b_carside", { p: BI(`The whole side of ${CAR} parked in ${DRIVE} in daylight.`) }),
  S(7, "con doscientos ochenta mil kilómetros", "bi", "b_odo", { q: "car odometer", p: BI(`Extreme close view of the odometer of ${CABIN} with a high six-digit mileage.`), ov: { c: "ClChip", props: { text: "280.000 km" } } }),
  S(7, "le cambiamos una válvula de siete dólares", "bi", "b_pcvhand", { p: BI(`Close view of ${H} holding a small black plastic PCV valve next to an open engine.`) }),
  S(7, "Te dejo ese video aquí", "av", ""),
  // ── la gasolinera
  S(8, "", "bi", "b_arrive", { p: BI(`${ELENA} standing beside ${CAR} at ${STATION}, phone in her hand, looking toward the camera as someone walks up.`) }),
  S(8, "Lo primero que le dije", "av", ""),
  S(8, "no toques la tapa del radiador", "c", "ClHotCap", {}),
  S(9, "", "bi", "b_steamhood", { q: "steam car engine", p: BI(`Close view of the front of ${CAR} with the hood just opened, a little steam rising from the engine bay, a gas station behind.`) }),
  S(9, "Si abres la tapa, sale disparado", "bi", "st_steam", { q: "car engine steam overheating", p: BI("Steam rising from an overheated car engine.") }),
  S(9, "Cada verano llega gente al hospital por eso", "av", ""),
  S(9, "la tapa no se toca", "bi", "b_handstop", { p: BI(`Extreme close view of ${H} hovering above a hot radiator cap without touching it, steam in the air.`) }),
  S(10, "", "bi", "b_coffee", { p: BI(`${ELENA} holding a paper cup of coffee from a machine inside the little shop of ${STATION}, looking out the window at her car.`) }),
  S(10, "el radiador no tenía arreglo", "bi", "b_quotelap", { p: BI(`Close view of a printed dealership quote with a radiator drawing on ${ELENA}'s lap, her hands folded on it, no legible numbers.`) }),
  S(10, "más de lo que ella cobra en un mes", "av", ""),
  // ── el depósito marrón
  S(11, "", "bi", "b_resopen", { p: BI(`Close view of ${H} unscrewing the cap of ${RES} on ${CAR} at a gas station, the engine cold.`) }),
  S(11, "El líquido no era verde, ni rosa, ni naranja", "bi", "st_coolantcolors", { q: "coolant antifreeze", p: BI("Bottles of green, pink and orange antifreeze coolant on a shelf.") }),
  S(11, "Era marrón, como café aguado", "c", "ClBubbleTest", { props: { mode: "crust" } }),
  S(11, "como la de una tetera vieja", "bi", "b_kettle", { q: "limescale kettle", p: BI("Extreme close view of the inside of an old metal kettle with a thick white limescale crust, in a kitchen.") }),
  S(12, "", "bi", "b_crustin", { p: BI(`Extreme close view inside ${RES} with its cap off, a hard white mineral crust on the plastic walls and brown liquid below.`) }),
  S(12, "Es la misma de la regadera de la ducha", "bi", "st_showerhead", { q: "limescale shower head", p: BI("Extreme close view of a shower head with white limescale.") }),
  S(12, "Viene del agua de la llave", "bi", "st_tapwater", { q: "tap water faucet", p: BI("Water running from a kitchen tap.") }),
  S(12, "se pegan a las paredes y forman una capa", "c", "ClRadiator3D", { props: { mode: "scale" } }),
  S(13, "", "bi", "b_radcore", { q: "car radiator fins", p: BI(`Extreme close view of the thin metal fins and flat tubes of an old car radiator core, a little dusty, ${H} holding a pencil next to them for size.`) }),
  S(13, "el motor no se enfría, y la aguja sube", "c", "ClTempGauge", { props: { mode: "traffic" } }),
  S(13, "cuando no entra aire de frente", "bi", "st_trafficjam", { q: "traffic jam cars", q2: "traffic jam aerial", p: BI("Cars stopped bumper to bumper in city traffic.") }),
  // ── la prueba
  C(14, "", "ClChapter", { n: 2, title: "La prueba que nadie hace", sub: "antes de lavar nada" }),
  S(15, "", "av", ""),
  S(15, "puede tener el radiador tapado, que es barato", "bi", "b_radold", { p: BI(`Close view of ${RAD} on ${CAR}, the fins dusty and a little bent.`) }),
  S(15, "O la junta de la tapa de cilindros quemada", "bi", "st_headgasket", { q: "engine cylinder head gasket", p: BI("An engine cylinder head gasket on a workbench.") }),
  S(15, "el vinagre no sirve de nada", "av", ""),
  S(16, "", "bi", "b_resmorning", { p: BI(`Morning, ${H} taking the cap off ${RES} on ${CAR} parked in ${DRIVE}, the engine cold.`) }),
  S(16, "Unas pocas burbujas al principio", "c", "ClBubbleTest", { props: { mode: "normal" } }),
  S(16, "como un vaso de soda", "c", "ClBubbleTest", { props: { mode: "gasket" } }),
  S(17, "", "bi", "b_vapor", { q: "car exhaust cold morning", p: BI(`Cold early morning, a little thin vapor coming from the exhaust pipe of ${CAR} idling in ${DRIVE}.`) }),
  S(17, "Pero humo blanco espeso", "bi", "st_whitesmoke2", { q: "white exhaust smoke", p: BI("Thick white exhaust smoke behind an old car.") }),
  S(17, "es refrigerante quemándose adentro del motor", "av", ""),
  S(18, "", "bi", "b_dipcheck", { p: BI(`Close view of ${H} pulling the engine oil dipstick of ${CAR} and wiping it on a white rag.`) }),
  S(18, "Si el aceite sale color café con leche", "bi", "b_milkyoil", { p: BI("Extreme close view of an engine oil dipstick tip covered in light-brown milky oil like a milkshake, on a white rag.") }),
  S(19, "", "c", "ClCheck", { props: { title: "No laves: al taller", items: ["Burbujas que no paran", "Humo blanco con olor dulce", "Aceite café con leche", "Bomba que gotea · ventilador que no prende"], fast: true } }),
  S(19, "Lo mismo si la bomba de agua gotea", "bi", "b_pumpdrip", { q: "car water pump", p: BI(`Close view of a water pump on the side of an older engine with a dried green coolant trail below it, ${H} pointing with a flashlight.`) }),
  S(19, "o si el ventilador del radiador no prende nunca", "bi", "st_radfan", { q: "car radiator fan", q2: "radiator fan spinning", p: BI("A car radiator cooling fan spinning.") }),
  S(20, "", "bi", "b_bubblesok", { p: BI(`Close view of ${RES} on ${CAR} with the cap off, a few small bubbles on the surface of brown liquid.`) }),
  S(20, "Ni humo blanco, ni olor dulce", "bi", "b_exhaustok", { p: BI(`Close view of the exhaust pipe of ${CAR} idling in ${DRIVE}, no smoke at all.`) }),
  S(20, "El aceite, ámbar y limpio", "bi", "b_dipamber", { p: BI(`Extreme close view of a dipstick tip with clean amber oil between the two marks, held over a white rag by ${H}.`) }),
  S(20, "El ventilador prendía", "kf", "k_fanon", { p: BI(`Close view of the radiator cooling fan of ${CAR} behind the grille, still.`), d1: "the fan blades are still", d2: "the fan starts spinning", sound: "an electric fan whirring up" }),
  S(20, "Y el sarro sí tiene arreglo", "av", ""),
  // ── lo que hay que pedir
  C(21, "", "ClChapter", { n: 3, title: "Lo que tienes que pedir", sub: "en la refaccionaria" }),
  S(22, "", "bi", "st_partsstore", { q: "auto parts store", p: BI("An ordinary auto parts store counter with shelves of bottles behind.") }),
  S(22, "un galón de vinagre blanco, dos galones de agua destilada", "c", "ClReceipt", { props: { head: "LO QUE PIDES", lines: [["Vinagre blanco", "1 galón"], ["Agua destilada", "2 galones"], ["Refrigerante", "el de tu auto"]], total: ["Del mismo color", "que el que tiene"] } }),
  S(22, "En el Manual del Mecánico te dejé esa frase exacta", "c", "ClBookPage", { props: { page: I + "page12.jpg", pageNo: 12, stamp: "La frase, en la página" } }),
  S(22, "Agua destilada, no de la llave", "bi", "b_distill", { p: BI(`${DIST} next to ${VIN} on the counter of a small auto parts store, ${EH} resting on one.`) }),
  S(22, "vuelves a meter los mismos minerales", "av", ""),
  S(23, "", "bi", "b_coolantshelf", { q: "antifreeze bottles", p: BI("A store shelf of plain antifreeze coolant jugs in green, pink and orange with blank labels.") }),
  S(23, "Lo dice el manual", "bi", "b_manualcool", { p: BI(`Close view of ${EH} pointing at the specifications page of a car owner's manual open on the seat of ${CABIN}.`) }),
  S(23, "Los colores no se mezclan", "bi", "b_sludge", { q: "dirty radiator", p: BI("Extreme close view of thick gelled brownish-green coolant sludge on the inside of a radiator filler neck.") }),
  S(23, "una pasta que tapa todo otra vez", "av", ""),
  S(24, "", "bi", "b_supplies", { p: BI(`On a workbench in ${SHOP}: a large empty drain pan, a pair of nitrile gloves and a plastic funnel, next to ${VIN} and ${DIST}.`) }),
  S(24, "Todo junto salió menos que una cena para dos", "av", ""),
];
