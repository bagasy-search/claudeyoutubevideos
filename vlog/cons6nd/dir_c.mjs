// DIRECTOR C — cons6nd: los 5 errores + la rutina + lo que Rosa nunca hacía + preguntas (agua del aire, verticales, cuándo tirarla, la
// camisa ya manchada) + la serie (hervidor y tina) + repaso + cierre (párr. 47-68).
import { ST, C, B, V, IRON, SHIRT, BOARD, HOME, IROOM, ROSA, MANAGER, DIST, VIN, I } from "./dir_a.mjs";
export const SHOTS = [
  // 634 · los cinco errores
  B(47, "Ahora, los cinco errores", "b_brokenirons", `A shelf in a hotel storeroom with several old broken steam irons, white crust on their soleplates.`),
  C(48, "Uno. Dejar el agua en el depósito", "PlFiveErrors", { hi: 1 }),
  B(49, "cuando el manual dice que no", "b_purevin", `${VIN} tipped toward the open fill hole of a steam iron, close view.`),
  B(49, "Le come las gomitas, y la plancha empieza a gotear", "b_leak", `Water drops leaking from the bottom of a steam iron standing on its heel, a small puddle under it.`, { anim: "drops fall slowly" }),
  B(50, "Tres. Rascar la suela con un cuchillo", "b_knife", `A kitchen knife lying next to a steam iron soleplate with long scratches on it.`),
  B(51, "Limpiar la suela caliente", "b_hotsole", `A hot steam iron with its orange light on and a wet sponge held near it, close view.`),
  B(51, "Se quema la mano, y se pega la pasta", "b_bakedpaste", `Baked dried white paste stuck on a dark iron soleplate, close view.`),
  B(52, "Y cinco. Echar el almidón en aerosol", "b_starch", `A can of spray starch with a blank label next to ${SHIRT} on ${BOARD}.`),
  C(52, "Rocíe el almidón, espere unos segundos", "PlStarch"),
  // 685 · la rutina
  B(53, "La rutina completa, como la hacíamos", "b_rosaboard", `${ROSA} ironing a white shirt on a board in ${IROOM}, a jug of distilled water beside the board.`),
  C(54, "Primero, el manual: qué agua", "PlRoutine"),
  B(54, "o la mezcla de un cuarto de vinagre y tres de destilada", "b_jugmix", `A small clear measuring jug with a quarter of vinegar and the rest distilled water on a laundry counter.`),
  B(54, "Tercero, dos o tres llenadas de agua destilada", "b_refill2", `Distilled water poured into the tank of a steam iron for a rinse, close view.`),
  B(54, "la pasta de bicarbonato con paño suave", "b_paste", `A small bowl of white baking soda paste and a soft folded cotton cloth next to an unplugged steam iron lying on its side.`),
  B(54, "Quinto, la prueba del trapo", "b_ragboard", `An old white rag on an ironing board under a steam iron, clean, no spots.`),
  // 721 · Rosa nunca
  B(55, "Rosa tenía tres cosas que nunca hacía", "b_rosashelf", `${ROSA} placing a steam iron upright on a shelf in ${IROOM}.`),
  ST(56, "Ni una noche", "b_nightiron", "iron on ironing board", `An iron standing on its heel on an ironing board in a dark room at night, its tank empty.`),
  B(57, "Nunca la dejaba acostada sobre la suela", "b_flat", `A steam iron lying flat on its soleplate on a wooden shelf, close view.`),
  B(57, "Decía que la suela es la cara de la plancha", "b_soleshine", `A gleaming clean stainless steel soleplate of a steam iron reflecting window light, close view.`),
  ST(58, "Ni la noche de la boda", "b_terrace2", "wedding party night", `A hotel rooftop terrace with a wedding party at night, string lights, seen from far.`),
  // 748 · preguntas
  B(59, "las preguntas que más me dejan", "b_phone2", `A pair of reading glasses and a phone on a wooden bench in a hotel staff room.`),
  C(60, "Sirve el agua del aire acondicionado", "PlWaterSrc"),
  B(60, "En la plancha, destilada", "b_distonly", `${DIST} next to a steam iron on ${BOARD}, nothing else.`),
  ST(61, "Y las planchas de vapor de pie, las verticales", "b_steamer", "garment steamer", `A standing garment steamer with its hose and head next to a white shirt on a hanger.`, { anim: "steam rises from the steamer head" }),
  B(61, "y casi todas traen su propio método", "b_steamermanual", `The instruction booklet of a garment steamer open on a table, the text not readable.`),
  C(62, "si gotea por abajo", "PlWhenToss"),
  B(62, "Ahí ya no es piedra, es la plancha", "b_oldiron", `An old worn steam iron in a cardboard box for recycling at the door of a hotel workshop.`),
  // 791 · la camisa ya manchada
  B(63, "Y la camisa que ya se manchó", "b_stainshirt", `${SHIRT} with a small brown iron mark on the front laid flat on a table.`),
  ST(63, "del revés, con agua fría primero", "b_insideout", "washing shirt sink", `A white shirt turned inside out under a running cold water tap in a laundry sink.`, { anim: "cold water runs over the fabric" }),
  B(63, "con jabón en barra frotado antes del lavado", "b_barsoap", `A bar of laundry soap rubbed on a brown spot of a white shirt over a sink.`),
  // 810 · la serie
  C(64, "Es la misma piedra, en otro lugar", "ClVideoRef", { thumb: I + "th_sarro.jpg", title: "La misma piedra, en otro lugar", tag: "en el canal" }),
  // 820 · repaso
  B(65, "Repaso, para que se lo lleve", "b_notepad", `A small notepad and a pencil next to ${IRON} on a kitchen table.`),
  C(66, "Primero, el manual: qué agua, si permite vinagre", "PlRecap"),
  B(66, "Por fuera, desenchufada y fría", "b_coldiron", `An unplugged steam iron lying on its side with its cord coiled, a soft cloth beside it.`),
  B(66, "Y para que no vuelva", "b_upright", `A steam iron standing upright on its heel on a shelf, its water tank empty.`),
  // 865 · cierre
  B(67, "Y cuénteme en los comentarios", "b_button2", `Close view of the self-cleaning button on the back of a steam iron.`),
  B(68, "Treinta años cuidando un hotel", "b_keys", `A big ring of old brass hotel master keys hanging on a hook in a maintenance workshop.`),
  ST(68, "Nos vemos en el próximo", "b_shirtready", "white shirt hanger", `A crisp white shirt on a hanger on a bedroom door in soft morning light, a steam iron standing on the board behind.`),
];
