// DIRECTOR A — furatas (Claudio el Fumigador #3, "La casa de los Ramírez" ep. 3: los ratones del garaje): MINUTO 1 (el ratón que se mete
// en la pared con el veneno + "el veneno no los saca: los mata adentro" → el garaje de los Ramírez, bolitas, croquetas, el olor del año
// pasado → loop de la harina (lo que nadie miró en 10 años) → promesa (comida, olor, tapar, trampa) + antes/después → credibilidad + la
// revisión de la linterna → capítulo) + la casa (polaroid del ep. 2) + por qué no veneno + lo que necesitas (mención 1, frase del
// mostrador, pág. 11) + lo honesto de la menta (párrafos 0-22).
import { S, BI, CLP, LUCIA, JORGE, KIDS, DOG } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const H = "a pest-control technician's weathered tanned hands, the short sleeve of a light khaki work shirt at the edge of the frame";
export const GARAGE = "the small garage of a modest Latin American family house: a bare gray cement floor, painted cinder-block walls, a white washing machine, metal shelves with paint cans and cardboard boxes, a white water heater in the back corner and a closed roll-up metal garage door";
export const MOUSE = "a small gray house mouse";
export const DROPS = "small black rice-grain-sized mouse droppings";
export const FLOUR = "a thin dusting of white flour on the cement floor along the base of the wall";
export const COTTON = "a white cotton ball on a small white saucer";
export const WOOL = "a pad of plain steel wool";
export const TRAP = "a classic wooden snap mouse trap";
export const BAG = "a big brown paper bag of dog kibble";
const I = "img/furatas/";
export const SHOTS = [
  // ── 0:00 · el ratón y el veneno
  S(0, "", "kf", "k_wallmouse", { p: BI(`Night, a flashlight beam on the bottom of a painted garage wall: ${MOUSE} squeezing into a dark gap where a gas pipe enters the wall, a green bait block lying on the floor nearby.`), d1: "the mouse sniffs at the dark gap in the wall", d2: "the mouse slips into the gap and its tail disappears", sound: "tiny scratching on cement", ov: { c: "ClStampOv", props: { text: "EL VENENO NO LOS SACA" } } }),
  S(0, "Los mata adentro", "c", "ClPoisonWall", { props: { mode: "wall" } }),
  S(0, "donde no los puedes sacar", "bi", "b_wallgap0", { p: BI("Night, extreme close view of a dark narrow hole at the base of a painted cinder-block wall, a flashlight beam on it, a few gray hairs on its edge.") }),
  S(0, "Y la casa huele a podrido dos semanas", "bi", "b_nose", { p: BI(`${LUCIA} in her garage holding her nose with a disgusted face, looking at a metal shelf against the wall.`) }),
  // ── los Ramírez
  S(1, "", "bi", "b_garage0", { p: BI(`Night, ${GARAGE}, the light just switched on, seen from the doorway.`) }),
  S(1, "Bolitas negras contra la pared", "bi", "b_drops0", { p: BI(`Night, a flashlight beam on a bare cement garage floor along the base of a wall: ${DROPS} scattered in a line along the wall, close view.`) }),
  S(1, "la bolsa de croquetas del perro mordida", "bi", "b_chewbag0", { p: BI(`${BAG} on a garage floor with a ragged chewed hole in one corner, kibble spilled out on the cement, lit by a flashlight.`) }),
  S(1, "y el año pasado", "bi", "b_jorgebait0", { p: BI(`${JORGE} crouching behind a metal shelf in his garage, sliding a green rodent bait block under it.`) }),
  S(1, "después del veneno", "bi", "b_baitblock", { q: "rodent bait block", p: BI("A few green rodent poison bait blocks lying on a dusty cement floor behind a metal shelf.") }),
  S(1, "dos semanas de olor a podrido", "bi", "b_jorgenose0", { p: BI(`${JORGE} in his garage pinching his nose, grimacing, looking at a metal shelf against the wall.`) }),
  S(1, "detrás de la estantería", "bi", "b_shelfback", { p: BI(`The dusty narrow gap behind a metal garage shelf full of paint cans, against a painted cinder-block wall, a flashlight beam on it.`) }),
  // ── el loop
  S(2, "", "kf", "k_flour", { p: BI(`Close view of ${H} shaking a small kitchen sieve over a cement garage floor along the base of a wall, white flour falling.`), d1: "the sieve shakes and white flour falls in a thin veil", d2: "a thin white strip of flour covers the floor along the wall", sound: "a soft tapping on a metal sieve" }),
  S(2, "a la mañana siguiente", "bi", "b_morning0", { p: BI(`Early morning light through a small window into ${GARAGE}, a thin white strip of flour along the base of the wall.`) }),
  S(2, "fue por dónde entraban de verdad", "bi", "b_prints0", { p: BI(`Morning, extreme close view of tiny mouse footprints and a thin tail line in a thin layer of white flour on a gray cement floor along a wall.`) }),
  S(2, "Un lugar que nadie en esa casa había mirado en diez años", "cl", "c_heater0", { p: CLP(`In a dim garage he crouches in the back corner beside a white water heater, pointing a flashlight behind it, looking back at the camera with raised eyebrows.`) }),
  S(2, "en diez años", "bi", "b_heaterdust", { p: BI("Night, a flashlight beam on the dusty, cobwebbed narrow gap between a white water heater and the wall in the corner of a garage.") }),
  S(2, "Te lo muestro en un rato", "av", ""),
  // ── la promesa
  S(3, "", "av", ""),
  S(3, "cómo sacamos los ratones", "bi", "st_mouse2", { q: "mouse peeking out", p: BI(`${MOUSE} peeking out from behind a cardboard box in a garage at night.`) }),
  S(3, "de una casa con niños y perro", "bi", "b_kidsdog0", { p: BI(`${KIDS} with ${DOG} at the open door between a family kitchen and the garage, looking in.`) }),
  S(3, "sin una gota de veneno", "bi", "b_nopoison", { p: BI(`Close view of ${H} dropping a pack of green rodent poison bait blocks into a trash can.`) }),
  S(3, "Les quitas la comida", "bi", "b_bin", { q: "pet food storage container", p: BI(`Close view of ${H} pouring dog kibble from a paper bag into a hard blue plastic storage bin with a lid.`) }),
  S(3, "les pones un olor que odian", "bi", "b_drops", { q: "essential oil dropper cotton", p: BI(`Close view of ${H} in a nitrile glove dripping peppermint essential oil from a small dark glass dropper bottle onto ${COTTON}.`) }),
  S(3, "tapas la entrada con algo que no pueden morder", "bi", "b_woolhole", { p: BI(`Close view of ${H} pushing ${WOOL} into a ragged hole around a gas pipe entering a painted cinder-block wall.`) }),
  S(3, "y los que quedan, con trampa", "bi", "st_trap", { q: "wooden mouse trap", p: BI(`${TRAP} on a cement floor against a wall.`) }),
  S(3, "Con las cantidades exactas", "bi", "b_count", { p: BI(`Extreme close view of a drop of essential oil falling from a small dark glass dropper onto ${COTTON}.`), ov: { c: "ClChip", props: { text: "5 gotas" } } }),
  S(3, "Así estaba ese garaje", "bi", "b_before", { p: BI(`Night, ${GARAGE}, a chewed paper bag of kibble spilled on the floor and ${DROPS} along the wall, lit by a flashlight.`), ov: { c: "ClChip", props: { text: "Antes", alert: true } } }),
  S(3, "Y así quedó", "bi", "b_after", { p: BI(`Morning, ${GARAGE} tidy, a blue plastic bin with a lid on a shelf, a smooth unbroken strip of white flour along the clean wall, nothing on the floor.`), ov: { c: "ClChip", props: { text: "1 semana después" } } }),
  // ── credibilidad + linterna
  S(4, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de fumigador" } } }),
  S(4, "Treinta años de fumigador", "bi", "b_truck", { q: "pest control truck", p: BI("An old white pickup truck with a pest-control sprayer tank and hoses in its bed, parked on a quiet residential street.") }),
  S(4, "Y al final te doy", "av", ""),
  S(4, "la revisión de diez minutos", "bi", "b_flashlight", { q: "turning on flashlight", p: BI(`Close view of ${H} switching on a yellow flashlight in a dark garage.`), ov: { c: "ClChip", props: { text: "$0 · 10 minutos" } } }),
  S(4, "con una linterna", "bi", "b_flashbeam", { p: BI("Night, a flashlight beam sweeping along the base of a kitchen wall and baseboard.") }),
  S(4, "esta noche si tienes ratones", "bi", "st_mouse0", { q: "house mouse", p: BI(`${MOUSE} sitting by a wall at night, lit by a flashlight.`) }),
  S(4, "y por dónde entran", "bi", "b_gapdoor0", { q: "gap under garage door", p: BI("Night, the bottom corner of a closed metal roll-up garage door with a chewed rubber seal and a small gap.") }),
  C(5, "", "ClChapter", { n: 1, title: "El garaje de los Ramírez", sub: "bolitas negras · croquetas mordidas" }),
  // ── la casa
  C(6, "", "ClVideoRef", { thumb: I + "th_fu30.jpg", title: "La barrera de la puerta", tag: "VIDEO ANTERIOR" }),
  S(6, "si no la viste, te la dejo aquí", "av", ""),
  S(7, "", "bi", "b_housenight", { q: "house at night", p: BI("Night, the side of a modest one-story Latin American family house with a small garage door, a flashlight beam crossing the wall.") }),
  S(7, "pasé por el garaje", "cl", "c_garage", { p: CLP(`At night he stands in ${GARAGE}, a flashlight in his hand, turning to look at the camera.`) }),
  S(7, "Jorge, el papá, prendió la luz", "bi", "b_jorgepoint", { p: BI(`${JORGE} in his garage at night, one hand on the light switch, pointing at the floor along the wall.`) }),
  S(8, "", "bi", "b_dropsmacro", { p: BI(`Extreme close view of ${DROPS} on a gray cement floor next to a painted wall, a coin beside them for scale.`) }),
  S(8, "Y la bolsa de croquetas de Bruno", "bi", "b_chewbag", { p: BI(`Close view of a ragged chewed hole in the corner of ${BAG}, kibble crumbs and spilled kibble around it on a cement garage floor.`) }),
  S(8, "y croquetas por el piso", "bi", "b_kibble", { q: "dog kibble floor", p: BI("Dog kibble scattered on a gray cement floor.") }),
  S(9, "", "bi", "b_lucia", { p: BI(`${LUCIA} at the door between her kitchen and the garage at night, arms crossed, worried, looking up at the garage ceiling.`) }),
  S(9, "Como uñitas", "bi", "st_ceiling", { q: "garage ceiling", p: BI("Night, a dark garage ceiling with exposed wooden beams, a flashlight beam on it.") }),
  S(9, "Y Sofía, la de nueve", "bi", "b_sofia", { p: BI(`Sofía, a 9-year-old Latin American girl with two braids, standing at the garage door pointing at the white washing machine, her eyes wide.`) }),
  S(9, "detrás de la lavadora", "bi", "st_washerback", { q: "behind washing machine", p: BI("The dusty dark space behind a white washing machine in a garage, hoses entering the wall.") }),
  S(10, "", "bi", "b_jorgebait", { p: BI(`${JORGE} crouching behind a metal shelf in his garage, placing a green rodent bait block on the floor.`) }),
  S(10, "Y a las dos semanas, el olor", "bi", "b_jorgenose", { p: BI(`${JORGE} in his garage covering his nose with his hand, frowning at the wall behind a metal shelf.`) }),
  S(10, "Uno se había muerto adentro del hueco de la pared", "c", "ClPoisonWall", { props: { mode: "wall" } }),
  S(11, "", "bi", "b_drops2", { p: BI(`Night, flashlight on fresh ${DROPS} next to a bag of dog kibble on a garage floor.`) }),
  S(11, "la entrada seguía abierta", "bi", "b_gapdoor", { p: BI("Night, the bottom corner of a closed metal roll-up garage door, its rubber seal chewed open into a small gap.") }),
  S(11, "siempre llega otro ratón", "bi", "st_mouse1", { q: "mouse walking wall", p: BI(`${MOUSE} running along the base of a wall at night.`) }),
  C(12, "", "ClChapter", { n: 2, title: "Por qué nada de veneno", sub: "con niños y perro en casa" }),
  // ── por qué no veneno
  S(13, "", "av", ""),
  S(13, "El ratón come, se siente mal", "bi", "st_mousebait", { q: "mouse eating", p: BI(`${MOUSE} nibbling something on a dusty floor at night.`) }),
  S(13, "adentro de la pared, debajo del piso, en el techo", "bi", "b_wallgap", { p: BI("Night, a flashlight beam on a dark gap at the base of a painted cinder-block wall in a garage.") }),
  S(13, "Y no lo puedes sacar", "av", ""),
  S(14, "", "bi", "b_brunogarage", { p: BI(`${DOG} sniffing along the base of a garage wall, near a metal shelf.`) }),
  S(14, "Es el que el perro o el gato agarran primero", "c", "ClPoisonWall", { props: { mode: "dog" } }),
  S(15, "", "bi", "b_baitcolor", { p: BI("Close view of bright green and blue rodent bait blocks on a cement floor, looking almost like candy.") }),
  S(15, "Un niño de seis años, como Mateo", "bi", "b_mateo", { p: BI(`Mateo, a 6-year-old Latin American boy with short messy hair, crouching in a garage looking curiously at something on the floor.`) }),
  S(16, "", "av", ""),
  C(16, "Cuatro pasos", "ClCheck", { title: "Sin veneno", items: ["1 · Les quitas la comida", "2 · Menta: el olor que odian", "3 · Tapas por donde entran", "4 · Trampa para los de adentro"], fast: true }),
  S(16, "Ninguno solo alcanza. Juntos, sí", "av", ""),
  C(17, "", "ClChapter", { n: 3, title: "Lo que necesitas", sub: "poco y barato" }),
  // mención 1 (frase del mostrador)
  S(18, "", "bi", "st_hardware", { q: "hardware store counter", p: BI("The counter of a small neighborhood hardware store with shelves of tools and boxes behind it.") }),
  S(18, "una bolsa de algodón, lana de acero", "bi", "b_counteritems", { p: BI(`On a hardware store counter: a small dark glass bottle of peppermint essential oil with a plain label, a bag of cotton balls, a pack of steel wool pads and two wooden snap mouse traps.`) }),
  C(18, "La masilla y los guantes", "ClNotebook", { title: "En la ferretería", rows: [{ k: "Menta", v: "frasco chico" }, { k: "Algodón", v: "1 bolsa" }, { k: "Lana acero", v: "sin jabón" }, { k: "Trampas", v: "2 de golpe" }], note: "La frase exacta · pág. 11" }),
  C(18, "En el Manual te dejé esa frase escrita", "ClBookPage", { page: I + "page11.jpg", pageNo: 11, stamp: "La frase, en la página" }),
  S(19, "", "bi", "st_oil", { q: "peppermint essential oil bottle", p: BI("A small dark amber glass dropper bottle of essential oil next to fresh mint leaves on a wooden table.") }),
  S(19, "No el aromatizante de ambiente", "bi", "b_airfresh", { p: BI("A plain blank-labeled room air freshener spray can and a small dark glass essential oil bottle side by side on a shelf.") }),
  S(20, "", "bi", "st_wool", { q: "steel wool", p: BI(`Close view of ${WOOL} on a wooden workbench.`) }),
  S(20, "Pero sin jabón adentro", "av", ""),
  S(21, "", "bi", "b_traps", { p: BI(`Two ${TRAP.replace("a classic ", "classic ")}s side by side on a wooden workbench, their springs and bars visible.`) }),
  S(21, "No las de pegamento", "bi", "b_gluetrap", { p: BI("A flat plastic glue trap tray with a plain label lying on a shelf, set aside.") }),
  S(21, "La de golpe es rápida", "av", ""),
  S(22, "", "av", ""),
  S(22, "Les molesta, los hace cambiar de camino", "kf", "k_sniff", { p: BI(`Night, close view of ${MOUSE} walking along the base of a garage wall toward ${COTTON}.`), d1: "the mouse walks along the wall and sniffs the air", d2: "the mouse stops near the cotton ball, turns around and runs back", sound: "tiny scratching on cement" }),
  S(22, "Lo que de verdad los saca", "av", ""),
];
