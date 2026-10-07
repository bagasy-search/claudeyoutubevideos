// DIRECTOR B — alfresco: los 4 pasos (malla afuera a 20 cm + frase del mostrador pág. 10 · de día cerrado · ventilación cruzada ·
// ventilador soplando afuera) + mención 2 (pág. 10) + el techo blanco + lo que pasó en el cuarto de arriba (párrafos 19-41).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
import { H, UP, NIECE, PAINTER, BOY } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/alfresco/";
export const SHOTS = [
  // ── paso 1: la sombra afuera
  C(19, "", "ClChapter", { n: 1, label: "PASO", title: "La sombra, afuera", sub: "las ventanas del oeste" }),
  S(19, "Las del oeste, por donde se pone el sol", "bi", "st_sunset", { q: "sunset over houses", p: BI("The sun setting low over the rooftops of a modest neighborhood, orange light.") }),
  S(19, "y pega cuando la casa ya está caliente", "bi", "b_westwall", { p: BI("The outside of an old house wall facing the late afternoon sun, a barred wooden window on it, the plaster glowing orange and hot.") }),
  C(20, "", "ClShadeGap", { mode: "both" }),
  S(21, "", "bi", "st_nursery", { q: "shade net greenhouse nursery", p: BI("A plant nursery covered with black shade cloth netting, rows of potted plants under it.") }),
  S(21, "Colgada afuera de la ventana", "bi", "b_shadeout", { p: BI("The outside of an old house's upstairs window with a dark green shade cloth hanging outside it from two hooks, a little gap between the cloth and the glass, afternoon sun hitting the cloth.") }),
  // mención 1 del Manual (frase del mostrador)
  S(22, "", "bi", "b_counter2", { p: BI("The counter of an ordinary neighborhood hardware store: a folded dark green shade cloth with metal eyelets and four metal hooks on the counter, shelves of tools behind.") }),
  S(22, "En el Manual le dejé esa frase anotada", "av", "", { ov: { c: "ClChip", props: { text: "Manual · pág. 10" } } }),
  S(23, "", "kf", "k_hook", { p: BI(`Close view of ${H} screwing a metal hook into the wall above an upstairs window from outside, a dark green shade cloth folded over his shoulder.`), d1: "the hand turns the metal hook into the wall", d2: "the hook is set and the hand hangs the shade cloth eyelet on it", sound: "a hook scraping into masonry" }),
  S(23, "Por ese espacio el aire caliente sube y se va", "bi", "b_gapside", { p: BI("A side view from above of a dark green shade cloth hanging about twenty centimeters away from a window glass, sunlight on the cloth and shade on the glass.") }),
  S(24, "", "cl", "c_hangshade", { p: CLP(`He stands on a short ladder outside the upstairs window of the old house, hanging a dark green shade cloth from two hooks, a wooden batten at its bottom.`), anim: "he lets the shade cloth unroll down" }),
  S(24, "Media hora de trabajo", "bi", "b_battenbottom", { p: BI("Close view of the bottom edge of a dark green shade cloth tied to a thin wooden batten so it does not flap, outside a window.") }),
  S(24, "el sol pegaba en la malla", "bi", "b_shadedglass", { p: BI(`Inside ${UP}: the window glass is now in shade, a dark green shade cloth visible outside it lit by the sun, the room much darker and calmer.`) }),
  // ── paso 2: de día cerrado
  C(25, "", "ClChapter", { n: 2, label: "PASO", title: "De día, todo cerrado", sub: "parece al revés" }),
  S(25, "Si de día abre la ventana", "bi", "b_openhot", { p: BI("A window wide open on a hot sunny afternoon, the curtain blowing in, a bright hot street visible outside.") }),
  S(26, "", "bi", "st_cooler", { q: "cooler box ice", p: BI("A camping cooler box full of ice and drinks with the lid open.") }),
  S(26, "y de día la mantiene cerrada", "bi", "b_shutters", { p: BI("Wooden shutters closed on the windows of an old house on a bright sunny day.") }),
  C(27, "", "ClDoDont", { yes: { img: I + "b_shutters.jpg", label: "Afuera más caliente: cerrado" }, no: { img: I + "b_openhot.jpg", label: "Ventana abierta al sol" } }),
  // ── paso 3: ventilación cruzada
  C(28, "", "ClChapter", { n: 3, label: "PASO", title: "La ventilación cruzada", sub: "el más importante" }),
  C(28, "abra una ventana baja del lado más fresco", "ClCrossVent", { fan: false }),
  S(29, "", "bi", "st_smoke", { q: "incense smoke rising", p: BI("A thin line of incense smoke rising and drifting in a room.") }),
  S(29, "La casa respira sola, como una chimenea", "av", ""),
  S(30, "", "bi", "b_salawindow", { p: BI(`The open low wooden window of the living room of an old house at dusk, white iron bars, a lace curtain moving in a cool breeze, a small patio with plants outside.`) }),
  S(30, "Y la alta, la del cuarto de arriba", "bi", "b_upwindowopen", { p: BI(`The small upstairs window of ${UP} wide open at dusk, the sky purple outside.`) }),
  S(30, "hasta las nueve de la mañana", "bi", "b_morningwin", { p: BI("A window of an old house open in the cool early morning light, a cup of coffee on the sill.") }),
  S(31, "", "bi", "b_barswin", { p: BI("Close view of an open window behind white iron bars of an old house at night, a small wooden wedge holding the inner frame.") }),
  // ── paso 4: el ventilador
  C(32, "", "ClChapter", { n: 4, label: "PASO", title: "El ventilador, al revés", sub: "soplando para afuera" }),
  S(32, "Póngalo en la ventana de salida", "cl", "c_fan", { p: CLP(`He places a small box fan on the sill of the open upstairs window of ${UP}, turning it to face outside, at dusk.`) }),
  S(33, "", "bi", "st_fanbed", { q: "fan blowing bedroom", p: BI("An electric fan blowing at a person lying in bed on a hot night.") }),
  C(33, "Un ventilador en la ventana", "ClCrossVent", { fan: true }),
  // mención 2 del Manual
  C(34, "", "ClBookPage", { page: I + "book_p10.jpg", pageNo: 10, qr: I + "qr.jpg", stamp: "Manual · página 10" }),
  C(35, "", "ClCheck", { title: "Los 4 pasos", items: ["Malla afuera, a 20 cm", "De día, todo cerrado", "De noche: abajo y arriba", "Ventilador para afuera"], fast: true }),
  // ── el techo blanco (arreglo aparte)
  S(36, "", "bi", "b_whiteroof", { p: BI("A flat concrete roof of a small house half painted bright white with a long roller, the other half still gray, a bucket of white paint on it, strong sun.") }),
  S(36, "Eso es otro arreglo", "av", ""),
  // ── lo que pasó en el cuarto de arriba
  C(37, "", "ClThermo", { from: 31, to: 26, label: "3 de la mañana", sub: "5 grados menos" }),
  C(38, "", "ClThermo", { from: 38, to: 31, label: "6 de la tarde", sub: "7 grados menos" }),
  S(38, "Sin aparato, sin cuenta de luz", "bi", "b_oldfan", { p: BI("An old small white electric fan with a little rust on its grille sitting on a wooden chair in an old house.") }),
  C(39, "", "ClNotebook", { title: "6 de la tarde", rows: [{ k: "Lunes", v: "38°" }, { k: "Martes", v: "34°" }, { k: "Viernes", v: "31°" }], note: "la libreta de Doña Marta" }),
  S(39, "con un dibujito de un sol tachado", "bi", "b_sundoodle", { p: BI("Close view of a page of a small lined notebook with handwritten numbers and a little hand-drawn sun crossed out with a pen, on a lace tablecloth.") }),
  S(40, "", "bi", "b_tomasback", { p: BI(`${BOY} carrying a small backpack up a narrow concrete staircase of an old house, smiling.`) }),
  S(40, "se quedó a dormir arriba", "bi", "b_tomassleep", { p: BI(`${BOY} sleeping peacefully on the narrow bed of ${UP} at night, a light blanket, the window open, a small fan on the sill.`) }),
  S(41, "", "bi", "b_grocerylist", { p: BI(`${MARTA}'s hand writing a grocery list with a pen on the back of a printed air conditioner quote on a kitchen table, smiling.`) }),
  S(41, "lo usó para anotar la lista del supermercado", "av", ""),
];
