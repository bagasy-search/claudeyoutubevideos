// DIRECTOR B — fuagua: por qué volvieron (la mochila, los huevos, 1 de 50, la regla de las 3 cosas) + el arreglo paso a paso (limpiar atrás,
// la botella 500 ml + 1 gota, rociar / camino / donde comen 5 min / el plato de Bruno / cada 2-3 días; mención 2 pág. 9) + el cebo LEJOS y
// SEGURO (tapita cerrada, ni Mateo ni Bruno) + bicho por bicho (párrafos 29-57).
import { S, BI, CLP, BOTTLE, LUCIA, JORGE, KIDS, DOG } from "../claudio/lib.mjs";
import { H, HG, KITCHEN, BEHIND, SPRAYER, MOCHILA, ROACHES } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fuagua/";
const ROACH1 = ROACHES.replace("cockroaches", "cockroach");
export const SHOTS = [
  C(29, "", "ClChapter", { n: 4, title: "Por qué volvieron", sub: "dos fumigaciones, mismo error", alert: true }),
  // ── la mochila
  S(30, "", "bi", "st_spraybase", { q: "pest control baseboard spray", p: BI(`${MOCHILA} spraying a white baseboard in a kitchen corner.`) }),
  S(30, "Pero no movió el refrigerador", "bi", "b_fridgewall", { q: "refrigerator against wall", p: BI(`${KITCHEN}: the older white refrigerator pushed tight against the wall, a strip of dust along its side.`) }),
  S(30, "Las que estaban adentro del motor", "bi", "b_motor2", { q: "refrigerator coils back", p: BI(`Extreme close view of ${ROACHES} hiding between the warm black coils at the back of a refrigerator.`) }),
  // ── los huevos
  S(31, "", "bi", "st_ootheca", { q: "cockroach egg", p: BI("Extreme close view of a brown cockroach egg case with its segmented ridges on a dark kitchen floor.") }),
  S(31, "El aerosol no la atraviesa", "bi", "k_eggspray", { p: BI("Extreme close view of a brown cockroach egg case on a tile, a fine mist of spray landing on it."), d1: "a fine mist lands on the egg case", d2: "the droplets bead up and roll off the hard shell", sound: "a soft aerosol hiss" }),
  S(31, "dos o tres semanas después", "bi", "st_nymphs", { q: "baby cockroaches", p: BI(`Tiny pale newborn cockroaches next to an empty split egg case in a crack of a kitchen cabinet.`) }),
  C(31, "justo a las tres semanas", "ClNotebook", { title: "Las fumigaciones", rows: [{ k: "1ª fumig.", v: "día 0" }, { k: "Volvieron", v: "día 21" }, { k: "2ª fumig.", v: "día 0" }, { k: "Volvieron", v: "día 21" }], note: "nacen los huevos" }),
  // ── 1 de 50
  C(32, "", "ClHidden50", { hidden: 50 }),
  S(32, "como sacar agua de un barco con agujero", "bi", "st_bail", { q: "bailing water boat", p: BI("An old man bailing water out of a small wooden rowboat with a plastic bucket, water still coming in.") }),
  // ── la regla
  S(33, "", "av", ""),
  C(33, "comida, agua y un escondite", "ClCheck", { title: "Lo que vienen a buscar", items: ["Comida", "Agua", "Un escondite"], fast: true }),
  S(33, "ningún veneno alcanza", "av", ""),
  C(34, "", "ClChapter", { n: 5, title: "El arreglo", sub: "en la cocina de los Ramírez" }),
  // ── limpiar atrás
  S(35, "", "bi", "b_gloves", { q: "woman putting on rubber gloves", p: BI(`${LUCIA} pulling on yellow rubber gloves in her kitchen at night, the refrigerator pulled aside behind her.`) }),
  S(35, "Vaciamos la bandeja", "kf", "k_tray", { p: BI(`Close view of ${HG} lifting a plastic refrigerator drip tray full of dirty water off the floor.`), d1: "the gloved hands lift the drip tray", d2: "the dirty water is poured into a bucket", sound: "water pouring into a plastic bucket" }),
  S(35, "juntamos las croquetas y las cápsulas con papel", "bi", "b_paper", { q: "paper towel cleaning floor", p: BI(`Close view of ${HG} picking up dog kibble and brown egg cases from a tiled floor with a wad of paper towel.`) }),
  S(35, "Nada de barrer en seco", "bi", "b_bag", { q: "garbage bag tied", p: BI(`A tied plastic garbage bag on the floor beside an open back door to a patio at night.`), ov: { c: "ClChip", props: { text: "Nunca en seco", alert: true } } }),
  // ── la botella
  S(36, "", "bi", "k_fill", { p: BI(`Close view of ${H} pouring a brown plastic bottle of hydrogen peroxide into ${SPRAYER.replace("filled with clear liquid, ", "")} on a granite counter.`), d1: "the hydrogen peroxide pours into the empty spray bottle", d2: "the spray bottle is full", sound: "liquid pouring into a plastic bottle" }),
  C(36, "Una botella de quinientos mililitros", "ClMeasureCup", { fill: 1, label: "500 ml", where: "pura, sin rebajar" }),
  S(36, "Y una sola gota de detergente de platos", "bi", "b_drop", { q: "dish soap bottle", p: BI(`Extreme close view of a single drop of green dish soap falling from a squeeze bottle into the neck of ${SPRAYER}.`), ov: { c: "ClChip", props: { text: "1 gota" } } }),
  S(37, "", "bi", "st_roachmacro", { q: "cockroach macro", p: BI(`Extreme close view of a ${ROACH1} with a shiny waxy body on a white tile.`) }),
  S(37, "el agua sola le resbala", "bi", "b_bead", { p: BI(`Extreme close view of water droplets beading on the shiny back of a ${ROACH1} without wetting it.`) }),
  S(37, "Con la gota, la moja de verdad", "cl", "c_shake", { p: CLP(`He shakes a white spray bottle gently in his kitchen, the cap closed, looking at it.`) }),
  // ── paso 1
  C(38, "", "ClChapter", { n: 1, label: "PASO", title: "Lo que ves", sub: "bien mojadas" }),
  S(38, "Ésas sí", "cl", "c_spray2", { p: CLP(`He sprays a white spray bottle directly at a line of small ants on a kitchen counter, leaning close.`) }),
  // ── paso 2
  C(39, "", "ClChapter", { n: 2, label: "PASO", title: "El camino", sub: "el que nadie hace" }),
  S(39, "El zócalo", "bi", "b_baseboard", { q: "spraying baseboard", p: BI(`Close view of ${H} spraying a mist along a white tiled kitchen baseboard.`) }),
  S(39, "el borde de la encimera", "bi", "b_counteredge", { q: "spraying kitchen counter", p: BI(`Close view of ${H} spraying the back edge of a speckled gray granite counter where it meets the tiles.`) }),
  S(39, "detrás del fregadero", "bi", "b_sinkback", { q: "spraying kitchen sink", p: BI(`Close view of ${H} spraying behind a stainless kitchen sink faucet against the tiles.`) }),
  S(39, "la pared donde estaban los puntitos negros", "bi", "b_wallspray", { p: BI(`Close view of ${HG} spraying and wiping a white tiled wall near the floor that has tiny black specks.`) }),
  C(39, "Ese olor es el mapa", "ClTrailMap", { mode: "erase" }),
  // ── paso 3
  C(40, "", "ClChapter", { n: 3, label: "PASO", title: "Donde comen", sub: "rociar, 5 minutos, trapo" }),
  S(40, "la grasa de la estufa", "bi", "b_stove", { q: "cleaning gas stove", p: BI(`Close view of ${HG} spraying the greasy enamel around the burners of an old kitchen stove.`) }),
  S(40, "el piso debajo del bote de basura", "bi", "b_bin", { q: "kitchen trash can", p: BI(`A kitchen trash can with a lid moved aside, the dirty tiled floor under it being sprayed by a gloved hand.`) }),
  C(40, "esperas cinco minutos", "ClTimer30", { minutes: 5, label: "5 min", fast: true }),
  S(40, "y pasas el trapo", "kf", "k_wipe", { p: BI(`Close view of ${HG} wiping a sprayed tiled floor with a blue cloth.`), d1: "the gloved hand holds a cloth on the wet floor", d2: "the cloth wipes a clean stripe across the floor", sound: "a cloth wiping a tiled floor" }),
  // ── el plato de Bruno
  S(41, "", "bi", "b_bowlspray", { p: BI(`Close view of ${H} spraying the tiled floor around a steel dog bowl, the bowl itself lifted aside.`) }),
  S(41, "no el plato", "cl", "c_bowl", { p: CLP(`He holds a steel dog bowl up in one hand and a spray bottle in the other in a kitchen, ${DOG} looking up at him.`), ov: { c: "ClChip", props: { text: "El plato, no", alert: true } } }),
  S(41, "trapo con agua limpia", "bi", "b_rinse", { q: "wiping floor cloth", p: BI(`Close view of a hand wiping the tiled floor around a dog bowl with a damp cloth, a bucket of clean water beside it.`) }),
  S(41, "para que Bruno no lama nada", "bi", "b_brunowait", { q: "dog waiting door", p: BI(`${DOG} sitting patiently in the kitchen doorway waiting, ears up.`) }),
  // ── paso 4
  C(42, "", "ClChapter", { n: 4, label: "PASO", title: "Cada 2 o 3 días", sub: "durante 2 semanas" }),
  S(42, "A la noche, que es cuando salen", "bi", "st_nightkitchen", { q: "kitchen at night", p: BI(`Night, ${KITCHEN} with only the light above the stove on.`) }),
  S(42, "los huevos que quedaron van a seguir naciendo", "bi", "b_hatch", { p: BI(`Extreme close view of tiny pale newborn cockroaches coming out of a split brown egg case in a dark crack.`) }),
  // ── mención 2 (pág. 9)
  C(43, "", "ClBookPage", { page: I + "page9.jpg", pageNo: 9, stamp: "Las medidas, en la página" }),
  S(43, "Lucía la pegó adentro de la puerta del mueble", "bi", "b_taped", { q: "paper taped cabinet door", p: BI("A printed page taped inside the door of a wooden kitchen cabinet next to spice jars.") }),
  C(44, "", "ClChapter", { n: 6, title: "La otra mitad", sub: "lo que mata el nido" }),
  // ── el cebo
  S(45, "", "av", ""),
  S(45, "comida con un veneno lento", "bi", "st_bait", { q: "cockroach bait station", p: BI("A small plastic bait station on a kitchen floor tucked against the wall behind a cabinet.") }),
  S(45, "vuelve al escondite, y lo reparte", "bi", "b_crackback", { q: "crack wall cabinet", p: BI(`Extreme close view of a ${ROACH1} disappearing into a crack between a cabinet and the wall.`) }),
  S(46, "", "bi", "b_mix", { q: "mixing flour sugar bowl", p: BI(`Close view of ${HG} mixing white powder, flour and sugar in a small glass bowl on a counter, a small bag of white powder with a plain label beside it.`) }),
  S(46, "La receta completa te la muestro en otro video", "av", ""),
  S(46, "dos reglas que no se negocian", "av", ""),
  C(47, "", "ClTrailMap", { mode: "bait" }),
  S(47, "Rocía el paso, y deja el escondite tranquilo", "av", ""),
  S(48, "", "av", ""),
  S(48, "no se comen", "bi", "b_highshelf", { q: "kitchen cabinet top shelf", p: BI("A small bag of white powder with a plain label stored on the highest shelf of a kitchen cabinet, out of reach.") , ov: { c: "ClStampOv", props: { text: "NO SE COME" } } }),
  S(48, "adentro de una tapita cerrada con un agujerito", "kf", "k_cap", { p: BI(`Close view of ${HG} pressing a small closed plastic cap with a tiny hole in its side, white bait balls visible inside, against the floor.`), d1: "the gloved hand holds the small closed cap", d2: "the cap is placed on the floor against the wall behind a refrigerator", sound: "a small plastic cap set down on tile" }),
  S(48, "donde ni Mateo ni Bruno llegan", "bi", "b_mateobruno", { p: BI(`${KIDS.split(", and ")[1].replace("Mateo, ", "Mateo, ")} kneeling on the kitchen floor petting ${DOG}, the refrigerator pushed back against the wall behind them.`) }),
  S(48, "Nunca en el piso a la vista", "cl", "c_safe", { p: CLP(`He kneels behind a refrigerator pulled from the wall placing a small closed bait cap on the floor against the wall, ${DOG} kept back in the doorway.`) }),
  S(48, "Y te lavas las manos después", "bi", "b_wash", { q: "washing hands soap sink", p: BI(`Close view of a man's hands washing with soap under the tap of a stainless kitchen sink.`) }),
  S(49, "", "cl", "c_push", { p: CLP(`He and ${JORGE} push an older white refrigerator back toward the kitchen wall.`) }),
  S(49, "Jorge la vacía los domingos", "bi", "b_jorgetray", { p: BI(`${JORGE} kneeling and pulling out the plastic drip tray from under a refrigerator, a phone alarm on the floor showing a reminder.`) }),
  C(50, "", "ClChapter", { n: 7, title: "Bicho por bicho", sub: "qué le hace y qué no" }),
  // ── bicho por bicho
  S(51, "", "bi", "st_german2", { q: "german cockroach", p: BI(`A ${ROACH1} on a kitchen tile.`) , ov: { c: "ClChip", props: { text: "Alemana · sí, mojada" } } }),
  S(51, "Agua oxigenada en el camino, cebo en el escondite", "av", ""),
  S(52, "", "bi", "st_bigroach", { q: "american cockroach drain", p: BI("A large reddish-brown American cockroach climbing out of a floor drain.") , ov: { c: "ClChip", props: { text: "Grande · cuesta más" } } }),
  S(52, "Ésas vienen de afuera", "bi", "b_doorgap", { q: "light under door", p: BI("The gap under a back patio door seen from inside a kitchen at floor level, a line of light under it.") }),
  S(53, "", "bi", "st_ants2", { q: "ants kitchen", p: BI("A line of small black ants on a kitchen windowsill.") , ov: { c: "ClChip", props: { text: "Hormigas · donde mejor anda" } } }),
  S(53, "las que ves son las obreras", "bi", "st_antsfood", { q: "ants carrying food", p: BI("Extreme close view of small black ants carrying sugar crystals.") }),
  S(53, "le toca el cebo de bórax", "bi", "b_boraxcap", { p: BI("A small closed plastic bait cap with a tiny hole tucked behind a kitchen appliance against the wall.") , ov: { c: "ClChip", props: { text: "Lejos de niños y perro", alert: true } } }),
  S(54, "", "bi", "st_mouse3", { q: "mouse", p: BI("A house mouse sitting next to a kitchen cabinet at night.") , ov: { c: "ClChip", props: { text: "Ratón · no lo mata", alert: true } } }),
  S(54, "El ratón deja gotitas de orina", "bi", "st_mousewall", { q: "mouse running baseboard", p: BI("A house mouse running along the base of a wall.") }),
  S(54, "y el que viene detrás se pierde", "cl", "c_mousepath", { p: CLP(`He sprays along the bottom of a kitchen wall behind a cabinet, kneeling.`) }),
  S(55, "", "bi", "b_droppings", { q: "mouse droppings", p: BI(`Close view of ${HG} spraying a few mouse droppings on a garage shelf with a white spray bottle.`) , ov: { c: "ClChip", props: { text: "Guantes y mascarilla" } } }),
  C(55, "esperas cinco minutos", "ClTimer30", { minutes: 5, label: "5 min", fast: true }),
  S(55, "Nunca barrer en seco", "bi", "b_broomno", { q: "broom leaning wall", p: BI("A broom leaning unused against a wall next to a roll of paper towels and a white spray bottle on a shelf.") , ov: { c: "ClChip", props: { text: "Nunca barrer en seco", alert: true } } }),
  S(56, "", "bi", "st_spider", { q: "small spider web corner", p: BI("A small spider in a thin web in the upper corner of a kitchen window.") }),
  S(56, "Las telarañas, con la escoba", "bi", "st_aphids", { q: "aphids plant", p: BI("Green aphids on a houseplant stem on a sunny windowsill.") }),
  S(57, "", "bi", "b_dogscratch", { q: "dog scratching", p: BI(`${DOG} scratching behind his ear on the kitchen floor.`) }),
  S(57, "En el piso y en la cama del perro", "bi", "b_dogbed", { q: "dog bed", p: BI(`A gloved hand spraying the floor around an empty dog bed in a corner of a kitchen.`) }),
  S(57, "En el perro, nunca", "av", "", { ov: { c: "ClStampOv", props: { text: "EN EL PERRO, NUNCA" } } }),
];
