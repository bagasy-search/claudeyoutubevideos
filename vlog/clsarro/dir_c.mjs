// DIRECTOR C — clsarro: LOS 5 ERRORES (+ el mito del bicarbonato con vinagre) · LO HONESTO (el esmalte gastado) · 3 LUGARES DONDE SE
// ESCONDE EL SARRO (borde → cadena al video 1, chorro, gomita del tanque) · PREGUNTAS · QUE NO VUELVA (cepillo semanal, film de viaje) ·
// RESUMEN · CTA 3 · PRÓXIMO VIDEO (lavadora, la cadena) · cierre (párrafos 48-73).
import { S, BI, CLP, BATH } from "../claudio/lib.mjs";
import { RING, PUMICE } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const G = "a hand in a blue nitrile glove";
const I = "img/clsarro/";
export const SHOTS = [
  // ── 9:44 · los errores
  C(48, "", "ClChapter", { n: 6, title: "5 errores con el sarro", sub: "cada uno le arruina el trabajo" }),
  S(48, "Cada uno le arruina el trabajo", "av", ""),
  C(49, "", "ClChapter", { n: 1, label: "ERROR", title: "El agua arriba", sub: "todo se diluye", alert: true }),
  S(49, "Todo lo que echa se diluye", "bi", "b_dilute", { p: BI("Close view of a white toilet bowl full of water: a splash of clear liquid poured into the water spreading out and vanishing, the brown mineral ring above it untouched.") , anim: "the poured liquid swirls and spreads in the water" }),
  S(49, "Baje el agua siempre", "bi", "b_lowered", { p: BI(`Looking down into a white toilet bowl with almost no water left in the bottom, ${RING} fully exposed and dry.`) }),
  C(50, "", "ClChapter", { n: 2, label: "ERROR", title: "El cloro", sub: "le saca el color, no la piedra", alert: true }),
  S(50, "El cloro le saca el color", "bi", "st_bleachpour", { q: "pouring bleach toilet", p: BI("Pouring clear liquid from a white jug with a blank label into a toilet bowl.") }),
  S(50, "Queda gris", "bi", "b_grayring", { p: BI("Close view inside a white toilet bowl: a pale gray, bleached-looking mineral ring at the waterline, still rough and crusty.") }),
  S(50, "no se puede mezclar", "av", ""),
  C(51, "", "ClChapter", { n: 3, label: "ERROR", title: "Los geles fuertes", sub: "lea la etiqueta de atrás", alert: true }),
  S(51, "Muchos son ácidos fuertes", "bi", "b_gelbottle", { p: BI(`${G} squeezing a thick blue gel from an angled-neck toilet cleaner bottle with a blank white label under the rim of a white toilet.`) }),
  C(51, "si alguien en su casa echó cloro antes", "ClNeverMix", { a: "Gel ácido", b: "Cloro", verdict: "Gas tóxico" }),
  S(51, "lea la etiqueta de atrás", "bi", "b_readlabel", { p: BI("Close view of a hand turning a plain toilet cleaner bottle to read the small print on the back label, reading glasses resting on the bathroom counter.") }),
  C(52, "", "ClChapter", { n: 4, label: "ERROR", title: "El metal", sub: "lana de acero, espátula", alert: true }),
  S(52, "la lana de acero", "bi", "st_steelwool", { q: "steel wool pad", p: BI("A pad of steel wool on a counter.") }),
  S(52, "Rayan", "bi", "b_metalscratch", { p: BI("Extreme close view of white porcelain inside a toilet bowl with sharp gray scratch lines and a metal putty knife resting against it.") }),
  C(53, "", "ClChapter", { n: 5, label: "ERROR", title: "Rendirse", sub: "el sarro viejo lleva 2 o 3 noches", alert: true }),
  S(53, "Sale en dos o tres", "bi", "b_nights", { p: BI("Three photos of the same white toilet bowl taped side by side on beige bathroom tiles, the brown ring fading a little more in each one, a pen-marked strip of masking tape under them.") }),
  S(53, "Es que había mucho", "av", ""),
  // el mito del bicarbonato con vinagre
  S(54, "", "bi", "st_volcano", { q: "baking soda vinegar foam", p: BI("Baking soda and vinegar foaming up in a glass.") }),
  C(54, "pero se anulan entre ellos", "ClNeverMix", { a: "Bicarbonato", b: "Vinagre", verdict: "Se anulan", soft: true }),
  S(54, "Cada uno sirve solo", "av", ""),
  // lo honesto: esmalte gastado
  S(55, "", "av", ""),
  S(55, "el esmalte de la taza ya está gastado", "bi", "b_wornglaze", { p: BI("Extreme close view of the inside of a very old toilet bowl: the porcelain glaze worn dull and porous, matte patches with gray stain sunk into them, even though it is clean.") }),
  S(55, "Es la porcelana", "bi", "b_oldtoilet", { p: BI("A very old cream-white toilet in a dated bathroom with pink wall tiles, its bowl dull and stained.") }),
  S(55, "Pero ese caso es uno de cada veinte", "av", ""),
  // ── 11:34 · tres lugares donde se esconde
  C(56, "", "ClChapter", { n: 7, title: "Donde se esconde", sub: "3 lugares del mismo inodoro" }),
  C(57, "", "ClPins", { img: I + "b_wholetoilet.jpg", pins: [{ x: 0.5, y: 0.36, label: "Los agujeritos del borde" }, { x: 0.5, y: 0.66, label: "El chorro del fondo" }, { x: 0.52, y: 0.16, label: "La gomita del tanque" }] }),
  S(57, "están tapados de sarro", "bi", "b_rimcrust", { p: BI("Extreme close view of the underside of a white toilet rim: the small flush holes almost closed by hard white-gray mineral crust.") }),
  C(57, "Ése es mi video del borde", "ClVideoRef", { thumb: I + "th_clborde.jpg", title: "El borde del inodoro" }),
  S(58, "", "bi", "b_jethole", { p: BI("Looking down into a white toilet bowl with the water lowered: the large round siphon jet hole at the bottom front ringed with brown mineral crust.") }),
  S(58, "apriete ahí adentro una tira de papel", "bi", "b_jetstrip", { p: BI(`${G} pressing a soaked strip of toilet paper into the round jet hole at the bottom of a white toilet bowl with the water lowered.`), anim: "the gloved fingers press the wet strip deeper into the hole" }),
  S(59, "", "bi", "st_tankinside", { q: "inside toilet tank", p: BI("Looking down into an open toilet tank with the flapper and fill valve.") }),
  S(59, "la gomita del fondo", "bi", "b_flapper", { p: BI("Close view inside an open toilet tank with the water drained: the rubber flapper at the bottom crusted with white mineral deposits around its edge and its seat.") }),
  S(59, "pásele un trapo con vinagre", "bi", "b_flapperwipe", { p: BI(`${G} wiping the rubber flapper and its seat inside an empty toilet tank with a cloth wet with vinegar.`), anim: "the cloth wipes slowly around the flapper" }),
  S(59, "Muchas veces no hace falta cambiarla", "av", ""),
  // ── 12:22 · preguntas
  C(60, "", "ClChapter", { n: 8, title: "Lo que siempre me preguntan", sub: "rapidito" }),
  S(61, "", "bi", "st_applevinegar", { q: "apple cider vinegar bottle", p: BI("A bottle of apple cider vinegar on a kitchen counter.") , ov: { c: "ClChip", props: { text: "¿De manzana?" } } }),
  S(62, "", "bi", "st_septic", { q: "septic tank yard", p: BI("A concrete septic tank lid in a green backyard lawn.") , ov: { c: "ClChip", props: { text: "¿Pozo séptico?" } } }),
  S(62, "En el hotel teníamos cabañas", "bi", "st_cabins", { q: "wooden cabins resort", p: BI("A row of small wooden guest cabins at a resort among trees.") }),
  S(63, "", "bi", "st_cola", { q: "cola soda pouring glass", p: BI("Dark cola soda being poured into a glass, fizzing.") , ov: { c: "ClChip", props: { text: "¿La gaseosa?" } } }),
  S(63, "El vinagre hace mejor el trabajo", "av", ""),
  S(64, "", "bi", "b_blackrim", { p: BI("Extreme close view of the underside of a white toilet rim with black slimy streaks running out of the flush holes.") , ov: { c: "ClChip", props: { text: "¿Y si es negra?", alert: true } } }),
  S(64, "Es el video del borde", "av", ""),
  S(65, "", "bi", "b_calendar", { p: BI("A paper wall calendar hanging on beige bathroom tiles beside a mirror, a few days circled with a pen, a pen hanging from a string.") , ov: { c: "ClChip", props: { text: "¿Cada cuánto?" } } }),
  C(65, "Con agua dura", "ClCheck", { title: "Con agua dura", items: ["Pasta: 1 vez al mes", "Vinagre: cada 3 meses"], fast: true }),
  S(66, "", "bi", "st_sinkbath", { q: "white bathroom sink faucet", p: BI("A white porcelain bathroom sink with a chrome faucet.") , ov: { c: "ClChip", props: { text: "¿Lavamanos y bañera?" } } }),
  S(66, "Pero la piedra pómez", "bi", "b_pumiceonly", { p: BI(`${PUMICE} resting on the rim of a white toilet bowl, a white bathtub in the background out of reach.`) }),
  S(66, "Y nunca vinagre sobre mármol", "bi", "st_marble", { q: "marble bathroom counter", p: BI("A polished marble bathroom countertop with a sink.") , ov: { c: "ClChip", props: { text: "Nunca en mármol", alert: true } } }),
  // ── 13:30 · que no vuelva
  C(67, "", "ClChapter", { n: 9, title: "Que no vuelva", sub: "dos costumbres" }),
  S(67, "pase el cepillo justo por la línea del agua", "bi", "st_brushline", { q: "cleaning toilet brush", p: BI("A toilet brush scrubbing the waterline of a clean white toilet bowl.") }),
  S(67, "Que la piedra no tenga tiempo", "av", ""),
  S(68, "", "bi", "b_filmwrap", { p: BI(`${G} stretching clear plastic cling film tight over the open bowl of a white toilet, the seat up, a roll of cling film in the other hand.`), anim: "the hand pulls the cling film tight over the bowl" }),
  S(68, "Con el film no se evapora", "bi", "b_filmdone", { p: BI("A white toilet bowl sealed tight with clear plastic cling film, the water still at the normal level underneath, a packed suitcase by the bathroom door.") }),
  // ── 13:50 · resumen
  C(69, "", "ClCheck", { title: "Todo en 30 segundos", items: ["Llave cerrada, agua afuera", "Pasta 3 a 1, 20 minutos", "Piedra pómez mojada", "Otro día: vinagre toda la noche", "Nunca juntos, nunca con cloro"] }),
  S(69, "La piedra pómez siempre mojada", "bi", "st_pumice2", { q: "pumice stone water", p: BI("A wet pumice stone held under running water.") }),
  S(69, "Otro día tiras de papel", "bi", "b_recapstrips", { p: BI("Looking down into a white toilet bowl in soft morning light, soaked paper strips stuck all around the waterline and a clear jug of white vinegar with a blank label on the closed seat of the next stall.") }),
  C(69, "Nunca juntos y nunca donde hubo cloro", "ClNeverMix", { chart: true }),
  // ── CTA 3
  S(70, "", "av", ""),
  C(70, "El código está acá", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "la página 10 entera, gratis" }),
  S(70, "Y si quiere los noventa y cuatro arreglos", "bi", "b_bookprint", { p: BI("A freshly printed stack of letter-size book pages with photos of cleaning fixes fanned out on a hotel desk next to a brown bottle with a blank label and a pair of reading glasses.") }),
  // ── próximo video: la lavadora
  C(71, "", "ClVideoRef", { thumb: I + "th_cllavadora.jpg", title: "La lavadora que huele mal", next: true }),
  S(71, "Está escondido en la goma", "bi", "st_washerseal", { q: "washing machine door seal mold", p: BI("A hand pulling back the gray rubber door seal of a front-loading washing machine showing black mold inside the fold.") }),
  S(71, "huelen a sótano", "bi", "st_towelsmell", { q: "smelling towel laundry", p: BI("A woman sniffing a folded towel from a laundry basket and wrinkling her nose.") }),
  // ── cierre
  S(72, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Qué probó que no le funcionó?" } } }),
  S(73, "", "cl", "c_valvebye", { p: CLP(`He kneels behind a white toilet in ${BATH}, one gloved hand on the chrome shut-off valve by the wall, looking at the camera with a warm wink and a little nod goodbye.`) }),
];
