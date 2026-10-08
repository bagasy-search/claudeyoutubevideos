// DIRECTOR A — fuhormiga (Claudio el Fumigador #5, "La casa de los Ramírez" ep. 5: el cebo que se lleva el nido): MINUTO 1 (la mano que
// aplasta hormigas + "mañana vienen el doble" → la fila de la ventana al azucarero, Jorge con el aerosol → loop: de dónde venían (el nido
// bajo la maceta) → promesa + antes/después → credibilidad + la linterna → capítulo) + la casa (polaroid del ep. 4) + cómo funciona una
// fila (obreras, rastro, boca a boca, el truco, el aerosol) + lo que necesitas (mención 1, pág. 13) + lo honesto (párrafos 0-24).
import { S, BI, CLP, LUCIA, JORGE, KIDS, DOG, HOUSE } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const H = "a pest-control technician's weathered tanned hands, the short sleeve of a light khaki work shirt at the edge of the frame";
export const KITCHEN = HOUSE;
export const ANTS = "a long single-file line of tiny black ants";
export const WINDOW = "the kitchen window above the sink with a white painted wooden frame and white iron bars";
export const SUGAR = "a white ceramic sugar bowl with its lid off";
export const STATION = "a small clear glass baby-food jar with its metal screw lid closed tight, three tiny holes near the bottom of its side, a wet cotton ball inside, taped down to the counter with two strips of tape";
export const BORAX = "a small white cardboard box of borax powder with a plain blank label";
export const POT = "a big terracotta flower pot with a small lemon tree, standing on the cement floor of a small back patio next to the house wall";
const MATEO = "Mateo, a 6-year-old Latin American boy with short messy hair";
const I = "img/fuhormiga/";
export const SHOTS = [
  // ── 0:00 · matarlas = el doble
  S(0, "", "kf", "k_squash", { p: BI(`Close view of ${ANTS} on a speckled gray granite kitchen counter, a woman's hand with a folded dish towel coming down on them.`), d1: "the ants march in their line on the counter", d2: "the towel slaps down on the line of ants", sound: "a towel slapping a counter", ov: { c: "ClStampOv", props: { text: "MAÑANA, EL DOBLE" } } }),
  S(0, "en tu cocina", "bi", "st_kitchencounter0", { q: "kitchen counter", p: BI("A kitchen counter in daylight.") }),
  S(0, "mañana vienen el doble", "bi", "st_antsmany", { q: "ants trail", p: BI(`${ANTS}, many more of them, a thick trail on a kitchen counter.`) }),
  S(0, "Las que ves son las únicas", "bi", "st_antmacro", { q: "ant macro", p: BI("Extreme macro view of a single black ant carrying a tiny white grain of sugar.") }),
  S(0, "que podían llevar el veneno hasta la reina", "c", "ClAntRelay", { props: { mode: "share" } }),
  // ── los Ramírez
  S(1, "", "bi", "b_kitchen0", { p: BI(`${KITCHEN} in daylight, seen from the doorway, ${WINDOW} at the back.`) }),
  S(1, "Una fila de hormigas, una detrás de otra", "kf", "k_antline", { p: BI(`Close view of ${ANTS} coming down the edge of ${WINDOW} onto a speckled gray granite counter.`), d1: "the ants march down the window frame in a line", d2: "the ants keep marching onto the counter", sound: "a quiet kitchen with a ticking clock" }),
  S(1, "que baja del marco de la ventana", "bi", "b_antsframe0", { p: BI(`Close view of ${ANTS} coming down the corner of ${WINDOW}.`) }),
  S(1, "cruza la barra de la cocina", "bi", "b_antscounter", { p: BI(`${ANTS} crossing a speckled gray granite kitchen counter toward ${SUGAR}.`) }),
  S(1, "y se mete en el azucarero", "bi", "b_sugarants", { p: BI(`Extreme close view of tiny black ants crawling over white sugar inside ${SUGAR}.`) }),
  S(1, "Jorge ya tenía el aerosol en la mano", "bi", "b_jorgespray0", { p: BI(`${JORGE} in his kitchen holding up a plain blank aerosol can of insecticide, aiming at the window frame, determined.`) }),
  // ── el loop
  S(2, "", "kf", "k_flashtrail", { p: BI(`Night, a flashlight beam following ${ANTS} along the bottom of a kitchen wall toward a window frame.`), d1: "the flashlight beam slowly follows the line of ants", d2: "the beam reaches the window frame where the ants disappear into a thin crack", sound: "a soft click of a flashlight" }),
  S(2, "siguiendo la fila con la linterna", "bi", "b_flashants0", { p: BI(`Night, close view of ${H} holding a yellow flashlight aimed at a line of tiny ants on a kitchen wall.`) }),
  S(2, "encontramos de dónde venían de verdad", "bi", "b_patiopot0", { p: BI(`Night, a flashlight beam on ${POT}, a line of tiny ants going under it.`) }),
  S(2, "Un lugar al que nadie iba a llegar con un aerosol", "vl", "m2", { a: `crouches at night in a small back patio next to ${POT}, a yellow flashlight in his hand pointing at the base of the pot, looking back at the camera.`, act: "He shines the flashlight on the base of the pot, then turns to the camera, raises a finger to his lips and whispers.", b: "he has one finger on his lips, the flashlight still on the pot, eyebrows raised." }),
  // ── la promesa
  S(3, "", "av", ""),
  S(3, "el cebo casero que las hormigas mismas llevan al nido", "bi", "b_antsbait", { p: BI(`Extreme close view of tiny black ants gathered drinking at the edge of a wet cotton ball inside ${STATION}.`) }),
  S(3, "llevan al nido", "bi", "st_antscarry0", { q: "ants carrying food", p: BI("Ants carrying food in a line.") }),
  S(3, "y reparten con la reina", "bi", "st_antnest", { q: "ant nest queen", p: BI("Inside an ant nest, a queen ant surrounded by workers and white larvae.") }),
  S(3, "hasta que se termina la fila entera", "c", "ClAntDays", {}),
  S(3, "Con las cantidades exactas", "bi", "b_spoonborax", { p: BI(`Close view of ${H} leveling a teaspoon of white borax powder over a glass of warm water.`), ov: { c: "ClChip", props: { text: "1 cucharadita" } } }),
  S(3, "y seguro para una casa con niños y perro", "bi", "b_kidsdog0", { p: BI(`${KIDS} with ${DOG} in the kitchen, the kids looking at a small closed jar taped to the counter.`) }),
  S(3, "Así estaba esa cocina", "bi", "b_before", { p: BI(`${KITCHEN}, ${ANTS} crossing the counter to an open sugar bowl, crumbs on the counter.`), ov: { c: "ClChip", props: { text: "Antes", alert: true } } }),
  S(3, "Y así quedó", "bi", "b_after", { p: BI(`Morning, ${KITCHEN} clean, the window frame sealed, a closed glass sugar jar with a screw lid on the counter, no ants.`), ov: { c: "ClChip", props: { text: "5 días después" } } }),
  // ── credibilidad + linterna
  S(4, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de fumigador" } } }),
  S(4, "Treinta años de fumigador", "bi", "b_truck", { q: "pest control truck", p: BI("An old white pickup truck with a pest-control sprayer tank in its bed, parked on a quiet residential street.") }),
  S(4, "Y al final te doy", "av", ""),
  S(4, "la revisión de diez minutos", "bi", "b_flashlight", { q: "turning on flashlight", p: BI(`Close view of ${H} switching on a yellow flashlight in a dark kitchen.`), ov: { c: "ClChip", props: { text: "$0 · 10 minutos" } } }),
  S(4, "con una linterna", "bi", "st_flashbeam", { q: "flashlight beam dark", p: BI("Night, a flashlight beam sweeping along a kitchen baseboard.") }),
  S(4, "para que sepas esta noche", "bi", "st_kitchennight0", { q: "dark kitchen night", p: BI("A dark kitchen at night.") }),
  S(4, "qué bicho tienes", "bi", "st_antclose", { q: "black ant closeup", p: BI("Extreme close view of a black ant.") }),
  S(4, "y por dónde entra", "bi", "b_crack0", { p: BI(`Extreme close view of a thin crack between ${WINDOW} and the tiled wall, two tiny ants coming out of it.`) }),
  C(5, "", "ClChapter", { n: 1, title: "La fila de los Ramírez", sub: "de la ventana al azucarero" }),
  // ── la casa
  C(6, "", "ClVideoRef", { thumb: I + "th_fufruta.jpg", title: "Las mosquitas del frutero", tag: "VIDEO ANTERIOR" }),
  S(6, "si no la viste, te la dejo aquí", "av", ""),
  S(7, "", "vl", "v_mateo", { a: `stands at the door of ${KITCHEN} with his work bag on his shoulder, about to leave, ${MATEO} kneeling on a chair at the window calling him.`, act: "He stops, turns back toward the boy with a smile and walks toward the window, then bends down to look where the boy points without touching.", b: "he is bent beside the boy at the window, both looking at the window frame." }),
  S(7, "Y me señalaba con el dedo, sin tocar", "bi", "b_mateopoint", { p: BI(`${MATEO} on a kitchen chair pointing with one finger at a line of ants on the window frame, not touching, eyes wide.`) }),
  S(8, "", "bi", "b_antsframe", { p: BI(`Close view of ${ANTS} walking down the white painted edge of ${WINDOW}.`) }),
  S(8, "caminaba por la pared hasta la barra", "bi", "st_antswall", { q: "ants on wall", p: BI(`${ANTS} walking on a white wall.`) }),
  S(8, "y subía por el azucarero", "bi", "b_antsbowl", { p: BI(`${ANTS} climbing up the side of ${SUGAR} on the counter.`) }),
  S(8, "Arriba, dentro de la tapa, había un montón, comiendo", "bi", "b_lidants", { p: BI("Extreme close view of the inside of a white ceramic sugar bowl lid lying upside down, crowded with tiny black ants eating sugar crumbs.") }),
  S(9, "", "bi", "b_luciatalk", { p: BI(`${LUCIA} in her kitchen talking, tired, gesturing at the window frame.`) }),
  S(9, "Las mato con el trapo", "bi", "b_luciatowel", { p: BI(`${LUCIA} wiping a line of ants off the kitchen counter with a dish towel.`) }),
  S(9, "pongo el azucarero en otro lado", "bi", "b_luciamove", { p: BI(`${LUCIA} carrying a white sugar bowl to the other end of the kitchen counter.`) }),
  S(9, "Más que antes", "bi", "st_antsmany2", { q: "many ants", p: BI(`${ANTS}, a thick trail.`) }),
  S(10, "", "bi", "b_backpack", { p: BI(`A child's school backpack hanging on a hook next to the kitchen window, a candy wrapper sticking out of its side pocket.`) }),
  S(10, "A la mañana, la mochila estaba llena de hormigas", "bi", "b_sofiabag", { p: BI(`Sofía, a 9-year-old Latin American girl with two braids, holding her backpack at arm's length in the kitchen, grimacing, tiny ants crawling on it.`) }),
  S(11, "", "bi", "b_jorgecan", { p: BI(`${JORGE} in his kitchen reading the back of a plain aerosol can of insecticide.`) }),
  S(11, "El año pasado roció toda la ventana", "bi", "b_jorgespray", { p: BI(`${JORGE} spraying insecticide all over the kitchen window frame and counter, a mist in the air.`) }),
  S(11, "Pero la cocina olió a veneno una semana", "bi", "b_luciasmell", { p: BI(`${LUCIA} opening the kitchen window wide and waving the air with her hand, wrinkling her nose.`) }),
  S(11, "Y a las dos semanas", "bi", "st_antsback", { q: "ants trail kitchen", p: BI(`${ANTS} back on a kitchen counter.`) }),
  S(12, "", "vl", "v_regla", { a: `stands at ${WINDOW} in ${KITCHEN}, pointing outside through the bars with one finger, looking at the camera.`, act: "He points out the window, explains, then makes a gesture of something being carried away with his hand.", b: "he has his hand out the window, palm open, a dry knowing look." }),
  S(12, "Y el nido no se entera de nada", "bi", "st_antnest2", { q: "ant colony underground", p: BI("An underground ant nest with tunnels and many ants.") }),
  C(13, "", "ClChapter", { n: 2, title: "Cómo funciona una fila", sub: "y el truco te parece obvio" }),
  // ── cómo funciona
  S(14, "", "bi", "st_antworkers", { q: "worker ants carrying", p: BI("Worker ants carrying crumbs in a line.") }),
  S(14, "Detrás, escondidas, hay cientos o miles más", "bi", "st_antnest3", { q: "ant nest", p: BI("Thousands of ants inside a nest.") }),
  S(14, "Y una reina, a veces varias", "bi", "st_queenant", { q: "queen ant", p: BI("A big queen ant among small workers.") }),
  S(15, "", "vl", "v_cuantas", { a: `stands at the granite counter in ${KITCHEN} holding a folded dish towel, a few ants on the counter beside his hand.`, act: "He lifts the towel as if to swat, stops, shakes his head and puts the towel down, then spreads his hands wide to show how many more there are.", b: "he spreads both hands wide apart, eyebrows raised." }),
  S(15, "O sea que por cada hormiga que matas con el trapo", "bi", "b_towelswat", { p: BI(`${LUCIA} swatting a few ants on the kitchen counter with a dish towel.`) }),
  S(15, "hay muchísimas que nunca vas a ver", "bi", "st_antnest5", { q: "ant colony", p: BI("A huge ant colony underground.") }),
  S(16, "", "bi", "st_anttrail2", { q: "ants following trail", p: BI(`${ANTS} following a trail.`) }),
  S(16, "dejando un rastro de olor en el piso", "c", "ClAntRelay", { props: { mode: "share" } }),
  S(16, "Es un camino marcado", "bi", "st_antsline3", { q: "ant line", p: BI("A line of ants on a floor.") }),
  S(17, "", "vl", "v_secreto", { a: `leans over the granite counter in ${KITCHEN} toward the camera, a line of tiny ants on the counter in front of him.`, act: "He leans in close to the camera as if telling a secret, then mimes passing something from his mouth to another with his fingers.", b: "he holds his two hands together, fingertips touching, explaining, leaning toward the camera." }),
  S(17, "Llevan la comida en el buche", "bi", "st_trophallaxis", { q: "ants sharing food", p: BI("Two ants touching mouths sharing food.") }),
  S(17, "A las larvas. Y a la reina", "bi", "st_antlarvae", { q: "ant larvae", p: BI("Ant larvae in a nest.") }),
  S(18, "", "c", "ClAntRelay", { props: { mode: "share" } }),
  S(18, "Les das un cebo dulce, con un veneno lento", "vl", "v_truco", { a: `stands at the granite counter in ${KITCHEN} holding ${STATION} up toward the camera.`, act: "He holds the small jar up, taps it, and explains with a confident little smile, nodding.", b: "he holds the jar beside his face, a confident smile." }),
  S(19, "", "c", "ClAntRelay", { props: { mode: "spray" } }),
  S(19, "A veces el nido hasta se divide en dos", "bi", "b_twotrails", { p: BI(`Two separate lines of tiny black ants on a cement patio floor going in different directions from the base of ${POT}.`) }),
  C(20, "", "ClChapter", { n: 3, title: "Lo que necesitas", sub: "poco y muy barato" }),
  // mención 1
  S(21, "", "bi", "st_hardware", { q: "hardware store counter", p: BI("The counter of a small neighborhood hardware store.") }),
  S(21, "una caja chica de bórax, azúcar", "bi", "b_counteritems", { p: BI(`On a hardware store counter: ${BORAX}, a bag of white sugar, three small glass baby-food jars with metal lids and a roll of tape.`) }),
  C(21, "Y en casa, algodón y cinta adhesiva", "ClNotebook", { title: "Lo que pides", rows: [{ k: "Bórax", v: "caja chica" }, { k: "Azúcar", v: "común" }, { k: "Frascos", v: "con tapa" }, { k: "Algodón", v: "y cinta" }], note: "La frase exacta · pág. 13" }),
  C(21, "En el Manual te dejé esa frase escrita", "ClBookPage", { page: I + "page13.jpg", pageNo: 13, stamp: "La frase, en la página" }),
  S(22, "", "vl", "v_borax", { a: `stands at the granite counter in ${KITCHEN} holding ${BORAX}, reading its side.`, act: "He turns the box to show the camera its side, taps it, and pours a little white powder into his gloved palm to show it.", b: "he shows a little white powder in his blue-gloved palm, the box in his other hand." }),
  S(22, "en la parte de los productos de lavandería", "bi", "st_laundryaisle", { q: "laundry detergent supermarket aisle", p: BI("A supermarket aisle with laundry products.") }),
  S(22, "No es lo mismo que el ácido bórico de las cucarachas", "bi", "b_twopowders", { p: BI(`${BORAX} next to a small plastic bag of boric acid powder with a plain label, side by side on a granite counter.`) }),
  S(23, "", "bi", "b_jars", { q: "small glass jars lids", p: BI("Three small clear glass baby-food jars with metal screw lids on a granite counter.") }),
  S(23, "Ya te explico para qué la tapa", "av", ""),
  S(24, "", "vl", "v_honesto", { a: `sits at the wooden kitchen table in ${KITCHEN}, ${STATION} on the table in front of him, forearms on the table, sincere.`, act: "He speaks calmly and honestly, holds up one finger, then shakes his head gently at the idea of instant results.", b: "he leans back a little, palms open on the table, sincere." }),
  S(24, "Y si tienes hormigas grandes, rojas, de las que pican", "bi", "st_fireants", { q: "fire ants mound", p: BI("A fire ant mound in a grass lawn.") }),
  S(24, "Esto es para la fila de hormiguitas de la cocina", "vl", "v_honesto2", { a: `sits at the wooden kitchen table in ${KITCHEN}, pointing at a line of tiny ants on the edge of the table.`, act: "He points at the little ants on the table with a small smile and nods.", b: "he nods at the camera, a small smile." }),
];
