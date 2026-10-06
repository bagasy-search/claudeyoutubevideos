// DIRECTOR C — cllavadora: LOS ERRORES (puerta cerrada, ropa mojada, frío, cloro, arrancar la goma, tambor lleno) · CARGA SUPERIOR ·
// RESCATE DE LAS TOALLAS · SECADO Y SECADORA · PREGUNTAS · EL HÁBITO · RESUMEN · CTA 3 · PRÓXIMO VIDEO (moho) · cierre (párrafos 42-66).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { SEAL, LAUNDRY, BOTTLE } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const G = "a hand in a blue nitrile glove";
const I = "img/cllavadora/";
export const SHOTS = [
  // ── 8:45 · los errores
  C(42, "", "ClChapter", { n: 6, title: "Los errores", sub: "cada uno le trae el olor" }),
  S(42, "Cada uno le trae el olor de vuelta", "av", ""),
  C(43, "", "ClChapter", { n: 1, label: "ERROR", title: "La puerta cerrada", sub: "mojada y a oscuras", alert: true }),
  S(43, "La máquina queda mojada y a oscuras", "bi", "st_doorclose", { q: "closing washing machine door", p: BI("A hand closing the round door of a front-loading washing machine.") }),
  C(43, "Deje la puerta entreabierta", "ClWasher3D", { mode: "ajar", labels: { a: "Entreabierta" } }),
  S(43, "Ese solo hábito", "av", ""),
  C(44, "", "ClChapter", { n: 2, label: "ERROR", title: "La ropa adentro", sub: "una hora ya huele", alert: true }),
  S(44, "Una hora en verano", "bi", "b_wetpile", { p: BI("A heap of damp washed clothes and towels left sitting inside the drum of a front-loading washing machine with the door half open.") }),
  S(44, "Apenas termina a colgar", "bi", "st_hanglaundry", { q: "hanging laundry clothesline", p: BI("Hanging washed clothes on a clothesline in the sun.") }),
  C(45, "", "ClChapter", { n: 3, label: "ERROR", title: "Siempre en frío", sub: "una vez por mes, caliente", alert: true }),
  S(45, "El agua fría ahorra luz", "bi", "st_dialcold", { q: "washing machine control panel", p: BI("A washing machine control panel dial.") }),
  S(45, "una vez por mes el ciclo caliente", "bi", "b_steamdoor", { p: BI("The round glass door of a front-loading washing machine fogged with steam from a hot cycle running with an empty drum.") }),
  C(46, "", "ClChapter", { n: 4, label: "ERROR", title: "Cloro y agua oxigenada", sub: "nunca juntos", alert: true }),
  C(46, "Nunca juntos", "ClNeverMix", { a: "Cloro", b: "Agua oxigenada", verdict: "Nunca juntos" }),
  C(46, "Y nunca cloro con vinagre", "ClNeverMix", { a: "Cloro", b: "Vinagre", verdict: "Gas tóxico" }),
  C(47, "", "ClChapter", { n: 5, label: "ERROR", title: "Arrancar la goma", sub: "es trabajo de técnico", alert: true }),
  S(47, "con resortes y abrazaderas", "bi", "b_sealoff", { p: BI("The rubber door seal of a front-loading washing machine half pulled off its rim, a coiled metal spring clamp hanging loose, a flat screwdriver on top of the machine.") }),
  S(47, "Se limpia puesta", "bi", "b_sealon", { p: BI(`${G} gently folding back ${SEAL}, still fitted in place, to clean inside.`) }),
  C(48, "", "ClChapter", { n: 6, label: "ERROR", title: "El tambor lleno", sub: "tres cuartos, nunca más", alert: true }),
  S(48, "llenar el tambor hasta arriba", "bi", "b_overfull", { p: BI("A front-loading washing machine drum stuffed completely full of towels and clothes pressed against the glass of the open door.") }),
  S(48, "Tres cuartos del tambor", "bi", "b_threequarters", { p: BI("A front-loading washing machine drum filled about three quarters with loose towels, space at the top.") }),
  // carga superior
  S(49, "", "bi", "st_toploader", { q: "top load washing machine", p: BI("Looking into an open top-loading washing machine with an agitator in the middle.") }),
  S(49, "debajo del agitador", "bi", "b_agitator", { p: BI("Close view of the base of the agitator inside a top-loading washing machine and the top rim of the tub, gray slimy gunk built up in the grooves.") }),
  S(49, "y un cepillo en el borde", "bi", "b_toprim", { p: BI(`${G} scrubbing the upper rim of a top-loading washing machine tub with an old toothbrush.`), anim: "the toothbrush scrubs along the rim" }),
  // rescate de las toallas
  C(50, "", "ClChapter", { n: 7, title: "Rescatar las toallas", sub: "las que ya huelen" }),
  S(50, "sin suavizante", "bi", "b_towelswash", { p: BI("White towels loaded loosely into a clean front-loading washing machine, the detergent drawer open with just powder in it.") }),
  S(50, "al sol si puede", "bi", "st_towelssun", { q: "towels drying in sun clothesline", p: BI("White towels drying on a clothesline in bright sun.") }),
  // secado
  S(51, "", "av", ""),
  S(51, "Nunca dejarlas húmedas en un montón", "bi", "b_damppile", { p: BI("A damp crumpled pile of used bath towels on a bathroom tile floor next to a laundry basket.") }),
  S(51, "Colgadas abiertas con aire", "bi", "b_towelsopen", { p: BI("Bath towels hung open and spread flat on a towel bar and a drying rack in a bright bathroom with an open window.") }),
  S(52, "", "bi", "st_lintfilter", { q: "dryer lint filter cleaning", p: BI("A hand pulling lint off the lint screen of a clothes dryer.") }),
  S(52, "el caño de salida de atrás", "bi", "b_dryervent", { p: BI("The flexible foil exhaust duct behind a clothes dryer pulled off its wall vent, packed with thick gray lint.") }),
  S(52, "porque la pelusa caliente prende fuego", "bi", "b_lintclump", { p: BI("A big clump of gray dryer lint pulled out of a dryer duct held in a gloved hand, the dryer behind.") , ov: { c: "ClChip", props: { text: "Prende fuego", alert: true } } }),
  // ── 11:45 · preguntas
  C(53, "", "ClChapter", { n: 8, title: "Lo que siempre me preguntan", sub: "rapidito" }),
  S(54, "", "bi", "st_coloredclothes", { q: "colorful clothes laundry", p: BI("A pile of colorful clothes in a laundry basket.") , ov: { c: "ClChip", props: { text: "¿Destiñe?" } } }),
  S(54, "por eso la taza va con el tambor vacío", "bi", "b_emptydrum", { p: BI("Looking straight into the completely empty stainless steel drum of a front-loading washing machine through the open door.") }),
  S(55, "", "bi", "b_sealgood", { p: BI(`Close view of ${SEAL}, clean, soft and in good shape, a gloved fingertip pressing it.`) , ov: { c: "ClChip", props: { text: "¿Y la goma?" } } }),
  S(56, "", "bi", "st_vinegar2", { q: "white vinegar bottle", p: BI("A bottle of white vinegar on a shelf.") , ov: { c: "ClChip", props: { text: "¿Vinagre?" } } }),
  S(57, "", "bi", "b_calendar", { p: BI("A paper wall calendar pinned above a washing machine in a laundry corner with a few dates circled in pen.") , ov: { c: "ClChip", props: { text: "¿Cada cuánto?" } } }),
  C(57, "La goma una pasada cada semana", "ClCheck", { title: "Cada cuánto", items: ["La goma: cada semana", "Cajón y filtro: cada mes", "Ciclo caliente: cada mes"], fast: true }),
  S(58, "", "bi", "b_sealspots", { p: BI(`Close view of ${SEAL}, clean but with a few tiny permanent black dots stained into the rubber.`) , ov: { c: "ClChip", props: { text: "¿Puntitos negros?" } } }),
  S(58, "mientras no huela", "av", ""),
  S(59, "", "bi", "b_walldrain", { p: BI("The open standpipe drain in the wall behind a washing machine with the gray drain hose hooked into it, a laundry room.") , ov: { c: "ClChip", props: { text: "¿Huevo podrido?", alert: true } } }),
  S(59, "Tire un balde de agua por ese desagüe", "bi", "b_bucketdrain", { p: BI("A bucket of clean water being poured into a floor drain in a laundry room.") }),
  S(60, "", "bi", "st_bakingsoda", { q: "baking soda box", p: BI("A box of baking soda on a laundry shelf.") , ov: { c: "ClChip", props: { text: "¿Bicarbonato?" } } }),
  S(60, "El trabajo lo hace usted", "av", ""),
  // ── el hábito
  C(61, "", "ClChapter", { n: 9, title: "Que no vuelva", sub: "diez segundos" }),
  S(61, "pase un trapo seco por la goma", "bi", "b_drywipe", { p: BI(`${G} wiping the bottom fold of ${SEAL} dry with a folded white cloth after the last wash.`), anim: "the cloth wipes along the fold" }),
  C(61, "y deje la puerta y el cajón abiertos", "ClWasher3D", { mode: "ajar", labels: { a: "Puerta y cajón abiertos" } }),
  // ── resumen
  C(62, "", "ClCheck", { title: "Todo en 30 segundos", items: ["La goma: rocío, cepillo, trapo", "El cajón: agua caliente", "El filtro: despacito", "1 taza, ciclo caliente", "La puerta, abierta"] }),
  S(62, "Una taza en el tambor vacío", "bi", "st_washerrun2", { q: "washing machine spinning", p: BI("A washing machine drum spinning.") }),
  S(62, "Y de ahora en más la puerta abierta", "cl", "c_doorajar", { p: CLP(`He stands in ${LAUNDRY} leaving the round door of a white washing machine slightly ajar with one gloved hand, giving the camera a knowing nod.`) }),
  // ── CTA 3
  S(63, "", "av", ""),
  C(63, "El código está acá", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "la página 11 entera, gratis" }),
  S(63, "Y si quiere los noventa y cuatro arreglos", "bi", "b_bookprint", { p: BI(`A freshly printed stack of letter-size book pages with photos of cleaning fixes fanned out on a stainless steel laundry table next to ${BOTTLE} and a folded white towel.`) }),
  // ── próximo video: el moho
  C(64, "", "ClVideoRef", { thumb: I + "th_clmoho.jpg", title: "Moho: el cloro no lo mata", next: true }),
  S(64, "Al moho negro de las juntas y la silicona", "bi", "st_moldtile", { q: "black mold shower tiles", p: BI("Black mold in the grout lines and silicone of a shower corner.") }),
  S(64, "queda blanquito", "bi", "b_bleachedmold", { p: BI("A shower corner whose silicone caulk line looks bleached pale white with faint gray shadows of mold still underneath.") }),
  S(64, "Le voy a mostrar por qué", "av", ""),
  // ── cierre
  S(65, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Qué encontró en SU lavadora?" } } }),
  S(66, "", "cl", "c_bye", { p: CLP(`He kneels in front of a white front-loading washing machine in ${LAUNDRY}, one gloved finger hooked on the rubber door seal, looking at the camera with a warm wink and a little wave goodbye.`) }),
];
