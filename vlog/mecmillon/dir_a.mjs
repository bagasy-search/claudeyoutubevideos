// DIRECTOR A — mecmillon (Claudio el Mecánico #3, "El auto de Doña Elena" ep. 3: la PCV de 5 dólares y los hábitos del motor de 1 millón):
// MINUTO 1 (la pieza de 5 dólares → la mancha tapada con un cartón y la palabra "motor" → loop de lo que dejó Don Ernesto en la guantera →
// promesa + antes/después → credibilidad + 3 pruebas → capítulo) + la mancha (polaroid del ep. 2), la revisión rápida, el miedo, la regla
// (párrafos 0-10).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const PCV = "a small black plastic PCV valve the size of a finger with a short rubber hose elbow";
export const BAY = "the engine bay of an older ordinary compact sedan with the hood open, a little dusty, a plastic engine cover";
export const STAIN = "a small dark oil stain the size of a large coin on a gray cement carport floor";
const I = "img/mecmillon/";
export const SHOTS = [
  // ── 0:00 · la pieza de 5 dólares
  S(0, "", "bi", "b_pcvhand0", { p: BI(`Extreme close view of ${H} holding ${PCV} between two fingers above ${BAY}.`), ov: { c: "ClStampOv", props: { text: "US$ 5" } } }),
  S(0, "es la diferencia entre un motor", "av", ""),
  S(0, "que llega a doscientos mil kilómetros", "c", "ClPCV3D", { props: { mode: "intro" } }),
  S(0, "Y casi ningún taller la revisa", "bi", "st_mechanicbay", { q: "mechanic checking engine", p: BI(`A mechanic leaning over the open engine bay of a car in a busy workshop, not looking at the top of the engine.`) }),
  // ── la mancha
  S(1, "", "bi", "b_stain0", { p: BI(`Close view of ${STAIN}, the front tire of ${CAR} at the edge of the frame.`), rev: 1 }),
  S(1, "justo debajo del motor", "bi", "b_under", { p: BI(`Low view under the front of ${CAR} parked in ${DRIVE}, one dark oil drop hanging from the bottom of the engine.`) }),
  S(1, "La tapaba con un cartón", "bi", "b_cardcover0", { p: BI(`${EH} laying a flattened piece of cardboard over a small oil stain on the cement floor of ${DRIVE}.`) }),
  S(1, "Y en la agencia ya le habían dicho", "bi", "b_dealermotor", { p: BI(`${ELENA} at a dealership service desk, a technician in a polo pointing at an engine diagram on a screen with a serious face.`) }),
  S(1, "a todo el mundo: motor", "bi", "b_quoteengine", { p: BI("Close view of a printed dealership quote lying on a car seat, one long line circled in red pen, no legible numbers.") }),
  // ── el loop de la guantera
  S(2, "", "bi", "b_glovebox0", { p: BI(`Close view of ${EH} rummaging inside the open glovebox of ${CABIN} full of papers, an owner's manual and receipts.`) }),
  S(2, "algo que Don Ernesto había dejado ahí", "bi", "b_bluecorner", { p: BI(`Extreme close view of the worn corner of a small blue notebook peeking out from under papers in an open car glovebox.`) }),
  S(2, "doscientos ochenta mil kilómetros", "bi", "b_odo", { p: BI(`Extreme close view of the odometer of ${CABIN} with a high six-digit mileage.`), ov: { c: "ClChip", props: { text: "280.000 km" } } }),
  S(2, "y anda como nuevo", "kf", "k_idle", { p: BI(`${BAY}, the engine running smoothly, ${H} resting on the fender.`), d1: "the engine idles", d2: "the engine keeps idling smoothly, a light vibration", sound: "a smooth engine idle" }),
  S(2, "Te lo muestro en un rato", "av", ""),
  // ── la promesa
  S(3, "", "av", ""),
  S(3, "los hábitos que hacen que un motor no se muera nunca", "bi", "st_engineclean", { q: "clean car engine", p: BI(`A clean, well kept engine bay of an older car in daylight.`) }),
  S(3, "Cuánto cuestan", "bi", "b_partscounter", { p: BI(`On a parts store counter: a bottle of synthetic motor oil, an oil filter, an air filter and ${PCV}, ${H} placing the last one.`) }),
  S(3, "cada cuánto", "bi", "st_odometer", { q: "car odometer mileage", p: BI("Extreme close view of a car odometer counting up.") }),
  S(3, "y cuáles casi nadie hace", "bi", "st_oilcheck", { q: "checking engine oil dipstick", p: BI(`Close view of ${H} pulling an engine oil dipstick.`) }),
  S(3, "Empezando por esa valvulita", "cl", "c_pcvshow", { p: CLP(`In his workshop he holds up ${PCV} next to the open hood of ${CAR}, looking at the camera.`) }),
  S(3, "Así estaba el piso", "bi", "b_before", { p: BI(`Close view of a flattened cardboard sheet on the floor of ${DRIVE} with a fresh dark oil spot on it.`), ov: { c: "ClChip", props: { text: "Así estaba", alert: true } } }),
  S(3, "Y así quedó", "bi", "b_after", { p: BI(`Close view of a clean flattened cardboard sheet under the front of ${CAR} on the floor of ${DRIVE}, not a single drop.`), ov: { c: "ClChip", props: { text: "1 semana después" } } }),
  // ── credibilidad
  S(4, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "35 años de mecánico" } } }),
  S(4, "Treinta y cinco años de mecánico", "bi", "st_mechanic3", { q: "auto mechanic garage", p: BI(`Close view of ${H} wiping a part with a red shop rag in a small workshop.`) }),
  S(4, "Y al final te doy", "av", ""),
  S(4, "las tres pruebas", "bi", "b_cardboardn", { p: BI(`Night, a flattened cardboard sheet under the front of ${CAR} on a cement floor, lit by a flashlight.`) }),
  S(4, "de diez minutos", "bi", "b_headlights0", { p: BI(`Night, ${CAR} facing a white wall with its headlights on.`), ov: { c: "ClChip", props: { text: "$0 · 10 minutos" } } }),
  S(4, "a cualquier taller", "bi", "st_shop", { q: "car repair shop", p: BI("An ordinary small car repair shop seen from the street.") }),
  C(5, "", "ClChapter", { n: 1, title: "La mancha de Doña Elena", sub: "una gota por noche" }),
  // ── la mancha / ep. 2
  C(6, "", "ClVideoRef", { thumb: I + "th_mecllave.jpg", title: "Lo que la agencia te cobra de la llave", tag: "VIDEO ANTERIOR" }),
  S(6, "el sedán plateado del 2012", "bi", "b_carside", { p: BI(`The whole side of ${CAR} parked in ${DRIVE} in daylight.`) }),
  S(6, "le cambiamos la pila de la llave", "bi", "b_fobcoin", { p: BI(`Close view of ${EH} twisting a small coin in the slot of an ordinary black car key fob.`) }),
  S(6, "Te dejo ese video aquí", "av", ""),
  S(7, "", "bi", "b_liftcard", { p: BI(`${ELENA} bending down in ${DRIVE} lifting a flattened cardboard sheet from the cement floor, revealing an oil stain.`) }),
  S(7, "Una gota por noche", "kf", "k_drip", { p: BI(`Low close view under the front of ${CAR}, a dark oil drop forming at the bottom edge of the engine.`), d1: "the oil drop slowly grows", d2: "the drop falls onto the cement floor", sound: "a tiny drip" }),
  S(7, "en la agencia me dijeron que el motor está gastado", "bi", "b_elenaworried", { p: BI(`${ELENA} standing in ${DRIVE} with her arms crossed looking at the oil stain, worried.`) }),
  S(7, "y que eso es caro", "av", ""),
  S(8, "", "bi", "b_dipstick", { p: BI(`Close view of ${H} holding an engine oil dipstick over a paper towel, the oil a little dark but between the two marks, the open hood of ${CAR} behind.`) }),
  S(8, "Arrancamos el motor", "bi", "st_carignition", { q: "car ignition key", p: BI("Close view of a hand turning a car key in the ignition.") }),
  S(8, "sin humo azul por el escape", "bi", "b_exhaust", { p: BI(`Close view of the exhaust pipe of ${CAR} idling in ${DRIVE}, no smoke at all.`) }),
  S(8, "Un motor gastado de verdad echa humo azul", "bi", "st_bluesmoke", { q: "car exhaust smoke", p: BI("The exhaust pipe of an old car blowing bluish smoke.") }),
  S(8, "Éste no", "av", ""),
  S(9, "", "bi", "b_elenaafraid", { p: BI(`${ELENA} in ${SHOP} holding a thick folder of quotes against her chest, listening with a worried face.`) }),
  S(9, "un presupuesto de miles de dólares", "bi", "b_bigquote", { p: BI("Close view of a long printed dealership repair quote with many lines, a pen and a pair of reading glasses lying on it.") }),
  S(9, "O un auto nuevo", "bi", "st_newcars", { q: "new cars dealership lot", p: BI("A row of brand-new cars parked at a dealership lot.") }),
  S(10, "", "av", ""),
  S(10, "el aceite está saliendo por algún lado", "c", "ClEnginePressure", { props: { mode: "leak" } }),
  S(10, "Y la presión de más tiene un culpable muy barato", "bi", "b_pcvbay", { p: BI(`Extreme close view of ${PCV} plugged into the top of the engine in ${BAY}, ${H} pointing at it.`) }),
];
