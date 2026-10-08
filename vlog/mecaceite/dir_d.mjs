// DIRECTOR D — mecaceite: las 3 pruebas · el regalo + el Manual (QR /r, mención 3) · gancho al ep. 7 (mecnafta: Elena anota la gasolina
// en la libreta, va más seguido que Don Ernesto; en la gasolinera el error de todos) · cierre (párrafos 62-70).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { BAY, GAUGE, DIP, LUBE, JUG, PLUG, FILTER } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/mecaceite/";
const NB = "a small worn blue notebook with rounded corners";
const STATION = "an ordinary gas station forecourt in a Latin American city with fuel pumps";
export const SHOTS = [
  C(62, "", "ClChapter", { n: 10, title: "Las 3 pruebas antes del taller", sub: "10 minutos, $0" }),
  S(63, "", "bi", "b_cardplace", { p: BI(`Evening, ${H} sliding a flattened cardboard sheet under the front of ${CAR} in ${DRIVE}.`) }),
  S(63, "A la mañana miras", "bi", "b_cardmorning", { p: BI(`Morning, ${EH} lifting the edge of a flattened cardboard sheet from under ${CAR}, a few small spots on it.`) }),
  S(63, "Agua sin olor, del lado del acompañante", "c", "ClColorCode", { props: { pick: 1, items: [{ c: "#BFD9E8", name: "Agua sin olor", what: "Aire acondicionado", fix: "Normal" }, { c: "#2A1A0E", name: "Marrón o negro", what: "Aceite", fix: "Varilla y tapón" }, { c: "#46A85A", name: "Verde, rosa o naranja", what: "Refrigerante", fix: "Taller" }] } }),
  S(63, "ese mismo día mides la varilla y miras el tapón", "bi", "b_plugcheck", { p: BI(`Low view of a flashlight beam on ${PLUG} under ${CAR}.`) }),
  S(64, "", "bi", "b_lightswall2", { p: BI(`Evening, the front of ${CAR} with a plain grille without any emblem, facing a white garage wall with its headlights on.`) }),
  S(64, "Si se apagan casi del todo", "bi", "b_dimlights", { p: BI(`Evening, the front of ${CAR} with a plain grille without any emblem, its headlights dimmed to a weak glow on a white wall.`) }),
  S(64, "Si sólo parpadean con el motor andando", "c", "ClCheck", { props: { title: "La prueba de los faros", items: ["Se apagan al arrancar → batería", "Parpadean andando → otra cosa", "No cambies la batería todavía"], fast: true } }),
  S(65, "", "av", ""),
  S(65, "Arrancas y miras qué luces quedan prendidas", "bi", "st_dashboard", { q: "car dashboard warning lights", p: BI("A car dashboard with warning lights at engine start.") }),
  S(65, "Rojo es parar, como la aceitera de hoy", "bi", "b_redoil", { q: "warning light dashboard", p: BI(`Extreme close view of a red oil-can warning light glowing on ${GAUGE}.`), ov: { c: "ClChip", props: { text: "Rojo · parar", alert: true } } }),
  S(65, "Amarillo es revisar pronto", "bi", "b_amber", { q: "check engine light", p: BI(`Extreme close view of an amber engine warning light glowing on ${GAUGE}.`), ov: { c: "ClChip", props: { text: "Amarillo · revisar pronto" } } }),
  S(65, "te dice que vayas hoy mismo", "av", ""),
  // ── el regalo
  S(66, "", "av", ""),
  C(66, "en una hoja gratis que se llama Antes del Taller", "ClQRCard", { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "las 3 pruebas, gratis", kicker: "REGALO · ANTES DEL TALLER" }),
  C(66, "el Manual del Mecánico está en esa misma página", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "todos los trucos del taller", kicker: "EL MANUAL · US$27" }),
  // ── gancho al ep. 7
  S(67, "", "av", ""),
  S(67, "Elena empezó a anotar en la libreta también la gasolina", "bi", "b_nbfuel", { p: BI(`Close view of ${EH} writing in ${NB} on the steering wheel at a gas station, a fuel receipt clipped to the page, nothing legible.`) }),
  S(67, "Y comparando con las cuentas de Don Ernesto", "bi", "b_nbcompare", { p: BI(`Close view of ${EH} running a finger down old handwritten columns in ${NB}, reading glasses on, nothing legible.`) }),
  S(67, "ella va a la gasolinera mucho más seguido que él", "bi", "st_fuelpump", { q: "gas station fuel pump", p: BI("A fuel pump nozzle in a car at a gas station.") }),
  S(68, "", "bi", "b_station", { p: BI(`${CAR} parked at a pump of ${STATION}, ${ELENA} standing by the driver's door.`) }),
  S(68, "vi el error que hace casi todo el mundo cada vez que carga", "kf", "k_nozzle", { p: BI(`Close view of a gas pump nozzle in the open fuel filler of ${CAR}, a hand on the trigger.`), d1: "the hand squeezes the nozzle trigger", d2: "the pump keeps running, the hand still squeezing", sound: "a fuel pump running" }),
  S(68, "La semana que viene te muestro cómo gastar mucho menos gasolina", "c", "ClVideoRef", { props: { thumb: I + "th_mecnafta.jpg", title: "El método que corta tu gasto de gasolina a la mitad", next: true } }),
  S(68, "Sin trucos mágicos", "av", ""),
  // ── cierre
  S(69, "", "av", ""),
  S(69, "Escríbemelo en los comentarios", "bi", "b_comment", { p: BI(`Close view of ${EH} typing on an old smartphone in a kitchen.`) }),
  S(70, "", "cl", "c_end", { p: CLP(`In ${DRIVE} he pushes the dipstick of ${CAR} back in, closes the hood and smiles at the camera.`) }),
  S(70, "Nos vemos la semana que viene", "av", ""),
];
