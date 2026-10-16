// DIRECTOR C — clmampara: el 2º secreto (la prueba del vidrio mojado) + el 3er secreto (20 s de secador) + problemas + preguntas +
// errores + la cuenta + recap + CTA 3 + cierre con pregunta y callback a clsarro (párr. 56-89).
import { S } from "../claudio/lib.mjs";
import { C, B, CL, ST, G, BROWN, VINEGAR, SOAP, SPRAY, HOMESHOWER, HOTELSHOWER, CLOUDY, CLEARG, ROSA, MANAGER, HALL, I } from "./dir_a.mjs";
export const SHOTS = [
  // ── 2º secreto: la prueba del vidrio mojado
  C(56, "", "ClChapter", { n: 2, label: "SECRETO", title: "El vidrio mojado", sub: "¿tiene arreglo?" }),
  CL(57, "", "c_wetcheck", `He sprays a glass shower screen with the handheld shower in ${HOTELSHOWER} and looks at it closely.`),
  ST(57, "Mójela con la ducha", "b_showerglass", "shower water glass door", `Water from a shower running down a glass door.`),
  C(58, "", "ClWetTest", { hi: 0 }),
  C(58, "cuando se seca vuelve a estar opaca", "ClWetTest", { hi: 1 }),
  B(59, "", "b_etched", `Close view of a dry glass shower screen permanently etched, a milky dull surface even though it is clean.`),
  ST(59, "comido por los años", "b_oldbath", "old bathroom", `An old worn bathroom.`),
  CL(60, "", "c_honest2", `He talks to the camera in ${HOTELSHOWER} with an honest expression, one hand on the glass shower screen.`),
  ST(60, "no gaste más plata en productos", "b_products", "cleaning products bottles shelf", `Many cleaning product bottles on a shelf, plain labels.`),
  // ── 3er secreto: el secador
  C(61, "", "ClChapter", { n: 3, label: "SECRETO", title: "Veinte segundos", sub: "y la piedra no vuelve" }),
  ST(62, "", "b_hangsqueegee", "squeegee hanging shower", `A rubber squeegee hanging inside a shower.`),
  C(62, "una pasada por el vidrio", "ClSqueegee", {}),
  ST(63, "", "b_dryglass", "clean dry glass shower", `A clean dry glass shower screen.`),
  ST(63, "Así de simple", "b_dropsgone", "squeegee glass water", `A squeegee clearing water from glass.`),
  CL(64, "", "c_hangall", `He hangs a rubber squeegee on a hook inside a glass shower in ${HOTELSHOWER}.`),
  ST(64, "los huéspedes lo usaban", "b_guestsqueegee", "person using squeegee shower", `A person using a squeegee on a shower door, no face.`),
  // ── problemas
  C(65, "", "ClChapter", { n: 6, label: "LA VIDA REAL", title: "Lo que me cuentan", sub: "y qué hacer" }),
  ST(66, "", "b_smellnose", "bad smell bathroom", `A person reacting to a smell in a bathroom, face not visible.`),
  ST(66, "se va en una hora", "b_windowopen", "open window fresh air", `An open window, curtains moving.`),
  ST(67, "", "b_curtain", "shower curtain plastic", `A plastic shower curtain.`),
  ST(67, "al lavarropas", "b_washer", "washing machine loading", `Loading a washing machine.`),
  ST(67, "Lo negro de abajo, el frasco marrón", "b_curtainmold", "mold shower curtain", `Black mold at the bottom of a shower curtain.`),
  ST(68, "", "b_frosted", "frosted glass shower", `A frosted glass shower door.`),
  ST(68, "el vinagre le saca la piedra igual", "b_frostedclean", "frosted glass", `Frosted glass close view.`),
  ST(69, "", "b_frame", "shower door metal frame", `The metal frame of a glass shower door.`),
  ST(69, "Si es dorado o negro", "b_blackframe", "black shower frame", `A black metal shower frame.`),
  C(69, "cinco minutos, no más", "ClTimer30", { minutes: 5, label: "Dorado o negro", fast: true }),
  ST(70, "", "b_whitedots", "water spots glass", `Small white spots on glass.`),
  ST(70, "Rocíe sólo ahí", "b_spotspray", "spray bottle glass", `Spraying a single spot on glass.`),
  // ── preguntas
  CL(71, "", "c_qa", `He sits on a stool in ${HOTELSHOWER}, elbows on knees, talking to the camera with a friendly smile.`),
  C(72, "", "ClNeverMix", { a: "Cloro", b: "Vinagre", verdict: "Gas" }),
  C(72, "Está en la tabla de la página siete", "ClBookPage", { page: I + "book_p7.jpg", pageNo: 7, stamp: "Primera fila" }),
  ST(73, "", "b_finesteelwool", "steel wool", `Fine steel wool.`),
  ST(74, "", "b_calendar2", "calendar months", `A wall calendar.`),
  C(74, "una vez cada dos o tres meses", "ClTwoDays", { d1: ["CON SECADOR", "Cada 2-3 meses", "el vinagre", "#3E6E8E"], d2: ["SIN SECADOR", "Una vez por mes", "el vinagre", "#8B5A2B"], stamp: "Seque todos los días" }),
  // ── errores
  C(75, "", "ClChapter", { n: 5, label: "EN EL HOTEL", title: "Los errores", sub: "que vi con las mamparas" }),
  ST(76, "", "b_brownspray", "spraying bottle bathroom", `Spraying a bottle in a bathroom.`),
  ST(77, "", "b_greenscrub", "scrubbing sponge glass", `Scrubbing glass with the green side of a sponge.`),
  ST(77, "en la raya se agarra la piedra nueva", "b_scratchmacro", "scratched glass macro", `Extreme close view of fine scratches on glass.`),
  C(78, "", "ClDoDont", { yes: { label: "Un día cada uno", img: I + "b_vinegar2.jpg" }, no: { label: "Juntos", img: I + "b_brownshelf.jpg" } }),
  ST(79, "", "b_marblestain", "marble surface", `A white marble surface with a dull spot.`),
  ST(80, "", "b_dirtyglass", "dirty glass shower door", `A dirty glass shower door with water spots.`),
  // ── la cuenta
  C(81, "", "ClReceipt", { lines: [["Limpiadores especiales", "uno tras otro"], ["Vinagre", "2 tazas"], ["Detergente", "1 cucharada"], ["Secador de goma", "uno"]] }),
  ST(81, "En esta casa no hay villanos, hay aritmética", "b_calc", "calculator receipt glasses table", `A calculator, a paper receipt and reading glasses on a kitchen table.`),
  ST(81, "uno detrás del otro", "b_bottlesrow", "cleaning bottles row", `A row of cleaning spray bottles.`),
  CL(82, "", "c_managersmile", `${MANAGER} closes his notebook and nods with a small smile next to him in ${HALL}.`),
  C(82, "casi no volvió a anotar", "ClNotebook", { title: "La libreta del gerente", rows: [{ k: "Enero", v: "mampara sucia" }, { k: "Febrero", v: "—" }, { k: "Marzo", v: "—" }], strike: true, note: "secador en cada ducha" }),
  ST(83, "", "b_oldlady", "senior woman hotel", `An older woman guest in a hotel corridor, seen from behind.`),
  B(83, "Eran las mismas", "b_sameclear", `${CLEARG} in ${HOTELSHOWER}, sunlight on it.`),
  // ── recap
  C(84, "", "ClCheck", { title: "Todo en 30 segundos", items: ["2 tazas de vinagre tibio", "+ 1 cucharada de detergente", "Rocíe todo, 15 min, mojado", "Esponja blanda, enjuague", "Secador y toalla", "Otro día: rieles, 10 min"] }),
  ST(84, "Esponja blanda, enjuague", "b_recapsponge", "sponge glass shower", `A sponge on glass.`),
  ST(84, "secador de goma y toalla", "b_recapsqueegee", "squeegee glass door", `A squeegee on a glass door.`),
  ST(84, "veinte segundos de secador", "b_recapclear", "clear glass shower bathroom", `A clear glass shower in a bright bathroom.`),
  // ── CTA 3
  CL(85, "", "c_bookshow2", `He holds a thick printed spiral-bound book with a plain brown cover open to a page in ${HOTELSHOWER}, pointing at a line with his gloved finger.`),
  C(85, "La mampara en la página dieciocho", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "94 ARREGLOS · PÁGINAS 7 Y 18", text: "el link está abajo" }),
  // ── cierre
  CL(86, "", "c_wipepiece", `He wipes one strip of a glass shower screen with a cloth in ${HOTELSHOWER} and looks at it.`),
  ST(86, "Y mire la diferencia mañana", "b_morning", "bathroom morning sunlight", `A bathroom in morning sunlight.`),
  CL(87, "", "c_phonecomments", `He sits on a bench in a hotel staff room reading comments on his phone with reading glasses, smiling.`),
  ST(87, "¿está blanca de piedra, o negra en los rieles?", "b_twoproblems", "shower door bathroom", `A glass shower door in a bathroom.`),
  C(88, "", "ClVideoRef", { thumb: I + "th_clsarro.jpg", title: "El sarro del inodoro", tag: "ya en el canal", next: true }),
  ST(88, "Es la misma piedra, en otro lugar", "b_toiletscale", "limescale toilet", `Limescale in a toilet bowl.`),
  CL(89, "", "c_wave", `He hangs a rubber squeegee on a hook inside a glass shower in ${HOTELSHOWER} and gives the camera a small nod goodbye.`),
  ST(89, "quiera frotar la mampara con fuerza", "b_scrubforce", "scrubbing glass hard", `Someone scrubbing glass hard.`),
];
