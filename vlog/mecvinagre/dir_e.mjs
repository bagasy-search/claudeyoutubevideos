// DIRECTOR E — mecvinagre: tomas EXTRA de ritmo (minuto 1 ≥ 33 cortes, planos largos partidos en la frase que se dice; stock donde es
// genérico) + Claudio vuelve a cámara (avatar ~25 %).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { BAY, RES, RAD, GAUGE, VIN, DIST, JAR, STATION } from "./dir_a.mjs";
const NB = "a small worn blue notebook with rounded corners";
const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const SHOTS = [
  // ── minuto 1
  B(1, "en pleno tráfico", "st_traffic2", "Ordinary city traffic with cars stopped at a light on a hot afternoon.", { q: "city traffic" }),
  B(1, "No hasta el rojo, pero más arriba que nunca", "b_gaugeup", `Extreme close view of the temperature gauge of ${GAUGE}, the needle clearly above the middle but below the red zone.`),
  B(1, "en una gasolinera", "st_gasstation", "An ordinary gas station forecourt in the afternoon.", { q: "gas station" }),
  B(2, "cambiar el radiador", "b_radfront", `Close view of the front grille of ${CAR} with the radiator visible behind it.`),
  B(2, "una advertencia", "b_glassespaper", "Extreme close view of a pair of reading glasses on a beaded chain resting on a printed dealership quote, nothing legible."),
  B(2, "si el motor se sigue calentando", "st_overheat", "Steam coming out from under the hood of a car stopped on a street.", { q: "car overheating steam" }),
  B(2, "esperando", "b_folderdrawer", `Close view of a worn blue plastic folder of car papers lying in an open kitchen drawer in ${ELENA}'s house.`),
  B(3, "tiene que ver con algo que alguien le hizo al auto", "b_carportold", `${CAR} parked in ${DRIVE}, evening, a garden hose lying on the cement next to its front wheel.`),
  B(3, "hace años", "b_oldphoto", `Close view of an old faded printed family photo held by ${EH}: a smiling gray-haired man in his sixties standing proudly next to a new silver sedan.`),
  B(0, "Un frasco de vinagre de la cocina", "b_vinkitchen2", `Extreme close view of ${EH} taking ${VIN} out of a kitchen cupboard.`),
  B(2, "en la carpeta del auto", "b_folderclose", `Close view of ${EH} closing a worn blue plastic folder of car papers on a kitchen table.`),
  B(3, "también lo hicieron", "st_hosecar2", "A green garden hose spraying water onto a driveway.", { q: "garden hose" }),
  B(2, "un papel", "b_paperhand", `Close view of a dealership service advisor's hand handing a printed quote across a counter to ${EH}, no legible numbers.`),
  // ── resto: planos largos partidos
  B(8, "parada al lado con el celular en la mano", "b_phonehand", `Close view of ${EH} holding an old smartphone, ${CAR} blurred-free behind her at a gas station.`),
  B(9, "está a más de cien grados y a presión", "b_hotengine", `Close view of the engine bay of ${CAR} right after stopping, heat shimmer above it.`),
  B(10, "con un café de la máquina", "st_coffeemachine", "A coffee machine pouring coffee into a paper cup.", { q: "coffee machine cup" }),
  B(11, "ese recipiente de plástico al costado del radiador", "b_resside", `Close view of ${RES} next to the radiator in the engine bay of ${CAR}, ${H} pointing at it.`),
  B(13, "más finos que un lápiz", "b_pencil", `Extreme close view of a yellow pencil held by ${H} next to the thin flat tubes of a cut-open radiator core on a workbench.`),
  B(15, "que es cara", "st_engineshop", "An engine being taken apart on a stand in a repair shop.", { q: "engine repair" }),
  B(16, "abres el depósito y arrancas", "b_startkey", `Close view of ${H} turning the ignition key of ${CABIN}.`),
  B(19, "que revisen la junta", "st_mechanic5", "A mechanic inspecting an engine with a flashlight.", { q: "mechanic inspecting engine" }),
  B(22, "y el refrigerante que pide tu auto", "b_coolantcounter", "A plain jug of green coolant with a blank label set on the counter of an auto parts store."),
  B(26, "la que encontramos en la guantera", "b_glovebox", `Close view of ${EH} taking ${NB} out of the open glovebox of ${CABIN}.`),
  B(29, "y que el metal de adentro no se oxide", "b_rustinside", "Extreme close view of rust and scale inside an old engine water outlet."),
  B(41, "Una parte de vinagre blanco por cuatro de agua destilada", "b_vinmeasure", `Close view of ${H} pouring white vinegar from ${VIN} into a clear measuring jug up to the first line.`),
  B(43, "mirando la aguja", "b_gaugewatch", `Extreme close view of the temperature gauge of ${GAUGE}, the needle in the middle, the engine running.`),
  B(55, "Si es listo para usar, va tal cual", "st_coolantpour", "Green coolant poured from a jug into a radiator.", { q: "pouring coolant" }),
  B(70, "con el mismo tráfico", "st_traffic3", "City traffic on a wide avenue on a sunny afternoon.", { q: "city traffic avenue" }),
  B(74, "un cartón debajo del motor antes de dormir", "b_cardunder", `Evening, a flattened cardboard sheet under the engine of ${CAR} in ${DRIVE}.`),
  B(76, "Arrancas y miras qué luces quedan prendidas", "st_dashboard", "A car dashboard with warning lights on at engine start.", { q: "car dashboard warning lights" }),
  // ── Claudio vuelve a cámara (avatar ~25 %)
  ...[[12, "cuando se calienta una y otra vez"], [13, "Sobre todo en el tráfico"], [17, "Un poco de vapor en una mañana fría es normal"], [18, "el refrigerante se está mezclando con el aceite"], [19, "Si ves cualquiera de esas tres cosas"],
      [23, "Y el refrigerante, del mismo tipo"], [26, "Y ahí estaba"], [38, "Abajo, a un costado"], [40, "Y el refrigerante viejo no se tira"],
      [42, "Paso tres"], [47, "El sarro de siete años"], [51, "Paso cinco"], [57, "Con el tapón del depósito abierto"], [58, "Después apagas, tapas"], [61, "Uno: poner vinagre puro"], [71, "Y algo que no esperaba"], [37, "Lo ideal es a la mañana"], [39, "Ella lo miró y dijo"], [49, "quedó casi transparente"], [52, "Adentro no puede quedar vinagre"], [56, "Al vaciar"], [59, "La fecha, los kilómetros"], [67, "A veces sí"], [68, "Lo más caro es el refrigerante"], [44, "esperas que se enfríe del todo"], [27, "Después de que él falleció"], [10, "En la agencia le habían dicho"], [72, "como un recuerdo"], [78, "El sábado Elena me llamó"], [53, "El de Elena, al segundo"]]
    .map(([p, a]) => S(p, a, "av", "")),
];
