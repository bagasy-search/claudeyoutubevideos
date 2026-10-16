// DIRECTOR C — cljuntas: el 2º secreto (el trapeado) + el 3er secreto (sellar a los 2 días) + problemas + preguntas + errores +
// la cuenta + recap + CTA 3 + cierre con pregunta y callback a clmoho (párr. 50-82).
import { S } from "../claudio/lib.mjs";
import { C, B, CL, ST, G, BROWN, SODA, SOAP, FLOOR, DIRTYG, CLEANG, HOTELBATH, ROSA, MANAGER, HALL, I } from "./dir_a.mjs";
export const SHOTS = [
  // ── 2º secreto: el trapeado
  C(50, "", "ClChapter", { n: 2, label: "SECRETO", title: "El trapeado", sub: "el error que la vuelve gris" }),
  ST(51, "", "b_mopsoap", "mopping floor soapy water", `Mopping a tiled floor with soapy water.`),
  ST(51, "con agua y un buen chorro de jabón", "b_soapbucket", "pouring soap into bucket", `Pouring soap into a bucket of water.`),
  C(52, "", "ClMopFilm", { hi: 0 }),
  ST(52, "Ahí se pega la tierra", "b_footprints", "footprints dirty floor", `Dirty footprints on a tiled floor.`),
  C(53, "Trapee con agua sola", "ClMopFilm", { hi: 1 }),
  ST(53, "otra pasada con agua sola", "b_mopclean", "mopping clean floor", `Mopping a clean tiled floor.`),
  CL(54, "", "c_rosamop", `${ROSA} mops a hotel bathroom floor with a bucket of clear water while he watches from the door, nodding.`),
  B(54, "las juntas seguían blancas", "b_white2months", `${CLEANG} in ${HOTELBATH}, morning light.`),
  // ── 3er secreto: sellar
  C(55, "", "ClChapter", { n: 3, label: "SECRETO", title: "Los dos días", sub: "y después, sellador" }),
  ST(55, "Lo de los dos días", "b_calendar2", "wall calendar", `A wall calendar.`),
  ST(56, "póngale sellador de juntas", "b_sealer", "grout sealer bottle", `A bottle of grout sealer, plain label.`),
  C(57, "", "ClTwoDays", { d1: ["HOY", "Limpia y mojada", "deje secar", "#3E6E8E"], d2: ["A LOS 2 DÍAS", "Seca por dentro", "ahora, sellador", "#2F8F48"], stamp: "Nunca húmeda" }),
  ST(57, "encierra el agua adentro", "b_wetgrout", "wet grout closeup", `Wet grout close view.`),
  CL(58, "", "c_seal", `He paints clear sealer along a white grout line with a small brush, kneeling on ${FLOOR}.`, { anim: "he paints the sealer along the line" }),
  ST(58, "se limpia enseguida con un trapo", "b_wipetile", "wiping tile cloth", `Wiping a tile with a cloth.`),
  ST(59, "", "b_yearcal", "calendar year", `A yearly calendar on a wall.`),
  ST(59, "Se limpia con el trapo, sin cepillo", "b_easywipe", "wiping floor cloth", `Wiping a tiled floor with a cloth.`),
  // ── problemas
  C(60, "", "ClChapter", { n: 6, label: "LA VIDA REAL", title: "Lo que me cuentan", sub: "y qué hacer" }),
  ST(61, "", "b_showergrout", "shower wall tiles mold", `Mold on shower wall grout.`),
  C(61, "Está en el video del moho", "ClVideoRef", { thumb: I + "th_clmoho.jpg", title: "El moho de la ducha", tag: "ya en el canal" }),
  ST(62, "", "b_kitchentiles", "kitchen backsplash tiles", `Kitchen backsplash tiles near a stove.`),
  ST(62, "La grasa sale con jabón", "b_soapsponge", "dish soap sponge", `A sponge with dish soap.`),
  ST(63, "", "b_colorgrout", "colored grout tiles", `Tiles with colored grout.`),
  ST(63, "Pruebe primero en un rincón escondido", "b_corner", "floor corner tiles", `A corner of a tiled floor.`),
  ST(64, "No me puedo arrodillar", "b_kneestool", "senior man sitting on small stool", `An older man sitting on a small stool.`),
  ST(64, "cepillos de juntas con mango largo", "b_longbrush", "long handle floor brush", `A long-handled floor scrub brush.`),
  // ── preguntas
  CL(65, "", "c_qa", `He sits on the edge of a bathtub in ${HOTELBATH}, elbows on knees, talking to the camera with a friendly smile.`),
  ST(66, "", "b_steam", "steam cleaner floor", `A steam cleaner on a tiled floor.`),
  C(67, "", "ClNeverMix", { a: "Lavandina", b: "Agua oxigenada", verdict: "Nunca" }),
  C(67, "Está en la tabla de la página siete", "ClBookPage", { page: I + "book_p7.jpg", pageNo: 7, stamp: "Primera fila" }),
  S(68, "y selló las juntas", "av", ""),
  // ── errores
  C(69, "", "ClChapter", { n: 5, label: "EN EL HOTEL", title: "Los errores", sub: "que vi con las juntas" }),
  ST(70, "", "b_vinegarpour", "pouring vinegar", `Pouring white vinegar.`),
  ST(71, "", "b_wirebrush2", "wire brush closeup", `A wire brush close view.`),
  S(72, "", "av", ""),
  ST(74, "", "b_wetgrout2", "wet tiles floor", `A wet tiled floor.`),
  // ── la cuenta
  C(75, "", "ClReceipt", { lines: [["Rehacer las juntas", "picar y rellenar"], ["Días sin baño", "varios"], ["Bicarbonato", "½ taza"], ["Agua oxigenada", "¼ taza"], ["Detergente", "1 cucharadita"]] }),
  ST(75, "En esta casa no hay villanos, hay aritmética", "b_calc", "calculator receipt glasses table", `A calculator, a receipt and reading glasses on a table.`),
  CL(76, "", "c_managersmile", `${MANAGER} closes his notebook and nods with a small smile next to him in ${HALL}.`),
  C(76, "Los otros dieciocho estaban sucios", "ClNotebook", { title: "La libreta del gerente", rows: [{ k: "Rehacer", v: "2 baños" }, { k: "Limpiar", v: "18 baños" }], note: "sucias, no gastadas" }),
  // ── recap
  C(77, "", "ClCheck", { title: "Todo en 30 segundos", items: ["½ taza bicarbonato + ¼ taza agua oxigenada", "+ 1 cucharadita de detergente", "En el bol, en el momento", "10 a 15 min, frote, agua limpia", "Seque. A los 2 días, sellador", "Trapee con agua sola"] }),
  S(77, "Con el cepillo por las juntas", "av", ""),
  ST(77, "Deje secar", "b_dryfloor", "clean dry tile floor", `A clean dry tiled floor.`),
  // ── CTA 3
  CL(78, "", "c_bookshow2", `He holds a thick printed spiral-bound book with a plain brown cover open to a page in ${HOTELBATH}, pointing at a line with his gloved finger.`),
  C(78, "Las juntas en la página diecinueve", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "94 ARREGLOS · PÁGINAS 7 Y 19", text: "el link está abajo" }),
  // ── cierre
  CL(79, "", "c_onemeter", `He marks one square meter of a bathroom floor with his gloved hands, kneeling, looking at the camera.`),
  ST(79, "Y mire la diferencia cuando se seque", "b_drydiff", "clean tile floor", `A clean tiled floor.`),
  CL(80, "", "c_phonecomments", `He sits on a bench in a hotel staff room reading comments on his phone with reading glasses, smiling.`),
  ST(80, "del piso del baño, de la cocina", "b_floors", "tile floors", `Tiled floors.`),
  C(81, "", "ClVideoRef", { thumb: I + "th_clmoho.jpg", title: "El moho de la ducha", tag: "ya en el canal", next: true }),
  CL(82, "", "c_wave", `He stands up from a clean tiled floor in ${HOTELBATH}, brush in hand, and gives the camera a small nod goodbye.`),
  ST(82, "hay que rehacer las juntas", "b_tilesend", "clean bathroom tiles", `A clean tiled bathroom.`),
];
