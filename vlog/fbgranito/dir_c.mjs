// DIRECTOR C — fbgranito: DÓNDE MÁS (estante de baño, umbral, color con óxido, vidrio de botella) · QUE DURE AÑOS · LA VERSIÓN CLARA ·
// PREGUNTAS · RESUMEN · CTA 3 (QR al regalo) · PRÓXIMO: vela + aceite de motor usado · cierre (párrafos 57-81).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { TAPA, GRANITE, MOLD, HANDS, VARNISH } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbgranito/";
const WHITE = "polished to look like light marble: white and pale gray stone chips cut flat in a white cement matrix, glossy";
export const SHOTS = [
  // ── variantes
  C(57, "", "ClChapter", { n: 7, title: "Dónde más queda bien", sub: "cuatro ideas" }),
  S(57, "Te muestro dónde más", "av", ""),
  S(58, "", "bi", "b_shelf", { q: "bathroom shelf", p: BI(`A thin floating bathroom shelf, 2 cm thick, ${WHITE}, with soap and a toothbrush glass on it, white tiles behind.`) }),
  S(58, "con el molde más angosto", "bi", "b_narrowmold", { p: BI(`A long narrow wooden mold on a workbench, lined with packing tape, ready for a thin shelf.`) }),
  S(59, "", "bi", "b_threshold", { q: "door threshold", p: BI(`A worn cracked cement front door threshold of a Latin American house, the paint of the door chipped.`) }),
  S(59, "con un encofrado de madera", "bi", "b_formwork", { q: "concrete formwork", p: BI(`Wooden boards nailed as formwork around a front door threshold, fresh speckled concrete inside.`) }),
  S(59, "lijas en el piso", "cl", "c_kneelsand", { p: CLP(`He kneels at a front doorway wet-sanding a new speckled concrete threshold with a sanding block, gray slurry on the floor.`) }),
  S(60, "", "bi", "b_oxide", { q: "pigment powder", p: BI(`Small piles of red, black and yellow iron oxide pigment powder on a board next to a sack of cement.`) }),
  S(60, "mezclado en seco con el cemento", "bi", "b_pigmentmix", { p: BI(`Black iron oxide powder being stirred dry into gray cement in a bucket with a trowel, turning it dark charcoal.`), anim: "the black pigment blends into the cement" }),
  S(60, "parece de catálogo", "bi", "b_blackgranite", { p: BI(`A tabletop of polished cement that looks like black granite with sparkling white chips, glossy, on a patio table.`) }),
  S(61, "", "bi", "b_bottleglass", { q: "broken glass bottles", p: BI(`Pieces of crushed green and brown bottle glass with tumbled rounded edges in a tray, a hand in a work glove picking some up.`) }),
  S(61, "aparece como si fueran piedras de color", "bi", "b_glasschips", { p: BI(`Extreme close view of a polished cement surface with green and amber glass chips cut flat and glowing among white and black stone chips.`), anim: "slow slide across the glowing glass chips" }),
  S(61, "Con guantes, siempre", "bi", "st_workgloves", { q: "work gloves", p: BI("A pair of work gloves on a bench.") }),
  // ── mantener
  C(62, "", "ClChapter", { n: 8, title: "Que dure años", sub: "tres costumbres" }),
  S(63, "", "bi", "b_cleandish", { q: "wiping countertop", p: BI(`A soft cloth wiping a glossy granite-looking cement tabletop with soapy water, a bottle of dish soap beside it.`), anim: "the cloth wipes in circles" }),
  C(63, "Nada de lavandina ni de esponja de alambre", "ClDoDont", { yes: { label: "Agua y detergente", img: I + "b_cleandish.jpg" }, no: { label: "Lavandina o alambre", img: I + "b_steelwool.jpg" } }),
  S(64, "", "bi", "b_sand400", { p: BI(`A very fine sandpaper sheet being passed lightly over the dull varnish of a granite-looking slab.`) }),
  S(64, "una mano fina de barniz nuevo", "cl", "c_recoat", { p: CLP(`He brushes a fresh thin coat of varnish on a granite-looking tabletop in his backyard workshop, relaxed, smiling.`) }),
  S(64, "queda como el primer día", "bi", "b_granitereflect2", { p: BI(`Close view of ${TAPA}, ${GRANITE}, freshly varnished, daylight reflected in it.`) }),
  S(65, "", "bi", "b_puddle", { q: "puddle on table rain", p: BI(`Rainwater pooled on a flat outdoor cement tabletop in a garden after the rain.`) }),
  S(65, "ya escurre sola", "bi", "b_runoff", { q: "water dripping table edge", p: BI(`Water running off the slightly sloped edge of a glossy outdoor cement tabletop in drops.`), anim: "drops run off the edge" }),
  // ── la versión clara
  C(66, "", "ClChapter", { n: 9, title: "La versión clara", sub: "para el baño" }),
  S(67, "", "bi", "b_whitecement", { p: BI(`A sack of white cement, a bag of white and pale gray marble chips and a bucket of very white fine sand on a workbench.`) }),
  S(67, "que no sea la amarilla de río", "c", "ClDoDont", { props: { yes: { label: "Arena blanca", img: I + "b_whitesand.jpg" }, no: { label: "Arena amarilla", img: I + "b_yellowsand.jpg" } } }),
  S(68, "", "bi", "b_rustmesh", { q: "rust stain wall", p: BI(`Close view of a white cement slab with orange rust stains bleeding through from a steel mesh inside.`), ov: { c: "ClChip", props: { text: "Malla galvanizada", alert: true } } }),
  S(68, "el balde, limpio", "bi", "b_cleanbucket", { q: "washing bucket", p: BI(`A hand scrubbing the inside of a plastic bucket clean with a brush under a garden tap.`) }),
  S(69, "", "cl", "c_twoversions", { p: CLP(`He stands between two polished slabs on his workbench, one ${GRANITE} and the other ${WHITE}, presenting both with open hands to the camera.`) }),
  S(69, "La blanca parece un mármol de baño de hotel", "bi", "b_whiteslab", { p: BI(`Close view of a polished slab ${WHITE}, in a bright bathroom, a folded white towel on it.`) }),
  // ── preguntas
  C(70, "", "ClChapter", { n: 10, title: "Lo que siempre me preguntan", sub: "seis respuestas cortas" }),
  S(71, "", "bi", "b_kitchenslab", { q: "granite kitchen countertop", p: BI(`A kitchen countertop ${GRANITE} with a wooden cutting board and a pot sitting on a trivet.`), ov: { c: "ClAsk", props: { q: "¿Sirve para la cocina?", sign: "" } } }),
  S(71, "Tabla o posafuentes, siempre", "bi", "b_trivet", { q: "hot pot on trivet", p: BI(`A hot steaming pot being set down on a cork trivet on a granite-looking countertop.`) }),
  S(72, "", "bi", "b_vinegar", { p: BI(`A small puddle of lemon juice and a half lemon on a glossy granite-looking countertop at night under kitchen light.`), ov: { c: "ClAsk", props: { q: "¿Y el limón?", sign: "" } } }),
  S(73, "", "bi", "b_sunyellow", { p: BI(`A cement tabletop outdoors in strong sun, its varnish yellowed at one edge.`), ov: { c: "ClAsk", props: { q: "¿Afuera, al sol?", sign: "" } } }),
  S(73, "una cera de piso", "bi", "st_floorwax", { q: "applying floor wax", p: BI("A hand applying wax with a cloth on a floor.") }),
  S(74, "", "bi", "b_twopieces", { p: BI(`A long outdoor table top made of two granite-looking cement slabs with a neat joint between them in the middle.`), ov: { c: "ClAsk", props: { q: "¿Se puede hacer grande?", sign: "" } } }),
  S(75, "", "bi", "st_gravel", { q: "fine gravel", p: BI("Fine colorful gravel in a pile.") , ov: { c: "ClAsk", props: { q: "¿Y si no consigo granza?", sign: "" } } }),
  S(75, "Con arena sola no", "bi", "b_sandonly", { p: BI(`A sanded cement slab made with sand only: plain flat gray, no stones visible at all.`) }),
  S(76, "", "bi", "b_chippedcorner", { p: BI(`A granite-looking cement slab with a small chipped corner, a little fresh patch of mix pressed into it.`), ov: { c: "ClAsk", props: { q: "¿Y si se desportilla?", sign: "" } } }),
  S(76, "Ni se nota", "bi", "b_patched", { p: BI(`Close view of the corner of a granite-looking slab, repaired and polished, the patch invisible.`) }),
  // ── resumen
  C(77, "", "ClChapter", { n: 11, title: "Todo junto", sub: "para que lo tengas" }),
  S(77, "Una de cemento, dos de granza", "c", "ClCheck", { props: { title: "La receta", items: ["1 cemento · 2 granza · ½ arena fina", "Agua de a poco", "Malla en el medio", "Golpear el molde", "7 días tapada, a la sombra", "Lija al agua 80-120-220", "2 días secando", "3 manos de barniz"] } }),
  S(77, "El barniz va arriba, nunca adentro", "av", ""),
  // ── CTA 3
  C(78, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "la receta escrita + otras 9, gratis" }),
  // ── próximo
  S(79, "", "bi", "b_candles", { q: "melting candle wax", p: BI(`White candles melting in an old tin can set in a pot of hot water, a jug of dark used motor oil beside it on a backyard bench.`) }),
  S(79, "que la madera no se pudra nunca", "bi", "b_rottenpost", { q: "rotten wooden post", p: BI(`The bottom of a wooden fence post rotten and crumbling where it meets the soil.`) }),
  C(79, "en el poste del fondo", "ClVideoRef", { thumb: I + "th_next.jpg", title: "Vela + aceite usado: la madera", next: true }),
  // ── cierre
  S(80, "", "av", ""),
  S(80, "El vecino ya me encargó otra", "bi", "b_neighborwave", { p: BI(`A sturdy 65-year-old neighbour with a thick gray mustache and a light-blue checked shirt waving over a backyard fence, grinning.`) }),
  S(81, "", "av", ""),
];
