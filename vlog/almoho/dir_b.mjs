// DIRECTOR B — almoho: el ropero (el dibujo negro + la foto de Don Ernesto) → de dónde sale el agua → la lista + la frase del mostrador
// → los 6 pasos (mención 2 del Manual, página 9) → nunca con cloro → lo que se hizo en la casa de Doña Marta y el llamado del pintor
// (párrafos 22-44).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
import { H, ROOM, WALL, WARD, PAINTER, NIECE } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/almoho/";
export const SHOTS = [
  // ── el ropero
  S(22, "", "cl", "c_pushward", { p: CLP(`He and ${NIECE} push ${WARD} away from the wall of ${ROOM}, straining, sliding it slowly over the red terracotta floor.`), anim: "they push the heavy wardrobe slowly away from the wall" }),
  S(22, "de los que pesan como un auto", "bi", "b_wardfeet", { p: BI(`Close view of the carved wooden feet of ${WARD} scraping across red terracotta floor tiles as it is moved.`) }),
  S(22, "centímetro a centímetro", "av", ""),
  S(23, "", "bi", "b_outline", { p: BI(`A pale mint-green plastered bedroom wall where a big wardrobe has just been moved away: a large black mold stain in the exact rectangular shape of the wardrobe, with a sharp edge, the wall clean around it, the wardrobe pulled out at the edge of the frame.`), ov: { c: "ClStampOv", props: { text: "LA FORMA DEL ROPERO" } } }),
  S(23, "como si alguien lo hubiera pintado con un pincel", "bi", "b_outlineedge", { p: BI("Extreme close view of the sharp straight edge of a black mold stain on a pale mint-green plaster wall, like a line drawn with a brush.") }),
  S(23, "Ahí el aire no se movía nunca", "av", ""),
  C(23, "se hacía agua", "ClWardrobeGap", { label: "0 cm" }),
  S(24, "", "bi", "b_photowall", { p: BI("An old black-and-white wedding photograph stuck to a damp plaster wall behind a wardrobe, its paper covered in small gray mold dots and curled at the corners.") }),
  S(24, "Doña Marta y su marido", "bi", "b_wedding", { p: BI("An old black-and-white photograph of a young Latin American couple on their wedding day in front of a church, the paper stained with gray mold dots at the edges.") }),
  S(24, "Ella la había buscado por toda la casa", "bi", "b_martasearch", { p: BI(`${MARTA} kneeling to look under a sofa in her old living room with a flashlight, searching for something.`) }),
  S(25, "", "bi", "b_martaphoto", { p: BI(`${MARTA} standing in ${ROOM} holding an old wedding photograph in both hands, looking at it in silence, her eyes wet.`), anim: "she slowly lifts the photograph closer to her face" }),
  S(25, "Claudio, a esta pared la arreglamos bien", "av", ""),
  // ── de dónde salía el agua
  S(26, "", "av", ""),
  S(26, "Doña Marta secaba la ropa en ese mismo dormitorio", "bi", "b_dryrack", { p: BI(`A folding clothes drying rack full of wet laundry standing next to the bed in ${ROOM}, the window closed and fogged.`) }),
  S(26, "Cocinaba con las ollas destapadas", "bi", "st_potsteam", { q: "pot boiling steam kitchen", p: BI("An uncovered pot boiling on a gas stove in a small kitchen, thick steam rising.") }),
  S(26, "Dormía con la ventana cerrada", "bi", "b_windowfog", { p: BI("The inside of a closed wooden window with white iron bars, its glass fogged with condensation and drops running down, early morning.") }),
  C(26, "suelta casi un vaso de agua por noche", "ClHygrometer", { peak: 82, end: 74 }),
  S(27, "", "bi", "st_steam", { q: "steam window condensation", p: BI("Steam and condensation forming on a cold window pane, droplets running down.") }),
  S(27, "La de afuera, la que da a la sombra", "bi", "b_shadewall", { p: BI("The outside of an old house wall on the shady side, damp and darker at the bottom, moss along the base, no sun.") }),
  S(27, "Y ahí aparece el moho, siempre en el mismo lugar", "bi", "b_corner", { p: BI(`Close view of the top corner of ${ROOM} where the wall meets the ceiling, a band of black mold along the cold corner.`) }),
  // ── la lista
  C(28, "", "ClChapter", { n: 2, title: "El arreglo", sub: "matar el moho y sacarle el agua" }),
  C(29, "", "ClCheck", { title: "Lo que necesita", items: ["Vinagre blanco, puro", "Cepillo plástico y trapo", "Mascarilla N95", "Anteojos y guantes", "Pintura antihongos"] }),
  S(30, "", "bi", "b_counter", { p: BI("The counter of an ordinary neighborhood hardware store: a bottle of white vinegar, a white N95 mask in its bag and a can of white paint with a plain label on the counter, shelves behind.") }),
  S(30, "Anótela tal cual", "av", ""),
  C(31, "", "ClPores3D", { mode: "peroxide", labels: { liquid: "Vinagre", roots: "Llega a la raíz" } }),
  S(31, "Es barato", "bi", "st_vinegarpour", { q: "pouring vinegar", p: BI("White vinegar being poured from a bottle into a spray bottle on a kitchen counter.") }),
  // ── los pasos
  S(32, "", "cl", "c_mask", { p: CLP(`He puts on a white N95 mask in ${ROOM}, safety glasses pushed up on his forehead, yellow rubber gloves on, the window open behind him.`) }),
  S(32, "suelta esporas", "bi", "b_sporesair", { p: BI("A beam of window sunlight in a bedroom showing fine dust particles floating in the air in front of a moldy wall.") }),
  S(33, "", "kf", "k_spray", { p: BI(`Close view of a hand in a yellow rubber glove spraying white vinegar from a trigger spray bottle onto ${WALL}.`), d1: "the glove squeezes the trigger toward the mold", d2: "the vinegar mist wets the black mold and a band of clean wall around it", sound: "trigger spray squirts" }),
  S(33, "un palmo más alrededor", "bi", "b_palm", { p: BI(`Close view of an open hand with spread fingers held flat beside the edge of a black mold stain on a pale mint-green wall, measuring a hand's width beyond it.`) }),
  C(33, "más o menos una taza", "ClMeasureCup", { fill: 1, label: "1 taza · 240 ml", where: "por metro cuadrado" }),
  C(34, "", "ClTimer30", { minutes: 60, label: "1 hora", text: "sin enjuagar" }),
  S(34, "El vinagre necesita ese tiempo", "bi", "b_wetwall", { p: BI(`${WALL} glistening wet with vinegar, drops running slowly down over the black mold, a spray bottle on the floor.`) }),
  S(35, "", "bi", "b_brush", { p: BI(`Close view of a hand in a yellow rubber glove gently brushing a wet moldy plaster wall with a plastic-bristle brush, gray foam lifting.`), anim: "the brush moves gently in small strokes" }),
  C(35, "las siembra en otra pared", "ClSpores", { img: I + "b_stainfull.jpg", spots: [{ x: 0.2, y: 0.15, label: "el techo" }, { x: 0.82, y: 0.3, label: "la cortina" }, { x: 0.15, y: 0.6, label: "el ropero" }] }),
  S(35, "pase un trapo apenas húmedo", "bi", "b_cloth", { p: BI(`Close view of a hand in a yellow rubber glove wiping a now pale cleaned plaster wall with a well-wrung damp cloth.`) }),
  S(36, "", "av", ""),
  S(36, "deje secar la pared dos días", "bi", "b_windowopen", { p: BI(`The tall wooden window of ${ROOM} wide open in the morning, a lace curtain moving in the breeze, the cleaned wall corner drying beside it.`), ov: { c: "ClChip", props: { text: "2 días" } } }),
  S(36, "La pared tiene que quedar seca por dentro", "bi", "b_drywall", { p: BI("Extreme close view of dry, pale, matte plaster on a wall corner, faint gray shadows where the mold was, no shine of moisture.") }),
  S(37, "", "kf", "k_paint", { p: BI(`Close view of a paint roller with white paint rolling over a clean dry pale plaster wall corner in ${ROOM}.`), d1: "the roller touches the dry clean wall", d2: "the roller covers the corner with an even bright white coat", sound: "a paint roller rolling on a wall" }),
  S(37, "con cuatro horas entre una mano y la otra", "bi", "b_paintcan", { p: BI("An open can of white paint with a plain label and a wooden stirring stick across it on a drop cloth, a paint roller tray beside it, a wall clock on the wall.") , ov: { c: "ClChip", props: { text: "2 manos · 4 h" } } }),
  S(37, "La pintura antihongos trae un veneno suave", "av", ""),
  // mención 2 del Manual
  C(38, "", "ClBookPage", { page: I + "book_p9.jpg", pageNo: 9, qr: I + "qr.jpg", stamp: "Manual · página 9" }),
  C(39, "", "ClCheck", { title: "El arreglo entero", items: ["Aluminio 48 h", "Vinagre puro + un palmo", "1 hora, sin enjuagar", "Cepillo suave · 2 días secando", "2 manos de antihongos"], fast: true }),
  C(40, "", "ClNeverMix", { a: "Vinagre", b: "Cloro", verdict: "Nunca" }),
  S(40, "Si la semana pasada usó cloro en esa pared", "bi", "b_rinse", { p: BI(`A hand rinsing a plaster wall with a sponge and a bucket of clean water in ${ROOM}.`) }),
  // ── lo que se hizo en la casa de Doña Marta
  S(41, "", "av", ""),
  S(41, "La sobrina abría la ventana cada mañana", "bi", "b_nieceopen", { p: BI(`${NIECE} opening the tall barred wooden window of ${ROOM} in the morning light.`) }),
  S(41, "Al tercer día pinté dos manos de antihongos blanca", "cl", "c_painting", { p: CLP(`He paints the corner of ${ROOM} with a paint roller on an extension pole, the wall now bright clean white, ${WARD} moved to the middle of the room and covered with a sheet.`), anim: "he rolls the paint up the wall" }),
  S(42, "", "av", ""),
  S(42, "Le puse dos tacos de madera atrás", "bi", "b_blocks", { p: BI(`Close view of two small wooden blocks screwed to the back edge of ${WARD}, holding it a few centimeters away from a clean white wall.`) }),
  S(42, "El tendedero se fue al pasillo", "bi", "b_rackhall", { p: BI("A clothes drying rack with laundry standing in the hallway of an old house next to an open window, red terracotta floor.") }),
  S(42, "Y la ventana del dormitorio", "bi", "b_windowmorning", { p: BI(`The barred wooden window of ${ROOM} open in the morning, a kitchen timer on the windowsill, cold blue morning light.`), ov: { c: "ClChip", props: { text: "10 minutos" } } }),
  S(43, "", "bi", "b_niececall", { p: BI(`${NIECE} smiling while talking on her phone in front of a clean white bedroom wall.`) }),
  C(43, "Me dijo: blanca", "ClBeforeAfter", { before: I + "b_stainfull.jpg", after: I + "b_stainfull_ab.jpg", note: "dos semanas después" }),
  S(43, "Y mi tía ya no tose a la mañana", "bi", "b_martatea", { p: BI(`${MARTA} sitting in a sunny kitchen in the morning drinking tea from a cup, smiling, relaxed.`) }),
  S(44, "", "bi", "b_painterphone", { p: BI(`${PAINTER} calling on his cell phone from inside a small white work van, a paint roller on the dashboard.`) }),
  S(44, "Ella le dijo que no hacía falta", "bi", "b_martahangs", { p: BI(`${MARTA} hanging up an old corded wall phone with a satisfied little smile in her kitchen.`) }),
  S(44, "Que ya había venido un albañil", "av", ""),
];
