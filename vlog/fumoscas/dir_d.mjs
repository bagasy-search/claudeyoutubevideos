// DIRECTOR D — fumoscas: PREGUNTAS (57-64) + RESULTADO 3 días (65-68) + REVISIÓN de la noche (69-72) +
// CTA regalo + Manual (73) + gancho mosquitos (74-75) + cierre (76-77). bi = agnes-image · cl = agnes-image 2.5-flash · c = componente.
import { S, BI, CLP, LUCIA, JORGE, KIDS, DOG, HOUSE } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const H = "a 58-year-old man's weathered tanned hands, the cuff of a light khaki work shirt at the edge of the frame";
export const HG = "a 58-year-old man's weathered tanned hands in thin blue nitrile gloves, the cuff of a light khaki work shirt at the edge of the frame";
const KITCHEN = HOUSE;
const FLY = "a large blue-green blowfly"; const FLIES = "three large blue-green blowflies";
const LEMON = "a halved lemon studded with whole brown cloves"; const CLOVE = "whole brown cloves";
const WINDOW = "a white kitchen window with iron bars and daylight coming through"; const TAPE = "a yellow sticky fly ribbon";
const BASIL = "a small potted basil plant with green leaves"; const TRASH = "a small kitchen trash bin with a plastic bag";
const I = "img/fumoscas/";
export const SHOTS = [
  // ── preguntas rápidas ──
  S(57, "", "bi", "d_qa0", { p: BI(`${KITCHEN} with the lemon, basil and ribbon in place, as if ready to answer questions`) }),
  C(58, "", "ClAsk", { q: "¿El vinagre sirve?" }),
  S(58, "Para limpiar la encimera, sí", "bi", "d_vinegar_yes", { p: BI(`${H} wiping a kitchen counter with a cloth and a spray bottle of vinegar`) }),
  S(58, "Para ahuyentarlas, no", "bi", "d_vinegar_no", { p: BI(`${FLY} landing on a counter right after it was wiped with vinegar`) }),
  S(58, "se evapora y a la media hora no queda nada", "bi", "d_vinegar_evap", { p: BI(`a kitchen counter with a wet streak of vinegar drying up`) }),
  S(58, "duran días", "bi", "d_lemon_days", { p: BI(`${LEMON} and ${BASIL} on a windowsill, still fresh days later`) }),
  C(59, "", "ClAsk", { q: "¿Y el aceite esencial de clavo?" }),
  S(59, "unas gotas en un algodón", "bi", "d_oil_cotton", { p: BI(`close view of ${H} dropping clove essential oil onto a cotton ball`) }),
  S(59, "cuesta más y se evapora antes", "bi", "d_oil_evap", { p: BI(`a small glass bottle of clove oil beside a few coins and a cotton ball`) }),
  S(59, "más barato y dura más", "bi", "d_lemon_cheap", { p: BI(`${LEMON} beside a jar of ${CLOVE}, cheaper and longer-lasting`) }),
  C(60, "", "ClAsk", { q: "¿Las trampas eléctricas de luz azul?" }),
  S(60, "Funcionan, pero hay que limpiarlas", "bi", "d_zapper", { p: BI(`a blue-light electric insect trap on a wall, a few dead flies in its tray`) }),
  S(60, "gastan luz", "bi", "d_zapper_plug", { p: BI(`an electric fly trap plugged into a wall outlet, its blue light glowing`) }),
  S(60, "la cinta amarilla alcanza y no gasta nada", "bi", "d_tape_cheap", { p: BI(`${TAPE} hanging in a kitchen, catching a fly`) }),
  C(61, "", "ClAsk", { q: "¿La mosquita de la fruta es lo mismo?" }),
  S(61, "Esa es más chica", "bi", "d_fruit_fly", { p: BI(`a tiny fruit fly on a ripe banana, much smaller than a blowfly`) }),
  S(61, "sale de la fruta madura", "bi", "d_fruit_ripe", { p: BI(`fruit flies rising from an overripe banana in a bowl`) }),
  S(61, "guardando la fruta y limpiando el bote", "bi", "d_fruit_fix", { p: BI(`fruit placed in the refrigerator and a clean trash bin with a tied bag`) }),
  C(62, "", "ClAsk", { q: "¿Cuántos limones necesito?" }),
  S(62, "Uno por cada ventana que abres", "bi", "d_lemon_each", { p: BI(`a lemon half on each of two windowsills`) }),
  S(62, "Con un limón salen dos mitades", "bi", "d_halves", { p: BI(`${H} holding a lemon cut into two halves, showing both`) }),
  S(62, "con dos limones cubres cuatro ventanas", "bi", "d_four", { p: BI(`four lemon halves on four windowsills in a row`) }),
  C(63, "", "ClAsk", { q: "¿Y si no tengo ventana que se abra?" }),
  S(63, "en la ventana de la luz", "bi", "d_fixed_window", { p: BI(`${BASIL} and ${LEMON} on the sill of a closed window that lets in light`) }),
  S(63, "la cinta cerca de la luz del techo", "bi", "d_tape_light2", { p: BI(`${TAPE} hanging near a ceiling light fixture`) }),
  S(63, "El olor trabaja igual", "bi", "d_smell_works", { p: BI(`${FLY} turning away from a windowsill with lemon and basil, even with the window closed`) }),
  C(64, "", "ClAsk", { q: "¿A los gatos y a los perros les molesta?" }),
  S(64, "No", "bi", "d_pet_ok", { p: BI(`${DOG} and a cat sitting calmly near a ${LEMON} on a windowsill`) }),
  S(64, "colgada alta, como te dije", "bi", "d_tape_high2", { p: BI(`${TAPE} hanging high near the ceiling, far above a cat`) }),
  // ── capítulo 8 ──
  C(65, "", "ClChapter", { n: 8, title: "Tres días después", sub: "la cocina de los Ramírez" }),
  S(66, "", "bi", "d_return", { p: BI(`${KITCHEN} three days later, clean, bright, and calm`) }),
  S(66, "La basura se sacaba todos los días", "bi", "d_trash_ok", { p: BI(`${TRASH} with a fresh tied bag, clean`) }),
  S(66, "El bote lavado", "bi", "d_bin_clean", { p: BI(`a clean plastic trash bin, no stains, in the kitchen`) }),
  S(66, "Dos medios limones con sus clavos", "bi", "d_two_lemon", { p: BI(`two lemon halves with cloves, one on each windowsill`) }),
  S(66, "La albahaca en la ventana del fregadero", "bi", "d_basil_sink", { p: BI(`${BASIL} on the windowsill above the kitchen sink`) }),
  S(66, "una cinta colgada cerca de la luz", "bi", "d_tape_light3", { p: BI(`${TAPE} hanging near the kitchen light`) }),
  S(67, "", "bi", "d_enter", { p: BI(`${JORGE} and ${LUCIA} in their clean kitchen, smiling, no flies anywhere`) }),
  S(67, "tres días, y ni una", "cl", "d_jorge_quote", { p: CLP(`he smiles warmly, holding up three fingers`) }),
  S(67, "se pegaba en la cinta", "bi", "d_tape_caught", { p: BI(`${TAPE} with a couple of small flies stuck on it`) }),
  S(67, "se daba la vuelta", "bi", "d_fly_turn2", { p: BI(`${FLY} turning away from the window with lemon and basil`) }),
  S(68, "", "bi", "d_all", { p: BI(`a jar of ${CLOVE}, ${BASIL}, ${TAPE} and a lemon laid out on the kitchen counter`) }),
  S(68, "Menos de lo que cuesta un aerosol", "bi", "d_cost", { p: BI(`the items beside a few coins, cheaper than a red aerosol can set aside`) }),
  S(68, "sin una gota de veneno", "cl", "d_no_venom", { p: CLP(`he spreads his hands over the clean counter, smiling, nothing else needed`) }),
  // ── capítulo 9 ──
  C(69, "", "ClChapter", { n: 9, title: "La revisión de la noche", sub: "diez minutos con la linterna" }),
  S(70, "", "bi", "d_dark", { p: BI(`${KITCHEN} in total darkness, only the outline of the window`) }),
  S(70, "prendes la linterna de golpe", "bi", "d_flashlight", { p: BI(`a yellow flashlight beam snapping on in a dark kitchen`), anim: `a yellow flashlight beam flicks on in the dark kitchen` }),
  S(70, "miras hacia dónde van", "bi", "d_flies_beam", { p: BI(`${FLIES} scattering in the flashlight beam near the window`) }),
  C(71, "", "ClDoDont", { yes: "Moscas chicas → basura y bote", no: "Moscas grandes → algo muerto" }),
  S(71, "es el olor: basura todos los días", "bi", "d_small_fix", { p: BI(`small flies around a trash bin and a fruit bowl`) }),
  S(71, "moscas grandes cerca de la ventana o del desagüe", "bi", "d_big_near", { p: BI(`${FLIES} near a window and a patio drain`) }),
  S(71, "si no ves nada, perfecto", "bi", "d_nothing", { p: BI(`${KITCHEN} clean and empty, no flies, the flashlight beam still`) }),
  S(72, "", "bi", "d_flour", { p: BI(`a thin line of white flour sprinkled on a kitchen floor at night`) }),
  S(72, "cinta doble faz", "bi", "d_tape_double", { p: BI(`a strip of double-sided tape laid on the floor near a wall`) }),
  // ── CTA ──
  S(73, "", "c", "ClQRCard", { props: { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "Antes de Fumigar: la revisión de la noche", kicker: "GRATIS" } }),
  S(73, "toca el primer link de la descripción", "bi", "d_phone", { p: BI(`a hand holding a phone pointing at a QR code on a printed sheet`) }),
  S(73, "el Manual del Fumigador está en esa misma página", "c", "ClQRCard", { props: { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "Manual del Fumigador: 66 arreglos", kicker: "US$27" } }),
  S(73, "sesenta y seis arreglos", "bi", "d_book", { p: BI(`${KITCHEN} with the book cover visible on the counter`) }),
  S(73, "te devuelven el dinero", "bi", "d_guarantee", { p: BI(`a close view of the book cover with a seven-day money-back badge`) }),
  // ── gancho mosquitos ──
  S(74, "", "bi", "d_night_leave", { p: BI(`night, ${JORGE} pointing at a bedroom wall, ${H} beside him`) }),
  S(74, "la pared del dormitorio de los niños", "bi", "d_kid_wall", { p: BI(`a children's bedroom wall with a small night light, a faint shadow on it`) }),
  S(75, "", "bi", "d_mosquito", { p: BI(`a thin mosquito resting on a white wall, its legs long`) }),
  S(75, "parada en la pared", "bi", "d_mosquito_wall", { p: BI(`close view of a thin mosquito on a bedroom wall, backlit`) }),
  S(75, "sin espiral ni aerosol", "bi", "d_spiral", { p: BI(`a mosquito coil and a red aerosol can set aside on a shelf`) }),
  S(75, "cómo sacar los mosquitos de la casa", "c", "ClVideoRef", { props: { thumb: I + "th_fumosquito.jpg", title: "Los mosquitos, sin espirales ni aerosol", next: true } }),
  // ── cierre ──
  S(76, "", "cl", "d_ask", { p: CLP(`he looks at the camera with a warm open face, one hand raised as if asking`) }),
  S(76, "¿Ya probaste el limón con clavos?", "bi", "d_lemon_final", { p: BI(`${LEMON} on a windowsill, close and warm`) }),
  S(76, "¿Cuántas moscas entran a tu cocina en verano?", "bi", "d_flies_summer", { p: BI(`${FLIES} near an open kitchen window in summer light`) }),
  S(76, "Escríbemelo en los comentarios. Leo todos.", "bi", "d_comments", { p: BI(`a phone in a hand showing a comment box, thumb typing`) }),
  S(77, "", "bi", "d_clean_end", { p: BI(`${KITCHEN} clean and still at dusk, the lemon and basil in the window, no flies`) }),
  S(77, "Sin basura, sin olor, sin moscas.", "bi", "d_final", { p: BI(`${TRASH} with a tied bag, ${LEMON} in the window, no flies`), ov: { c: "ClChip", props: { text: "Sin basura, sin olor, sin moscas" } } }),
  S(77, "Nos vemos la semana que viene.", "cl", "d_bye", { p: CLP(`he smiles and raises a hand in a small wave, standing by the kitchen window`) }),
];
