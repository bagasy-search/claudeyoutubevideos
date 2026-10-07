// DIRECTOR B — fbgrieta: POR QUÉ NO SE PINTA (la silicona rechaza la pintura, la raya brillante al mes, el acrílico pintable, cuándo cada
// una) · POR QUÉ EL YESO SE VUELVE A RAJAR (la pared se mueve, la puerta, rígido vs goma) · LOS 5 ERRORES · LO DEL VECINO (pintó a la
// tarde → raya brillante → acrílico juntos) · LA PRUEBA (pulgar, testigo de yeso, el invierno) · CTA 2 (párrafos 29-58).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { WALL, CRACK, FILLED, MIX, HANDS, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbgrieta/";
export const SHOTS = [
  // ── por qué no se pinta
  C(29, "", "ClChapter", { n: 3, title: "Por qué no se pinta encima", sub: "lo que no muestra el video viral" }),
  S(29, "rellenan la grieta, pasan el rodillo", "bi", "b_viralroll", { p: BI(`A roller passing over a freshly filled crack on a cream wall, the wall looking perfect.`) }),
  S(29, "el mes siguiente", "bi", "st_calendar", { q: "calendar pages", p: BI(`A wall calendar.`) }),
  S(30, "", "bi", "b_beading", { p: BI(`Extreme close view of fresh water-based paint beading and crawling back on a smooth silicone line on a wall.`) }),
  S(30, "se abre en una rayita brillante", "bi", "b_shinycrack", { p: BI(`A painted cream wall with a thin shiny line opened in the paint exactly over a filled crack.`) }),
  S(31, "", "av", ""),
  S(31, "Esta grieta la rellené igual y la pinté", "cl", "c_testwall", { p: CLP(`He points at a painted wall with a shiny line showing through over a filled crack, eyebrows raised, looking at the camera.`) }),
  S(31, "la pintura se levanta con la uña", "bi", "b_nailpeel", { p: BI(`A fingernail lifting a flake of paint off a shiny silicone line on a wall.`), ov: { c: "ClStampOv", props: { text: "SE PELA" } } }),
  S(32, "", "bi", "b_acryliccart", { p: BI(`Close view of a cartridge of acrylic sealant with a plain blank label next to a caulking gun.`) }),
  S(32, "Misma mezcla con el cemento", "bi", "b_acrylicmix", { p: BI(`A putty knife mixing white acrylic sealant with gray cement in a clear plastic cup.`) }),
  S(32, "Y ése sí se pinta", "bi", "b_paintok", { q: "painting wall roller", p: BI(`A roller painting cream paint smoothly over a filled crack, the paint covering evenly.`) }),
  S(33, "", "bi", "b_garagewall", { q: "concrete garage wall", p: BI(`A bare gray cement wall in a garage with a gray filled crack.`), ov: { c: "ClChip", props: { text: "A la vista: silicona" } } }),
  S(33, "para la pared de adentro que vas a pintar", "bi", "b_bedroomwall", { q: "bedroom wall paint", p: BI(`A freshly painted bedroom wall with no visible crack, a roller tray on the floor.`), ov: { c: "ClChip", props: { text: "Se pinta: acrílico" } } }),
  S(34, "", "c", "ClDoDont", { props: { yes: { label: "Acrílico si se pinta", img: I + "b_paintok.jpg" }, no: { label: "Pintar la silicona", img: I + "b_shinycrack.jpg" } } }),
  S(34, "Lo mismo que con la olla", "c", "ClVideoRef", { props: { thumb: I + "th_prev.jpg", title: "Gaseosa cola + pasta: la olla" } }),
  // ── se mueve
  C(35, "", "ClChapter", { n: 4, title: "Por qué se vuelve a rajar", sub: "la pared se mueve" }),
  S(36, "", "bi", "st_sunwall", { q: "sun on house wall", p: BI(`Hot sun on the wall of a house.`) }),
  S(36, "con el frío se encoge", "bi", "st_frost", { q: "frost cold morning", p: BI(`Frost on a cold morning.`) }),
  S(36, "donde ese movimiento se junta", "c", "ClPins", { props: { img: I + "b_wallmove.jpg", pins: [{ x: 0.25, y: 0.5, label: "calor: se estira" }, { x: 0.75, y: 0.5, label: "frío: se encoge" }, { x: 0.5, y: 0.3, label: "la grieta" }] } }),
  S(37, "", "bi", "b_door", { q: "old wooden door", p: BI(`An old wooden door rubbing against its frame, a fresh scrape mark on the edge.`) }),
  S(38, "", "bi", "b_rigid", { p: BI(`Extreme close view of a hard white plaster filler in a crack split cleanly down the middle again.`), ov: { c: "ClStampOv", props: { text: "RÍGIDO" } } }),
  S(39, "", "bi", "b_stretch", { p: BI(`Two gloved fingers stretching a small strip of cured gray silicone putty like rubber.`) }),
  S(39, "no hay nada rígido que se pueda romper", "cl", "c_rubber", { p: CLP(`He bends a cured strip of gray putty between his fingers in a living room, showing it to the camera, smiling.`) }),
  // ── errores
  C(40, "", "ClChapter", { n: 5, title: "Los 5 errores", sub: "de mayor a menor" }),
  S(41, "", "bi", "b_painterr", { p: BI(`A paint brush painting over a fresh gray silicone line on a wall.`), ov: { c: "ClChip", props: { text: "1 · Pintar la silicona", alert: true } } }),
  S(42, "", "bi", "b_rubbercup", { p: BI(`A plastic cup with a hard rubbery lump of cured gray putty and a putty knife stuck in it.`), ov: { c: "ClChip", props: { text: "2 · Todo el cartucho", alert: true } } }),
  S(43, "", "bi", "b_dustypeel", { p: BI(`A strip of gray putty peeling off a dusty unopened crack in a wall in one piece, dust underneath.`), ov: { c: "ClChip", props: { text: "3 · Sin abrir ni limpiar", alert: true } } }),
  S(44, "", "bi", "b_crumbly", { p: BI(`A dry crumbly gray putty line cracked into pieces inside a wall crack.`), ov: { c: "ClChip", props: { text: "4 · Más cemento", alert: true } } }),
  S(45, "", "bi", "b_washed", { p: BI(`A fresh gray putty line on a wall with water drips running over it and a lighter washed patch.`), ov: { c: "ClChip", props: { text: "5 · Tocarla antes", alert: true } } }),
  // ── el vecino
  C(46, "", "ClChapter", { n: 6, title: "Lo del vecino", sub: "la pintó a la tarde" }),
  S(47, "", "bi", "b_diningcrack", { q: "dining room wall", p: BI(`A crack running across a dining room wall above a wooden sideboard with family photos.`) }),
  S(47, "la hizo ese mismo sábado", "bi", "b_neighborfill", { p: BI(`${NEIGHBOR} on a step ladder filling a crack in his dining room wall with a putty knife.`) }),
  S(48, "", "bi", "b_neighborroll2", { p: BI(`${NEIGHBOR} rolling paint over a whole dining room wall, a birthday banner rolled up on the table.`), anim: "the roller rolls" }),
  S(48, "el cumpleaños de su señora", "bi", "st_birthday", { q: "family birthday cake table", p: BI(`A birthday cake on a family table.`) }),
  S(49, "", "bi", "b_neighborgate", { p: BI(`${NEIGHBOR} at a front gate with a sheepish face, pointing back toward his house.`) }),
  S(49, "una raya brillante", "bi", "b_diningline", { p: BI(`A freshly painted dining room wall with a shiny line showing through the paint over the old crack.`) }),
  S(49, "como piel de durazno", "bi", "b_peachskin", { p: BI(`Extreme close view of paint wrinkling and peeling off a silicone line like fruit skin.`) }),
  S(50, "", "bi", "b_cutout", { p: BI(`A utility knife cutting a strip of old gray silicone out of a crack in a painted wall.`) }),
  S(50, "La segunda la hicimos juntos", "cl", "c_together", { p: CLP(`He and a mustached neighbour in a light-blue checked shirt stand at a dining room wall, one holding a cup of putty, the other a putty knife, laughing.`) }),
  S(50, "recién ahí el rodillo", "bi", "b_finalroll", { p: BI(`${NEIGHBOR} rolling paint over a dining room wall, the paint covering a filled crack evenly.`) }),
  S(51, "", "bi", "b_neighbortalk", { p: BI(`${NEIGHBOR} at a fence explaining to another neighbour, wagging a finger, a paint roller in his hand.`) }),
  // ── la prueba
  C(52, "", "ClChapter", { n: 7, title: "La prueba del vecino", sub: "pulgar, testigo e invierno" }),
  S(53, "", "bi", "b_neighborthumb", { p: BI(`A thick thumb pressing hard into a gray putty line in a concrete patio wall.`), anim: "the thumb presses and lifts" }),
  S(53, "volvió a su lugar", "bi", "b_nomark", { p: BI(`Close view of a smooth gray putty line in a wall with no mark on it.`) }),
  S(54, "", "bi", "b_witness", { p: BI(`A small strip of white plaster stuck across an old crack in a wall next to a gray putty-filled crack, a pencil date written beside it.`) }),
  S(54, "lo que hacían los albañiles de antes", "bi", "st_mason", { q: "old bricklayer working", p: BI(`An old bricklayer working on a wall.`) }),
  S(55, "", "bi", "st_frostyard", { q: "frost on grass morning", p: BI(`Frost on the grass of a backyard in the morning.`) }),
  S(55, "el testigo de yeso se rajó por la mitad", "bi", "b_witnesscracked", { p: BI(`A white plaster witness strip across a wall crack split in two, while a gray putty line beside it is intact.`), ov: { c: "ClStampOv", props: { text: "SE MUEVE" } } }),
  S(56, "", "bi", "b_neighborlook", { p: BI(`${NEIGHBOR} looking from a cracked plaster strip to a gray putty line on a wall, rubbing his mustache.`) }),
  S(56, "Bueno, me callo", "cl", "c_laugh", { p: CLP(`He laughs heartily next to a wall in a patio, a mustached neighbour beside him shrugging.`) }),
  // ── CTA 2
  S(57, "", "av", ""),
  S(57, "setenta y seis", "c", "ClBookPage", { props: { page: I + "book_cover.jpg", pageNo: 76, qr: I + "qr.jpg", stamp: "Las 10 mezclas, gratis" } }),
  S(57, "Paredes, humedad, pisos", "bi", "st_dampwall", { q: "damp wall stain", p: BI(`A damp stain on a wall.`) }),
  S(58, "", "bi", "b_inspectcrack", { p: BI(`A flashlight beam on a diagonal crack running from the corner of a window.`) }),
  S(58, "No te apuro", "av", ""),
];
