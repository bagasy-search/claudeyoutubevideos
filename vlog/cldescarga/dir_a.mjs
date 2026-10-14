// DIRECTOR A — cldescarga: MINUTO 1 (Claudio a cámara 0-6,5 s con el secreto → PROMESA con antes/después de los agujeros del borde
// en el seg 9,8 → la falla exacta (descarga floja, sopapa, producto para cañerías) → "no fue culpa suya" → el culpable (el agua no
// entra con fuerza) → 3 loops) + INTRO (180 habitaciones, el gerente de la libreta) + CTA 1 a la 1:45 + callback a clmezcla (párr. 0-10).
import { S, BI, CLP } from "../claudio/lib.mjs";
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const CL = (p, at, name, scene, o = {}) => S(p, at, "cl", name, { p: CLP(scene), ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: BI(scene), ...o });
export const G = "a hand in a blue nitrile glove";
export const BROWN = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
export const VINEGAR = "a clear plastic bottle of white vinegar with a plain blank white label";
export const BATHH = "a small hotel guest bathroom with beige-cream wall tiles and a white toilet";
export const TOILET = "a white porcelain toilet in a small hotel guest bathroom with beige-cream wall tiles";
export const HOME = "a small ordinary home bathroom with white tiles and a white toilet";
export const HALL = "a carpeted hotel corridor with numbered room doors and warm ceiling lights";
export const ROSA = "Rosa, a hotel laundry worker in her fifties with dark hair in a bun and a light-blue housekeeping uniform";
export const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie, holding a small black notebook";
export const RAMIRO = "Don Ramiro, the hotel night cook in his sixties with a gray mustache and a white cook's jacket";
export const STICK = "a thin wooden coffee stirring stick";
export const I = "img/cldescarga/";
export const SHOTS = [
  // ── 0:00 · Claudio a cámara (6,5 s): el secreto
  S(0, "", "av", ""),
  CL(0, "Nunca estuvo tapado", "c_lidup", `He lifts the lid of the white toilet in ${BATHH} and looks into the bowl, then back at the camera with a knowing look.`, { anim: "he lifts the toilet lid slowly" }),
  B(0, "nada de lo que le echó funcionó", "b_productsfloor", `Three different drain-cleaner and toilet-cleaner bottles with plain blank labels standing on the floor next to a white toilet in ${HOME}.`),
  // ── 0:09,8 · LA PROMESA con el resultado a la vista
  C(1, "", "ClBeforeAfter", { before: I + "b_rim_before.jpg", after: I + "b_rim_after_ab.jpg", note: "2 días · 0 plomero" }),
  CL(1, "para saber si es un tapón o no", "c_watchflush", `He kneels in ${BATHH}, gloves on, his hand on the flush handle of a white toilet, the water in the bowl just starting to move.`, { anim: "the hand pushes the flush handle down" }),
  ST(1, "Hoy le doy la prueba", "b_kitchentimer", "timer", `A simple white kitchen timer on the closed lid of a toilet tank in ${HOME}.`),
  B(1, "Los dos lugares por donde entra el agua", "b_rimclose", `Close view under the rim of a white toilet bowl: a row of small flush holes, several half-blocked by white crust and dark grime.`),
  B(1, "que el cepillo nunca tocó", "b_brushmiss", `A toilet brush scrubbing the inside of a white toilet bowl, its bristles passing well below the rim holes.`, { anim: "the brush scrubs the bowl in circles" }),
  B(1, "Y el arreglo de dos días", "b_twobottles", `${BROWN} and ${VINEGAR} standing far apart on a white bathroom shelf, a small hand mirror between them.`),
  B(1, "de la farmacia y del almacén", "b_pharmacybag", `A paper pharmacy bag and a grocery bag on a bathroom counter, a brown peroxide bottle and a vinegar bottle sticking out of them.`),
  ST(1, "Mire esta descarga", "st_flushweak", "toilet", `Water swirling weakly in a white toilet bowl during a flush.`),
  B(1, "Floja", "b_weakswirl", `Top view into a white toilet bowl during a weak flush: a slow lazy swirl, bits of tissue still floating.`, { anim: "the water swirls slowly and weakly" }),
  B(1, "El remolino volvió", "b_strongswirl", `Top view into a clean white toilet bowl during a strong flush: a fast deep whirlpool pulling everything down.`, { anim: "the water spins fast into a deep whirlpool" }),
  // ── 0:28 · LA FALLA EXACTA
  B(2, "", "b_flushagain", `A middle-aged woman in house clothes pressing the flush handle of a toilet in ${HOME}, frowning at the bowl.`),
  ST(2, "da vueltas flojita", "b_lazyswirl", "water whirlpool", `Top view into a white toilet bowl: water turning slowly and weakly after a flush.`),
  ST(2, "Y otra vez", "b_flush3x", "toilet bathroom", `A woman's hand pressing a toilet flush handle again, the bowl water barely moving.`),
  B(2, "Y nada", "b_shrugwoman", `A middle-aged woman in house clothes throwing up her hands in frustration in front of a toilet in ${HOME}.`),
  B(2, "Baja, pero no se lleva todo", "b_tissue", `Inside a white toilet bowl after a flush: a little toilet tissue still floating on the calm water.`),
  CL(2, "Vuelve a descargar", "c_flush2", `He kneels in ${BATHH}, gloves on, pressing a toilet flush handle again, the tank lid slightly off.`),
  ST(2, "Compró el destapador", "b_plungernew", "plunger toilet", `A new rubber plunger with the price sticker still on the handle, leaning against a white toilet in ${HOME}.`),
  B(2, "empujó con la sopapa", "b_plunging", `A man in a T-shirt pushing a rubber plunger into a white toilet bowl, water splashing a little.`, { anim: "he pushes the plunger down and up" }),
  ST(2, "le echó un producto para cañerías", "b_draingel", "cleaning toilet", `A hand pouring thick blue drain-cleaner gel from a bottle with a plain blank label into a white toilet bowl.`),
  B(2, "Sigue igual de perezoso", "b_lazy", `A middle-aged woman in house clothes standing with her hands on her hips, looking down at a toilet in ${HOME}, tired.`),
  // ── 0:42 · NO FUE CULPA SUYA
  S(3, "", "av", ""),
  B(3, "Todo el mundo piensa lo mismo", "b_neighbors", `Two middle-aged neighbors in a home bathroom doorway looking at a toilet, one holding a plunger.`),
  B(3, "Y lo trata como un tapón", "b_plungerrow", `A rubber plunger, a plastic drain snake and a bottle of drain cleaner lined up on the floor next to a toilet.`),
  B(3, "Pero el agua no sube hasta el borde", "b_waterlow", `Inside a white toilet bowl just after flushing: the water level calm and low, nowhere near the rim.`),
  ST(3, "No hace gárgaras", "b_calmwater", "clear water close up", `Close view of calm clear water in the bottom of a white toilet bowl, no bubbles.`),
  CL(3, "Eso no es un tapón", "c_notclog", `He shakes his head and points at the calm water in the toilet bowl in ${BATHH}.`),
  // ── 0:54 · EL CULPABLE
  B(4, "El agua no puede entrar con fuerza", "b_trickle", `Close view under the rim of a white toilet during a flush: only thin weak trickles of water coming out of a few rim holes.`, { anim: "thin trickles of water run down from the rim holes" }),
  B(4, "Y entra por dos lugares", "b_twoarrows", `Top view into an empty white toilet bowl: the row of rim holes around the top and the round jet hole at the bottom front.`),
  CL(4, "por dos lugares que usted nunca miró", "c_mirrorrim", `He kneels in ${BATHH}, gloves on, holding a small round hand mirror under the rim of a white toilet bowl.`),
  // ── 1:01 · LOS 3 LOOPS
  B(5, "El agujero grande", "b_jethole", `Close view down into the bottom front of a white toilet bowl with the water lowered: a round jet hole crusted with a white ring of scale.`),
  B(5, "Por qué un alambre", "b_wire", `A bent piece of metal wire poking into a small flush hole under a toilet rim, a scratch visible on the white porcelain.`),
  B(5, "Y la marca adentro del tanque", "b_tankopen", `The open tank of a white toilet seen from above: the tall overflow tube in the middle and the water inside.`),
  B(5, "cuando todo lo demás ya se probó", "b_triedall", `Empty bottles of drain cleaner and a plunger piled in a corner of ${HOME}.`),
  // ── 1:17 · INTRO
  CL(6, "", "c_intro", `He stands in ${HALL} next to a housekeeping cart, gloves on, nodding hello toward the camera.`),
  ST(6, "Treinta años trabajé", "st_hotelfacade", "hotel building exterior", `The exterior of a mid-range hotel building with rows of windows.`),
  CL(6, "Y los inodoros eran míos", "c_kneeltoilet", `He kneels next to the white toilet of ${BATHH} with a small hand mirror and a flashlight, looking under the rim.`, { anim: "he moves the flashlight along the rim" }),
  B(7, "El gerente de la libreta", "b_manager", `${MANAGER} writing in his small black notebook in ${HALL}.`),
  B(7, "descarga floja", "b_notebook", `Close view of a small black notebook page with handwritten room numbers in a list, a pen resting on it.`),
  ST(7, "alguien quería llamar al plomero", "b_phone", "telephone office", `A hand holding a desk phone receiver at a hotel reception counter, a notebook open beside it.`),
  CL(8, "Pero la mayoría de las veces", "c_wink", `He holds ${BROWN} in one hand and ${VINEGAR} in the other in ${BATHH}, smiling at the camera.`),
  ST(8, "Y eso lo arreglaba yo", "b_cartbrown", "housekeeping cart hotel", `A hotel housekeeping cart with several brown peroxide bottles and vinegar bottles on its top shelf in ${HALL}.`),
  // ── 1:45 · CTA 1 (frase fija) — libro + QR quieta ~15 s
  S(9, "", "av", ""),
  CL(9, "me prometí escribir", "c_writing", `He sits at a small table in the hotel staff room writing in a spiral notebook with a pencil, reading glasses on, gloves off on the table.`, { anim: "he writes slowly in the notebook" }),
  B(9, "Cada arreglo con su medida", "b_handpages", `Close view of handwritten notebook pages with small measurements and times written in pencil, a brown peroxide bottle beside it.`),
  S(9, "Un libro", "av", ""),
  C(9, "Noventa y cuatro arreglos", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "94 ARREGLOS · PÁGINA 16", text: "el link está abajo" }),
  S(9, "Volvemos al inodoro", "av", ""),
  // ── 2:12 · callback al video de las mezclas
  C(10, "", "ClVideoRef", { thumb: I + "th_clmezcla.jpg", title: "Nunca mezclar", tag: "ya en el canal" }),
  C(10, "Día uno, el frasco marrón", "ClTwoDays", { stamp: "Nunca juntos" }),
];
