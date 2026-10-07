// DIRECTOR A — alfresco (Claudio el Albañil #2, "La casa de Doña Marta" ep. 2): MINUTO 1 (el sol pegando en el vidrio con la cortina
// adentro en el seg 0 + "esa cortina no frena el calor" → la cara → el termómetro 38° → el nieto y el presupuesto del aire del pintor →
// loop de las 3 de la mañana → promesa (malla, 2 ventanas, ventilador al revés) + vistazo del termómetro → credibilidad + prueba de $0 →
// el caño enterrado) + el video del moho (ClVideoRef) + el cuarto de arriba + los 3 lados del calor (párrafos 0-18).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const H = "a mason's rough weathered hands, the sleeve of a bright orange t-shirt at the edge of the frame";
export const UP = "a small upstairs room of an old modest Latin American house, right under a flat concrete roof slab, with pale mint-green plastered walls, a narrow single bed with a striped blanket, a red terracotta floor and a wooden window with white iron bars facing the afternoon sun";
export const NIECE = "a Latin American woman in her forties with a dark ponytail, jeans and a blue blouse";
export const PAINTER = "a house painter in his forties in white paint-stained overalls and a cap";
export const BOY = "a skinny 11-year-old Latin American boy with short black hair in a soccer t-shirt";
const I = "img/alfresco/";
export const SHOTS = [
  // ── 0:00 · el sol en el vidrio con la cortina adentro
  S(0, "", "bi", "b_sunwindow", { p: BI(`Inside ${UP} in the late afternoon: harsh orange sunlight blazing through the window glass onto a thin closed curtain, the curtain glowing hot, a hot bright patch of sun on the bed and the floor.`), anim: "the curtain moves slightly as heat shimmers", ov: { c: "ClStampOv", props: { text: "NO FRENA EL CALOR" } } }),
  S(0, "no frena el calor", "bi", "b_curtainglow", { p: BI("Extreme close view of a thin beige curtain glowing with hot orange afternoon sun behind it, the fabric lit through, the window frame visible.") }),
  S(0, "Cuando el sol pega en el vidrio", "av", ""),
  S(0, "el calor ya está adentro de su casa", "bi", "b_hotfloor", { p: BI(`Close view of a red terracotta floor and the edge of a bed with a striped blanket lit by a hot rectangle of afternoon sun through a window, dust floating in the beam.`) }),
  // ── el termómetro
  S(1, "", "bi", "b_thermo38", { p: BI(`An old round wall thermometer with a red needle hanging on the pale mint-green plastered wall of ${UP}, harsh late-afternoon light on it.`) }),
  S(1, "en el cuarto de arriba de Doña Marta", "bi", "b_updoor", { p: BI(`The closed wooden door at the top of a narrow concrete staircase of an old house, harsh light leaking under it, a small woven mat in front.`) }),
  C(1, "Seis de la tarde", "ClThermo", { from: 30, to: 38, label: "6 de la tarde" }),
  // ── el nieto + el presupuesto del pintor
  S(2, "", "bi", "b_emptybed2", { p: BI(`The narrow empty single bed of ${UP} with a folded blanket and a child's backpack on it, a small electric fan on the floor, the afternoon light harsh and hot.`) }),
  S(2, "Y el mismo pintor", "bi", "b_painterac", { p: BI(`${PAINTER} standing in a doorway of an old house holding a glossy brochure of an air conditioner and a printed quote, smiling like a salesman.`) }),
  S(2, "por la pared del moho", "bi", "b_moldwallref", { p: BI(`A freshly painted white corner of an old bedroom wall with pale mint-green walls around it, a heavy dark wardrobe standing a few centimeters away from it.`) }),
  S(2, "ahora le quería vender", "bi", "b_acbrochure", { p: BI("Close view of a glossy air conditioner brochure and a printed price quote held in a man's hand in white paint-stained overalls.") }),
  C(2, "un aire acondicionado de seiscientos dólares", "ClReceipt", { lines: [["Aire acondicionado", "$600"], ["Instalación", "aparte"], ["Luz, todos los meses", "más"]], total: ["El presupuesto del pintor", "$600 +"] }),
  // ── el loop de las 3 de la mañana
  S(3, "", "bi", "b_clock3", { p: BI(`A small alarm clock on a nightstand showing three o'clock at night, next to a wall thermometer in a dark small bedroom lit only by a streetlight through the window.`) }),
  S(3, "en ese cuarto", "bi", "b_nightthermo", { p: BI(`A round wall thermometer on a plastered wall lit by a small flashlight beam in a dark room at night.`) }),
  S(3, "eso no lo esperaba", "cl", "c_night", { p: CLP(`At night in ${UP}, lit by a small flashlight, he reaches up and touches the ceiling with his open palm, frowning in surprise.`) }),
  // ── la promesa
  S(4, "", "av", ""),
  S(4, "sin gastar luz", "bi", "b_lightbill", { p: BI(`An electricity bill on a kitchen table with a lace tablecloth, reading glasses and a pen on top, an old woman's hand resting next to it.`) }),
  S(4, "Con una malla de sombra", "bi", "b_shadecloth", { p: BI(`A roll of dark green shade cloth mesh with metal eyelets unrolled on a workbench, a few metal hooks beside it.`) }),
  S(4, "dos ventanas", "bi", "b_twowindows", { p: BI(`The back of an old modest two-story house at dusk seen from its small patio: one low window open downstairs and one small window open upstairs on the other side.`) }),
  S(4, "y un ventilador al revés", "bi", "b_fanwindow", { p: BI(`A small box fan set on the sill of an open barred window, facing outside, in a small upstairs room at dusk.`) }),
  S(4, "Así estaba el termómetro", "bi", "b_thermohot", { p: BI(`Extreme close view of the face of an old round wall thermometer with the red needle near the top of the scale, harsh sun on it.`), ov: { c: "ClChip", props: { text: "Antes", alert: true } } }),
  S(4, "Y así quedó, una semana después", "cl", "c_glimpse2", { p: CLP(`He stands in ${UP} with a shade cloth visible outside the window behind him, holding a round wall thermometer close to his chest so its face is half hidden by his hand, smiling slyly at the camera.`), ov: { c: "ClChip", props: { text: "Una semana después" } } }),
  // ── credibilidad + la prueba de $0
  S(5, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de albañil" } } }),
  S(5, "Treinta años de albañil", "bi", "b_trowelwall", { p: BI(`Close view of ${H} spreading fresh mortar on a brick wall with a worn steel trowel, sunlight, cement dust on the skin.`) }),
  S(5, "miles de casas", "cl", "c_roofwork", { p: CLP(`He kneels on a flat concrete roof under strong sun, checking the surface with his palm, a bucket and a roller beside him, rooftops of a neighborhood behind.`) }),
  S(5, "Y al final le doy", "av", ""),
  S(5, "la prueba de cero dólares", "bi", "b_palmceiling", { p: BI(`Close view of ${H} pressing an open palm flat against a plastered ceiling in a dim room at night.`), ov: { c: "ClChip", props: { text: "$0" } } }),
  S(5, "antes de tocar cualquier casa caliente", "bi", "b_hotfacade", { p: BI("The sunny facade of an old two-story house in the afternoon heat, the upper floor with a small barred window, heat shimmer over the flat roof.") }),
  S(5, "Cinco segundos, con la mano", "av", ""),
  // ── el caño enterrado
  S(6, "", "kf", "k_pipe", { p: BI(`A white PVC pipe elbow sticking up out of a green lawn in a small backyard with a stone border around it, a little vent cap on top, the old house wall behind.`), d1: "the white pipe stands out of the lawn in the sun", d2: "the grass around it moves gently in the breeze", sound: "a light breeze in a backyard" }),
  S(6, "el famoso caño enterrado", "bi", "b_pipecap", { p: BI("Close view of the mesh cap on top of a white PVC pipe sticking out of a lawn, a few dry leaves caught in it.") }),
  S(6, "Cuándo enfría de verdad", "bi", "b_trench", { p: BI(`A deep narrow trench dug in a backyard with a long white PVC pipe lying at the bottom, a shovel stuck in the pile of dirt beside it.`) }),
  S(6, "dinero tirado a un pozo", "bi", "b_shortpipe", { p: BI(`A short white PVC pipe barely buried a few centimeters under the dirt of a small garden bed, one end sticking out, looking amateurish.`) }),
  // ── 1:00 · el video del moho
  C(7, "", "ClVideoRef", { thumb: I + "th_almoho.jpg", title: "El moho de esta casa" }),
  S(7, "Ese sábado, antes de irme", "bi", "b_stairs2", { p: BI("A narrow old concrete staircase with an iron handrail going up to a small door on the upper floor of an old house, harsh afternoon light from above.") }),
  // ── el cuarto de arriba
  S(8, "", "bi", "b_upstairs", { p: BI(`${UP}, seen from the door, nobody in it, harsh afternoon light, the air hazy.`) }),
  S(8, "con un techo plano de losa de concreto", "bi", "st_slab", { q: "flat concrete roof", p: BI("A flat bare gray concrete roof slab of a small house under a strong midday sun, a water tank on one side.") }),
  S(8, "Ahí dormía su nieto, Tomás", "bi", "b_tomas", { p: BI(`${BOY} lying on the narrow bed of ${UP}, sweaty, fanning himself with a comic book, unable to sleep.`) }),
  S(9, "", "cl", "c_heat2", { p: CLP(`He opens the door of ${UP} and is hit by the heat, squinting, pulling the collar of his orange t-shirt away from his neck.`) }),
  S(9, "El termómetro de la pared, treinta y ocho grados", "bi", "b_thermowall", { p: BI(`A round wall thermometer on a bare plastered wall of ${UP} next to the window, its needle at the top in the red, the light harsh.`), ov: { c: "ClChip", props: { text: "38 °C", alert: true } } }),
  S(9, "Y afuera, a la sombra del patio", "bi", "st_patioshade", { q: "shady patio plants", p: BI("A small shaded patio of an old house with potted plants, a plastic chair and a clothesline, late afternoon.") }),
  S(10, "", "av", ""),
  S(10, "le había dejado un presupuesto", "bi", "b_quoteac", { p: BI(`A printed quote with an air conditioner brochure lying on a kitchen table with a lace tablecloth, reading glasses on top of it.`) }),
  S(10, "más lo que iba a subir la cuenta de luz", "bi", "st_meter", { q: "electric meter spinning", p: BI("An electricity meter on the outside wall of a house, its numbers turning.") }),
  S(11, "", "bi", "b_martasits", { p: BI(`${MARTA} sitting on the edge of the narrow bed in ${UP}, fanning herself with a folded newspaper, looking tired and sad.`) }),
  S(11, "Pero quiero que mi nieto vuelva a dormir acá", "bi", "b_photoboy", { p: BI(`A framed photograph of ${BOY} smiling, standing on a small shelf in a hot upstairs room beside a toy car.`) }),
  // ── los 3 lados del calor
  S(12, "", "av", ""),
  C(12, "Una casa se calienta por tres lados", "ClHeatSides", { mode: "three" }),
  S(13, "", "bi", "st_sunglass", { q: "sunlight through window", p: BI("Bright sunlight streaming through a window glass onto a wooden floor.") }),
  S(13, "como en un auto al sol", "bi", "st_carsun", { q: "car dashboard sun heat", p: BI("The dashboard of a parked car baking in the sun, heat shimmer over it.") }),
  C(14, "", "ClHeatSides", { mode: "roof" }),
  S(14, "la losa le devuelve ese calor desde arriba", "bi", "b_slabhand", { p: BI(`Close view of ${H} touching the bare concrete roof slab in full sun and pulling it back quickly because it is too hot.`) }),
  S(15, "", "bi", "b_closedhouse", { p: BI(`The closed wooden window of ${UP} at night, the room still, a small lamp on, a glass of water sweating on the nightstand.`) }),
  S(16, "", "bi", "st_acunit", { q: "air conditioner outdoor unit", p: BI("An air conditioner outdoor unit running on the wall of a house, its fan spinning.") }),
  S(16, "Lo inteligente es cortar cada uno donde empieza", "av", ""),
  S(17, "", "bi", "b_nightroom", { p: BI(`${UP} at three in the morning, dark, lit only by a streetlight through the closed window, the bed empty.`) }),
  C(17, "el cuarto de arriba seguía en treinta y un grados", "ClThermo", { from: 31, to: 31, label: "3 de la mañana" }),
  S(17, "Toqué el techo con la mano", "kf", "k_touch", { p: BI(`Close view of ${H} reaching up and pressing the open palm against a plastered ceiling in a dark room lit by a flashlight.`), d1: "the hand reaches up toward the ceiling", d2: "the palm rests flat on the ceiling and stays there", sound: "a quiet night room, a distant dog" }),
  S(18, "", "av", ""),
  S(18, "La casa se cocinaba de día y no se enfriaba nunca", "bi", "st_heatwave", { q: "heat haze street summer", p: BI("Heat haze over a sunny street of small houses in summer.") }),
];
