// DIRECTOR B — jpcasa: cosas 3 (almohadas y cojines), 4 (colchón), 5 (alfombrita del baño), 6 (toallas + mención 2 "la rutina completa,
// pág. 12") y 7 (la que casi todos rompemos: la lavadora). Párrafos 18-40.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH } from "../claudio/lib.mjs";
import { H, SATOP, KITCHEN, BEDROOM, R } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jpcasa/";
const LAUNDRY = "a small laundry corner of a Latin American home with a white front-loading washing machine, a light-wood shelf and a window";
export const SHOTS = [
  // ══ 3 · almohadas y cojines
  C(18, "", "ClRule", R(3, "Almohadas y cojines", "el sol, el limpiador más barato")),
  S(18, "las almohadas salían a la terraza", "kf", "k_pillowsrow", { p: BI(`A row of white pillows laid out in the sun on a railing of a hotel rooftop terrace in Tokyo, city roofs behind.`), d1: "the pillows rest in the sun", d2: "a light breeze moves the pillow corners", sound: "a light breeze on a rooftop, distant city" }),
  C(18, "el sol es el limpiador más barato", "ClSato", { img: SATOP, quote: "El sol es el limpiador más barato que existe." }),
  S(19, "", "bi", "b_pillowcase", { q: "pillowcase laundry", p: BI(`A hand pulling a clean pillowcase off a pillow on a bed in ${BEDROOM}.`) }),
  S(19, "Pero la almohada de adentro, nunca", "bi", "b_pillowstain", { q: "old pillow bed", p: BI("A bare white pillow without its case on a bed, a yellowish oval stain in the middle where the head rests.") }),
  S(19, "No se evapora, no se enjuaga", "bi", "b_pillowclose", { q: "pillow close up", p: BI("Extreme close view of the yellowed fabric of an old bare pillow, the stitching worn.") }),
  S(19, "a dos centímetros de tu nariz", "bi", "b_sleeper", { q: "person sleeping pillow", p: BI(`An older Latin American man asleep on his side on a pillow in ${BEDROOM}, early morning light.`) }),
  S(20, "", "bi", "b_futonbalcony", { q: "futon balcony japan", p: BI("Futons and blankets hung over the balcony railings of a Japanese apartment building on a sunny day, several floors.") }),
  S(20, "Se les dan unos golpes", "kf", "k_futonbeat", { p: BI("Close view of a hand hitting a futon hanging over a balcony railing with a simple bamboo beater in the sun."), d1: "the beater rests on the futon", d2: "the beater hits the futon and a little dust lifts", sound: "a soft thump on a futon" }),
  C(21, "", "ClNumbers", { title: "Almohadas y cojines", rows: [["Al sol", "2 horas por mes"], ["Protector lavable", "debajo de la funda"], ["La almohada", "se cambia cada 2 años"]], page: 12 }),
  S(21, "cada cojín del sillón que se pueda levantar", "bi", "b_cushionsun", { p: BI("Sofa cushions and two pillows set out on chairs in the sun on a Latin American patio.") }),
  S(21, "Un protector lavable debajo de la funda", "bi", "b_protector", { q: "putting pillowcase on pillow", p: BI("A white zippered pillow protector being pulled over a pillow on a bed, a pillowcase beside it.") }),

  // ══ 4 · el colchón
  C(22, "", "ClRule", R(4, "El colchón", "también tiene que respirar")),
  S(22, "Sato-san no dejaba poner las limpias enseguida", "bi", "b_hotelstrip", { q: "stripping bed sheets hotel", p: BI(`A hotel bed in a room of ${HOTEL} stripped of its sheets, the bare white mattress uncovered, the window open.`) }),
  C(22, "Decía que el colchón también tiene que respirar", "ClSato", { img: SATOP, quote: "El colchón también tiene que respirar." }),
  S(23, "", "bi", "b_mattress", { q: "mattress bare bedroom", p: BI(`A bare mattress on a bed in ${BEDROOM}, a slightly darker area where someone sleeps.`) }),
  S(23, "Si la cama se tiende enseguida", "kf", "k_makebed", { p: BI(`Close view of hands pulling a bedspread quickly over a bed in ${BEDROOM} right after waking up.`), d1: "the bedspread is at the foot of the bed", d2: "the bedspread is pulled up over the pillows", sound: "sheets rustling" }),
  C(24, "", "ClDays", { days: ["ABRIR LAS SÁBANAS", "ABRIR LA VENTANA", "DESAYUNAR"], label: "El colchón respira mientras desayunas" }),
  S(24, "Una vez por mes, bicarbonato por encima", "bi", "b_sodamattress", { q: "mattress bedroom", p: BI("White baking soda sprinkled over a bare mattress, a plain box with a blank label on the bed.") }),
  S(24, "Y dale vuelta cada tres meses", "bi", "b_flipmattress", { p: BI(`Two people lifting and turning a mattress on its side in ${BEDROOM}, only their arms and the mattress in the frame.`) }),
  S(25, "", "cl", "c_mattresssun", { p: CLP(`He leans a mattress on its side next to a wide-open sunny window in ${BEDROOM}, patting it with his hand.`) }),
  S(25, "Vas a sentir la diferencia esa misma noche", "av", ""),

  // ══ 5 · la alfombrita del baño
  C(26, "", "ClRule", R(5, "La alfombrita del baño", "una toalla que nunca se seca")),
  S(26, "En el hotel no había alfombritas de tela", "bi", "b_hotelbath", { q: "hotel bathroom clean", p: BI(`A spotless bathroom of ${HOTEL}: a white tiled floor with nothing on it, a folded towel on a rail.`) }),
  C(26, "una tela en el piso del baño", "ClSato", { img: SATOP, quote: "Una tela en el piso del baño es una toalla que nunca se seca." }),
  S(27, "", "bi", "b_bathmat", { q: "bath mat bathroom floor", p: BI(`A thick fabric bath mat lying on the tiled floor of ${BATH}, damp and flattened in the middle.`) }),
  S(27, "sin aire por debajo", "bi", "b_matunder", { q: "bath mat bathroom floor", p: BI("A corner of a damp fabric bath mat lifted from a tile floor, the back dark and stained, a wet mark on the tile.") }),
  S(27, "Sale de lo que pisas con los pies limpios", "cl", "c_matsmell", { p: CLP(`He holds up a damp fabric bath mat in ${BATH} at arm's length, wrinkling his nose.`) }),
  S(28, "", "bi", "b_diatom", { q: "diatomaceous earth bath mat", p: BI(`A flat pale stone-like diatomaceous earth bath mat on the floor of ${BATH}, a few wet footprints fading on it.`) }),
  S(28, "Absorbe el agua de los pies en dos segundos", "kf", "k_diatom", { p: BI("Close view of wet footprints on a pale stone-like bath mat on a tile floor."), d1: "the wet footprints are dark on the mat", d2: "the footprints fade and the mat dries", sound: "quiet bathroom, a soft drip" }),
  C(29, "", "ClDoDont", { yes: { label: "Colgada después de la ducha", img: I + "b_mathang.jpg" }, no: { label: "Tirada en el piso", img: I + "b_bathmat.jpg" } }),
  S(29, "Y a la lavadora dos veces por semana", "bi", "b_matwasher", { q: "loading washing machine", p: BI(`A fabric bath mat being put into a front-loading washing machine in ${LAUNDRY}.`) }),

  // ══ 6 · las toallas (mención 2)
  C(30, "", "ClRule", R(6, "Las toallas", "ninguna se dobla fresca")),
  S(30, "En la lavandería del hotel", "bi", "b_laundry", { q: "hotel laundry towels", p: BI(`The laundry room of ${HOTEL}: large washing machines and stacks of white towels on carts.`) }),
  S(30, "Sato-san pasaba la mano por cada pila", "kf", "k_towelstack", { p: BI(`Close view of a woman's hand in a navy uniform sleeve pressing the top of a stack of folded white towels in a hotel laundry.`), d1: "the hand rests on the towel stack", d2: "the hand presses into the towels", sound: "soft towels pressed" }),
  S(31, "", "bi", "b_towelfolded", { q: "folded towel rail bathroom", p: BI(`A towel folded in two hanging on a rail in ${BATH}, heavy and damp.`) }),
  S(31, "Ese olor a trapo mojado", "cl", "c_towelsmell", { p: CLP(`He smells a towel he just pulled from a shelf in ${BATH} and makes a disgusted face.`) }),
  S(31, "vuelve cada vez que se moja", "bi", "b_toweldamp", { p: BI("A hand drying with a towel that is dark and damp, a bathroom mirror behind it.") }),
  C(32, "", "ClNumbers", { title: "Las toallas", rows: [["Secar", "abierta, nunca doblada en dos"], ["Lavar", "agua caliente + blanqueador con oxígeno"], ["Guardar", "sólo si está seca al tacto"]], page: 12 }),
  S(32, "con aire que le pase", "bi", "b_towelopen", { q: "towels drying rack", p: BI("Two towels spread fully open on a drying rack next to a sunny window.") }),
  S(32, "Y nunca se guarda si al tocarla todavía está fresca", "kf", "k_toweltouch", { p: BI(`Close view of ${H} touching a towel on a rail to check if it is dry.`), d1: "the hand reaches the towel", d2: "the fingers squeeze the towel", sound: "a soft towel rub" }),
  // mención 2
  S(33, "", "av", ""),
  C(33, "está en la página doce", "ClBookPage", { page: I + "x_page12.jpg", pageNo: 12, stamp: "La rutina completa" }),
  S(33, "para que la pegues al lado de la lavadora", "bi", "b_pageonwasher", { p: BI(`A printed page held with a magnet on the side of a white washing machine in ${LAUNDRY}.`) }),

  // ══ 7 · la que casi todos rompemos: la lavadora
  C(34, "", "ClRule", R(7, "La lavadora", "la usas para limpiar", { star: true })),
  S(35, "", "bi", "b_hotelwashers", { q: "industrial laundry machines", p: BI(`A row of large front-loading washing machines in the laundry room of ${HOTEL} on a Monday morning, doors open.`) }),
  S(35, "Sato-san abría la goma de la puerta con dos dedos", "kf", "k_satogasket", { p: BI(`Close view of a woman's two fingers in a navy uniform sleeve pulling back the rubber door seal of a large washing machine, a dark line inside the fold.`), d1: "two fingers touch the rubber seal", d2: "the fingers fold the seal back", sound: "rubber seal pulled" }),
  S(36, "", "bi", "b_washerhome", { q: "washing machine laundry room", p: BI(`A white front-loading washing machine in ${LAUNDRY}, the door closed, a softener bottle with a blank label on top.`) }),
  C(36, "Pero en la goma de la puerta siempre queda agua", "ClWasher3D", { mode: "peel", labels: { a: "La goma", b: "Agua que no se va" } }),
  S(36, "Húmedo, tibio y a oscuras", "bi", "b_gasketgrime", { p: BI("Extreme close view inside the fold of a washing machine rubber seal: standing water, gray lint and dark grime.") }),
  S(37, "", "kf", "k_towelsspin", { p: BI("A view through the round glass door of a front-loading washing machine with white towels turning in water."), d1: "the towels are still in the drum", d2: "the drum turns and the towels tumble", sound: "a washing machine drum turning with water" }),
  S(37, "Lo estabas repartiendo", "cl", "c_shirtsmell", { p: CLP(`He pulls a just-washed shirt out of a front-loading washing machine in ${LAUNDRY}, smells it and frowns.`) }),
  S(38, "", "kf", "k_wipegasket", { p: BI(`Close view of ${H} wiping inside the fold of a washing machine rubber seal with a cloth.`), d1: "the cloth enters the fold", d2: "the cloth wipes along the seal", sound: "a cloth wiping rubber" }),
  C(38, "Una vez por mes, un lavado vacío", "ClWasher3D", { mode: "cycle", temp: "Agua caliente · vacía" }),
  S(38, "Menos suavizante, o nada", "bi", "b_softener", { q: "fabric softener pour", p: BI("A hand putting a fabric softener bottle with a blank label back on a laundry shelf, unopened.") }),
  C(38, "Y entre lavado y lavado", "ClWasher3D", { mode: "ajar", labels: { a: "Puerta abierta", b: "Cajón afuera" } }),
  S(39, "", "bi", "b_jpsuper", { q: "japanese supermarket aisle", p: BI("An aisle of a Japanese supermarket with shelves of plain boxes of household cleaning products, labels unreadable.") }),
  S(39, "Allá dejar la puerta de la lavadora abierta es lo normal", "bi", "b_jpwasher", { q: "japanese apartment washing machine", p: BI("A small washing machine on the balcony of a Japanese apartment with its lid open, laundry drying beside it.") }),
  S(40, "", "bi", "b_wifewasher", { q: "woman opening washing machine door", p: BI(`A Latin American woman in her fifties crouching in front of a washing machine in ${LAUNDRY}, lifting the rubber seal with a surprised, disgusted face.`) }),
  S(40, "Esa misma tarde la lavamos entera", "cl", "c_washtogether", { p: CLP(`He crouches next to a front-loading washing machine in ${LAUNDRY} wiping the drum with a cloth, a bucket beside him.`) }),
  S(40, "Y las toallas dejaron de oler a trapo", "bi", "b_freshtowels", { q: "clean towels stack", p: BI("A neat stack of fluffy white towels on a light-wood shelf in a sunny room.") }),
];
