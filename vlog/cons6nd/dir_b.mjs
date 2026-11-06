// DIRECTOR B — cons6nd: método dos (¼ vinagre + ¾ destilada, sólo si el manual lo permite) + vaciar + las llenadas de destilada (el
// comentario de la señora) + la suela fría + la pasta + el hisopo + según la suela + CTA 2 + la prueba del trapo (premio) + la camisa +
// para que no vuelva + el cuarto de planchado (párr. 23-46).
import { ST, C, B, V, IRON, SHIRT, BOARD, HOME, IROOM, ROSA, MANAGER, DIST, VIN, I } from "./dir_a.mjs";
export const SHOTS = [
  // 315 · método dos
  B(23, "sin botón de autolimpieza", "b_plainiron", `An older simple steam iron with no extra buttons on an ironing board.`),
  ST(23, "y sólo si el manual no prohíbe el vinagre", "b_manualread", "reading instruction manual", `A finger following a line in a small appliance instruction booklet, the text not readable.`),
  C(24, "En una jarrita", "PlRatioJug"),
  B(24, "Un cuarto de vinagre, tres cuartos de agua", "b_pourvin", `White vinegar poured into a small clear measuring jug up to the first quarter mark, ${DIST} beside it.`, { anim: "the vinegar pours into the jug" }),
  // 335 · vapor
  V(25, "Llene el depósito con esa mezcla", "d04"),
  B(25, "sobre la pileta o el trapo viejo, dele vapor", "b_sinksteam", `A steam iron held level over a white laundry sink, steam rising from its soleplate.`, { anim: "steam rises from the soleplate" }),
  B(25, "Apriete el botón del vapor varias veces", "b_pump", `A thumb pumping the steam button of an iron held over a sink, close view.`),
  B(25, "de la cámara y de los conductos", "b_flakessink", `White flakes and cloudy drops falling from an iron soleplate into a sink, close view.`),
  // 356 · vaciar
  V(26, "Después, desenchúfela, déjela enfriar", "d06"),
  // 362 · llenadas de destilada
  B(27, "Y ahora lo más importante", "b_distjug", `${DIST} next to a steam iron on a laundry counter.`),
  B(27, "caliente la plancha, y dele vapor sobre la pileta hasta vaciarla", "b_clearsteam", `Clean steam rising from an iron held over a white sink, clear drops falling.`),
  ST(27, "Y otra vez", "b_refill", "pouring water iron", `Distilled water poured from a small jug into the fill hole of a steam iron.`, { anim: "water pours into the iron" }),
  // 378 · la señora
  B(28, "Una señora contaba en los comentarios", "b_phone", `Weathered hands holding a phone over a wooden workbench, the screen glowing, the screen content blurred.`),
  ST(28, "Le faltaron estos enjuagues", "b_newbox", "appliance store shelf", `A new steam iron in its cardboard box on a store shelf, no brand visible, a price tag with no readable numbers.`),
  C(28, "Si le sigue saliendo turbia", "PlRinses"),
  // 398 · por fuera
  C(30, "Toque con el dorso de la mano", "PlColdCheck"),
  // 418 · la pasta
  C(31, "Haga una pasta con dos cucharadas", "PlSolePaste"),
  V(31, "Póngala sobre un paño de algodón suave", "d08"),
  // 434 · el hisopo
  B(32, "Y los agujeritos del vapor", "b_holes", `Extreme close view of the steam holes on a cold iron soleplate, some rimmed with white crust.`),
  V(32, "Moje un hisopo", "d07"),
  C(32, "y páselo por cada agujerito", "PlHoleSwab"),
  // 449 · paño húmedo
  B(33, "con agua limpia para sacar", "b_dampcloth", `A damp white cloth wiping a cold steam iron soleplate, the iron unplugged and lying on its side.`, { anim: "the cloth wipes the soleplate" }),
  B(33, "Fíjese que no quede pasta adentro", "b_holeclean", `Close view of clean steam holes on a shiny soleplate, no paste left.`),
  // 462 · según la suela
  B(34, "Y según su suela", "b_soles", `Three steam irons lying on their sides on a table showing their soleplates: a dark one, a light ceramic one and a steel one.`),
  C(34, "Nunca la esponja verde", "PlNoScratch"),
  B(34, "Una raya en la suela engancha la tela", "b_snag", `A pulled thread on ${SHIRT} snagged by a scratched iron soleplate, close view.`),
  // 481 · CTA 2
  C(35, "la proporción y la pasta", "ClBookPage", { page: I + "book_p36.png", pageNo: 36 }),
  B(35, "reemplazan gastos de cien", "b_ruined", `A ruined white shirt with a brown iron mark and a new iron in a box side by side on a table.`),
  C(35, "El link está en la primera línea de la descripción", "ClQRCard", { qr: I + "qr.png", cover: I + "book_cover.png", head: "PÁGINA 36 · EL LAVADERO", text: "escanee con la cámara" }),
  // 519 · la prueba del trapo
  B(36, "Y ahora, el premio", "b_rosarag", `${ROSA} holding up an old white cotton rag to the light in ${IROOM}.`),
  ST(37, "Antes de planchar ropa buena", "b_goodshirt", "white shirt hanger door", `${SHIRT} hanging on a door, crisp and clean, waiting to be ironed.`),
  C(37, "y planche un trapo viejo de algodón blanco", "PlRagTest"),
  B(38, "Si aparece una mancha, una sola", "b_ragspot", `A single small gray water spot on an old white cotton rag on an ironing board, close view.`),
  // 546 · la camisa
  V(39, "Y ahora sí, la camisa blanca", "d09"),
  ST(39, "Así salían las camisas del cuarto de planchado", "b_rackwhite", "white shirts hangers", `A rolling rack of crisp white shirts on hangers in ${IROOM}.`),
  // 562 · para que no vuelva
  V(41, "Con la plancha todavía tibia, sobre la pileta", "d10"),
  C(41, "El agua que se queda quieta adentro", "PlEmptyTank"),
  B(42, "La destilada no tiene piedra", "b_distpour", `${DIST} being poured into a steam iron on an ironing board.`),
  C(43, "Guárdela siempre parada", "PlParked"),
  // 598 · las camisas del hotel
  B(45, "Y una palabra sobre las camisas del hotel", "b_guestshirt", `A white guest shirt in a clear dry-cleaning bag hanging on a hotel room door.`),
  B(45, "y cada mancha era una queja", "b_complaint", `A hotel complaint form on a front desk with a pen, the text not readable.`),
  B(46, "que estaba al lado de la tabla", "b_jugboard", `${DIST} standing beside ${BOARD} in ${IROOM}.`),
  C(46, "Y al terminar el turno, cada planchadora", "PlIronRow"),
  B(46, "Si encontraba una con agua", "b_rosacheck", `${ROSA} lifting a steam iron from a shelf and looking into its water tank.`),
];
