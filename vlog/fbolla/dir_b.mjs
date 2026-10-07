// DIRECTOR B — fbolla: QUÉ OLLAS SÍ (la pasta = lija suavísima; acero/aluminio sí, teflón y enlozada no; cómo saber) · POR QUÉ
// ESPERAR QUE SE ENFRÍE (ácido suave + tiempo, la prueba de las dos ollas, el caramelo quema) · LOS 5 ERRORES · LO DEL VECINO
// (sartén de teflón arruinada → la olla de los fideos juntos) · LA PRUEBA (servilleta, uña, arroz con leche) · CTA 2 (párrafos 30-60).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { KITCHEN, POT, BURNT, SHINY, COLA, PASTE, HANDS, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbolla/";
export const SHOTS = [
  // ── qué ollas
  C(30, "", "ClChapter", { n: 3, title: "Qué ollas sí y cuáles no", sub: "lo que no muestra el video viral" }),
  S(30, "lo hacen en una sartén de teflón", "bi", "b_viralpan", { p: BI(`A black non-stick frying pan with a burnt stain, a glass of cola and a tube of toothpaste next to it on a stove.`) }),
  S(30, "cómo queda a la semana", "bi", "b_panweek", { p: BI(`A non-stick frying pan with its coating worn gray in the middle and an egg stuck to it.`) }),
  S(31, "", "bi", "b_pastemacro", { p: BI(`Extreme macro of white toothpaste on a fingertip, a fine powdery texture visible.`) }),
  S(31, "Es como una lija muy, muy suave", "bi", "st_sandpaper", { q: "fine sandpaper", p: BI(`A sheet of fine sandpaper.`) }),
  S(31, "la de gel", "bi", "b_gelpaste", { p: BI(`A blob of clear blue gel toothpaste next to a blob of white toothpaste on a kitchen counter.`) }),
  S(32, "", "bi", "b_steelshine", { p: BI(`A sponge with white toothpaste polishing a stainless steel pot, the metal shining where it passed.`) }),
  S(33, "", "bi", "b_teflonlayer", { p: BI(`Extreme close view of the edge of a non-stick pan where the thin black coating is chipped, bare aluminium below.`) }),
  S(33, "Esta sartén la hice como en el video", "cl", "c_badpan", { p: CLP(`He holds up a non-stick frying pan with gray scratched circles in ${KITCHEN}, showing it to the camera with a sorry face.`) }),
  S(33, "Le quedaron círculos grises", "bi", "b_graycircles", { p: BI(`Top view of a black non-stick frying pan with dull gray scrubbed circles in the middle.`), ov: { c: "ClStampOv", props: { text: "RAYADA" } } }),
  S(34, "", "bi", "b_enamelpot", { q: "red enamel pot", p: BI(`A red enamel cooking pot with a glossy white inside on a stove.`) }),
  S(34, "la deja opaca y rayada", "bi", "b_dullenamel", { p: BI(`Close view of the inside of a white enamel pot dull and scratched with fine circles.`) }),
  S(35, "", "bi", "b_stamp", { p: BI(`Close view of the underside of a pot with a stamped engraving in the metal, a thumb pointing at it.`) }),
  S(35, "si por dentro es negra y lisa", "bi", "b_blackinside", { p: BI(`Top view inside a smooth black non-stick pot.`) }),
  S(36, "", "c", "ClDoDont", { props: { yes: { label: "Acero o aluminio", img: I + "b_steelalu.jpg" }, no: { label: "Teflón o enlozada", img: I + "b_teflonenamel.jpg" } } }),
  S(36, "Lo mismo que con la reja", "c", "ClVideoRef", { props: { thumb: I + "th_prev.jpg", title: "Aflojatodo + pintura: la reja" } }),
  // ── esperar
  C(37, "", "ClChapter", { n: 4, title: "Por qué esperar que se enfríe", sub: "la media hora trabaja" }),
  S(38, "", "bi", "st_colaglass", { q: "cola glass bubbles", p: BI(`A glass of cola with bubbles.`) }),
  S(38, "se mete por los poros de la costra", "bi", "b_crustpores", { p: BI(`Extreme macro of dark cola seeping into the cracks of a black burnt crust.`) }),
  S(39, "", "bi", "b_cooldown", { q: "saucepan stove kitchen", p: BI(`A steel pot of dark cola cooling on a turned-off stove, the surface still, late afternoon light.`) }),
  S(39, "la costra sigue dura", "bi", "b_hardcrust", { p: BI(`A sponge pushing on a hard black crust at the bottom of a pot, nothing coming off.`) }),
  S(40, "", "bi", "b_twopots", { p: BI(`Two identical burnt steel pots side by side in a sink: one still black, the other half clean.`) }),
  S(40, "la costra salió con la esponja sola", "bi", "b_easyoff", { p: BI(`A soft sponge wiping away loosened black crust easily from a steel pot bottom.`) }),
  S(41, "", "bi", "b_hotpot", { q: "steaming pot", p: BI(`Steam rising from a steel pot of just-boiled dark cola, a pair of oven mitts beside it.`) }),
  S(41, "No hay apuro que valga eso", "cl", "c_mitts", { p: CLP(`He wags a finger at the camera in ${KITCHEN}, oven mitts on, next to a steaming pot.`) }),
  // ── errores
  C(42, "", "ClChapter", { n: 5, title: "Los 5 errores", sub: "de mayor a menor" }),
  S(43, "", "bi", "b_teflonerr", { p: BI(`A green sponge with toothpaste scrubbing hard on a black non-stick pan.`), ov: { c: "ClChip", props: { text: "1 · Teflón o enlozada", alert: true } } }),
  S(44, "", "bi", "b_highflame", { p: BI(`A big gas flame licking up the sides of a steel pot of boiling-down cola, thick dark syrup at the bottom.`), ov: { c: "ClChip", props: { text: "2 · Fuego fuerte", alert: true } } }),
  S(45, "", "bi", "b_steelwool2", { q: "steel wool scrubber", p: BI(`A steel wool pad next to a steel pot covered in fine bright scratches.`), ov: { c: "ClChip", props: { text: "3 · Esponja de alambre", alert: true } } }),
  S(46, "", "bi", "b_rush", { p: BI(`Hot dark cola being dumped out of a pot right off the stove, steam everywhere.`), ov: { c: "ClChip", props: { text: "4 · Sin la media hora", alert: true } } }),
  S(47, "", "bi", "b_spots", { q: "dish rack pots", p: BI(`A steel pot drying upside down on a rack with chalky white water spots.`), ov: { c: "ClChip", props: { text: "5 · Secar sola", alert: true } } }),
  // ── el vecino
  C(48, "", "ClChapter", { n: 6, title: "Lo del vecino", sub: "la sartén de los huevos" }),
  S(49, "", "bi", "b_neighborwalk", { p: BI(`${NEIGHBOR} walking briskly out of a front gate toward the house next door.`) }),
  S(49, "agarró la sartén de los huevos", "bi", "b_neighborgrab", { p: BI(`${NEIGHBOR} in his kitchen grabbing a black non-stick frying pan from a hook, determined.`) }),
  S(50, "", "bi", "b_neighborscrub", { p: BI(`${NEIGHBOR} scrubbing a black non-stick frying pan hard with a green sponge and toothpaste over his sink.`), anim: "he scrubs hard" }),
  S(50, "Más pasta, más fuerza", "bi", "b_morepaste", { p: BI(`A big blob of toothpaste squeezed onto a sponge over a non-stick pan.`) }),
  S(51, "", "bi", "b_neighbordoor", { p: BI(`${NEIGHBOR} at a front door holding up a scratched gray non-stick frying pan, sheepish face.`) }),
  S(51, "y el huevo pegado como con cemento", "bi", "b_stuckegg", { p: BI(`A fried egg stuck to the gray scratched middle of a non-stick pan, a spatula failing to lift it.`) }),
  S(52, "", "bi", "b_alupot", { p: BI(`An old aluminium pasta pot with a black burnt bottom on a kitchen counter.`) }),
  S(52, "Esa la hicimos juntos", "cl", "c_together", { p: CLP(`He and a mustached neighbour in a light-blue checked shirt stand side by side at a kitchen sink scrubbing an aluminium pot, laughing.`) }),
  S(53, "", "bi", "b_trophy", { p: BI(`A shiny aluminium pot hanging on a hook on a kitchen wall like a trophy.`) }),
  S(53, "le explica qué ollas sí y qué ollas no", "bi", "b_neighborexplain", { p: BI(`${NEIGHBOR} in his kitchen explaining to a visitor, pointing at pots hanging on the wall.`) }),
  // ── la prueba
  C(54, "", "ClChapter", { n: 7, title: "La prueba del vecino", sub: "servilleta, uña y arroz con leche" }),
  S(55, "", "bi", "b_napkin", { p: BI(`A wet white paper napkin being rubbed across the bottom of a clean aluminium pot.`), anim: "the napkin rubs the bottom" }),
  S(55, "Salió blanca", "bi", "b_whitenapkin", { p: BI(`A clean white paper napkin held up next to a shiny pot.`) }),
  S(56, "", "bi", "b_nail", { p: BI(`Extreme close view of a fingernail running along the inner corner of a clean shiny aluminium pot.`) }),
  S(57, "", "bi", "b_ricepudding", { q: "rice pudding cooking pot", p: BI(`Rice pudding bubbling in an aluminium pot on a stove, a wooden spoon in it.`) }),
  S(57, "y salió en un minuto", "bi", "b_ricewash", { p: BI(`A soft sponge and hot water easily washing stuck rice pudding out of an aluminium pot in a sink.`), anim: "the stuck rice washes away" }),
  S(58, "", "bi", "b_neighbordry", { p: BI(`${NEIGHBOR} drying his hands with a kitchen towel, looking at a shiny pot, a reluctant smile under his mustache.`) }),
  S(58, "Bueno, me callo", "cl", "c_laugh", { p: CLP(`He laughs heartily in a kitchen, a mustached neighbour beside him shrugging, a shiny pot on the counter.`) }),
  // ── CTA 2
  S(59, "", "av", ""),
  S(59, "setenta y seis", "c", "ClBookPage", { props: { page: I + "book_cover.jpg", pageNo: 76, qr: I + "qr.jpg", stamp: "Las 10 mezclas, gratis" } }),
  S(59, "Cocina, baño, óxido", "bi", "st_bathroom", { q: "bathroom sink tiles", p: BI(`A home bathroom sink and tiles.`) }),
  S(60, "", "bi", "b_kettlescale", { p: BI(`The inside of an electric kettle with white limescale on the bottom.`) }),
  S(60, "No te apuro", "av", ""),
];
