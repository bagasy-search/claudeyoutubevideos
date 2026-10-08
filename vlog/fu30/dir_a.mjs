// DIRECTOR A — fu30 (Claudio el Fumigador #2, "La casa de los Ramírez" ep. 2: la barrera de la puerta): MINUTO 1 (la cucaracha grande
// metiéndose por la rendija de la puerta del patio en el seg 0 + "no vive en esta casa: entra" → los Ramírez, 2 fumigaciones, la fila de
// hormigas → loop de lo que había a 2 m de la puerta → promesa (las 5 cosas + lo que va antes) + vistazo → credibilidad + la revisión de
// la linterna → capítulo) + la casa (polaroid del ep. 1) + seguir la fila (leña/nido, macetas, rama, tubo) + las 5 cosas (mención 1,
// frase del mostrador, pág. 10) (párrafos 0-26).
import { S, BI, CLP, LUCIA, JORGE, KIDS, DOG, HOUSE } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const H = "a pest-control technician's weathered tanned hands, the short sleeve of a light khaki work shirt at the edge of the frame";
export const KITCHEN = HOUSE;
export const DOOR = "the back patio door of a modest family kitchen: a white-painted wooden door with a small square glass window, a worn wooden threshold and white floor tiles inside";
export const PATIO = "the small back patio of a modest one-story Latin American house: a bare cement floor, a low concrete step outside a white-painted kitchen door, a lemon tree, a stack of firewood leaning against the house wall and three big clay flowerpots against the wall";
export const BIGROACH = "a large reddish-brown American cockroach";
export const ANTS = "a line of small black ants";
export const CHALK = "a thick unbroken white chalk line";
export const HERBS = "whole cloves, dry bay leaves and a cinnamon stick";
const I = "img/fu30/";
export const SHOTS = [
  // ── 0:00 · la cucaracha grande entrando por la rendija
  S(0, "", "kf", "k_gap", { p: BI(`Night, a flashlight beam on the white floor tiles at the bottom of ${DOOR.replace("the back patio door of a modest family kitchen: ", "")}, ${BIGROACH} squeezing in through the gap under the closed door.`), d1: "the cockroach's long antennae poke through the gap under the door", d2: "the big cockroach crawls in under the door onto the tiles", sound: "tiny scratching legs on tile", ov: { c: "ClStampOv", props: { text: "NO VIVE AQUÍ · ENTRA" } } }),
  S(0, "Entra.", "bi", "st_bigroach", { q: "american cockroach", p: BI(`${BIGROACH} on a white tile floor at night, lit by a flashlight.`) }),
  S(0, "Todas las noches, por esta rendija", "bi", "b_gapclose", { p: BI(`Extreme close view of the dark gap under a closed white-painted wooden door, light from the patio outside leaking in, a cockroach's antennae in the gap.`) }),
  S(0, "Y el veneno que rocías adentro", "bi", "b_aerosol", { q: "insect spray can", p: BI(`Close view of a hand pressing an aerosol insecticide can with a plain blank label toward the baseboard of a kitchen, a mist in the air.`) }),
  S(0, "no le hace nada a la que viene de afuera", "bi", "b_outside", { q: "cockroach outdoor night", p: BI(`Night, ${BIGROACH} on the concrete step outside a closed kitchen door, walking toward the gap under it.`) }),
  // ── los Ramírez
  S(1, "", "bi", "b_door", { p: BI(`Night, ${DOOR}, seen from inside the dark kitchen, a thin line of light under it.`) }),
  S(1, "de los Ramírez", "bi", "b_housefront", { q: "small house front", p: BI("The front of a modest one-story Latin American family house at dusk, a side garage door and a small front garden.") }),
  S(1, "Dos niños, un perro", "bi", "b_family", { q: "family kitchen children", p: BI(`${LUCIA} and ${JORGE} in their kitchen with ${KIDS} and ${DOG}, an ordinary evening.`) }),
  S(1, "un perro, dos", "bi", "b_bruno0", { q: "dog lying floor", p: BI(`${DOG} lying on the tiled kitchen floor near the back door, lifting his head.`) }),
  S(1, "dos fumigaciones pagadas", "bi", "b_receipts", { q: "receipts table", p: BI("Two pest-control service receipts with plain blank logos lying on a kitchen table next to a pen.") }),
  S(1, "Y cada noche, por debajo de esa puerta", "bi", "b_antsin", { q: "ants under door", p: BI(`${ANTS} coming in through the gap under a closed white-painted door onto white floor tiles, lit by a flashlight.`) }),
  S(1, "una fila de hormigas detrás de la cucaracha", "kf", "k_antsfollow", { p: BI(`Night, flashlight on white floor tiles just inside a closed door: ${BIGROACH} on the tiles and ${ANTS} coming in behind it through the gap under the door.`), d1: "the ants file in under the door behind the cockroach", d2: "the line of ants keeps marching across the tiles", sound: "a faint ticking of tiny legs" }),
  // ── el loop
  S(2, "", "cl", "c_follow", { p: CLP(`At night he crouches on a concrete patio at the base of a house wall, pointing a flashlight along the ground at a line of ants, looking back at the camera with raised eyebrows.`) }),
  S(2, "fila hacia afuera", "bi", "b_antstep0", { p: BI(`Night, ${ANTS} going down a low concrete step outside a closed kitchen door, lit by a flashlight.`) }),
  S(2, "a dos metros de la puerta", "bi", "b_woodpile", { p: BI(`Night, ${PATIO.replace("the small back patio of a modest one-story Latin American house: ", "a small back patio: ")}, a flashlight beam on the firewood stack against the wall.`) }),
  S(2, "explica por qué ninguna fumigación", "bi", "b_mochila", { q: "pest control spraying", p: BI("A pest-control man in gray overalls and a respirator mask with a backpack sprayer spraying along the base of a house wall in a small patio.") }),
  S(2, "Te lo muestro en un rato", "av", ""),
  // ── la promesa
  S(3, "", "av", ""),
  S(3, "que pongo en cada puerta", "cl", "c_chalkdoor", { p: CLP(`He kneels at a white-painted back kitchen door drawing a thick white chalk line along the wooden threshold, looking at the line.`) }),
  S(3, "y cada ventana", "bi", "b_windowframe", { q: "kitchen window frame", p: BI("A small kitchen window with a wooden frame, whole cloves and a bay leaf placed in its corner, daylight.") }),
  S(3, "clavo de olor", "bi", "st_cloves", { q: "cloves spice", p: BI("A small glass jar of whole cloves spilled on a wooden kitchen counter.") }),
  S(3, "laurel, canela", "bi", "b_fiveitems", { p: BI(`On a wooden kitchen table: a stick of white chalk, a small pile of whole cloves, dry bay leaves, two cinnamon sticks and a white spray bottle of vinegar, lined up.`) }),
  S(3, "y vinagre", "bi", "b_vinegar", { q: "vinegar bottle", p: BI("A white plastic spray bottle of clear vinegar with a plain blank label next to a glass bottle of white vinegar on a kitchen counter.") }),
  S(3, "Y lo que va antes", "bi", "b_sweep0", { q: "door bottom seal", p: BI(`Close view of ${H} pressing a brush door sweep strip against the bottom of a white-painted wooden door.`) }),
  S(3, "y lo que cuesta", "bi", "b_coins", { q: "coins hand", p: BI("A few coins and a short paper hardware-store receipt in an open weathered palm.") }),
  C(3, "Con las medidas exactas", "ClBarrierLine", { mode: "herbs" }),
  S(3, "Así entraban de noche", "bi", "b_nightbefore", { p: BI(`Night, ${DOOR} lit by a flashlight from inside, ${ANTS} and ${BIGROACH} coming in under the door.`), ov: { c: "ClChip", props: { text: "Antes", alert: true } } }),
  S(3, "Y así quedó esa puerta", "bi", "b_nightafter", { p: BI(`Night, ${DOOR} lit by a flashlight from inside, a brush door sweep on its bottom, ${CHALK} along the threshold, ${HERBS} along the frame, no insects.`), ov: { c: "ClChip", props: { text: "1 semana después" } } }),
  // ── credibilidad + linterna
  S(4, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de fumigador" } } }),
  S(4, "Treinta años de fumigador", "bi", "b_truck", { q: "pest control truck", p: BI("An old white pickup truck with a pest-control sprayer tank and hoses in its bed, parked on a quiet residential street.") }),
  S(4, "En mi casa no entra ni un bicho", "cl", "c_mydoor", { p: CLP(`He stands relaxed in the open back door of his own modest house in the afternoon, one hand on the wooden frame, ${HERBS.replace("whole cloves, dry bay leaves and a cinnamon stick", "a few cloves and bay leaves")} tucked along the frame.`) }),
  S(4, "y no uso nada de lo que vendo", "bi", "b_cans", { q: "pesticide shelf", p: BI("A garage shelf full of pest-control spray cans and jugs with plain blank labels, dusty.") }),
  S(4, "Y al final te doy", "av", ""),
  S(4, "la revisión de diez minutos", "bi", "b_flashlight", { q: "turning on flashlight", p: BI(`Close view of ${H} switching on a yellow flashlight in a dark kitchen doorway.`), ov: { c: "ClChip", props: { text: "$0 · 10 minutos" } } }),
  S(4, "para que sepas por dónde te entran a ti", "bi", "b_lightgap", { q: "light under door", p: BI("Night, a dark room seen from inside, a bright thin line of light under a closed door.") }),
  C(5, "", "ClChapter", { n: 1, title: "La puerta de los Ramírez", sub: "dos fumigaciones · la misma fila" }),
  // ── la casa
  C(6, "", "ClVideoRef", { thumb: I + "th_fuagua.jpg", title: "El frasco de agua oxigenada", tag: "VIDEO ANTERIOR" }),
  S(6, "si no lo viste, te lo dejo aquí", "av", ""),
  S(7, "", "bi", "b_nightkitchen", { p: BI(`Night, ${KITCHEN} dark, a flashlight beam crossing the floor toward the back door.`) }),
  S(7, "alumbré el piso", "cl", "c_doorflash", { p: CLP(`At night he stops at a white-painted back patio door and points a flashlight down at the floor gap under it.`) }),
  S(7, "Una cucaracha grande, rojiza", "bi", "st_bigroach2", { q: "big cockroach floor", p: BI(`${BIGROACH} on white floor tiles at night next to a door.`) }),
  S(7, "una fila de hormigas negras", "bi", "b_antsline", { q: "ants line floor", p: BI(`${ANTS} crossing white floor tiles near a door at night.`) }),
  S(8, "", "bi", "b_lucia", { q: "woman kitchen night", p: BI(`${LUCIA} standing by the back door of her kitchen at night, arms crossed, tired, looking at the floor.`) }),
  S(8, "la fila llega hasta el plato de Bruno", "bi", "b_bowl", { q: "ants dog bowl", p: BI(`${ANTS} reaching a steel dog food bowl with a few kibbles on a white tiled kitchen floor.`) }),
  S(9, "", "bi", "b_jorgespray", { q: "man spraying door", p: BI(`${JORGE} spraying an aerosol can with a plain blank label along the bottom of the back patio door of his kitchen.`) }),
  S(9, "Y el señor de la segunda fumigación", "bi", "b_mochila2", { q: "pest control backyard", p: BI("A pest-control man in gray overalls and a respirator mask with a backpack sprayer spraying a small cement patio and its flowerpots.") }),
  S(9, "A los diez días, la fila volvió", "bi", "st_ants2", { q: "ants line", p: BI(`${ANTS} on a white kitchen floor tile along a baseboard.`) }),
  S(10, "", "av", ""),
  S(10, "Entran.", "bi", "b_gaplow", { p: BI(`Extreme low view along white floor tiles toward the gap under a closed door, light from outside leaking in.`) }),
  S(10, "vas a estar matando visitas", "av", ""),
  C(11, "", "ClChapter", { n: 2, title: "Seguir la fila", sub: "hacia donde viene" }),
  // ── seguir la fila
  S(12, "", "av", ""),
  S(12, "Te agachas con la linterna", "cl", "c_crouch", { p: CLP(`At night he kneels on white kitchen floor tiles with a flashlight, following a line of ants toward a back door with his eyes.`) }),
  S(12, "Hacia donde viene", "kf", "k_follow", { p: BI(`Night, extreme close view of ${ANTS} walking on white floor tiles toward a door, a flashlight beam following them.`), d1: "the ants walk in a line toward the door", d2: "the flashlight beam slides along the line toward the door", sound: "a quiet kitchen at night" }),
  S(13, "", "bi", "b_ruler", { p: BI(`Close view of ${H} holding a small tape measure in the gap under a closed white-painted door, showing almost one centimeter.`) }),
  C(13, "una rendija de casi un centímetro", "ClDoorGap", { mode: "light" }),
  S(14, "", "bi", "b_step", { p: BI(`Night, ${ANTS} going down a low concrete step outside a white-painted kitchen door, lit by a flashlight.`) }),
  S(14, "cruzaba el patio pegada a la pared", "bi", "b_wallants", { q: "ants wall ground", p: BI(`Night, ${ANTS} along the base of a painted house wall on a cement patio, lit by a flashlight.`) }),
  S(14, "una pila de leña", "bi", "b_woodpile2", { q: "firewood stack wall", p: BI("A stack of split firewood leaning against the wall of a modest house in a small cement patio.") }),
  S(15, "", "kf", "k_nest", { p: BI(`Night, flashlight on damp dark soil just moved from under a firewood pile against a house wall: swarming black ants and tiny white ant eggs.`), d1: "the damp soil full of ants and white eggs", d2: "the ants swarm and carry the white eggs away from the light", sound: "a faint rustle in the dirt" }),
  S(15, "El nido.", "bi", "st_nest", { q: "ant nest eggs", p: BI("Close view of an ant nest in damp soil with many black ants and small white eggs.") }),
  S(15, "Pegado a la pared de la cocina", "cl", "c_nest", { p: CLP(`At night in a small patio he crouches next to a moved firewood pile against the house wall, pointing a flashlight at the soil, serious.`) }),
  S(16, "", "bi", "b_pots", { q: "flower pots wall", p: BI("Three big clay flowerpots with plants standing against the wall of a modest house, the cement under them dark and wet.") }),
  S(16, "una rama del limonero tocaba la ventana", "bi", "b_branch", { q: "tree branch window", p: BI("A lemon tree branch with leaves pressing against the outside of a small kitchen window frame.") }),
  C(16, "Una autopista directa al marco", "ClPerimeter30", { mode: "bridges" }),
  S(17, "", "bi", "b_sinkpipe", { q: "pipe under sink", p: BI(`Under a kitchen sink cabinet, lit by a flashlight: a water pipe entering the wall through a ragged hole much bigger than the pipe, a dark gap around it.`) }),
  S(17, "Otra puerta abierta", "av", ""),
  C(18, "", "ClChapter", { n: 3, title: "Las cinco cosas", sub: "la barrera, sin cuentos" }),
  // ── las cinco cosas
  S(18, "La barrera.", "bi", "b_list", { q: "shopping list handwritten", p: BI(`Close view of ${H} handing over a small handwritten paper list on a kitchen table, five lines written in pen.`) }),
  S(19, "", "av", ""),
  S(19, "Son una barrera", "bi", "b_antturn", { p: BI(`Close view of ${ANTS.replace("a line of", "a few")} on a wooden door threshold turning away in front of ${CHALK}.`) }),
  // mención 1 (frase del mostrador)
  S(20, "", "bi", "st_hardware", { q: "hardware store counter", p: BI("The counter of a small neighborhood hardware store with shelves of tools and boxes behind it.") }),
  S(20, "un frasco de clavo de olor entero", "bi", "b_counteritems", { p: BI(`On a hardware store counter: a box of white blackboard chalk, a small jar of whole cloves, a bag of dry bay leaves and a packaged brush door sweep strip.`) }),
  C(20, "El vinagre y la canela ya los tienes", "ClNotebook", { title: "En la ferretería", rows: [{ k: "Tiza", v: "blanca" }, { k: "Clavo", v: "entero" }, { k: "Laurel", v: "hojas" }, { k: "Burlete", v: "1 puerta" }], note: "La frase exacta · pág. 10" }),
  C(20, "En el Manual te dejé la frase exacta", "ClBookPage", { page: I + "page10.jpg", pageNo: 10, stamp: "La frase, en la página" }),
  S(21, "", "bi", "b_chalkdraw", { q: "drawing chalk line", p: BI(`Close view of ${H} drawing ${CHALK} along a wooden door threshold.`) }),
  C(21, "las hormigas evitan cruzar ese polvo", "ClBarrierLine", { mode: "line" }),
  S(22, "", "bi", "st_cloves2", { q: "whole cloves macro", p: BI("Extreme close view of whole cloves in an open palm.") }),
  S(23, "", "bi", "st_bay2", { q: "dry bay leaves", p: BI("Dry bay leaves in a small bowl on a wooden kitchen table.") }),
  S(23, "una hoja de laurel en la harina", "bi", "b_flourjar", { q: "flour jar", p: BI("An old glass jar of flour on a kitchen shelf with a dry bay leaf on top of the flour.") }),
  S(24, "", "bi", "st_cinnamon2", { q: "cinnamon sticks closeup", p: BI("Close view of cinnamon sticks on a wooden board.") }),
  S(25, "", "bi", "b_vinegarspray", { q: "spraying vinegar", p: BI(`Close view of ${H} spraying a white spray bottle of vinegar along a wooden door threshold.`) }),
  S(25, "Es como borrarles el mapa", "av", ""),
  S(26, "", "bi", "b_shopbag", { q: "items on table", p: BI(`On a kitchen table: a box of white chalk, a small jar of whole cloves, dry bay leaves, cinnamon sticks, a white spray bottle and a brush door sweep, a short paper receipt beside them.`) }),
];
