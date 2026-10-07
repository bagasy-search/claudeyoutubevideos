// DIRECTOR B — fbporcelanato: POR QUÉ la pintura no da el color (pastel, el látex es el pegamento, el óxido pinta, 3 muestras) · LOS 5
// ERRORES · LO DEL VECINO (garaje rosa chicle, marcas de ruedas, la picó entera; la segunda en su galería) · LA PRUEBA (silla, café,
// lavandina, tacos) · CTA 2 = la colección (párrafos 28-54).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { ROOM, FLOOR, HANDS, TROWEL, PASTE, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbporcelanato/";
export const SHOTS = [
  // ── por qué
  C(28, "", "ClChapter", { n: 3, title: "Qué le da el color", sub: "no es la pintura" }),
  S(28, "es lo que muestra el video viral", "bi", "b_viralbucket", { p: BI(`Top view of a bucket of white cement with a swirl of bright red paint poured into the middle, the paint can tilted above it.`) }),
  S(29, "", "bi", "b_paintmacro", { q: "paint drop close up", p: BI(`Extreme close view of a drop of blue latex paint spreading into a big heap of white cement powder, fading to pale.`) }),
  S(29, "un celeste de bebé, un rosa lavado", "bi", "b_pastels", { p: BI(`Two small cement sample tiles on a bench, one washed-out baby blue, one washed-out pale pink, both chalky and dull.`) }),
  S(30, "", "av", ""),
  S(30, "como una red finita adentro del cemento", "bi", "b_latexfilm", { p: BI(`Extreme macro of a thin stretchy film of dried latex paint being peeled and stretched between two fingers, like plastic.`) }),
  S(30, "La pintura es el pegamento, no el color", "c", "ClCheck", { props: { title: "La pintura hace", items: ["Pega la capa al piso viejo", "La hace flexible", "Que no se raje"] } }),
  S(31, "", "bi", "b_oxidejars", { q: "pigment powder", p: BI(`Small open bags of iron-oxide pigment powder in red, blue, yellow and green on a hardware store shelf.`) }),
  S(31, "Es piedra molida, color puro", "bi", "b_oxidemacro", { p: BI(`Extreme close view of fine vivid red iron-oxide powder falling from a spoon.`), anim: "the powder falls in a soft stream" }),
  S(31, "esos rojos o verdes que siguen brillando", "bi", "st_oldredfloor", { q: "old red tile floor", p: BI(`An old polished red cement floor in a farmhouse.`) }),
  S(32, "", "cl", "c_samples", { p: CLP(`He holds up three small square cement sample tiles, pale blue, deep blue, and deep blue glossy, comparing them, in a bright backyard workshop.`) }),
  S(32, "celeste pastel, apagado", "bi", "b_sample1", { p: BI(`A small square cement sample tile, washed-out pale blue, dull and chalky, on a workbench.`), ov: { c: "ClChip", props: { text: "Sólo pintura", alert: true } } }),
  S(32, "se desgrana en el borde", "bi", "b_sample2", { p: BI(`A key scratching the edge of a deep blue cement sample tile that crumbles into powder at the corner.`), anim: "the key scratches and the edge crumbles", ov: { c: "ClChip", props: { text: "Sólo óxido", alert: true } } }),
  S(33, "", "bi", "b_sample3", { p: BI(`A key scratching hard across a glossy deep blue cement sample tile without leaving a mark.`), ov: { c: "ClChip", props: { text: "Óxido + pintura" } } }),
  C(33, "Ésa es la buena", "ClDoDont", { yes: { label: "Óxido + pintura", img: I + "b_sample3.jpg" }, no: { label: "Sólo pintura", img: I + "b_sample1.jpg" } }),
  S(34, "", "c", "ClCheck", { props: { title: "La regla", items: ["El óxido pone el color", "La pintura lo pega", "La llana le da el brillo"] } }),
  S(34, "Lo mismo que el granito", "c", "ClVideoRef", { props: { thumb: I + "th_granito.jpg", title: "Cemento con barniz: parece granito" } }),
  S(34, "lo hace la llana", "av", ""),
  // ── errores
  C(35, "", "ClChapter", { n: 4, title: "Los 5 errores", sub: "de mayor a menor" }),
  S(36, "", "bi", "b_thickplates", { p: BI(`A thick colored cement layer on an old floor cracked into plates with one plate lifting off at the edge.`), ov: { c: "ClChip", props: { text: "1 · Capa gruesa", alert: true } } }),
  S(36, "Dos finitas, siempre", "bi", "b_thinedge", { p: BI(`Close view of the clean edge of two thin teal cement coats on an old floor, like two sheets of paper.`) }),
  S(37, "", "bi", "b_dryfloor", { q: "dusty concrete floor", p: BI(`Close view of dusty dry old concrete floor sucking water from a fresh cement coat, the edge turning pale and powdery.`), ov: { c: "ClChip", props: { text: "2 · Piso seco", alert: true } } }),
  S(38, "", "bi", "b_blotches", { p: BI(`A teal cement floor with pale cloudy blotches where it was troweled too early.`), ov: { c: "ClChip", props: { text: "3 · Llana a destiempo", alert: true } } }),
  S(39, "", "bi", "b_sunfloor", { q: "sunlight on floor through door", p: BI(`Harsh sunlight through an open door on a fresh cement floor coat covered with a fine web of hairline cracks.`), ov: { c: "ClChip", props: { text: "4 · Sol o corriente", alert: true } } }),
  S(39, "Puertas cerradas y a la sombra", "bi", "st_closedoor", { q: "closing door", p: BI(`A hand closing a wooden door.`) }),
  S(40, "", "bi", "b_milky", { p: BI(`A teal cement floor with a cloudy milky white haze in the clear sealer.`), ov: { c: "ClChip", props: { text: "5 · Sellar antes de tiempo", alert: true } } }),
  // ── el vecino
  C(41, "", "ClChapter", { n: 5, title: "Lo del vecino", sub: "la entrada del garaje" }),
  S(42, "", "bi", "b_neighbortape", { p: BI(`${NEIGHBOR} measuring a home driveway with a tape measure, determined.`) }),
  S(42, "con pintura roja, sin óxido", "bi", "b_neighborpaint", { p: BI(`${NEIGHBOR} pouring a can of red paint into a bucket of white cement on a driveway.`) }),
  S(42, "una sola capa gruesa", "bi", "b_neighborthick", { p: BI(`${NEIGHBOR} spreading a thick layer of pink cement on a driveway with a trowel, sweating.`) }),
  S(43, "", "bi", "b_neighborgate", { p: BI(`${NEIGHBOR} at a front gate with a sad, sheepish face, shoulders slumped.`) }),
  S(43, "rosa chicle", "bi", "b_pinkdrive", { p: BI(`A home driveway coated in a bubblegum pink cement layer, a car parked on it.`) }),
  S(43, "las dos marcas de las ruedas", "bi", "b_tiremarks2", { p: BI(`Close view of two black tire marks on a pink thin cement driveway coating.`) }),
  S(43, "una esquina ya se estaba levantando", "bi", "b_peeling", { p: BI(`The corner of a thin pink cement driveway coating peeling up like a cracked sheet.`) }),
  S(44, "", "bi", "b_chisel", { q: "chisel hammer concrete", p: BI(`A hammer and cold chisel chipping a thin pink coating off a driveway.`), anim: "the chisel chips the coating" }),
  S(44, "una semana de rodillas", "bi", "b_neighborknees", { p: BI(`${NEIGHBOR} on his knees on a driveway with a hammer and chisel, wiping his forehead.`) }),
  S(45, "", "cl", "c_together", { p: CLP(`He and a mustached neighbour in a light-blue checked shirt kneel side by side troweling a deep red cement floor in a covered porch, laughing.`) }),
  S(45, "con óxido rojo de verdad", "bi", "b_redoxide", { p: BI(`Vivid red iron-oxide powder being stirred into white cement in a bucket, turning it deep red.`), anim: "the powder turns the cement red" }),
  S(45, "un rojo de casa de campo vieja", "bi", "b_redporch", { p: BI(`A covered porch with a glossy deep red polished cement floor, a wooden table set for lunch, like an old farmhouse.`) }),
  S(46, "", "bi", "b_graygarage", { q: "car in driveway house", p: BI(`A plain gray concrete garage driveway with a car on it, next to a house with a red-floored porch.`) }),
  // ── la prueba
  C(47, "", "ClChapter", { n: 6, title: "La prueba del vecino", sub: "silla, café, lavandina y tacos" }),
  S(48, "", "bi", "b_chairdrag", { p: BI(`An iron garden chair being dragged across a glossy deep red cement floor.`), anim: "the chair drags across the floor" }),
  S(48, "Ni una raya", "bi", "b_noscratch", { p: BI(`Extreme close view of a glossy red cement floor with no scratch, an iron chair leg beside the spot.`) }),
  S(49, "", "bi", "b_coffee", { q: "coffee spill floor", p: BI(`A cup of coffee spilled on a glossy red cement floor.`) }),
  S(49, "Nada, ni el aro", "bi", "b_coffeeclean", { p: BI(`A rag wiping a coffee spill off a glossy red cement floor, leaving it spotless.`) }),
  S(50, "", "bi", "st_mop", { q: "mopping floor", p: BI(`A mop cleaning a shiny floor.`), anim: "the mop sweeps" }),
  S(51, "", "bi", "b_heels", { q: "high heels walking floor", p: BI(`A woman's feet in high-heeled shoes walking across a glossy deep red cement floor.`) }),
  S(51, "El cemento de abajo, intacto", "bi", "b_heelmacro", { p: BI(`Extreme close view of a glossy red cement floor, a tiny dot in the sealer, the cement intact.`) }),
  S(52, "", "bi", "b_neighborpalm", { p: BI(`${NEIGHBOR} crouching on a glossy red floor running his palm over it, nodding slowly.`) }),
  S(52, "Bueno, me callo", "cl", "c_laugh", { p: CLP(`He laughs heartily in a covered porch with a red polished floor, a mustached neighbour beside him shrugging.`) }),
  // ── CTA 2
  S(53, "", "av", ""),
  S(53, "setenta y seis", "c", "ClBookPage", { props: { page: I + "book_cover.jpg", pageNo: 76, qr: I + "qr.jpg", stamp: "Las 10 mezclas, gratis" } }),
  S(53, "Madera, óxido, humedad", "bi", "st_renovation", { q: "home renovation floor", p: BI(`A home being renovated, a floor being worked on.`) }),
  S(54, "", "bi", "b_hollowtile", { p: BI(`A hand tapping an old floor tile with a screwdriver handle, a chalk circle drawn around a hollow-sounding area.`) }),
  S(54, "No te apuro", "av", ""),
];
