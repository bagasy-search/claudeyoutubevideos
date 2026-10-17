// DIRECTOR C — clsangre: el 3er secreto (mirar antes de la secadora) + la mancha vieja + problemas + preguntas + errores + la cuenta +
// recap + CTA 3 + cierre con pregunta y callback a clcolchon (párr. 47-78).
import { S } from "../claudio/lib.mjs";
import { C, B, CL, ST, G, BROWN, SHEET, STAIN, LAUNDRY, HOTELROOM, ROSA, MANAGER, HALL, I } from "./dir_a.mjs";
export const SHOTS = [
  // ── 3er secreto: antes de la secadora
  C(47, "", "ClChapter", { n: 3, label: "SECRETO", title: "Antes de la secadora", sub: "mire" }),
  ST(48, "", "b_dryer2", "clothes dryer", `A clothes dryer.`),
  ST(48, "Déjela secar al aire", "b_clothesline", "white sheets clothesline", `White sheets drying on a clothesline.`),
  CL(49, "", "c_lookshadow", `He holds a dry white sheet up to the window light in ${LAUNDRY}, looking closely at one spot.`),
  B(49, "Si quedó una sombrita", "b_shadow", `Close view of a very faint pale brownish shadow on a dry white cotton sheet held against window light.`),
  ST(50, "el calor la cocina", "b_dryerheat", "dryer drum hot", `The drum of a clothes dryer.`),
  CL(51, "", "c_sign", `He looks at a handwritten paper sign taped to the wall next to a big dryer in ${LAUNDRY}, the writing unreadable.`),
  // ── la mancha vieja
  C(52, "", "ClChapter", { n: 6, label: "LA MANCHA VIEJA", title: "¿Ya pasó por la secadora?", sub: "todavía hay una vuelta" }),
  ST(53, "", "b_soak", "soaking clothes basin water", `Clothes soaking in a basin of water.`),
  C(53, "toda la noche en agua fría", "ClTwoDays", { d1: ["DE NOCHE", "Agua fría", "con jabón, sumergida", "#3E6E8E"], d2: ["A LA MAÑANA", "Frasco marrón", "5 min · trapo blanco", "#8B5A2B"], stamp: "Varias vueltas" }),
  ST(54, "A la mañana", "b_morning", "morning window light", `Morning light through a window.`),
  ST(55, "Tenga paciencia", "b_patience", "folding laundry", `Hands folding laundry.`),
  // ── problemas
  C(56, "", "ClChapter", { n: 7, label: "LA VIDA REAL", title: "Lo que me cuentan", sub: "y qué hacer" }),
  ST(57, "", "b_bleachpour", "pouring bleach", `Pouring bleach, plain bottle.`),
  B(57, "Le deja una mancha blanca peor que la de sangre", "b_bleachspot", `Close view of a navy blue cotton shirt with a pale bleached-out spot on it.`),
  ST(58, "", "b_mattress2", "mattress bed", `A bare mattress on a bed.`),
  ST(58, "Agua fría con un trapo, sin empapar", "b_dampcloth", "damp cloth wiping", `Wiping with a damp cloth.`),
  ST(59, "", "b_jeans", "blue jeans", `A pair of blue jeans.`),
  ST(59, "Pruebe en el dobladillo de adentro", "b_jeanshem", "jeans hem inside", `The inside hem of jeans.`),
  ST(60, "", "b_laundrybasket", "laundry basket", `A laundry basket.`),
  // ── preguntas
  CL(61, "", "c_qa", `He sits on a stool in ${LAUNDRY}, elbows on knees, talking to the camera with a friendly smile.`),
  ST(62, "Tibia ya empieza a cocinar", "b_warmtap", "warm water tap", `Water running from a tap.`),
  C(63, "", "ClNeverMix", { a: "Cloro", b: "Agua oxigenada", verdict: "Nunca" }),
  C(63, "Está en la tabla de la página siete", "ClBookPage", { page: I + "book_p7.jpg", pageNo: 7, stamp: "Primera fila" }),
  ST(64, "", "b_cabinet", "medicine cabinet bottles", `Bottles in a cabinet.`),
  ST(64, "Si cuando lo echa ya no hace espuma", "b_nofoam", "pouring liquid fabric", `Pouring liquid onto fabric.`),
  // ── errores
  C(65, "", "ClChapter", { n: 5, label: "EN EL HOTEL", title: "Los errores", sub: "que vi con la sangre" }),
  ST(66, "Agua caliente", "b_hotpot", "industrial washing machine hot", `An industrial washing machine running hot.`),
  ST(67, "", "b_scrub", "scrubbing fabric", `Scrubbing fabric hard.`),
  ST(68, "", "b_faucetfront", "rinsing fabric faucet", `Rinsing fabric under a faucet.`),
  ST(69, "", "b_dryerload", "loading dryer", `Loading clothes into a dryer.`),
  ST(70, "", "b_wool", "wool sweater", `A wool sweater.`),
  // ── la cuenta
  C(71, "", "ClReceipt", { lines: [["Sábanas nuevas", "un juego"], ["Agua fría", "la de la canilla"], ["Agua oxigenada", "un chorrito"], ["Tiempo", "5 minutos"]] }),
  ST(71, "En esta casa no hay villanos, hay aritmética", "b_calc", "calculator receipt glasses table", `A calculator, a receipt and reading glasses on a table.`),
  CL(72, "", "c_managersmile", `${MANAGER} closes his notebook and nods with a small smile next to him in ${HALL}.`),
  C(72, "casi no volvió a anotar", "ClNotebook", { title: "La libreta del gerente", rows: [{ k: "Mayo", v: "sábanas dadas de baja: 1" }, { k: "Junio", v: "—" }], strike: true, note: "la pileta de agua fría" }),
  // ── recap
  C(73, "", "ClCheck", { title: "Todo en 30 segundos", items: ["Agua fría, del revés, ya", "Pruebe la tela", "Agua oxigenada, 5 minutos", "Trapo blanco: apriete", "Lave en frío, seque al aire", "Mire antes de la secadora"] }),
  ST(73, "Trapo blanco", "b_recapblot", "blotting white cloth", `Blotting with a white cloth.`),
  ST(73, "seque al aire", "b_recapline", "sheets drying outside", `Sheets drying outside.`),
  // ── CTA 3
  CL(74, "", "c_bookshow2", `He holds a thick printed spiral-bound book with a plain brown cover open to a page in ${LAUNDRY}, pointing at a line with his gloved finger.`),
  C(74, "La sangre en la página veinte", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "94 ARREGLOS · PÁGINAS 7 Y 20", text: "el link está abajo" }),
  // ── cierre
  CL(75, "", "c_shelfbottle", `He places a small ${BROWN} on a laundry shelf next to a box of laundry soap and nods to the camera.`),
  ST(75, "Las manchas frescas son las fáciles", "b_laundryshelf", "laundry room shelf", `A laundry room shelf.`),
  CL(76, "", "c_phonecomments", `He sits on a bench in a hotel staff room reading comments on his phone with reading glasses, smiling.`),
  C(77, "", "ClVideoRef", { thumb: I + "th_clcolchon.jpg", title: "La mancha del colchón", tag: "ya en el canal", next: true }),
  CL(78, "", "c_wave", `He folds a clean white sheet on a table in ${LAUNDRY} and gives the camera a small nod goodbye.`),
  ST(78, "en agua caliente", "b_hotend", "hot water tap steam", `Hot water from a tap.`),
];
