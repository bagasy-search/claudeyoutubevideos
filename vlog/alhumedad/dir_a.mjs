// DIRECTOR A — alhumedad (Claudio el Albañil #3, "La casa de Doña Marta" ep. 3): MINUTO 1 (la brocha a punto de pintar sobre la pared
// inflada en el seg 0 + "no pinte esa pared" → la cara → el nudillo que suena hueco + la sal → Doña Marta y las 2 pintadas del pintor →
// loop del patio → promesa (cepillo, cemento, el líquido del agua) + vistazo → credibilidad + la prueba del lápiz → capítulo) + el video del
// calor + la sala + las 3 humedades + el error del pintor (mención 1) + la jardinera de Don Ernesto y la canaleta (párrafos 0-25).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const H = "a mason's rough weathered hands, the sleeve of a bright orange t-shirt at the edge of the frame";
export const SALA = "the living room of an old modest Latin American house with thick plastered walls painted pale mint green, red terracotta floor tiles, an old brown armchair, a glass cabinet with porcelain cups, framed family photos and a barred wooden window to a small patio";
export const WALLB = "the bottom meter of a pale mint-green painted plaster wall above a skirting board, the paint swollen in round blisters, some burst open, with white salty powder in the cracks and on the floor";
export const PAINTER = "a house painter in his forties in white paint-stained overalls and a cap";
export const NIECE = "a Latin American woman in her forties with a dark ponytail, jeans and a blue blouse";
export const BOY = "a skinny 11-year-old Latin American boy with short black hair in a soccer t-shirt";
export const PLANTER = "a raised brick planter full of dark soil and old rose bushes with pink roses built right against the outside wall of an old house in a small patio, its soil higher than the house floor level";
const I = "img/alhumedad/";
export const SHOTS = [
  // ── 0:00 · la brocha contra la pared inflada
  S(0, "", "bi", "b_brushstop", { p: BI(`Close view of a paint brush loaded with glossy white paint about to touch ${WALLB}.`), anim: "the brush moves slowly toward the blistered wall", ov: { c: "ClStampOv", props: { text: "NO PINTE" } } }),
  S(0, "Si la pinta", "av", ""),
  S(0, "en tres meses está otra vez inflada", "bi", "b_blisterclose", { q: "paint blisters wall", p: BI("Extreme close view of fresh glossy paint on a wall puffed up into big round blisters, one blister cracked open showing white salt crystals inside.") }),
  // ── el nudillo + la sal
  S(1, "", "kf", "k_knock", { p: BI(`Close view of ${H} knocking with a knuckle on ${WALLB}.`), d1: "the knuckle taps on the blistered paint", d2: "a flake of paint cracks off and white powder falls", sound: "hollow knocking on a plaster wall" }),
  S(1, "Y este polvito blanco", "bi", "b_saltfinger", { p: BI(`Extreme close view of a fingertip covered in white salty crystals held in front of ${WALLB}.`) }),
  S(1, "no es pintura vieja", "bi", "b_oldpaint", { q: "paint chips floor", p: BI("Close view of old flaking paint chips mixed with white salty powder on a red terracotta floor at the foot of a wall.") }),
  S(1, "es sal", "bi", "b_saltmacro", { q: "efflorescence wall salt", p: BI("Extreme close view of white fuzzy salt crystals growing out of a damp plaster wall surface, like frost.") , ov: { c: "ClStampOv", props: { text: "ES SAL" } } }),
  S(1, "Sal que subió del suelo", "bi", "b_floorline", { q: "rising damp wall", p: BI(`A low view along the bottom of a pale mint-green wall where it meets red terracotta floor tiles, a dark damp band rising from the floor with a white salty edge.`) }),
  S(1, "por adentro del ladrillo", "bi", "b_brickwet", { p: BI("Extreme close view of a broken piece of old red brick, dark and wet on its lower half with white salt crystals on its surface.") }),
  // ── Doña Marta y las 2 pintadas
  S(2, "", "bi", "b_salaw", { p: BI(`${SALA}, seen from the door: the bottom of the wall on the patio side blistered and stained white.`) }),
  S(2, "de Doña Marta", "bi", "b_martaglasses", { p: BI(`${MARTA} bending down with her reading glasses on to look closely at the blistered bottom of her living-room wall, one hand on her knee.`) }),
  S(2, "El mismo pintor", "bi", "b_painterglossy", { p: BI(`${PAINTER} rolling glossy waterproof paint over the bottom of a blistered living-room wall.`), anim: "the roller rolls over the bottom of the wall" }),
  C(2, "dos veces el año pasado", "ClNotebook", { title: "El pintor", rows: [{ k: "Marzo", v: "impermeable" }, { k: "Agosto", v: "esmalte" }], strike: true, mark: "✗", note: "se infló las dos veces" }),
  S(2, "Las dos veces, a los tres meses", "bi", "b_calendar3", { p: BI("A paper wall calendar hanging in an old kitchen with two months circled in pen and a little drawing of a paint roller on each.") }),
  S(2, "como ampollas", "bi", "b_ampollas", { p: BI(`${WALLB}, seen at an angle with side light so every blister throws a shadow.`) }),
  // ── el loop del patio
  S(3, "", "bi", "b_backdoor", { p: BI("The back door of an old house open onto a small sunny patio with potted plants, a clothesline and an old brick planter against the wall.") }),
  S(3, "del otro lado de esa pared", "bi", "b_patioside", { p: BI("The outside of an old house wall seen from a small sunny patio, a brick planter with rose bushes against it and a rain downspout above.") }),
  S(3, "eso no lo esperaba", "cl", "c_planter", { p: CLP(`He crouches in a small patio beside ${PLANTER}, pushing his hand into the soil against the wall, looking up at the camera with raised eyebrows.`) }),
  // ── la promesa
  S(4, "", "av", ""),
  S(4, "cómo se arregla de verdad", "bi", "b_wallprep", { p: BI("A bucket, a mason's trowel, a wooden float and a wire brush laid out on a drop cloth in front of the blistered bottom of a pale mint-green living-room wall.") }),
  S(4, "Un cepillo de alambre", "bi", "st_wirebrush", { q: "wire brush", p: BI("A wire brush with a wooden handle lying on a workbench.") }),
  S(4, "una bolsa de cemento", "bi", "b_cementbag", { q: "cement bags sand", p: BI("A paper bag of cement and a bag of fine sand leaning against a wall of a small patio next to a bucket and a mason's trowel.") }),
  S(4, "y un líquido que se le pone al agua de la mezcla", "bi", "b_additive", { p: BI(`Close view of ${H} pouring a white liquid additive from a plastic jug with a plain blank label into a bucket of water.`) }),
  S(4, "Así estaba la pared", "cl", "c_before", { p: CLP(`He stands in ${SALA} pointing down at the blistered bottom of the wall with white salt on it, frowning at the camera.`), ov: { c: "ClChip", props: { text: "Antes", alert: true } } }),
  S(4, "Y así va a quedar", "cl", "c_glimpse3", { p: CLP(`He kneels in ${SALA} smoothing a fresh gray cement render at the bottom of the wall with a wooden float, his body hiding most of it, glancing back at the camera with a small smile.`), ov: { c: "ClChip", props: { text: "Después" } } }),
  // ── credibilidad + la prueba del lápiz
  S(5, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de albañil" } } }),
  S(5, "Treinta años de albañil", "bi", "b_tools2", { q: "mason tools", p: BI("A worn mason's tool bag on a red tile floor with a steel trowel, a wooden float, a spirit level, a wire brush and a yellow tape measure.") }),
  S(5, "miles de paredes", "bi", "b_trowelslap", { p: BI(`Close view of ${H} throwing a scoop of fresh mortar onto a bare brick wall with a mason's trowel, mortar splattering.`) }),
  S(5, "Y al final le doy", "av", ""),
  S(5, "la prueba de cero dólares", "bi", "b_pencil", { p: BI(`Close view of ${H} holding a carpenter's pencil against a pale mint-green wall right at the top edge of a damp stain.`), ov: { c: "ClChip", props: { text: "$0" } } }),
  S(5, "antes de tocar cualquier pared con humedad", "bi", "b_dampwall2", { p: BI("The bottom of a painted wall in an ordinary home with a dark damp band and white salt marks above the skirting board, a chair nearby.") }),
  S(5, "Cinco segundos, con un lápiz", "bi", "b_pencilline", { p: BI("Extreme close view of a pencil line drawn along the top edge of a damp gray stain on a painted wall, a date written beside it in pencil.") }),
  C(6, "", "ClChapter", { n: 1, title: "¿Es su humedad?", sub: "las 3 señas" }),
  // ── el video del calor
  C(7, "", "ClVideoRef", { thumb: I + "th_alfresco.jpg", title: "El cuarto de arriba, sin aire" }),
  S(7, "se lo dejo acá", "av", ""),
  S(7, "Esa noche, cuando bajé a abrir la ventana", "bi", "b_nightstairs", { p: BI("A narrow old concrete staircase at night lit by a single bulb, leading down into a dark living room with a barred window.") }),
  S(7, "encontré esta pared", "bi", "b_flashwall2", { p: BI(`${WALLB} lit only by a flashlight beam at night.`) }),
  // ── la sala
  S(8, "", "bi", "b_salawarm", { p: BI(`${SALA} in warm afternoon light, nobody in it, the old armchair by the window.`) }),
  S(8, "el sillón de Don Ernesto", "bi", "b_armchair", { p: BI("An old worn brown leather armchair with a crocheted cushion and a folded newspaper on it, beside a small side table with reading glasses, in an old living room.") }),
  S(8, "la vitrina con las tazas de porcelana", "bi", "b_cabinet", { q: "china cabinet cups", p: BI("An old glass cabinet with flowered porcelain cups and saucers on its shelves in an old living room.") }),
  S(8, "Y la pared del lado del patio", "bi", "b_wallside", { p: BI(`${WALLB}, seen next to the barred window that looks onto the patio.`) }),
  S(9, "", "bi", "b_scrape", { q: "scraping paint wall", p: BI(`${PAINTER} scraping loose blistered paint off the bottom of a living-room wall with a putty knife, flakes falling.`) }),
  S(9, "le pasó una mano de pintura impermeable", "bi", "b_glossycan", { p: BI("An open can of glossy waterproof paint with a plain blank label next to a roller tray on a drop cloth on a red tile floor.") }),
  S(9, "A los tres meses, las ampollas", "bi", "b_glossyblisters", { p: BI("Glossy painted wall bottom with new shiny blisters swelling up in a row above the skirting board.") }),
  S(10, "", "av", ""),
  S(10, "dos manos de esmalte", "bi", "b_enamel", { p: BI(`${PAINTER} brushing shiny enamel paint onto the bottom of a living-room wall.`) }),
  S(10, "y la pintura se caía en pedazos", "kf", "k_flake", { p: BI(`Close view of a large blister of glossy paint on the bottom of a wall with white powder behind it.`), d1: "the swollen paint blister bulges", d2: "the paint skin peels and a piece falls off with white powder", sound: "dry paint cracking and falling" }),
  S(11, "", "bi", "b_martasofa", { p: BI(`${MARTA} sitting on the edge of the old armchair in her living room, hands on her knees, looking at the blistered wall with a worried face.`) }),
  S(11, "Pero la pared tiene arreglo", "av", ""),
  // ── las 3 humedades
  C(12, "", "ClThreeDamp", { pick: -1 }),
  S(13, "", "bi", "b_moldcorner", { p: BI(`The top corner of a bedroom wall painted pale mint green with a band of black mold along the ceiling.`) }),
  S(14, "", "bi", "b_rainceiling", { q: "ceiling water stain", p: BI("A brown water stain on a white ceiling near a wall during a rainstorm, rain streaking the window.") }),
  S(15, "", "av", ""),
  C(16, "", "ClThreeDamp", { pick: 2 }),
  S(16, "Dos: la pintura se infla en ampollas", "bi", "b_blisterrow", { p: BI(`Close view of a row of paint blisters along ${WALLB}.`) }),
  S(16, "Y tres: aparece ese polvito blanco", "bi", "b_saltfloor", { p: BI("White salty powder fallen on red terracotta floor tiles along the foot of a painted wall, like spilled sugar.") }),
  S(17, "", "kf", "k_sugar", { p: BI("Extreme close view of a white sugar cube held by fingers with its corner touching the surface of black coffee in a white cup.") , d1: "the corner of the sugar cube touches the coffee", d2: "the brown coffee climbs up through the white sugar cube", sound: "a quiet kitchen, a spoon on a saucer" }),
  C(17, "el agua del suelo sube por ellos", "ClWickWall", { mode: "rise" }),
  S(18, "", "bi", "b_saltcrystals", { q: "peeling paint close up", p: BI("Extreme close view of needle-like white salt crystals pushing a thin skin of paint off a plaster wall.") }),
  S(18, "Por eso las ampollas", "av", ""),
  // ── el error del pintor (mención 1)
  C(19, "", "ClWickWall", { mode: "trap" }),
  S(20, "", "av", ""),
  S(20, "en la ferretería, nunca pida algo para la humedad", "bi", "st_hardware", { q: "hardware store paint aisle", p: BI("A paint aisle in an ordinary neighborhood hardware store with shelves of paint cans.") }),
  S(20, "En el Manual le dejé la frase exacta", "av", "", { ov: { c: "ClChip", props: { text: "Manual · pág. 11" } } }),
  // ── el patio: la jardinera de Don Ernesto + la canaleta
  S(21, "", "bi", "b_patio", { q: "small patio plants house", p: BI(`A small sunny patio of an old house with potted plants and a clothesline, and ${PLANTER}.`) }),
  S(21, "había una jardinera de ladrillos llena de tierra", "bi", "b_planter", { p: BI(`${PLANTER}, seen close from the side so the soil level is clearly higher than the doorstep of the house.`) }),
  C(21, "La tierra de la jardinera estaba más alta", "ClWickWall", { mode: "planter" }),
  S(22, "", "bi", "b_roses", { q: "pink roses bush", p: BI("Close view of old pink rose bushes in full bloom in a brick planter against a house wall, sunlight.") }),
  S(22, "Ella los regaba todas las tardes", "bi", "b_watering", { p: BI(`${MARTA} watering rose bushes in a brick planter against her house wall with an old metal watering can, late afternoon.`), anim: "water pours from the watering can onto the roses" }),
  S(23, "", "bi", "b_ernestophoto", { p: BI("An old color photograph from the nineteen-eighties of a smiling Latin American man in a white shirt laying bricks to build a planter in a small patio, slightly faded.") }),
  S(23, "desde el sillón de la sala", "bi", "b_armchairview", { p: BI("The view from an old armchair in a living room through a barred window to pink roses in a patio outside.") }),
  S(24, "", "bi", "b_downspout", { q: "downspout house wall", p: BI("A metal rain gutter downspout coming down the outside wall of an old house and ending right at the foot of the wall above a brick planter, a dark wet stain on the wall below it.") }),
  S(24, "Cada lluvia", "bi", "st_rainspout", { q: "rain gutter downspout water", p: BI("Rain water pouring out of a downspout onto the ground during a storm.") }),
  S(25, "", "bi", "b_martamouth", { p: BI(`${MARTA} in her patio covering her mouth with her hand, looking at the brick planter with the roses, moved.`) }),
  S(25, "Pero se mudan", "av", ""),
];
