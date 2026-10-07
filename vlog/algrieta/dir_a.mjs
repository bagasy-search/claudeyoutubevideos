// DIRECTOR A — algrieta (Claudio el Albañil #5, "La casa de Doña Marta" ep. 5): MINUTO 1 (la espátula con pasta a punto de tapar la
// grieta en el seg 0 + "no la tape todavía" → la cara → la moneda que entra → las 2 tapadas del pintor → el loop del yeso → promesa
// (moneda + yeso) + vistazo → credibilidad + la prueba de la foto → capítulo) + el video de la gotera + el pasillo + por qué casi todas
// no son nada (mención 1) + la moneda + las 4 señales + el testigo de yeso + las 4 semanas (párrafos 0-31).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const H = "a mason's rough weathered hands, the sleeve of a bright orange t-shirt at the edge of the frame";
export const HALL = "the narrow hallway of an old modest Latin American house with pale mint-green plastered walls, red terracotta floor tiles and framed school photos of grandchildren in wooden frames, a wooden bedroom door at the end";
export const CRACK = "a diagonal crack about as long as an arm running up from the top corner of a wooden bedroom door frame toward the ceiling on a pale mint-green plastered wall, with old white filler along it cracked open again";
export const PAINTER = "a house painter in his forties in white paint-stained overalls and a cap";
export const BOY = "a skinny 11-year-old Latin American boy with short black hair in a soccer t-shirt";
const I = "img/algrieta/";
export const SHOTS = [
  // ── 0:00 · la espátula a punto de tapar
  S(0, "", "bi", "b_puttystop", { p: BI(`Close view of a putty knife loaded with white filler paste about to press into ${CRACK}.`), anim: "the putty knife moves toward the crack", ov: { c: "ClStampOv", props: { text: "NO LA TAPE" } } }),
  S(0, "Si la tapa sin saber si se mueve", "av", ""),
  S(0, "en un mes está abierta otra vez", "bi", "b_reopened", { p: BI("Extreme close view of a white filler line along a crack in a painted wall, split open down its middle again.") }),
  // ── la moneda
  S(1, "", "kf", "k_coin", { p: BI(`Close view of ${H} holding a coin edge-on against ${CRACK}.`), d1: "the coin edge touches the crack", d2: "the coin slides into the crack and stays standing in it", sound: "a coin scraping into plaster" }),
  S(1, "Eso quiere decir que la grieta", "bi", "b_coinedge", { p: BI("Extreme close view of the ridged edge of a coin pushed into a crack in green-painted plaster, crumbs of plaster around it.") }),
  S(1, "más de un milímetro y medio", "bi", "b_coinin", { p: BI("Extreme close view of a coin standing edge-on inside a crack in a pale mint-green plaster wall, held only by the crack.") }),
  S(1, "Y eso, en una pared", "bi", "b_wallflat", { p: BI(`The whole pale mint-green hallway wall above a wooden door, the diagonal crack running across it, seen straight on.`) }),
  S(1, "ya no es la pintura", "av", ""),
  // ── el pintor, 2 veces
  S(2, "", "bi", "b_hallcrack", { p: BI(`${HALL}, seen from the living room, with ${CRACK} visible above the door at the end.`) }),
  S(2, "del pasillo de Doña Marta", "bi", "b_martadoor", { p: BI(`${MARTA} standing at the open door of her bedroom at the end of ${HALL}, looking up at the crack above the door frame.`) }),
  S(2, "El mismo pintor", "bi", "b_painterputty", { p: BI(`${PAINTER} on a step stool smearing thick white filler over a diagonal crack above a door frame in a narrow hallway.`), anim: "the putty knife smears filler along the crack" }),
  C(2, "dos veces con masilla", "ClNotebook", { title: "El pintor", rows: [{ k: "Enero", v: "pasta" }, { k: "Abril", v: "más pasta" }], strike: true, mark: "✗", note: "se abrió las dos veces" }),
  S(2, "Las dos veces, a los dos meses", "bi", "b_calendar2", { q: "wall calendar", p: BI("A paper wall calendar in an old kitchen with two months circled in pen, a small drawing of a crack next to each circle.") }),
  S(2, "en el mismo lugar", "bi", "b_samespot", { p: BI(`Close view of ${CRACK}, the old filler showing two layers, both split along the same line.`) }),
  // ── el loop del yeso
  S(3, "", "bi", "b_plasterpill", { p: BI("A small round pill of white gypsum plaster stuck across a diagonal crack on a pale mint-green wall, a date written beside it in pencil.") }),
  S(3, "a las cuatro semanas", "bi", "b_weeks", { p: BI("A paper wall calendar with four Saturdays circled in pen one after another, a small phone resting on the shelf below it.") }),
  S(3, "eso Doña Marta no lo esperaba", "cl", "c_plaster", { p: CLP(`He stands in ${HALL} holding a phone up to a small white gypsum plaster pill stuck across the crack above the door, showing the phone screen to the camera with a small smile.`) }),
  // ── la promesa
  S(4, "", "av", ""),
  S(4, "si una grieta es peligrosa", "bi", "b_scary", { q: "crack wall window", p: BI("A long diagonal crack running from the corner of a window frame across a painted wall of an ordinary home, seen from below, side light.") }),
  S(4, "o se tapa en cinco minutos", "bi", "b_quickfix", { p: BI(`Close view of ${H} running a narrow putty knife with white filler along a fine hairline crack in a painted wall.`) }),
  S(4, "con una moneda y un poco de yeso", "bi", "b_coinyeso", { p: BI("A coin, a small plastic cup of mixed white gypsum paste and a pencil on a little wooden stool in a hallway, a crack in the wall behind.") }),
  S(4, "Y cómo se tapa para que no vuelva", "bi", "b_elastic", { p: BI("A small tub of white elastic crack filler with a plain blank label and a narrow putty knife on a step stool.") }),
  S(4, "Así estaba la pared", "cl", "c_before5", { p: CLP(`He stands in ${HALL} pointing at ${CRACK}, frowning at the camera.`), ov: { c: "ClChip", props: { text: "Antes", alert: true } } }),
  S(4, "Y así va a quedar", "cl", "c_glimpse5", { p: CLP(`He stands in ${HALL} with a paint roller raised, his body blocking most of the freshly painted smooth wall above the door, glancing back at the camera with a small smile.`), ov: { c: "ClChip", props: { text: "Después" } } }),
  // ── credibilidad + prueba de la foto
  S(5, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de albañil" } } }),
  S(5, "Treinta años de albañil", "bi", "b_toolbelt2", { q: "tool belt", p: BI("A worn leather tool belt with a trowel, a pencil, a yellow tape measure and a putty knife, hanging on a nail.") }),
  S(5, "miles de grietas", "bi", "st_crackwall", { q: "cracked wall", p: BI("A cracked old plaster wall.") }),
  S(5, "Y al final le doy", "av", ""),
  S(5, "la prueba de cero dólares", "bi", "b_phonehand", { p: BI(`Close view of ${H} holding an old smartphone up toward a wall with a crack, camera app open.`) }),
  S(5, "antes de tapar cualquier grieta", "bi", "b_coinphoto", { p: BI(`Close view of a smartphone taking a photo of a coin held flat against the wall right next to ${CRACK}.`), ov: { c: "ClChip", props: { text: "$0" } } }),
  S(5, "Cinco segundos, con el celular", "av", ""),
  C(6, "", "ClChapter", { n: 1, title: "Casi todas no son nada", sub: "pero hay que saber cuál" }),
  S(6, "casi todas las grietas", "bi", "b_hairmap2", { p: BI("Extreme close view of a web of very fine hairline cracks in old painted plaster under side light.") }),
  // ── el video de la gotera
  C(7, "", "ClVideoRef", { thumb: I + "th_algotera.jpg", title: "La gotera de la cocina" }),
  S(7, "se lo dejo acá", "av", ""),
  S(7, "Ese día, al bajar del techo", "bi", "b_roofdown", { p: BI("A metal ladder leaning against the wall of an old house up to a flat roof, seen from the patio, a bucket of membrane at its foot.") }),
  S(7, "pasé por el pasillo y vi esta grieta", "bi", "b_ladderhall", { p: BI(`A folded aluminum ladder leaning against the wall in ${HALL}, the crack above the door visible.`) }),
  // ── el pasillo
  S(8, "", "bi", "b_hall", { p: BI(`${HALL}, warm afternoon light, nobody in it.`) }),
  S(8, "las fotos de los nietos en marcos de madera", "bi", "b_frames", { q: "family photos wall frames", p: BI("A row of framed school graduation photos of smiling Latin American children in wooden frames on a pale mint-green wall.") }),
  S(8, "una grieta en diagonal que sube hacia el techo", "bi", "b_crackup", { p: BI(`Looking up at ${CRACK} from below the door.`) }),
  S(9, "", "bi", "b_tomasphoto", { p: BI(`A framed school photo of ${BOY} smiling with a missing front tooth, on a pale mint-green wall.`) }),
  S(9, "cada vez mira la grieta de reojo", "bi", "b_martaglance", { p: BI(`${MARTA} walking down a narrow hallway carrying folded towels, glancing sideways and up at a crack above a door.`) }),
  S(10, "", "bi", "b_enduido", { p: BI("A tub of white wall filler paste with a plain blank label, a wide putty knife and a sanding block on a step stool.") }),
  S(10, "Quedó perfecta", "bi", "b_smoothwall", { p: BI(`A freshly painted smooth pale mint-green wall above a door frame in a hallway, no crack visible.`) }),
  S(10, "A los dos meses, la raya otra vez", "kf", "k_line", { p: BI(`Close view of a smooth freshly painted pale mint-green wall above a door frame.`), d1: "the smooth painted wall above the door", d2: "a thin diagonal crack line slowly appears in the paint", sound: "a quiet hallway, a clock ticking" }),
  S(11, "", "bi", "b_martafear", { p: BI(`${MARTA} standing in ${HALL} with her hands clasped at her chest, looking worried at the crack above her bedroom door.`) }),
  S(11, "eso lo vamos a saber en cuatro semanas", "av", ""),
  // ── casi todas no son nada
  C(12, "", "ClCrackTypes", { pick: 0 }),
  S(13, "", "kf", "k_mud", { p: BI("Extreme close view of wet brown mud in a puddle drying in the sun.") , d1: "the wet mud shines in the sun", d2: "the mud dries and cracks into a pattern of small plates", sound: "a quiet sunny patio" }),
  S(13, "Esas rayitas finas, como cabellos", "bi", "b_hairline", { q: "hairline cracks plaster", p: BI("Extreme close view of fine hairline cracks running in all directions in old painted plaster, like a map.") }),
  C(14, "", "ClCrackTypes", { pick: 1 }),
  C(15, "", "ClCrackTypes", { pick: 2 }),
  S(15, "ladrillo visto", "bi", "st_brickcrack", { q: "brick wall crack", p: BI("A stair-step crack running through the mortar joints of an exposed brick wall.") }),
  S(16, "", "av", ""),
  S(16, "Yeso de construcción", "bi", "b_yesobag", { p: BI("A small paper bag of white construction gypsum plaster with a plain blank label, opened, beside a plastic cup and a spoon.") }),
  S(16, "En el Manual le dejé la frase exacta", "av", "", { ov: { c: "ClChip", props: { text: "Manual · pág. 13" } } }),
  // ── la moneda
  C(17, "", "ClCoinTest", { result: "no" }),
  C(18, "", "ClCoinTest", { result: "yes" }),
  S(18, "Quiere decir que hay que saber si se está moviendo", "av", ""),
  S(19, "", "bi", "b_coinstand", { p: BI(`Close view of a coin standing by itself in ${CRACK}, lit from the side.`) }),
  // ── las 4 señales
  C(20, "", "ClChapter", { n: 2, title: "Las 4 señales", sub: "si aparece una, profesional", alert: true }),
  C(21, "", "ClCheck", { title: "Llame a un profesional si…", items: ["Diagonal y más ancha arriba", "Una puerta o ventana se traba", "La grieta sigue por el piso", "Crece de una semana a otra"] }),
  S(22, "", "bi", "b_measuretop", { p: BI(`Close view of ${H} holding a coin at the top end of a diagonal crack, then the same coin size compared at its bottom end, a pencil mark beside each.`) }),
  S(22, "La puerta del dormitorio cerraba bien", "kf", "k_door", { p: BI(`A wooden bedroom door in ${HALL} being closed gently by an old woman's hand.`), d1: "the door swings toward the frame", d2: "the door closes smoothly and the latch clicks", sound: "a wooden door closing with a soft click" }),
  S(22, "Ninguna de las cuatro", "av", ""),
  // ── el testigo de yeso
  C(23, "", "ClChapter", { n: 3, title: "El testigo de yeso", sub: "4 semanas" }),
  S(23, "como una pasta espesa", "bi", "b_mixyeso", { q: "mixing plaster cup", p: BI(`Close view of ${H} mixing white gypsum plaster with a little water in a plastic cup with a spoon into a thick paste.`), anim: "the spoon stirs the thick white paste" }),
  S(23, "Y pegue una pastilla del tamaño de una moneda grande", "kf", "k_pill", { p: BI(`Close view of ${H} pressing a dab of white gypsum paste across a diagonal crack on a pale mint-green wall with a fingertip.`), d1: "the fingertip holds the white paste over the crack", d2: "the paste is pressed flat into a round pill across the crack", sound: "a soft press of wet plaster" }),
  S(24, "", "bi", "b_datepencil", { p: BI(`Close view of ${H} writing a date with a carpenter's pencil on the wall beside a small round white plaster pill across a crack.`) }),
  C(24, "si la pared se mueve aunque sea un pelito", "ClPlasterTell", { result: "broken" }),
  C(25, "", "ClPlasterTell", { result: "whole" }),
  S(26, "", "cl", "c_twopills", { p: CLP(`He crouches in ${HALL} next to the door, pointing with a pencil at two small white plaster pills stuck across the diagonal crack, one high and one low.`) }),
  S(26, "Y le pedí a Tomás que les sacara una foto cada sábado", "bi", "b_tomasphone", { p: BI(`${BOY} standing on a little stool in ${HALL} taking a photo with an old smartphone of a white plaster pill on the wall above a door.`) }),
  S(27, "", "bi", "b_namenotes", { p: BI("Two small paper notes stuck with tape on a pale mint-green wall next to two white plaster pills across a crack, each with a child's handwriting.") }),
  S(27, "Pepe y Lola, sanos", "av", ""),
  // ── las 4 semanas
  S(28, "", "bi", "b_martamsg", { p: BI(`${MARTA} sitting in her kitchen typing slowly on an old smartphone with one finger, reading glasses on, smiling a little.`) }),
  S(28, "Y cada sábado, entero", "bi", "b_pillwhole", { p: BI("Extreme close view of a small round white gypsum plaster pill across a crack on a painted wall, perfectly whole, a pencil date beside it.") }),
  S(29, "", "bi", "st_heatwave", { q: "hot sun heat wave", p: BI("A strong sun blazing in a hazy summer sky over rooftops.") }),
  S(29, "Le hice ampliar la foto a Tomás", "bi", "b_zoomphoto", { p: BI("Close view of a smartphone screen held by a child's hand, showing a zoomed-in photo of a white plaster pill on a wall, whole.") }),
  S(30, "", "av", ""),
  S(30, "La pasta común es dura", "bi", "b_hardpaste", { p: BI("Extreme close view of hard dry white filler paste in a crack, brittle and split, with a fine gap along its edge.") }),
  S(30, "Y el pintor nunca abrió la grieta", "bi", "b_ontop", { p: BI("A cross-section style close view of a wall crack with white filler only smeared on top of the surface, the crack still open beneath it.") }),
  S(31, "", "bi", "b_twopillswhole", { p: BI(`${CRACK.replace("with old white filler along it cracked open again", "")} with two small round white plaster pills across it, one high and one low, both whole, pencil dates beside them.`) }),
  S(31, "con las fotos de Tomás en la mano", "bi", "b_martaphotos", { p: BI(`${MARTA} sitting at her kitchen table looking at photos on a smartphone with a relieved smile, a cup of tea beside her.`) }),
  S(31, "Si el yeso se hubiera partido", "av", ""),
];
