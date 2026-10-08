// DIRECTOR D — mecllave: preguntas rápidas · el resultado (las dos llaves con pila nueva, la hoja en la guantera, una sola puerta en el
// súper, la llave de Don Ernesto en el gancho) · las 3 pruebas · CTA3 (QR "Antes del Taller" + Manual US$27) · gancho al ep. 3 (la mancha
// de aceite en la cochera + la válvula PCV → mecmillon) · cierre (párrafos 59-78) + vueltas de Claudio a cámara (avatar ~25 %).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { FOB, CELL, GAUGE } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/mecllave/";
export const SHOTS = [
  C(59, "", "ClChapter", { n: 9, title: "Preguntas rápidas", sub: "las que me hacen siempre" }),
  S(60, "", "bi", "b_celltypes", { p: BI("Three different silver coin batteries of slightly different sizes lined up on a workbench, a ruler next to them.") }),
  S(60, "El número está escrito en la pila vieja", "c", "ClBatterySwap", { props: { mode: "id" } }),
  S(61, "", "bi", "b_wetfob", { p: BI(`Close view of ${FOB} lying in a small puddle of water on a car floor mat.`) }),
  S(61, "Ábrelo, saca la pila, sécalo con un paño", "bi", "b_dryfob", { p: BI(`Close view of ${H} drying an opened key fob and its circuit board with a soft cloth on a workbench.`) }),
  S(61, "Muchas veces vuelve a funcionar", "av", ""),
  S(62, "", "bi", "b_wornbuttons", { p: BI(`Extreme close view of ${FOB} with its rubber buttons worn and cracked.`) }),
  S(62, "Hay carcasas nuevas por poco dinero", "bi", "b_newshell", { p: BI(`Close view of ${H} placing a small green circuit board from an old key fob into a brand-new empty black key fob shell on a workbench.`) }),
  S(63, "", "av", ""),
  S(63, "ésa sí hay que programarla en el auto", "bi", "b_newkey", { p: BI("Close view of a brand-new car key fob still in a small plastic bag on a dealership counter.") }),
  S(64, "", "bi", "b_calendar", { p: BI(`Close view of a paper wall calendar in a kitchen with a small note written on a date, a key fob hanging on a hook next to it.`) }),
  S(64, "No hace falta cambiarla antes de que avise", "av", ""),
  S(65, "", "bi", "st_carbattery", { q: "car battery engine", p: BI("Close view of a car battery under an open hood.") }),
  S(65, "Son dos cosas distintas", "c", "ClCheck", { props: { title: "Dos cosas distintas", items: ["Pila del control: abrir y cerrar", "Batería del auto: arrancar", "Tablero apagado → la batería"], fast: true } }),
  S(65, "es la batería grande, no la pila de la llave", "av", ""),
  // ── el resultado
  S(66, "", "bi", "b_twokeys", { p: BI(`Close view of ${EH} holding two key fobs, one older, both closed and clean, in ${SHOP}.`) }),
  S(66, "La fecha anotada en el manual", "bi", "b_datepage", { p: BI("Close view of the first page of a car owner's manual with a handwritten date and the words battery changed, a pen lying on it.") }),
  S(66, "con los botones hacia adentro", "bi", "b_pocketin", { p: BI(`Close view of a key fob slipped into a cardigan pocket with its buttons facing inward.`) }),
  S(67, "", "bi", "b_folded", { p: BI(`Close view of ${EH} folding a printed dealership quote in four and putting it into the glovebox of ${CABIN}.`) }),
  S(67, "Me dijo que la guardaba para acordarse", "bi", "b_elenasmile", { p: BI(`${ELENA} sitting in the driver seat of ${CAR} with the glovebox open, smiling with a hint of mischief.`) }),
  S(68, "", "bi", "b_msg", { p: BI("Close view of a mechanic's hand holding an old phone showing a short text message, a workshop behind.") }),
  S(68, "Que había abierto sólo su puerta", "c", "ClDoorUnlock", { props: { mode: "once" } }),
  S(68, "nadie se dio vuelta a mirarla", "bi", "b_calmlot", { p: BI(`${ELENA} calmly opening the driver door of ${CAR} in a supermarket parking lot, other shoppers walking by without looking.`) }),
  S(69, "", "bi", "b_hook", { p: BI(`Close view of a spare car key fob hanging on a small hook on a kitchen wall next to an inner door, ${EH} hanging it.`) }),
  S(69, "No la de la entrada, que da a la calle", "bi", "b_frontdoor", { p: BI("The inside of the front door of a modest Latin American house opening to the street, an empty key hook next to it.") }),
  S(69, "así, cada vez que sale, la ve", "av", ""),
  // ── las 3 pruebas
  C(70, "", "ClChapter", { n: 10, title: "Las 3 pruebas", sub: "antes de ir a cualquier taller" }),
  S(71, "", "bi", "b_cardboard", { p: BI(`Evening, ${H} sliding a flattened cardboard sheet under the front of ${CAR} on the cement floor of ${DRIVE}.`) }),
  S(71, "A la mañana miras las manchas", "bi", "b_stains", { p: BI("Morning, a flattened cardboard sheet with a few clear water drops and one small dark oil spot on it, on a cement floor.") }),
  S(71, "es el aire acondicionado", "bi", "b_acdrip", { p: BI(`Close view of clear water drops falling from under the passenger side of ${CAR} onto the cement floor of ${DRIVE}.`) }),
  S(71, "cada color te dice qué pierde el auto", "c", "ClColorCode", { props: { pick: 1, items: [{ c: "#E9EEF2", name: "Agua clara", what: "Aire acondicionado", fix: "Normal" }, { c: "#3A2A1A", name: "Marrón o negro", what: "Aceite de motor", fix: "Mide la varilla" }, { c: "#4CAF50", name: "Verde o naranja", what: "Refrigerante", fix: "Al taller" }, { c: "#B23A48", name: "Rojo", what: "Caja o dirección", fix: "Al taller" }] } }),
  S(72, "", "kf", "k_lights", { p: BI(`Evening, ${CAR} facing a white garage wall in ${DRIVE}, its headlights off.`), d1: "the headlights are off", d2: "the headlights turn on and light up the wall", sound: "a soft switch click" }),
  S(72, "Si se apagan casi del todo", "bi", "b_dimlights", { p: BI(`Evening, the headlights of ${CAR} dimmed to a weak yellow glow on a white wall.`) }),
  S(72, "Si parpadean con el motor andando", "c", "ClCheck", { props: { title: "La prueba de los faros", items: ["Se apagan al arrancar → batería", "Parpadean andando → otra cosa", "No cambies la batería todavía"], fast: true } }),
  S(73, "", "bi", "b_dashstart", { p: BI(`Close view of ${GAUGE} with warning lights coming on at engine start.`) }),
  S(73, "Rojo es parar", "bi", "b_redoil", { p: BI(`Extreme close view of a red oil-can warning light glowing on ${GAUGE}.`), ov: { c: "ClChip", props: { text: "Rojo · parar", alert: true } } }),
  S(73, "Amarillo es revisar pronto", "bi", "b_amber", { p: BI(`Extreme close view of an amber engine warning light glowing on ${GAUGE}.`), ov: { c: "ClChip", props: { text: "Amarillo · revisar pronto" } } }),
  S(73, "te dice que vayas hoy mismo", "av", ""),
  // ── el regalo
  S(74, "", "av", ""),
  C(74, "en una hoja gratis que se llama Antes del Taller", "ClQRCard", { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "las 3 pruebas, gratis", kicker: "REGALO · ANTES DEL TALLER" }),
  C(74, "el Manual del Mecánico está en esa misma página", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "todos los trucos del taller", kicker: "EL MANUAL · US$27" }),
  // ── gancho al ep. 3
  S(75, "", "av", ""),
  S(75, "en el piso de cemento quedó una mancha", "bi", "b_stain", { p: BI(`The empty cement floor of ${DRIVE} after the car left, one small dark oil stain the size of a large coin where the engine was.`), rev: 1 }),
  S(75, "justo debajo del motor", "bi", "b_stainmacro", { p: BI("Extreme close view of a small dark oil stain the size of a large coin on a gray cement floor, a coin next to it for scale.") }),
  S(76, "", "bi", "b_cardcover", { p: BI(`A piece of flattened cardboard laid neatly over a stain on the cement floor of ${DRIVE}, ${EH} smoothing it.`) }),
  S(76, "Le levanté el capó", "cl", "c_hood", { p: CLP(`In his workshop he lifts the hood of ${CAR} and props it open, glancing back at the camera.`) }),
  S(76, "una valvulita que casi nadie revisa", "bi", "b_pcv", { p: BI(`Extreme close view of ${H} pointing a fingertip at a small plastic PCV valve with a rubber hose on top of the engine of an older compact sedan.`) }),
  S(76, "un motor que llega a doscientos mil kilómetros", "bi", "st_engine", { q: "car engine close up", p: BI("Close view of the engine of an older ordinary car with the hood open.") }),
  S(76, "La semana que viene te muestro cuál es", "c", "ClVideoRef", { props: { thumb: I + "th_mecmillon.jpg", title: "Los hábitos de un motor de 1 millón", next: true } }),
  // ── cierre
  S(77, "", "av", ""),
  S(77, "Escríbemelo en los comentarios", "bi", "b_comment", { p: BI(`Close view of ${EH} typing on an old smartphone in a kitchen.`) }),
  S(77, "mándale este video", "av", ""),
  S(78, "", "cl", "c_end", { p: CLP(`In his workshop he tosses a key fob lightly in his hand next to ${CAR} and smiles at the camera.`) }),
  S(78, "Nos vemos la semana que viene", "av", ""),
  // ── Claudio vuelve a cámara (avatar ~25 %)
  ...[[9, "En la agencia ni siquiera abrieron el control"], [13, "Para los días de calor"], [15, "abre la puerta del conductor aunque la pila esté muerta"], [19, "pides la pila del número que diga la pila vieja"], [20, "y le sobró una para la llave de repuesto"],
      [24, "giras suave"], [26, "con el signo más del mismo lado"], [28, "y pruebas"], [29, "Dos minutos"], [31, "Con dibujos, paso por paso"], [34, "Abres con la llave de metal"], [35, "el auto lo lee de muy cerca"],
      [36, "como el de Elena"], [40, "con el control en el bolsillo del cárdigan"], [41, "Un toque corto y suena"], [42, "o apretas abrir"], [45, "se abre sólo la puerta del conductor"], [47, "por costumbre"],
      [48, "Si lo tocas rápido no hace nada"], [50, "la de repuesto, que tiene la misma edad, está igual"], [51, "Y esa llave de repuesto es la mejor prueba que existe"], [52, "Así sabes cuándo toca la próxima"], [60, "Lleva esa pila a la tienda"],
      [62, "queda como recién comprado"], [64, "depende de cuánto uses el control"], [66, "se fue con las dos llaves con pila nueva"], [71, "Esta noche, en un lugar plano"], [72, "Con el auto apagado"], [73, "y de qué color"], [74, "o toca el link de la descripción"]]
    .map(([p, a]) => S(p, a, "av", "")),
];
