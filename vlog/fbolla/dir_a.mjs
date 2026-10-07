// DIRECTOR A — fbolla (El Constructor Libre): MINUTO 1 (la sartén de teflón frotada con pasta = sello "ERROR" en el seg 0 → la olla
// del guiso quemado → PROMESA: el fondo brilla, me veo la cara, menos de $1 → el vecino ("para tirar") → ráfaga → "¡mira cómo se
// despega la costra!" → 3 loops) + LA RECETA (orden, no mezcla: mirar el material, gaseosa hasta tapar, 10 min fuego bajo, sin tapa,
// media hora enfriando, pasta en círculos, bicarbonato, secar) + LA CUENTA + CTA 1 = QR (párrafos 0-29).
import { S, BI, CLP } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbolla/";
export const KITCHEN = "a simple bright home kitchen in Latin America with white tiles, a gas stove, a stainless steel sink and a window with daylight";
export const POT = "a medium stainless steel cooking pot";
export const BURNT = "a medium stainless steel cooking pot with its bottom covered in a thick black burnt crust of stew";
export const SHINY = "a medium stainless steel cooking pot with a clean mirror-shiny bottom";
export const COLA = "a plastic bottle of dark cola soda with a plain blank red label";
export const PASTE = "a plain white tube of white toothpaste with a blank label";
export const HANDS = "hands of a man in an olive-green shirt with rolled sleeves";
export const NEIGHBOR = "a sturdy 65-year-old Latin American neighbour, bald on top with gray hair at the sides, a thick gray mustache, a short-sleeved light-blue checked shirt with a pen in the pocket, glasses hanging on a cord";
export const SHOTS = [
  // ── 0:00 · el error en el segundo 0
  S(0, "", "bi", "b_teflonscrub", { p: BI(`Close view of ${HANDS} scrubbing a black non-stick frying pan with white toothpaste and the green side of a sponge, gray scratches appearing in circles.`), anim: "the sponge scrubs in circles", ov: { c: "ClStampOv", props: { text: "ERROR" } } }),
  S(0, "la gaseosa cola con la pasta de dientes", "bi", "b_colapaste", { p: BI(`${COLA} and ${PASTE} side by side on a kitchen counter next to a stove.`) }),
  S(0, "primero fíjate de qué es tu olla", "av", ""),
  S(0, "de qué es tu olla", "bi", "b_flippot", { p: BI(`${HANDS} flipping a cooking pot upside down over a kitchen counter to look at the stamped base.`) }),
  S(0, "lo hacen en una de teflón", "bi", "b_scratchedpan", { p: BI(`Close view of a non-stick frying pan with dull gray scratched circles in the middle of the black coating.`) }),
  // ── la olla quemada
  S(1, "", "bi", "b_burntpot", { p: BI(`Top view of ${BURNT} sitting in the sink of ${KITCHEN}.`) }),
  S(1, "Se me quemó un guiso", "bi", "st_smokepot", { q: "burnt food pot smoke", p: BI(`Smoke rising from a pot on a stove.`) }),
  S(1, "de esos que te olvidas en el fuego", "cl", "c_forgot", { p: CLP(`He stands in ${KITCHEN} holding ${BURNT} by the handles, grimacing at the camera.`) }),
  S(1, "El fondo quedó negro", "bi", "b_blackbottom", { p: BI(`Top view straight down into ${BURNT}, the whole bottom black.`) }),
  S(1, "con una costra dura", "bi", "b_crustmacro", { p: BI(`Extreme close view of the thick cracked black carbon crust on the bottom of a steel pot.`) }),
  S(1, "ni con la esponja de alambre", "bi", "b_steelwool", { q: "scrubbing pot steel wool", p: BI(`A steel wool pad scrubbing a black burnt pot bottom with no effect.`), anim: "the steel wool scrubs back and forth" }),
  // ── 0:12 · LA PROMESA
  S(2, "", "bi", "b_shinypot", { p: BI(`Top view of ${SHINY}, the window light reflected in it, on a kitchen counter.`) }),
  C(2, "El fondo brilla", "ClBeforeAfter", { before: I + "b_burntpot.jpg", after: I + "b_shinypot.jpg", note: "gaseosa primero, pasta después" }),
  S(2, "me veo la cara", "cl", "c_reflection", { p: CLP(`He holds ${SHINY} up close to his face in ${KITCHEN}, looking at his own reflection in the bottom, grinning.`) }),
  S(2, "Media botella de gaseosa cola", "bi", "b_halfbottle", { p: BI(`${COLA}, half empty, on a kitchen counter next to the stove.`) }),
  S(2, "una cucharada de pasta de dientes", "bi", "b_spoonpaste", { p: BI(`A tablespoon of white toothpaste squeezed onto a kitchen sponge.`) }),
  S(2, "Menos de un dólar", "c", "ClReceipt", { props: { lines: [["Gaseosa cola, media botella", "≈ 0,50"], ["Pasta de dientes", "2 cucharadas"], ["Bicarbonato (si hace falta)", "centavos"]], total: ["Una olla quemada", "menos de 1 dólar"] } }),
  // ── el vecino
  S(3, "", "bi", "b_neighborpot", { p: BI(`${NEIGHBOR} in a kitchen doorway peering into ${BURNT}, shaking his head, skeptical.`) }),
  S(3, "ya era para tirar", "av", ""),
  S(3, "que lo quemado no sale nunca", "bi", "st_trashbin", { q: "kitchen trash bin", p: BI(`A kitchen trash bin.`) }),
  S(3, "Le dije que me la dejara una tarde", "cl", "c_onetarde", { p: CLP(`He takes ${BURNT} from a mustached neighbour in a light-blue checked shirt in ${KITCHEN}, smiling confidently.`) }),
  // ── 0:22 · RÁFAGA
  S(4, "", "bi", "b_pourcola", { q: "pouring cola soda", p: BI(`Dark cola soda being poured into ${BURNT}, fizzing over the black crust.`), anim: "the cola pours and fizzes" }),
  S(4, "Diez minutos a fuego bajo", "bi", "b_lowflame", { q: "gas stove low flame", p: BI(`A small blue gas flame under ${POT} filled with simmering dark cola.`), ov: { c: "ClStampOv", props: { text: "10 MIN · FUEGO BAJO" } } }),
  S(4, "Que se enfríe", "bi", "b_cooling", { q: "pot on stove", p: BI(`${POT} full of dark cola resting on a turned-off stove, a wisp of steam rising.`) }),
  S(4, "Tiro el líquido", "bi", "b_dump", { p: BI(`Dark cola being poured out of ${POT} into a stainless steel sink.`), anim: "the dark liquid pours out" }),
  S(4, "Pasta de dientes", "bi", "b_squeezepaste", { q: "squeezing toothpaste tube", p: BI(`White toothpaste squeezed from a tube onto the green side of a kitchen sponge.`) }),
  S(4, "Esponja, en círculos", "bi", "b_circles", { p: BI(`${HANDS} scrubbing the bottom of a steel pot in circles with a sponge and white toothpaste, black flakes lifting.`), anim: "the sponge scrubs in circles" }),
  // ── el grito
  S(5, "", "bi", "b_crustlift", { p: BI(`Extreme close view of a big piece of softened black crust peeling off the bottom of a steel pot under a sponge, bright metal underneath.`), anim: "the crust lifts off in one piece" }),
  S(5, "se despega la costra entera", "cl", "c_wow", { p: CLP(`He holds up a steel pot in ${KITCHEN}, pointing inside at the clean bottom, open-mouthed delighted grin, looking at the camera.`) }),
  // ── 0:40 · 3 loops
  S(6, "", "av", ""),
  S(6, "En qué ollas sí y en cuáles te la arruina", "bi", "b_threepots", { p: BI(`Three cooking pans on a kitchen counter: a stainless steel pot, a black non-stick frying pan and a red enamel pot.`), ov: { c: "ClChip", props: { text: "1 · Qué ollas sí", alert: true } } }),
  S(6, "Por qué hay que esperar que se enfríe", "bi", "b_steam", { q: "steam pot kitchen", p: BI(`Steam rising from a steel pot of dark cola on a turned-off stove, a kitchen timer beside it.`), ov: { c: "ClChip", props: { text: "2 · Esperar que se enfríe" } } }),
  S(6, "Y lo que pasó cuando el vecino", "bi", "b_neighborpan", { p: BI(`${NEIGHBOR} at his own stove holding a black non-stick frying pan, looking at it proudly.`), ov: { c: "ClChip", props: { text: "3 · Lo del vecino", alert: true } } }),
  S(6, "lo probó en su sartén", "bi", "b_neighborpanclose", { p: BI(`Close view of ${NEIGHBOR} holding a black non-stick frying pan with a burnt oil stain over his sink, a tube of toothpaste in the other hand.`) }),
  // ── RECETA
  C(7, "", "ClChapter", { n: 1, title: "La receta entera", sub: "un orden, no una mezcla" }),
  S(7, "Lo que necesitas", "c", "ClCheck", { props: { title: "Lo que necesitas", items: ["Gaseosa cola común (no light)", "Pasta de dientes blanca (no gel)", "Esponja con lado verde", "Bicarbonato, si la mancha es vieja"] } }),
  S(7, "Una esponja con el lado verde", "bi", "b_kit", { p: BI(`${COLA}, ${PASTE}, a kitchen sponge with a green scouring side and a small box of baking soda on a kitchen counter next to ${BURNT}.`) }),
  S(8, "", "av", ""),
  S(8, "Primero la gaseosa, que ablanda", "c", "ClSplit", { props: { img: I + "b_order.jpg", left: ["1 · GASEOSA", "ablanda"], right: ["2 · PASTA", "pule"] } }),
  S(8, "Si las pones juntas en la olla", "bi", "b_mixed", { p: BI(`A messy pot with toothpaste blobs floating in dark cola, foamy and murky.`) }),
  S(9, "", "bi", "b_potbottom", { p: BI(`The underside of a steel pot turned over, a stamped mark engraved in the metal of the base.`) }),
  S(9, "Que sea de acero inoxidable o de aluminio", "bi", "b_steelalu", { p: BI(`A stainless steel pot and a plain aluminium pot side by side on a stove.`), ov: { c: "ClChip", props: { text: "Acero o aluminio: sí" } } }),
  S(9, "Si es de teflón, o enlozada", "bi", "b_teflonenamel", { p: BI(`A black non-stick frying pan and a red enamel pot side by side on a counter.`), ov: { c: "ClChip", props: { text: "Teflón o enlozada: no", alert: true } } }),
  S(10, "", "bi", "b_woodspoon", { p: BI(`A wooden spoon lifting loose bits of burnt food out of a burnt steel pot.`) }),
  S(10, "Si raspas con algo de metal", "bi", "b_knifescratch", { p: BI(`Extreme close view of a knife tip scraping a burnt steel pot bottom, leaving a bright scratch.`) }),
  S(11, "", "bi", "b_pourcola2", { p: BI(`Dark cola being poured into ${BURNT} until it covers the black crust by a finger.`), anim: "the cola rises over the crust" }),
  S(11, "un dedo por arriba", "bi", "b_fingerlevel", { p: BI(`A finger held at the side of a steel pot to show the cola level above the burnt bottom.`) }),
  S(12, "", "bi", "b_boil", { q: "boiling pot stove", p: BI(`Dark cola coming to a boil in a steel pot on a gas stove, bubbles around the black crust.`), anim: "the cola bubbles" }),
  S(12, "bajo el fuego al mínimo", "bi", "b_knob", { p: BI(`A hand turning a gas stove knob down to the lowest flame.`) }),
  S(12, "Mira cómo burbujea alrededor de la costra", "bi", "b_simmer", { p: BI(`Extreme close view of small bubbles of dark cola simmering over the black crust at the bottom of a steel pot.`), anim: "gentle bubbling" }),
  S(13, "", "bi", "b_foam", { p: BI(`Brown foam rising on simmering cola in an open steel pot on the stove, no lid.`) }),
  S(14, "", "bi", "b_caramel", { p: BI(`Close view of the rim of a steel pot with a sticky ring of reduced caramelized cola.`) }),
  S(14, "el azúcar se pega y te arma otra costra", "bi", "st_caramel", { q: "caramel sugar pan", p: BI(`Burnt caramel in a pan.`) }),
  S(15, "", "bi", "b_offstove", { q: "pot on gas stove", p: BI(`${POT} of dark cola sitting on a turned-off gas stove, the kitchen quiet.`) }),
  S(15, "media hora", "bi", "b_timer30", { p: BI(`A kitchen timer showing 30:00 next to a steel pot of cola on the stove.`), ov: { c: "ClStampOv", props: { text: "30 MINUTOS" } } }),
  S(16, "", "bi", "b_dump2", { p: BI(`Dark cola being poured out of a steel pot into the sink, the black crust visible at the bottom.`) }),
  S(16, "como cartón mojado", "bi", "b_swollen", { p: BI(`Extreme close view of a softened, swollen black crust at the bottom of a steel pot, cracking like wet cardboard.`) }),
  S(17, "", "bi", "b_paste2", { p: BI(`A tablespoon of white toothpaste on the green side of a damp sponge, held over a burnt steel pot.`) }),
  S(17, "froto en círculos", "bi", "b_circles2", { p: BI(`${HANDS} rubbing a sponge in circles at the bottom of a steel pot, gray paste and black flakes.`) }),
  S(18, "", "bi", "b_flakes", { p: BI(`Black flakes of crust coming loose under a sponge, revealing shiny steel in patches.`) }),
  S(18, "Cuando la pasta se pone gris", "bi", "b_graypaste", { p: BI(`Close view of gray dirty toothpaste foam on the bottom of a half-cleaned steel pot.`) }),
  S(19, "", "bi", "b_corner", { p: BI(`An old toothbrush scrubbing the corner where the wall meets the bottom of a steel pot.`) }),
  S(20, "", "bi", "b_soda", { q: "baking soda", p: BI(`Baking soda being spooned into a small bowl with a few drops of water.`) }),
  S(20, "La dejo encima quince minutos", "bi", "b_sodapaste", { p: BI(`A thick white paste of baking soda spread over a dark stain at the bottom of a steel pot.`), ov: { c: "ClStampOv", props: { text: "15 MIN" } } }),
  S(21, "", "bi", "b_rinse", { q: "rinsing pot sink", p: BI(`Hot water running into a steel pot in the sink, steam rising.`) }),
  S(21, "la seco enseguida, con un repasador", "bi", "b_towel", { q: "drying pot towel", p: BI(`${HANDS} drying a shiny steel pot with a checkered kitchen towel.`) }),
  S(21, "el agua te deja marcas blancas", "bi", "b_watermarks", { p: BI(`Close view of white water spots on the bottom of a steel pot.`) }),
  // ── el final
  S(22, "", "bi", "b_finalpot", { q: "stainless steel pot", p: BI(`Top view of ${SHINY}, the kitchen window reflected in the bottom.`) }),
  S(22, "Paso el dedo y está liso", "bi", "b_fingerbottom", { p: BI(`A fingertip sliding across the clean shiny bottom of a steel pot.`) }),
  S(23, "", "c", "ClCheck", { props: { title: "Repaso", items: ["Acero o aluminio", "Gaseosa hasta tapar lo negro", "10 min a fuego bajo", "30 min enfriando", "Pasta de dientes, en círculos", "Bicarbonato si queda algo", "Secar enseguida"] } }),
  // ── LA CUENTA
  C(24, "", "ClChapter", { n: 2, title: "La cuenta", sub: "menos de un dólar" }),
  S(25, "", "bi", "st_supermarket", { q: "soda bottles supermarket shelf", p: BI(`Soda bottles on a supermarket shelf.`) }),
  S(25, "un par de cucharadas del tubo del baño", "bi", "b_bathtube", { p: BI(`A half-used plain tube of white toothpaste on a bathroom sink next to a toothbrush cup.`) }),
  S(26, "", "bi", "b_steelpan", { q: "pots drying rack", p: BI(`A clean stainless steel frying pan and a shiny steel pot drying on a rack in a kitchen.`) }),
  S(27, "", "bi", "st_newpots", { q: "new stainless steel pots", p: BI(`New stainless steel pots in a store.`) }),
  S(27, "la media hora de espera", "cl", "c_wait", { p: CLP(`He leans on the counter of ${KITCHEN} next to a pot on the turned-off stove, arms crossed, patiently waiting, a small smile.`) }),
  // ── CTA 1: el regalo
  S(28, "", "av", ""),
  S(28, "La del cemento que parece granito", "bi", "b_granitetop", { p: BI(`A cement tabletop polished to look exactly like dark speckled granite on a backyard table in the sun.`) }),
  S(28, "la de la silicona para las goteras", "bi", "b_sealedroof", { p: BI(`A crack on a flat gray concrete roof filled and coated with a 30 cm wide band of matte white silicone, sunny.`) }),
  S(28, "la del aflojatodo para la reja", "bi", "b_blackgate", { p: BI(`A front iron gate of vertical bars freshly painted glossy black in front of a small house, sunny.`) }),
  C(29, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "las 10 mezclas con medidas, gratis" }),
  S(29, "Guárdala", "av", ""),
];
