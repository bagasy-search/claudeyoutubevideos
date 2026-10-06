// DIRECTOR B — clmoho: POR QUÉ EL CLORO MIENTE (paga el loop 1: poros, raíces, blanquea arriba, vuelve; el techo de las duchas del
// personal y la cuarta vez) · el agua oxigenada entra al poro · lo honesto · LA PRUEBA DEL HISOPO · EL ERROR EN SECO (paga el loop 2:
// esporas, el muchacho nuevo, mojar primero) · CTA 2 (párrafos 18-31).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { SHOWER, MOLD, BOTTLE } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const G = "a hand in a blue nitrile glove";
const I = "img/clmoho/";
const NEWGUY = "a young hotel cleaner in his early twenties with short dark hair and a gray polo shirt";
export const SHOTS = [
  // ── 3:30 · por qué el cloro miente
  C(18, "", "ClChapter", { n: 2, title: "Por qué el cloro le miente", sub: "lo que pasa adentro de la junta" }),
  S(18, "no son lisas como el azulejo", "bi", "b_groutmacro", { p: BI("Extreme macro of a gray cement grout line between two glossy beige tiles: the grout surface rough and full of tiny pits and holes like a sponge, the tile edges smooth and shiny.") }),
  S(18, "Como una esponja vista de cerca", "bi", "st_spongemacro", { q: "sponge texture macro", p: BI("Macro of a yellow sponge texture.") }),
  C(19, "", "ClPores3D", { mode: "roots", labels: { top: "Lo que usted ve", roots: "Las raíces" } }),
  S(19, "Es una planta chiquita", "bi", "st_moldmacro", { q: "mold growth macro", p: BI("Macro of fuzzy mold growth.") }),
  C(20, "", "ClPores3D", { mode: "bleach", labels: { top: "Se pone blanco", roots: "Abajo sigue vivo" } }),
  S(20, "y se evapora", "bi", "b_bleachdry", { p: BI(`Close view of a shower corner where a puddle of bleach on the white tray is drying, the moldy silicone above it looking pale and bleached.`) }),
  S(20, "y el moho sigue vivo abajo tranquilo", "av", ""),
  S(21, "", "bi", "b_dotsback", { p: BI(`Extreme close view of pale bleached silicone caulk in a shower corner with tiny new black dots coming back through it in the same places.`), anim: "the camera pushes in slowly on the black dots" }),
  S(21, "Y usted le echa cloro otra vez", "bi", "st_bleachjug", { q: "bleach bottle pouring", p: BI("Pouring bleach from a white jug.") }),
  S(21, "Y así años", "av", ""),
  // el techo del personal
  S(22, "", "bi", "b_staffceiling", { p: BI("Looking up at the ceiling of a basement staff shower room in a hotel: a corner of white paint covered in spreading gray-black mold, a small dusty extractor grille in the ceiling.") }),
  S(22, "todos contentos", "bi", "b_staffwhite", { p: BI("The same staff shower ceiling corner, freshly bleached and looking white and clean, a bucket and a long-handled sponge mop leaning on the tiled wall.") }),
  S(22, "Lo pintamos encima", "bi", "b_paintover", { p: BI("A painter's roller loaded with white paint rolling over a moldy shower ceiling corner.") , anim: "the roller rolls slowly over the corner" }),
  S(22, "el moho atravesó la pintura", "bi", "b_throughpaint", { p: BI("A freshly painted white bathroom ceiling corner with gray-black mold spots blooming through the new paint and small paint bubbles.") }),
  S(23, "", "cl", "c_ceilingwork", { p: CLP("He stands on a short step ladder in a tiled hotel staff shower room, wiping the ceiling corner with a damp cloth on a broom handle, safety glasses on, a window open behind him."), anim: "he wipes the ceiling slowly" }),
  S(23, "Y arreglamos el extractor", "bi", "b_extractor", { p: BI(`${G} pulling a gray, lint-clogged plastic grille off a bathroom ceiling extractor fan.`) }),
  S(23, "Ocho años", "bi", "b_ceilingclean", { p: BI("The ceiling of a basement staff shower room in a hotel, clean bright white, an extractor grille clean, warm light.") , ov: { c: "ClChip", props: { text: "Ocho años" } } }),
  // el agua oxigenada entra al poro
  C(24, "", "ClPores3D", { mode: "peroxide", labels: { liquid: "Se mete en el poro", roots: "Rompe las raíces" } }),
  S(24, "Por eso los que limpian de profesión", "bi", "st_cleaners", { q: "professional cleaner bathroom", p: BI("A professional cleaner scrubbing a bathroom.") }),
  // lo honesto
  S(25, "", "av", ""),
  S(25, "En el azulejo liso", "bi", "b_glossytile", { p: BI("Extreme close view of a glossy glazed white bathroom tile surface, smooth and shiny, reflecting a ceiling light.") }),
  S(25, "El problema es la junta y la silicona", "bi", "b_moldcorner2", { p: BI(`Close view of ${MOLD}.`) }),
  // la prueba del hisopo
  C(26, "", "ClChapter", { n: 3, title: "La prueba del hisopo", sub: "¿vivo o mancha vieja?" }),
  S(26, "Moje un hisopo en agua oxigenada", "bi", "b_swabdip", { p: BI(`${G} dipping a cotton swab into the cap of ${BOTTLE.replace(" and a white trigger sprayer screwed straight onto it", "")} filled with clear liquid.`) }),
  C(26, "Si hace espumita", "ClSwab", {}),
  S(26, "con una lija fina o un marcador blanco para juntas", "bi", "b_groutpen", { p: BI(`${G} running a white grout marker pen along a stained gray grout line between bathroom tiles, the line turning bright white.`), anim: "the marker draws slowly along the grout line" }),
  // ── 6:20 · el error en seco (paga el loop 2)
  C(27, "", "ClChapter", { n: 4, label: "ERROR", title: "Refregar en seco", sub: "lo desparrama por todo el baño", alert: true }),
  C(28, "", "ClPores3D", { mode: "spores", labels: { top: "En seco, vuela" } }),
  S(28, "Son semillas", "bi", "st_dustlight", { q: "dust particles in light beam", p: BI("Dust particles floating in a beam of sunlight.") }),
  C(28, "Y esas semillas caen en el techo", "ClSpores", { img: I + "b_showerwide.jpg" }),
  S(29, "", "bi", "b_newguyscrub", { p: BI(`${NEWGUY} on a step stool scrubbing a moldy shower ceiling with a dry brush, a gray dusty haze around the brush, his face turned away.`), anim: "he scrubs hard with the dry brush" }),
  S(29, "el techo de la habitación de al lado", "bi", "b_nextceiling", { p: BI("A hotel bathroom ceiling with a scatter of small new gray-black mold spots spreading from one corner.") }),
  S(29, "Le juro", "av", ""),
  S(30, "", "bi", "b_wetfirst2", { p: BI(`${G} misting plain water from a white spray bottle over a moldy grout line before cleaning it.`) }),
  C(30, "nunca jamás un cepillo seco", "ClDoDont", { yes: { label: "Mojado primero", img: I + "b_wetfirst2.jpg" }, no: { label: "Cepillo seco", img: I + "b_newguyscrub.jpg" } }),
  S(30, "ni sacudir la cortina", "bi", "b_curtainshake", { p: BI("A person shaking a moldy plastic shower curtain inside a small bathroom, a faint haze in the air.") }),
  // CTA 2
  S(31, "", "av", ""),
  C(31, "está en la página doce", "ClBookPage", { page: I + "book_p12.jpg", pageNo: 12, qr: I + "qr.jpg", stamp: "Se la regalo" }),
  C(31, "El código está acá", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "la página 12, gratis" }),
];
