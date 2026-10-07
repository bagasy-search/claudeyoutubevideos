// DIRECTOR A — fbgoteras (El Constructor Libre): MINUTO 1 (el cartucho entero en el frasco con acetona → bola de goma + sello "ERROR"
// en el seg 0 → la grieta, el balde adentro, la mancha → PROMESA: el balde de agua resbala → el vecino → ráfaga → "¡mira cómo corre!"
// → 3 loops) + LA RECETA (dos mezclas, limpiar, ve, seco, masilla con acetona por tramos, líquida con aguarrás, 3 manos, balde)
// + LA CUENTA + CTA 1 = QR (párrafos 0-28).
import { S, BI, CLP } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbgoteras/";
export const ROOF = "a flat gray concrete rooftop terrace of a small house on a sunny day, low parapet walls";
export const CRACK = "a long thin crack across the gray concrete roof slab";
export const SEALED = "a crack on a flat gray concrete roof filled and coated with a 30 cm wide band of matte white silicone coating";
export const JAR = "a glass jar";
export const HANDS = "working hands in blue nitrile gloves of a man in an olive-green shirt with rolled sleeves";
export const NEIGHBOR = "a sturdy 65-year-old Latin American neighbour, bald on top with gray hair at the sides, a thick gray mustache, a short-sleeved light-blue checked shirt with a pen in the pocket, glasses hanging on a cord";
export const SHOTS = [
  // ── 0:00 · el error en el segundo 0
  S(0, "", "bi", "b_jarpour", { p: BI(`Close view of ${HANDS} squeezing a whole tube of white silicone sealant into ${JAR} and pouring clear acetone over it on a workbench.`), anim: "the acetone pours into the silicone", ov: { c: "ClStampOv", props: { text: "ERROR" } } }),
  S(0, "para las goteras", "bi", "st_drip", { q: "water dripping ceiling", p: BI(`Water dripping from a ceiling.`) }),
  S(0, "no hagas el frasco entero", "av", ""),
  S(0, "Ése es el error del video que viste", "bi", "b_gumball", { p: BI(`A wooden stick pulled out of ${JAR} with a stretchy rubbery white ball of cured silicone stuck on the end.`) }),
  // ── la grieta
  S(1, "", "bi", "b_crack", { p: BI(`Close view of ${CRACK}, dirty with dust and a little green moss, in bright sunlight.`) }),
  S(1, "a la pieza de atrás", "cl", "c_pointcrack", { p: CLP(`He crouches on ${ROOF}, pointing at ${CRACK} with one finger, looking at the camera, serious.`) }),
  S(1, "Por acá entraba el agua", "bi", "b_crackwater", { p: BI(`Close view of rainwater trickling into ${CRACK} and disappearing inside it.`), anim: "water trickles into the crack" }),
  S(1, "el balde en el piso", "bi", "b_bucketdrip", { q: "bucket catching roof leak", p: BI(`A plastic bucket on a bedroom floor catching drops of water falling from the ceiling.`), anim: "a drop falls into the bucket" }),
  S(1, "cada vez más grande", "bi", "b_stainbig", { q: "ceiling water damage", p: BI(`A large brown water stain with a dark ring on a white bedroom ceiling, flaking paint around it.`) }),
  S(1, "la mancha en el techo", "bi", "b_stain", { q: "water stain ceiling", p: BI(`A brown water stain spreading on a white bedroom ceiling, paint bubbling at the center.`) }),
  // ── 0:12 · LA PROMESA
  S(2, "", "bi", "b_bucketthrow", { p: BI(`${HANDS} throwing a full bucket of water onto ${SEALED}; the water splashes and runs off over it.`) }),
  S(2, "Resbala", "bi", "b_runoff", { p: BI(`Close view of water sheeting across ${SEALED}, flowing over it toward the drain.`) }),
  S(2, "Ni una gota adentro", "bi", "b_dryceiling", { q: "white ceiling bedroom", p: BI(`A clean dry white bedroom ceiling with a faint old stain, an empty bucket on the floor below.`) }),
  S(2, "Un cartucho de silicona", "bi", "st_siliconetube", { q: "silicone caulk tube", p: BI(`A tube of silicone sealant on a table.`) }),
  S(2, "un chorrito de solvente", "bi", "b_solvents", { p: BI(`A small bottle of acetone and a bottle of mineral turpentine with plain labels next to a silicone cartridge on a roof.`) }),
  S(2, "Unos tres dólares", "c", "ClReceipt", { props: { lines: [["Cartucho de silicona", "≈ 2 dólares"], ["Acetona", "un chorrito"], ["Aguarrás", "un vaso"]], total: ["Todas las grietas finas", "≈ 3 dólares"] } }),
  C(2, "para cerrar todas las grietas finas de la terraza", "ClBeforeAfter", { before: I + "b_crack.jpg", after: I + "b_sealed.jpg", note: "masilla + tres manos líquidas" }),
  // ── el vecino
  S(3, "", "bi", "b_neighborladder", { q: "man climbing ladder roof", p: BI(`${NEIGHBOR} climbing up the last rungs of an aluminum ladder onto a flat concrete roof, skeptical face.`) }),
  S(3, "porque no me creía", "bi", "b_neighborcrouch", { p: BI(`${NEIGHBOR} crouching on a flat roof peering at a white-coated crack through his glasses, frowning.`) }),
  S(3, "un techista con membrana nueva", "bi", "st_roofer", { q: "roofer working flat roof", p: BI(`A roofer working on a flat roof membrane.`) }),
  S(3, "Le mostré el cartucho vacío", "cl", "c_emptytube", { p: CLP(`He holds up an empty squeezed silicone cartridge toward a mustached neighbour in a light-blue checked shirt on a sunny flat roof, laughing.`) }),
  // ── 0:22 · RÁFAGA
  S(4, "", "bi", "b_wirebrush", { q: "wire brush cleaning concrete", p: BI(`Close view of ${HANDS} scrubbing ${CRACK} hard with a wire brush, dust and moss flying.`), anim: "the wire brush scrubs, dust flies" }),
  S(4, "La abro en forma de ve", "bi", "b_vgroove", { p: BI(`The tip of an old flat screwdriver scraping a crack in a concrete roof into a small V-shaped groove.`), anim: "the screwdriver scrapes along the crack" }),
  S(4, "Silicona y un chorrito de acetona", "bi", "b_lid", { p: BI(`A dollop of white silicone squeezed into a plastic jar lid, a few drops of clear acetone falling on it.`) }),
  S(4, "Cepillo la grieta", "bi", "st_wirebrush", { q: "wire brush concrete", p: BI(`A wire brush scrubbing concrete.`) }),
  S(4, "Revuelvo", "bi", "b_stirlid", { p: BI(`A popsicle stick stirring white silicone and acetone in a plastic lid into a soft paste.`), anim: "the stick stirs fast" }),
  S(4, "Relleno con el dedo", "bi", "b_fingerfill", { p: BI(`Extreme close view of a gloved fingertip pressing white silicone paste deep into a V-groove crack in concrete.`), anim: "the finger pushes the paste along the crack" }),
  S(4, "la versión líquida, con pincel", "bi", "b_brushcoat", { q: "painting roof coating brush", p: BI(`A wide brush laying a creamy white liquid silicone coat over a filled crack on a gray concrete roof.`), anim: "the brush spreads the white coat" }),
  S(4, "tres manos", "bi", "b_threecoats", { p: BI(`Top view of a 30 cm wide band of thick white coating along a crack on a gray concrete roof, the brush resting beside it.`) }),
  // ── el grito
  S(5, "", "bi", "b_bucketthrow2", { p: BI(`A wide splash of water thrown from a bucket over ${SEALED}, droplets flying in the sun.`) }),
  S(5, "mira cómo corre el agua", "cl", "c_wow", { p: CLP(`He stands on ${ROOF} with an empty bucket, pointing at the water running off a white-coated crack, open-mouthed delighted grin, looking at the camera.`) }),
  // ── 0:40 · 3 loops
  S(6, "", "av", ""),
  S(6, "Por qué la acetona te arruina el frasco", "bi", "b_jarlump", { p: BI(`Close view of ${JAR} with a lump of white rubbery cured silicone stuck to the bottom and a stick standing in it.`), ov: { c: "ClChip", props: { text: "1 · La acetona y el frasco", alert: true } } }),
  S(6, "la gotera no está donde gotea", "bi", "b_measure", { q: "tape measure ceiling", p: BI(`A tape measure stretched along a ceiling from a wall to a water stain.`), ov: { c: "ClChip", props: { text: "2 · No está donde gotea" } } }),
  S(6, "Y lo que pasó cuando el vecino", "bi", "b_wetroof", { p: BI(`${NEIGHBOR} kneeling on a wet gray roof with puddles, squeezing silicone into a crack, gray clouds.`), ov: { c: "ClChip", props: { text: "3 · Lo del vecino", alert: true } } }),
  // ── RECETA
  C(7, "", "ClChapter", { n: 1, title: "La receta entera", sub: "dos mezclas, no una" }),
  S(7, "Lo que necesitas", "c", "ClCheck", { props: { title: "Lo que necesitas", items: ["Cartucho de silicona (acética o neutra)", "Acetona", "Aguarrás mineral", "Frasco de vidrio + palito + pincel", "Guantes y cepillo de alambre"] } }),
  S(7, "Un frasco de vidrio con tapa", "bi", "b_kit", { p: BI(`A silicone cartridge, a caulking gun, a small bottle of acetone, a bottle of turpentine, ${JAR}, a brush, blue gloves and a wire brush laid out on a gray concrete roof in the sun.`) }),
  S(8, "", "av", ""),
  S(8, "Una masilla espesa, con acetona", "c", "ClSplit", { props: { img: I + "b_twomixes.jpg", left: ["MASILLA", "silicona + acetona"], right: ["LÍQUIDA", "silicona + aguarrás"] } }),
  S(8, "Cada solvente hace una cosa distinta", "bi", "b_twobottles", { p: BI(`Two plain-labeled bottles side by side on a roof parapet, acetone and turpentine, the sky behind.`) }),
  S(9, "", "bi", "b_brushclose", { p: BI(`Extreme close view of a wire brush scraping loose grit and green moss out of ${CRACK}.`), anim: "the brush scrapes the grit out" }),
  S(9, "los pedacitos de revoque que se mueven", "bi", "b_looseflakes", { p: BI(`A gloved hand picking loose flakes of old render from the edge of a roof crack.`) }),
  S(9, "la tierra no se pega a nada", "bi", "st_sweeproof", { q: "sweeping dust broom", p: BI(`A broom sweeping dust off a concrete surface.`) }),
  S(10, "", "bi", "b_vgroove2", { p: BI(`Extreme close view of a screwdriver tip widening a hairline crack in concrete into a V-groove, small chips falling.`), anim: "the tip scrapes and chips fall" }),
  S(10, "una grieta finita como un pelo", "bi", "b_hairline", { p: BI(`Extreme macro of a hairline crack in gray concrete, as thin as a hair, a coin beside it for scale.`) }),
  S(10, "Abierta en ve", "c", "ClPins", { props: { img: I + "b_vsection.jpg", pins: [{ x: 0.5, y: 0.35, label: "abierta en V" }, { x: 0.5, y: 0.75, label: "la masilla se agarra de los dos lados" }] } }),
  S(11, "", "av", ""),
  S(11, "un día entero de sol", "bi", "st_sunroof", { q: "sun over rooftop", p: BI(`Bright sun over a flat rooftop.`), ov: { c: "ClStampOv", props: { text: "1 DÍA DE SOL" } } }),
  S(11, "Si la grieta tiene agua adentro", "bi", "b_wetcrack", { p: BI(`Close view of a dark damp crack in a concrete roof still holding water after rain.`) }),
  S(12, "", "bi", "b_squeezelid", { p: BI(`${HANDS} squeezing a fat bead of white silicone from a caulking gun into a plastic jar lid.`) }),
  S(12, "como una cucharadita", "bi", "b_teaspoon", { p: BI(`A teaspoon of clear acetone being poured onto white silicone in a plastic lid.`) }),
  S(12, "Revuelvo rápido con el palito", "bi", "b_stirlid2", { p: BI(`Close view of a popsicle stick whipping white silicone and acetone in a lid.`), anim: "fast stirring" }),
  S(13, "", "bi", "b_stretch", { p: BI(`Extreme close view of silicone paste stretching in rubbery strings like chewing gum from a stick lifted out of a lid.`), anim: "the paste stretches into strings" }),
  S(13, "sólo lo que voy a usar en cinco minutos", "bi", "b_timer", { p: BI(`A phone timer showing 5:00 next to a plastic lid of silicone paste on a roof.`), ov: { c: "ClStampOv", props: { text: "5 MINUTOS" } } }),
  S(14, "", "bi", "b_fingerfill2", { p: BI(`${HANDS} pressing white silicone paste into a V-groove crack with a gloved fingertip, working along it.`), anim: "the finger presses along the crack" }),
  S(14, "mojado en agua con detergente", "bi", "b_soapdip", { p: BI(`A gloved fingertip dipped into a cup of soapy water before smoothing silicone.`) }),
  S(14, "un poquito de rebaba a los costados", "bi", "b_filledcrack", { p: BI(`Close view of a crack on a concrete roof neatly filled with white silicone, a slight ridge spreading on each side.`) }),
  S(15, "", "cl", "c_sections", { p: CLP(`He kneels on ${ROOF} filling a crack with silicone from a lid, a half-meter section done behind him, concentrating.`) }),
  S(16, "", "bi", "b_overnightroof", { q: "rooftop at dusk city", p: BI(`A flat concrete roof at dusk with a filled white crack line across it, the city lights coming on.`) }),
  S(17, "", "bi", "b_jartube", { p: BI(`A whole tube of white silicone squeezed out into ${JAR} on a workbench.`), anim: "the silicone coils into the jar" }),
  S(17, "le agrego aguarrás de a poco", "bi", "b_turps", { p: BI(`Clear mineral turpentine poured slowly into ${JAR} of white silicone while a stick stirs it.`), anim: "the turpentine pours, the stick stirs" }),
  S(17, "entre ciento cincuenta y doscientos mililitros", "c", "ClPasteRecipe", { props: { a: 1, b: 1, aLabel: "cartucho", bLabel: "vaso de aguarrás", note: "150 a 200 ml" } }),
  S(18, "", "bi", "b_whisk", { p: BI(`Close view of a stick beating white silicone and turpentine in ${JAR} into a smooth creamy liquid.`), anim: "the stick beats the mix" }),
  S(18, "como un yogur espeso", "bi", "b_yogurt", { p: BI(`A stick lifted out of ${JAR}, a thick white creamy liquid like yogurt dripping off it in ribbons.`) }),
  S(18, "te dura toda la tarde en el frasco", "bi", "b_jarlid", { p: BI(`${JAR} of white liquid silicone with its lid screwed on, resting in the shade on a roof.`) }),
  S(19, "", "bi", "b_paintband", { p: BI(`${HANDS} brushing white liquid silicone in a wide band over a filled crack on a gray concrete roof.`), anim: "the brush paints the band" }),
  S(19, "quince centímetros para cada lado", "c", "ClPins", { props: { img: I + "b_sealed.jpg", pins: [{ x: 0.3, y: 0.5, label: "15 cm" }, { x: 0.7, y: 0.5, label: "15 cm" }] } }),
  S(19, "Tres manos en total", "bi", "b_coat3", { p: BI(`A brush laying a third thin coat of white silicone over a band on a concrete roof, the earlier coats visible.`) }),
  S(20, "", "bi", "b_bucketfill", { q: "filling bucket with water hose", p: BI(`A bucket being filled with water from a garden hose on a roof.`) }),
  S(20, "alguien abajo", "bi", "b_lookup", { q: "woman looking up at ceiling", p: BI(`A woman in a bedroom looking up at the ceiling with a flashlight, a bucket beside her.`) }),
  // ── el final
  S(21, "", "bi", "b_sealed", { p: BI(`Top view of ${SEALED}, sunlit, the roof dry around it.`) }),
  S(21, "como si no existiera", "bi", "b_runoff2", { p: BI(`Low angle view of water flowing over a white-coated crack on a gray roof toward the drain, sparkling in the sun.`), anim: "the water flows over the white band" }),
  S(21, "Abajo, seco", "cl", "c_thumbsup", { p: CLP(`He stands in a bedroom under a dry white ceiling, giving a thumbs up to the camera with a proud smile.`) }),
  S(22, "", "c", "ClCheck", { props: { title: "Repaso", items: ["Cepillar la grieta", "Abrirla en V", "1 día de sol", "Masilla con acetona, por tramos", "Líquida con aguarrás, 3 manos", "15 cm a cada lado", "La prueba del balde"] } }),
  // ── LA CUENTA
  C(23, "", "ClChapter", { n: 2, title: "La cuenta", sub: "de dónde salen los tres dólares" }),
  S(24, "", "bi", "st_hardwaretubes", { q: "silicone tubes hardware store", p: BI(`Tubes of sealant on a hardware store shelf.`) }),
  S(24, "un vaso de una botella que seguro ya tienes", "bi", "b_shelfbottle", { p: BI(`A half-used bottle of mineral turpentine on a garage shelf among old paint cans.`) }),
  S(25, "", "bi", "b_longcrack", { p: BI(`A three-meter long white silicone band along a crack across a flat gray roof, a tape measure lying beside it.`) }),
  S(26, "", "c", "ClReceipt", { props: { lines: [["Tu arreglo", "≈ 3 dólares"], ["Balde de impermeabilizante", "10 a 20 veces más"], ["Un techista, sólo por mirar", "más que todo esto"]], total: ["Diferencia", "mucha plata"] } }),
  S(26, "para una grieta sola te sobra casi todo", "bi", "st_paintbucket", { q: "big paint bucket", p: BI(`A large bucket of roof coating.`) }),
  // ── CTA 1: el regalo
  S(27, "", "av", ""),
  S(27, "La del cemento que parece granito", "bi", "b_granitetop", { p: BI(`A cement tabletop polished to look exactly like dark speckled granite on a backyard table in the sun.`) }),
  S(27, "la de la madera que no se pudre", "bi", "b_post", { q: "wooden fence post", p: BI(`A wooden fence post in a sunny backyard, its lower half dark and glossy with a waxy protective coat.`) }),
  S(27, "la del piso que parece porcelanato", "bi", "b_floorblue", { p: BI(`A glossy turquoise-blue cement floor in a bright small room, shining like porcelain tile.`) }),
  C(28, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "las 10 mezclas con medidas, gratis" }),
  S(28, "Guárdala", "av", ""),
];
