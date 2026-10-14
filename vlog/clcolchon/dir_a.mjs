// DIRECTOR A — clcolchon: MINUTO 1 (Claudio a cámara con el secreto → PROMESA con antes/después de la mancha amarilla en el seg 10,7 →
// la falla exacta (balde, trapo, empapado, olía raro) → "no fue culpa suya" → el culpable (empaparlo) → 3 loops) + INTRO + CTA 1 a la
// 1:41 (frase fija) + el gerente y Rosa + callback a clmezcla (la única mezcla buena) y a cldescarga (párr. 0-11).
import { S, BI, CLP } from "../claudio/lib.mjs";
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const CL = (p, at, name, scene, o = {}) => S(p, at, "cl", name, { p: CLP(scene), ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: BI(scene), ...o });
export const G = "a hand in a blue nitrile glove";
export const BROWN = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
export const SPRAY = "a clear plastic spray bottle with a plain blank white label";
export const SODA = "an open box of baking soda with a plain blank white label";
export const ROOM = "a modest hotel guest room with a double bed, beige walls and a window with sheer curtains";
export const MATT = "a bare white quilted mattress on a hotel bed";
export const HOMEBED = "a small ordinary home bedroom with a bare white quilted mattress on the bed";
export const HALL = "a carpeted hotel corridor with numbered room doors and warm ceiling lights";
export const ROSA = "Rosa, a hotel laundry worker in her fifties with dark hair in a bun and a light-blue housekeeping uniform";
export const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie, holding a small black notebook";
export const RAMIRO = "Don Ramiro, the hotel night cook in his sixties with a gray mustache and a white cook's jacket";
export const YOUNG = "a young hotel maintenance worker in his twenties in a gray uniform";
export const I = "img/clcolchon/";
export const SHOTS = [
  // ── 0:00 · Claudio a cámara: el secreto
  S(0, "", "av", ""),
  CL(0, "El problema nunca fue la mancha", "c_pullsheet", `He pulls the white sheet off ${MATT} in ${ROOM}, revealing an old faded yellow stain in the middle, and looks at the camera.`, { anim: "he pulls the sheet off the mattress" }),
  B(0, "El problema es lo que hace usted", "b_bucketbed", `A plastic bucket of soapy water and a scrub brush on the floor next to a bed with a bare white mattress in ${HOMEBED}.`),
  B(0, "cuando la limpia", "b_handsbucket", `Two hands dipping a rag into a bucket of soapy water next to a bed.`),
  // ── 0:10,7 · LA PROMESA con el resultado a la vista
  C(1, "", "ClBeforeAfter", { before: I + "b_matt_before.jpg", after: I + "b_matt_after_ab.jpg", note: "1 taza · 3 cucharadas · 1 gota" }),
  CL(1, "una taza de agua oxigenada", "c_pourcup", `He pours ${BROWN} into a glass measuring cup on a small hotel room table in ${ROOM}, gloves on.`, { anim: "he pours the peroxide into the measuring cup" }),
  B(1, "tres cucharadas de bicarbonato", "b_sodaspoon", `${G} holding a level tablespoon of white baking soda over ${SODA} on a hotel room table.`),
  B(1, "una gota de detergente", "b_onedrop", `Close view of a single drop of dish soap falling from a small plain bottle into the funnel of a clear spray bottle.`, { anim: "one drop of soap falls slowly" }),
  CL(1, "Le muestro cómo ponerla", "c_showhow", `He holds up ${SPRAY} filled with cloudy liquid next to ${MATT} in ${ROOM}, explaining to the camera.`),
  CL(1, "sin mojar el colchón", "c_mist", `He mists a light spray from ${SPRAY} onto a yellow stain on ${MATT}, holding the bottle well above it.`, { anim: "he sprays a light mist on the stain" }),
  B(1, "Y cómo dejarlo seco", "b_drybed", `A clean dry white mattress on a hotel bed in bright daylight, an electric fan on a chair beside it.`),
  ST(1, "en un par de horas", "st_fan", "electric fan", `An electric fan turning in a bedroom.`),
  B(1, "Mire esta mancha", "b_stainold", `Top view of a bare white mattress with a large old yellow stain, the sheets piled at the foot of the bed.`),
  B(1, "Amarilla, de años", "b_stainedge", `Extreme close view of the edge of an old yellow stain on white quilted mattress fabric, the stitching visible.`),
  CL(1, "Y mírela ahora", "c_proudmatt", `He stands next to ${MATT} in ${ROOM}, the mattress clean white and dry, pointing at it with a satisfied smile.`),
  B(1, "Seca, y sin el amarillo", "b_cleanclose", `Close view of clean dry white quilted mattress fabric in daylight, the stitching crisp.`),
  // ── 0:31 · LA FALLA EXACTA
  B(2, "", "b_womansheets", `A middle-aged woman in house clothes pulling the sheets off a bed in ${HOMEBED} and frowning at a yellow stain on the mattress.`),
  ST(2, "Agarró un balde", "st_bucket", "bucket water", `A plastic bucket being filled with water.`),
  B(2, "un trapo, el jabón", "b_ragsoap", `A wet rag and a bar of soap next to a bucket of soapy water on a bedroom floor.`),
  B(2, "Frotó fuerte", "b_scrubhard", `A woman in house clothes scrubbing a yellow stain on a bare mattress hard with a dripping wet rag in ${HOMEBED}.`, { anim: "she scrubs the mattress hard" }),
  B(2, "para que salga bien", "b_wetrag", `A dripping wet rag held over a bare white mattress, water falling from it onto a yellow stain.`, { anim: "water drips from the rag" }),
  B(2, "con mucha agua", "b_pourwater", `A hand pouring soapy water from a bucket straight onto a bare white mattress, the water spreading.`),
  B(2, "Y el colchón quedó empapado", "b_soaked", `A bare white mattress with a large dark wet patch soaked deep into it, water pooled on the surface.`),
  ST(2, "Pasó la noche en el sillón", "st_couch", "sleeping on couch", `A person asleep on a living room couch under a blanket at night.`),
  B(2, "el colchón todavía estaba húmedo", "b_dampcheck", `A woman's hand pressing on a bare mattress that still has a wide damp gray ring on it, morning light.`),
  B(2, "Y a los dos días", "b_twodays", `A bare mattress with a gray damp ring on it and an electric fan blowing at it, morning light through a window.`),
  B(2, "y olía raro", "b_smell", `A middle-aged woman in house clothes wrinkling her nose next to a bare damp mattress in ${HOMEBED}.`),
  // ── 0:47 · NO FUE CULPA SUYA
  S(3, "", "av", ""),
  B(3, "Todo el mundo piensa lo mismo", "b_neighbors", `Two middle-aged women talking in a bedroom doorway, one holding a bucket and a rag, looking at a bare mattress.`),
  B(3, "si está sucio", "b_laundry", `A home washing machine with its door open and a pile of laundry in a basket next to it.`),
  B(3, "más agua y más fuerza", "b_morewater", `A hand turning a tap fully open over a bucket, water gushing into it.`),
  ST(3, "Así se lava la ropa", "st_laundry", "hand washing laundry", `Clothes being washed by hand in a basin of soapy water.`),
  CL(3, "Pero un colchón no es una remera", "c_tshirt", `He holds up a folded white T-shirt in one gloved hand and points at ${MATT} with the other in ${ROOM}.`),
  B(3, "No se escurre", "b_wring", `Two hands wringing out a wet towel over a bucket, water streaming out.`),
  B(3, "No entra en el lavarropas", "b_washer", `A queen-size mattress leaning against a small home washing machine that is far too small for it.`),
  B(3, "Y no se seca colgado", "b_clothesline", `White sheets hanging on an outdoor clothesline in the sun, a mattress leaning against the wall below them.`),
  // ── 1:01 · EL CULPABLE
  CL(4, "El error es empaparlo", "c_nobucket", `He holds up one gloved hand in a firm stop gesture over a bucket of soapy water next to ${MATT} in ${ROOM}.`),
  C(4, "tarda días en secarse", "ClMattressLayers3D", { mode: "soaked", inner: "Días en secarse" }),
  B(4, "más adentro manda la mancha", "b_sidecut", `Cutaway view of the edge of a mattress showing white foam layers inside, a yellow stain soaked down into them.`),
  // ── 1:11 · LOS 3 LOOPS
  B(5, "nunca se cierra apretado", "b_sprayloose", `Close view of ${G} loosening the trigger cap of a clear spray bottle filled with cloudy liquid.`),
  B(5, "Qué es el polvito blanco", "b_powder", `Close view of a thin layer of white powder dried on a white quilted mattress where a stain was.`),
  B(5, "ni a la tercera vuelta", "b_stillyellow", `A faint yellow stain still visible on a white mattress next to a clear spray bottle and a folded towel.`),
  ST(5, "la mejor compra que va a hacer para ese cuarto", "st_bedmaking", "making bed", `A person putting a fitted cover on a mattress.`),
  // ── 1:28 · INTRO
  CL(6, "", "c_intro", `He stands in ${HALL} next to a housekeeping cart with folded sheets, gloves on, nodding hello toward the camera.`),
  ST(6, "Treinta años trabajé", "st_hotelfacade", "hotel building", `The exterior of a mid-range hotel building with rows of windows.`),
  ST(6, "Ciento ochenta camas", "st_hotelroom", "hotel room bed", `A neatly made bed in a hotel room.`),
  CL(6, "me llamaban a mí", "c_answercall", `He walks fast down ${HALL} holding a spray bottle, looking at a room number on a door.`, { anim: "he walks down the corridor" }),
  // ── 1:41 · CTA 1 (frase fija) — libro + QR
  S(7, "", "av", ""),
  CL(7, "me prometí escribir", "c_writing", `He sits at a small table in the hotel staff room writing in a spiral notebook with a pencil, reading glasses on, gloves off on the table.`, { anim: "he writes slowly in the notebook" }),
  B(7, "Cada arreglo con su medida", "b_handpages", `Close view of handwritten notebook pages with small measurements and times written in pencil, a brown peroxide bottle beside it.`),
  S(7, "Un libro", "av", ""),
  C(7, "Noventa y cuatro arreglos", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "94 ARREGLOS · PÁGINA 17", text: "el link está abajo" }),
  S(7, "Volvemos al colchón", "av", ""),
  // ── 2:07 · el gerente y Rosa
  B(8, "", "b_manager", `${MANAGER} writing in his small black notebook in ${HALL}.`),
  B(8, "colchón manchado", "b_notebook", `Close view of a small black notebook page with handwritten room numbers in a list, a pen resting on it.`),
  B(8, "una habitación que no se podía dar", "b_closeddoor", `A closed hotel room door with a small paper sign hanging from the handle in ${HALL}.`),
  ST(8, "plata que no entraba", "st_reception", "hotel reception", `A hotel reception desk with a bell and a guest book.`),
  B(9, "", "b_rosasheets", `${ROSA} pulling the sheets off a hotel bed and looking at a yellow stain on the bare mattress.`),
  ST(9, "Ella sacaba las sábanas", "st_sheets", "changing bed sheets", `A housekeeper stripping white sheets off a hotel bed.`),
  B(9, "me buscaba por el pasillo", "b_rosahall", `${ROSA} walking quickly down ${HALL} with an armful of white sheets, looking back over her shoulder.`),
  CL(9, "Otra vez", "c_sigh", `He sighs with a half smile in ${HALL}, a spray bottle in his gloved hand, in front of a room door.`),
  // ── 2:30 · callbacks
  C(10, "", "ClVideoRef", { thumb: I + "th_clmezcla.jpg", title: "Nunca mezclar", tag: "la única que sí" }),
  CL(10, "Agua oxigenada con bicarbonato", "c_twothings", `He holds ${BROWN} in one gloved hand and ${SODA} in the other in ${ROOM}, smiling at the camera.`),
  S(10, "Y hoy le muestro la regla", "av", ""),
  C(11, "", "ClVideoRef", { thumb: I + "th_cldescarga.jpg", title: "El inodoro", tag: "ya en el canal" }),
  ST(11, "Vamos al dormitorio", "st_bedroom", "bedroom morning", `A simple bedroom in morning light.`),
];
