// DIRECTOR A — mecllave (Claudio el Mecánico #2, "El auto de Doña Elena" ep. 2: la pila de la llave y las 7 funciones del control):
// MINUTO 1 (la llave que la agencia cobra como nueva, US$45 por algo de 2 → el control que sólo anda de cerca → loop del botón que
// asustaba al estacionamiento → promesa (7 funciones + pila en 2 min) + antes/después → credibilidad + 3 pruebas → capítulo) +
// Elena vuelve al taller (polaroid del ep. 1), el síntoma, la hoja de la agencia, "es la pila" (párrafos 0-12).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const FOB = "an ordinary black plastic car remote key fob with three rubber buttons (lock, unlock and a red panic button), slightly worn, no brand logo";
export const CELL = "a small shiny silver CR2032 coin battery";
export const GAUGE = "the plain analog instrument cluster of an ordinary 2012 compact sedan";
const I = "img/mecllave/";
export const SHOTS = [
  // ── 0:00 · la llave que te cobran como nueva
  S(0, "", "bi", "b_fobmacro", { q: "car key remote", q2: "car keys table", p: BI(`Extreme close view of ${FOB} lying on a greasy workbench in a small auto workshop, ${H} about to pick it up.`), ov: { c: "ClStampOv", props: { text: "7 COSAS QUE NO TE DIJERON" } } }),
  S(0, "hace siete cosas", "av", ""),
  S(0, "Y cuando falla", "c", "ClKeyFob3D", { props: { mode: "tease" } }),
  S(0, "te la cobran como si fuera nueva", "bi", "b_dealerquote", { q: "invoice paper pen", p: BI("Close view of a printed car dealership service quote on a counter: one line circled in pen, a pen lying on it, a key fob next to it.") }),
  S(0, "A Doña Elena le iban a cobrar", "bi", "b_elenaquote", { p: BI(`${ELENA} at a car dealership service counter frowning at a printed quote, a young clerk in a polo behind the counter.`) }),
  S(0, "por algo que cuesta dos", "bi", "b_cellpalm", { q: "button battery hand", p: BI(`Extreme close view of ${CELL} lying in the palm of ${H}, the workshop floor behind.`), ov: { c: "ClChip", props: { text: "US$ 2" } } }),
  // ── el control que sólo anda de cerca
  S(1, "", "bi", "b_lastweek", { p: BI(`${ELENA} standing at the open door of ${SHOP} pointing a key fob at ${CAR} parked a few meters away, frowning.`) }),
  S(1, "Sólo andaba de cerca", "c", "ClRangeMeter", { props: { mode: "now" } }),
  S(1, "pegada a la puerta", "bi", "b_closefob", { p: BI(`${ELENA} pressing a key fob with her hand almost touching the driver door of ${CAR} in a workshop.`) }),
  S(1, "En la agencia le dijeron", "bi", "b_clerk", { q: "car dealership service", q2: "office desk man", p: BI("A young car dealership service clerk in a polo shirt shaking his head while holding an old key fob, a computer screen beside him.") }),
  S(1, "que había que cambiarlo y programarlo", "bi", "b_programmer", { q: "car diagnostic scanner", q2: "obd scanner", p: BI("Close view of a key programming device with a cable plugged into a car's diagnostic port under the dashboard, a technician's hand on it.") }),
  S(1, "Cuarenta y cinco dólares", "c", "ClReceipt", { props: { head: "PRESUPUESTO DE LA AGENCIA", lines: [["Control nuevo", "US$ 30"], ["Programación", "US$ 15"], ["Volver", "el jueves"]], total: ["Total", "US$ 45"] } }),
  // ── el loop del botón
  S(2, "", "bi", "b_superlot", { p: BI(`A busy supermarket parking lot in daylight, ${CAR} parked among other cars, people with carts turning their heads toward it.`) }),
  S(2, "que Elena apretó sin querer", "bi", "b_pocket", { p: BI(`Close view of ${FOB} half out of the pocket of a beige knit cardigan, ${EH} reaching for it.`) }),
  S(2, "asustaba a medio estacionamiento del súper", "bi", "b_turnheads", { q: "shopping cart parking lot", p: BI("In a supermarket parking lot, two shoppers with carts turn around startled toward the sound of a car, one with a hand on her chest.") }),
  S(2, "Ella nunca supo qué era", "bi", "b_elenapuzzled", { p: BI(`${ELENA} standing next to ${CAR} in a parking lot looking at the key fob in her hand, completely puzzled.`) }),
  S(2, "Te lo muestro en un rato", "av", ""),
  // ── la promesa
  S(3, "", "av", ""),
  S(3, "las siete funciones de la llave", "bi", "st_carkey", { q: "car key remote", q2: "car key", p: BI(`Close view of ${FOB} in a hand, pressing a button.`) }),
  S(3, "y cómo cambiarle la pila tú mismo", "kf", "k_cointwist", { p: BI(`Extreme close view of ${H} holding ${FOB} with the edge of a small coin inserted into a slot at its bottom.`), d1: "the coin edge sits in the slot", d2: "the fingers twist the coin and the fob shell pops slightly open", sound: "a plastic click" }),
  S(3, "en dos minutos", "bi", "b_watchtwo", { p: BI(`Close view of ${H} holding an open key fob shell over a workbench, a small coin and ${CELL} next to it, a cheap wristwatch on the wrist.`), ov: { c: "ClChip", props: { text: "2 minutos" } } }),
  S(3, "con una moneda", "bi", "b_coin", { q: "coin close up", q2: "coins table", p: BI(`Extreme close view of a small coin standing on its edge next to ${FOB} on a workbench.`) }),
  S(3, "Sin agencia y sin cerrajero", "cl", "c_fobshow", { p: CLP(`In his workshop he holds up an old key fob between two fingers next to ${CAR}, looking at the camera with a small grin.`) }),
  S(3, "Así estaba el control de Elena", "bi", "b_before", { p: BI(`${ELENA} pressing a key fob at arm's length toward ${CAR} in a parking lot, nothing happening, frustrated.`), ov: { c: "ClChip", props: { text: "Así estaba", alert: true } } }),
  S(3, "Y así quedó", "bi", "b_after", { p: BI(`${ELENA} standing far away at the door of ${SHOP} pointing a key fob at ${CAR}, its two orange indicator lights flashing, she smiles.`), ov: { c: "ClChip", props: { text: "Así quedó · 20 m" } } }),
  // ── credibilidad + pruebas
  S(4, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "35 años de mecánico" } } }),
  S(4, "Treinta y cinco años de mecánico", "bi", "st_mechanic2", { q: "mechanic garage working", p: BI(`Close view of ${H} tightening a bolt with a ratchet in a small workshop.`) }),
  S(4, "Y al final te doy", "av", ""),
  S(4, "las tres pruebas", "bi", "b_cardboard0", { p: BI(`Night, a flattened cardboard sheet under the front of ${CAR} on a cement carport floor, lit by a flashlight.`) }),
  S(4, "antes de llevar tu auto", "bi", "b_headlights0", { p: BI(`Night, ${CAR} facing a white garage wall with its headlights on.`), ov: { c: "ClChip", props: { text: "$0 · 10 minutos" } } }),
  S(4, "a cualquier taller", "bi", "st_shopdoor", { q: "auto repair shop entrance", p: BI("The open roll-up door of an ordinary small auto repair shop seen from the street.") }),
  C(5, "", "ClChapter", { n: 1, title: "El control de Elena", sub: "sólo andaba de cerca" }),
  // ── Elena vuelve
  C(6, "", "ClVideoRef", { thumb: I + "th_mec99.jpg", title: "Las 17 cosas que tu auto ya trae", tag: "VIDEO ANTERIOR" }),
  S(6, "un sedán plateado del 2012", "bi", "b_carside", { p: BI(`The whole side of ${CAR} parked in a small workshop in daylight.`) }),
  S(6, "Le encontramos diecisiete cosas", "c", "ClCarMap", { props: { n: 17, all: true, done: true } }),
  S(6, "Te lo dejo aquí", "av", ""),
  S(7, "", "bi", "b_monday", { p: BI(`${ELENA} walking into ${SHOP} on a Monday morning holding a key fob in one hand and a folded printed quote in the other.`) }),
  S(7, "Me dijo", "bi", "b_elenaask", { p: BI(`${ELENA} in ${SHOP} holding up the key fob and the quote toward the camera, eyebrows raised, asking.`) }),
  S(7, "¿Y si se me muere en la calle?", "av", ""),
  S(8, "", "cl", "c_ask", { p: CLP(`In his workshop he stands next to ${ELENA}, pointing toward the street door, asking her a question, she listens.`) }),
  S(8, "Antes lo hacía desde la puerta de su casa", "bi", "b_housedoor", { p: BI(`${ELENA} at the front door of her modest one-story house pointing a key fob toward ${CAR} parked twenty meters away in ${DRIVE}.`) }),
  S(8, "Ahora, sólo pegada al auto", "c", "ClRangeMeter", { props: { mode: "compare" } }),
  S(8, "había que apretar dos o tres veces", "kf", "k_pressagain", { p: BI(`Close view of ${EH} pressing the lock button of ${FOB} next to ${CAR}.`), d1: "the thumb presses the button", d2: "the thumb presses it again harder", sound: "small rubber button clicks" }),
  S(9, "", "bi", "b_counter", { p: BI(`${ELENA} at a dealership service counter, a clerk glancing at a key fob without opening it, pressing it twice.`) }),
  S(9, "le dieron la hoja", "bi", "b_quotehand", { p: BI(`Close view of a clerk's hand sliding a printed service quote across a dealership counter toward ${EH}.`) }),
  S(9, "un día se iba a quedar afuera del auto", "bi", "b_lockedout", { p: BI(`${ELENA} standing next to the closed driver door of ${CAR} at dusk in a parking lot, holding a dead key fob, worried.`) }),
  S(10, "", "av", ""),
  S(10, "Es la pila", "c", "ClKeyFob3D", { props: { mode: "battery" } }),
  S(10, "que dura de dos a cuatro años", "bi", "st_coinbattery", { q: "coin cell battery", p: BI(`Close view of ${CELL} held between two fingertips by its edges.`) }),
  S(10, "el control anda cada vez más de cerca", "c", "ClKeyFob3D", { props: { mode: "range" } }),
  S(11, "", "bi", "b_dashkey", { q: "dashboard warning light", p: BI(`Extreme close view of ${GAUGE} with a small amber warning symbol of a key with a battery lit.`) }),
  S(11, "Elena lo había visto prendido", "bi", "b_elenadash", { p: BI(`${ELENA} in the driver seat of ${CAR} squinting at the dashboard through her reading glasses, worried.`) }),
  S(11, "otra falla más del auto viejo", "av", ""),
  C(12, "", "ClChapter", { n: 2, title: "Las 7 funciones", sub: "antes de pagar nada" }),
];
