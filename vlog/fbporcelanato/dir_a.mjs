// DIRECTOR A — fbporcelanato (El Constructor Libre): MINUTO 1 (pintura azul cayendo en el cemento blanco con sello "ERROR" en el seg 0
// → el piso que parece porcelanato: liso, reflejo, gota → PROMESA antes/después → el vecino buscando juntas → ráfaga → "¡mira cómo
// brilla!" → 3 loops) + LA RECETA (base, medida, orden, óxido, 2 capas, quemar con la llana, curar, sellar) + LA CUENTA + CTA 1 (0-27).
import { S, BI, CLP } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbporcelanato/";
export const ROOM = "a small bright covered back porch with white walls, a wooden door and a window";
export const FLOOR = "a seamless deep teal-blue polished cement floor, glossy like porcelain tile, no grout lines, reflecting the window light like a mirror";
export const HANDS = "working hands of a man in an olive-green shirt with rolled sleeves";
export const TROWEL = "a flat steel finishing trowel";
export const PASTE = "a smooth creamy colored cement paste, like thick caramel";
export const NEIGHBOR = "a sturdy 65-year-old Latin American neighbour, bald on top with gray hair at the sides, a thick gray mustache, a short-sleeved light-blue checked shirt with a pen in the pocket, glasses hanging on a cord";
export const SHOTS = [
  // ── 0:00 · el error en el segundo 0
  S(0, "", "bi", "b_paintin", { p: BI(`Close view from above of a bucket of white cement powder, ${HANDS} pouring light-blue wall paint from a can straight into it.`), anim: "the blue paint pours into the white powder", ov: { c: "ClStampOv", props: { text: "ERROR" } } }),
  S(0, "no esperes que la pintura le dé el color", "bi", "b_pastel", { p: BI(`A patch of washed-out pale baby-blue cement floor, dull and chalky, next to a can of bright blue paint.`) }),
  S(0, "para el piso", "bi", "st_cementfloor", { q: "smooth cement floor", p: BI(`A smooth cement floor in a house.`) }),
  S(0, "Ése es el error del video que viste", "av", ""),
  // ── el piso
  S(1, "", "bi", "b_floorwide", { p: BI(`${ROOM} with ${FLOOR}, a potted plant and a wooden chair.`) }),
  S(1, "Lo toco", "cl", "c_touch", { p: CLP(`He crouches and runs his flat palm across ${FLOOR}, smiling at the camera, in ${ROOM}.`) }),
  S(1, "liso como un vidrio", "bi", "b_palmmacro", { p: BI(`Extreme close view of a hand sliding across ${FLOOR}, the hand reflected in the gloss.`) }),
  S(1, "se refleja la ventana", "bi", "b_reflect", { p: BI(`Low angle view across ${FLOOR}, a bright window and a plant reflected in it like in still water.`) }),
  S(1, "Me agacho", "bi", "b_crouch", { p: BI(`Low view of a man's work boots and knees as he crouches on ${FLOOR}, his reflection under him.`) }),
  S(1, "Le tiro agua", "bi", "b_drop", { q: "water drop on floor", p: BI(`Extreme close view of round water drops beading up on ${FLOOR}.`) }),
  S(1, "la gota queda redondita arriba", "bi", "b_dropmacro", { p: BI(`Extreme macro of a single round water drop sitting on ${FLOOR}, the window reflected inside the drop.`) }),
  S(1, "Parece porcelanato", "av", ""),
  // ── 0:10 · LA PROMESA
  S(2, "", "bi", "st_whitecement", { q: "white cement powder", p: BI(`A paper sack of white cement on a concrete floor, some powder spilled.`) }),
  S(2, "Cemento blanco", "bi", "b_whitescoop", { p: BI(`A hand scooping bright white cement powder out of a paper sack with a small plastic bucket.`) }),
  S(2, "pintura de pared", "bi", "st_paintcan", { q: "opening paint can", p: BI(`A can of wall paint being opened.`) }),
  S(2, "un poquito de polvo de color", "bi", "b_pigment", { p: BI(`A small heap of vivid blue iron-oxide pigment powder on a spoon over a bucket of white cement.`) }),
  S(2, "Unos tres dólares de mezcla por metro cuadrado", "c", "ClReceipt", { props: { lines: [["Cemento blanco", "2 kg"], ["Pintura látex", "½ litro"], ["Óxido de color", "3 cucharadas"]], total: ["Mezcla por m²", "≈ 3 dólares"] } }),
  C(2, "Así estaba la galería del fondo", "ClBeforeAfter", { before: I + "b_floorold.jpg", after: I + "b_floorwide.jpg", note: "dos capas finitas · la llana · sellador" }),
  S(2, "Así quedó", "bi", "b_floordoor", { p: BI(`View through an open wooden door onto ${FLOOR} in ${ROOM}, afternoon sun.`) }),
  // ── el vecino
  S(3, "", "bi", "b_shoesoff", { p: BI(`${NEIGHBOR} at the door of a porch taking off his shoes, looking down at a glossy teal floor in awe.`) }),
  S(3, "se sacó los zapatos", "bi", "b_shoesfloor", { p: BI(`A pair of brown leather shoes left neatly at the edge of ${FLOOR}, reflected in it.`) }),
  S(3, "dónde había comprado las baldosas", "bi", "b_neighborask", { p: BI(`${NEIGHBOR} in socks pointing at a glossy teal cement floor with a puzzled frown, palms up.`) }),
  S(3, "hasta que buscó las juntas", "bi", "b_neighborcrawl", { p: BI(`${NEIGHBOR} on his knees on a glossy seamless teal floor, glasses on, running a fingernail across it looking for grout lines.`) }),
  // ── 0:22 · RÁFAGA
  S(4, "", "bi", "b_drymixpaint", { p: BI(`${HANDS} stirring white cement and blue paint together in a bucket with a paddle mixer on a drill, no water yet.`), anim: "the paddle spins in the thick mix" }),
  S(4, "Agua de a chorritos", "bi", "b_trickle", { q: "pouring water bucket", p: BI(`A thin trickle of water poured from a plastic jug into a bucket of blue cement paste while it is stirred.`), anim: "thin trickle of water, the mix turns" }),
  S(4, "Mira. Cemento y pintura primero", "bi", "b_paintpour2", { p: BI(`Teal-blue latex paint poured from a can onto white cement powder in a black bucket, before any water.`), anim: "the paint pours onto the powder" }),
  S(4, "Una capa finita con la llana", "bi", "b_spread", { q: "trowel spreading cement floor", p: BI(`${HANDS} spreading a thin layer of ${PASTE}, teal-blue, across an old concrete floor with ${TROWEL}.`), anim: "the trowel sweeps the paste flat" }),
  S(4, "Al otro día, la segunda", "bi", "b_coat2", { p: BI(`A second thin coat of teal cement paste being troweled across the first one, crossing direction, in a bright porch.`) }),
  S(4, "aprieto la llana en círculos", "bi", "b_burnish", { q: "power troweling concrete", p: BI(`Close view of ${TROWEL} pressed hard and moved in circles on a teal cement surface that turns dark and glossy under it.`) }),
  S(4, "se empieza a lustrar sola", "bi", "b_shinemacro", { p: BI(`Extreme close view of the edge of a steel trowel on teal cement, a glossy burnished band appearing behind it.`) }),
  // ── el grito
  S(5, "", "bi", "b_sealer", { p: BI(`A short-nap roller laying a coat of clear floor sealer on ${FLOOR}; the sealed half shines wet, the other half is satin.`) }),
  S(5, "mira cómo brilla", "cl", "c_wow", { p: CLP(`He kneels on ${FLOOR}, pointing at the shine with an open-mouthed delighted grin, looking at the camera.`) }),
  // ── 0:40 · 3 loops
  S(6, "", "av", ""),
  S(6, "porque no es la pintura", "bi", "b_threejars", { p: BI(`Three small jars of colored pigment powders, blue, red and green, on a workbench next to a can of paint.`), ov: { c: "ClChip", props: { text: "1 · Qué le da el color" } } }),
  S(6, "Qué es lo que de verdad le da el color", "bi", "b_pigmentmacro", { p: BI(`Extreme close view of vivid teal pigment powder falling into white cement powder, a cloud of color.`), anim: "the pigment falls and puffs" }),
  S(6, "El paso con la llana", "bi", "b_trowelrest", { p: BI(`${TROWEL} resting on a half-polished teal cement floor, one side matte, the other glossy.`), ov: { c: "ClChip", props: { text: "2 · El paso de la llana" } } }),
  S(6, "en la entrada del garaje", "bi", "b_tiremarks", { p: BI(`A pink-tinted thin cement coating on a home driveway with two black tire marks and a corner peeling up.`), ov: { c: "ClChip", props: { text: "3 · Lo del vecino", alert: true } } }),
  S(6, "Primero, la receta", "av", ""),
  // ── RECETA
  C(7, "", "ClChapter", { n: 1, title: "La receta entera", sub: "de un piso gris a porcelanato" }),
  S(7, "Lo que necesitas", "c", "ClCheck", { props: { title: "Lo que necesitas", items: ["Cemento blanco", "Látex acrílico de exterior", "Óxido de hierro (color fuerte)", "Llana de acero lisa", "Sellador poliuretánico de piso"] } }),
  S(7, "al lado del cemento", "bi", "st_hardware", { q: "hardware store aisle", p: BI(`Bags of cement in a hardware store aisle.`) }),
  S(7, "Una llana de acero lisa", "bi", "b_kit", { p: BI(`White cement sack, a can of acrylic paint, a jar of blue pigment, ${TROWEL}, a bucket and a drill paddle mixer laid out on an old gray concrete floor.`) }),
  S(8, "", "bi", "st_oldfloor", { q: "old concrete floor", p: BI(`An old worn gray concrete floor.`) }),
  S(8, "Lo golpeo con el mango del martillo", "bi", "b_tap", { p: BI(`Close view of the handle of a hammer tapping an old gray cement floor tile, listening for hollow spots.`), anim: "the handle taps the floor" }),
  S(8, "esa parte se levanta antes", "bi", "b_hollow", { p: BI(`A loose cracked patch of an old cement floor lifting up at the edges.`), ov: { c: "ClChip", props: { text: "Suena hueco = se levanta", alert: true } } }),
  S(9, "", "bi", "b_scrub", { q: "scrubbing floor brush", p: BI(`A stiff brush scrubbing an old concrete floor with soapy water.`), anim: "the brush scrubs back and forth" }),
  S(9, "lo mojo con una esponja", "bi", "b_sponge", { q: "wet sponge cleaning floor", p: BI(`A wet sponge wiping an old gray concrete floor, leaving it evenly damp, no puddles.`) }),
  S(9, "Húmedo, no mojado", "c", "ClDoDont", { props: { yes: { label: "Húmedo", img: I + "b_sponge.jpg" }, no: { label: "Con charcos", img: I + "b_puddles.jpg" } } }),
  S(10, "", "c", "ClCheck", { props: { title: "Por metro cuadrado", items: ["2 kg de cemento blanco", "½ litro de látex acrílico", "Agua de a chorritos"] } }),
  S(10, "como dulce de leche", "bi", "b_creamy", { p: BI(`A mason's trowel lifting a heap of ${PASTE}, light teal, that folds slowly like thick caramel.`) }),
  S(11, "", "av", ""),
  S(11, "Primero el cemento con la pintura", "bi", "b_paintfirst", { p: BI(`Top view into a bucket: white cement powder with blue latex paint being folded in with a trowel, no water, a thick crumbly paste.`), anim: "the trowel folds paint into the powder" }),
  S(11, "el cemento se hace grumos", "bi", "b_lumps", { p: BI(`Close view of lumpy white cement with dry clumps floating in watery paste in a bucket.`), ov: { c: "ClChip", props: { text: "Agua primero = grumos", alert: true } } }),
  S(12, "", "bi", "b_drypigment", { p: BI(`${HANDS} stirring vivid blue iron-oxide powder into dry white cement in a bucket until it turns an even sky-blue powder.`), anim: "the powder turns an even blue" }),
  S(12, "Unas tres cucharadas grandes", "bi", "b_spoons", { p: BI(`A large spoon heaped with blue pigment powder over a bucket of white cement, two more spoonfuls already in.`) }),
  S(12, "La pintura de color sola te da un pastel lavado", "c", "ClSplit", { props: { img: I + "b_twosamples.jpg", left: ["SÓLO PINTURA", "pastel lavado"], right: ["CON ÓXIDO", "color de verdad"] } }),
  S(13, "", "bi", "b_firstcoat", { p: BI(`${HANDS} pulling ${PASTE}, teal-blue, thin across an old concrete floor with ${TROWEL}, starting in the far corner of a small room.`), anim: "the trowel pulls the paste thin" }),
  S(13, "de uno o dos milímetros", "c", "ClPins", { props: { img: I + "b_edge.jpg", pins: [{ x: 0.5, y: 0.35, label: "1 a 2 mm" }, { x: 0.5, y: 0.75, label: "piso viejo" }] } }),
  S(13, "desde el fondo hacia la puerta", "bi", "b_towarddoor", { p: BI(`Top view of a small room floor half covered in fresh teal cement coat, the uncovered part leading to the door.`) }),
  S(14, "", "bi", "b_overnight", { q: "empty room at night", p: BI(`A small room with a fresh matte teal cement floor coat at night, a work lamp off in the corner.`) }),
  S(14, "en medias", "bi", "b_socks", { q: "feet in socks walking floor", p: BI(`Feet in gray socks stepping carefully on a fresh matte teal cement floor.`) }),
  S(15, "", "bi", "b_coat2b", { p: BI(`${TROWEL} spreading a second thin teal coat across the first one at a right angle, careful even strokes.`) }),
  S(15, "sin dejar escalones", "bi", "b_seam", { q: "trowel smoothing concrete", p: BI(`Close view of a trowel feathering the joint between two patches of fresh teal cement so no ridge is left.`) }),
  S(16, "", "av", ""),
  S(16, "pierda el brillo de mojado", "c", "ClSplit", { props: { img: I + "b_wetdull.jpg", left: ["MOJADO", "todavía no"], right: ["SIN BRILLO", "ahora"] } }),
  S(16, "si no se hunde pero deja la marca", "bi", "b_fingertest", { p: BI(`Extreme close view of a fingertip pressed on a fresh teal cement surface, leaving a shallow print without sinking in.`) }),
  S(17, "", "cl", "c_trowel", { p: CLP(`He kneels on a teal cement floor pressing ${TROWEL} hard in circles with both hands, concentrating, in ${ROOM}.`) }),
  S(17, "Mira lo que pasa", "bi", "b_burnish2", { p: BI(`Extreme close view of ${TROWEL} circling on matte teal cement, leaving a dark glossy mirror-like trail.`) }),
  S(17, "quemar el cemento", "bi", "st_trowelfinish", { q: "concrete trowel finish", p: BI(`A worker hand-troweling a smooth concrete floor finish.`), ov: { c: "ClStampOv", props: { text: "QUEMAR" } } }),
  S(17, "Es la llana la que lo lustra", "bi", "b_trowelgloss", { p: BI(`Low angle view of a steel trowel lying on a freshly burnished glossy teal floor, the trowel reflected in it.`) }),
  S(18, "", "bi", "b_nylon", { q: "plastic sheet floor", p: BI(`Clear plastic sheeting laid over a fresh teal cement floor in a small room, taped at the edges.`), ov: { c: "ClStampOv", props: { text: "5 DÍAS" } } }),
  S(18, "se pone polvoriento y se raja", "bi", "b_dusty", { p: BI(`Close view of a dry chalky teal cement surface with fine hairline cracks and dust on a fingertip.`) }),
  S(19, "", "bi", "b_roller", { q: "roller floor sealer", p: BI(`A short-nap roller on an extension pole applying clear sealer to a teal cement floor.`), anim: "the roller rolls a shiny stripe" }),
  S(19, "La segunda, al otro día", "bi", "b_sealer2", { q: "paint roller floor", p: BI(`A second coat of clear sealer being rolled on ${FLOOR}, morning light.`) }),
  // ── el final
  S(20, "", "bi", "b_floorwide2", { p: BI(`Wide view of ${ROOM} with ${FLOOR}, sunlight from the door, a rug rolled up in the corner.`) }),
  S(20, "Me paro encima y me reflejo", "cl", "c_standreflect", { p: CLP(`He stands on ${FLOOR}, his reflection visible in the gloss at his feet, arms crossed, proud smile.`) }),
  S(20, "Le tiro agua y no entra", "bi", "b_splash", { p: BI(`A splash of water from a glass landing on ${FLOOR}, beading into drops that sit on top.`) }),
  S(21, "", "c", "ClCheck", { props: { title: "Repaso", items: ["Piso firme y húmedo", "Cemento + pintura, después el agua", "Color con óxido, en seco", "2 capas finitas", "Quemar con la llana", "5 días húmedo", "2 manos de sellador"] } }),
  // ── LA CUENTA
  C(22, "", "ClChapter", { n: 2, title: "La cuenta", sub: "de dónde salen los tres dólares" }),
  S(23, "", "bi", "b_scale", { q: "bag of cement scale", p: BI(`A bucket of white cement on a bathroom scale reading two kilos, next to a half-liter of paint.`) }),
  S(23, "si te sobró de pintar una pared", "bi", "st_leftoverpaint", { q: "paint cans shelf", p: BI(`Leftover paint cans on a garage shelf.`) }),
  S(24, "", "bi", "b_sealercan", { p: BI(`A metal can of clear polyurethane floor sealer with a plain label beside a roller tray on a teal floor.`) }),
  S(25, "", "c", "ClReceipt", { props: { lines: [["Tu piso, por m²", "≈ 3 dólares"], ["Porcelanato + pegamento + colocador", "10 a 15 veces más"]], total: ["Y sin levantar", "el piso viejo"] } }),
  S(25, "tienes que levantar el piso viejo", "bi", "st_demolition", { q: "removing floor tiles hammer", p: BI(`A worker breaking up old floor tiles with a hammer and chisel.`) }),
  // ── CTA 1: el regalo
  S(26, "", "av", ""),
  S(26, "La del cemento que parece granito", "bi", "b_granitetop", { p: BI(`A cement tabletop polished to look exactly like dark speckled granite on a backyard table in the sun.`) }),
  S(26, "la de la madera que no se pudre", "bi", "b_post", { q: "wooden fence post", p: BI(`A wooden fence post in a sunny backyard, its lower half dark and glossy with a waxy protective coat.`) }),
  S(26, "la de las goteras", "bi", "b_roofseal", { q: "flat roof crack", p: BI(`A crack on a flat concrete roof sealed with a shiny transparent coat, water drops beading on it.`) }),
  C(27, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "las 10 mezclas con medidas, gratis" }),
  S(27, "Guárdala", "av", ""),
];
