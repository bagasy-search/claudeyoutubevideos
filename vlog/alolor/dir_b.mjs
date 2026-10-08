// DIRECTOR B — alolor: lista + pasos (vaciar/vinagre, armar el tarro, ponerlo, la ropa, airear, a la semana; mención 2 pág. 14) +
// seguridad + el sábado en la casa de Doña Marta (la cartita del bolsillo, Tomás, la pared de atrás, el medio vaso) (párrafos 23-41).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
import { H, WARD, CLOTHES, NIECE, BOY } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/alolor/";
export const SHOTS = [
  C(23, "", "ClCheck", { title: "Lo que necesita", items: ["Cloruro de calcio en escamas", "Dos recipientes de plástico", "Vinagre blanco + trapo", "Bicarbonato", "Guantes"] }),
  C(24, "", "ClChapter", { n: 1, label: "PASO", title: "Vaciar y vinagre", sub: "una hora, un día abierto" }),
  S(24, "Rocíe vinagre en las paredes de adentro", "kf", "k_spray6", { p: BI(`Close view of a hand in a yellow rubber glove spraying white vinegar inside an empty old dark-wood wardrobe.`), d1: "the glove squeezes the spray toward the wardrobe wall", d2: "a mist of vinegar wets the inside wall and shelf", sound: "trigger spray squirts in a wooden cabinet" }),
  S(24, "y déjelo abierto un día entero", "bi", "b_wardopen", { p: BI(`${WARD} completely empty with both doors wide open, daylight from a window reaching inside.`) }),
  C(25, "", "ClChapter", { n: 2, label: "PASO", title: "Armar el tarro", sub: "½ kg de escamas" }),
  S(25, "con un clavo caliente o un taladro", "bi", "b_holes6", { p: BI(`Close view of ${H} making small holes in the bottom of a plastic container with a heated nail held in pliers.`) }),
  S(25, "eche medio kilo de escamas", "kf", "k_pour", { p: BI(`Close view of a hand in a rubber glove pouring white calcium chloride flakes from a bag into a plastic container with holes sitting on top of another container.`), d1: "the flakes start pouring from the bag", d2: "the top container fills with white flakes", sound: "flakes pouring into plastic" }),
  C(26, "", "ClDesiccant", { days: 1 }),
  S(26, "Y una caja de bicarbonato abierta en un estante", "bi", "b_bicarb", { q: "baking soda box", p: BI("An open small box of baking soda with a plain blank label on the shelf of a wardrobe next to folded sweaters.") }),
  S(27, "", "bi", "b_wetclothes", { q: "wet laundry", p: BI("A pile of damp freshly washed clothes about to be put into a wardrobe, a red X drawn with tape across the wardrobe door.") , ov: { c: "ClChip", props: { text: "Nunca húmeda", alert: true } } }),
  S(27, "El planchado larga vapor", "bi", "st_ironing", { q: "ironing shirt steam", p: BI("A steam iron pressing a shirt, steam rising.") }),
  S(28, "", "bi", "st_clothesline", { q: "clothes drying sun clothesline", p: BI("Clothes drying on a clothesline in the sun.") }),
  S(28, "La de color y los trajes, a la sombra", "bi", "b_shade", { q: "clothes hanging shade", p: BI("Old men's suits hanging on a line in the shade of a patio wall, the sunny part of the patio beside them.") }),
  S(28, "El sol y el aire seco son el mejor quitamanchas de moho", "av", ""),
  C(29, "", "ClDesiccant", { days: 7 }),
  S(29, "tire el agua por el inodoro", "bi", "b_toilet", { q: "pouring water toilet", p: BI("A hand pouring a little clear water from a plastic container into a toilet bowl.") }),
  C(30, "", "ClCheck", { title: "Cada cuánto", items: ["Escamas: cada 2 a 4 semanas", "Bicarbonato: cada 3 meses"] }),
  C(31, "", "ClBookPage", { page: I + "book_p14.jpg", pageNo: 14, qr: I + "qr.jpg", stamp: "Manual · página 14" }),
  C(32, "", "ClCheck", { title: "El arreglo entero", items: ["Vacío + vinagre, 1 hora", "Un día abierto", "Tarro con ½ kg + bicarbonato", "Ropa lavada o aireada", "A la semana: el agua"], fast: true }),
  S(33, "", "bi", "b_gloves", { q: "rubber gloves", p: BI("A pair of rubber gloves next to a bag of white flakes, kept on a high shelf out of reach, a child's toy on the floor far below.") , ov: { c: "ClChip", props: { text: "Lejos de chicos y mascotas", alert: true } } }),
  S(33, "No lo apoye sobre nada de metal", "bi", "b_rust", { q: "rust stain metal", p: BI("A rusty ring stain on a metal shelf where a container of salty water stood.") }),
  // ── el sábado
  S(34, "", "bi", "b_patiosat", { q: "clothesline patio", p: BI(`A small sunny patio of an old house on a Saturday morning with old men's suits and shirts hanging on a clothesline, ${MARTA} sitting on a plastic chair watching.`) }),
  S(34, "la sobrina las lavó a mano", "bi", "b_handwash", { q: "hand washing clothes sink", p: BI(`${NIECE} washing a white shirt by hand in a laundry sink with a bar of soap, in a patio.`), anim: "she scrubs the shirt collar with the soap" }),
  S(34, "Y el sombrero, en una silla, al aire", "bi", "b_hatchair", { q: "hat on chair", p: BI("A gray felt man's hat resting on a plastic chair in the shade of a small patio.") }),
  S(35, "", "bi", "b_jacketcheck", { p: BI(`${NIECE} checking the pockets of an old gray suit jacket before hanging it, in a patio.`) }),
  S(35, "encontró una cartita doblada", "kf", "k_unfold", { p: BI("Close view of a woman's fingers holding a small folded old yellowed piece of paper taken from a jacket pocket.") , d1: "the fingers hold the small folded paper", d2: "the paper unfolds showing old handwriting in blue ink", sound: "old paper unfolding" }),
  S(35, "flores para Marta", "bi", "b_note", { p: BI("Extreme close view of an old yellowed handwritten grocery list in blue ink, the last line underlined twice, slightly smudged.") }),
  S(36, "", "bi", "b_martacry", { p: BI(`${MARTA} sitting on a plastic chair in the patio reading a small old note, laughing and crying at the same time, a hand over her mouth.`) }),
  S(36, "Y la guardó en su libreta", "bi", "b_notebook6", { q: "old notebook pages", p: BI(`${MARTA}'s wrinkled hands placing a small old folded note between the pages of a worn little notebook.`) }),
  S(37, "", "cl", "c_spray6", { p: CLP(`He sprays white vinegar inside the empty open ${WARD.replace("an old", "old")}, a rag over his shoulder.`) }),
  S(37, "A la noche puse el tarro en el piso", "bi", "b_jarfloor", { p: BI("A homemade two-container dehumidifier jar with white flakes standing on the floor of an old wardrobe, a box of baking soda on the shelf above.") }),
  S(38, "", "bi", "b_tomasnail", { p: BI(`${BOY} carefully making holes in the bottom of a plastic container with a hot nail held in pliers, concentrating, an adult's hand nearby.`) }),
  S(38, "Tarro del abuelo", "bi", "b_lid", { p: BI("A plastic container lid with a child's handwriting in black marker on it, on a wooden table.") }),
  S(39, "", "cl", "c_wardgap", { p: CLP(`He pulls ${WARD.replace("an old", "the old")} a few centimeters away from the wall, checking the gap behind it with a yellow tape measure.`) }),
  C(39, "Lo separé cinco centímetros", "ClWardrobeGap", { label: "5 cm" }),
  S(40, "", "bi", "b_martacall", { p: BI(`${MARTA} on her phone in the hallway, excited, pointing at an open wardrobe.`) }),
  C(40, "En el recipiente de abajo había medio vaso de agua", "ClDesiccant", { days: 7 }),
  S(41, "", "cl", "c_cleanward", { p: CLP(`He stands at the open ${WARD.replace("an old", "old")} with clean suits and white shirts hanging neatly, breathing in with satisfaction.`) }),
  C(41, "Doña Marta metió la nariz en el saco gris", "ClClosetAir", { mode: "dry" }),
  S(41, "ahora huele a Ernesto. No a humedad", "bi", "b_martasmell", { p: BI(`${MARTA} smelling the sleeve of a gray suit jacket hanging in an open wardrobe, eyes closed, smiling.`) }),
];
