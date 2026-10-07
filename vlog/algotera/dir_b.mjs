// DIRECTOR B — algotera: el desagüe (el nido, la pelota, el charco, la fisura) → la prueba de la manguera con Tomás → la lista + frase del
// mostrador → los pasos (mención 2, pág. 12) → tejas → lo que se hizo en la casa de Doña Marta (párrafos 17-43).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
import { H, KITCHEN, STAIN, ROOF, BOY, NIECE } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/algotera/";
export const SHOTS = [
  C(17, "", "ClChapter", { n: 1, label: "PASO", title: "Primero, el desagüe", sub: "la mitad de las goteras" }),
  S(17, "Si está tapado con hojas", "bi", "st_gutterleaves", { q: "gutter clogged leaves", p: BI("A rain gutter clogged with wet leaves.") }),
  S(18, "", "bi", "b_jacaranda", { p: BI(`${ROOF} covered with fallen purple jacaranda flowers and brown leaves, the drain funnel buried under them.`) }),
  S(18, "una pelota de tenis vieja", "bi", "b_nest", { p: BI("A bird nest, a faded old tennis ball and a clump of wet leaves and mud pulled out of a roof drain, lying on a concrete roof next to a work glove.") }),
  S(19, "", "bi", "st_jacaranda", { q: "jacaranda tree purple flowers", p: BI("A jacaranda tree in full purple bloom over a street.") }),
  S(19, "Don Ernesto, que subía todos los años con una escoba", "bi", "b_broomphoto", { p: BI("An old faded color photograph of a smiling Latin American man in a white shirt sweeping leaves off a flat roof with a broom, nineteen-nineties.") }),
  S(20, "", "bi", "b_halo", { p: BI(`${ROOF} seen from above: a dark round stain ring about two meters wide around the drain funnel where water used to stand.`) }),
  S(20, "una fisura fina, del largo de una mano", "bi", "b_crackhand", { p: BI(`Close view of ${H} laid flat on a concrete roof next to a thin crack the same length as the hand, at the edge of a dark water ring.`) }),
  S(20, "A tres metros del parche de brea del pintor", "bi", "b_twospots", { p: BI(`${ROOF} with a thin crack near the drain in the foreground and a round black tar patch far away in the background.`) }),
  S(21, "", "kf", "k_unclog", { p: BI(`Close view of a gloved hand pulling wet leaves out of a roof drain funnel on a concrete roof.`), d1: "the gloved hand grabs the wet leaves in the funnel", d2: "the leaves come out and the trapped water swirls down the drain", sound: "wet leaves and water gurgling down a drain" }),
  S(21, "eche un balde de agua", "bi", "b_bucketpour", { p: BI(`Close view of ${H} pouring a bucket of water onto a concrete roof near a clean drain funnel, the water flowing into it.`), anim: "the water flows into the drain" }),
  // ── la prueba de la manguera
  C(22, "", "ClChapter", { n: 2, label: "PASO", title: "La prueba de la manguera", sub: "de a una zona" }),
  C(23, "", "ClHoseTest", { zones: 4, hit: 1 }),
  S(24, "", "bi", "b_hoseroof", { p: BI(`${H} holding a green garden hose, wetting one marked area of a concrete roof, the rest of the roof dry.`), anim: "the water from the hose wets the area" }),
  S(24, "De a una zona, diez minutos cada una", "bi", "b_chalkzones", { p: BI("A flat concrete roof divided into four zones with chalk lines and numbers drawn on it, a garden hose coiled at one side.") }),
  S(25, "", "bi", "b_tomasdetective", { p: BI(`${BOY} standing in ${KITCHEN} holding a flashlight and staring up at ${STAIN} very seriously, like a detective.`) }),
  S(25, "Mojé la zona del parche de brea", "bi", "b_hosepatch", { p: BI("A garden hose wetting a round black tar patch on a concrete roof.") }),
  S(25, "Tomás gritó tan fuerte", "kf", "k_shout", { p: BI(`${BOY} in ${KITCHEN} pointing up at a drop falling from the ceiling, mouth wide open shouting with excitement.`), d1: "the boy looks up at the ceiling with the flashlight", d2: "he points up and shouts as a drop falls", sound: "a boy shouting in a kitchen and a drop splashing" }),
  // ── la lista
  C(26, "", "ClChapter", { n: 3, label: "PASO", title: "El arreglo", sub: "poco y bien puesto" }),
  C(27, "", "ClCheck", { title: "Lo que necesita", items: ["Cepillo duro y trapo", "Sellador poliuretánico + pistola", "Membrana líquida", "Tela de refuerzo", "Rodillo y brocha vieja"] }),
  S(28, "", "bi", "b_counter4", { p: BI("The counter of an ordinary neighborhood hardware store: a gray sealant cartridge with a plain blank label, a caulking gun, a 4 kg bucket of liquid membrane with a plain blank label and a folded roll of white reinforcing fabric.") }),
  S(28, "Anótela tal cual", "av", ""),
  // ── pasos
  S(29, "", "kf", "k_scrub", { p: BI(`Close view of ${H} scrubbing a thin crack in a gray concrete roof with a stiff brush, dust and moss coming off.`), d1: "the stiff brush scrubs along the crack", d2: "dust and moss come off and the crack is clean", sound: "a stiff brush scrubbing concrete" }),
  S(29, "El sellador no pega sobre mojado ni sobre polvo", "bi", "b_drycrack", { p: BI("Extreme close view of a clean dry thin crack in a concrete roof, ready to be sealed.") }),
  S(30, "", "kf", "k_caulk", { p: BI(`Close view of ${H} running a bead of gray sealant from a caulking gun into a thin crack in a concrete roof, pressing it in.`), d1: "the nozzle starts at one end of the crack", d2: "a gray bead fills the crack along its length", sound: "a caulking gun clicking and sealant squeezing" }),
  S(30, "Un cordón del ancho de un lápiz", "bi", "b_pencilbead", { p: BI("A pencil lying next to a fresh gray sealant bead in a crack on a concrete roof, the same width.") }),
  C(31, "", "ClMembrane", {}),
  S(31, "apoye encima la tela de refuerzo", "bi", "b_fabric", { p: BI(`Close view of ${H} laying a strip of white reinforcing fabric over fresh wet liquid membrane on a concrete roof and pressing it with a brush.`), anim: "the brush presses the fabric into the membrane" }),
  S(32, "", "bi", "st_rollerroof", { q: "painting roof waterproofing roller", p: BI("A roller applying waterproof coating on a roof.") }),
  S(32, "Si la primera fue de norte a sur", "bi", "b_crossroll", { p: BI("A flat roof area freshly coated with white membrane showing roller marks going one way, and a roller starting the next coat crosswise.") }),
  S(33, "", "bi", "st_sunsky", { q: "sunny clear sky", p: BI("A clear sunny sky with no clouds.") }),
  S(33, "y hace globos", "bi", "b_bubblesmem", { p: BI("A white roof membrane with soft bubbles and blisters where it dried too fast in the sun.") }),
  S(34, "", "bi", "b_retest", { p: BI(`${H} holding a hose over a freshly sealed and white-coated patch of a concrete roof on a sunny day.`) }),
  C(35, "", "ClBookPage", { page: I + "book_p12.jpg", pageNo: 12, qr: I + "qr.jpg", stamp: "Manual · página 12" }),
  C(36, "", "ClCheck", { title: "El arreglo entero", items: ["Primero el desagüe", "Manguera: de a una zona", "Fisura limpia y seca", "Sellador apretado", "Membrana + tela + 2 manos"], fast: true }),
  // ── tejas
  S(37, "", "bi", "b_tilebroken", { p: BI("A clay tile roof with one broken tile shifted out of place, a gap showing beneath it.") }),
  S(37, "unos cincuenta centímetros más alto", "bi", "b_tilemeasure", { p: BI(`${H} holding a yellow tape measure up the slope of a clay tile roof from a wet spot.`) }),
  // ── lo que se hizo
  S(38, "", "cl", "c_sealroof", { p: CLP(`He kneels on ${ROOF} on a sunny day sealing a crack near the clean drain with a caulking gun, a bucket of membrane beside him.`) }),
  S(38, "la tela, y dos manos más, cruzadas", "cl", "c_rollroof", { p: CLP(`He rolls white liquid membrane over a patch of ${ROOF} around the drain with a long-handled roller, sunny day.`), anim: "he rolls the membrane across the patch" }),
  S(39, "", "kf", "k_peelpatch", { p: BI(`Close view of ${H} lifting the cracked edge of an old black tar patch off a concrete roof with a putty knife, water trapped underneath.`), d1: "the putty knife lifts the edge of the tar patch", d2: "the patch peels up showing water trapped under it", sound: "tar peeling and a little water" }),
  S(40, "", "bi", "b_drainguard", { p: BI("A wire mesh dome guard fitted over a roof drain funnel on a clean concrete roof, a few purple jacaranda flowers caught on top of it.") }),
  S(40, "que se lo llevó a la escuela", "bi", "b_nestschool", { p: BI(`${BOY} carrying a bird nest carefully in both hands in front of a school door, smiling proudly.`) }),
  S(41, "", "bi", "b_cake", { p: BI(`${MARTA} handing a plate with a slice of cake over a low wall to an older neighbor woman with gray hair, both smiling, a jacaranda tree behind.`) }),
  S(42, "", "bi", "b_tomasbored", { p: BI(`${BOY} in ${KITCHEN} staring up at a dry ceiling with a flashlight, looking a little disappointed.`) }),
  S(43, "", "bi", "b_drykitchen", { p: BI(`${KITCHEN} at night during rain, a dry floor, the bucket put away upside down in a corner, the ceiling freshly painted white.`) }),
  C(43, "Claudio, hoy voy a dormir tranquila", "ClBeforeAfter", { before: I + "b_rings.jpg", after: I + "b_rings_ab.jpg", note: "la tormenta siguiente" }),
];
