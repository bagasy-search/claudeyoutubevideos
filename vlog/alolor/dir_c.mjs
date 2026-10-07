// DIRECTOR C — alolor: si se llena rápido → 3 costumbres → errores → preguntas → la prueba de $0 (el plato de sal) → resumen → regalo +
// Manual US$27 → el frente que se descascara (gancho al ep. 7) → la casa entera (cierre de la serie de 6) → pregunta (párrafos 42-70).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
import { H, WARD, CLOTHES, PAINTER } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/alolor/";
export const SHOTS = [
  S(42, "", "bi", "b_fulljar", { p: BI("A homemade dehumidifier jar with the bottom container almost full of water after just a few days, the flakes on top almost gone.") }),
  C(42, "haga la prueba del aluminio", "ClFoilTest", { result: "out" }),
  C(43, "", "ClCheck", { title: "Tres costumbres", items: ["Puertas abiertas 1 hora por semana", "Puertas con rejilla, si puede", "Ventilar 10 minutos cada mañana"] }),
  S(43, "puertas con rejilla", "bi", "b_louver", { p: BI("An old wardrobe with louvered slatted wooden doors that let air through, in a bright bedroom.") }),
  S(44, "", "bi", "b_alarm", { p: BI(`An old smartphone on a kitchen table showing an alarm, ${MARTA}'s hand reaching for it, a cup of coffee and bread beside it.`) }),
  S(44, "Dice que es su visita de los domingos", "bi", "b_sundaydoors", { p: BI(`${WARD} with both doors open on a sunny Sunday morning, light falling on the hanging suits.`) }),
  C(45, "", "ClHouseMap", { done: ["dormitorio", "arriba", "pared", "techo", "grieta", "ropero"] }),
  C(46, "", "ClChapter", { n: 2, title: "Los 5 errores", sub: "cada uno lo deja volver", alert: true }),
  S(47, "", "bi", "b_sprayerror", { p: BI("An air freshener spray misting into a closed wardrobe full of clothes.") , ov: { c: "ClChip", props: { text: "Error 1", alert: true } } }),
  S(48, "", "bi", "b_steamshirt", { p: BI("A just-ironed shirt still steaming being hung inside a closed wardrobe.") , ov: { c: "ClChip", props: { text: "Error 2", alert: true } } }),
  S(49, "", "bi", "b_wardwall", { p: BI("An old wardrobe pushed flat against a cold outside wall with a dark damp stain spreading on the wall around its edges.") , ov: { c: "ClChip", props: { text: "Error 3", alert: true } } }),
  S(50, "", "bi", "b_closedmonths", { p: BI("A closed old wardrobe with a thin layer of dust on its top and a cobweb in the corner of its doors.") , ov: { c: "ClChip", props: { text: "Error 4", alert: true } } }),
  S(51, "", "bi", "b_trashbags", { p: BI("Black trash bags full of old clothes by a door, a man's suit sleeve sticking out of one.") , ov: { c: "ClChip", props: { text: "Error 5", alert: true } } }),
  C(52, "", "ClChapter", { n: 3, title: "Lo que siempre me preguntan", sub: "rapidito" }),
  S(53, "", "bi", "b_riceplate", { p: BI("A small bowl of rice and a bowl of coarse salt on a wardrobe shelf.") }),
  S(54, "", "bi", "b_storepots2", { p: BI("Two small store-bought moisture absorber tubs with plain blank labels, one full of water, on a closet floor.") }),
  S(55, "", "bi", "b_toiletpour", { p: BI("Close view of a plastic container being emptied into a toilet, the water clear.") }),
  S(56, "", "bi", "b_leathershoes", { p: BI("Old leather shoes and a leather handbag airing on a chair in a shady patio, a rag beside them.") }),
  S(57, "", "bi", "st_mothballs", { q: "mothballs", p: BI("White mothballs in a small dish.") }),
  S(58, "", "bi", "b_cost6", { p: BI("A one-kilo bag of white flakes, two plastic containers and a box of baking soda with plain blank labels lined up on a kitchen table.") }),
  S(59, "", "bi", "b_bathcabinet", { p: BI("The open cabinet under a bathroom sink with a small homemade dehumidifier jar inside, towels stacked beside it.") }),
  S(60, "", "bi", "b_bigward", { p: BI("A large walk-in closet with two homemade dehumidifier jars, one at each end, clothes hanging neatly.") }),
  // ── la prueba de $0
  S(61, "", "av", ""),
  S(61, "Ponga un platito con dos cucharadas de sal fina", "cl", "c_salt", { p: CLP(`He crouches at an open empty wardrobe placing a small white saucer with fine table salt on its floor.`) }),
  C(62, "", "ClSaltTest", { result: "clumped" }),
  C(62, "y le toca el tarro", "ClSaltTest", { result: "loose" }),
  S(63, "", "bi", "b_saltstone", { p: BI("Extreme close view of a small saucer of table salt that has hardened into a solid damp lump, a spoon tapping it.") }),
  S(63, "suelta, como arena", "bi", "b_saltloose", { p: BI("Extreme close view of fine dry loose table salt in a small saucer, a fingertip running through it.") }),
  C(64, "", "ClCheck", { title: "Todo en 30 segundos", items: ["Olor = moho que no se ve", "Nada de perfume", "Vacío, vinagre, un día abierto", "Tarro ½ kg + bicarbonato", "Ropero a 5 cm de la pared"], fast: true }),
  // ── CTA 3
  S(65, "", "av", ""),
  S(65, "si va a pintar ese ropero por dentro", "bi", "b_paintinside", { p: BI("The empty inside of an old wardrobe with a small paint can and brush on its floor, ready to be painted.") }),
  C(65, "Es gratis", "ClQRCard", { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "las 3 pruebas, gratis", kicker: "REGALO · ANTES DE PINTAR" }),
  C(65, "el Manual del Albañil está en esa misma página", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "los 66 arreglos", kicker: "EL MANUAL · US$27" }),
  // ── el frente (gancho al ep. 7)
  S(66, "", "av", ""),
  S(66, "miré el frente de la casa", "bi", "b_facade", { p: BI("The front facade of an old modest one-story Latin American house with a wooden door and barred windows, its painted plaster peeling off in large sheets like paper.") }),
  S(66, "ésa la pintó el pintor hace un año", "bi", "b_painteryear", { p: BI(`${PAINTER} rolling paint on the front facade of an old house on a sunny day, a ladder beside him.`) }),
  S(67, "", "kf", "k_peel", { p: BI(`Close view of ${H} running a fingernail under the edge of peeling paint on an old house facade.`), d1: "the fingernail slides under the edge of the paint", d2: "a whole sheet of paint the size of a hand peels off showing white powdery plaster", sound: "dry paint peeling and cracking" }),
  C(67, "La semana que viene le muestro", "ClVideoRef", { thumb: I + "th_alpintura.jpg", title: "La pintura que se cae", next: true }),
  // ── cierre de la serie
  S(68, "", "bi", "b_marthouse", { p: BI(`${MARTA} standing smiling at the open front door of her old house, waving goodbye, late afternoon light.`) }),
  S(68, "Seis problemas que el pintor tapó", "bi", "b_sixrooms", { p: BI("A hand-drawn pencil floor plan of a small house on a kitchen table with six rooms each marked with a green check, a cup of tea beside it.") }),
  S(68, "Y Doña Marta no gastó en todo eso", "av", ""),
  S(69, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Qué guarda su ropero con olor?" } } }),
  S(69, "Qué guarda adentro", "bi", "b_wardother", { p: BI("An ordinary bedroom wardrobe with its doors open, old coats, a box of photos and folded blankets inside, soft light.") }),
  S(69, "Escríbamelo en los comentarios", "av", ""),
  S(70, "", "av", ""),
];
