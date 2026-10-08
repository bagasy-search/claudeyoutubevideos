// DIRECTOR A — fucasero (Claudio el Fumigador #6, "La casa de los Ramírez" ep. 6: las bolitas de los restaurantes): MINUTO 1 (la grieta
// detrás de la estufa llena de cucarachas + "el aerosol mata a la que ves" → la cucaracha grande al prender la luz, ¿otra vez? → loop: lo
// que Lucía guardaba con cariño → promesa (ácido bórico, harina y azúcar) + antes/después → credibilidad + la linterna → capítulo) + la casa
// (polaroid del ep. 5) + por qué el aerosol no alcanza + lo que necesitas (mención 1, pág. 14) + lo honesto (párrafos 0-23).
import { S, BI, LUCIA, JORGE, KIDS, DOG, HOUSE } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const H = "a pest-control technician's weathered tanned hands, the short sleeve of a light khaki work shirt at the edge of the frame";
export const KITCHEN = HOUSE;
export const ROACH = "a big shiny reddish-brown American cockroach";
export const STOVE = "an old white four-burner kitchen stove against the tiled wall";
export const BALLS = "small off-white dough balls the size of chickpeas";
export const STATION = "a small white plastic container with its lid closed, two pencil-sized holes in its side, taped down to the floor";
export const BORIC = "a small clear plastic bag of white boric acid powder with a plain blank label";
const I = "img/fucasero/";
export const SHOTS = [
  // ── 0:00 · lo que el aerosol no ve
  S(0, "", "kf", "k_spray", { p: BI(`Night, close view of a hand spraying an aerosol can of insecticide at ${ROACH} on a tiled kitchen floor next to a stove.`), d1: "the spray mist hits the cockroach on the floor", d2: "the cockroach flips over on its back, legs moving", sound: "an aerosol spray hiss", ov: { c: "ClStampOv", props: { text: "Y LAS OTRAS 50?" } } }),
  S(0, "a la cucaracha que ves", "bi", "st_roachspray", { q: "cockroach", p: BI(`${ROACH} on a floor.`) }),
  S(0, "Y deja vivas a las cincuenta que están detrás de tu estufa", "c", "ClRoachHide", { props: { mode: "hide" } }),
  S(0, "mirándote", "bi", "b_eyes", { q: "cockroach in crack", p: BI(`Night, extreme close view of the dark narrow gap behind ${STOVE}, a flashlight beam catching several cockroach antennae and shiny brown backs packed together.`) }),
  S(0, "Lo que sí llega hasta ellas cuesta centavos", "bi", "b_balls0", { q: "dough balls", p: BI(`Close view of ${H} in a blue nitrile glove holding ${BALLS} on a square of aluminum foil.`) }),
  S(0, "cuesta centavos", "bi", "st_coins", { q: "coins in hand", p: BI("A few coins in a hand.") }),
  S(0, "y lo haces con harina y azúcar", "bi", "st_flourbowl", { q: "flour sugar bowl", p: BI("A bowl of flour and a bowl of sugar on a kitchen counter.") }),
  // ── los Ramírez
  S(1, "", "bi", "b_kitchen0", { p: BI(`${KITCHEN} at night, the ceiling light just switched on, ${STOVE} on the right.`) }),
  S(1, "Una cucaracha grande, marrón", "kf", "k_run", { p: BI(`Night, close view of the tiled floor beside ${STOVE}, ${ROACH} running out from behind it.`), d1: "the cockroach runs out from behind the stove", d2: "the cockroach darts under the cabinet", sound: "a quick scuttle" }),
  S(1, "que salió de detrás de la estufa", "bi", "b_stovegap1", { p: BI(`Night, the dark gap beside ${STOVE}, a cockroach antenna poking out.`) }),
  S(1, "cuando prendimos la luz", "bi", "b_switch", { p: BI(`Close view of ${LUCIA}'s hand flipping on a light switch by a kitchen door at night.`) }),
  S(1, "Y Lucía, que ya había pasado por esto", "bi", "b_luciaagain", { p: BI(`${LUCIA} in her bright kitchen at night, hand on her forehead, exasperated, looking at the stove.`) }),
  S(1, "preguntó lo mismo que todos", "bi", "st_roach0", { q: "cockroach floor", p: BI(`${ROACH} on a kitchen floor.`) }),
  // ── el loop
  S(2, "", "kf", "k_stovepull", { p: BI(`Night, close view of two men's hands pulling an old white kitchen stove away from a tiled wall, a flashlight on the floor.`), d1: "the stove slides slowly away from the wall", d2: "a dark gap opens behind the stove", sound: "metal scraping on tile" }),
  S(2, "encontramos dónde vivían de verdad", "bi", "b_gap0", { q: "behind stove", p: BI(`Night, a flashlight beam into the gap behind a pulled-out stove: grease on the floor and a stack of gray cardboard egg cartons against the wall.`) }),
  S(2, "Algo que Lucía guardaba con cariño", "vl", "m2", { a: `crouches at night beside ${STOVE} pulled away from the wall in ${KITCHEN}, holding a yellow flashlight pointing into the gap behind it, looking back at the camera.`, act: "He keeps the beam in the gap behind the stove, turns to the camera, raises his eyebrows and whispers.", b: "he has one finger on his lips, the flashlight still in the gap, eyebrows raised." }),
  // ── la promesa
  S(3, "", "av", ""),
  S(3, "las bolitas caseras", "bi", "b_balls1", { p: BI(`${BALLS} on a square of aluminum foil on a granite counter.`) }),
  S(3, "que usamos en las cocinas de los restaurantes", "bi", "st_restaurant0", { q: "restaurant kitchen", p: BI("A busy restaurant kitchen.") }),
  S(3, "Ácido bórico, harina y azúcar", "c", "ClBoricBalls", {}),
  S(3, "Ellas se las comen", "bi", "b_roachball", { p: BI(`Night, extreme close view of ${ROACH} nibbling one of ${BALLS} on a square of aluminum foil.`) }),
  S(3, "se las llevan al escondite", "bi", "st_roachcrack", { q: "cockroach crack", p: BI(`${ROACH} going into a crack.`) }),
  S(3, "y seguras para una casa con niños y perro", "bi", "b_kidsdog0", { p: BI(`${KIDS} with ${DOG} in the kitchen, the dog sniffing at a small closed white container taped behind a cabinet.`) }),
  S(3, "Con las cantidades exactas", "bi", "b_spoons", { q: "measuring spoons flour", p: BI(`Three level tablespoons side by side on a granite counter: white powder, white flour and white sugar.`), ov: { c: "ClChip", props: { text: "Partes iguales" } } }),
  S(3, "Así estaba esa cocina", "bi", "b_before", { p: BI(`Night, ${KITCHEN}, ${ROACH} on the floor by the stove, dirty dishes in the sink.`), ov: { c: "ClChip", props: { text: "Antes", alert: true } } }),
  S(3, "Y así quedó", "bi", "b_after", { p: BI(`Night, ${KITCHEN} spotless under a flashlight beam, the floor clean, the sink dry, nothing on the floor.`), ov: { c: "ClChip", props: { text: "1 mes después" } } }),
  // ── credibilidad
  S(4, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de fumigador" } } }),
  S(4, "Treinta años de fumigador", "bi", "b_truck", { q: "pest control truck", p: BI("An old white pickup truck with a pest-control sprayer tank in its bed, parked on a residential street.") }),
  S(4, "Y al final te doy", "av", ""),
  S(4, "la revisión de diez minutos", "bi", "b_flashlight", { q: "turning on flashlight", p: BI(`Close view of ${H} switching on a yellow flashlight in a dark kitchen.`), ov: { c: "ClChip", props: { text: "$0 · 10 minutos" } } }),
  S(4, "con una linterna", "bi", "st_flashbeam", { q: "flashlight beam dark", p: BI("Night, a flashlight beam along a kitchen floor.") }),
  S(4, "para que sepas esta noche", "bi", "st_kitchennight0", { q: "dark kitchen night", p: BI("A dark kitchen at night.") }),
  S(4, "qué bicho tienes", "bi", "st_roachmacro", { q: "cockroach macro", p: BI("Extreme close view of a cockroach head and antennae.") }),
  S(4, "y por dónde entra", "bi", "st_drain0", { q: "floor drain", p: BI("A floor drain grate.") }),
  C(5, "", "ClChapter", { n: 1, title: "La estufa de los Ramírez", sub: "¿otra vez?" }),
  // ── la casa
  C(6, "", "ClVideoRef", { thumb: I + "th_fuhormiga.jpg", title: "El cebo que se lleva el nido", tag: "VIDEO ANTERIOR" }),
  S(6, "si no la viste, te la dejo aquí", "av", ""),
  S(7, "", "vl", "v_noche", { a: `stands in ${KITCHEN} at night next to ${LUCIA}, who has her hand on the light switch by the door, both just back from the patio.`, act: "Lucía flips on the light; he turns sharply toward the stove and points at the floor.", b: "he points at the floor beside the stove, Lucía beside him with a hand over her mouth." }),
  S(7, "de casi cuatro centímetros", "bi", "b_ruler", { q: "ruler closeup", p: BI(`Extreme close view of ${ROACH} on a tiled floor next to a small ruler showing it is almost four centimeters long.`), ov: { c: "ClChip", props: { text: "casi 4 cm" } } }),
  S(7, "y se metió debajo del mueble del fregadero", "bi", "st_roachcabinet", { q: "cockroach under cabinet", p: BI(`${ROACH} running under a kitchen cabinet.`) }),
  S(8, "", "bi", "b_luciaask", { p: BI(`${LUCIA} in her kitchen at night, arms open, frustrated, asking.`) }),
  S(8, "Y era una buena pregunta", "vl", "v_otra", { a: `stands beside the old white refrigerator in ${KITCHEN} at night, one hand on its side, looking at the camera.`, act: "He pats the refrigerator, explaining that the small ones behind it are gone, then shows with his fingers a much bigger size.", b: "he holds his thumb and finger wide apart to show a big size, serious." }),
  S(9, "", "bi", "st_sewer", { q: "storm drain street", p: BI("A storm drain grate in a street.") }),
  S(9, "Entra a la casa por los desagües", "bi", "st_roachdrain", { q: "cockroach drain", p: BI(`${ROACH} crawling out of a drain.`) }),
  S(9, "por debajo de las puertas", "bi", "b_doorgap", { q: "gap under door", p: BI("Night, the gap under a back door to a patio, a flashlight beam on it.") }),
  S(9, "Y detrás de una estufa hay las tres cosas", "vl", "v_tres", { a: `stands beside ${STOVE} in ${KITCHEN} at night, one hand resting on the stovetop.`, act: "He counts dark, warm and food on three fingers, tapping the stove on the last one.", b: "he taps the stove, an amused dry look." }),
  S(10, "", "bi", "b_jorge", { p: BI(`${JORGE} in his kitchen at night spraying an aerosol can at the floor near the stove, shrugging.`) }),
  S(10, "Pero una por semana", "vl", "v_pista", { a: `crouches beside ${STOVE} in ${KITCHEN}, a yellow flashlight in his hand, looking at the camera like a detective.`, act: "He raises one finger, then points the flashlight at the gap behind the stove, nodding knowingly.", b: "the flashlight beam is on the gap behind the stove, he nods." }),
  S(11, "", "bi", "b_sofia", { p: BI(`Sofía, a 9-year-old Latin American girl with two braids, in the kitchen doorway in pajamas, eyes wide, pointing up at something flying.`) }),
  S(11, "las grandes, a veces, vuelan", "bi", "st_roachfly", { q: "flying cockroach", p: BI("A cockroach with its wings open.") }),
  S(11, "Y eso asusta más que cualquier otra cosa", "bi", "b_sofiacover", { p: BI(`Sofía, a 9-year-old Latin American girl with two braids, covering her head with her arms in the kitchen, half laughing, half scared.`) }),
  S(12, "", "vl", "v_regla", { a: `stands in ${KITCHEN} in daylight, arms crossed, serious, looking at the camera.`, act: "He uncrosses his arms and holds up one finger, then points down at the floor by the stove on 'siempre'.", b: "he points at the floor, dead serious." }),
  S(12, "es la que no encontró lugar en el escondite", "bi", "st_roachday", { q: "cockroach daylight", p: BI(`${ROACH} on a kitchen wall in daylight.`) }),
  C(13, "", "ClChapter", { n: 2, title: "Por qué el aerosol no alcanza", sub: "es importante" }),
  // ── por qué
  S(14, "", "bi", "st_crack", { q: "crack in kitchen wall", p: BI("A crack in a kitchen wall.") }),
  S(14, "Detrás de la estufa, debajo del refrigerador", "c", "ClRoachHide", { props: { mode: "hide" } }),
  S(14, "Salen de noche a comer, y vuelven", "bi", "st_roachnight", { q: "cockroach at night", p: BI(`${ROACH} at night on a counter.`) }),
  S(15, "", "c", "ClRoachHide", { props: { mode: "spray" } }),
  S(15, "El problema no se termina", "vl", "v_esconde", { a: `stands beside ${STOVE} in ${KITCHEN} holding a plain aerosol can of insecticide, frowning at it.`, act: "He shakes his head at the can, puts it down on the counter, and slowly points into the gap behind the stove.", b: "he points into the gap behind the stove, eyebrows raised." }),
  S(16, "", "bi", "b_ballfoil", { q: "dough ball", p: BI(`Night, one of ${BALLS} on a small square of aluminum foil behind a stove, a flashlight beam on it.`) }),
  S(16, "Ahí adentro mueren", "c", "ClRoachHide", { props: { mode: "bait" } }),
  S(17, "", "bi", "b_boricpowder", { q: "white powder dish", p: BI(`Close view of white boric acid powder in a small dish next to ${BORIC} on a granite counter.`) }),
  S(17, "Se les pega a las patas", "bi", "st_roachlegs", { q: "cockroach legs closeup", p: BI("Extreme close view of cockroach legs.") }),
  S(17, "Y mezclado con harina y azúcar", "vl", "v_borico", { a: `stands at the granite counter in ${KITCHEN} with ${BORIC}, a bag of flour and a bag of sugar lined up in front of him.`, act: "He touches each of the three bags in turn, then holds up a store-bought bait box and shrugs, smiling.", b: "he holds up a small plain bait box next to the three bags, smiling." }),
  S(18, "", "bi", "st_restaurant", { q: "restaurant kitchen", p: BI("A busy commercial restaurant kitchen with ovens and steel counters.") }),
  S(18, "esto era lo que ponía detrás de cada máquina", "bi", "st_kitchenmachines", { q: "industrial kitchen oven", p: BI("Industrial kitchen ovens and steel machines.") }),
  S(18, "Y si funciona en un restaurante", "vl", "v_restaurante", { a: `leans on the granite counter in ${KITCHEN}, relaxed, smiling at the camera.`, act: "He nods confidently, taps the counter twice and points at the camera.", b: "he points at the camera with a confident smile." }),
  C(19, "", "ClChapter", { n: 3, title: "Lo que necesitas", sub: "poco y en cualquier lado" }),
  // mención 1
  S(20, "", "bi", "st_pharmacy", { q: "pharmacy counter", p: BI("The counter of a small neighborhood pharmacy.") }),
  S(20, "una bolsita de ácido bórico en polvo, harina y azúcar", "bi", "b_counteritems", { q: "flour sugar bags", p: BI(`On a store counter: ${BORIC}, a bag of flour and a bag of sugar.`) }),
  C(20, "Y en casa, un poco de leche", "ClNotebook", { title: "Lo que pides", rows: [{ k: "Ác. bórico", v: "1 bolsita" }, { k: "Harina", v: "común" }, { k: "Azúcar", v: "blanca" }, { k: "Y leche", v: "un chorrito" }], note: "La frase exacta · pág. 14" }),
  C(20, "En el Manual te dejé esa frase escrita", "ClBookPage", { page: I + "page14.jpg", pageNo: 14, stamp: "La frase, en la página" }),
  S(21, "", "vl", "v_bolsa", { a: `stands at the granite counter in ${KITCHEN} holding ${BORIC} in one hand and a small white box of borax in the other.`, act: "He lifts the box of borax and sets it aside shaking his head, then holds the bag of boric acid up to the camera and taps it.", b: "he holds the bag of boric acid up beside his face, nodding." }),
  S(22, "", "bi", "st_flour", { q: "bag of flour", p: BI("A bag of flour on a counter.") }),
  S(22, "Y el azúcar, la blanca", "bi", "st_sugar", { q: "white sugar", p: BI("White sugar in a bowl.") }),
  S(23, "", "vl", "v_honesto", { a: `sits at the wooden kitchen table in ${KITCHEN}, a small dish of ${BALLS} on the table in front of him, sincere.`, act: "He speaks calmly and honestly, shakes his head gently at the idea of instant results, then holds up a finger.", b: "he holds up one finger, sincere." }),
  S(23, "Y no matan los huevos", "bi", "st_ootheca", { q: "cockroach egg case", p: BI("A brown cockroach egg case close up.") }),
  S(23, "Por eso las bolitas se dejan semanas", "vl", "v_semanas", { a: `sits at the wooden kitchen table in ${KITCHEN} with a small dish of ${BALLS}, a paper wall calendar behind him.`, act: "He points back at the calendar on the wall, then taps the dish of balls patiently.", b: "he taps the dish, calm and patient." }),
];
