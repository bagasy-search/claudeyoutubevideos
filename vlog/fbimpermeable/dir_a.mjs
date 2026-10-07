// DIRECTOR A — fbimpermeable (El Constructor Libre): MINUTO 1 (el frasco batido de cola + aceite = sello "ERROR" en el seg 0 → se separa
// como en la ensalada → la tabla con la manguera, blanca como leche → PROMESA: dos usos por separado, la gota redonda, < $2 → el vecino
// y su banco → ráfaga → "¡mira cómo resbala!" → 3 loops) + LO QUE SÍ FUNCIONA (cola 1:3 = fondo antes de pintar · aceite de lino
// cocido: probar, finito, puntas, sobrante a los 20 min, 3 manos con 1 día, trapos estirados) + LA CUENTA + CTA 1 = QR (párrafos 0-27).
import { S, BI, CLP } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbimpermeable/";
export const YARD = "a sunny backyard patio of a modest Latin American house with a brick wall and potted plants";
export const BENCH = "an old wooden garden bench made of pine slats";
export const OILED = "an old wooden garden bench of pine slats freshly oiled, a warm honey color with the grain showing";
export const GLUE = "a plastic bottle of white wood glue with a plain blank label";
export const LINSEED = "a metal can of boiled linseed oil with a plain blank label";
export const HANDS = "working hands in blue nitrile gloves of a man in an olive-green shirt with rolled sleeves";
export const NEIGHBOR = "a sturdy 65-year-old Latin American neighbour, bald on top with gray hair at the sides, a thick gray mustache, a short-sleeved light-blue checked shirt with a pen in the pocket, glasses hanging on a cord";
export const SHOTS = [
  // ── 0:00 · el error en el segundo 0
  S(0, "", "bi", "b_shakejar", { p: BI(`Close view of ${HANDS} shaking a glass jar of white glue and yellow cooking oil, the mix cloudy.`), anim: "the jar is shaken", ov: { c: "ClStampOv", props: { text: "ERROR" } } }),
  S(0, "cola blanca con aceite", "bi", "b_glueoilbottles", { p: BI(`${GLUE} and a bottle of yellow cooking oil side by side on a patio table.`) }),
  S(0, "no lo hagas", "av", ""),
  S(0, "No se mezclan", "bi", "b_separated", { p: BI(`A glass jar on a table: a layer of yellow oil floating clearly on top of a layer of white glue.`) }),
  S(0, "Ése es el error del video que viste", "bi", "b_viralvideo", { p: BI(`A phone on a patio table playing a video of someone painting a bench with a white mix, a jar of glue and oil beside it.`) }),
  // ── el frasco
  S(1, "", "cl", "c_jar", { p: CLP(`He holds up a glass jar with a layer of yellow oil floating on white glue in ${YARD}, raising an eyebrow at the camera.`) }),
  S(1, "batido como en el video", "bi", "b_whisking", { p: BI(`A fork whisking white glue and yellow oil together in a glass jar, the mix cloudy.`), anim: "the fork whisks" }),
  S(1, "Lo dejé diez minutos en la mesa", "bi", "b_jartable", { q: "jar on table", p: BI(`A glass jar of separated glue and oil standing on a wooden patio table in the sun.`) }),
  S(1, "Arriba, el aceite. Abajo, la cola", "bi", "b_layers", { p: BI(`Extreme close view through the glass of a jar: yellow oil on top, white glue below, a sharp line between them.`) }),
  S(1, "Como el aceite en la ensalada", "bi", "st_salad", { q: "oil vinegar salad dressing", p: BI(`Oil and vinegar dressing separating in a small bowl.`) }),
  // ── la manguera
  S(2, "", "bi", "b_brushboard", { p: BI(`A brush painting a cloudy streaky mix of glue and oil on a pine board on a patio.`), anim: "the brush paints the board" }),
  S(2, "le tiré la manguera", "bi", "b_hoseboard", { q: "garden hose spray", p: BI(`A garden hose spraying water on a coated pine board leaning on a brick wall.`), anim: "water sprays the board" }),
  S(2, "A los cinco minutos", "bi", "b_timer5", { p: BI(`A phone timer showing 5:00 on a brick wall next to a wet board.`) }),
  S(2, "la tabla blanca como leche", "bi", "b_milky", { p: BI(`Close view of a wet pine board with a milky white blotchy coating, water soaking into the wood.`) }),
  S(2, "pegajosa", "bi", "b_tacky2", { p: BI(`A wet pine board covered in a soft blotchy milky white film, a fingertip resting on it.`) }),
  S(2, "y el agua adentro de la madera", "bi", "b_darkwet", { p: BI(`Extreme close view of dark wet wood fibres soaked with water under a white blotchy film.`) }),
  // ── 0:14 · LA PROMESA
  S(3, "", "av", ""),
  S(3, "usados por separado", "bi", "b_twojars", { q: "glass jars table", p: BI(`Two separate glass jars on a patio table: one of watered-down white glue like thin milk, one of golden linseed oil, a brush beside each.`) }),
  S(3, "hay dos cosas que sí funcionan", "cl", "c_twofingers", { p: CLP(`He holds up two fingers in ${YARD}, a jar of milky primer and a can of linseed oil on the table beside him, confident smile at the camera.`) }),
  S(3, "Y la gota queda redonda arriba de la madera", "bi", "b_bead", { p: BI(`Extreme close view of a round water drop sitting on oiled honey-colored pine, not soaking in.`) }),
  S(3, "sin entrar", "bi", "b_beadmacro", { p: BI(`Extreme macro of a water droplet sitting perfectly round on oiled honey-colored wood grain.`) }),
  S(3, "Menos de dos dólares", "c", "ClReceipt", { props: { lines: [["Cola blanca, 1 taza", "centavos"], ["Aceite de lino cocido ¼ l", "≈ 2 dólares"], ["Trapos y pincel", "los que tengas"]], total: ["Un banco + el fondo", "< 2 dólares"] } }),
  // ── el vecino
  S(4, "", "bi", "b_neighborbench", { p: BI(`${NEIGHBOR} sitting proudly on ${BENCH} with a shiny streaky coat in his front garden.`) }),
  S(4, "con la mezcla del video", "bi", "b_neighborbrush", { p: BI(`${NEIGHBOR} brushing a cloudy streaky mix onto his garden bench from a mayonnaise jar.`) }),
  S(4, "Me dijo que yo no sabía batir", "bi", "b_neighborwhisk", { p: BI(`${NEIGHBOR} shaking a mayonnaise jar of glue and oil hard with both hands, smug face.`) }),
  S(4, "Le dije que trajera el banco", "cl", "c_bringbench", { p: CLP(`He points toward a wooden bench while talking to a mustached neighbour in a light-blue checked shirt over a low garden wall, smiling.`) }),
  // ── 0:24 · RÁFAGA
  S(5, "", "bi", "b_pourglue", { p: BI(`White glue being poured into a jar with three cups of water beside it.`) }),
  S(5, "en la pared, antes de pintar", "bi", "b_primewall", { p: BI(`${HANDS} brushing a thin milky primer of watered-down glue onto a bare plaster wall.`) }),
  S(5, "Y para la madera de afuera", "bi", "b_outdoorwood", { p: BI(`${BENCH}, gray and weathered, in a sunny front garden.`) }),
  S(5, "aceite de lino cocido", "bi", "b_linseedcan", { p: BI(`${LINSEED} open on a patio, a brush resting across it.`) }),
  S(5, "Una mano finita", "bi", "b_oilcoat", { p: BI(`A brush laying a thin coat of golden linseed oil along the grain of a pine slat, the wood darkening.`) }),
  S(5, "saco lo que sobra", "bi", "b_wipe", { p: BI(`A clean rag wiping excess oil off a freshly oiled bench slat.`), anim: "the rag wipes" }),
  S(5, "A los veinte minutos", "bi", "b_clock20", { p: BI(`A kitchen timer showing 20:00 on a patio table next to a can of linseed oil and a rag.`) }),
  S(5, "Al otro día, otra", "bi", "b_secondday", { p: BI(`Morning sun on ${OILED} on a patio, a can and brush ready beside it.`) }),
  // ── el grito
  S(6, "", "bi", "b_hosebench", { p: BI(`A garden hose spraying ${OILED}, the water beading and running off the slats.`), anim: "water beads and runs off" }),
  S(6, "mira cómo resbala el agua", "cl", "c_wow", { p: CLP(`He holds a garden hose next to an oiled honey-colored wooden bench, pointing at the water beading on it, open-mouthed delighted grin, looking at the camera.`) }),
  // ── 0:42 · 3 loops
  S(7, "", "av", ""),
  S(7, "se deshace con el agua", "bi", "b_softglue", { p: BI(`A fingertip pressing a soft, wet, whitened glue film on a board, the film sticky.`), ov: { c: "ClChip", props: { text: "1 · La cola y el agua", alert: true } } }),
  S(7, "Por qué el aceite de cocina no sirve", "bi", "b_twooils", { p: BI(`A bottle of yellow cooking oil next to ${LINSEED} on a workbench.`), ov: { c: "ClChip", props: { text: "2 · Cocina vs. lino" } } }),
  S(7, "Y lo que le pasó al banco del vecino", "bi", "b_whitebench", { p: BI(`${BENCH} turned blotchy milky white and sticky after rain, in a front garden.`), ov: { c: "ClChip", props: { text: "3 · El banco del vecino", alert: true } } }),
  // ── RECETA
  C(8, "", "ClChapter", { n: 1, title: "Lo que sí funciona", sub: "dos usos, no una mezcla" }),
  S(8, "Lo que necesitas", "c", "ClCheck", { props: { title: "Lo que necesitas", items: ["Cola vinílica (cola blanca)", "Agua", "Aceite de lino COCIDO", "Pincel y trapos viejos", "Lija fina"] } }),
  S(8, "Un pincel, trapos viejos, y una lija fina", "bi", "b_kit", { q: "paint brush rags table", p: BI(`${GLUE}, ${LINSEED}, a jar of water, a brush, old rags and a sheet of fine sandpaper on a patio table next to ${BENCH}.`) }),
  S(9, "", "av", ""),
  S(9, "La cola, rebajada con agua, es un fondo", "c", "ClSplit", { props: { img: I + "b_uses.jpg", left: ["COLA + AGUA", "fondo, antes de pintar"], right: ["ACEITE DE LINO", "la madera de afuera"] } }),
  S(9, "Cada uno en su lugar", "bi", "b_twoplaces", { p: BI(`A primed plaster wall on the left and an oiled wooden bench on the right in a sunny patio.`) }),
  S(10, "", "bi", "b_cup", { p: BI(`A cup of white glue poured into a glass jar, three cups of water lined up next to it.`) }),
  S(10, "una parte de cola y tres de agua", "c", "ClPasteRecipe", { props: { a: 1, b: 3, aLabel: "cola", bLabel: "agua", note: "como leche aguada" } }),
  S(10, "Queda como leche aguada", "bi", "b_thinmilk", { p: BI(`A stick lifted out of a jar of thin milky white liquid, running off it like milk.`) }),
  S(11, "", "bi", "b_newplaster", { q: "new plaster wall", p: BI(`A bare new gray plaster wall in a room under renovation.`) }),
  S(11, "en un revoque que suelta polvo", "bi", "b_dusty", { p: BI(`A fingertip rubbing an old render wall, leaving sandy dust on the finger.`) }),
  S(11, "Se mete en los poros y los cierra", "bi", "b_poremacro", { p: BI(`Extreme macro of porous plaster darkening as a thin milky primer soaks in.`) }),
  S(12, "", "bi", "b_paintroll", { q: "painting wall roller", p: BI(`A roller rolling even white paint over a primed plaster wall.`), anim: "the roller rolls" }),
  S(12, "Es fondo, no terminación", "bi", "b_primed", { p: BI(`A plaster wall half primed with a slightly glossy milky coat, half bare.`), ov: { c: "ClStampOv", props: { text: "FONDO" } } }),
  S(13, "", "bi", "b_bench", { q: "old wooden bench garden", p: BI(`${BENCH}, gray and weathered, with flaking old varnish, in ${YARD}.`) }),
  S(13, "una lija hasta sacarlo", "bi", "b_sanding", { q: "sanding wood by hand", p: BI(`${HANDS} sanding flaking old varnish off a pine bench slat with fine sandpaper.`), anim: "the sandpaper rubs" }),
  S(13, "espera un par de días de sol", "bi", "st_sunpatio", { q: "sunny backyard patio", p: BI(`A sunny backyard patio.`) }),
  S(14, "", "bi", "b_testspot", { p: BI(`A brush dabbing linseed oil on the underside of a bench slat, a small test patch darker than the rest.`) }),
  S(15, "", "bi", "b_grain", { p: BI(`Close view of a brush stroking golden linseed oil along the grain of pine, the grain pattern appearing.`), anim: "the brush strokes, the grain darkens" }),
  S(15, "Se oscurece un poco", "bi", "b_halfoiled", { p: BI(`A pine bench slat half oiled honey-colored and half bare pale.`) }),
  S(16, "", "bi", "b_endgrain", { p: BI(`Extreme close view of the cut end of a pine slat soaking up linseed oil from a brush.`), anim: "the oil soaks into the end grain" }),
  S(17, "", "bi", "b_ragoff", { p: BI(`${HANDS} wiping a glossy layer of excess oil off an oiled slat with a clean rag.`), anim: "the rag wipes the excess" }),
  S(17, "queda pegajoso y junta polvo", "bi", "b_tacky", { p: BI(`A tacky glossy oil puddle on a wooden slat with dust and a small leaf stuck in it.`) }),
  S(18, "", "bi", "b_overnight", { q: "garden bench evening", p: BI(`${OILED} resting in a quiet patio at dusk.`) }),
  S(18, "Al otro día, segunda mano", "c", "ClCheck", { props: { title: "Aceite de lino", items: ["Mano finita", "Sobrante afuera a los 20 min", "1 día entre manos", "3 manos"] } }),
  S(19, "", "bi", "b_ragline", { p: BI(`Oily rags hung spread out flat on a clothesline in a backyard.`), ov: { c: "ClStampOv", props: { text: "NUNCA EN BOLLO" } } }),
  S(19, "se puede prender fuego", "bi", "b_ragpile", { p: BI(`A crumpled pile of oily rags in a metal bin in a shed corner, a thin wisp of smoke rising.`) }),
  S(19, "en un balde con agua", "bi", "b_ragbucket", { p: BI(`Oily rags soaking in a bucket of water.`) }),
  // ── el final
  S(20, "", "bi", "b_finalbench", { q: "wooden bench sunlight", p: BI(`${OILED} in ${YARD}, sunlit.`) }),
  S(20, "quedan redondas", "bi", "b_drops", { p: BI(`Several round water drops sitting on an oiled honey-colored bench slat in the sun.`) }),
  S(21, "", "c", "ClCheck", { props: { title: "Repaso", items: ["Cola + 3 de agua = fondo", "1 mano antes de pintar", "Lino cocido, finito", "Sobrante a los 20 min", "3 manos, 1 día entre", "Trapos estirados"] } }),
  // ── LA CUENTA
  C(22, "", "ClChapter", { n: 2, title: "La cuenta", sub: "menos de dos dólares" }),
  S(22, "quiero que veas de dónde sale", "av", ""),
  S(23, "", "bi", "b_litre", { q: "white glue bottle", p: BI(`A one-litre jar of milky glue primer next to a nearly full bottle of white glue.`) }),
  S(24, "", "bi", "st_paintstore", { q: "paint store shelves", p: BI(`Cans on the shelves of a paint store.`) }),
  S(24, "los mangos de las herramientas", "bi", "b_handles", { q: "garden tools handles", p: BI(`Wooden handles of a hammer and a spade freshly oiled, glowing honey-colored on a workbench.`) }),
  S(25, "", "bi", "st_varnish", { q: "varnish can wood", p: BI(`A can of varnish and a brush.`) }),
  S(25, "lo que más cuesta es esperar tres días", "cl", "c_wait", { p: CLP(`He sits on a low wall next to an oiled bench in ${YARD}, sipping a mate, patiently waiting, smiling.`) }),
  // ── CTA 1: el regalo
  S(26, "", "av", ""),
  S(26, "La del cemento que parece granito", "bi", "b_granitetop", { p: BI(`A cement tabletop polished to look exactly like dark speckled granite on a backyard table in the sun.`) }),
  S(26, "la del aflojatodo para la reja", "bi", "b_blackgate", { p: BI(`A front iron gate of vertical bars freshly painted glossy black in front of a small house, sunny.`) }),
  S(26, "la del gel para el óxido", "bi", "b_cleanpliers", { p: BI(`An old pair of steel pliers cleaned back to plain gray steel, lightly oiled, on a workbench.`) }),
  C(27, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "las 10 mezclas con medidas, gratis" }),
  S(27, "Guárdala", "av", ""),
];
