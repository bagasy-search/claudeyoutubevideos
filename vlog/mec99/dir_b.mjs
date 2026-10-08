// DIRECTOR B — mec99: el tablero (1 flecha del tanque · 2 espejo día/noche · 3 recirculación), la llave (4 llave de metal escondida =
// pago del loop del cerrajero · 5 ventanillas desde el control), las puertas (6 traba de niños: el misterio de la hermana) y la mención 2
// del Manual (ClBookPage pág. 9) (párrafos 15-36).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { GAUGE, FOB } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/mec99/";
const SIS = "Doña Elena's older sister, a 76-year-old Latin American woman with short white curly hair and a navy cardigan";
export const SHOTS = [
  C(15, "", "ClCarMap", { n: 1, zone: "tablero" }),
  // ── 1 · la flecha del tanque
  S(16, "", "c", "ClFuelGauge", { props: { side: "left", car: true } }),
  S(16, "Al lado del dibujito del surtidor", "bi", "b_arrowmacro", { p: BI(`Extreme close view of the small gas-pump symbol on ${GAUGE} and the tiny triangle arrow right next to it pointing left.`) }),
  S(16, "Ese triangulito apunta al lado", "bi", "b_fueldoorleft", { p: BI(`The rear left corner of ${CAR} parked in a workshop, its small round fuel door open, the black fuel cap visible.`) }),
  S(16, "Si apunta a la izquierda", "bi", "st_fueldoor", { q: "car fuel door open", p: BI("Close view of the open fuel door of an ordinary car, the fuel cap unscrewed.") }),
  S(17, "", "bi", "b_elenalaugh", { p: BI(`${ELENA} in the driver seat of ${CAR} laughing with a hand over her mouth, looking at the dashboard.`) }),
  S(17, "Don Ernesto siempre cargaba la gasolina", "bi", "b_ernestogas", { p: BI("A faded printed family photo: a gray-haired man with a mustache filling a silver sedan at an old gas station, smiling at the camera.") }),
  S(17, "la mitad de las veces se paró del lado equivocado", "bi", "b_wrongside", { p: BI(`${CAR} stopped at a gas station with the pump on its right side and the fuel door on the left side, the hose stretched across the trunk not reaching.`) }),
  // ── 2 · el espejo
  S(18, "", "bi", "st_mirror", { q: "car rear view mirror", p: BI(`Close view of the rear-view mirror of ${CABIN}, the rear window reflected in it.`) }),
  S(18, "Abajo tiene una palanquita", "kf", "k_mirrortab", { p: BI(`Extreme close view of the small plastic day-night tab under the rear-view mirror of ${CABIN}, ${H} with a fingertip on it.`), d1: "the fingertip rests on the small tab under the mirror", d2: "the fingertip flips the tab and the mirror tilts slightly", sound: "a small plastic click" }),
  S(18, "Es para la noche", "bi", "st_nightglare", { q: "headlights glare night driving", p: BI("Night, the bright headlights of a car behind seen in a rear-view mirror, glaring.") }),
  S(18, "y te encandila", "bi", "b_mirrordim", { p: BI(`Night, the rear-view mirror of ${CABIN} tilted to night mode, the headlights behind reflected dim and soft.`) }),
  S(19, "", "bi", "b_elenaeyes", { p: BI(`Night, ${ELENA} driving ${CAR} with one hand raised to shield her eyes from bright headlights behind, squinting.`) }),
  S(19, "Una palanquita", "av", ""),
  // ── 3 · recirculación
  S(20, "", "bi", "st_acbuttons", { q: "car air conditioning buttons", p: BI(`Close view of the plain air-conditioning controls of ${CABIN}: three round knobs and a few small buttons.`) }),
  S(20, "Es la recirculación", "kf", "k_recirc", { p: BI(`Extreme close view of ${H} pressing the small recirculation button with a curved-arrow car symbol on the air-conditioning panel of ${CABIN}.`), d1: "the fingertip pushes the small button", d2: "the button's little indicator light turns on", sound: "a small button click" }),
  S(20, "deja de meter aire de afuera", "c", "ClAirFlow", { props: { mode: "recirc" } }),
  S(21, "", "av", ""),
  S(21, "Detrás de un camión que larga humo negro", "bi", "st_truck", { q: "truck exhaust smoke traffic", p: BI("An old truck in traffic blowing dark diesel smoke from its exhaust pipe, seen from the car behind.") }),
  S(21, "Y si se te empañan los vidrios", "bi", "st_fogwind", { q: "fogged windshield rain", p: BI(`The inside of the windshield of ${CABIN} fogged up on a rainy day.`) }),
  S(21, "lo apagas, prendes el aire", "c", "ClAirFlow", { props: { mode: "defog" } }),
  S(22, "", "bi", "b_elenawipe", { p: BI(`${ELENA} driving ${CAR} in the rain, wiping the fogged windshield with a white handkerchief with one hand.`) }),
  S(22, "y manejaba limpiándolo con un pañuelo", "bi", "b_hanky", { p: BI(`Close view of ${EH} rubbing a white embroidered handkerchief on a fogged windshield, a clear streak appearing.`) }),
  // ── la llave: el cerrajero
  C(23, "", "ClChapter", { n: 3, title: "La llave", sub: "lo del cerrajero" }),
  S(24, "", "bi", "b_lot", { p: BI(`${ELENA} in a supermarket parking lot pointing her key fob at ${CAR}, frowning, grocery bags at her feet.`) }),
  S(24, "Ella apretaba y nada", "kf", "k_press", { p: BI(`Close view of ${EH} pressing the unlock button of ${FOB} again and again, ${CAR} sharp behind in the parking lot.`), d1: "the thumb presses the unlock button", d2: "the thumb presses it hard twice more, nothing happens", sound: "small rubber button clicks" }),
  S(24, "Las bolsas en el piso", "bi", "b_bags", { p: BI(`Grocery bags on the asphalt of a parking lot next to the closed driver door of ${CAR}, a tub of ice cream sweating on top.`) }),
  S(24, "Llamó a un cerrajero", "bi", "b_phonecall", { p: BI(`${ELENA} standing next to ${CAR} in a parking lot talking on an old cell phone, worried.`) }),
  S(24, "que tardó una hora", "bi", "b_locksmith", { p: BI(`A locksmith in a gray polo working a long thin tool into the driver door of ${CAR} in a supermarket parking lot.`) }),
  S(24, "y le cobró ochenta dólares", "bi", "b_receipt80", { p: BI(`Close view of a handwritten locksmith receipt for 80 dollars in ${EH}, the parking lot behind.`) }),
  // ── 4 · la llave de metal
  S(25, "", "c", "ClCarMap", { props: { n: 4, zone: "llave" } }),
  S(25, "En un costado tiene una trabita", "bi", "b_fobslide", { p: BI(`Extreme close view of the side of ${FOB} in ${H}, a small sliding release latch on its edge.`) }),
  S(25, "Lo aprietas, y sale una llave de metal", "c", "ClKeyFob3D", { props: { mode: "key" } }),
  S(25, "Una llave de verdad", "kf", "k_keyout", { p: BI(`Close view of ${H} holding ${FOB}, pressing the small side latch.`), d1: "the thumb pushes the side latch", d2: "a small metal key blade slides out of the fob and the fingers pull it free", sound: "a small plastic click and metal sliding" }),
  S(26, "", "bi", "b_doorhandle", { p: BI(`Close view of the driver door handle of ${CAR}, a small plastic cap at the end of the handle hiding the keyhole.`) }),
  S(26, "escondida detrás de una tapita", "kf", "k_handlecap", { p: BI(`Extreme close view of ${H} prying the small plastic end cap off the driver door handle of ${CAR} with the tip of a metal key.`), d1: "the key tip pries under the small plastic cap", d2: "the cap pops off revealing a round metal keyhole", sound: "a small plastic pop" }),
  S(26, "Con esa llave de metal", "bi", "b_keyinlock", { p: BI(`Close view of ${H} turning a small metal key in the keyhole of the driver door of ${CAR}.`) }),
  S(26, "aunque la pila del control esté muerta", "c", "ClKeyFob3D", { props: { mode: "dead" } }),
  S(27, "", "cl", "c_givekey", { p: CLP(`In his workshop he holds up a small metal key blade between two fingers in front of ${ELENA}, who looks at it in silence.`), rev: 1 }),
  S(27, "Se quedó mirándola un rato largo", "bi", "b_elenakey", { p: BI(`Close view of ${EH} holding a small metal car key blade in her open palm, her wedding ring next to it.`) }),
  S(27, "ochenta dólares, Claudio", "av", ""),
  // ── 5 · las ventanillas
  S(28, "", "bi", "b_fobpress", { p: BI(`Close view of ${H} holding ${FOB} with the thumb pressing the unlock button, ${CAR} parked in the sun behind.`) }),
  S(28, "si mantienes apretado el botón de abrir", "c", "ClKeyFob3D", { props: { mode: "windows" } }),
  S(28, "se bajan todas las ventanillas a la vez", "kf", "k_windows", { p: BI(`${CAR} parked in the sun in ${DRIVE}, all four windows closed, seen from the side.`), d1: "all the windows are closed", d2: "the side windows slowly roll down together", sound: "the hum of power window motors" }),
  S(29, "", "bi", "st_hotcar", { q: "car parked hot sun", p: BI(`${CAR} parked under a strong afternoon sun in an open parking lot, heat haze over the hood.`) }),
  S(29, "Bajas los vidrios desde lejos", "bi", "b_walkfob", { p: BI(`${ELENA} walking across a sunny parking lot toward ${CAR} holding the key fob out, the car windows down.`) }),
  S(29, "ya salió el aire caliente", "bi", "st_windowdown", { q: "car window rolling down", p: BI("Close view of a car side window rolling down on a sunny day.") }),
  S(30, "", "av", ""),
  S(30, "pruébalo parado al lado del auto", "bi", "b_testwin", { p: BI(`${ELENA} standing next to ${CAR} in a workshop holding the fob with her thumb on the button, watching the window, ${H} pointing at the window.`) }),
  S(30, "busca en el manual la palabra ventanillas", "bi", "b_manualwin", { p: BI(`Close view of ${EH} holding an open car owner's manual at a page with a small diagram of a car door and window buttons.`) }),
  // ── las puertas: 6 · traba de niños
  C(31, "", "ClChapter", { n: 4, title: "Puertas y asientos", sub: "lo que se toca y no se ve" }),
  S(32, "", "bi", "b_reardoor", { p: BI(`The rear left door of ${CAR} wide open in a workshop, seen from the side.`) }),
  S(32, "mira el borde, el canto de la puerta", "c", "ClChildLock", { props: { mode: "find" } }),
  S(32, "Hay una palanquita chiquita", "bi", "st_childlock", { q: "car child safety lock door", p: BI("Extreme close view of the small child-lock lever on the edge of an open rear car door.") }),
  S(32, "Si está puesta", "c", "ClChildLock", { props: { mode: "locked" } }),
  S(33, "", "bi", "b_church", { p: BI(`${CAR} parked in front of a small white neighborhood church on a Sunday morning.`) }),
  S(33, "la hermana siempre se queda encerrada atrás", "bi", "b_sisstuck", { p: BI(`${SIS} sitting in the back seat of ${CAR}, pulling the inside door handle that does not open, puzzled.`) }),
  S(33, "hasta que Elena le abre de afuera", "bi", "b_elenaopens", { p: BI(`${ELENA} opening the rear door of ${CAR} from outside for her older sister in the back seat, in front of a church.`) }),
  S(33, "Pensaban que la manija estaba rota", "bi", "b_innerhandle", { p: BI("Close view of the inside door handle of a rear car door, gray plastic, a little worn.") }),
  S(34, "", "av", ""),
  S(34, "Seguramente desde que Don Ernesto llevaba a los nietos", "bi", "b_nietos", { p: BI("A faded printed family photo: a gray-haired man with a mustache buckling two small grandchildren into the back seat of a silver sedan.") }),
  S(34, "La bajamos con la punta de la llave de metal", "kf", "k_unlock", { p: BI(`Extreme close view of ${H} pushing the small child-lock lever on the edge of the rear door of ${CAR} with the tip of a small metal key.`), d1: "the key tip rests on the small lever", d2: "the key pushes the lever down to the unlocked position", sound: "a small click" }),
  S(34, "Y la manija abrió", "c", "ClChildLock", { props: { mode: "open" } }),
  S(35, "", "av", ""),
  S(35, "Si llevas niños", "bi", "st_kidseat", { q: "child in car back seat", p: BI("A small child sitting in a car seat in the back of an ordinary car.") }),
  // ── mención 2: la página 9
  C(36, "", "ClBookPage", { page: I + "page9.jpg", pageNo: 9, stamp: "La lista, en la página" }),
  S(36, "para que la hagas con tu auto", "bi", "b_checkdash", { p: BI(`${ELENA} in the driver seat of ${CAR} holding a printed checklist page, ticking a line with a pen, the dashboard in front of her.`) }),
];
