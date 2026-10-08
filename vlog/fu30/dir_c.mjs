// DIRECTOR C — fu30: los 5 errores + preguntas rápidas + a la semana (sin luz abajo, la raya entera, hormigas perdidas afuera) + la revisión
// de la noche + CTA 3 (regalo "Antes de Fumigar" con QR /r + Manual US$27) + gancho al ep. 3 (las bolitas negras y la bolsa de croquetas
// mordida en el garaje → los ratones) + cierre (párrafos 56-83).
import { S, BI, CLP, LUCIA, JORGE, KIDS, DOG } from "../claudio/lib.mjs";
import { H, DOOR, PATIO, BIGROACH, ANTS, CHALK, HERBS } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fu30/";
const GARAGE = "a dim cluttered garage of a modest family house: a bare cement floor, a white car's bumper, metal shelves with paint cans and boxes, a big bag of dog food on the floor against the wall";
export const SHOTS = [
  C(56, "", "ClChapter", { n: 8, title: "Los 5 errores", sub: "con la barrera", alert: true }),
  S(57, "", "bi", "b_err1", { p: BI(`Night, ${CHALK} on a threshold and a bright line of light under the closed door above it.`), ov: { c: "ClChip", props: { text: "Error 1", alert: true } } }),
  S(57, "Pasan por arriba", "av", ""),
  S(58, "", "bi", "b_err2", { p: BI(`Close view of a white chalk line on a door threshold with a gap in it, ants walking through the gap.`), ov: { c: "ClChip", props: { text: "Error 2", alert: true } } }),
  S(58, "la tiza se borra con la escoba", "bi", "b_broomchalk", { q: "broom sweeping", p: BI("A broom sweeping across a door threshold, smearing a white chalk line.") }),
  S(59, "", "bi", "b_err3", { p: BI(`Close view of a white chalk line on a wooden threshold turned into a wet white paste where vinegar was sprayed on it.`), ov: { c: "ClChip", props: { text: "Error 3", alert: true } } }),
  S(59, "El vinagre va antes", "av", ""),
  S(60, "", "bi", "b_err4", { p: BI("Old faded brown bay leaves and dull cloves left on a dusty door frame ledge.") , ov: { c: "ClChip", props: { text: "Error 4", alert: true } } }),
  S(61, "", "bi", "b_err5", { p: BI(`${JORGE} spraying an aerosol can with a plain blank label at the bottom of the back door of his kitchen.`), ov: { c: "ClChip", props: { text: "Error 5", alert: true } } }),
  S(61, "y el nido sigue mandando", "av", ""),
  C(62, "", "ClChapter", { n: 9, title: "Preguntas rápidas", sub: "las que me hacen siempre" }),
  S(63, "", "bi", "st_chalkbox", { q: "chalk box", p: BI("A box of plain white school blackboard chalk sticks, opened, on a table.") }),
  S(63, "la tiza común de pizarrón", "bi", "st_blackboard", { q: "school blackboard chalk", p: BI("A stick of white chalk resting on the ledge of a school blackboard.") }),
  S(64, "", "bi", "st_bigroach4", { q: "cockroach floor", p: BI(`${BIGROACH} on a white tile floor near a door at night.`) }),
  S(64, "A ésas las frena el burlete y la masilla", "bi", "b_sweepdone", { p: BI(`Close view of the bottom of ${DOOR.replace("the back patio door of a modest family kitchen: ", "")} with a new black brush door sweep touching the floor.`) }),
  S(65, "", "bi", "st_oil", { q: "essential oil cotton", p: BI("A small dark glass dropper bottle and a cotton ball on a wooden window ledge.") }),
  S(65, "con un perro que olfatea todo", "bi", "b_dogsniff2", { q: "dog sniffing", p: BI(`${DOG} sniffing the bottom of a wooden door frame.`) }),
  S(66, "", "bi", "b_grandmakitchen", { q: "old kitchen spices", p: BI("A warm old kitchen shelf with jars of cloves, bay leaves and cinnamon sticks.") }),
  S(67, "", "bi", "st_screen", { q: "window mosquito screen", p: BI("A kitchen window with a mosquito screen, seen from inside, daylight.") }),
  S(68, "", "bi", "st_rain2", { q: "rain door step", p: BI("Rain falling on the concrete step outside a closed door.") }),
  S(68, "y las hierbas en el marco, bajo techo", "av", ""),
  S(69, "", "bi", "st_mosquito", { q: "mosquito", p: BI("A mosquito resting on a white wall.") }),
  S(69, "no dejar agua quieta en el patio", "bi", "st_bucket", { q: "standing water bucket", p: BI("An old bucket with standing rainwater in the corner of a cement patio.") }),
  S(70, "", "bi", "st_hallway", { q: "apartment hallway door", p: BI("An apartment building hallway with a closed apartment door and a gap of light under it.") }),
  S(70, "Burlete, masilla, y la raya", "av", ""),
  S(71, "", "bi", "b_receipt", { p: BI(`On a kitchen table: a brush door sweep, a tube of white putty, a stick of white chalk, a small jar of whole cloves and dry bay leaves next to a short paper receipt.`) }),
  C(71, "Menos de lo que pagaron por cada fumigación", "ClReceipt", { head: "LO QUE GASTARON", lines: [["Burlete", "1"], ["Masilla", "1 tubo"], ["Tiza", "1"], ["Clavo y laurel", "1 frasco"]], total: ["vs. 1 fumigación", "menos"] }),
  // ── el resultado
  S(72, "", "bi", "b_nightdark", { p: BI(`Night, a dark kitchen seen from inside, ${DOOR.replace("the back patio door of a modest family kitchen: ", "")} closed.`) }),
  C(72, "ni una rayita de luz debajo de la puerta", "ClDoorGap", { mode: "sealed" }),
  S(73, "", "cl", "c_check", { p: CLP(`At night he kneels at a white-painted back kitchen door, pointing a flashlight at a white chalk line on the threshold and cloves and bay leaves on the frame.`) }),
  S(73, "La raya de tiza entera", "bi", "b_lineok", { p: BI(`Night, flashlight on ${CHALK} along a wooden threshold under a door with a black brush sweep, nothing on the tiles.`) }),
  S(73, "Afuera, en el escalón", "kf", "k_lost", { p: BI("Night, flashlight on a concrete step outside a closed door: a few black ants wandering in different directions, no line."), d1: "a few ants wander on the step", d2: "the ants turn around and walk away in different directions", sound: "night crickets outside" }),
  S(74, "", "bi", "b_luciasmile", { q: "woman smiling kitchen", p: BI(`${LUCIA} smiling with relief in her kitchen in the evening, next to the back door.`) }),
  S(74, "el plato de Bruno está limpio", "bi", "b_bowlclean", { q: "dog bowl floor", p: BI(`${DOG} eating from his clean steel bowl on a white tiled kitchen floor, no ants around.`) }),
  S(74, "Y Mateo, el de seis", "bi", "b_mateo", { p: BI(`Mateo, a 6-year-old Latin American boy with short messy hair, stepping carefully over a white chalk line on a kitchen door threshold, smiling.`) }),
  C(75, "", "ClChapter", { n: 10, title: "La revisión de la noche", sub: "10 minutos · una linterna" }),
  // ── la revisión
  S(76, "", "av", ""),
  S(76, "Apagas la luz de adentro, prendes la de afuera", "bi", "b_porchlight", { q: "porch light night", p: BI("Night, a porch light switched on above a back door seen from the patio.") }),
  S(76, "Donde ves una rayita de luz, hay una entrada", "bi", "b_lightline", { q: "light under door dark", p: BI("Night, a dark hallway seen from inside, a bright thin line of light under a closed door.") }),
  S(77, "", "cl", "c_flashfila", { p: CLP(`At night he crouches with a yellow flashlight in a dark kitchen, following a line of ants along the baseboard with his eyes.`) }),
  S(77, "Si la encuentras, la sigues hacia atrás", "bi", "b_antsback", { q: "ants line baseboard", p: BI("Night, flashlight on a line of small black ants along a white baseboard in a kitchen.") }),
  S(77, "a la altura del zócalo", "bi", "b_baseboard", { q: "baseboard crack", p: BI("Night, flashlight on a thin crack between a white baseboard and the floor tiles, a few ants coming out.") }),
  S(78, "", "bi", "b_walkaround", { p: BI(`Night, a flashlight beam along the base of the outside wall of a modest house, a clean strip of ground.`) }),
  S(78, "leña, macetas, ramas, es un puente", "av", ""),
  // ── CTA 3
  S(79, "", "av", ""),
  C(79, "Apunta el celular a este código", "ClQRCard", { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "la revisión de la noche, gratis", kicker: "REGALO · ANTES DE FUMIGAR" }),
  C(79, "el Manual del Fumigador está en esa misma página", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "todos los arreglos", kicker: "EL MANUAL · US$27" }),
  // ── el gancho: el garaje
  S(80, "", "bi", "b_garagedoor", { q: "garage door night", p: BI("Night, the closed metal door of a small garage at the side of a modest house, a thin gap under it.") }),
  S(80, "pasé por el garaje", "cl", "c_garage", { p: CLP(`At night he stands in ${GARAGE}, a flashlight in his hand, turning to look at the camera.`) }),
  S(80, "Claudio, ya que estás, mira esto", "bi", "b_jorgegarage", { p: BI(`${JORGE} in his dim garage at night pointing at the floor along the wall.`) }),
  S(81, "", "kf", "k_droppings", { p: BI(`Night, flashlight on a cement garage floor against the wall: small black rice-shaped droppings scattered along the wall.`), d1: "the flashlight beam on the bare floor", d2: "the beam slides along the wall and lights a trail of small black droppings", sound: "a flashlight click in a quiet garage" }),
  S(81, "Y la bolsa de croquetas de Bruno, mordida en una esquina", "bi", "b_chewedbag", { p: BI("A big paper bag of dog kibble on a garage floor with a ragged chewed hole in one corner, kibble spilled out, lit by a flashlight.") }),
  S(81, "Eso no es una cucaracha", "av", ""),
  S(81, "Son ratones", "bi", "st_mouse", { q: "mouse garage", p: BI("A small gray house mouse along the wall of a dim garage at night.") }),
  S(81, "sin una gota de veneno", "bi", "b_cotton", { p: BI("A few cotton balls on a small saucer on a garage shelf next to a small dark glass bottle with a plain label.") }),
  C(81, "La semana que viene te muestro cómo los sacamos", "ClVideoRef", { thumb: I + "th_furatas.jpg", title: "Los ratones del garaje", next: true }),
  // ── cierre
  S(82, "", "av", "", { ov: { c: "ClAsk", props: { q: "¿Por dónde te entran a ti?" } } }),
  S(82, "¿Por la puerta, por la ventana, o por el fregadero?", "bi", "b_three", { q: "kitchen sink window", p: BI("A modest kitchen sink under a small window, the back door beside it, daylight.") }),
  S(82, "Escríbemelo en los comentarios", "av", ""),
  S(83, "", "av", ""),
];
