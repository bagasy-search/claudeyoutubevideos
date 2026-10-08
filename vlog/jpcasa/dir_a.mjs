// DIRECTOR A — jpcasa (Claudio en Japón #4, "Lo que aprendí en Tokio"): MINUTO 1 (la miniatura de grilla cobra vida: "tu casa huele a
// viejo" → Sato-san le pone la punta de la cortina en la cara delante de todo el equipo (loop: lo que dijo) → la nariz ciega → promesa 11
// cosas + la 7 (la lavadora) → credibilidad (habitación que no huele a nada) + test) + polaroid del video 3 + cosas 1 (cortinas) y
// 2 (alfombras, mención 1 del Método pág. 12 con la frase del mostrador). Párrafos 0-17.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jpcasa/";
export const H = "a man's hands with tanned skin, the sleeve of a plain red polo shirt at the edge of the frame";
export const SATOP = I + "x_sato.jpg";
export const KITCHEN = "a small bright Latin American kitchen with white tiles, light-wood cabinets and a window";
export const BEDROOM = "a bright Latin American bedroom with white walls, a light-wood bed frame, white sheets and a window with thin curtains";
export const SATOCIV = SATO.replace("a dark navy hotel housekeeping supervisor uniform with a white collar and a small name badge with no readable text", "a beige cardigan and dark trousers");
export const R = (n, title, sub, o = {}) => ({ n, total: 11, title, sub, label: "NÚMERO", starText: "LA QUE CASI TODOS ROMPEMOS", ...o });
export const SHOTS = [
  // ── 0:00 · la miniatura cobra vida
  C(0, "", "ClGridHook", { bed: I + "x_thumbbg.jpg", tiles: [1, 2, 3, 4, 5, 6].map((k) => I + `x_t${k}.jpg`), words: ["tu casa huele a", "viejo"], every: 8 }),
  S(0, "son estas once cosas", "bi", "b_oldroom", { q: "old living room curtains carpet", p: BI(`A living room of an older Latin American home in the afternoon: heavy floral curtains, a beige carpet, a fabric sofa with cushions, a closed window.`) }),
  S(0, "y casi ninguna se lava nunca", "bi", "b_curtainhem0", { p: BI("Close view of the bottom hem of a heavy floral curtain resting on a beige carpet, grayish at the edge, dust on the floor beside it.") }),
  // ── Sato-san y la cortina, delante de todos
  S(1, "", "bi", "b_staffline", { q: "hotel housekeeping staff", p: BI(`Five housekeepers in navy uniforms standing in a line in a corridor of ${HOTEL} in the morning, listening.`) }),
  S(1, "Entró a una habitación que yo acababa de dejar perfecta", "bi", "b_perfectroom", { q: "hotel room clean bed", p: BI(`A freshly made room of ${HOTEL}: white bed perfectly made, curtains closed, a housekeeping cart at the door.`) }),
  S(1, "agarró la punta de la cortina", "kf", "k_satocurtain", { p: BI(`Close view of a woman's hand in a navy uniform sleeve lifting the bottom hem of a beige curtain in a room of ${HOTEL}.`), d1: "the hand holds the curtain hem", d2: "the hand lifts the hem up", sound: "fabric rustling in a quiet room" }),
  S(1, "la olió", "bi", "b_satosniff", { p: BI(`${SATO} lifting the bottom hem of a beige curtain to her nose in a room of ${HOTEL}, eyes half closed, serious.`) }),
  S(1, "Delante de todos", "cl", "c_curtainface", { p: CLP(`In a room of ${HOTEL}, a woman's hand holds the hem of a beige curtain up to his face; he looks surprised and a little ashamed.`) }),
  S(1, "Y lo que me dijo esa mañana", "bi", "b_staffwatch", { p: BI(`Several housekeepers in navy uniforms watching from the doorway of a room of ${HOTEL}, some holding cloths, curious faces.`) }),
  S(1, "me cambió la forma de limpiar para siempre", "av", ""),
  // ── la nariz ciega
  S(2, "", "bi", "b_sofaread", { p: BI(`A Latin American woman in her sixties reading relaxed on her fabric sofa in ${HOUSE}, a cup of coffee beside her.`) }),
  S(2, "La nariz se acostumbra en pocos minutos", "bi", "b_nose", { p: BI("A side view of an older Latin American man's face breathing in calmly at home, his nose and cheek in the frame, a window behind him.") }),
  S(2, "Pero la visita lo siente apenas abres la puerta", "bi", "b_visitdoor", { q: "guest arriving front door", p: BI(`A front door opening to a visiting woman with a gift bag who pauses for a second on the doorstep of ${HOUSE}, her nose slightly wrinkled.`) }),
  S(2, "te lo va a decir", "cl", "c_silence", { p: CLP(`He stands in a hallway of ${HOUSE} with a finger to his lips and a knowing look at the camera.`) }),
  // ── la promesa
  S(3, "", "av", ""),
  S(3, "Casi todas son de tela", "bi", "b_fabrics", { p: BI(`A pile of home fabrics on a bed in ${BEDROOM}: a curtain, a pillow, a cushion, a bath mat and folded towels.`) }),
  S(3, "y casi todas están en tu casa ahora mismo", "bi", "b_homewide", { q: "living room home", p: BI(`The living room of ${HOUSE} in the afternoon, a window with curtains, a sofa with cushions, a rug.`) }),
  S(3, "Y la número siete", "bi", "b_washer7", { q: "front load washing machine", p: BI("A front-loading washing machine in a small laundry corner of a Latin American home, the door closed, a basket of towels beside it.") , ov: { c: "ClChip", props: { text: "Nº 7", alert: true } } }),
  S(3, "y está ensuciando todo lo demás", "kf", "k_gasket0", { p: BI(`Close view of ${H} pulling back the gray rubber door seal of a front-loading washing machine, dark grime inside the fold.`), d1: "the fingers touch the rubber seal", d2: "the fingers pull the seal back and reveal the dirty fold", sound: "rubber seal pulled, a drop of water" }),
  // ── credibilidad + test
  S(4, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "15 años de conserje en Tokio" } } }),
  S(4, "en un hotel de Tokio", "bi", "b_hotelfront", { q: "tokyo hotel entrance", p: BI("The entrance of a modest business hotel on a quiet Tokyo street in the morning, no readable signs.") }),
  S(4, "donde una habitación no podía oler a nada", "bi", "b_openwindow", { q: "hotel room window open", p: BI(`A clean room of ${HOTEL} with the window open and the curtain moving in the breeze, the bed made.`) }),
  S(4, "ni siquiera a limpio", "bi", "b_nospray", { p: BI("A hotel housekeeping cart with plain refill bottles with blank labels and folded cloths, no air freshener anywhere.") }),
  S(4, "Y al final te dejo el test de cinco minutos", "bi", "b_timer5", { q: "kitchen timer", p: BI("A simple white kitchen timer set to five minutes on a light-wood table next to a pillow and a folded towel.") }),
  S(4, "con la nariz de una visita", "bi", "b_stepin", { p: BI(`A woman stepping in through the front door of ${HOUSE} and taking one slow breath, her coat still on.`) }),
  // ── el video 3
  C(5, "", "ClVideoRef", { thumb: I + "th_jpgasto.jpg", title: "9 cosas que en Japón nunca se compran" }),
  S(5, "Hoy vas a ver qué es lo que estaban tapando", "bi", "b_plugin", { q: "plug in air freshener", p: BI("A plug-in air freshener with a blank label in a wall socket just above a fabric sofa and a carpet.") }),
  S(6, "", "bi", "b_windowcurt", { q: "curtains window", p: BI(`A window of ${HOUSE} with long thick curtains hanging to the floor, morning light coming through.`) }),

  // ══ 1 · las cortinas
  C(7, "", "ClRule", R(1, "Las cortinas", "la tela que nunca se lava")),
  S(7, "piso por piso", "bi", "b_curtaincart", { q: "hotel laundry cart curtains", p: BI(`A laundry cart loaded with folded beige curtains in a corridor of ${HOTEL}, a stepladder leaning beside it.`) }),
  S(7, "Sato-san tenía un calendario sólo para eso", "bi", "b_calendardoor", { p: BI("A paper wall calendar taped to a storeroom door, a few dates circled in red pen, no readable text.") }),
  S(8, "", "bi", "b_curtainold", { q: "old curtains living room", p: BI(`Heavy old curtains in a Latin American living room, slightly faded where the sun hits, dust on the folds.`) }),
  S(8, "el humo de la cocina", "bi", "b_cooksmoke", { q: "cooking smoke pan", p: BI(`Steam and smoke rising from a frying pan in ${KITCHEN}, a curtained window right next to the stove.`) }),
  S(8, "el perro", "bi", "b_dogcurtain", { q: "dog lying window", p: BI(`A medium-sized dog lying on the floor right against the bottom of a curtain in ${HOUSE}.`) }),
  S(8, "en las fibras, durante años", "bi", "b_fibers", { p: BI("Extreme close view of curtain fabric fibers with fine dust and lint caught in the weave.") }),
  S(9, "", "kf", "k_condens", { p: BI("Close view of drops of condensation running down the inside of a cold window glass toward the curtain hem below."), d1: "drops cling to the glass", d2: "the drops run down to the bottom of the glass", sound: "quiet room, a faint drip" }),
  S(9, "Ese dobladillo puede pasar meses húmedo", "bi", "b_wethem", { q: "window condensation", p: BI("The bottom hem of a curtain touching a wet window sill, a darker damp band along the fabric edge.") }),
  S(10, "", "cl", "c_sniffhem", { p: CLP(`He gathers the bottom hem of a curtain in ${HOUSE} and brings it to his nose, eyes narrowed, testing the smell.`) }),
  S(10, "No el medio", "bi", "b_hemhands", { p: BI(`Close view of ${H} folding the bottom hem of a curtain in his fist.`), ov: { c: "ClChip", props: { text: "el dobladillo", alert: true } } }),
  S(10, "Eso que sentiste", "av", ""),
  C(11, "", "ClNumbers", { title: "Las cortinas", rows: [["Lavarlas", "cada 3 meses"], ["Si no se lavan", "sacudir y al sol una tarde"], ["El vidrio", "un paño seco cada mañana"]], page: 12 }),
  S(11, "se sacuden y se cuelgan al sol una tarde entera", "bi", "b_curtainsun", { q: "curtains drying clothesline", p: BI("Curtains hanging over a clothesline in a sunny Latin American patio, blue sky.") }),
  S(11, "un paño seco por el vidrio", "kf", "k_wipeglass", { p: BI(`Close view of ${H} wiping condensation off a window glass with a dry microfiber cloth in the morning.`), d1: "the cloth touches the wet glass", d2: "the cloth wipes a clear stripe", sound: "a cloth squeaking on glass" }),
  S(12, "", "bi", "b_shoji", { q: "shoji screen japanese", p: BI("Japanese paper sliding screens in light wooden frames on a window of a traditional room, soft daylight through the paper.") }),
  S(12, "se cambia el papel", "bi", "b_shojinew", { p: BI("Hands pressing a fresh sheet of white paper onto a light wooden shoji frame laid on a table.") }),

  // ══ 2 · las alfombras (mención 1)
  C(13, "", "ClRule", R(2, "Las alfombras", "la esponja de la casa")),
  S(13, "En el hotel había alfombra en los pasillos", "bi", "b_hotelcarpet", { q: "hotel corridor carpet", p: BI(`A long carpeted corridor of ${HOTEL}, plain beige carpet, doors on both sides.`) }),
  S(13, "la llenaba de un polvo blanco", "kf", "k_sodacarpet", { p: BI(`Close view of a hand shaking white baking soda from a plain box over a beige carpet in a corridor of ${HOTEL}.`), d1: "the box is tilted over the carpet", d2: "white powder falls and covers the carpet", sound: "powder shaken from a box" }),
  S(13, "y recién ahí pasaba la aspiradora", "bi", "b_vacuum", { q: "vacuum cleaner carpet", p: BI("A housekeeper in a navy uniform vacuuming a beige hotel corridor carpet, only her legs and the vacuum in the frame.") }),
  S(14, "", "bi", "b_carpetsponge", { q: "beige carpet living room sofa", p: BI(`A beige carpet in a Latin American living room with a few faint old stains near the sofa.`) }),
  S(14, "El vaso de agua de hace diez años", "bi", "b_spill", { q: "spilled glass carpet", p: BI("A knocked-over glass of water on a beige carpet, the water soaking into the fibers.") }),
  S(14, "el accidente del perro", "bi", "b_dogcarpet", { q: "dog on carpet", p: BI(`A dog lying on a carpet next to a sofa in ${HOUSE}, looking innocent.`) }),
  S(14, "es sólo la superficie", "bi", "b_carpetlayers", { p: BI("A corner of fitted carpet lifted from the floor showing a stained foam underlay below, dust on the concrete.") }),
  C(15, "", "ClNumbers", { title: "Las alfombras", rows: [["Bicarbonato", "espolvoreado"], ["Esperar", "1 hora"], ["Después", "aspirar"], ["Cada cuánto", "una vez por mes"]], page: 12 }),
  S(15, "El bicarbonato no perfuma", "bi", "b_sodabox", { p: BI("A plain box of baking soda with a blank label next to a carpet brush on a beige carpet.") }),
  S(15, "Y las alfombras chicas, al sol", "bi", "b_rugsun", { q: "rug hanging outside", p: BI("A small rug hanging over a railing in the sun on a Latin American balcony.") }),
  // mención 1
  S(16, "", "av", ""),
  S(16, "En el Método te dejé anotado", "bi", "b_shoplist", { p: BI("A handwritten shopping list on a notepad on a light-wood table next to a box of baking soda, a carpet brush and small cloth bags of activated charcoal with blank labels.") , ov: { c: "ClChip", props: { text: "Método · pág. 12" } } }),
  S(16, "En la tienda, pide así", "bi", "b_counter", { q: "hardware store counter", p: BI("The counter of an ordinary neighborhood store with a large box of baking soda, a carpet brush and small bags of activated charcoal with blank labels.") }),
  C(16, "necesito bicarbonato en cantidad", "ClCheck", { title: "Lo único que hay que comprar", label: "MÉTODO · PÁG. 12", items: ["Bicarbonato en cantidad", "Un cepillo para alfombras", "Bolsitas de carbón activado", "Ganchos para colgar al sol"] }),
  S(17, "", "kf", "k_wetcarpet", { p: BI("Close view of a carpet cleaning machine leaving a very wet stripe on a beige carpet."), d1: "the machine sits on the carpet", d2: "the machine moves forward leaving a wet stripe", sound: "a carpet cleaner motor and water" }),
  S(17, "a la semana huele peor que antes", "cl", "c_wetcarpet", { p: CLP(`He crouches on a damp beige carpet in ${HOUSE}, pressing it with his palm and grimacing at the smell.`) }),
];
