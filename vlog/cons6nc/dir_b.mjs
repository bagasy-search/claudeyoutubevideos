// DIRECTOR B — cons6nc: el reposo (burbujas) + vaciar y mirar + segundo hervor y cepillo + no tirar la piedra por la pileta + los tres
// hervores de enjuague + el filtrito + CTA 2 + la tabla de cada cuánto + el calendario + no dejar agua + el hervidor por fuera + las
// camareras + las alternativas + lo que nunca (párr. 26-48).
import { C, B, ST, V, G, KET, SCALEK, CLEANK, HOME, SERV, ACID, I } from "./dir_a.mjs";
export const SHOTS = [
  // 361,4 · el reposo
  C(26, "Durante esos veinte minutos", "HvFizz"),
  B(26, "Y el agua se va poniendo turbia", "b_turbid", `Cloudy whitish water inside an open stainless steel kettle seen from above, tiny bubbles on the surface.`, { anim: "tiny bubbles rise to the surface" }),
  // 372,4 · vaciar y mirar
  B(27, "con el hervidor ya tibio", "b_lukewarm", `A bare hand resting flat on the side of ${KET} to feel if it is still warm, the cord unplugged beside it.`),
  V(27, "vacíe el agua en la pileta", "c07"),
  B(27, "Mire el fondo", "b_look", `${CLEANK}, a few drops of water on the steel, close view.`),
  B(27, "El fondo brilla", "b_shine", `${CLEANK}, the kitchen window reflected in the shiny steel.`),
  // 384,5 · segundo hervor
  B(28, "haga un segundo hervor con la misma mezcla", "b_second", `A tablespoon of white citric acid crystals poured into water inside an open stainless steel kettle, second time, close view.`, { anim: "crystals pour into the water" }),
  V(28, "un cepillo de botella, suave", "c06"),
  B(28, "La piedra ablandada sale sola", "b_soft", `Soft white limescale bits floating loose in a little water inside a stainless steel kettle, close view.`, { anim: "the loose bits drift slowly" }),
  // 401,4 · no por la pileta
  B(29, "Si se le sueltan pedazos grandes de piedra", "b_chunks", `Several large white limescale chunks on a folded paper towel next to a kitchen sink, close view.`),
  B(29, "Se juntan en el caño y lo tapan", "b_drain", `Close view of a kitchen sink drain strainer with white mineral bits caught in it.`),
  B(29, "Échelos a la basura", "b_bin", `A paper towel with white limescale chunks being dropped into a kitchen trash bin.`, { anim: "the paper towel drops into the bin" }),
  // 410,8 · el enjuague
  B(30, "el paso que no se saltea", "b_cleanwater", `A clear glass jug of clean water ready next to ${KET} on a steel counter in ${SERV}.`),
  V(31, "Llene el hervidor con agua limpia", "c04"),
  C(31, "Otra vez. Y otra vez", "HvThreeBoils"),
  B(32, "el ácido se queda en las paredes, en la tapa, en el filtro", "b_lid", `The underside of the black lid of an electric kettle and its small mesh spout filter, wet, close view.`),
  B(32, "el primer té le sabe a limón", "b_lemontea", `A white cup of tea with a thin slice of lemon floating in it on a kitchen table.`),
  V(32, "Esa agua es para la pileta", "c09"),
  // 442 · el filtrito
  B(33, "Y el filtrito", "b_spoutfilter", `Extreme close view of the small plastic-framed mesh filter inside the spout of a stainless steel electric kettle, white crust on the mesh.`),
  V(33, "Casi todos los hervidores tienen", "c08"),
  C(34, "Póngala en un vaso con agua caliente", "HvMeshSoak"),
  // 468,3 · CTA 2
  C(35, "están en El Frasco Marrón de Claudio", "ClBookPage", { page: I + "book_p31.png", pageNo: 31 }),
  B(35, "la tabla de cortar, la grasa y los olores", "b_board", `A worn wooden cutting board, a greasy stovetop pan and a small brown bottle with a plain blank label on a kitchen counter.`),
  B(35, "con otros noventa arreglos de la casa", "b_shelfcheap", `A pantry shelf with a jug of white vinegar, a box of baking soda, a brown bottle and ${ACID}, all with plain blank labels.`),
  B(35, "y el libro lo recupera", "b_newbox", `A new electric kettle in its cardboard box on a store shelf, no brand visible, a price tag with no readable numbers.`),
  C(35, "El link está en la primera línea", "ClQRCard", { qr: I + "qr.png", cover: I + "book_cover.png", head: "PÁGINA 31 · LA COCINA", text: "escanee con la cámara" }),
  // 496 · la tabla de cada cuánto
  B(36, "Cada cuánto lo tiene que hacer", "b_calendarwall", `A paper wall calendar hanging next to a kitchen sink, a pen on a string beside it.`),
  C(37, "Si su agua es muy dura", "HvCalendar"),
  B(37, "la piedra no llega a agarrarse", "b_thinfilm", `The inside bottom of a stainless steel kettle with only a very faint dusting of white, almost clean.`),
  B(39, "Y si es blanda", "b_glasssoft", `A dry, perfectly clear drinking glass on a windowsill, nothing left at the bottom.`),
  // 524,8 · el calendario
  B(40, "Había un calendario pegado en la pared", "b_hotelcal", `An old paper calendar taped to a tiled wall beside deep steel sinks in ${SERV}, several days marked with crosses.`),
  V(40, "Una crucecita en el calendario de la cocina", "c10"),
  // 540,2 · no dejar agua
  B(41, "no deje agua en el hervidor de un día para el otro", "b_overnight", `${KET} with leftover water in it on a dark kitchen counter at night, the window black.`),
  B(41, "el hervidor vacío y con la tapa abierta", "b_lidopen", `${KET}, empty, its lid left open to dry, on a kitchen counter in morning light.`),
  // 557,4 · por fuera
  B(42, "el hervidor por fuera", "b_outside", `Close view of dried white water spots on the outside of a stainless steel electric kettle around its spout and lid.`),
  B(43, "moje un paño en un poquito de la misma mezcla", "b_cloth", `A folded white cloth being wrung out over a small bowl of clear liquid on a kitchen counter.`, { anim: "the cloth is wrung, drops fall" }),
  B(43, "Páselo por afuera, sin acercarse a la base", "b_wipe", `A hand wiping the outside of ${KET} with a damp folded cloth, the power base pushed aside and dry, the cord unplugged.`, { anim: "the cloth wipes along the kettle" }),
  C(44, "En el hotel, el hervidor era lo primero", "ClGrainWipe"),
  B(43, "le queda como de vidriera", "b_showroom", `A spotless brushed stainless steel kettle gleaming on a kitchen counter, reflections of the window on its body.`),
  // 587,8 · el huésped tocaba
  B(44, "parecía sucio aunque estuviera limpio", "b_spots", `A small hotel room kettle with white water spots on its steel, on a tray with cups.`),
  B(44, "las camareras le pasaban el paño seco", "b_maid", `A hotel housekeeper in a light-blue uniform polishing a small electric kettle with a dry cloth in a guest room.`, { anim: "the cloth polishes the kettle" }),
  // 602,7 · las alternativas
  C(45, "Hay dos alternativas", "HvAltScale"),
  B(46, "El jugo de dos limones, colado", "b_lemons", `Two lemons squeezed through a small strainer into a glass jug on a kitchen counter.`, { anim: "the lemon is squeezed, juice drips" }),
  B(46, "deja un poco de olor si no enjuaga bien", "b_smell", `A cup of tea next to two squeezed lemon halves on a kitchen table.`),
  B(47, "O vinagre blanco, mitad vinagre y mitad agua", "b_vinhalf", `A clear jug of white vinegar with a plain blank label and a glass of water next to an open stainless steel kettle.`),
  C(48, "Y lo que nunca", "HvAltScale", { never: true }),
];
