// DIRECTOR B — cons6na: el rociador mitad y mitad + rociar + 30 min + esponja blanca + la SOMBRA + el paso 4 (LA COMPRESA: papel,
// film, 1 hora, por qué funciona) + esmalte viejo 1 h + el bicarbonato que se saltean + CTA 2 + la esmaltada (óxido, pómez) + polvos
// y esponjas + el rincón primero (párr. 25-45).
import { C, B, ST, V, G, TUB, RING, CLEAN, VINEGAR, SOAP, SPRAY, WSPONGE, I } from "./dir_a.mjs";
export const SHOTS = [
  // 359,6 · el rociador
  V(25, "El vinagre caliente va al rociador", "a02"),
  C(25, "Y encima, una taza de detergente", "TbSprayFill"),
  B(25, "no sale por la boquilla", "b_foam", `Close view of the trigger nozzle of ${SPRAY} clogged with white foam, a few bubbles dripping.`),
  V(26, "rocíe toda la línea amarilla", "a03"),
  B(26, "que chorree un poco hacia abajo", "b_drip", `Wet sprayed liquid running down from the yellow ring of a white bathtub in small streaks, close view.`, { anim: "drips run slowly down the wall" }),
  B(26, "alrededor de la llave", "b_spraytap", `${G} spraying the base of the chrome spout of a white bathtub, droplets on the chrome.`, { anim: "the spray mists the spout" }),
  // 389,8 · 30 minutos
  C(27, "Treinta minutos", "TbHourglass"),
  B(27, "por eso usamos detergente", "b_cling", `A glossy wet film of dish soap and vinegar clinging to the curved inside wall of a white bathtub over a yellow ring, not running off, close view.`),
  B(28, "frote en círculos, suave", "b_circles", `${G} rubbing the wet yellow ring of a white bathtub in small circles with ${WSPONGE}, foam, close view.`, { anim: "the sponge moves in slow circles" }),
  B(28, "Va a sentir que la línea se pone lisa", "b_smooth", `A gloved fingertip sliding along a wet, now smooth white bathtub wall, the yellow mostly gone.`),
  V(28, "Enjuague con la ducha de mano", "a07"),
  // 415,9 · la sombra
  B(29, "ahí ya se fue casi todo", "b_mostly", `The inside wall of a white bathtub after cleaning, wet and shiny, only a faint pale yellow shadow left along the water line.`),
  B(29, "queda como una sombra", "b_shadow", `Close view of a faint yellowish shadow line on otherwise clean white acrylic, water drops on it.`),
  // 427,2 · el paso 4: la compresa
  B(30, "el paso número cuatro", "b_paperroll", `A roll of white paper towel and a roll of clear plastic wrap standing on the wide rim of a white bathtub.`),
  B(30, "le decíamos la compresa", "b_compress", `Wet paper towel strips lying flat along the inside wall of a white bathtub, close view.`),
  ST(30, "en todas las tinas de hidromasaje", "s_jacuzzi", "jacuzzi tub", `A white whirlpool tub with jets in a spa bathroom.`),
  B(31, "Caliente otra taza de vinagre", "b_cup2", `A glass measuring cup of white vinegar, lightly steaming, on the rim of a white bathtub.`),
  B(31, "Sólo tres", "b_threedrops", `Three drops of green dish soap falling from a bottle into a glass cup of vinegar, close view.`, { anim: "drops fall into the cup" }),
  B(31, "Moje tiras de papel de cocina", "b_soakpaper", `${G} dipping a folded strip of white paper towel into a glass cup of vinegar until it is soaked.`),
  V(32, "una al lado de la otra", "a04"),
  B(32, "Que no quede aire abajo", "b_pressair", `${G} pressing a wet paper towel strip flat against the curved wall of a white bathtub, pushing a small air bubble out.`),
  C(33, "Encima, film de cocina", "TbCompress3D"),
  C(34, "Porque en vez de frotar", "TbScratchLens"),
  // 488,7 · la hora
  B(35, "A la hora, saca el film", "b_peelfilm", `${G} peeling clear plastic wrap off wet paper towel strips on the inside of a white bathtub.`, { anim: "the wrap peels slowly away" }),
  B(35, "saca el papel", "b_peelpaper", `${G} lifting a soggy, slightly yellow-stained paper towel strip off a white bathtub wall.`),
  B(35, "Una sola pasada", "b_onepass", `${WSPONGE} in a blue nitrile glove making one long pass along a white bathtub wall, the yellow shadow wiping away.`, { anim: "one slow pass of the sponge" }),
  B(35, "En la cuatrocientos doce salió entera", "b_cleanacr", `${CLEAN}, wet and shining in the light.`),
  B(36, "le saca el brillo", "b_dullenamel", `Close view of an old enameled bathtub with a dull matte etched patch where acid sat too long, the rest glossy.`),
  B(36, "Una hora, y enjuague abundante", "b_bucket", `Water poured from a plastic bucket over the inside of an old white enameled bathtub.`, { anim: "water pours from the bucket" }),
  // 517,8 · el bicarbonato
  B(37, "Y por el que después me escriben", "b_slick", `A bare wet foot stepping into a white bathtub, close view.`),
  B(38, "El detergente deja una película", "b_film", `Close view of water sheeting and beading oddly on a white bathtub floor that still has a thin soapy film.`),
  B(38, "Es peligrosa, sobre todo para la gente mayor", "b_grabbar", `An older woman's hand holding a chrome grab bar next to a white bathtub.`),
  V(39, "espolvoree un poco de bicarbonato", "a08"),
  B(39, "como si la lustrara", "b_polish", `${WSPONGE} in a blue nitrile glove gently buffing a thin paste of baking soda on a wet white bathtub floor.`),
  B(39, "neutraliza lo que quedó de vinagre", "b_sodafizz", `Tiny bubbles fizzing where baking soda meets a little vinegar on a white bathtub wall, extreme close view.`, { anim: "tiny bubbles fizz" }),
  B(40, "Tiene que rechinar un poquito", "b_squeak", `A bare hand rubbing a clean wet white bathtub wall, close view.`),
  // 559,6 · CTA 2
  C(41, "si quiere tener a mano las cantidades exactas", "ClBookPage", { page: I + "book_p29.png", pageNo: 29 }),
  B(41, "junto con otros noventa arreglos", "b_shelfcheap", `A hotel maintenance shelf with a jug of white vinegar, a box of baking soda, a brown bottle and a bottle of dish soap, all with plain blank labels.`),
  B(41, "y el libro lo recupera", "b_coins", `Two coins and a small receipt-free invoice envelope on a bathroom counter next to a clean white bathtub rim.`),
  C(41, "El link está en la primera línea", "ClQRCard", { qr: I + "qr.png", cover: I + "book_cover.png", head: "PÁGINA 29 · EL ANILLO DE LA BAÑERA", text: "escanee con la cámara" }),
  // 584,4 · la esmaltada
  ST(42, "una tina esmaltada vieja", "s_vintagetub", "vintage bathtub", `An old enameled bathtub in a bathroom.`),
  B(43, "debajo de la llave", "b_rustdrip", `An orange-brown streak on old white enamel under the chrome spout of a bathtub where water drips.`),
  C(43, "Eso es óxido del agua", "TbEnamelRust"),
  B(43, "la piedra pómez, siempre mojada", "b_pumice", `${G} rubbing a wet gray pumice stone gently on a small orange rust stain on white enamel, water on it.`, { anim: "the pumice rubs gently back and forth" }),
  B(43, "sólo sobre la mancha", "b_rustgone", `Old white enamel under a chrome bathtub spout, wet and clean where an orange stain used to be, only a faint trace left.`),
  B(44, "esos que vienen en lata", "b_powdercan", `A round can of scouring powder with a plain blank label on the edge of an old enameled tub.`),
  C(44, "En una acrílica, nunca", "TbSpongeScale"),
  B(45, "Abajo, cerca de la pared", "b_corner", `${G} dabbing a little liquid on a hidden lower corner of a white bathtub next to the wall, close view.`),
  B(45, "mire con luz", "b_flashlight", `A small flashlight beam raking across the corner of a white bathtub to check the shine.`, { anim: "the light beam sweeps across" }),
];
