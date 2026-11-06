// DIRECTOR C — cons6nc: los 5 errores + la rutina con tiempos + lo que Don Ramiro nunca hacía + preguntas (vidrio, tetera, cafetera, ¿hacen
// mal?) + repaso + cierre con la serie (lavabo, tina) (párr. 49-70).
import { C, B, ST, V, G, KET, SCALEK, CLEANK, HOME, SERV, ACID, RAMIRO, I } from "./dir_a.mjs";
export const SHOTS = [
  // 648,6 · los cinco errores
  B(49, "los cinco errores que vi en los hervidores", "b_brokenshelf", `A shelf in a hotel storeroom with several old broken electric kettles, white crust on their spouts.`),
  C(50, "Uno", "HvFiveErrors", { hi: 1 }),
  B(50, "La lana de acero o la esponja de metal adentro", "b_steelwool", `A steel wool pad next to an open stainless steel kettle on a kitchen counter.`),
  B(50, "Raya el metal", "b_scratches", `Extreme close view of fine scratches on the brushed steel floor of a kettle, a little white crust in the scratches.`),
  B(51, "Llenar con la mezcla por encima del máximo", "b_overmax", `Close view of the water window of a stainless steel kettle with the water level above the MAX mark.`),
  B(51, "sale ácido caliente por la boquita", "b_spill", `Hot foamy water spilled from a kettle spout across a kitchen counter, close view.`, { anim: "foamy water spreads slowly" }),
  B(52, "Meter el hervidor entero bajo la llave, con la base", "b_wrongtap", `An electric kettle still sitting on its round power base being pushed under a running kitchen tap, water splashing onto the base, close view.`),
  B(53, "No enjuagar", "b_norinse", `A white mug of tea next to a stainless steel kettle and an empty citric acid sachet on a kitchen counter.`),
  B(53, "El té con gusto a limón o a vinagre es la señal", "b_face", `An older man's hand pushing away a white mug of tea on a kitchen table, the face not visible.`),
  B(54, "Esperar a que tenga piedritas para limpiarlo", "b_wait", `A stainless steel kettle with a heavy white crust inside, its lid open, on a cluttered kitchen counter.`),
  B(54, "la resistencia ya lleva meses trabajando de más", "b_hotplate", `Extreme close view of a thick white limescale crust on the heating plate inside a kettle.`),
  // 698,7 · la rutina
  B(55, "como la hacíamos en la cocina de servicio", "b_servline", `A long steel counter in ${SERV} with a row of small electric kettles, jugs of water and sachets of citric acid lined up for a cleaning session.`),
  C(56, "Primero, la prueba del vaso", "HvRoutine"),
  B(56, "Cuarto, vaciar, mirar", "b_peek", `A gloved hand tilting an open stainless steel kettle toward the light to look at its clean floor.`),
  B(56, "Sexto, el filtrito en un vaso aparte", "b_meshglass", `A small kettle mesh filter soaking in a clear glass of water on a kitchen counter.`),
  // 734,9 · Don Ramiro nunca
  B(57, "Hay cosas que Don Ramiro nunca hacía", "b_ramiro2", `${RAMIRO} in ${SERV}, drying his hands on a towel next to a row of kettles.`),
  B(58, "Nunca metía la mano adentro con el hervidor enchufado", "b_plugwall", `A kettle plug lying on a counter well away from an empty wall socket, a hand reaching into the open kettle.`),
  B(59, "Con las teteras viejas de aluminio", "b_aluminum", `An old dented aluminum stovetop kettle on a gas stove in a home kitchen.`),
  B(59, "El aluminio se oscurece con el ácido", "b_darkalu", `The inside of an old aluminum kettle with dark gray patches on the metal, close view.`),
  B(59, "Reposo corto, y enjuague enseguida", "b_alurinse", `Water from a tap rinsing the inside of an old aluminum kettle in a kitchen sink.`, { anim: "water rinses the kettle" }),
  // 765,4 · preguntas
  B(61, "las preguntas que más me dejan", "b_phone", `Weathered hands holding a phone over a wooden workbench, the screen glowing, the screen content blurred.`),
  C(62, "¿Sirve para los hervidores de vidrio?", "HvGlassKettle"),
  B(63, "¿Y para la tetera de la estufa?", "b_stovetop", `A white enamel stovetop kettle on a gas burner, the lid off, a little steam.`, { anim: "steam rises from the open kettle" }),
  B(63, "sin tapa, que hierva una vez", "b_stovelid", `The lid of a stovetop kettle set aside on the counter next to the stove.`),
  B(64, "¿Y la cafetera?", "b_coffeemaker", `A drip coffee maker with a glass carafe on a kitchen counter, no brand visible.`),
  B(65, "¿Las piedritas hacen mal?", "b_flakesspoon", `A teaspoon holding a few white limescale flakes over a cup of tea, close view.`),
  B(65, "Son los mismos minerales que tiene el agua que toma", "b_glasswater", `A clear glass of tap water on a kitchen table in daylight.`),
  B(65, "el hervidor gasta más y dura menos", "b_oldnew", `An old crusted electric kettle and a shiny clean one side by side on a kitchen counter.`),
  // 809 · repaso
  B(66, "Repaso, para que se lo lleve", "b_notepad", `A small notepad and a pencil next to ${KET} and a citric acid sachet on a kitchen table.`),
  C(67, "Las piedritas blancas son piedra del agua", "HvRecap"),
  B(67, "Nada de lana de acero, nunca la base mojada", "b_basedry2", `The dry black power base of an electric kettle on a counter, a folded dry towel beside it.`),
  B(67, "y cada tres meses si es blanda", "b_calcross", `Close view of a wall calendar with a small pen cross marked on one day.`),
  // 853,5 · cierre
  C(68, "mire también mis videos del lavabo y de la tina", "ClVideoRef", { thumb: I + "th_lavabo.jpg", title: "La misma piedra, en el lavabo", tag: "ya en el canal" }),
  B(69, "¿cuánto aro le dejó el vaso?", "b_glassq", `A dry drinking glass with a white ring at the bottom on a sunny windowsill, close view.`),
  B(69, "Leo todos los comentarios", "b_glasses", `A pair of reading glasses and a phone on a wooden bench in a hotel staff room.`),
  B(70, "Treinta años cuidando un hotel", "b_keys", `A big ring of old brass hotel master keys hanging on a hook in a maintenance workshop.`),
  B(70, "Nos vemos en el próximo", "b_morning", `A steaming white mug of tea next to a shiny stainless steel kettle on a home kitchen counter in soft morning light.`, { anim: "steam rises from the mug" }),
];
