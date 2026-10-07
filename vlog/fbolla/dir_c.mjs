// DIRECTOR C — fbolla: LO QUE NO ARREGLA (quemado de años = varias vueltas, olla de hierro, fondo torcido) · VARIANTES (sartén de acero,
// pava por fuera, pileta, cubiertos) · MANTENER · PREGUNTAS · RESUMEN · CTA 3 = QR · PRÓXIMO (grieta) (párrafos 61-85).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { KITCHEN, POT, BURNT, SHINY, COLA, PASTE, HANDS, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbolla/";
export const SHOTS = [
  // ── límite
  C(61, "", "ClChapter", { n: 8, title: "Lo que esto no arregla", sub: "para que no pierdas una tarde" }),
  S(61, "no quiero que pierdas una tarde", "av", ""),
  S(62, "", "bi", "b_oldcarbon", { p: BI(`An old pot with a thick layered black carbon crust built up over years on its bottom and sides.`), ov: { c: "ClChip", props: { text: "De años: varias vueltas", alert: true } } }),
  S(62, "Va saliendo de a capas", "bi", "b_layers", { p: BI(`A steel pot bottom half clean, with a few remaining thin layers of black crust in patches.`) }),
  S(63, "", "bi", "st_castiron", { q: "cast iron pot", p: BI(`A black cast iron pot.`), ov: { c: "ClChip", props: { text: "Hierro: no", alert: true } } }),
  S(63, "se vuelve a curar con aceite", "bi", "b_seasoning", { p: BI(`A paper towel rubbing a thin layer of oil inside a black cast iron pot.`) }),
  S(64, "", "bi", "b_warped", { p: BI(`A steel pot sitting crooked on a flat counter, its bottom visibly warped.`) }),
  // ── variantes
  C(65, "", "ClChapter", { n: 9, title: "Dónde más sirve", sub: "cuatro ideas" }),
  S(66, "", "bi", "b_rainbowpan", { p: BI(`A stainless steel frying pan with a rainbow heat tint on its bottom.`) }),
  S(66, "le saca ese tornasolado", "bi", "b_panclean", { p: BI(`A sponge with toothpaste wiping away the rainbow heat tint from a steel frying pan.`), anim: "the tint wipes away" }),
  S(67, "", "bi", "b_kettle", { q: "stainless steel kettle stove", p: BI(`A stainless steel kettle on a gas stove with greasy smudges on its sides.`) }),
  S(67, "sin hervir nada", "bi", "b_kettlewipe", { p: BI(`A soft sponge with toothpaste polishing the outside of a steel kettle.`) }),
  S(68, "", "bi", "st_kitchensink", { q: "stainless steel kitchen sink", p: BI(`A stainless steel kitchen sink.`) }),
  S(68, "Vuelve a brillar", "bi", "b_sinkshine", { p: BI(`A rag rubbing toothpaste in circles on a stainless steel kitchen sink, a shiny patch appearing.`), anim: "the rag rubs in circles" }),
  S(69, "", "bi", "b_cutlery", { q: "spoons forks drawer", p: BI(`Stainless steel spoons and forks with dark stains on a kitchen towel, one polished spoon shining.`) }),
  // ── mantener
  C(70, "", "ClChapter", { n: 10, title: "Que no vuelva a ponerse negra", sub: "tres costumbres" }),
  S(71, "", "bi", "b_soak", { q: "washing pot sink", p: BI(`Hot water and a squirt of dish soap filling a warm pot with a little stuck food in the sink.`) }),
  S(72, "", "bi", "b_bigflame", { q: "gas stove flame", p: BI(`A gas flame spreading out past the sides of a small pot.`), ov: { c: "ClChip", props: { text: "Fuego medio" } } }),
  S(72, "revuelve y no te vayas lejos", "bi", "b_stirjam", { q: "stirring jam pot", p: BI(`A wooden spoon stirring bubbling jam in a steel pot on a stove.`) }),
  S(73, "", "bi", "b_drytowel", { q: "drying dishes towel", p: BI(`A checkered kitchen towel drying the inside of a shiny pot.`) }),
  // ── preguntas
  C(74, "", "ClChapter", { n: 11, title: "Lo que siempre me preguntan", sub: "seis respuestas cortas" }),
  S(75, "", "bi", "b_twobottles", { p: BI(`Two plastic bottles of dark cola with plain blank labels, one red and one silver, on a kitchen counter.`), ov: { c: "ClAsk", props: { q: "¿Sirve la light?", sign: "" } } }),
  S(76, "", "bi", "st_vinegar", { q: "white vinegar bottle", p: BI(`A bottle of white vinegar.`), ov: { c: "ClAsk", props: { q: "¿Con vinagre?", sign: "" } } }),
  S(77, "", "bi", "b_geltube", { p: BI(`A tube squeezing clear blue gel toothpaste onto a sponge.`), ov: { c: "ClAsk", props: { q: "¿Pasta en gel?", sign: "" } } }),
  S(78, "", "bi", "b_boilwater", { q: "boiling water pot", p: BI(`Clean water boiling in a shiny steel pot on a stove.`), ov: { c: "ClAsk", props: { q: "¿Le queda gusto?", sign: "" } } }),
  S(79, "", "bi", "b_alushine", { q: "aluminum pot", p: BI(`An aluminium pot slightly dull on one side and polished on the other.`), ov: { c: "ClAsk", props: { q: "¿El aluminio?", sign: "" } } }),
  S(80, "", "bi", "st_dishwasher", { q: "dishwasher open", p: BI(`An open dishwasher with dishes.`), ov: { c: "ClAsk", props: { q: "¿Al lavavajillas?", sign: "" } } }),
  // ── resumen
  C(81, "", "ClChapter", { n: 12, title: "Todo junto", sub: "para que lo tengas" }),
  S(81, "Acero o aluminio, nunca teflón ni enlozada", "c", "ClCheck", { props: { title: "La receta", items: ["Acero o aluminio (no teflón ni enlozada)", "Gaseosa hasta tapar lo negro", "10 min a fuego bajo", "30 min enfriando", "Pasta blanca, en círculos", "Bicarbonato si queda algo", "Secar enseguida"] } }),
  S(81, "La gaseosa ablanda, la pasta pule", "av", ""),
  // ── CTA 3
  C(82, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "la receta escrita + otras 9, gratis" }),
  // ── próximo
  S(83, "", "bi", "b_wallcrack", { q: "crack in wall plaster", p: BI(`A crack running across a painted plaster wall of a house.`) }),
  S(83, "la silicona con el cemento", "bi", "b_siliconecement", { p: BI(`A gray paste of silicone mixed with cement in a plastic cup with a putty knife.`) }),
  C(83, "te muestro qué usar", "ClVideoRef", { thumb: I + "th_next.jpg", title: "Silicona + cemento: la grieta", next: true }),
  // ── cierre
  S(84, "", "av", ""),
  S(84, "El vecino ya me contó la del arroz con leche", "bi", "b_neighborrice", { p: BI(`${NEIGHBOR} at a fence holding up a bowl of rice pudding, grinning.`) }),
  S(85, "", "av", ""),
];
