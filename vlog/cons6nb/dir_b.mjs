// DIRECTOR B — cons6nb: el agua turbia + más de 6 h no suma + el lavado con la mitad del jabón + enjuague doble y sin suavizante + no
// llenar la lavadora + CTA 2 + el sol + el departamento + la secadora + fundas y cuello + axilas + los 5 errores + la rutina (párr. 26-48).
import { C, B, ST, V, G, GRAYS, WHITES, BUCKET, BEDROOM, LAUND, ROSA, SODA, BOTTLE, I } from "./dir_a.mjs";
export const SHOTS = [
  // 342 · el agua turbia
  C(26, "El agua se pone turbia, gris", "SbBucketSoak"),
  B(26, "Rosa decía que el agua del remojo", "b_rosabucket", `${ROSA} looking down into a deep soaking tub of cloudy gray water in ${LAUND}.`),
  // 353 · más de seis horas no suma
  B(27, "Más de seis horas no suma", "b_night", `A bucket of soaking sheets left on a dark laundry room floor at night, the window black.`),
  B(27, "Con dos horas alcanza", "b_timer", `A simple kitchen timer set beside a bucket of soaking white sheets on a laundry counter.`),
  B(27, "mejor dos remojos en dos días", "b_calendar", `A paper wall calendar in a laundry room with two days in a row circled in pen.`),
  // 365 · el lavado
  ST(28, "Después del remojo viene el lavado", "b_wring", "wringing wet cloth", `Two hands pressing water out of a white sheet against the side of a bucket with a wooden paddle.`),
  B(28, "el secreto que el vendedor de jabón nunca le iba a decir", "b_drumstack", `Big plastic drums of laundry detergent with blank labels stacked in a hotel basement, one with a scoop on top.`),
  V(29, "La mitad. Ni una gota más", "b07"),
  // 380 · el jabón de más
  C(30, "Porque el jabón de más no limpia más", "SbHalfSoap"),
  B(30, "Era que lavaba con demasiado", "b_suds", `A home washing machine with far too much white foam pushing against the inside of its glass door.`, { anim: "the foam swells behind the glass" }),
  // 394 · enjuague doble, sin suavizante
  ST(31, "Y elija enjuague doble", "b_dial", "washing machine dial", `A finger turning the dial of a home washing machine, the panel symbols not readable.`),
  B(31, "Que salga todo", "b_clearrinse", `Clear rinse water running through white sheets behind the glass door of a washing machine.`, { anim: "the clear water runs over the sheets" }),
  B(31, "Y no ponga", "b_softener", `A bottle of fabric softener with a blank label set aside on a shelf, its cap closed.`),
  B(31, "y la cera también se pone gris", "b_waxy", `Extreme close view of a dull, slightly waxy-looking cotton sheet surface under window light.`),
  // 406 · no llenar la lavadora
  C(32, "Si van apretadas, no se enjuagan", "SbDrumLoad"),
  ST(32, "la máquina de cuarenta kilos se cargaba con treinta", "b_bigwasher", "industrial washing machine", `A big stainless steel industrial washing machine with its round door open in ${LAUND}, a laundry cart beside it.`),
  // 417 · CTA 2
  C(33, "Si quiere tener la proporción a mano", "ClBookPage", { page: I + "book_p37.png", pageNo: 37 }),
  V(33, "Son arreglos de uno o dos dólares", "b09"),
  B(33, "que reemplazan gastos de cien", "b_newset", `A new set of white cotton sheets in a clear plastic package on a store shelf, no brand visible, a price tag with no readable numbers.`),
  C(33, "y el libro lo recupera", "ClQRCard", { qr: I + "qr.png", cover: I + "book_cover.png", head: "PÁGINA 37 · EL LAVADERO", text: "escanee con la cámara" }),
  // 442 · el último paso
  ST(34, "El que la lavandería hacía en la terraza del hotel", "b_terrace", "clothesline rooftop sheets", `A flat hotel rooftop terrace with long clotheslines of white sheets drying in the sun, a city behind.`, { anim: "the sheets sway in the wind" }),
  V(35, "Cuelgue las sábanas al sol", "b10"),
  C(35, "El sol termina el trabajo", "SbSunLine"),
  // 459 · el departamento
  B(36, "Y si vive en un departamento", "b_balcony", `A small apartment balcony with no room for a clothesline, a city building across.`),
  ST(36, "Cuélguelas junto a la ventana más luminosa", "b_window", "white sheets drying window", `White cotton sheets hung open on a drying rack beside a bright apartment window.`, { anim: "the sheets move a little in the air" }),
  ST(36, "No es lo mismo que el sol directo", "b_windowlight", "sunlight window curtain", `Soft daylight through a window falling across a white sheet on a drying rack, close view.`),
  // 474 · la secadora
  ST(37, "Y si usa secadora", "b_dryer", "clothes dryer", `A front-loading clothes dryer with its door open and white sheets inside, in a home laundry corner.`),
  B(37, "y sólo cuando ya estén blancas", "b_checkwhite", `Two hands holding a white sheet up to the light to check it before putting it into a dryer.`),
  B(37, "La secadora caliente sobre una sábana que todavía tiene mancha", "b_stain", `Close view of a faint yellow stain on a white sheet next to the open door of a clothes dryer.`),
  // 484 · fundas y cuello
  B(38, "Ahora, las fundas de almohada", "b_pillowcases", `Two white pillowcases with yellowish patches laid flat on a bed, close view.`),
  C(39, "Por eso las fundas se ponen amarillas", "SbPillowZone"),
  B(39, "Y para ellas, una hora más de remojo", "b_pillowsoak", `White pillowcases soaking in a small bucket of water on a laundry counter, a kitchen timer beside it.`),
  B(39, "y después al balde", "b_barsoap", `A bar of laundry soap rubbed on a yellowish patch of a white pillowcase over a sink.`, { anim: "the soap bar rubs the fabric" }),
  // 510 · axilas
  B(40, "Y me preguntan por las manchas oscuras de las axilas", "b_tshirt", `A white cotton T-shirt laid flat with grayish marks at the underarms, close view.`),
  B(40, "El mismo remojo sirve, frotando antes con jabón en barra", "b_tshirtrub", `A hand rubbing a bar of laundry soap on the underarm of a white T-shirt over a sink.`),
  B(40, "y tarda dos o tres remojos", "b_tshirtsoak", `A white T-shirt soaking in a bucket of water on a laundry room floor.`),
  // 525 · los cinco errores
  ST(41, "Ahora, los cinco errores que vi en las casas", "b_line", "clothesline backyard", `A backyard clothesline with dingy gray sheets hanging in the shade between two houses.`),
  C(42, "Uno. El cloro en el algodón", "SbFiveErrors", { hi: 1 }),
  B(43, "no se enjuaga, y queda gris", "b_packed", `A home washing machine drum packed tightly to the top with sheets and towels, the door open.`),
  B(44, "Tres. Más jabón para que limpie más", "b_doublecap", `Two full caps of liquid detergent being poured into a washing machine drawer at once.`, { anim: "the detergent pours into the drawer" }),
  B(44, "Más jabón, más gris", "b_graypair", `A gray sheet and a box of laundry detergent with a blank label on top of a washing machine.`),
  B(45, "Cuatro. Suavizante en cada lavado", "b_softpour", `Blue fabric softener poured into the softener slot of a washing machine drawer.`),
  B(45, "la hace menos absorbente", "b_towelwater", `Water beading on the surface of an old white towel instead of soaking in, close view.`),
  ST(46, "El calor la cocina adentro de la fibra", "b_dryerheat", "dryer drum spinning", `The hot round drum inside a clothes dryer seen through its door, white sheets tumbling.`, { anim: "the sheets tumble in the drum" }),
  // 564 · la rutina
  B(47, "La rutina completa, como la hacía Rosa", "b_rosatable", `${ROSA} folding a white sheet on a long table in ${LAUND}, buckets on the floor behind her.`),
  C(48, "Primero, la prueba de la gota caliente", "SbRoutine"),
  B(48, "dos tazas del frasco marrón y media de bicarbonato", "b_measure", `${G} pouring from ${BOTTLE} into a clear measuring jug over a bucket of hot water.`),
  B(48, "Tercero, las sábanas abiertas, tapadas", "b_opensoak", `An open white sheet floating under the water of a large bucket, a wooden paddle across the rim.`),
  B(48, "Quinto, al sol o a la ventana", "b_sunsheet", `${WHITES} hanging on a clothesline in morning sun in a small backyard.`),
];
