// DIRECTOR A — clmoho: MINUTO 1 (Claudio a cámara + el cloro rociado sobre el moho que se pone blanco en el seg 1 → "No lo mató" con
// sello → a la semana vuelve → "Lo pintó" → PROMESA con antes/después de la junta → números (puro, 10 min, cepillo, toalla) → el techo
// de las duchas del personal pintado 3 veces → ráfaga del arreglo → "¡Blanco de verdad!" → 3 loops (por qué el cloro miente, el error
// que lo desparrama, la 220) → capítulo) + EL ARREGLO ENTERO (6 pasos) + CTA 1 página 12 (párrafos 0-17).
import { S, BI, CLP } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const G = "a hand in a blue nitrile glove";
const I = "img/clmoho/";
export const SHOWER = "a hotel guest shower with beige-cream ceramic wall tiles, gray grout lines and a white silicone caulk line along the bottom where the tiles meet the white shower tray";
export const MOLD = "black mold spots and speckles in the grout lines and along the white silicone caulk in the corner of a tiled hotel shower";
export const BOTTLE = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label and a white trigger sprayer screwed straight onto it";
export const JUG = "a plain white plastic bleach jug with a blank label";
export const SHOTS = [
  // ── 0:00 · Claudio a cámara → el cloro sobre el moho que se pone blanco
  S(0, "", "av", ""),
  S(0, "Parece que lo mató", "kf", "k_bleach", { p: BI(`Close view of ${MOLD}: a gloved hand sprays clear liquid from a white spray bottle with a blank label onto the black spots, which turn pale white where the spray lands.`), d1: "the white spray bottle points at the black mold in the grout", d2: "the mist lands and the black spots fade to pale white", sound: "two squirts of a spray bottle" }),
  S(0, "No lo mató", "bi", "b_whitened", { p: BI(`Extreme close view of the grout and silicone caulk in the corner of a tiled shower right after bleach: the mold spots look bleached pale white and gray, wet, faint gray shadows still inside the grout.`), ov: { c: "ClStampOv", props: { text: "NO LO MATÓ" } } }),
  // ── a la semana vuelve
  S(1, "", "bi", "b_weeklater", { p: BI(`The same shower corner one week later: ${MOLD}, the black dots back in exactly the same places, a little dried water on the tiles.`), ov: { c: "ClChip", props: { text: "Una semana después", alert: true } } }),
  S(1, "Usted no lo limpió", "bi", "b_paintroller", { p: BI("A paint roller with white paint rolling over a gray-spotted bathroom ceiling corner, covering the black spots.") }),
  S(1, "Lo pintó", "av", ""),
  // ── 0:07 · LA PROMESA
  C(2, "", "ClBeforeAfter", { before: I + "b_molddirty.jpg", after: I + "b_moldclean_ab.jpg", note: "puro · 10 minutos" }),
  S(2, "El frasco marrón puro", "bi", "b_bottleshower", { p: BI(`${BOTTLE} standing on the edge of a white shower tray in ${SHOWER}, drops of water on it.`) }),
  S(2, "diez minutos", "bi", "st_watchtimer", { q: "kitchen timer countdown", p: BI("A white kitchen timer on a bathroom counter.") }),
  S(2, "un cepillo", "bi", "b_groutbrush", { p: BI(`${G} scrubbing a grout line between beige shower tiles with a narrow grout brush, gray foam lifting.`), anim: "the brush scrubs along the grout line" }),
  S(2, "y una toalla seca", "bi", "b_drytowel", { p: BI(`${G} wiping the wet tiles and grout of a shower corner dry with a folded white towel.`) }),
  S(2, "Así estaba", "cl", "c_before", { p: CLP(`He crouches in ${SHOWER}, pointing a gloved finger at the black moldy silicone in the corner, his face screwed up in disgust, looking at the camera.`), ov: { c: "ClChip", props: { text: "Antes", alert: true } } }),
  S(2, "Así quedó", "cl", "c_after", { p: CLP(`He crouches in the same hotel shower, the grout and silicone in the corner now clean and white, a towel over his shoulder, grinning and giving a thumbs-up to the camera.`), ov: { c: "ClChip", props: { text: "Después" } } }),
  // ── 0:15 · el hotel: el techo de las duchas del personal, 3 veces
  S(3, "", "cl", "c_staffshowers", { p: CLP("He walks into a row of tiled staff shower stalls in the basement of a hotel, looking up at the ceiling with a flashlight in his hand, then glancing at the camera."), anim: "he walks slowly in looking up", ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de conserje de hotel" } } }),
  S(3, "el techo de las duchas del personal", "bi", "b_ceilingmold", { p: BI("Looking up at the white painted ceiling over a row of staff showers: big gray-black patches of mold spreading from the corners, peeling paint.") }),
  S(3, "lo pintamos con cloro", "bi", "b_ceilingbleach", { p: BI(`${G} holding a sponge mop dripping with liquid up against a moldy shower ceiling, a white bleach jug with a blank label on the floor.`) }),
  S(3, "tres veces en un año", "bi", "st_calendar", { q: "calendar pages flipping", p: BI("A paper wall calendar, pages turning.") }),
  S(3, "Las tres veces volvió", "bi", "b_ceilingback", { p: BI("Looking up at a staff shower room ceiling freshly painted white with gray-black mold spots already showing through the new paint in the corners. Nobody in the room, only the ceiling and the top of the tiled walls.") }),
  // ── 0:26 · la ráfaga
  S(4, "", "av", ""),
  S(4, "Agua sola primero", "bi", "st_showerhead", { q: "shower head water spray tiles", p: BI("A handheld shower head spraying water onto bathroom wall tiles.") }),
  S(4, "Rocío puro", "kf", "k_spray", { p: BI(`Close view of ${G} holding ${BOTTLE}, spraying the black moldy silicone and grout in the corner of ${SHOWER} until it shines wet.`), d1: "the sprayer points at the black corner", d2: "the mist soaks the black silicone and it glistens and drips", sound: "two quick squirts of a trigger spray bottle" }),
  C(4, "Diez minutos sin tocar", "ClTimer30", { minutes: 10, fast: true }),
  S(4, "Cepillo en las juntas", "bi", "b_toothbrushgrout", { p: BI(`Extreme close view of an old toothbrush in ${G} scrubbing along a grout line with black mold, gray foam rising and the grout turning lighter behind the bristles.`), anim: "the toothbrush scrubs along the grout" }),
  S(4, "Enjuague", "bi", "b_rinse", { p: BI(`A handheld shower head held by ${G} rinsing clean water down the tiles and grout of a shower corner from top to bottom.`), anim: "clear water runs down the tiles" }),
  S(4, "secar", "kf", "k_squeegee", { p: BI(`Close view of ${G} pulling a rubber squeegee down a wet tiled shower wall, the water sheeting off and the grout lines clean.`), d1: "the squeegee rests at the top of the wet tile wall", d2: "the squeegee pulls down and the wall is left dry", sound: "the rubbery squeak of a squeegee on glass tile" }),
  S(5, "", "cl", "c_wow", { p: CLP(`He crouches in ${SHOWER} next to a spotless white corner, a squeegee in one gloved hand, leaning back with a delighted laugh, mouth open, looking at the camera.`) }),
  // ── 0:42 · los 3 loops
  S(6, "", "av", ""),
  C(6, "Por qué el cloro le miente", "ClPores3D", { mode: "bleach", labels: { top: "Se pone blanco", roots: "Abajo, vivo" } }),
  C(6, "El error que le desparrama el moho", "ClSpores", { img: I + "b_showerwide.jpg" }),
  S(6, "detrás de un azulejo", "bi", "b_tileoff", { p: BI("A shower wall with two beige tiles removed, revealing a dark damp patch of wall and the edge of an old copper pipe with a green crusty joint behind, a flat bar and tiles on the floor.") }),
  S(6, "de la habitación doscientos veinte", "bi", "b_door220", { p: BI("A wooden hotel room door in a corridor with navy carpet, a brass room number plate on it, the door ajar.") }),
  C(6, "Primero el arreglo entero", "ClChapter", { n: 1, title: "El arreglo entero", sub: "seis pasos, uno se olvida siempre" }),
  // ── 1:00 · la cadena con el video 1
  S(7, "", "av", ""),
  C(7, "el del borde del inodoro", "ClVideoRef", { thumb: I + "th_clborde.jpg", title: "El borde del inodoro" }),
  C(7, "Con el moho de la ducha pasa exactamente lo mismo", "ClSplit", { img: I + "b_molddirty.jpg", left: ["CLORO", "le saca el color"], right: ["AGUA OXIGENADA", "entra en el poro"] }),
  // ── lo que necesita
  C(8, "", "ClCheck", { title: "Lo que necesita", items: ["Agua oxigenada 3 %", "Rociador en el frasco", "Cepillo de juntas", "Toalla o secador", "Guantes y ventana"] }),
  S(8, "con el rociador enroscado", "bi", "b_screwsprayer", { p: BI(`${G} screwing a white trigger sprayer straight onto ${BOTTLE.replace(" and a white trigger sprayer screwed straight onto it", "")} on a bathroom counter.`) }),
  // ── la regla
  C(9, "", "ClNeverMix", { a: "Cloro", b: "Agua oxigenada", verdict: "Nunca el mismo día", short: true }),
  // ── 1. agua sola
  C(10, "", "ClChapter", { n: 1, label: "PASO", title: "Agua sola", sub: "para que no vuele" }),
  S(10, "moje la zona con agua sola", "bi", "b_wetfirst", { p: BI(`${G} wetting a moldy shower corner with plain water from a handheld shower head, water running over the black grout.`), anim: "the water runs over the grout" }),
  S(10, "Es para que el moho no vuele", "av", ""),
  // ── 2. rocío puro
  C(11, "", "ClChapter", { n: 2, label: "PASO", title: "Rocío puro", sub: "hasta empapar" }),
  S(11, "sobre las juntas y la silicona", "bi", "st_spraytile", { q: "spraying cleaner bathroom tiles", p: BI("Spraying cleaner on bathroom tiles.") }),
  S(11, "que gotee un poquito", "bi", "b_drips", { p: BI(`Extreme close view of ${MOLD}, soaked and glistening with clear liquid, drops running down the silicone.`), anim: "a drop runs slowly down the silicone" }),
  // ── 3. diez minutos
  C(12, "", "ClTimer30", { minutes: 10, label: "No lo toque" }),
  S(12, "rocían y frotan enseguida", "bi", "b_rushscrub", { p: BI(`${G} spraying and scrubbing a moldy shower corner at the same time in a hurry, foam everywhere.`) }),
  C(12, "Va a ver burbujitas chiquitas", "ClPores3D", { mode: "peroxide", labels: { liquid: "Baja por los poros", roots: "Las raíces" } }),
  // ── 4. cepillo
  C(13, "", "ClChapter", { n: 4, label: "PASO", title: "Cepillo", sub: "a lo largo, como peinando" }),
  S(13, "Frote las juntas a lo largo", "bi", "b_groutalong", { p: BI(`${G} brushing a grout line lengthwise with a narrow stiff grout brush, black gunk lifting off gray.`), anim: "the brush moves along the grout line" }),
  S(13, "y la silicona suave", "bi", "b_siliconesoft", { p: BI(`${G} gently brushing the silicone caulk line at the bottom of a shower with a soft old toothbrush.`) }),
  // ── 5. enjuague
  S(14, "", "bi", "st_rinsetiles", { q: "rinsing shower wall water", p: BI("Water running down a tiled shower wall.") }),
  // ── 6. secar
  C(15, "", "ClChapter", { n: 6, label: "PASO", title: "Secar", sub: "el que nadie hace" }),
  S(15, "Con la toalla o el secador de goma", "bi", "st_squeegee", { q: "squeegee shower glass", p: BI("A squeegee wiping a wet shower wall.") }),
  S(15, "los rincones", "bi", "b_cornerdry", { p: BI(`${G} pressing a folded white towel into the corner of a shower where the tiles meet the tray, drying the silicone.`) }),
  S(15, "Secar es la mitad del arreglo", "av", ""),
  // ── repaso
  C(16, "", "ClCheck", { title: "El arreglo entero", items: ["Agua sola", "Rocío puro hasta empapar", "10 minutos sin tocar", "Cepillo y enjuague", "Secar"], fast: true }),
  // ── CTA 1
  S(17, "", "av", ""),
  C(17, "en la página doce", "ClBookPage", { page: I + "book_p12.jpg", pageNo: 12, qr: I + "qr.jpg", stamp: "Gratis en la página" }),
  C(17, "Apunte el celular", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "la página 12 entera, gratis" }),
];
