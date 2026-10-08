// DIRECTOR A — alolor (Claudio el Albañil #6, "La casa de Doña Marta" ep. 6): MINUTO 1 (el aerosol de perfume apuntando al ropero en el
// seg 0 + "no le eche perfume" → la cara → el tarro con medio vaso → los trajes de Don Ernesto y el presupuesto del pintor → loop del
// bolsillo → promesa (tarro casero) + vistazo → credibilidad + prueba del plato de sal → capítulo) + el video de la grieta + el ropero +
// qué es el olor + el cloruro de calcio (mención 1) + dónde aparece (párrafos 0-22).
import { S, BI, CLP, MARTA } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const H = "a mason's rough weathered hands, the sleeve of a bright orange t-shirt at the edge of the frame";
export const WARD = "an old dark-wood two-door wardrobe at the end of a narrow pale mint-green hallway of an old modest Latin American house";
export const CLOTHES = "a row of old men's suits in gray and brown, white shirts and a gray felt hat on the top shelf inside an old dark-wood wardrobe";
export const PAINTER = "a house painter in his forties in white paint-stained overalls and a cap";
export const NIECE = "a Latin American woman in her forties with a dark ponytail, jeans and a blue blouse";
export const BOY = "a skinny 11-year-old Latin American boy with short black hair in a soccer t-shirt";
const I = "img/alolor/";
export const SHOTS = [
  // ── 0:00 · el perfume contra el ropero
  S(0, "", "bi", "b_spray", { p: BI(`An older woman's hand pointing an air freshener spray can with a plain blank label into ${CLOTHES}, about to spray.`), anim: "the hand presses the spray and a mist comes out", ov: { c: "ClStampOv", props: { text: "NO LO PERFUME" } } }),
  S(0, "El perfume tapa el olor una tarde", "av", ""),
  S(0, "y el moho sigue creciendo en la ropa", "bi", "b_moldcollar", { q: "mold on fabric", p: BI("Extreme close view of the shoulder of an old gray wool suit jacket with tiny grayish-white mold spots on the fabric, dim light.") }),
  // ── el tarro
  S(1, "", "kf", "k_jar", { p: BI(`Close view of ${H} lifting the top container of a homemade two-part plastic dehumidifier jar off the bottom one, revealing clear water collected inside.`), d1: "the hands lift the top container with white flakes", d2: "the bottom container shows about half a glass of clear water", sound: "plastic containers and water sloshing" }),
  S(1, "en una semana", "bi", "b_week", { q: "wall calendar", p: BI("A paper wall calendar with seven days crossed out in pen, hanging in a pale mint-green hallway.") }),
  S(1, "Agua que salió del aire de un ropero cerrado", "bi", "b_water", { p: BI("Close view of a plastic container with half a glass of clear water at the bottom, standing on the floor of an open dark-wood wardrobe.") }),
  S(1, "de un ropero cerrado", "bi", "b_closeddoors", { q: "wooden wardrobe doors", p: BI(`Close view of the closed carved doors of an old dark-wood wardrobe with a small brass key in the lock.`) }),
  // ── los trajes de Don Ernesto + el pintor
  S(2, "", "bi", "b_ward", { p: BI(`${WARD}, its doors closed, a small framed photo of an old couple on the wall beside it.`) }),
  S(2, "el marido de Doña Marta", "bi", "b_couple", { p: BI("An old framed black-and-white wedding photograph of a young Latin American couple on a lace doily on top of a wardrobe.") }),
  S(2, "Ahí están sus trajes", "bi", "b_suits", { q: "suits hanging closet", p: BI(`${CLOTHES}, the doors open, dim light.`) }),
  S(2, "sus camisas", "bi", "b_shirts", { q: "white shirts hangers", p: BI("Close view of old white men's dress shirts on wooden hangers inside a dark wardrobe, their collars slightly yellowed.") }),
  S(2, "su sombrero", "bi", "b_hat", { p: BI("A gray felt man's hat resting on the top shelf of an old wardrobe, a faint gray dust of mold on its brim.") }),
  S(2, "Ella no los quiere tirar", "bi", "b_martahold", { p: BI(`${MARTA} standing at the open wardrobe holding the sleeve of a gray suit in her hand, looking at it tenderly.`) }),
  C(2, "Y el pintor le había dicho", "ClReceipt", { head: "PRESUPUESTO", lines: [["Vaciar el ropero", "todo"], ["Tirar lo que huela", "la ropa"], ["Esmalte por dentro", "2 manos"]], total: ["El pintor", "$$$"] }),
  S(2, "vaciarlo y pintarlo por dentro", "bi", "b_enamelcan", { p: BI("An open can of glossy white enamel paint with a plain blank label next to a brush in front of an empty old wardrobe.") }),
  // ── el loop del bolsillo
  S(3, "", "bi", "b_pocket", { p: BI("Close view of an old woman's wrinkled fingers reaching into the inner pocket of a gray suit jacket.") }),
  S(3, "de uno de esos trajes", "bi", "b_suitpockets", { p: BI("Close view of the front of an old gray wool suit jacket on a hanger, its breast pocket slightly bulging.") }),
  S(3, "eso no lo esperaba", "cl", "c_letter", { p: CLP(`He stands by ${WARD} holding a small folded old piece of paper found in a suit pocket, looking at the camera with raised eyebrows.`) }),
  // ── la promesa
  S(4, "", "av", ""),
  S(4, "cómo se saca el olor a humedad de un ropero", "bi", "b_sniff", { p: BI(`${MARTA} leaning into an open wardrobe and wrinkling her nose at the smell, a hand on the door.`) }),
  S(4, "sin tirar nada", "bi", "b_clotheslinesun", { p: BI("Old men's suits and white shirts hanging on a clothesline in a small sunny patio, a gray felt hat on a chair.") }),
  S(4, "con un tarro casero que cuesta casi nada", "bi", "b_jarhome", { p: BI("A homemade dehumidifier: a plastic container with holes full of white flakes nested on top of another plastic container, on a wooden floor.") }),
  S(4, "que cuesta casi nada", "bi", "b_coins6", { p: BI("A few coins and a small hardware store receipt next to a bag of white flakes and two plastic containers on a kitchen table.") }),
  S(4, "Así olía ese ropero", "cl", "c_smell6", { p: CLP(`He opens ${WARD} and recoils, wrinkling his nose.`), ov: { c: "ClChip", props: { text: "Antes", alert: true } } }),
  S(4, "Y así quedó la ropa de Don Ernesto", "cl", "c_glimpse6", { p: CLP(`He stands at the open wardrobe holding up a clean white shirt on a hanger, his body hiding most of the wardrobe, smiling sideways at the camera.`), ov: { c: "ClChip", props: { text: "Después" } } }),
  // ── credibilidad + plato de sal
  S(5, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de albañil" } } }),
  S(5, "miles de casas cerradas", "bi", "st_closedroom", { q: "old room dust closed", p: BI("A closed old room with dust floating in a beam of light through shutters.") }),
  S(5, "Y al final le doy", "av", ""),
  S(5, "la prueba de cero dólares", "bi", "b_spoonsalt", { p: BI("Close view of a spoon pouring fine table salt onto a small white saucer on a kitchen counter.") }),
  S(5, "antes de guardar ropa en cualquier ropero", "bi", "b_saltplate", { p: BI("A small white saucer with two spoonfuls of fine table salt on the floor of an empty wardrobe.") , ov: { c: "ClChip", props: { text: "$0" } } }),
  S(5, "Una noche, con un plato y un poco de sal", "av", ""),
  S(5, "y un poco de sal", "bi", "b_saltbox", { p: BI("A box of fine table salt with a plain blank label next to a small saucer on the floor of an empty wardrobe, at night.") }),
  C(6, "", "ClChapter", { n: 1, title: "¿Qué es ese olor?", sub: "moho que todavía no se ve" }),
  // ── el video de la grieta
  C(7, "", "ClVideoRef", { thumb: I + "th_algrieta.jpg", title: "La grieta del pasillo" }),
  S(7, "se lo dejo acá", "av", ""),
  S(7, "Doña Marta me pidió que guardara la escalera", "bi", "b_ladder6", { p: BI("A folded aluminum step ladder leaning against the wall at the end of a narrow pale mint-green hallway next to an old dark-wood wardrobe.") }),
  // ── el ropero
  S(8, "", "kf", "k_doors", { p: BI(`${WARD} with its doors closed.`), d1: "the closed wardrobe doors", d2: "the two doors swing open revealing hanging suits in the dark", sound: "old wooden wardrobe doors creaking open" }),
  S(8, "Adentro, colgados en fila", "bi", "b_row", { p: BI(`${CLOTHES}, seen from close, the suits pressed together.`) }),
  S(9, "", "bi", "b_martawhisper", { p: BI(`${MARTA} standing close to an open wardrobe, speaking softly with her hand on her chest.`) }),
  S(9, "Y tengo miedo de que se arruine", "av", ""),
  S(10, "", "bi", "b_painterward", { p: BI(`${PAINTER} standing in front of an open wardrobe full of old clothes, pointing at it and writing a quote on a notepad.`) }),
  S(10, "Doña Marta guardó el presupuesto en el cajón", "bi", "b_drawer", { q: "kitchen drawer papers", p: BI("An old kitchen drawer full of papers, a printed quote on top, an old woman's hand closing it.") }),
  S(11, "", "bi", "b_lavender", { q: "lavender sachet", p: BI("Little bags of dried lavender, a bar of soap and an air freshener can with a plain blank label lined up on the shelf of an old wardrobe.") }),
  S(11, "El olor se iba un día y volvía al otro", "av", ""),
  S(12, "", "bi", "b_hatbrim", { p: BI("Extreme close view of the brim of an old gray felt hat with fine grayish dust spots of mold on it.") }),
  S(12, "el forro de un saco", "bi", "b_lining", { p: BI("Extreme close view of the inside lining of an old suit jacket with small greenish mold spots along the seams.") }),
  S(12, "Ella lo abría una vez por mes", "bi", "b_martaopen", { p: BI(`${MARTA} opening the doors of an old wardrobe just a little and peeking inside, then about to close it again.`) }),
  S(13, "", "av", ""),
  S(13, "Lo que hay que sacar es el agua", "bi", "b_drops6", { q: "condensation drops", p: BI("Extreme close view of tiny water droplets condensed on the inner back panel of an old dark wardrobe.") }),
  // ── qué es el olor
  S(14, "", "bi", "b_moldwood", { p: BI("Extreme close view of the inside corner of an old wooden wardrobe with faint white and gray fuzzy mold starting on the wood.") }),
  C(14, "del primer video", "ClVideoRef", { thumb: I + "th_almoho.jpg", title: "El moho del dormitorio" }),
  C(15, "", "ClClosetAir", { mode: "closed" }),
  S(16, "", "bi", "b_fresheners", { q: "air freshener spray", p: BI("A row of air freshener sprays and scented candles with plain blank labels on a supermarket-style shelf.") }),
  C(16, "Lo que lo saca es sacar el agua del aire", "ClHygrometer", { peak: 82, end: 55 }),
  S(17, "", "bi", "b_flakes", { q: "white salt flakes", p: BI("Extreme close view of white calcium chloride flakes in an open paper bag, a scoop beside them.") }),
  S(17, "se disuelve en un líquido", "kf", "k_dissolve", { p: BI("Extreme close view of white calcium chloride flakes in a plastic container, some of them wet and glistening.") , d1: "the white flakes sit dry", d2: "the flakes slowly melt into a clear liquid that drips down", sound: "a quiet room, a faint drip" }),
  S(17, "esos potes que venden en el supermercado", "bi", "b_storepots", { q: "moisture absorber", p: BI("A couple of small plastic moisture absorber tubs with plain blank labels on a store shelf.") }),
  // mención 1
  S(18, "", "bi", "b_counter6", { p: BI("The counter of an ordinary neighborhood hardware store: a one-kilo bag of white flakes with a plain blank label and two plastic containers with lids.") }),
  S(18, "En el Manual le dejé esa frase exacta", "av", "", { ov: { c: "ClChip", props: { text: "Manual · pág. 14" } } }),
  S(19, "", "bi", "st_pool", { q: "swimming pool supplies store", p: BI("A shop selling swimming pool supplies with bags and buckets on shelves.") }),
  S(20, "", "bi", "b_steamkitchen", { q: "boiling pot steam kitchen", p: BI("A small kitchen with a pot boiling and steam rising, a window fogged, laundry drying on a rack nearby.") }),
  S(20, "como una esponja", "bi", "b_woodgrain", { q: "old wood texture", p: BI("Extreme close view of old dark wood grain inside a wardrobe, slightly swollen and dull with moisture.") }),
  S(21, "", "bi", "b_understairs", { q: "storage under stairs", p: BI("The open door of a small storage cupboard under a staircase in an old house, boxes and coats inside, dim.") }),
  S(21, "la zapatera", "bi", "b_shoes", { q: "old leather shoes", p: BI("An old wooden shoe cabinet open, with old leather shoes showing faint white mold on the toes.") }),
  S(21, "los libros de la biblioteca de abajo", "bi", "b_books", { q: "old books shelf", p: BI("The bottom shelf of an old bookcase against a wall with old books, their spines slightly warped and spotted.") }),
  S(22, "", "bi", "b_potsvs", { p: BI("A small store-bought moisture absorber tub next to a big homemade two-container dehumidifier full of white flakes, on a table.") }),
];
