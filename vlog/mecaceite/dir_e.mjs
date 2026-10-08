// DIRECTOR E — mecaceite: tomas EXTRA de ritmo (minuto 1 ≥ 33 cortes, planos largos partidos en la frase que se dice; stock donde es
// genérico) + Claudio vuelve a cámara (avatar ~25 %).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { BAY, GAUGE, DIP, LUBE, JUG, PLUG, FILTER } from "./dir_a.mjs";
const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const SHOTS = [
  // ── minuto 1
  B(0, "de matar un motor", "st_smokeengine", "Smoke coming from the engine bay of a car with the hood open.", { q: "car engine smoke" }),
  B(1, "a uno de esos lugares", "b_lubefront", `The front of ${LUBE} seen from the street, one car in the bay.`),
  B(1, "Barato, rápido", "b_cashpay", `Close view of ${EH} handing a few banknotes across the small counter of a quick-lube shop.`),
  B(1, "en la sala de espera", "b_coffeecup", "Extreme close view of a paper cup of coffee from a machine on a small plastic table in a waiting room."),
  B(2, "pasé por su casa", "b_arrivedrive", `The green metal gate of ${DRIVE} opening, ${CAR} parked inside.`),
  B(2, "Y debajo del auto", "b_underview", `Low view under the front of an old car parked on a cement floor: the gray metal oil pan and the blue oil filter visible, a flashlight beam on them.`),
  B(2, "en el tapón de abajo", "b_plugview", `Low close view of ${PLUG} with a wet oily ring around it.`),
  B(3, "si se prende", "b_lightflick", `Extreme close view of ${GAUGE} as a red warning light comes on.`),
  B(3, "después de un cambio de aceite", "st_lubebay2", "A car in an oil change service bay.", { q: "car service bay" }),
  B(3, "porque casi nadie sabe qué hacer cuando aparece", "b_confused", `${ELENA} at the wheel of ${CAR} looking down at the dashboard with a confused, worried face.`),
  B(4, "los nueve errores", "b_jugs", `Plain motor oil jugs and a new oil filter lined up on the workbench of ${SHOP}.`),
  B(4, "después de cambiar el aceite", "st_oilchange4", "A mechanic draining old oil from under a car.", { q: "draining engine oil" }),
  B(4, "antes de irme", "b_flashunder2", `Low view of a flashlight beam pointing under the front of ${CAR}.`),
  // ── resto
  B(9, "lo vuelve a poner a mano", "b_pourfunnel", `Close view of a quick-lube technician pouring oil from ${JUG} through a funnel into an engine.`),
  B(12, "Para leer la varilla bien hay dos condiciones", "b_flatcar", `${CAR} parked on the flat cement floor of ${DRIVE} with the hood open, morning.`),
  B(17, "por ejemplo cero W veinte", "b_label020", `Extreme close view of ${H} holding ${JUG} showing its back label, nothing legible.`, { q: "motor oil bottle" }),
  B(21, "Abajo del motor gira una pieza muy pesada", "st_crankshaft", "A car crankshaft on a workbench.", { q: "engine crankshaft" }),
  B(26, "Son esos números", "st_oilshelf", "Motor oil bottles on a store shelf.", { q: "motor oil shelf" }),
  B(30, "El filtro de aceite tiene una goma redonda", "b_filtergasket", `Extreme close view of the black rubber gasket ring on the base of ${FILTER}.`, { q: "oil filter" }),
  B(37, "Después del cambio", "st_oilcap", "A hand screwing the oil filler cap onto an engine.", { q: "engine oil cap" }),
  B(41, "Esa luz no dice que el aceite está viejo", "b_oldoil", `Extreme close view of ${DIP} with dark brown oil.`),
  B(45, "La primera: que te reseteen el aviso de servicio", "st_dashservice", "A car instrument cluster with a service reminder.", { q: "car instrument cluster" }),
  B(53, "El aceite se cambia por kilómetros o por tiempo", "st_odometer", "A car odometer counting up.", { q: "car odometer" }),
  // ── Claudio vuelve a cámara
  ...[[14, "El aceite tiene que estar entre las dos"], [20, "Es el de Elena"], [22, "Además, el aceite de más hace presión"], [26, "El primero dice qué tan bien fluye en frío"], [27, "Ésta casi nadie la conoce"], [30, "Antes de enroscarlo"],
      [34, "Se aplasta una vez"], [37, "Arrancas, y dejas andar"], [38, "Después de andar diez minutos"], [45, "Si no, el auto te va a avisar"], [47, "Con la fecha, los kilómetros"], [52, "Si tienes que completar, que sea el mismo grado"], [25, "No es así"], [31, "Un filtro demasiado apretado se deforma"], [36, "El cárter de muchos autos es de aluminio"], [42, "Casi siempre falta aceite o el filtro pierde"], [56, "Sí, en pocos días"], [28, "Pero la norma era una vieja"]]
    .map(([p, a]) => S(p, a, "av", "")),
];
