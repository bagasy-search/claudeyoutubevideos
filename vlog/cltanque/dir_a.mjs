// DIRECTOR A — cltanque: MINUTO 1 (Claudio levanta la tapa del tanque → agua marrón, baba negra, piedra en el flotador → PROMESA con el
// antes/después del tanque → la falla (rayas marrones que vuelven) → "no fue culpa suya" → el culpable (el agua quieta) → 3 loops)
// + INTRO + CTA 1 a ~1:40 (frase fija) + el gerente y Rosa + callback a clsarro + QUÉ ES + la historia de la 312 (párr. 0-22).
import { S, BI, CLP } from "../claudio/lib.mjs";
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const CL = (p, at, name, scene, o = {}) => S(p, at, "cl", name, { p: CLP(scene), ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: BI(scene), ...o });
export const G = "a hand in a blue nitrile glove";
export const BROWN = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
export const VINEGAR = "a big clear plastic jug of white vinegar with a plain blank white label";
export const HOMEBATH = "a small ordinary home bathroom with white wall tiles, a white toilet and a small window";
export const HOTELBATH = "a mid-range hotel guest bathroom with beige-cream wall tiles and a white toilet";
export const TANK = "the inside of the open ceramic tank of an ordinary white toilet, seen from above with the lid removed";
export const DIRTY = "the water inside is murky brownish, the inner walls have orange-brown mineral stains and a black slimy film near the waterline, the plastic float and the fill valve are crusted with hard white limescale, and an old dark rubber flapper sits at the bottom over the drain hole";
export const TABLET = "a round blue chlorine toilet-tank tablet";
export const LID = "the heavy white ceramic lid of a toilet tank";
export const VALVE = "the small chrome shut-off valve on the wall behind a toilet, near the floor, with a flexible supply hose going up to the tank";
export const ROSA = "Rosa, a hotel housekeeper in her fifties with dark hair in a bun and a light-blue housekeeping uniform";
export const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie, holding a small black notebook";
export const RAMIRO = "Don Ramiro, the hotel night cook in his sixties with a gray mustache and a white cook's jacket";
export const HALL = "a carpeted hotel corridor with numbered room doors and warm ceiling lights";
export const I = "img/cltanque/";
export const SHOTS = [
  // ── 0:00 · Claudio a cámara: el secreto
  S(0, "", "av", ""),
  CL(0, "Usted limpia la taza todas las semanas", "c_scrubbowl", `He scrubs the inside of a white toilet bowl with a toilet brush in ${HOTELBATH}, kneeling, the tank lid still on.`, { anim: "he scrubs the bowl with the brush" }),
  ST(0, "todas las semanas", "b_weekcal", "wall calendar marked days", `A small paper calendar on a bathroom wall with every Saturday marked with a check.`),
  ST(0, "Pero esto", "b_tanklidclosed", "toilet tank lid closeup", `Ordinary real footage that shows toilet tank lid closeup.`),
  // ── 0:07 · la tapa
  CL(1, "", "c_liftlid", `He lifts ${LID} with both gloved hands in ${HOTELBATH}, looking down into the tank with a frown.`, { anim: "he lifts the heavy lid off the tank" }),
  ST(1, "Agua marrón", "b_brownwater", "dirty toilet tank water", `${TANK}: ${DIRTY}.`),
  B(1, "Una baba negra en las paredes", "b_blackslime", `Extreme close view of a black slimy biofilm on the inner white ceramic wall of a toilet tank just above the waterline, ${G} touching it, the film smeared.`),
  B(1, "Y una piedra blanca pegada al flotador", "b_crustfloat", `Close view inside a toilet tank of a plastic float and fill valve covered in thick hard white limescale crust, murky water below.`),
  B(1, "pegada al flotador", "b_floatcrust2", `Extreme close view of hard white limescale crust on a plastic toilet tank float, water droplets on it.`),
  ST(1, "Esto es lo que baja a su taza", "b_flushswirl", "toilet flushing water swirl", `Ordinary real footage that shows toilet flushing water swirl.`, { anim: "the water swirls down the bowl" }),
  // ── 0:16 · la promesa con el resultado a la vista
  C(2, "", "ClBeforeAfter", { before: I + "b_tank_before.jpg", after: I + "b_tank_after.jpg", note: "1 litro de vinagre · 1 noche" }),
  B(2, "sin tallar", "b_nobrush", `A toilet brush standing unused in its holder next to a clean white toilet, ${HOMEBATH}.`),
  CL(2, "un litro de vinagre blanco", "c_pourvinegar", `He pours ${VINEGAR} into the empty open tank of a toilet in ${HOTELBATH}, the lid resting on a towel on the floor.`, { anim: "he pours vinegar into the tank" }),
  B(2, "una noche", "b_nightbath", `A dark ${HOMEBATH} at night, the light off, a little blue moonlight from the small window on the toilet with its tank lid on a towel on the floor.`),
  C(2, "y la llave de paso cerrada", "ClValve3D", { label: "Cerrada" }),
  B(2, "Mire este tanque", "b_tank_before", `${TANK}: ${DIRTY}. Bright bathroom light from the ceiling.`),
  B(2, "Y mírelo a la mañana", "b_tankclean", `${TANK}: the inner walls clean bright white, clear water, the float and the fill valve clean gray plastic, a new red rubber flapper at the bottom. Bright bathroom light from the ceiling.`),
  CL(2, "Las paredes blancas", "c_proudtank", `He looks into the clean open tank of a toilet in ${HOTELBATH} and points at it with a satisfied half smile, gloves on.`),
  B(2, "y el flotador limpio", "b_floatclean", `Close view inside a toilet tank of a clean white plastic float and a clean fill valve in clear water.`),
  // ── 0:27 · la falla exacta
  CL(3, "", "c_bleachbowl", `He pours bleach from a white jug with a plain blank label into a toilet bowl in ${HOMEBATH}, the brush in his other hand.`),
  ST(3, "con cloro y con cepillo", "st_brush", "toilet brush cleaning", `Ordinary real footage that shows toilet brush cleaning.`),
  B(3, "Y el martes", "b_streaks", `Close view under the rim of a white toilet bowl: thin brown vertical streaks running down from the rim holes into the water.`),
  B(3, "ya tenía otra vez", "b_rimlook", `Low view under the rim of a white toilet bowl, the first thin brown streaks starting again below the rim holes.`),
  ST(3, "las rayas marrones debajo del borde", "b_streaksclose", "stained toilet bowl rim", `Ordinary real footage that shows stained toilet bowl rim.`),
  CL(3, "Volvió a limpiar", "c_scrubagain", `He kneels again in front of a white toilet in ${HOMEBATH} with the brush, tired, wiping his forehead with his wrist.`),
  B(3, "Y volvieron", "b_streaksback", `A white toilet bowl seen from the front: faint brown streaks under the rim again, a brush in its holder beside it.`),
  // ── 0:37 · no fue culpa suya
  CL(4, "", "c_reassure", `He sits on the edge of a bathtub in ${HOTELBATH} next to the toilet, talking to the camera with a calm open hand.`),
  B(4, "Nadie le dijo", "b_nooneknows", `A closed white toilet tank lid seen from above with a folded hand towel and a small plant on top, ${HOMEBATH}.`),
  B(4, "el problema empieza más arriba", "b_tankfromside", `Side view of an ordinary white toilet with its tank against the wall in ${HOMEBATH}, the camera tilted up toward the tank.`),
  ST(4, "Todo el mundo limpia lo que ve", "st_wipesink", "cleaning bathroom sink", `Ordinary real footage that shows cleaning bathroom sink.`),
  ST(4, "una tapa pesada que nadie levanta", "b_lidheavy", "hands lifting toilet tank lid", `Ordinary real footage that shows hands lifting toilet tank lid.`),
  // ── 0:44 · el culpable: el agua quieta
  ST(5, "", "b_stillwater", "toilet tank inside water", `Ordinary real footage that shows toilet tank inside water.`),
  B(5, "Está ahí, encerrada", "b_lidgap", `Close view of the narrow dark gap between a white toilet tank and its heavy ceramic lid.`),
  ST(5, "a oscuras, todo el día", "b_darktank", "dark bathroom toilet night", `Ordinary real footage that shows dark bathroom toilet night.`),
  ST(5, "Y cada descarga le manda a la taza", "b_handle", "hand flushing toilet handle", `Ordinary real footage that shows hand flushing toilet handle.`, { anim: "the hand presses the flush handle" }),
  // ── 0:50 · los tres loops
  CL(6, "", "c_threefingers", `He holds up three gloved fingers to the camera next to the open tank of a toilet in ${HOTELBATH}.`),
  ST(6, "Qué hace la pastilla azul", "b_bluetablet", "blue toilet tablet", `Ordinary real footage that shows blue toilet tablet.`),
  ST(6, "La prueba de las gotas de colorante", "b_dyedrops", "food coloring drops water", `${G} squeezing drops of blue food coloring from a small plain bottle into the clear water of an open toilet tank.`, { anim: "blue drops fall and spread in the water" }),
  ST(6, "si su inodoro le está robando agua", "b_tankrunning", "running toilet water bowl", `Ordinary real footage that shows running toilet water bowl.`),
  ST(6, "el error que vi romper más tapas", "b_brokenlid", "broken ceramic pieces floor", `Ordinary real footage that shows broken ceramic pieces floor.`),
  // ── 1:00 · Claudio
  C(7, "", "ClHallway3D", { total: 180, floor: 3, title: "inodoros", sub: "cada tanque, una vez por mes" }),
  CL(7, "Y cada tanque", "c_hallcart", `He pushes a maintenance cart with a bucket and tools down ${HALL}, a ring of room keys on his belt.`),
  CL(7, "pasaba por mis manos", "c_tankroom", `He kneels beside an open toilet tank in ${HOTELBATH}, looking inside with a small flashlight.`),
  // ── 1:10 · CTA 1 (frase fija)
  CL(8, "", "c_bookhold", `He holds a thick printed spiral-bound book with a plain brown cover in ${HOTELBATH}, showing it to the camera.`),
  ST(8, "me prometí escribir todo lo que aprendí", "b_notebookdesk", "old notebook handwritten notes desk", `An old worn notebook with handwritten notes open on a small desk in a hotel maintenance room, a pen and a pair of blue nitrile gloves beside it.`),
  C(8, "Un libro", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "94 ARREGLOS · PÁGINAS 7 Y 53", text: "el link está abajo" }),
  C(8, "La rutina del tanque está en la página cincuenta y tres", "ClBookPage", { page: I + "book_p53.jpg", pageNo: 53, stamp: "Página 53" }),
  C(8, "y la tabla de lo que nunca se mezcla", "ClBookPage", { page: I + "book_p7.jpg", pageNo: 7, stamp: "Página 7" }),
  // ── el gerente y Rosa
  CL(9, "", "c_manager", `He stands in ${HALL} next to ${MANAGER}, who reads from his notebook with a worried face.`),
  C(9, "inodoro que corre", "ClNotebook", { title: "La libreta del gerente", rows: [{ k: "312", v: "inodoro que corre" }, { k: "208", v: "inodoro que corre" }, { k: "115", v: "inodoro que corre" }], note: "agua todo el mes" }),
  B(9, "gasta agua todo el mes", "b_waterbill", `A paper water bill on a desk with a calculator and reading glasses, the numbers too small to read, no logos.`),
  CL(10, "", "c_rosahall", `${ROSA} talks to him in ${HALL}, pointing back toward an open room door, he listens holding his toolbox.`),
  ST(10, "el inodoro hace ruido solo", "b_room312", "hotel room door open corridor", `Ordinary real footage that shows hotel room door open corridor.`),
  CL(10, "había que levantar la tapa", "c_lidlift2", `He lifts ${LID} in ${HOTELBATH} and looks inside with a knowing nod.`),
  // ── callback clsarro
  C(11, "", "ClVideoRef", { thumb: I + "th_clsarro.jpg", title: "El sarro del inodoro", tag: "ya en el canal" }),
  ST(11, "Muchas de esas manchas nacen acá arriba", "b_tankbowl", "dirty toilet from above", `Ordinary real footage that shows dirty toilet from above.`),
  // ── QUÉ ES
  C(12, "", "ClChapter", { n: 1, label: "PRIMERO", title: "Qué hay adentro", sub: "y con qué sale" }),
  ST(12, "Porque si sabe qué es", "b_lookinside", "flashlight looking inside toilet tank", `Ordinary real footage that shows flashlight looking inside toilet tank.`),
  C(13, "", "ClPins", { img: I + "b_tankpins.jpg", pins: [{ x: 0.32, y: 0.32, label: "Hierro" }, { x: 0.62, y: 0.42, label: "Sarro" }, { x: 0.45, y: 0.72, label: "Baba" }] }),
  ST(13, "Hierro, sobre todo", "b_orangestain", "rust stain porcelain", `Extreme close view of orange-brown iron stains on the white inner ceramic wall of a toilet tank, a dry tide line above the water.`),
  ST(13, "descarga tras descarga", "st_tapwater", "water tap running", `Ordinary real footage that shows water tap running.`),
  ST(14, "", "b_scalefloat", "limescale buildup closeup", `Extreme close view of thick white limescale crust on a plastic toilet float, the texture rough like stone.`),
  ST(14, "Piedra del agua dura", "b_scaletap", "limescale faucet closeup", `${G} scraping a little white limescale from a plastic part with a fingernail, white flakes falling.`),
  ST(14, "en la regadera", "b_showerheadscale", "limescale shower head", `Close view of a chrome shower head with white limescale clogging many of its holes.`),
  ST(15, "", "b_slimeglove", "gloved hand cleaning toilet", `Ordinary real footage that shows gloved hand cleaning toilet.`),
  ST(15, "Bacterias que viven en el agua quieta", "b_slimemacro", "black mold bathroom closeup", `Ordinary real footage that shows black mold bathroom closeup.`),
  C(16, "", "ClSplit", { img: I + "b_tankpins.jpg", left: ["LA PIEDRA", "sale con vinagre"], right: ["LA BABA", "sale con el frasco marrón"] }),
  C(16, "Nunca los dos el mismo día", "ClTwoDays", { d1: ["DÍA 1", "Vinagre blanco", "1 litro · toda la noche", "#3E6E8E"], d2: ["OTRO DÍA", "Frasco marrón", "½ taza por el tubo · 30 min", "#5A3418"], stamp: "Nunca el mismo día" }),
  CL(17, "", "c_twobottles", `He holds ${VINEGAR} in one hand and ${BROWN} in the other, apart from each other, in ${HOTELBATH}.`),
  ST(17, "Y en el medio, una descarga", "b_flushmid", "flushing toilet water", `Ordinary real footage that shows flushing toilet water.`),
  // ── la historia de la 312
  CL(18, "", "c_young", `A younger version of the scene: he walks down ${HALL} carrying a toolbox, looking at a door number.`),
  ST(18, "el gerente me mandó a la trescientos doce", "b_door312", "hotel room number door", `Ordinary real footage that shows hotel room number door.`),
  ST(18, "corría toda la noche", "b_runningnight", "bathroom at night dark", `Ordinary real footage that shows bathroom at night dark.`),
  CL(19, "", "c_findtablet", `He looks into an open toilet tank in ${HOTELBATH} and lifts out ${TABLET} between two gloved fingers, frowning.`),
  ST(19, "tirada en el fondo del tanque", "b_tabletbottom", "blue tablet dissolving water", `Ordinary real footage that shows blue tablet dissolving water.`),
  ST(19, "para que el agua saliera azul", "b_bluebowl", "blue water toilet bowl", `Ordinary real footage that shows blue water toilet bowl.`),
  CL(20, "", "c_pullflapper", `He pulls an old rubber toilet flapper out of the tank with gloved hands in ${HOTELBATH}, holding it up to look at it.`),
  C(20, "La goma estaba hinchada", "ClFlapperBite", { hi: 1 }),
  ST(20, "Se deshacía entre los dedos", "b_flappermush", "old rubber gasket closeup", `Ordinary real footage that shows old rubber gasket closeup.`),
  CL(21, "", "c_ramiro", `${RAMIRO} laughs in ${HALL} as he holds up the swollen black rubber flapper for him to see.`),
  CL(21, "Tenía razón", "c_nodflapper", `He looks at the deformed rubber flapper in his gloved hand in ${HALL} and nods with a resigned smile.`),
  ST(21, "el que dejaba pasar el agua toda la noche", "b_leakflapper", "toilet tank mechanism inside", `Close view inside a toilet tank of water leaking past the edge of a deformed rubber flapper into the drain hole, small bubbles.`),
  CL(22, "", "c_newflapper", `He fits a new red rubber flapper over the drain hole inside a toilet tank in ${HOTELBATH}.`, { anim: "he presses the new flapper into place" }),
  ST(22, "se prohibieron las pastillas de cloro", "b_tabletsbin", "trash bin bathroom", `Ordinary real footage that shows trash bin bathroom.`),
  CL(22, "el tanque se limpiaba con vinagre una noche", "c_vinegarshelf", `He takes ${VINEGAR} from a shelf in a hotel maintenance storeroom with mops and buckets.`),
];
