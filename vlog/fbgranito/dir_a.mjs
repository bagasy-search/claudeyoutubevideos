// DIRECTOR A — fbgranito (El Constructor Libre): MINUTO 1 (el barniz cayendo ADENTRO del balde con sello "ERROR" en el seg 1 →
// la tapa que parece granito, nudillo, macro → PROMESA con antes/después → el vecino → ráfaga → "¡mira cómo brilla!" → 3 loops)
// + LA RECETA (molde, malla, seco, agua, golpear, curar, lijar, barniz) + LA CUENTA + CTA 1 = QR al regalo (párrafos 0-29).
import { S, BI, CLP } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbgranito/";
export const TAPA = "a 60 x 40 cm cement tabletop slab, 3 cm thick, resting on an old wooden backyard table";
export const GRANITE = "polished to look exactly like dark speckled granite: black, white and gray stone chips cut flat inside a gray cement matrix, mirror-glossy clear varnish reflecting the daylight";
export const MOLD = "a rectangular mold made of four wooden battens screwed onto an old plywood board, lined inside with brown packing tape";
export const CHIPS = "a paper sack of marble chips (small crushed black, white and gray stones of 3 to 6 mm)";
export const VARNISH = "a metal can of clear gloss polyurethane varnish with a plain blank white label";
export const HANDS = "dusty working hands of a man in an olive-green shirt with rolled sleeves";
export const NEIGHBOR = "a sturdy 65-year-old Latin American neighbour, bald on top with gray hair at the sides, a thick gray mustache, a short-sleeved light-blue checked shirt with a pen in the pocket, glasses hanging on a cord";
export const SHOTS = [
  // ── 0:00 · el error en el segundo 1
  S(0, "", "bi", "b_varnishin", { p: BI(`Close view from above of a gray cement and stone-chip mix in a black plastic bucket, ${HANDS} pouring a thick stream of amber varnish from ${VARNISH} straight INTO the wet mix.`), anim: "the amber varnish stream pours into the gray mix", ov: { c: "ClStampOv", props: { text: "ERROR" } } }),
  S(0, "no le eches el barniz adentro", "av", ""),
  S(0, "Ése es el error del video que viste", "bi", "b_viralbowl", { p: BI(`A metal bowl of white cement powder on a wooden table with orange-amber varnish poured into the middle of it in a swirl, seen from a low angle, the tin of varnish tilted above it.`) }),
  // ── la tapa
  S(1, "", "cl", "c_knock", { p: CLP(`He knocks with his knuckles on ${TAPA}, ${GRANITE}, smiling proudly at the camera, sunny backyard behind him.`) }),
  S(1, "La miras de cerca", "bi", "b_granitemacro", { p: BI(`Extreme close view of a polished cement surface ${GRANITE}; each stone chip shows its cut face, a few water drops sitting round on the gloss.`) }),
  S(1, "el brillo mojado", "bi", "b_granitereflect", { p: BI(`Low angle view across ${TAPA}, ${GRANITE}, the blue sky and a tree reflected in the gloss like in a mirror.`), anim: "slow slide along the glossy surface" }),
  S(1, "Parece granito", "av", ""),
  // ── 0:08 · LA PROMESA
  S(2, "", "bi", "st_cementbag", { q: "cement bag", p: BI("A paper sack of gray cement on a concrete floor, a little powder spilled next to it.") }),
  S(2, "piedra partida de corralón", "bi", "b_chipsbag", { p: BI(`${CHIPS} open on a wooden table, a hand scooping a handful of the black and white chips.`) }),
  S(2, "arena fina", "bi", "st_finesand", { q: "fine sand pile", p: BI("A small pile of fine pale sand on a board.") }),
  S(2, "y barniz", "bi", "b_varnishcan", { q: "opening paint can", p: BI(`${VARNISH} opened on a workbench next to a wide paintbrush.`) }),
  S(2, "Unos cinco dólares de material", "c", "ClReceipt", { props: { lines: [["Cemento", "4 kg"], ["Granza de mármol", "8 kg"], ["Arena fina", "2 kg"], ["Barniz", "¼ litro"]], total: ["Material de la tapa", "≈ 5 dólares"] } }),
  C(2, "Así estaba la mesa del patio", "ClBeforeAfter", { before: I + "b_tableold.jpg", after: I + "b_tablegranite.jpg", note: "cemento · una semana · tres manos de barniz" }),
  // ── el vecino
  S(3, "", "bi", "b_neighborlook", { p: BI(`${NEIGHBOR} bending over a glossy granite-looking tabletop in a sunny backyard, running his fingertips over it, eyebrows raised in disbelief.`) }),
  S(3, "una placa comprada", "av", ""),
  S(3, "Le tuve que mostrar la bolsa de cemento", "cl", "c_showbag", { p: CLP(`He holds up a half-empty paper sack of gray cement toward a neighbour in a light-blue checked shirt, laughing, in a sunny backyard workshop.`) }),
  // ── 0:20 · RÁFAGA
  S(4, "", "bi", "b_drymix", { q: "mixing dry cement trowel", p: BI(`Close view of ${HANDS} mixing gray cement powder, sand and black and white stone chips dry with a mason's trowel in a black plastic bucket.`), anim: "the trowel folds the dry mix" }),
  S(4, "Agua de a poco", "bi", "b_wateradd", { q: "pouring water cement mix", p: BI(`A small stream of water poured from a plastic jug into a bucket of gray cement and stone-chip mix while a trowel stirs it.`), anim: "water pours and the trowel stirs" }),
  S(4, "Vuelco en el molde", "bi", "b_pourmold", { p: BI(`${HANDS} tipping a bucket of thick gray stone-chip concrete into ${MOLD} on a workbench.`), anim: "the thick mix slides into the mold" }),
  S(4, "Golpeo los costados", "bi", "b_tapmold", { p: BI(`A hammer tapping the wooden side of ${MOLD} full of wet gray concrete, small bubbles rising on the surface.`), anim: "the hammer taps and bubbles rise" }),
  S(4, "Una semana tapado", "bi", "b_nylon", { q: "concrete curing plastic sheet", p: BI(`A concrete slab in a wooden mold covered with clear plastic sheeting held down with bricks, under a corrugated roof in a backyard.`) }),
  S(4, "Lijo con agua", "bi", "b_wetsand", { p: BI(`Close view of ${HANDS} sanding a gray concrete slab with wet sandpaper on a wooden block, gray slurry and water on the surface.`), anim: "the block slides back and forth in gray slurry" }),
  S(4, "y aparece la piedra", "bi", "b_reveal", { p: BI(`Close view of a wet gray concrete surface being wiped with a sponge: under the gray slurry the cut faces of black, white and gray stone chips appear.`), anim: "the sponge wipes and the stone appears" }),
  // ── el grito
  S(5, "", "bi", "b_varnishshine", { p: BI(`A wide paintbrush laying a coat of clear gloss varnish on a slab ${GRANITE}; the varnished half shines wet, the other half is still matte.`), anim: "the brush spreads the glossy varnish" }),
  S(5, "mira cómo brilla", "cl", "c_wow", { p: CLP(`He leans over ${TAPA}, ${GRANITE}, pointing at the shine with an open-mouthed delighted grin, looking at the camera.`) }),
  // ── 0:40 · 3 loops
  S(6, "", "av", ""),
  S(6, "Por qué el barniz adentro", "bi", "b_crumbly", { p: BI(`A blotchy, patchy gray cement slab with dark stains and halos on its surface, crumbling at one corner, on a workbench.`), ov: { c: "ClChip", props: { text: "1 · El barniz adentro", alert: true } } }),
  S(6, "El paso que casi todos se saltean", "bi", "b_tapsides", { p: BI(`A hammer resting against the side of a wooden mold full of wet concrete.`), ov: { c: "ClChip", props: { text: "2 · El paso que todos se saltean" } } }),
  S(6, "lo que pasó cuando el vecino", "bi", "b_neighbordoor", { p: BI(`${NEIGHBOR} standing at a front gate, holding a broken gray slab piece, looking guilty.`), ov: { c: "ClChip", props: { text: "3 · Lo del vecino" } } }),
  S(6, "Primero, la receta entera", "av", ""),
  // ── RECETA
  C(7, "", "ClChapter", { n: 1, title: "La receta entera", sub: "de una mesa vieja a granito" }),
  S(7, "Lo que necesitas", "c", "ClCheck", { props: { title: "Lo que necesitas", items: ["Cemento gris o blanco", "Granza de mármol", "Arena fina", "Barniz poliuretánico + aguarrás", "Lijas al agua 80 · 120 · 220"] } }),
  S(7, "Granza de mármol", "bi", "b_chipsmacro", { q: "gravel in hand", p: BI(`Extreme close view of a handful of marble chips: small crushed black, white and gray stones of 3 to 6 mm in an open palm.`) }),
  S(7, "Barniz poliuretánico brillante", "bi", "b_varnishtable", { p: BI(`${VARNISH}, a small bottle of mineral turpentine and three sheets of wet-and-dry sandpaper laid on a workbench.`) }),
  S(7, "lijas al agua", "bi", "st_sandpaper", { q: "sandpaper sheets", p: BI("Sheets of wet and dry sandpaper of different grits on a bench.") }),
  S(8, "", "bi", "b_moldbuild", { p: BI(`${HANDS} screwing a wooden batten onto an old plywood board with a cordless drill to form a rectangular mold.`), anim: "the drill drives the screw" }),
  S(8, "con cinta de embalar por dentro", "bi", "b_tapemold", { p: BI(`Hands lining the inside of ${MOLD} with brown packing tape, pressing it flat with a thumb.`) }),
  S(8, "sesenta por cuarenta", "c", "ClPins", { props: { img: I + "b_moldempty.jpg", pins: [{ x: 0.5, y: 0.2, label: "60 cm" }, { x: 0.85, y: 0.55, label: "40 cm" }, { x: 0.25, y: 0.7, label: "3 cm de espesor" }] } }),
  S(9, "", "bi", "b_mesh", { q: "welded wire mesh", p: BI(`A piece of galvanized welded wire mesh being cut with pliers to fit inside ${MOLD}.`) }),
  S(9, "a la mitad del espesor", "cl", "c_meshhold", { p: CLP(`He holds a rectangle of wire mesh over an empty wooden mold on the workbench, showing it to the camera.`) }),
  S(9, "se parte el primer día", "bi", "b_crackedslab", { q: "cracked concrete slab", p: BI(`A thin cement tabletop cracked in two across one corner, a heavy flower pot standing on the broken corner.`) }),
  // ── la mezcla
  S(10, "", "cl", "c_dryscoop", { p: CLP(`He scoops gray cement from a sack with a small bucket and dumps it into a big black mixing tub in the backyard workshop.`) }),
  S(10, "una parte de cemento", "c", "ClPasteRecipe", { props: { a: 1, b: 2, aLabel: "cemento", bLabel: "granza", note: "+ media de arena fina" } }),
  S(10, "Revuelvo hasta que el color sea parejo", "bi", "b_dryeven", { p: BI(`Top view into a black mixing tub: dry gray cement, sand and black and white stone chips stirred together with a trowel to an even color.`), anim: "the trowel turns the dry mix" }),
  S(11, "", "bi", "b_trickle", { p: BI(`A plastic jug pouring a thin trickle of water into a black tub of cement and stone mix while a trowel folds it.`), anim: "thin trickle of water, the trowel folds" }),
  S(11, "se sostiene en la cuchara", "bi", "b_spoonhold", { p: BI(`Close view of a mason's trowel lifting a heap of thick gray stone-chip concrete that holds its shape without dripping.`) }),
  S(11, "Si chorrea, te pasaste", "c", "ClDoDont", { props: { yes: { label: "Se sostiene", img: I + "b_spoonhold.jpg" }, no: { label: "Chorrea", img: I + "b_runny.jpg" } } }),
  S(12, "", "bi", "b_halfpour", { p: BI(`Wet gray stone-chip concrete half filling ${MOLD}, a sheet of wire mesh being laid flat on top of it.`) }),
  S(12, "golpeo los costados del molde", "cl", "c_hammer", { p: CLP(`He taps all around the wooden sides of a mold full of wet concrete with a hammer, concentrating, on the workbench.`) }),
  S(13, "", "bi", "b_bubbles", { p: BI(`Extreme close view of the surface of wet gray concrete in a mold with small air bubbles rising and popping.`), anim: "bubbles rise and pop on the wet surface" }),
  S(13, "es un agujero cuando lijas", "bi", "b_pinholes", { p: BI(`Close view of a sanded gray cement surface full of small round pinholes from trapped air.`), ov: { c: "ClChip", props: { text: "Burbuja = agujero", alert: true } } }),
  S(14, "", "bi", "b_screed", { q: "screeding concrete", p: BI(`A straight wooden board being dragged across the top of ${MOLD} to level the wet concrete.`), anim: "the board slides across and levels" }),
  S(14, "la tapo con nailon", "bi", "b_nylon2", { p: BI(`Hands spreading clear plastic sheeting over a fresh concrete slab in a mold under a corrugated roof, bricks on the corners.`), ov: { c: "ClStampOv", props: { text: "7 DÍAS" } } }),
  S(14, "le tiro un poco de agua con la mano", "bi", "b_splash", { p: BI(`A wet hand flicking water onto a curing concrete slab after lifting the plastic sheet.`) }),
  // ── desmoldar
  S(15, "", "bi", "b_demold", { p: BI(`${HANDS} unscrewing a wooden batten from a mold and lifting it away from a cured gray concrete slab.`), anim: "the batten comes away from the slab" }),
  S(15, "Sale gris, opaca, fea", "bi", "b_tableold", { p: BI(`${TAPA}: plain dull gray matte cement, nothing special, a few dusty marks, on a backyard table in daylight.`) }),
  S(15, "la tira y dice que el truco no sirve", "cl", "c_shrug", { p: CLP(`He stands by a dull gray cement slab on the workbench, shrugging with open hands and a knowing half-smile at the camera.`) }),
  // ── lijar
  S(16, "", "av", ""),
  S(16, "Lija al agua del ochenta", "bi", "b_sand80", { q: "wet sanding stone", p: BI(`${HANDS} sanding a dull gray concrete slab with coarse wet sandpaper wrapped on a wooden block, a hose trickling water on it.`), anim: "the block scrubs, water and slurry spread" }),
  S(16, "hasta que aparezca la piedra", "c", "ClSplit", { props: { img: I + "b_halfsanded.jpg", left: ["SIN LIJAR", "piel de cemento"], right: ["LIJA 80", "aparece la piedra"] } }),
  S(17, "", "bi", "b_dots", { p: BI(`Extreme close view of a wet sanded concrete surface where the cut faces of black, white and gray stone chips are starting to show through the gray.`), anim: "slow push in on the stone dots" }),
  S(17, "un pedazo de piedra cortado al medio", "bi", "b_chipcut", { p: BI(`Extreme macro of one black stone chip cut flat and polished inside gray cement, its crystals visible.`) }),
  S(18, "", "bi", "b_sand120", { p: BI(`${HANDS} sanding a wet slab with finer gray sandpaper on a block, the surface already speckled like granite.`), anim: "the block glides" }),
  S(18, "suave como un vidrio", "cl", "c_feel", { p: CLP(`He runs his flat palm over a wet speckled granite-like slab on the workbench, eyes closed, smiling.`) }),
  // ── secar y barnizar
  S(19, "", "bi", "b_wipe", { q: "wiping table with rag", p: BI(`A rag drying a speckled granite-like cement slab after rinsing, under a corrugated roof.`) }),
  S(19, "se pone blanco, como lechoso", "bi", "b_milky", { p: BI(`Close view of a cement slab with a cloudy milky white haze in the varnish where it was applied on a damp surface.`), ov: { c: "ClChip", props: { text: "Barniz sobre húmedo", alert: true } } }),
  S(20, "", "bi", "b_thin", { p: BI(`Mineral turpentine being poured into a jar of clear varnish and stirred with a stick, on a workbench.`), anim: "the turpentine pours and swirls" }),
  S(20, "setenta por ciento barniz", "c", "ClPasteRecipe", { props: { a: 7, b: 3, aLabel: "barniz", bLabel: "aguarrás", note: "sólo la primera mano" } }),
  S(20, "lo sella desde adentro", "bi", "b_soak", { p: BI(`Extreme close view of thinned varnish soaking into the pores of a sanded speckled cement surface, darkening it.`) }),
  S(21, "", "bi", "b_coat2", { p: BI(`A wide paintbrush laying a thin even coat of gloss varnish on a slab ${GRANITE}, brush strokes all in one direction.`), anim: "one long brush stroke" }),
  S(21, "siempre en el mismo sentido", "cl", "c_brush", { p: CLP(`He brushes varnish on the speckled slab in long straight strokes, focused, the can open beside him.`) }),
  // ── el final
  S(22, "", "bi", "b_tablegranite", { p: BI(`${TAPA}, ${GRANITE}, a sunny backyard, a potted plant and a cup on it.`) }),
  S(22, "la gota queda arriba", "bi", "b_drop", { q: "water drops on surface", p: BI(`Extreme close view of round water drops beading up on a glossy granite-looking cement surface.`), anim: "a drop lands and stays round" }),
  S(22, "suena a piedra", "cl", "c_knock2", { p: CLP(`He knocks twice on ${TAPA}, ${GRANITE}, listening with his head tilted, pleased.`) }),
  S(23, "", "c", "ClCheck", { props: { title: "Repaso", items: ["Mezcla en seco", "Agua de a poco", "Golpear el molde", "7 días tapada", "Lija al agua 80-120-220", "2 días secando", "3 manos de barniz"] } }),
  // ── LA CUENTA
  C(24, "", "ClChapter", { n: 2, title: "La cuenta", sub: "de dónde salen los cinco dólares" }),
  S(25, "", "bi", "b_scale", { q: "kitchen scale weighing", p: BI(`A bucket of gray cement on a bathroom scale on a workbench, a bag of marble chips beside it.`) }),
  S(25, "me sobró casi toda", "bi", "st_cementsacks", { q: "cement sacks stacked", p: BI("Sacks of cement stacked in a hardware store.") }),
  S(26, "", "bi", "b_quarterliter", { q: "small paint can", p: BI(`A small quarter-liter tin of clear varnish next to three used sheets of sandpaper on a bench.`) }),
  S(26, "veinte o treinta veces más", "c", "ClReceipt", { props: { lines: [["Tu tapa de cemento", "≈ 5 dólares"], ["Placa de granito cortada y pulida", "20 a 30 veces más"]], total: ["Diferencia", "mucha plata"] } }),
  S(27, "", "bi", "b_tools", { q: "tools on workbench", p: BI(`A bucket, a mason's trowel, a hammer, a wooden sanding block and a paintbrush laid out on a wooden workbench in daylight.`) }),
  S(27, "No hace falta amoladora", "bi", "st_anglegrinder", { q: "angle grinder", p: BI("An angle grinder lying on a workbench.") , ov: { c: "ClChip", props: { text: "No hace falta", alert: true } } }),
  // ── CTA 1: el regalo
  S(28, "", "av", ""),
  S(28, "La de la madera que no se pudre", "bi", "b_post", { q: "wooden fence post", p: BI(`A wooden fence post in a sunny backyard, its lower half dark and glossy with a waxy protective coat.`) }),
  S(28, "piso que parece porcelanato", "bi", "b_floorblue", { p: BI(`A glossy turquoise-blue cement floor in a bright small room, shining like porcelain tile.`) }),
  S(28, "la de las goteras", "bi", "b_roofseal", { q: "flat roof crack", p: BI(`A crack on a flat concrete roof sealed with a shiny transparent coat, water drops beading on it.`) }),
  C(29, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "las 10 mezclas con medidas, gratis" }),
  S(29, "Guárdala", "av", ""),
];
