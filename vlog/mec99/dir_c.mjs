// DIRECTOR C — mec99: 7 reposacabezas (altura, martillito) · 8 visera · 9 gancho del respaldo · el baúl (10 manija que brilla · 11 ganchos ·
// 12 respaldos · 13 auxilio, gato y llave · consejo de la presión del auxilio · 14 argolla de remolque) · lo que ahorra (15 etiqueta de
// la puerta vs. el número de la llanta · 16 testigo de desgaste + moneda · 17 fusibles) · la página de las luces del tablero (párrafos 37-58).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { GAUGE } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/mec99/";
const TRUNK = "the open trunk of an ordinary silver 2012 compact sedan: a gray carpet floor, plain gray plastic side panels";
const TIRE = "an ordinary black car tire with a silver alloy wheel";
export const SHOTS = [
  // ── 7 · reposacabezas
  S(37, "", "bi", "st_headrest", { q: "car seat headrest", p: BI(`Close view of the gray cloth headrest of the driver seat of ${CABIN}.`) }),
  S(37, "Tienen un botoncito en la base", "kf", "k_headrest", { p: BI(`Extreme close view of ${H} pressing the small square button at the base of a headrest post on a gray cloth car seat.`), d1: "the thumb presses the small button at the base of the post", d2: "the headrest slides up a few centimeters on its metal posts", sound: "a plastic click and a soft slide" }),
  S(37, "o salen del todo", "bi", "b_headrestout", { p: BI(`${H} holding a gray car headrest pulled completely out, its two metal posts showing, above the driver seat of ${CABIN}.`) }),
  S(38, "", "av", ""),
  S(38, "La parte de arriba del reposacabezas", "c", "ClDoDont", { props: { yes: { label: "Arriba, a la altura de tu cabeza", img: I + "b_hr_ok.jpg" }, no: { label: "En el cuello", img: I + "b_hr_bad.jpg" } } }),
  S(38, "En un choque de atrás", "bi", "st_rearend", { q: "car rear bumper traffic", p: BI("Two ordinary cars stopped very close one behind the other in city traffic, seen from the side.") }),
  S(38, "eso te salva las cervicales", "av", ""),
  S(39, "con las varillas del reposacabezas", "bi", "b_posts", { p: BI(`Close view of the two metal posts of a headrest pulled out of a car seat, held next to the side window of ${CABIN}.`) }),
  S(39, "A veces funciona, a veces no", "av", ""),
  S(39, "Yo prefiero un martillito de emergencia", "bi", "b_hammer", { p: BI(`Close view of ${H} holding a small red plastic car emergency hammer with a steel tip and a seatbelt cutter, inside ${CABIN}.`), ov: { c: "ClChip", props: { text: "US$ 5" } } }),
  S(39, "en la consola", "bi", "b_hammerconsole", { p: BI(`Close view of a small red car emergency hammer lying in the center console tray of ${CABIN}, next to the gear lever.`) }),
  S(39, "Elena se llevó uno", "bi", "b_elenahammer", { p: BI(`${ELENA} in ${SHOP} looking closely at a small red emergency hammer in her hands through her reading glasses.`) }),
  // ── 8 · visera
  S(40, "", "bi", "st_visor", { q: "car sun visor", p: BI(`The driver sun visor of ${CABIN} folded down, sunlight coming through the windshield.`) }),
  S(40, "la sacas del gancho y la giras hacia la ventanilla", "kf", "k_visor", { p: BI(`Inside ${CABIN}, ${H} holding the driver sun visor folded down against the windshield, bright sun from the side window.`), d1: "the hand unhooks the visor from its clip", d2: "the hand swings the visor around to cover the side window", sound: "a soft plastic click and a swing" }),
  S(40, "Y en muchos autos, además, se estira", "bi", "b_visorext", { p: BI(`Close view of ${H} pulling out the small sliding extension of a car sun visor against the side window, the low sun behind it.`) }),
  // ── 9 · gancho del respaldo
  S(41, "", "bi", "b_seathook", { p: BI(`Close view of a small folding plastic hook on the back of the front passenger seat of ${CABIN}, a plastic grocery bag hanging from it.`) }),
  S(41, "Para que las compras no rueden por el piso", "bi", "b_oranges", { p: BI(`Oranges and a carton of milk rolled out of a grocery bag on the back seat floor of ${CABIN}.`) }),
  // ── el baúl
  C(42, "", "ClChapter", { n: 5, title: "El baúl", sub: "lo que te puede salvar" }),
  S(43, "", "c", "ClCarMap", { props: { n: 10, zone: "baul" } }),
  S(43, "hay una manijita que brilla en la oscuridad", "bi", "b_glowhandle", { p: BI("Close view inside a dark car trunk of a small T-shaped glow-in-the-dark trunk release handle glowing yellow-green, hanging from the latch.") }),
  S(43, "Si alguien queda encerrado adentro", "bi", "st_trunkopen", { q: "car trunk opening", p: BI(`${TRUNK}, the lid swinging open in daylight.`) }),
  S(43, "tira de esa manija y el baúl se abre", "kf", "k_glowpull", { p: BI("Dark inside of a car trunk, a small hand near a glowing yellow-green T-shaped trunk release handle."), d1: "a small hand grabs the glowing handle", d2: "the hand pulls the handle and the trunk lid pops open letting daylight in", sound: "a latch click and the trunk lid opening" }),
  S(43, "Enséñaselo a tus nietos", "av", ""),
  S(44, "", "bi", "b_trunkhooks", { p: BI(`Close view of small plastic grocery hooks on the side panel of ${TRUNK}, two grocery bags hanging from them.`) }),
  S(44, "o argollas en el piso", "bi", "st_cargonet", { q: "car trunk cargo net", p: BI(`A stretchy black cargo net hooked to the metal rings on the floor of ${TRUNK}.`) }),
  S(44, "Elena llevaba los huevos sueltos en el baúl", "bi", "b_eggs", { q: "broken eggs", p: BI(`Close view of a cardboard egg carton tipped over on the carpet of ${TRUNK}, several broken eggs leaking.`) }),
  S(45, "", "bi", "b_trunkpull", { p: BI(`Close view of ${H} pulling a small fabric strap at the top of ${TRUNK} to release the rear seat back.`) }),
  S(45, "Sirven para bajar los respaldos de atrás", "kf", "k_seatfold", { p: BI(`Seen through the open trunk into ${CABIN}, the rear seat backs upright.`), d1: "the rear seat back is upright", d2: "the rear seat back folds forward and opens the trunk into the cabin", sound: "a latch release and a soft thud" }),
  S(45, "o la silla de ruedas de su hermana", "bi", "b_wheelchair", { p: BI(`A folded gray wheelchair laid inside the trunk of ${CAR} with the rear seat folded down, ${ELENA} watching.`) }),
  S(46, "", "bi", "b_carpetlift", { p: BI(`Close view of ${H} lifting the carpet floor panel of ${TRUNK}, revealing a dark well underneath.`) }),
  S(46, "ahí está la llanta de repuesto", "bi", "st_spare", { q: "spare tire car trunk", p: BI(`A spare wheel and tire lying in the well under the floor of ${TRUNK}, a jack and a lug wrench beside it.`) }),
  S(46, "el gato y la llave de ruedas", "c", "ClPins", { props: { img: I + "b_sparewell.jpg", pins: [{ x: 0.42, y: 0.52, label: "Repuesto" }, { x: 0.72, y: 0.38, label: "Gato" }, { x: 0.24, y: 0.7, label: "Llave de ruedas" }] } }),
  S(46, "Nunca había levantado esa alfombra", "bi", "b_elenalooks", { p: BI(`${ELENA} bending over the open trunk of ${CAR} in a workshop, looking at the spare tire with surprise, one hand on her chest.`) }),
  S(47, "", "av", ""),
  S(47, "La llanta de repuesto también se desinfla", "bi", "b_sparegauge", { p: BI(`Close view of ${H} pressing a tire pressure gauge onto the valve of the spare tire in the well of ${TRUNK}.`) }),
  S(47, "Mídela cada dos o tres meses", "c", "ClNotebook", { props: { title: "Llantas", rows: [{ k: "Las 4", v: "cada mes" }, { k: "Repuesto", v: "2-3 meses" }, { k: "En frío", v: "mañana" }], mark: "✓" } }),
  S(47, "que tenga aire", "av", ""),
  // ── 14 · argolla de remolque
  S(48, "", "bi", "b_towkit", { p: BI(`Close view of ${H} taking a threaded metal tow eye out of a small foam tool tray in ${TRUNK}.`) }),
  S(48, "Y en el parachoques, una tapita", "kf", "k_towcap", { p: BI(`Extreme close view of the front bumper of ${CAR} with a small square plastic cover, ${H} pressing one edge of it.`), d1: "the finger presses the edge of the small cover", d2: "the small cover pops out revealing a threaded hole", sound: "a plastic pop" }),
  S(48, "Ahí se enrosca", "bi", "b_toweye", { p: BI(`Close view of a threaded metal tow eye screwed into the front bumper of ${CAR}, ${H} giving it a last turn.`) }),
  S(48, "sin romperte el parachoques", "bi", "st_towtruck", { q: "tow truck car", p: BI("A tow truck hooking an ordinary car on a quiet street.") }),
  // ── lo que ahorra
  C(49, "", "ClChapter", { n: 6, title: "Lo que te ahorra dinero", sub: "llantas · fusibles" }),
  S(50, "", "bi", "b_jamb", { p: BI(`The driver door of ${CAR} wide open in a workshop, the door frame pillar with a small white sticker on it.`) }),
  S(50, "Hay una etiqueta con números", "bi", "st_placard", { q: "tire pressure placard door", p: BI("Close view of a white tire pressure sticker on a car door frame pillar.") }),
  S(50, "Ésa es la presión correcta de tus llantas", "c", "ClTireLabel", { props: { mode: "door" } }),
  S(51, "", "av", ""),
  S(51, "El número grande escrito en la llanta", "bi", "b_sidewall", { q: "tire sidewall close", p: BI(`Extreme close view of the raised molded letters and numbers on the sidewall of ${TIRE}, ${H} tracing them with a fingertip.`) }),
  S(51, "es el máximo que aguanta", "c", "ClTireLabel", { props: { mode: "versus" } }),
  S(52, "", "bi", "b_lowtire", { p: BI(`Close view of a slightly flat-looking front tire of ${CAR} bulging at the bottom on a workshop floor.`) }),
  S(52, "Con las llantas bajas el auto gasta más gasolina", "bi", "st_gaspump", { q: "gas pump nozzle", p: BI("Close view of a gas pump nozzle in the fuel filler of an ordinary car, the numbers running.") }),
  S(52, "y las llantas se comen por los bordes", "bi", "b_edgewear", { q: "worn tire tread", p: BI(`Extreme close view of the tread of ${TIRE} worn smooth on both outer edges and still deep in the middle.`) }),
  S(52, "Las medimos en frío", "kf", "k_inflate", { p: BI(`Close view of ${H} pressing an air compressor hose chuck onto the valve of the front tire of ${CAR} in a workshop.`), d1: "the chuck presses onto the tire valve", d2: "the hand holds it while the tire firms up", sound: "a hiss of air" }),
  // ── 16 · testigo de desgaste
  S(53, "", "c", "ClTread3D", { props: { mode: "bar" } }),
  S(53, "hay unas rayitas de goma más altas", "bi", "st_tread", { q: "tire tread close up", p: BI(`Extreme close view of the tread grooves of ${TIRE}.`) }),
  S(53, "Cuando el dibujo de la llanta llega", "c", "ClTread3D", { props: { mode: "worn" } }),
  S(54, "", "kf", "k_coin", { p: BI(`Extreme close view of ${H} pushing a coin edge-first into a tread groove of ${TIRE}.`), d1: "the coin hovers over the groove", d2: "the coin goes into the groove and stops halfway", sound: "a soft rubber touch" }),
  S(54, "Las de Elena tenían vida para un año más", "c", "ClTread3D", { props: { mode: "coin" } }),
  S(54, "La agencia le había cotizado cuatro nuevas", "bi", "b_quotetires", { p: BI("Close view of a printed dealership quote with a line for four new tires circled in pen, lying on a car seat.") }),
  // ── 17 · fusibles
  S(55, "", "bi", "b_fusecover", { p: BI(`Close view under the steering wheel of ${CABIN}: ${H} unclipping a small plastic panel near the driver's left knee.`) }),
  S(55, "En la tapa por dentro hay un dibujo", "bi", "st_fusebox", { q: "car fuse box", p: BI("Close view of a car fuse box with rows of small colored plastic fuses.") }),
  S(55, "fusibles de repuesto y una pinzita", "c", "ClPins", { props: { img: I + "b_fusepanel.jpg", pins: [{ x: 0.3, y: 0.4, label: "El dibujo" }, { x: 0.62, y: 0.55, label: "Repuestos" }, { x: 0.8, y: 0.3, label: "La pinzita" }] } }),
  S(56, "", "bi", "b_charger", { q: "phone charger car", p: BI(`Close view of a phone charger plugged into the dead 12-volt socket of ${CABIN}, the phone screen showing it is not charging.`) }),
  S(56, "mira el fusible", "kf", "k_fusepull", { p: BI(`Extreme close view of ${H} gripping one small colored blade fuse with a tiny white plastic puller in a car fuse box.`), d1: "the puller grips the fuse", d2: "the puller pulls the small fuse straight out", sound: "a small plastic snap" }),
  S(56, "Si el alambrito de adentro está cortado", "bi", "b_fuseblown", { p: BI("Extreme close view of two small transparent blade fuses held in fingertips side by side, one with an intact metal strip, one with the strip broken.") }),
  S(56, "Es un arreglo de un dólar", "bi", "st_fuses", { q: "car fuses", p: BI("A handful of small colored car blade fuses on a workbench.") }),
  S(57, "", "av", ""),
  S(57, "Y nunca uno de número más alto", "c", "ClCheck", { props: { title: "El fusible", items: ["Auto apagado", "Uno igual, mismo número", "Nunca uno más alto"], fast: true } }),
  // ── la página de las luces
  S(58, "la de las luces del tablero", "bi", "b_lightspage", { p: BI(`Close view of a car owner's manual open at a page full of small dashboard warning light symbols, a red paper clip on the page, on the passenger seat of ${CABIN}.`) }),
  S(58, "Ponle un clip", "kf", "k_clip", { p: BI(`Close view of ${EH} sliding a red paper clip onto the edge of an open page of a car owner's manual.`), d1: "the clip is at the edge of the page", d2: "the fingers slide the clip onto the page", sound: "a small metal clip sound" }),
  S(58, "el día que algo se prenda en la carretera", "bi", "st_highway", { q: "driving highway car dashboard", p: BI("The view from the driver seat of an ordinary car on a highway, the dashboard at the bottom of the frame.") }),
];
