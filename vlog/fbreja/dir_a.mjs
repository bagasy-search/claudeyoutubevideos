// DIRECTOR A — fbreja (El Constructor Libre): MINUTO 1 (el chorro de aflojatodo en el tarro de pintura + sello "ERROR" en el seg 0 →
// la reja naranja con escamas → PROMESA: negra, lisa, la mano limpia, $15 → el vecino en la vereda → ráfaga → "¡mira cómo resbala!"
// → 3 loops) + LA RECETA (en orden, no juntos: día seco, rociar, 10 min, cepillo, alcohol hasta trapo limpio, fondo en uniones,
// 2 manos finas con 8 h, abajo de los barrotes) + LA CUENTA + CTA 1 = QR (párrafos 0-29).
import { S, BI, CLP } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbreja/";
export const RUSTY = "an old front iron gate of vertical square bars in front of a small Latin American house, covered in orange rust, old black paint flaking off in scales, swollen rust at the welded joints";
export const PAINTED = "a front iron gate of vertical square bars in front of a small Latin American house, freshly painted glossy black, smooth and even, shining in the sun";
export const CAN = "a plain gray spray can of penetrating oil with a thin red straw nozzle and a blank label";
export const HANDS = "working hands in black nitrile gloves of a man in an olive-green shirt with rolled sleeves";
export const NEIGHBOR = "a sturdy 65-year-old Latin American neighbour, bald on top with gray hair at the sides, a thick gray mustache, a short-sleeved light-blue checked shirt with a pen in the pocket, glasses hanging on a cord";
export const SHOTS = [
  // ── 0:00 · el error en el segundo 0
  S(0, "", "bi", "b_canintopaint", { p: BI(`Close view of ${HANDS} spraying a long squirt from ${CAN} straight into an open tin of black enamel paint on a workbench.`), ov: { c: "ClStampOv", props: { text: "ERROR" } } }),
  S(0, "con la pintura para la reja", "bi", "st_rustgate", { q: "rusty iron gate", p: BI(`A rusty iron gate.`) }),
  S(0, "no lo hagas", "av", ""),
  S(0, "Ése es el error del video que viste", "bi", "b_oilypaint", { p: BI(`A stick lifted out of a tin of black paint, the paint streaked with shiny oily swirls that do not mix.`) }),
  // ── la reja naranja
  S(1, "", "bi", "b_rustygate", { p: BI(`${RUSTY}, morning light.`) }),
  S(1, "Hace dos inviernos estaba naranja", "cl", "c_pointrust", { p: CLP(`He stands next to ${RUSTY}, pointing at a rusty welded joint with one finger, looking at the camera, serious.`) }),
  S(1, "la pintura saltada en escamas", "bi", "b_flakes", { q: "peeling paint rust metal", p: BI(`Extreme close view of old black paint curling up in scales over orange rust on an iron bar.`) }),
  S(1, "las uniones hinchadas de óxido", "bi", "b_swollenjoint", { p: BI(`Extreme close view of a welded joint of an iron gate swollen with layered orange rust.`) }),
  S(1, "Cada vez que la abría", "bi", "b_gatehinge", { p: BI(`Close view of a rusty gate hinge as the old iron gate swings open, rust flakes falling from it.`), anim: "the gate swings, flakes fall" }),
  S(1, "me quedaba polvo marrón en la mano", "bi", "b_rusthand", { p: BI(`An open palm covered in orange-brown rust dust after touching an old iron gate.`) }),
  // ── 0:12 · LA PROMESA
  S(2, "", "bi", "b_paintedgate", { p: BI(`${PAINTED}, a potted plant beside it.`) }),
  S(2, "Negra, lisa, sin una mancha", "bi", "b_glossmacro", { p: BI(`Extreme close view of a glossy black painted iron bar with the sky reflected in it.`) }),
  S(2, "Le paso la mano y no sale nada", "bi", "b_cleanhand", { p: BI(`A bare hand sliding down a smooth glossy black iron bar, the palm clean.`), anim: "the hand slides down the bar" }),
  S(2, "Una lata de aflojatodo", "bi", "b_can", { p: BI(`${CAN} standing on a patio wall in the sun.`) }),
  S(2, "un poco de alcohol, un fondo y un esmalte", "c", "ClReceipt", { props: { lines: [["Aflojatodo", "≈ 5 dólares"], ["Alcohol", "1 o 2"], ["Fondo antióxido ¼ l", "≈ 5"], ["Esmalte ½ l", "5 a 8"]], total: ["La reja del frente", "≈ 15 dólares"] } }),
  C(2, "para toda la reja del frente", "ClBeforeAfter", { before: I + "b_rustygate.jpg", after: I + "b_paintedgate.jpg", note: "aflojatodo antes, pintura después" }),
  // ── el vecino
  S(3, "", "bi", "b_neighborsidewalk", { p: BI(`${NEIGHBOR} standing on the sidewalk with his arms crossed, looking at a freshly painted black iron gate, skeptical face.`) }),
  S(3, "me dijo que eso no dura", "av", ""),
  S(3, "que el óxido vuelve siempre", "bi", "st_rustbubble", { q: "rust under paint", p: BI(`Rust bubbling under paint on metal.`) }),
  S(3, "por abajo de la pintura", "bi", "b_underpaint", { p: BI(`Extreme close view of a blister of black paint on an iron bar cracked open, orange rust powder underneath.`) }),
  S(3, "Le dije que pasaran dos inviernos", "cl", "c_twowinters", { p: CLP(`He holds up two fingers toward a mustached neighbour in a light-blue checked shirt on a sunny sidewalk in front of a black iron gate, smiling.`) }),
  S(3, "y lo hablábamos", "bi", "b_neighborshrug", { p: BI(`${NEIGHBOR} on the sidewalk shrugging with both palms up, a doubtful half smile.`) }),
  // ── 0:22 · RÁFAGA
  S(4, "", "bi", "b_spray", { q: "spraying lubricant rust", p: BI(`Close view of ${HANDS} spraying ${CAN} onto a rusty welded joint of an iron gate, droplets glistening.`) }),
  S(4, "Diez minutos", "bi", "b_watch10", { p: BI(`A phone timer showing 10:00 resting on a patio wall next to a rusty gate.`), ov: { c: "ClStampOv", props: { text: "10 MINUTOS" } } }),
  S(4, "Cepillo de alambre", "bi", "b_brushbar", { q: "wire brush rust", p: BI(`${HANDS} scrubbing a rusty iron bar hard with a wire brush, orange dust flying.`), anim: "the wire brush scrubs, orange dust flies" }),
  S(4, "Sale todo el polvo naranja", "bi", "b_orangedust", { p: BI(`Orange rust dust falling onto the patio tiles below a gate bar being brushed.`) }),
  S(4, "Trapo con alcohol", "bi", "b_ragwipe", { p: BI(`A white rag soaked in alcohol wiping down a bare dark iron bar, the rag turning black.`), anim: "the rag wipes down the bar" }),
  S(4, "Una mano de fondo", "bi", "b_primerjoint", { p: BI(`A small brush dabbing gray anti-rust primer into a welded joint of a bare iron gate.`), anim: "the brush dabs the primer" }),
  S(4, "Dos de esmalte, finitas", "bi", "b_enamelbar", { q: "painting metal gate black", p: BI(`A brush laying a thin coat of glossy black enamel over a gray primed iron bar.`), anim: "the brush strokes down the bar" }),
  // ── el grito
  S(5, "", "bi", "b_hosegate", { p: BI(`A garden hose spraying water onto ${PAINTED}, the water beading and running off.`), anim: "water sprays and runs off" }),
  S(5, "mira cómo resbala el agua", "cl", "c_wow", { p: CLP(`He stands next to a glossy black iron gate holding a garden hose, pointing at the water beading off the bars, open-mouthed delighted grin, looking at the camera.`) }),
  // ── 0:40 · 3 loops
  S(6, "", "av", ""),
  S(6, "Por qué el aflojatodo adentro de la pintura", "bi", "b_oilyswirl", { p: BI(`Top view of an open tin of black paint with shiny oily swirls floating on the surface.`), ov: { c: "ClChip", props: { text: "1 · Adentro de la pintura", alert: true } } }),
  S(6, "Por qué dos manos finitas", "bi", "b_twocoats", { p: BI(`Close view of a painted iron bar edge showing a thin gray primer layer and two thin black enamel layers.`), ov: { c: "ClChip", props: { text: "2 · Dos manos finitas" } } }),
  S(6, "Y lo que pasó cuando el vecino", "bi", "b_neighborpaint", { p: BI(`${NEIGHBOR} painting his rusty iron garden gate straight from a tin with a wide brush, without brushing the rust off.`), ov: { c: "ClChip", props: { text: "3 · Lo del vecino", alert: true } } }),
  // ── RECETA
  C(7, "", "ClChapter", { n: 1, title: "La receta entera", sub: "en orden, no juntos" }),
  S(7, "Lo que necesitas", "c", "ClCheck", { props: { title: "Lo que necesitas", items: ["Aflojatodo (cualquiera)", "Cepillo de alambre", "Alcohol o desengrasante + trapos", "Fondo antióxido + esmalte sintético", "Pincel, rodillo de espuma", "Guantes y lentes"] } }),
  S(7, "Un pincel, un rodillo de espuma", "bi", "b_kit", { p: BI(`${CAN}, a wire brush, a bottle of alcohol, rags, a tin of gray primer, a tin of black enamel, a brush, a foam roller, gloves and safety glasses laid out on patio tiles in front of a rusty gate.`) }),
  S(8, "", "av", ""),
  S(8, "Van en orden", "c", "ClSplit", { props: { img: I + "b_order.jpg", left: ["ANTES", "aflojatodo + cepillo"], right: ["DESPUÉS", "alcohol + fondo + esmalte"] } }),
  S(8, "para que la pintura agarre", "bi", "b_bareiron", { q: "bare steel bar", p: BI(`Extreme close view of a clean bare dark iron bar, dry and matte, ready for paint.`) }),
  S(9, "", "bi", "st_clearsky", { q: "clear blue sky sun", p: BI(`A clear blue sky with the sun over rooftops.`), ov: { c: "ClStampOv", props: { text: "DÍA SECO" } } }),
  S(9, "ni a caer rocío a la noche", "bi", "b_dew", { q: "dew drops on metal", p: BI(`Morning dew drops on a black iron railing.`) }),
  S(10, "", "bi", "b_sprayjoint", { p: BI(`${HANDS} spraying penetrating oil from ${CAN} along the bottom rail of a rusty gate where it meets the ground.`), anim: "the spray mists along the rail" }),
  S(10, "en las bisagras", "bi", "b_sprayhinge", { q: "rusty hinge", p: BI(`The thin red straw of a spray can aimed at a rusty gate hinge, oil running into it.`) }),
  S(10, "Que quede bien mojado", "bi", "b_wetrust", { p: BI(`Extreme close view of rust on an iron bar glistening wet with penetrating oil.`) }),
  S(11, "", "bi", "b_waiting", { q: "iron gate sunlight", p: BI(`A rusty iron gate glistening with oil in the sun, a spray can and a wire brush waiting on the patio wall.`) }),
  S(11, "se mete por debajo de la cáscara de óxido", "bi", "b_crustmacro", { p: BI(`Extreme macro of a thick orange rust crust on iron lifting slightly at the edge, oil soaking under it.`) }),
  S(12, "", "bi", "b_brushhard", { p: BI(`${HANDS} scrubbing a rusty gate bar with a wire brush in all directions, rust flakes flying.`) }),
  S(12, "La cáscara se despega en pedazos", "bi", "b_crustfall", { p: BI(`Flakes of rust crust falling off an iron bar under a wire brush.`) }),
  S(12, "abajo aparece el hierro oscuro", "bi", "b_darkiron", { p: BI(`Close view of a half-brushed iron bar: orange rust on top, dark gray clean iron revealed below.`) }),
  S(13, "", "cl", "c_brushing", { p: CLP(`He crouches in front of a rusty iron gate scrubbing a bar with a wire brush, orange dust on his forearms, concentrating.`) }),
  S(13, "No hace falta que quede brillante", "bi", "b_dulliron", { p: BI(`An iron gate bar brushed to dull dark gray, a few dark stains left but nothing loose.`) }),
  S(14, "", "bi", "b_smallbrush", { p: BI(`A small toothbrush-shaped wire brush scrubbing rust out of the corner where two gate bars are welded.`), anim: "the small brush scrubs the corner" }),
  S(15, "", "bi", "b_ragbar", { p: BI(`${HANDS} wiping a bare iron gate bar with a white rag soaked in alcohol, bar by bar.`) }),
  S(15, "Sale negro y aceitoso", "bi", "b_blackrag", { p: BI(`Close view of a rag held up, smeared black and oily after wiping an iron gate.`), ov: { c: "ClStampOv", props: { text: "GRASA" } } }),
  S(16, "", "bi", "b_cleanrag", { p: BI(`A fresh white rag wiping an iron bar and coming away almost clean.`) }),
  S(16, "Y espero a que se evapore", "bi", "b_drybar", { q: "black metal gate", p: BI(`A clean dark iron gate drying in the sun, rags folded on the wall.`) }),
  S(17, "", "bi", "b_primerweld", { p: BI(`Close view of a brush pushing gray anti-rust primer into the welds and corners of an iron gate.`) }),
  S(17, "con el rodillo de espuma", "bi", "b_roller", { q: "foam roller painting metal", p: BI(`A small foam roller rolling gray primer down a flat iron bar.`), anim: "the roller rolls down" }),
  S(18, "", "bi", "b_primedgate", { q: "gray primer metal", p: BI(`A whole iron gate coated in matte gray anti-rust primer in the sun, drying.`) }),
  S(18, "El fondo se agarra del hierro", "c", "ClPins", { props: { img: I + "b_layers.jpg", pins: [{ x: 0.3, y: 0.7, label: "fondo: se agarra y frena el óxido" }, { x: 0.65, y: 0.3, label: "esmalte: sol y lluvia" }] } }),
  S(19, "", "bi", "b_firstcoat", { p: BI(`${HANDS} brushing a thin first coat of glossy black enamel over a gray primed gate bar.`) }),
  S(19, "Cargo poco el pincel", "bi", "b_tapbrush", { p: BI(`A paintbrush tapped against the rim of a tin of black enamel, little paint on it.`) }),
  S(19, "Si chorrea", "bi", "b_drip", { q: "paint drip", p: BI(`A drip of black enamel running down an iron bar.`) }),
  S(20, "", "bi", "st_clock", { q: "clock time lapse", p: BI(`A wall clock.`), ov: { c: "ClStampOv", props: { text: "8 HORAS" } } }),
  S(20, "segunda mano, también finita", "c", "ClCheck", { props: { title: "Las manos", items: ["1 mano de fondo", "2 manos finas de esmalte", "8 horas entre una y otra"] } }),
  S(21, "", "bi", "b_underside", { p: BI(`Low angle view from the ground of a brush painting the underside of the bottom rail of a black iron gate.`) }),
  S(21, "Me agacho y la pinto igual", "cl", "c_crouch", { p: CLP(`He crouches low on the patio, painting the underside of a black iron gate rail with a small brush, tongue between his teeth.`) }),
  // ── el final
  S(22, "", "bi", "b_finalgate", { q: "black iron gate house", p: BI(`${PAINTED}, full view, a little house behind it.`) }),
  S(22, "Le paso la mano y está lisa", "bi", "b_handsmooth", { p: BI(`Fingertips running along a smooth glossy black iron bar.`) }),
  S(22, "se forma la gotita y resbala", "bi", "b_beads", { q: "water drops metal railing", p: BI(`Extreme close view of water drops beading on a glossy black iron bar and sliding down.`), anim: "the drops slide down" }),
  S(23, "", "c", "ClCheck", { props: { title: "Repaso", items: ["Aflojatodo en lo oxidado", "10 minutos", "Cepillo: sin polvo naranja", "Alcohol: trapo limpio", "Fondo en uniones y soldaduras", "2 manos finas de esmalte, 8 h"] } }),
  // ── LA CUENTA
  C(24, "", "ClChapter", { n: 2, title: "La cuenta", sub: "de dónde salen los quince dólares" }),
  S(24, "quiero que veas de dónde sale", "av", ""),
  S(25, "", "bi", "st_hardware", { q: "paint cans hardware store shelf", p: BI(`Paint cans on a hardware store shelf.`) }),
  S(25, "te sobra para las bisagras de toda la casa", "bi", "b_doorhinge", { p: BI(`The red straw of a spray can oiling a door hinge inside a house.`) }),
  S(25, "Y medio litro de esmalte", "bi", "b_halflitre", { q: "paint can open", p: BI(`A half-litre tin of black enamel opened on a patio step, a stirring stick across it.`) }),
  S(26, "", "bi", "b_sidegate", { q: "garden gate", p: BI(`A small side garden gate freshly painted glossy black beside a house, a tin of paint at its foot.`) }),
  S(27, "", "bi", "st_newgate", { q: "wrought iron gate house", p: BI(`A wrought iron gate of a house.`) }),
  S(27, "Es una mañana de cepillo", "cl", "c_morning", { p: CLP(`He wipes his brow with his forearm in front of a half-brushed rusty iron gate, wire brush in hand, smiling tired.`) }),
  // ── CTA 1: el regalo
  S(28, "", "av", ""),
  S(28, "La del cemento que parece granito", "bi", "b_granitetop", { p: BI(`A cement tabletop polished to look exactly like dark speckled granite on a backyard table in the sun.`) }),
  S(28, "la de la madera que no se pudre", "bi", "b_post", { q: "wooden fence post", p: BI(`A wooden fence post in a sunny backyard, its lower half dark and glossy with a waxy protective coat.`) }),
  S(28, "la de la silicona para las goteras", "bi", "b_sealedroof", { p: BI(`A crack on a flat gray concrete roof filled and coated with a 30 cm wide band of matte white silicone, sunny.`) }),
  C(29, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "las 10 mezclas con medidas, gratis" }),
  S(29, "Guárdala", "av", ""),
];
