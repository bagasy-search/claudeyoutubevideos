// DIRECTOR A — clregadera: MINUTO 1 (Claudio con las piedritas en el guante → PROMESA bolsa + vinagre + liga + noche con el antes/
// después de los chorros → la falla (chorro torcido) → "no fue culpa suya" → el culpable (agua dura) → 3 loops) + INTRO + CTA 1 a
// ~1:40 + el gerente y Rosa + callback a clsarro + QUÉ ES + la historia de la pinza y la tetera de Don Ramiro (párr. 0-21).
import { S, BI, CLP } from "../claudio/lib.mjs";
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const CL = (p, at, name, scene, o = {}) => S(p, at, "cl", name, { p: CLP(scene), ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: BI(scene), ...o });
export const G = "a hand in a blue nitrile glove";
export const BROWN = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
export const VINEGAR = "a big clear plastic jug of white vinegar with a plain blank white label";
export const HEAD = "a round chrome shower head on a chrome arm coming out of a tiled wall";
export const CLOGGED = "a round chrome shower head whose small nozzle holes are crusted with hard white limescale, several holes blocked";
export const BAG = "a clear plastic freezer bag full of white vinegar tied around a round chrome shower head with a rubber band, the face of the shower head submerged";
export const HOTELSHOWER = "the shower of a mid-range hotel guest bathroom with beige-cream wall tiles and a glass door";
export const HOMESHOWER = "an ordinary home shower with white wall tiles";
export const ROSA = "Rosa, a hotel housekeeper in her fifties with dark hair in a bun and a light-blue housekeeping uniform";
export const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie, holding a small black notebook";
export const RAMIRO = "Don Ramiro, the hotel night cook in his sixties with a gray mustache and a white cook's jacket";
export const HALL = "a carpeted hotel corridor with numbered room doors and warm ceiling lights";
export const I = "img/clregadera/";
export const SHOTS = [
  // ── 0:00 · Claudio a cámara con las piedritas
  S(0, "", "av", ""),
  CL(0, "De una sola", "c_pebblesshow", `He holds out his gloved palm with small white limescale pebbles toward the camera in ${HOTELSHOWER}, ${HEAD} above him.`),
  B(0, "Y todas las mañanas", "b_onehead", `${CLOGGED}, unscrewed and lying on a folded white towel on a bathroom counter.`),
  ST(0, "esto se lo estaba echando", "b_showerhair", "senior man shower water hair", `Ordinary real footage that shows senior man shower water hair.`, { anim: "the water falls on his head" }),
  ST(0, "en la cabeza", "b_pebblehair", "wet gray hair shower", `Ordinary real footage that shows wet gray hair shower.`),
  // ── 0:08 · la promesa
  C(1, "", "ClBeforeAfter", { before: I + "b_ba_before.jpg", after: I + "b_ba_after.jpg", note: "1½ taza de vinagre · 1 noche" }),
  ST(1, "sin desarmarla", "b_nounscrew", "shower head wall tiles", `A chrome shower head still mounted on its arm on a tiled wall, an unused wrench lying on the shelf below it.`),
  ST(1, "una bolsa", "b_bagempty", "empty plastic bag hand", `Ordinary real footage that shows empty plastic bag hand.`),
  CL(1, "una taza y media de vinagre blanco", "c_pourbag", `He pours ${VINEGAR} into a clear plastic freezer bag held open over a bathroom sink in ${HOTELSHOWER}.`, { anim: "he pours vinegar into the bag" }),
  ST(1, "una liga", "b_rubberband", "rubber band hand", `Ordinary real footage that shows rubber band hand.`),
  B(1, "y una noche", "b_bagnight", `${BAG}, in a dark bathroom at night with a little light from the hallway.`),
  ST(1, "Mire esta regadera", "b_clogged", "clogged shower head limescale", `Ordinary real footage that shows clogged shower head limescale.`),
  B(1, "el agua saliendo para cualquier lado", "b_jets_before", `${HEAD} spraying water crooked in every direction, some jets sideways, a few weak dribbles, in ${HOMESHOWER}.`, { anim: "crooked jets spray sideways" }),
  ST(1, "Y mírela a la mañana", "b_cleanhead", "clean chrome shower head", `Ordinary real footage that shows clean chrome shower head.`),
  ST(1, "Todos los chorros derechos", "b_jets_after", "shower head water jets", `Ordinary real footage that shows shower head water jets.`, { anim: "even straight jets spray down" }),
  // ── 0:22 · la falla exacta
  ST(2, "", "b_opentap", "hand turning shower faucet", `${G} turning on the chrome shower mixer in ${HOMESHOWER}.`),
  B(2, "Abre la ducha", "b_morningbath", `An older man in a bathrobe reaching into a shower to turn the water on in the morning, ${HOMESHOWER}.`),
  ST(2, "el agua sale torcida", "b_crookedjet", "shower head water spray closeup", `Ordinary real footage that shows shower head water spray closeup.`, { anim: "a jet shoots sideways" }),
  ST(2, "Un chorro le pega en la cara", "b_jetface", "woman shower water face", `An older woman in a shower cap flinching as a sideways jet of water hits her cheek, seen from the side in ${HOMESHOWER}.`),
  B(2, "otro en la pared", "b_jetwall", `A stray jet of water from a shower head hitting the tiled wall of ${HOMESHOWER}.`),
  ST(2, "y en el medio casi no sale nada", "b_weakjet", "weak shower water", `A weak trickle of water from a shower head.`),
  CL(2, "Le pasó la esponja por afuera", "c_spongehead", `He rubs the face of ${CLOGGED} with a yellow sponge in ${HOTELSHOWER}, reaching up.`, { anim: "he rubs the shower head with the sponge" }),
  ST(2, "con fuerza", "b_spongehard", "cleaning shower head sponge", `Ordinary real footage that shows cleaning shower head sponge.`),
  ST(2, "Y siguió igual", "b_stillclogged", "shower head spraying water", `Ordinary real footage that shows shower head spraying water.`),
  // ── 0:36 · no fue culpa suya
  CL(3, "", "c_reassure", `He sits on the edge of a bathtub in ${HOTELSHOWER}, talking to the camera with a calm open hand.`),
  B(3, "Nadie le dijo", "b_showerlook", `An older woman in a bathrobe looking up at her shower head in ${HOMESHOWER}, puzzled.`),
  ST(3, "lo que tapa la regadera", "b_headside", "shower head side view", `Ordinary real footage that shows shower head side view.`),
  C(3, "está adentro de cada agujerito", "ClNozzleCut", { mode: "clog" }),
  B(3, "La esponja limpia la cara", "b_spongeface", `${G} wiping the shiny face of a chrome shower head with a yellow sponge.`),
  ST(3, "La piedra vive detrás", "b_behindhole", "shower head holes macro", `Extreme close view into one nozzle hole of a shower head, white crust packed inside the hole behind the shiny face.`),
  // ── 0:44 · el culpable
  ST(4, "", "b_hardwater", "hard water limescale chrome", `Ordinary real footage that shows hard water limescale chrome.`),
  ST(4, "en cada agujero queda una gotita", "b_drophole", "water drop shower head macro", `Ordinary real footage that shows water drop shower head macro.`, { anim: "the drop hangs and falls" }),
  ST(4, "queda una gotita", "b_dropsface", "water drops shower head", `Ordinary real footage that shows water drops shower head.`),
  ST(4, "La gotita se seca", "b_dropdry", "water drop chrome macro", `Ordinary real footage that shows water drop chrome macro.`),
  ST(4, "deja un poquito de piedra", "b_ringhole", "limescale shower head closeup", `Ordinary real footage that shows limescale shower head closeup.`),
  ST(4, "Una ducha por día", "st_showerrun", "shower running water", `Water running from a shower head.`),
  // ── 0:52 · los tres loops
  CL(5, "", "c_threefingers", `He holds up three gloved fingers to the camera in ${HOTELSHOWER}, the shower head above him.`),
  ST(5, "se abre primero el agua caliente", "b_hotsteam", "hot shower steam", `Steam rising from a chrome shower head running hot water in an empty ${HOMESHOWER}.`, { anim: "steam rises from the hot water" }),
  ST(5, "El truco de las puntitas de goma", "b_rubbernubs", "shower head nozzles closeup", `Ordinary real footage that shows shower head nozzles closeup.`),
  ST(5, "la única regadera que no puede pasar la noche en vinagre", "b_goldhead", "gold shower head", `Ordinary real footage that shows gold shower head.`),
  // ── 1:00 · Claudio
  C(6, "", "ClHallway3D", { total: 180, floor: 2, title: "duchas", sub: "y cada queja, a mí" }),
  CL(6, "Y cuando un huésped se quejaba de la ducha", "c_hallcart", `He pushes a maintenance cart with a bucket and tools down ${HALL}, a ring of room keys on his belt.`),
  // ── 1:06 · CTA 1 (frase fija)
  CL(7, "", "c_bookhold", `He holds a thick printed spiral-bound book with a plain brown cover in ${HOTELSHOWER}, showing it to the camera.`),
  ST(7, "me prometí escribir todo lo que aprendí", "b_notebookdesk", "old notebook handwritten notes desk", `An old worn notebook with handwritten notes open on a small desk in a hotel maintenance room, a pen and a pair of blue nitrile gloves beside it.`),
  S(7, "Y lo escribí", "av", ""),
  C(7, "Un libro", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "94 ARREGLOS · PÁGINAS 7 Y 28", text: "el link está abajo" }),
  C(7, "La regadera sucia está en la página veintiocho", "ClBookPage", { page: I + "book_p28.jpg", pageNo: 28, stamp: "Página 28" }),
  C(7, "y la tabla de lo que nunca se mezcla", "ClBookPage", { page: I + "book_p7.jpg", pageNo: 7, stamp: "Página 7" }),
  // ── el gerente y Rosa
  CL(8, "", "c_manager", `He stands in ${HALL} next to ${MANAGER}, who reads from his notebook with a worried face.`),
  C(8, "la ducha sale débil", "ClNotebook", { title: "La libreta del gerente", rows: [{ k: "208", v: "la ducha sale débil" }, { k: "311", v: "la ducha sale débil" }, { k: "105", v: "la ducha sale débil" }], note: "tres = Claudio" }),
  ST(8, "me buscaba por el pasillo", "b_hallway", "hotel corridor housekeeping cart", `Ordinary real footage that shows hotel corridor housekeeping cart.`),
  CL(9, "", "c_rosahall", `${ROSA} talks to him in ${HALL}, pointing back toward an open room door, he listens holding his toolbox.`),
  ST(9, "la doscientos ocho tiene la ducha torcida otra vez", "b_door208", "hotel room number door", `Close view of a brass room number plaque on a hotel room door in ${HALL}.`),
  // ── callback clsarro
  C(10, "", "ClVideoRef", { thumb: I + "th_clsarro.jpg", title: "El sarro del inodoro", tag: "ya en el canal" }),
  ST(10, "La de la regadera es la misma piedra", "b_scaletoiletshower", "limescale buildup", `Ordinary real footage that shows limescale buildup.`),
  // ── QUÉ ES
  C(11, "", "ClChapter", { n: 1, label: "PRIMERO", title: "Qué es eso blanco", sub: "y con qué sale" }),
  ST(12, "", "b_scalemacro", "limescale texture macro", `Extreme close view of hard white limescale crust on chrome, the texture like rough stone.`),
  ST(12, "cuando se evapora", "b_evaporate", "water spots chrome", `Ordinary real footage that shows water spots chrome.`),
  C(13, "", "ClNozzleCut", { mode: "grow" }),
  ST(13, "Después lo tuerce", "b_bentjet", "shower water spray", `Ordinary real footage that shows shower water spray.`),
  ST(14, "", "b_grayfilm", "dirty shower head", `Ordinary real footage that shows dirty shower head.`),
  ST(14, "Eso es jabón y mugre", "b_soapbar", "soap bar shower dish", `A worn bar of soap on a wet soap dish in a shower, gray soap scum around it.`),
  C(15, "", "ClTwoDays", { d1: ["DÍA 1", "Vinagre blanco", "la piedra · toda la noche", "#3E6E8E"], d2: ["OTRO DÍA", "Frasco marrón", "lo gris · un trapo", "#5A3418"], stamp: "Nunca el mismo día" }),
  ST(15, "La piedra sale con vinagre", "b_vinegarhead", "white vinegar bottle bathroom", `Ordinary real footage that shows white vinegar bottle bathroom.`),
  S(15, "Nunca los dos el mismo día", "av", ""),
  C(16, "", "ClBookPage", { page: I + "book_p28.jpg", pageNo: 28, stamp: "Regadera sucia" }),
  // ── la historia de la pinza
  CL(17, "", "c_pliershead", `He unscrews ${HEAD} with a big pair of pliers in ${HOTELSHOWER}, straining.`, { anim: "he twists the shower head with the pliers" }),
  CL(17, "y la llevaba al taller", "c_workshop", `He walks into a small hotel maintenance workshop with tools on the wall, carrying a chrome shower head in his gloved hand.`),
  ST(18, "", "b_plierscratch", "scratched chrome", `Close view of deep scratches and tooth marks from pliers on the chrome neck of a shower head.`),
  ST(18, "A veces se partía la rosca", "b_brokenthread", "broken pipe thread", `Ordinary real footage that shows broken pipe thread.`),
  ST(18, "quedaba sin ducha toda la tarde", "b_noshower", "shower arm without head", `An empty hotel shower with only the bare chrome arm sticking out of the tiled wall, no shower head.`),
  CL(19, "", "c_ramiro", `${RAMIRO} stops him in ${HALL} and points at the chrome shower head in his hand, talking with a grin.`),
  ST(19, "Vinagre, toda la noche", "b_kettle", "old kettle kitchen", `An old metal kettle on a hotel kitchen counter with white vinegar inside and white scale flakes at the bottom.`),
  ST(19, "que se le llenaba de piedra", "b_kettlescale", "limescale kettle inside", `Ordinary real footage that shows limescale kettle inside.`),
  CL(20, "", "c_tiebag", `He ties a clear plastic freezer bag full of white vinegar around ${HEAD} with a rubber band in ${HOTELSHOWER}.`, { anim: "he wraps the rubber band around the bag" }),
  ST(20, "las piedritas estaban en el fondo de la bolsa", "b_bagpebbles", "plastic bag water", `Ordinary real footage that shows plastic bag water.`),
  CL(21, "", "c_bagsrow", `He walks along ${HALL} in the evening looking into two open bathrooms where plastic bags of vinegar hang tied on the shower heads.`),
];
