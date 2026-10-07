// DIRECTOR B — alhumedad: el arreglo (lista + frase del mostrador) → los 7 pasos (mención 2, pág. 11) → afuera (mudar los rosales,
// bajar la tierra, la canaleta) → lo que se hizo adentro en la casa de Doña Marta (párrafos 26-48).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
import { H, SALA, WALLB, NIECE, BOY, PLANTER } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/alhumedad/";
export const SHOTS = [
  C(26, "", "ClChapter", { n: 2, title: "El arreglo", sub: "afuera y adentro" }),
  C(27, "", "ClCheck", { title: "Lo que necesita", items: ["Martillo y cincel", "Cepillo de alambre", "Cemento y arena fina", "Hidrófugo para mortero", "Cuchara y llana de madera"] }),
  S(28, "", "bi", "b_counter3", { p: BI("The counter of an ordinary neighborhood hardware store: a paper bag of cement, a small bag of fine sand, a plastic jug of liquid additive with a plain blank label and a wire brush on the counter.") }),
  S(28, "Anótela tal cual", "av", ""),
  // ── pasos
  C(29, "", "ClChapter", { n: 1, label: "PASO", title: "Cepillo, en seco", sub: "nunca con agua" }),
  S(29, "saque en seco todo el polvo blanco", "kf", "k_wirebrush", { p: BI(`Close view of ${H} scrubbing ${WALLB} with a wire brush, white salty dust falling to the floor.`), d1: "the wire brush scrubs the salty wall", d2: "white dust falls and the wall under it looks rough and dry", sound: "a wire brush scraping a plaster wall" }),
  S(29, "Nunca lo lave con agua", "bi", "b_nowater", { p: BI("A wet sponge and a bucket of water next to a salty blistered wall, the wet patch on the wall already showing new white salt marks.") , ov: { c: "ClChip", props: { text: "Nunca con agua", alert: true } } }),
  S(30, "", "bi", "b_hammer", { q: "hammer tapping wall", p: BI(`Close view of ${H} tapping a pale mint-green plaster wall with the wooden handle of a hammer, working from the bottom up.`), anim: "the hammer handle taps the wall" }),
  S(30, "Ésa es la parte podrida", "bi", "b_hollow", { p: BI("A pencil circle drawn on a blistered living-room wall marking the area that sounds hollow, up to about knee height.") }),
  C(31, "", "ClChapter", { n: 3, label: "PASO", title: "Picar hasta el ladrillo", sub: "y 30 cm más" }),
  S(31, "pique todo lo flojo hasta llegar al ladrillo", "cl", "c_chisel", { p: CLP(`He kneels in ${SALA} chipping the bottom of the wall with a hammer and a chisel, chunks of old render falling, red brick showing underneath, safety glasses on.`), anim: "he strikes the chisel with the hammer" }),
  S(31, "treinta centímetros más arriba", "bi", "b_tape30", { p: BI(`Close view of ${H} holding a yellow tape measure up a wall from the top of a damp stain, marking thirty centimeters higher with a pencil.`) }),
  S(32, "", "bi", "b_brickopen", { ov: { c: "ClChip", props: { text: "1 semana al aire" } }, q: "exposed brick wall interior", p: BI(`The bottom of a living-room wall with the render chipped off down to dark damp red bricks, about a meter high, the window open beside it, morning light.`) }),
  S(32, "Ésta es la parte que nadie tiene paciencia de hacer", "bi", "st_dryroom", { q: "open window curtain wind", p: BI("A tall wooden window of an old living room wide open, a lace curtain moving in the breeze, daylight falling on a bare brick wall bottom drying.") }),
  C(33, "", "ClPasteRecipe", { a: 1, b: 3, aLabel: "cemento", bLabel: "arena", uA: "balde de", uB: "baldes de", note: "el hidrófugo, en el agua" }),
  S(33, "Primero mezcla el hidrófugo con el agua", "bi", "b_mixbucket", { q: "mixing cement bucket trowel", p: BI(`Close view of ${H} mixing cement mortar in a bucket with a trowel, a jug of liquid additive with a plain blank label beside it.`) }),
  S(34, "", "bi", "st_plastering", { q: "plastering wall trowel", p: BI("A mason applying cement render to a brick wall with a trowel.") }),
  S(34, "La primera, tirada fuerte con la cuchara", "kf", "k_throw", { p: BI(`Close view of ${H} throwing mortar from a mason's trowel onto bare red bricks at the bottom of a wall.`), d1: "the trowel swings toward the bricks", d2: "the mortar slaps onto the bricks and sticks", sound: "wet mortar slapping on brick" }),
  S(34, "La segunda, alisada con la llana de madera", "bi", "b_float", { q: "plastering float wall", p: BI(`Close view of ${H} smoothing fresh gray cement render on the bottom of a wall with a wooden float in circular strokes.`), anim: "the wooden float moves in small circles" }),
  S(35, "", "bi", "b_calendar4", { p: BI("A paper wall calendar in an old living room with four weeks crossed out day by day with a pen, next to a freshly rendered gray wall bottom."), ov: { c: "ClChip", props: { text: "3 a 4 semanas" } } }),
  C(36, "", "ClDoDont", { yes: { img: I + "b_breathpaint.jpg", label: "Pintura al agua, que respira" }, no: { img: I + "b_glossycan.jpg", label: "Esmalte o impermeable" } }),
  C(36, "Esas atrapan el agua", "ClWickWall", { mode: "breathe" }),
  // mención 2
  C(37, "", "ClBookPage", { page: I + "book_p11.jpg", pageNo: 11, qr: I + "qr.jpg", stamp: "Manual · página 11" }),
  C(38, "", "ClCheck", { title: "El arreglo entero", items: ["Cepillo en seco", "Picar + 30 cm", "1 semana al aire", "Repello con hidrófugo", "4 semanas · pintura al agua"], fast: true }),
  // ── afuera
  C(39, "", "ClChapter", { n: 4, title: "Cortar el agua de afuera", sub: "si no, vuelve" }),
  S(39, "pasamos los rosales de Don Ernesto a tres macetones grandes", "bi", "b_pots", { q: "terracotta pots roses", p: BI("Three large terracotta pots with freshly transplanted pink rose bushes in a sunny corner of a small patio, a shovel leaning beside them.") }),
  S(40, "", "bi", "b_tomasdig", { p: BI(`${BOY} carefully digging around a rose bush in a brick planter with a small hand trowel, concentrating.`), anim: "the boy digs gently around the roots" }),
  S(40, "Doña Marta, sentada en una silla del patio", "bi", "b_martapatio", { p: BI(`${MARTA} sitting on a plastic chair in her small patio, pointing at a rose bush and smiling, talking.`) }),
  S(40, "Fue la tarde más linda de todo el arreglo", "av", ""),
  S(41, "", "cl", "c_shovel", { p: CLP(`He shovels dark soil out of ${PLANTER} now without roses, lowering it away from the house wall into a wheelbarrow.`) }),
  S(41, "hasta dejarla más baja que el piso de adentro", "bi", "b_lowsoil", { q: "garden soil shovel", p: BI("The outside foot of an old house wall with a brick planter emptied so its soil is well below the doorstep level, the bottom of the wall exposed and drying.") }),
  S(41, "La mitad del problema era esa jardinera", "av", ""),
  S(42, "", "bi", "b_elbow", { p: BI("A new white PVC elbow and a pipe extension attached to the bottom of a metal rain downspout, carrying water a meter and a half away from the house wall to a patio drain grate.") }),
  S(42, "hacia la rejilla del patio", "bi", "st_drain", { q: "rain water drain grate", p: BI("Rain water running into a drain grate in a patio.") }),
  C(43, "", "ClCheck", { title: "Revise afuera", items: ["El agua del patio no corre a la pared", "La canaleta no descarga al pie", "Tierra más baja que el piso"], fast: true }),
  // ── adentro, en la casa de Doña Marta
  S(44, "", "bi", "b_saltbucket", { p: BI("A plastic bucket half full of white salty dust and flakes of paint on a red tile floor next to a wire brush, in front of a scraped wall.") }),
  S(44, "Piqué hasta el ladrillo", "bi", "b_chipped", { q: "chiseling plaster wall", p: BI(`${SALA} with the bottom meter of the patio-side wall chipped down to bare red brick, chunks of old render on a drop cloth.`) }),
  S(45, "", "bi", "b_darkbrick", { q: "wet brick wall", p: BI("Extreme close view of dark damp red bricks and mortar joints at the bottom of a wall, a few white salt spots.") }),
  S(45, "me mandaba todos los días una foto del ladrillo", "bi", "b_phonephoto", { p: BI(`${MARTA}'s wrinkled hands holding an old smartphone up to take a photo of a bare brick wall in her living room.`) }),
  S(46, "", "cl", "c_render", { p: CLP(`He applies a fresh gray cement render to the bottom of the wall in ${SALA} with a trowel, a bucket of mortar beside him.`), anim: "he spreads the mortar along the wall" }),
  S(46, "Lo más difícil fue convencerla de no colgar los cuadros", "bi", "b_pictures", { p: BI("Framed family photographs stacked on a dining table under a white sheet, one corner of the sheet lifted showing an old wedding photo.") }),
  S(47, "", "bi", "b_martaphone2", { p: BI(`${MARTA} talking on an old corded wall phone in her kitchen, pleading with a smile.`) }),
  S(47, "Me dijo que yo era más estricto que el médico", "av", ""),
  S(48, "", "bi", "b_creampaint", { p: BI(`The bottom of the patio-side wall of ${SALA} freshly painted in a soft cream water-based paint, smooth, no blisters, the old armchair back in place.`) }),
  C(48, "ni una ampolla, ni un grano de sal", "ClBeforeAfter", { before: I + "b_wallside.jpg", after: I + "b_wallside_ab.jpg", note: "dos meses después" }),
  S(48, "Y los rosales de Don Ernesto", "bi", "b_rosespots", { p: BI("Three large terracotta pots with pink rose bushes in full bloom in a sunny small patio, a plastic chair beside them.") }),
];
