// DIRECTOR B — mecaceite: los 9 errores, 1-4 (de más: espuma, retenes, catalizador, la bomba por el tubo de la varilla, rampas o torres ·
// de menos · el grado · la norma, el bidón de Elena) · mención 2 (ClBookPage pág. 14) · errores 5-7 (filtro sin aceitar y apretado a mano,
// la goma vieja pegada, el tapón sin arandela nueva: la gota de Elena) (párrafos 19-36).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { BAY, GAUGE, DIP, LUBE, JUG, PLUG, FILTER } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/mecaceite/";
export const SHOTS = [
  C(19, "", "ClChapter", { n: 4, title: "Los 9 errores", sub: "después del cambio", alert: true }),
  // ── 1 de más
  S(20, "", "bi", "b_err1", { p: BI(`${H} pouring oil from ${JUG} into the filler of ${BAY}, the jug almost empty.`), ov: { c: "ClChip", props: { text: "1 · De más", alert: true } } }),
  S(20, "La gente piensa que más aceite es más protección", "bi", "b_extraoil", { q: "adding engine oil", p: BI(`Close view of a hand adding a little extra oil from a bottle into an engine filler neck, just in case.`) }),
  S(21, "", "c", "ClCrankFoam", { props: { mode: "ok" } }),
  S(21, "Si el aceite está muy alto", "c", "ClCrankFoam", { props: { mode: "high" } }),
  S(21, "como una batidora con la crema", "bi", "st_whisk", { q: "whisking cream", p: BI("A whisk beating cream in a bowl.") }),
  S(21, "Hace espuma", "bi", "b_foamdip", { p: BI(`Extreme close view of the tip of ${DIP} with foamy, bubbly light-brown oil on it.`) }),
  S(22, "", "av", ""),
  S(22, "empuja los retenes", "bi", "b_sealleak", { p: BI("Extreme close view of an oily crankshaft seal at the front of an older engine, a wet oil ring around it.") }),
  S(22, "y arruinar el catalizador", "bi", "st_catalytic", { q: "car exhaust catalytic converter", p: BI("The exhaust system and catalytic converter under a car.") }),
  // ── la bomba
  S(23, "", "av", ""),
  S(23, "Con una bomba de mano que se mete por el tubo de la varilla", "kf", "k_pump", { p: BI(`Close view of ${H} pushing a thin clear hose of a manual oil extractor pump into the dipstick tube in ${BAY}.`), d1: "the hand pumps the handle", d2: "golden oil flows up the clear hose into the container", sound: "a hand pump squeaking" }),
  S(23, "Sacamos de a poco, midiendo cada vez", "bi", "b_measure2", { q: "mechanic checking oil", p: BI(`Close view of ${H} checking ${DIP} again over a white rag, a hand pump container beside the car.`) }),
  S(23, "Salió casi un litro", "bi", "b_pumpliter", { p: BI(`Close view of a clear plastic container with nearly one liter of fresh golden oil, on the cement floor of ${DRIVE}.`), ov: { c: "ClChip", props: { text: "Casi 1 litro" } } }),
  S(24, "", "bi", "b_ramps", { p: BI(`${CAR} with its front wheels up on low plastic ramps in ${DRIVE}, wheel chocks behind the rear wheels.`) }),
  S(24, "Nunca, nunca te metas debajo de un auto sostenido sólo con el gato", "bi", "b_jackonly", { p: BI(`Close view of a small scissor jack lifting one corner of ${CAR}, nobody under it.`), ov: { c: "ClStampOv", props: { text: "NUNCA" } } }),
  S(24, "El gato es para cambiar una llanta", "bi", "st_jackstands", { q: "car jack stands", p: BI("A car supported on jack stands in a garage.") }),
  // ── 2 de menos
  S(25, "", "bi", "b_err2", { p: BI(`Extreme close view of ${DIP} on a white rag with oil only at the very bottom, below the lower mark.`), ov: { c: "ClChip", props: { text: "2 · De menos", alert: true } } }),
  S(25, "Pasa cuando se ponen cuatro litros", "bi", "b_4jugs", { p: BI(`Four 1-liter plain oil bottles with blank labels lined up on a workbench in ${SHOP}.`) }),
  S(25, "Cada motor lleva una cantidad, y está en el manual", "bi", "b_manualcap", { p: BI(`Close view of ${EH} pointing at the specifications page of a car owner's manual, nothing legible.`) }),
  S(25, "el aceite se calienta más y se gasta más rápido", "av", ""),
  // ── 3 el grado
  S(26, "", "c", "ClOilLabel", { props: { mode: "grade" } }),
  S(26, "Tu motor está hecho para uno", "av", ""),
  S(26, "porque estaba en oferta", "bi", "b_sale", { p: BI(`A store shelf of plain motor oil jugs with blank labels, one row with a bright yellow sale tag with no legible text.`) }),
  S(26, "en las mañanas frías el aceite tarda en llegar", "bi", "b_coldmorning", { p: BI(`Cold early morning, frost on the windshield of ${CAR} in ${DRIVE}.`) }),
  // ── 4 la norma
  S(27, "", "bi", "b_err4", { p: BI(`Extreme close view of ${H} turning a plain oil jug to read the back label in a store aisle, nothing legible.`), ov: { c: "ClChip", props: { text: "4 · La norma", alert: true } } }),
  S(27, "en la etiqueta del bidón hay unas letras", "c", "ClOilLabel", { props: { mode: "norm" } }),
  S(27, "El número correcto con la norma equivocada", "av", ""),
  S(28, "", "bi", "b_cheapjug", { p: BI(`A dusty plain oil jug with a faded blank label on the bottom shelf of a store.`) }),
  S(28, "No rompe el motor en una semana", "av", ""),
  S(28, "Lo cambiamos", "bi", "b_newjug", { p: BI(`Close view of ${H} placing a plain yellow oil jug with a blank label on the workbench of ${SHOP}.`) }),
  // ── mención 2
  C(29, "", "ClBookPage", { page: I + "page14.jpg", pageNo: 14, stamp: "Los 9 errores, en la página" }),
  S(29, "Para que la lleves la próxima vez que cambies el aceite", "bi", "b_glovebook", { p: BI(`Close view of ${EH} putting a small printed booklet into the glovebox of ${CABIN}.`) }),
  // ── 5 filtro sin aceitar
  S(30, "", "bi", "b_err5", { p: BI(`Close view of ${FILTER} in ${H}, the rubber gasket ring visible.`), ov: { c: "ClChip", props: { text: "5 · Filtro sin aceitar", alert: true } } }),
  S(30, "esa goma se moja con un poquito de aceite nuevo, con el dedo", "kf", "k_gasketoil", { p: BI(`Extreme close view of a fingertip wet with fresh golden oil rubbing the black rubber ring on the base of ${FILTER}, held upside down in the other hand over a workbench.`), d1: "the fingertip touches the gasket", d2: "the fingertip runs around the gasket leaving it shiny", sound: "a soft rub" }),
  S(30, "Si se pone seca, puede doblarse o romperse al apretar", "c", "ClDoubleGasket", { props: { mode: "ok" } }),
  S(31, "", "bi", "b_handtight", { q: "installing oil filter", p: BI(`Close view of ${H} screwing ${FILTER} onto an engine by hand from below.`), ov: { c: "ClChip", props: { text: "Mano + ¼ de vuelta" } } }),
  S(31, "No con toda la fuerza de una herramienta", "bi", "b_wrench", { p: BI("Close view of an oil filter wrench clamped hard on a dented oil filter."), }),
  S(31, "y el próximo que lo quiera sacar no va a poder", "av", ""),
  // ── 6 la goma vieja
  S(32, "", "av", ""),
  S(32, "su goma queda pegada en el motor", "bi", "b_oldgasket", { q: "engine oil filter housing", p: BI(`Extreme close view of an old black rubber filter gasket stuck to the round mounting surface of an engine, the filter removed.`) }),
  S(32, "Dos gomas, una sobre otra", "c", "ClDoubleGasket", { props: { mode: "double" } }),
  S(33, "", "av", ""),
  S(33, "y el aceite sale a chorro", "bi", "st_oilspill", { q: "oil spill garage floor", p: BI("Oil spilled on a garage floor.") }),
  S(33, "Pasa mucho más de lo que crees", "av", ""),
  S(33, "miras el filtro viejo", "bi", "b_oldfilter", { q: "old oil filter", p: BI(`Close view of ${H} turning over an old dirty oil filter to look at its rubber gasket, which is in place.`) }),
  // ── 7 la arandela
  S(34, "", "bi", "b_err7", { q: "oil drain plug", p: BI(`Low close view of ${PLUG} with its old flattened washer.`), ov: { c: "ClChip", props: { text: "7 · Arandela vieja", alert: true } } }),
  S(34, "Ese tapón lleva una arandela, de cobre o de aluminio", "c", "ClCrushWasher", { props: { mode: "new" } }),
  S(34, "Si se reusa, ya no sella igual", "av", ""),
  S(35, "", "c", "ClCrushWasher", { props: { mode: "reused" } }),
  S(35, "Pusimos una nueva, de centavos, con el auto en rampas", "kf", "k_plugin", { p: BI(`Low close view of ${H} threading a drain plug with a new copper washer into the oil pan of a car on ramps.`), d1: "the fingers turn the plug in", d2: "the plug seats against the pan", sound: "metal threads turning" }),
  S(35, "Y la gota se cortó", "bi", "b_plugdry", { p: BI(`Low close view of a clean dry ${PLUG} with a new copper washer.`) }),
  S(36, "", "bi", "b_torque", { q: "wrench tightening bolt", p: BI(`Close view of ${H} tightening a drain plug with a short wrench, not too hard.`) }),
  S(36, "una rosca pasada es una reparación enorme", "bi", "b_stripped", { q: "damaged bolt thread", p: BI("Extreme close view of a damaged stripped thread in an aluminum oil pan drain hole.") }),
  S(36, "Firme, sin colgarse de la llave", "av", ""),
];
