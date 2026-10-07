// DIRECTOR C — fbgoteras: LO QUE NO ARREGLA (grieta ancha, membrana rota, tejas/chapa) · VARIANTES (ventana, canaleta, tanque por fuera,
// plato de maceta) · MANTENER · PREGUNTAS · RESUMEN · CTA 3 = QR · PRÓXIMO (reja) (párrafos 58-82).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { ROOF, CRACK, SEALED, JAR, HANDS, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbgoteras/";
export const SHOTS = [
  // ── límite
  C(58, "", "ClChapter", { n: 8, title: "Lo que esto no arregla", sub: "para que no pierdas un fin de semana" }),
  S(58, "no quiero que gastes un fin de semana", "av", ""),
  S(59, "", "bi", "b_nailcrack", { p: BI(`A fingernail fitting edgewise into a fine crack in a concrete roof.`), ov: { c: "ClChip", props: { text: "Grieta fina: sí" } } }),
  S(59, "un dedo de ancho", "bi", "b_widecrack", { q: "large crack concrete slab", p: BI(`A wide crack in a concrete roof slab with a finger inside it, one side higher than the other.`), ov: { c: "ClChip", props: { text: "Grieta ancha: no", alert: true } } }),
  S(60, "", "bi", "st_membrane", { q: "damaged roof membrane", p: BI(`An old blistered roof membrane.`), ov: { c: "ClChip", props: { text: "Membrana rota: no", alert: true } } }),
  S(60, "Es un parche, y un buen parche", "cl", "c_patch", { p: CLP(`He shrugs honestly on a sunny flat roof, one hand open, a silicone cartridge in the other.`) }),
  S(61, "", "bi", "st_tileroof", { q: "clay tile roof", p: BI(`A clay tile roof.`) }),
  S(61, "un tornillo flojo", "bi", "st_metalroof", { q: "metal roof screws", p: BI(`Screws on a corrugated metal roof.`) }),
  S(61, "primero lo ajustas", "bi", "b_screw", { p: BI(`A screwdriver tightening a roofing screw with a rubber washer on a corrugated metal sheet, a dab of silicone beside it.`) }),
  // ── variantes
  C(62, "", "ClChapter", { n: 9, title: "Dónde más sirve", sub: "cuatro ideas" }),
  S(63, "", "bi", "b_window", { p: BI(`${HANDS} pressing white silicone into the joint between an aluminum window frame and an outside wall.`) }),
  S(63, "la lluvia con viento", "bi", "st_windowrain", { q: "rain on window", p: BI(`Rain hitting a window.`) }),
  S(64, "", "bi", "st_gutter", { q: "house gutter", p: BI(`A metal rain gutter on a house.`) }),
  S(64, "Masilla por dentro", "bi", "b_gutterjoint", { p: BI(`A gloved finger pressing silicone into the joint inside a metal rain gutter.`) }),
  S(65, "", "bi", "b_tanklid", { p: BI(`The outside rim of a rooftop water tank lid with a crack sealed with white silicone.`) }),
  S(65, "adentro del tanque", "bi", "b_tankinside", { p: BI(`Clean water inside a rooftop water tank, seen from the open hatch.`), ov: { c: "ClChip", props: { text: "Adentro: no", alert: true } } }),
  S(66, "", "bi", "b_planter", { p: BI(`A big balcony plant pot saucer being brushed inside with white liquid silicone.`) }),
  S(66, "se terminó la pelea con el vecino de abajo", "bi", "st_balcony", { q: "balcony plants apartment", p: BI(`An apartment balcony with potted plants.`) }),
  // ── mantener
  C(67, "", "ClChapter", { n: 10, title: "Que dure años", sub: "tres costumbres" }),
  S(68, "", "bi", "b_inspect", { q: "man inspecting roof", p: BI(`A man crouching on a flat roof inspecting a white silicone band, lifting a loose edge with a utility knife.`) }),
  S(69, "", "bi", "b_drainleaves", { q: "clogged roof drain leaves", p: BI(`A roof drain clogged with dry leaves, a puddle around it.`) }),
  S(70, "", "bi", "b_paintaround", { p: BI(`A roller painting a flat roof with white roof paint around a silicone band, leaving the band uncovered.`), anim: "the roller rolls past the band" }),
  // ── preguntas
  C(71, "", "ClChapter", { n: 11, title: "Lo que siempre me preguntan", sub: "seis respuestas cortas" }),
  S(72, "", "bi", "b_twotubes", { p: BI(`Two silicone cartridges with plain labels side by side, one marked acetic, one neutral, on a workbench.`), ov: { c: "ClAsk", props: { q: "¿Acética o neutra?", sign: "" } } }),
  S(72, "la acética lo oxida", "bi", "b_rustscrew", { q: "rusty screw metal", p: BI(`A rusty metal roof screw with old silicone around it.`) }),
  S(73, "", "bi", "b_yellowed", { p: BI(`An old yellowed clear silicone bead on a roof next to a fresh white one.`), ov: { c: "ClAsk", props: { q: "¿Transparente o blanca?", sign: "" } } }),
  S(74, "", "bi", "st_thinner", { q: "paint thinner bottle", p: BI(`A bottle of paint thinner.`), ov: { c: "ClAsk", props: { q: "¿Con tíner?", sign: "" } } }),
  S(75, "", "bi", "st_clouds", { q: "rain clouds coming", p: BI(`Dark rain clouds approaching over houses.`), ov: { c: "ClAsk", props: { q: "¿Y si llueve?", sign: "" } } }),
  S(76, "", "bi", "b_oldband", { p: BI(`A white silicone band on a sunny flat roof, slightly weathered but intact.`), ov: { c: "ClAsk", props: { q: "¿Cuánto dura?", sign: "" } } }),
  S(77, "", "bi", "b_paintstain", { q: "painting ceiling roller", p: BI(`A hand painting over a brown water stain on a bedroom ceiling with a small roller.`), ov: { c: "ClAsk", props: { q: "¿Sirve adentro?", sign: "" } } }),
  // ── resumen
  C(78, "", "ClChapter", { n: 12, title: "Todo junto", sub: "para que lo tengas" }),
  S(78, "Grieta cepillada y abierta en ve", "c", "ClCheck", { props: { title: "La receta", items: ["Cepillar y abrir en V", "1 día entero de sol", "Masilla: silicona + chorrito de acetona", "Sólo lo de 5 minutos", "Líquida: cartucho + aguarrás, como yogur", "3 manos finitas, 15 cm por lado", "El balde antes de la lluvia"] } }),
  S(78, "La acetona para rellenar, el aguarrás para pincelar", "av", ""),
  // ── CTA 3
  C(79, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "la receta escrita + otras 9, gratis" }),
  // ── próximo
  S(80, "", "bi", "b_rustygate", { q: "rusty iron gate", p: BI(`An old rusty iron gate in front of a house.`) }),
  S(80, "para que la reja no se oxide nunca más", "bi", "b_paintedgate", { q: "black iron gate", p: BI(`A freshly painted glossy black iron gate in the sun.`) }),
  C(80, "te muestro dónde va", "ClVideoRef", { thumb: I + "th_next.jpg", title: "Aflojatodo + pintura: la reja", next: true }),
  // ── cierre
  S(81, "", "av", ""),
  S(81, "que le mire la canaleta", "bi", "b_neighborwave", { p: BI(`${NEIGHBOR} waving from his roof next to a metal gutter, grinning.`) }),
  S(82, "", "av", ""),
];
