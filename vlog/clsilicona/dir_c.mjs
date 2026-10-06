// DIRECTOR C — clsilicona: QUE NO VUELVA (cadena al moho) · OTROS LUGARES (bacha, burletes, goma de la lavadora → cadena, mampara) ·
// ERRORES · PREGUNTAS · RESUMEN · CTA 3 · PRÓXIMO VIDEO: lo que nunca se mezcla · cierre (párrafos 43-68).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { TUB, CAULK, BOTTLE } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const G = "a hand in a blue nitrile glove";
const I = "img/clsilicona/";
export const SHOTS = [
  // ── 9:45 · que no vuelva
  C(43, "", "ClChapter", { n: 6, title: "Que no vuelva", sub: "treinta segundos" }),
  S(43, "seque los rincones de la bañera", "bi", "b_drycorner", { p: BI(`A hand wiping the corner of a bathtub dry with a towel after a shower, the white silicone clean.`) }),
  C(43, "lo mismo que le dije en el video del moho", "ClVideoRef", { thumb: I + "th_clmoho.jpg", title: "Moho: el cloro no lo mata" }),
  S(44, "", "bi", "b_curtainopen", { p: BI("A hand pulling a shower curtain open along its rod after a shower so it hangs loose, away from the tub edge.") }),
  // ── otros lugares
  C(45, "", "ClChapter", { n: 7, title: "El mismo truco", sub: "en otros 4 lugares" }),
  S(46, "", "bi", "b_sinkcaulk", { p: BI("Close view of the gray, mold-spotted silicone line between a kitchen countertop and the stainless steel sink.") }),
  S(46, "Mismas tiras mismo film", "bi", "b_sinkstrips", { p: BI(`${G} pressing soaked paper strips along the silicone line of a kitchen sink and covering them with cling film.`) }),
  S(47, "", "bi", "b_windowseal", { p: BI("Close view of the black-spotted rubber seal at the bottom of a window frame with condensation droplets on the glass.") }),
  S(48, "", "bi", "b_washerseal", { p: BI("Close view of the gray rubber door seal of a front-loading washing machine with a few permanent small black dots.") }),
  C(48, "los del video de la lavadora", "ClVideoRef", { thumb: I + "th_cllavadora.jpg", title: "La lavadora que huele mal" }),
  S(49, "", "bi", "b_screenseal", { p: BI("Close view of the vertical silicone line where a glass shower screen meets the wall tiles, black mold inside it.") }),
  S(49, "ayúdese con cinta de pintor", "bi", "b_tapeup", { p: BI(`${G} taping cling film in place with masking tape over soaked strips on a vertical shower silicone line.`) }),
  S(49, "le hago un video aparte", "av", ""),
  // ── errores
  C(50, "", "ClChapter", { n: 8, title: "Los errores", sub: "cada uno le arruina el trabajo" }),
  S(51, "", "bi", "b_stripsfell", { p: BI("Soggy paper strips lying in a heap at the bottom of a bathtub, having slid off the silicone line, the silicone still black.") , ov: { c: "ClChip", props: { text: "Sobre silicona mojada", alert: true } } }),
  S(52, "", "bi", "b_drystrips", { p: BI("Dried-out, curled paper strips stuck loosely along a bathtub silicone line with no plastic film over them.") , ov: { c: "ClChip", props: { text: "Sin film", alert: true } } }),
  C(53, "", "ClTimer30", { minutes: 60, text: "1 hora", label: "no alcanza" }),
  S(54, "", "bi", "b_yellowcaulk", { p: BI("An old bathtub silicone line turned yellowish and hard, with gray shadows still inside.") , ov: { c: "ClChip", props: { text: "Tiras con cloro", alert: true } } }),
  C(54, "como le expliqué en el video del moho", "ClPores3D", { mode: "bleach", labels: { top: "Blanco arriba", roots: "Vivo adentro" } }),
  S(55, "", "bi", "b_wetjoint", { p: BI("A bare bathtub-to-tile joint still damp and dark right after the old silicone was removed, a caulking gun ready beside it.") , ov: { c: "ClChip", props: { text: "Sin secar la unión", alert: true } } }),
  // ── preguntas
  C(56, "", "ClChapter", { n: 9, title: "Lo que siempre me preguntan", sub: "rapidito" }),
  S(57, "", "bi", "b_cottonpads", { p: BI("A stack of round white cotton pads next to a roll of paper towels on a bathroom counter.") , ov: { c: "ClChip", props: { text: "¿Papel o algodón?" } } }),
  S(58, "", "bi", "b_clearcaulk", { p: BI("A transparent silicone caulk line along a gray-tiled shower with faint dark spots behind it.") , ov: { c: "ClChip", props: { text: "¿Transparente o de color?" } } }),
  S(59, "", "bi", "b_morningbath", { p: BI("A bright hotel bathroom in the morning, a window open, the bathtub silicone clean white.") , ov: { c: "ClChip", props: { text: "¿Olor?" } } }),
  C(60, "", "ClCheck", { title: "¿Cuántas noches?", items: ["Casi siempre: 1", "Queda gris: 2", "Sigue negra: está debajo"], fast: true }),
  S(61, "", "bi", "b_rental", { p: BI("A small rental apartment bathroom with an old bathtub, a set of keys and a lease folder on the sink counter.") , ov: { c: "ClChip", props: { text: "¿Alquila?" } } }),
  S(62, "", "bi", "b_daytime", { p: BI(`A bathtub with paper strips and cling film along its silicone line in daylight, a closed bathroom door.`) , ov: { c: "ClChip", props: { text: "¿De día?" } } }),
  C(63, "", "ClNeverMix", { a: "Vinagre", b: "Agua oxigenada", verdict: "Nunca en la misma tira", short: true }),
  // ── resumen
  C(64, "", "ClCheck", { title: "Todo en 30 segundos", items: ["Limpiar y secar", "Tiras de 5 cm empapadas", "Film encima", "Toda la noche", "2 noches negra: rehacer y secar 24 h"] }),
  S(64, "Si a las dos noches sigue negra", "bi", "b_stillblack", { p: BI(`Close view of ${CAULK} after two nights of treatment, still showing black underneath.`) }),
  S(64, "y se deja secar la unión un día entero", "av", ""),
  // ── CTA 3
  S(65, "", "av", ""),
  C(65, "El código está acá", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "la página 14 entera, gratis" }),
  S(65, "con la tabla de lo que nunca se mezcla", "bi", "b_nevermixpage", { p: BI("A printed page taped inside a cleaning cabinet door, a simple chart with crossed-out pairs of bottle icons, bottles with blank labels on the shelves below.") }),
  // ── próximo video: lo que nunca se mezcla
  C(66, "", "ClVideoRef", { thumb: I + "th_clmezcla.jpg", title: "Lo que nunca se mezcla", next: true }),
  C(66, "debajo del fregadero", "ClNeverMix", { chart: true }),
  S(66, "y los dos fueron con productos buenos", "bi", "b_undersink", { p: BI("The open cabinet under a kitchen sink crowded with cleaning bottles with blank labels, a bleach jug next to a vinegar jug.") }),
  // ── cierre
  S(67, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Cuántos años tiene SU silicona?" } } }),
  S(68, "", "cl", "c_bye", { p: CLP(`He kneels beside ${TUB} holding a roll of cling film and a strip of paper towel, smiling warmly at the camera and giving a little wave goodbye.`) }),
];
