// DIRECTOR A — jpbano (Claudio en Japón #6, "Lo que aprendí en Tokio"): MINUTO 1 (la miniatura de grilla cobra vida: "tóxico en tu baño" →
// Sato-san le saca los dos aerosoles en la puerta delante de las demás (loop: lo que dijo) → el cuarto más chico y cerrado → promesa 12
// productos + la 7 (el cloro mezclado) → credibilidad + test) + polaroid del video 5 + productos 1 (aromatizante de enchufe), 2 (pastillas
// del tanque, mención 1 del Método pág. 14 con la frase del mostrador) y 3 (cortina de plástico). Párrafos 0-21.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH, BOTTLE } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jpbano/";
export const H = "a man's hands with tanned skin, the sleeve of a plain red polo shirt at the edge of the frame";
export const SATOP = I + "x_sato.jpg";
export const HBATH = "a small spotless bathroom of a quiet Tokyo business hotel with white tiles";
export const R = (n, title, sub, o = {}) => ({ n, total: 12, title, sub, label: "NÚMERO", starText: "LA QUE CASI TODOS ROMPEMOS", ...o });
export const SHOTS = [
  // ── 0:00 · la miniatura cobra vida
  C(0, "", "ClGridHook", { bed: I + "x_thumbbg.jpg", tiles: [1, 2, 3, 4, 5, 6].map((k) => I + `x_t${k}.jpg`), words: ["tóxico", "en tu baño"], every: 8 }),
  S(0, "no lo vas a encontrar", "bi", "b_jpbathclean", { q: "clean bathroom minimal", p: BI("A very clean small Japanese bathroom with white walls, a window ajar and nothing on the shelves but a folded towel.") }),
  // ── Sato-san y los dos aerosoles
  S(1, "", "bi", "b_hotelcorr", { q: "hotel corridor", p: BI(`A quiet corridor of ${HOTEL} in the morning with a housekeeping cart by an open bathroom door.`) }),
  S(1, "entré con un aerosol en cada mano", "cl", "c_twosprays", { p: CLP(`He stands in the doorway of ${HBATH} wearing a navy housekeeping jacket over his red polo, an aerosol can with a blank label in each hand, confident.`) }),
  S(1, "Sato-san me paró en la puerta", "bi", "b_satostop", { p: BI(`${SATO} raising one hand to stop someone at the door of ${HBATH}, calm and firm.`) }),
  S(1, "delante de las otras chicas de limpieza", "bi", "b_maids", { p: BI(`Three Japanese housekeepers in navy uniforms with cloths in their hands watching from the corridor of ${HOTEL}, curious.`) }),
  S(1, "me sacó los dos aerosoles", "kf", "k_takecans", { p: BI("Close view of a woman's hands in navy uniform sleeves taking two aerosol cans with blank labels from a man's hands in a hotel bathroom doorway."), d1: "the man's hands hold the two cans", d2: "her hands take the cans away", sound: "two metal cans clink" }),
  S(1, "y me dio un solo paño seco", "bi", "b_drycloth", { p: BI("A woman's hand in a navy sleeve holding out a single folded dry white cloth.") }),
  S(1, "me dio tanta vergüenza", "cl", "c_shame", { p: CLP(`He stands in a hotel corridor holding a folded white cloth, looking down with an embarrassed half smile, wearing a navy housekeeping jacket over his red polo.`) }),
  S(1, "que no se lo conté a nadie en años", "av", ""),
  // ── el cuarto más chico y cerrado
  S(2, "", "bi", "b_smallbath", { q: "small bathroom", p: BI(`${BATH}, seen from the doorway, small and closed, no window open.`) }),
  S(2, "el que menos aire tiene", "bi", "b_closeddoor", { q: "bathroom door closed", p: BI(`The closed door of a bathroom in ${HOUSE}, a little steam escaping under the door.`) }),
  S(2, "Y ahí adentro guardamos los productos más fuertes", "bi", "b_productshelf", { q: "cleaning products under sink", p: BI(`The cabinet under the sink of ${BATH} open, crowded with sprays, bleach and toilet cleaners with blank labels.`) }),
  S(2, "y los usamos con la puerta cerrada", "kf", "k_sprayclosed", { p: BI(`Close view of ${H} spraying a cleaner with a blank label on bathroom tiles, the door closed behind, a mist in the air.`), d1: "the spray points at the tiles", d2: "a mist spreads in the small room", sound: "a spray trigger in a small tiled room" }),
  // ── la promesa
  S(3, "", "av", ""),
  S(3, "Algunos los compraste esta semana", "bi", "b_shopbag", { q: "shopping bag cleaning products", p: BI("A shopping bag on a kitchen table with an air freshener, a toilet tank tablet pack and a spray cleaner with blank labels.") }),
  S(3, "Y la número siete", "bi", "b_bleach7", { q: "bleach bottle", p: BI(`A white bottle of bleach with a blank label next to a toilet in ${BATH}.`), ov: { c: "ClChip", props: { text: "Nº 7", alert: true } } }),
  S(3, "que de verdad es peligrosa", "cl", "c_danger", { p: CLP(`He holds a bleach bottle with a blank label away from his body in ${BATH}, serious face, raising the other hand in warning.`) }),
  // ── credibilidad + test
  S(4, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "15 años de conserje en Tokio" } } }),
  S(4, "en un hotel de Tokio", "bi", "b_hotelfront", { q: "tokyo street morning hotel", p: BI("The entrance of a modest business hotel on a quiet Tokyo street in the morning, no readable signs.") }),
  S(4, "limpiando baños que tenían que quedar sin olor a nada", "bi", "b_hotelbathclean", { q: "clean hotel bathroom", p: BI(`${HBATH}, perfectly clean and dry, a window open, a folded towel on the rail.`) }),
  S(4, "Y al final te dejo el test de cinco minutos", "bi", "b_timer5", { q: "kitchen timer", p: BI("A simple white kitchen timer set to five minutes on a light-wood table next to a pillow and a folded towel.") }),
  S(4, "para saber a qué huele tu casa", "bi", "b_sniffair", { p: BI(`A Latin American woman stepping into the living room of ${HOUSE} and sniffing the air with a curious face.`) }),
  // ── el video 5
  C(5, "", "ClVideoRef", { thumb: I + "th_jpagua.jpg", title: "16 usos del agua oxigenada en Japón" }),
  S(5, "Y no se mezcla con nada", "bi", "b_bottlealone", { p: BI(`${BOTTLE} standing alone on a white bathroom shelf, nothing else near it.`) }),
  S(6, "", "bi", "b_pluginwall", { q: "plug in air freshener wall", p: BI(`A plug-in air freshener with a blank label in a wall socket of ${BATH}.`) }),

  // ══ 1 · el aromatizante de enchufe
  C(7, "", "ClRule", R(1, "El aromatizante de enchufe", "aire, no perfume")),
  S(7, "En los baños del hotel no había ni uno", "bi", "b_hotelwall", { q: "hotel bathroom mirror", p: BI(`A bare wall socket next to a mirror in ${HBATH}, nothing plugged in.`) }),
  C(7, "está pidiendo aire, no perfume", "ClSato", { img: SATOP, quote: "Un baño que necesita perfume está pidiendo aire." }),
  S(8, "", "kf", "k_pluginmist", { p: BI("Close view of a plug-in air freshener with a blank label in a bathroom wall socket, a thin wisp of scented vapor rising."), d1: "the vapor is faint", d2: "a wisp of vapor rises and drifts", sound: "a quiet bathroom hum" }),
  S(8, "y lo compras más fuerte", "bi", "b_refills", { q: "air freshener store shelf", p: BI("A store shelf with rows of plug-in air freshener refills with blank labels.") }),
  S(9, "", "kf", "k_unplug", { p: BI(`Close view of ${H} unplugging an air freshener from a bathroom wall socket.`), d1: "the fingers grip the device", d2: "the device is pulled out of the socket", sound: "a plug pulled from a socket" }),
  C(9, "Quince minutos después de cada ducha", "ClNumbers", { title: "Ventilar el baño", rows: [["Después de cada ducha", "15 minutos"], ["La puerta", "cerrada"], ["La ventana", "abierta"]], page: 14 }),
  S(10, "", "bi", "b_extractor", { q: "bathroom exhaust fan", p: BI("A bathroom ceiling exhaust fan grille above a shower, a little steam drifting toward it.") }),
  S(11, "", "cl", "c_unplugbag", { p: CLP(`He drops a plug-in air freshener into a small bag in ${BATH}, looking at the camera with raised eyebrows.`) }),
  S(11, "Al tercer día", "bi", "b_calendar3", { q: "wall calendar", p: BI("A paper calendar on a wall with three days crossed out in pen.") }),
  S(12, "", "bi", "b_jpwindow", { q: "japanese bathroom window", p: BI("A small Japanese bathroom window half open with daylight, white tiles below, nothing on the sill.") }),

  // ══ 2 · las pastillas del tanque (mención 1)
  C(13, "", "ClRule", R(2, "Las pastillas del tanque", "el azul no limpia")),
  S(13, "Las que pintan el agua de azul", "bi", "b_bluewater", { q: "blue toilet water", p: BI("Looking down into a white toilet bowl with bright blue water.") }),
  S(13, "me preguntó qué limpiaba", "bi", "b_satotablet", { q: "toilet tank", p: BI(`${SATO} holding a blue toilet tank tablet between two fingers in ${HBATH}, looking at it with a skeptical frown.`) }),
  S(14, "", "bi", "b_tankopen", { q: "toilet tank inside", p: BI("The inside of an open toilet tank with a blue tablet on the bottom, stained parts and a worn rubber flapper.") }),
  S(14, "y cuando el tanque empieza a perder agua", "kf", "k_tankleak", { p: BI("Close view of water trickling continuously down the inside of a white toilet bowl."), d1: "a thin trickle on the porcelain", d2: "the water keeps trickling down", sound: "a toilet tank trickling" }),
  S(14, "Y el azul no limpia", "cl", "c_bluebowl", { p: CLP(`He looks into a toilet bowl with blue water in ${BATH}, shaking his head.`) }),
  S(15, "", "kf", "k_dailywipe", { p: BI(`Close view of ${H} giving a toilet bowl a quick brush with a toilet brush.`), d1: "the brush is in the bowl", d2: "the brush makes a quick circle", sound: "a toilet brush scrubbing porcelain", ov: { c: "ClChip", props: { text: "30 segundos al día" } } }),
  S(16, "", "bi", "b_jptoilet", { q: "japanese toilet sink on tank", p: BI("A Japanese toilet with a small hand-washing basin built on top of the tank, water running from the little tap.") }),
  // mención 1
  S(17, "", "av", ""),
  S(17, "En el Método te dejé anotado", "bi", "b_shoplist", { p: BI("A handwritten shopping list on a notepad on a light-wood table next to a small rubber squeegee, a folded fabric shower curtain and a toilet brush with an open drying stand.") , ov: { c: "ClChip", props: { text: "Método · pág. 14" } } }),
  S(17, "En la tienda, pide así", "bi", "b_counter", { q: "hardware store counter", p: BI("The counter of an ordinary neighborhood store with a small squeegee, a packed fabric shower curtain and a toilet brush with a stand.") }),
  C(17, "necesito un secador de vidrios chico", "ClCheck", { title: "Lo único que hay que comprar", label: "MÉTODO · PÁG. 14", items: ["Un secador de vidrios chico", "Una cortina de tela lavable", "Un cepillo de inodoro con base que se seque", "Un paño de microfibra para el baño"] }),

  // ══ 3 · la cortina de plástico
  C(18, "", "ClRule", R(3, "La cortina de plástico", "la de tela se lava")),
  S(18, "Había mamparas", "bi", "b_hotelglass", { q: "glass shower screen", p: BI(`A clear glass shower screen in ${HBATH}, dry and spotless.`) }),
  S(19, "", "bi", "b_curtainmold", { q: "shower curtain mold", p: BI(`The bottom edge of a plastic shower curtain in ${BATH} with a black line of mold along the hem, stuck to the tub.`) }),
  S(19, "a los meses se tira y se compra otra", "bi", "b_curtaintrash", { q: "trash bag bathroom", p: BI("A crumpled old plastic shower curtain stuffed into a trash bag by a bathroom door.") }),
  S(19, "ese olor fuerte a plástico", "cl", "c_newcurtain", { p: CLP(`He opens the package of a new plastic shower curtain in ${BATH} and pulls his face back from the smell.`) }),
  S(20, "", "kf", "k_curtainwash", { p: BI("Close view of a white fabric shower curtain going into the drum of a front-loading washing machine."), d1: "the curtain is at the door of the drum", d2: "the curtain is pushed into the drum", sound: "fabric pushed into a washing machine" }),
  S(20, "Después de la ducha se deja estirada", "bi", "b_curtainspread", { q: "shower curtain bathroom", p: BI(`A white fabric shower curtain pulled fully closed and stretched flat along the tub in ${BATH} to dry, window open.`) }),
  S(21, "", "kf", "k_squeegeeglass", { p: BI(`Close view of ${H} pulling a small rubber squeegee down a wet glass shower screen.`), d1: "the squeegee is at the top of the wet glass", d2: "the squeegee pulls down leaving a clear stripe", sound: "a squeegee on wet glass" }),
];
