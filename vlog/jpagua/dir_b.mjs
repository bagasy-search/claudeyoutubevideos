// DIRECTOR B — jpagua: usos 4 (recipientes manchados), 5 (esponja), 6 (desagüe), 7 (la que casi todos hacemos mal: la tabla de cortar,
// darle tiempo), 8 (rejillas de la estufa + mención 2 "la rutina completa, pág. 13") y 9 (la goma del refrigerador). Párrafos 19-39.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH, BOTTLE } from "../claudio/lib.mjs";
import { H, SATOP, KITCHEN, STAFFK, R } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jpagua/";
export const SHOTS = [
  // ══ 4 · recipientes manchados
  C(19, "", "ClRule", R(4, "Los recipientes manchados", "la luz hace la mitad")),
  S(19, "que quedaron naranjas por dentro", "bi", "b_orangetub", { q: "plastic food container", p: BI("Several plastic food containers with orange-stained insides stacked on a kitchen counter.") }),
  S(19, "Sato-san los ponía al sol en la ventana", "bi", "b_tubswindow", { p: BI(`A row of plastic food containers filled with clear liquid sitting on a sunny windowsill in ${STAFFK}.`) }),
  S(20, "", "bi", "b_tomatosauce", { q: "tomato sauce pasta container", p: BI("Leftover pasta with tomato sauce in a plastic food container on a table.") }),
  S(20, "Por eso el detergente no lo saca", "kf", "k_scrubtub", { p: BI(`Close view of ${H} scrubbing the orange inside of a plastic container with a sponge at a sink.`), d1: "the sponge is inside the container", d2: "the sponge scrubs but the stain stays", sound: "a sponge scrubbing plastic" }),
  C(21, "", "ClNumbers", { title: "Los recipientes", rows: [["Llenar con", "agua oxigenada + 1 cda de bicarbonato"], ["La tapa", "apoyada, sin cerrar"], ["Sol", "3 o 4 horas"], ["Después", "lavar como siempre"]], page: 13 }),
  S(21, "Después se lavan", "bi", "b_cleantubs", { q: "plastic containers drying rack", p: BI("Clean clear plastic food containers drying upside down on a rack by a sunny window.") }),

  // ══ 5 · la esponja
  C(22, "", "ClRule", R(5, "La esponja", "lo más sucio de la cocina")),
  S(22, "Siempre mojada, siempre tibia, siempre con comida", "bi", "b_sponge", { q: "dirty kitchen sponge sink", p: BI("A worn wet kitchen sponge lying in a puddle at the bottom of a sink with crumbs around it.") }),
  S(23, "", "kf", "k_spongesoak", { p: BI(`Close view of ${H} pressing a kitchen sponge into a bowl of clear liquid.`), d1: "the sponge floats in the bowl", d2: "the hand pushes the sponge under, bubbles rise", sound: "a sponge squeezed in water" }),
  C(23, "diez minutos en un tazón", "ClTimer30", { minutes: 10, label: "mitad agua oxigenada · mitad agua" }),
  S(23, "Se enjuaga y se deja parada", "bi", "b_spongestand", { q: "kitchen sponge sink", p: BI("A kitchen sponge standing upright on its edge in a small holder next to a sink, drying.") }),
  S(23, "Y en el hotel tenían dos", "bi", "b_twosponges", { q: "sponges kitchen", p: BI(`Two sponges side by side on a steel rack in ${STAFFK}, one dry and one wet.`) }),
  S(24, "", "cl", "c_spongetrash", { p: CLP(`He drops a crumbling old kitchen sponge into a trash bin in ${KITCHEN}, shaking his head.`) }),

  // ══ 6 · el desagüe
  C(25, "", "ClRule", R(6, "El fregadero y su desagüe", "la capa que da el olor")),
  S(25, "Levanta la rejilla del desagüe", "kf", "k_drainlift", { p: BI(`Close view of ${H} lifting the metal strainer basket out of a kitchen sink drain.`), d1: "the fingers touch the strainer", d2: "the strainer is lifted out of the drain", sound: "a metal strainer lifted from a drain" }),
  S(25, "Esa capa que ves ahí", "bi", "b_drainfilm", { q: "kitchen sink drain", p: BI("Close view of a kitchen sink drain opening with a gray slimy film on the inner rim.") }),
  S(26, "", "kf", "k_drainpour", { p: BI(`Close view of hydrogen peroxide poured from ${BOTTLE} into a kitchen sink drain.`), d1: "the bottle tilts over the drain", d2: "the liquid flows into the drain", sound: "liquid poured into a drain" }),
  C(26, "treinta minutos", "ClTimer30", { minutes: 30, label: "y después agua caliente 1 minuto" }),
  S(26, "La rejilla, mientras tanto", "bi", "b_strainerbowl", { q: "sink strainer", p: BI("A metal sink strainer basket soaking in a white bowl of clear liquid on a counter.") }),
  S(27, "", "av", ""),
  S(27, "Ahí ya es trabajo de plomero", "bi", "b_ptrap", { q: "plumber sink pipe", p: BI("The curved drain pipe under a kitchen sink, a plumber's wrench resting on the cabinet floor.") }),

  // ══ 7 · la que casi todos hacemos mal: la tabla, con tiempo
  C(28, "", "ClRule", R(7, "La tabla de cortar", "dale tiempo", { star: true })),
  S(29, "", "bi", "b_satowash", { p: BI(`${SATO} washing a white plastic cutting board with soap and hot water at a steel sink in ${STAFFK}.`) }),
  S(29, "Y se quedó parada al lado, mirando el reloj", "bi", "b_satoclock", { p: BI(`${SATO} standing beside a steel table with a wet cutting board on it, looking at the wall clock, arms crossed.`) }),
  S(29, "Yo no entendía qué estaba esperando", "cl", "c_puzzled", { p: CLP(`He stands in ${STAFFK} wearing a navy housekeeping jacket over his red polo, looking puzzled at someone off frame.`) }),
  S(30, "", "bi", "b_rawchicken", { q: "raw chicken cutting board", p: BI("A white cutting board with raw chicken pieces and a knife on a kitchen counter.") }),
  S(30, "rociamos, pasamos el paño, y listo", "kf", "k_quickwipe", { p: BI(`Close view of ${H} spraying a cutting board and wiping it dry immediately with a paper towel.`), d1: "the board is sprayed", d2: "the towel wipes it at once", sound: "a spray and a quick wipe" }),
  S(30, "Necesita tiempo mojando la superficie", "bi", "b_wetboard", { q: "white cutting board", p: BI("A clean white cutting board fully covered with a wet film of clear liquid, glistening on a counter.") }),
  S(30, "no saca la grasa", "bi", "b_greasyboard", { q: "cutting board meat", p: BI("A greasy cutting board with a shiny film of fat after cutting meat.") }),
  C(31, "", "ClDoDont", { yes: { label: "Lavar, mojar y esperar 5 minutos", img: I + "b_wetboard.jpg" }, no: { label: "Rociar y secar enseguida", img: I + "b_greasyboard.jpg" } }),
  C(31, "y cinco minutos sin tocarla", "ClTimer30", { minutes: 5, label: "sin tocarla" }),
  S(31, "Y la tabla se seca parada, no acostada", "bi", "b_boardstand", { q: "cutting board drying rack", p: BI("A cutting board standing on its edge to dry against the wall behind a kitchen sink.") }),
  S(32, "", "bi", "b_woodboard", { q: "wooden cutting board", p: BI("A wooden cutting board with a few cracks along the grain on a kitchen counter.") }),
  S(32, "Se le echa encima, se espera y se enjuaga", "kf", "k_woodrinse", { p: BI(`Close view of ${H} rinsing a wooden cutting board under a tap.`), d1: "the board is under the tap", d2: "the water rinses the board", sound: "water running over wood" }),
  S(33, "", "cl", "c_walkaway", { p: CLP(`He sprays a kitchen counter, sets ${BOTTLE} down and walks away smiling at the camera in ${KITCHEN}.`) }),
  S(33, "son quejas de apuro", "av", ""),

  // ══ 8 · las rejillas de la estufa (mención 2)
  C(34, "", "ClRule", R(8, "Las rejillas de la estufa", "una pasta, no fuerza")),
  S(34, "con la grasa quemada de meses", "bi", "b_grates", { q: "dirty stove grates", p: BI("Cast iron stove grates crusted with burnt grease on a gas stove.") }),
  S(35, "", "kf", "k_gratepaste", { p: BI(`Close view of ${H} sprinkling baking soda over a greasy cast iron stove grate on newspaper.`), d1: "the grate is dirty", d2: "white powder covers the grate", sound: "powder sprinkled" }),
  S(35, "Al otro día", "bi", "b_grateclean", { q: "cleaning gas stove", p: BI("A clean cast iron stove grate being wiped with a cloth, the grease gone.") }),
  // mención 2
  S(36, "", "av", ""),
  C(36, "está en la página trece", "ClBookPage", { page: I + "x_page13.jpg", pageNo: 13, stamp: "La rutina completa" }),
  S(36, "para que la pegues adentro del mueble de la cocina", "bi", "b_pagecabinet", { p: BI(`A printed page taped inside the door of a kitchen cabinet under the sink in ${KITCHEN}, a brown bottle on the shelf.`) }),

  // ══ 9 · la goma del refrigerador
  C(37, "", "ClRule", R(9, "La goma del refrigerador", "los puntitos negros")),
  S(37, "pasa un dedo por los pliegues de esa goma", "kf", "k_fridgeseal", { p: BI(`Close view of ${H} running a finger along the folds of a white refrigerator door rubber seal with black specks.`), d1: "the finger touches the seal", d2: "the finger opens the fold showing black specks", sound: "a fridge door seal opening" }),
  S(37, "Esos puntitos negros son moho", "bi", "b_sealmold", { q: "refrigerator door seal", p: BI("Extreme close view of a white refrigerator door seal fold with small black mold specks.") }),
  S(38, "", "bi", "b_sealwipe", { q: "cleaning refrigerator", p: BI(`A hand with a cloth wiping inside the folds of a refrigerator door seal in ${KITCHEN}.`) }),
  S(38, "Después se seca con una toalla", "bi", "b_sealdry", { q: "cleaning refrigerator door", p: BI("A hand drying a refrigerator door rubber seal with a towel.") }),
  S(39, "", "bi", "b_fridgeshelves", { q: "cleaning empty refrigerator", p: BI("An empty refrigerator with its glass shelves being sprayed and wiped dry.") }),
];
