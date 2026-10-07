// DIRECTOR C — algotera: mantener → cuándo llamar → 5 errores → preguntas → la prueba de $0 (el charco que dura) → resumen → regalo +
// Manual US$27 → la grieta del pasillo (gancho al ep. 5) → cierre (párrafos 44-70).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
import { H, KITCHEN, STAIN, ROOF } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/algotera/";
export const SHOTS = [
  S(44, "", "bi", "st_autumn", { q: "autumn leaves falling", p: BI("Autumn leaves falling in a backyard.") }),
  S(44, "Diez minutos con un balde y guantes", "bi", "b_cleandrain", { p: BI(`Close view of a gloved hand lifting leaves out of a gutter of an old house into a bucket.`) }),
  S(45, "", "bi", "b_oldmembrane", { p: BI("An old white roof membrane with small cracks and a few soft bubbles, ready to be recoated.") }),
  S(46, "", "bi", "b_sagging", { p: BI("A white kitchen ceiling sagging and bulging down in one spot with a brown stain, looking heavy with water.") , ov: { c: "ClChip", props: { text: "Llame a un profesional", alert: true } } }),
  S(46, "Eso es peligroso", "av", ""),
  C(47, "", "ClChapter", { n: 4, title: "Los 5 errores", sub: "cada uno sigue goteando", alert: true }),
  S(48, "", "bi", "b_sealabove", { p: BI("A big blob of sealant spread on a concrete roof right above where a stain would be inside, far from the real crack.") , ov: { c: "ClChip", props: { text: "Error 1", alert: true } } }),
  S(49, "", "bi", "b_wholeroof", { p: BI("A garden hose flooding an entire flat roof at once, water everywhere.") , ov: { c: "ClChip", props: { text: "Error 2", alert: true } } }),
  S(50, "", "bi", "b_wetseal", { p: BI("Gray sealant squeezed onto a wet dirty crack on a concrete roof, already peeling at the edges, water around.") , ov: { c: "ClChip", props: { text: "Error 3", alert: true } } }),
  S(51, "", "bi", "b_bathsilicone", { p: BI("A cracked yellowed strip of bathroom silicone peeling off a concrete roof crack in the sun.") , ov: { c: "ClChip", props: { text: "Error 4", alert: true } } }),
  S(52, "", "bi", "b_drainstill", { p: BI("A sealed crack on a flat roof next to a drain funnel still clogged with leaves and a puddle around it.") , ov: { c: "ClChip", props: { text: "Error 5", alert: true } } }),
  C(53, "", "ClChapter", { n: 5, title: "Lo que siempre me preguntan", sub: "rapidito" }),
  S(54, "", "bi", "b_tarcrack", { p: BI("Old black tar on a roof cracked into a web of lines by the sun.") }),
  S(55, "", "bi", "st_rainroof", { q: "rain on roof puddles", p: BI("Rain falling on a flat roof with puddles.") }),
  S(56, "", "bi", "b_whitemembrane", { p: BI("A flat concrete roof fully coated with bright white membrane gleaming in the sun, the small upstairs room beside it.") }),
  S(57, "", "bi", "st_salvage", { q: "old roof tiles stack", p: BI("A stack of old clay roof tiles in a salvage yard.") }),
  S(58, "", "bi", "b_aptceiling", { p: BI("A water stain on the ceiling of an apartment bathroom under the neighbor's floor, a phone taking a photo of it.") }),
  S(59, "", "bi", "b_supplies4", { p: BI("A gray sealant cartridge, a caulking gun, a bucket of liquid membrane and a roll of white fabric lined up on a concrete roof.") }),
  S(60, "", "bi", "b_roofyear", { p: BI(`${H} running a palm over a white roof membrane checking for cracks, a small notebook on the roof beside it.`) }),
  S(61, "", "bi", "b_belowwatch", { p: BI(`Someone standing in ${KITCHEN} looking up at the ceiling holding a phone to their ear, a hose's water sound implied from above.`) }),
  // ── la prueba de $0
  S(62, "", "av", ""),
  S(62, "espere una hora, y mire el techo desde arriba", "cl", "c_lookroof", { p: CLP(`He stands at the top of a ladder with his head just above the edge of ${ROOF}, looking across it at puddles after rain.`) }),
  S(63, "", "kf", "k_puddle", { p: BI(`A puddle of still water on ${ROOF} an hour after rain, reflecting the sky and jacaranda branches.`), d1: "the still puddle reflects the sky", d2: "a leaf drops onto the puddle and makes rings", sound: "quiet roof after rain, birds" }),
  S(63, "Un charco que dura es una gotera que todavía no llegó", "av", "", { ov: { c: "ClStampOv", props: { text: "CHARCO = GOTERA", alert: true } } }),
  S(64, "", "bi", "b_halo2", { p: BI(`${ROOF} from above showing a dark two-meter ring around the drain where water stood for months.`) }),
  S(64, "y Doña Marta los cien dólares", "av", ""),
  C(65, "", "ClCheck", { title: "Todo en 30 segundos", items: ["El agua camina", "Primero el desagüe", "Manguera: de a una zona", "Sellador + membrana + tela", "Nunca mojado ni solo"], fast: true }),
  // ── CTA 3
  S(66, "", "av", ""),
  S(66, "le quedó una mancha en el techo", "bi", "b_stainleft", { p: BI(`A faded dry yellowish ring stain left on ${KITCHEN.replace("the old kitchen", "the ceiling of the old kitchen")}.`) }),
  C(66, "Es gratis", "ClQRCard", { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "las 3 pruebas, gratis", kicker: "REGALO · ANTES DE PINTAR" }),
  C(66, "el Manual del Albañil está en esa misma página", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "los 66 arreglos", kicker: "EL MANUAL · US$27" }),
  // ── la grieta (gancho al ep. 5)
  S(67, "", "av", ""),
  C(67, "al pasar por el pasillo", "ClHouseMap", { done: ["dormitorio", "arriba", "pared", "techo"], next: "grieta" }),
  S(67, "Una grieta que salía de la esquina de la puerta", "bi", "b_crackdoor", { p: BI("A narrow hallway of an old house with pale mint-green walls: a diagonal crack running up from the top corner of a wooden bedroom door frame toward the ceiling.") }),
  S(67, "Le metí una moneda", "kf", "k_coin", { p: BI(`Close view of ${H} pushing the edge of a coin into a diagonal crack in a pale mint-green plastered wall near a door frame.`), d1: "the coin edge touches the crack", d2: "the coin slides into the crack and stays there", sound: "a coin scraping into plaster" }),
  S(68, "", "bi", "b_puttytwice", { p: BI("A diagonal crack in a pale mint-green wall with two visible layers of old white filler along it, both cracked open again.") }),
  C(68, "La semana que viene le muestro", "ClVideoRef", { thumb: I + "th_algrieta.jpg", title: "La grieta del pasillo", next: true }),
  S(69, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Dónde estaba su gotera?" } } }),
  S(69, "que me encanta ver cuánto camina el agua", "bi", "b_mapstain", { p: BI("A hand-drawn pencil sketch on paper of a house roof with an arrow showing water traveling from a drain to a stain, on a kitchen table.") }),
  S(69, "Leo todos", "av", ""),
  S(70, "", "av", ""),
];
