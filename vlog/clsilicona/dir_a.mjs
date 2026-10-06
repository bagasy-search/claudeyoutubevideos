// DIRECTOR A — clsilicona: MINUTO 1 (Claudio a cámara + el cúter contra la silicona negra en el seg 1,7 → "está adentro" con sello → el
// rociado chorrea → PROMESA con antes/después de la silicona → números (papel, frasco, film, 8 horas) → el hotel: 40 bañeras la noche antes
// de la inspección → ráfaga → "¡Blanca!" → 3 loops → capítulo) + EL ARREGLO ENTERO (7 pasos) + CTA 1 página 14 (párrafos 0-20).
import { S, BI, CLP } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const G = "a hand in a blue nitrile glove";
const I = "img/clsilicona/";
export const TUB = "a hotel bathroom bathtub against beige-cream wall tiles";
export const CAULK = "the white silicone caulk line where a white bathtub meets beige-cream wall tiles, with black mold showing through inside the silicone along its whole length";
export const BOTTLE = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie";
export const SHOTS = [
  // ── 0:00 · Claudio a cámara → el cúter
  S(0, "", "av", ""),
  S(0, "con el cúter", "bi", "b_cutter", { p: BI(`Close view of ${G} holding an open utility knife with the blade against ${CAULK}, about to cut it.`), anim: "the blade moves slowly toward the silicone" }),
  S(0, "déme una noche", "av", ""),
  // ── está adentro
  S(1, "", "bi", "b_caulkmacro", { p: BI(`Extreme close view of ${CAULK}: the black mold is clearly behind the glossy translucent surface of the silicone, like a stain seen through dirty glass.`) }),
  S(1, "no está arriba de la silicona", "av", ""),
  S(1, "Está adentro", "bi", "b_caulkmacro2", { p: BI(`Extreme close view of a glossy white silicone caulk bead with gray-black mold threads visible deep inside it, a drop of water sitting on the clean surface.`), ov: { c: "ClStampOv", props: { text: "ESTÁ ADENTRO" } } }),
  S(1, "Por eso el rociado no le hace nada", "kf", "k_sprayrun", { p: BI(`Close view of ${G} spraying clear liquid from ${BOTTLE} with a trigger sprayer onto ${CAULK}; the liquid runs straight down off the silicone into the tub.`), d1: "the sprayer mists the moldy silicone", d2: "the liquid runs straight down into the tub and the silicone stays black", sound: "two squirts and a trickle" }),
  // ── 0:07 · LA PROMESA
  C(2, "", "ClBeforeAfter", { before: I + "b_caulkdirty.jpg", after: I + "b_caulkclean_ab.jpg", note: "una noche · sin arrancarla" }),
  S(2, "Papel de cocina", "bi", "st_papertowel", { q: "paper towel roll tearing", p: BI("A roll of paper towels on a counter, a hand tearing off a sheet.") }),
  S(2, "el frasco marrón", "bi", "b_bottletub", { p: BI(`${BOTTLE} standing on the edge of a white bathtub.`) }),
  S(2, "film plástico", "bi", "st_clingfilm", { q: "plastic cling film roll", p: BI("A roll of clear plastic cling film being pulled.") }),
  S(2, "y ocho horas de sueño", "bi", "st_bedroomnight", { q: "bed sleeping night bedroom", p: BI("A dark bedroom at night, a bed with a person asleep under the covers, a clock glowing on the nightstand.") }),
  S(2, "Así estaba", "cl", "c_before", { p: CLP(`He kneels beside ${TUB}, pointing one gloved finger at the black moldy silicone line along the tub, his face screwed up in disgust, looking at the camera.`), ov: { c: "ClChip", props: { text: "Antes", alert: true } } }),
  S(2, "Así quedó", "cl", "c_after", { p: CLP(`He kneels beside the same bathtub, the silicone line along it now bright clean white, grinning and giving a thumbs-up to the camera, a roll of cling film in his other hand.`), ov: { c: "ClChip", props: { text: "Después" } } }),
  // ── 0:16 · el hotel: 40 bañeras, la inspección
  S(3, "", "cl", "c_corridornight", { p: CLP("He walks down a dim hotel corridor at night carrying a box with paper towel rolls, brown bottles and rolls of cling film, glancing at the camera."), anim: "he walks slowly down the corridor", ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de conserje de hotel" } } }),
  S(3, "la noche antes de una inspección", "bi", "b_inspectionletter", { p: BI(`${MANAGER} at a hotel office desk at night reading a printed letter with a worried frown, a desk lamp on.`) }),
  S(3, "tuve que dejar blancas", "bi", "b_fortytubs", { p: BI("A long hotel corridor at night seen from above a housekeeping cart loaded with rolls of paper towels, brown bottles with blank labels and rolls of cling film.") }),
  S(3, "cuarenta bañeras", "bi", "b_tubsrow", { p: BI("A hotel corridor at night seen from one end, a row of guest room doors all open, light from each bathroom spilling into the corridor.") }),
  S(3, "El presupuesto para rehacerlas todas", "bi", "b_quote", { p: BI("A printed contractor's quote on a hotel office desk next to a calculator and a pen, a long list of line items, the total circled in red pen.") }),
  C(3, "ya estaba en el escritorio del gerente", "ClReceipt", { lines: [["Silicona nueva", "40 bañeras"], ["Mano de obra", "2 días"], ["Baños cerrados", "40"]], total: ["Presupuesto", "mucha plata"] }),
  // ── 0:28 · ráfaga
  S(4, "", "av", ""),
  S(4, "Seco la silicona", "bi", "b_drycaulk", { p: BI(`${G} drying ${CAULK} with a folded white towel.`), anim: "the towel wipes along the silicone" }),
  S(4, "Corto tiras de papel", "bi", "b_cutstrips", { p: BI(`${G} cutting paper towels into long strips about two inches wide with scissors on a bathroom counter.`) }),
  S(4, "Las empapo", "bi", "b_soakplate", { p: BI(`Strips of paper towel soaking in clear liquid in a deep white plate on a bathroom counter, ${BOTTLE} beside it.`), anim: "a strip sinks slowly into the liquid" }),
  S(4, "Las aprieto sobre la línea negra", "kf", "k_press", { p: BI(`Close view of ${G} pressing a soaked strip of paper towel flat onto ${CAULK}, other soaked strips already laid side by side.`), d1: "the gloved fingers lay a soaked strip on the moldy silicone", d2: "the fingers press the strip flat and smooth along the line", sound: "a soft wet press of paper" }),
  S(4, "Film encima", "bi", "b_filmover", { p: BI(`${G} stretching clear plastic cling film tightly over soaked paper strips laid along a bathtub's silicone line.`), anim: "the film is pulled tight along the strips" }),
  S(4, "Y me voy a dormir", "bi", "b_lightoff", { p: BI("A hand switching off the light of a hotel bathroom at night, the bathtub with paper strips and cling film along its edge visible in the dim light.") }),
  S(5, "", "cl", "c_wow", { p: CLP(`He kneels beside ${TUB} in morning light, holding a peeled-off strip of wet paper in one gloved hand, the silicone bright white, laughing with delight at the camera.`) }),
  // ── 0:44 · los 3 loops
  S(6, "", "av", ""),
  C(6, "Por qué el rociado nunca puede", "ClCaulk3D", { mode: "spray", labels: { a: "Chorrea en un minuto" } }),
  C(6, "El error del cúter", "ClCaulk3D", { mode: "seal", labels: { a: "Encerrado" } }),
  S(6, "se ponga negra en un mes", "bi", "b_newdotsm1", { p: BI("Extreme close view of a new, still glossy white silicone line along a bathtub with a row of tiny fresh black mold dots coming through from underneath.") }),
  S(6, "Y lo que pasó con las cuarenta bañeras", "bi", "b_tubsnight", { p: BI("Looking into a dim hotel bathroom at night from the doorway: a white bathtub with strips of paper and cling film along its silicone edge, a flashlight lying on the floor.") }),
  C(6, "Primero el arreglo entero", "ClChapter", { n: 1, title: "El arreglo entero", sub: "una noche, sin arrancarla" }),
  // ── 1:00 · la promesa del video del moho
  S(7, "", "av", ""),
  C(7, "Si vio mi video del moho", "ClVideoRef", { thumb: I + "th_clmoho.jpg", title: "Moho: el cloro no lo mata" }),
  C(7, "el moho está adentro", "ClCaulk3D", { mode: "inside", labels: { a: "Adentro de la silicona" } }),
  // lo que necesita, el frasco
  C(8, "", "ClCheck", { title: "Lo que necesita", items: ["Agua oxigenada 3 %", "Papel de cocina", "Film plástico", "Guantes", "Cepillo de dientes viejo"] }),
  S(9, "", "bi", "b_fizztest", { p: BI(`${G} pouring a splash of clear liquid from ${BOTTLE} onto a dirty spot in a white sink; it fizzes with white foam.`), anim: "the foam fizzes and grows" }),
  S(9, "Si no hace nada está cansado", "bi", "b_clearbottle", { p: BI("A clear plastic spray bottle of liquid sitting on a sunny bathroom windowsill.") }),
  // 1. limpiar y secar
  C(10, "", "ClChapter", { n: 1, label: "PASO", title: "Limpiar y secar", sub: "el papel tiene que pegarse" }),
  S(10, "y séquela bien con una toalla", "bi", "b_drytowel", { p: BI(`${G} pressing a folded white towel along the silicone line of a bathtub to dry it.`) }),
  // 2. tiras
  S(11, "", "bi", "b_strips5", { p: BI("Long strips of white paper towel about five centimeters wide laid out on a bathroom counter next to scissors and a ruler.") }),
  // 3. empapar
  S(12, "", "bi", "b_platesoak", { p: BI(`${G} lifting a dripping soaked paper strip out of a deep white plate of clear liquid.`), anim: "the strip drips as it is lifted" }),
  // 4. apretar
  C(13, "", "ClFilmWrap", { n: 6 }),
  S(13, "sin burbujas de aire", "bi", "b_nobubbles", { p: BI(`Extreme close view of a gloved fingertip smoothing a soaked paper strip flat over a silicone line, pushing out a small air bubble.`) }),
  // rincones: algodón
  S(14, "", "bi", "b_cotton", { p: BI(`${G} rolling a soaked cotton pad into a little cylinder and pressing it into the corner of a bathtub where the silicone curves.`) }),
  // 5. film
  C(15, "", "ClChapter", { n: 5, label: "PASO", title: "Film encima", sub: "el secreto" }),
  S(15, "El film no deja que el agua oxigenada se evapore", "bi", "b_filmsheen", { p: BI("Extreme close view of clear cling film stretched tight over wet paper strips on a bathtub edge, droplets of condensation under the film.") }),
  // 6. a dormir
  C(16, "", "ClTimer30", { overnight: true, text: "8 horas" }),
  // seguridad
  S(17, "", "bi", "b_doorclosed", { p: BI("A closed bathroom door in a home hallway at night, a small dog lying on the floor in front of it.") }),
  // 7. a la mañana
  S(18, "", "bi", "b_peeloff", { p: BI(`${G} peeling the cling film and wet paper strips off a bathtub silicone line in the morning light, revealing clean white silicone.`), anim: "the strips peel away slowly" }),
  S(18, "Frote suave con el cepillo de dientes", "bi", "b_toothbrush", { p: BI(`${G} gently brushing a clean white silicone line along a bathtub with an old toothbrush.`) }),
  // repaso
  C(19, "", "ClCheck", { title: "El arreglo entero", items: ["Limpiar y secar", "Tiras de 5 cm empapadas", "Apretadas, sin aire", "Film encima", "Toda la noche"], fast: true }),
  // CTA 1
  S(20, "", "av", ""),
  C(20, "en la página catorce", "ClBookPage", { page: I + "book_p14.jpg", pageNo: 14, qr: I + "qr.jpg", stamp: "Gratis en la página" }),
  C(20, "Apunte el celular", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "la página 14 entera, gratis" }),
];
