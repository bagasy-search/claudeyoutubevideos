// DIRECTOR C — cons6nb: cada seis lavados + lo que Rosa nunca hacía + preguntas (secadora, farmacia, toallas, vinagre, sábanas caras,
// cuánto sale) + el video de la lavadora + el agua dura + el ablandador + guardarlas + el huésped + repaso + cierre (párr. 49-74).
import { C, B, ST, V, G, GRAYS, WHITES, BUCKET, BEDROOM, LAUND, ROSA, SODA, BOTTLE, I } from "./dir_a.mjs";
export const SHOTS = [
  // 594 · para que no vuelva
  V(49, "Y para que no vuelva", "b08"),
  C(49, "No cada vez. Cada seis", "SbEverySix"),
  // 606 · Rosa nunca
  C(51, "El agua oxigenada se guarda en su frasco marrón", "SbBottleLight"),
  B(51, "Si la pasa a una botella transparente", "b_clearbottle", `A clear plastic spray bottle of liquid left on a sunny windowsill in a laundry room.`),
  C(52, "Una vez una camarera nueva", "SbHemTest"),
  B(52, "y salieron con manchas claras", "b_bluespots", `A light blue cotton sheet with pale bleached blotches spread on a folding table, close view.`),
  B(52, "Desde ese día, el dobladillo primero", "b_hemdrop", `A drop of clear liquid on the inside hem of a light blue sheet from a small dropper, close view.`),
  B(53, "Y nunca dejaba el remojo toda la noche", "b_rosaclock", `${ROSA} glancing at a wall clock above the soaking tubs in ${LAUND}.`),
  // 639 · preguntas
  B(54, "las preguntas que más me dejan", "b_phone", `Weathered hands holding a phone over a wooden workbench, the screen glowing, the screen content blurred.`),
  B(55, "Sirve si las sábanas ya pasaron muchas veces por la secadora", "b_olddryer", `A stack of old dingy sheets on top of a home clothes dryer.`),
  B(55, "Haga dos remojos, en dos días distintos", "b_twodays", `Two buckets of soaking sheets on a laundry floor with a paper note between them, the note text not readable.`),
  C(56, "Siempre al tres por ciento", "SbPharmacy"),
  ST(57, "Y sirve para las toallas blancas", "b_towels", "folded white towels", `A stack of folded white cotton towels on a bathroom shelf.`),
  B(57, "porque vuelven a absorber", "b_absorb", `A white towel soaking up a spill of water on a bathroom counter, close view.`, { anim: "the towel soaks up the water" }),
  B(58, "Y el vinagre", "b_vinegar", `A jug of white vinegar with a blank label alone on a kitchen shelf, far from the laundry room.`),
  B(58, "Nunca en el mismo balde que el frasco marrón", "b_onebucket", `One bucket of soaking white sheets on a laundry floor with only ${BOTTLE} next to it, nothing else.`),
  B(58, "Una cosa por vez", "b_shelfapart", `A laundry room shelf with ${BOTTLE} on one end and a vinegar jug with a blank label at the far other end, a wide gap between them.`),
  B(59, "aguantan el agua caliente y el remojo", "b_fine", `Close view of a fine smooth high-thread-count white cotton sheet folded on a bed.`),
  B(59, "que no las retuerza al escurrirlas", "b_press", `A wooden paddle pressing a wet white sheet against the side of a bucket to drain it, no twisting.`, { anim: "the paddle presses, water runs out" }),
  // 698 · cuánto sale
  C(60, "una caja de bicarbonato y la mitad del jabón", "SbCost"),
  B(60, "le alcanza para varios meses de remojos", "b_supply", `${BOTTLE} and ${SODA} on a laundry shelf next to a folded stack of white sheets.`),
  // 712 · la lavadora
  B(61, "Si en su casa el agua es dura", "b_crustshower", `A shower head with its little holes clogged with white mineral crust, close view.`),
  C(61, "le ensucia todo lo que mete", "ClVideoRef", { thumb: I + "th_lavadora.jpg", title: "La lavadora que ensucia la ropa", tag: "ya en el canal" }),
  // 726 · el agua dura
  B(62, "Ahora, una cosa más sobre el agua dura", "b_tapcrust", `White mineral crust around the base of a laundry room tap, water running.`),
  B(63, "Si tiene costra blanca en el fondo, su agua es dura", "b_kettlecrust", `The inside bottom of an electric kettle seen through the open lid, covered in white chalky crust.`),
  B(63, "Mire la flor de la ducha", "b_showerhead", `A round shower head seen from below with white crust around its tiny holes.`),
  B(64, "En una casa con agua dura", "b_graylines", `Several gray dingy sheets on a backyard clothesline under a cloudy sky.`),
  B(64, "Ahí el remojo hágalo cada cuatro lavados", "b_calfour", `A paper calendar on a laundry room wall with a small bucket drawn in pen on one day.`),
  B(64, "y el bicarbonato no se lo saltee nunca", "b_sodapour", `Baking soda poured from a measuring cup into a bucket of hot water.`, { anim: "the soda pours into the water" }),
  // 762 · el ablandador
  B(65, "la lavandería tenía un ablandador", "b_softener_tank", `A big blue water softener tank and pipes in the corner of a hotel basement laundry room.`),
  C(65, "La media taza de bicarbonato en el remojo", "SbSaltTank"),
  // 777 · guardarlas
  ST(66, "Y una vez que las tiene blancas", "b_folded", "folded white sheets bed", `A neat stack of folded bright white sheets on a bed in soft morning light.`),
  B(67, "Guárdelas siempre bien secas", "b_dry", `A hand feeling a folded white sheet to check it is fully dry before putting it away.`),
  B(67, "en dos semanas tiene olor y puntitos amarillos", "b_dots", `Close view of tiny yellow mildew spots on the fold of a white cotton sheet.`),
  B(68, "Nunca en bolsas de plástico cerradas", "b_bag", `Folded white sheets sealed in a plastic storage bag on a closet shelf, a little fog inside the plastic.`),
  B(69, "Use el que está abajo de la pila", "b_bottom", `A hand pulling the bottom sheet out of a stack of folded white sheets on a wooden shelf.`),
  C(69, "y el recién lavado va arriba", "SbShelf"),
  // 813 · el huésped
  B(70, "Una vez, un huésped que venía", "b_guest", `An older hotel guest with a cane and a hat walking down a carpeted hotel corridor.`),
  ST(70, "preguntó qué le poníamos a las sábanas", "b_hotelbed2", "hotel bed made", `A crisp white hotel bed with the top sheet folded back neatly, a reading lamp on.`),
  ST(70, "Le conté esto mismo", "b_hallway", "hotel corridor", `A long hotel corridor with warm lights, a housekeeping cart of white sheets by a door.`),
  ST(70, "Al año siguiente volvió", "b_reception", "hotel reception bell", `An old hotel reception desk with a brass bell and room keys on hooks behind it.`),
  // 832 · repaso
  C(72, "Las sábanas no se ponen grises por sucias", "SbRecap"),
  ST(72, "y al sol", "b_sunline2", "white sheets clothesline sun", `A row of bright white sheets drying on a clothesline in morning sun.`, { anim: "the sheets sway in the breeze" }),
  B(72, "Sólo blancos, sólo algodón, nunca con cloro", "b_whitepile", `A laundry basket of only white cotton sheets and towels next to ${BOTTLE}.`),
  // 874 · cierre
  B(73, "Y cuénteme en los comentarios", "b_drop", `A single drop of hot water on the corner of a cotton sheet over a sink, close view.`),
  B(74, "Treinta años cuidando un hotel", "b_keys", `A big ring of old brass hotel master keys hanging on a hook in a maintenance workshop.`),
  ST(74, "Nos vemos en el próximo", "b_bed", "white bed bedroom morning", `A made bed with bright white sheets and pillows in ${BEDROOM}, soft morning light.`),
];
