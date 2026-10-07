// DIRECTOR C — fboxido: LO QUE NO ARREGLA (cromo/pintura, metal picado, piezas grandes) · VARIANTES (tijera de podar, tornillos en
// frasco, llaves del auto, cadena de bici) · MANTENER (seca, tiza, aceite) · PREGUNTAS · RESUMEN · CTA 3 = QR · PRÓXIMO (cola+aceite)
// (párrafos 62-86).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { SHED, PLIERS, RUSTYP, CLEANP, GEL, HANDS, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fboxido/";
export const SHOTS = [
  // ── límite
  C(62, "", "ClChapter", { n: 8, title: "Lo que esto no arregla", sub: "para que no pierdas una noche" }),
  S(62, "no quiero que pierdas una noche", "av", ""),
  S(63, "", "bi", "b_chromewrench", { q: "chrome wrench", p: BI(`A shiny chrome-plated wrench next to a painted garden tool on a bench.`), ov: { c: "ClChip", props: { text: "Cromo o pintura: no", alert: true } } }),
  S(63, "sólo el aflojatodo y un trapo", "bi", "b_spraycan", { p: BI(`A plain gray spray can of penetrating oil and a rag next to a chrome wrench.`) }),
  S(64, "", "bi", "b_pitted", { p: BI(`Extreme close view of clean gray steel covered in small pits left by old rust.`), ov: { c: "ClChip", props: { text: "Picado: quedan los poros" } } }),
  S(65, "", "bi", "st_gate", { q: "old iron gate", p: BI(`An old iron gate.`) }),
  C(65, "Para eso está el video del aflojatodo", "ClVideoRef", { thumb: I + "th_reja.jpg", title: "Aflojatodo + pintura: la reja" }),
  // ── variantes
  C(66, "", "ClChapter", { n: 9, title: "Dónde más sirve", sub: "cuatro ideas" }),
  S(67, "", "bi", "b_shears", { q: "pruning shears garden", p: BI(`Old rusty pruning shears with dried sap on the blades on a garden table.`) }),
  S(67, "Corta como nueva", "bi", "b_cut", { p: BI(`Clean oiled pruning shears snipping a green branch cleanly.`) }),
  S(68, "", "bi", "b_screws", { q: "rusty screws nuts", p: BI(`A handful of rusty screws, nuts and old hinges on a workbench.`) }),
  S(68, "vinagre solo, sumergidas", "bi", "b_jarscrews", { p: BI(`Rusty screws and nuts sitting at the bottom of a glass jar of white vinegar.`) }),
  S(69, "", "bi", "b_carkit", { p: BI(`An open car trunk with a small canvas roll of wrenches, a few with rust spots.`) }),
  S(70, "", "bi", "b_chain", { q: "rusty bicycle chain", p: BI(`A rusty bicycle chain on a bicycle leaning in a patio.`) }),
  S(70, "bien aceitada", "bi", "b_chainoil", { p: BI(`Drops of oil falling on a clean bicycle chain while the pedal turns.`), anim: "the chain turns" }),
  // ── mantener
  C(71, "", "ClChapter", { n: 10, title: "Que no vuelvan a oxidarse", sub: "tres costumbres" }),
  S(72, "", "bi", "b_wipetool", { q: "cleaning shovel", p: BI(`A rag wiping a wet shovel blade before hanging it on a shed wall.`) }),
  S(72, "el piso de cemento suda", "bi", "b_floor", { q: "shed floor tools", p: BI(`A rusty spade lying on a damp concrete shed floor.`) }),
  S(73, "", "bi", "b_chalk", { p: BI(`Two sticks of white blackboard chalk in the tray of an open toolbox.`) }),
  S(74, "", "bi", "b_yearly", { q: "tools pegboard", p: BI(`A rag with a little oil being wiped over a row of tools hanging on a pegboard.`), anim: "the rag wipes along the tools" }),
  // ── preguntas
  C(75, "", "ClChapter", { n: 11, title: "Lo que siempre me preguntan", sub: "seis respuestas cortas" }),
  S(76, "", "bi", "st_applevinegar", { q: "apple cider vinegar", p: BI(`A bottle of apple cider vinegar.`), ov: { c: "ClAsk", props: { q: "¿Vinagre de manzana?", sign: "" } } }),
  S(77, "", "bi", "b_check", { p: BI(`A fingernail scraping a corner of rust under lifted cling film.`), ov: { c: "ClAsk", props: { q: "¿Cuánto tiempo?", sign: "" } } }),
  S(78, "", "bi", "b_trash", { q: "trash bag", p: BI(`Used brown rust paste scraped from a pot into a trash bag.`), ov: { c: "ClAsk", props: { q: "¿Lo reúso?", sign: "" } } }),
  S(79, "", "bi", "b_window", { q: "open window kitchen", p: BI(`An open window with steam drifting out from an old pot on a stove.`), ov: { c: "ClAsk", props: { q: "¿Huele?", sign: "" } } }),
  S(80, "", "bi", "b_blackgate2", { p: BI(`A freshly painted black iron gate in front of a house.`), ov: { c: "ClAsk", props: { q: "¿Para la reja?", sign: "" } } }),
  S(81, "", "bi", "b_soapwater", { q: "bucket soapy water", p: BI(`Cleaned tools rinsed in a bucket of soapy water.`), ov: { c: "ClAsk", props: { q: "¿Sin bicarbonato?", sign: "" } } }),
  // ── resumen
  C(82, "", "ClChapter", { n: 12, title: "Todo junto", sub: "para que lo tengas" }),
  S(82, "Una taza de vinagre", "c", "ClCheck", { props: { title: "La receta", items: ["1 taza vinagre · ½ harina · 2 cdas sal", "Al fuego hasta engrudo", "Untar grueso + film", "2 a 12 horas", "Cepillar bajo el agua", "Bicarbonato · calor · aceite"] } }),
  S(82, "La herramienta se termina seca y aceitada", "av", ""),
  // ── CTA 3
  C(83, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "la receta escrita + otras 9, gratis" }),
  // ── próximo
  S(84, "", "bi", "b_glueoil", { p: BI(`A bottle of white wood glue and a bottle of cooking oil next to a glass jar on a workbench.`) }),
  S(84, "La probé con la manguera", "bi", "b_hosetest", { p: BI(`A garden hose spraying water on a coated wooden board on a patio.`) }),
  C(84, "te muestro lo que pasó de verdad", "ClVideoRef", { thumb: I + "th_next.jpg", title: "Cola blanca + aceite: la manguera", next: true }),
  // ── cierre
  S(85, "", "av", ""),
  S(85, "El vecino ya me trajo una garlopa del abuelo", "bi", "b_neighborplane", { p: BI(`${NEIGHBOR} at a shed door holding up an old rusty wooden hand plane, grinning.`) }),
  S(86, "", "av", ""),
];
