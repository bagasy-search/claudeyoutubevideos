// DIRECTOR A — fufruta (Claudio el Fumigador #4, "La casa de los Ramírez" ep. 4: las mosquitas del frutero): MINUTO 1 (el desagüe por
// dentro con larvas + "no nacen en el frutero" → la nube sobre los plátanos, tiraron la fruta y volvieron → loop del vaso boca abajo →
// promesa (trampa, fábrica, cerrarla) + antes/después → credibilidad + la revisión de la linterna → capítulo) + la casa (polaroid del
// ep. 3) + por qué (ciclo, olor, la fábrica) + lo que necesitas (mención 1, frase del mostrador, pág. 12) + lo honesto (párrafos 0-23).
// vl = Claudio HABLANDO en la cocina con su voz (agnes 2.5-flash reference + audio v4), el avatar RunPod es el repuesto.
import { S, BI, CLP, LUCIA, JORGE, KIDS, DOG, HOUSE } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const H = "a pest-control technician's weathered tanned hands, the short sleeve of a light khaki work shirt at the edge of the frame";
export const KITCHEN = HOUSE;
export const FLIES = "a small cloud of tiny tan fruit flies with red eyes";
export const BOWL = "a woven fruit bowl on a wooden kitchen table with ripe bananas covered in brown spots and two red apples";
export const SINK = "a stainless steel kitchen sink with a round metal drain strainer";
export const GLASS = "a clear drinking glass with two fingers of amber apple cider vinegar inside and a rolled white paper cone resting in its mouth, tip down";
export const SLIME = "the inside of a kitchen sink drain pipe coated with a brown slimy film";
const I = "img/fufruta/";
export const SHOTS = [
  // ── 0:00 · la fábrica que nadie mira
  S(0, "", "kf", "k_drainlarvae", { p: BI(`Night, extreme close view straight down into a kitchen sink drain with its metal strainer lifted out, a flashlight beam inside: ${SLIME} and tiny white thread-like larvae on the walls, a few tiny fruit flies crawling out of the drain.`), d1: "the flashlight beam moves slowly into the dark drain", d2: "tiny fruit flies crawl up out of the drain and take off", sound: "a faint drip of water in a pipe", ov: { c: "ClStampOv", props: { text: "NO NACEN EN LA FRUTA" } } }),
  S(0, "No nacen en el frutero", "bi", "st_flybanana", { q: "fruit flies banana", p: BI(`Close view of ${FLIES} hovering over overripe spotted bananas in a fruit bowl.`) }),
  S(0, "Nacen en un lugar de tu cocina", "bi", "b_sinkdark", { q: "kitchen sink drain", p: BI(`Night, ${SINK} seen from above, the drain dark, a single tiny fruit fly sitting on the rim of the drain.`) }),
  S(0, "que lavas todos los días", "bi", "b_washsink", { p: BI(`Close view of a woman's hands in yellow rubber gloves scrubbing the outside of ${SINK} with a sponge and suds.`) }),
  S(0, "y que nunca miras por dentro", "c", "ClDrainFactory", { props: { mode: "larvae" } }),
  // ── los Ramírez
  S(1, "", "bi", "b_kitchen0", { p: BI(`${KITCHEN}, a wooden table in the middle with ${BOWL}, seen from the doorway in daylight.`) }),
  S(1, "Una nubecita de mosquitas encima del frutero", "kf", "k_cloud", { p: BI(`Close view of ${BOWL}, ${FLIES} circling slowly above the bananas.`), d1: "the tiny flies circle slowly over the bananas", d2: "a hand passes by and the cloud of flies rises and spreads", sound: "a faint buzz" }),
  S(1, "que sube cada vez que alguien pasa", "bi", "b_luciapass", { p: BI(`${LUCIA} walking past the kitchen table, waving her hand at a small cloud of fruit flies rising from the fruit bowl, annoyed.`) }),
  S(1, "Tiraron los plátanos", "bi", "b_trashbananas", { p: BI(`${JORGE} dropping a bunch of spotted bananas into a kitchen trash can, frowning.`) }),
  S(1, "Tiraron las manzanas", "bi", "st_applestrash", { q: "throwing apples trash", p: BI("Two bruised red apples falling into a kitchen trash bag.") }),
  S(1, "Y al otro día", "bi", "b_morningbowl", { p: BI(`Morning light, ${BOWL} with fresh fruit, ${FLIES} already hovering above it again.`) }),
  S(1, "ahí estaban otra vez", "bi", "st_flies2", { q: "fruit flies swarm", p: BI(`${FLIES} hovering over fresh fruit.`) }),
  // ── el loop
  S(2, "", "kf", "k_cupdown", { p: BI(`Night, close view of ${H} placing an upside-down clear drinking glass over the drain of ${SINK}.`), d1: "the hand lowers the upside-down glass onto the drain", d2: "the glass sits over the drain, the hand pulls away", sound: "glass touching steel" }),
  S(2, "les dijo de dónde salían de verdad", "vl", "m2", { a: `leans on the edge of the stainless sink in ${KITCHEN}, an upside-down clear glass sitting over the drain beside his hand, looking at the camera with a knowing half smile.`, act: "He taps the upside-down glass lightly with one finger, then leans a little closer to the camera and lowers his voice to a whisper on the last words.", b: "he has leaned closer to the camera, one finger on his lips, eyebrows raised, the glass over the drain beside him." }),
  // ── la promesa
  S(3, "", "av", ""),
  S(3, "la trampa de un vaso que las agarra", "c", "ClGlassTrap", { props: { mode: "cone" } }),
  S(3, "que hay en tu cocina", "bi", "st_sinkday", { q: "kitchen sink", p: BI(`${SINK} in daylight, a few dishes beside it.`) }),
  S(3, "cómo encontrar la fábrica de mosquitas", "bi", "b_flashdrain", { p: BI(`Close view of ${H} shining a yellow flashlight down into a kitchen sink drain with its strainer removed.`) }),
  S(3, "y cómo cerrarla para siempre", "bi", "b_brushdrain0", { q: "cleaning sink drain brush", p: BI(`Close view of ${H} in a nitrile glove pushing a narrow bottle brush down into a kitchen sink drain.`) }),
  S(3, "Con las cantidades exactas", "bi", "st_vinegarpour", { q: "pouring apple cider vinegar", p: BI("Amber apple cider vinegar being poured from a bottle into a clear glass on a granite counter.") , ov: { c: "ClChip", props: { text: "2 dedos · 1 gota" } } }),
  S(3, "y con cosas que ya tienes", "bi", "b_pantry", { q: "apple cider vinegar bottle", p: BI("A bottle of apple cider vinegar with a plain label, a bottle of green dish soap and a clear glass on a speckled gray granite counter.") }),
  S(3, "Así estaba esa cocina", "bi", "b_before", { p: BI(`${KITCHEN}, ${BOWL} with ${FLIES} over it, dirty dishes in the sink.`), ov: { c: "ClChip", props: { text: "Antes", alert: true } } }),
  S(3, "Y así quedó", "bi", "b_after", { p: BI(`Morning, ${KITCHEN} clean and bright, fresh yellow bananas in the fruit bowl, no flies, the sink empty and dry.`), ov: { c: "ClChip", props: { text: "1 semana después" } } }),
  // ── credibilidad + linterna
  S(4, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de fumigador" } } }),
  S(4, "Treinta años de fumigador", "bi", "b_truck", { q: "pest control truck", p: BI("An old white pickup truck with a pest-control sprayer tank and hoses in its bed, parked on a quiet residential street.") }),
  S(4, "Y al final te doy", "av", ""),
  S(4, "la revisión de diez minutos", "bi", "b_flashlight", { q: "turning on flashlight", p: BI(`Close view of ${H} switching on a yellow flashlight in a dark kitchen.`), ov: { c: "ClChip", props: { text: "$0 · 10 minutos" } } }),
  S(4, "con una linterna", "bi", "st_flashbeam", { q: "flashlight beam dark room", p: BI("Night, a flashlight beam sweeping along the bottom of kitchen cabinets.") }),
  S(4, "para que sepas esta noche", "bi", "st_kitchennight0", { q: "dark kitchen night", p: BI("A dark kitchen at night, a little light from a window.") }),
  S(4, "qué bicho tienes", "bi", "st_flyclose", { q: "fruit fly macro", p: BI("Extreme close view of a single tiny tan fruit fly with red eyes on the skin of a banana.") }),
  S(4, "y por dónde entra", "bi", "b_window0", { q: "kitchen window screen", p: BI("A kitchen window with white iron bars and a torn corner in its insect screen, daylight outside.") }),
  C(5, "", "ClChapter", { n: 1, title: "El frutero de los Ramírez", sub: "la nube que siempre vuelve" }),
  // ── la casa
  C(6, "", "ClVideoRef", { thumb: I + "th_furatas.jpg", title: "Los ratones del garaje", tag: "VIDEO ANTERIOR" }),
  S(6, "si no la viste, te la dejo aquí", "av", ""),
  S(7, "", "vl", "v_lucia", { a: `stands beside the wooden kitchen table in ${KITCHEN} next to ${BOWL}, ${LUCIA} standing at his side pointing at the fruit bowl, a few tiny flies above the bananas.`, act: "He looks where Lucía points, bends slightly toward the bananas and squints at the flies, then turns back to the camera and keeps talking.", b: "he is bent toward the fruit bowl looking closely at the bananas, Lucía beside him with her arms crossed." }),
  S(7, "Encima de los plátanos, una nubecita", "bi", "st_flies3", { q: "fruit flies", p: BI(`${FLIES} over ripe bananas.`) }),
  S(7, "Mosquitas chiquitas, de ojos rojos", "bi", "b_redeyes", { p: BI("Extreme macro view of a tiny tan fruit fly with bright red eyes standing on the brown-spotted skin of a banana.") }),
  S(7, "que volaban lento, en círculos", "c", "ClFlyCycle", {}),
  S(8, "", "bi", "b_luciatalk", { p: BI(`${LUCIA} in her kitchen talking, frustrated, one hand open toward the fruit bowl on the table.`) }),
  S(8, "En la fruta, en el vaso de jugo de Mateo", "bi", "b_juiceglass", { p: BI("A child's plastic cup of orange juice on a kitchen table with two tiny fruit flies on its rim.") }),
  S(8, "en el borde de la taza del café", "bi", "st_coffeefly", { q: "fly on coffee cup", p: BI("A tiny fly on the rim of a coffee mug on a table.") }),
  S(8, "Y Sofía, la de nueve", "bi", "b_sofiabag", { p: BI(`Sofía, a 9-year-old Latin American girl with two braids, opening her school backpack in the kitchen and pulling back as tiny flies fly out of it, grimacing.`) }),
  S(9, "", "bi", "b_jorgetrash", { p: BI(`${JORGE} in his kitchen tipping the whole fruit bowl into the trash can.`) }),
  S(9, "Pasó un trapo con cloro por la mesa", "bi", "b_jorgewipe", { p: BI(`${JORGE} wiping the wooden kitchen table hard with a cloth, a bottle of bleach on the table.`) }),
  S(9, "Y una noche les echó insecticida en aerosol", "bi", "b_jorgespray", { p: BI(`Night, ${JORGE} spraying an aerosol can of insecticide over a fruit bowl on the kitchen table, a mist in the air.`) }),
  S(10, "", "vl", "v_aerosol", { a: `stands at the kitchen table in ${KITCHEN} holding a plain blank aerosol can of insecticide at arm's length, frowning, shaking his head slightly.`, act: "He holds up the aerosol can, shakes his head firmly and points at the fruit bowl, speaking slowly and seriously.", b: "he has put the aerosol can down on the counter behind him, one hand flat on the table, serious." }),
  S(10, "Mata a las que están volando en ese momento", "bi", "st_spraymist", { q: "aerosol spray mist", p: BI("An aerosol spray mist in the air of a kitchen.") }),
  S(10, "y deja el veneno en la fruta y en la mesa", "bi", "b_sprayfruit", { p: BI(`Close view of fine droplets of insecticide spray glistening on bananas and apples in a fruit bowl.`), ov: { c: "ClChip", props: { text: "Nunca sobre la comida", alert: true } } }),
  S(10, "Y a la mañana siguiente, la nube estaba de vuelta", "bi", "st_flies4", { q: "fruit flies kitchen", p: BI(`${FLIES} over fruit in a kitchen.`) }),
  S(11, "", "vl", "v_regla", { a: `stands by ${SINK} in ${KITCHEN}, one hand resting on the edge of the sink, looking at the camera.`, act: "He talks to the camera, taps the edge of the sink twice on 'la fábrica', and opens his hands wide on the last sentence.", b: "he has both hands open toward the camera, a dry half smile." }),
  C(12, "", "ClChapter", { n: 2, title: "Cómo funcionan", sub: "es corto y te cambia todo" }),
  // ── el ciclo
  S(13, "", "bi", "st_flymacro2", { q: "fruit fly macro", p: BI("Extreme macro view of a tiny fruit fly on a piece of fruit.") }),
  S(13, "y en ese tiempo pone cientos de huevos", "c", "ClFlyCycle", {}),
  S(13, "una cáscara", "bi", "st_peel", { q: "banana peel", p: BI("A brown banana peel lying on a kitchen counter.") }),
  S(13, "una gota de jugo", "bi", "b_juicedrop", { p: BI("A sticky drop of orange juice on a speckled gray granite counter, a tiny fly on its edge.") }),
  S(13, "un resto de cerveza en una lata", "bi", "st_beercan", { q: "empty beer can", p: BI("An empty beer can lying on its side on a counter.") }),
  S(13, "Y en una semana", "bi", "st_flies5", { q: "fruit flies", p: BI(`${FLIES}.`) }),
  S(14, "", "vl", "v_calor", { a: `stands by the kitchen window in ${KITCHEN} on a hot day, wiping his forehead with the back of his hand, looking at the camera.`, act: "He fans himself with his hand and explains, then mimes picking up a suitcase and walking away.", b: "he mimes holding a suitcase handle, smiling." }),
  S(14, "Te vas un fin de semana", "bi", "b_suitcase", { p: BI(`The Ramírez family walking out of their front door with a small suitcase, ${DOG} on a leash, leaving for the weekend.`) }),
  S(14, "dejas un plátano pasado en la mesa", "bi", "st_rottenbanana", { q: "rotten banana", p: BI("A single black overripe banana lying on a wooden table.") }),
  S(14, "y vuelves a una nube", "bi", "b_cloudreturn", { p: BI(`${LUCIA} opening the kitchen door with grocery bags and stopping short, a cloud of tiny flies over the table.`) }),
  S(15, "", "bi", "st_vinegar", { q: "vinegar bottle", p: BI("A glass bottle of vinegar on a kitchen counter.") }),
  S(15, "A vinagre, a vino", "bi", "st_wineglass", { q: "glass of red wine", p: BI("A half-finished glass of red wine on a kitchen table.") }),
  S(15, "a fruta pasada", "bi", "st_overripe", { q: "overripe fruit", p: BI("Overripe fruit in a bowl.") }),
  S(15, "Desde lejos lo huelen", "bi", "st_flyflying", { q: "fly flying slow motion", p: BI("A tiny fly flying in the air.") }),
  // la fábrica
  S(16, "", "vl", "v_secreto", { a: `crouches in front of the open cabinet under ${SINK} in ${KITCHEN}, the cabinet doors open, a yellow flashlight in one hand, looking at the camera.`, act: "He leans toward the camera as if sharing a secret, then points the flashlight up at the drain pipe under the sink and keeps talking.", b: "he is pointing the flashlight at the curved drain pipe under the sink, looking back at the camera." }),
  S(16, "Es la capa de suciedad que se pega por dentro del desagüe", "c", "ClDrainFactory", { props: { mode: "larvae" } }),
  S(16, "Restos de comida, un poco de azúcar", "bi", "b_slime", { p: BI(`Night, extreme close view of ${SLIME}, a flashlight beam on it, food bits stuck in the slime.`) }),
  S(16, "Para ellas, es el lugar perfecto", "bi", "st_drain2", { q: "sink drain closeup", p: BI("Extreme close view of a dirty kitchen sink drain.") }),
  S(17, "", "bi", "b_potatobag0", { p: BI("A brown paper bag of potatoes on the floor of a cabinet under a kitchen sink, one soft black potato at the bottom.") }),
  S(17, "el trapo de la cocina que nunca se seca", "bi", "b_wettowel", { p: BI("A damp crumpled dish towel lying next to a stainless kitchen sink.") }),
  S(17, "la bolsa de botellas y latas para reciclar", "bi", "st_recycle", { q: "recycling bin cans bottles", p: BI("A recycling bag full of cans and bottles.") }),
  S(17, "la basura sin tapa", "bi", "st_trashopen", { q: "open trash can kitchen", p: BI("An open kitchen trash can with food scraps.") }),
  S(17, "Pero en casi todas las cocinas que veo", "vl", "v_casi", { a: `crouches at the open cabinet under the stainless sink in ${KITCHEN}, one hand on the curved drain pipe.`, act: "He knocks on the drain pipe twice and looks at the camera knowingly.", b: "he keeps his hand on the drain pipe, nodding." }),
  S(18, "", "vl", "v_tres", { a: `stands at the granite counter in ${KITCHEN} with a glass trap in front of him, holding up three fingers.`, act: "He counts one, two, three on his fingers, touching the glass trap on one, pointing at the sink on two and closing his fist on three.", b: "he holds up a closed fist, firm." }),
  C(18, "Dos, encontrar la fábrica", "ClCheck", { title: "Las mosquitas", items: ["1 · La trampa: baja las que vuelan", "2 · Encontrar la fábrica", "3 · Cerrarla"], fast: true }),
  S(18, "La trampa sola no alcanza", "av", ""),
  C(19, "", "ClChapter", { n: 3, title: "Lo que necesitas", sub: "seguramente ya lo tienes" }),
  // mención 1 (frase del mostrador)
  S(20, "", "bi", "st_storeshelf", { q: "vinegar supermarket shelf", p: BI("A supermarket shelf with bottles of vinegar.") }),
  S(20, "un vinagre de manzana chico y un detergente de platos", "bi", "b_counteritems", { p: BI("On a small neighborhood store counter: a small bottle of apple cider vinegar with a plain label and a bottle of green dish soap.") }),
  C(20, "Y en la casa buscas un vaso", "ClNotebook", { title: "Lo que pides", rows: [{ k: "Vinagre", v: "de manzana" }, { k: "Detergente", v: "1 gota" }, { k: "Vaso", v: "o frasco" }, { k: "Papel", v: "1 hoja" }], note: "La frase exacta · pág. 12" }),
  C(20, "En el Manual te dejé esa frase escrita", "ClBookPage", { page: I + "page12.jpg", pageNo: 12, stamp: "La frase, en la página" }),
  S(21, "", "vl", "v_vinagre", { a: `stands at the speckled granite counter in ${KITCHEN} holding a bottle of amber apple cider vinegar in one hand and a bottle of clear white vinegar in the other.`, act: "He lifts the white vinegar, shakes his head and sets it down, then lifts the amber apple cider vinegar toward the camera, nodding, and sniffs it.", b: "he holds the amber apple cider vinegar bottle up beside his face, nodding, the white vinegar set aside on the counter." }),
  S(21, "Si no tienes, sirve un chorrito de vino o de cerveza", "bi", "st_beerpour", { q: "pouring beer glass", p: BI("Beer being poured into a glass.") }),
  S(22, "", "bi", "st_dishsoap", { q: "dish soap bottle", p: BI("A bottle of green dish soap next to a kitchen sink.") }),
  S(22, "Una sola gota", "bi", "b_onedrop", { q: "dish soap drop", p: BI("Extreme close view of a single drop of green dish soap falling from a bottle tip.") }),
  S(23, "", "vl", "v_honesto", { a: `sits on a wooden chair at the kitchen table in ${KITCHEN}, ${GLASS} on the table in front of him, forearms on the table, looking at the camera, sincere.`, act: "He talks to the camera calmly and honestly, gesturing at the glass trap, then shakes his head gently and taps the table on the last sentence.", b: "he leans back a little in the chair, one hand still on the table, a calm sincere look." }),
  S(23, "No toca los huevos, ni las larvas", "bi", "b_larvaemacro", { p: BI(`Extreme macro view of tiny white thread-like larvae wriggling in ${SLIME}.`) }),
  S(23, "La trampa es para ver cuántas son", "vl", "v_honesto2", { a: `sits at the kitchen table in ${KITCHEN} with ${GLASS} in front of him, holding up one finger.`, act: "He holds up one finger, then points firmly toward the sink behind him on 'el arreglo es la fábrica'.", b: "he points over his shoulder toward the sink, looking at the camera, firm." }),
];
