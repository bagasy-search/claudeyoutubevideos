// DIRECTOR C — clc28b: rutina de la mañana · 5 errores · preguntas de los comentarios · repaso · CTA 2 (pág. 24) · pregunta final — párr. 41-61.
import { G, ROOM, SPRAY, VINEGAR, H2O2, CTA, C, B, ST, V } from "./dir_a.mjs";
export const SHOTS = [
  C(41, "Ahora le cuento la rutina", "MwMorning", { hi: 0 }),
  // 671 · uno: de par en par
  ST(42, "abrir la ventana del dormitorio de par en par", "s_morningwin", "opening window morning", `A bedroom window being opened wide in the early morning.`),
  C(42, "Aunque haga frío", "MwMorning", { hi: 1 }),
  ST(42, "sacan el vapor de toda la noche", "s_cold", "cold morning breath window", `Cold morning air at an open window, the curtain moving.`),
  // 687,9 · de par en par vs apenas abierta · dos: secar vidrios
  B(42, "Es mejor diez minutos de par en par", "b_widewin", `A bedroom window opened completely wide on a cold morning, the bed unmade, a wool blanket thrown back, frost on the roofs outside.`),
  B(42, "que una hora con la ventana apenas abierta", "b_crack", `A bedroom window opened only a thin crack, the glass still fogged with drops, a heater on below it.`),
  B(43, "secar los vidrios empañados con un trapo", "b_wipeglass", `A hand wiping a fogged bedroom window with a folded cotton rag, clear streaks appearing in the condensation, drops on the frame.`),
  B(43, "y escurrir el agua", "b_sillwater", `A rag soaking up water pooled in the bottom track of a white window frame, the hand wringing it out over a small bucket.`),
  // 702,3 · el marco · tres: ropa
  B(43, "es moho en el marco de la ventana", "b_framemold", `Black mold in the rubber seal and the corner of a white window frame, drops of condensation above it, close view.`),
  C(44, "Lo tercero", "MwMorning", { hi: 3 }),
  ST(44, "Una tanda de ropa mojada", "s_rack", "clothes drying rack indoor", `Wet laundry drying on a rack indoors.`),
  B(44, "Si no hay otro lugar", "b_bathrack", `A folding drying rack with wet shirts in a small bathroom, the door closed and a small window open above the shower.`),
  // 719,4 · cuatro: el ropero abierto · errores
  B(45, "la puerta del ropero, abierta", "b_wardrobeopen", `Both doors of an old dark wooden wardrobe left open in a bright bedroom, clothes on hangers airing, a window open across the room.`),
  B(45, "Adentro del ropero también se junta humedad", "b_insidewardrobe", `The back inside corner of a wardrobe with a few gray mold dots on the wood behind hanging winter coats, a hand moving the coats aside.`),
  B(45, "y por eso la ropa huele", "b_mustycoat", `A wool winter coat on a wooden hanger with a faint pale musty patch on the shoulder, a hand holding the sleeve up to look at it.`),
  C(46, "Y ahora los cinco errores", "MwFiveErrors", { hi: 1 }),
  // 737,1
  C(48, "Dos, rociar y limpiar enseguida", "MwFiveErrors", { hi: 2 }),
  B(48, "El agua oxigenada, quince minutos", "b_timer", `A white kitchen timer turned to fifteen minutes next to ${H2O2} and ${SPRAY} on a bedroom chair, a wall with bubbles behind.`),
  C(49, "Tres, mezclar productos", "MwFiveErrors", { hi: 3 }),
  // 753,2
  B(49, "producto por día", "b_shelves", `A laundry room shelf with a bleach jug on the top shelf alone, a vinegar jug in the middle and a brown peroxide bottle at the bottom, each with a plain blank label.`),
  C(50, "Cuatro, pintar encima", "MwFiveErrors", { hi: 4 }),
  C(50, "Primero se mata", "MwBlister", { stage: 1 }),
  C(51, "Y cinco, volver a pegar el ropero", "MwFiveErrors", { hi: 5 }),
  // 770,9 · preguntas
  B(53, "si el vinagre mancha la pintura", "b_testcorner", `${G} spraying a little vinegar on a hidden low corner of a cream wall behind a door, close to the baseboard.`),
  B(53, "En una pintura muy vieja", "b_chalky", `A fingertip rubbed on very old chalky wall paint, white powder on the finger and a lighter mark left on the wall.`),
  B(53, "puede dejar un poquito de marca", "b_watermark", `A faint dull water mark on old matte wall paint in a small low test spot near the baseboard, a cloth beside it.`),
  // 785,1
  B(54, "si sirve el vinagre de manzana", "b_apple", `A jug of amber apple cider vinegar next to a jug of clear white vinegar on a kitchen counter, both with plain blank labels, a hand between them.`),
  B(54, "el blanco es más parejo", "b_whitepick", `A hand picking up ${VINEGAR} from a kitchen counter, the amber bottle left behind.`),
  B(55, "si el moho de la pared es peligroso", "b_worried", `An older woman standing in her bedroom looking worried at a patch of black mold on the wall behind a moved wardrobe, one hand on her chest.`),
  // 802,8 · asma · la mascarilla · el muchacho del departamento
  B(55, "Para alguien con asma", "b_oldman", `An old man in a cardigan sitting in an armchair with a blanket on his knees, coughing into a handkerchief, a window open in the next room.`),
  V(55, "Por eso la mascarilla", "v02"),
  B(56, "Y una que me gustó mucho", "b_smallflat", `A young man in a hoodie sitting on the edge of a bed in a tiny apartment bedroom with a wardrobe squeezed between the bed and the outside wall.`),
  // 821,7 · el cuarto es justo · patitas
  B(56, "el cuarto es justo", "b_tight", `A tight small bedroom where a wardrobe touches the bed on one side and the wall on the other, no space to move it, a window above the bed.`),
  B(56, "si no le entran los cinco centímetros", "b_tape", `A metal tape measure stretched between the side of a wardrobe and the wall showing almost no gap, a thumb holding it.`),
  C(56, "por lo menos que el aire pase", "MwLegs"),
  // 836,8 · la pared del pasillo · deshumidificador
  B(56, "Y deje el ropero en la pared que da al pasillo", "b_innerwall", `Two men carrying a wardrobe across a small bedroom toward the inner wall that faces the hallway door.`),
  B(56, "La pared de adentro es más tibia", "b_warmpalm", `A hand pressed flat on an inner bedroom wall next to the door frame, warm lamp light on it.`),
  ST(57, "¿y los aparatos que sacan la humedad del aire?", "s_dehum", "dehumidifier", `A dehumidifier running in a room.`),
  // 853,1
  B(57, "en planta baja", "b_groundfloor", `A ground-floor bedroom with a small high window at street level, a damp patch on the lower wall and a dehumidifier in the corner.`),
  B(57, "En el hotel teníamos dos", "b_basement", `Two white dehumidifiers on the concrete floor of a hotel basement storage room with shelves of folded linens, their small lights on.`),
  B(57, "Pero no reemplazan", "b_morningair", `A bedroom window opened wide in the morning with the curtain blowing and a dehumidifier switched off beside it.`),
  B(57, "ni los cinco centímetros", "b_twofingers", `Two and a half fingers of a hand slid into the gap between a wardrobe and a clean dry wall to check the distance.`),
  // 870,5 · el tanque · repaso
  B(57, "se llena y deja de funcionar", "b_tank", `A hand pulling the full water tank out of a dehumidifier, the water almost to the brim, a few drops on the floor.`),
  C(58, "Repasemos en un minuto", "MwRecap10", { upto: 2 }),
  C(59, "o agua oxigenada al tres por ciento", "MwRecap10", { upto: 7 }),
  B(59, "Cinco, bicarbonato", "b_sodawall", `${G} rubbing a faint gray shadow on a cream wall with a sponge dipped in a glass of baking soda water.`),
  B(59, "Seis, secar", "b_dryroom", `A bright bedroom with the window open, a fan on the floor and a wardrobe standing away from a clean dry wall.`),
  // 903,7 · nueve, diez · CTA 2
  B(59, "Nueve, los cinco centímetros", "b_finalgap", `A dark wooden wardrobe standing a hand's width from a clean cream wall, two small wooden blocks visible at the top of its back.`),
  B(59, "Y diez, más de un metro cuadrado", "b_bigmold", `A very large patch of black mold covering a whole lower corner of a bedroom wall and part of the ceiling, a wardrobe moved away, a measuring tape lying on the floor.`),
  C(60, "Y si quiere tenerlo a mano", "MwBookBed", CTA),
  // 918,3 · CTA 2 sigue · la pregunta
  C(60, "página veinticuatro", "MwBookBed", { ...CTA, skip: 60 }),
  B(61, "¿Detrás de qué mueble", "b_threefurn", `A bedroom with a wardrobe, a bed with a wooden headboard and a full bookshelf, all against the same outside wall, a window between them.`),
  B(61, "¿El ropero, la cama, la biblioteca?", "b_lookbehind", `A woman pulling a bookshelf a little away from a wall to look behind it, finding a few small black mold spots.`),
  ST(61, "Cuénteme en los comentarios", "s_typing", "typing comment", `Hands typing a message.`),
  V(61, "Nos vemos en el próximo video", "v10"),
];
