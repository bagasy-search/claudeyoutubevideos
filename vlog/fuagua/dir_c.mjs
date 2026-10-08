// DIRECTOR C — fuagua: los 5 errores + preguntas rápidas + a las dos semanas (la linterna, nada) + la revisión de la noche prometida +
// CTA 3 (regalo "Antes de Fumigar" con QR /r + Manual US$27) + gancho al ep. 2 (la cucaracha grande y la fila de hormigas entrando por
// debajo de la puerta del patio → la barrera) + cierre (párrafos 58-83).
import { S, BI, CLP, BOTTLE, LUCIA, JORGE, KIDS, DOG } from "../claudio/lib.mjs";
import { H, HG, KITCHEN, SPRAYER, ROACHES } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fuagua/";
const ROACH1 = ROACHES.replace("cockroaches", "cockroach");
export const SHOTS = [
  C(58, "", "ClChapter", { n: 8, title: "Los 5 errores", sub: "con este frasco", alert: true }),
  C(59, "", "ClNeverMix", { a: "Agua oxigenada", b: "Vinagre", verdict: "Nunca juntos" }),
  S(59, "en botellas separadas", "bi", "b_twobottles", { p: BI("Two separate white spray bottles standing apart on a kitchen shelf, one with clear liquid and one with pale vinegar, with blank labels.") }),
  S(60, "", "bi", "b_spraybait", { p: BI(`Close view of a hand spraying a white spray bottle right onto a small bait cap on a kitchen floor.`) , ov: { c: "ClChip", props: { text: "Error 2", alert: true } } }),
  S(61, "", "bi", "b_curtain", { p: BI("A colored cotton kitchen curtain with a pale bleached spot where it was sprayed, near a window.") , ov: { c: "ClChip", props: { text: "Error 3", alert: true } } }),
  S(61, "Prueba primero en un rincón que no se vea", "bi", "b_testcorner", { p: BI(`Close view of ${H} dabbing a little clear liquid with a cotton swab on the hidden back corner of a sofa cushion.`) }),
  S(62, "", "bi", "b_sill", { p: BI("A clear plastic spray bottle of clear liquid standing in strong sun on a kitchen windowsill.") , ov: { c: "ClChip", props: { text: "Error 4", alert: true } } }),
  S(62, "Botella opaca, en un mueble", "bi", "b_cabinetbottle", { p: BI(`${BOTTLE} and an opaque white spray bottle stored inside a closed wooden kitchen cabinet, the door half open.`) }),
  S(63, "", "bi", "b_luciaone", { p: BI(`${LUCIA} chasing a single cockroach on the wall with a spray bottle, in her kitchen.`) , ov: { c: "ClChip", props: { text: "Error 5", alert: true } } }),
  S(63, "Lo que ves es lo de menos", "av", ""),
  C(64, "", "ClChapter", { n: 9, title: "Preguntas rápidas", sub: "las que me hacen siempre" }),
  // ── preguntas
  S(65, "", "bi", "st_salon", { q: "hair salon bottles", p: BI("Bottles of hair developer with plain labels on a shelf in a small hair salon.") }),
  S(65, "quema la piel y decolora", "bi", "b_towel", { p: BI("A dark blue kitchen towel with bleached orange-white spots on it, folded on a counter.") }),
  C(65, "la de diez volúmenes, la común", "ClBottle3D", { title: "10 volúmenes", sub: "la común · para la casa", tag: "3 %" }),
  S(66, "", "bi", "st_bleach", { q: "bleach bottle", p: BI("A white bottle of household bleach with a plain blank label on a laundry shelf.") }),
  S(66, "prefiero el frasco marrón", "av", ""),
  S(67, "", "kf", "k_potato", { p: BI(`Close view of a halved raw potato on a cutting board, ${H} holding a brown plastic bottle of hydrogen peroxide above it.`), d1: "a few drops fall on the cut potato", d2: "white foam bubbles up on the potato surface", sound: "a soft fizzing" }),
  S(67, "Si no hace nada, ya es agua", "av", ""),
  S(68, "", "bi", "b_twobottles2", { p: BI(`Two ${BOTTLE.replace("a brown plastic bottle", "brown plastic bottles")} on a shelf inside a dark cabinet.`) }),
  S(69, "", "bi", "b_familydinner", { p: BI(`${LUCIA}, ${JORGE} and ${KIDS} having dinner at their kitchen table in the evening, ${DOG} under the table.`) }),
  S(69, "sin irse a dormir a otro lado", "av", ""),
  S(70, "", "bi", "b_tiles", { p: BI(`Close view of ${H} spraying a white tiled backsplash and wiping it with a cloth.`) }),
  S(70, "En madera sin barniz, puede aclararla", "bi", "b_wood", { p: BI("Close view of a raw unvarnished wooden cutting board with a lighter spot where liquid dried.") }),
  S(71, "", "bi", "st_bathroom", { q: "bathroom floor drain", p: BI("A modest family bathroom with a shower, a white toilet and a round metal floor drain.") }),
  S(71, "de noche le pones un tapón", "bi", "b_plug", { p: BI(`Close view of ${H} pressing a rubber plug into a round metal floor drain in a shower.`) }),
  S(72, "", "bi", "b_receipt", { p: BI(`Two brown plastic bottles of hydrogen peroxide, a white spray bottle and a small bag of white powder with plain labels next to a short paper receipt on a kitchen table.`) }),
  C(72, "Menos de lo que les costó una sola", "ClReceipt", { head: "LO QUE GASTARON", lines: [["Agua oxigenada", "2 frascos"], ["Atomizador", "1"], ["Ácido bórico", "1 bolsita"]], total: ["vs. 1 fumigación", "menos"] }),
  // ── el resultado
  S(73, "", "bi", "b_nightdoor", { p: BI(`Night, ${KITCHEN} dark, seen from the doorway, a man's silhouette holding a flashlight.`) }),
  S(73, "prendí la linterna", "kf", "k_flash3", { p: BI(`Night, a clean speckled gray granite kitchen counter and stainless sink, dark.`), d1: "the dark clean counter", d2: "a flashlight beam sweeps across the counter and sink, nothing moves", sound: "a flashlight click in a quiet kitchen" }),
  S(73, "Corrimos el refrigerador", "bi", "b_dryback", { p: BI(`Behind an older white refrigerator pulled from the wall: a dry empty drip tray, a clean floor, a small closed bait cap against the wall with two dead cockroaches beside it, lit by a flashlight.`) }),
  C(73, "dos cucarachas muertas al lado de la tapita", "ClFridgeBack", { mode: "fixed" }),
  S(74, "", "bi", "b_luciasmile", { p: BI(`${LUCIA} laughing with relief in her kitchen at night, a flashlight in her hand.`) }),
  S(74, "Y la familia durmió en su casa todas las noches", "bi", "b_kidsbed", { p: BI(`${KIDS} asleep in their beds in a small shared bedroom, a night light on, ${DOG} curled on the rug.`) }),
  C(75, "", "ClChapter", { n: 10, title: "La revisión de la noche", sub: "10 minutos · una linterna" }),
  // ── la revisión
  S(76, "", "av", ""),
  S(76, "Una hora después de apagar todo", "bi", "b_clock", { p: BI("A kitchen wall clock showing eleven at night, the kitchen dark below it.") }),
  S(76, "prendes una linterna de golpe", "cl", "c_flashcheck", { p: CLP(`At night in a dark kitchen he switches on a yellow flashlight and points it at the counter, alert.`) }),
  S(77, "", "bi", "st_german3", { q: "cockroach appliance", p: BI(`Small ${ROACHES} on top of a microwave in a dark kitchen, lit by a flashlight.`), ov: { c: "ClChip", props: { text: "Chicas y rubias = viven adentro" } } }),
  S(77, "Si ves cucarachas grandes cerca del desagüe", "bi", "st_bigroach2", { q: "big cockroach floor", p: BI("A large reddish-brown cockroach near a kitchen floor drain at night.") , ov: { c: "ClChip", props: { text: "Grandes = vienen de afuera", alert: true } } }),
  S(77, "Y si no ves nada, perfecto", "av", ""),
  S(78, "", "bi", "b_flour", { p: BI("A thin even layer of white flour dusted on a tiled floor behind a kitchen appliance.") }),
  S(78, "con cinta de doble cara", "bi", "b_tape", { p: BI(`Close view of ${H} sticking a strip of double-sided tape on a white baseboard.`) }),
  // ── CTA 3
  S(79, "", "av", ""),
  C(79, "Apunta el celular a este código", "ClQRCard", { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "la revisión de la noche, gratis", kicker: "REGALO · ANTES DE FUMIGAR" }),
  C(79, "el Manual del Fumigador está en esa misma página", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "todos los arreglos", kicker: "EL MANUAL · US$27" }),
  // ── el gancho: la puerta del patio
  S(80, "", "bi", "b_patiodoor", { p: BI("Night, the back patio door of a family kitchen seen from inside, closed, a thin gap of darkness under it.") }),
  S(80, "alumbré el piso", "cl", "c_doorflash", { p: CLP(`At night he stops at a back patio door and points a flashlight down at the floor gap under it.`) }),
  S(81, "", "kf", "k_door", { p: BI("Night, a flashlight beam on the tiled floor at the bottom of a closed back door, a large reddish-brown cockroach squeezing in through the gap under the door."), d1: "the cockroach's antennae come through the gap under the door", d2: "the large cockroach crawls in through the gap onto the tiles", sound: "tiny scratching legs on tile" }),
  S(81, "una fila de hormigas, por la misma rendija", "bi", "b_antsdoor", { q: "ants under door", p: BI("A line of small black ants coming in through the gap under a door onto a tiled floor, lit by a flashlight.") }),
  S(81, "Entran", "av", ""),
  S(81, "La semana que viene te muestro cómo cerrar esa puerta", "bi", "b_chalk", { p: BI("Close view of a thick white chalk line drawn along a wooden door threshold, bay leaves and cloves placed along the frame.") }),
  C(81, "por qué en mi casa no entra uno hace treinta años", "ClVideoRef", { thumb: I + "th_fu30.jpg", title: "La barrera de la puerta", next: true }),
  // ── cierre
  S(82, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Pagaste una fumigación y volvieron?" } } }),
  S(82, "¿Cuánto tardaron?", "bi", "b_calendar2", { p: BI("A paper wall calendar with a day circled in red and a small sticky note with a drawn cockroach on it.") }),
  S(82, "Escríbemelo en los comentarios", "av", ""),
  S(83, "", "av", ""),
];
