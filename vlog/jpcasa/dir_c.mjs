// DIRECTOR C — jpcasa: cosas 8 (zapatos en la entrada), 9 (el basurero), 10 (el cajón de las verduras), 11 (el clóset cerrado + ventanas en
// cruz, la que une todas) + el patrón + repaso + mención 3 (regalo con QR a /r y el Método US$27) + pago del loop (lo que dijo Sato-san con
// la cortina en la mano) + gancho al video 5 (el frasco marrón que en Japón está en la cocina). Párrafos 41-63.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH } from "../claudio/lib.mjs";
import { H, SATOP, KITCHEN, BEDROOM, R } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jpcasa/";
export const SHOTS = [
  // ══ 8 · los zapatos en la entrada
  C(41, "", "ClRule", R(8, "Los zapatos en la entrada", "lo de afuera se queda afuera")),
  S(41, "la entrada de la casa está un escalón más abajo", "bi", "b_genkan", { q: "japanese entryway shoes genkan", p: BI("The entryway of a Japanese home: a lowered tiled floor with a few pairs of shoes neatly placed, one step up to a light-wood floor.") }),
  S(41, "Lo de afuera se queda afuera", "kf", "k_shoesoff", { p: BI("Close view of feet stepping out of a pair of shoes onto the lowered tiled entry of a Japanese home and stepping up onto the wood floor."), d1: "the feet stand in the shoes", d2: "the feet step out of the shoes and up", sound: "shoes slipped off on tile" }),
  S(42, "", "bi", "b_staffshoes", { q: "shoe cabinet", p: BI(`A wooden shoe cupboard with slatted doors in a staff room of ${HOTEL}, a small open box with lumps of black charcoal on a shelf.`) }),
  C(42, "Decía que el carbón se lleva el olor", "ClSato", { img: SATOP, quote: "El carbón se lleva el olor. El perfume se sienta encima." }),
  S(43, "", "bi", "b_shoepile", { q: "pile of shoes entrance", p: BI(`A messy pile of worn shoes and sneakers on the floor by the front door of ${HOUSE}.`) }),
  S(43, "Y la entrada casi nunca tiene ventana", "bi", "b_darkhall", { q: "narrow hallway entrance", p: BI("A narrow entrance hallway of a Latin American house with no window, a coat rack and shoes on the floor, lit by a ceiling bulb.") }),
  S(43, "Ése es el primer aire que respira la visita", "cl", "c_opendoor", { p: CLP(`He opens the front door of ${HOUSE} to a guest, smiling, a pile of shoes visible on the floor beside him.`) }),
  C(44, "", "ClNumbers", { title: "Los zapatos", rows: [["Se sacan", "en la puerta"], ["Van a", "un mueble con aire"], ["Adentro", "carbón activado, nada perfumado"], ["El mismo par", "nunca dos días seguidos"]], page: 12 }),
  S(44, "Una bolsita de carbón activado adentro", "bi", "b_charcoalbag", { q: "activated charcoal bag", p: BI("A small cloth bag of activated charcoal with a blank label placed inside a shoe cupboard between pairs of shoes.") }),

  // ══ 9 · el basurero
  C(45, "", "ClRule", R(9, "El basurero", "se lava, no sólo se vacía")),
  S(45, "los basureros de las habitaciones se lavaban", "bi", "b_hotelbins", { p: BI(`Several small room trash bins washed and drying upside down on a rack in the service area of ${HOTEL}.`) }),
  S(45, "Una vez. No hizo falta otra", "av", ""),
  S(46, "", "bi", "b_binundersink", { q: "kitchen trash bin", p: BI(`A plastic kitchen trash bin under the sink in ${KITCHEN}, a fresh bag in it.`) }),
  S(46, "Y en el fondo siempre queda algo", "bi", "b_bindirty", { q: "empty trash can", p: BI("Looking down into an empty plastic kitchen trash bin without its bag: a dark sticky puddle and a bit of peel stuck at the bottom.") }),
  S(46, "Eso fermenta", "cl", "c_binsmell", { p: CLP(`He lifts the bag out of a kitchen trash bin in ${KITCHEN} and turns his face away from the smell.`) }),
  S(47, "", "kf", "k_binwash", { p: BI(`Close view of ${H} scrubbing the inside of a plastic trash bin with a brush and soapy hot water in a sunny Latin American patio.`), d1: "the brush is inside the bin", d2: "the brush scrubs and soap foams", sound: "a brush scrubbing plastic with water" }),
  S(47, "se seca al sol", "bi", "b_binsun", { q: "plastic bin outdoors", p: BI("A clean plastic trash bin drying upside down in the sun on a patio tile floor.") }),
  S(47, "una cucharada de bicarbonato", "bi", "b_binsoda", { q: "trash can kitchen", p: BI("A spoonful of white baking soda being dropped into the bottom of an empty clean trash bin.") }),
  S(48, "", "bi", "b_jpsort", { q: "japanese trash sorting", p: BI("Several small labeled-free trash bins for sorting under a counter in a tidy Japanese kitchen.") }),

  // ══ 10 · el cajón de las verduras
  C(49, "", "ClRule", R(10, "El cajón de las verduras", "un platito con café")),
  S(49, "Sato-san tenía un platito con café molido", "bi", "b_coffeeplate", { p: BI("A small white saucer with ground coffee sitting in the back corner of an empty refrigerator vegetable drawer.") }),
  S(49, "Era a propósito", "av", ""),
  S(50, "", "bi", "b_crisper", { q: "refrigerator vegetable drawer", p: BI("An open refrigerator vegetable drawer with some tired lettuce, a soft onion and half a dried lemon.") }),
  S(50, "una hoja de lechuga pegada al fondo", "bi", "b_crisperwet", { q: "refrigerator vegetable drawer", p: BI("Close view of the bottom of a refrigerator vegetable drawer: a wilted lettuce leaf stuck in a little water.") }),
  S(50, "y pasa a todo lo demás", "cl", "c_fridgesmell", { p: CLP(`He opens a refrigerator in ${KITCHEN} and pulls back slightly, sniffing with a doubtful face.`) }),
  S(51, "", "kf", "k_drawerwash", { p: BI(`Close view of ${H} washing an empty clear refrigerator drawer in a kitchen sink with a sponge.`), d1: "the sponge touches the drawer", d2: "the sponge wipes the drawer clean", sound: "water and a sponge on plastic" }),
  C(51, "", "ClNumbers", { title: "El cajón de las verduras", rows: [["Una vez por semana", "vaciar y lavar"], ["Con", "agua y bicarbonato"], ["En el fondo", "un paño limpio"], ["En una esquina", "carbón o café molido"]], page: 12 }),
  S(51, "o un platito con café molido, en una esquina", "bi", "b_crisperclean", { q: "vegetables in refrigerator drawer", p: BI("A clean refrigerator vegetable drawer with fresh vegetables on a folded cloth, a small saucer of ground coffee in the corner.") }),

  // ══ 11 · el clóset cerrado (la que une todas)
  C(52, "", "ClRule", R(11, "El clóset cerrado", "la que une todas")),
  S(52, "Sato-san abría los armarios y las ventanas", "bi", "b_hotelwardrobe", { q: "hotel room wardrobe", p: BI(`An empty room of ${HOTEL} with the wardrobe doors open and the window open, light coming in.`) }),
  C(52, "una casa cerrada se pone vieja sola", "ClSato", { img: SATOP, quote: "Una casa cerrada se pone vieja sola." }),
  S(53, "", "bi", "b_closetfull", { q: "closet clothes crowded", p: BI(`A closed wardrobe in ${BEDROOM} opened to show clothes packed tightly, shoes piled at the bottom.`) }),
  C(53, "muchas veces pegado a una pared fría", "ClClosetAir", { mode: "closed" }),
  S(53, "a la oficina, al auto", "bi", "b_coatcar", { q: "man getting into car morning", p: BI("A man in a jacket getting into an ordinary car in the morning, only his back and arm in the frame.") }),
  C(54, "", "ClWardrobeGap", { label: "5 cm" }),
  S(54, "una bolsita de carbón activado adentro", "bi", "b_closetcharcoal", { q: "wardrobe hanging shirts", p: BI("A small cloth bag of activated charcoal with a blank label hanging from the rail inside a wardrobe between shirts.") }),
  C(54, "dos ventanas opuestas abiertas diez minutos", "ClCrossVent", {}),
  S(55, "", "kf", "k_crossvent", { p: BI(`The living room of ${HOUSE} in the morning with two opposite windows wide open, the thin curtains of both blowing inward and outward.`), d1: "the curtains hang still", d2: "a breeze blows the curtains across the room", sound: "a morning breeze through a room, birds outside" }),
  S(55, "el olor que se juntó durante la noche", "cl", "c_window", { p: CLP(`He opens a bedroom window wide in the morning in ${BEDROOM} and takes a deep breath of fresh air, eyes closed.`) }),

  // ══ el patrón + repaso
  S(56, "", "av", ""),
  S(56, "Es tela que nunca se lavó", "bi", "b_elevenfabric", { p: BI(`A curtain, a rug, a pillow, a bath mat, a towel and a pair of shoes laid out on the floor of ${HOUSE} in the sun.`) }),
  S(56, "Nada de eso es la edad", "bi", "b_oldhouse", { q: "old house exterior", p: BI("The front of an old but well-kept Latin American house with open windows on a sunny morning.") }),
  C(57, "", "ClSato", { img: SATOP, quote: "Lo que no respira, se pone viejo." }),
  S(58, "", "av", ""),
  S(58, "Las cortinas, a lavar cada tres meses", "bi", "r_curtain", { p: BI("Freshly washed curtains being hung back on a rod by a sunny window.") }),
  S(58, "Bicarbonato en la alfombra", "bi", "r_soda", { p: BI("White baking soda resting on a beige rug.") }),
  S(58, "Almohadas y cojines, al sol", "bi", "r_pillows", { p: BI("Pillows on a sunny balcony railing.") }),
  S(58, "El colchón destapado", "bi", "r_mattress", { p: BI("An uncovered mattress next to an open window in the morning.") }),
  S(58, "La alfombrita del baño, colgada", "bi", "r_mat", { p: BI("A bath mat hanging on the edge of a bathtub.") }),
  S(58, "Toallas secas antes de guardarlas", "bi", "r_towels", { p: BI("Dry folded towels on a wooden shelf.") }),
  S(58, "La goma de la lavadora, limpia", "bi", "r_gasket", { p: BI("A clean gray rubber door seal of a front-loading washing machine.") }),
  S(58, "Los zapatos en la puerta", "bi", "r_shoes", { p: BI("Shoes lined up neatly by a front door.") }),
  S(58, "El basurero lavado", "bi", "r_bin", { p: BI("A clean empty trash bin.") }),
  S(58, "El cajón de las verduras con café", "bi", "r_coffee", { p: BI("A saucer of ground coffee in a refrigerator drawer.") }),
  S(58, "Y el clóset separado de la pared", "bi", "r_closet", { p: BI("A wardrobe standing a hand's width away from a white wall.") }),

  // ══ mención 3 · el regalo + el Método
  S(59, "", "av", ""),
  S(59, "Empieza afuera", "bi", "b_outsidedoor", { q: "woman standing at front door", p: BI(`A woman standing outside the front door of ${HOUSE} on the step, breathing the outdoor air, the door ajar.`) }),
  S(59, "la almohada, la toalla y la puerta cerrada", "bi", "b_threetests", { p: BI(`A pillow, a folded towel and a closed bedroom door, arranged in one frame in ${HOUSE}.`) }),
  C(59, "Es gratis", "ClQRCard", { qr: I + "qr.jpg", cover: I + "x_gift.jpg", kicker: "EL TEST · GRATIS", text: "apunta la cámara aquí" }),
  S(59, "Y si quieres todas las reglas", "av", "", { ov: { c: "ClChip", props: { text: "El Método Japonés · US$27" } } }),

  // ══ el pago del loop + gancho al video 5
  S(60, "", "bi", "b_satocurtain2", { p: BI(`${SATO} standing by a window in a room of ${HOTEL} with a curtain hem in her hand, speaking calmly to someone off frame, other housekeepers in the doorway.`) }),
  C(60, "Claudio-san, limpiaste todo lo que se ve", "ClSato", { img: SATOP, quote: "Limpiaste todo lo que se ve. El olor vive en lo que no se lava." }),
  S(61, "", "cl", "c_agree", { p: CLP(`He nods slowly with a sheepish smile in ${HOUSE}, holding the hem of a curtain.`) }),
  S(61, "Un frasco marrón", "bi", "b_brownbottle", { q: "hydrogen peroxide bottle", p: BI(`A brown plastic bottle of 3% hydrogen peroxide with a plain blank white label standing on the counter of ${KITCHEN}, next to a cutting board.`) }),
  C(61, "En el próximo video", "ClVideoRef", { thumb: I + "th_jpagua.jpg", title: "16 usos del agua oxigenada en Japón", next: true }),

  // ══ cierre
  S(62, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Cuál de las 11 fuiste a oler?", sign: "— Claudio" } } }),
  S(63, "", "cl", "c_bye", { p: CLP(`He stands by an open sunny window in ${HOUSE} with a folded cloth over his shoulder, smiling warmly at the camera and raising a hand in goodbye.`) }),
  S(63, "Nos vemos en el próximo video", "av", ""),
];
