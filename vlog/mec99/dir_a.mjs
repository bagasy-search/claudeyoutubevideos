// DIRECTOR A — mec99 (Claudio el Mecánico #1, "El auto de Doña Elena" ep. 1: las 17 cosas que el auto ya trae): MINUTO 1 (la flechita
// del tanque que Elena nunca vio en 8 años → el sedán de Don Ernesto, la agencia que dice "ya no vale la pena" → loop del cerrajero de
// US$80 y lo escondido en el control → promesa (17 cosas, antes/después) → credibilidad + las 3 pruebas → capítulo) + Elena en el
// taller + la revisión de 15 minutos + mención 1 del Manual (la frase para pedir el manual del auto, pág. 9) (párrafos 0-14).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const GAUGE = "the plain analog instrument cluster of an ordinary 2012 compact sedan: a speedometer, a tachometer and a small fuel gauge with a gas-pump symbol and a tiny triangle arrow next to it";
export const FOB = "an ordinary black plastic car remote key fob with three rubber buttons (lock, unlock, trunk), slightly worn, no brand logo";
const I = "img/mec99/";
export const SHOTS = [
  // ── 0:00 · la flechita que nunca vio
  S(0, "", "kf", "k_gauge", { p: BI(`Extreme close view of ${GAUGE}, the needle near empty, ${H} pointing a fingertip right next to the tiny triangle arrow beside the gas-pump symbol.`), d1: "the fingertip hovers over the tiny triangle arrow next to the gas-pump symbol", d2: "the fingertip taps twice next to the arrow", sound: "a soft tap on plastic", ov: { c: "ClStampOv", props: { text: "8 AÑOS SIN VERLA" } } }),
  S(0, "maneja este auto", "av", ""),
  S(0, "Y nunca vio esto", "c", "ClFuelGauge", { props: { side: "left" } }),
  S(0, "al lado del dibujo del surtidor", "bi", "st_fuelgauge", { q: "car fuel gauge", p: BI(`Close view of ${GAUGE}, the fuel needle low.`) }),
  S(0, "te dice de qué lado está la tapa", "bi", "b_fueldoor0", { p: BI(`Close view of the small closed fuel door on the rear left side of ${CAR}, ${H} pointing at it, a workshop floor behind.`) }),
  S(0, "la tapa de la gasolina", "bi", "b_fuelcap", { p: BI(`Extreme close view of the black screw-on fuel cap inside the open fuel door of ${CAR}, ${H} on the cap.`) }),
  S(0, "Ocho años dando la vuelta", "bi", "b_gasturn", { p: BI(`${ELENA} sitting at the wheel of ${CAR} stopped at a gas station pump, the pump on the wrong side of the car, the attendant pointing to the other side, she looks embarrassed.`) }),
  S(0, "en la gasolinera", "bi", "st_gasstation", { q: "gas station refueling car", p: BI("An ordinary gas station on a sunny morning, a car stopped at a pump, an attendant with the nozzle.") }),
  // ── el auto de Elena
  S(1, "", "bi", "b_car0", { p: BI(`${CAR} parked just inside the open roll-up door of ${SHOP}, ${ELENA} standing next to it holding a thick folder against her chest.`) }),
  S(1, "Un sedán plateado del 2012", "bi", "b_carside", { p: BI(`The whole side of ${CAR} parked on the cement floor of a small workshop in daylight, a little dusty.`) }),
  S(1, "con doscientos ochenta mil", "bi", "b_odo", { p: BI(`Extreme close view of the odometer window in ${GAUGE}, a six-digit mileage number, a little dust on the plastic.`), ov: { c: "ClChip", props: { text: "280.000 km" } } }),
  S(1, "Era de su esposo", "bi", "b_ernestophoto", { p: BI(`${EH} holding a faded printed family photo: a smiling gray-haired man in his sixties with a mustache standing proudly next to a brand-new silver sedan at a dealership in 2012.`), rev: 1 }),
  S(1, "Y en la agencia", "bi", "b_dealer", { p: BI(`${ELENA} sitting at a desk in an ordinary car dealership office facing a young salesman in a white shirt and tie who slides papers toward her with a pen.`) }),
  S(1, "le dijeron que ya no vale la pena", "bi", "b_headshake", { p: BI(`A young car salesman in a white shirt and tie at a dealership desk shaking his head with a fake sad smile, a printed quote in his hand.`) }),
  S(1, "que mejor se compre uno nuevo", "bi", "b_brochure", { p: BI("Close view of a young salesman's hand sliding a glossy new-car brochure and a financing sheet with columns of numbers across a dealership desk.") }),
  // ── el loop del cerrajero
  S(2, "", "bi", "b_locksmith0", { p: BI(`In a supermarket parking lot, a locksmith in a gray polo slides a thin metal tool into the driver door window gap of ${CAR}, ${ELENA} waits beside him with grocery bags on the ground.`) }),
  S(2, "ochenta dólares", "bi", "b_cash80", { p: BI(`Close view of ${EH} handing four folded twenty-dollar bills to a locksmith's hand next to a car door in a parking lot.`), ov: { c: "ClChip", props: { text: "US$ 80", alert: true } } }),
  S(2, "en el estacionamiento del súper", "bi", "st_parking", { q: "supermarket parking lot", p: BI("An ordinary supermarket parking lot in daylight, cars parked, shopping carts.") }),
  S(2, "por algo que el auto traía escondido", "c", "ClKeyFob3D", { props: { mode: "tease" } }),
  S(2, "adentro del control de la llave", "bi", "b_fobpalm", { p: BI(`Close view of ${EH} holding ${FOB} in her open palm, a parking lot behind.`) }),
  S(2, "Te lo muestro en un rato", "av", ""),
  // ── la promesa
  S(3, "", "av", ""),
  S(3, "diecisiete cosas", "c", "ClCarMap", { props: { n: 0, all: true } }),
  S(3, "que ya pagaste", "bi", "b_manualbag", { p: BI(`Close view inside the open glovebox of ${CABIN}: a thick owner's manual still sealed in its plastic bag, a few old receipts and a pen.`) }),
  S(3, "y que nadie te enseñó", "bi", "b_salesman", { p: BI("A young car salesman in a tie quickly handing over a key fob while looking at his phone, a customer's hand reaching for it, a dealership lot behind.") }),
  S(3, "Unas te sacan de un apuro", "bi", "st_fog", { q: "foggy windshield rain", p: BI(`A fogged-up windshield seen from the driver seat of ${CABIN} on a rainy day, the wipers still.`) }),
  S(3, "otras te ahorran dinero", "bi", "st_tiregauge", { q: "tire pressure gauge", p: BI(`Close view of ${H} pressing a pencil tire pressure gauge onto the valve of a car tire.`) }),
  S(3, "y una te puede salvar la vida", "kf", "k_trunkglow", { p: BI("Dark inside of a car trunk with the lid closed, only a small glow-in-the-dark T-shaped trunk release handle glowing yellow-green near the latch."), d1: "the small trunk release handle glows yellow-green in the dark", d2: "a hand reaches the glowing handle and pulls it, a crack of daylight opens", sound: "a plastic click and the trunk latch releasing" }),
  S(3, "Las buscamos una por una", "cl", "c_car1", { p: CLP(`In his workshop he opens the driver door of ${CAR} and looks back at the camera with a small smile.`) }),
  S(3, "en el auto de Doña Elena", "bi", "b_elenacar", { p: BI(`${ELENA} standing next to the open driver door of ${CAR} in a small workshop, her hand on the roof.`) }),
  S(3, "Así llegó al taller", "bi", "b_before", { p: BI(`${ELENA} getting out of ${CAR} at the open door of ${SHOP}, worried, holding a thick folder of papers.`), ov: { c: "ClChip", props: { text: "Así llegó", alert: true } } }),
  S(3, "Y así se fue", "bi", "b_after", { p: BI(`${ELENA} smiling and waving from the driver seat of ${CAR} as she drives slowly out of the open door of a small workshop into the sunny street.`), ov: { c: "ClChip", props: { text: "Así se fue" } } }),
  // ── credibilidad + las 3 pruebas
  S(4, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "35 años de mecánico" } } }),
  S(4, "Treinta y cinco años de mecánico", "bi", "st_mechanic", { q: "mechanic working engine", p: BI(`Close view of ${H} working with a wrench in the engine bay of an older car in a small workshop.`) }),
  S(4, "Y al final te doy", "av", ""),
  S(4, "las tres pruebas", "bi", "b_cardboard0", { p: BI(`Night, a flattened cardboard sheet on the cement carport floor under the front of ${CAR}, a few dark drops on it, lit by a flashlight.`) }),
  S(4, "de diez minutos", "bi", "b_headlights0", { p: BI(`Night, ${CAR} parked facing a white garage wall with its headlights on, two round pools of light on the wall.`) }),
  S(4, "antes de llevar tu auto", "bi", "st_dashlights", { q: "car dashboard warning lights", p: BI(`Close view of ${GAUGE} with several small warning lights lit in red and amber at engine start.`), ov: { c: "ClChip", props: { text: "$0 · 10 minutos" } } }),
  S(4, "a cualquier taller", "bi", "st_garage", { q: "auto repair shop", p: BI(`The open door of an ordinary small auto repair shop seen from the street, a car on a lift inside.`) }),
  C(5, "", "ClChapter", { n: 1, title: "El auto de Doña Elena", sub: "2012 · 280.000 km" }),
  // ── Elena en el taller
  S(6, "", "bi", "b_arrive", { p: BI(`${CAR} rolling slowly into the open door of ${SHOP} on a weekday morning, ${ELENA} driving with both hands on the wheel.`) }),
  S(6, "con una señora de setenta y dos años", "bi", "b_elenawheel", { p: BI(`${ELENA} at the wheel of ${CAR}, seen through the open driver window, sitting very upright, focused.`) }),
  S(6, "Pelo canoso recogido", "bi", "b_elenaclose", { p: BI(`${ELENA} standing in ${SHOP} next to her car, looking at the mechanic with a polite worried face.`) }),
  S(6, "y una carpeta llena de papeles", "bi", "b_folder", { p: BI(`A thick worn blue folder stuffed with printed quotes and papers on the gray cloth passenger seat of ${CABIN}.`) }),
  C(7, "", "ClReceipt", { head: "PRESUPUESTO DE LA AGENCIA", lines: [["Servicio completo", "US$ 480"], ["4 llantas nuevas", "US$ 520"], ["Llave nueva", "US$ 180"], ["Auto nuevo", "60 cuotas"]], total: ["Total", "US$ 1.180 + cuotas"] }),
  S(7, "Me dijo", "bi", "b_elenaask", { p: BI(`${ELENA} in ${SHOP} holding the open folder of quotes toward the camera, her eyebrows raised, asking a question.`) }),
  S(7, "de verdad este auto ya no sirve", "av", ""),
  S(8, "", "bi", "b_ernestonew", { p: BI("A faded 2012 printed photo: a gray-haired man in his sixties with a mustache shaking hands with a salesman next to a brand-new silver compact sedan with a red bow on the hood.") }),
  S(8, "lo cuidaba como a un hijo", "bi", "b_ernestowash", { p: BI("A faded printed family photo: a gray-haired man with a mustache washing a silver sedan with a sponge and a bucket in the driveway of a modest house on a sunny Sunday.") }),
  S(8, "Cuando él murió", "bi", "b_rosary", { p: BI(`Close view of a small wooden rosary hanging from the rear-view mirror of ${CABIN}, the windshield and a quiet street behind.`) }),
  S(8, "pero nadie le explicó nada", "av", ""),
  S(8, "Y el manual seguía en la guantera", "kf", "k_glovebox", { p: BI(`Close view of the closed glovebox of ${CABIN}, ${H} on the latch.`), d1: "the hand pulls the glovebox latch", d2: "the glovebox lid drops open showing a thick owner's manual still sealed in its plastic bag", sound: "a plastic latch click and the lid dropping" }),
  S(9, "", "cl", "c_listen", { p: CLP(`In his workshop he leans over the open hood of ${CAR}, one hand raised in the air, listening to the idling engine with his head tilted.`) }),
  S(9, "Arrancó a la primera", "bi", "st_ignition", { q: "turning car key ignition", p: BI(`Close view of a hand turning a car key in the ignition of ${CABIN}.`) }),
  S(9, "El aceite, limpio", "bi", "b_dipstick", { p: BI(`Close view of ${H} holding an engine oil dipstick over a white paper towel, a clean amber oil line between the two marks, the open hood of ${CAR} behind.`) }),
  S(9, "Los frenos, firmes", "bi", "st_brakepedal", { q: "foot pressing brake pedal", p: BI("Close view of a foot in a work boot pressing the brake pedal of an ordinary car.") }),
  S(9, "Ese auto no estaba muerto", "av", ""),
  S(10, "", "av", ""),
  S(10, "Un auto de quince años", "bi", "st_oldcars", { q: "old cars parked street", p: BI("Ordinary older cars parked along a quiet residential street in a Latin American town, morning light.") }),
  S(10, "Y trae un montón de cosas", "bi", "b_cabinwide", { p: BI(`The whole inside of ${CABIN} seen from the open driver door, the dashboard, the steering wheel, the gear lever and the console.`) }),
  S(10, "el manual tiene cuatrocientas páginas", "kf", "k_manualflip", { p: BI(`Close view of ${EH} holding a thick car owner's manual open on her lap in the driver seat.`), d1: "the thick manual lies open on her lap", d2: "her thumb lets dozens of pages flip by quickly", sound: "paper pages flipping fast" }),
  // ── la revisión de 15 minutos
  C(11, "", "ClChapter", { n: 2, title: "La revisión de 15 minutos", sub: "con el manual en la mano" }),
  S(12, "", "cl", "c_flashlight", { p: CLP(`He sits sideways in the driver seat of ${CAR} with the door open, a small flashlight in one hand and the open owner's manual on his knee, looking at the camera.`) }),
  S(12, "el manual abierto en el índice", "bi", "b_index", { p: BI(`Close view of ${H} running a fingertip down the printed index page of a car owner's manual on a car seat.`) }),
  S(12, "Quince minutos, una sola vez", "bi", "b_parkedmorning", { p: BI(`${CAR} parked in the open carport of ${DRIVE} on a quiet morning, the driver door open.`), ov: { c: "ClChip", props: { text: "15 min · una vez" } } }),
  S(12, "Y vas tocando cada cosa con la mano", "bi", "b_touch", { p: BI(`Close view of ${EH} touching a small lever on the dashboard of ${CABIN} while ${H} points at it.`) }),
  S(12, "para encontrarla sin pensar", "av", ""),
  S(13, "", "av", ""),
  S(13, "No todos los autos traen todo", "bi", "st_carsrow", { q: "row of parked cars", p: BI("A row of ordinary different older cars parked in a lot, seen from the side.") }),
  S(13, "Si algo de lo que te muestro", "bi", "b_indexfind", { p: BI(`Close view of ${EH} with reading glasses holding the owner's manual open at the index, a fingertip on one line.`) }),
  S(13, "Y si no está ahí", "av", ""),
  S(13, "No es que esté roto", "bi", "b_elenasmile0", { p: BI(`${ELENA} in the driver seat of ${CAR} with the manual on her lap, laughing softly at something the mechanic said.`) }),
  // ── mención 1: la frase para pedir el manual
  S(14, "", "bi", "b_laptop", { p: BI(`Close view of ${EH} on the keyboard of an old laptop on a kitchen table, the screen showing a plain page of a car owner's manual document with diagrams.`) }),
  S(14, "O lo pides en la agencia", "bi", "b_partsdesk", { p: BI(`${ELENA} at the parts counter of a car dealership, a clerk in a polo shirt typing at a computer behind the counter.`) }),
  C(14, "En el Manual del Mecánico te dejé la frase exacta", "ClBookPage", { page: I + "page9.jpg", pageNo: 9, stamp: "La frase, en la página" }),
  S(14, "para que no te quieran vender otra cosa", "av", ""),
];
