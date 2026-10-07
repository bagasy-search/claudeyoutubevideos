// DIRECTOR A — fbgrieta (El Constructor Libre): MINUTO 1 (el rodillo pintando encima de la masilla = sello "ERROR" en el seg 0 → la
// grieta tapada 3 veces que vuelve cada invierno → PROMESA: ni una línea, el dedo, < $3 → el vecino ("la casa se mueve") → ráfaga →
// "¡mira cómo se estira y vuelve!" → 3 loops) + LA RECETA (abrir en V, soplar, humedecer, mitad y mitad en el vaso, 10 min, apretar,
// alisar con detergente, 48 h) + LA CUENTA + CTA 1 = QR (párrafos 0-28).
import { S, BI, CLP } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbgrieta/";
export const WALL = "a plastered and painted cream-colored interior wall of a modest Latin American house";
export const CRACK = "a thin crack running across a cream-colored plastered wall";
export const FILLED = "a crack in a cream-colored plastered wall neatly filled flush with a smooth gray putty line";
export const MIX = "a gray putty of silicone mixed with cement in a clear plastic cup";
export const HANDS = "working hands in blue nitrile gloves of a man in an olive-green shirt with rolled sleeves";
export const NEIGHBOR = "a sturdy 65-year-old Latin American neighbour, bald on top with gray hair at the sides, a thick gray mustache, a short-sleeved light-blue checked shirt with a pen in the pocket, glasses hanging on a cord";
export const SHOTS = [
  // ── 0:00 · el error en el segundo 0
  S(0, "", "bi", "b_rollerover", { p: BI(`Close view of a paint roller rolling cream paint straight over a fresh gray silicone-filled crack on a wall.`), ov: { c: "ClStampOv", props: { text: "ERROR" } } }),
  S(0, "silicona con cemento para la grieta", "bi", "b_cupmix", { p: BI(`${MIX} with a putty knife standing in it, next to a silicone cartridge and a small bag of gray cement on a workbench.`) }),
  S(0, "no la pintes encima", "av", ""),
  S(0, "Ése es el error del video que viste", "bi", "b_shinyline", { p: BI(`A freshly painted cream wall with a shiny raised line showing through the paint exactly where a crack was filled.`) }),
  // ── la grieta que vuelve
  S(1, "", "bi", "b_crack", { p: BI(`Close view of ${CRACK}, the old patch marks around it.`) }),
  S(1, "Esta grieta la tapé tres veces", "cl", "c_pointcrack", { p: CLP(`He stands next to ${CRACK} in a living room, pointing at it with one finger, looking at the camera, fed up.`) }),
  S(1, "con enduido, con yeso", "bi", "b_oldpatches", { p: BI(`Close view of a wall crack with three layers of old white filler patches around it, each one cracked again along the same line.`) }),
  S(1, "con lo que tenía", "bi", "b_fillertubs", { p: BI(`Half-used tubs of white filler and a bag of plaster on a shelf next to a cracked wall.`) }),
  S(1, "Y cada invierno", "bi", "st_wintrywindow", { q: "frost on window winter", p: BI(`Frost on a window in winter.`) }),
  S(1, "en el mismo lugar", "bi", "b_samecrack", { p: BI(`Extreme close view of a hairline crack reopening through a smooth white filler patch on a wall.`) }),
  // ── 0:12 · LA PROMESA
  S(2, "", "bi", "b_filled", { p: BI(`${FILLED}, daylight from a window.`) }),
  S(2, "Le paso el dedo y está lisa", "bi", "b_fingerline", { p: BI(`A fingertip sliding along a smooth gray putty line flush with a plastered wall.`) }),
  S(2, "Un cartucho de silicona", "bi", "st_siliconetube", { q: "silicone caulk tube", p: BI(`A tube of silicone sealant on a table.`) }),
  S(2, "un puñado de cemento", "bi", "b_handcement", { p: BI(`A gloved hand holding a small handful of gray cement powder over a plastic cup.`) }),
  S(2, "Menos de tres dólares", "c", "ClReceipt", { props: { lines: [["Cartucho de silicona", "≈ 2 dólares"], ["Cemento", "un puñado"], ["Vaso + espátula", "los que tengas"]], total: ["Unos 4 metros de grieta", "< 3 dólares"] } }),
  C(2, "y me sobró para el patio", "ClBeforeAfter", { before: I + "b_crack.jpg", after: I + "b_filled.jpg", note: "silicona + cemento, mitad y mitad" }),
  // ── el vecino
  S(3, "", "bi", "b_neighborwall", { p: BI(`${NEIGHBOR} in a living room doorway looking at a cracked wall with his arms crossed, skeptical face.`) }),
  S(3, "que las grietas vuelven siempre", "bi", "b_neighborwag", { p: BI(`${NEIGHBOR} wagging a finger in front of a cracked living room wall, lecturing.`) }),
  S(3, "que es la casa que se mueve", "av", ""),
  S(3, "y no hay nada que hacer", "bi", "b_neighborshrug", { p: BI(`${NEIGHBOR} shrugging with both palms up next to a cracked wall, resigned.`) }),
  S(3, "Le dije que esperara un invierno", "cl", "c_onewinter", { p: CLP(`He raises one finger toward a mustached neighbour in a light-blue checked shirt in a living room, smiling confidently, a cracked wall behind them.`) }),
  // ── 0:22 · RÁFAGA
  S(4, "", "bi", "b_vopen", { p: BI(`Close view of the tip of a putty knife scraping a hairline crack in plaster into a small V-shaped groove, dust falling.`), anim: "the knife tip scrapes along the crack" }),
  S(4, "Soplo el polvo", "bi", "b_blow", { p: BI(`Fine plaster dust blowing out of a V-groove crack in a wall.`) }),
  S(4, "Silicona en el vaso", "bi", "b_squeezecup", { p: BI(`${HANDS} squeezing a finger-long bead of white silicone from a caulking gun into a clear plastic cup.`) }),
  S(4, "Cemento", "bi", "b_cementspoon", { p: BI(`A spoon dropping gray cement powder into a plastic cup next to white silicone.`) }),
  S(4, "Revuelvo", "bi", "b_stircup", { p: BI(`A putty knife mashing white silicone and gray cement together against the side of a plastic cup.`) }),
  S(4, "Relleno apretando", "bi", "b_press", { p: BI(`${HANDS} pressing gray putty into a V-groove crack in a wall with a putty knife.`) }),
  S(4, "Aliso con la espátula mojada", "bi", "b_smooth", { q: "plastering wall spatula", p: BI(`A wet putty knife gliding sideways over a gray filled crack, leaving it flush and smooth.`), anim: "the knife glides over" }),
  // ── el grito
  S(5, "", "bi", "b_thumbpress", { p: BI(`Extreme close view of a thumb pressing into a gray putty line in a wall, the putty giving slightly.`) }),
  S(5, "mira cómo se estira y vuelve", "cl", "c_wow", { p: CLP(`He points at a gray filled crack on a wall with a delighted open-mouthed grin, looking at the camera, putty knife in hand.`) }),
  // ── 0:40 · 3 loops
  S(6, "", "av", ""),
  S(6, "Por qué no se pinta encima", "bi", "b_peelpaint", { p: BI(`Close view of paint curling up off a shiny gray putty line on a wall.`), ov: { c: "ClChip", props: { text: "1 · No se pinta encima", alert: true } } }),
  S(6, "y qué usar si tu pared se pinta", "bi", "b_acrylic", { p: BI(`A cartridge of paintable acrylic sealant with a plain blank label next to a paint roller and a tray.`) }),
  S(6, "Por qué el yeso y el enduido se vuelven a rajar", "bi", "b_plastercrack", { p: BI(`A white plaster patch on a wall split again down the middle.`), ov: { c: "ClChip", props: { text: "2 · Por qué se vuelve a rajar" } } }),
  S(6, "Y lo que pasó cuando el vecino", "bi", "b_neighborroller", { p: BI(`${NEIGHBOR} painting a dining room wall with a roller above a sideboard, happy.`), ov: { c: "ClChip", props: { text: "3 · Lo del vecino", alert: true } } }),
  // ── RECETA
  C(7, "", "ClChapter", { n: 1, title: "La receta entera", sub: "mitad y mitad, en el vaso" }),
  S(7, "Lo que necesitas", "c", "ClCheck", { props: { title: "Lo que necesitas", items: ["Silicona acética (la común)", "Cemento gris (o blanco)", "Espátula", "Vaso descartable", "Pincel y guantes"] } }),
  S(7, "Una espátula, un vaso descartable", "bi", "b_kit", { p: BI(`A silicone cartridge, a caulking gun, a small bag of gray cement, a putty knife, a clear plastic cup, a small brush and blue gloves on a cloth by a cracked wall.`) }),
  S(8, "", "av", ""),
  S(8, "La silicona estira, el cemento le da cuerpo", "c", "ClSplit", { props: { img: I + "b_twoparts.jpg", left: ["SILICONA", "estira"], right: ["CEMENTO", "le da cuerpo"] } }),
  S(8, "que se mueve con la pared", "bi", "b_flexline", { p: BI(`Close view of a gray putty line in a wall crack, slightly stretched, still bonded on both sides.`) }),
  S(9, "", "bi", "b_vscrape", { p: BI(`Extreme close view of a putty knife tip scraping both sides of a crack in plaster into a V-groove.`) }),
  S(9, "Una grieta finita como un pelo", "bi", "b_hairline", { p: BI(`Extreme macro of a hairline crack in a plastered wall as thin as a hair, a coin held beside it for scale.`) }),
  S(9, "la masilla entra y se agarra", "c", "ClPins", { props: { img: I + "b_vsection.jpg", pins: [{ x: 0.5, y: 0.3, label: "abierta en V" }, { x: 0.5, y: 0.72, label: "se agarra de los dos lados" }] } }),
  S(10, "", "bi", "b_blowdust", { p: BI(`A man's lips blowing dust out of a V-groove crack in a wall, a puff of fine dust.`) }),
  S(10, "el polvo no se pega a nada", "bi", "st_dust", { q: "dust particles light", p: BI(`Dust floating in a beam of light.`) }),
  S(11, "", "bi", "b_wetedges", { p: BI(`A small brush barely damp with water stroking the edges of a V-groove crack in plaster, darkening them slightly.`) }),
  S(11, "El revoque seco chupa", "bi", "b_dryplaster", { p: BI(`Extreme close view of dry porous plaster at the edge of a crack.`) }),
  S(12, "", "bi", "st_openwindow", { q: "opening window", p: BI(`A window being opened.`) }),
  S(13, "", "bi", "b_bead", { p: BI(`A finger-long bead of white silicone in the bottom of a clear plastic cup.`) }),
  S(13, "un montoncito de cemento del mismo tamaño", "c", "ClPasteRecipe", { props: { a: 1, b: 1, aLabel: "silicona", bLabel: "cemento", note: "en volumen, a ojo" } }),
  S(13, "si los dos montoncitos se ven iguales", "bi", "b_twopiles", { p: BI(`Top view into a clear plastic cup: a white blob of silicone and an equal small mound of gray cement side by side.`) }),
  S(14, "", "bi", "b_mash", { p: BI(`A putty knife mashing silicone and cement against the side of a plastic cup, white streaks still visible.`) }),
  S(14, "una masa gris, pareja", "bi", "b_evenmix", { q: "mixing plaster", p: BI(`A putty knife lifting a smooth even gray putty from a plastic cup, no white streaks.`) }),
  S(15, "", "bi", "b_timer10", { p: BI(`A phone timer showing 10:00 next to a plastic cup of gray putty on a step ladder.`), ov: { c: "ClStampOv", props: { text: "10 MINUTOS" } } }),
  S(15, "Si tienes tres grietas, haces tres vasos", "bi", "b_threecups", { p: BI(`Three clear plastic cups lined up on a step ladder, one with gray putty, two empty.`) }),
  S(16, "", "bi", "b_fill", { q: "filling crack wall", p: BI(`${HANDS} loading a putty knife with gray putty and pressing it into a crack from bottom to top.`) }),
  S(16, "dejo un poquito de más", "bi", "b_overfill", { p: BI(`Close view of a crack in a wall filled with gray putty standing slightly proud of the surface.`) }),
  S(17, "", "bi", "b_soapcup", { p: BI(`A putty knife dipped into a cup of soapy water.`) }),
  S(17, "La paso de costado, firme", "bi", "b_sideswipe", { q: "spackle wall", p: BI(`A wet putty knife held sideways sweeping excess gray putty off a wall, leaving it flush.`) }),
  S(18, "", "bi", "b_corner", { p: BI(`A gloved fingertip wet with soapy water smoothing gray putty into the corner where two walls meet.`) }),
  S(19, "", "bi", "st_clock", { q: "wall clock", p: BI(`A wall clock.`), ov: { c: "ClStampOv", props: { text: "48 HORAS" } } }),
  S(19, "Si la tocas antes, la marcas", "bi", "b_mark", { q: "wall repair", p: BI(`Close view of a fingerprint pressed into a fresh gray putty line on a wall.`) }),
  S(20, "", "bi", "b_wipeknife", { q: "cleaning putty knife", p: BI(`A rag wiping gray putty off a putty knife.`) }),
  // ── el final
  S(21, "", "bi", "b_final", { q: "white wall room", p: BI(`${FILLED}, a little farther back so the whole wall shows.`) }),
  S(21, "De lejos parece revoque", "cl", "c_proud", { p: CLP(`He stands back from a wall with a gray filled crack, arms crossed, nodding proudly, in a living room.`) }),
  S(22, "", "c", "ClCheck", { props: { title: "Repaso", items: ["Abrir en V", "Soplar el polvo", "Bordes apenas húmedos", "Silicona + cemento, 1 a 1", "Sólo lo de una grieta", "Alisar con detergente", "48 horas sin tocar"] } }),
  // ── LA CUENTA
  C(23, "", "ClChapter", { n: 2, title: "La cuenta", sub: "menos de tres dólares" }),
  S(23, "quiero que veas de dónde sale", "av", ""),
  S(24, "", "bi", "st_hardware", { q: "silicone tubes hardware store", p: BI(`Tubes of sealant on a hardware store shelf.`) }),
  S(24, "un puñado de la bolsa que quedó de la última obra", "bi", "b_cementbag", { p: BI(`An old opened paper bag of gray cement folded over in the corner of a backyard shed.`) }),
  S(25, "", "bi", "b_step", { q: "concrete step", p: BI(`A concrete patio step with a gray filled crack across the middle.`) }),
  S(26, "", "bi", "st_bucket", { q: "bucket of filler", p: BI(`A bucket of wall filler.`) }),
  S(26, "Esto lo haces tú, en una tarde", "cl", "c_afternoon", { p: CLP(`He kneels by a patio step with a putty knife and a plastic cup, smiling at the camera, afternoon sun.`) }),
  // ── CTA 1: el regalo
  S(27, "", "av", ""),
  S(27, "La del cemento que parece granito", "bi", "b_granitetop", { p: BI(`A cement tabletop polished to look exactly like dark speckled granite on a backyard table in the sun.`) }),
  S(27, "la del aflojatodo para la reja", "bi", "b_blackgate", { p: BI(`A front iron gate of vertical bars freshly painted glossy black in front of a small house, sunny.`) }),
  S(27, "la de la gaseosa para la olla quemada", "bi", "b_shinypot", { p: BI(`A clean shiny stainless steel pot on a kitchen counter in daylight.`) }),
  C(28, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "las 10 mezclas con medidas, gratis" }),
  S(28, "Guárdala", "av", ""),
];
