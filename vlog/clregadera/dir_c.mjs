// DIRECTOR C — clregadera: el 3er secreto (la dorada: media hora) + de yapa las llaves del lavabo (aireador y base) + otro día lo gris
// (frasco marrón) + problemas + preguntas + errores + la cuenta + recap + CTA 3 + cierre con pregunta y callback (párr. 54-89).
import { S } from "../claudio/lib.mjs";
import { C, B, CL, ST, G, BROWN, VINEGAR, HEAD, CLOGGED, BAG, HOTELSHOWER, HOMESHOWER, ROSA, MANAGER, HALL, I } from "./dir_a.mjs";
export const SHOTS = [
  // ── el 3er secreto: la dorada
  C(54, "", "ClChapter", { n: 3, label: "SECRETO", title: "La regadera dorada", sub: "no pasa la noche" }),
  ST(54, "La regadera que no pasa la noche", "b_threefinishes", "shower heads store", `Ordinary real footage that shows shower heads store.`),
  ST(55, "", "b_goldhead2", "gold shower head tiles", `Ordinary real footage that shows gold shower head tiles.`),
  ST(55, "la negra mate", "b_blackmatte2", "black shower head marble", `Close view of a matte black shower head and arm on a white marble wall.`),
  ST(55, "Tienen una capita de color por encima", "b_finishchip", "worn gold faucet closeup", `Ordinary real footage that shows worn gold faucet closeup.`),
  ST(55, "se la puede manchar", "b_finishstain", "tarnished gold faucet", `Extreme close view of dull blotchy spots on the gold-colored finish of a shower head.`),
  C(56, "", "ClTimer30", { minutes: 30, label: "La dorada", text: "media hora, no más" }),
  CL(56, "Saque, enjuague con agua", "c_rinsegold", `He rinses a gold-colored shower head under the running tap of a bathroom sink in ${HOTELSHOWER}.`),
  ST(56, "y seque con un trapo", "b_drygold", "drying faucet cloth", `Ordinary real footage that shows drying faucet cloth.`),
  C(57, "", "ClFinishCheck", { hi: 1 }),
  // ── de yapa: las llaves del lavabo
  C(58, "", "ClChapter", { n: 6, label: "DE YAPA", title: "Las llaves del lavabo", sub: "la misma piedra" }),
  ST(58, "", "b_tapcrust", "limescale faucet", `A chrome bathroom sink faucet with white limescale crust around its base and spout tip, an ordinary sink.`),
  ST(59, "", "b_aerator", "faucet aerator", `Ordinary real footage that shows faucet aerator.`),
  CL(59, "Desenrósquela con la mano", "c_unscrew", `He unscrews the small aerator tip of a chrome bathroom faucet with his gloved fingers in ${HOTELSHOWER}.`, { anim: "he twists off the aerator" }),
  ST(59, "envuélvala en un trapo antes de agarrarla", "b_clothplier", "pliers faucet cloth", `Ordinary real footage that shows pliers faucet cloth.`),
  ST(60, "", "b_aeratorglass", "faucet aerator vinegar glass", `Ordinary real footage that shows faucet aerator vinegar glass.`),
  ST(60, "cepillo de dientes, enjuague", "b_brushaerator", "toothbrush cleaning faucet", `${G} scrubbing a small faucet aerator screen with an old toothbrush under running water.`),
  CL(61, "", "c_paperwrap", `He wraps a paper towel soaked in vinegar around the base of a chrome bathroom faucet in ${HOTELSHOWER}.`, { anim: "he wraps the wet paper around the faucet" }),
  ST(61, "y déjela una hora", "b_wrapped", "paper towel faucet", `Ordinary real footage that shows paper towel faucet.`),
  ST(61, "Después frote con el cepillo y enjuague", "b_tapclean", "clean chrome faucet water", `A clean shiny chrome bathroom faucet with no crust, water running, a white sink.`),
  // ── otro día: lo gris
  C(62, "", "ClTwoDays", { hi: 1, d1: ["DÍA 1", "Vinagre blanco", "la piedra · toda la noche", "#3E6E8E"], d2: ["OTRO DÍA", "Frasco marrón", "lo gris · un trapo", "#5A3418"], stamp: "Nunca el mismo día" }),
  CL(63, "", "c_wipeperox", `He wipes the face and neck of ${HEAD} with a cloth soaked in hydrogen peroxide in ${HOTELSHOWER}, ${BROWN} in his other hand.`, { anim: "he wipes the shower head with the cloth" }),
  ST(63, "Esa película gris resbalosa se va con el trapo", "b_clothgray", "dirty white cloth", `A white cloth with a gray smear of soap scum on it, held next to a clean chrome shower head.`),
  ST(64, "", "b_blacknubs", "mold shower head", `Ordinary real footage that shows mold shower head.`),
  ST(64, "espere diez minutos", "b_spraynubs", "spray bottle cleaning shower", `Ordinary real footage that shows spray bottle cleaning shower.`),
  // ── problemas
  C(65, "", "ClChapter", { n: 7, label: "LA VIDA REAL", title: "Lo que me cuentan", sub: "y qué hacer" }),
  ST(66, "", "b_bagfallen2", "puddle shower floor", `A plastic bag lying in a puddle of vinegar on a shower floor, a rubber band beside it.`),
  CL(66, "Dos ligas", "c_twobands", `He wraps a second rubber band around the bag tied on ${HEAD} in ${HOTELSHOWER}.`),
  ST(67, "", "b_highhead", "high shower head from below", `Ordinary real footage that shows high shower head from below.`),
  C(67, "No se suba a una silla mojada", "ClDoDont", { yes: { label: "Escalerita firme", img: I + "b_stepladder.jpg" }, no: { label: "Silla mojada", img: I + "b_wetchair.jpg" } }),
  ST(68, "", "b_window", "opening bathroom window steam", `Ordinary real footage that shows opening bathroom window steam.`),
  ST(69, "", "b_pipewall", "plumber shower repair", `Ordinary real footage that shows plumber shower repair.`),
  // ── preguntas
  CL(70, "", "c_qa", `He sits on the closed toilet lid in ${HOTELSHOWER}, elbows on knees, talking to the camera with a friendly smile.`),
  C(71, "", "ClNeverMix", { a: "Cloro", b: "Vinagre", verdict: "Gas cloro" }),
  C(71, "Está en la primera fila", "ClBookPage", { page: I + "book_p7.jpg", pageNo: 7, stamp: "Primera fila" }),
  CL(72, "", "c_drycloth", `He wipes a chrome shower head and the faucet dry with a microfiber cloth after a shower in ${HOTELSHOWER}.`),
  ST(73, "", "b_warmvinegar", "saucepan stove steam", `A small saucepan of white vinegar warming on a kitchen stove, a little steam, no boiling.`),
  ST(74, "", "b_lemons", "cut lemons", `Two cut lemons and a squeezed lemon on a bathroom counter next to a chrome shower head.`),
  ST(74, "El vinagre blanco es más barato y más parejo", "b_vinegarjug", "white vinegar bottle", `${VINEGAR} standing on a white bathroom counter.`),
  // ── errores
  C(75, "", "ClChapter", { n: 5, label: "EN EL HOTEL", title: "Los errores", sub: "que vi con las regaderas" }),
  ST(76, "", "b_pliersgrip", "pliers pipe", `Ordinary real footage that shows pliers pipe.`),
  ST(77, "", "b_bighole", "shower head water spray", `Ordinary real footage that shows shower head water spray.`),
  ST(78, "", "b_goldbag", "gold shower head", `Ordinary real footage that shows gold shower head.`),
  C(79, "", "ClNeverMix", { a: "Vinagre", b: "Agua oxigenada", verdict: "Nunca el mismo día" }),
  ST(80, "", "b_underhot", "senior man shower", `An older man in a shower flinching as small white flakes come out of the shower head with the first water.`),
  // ── la cuenta
  C(81, "", "ClReceipt", { lines: [["Regadera nueva", "la regadera"], ["Visita del plomero", "la visita"], ["Vinagre blanco", "1½ taza"], ["Bolsa de congelador", "1"], ["Liga", "1"]] }),
  ST(81, "En esta casa no hay villanos, hay aritmética", "b_calc", "calculator receipt glasses table", `Ordinary real footage that shows calculator receipt glasses table.`),
  CL(82, "", "c_managersmile", `${MANAGER} closes his notebook and nods with a small smile next to him in ${HALL}.`),
  C(82, "casi no volvió a anotar", "ClNotebook", { title: "La libreta del gerente", rows: [{ k: "Enero", v: "la ducha sale débil" }, { k: "Febrero", v: "—" }, { k: "Marzo", v: "—" }], strike: true, note: "la bolsa, de noche" }),
  // ── recap
  C(83, "", "ClCheck", { title: "Todo en 30 segundos", items: ["¿Cromo o dorada?", "1½ taza de vinagre en la bolsa", "Cromo: noche · dorada: ½ hora", "Agua caliente 1 minuto", "Cepillo · aguja · el dedo", "Otro día: el trapo"] }),
  B(83, "Una taza y media de vinagre en una bolsa", "b_bagready", `${BAG}, in morning light.`),
  ST(83, "A la mañana, agua caliente un minuto", "b_hotrecap", "hot shower water running", `Hot water running from a shower.`),
  ST(83, "Cepillo de dientes", "b_brushrecap", "toothbrush closeup", `A toothbrush.`),
  ST(83, "el dedo en las puntitas de goma", "b_thumbnubs", "cleaning shower head hand", `Ordinary real footage that shows cleaning shower head hand.`),
  ST(83, "Otro día, el trapo con agua oxigenada", "b_clothbottle", "brown bottle cloth", `Ordinary real footage that shows brown bottle cloth.`),
  // ── CTA 3
  CL(84, "", "c_bookshow2", `He holds a thick printed spiral-bound book with a plain brown cover open to a page in ${HOTELSHOWER}, pointing at a line with his gloved finger.`),
  C(84, "La regadera en la página veintiocho", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "94 ARREGLOS · PÁGINAS 7 Y 28", text: "el link está abajo" }),
  // ── cierre
  CL(85, "", "c_lookjets", `He turns on the shower and looks up at the jets with his hand on the mixer in ${HOTELSHOWER}.`),
  ST(85, "Cuántos salen torcidos", "b_countjets", "shower head spraying water", `Ordinary real footage that shows shower head spraying water.`),
  CL(86, "", "c_phonecomments", `He sits on a bench in a hotel staff room reading comments on his phone with reading glasses, smiling.`),
  ST(86, "es de las plateadas, o de las doradas", "b_twoheads", "shower heads towel", `Ordinary real footage that shows shower heads towel.`),
  ST(87, "", "b_oldhead", "old shower head", `Ordinary real footage that shows old shower head.`),
  C(88, "", "ClVideoRef", { thumb: I + "th_clsarro.jpg", title: "El sarro del inodoro", tag: "ya en el canal", next: true }),
  CL(89, "", "c_wave", `He hangs a clean dry cloth on the shower door in ${HOTELSHOWER} and gives the camera a small nod goodbye.`),
  ST(89, "quiera desenroscar la regadera con una pinza", "b_pliershand", "hand reaching pliers", `Ordinary real footage that shows hand reaching pliers.`),
];
