// DIRECTOR A — algotera (Claudio el Albañil #4, "La casa de Doña Marta" ep. 4): MINUTO 1 (la mano con el sellador apuntando arriba de
// la mancha en el seg 0 + "no selle ahí" → la cara → la gota en el balde de la cocina → el parche de brea del pintor → el desagüe tapado
// (loop) → promesa (manguera, sellador, membrana) + vistazo → credibilidad + la prueba del charco → capítulo) + el video de la pared + la
// noche de tormenta + por qué camina el agua (mención 1) + seguridad (párrafos 0-16).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const H = "a mason's rough weathered hands, the sleeve of a bright orange t-shirt at the edge of the frame";
export const KITCHEN = "the old kitchen of a modest Latin American house with cream tiles, an old gas stove, wooden cabinets and a single bulb lamp hanging from a white ceiling";
export const STAIN = "a brown water stain with dark rings like tree rings spreading on the white ceiling of an old kitchen next to a hanging bulb lamp";
export const ROOF = "the flat gray concrete roof of an old modest house next to a small upstairs room, a rain drain funnel in one corner and the branches of a purple jacaranda tree hanging over";
export const PAINTER = "a house painter in his forties in white paint-stained overalls and a cap";
export const BOY = "a skinny 11-year-old Latin American boy with short black hair in a soccer t-shirt";
export const NIECE = "a Latin American woman in her forties with a dark ponytail, jeans and a blue blouse";
const I = "img/algotera/";
export const SHOTS = [
  // ── 0:00 · sellar arriba de la mancha
  S(0, "", "bi", "b_sealstop", { p: BI(`On a flat concrete roof, close view of ${H} aiming a caulking gun at a dry spot right above where a stain would be, far from a clogged drain in the background.`), anim: "the caulking gun moves toward the roof", ov: { c: "ClStampOv", props: { text: "NO SELLE AHÍ" } } }),
  S(0, "El agujero casi nunca está arriba de la mancha", "av", ""),
  S(0, "está arriba de la mancha", "bi", "b_stainlook", { p: BI(`Looking straight up at ${STAIN} from below, the bulb lamp hanging beside it.`) }),
  // ── la gota
  S(1, "", "kf", "k_drip", { p: BI(`Close view at night of a water drop forming on ${STAIN} and falling into a plastic bucket on the tile floor.`), d1: "a drop swells on the brown stain of the ceiling", d2: "the drop falls and splashes into the bucket below", sound: "rain outside and drops splashing into a bucket" }),
  S(1, "en la cocina de Doña Marta", "bi", "b_kitchennight", { p: BI(`${KITCHEN} at night lit only by a flashlight, a towel and a bucket on the floor.`) }),
  S(1, "cada dos segundos", "bi", "b_bucket", { p: BI(`A plastic bucket on the tile floor of ${KITCHEN} at night, half full of water, ripples from a drop, a towel on the floor around it.`) }),
  S(1, "en una noche de tormenta", "bi", "st_storm", { q: "rain storm night window", p: BI("Heavy rain streaming down a window at night, lightning in the sky.") }),
  S(1, "Y el agujero por donde entraba esa agua", "bi", "b_roofnight", { p: BI(`${ROOF} at night in heavy rain, lit by a distant street lamp, water streaming toward the clogged drain.`) }),
  S(1, "a tres metros de acá", "bi", "b_drainfar", { p: BI(`${ROOF} seen from the doorway of the upstairs room, the drain funnel far away in the corner clogged with purple and brown leaves, a puddle around it.`), ov: { c: "ClChip", props: { text: "3 metros", alert: true } } }),
  // ── el parche del pintor
  S(2, "", "bi", "b_painterpatch", { p: BI(`${PAINTER} kneeling on ${ROOF} spreading black tar with a trowel in a round patch.`), anim: "the trowel spreads the black tar" }),
  S(2, "el mismo de las tres manos de pintura", "bi", "b_paintcans3", { p: BI("Three empty paint buckets with dried white drips stacked in the corner of a small patio next to a folded drop cloth.") }),
  S(2, "ya le había puesto un parche de brea", "bi", "b_tarpot", { p: BI("A small pot of thick black roofing tar with a trowel stuck in it on a concrete roof.") }),
  S(2, "Cobró cien dólares", "bi", "b_receipt100", { p: BI("A small handwritten receipt on a kitchen table with a lace tablecloth, a pair of reading glasses on it, the number 100 barely legible.") }),
  S(2, "y siguió goteando igual", "bi", "b_tarpatch", { p: BI(`A round black tar patch on a gray concrete roof, its edges lifted and cracked, rain water beading around it.`) }),
  // ── el loop del desagüe
  S(3, "", "bi", "b_funnel", { p: BI(`Close view of a roof rain drain funnel completely clogged with wet leaves, mud and twigs, water pooled around it.`) }),
  S(3, "tapando el desagüe del techo", "bi", "b_leavesclose", { p: BI("Extreme close view of wet purple jacaranda flowers and brown leaves packed into the mouth of a roof drain funnel.") }),
  S(3, "eso no lo esperaba", "cl", "c_funnel", { p: CLP(`He kneels on ${ROOF} beside the clogged drain funnel, pulling out a big wet clump of leaves and a bird nest, looking at the camera with raised eyebrows.`) }),
  // ── la promesa
  S(4, "", "av", ""),
  S(4, "cómo encontrar el agujero de verdad", "bi", "b_crackfind", { p: BI(`Close view of ${H} pointing a finger at a thin crack in a gray concrete roof next to a drain funnel.`) }),
  S(4, "y cómo cortar la gotera para siempre", "bi", "b_sealbead", { p: BI("Extreme close view of a neat gray sealant bead pressed into a crack on a concrete roof, with fresh white membrane starting around it.") }),
  S(4, "Con una manguera", "bi", "st_hose", { q: "garden hose water", p: BI("A green garden hose spraying water.") }),
  S(4, "un cartucho de sellador", "bi", "b_cartridge", { p: BI("A gray polyurethane sealant cartridge with a plain blank label loaded in a metal caulking gun, lying on a concrete roof.") }),
  S(4, "y un balde de membrana", "bi", "b_membranebucket", { p: BI("A white plastic bucket of liquid waterproofing membrane with a plain blank label, a roller and a folded roll of reinforcing fabric beside it, on a concrete roof.") }),
  S(4, "Así estaba el techo de la cocina", "bi", "b_stainbefore", { p: BI(`${STAIN}, seen from below at night with a flashlight.`), ov: { c: "ClChip", props: { text: "Antes", alert: true } } }),
  S(4, "Y así quedó", "cl", "c_glimpse4", { p: CLP(`He stands in ${KITCHEN} looking up at the ceiling, his raised hand and a paint roller blocking most of the view of a freshly painted clean white ceiling, smiling sideways at the camera.`), ov: { c: "ClChip", props: { text: "Después" } } }),
  // ── credibilidad + prueba del charco
  S(5, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de albañil" } } }),
  S(5, "Treinta años de albañil", "bi", "b_toolbelt", { p: BI("A worn leather tool belt with a hammer, a trowel and a yellow tape measure hanging on a nail in a small workshop.") }),
  S(5, "miles de techos", "bi", "st_rooftops", { q: "rooftops neighborhood", p: BI("The flat rooftops of a modest neighborhood seen from above, water tanks and antennas.") }),
  S(5, "Y al final le doy", "av", ""),
  S(5, "la prueba de cero dólares", "bi", "b_roofedge", { p: BI(`The view over the edge of ${ROOF} from the top of a ladder, a few puddles shining on the slab.`) }),
  S(5, "antes de subir a cualquier techo", "bi", "b_ladderup", { p: BI(`A metal ladder leaning against the wall of an old house up to a flat roof, ${H} gripping a rung.`) }),
  S(5, "Cinco segundos, mirando", "bi", "b_puddle", { p: BI(`A puddle of still water on a gray concrete roof reflecting the sky, an hour after rain, a dark ring around it.`), ov: { c: "ClChip", props: { text: "$0" } } }),
  C(6, "", "ClChapter", { n: 1, title: "El agua camina", sub: "por eso el parche no sirve" }),
  // ── el video de la pared
  C(7, "", "ClVideoRef", { thumb: I + "th_alhumedad.jpg", title: "La pared que se infla" }),
  S(7, "se lo dejo acá", "av", ""),
  S(7, "A la tercera semana de ese arreglo", "bi", "b_freshrender", { p: BI("The bottom meter of a living-room wall with fresh gray cement render drying, a calendar on the wall with three weeks crossed out.") }),
  S(7, "una noche de tormenta, me llamó la sobrina", "bi", "b_niecephone", { p: BI(`${NIECE} on her phone at night by a rainy window, worried.`) }),
  // ── la noche de tormenta
  S(8, "", "bi", "b_martakitchen", { p: BI(`${MARTA} in a robe standing in ${KITCHEN} at night holding a flashlight and a rag, a bucket on the floor catching drops from the ceiling.`) }),
  S(8, "Y en el techo de la cocina, una mancha marrón con anillos", "bi", "b_rings", { p: BI(`Extreme close view of ${STAIN}, the concentric darker rings clearly visible.`) }),
  S(9, "", "av", ""),
  S(9, "apague la luz de la cocina desde la llave general", "bi", "b_breaker", { p: BI("An old electrical breaker panel on a hallway wall with a hand switching off the main switch, lit by a flashlight.") }),
  S(9, "estaba alumbrando con una linterna", "bi", "b_flashlight", { p: BI(`An old woman's hand holding a flashlight pointing up at ${STAIN} in a dark kitchen.`) }),
  S(10, "", "bi", "b_wintertar", { p: BI(`${PAINTER} on a flat roof in winter light measuring with his eyes the spot above the kitchen, a pot of black tar beside him.`) }),
  S(10, "grande como una tapa de olla", "bi", "b_potlid", { p: BI("A black round tar patch on a concrete roof next to an old aluminum pot lid of the same size for comparison.") }),
  S(10, "Y a la primera lluvia, la gota de nuevo", "bi", "b_dripagain", { p: BI(`A drop hanging from ${STAIN} right above a plastic bucket.`) }),
  S(11, "", "bi", "b_martaask", { p: BI(`${MARTA} sitting at her kitchen table looking up at the stained ceiling with her hands open, puzzled.`) }),
  S(11, "Le dije: justamente por eso", "av", ""),
  // ── el agua camina
  C(12, "", "ClWaterWalk", { mode: "walk" }),
  S(13, "", "kf", "k_table", { p: BI("A wooden kitchen table slightly tilted, a glass of water being poured onto its high end, the water running along the table toward the low edge.") , d1: "the water spreads on the high end of the tilted table", d2: "the water runs along the table and drips off the low edge", sound: "water pouring and dripping on a wooden table" }),
  S(14, "", "bi", "b_slabcut", { p: BI("A cut section of an old concrete roof slab showing dark damp lines running inside it, with a bright light from the side.") }),
  S(14, "En un techo de tejas", "bi", "st_rooftiles", { q: "roof tiles", p: BI("Old clay roof tiles on a house roof.") }),
  C(15, "", "ClWaterWalk", { mode: "patch" }),
  S(15, "no pida algo para goteras", "bi", "b_tarcans", { p: BI("Cans of black roofing tar with plain blank labels stacked on a hardware store shelf.") }),
  S(15, "En el Manual le dejé la frase exacta", "av", "", { ov: { c: "ClChip", props: { text: "Manual · pág. 12" } } }),
  S(16, "", "bi", "b_wetroof", { p: BI("A wet slippery concrete roof right after rain, shining, a pair of worn work boots at the edge.") , ov: { c: "ClChip", props: { text: "Nunca mojado, ni solo", alert: true } } }),
  S(16, "Siempre con alguien abajo", "bi", "b_helper", { p: BI(`${NIECE} holding a metal ladder steady at the foot of an old house wall, looking up.`) }),
];
