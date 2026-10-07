// DIRECTOR A — almoho (Claudio el Albañil #1, "La casa de Doña Marta" ep. 1): MINUTO 1 (la mano con el cloro contra el moho en el
// seg 0 + "no lo limpie" → la cara de Claudio en el seg ~1,5 → cloro: blanco el día 1, negro el día 14 → Doña Marta y la libreta de
// los 3 pagos al pintor → el loop del ropero → promesa (vinagre, aluminio, 5 cm) + antes/vistazo del después → credibilidad + la prueba
// de $0 al final → capítulo) + la casa y el pintor + por qué vuelve + la prueba del aluminio (párrafos 0-21).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const H = "a mason's rough weathered hands, the sleeve of a bright orange t-shirt at the edge of the frame";
export const ROOM = "an old bedroom of a modest Latin American house with thick plastered walls painted pale mint green, red terracotta floor tiles and a tall wooden window with white iron bars";
export const WALL = "the corner of an old bedroom wall painted pale mint green with a big black mold stain spreading from the ceiling down to the skirting board";
export const WARD = "an old heavy dark-wood wardrobe with two doors and a carved top";
export const PAINTER = "a house painter in his forties in white paint-stained overalls and a cap";
export const NIECE = "a Latin American woman in her forties with a dark ponytail, jeans and a blue blouse";
const I = "img/almoho/";
export const SHOTS = [
  // ── 0:00 · el cloro contra el moho → la cara
  S(0, "", "bi", "b_spraystop", { p: BI(`Close view from behind the shoulder of an older woman's hand holding a white spray bottle of bleach aimed at ${WALL}, about to spray.`), anim: "the hand lifts the spray bottle toward the black mold", ov: { c: "ClStampOv", props: { text: "NO LO LIMPIE" } } }),
  S(0, "Si lo limpia", "av", ""),
  S(0, "vuelve más grande", "bi", "b_moldbig", { q: "mold wall close up", p: BI(`Extreme close view of thick black mold spreading in round fuzzy patches over a pale mint-green plastered wall, the paint bubbling around it.`) }),
  // ── cloro: día 1 blanco, día 14 negro
  S(1, "", "kf", "k_bleachwipe", { p: BI(`Close view of an older woman's hand in a yellow rubber glove wiping ${WALL} with a cloth soaked in bleach; where she wipes, the black turns pale.`), d1: "the gloved hand wipes the black mold with a wet cloth", d2: "the wiped band turns pale and almost white while the rest stays black", sound: "a wet cloth rubbing on plaster" }),
  S(1, "se va en un minuto", "bi", "b_whitewall", { p: BI(`The same corner of a pale mint-green bedroom wall now looking clean and white where it was wiped, still wet and shiny, a bleach bottle with a plain label on the floor.`), ov: { c: "ClChip", props: { text: "Día 1" } } }),
  S(1, "Y a las dos semanas", "bi", "b_dotsback", { p: BI(`The same corner of a pale mint-green bedroom wall covered again with hundreds of tiny black mold dots coming back in the same place, larger than before.`), ov: { c: "ClChip", props: { text: "Día 14", alert: true } } }),
  C(1, "más negra que antes", "ClPores3D", { mode: "bleach", labels: { top: "Blanco arriba", roots: "La raíz, viva" } }),
  // ── Doña Marta y la libreta
  S(2, "", "bi", "b_martawall", { p: BI(`${MARTA} seen from behind standing in ${ROOM}, looking up at ${WALL}, one hand on her hip.`) }),
  S(2, "Setenta años", "bi", "b_martaportrait", { p: BI(`${MARTA} standing by the barred wooden window of her old house, looking toward the camera with a tired, worried face, soft daylight on her.`), ov: { c: "ClNameTag", props: { name: "Doña Marta", sub: "70 años · viuda" } } }),
  S(2, "viuda", "bi", "b_ring", { p: BI(`Close view of an older woman's wrinkled hands folded on her apron, a thin gold wedding ring on her finger.`) }),
  C(2, "Ya le pagó tres veces", "ClNotebook", { title: "El pintor", rows: [{ k: "Marzo", v: "$180" }, { k: "Abril", v: "$180" }, { k: "Mayo", v: "$180" }], strike: true, mark: "volvió", note: "la misma pared" }),
  S(2, "Tres veces la pintó", "bi", "b_painterroller", { p: BI(`${PAINTER} rolling thick white paint with a paint roller over ${WALL}, covering the black mold.`), anim: "the roller moves up over the black stain" }),
  S(2, "y tres veces volvió el moho", "bi", "b_dotsthrough", { p: BI(`Extreme close view of fresh white paint on a bedroom wall with small gray-black mold dots coming through it from underneath.`) }),
  // ── el loop del ropero
  S(3, "", "bi", "b_wardrobe", { p: BI(`${WARD} standing tight against the corner of ${ROOM}, a dark shadowy gap at its side where black mold is just visible on the wall.`) }),
  S(3, "detrás de su ropero", "bi", "b_wardgap", { p: BI(`A dark narrow gap between the side of ${WARD} and a pale mint-green wall, black mold creeping out of the gap onto the wall.`) }),
  S(3, "eso no lo esperaba", "cl", "c_peek", { p: CLP(`He leans in to look into the narrow gap behind ${WARD} in ${ROOM}, holding a small flashlight, his eyebrows raised in surprise.`) }),
  // ── 0:16 · la promesa
  S(4, "", "av", ""),
  S(4, "Con un litro de vinagre", "bi", "st_vinegar", { q: "white vinegar bottle", p: BI("A clear plastic bottle of white vinegar with a plain label on a kitchen counter.") }),
  S(4, "un cuadrado de papel aluminio", "bi", "b_foilsquare", { p: BI(`A square of aluminum foil taped flat on all four sides with brown packing tape over a black mold stain on a pale mint-green plastered wall.`) }),
  S(4, "y cinco centímetros", "bi", "b_tape5", { p: BI(`Close view of ${H} holding a yellow tape measure extended a few centimeters into the narrow gap between the side of ${WARD} and a pale mint-green wall.`) }),
  S(4, "Así estaba la pared", "cl", "c_before", { p: CLP(`He stands in ${ROOM} beside ${WALL}, pointing at the black mold with one finger and frowning at the camera.`), ov: { c: "ClChip", props: { text: "Antes", alert: true } } }),
  S(4, "Y así va a quedar", "cl", "c_glimpse", { p: CLP(`He stands in ${ROOM} with his back half to the camera, his body hiding most of a freshly painted clean white wall corner, only a sliver of the clean white wall visible beside him, he glances back at the camera with a small smile.`), ov: { c: "ClChip", props: { text: "Después" } } }),
  // ── 0:28 · credibilidad + la prueba de $0
  S(5, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de albañil" } } }),
  S(5, "Treinta años de albañil", "cl", "c_trowel", { p: CLP(`He spreads mortar on a brick wall with a steel trowel in a sunny backyard, concentrating, cement dust on his arms.`) }),
  S(5, "miles de paredes", "bi", "b_tools", { q: "trowel tools bucket", p: BI("A worn steel trowel, a wooden float, a spirit level and a yellow tape measure resting on the rim of a cement-stained bucket on a red terracotta floor.") }),
  S(5, "la prueba de cero dólares", "bi", "b_tapehand", { p: BI(`Close view of ${H} holding a roll of brown packing tape in front of a painted pale mint-green wall.`), ov: { c: "ClChip", props: { text: "$0" } } }),
  S(5, "antes de tocar cualquier pared", "bi", "b_handwall", { q: "hand touching wall", p: BI(`Close view of ${H} pressing an open palm flat against a painted plaster wall of an old house, feeling it.`) }),
  S(5, "Cinco segundos", "kf", "k_tapepull", { p: BI(`Close view of ${H} gripping the end of a strip of brown packing tape stuck on a painted wall.`), d1: "the fingers grip the end of the tape stuck on the wall", d2: "the tape is ripped off the wall in one fast pull", sound: "a sharp rip of packing tape" }),
  S(5, "El pintor de Doña Marta", "bi", "b_paintcans", { p: BI("Three empty paint buckets with dried white drips stacked in the corner of an old patio next to a folded drop cloth and a used paint roller.") }),
  S(5, "no la hizo nunca", "av", ""),
  C(6, "", "ClChapter", { n: 1, title: "¿De dónde viene el agua?", sub: "antes de limpiar nada" }),
  // ── 0:52 · la llamada de la sobrina, la casa
  S(7, "", "bi", "b_niecephone", { p: BI(`${NIECE} talking on her phone in a kitchen, worried, her free hand on her forehead.`) }),
  S(7, "Me llamó un martes", "bi", "b_phonescreen", { p: BI(`Close view of ${H} holding an old smartphone showing an incoming call, on a workbench with tools.`) }),
  S(7, "mi tía tiene una pared negra", "bi", "b_wallfar", { p: BI(`${WALL}, seen from across the room in dim light, an old bed below it.`) }),
  S(7, "y ya no quiere gastar más", "bi", "b_purse", { p: BI(`An old cloth coin purse lying open and almost empty on a lace tablecloth next to reading glasses.`) }),
  S(7, "ya la pintaron tres veces", "bi", "b_wallthree", { p: BI(`${WALL}, with visible layers of white paint peeling at the edge of the stain.`) }),
  S(7, "Usted la puede mirar", "av", ""),
  S(8, "", "bi", "st_oldhouse", { q: "old house facade", p: BI("The front of an old modest one-story house with a wooden door, barred windows and thick walls, on a quiet street, daylight.") }),
  S(8, "Doña Marta me abrió la puerta", "bi", "b_martadoor", { p: BI(`${MARTA} opening the wooden front door of her old house, smiling politely, wiping her hands on her apron.`) }),
  S(8, "me llevó directo al dormitorio", "bi", "b_hallway", { q: "old house hallway", p: BI("The narrow hallway of an old modest house with pale mint-green walls, red terracotta tiles, framed family photos and a crucifix, a bedroom door open at the end.") }),
  S(8, "Una mancha negra que bajaba por la esquina", "bi", "b_stainfull", { p: BI(`${WALL}, seen from the bedroom door, ${WARD} pushed against it.`) }),
  // ── el pintor, tres veces
  S(9, "", "av", ""),
  S(9, "Le pasó cloro", "bi", "b_painterbleach", { p: BI(`${PAINTER} spraying bleach from a spray bottle onto ${WALL}.`), anim: "the spray mists over the black stain" }),
  S(9, "Ciento ochenta dólares", "bi", "b_cash", { q: "counting money hands", p: BI(`${MARTA}'s wrinkled hands counting a few dollar bills from an old cloth purse on a kitchen table with a lace tablecloth.`) }),
  S(9, "Lo llamó", "bi", "b_martaphone", { p: BI(`${MARTA} sitting at her kitchen table talking on an old corded wall phone, upset.`) }),
  S(9, "y otra vez le cobró", "bi", "b_receipts", { p: BI("Three handwritten paper receipts spread on a lace tablecloth next to reading glasses and an old cloth purse.") }),
  C(10, "", "ClReceipt", { lines: [["Pintura y cloro · marzo", "$180"], ["Pintura y cloro · abril", "$180"], ["Pintura y cloro · mayo", "$180"]], total: ["La misma pared", "$540"] }),
  S(10, "durmiendo cada noche al lado de eso", "bi", "b_bednight", { p: BI(`An old wooden bed with a crocheted blanket in ${ROOM} at night, the black mold stain on the wall right beside the headboard, a small bedside lamp on.`) }),
  S(10, "tosiendo un poquito cada mañana", "bi", "b_cough", { p: BI(`${MARTA} sitting on the edge of her bed in the morning, coughing into a handkerchief.`) }),
  S(11, "", "av", ""),
  S(11, "El problema es que el moho no se arregla en la pared", "bi", "b_drops", { q: "water droplets wall", p: BI("Extreme close view of tiny water droplets beaded on a cold pale mint-green plastered wall next to the first gray mold dots.") }),
  // ── por qué vuelve
  C(12, "", "ClPores3D", { mode: "roots", labels: { top: "La mancha", roots: "La raíz" } }),
  S(12, "como una esponja dura", "bi", "b_plastermacro", { p: BI("Extreme close view of the broken edge of old wall plaster showing its porous texture full of tiny holes, like a hard sponge.") }),
  S(13, "", "av", ""),
  S(13, "Blanquea", "bi", "b_bleachmacro", { p: BI("Extreme close view of bleach liquid soaking into a black mold stain on porous plaster, the surface turning pale and wet.") }),
  C(13, "Esa agua entra en la pared", "ClPores3D", { mode: "bleach", labels: { top: "Blanquea", roots: "Toma agua" } }),
  S(14, "", "bi", "b_paintover", { q: "painting wall roller", p: BI(`Close view of a paint roller loaded with white paint pressing over a black mold stain on a plastered wall, the black still showing gray through the first coat.`) }),
  S(14, "Lo único que hizo el pintor", "av", ""),
  S(15, "", "bi", "b_waterwall", { q: "damp wall corner", p: BI("A cold outside bedroom wall of an old house on a winter morning, the lower corner darker with damp and a few black dots, condensation on the window glass beside it.") }),
  S(15, "Si no corta el agua", "av", "", { ov: { c: "ClStampOv", props: { text: "PRIMERO EL AGUA", alert: false } } }),
  // ── la prueba del aluminio (mención 1 del Manual)
  S(16, "", "bi", "b_foilroll", { q: "aluminum foil roll", p: BI(`Close view of ${H} tearing a sheet off a roll of aluminum foil, a roll of brown packing tape on the table.`) }),
  S(16, "En la ferretería", "bi", "st_hardware", { q: "hardware store aisle", p: BI("The aisle of an ordinary neighborhood hardware store with shelves of paint cans, brushes and tools.") }),
  S(16, "En el Manual le dejé la frase exacta", "av", "", { ov: { c: "ClChip", props: { text: "Manual · pág. 9" } } }),
  C(17, "", "ClFoilTest", { result: "out" }),
  S(17, "Y no lo toque por cuarenta y ocho horas", "bi", "b_foilwait", { p: BI(`A square of aluminum foil taped on all four sides on ${WALL}, a small wall calendar hanging beside it, quiet room in daylight.`) }),
  S(18, "", "kf", "k_foilpeel", { p: BI(`Close view of ${H} peeling a square of aluminum foil off a pale mint-green wall, the room side of the foil covered in tiny water droplets.`), d1: "the fingers lift one corner of the taped foil", d2: "the foil peels down showing tiny water drops on its outer side", sound: "tape and foil crinkling" }),
  S(18, "Eso se llama condensación", "bi", "b_coldglass", { q: "cold glass condensation", p: BI("A cold glass of water on a kitchen table covered in condensation droplets running down the outside.") }),
  C(19, "", "ClFoilTest", { result: "all", title: "Tres resultados" }),
  S(19, "Si la mancha arranca en el zócalo", "bi", "b_skirting", { q: "rising damp wall", p: BI("The bottom of a painted plaster wall in an old house: the paint bubbling and flaking above the skirting board with a white salty powder, up to knee height.") }),
  S(19, "Y si aparece cuando llueve", "bi", "b_rainstain", { q: "water stain ceiling", p: BI("A brown water stain spreading on a white ceiling corner of an old house while rain streaks the window.") }),
  S(20, "", "bi", "b_oldstain", { p: BI("A faded old gray stain on a dry plaster wall, dusty and clearly old, a paint brush resting on a closed paint can below it.") }),
  S(21, "", "av", ""),
  S(21, "lo despegué despacito", "cl", "c_foil", { p: CLP(`He crouches by ${WALL} in ${ROOM}, holding up a peeled square of aluminum foil, showing its side covered in tiny water droplets to the camera, impressed.`) }),
  S(21, "Como un vaso de agua fría en verano", "bi", "b_drops2", { p: BI("Extreme close view of crumpled aluminum foil covered in many small clear water droplets, the black mold of the wall just behind.") }),
  S(21, "Venía del aire del dormitorio", "bi", "b_closedroom", { p: BI(`${ROOM} with the window closed and fogged with condensation, a clothes drying rack full of damp laundry next to the bed.`) }),
];
