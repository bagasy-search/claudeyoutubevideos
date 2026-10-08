// DIRECTOR D — mecmillon: 5 errores · preguntas · resultado (cartón limpio, la libreta con dos letras, el presupuesto a la basura) ·
// 3 pruebas · CTA3 · gancho al ep. 4 (la aguja de temperatura en el tráfico + el radiador → mecvinagre) · cierre (párrafos 51-74)
// + vueltas de Claudio a cámara (avatar ~25 %).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { PCV, BAY, STAIN } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/mecmillon/";
const GAUGE = "the plain analog instrument cluster of an ordinary 2012 compact sedan";
export const SHOTS = [
  C(51, "", "ClChapter", { n: 6, title: "Los 5 errores", sub: "con el motor", alert: true }),
  S(52, "", "bi", "b_err_normal", { p: BI("Close view of a car owner's maintenance table with the 'normal' column circled by mistake and the severe column ignored."), ov: { c: "ClChip", props: { text: "1", alert: true } } }),
  S(53, "", "bi", "b_err_idle", { p: BI(`Cold morning, ${CAR} idling alone with exhaust vapor in ${DRIVE}, the driver door open, nobody inside.`), ov: { c: "ClChip", props: { text: "2", alert: true } } }),
  S(54, "", "bi", "st_err_sale", { q: "motor oil shelf store", p: BI("A store shelf of motor oil bottles with a big sale tag."), ov: { c: "ClChip", props: { text: "3", alert: true } } }),
  S(55, "", "bi", "b_err_card", { p: BI(`A flattened cardboard sheet covering ${STAIN}, a dark ring visible at its edge.`), ov: { c: "ClChip", props: { text: "4", alert: true } } }),
  S(56, "", "bi", "b_err_blank", { p: BI("Close view of an empty notebook with blank pages lying in a car glovebox."), ov: { c: "ClChip", props: { text: "5", alert: true } } }),
  S(56, "nadie sabe qué se hizo ni cuándo", "av", ""),
  C(57, "", "ClChapter", { n: 7, title: "Preguntas rápidas", sub: "las que me hacen siempre" }),
  S(58, "", "bi", "st_taxi", { q: "taxi city street", p: BI("An ordinary taxi driving on a city street.") }),
  S(58, "Algunos sí, sobre todo los taxis", "bi", "st_odohigh", { q: "high mileage odometer", p: BI("Close view of a car odometer with a very high mileage.") }),
  S(58, "puede pasar de quinientos mil sin abrirse", "av", ""),
  S(59, "", "bi", "st_syntheticoil", { q: "pouring motor oil", p: BI("Golden motor oil being poured from a bottle.") }),
  S(59, "Pero el número del grado tiene que ser el del manual", "av", ""),
  S(60, "", "bi", "st_additives", { q: "car products shelf", p: BI("A shelf of assorted car care bottles in an auto parts store.") }),
  S(60, "Un buen aceite, del grado correcto", "av", ""),
  S(61, "", "c", "ClReceipt", { props: { head: "LO QUE GASTÓ ELENA", lines: [["Válvula PCV", "US$ 7"], ["Manguerita", "US$ 4"], ["Filtro de aire", "US$ 6"], ["Aceite y filtro", "lo de siempre"]], total: ["vs. 1ª revisión de la agencia", "menos"] } }),
  S(61, "La válvula, los filtros, el aceite a tiempo", "av", ""),
  S(62, "", "bi", "st_usedcar", { q: "used car lot", p: BI("A row of used cars for sale on a small lot.") }),
  S(62, "Empieza tu libreta hoy", "c", "ClLogbook", { props: { mode: "new" } }),
  S(62, "Desde hoy, ese auto tiene historia", "av", ""),
  // ── el resultado
  S(63, "", "bi", "b_visit", { p: BI(`${CAR} parked in ${DRIVE} on a sunny afternoon, a flattened cardboard sheet still on the floor under its front.`) }),
  S(63, "Limpio", "bi", "b_cleancard2", { p: BI("Extreme close view of a clean flattened cardboard sheet on a cement floor, not a single drop on it."), rev: 1 }),
  S(64, "", "bi", "b_nbglove", { p: BI(`Close view of a small worn blue notebook lying on top of an owner's manual in the open glovebox of ${CABIN}, a red paper clip on the manual.`) }),
  S(64, "Y con dos letras distintas", "c", "ClLogbook", { props: { mode: "two" } }),
  S(65, "", "bi", "b_trashquote", { p: BI(`${ELENA} in her kitchen dropping a folded printed car quote into a small trash bin, a calm smile.`) }),
  S(65, "Que este auto todavía tiene cuerda", "bi", "b_elenadrive", { p: BI(`${ELENA} driving ${CAR} out of ${DRIVE} onto a sunny street, both hands on the wheel, smiling.`) }),
  // ── las 3 pruebas
  C(66, "", "ClChapter", { n: 8, title: "Las 3 pruebas", sub: "antes de ir a cualquier taller" }),
  S(67, "", "bi", "b_cardboard", { p: BI(`Evening, ${H} sliding a flattened cardboard sheet under the front of ${CAR} on the floor of ${DRIVE}.`) }),
  S(67, "A la mañana miras las manchas", "bi", "b_stains", { p: BI("Morning, a flattened cardboard sheet with a few clear water drops and one small dark spot on it, on a cement floor.") }),
  S(67, "es el aire acondicionado", "bi", "b_acdrip", { p: BI(`Close view of clear water drops falling from under the passenger side of ${CAR} onto a cement floor.`) }),
  S(67, "Si son marrones o negras, debajo del motor", "c", "ClColorCode", { props: { pick: 1, items: [{ c: "#E9EEF2", name: "Agua clara", what: "Aire acondicionado", fix: "Normal" }, { c: "#3A2A1A", name: "Marrón o negro", what: "Aceite de motor", fix: "Mide la varilla" }, { c: "#4CAF50", name: "Verde o naranja", what: "Refrigerante", fix: "Al taller" }, { c: "#B23A48", name: "Rojo", what: "Caja o dirección", fix: "Al taller" }] } }),
  S(68, "", "kf", "k_lights", { p: BI(`Evening, ${CAR} facing a white garage wall in ${DRIVE}, its headlights off.`), d1: "the headlights are off", d2: "the headlights turn on and light the wall", sound: "a soft switch click" }),
  S(68, "Si se apagan casi del todo", "bi", "b_dimlights", { p: BI(`Evening, the headlights of ${CAR} dimmed to a weak glow on a white wall.`) }),
  S(68, "Si parpadean con el motor andando", "c", "ClCheck", { props: { title: "La prueba de los faros", items: ["Se apagan al arrancar → batería", "Parpadean andando → otra cosa", "No cambies la batería todavía"], fast: true } }),
  S(69, "", "bi", "b_dashstart", { p: BI(`Close view of ${GAUGE} with warning lights coming on at engine start.`) }),
  S(69, "Rojo es parar", "bi", "b_redoil", { p: BI(`Extreme close view of a red oil-can warning light glowing on ${GAUGE}.`), ov: { c: "ClChip", props: { text: "Rojo · parar", alert: true } } }),
  S(69, "Amarillo es revisar pronto", "bi", "b_amber", { p: BI(`Extreme close view of an amber engine warning light glowing on ${GAUGE}.`), ov: { c: "ClChip", props: { text: "Amarillo · revisar pronto" } } }),
  S(69, "te dice que vayas hoy mismo", "av", ""),
  // ── el regalo
  S(70, "", "av", ""),
  C(70, "en una hoja gratis que se llama Antes del Taller", "ClQRCard", { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "las 3 pruebas, gratis", kicker: "REGALO · ANTES DEL TALLER" }),
  C(70, "el Manual del Mecánico está en esa misma página", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "todos los trucos del taller", kicker: "EL MANUAL · US$27" }),
  // ── gancho al ep. 4
  S(71, "", "av", ""),
  S(71, "Había mucho tráfico", "bi", "b_trafficav", { p: BI(`${CAR} stuck in heavy afternoon traffic on a wide avenue, seen from the car behind.`) }),
  S(71, "la aguja de la temperatura había empezado a subir", "kf", "k_tempup", { p: BI(`Extreme close view of the temperature gauge of ${GAUGE}, the needle in the middle.`), d1: "the temperature needle sits in the middle", d2: "the needle slowly creeps up toward the hot side", sound: "a car idling in traffic" }),
  S(71, "No hasta el rojo, pero más que nunca", "bi", "b_elenatraffic", { p: BI(`${ELENA} at the wheel of ${CAR} in traffic, glancing worriedly at the dashboard.`) }),
  S(72, "", "bi", "b_radiatorquote", { p: BI("Close view of a printed dealership quote with a drawing of a car radiator, tucked into a blue folder, no legible numbers.") }),
  S(72, "Antes de firmar nada", "av", ""),
  S(72, "con un frasco de la cocina", "bi", "b_vinegar", { p: BI("A plain glass bottle of white vinegar on a kitchen counter next to a measuring cup."), rev: 1 }),
  S(72, "Y lo que salió de adentro de ese radiador", "c", "ClVideoRef", { props: { thumb: I + "th_mecvinagre.jpg", title: "El truco de vinagre de 1 dólar", next: true } }),
  // ── cierre
  S(73, "", "av", ""),
  S(73, "Escríbemelo en los comentarios", "bi", "b_comment", { p: BI(`Close view of ${EH} typing on an old smartphone in a kitchen.`) }),
  S(74, "", "cl", "c_end", { p: CLP(`In his workshop he closes the hood of ${CAR} with both hands and pats it, smiling at the camera.`) }),
  S(74, "Nos vemos la semana que viene", "av", ""),
  // ── Claudio vuelve a cámara (avatar ~25 %)
  ...[[9, "Y yo entiendo el miedo"], [10, "casi nunca quiere decir que el motor está gastado"], [14, "La saqué"],
      [18, "La regla de taller es ésta"], [23, "Hábito uno"], [24, "O sea, lo que hace casi todo el mundo"], [28, "Hábito tres"], [31, "cada cuántos kilómetros cada cosa"], [32, "Hábito cuatro"], [34, "no aceptes un motor nuevo de entrada"], [35, "Hábito cinco"], [37, "Si se corta andando, en muchos motores"], [39, "Esa misma semana, al taller"], [44, "Adentro, con letra de imprenta"], [48, "Y ésa es la explicación"], [58, "Pero aunque no llegue al millón"], [67, "Esta noche, en un lugar plano"], [68, "Con el auto apagado"], [69, "y de qué color"], [70, "o toca el link de la descripción"]]
    .concat([[21, "ni el que está en oferta"], [25, "el motor dura años de más"], [33, "eso no es normal"], [41, "El turbo necesita enfriarse"], [20, "y pides cuatro cosas"], [26, "Cuando arrancas en frío"], [34, "y pide que revisen primero la válvula PCV"], [23, "Busca en el manual la tabla de mantenimiento"], [30, "Poner aceite limpio"], [62, "Cambia aceite, filtros"], [47, "Me dijo que él siempre decía"], [16, "conviene que la cambie el mecánico"], [18, "cada dos o tres cambios de aceite"], [64, "arriba del manual"], [28, "Cada vez que cambies el aceite"], [43, "Buscando el manual del auto"]])
    .map(([p, a]) => S(p, a, "av", "")),
];
