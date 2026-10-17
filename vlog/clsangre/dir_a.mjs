// DIRECTOR A — clsangre: MINUTO 1 (la sábana con la mancha → la espuma → PROMESA agua fría + frasco marrón + 5 min con el
// antes/después → la falla (lavarropas caliente) → "no fue culpa suya" → el culpable (el calor cocina la proteína) → 3 loops) + INTRO +
// CTA 1 + el gerente (sábanas dadas de baja) + callback a clcolchon + QUÉ ES + la historia del delantal de Don Ramiro (párr. 0-21).
import { S, BI, CLP } from "../claudio/lib.mjs";
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const CL = (p, at, name, scene, o = {}) => S(p, at, "cl", name, { p: CLP(scene), ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: BI(scene), ...o });
export const G = "a hand in a blue nitrile glove";
export const BROWN = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
export const SHEET = "a white cotton bed sheet";
export const STAIN = "a fresh dark red blood stain the size of a coin on a white cotton bed sheet";
export const LAUNDRY = "a hotel basement laundry room with big washing machines, a deep utility sink and stacks of folded white sheets";
export const HOTELROOM = "a mid-range hotel room with a made bed with white sheets and a carpeted floor";
export const ROSA = "Rosa, a hotel housekeeper in her fifties with dark hair in a bun and a light-blue housekeeping uniform";
export const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie, holding a small black notebook";
export const RAMIRO = "Don Ramiro, the hotel cook in his sixties with a gray mustache, a white cook's jacket and a long apron";
export const HALL = "a carpeted hotel corridor with numbered room doors and warm ceiling lights";
export const I = "img/clsangre/";
export const SHOTS = [
  // ── 0:00 · Claudio a cámara con la sábana
  S(0, "", "av", ""),
  CL(0, "Mire lo que pasa cuando le echo esto", "c_pour", `He pours a little liquid from ${BROWN} onto a red blood stain on a white sheet over a deep sink in ${LAUNDRY}.`, { anim: "he pours and the stain starts to foam" }),
  B(0, "Hace espuma", "b_foam", `Extreme close view of white foam bubbling up on a red blood stain on a white cotton sheet.`),
  ST(0, "Y la mancha se va levantando sola", "b_bubbles", "foam bubbles macro", `Fine white foam bubbling, macro.`),
  C(1, "", "ClBeforeAfter", { before: I + "b_ba_before.jpg", after: I + "b_ba_after.jpg", note: "agua fría · agua oxigenada · 5 min" }),
  ST(1, "agua fría", "b_coldtap", "cold water tap running", `Cold water running from a tap.`),
  ST(1, "un chorrito de agua oxigenada", "b_brownpour", "pouring from brown bottle", `Pouring from a brown bottle.`),
  ST(1, "oxigenada", "b_peroxide", "hydrogen peroxide bottle", `A brown bottle of hydrogen peroxide.`),
  C(1, "cinco minutos", "ClTimer30", { minutes: 5, label: "Sobre la mancha", fast: true }),
  ST(1, "y un trapo blanco", "b_whitecloth", "white cloth folded", `A folded white cloth.`),
  B(1, "Mire la sábana antes", "b_before", `${STAIN}.`),
  B(1, "Y mírela después", "b_after", `A clean white cotton bed sheet with no stain, a little damp in the middle.`),
  ST(1, "Blanca otra vez", "b_cleansheet", "clean white bed sheet", `A clean white bed sheet.`),
  S(2, "", "av", ""),
  ST(2, "el lavarropas", "b_washer", "loading washing machine sheets", `Loading white sheets into a washing machine.`),
  ST(2, "con agua caliente", "b_hotdial", "washing machine dial temperature", `Turning the temperature dial of a washing machine.`),
  ST(2, "para que saliera mejor", "b_hotwash", "washing machine running water", `A washing machine running.`),
  ST(2, "Y cuando la sacó", "b_pullsheet", "taking laundry out of washing machine", `Taking laundry out of a washing machine.`),
  ST(2, "ahí estaba", "b_sheetlook", "white sheet fabric", `A white sheet.`),
  B(2, "Marrón, más clara, pero ahí", "b_setstain", `Close view of a faded brown set-in blood stain on a washed white cotton sheet.`),
  ST(2, "Para siempre", "b_stainclose", "old stain fabric closeup", `An old stain on fabric.`),
  CL(3, "", "c_reassure", `He folds a white sheet on a table in ${LAUNDRY}, talking to the camera with a calm open hand.`),
  ST(3, "Nadie le dijo", "b_washlabel", "laundry care label", `A laundry care label.`),
  ST(3, "con la sangre", "b_redspot", "red stain white fabric", `A red stain on white fabric.`),
  ST(3, "el agua caliente", "b_hotwater", "hot water steam tap", `Hot steaming water from a tap.`),
  S(3, "exactamente lo contrario", "av", ""),
  ST(4, "", "b_hotsteam", "hot steam", `Hot steam rising.`),
  ST(4, "La sangre es proteína", "b_eggwhite", "raw egg white bowl", `A raw egg white in a bowl.`),
  C(4, "como la clara del huevo", "ClProteinCook", { hi: 1 }),
  ST(4, "adentro de la tela", "b_fabricmacro", "fabric texture macro", `Fabric texture, macro.`),
  ST(4, "como cuaja un huevo", "b_friedegg", "frying egg pan", `An egg frying in a pan.`),
  S(4, "Una vez cocida", "av", ""),
  CL(5, "Por qué la mancha", "c_threefingers", `He holds up three gloved fingers to the camera in ${LAUNDRY}.`),
  C(5, "se enjuaga del revés", "ClInsideOut", { hi: 1 }),
  ST(5, "El error del trapo", "b_rubcloth", "rubbing cloth fabric", `Rubbing fabric with a cloth.`),
  ST(5, "antes de la secadora", "b_dryer", "clothes dryer door", `The open door of a clothes dryer.`),
  // ── intro
  C(6, "", "ClHallway3D", { total: 180, floor: 2, title: "camas", sub: "todas con sábanas blancas" }),
  ST(6, "todas con sábanas blancas", "b_whitebed", "hotel bed white sheets", `A hotel bed with white sheets.`),
  // ── CTA 1
  CL(7, "", "c_bookhold", `He holds a thick printed spiral-bound book with a plain brown cover in ${LAUNDRY}, tapping its cover.`),
  ST(7, "me prometí escribir todo lo que aprendí", "b_notebookdesk", "old notebook handwritten notes desk", `An old worn notebook with handwritten notes open on a small desk.`),
  S(7, "Y lo escribí", "av", ""),
  C(7, "Un libro", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "94 ARREGLOS · PÁGINAS 7 Y 20", text: "el link está abajo" }),
  C(7, "La sangre está en la página veinte", "ClBookPage", { page: I + "book_p20.jpg", pageNo: 20, stamp: "La sangre" }),
  C(7, "y la tabla de lo que nunca se mezcla", "ClBookPage", { page: I + "book_p7.jpg", pageNo: 7, stamp: "Página 7" }),
  // ── el gerente
  CL(8, "", "c_manager", `${MANAGER} reads from his notebook next to him in ${HALL}; he listens, holding a folded white sheet.`),
  C(8, "sábanas dadas de baja", "ClNotebook", { title: "La libreta del gerente", rows: [{ k: "Marzo", v: "sábanas dadas de baja: 14" }, { k: "Abril", v: "sábanas dadas de baja: 11" }], note: "manchas de sangre" }),
  ST(8, "Cada mes, una pila", "b_sheetpile", "stack of white sheets", `A stack of folded white sheets.`),
  ST(9, "Una nariz que sangra de noche", "b_nosebleed", "tissue nosebleed", `A hand holding a tissue, face not visible.`),
  ST(9, "Un corte afeitándose", "b_razor", "razor shaving bathroom sink", `A razor on a bathroom sink.`),
  ST(9, "Y la sábana blanca, que es la que más se nota", "b_bedmorning", "unmade bed white sheets morning", `An unmade bed with white sheets in morning light.`),
  C(10, "", "ClVideoRef", { thumb: I + "th_clcolchon.jpg", title: "La mancha del colchón", tag: "ya en el canal" }),
  ST(10, "Si la sangre pasó al colchón", "b_mattress", "bare mattress", `A bare mattress.`),
  // ── qué es
  C(11, "", "ClChapter", { n: 1, label: "PRIMERO", title: "Qué es la sangre", sub: "para una tela" }),
  ST(11, "Porque si sabe qué es", "b_fabric", "white cotton fabric closeup", `White cotton fabric close view.`),
  ST(12, "Mientras está fresca y fría", "b_rinse", "rinsing fabric cold water", `Rinsing fabric under cold water.`),
  ST(12, "Se va con el agua", "b_drain", "water going down drain sink", `Water swirling down a sink drain.`),
  C(13, "Pasa lo mismo que con un huevo", "ClProteinCook", {}),
  ST(13, "Ahí se pone blanca y dura", "b_eggcook", "egg white cooking pan", `Egg white turning white in a hot pan.`),
  ST(14, "El agua caliente del lavarropas", "b_washerhot", "washing machine running", `A washing machine running.`),
  ST(14, "La secadora", "b_dryerrun", "clothes dryer tumbling", `Clothes tumbling in a dryer.`),
  ST(14, "Hasta la plancha", "b_iron", "ironing white sheet", `Ironing a white sheet.`),
  C(15, "agua fría, siempre", "ClDoDont", { yes: { label: "Agua fría", img: I + "b_coldtap.jpg" }, no: { label: "Calor", img: I + "b_dryerrun.jpg" } }),
  ST(16, "", "b_brownbottle", "brown medicine bottle", `${BROWN}.`),
  B(16, "hace espuma", "b_foam2", `Close view of white foam on a fading red blood stain on white cotton.`),
  // ── la historia
  CL(17, "", "c_laundry", `He walks into ${LAUNDRY}, looking at the big machines.`),
  ST(17, "con agua caliente, para desinfectar", "b_bigwasher", "industrial washing machine", `An industrial washing machine.`),
  B(18, "", "b_brownpile", `A pile of white hotel sheets with faded brown stains, set aside on a laundry table.`),
  CL(18, "Rosa", "c_rosafold", `${ROSA} sadly folds a white sheet with a faded brown stain in ${LAUNDRY}, while he watches.`),
  CL(19, "", "c_ramiro", `${RAMIRO} rinses the back of his stained apron under a cold tap at a deep sink in ${LAUNDRY}, talking to him.`),
  ST(19, "frotando del revés", "b_apron", "rinsing apron sink", `Rinsing an apron under a tap.`),
  ST(19, "se me cocina como un huevo", "b_egg2", "cracking egg pan", `An egg cracked into a pan.`),
  CL(20, "", "c_coldrinse", `He holds a white sheet inside-out under a cold tap at a deep sink in ${LAUNDRY}.`, { anim: "the cold water runs through the sheet" }),
  ST(20, "un trapo blanco para absorber", "b_blot", "blotting fabric white cloth", `Blotting fabric with a white cloth.`),
  B(21, "", "b_cleanpile", `A neat stack of clean bright white folded hotel sheets on a laundry shelf.`),
  ST(21, "una pileta sólo para las manchas", "b_utilitysink", "utility sink laundry room", `A utility sink in a laundry room.`),
  ST(21, "se achicó a casi nada", "b_fewsheets", "few folded sheets", `A few folded sheets.`),
];
