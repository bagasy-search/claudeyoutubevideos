// DIRECTOR B — clbandeja: POR QUÉ EL DETERGENTE NO PUEDE (paga el loop 1: 100 horneadas = 100 capas de barniz, paraguas, la pasta se mete
// debajo, la negra lisa no se toca, el humo) · LA ANTIADHERENTE (paga el loop 2) · aluminio · cuándo tirarla · la otra mitad · CTA 2 ·
// DON RAMIRO Y EL CONTENEDOR (paga el loop 3: 30 bandejas, la mesa como soldados, 28 salvadas, la cuenta, la torta de la boda) (20-39).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { KITCHEN, CRUST, BOTTLE, PASTE } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const G = "a hand in a blue nitrile glove";
const I = "img/clbandeja/";
const RAMIRO = "a hotel night cook in his sixties, Don Ramiro, with a gray mustache, a white cook's jacket and a white cap";
const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie";
export const SHOTS = [
  // ── 3:45 · por qué el detergente no puede
  C(20, "", "ClChapter", { n: 2, title: "Por qué el detergente no puede", sub: "esa costra ya no es grasa" }),
  S(20, "Era grasa", "av", ""),
  S(21, "", "bi", "st_ovenbake", { q: "baking tray oven", p: BI("A baking tray going into a hot oven.") }),
  S(21, "ese aceite se cocina y se endurece", "bi", "b_oilsheen", { p: BI("Extreme close view of a thin film of oil on an aluminum baking sheet turning amber and glossy in the heat of an oven, tiny bubbles in it.") }),
  S(21, "como el de un mueble", "bi", "st_furniture", { q: "varnished wood furniture close up", p: BI("Close view of glossy varnished wood furniture.") }),
  C(21, "Y la próxima vez otra capa encima", "ClTray3D", { mode: "layers", count: 100, labels: { a: "Una capa por horneada" } }),
  C(22, "", "ClTray3D", { mode: "detergent", labels: { a: "Como agua en un paraguas" } }),
  S(22, "como el agua por un paraguas", "bi", "st_umbrella", { q: "rain drops on umbrella", p: BI("Rain drops running off an umbrella.") }),
  C(23, "", "ClTray3D", { mode: "paste", labels: { a: "Se mete entre la costra y el metal" } }),
  S(23, "No es la fuerza es la espera", "av", ""),
  // la negra lisa
  S(24, "", "bi", "b_seasoned", { p: BI(`A well-used dark baking sheet with an even, smooth, satin black seasoning, no bumps or sticky crust, resting on a stainless steel counter in ${KITCHEN}.`) }),
  C(24, "Lo que hay que sacar", "ClDoDont", { yes: { label: "Negra y lisa: déjela", img: I + "b_seasoned.jpg" }, no: { label: "Marrón con relieve: afuera", img: I + "b_crustmacro.jpg" } }),
  // el humo
  S(25, "", "bi", "b_ovensmoke", { p: BI("A home oven door opened with a puff of gray smoke coming out, a woman waving a kitchen towel at it.") }),
  S(25, "las capas de arriba se queman", "bi", "b_crustburn", { p: BI(`Extreme close view of ${CRUST} smoking slightly in a hot oven, the dark edges glowing faintly.`) }),
  // ── 5:00 · la antiadherente (paga el loop 2)
  C(26, "", "ClChapter", { n: 3, label: "ERROR", title: "La lana de acero", sub: "en la antiadherente", alert: true }),
  S(26, "la lana de acero o la esponja verde de un lado", "bi", "st_steelwool", { q: "steel wool scouring pad", p: BI("A steel wool scouring pad and a green scrub sponge on a sink.") }),
  C(27, "", "ClCoating", {}),
  S(27, "la comida se pega más", "bi", "b_stuckfood", { p: BI("Close view of a scratched dark nonstick baking sheet with burnt cookies stuck to the scratched area.") }),
  S(28, "", "bi", "b_softsponge", { p: BI(`${G} gently wiping a dark nonstick baking sheet with a soft yellow sponge and soapy water.`) }),
  S(28, "esa bandeja ya cumplió", "bi", "b_peeled", { p: BI("A nonstick baking sheet with its dark coating peeling off in patches, showing bare silver metal underneath.") }),
  // el aluminio
  S(29, "", "bi", "st_bakerytrays", { q: "bakery aluminum trays", p: BI("Stacks of aluminum bakery trays.") }),
  S(29, "Puede quedar un poquito más opaca", "bi", "b_dullalu", { p: BI("A clean aluminum baking sheet, slightly dull matte gray rather than shiny, on a stainless steel counter.") }),
  // cuándo tirarla
  C(30, "", "ClCheck", { title: "Cuándo sí tirarla", items: ["Torcida, baila", "Óxido que atraviesa", "Antiadherente pelada"] }),
  S(30, "Si está torcida y baila sobre la mesada", "bi", "b_warped", { p: BI(`${G} pressing one corner of a warped baking sheet on a flat counter; the opposite corner lifts up.`), anim: "the tray rocks on the counter" }),
  // la otra mitad
  S(31, "", "av", ""),
  S(31, "le quedó la mitad limpia", "bi", "b_halfclean", { p: BI(`A baking sheet on a kitchen counter: the left half is ${CRUST.replace("an aluminum baking sheet covered in ", "covered in ")}, the right half is clean shiny silver, a straight line between them.`) }),
  S(31, "la otra mitad lleva otra vuelta de pasta", "bi", "b_halfpaste", { p: BI(`${G} spreading ${PASTE} over the still-crusted half of a half-clean baking sheet.`), anim: "the paste spreads slowly over the dirty half" }),
  // CTA 2
  S(32, "", "av", ""),
  C(32, "está en la página trece", "ClBookPage", { page: I + "book_p13.jpg", pageNo: 13, qr: I + "qr.jpg", stamp: "Se la regalo" }),
  C(32, "El código está acá", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "la página 13, gratis" }),
  // ── 6:45 · DON RAMIRO (paga el loop 3)
  C(33, "", "ClChapter", { n: 4, title: "Don Ramiro y el contenedor", sub: "las bandejas que el hotel tiraba" }),
  S(33, "Don Ramiro cocinaba de noche", "bi", "b_ramironight", { p: BI(`${RAMIRO} alone in ${KITCHEN} late at night, rolling dough on a stainless steel table under a single row of lights.`), anim: "he rolls the dough slowly" }),
  S(33, "El desayuno de doscientas personas", "bi", "st_breakfast", { q: "hotel breakfast buffet", p: BI("A hotel breakfast buffet with trays of food.") }),
  S(33, "tiraban bandejas marrones al contenedor", "bi", "b_morningtoss", { p: BI("A young kitchen worker in a white apron dropping two brown crusted baking sheets into a green dumpster in a hotel back patio in the morning.") }),
  S(34, "", "cl", "c_flashlight", { p: CLP(`He stands next to a big green dumpster in a hotel back patio at night, holding a flashlight, while ${RAMIRO} leans in and pulls out a brown crusted baking sheet; Claudio looks at the camera with a doubtful smile.`) }),
  S(34, "sacamos del contenedor treinta bandejas", "bi", "b_traypile", { p: BI("A pile of about thirty brown crusted old baking sheets stacked on the concrete of a hotel back patio at night, lit by a flashlight.") }),
  S(34, "Yo pensé que estaba loco", "av", ""),
  S(34, "una bandeja gruesa cocina mejor", "bi", "b_ramirotalk", { p: BI(`${RAMIRO} holding up a thick heavy old baking sheet and tapping it with a knuckle, explaining with a serious face, in a hotel kitchen at night.`) }),
  S(34, "Las nuevas se tuercen en el horno", "bi", "b_thinwarp", { p: BI("A thin new baking sheet visibly warped and twisted inside a hot oven.") }),
  S(35, "", "bi", "b_soldiers", { p: BI(`A long stainless steel table in ${KITCHEN} at night covered end to end with old baking sheets lined up in rows, each one coated with ${PASTE}, like soldiers in formation.`) }),
  S(35, "Y nos fuimos a tomar un café", "cl", "c_coffee", { p: CLP(`He sits on an upturned crate in a hotel kitchen at night next to ${RAMIRO}, both holding white coffee mugs, looking at a table full of paste-covered baking sheets.`) }),
  S(36, "", "bi", "b_morningscrub", { p: BI(`${RAMIRO} in the morning light of ${KITCHEN} rubbing a sponge over a paste-covered baking sheet, brown flakes coming off.`), anim: "he rubs the sponge in circles" }),
  S(36, "como cáscara de huevo", "bi", "st_eggshell", { q: "cracked egg shell close", p: BI("Close view of cracked eggshell.") }),
  C(36, "se salvaron veintiocho", "ClTally", { total: 30, lost: 2 }),
  S(37, "", "bi", "b_rackold", { p: BI(`Heavy old aluminum baking sheets, clean and dull silver, slotted in a tall stainless steel rack in ${KITCHEN}, worn edges.`) }),
  S(37, "fue papel para hornear", "bi", "st_parchment", { q: "parchment paper baking tray", p: BI("Parchment paper lining a baking tray.") }),
  // la cuenta
  S(38, "", "bi", "b_managercalc", { p: BI(`${MANAGER} at a desk in a hotel office tapping on a calculator and writing in a notebook, eyebrows raised.`) }),
  C(38, "En diez años cuatrocientas bandejas", "ClReceipt", {}),
  S(38, "el gerente nos invitó un asado", "bi", "b_asado", { p: BI("A small grill with meat cooking in a hotel back patio at dusk, two men in kitchen whites and a man in a navy work jacket laughing around it, seen from behind.") }),
  // la torta
  S(39, "", "bi", "b_weddingcake", { p: BI("A tall white wedding cake on a table in a decorated hotel banquet hall, guests in the background.") }),
  S(39, "se partió en dos delante de todos", "bi", "b_cakebroke", { p: BI("A white wedding cake split in two on a cake board, a large crack down the middle, a stunned waiter holding the board.") }),
  S(39, "Don Ramiro no durmió esa noche", "bi", "b_ramirosad", { p: BI(`${RAMIRO} sitting alone in an empty hotel kitchen at night, his cap in his hands, staring at a stack of brown crusted baking sheets.`) }),
  S(39, "Nunca más se le pegó nada", "av", ""),
];
