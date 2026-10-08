// DIRECTOR C — jphigiene: reglas 8 (lengua), 9 (pelo), 10 (comida), 11 (lo que la nariz no alcanza) + las 3 preguntas + repaso +
// mención 3 (regalo "¿A qué huele tu casa?" con QR a /r y el Método US$27) + gancho al video 2 (el olor de después de los 40) + cierre.
// Párrafos 41-64.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH } from "../claudio/lib.mjs";
import { H, SATOP } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jphigiene/";
const KITCHEN = "a small bright Latin American kitchen with white tiles, light-wood cabinets and a window";
export const SHOTS = [
  // ══ REGLA 8 · la lengua
  C(41, "", "ClRule", { n: 8, title: "La lengua", sub: "el aliento no viene de los dientes" }),
  S(41, "En el comedor del personal", "bi", "b_canteen", { q: "staff canteen lunch", p: BI(`The staff canteen of ${HOTEL}: long tables, trays with bowls of rice and miso soup, staff in navy uniforms eating.`) }),
  S(41, "todos iban al lavabo a enjuagarse la boca", "bi", "b_rinsemouth", { p: BI("A row of sinks in a hotel staff washroom, two Japanese employees in navy uniforms rinsing their mouths with water from paper cups.") }),
  S(41, "Yo era el único que volvía directo a trabajar", "cl", "c_sheepish", { p: CLP(`He shrugs with a sheepish smile in ${HOUSE}, one hand on the back of his neck.`) }),
  S(42, "", "bi", "b_tonguewhite", { p: BI("Close view of a person sticking out their tongue in front of a bathroom mirror, a faint white coating on the back of the tongue.") }),
  S(42, "El cepillo casi no la toca", "bi", "b_toothbrush", { q: "brushing teeth mirror", p: BI("Close view of a toothbrush with paste in a cup by a bathroom sink, morning light.") }),
  S(42, "Y el enjuague con sabor a menta", "bi", "b_mouthwash", { q: "mouthwash bottle", p: BI("A bottle of green mouthwash with a blank white label and a small cup on a bathroom shelf.") , ov: { c: "ClChip", props: { text: "20 min" } } }),
  S(43, "", "av", ""),
  S(43, "Simplemente se queda un poquito más lejos", "bi", "b_distance", { p: BI(`A Latin American couple in their fifties talking in ${KITCHEN}, the woman listening kindly but leaning her head slightly back and away.`) }),
  S(44, "", "kf", "k_scraper", { p: BI("Close view of a hand holding a stainless steel tongue scraper in front of a bathroom mirror, about to use it."), d1: "the hand lifts the tongue scraper", d2: "the scraper moves forward from the back of the tongue", sound: "a quiet bathroom in the morning" }),
  C(44, "tres pasadas suaves", "ClNumbers", { title: "La lengua, cada mañana", rows: [["Raspador", "antes de cepillarte"], ["Pasadas", "3, suaves, de atrás hacia adelante"], ["Sin raspador", "el borde de una cuchara"], ["Después de comer", "un buche de agua"]], page: 9 }),
  S(44, "el borde de una cuchara", "bi", "b_spoon", { p: BI("A clean metal spoon resting on the edge of a white bathroom sink next to a toothbrush cup.") }),
  S(44, "un buche de agua", "bi", "b_glasswater", { q: "glass of water kitchen", p: BI(`A glass of water on the counter of ${KITCHEN} next to a plate with leftovers from lunch.`) }),

  // ══ REGLA 9 · el pelo
  C(45, "", "ClRule", { n: 9, title: "El pelo", sub: "guarda todo lo que cocinas" }),
  S(45, "comimos carne a la parrilla", "bi", "b_yakiniku", { q: "yakiniku grill restaurant", p: BI("A small Tokyo grilled-meat restaurant at night: a table grill with sizzling slices of beef, smoke rising, hotel staff in casual clothes around it.") }),
  S(45, "A la mañana, Sato-san pasó a mi lado", "bi", "b_satopass", { p: BI(`${SATO} walking past a man in a red polo shirt in a hotel corridor in the morning, turning her head slightly toward him.`) }),
  C(45, "anoche comiste carne", "ClSato", { img: SATOP, quote: "Anoche comiste carne." }),
  S(45, "Me olió el pelo", "cl", "c_sniffhair", { p: CLP(`He pulls a lock of his own curly hair toward his nose in ${HOUSE} and sniffs it with a surprised face.`) }),
  S(46, "", "bi", "b_smokehair", { q: "grill smoke", p: BI("Smoke from a table grill drifting through the air of a small restaurant toward the hair of a woman sitting at the table.") }),
  S(46, "y el olor de la cocina", "bi", "b_hairmacro", { p: BI("Extreme close view of strands of dark curly hair against light, fine fibers visible.") }),
  S(47, "", "kf", "k_fryingpan", { p: BI(`A frying pan with hot oil and onions sizzling on the stove of ${KITCHEN}, the extractor hood above it switched off, the door closed.`), d1: "onions sizzle in the pan", d2: "smoke rises past the switched-off hood", sound: "sizzling oil in a frying pan" }),
  S(47, "Cuando alguien te abraza", "bi", "b_hug", { q: "hug greeting", p: BI(`Two Latin American friends in their fifties hugging hello in ${HOUSE}, one face resting near the other's hair.`) }),
  S(48, "", "bi", "b_hoodon", { q: "kitchen extractor hood", p: BI(`A hand switching on the extractor hood above a stove in ${KITCHEN} before a pan is heated, the window open.`) }),
  S(48, "el pelo atado mientras cocinas", "bi", "b_hairtied", { p: BI(`A Latin American woman with her hair tied back in a bun stirring a pot in ${KITCHEN}, the window open behind her.`) }),
  S(48, "nunca mojado a la almohada", "bi", "b_wetpillow", { p: BI("A white pillow on a bed with a damp dark patch where wet hair rested, morning light.") }),
  S(48, "El champú en seco no lava", "bi", "b_dryshampoo", { p: BI("A can of dry shampoo spray with a plain blank label on a bathroom shelf, a little white powder dust around it.") , ov: { c: "ClStampOv", props: { text: "TAPA", alert: true } } }),

  // ══ REGLA 10 · lo que comes
  C(49, "", "ClRule", { n: 10, title: "Lo que comes", sub: "sale por la piel" }),
  S(49, "una comida casera con mucho ajo", "bi", "b_garlicfood", { q: "garlic cooking", p: BI("A homemade Latin American dish in a plastic lunch container, full of garlic and onion, the lid open in a staff locker room.") }),
  S(49, "Abrió la ventana del vestuario", "kf", "k_window", { p: BI(`${SATO} opening a window of a hotel staff locker room with one hand, daylight coming in.`), d1: "her hand on the closed window latch", d2: "the window opens and the curtain moves", sound: "a window sliding open, distant city" }),
  S(50, "", "bi", "b_garlic", { q: "garlic cloves", p: BI("Close view of peeled garlic cloves and a red onion on a light-wood cutting board, a knife beside them.") }),
  C(50, "hasta dos días después", "ClDays", { label: "el ajo del domingo sigue en tu piel el martes" }),
  S(50, "Y el cepillo de dientes no llega ahí", "av", ""),
  S(51, "menos carne roja", "bi", "b_jpmeal", { q: "japanese home meal", p: BI("A simple Japanese home meal on a light-wood table: rice, grilled fish, miso soup, pickles and a cup of green tea.") }),
  S(51, "mucho té verde", "kf", "k_tea", { p: BI("Green tea being poured from a small iron teapot into a ceramic cup on a light-wood table, steam rising."), d1: "the teapot tilts toward the cup", d2: "green tea fills the cup with steam", sound: "tea pouring into a cup" }),
  S(51, "hay hasta calcetines tratados con té", "bi", "b_teasocks", { p: BI("A pair of pale green cotton socks folded on a store shelf next to a small cup of green tea leaves.") }),
  S(52, "", "cl", "c_garlicyes", { p: CLP(`He holds up a garlic bulb in ${HOUSE}, smiling at the camera and shaking his head no as if to say he will never give it up.`) }),
  S(52, "si tienes algo importante", "bi", "b_interview", { q: "job interview handshake", p: BI("A Latin American man in a white shirt shaking hands with an interviewer in a bright office.") }),
  S(52, "Y mucha agua, y té verde", "bi", "b_waterbottle", { p: BI(`A glass of water and a cup of green tea side by side on a light-wood table in ${HOUSE}.`) }),

  // ══ REGLA 11 · lo que tu nariz no alcanza
  S(53, "", "av", ""),
  S(53, "Pasa un dedo por detrás de tu oreja", "bi", "b_fingerear", { p: BI("Close view of a man's finger pressing behind his ear, short curly gray-black hair around it.") }),
  S(53, "Te espero", "av", "", { ov: { c: "ClAsk", props: { q: "¿A qué huele?", sign: "— Claudio" } } }),
  C(54, "", "ClRule", { n: 11, title: "Donde tu nariz no llega", sub: "la última" }),
  S(54, "Sato-san revisaba las almohadas del hotel", "bi", "b_pillows", { q: "hotel pillows bed", p: BI(`A row of white pillows stacked on a housekeeping cart in a corridor of ${HOTEL}.`) }),
  S(54, "Me enseñó a reconocer a un huésped", "bi", "b_satopillow", { p: BI(`${SATO} holding a white pillow without its case close to her face, smelling it with concentration, in a hotel room.`) }),
  S(54, "a nuca", "bi", "b_pillowmark", { p: BI("Close view of a white pillow with a faint yellowish mark near the lower edge where the back of the neck rests.") }),
  C(55, "", "ClBodyMap", {}),
  S(55, "Puedes bañarte dos veces al día", "bi", "b_showeragain", { q: "shower", p: BI(`Water running from a shower head in ${BATH}, the glass door half open.`) }),
  S(55, "Por eso en el hotel se revisaba la almohada", "bi", "b_pillowcase", { q: "changing pillowcase", p: BI("Hands pulling a fresh white pillowcase over a pillow on a neatly made bed.") }),
  S(56, "", "kf", "k_napewash", { p: BI("A man seen from behind at a bathroom sink washing the back of his neck and behind his ears with soapy hands."), d1: "soapy hands on the back of the neck", d2: "the hands move behind the ears", sound: "water and soap on skin" }),
  C(56, "y la funda de la almohada", "ClNumbers", { title: "La regla 11 en números", rows: [["Detrás de las orejas", "10 segundos con jabón, cada día"], ["La nuca", "10 segundos con jabón, cada día"], ["La funda", "cada 2 o 3 días"]] }),

  // ══ las 3 preguntas + ejemplo + médico
  S(57, "", "av", ""),
  C(57, "¿Esto lo estoy sacando", "ClCheck", { title: "Las 3 preguntas de Sato-san", label: "ANTES DE CUALQUIER COSA", items: ["¿Lo saco o lo tapo?", "¿Está mojado y debería estar seco?", "¿Mi nariz llega ahí?"] }),
  S(58, "", "bi", "b_perfume", { q: "air freshener spray bathroom", p: BI(`A hand pressing an air freshener spray with a plain blank label in ${BATH}, a fine mist in the air.`), ov: { c: "ClChip", props: { text: "lo tapa", alert: true } } }),
  S(58, "La toalla en el gancho", "bi", "b_hookagain", { p: BI("A towel folded on a single hook on a bathroom door, heavy and damp.") , ov: { c: "ClChip", props: { text: "mojada", alert: true } } }),
  S(58, "La nuca", "bi", "b_nape2", { p: BI("The back of a woman's neck under a loose bun, a cotton shirt collar below, seen from behind.") , ov: { c: "ClChip", props: { text: "no la alcanzas", alert: true } } }),
  S(58, "y ninguna se arregla comprando algo", "av", ""),
  S(59, "", "av", "", { ov: { c: "ClChip", props: { text: "consulta a un médico" } } }),

  // ══ repaso (30 s, las 11)
  S(60, "", "av", ""),
  S(60, "La toalla", "bi", "r_towel", { p: BI(`A gray towel spread open on a towel bar in ${BATH}, sunlight on it.`) }),
  S(60, "Primero el pelo", "bi", "r_hair", { p: BI("A hand with shampoo foam in curly hair under a shower, seen from behind.") }),
  S(60, "Fuera la esponja de malla", "bi", "r_poof", { p: BI("A colorful mesh shower puff dropped in a trash bin under a bathroom sink.") }),
  S(60, "Desodorante a la noche", "bi", "r_deo", { p: BI("A deodorant stick with a blank label beside a bedside lamp at night.") }),
  S(60, "Ropa al sol", "bi", "r_sun", { q: "laundry sun clothesline", p: BI("White shirts drying on a sunny clothesline, blue sky.") }),
  S(60, "Algodón contra la piel", "bi", "r_cotton", { p: BI("A plain white cotton undershirt folded on a light-wood shelf.") }),
  S(60, "Entre los dedos", "bi", "r_toes", { p: BI("A small towel drying between the toes of a bare foot on a bath mat.") }),
  S(60, "Raspador de lengua", "bi", "r_scraper", { p: BI("A stainless steel tongue scraper next to a toothbrush cup on a bathroom shelf.") }),
  S(60, "Extractor y pelo seco", "bi", "r_hood", { p: BI(`An extractor hood switched on above a stove in ${KITCHEN}, a light on it.`) }),
  S(60, "La ventana del ajo", "bi", "r_garlic", { p: BI("A garlic bulb next to a small calendar on a light-wood kitchen counter.") }),
  S(60, "Y diez segundos detrás de las orejas", "bi", "r_ear", { p: BI("Soapy fingers washing behind a man's ear at a bathroom sink.") }),

  // ══ mención 3 · el regalo + el Método
  S(61, "", "av", ""),
  S(61, "Son tres pruebas", "bi", "b_threetests", { p: BI(`A pillow, a folded towel and a closed bedroom door, arranged in one frame in ${HOUSE}.`) }),
  C(61, "Es gratis", "ClQRCard", { qr: I + "qr.jpg", cover: I + "x_gift.jpg", kicker: "EL TEST · GRATIS", text: "apunta la cámara aquí" }),
  S(61, "Y si quieres todas las reglas", "av", "", { ov: { c: "ClChip", props: { text: "El Método Japonés · US$27" } } }),

  // ══ gancho al video 2
  S(62, "", "av", ""),
  S(62, "justo detrás de las orejas y en la nuca", "bi", "b_nape40", { p: BI("The back of the neck and ears of a man in his fifties with short gray hair, seen from behind in soft daylight.") }),
  S(62, "es algo que la piel empieza a fabricar a esa edad", "bi", "b_soapbar", { p: BI("A translucent orange bar of soap on a light-wood dish by a bathroom sink, a few drops of water on it.") }),
  C(62, "Te lo cuento en el próximo video", "ClVideoRef", { thumb: I + "th_jpviejo.jpg", title: "El olor de después de los 40", next: true }),

  // ══ cierre
  S(63, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Cuál de las 11 rompías?", sign: "— Claudio" } } }),
  S(64, "", "cl", "c_bye", { p: CLP(`He stands in ${HOUSE} with a clean folded towel over his arm, smiling warmly at the camera and raising a hand in goodbye.`) }),
  S(64, "Nos vemos en el próximo video", "av", ""),
];
