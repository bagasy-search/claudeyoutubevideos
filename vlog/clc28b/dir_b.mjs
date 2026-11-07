// DIRECTOR B — clc28b: punto 4 (agua oxigenada, nunca juntos) · 5 (bicarbonato) · 6 (secar, triángulo, dorso de la mano) · 7 (pintura
// después) · re-gancho · 8 (condensación, vaso frío, vidrios) · 9 (los 5 cm, tacos, la libreta) · 10 (metro cuadrado, Don Ramiro) — párr. 18-40.
import { G, ROOM, HOTEL, MOLD, SPRAY, VINEGAR, H2O2, C, B, ST, V } from "./dir_a.mjs";
const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie, holding a small black notebook";
const RAMIRO = "Don Ramiro, an elderly hotel guest in his seventies with a gray mustache, a heavy brown winter coat and a wool scarf";
export const SHOTS = [
  // 285,7 · punto 4
  B(18, "Para cuando el vinagre no le gusta", "b_nosmell", `A woman in a bedroom wrinkling her nose and waving a hand in front of her face next to ${SPRAY}, a wall with dark spots behind her.`),
  B(18, "o la pared es clara", "b_palewall", `A pale pastel cream bedroom wall with gray mold spots near a white window frame, a soft white curtain drawn aside.`),
  B(19, "Agua oxigenada al tres por ciento", "b_h2o2", `${H2O2} on a pharmacy counter next to a small paper bag and coins, a pharmacist's hand sliding it forward.`),
  B(19, "Pura, en otro atomizador", "b_twosprays", `Two clear spray bottles with plain blank labels on a bedroom floor, one with a strip of red tape on it and one with blue tape, ${G} picking one up.`),
  // 302 · burbujea · nunca juntos
  C(19, "y burbujea un poquito", "MwFizz"),
  B(19, "Y después se cepilla", "b_brushfizz", `${G} brushing a wall where tiny white bubbles fizz over gray mold spots, a soft brush wet with foam.`),
  C(20, "Y acá le pido algo muy en serio", "MwOneADay"),
  // 315,6 · cloro aparte
  B(20, "mezcla con cloro", "b_bleachhigh", `A white bleach jug with a plain blank label set alone on a high laundry shelf, far from a vinegar jug and a brown bottle on a lower shelf, a hand pushing it to the back.`),
  B(20, "suelta un gas", "b_cough", `A man in a small bathroom covering his mouth and nose with the crook of his elbow, eyes squinting, a bleach jug and a vinegar bottle on the edge of the sink.`),
  B(20, "Si ya le había echado cloro", "b_bleachedwall2", `A bedroom wall with a pale bleached patch and a wide open window beside it, ${G} holding a dry cloth, a bleach jug on the floor.`),
  B(20, "espere un día, ventile", "b_calendar", `A paper wall calendar hanging on a kitchen wall seen at an angle, one day circled in red pen, the numbers too small to read, a pen hanging on a string.`),
  // 332,5 · punto 5
  C(21, "Punto cinco", "ClChapter", { n: 5, title: "El bicarbonato", sub: "para la sombra que queda", label: "PUNTO" }),
  B(22, "A veces, después del vinagre", "b_afterviny", `A cream bedroom wall right after cleaning, still damp, ${SPRAY} on the floor by the baseboard and a soft brush on a folded rag.`),
  B(22, "queda una sombra gris en la pintura", "b_grayshadow2", `A soft gray stain left on the paint of a cream wall where mold was, ${G} touching its edge with one finger.`),
  // 348,8 · la pasta suave
  C(22, "y con una esponja apenas mojada", "MwShadowLift"),
  ST(22, "El bicarbonato es un abrasivo muy suave", "s_soda", "baking soda spoon", `A spoon scooping white baking soda powder from a box.`),
  B(22, "y además deja la pared", "b_drywipe", `${G} wiping a clean cream wall with a dry folded microfiber cloth, a glass of cloudy water with a spoon on a chair.`),
  // 364,1 · punto 6
  C(23, "Punto seis", "ClChapter", { n: 6, title: "Secar y ventilar", sub: "la mitad del trabajo", label: "PUNTO" }),
  ST(23, "y la mitad que todo el mundo se salta", "s_fanroom", "electric fan room", `An electric fan turning in a room.`),
  C(24, "El moho necesita tres cosas", "MwTriangle"),
  // 379,6 · sin humedad no prende
  C(24, "pero si la pared sigue húmeda", "MwTriangle", { cut: true }),
  B(24, "Así que, después de limpiar", "b_drying", `A cleaned bedroom wall drying with a wardrobe pulled far away from it, sunlight coming through the window, a damp patch shrinking near the baseboard.`),
  ST(24, "Ventana abierta", "s_openwide", "opening window morning", `A hand opening a window wide on a cold morning.`),
  // 394,8 · ventilador, estufa · el dorso de la mano
  B(24, "apuntando a la pared una hora", "b_fanwall", `A small white electric fan on the floor of a bedroom pointed at a freshly cleaned wall, a wardrobe pushed to the middle of the room.`),
  B(24, "o la estufa en la habitación", "b_heater", `A small electric oil heater with its orange light on in a bedroom, the bedroom door open to the hallway, a cleaned wall beside it.`),
  V(25, "¿Cómo sabe que está seca?", "v09"),
  C(25, "La toca con el dorso de la mano", "MwBackHand"),
  // 411,3 · punto 7
  C(26, "Punto siete", "ClChapter", { n: 7, title: "La pintura antihongos", sub: "y cuándo", label: "PUNTO" }),
  B(26, "porque todo el mundo la usa", "b_paintcan", `An open can of white paint with a plain blank label, a roller tray and a roller on a newspaper on a bedroom floor next to a wall with gray mold spots.`),
  B(27, "La pintura antihongos sirve", "b_roller", `${G} rolling fresh white paint on a clean dry cream bedroom wall with a paint roller, wet paint glistening.`),
  // 427,4 · pintar encima = ampollas
  C(27, "Si usted pinta encima del moho vivo", "MwBlister", { bed: "-" }),
  B(27, "hasta que le levanta la pintura en ampollas", "b_blisters", `Real paint blisters and bubbles lifting on a bedroom wall, some cracked open showing black mold underneath, a fingertip pressing one.`),
  // 443,4 · re-gancho · punto 8
  B(28, "Y ahora viene lo que nadie le explica", "b_moldmacro", `Very close view of black mold spots on cream wall paint, little fuzzy dots of different sizes, a fingertip of ${G} at the edge of the frame for scale.`),
  ST(28, "Porque si no corta la causa", "s_frostwin", "winter window frost", `Frost and condensation on a window pane on a cold winter morning.`),
  B(28, "pared cada invierno de su vida", "b_scrubagain", `A tired older woman in a wool cardigan scrubbing the same black mold spots on a bedroom wall again with a sponge, a bucket at her feet, winter light from the window.`),
  C(29, "Punto ocho", "ClChapter", { n: 8, title: "La condensación", sub: "la prueba del vaso frío", label: "PUNTO" }),
  // 460,3 · viene del aire · el aliento
  B(30, "no viene de un caño roto", "b_drypipe", `A dry bedroom ceiling corner and the top of a wall with no water stains at all, a ceiling light fixture nearby, ${ROOM.split(" with ")[0]}.`),
  C(30, "Nosotros, cuando dormimos, respiramos", "MwBreathGlass"),
  // 476,1 · la pared más fría · el espejo · el vaso
  C(30, "Y ese vapor busca la pared más fría", "MwBreathGlass", { two: true }),
  ST(30, "como se empaña el espejo del baño", "s_mirror", "foggy mirror bathroom", `A bathroom mirror fogged with steam.`),
  V(31, "La prueba la hacíamos en el hotel así", "v07"),
  // 492,1 · resultado
  C(31, "Si cuando lo saca", "MwIceTest"),
  B(31, "Y si además la pared, al tacto", "b_palmcold", `A man's bare palm pressed flat on a cream outer bedroom wall near the window, condensation dots on the wall around his hand.`),
  C(31, "está mucho más fría que las otras", "MwIceTest", { south: true }),
  // 509,7 · los vidrios lloran
  V(32, "los vidrios de la ventana", "v06"),
  B(32, "Si los vidrios lloran", "b_dropsrun", `Water drops running down the inside of a fogged bedroom window and pooling on the white frame, a damp dark line on the sill.`),
  // 525,1 · punto 9
  C(33, "Los cinco centímetros", "ClChapter", { n: 9, title: "Los cinco centímetros", sub: "el que le prometí", label: "PUNTO" }),
  B(34, "¿Por qué el moho siempre está", "b_wardrobeback", `The back panel of an old dark wooden wardrobe pulled away from the wall, gray mold dots on the raw wood, the moldy wall behind it.`),
  B(34, "Porque el ropero, pegado a la pared", "b_flush", `A tall dark wooden wardrobe pushed tight against a bedroom wall, no gap at all, a little black mold creeping out at its side edge.`),
  C(34, "le tapa el aire", "MwGapPlan"),
  // 540,4 · la cámara oscura
  B(34, "porque el calor de la habitación", "b_flashgap", `A flashlight beam shining into the thin dark gap behind a wardrobe pushed against a wall, revealing a dark damp wall with mold, ${G} holding the flashlight.`),
  B(34, "El vapor se pega", "b_dampback", `Tiny condensation drops on the cold wall right behind a wardrobe, seen through the gap, a gray mold edge around them.`),
  B(34, "moho tiene ahí su casa perfecta", "b_colony", `A thick dark colony of black mold in the lower corner of a bedroom wall behind a moved wardrobe, a dust bunny and a lost sock on the floor.`),
  // 556,9 · 5 cm
  C(35, "Lo que mide el ancho de dos dedos", "MwFiveCm"),
  C(35, "Con eso, el aire de la habitación", "MwGapPlan", { gap: true }),
  // 570,9 · los tacos y la libreta
  B(36, "En el hotel lo hacíamos con dos tacos", "b_blocks", `Two small square blocks of pine wood, four screws and an old screwdriver on a hotel maintenance workbench, sawdust around them.`),
  V(36, "atornillados atrás de cada ropero", "v08"),
  B(36, "El gerente de la libreta", "b_manager", `${MANAGER} in a hotel corridor writing in his notebook while looking at a wardrobe through an open door.`),
  // 587 · desapareció · cama, sillón, biblioteca
  B(36, "Y el invierno siguiente", "b_notebook", `A small black notebook open on a hotel reception desk, several handwritten lines crossed out with a pen, the writing too small to read, a pen lying across it.`),
  B(37, "Y lo mismo con la cabecera", "b_headboard", `A wooden bed headboard standing a few centimeters away from a cream bedroom wall, a hand checking the gap behind it.`),
  B(37, "con el sillón", "b_bookcase", `A tall bookshelf full of books standing a little away from an outside wall in a living room, a narrow shadow gap behind it, a reading armchair beside it.`),
  // 604 · punto 10
  C(38, "Cuándo llamar a un profesional", "ClChapter", { n: 10, title: "Cuándo llamar a un profesional", label: "PUNTO" }),
  C(39, "La regla de la gente del rubro", "MwSquareMeter"),
  // 620,4 · si vuelve, si está blanda
  B(39, "o si vuelve aunque hizo todo bien", "b_moldreturns", `Black mold spots coming back on a wall that was clearly cleaned and repainted, the new paint slightly bubbled, a wardrobe pulled far away.`),
  B(39, "o si la pared está blanda, o hinchada", "b_softwall", `A thumb pressing into swollen, soft, crumbling plaster on a bedroom wall near the floor, the paint peeling and dark with damp.`),
  C(39, "ya no es condensación", "MwSquareMeter", { causes: true }),
  // 638,3 · el profesional · Don Ramiro
  B(39, "Ahí llama a un albañil", "b_mason", `A mason in dusty work clothes kneeling by a damp bedroom wall, tapping it with the handle of a hammer and listening, a toolbox open beside him.`),
  B(40, "Don Ramiro, un huésped", "b_ramiro", `${RAMIRO} standing at a hotel reception desk with a suitcase, complaining with one hand raised, a key on the counter.`),
  B(40, "se quejaba de la cuatrocientos ocho", "b_408", `A hotel room door in a corridor with a small brass number plate too small to read, the door ajar showing a wardrobe and a damp wall inside.`),
  // 653,5 · el caño de la calefacción
  B(40, "Al final abrimos la pared", "b_openwall", `A rough hole broken into a hotel room plaster wall exposing an old copper heating pipe with a green corroded joint, water dripping from it, bits of plaster on a drop sheet.`),
  B(40, "que goteaba hacía años", "b_drip", `A single water drop hanging from a corroded copper pipe joint inside an opened wall, the bricks around it dark and wet, a flashlight beam on it.`),
];
