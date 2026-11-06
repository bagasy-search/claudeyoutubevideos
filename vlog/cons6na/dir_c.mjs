// DIRECTOR C — cons6na: los 5 errores + la rutina con tiempos + lo que Don Ramiro nunca hacía + preguntas + la rutina de Rosa (trapo
// 30 s) + la serie (lavabo, inodoro) + repaso + cierre (párr. 46-72).
import { C, B, ST, V, G, TUB, RING, CLEAN, VINEGAR, SOAP, SPRAY, WSPONGE, RAMIRO, ROSA, I } from "./dir_a.mjs";
export const SHOTS = [
  // 652,5 · los cinco errores
  B(46, "Ahora los cinco errores", "b_errors", `A white bathtub with an untidy row of cleaning products on its rim: a bleach jug, a green scouring sponge, a can of powder, steel wool.`),
  C(47, "Uno", "TbFiveKeys", { hi: 1 }),
  B(47, "no saca la piedra", "b_paleedge", `Close view of a yellow ring on white acrylic whose top edge is bleached paler while the middle stays yellow.`),
  B(47, "Y si después le echa vinagre", "b_twobottles", "b_twobottles", `A bleach jug and a vinegar jug with plain blank labels standing far apart on a bathroom floor, one at each end of a white bathtub.`),
  B(48, "Queda limpia ese día", "b_shinyday", `A freshly scrubbed white acrylic bathtub that looks clean from a distance, a green scouring sponge on the rim.`),
  B(48, "y llena de rayitas para siempre", "b_scratchmacro", `Extreme close view of fine circular scratches on white acrylic under raking light.`),
  B(48, "se mancha el doble de rápido", "b_dirtyscratch", `Close view of grime settled into fine scratches on a white acrylic tub, a gray haze.`),
  B(49, "Dejar el vinagre toda la noche", "s_night", `A round wall clock showing three in the morning in a dark bathroom, a bathtub with wet paper strips below it, dim light.`),
  B(49, "Una hora, y enjuague", "b_kitchentimer", `A white kitchen timer set to one hour on the rim of an old enameled bathtub.`),
  B(50, "No enjuagar el detergente", "b_soapleft", `A thin soapy film with bubbles left on the floor of a white bathtub after cleaning.`),
  B(50, "junta mugre más rápido", "b_grime", `Gray grime stuck in a soapy film near the drain of a white bathtub, close view.`),
  B(51, "frótelo mojado", "b_wetsponge", `${WSPONGE} dripping water in a blue nitrile glove above a wet white bathtub.`),
  B(51, "Mojado siempre", "b_wetstone", `A wet pumice stone and a wet white sponge side by side on the edge of an old enameled bathtub, water drops.`),
  // 715,4 · la rutina
  B(52, "como la hacía en el hotel", "b_cart", `A hotel housekeeping cart with spray bottles, rolls of paper towel, white sponges and folded towels, parked in a carpeted corridor.`),
  C(53, "Segundo, el vinagre caliente", "TbRoutine"),
  B(53, "Sexto, el bicarbonato al final", "b_sodafinal", `A light dusting of baking soda across the wet floor of a white bathtub, a white sponge beside it.`),
  B(54, "En total, con la compresa, una tarde", "b_afternoon", `Late afternoon sunlight slanting through a small bathroom window onto a clean white bathtub, wet paper strips drying on the rim.`),
  B(54, "un vaso de vinagre y un chorro de detergente", "b_glassvin", `A small drinking glass of white vinegar and ${SOAP} on a bathroom counter, nothing else.`),
  // 761,3 · Don Ramiro nunca
  B(55, "Hay cosas que Don Ramiro nunca hacía", "b_ramiro2", `${RAMIRO} in a hotel maintenance workshop, wiping his hands on a rag next to a shelf of labeled bottles.`),
  B(56, "Nunca mezclaba productos", "b_shelfmix", `A crowded bathroom cabinet shelf full of mixed cleaning bottles with plain blank labels, some open.`),
  B(56, "Una cosa por vez", "b_onebottle", `A single spray bottle with a plain blank label alone on the rim of a white bathtub, the other bottles put away on a shelf in the background.`),
  B(57, "la lana de acero es para las parrillas", "s_grill", `A pad of steel wool resting on a greasy black iron barbecue grill grate outdoors.`),
  B(58, "sin probar el rincón primero", "b_corner2", `${G} testing a drop of liquid on the lower inside corner of a white bathtub, close view.`),
  B(58, "alguien había pintado una tina vieja", "b_paintpeel", `An old bathtub with its white paint peeling off in flakes, showing a different color underneath, close view.`),
  B(58, "Desde ese día, el rincón primero", "b_cornerok", `A clean dry lower corner of a white bathtub, glossy, under good light.`),
  // 801,5 · preguntas
  B(59, "las preguntas que más me dejan", "s_phone", `Weathered hands holding a phone over a wooden workbench, the screen glowing, the screen content blurred.`),
  B(60, "frío tarda el doble", "b_coldvin", `A jug of cold white vinegar with condensation next to a steaming glass cup of vinegar on a counter.`),
  B(60, "Caliente, sin hervir", "b_warmcup", `A glass cup of white vinegar with a thin wisp of steam and no bubbles, on a counter next to a microwave.`),
  B(61, "Una señora contaba", "b_lady", `An older woman in a home bathroom kneeling at the edge of a white bathtub, holding a hand shower, seen from behind.`),
  B(62, "Haga la prueba del algodón", "b_cotton3", `Two white cotton pads on a dark towel, one stained yellow-brown and one clean.`),
  B(62, "es su agua", "b_tapdrip", `A drop of water hanging from the chrome spout of a white bathtub, close view.`),
  B(63, "La mezcla sí sirve para los azulejos", "b_tiles", `${G} wiping white subway tiles above a bathtub with a sponge.`),
  B(63, "las manchas blancas del vidrio", "s_showerglass", `A glass shower door covered in dried white water spots, close view, backlit.`),
  B(63, "No los mezcle", "b_twozones", `A white bathtub on one side and a separate glass shower stall on the other side of a hotel bathroom.`),
  // 856,9 · la rutina de Rosa
  B(64, "Rosa, que estuvo veinte años en el tercer piso", "b_rosa", `${ROSA} pushing a housekeeping cart along a carpeted hotel corridor.`),
  B(64, "la tenía en un cartelito pegado al carrito", "b_cartcard", `A small handwritten card taped to the handle of a hotel housekeeping cart next to a folded gray microfiber cloth, the writing too small to read.`),
  C(65, "Después de cada baño", "TbWipeTimer"),
  B(66, "Si usted seca la línea", "b_drytub", `${G} wiping the water line of an empty wet white bathtub with a folded gray microfiber cloth.`, { anim: "the cloth wipes along the line" }),
  V(66, "No hay piedra", "a10"),
  B(67, "Y una vez por semana", "b_weekly", `${SPRAY} misting the inside wall of a clean white bathtub.`, { anim: "a fine mist sprays onto the wall" }),
  B(67, "las tinas duraban el doble", "b_thirdfloor", `A row of open hotel bathroom doors along a corridor, each with a bright clean white bathtub inside.`),
  C(68, "mire también mis videos del lavabo y del inodoro", "ClVideoRef", { thumb: I + "th_lavabo.jpg", title: "La misma piedra, en el inodoro", tag: "ya en el canal" }),
  // 914,3 · repaso
  C(70, "La línea amarilla son tres capas", "TbTileFlip"),
  B(70, "Si queda sombra, la compresa", "b_recapcompress", `Clear plastic wrap over wet paper strips along the inside of a white bathtub, light reflecting on the wrap.`),
  B(70, "Nunca polvo ni esponja verde en acrílico", "b_nopowder", `A green scouring sponge and a can of scouring powder in a trash bin next to a white bathtub.`),
  B(70, "treinta segundos de trapo", "b_recapwipe", `A folded gray microfiber cloth hanging on the edge of a clean white bathtub.`),
  // 954,1 · cierre
  B(71, "¿su tina es acrílica o esmaltada?", "b_twotubs2", `A modern white acrylic bathtub and an old white enameled cast-iron bathtub side by side in a bathroom showroom.`),
  B(71, "¿Y qué color le salió el algodón?", "b_cottonq", `A single white cotton pad with a yellow-brown stain resting on the rim of a white bathtub.`),
  B(71, "Leo todos los comentarios", "b_glasses", `A pair of reading glasses and a phone on a wooden bench in a hotel staff room.`),
  V(72, "Nos vemos en el próximo", "a09"),
];
