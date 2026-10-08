// DIRECTOR C — jpgasto: cosas 8 (suavizante) y 9 (la regla del lugar, la que une todas) + el patrón + repaso + mención 3 (regalo con QR a /r
// y el Método US$27) + pago del loop (lo que dijo Sato-san frente a la alacena) + gancho al video 4 (lo que hace que tu casa huela a viejo).
// Párrafos 52-69.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH } from "../claudio/lib.mjs";
import { H, SATOP, KITCHEN, R } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jpgasto/";
export const SHOTS = [
  // ══ 8 · el suavizante
  C(52, "", "ClRule", R(8, "El suavizante", "sol y una sacudida")),
  S(52, "En la lavandería del hotel", "bi", "b_laundry", { q: "hotel laundry room", p: BI(`The laundry room of ${HOTEL}: large washing machines and stacks of white towels on carts.`) }),
  C(52, "sol y una sacudida", "ClSato", { img: SATOP, quote: "Sol y una sacudida." }),
  S(53, "", "bi", "b_softener", { q: "fabric softener", p: BI("A hand pouring blue fabric softener from a bottle with a blank label into a washing machine drawer.") }),
  S(53, "Y en las toallas es peor", "bi", "b_stifftowel", { p: BI("A thick towel hanging folded on a rail in a bathroom, slick and heavy.") }),
  S(54, "", "kf", "k_shakeshirt", { p: BI(`Close view of ${H} snapping out a damp towel in the sun before hanging it on a clothesline.`), d1: "the hands hold the damp towel", d2: "the towel is snapped out straight", sound: "a damp towel snapped in the air" }),
  S(54, "un chorrito de vinagre blanco en el compartimento del suavizante", "bi", "b_vinegardrawer", { p: BI("A splash of white vinegar being poured from a bottle with a blank label into the softener compartment of a washing machine drawer.") }),
  S(54, "La ropa sale suave y sin olor", "bi", "b_clothesline", { q: "towels drying sun", p: BI("White towels and shirts drying on a clothesline in a sunny Latin American patio, blue sky.") }),
  S(55, "", "bi", "b_foldsun", { p: BI("Hands folding a warm, sun-dried towel on a table by a sunny window.") }),

  // ══ 9 · dónde lo vas a guardar
  C(56, "", "ClRule", R(9, "¿Dónde lo vas a guardar?", "la que une todas")),
  C(56, "¿dónde lo vas a guardar?", "ClSato", { img: SATOP, quote: "¿Dónde lo vas a guardar?" }),
  S(57, "", "av", ""),
  S(57, "Esa pregunta frena el aromatizante", "bi", "b_cartstop", { p: BI("A hand putting an air freshener can with a blank label back on a supermarket shelf.") }),
  S(58, "", "bi", "b_wardrobe", { q: "small closet", p: BI(`A small wardrobe with a few shirts and two drawers in a staff room of ${HOTEL}, everything in its place.`) }),
  S(59, "", "av", ""),
  S(59, "anota durante un mes", "kf", "k_notebook", { p: BI(`Close view of a hand writing a list of purchases in a small notebook on a kitchen table in ${KITCHEN}, a supermarket receipt beside it.`), d1: "the pen rests on the notebook", d2: "the pen writes a new line", sound: "a pen writing on paper" }),
  S(59, "Vas a ver cuánto dinero", "bi", "b_receipts", { q: "receipts pile", p: BI("A pile of supermarket receipts on a table next to a calculator, numbers unreadable.") }),
  S(60, "", "bi", "b_shelfempty", { p: BI(`A clean, nearly empty bathroom shelf in ${BATH} with only a bar of soap and a folded cloth.`) }),
  S(61, "", "bi", "b_oneinout", { p: BI("A new shirt on a hanger going into a wardrobe while an old shirt is folded into a donation bag beside it.") }),
  S(61, "Así la casa nunca se llena", "bi", "b_jphome", { q: "japanese home interior", p: BI("A calm Japanese home interior with light wood, a low table and open floor space, sunlight on tatami.") }),

  // ══ el patrón + repaso
  S(62, "", "av", ""),
  S(62, "No son nueve problemas", "bi", "b_ninething", { p: BI(`Nine everyday purchases laid out on a kitchen table in ${KITCHEN}: an air freshener, paper towels, cleaning sprays, a storage box, a candle, a gadget, a softener bottle, a gift box and a phone.`) }),
  C(63, "", "ClSato", { img: SATOP, quote: "Lo que compras para tapar, lo vuelves a comprar." }),
  S(64, "", "av", ""),
  S(64, "Cero aromatizantes", "bi", "r_window", { p: BI("A living room window wide open in the morning, curtains moving.") }),
  S(64, "Seis paños en lugar del papel", "bi", "r_cloths", { p: BI("Six folded colored microfiber cloths on a kitchen shelf.") }),
  S(64, "Cuatro limpiadores, no diez", "bi", "r_four", { p: BI("Four plain bottles with blank labels on a shelf under a sink.") }),
  S(64, "Nada de cajas para lo que no usas", "bi", "r_box", { p: BI("A donation box by a front door with folded things inside.") }),
  S(64, "Adornos sólo si sirven", "bi", "r_teapot", { p: BI("A cast iron teapot alone on a clean light-wood shelf.") }),
  S(64, "Un cuchillo, una tabla, una sartén", "bi", "r_knife", { p: BI("A knife on a wooden board next to a frying pan.") }),
  S(64, "Revisa las suscripciones", "bi", "r_statement", { p: BI("A red pen circle on a printed statement, numbers unreadable.") }),
  S(64, "Sol en lugar de suavizante", "bi", "r_sun", { p: BI("Towels drying in the sun on a clothesline.") }),
  S(64, "Y si no sabes dónde guardarlo", "bi", "r_shelf", { p: BI("A neat, half-empty storage shelf in a bright home.") }),

  // ══ mención 3 · el regalo + el Método
  S(65, "", "av", ""),
  S(65, "Son tres pruebas", "bi", "b_threetests", { p: BI(`A pillow, a folded towel and a closed bedroom door, arranged in one frame in ${HOUSE}.`) }),
  C(65, "Es gratis", "ClQRCard", { qr: I + "qr.jpg", cover: I + "x_gift.jpg", kicker: "EL TEST · GRATIS", text: "apunta la cámara aquí" }),
  S(65, "Y si quieres todas las reglas", "av", "", { ov: { c: "ClChip", props: { text: "El Método Japonés · US$27" } } }),

  // ══ el pago del loop + gancho al video 4
  S(66, "", "bi", "b_satocabinet", { p: BI(`${SATO.replace("a dark navy hotel housekeeping supervisor uniform with a white collar and a small name badge with no readable text", "a beige cardigan and dark trousers")}, standing in front of an open bathroom cabinet full of products in ${BATH}, turning to speak with a calm, honest face.`) }),
  C(66, "Claudio-san, tu casa no huele mal", "ClSato", { img: SATOP, quote: "Tu casa no huele mal. Huele a todo lo que compraste para que no huela." }),
  S(67, "", "cl", "c_agree", { p: CLP(`He nods slowly with a sheepish smile in ${HOUSE}, holding an air freshener can with a blank label.`) }),
  S(67, "Hay cosas en tu casa que hacen que huela a viejo", "bi", "b_oldsofa", { q: "old sofa curtains", p: BI("An old fabric sofa, a worn carpet and heavy curtains in a dim Latin American living room.") }),
  C(67, "En el próximo video", "ClVideoRef", { thumb: I + "th_jpcasa.jpg", title: "Lo que hace que tu casa huela a viejo", next: true }),

  // ══ cierre
  S(68, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Cuál de las 9 compras cada mes?", sign: "— Claudio" } } }),
  S(69, "", "cl", "c_bye", { p: CLP(`He stands in a bright kitchen with a folded microfiber cloth over his shoulder, smiling warmly at the camera and raising a hand in goodbye.`) }),
  S(69, "Nos vemos en el próximo video", "av", ""),
];
