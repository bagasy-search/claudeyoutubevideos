// DIRECTOR A — jpgasto (Claudio en Japón #3, "Lo que aprendí en Tokio"): MINUTO 1 (la miniatura héroe cobra vida: la canasta desbordada +
// "en una casa japonesa no vas a encontrar nada de esto" → Sato-san abre la alacena delante de la familia (loop: lo que dijo) → ahorran más →
// promesa 9 cosas + la 7 → credibilidad (cien habitaciones con cuatro productos) + test) + polaroid del video 2 + cosas 1 (aromatizantes),
// 2 (papel de cocina, mención 1 del Método pág. 11), 3 (los diez limpiadores). Párrafos 0-26.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jpgasto/";
export const H = "a man's hands with tanned skin, the sleeve of a plain red polo shirt at the edge of the frame";
export const SATOP = I + "x_sato.jpg";
export const KITCHEN = "a small bright Latin American kitchen with white tiles, light-wood cabinets and a window";
export const R = (n, title, sub, o = {}) => ({ n, total: 9, title, sub, label: "NÚMERO", starText: "LA QUE CASI TODOS PAGAMOS", ...o });
export const SHOTS = [
  // ── 0:00 · la miniatura cobra vida
  C(0, "", "ClHeroHook", { bed: I + "x_thumbbg.jpg", lines: ["Deja de", "comprar esto"], marks: [{ x: 1180, y: 760, text: "10 LIMPIADORES" }, { x: 1420, y: 640, text: "AROMATIZANTES" }, { x: 1640, y: 760, text: "PAPEL" }] }),
  S(0, "Y nosotros lo compramos todos los meses", "bi", "b_cart", { q: "supermarket cart cleaning products", p: BI("A supermarket cart full of cleaning sprays, air fresheners and paper towel packs with blank labels, rolling down a bright aisle.") }),
  // ── Sato-san y la alacena
  S(1, "", "bi", "b_satodoor", { p: BI(`${SATO.replace("a dark navy hotel housekeeping supervisor uniform with a white collar and a small name badge with no readable text", "a beige cardigan and dark trousers")}, standing at the open front door of ${HOUSE}, holding a small gift bag, polite and serious.`) }),
  S(1, "Abrió la alacena del baño", "bi", "b_cabinetopen", { p: BI(`A woman's hand opening the mirrored cabinet of ${BATH}, revealing shelves crowded with cleaning sprays and air fresheners with blank labels.`) }),
  S(1, "delante de mi esposa y de mis hijos", "bi", "b_family", { p: BI(`A Latin American woman in her fifties and two teenage children standing in a narrow hallway of ${HOUSE}, watching with curious, slightly embarrassed faces.`) }),
  S(1, "Siete limpiadores", "bi", "b_seven", { q: "cleaning products shelf", p: BI("Seven different cleaning spray bottles with blank labels lined up on a bathroom shelf.") , ov: { c: "ClChip", props: { text: "7 limpiadores", alert: true } } }),
  S(1, "Cuatro aromatizantes", "bi", "b_four", { q: "air freshener", p: BI("Four air freshener cans and plug-ins with blank labels on a bathroom cabinet shelf.") , ov: { c: "ClChip", props: { text: "4 aromatizantes", alert: true } } }),
  S(1, "Tres rollos de papel", "bi", "b_rolls", { q: "paper towel rolls", p: BI("Three rolls of paper towels stacked on top of a bathroom cabinet.") , ov: { c: "ClChip", props: { text: "3 rollos", alert: true } } }),
  S(1, "todavía me da vergüenza", "av", ""),
  // ── no es tacañería
  S(2, "", "bi", "b_jpfamily", { q: "japanese family home", p: BI("A Japanese family of four eating dinner at a low wooden table in a small, tidy apartment with almost nothing on the shelves.") }),
  S(2, "Con el mismo sueldo", "bi", "b_salary", { q: "coins savings jar", p: BI("A glass jar with coins and folded banknotes on a light-wood kitchen table, a small notebook with handwritten numbers beside it.") }),
  S(2, "Y la diferencia está en una lista corta", "bi", "b_shortlist", { p: BI("A short handwritten shopping list with only four lines on a notepad held by a magnet on a white refrigerator.") }),
  // ── la promesa
  S(3, "", "av", ""),
  S(3, "Casi todas están ahora mismo en tu casa", "bi", "b_undersink", { q: "under sink cleaning products", p: BI(`The open cabinet under a kitchen sink in ${KITCHEN}, crammed with many cleaning bottles and sprays with blank labels.`) }),
  S(3, "Y la número siete", "bi", "b_phonebill", { q: "credit card statement", p: BI("A printed card statement on a kitchen table with several monthly charges, a pen and a cup of coffee beside it, no readable brand names.") , ov: { c: "ClChip", props: { text: "Nº 7", alert: true } } }),
  S(3, "Yo también la pagaba", "cl", "c_guilty3", { p: CLP(`He stands in ${HOUSE} holding up a credit card and making a guilty grimace at the camera.`) }),
  // ── credibilidad + test
  S(4, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "15 años de conserje en Tokio" } } }),
  S(4, "donde se limpiaban cien habitaciones por día", "bi", "b_corridor", { q: "hotel corridor housekeeping", p: BI(`A long corridor of ${HOTEL} with a housekeeping cart and several room doors propped open.`) }),
  S(4, "con cuatro productos", "bi", "b_fourbottles", { p: BI("Four plain refillable bottles with blank labels on a housekeeping cart: soap, vinegar, baking soda and disinfectant.") , ov: { c: "ClChip", props: { text: "4 productos" } } }),
  S(4, "Y al final te dejo el test de cinco minutos", "bi", "b_pillowtest", { p: BI(`A Latin American woman in her fifties in ${HOUSE} bending over her bed and smelling the center of a bare pillow, curious.`) }),
  S(4, "que te ahorra el primero de la lista", "bi", "b_freshener1", { q: "plug in air freshener", p: BI("A plug-in air freshener with a blank label in a wall socket in a living room.") }),
  // ── el video 2
  C(5, "", "ClVideoRef", { thumb: I + "th_jpviejo.jpg", title: "El olor de después de los 40" }),
  S(6, "", "bi", "b_sprayair", { q: "air freshener spray", p: BI(`A hand pressing an air freshener spray with a blank label in the living room of ${HOUSE}, a fine mist in the air.`) }),

  // ══ 1 · los aromatizantes
  C(7, "", "ClRule", R(1, "Los aromatizantes", "no huele bien: no huele a nada")),
  S(7, "En el hotel estaban prohibidos", "bi", "b_hotelhall", { q: "japanese hotel hallway", p: BI(`A spotless corridor of ${HOTEL} with no decorations at all, beige carpet, soft light.`) }),
  S(7, "Un día le pregunté a Sato-san", "bi", "b_satoask", { p: BI(`${SATO} listening to a man in a red polo shirt seen from behind in a hotel corridor, her head slightly tilted.`) }),
  C(7, "no huele bien, Claudio-san", "ClSato", { img: SATOP, quote: "No huele bien. No huele a nada." }),
  S(8, "", "kf", "k_mist", { p: BI("Close view of a fine mist of air freshener floating in the light of a window in a living room."), d1: "the mist hangs in the light", d2: "the mist slowly spreads and fades", sound: "a quiet room, a soft hiss" }),
  S(8, "El de abajo sigue ahí", "bi", "b_trash", { q: "kitchen trash bin", p: BI(`An overflowing kitchen trash bin under the sink in ${KITCHEN}, the lid not closing.`) }),
  S(8, "y hay que comprar otro", "bi", "b_refills", { q: "air freshener refill store", p: BI("A store shelf with rows of air freshener refills with blank labels.") }),
  S(9, "", "bi", "b_plugin", { p: BI("A plug-in air freshener with a blank label in a bathroom wall socket next to a sink.") }),
  S(9, "el del auto", "bi", "b_carfreshener", { q: "car air freshener", p: BI("A small air freshener hanging from the rear-view mirror of an ordinary car, a city street through the windshield.") }),
  S(9, "la vela de la sala", "bi", "b_candle", { q: "scented candle", p: BI(`A lit scented candle in a glass jar with a blank label on a side table in ${HOUSE}.`) }),
  S(9, "el spray de la ropa", "bi", "b_fabricspray", { p: BI("A fabric spray bottle with a blank label next to folded clothes on a bed.") }),
  S(10, "", "bi", "b_lostfound", { p: BI(`A shelf in the lost-and-found storeroom of ${HOTEL} with a few labeled-free boxes, an umbrella and an air freshener can.`) }),
  S(10, "Decía que el huésped siguiente", "bi", "b_freshroom", { q: "hotel room window", p: BI(`A clean room of ${HOTEL} with the window open and the curtain moving, the bed made.`) }),
  S(11, "", "kf", "k_window", { p: BI(`A living room window in ${HOUSE} opening wide in the morning, thin curtains moving in the breeze.`), d1: "the window is closed", d2: "the window opens and the curtains move", sound: "a window opening, birds outside" }),
  C(11, "La regla: cero aromatizantes", "ClNumbers", { title: "Los aromatizantes", rows: [["Aromatizantes", "cero"], ["Ventana abierta", "10 min a la mañana"], ["Y otra vez", "10 min a la noche"]], page: 11 }),
  S(11, "y el aromatizante te lo estaba escondiendo", "bi", "b_hidden", { p: BI(`A damp dark corner behind a bathroom cabinet in ${BATH}, an air freshener can on the shelf right above it.`) }),
  S(12, "", "cl", "c_bag", { p: CLP(`He drops several air fresheners with blank labels into a plastic bag in ${HOUSE}, looking at the camera with raised eyebrows.`) }),
  S(12, "A los tres días", "bi", "b_calendar3", { p: BI("A paper calendar on a kitchen wall with three days crossed out in pen.") }),

  // ══ 2 · el papel de cocina (mención 1)
  C(13, "", "ClRule", R(2, "El papel de cocina", "seis paños que se lavan")),
  S(13, "Había una fila de paños colgados", "bi", "b_clothsrow", { q: "kitchen cloths hanging", p: BI("A row of colored cotton kitchen cloths hanging on a rail in a small staff kitchen, each a different color.") }),
  S(13, "Sato-san los lavaba al final del día", "bi", "b_satocloth", { p: BI(`${SATO} hanging colored kitchen cloths on a drying rail in the sun on a hotel rooftop.`) }),
  S(14, "", "kf", "k_papertowel", { p: BI(`Close view of a hand tearing several sheets of paper towel from a roll in ${KITCHEN}.`), d1: "the hand pulls the paper towel", d2: "a long strip of paper tears off", sound: "paper towel tearing" }),
  S(14, "Un rollo dura dos días", "bi", "b_emptyroll", { p: BI(`An empty paper towel tube on its holder in ${KITCHEN}.`) }),
  S(14, "es dinero que va directo a la basura", "bi", "b_papertrash", { q: "paper towels trash", p: BI("A kitchen trash bin full of crumpled used paper towels.") }),
  S(15, "", "bi", "b_sixcloths", { p: BI("Six folded microfiber cloths in six different colors stacked on a light-wood kitchen shelf.") }),
  C(15, "Uno para la encimera", "ClNumbers", { title: "Seis paños, no papel", rows: [["La encimera", "un paño de un color"], ["Los vidrios", "otro color"], ["El baño", "otro color, nunca en la cocina"], ["Recambio", "los otros tres"]], page: 11 }),
  S(16, "", "bi", "b_hotelbath", { q: "hotel bathroom cleaning", p: BI(`A housekeeper in a navy uniform wiping a sink in a bathroom of ${HOTEL} with a blue cloth.`) }),
  S(17, "", "av", ""),
  S(18, "", "kf", "k_clothsun", { p: BI("Colored microfiber cloths drying on a clothesline in the sun on a Latin American patio."), d1: "the cloths hang still", d2: "a breeze moves the cloths", sound: "a light breeze outside" }),
  S(18, "pasa a limpiar el piso o el auto", "bi", "b_oldcloth", { p: BI("A worn faded cloth wiping the dashboard of an ordinary car.") }),
  // mención 1
  S(19, "", "av", ""),
  S(19, "En el Método te dejé anotado", "bi", "b_shoplist", { p: BI("A handwritten shopping list on a notepad on a light-wood table next to a pack of microfiber cloths, a bottle of white vinegar and a box of baking soda with blank labels.") , ov: { c: "ClChip", props: { text: "Método · pág. 11" } } }),
  S(19, "En la tienda, pide así", "bi", "b_counter", { q: "store counter shopping", p: BI("The counter of an ordinary neighborhood store with a pack of microfiber cloths, a large bottle of white vinegar and a box of baking soda with blank labels.") }),
  C(19, "necesito un paquete de paños de microfibra", "ClCheck", { title: "Lo único que hay que comprar", label: "MÉTODO · PÁG. 11", items: ["Paños de microfibra lavables", "Vinagre blanco", "Bicarbonato", "Un jabón neutro", "Bolsas de tela para las compras"] }),

  // ══ 3 · los diez limpiadores
  C(20, "", "ClRule", R(3, "Los diez limpiadores", "bastan cuatro")),
  S(20, "En el depósito del hotel", "bi", "b_storeroom", { q: "storage room shelves", p: BI(`The cleaning storeroom of ${HOTEL}: a metal shelf with only four large refill bottles with blank labels, neat and almost empty.`) }),
  S(20, "Había cuatro botellas", "kf", "k_fourbottles", { p: BI("Close view of four large refill bottles with blank labels on a metal shelf, a hand reaching for one."), d1: "four bottles stand on the shelf", d2: "the hand takes one bottle", sound: "a plastic bottle lifted from a shelf" }),
  S(21, "", "bi", "b_undersink2", { q: "under sink cabinet products", p: BI("A cabinet under a kitchen sink opened, full of more than ten cleaning bottles and sprays of every color with blank labels.") }),
  S(21, "otro para el horno", "bi", "b_oven", { q: "oven cleaner", p: BI("An oven cleaner spray with a blank label next to an open oven door in a kitchen.") }),
  S(21, "Casi todos hacen lo mismo", "bi", "b_colors", { p: BI("A row of cleaning liquids of different colors in clear bottles with blank labels, side by side on a counter.") }),
  C(22, "", "ClNumbers", { title: "Bastan cuatro", rows: [["Jabón neutro", "para casi todo"], ["Vinagre blanco", "vidrios y sarro"], ["Bicarbonato", "para frotar y olores"], ["Un desinfectante", "para el baño"]], page: 11 }),
  S(23, "", "kf", "k_glass", { p: BI(`Close view of ${H} wiping a window glass with a dry microfiber cloth after spraying water with a little vinegar.`), d1: "the cloth touches the glass", d2: "the cloth wipes the glass clean", sound: "a cloth squeaking on glass" }),
  S(24, "", "cl", "c_warning", { p: CLP(`He holds up a bottle of bleach with a blank label in one hand and raises the other hand in a firm stop gesture, serious face, in ${KITCHEN}.`), ov: { c: "ClStampOv", props: { text: "NUNCA MEZCLAR", alert: true } } }),
  S(24, "Y el vinagre y el agua oxigenada", "bi", "b_twobottles", { p: BI("A bottle of white vinegar and a brown bottle of hydrogen peroxide with blank labels standing apart on a kitchen counter, a clear gap between them.") }),
  S(25, "", "kf", "k_floor", { p: BI(`Many cleaning bottles and sprays with blank labels spread out on the floor of ${KITCHEN}, a hand setting down one more.`), d1: "bottles spread on the floor", d2: "a hand places one more bottle", sound: "plastic bottles set down on a floor" }),
  S(25, "Quédate con los cuatro básicos", "bi", "b_keepfour", { p: BI("Four basic bottles set apart on a kitchen counter, the rest of the cleaning products packed into a cardboard box.") }),
  S(26, "", "bi", "b_sister", { p: BI(`A Latin American woman in her fifties kneeling in ${KITCHEN} among nineteen cleaning bottles spread on the floor, hands on her head in disbelief.`) }),
  S(26, "Ella no podía creer", "av", ""),
];
