// DIRECTOR B — jphigiene: reglas 4 (desodorante), 5 (ropa al sol), 6 (la tela + mención 2 "la rutina completa, pág. 9") y 7 (la que
// casi todos rompemos: entre los dedos y los zapatos; se paga el loop "tu toalla huele a pies"). Párrafos 21-40.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH } from "../claudio/lib.mjs";
import { H, SATOP } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jphigiene/";
const STAFF2 = "a line of Japanese hotel housekeeping staff in dark navy uniforms standing in a quiet hotel corridor, looking ahead in silence";
export const SHOTS = [
  // ══ REGLA 4 · el desodorante
  C(21, "", "ClRule", { n: 4, title: "El desodorante", sub: "primero se saca, después se pone" }),
  S(21, "En el vestuario del hotel había toallitas húmedas", "bi", "b_wipes", { q: "wet wipes pack", p: BI("A pack of body wet wipes with a plain blank label on the shelf of a hotel staff locker room, next to a mirror and a folded uniform.") }),
  S(21, "me vio ponerme desodorante", "bi", "b_deoshirt", { p: BI("A man in an open red polo shirt in a locker room, seen from the side, spraying deodorant under his raised arm, the shirt collar damp.") }),
  S(21, "y me pasó una toallita", "bi", "b_handwipe", { p: BI(`${SATO} holding out a single folded wet wipe toward a man's hand in a hotel staff locker room, close view of the two hands.`) }),
  C(21, "Primero se saca", "ClSato", { img: SATOP, quote: "Primero se saca. Después se pone." }),
  S(22, "", "bi", "b_dampunder", { p: BI(`A man in ${BATH} just out of the shower, a towel around his neck, reaching for a deodorant stick with a blank label on the shelf, his skin still wet.`) }),
  S(22, "a las siete de la mañana", "bi", "b_clock7", { q: "alarm clock morning", p: BI("A simple alarm clock showing seven o'clock on a light-wood bedside table, morning light through thin curtains.") }),
  S(22, "las doce horas en las que más sudamos", "bi", "b_busheat", { q: "crowded bus commute", p: BI("A crowded city bus on a hot morning in Latin America, passengers holding the bars, sun through the windows.") }),
  S(23, "", "bi", "b_nightdeo", { p: BI(`A deodorant stick with a blank white label on a light-wood bedside table at night, a lamp on, a folded pajama on the bed in ${HOUSE}.`) }),
  S(23, "no es sólo sudor", "bi", "b_yellowstain", { q: "sweat stain shirt", p: BI("Close view of the armpit area of a white cotton shirt laid on a table, a faint yellow stain on the fabric.") }),
  S(24, "", "cl", "c_armwash", { p: CLP(`He stands at the sink of ${BATH} with his polo sleeve rolled up, lathering a bar of white soap between his hands, explaining to the camera.`) }),
  C(24, "sécala bien", "ClNumbers", { title: "El desodorante, al estilo japonés", rows: [["La axila", "jabón y frotar de verdad"], ["Secar", "bien seca antes de nada"], ["Antitranspirante", "a la noche, antes de dormir"], ["De día", "toallita para sacar, no otra capa"]] }),
  S(25, "", "av", ""),
  S(25, "Está en la camisa", "kf", "k_shirtheat", { p: BI("Close view of the inside of a cotton shirt collar and armpit seam, worn, the fabric slightly creased."), d1: "the shirt seam lies still", d2: "the fabric moves slightly as a hand lifts it", sound: "cotton fabric rustling" }),
  S(25, "a dos milímetros de la piel", "bi", "b_shirtclose", { q: "shirt fabric close up", p: BI("Extreme close view of the weave of a worn shirt fabric touching skin at the edge of a sleeve."), ov: { c: "ClChip", props: { text: "2 mm" } } }),

  // ══ REGLA 5 · dónde se seca la ropa
  C(26, "", "ClRule", { n: 5, title: "Dónde se seca la ropa", sub: "el sol es gratis" }),
  S(26, "En la azotea del hotel", "bi", "b_rooftop", { q: "laundry drying rooftop sun", p: BI(`The flat roof of ${HOTEL} in Tokyo on a sunny morning: rows of dark navy staff uniforms and white towels hanging on metal drying rails, city buildings around.`) }),
  S(26, "aunque había secadora", "bi", "b_dryer", { q: "industrial dryer laundry", p: BI("A row of industrial tumble dryers in a hotel laundry room, one door open, empty.") }),
  C(26, "el sol es gratis, y limpia", "ClSato", { img: SATOP, quote: "El sol es gratis. Y limpia." }),
  S(27, "", "bi", "b_balcony", { q: "japan balcony laundry", p: BI("The balconies of a tall apartment building in Tokyo, futons and laundry hanging over the railings in the sun.") }),
  S(27, "El sol mata bacterias", "kf", "k_sunshirt", { p: BI("A white cotton shirt on a hanger drying in bright sun on a balcony rail, blue sky behind."), d1: "the shirt hangs still in the sun", d2: "a light breeze moves the shirt", sound: "a light breeze and distant city" }),
  S(28, "", "bi", "b_indoorrack", { q: "clothes drying rack indoors", p: BI("A folding clothes rack full of damp clothes in a small dark Latin American bathroom, a towel on the door, the window closed.") }),
  S(28, "en una silla", "bi", "b_chairclothes", { p: BI("A wooden chair in a bedroom with damp shirts hung over its back to dry, the curtains closed.") }),
  S(28, "vuelve directo al armario cerrado", "bi", "b_closetback", { q: "closet hanging shirts", p: BI("A hand hanging a worn shirt back among clean clothes in a closed wardrobe, the inside dim.") }),
  S(29, "", "bi", "b_hanger", { p: BI(`A man's hand taking a blue cotton shirt on a hanger from a wardrobe in ${HOUSE}, the shirt looking clean.`) }),
  S(29, "huele mal", "cl", "c_sniffsleeve", { p: CLP(`He stands in ${HOUSE} wearing a blue shirt over his red polo, lifting his arm and sniffing the sleeve with a surprised frown.`) }),
  S(29, "Seguro tienes una camisa que dejaste de usar", "bi", "b_forgotshirt", { p: BI("A single shirt pushed to the far end of a wardrobe rail, alone, behind other clothes.") }),
  S(30, "", "bi", "b_sunline", { q: "clothesline sun backyard", p: BI("Clothes and towels hanging on a clothesline in a sunny Latin American patio, a plastic laundry basket below.") }),
  S(30, "blanqueador de oxígeno", "kf", "k_oxysoak", { p: BI("A plastic basin of hot water with shirts soaking and a scoop of white oxygen bleach powder being poured in, bubbles forming."), d1: "white powder pours into the water", d2: "tiny bubbles rise around the shirts", sound: "powder pouring and fizzing water" }),
  C(30, "el que no tiene cloro", "ClDoDont", { yes: { label: "Oxígeno, sin cloro", img: I + "k_oxysoak.jpg" }, no: { label: "Perfume encima", img: I + "b_perfume.jpg" } }),
  S(30, "media hora al aire", "bi", "b_airshirt", { p: BI(`A worn shirt on a hanger hooked on an open window frame in ${HOUSE}, airing in the breeze.`), ov: { c: "ClChip", props: { text: "30 min" } } }),

  // ══ REGLA 6 · de qué está hecha tu ropa (mención 2)
  C(31, "", "ClRule", { n: 6, title: "De qué está hecha tu ropa", sub: "algodón contra la piel" }),
  S(31, "una camiseta de algodón", "bi", "b_cottontee", { q: "white cotton t-shirt folded", p: BI("A folded plain white cotton undershirt on top of a dark navy hotel uniform on a locker room bench.") }),
  S(31, "Un día llegué con una deportiva", "bi", "b_polyester", { q: "sports shirt polyester", p: BI("A shiny synthetic sports t-shirt on a hanger in a staff locker room, the fabric smooth and slick.") }),
  S(31, "Sato-san me hizo cambiarla", "bi", "b_satopoint", { p: BI(`${SATO} pointing at a locker door with a calm, firm face in a hotel staff locker room.`) }),
  S(32, "", "av", ""),
  S(32, "Por eso la ropa del gimnasio huele", "bi", "b_gymbag", { q: "gym clothes bag", p: BI("An open sports bag on a bedroom floor with sweaty synthetic gym clothes and sneakers inside.") }),
  S(32, "la tela se quedó con tu olor", "bi", "b_fabricmacro", { p: BI("Extreme close view of shiny synthetic sportswear fabric, slick fibers catching the light.") }),
  S(33, "", "bi", "b_linen", { q: "linen clothes wardrobe", p: BI("Cotton and linen shirts in light natural colors hanging neatly in a light-wood wardrobe.") }),
  C(33, "algodón contra la piel", "ClDoDont", { yes: { label: "Algodón contra la piel", img: I + "b_cottontee.jpg" }, no: { label: "Sintético contra la piel", img: I + "b_polyester.jpg" } }),
  S(33, "Y el pijama", "bi", "b_pajama", { q: "pajamas folded bed", p: BI(`A folded cotton pajama on a neatly made bed in ${HOUSE}, morning light.`), ov: { c: "ClChip", props: { text: "2 veces por semana" } } }),
  S(34, "", "cl", "c_sniffront", { p: CLP(`He holds a shirt up by the shoulders in ${HOUSE} and sniffs the front of it.`) }),
  S(34, "Nunca hueles el cuello", "bi", "b_collar", { q: "jacket collar", p: BI("Close view of the inside of the collar of an old wool coat, slightly darkened and shiny where it touches the neck.") }),
  S(34, "todo el invierno", "bi", "b_coathook", { q: "coat hanging hook entrance", p: BI("A winter coat hanging on a hook by the front door of a home, a scarf around the hook.") }),
  S(34, "Pásale un paño húmedo", "kf", "k_wipecollar", { p: BI(`Close view of ${H} wiping the inside of a coat collar with a damp white cloth.`), d1: "the cloth touches the collar", d2: "the cloth wipes along the collar", sound: "a damp cloth rubbing wool" }),
  S(34, "Acuérdate de la nuca", "bi", "b_nape", { p: BI("The back of a man's neck seen from behind above the collar of a red polo shirt, short curly hair at the nape.") }),
  // mención 2
  S(35, "", "av", ""),
  C(35, "está en la página nueve", "ClBookPage", { page: I + "x_page9.jpg", pageNo: 9, stamp: "La rutina completa" }),
  S(35, "para que la pegues en el baño", "bi", "b_paperbath", { p: BI(`A printed page stuck with tape on the inside of a bathroom cabinet door in ${BATH}, a toothbrush cup below.`) }),

  // ══ REGLA 7 · la que casi todos rompemos
  C(36, "", "ClRule", { n: 7, title: "Entre los dedos", sub: "y los zapatos", star: true }),
  S(36, "Y te cuento lo que me dijo Sato-san de mi toalla", "av", ""),
  S(37, "", "bi", "b_corridor2", { q: "hotel corridor", p: BI(`${STAFF2}, a man in a red polo shirt standing a step in front of them, seen from behind, his shoulders tense.`) }),
  C(37, "tu toalla huele a pies", "ClSato", { img: SATOP, quote: "Claudio-san, tu toalla huele a pies." }),
  S(37, "Yo me secaba la cara, el cuerpo y los pies", "bi", "b_onetowel", { p: BI("A man sitting on the edge of a bathtub drying his feet with the same gray towel that hangs folded on a hook behind him.") }),
  S(37, "Todavía me pongo colorado", "cl", "c_blush", { p: CLP(`He covers half of his face with one hand in ${HOUSE}, laughing with embarrassment.`) }),
  S(38, "", "bi", "b_toeswater", { q: "feet in shower water", p: BI("Close view of bare feet on the white floor of a shower with water running over the tops of the feet, the toes pressed together.") }),
  S(38, "catorce horas húmedo", "bi", "b_sockshoe", { q: "putting on shoes socks", p: BI("A man sitting on a bed pulling a sock on and slipping his foot into a worn sneaker in the morning.") }),
  C(38, "Ningún otro lugar del cuerpo", "ClDryBars", { title: "Entre los dedos, cada día", rows: [{ label: "Húmedo, en el calcetín y el zapato", h: 14, note: "calor, humedad y nada de aire" }, { label: "Al aire, descalzo", h: 10, good: true }], max: 24 }),
  S(39, "", "bi", "b_genkan", { q: "japanese genkan shoes entrance", p: BI("The entrance of a Japanese home: a lower tiled floor with several pairs of shoes lined up neatly facing the door, a step up to a light-wood floor, slippers waiting.") }),
  S(39, "y no se usa el mismo par dos días seguidos", "bi", "b_twopairs", { q: "two pairs shoes", p: BI(`Two pairs of men's shoes side by side on a light-wood shoe rack by the door of ${HOUSE}.`) }),
  C(39, "necesita un día entero para secarse", "ClDryBars", { title: "Un zapato, después de un día", rows: [{ label: "Lo vuelves a usar mañana", h: 0, note: "nunca se seca" }, { label: "Descansa un día", h: 24, good: true }] }),
  S(40, "", "kf", "k_toewash", { p: BI(`Close view of ${H} washing between the toes of a bare foot with a soapy fingertip, sitting on a stool in ${BATH}.`), d1: "a soapy finger between two toes", d2: "the finger moves to the next toes", sound: "soap and water on skin" }),
  S(40, "y sécalos uno por uno", "bi", "b_drytoes", { p: BI("Close view of a small separate towel drying between the toes of a bare foot resting on a bath mat.") }),
  S(40, "Dos pares de zapatos que se turnan", "bi", "b_shoerack", { q: "shoe rack entrance", p: BI("Shoes resting on an open shoe rack near a sunny window, wooden shoe trees inside one pair.") }),
  S(40, "Calcetines de algodón", "bi", "b_socks", { q: "cotton socks folded", p: BI("A drawer of rolled cotton socks in light colors, neatly arranged.") }),
  C(40, "nunca adentro de un armario cerrado", "ClNumbers", { title: "La regla 7 en números", rows: [["Entre los dedos", "con jabón, y secar uno por uno"], ["La toalla de los pies", "nunca la de la cara"], ["Zapatos", "2 pares que se turnan"], ["Calcetines", "de algodón"]] }),
];
