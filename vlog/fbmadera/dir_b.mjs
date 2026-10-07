// DIRECTOR B — fbmadera: POR QUÉ en madera mojada se pudre igual (hongo = agua+aire+comida, la cera encierra la humedad, el poste
// cortado al medio) · LOS 5 ERRORES · LO DEL VECINO (la lata en la hornalla, la llamarada, la tapa de olla) · LA PRUEBA (estacas en
// maceta regada, tablitas en el balde) · CTA 2 = la colección (párrafos 28-54).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { POST, ROT, SEALED, CAN, MIX, HANDS, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbmadera/";
export const SHOTS = [
  // ── por qué
  C(28, "", "ClChapter", { n: 3, title: "El problema del que nadie habla", sub: "la madera mojada" }),
  S(28, "¿Por qué en un poste mojado no sirve?", "av", ""),
  S(29, "", "bi", "b_fungus", { q: "fungus on rotting wood", p: BI(`Extreme close view of white fungus threads spreading over damp dark rotting wood.`) }),
  S(29, "agua, aire y comida", "c", "ClCheck", { props: { title: "El hongo necesita", items: ["Agua", "Aire", "Comida: la madera"] } }),
  S(29, "Si le sacas una de las tres, no puede", "cl", "c_three", { p: CLP(`He holds up three fingers and folds one down, explaining, standing next to a pine post in the backyard workshop.`) }),
  S(30, "", "bi", "b_poremacro", { p: BI(`Extreme macro of pine wood pores sealed with a dark waxy film, a water drop sitting on top without entering.`), ov: { c: "ClStampOv", props: { text: "EL AGUA NO ENTRA" } } }),
  S(30, "el poste se queda seco", "bi", "b_drybase", { p: BI(`The base of ${POST} dug out of the soil, ${SEALED}, the wood dry and sound under the coat.`) }),
  S(31, "", "av", ""),
  S(31, "La cera tapa la humedad adentro", "bi", "b_trapped", { p: BI(`Cross-section of a pine post on a workbench: a shiny dark wax skin on the outside, the wood inside dark and wet, beads of moisture on the cut face.`), ov: { c: "ClStampOv", props: { text: "EL AGUA NO SALE" } } }),
  S(31, "el hongo está de fiesta", "bi", "st_mushroomwood", { q: "mushrooms growing on wood", p: BI(`Small mushrooms growing out of a damp rotting log.`) }),
  S(32, "", "bi", "b_washedpost2", { p: BI(`On a workbench in a plain backyard workshop with no toys, a pine post freshly washed and dripping wet being brushed with ${MIX}, the coat looking glossy and perfect.`) }),
  S(32, "Ahora lo corto al medio", "bi", "b_saw", { q: "sawing wooden post", p: BI(`A hand saw cutting a dark waxed pine post in half on two sawhorses, sawdust falling.`), anim: "the saw cuts back and forth, sawdust falls" }),
  S(33, "", "bi", "b_cutrot2", { p: BI(`Extreme close view of the sawn face of a pine post: a thin glossy dark wax rim around a soft dark rotten core with white fungus spots, a fingertip pressing into the soft center.`) }),
  S(33, "Por fuera parece nuevo", "cl", "c_cutshow", { p: CLP(`He holds the two halves of a sawn pine post toward the camera, pointing at the dark rotten core with a grim face, in the backyard workshop.`) }),
  S(33, "hasta que se cae el cerco", "bi", "st_brokenfence", { q: "broken wooden fence", p: BI(`A wooden fence leaning and fallen over in a yard.`) }),
  S(34, "", "bi", "b_cutgood", { p: BI(`A pine post sawn in half on a workbench: a thin dark waxed skin outside and pale yellow healthy wood all the way to the core.`) }),
  C(34, "hasta el corazón", "ClDoDont", { yes: { label: "Pintado seco", img: I + "b_cutgood.jpg" }, no: { label: "Pintado mojado", img: I + "b_cutrot2.jpg" } }),
  S(35, "", "av", ""),
  S(35, "Primero seca, después cera", "c", "ClCheck", { props: { title: "La regla", items: ["1 · Madera seca", "2 · Después, la cera"] } }),
  S(35, "Lo mismo que el barniz del granito", "c", "ClVideoRef", { props: { thumb: I + "th_prev.jpg", title: "Cemento con barniz: parece granito" } }),
  // ── errores
  C(36, "", "ClChapter", { n: 4, title: "Los 5 errores", sub: "de mayor a menor" }),
  S(37, "", "bi", "b_stoveclose", { p: BI(`Close view of a dented tin can standing right on the blue flame of a gas burner, the wax inside bubbling.`), ov: { c: "ClChip", props: { text: "1 · Directo al fuego", alert: true } } }),
  S(37, "Baño María, siempre", "bi", "b_bainmarie3", { p: BI(`${CAN} of melting wax in a pot of hot water on a small camping stove on a garden table outdoors.`) }),
  S(38, "", "bi", "st_winterpost", { q: "rain on fence", p: BI(`Rain falling on a wooden fence in winter.`), ov: { c: "ClChip", props: { text: "2 · Pintar mojado", alert: true } } }),
  S(39, "", "bi", "b_crust", { p: BI(`Close view of a lumpy thick crust of brown wax sitting on top of a pine post surface without soaking in.`), ov: { c: "ClChip", props: { text: "3 · Hirviendo", alert: true } } }),
  S(39, "Tibio, que puedas meter el dedo", "bi", "b_backhand", { p: BI(`The back of a gloved hand held just above ${CAN} of warm brown wax mix, feeling the warmth, no steam.`) }),
  S(40, "", "bi", "b_baretop", { p: BI(`A fence post with only its visible part painted dark, the base where it enters the soil left pale and bare.`), ov: { c: "ClChip", props: { text: "4 · Sólo lo que se ve", alert: true } } }),
  S(40, "Píntalo antes de clavarlo", "bi", "b_paintlying2", { p: BI(`Close view of ${HANDS} holding a normal flat paintbrush, painting the sharpened pointed end of a pine post lying on sawhorses before setting it in the ground.`) }),
  S(41, "", "bi", "b_blackskin", { p: BI(`A post with a peeling black gritty layer on its surface flaking off after rain.`), ov: { c: "ClChip", props: { text: "5 · No colar el aceite", alert: true } } }),
  // ── el vecino
  C(42, "", "ClChapter", { n: 5, title: "Lo del vecino", sub: "la hornalla" }),
  S(43, "", "bi", "b_neighborposts", { p: BI(`${NEIGHBOR} crouching between two pine posts in a sunny backyard, frowning thoughtfully, rubbing his mustache.`) }),
  S(43, "ya tenía las velas compradas", "bi", "b_neighborbag", { p: BI(`${NEIGHBOR} at his gate holding up a plastic bag full of white candles, grinning.`) }),
  S(43, "cuarenta postes", "bi", "st_longfence", { q: "long wooden fence", p: BI(`A long wooden post fence along a property.`) }),
  S(44, "", "bi", "b_neighborstove", { p: BI(`${NEIGHBOR} in a small home kitchen setting a tin can of candle wax directly on the gas stove burner.`) }),
  S(44, "Se fue a buscar el pincel", "bi", "b_emptykitchen", { p: BI(`An empty home kitchen, a tin can sitting on a lit gas burner, a thin wisp of smoke beginning to rise from it.`) }),
  S(45, "", "bi", "b_smoke", { p: BI(`Thick white smoke pouring out of a tin can on a gas stove in a home kitchen.`), anim: "white smoke billows up" }),
  S(45, "una llamarada que llegó hasta el techo", "bi", "b_flare", { p: BI(`A tall burst of orange flame rising from a tin can on a kitchen stove toward the ceiling.`), ov: { c: "ClStampOv", props: { text: "FUEGO" } } }),
  S(45, "una tapa de olla encima", "bi", "b_lid", { p: BI(`A hand placing a metal pot lid over a burning tin can on a stove, smothering the flame.`) }),
  S(45, "Con agua, explota", "c", "ClDoDont", { props: { yes: { label: "Tapa de olla", img: I + "b_lid.jpg" }, no: { label: "Agua", img: I + "b_flare.jpg" } } }),
  S(46, "", "bi", "b_sootceiling", { p: BI(`A home kitchen ceiling above the stove with a big black soot stain.`) }),
  S(46, "castigado una semana entera", "bi", "b_neighborsofa", { p: BI(`${NEIGHBOR} sitting alone on a garden bench looking sheepish and guilty, hands on his knees.`) }),
  S(47, "", "cl", "c_together", { p: CLP(`He and a mustached neighbour in a light-blue checked shirt brushing dark wax on a row of pine posts on sawhorses in a sunny backyard, laughing.`) }),
  S(47, "Cuarenta postes en una tarde", "bi", "b_postrow", { p: BI(`A row of forty freshly waxed dark pine posts leaning against a garden wall in afternoon sun.`) }),
  S(47, "lo pintó él solo", "bi", "b_neighborladder", { p: BI(`${NEIGHBOR} on a stepladder painting a kitchen ceiling white with a roller.`) }),
  // ── la prueba
  C(48, "", "ClChapter", { n: 6, title: "La prueba", sub: "un verano entero" }),
  S(49, "", "bi", "b_stakes", { p: BI(`Two identical pine stakes pushed into a big pot of damp soil on a patio, one coated dark with wax, one bare.`) }),
  S(49, "regamos todos los días", "bi", "st_watering", { q: "watering can plant pot", p: BI(`A watering can watering a big pot of soil.`), anim: "water pours from the can" }),
  S(50, "", "bi", "b_nailsoft", { p: BI(`Close view of a thumbnail pressing deep into the soft gray end of a bare pine stake pulled from damp soil, white fungus on it.`) }),
  S(50, "La pintada, la uña ni la marca", "bi", "b_nailhard", { p: BI(`Close view of a thumbnail pressing on the dark waxed end of a pine stake, not leaving a mark.`) }),
  S(51, "", "bi", "b_bucket", { p: BI(`Two small pine boards, one dark waxed and one bare, held under water in a bucket by a brick.`) }),
  S(51, "A la mañana las peso", "bi", "b_scale", { q: "kitchen scale", p: BI(`A small pine board on a kitchen scale on a workbench.`) }),
  S(51, "La sin nada pesa casi el doble", "c", "ClReceipt", { props: { lines: [["Tablita sin nada", "casi el doble"], ["Tablita pintada", "igual que ayer"]], total: ["Agua que entró", "sólo en la pelada"] } }),
  S(52, "", "bi", "b_neighborboard", { p: BI(`${NEIGHBOR} holding a small dark waxed board up to his glasses, inspecting it, eyebrows raised.`) }),
  S(52, "Bueno, me callo", "cl", "c_laugh", { p: CLP(`He laughs heartily in the backyard workshop, a mustached neighbour beside him shrugging.`) }),
  // ── CTA 2
  S(53, "", "av", ""),
  S(53, "setenta y seis", "c", "ClBookPage", { props: { page: I + "book_cover.jpg", pageNo: 76, qr: I + "qr.jpg", stamp: "Las 10 mezclas, gratis" } }),
  S(53, "Madera, óxido, humedad", "bi", "st_woodshed", { q: "garden shed tools", p: BI(`A tidy garden shed with tools on the wall.`) }),
  S(54, "", "bi", "b_safeposts", { p: BI(`Honey-colored waxed wooden stakes holding up bean plants in a sunny vegetable garden.`) }),
  S(54, "No te apuro", "av", ""),
];
