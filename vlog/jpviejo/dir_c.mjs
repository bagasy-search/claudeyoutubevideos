// DIRECTOR C — jpviejo: reglas 8 (la ropa), 9 (lo que comes), 10 (caminar), 11 (el cuarto) + la conversación que nadie tiene + médico +
// repaso + mención 3 (regalo con QR a /r y el Método US$27) + gancho al video 3 (lo que los japoneses nunca compran) + cierre. Párrafos 46-72.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH } from "../claudio/lib.mjs";
import { H, SATOP } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jpviejo/";
const KITCHEN = "a small bright Latin American kitchen with white tiles, light-wood cabinets and a window";
export const SHOTS = [
  // ══ REGLA 8 · la ropa
  C(46, "", "ClRule", { n: 8, title: "La ropa", sub: "el sol termina lo que el jabón empieza" }),
  S(46, "se lavaba con una medida de bicarbonato", "bi", "b_sodascoop", { q: "laundry powder scoop", p: BI("A scoop of white baking soda being poured into the drawer of a washing machine in a hotel laundry room.") }),
  S(46, "y se secaba en la azotea", "bi", "b_rooftop", { q: "laundry drying rooftop", p: BI(`The flat roof of ${HOTEL} in Tokyo on a sunny morning: navy uniforms and white t-shirts drying on metal rails, city buildings around.`) }),
  C(46, "el sol termina lo que el jabón empieza", "ClSato", { img: SATOP, quote: "El sol termina lo que el jabón empieza." }),
  S(47, "", "bi", "b_pajamas", { q: "pajamas folded", p: BI(`A cotton pajama and two white t-shirts folded on a bed in ${HOUSE}.`) }),
  S(47, "y el suavizante encima la encierra", "bi", "b_softener", { q: "fabric softener pouring", p: BI("A hand pouring blue fabric softener from a bottle with a blank label into a washing machine drawer.") }),
  S(48, "", "kf", "k_soda", { p: BI("Half a cup of white baking soda being poured over t-shirts in the drum of a washing machine."), d1: "the cup tilts over the drum", d2: "white powder falls onto the clothes", sound: "powder pouring into a washing machine" }),
  S(48, "y secados al sol", "bi", "b_lineshirts", { q: "white shirts clothesline sun", p: BI("White t-shirts and a pajama hanging on a clothesline in a sunny Latin American patio, blue sky.") }),
  S(49, "", "av", ""),
  S(49, "sacúdela antes de colgarla", "kf", "k_shake", { p: BI(`Close view of ${H} shaking out a damp white t-shirt before hanging it on a clothesline in the sun.`), d1: "the hands hold the wet shirt", d2: "the shirt is snapped out straight", sound: "a wet shirt being snapped" }),
  S(50, "", "cl", "c_pajamasniff", { p: CLP(`He holds up a folded pajama top in ${HOUSE} and smells its collar with a doubtful face.`) }),
  S(50, "El bicarbonato y el sol la sacan", "bi", "b_sodabox", { p: BI("A box of baking soda with a plain blank label on a sunny laundry shelf next to a stack of clean folded t-shirts.") }),

  // ══ REGLA 9 · lo que comes
  C(51, "", "ClRule", { n: 9, title: "Lo que comes", sub: "más verde, menos fritura" }),
  S(51, "En el comedor del hotel", "bi", "b_canteen", { q: "japanese canteen food tray", p: BI(`The staff canteen of ${HOTEL}: trays with rice, grilled fish, miso soup and pickles, staff in navy uniforms eating.`) }),
  S(51, "Sato-san tomaba té verde como nosotros tomamos agua", "kf", "k_tea", { p: BI("Green tea being poured from a small iron teapot into a ceramic cup on a light-wood table, steam rising."), d1: "the teapot tilts toward the cup", d2: "green tea fills the cup with steam", sound: "tea pouring into a cup" }),
  S(52, "", "av", ""),
  S(52, "mucha fritura y mucha grasa animal", "bi", "b_fried", { q: "fried food plate", p: BI(`A plate of fried meat and fries on a table in ${KITCHEN}, oil glistening.`) }),
  S(52, "Frutas, verduras y té verde, menos", "bi", "b_greens", { q: "vegetables fruit table", p: BI(`A bowl of fruit, leafy greens and a cup of green tea on a light-wood table in ${KITCHEN}, daylight.`) }),
  C(53, "", "ClNumbers", { title: "El balance", rows: [["Fritura", "menos, no todos los días"], ["Verdura y fruta", "más, en cada comida"], ["Té verde", "1 taza por día en lugar de un café"], ["Agua", "mucha"]] }),
  S(54, "", "bi", "b_asado", { q: "family dinner table", p: BI("A Latin American family sharing a Sunday meal around a table with fried food, empanadas and salad, laughing.") }),
  S(54, "Menos aceite en la sartén", "bi", "b_lessoil", { p: BI(`A frying pan with a little oil and vegetables sautéing on a stove in ${KITCHEN}, a bowl of salad beside it.`) }),

  // ══ REGLA 10 · caminar
  C(55, "", "ClRule", { n: 10, title: "Caminar", sub: "sudar poco y seguido" }),
  S(55, "En Tokio todo el mundo camina", "bi", "b_tokyowalk", { q: "tokyo people walking street", p: BI("A Tokyo sidewalk in the morning with many people of all ages walking to work, trees along the street.") }),
  S(55, "Sato-san tenía auto, y venía caminando al hotel", "bi", "b_satostreet", { p: BI(`${SATO} in a beige coat walking along a quiet Tokyo street early in the morning with an umbrella closed in her hand.`) }),
  S(56, "", "av", ""),
  S(56, "Y el sudor de quien camina todos los días", "bi", "b_lightsweat", { q: "walking morning street", p: BI("A Latin American woman in her fifties walking briskly in the morning with a light sheen of sweat on her forehead, smiling, a tree-lined street behind.") }),
  S(57, "", "bi", "b_walkpark", { q: "senior walking park", p: BI("A Latin American man in his late fifties walking at a calm pace along a tree-lined street in the morning, casual clothes.") }),
  S(58, "", "bi", "b_busstop", { q: "getting off bus", p: BI("A man stepping off a city bus at a stop in a Latin American neighborhood, morning light.") }),
  S(58, "Pasea al perro de verdad", "bi", "b_dogwalk", { q: "walking dog street", p: BI("A man in his fifties walking a medium-sized dog on a leash along a sunny sidewalk.") }),
  S(59, "", "cl", "c_walk", { p: CLP(`He walks along a sunny tree-lined sidewalk in casual clothes over his red polo, smiling at the camera as he passes.`) }),

  // ══ la pausa + REGLA 11 · el cuarto
  S(60, "", "av", ""),
  S(60, "Sal de tu cuarto", "bi", "b_doorout", { p: BI(`A bedroom door half open in ${HOUSE}, daylight from the hallway, the room behind dim with closed curtains.`) }),
  S(60, "y vuelve a entrar", "bi", "b_reenter", { p: BI("A person's hand pushing open a bedroom door from the hallway, a closed curtain and an unmade bed visible inside.") }),
  C(61, "", "ClRule", { n: 11, title: "El cuarto", sub: "un cuarto cerrado cuenta todo" }),
  S(61, "Era abrir la ventana", "kf", "k_window", { p: BI(`${SATO} opening a window of a hotel room with one hand, daylight coming in.`), d1: "her hand on the closed window latch", d2: "the window opens and the curtain moves", sound: "a window sliding open, distant city" }),
  S(62, "", "bi", "b_curtains", { q: "heavy curtains bedroom", p: BI("Heavy old curtains closed in a dim bedroom, a mattress and an armchair with fabric covers.") }),
  S(62, "y el que entra lo siente en cuatro segundos", "bi", "b_visitor", { p: BI(`A visitor stepping into the front door of ${HOUSE} and pausing for a second with a polite, neutral face.`) , ov: { c: "ClChip", props: { text: "4 segundos" } } }),
  S(63, "", "kf", "k_openwindow", { p: BI(`A bedroom window in ${HOUSE} opening wide in the morning, a bed with the covers pulled back, thin curtains moving.`), d1: "the window is closed", d2: "the window opens and the curtain moves in the breeze", sound: "a window opening, birds outside" }),
  C(63, "diez minutos de ventana abierta", "ClNumbers", { title: "El cuarto en números", rows: [["Ventana abierta", "10 minutos cada mañana"], ["La cama", "destapada mientras ventilas"], ["Cortinas y fundas", "lavadas"], ["Colchón y almohadas", "al sol cuando se pueda"]], page: 10 }),
  S(64, "", "bi", "b_grandhouse", { q: "old house living room", p: BI("The living room of an old Latin American grandparents' house: crocheted doilies, heavy curtains half closed, an old sofa, framed photos.") }),
  S(65, "", "bi", "b_hotelair", { q: "hotel room window open", p: BI(`A room of ${HOTEL} with the window wide open and the bed stripped, a housekeeping cart at the door.`) }),

  // ══ la conversación + médico
  S(66, "", "av", ""),
  S(66, "Por eso nadie te lo dice", "bi", "b_couple", { p: BI(`A Latin American couple in their sixties sitting on a sofa in ${HOUSE}, the woman looking at her husband tenderly but sitting a little apart.`) }),
  S(66, "El que más lo nota es el que más te quiere", "av", ""),
  S(67, "", "av", ""),

  // ══ repaso (30 s)
  S(68, "", "av", ""),
  S(68, "No es la axila", "bi", "r_axila", { p: BI("A deodorant stick with a blank label put away inside a bathroom drawer.") }),
  S(68, "Los cuatro lugares", "bi", "r_nape", { p: BI("Soapy fingers washing the back of a man's neck at a bathroom sink.") }),
  S(68, "Jabón que saque la grasa", "bi", "r_soap", { p: BI("A plain white bar of soap on a light-wood soap dish.") }),
  S(68, "Funda cada tres días", "bi", "r_case", { p: BI("A fresh white pillowcase folded on a bed next to a pillow.") }),
  S(68, "Los cuellos", "bi", "r_collar", { p: BI("A damp cloth wiping the collar of a winter jacket.") }),
  S(68, "Un minuto de cuero cabelludo", "bi", "r_scalp", { p: BI("A soft scalp massage brush next to a shampoo bottle with a blank label on a light-wood bathroom shelf, daylight.") }),
  S(68, "Nada de perfume encima", "bi", "r_cologne", { p: BI("A cologne bottle with a blank label put away on the back of a shelf.") }),
  S(68, "Bicarbonato y sol", "bi", "r_sun", { p: BI("White t-shirts drying in the sun on a clothesline.") }),
  S(68, "Menos fritura, té verde", "bi", "r_tea", { p: BI("A cup of green tea next to a bowl of salad on a light-wood table.") }),
  S(68, "Caminar", "bi", "r_walk", { p: BI("Feet in comfortable shoes walking on a sunny sidewalk.") }),
  S(68, "Y ventana abierta cada mañana", "bi", "r_window", { p: BI("A bedroom window wide open in the morning with the bed uncovered.") }),

  // ══ mención 3 · el regalo + el Método
  S(69, "", "av", ""),
  S(69, "Son tres pruebas", "bi", "b_threetests", { p: BI(`A pillow, a folded towel and a closed bedroom door, arranged in one frame in ${HOUSE}.`) }),
  S(69, "La de la almohada es justo la de hoy", "bi", "b_pillowtest2", { p: BI("A woman in her fifties smelling the center of a bare pillow in the morning, the pillowcase off beside it.") }),
  C(69, "Es gratis", "ClQRCard", { qr: I + "qr.jpg", cover: I + "x_gift.jpg", kicker: "EL TEST · GRATIS", text: "apunta la cámara aquí" }),
  S(69, "Y si quieres todas las reglas", "av", "", { ov: { c: "ClChip", props: { text: "El Método Japonés · US$27" } } }),

  // ══ gancho al video 3
  S(70, "", "bi", "b_satohome", { p: BI(`${SATO} in casual clothes, a beige cardigan, standing in the small bathroom of a Latin American home, looking into an open cabinet with a curious, serious face.`) }),
  S(70, "abrió la alacena del baño", "bi", "b_cabinet", { q: "bathroom cabinet products", p: BI("An open bathroom cabinet crammed with many cleaning sprays, air fresheners and paper towel rolls with blank labels.") }),
  S(70, "siete limpiadores, cuatro aromatizantes, tres rollos de papel", "bi", "b_basket", { p: BI("A supermarket basket overflowing with colorful cleaning sprays, air fresheners and paper towels with blank labels, on a kitchen counter.") }),
  S(70, "Y me dijo algo que me hizo ahorrar", "av", ""),
  C(70, "En el próximo video", "ClVideoRef", { thumb: I + "th_jpgasto.jpg", title: "Lo que los japoneses nunca compran", next: true }),

  // ══ cierre
  S(71, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Cuál de las 11 rompías?", sign: "— Claudio" } } }),
  S(72, "", "cl", "c_bye", { p: CLP(`He stands in ${HOUSE} next to an open window with a fresh pillow under his arm, smiling warmly at the camera and raising a hand in goodbye.`) }),
  S(72, "Nos vemos en el próximo video", "av", ""),
];
