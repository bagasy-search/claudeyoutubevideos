// DIRECTOR C — jpbano: productos 9 (botellas a medio usar), 10 (afeitadora en la ducha), 11 (papel perfumado), 12 (la costumbre: el baño que
// no se seca, la que une todas) + patrón + repaso + mención 3 (QR /r + US$27) + pago del loop (los dos aerosoles) + gancho al video 7
// (los hábitos del baño que a un japonés le dan asco). Párrafos 47-70.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH, BOTTLE } from "../claudio/lib.mjs";
import { H, SATOP, HBATH, R } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jpbano/";
export const SHOTS = [
  // ══ 9 · las botellas a medio usar
  C(47, "", "ClRule", R(9, "Las botellas a medio usar", "pocas y escurriendo")),
  S(47, "en un estante que dejaba escurrir el agua", "bi", "b_twobottles", { q: "shampoo bottles shelf", p: BI(`Two plain refill bottles on a wire shelf in the shower of ${HBATH}, water dripping through.`) }),
  S(48, "", "bi", "b_manybottles", { q: "shampoo bottles shower", p: BI(`Seven or eight half-used shampoo and body wash bottles with blank labels crowded on the edge of a bathtub in ${BATH}.`) }),
  S(48, "Cada botella deja un círculo mojado abajo", "kf", "k_bottlering", { p: BI("Close view of a hand lifting a shampoo bottle with a blank label from the edge of a tub, revealing a pink and gray ring underneath."), d1: "the bottle sits on the tub edge", d2: "the bottle is lifted showing a stained ring", sound: "a plastic bottle lifted from a wet surface" }),
  S(49, "", "bi", "b_wireshelf", { q: "shower caddy wire shelf", p: BI(`A wire shower shelf with only two bottles and a bar of soap in a draining soap dish in ${BATH}.`) }),
  S(49, "Lo que no se usa desde hace un mes", "cl", "c_bottlesout", { p: CLP(`He takes several half-used bottles with blank labels out of a shower in ${BATH}, holding them in his arms.`) }),
  S(50, "", "bi", "b_jpshower", { q: "japanese shower area", p: BI("A Japanese washing area with a handheld shower, a small stool and a wire rack with two bottles, everything draining onto a tiled floor.") }),

  // ══ 10 · la afeitadora
  C(51, "", "ClRule", R(10, "La afeitadora en la ducha", "el metal mojado deja su firma")),
  S(51, "nada de metal se quedaba en la ducha", "bi", "b_hotelshowerempty", { p: BI(`The clean, empty shower corner of ${HBATH}, nothing on the shelf.`) }),
  S(52, "", "bi", "b_razortub", { q: "razor shower", p: BI("A disposable razor lying on the wet edge of a white bathtub.") }),
  S(52, "deja una mancha de óxido en el esmalte", "bi", "b_rustring", { q: "bathtub edge", p: BI("Close view of a small orange rust stain on the white enamel edge of a bathtub where a razor was left.") }),
  S(53, "", "kf", "k_razorshake", { p: BI(`Close view of ${H} rinsing a razor under the tap and shaking it dry over a sink.`), d1: "the razor is under the tap", d2: "the hand shakes the razor dry", sound: "water and a razor tapped on a sink" }),
  S(53, "parada en un vaso seco", "bi", "b_razorcup", { q: "razor cup sink", p: BI("A razor standing upright in a dry cup on a bathroom shelf outside the shower.") }),

  // ══ 11 · el papel perfumado
  C(54, "", "ClRule", R(11, "El papel perfumado", "sin perfume ni color")),
  S(54, "el papel era blanco y sin olor", "bi", "b_whitepaper", { q: "toilet paper roll", p: BI(`A plain white toilet paper roll on a holder in ${HBATH}.`) }),
  S(55, "", "bi", "b_colorpaper", { q: "toilet paper", p: BI("A roll of pink patterned toilet paper on a holder in a bathroom.") }),
  S(56, "", "bi", "b_rollstack", { q: "toilet paper rolls", p: BI(`Spare toilet paper rolls stacked on top of a toilet tank in ${BATH}, a little warped by the steam.`) }),
  S(56, "guardado en un mueble cerrado", "bi", "b_rollcabinet", { q: "toilet paper storage", p: BI("Spare toilet paper rolls neatly stored inside a closed bathroom cabinet.") }),

  // ══ 12 · la costumbre (la que une todas)
  C(58, "", "ClRule", R(12, "El baño que no se seca", "la que une todas")),
  S(58, "Sato-san me enseñó que el baño japonés se limpia todos los días un poquito", "bi", "b_satowipe", { q: "cleaning bathroom sink", p: BI(`${SATO} giving a sink a quick wipe with a folded cloth in ${HBATH}.`) }),
  S(59, "", "bi", "b_saturday", { q: "cleaning bathroom products", p: BI(`A bucket full of bleach, sprays and air fresheners with blank labels on the floor of ${BATH}, ready for a big weekend cleaning.`) }),
  S(59, "más creemos que quedó limpio", "cl", "c_strongsmell", { p: CLP(`He stands at the open door of a bathroom waving the air away from his face, a bucket of products at his feet.`) }),
  S(60, "", "bi", "b_jpwashstool", { q: "japanese bathroom stool", p: BI("A Japanese bathroom washing area with a low stool and a handheld shower outside a deep tub, the floor draining.") }),
  C(61, "", "ClNumbers", { title: "El baño que se seca", rows: [["Secador", "1 minuto después de cada ducha"], ["Ventana", "15 minutos, puerta cerrada"], ["Inodoro", "30 segundos cada día"]], page: 14 }),
  S(61, "Con eso, el baño casi no se ensucia", "kf", "k_finalwipe", { p: BI(`Close view of ${H} giving a toilet seat a quick wipe with a folded microfiber cloth.`), d1: "the cloth touches the seat", d2: "the cloth wipes across the seat", sound: "a cloth wiping porcelain" }),
  S(62, "", "bi", "b_wifebath", { q: "woman bathroom doorway", p: BI(`A Latin American woman in her fifties standing in the doorway of a bright dry bathroom in ${HOUSE}, looking around surprised.`) }),
  S(62, "el baño había dejado de quedarse mojado", "cl", "c_proudbath", { p: CLP(`He stands in a bright, dry bathroom holding a small squeegee, smiling proudly at the camera.`) }),

  // ══ patrón + repaso
  S(63, "", "av", ""),
  S(63, "Si el baño se seca y respira", "bi", "b_drybath", { q: "bright bathroom window", p: BI(`${BATH} completely dry with the window open and daylight, nothing on the shelves but a folded towel.`) }),
  C(64, "", "ClSato", { img: SATOP, quote: "El baño limpio no huele a producto." }),
  S(65, "", "av", ""),
  S(65, "Fuera el aromatizante de enchufe", "bi", "r_socket", { p: BI("An empty bathroom wall socket.") }),
  S(65, "Fuera la pastilla del tanque", "bi", "r_clearwater", { p: BI("Clear clean water in a white toilet bowl.") }),
  S(65, "Cortina de tela lavable", "bi", "r_curtain", { p: BI("A white fabric shower curtain stretched to dry.") }),
  S(65, "Paño en lugar de la flor de plástico", "bi", "r_cloth", { p: BI("A cotton cloth hanging open on a rail.") }),
  S(65, "Cepillo con base que se seque", "bi", "r_brush", { p: BI("A toilet brush in an open ventilated stand.") }),
  S(65, "Secador en lugar del aerosol", "bi", "r_squeegee", { p: BI("A small squeegee hanging in a shower.") }),
  S(65, "El cloro, nunca mezclado", "bi", "r_bleach", { p: BI("A bleach bottle alone on a high shelf.") }),
  S(65, "Las toallitas, al basurero", "bi", "r_bin", { p: BI("A small lidded bathroom bin.") }),
  S(65, "Pocas botellas", "bi", "r_twobottles", { p: BI("Two bottles on a wire shower shelf.") }),
  S(65, "La afeitadora, afuera de la ducha", "bi", "r_razor", { p: BI("A razor standing in a dry cup.") }),
  S(65, "Y el baño, seco y ventilado cada día", "bi", "r_window", { p: BI("An open bathroom window with daylight.") }),

  // ══ mención 3 · el regalo + el Método
  S(66, "", "av", ""),
  S(66, "Son tres pruebas", "bi", "b_threetests", { p: BI(`A pillow, a folded towel and a closed bedroom door, arranged in one frame in ${HOUSE}.`) }),
  S(66, "Y la de la puerta cerrada empieza justo en el baño", "bi", "b_bathdoorclosed", { q: "bathroom door hallway", p: BI(`A closed white bathroom door in the hallway of ${HOUSE}, a hand reaching for the handle.`) }),
  C(66, "Es gratis", "ClQRCard", { qr: I + "qr.jpg", cover: I + "x_gift.jpg", kicker: "EL TEST · GRATIS", text: "apunta la cámara aquí" }),
  S(66, "Y si quieres todas las reglas", "av", "", { ov: { c: "ClChip", props: { text: "El Método Japonés · US$27" } } }),

  // ══ el pago del loop + gancho al video 7
  S(67, "", "bi", "b_satocans", { p: BI(`${SATO} standing in the doorway of ${HBATH} holding two aerosol cans with blank labels, speaking calmly to someone off frame.`) }),
  C(67, "Claudio-san, si tu baño necesita esto", "ClSato", { img: SATOP, quote: "Si tu baño necesita esto, es que nunca lo dejas secar." }),
  S(68, "", "cl", "c_lidup", { p: CLP(`He stands in ${BATH} pointing at an open toilet with the lid up, making a disgusted face at the camera.`) }),
  S(68, "Como tirar la cadena con la tapa abierta", "kf", "k_flushopen", { p: BI(`Close view of a hand pressing the flush button of a toilet with the lid up in ${BATH}.`), d1: "the finger is on the button", d2: "the button is pressed and the water swirls", sound: "a toilet flushing" }),
  C(68, "En el próximo video", "ClVideoRef", { thumb: I + "th_jpasco.jpg", title: "11 hábitos del baño que a los japoneses les dan asco", next: true }),

  // ══ cierre
  S(69, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Cuántos de los 12 tienes en tu baño?", sign: "— Claudio" } } }),
  S(70, "", "cl", "c_bye", { p: CLP(`He stands in a bright dry bathroom with a small squeegee in one hand, smiling warmly at the camera and raising the other hand in goodbye.`) }),
  S(70, "Nos vemos en el próximo video", "av", ""),
];
