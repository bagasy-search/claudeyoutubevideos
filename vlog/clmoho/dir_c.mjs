// DIRECTOR C — clmoho: TECHO y CORTINA · EL COLOR · 3 LUGARES ESCONDIDOS (riel, frascos, extractor) · DOS VUELTAS → silicona (video que
// viene) · LA 220 (paga el loop 3: azulejo frío, hueco, el caño) · EL INSPECTOR Y LA LINTERNA · HUMEDAD · CUÁNDO LLAMAR A UN PROFESIONAL
// · ERRORES · PREGUNTAS · HÁBITOS · RESUMEN · CTA 3 · PRÓXIMO VIDEO (bandejas) · cierre (párrafos 32-66).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { SHOWER, MOLD, BOTTLE } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const G = "a hand in a blue nitrile glove";
const I = "img/clmoho/";
const PLUMBER = "a plumber in his fifties in a work shirt and knee pads";
export const SHOTS = [
  // ── 6:55 · techo y cortina
  S(32, "", "bi", "b_ceilingspray", { p: BI(`${G} spraying a moldy bathroom ceiling corner from the side with ${BOTTLE}, safety glasses resting on the windowsill of an open window.`) }),
  S(32, "un trapo húmedo con un palo de escoba", "bi", "b_broomcloth", { p: BI("A damp cloth wrapped around the head of a broom, pressed up against a white bathroom ceiling corner.") , anim: "the cloth wipes slowly along the ceiling" }),
  S(33, "", "bi", "b_curtainmold", { p: BI("The bottom hem of a white plastic shower curtain liner with pink and black mold spots along the folds.") }),
  S(33, "Ésa va al lavarropas", "bi", "b_curtainwasher", { p: BI("A plastic shower curtain liner and three old towels being loaded into a front-loading washing machine.") }),
  // el color
  C(34, "", "ClColorCode", { pick: 0, items: [{ c: "#1C1E14", name: "Negro o verde", what: "Moho", fix: "Agua oxigenada pura" }, { c: "#E8A3A8", name: "Rosado babosito", what: "Una bacteria", fix: "El mismo frasco" }, { c: "#C9732E", name: "Naranja", what: "Óxido o sarro", fix: "El video del sarro" }, { c: "#F4F2EC", name: "Blanco", what: "Jabón o sarro", fix: "Vinagre, otro día" }] }),
  C(34, "Es una bacteria", "ClColorCode", { pick: 1, items: [{ c: "#1C1E14", name: "Negro o verde", what: "Moho", fix: "Agua oxigenada pura" }, { c: "#E8A3A8", name: "Rosado babosito", what: "Una bacteria", fix: "El mismo frasco" }, { c: "#C9732E", name: "Naranja", what: "Óxido o sarro", fix: "El video del sarro" }, { c: "#F4F2EC", name: "Blanco", what: "Jabón o sarro", fix: "Vinagre, otro día" }] }),
  C(34, "Puede ser óxido o sarro", "ClVideoRef", { thumb: I + "th_clsarro.jpg", title: "El sarro del inodoro" }),
  // 3 lugares escondidos
  C(35, "", "ClChapter", { n: 5, title: "Donde se esconde", sub: "3 lugares que nadie mira" }),
  S(36, "", "bi", "b_rail", { p: BI("Close view of the top aluminum track of a glass shower door with a black line of mold and soap scum along the inside, a drop of water hanging under it.") }),
  S(36, "que gotea sobre usted", "bi", "b_raildrip", { p: BI("A single dark drop of water falling from the top track of a shower door.") , anim: "a drop forms and falls slowly" }),
  S(37, "", "bi", "b_shampoolift", { p: BI(`${G} lifting a shampoo bottle with a blank label off the ledge of a shower, revealing a pink and black ring of slime where it stood.`) }),
  S(37, "en un estante con agujeros", "bi", "b_wireshelf", { p: BI("Shampoo and soap bottles with blank labels on a chrome wire shower caddy with gaps that let the water drain.") }),
  S(38, "", "bi", "b_extractorgray", { p: BI("Looking up at a bathroom ceiling extractor fan grille clogged with thick gray lint and dust.") }),
  S(38, "Pruebe con una hoja de papel", "bi", "b_paperfan", { p: BI("A hand holding a sheet of white paper flat up against a bathroom ceiling extractor grille to test the suction.") , anim: "the paper flutters slightly against the grille" }),
  S(38, "Lávela", "bi", "b_grillewash", { p: BI(`A plastic extractor fan grille being scrubbed under a running sink faucet by ${G}.`) }),
  // dos vueltas → la silicona
  S(39, "", "av", ""),
  S(39, "Está debajo de la silicona", "bi", "b_undersilicone", { p: BI("Extreme close view of a semi-transparent white silicone caulk bead in a shower corner with black mold clearly trapped underneath it, behind the silicone, not on top.") }),
  S(39, "un truco de una noche entera", "bi", "b_stripssilicone", { p: BI("Strips of white paper towel soaked flat along the silicone caulk line of a bathtub, covered with clear plastic film, a bathroom at night.") }),
  // ── 8:15 · la 220 (paga el loop 3)
  C(40, "", "ClChapter", { n: 6, title: "La habitación 220", sub: "el moho que no se iba" }),
  S(40, "Esa ducha tenía moho en una sola esquina", "bi", "b_corner220", { p: BI("The lower corner of a hotel shower with black mold only in that one corner where the wall tiles meet the tray, the rest of the shower clean.") }),
  S(40, "Y volvía igual", "av", ""),
  S(41, "", "cl", "c_handtile", { p: CLP(`He kneels in ${SHOWER}, the palm of one bare hand pressed flat on a wall tile near the bottom corner, frowning in concentration.`) }),
  S(41, "sonó hueco", "bi", "b_taptile", { p: BI("Close view of a hand tapping a beige shower wall tile with the handle of a screwdriver.") }),
  S(42, "", "bi", "b_plumbertiles", { p: BI(`${PLUMBER} prying a beige tile off a hotel shower wall with a flat bar, a second tile already removed showing a dark wet wall behind.`) }),
  C(42, "y atrás había un caño con una pérdida chiquita", "ClWallLeak", {}),
  S(42, "El moho de la esquina era la punta", "bi", "b_wetwall", { p: BI("Close view of the inside of a shower wall with two tiles removed: dark damp plaster, black mold, and a copper pipe joint with a green crust and a bead of water on it.") }),
  S(43, "", "av", ""),
  S(43, "Es el agua", "bi", "b_pipedrop", { p: BI("Extreme close view of a single drop of water forming on a corroded copper pipe joint inside a wall.") , anim: "the drop swells and falls" }),
  // el inspector y la linterna
  S(44, "", "bi", "b_inspector", { p: BI("A health inspector in a white shirt with a clipboard standing in a hotel bathroom, holding a flashlight flat against a shower wall.") }),
  C(44, "la luz rasante le mostró cada puntito", "ClFlashlight", { img: I + "b_grouttile.jpg", label: "La luz de costado" }),
  S(44, "Pruébelo esta noche en su baño", "av", ""),
  // humedad
  S(45, "", "bi", "st_condensation", { q: "window condensation water drops", p: BI("Condensation water drops on the inside of a window.") }),
  C(45, "Un medidor de humedad cuesta poco", "ClHygrometer", {}),
  S(45, "abra un rato cada mañana", "bi", "st_openwindow", { q: "opening window morning", p: BI("A hand opening a window in the morning.") }),
  // cuándo llamar a un profesional
  C(46, "", "ClChapter", { n: 7, label: "OJO", title: "Cuándo llamar", sub: "a un profesional", alert: true }),
  C(46, "Si la mancha es más grande que un metro cuadrado", "ClCheck", { title: "Llame a un profesional si…", items: ["Más de 1 m²", "Pared de yeso", "Pared blanda o hinchada", "Alguien con asma"] }),
  S(46, "O si alguien en la casa tiene asma", "bi", "st_inhaler", { q: "asthma inhaler", p: BI("An asthma inhaler on a nightstand.") }),
  // ── 9:45 · errores
  C(47, "", "ClChapter", { n: 8, title: "Los errores", sub: "cada uno lo trae de vuelta" }),
  S(48, "", "bi", "b_dilutewater", { p: BI(`Pouring tap water into ${BOTTLE.replace(" and a white trigger sprayer screwed straight onto it", "")} at a sink.`) , ov: { c: "ClChip", props: { text: "Rebajarla", alert: true } } }),
  S(48, "Pura directo del frasco", "av", ""),
  S(49, "", "bi", "b_clearsprayer", { p: BI("A clear plastic spray bottle of liquid sitting on a sunny bathroom windowsill.") , ov: { c: "ClChip", props: { text: "Al sol", alert: true } } }),
  S(49, "Enrosque el rociador directo en el frasco marrón", "bi", "b_screwsprayer2", { p: BI(`${G} screwing a trigger sprayer onto a brown plastic bottle with a blank label.`) }),
  C(50, "", "ClNeverMix", { a: "Agua oxigenada", b: "Vinagre", verdict: "Nunca juntos" }),
  C(50, "Y nunca jamás cloro con vinagre", "ClNeverMix", { a: "Cloro", b: "Vinagre", verdict: "Gas tóxico" }),
  C(51, "", "ClNeverMix", { a: "Bicarbonato", b: "Vinagre", verdict: "Se anulan", soft: true }),
  S(52, "", "bi", "b_paintcrack", { p: BI("A bathroom wall painted over mold, the new paint bubbled and cracked with black mold coming through.") , ov: { c: "ClChip", props: { text: "Pintar encima", alert: true } } }),
  S(52, "Primero se saca se seca bien", "av", ""),
  // ── 11:00 · preguntas
  C(53, "", "ClChapter", { n: 9, title: "Lo que siempre me preguntan", sub: "rapidito" }),
  S(54, "", "bi", "b_sniffbottle", { p: BI("A woman sniffing the open brown bottle with a blank label in a bathroom, shrugging, unbothered.") , ov: { c: "ClChip", props: { text: "¿Huele fuerte?" } } }),
  S(55, "", "bi", "b_darkgrout", { p: BI("Dark charcoal gray grout lines between white subway tiles in a shower, a small test patch slightly lighter in the bottom corner.") , ov: { c: "ClChip", props: { text: "¿Juntas de color?" } } }),
  S(56, "", "bi", "b_weeklymist", { p: BI(`${G} giving a quick mist of ${BOTTLE} to the corners of a clean shower.`) , ov: { c: "ClChip", props: { text: "¿Cada cuánto?" } } }),
  S(57, "", "bi", "st_teatree", { q: "essential oil dropper bottle", p: BI("A small brown dropper bottle of essential oil.") , ov: { c: "ClChip", props: { text: "¿Árbol de té?" } } }),
  S(58, "", "bi", "st_vinegar", { q: "white vinegar bottle", p: BI("A bottle of white vinegar.") , ov: { c: "ClChip", props: { text: "¿Vinagre solo?" } } }),
  S(59, "", "bi", "b_closetmold", { p: BI("The inside back wall of an empty clothes closet with gray mold spots in the corner, clothes piled on a bed beside it.") , ov: { c: "ClChip", props: { text: "¿Y el placard?" } } }),
  S(59, "La ropa a lavar y al sol", "bi", "st_clothesline", { q: "clothes drying sun", p: BI("Clothes drying on a line in the sun.") }),
  // ── hábitos
  C(60, "", "ClChapter", { n: 10, title: "Que no vuelva", sub: "los hábitos del hotel" }),
  S(60, "El secador de goma por las paredes", "bi", "st_squeegee2", { q: "squeegee wiping shower", p: BI("A squeegee wiping water off a shower wall.") }),
  S(60, "El extractor prendido veinte minutos", "bi", "b_fanswitch", { p: BI("A finger flipping on the bathroom fan switch beside the door, the steamy bathroom behind.") }),
  S(60, "a secar afuera del baño", "bi", "st_towelhang", { q: "towel hanging rack", p: BI("A towel hanging on a rack.") }),
  S(61, "", "bi", "b_bathmatunder", { p: BI("A bath mat lifted off a bathroom tile floor, revealing a damp dark patch with mold spots underneath.") }),
  S(61, "Cuélguela después de bañarse", "bi", "b_bathmathang", { p: BI("A bath mat hung over the edge of a bathtub to dry.") }),
  // ── resumen
  C(62, "", "ClCheck", { title: "Todo en 30 segundos", items: ["Agua sola primero", "Agua oxigenada pura", "10 minutos sin tocar", "Cepillo, enjuague, secar", "Si vuelve: busque el agua"] }),
  S(62, "Si a las dos vueltas sigue negra la silicona", "bi", "b_silicone2", { p: BI(`Close view of a white silicone caulk line in a shower still showing black under the surface after cleaning.`) }),
  S(62, "busque el agua", "av", ""),
  // ── CTA 3
  S(63, "", "av", ""),
  C(63, "El código está acá", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "la página 12 entera, gratis" }),
  S(63, "Y si quiere los noventa y cuatro arreglos", "bi", "b_bookprint", { p: BI(`A freshly printed stack of letter-size book pages with photos of cleaning fixes fanned out on a hotel bathroom counter next to ${BOTTLE.replace(" and a white trigger sprayer screwed straight onto it", "")} and a folded white towel.`) }),
  // ── próximo video: bandejas
  C(64, "", "ClVideoRef", { thumb: I + "th_clbandeja.jpg", title: "Las bandejas del horno", next: true }),
  S(64, "con esa costra marrón que no sale con nada", "bi", "st_dirtypan", { q: "dirty baking sheet", p: BI("A dirty brown crusted baking sheet.") }),
  S(64, "Hasta que un cocinero me enseñó una pasta", "bi", "b_cook", { p: BI("A hotel cook in a white apron and cap in a stainless steel kitchen spreading a thick white paste over a brown crusted baking sheet with a spatula.") }),
  // ── cierre
  S(65, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Dónde le vuelve SU moho?" } } }),
  S(66, "", "cl", "c_bye", { p: CLP(`He crouches in ${SHOWER}, a squeegee in one gloved hand, looking at the camera with a warm wink and a little wave goodbye.`) }),
];
