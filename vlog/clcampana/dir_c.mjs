// DIRECTOR C — clcampana: el 3er secreto (la pinza: el error que quema) + problemas + preguntas + errores + la cuenta + recap + CTA 3 +
// cierre con pregunta y callback a clbandeja (párr. 56-85).
import { S } from "../claudio/lib.mjs";
import { C, B, CL, ST, G, BROWN, SODA, SOAP, KITCHEN, HOTELKITCHEN, HOOD, DIRTY, CLEAN, BAFFLE, MESH, POT, RAMIRO, MANAGER, HALL, I } from "./dir_a.mjs";
export const SHOTS = [
  // ── el 3er secreto: la pinza
  C(56, "", "ClChapter", { n: 3, label: "SECRETO", title: "La pinza", sub: "el error que quema" }),
  B(57, "", "b_handreach", `A bare hand reaching toward a metal filter sticking out of a steaming boiling pot, stopping short.`),
  ST(57, "o con una esponja", "b_spongepot", "sponge stove pot", `Ordinary real footage that shows sponge stove pot.`),
  ST(57, "la grasa caliente se pega a la piel", "b_hotgreasedrop", "hot oil drops metal", `Close view of hot grease drops on a steaming metal filter.`),
  ST(58, "", "b_youngcook", "young cook kitchen apron", `Ordinary real footage that shows young cook kitchen apron.`),
  ST(58, "Lo agarró con un repasador mojado", "b_wettowel", "kitchen towel stove", `A wet kitchen towel next to a boiling pot on the stove.`),
  ST(58, "el filtro le cayó sobre la mano", "b_droppedfilter", "kitchen floor steam", `Ordinary real footage that shows kitchen floor steam.`),
  CL(59, "", "c_ramirowater", `He stands next to ${RAMIRO}, who holds a young kitchen assistant's hand under a cold running tap at a stainless sink in ${HOTELKITCHEN}.`),
  ST(59, "colgó una pinza larga", "b_tongshook", "kitchen tongs hook wall", `Ordinary real footage that shows kitchen tongs hook wall.`),
  ST(59, "para los filtros", "b_note", "paper note wall", `A small blank paper note taped to a tiled kitchen wall above a hook with tongs.`),
  C(60, "", "ClDoDont", { yes: { label: "Pinza larga", img: I + "b_tongs.jpg" }, no: { label: "La mano", img: I + "b_handreach.jpg" } }),
  C(60, "un minuto en la pileta", "ClTimer30", { minutes: 1, label: "En la pileta", fast: true }),
  ST(61, "", "b_backburner", "pot back burner steam", `Ordinary real footage that shows pot back burner steam.`),
  ST(61, "con el mango para adentro", "b_handlein", "pot handle stove", `Ordinary real footage that shows pot handle stove.`),
  // ── problemas
  C(62, "", "ClChapter", { n: 6, label: "LA VIDA REAL", title: "Lo que me cuentan", sub: "y qué hacer" }),
  ST(63, "", "b_bigfilter", "range hood filter", `Ordinary real footage that shows range hood filter.`),
  ST(63, "Use la asadera más grande del horno", "b_roastpan", "roasting pan stove", `Ordinary real footage that shows roasting pan stove.`, { anim: "the water bubbles in the pan" }),
  ST(64, "", "b_darkalu2", "aluminum mesh filter", `Ordinary real footage that shows aluminum mesh filter.`),
  ST(64, "y funciona igual", "b_aluinhood", "range hood filter", `Ordinary real footage that shows range hood filter.`),
  ST(65, "", "b_spots", "dirty metal filter", `Ordinary real footage that shows dirty metal filter.`),
  CL(65, "Otra olla, otros diez minutos", "c_secondround", `He puts a filter back into a boiling pot with tongs in ${HOTELKITCHEN}.`),
  B(66, "", "b_carbon", `A black charcoal range hood filter pad, rectangular, like a dark sponge, on a counter.`),
  ST(66, "Ése no se lava: se cambia", "b_newcarbon", "charcoal filter", `Ordinary real footage that shows charcoal filter.`),
  ST(66, "Mire el manual", "b_manual", "appliance manual", `Ordinary real footage that shows appliance manual.`),
  ST(67, "", "b_stillsmoke", "smoke kitchen hood", `Smoke hanging in a kitchen near a range hood with clean filters.`),
  // ── preguntas
  CL(68, "", "c_qa", `He sits on a stool in ${HOTELKITCHEN}, elbows on knees, talking to the camera with a friendly smile.`),
  B(69, "", "b_dishwasher", `${BAFFLE} standing alone in the lower rack of an open dishwasher.`),
  C(69, "El de aluminio, no", "ClDoDont", { yes: { label: "Acero: sí", img: I + "b_dishwasher.jpg" }, no: { label: "Aluminio: no", img: I + "b_darkalu.jpg" } }),
  C(70, "", "ClNeverMix", { a: "Cloro", b: "Otro limpiador", verdict: "Gas" }),
  C(70, "La tabla de lo que nunca se mezcla", "ClBookPage", { page: I + "book_p7.jpg", pageNo: 7, stamp: "Primera fila" }),
  ST(71, "", "b_cookingdaily", "cooking pot pan gas stove", `Ordinary real footage that shows cooking pot pan gas stove.`),
  ST(71, "Si fríe mucho", "b_frying", "deep frying oil", `Ordinary real footage that shows deep frying oil.`, { anim: "the oil bubbles" }),
  // ── errores
  C(72, "", "ClChapter", { n: 5, label: "EN EL HOTEL", title: "Los errores", sub: "que vi con las campanas" }),
  B(73, "", "b_coldrinse", `A greasy filter under a cold tap, the grease turning white and hard.`),
  ST(74, "", "b_steelwoolhood", "scratched stainless steel", `Ordinary real footage that shows scratched stainless steel.`),
  ST(75, "", "b_darkalu3", "aluminum mesh closeup", `Close view of the darkened, dull mesh of an aluminum filter after boiling.`),
  ST(76, "", "b_flamecloth", "gas burner flame towel", `Ordinary real footage that shows gas burner flame towel.`),
  ST(77, "", "b_handback", "hand steam pot", `Ordinary real footage that shows hand steam pot.`),
  // ── la cuenta
  C(78, "", "ClReceipt", { lines: [["Filtros nuevos", "los filtros"], ["Visita del técnico", "la visita"], ["Bicarbonato", "½ taza"], ["Detergente", "un chorro"], ["La olla", "la que tiene"]] }),
  ST(78, "En esta casa no hay villanos, hay aritmética", "b_calc", "calculator receipt glasses table", `Ordinary real footage that shows calculator receipt glasses table.`),
  ST(78, "Del otro, media taza de bicarbonato", "b_sodacup", "baking soda measuring cup", `Ordinary real footage that shows baking soda measuring cup.`),
  CL(79, "", "c_managersmile", `${MANAGER} closes his notebook and nods with a small smile next to him in ${HALL}.`),
  C(79, "casi no volvió a anotar", "ClNotebook", { title: "La libreta del gerente", rows: [{ k: "Enero", v: "olor a fritura" }, { k: "Febrero", v: "—" }, { k: "Marzo", v: "—" }], strike: true, note: "la olla, un lunes por mes" }),
  // ── recap
  C(80, "", "ClCheck", { title: "Todo en 30 segundos", items: ["Campana apagada, filtros afuera", "¿Acero o aluminio?", "Acero: olla + ½ taza de bicarbonato", "Aluminio: agua caliente, sin hervir", "Pinza, cepillo, a secar", "Carcasa: trapo caliente, a favor"] }),
  ST(80, "Acero: olla hirviendo", "b_recapsteel", "boiling pot steam", `Ordinary real footage that shows boiling pot steam.`),
  ST(80, "Aluminio: agua caliente con detergente", "b_recapalu", "soapy water sink", `Ordinary real footage that shows soapy water sink.`),
  ST(80, "Sáquelo con la pinza", "b_recaptongs", "tongs sink", `Ordinary real footage that shows tongs sink.`),
  ST(80, "Y la carcasa", "b_recaphood", "stainless steel range hood clean", `Ordinary real footage that shows stainless steel range hood clean.`),
  // ── CTA 3
  CL(81, "", "c_bookshow2", `He holds a thick printed spiral-bound book with a plain brown cover open to a page in ${HOTELKITCHEN}, pointing at a line with his gloved finger.`),
  C(81, "La cocina desde la página treinta y uno", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "94 ARREGLOS · PÁGINAS 7, 31 Y 35", text: "el link está abajo" }),
  // ── cierre
  CL(82, "", "c_holdfilter", `He holds a clean filter up to the window light in ${HOTELKITCHEN} and smiles.`),
  ST(82, "mírelo a contraluz", "b_backlit2", "sunny kitchen window", `Ordinary real footage that shows sunny kitchen window.`),
  CL(83, "", "c_phonecomments", `He sits on a bench in a hotel staff room reading comments on his phone with reading glasses, smiling.`),
  B(83, "¿su filtro es de acero o de aluminio?", "b_twotypes", `${BAFFLE} and ${MESH} side by side on a white kitchen towel.`),
  C(84, "", "ClVideoRef", { thumb: I + "th_clbandeja.jpg", title: "Las bandejas del horno", tag: "ya en el canal", next: true }),
  ST(84, "un poco más abajo", "b_oventray", "dirty oven tray", `Ordinary real footage that shows dirty oven tray.`),
  CL(85, "", "c_wave", `He hangs long tongs back on a hook in ${HOTELKITCHEN} and gives the camera a small nod goodbye.`),
  ST(85, "ponga un filtro abajo del agua fría", "b_coldtap2", "hand cold water tap", `A hand about to put a greasy filter under a cold running kitchen tap.`),
];
