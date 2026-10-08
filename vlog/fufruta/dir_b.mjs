// DIRECTOR B — fufruta: la trampa de un vaso (vinagre, la gota, el cono, dónde, Bruno, la primera noche, contarlas) + la fábrica (los vasos
// boca abajo, la mañana, 7 en el fregadero, la rejilla con larvas, la papa podrida, Lucía) + cerrarla (agua caliente, cepillo, agua
// oxigenada, no mezclar, mención 2 pág. 12, 3 noches, cambiar el vaso, el trapo, el plato de Bruno, el ácido bórico en su tapita) (párr. 24-55).
import { S, BI, LUCIA, JORGE, KIDS, DOG } from "../claudio/lib.mjs";
import { H, KITCHEN, FLIES, BOWL, SINK, GLASS, SLIME } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fufruta/";
const BOTTLE = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
export const SHOTS = [
  C(24, "", "ClChapter", { n: 4, title: "Paso 1: la trampa de un vaso", sub: "vinagre, una gota y un cono" }),
  S(25, "", "vl", "v_pour", { a: `stands at the speckled granite counter in ${KITCHEN}, an empty clear drinking glass in front of him, holding a bottle of amber apple cider vinegar over it.`, act: "He pours a little amber vinegar into the glass, stops, and shows the camera two fingers held against the side of the glass to measure.", b: "he holds two fingers against the side of the glass that now has two fingers of amber vinegar in it." }),
  S(25, "No hace falta más", "bi", "b_twofingers", { q: "glass of vinegar", p: BI(`Close view of ${H} holding two fingers against the outside of a clear glass with two fingers of amber apple cider vinegar in it.`), ov: { c: "ClChip", props: { text: "50 ml" } } }),
  S(26, "", "kf", "k_soapdrop", { p: BI(`Close view of a clear glass with amber apple cider vinegar on a granite counter, ${H} holding a bottle of green dish soap tilted over it.`), d1: "a single drop of green dish soap forms at the bottle tip", d2: "the drop falls into the vinegar and spreads in a small ring", sound: "a tiny drip" }),
  S(26, "Aquí está el secreto", "vl", "v_secret2", { a: `stands at the granite counter in ${KITCHEN} next to a clear glass of amber vinegar, holding a bottle of green dish soap, leaning toward the camera.`, act: "He leans in conspiratorially, taps the side of the glass, and explains with his hand flat like the surface of the water.", b: "he holds his hand flat above the glass, palm down, eyebrows raised." }),
  S(26, "Sin detergente, la mosquita se para encima del vinagre", "c", "ClGlassTrap", { props: { mode: "soap" } }),
  S(27, "", "vl", "v_cone", { a: `stands at the granite counter in ${KITCHEN} holding a sheet of white paper, a clear glass with amber vinegar in front of him.`, act: "He rolls the paper into a cone like an ice cream cone, twists the tip and rests it in the mouth of the glass, tip down, talking while he does it.", b: `the paper cone rests in the mouth of the glass, tip down above the vinegar, he points at the tip.` }),
  S(27, "La punta abierta, del tamaño de un lápiz", "bi", "b_conetip", { p: BI(`Extreme close view of ${H} holding a yellow pencil next to the small open tip of a rolled white paper cone, comparing the size.`), ov: { c: "ClChip", props: { text: "Punta = un lápiz" } } }),
  S(28, "", "c", "ClGlassTrap", { props: { mode: "cone" } }),
  S(28, "Se quedan adentro, y al final caen", "bi", "b_flytrapped", { p: BI(`Extreme close view through the side of ${GLASS}: tiny fruit flies crawling on the inside of the glass under the paper cone, a few floating in the vinegar.`) }),
  S(29, "", "bi", "b_film", { q: "plastic wrap glass", p: BI(`Close view of ${H} stretching clear plastic kitchen wrap tight over a glass of amber vinegar.`) }),
  S(29, "con tres o cuatro agujeritos hechos con un palillo", "bi", "b_toothpick", { p: BI(`Extreme close view of ${H} poking a small hole in plastic wrap stretched over a glass with a wooden toothpick.`) }),
  S(30, "", "bi", "b_glassbowl", { q: "glass on table", p: BI(`${GLASS} placed on the wooden kitchen table right beside ${BOWL}.`) }),
  S(30, "otro al lado del fregadero", "bi", "b_glasssink", { q: "glass next to sink", p: BI(`${GLASS} on the granite counter beside ${SINK}.`) }),
  S(31, "", "vl", "v_bruno", { a: `stands at the back of the granite counter in ${KITCHEN}, placing ${GLASS} against the tiled wall, ${DOG} sitting on the floor beside him looking up.`, act: "He pushes the glass trap to the back of the counter against the wall, glances down at the dog and smiles, then looks back at the camera.", b: "he is looking down at the dog with a smile, the glass trap at the back of the counter against the wall." }),
  S(31, "Bruno, el perro, no llega", "bi", "b_brunolook", { p: BI(`${DOG} sitting on the kitchen floor looking up at the counter, the glass out of his reach.`) }),
  S(32, "", "bi", "b_sofiawatch", { p: BI(`Sofía, a 9-year-old Latin American girl with two braids, kneeling on a kitchen chair with her chin on her hands, watching a glass trap with a paper cone on the counter.`) }),
  S(32, "había doce adentro", "bi", "b_twelve", { p: BI(`Close view of ${GLASS} with about a dozen tiny fruit flies inside, some crawling on the glass, evening light.`), ov: { c: "ClChip", props: { text: "12 la primera hora" } } }),
  S(32, "Y a la mañana, el fondo del vaso estaba negro de mosquitas", "bi", "b_blackglass", { q: "glass of juice closeup", p: BI(`Morning, extreme close view of the bottom of a glass of amber vinegar covered with dozens of drowned tiny fruit flies.`) }),
  S(33, "", "vl", "v_contar", { a: `stands next to the old white refrigerator in ${KITCHEN}, a small handwritten paper note held by a magnet on the fridge door beside the children's drawings.`, act: "He taps the paper note on the fridge with one finger, explaining, then turns back to the camera and nods.", b: "he points at the paper note on the fridge door, looking at the camera, nodding." }),
  C(33, "Si el número baja, vas bien", "ClNotebook", { title: "El papelito", rows: [{ k: "Mañana 1", v: "30" }, { k: "Mañana 2", v: "18" }, { k: "Mañana 4", v: "5" }, { k: "Semana", v: "0" }], note: "si no baja, la fábrica sigue" }),
  C(34, "", "ClChapter", { n: 5, title: "Paso 2: encontrar la fábrica", sub: "la parte que nadie hace" }),
  // los vasos boca abajo
  S(35, "", "vl", "v_vasos", { a: `stands at ${SINK} in ${KITCHEN} at night, the warm ceiling bulb on, holding a clear drinking glass upside down over the drain.`, act: "He lowers the upside-down glass onto the drain so it covers it completely, then picks up a second glass from the counter and shows it to the camera.", b: "one glass sits upside down over the drain, he holds a second glass up, looking at the camera." }),
  S(35, "Otro sobre la rejilla del lavadero, si tienes", "bi", "b_laundrydrain", { p: BI("Night, an upside-down clear glass placed over a round floor drain grate in a small laundry area with a white washing machine.") }),
  S(35, "Y otro encima de la bolsa de las papas", "bi", "b_potatoglass", { p: BI("Night, an upside-down clear glass placed on top of an open brown paper bag of potatoes on the floor of a cabinet.") }),
  S(36, "", "c", "ClDrainFactory", { props: { mode: "cups" } }),
  S(36, "Atrapadas, caminando por el vidrio", "bi", "b_flyinglass", { p: BI("Extreme close view of tiny fruit flies walking on the inside wall of an upside-down drinking glass sitting over a sink drain, morning light.") }),
  S(37, "", "bi", "b_morningkitch", { q: "kitchen early morning", p: BI(`Early morning, ${KITCHEN} in soft blue light, nobody there yet, upside-down glasses on the sink drain.`) }),
  S(37, "Y con la linterna miramos los vasos", "vl", "v_manana", { a: `stands at ${SINK} in ${KITCHEN} in early morning light with ${LUCIA} in a robe beside him, a yellow flashlight in his hand pointed at an upside-down glass over the drain.`, act: "He shines the flashlight on the upside-down glass, bends to look, and turns to Lucía and the camera with raised eyebrows.", b: "he is bent over the sink shining the flashlight into the glass, Lucía leaning in beside him." }),
  S(38, "", "vl", "v_manana"),
  S(38, "tenía siete mosquitas adentro", "kf", "k_sevenflies", { p: BI(`Morning, extreme close view of an upside-down clear glass over the drain of ${SINK}, seven tiny fruit flies inside it, a flashlight beam on them.`), d1: "the tiny flies crawl around inside the upside-down glass", d2: "the flies keep crawling on the glass walls trying to get out", sound: "a faint tapping of tiny wings on glass" }),
  S(38, "Siete, en una sola noche", "c", "ClDrainFactory", { props: { mode: "cups" } }),
  // la rejilla
  S(39, "", "vl", "v_rejilla", { a: `bends over ${SINK} in ${KITCHEN} wearing blue nitrile gloves, lifting the round metal strainer out of the drain with two fingers.`, act: "He lifts the strainer out, makes a disgusted face, then shines the flashlight down into the drain and looks back at the camera, grimacing.", b: "he holds the dirty strainer up in one hand and the flashlight in the other, grimacing at the camera." }),
  S(39, "una capa marrón, babosa", "bi", "b_slime2", { q: "drain closeup", p: BI(`Extreme close view down into a kitchen drain with the strainer removed: ${SLIME}, a flashlight beam on it.`) }),
  S(39, "unos gusanitos blancos, chiquitos como un hilo", "kf", "k_larvae", { p: BI(`Extreme macro view of ${SLIME} with tiny white thread-like larvae on it, lit by a flashlight.`), d1: "the tiny white larvae wriggle slowly in the slime", d2: "the larvae keep wriggling", sound: "a faint wet sound" }),
  S(39, "Ahí estaba la fábrica", "c", "ClDrainFactory", { props: { mode: "larvae" } }),
  // la papa
  S(40, "", "bi", "b_cabinetopen", { q: "under sink cabinet", p: BI(`The open cabinet under ${SINK}: cleaning bottles, a curved drain pipe and a brown paper bag of potatoes on the cabinet floor.`) }),
  S(40, "En el fondo, una papa blanda, negra", "bi", "b_rottenpotato", { q: "rotten potato", p: BI(`Close view of ${H} in a nitrile glove holding up a soft black rotten potato oozing liquid, pulled from the bottom of a paper bag.`) }),
  S(40, "Encima, otra nubecita", "bi", "st_flies6", { q: "fruit flies", p: BI(`${FLIES} over a rotting potato.`) }),
  S(41, "", "bi", "b_luciamouth", { p: BI(`${LUCIA} in her kitchen covering her mouth with her hand, shocked, looking down at the open cabinet under the sink.`) }),
  S(41, "Y es verdad", "vl", "v_caño", { a: `crouches at the open cabinet under ${SINK} in ${KITCHEN}, one gloved hand on the curved drain pipe, looking up at the camera kindly.`, act: "He pats the drain pipe gently and speaks kindly, then makes a small gesture of washing the outside with his hand.", b: "he keeps one hand on the pipe, a gentle reassuring look at the camera." }),
  S(42, "", "bi", "b_towel2", { q: "kitchen towel", p: BI("A damp crumpled dish towel next to a kitchen sink, a tiny fly on it.") }),
  S(42, "la bolsa de reciclaje", "bi", "st_recycle2", { q: "recycling cans", p: BI("Empty cans in a recycling bag.") }),
  S(42, "el plato de la comida del perro", "bi", "b_dogbowlfood", { p: BI("A steel dog food bowl on a kitchen floor with leftover wet food, two tiny flies on its rim.") }),
  S(42, "y debajo del refrigerador", "bi", "b_underfridge", { q: "under refrigerator", p: BI("Night, a flashlight beam under an old white refrigerator: dust and a forgotten dried grape.") }),
  S(43, "", "bi", "st_cans", { q: "empty soda cans", p: BI("Empty soda cans.") }),
  S(43, "es una guardería de mosquitas", "bi", "b_canflies", { q: "empty soda can", p: BI("Extreme close view of the opening of an empty soda can lying in a recycling bag, tiny fruit flies crawling in and out.") }),
  S(43, "Las latas y las botellas se enjuagan", "bi", "st_rinsecan", { q: "rinsing can sink", p: BI("Hands rinsing an empty can under a running kitchen tap.") }),
  C(44, "", "ClChapter", { n: 6, title: "Paso 3: cerrar la fábrica", sub: "3 noches seguidas" }),
  S(45, "", "bi", "b_potatobin", { q: "plastic bag trash", p: BI(`Close view of ${H} in a nitrile glove dropping a rotten black potato into a plastic bag.`) }),
  S(45, "y afuera, a la basura de la calle", "bi", "st_streetbin", { q: "trash bin street", p: BI("A trash bin on a residential sidewalk.") }),
  S(45, "Y todas las papas y cebollas", "bi", "b_checkpotatoes", { q: "potatoes onions table", p: BI(`${LUCIA} sorting potatoes and onions one by one on the kitchen table, squeezing each to check.`) }),
  // agua caliente
  S(46, "", "vl", "v_caliente", { a: `stands at ${SINK} in ${KITCHEN} holding a steel pot of steaming hot water with a cloth around the handle.`, act: "He tilts the pot and pours the hot water slowly into the drain in a thin stream, steam rising, talking while he pours.", b: "he holds the pot tilted over the drain, steam rising, looking at the camera." }),
  S(46, "si tus caños son de plástico", "bi", "b_pvcpipe", { q: "pvc pipe under sink", p: BI("A white plastic PVC drain pipe under a kitchen sink.") , ov: { c: "ClChip", props: { text: "Caliente, no hirviendo", alert: true } } }),
  // cepillo
  S(47, "", "vl", "v_cepillo", { a: `bends over ${SINK} in ${KITCHEN} wearing blue nitrile gloves, pushing a long narrow bottle brush down into the open drain.`, act: "He scrubs up and down inside the drain with the bottle brush, firmly, then pulls it out and shows the camera the brown slime on the bristles.", b: "he holds up the bottle brush with brown slime on its bristles, grimacing at the camera." }),
  S(47, "Ahí está la capa babosa", "c", "ClDrainFactory", { props: { mode: "clean" } }),
  // agua oxigenada
  S(48, "", "bi", "b_bottlecounter", { q: "hydrogen peroxide bottle", p: BI(`${BOTTLE} on a granite counter next to a kitchen sink.`) }),
  S(48, "Un chorro despacio, por el borde del desagüe", "vl", "v_oxigenada", { a: `bends over ${SINK} in ${KITCHEN} holding ${BOTTLE} tilted over the drain.`, act: "He pours a slow stream of clear liquid around the rim of the drain, then leans in and listens, smiling, as it foams.", b: "he is leaning over the drain listening, smiling, the bottle upright in his hand." }),
  S(48, "Burbujea", "bi", "b_foam", { q: "foam bubbles sink", p: BI("Extreme close view of white foam bubbling up out of a kitchen sink drain.") }),
  S(48, "La dejas actuar toda la noche", "bi", "st_kitchennight", { q: "kitchen at night dark", p: BI("A dark quiet kitchen at night.") }),
  S(49, "", "vl", "v_nomezclar", { a: `stands at the granite counter in ${KITCHEN} holding ${BOTTLE} in one hand and a bottle of apple cider vinegar in the other, apart.`, act: "He holds the two bottles apart, shakes his head, moves them further apart, and puts the vinegar down on the far side of the counter.", b: "the two bottles stand far apart on the counter, he holds up one finger, serious." }),
  C(49, "Cada uno por su lado", "ClDoDont", { yes: { label: "Cada uno en su día", img: I + "x_apart.jpg" }, no: { label: "Juntos en un frasco", img: I + "x_mixed.jpg" } }),
  // mención 2
  S(50, "cuánto vinagre", "vl", "v_medidas", { a: `sits at the wooden kitchen table in ${KITCHEN} with a thick printed manual with a green cover open in front of him.`, act: "He runs his finger down a page of the manual, then turns it toward the camera.", b: "he holds the open manual toward the camera, pointing at a page." }),
  C(50, "", "ClBookPage", { page: I + "page12.jpg", pageNo: 12, stamp: "Las medidas, en la página" }),
  C(51, "", "ClCheck", { title: "3 noches seguidas", items: ["Agua bien caliente", "Cepillo por dentro", "Agua oxigenada por el borde"], fast: true }),
  S(51, "Porque las larvas que quedan escondidas", "bi", "b_larvaemacro2", { p: BI(`Extreme macro view of tiny white larvae hidden in a crevice of ${SLIME}.`) }),
  S(52, "", "bi", "b_oldglass", { q: "pouring liquid sink", p: BI(`Close view of ${H} emptying an old glass of dark vinegar full of drowned flies into the sink.`) }),
  S(52, "Vinagre nuevo, gota nueva", "bi", "b_newglass", { q: "pouring vinegar glass", p: BI(`Close view of ${H} pouring fresh amber apple cider vinegar into a clean glass.`) }),
  S(53, "", "bi", "b_towelhang", { q: "towel hanging kitchen", p: BI("A clean dish towel hanging spread out to dry on a rail beside a kitchen window.") }),
  S(53, "Un trapo húmedo y dulce también es una fábrica", "bi", "st_towelwet", { q: "wet dish towel", p: BI("A wet crumpled dish towel next to a sink.") }),
  S(54, "", "bi", "b_brunobowl", { p: BI(`${DOG} finishing his food from a steel bowl on the kitchen floor at night.`) }),
  S(54, "y el plato se lava", "bi", "st_washbowl", { q: "washing dog bowl", p: BI("Hands washing a steel dog bowl in a sink.") }),
  // el ácido bórico en su tapita (seguridad visible)
  S(55, "", "vl", "v_borico", { a: `kneels beside the old white refrigerator in ${KITCHEN}, pulled a little away from the wall, a yellow flashlight in his hand pointing behind it.`, act: "He shines the flashlight behind the fridge, nods approvingly, then turns to the camera and shows with his fingers how small and closed the cap is.", b: "he holds his thumb and finger close together showing a small cap, nodding, the flashlight still behind the fridge." }),
  S(55, "seguía ahí, cerrada, pegada contra la pared", "bi", "b_borcap", { p: BI("Night, a flashlight beam behind an old white refrigerator on a small closed white plastic cap taped to the floor against the wall, a few tiny holes in its side.") , ov: { c: "ClChip", props: { text: "Cerrada · lejos de niños y perro" } } }),
];
