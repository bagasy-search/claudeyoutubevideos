// DIRECTOR A — clbandeja: MINUTO 1 (Claudio a cámara + la costra marrón en el seg 1,7 → "barniz" con sello → el contenedor del hotel,
// 40 por año → PROMESA con la bandeja mitad y mitad + antes/después → números → Don Ramiro, el cocinero de la noche → ráfaga del arreglo
// → "¡Como nueva!" → 3 loops (por qué el detergente no puede, el error de la antiadherente, las bandejas del contenedor) → capítulo)
// + EL ARREGLO ENTERO (7 pasos + la prueba del surco) + CTA 1 página 13 (párrafos 0-19).
import { S, BI, CLP } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const G = "a hand in a blue nitrile glove";
const I = "img/clbandeja/";
export const KITCHEN = "a hotel kitchen with stainless steel counters and shelves, white subway tiles, a big commercial oven and hanging pans";
export const CRUST = "an aluminum baking sheet covered in thick, sticky, dark brown baked-on grease crust with raised bumps and burnt black edges";
export const BOTTLE = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
export const PASTE = "a thick layer of white paste of baking soda and hydrogen peroxide";
const RAMIRO = "a hotel night cook in his sixties, Don Ramiro, with a gray mustache, a white cook's jacket and a white cap";
export const SHOTS = [
  // ── 0:00 · Claudio a cámara → la costra
  S(0, "", "av", ""),
  S(0, "No es mugre", "bi", "b_crustmacro", { p: BI(`Extreme close view of ${CRUST} on a stainless steel kitchen counter, the warm kitchen light glinting on the sticky surface.`), anim: "the camera slowly pushes in across the bumpy crust" }),
  S(0, "Es aceite que se volvió", "bi", "b_crustnail", { p: BI(`${G} scraping a fingernail across the hard dark brown crust of an old baking sheet; the crust does not budge, smooth and hard like varnish.`), anim: "the gloved fingernail drags across the crust" }),
  S(0, "barniz", "bi", "st_varnish", { q: "varnish brush wood", p: BI("A brush spreading glossy amber varnish over wood.") , ov: { c: "ClStampOv", props: { text: "ES BARNIZ" } } }),
  // ── el contenedor
  S(1, "", "bi", "b_dumpster", { p: BI(`Old brown crusted baking sheets sticking out of a big green dumpster in the back patio of a hotel at dusk, kitchen door light on.`) }),
  S(1, "Cuarenta por año", "bi", "b_trayhrow", { p: BI(`A cook's hands tossing a crusted brown baking sheet into a dumpster full of other baking sheets, a hotel back patio.`), anim: "the baking sheet falls into the dumpster" }),
  S(1, "al contenedor", "bi", "b_dumpsterlid", { p: BI("The heavy plastic lid of a green dumpster slamming shut in a hotel back patio, a brown baking sheet edge still poking out.") }),
  // ── 0:08 · LA PROMESA (mitad y mitad + antes/después)
  S(2, "", "cl", "c_halftray", { p: CLP(`He stands in ${KITCHEN} holding up a big baking sheet with both gloved hands: the left half is ${CRUST.replace("an aluminum baking sheet covered in ", "covered in ")}, the right half is shiny clean silver aluminum, a clear line between them; he raises his eyebrows at the camera.`) }),
  S(2, "Media taza de bicarbonato", "bi", "b_sodapour", { p: BI(`${G} pouring white baking soda from a measuring cup over the crusted brown surface of an old baking sheet on a stainless steel counter.`), anim: "the white powder keeps pouring onto the tray" }),
  S(2, "un chorro del frasco marrón", "bi", "b_peroxidepour", { p: BI(`${G} pouring a thin stream of clear liquid from ${BOTTLE} over a layer of baking soda on a baking sheet, the powder darkening where it gets wet.`) }),
  C(2, "dos horas", "ClTimer30", { minutes: 120, fast: true, text: "2 horas" }),
  S(2, "y una esponja que no raya", "bi", "b_spongecircles", { p: BI(`${G} rubbing a soft yellow sponge in small circles over a baking sheet covered in grayish paste, flakes of brown crust lifting off.`), anim: "the sponge rubs slowly in circles" }),
  C(2, "Mire esta mitad", "ClBeforeAfter", { before: I + "b_traydirty.jpg", after: I + "b_trayclean_ab.jpg", a: "ESTA MITAD", b: "Y ESTA", note: "2 horas · sin rasquetear" }),
  // ── 0:16 · el hotel y Don Ramiro
  S(3, "", "cl", "c_kitchennight", { p: CLP(`He walks into ${KITCHEN} at night, the lights half on, carrying a toolbox, glancing at the camera.`), anim: "he walks slowly into the kitchen", ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de conserje de hotel" } } }),
  S(3, "Y el que me enseñó esto", "av", ""),
  S(3, "Fue Don Ramiro", "bi", "b_ramiro", { p: BI(`${RAMIRO} at a big stove in ${KITCHEN} at night, stirring a large pot, steam rising, looking over his shoulder.`), anim: "he stirs the pot slowly, steam rising" }),
  S(3, "el cocinero de la noche", "bi", "st_cooknight", { q: "chef cooking night kitchen", p: BI("A chef cooking in a commercial kitchen at night.") }),
  S(3, "que no soportaba ver una bandeja en la basura", "bi", "b_ramirotrash", { p: BI(`${RAMIRO} standing at an open trash bin in a hotel kitchen, frowning down at a brown crusted baking sheet in it, arms crossed.`) }),
  // ── 0:28 · ráfaga
  S(4, "", "av", ""),
  S(4, "Bicarbonato una capa gruesa", "kf", "k_soda", { p: BI(`Close view of ${G} sprinkling a thick even layer of white baking soda over ${CRUST} until the brown disappears under it.`), d1: "the gloved hand starts sprinkling white powder over the brown crust", d2: "the powder covers the crust in a thick white layer", sound: "a soft dry powder pouring" }),
  S(4, "El agua oxigenada despacito por encima", "bi", "b_peroxidepour2", { p: BI(`Close view of clear liquid trickling slowly from the spout of ${BOTTLE} onto a thick white layer of baking soda on a baking sheet, making a wet paste.`), anim: "the liquid trickles slowly onto the powder" }),
  S(4, "hasta hacer pasta", "bi", "b_pastemix", { p: BI(`Close view of a wet white paste of baking soda and hydrogen peroxide on a baking sheet, ${G} pressing it flat with the back of a spoon.`) }),
  S(4, "Otro poco de bicarbonato arriba", "bi", "b_sodatop", { p: BI(`${G} sprinkling a last dusting of dry baking soda over a wet white paste on a baking sheet.`) }),
  S(4, "Dos horas", "bi", "b_clock", { p: BI("A round wall clock in a hotel kitchen above a stainless steel shelf of pans.") }),
  S(4, "Esponja en circulitos", "kf", "k_sponge", { p: BI(`Close view of ${G} rubbing a soft yellow sponge in small circles over a baking sheet covered in brownish paste; the brown crust lifts off in flakes and shiny metal appears behind.`), d1: "the sponge sits on the paste-covered crust", d2: "the sponge rubs in circles and shiny metal appears", sound: "a soft wet scrubbing" }),
  S(5, "", "cl", "c_wow", { p: CLP(`He holds up a clean shiny baking sheet in ${KITCHEN}, his reflection faintly visible in the metal, laughing with delight and looking at the camera.`) }),
  // ── 0:43 · los 3 loops
  S(6, "", "av", ""),
  C(6, "Por qué el detergente nunca va a poder", "ClTray3D", { mode: "detergent", labels: { a: "Le pasa por encima" } }),
  C(6, "El error que le arruina una bandeja antiadherente", "ClCoating", {}),
  S(6, "Y lo que hizo Don Ramiro", "bi", "b_dumpsternight", { p: BI("A hotel back patio at night, a big green dumpster lit by a single flashlight beam, brown baking sheets sticking out of it.") }),
  S(6, "con las bandejas que el hotel tiraba", "bi", "b_ramirolift", { p: BI(`${RAMIRO} lifting a brown crusted baking sheet out of a dumpster at night, holding it up to a flashlight beam and studying it closely.`) }),
  S(6, "que todavía hoy están en esa cocina", "bi", "b_stacktrays", { p: BI(`A tall stack of heavy old aluminum baking sheets, clean and dull silver, on a stainless steel rack in ${KITCHEN}.`) }),
  C(6, "Primero el arreglo entero", "ClChapter", { n: 1, title: "El arreglo entero", sub: "siete pasos, sin rasquetear" }),
  // ── 1:00 · cadena con el video del sarro
  S(7, "", "av", ""),
  C(7, "Si vio mi video del sarro del inodoro", "ClVideoRef", { thumb: I + "th_clsarro.jpg", title: "El sarro del inodoro" }),
  C(7, "Pero acá va al revés", "ClPasteRecipe", { a: 2, b: 1, note: "más gruesa que la del sarro" }),
  // lo que necesita, la etiqueta
  C(8, "", "ClCheck", { title: "Lo que necesita", items: ["Bicarbonato", "Agua oxigenada 3 %", "Esponja que no raye", "Guantes"] }),
  S(8, "Nada de químicos de horno", "bi", "b_ovencleaner", { p: BI("A spray can of heavy-duty oven cleaner with a blank label pushed to the back of a shelf, a red X of tape across it.") }),
  S(9, "", "bi", "b_labels", { p: BI("Two brown plastic bottles of hydrogen peroxide side by side on a pharmacy shelf with plain blank white labels.") }),
  C(9, "La de veinte treinta o cuarenta volúmenes", "ClDoDont", { yes: { label: "3 % o 10 volúmenes", img: I + "b_labels.jpg" }, no: { label: "20, 30, 40: peluquería", img: I + "b_salonbottle.jpg" } }),
  // 1. fría y seca
  C(10, "", "ClChapter", { n: 1, label: "PASO", title: "Fría y seca", sub: "nunca caliente" }),
  S(10, "Si la bandeja tiene grasa suelta arriba", "bi", "b_papertowel", { p: BI(`${G} wiping loose oily grease off a crusted baking sheet with a paper towel.`) }),
  // 2. bicarbonato
  S(11, "", "bi", "b_sodathick", { p: BI(`A baking sheet on a stainless steel counter covered completely by a thick even layer of white baking soda, no metal visible, an open box of baking soda with a blank label beside it.`) }),
  S(11, "más o menos media taza", "bi", "st_measuringcup", { q: "measuring cup baking soda", p: BI("A measuring cup of white powder.") }),
  // 3. agua oxigenada
  S(12, "", "bi", "b_trickle", { p: BI(`${G} trickling clear liquid from ${BOTTLE} in short squirts over a layer of baking soda on a baking sheet.`), anim: "short trickles of liquid fall on the powder" }),
  S(12, "Tiene que quedar como arena mojada", "bi", "st_wetsand", { q: "wet sand close up", p: BI("Close view of wet sand.") }),
  // la prueba del surco
  C(13, "", "ClPasteCheck", {}),
  // 4. bicarbonato arriba
  S(14, "", "bi", "b_sodatop2", { p: BI(`Close view of dry white baking soda being dusted from a spoon over a wet white paste on a baking sheet, forming a thin dry crust on top.`) }),
  // 5. espera
  C(15, "", "ClTimer30", { minutes: 120, text: "2 horas", label: "o toda la noche" }),
  S(15, "la pasta se pone marrón", "bi", "b_pastebrown", { p: BI(`Close view of ${PASTE} on a baking sheet that has turned tan and brown in patches as the old grease underneath dissolves into it.`) }),
  C(15, "Ése es el aceite viejo que se está soltando", "ClTray3D", { mode: "paste", labels: { a: "Burbujas por debajo" } }),
  // 6. esponja
  C(16, "", "ClChapter", { n: 6, label: "PASO", title: "Circulitos", sub: "sin fuerza" }),
  C(16, "frote en circulitos", "ClTray3D", { mode: "flake", labels: { a: "Escamas" } }),
  S(16, "como pintura vieja", "bi", "b_flakes", { p: BI(`Extreme close view of brown crust lifting off a baking sheet in curled flakes like old peeling paint under ${G} holding a yellow sponge, shiny metal underneath.`) }),
  // 7. lavar
  S(17, "", "bi", "st_washtray", { q: "washing baking tray sink", p: BI("Washing a baking tray in a sink with soap.") }),
  S(17, "y séquela bien", "bi", "b_drytray", { p: BI(`${G} drying a clean shiny baking sheet with a white kitchen towel in ${KITCHEN}.`) }),
  // repaso
  C(18, "", "ClCheck", { title: "El arreglo entero", items: ["Fría y seca", "Bicarbonato grueso", "Agua oxigenada: pasta", "2 horas o la noche", "Circulitos, lavar, secar"], fast: true }),
  // CTA 1
  S(19, "", "av", ""),
  C(19, "en la página trece", "ClBookPage", { page: I + "book_p13.jpg", pageNo: 13, qr: I + "qr.jpg", stamp: "Gratis en la página" }),
  C(19, "Apunte el celular", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "la página 13 entera, gratis" }),
];
