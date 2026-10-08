// DIRECTOR C — jpagua: usos 10-16 (basurero, inodoro, cepillos, macetas, lavadora, tapa de la bañera, juntas) + SEGURIDAD (vinagre,
// cloro, nunca se toma, la luz, 3 % y probar en un rincón) + patrón + repaso + mención 3 (QR /r + US$27) + pago del loop (la tabla) +
// gancho al video 6 (los productos del baño). Párrafos 40-72.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH, BOTTLE } from "../claudio/lib.mjs";
import { H, SATOP, KITCHEN, STAFFK, R } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jpagua/";
const LAUNDRY = "a small laundry corner of a Latin American home with a white front-loading washing machine and a window";
export const SHOTS = [
  // ══ 10 · el basurero
  C(40, "", "ClRule", R(10, "El basurero", "ni un día con olor")),
  S(40, "En Tokio la basura que se quema", "bi", "b_tokyotrash", { q: "japan garbage collection bags", p: BI("Neatly tied garbage bags at a small collection point on a quiet Tokyo residential street in the early morning, no readable signs.") }),
  S(41, "", "kf", "k_binspray", { p: BI(`Close view of ${H} spraying the inside of an empty plastic kitchen trash bin.`), d1: "the spray points into the bin", d2: "a mist coats the inside", sound: "a spray trigger" }),
  S(41, "La tapa y el pedal también", "bi", "b_binpedal", { q: "pedal trash bin", p: BI("The pedal and lid of a kitchen trash bin being wiped with a cloth.") }),

  // ══ 11 · el inodoro
  C(42, "", "ClRule", R(11, "El inodoro", "sin vapores ni color")),
  S(42, "En los baños chiquitos del hotel", "bi", "b_smallbath", { q: "small hotel bathroom", p: BI(`A very small spotless bathroom of ${HOTEL}, white toilet and sink close together.`) }),
  S(43, "", "cl", "c_kneel", { p: CLP(`He kneels on a bathroom floor in ${BATH} cleaning a toilet with a brush, the door half closed.`) }),
  S(44, "", "kf", "k_toiletpour", { p: BI(`Close view of a cup of clear liquid poured into a white toilet bowl in ${BATH}.`), d1: "the cup tilts over the bowl", d2: "the liquid pours into the bowl", sound: "liquid poured into a toilet bowl" }),
  C(44, "veinte o treinta minutos", "ClTimer30", { minutes: 30, label: "una taza en el inodoro" }),
  S(44, "lejos del panel y del chorrito", "bi", "b_bidetseat", { q: "japanese toilet seat panel", p: BI("A modern toilet seat with a side control panel with blank buttons in a clean bathroom.") }),

  // ══ 12 · los cepillos de dientes
  C(45, "", "ClRule", R(12, "Los cepillos de dientes", "cada uno en su vaso")),
  S(45, "cada uno tenía su vaso", "bi", "b_cups", { q: "toothbrush cup bathroom", p: BI("Several plain cups each with one toothbrush, lined up apart on a shelf in a staff washroom.") }),
  S(46, "", "kf", "k_brushcup", { p: BI("Close view of toothbrushes standing in a small glass of clear liquid on a bathroom shelf, tiny bubbles on the bristles."), d1: "the bristles in the liquid", d2: "small bubbles rise from the bristles", sound: "quiet bathroom, a soft fizz" }),
  S(46, "Y el vaso donde viven, también se lava", "bi", "b_dirtycup", { q: "toothbrush cup bathroom", p: BI("The bottom of a toothbrush cup with a little murky water and residue, on a sink counter.") }),
  S(47, "", "bi", "b_frayed", { q: "old toothbrush", p: BI("An old frayed toothbrush with splayed bristles next to a new one on a sink.") }),

  // ══ 13 · las macetas
  C(48, "", "ClRule", R(13, "Las macetas encharcadas", "oxígeno para la raíz")),
  S(48, "Sato-san tenía plantas en la ventana del depósito", "bi", "b_satoplants", { q: "potted plants windowsill", p: BI(`A row of potted plants on the windowsill of a storeroom of ${HOTEL}, a small watering can beside them.`) }),
  S(49, "", "kf", "k_watering", { p: BI(`Close view of ${H} watering a potted plant with a small watering can.`), d1: "the can tilts over the soil", d2: "water flows onto the soil", sound: "water poured on soil" }),
  C(49, "una cucharada de agua oxigenada en un litro de agua", "ClMeasureCup", { fill: 0.15, label: "1 cda en 1 litro", where: "a la tierra, nunca a las hojas" }),
  S(50, "", "bi", "b_nohole", { q: "potted plant yellow leaves", p: BI("A potted plant with yellowing lower leaves in a pot with no drainage hole, standing in a puddle.") }),

  // ══ 14 · la lavadora
  C(51, "", "ClRule", R(14, "La lavadora", "un remojo de oxígeno")),
  C(51, "Si viste el video anterior", "ClVideoRef", { thumb: I + "th_jpcasa.jpg", title: "11 cosas que hacen que tu casa huela a viejo", tag: "la número 7" }),
  S(52, "", "kf", "k_washerpour", { p: BI(`Close view of a cup of clear liquid poured into the empty drum of a front-loading washing machine in ${LAUNDRY}.`), d1: "the cup tilts into the drum", d2: "the liquid pours into the drum", sound: "liquid poured into a metal drum" }),
  S(52, "Y la goma, con un paño mojado", "bi", "b_gasketwipe", { q: "washing machine door seal cleaning", p: BI("A hand wiping inside the rubber door seal of a front-loading washing machine with a cloth.") }),

  // ══ 15 · tapa de la bañera y plásticos del baño
  C(53, "", "ClRule", R(15, "La tapa de la bañera", "remojo de oxígeno")),
  S(53, "la tapa de la bañera, los banquitos y los baldes", "bi", "b_jpbath", { q: "japanese bathroom bath stool", p: BI("A Japanese bathroom with a deep tub, a folding bath lid, a small plastic stool and a bucket.") }),
  S(54, "", "bi", "b_pinkedge", { q: "bath stool bathroom", p: BI("Close view of the edge of a plastic bath stool with a pink and gray film along the bottom rim.") }),
  S(55, "", "kf", "k_bucketsoak", { p: BI(`Close view of ${H} lowering a small plastic bath stool into a bucket of water.`), d1: "the stool is above the bucket", d2: "the stool goes into the water", sound: "plastic lowered into water" }),

  // ══ 16 · las juntas
  C(56, "", "ClRule", R(16, "Las juntas grises", "pasta y diez minutos")),
  S(56, "un pasillo entero en el supermercado", "bi", "b_moldaisle", { q: "supermarket cleaning aisle", p: BI("A supermarket aisle full of cleaning sprays with blank labels.") }),
  S(57, "", "kf", "k_groutpaste", { p: BI(`Close view of an old toothbrush spreading a white paste along gray grout lines between white bathroom tiles.`), d1: "the brush touches the grout", d2: "the paste covers the grout line", sound: "a brush on tile" }),
  S(57, "Las líneas blancas vuelven a ser blancas", "bi", "b_whitegrout", { p: BI("Clean white grout lines between white tiles in a bright bathroom.") }),
  S(57, "ventana abierta o extractor una hora", "bi", "b_bathwindow", { q: "bathroom window open", p: BI(`The window of ${BATH} wide open, daylight coming in.`) }),
  S(58, "", "cl", "c_mop", { p: CLP(`He wipes the upper corner of a bathroom ceiling with a cloth wrapped on the end of a broom handle in ${BATH}.`) }),

  // ══ SEGURIDAD
  S(59, "", "av", "", { ov: { c: "ClStampOv", props: { text: "SEGURIDAD", alert: true } } }),
  C(60, "", "ClNeverMix", { a: "Agua oxigenada", b: "Vinagre", verdict: "Nunca en la misma botella" }),
  S(60, "Si quieres usar los dos", "bi", "b_twobottles", { q: "vinegar bottle kitchen", p: BI("A bottle of white vinegar and a brown bottle of hydrogen peroxide with blank labels standing apart on a kitchen counter, a clear gap between them.") }),
  C(61, "", "ClNeverMix", { a: "Cloro", b: "Nada", verdict: "Nunca" }),
  S(62, "", "cl", "c_highshelf", { p: CLP(`He puts ${BOTTLE} on a high shelf of a kitchen cabinet, out of reach, in ${KITCHEN}.`), ov: { c: "ClStampOv", props: { text: "NUNCA SE TOMA", alert: true } } }),
  C(63, "", "ClBottle3D", { title: "La luz la arruina", sub: "frasco marrón, cerrado y a oscuras", compare: { clear: "botella transparente: agua en 2 semanas", brown: "frasco marrón: dura" } }),
  S(64, "", "bi", "b_marble", { q: "marble countertop", p: BI("A marble kitchen countertop, a brown bottle kept away on a separate shelf.") , ov: { c: "ClChip", props: { text: "3 % · nunca en mármol", alert: true } } }),
  S(64, "Prueba siempre en un rincón", "bi", "b_testcloth", { q: "towel fabric close up", p: BI("A cotton swab touching the inside hem of a colored towel to test the fabric.") }),

  // ══ patrón + repaso
  S(65, "", "av", ""),
  S(65, "es oxígeno, mojando, unos minutos", "bi", "b_waitcounter", { q: "kitchen counter timer", p: BI(`A wet glistening kitchen counter in ${KITCHEN} with ${BOTTLE} set aside and a kitchen timer beside it.`) }),
  C(66, "", "ClSato", { img: SATOP, quote: "El frasco marrón hace el trabajo de diez botellas." }),
  S(67, "", "av", ""),
  S(67, "Paños, sangre, axilas", "bi", "r_cloths", { p: BI("White kitchen cloths drying on a rail.") }),
  S(67, "recipientes, esponja, desagüe", "bi", "r_sponge", { p: BI("A sponge standing upright by a sink.") }),
  S(67, "la tabla de cortar", "bi", "r_board", { p: BI("A clean cutting board standing on its edge.") }),
  S(67, "la goma del refrigerador", "bi", "r_fridge", { p: BI("A clean white refrigerator door seal.") }),
  S(67, "el inodoro, los cepillos", "bi", "r_brushes", { p: BI("Toothbrushes in separate cups on a shelf.") }),
  S(67, "la lavadora", "bi", "r_washer", { p: BI("A front-loading washing machine with its door open.") }),
  S(67, "Un frasco que cuesta menos que un café", "bi", "r_bottlecoffee", { p: BI(`${BOTTLE} next to a cup of coffee on a light-wood table.`) }),

  // ══ mención 3 · el regalo + el Método
  S(68, "", "av", ""),
  S(68, "Son tres pruebas", "bi", "b_threetests", { p: BI(`A pillow, a folded towel and a closed bedroom door, arranged in one frame in ${HOUSE}.`) }),
  C(68, "Es gratis", "ClQRCard", { qr: I + "qr.jpg", cover: I + "x_gift.jpg", kicker: "EL TEST · GRATIS", text: "apunta la cámara aquí" }),
  S(68, "Y si quieres todas las reglas", "av", "", { ov: { c: "ClChip", props: { text: "El Método Japonés · US$27" } } }),

  // ══ el pago del loop + gancho al video 6
  S(69, "", "bi", "b_foamboard", { p: BI(`A white cutting board with white foam in its scratches on a steel table in ${STAFFK}, ${SATO} standing beside it with a calm face.`) }),
  C(69, "Claudio-san, no tires lo que todavía se puede limpiar", "ClSato", { img: SATOP, quote: "No tires lo que todavía se puede limpiar. Lo que hay que tirar es la prisa." }),
  S(70, "", "bi", "b_bathproducts", { q: "bathroom cleaning products shelf", p: BI(`A crowded shelf in ${BATH} with air freshener cans, toilet tank tablets and cleaning sprays with blank labels, the door closed.`) }),
  S(70, "con la puerta cerrada", "cl", "c_spraybath", { p: CLP(`He holds an aerosol can with a blank label at arm's length in ${BATH}, turning his face away with a worried look.`) }),
  C(70, "En el próximo video", "ClVideoRef", { thumb: I + "th_jpbano.jpg", title: "12 productos del baño que los japoneses reemplazaron", next: true }),

  // ══ cierre
  S(71, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Para qué usabas el frasco marrón?", sign: "— Claudio" } } }),
  S(72, "", "cl", "c_bye", { p: CLP(`He stands in a bright kitchen holding ${BOTTLE}, smiling warmly at the camera and raising his other hand in goodbye.`) }),
  S(72, "Nos vemos en el próximo video", "av", ""),
];
