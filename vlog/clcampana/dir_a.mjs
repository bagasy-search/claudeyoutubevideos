// DIRECTOR A — clcampana: MINUTO 1 (dos filtros: el que chorrea grasa y el que sale brillante de la olla → PROMESA con el antes/después
// → la falla (agua fría y esponja) → "no fue culpa suya" (la grasa fría es manteca) → el culpable (el frío) → 3 loops)
// + INTRO + CTA 1 + el gerente y Don Ramiro + callback a clbandeja + QUÉ ES + la historia de la olla de los caldos (párr. 0-22).
import { S, BI, CLP } from "../claudio/lib.mjs";
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const CL = (p, at, name, scene, o = {}) => S(p, at, "cl", name, { p: CLP(scene), ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: BI(scene), ...o });
export const G = "a hand in a blue nitrile glove";
export const BROWN = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
export const SODA = "a plain white box of baking soda with a blank label";
export const SOAP = "a clear bottle of green dish soap with a plain blank label";
export const KITCHEN = "an ordinary home kitchen with white wall tiles, a gas stove and a stainless steel range hood above it";
export const HOTELKITCHEN = "a big hotel kitchen with stainless steel counters, a gas range and a long stainless steel range hood";
export const HOOD = "a stainless steel kitchen range hood above a gas stove";
export const DIRTY = "a rectangular metal range hood grease filter coated with thick sticky brown grease, the slots clogged";
export const CLEAN = "a rectangular stainless steel range hood grease filter, clean and shiny, every slot open";
export const BAFFLE = "a heavy stainless steel baffle range hood filter with thick angled slats";
export const MESH = "a light aluminum mesh range hood filter with fine layered silver mesh";
export const POT = "a big tall stainless steel stock pot";
export const ROSA = "Rosa, a hotel housekeeper in her fifties with dark hair in a bun and a light-blue housekeeping uniform";
export const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie, holding a small black notebook";
export const RAMIRO = "Don Ramiro, the hotel cook in his sixties with a gray mustache, a white cook's jacket and a long apron";
export const HALL = "a carpeted hotel corridor with numbered room doors and warm ceiling lights";
export const I = "img/clcampana/";
export const SHOTS = [
  // ── 0:00 · Claudio a cámara: los dos filtros
  S(0, "", "av", ""),
  B(0, "grasa marrón", "b_twofilters", `Two range hood grease filters side by side on a stainless steel counter: on the left ${DIRTY}, on the right ${CLEAN}.`),
  CL(0, "Y éste salió de la olla, brillante", "c_liftshiny", `He lifts ${CLEAN} out of a steaming ${POT} with long kitchen tongs in ${HOTELKITCHEN}.`, { anim: "he lifts the shiny filter out of the steam" }),
  ST(0, "En la cocina del hotel", "b_hotelkitchen", "commercial kitchen stainless steel", `${HOTELKITCHEN}, empty in the early morning, the lights on.`),
  ST(0, "esto se hacía sin tallar", "b_hotelkitchen2", "chef working commercial kitchen", `A cook working at the stove of a busy hotel kitchen, seen from behind.`),
  ST(0, "un minuto", "b_kitchenmorning", "empty restaurant kitchen morning", `Ordinary real footage that shows empty restaurant kitchen morning.`),
  // ── la grasa
  CL(1, "", "c_closelook", `He holds ${DIRTY} up close to the camera in ${HOTELKITCHEN}, pointing at the brown layer with a gloved finger.`),
  ST(1, "Esa capa marrón y pegajosa", "b_greaseclose", "dirty grease filter closeup", `Ordinary real footage that shows dirty grease filter closeup.`),
  ST(1, "y pegajosa", "b_dripgrease", "greasy range hood filter", `Ordinary real footage that shows greasy range hood filter.`, { anim: "a drop of brown grease slowly drips" }),
  ST(1, "grasa de meses", "b_oldgrease", "old grease buildup metal", `Ordinary real footage that shows old grease buildup metal.`),
  ST(1, "Cada vez que usted cocina", "b_cookpan", "cooking frying pan stove", `A frying pan sizzling on a home gas stove.`),
  ST(1, "el vapor sube", "b_steamup", "steam frying pan range hood", `Ordinary real footage that shows steam frying pan range hood.`, { anim: "the steam rises into the hood" }),
  ST(1, "la grasa se queda pegada en la rejilla", "b_gridgrease", "range hood underside filter", `Ordinary real footage that shows range hood underside filter.`),
  // ── PROMESA
  C(2, "", "ClBeforeAfter", { before: I + "b_ba_before.jpg", after: I + "b_ba_after.jpg", note: "½ taza de bicarbonato · 10 min" }),
  ST(2, "una olla grande", "b_bigpot", "big stock pot stove", `${POT} full of water on a gas burner in ${KITCHEN}.`),
  ST(2, "agua hirviendo", "b_boiling", "boiling water pot top view", `Ordinary real footage that shows boiling water pot top view.`, { anim: "the water boils hard" }),
  ST(2, "bicarbonato", "b_bicarb", "baking soda spoon", `${SODA} and a metal tablespoon on a kitchen counter next to the stove.`),
  C(2, "y diez minutos", "ClTimer30", { minutes: 10, label: "En la olla", fast: true }),
  B(2, "Mire este filtro", "b_filterbefore", `${DIRTY}, lying on a stainless steel counter under bright kitchen light.`),
  ST(2, "Y mírelo cuando sale de la olla", "b_filterout", "tongs kitchen steam", `Ordinary real footage that shows tongs kitchen steam.`),
  B(2, "Se ve la luz por los agujeritos", "b_lightthrough", `${CLEAN} held up against a bright kitchen window, daylight shining through every slot.`),
  // ── la falla
  ST(3, "", "b_coldtap", "cold water tap kitchen sink", `${G} holding ${DIRTY} under a cold running tap in a stainless kitchen sink.`),
  ST(3, "Sacó el filtro", "b_pullfilter", "hands holding greasy filter", `Ordinary real footage that shows hands holding greasy filter.`),
  ST(3, "con agua fría y detergente", "b_detergent", "dish soap sponge sink", `Ordinary real footage that shows dish soap sponge sink.`),
  CL(3, "y frotó con la esponja", "c_spongerub", `He scrubs ${DIRTY} with a yellow sponge under cold running water in the sink of ${HOTELKITCHEN}, frowning.`),
  ST(3, "La esponja quedó negra", "b_blacksponge", "dirty kitchen sponge", `A yellow kitchen sponge smeared black-brown with grease, on the edge of a sink.`),
  ST(3, "Y el filtro, igual de marrón", "b_stillbrown", "dirty filter sink", `A wet range hood filter still brown with grease, lying in a stainless sink.`),
  ST(3, "igual de marrón", "b_brownclose", "dirty metal grid closeup", `Ordinary real footage that shows dirty metal grid closeup.`),
  // ── no fue culpa suya
  CL(4, "", "c_reassure", `He leans on a stainless steel counter in ${HOTELKITCHEN}, talking to the camera with a calm open hand.`),
  ST(4, "Nadie le dijo", "b_fridge", "open fridge butter", `An open home fridge with a stick of butter on the shelf.`),
  ST(4, "como la manteca de la heladera", "b_butter", "cold butter stick plate", `Ordinary real footage that shows cold butter stick plate.`),
  B(4, "el agua fría la deja más dura", "b_hardgrease", `Close view of whitish hardened grease clumps on a metal filter under cold running water.`),
  ST(4, "más dura todavía", "b_icewater", "ice cold water glass", `Ice cubes in a glass of cold water.`),
  // ── el culpable: el frío
  ST(5, "", "b_flame", "gas stove blue flame pot", `Ordinary real footage that shows gas stove blue flame pot.`),
  ST(5, "La grasa se ablanda con calor", "b_meltgrease", "butter melting pan", `Ordinary real footage that shows butter melting pan.`, { anim: "the fat melts" }),
  B(5, "sube a flotar", "b_floatgrease", `Brown grease floating up to the surface of boiling water in ${POT}.`, { anim: "brown grease floats up" }),
  ST(5, "Con agua hirviendo", "b_boilclose", "boiling water closeup", `Close view of water boiling hard in a big pot.`),
  // ── 3 loops
  CL(6, "", "c_threefingers", `He holds up three gloved fingers to the camera in ${HOTELKITCHEN}, the hood above him.`),
  C(6, "si su filtro es de acero o de aluminio", "ClFilterTest", {}),
  ST(6, "El truco del trapo caliente", "b_hotcloth", "steaming hot towel", `Ordinary real footage that shows steaming hot towel.`),
  ST(6, "que no deja marcas", "b_shinyhood", "clean stainless steel range hood", `Ordinary real footage that shows clean stainless steel range hood.`),
  ST(6, "el error que vi quemar más manos", "b_tongshang", "kitchen tongs hanging", `Ordinary real footage that shows kitchen tongs hanging.`),
  // ── INTRO
  C(7, "", "ClHallway3D", { total: 180, floor: 1, title: "habitaciones", sub: "y una cocina grande" }),
  CL(7, "Y la cocina del hotel tenía una campana", "c_longhood", `He stands under a very long stainless steel range hood in ${HOTELKITCHEN}, looking up at it with his hands on his hips.`),
  ST(7, "con doce filtros", "b_twelvefilters", "commercial kitchen exhaust hood", `Ordinary real footage that shows commercial kitchen exhaust hood.`),
  // ── CTA 1
  CL(8, "", "c_bookhold", `He holds a thick printed spiral-bound book with a plain brown cover in ${HOTELKITCHEN}, showing it to the camera.`),
  ST(8, "me prometí escribir todo lo que aprendí", "b_notebookdesk", "old notebook handwritten notes desk", `Ordinary real footage that shows old notebook handwritten notes desk.`),
  S(8, "Y lo escribí", "av", ""),
  C(8, "Un libro", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "94 ARREGLOS · PÁGINAS 7 Y 31", text: "el link está abajo" }),
  C(8, "La cocina empieza en la página treinta y uno", "ClBookPage", { page: I + "book_p31.jpg", pageNo: 31, stamp: "La cocina" }),
  C(8, "y la tabla de lo que nunca se mezcla", "ClBookPage", { page: I + "book_p7.jpg", pageNo: 7, stamp: "Página 7" }),
  // ── el gerente y Don Ramiro
  CL(9, "", "c_manager", `He stands in ${HALL} next to ${MANAGER}, who reads from his notebook with a worried face.`),
  C(9, "olor a fritura en el pasillo", "ClNotebook", { title: "La libreta del gerente", rows: [{ k: "Martes", v: "olor a fritura en el pasillo" }, { k: "Jueves", v: "olor a fritura en el pasillo" }], note: "la campana" }),
  ST(9, "el olor sube a las habitaciones", "b_smokehall", "hotel corridor haze", `${HALL} with a faint haze in the air near the elevator.`),
  CL(10, "", "c_ramiro", `${RAMIRO} calls him over from the stove in ${HOTELKITCHEN}, pointing up at the hood with a ladle.`),
  ST(10, "la campana ya no chupa", "b_smokestove", "smoke frying pan kitchen", `Ordinary real footage that shows smoke frying pan kitchen.`),
  ST(10, "era hora de bajar los filtros", "b_unclip", "removing range hood filter", `Ordinary real footage that shows removing range hood filter.`),
  // ── callback a clbandeja
  C(11, "", "ClVideoRef", { thumb: I + "th_clbandeja.jpg", title: "Las bandejas del horno", tag: "ya en el canal" }),
  ST(11, "La de la campana es la misma grasa", "b_hoodunder", "range hood from below", `Ordinary real footage that shows range hood from below.`),
  ST(11, "porque está arriba de su cabeza", "b_headunder", "woman cooking stove hood", `Ordinary real footage that shows woman cooking stove hood.`),
  // ── QUÉ ES
  C(12, "", "ClChapter", { n: 1, label: "PRIMERO", title: "Qué es eso marrón", sub: "y con qué sale" }),
  ST(12, "Porque si sabe qué es", "b_filterlook", "range hood filter cleaning", `${G} tilting ${DIRTY} toward the light from a kitchen window.`),
  ST(13, "", "b_oilpan", "oil sizzling frying pan", `Oil sizzling in a frying pan on a gas stove, close view.`, { anim: "the oil sizzles" }),
  ST(13, "en gotitas que no se ven", "b_mist", "steam rising frying pan backlit", `Backlit fine mist of steam and tiny oil droplets rising above a hot frying pan.`),
  ST(13, "La campana las chupa", "b_hoodsuck", "range hood steam", `Ordinary real footage that shows range hood steam.`),
  ST(13, "y el filtro las atrapa", "b_trap", "oil droplets metal macro", `Ordinary real footage that shows oil droplets metal macro.`),
  C(14, "", "ClPins", { img: I + "b_greasepins.jpg", pins: [{ x: 0.3, y: 0.35, label: "Aceite" }, { x: 0.62, y: 0.42, label: "Polvo" }, { x: 0.45, y: 0.72, label: "Grasa vieja" }] }),
  ST(14, "Encima se pega otra", "b_layers", "grease buildup closeup", `Extreme close view of thick layered brown grease crust on the edge of a metal filter.`),
  ST(14, "Al año", "b_yearfilter", "dirty clogged grease filter", `A very old range hood filter almost completely blocked with dark brown grease.`),
  ST(15, "", "b_noair", "smoky kitchen", `Ordinary real footage that shows smoky kitchen.`),
  ST(15, "La campana hace ruido, pero no chupa", "b_hoodbutton", "range hood control button", `Ordinary real footage that shows range hood control button.`),
  ST(15, "la grasa se va a las paredes", "b_greasywall", "greasy kitchen tiles", `Ordinary real footage that shows greasy kitchen tiles.`),
  ST(15, "y a los muebles", "b_greasycabinet", "dirty kitchen cabinet", `A greasy wooden kitchen cabinet door near the stove with dust stuck to it.`),
  CL(16, "", "c_bottleshake", `He holds up ${BROWN} in ${HOTELKITCHEN} and shakes his head no, a greasy hood filter on the counter.`),
  C(16, "El frasco marrón es para el moho", "ClDoDont", { yes: { label: "Moho y manchas", img: I + "b_moldtile.jpg" }, no: { label: "No para la grasa", img: I + "b_greaseclose.jpg" } }),
  ST(16, "La grasa es trabajo del calor y del jabón", "b_soaphot", "dish soap hot water sink", `Ordinary real footage that shows dish soap hot water sink.`),
  C(16, "en la página treinta y cinco", "ClBookPage", { page: I + "book_p35.jpg", pageNo: 35, stamp: "Primero el jabón" }),
  C(17, "", "ClTwoDays", { d1: ["PRIMERO", "El calor", "agua hirviendo · la olla", "#B5532E"], d2: ["DESPUÉS", "El jabón", "detergente · el trapo", "#3E6E8E"], stamp: "Nunca agua fría" }),
  // ── la historia: la olla de los caldos
  CL(18, "", "c_carryfilters", `He carries a stack of greasy hood filters out the back door of ${HOTELKITCHEN} to a concrete back patio.`),
  ST(18, "con la manguera y un cepillo", "b_hose", "garden hose spraying water", `A garden hose spraying cold water on a greasy hood filter lying on a concrete patio.`),
  ST(18, "Toda una tarde", "b_afternoon", "restaurant back door afternoon", `Ordinary real footage that shows restaurant back door afternoon.`),
  CL(19, "", "c_scrubpatio", `He kneels on a concrete patio scrubbing a greasy filter with a stiff brush, sweating.`),
  ST(19, "la grasa se corría de un lado al otro", "b_smear", "scrubbing brush grease", `A brush smearing brown grease across a wet metal filter.`),
  ST(19, "El cepillo quedaba pegoteado", "b_stickybrush", "dirty brush bristles", `Ordinary real footage that shows dirty brush bristles.`),
  CL(20, "", "c_ramiropatio", `${RAMIRO} stands at the back door of the hotel kitchen with his arms crossed, watching him scrub filters on the patio.`),
  ST(20, "¿usted lava las ollas con agua fría?", "b_potsink", "commercial kitchen sink pots", `Ordinary real footage that shows commercial kitchen sink pots.`),
  ST(21, "", "b_stockpot", "stock pot commercial stove", `Ordinary real footage that shows stock pot commercial stove.`),
  ST(21, "un puñado de bicarbonato", "b_handful", "pouring baking soda", `Ordinary real footage that shows pouring baking soda.`),
  ST(21, "metió un filtro", "b_dipfilter", "tongs boiling pot", `Ordinary real footage that shows tongs boiling pot.`, { anim: "the filter goes into the boiling water" }),
  ST(21, "como una espuma marrón", "b_brownfoam", "foam boiling pot", `Brown foam rising on the surface of boiling water in a big pot.`, { anim: "brown foam rises" }),
  ST(22, "", "b_tongsout", "tongs lifting from pot steam", `Ordinary real footage that shows tongs lifting from pot steam.`),
  CL(22, "le pasó un cepillo", "c_brushclean", `He brushes a clean steaming filter over a stainless sink in ${HOTELKITCHEN}.`),
  ST(22, "se veía la luz por los agujeritos", "b_lightholes", "metal grid light closeup", `Ordinary real footage that shows metal grid light closeup.`),
  ST(22, "un lunes por mes", "b_calendar", "calendar circled date", `A paper wall calendar in a hotel kitchen with one Monday of the month circled in pen.`),
];
