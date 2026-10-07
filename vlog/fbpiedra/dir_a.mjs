// DIRECTOR A — fbpiedra (El Constructor Libre): MINUTO 1 (la olla a borbotones con piedras saltando = sello "ERROR" en el seg 0 → el
// borde de ladrillos rotos → PROMESA: piedras de río de cemento, $1 la docena → el vecino ("es del vivero") → ráfaga → "¡mira cómo
// brilla!" → 3 loops) + LA RECETA (1 cemento · 2 arena, espeso, embudo al globo, forma, 24 h en arena, cortar, agua que humea 60-70 °C
// 2-3 h, enfriar en el agua, lija al agua, cera) + LA CUENTA + CTA 1 = QR (párrafos 0-29).
import { S, BI, CLP } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbpiedra/";
export const YARD = "a sunny backyard of a modest Latin American house with a lawn, a flower bed and a brick wall";
export const STONES = "smooth rounded gray cement stones with a wet-look waxed shine, looking exactly like river stones";
export const POT = "an old dented aluminium pot used only for the workshop";
export const HANDS = "working hands in blue nitrile gloves of a man in an olive-green shirt with rolled sleeves";
export const NEIGHBOR = "a sturdy 65-year-old Latin American neighbour, bald on top with gray hair at the sides, a thick gray mustache, a short-sleeved light-blue checked shirt with a pen in the pocket, glasses hanging on a cord";
export const SHOTS = [
  // ── 0:00 · el error en el segundo 0
  S(0, "", "bi", "b_ragingboil", { p: BI(`Close view of ${POT} on an outdoor burner at a violent rolling boil, gray cement balls tumbling and knocking inside.`), anim: "the water boils violently, the balls tumble", ov: { c: "ClStampOv", props: { text: "ERROR" } } }),
  S(0, "para hacer piedras", "bi", "b_balloons", { p: BI(`Gray cement-filled balloons lined up on a bed of sand in a plastic tub.`) }),
  S(0, "que no hierva", "av", ""),
  S(0, "Ése es el error del video que viste", "bi", "b_viralphone", { p: BI(`A phone on a backyard table playing a video of a pot boiling hard with gray balls inside.`) }),
  S(0, "se te rajan por dentro", "bi", "b_crackedin", { p: BI(`A gray cement stone broken in half on a patio, a crack running through its inside.`) }),
  // ── el cantero
  S(1, "", "bi", "b_brokenbricks", { p: BI(`The edge of a flower bed in ${YARD} lined with broken uneven bricks tipping into the grass.`) }),
  S(1, "El borde era de ladrillos rotos", "bi", "b_brickclose", { p: BI(`Close view of cracked half bricks tipped over at the edge of a flower bed, soil spilling onto the grass.`) }),
  S(1, "que se iban cayendo para el pasto", "cl", "c_bricks", { p: CLP(`He crouches next to a flower bed edged with broken bricks in ${YARD}, holding a broken brick, shaking his head at the camera.`) }),
  S(1, "una piedra de río de verdad", "bi", "st_riverstones", { q: "river stones water", p: BI(`Smooth river stones in shallow water.`) }),
  S(1, "en el vivero", "bi", "b_nurseryshelf", { p: BI(`Small net bags of smooth river stones on a shelf at a plant nursery.`) }),
  S(1, "como si fuera de joyería", "bi", "st_nursery", { q: "garden center decorative stones", p: BI(`Bags of decorative stones at a garden center.`) }),
  // ── 0:14 · LA PROMESA
  S(2, "", "bi", "b_border", { q: "stone garden border", p: BI(`A flower bed in ${YARD} neatly edged with ${STONES}.`) }),
  S(2, "redondas, lisas, con brillo de mojadas", "bi", "b_closestones", { q: "smooth gray stones", p: BI(`Close view of ${STONES} lying on grass in the sun.`) }),
  S(2, "Parecen sacadas del río", "bi", "b_riverlike", { p: BI(`A handful of smooth wet-looking gray stones held in an open palm over grass.`) }),
  S(2, "Las hice yo, con cemento, arena y globos", "cl", "c_holdstone", { p: CLP(`He holds a smooth gray stone up to the camera in ${YARD}, a bag of cement and a packet of balloons on a table behind him, proud grin.`) }),
  S(2, "arena y globos", "bi", "b_balloonsand", { p: BI(`A packet of balloons, a bag of cement and a bucket of fine sand on a backyard table.`) }),
  S(2, "Un dólar de cemento por una docena", "c", "ClReceipt", { props: { head: "CORRALÓN · PATIO", lines: [["Cemento, 1 kilo", "≈ 1 dólar"], ["Arena fina, 2 kilos", "centavos"], ["Globos y cera", "los que tengas"]], total: ["Una docena de piedras", "≈ 1 dólar"] } }),
  // ── el vecino
  S(3, "", "bi", "b_neighborturn", { p: BI(`${NEIGHBOR} turning a smooth gray stone over in his hand next to a flower bed, squinting at it suspiciously.`) }),
  S(3, "la dio vuelta en la mano", "bi", "b_stonehand", { p: BI(`A weathered hand turning over a smooth gray cement stone, inspecting its underside.`) }),
  S(3, "me dijo que eso era del vivero", "bi", "b_neighborpoint", { p: BI(`${NEIGHBOR} pointing down the street with a smooth gray stone in his other hand, smug face.`) }),
  S(3, "Le dije que la partiera, si podía", "cl", "c_dare", { p: CLP(`He hands a hammer to a mustached neighbour in a light-blue checked shirt in ${YARD}, grinning confidently.`) }),
  // ── 0:24 · RÁFAGA
  S(4, "", "bi", "b_drymix", { p: BI(`${HANDS} mixing gray cement and fine sand together in a plastic tub with a trowel.`) }),
  S(4, "bien espeso", "bi", "b_thickmix", { p: BI(`A trowel lifting a thick heap of gray mortar that holds its shape in a tub.`) }),
  S(4, "Embudo", "bi", "b_funnel", { p: BI(`A plastic funnel stuck in the neck of a balloon, thick gray mortar being pushed in with a stick.`), anim: "the stick pushes the mortar" }),
  S(4, "Al globo", "bi", "b_fullballoon", { p: BI(`A balloon filled with gray mortar held in a gloved hand, the neck being knotted.`) }),
  S(4, "Un día sobre la arena", "bi", "b_sandbed", { p: BI(`Mortar-filled balloons of different sizes resting on a bed of sand in a tub in the shade.`) }),
  S(4, "Corto el globo", "bi", "b_cutballoon", { p: BI(`Scissors snipping a rubber balloon off a gray cement stone.`) }),
  S(4, "Al agua caliente, que humee", "bi", "b_steam", { p: BI(`Gray cement stones sitting in ${POT} of steaming water, no bubbles, on a low flame.`), anim: "steam rises gently" }),
  S(4, "Lija al agua", "bi", "b_wetsand", { p: BI(`Wet sandpaper rubbing a gray cement stone in circles under a trickle of water.`), anim: "the sandpaper rubs in circles" }),
  S(4, "Cera", "bi", "b_wax", { p: BI(`A rag rubbing floor wax onto a smooth gray cement stone, making it shine.`) }),
  // ── el grito
  S(5, "", "bi", "b_splash", { p: BI(`Water splashed from a cup over ${STONES} on a flower bed edge, the stones turning dark and shiny.`), anim: "the water splashes and the stones shine" }),
  S(5, "mira cómo brilla", "bi", "b_shinewet", { p: BI(`Extreme close view of a wet waxed gray cement stone glistening in the sun.`) }),
  S(5, "como recién sacada del río", "cl", "c_wow", { p: CLP(`He crouches by a flower bed edged with shiny wet gray stones, pointing at them, open-mouthed delighted grin, looking at the camera.`) }),
  // ── 0:44 · 3 loops
  S(6, "", "av", ""),
  S(6, "Por qué el hervor fuerte las raja por dentro", "bi", "b_split", { p: BI(`Two halves of a gray cement stone lying on a patio, a fine crack pattern inside.`), ov: { c: "ClChip", props: { text: "1 · El hervor las raja", alert: true } } }),
  S(6, "Por qué el agua caliente las endurece en horas", "bi", "b_thermo", { p: BI(`A kitchen thermometer clipped to ${POT} of steaming water with gray stones inside.`), ov: { c: "ClChip", props: { text: "2 · Horas, no semanas" } } }),
  S(6, "cuando el vecino las hirvió a borbotones", "bi", "b_neighborboil", { p: BI(`${NEIGHBOR} standing over a big pot boiling hard on an outdoor burner full of gray cement balls, pleased.`), ov: { c: "ClChip", props: { text: "3 · Lo del vecino", alert: true } } }),
  // ── RECETA
  C(7, "", "ClChapter", { n: 1, title: "La receta entera", sub: "que humee, que no hierva" }),
  S(7, "Lo que necesitas", "c", "ClCheck", { props: { title: "Lo que necesitas", items: ["Cemento gris + arena fina", "Globos (o huevos de plástico)", "Embudo", "Olla vieja", "Balde con arena", "Lija al agua + cera de piso"] } }),
  S(7, "una lija al agua y cera de piso", "bi", "b_kit", { q: "cement bag tools", p: BI(`A bag of cement, a bucket of fine sand, a packet of balloons, a plastic funnel, ${POT}, wet sandpaper and a tin of floor wax on a backyard table.`) }),
  S(8, "", "av", ""),
  S(8, "con agua caliente, se endurece mucho más rápido", "c", "ClSplit", { props: { img: I + "b_twopots.jpg", left: ["HUMEA", "se endurece en horas"], right: ["HIERVE", "se raja por dentro"] } }),
  S(8, "Pero caliente no es hirviendo", "bi", "b_nobubbles", { q: "water in pot", p: BI(`Top view into ${POT} of hot steaming water with stones at the bottom and no bubbles.`) }),
  S(9, "", "c", "ClPasteRecipe", { props: { a: 1, b: 2, aLabel: "cemento", bLabel: "arena fina", note: "en volumen, en seco primero" } }),
  S(9, "La mezclo en seco", "bi", "b_drygray", { q: "mixing cement sand", p: BI(`A trowel turning dry cement and sand in a tub until an even gray.`), anim: "the trowel turns the dry mix" }),
  S(10, "", "bi", "b_addwater", { q: "mixing mortar", p: BI(`Water poured a little at a time into a tub of cement and sand while a trowel stirs.`), anim: "the water pours, the trowel stirs" }),
  S(10, "como un puré", "bi", "b_puree", { p: BI(`A gloved hand squeezing a ball of thick gray mortar that holds its shape without dripping.`) }),
  S(10, "la piedra queda floja", "bi", "b_crumbly", { p: BI(`A crumbly pitted gray cement stone falling apart in a hand.`) }),
  S(11, "", "bi", "b_funnel2", { p: BI(`Close view of a stick pushing thick mortar through a funnel into a balloon.`) }),
  S(11, "golpeando el globo contra la mesa", "bi", "b_tap", { p: BI(`A mortar-filled balloon being tapped on a wooden table.`) }),
  S(12, "", "bi", "b_sizes", { p: BI(`Mortar-filled balloons of different sizes from egg to fist lined up on a table.`) }),
  S(13, "", "bi", "b_knot", { p: BI(`Fingers tying a tight knot in a balloon right against the gray mortar inside.`) }),
  S(13, "Las piedras de río no son pelotas", "bi", "b_shape", { p: BI(`${HANDS} squashing a mortar-filled balloon into a flattened irregular pebble shape.`), anim: "the hands squash the balloon" }),
  S(14, "", "bi", "b_sandtub", { q: "sand box", p: BI(`Balloons of mortar nestled in a bed of sand in a plastic tub.`) }),
  S(14, "Y las dejo veinticuatro horas, a la sombra", "bi", "st_clock", { q: "wall clock", p: BI(`A wall clock.`), ov: { c: "ClStampOv", props: { text: "24 HORAS" } } }),
  S(15, "", "bi", "b_peel", { p: BI(`A torn balloon being peeled off a fresh gray cement stone.`) }),
  S(15, "todavía está blanda por dentro", "bi", "b_fresh", { q: "concrete texture", p: BI(`A freshly unwrapped gray cement stone, slightly damp and matte, sitting on sand.`) }),
  S(16, "", "bi", "b_heat", { q: "pot outdoor burner", p: BI(`${POT} of water heating on a gas burner in a backyard, steam beginning to rise.`) }),
  S(16, "Que no salgan burbujas del fondo", "bi", "b_bottom", { q: "pot of hot water", p: BI(`Extreme close view of the bottom of a pot of hot clear water with no bubbles, just a wisp of steam.`) }),
  S(16, "entre sesenta y setenta grados", "bi", "b_thermo2", { p: BI(`A kitchen thermometer in hot steaming water reading about 65 degrees.`), ov: { c: "ClStampOv", props: { text: "60-70 °C" } } }),
  S(17, "", "bi", "b_ladle", { p: BI(`A big slotted spoon lowering a gray cement stone gently into a pot of steaming water.`) }),
  S(17, "dos o tres horas", "bi", "b_lowflame", { q: "gas burner flame", p: BI(`A very low blue gas flame under a steaming pot in a backyard.`), ov: { c: "ClStampOv", props: { text: "2 A 3 HORAS" } } }),
  S(18, "", "cl", "c_watch", { p: CLP(`He sits on a low stool next to a steaming pot on a backyard burner, peering into the water, a cup of cold water in his hand.`) }),
  S(19, "", "bi", "b_cooling", { q: "pot of water", p: BI(`A pot of water with stones cooling on a turned-off burner at dusk.`) }),
  S(19, "el cambio de golpe también las puede rajar", "bi", "st_coldwind", { q: "cold wind trees", p: BI(`Trees bending in cold wind.`) }),
  S(20, "", "bi", "b_sanding", { p: BI(`${HANDS} sanding the balloon knot ridge off a gray stone with wet sandpaper.`), anim: "the sandpaper rubs" }),
  S(20, "suave como una de río", "bi", "b_smooth", { p: BI(`A thumb rubbing the smooth surface of a sanded gray cement stone.`) }),
  S(21, "", "bi", "b_waxing", { p: BI(`A rag applying floor wax to a row of gray cement stones on a table.`) }),
  S(21, "la lustro", "bi", "b_buff", { p: BI(`A cloth buffing a waxed gray stone to a soft shine.`), anim: "the cloth buffs" }),
  // ── el final
  S(22, "", "bi", "b_finalrow", { q: "river pebbles", p: BI(`Close view of ${STONES} lined up on a wooden table in the sun.`) }),
  S(22, "Las pongo en el borde del cantero", "bi", "b_placing", { q: "placing stones garden", p: BI(`${HANDS} placing smooth gray stones one by one along the edge of a flower bed.`), anim: "the hands place a stone" }),
  S(23, "", "c", "ClCheck", { props: { title: "Repaso", items: ["1 cemento + 2 arena fina", "Espeso como puré", "Embudo al globo", "24 h sobre arena", "Agua que humea, 2-3 h", "Enfriar en el agua", "Lija al agua + cera"] } }),
  // ── LA CUENTA
  C(24, "", "ClChapter", { n: 2, title: "La cuenta", sub: "un dólar la docena" }),
  S(24, "quiero que veas de dónde sale", "av", ""),
  S(25, "", "bi", "st_cementbags", { q: "cement bags hardware store", p: BI(`Bags of cement in a hardware store.`) }),
  S(25, "unas doce piedras medianas", "bi", "b_dozen", { q: "pebbles table", p: BI(`A dozen medium gray cement stones arranged in rows on a table.`) }),
  S(26, "", "bi", "b_balloonpack", { p: BI(`A packet of colorful birthday balloons and a tin of floor wax on a patio table.`) }),
  S(27, "", "bi", "st_gardencenter", { q: "garden center stones", p: BI(`Decorative stones for sale at a garden center.`) }),
  S(27, "una docena te sale lo que un café", "cl", "c_coffee", { p: CLP(`He sips a coffee sitting on a low wall next to a flower bed edged with gray stones, smiling at the camera.`) }),
  // ── CTA 1: el regalo
  S(28, "", "av", ""),
  S(28, "La del cemento que parece granito", "bi", "b_granitetop", { p: BI(`A cement tabletop polished to look exactly like dark speckled granite on a backyard table in the sun.`) }),
  S(28, "la de la silicona con cemento para la grieta", "bi", "b_grayline", { p: BI(`A crack in a cream-colored plastered wall neatly filled flush with a smooth gray putty line.`) }),
  S(28, "la del gel para el óxido", "bi", "b_cleanpliers", { p: BI(`An old pair of steel pliers cleaned back to plain gray steel, lightly oiled, on a workbench.`) }),
  C(29, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "las 10 mezclas con medidas, gratis" }),
  S(29, "Guárdala", "av", ""),
];
