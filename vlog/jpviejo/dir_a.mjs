// DIRECTOR A — jpviejo (Claudio en Japón #2, "Lo que aprendí en Tokio"): MINUTO 1 (la grilla de la miniatura cobra vida + "todos lo
// huelen menos tú" → Sato-san y las almohadas lavadas delante de las chicas de piso (loop: lo que dijo del huésped) → bañarse no
// alcanza → promesa 11 reglas + la 7 → credibilidad + el test) + polaroid del video 1 + reglas 1 (kareishu), 2 (los 4 lugares),
// 3 (el jabón, mención 1 del Método pág. 10). Párrafos 0-21.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jpviejo/";
export const H = "a man's hands with tanned skin, the sleeve of a plain red polo shirt at the edge of the frame";
export const MAID = "Japanese hotel housekeeping staff in dark navy uniforms with white collars";
export const SATOP = I + "x_sato.jpg";
export const SHOTS = [
  // ── 0:00 · la miniatura cobra vida
  C(0, "", "ClGridHook", { bed: I + "x_thumbbg.jpg", tiles: [1, 2, 3, 4, 5, 6].map((k) => I + `x_t${k}.jpg`), words: ["por esto hueles a", "viejo"], every: 8 }),
  // ── las almohadas lavadas
  S(1, "", "bi", "b_room", { q: "japanese hotel room bed", p: BI(`A small, freshly cleaned room of ${HOTEL}: white bed perfectly made, two pillows, morning light through thin blinds, a housekeeping cart at the door.`) }),
  S(1, "Sato-san me hizo sacar las almohadas", "bi", "b_satopillows", { p: BI(`${SATO} standing by a hotel bed pointing at the pillows, a man's arms in a red polo shirt lifting two white pillows off the bed.`) }),
  S(1, "delante de las otras chicas de piso", "bi", "b_maids", { q: "hotel housekeeping staff", p: BI(`Three ${MAID} standing in the doorway of a hotel room watching quietly, one holding folded sheets.`) }),
  S(1, "Estaban lavadas", "bi", "b_cleanpillow", { q: "white pillow bed", p: BI("Close view of a white pillow in a crisp white pillowcase on a hotel bed, perfectly smooth.") }),
  S(1, "Me hizo olerlas una por una", "bi", "b_sniffpillows", { p: BI("A man in a red polo shirt seen from the side holding a white pillow up to his face and smelling it in a hotel room, two more pillows on the bed.") }),
  S(1, "Y lo que me dijo de ese huésped", "av", ""),
  // ── se bañaba
  S(2, "", "bi", "b_guestshower", { q: "hotel bathroom shower", p: BI(`The bathroom of ${HOTEL}: a shower with a used towel folded on the rail, a small bar of soap and two tiny bottles on the shelf.`) }),
  S(2, "Se bañaba dos veces por día", "bi", "b_twotowels", { p: BI("Two used white hotel towels hanging on a bathroom rail, damp, a used bath mat on the floor.") , ov: { c: "ClChip", props: { text: "2 veces por día" } } }),
  S(2, "ni con más desodorante", "bi", "b_deoshelf", { q: "deodorant", p: BI("A deodorant stick and a spray deodorant with plain blank labels on a bathroom shelf next to a sink.") }),
  S(2, "ni con más perfume", "bi", "b_cologne", { q: "perfume bottle", p: BI("A bottle of men's cologne with a plain blank label on a bathroom shelf, a hand reaching for it.") }),
  // ── la promesa
  S(3, "", "av", ""),
  S(3, "se cumplen después de los cuarenta", "bi", "b_jpelder", { q: "elderly japanese man walking", p: BI("An older Japanese man in his sixties in a neat cardigan walking calmly along a quiet Tokyo residential street in the morning.") }),
  S(3, "y que nosotros rompemos sin saberlo", "bi", "b_unmade", { p: BI(`An unmade double bed with yellowed pillows and a heavy closed curtain in a dim bedroom of a Latin American home, a chair with clothes piled on it.`) }),
  S(3, "Casi ninguna cuesta dinero", "bi", "b_soapcoins", { p: BI("A plain bar of soap, a small box of baking soda with a blank label and a few coins on a light-wood bathroom shelf.") , ov: { c: "ClChip", props: { text: "$0" } } }),
  S(3, "Y la número siete", "bi", "b_cologne7", { p: BI("Close view of a man's hand spraying cologne from a bottle with a blank label onto his neck, a fine mist in the air.") , ov: { c: "ClChip", props: { text: "REGLA 7", alert: true } } }),
  S(3, "Yo también la rompía", "cl", "c_guilty2", { p: CLP(`He stands in ${HOUSE}, holding a small cologne bottle with a blank label and shrugging guiltily at the camera.`) }),
  // ── credibilidad + test
  S(4, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "15 años de conserje en Tokio" } } }),
  S(4, "cambiando almohadas, sábanas y toallas", "bi", "b_cart", { q: "housekeeping cart linen", p: BI(`A housekeeping cart in a corridor of ${HOTEL} stacked with folded white sheets, pillowcases and towels.`) }),
  S(4, "de miles de huéspedes", "bi", "b_corridor", { q: "hotel corridor doors", p: BI(`A long corridor of ${HOTEL} with many identical doors, a do-not-disturb hanger on one handle.`) }),
  S(4, "Y al final te dejo el test de cinco minutos", "bi", "b_pillowtest", { p: BI(`A Latin American man in his fifties in ${HOUSE} bending over his bed and smelling the center of a pillow without its case, curious.`) }),
  S(4, "para saber a qué huele tu casa", "bi", "b_brighthome", { q: "bright living room window", p: BI(`${HOUSE}: a living room in the morning with a window open and the curtain moving.`) }),
  S(4, "sin que nadie te lo tenga que decir", "av", ""),
  // ── el video 1
  C(5, "", "ClVideoRef", { thumb: I + "th_jphigiene.jpg", title: "Las 11 reglas de higiene" }),
  S(6, "", "bi", "b_paper", { p: BI("A small piece of white paper with a single handwritten Japanese word in black ink on a hotel staff room table, next to a cup of green tea.") }),

  // ══ REGLA 1 · no es la axila
  C(7, "", "ClRule", { n: 1, title: "No es la axila", sub: "el olor tiene nombre" }),
  S(7, "por qué olían así las almohadas", "bi", "b_oldpillow", { p: BI("Close view of an old white pillow without its case, faint yellowish stains near one edge, on a hotel bed.") }),
  S(7, "me escribió una palabra en un papel", "bi", "b_satowrite", { p: BI(`${SATO} writing on a small notepad with a pen in a hotel staff room, seen at desk height, her face calm.`) }),
  C(7, "kareishu", "ClSato", { img: SATOP, quote: "Kareishu: el olor de la edad.", role: "la palabra de Sato-san" }),
  C(8, "", "ClAges", {}),
  S(9, "", "bi", "b_oldoil", { q: "used frying oil", p: BI("Close view of old dark cooking oil left in a frying pan on a stove, cloudy and thick.") }),
  S(9, "No es falta de baño", "av", ""),
  S(10, "", "bi", "b_uncle", { p: BI(`A Latin American man in his sixties combing his wet hair in front of a bathroom mirror in a modest home, a cologne bottle with a blank label on the sink.`) }),
  S(10, "y la almohada de su cama olía igual", "bi", "b_unclepillow", { p: BI("A single bed in a modest Latin American bedroom with an old pillow showing a faint yellow mark, a crucifix on the wall.") }),
  S(11, "", "bi", "b_strongdeo", { q: "deodorant spray", p: BI("Several deodorant sprays and sticks with blank labels lined up on a bathroom shelf, all with plain blank labels.") }),
  S(11, "La regla japonesa es mover el jabón a otro lugar", "cl", "c_movesoap", { p: CLP(`He stands in ${BATH} holding up a bar of soap and pointing with it to the back of his own neck, explaining to the camera.`) }),

  // ══ REGLA 2 · los cuatro lugares
  C(12, "", "ClRule", { n: 2, title: "Los cuatro lugares", sub: "la nuca se lava como la cara" }),
  S(12, "Sato-san tenía cincuenta y tantos", "bi", "b_satowalk", { p: BI(`${SATO} walking briskly down a hotel corridor with a clipboard, upright and neat.`) }),
  C(12, "la nuca se lava como la cara", "ClSato", { img: SATOP, quote: "La nuca se lava como la cara." }),
  C(13, "", "ClBodyMap", { title: "Los 4 lugares" }),
  S(13, "No te puedes oler ahí", "cl", "c_cantsmell", { p: CLP(`He twists his head trying to smell his own shoulder and the back of his neck in ${HOUSE}, failing, with a funny frustrated face.`) }),
  S(14, "", "bi", "b_fingerear", { p: BI("Close view of a man's finger pressing firmly behind his ear, short curly gray-black hair around it.") }),
  S(14, "y huélelo", "cl", "c_sniffinger", { p: CLP(`He brings his index finger to his nose and smells it with a serious, curious face in ${HOUSE}.`) }),
  S(14, "es lo que siente el que se sienta a tu lado", "bi", "b_bus", { q: "people sitting bus", p: BI("Two passengers in their fifties sitting side by side on a city bus seat in Latin America, one discreetly turning his face toward the window.") }),
  S(15, "", "av", ""),
  C(15, "Después de los cuarenta, son veinte", "ClDryBars", { title: "Cuánto frotar cada lugar", rows: [{ label: "Antes de los 40", h: 10, good: true }, { label: "Después de los 40", h: 20 }], unit: "s", max: 20 }),
  S(15, "No el agua que corre por encima", "kf", "k_napesoap", { p: BI(`Close view from behind of a man at a bathroom sink rubbing soap foam on the back of his neck with his fingers, a red polo collar folded down.`), d1: "fingers with soap on the back of the neck", d2: "the fingers rub in small circles", sound: "soap lather on skin" }),
  S(16, "", "bi", "b_orderwash", { p: BI("A man at a bathroom sink seen from the side lathering soap on his chest through an open shirt collar, a small towel on his shoulder.") }),
  S(16, "Para la espalda", "bi", "b_backbrush", { q: "bath brush", p: BI("A long-handled wooden bath brush and a white nylon body towel hanging on hooks by a window in a bright bathroom.") }),

  // ══ REGLA 3 · el jabón (mención 1)
  C(17, "", "ClRule", { n: 3, title: "El jabón", sub: "el naranja del vestuario" }),
  S(17, "había un jabón naranja, translúcido", "kf", "k_orangesoap", { p: BI("Close view of a translucent orange bar of soap on a light-wood soap dish by a hotel staff washroom sink, water drops on it."), d1: "the orange soap rests on the dish", d2: "a drop of water slides down the soap", sound: "a quiet washroom, a drip" }),
  S(17, "Era de caqui", "bi", "b_persimmon", { q: "persimmon fruit", p: BI("Ripe orange persimmons on a light-wood table next to a translucent orange bar of soap.") }),
  S(18, "", "bi", "b_jpdrugstore", { q: "japanese pharmacy shelves", p: BI("The bright shelves of a small Japanese drugstore with soaps and body care products in plain packaging with no readable text.") }),
  S(18, "El caqui tiene una sustancia", "bi", "b_persimmoncut", { p: BI("A persimmon cut in half on a wooden board, its orange flesh glistening, a knife beside it.") }),
  S(19, "", "av", ""),
  C(19, "Lo que necesitas es un jabón en barra", "ClDoDont", { yes: { label: "Barra que saca la grasa", img: I + "b_plainsoap.jpg" }, no: { label: "Cremoso que deja capa", img: I + "b_creamysoap.jpg" } }),
  // mención 1 · Método pág. 10
  S(20, "", "bi", "b_shoplist", { p: BI("A handwritten shopping list on a small notepad on a light-wood table next to a bar of soap, a folded pillowcase and a box of baking soda with a blank label.") , ov: { c: "ClChip", props: { text: "Método · pág. 10" } } }),
  S(20, "y casi siempre es algo que ya tienes", "bi", "b_cupboard", { p: BI("An open kitchen cupboard with a box of baking soda with a blank label, and a stack of clean pillowcases on a shelf beside it.") }),
  S(20, "En la tienda, pide así", "bi", "b_counter", { q: "pharmacy counter", p: BI("The counter of an ordinary neighborhood store: a plain bar of soap, a folded white pillowcase and a box of baking soda with blank labels.") }),
  C(20, "necesito un jabón en barra", "ClCheck", { title: "Lo único que hay que comprar", label: "MÉTODO · PÁG. 10", items: ["Jabón en barra que saque la grasa", "Una funda de almohada extra", "Bicarbonato", "Cepillo para el cuero cabelludo (opcional)"] }),
  S(21, "", "kf", "k_lather", { p: BI(`Close view of ${H} working up a thick white lather from a plain bar of soap under a running tap.`), d1: "the hands rub the soap under the tap", d2: "a thick white lather covers the hands", sound: "water and soap lather" }),
  S(21, "y recién después enjuagas", "bi", "b_rinse", { p: BI(`Water running from a tap in ${BATH} onto soapy hands, foam washing away into the sink.`) }),
];
export const EXTRA = [
  { name: "b_plainsoap", prompt: "A plain white bar of soap with no label on a light-wood soap dish in a bright bathroom, clean and matte." },
  { name: "b_creamysoap", prompt: "A pink creamy moisturizing soap bar with a glossy surface on a ceramic dish, a creamy film around it." },
];
