// DIRECTOR B — fuhotel · párrafos 57-112: la casa de los Ramírez (basura, plato del perro, el limón y la cinta puestos, la semana
// después), el mosquitero, los 7 errores, las moscas grandes (ratón, bolsa, desagüe), el mantenimiento, la revisión de la noche
// y el cierre con el Manual (arreglo 8, pág. 16) + pregunta a los comentarios. Sin agnes video: foto gpt-image low + stock + kit.
import { S, BI, CLP, HOUSE, LUCIA, JORGE, KIDS, DOG, BOTTLE } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });

export const SHOTS = [
  // ── 57-58 · cierre de los cuatro pasos y la transición a la casa
  S(57, "Cuando se llena", "bi", "bi_bag_out", { q: "garbage bag street", p: BI("A knotted black garbage bag set down by a street bin, a yellow fly ribbon folded inside a second bag on the sidewalk.") }),
  S(58, "Hasta aquí, los cuatro pasos", "cl", "cl_coffee_pause", { p: CLP("sitting at a kitchen table with a cup of coffee, looking at the camera with a calm face, a kitchen window behind him with a lemon on the sill.") }),
  // ── 59-67 · la casa de los Ramírez
  S(59, "Ésta es la casa de los Ramírez otra vez", "bi", "bi_ramirez_kitchen", { q: "family kitchen interior", p: BI(`${HOUSE}, daytime, morning light.`) }),
  S(59, "Lucía me llamó el jueves", "bi", "bi_lucia_phone", { p: BI(`${LUCIA}, standing at a kitchen counter holding a phone against her shoulder, looking worried at a dish towel in her hands.`) }),
  S(60, "Fuimos juntos", "cl", "cl_walk_kitchen", { p: CLP("walking into a family kitchen, a woman with long dark hair behind him, looking at the room with a serious face.") }),
  S(60, "Estaba destapado, con una bolsa de carne", "bi", "bi_bin_meat", { q: "raw meat kitchen bin", p: BI("A white plastic kitchen bin with the lid left off, a torn bag of raw meat scraps sitting on top of other garbage, on a tiled floor.") }),
  S(61, "Lo segundo, el plato del perro", "bi", "bi_bruno_bowl", { q: "dog bowl kitchen floor", p: BI(`A steel dog bowl with dry food and bits of old meat on a kitchen floor, ${DOG}, sitting just outside the frame.`) }),
  S(62, "Lucía ya había puesto un aerosol", "bi", "bi_aerosol_drawer", { q: "kitchen drawer", p: BI("A kitchen drawer half open with a can of spray insecticide placed beside the dish towels, a bowl of fruit on the counter above.") }),
  S(63, "Hicimos el arreglo de la basura", "cl", "cl_bin_lid_fix", { p: CLP("snapping a black garbage bin lid shut, a clean bin with a tied bag beside it in a family kitchen, looking at the camera.") }),
  S(64, "Después pusimos el limón", "cl", "cl_lemon_sill_ramirez", { p: CLP("setting a half lemon with cloves on the sill of a kitchen window of a family house, the iron bars outside, a small basil pot beside it.") }),
  S(64, "y colgamos la cinta", "bi", "bi_tape_ramirez", { q: "fly ribbon", p: BI("A yellow fly ribbon hanging from the top of a kitchen window frame inside a family house, the sill with a lemon and a basil pot.") }),
  S(65, "Lucía me preguntó si de verdad", "cl", "cl_lucia_talk", { p: CLP("standing in a family kitchen, a woman with long dark hair talking beside him, both looking at a lemon on the windowsill.") }),
  S(66, "A la semana volví", "bi", "bi_week_later", { p: BI("A yellow fly ribbon in a kitchen window with only two small flies stuck to it, the rest of the ribbon clean.") }),
  S(67, "Ella me dijo algo que me gustó mucho", "cl", "cl_family_smile", { p: CLP("in a family kitchen with a woman with long dark hair and a girl with two braids, all three looking at the camera, relaxed.") }),
  // ── 68-72 · el mosquitero (y la puerta)
  S(68, "Ahora, una pregunta", "bi", "bi_screen_window", { q: "window insect screen", p: BI("A kitchen window with a white plastic insect screen fitted in its frame, the window sill with a lemon and a basil plant.") }),
  C(69, "El mosquitero tapa la ventana", "ClFlyDoor", {}),
  S(70, "Entra cuando llevas la bolsa al patio", "bi", "bi_door_bag", { q: "man carrying garbage bag", p: BI("A kitchen back door standing open, a man's hand carrying a tied black garbage bag out to the patio, the door frame in bright light.") }),
  S(71, "Y hay algo peor", "bi", "bi_drain_patio", { q: "patio drain", p: BI("A patio drain with dirty standing water and dry leaves, a plastic bucket beside the wall, the back of a house in the background.") }),
  S(72, "Por eso el mosquitero no es la solución", "cl", "cl_screen_point", { p: CLP("pointing at a kitchen window screen while standing in the kitchen, the lemon and basil on the sill beside it.") }),
  // ── 73-80 · los siete errores
  C(73, "Y ahora, los errores que más veo", "ClCheck", { title: "LOS ERRORES QUE MÁS VEO", items: ["El limón viejo, de dos meses", "El clavo molido", "La albahaca cortada en un vaso", "El veneno", "La basura abierta de día", "El limón tapando la ventana", "Una cinta en cada rincón"] }),
  S(74, "Primer error: el limón viejo", "bi", "bi_lemon_moldy", { q: "moldy lemon", p: BI("A half lemon on a windowsill, dried, shriveled and grayish, with cloves loose in a dish beside it.") }),
  S(75, "Segundo error: el clavo molido", "bi", "st_ground_clove", { q: "ground clove powder spoon", p: BI("A spoon of ground clove powder on a wooden table, the powder spilling over the edge.") }),
  S(76, "Tercer error: la albahaca cortada", "bi", "bi_basil_glass", { q: "basil leaves glass water", p: BI("Loose basil leaves in a glass of water on a kitchen counter, the leaves limp and yellowing.") }),
  S(77, "Cuarto error: poner veneno", "bi", "bi_poison_box", { q: "rat poison box", p: BI("A cardboard box of rat poison pellets on a kitchen shelf, unopened, a plate of cut bread beside it.") }),
  S(78, "Quinto error: dejar la basura abierta", "bi", "bi_open_bin_day", { q: "kitchen bin lid open", p: BI("A kitchen garbage bin with its lid open in the middle of the day, a fruit peel and a bread heel on top, sunlight across the floor.") }),
  S(79, "Sexto error: poner el limón tapando la ventana", "bi", "bi_lemon_blocks", { q: "lemon window", p: BI("A large half lemon placed in the middle of a kitchen window, blocking most of the glass, the room dim behind it.") }),
  S(80, "Séptimo error", "bi", "bi_many_tapes", { p: BI("Several yellow fly ribbons stuck on different kitchen walls and cabinets, a cluttered corner of a kitchen.") }),
  // ── 81-92 · las moscas grandes (la búsqueda del foco)
  S(81, "Ahora, ¿qué pasa si, aun haciendo todo", "cl", "cl_big_flies", { p: CLP("standing still by a kitchen window, a large dark fly on the glass, looking at it with a focused face.") }),
  S(82, "Esas son distintas", "bi", "st_big_fly", { q: "big black fly on window glass", p: BI("A large black house fly with a shiny body on a kitchen window glass, close view.") }),
  S(83, "Son moscas que nacieron cerca", "bi", "bi_wall_mouse", { q: "concrete wall hole", p: BI("A gray concrete wall of a patio with a small hole at the base, a damp stain and a dark smear, the grass beside it.") }),
  S(84, "Un ratón en la pared", "bi", "st_rat_wall", { q: "dead mouse wall", p: BI("An old garden wall with a dark gap at its base and a crumpled plastic bag beside it, a damp patch on the cement.") }),
  S(85, "Y a esas no las sacas con limón", "cl", "cl_flashlight_out", { p: CLP("holding a flashlight in a dark back patio at night, its beam on a concrete wall, looking at the beam.") }),
  S(86, "Cómo se encuentra", "bi", "bi_night_patio", { q: "night backyard flashlight", p: BI("A back patio at night lit only by a small flashlight beam on a concrete floor, a cinder block wall, a garden hose coiled beside it.") }),
  S(87, "Mira primero lo que no se ve", "bi", "bi_garage_back", { q: "backyard night garage", p: BI("The back of a garage at night, the floor tiles dirty, a gap under a water tank, a stack of old boxes against the wall.") }),
  S(88, "Si no encuentras nada", "bi", "bi_patio_bag2", { q: "trash bag patio", p: BI("A tied garbage bag leaking fluid onto a patio floor, a plastic bucket beside it, the drain grate just beyond.") }),
  S(89, "En la casa de los Ramírez, el problema estaba en el desagüe", "bi", "bi_drain_ramirez", { q: "clogged drain leaves", p: BI("An open cement patio drain choked with wet leaves and standing dirty water, a broom leaning on the wall beside it.") }),
  S(89, "Lo limpiamos, le pusimos agua limpia", "cl", "cl_clean_drain", { p: CLP("clearing leaves out of a patio drain with a gloved hand, a bucket of clean water beside him.") }),
  S(90, "Te soy honesto", "cl", "cl_honest_talk", { p: CLP("standing on a back patio in daylight, looking at the camera, a cement drain behind him.") }),
  S(91, "Y cuando lo encuentres", "bi", "bi_lime_drain", { q: "drain cleaning", p: BI("A patio drain area being washed with a bucket of soapy water, a scrub brush resting on the cement edge.") }),
  S(92, "Esto no es un tema de limón", "bi", "bi_patio_clean", { q: "cleaning concrete patio", p: BI("A clean cement patio after scrubbing, the drain clear and dry, a small potted basil on the back step.") }),
  // ── 93-100 · el mantenimiento (y el calor)
  S(93, "Ahora, el mantenimiento", "bi", "st_kitchen_routine", { q: "kitchen cleaning routine", p: BI("A kitchen counter after cleaning, a sponge, a cloth and a small spray bottle of soapy water neatly placed on the tiles.") }),
  C(94, "Cada tres o cuatro días: cambiar el limón", "ClCheck", { title: "CADA 3 O 4 DÍAS", items: ["Cambiar el limón", "Mirar el bote", "Mirar el plato del perro"] }),
  S(95, "Y un consejo de los hoteles", "cl", "cl_hotel_routine", { p: CLP("writing on a small kitchen calendar pinned to a wall, a lemon and a basil pot on the windowsill, looking at the camera.") }),
  S(96, "Cada semana: lavar el bote", "cl", "cl_weekly_bin", { p: CLP("pouring hydrogen peroxide onto a damp cloth beside a white garbage bin on a patio, wiping its inside rim.") }),
  S(97, "Cada noche en verano", "bi", "bi_night_bag_out", { q: "garbage bag night street", p: BI("A tied black garbage bag set out beside a gate at night, a bin lid left propped open to dry, a porch light on.") }),
  S(98, "Y cuando haces un asado", "bi", "st_leftovers", { q: "leftover food container fridge", p: BI("A covered plastic container of leftover meat on a refrigerator shelf, neatly sealed, the door open with cold light.") }),
  S(99, "Eso es todo el mantenimiento", "cl", "cl_maintenance_end", { p: CLP("standing in a clean kitchen, both hands resting on a counter, a small basil pot in the window behind him, looking at the camera.") }),
  S(100, "Y si vives en un lugar con calor", "bi", "st_hot_summer", { q: "hot summer kitchen window flies", p: BI("A kitchen window in hot afternoon sun, the glass slightly fogged, a fan on the counter, a fruit bowl by the sink.") }),
  // ── 101-105 · la revisión de la noche
  C(101, "Ahora, la revisión de la noche", "ClChapter", { n: 5, title: "LA REVISIÓN DE LA NOCHE", sub: "gratis · con la linterna del celular" }),
  S(102, "Apagas todas las luces de la cocina", "bi", "bi_lights_off", { q: "dark kitchen night", p: BI("A dark kitchen at night, only the faint street light coming through the window, the counters and the bin barely visible.") }),
  S(102, "Después entras a oscuras", "cl", "cl_flash_on", { p: CLP("standing in a dark kitchen at night, switching on a flashlight and pointing it at the floor, a bit of blur in the light.") }),
  C(103, "Miras el bote de basura por dentro", "ClCheck", { title: "LA REVISIÓN DE LA NOCHE", items: ["El bote por dentro", "El plato del perro", "El desagüe del fregadero", "Las cuatro esquinas del piso"] }),
  S(104, "Y no necesitas comprar nada", "cl", "cl_phone_light", { p: CLP("holding a phone up with its flashlight on in a kitchen, looking at the camera, a plain kitchen behind him.") }),
  S(105, "Lo que ves te dice qué está pasando", "bi", "bi_flies_cluster", { q: "flies on kitchen towel", p: BI("A dark kitchen spot where a small cluster of flies crawls on a damp dish towel by the sink, lit by a flashlight beam.") }),
  // ── 106-112 · cierre: manual (arreglo 8, pág. 16) y comentarios
  S(106, "Y si tu casa tiene de todo", "cl", "cl_manual_hold", { p: CLP("holding a printed booklet with a green cover at a kitchen table, showing its cover to the camera.") }),
  C(107, "Veintisiete dólares, un solo pago", "ClQRCard", { qr: "https://manual-fumigador-claudio.vercel.app/?src=fumoscas", kicker: "MANUAL DEL FUMIGADOR · US$27", text: "66 arreglos · garantía 7 días" }),
  S(108, "Lo dejo en la descripción", "bi", "bi_desc_card", { q: "lemon on table kitchen", p: BI("A printed card with a small link printed on it, lying on a kitchen table beside a lemon and a pair of kitchen scissors.") }),
  S(109, "Ah, y una cosa más", "bi", "bi_mosquitoes_patio", { q: "mosquitoes standing water", p: BI("A shaded back patio in the evening, a small cloud of mosquitoes above a bucket of standing water near the wall.") }),
  S(110, "Pero ésos son otro problema", "cl", "cl_next_week", { p: CLP("standing on a patio in the evening, looking at the camera with a small smile, a plant pot beside him.") }),
  S(111, "Y ahora cuéntame tú", "cl", "cl_question", { p: CLP("looking into the camera, sitting at a kitchen table with a lemon and a basil pot in front of him, a friendly question on his face.") }),
  S(112, "Limón con diez clavos en cada ventana", "bi", "bi_closing_kitchen", { q: "clean kitchen morning light", p: BI("A clean family kitchen in morning light: the window with a lemon with cloves on the sill, a basil pot beside it, a yellow fly ribbon hung high, the counter clear.") }),
];
