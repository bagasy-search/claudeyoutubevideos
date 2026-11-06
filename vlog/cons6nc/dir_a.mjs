// DIRECTOR A — cons6nc (las piedritas blancas del hervidor): MINUTO 1 (7 de la mañana, la taza con escamas, el fondo con piedritas →
// lo enjuagó → promesa: un ingrediente, sin frotar) + 300 hervidores + los 3 anzuelos + CTA 1 (pág. 31) + qué es la piedra + aislante +
// el té raro + el huésped de la 207 + la prueba del vaso + las pistas + el ingrediente + la regla + la medida + la espuma + hervor y reposo
// (párr. 0-25). Avatar = ventanas PAGADAS (_v3/cons6nc_avlock.json, AV_LOCK): acá no van AV(). Veo c01-c10 = Claudio (broll/cons6nc/cNN.mp4).
import { S, BI } from "../claudio/lib.mjs";
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: BI(scene), ...o });
export const V = (p, at, name) => S(p, at, "cl", name, { p: "veo", veo: 1 });
export const G = "a hand in a blue nitrile glove";
export const KET = "a brushed stainless steel electric kettle with a black lid and black handle on its round black power base";
export const SCALEK = "the inside bottom of a stainless steel electric kettle seen from above through the open lid, covered in white chalky limescale crust and loose white pebbles";
export const CLEANK = "the inside bottom of a stainless steel electric kettle seen from above through the open lid, bright shiny steel with no limescale at all";
export const HOME = "a modest home kitchen with a tiled backsplash and a window";
export const SERV = "a hotel service kitchen with long stainless steel counters and deep steel sinks";
export const CUP = "a white ceramic mug of tea";
export const ACID = "a small white paper sachet of citric acid powder with a plain blank label";
export const RAMIRO = "Don Ramiro, a hotel maintenance chief in his sixties with a gray mustache, a gray work coat and reading glasses in the pocket";
export const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie, holding a small black notebook";
export const I = "img/cons6nc/";
export const SHOTS = [
  // ── 0:00 · las siete de la mañana (avatar 0-3,4)
  B(0, "Usted se sirve el primer té del día", "b_pour", `Hot water poured from ${KET} into ${CUP} with a tea bag, steam rising, on ${HOME}, morning light.`, { anim: "hot water pours into the mug, steam rises" }),
  B(0, "o el primer café", "b_coffee", `A spoon of instant coffee being stirred into a white mug of hot water on a kitchen counter, morning window light.`, { anim: "the spoon stirs the coffee" }),
  B(0, "se sienta, mira la taza", "b_table", `${CUP} on a small kitchen table next to a folded newspaper and reading glasses, morning light from a window.`),
  V(0, "y ahí están", "c01"),
  C(0, "Unas escamitas blancas, girando en el agua", "HvSwirlCup"),
  V(0, "Mira adentro del hervidor", "c02"),
  B(0, "el fondo está lleno de piedritas", "b_scalebottom", `${SCALEK}, close view.`),
  // 15,3 · lo enjuagó
  B(1, "Lo enjuagó", "b_rinse", `${KET} lid open, its body tilted under a running kitchen tap, the power base left dry on the counter.`, { anim: "water runs into the kettle and swirls" }),
  B(1, "Le pasó una esponja", "b_spongein", `A yellow kitchen sponge pushed inside the open top of a stainless steel kettle by a hand, the kettle off its base.`),
  B(1, "pegadas al fondo, cada semana más", "b_stuck", `Extreme close view of hard white limescale crust stuck to the inside steel floor of a kettle, water droplets on it.`),
  // 25 · promesa
  B(2, "Hoy se las saco", "b_kettlewin", `${KET} on ${HOME}, morning light, a white mug beside it.`),
  B(2, "Con un solo ingrediente", "b_onesachet", `${ACID} alone on a wooden kitchen counter next to a tablespoon.`),
  B(2, "que cuesta menos que un café", "b_coins", `A few coins and ${ACID} next to a paper coffee cup on a kitchen counter.`),
  B(2, "y sin frotar", "b_nobrush", `A bottle brush and a steel wool pad left unused in a small basket beside a kitchen sink.`),
  C(2, "Mire. Así estaba este fondo", "HvBeforeAfter"),
  // 34,6 · treinta años
  ST(3, "Treinta años fui conserje", "s_hotel", "hotel exterior", `The front of an old city hotel with a canopy over the entrance.`),
  B(3, "habitaciones", "b_corridor", `A long carpeted hotel corridor with numbered room doors and a housekeeping cart, warm light.`),
  B(3, "y en cada una, un hervidor eléctrico para el té", "b_roomtray", `A hotel room tea tray on a dresser: a small stainless steel electric kettle, two white cups, tea bags in a little box.`),
  C(3, "Trescientos hervidores", "HvKettleWall"),
  B(3, "son la razón número uno", "b_trash", `An old stainless steel electric kettle with white crust around its spout dropped in a kitchen trash bin, close view.`),
  // 51,4 · los tres anzuelos
  B(4, "Qué son de verdad esas piedritas", "b_pebbles", `A small pile of white limescale pebbles and flakes in the palm of a blue nitrile glove, close view.`),
  B(4, "por qué le hacen gastar más luz", "b_meter", `An old electricity meter with a spinning disc on a wall next to a kitchen door.`, { anim: "the meter disc spins" }),
  B(4, "La prueba del vaso", "b_glasswin", `A clear drinking glass with a little water in it on a sunny windowsill.`),
  B(4, "Y el paso número tres", "b_step3tease", `${ACID} and a tablespoon on a steel counter next to an open stainless steel kettle, close view.`),
  B(4, "el único ingrediente", "b_crystals", `Extreme close view of white citric acid crystals in a tablespoon, sparkling in window light.`),
  B(4, "dejaba los trescientos hervidores del hotel", "b_rows", `Rows of identical small stainless steel electric kettles lined up on a long steel counter in ${SERV}, all shining.`),
  // 70,3 · CTA 1 — página 31 (Cocina)
  C(5, "Este arreglo, y todos los de la cocina", "TbBookTub", { page: I + "book_p31.png", cover: I + "book_cover.png", qr: I + "qr.png", pageNo: 31 }),
  C(5, "El link está en la primera línea", "TbBookTub", { page: I + "book_p31.png", cover: I + "book_cover.png", qr: I + "qr.png", pageNo: 31, skip: 96 }),
  // 83,9 · qué son
  B(6, "No son óxido", "b_notrust", `A white limescale flake next to a small orange rust flake on a white saucer, close view, for comparison.`),
  B(6, "Son piedra", "b_stone", `A single hard white piece of limescale held between gloved fingertips against the light, close view.`),
  B(7, "El agua de la llave trae piedra disuelta", "b_tapglass", `Tap water running into a clear glass in a kitchen sink, sunlight through the water.`, { anim: "water fills the glass" }),
  B(7, "Calcio y magnesio", "b_minerals", `Two small heaps of white mineral powder on a dark slate board in a kitchen, one fine and one coarse.`),
  B(7, "Se pega al fondo, a la resistencia", "b_element", `Inside an open stainless steel kettle: the flat heating plate on its floor covered in a white mineral crust, close view.`),
  C(8, "Como los anillos de un árbol", "HvTreeRings"),
  B(8, "se hacen gruesas", "b_crack", `Extreme close view of cracked white limescale crust peeling off a steel kettle floor in thin flakes.`),
  // 122,3 · aislante
  B(9, "Y acá viene lo que nadie le dice", "b_kettleside", `${KET} on a steel counter in ${SERV}, side view, a little steam from the spout.`),
  C(9, "Esa piedra es un aislante", "HvBlanket"),
  B(9, "los hervidores con sarro se queman antes", "b_burnt", `An old electric kettle base with a slightly scorched black mark on the inside floor of the kettle, close view.`),
  B(10, "Y por eso también el té le sabe raro", "b_sip", `An older man's weathered hand lifting a white mug of tea at a kitchen table, the face not visible.`, { anim: "the hand lifts the mug slowly" }),
  B(10, "Medio a tierra, medio a tiza", "b_chalk", `A stick of white chalk and a little garden soil next to a cup of tea on a wooden table, close view.`),
  // 150,6 · el huésped de la 207
  B(11, "Fue en dos mil tres", "b_door207", `A hotel room door with a brass number plaque reading 207 in a carpeted corridor, warm light.`),
  B(11, "Un huésped bajó a la recepción furioso", "b_lobby", `A man in a bathrobe holding a white teacup at an old hotel reception desk, seen from behind, a clerk across the desk.`),
  B(11, "diciendo que el agua del hotel tenía vidrio", "b_glassbits", `Sharp-looking white flakes in the bottom of an empty white teacup, close view under a lamp.`),
  C(12, "El gerente, el de la libreta", "ClNotebook", { title: "Hab. 207 · 2003", rows: [{ k: "Queja", v: "«vidrio»" }, { k: "Causa", v: "piedra" }, { k: "Orden", v: "cambiar 300" }] }),
  B(12, "miré la taza, miré el hervidor", "b_inspect", `A gloved hand holding a small hotel room kettle with its lid open toward the light, white crust inside, in a hotel room.`),
  B(13, "Don Ramiro, el jefe de mantenimiento", "b_ramiro", `${RAMIRO} standing in ${SERV} with his arms crossed, calm.`),
  B(13, "bajamos todos los hervidores a la cocina de servicio", "b_cart", `A service trolley loaded with about thirty small hotel electric kettles being pushed into ${SERV}.`, { anim: "the trolley rolls forward" }),
  B(13, "No se cambió ni uno", "b_rowclean", `About thirty small stainless steel electric kettles drying upside down in a row on a towel on a steel counter in ${SERV}.`),
  B(13, "una caja de bombones", "b_bonbons", `A shiny small electric kettle and a box of chocolates on a hotel room service tray outside a door.`),
  // 198,1 · el vaso
  B(14, "conviene saber qué tan dura es su agua", "b_tapcheck", `A kitchen tap with a thick white crust around its base and aerator, close view.`),
  C(15, "La prueba del vaso", "HvGlassTest"),
  B(15, "déjelo al sol o al lado de la ventana", "b_sill", `A clear drinking glass with one finger of water on a sunny kitchen windowsill next to a small plant.`),
  B(16, "Si queda un aro blanco grueso", "b_ringthick", `Close view of the inside bottom of a dry clear drinking glass with a thick white chalky ring left by evaporated water.`),
  B(16, "que se siente con la uña", "b_nail", `A fingernail scratching a white chalky ring inside the bottom of a dry drinking glass, extreme close view.`),
  B(16, "Si queda una marquita finita", "b_ringthin", `Close view of the bottom of a dry clear drinking glass with only a faint thin white line.`),
  // 229,6 · las pistas
  B(17, "si los vasos salen opacos del lavaplatos", "b_cloudy", `Cloudy, milky drinking glasses on the open rack of a dishwasher.`),
  B(17, "No es que usted no lo cuide", "b_careful", `A tidy home kitchen counter with ${KET} wiped clean on the outside, a folded dish towel beside it.`),
  // 245,3 · el ingrediente
  B(18, "El paso número tres", "b_step3", `${ACID} placed in the center of a steel counter in ${SERV}, overhead light.`),
  C(22, "por cada medio litro de agua", "HvSachet"),
  ST(19, "en la parte de repostería", "s_baking", "baking supplies aisle", `A supermarket shelf of baking supplies.`),
  B(19, "Es lo mismo que tiene el limón", "b_lemon", `A lemon cut in half next to a small heap of white citric acid crystals on a wooden board, close view.`),
  B(20, "disuelve la piedra igual que el vinagre", "b_vinegar", `A clear jug of white vinegar with a plain blank label beside ${ACID} on a kitchen counter.`),
  B(20, "es suave con el metal y con el plástico", "b_plastic", `A white plastic electric kettle and a stainless steel electric kettle side by side on a kitchen counter.`),
  B(20, "En la cocina del hotel no se usaba otra cosa", "b_shelf", `A steel shelf in ${SERV} with several paper sachets of citric acid stacked in a plastic tub with a plain blank label.`),
  // 281 · la regla
  C(21, "lo hace desenchufado y frío", "HvUnplug"),
  V(21, "Desenchufado de la pared", "c05"),
  B(21, "nunca se moja", "b_basedry", `The round black power base of an electric kettle sitting dry on a kitchen counter, a dish towel beside it, close view of its metal contacts.`),
  // 297,6 · la medida
  V(19, "que viene en sobrecitos", "c03"),
  C(23, "Porque cuando hierve con el ácido, hace espuma", "HvFillGauge"),
  B(23, "la espuma sale por la boquita", "b_foamspout", `White foam bubbling out of the spout of a stainless steel electric kettle onto a kitchen counter, close view.`, { anim: "foam bubbles out of the spout" }),
  B(23, "Nunca pase la línea de máximo", "b_maxline", `Extreme close view of the MAX line on the water window of a stainless steel kettle.`),
  // 332,5 · hervir
  B(24, "tape, enchufe, y hágalo hervir", "b_plugin", `A hand closing the black lid of ${KET} and pressing its switch, the small light on the base turning on, kitchen counter.`),
  B(24, "Cuando se apaga solo", "b_switch", `Close view of the on-off switch of an electric kettle clicking off, a little steam above.`),
  B(24, "veinte minutos", "b_timer", `A white kitchen timer set to twenty minutes next to ${KET} on a counter.`),
  B(25, "Me preguntan mucho cuánto tiempo hay que hervirlo", "b_comments", `Weathered hands holding a phone over a kitchen table, the screen glowing, the screen content blurred.`),
  B(25, "Un hervor, y que repose", "b_rest", `${KET} sitting quietly on its base after boiling, a last wisp of steam from the spout, kitchen window light.`, { anim: "a last wisp of steam rises" }),
  B(25, "sólo gasta luz", "b_bill", `An electricity bill envelope and a pair of reading glasses on a kitchen table next to a kettle.`),
];
