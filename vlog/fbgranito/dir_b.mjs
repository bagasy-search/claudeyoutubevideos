// DIRECTOR B — fbgranito: POR QUÉ el barniz adentro arruina la pieza (cristales que no se forman, prueba lado a lado, la lija hace el
// dibujo) · LOS 5 ERRORES · LO DEL VECINO (la primera a la volqueta, la segunda juntos) · LA PRUEBA del vecino (café, limón, llaves,
// se sube encima) · CTA 2 = la colección, sin apuro (párrafos 30-56).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { TAPA, GRANITE, MOLD, HANDS, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbgranito/";
export const SHOTS = [
  // ── por qué
  C(30, "", "ClChapter", { n: 3, title: "Por qué el barniz no va adentro", sub: "lo que muestra el video viral" }),
  S(30, "es lo que muestra el video viral", "bi", "b_viralbowl2", { p: BI(`Top view of a metal bowl of white cement powder with a pool of reddish-amber varnish poured into the center, a varnish tin tilted above it, on a wooden table.`), anim: "the varnish keeps pouring into the powder" }),
  S(31, "", "av", ""),
  S(31, "agarra el agua y forma cristales", "bi", "b_waterdrop", { p: BI(`Extreme macro of a drop of water landing on dry gray cement powder and soaking in, darkening it.`), anim: "the drop lands and soaks in", ov: { c: "ClStampOv", props: { text: "AGUA = DUREZA" } } }),
  S(31, "se traban entre sí y con la piedra", "bi", "b_crystals", { p: BI(`Extreme macro of a broken edge of hardened concrete: tiny needle-like crystals and stone chips locked together, gray and white.`) }),
  S(32, "", "bi", "b_varnishgrain", { p: BI(`Extreme macro of wet cement paste with amber varnish streaks wrapped around the grains, glossy and separated, not mixing.`) }),
  S(32, "El agua no llega", "bi", "b_beading", { p: BI(`Extreme macro of water drops sitting on top of varnish-coated cement grains without soaking in.`), ov: { c: "ClStampOv", props: { text: "EL AGUA NO ENTRA" } } }),
  S(32, "por dentro está floja", "bi", "b_crumble", { p: BI(`A thumb rubbing the broken edge of a gray cement slab and it crumbles into sand and loose stones.`), anim: "the edge crumbles under the thumb" }),
  // ── la prueba lado a lado
  S(33, "", "cl", "c_twoslabs", { p: CLP(`He stands behind two small cement slabs on the workbench, one blotchy and stained, the other ${GRANITE}, pointing at the blotchy one.`) }),
  S(33, "Mira el color", "bi", "b_blotchy", { p: BI(`Close view of a blotchy gray cement slab with dark brown halos and stains spreading from the stone chips, dull and uneven.`) }),
  S(33, "le paso la uña", "bi", "b_nailscratch", { p: BI(`Close view of a fingernail scratching a dull blotchy cement slab, leaving a pale powdery scratch line.`), anim: "the nail drags and leaves a powdery line" }),
  S(33, "suena hueca, como un terrón", "bi", "b_knockbad", { p: BI(`A knuckle knocking on a dull blotchy cement slab, a little dust falling from its edge.`) }),
  S(34, "", "bi", "b_nailgood", { p: BI(`Close view of a fingernail scratching a glossy slab ${GRANITE}: no mark at all.`) }),
  C(34, "Suena a piedra", "ClDoDont", { yes: { label: "Barniz arriba", img: I + "b_granitemacro.jpg" }, no: { label: "Barniz adentro", img: I + "b_blotchy.jpg" } }),
  // ── la lija hace el dibujo
  S(35, "", "av", ""),
  S(35, "como cuando cortas un salame", "bi", "b_salami", { q: "slicing salami", p: BI(`A cured salami sliced on a wooden board, the cut faces showing the white fat and red meat pattern.`) }),
  S(35, "la cara de adentro de la piedra", "bi", "b_chipcut2", { p: BI(`Extreme macro of a white marble chip and a black stone chip cut flat side by side inside polished gray cement.`) }),
  S(35, "tapadas por la piel de cemento", "c", "ClSplit", { props: { img: I + "b_halfsanded.jpg", left: ["RECIÉN DESMOLDADA", "las piedras tapadas"], right: ["LIJADA", "la piedra cortada"] } }),
  S(35, "ese brillo mojado", "bi", "b_wetlook", { p: BI(`Half of a speckled cement slab wet with water and vivid, the other half dry and pale, on a workbench in daylight.`) }),
  S(36, "", "av", ""),
  S(36, "El aceite iba en el molde", "c", "ClVideoRef", { props: { thumb: I + "th_fbmarmol.jpg", title: "Cemento con aceite: parece mármol" } }),
  // ── errores
  C(37, "", "ClChapter", { n: 4, title: "Los 5 errores", sub: "de mayor a menor" }),
  S(38, "", "bi", "b_earlydemold", { p: BI(`A gray cement slab just taken out of its wooden mold with a corner broken off and crumbs on the workbench.`), ov: { c: "ClChip", props: { text: "1 · Desmoldar a los 2 días", alert: true } } }),
  S(38, "la piedra salta de su lugar", "bi", "b_popout", { p: BI(`Extreme close view of a sanded cement surface with small round holes where stone chips popped out, a loose chip lying beside them.`) }),
  S(39, "", "bi", "b_drydust", { q: "sanding dust", p: BI(`A cloud of gray dust coming off a cement slab being sanded dry with sandpaper, a clogged gray sandpaper sheet.`), ov: { c: "ClChip", props: { text: "2 · Lijar en seco", alert: true } } }),
  S(39, "Siempre con agua", "bi", "b_hose", { p: BI(`A garden hose trickling water onto a slab being wet-sanded, gray slurry running off the edge.`), anim: "water trickles and the slurry runs" }),
  S(40, "", "bi", "b_fewchips", { p: BI(`Close view of a sanded gray cement slab with only a few scattered small stone chips, mostly plain gray, like a garage floor.`), ov: { c: "ClChip", props: { text: "3 · Poca granza", alert: true } } }),
  C(40, "Dos de piedra por una de cemento", "ClPasteRecipe", { a: 1, b: 2, aLabel: "cemento", bLabel: "granza", note: "no al revés" }),
  S(41, "", "bi", "b_thickcoat", { p: BI(`A thick sticky layer of varnish on a slab with a fingerprint and a coffee cup ring pressed into it.`), ov: { c: "ClChip", props: { text: "4 · Barniz grueso", alert: true } } }),
  S(42, "", "bi", "b_crazing", { q: "cracked concrete surface", p: BI(`Extreme close view of a cement surface covered in a fine web of hairline cracks, like a spider web, in harsh sunlight.`), ov: { c: "ClChip", props: { text: "5 · Curar al sol", alert: true } } }),
  S(42, "a la sombra y tapada", "bi", "b_shade", { p: BI(`A concrete slab in a wooden mold under plastic sheeting in the shade of a corrugated roof, sunlight on the patio beyond.`) }),
  // ── el vecino
  C(43, "", "ClChapter", { n: 5, title: "Lo del vecino", sub: "la primera y la segunda" }),
  S(43, "que te prometí al principio", "av", ""),
  S(44, "", "bi", "b_neighborask", { p: BI(`${NEIGHBOR} at a backyard fence leaning over to talk, arms crossed, skeptical half-smile.`) }),
  S(44, "me pidió la receta", "cl", "c_writerecipe", { p: CLP(`He writes the recipe on a piece of cardboard with a carpenter's pencil on the workbench, a neighbour in a light-blue checked shirt reading over his shoulder.`) }),
  S(44, "para la mesada de su parrilla", "bi", "b_grill", { q: "brick barbecue grill", p: BI(`A brick barbecue grill in a Latin American backyard with an empty space beside it for a countertop, daylight.`) }),
  S(45, "", "bi", "b_doorbell", { q: "pressing doorbell", p: BI(`A finger pressing the doorbell button at a house gate, morning light.`) }),
  S(45, "con cara de velorio", "bi", "b_neighborsad", { p: BI(`${NEIGHBOR} standing at a front gate looking glum and embarrassed, holding a broken piece of gray cement slab.`) }),
  S(45, "a los tres días", "bi", "b_grillmeat", { q: "barbecue grill meat", p: BI(`Meat on a backyard barbecue grill with smoke, a gray cement slab beside it.`) }),
  S(45, "Lijó en seco con la amoladora", "bi", "st_grinderdust", { q: "angle grinder dust concrete", p: BI("An angle grinder throwing a cloud of gray dust off concrete.") }),
  S(45, "le echó el barniz adentro de la mezcla", "bi", "b_varnishin2", { p: BI(`A bucket of gray stone-chip cement mix with amber varnish being poured into it, a neighbour's hand in a light-blue checked sleeve holding the tin.`), anim: "the varnish pours into the mix" }),
  S(46, "", "bi", "b_badslab", { p: BI(`A gray, stained, crumbling cement countertop slab next to a brick barbecue, its corner falling apart.`) }),
  S(46, "La tiró a la volqueta él mismo", "bi", "b_dumpster", { q: "construction dumpster", p: BI(`A broken gray cement slab lying on top of rubble in a construction dumpster on a street.`) }),
  S(47, "", "cl", "c_together", { p: CLP(`He and a neighbour in a light-blue checked shirt kneel together at a wooden mold full of concrete; he shows the neighbour how to tap the sides with a hammer.`) }),
  S(47, "con la carne encima todos los domingos", "bi", "b_grillgranite", { p: BI(`A brick barbecue with a countertop ${GRANITE}, a board with grilled meat and bread on it, Sunday family lunch in a sunny backyard.`) }),
  S(47, "es granito de verdad", "bi", "b_guests", { q: "friends backyard barbecue", p: BI(`Friends standing around a backyard barbecue countertop that looks like granite, one touching it, laughing.`) }),
  S(48, "", "av", ""),
  // ── la prueba
  C(49, "", "ClChapter", { n: 6, title: "La prueba del vecino", sub: "café, limón, llaves y cien kilos" }),
  S(50, "", "bi", "b_coffee", { q: "hot coffee cup table", p: BI(`A cup of hot black coffee with steam set directly on a glossy slab ${GRANITE}.`) }),
  S(50, "no queda ni el aro", "bi", "b_noring", { p: BI(`A hand lifting a coffee cup from a glossy granite-looking cement surface: no ring left underneath.`), anim: "the cup lifts and the surface is clean" }),
  S(51, "", "bi", "b_lemon", { q: "squeezing lemon", p: BI(`Half a lemon squeezed onto a glossy granite-looking cement slab, juice pooled around it.`) }),
  S(51, "Pasa el trapo. Nada.", "bi", "b_wipelemon", { p: BI(`A rag wiping lemon juice off a glossy granite-looking cement surface, clean underneath.`), anim: "the rag wipes clean" }),
  S(52, "", "bi", "b_keys", { p: BI(`A bunch of house keys being scraped hard across a glossy granite-looking cement slab.`), anim: "the keys scrape across" }),
  S(52, "una línea finita", "bi", "b_scratchline", { p: BI(`Extreme close view of one thin fine scratch line in the clear varnish of a speckled cement slab, the stone underneath intact.`) }),
  S(53, "", "bi", "b_standon", { p: BI(`${NEIGHBOR} carefully standing with both feet on a granite-looking cement slab resting on two bricks in a backyard, arms out for balance.`) }),
  S(53, "Ahí está la malla trabajando", "c", "ClPins", { props: { img: I + "b_standon.jpg", pins: [{ x: 0.5, y: 0.7, label: "La malla, adentro" }] } }),
  S(54, "", "bi", "b_neighborok", { p: BI(`${NEIGHBOR} stepping down from a slab and raising one hand in surrender with a grudging smile in a sunny backyard.`) }),
  S(54, "lo más parecido a un aplauso", "av", ""),
  // ── CTA 2
  S(55, "", "av", ""),
  S(55, "setenta y seis", "c", "ClBookPage", { props: { page: I + "book_cover.jpg", pageNo: 76, qr: I + "qr.jpg", stamp: "Las 10 mezclas, gratis" } }),
  S(55, "Madera, óxido, humedad", "bi", "b_variety", { p: BI(`A workbench with a rusty iron gate hinge, a wooden plank, a damp wall sample and a jar of homemade paste, a notebook open with handwritten measurements.`) }),
  S(56, "", "av", ""),
];
