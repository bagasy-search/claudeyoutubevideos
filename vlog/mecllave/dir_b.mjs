// DIRECTOR B — mecllave: 1 vidrios desde afuera (subir también) · 2 la llave de metal + la cerradura escondida · 3 el aviso de la pila ·
// 4 CAMBIAR LA PILA (la frase del mostrador = mención 1, precio, marca, lo honesto, pasos 1-5, limpiar contactos, Elena lo hace sola,
// "una cena para dos", ClBookPage pág. 10 = mención 2, no hay que reprogramar) (párrafos 13-32).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { FOB, CELL } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/mecllave/";
const OPEN = "the two halves of an opened ordinary black car key fob lying on a workbench, a small green circuit board in one half";
export const SHOTS = [
  // ── 1 · vidrios
  S(13, "", "c", "ClKeyFob3D", { props: { mode: "windows" } }),
  S(13, "si mantienes apretado el botón de abrir", "kf", "k_holdopen", { p: BI(`Close view of ${H} holding ${FOB} with the thumb pressed down on the unlock button, ${CAR} parked in the sun behind.`), d1: "the thumb presses and holds the button", d2: "the thumb keeps holding the button down", sound: "a rubber button click" }),
  S(13, "si mantienes apretado el de cerrar, suben", "bi", "b_winup", { p: BI(`The side of ${CAR} in ${DRIVE} with its rear window half closed, dark rain clouds over the carport.`) }),
  S(13, "cuando te olvidaste un vidrio abierto", "bi", "st_rainwindow", { q: "rain on car window", p: BI("Raindrops hitting the open side window of a parked ordinary car.") }),
  S(14, "", "bi", "b_wetseat", { q: "car back seat", q2: "car seat", p: BI(`Close view of a wet gray cloth rear seat of ${CABIN}, a towel laid on it, rain on the window.`) }),
  S(14, "el asiento tardó dos días en secarse", "bi", "b_towels", { p: BI(`${ELENA} pressing an old towel onto the wet rear seat of ${CAR} parked in ${DRIVE}, an annoyed face.`) }),
  // ── 2 · la llave de metal
  S(15, "", "bi", "b_latch", { q: "car key fob", q2: "car key hand", p: BI(`Extreme close view of the small sliding release latch on the side of ${FOB} in ${H}.`) }),
  S(15, "la llave sale", "c", "ClKeyFob3D", { props: { mode: "key" } }),
  S(15, "La que le costó a Elena ochenta dólares de cerrajero", "bi", "b_locksmithmemory", { p: BI(`A locksmith in a gray polo with a tool bag talking with ${ELENA} next to ${CAR} in a supermarket parking lot.`), ov: { c: "ClChip", props: { text: "US$ 80", alert: true } } }),
  S(16, "", "bi", "b_handlecap", { p: BI(`Close view of the outside driver door handle of ${CAR} with a small plastic cover at its end.`) }),
  S(16, "Búscala hoy, con tranquilidad", "bi", "b_keyhole", { p: BI(`Close view of the round keyhole at the end of the driver door handle of ${CAR}, a small metal car key held next to it by its owner.`) }),
  S(16, "no el día que te quedes afuera", "av", ""),
  // ── 3 · el aviso
  S(17, "", "c", "ClRangeMeter", { props: { mode: "drop" } }),
  S(17, "que hay que apretar dos veces", "bi", "b_presstwice", { p: BI(`Close view of ${EH} pressing a key fob twice, ${CAR} a few meters away in a parking lot.`) }),
  S(17, "o el mensaje en el tablero", "bi", "b_dashmsg", { q: "car instrument panel", p: BI(`Close view of the plain instrument cluster of ${CABIN} with a small amber warning symbol of a key lit.`) }),
  S(17, "Ése es el momento de cambiarla", "av", ""),
  S(17, "No esperes a que se muera del todo", "bi", "b_deadlot", { p: BI(`Dusk in an almost empty supermarket parking lot, ${CAR} parked alone under a lamp post, ${ELENA} standing next to it holding grocery bags.`) }),
  C(18, "", "ClChapter", { n: 3, title: "Cambiar la pila", sub: "tú mismo · 2 minutos" }),
  // ── 4 · la pila: mención 1
  S(19, "", "av", ""),
  S(19, "Vas a una ferretería, a una relojería o a una farmacia", "bi", "b_pharmacy", { p: BI(`${ELENA} at the counter of a small neighborhood pharmacy, a pharmacist in a white coat showing her a small blister pack of coin batteries.`) }),
  S(19, "Casi siempre es una CR2032", "c", "ClBatterySwap", { props: { mode: "id" } }),
  S(19, "la misma de las balanzas de cocina", "bi", "b_scale", { q: "kitchen scale", p: BI("Close view of a small digital kitchen scale turned upside down on a counter, its round battery cover open showing a coin battery.") }),
  S(19, "En el Manual del Mecánico te dejé la frase exacta", "c", "ClBookPage", { props: { page: I + "page10.jpg", pageNo: 10, stamp: "La frase, en la página" } }),
  S(20, "", "bi", "b_blister", { p: BI(`Close view of a blister pack of two silver coin batteries in ${EH}, at a pharmacy counter.`), ov: { c: "ClChip", props: { text: "US$ 1-3" } } }),
  S(20, "en un paquete de dos", "bi", "b_twocells", { q: "button batteries", q2: "small batteries", p: BI(`Two ${CELL}s side by side on a workbench next to two key fobs, one older.`) }),
  S(21, "", "av", ""),
  S(21, "Las muy baratas a veces vienen descargadas", "bi", "st_batteries", { q: "batteries pile", p: BI("A small pile of assorted loose button batteries on a table.") }),
  S(21, "Mira también la fecha en el paquete", "bi", "b_expiry", { q: "battery package", q2: "battery pack", p: BI("Extreme close view of the back of a coin battery blister pack with a printed date, held by fingertips.") }),
  S(22, "", "av", ""),
  S(22, "Si el tuyo tiene tornillo", "bi", "b_screwfob", { q: "small screwdriver repair", p: BI(`Close view of ${H} unscrewing a tiny screw on the back of a car key fob with a small eyeglass screwdriver.`) }),
  S(22, "Lo que nunca hay que hacer", "c", "ClDoDont", { props: { yes: { label: "Moneda o destornillador chico", img: I + "b_dd_coin.jpg" }, no: { label: "Cuchillo", img: I + "b_dd_knife.jpg" } } }),
  S(22, "rayas el plástico y te puedes cortar", "av", ""),
  // ── los pasos
  S(23, "", "kf", "k_latchkey", { p: BI(`Close view of ${H} holding ${FOB}, thumb on the side latch.`), d1: "the thumb pushes the latch", d2: "a small metal key blade slides out of the bottom of the fob", sound: "a plastic click and metal sliding" }),
  S(24, "", "bi", "b_slot", { q: "car key remote", q2: "holding car key", p: BI(`Extreme close view of the empty slot at the bottom of ${FOB} where the metal key was, the fob in ${H}.`) }),
  S(24, "metes la punta de una moneda", "bi", "b_coinslot", { p: BI(`Extreme close view of ${H} pushing the edge of a small coin into the slot at the bottom of ${FOB}.`) }),
  S(24, "El control se abre en dos, como una almeja", "c", "ClKeyFob3D", { props: { mode: "battery" } }),
  S(25, "", "av", ""),
  S(25, "mira de qué lado está el signo más", "c", "ClBatterySwap", { props: { mode: "plus" } }),
  S(25, "sácale una foto con el celular", "bi", "b_photofob", { p: BI(`Close view of ${EH} holding an old phone over ${OPEN}, taking a photo.`) }),
  S(26, "", "kf", "k_cellout", { p: BI(`Extreme close view of ${OPEN}, ${CELL} seated in its holder, a thumbnail at its edge.`), d1: "the thumbnail rests at the edge of the battery", d2: "the thumbnail pushes the battery sideways out of its holder", sound: "a tiny metal click" }),
  S(26, "Agarrándola por los bordes", "c", "ClBatterySwap", { props: { mode: "edges" } }),
  S(26, "la grasa de la piel le quita contacto", "bi", "b_fingerprint", { p: BI(`Extreme close view of ${CELL} with a visible greasy fingerprint on its shiny face, on a workbench.`) }),
  S(27, "", "bi", "b_contacts", { q: "circuit board close up", p: BI(`Extreme close view of the small metal battery contacts inside ${OPEN}, slightly dull with a faint green powder.`) }),
  S(27, "pásales una goma de borrar de lápiz", "kf", "k_eraser", { p: BI(`Extreme close view of ${H} rubbing the metal battery contact inside an opened key fob with a pencil eraser.`), d1: "the eraser rests on the dull contact", d2: "the eraser rubs back and forth and the metal shines", sound: "a soft rubbing" }),
  S(27, "le devuelve la distancia al control", "av", ""),
  S(28, "", "kf", "k_close", { p: BI(`Close view of ${H} pressing the two halves of a black key fob together over a workbench.`), d1: "the two halves are lined up", d2: "the fingers squeeze around the edge and the halves snap shut", sound: "two plastic clicks" }),
  S(28, "vuelves a meter la llave de metal", "bi", "b_keyback", { p: BI(`Close view of ${H} sliding a small metal key blade back into the bottom of ${FOB}.`) }),
  S(28, "Abrir, cerrar, desde lejos", "bi", "st_unlockcar", { q: "unlocking car remote", q2: "car remote lock", p: BI(`A hand pointing a key fob at a parked car, its lights flashing.`) }),
  // ── Elena lo hace
  S(29, "", "bi", "b_elenacoin", { p: BI(`Close view of ${EH} twisting a small coin in the slot of ${FOB} at a workbench in ${SHOP}, her hands a little shaky.`) }),
  S(29, "Le temblaban un poco las manos", "bi", "b_elenafocus", { p: BI(`${ELENA} at a workbench in ${SHOP} concentrating on a small opened key fob through her reading glasses, ${H} pointing.`) }),
  S(29, "se paró en la puerta del taller", "bi", "b_elenadoor", { p: BI(`${ELENA} standing at the wide open door of ${SHOP} pointing a key fob back toward ${CAR} parked deep inside.`) }),
  S(29, "el auto contestó con sus dos lucecitas", "kf", "k_blink", { p: BI(`${CAR} parked inside ${SHOP}, its orange turn-signal lights off.`), d1: "the car's orange lights are off", d2: "both orange lights blink twice", sound: "a short car lock chirp" }),
  S(30, "", "bi", "b_elenalaugh", { p: BI(`${ELENA} in ${SHOP} laughing with the closed key fob in her hand, looking at the mechanic.`) }),
  S(30, "Una cena para dos, con postre", "bi", "b_dinner", { q: "restaurant dinner table", p: BI("A restaurant table set for two with plates, two glasses and a small dessert, a bill on a tray.") }),
  S(30, "Por una pila de dos", "bi", "b_cellcoin", { q: "coin battery", p: BI(`Extreme close view of ${CELL} next to a small coin on a workbench.`) }),
  // ── mención 2
  C(31, "", "ClBookPage", { page: I + "page10.jpg", pageNo: 10, stamp: "Paso por paso, en la página" }),
  // ── no hay que reprogramar
  S(32, "", "av", ""),
  S(32, "que después de cambiar la pila hay que volver a programar", "bi", "b_programmer2", { q: "diagnostic tool car", p: BI("Close view of a key programming tool with a small screen and a cable on a dealership desk, a key fob next to it.") }),
  S(32, "En la gran mayoría de los autos, no", "c", "ClCheck", { props: { title: "Después del cambio", items: ["El código queda guardado", "No hay que programar", "Si no anda: pila al derecho"], fast: true } }),
  S(32, "revisa primero que la pila esté al derecho", "av", ""),
];
