// DIRECTOR B — jpbano: productos 4 (flor de baño de plástico), 5 (cepillo del inodoro en su vasito), 6 (aerosol para el moho + mención 2
// "la rutina completa, pág. 14") y 7 (la que casi todos rompemos: el cloro mezclado). Párrafos 22-46 (incluye 8: toallitas).
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH, BOTTLE } from "../claudio/lib.mjs";
import { H, SATOP, HBATH, R } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jpbano/";
export const SHOTS = [
  // ══ 4 · la flor de baño
  C(22, "", "ClRule", R(4, "La flor de baño de plástico", "la que nunca se seca")),
  S(22, "la esponja de malla que cuelga en la ducha", "bi", "b_puff", { q: "shower puff loofah", p: BI(`A pink plastic mesh shower puff hanging wet from a hook on the tiled wall of ${BATH}.`) }),
  C(22, "una esponja que nunca se seca no limpia", "ClSato", { img: SATOP, quote: "Una esponja que nunca se seca no limpia: siembra." }),
  S(23, "", "bi", "b_puffclose", { q: "shower sponge", p: BI("Extreme close view of the folds of an old wet plastic mesh shower puff, soap residue and gray spots inside.") }),
  S(23, "Es lo que crece adentro", "cl", "c_puffsmell", { p: CLP(`He holds a wet pink shower puff at arm's length in ${BATH}, wrinkling his nose.`) }),
  S(24, "", "bi", "b_cottoncloth", { q: "cotton washcloth drying", p: BI(`A cotton washcloth hanging open on a towel rail outside the shower in ${BATH}, drying in the daylight.`) }),
  S(25, "", "bi", "b_jptowel", { q: "japanese bath towel tenugui", p: BI("A long thin cotton bath towel hanging stretched on a rail in a small Japanese bathroom, a window ajar.") }),

  // ══ 5 · el cepillo del inodoro
  C(26, "", "ClRule", R(5, "El cepillo en su vasito", "se seca, no se ahoga")),
  S(26, "Se enjuagaban y se colgaban", "bi", "b_hangbrush", { q: "toilet brush", p: BI(`A toilet brush hanging head-down from a wall hook in ${HBATH}, the floor below dry.`) }),
  S(27, "", "kf", "k_brushcup", { p: BI(`Close view of ${H} lifting a toilet brush out of its closed plastic holder, murky water at the bottom of the holder.`), d1: "the brush is in the closed holder", d2: "the brush is lifted out showing murky water", sound: "a brush lifted out of water" }),
  S(27, "y está escondido en un vaso cerrado", "bi", "b_holderwater", { p: BI("Looking down into an empty toilet brush holder with an inch of murky gray water at the bottom.") }),
  S(28, "", "bi", "b_newbrush", { q: "toilet brush holder", p: BI(`A toilet brush in an open ventilated stand next to a toilet in ${BATH}.`) }),
  S(28, "se apoya entre la tapa y el asiento", "kf", "k_brushdrip", { p: BI(`Close view of a toilet brush resting with its handle trapped between the lid and the seat of a toilet, dripping into the bowl.`), d1: "the brush hangs over the bowl", d2: "drops fall from the brush into the bowl", sound: "water drops into a toilet bowl" }),
  S(29, "", "bi", "b_drytiles", { q: "bathroom floor tiles", p: BI(`The tiled floor beside a toilet in ${HBATH}, perfectly dry, a toilet brush hanging on the wall above.`) }),

  // ══ 6 · el aerosol para el moho (mención 2)
  C(30, "", "ClRule", R(6, "El aerosol para el moho", "se le quita el agua")),
  S(30, "En el hotel se usaba muy poco", "bi", "b_hotelstore", { q: "storage shelves cleaning supplies", p: BI(`A neat storeroom shelf in ${HOTEL} with a few squeegees, folded cloths and only one spray bottle.`) }),
  C(30, "el moho no se mata con un aerosol", "ClSato", { img: SATOP, quote: "El moho no se mata con un aerosol. Se le quita el agua." }),
  S(31, "", "bi", "b_blackgrout", { q: "mold grout bathroom", p: BI(`Black mold spots along the grout lines in a corner of the shower of ${BATH}.`) }),
  S(31, "Es que el baño se queda mojado", "kf", "k_wetwalls", { p: BI(`Close view of drops running down the wet tiled wall of a shower in ${BATH} after a shower, steam in the air.`), d1: "drops cling to the tiles", d2: "the drops run down the wall", sound: "dripping water in a tiled bathroom" }),
  S(31, "Y respiras ese aerosol", "cl", "c_spraycough", { p: CLP(`He sprays an aerosol with a blank label on the shower tiles in a closed small bathroom and turns his face away, eyes squeezed.`) }),
  S(32, "", "kf", "k_squeegeewall", { p: BI(`Close view of ${H} pulling a small rubber squeegee down a wet white tiled shower wall.`), d1: "the squeegee is high on the wet tiles", d2: "the squeegee pulls the water down", sound: "a squeegee on wet tiles" }),
  C(32, "un minuto después de cada ducha", "ClTimer30", { minutes: 1, label: "secador en paredes y vidrio" }),
  S(32, "Y para las juntas grises", "bi", "b_groutpaste", { p: BI("An old toothbrush spreading a white paste of baking soda along gray grout lines between white tiles.") }),
  S(33, "", "bi", "b_jpfamilybath", { q: "japanese bathroom", p: BI("A Japanese home bathroom with a deep tub, a small stool and a squeegee hanging on the wall, all dry.") }),
  // mención 2
  S(34, "", "av", ""),
  C(34, "está en la página catorce", "ClBookPage", { page: I + "x_page14.jpg", pageNo: 14, stamp: "La rutina completa" }),
  S(34, "para que la pegues adentro del mueble del baño", "bi", "b_pagecabinet", { p: BI(`A printed page taped inside the door of a bathroom cabinet in ${BATH}, a squeegee hanging next to it.`) }),

  // ══ 7 · la que casi todos rompemos: el cloro mezclado
  C(35, "", "ClRule", R(7, "El cloro mezclado", "nunca mezclar", { star: true })),
  S(36, "", "bi", "b_ruledoor", { p: BI(`A storeroom door in ${HOTEL} with a single large handwritten sign taped to it, the writing unreadable.`) }),
  C(36, "nunca mezclar productos", "ClSato", { img: SATOP, quote: "Nunca mezclar productos." }),
  S(37, "", "kf", "k_bleachpour", { p: BI(`Close view of a hand pouring bleach from a white bottle with a blank label into a toilet bowl in ${BATH}.`), d1: "the bottle tilts over the bowl", d2: "the bleach pours into the bowl", sound: "liquid poured into a toilet bowl" }),
  S(37, "y encima el limpiador del baño", "bi", "b_secondbottle", { q: "cleaning toilet bottle", p: BI("A hand holding a second cleaning bottle with a blank label over a toilet bowl that already has bleach in it, about to pour.") , ov: { c: "ClStampOv", props: { text: "NO", alert: true } } }),
  S(37, "Y en un baño cerrado", "cl", "c_closedfumes", { p: CLP(`He stands in a closed small bathroom in ${BATH} covering his nose with his forearm, eyes squinting.`) }),
  C(38, "", "ClNeverMix", { a: "Cloro", b: "Nada", verdict: "Nunca" }),
  S(38, "enjuagas con mucha agua y ventilas", "bi", "b_ventilate", { q: "open bathroom window", p: BI(`The window of ${BATH} wide open and the door open, fresh daylight coming in.`) }),
  C(39, "", "ClNeverMix", { a: "Cloro", b: "Ácidos y antisarro", verdict: "Nunca" }),
  S(40, "", "bi", "b_jpwarning", { q: "japanese cleaning product", p: BI("A row of plain cleaning bottles with large red warning blocks on blank labels on a Japanese store shelf, no readable text.") }),
  S(41, "", "bi", "b_fivethings", { q: "baking soda vinegar", p: BI(`Water in a bucket, a cloth, a box of baking soda, a bottle of vinegar and ${BOTTLE}, set apart from each other on a bathroom shelf.`) }),
  S(42, "", "av", "", { ov: { c: "ClChip", props: { text: "Si arde o cuesta respirar: salir, ventilar, consultar a un médico", alert: true } } }),
  S(42, "sal del baño, abre todo", "bi", "b_openall", { q: "open window daylight", p: BI(`The door and the window of ${BATH} both wide open, daylight and fresh air coming in.`) }),
  S(42, "consulta a un médico", "av", ""),

  // ══ 8 · las toallitas
  C(43, "", "ClRule", R(8, "Las toallitas húmedas", "al basurero, no al inodoro")),
  S(43, "Sato-san tenía un basurero chiquito", "bi", "b_smallbin", { q: "small bathroom trash bin", p: BI(`A small lidded trash bin next to the toilet in ${HBATH}.`) }),
  S(44, "", "bi", "b_wipespack", { q: "wet wipes package", p: BI("A pack of wet wipes with a blank label on a bathroom counter, one wipe pulled out.") }),
  S(44, "Se juntan en la cañería con la grasa", "bi", "b_clog", { q: "clogged pipe", p: BI("A section of drain pipe opened on a newspaper, clogged with a tangled mass of wet wipes and grease.") }),
  S(44, "el agua del inodoro sube en vez de bajar", "kf", "k_toiletrise", { p: BI("Close view of the water level slowly rising in a white toilet bowl."), d1: "the water is at the normal level", d2: "the water rises toward the rim", sound: "a gurgling toilet" }),
  S(45, "", "kf", "k_wipebin", { p: BI(`Close view of ${H} dropping a used wet wipe into a small lidded bathroom bin and closing the lid.`), d1: "the wipe is over the bin", d2: "the wipe drops in and the lid closes", sound: "a small bin lid closing" }),
  S(46, "", "bi", "b_plumber", { q: "plumber toilet", p: BI("A plumber kneeling beside a toilet with a plunger and a drain snake, seen from behind.") }),
];
