// DIRECTOR A — clmampara: MINUTO 1 (la mampara mitad blanca / mitad transparente → "eso blanco es piedra" → PROMESA vinagre tibio +
// detergente + 15 min con el antes/después → la falla (limpiavidrios) → "no fue culpa suya" → el culpable (agua dura) → 3 loops)
// + INTRO + CTA 1 + el gerente y Rosa + callback a clsarro + QUÉ ES + la historia de la tetera de Don Ramiro (párr. 0-24).
import { S, BI, CLP } from "../claudio/lib.mjs";
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const CL = (p, at, name, scene, o = {}) => S(p, at, "cl", name, { p: CLP(scene), ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: BI(scene), ...o });
export const G = "a hand in a blue nitrile glove";
export const BROWN = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
export const VINEGAR = "a clear plastic bottle of white vinegar with a plain blank white label";
export const SOAP = "a clear bottle of green dish soap with a plain blank label";
export const SPRAY = "a clear plastic spray bottle with a plain blank label";
export const HOMESHOWER = "an ordinary home shower with white wall tiles and a clear glass shower screen with a chrome frame";
export const HOTELSHOWER = "a mid-range hotel guest bathroom with beige-cream ceramic wall tiles and a glass shower screen with a chrome frame";
export const CLOUDY = "a glass shower screen covered in a cloudy white haze of hard-water limescale, opaque";
export const CLEARG = "a perfectly clear clean glass shower screen, you can see the tiles behind it";
export const ROSA = "Rosa, a hotel housekeeper in her fifties with dark hair in a bun and a light-blue housekeeping uniform";
export const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie, holding a small black notebook";
export const RAMIRO = "Don Ramiro, the hotel cook in his sixties with a gray mustache, a white cook's jacket and a long apron";
export const HALL = "a carpeted hotel corridor with numbered room doors and warm ceiling lights";
export const I = "img/clmampara/";
export const SHOTS = [
  // ── 0:00 · Claudio a cámara: la mampara mitad y mitad
  S(0, "", "av", ""),
  B(0, "niebla", "b_halfcloudy", `${CLOUDY} in ${HOMESHOWER}, seen from outside the shower.`),
  CL(0, "esta mitad", "c_halfline", `He points with a gloved finger at a glass shower screen whose left half is cloudy white and right half perfectly clear, in ${HOTELSHOWER}.`),
  B(0, "Se ve la ducha del otro lado", "b_clearhalf", `${CLEARG} in ${HOMESHOWER}, the chrome shower head visible through it.`),
  CL(1, "", "c_glassfinger", `He runs a gloved finger across a cloudy white glass shower screen in ${HOTELSHOWER}, looking at the camera.`),
  ST(1, "eso blanco no es mugre", "b_scalemacro", "limescale glass macro", `Extreme close view of white hard-water limescale spots on glass.`),
  ST(1, "Es piedra", "b_stone", "white mineral rock texture", `Close view of a rough white mineral crust.`),
  ST(1, "el agua oxigenada no sirve", "b_brownno", "brown bottle bathroom shelf", `${BROWN} on a bathroom shelf.`),
  ST(1, "no sirve", "b_nosirve", "bathroom cleaning bottles", `Cleaning bottles on a bathroom shelf.`),
  C(2, "", "ClBeforeAfter", { before: I + "b_ba_before.jpg", after: I + "b_ba_after.jpg", note: "2 tazas de vinagre tibio · 15 min" }),
  ST(2, "sin rayar el vidrio", "b_noscratch", "clean glass closeup", `Close view of clean glass.`),
  ST(2, "dos tazas de vinagre tibio", "b_vinegarcups", "pouring vinegar measuring cup", `White vinegar poured into a glass measuring cup.`),
  ST(2, "una cucharada de detergente de platos", "b_soapspoon", "dish soap spoon", `A spoonful of green dish soap.`),
  C(2, "y quince minutos", "ClTimer30", { minutes: 15, label: "En el vidrio", fast: true }),
  B(2, "Mire el vidrio antes", "b_before", `${CLOUDY} in ${HOMESHOWER}.`),
  B(2, "Y mírelo después", "b_after", `${CLEARG} in ${HOMESHOWER}, water drops shining.`),
  ST(2, "Transparente otra vez", "b_clearshine", "clean glass shower door", `A clean clear glass shower door in a bright bathroom.`),
  ST(3, "", "b_glasscleaner", "spraying glass cleaner", `${G} spraying blue glass cleaner on glass.`),
  ST(3, "roció", "b_sprayglass2", "spraying window cleaner", `Spraying window cleaner on glass.`),
  ST(3, "pasó el trapo", "b_wipecloth", "wiping glass cloth", `A hand wiping glass with a cloth.`),
  ST(3, "Quedó brillante un rato", "b_wetshine", "wet glass shower door", `A wet glass shower door shining.`),
  ST(3, "cuando se secó", "b_drying", "glass drying", `Glass drying after cleaning.`),
  B(3, "la nube blanca estaba ahí", "b_cloudback", `${CLOUDY}, dry, in ${HOMESHOWER}.`),
  ST(3, "igual que antes", "b_samecloud", "dirty glass shower door spots", `A glass shower door with white spots.`),
  CL(4, "", "c_reassure", `He leans on the bathroom sink counter in ${HOTELSHOWER}, talking to the camera with a calm open hand.`),
  ST(4, "Nadie le dijo", "b_cleanerbottle", "glass cleaner bottle", `A blue glass cleaner spray bottle, plain label.`),
  ST(4, "saca la tierra", "b_fingerprints", "dusty glass surface", `Dust on a glass surface.`),
  ST(4, "las marcas de los dedos", "b_smudge", "fingerprints on glass", `Fingerprint smudges on a glass surface.`),
  ST(4, "Pero la piedra no es tierra", "b_hardspots", "hard water spots glass", `Hard water spots on glass.`),
  ST(5, "", "b_showerrun", "shower running water", `Water running from a shower head in a tiled shower.`),
  ST(5, "Cada ducha deja gotitas en el vidrio", "b_drops", "water drops glass", `Water drops on a glass shower screen.`),
  ST(5, "La gotita se seca", "b_dropmacro", "water droplet macro glass", `Extreme close view of one water drop on glass.`),
  ST(5, "Encima, el jabón", "b_soapfoam", "soap foam shower", `Soap foam sliding down a glass shower screen.`),
  ST(5, "Y así, todos los días", "b_dailyshower", "person taking shower glass door", `A blurred person showering behind a glass shower door, no face.`),
  CL(6, "", "c_threefingers", `He holds up three gloved fingers to the camera in ${HOTELSHOWER}, the glass shower screen behind him.`),
  C(6, "El truco del detergente", "ClSprayCling", { hi: 0 }),
  C(6, "La prueba del vidrio mojado", "ClWetTest", { hi: 0 }),
  ST(6, "Y los veinte segundos", "b_squeegee", "squeegee shower glass", `A rubber squeegee wiping a glass shower door.`),
  // ── intro
  C(7, "", "ClHallway3D", { total: 180, floor: 2, title: "habitaciones", sub: "y una mampara en cada baño" }),
  ST(7, "cada baño tenía su mampara de vidrio", "b_hotelbath", "hotel bathroom glass shower", `A hotel bathroom with a glass shower screen.`),
  // ── CTA 1 (~1:40)
  CL(8, "", "c_bookhold", `He holds a thick printed spiral-bound book with a plain brown cover in ${HOTELSHOWER}, tapping its cover.`),
  ST(8, "me prometí escribir todo lo que aprendí", "b_notebookdesk", "old notebook handwritten notes desk", `An old worn notebook with handwritten notes open on a small desk.`),
  S(8, "Y lo escribí", "av", ""),
  C(8, "Un libro", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", head: "94 ARREGLOS · PÁGINAS 7 Y 18", text: "el link está abajo" }),
  C(8, "La mampara está en la página dieciocho", "ClBookPage", { page: I + "book_p18.jpg", pageNo: 18, stamp: "La mampara" }),
  C(8, "y la tabla de lo que nunca se mezcla", "ClBookPage", { page: I + "book_p7.jpg", pageNo: 7, stamp: "Página 7" }),
  // ── el gerente y Rosa
  CL(9, "", "c_manager", `${MANAGER} reads from his notebook next to him in ${HALL}; he listens, holding a spray bottle.`),
  C(9, "mampara sucia", "ClNotebook", { title: "La libreta del gerente", rows: [{ k: "Hab. 204", v: "mampara sucia" }, { k: "Hab. 311", v: "mampara sucia" }], note: "y estaba limpia" }),
  ST(9, "el vidrio estaba limpio", "b_guestbath", "hotel bathroom guest", `A hotel guest bathroom with a glass shower, towels folded.`),
  CL(10, "", "c_rosaangry", `He stands in ${HOTELSHOWER} next to ${ROSA}, who holds a cloth and a spray bottle and gestures, frustrated.`),
  ST(10, "la limpié esta mañana", "b_rosaclean", "housekeeper cleaning bathroom", `A housekeeper cleaning a hotel bathroom, seen from behind.`),
  ST(10, "estaba limpiando otra cosa", "b_wipingglass", "cleaning glass shower", `Someone wiping a glass shower door with a cloth.`),
  C(11, "", "ClVideoRef", { thumb: I + "th_clsarro.jpg", title: "El sarro del inodoro", tag: "ya en el canal" }),
  ST(11, "La de la mampara es la misma piedra", "b_scaletoilet", "limescale toilet bowl", `White limescale ring in a toilet bowl.`),
  B(11, "acá se ve a contraluz", "b_backlit", `${CLOUDY} lit from behind by the bathroom window, every white spot glowing.`),
  // ── qué es
  C(12, "", "ClChapter", { n: 1, label: "PRIMERO", title: "Qué es la nube blanca", sub: "y con qué sale" }),
  ST(12, "Porque si sabe qué es", "b_cloudyclose", "foggy glass texture", `Close view of white cloudy haze on a glass surface.`),
  ST(13, "Es sarro", "b_sarro", "limescale buildup closeup", `Close view of white limescale.`),
  ST(13, "Minerales del agua", "b_tapwater", "tap water glass", `Tap water pouring into a glass.`),
  ST(13, "El agua se evapora", "b_evap", "water drops drying", `Water drops drying on a surface.`),
  ST(13, "los minerales se quedan pegados en el vidrio", "b_mineralspots", "water spots glass closeup", `White mineral spots on glass, close view.`),
  ST(14, "", "b_shampoo", "shampoo bottles shower", `Shampoo bottles on a shower shelf.`),
  C(14, "Por eso a veces se siente como una película", "ClPins", { img: I + "b_glasspins.jpg", pins: [{ x: 0.3, y: 0.35, label: "Sarro" }, { x: 0.62, y: 0.42, label: "Jabón" }, { x: 0.45, y: 0.72, label: "Champú" }] }),
  ST(14, "áspera, cuando le pasa el dedo", "b_fingerglass", "finger touching glass", `A fingertip touching a glass surface.`),
  ST(15, "", "b_bathlight", "bathroom light morning", `A bathroom lit by its ceiling light.`),
  ST(15, "mojada y seca", "b_wetdry", "wet glass shower door drops", `A glass shower door with drops of water.`),
  CL(16, "", "c_honest", `He holds ${BROWN} in one hand and ${VINEGAR} in the other in ${HOTELSHOWER}, talking to the camera.`),
  C(16, "el agua oxigenada no disuelve el sarro", "ClDoDont", { yes: { label: "Moho: frasco marrón", img: I + "b_moldrail.jpg" }, no: { label: "Piedra: no", img: I + "b_scalemacro.jpg" } }),
  ST(16, "para lo negro, para el moho", "b_blackmold", "black mold shower", `Black mold in shower silicone.`),
  ST(16, "el que trabaja es el vinagre", "b_vinegarbottle", "white vinegar bottle", `${VINEGAR} on a bathroom counter.`),
  B(17, "", "b_blackrail", `Close view of black mold in the bottom aluminum rail and rubber seal of a glass shower door.`),
  ST(17, "Pero otro día", "b_calendar", "calendar page", `A paper wall calendar.`),
  C(18, "", "ClTwoDays", { d1: ["UN DÍA", "El vidrio", "vinagre tibio · detergente", "#3E6E8E"], d2: ["OTRO DÍA", "Los rieles", "agua oxigenada · 10 min", "#8B5A2B"], stamp: "Nunca juntos" }),
  // ── la historia
  CL(19, "", "c_young", `He sprays a cloudy glass shower screen with ${BROWN} and scrubs it hard with a cloth in ${HOTELSHOWER}.`),
  ST(19, "yo hacía lo que hacía Rosa", "b_sprayscrub", "spraying cleaning shower glass", `${G} spraying a glass shower door.`),
  ST(20, "", "b_scrubhard", "scrubbing glass hard", `A hand scrubbing glass hard with a cloth.`),
  ST(20, "Quedaba un poquito mejor, mojada", "b_wetglass", "wet glass shower", `Wet glass shower screen with drops.`),
  B(20, "otra vez blanca", "b_whiteagain", `${CLOUDY}, dry again.`),
  CL(21, "", "c_ramiro", `He talks with ${RAMIRO} in a hotel service corridor; Ramiro gestures with an old metal kettle in his hand.`),
  ST(21, "lo mismo que se junta en mi tetera", "b_kettle", "limescale kettle", `White limescale inside an old kettle.`),
  ST(21, "la limpio con vinagre caliente", "b_kettlevinegar", "kettle stove", `An old kettle on a stove.`),
  ST(22, "", "b_door204", "hotel room door number", `A hotel room door with a brass number plaque.`),
  ST(22, "Vinagre tibio en el rociador", "b_fillspray", "filling spray bottle", `Filling a clear spray bottle.`),
  C(22, "A los quince minutos", "ClTimer30", { minutes: 15, label: "La 204", fast: true }),
  B(23, "", "b_halfclear", `A glass shower screen in ${HOTELSHOWER}: the left half perfectly clear, the right half still cloudy white.`),
  CL(23, "Llamé a Rosa para que la viera", "c_rosalook", `He and ${ROSA} look at a half-clear glass shower screen in ${HOTELSHOWER}; she leans in, surprised.`),
  ST(23, "el frasco marrón quedó para los rieles", "b_railbrown", "shower door track", `The bottom track of a shower door.`),
  CL(24, "", "c_rosatalk", `${ROSA} stares at a clear glass shower screen in ${HOTELSHOWER} while he stands beside her, smiling kindly.`),
  ST(24, "todos estos años estuve frotando para nada", "b_tiredhands", "tired hands cleaning cloth", `Tired hands holding a cleaning cloth.`),
  ST(24, "La piedra era otra cosa", "b_scaledrip", "limescale buildup closeup", `Close view of limescale buildup.`),
];
