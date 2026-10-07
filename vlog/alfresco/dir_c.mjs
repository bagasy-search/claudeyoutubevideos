// DIRECTOR C — alfresco: el caño enterrado con los números de verdad → 5 errores → preguntas → la prueba de $0 (la mano en el techo
// a las 9 de la noche) → resumen → regalo "Antes de Pintar" + Manual US$27 → la pared inflada de la sala (gancho al ep. 3) → cierre
// (párrafos 42-72).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
import { H, UP } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/alfresco/";
export const SHOTS = [
  // ── el caño enterrado
  C(42, "", "ClChapter", { n: 5, title: "El caño enterrado", sub: "los números de verdad" }),
  S(42, "el caño blanco que sale del pasto", "bi", "b_pipelawn", { p: BI("A white PVC pipe with a mesh cap coming up out of a green lawn next to a garden path, a house behind, sunny day.") }),
  S(42, "en Irán, hace siglos", "bi", "st_desert", { q: "desert ancient town", p: BI("An ancient desert town of mud-brick houses with tall wind towers on the roofs, under a hot sky.") }),
  S(43, "", "bi", "st_digging", { q: "digging deep hole shovel", p: BI("A man digging a deep hole in a backyard with a shovel, dirt piled beside.") }),
  C(43, "a dos metros la tierra está a veintidós", "ClEarthTube", { mode: "good" }),
  S(44, "", "bi", "b_pipeair", { p: BI("Close view of the open end of a white PVC pipe coming out of a wall into a room at floor level, a thin ribbon tied to it fluttering in the air coming out.") }),
  S(45, "", "av", ""),
  S(45, "Y tiene que tener de veinte a treinta metros de largo", "bi", "b_longtrench", { p: BI("A long straight trench running the whole length of a large backyard with a white pipe at the bottom, a small excavator parked at the far end.") }),
  S(45, "hacia un desagüe", "bi", "b_drainpit", { p: BI("The bottom end of a buried white PVC pipe connected to a small gravel drain pit in a trench.") }),
  C(46, "", "ClEarthTube", { mode: "short" }),
  S(46, "Ése es el caño de la mayoría de los videos", "av", ""),
  S(47, "", "bi", "b_pipewater", { p: BI("Close view inside the open end of a white PVC pipe with a little stagnant dirty water pooled at the bottom and black mold spots on the inside wall.") }),
  S(47, "como el vaso frío del video del moho", "bi", "b_glasscold", { p: BI("A cold glass of water on a wooden table covered with condensation droplets running down the outside.") }),
  S(48, "", "av", ""),
  S(48, "una zanja de treinta metros a dos metros de hondo", "bi", "st_excavator", { q: "small excavator digging trench", p: BI("A small excavator digging a deep trench in a yard.") }),
  S(49, "", "bi", "b_smallpatio", { p: BI("The small patio of an old modest house, about eight meters long, with potted plants, a clothesline and a laundry sink, seen from the back door.") }),
  S(49, "Y con los cuatro pasos, no hizo falta", "av", ""),
  // ── errores
  C(50, "", "ClChapter", { n: 6, title: "Los 5 errores", sub: "cada uno cuesta grados", alert: true }),
  S(51, "", "bi", "b_thickcurtain", { p: BI("A heavy dark curtain closed inside a bedroom window with bright hot sunlight glowing through its edges.") , ov: { c: "ClChip", props: { text: "Error 1", alert: true } } }),
  S(52, "", "bi", "b_openday", { p: BI("All the windows of a small house wide open at noon on a scorching day, curtains blowing, a hot bright street outside.") , ov: { c: "ClChip", props: { text: "Error 2", alert: true } } }),
  S(53, "", "bi", "b_fanbed", { p: BI(`A small electric fan aimed at a bed in a closed hot bedroom at night, windows shut, a person lying sweaty on the sheets.`) , ov: { c: "ClChip", props: { text: "Error 3", alert: true } } }),
  S(54, "", "bi", "b_clothglued", { p: BI("A shade cloth tied flat directly against the window glass from outside with no gap, sun hitting it.") , ov: { c: "ClChip", props: { text: "Error 4", alert: true } } }),
  S(55, "", "bi", "b_shortpipe2", { p: BI("A short white PVC pipe sticking out of a shallow trench only a hand deep in a small garden, with a puddle of muddy water in the trench.") , ov: { c: "ClChip", props: { text: "Error 5", alert: true } } }),
  // ── preguntas
  C(56, "", "ClChapter", { n: 7, title: "Lo que siempre me preguntan", sub: "rapidito" }),
  S(57, "", "bi", "st_shadegreen", { q: "shade net", p: BI("A close view of dark green shade netting fabric in the sun.") }),
  S(58, "", "bi", "st_balcony", { q: "apartment balcony", p: BI("A small apartment balcony with plants and a sunshade.") }),
  S(59, "", "bi", "b_wetsheet", { p: BI("A wet white bedsheet hanging in front of an open window in a small hot bedroom, dripping on the tile floor.") }),
  S(60, "", "bi", "st_vine", { q: "climbing vine wall", p: BI("A green climbing vine covering a wall with leaves moving in the breeze.") }),
  S(60, "Doña Marta ya plantó una enredadera de jazmín", "bi", "b_jasmine", { p: BI(`${MARTA}'s hands planting a small jasmine vine at the foot of a sunny house wall below a barred window, a little watering can beside it.`) }),
  S(61, "", "bi", "st_cooking", { q: "cooking stove pot", p: BI("A pot cooking on a gas stove in a small kitchen.") }),
  S(62, "", "bi", "b_hardwarebag", { p: BI("A paper bag from a hardware store with a folded dark green shade cloth, four metal hooks and a thin wooden batten sticking out, on a kitchen table.") }),
  S(63, "", "bi", "b_fanlow", { p: BI(`A small box fan on the sill of the open upstairs window of ${UP} at night, a child asleep in the bed beyond it.`) }),
  // ── la prueba de $0
  S(64, "", "av", ""),
  S(64, "apoye la palma de la mano en el techo", "cl", "c_palm", { p: CLP(`At night in ${UP}, he presses one open palm against the ceiling and his other hand on his own forearm, comparing, concentrating.`) }),
  S(65, "", "bi", "b_wallpalm", { p: BI(`Close view of ${H} pressed flat on a plastered wall at night, lit by a lamp.`) }),
  S(65, "Si están frescos", "bi", "b_shadeday", { p: BI("A dark green shade cloth hanging outside an upstairs window in the strong afternoon sun, seen from the patio below.") }),
  S(66, "", "av", ""),
  // ── resumen + CTA 3
  C(67, "", "ClCheck", { title: "Todo en 30 segundos", items: ["La sombra, afuera del vidrio", "De día, la casa cerrada", "De noche: abajo y arriba", "Ventilador para afuera", "Caño: hondo, largo, con desagüe"], fast: true }),
  S(68, "", "av", ""),
  S(68, "antes haga las tres pruebas que hago yo", "bi", "b_threetests", { p: BI(`A square of aluminum foil taped on a plastered wall, a coin and a strip of brown packing tape lying on a small wooden shelf below it.`) }),
  C(68, "Es gratis", "ClQRCard", { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "las 3 pruebas, gratis", kicker: "REGALO · ANTES DE PINTAR" }),
  C(68, "el Manual del Albañil está en esa misma página", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "los 66 arreglos", kicker: "EL MANUAL · US$27" }),
  // ── la pared inflada (gancho al ep. 3)
  S(69, "", "av", ""),
  C(69, "cuando bajé a abrir la ventana de la sala", "ClHouseMap", { done: ["dormitorio", "arriba"], next: "pared" }),
  S(69, "prendí la linterna para buscar el pestillo", "cl", "c_flashwall", { p: CLP(`At night in the living room of the old house, he crouches by the bottom of a pale mint-green wall, lighting it with a flashlight, frowning.`) }),
  S(69, "la pintura estaba inflada", "bi", "b_blisters", { p: BI("Extreme close view in flashlight light of the bottom of a pale mint-green painted wall above the skirting board: the paint swollen in round blisters, some cracked open, white salty powder in the cracks.") }),
  S(69, "Y un polvito blanco", "kf", "k_salt", { p: BI(`Close view of ${H} rubbing a fingertip across white salty powder on the bottom of a blistered painted wall, the powder sticking to the finger, flashlight light.`), d1: "the fingertip rubs across the white powder on the wall", d2: "the finger lifts away covered in white powder", sound: "a dry fingertip scraping on plaster" }),
  S(70, "", "bi", "b_salawall", { p: BI(`The living room of an old house in daylight: the bottom meter of a pale mint-green wall with blistered paint and white stains along the skirting board, an old sofa nearby.`) }),
  C(70, "La semana que viene le muestro", "ClVideoRef", { thumb: I + "th_alhumedad.jpg", title: "La pared que se infla", next: true }),
  // ── cierre
  S(71, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Cuántos grados tiene su cuarto a las 6?" } } }),
  S(71, "Y si ya probó la malla de sombra", "bi", "b_thermohome", { p: BI("A cheap round thermometer hanging on the wall of an ordinary bedroom next to a window with a shade cloth outside, late afternoon.") }),
  S(71, "Le sirve a los que vienen después", "bi", "b_neighbors", { p: BI("Two neighbors talking over a low wall between the patios of two modest houses in the evening, one pointing up at a shade cloth on a window.") }),
  S(71, "Yo leo todos", "av", ""),
  S(72, "", "av", ""),
];
