// DIRECTOR C — fumoscas: TERCERO (la albahaca en la ventana, párrafos 38-43) + CUARTO (la cinta pegajosa, 44-50) +
// "muchas moscas grandes = algo muerto" (51-56). bi = agnes-image · anim = agnes-video v2.0 · c = componente.
import { S, BI, CLP, LUCIA, JORGE, KIDS, DOG, HOUSE } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const H = "a 58-year-old man's weathered tanned hands, the cuff of a light khaki work shirt at the edge of the frame";
export const HG = "a 58-year-old man's weathered tanned hands in thin blue nitrile gloves, the cuff of a light khaki work shirt at the edge of the frame";
const KITCHEN = HOUSE;
const FLY = "a large blue-green blowfly"; const FLIES = "three large blue-green blowflies";
const LEMON = "a halved lemon studded with whole brown cloves"; const CLOVE = "whole brown cloves";
const WINDOW = "a white kitchen window with iron bars and daylight coming through"; const TAPE = "a yellow sticky fly ribbon";
const BASIL = "a small potted basil plant with green leaves"; const MINT = "a small potted mint plant with bright green leaves";
const MOUSE = "a small gray house mouse"; const DRAIN = "a small square patio drain with a metal grate";
const TRASH = "a small kitchen trash bin with a plastic bag";
const I = "img/fumoscas/";
export const SHOTS = [
  // ── capítulo 5 ──
  C(38, "", "ClChapter", { n: 5, title: "La albahaca en la ventana", sub: "la planta que la mosca no cruza" }),
  S(39, "", "bi", "c_basil1", { p: BI(`${BASIL} on the sill of ${WINDOW}, seen up close`) }),
  S(39, "Es la planta que la mosca no cruza", "bi", "c_basil_fly", { p: BI(`${FLY} approaching a ${BASIL} on a windowsill, then turning away`), anim: `${FLY} hovers near the basil then turns away` }),
  S(39, "La pones en maceta", "bi", "c_pot", { p: BI(`close view of ${H} planting a small basil plant into a terracotta pot on the counter`) }),
  S(39, "en el borde de la ventana", "bi", "c_basil_window", { p: BI(`${BASIL} sitting on the wide sill of ${WINDOW}`) }),
  S(40, "", "bi", "c_basil_smell", { p: BI(`${BASIL} on the windowsill, a faint green scent drifting toward the window`) }),
  S(40, "les tapa el olor de la comida", "bi", "c_food_steam", { p: BI(`${KITCHEN} with a pot steaming on the stove, the ${BASIL} in the window`) }),
  S(40, "la planta hace una barrera", "bi", "c_basil_barrier", { p: BI(`${FLIES} outside the window glass, stopped on the other side of the ${BASIL} on the sill`) }),
  S(40, "huele la albahaca, y se da la vuelta", "bi", "c_fly_turn", { p: BI(`${FLY} on the window glass near the ${BASIL}, turning and flying back out`), anim: `${FLY} turns away from the basil and flies back out` }),
  S(41, "", "bi", "c_water", { p: BI(`close view of ${H} watering a small basil plant with a small green watering can`), anim: `${H} waters the basil plant a little` }),
  S(41, "Y le das luz", "bi", "c_light", { p: BI(`${BASIL} on a sunny windowsill, bright daylight on the leaves`) }),
  S(41, "Si se te seca, la cambias", "bi", "c_dry_basil", { p: BI(`a dried-out basil plant with brown wilted leaves in a small pot`) }),
  S(41, "Una planta chica alcanza", "bi", "c_small_basil", { p: BI(`a small potted basil plant alone on a wide windowsill`) }),
  S(42, "", "bi", "c_mint", { p: BI(`${MINT} on the sill of ${WINDOW}, bright green leaves`) }),
  S(42, "la menta también sirve", "bi", "c_mint2", { p: BI(`a potted mint plant beside a potted basil plant on a windowsill`) }),
  S(42, "La menta aguanta mejor el sol fuerte", "bi", "c_mint_sun", { p: BI(`${MINT} in strong midday sunlight on a windowsill, leaves perky`) }),
  S(43, "", "bi", "c_pick_leaf", { p: BI(`close view of ${H} pinching off two basil leaves from a plant`) }),
  S(43, "frótalas entre los dedos", "bi", "c_rub", { p: BI(`close view of ${H} rubbing a basil leaf between thumb and fingers`), anim: `${H} rubs the basil leaves between his fingers` }),
  S(43, "la planta suelta más olor", "bi", "c_aroma", { p: BI(`a fresh basil leaf held near the nose, faint scent in the air`) }),
  // ── capítulo 6 ──
  C(44, "", "ClChapter", { n: 6, title: "La cinta pegajosa", sub: "para las que entran igual" }),
  S(45, "", "bi", "c_tape2", { p: BI(`${TAPE} hanging and slowly unwinding near a kitchen window`) }),
  S(45, "La amarilla", "bi", "c_tape_yellow", { p: BI(`close view of a yellow sticky fly ribbon, its glue glistening`) }),
  S(45, "Se cuelga", "bi", "c_tape_hang", { p: BI(`${H} hanging a yellow sticky fly ribbon from the ceiling near the window`), anim: `${H} hangs the fly ribbon` }),
  S(45, "la mosca que entra se pega sola", "bi", "c_tape_fly", { p: BI(`${FLY} stuck on a yellow sticky ribbon`), anim: `${FLY} lands on the ribbon and gets stuck` }),
  S(45, "Sin veneno, sin olor.", "bi", "c_tape_clean", { p: BI(`${TAPE} hanging still in a clean, quiet kitchen`) }),
  S(46, "", "bi", "c_tape_place", { p: BI(`${TAPE} hanging near the window, away from the counter with food`) }),
  S(46, "Lejos de la comida", "bi", "c_tape_far", { p: BI(`a yellow fly ribbon hanging in the corner of a kitchen, far from a plate of food on the table`) }),
  S(46, "cerca de la luz", "bi", "c_tape_light", { p: BI(`${TAPE} hanging beside a bright kitchen window, backlit`) }),
  S(46, "La mosca que entra busca la luz", "bi", "c_fly_light", { p: BI(`${FLY} flying toward the bright window light`) }),
  S(46, "de la ventana o del techo", "bi", "c_tape_ceiling", { p: BI(`${TAPE} hanging from a kitchen ceiling light fixture`) }),
  S(47, "", "bi", "c_tape_no_counter", { p: BI(`a red X drawn over a fly ribbon hanging above a kitchen counter`) }),
  S(47, "ni encima de la mesa", "bi", "c_tape_no_table", { p: BI(`a red X drawn over a fly ribbon hanging above a set kitchen table`) }),
  S(47, "si se despega, cae sobre la comida", "bi", "c_tape_fall", { p: BI(`a yellow sticky ribbon lying on a plate of food on a table`) }),
  S(47, "Lejos de la comida, siempre.", "cl", "c_tape_rule", { p: CLP(`he points a finger up with a serious face, giving the rule`) }),
  S(48, "", "bi", "c_baby", { p: BI(`a baby in a high chair in a kitchen, looking up`) }),
  S(48, "la cinta va colgada bien alta", "bi", "c_tape_high", { p: BI(`${TAPE} hanging very high near the kitchen ceiling, out of reach`) }),
  S(48, "donde la mano del niño no llega", "bi", "c_kid_reach", { p: BI(`a small child reaching up toward the ceiling, unable to touch a hanging ribbon`) }),
  S(48, "el gato no la roza", "bi", "c_cat", { p: BI(`a cat looking up at a high hanging fly ribbon, unable to reach it`) }),
  S(49, "", "bi", "c_tape_thread", { p: BI(`close view of ${H} tying a thread to a yellow fly ribbon`) }),
  S(49, "del techo o del marco de la puerta", "bi", "c_tape_door", { p: BI(`${TAPE} hanging from the top frame of a kitchen door`) }),
  S(49, "No en la pared, porque deja la mancha", "bi", "c_wall_stain", { p: BI(`a yellowish sticky stain on a wall where a fly ribbon used to hang`) }),
  S(49, "se desenrolla con cuidado", "bi", "c_tape_unroll", { p: BI(`${H} slowly unrolling a yellow fly ribbon, holding it with two fingers`), anim: `${H} unrolls the ribbon slowly` }),
  S(50, "", "bi", "c_tape_full", { p: BI(`a yellow fly ribbon full of small black flies, hanging in a kitchen`) }),
  S(50, "se cambia cuando está llena", "bi", "c_tape_change", { p: BI(`${H} taking down a full fly ribbon and holding a fresh one`), anim: `${H} swaps the full ribbon for a fresh one` }),
  S(50, "hay que mirar la basura y la ventana otra vez", "bi", "c_back", { p: BI(`a glance between an open trash bin and a window with a lemon and basil`) }),
  // ── capítulo 7 ──
  C(51, "", "ClChapter", { n: 7, title: "Moscas grandes: algo muerto", sub: "esto es lo que nadie te dice" }),
  S(52, "", "bi", "c_big_flies", { p: BI(`${FLIES} on a windowsill, large and slow-moving`) }),
  S(52, "de las verdes y azules", "bi", "c_big_close", { p: BI(`extreme close view of a big blue-green fly, its body shining`) }),
  S(52, "no es por la fruta", "bi", "c_not_fruit", { p: BI(`a bowl of fruit with no flies on it, clean`) }),
  S(52, "hay algo muerto o podrido cerca", "bi", "c_dead", { p: BI(`a dark corner behind a kitchen appliance, a shadow of something dead`) }),
  S(53, "", "bi", "c_mouse", { p: BI(`${MOUSE} lying dead against the base of a wall, in shadow`) }),
  S(53, "una bolsa olvidada detrás del refrigerador", "bi", "c_bag_back", { p: BI(`a forgotten plastic bag of garbage behind a refrigerator, dust on it`) }),
  S(53, "el desagüe del patio con agua estancada", "bi", "c_drain", { p: BI(`${DRAIN} in a concrete patio, murky standing water in the grate`) }),
  S(53, "pone los huevos ahí", "bi", "c_eggs2", { p: BI(`close view of tiny white fly eggs on a rotting scrap near a drain`) }),
  S(54, "", "bi", "c_greenfly", { p: BI(`a single large green bottle fly on a white tile, seen in detail`) }),
  S(54, "Huele la carne muerta a metros", "bi", "c_greenfly_smell", { p: BI(`the green bottle fly on a wall, its antennae twitching`) }),
  S(54, "algo se murió adentro de tu casa", "cl", "c_serious", { p: CLP(`he looks at the camera with a serious face, lowering his voice`) }),
  S(55, "", "bi", "c_sniff", { p: BI(`a man sniffing the air in a kitchen, walking slowly past the counter`) }),
  S(55, "por la cocina, por el patio", "bi", "c_patio", { p: BI(`a small concrete patio with a drain, seen from the kitchen door`) }),
  S(55, "Donde más fuerte huele, ahí está", "bi", "c_strong_smell", { p: BI(`a hand lifting a loose floorboard, revealing a dark opening`) }),
  S(56, "", "bi", "c_drain_clean", { p: BI(`${HG} pouring hot water and peroxide into a patio drain`), anim: `${HG} cleans the patio drain` }),
  S(56, "guantes, una bolsa cerrada, y afuera", "bi", "c_gloves", { p: BI(`${HG} placing a small dead mouse into a sealed plastic bag with gloved hands`) }),
];
