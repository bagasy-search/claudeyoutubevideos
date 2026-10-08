// DIRECTOR C — mecllave: 5 arrancar con la pila muerta (botón / el chip / llave que gira) · 6 el botón de pánico (= pago del loop: el
// estacionamiento del súper, encontrar el auto, peligro, apagarlo, probarlo) · 7 abrir sólo la puerta del conductor + el baúl ·
// la llave de repuesto (mismo día, la prueba, la fecha) · los 5 errores (párrafos 33-58).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { FOB, CELL } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/mecllave/";
export const SHOTS = [
  C(33, "", "ClChapter", { n: 4, title: "Con la pila muerta", sub: "el auto arranca igual" }),
  // ── 5 · arrancar
  S(34, "", "bi", "st_startbutton", { q: "car push start button", p: BI("Close view of a finger pressing the engine start-stop button of an ordinary car.") }),
  S(34, "no te quedas tirado", "av", ""),
  S(34, "apoyas el control contra el botón de encendido", "c", "ClProxStart", { props: { mode: "press" } }),
  S(35, "", "c", "ClProxStart", { props: { mode: "chip" } }),
  S(35, "En algunos autos hay un lugar especial para ponerlo", "bi", "b_fobslot", { q: "car center console", p: BI("Close view of a small molded key fob pocket in the center console of an ordinary car, a key fob resting in it.") }),
  S(35, "El manual te dice dónde", "bi", "b_manualfob", { p: BI(`Close view of ${EH} holding a car owner's manual open at a page with a small drawing of a key fob next to a start button.`) }),
  S(36, "", "bi", "b_ignition", { p: BI(`Close view of ${EH} turning a metal car key in the ignition of ${CABIN}, a key fob hanging from it.`) }),
  S(36, "ese chip va en la llave misma", "c", "ClProxStart", { props: { mode: "key" } }),
  S(36, "la llave gira y el motor arranca igual", "bi", "st_carstart", { q: "car engine starting key", p: BI(`Close view of a hand turning a key in a car ignition, the dashboard lights on.`) }),
  S(36, "La pila sólo sirve para abrir y cerrar a distancia", "av", ""),
  S(37, "", "bi", "b_elenarelief", { p: BI(`${ELENA} in the driver seat of ${CAR} with the engine running, both hands on the wheel, a relieved smile.`) }),
  S(37, "Por eso la tenía tan asustada", "av", ""),
  // ── 6 · el botón de pánico
  C(38, "", "ClChapter", { n: 5, title: "El botón rojo", sub: "el que asustaba al estacionamiento" }),
  S(39, "", "bi", "b_redbutton", { p: BI(`Extreme close view of the red panic button at the bottom of ${FOB} in ${EH}.`) }),
  S(39, "Lo mantienes apretado", "c", "ClPanicWaves", { props: { mode: "alarm" } }),
  S(40, "", "bi", "b_cardiganpocket", { p: BI(`Close view of a key fob pressed inside the pocket of a beige knit cardigan as ${ELENA} pushes a shopping cart.`) }),
  S(40, "De repente su auto empezaba a sonar", "kf", "k_alarm", { p: BI(`${CAR} parked in a busy supermarket parking lot in daylight, lights off.`), d1: "the car sits still with its lights off", d2: "the car's headlights and orange indicators start flashing", sound: "a car horn honking in a parking lot" }),
  S(40, "todo el mundo se daba vuelta", "bi", "b_shoppers", { q: "people parking lot", p: BI("Several shoppers with carts in a supermarket parking lot turning their heads at the same time toward a honking car, one man frowning.") }),
  S(40, "apretaba todos los botones", "bi", "b_allbuttons", { p: BI(`Close view of ${EH} pressing every button of ${FOB} in a panic, a parking lot behind.`) }),
  S(41, "", "av", ""),
  S(41, "encontrar el auto en un estacionamiento grande", "c", "ClPanicWaves", { props: { mode: "find" } }),
  S(41, "si alguien se te acerca de noche", "bi", "st_nightlot", { q: "parking lot at night", p: BI("An ordinary parking lot at night lit by orange street lamps, a few parked cars.") }),
  S(41, "lo aprietas, y todo el mundo mira", "bi", "b_nightpanic", { p: BI(`Night in a parking lot, ${CAR} with its headlights and indicators flashing, ${ELENA} standing by the driver door holding up a key fob, a stranger walking away.`) }),
  S(42, "", "bi", "b_stoppanic", { p: BI(`Close view of ${EH} pressing the unlock button of ${FOB}, ${CAR} behind with its lights stopping.`) }),
  S(42, "guarda el control con los botones hacia adentro", "bi", "b_purse", { p: BI(`Close view of ${EH} slipping ${FOB} buttons facing inward into a small zip pocket of a handbag.`) }),
  S(43, "", "av", ""),
  S(43, "Así, el día que lo necesites", "bi", "b_testpanic", { p: BI(`${ELENA} in ${DRIVE} in daylight pointing a key fob at ${CAR}, its lights flashing, a neighbor smiling over the low white wall.`) }),
  // ── 7 · abrir sólo la puerta del conductor
  C(44, "", "ClChapter", { n: 6, title: "Una sola puerta", sub: "para la que maneja sola" }),
  S(45, "", "c", "ClDoorUnlock", { props: { mode: "once" } }),
  S(45, "Si lo aprietas dos veces seguidas", "c", "ClDoorUnlock", { props: { mode: "twice" } }),
  S(46, "", "av", ""),
  S(46, "de noche, en un estacionamiento", "bi", "b_nightbags", { p: BI(`Night, ${ELENA} loading grocery bags into the back seat of ${CAR} in a dim parking lot, all four doors unlocked.`) }),
  S(46, "Abres sólo tu puerta, subes, y cierras", "kf", "k_lockin", { p: BI(`Night, ${ELENA} sitting in the driver seat of ${CAR} with the door just closed, her hand near the inside lock button.`), d1: "her hand moves to the door lock button", d2: "she presses the lock button and the lock pins go down", sound: "a car door lock clunk" }),
  S(46, "Nadie se te sube por la puerta de atrás", "av", ""),
  S(47, "", "bi", "b_habit", { p: BI(`Close view of ${EH} double-pressing the unlock button of ${FOB} out of habit, a supermarket parking lot at dusk behind.`) }),
  S(47, "Desde ese día, aprieta una vez", "bi", "b_oncepress", { p: BI(`${ELENA} at dusk in a parking lot pressing a key fob once, only the driver door lock of ${CAR} popping up.`) }),
  S(48, "", "bi", "st_trunkbutton", { q: "car trunk opening remote", p: BI("The trunk lid of an ordinary sedan popping open in a parking lot.") }),
  S(48, "mucha gente cree que no funciona", "av", ""),
  // ── la llave de repuesto
  C(49, "", "ClChapter", { n: 7, title: "La llave de repuesto", sub: "lo que casi nadie hace" }),
  S(50, "", "bi", "b_twofobs", { q: "car keys table", p: BI(`Two ordinary black key fobs side by side on a workbench, one more worn, two ${CELL}s next to them.`) }),
  S(50, "Elena tenía la de Don Ernesto en un cajón de la cocina", "bi", "b_drawer", { p: BI(`Close view of an open kitchen drawer full of old batteries, rubber bands and receipts, a spare car key fob in the middle, ${EH} reaching in.`) }),
  S(51, "", "av", ""),
  S(51, "Si ésa anda, el problema es tu control", "c", "ClCheck", { props: { title: "La prueba de la otra llave", items: ["Anda la de repuesto → tu control", "No anda ninguna → el auto", "Nunca es todo la pila"], fast: true } }),
  S(52, "", "bi", "b_writedate", { p: BI(`Close view of ${EH} writing a date with a pen on the first page of a car owner's manual on the hood of ${CAR}.`) }),
  // ── errores
  C(53, "", "ClChapter", { n: 8, title: "Los 5 errores", sub: "con la llave", alert: true }),
  S(54, "", "bi", "b_err_agency", { q: "credit card payment counter", p: BI("Close view of a dealership service receipt for a key fob battery replacement on a counter, a credit card lying on it."), ov: { c: "ClChip", props: { text: "1", alert: true } } }),
  S(55, "", "bi", "b_knife", { q: "kitchen knife table", p: BI(`Close view of a kitchen knife tip forced into the seam of ${FOB}, the plastic scratched, on a kitchen table.`), ov: { c: "ClChip", props: { text: "2", alert: true } } }),
  S(56, "", "bi", "b_err_flip", { p: BI(`Extreme close view of ${CELL} upside down in an opened key fob, the plus side facing down.`), ov: { c: "ClChip", props: { text: "3", alert: true } } }),
  S(57, "", "bi", "b_err_fingers", { p: BI(`Extreme close view of fingertips pinching ${CELL} on both flat faces.`), ov: { c: "ClChip", props: { text: "4", alert: true } } }),
  S(58, "", "bi", "b_err_drawer", { q: "messy drawer", q2: "kitchen drawer", p: BI(`Close view of a dusty spare key fob forgotten at the back of a messy kitchen drawer.`), ov: { c: "ClChip", props: { text: "5", alert: true } } }),
  S(58, "para el día que de verdad la necesitas", "av", ""),
];
