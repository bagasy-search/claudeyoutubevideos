// DIRECTOR B — cljuntas: lo que necesita + paso 1 (la pasta en el momento, 1er secreto) + paso 2 (la pasta en las juntas) + paso 3
// (esperar) + paso 4 (frotar, esponja, cambiar el agua) + CTA 2 + paso 5 (si sigue gris / la junta gastada de verdad) (párr. 22-49).
import { S } from "../claudio/lib.mjs";
import { C, B, CL, ST, G, BROWN, SODA, SOAP, FLOOR, DIRTYG, CLEANG, HOTELBATH, I } from "./dir_a.mjs";
export const SHOTS = [
  // ── lo que necesita
  C(22, "", "ClChapter", { n: 2, label: "LO QUE NECESITA", title: "Pocas cosas", sub: "casi todas en casa" }),
  CL(23, "", "c_kit", `He lays out on a bathroom counter in ${HOTELBATH}: ${SODA}, ${BROWN}, ${SOAP}, a narrow stiff grout brush, a bowl, a sponge and a bucket of clean water.`),
  ST(23, "Bicarbonato", "b_sodabox", "baking soda box", `${SODA}.`),
  ST(23, "Agua oxigenada al tres por ciento", "b_brownbottle", "brown medicine bottle", `${BROWN}.`),
  ST(23, "Detergente de platos", "b_dishsoap", "dish soap bottle", `${SOAP}.`),
  ST(23, "Un cepillo de juntas", "b_groutbrush", "grout cleaning brush", `A narrow stiff grout brush.`),
  ST(23, "y un balde de agua limpia", "b_bucket", "bucket clean water", `A bucket of clean water.`),
  ST(24, "", "b_gloves", "putting on rubber gloves", `Putting on cleaning gloves.`),
  ST(24, "una toalla doblada abajo se agradece", "b_kneetowel", "folded towel floor", `A folded towel on a tiled floor.`),
  C(25, "", "ClDoDont", { yes: { label: "Cepillo de juntas", img: I + "b_groutbrush.jpg" }, no: { label: "Cepillo de alambre", img: I + "b_wirebrush.jpg" } }),
  ST(25, "ni cepillo de alambre", "b_wirebrush", "wire brush", `A wire brush.`),
  // ── paso 1: la pasta (1er secreto)
  C(26, "", "ClChapter", { n: 1, label: "PASO", title: "La pasta", sub: "justo antes" }),
  CL(27, "", "c_measure", `He pours half a cup of baking soda into a bowl on a bathroom counter in ${HOTELBATH}.`),
  ST(27, "Agregue un cuarto de taza de agua oxigenada", "b_pourbowl", "pouring liquid into bowl", `Pouring a clear liquid into a bowl of white powder.`),
  ST(27, "Y una cucharadita de detergente de platos", "b_soapdrop", "dish soap drop", `A drop of green dish soap.`),
  ST(28, "", "b_stirpaste", "stirring white paste spoon", `Stirring a thick white paste with a spoon.`),
  ST(28, "como una pasta de dientes", "b_toothpaste", "toothpaste closeup", `Toothpaste on a brush.`),
  C(29, "", "ClChapter", { n: 1, label: "SECRETO", title: "En el momento", sub: "nunca en botella cerrada" }),
  ST(29, "Esta pasta se hace en el momento", "b_freshpaste", "mixing paste bowl", `Mixing a paste in a bowl.`),
  ST(29, "Nunca la guarde en una botella cerrada", "b_closedbottle", "closed plastic bottle cap", `A closed plastic bottle.`),
  ST(30, "", "b_fizz", "fizzing foam bubbles", `White foam fizzing.`),
  C(30, "En una botella tapada, el gas no tiene por dónde salir", "ClDoDont", { yes: { label: "En el bol", img: I + "b_stirpaste.jpg" }, no: { label: "Botella cerrada", img: I + "b_closedbottle.jpg" } }),
  ST(31, "", "b_floorarea", "bathroom floor tiles", `A bathroom tiled floor.`),
  ST(31, "haga otra tanda", "b_secondbowl", "mixing bowl", `A mixing bowl on a counter.`),
  // ── paso 2: la pasta en las juntas
  C(32, "", "ClChapter", { n: 2, label: "PASO", title: "La pasta", sub: "en las juntas" }),
  CL(33, "", "c_brushpaste", `He brushes white paste along the grout lines of ${FLOOR} with a narrow grout brush, kneeling.`, { anim: "he brushes paste along the grout line" }),
  B(33, "Que entre bien en la línea", "b_pasteline", `Extreme close view of white paste pressed into a dark gray grout line between beige floor tiles.`),
  ST(34, "", "b_pastetile", "paste on tiles", `White paste smeared on tiles.`),
  B(35, "", "b_foamgrout", `Extreme close view of fine white foam fizzing on a gray grout line between beige floor tiles.`),
  C(35, "la espuma se mete en los agujeritos", "ClGroutPores", { phase: "foam" }),
  // ── paso 3: esperar
  C(36, "", "ClChapter", { n: 3, label: "PASO", title: "Espere", sub: "diez a quince minutos" }),
  C(37, "", "ClTimer30", { minutes: 15, label: "Sin frotar", text: "que trabaje sola" }),
  ST(37, "Deje que la pasta trabaje sola", "b_waitclock", "wall clock", `A wall clock.`),
  ST(38, "", "b_window", "opening bathroom window", `Opening a bathroom window.`),
  ST(38, "prenda el extractor del baño", "b_fan", "bathroom exhaust fan", `A bathroom exhaust fan.`),
  ST(39, "", "b_marble", "marble floor", `A white marble floor.`),
  CL(39, "Pruebe primero en un rincón", "c_cornertest", `He dabs a little liquid on a corner of a marble floor with a cloth, kneeling in a bathroom.`),
  // ── paso 4: frotar y enjuagar
  C(40, "", "ClChapter", { n: 4, label: "PASO", title: "Frote y enjuague", sub: "con agua limpia" }),
  CL(41, "", "c_scrub", `He scrubs a grout line with a narrow grout brush, kneeling on ${FLOOR}.`, { anim: "he scrubs the grout line" }),
  ST(41, "La mugre ya está floja", "b_scrubclose", "scrubbing grout brush closeup", `Close view of a brush scrubbing grout.`),
  CL(42, "", "c_sponge", `He wipes the floor tiles with a sponge from a bucket of clean water, kneeling on ${FLOOR}.`),
  ST(42, "cambie el agua del balde seguido", "b_dumpbucket", "pouring dirty water bucket", `Pouring dirty water out of a bucket.`),
  ST(43, "", "b_dirtywater", "dirty water bucket", `A bucket of gray dirty water.`),
  C(43, "El agua gris del balde es la misma mugre", "ClDoDont", { yes: { label: "Agua limpia", img: I + "b_bucket.jpg" }, no: { label: "Agua gris", img: I + "b_dirtywater.jpg" } }),
  ST(44, "", "b_wetfloor", "wet tile floor", `A wet tiled floor.`),
  B(44, "Recién seca le dice la verdad", "b_dryclean", `${CLEANG}, the floor fully dry, daylight.`),
  // ── CTA 2
  C(45, "Las juntas en la página diecinueve", "ClBookPage", { page: I + "book_p19.jpg", pageNo: 19, stamp: "Las juntas" }),
  C(45, "y noventa y cuatro arreglos de la casa", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "94 ARREGLOS · PÁGINAS 7 Y 19", text: "el link está abajo" }),
  S(45, "por menos de lo que cuesta", "av", ""),
  // ── paso 5: si sigue gris
  C(46, "", "ClChapter", { n: 5, label: "PASO", title: "¿Sigue gris?", sub: "otra vuelta" }),
  C(47, "", "ClTwoDays", { d1: ["VUELTA 1", "Lo de arriba", "pasta · 15 min", "#3E6E8E"], d2: ["VUELTA 2", "Lo de adentro", "pasta · 15 min", "#3E6E8E"], stamp: "Juntas viejas" }),
  B(48, "", "b_crumble", `Extreme close view of an old grout line crumbling into small pieces under a grout brush, sunken between two floor tiles.`),
  ST(48, "y la junta se hunde", "b_cracked", "cracked grout tiles", `Cracked old grout between tiles.`),
  ST(49, "Ésa hay que rehacerla", "b_regrout2", "applying new grout float", `Applying new grout with a rubber float.`),
  B(49, "estaba sucia", "b_clean2", `${CLEANG} in ${HOTELBATH}.`),
];
