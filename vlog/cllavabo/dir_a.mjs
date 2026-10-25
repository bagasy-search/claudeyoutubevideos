// DIRECTOR A — cllavabo: MINUTO 1 (la costra blanca de la base de la llave → "no es mugre, es piedra" → PROMESA vinagre tibio +
// detergente, antes/después → la falla (esponja verde y polvo, rayitas) → "no fue culpa suya" → 3 loops) + INTRO (180 lavabos, agua
// dura) + CTA 1 (pág. 18) + el gerente, Rosa + callback al video del inodoro + QUÉ ES (la gota que se seca, torta de dos pisos,
// prueba del hisopo) + 1er SECRETO (el cloro: Julián, Don Ramiro, peligro) + LO QUE NECESITA (párr. 0-27).
import { S, BI, CLP, BATH } from "../claudio/lib.mjs";
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const CL = (p, at, name, scene, o = {}) => S(p, at, "cl", name, { p: CLP(scene), ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: BI(scene), ...o });
export const AV = (p, at = "") => S(p, at, "av", "");
export const G = "a hand in a blue nitrile glove";
export const SINK = "a white porcelain bathroom sink set into a light counter, with a chrome single-lever faucet";
export const CRUST = "a chrome bathroom faucet whose base is ringed with a thick white chalky limescale crust where it meets the white porcelain";
export const CLEANF = "a clean shiny chrome bathroom faucet on a spotless white porcelain sink, the base bright with no white marks";
export const SPOUT = "the tip of a chrome bathroom faucet spout, its little mesh aerator screen crusted with white limescale";
export const DRAIN = "the chrome drain ring of a white porcelain bathroom sink, ringed with white and light-brown limescale";
export const SPRAY = "a clear plastic spray bottle with a plain blank label, filled with clear liquid";
export const VINEGAR = "a big clear plastic jug of white vinegar with a plain blank label";
export const SOAP = "a clear bottle of green dish soap with a plain blank label";
export const CLOTH = "a folded dry blue microfiber cloth";
export const HOTELBATH = BATH;
export const HOTELKITCHEN = "a big hotel kitchen with stainless steel counters, a gas range and a long stainless steel range hood";
export const ROSA = "Rosa, a hotel housekeeper in her fifties with dark hair in a bun and a light-blue housekeeping uniform";
export const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie, holding a small black notebook";
export const RAMIRO = "Don Ramiro, the hotel cook in his sixties with a gray mustache, a white cook's jacket and a long apron";
export const JULIAN = "Julián, a skinny young hotel cleaner in his early twenties with short black hair and a light-blue housekeeping uniform";
export const AURELIO = "Don Aurelio, an old hotel maintenance chief in his seventies with white hair, wire glasses and a gray work coat";
export const HALL = "a carpeted hotel corridor with numbered room doors and warm ceiling lights";
export const I = "img/cllavabo/";
export const SHOTS = [
  // ── 0:00 · Claudio a cámara: el dedo en la base
  AV(0),
  B(0, "dura", "b_fingerbase", `${G} runs one finger along ${CRUST}, close view.`, { anim: "the finger slides slowly along the white crust" }),
  ST(0, "Usted la frotó", "b_scrubsink", "scrubbing bathroom sink", `Ordinary real footage that shows scrubbing bathroom sink.`),
  ST(0, "con la esponja", "b_greensponge", "green scouring sponge", `A green scouring sponge on the edge of a white bathroom sink.`),
  ST(0, "con el polvo", "b_powder", "cleaning powder sink", `Ordinary real footage that shows cleaning powder sink.`),
  ST(0, "con el cloro", "b_bleachpour", "pouring bleach", `Ordinary real footage that shows pouring bleach.`),
  B(0, "y sigue ahí", "b_stillthere", `${CRUST}, still there after scrubbing, wet and white.`),
  CL(0, "Le voy a contar un secreto", "c_secret", `He leans over ${SINK} in ${HOTELBATH}, pointing at the white crust at the base of the faucet with a gloved finger, looking at the camera.`),
  B(0, "esa mancha no es mugre", "b_crustmacro", `Extreme close view of white chalky limescale crust at the base of a chrome faucet, layered like rock.`),
  ST(0, "Es piedra", "b_limestone", "limestone rock texture", `Ordinary real footage that shows limestone rock texture.`),
  ST(0, "Y la piedra no se frota", "b_rubrock", "scrubbing hard stain", `Ordinary real footage that shows scrubbing hard stain.`),
  B(0, "La piedra se ablanda", "b_dissolve", `Clear vinegar dripping onto ${CRUST}, small bubbles forming on the white crust.`, { anim: "tiny bubbles rise on the crust" }),
  // ── PROMESA
  AV(1),
  ST(1, "dos tazas de vinagre", "b_vinegarcup", "pouring vinegar measuring cup", `Clear white vinegar being poured into a glass measuring cup.`),
  B(1, "y una cucharada", "b_spoonsoap", `${G} pours green dish soap into a tablespoon over a clear spray bottle.`),
  ST(1, "de detergente de platos", "b_dishsoap", "dish soap bottle", `Ordinary real footage that shows dish soap bottle.`),
  CL(1, "Le muestro dónde ponerla", "c_spraybase", `He sprays clear liquid from ${SPRAY} onto the faucet of ${SINK} in ${HOTELBATH}.`, { anim: "he sprays the faucet" }),
  C(1, "cuánto tiempo dejarla", "ClTimer30", { minutes: 15, fast: true, text: "15 minutos" }),
  C(1, "y cómo envolver la llave", "ClFaucet3D", { mode: "wrap", labels: { a: "Venda de vinagre" } }),
  B(1, "la costra se deshaga", "b_crumble", `${G} pushes softened gray limescale off the base of a chrome faucet with one fingertip, the crust crumbling like wet chalk.`),
  B(1, "Mire esta base", "b_ba_before", `${CRUST}, straight-on close view, white crust years thick.`),
  ST(1, "Blanca, de años", "b_oldfaucet", "old faucet limescale", `Ordinary real footage that shows old faucet limescale.`),
  C(1, "Y mírela ahora", "ClBeforeAfter", { before: I + "b_ba_before.jpg", after: I + "b_ba_after.jpg", a: "ANTES", b: "DESPUÉS", note: "vinagre tibio · sin tallar" }),
  ST(1, "Cromo, brillando", "b_chromeshine", "chrome faucet water", `Ordinary real footage that shows chrome faucet water.`),
  // ── la falla
  AV(2),
  ST(2, "lavándose los dientes", "b_brushteeth", "brushing teeth bathroom sink", `Ordinary real footage that shows brushing teeth bathroom sink.`),
  ST(2, "Agarró la esponja verde", "b_grabsponge", "hand grabbing sponge", `A hand grabbing a green and yellow sponge next to a bathroom sink.`),
  B(2, "la del lado áspero", "b_roughside", `Close view of the rough green side of a kitchen sponge.`),
  ST(2, "Le echó polvo limpiador", "b_sprinkle", "sprinkling cleaning powder", `Ordinary real footage that shows sprinkling cleaning powder.`),
  CL(2, "Frotó fuerte", "c_scrubhard", `He scrubs the base of the faucet of ${SINK} hard with a green scouring sponge and white powder in ${HOTELBATH}, frowning.`, { anim: "he scrubs hard" }),
  ST(2, "con las dos manos", "b_twohands", "scrubbing sink two hands", `Ordinary real footage that shows scrubbing sink two hands.`),
  ST(2, "Y la mancha se aclaró", "b_rinse", "rinsing bathroom sink", `Ordinary real footage that shows rinsing bathroom sink.`),
  ST(2, "Pero al rato", "b_drysink", "dry bathroom sink", `Ordinary real footage that shows dry bathroom sink.`),
  B(2, "cuando se secó el lavabo", "b_driedwhite", `${SINK}, dry, the white marks showing again around the faucet base.`),
  B(2, "volvió a aparecer", "b_whitecome", `Close view of dull white haze reappearing around a chrome faucet base on a dry porcelain sink.`),
  ST(2, "Y encima", "b_faucetclose", "faucet closeup", `Ordinary real footage that shows faucet closeup.`),
  B(2, "la llave tiene rayitas", "b_scratches", `Extreme close view of fine circular scratches on the chrome of a bathroom faucet.`),
  // ── no fue culpa suya
  AV(3),
  ST(3, "más fuerza y más producto", "b_products", "cleaning products bathroom", `A row of cleaning product bottles on a bathroom counter.`),
  CL(3, "el sarro no es grasa", "c_explain", `He leans on the counter next to ${SINK} in ${HOTELBATH}, talking to the camera with a calm open hand.`),
  C(3, "Es el mineral del agua", "ClDropDry", { days: 365 }),
  ST(3, "Y el mineral no le tiene miedo a la fuerza", "b_hardpush", "hand pressing hard", `Ordinary real footage that shows hand pressing hard.`),
  // ── 3 loops
  AV(4),
  CL(4, "Por qué el cloro", "c_threefingers", `He holds up three gloved fingers to the camera in ${HOTELBATH}, a white bottle of bleach on the counter.`),
  C(4, "con el sarro no hace absolutamente nada", "ClAcidBase", { hi: "cloro" }),
  ST(4, "Qué hacer con el lavabo de mármol", "b_marble", "marble bathroom sink", `Ordinary real footage that shows marble bathroom sink.`),
  ST(4, "que con vinagre se arruina", "b_marbleetch", "marble countertop", `Ordinary real footage that shows marble countertop.`),
  ST(4, "el que hace que el sarro no vuelva", "b_shinyclean", "clean bathroom sink faucet", `Ordinary real footage that shows clean bathroom sink faucet.`),
  // ── INTRO
  AV(5),
  C(5, "ciento ochenta habitaciones", "ClHallway3D", { total: 180, floor: 3, title: "lavabos", sub: "cada uno, todos los días" }),
  ST(5, "el agua salía dura", "b_tapwater", "tap water glass", `Ordinary real footage that shows tap water glass.`),
  CL(5, "mi pan de todos los días", "c_hotelsink", `He wipes the faucet of ${SINK} in ${HOTELBATH} with a cloth, a housekeeping cart at the door.`),
  // ── CTA 1
  AV(6),
  CL(6, "me prometí escribir", "c_bookhold", `He holds a thick printed spiral-bound book with a plain brown cover in ${HOTELBATH}, showing it to the camera.`),
  ST(6, "Cada arreglo con su medida", "b_notebookdesk", "old notebook handwritten notes desk", `Ordinary real footage that shows old notebook handwritten notes desk.`),
  C(6, "Un libro", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "94 ARREGLOS · PÁGINA 18", text: "escanee con la cámara" }),
  AV(6, "Noventa y cuatro arreglos"),
  C(6, "La mezcla de hoy está en la página dieciocho", "ClBookPage", { page: I + "book_p18.jpg", pageNo: 18, stamp: "Página 18" }),
  C(6, "Puede escanear el código", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "LA MEZCLA · PÁGINA 18", text: "escanee con la cámara" }),
  CL(6, "Volvemos al lavabo", "c_backtosink", `He turns back to ${SINK} in ${HOTELBATH} and picks up ${SPRAY}.`),
  // ── el gerente y Rosa
  AV(7),
  CL(7, "una libreta", "c_manager", `He stands in ${HALL} next to ${MANAGER}, who writes in his notebook with a serious face.`),
  C(7, "lavabo con manchas", "ClNotebook", { title: "La libreta del gerente", rows: [{ k: "Lunes", v: "hab. 312 · lavabo con manchas" }, { k: "Martes", v: "hab. 318 · lavabo con manchas" }], note: "el sarro" }),
  ST(7, "piensa que el baño está sucio", "b_guestlook", "hotel guest bathroom", `Ordinary real footage that shows hotel guest bathroom.`),
  AV(8),
  B(8, "Ella limpiaba los lavabos", "b_rosaclean", `${ROSA} wipes a white porcelain sink in ${HOTELBATH} with a cloth, very carefully.`),
  ST(8, "con todo el cuidado del mundo", "b_housekeeping", "hotel housekeeping cleaning", `Ordinary real footage that shows hotel housekeeping cleaning.`),
  CL(8, "Un día me buscó en el pasillo", "c_rosahall", `He listens to ${ROSA}, who talks to him with a worried face in ${HALL}, a housekeeping cart beside them.`),
  B(8, "Y no salen", "b_rosasink", `${ROSA} points at white limescale marks around the faucet of a clean hotel sink, upset.`),
  // ── callback al video del inodoro
  AV(9),
  C(9, "En el video del inodoro", "ClVideoRef", { thumb: I + "th_inodoro.jpg", title: "El sarro del inodoro", tag: "ya en el canal" }),
  ST(9, "Ésas son blancas", "b_whitespots", "water spots faucet", `Ordinary real footage that shows water spots faucet.`),
  C(9, "la llave, la base, la boca", "ClFaucet3D", { mode: "grow", labels: { a: "La base", b: "La boca", c: "El desagüe" } }),
  ST(9, "y la porcelana", "b_porcelain", "white porcelain sink", `Ordinary real footage that shows white porcelain sink.`),
  // ── QUÉ ES
  C(10, "", "ClChapter", { n: 1, label: "PRIMERO", title: "Qué es esa mancha blanca", sub: "y por qué sale" }),
  AV(11),
  ST(11, "Calcio y magnesio", "b_minerals", "mineral rocks closeup", `Ordinary real footage that shows mineral rocks closeup.`),
  ST(11, "viajan dentro del agua", "b_waterflow", "running water tap slow motion", `Ordinary real footage that shows running water tap slow motion.`),
  ST(11, "Mientras el agua corre", "b_tapon", "water running bathroom faucet", `Ordinary real footage that shows water running bathroom faucet.`),
  B(11, "una gota se queda quieta", "b_onedrop", `A single water drop resting on the white porcelain next to the base of a chrome faucet, close view.`),
  AV(12),
  C(12, "Pero la piedra no se puede ir", "ClDropDry", { days: 730 }),
  ST(12, "Una gota no se nota", "b_dropfall", "water drop falling faucet", `Ordinary real footage that shows water drop falling faucet.`),
  B(12, "durante dos años", "b_twoyears", `${CRUST}, close view, the crust thick and layered.`),
  AV(13),
  C(13, "Alrededor de la base de la llave", "ClFaucet3D", { mode: "grow", labels: { a: "Donde el agua se junta", b: "La última gota", c: "El desagüe" }, days: 730 }),
  ST(13, "Alrededor del desagüe", "b_drainring", "bathroom sink drain", `Ordinary real footage that shows bathroom sink drain.`),
  ST(13, "donde salpica cuando se lava la cara", "b_washface", "washing face sink", `Ordinary real footage that shows washing face sink.`),
  AV(14),
  ST(14, "restos de jabón y pasta de dientes", "b_toothpaste", "toothpaste sink", `Ordinary real footage that shows toothpaste sink.`),
  C(14, "y la hacen más gruesa", "ClPins", { img: I + "b_pinsbase.jpg", pins: [{ x: 0.42, y: 0.66, label: "Abajo: piedra" }, { x: 0.58, y: 0.42, label: "Arriba: jabón" }, { x: 0.3, y: 0.38, label: "Pasta de dientes" }] }),
  B(14, "Abajo, piedra", "b_twolayers", `Extreme close view of a limescale crust at the base of a faucet: a hard white mineral layer underneath and a soft gray soap film on top.`),
  AV(15),
  ST(15, "Hay una prueba de diez segundos", "b_swab", "cotton swab", `Ordinary real footage that shows cotton swab.`),
  CL(15, "Moje la punta de un hisopo", "c_swab", `He dips a cotton swab into a small glass of clear vinegar next to ${SINK} in ${HOTELBATH}.`),
  B(15, "apóyela sobre la mancha un minuto", "b_swabon", `${G} holds a wet cotton swab pressed against a white limescale spot at the base of a chrome faucet.`),
  B(15, "se pone transparente", "b_clearwet", `Close view of a limescale spot on white porcelain turning clear and glassy where it is wet with vinegar.`),
  AV(16),
  C(16, "Ablande, no frote", "ClTwoDays", { d1: ["SÍ", "Ablande", "vinagre tibio · tiempo", "#3E6E8E"], d2: ["NO", "Frote", "esponja verde · polvo", "#B5532E"], stamp: "Ablande, no frote" }),
  ST(16, "el vinagre blanco", "b_vinegarbottle", "white vinegar bottle", `${VINEGAR} on a kitchen counter.`),
  C(16, "Así empieza la página dieciocho", "ClBookPage", { page: I + "book_p18.jpg", pageNo: 18, stamp: "Ablande, no frote" }),
  // ── 1er SECRETO: el cloro
  C(17, "", "ClChapter", { n: 2, label: "PRIMER SECRETO", title: "El cloro no sirve", sub: "para la piedra" }),
  AV(18),
  B(18, "Julián", "b_julian", `${JULIAN} pushes a housekeeping cart along ${HALL}, smiling, eager.`),
  ST(18, "una semana, para ayudarla", "b_cart", "hotel housekeeping cart", `Ordinary real footage that shows hotel housekeeping cart.`),
  B(18, "agarró la botella de cloro", "b_julianbleach", `${JULIAN} pours a big splash of bleach from a white bottle into a white hotel bathroom sink.`),
  ST(18, "lo más fuerte que había", "b_bleachsplash", "bleach pouring sink", `Ordinary real footage that shows bleach pouring sink.`),
  AV(19),
  ST(19, "olían a pileta de natación", "b_pool", "swimming pool water", `Ordinary real footage that shows swimming pool water.`),
  B(19, "Estaban blanquísimos donde había mugre", "b_bleachedsink", `A very white hotel bathroom sink, still with white limescale crust around the chrome faucet base.`),
  CL(19, "Y el muchacho no entendía nada", "c_julianconfused", `He stands with ${JULIAN} in ${HOTELBATH}; the young man holds a bleach bottle and shrugs, confused.`),
  B(19, "Le eché cloro puro", "b_managerjulian", `${MANAGER} looks at a hotel sink and writes in his notebook while ${JULIAN} holds a bleach bottle.`),
  AV(20),
  ST(20, "El moho, las bacterias", "b_mold", "black mold grout", `Ordinary real footage that shows black mold grout.`),
  B(20, "Pero el sarro no está vivo", "b_rockcrust", `Extreme close view of hard white limescale crust like a little rock at the base of a faucet.`),
  C(20, "están del mismo lado", "ClAcidBase", { hi: "cloro" }),
  B(20, "le pasa por encima y no lo toca", "b_bleachover", `Bleach running over white limescale crust at the base of a chrome faucet, the crust unchanged.`),
  AV(21),
  CL(21, "olió el cloro", "c_ramirohall", `He and ${JULIAN} stand in ${HALL} while ${RAMIRO} sniffs the air and frowns.`),
  B(21, "A la piedra se la disuelve", "b_ramirovinegar", `${RAMIRO} carries a big plastic jug of white vinegar out of ${HOTELKITCHEN}.`),
  CL(21, "Esa misma tarde le enseñé a Julián", "c_teachjulian", `He shows ${JULIAN} how to spray ${SPRAY} onto a faucet in ${HOTELBATH}; the young man watches closely.`),
  AV(22),
  C(22, "no le eche vinagre encima", "ClNeverMix", { a: "Cloro", b: "Vinagre", verdict: "Nunca el mismo día" }),
  ST(22, "Enjuague con mucha agua", "b_rinsewater", "rinsing sink water", `Ordinary real footage that shows rinsing sink water.`),
  ST(22, "abra la ventana", "b_openwindow", "opening bathroom window", `Ordinary real footage that shows opening bathroom window.`),
  C(22, "un gas que le quema los pulmones", "ClMixLight", { state: "red", text: "Cloro + vinagre", sub: "suelta gas de cloro" }),
  // ── LO QUE NECESITA
  C(23, "", "ClChapter", { n: 3, label: "LO QUE NECESITA", title: "Ocho cosas", sub: "casi todas en la cocina" }),
  CL(23, "casi todas ya las tiene en la cocina", "c_supplies", `He lays out on the counter of ${SINK} in ${HOTELBATH}: ${VINEGAR}, ${SOAP}, ${SPRAY}, a roll of paper towels, a small plastic bag, a rubber band, an old toothbrush, wooden toothpicks and ${CLOTH}.`),
  AV(24),
  C(24, "Vinagre blanco", "ClCheck", { title: "Lo que necesita", items: ["Vinagre blanco", "Detergente de platos", "Rociador vacío", "Papel de cocina", "Bolsita y una liga", "Cepillo de dientes viejo", "Palillo de madera", "Paño de microfibra"] }),
  ST(24, "Papel de cocina", "b_papertowel", "paper towel roll", `Ordinary real footage that shows paper towel roll.`),
  ST(24, "Una bolsita plástica", "b_plasticbag", "small plastic bag", `A small clear plastic bag and a rubber band on a bathroom counter.`),
  ST(24, "Un cepillo de dientes viejo", "b_oldtoothbrush", "old toothbrush", `Ordinary real footage that shows old toothbrush.`),
  ST(24, "Un palillo de madera", "b_toothpick", "wooden toothpicks", `Ordinary real footage that shows wooden toothpicks.`),
  ST(24, "Y un paño de microfibra seco", "b_microfiber", "microfiber cloth", `Ordinary real footage that shows microfiber cloth.`),
  AV(25),
  ST(25, "Ni lana de acero", "b_steelwool", "steel wool", `Ordinary real footage that shows steel wool.`),
  B(25, "antisarro", "b_storebottle", `A supermarket shelf with colorful bottles of bathroom limescale cleaner with plain blank labels.`),
  C(25, "son ácido con perfume", "ClReceipt", { lines: [["Antisarro de marca", "$40"], ["Vinagre blanco", "$4"], ["Detergente", "una cucharada"], ["El perfume", "lo paga usted"]] }),
  AV(26),
  ST(26, "unos guantes de goma", "b_gloves", "rubber gloves", `Ordinary real footage that shows rubber gloves.`),
  B(26, "la piel se reseca", "b_dryhands", `Close view of two hands with dry red skin next to a bathroom sink.`),
  AV(27),
  ST(27, "una olla o una taza", "b_smallpot", "small pot stove", `Ordinary real footage that shows small pot stove.`),
  ST(27, "Tibio, no hirviendo", "b_warmwater", "warm water pot steam", `Ordinary real footage that shows warm water pot steam.`),
  B(27, "Como para bañar a un bebé", "b_wristtest", `A hand testing warm liquid on the inside of the wrist over a small pot.`),
  CL(27, "en la cocina de Don Ramiro", "c_ramiropot", `He warms white vinegar in an old dented pot on the gas range of ${HOTELKITCHEN} while ${RAMIRO} watches.`),
];
