// DIRECTOR A — clmezcla: MINUTO 1 (Claudio a cámara 0-6,6 s → abre la puerta del baño → PROMESA con antes/después del mueble en el
// seg 8,9 (5 mezclas · 4 reglas) → la falla exacta (cloro + limpiador en el inodoro, el aire picante, sale tosiendo) → "no fue culpa
// suya" → la regla vieja → 3 loops → pelea) + INTRO (180 habitaciones, el carrito) + CTA 1 a las 1:59 (párrafos 0-10).
import { S, BI, CLP } from "../claudio/lib.mjs";
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const CL = (p, at, name, scene, o = {}) => S(p, at, "cl", name, { p: CLP(scene), ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: BI(scene), ...o });
export const G = "a hand in a blue nitrile glove";
export const BLEACH = "a white plastic jug of chlorine bleach with a blue cap and a plain blank white label";
export const VINEGAR = "a clear plastic bottle of white vinegar with a plain blank white label";
export const TBC = "a white plastic bottle of toilet bowl cleaner with an angled nozzle and a plain blank white label";
export const GLASS = "a blue plastic trigger spray bottle of glass cleaner with a plain blank white label";
export const ALCOHOL = "a clear plastic bottle of rubbing alcohol with a plain blank white label";
export const BROWN = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
export const SODA = "a small cardboard box of baking soda with a plain blank label";
export const CAB = "the open wooden cabinet under a hotel bathroom sink";
export const BATHH = "a small hotel guest bathroom with beige-cream wall tiles and a white toilet";
export const HALL = "a carpeted hotel corridor with numbered room doors and warm ceiling lights";
export const ROSA = "Rosa, a hotel laundry worker in her fifties with dark hair in a bun and a light-blue housekeeping uniform";
export const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie, holding a small black notebook";
const I = "img/clmezcla/";
export const SHOTS = [
  // ── 0:00 · Claudio a cámara (6,6 s)
  S(0, "", "av", ""),
  CL(0, "abierta", "c_dooropen", `He pushes the door of ${BATHH} wide open with his gloved hand, looking back at the camera, the hotel corridor behind him.`, { anim: "he pushes the bathroom door wide open" }),
  // ── 0:08,9 · LA PROMESA con el resultado a la vista
  C(1, "", "ClBeforeAfter", { before: I + "b_cab_before.jpg", after: I + "b_cab_after_ab.jpg", note: "5 mezclas · 4 reglas" }),
  B(1, "nunca, nunca van juntas", "b_twojugs", `${BLEACH} and ${VINEGAR} standing side by side on the white counter of ${BATHH}.`, { ov: { c: "ClStampOv", props: { text: "NUNCA JUNTOS" } } }),
  B(1, "van juntas", "b_jugsclose", `Close view of the caps of ${BLEACH} and ${TBC} touching each other on a bathroom floor.`),
  CL(1, "Las cinco que vi hacer", "c_cart", `He pushes a hotel housekeeping cart loaded with cleaning bottles, rags and folded towels along ${HALL}.`, { anim: "he pushes the cart slowly along the corridor" }),
  B(1, "en el hotel", "b_hotelbathdoor", `The open door of ${BATHH} seen from ${HALL}, a housekeeping cart parked beside it.`),
  CL(1, "Cuatro reglas", "c_readlabel", `He holds ${BLEACH} close to his face and reads the small print on its back, frowning a little, in ${BATHH}.`),
  CL(1, "si ya lo mezcló", "c_stepout", `He steps out of ${BATHH} into ${HALL}, one hand on the door frame, looking back into the bathroom.`),
  CL(1, "para no equivocarse nunca más", "c_tapetable", `He tapes a printed sheet of paper on the inside of the door of ${CAB} with yellow tape.`, { anim: "he presses the yellow tape onto the door" }),
  B(1, "en los primeros segundos", "b_stopwatch", `${G} holding a simple kitchen timer in a bathroom doorway, the dial just started.`),
  S(1, "Cero productos nuevos", "av", ""),
  B(1, "Así estaba el mueble", "b_cab_before", `${CAB}: bleach, vinegar, toilet bowl cleaner, glass cleaner and a brown peroxide bottle all crowded together on the same shelf, every label plain blank white.`),
  B(1, "del fregadero", "b_sinkunder", `Close view of the dark corner under a bathroom sink: the drain pipe and the caps of several crowded cleaning bottles touching each other.`),
  S(1, "Así quedó", "bi", "b_cab_after_ab", { p: "", ab: 1 }),
  // ── 0:28 · LA FALLA EXACTA
  ST(2, "", "st_scrubtoilet", "cleaning toilet bowl brush", `${G} scrubbing a white toilet bowl with a toilet brush.`),
  B(2, "Le echó un chorro de cloro", "b_pourbleach", `${G} pouring a thick stream of bleach from ${BLEACH} into a white toilet bowl.`, { anim: "the bleach pours into the toilet water" }),
  B(2, "como la mancha no salía", "b_stain", `Close view inside a white toilet bowl: a stubborn brownish ring at the waterline that did not come off.`),
  B(2, "le echó encima el limpiador", "b_squeezetbc", `${G} squeezing ${TBC} under the rim of a white toilet bowl that already has bleach in the water.`, { anim: "the cleaner is squeezed under the rim" }),
  B(2, "O un poco de vinagre", "b_pourvinegar", `${G} pouring ${VINEGAR} into a white toilet bowl.`, { anim: "the vinegar pours into the toilet water" }),
  S(2, "Y de repente el aire", "av", ""),
  ST(2, "le picó la garganta", "st_cough", "woman coughing hand on chest", `A woman coughing with a hand on her chest.`),
  B(2, "y salió del baño tosiendo", "b_leavecough", `A middle-aged woman in house clothes and rubber gloves walking out of ${BATHH} covering her mouth with her arm.`),
  B(2, "tosiendo", "b_coughhall", `A middle-aged woman in house clothes coughing into her elbow in a narrow apartment hallway, a bathroom door open behind her.`, { anim: "she coughs into her elbow" }),
  ST(3, "", "st_window", "opening window", `A hand opening a window wide.`),
  B(3, "esperó un rato en el pasillo", "b_hallwait", `A middle-aged woman in house clothes leaning against the wall of a narrow apartment hallway outside an open bathroom door, catching her breath.`, { q: "woman leaning wall hallway" }),
  B(3, "y no le contó a nadie", "b_closeddoor", `The bathroom door of an ordinary apartment half closed, a bucket and rubber gloves left on the floor in front of it.`, { q: "bathroom door closing" }),
  // ── 0:49 · NO FUE CULPA SUYA
  S(4, "", "av", ""),
  B(4, "La advertencia está atrás", "b_backlabel", `The back of ${BLEACH} held in ${G}: a block of tiny gray printed lines on the white label, too small to read.`),
  B(4, "en letra chiquita", "b_tinyprint", `Extreme close view of tiny gray printed lines on a white plastic label, a gloved fingertip pointing at one line.`),
  B(4, "Y la regla vieja de la casa", "b_oldrule", `An older woman in an apron pouring two different cleaning bottles at the same time into one plastic bucket in a home bathroom.`, { anim: "she pours both bottles into the bucket" }),
  B(4, "es al revés", "b_bucketmix", `Close view of two cleaning liquids, one blue and one clear, being poured together into the same plastic bucket of water.`, { anim: "the two liquids pour into the bucket" }),
  B(4, "si un producto limpia", "b_onespray", `${G} holding one white trigger spray bottle with a plain blank label in front of a bathroom mirror.`),
  B(4, "dos limpian el doble", "b_twospray", `Two gloved hands each holding a different spray bottle, both pointed at the same sink.`, { anim: "both hands squeeze the spray triggers" }),
  // ── 1:02 · LOS 3 LOOPS
  B(5, "La mezcla que más gente hace", "b_toiletmix", `A white toilet bowl with a bleach jug and a toilet bowl cleaner bottle standing on the closed lid of the tank.`),
  B(5, "todas las semanas, en el inodoro", "b_calendar", `A paper wall calendar in a home bathroom with a cleaning day circled every week in pencil.`),
  B(5, "un truco de internet", "b_phonehack", `A woman's hand holding a phone above a bathroom counter, the screen showing a short video of a spray bottle, a half-and-half spray bottle on the counter.`),
  B(5, "nunca pongo en una botella", "b_halfhalf", `A clear trigger spray bottle filled half with one clear liquid and half with another, standing alone on a bathroom counter.`),
  B(5, "la única mezcla que sí está bien", "b_pastebowl", `A small white bowl of thick white paste made of baking soda, a spoon in it, ${BROWN} and ${SODA} next to it on a counter.`),
  B(5, "todo el mundo cree que es peligrosa", "b_doubt", `A woman in her sixties in a kitchen looking suspiciously at a small bowl of white paste, arms crossed.`),
  B(6, "", "b_argue", `A married couple in their fifties in a home bathroom doorway arguing over a bottle of vinegar, he holds the bottle, she points at it.`, { anim: "they argue, she points at the bottle" }),
  CL(6, "Déjelo que discuta", "c_chuckle", `He chuckles and shrugs, holding a toilet brush, standing in ${BATHH}.`),
  // ── 1:26 · INTRO
  CL(7, "", "c_intro", `He stands in ${HALL} next to a housekeeping cart, gloves on, nodding hello toward the camera.`),
  ST(7, "Treinta años trabajé", "st_hotelfacade", "hotel building exterior", `The exterior of a mid-range hotel building with rows of windows.`),
  B(7, "ciento ochenta habitaciones", "b_doors", `A long ${HALL} with many numbered room doors in a row, a housekeeping cart at the far end.`, { q: "hotel hallway doors" }),
  CL(7, "Baños, sobre todo", "c_kneel", `He kneels next to the white toilet of ${BATHH} with a toilet brush, scrubbing under the rim.`, { anim: "he scrubs under the rim with the brush" }),
  CL(8, "en el carrito de limpieza", "c_cartbottles", `He stands at a hotel housekeeping cart in ${HALL}, sorting cleaning bottles on its shelves with gloved hands.`),
  B(8, "no vienen de un producto malo", "b_onebottle", `${BLEACH} alone on a white counter.`, { q: "bleach bottle" }),
  B(8, "Vienen de dos productos buenos", "b_twogood", `${BLEACH} and ${TBC} side by side on the floor of a small bathroom next to the toilet.`),
  B(8, "en un baño chico", "b_smallbath", `A very small windowless hotel bathroom seen from the door: toilet, sink and shower all within arm's reach, an exhaust fan grille on the ceiling.`, { q: "small bathroom" }),
  C(9, "", "ClVideoRef", { thumb: I + "th_clsilicona.jpg", title: "La silicona negra", tag: "ya en el canal" }),
  CL(9, "el video más importante del canal", "c_serious", `He stands in ${HALL} holding ${BROWN} in one hand and ${BLEACH} in the other, serious expression, looking at the camera.`),
  B(9, "Todos los otros arreglos", "b_toolsrow", `Cleaning tools laid out on a white towel: a toilet brush, a scrub brush, a sponge, a spray bottle, a pumice stone, rubber gloves.`, { q: "cleaning tools" }),
  B(9, "le cuida los pulmones", "b_window_air", `An open frosted bathroom window with fresh air moving a thin white curtain.`, { q: "curtain blowing window", anim: "the thin curtain moves in the breeze" }),
  // ── 1:59 · CTA 1 (frase fija del molde) — libro + QR quieta ~15 s
  S(10, "", "av", ""),
  CL(10, "me prometí escribir", "c_writing", `He sits at a small table in the hotel staff room writing in a spiral notebook with a pencil, reading glasses on, gloves off on the table.`, { anim: "he writes slowly in the notebook" }),
  C(10, "Y lo escribí", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "94 ARREGLOS · LA TABLA", text: "el link está abajo" }),
  S(10, "Volvemos al baño", "av", ""),
];
