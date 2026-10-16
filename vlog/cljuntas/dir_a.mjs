// DIRECTOR A — cljuntas: MINUTO 1 (juntas grises / la que limpió, blanca → PROMESA pasta + 15 min con el antes/después → la falla
// (lavandina y rodillas) → "no fue culpa suya" (la junta es porosa) → el culpable (lo que entra) → 3 loops) + INTRO + CTA 1 + gerente
// y Rosa + callback a clmoho + QUÉ ES + la historia del presupuesto de los 20 baños (párr. 0-21).
import { S, BI, CLP } from "../claudio/lib.mjs";
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const CL = (p, at, name, scene, o = {}) => S(p, at, "cl", name, { p: CLP(scene), ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: BI(scene), ...o });
export const G = "a hand in a blue nitrile glove";
export const BROWN = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
export const SODA = "a plain white box of baking soda with a blank label";
export const SOAP = "a clear bottle of green dish soap with a plain blank label";
export const FLOOR = "a hotel bathroom floor of square beige ceramic tiles";
export const DIRTYG = "square beige floor tiles whose grout lines are dark gray, almost black, with dirt";
export const CLEANG = "square beige floor tiles whose grout lines are bright clean white";
export const HOTELBATH = "a mid-range hotel guest bathroom with beige-cream ceramic wall tiles and a beige tiled floor";
export const ROSA = "Rosa, a hotel housekeeper in her fifties with dark hair in a bun and a light-blue housekeeping uniform";
export const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie, holding a small black notebook";
export const HALL = "a carpeted hotel corridor with numbered room doors and warm ceiling lights";
export const I = "img/cljuntas/";
export const SHOTS = [
  // ── 0:00 · Claudio a cámara, de rodillas
  S(0, "", "av", ""),
  CL(0, "Ahora mire ésta", "c_pointclean", `He kneels on ${FLOOR} and points with a gloved finger at one grout line that is bright white while the others around it are dark gray.`),
  B(0, "Blanca", "b_onewhite", `Close view of one bright white clean grout line between beige floor tiles, the grout lines next to it dark gray.`),
  ST(0, "Como el día que pusieron el piso", "b_newfloor", "new tile floor bathroom", `A brand new tiled bathroom floor.`),
  C(1, "", "ClBeforeAfter", { before: I + "b_ba_before.jpg", after: I + "b_ba_after.jpg", note: "½ taza bicarbonato + ¼ taza agua oxigenada" }),
  ST(1, "media taza", "b_soda", "baking soda bowl", `Baking soda in a bowl.`),
  ST(1, "un cuarto de taza", "b_pourperox", "pouring liquid measuring cup", `Pouring a clear liquid into a small measuring cup.`),
  ST(1, "de agua oxigenada", "b_peroxbottle", "brown medicine bottle", `${BROWN}.`),
  ST(1, "una cucharadita de detergente", "b_soapspoon", "dish soap spoon", `A teaspoon of dish soap.`),
  C(1, "y quince minutos", "ClTimer30", { minutes: 15, label: "En la junta", fast: true }),
  B(1, "Mire la junta antes", "b_before", `Extreme close view of ${DIRTYG}.`),
  B(1, "Y mírela después", "b_after", `Extreme close view of ${CLEANG}.`),
  S(1, "Blanca otra vez", "av", ""),
  ST(2, "con lavandina", "b_mopbleach", "mopping floor bucket", `Mopping a tiled floor with a bucket.`),
  ST(2, "frotó con el cepillo", "b_scrubknees", "scrubbing floor brush", `Someone scrubbing a tiled floor with a brush.`),
  ST(2, "de rodillas", "b_kneescrub", "kneeling cleaning floor", `Someone kneeling to clean a floor, face not visible.`),
  ST(2, "media hora", "b_tired", "tired cleaning floor", `A tired person resting after cleaning the floor, face not visible.`),
  B(2, "Y cuando se secó el piso", "b_graygrout", `Close view of ${DIRTYG} on a bathroom floor.`),
  B(2, "las juntas seguían igual de grises", "b_stillgray", `${DIRTYG}, the floor dry.`),
  CL(3, "", "c_reassure", `He kneels on ${FLOOR} in ${HOTELBATH} and talks to the camera with a calm open hand.`),
  ST(3, "Nadie le dijo", "b_floorlook", "tile floor closeup", `A tiled floor, close view.`),
  ST(3, "no es lisa como el azulejo", "b_tilesmooth", "ceramic tile closeup", `Close view of a smooth glossy ceramic tile.`),
  C(3, "Es arena y cemento, llena de agujeritos", "ClGroutPores", { phase: "dirt" }),
  ST(3, "Y la mugre no está encima", "b_dirtsurface", "dirty floor closeup", `A dirty floor, close view.`),
  S(3, "Está adentro", "av", ""),
  ST(4, "tierra", "b_dirtshoes", "dirty shoes floor", `Dirty shoes on a tiled floor.`),
  ST(4, "jabón", "b_soapscum", "soap scum bathroom", `Soap residue in a bathroom.`),
  ST(4, "y a veces moho", "b_moldtile", "mold bathroom tiles", `Mold on bathroom tiles.`),
  ST(4, "Por eso la junta se ve gastada", "b_oldgrout", "dirty grout tiles", `Dirty grout between tiles.`),
  ST(4, "Pero casi siempre", "b_fineunder", "clean tile floor", `A clean tiled floor.`),
  B(4, "Está sucia, no gastada", "b_scrapewhite", `Extreme close view of a screwdriver tip scraping a dark gray grout line, revealing hard clean white grout underneath.`),
  CL(5, "", "c_threefingers", `He holds up three gloved fingers to the camera, kneeling on ${FLOOR}.`),
  ST(5, "Por qué la pasta se hace justo antes de usarla", "b_bowlpaste", "mixing paste bowl spoon", `Mixing a white paste in a bowl with a spoon.`),
  ST(5, "El error del trapeado", "b_mop", "mop wet floor", `A wet mop on a tiled floor.`),
  ST(5, "lo que hay que hacer a los dos días", "b_calendar", "calendar page days", `A paper calendar.`),
  // ── intro
  C(6, "", "ClHallway3D", { total: 180, floor: 1, title: "baños", sub: "kilómetros de juntas" }),
  ST(6, "Ciento ochenta baños", "b_hotelbaths", "hotel bathroom tiles", `A hotel bathroom with tiled walls and floor.`),
  // ── CTA 1
  CL(7, "", "c_bookhold", `He holds a thick printed spiral-bound book with a plain brown cover in ${HOTELBATH}, tapping its cover.`),
  ST(7, "me prometí escribir todo lo que aprendí", "b_notebookdesk", "old notebook handwritten notes desk", `An old worn notebook with handwritten notes open on a small desk.`),
  S(7, "Y lo escribí", "av", ""),
  C(7, "Un libro", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "94 ARREGLOS · PÁGINAS 7 Y 19", text: "el link está abajo" }),
  C(7, "Las juntas están en la página diecinueve", "ClBookPage", { page: I + "book_p19.jpg", pageNo: 19, stamp: "Las juntas" }),
  C(7, "y la tabla de lo que nunca se mezcla", "ClBookPage", { page: I + "book_p7.jpg", pageNo: 7, stamp: "Página 7" }),
  // ── el gerente y Rosa
  CL(8, "", "c_manager", `${MANAGER} reads from his notebook next to him in ${HALL}; he listens, holding a grout brush.`),
  C(8, "juntas del baño, rehacer", "ClNotebook", { title: "La libreta del gerente", rows: [{ k: "Hab. 108", v: "juntas del baño, rehacer" }, { k: "Hab. 112", v: "juntas del baño, rehacer" }], note: "picar y rellenar" }),
  ST(8, "picar, rellenar", "b_regrout", "grout repair tool tiles", `A worker removing old grout with a tool.`),
  CL(9, "", "c_rosascrub", `${ROSA} kneels scrubbing the grout of a bathroom floor with a brush while he stands at the door of ${HOTELBATH}.`),
  ST(9, "ya no salen, están gastadas", "b_grayclose", "gray grout closeup", `Gray grout lines close view.`),
  C(10, "", "ClVideoRef", { thumb: I + "th_clmoho.jpg", title: "El moho de la ducha", tag: "ya en el canal" }),
  ST(10, "los puntitos negros de las juntas de la pared", "b_moldwall", "black mold shower grout", `Black mold dots in shower wall grout.`),
  ST(10, "la tierra de los zapatos", "b_shoesfloor", "walking shoes tile floor", `Feet in shoes walking on a tiled floor.`),
  // ── qué es
  C(11, "", "ClChapter", { n: 1, label: "PRIMERO", title: "Qué es ese gris", sub: "y con qué sale" }),
  ST(11, "Porque si sabe qué es", "b_tilesfloor", "tile floor top view", `A tiled floor seen from above.`),
  ST(12, "", "b_groutline", "tile grout lines closeup", `Close view of grout lines between tiles.`),
  ST(12, "Arena y cemento", "b_cement", "cement sand texture", `Close view of cement and sand texture.`),
  C(12, "llena de agujeritos, como una esponja dura", "ClGroutPores", { phase: "dirt" }),
  ST(13, "", "b_dirtyfloor", "dirty tile floor", `A dirty tiled floor.`),
  ST(13, "El jabón del trapeado", "b_soapybucket", "soapy water bucket mop", `A bucket of soapy water with a mop.`),
  ST(13, "La grasa de la cocina", "b_kitchenfloor", "kitchen tile floor", `A kitchen tiled floor.`),
  ST(13, "el moho, que vive donde hay humedad", "b_moldcorner", "mold bathroom corner", `Mold in a damp bathroom corner.`),
  ST(14, "", "b_floorwash", "mopping floor", `Mopping a tiled floor.`),
  B(14, "a la semana la junta vuelve a estar gris", "b_grayagain", `${DIRTYG}, a week after cleaning.`),
  CL(15, "", "c_vinegarno", `He holds up a bottle of white vinegar with a plain label and shakes his head, kneeling on ${FLOOR}.`),
  ST(15, "En las juntas sin sellar, no", "b_vinegar", "white vinegar bottle", `A bottle of white vinegar, plain label.`),
  ST(15, "el ácido se come el cemento de a poco", "b_erode", "eroded grout tiles", `Eroded old grout between tiles.`),
  C(16, "", "ClDoDont", { yes: { label: "Pasta con espuma", img: I + "b_bowlpaste.jpg" }, no: { label: "Ácido y fuerza", img: I + "b_vinegar.jpg" } }),
  // ── la historia
  CL(17, "", "c_budget", `${MANAGER} shows him a typed quote on a sheet of paper in ${HALL}; he reads it, frowning.`),
  ST(17, "Veinte baños", "b_corridor", "hotel corridor doors", `A long hotel corridor with many doors.`),
  ST(17, "Era mucha plata", "b_quote", "invoice paper calculator", `A paper quote and a calculator on a desk.`),
  CL(18, "", "c_kneelscrape", `He kneels in the corner of ${HOTELBATH} scraping a gray grout line with a flat screwdriver, looking closely.`),
  B(18, "Abajo del gris, la pastina estaba entera", "b_scrapewhite2", `Extreme close view of a scraped spot in a dark gray grout line showing hard white grout underneath.`),
  ST(19, "", "b_mixbowl", "mixing bowl spoon", `Mixing in a bowl with a spoon.`),
  CL(19, "por un metro de piso", "c_pastefloor", `He brushes a white paste along the grout lines of one square meter of ${FLOOR}, kneeling.`, { anim: "he brushes the paste along the grout" }),
  B(20, "", "b_onemeter", `A bathroom floor where one square meter of grout lines is bright white and all the rest is dark gray.`),
  CL(20, "Llamé al gerente", "c_managerfloor", `${MANAGER} looks down at a bathroom floor with one clean white square of grout in ${HOTELBATH}, notebook in hand, while he kneels.`),
  C(20, "tachó \"rehacer\"", "ClNotebook", { title: "La libreta del gerente", rows: [{ k: "Hab. 108", v: "juntas del baño, rehacer" }], strike: true, note: "estaban sucias" }),
  CL(21, "", "c_rosalook", `${ROSA} stares down at a clean white grout line in ${HOTELBATH} while he stands beside her, smiling kindly.`),
  ST(21, "donde el trapo no llega", "b_rag", "cleaning rag floor", `A cleaning rag on a tiled floor.`),
];
