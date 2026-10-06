// DIRECTOR C — clbandeja: EL PAPEL PARA HORNEAR · OTROS LUGARES (rejilla, vidrio, ollas, horno, microondas, campana → cadena a la
// lavadora) · ERRORES · PREGUNTAS (cadena al sarro) · HÁBITO · RESUMEN · CTA 3 · PRÓXIMO VIDEO: la silicona (cumple la promesa del video
// del moho) · cierre (párrafos 40-65).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { KITCHEN, CRUST, BOTTLE, PASTE } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const G = "a hand in a blue nitrile glove";
const I = "img/clbandeja/";
export const SHOTS = [
  // ── 8:50 · el papel
  S(40, "", "bi", "b_parchmentline", { p: BI(`${G} lining a clean aluminum baking sheet with a sheet of parchment paper on a stainless steel counter.`), anim: "the paper is smoothed flat onto the tray" }),
  S(40, "Y lávela el mismo día", "bi", "st_hotwater", { q: "washing tray hot water sink", p: BI("Washing a tray under hot running water.") }),
  // ── otros lugares
  C(41, "", "ClChapter", { n: 5, title: "La misma pasta, en 6 lugares", sub: "que casi nadie limpia" }),
  S(42, "", "bi", "b_ovenrack", { p: BI("A greasy brown oven rack pulled out onto newspaper on a kitchen floor.") }),
  S(42, "Póngala adentro de una bolsa de residuos grande", "bi", "b_rackbag", { p: BI(`${G} sliding a paste-covered oven rack into a big black trash bag on a bathroom floor beside a bathtub.`) }),
  S(43, "", "bi", "b_ovenglass", { p: BI("The inside of a home oven door glass coated with brown baked-on grease, a kitchen light reflected in it.") }),
  S(43, "Nunca un cuchillo", "bi", "b_knifeglass", { p: BI("A kitchen knife held against the glass of an oven door, a faint scratch line on the glass.") , ov: { c: "ClChip", props: { text: "Nunca", alert: true } } }),
  S(44, "", "bi", "b_potbottom", { p: BI("The outside bottom of a stainless steel pot turned upside down on a counter, covered in a black-brown burnt crust ring from the stove burner.") }),
  S(44, "En las ollas de acero inoxidable perfecto", "bi", "b_potclean", { p: BI(`${G} wiping the bottom of a stainless steel pot clean and shiny with a sponge after a paste treatment.`) }),
  S(45, "", "bi", "b_ovenfloor", { p: BI(`${G} spreading ${PASTE} over the brown-stained floor of a cold empty oven.`), anim: "the paste spreads slowly over the oven floor" }),
  S(45, "nunca pasta sobre la resistencia", "bi", "b_ovenelement", { p: BI("Close view of the heating element coil at the top of an open oven, a red warning sticker-free view, clean.") , ov: { c: "ClChip", props: { text: "Ahí no", alert: true } } }),
  S(46, "", "bi", "b_microlemon", { p: BI("A glass bowl of water with half a squeezed lemon inside a microwave oven, the door open.") }),
  S(46, "El vapor ablanda todo", "bi", "b_microwipe", { p: BI(`${G} wiping the steamy inside of a microwave clean with a cloth in one pass.`), anim: "the cloth wipes in one smooth pass" }),
  S(47, "", "bi", "b_hoodfilter", { p: BI("A metal mesh range hood filter caked in sticky brown grease being pulled out from under a kitchen range hood.") }),
  C(47, "Es como el filtro de la lavadora", "ClVideoRef", { thumb: I + "th_cllavadora.jpg", title: "La lavadora que huele mal" }),
  S(47, "agua bien caliente con detergente en la pileta", "bi", "b_hoodsoak", { p: BI("A greasy range hood filter soaking in a kitchen sink of steaming soapy water, grease clouding the water.") , anim: "steam rises off the water" }),
  // ── errores
  C(48, "", "ClChapter", { n: 6, title: "Los errores", sub: "de la cocina del hotel" }),
  S(49, "", "bi", "b_coldwater", { p: BI("Cold water from a kitchen faucet hitting a hot baking sheet straight from the oven, a burst of steam.") , ov: { c: "ClChip", props: { text: "Agua fría en caliente", alert: true } } }),
  S(49, "La bandeja se tuerce", "bi", "b_warped2", { p: BI("A baking sheet twisted out of shape lying on a stainless steel counter, one corner lifted.") }),
  S(50, "", "bi", "b_ovenspray", { p: BI(`A gloved hand spraying foam from an aerosol can with a blank label onto an aluminum baking sheet.`) , ov: { c: "ClChip", props: { text: "Limpiahornos en aluminio", alert: true } } }),
  S(50, "manchan el aluminio de blanco", "bi", "b_whitestain", { p: BI("An aluminum baking sheet with chalky white blotchy stains etched into the metal.") }),
  S(51, "", "bi", "b_dishwasher", { p: BI("A crusted brown baking sheet standing in the bottom rack of an open dishwasher.") , ov: { c: "ClChip", props: { text: "Al lavavajillas", alert: true } } }),
  C(52, "", "ClNeverMix", { a: "Agua oxigenada", b: "Vinagre", verdict: "Nunca juntos" }),
  C(52, "y nunca cloro con vinagre", "ClNeverMix", { a: "Cloro", b: "Vinagre", verdict: "Gas tóxico" }),
  // ── preguntas
  C(53, "", "ClChapter", { n: 7, title: "Lo que siempre me preguntan", sub: "rapidito" }),
  S(54, "", "bi", "b_safekitchen", { p: BI(`${KITCHEN} with a clean baking sheet of golden roasted vegetables just out of the oven.`) , ov: { c: "ClChip", props: { text: "¿Es seguro?" } } }),
  C(55, "", "ClCheck", { title: "Bandeja grande", items: ["1 taza de bicarbonato", "½ taza de agua oxigenada", "Siempre el doble de polvo"], fast: true }),
  S(56, "", "bi", "b_glassdish", { p: BI("A glass baking dish with brown baked-on stains around the edges on a kitchen counter.") , ov: { c: "ClChip", props: { text: "¿Fuentes de vidrio?" } } }),
  S(57, "", "bi", "st_castiron", { q: "cast iron skillet", p: BI("A black cast iron skillet on a stove.") , ov: { c: "ClChip", props: { text: "¿Hierro? No", alert: true } } }),
  S(58, "", "bi", "b_sodawater", { p: BI("A small bowl of baking soda mixed with water into a paste, a spoon in it, on a counter.") , ov: { c: "ClChip", props: { text: "¿Sin agua oxigenada?" } } }),
  S(59, "", "bi", "b_pumicetray", { p: BI("A gray pumice stone resting on an aluminum baking sheet, a fine scratch visible beside it.") , ov: { c: "ClChip", props: { text: "¿Piedra pómez? No", alert: true } } }),
  C(59, "La piedra es sólo para la porcelana", "ClVideoRef", { thumb: I + "th_clsarro.jpg", title: "El sarro del inodoro" }),
  // ── hábito
  S(60, "", "bi", "b_parchment2", { p: BI("A baking sheet lined with parchment paper with cookies on it going into an oven.") }),
  S(60, "antes de que la costra tenga cien capas", "av", ""),
  // ── resumen
  C(61, "", "ClCheck", { title: "Todo en 30 segundos", items: ["Fría y seca", "½ taza bicarbonato", "¼ taza agua oxigenada", "2 horas o la noche", "Antiadherente: nada de acero"] }),
  S(61, "Y de ahora en más papel para hornear", "cl", "c_parchment", { p: CLP(`He stands in ${KITCHEN} tearing a sheet of parchment paper off a roll over a clean baking sheet, giving the camera a knowing nod.`) }),
  // ── CTA 3
  S(62, "", "av", ""),
  C(62, "El código está acá", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "la página 13 entera, gratis" }),
  S(62, "Y si quiere los noventa y cuatro arreglos", "bi", "b_bookprint", { p: BI(`A freshly printed stack of letter-size book pages with photos of cleaning fixes fanned out on a stainless steel kitchen counter next to ${BOTTLE} and a box of baking soda.`) }),
  // ── próximo: la silicona (cumple la promesa del moho)
  C(63, "", "ClVideoRef", { thumb: I + "th_clsilicona.jpg", title: "La silicona sin arrancarla", next: true }),
  C(63, "En el video del moho le dije", "ClVideoRef", { thumb: I + "th_clmoho.jpg", title: "Moho: el cloro no lo mata" }),
  S(63, "Antes de arrancar la silicona con el cúter", "bi", "b_cutter", { p: BI(`${G} holding a utility knife against a black moldy silicone caulk line along a bathtub, about to cut it.`) }),
  // ── cierre
  S(64, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Cuántos años tiene SU bandeja?" } } }),
  S(65, "", "cl", "c_bye", { p: CLP(`He stands in ${KITCHEN} holding a heavy old clean baking sheet against his chest like a treasure, smiling warmly at the camera and waving goodbye.`) }),
];
