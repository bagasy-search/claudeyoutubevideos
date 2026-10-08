// DIRECTOR A — fuagua (Claudio el Fumigador #1, "La casa de los Ramírez" ep. 1): MINUTO 1 (la linterna detrás del refrigerador y las
// cucarachas que se desparraman en el seg 0 + "por cada una que ves, cincuenta que no" → los Ramírez y las 2 fumigaciones → loop de lo
// que había detrás del refrigerador → promesa (el frasco de $1, con la medida, y lo que NO hace) + vistazo → credibilidad + revisión de
// la linterna → capítulo) + la casa + qué hace el frasco (mención 1, pág. 9) + la noche con la linterna (párrafos 0-28).
import { S, BI, CLP, BOTTLE, LUCIA, JORGE, KIDS, DOG, HOUSE } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const H = "a pest-control technician's weathered tanned hands, the short sleeve of a light khaki work shirt at the edge of the frame";
export const HG = "a pest-control technician's hands in thin blue nitrile gloves, the short sleeve of a light khaki work shirt at the edge of the frame";
export const KITCHEN = HOUSE;
export const BEHIND = "the dusty gap behind an older white refrigerator pulled away from a white tiled kitchen wall, its black condenser coil and compressor visible, a plastic defrost drip tray on the floor";
export const SPRAYER = "a plain white plastic spray bottle with a trigger, filled with clear liquid, with no label";
export const MOCHILA = "a pest-control man in gray overalls and a respirator mask carrying a backpack sprayer";
export const ROACHES = "small light-brown German cockroaches";
const I = "img/fuagua/";
export const SHOTS = [
  // ── 0:00 · la linterna detrás del refrigerador
  S(0, "", "kf", "k_flash", { p: BI(`Night, dark kitchen: the beam of a flashlight hits ${BEHIND}, dozens of ${ROACHES} on the wall and the coil.`), d1: "the flashlight beam lands on the wall behind the refrigerator full of cockroaches", d2: "the cockroaches scatter fast in every direction into the cracks", sound: "a flashlight click and tiny skittering legs" , ov: { c: "ClStampOv", props: { text: "1 QUE VES · 50 QUE NO" } } }),
  S(0, "mata la que ves", "bi", "b_aerosol", { q: "insect spray can", p: BI(`Close view of a hand pressing an aerosol insecticide can with a plain blank label at one cockroach on a kitchen wall, a mist hitting it.`) }),
  S(0, "Por cada cucaracha que ves", "bi", "st_roach1", { q: "cockroach kitchen night", p: BI(`One ${ROACHES.replace("cockroaches", "cockroach")} on a speckled gray granite kitchen counter at night, lit by a flashlight.`) }),
  S(0, "hay cincuenta que no", "bi", "b_crack", { q: "cockroaches crack", p: BI(`Extreme close view of a crack between a kitchen cabinet and a tiled wall packed with ${ROACHES}, lit by a flashlight.`) }),
  // ── los Ramírez + 2 fumigaciones
  S(1, "", "av", ""),
  S(1, "de los Ramírez", "bi", "b_fridgeside", { p: BI(`${KITCHEN}: the side of the older white refrigerator and the narrow dark gap between it and the tiled wall.`) }),
  S(1, "Una familia con dos niños y un perro", "bi", "b_family", { q: "family kitchen children", p: BI(`${LUCIA} and ${JORGE} in their kitchen with ${KIDS} sitting at a table and ${DOG} lying on the floor, an ordinary afternoon.`) }),
  S(1, "y un perro", "bi", "b_bruno0", { q: "dog lying floor", p: BI(`${DOG} lying on the tiled kitchen floor, lifting his head.`) }),
  S(1, "que ya pagó dos fumigaciones", "bi", "st_fumig", { q: "pest control spraying", p: BI(`${MOCHILA} spraying along the baseboard of a family kitchen.`) }),
  S(1, "Las dos veces, a las tres semanas", "bi", "b_calendar", { q: "wall calendar", p: BI("A paper wall calendar in a kitchen with two dates circled in red pen three weeks apart, a fridge magnet holding a pest-control receipt beside it.") }),
  S(1, "las cucarachas volvieron", "bi", "st_roach2", { q: "cockroach sink", p: BI(`Two ${ROACHES} on the edge of a stainless kitchen sink at night.`) }),
  // ── el loop
  S(2, "", "bi", "b_fridgegap", { p: BI(`${KITCHEN}: the older white refrigerator pulled a little away from the wall, a dark gap behind it, at night.`) }),
  S(2, "explica las dos fumigaciones perdidas", "cl", "c_behind", { p: CLP(`At night he crouches beside an older white refrigerator pulled away from the wall, pointing a flashlight into the dark gap behind it and looking at the camera with raised eyebrows.`) }),
  S(2, "Te lo muestro en un rato", "av", ""),
  // ── la promesa
  S(3, "", "av", ""),
  S(3, "este frasco de un dólar", "bi", "b_bottle", { q: "brown bottle counter", p: BI(`${BOTTLE} standing on a speckled gray granite kitchen counter next to a few coins.`) }),
  C(3, "el agua oxigenada de la farmacia", "ClBottle3D", { title: "Agua oxigenada 3 %", sub: "10 volúmenes · de la farmacia", tag: "US$1" }),
  S(3, "contra cucarachas", "bi", "st_roach0", { q: "cockroach", p: BI(`A ${ROACHES.replace("cockroaches", "cockroach")} on a white tile.`) }),
  S(3, "hormigas", "bi", "st_ants0", { q: "ants line", p: BI("A line of small black ants on a white kitchen counter.") }),
  S(3, "y ratones", "bi", "st_mouse0", { q: "house mouse", p: BI("A small gray house mouse at the base of a kitchen cabinet.") }),
  S(3, "Con la medida exacta", "bi", "b_pour", { q: "pouring liquid spray bottle", p: BI(`Close view of ${H} pouring a brown plastic bottle of hydrogen peroxide into ${SPRAYER} on a kitchen counter.`) }),
  S(3, "dónde se rocía y dónde no", "cl", "c_spray1", { p: CLP(`He sprays ${SPRAYER.replace("filled with clear liquid, ", "")} along the edge of a speckled gray granite kitchen counter, looking at the spot.`) }),
  S(3, "y dónde no", "bi", "b_baitcap0", { p: BI("A small closed plastic bait cap with a tiny hole on a tiled floor against the wall behind a refrigerator.") }),
  S(3, "Y lo que no hace", "av", ""),
  S(3, "porque a los ratones no los mata", "bi", "st_mouse1", { q: "mouse kitchen", p: BI("A small gray house mouse sniffing along the bottom of a kitchen wall next to a cabinet.") , ov: { c: "ClChip", props: { text: "No los mata", alert: true } } }),

  S(3, "Así estaba esa cocina de noche", "bi", "b_nightbefore", { p: BI(`Night, ${KITCHEN} lit by a flashlight beam, several ${ROACHES} on the counter and the stove.`), ov: { c: "ClChip", props: { text: "Antes", alert: true } } }),
  S(3, "Y así quedó a las dos semanas", "bi", "b_nightafter", { p: BI(`Night, ${KITCHEN} lit by a flashlight beam, the counter, stove and sink clean and empty, nothing moving.`), ov: { c: "ClChip", props: { text: "2 semanas después" } } }),
  // ── credibilidad + linterna
  S(4, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de fumigador" } } }),
  S(4, "Treinta años de fumigador", "bi", "b_truck", { q: "pest control truck", p: BI("An old white pickup truck with a pest-control sprayer tank and hoses in its bed, parked on a quiet residential street.") }),
  S(4, "en casas, hoteles y restaurantes", "bi", "st_restkitchen", { q: "restaurant kitchen night", p: BI("An empty stainless restaurant kitchen at night with the lights half on, mop bucket in a corner.") }),
  S(4, "Y al final te doy", "av", ""),
  S(4, "la revisión de diez minutos", "bi", "b_flashlight", { q: "turning on flashlight", p: BI(`Close view of ${H} holding a yellow flashlight, switching it on in a dark kitchen doorway.`), ov: { c: "ClChip", props: { text: "$0 · 10 minutos" } } }),
  S(4, "que hago con una linterna", "bi", "b_beam", { q: "flashlight beam dark room", p: BI("Night, a yellow flashlight beam crossing a dark kitchen floor toward the bottom of the cabinets.") }),
  S(4, "antes de tocar cualquier casa", "cl", "c_door", { p: CLP(`He stands at the front door of a modest family house at dusk holding a flashlight, a work bag on his shoulder.`) }),
  C(5, "", "ClChapter", { n: 1, title: "La casa de los Ramírez", sub: "dos fumigaciones perdidas" }),
  // ── la casa
  S(6, "", "bi", "b_phone", { q: "woman phone worried kitchen", p: BI(`${LUCIA} on the phone in her kitchen, a hand on her forehead, looking worried.`) }),
  S(6, "Anoche encontré una cucaracha", "bi", "b_lunchbox", { p: BI(`An open child's plastic lunchbox on a kitchen counter with a sandwich inside and a small ${ROACHES.replace("cockroaches", "cockroach")} on its edge.`) }),
  S(7, "", "bi", "b_house", { q: "small house front yard", p: BI("The front of a modest one-story Latin American family house with a small front garden, a side garage door and a bicycle leaning on the wall.") }),
  S(7, "Viven Lucía, Jorge, el papá", "bi", "b_parents", { q: "couple kitchen", p: BI(`${LUCIA} and ${JORGE} standing in their kitchen, arms crossed, tired.`) }),
  S(7, "Sofía, de nueve años, Mateo, de seis", "bi", "b_kids", { q: "children homework table", p: BI(`${KIDS} doing homework at a kitchen table with crayons and notebooks.`) }),
  S(7, "y Bruno", "bi", "b_bruno", { q: "dog lying kitchen floor", p: BI(`${DOG} lying on the tiled kitchen floor next to his steel food bowl.`) }),
  S(8, "", "bi", "b_mochila", { p: BI(`${MOCHILA} spraying under a kitchen sink cabinet while a family waits outside the open door.`) }),
  S(8, "la familia se tuvo que ir a dormir", "bi", "b_grandma", { q: "family leaving house night", p: BI(`${KIDS} with backpacks walking toward a car at night with their mother, a small suitcase.`) }),
  S(8, "Bruno se quedó en el patio", "bi", "b_brunopatio", { p: BI(`${DOG} sitting alone in a small back patio at night next to the closed kitchen door, looking at it.`) }),
  S(8, "la casa olió a veneno tres días", "bi", "b_windows", { q: "open window kitchen", p: BI(`${KITCHEN} with all the windows wide open and a towel over the doorway, empty.`) }),
  S(8, "volvieron", "bi", "st_roach3", { q: "cockroach cabinet", p: BI(`A ${ROACHES.replace("cockroaches", "cockroach")} walking inside an open kitchen cabinet next to cereal boxes.`) }),
  S(9, "", "bi", "b_video", { q: "woman watching phone kitchen", p: BI(`${LUCIA} watching a video on her phone in the kitchen, three brown plastic bottles of hydrogen peroxide with plain labels on the counter in front of her.`) }),
  S(9, "roció la cocina entera", "bi", "b_luciaspray", { q: "woman spraying kitchen counter", p: BI(`${LUCIA} spraying ${SPRAYER} everywhere over the kitchen counter and stove.`) }),
  S(9, "Pero al otro día hay más", "av", ""),
  S(10, "", "cl", "c_lucia", { p: CLP(`He talks with ${LUCIA} in her kitchen, holding a spray bottle and explaining with his other hand.`) }),
  S(10, "Y te falta lo que sí sirve", "av", ""),
  C(11, "", "ClChapter", { n: 2, title: "Qué hace el frasco", sub: "y qué no hace" }),
  // ── el frasco
  S(12, "", "bi", "st_bottle", { q: "hydrogen peroxide bottle", p: BI(`${BOTTLE} on a pharmacy shelf.`) }),
  S(12, "En el envase dice diez volúmenes", "bi", "b_label", { q: "brown bottle label", p: BI(`Extreme close view of ${H} turning a brown plastic bottle of hydrogen peroxide to read its plain white label.`) , ov: { c: "ClChip", props: { text: "3 % = 10 volúmenes" } } }),
  S(12, "Viene en frasco marrón porque la luz la rompe", "bi", "b_sunbottle", { q: "bottle sunlight window", p: BI("A clear plastic spray bottle of clear liquid standing in strong sunlight on a kitchen windowsill next to a brown bottle in the shade.") }),
  S(13, "", "av", ""),
  S(13, "mata por contacto", "kf", "k_contact", { p: BI(`Close view of a line of small black ants on a white tiled kitchen counter, the nozzle of a spray bottle at the edge of the frame.`), d1: "the ants walk in a line", d2: "a mist of spray soaks the ants and they stop moving", sound: "trigger spray squirts" }),
  C(13, "Si queda bien mojado", "ClPeroxide", { mode: "contact" }),
  C(14, "", "ClTrailMap", { mode: "trail" }),
  S(14, "Es su mapa", "bi", "st_antline", { q: "ants trail", p: BI("A long line of small black ants walking along the edge of a kitchen counter and down a cabinet.") }),
  S(14, "El agua oxigenada se lo borra", "cl", "c_erase", { p: CLP(`He sprays a thin mist along the white tiled baseboard of a kitchen, bending down.`) }),
  S(15, "", "bi", "b_grease", { q: "cleaning stove", p: BI(`Close view of ${HG} spraying and wiping greasy crumbs off the top of a kitchen stove with a cloth.`) }),
  S(15, "Le quita la comida al bicho", "bi", "st_crumbs", { q: "crumbs kitchen floor", p: BI("Bread crumbs and a few spilled cereal flakes on a tiled kitchen floor next to a cabinet.") }),
  S(16, "", "av", ""),
  C(16, "Cuando se seca", "ClPeroxide", { mode: "gone" }),
  S(16, "al rato camina por el mismo lugar", "bi", "st_roach4", { q: "cockroach floor", p: BI(`A ${ROACHES.replace("cockroaches", "cockroach")} walking calmly across a dry tiled kitchen floor.`) }),
  S(17, "", "bi", "st_mouse2", { q: "mouse wall", p: BI("A house mouse running along a baseboard in a dim kitchen.") }),
  S(17, "y te la explico más adelante", "av", ""),
  // ── mención 1 (pág. 9): la frase del mostrador
  S(18, "", "bi", "st_pharmacy", { q: "pharmacy counter", p: BI("An ordinary neighborhood pharmacy counter with shelves of bottles behind it.") }),
  S(18, "dos frascos, y una botella con atomizador vacía", "bi", "b_buy", { q: "pharmacy checkout", p: BI(`Two brown plastic bottles of hydrogen peroxide and an empty ${SPRAYER.replace("filled with clear liquid, ", "")} on a shop counter next to a paper bag.`) }),
  S(18, "En el Manual te dejé la frase exacta", "av", "", { ov: { c: "ClChip", props: { text: "Manual · pág. 9" } } }),
  C(18, "tal cual, para que no te vendan otra cosa", "ClNotebook", { title: "En la farmacia", rows: [{ k: "Agua oxig.", v: "10 vol. ×2" }, { k: "Atomizador", v: "vacío" }, { k: "Bicarbonato", v: "1 caja" }], note: "La frase exacta · pág. 9" }),
  S(18, "Cuesta alrededor de un dólar el frasco", "bi", "b_coins", { q: "coins counter", p: BI(`A few coins and a small pharmacy receipt next to ${BOTTLE} on a kitchen counter.`) }),
  S(19, "", "bi", "b_luciaspray2", { p: BI(`${LUCIA} spraying a single cockroach on the kitchen wall with a spray bottle, frowning.`) }),
  S(19, "Y lo que veía era lo de menos", "av", ""),
  C(20, "", "ClChapter", { n: 3, title: "La noche de la linterna", sub: "lo que había detrás" }),
  // ── la noche
  S(21, "", "bi", "b_dark", { q: "dark kitchen night", p: BI(`Night, ${KITCHEN} completely dark, only a faint light from the window.`) }),
  S(21, "prendí la linterna de golpe", "kf", "k_flash2", { p: BI(`Night, a dark kitchen counter of speckled gray granite with ${ROACHES} on it, lit suddenly by a flashlight beam.`), d1: "the flashlight beam hits the counter", d2: "the cockroaches run fast toward the refrigerator", sound: "a flashlight click and tiny skittering legs" }),
  S(21, "corriendo por la encimera", "bi", "st_roach5", { q: "cockroaches running", p: BI(`${ROACHES} running across a kitchen counter at night.`) }),
  S(21, "debajo del refrigerador", "bi", "b_under", { q: "under refrigerator floor", p: BI(`Night, flashlight on the dark gap under an older white refrigerator, the tail of a cockroach disappearing under it.`) }),
  S(22, "", "bi", "st_german", { q: "german cockroach", p: BI(`Extreme close view of a small light-brown German cockroach with two dark stripes behind its head on a white tile.`) }),
  S(22, "No vienen de la calle", "av", ""),
  S(22, "Una sola hembra deja una cápsula", "bi", "b_ootheca", { q: "cockroach egg case", p: BI("Extreme close view of a small brown capsule-shaped cockroach egg case on a white tile next to a fingertip for scale.") }),
  S(23, "", "cl", "c_pull", { p: CLP(`He and ${JORGE} pull an older white refrigerator away from the kitchen wall together, at night.`) }),
  S(23, "Y Lucía alumbró con la linterna", "bi", "b_luciaflash", { q: "woman flashlight dark", p: BI(`${LUCIA} pointing a yellow flashlight into the gap behind a refrigerator at night, her face lit from below.`) }),
  C(24, "", "ClFridgeBack", { mode: "find" }),
  S(24, "estaba llena", "bi", "b_tray", { q: "refrigerator drip pan", p: BI("Close view of a dirty plastic refrigerator defrost drip tray on the floor full of stagnant water with a dead cockroach floating in it.") }),
  S(25, "", "bi", "b_kibble", { q: "dog food kibble", p: BI(`Close view of dozens of dusty dog kibbles on the floor behind a refrigerator, lit by a flashlight.`) }),
  S(25, "cada vez que Bruno comía", "kf", "k_bowl", { p: BI(`${DOG} eating from a steel bowl on a tiled kitchen floor next to a refrigerator.`), d1: "the dog eats from the bowl", d2: "a few kibbles roll off the floor and under the refrigerator", sound: "a dog crunching kibble and a steel bowl" }),
  S(26, "", "bi", "b_motor", { q: "refrigerator compressor", p: BI(`Close view of the black compressor and coil at the back bottom of a refrigerator, dusty, a few ${ROACHES} in the slots, lit by a flashlight.`) }),
  S(26, "El escondite perfecto", "av", ""),
  S(27, "", "bi", "b_eggs", { p: BI("Close view of the floor corner behind a refrigerator with dozens of empty brown cockroach egg cases and dust, lit by a flashlight.") }),
  S(27, "la pared llena de puntitos negros", "bi", "b_specks", { p: BI("Extreme close view of a white tiled wall near the floor covered in tiny black pepper-like specks along a line, lit by a flashlight.") }),
  S(27, "Es el mapa del que te hablé", "av", ""),
  C(28, "", "ClCheck", { title: "Detrás del refrigerador", items: ["Agua: la bandeja", "Comida: las croquetas", "Escondite: el motor"], fast: true }),
  S(28, "detrás de un aparato que nadie había movido", "bi", "b_dust", { q: "dust on floor", p: BI("The outline of thick dust on a tiled kitchen floor where a refrigerator stood for years, the refrigerator pulled aside.") }),
];
