// DIRECTOR A — fbmadera (El Constructor Libre): MINUTO 1 (pincel con la mezcla sobre un poste MOJADO + sello "ERROR" en el seg 0 →
// los dos postes: el podrido sale con la mano, el sano suena seco → PROMESA velas + aceite gratis → ráfaga → "¡mira cómo resbala!" →
// 3 loops) + LA RECETA (colar, medida, rallar, baño María, madera seca, 30 cm, tibio, punta, 2ª mano) + LA CUENTA + CTA 1 (párrafos 0-27).
import { S, BI, CLP } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbmadera/";
export const POST = "a square pine fence post about 10 cm thick";
export const ROT = "its bottom end dark, soft and rotten, crumbling into wet fibers and black soil";
export const SEALED = "its bottom 30 cm coated dark honey-brown and satin with a waxy oil finish, water beading on it";
export const CAN = "an old dented tin can";
export const MIX = "a warm runny dark-brown paste of melted white candle wax and used motor oil";
export const HANDS = "working hands in black nitrile gloves of a man in an olive-green shirt with rolled sleeves";
export const NEIGHBOR = "a sturdy 65-year-old Latin American neighbour, bald on top with gray hair at the sides, a thick gray mustache, a short-sleeved light-blue checked shirt with a pen in the pocket, glasses hanging on a cord";
export const SHOTS = [
  // ── 0:00 · el error en el segundo 0
  S(0, "", "bi", "b_wetbrush2", { p: BI(`Close view of ${HANDS} brushing even vertical strokes of ${MIX} onto ${POST} that is soaking wet and dark from rain, water drops running down the wood, a sunny backyard.`), ov: { c: "ClStampOv", props: { text: "ERROR" } } }),
  S(0, "para la madera", "bi", "st_rainpost", { q: "wet wooden fence post rain", p: BI(`A wooden fence post dripping wet after rain in a garden.`) }),
  S(0, "no lo pongas en un poste mojado", "av", ""),
  S(0, "Ése es el error que nadie te cuenta", "bi", "b_viralpost", { p: BI(`Top view of a tin can full of melted candle wax and black motor oil on a wooden stool, a paintbrush resting across it, a wet garden in the background.`) }),
  // ── los dos postes
  S(1, "", "cl", "c_twoposts", { p: CLP(`He stands in a sunny backyard between two pine fence posts stuck in the ground, one hand on each, looking at the camera with raised eyebrows.`) }),
  S(1, "Los dos los clavé el mismo día", "bi", "b_plantposts", { p: BI(`${HANDS} tamping soil around two new pine posts side by side in a sunny backyard, a spade stuck in the ground.`) }),
  S(1, "en la misma tierra", "bi", "st_fencepostsoil", { q: "wooden fence post in ground", p: BI(`The base of a wooden fence post where it enters the soil in a garden.`) }),
  S(1, "lo saco con la mano", "cl", "c_pullrot", { p: CLP(`He pulls a pine post out of the ground with one hand, effortlessly, ${ROT}, a disgusted grimace on his face.`) }),
  S(1, "Mira cómo se deshace abajo", "bi", "b_rotcrumble", { p: BI(`Extreme close view of ${POST}, ${ROT}; a gloved finger pushes into the wood and it crumbles like a wet biscuit.`), anim: "the finger pushes and the wood crumbles" }),
  S(1, "como galleta mojada", "bi", "st_rottenwood", { q: "rotten wood close up", p: BI(`Close view of rotten soft wood fibers.`) }),
  S(2, "", "bi", "b_goodpost", { p: BI(`${POST} standing in garden soil, ${SEALED}, sunny backyard, a wire fence behind.`) }),
  S(2, "mismo tiempo enterrado", "bi", "st_postline", { q: "row of fence posts", p: BI(`A row of wooden fence posts in a field.`) }),
  S(2, "Lo raspo con el cuchillo", "bi", "b_knifescrape", { p: BI(`Close view of a knife blade scraping the base of ${POST} that has a waxy dark finish; under the scrape the wood is clean, hard and pale yellow.`), anim: "the knife scrapes and pale wood shows" }),
  S(2, "amarillo por dentro", "bi", "b_paleinside", { p: BI(`Extreme close view of a fresh scrape on a dark waxed pine post revealing hard pale yellow healthy wood grain.`) }),
  S(2, "Lo golpeo", "cl", "c_knockpost", { p: CLP(`He knocks with his knuckles on the healthy waxed pine post in the backyard, head tilted, listening, pleased.`) }),
  // ── 0:12 · LA PROMESA
  S(3, "", "c", "ClPasteRecipe", { props: { a: 1, b: 3, aLabel: "vela", bLabel: "aceite usado", note: "derretidos juntos" } }),
  S(3, "derretidos juntos", "bi", "b_meltmix", { p: BI(`Top view into ${CAN}: dark oil swirling into clear melted wax, making brown marbled streaks.`), anim: "the dark oil swirls into the wax" }),
  S(3, "Velas viejas", "bi", "st_candles", { q: "white candles", p: BI(`A handful of plain white household candles on a wooden bench.`) }),
  S(3, "aceite de motor usado", "bi", "st_usedoil", { q: "used motor oil", p: BI(`Dark used motor oil being drained into a pan.`) }),
  S(3, "Las velas, unos centavos", "bi", "b_coins", { p: BI(`Six plain white candles and a few coins on a shop counter.`) }),
  S(3, "me lo regaló el mecánico de la esquina", "bi", "b_mechanic", { q: "mechanic garage oil change", p: BI(`A friendly mechanic in a small neighbourhood garage handing over a plastic jerrycan of used oil, smiling.`) }),
  S(3, "Menos de dos dólares", "c", "ClReceipt", { props: { lines: [["Velas", "unos centavos"], ["Aceite usado", "regalado"], ["Lata vieja y pincel", "lo que tienes"]], total: ["Todo el cerco", "menos de 2 dólares"] } }),
  C(3, "para todos los postes del cerco", "ClBeforeAfter", { before: I + "b_postgray.jpg", after: I + "b_postdone.jpg", note: "una mano tibia · segunda al otro día" }),
  // ── 0:25 · RÁFAGA
  S(4, "", "bi", "b_grate", { p: BI(`Close view of ${HANDS} grating a white candle on the large holes of an old kitchen grater into a tin can, wax shavings falling.`), anim: "the candle rubs down the grater, shavings fall" }),
  S(4, "Baño María", "bi", "b_bainmarie", { p: BI(`${CAN} full of white wax shavings sitting inside a pot of steaming water on a camping gas stove outdoors in a backyard.`), anim: "steam rises from the pot" }),
  S(4, "Le sumo el aceite colado", "bi", "b_pouroil", { p: BI(`Dark used motor oil poured from a jug into ${CAN} of clear melted wax, swirling in.`), anim: "the dark oil pours and swirls into the clear wax" }),
  S(4, "Revuelvo", "bi", "b_stir", { p: BI(`A wooden stick stirring ${MIX} in ${CAN}.`), anim: "the stick stirs in slow circles" }),
  S(4, "Pincelo tibio", "bi", "b_brushbase", { p: BI(`${HANDS} brushing ${MIX} onto the bottom of ${POST} lying across two sawhorses, the dry wood darkening as it soaks in.`), anim: "the brush strokes and the wood darkens" }),
  S(4, "donde el poste toca la tierra", "bi", "b_groundline", { p: BI(`A pine post standing in garden soil, a dark waxy band painted on its lower part going down into the ground.`) }),
  S(4, "Y mira cómo lo chupa la madera", "bi", "b_soakmacro", { p: BI(`Extreme macro of dry pale pine grain absorbing a dark oily wax, the stain spreading along the fibers.`) }),
  // ── el grito
  S(5, "", "bi", "b_beading", { p: BI(`Water poured from a garden hose onto ${POST}, ${SEALED}; the water beads into drops and runs straight off.`), anim: "water splashes and beads run off" }),
  S(5, "mira cómo resbala", "cl", "c_wow", { p: CLP(`He points at a waxed pine post being splashed with water, open-mouthed delighted grin, looking at the camera, sunny backyard.`) }),
  // ── 0:40 · 3 loops
  S(6, "", "av", ""),
  S(6, "Por qué en madera mojada", "bi", "b_cutrot", { p: BI(`A pine post cut in half lengthwise on a workbench: the outside glossy dark and perfect, the inside core dark, soft and rotten with white fungus spots.`), ov: { c: "ClChip", props: { text: "1 · Podrido por dentro", alert: true } } }),
  S(6, "Dónde no lo tienes que usar nunca", "bi", "b_vegpatch", { q: "vegetable garden", p: BI(`A small backyard vegetable garden with tomato plants and lettuce, a wooden post at the edge.`), ov: { c: "ClChip", props: { text: "2 · Dónde no usarlo" } } }),
  S(6, "lo calentó en la hornalla", "bi", "b_stovecan", { p: BI(`A tin can of wax sitting directly on a blue gas flame of a kitchen stove, a wisp of white smoke rising.`), ov: { c: "ClChip", props: { text: "3 · Lo del vecino", alert: true } } }),
  S(6, "Primero, la receta", "av", ""),
  // ── RECETA
  C(7, "", "ClChapter", { n: 1, title: "La receta entera", sub: "vela, aceite y una lata vieja" }),
  S(7, "Lo que necesitas", "c", "ClCheck", { props: { title: "Lo que necesitas", items: ["Velas o parafina, sin perfume", "Aceite de motor usado", "Lata vieja + olla para baño María", "Pincel viejo", "Guantes"] } }),
  S(7, "las que sobran de un corte de luz", "bi", "st_candlelight", { q: "candle burning dark", p: BI(`A white candle burning on a kitchen table during a power cut.`) }),
  S(7, "Una lata vieja", "bi", "b_kit", { p: BI(`${CAN}, a cooking pot, a worn paintbrush, black gloves, white candles and a plastic jug of dark used oil laid out on a wooden workbench in a bright backyard workshop.`) }),
  S(8, "", "bi", "b_strain", { p: BI(`Dark used motor oil poured through an old cotton rag laid in a funnel into a clean bottle, on a workbench.`), anim: "the oil filters slowly through the rag" }),
  S(8, "trae limaduras y mugre del motor", "bi", "b_ragdirt", { p: BI(`Close view of an oily rag with black grit and tiny metal filings caught in it after straining.`) }),
  S(9, "", "c", "ClPasteRecipe", { props: { a: 1, b: 3, aLabel: "parafina", bLabel: "aceite", note: "en volumen, con el mismo vaso" } }),
  S(9, "Una lata de vela rallada", "bi", "b_measure", { p: BI(`One small tin cup of grated white wax and three tin cups of dark oil lined up on a workbench.`) }),
  S(10, "", "bi", "b_grate2", { q: "grating candle", p: BI(`${HANDS} grating a white candle on an old box grater, wax flakes piling up.`), anim: "the candle slides on the grater" }),
  S(10, "saco el pabilo", "bi", "b_wick", { p: BI(`Gloved fingers pulling the cotton wick out of a half-grated white candle.`) }),
  S(10, "Entera tarda una eternidad", "cl", "c_eternal", { p: CLP(`He holds up a whole white candle next to a can of grated wax, rolling his eyes with a smile.`) }),
  S(11, "", "av", ""),
  S(11, "adentro de una olla con agua caliente", "bi", "b_bainmarie2", { q: "pot of boiling water", p: BI(`A tin can of wax shavings standing inside a pot of hot water on a camping stove outdoors.`) }),
  S(11, "Nunca la lata directo al fuego", "c", "ClDoDont", { props: { yes: { label: "Baño María", img: I + "b_bainmarie.jpg" }, no: { label: "Directo al fuego", img: I + "b_stovecan.jpg" } } }),
  S(11, "vapores que se prenden fuego solos", "bi", "b_vapor", { p: BI(`Close view of white vapor rising from a tin can of overheated wax over a flame, a small flame just catching at the rim.`) }),
  S(12, "", "bi", "b_melting", { p: BI(`Top view into ${CAN}: white wax shavings melting into clear transparent liquid wax, a few white flakes still floating.`), anim: "the flakes melt into clear liquid" }),
  S(12, "apago el fuego", "bi", "st_gasoff", { q: "turning off gas stove", p: BI(`A hand turning off the knob of a gas burner.`) }),
  S(12, "recién ahí sumo el aceite", "bi", "b_pouroil3", { p: BI(`Close view of dark oil poured from a plastic jug into a tin can of clear melted wax on a wooden garden table, no animals, nothing else around.`) }),
  S(13, "", "bi", "b_stir2", { p: BI(`Close view of a stick stirring ${MIX} in ${CAN} until smooth and even.`), anim: "the stick stirs" }),
  S(13, "marrón oscura", "bi", "b_stickdrip", { p: BI(`A wooden stick lifted from a can, ${MIX} dripping off it in a smooth stream.`) }),
  S(13, "la lata vuelve un minuto al agua caliente", "bi", "b_backpot", { p: BI(`A gloved hand setting a tin can of thick brown wax mix back into a pot of hot water.`) }),
  S(14, "", "cl", "c_feelwood", { p: CLP(`He lays his bare palm flat on a pine post lying on two sawhorses, eyes half closed, feeling it, in the backyard workshop.`) }),
  S(14, "si la sientes fría y húmeda", "bi", "b_wetwood", { q: "wet wood grain", p: BI(`Close view of damp dark pine wood with moisture on the surface.`), ov: { c: "ClChip", props: { text: "Todavía no", alert: true } } }),
  S(14, "Mejor una semana de sol", "bi", "st_sunwood", { q: "wooden posts drying sun", p: BI(`Wooden posts stacked in the sun to dry in a yard.`) }),
  S(15, "", "av", ""),
  S(15, "los treinta centímetros donde toca la tierra", "c", "ClPins", { props: { img: I + "b_groundline.jpg", pins: [{ x: 0.5, y: 0.62, label: "30 cm: acá se pudre" }, { x: 0.5, y: 0.25, label: "arriba, una mano" }] } }),
  S(15, "húmeda y con aire al mismo tiempo", "bi", "st_soilpost", { q: "post in wet soil", p: BI(`Wet soil around the base of a wooden post in a garden.`) }),
  S(15, "dos y tres pasadas", "bi", "b_band", { p: BI(`${HANDS} brushing a thick band of ${MIX} on the bottom third of a pine post on sawhorses, going over it again.`), anim: "the brush goes back over the band" }),
  S(16, "", "bi", "b_warmfinger", { p: BI(`A gloved finger dipped into ${CAN} of warm brown wax mix to test the temperature.`) }),
  S(16, "Tibio entra en la veta", "c", "ClSplit", { props: { img: I + "b_crust.jpg", left: ["HIRVIENDO", "costra arriba"], right: ["TIBIO", "entra en la veta"] } }),
  S(17, "", "bi", "b_soakmacro2", { p: BI(`Extreme macro of dry pine end grain drinking a dark oily wax, the color spreading into the pores.`), anim: "the dark mix spreads into the pores" }),
  S(17, "queda brillante", "bi", "b_satin", { p: BI(`Close view of a pine post surface where the dark wax coat has stopped soaking in and sits satin and shiny.`) }),
  S(18, "", "bi", "b_dip", { p: BI(`The pointed bottom end of ${POST} standing upright inside a tall tin can full of ${MIX}.`), anim: "the post sinks slowly into the can" }),
  S(18, "la que más sufre", "cl", "c_dipshow", { p: CLP(`He lifts a pine post out of a tall can, its bottom end dripping dark wax mix, showing it to the camera.`) }),
  S(19, "", "bi", "b_coat2", { p: BI(`A second coat of ${MIX} brushed on a dark waxed post the next morning, dew on the grass.`), anim: "one long brush stroke" }),
  S(19, "una vez por año", "bi", "b_calendar", { p: BI(`A paper wall calendar hanging in a backyard shed, one late-summer date circled with a black marker, a paintbrush on a nail beside it.`), ov: { c: "ClStampOv", props: { text: "1 VEZ POR AÑO" } } }),
  S(19, "a fin del verano", "bi", "st_latesummer", { q: "dry garden late summer", p: BI(`A dry sunny backyard at the end of summer, dry grass.`) }),
  // ── el final
  S(20, "", "bi", "b_postdone", { p: BI(`${POST} standing proud in a sunny backyard fence line, ${SEALED}.`) }),
  S(20, "Mira la gota", "bi", "b_drop", { q: "water drop on wood", p: BI(`Extreme close view of a round water drop sitting on dark waxed wood without soaking in.`), anim: "a drop lands and stays round" }),
  S(20, "La madera de abajo está sellada", "cl", "c_proud", { p: CLP(`He pats a finished dark-waxed pine post in the backyard fence, proud, smiling at the camera.`) }),
  S(21, "", "c", "ClCheck", { props: { title: "Repaso", items: ["Colar el aceite", "1 parafina · 3 aceite", "Baño María, nunca fuego directo", "Madera seca", "Tibio, no hirviendo", "Insistir en los 30 cm de abajo", "2ª mano al otro día · repaso anual"] } }),
  // ── LA CUENTA
  C(22, "", "ClChapter", { n: 2, title: "La cuenta", sub: "por qué es casi gratis" }),
  S(23, "", "bi", "b_sixcandles", { p: BI(`Six plain white candles in a paper bag on a small corner shop counter.`) }),
  S(23, "cero", "bi", "st_drawercandles", { q: "candles in drawer", p: BI(`Old candle stubs in a kitchen drawer.`) }),
  S(24, "", "bi", "b_jerrycan", { p: BI(`A 5-liter plastic jerrycan of dark used motor oil handed over at the door of a small garage.`) }),
  S(24, "A ellos les cuesta tirarlo", "bi", "st_oildrums", { q: "used oil drum garage", p: BI(`Drums of used oil stored in the corner of a mechanic's garage.`) }),
  S(25, "", "c", "ClReceipt", { props: { lines: [["Tu mezcla, 12 postes", "< 2 dólares"], ["Protector de ferretería", "10 a 15 veces más"], ["Un poste nuevo", "más que todo esto"]], total: ["Diferencia", "mucha plata"] } }),
  S(25, "sin contar el trabajo de sacar el viejo", "bi", "b_digout", { q: "digging post hole", p: BI(`A man digging around the base of a broken old fence post with a spade to pull it out.`) }),
  // ── CTA 1: el regalo
  S(26, "", "av", ""),
  S(26, "La del cemento que parece granito", "bi", "b_granitetop", { p: BI(`A cement tabletop polished to look exactly like dark speckled granite on a backyard table in the sun.`) }),
  S(26, "piso que parece porcelanato", "bi", "b_floorblue", { p: BI(`A glossy turquoise-blue cement floor in a bright small room, shining like porcelain tile.`) }),
  S(26, "la de las goteras", "bi", "b_roofseal", { q: "flat roof crack", p: BI(`A crack on a flat concrete roof sealed with a shiny transparent coat, water drops beading on it.`) }),
  C(27, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "las 10 mezclas con medidas, gratis" }),
  S(27, "Guárdala", "av", ""),
];
