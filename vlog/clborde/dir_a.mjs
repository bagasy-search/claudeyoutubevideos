// DIRECTOR A — clborde: MINUTO 1 diseñado como pieza aparte (Claudio a cámara + el espejito en el seg 0 → "Está vivo" con sello →
// sábado/jueves → PROMESA con el antes/después a la vista en el seg 9 → hotel y 120 inodoros → loop 1 (cloro = color) → ráfaga →
// "¡Blanco!" → loop 2 (agujero escondido) + loop 3 (la mezcla) → capítulo) + EL ARREGLO COMPLETO + CTA 1 (párrafos 0-15).
//   kf = detalle agnes 2.5-flash desde foto base (foley nativo) · vl = Claudio hablando con SU voz (agnes 2.5, ancla) · cl = foto con
//   Claudio · bi = foto gpt (stock real si q; anim = movimiento agnes v2.0) · c = componente Cl* · av = avatar
import { S, BI, CLP, BATH, BOTTLE, RIM } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const G = "a hand in a blue nitrile glove";
const I = "img/clborde/";
export const SHOTS = [
  // ── 0:00 · Claudio a cámara con el espejito + la mugre chorreando (la cara está en el cuadro del seg 1)
  S(0, "", "vl", "m1", { a: `kneels on the tile floor beside the open white toilet in ${BATH}, holding a small round hand mirror up near his face toward the camera, eyebrows drawn together, dead serious, the toilet seat up.`, act: "He holds the little mirror up toward the camera and says it low and serious, then leans a little closer to the camera and whispers the last two words.", b: "he has leaned a little closer to the camera, the little mirror lowered to his chest, mouth closed, a grave look, eyebrows raised." }),
  S(0, "del borde no es mugre", "kf", "k_mirror", { p: BI(`Close view of ${G} sliding a small round hand mirror up under the rim of a white toilet in a hotel bathroom; the mirror shows ${RIM}, thick black slime streaks running down out of every hole, wet and glistening. The seat is up, the white bowl and a bit of the beige tile floor are visible.`), d1: "the gloved hand slides the little mirror up under the rim", d2: "the mirror tilts and the black slime dripping out of the rim holes fills it", sound: "a small plastic tap on porcelain and a slow wet drip" }),
  S(0, "Está vivo", "vl", "m1", { ov: { c: "ClStampOv", props: { text: "ESTÁ VIVO" } } }),
  // ── el sábado / el jueves
  S(1, "", "bi", "st_scrubbowl", { q: "scrubbing toilet brush", p: BI(`${G} scrubbing the inside of a white toilet bowl hard with a toilet brush, foam on the water, a hotel bathroom with beige tiles.`), ov: { c: "ClChip", props: { text: "Sábado" } } }),
  S(1, "y el jueves vuelve", "bi", "b_thursday", { p: BI(`Close view of ${RIM} seen from a low angle with a flashlight: thin black streaks are starting again under three of the holes, the rest of the rim still white.`), anim: "the flashlight beam drifts slowly along the rim; nothing else moves", ov: { c: "ClChip", props: { text: "Jueves", alert: true } } }),
  // ── LA PROMESA (seg 7,4): Claudio a cámara + el antes/después del MISMO borde con la medida
  S(2, "", "av", ""),
  C(2, "Media taza", "ClBeforeAfter", { before: I + "b_rimdirty.jpg", after: I + "b_rimclean.jpg", note: "½ taza · 30 minutos" }),
  // ── el hotel y los 120 inodoros (loop 1: el cloro le saca el color)
  S(3, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de conserje de hotel" } } }),
  S(3, "de mantenimiento en un hotel", "cl", "c_cart", { p: CLP(`He pushes a gray hotel maintenance cart with a toolbox, a mop bucket and folded towels down a hotel corridor with navy carpet and numbered wooden doors, glancing at the camera mid-step.`), anim: "he keeps pushing the cart slowly down the corridor" }),
  C(3, "Eran ciento veinte inodoros", "ClHallway3D", { total: 120, floor: 3, title: "inodoros", sub: "cada uno, todos los días" }),
  S(3, "Y el cloro nunca", "bi", "st_bleach", { q: "pouring bleach toilet", p: BI("A gloved hand pouring clear liquid from a plain white plastic jug with a blank label into a white toilet bowl, a splash in the water.") }),
  S(3, "lo mató", "bi", "b_grayholes", { p: BI(`Close view of ${RIM} after bleach: the holes look pale gray instead of black, faint dark shadows still deep inside each hole.`), anim: "a drop of water slowly forms and falls from one hole; nothing else moves" }),
  C(3, "Le saca el color", "ClRimCutaway3D", { mode: "bleach", labels: { channel: "Sigue vivo" }, orbit: 0.3 }),
  S(3, "Ya le voy a mostrar", "av", ""),
  // ── la ráfaga
  S(4, "", "kf", "k_lid", { p: BI(`Close view of two hands in blue nitrile gloves lifting the heavy white porcelain lid off a toilet tank in a hotel bathroom, the clear water and the tall overflow tube appearing inside.`), d1: "the gloved hands lift the tank lid", d2: "the lid comes up and the water and the overflow tube appear", sound: "the heavy scrape and clunk of a porcelain lid" }),
  S(4, "Media taza por un tubo", "kf", "k_pour", { p: BI(`Close view inside the open tank of a white toilet, the porcelain lid set aside: the tall open overflow tube stands in the middle, and ${G} tips a clear glass measuring cup, pouring a thin stream of clear liquid right down into the top of the tube.`), d1: "the gloved hand tips the measuring cup over the overflow tube", d2: "the clear liquid runs down into the tube", sound: "a thin stream of liquid pouring into a pipe" }),
  C(4, "del tanque que usted nunca miró", "ClRimCutaway3D", { mode: "flow", labels: { tube: "Tubo de rebalse" }, orbit: 0.5, start: 2 }),
  S(4, "Un buen rocío", "kf", "k_spray", { p: BI(`Low close view under the rim of a white toilet: ${G} holds ${BOTTLE} with a white trigger sprayer pointed up under the rim at the row of black-crusted holes.`), d1: "the sprayer points up under the rim", d2: "a fine mist hits the holes and they turn wet and drip", sound: "two quick squirts of a trigger spray bottle" }),
  S(4, "Empieza a hacer espuma", "kf", "k_fizz", { p: BI(`Extreme close view of ${RIM}: every hole is wet and covered with white foam bubbling up out of the black slime, tiny bubbles running down the porcelain.`), d1: "white foam starts to bubble out of the holes", d2: "the foam grows and runs down over the black streaks", sound: "a soft continuous fizzing and popping of bubbles" }),
  S(4, "en los agujeros", "bi", "b_fizzmacro", { q: "foam bubbles close up", p: BI(`Extreme close view of black slime on white porcelain under a toilet rim covered with a thick layer of white fizzing bubbles lifting it up.`), anim: "the white bubbles slowly rise and lift the black slime" }),
  C(4, "Treinta minutos", "ClTimer30", { minutes: 30, fast: true }),
  S(4, "un cepillito", "bi", "st_toothbrush", { q: "scrubbing toothbrush cleaning", p: BI(`${G} scrubbing ${RIM} with an old toothbrush, white foam on the bristles.`) }),
  S(4, "una descarga", "bi", "st_flush", { q: "toilet flushing water", p: BI("Looking down into a white toilet bowl at the moment of flushing: clear water swirling down, a gloved hand on the handle at the edge of the frame.") }),
  // ── 0:38 · ¡BLANCO! (Claudio con el espejo, y el reflejo blanco)
  S(5, "", "vl", "m2", { a: `kneels beside the white toilet in ${BATH} holding the small round hand mirror under the rim, looking into it, his mouth open in delight.`, act: "He looks into the mirror, then turns to the camera beaming, eyes wide, laughing with surprise, holding the mirror up.", b: "he is turned toward the camera, grinning and nodding, holding the little mirror up beside his face." }),
  S(5, "Blanco", "kf", "k_white", { p: BI(`Extreme close view of a small round hand mirror held under a toilet rim: in the reflection ${RIM}, every hole perfectly clean and bright white, a few drops of clear water.`), d1: "the mirror shows the clean white holes", d2: "the mirror tilts along the rim showing more clean white holes", sound: "a drop of water and a soft plastic tap" }),
  // ── loops 2 y 3
  S(6, "", "vl", "m2"),
  S(6, "en una semana vuelve", "bi", "b_backweek", { p: BI(`Close view of ${RIM}: fresh black streaks have come back under every hole, as if they had never been cleaned, a toilet brush leaning against the bowl.`), anim: "a thin black drip slowly creeps down from one hole; nothing else moves" }),
  C(6, "Porque eso come", "ClRimCutaway3D", { mode: "alive", labels: { tube: "¿Por dónde come?" }, orbit: 0.4 }),
  C(6, "Y hay una mezcla", "ClNeverMix", { a: "?", b: "?", verdict: "Nunca" }),
  S(6, "Las dos cosas se las muestro", "av", ""),
  C(6, "Primero el arreglo entero", "ClChapter", { n: 1, title: "El arreglo entero", sub: "de principio a fin" }),
  // ── 0:56 · EL ARREGLO
  S(7, "", "av", ""),
  S(7, "Guantes de goma", "kf", "k_gloves", { p: BI(`Close view at chest height in ${BATH}: two hands pulling on blue nitrile gloves, the right hand tugging the cuff of the left glove up the wrist, the navy sleeve of a work jacket at the edge.`), d1: "the hand tugs the blue glove cuff up", d2: "the cuff snaps against the wrist", sound: "the stretch and snap of a nitrile glove" }),
  S(7, "abra la ventana", "bi", "st_window", { q: "opening window curtain", p: BI(`${G} pushing open a small frosted bathroom window in a hotel bathroom, daylight coming in.`) }),
  S(7, "y agarre la botella marrón", "bi", "b_grab", { q: "cleaning supplies cart", p: BI(`A hotel housekeeping cart in a corridor: ${G} picking up ${BOTTLE} from among spray bottles, rolls of toilet paper and folded towels.`), anim: "the gloved hand lifts the brown bottle slowly off the cart" }),
  C(7, "Agua oxigenada común", "ClBottle3D", { title: "Agua oxigenada 3 %", sub: "la común de la farmacia", tag: "la de siempre" }),
  S(7, "Nada raro", "av", ""),
  S(7, "nada que tenga que encargar", "bi", "st_package", { q: "package delivery doorstep", p: BI("A cardboard delivery box sitting on a front doorstep beside a doormat.") }),
  // ── la pastilla afuera
  S(8, "", "av", ""),
  S(8, "sáquela primero", "bi", "b_fishout", { p: BI(`${G} lifting a soggy blue tablet out of the blue water of an open toilet tank, drops of blue water falling from it.`), anim: "the gloved hand lifts the dripping blue tablet slowly out of the water" }),
  S(8, "y tire la cadena dos o tres veces", "bi", "st_flush2", { q: "flushing toilet handle", p: BI("A hand pressing the chrome flush handle of a white toilet, the tank lid off.") }),
  C(8, "Algunas traen cloro", "ClNeverMix", { a: "Pastilla con cloro", b: "Otro producto", verdict: "Nunca juntos", short: true }),
  // ── el tubo de rebalse
  S(9, "", "cl", "c_tanklid", { p: CLP(`He lifts the heavy white porcelain lid off the toilet tank with both gloved hands in ${BATH} and sets it down on a folded white towel on the floor, looking down into the tank.`) }),
  S(9, "Ve ese tubo alto", "bi", "b_overflow", { q: "inside toilet tank", p: BI("Looking down into the open tank of a white toilet: clear water, the tall open plastic overflow tube standing up in the middle with the thin refill hose clipped to it, the fill valve on the left, the flapper at the bottom.") }),
  C(9, "Es el tubo de rebalse", "ClRimCutaway3D", { mode: "flow", labels: { tube: "Tubo de rebalse", channel: "Canal del borde", holes: "Cada agujero", amount: "½ taza" }, orbit: 0.45 }),
  S(9, "y sale por cada uno de esos agujeritos", "bi", "b_holesdrip", { p: BI(`Extreme close view of ${RIM}: clear liquid running out of every hole and down the porcelain in thin wet lines, a few bubbles starting on the black gunk.`), anim: "the clear liquid keeps running out of the holes" }),
  S(9, "Ahí no llega ningún cepillo", "av", ""),
  // ── espejo y rocío
  S(10, "", "bi", "st_spraybath", { q: "spray bottle cleaning toilet", p: BI(`${G} spraying ${BOTTLE} under the rim of a white toilet, mist in the air.`) }),
  C(10, "hasta que todos queden mojados", "ClRimJets", { mode: "spray", label: "Hasta que goteen" }),
  C(10, "Es más o menos otra media taza", "ClMeasureCup", { fill: 0.5, label: "½ taza", where: "debajo del borde" }),
  C(10, "Y una taza va directo", "ClMeasureCup", { fill: 1, label: "1 taza", where: "en el agua" }),
  S(10, "No tiene espejito", "bi", "b_phonebag", { p: BI(`A smartphone sealed inside a clear zip sandwich bag held under the rim of a white toilet by ${G}, its screen showing the camera view of the rim holes.`), anim: "the hand tilts the bagged phone slightly; nothing else moves" }),
  // ── 30 minutos
  C(11, "", "ClTimer30", { minutes: 30, label: "Sin tirar la cadena" }),
  S(11, "Vaya a tomarse un café", "cl", "c_coffee", { p: CLP(`He leans on the doorframe of a hotel bathroom, still in his blue nitrile gloves, holding a white coffee mug and glancing at the toilet with a satisfied little smile, the corridor behind him.`) }),
  S(11, "Va a ver que hace espuma", "bi", "b_fizzbowl", { q: "cleaning foam toilet", p: BI(`Close view of ${RIM} and the inside of the bowl: white foam fizzing on every dark spot, small bubbles clinging to the porcelain and a ring of foam on the water.`), anim: "the foam bubbles grow and pop very slowly" }),
  // ── cepillo, palito
  S(12, "", "bi", "st_scrubholes", { q: "toothbrush cleaning toilet", p: BI(`${G} scrubbing ${RIM} with a small stiff brush while the other hand holds a small mirror underneath.`) }),
  S(12, "mirando en el espejito", "cl", "c_mirrorscrub", { p: CLP(`He kneels at the toilet in ${BATH}, one gloved hand holding the small round mirror under the rim, the other scrubbing the holes with an old toothbrush, squinting at the reflection with concentration.`) }),
  S(12, "tire la cadena", "bi", "st_flush3", { q: "toilet flush swirl", p: BI("Clear water swirling down a clean white toilet bowl right after a flush.") }),
  S(13, "", "bi", "b_stirrer", { p: BI(`Extreme close view of ${RIM}: ${G} gently poking a thin white plastic coffee stirrer into one rim hole that is still plugged with black gunk.`), anim: "the stirrer pushes gently a little deeper into the hole" }),
  C(13, "Nunca algo de metal", "ClDoDont", { yes: { label: "Palito de plástico", img: I + "b_stirrer.jpg" }, no: { label: "Nada de metal", img: I + "b_metal.jpg" } }),
  S(13, "El metal raya la porcelana", "bi", "b_metal", { p: BI("Extreme close view of a scratched white porcelain toilet rim: thin gray scratch lines around one hole, a screwdriver tip resting next to it.") }),
  S(13, "y cada raya es un lugar nuevo", "av", ""),
  // ── el resumen
  C(14, "", "ClCheck", { title: "El arreglo entero", items: ["½ taza por el tubo", "Rociar hasta que goteen", "1 taza en el agua", "30 minutos sin descargar", "Cepillito y descarga"] }),
  // ── CTA 1: el arreglo completo, gratis en la página
  S(15, "", "av", ""),
  C(15, "El Frasco Marrón de Claudio", "ClBookPage", { page: I + "book_p9.jpg", pageNo: 9, stamp: "Gratis en la página" }),
  C(15, "El link está en la descripción", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg" }),
];
