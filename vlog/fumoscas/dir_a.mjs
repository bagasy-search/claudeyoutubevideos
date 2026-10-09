// DIRECTOR A — fumoscas (Claudio el Fumigador #8, "La casa de los Ramírez" ep. 8): MINUTO 1 (aerosol NUNCA + las 3 moscas
// de la espuma → el error de Jorge → promesa limón/clavos/albahaca/cinta → cred + revisión) + la casa + las 3 cosas en orden
// (párrafos 0-18). Sólo agnes: bi = agnes-image (anim = agnes-video v2.0) · cl = agnes-image 2.5-flash con cara de Claudio · c = componente.
import { S, BI, CLP, BATH, LUCIA, JORGE, KIDS, DOG, HOUSE } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const H = "a 58-year-old man's weathered tanned hands, the cuff of a light khaki work shirt at the edge of the frame";
export const HG = "a 58-year-old man's weathered tanned hands in thin blue nitrile gloves, the cuff of a light khaki work shirt at the edge of the frame";
const KITCHEN = HOUSE;
const FLY = "a large blue-green blowfly"; const FLIES = "three large blue-green blowflies";
const LEMON = "a halved lemon studded with whole brown cloves"; const CLOVE = "whole brown cloves";
const WINDOW = "a white kitchen window with iron bars and daylight coming through"; const TAPE = "a yellow sticky fly ribbon";
const BASIL = "a small potted basil plant with green leaves"; const TRASH = "a small kitchen trash bin with a plastic bag";
const I = "img/fumoscas/";
export const SHOTS = [
  // ── 0:00 · aerosol nunca (el error) ──
  S(0, "", "bi", "b_spray0", { p: BI(`a red aerosol fly-killer can standing on a speckled gray granite kitchen counter beside a bowl of ripe bananas`), anim: `${FLY} lands on the can, walks over the nozzle and flies away`, ov: { c: "ClChip", props: { text: "NUNCA", alert: true } } }),
  S(0, "no se rocía aerosol", "cl", "c_no0", { p: CLP(`he holds a red aerosol fly-killer can away from his body with one hand and shakes his head no, standing beside the kitchen counter`) }),
  S(0, "Nunca.", "bi", "b_can_tap", { p: BI(`close view of ${H} tapping the cap of a red aerosol can against the palm of the other hand, over a kitchen counter`) }),
  S(0, "que lleva treinta años", "bi", "b_kitchen0", { p: BI(`${KITCHEN}: the whole counter and stove with the window in the background`) }),
  S(0, "entrando a cocinas de casas y de restaurantes", "bi", "b_restaurants", { p: BI(`a line of restaurant kitchen counters receding, stainless steel and tile, empty and clean`) }),
  // ── los Ramírez ──
  S(1, "", "bi", "b_family0", { p: BI(`${LUCIA} and ${JORGE} in their kitchen with ${KIDS} sitting at the table and ${DOG} lying on the floor, an ordinary afternoon`) }),
  S(1, "Lucía", "cl", "c_lucia0", { p: CLP(`he stands in the kitchen talking with ${LUCIA} beside the counter, both looking toward the window`) }),
  S(1, "Sofía, Mateo", "bi", "b_kids0", { p: BI(`${KIDS} at the kitchen table, a plate with bread in front of them, ${DOG} beside the chair`) }),
  S(1, "y Bruno", "bi", "b_bruno0", { p: BI(`${DOG} lying on the tiled kitchen floor near the table, lifting his head`) }),
  S(1, "que duerme en la cocina", "bi", "b_bruno1", { p: BI(`${DOG} curled on a folded blanket in a corner of the kitchen floor at night`) }),
  // ── la ventana y las 3 moscas ──
  S(2, "", "bi", "b_window0", { p: BI(`${WINDOW} seen from inside, a foam-sealed gap in the wall beside it`, ), anim: `${FLIES} buzz against the inside of the window glass` }),
  S(2, "terminamos de tapar los huecos", "bi", "b_foam", { p: BI(`close view of ${HG} pressing a line of white expanding foam into a gap in a wall with a caulking gun`) }),
  S(2, "abrió la ventana", "bi", "b_open", { p: BI(`a woman's hand opening ${WINDOW} outward, daylight streaming in`) }),
  S(2, "olor de la espuma", "bi", "b_smell", { p: BI(`a faint wisp of air moving through an open white kitchen window over the sink`) }),
  S(2, "tres moscas grandes", "bi", "b_flies0", { p: BI(`${FLIES} on the edge of a speckled gray granite kitchen counter near the window`) }),
  S(2, "zumban contra el vidrio", "bi", "b_flies1", { p: BI(`${FLIES} crawling on the inside of the window glass, backlit by daylight`), anim: `${FLIES} walk and buzz against the window glass` }),
  // ── el aerosol de Jorge ──
  S(3, "", "bi", "b_jorge0", { p: BI(`${JORGE} opening a kitchen cabinet and reaching for a red aerosol can on the shelf`) }),
  S(3, "Jorge ya buscaba el aerosol", "bi", "b_jorge1", { p: BI(`close view of ${JORGE}'s hand pulling a red aerosol can from a kitchen cabinet shelf`) }),
  S(3, "el error que comete casi todo el mundo", "cl", "c_error", { p: CLP(`he points at a red aerosol can on the counter with a serious face, one eyebrow raised`) }),
  S(3, "te lo muestro en un rato", "bi", "b_flies_wait", { p: BI(`${FLY} standing on a kitchen window ledge`) }),
  // ── la promesa ──
  S(4, "", "bi", "b_limon0", { p: BI(`${LEMON} on a small white plate on a speckled gray granite kitchen counter`) }),
  S(4, "Con un limón", "bi", "b_limon1", { p: BI(`close view of ${H} holding ${LEMON} up toward the camera, the cloves standing out`) }),
  C(4, "unos clavos de olor", "ClCheck", { title: "Lo que necesitas", items: ["Un limón", "Clavos de olor enteros", "Planta de albahaca", "Cinta pegajosa amarilla"], fast: true }),
  S(4, "una planta de albahaca", "bi", "b_basil0", { p: BI(`${BASIL} on the sill of ${WINDOW}`) }),
  S(4, "una cinta pegajosa", "bi", "b_tape0", { p: BI(`${TAPE} hanging from the kitchen ceiling near the window, unwound`) }),
  S(4, "Así estaba esa cocina", "bi", "b_before", { p: BI(`${KITCHEN} with ${FLIES} on the counter and on a bowl of fruit`, ), ov: { c: "ClChip", props: { text: "Antes", alert: true } } }),
  S(4, "Y así quedó a los tres días", "bi", "b_after", { p: BI(`${KITCHEN} clean and still, a ${LEMON} in the window and a ${BASIL} on the sill, no flies`), ov: { c: "ClChip", props: { text: "3 días después" } } }),
  // ── cred + revisión ──
  S(5, "", "bi", "b_truck0", { p: BI(`an old white pickup truck with a pest-control sprayer tank and hoses in its bed, parked on a quiet residential street`) }),
  S(5, "Treinta años de fumigador", "cl", "c_cred", { p: CLP(`he stands in the kitchen with his arms crossed, looking at the camera with a calm confident face`), ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de fumigador" } } }),
  S(5, "en casas, hoteles y restaurantes", "bi", "b_restkitchen", { p: BI(`an empty stainless restaurant kitchen at night with the lights half on, a mop bucket in a corner`) }),
  S(5, "te doy la revisión de diez minutos", "bi", "b_flashlight0", { p: BI(`close view of ${H} holding a yellow flashlight, switching it on in a dark kitchen doorway`) }),
  S(5, "que hago con una linterna", "bi", "b_beam0", { p: BI(`night, a yellow flashlight beam crossing a dark kitchen floor toward the bottom of the cabinets`) }),
  S(5, "gratis", "cl", "c_door", { p: CLP(`he stands at the front door of a modest family house at dusk holding a flashlight, a work bag on his shoulder`) }),
  // ── capítulo 1 ──
  C(6, "", "ClChapter", { n: 1, title: "La casa de los Ramírez", sub: "la ventana y las tres moscas" }),
  // ── la casa ──
  S(7, "", "c", "ClVideoRef", { props: { thumb: I + "th_furatones5.jpg", title: "Los 5 lugares por donde entra el ratón" } }),
  S(7, "tapamos los cinco huecos", "bi", "b_holes", { p: BI(`close view of ${HG} pushing steel wool into a small hole at the base of a kitchen wall`) }),
  S(7, "por donde entraba el ratón", "bi", "b_hole_mouse", { p: BI(`a small gray house mouse sniffing at a hole at the base of a kitchen wall`) }),
  S(7, "abrió la ventana", "bi", "b_open2", { p: BI(`a woman's hand opening ${WINDOW} wide, daylight flooding the kitchen`) }),
  S(8, "", "bi", "b_flies2", { p: BI(`${FLIES} flying near the open window of a kitchen, over the sink`) }),
  S(8, "verdes y azules", "bi", "b_flies3", { p: BI(`extreme close view of ${FLY} on a white tile, its green and blue body glinting`) }),
  S(8, "Se posaron en la encimera", "bi", "b_flies_counter", { p: BI(`${FLIES} on a speckled gray granite kitchen counter near a cutting board`) }),
  S(8, "en el borde del plato de Bruno", "bi", "b_flies_dog", { p: BI(`${FLY} on the rim of ${DOG}'s steel food bowl on the tiled kitchen floor`) }),
  S(8, "y en la fruta", "bi", "b_flies_fruit", { p: BI(`${FLIES} on a bunch of ripe bananas in a fruit bowl on the counter`) }),
  S(9, "", "bi", "b_flies4", { p: BI(`${FLIES} flying from a bowl of fruit toward a dog bowl on the kitchen floor`), anim: `${FLIES} fly between the fruit bowl and the dog bowl` }),
  S(9, "cada vez que se posaban", "bi", "b_flies_land", { p: BI(`extreme close view of ${FLY} landing on the rim of a drinking glass on the counter`) }),
  S(9, "dejaban algo que no se ve", "cl", "c_warns", { p: CLP(`he points at the counter with a serious face, explaining, one hand raised`) }),
  S(10, "", "bi", "b_jorge2", { p: BI(`${JORGE} walking toward a kitchen cabinet holding up a red aerosol can, looking determined`) }),
  S(10, "le puse la mano en el brazo", "bi", "b_arm", { p: BI(`close view of ${H} gently pressing a hand on ${JORGE}'s forearm, stopping him`) }),
  S(10, "Jorge, eso no. En la cocina, no.", "cl", "c_no1", { p: CLP(`he looks straight at the camera with a serious face, one hand up in a stop gesture`) }),
  S(11, "", "bi", "b_spray_mist", { p: BI(`a red aerosol can spraying a fine mist of insecticide toward a kitchen window, droplets drifting`) }),
  S(11, "Donde cae la gotita, cae el veneno", "bi", "b_drop_food", { p: BI(`close view of fine aerosol droplets settling on a plate of food and on a kitchen counter`) }),
  S(11, "sobre la encimera donde amasan", "bi", "b_counter_dough", { p: BI(`${H} kneading bread dough on a floured speckled gray granite kitchen counter`) }),
  S(11, "sobre el plato de los niños", "bi", "b_plate_kid", { p: BI(`a child's plate with food on a kitchen table, a glass of milk beside it`) }),
  S(12, "", "bi", "b_kids1", { p: BI(`${KIDS} eating at the kitchen table, ${DOG} lying under the table`) }),
  S(12, "Los niños, el perro, y Lucía", "bi", "b_lucia_cook", { p: BI(`${LUCIA} cooking at the stove with her back to the camera, steam rising`) }),
  S(12, "El veneno no distingue", "cl", "c_dist", { p: CLP(`he holds up a red aerosol can with two fingers, looking at it with distaste, then sets it down`) }),
  S(13, "", "bi", "b_rest0", { p: BI(`a professional restaurant kitchen, a chef at the pass, no aerosol cans in sight`) }),
  S(13, "En los restaurantes no se usa aerosol", "bi", "b_rest1", { p: BI(`a stainless restaurant kitchen counter with a fresh basil plant and a bowl of lemons`) }),
  S(13, "las moscas se manejan con tres cosas", "bi", "b_three", { p: BI(`${LEMON}, ${BASIL} and ${TAPE} laid out side by side on a kitchen counter`) }),
  S(13, "Sin veneno.", "cl", "c_sinveneno", { p: CLP(`he spreads his hands open over the counter, smiling, as if showing there is nothing else needed`) }),
  // ── capítulo 2 ──
  C(14, "", "ClChapter", { n: 2, title: "Las tres cosas, en orden", sub: "cortar el motivo, ahuyentar, atrapar" }),
  S(15, "", "bi", "b_order0", { p: BI(`three items lined up on a kitchen counter: ${TRASH}, ${LEMON}, and ${TAPE}`, ), ov: { c: "ClChip", props: { text: "1 · 2 · 3" } } }),
  S(15, "que no tengan nada que les guste", "bi", "b_trash0", { p: BI(`${TRASH} with its plastic bag tied shut, on the tiled kitchen floor`) }),
  S(15, "olores que no soportan", "bi", "b_limon2", { p: BI(`${LEMON} on the sill of ${WINDOW}`) }),
  S(15, "puestos en la ventana", "bi", "b_window_lemon", { p: BI(`close view of ${LEMON} sitting on the sill of ${WINDOW}, daylight behind`) }),
  S(15, "una trampa para las que entran igual", "bi", "b_tape1", { p: BI(`${TAPE} hanging near the window, a couple of small flies stuck on it`) }),
  S(15, "En ese orden.", "bi", "b_order1", { p: BI(`three paper arrows drawn on a kitchen counter pointing from a trash bin to a lemon to a fly ribbon`) }),
  S(16, "", "bi", "b_order2", { p: BI(`${FLIES} flying around an open trash bin near a kitchen counter`), anim: `${FLIES} buzz around the open trash bin` }),
  S(16, "Si pones la trampa pero dejas la basura abierta", "bi", "b_trap_trash", { p: BI(`${TAPE} hanging above an open overflowing trash bin, flies everywhere`) }),
  S(16, "entran veinte y pegas dos", "bi", "b_twenty", { p: BI(`a yellow sticky ribbon with only two flies stuck, while a swarm circles an open trash bin below`) }),
  S(16, "Primero se corta el motivo", "bi", "b_tie_trash", { p: BI(`${H} tying shut the plastic bag of a kitchen trash bin`) }),
  S(16, "y lo que quede, se atrapa", "bi", "b_trap2", { p: BI(`${TAPE} hanging near a window with a few flies stuck on it`) }),
  S(17, "", "bi", "b_spray_dead", { p: BI(`a dead fly on a kitchen counter beside a red aerosol can`) }),
  S(17, "mata la que ves", "bi", "b_spray_hit", { p: BI(`a red aerosol can spraying at ${FLY} on a kitchen window`) }),
  S(17, "deja el motivo por el que entraron", "bi", "b_flies5", { p: BI(`${FLIES} on a pile of kitchen scraps in an open trash bin`) }),
  S(17, "mañana entran otras tres", "bi", "b_flies_next", { p: BI(`${FLIES} flying in through an open kitchen window toward a fruit bowl`) }),
  S(18, "", "bi", "b_buy0", { p: BI(`${CLOVE} in a small clear jar, ${BASIL} and a rolled ${TAPE} on a wooden shop counter`) }),
  S(18, "un frasco de clavo de olor entero", "bi", "b_clove_jar", { p: BI(`close view of a small clear glass jar filled with ${CLOVE}, on a kitchen counter`) }),
  S(18, "una planta chica de albahaca", "bi", "b_basil_buy", { p: BI(`${BASIL} in a market stall among other small potted herbs`) }),
  S(18, "una trampa de cinta pegajosa para moscas", "bi", "b_tape_buy", { p: BI(`a rolled ${TAPE} with its packaging, on a hardware store shelf`) }),
  S(18, "la frase exacta para pedirlo", "cl", "c_frase", { p: CLP(`he shows a small handwritten shopping list to the camera, pointing at it`) }),
];
