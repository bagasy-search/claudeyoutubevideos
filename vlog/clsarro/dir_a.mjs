// DIRECTOR A — clsarro: MINUTO 1 diseñado aparte (Claudio a cámara en el seg 0 + el anillo marrón en el seg 1,7 → "Es piedra" con
// sello → el cepillo resbala → PROMESA con el antes/después a la vista en el seg 8 → números (pasta, piedra mojada, noche de vinagre)
// → hotel y 120 inodoros → la plata tirada → ráfaga del arreglo → "¡Como nuevo!" → 3 loops (cepillo, piedra seca, el gerente y los
// tres inodoros) → capítulo) + EL ARREGLO ENTERO (llave, vaso, pasta 3:1, 20 min, piedra mojada) + CTA 1 página 10 (párrafos 0-19).
//   kf = detalle con movimiento (agnes v2.0 desde foto base) · cl = foto con Claudio · bi = foto gpt (stock real si q; anim = movimiento
//   agnes v2.0) · c = componente Cl* · av = avatar (RunPod)
import { S, BI, CLP, BATH } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const G = "a hand in a blue nitrile glove";
const I = "img/clsarro/";
export const RING = "a hard-water stain ring at the waterline inside an ordinary white toilet bowl: a rough crusty band of brown and rust-orange mineral deposit a finger wide, with darker brown streaks running down toward the water";
export const PUMICE = "a gray pumice stone toilet-cleaning block on a short plastic handle";
export const BOTTLE = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
export const SHOTS = [
  // ── 0:00 · Claudio a cámara (la cara en el cuadro del seg 1) → el anillo marrón en el seg 1,7 → "Es piedra" con sello
  S(0, "", "av", ""),
  S(0, "inodoro no es mugre", "bi", "b_ringmacro", { p: BI(`Close view looking down into a white toilet bowl in a hotel bathroom at ${RING}, lit by the warm ceiling light, the clear water below it, a bit of beige floor tile at the edge.`), anim: "the camera slowly pushes in toward the brown ring; nothing else moves" }),
  S(0, "Es piedra", "bi", "b_ringscrape", { p: BI(`Extreme close view of ${G} scraping a fingernail across ${RING}: the crust is hard and rough like stone, a few gritty flakes on the glove tip.`), anim: "the gloved fingertip drags slowly across the rough crust", ov: { c: "ClStampOv", props: { text: "ES PIEDRA" } } }),
  // ── el cepillo resbala
  S(1, "", "bi", "st_brushbowl", { q: "scrubbing toilet bowl brush", p: BI(`${G} scrubbing the inside of a white toilet bowl with a toilet brush, water splashing.`) }),
  S(1, "arriba", "bi", "b_brushslide", { p: BI(`Extreme close view inside a white toilet bowl: the white plastic bristles of a toilet brush sliding over ${RING}, the brown crust completely intact under the bristles, droplets flying.`), anim: "the brush bristles slide back and forth over the ring and the ring stays the same" }),
  S(1, "y no le hace nada", "av", ""),
  // ── 0:08 · LA PROMESA con el resultado a la vista
  C(2, "", "ClBeforeAfter", { before: I + "b_ringdirty.jpg", after: I + "b_ringclean_ab.jpg", note: "sin tallar" }),
  S(2, "Veinte minutos", "bi", "b_pastespread", { p: BI(`Close view inside a white toilet bowl whose water has been lowered: ${G} spreading a thick white paste like toothpaste over ${RING} with an old sponge.`), anim: "the gloved hand slowly spreads more white paste along the ring" }),
  S(2, "una piedra mojada", "bi", "b_pumicewet", { p: BI(`Close view inside a white toilet bowl: ${G} rubbing ${PUMICE}, dripping wet, over ${RING}; where it has passed the porcelain is bright white, wet and shiny.`), anim: "the wet pumice slides slowly along the ring leaving white porcelain behind" }),
  S(2, "y una noche de vinagre", "bi", "b_stripsnight", { p: BI("Looking down into a white toilet bowl in a hotel bathroom at night, lit only by the small light over the sink: long strips of white toilet paper soaked and stuck flat all around the inside of the bowl at the old waterline like a bandage, a little clear liquid pooled at the bottom, a jug of white vinegar with a blank label on the floor beside the toilet.") }),
  S(2, "Así estaba", "cl", "c_before", { p: CLP(`He kneels beside a white toilet in ${BATH} pointing one gloved finger at ${RING}, his face screwed up in disgust, looking at the camera.`), ov: { c: "ClChip", props: { text: "Antes", alert: true } } }),
  S(2, "Así quedó", "cl", "c_after", { p: CLP(`He kneels beside the same white toilet in ${BATH}, the bowl now spotless and gleaming white, a wet gray pumice stone in his gloved hand, grinning proudly at the camera and giving a thumbs-up.`), ov: { c: "ClChip", props: { text: "Después" } } }),
  // ── 0:16 · el hotel, los 120 inodoros, la plata tirada
  S(3, "", "cl", "c_hallcart", { p: CLP("He pushes a gray hotel maintenance cart with a mop bucket, a toolbox and a stack of folded white towels down a hotel corridor with navy patterned carpet and numbered wooden doors, glancing at the camera mid-step."), anim: "he keeps pushing the cart slowly down the corridor", ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de conserje de hotel" } } }),
  S(3, "Ciento veinte inodoros", "bi", "st_toiletrow", { q: "row of toilets restroom", p: BI("A row of white toilet stalls with their doors open in a clean commercial restroom.") }),
  S(3, "Y este anillo marrón", "bi", "st_dirtytoilet", { q: "dirty toilet bowl stain", p: BI(`Looking down into an old white toilet bowl with ${RING}.`) }),
  S(3, "plata", "bi", "b_newtoilet", { p: BI("A brand-new white toilet still wrapped in plastic standing in a cardboard box in a hotel service hallway, a plumber's toolbox and a printed invoice clipped to a clipboard leaning against it.") }),
  S(3, "en cosas que no hacían falta", "bi", "st_cleanershelf", { q: "cleaning products supermarket shelf", p: BI("A supermarket shelf packed with rows of colorful toilet cleaner bottles with blank labels.") }),
  // ── 0:27 · la ráfaga del arreglo
  S(4, "", "av", ""),
  S(4, "Cierro el agua", "kf", "k_valve", { p: BI(`Close view behind a white toilet, low by the tiled wall: ${G} turning the oval chrome handle of the small shut-off valve where the water supply hose comes out of the wall.`), d1: "the gloved hand grips the oval chrome valve handle", d2: "the hand turns the handle clockwise until it stops", sound: "a small squeaky metal valve turning" }),
  S(4, "Saco lo que queda", "bi", "b_cupscoop", { p: BI(`Close view inside a white toilet bowl with very little water left: ${G} scooping the last water out of the bottom with a white disposable plastic cup, a gray bucket at the edge of the frame; ${RING} now fully above the water.`), anim: "the gloved hand lifts the cup of water slowly out of the bowl" }),
  S(4, "La pasta gruesa", "bi", "b_pastebowl", { p: BI("A small clear glass bowl on a white hotel bathroom counter holding a thick white paste of baking soda and hydrogen peroxide, a metal spoon standing in it, an open box of baking soda and a brown bottle with a blank label beside it.") , anim: "the spoon stirs the thick white paste slowly" }),
  S(4, "encima del anillo", "kf", "k_smear", { p: BI(`Extreme close view inside a white toilet bowl with the water lowered: the gloved fingertip of ${G} smearing a thick line of white paste over ${RING}.`), d1: "the gloved fingertip touches the brown ring with white paste", d2: "the fingertip drags a thick line of white paste along the ring covering it", sound: "a soft wet smear on porcelain" }),
  C(4, "Veinte minutos", "ClTimer30", { minutes: 20, fast: true }),
  S(4, "La piedra pómez", "bi", "b_pumicedip", { p: BI(`${G} dipping ${PUMICE} into a gray plastic bucket of clean water on a beige tile bathroom floor, water dripping off the stone.`), anim: "the pumice stone is lifted out of the bucket dripping water" }),
  S(4, "siempre mojada", "kf", "k_pumice", { p: BI(`Extreme close view inside a white toilet bowl: ${G} gently rubbing ${PUMICE}, dripping wet, back and forth over ${RING}; behind the stone the porcelain turns bright white.`), d1: "the wet pumice stone rests on the brown ring", d2: "the stone rubs gently back and forth and white porcelain shows behind it", sound: "a wet gritty rubbing of stone on porcelain" }),
  S(4, "Y lo que no sale", "bi", "b_shadowring", { p: BI("Looking down into a clean white toilet bowl with the water lowered: only a faint thin gray shadow of an old mineral ring is left at the waterline, the rest of the porcelain bright white.") }),
  S(4, "otro día", "bi", "st_vinegarpour", { q: "pouring white vinegar", p: BI("Pouring clear white vinegar from a plastic jug with a blank label into a measuring cup on a counter.") }),
  S(4, "una noche de vinagre", "bi", "b_stripsmorning", { p: BI(`${G} peeling a soaked strip of toilet paper off the inside of a white toilet bowl in the morning light, the porcelain under it clean and white.`), anim: "the gloved hand slowly peels the wet paper strip away" }),
  S(5, "", "cl", "c_wow", { p: CLP(`He kneels beside a spotless gleaming white toilet in ${BATH}, leaning back with both gloved hands up, eyes wide and mouth open in a delighted laugh, looking at the camera.`) }),
  // ── 0:43 · los 3 loops
  S(6, "", "av", ""),
  C(6, "Por qué el cepillo nunca", "ClBowl3D", { mode: "brush", lupa: false, labels: { ring: "¿Por qué no sale?" } }),
  C(6, "El error con la piedra", "ClPumiceTest", { only: "dry" }),
  S(6, "Y lo que el gerente", "bi", "b_manager", { p: BI("A hotel manager in his forties in a dark suit and tie standing in a hotel corridor with navy carpet, frowning at a small spiral notebook in his hand, a pen poised over it, a guest-room door open behind him.") }),
  C(6, "con tres inodoros", "ClNotebook", { rows: [{ k: "312", v: "cambiar" }, { k: "314", v: "cambiar" }, { k: "318", v: "cambiar" }] }),
  S(6, "y cómo se los salvé", "av", ""),
  C(6, "Primero el arreglo entero", "ClChapter", { n: 1, title: "El arreglo entero", sub: "de principio a fin" }),
  // ── 1:01 · la cadena con el video del borde
  S(7, "", "av", ""),
  C(7, "mi video del borde", "ClVideoRef", { thumb: I + "th_clborde.jpg", title: "El borde del inodoro" }),
  S(7, "es mineral", "bi", "b_grayholes", { p: BI("Extreme close view of the underside of a white toilet rim: the small flush holes ringed with hard gray-white mineral crust, a little dark staining inside the crust.") }),
  S(7, "Hoy es ese otro día", "av", ""),
  // ── guantes, una regla
  S(8, "", "bi", "st_gloves", { q: "putting on rubber gloves", p: BI("Close view of two hands pulling on blue nitrile gloves in a bathroom.") }),
  S(8, "la ventana abierta", "bi", "st_window", { q: "opening bathroom window", p: BI("A hand pushing open a small frosted bathroom window, daylight coming in.") }),
  C(8, "si esta semana usó cloro", "ClNeverMix", { a: "Cloro", b: "Vinagre", verdict: "Nunca juntos", short: true }),
  S(8, "tire la cadena dos o tres veces", "bi", "st_flush1", { q: "toilet flushing water", p: BI("Clean water swirling down a white toilet bowl during a flush.") }),
  // ── lo que necesita
  C(9, "", "ClCheck", { title: "Lo que necesita", items: ["Agua oxigenada 3 %", "Bicarbonato", "Piedra pómez", "Un vaso y un balde", "Vinagre (otro día)"] }),
  S(9, "menos de lo que sale", "bi", "st_cleanercart", { q: "shopping cleaning products", p: BI("A hand taking an expensive-looking toilet cleaner bottle with a blank label off a store shelf.") }),
  // ── la llave
  S(10, "", "av", ""),
  S(10, "Atrás del inodoro", "bi", "b_valvewall", { p: BI(`Low view behind a white toilet in ${BATH}: the small chrome angle shut-off valve with an oval handle coming out of the beige tiled wall near the floor, a braided steel supply hose running up from it to the bottom of the tank.`) }),
  C(10, "Gírela hacia la derecha", "ClValve3D", { label: "A la derecha, hasta que pare" }),
  S(10, "La taza se vacía", "bi", "st_flushdrain", { q: "toilet flush water draining", p: BI("Looking down into a white toilet bowl as the water drains away after a flush.") }),
  // ── el vaso
  S(11, "", "bi", "b_cupscoop2", { p: BI(`${G} pouring a white disposable cup of water from a toilet bowl into a gray plastic bucket on the beige tile floor of a hotel bathroom.`), anim: "the water pours slowly from the cup into the bucket" }),
  C(11, "Sólo que el anillo quede afuera", "ClBowl3D", { mode: "lower", labels: { ring: "Anillo afuera", water: "El agua, abajo" } }),
  // ── la pasta 3:1
  S(12, "", "bi", "st_bakingsoda", { q: "baking soda spoon", p: BI("A tablespoon scooping white baking soda powder out of a box.") }),
  C(12, "Tres cucharadas de bicarbonato", "ClPasteRecipe", { a: 3, b: 1 }),
  S(12, "Revuelva", "bi", "b_pastestir", { p: BI("Close view of a metal spoon stirring a thick white paste in a small clear glass bowl on a white bathroom counter, the paste holding its shape like toothpaste.") , anim: "the spoon stirs the thick paste in slow circles" }),
  S(12, "se tiene que quedar pegada", "bi", "b_pastecling", { p: BI(`Close view of a thick white paste stuck to the inside wall of a white toilet bowl over ${RING}, holding in place without running down.`) }),
  // ── untar, 20 minutos, burbujitas
  S(13, "", "bi", "b_spongepaste", { p: BI(`${G} pressing an old yellow sponge loaded with thick white paste onto ${RING} inside a white toilet bowl with the water lowered.`), anim: "the sponge presses and slides slowly along the ring" }),
  C(13, "Y déjela veinte minutos", "ClTimer30", { minutes: 20, label: "No toque nada" }),
  C(13, "Va a ver burbujitas", "ClBowl3D", { mode: "paste", labels: { ring: "Sale la capa de arriba" } }),
  // ── la piedra pómez
  S(14, "", "bi", "st_pumice", { q: "pumice stone", p: BI("A gray pumice stone held in a hand.") }),
  S(14, "la que viene con mango", "bi", "b_pumicehandle", { p: BI(`${PUMICE} lying on a folded white towel on a hotel bathroom counter next to a brown bottle with a blank label.`) }),
  S(14, "Mójela en el balde", "bi", "b_pumicebucket", { p: BI(`${G} plunging ${PUMICE} into a gray bucket of water, bubbles rising out of the porous stone.`), anim: "small bubbles rise out of the stone in the water" }),
  S(14, "como si borrara con una goma", "bi", "b_pumicerub", { p: BI(`Close view inside a white toilet bowl: ${G} rubbing ${PUMICE} lightly over what is left of ${RING}, a gray slurry of wet stone dust on the porcelain.`), anim: "the stone slides lightly back and forth" }),
  // ── raspa algo duro, se pone liso
  S(15, "", "bi", "b_smoothwhite", { p: BI("Extreme close view of wet white porcelain inside a toilet bowl, perfectly smooth and glossy where a mineral ring used to be, drops of water beading on it.") }),
  C(15, "La piedra es más blanda", "ClPumiceTest", {}),
  // ── abrir, descargar, mirar
  S(16, "", "bi", "st_valveopen", { q: "turning water valve", p: BI("A hand turning a small chrome water valve under a sink.") }),
  S(16, "tire la cadena", "bi", "st_flush2", { q: "toilet flush clean bowl", p: BI("Clear water swirling in a clean white toilet bowl during a flush.") }),
  // ── nueve de cada diez
  S(17, "", "cl", "c_clean", { p: CLP(`He kneels beside a gleaming white toilet in ${BATH} running one gloved fingertip along the inside of the clean bowl and nodding at the camera, satisfied.`) }),
  S(17, "una sombra dura", "bi", "b_shadowring2", { p: BI("Close view of a white toilet bowl: clean everywhere except a thin hard gray line of old mineral at the waterline.") }),
  S(17, "Para eso es la noche de vinagre", "av", ""),
  // ── el repaso
  C(18, "", "ClCheck", { title: "El arreglo entero", items: ["Agua abajo", "Pasta 3 a 1", "20 minutos", "Piedra mojada", "Descarga"], fast: true }),
  // ── CTA 1: la página 10 gratis
  S(19, "", "av", ""),
  C(19, "en la página diez", "ClBookPage", { page: I + "book_p10.jpg", pageNo: 10, qr: I + "qr.jpg", stamp: "Gratis en la página" }),
  C(19, "Apunte el celular", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "la página 10 entera, gratis" }),
];
