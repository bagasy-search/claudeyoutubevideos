// DIRECTOR A — clc28c (SARRO DE LA DUCHA): gancho · CTA 1 (arreglo 10, pág. 18) · punto 1 (qué es) · punto 2 (la receta) · punto 3 (cuánto) — párrafos 0-16.
import { S, BI } from "../claudio/lib.mjs";
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: BI(scene), ...o });
export const V = (p, at, name) => S(p, at, "cl", name, { p: "veo", veo: 1 });
export const G = "a hand in a long yellow rubber glove";
export const TILES = "white square ceramic wall tiles of a hotel shower";
export const LIME = "dried chalky white limescale drops and spots";
export const SPRAY = "a clear plastic spray bottle with a plain blank label, filled with pale liquid";
export const VINEGAR = "a clear plastic bottle of white vinegar with a plain blank label";
export const BLEACH = "a white plastic bleach jug with a plain blank label";
export const TAP = "a chrome shower tap";
export const I = "img/clc28c/";
export const CTA = { page: I + "book_p18.png", cover: I + "book_cover.png", qr: I + "qr.png", pageNo: 18 };
const CH = (p, at, n, title, o = {}) => C(p, at, "ClChapter", { n, title, label: "PUNTO", ...o });
export { CH };
export const SHOTS = [
  B(0, "Esas gotitas blancas", "b_drops", `Very close view of ${LIME} on ${TILES}, seen at an angle, the shine of the glaze around them.`),
  B(0, "esas manchas como de tiza", "b_chalk", `Chalky white smears drying on ${TILES}, a corner of a chrome shower rail at the edge.`),
  B(0, "Usted las limpia el sábado", "b_sponge", `${G} wiping ${TILES} with a yellow sponge, soapy water running down.`),
  C(0, "Y el lunes están otra vez", "SaDropsReturn"),
  V(1, "Treinta años fui conserje", "v01"),
  B(1, "Trescientas habitaciones", "b_corridor", `A long old hotel corridor with numbered room doors and a grey housekeeping cart parked by one open door.`),
  C(1, "teníamos quince minutos por baño", "SaHotel300"),
  B(1, "el huésped que entra", "b_guest", `A hotel bathroom door half open, a guest's suitcase on the floor outside, a bright clean bathroom inside, a housekeeper's gloved hand still on the door handle.`),
  B(1, "esas manchas blancas", "b_glass", `A glass shower screen clouded with white limescale, light from a small window passing through it.`),
  B(2, "Hoy le paso la receta", "b_recipe", `${SPRAY}, a measuring cup and a small dish soap bottle with a plain blank label on a white bathroom counter.`),
  B(2, "dónde se usa y dónde no", "b_marbleseat", `A small grey veined marble seat in the corner of a tiled shower.`),
  B(2, "hace daño", "b_dullspot", `A dull matte spot on a polished marble ledge in a shower, close view, the rest of the stone shiny.`),
  C(2, "Ese es el punto diez", "SaTenPromise"),
  C(3, "Esta receta con las cantidades", "SaBook", CTA),
  CH(4, "Qué son esas manchas blancas", 1, "Qué son esas manchas"),
  B(5, "Eso blanco es sarro", "b_macro", `Extreme close view of a hard white crust of limescale on a shiny tile edge.`),
  B(5, "El agua de muchas ciudades", "b_cityroofs", `Rooftops of an old city neighbourhood with water tanks on the flat roofs, morning.`),
  B(5, "trae minerales disueltos", "b_glasswater", `A clear glass of tap water on a windowsill, sunlight through it.`),
  C(5, "cuando la gotita de agua se seca", "SaDropEvap"),
  B(6, "Y encima de la cal", "b_soapdish", `A wet bar of soap in a tile soap dish with greasy grey film around it.`),
  B(6, "un gris opaco", "b_grey", `A dull grey greasy film over white shower tiles, close view, a finger-wide clean line through it.`),
  C(6, "Son dos cosas juntas", "SaTwoLayers"),
  B(7, "que es lo que usa todo el mundo", "b_bleachjug", `${BLEACH} on the edge of a shower tray with a cloth beside it.`),
  B(7, "el baño huele a limpio", "b_opaquelook", `${G} wiping a shower wall with a cloth, the white spots still visible on the tiles after wiping.`),
  C(7, "La cal no es mugre", "SaStoneNotDirt"),
  CH(8, "La receta del atomizador", 2, "La receta del atomizador"),
  C(9, "Dos tazas de vinagre blanco", "SaSprayRecipe"),
  B(9, "Se entibia", "b_saucepan", `A small saucepan of clear liquid warming gently on a kitchen stove, no boiling, a wooden spoon beside it.`),
  B(9, "una cucharada de detergente", "b_soapspoon", `A spoon being filled with green dish soap above a glass measuring jug of pale liquid.`),
  B(9, "Todo eso va a un atomizador", "b_funnel", `A small funnel in the neck of ${SPRAY}, liquid being poured in on a white counter.`),
  C(10, "el vinagre tibio trabaja más rápido", "SaWarmRace"),
  B(10, "la pava eléctrica del office", "b_kettle", `An old electric kettle on a shelf in a hotel staff pantry with stacked white cups.`),
  B(10, "ojo con el vapor", "b_steam", `Thin steam rising from an open electric kettle, close view.`),
  B(11, "Para que el vinagre se quede pegado", "b_cling", `Foamy pale liquid clinging to white shower tiles and running down slowly in thick lines.`),
  C(11, "Uno abre la puerta", "SaDoorIn"),
  C(12, "una etiqueta que dice vinagre", "SaLabelBottle"),
  B(12, "en un baño hay otros frascos", "b_shelfbottles", `Several plastic cleaning bottles with plain blank labels crowded on a bathroom shelf.`),
  B(12, "un frasco sin nombre", "b_noname", `One plain unlabelled plastic spray bottle alone on a tiled ledge.`),
  CH(13, "Cuánto tiempo dejarlo actuar", 3, "Cuánto tiempo dejarlo"),
  C(14, "Quince minutos", "SaTimer15"),
  B(14, "vuelve a rociar", "b_respray", `${G} spraying a section of ${TILES} that has started to dry.`),
  B(14, "el vinagre seco no trabaja", "b_dried", `A patch of white shower tiles half wet and half dry, a clear line between them.`),
  B(15, "Si la capa es muy gruesa", "b_thick", `A thick old layer of white limescale around the bottom edge of a shower wall.`),
  C(15, "no lo deje toda la noche", "SaNoNight"),
  B(15, "en las juntas", "b_jointsclose", `Close view of the pale cement grout lines between white tiles.`),
  ST(16, "En el hotel los quince minutos", "s_clock", "wall clock close up", `A simple round wall clock in a hallway.`),
  C(16, "nosotros hacíamos el lavabo", "SaParallel"),
  B(16, "el inodoro", "b_toilet", `${G} wiping the lid of a white toilet in a hotel bathroom.`),
  B(16, "No es correr", "b_cartready", `A neatly stocked grey housekeeping cart with folded towels parked in a hotel corridor.`),
];
