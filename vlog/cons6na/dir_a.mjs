// DIRECTOR A — cons6na (la línea amarilla de la tina): MINUTO 1 (9 de la noche, el agua sube, la línea → frotó, cloro → promesa
// sin lija, mitad y mitad) + 300 habitaciones + los 3 anzuelos + CTA 1 (pág. 29) + las TRES CAPAS + por qué el cloro no + la suite 412
// (gerente, Don Ramiro) + nudillos + algodón + material amarillo + lo que necesita + regla del cloro + vinagre caliente (párr. 0-24).
// Avatar = ventanas PAGADAS (_v3/cons6na_avlock.json, AV_LOCK): acá no van AV(). Veo a01-a10 = tomas con Claudio (broll/cons6na/aNN.mp4).
import { S, BI } from "../claudio/lib.mjs";
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: BI(scene), ...o });
export const V = (p, at, name) => S(p, at, "cl", name, { p: "veo", veo: 1 });
export const G = "a hand in a blue nitrile glove";
export const TUB = "a white acrylic built-in bathtub in a hotel bathroom with white subway tiles and a chrome faucet";
export const RING = "the inside wall of a white acrylic bathtub with a dull yellow-brown ring along the old water line, a hand-width below the rim";
export const CLEAN = "the inside wall of a spotless glossy white acrylic bathtub with no ring at all at the water line";
export const VINEGAR = "a big clear plastic jug of white vinegar with a plain blank label";
export const SOAP = "a clear bottle of green dish soap with a plain blank label";
export const SPRAY = "a clear plastic spray bottle with a plain blank label";
export const WSPONGE = "a soft white non-scratch sponge";
export const RAMIRO = "Don Ramiro, a hotel maintenance chief in his sixties with a gray mustache, a gray work coat and reading glasses in the pocket";
export const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie, holding a small black notebook";
export const ROSA = "Rosa, a hotel housekeeper in her fifties with dark hair in a bun and a light-blue housekeeping uniform";
export const I = "img/cons6na/";
export const SHOTS = [
  // ── 0:00 · el agua sube y ahí está la línea (avatar 0-3,4)
  B(0, "Usted abre la llave", "b_tapopen", `${G} turns the chrome mixer handle of ${TUB}, the first stream of water falling into the empty tub, close view.`, { anim: "water starts to pour" }),
  ST(0, "para darse un baño caliente", "s_tubfill", "bathtub filling water", `Water filling a white bathtub, steam rising.`),
  B(0, "caliente", "b_steamtap", `Steam rising from hot water pouring out of a chrome bathtub spout into a white tub, close view.`, { anim: "steam curls up from the falling water" }),
  B(0, "el agua empieza a subir", "b_waterrise", `Clear water rising inside ${TUB}, the surface just reaching a dull yellow-brown ring on the white wall, close side view.`, { anim: "the water level slowly rises" }),
  B(0, "y ahí está otra vez", "b_ringagain", `Clear bath water lapping gently against ${RING}, close side view.`, { anim: "small ripples lap at the ring" }),
  B(0, "Esa línea amarilla", "b_ringclose", `Close view of ${RING}, the stripe uneven, darker at the back near the faucet.`),
  V(0, "justo donde se queda el agua", "a01"),
  B(1, "La frotó el sábado", "b_greenscrub", `${G} scrubbing the yellow ring of a white acrylic bathtub with a green scouring sponge, suds on the wall.`),
  B(1, "Le pasó la esponja verde", "b_greensponge", `A worn green scouring sponge dropped on the rim of a white bathtub next to a yellow ring, suds drying on it.`),
  ST(1, "Le echó cloro", "s_bleach", "pouring bleach", `A white plastic jug of bleach being tilted, a little liquid coming out.`),
  // 20,9 · promesa
  B(2, "Hoy se la saco", "b_tubdark", `${TUB} at night under a single warm bathroom light, ${RING}.`),
  B(2, "Sin lija", "b_sandpaper", `A sheet of gray sandpaper and a round can of scouring powder pushed to the side on a bathroom floor tile, next to a white bathtub.`),
  B(2, "sin polvo que raye", "b_powderno", `A round can of scouring powder with a plain blank label tipped over on bathroom tiles, a little white powder spilled.`),
  B(2, "con dos cosas que ya tiene en la cocina", "b_twokitchen", `${VINEGAR} and ${SOAP} side by side on a home kitchen counter next to the sink, daylight from a window.`),
  C(2, "Mire", "TbTub3D", { labels: true }),
  // 29,9 · treinta años
  ST(3, "Treinta años fui conserje", "s_hotelhall", "hotel corridor", `A long carpeted hotel corridor with numbered doors.`),
  B(3, "y casi todas con tina", "b_tubsrow", `A housekeeping cart parked in a hotel corridor next to an open door, a white bathtub visible inside the guest bathroom.`),
  B(3, "Y le digo una cosa", "b_keyring", `A big ring of old brass hotel master keys hanging from a hook in a maintenance workshop.`),
  B(3, "esa línea amarilla es la mancha", "b_ringhotel", `${RING} in a hotel guest bathroom, a folded white towel on the rim.`),
  ST(3, "tinas vi cambiar", "s_demolition", "bathroom renovation demolition", `A bathroom being torn out, broken tiles and an old tub.`),
  // 44 · los tres anzuelos
  B(4, "Pero antes de tocarla", "b_glovehover", `${G} hovering just above ${RING}, not touching it yet.`),
  B(4, "hay tres cosas que tiene que saber", "b_threebottles", `A white bleach jug, a white cotton pad and a roll of clear plastic wrap lined up on the rim of a white bathtub.`),
  B(4, "Por qué el cloro nunca la saca", "b_bleachedge", `${RING}, the upper edge a little paler than the middle where bleach was poured, close view.`),
  B(4, "La prueba de diez segundos con un algodón", "b_cottonpad", `A white cotton pad held between two blue nitrile gloved fingers next to the yellow ring of a white bathtub.`),
  B(4, "el que usábamos en las suites", "b_suitebath", `A bright hotel suite bathroom with a large white acrylic bathtub, folded towels and a small orchid on the counter.`),
  B(4, "sin rayarlas", "b_glossy", `A gloved hand gliding over the glossy, unscratched white acrylic wall of a bathtub, light reflecting smoothly.`, { anim: "the hand glides slowly along the wall" }),
  B(4, "Y el paso número cuatro", "b_tease", `Wet white paper towel strips pressed in a row along the curved inside wall of a white bathtub and covered with clear plastic wrap, close view.`),
  // 64,4 · CTA 1
  C(5, "Este arreglo está en mi libro", "TbBookTub", { page: I + "book_p29.png", cover: I + "book_cover.png", qr: I + "qr.png", pageNo: 29 }),
  C(5, "El link está en la primera línea", "TbBookTub", { page: I + "book_p29.png", cover: I + "book_cover.png", qr: I + "qr.png", pageNo: 29, skip: 96 }),
  // 75,7 · tres capas
  B(6, "Empecemos por lo que nadie le explica", "b_ringmacro", `Extreme close view of the yellow-brown ring on white acrylic, the stripe slightly raised and waxy, a drop of water beading on it.`),
  B(6, "Son tres capas", "b_ringside", `Very low raking light across the inside wall of a white bathtub showing a thin raised yellow line like a crust, close view.`),
  C(7, "La grasa de la piel", "TbLayers3D", { stage: 1 }),
  B(7, "se queda pegado justo en la línea", "b_draining", `A white bathtub draining, the water level dropping below a yellow ring that stays on the wall, swirl at the drain.`),
  B(8, "La segunda es jabón", "b_soapbar", `A wet bar of white soap sitting in a soap dish on the edge of a white bathtub, soft soap residue around it.`),
  C(8, "como una cera finita", "TbLayers3D", { stage: 2 }),
  B(8, "Pase el dedo por la línea", "b_fingerline", `A bare fingertip running along the yellow ring inside a white bathtub, close view.`),
  B(8, "un poco áspera", "b_fingermacro", `Extreme close view of a fingertip touching a slightly rough yellow crust on white acrylic.`),
  B(9, "es sarro", "b_scalecrust", `Close view of a hard pale crust of limescale on the inside of a white bathtub near the drain.`),
  ST(9, "La piedra que trae el agua", "s_tapwater", "tap water glass", `A glass being filled with tap water.`),
  C(9, "Y si su agua trae un poco de hierro", "TbLayers3D", { stage: 3 }),
  B(9, "Es amarilla, a veces casi naranja", "b_orangering", `${RING}, the back part of the stripe turning orange.`),
  // 131,8 · por qué el cloro no
  B(10, "Porque el cloro blanquea lo que está arriba", "b_bleachpour", `A splash of bleach running down over the yellow ring of a white bathtub, the top edge of the ring fading a little.`),
  B(10, "Y la grasa lo frena", "b_beading", `Liquid beading up and sliding off a greasy yellow ring on a white bathtub wall, close view.`),
  B(10, "la mancha del medio queda", "b_middle", `${RING}, the middle of the stripe still yellow, only the edges paler.`),
  B(10, "el cloro la amarillea más todavía", "b_yellowtub", `An old white acrylic bathtub with a faint overall yellowish tint, an empty bleach jug on the floor beside it.`),
  B(11, "Primero algo que corte la grasa", "b_dishsoap", `${SOAP} with a drop on its cap, standing on the rim of a white bathtub.`),
  B(11, "calientes, para que trabajen", "b_steamcup", `A large glass measuring cup of hot white vinegar steaming gently on a bathroom counter.`),
  // 160,6 · la suite 412
  ST(12, "Le cuento cómo aprendí esto", "s_oldhotel", "old hotel lobby", `An old hotel lobby with a reception desk.`),
  B(12, "en la suite cuatrocientos doce", "b_suitedoor", `A dark wooden hotel suite door with a brass room plaque and a brass handle, carpeted hallway, warm light.`),
  B(12, "Una tina enorme, blanca, de acrílico", "b_jacuzzi", `A large white acrylic whirlpool tub with small chrome jets set into a tiled platform in a hotel suite bathroom.`),
  B(12, "Y tenía una línea amarilla", "b_jacuzziring", `The inside of a large white whirlpool tub with a wide yellow-brown ring along the water line and around the chrome jets.`),
  C(13, "El gerente, el de la libreta", "TbLedger412"),
  B(14, "Y Don Ramiro", "b_ramiro", `${RAMIRO}, kneeling by a large white whirlpool tub in a hotel suite bathroom, looking at the ring with a calm frown.`),
  B(14, "Trajo una jarra de vinagre caliente", "b_jug", `${RAMIRO} carrying a steaming glass jug of white vinegar through a hotel kitchen door.`),
  B(14, "y el detergente de lavar los platos", "b_ramirosoap", `A weathered hand holding ${SOAP} next to a big white whirlpool tub.`),
  B(14, "Esa tina se salvó", "b_jacuzziclean", `A large white whirlpool tub, spotless and glossy, the chrome jets shining, a folded towel on the platform.`),
  // 204,4 · qué tina tiene
  B(15, "hay que saber qué tina tiene", "b_twotubs", `Two bathtubs in two hotel bathrooms seen through open doors: a modern white acrylic tub and an old white enameled cast-iron tub.`),
  B(15, "una esmaltada no se tratan igual", "s_clawfoot", `An old white enameled cast-iron clawfoot bathtub with chipped feet in a tiled bathroom, morning light.`),
  B(15, "en la otra es un desastre", "b_scratched", `Close view of the dull scratched surface of a white acrylic bathtub, fine swirl marks with grime in them.`),
  V(16, "Golpee el borde con los nudillos", "a05"),
  C(16, "Si suena hueco", "TbKnock"),
  B(16, "Hierro o acero con una capa de vidrio", "b_enamelchip", `Close view of a chip in the white enamel on the edge of an old bathtub showing the dark cast iron underneath.`),
  // 239 · el algodón
  V(17, "Moje un algodón blanco", "a06"),
  B(17, "cinco o seis veces", "b_cottonrub", `${G} rubbing a white cotton pad hard along the yellow ring of a white bathtub, close view.`, { anim: "the pad rubs back and forth" }),
  C(18, "Esa mancha es mugre y piedra", "TbCotton"),
  B(19, "el sol de la ventana", "b_sunwindow", `Sunlight from a small bathroom window falling across an old white acrylic bathtub that has turned evenly yellowish.`),
  B(19, "Ese amarillo está adentro del plástico", "b_oldyellow", `Close view of an old acrylic bathtub rim, evenly yellowed, clean and dry, a clean white cotton pad resting on it.`),
  B(19, "Ni con esto, ni con lo que le vendan", "b_cleaners", `A row of colorful bathroom cleaner bottles with plain blank labels on a store shelf.`),
  ST(19, "con un pintor de tinas", "s_refinish", "bathtub refinishing", `A worker refinishing a bathtub.`),
  B(20, "el algodón salió amarillo", "b_cottonyellow", `A white cotton pad stained yellow-brown in the middle, held up by a blue nitrile glove against the light of a bathroom window.`),
  // 293,8 · lo que necesita
  B(21, "vinagre blanco, el común", "b_vinegar", `${VINEGAR} on a bathroom floor tile next to a white bathtub.`),
  B(21, "Detergente de lavar los platos", "b_soap2", `${SOAP} next to ${VINEGAR} on the rim of a white bathtub.`),
  B(21, "Papel de cocina, film de cocina", "b_flatlay", `Flat lay on a white bath towel: ${SPRAY}, a roll of paper towel, a roll of clear plastic wrap, ${WSPONGE}, a pair of blue nitrile gloves and a small box of baking soda.`),
  B(21, "y un poco de bicarbonato para el final", "b_sodabox", `A small open box of baking soda with a spoon on the rim of a white bathtub.`),
  B(22, "Y una regla antes de empezar", "b_rulebleach", `A white jug of bleach with a plain blank label standing alone on a bathroom floor, far from a white bathtub, a closed cabinet door behind it.`),
  C(22, "El vinagre y el cloro nunca se encuentran", "TbNeverPour"),
  // 328,8 · el vinagre caliente
  B(23, "Una taza de vinagre", "b_cupvinegar", `White vinegar being poured from a jug into a large glass measuring cup on a kitchen counter.`),
  ST(23, "que se pueda meter en el microondas", "s_microwave", "microwave oven", `A microwave oven door closing.`),
  B(23, "Y lo saca con un trapo", "b_cupcloth", `A hand using a folded kitchen towel to lift a hot steaming glass measuring cup out of a microwave.`),
  C(24, "Me lo preguntan siempre", "TbHeatJar"),
  ST(24, "cuando lava una sartén", "s_panwash", "washing frying pan hot water", `Washing a greasy frying pan under hot water.`),
];
