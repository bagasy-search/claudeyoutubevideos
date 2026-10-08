// DIRECTOR B — jpviejo: reglas 4 (la almohada; se paga el loop "la funda está limpia, la almohada no"), 5 (los cuellos), 6 (la cabeza +
// mención 2 "la rutina completa, pág. 10") y 7 (la que casi todos rompemos: el perfume encima). Párrafos 22-45.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH } from "../claudio/lib.mjs";
import { H, SATOP } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jpviejo/";
export const SHOTS = [
  // ══ REGLA 4 · la almohada
  C(22, "", "ClRule", { n: 4, title: "La almohada", sub: "la funda limpia no alcanza" }),
  S(22, "Me dio la almohada lavada", "bi", "b_satohands", { p: BI(`${SATO} handing a white pillow without its case to a man in a red polo shirt in a hotel room, close view of the pillow between them.`) }),
  C(22, "la funda está limpia", "ClSato", { img: SATOP, quote: "La funda está limpia. La almohada, no." }),
  S(22, "Este señor duerme aquí todas las noches", "bi", "b_emptybed", { p: BI(`An empty, perfectly made bed in a room of ${HOTEL}, morning light, a single pillow slightly yellowed at the edge.`) }),
  S(23, "", "av", ""),
  S(23, "Tu nuca pasa ocho horas por noche", "bi", "b_sleeping", { q: "man sleeping bed", p: BI("A Latin American man in his fifties asleep on his side in a dim bedroom, the back of his neck resting on the pillow, early morning light.") }),
  S(23, "La funda se carga", "kf", "k_pillowcase", { p: BI("Close view of the lower edge of a used pillowcase on a bed, slightly creased and dull where the neck rests."), d1: "the pillowcase lies still", d2: "a hand smooths the pillowcase", sound: "cotton fabric being smoothed" }),
  C(24, "", "ClNumbers", { title: "La almohada en números", rows: [["La funda", "cada 3 días, no una vez por semana"], ["Fundas", "una puesta y otra lavándose"], ["La almohada", "al sol una vez por mes"]], page: 10 }),
  S(24, "Y la almohada, al sol una vez por mes", "bi", "b_pillowsun", { q: "pillow drying sun balcony", p: BI("Two white pillows airing over a balcony railing in bright sun, blue sky, a Latin American neighborhood below.") }),
  S(25, "", "bi", "b_washpillow", { q: "washing machine pillow", p: BI("A whole white pillow being pushed into the drum of a front-loading washing machine in a small laundry corner.") }),
  S(25, "Después de unos años se carga de grasa por dentro", "bi", "b_pillowinside", { p: BI("An old pillow cut open showing yellowed, clumped filling inside, on a table.") }),
  S(26, "", "cl", "c_pillowcheck", { p: CLP(`He pulls the case off a pillow on a bed in ${HOUSE} and looks at the pillow closely, eyebrows raised.`) }),
  S(26, "Si tiene manchas amarillas abajo", "bi", "b_yellowpillow", { p: BI("Close view of a bare white pillow with yellowish stains along its lower edge, on a bed.") }),

  // ══ REGLA 5 · los cuellos
  C(27, "", "ClRule", { n: 5, title: "Los cuellos", sub: "todo lo que toca tu nuca" }),
  S(27, "cuando un huésped dejaba un abrigo para la tintorería", "bi", "b_coatcheck", { p: BI(`A dark wool coat on a hanger with a dry-cleaning paper tag on its button, at the front desk of ${HOTEL}.`) }),
  S(27, "Sato-san lo revisaba primero por adentro del cuello", "bi", "b_satocollar", { p: BI(`${SATO} turning down the collar of a dark wool coat and looking at its inside lining closely.`) }),
  S(28, "", "bi", "b_shirtcollar", { q: "dirty shirt collar", p: BI("Close view of the inside of a white shirt collar with a faint grayish-yellow line along the fold.") }),
  S(28, "el apoyacabezas del auto", "bi", "b_headrest", { q: "car headrest", p: BI("The driver's seat headrest of an ordinary car, the fabric slightly darker in the middle where the head rests.") }),
  S(28, "el respaldo del sillón donde ves la televisión", "bi", "b_sofaback", { q: "sofa living room tv", p: BI(`The back of a fabric sofa facing a television in ${HOUSE}, a slightly darker patch on the top of the backrest.`) }),
  S(29, "", "bi", "b_wintercoat", { q: "winter jacket hanging", p: BI("A worn winter jacket hanging on a hook by a front door, its collar shiny and dark from use.") }),
  S(29, "durante años", "av", ""),
  S(30, "", "cl", "c_sofa", { p: CLP(`He leans over the back of a fabric sofa in ${HOUSE} and points at a darker patch on the backrest, raising his eyebrows at the camera.`) }),
  S(31, "", "kf", "k_wipeheadrest", { p: BI(`Close view of ${H} wiping a car seat headrest with a damp white cloth.`), d1: "the cloth touches the headrest", d2: "the cloth wipes across the headrest", sound: "a cloth rubbing fabric inside a car" }),
  S(31, "Y el cuello de las camisas", "kf", "k_collarsoap", { p: BI("Close view of hands rubbing a bar of soap on the inside of a white shirt collar over a laundry sink."), d1: "the soap touches the collar", d2: "the soap rubs along the collar", sound: "soap rubbing fabric" }),
  S(32, "", "bi", "b_carwindow", { q: "car window open", p: BI("A passenger in an ordinary car rolling down the window halfway, seen from the back seat, a city street outside.") }),

  // ══ REGLA 6 · la cabeza (mención 2)
  C(33, "", "ClRule", { n: 6, title: "La cabeza", sub: "el cuero cabelludo, no el pelo" }),
  S(33, "Sato-san les enseñaba a lavarse el pelo", "bi", "b_satoteach", { p: BI(`${SATO} showing two younger ${"Japanese hotel housekeeping staff in dark navy uniforms"} a massaging gesture with her fingertips in the air, in a staff room.`) }),
  S(33, "con las yemas, nunca con las uñas", "bi", "b_fingertips", { p: BI("Close view of fingertips with short nails pressing gently into a scalp through wet dark hair, foam around them.") }),
  S(34, "", "av", ""),
  S(34, "cuando te saluda con un beso", "bi", "b_kisshello", { q: "greeting kiss cheek", p: BI(`Two Latin American friends in their fifties greeting each other with a kiss on the cheek at a front door, one face close to the other's hair.`) }),
  S(34, "veinte segundos, y enjuagamos", "bi", "b_quickrinse", { p: BI("Shampoo foam swirling into a shower drain under running water, a shampoo bottle with a blank label on the corner shelf, white tiles.") }),
  C(35, "", "ClDryBars", { title: "El cuero cabelludo", rows: [{ label: "Lo que hacemos", h: 20 }, { label: "En Japón", h: 60, good: true }], unit: "s", max: 60 }),
  S(35, "Y el pelo se seca antes de acostarse", "bi", "b_hairdryer", { q: "drying hair towel", p: BI(`A man drying his curly hair with a towel and a hair dryer in ${BATH} at night.`) }),
  S(36, "", "kf", "k_massage", { p: BI("A man seen from behind with his head tipped forward under a shower, massaging his scalp with his fingertips, foam in his hair."), d1: "fingertips on the scalp", d2: "the fingertips move in slow circles", sound: "shower water and hair being washed" }),
  S(36, "Cuéntalo una vez", "cl", "c_count", { p: CLP(`He holds up a finger counting while looking at a wall clock in ${HOUSE}, playful face.`) }),
  S(37, "", "bi", "b_dryshampoo", { q: "dry shampoo spray", p: BI("A can of dry shampoo with a plain blank label on a bathroom shelf, white powder dust around it.") , ov: { c: "ClStampOv", props: { text: "TAPA", alert: true } } }),
  // mención 2
  S(38, "", "av", ""),
  C(38, "está en la página diez", "ClBookPage", { page: I + "x_page10.jpg", pageNo: 10, stamp: "La rutina completa" }),
  S(38, "para que la pegues en el baño", "bi", "b_paperbath", { p: BI(`A printed page stuck with tape on the inside of a bathroom cabinet door in ${BATH}, a toothbrush cup below.`) }),

  // ══ REGLA 7 · la que casi todos rompemos: el perfume encima
  C(39, "", "ClRule", { n: 7, title: "Nada de perfume encima", sub: "si tapas un olor, tienes dos", star: true }),
  S(40, "", "bi", "b_staffdoor", { p: BI(`The staff entrance of ${HOTEL} early in the morning, a time clock on the wall, a man in a red polo shirt arriving.`) }),
  S(40, "la de mi padre", "bi", "b_fathercologne", { p: BI("An old bottle of men's cologne with a faded blank label on a wooden dresser, next to a framed old family photo.") }),
  C(40, "si tapas un olor, ahora tienes dos", "ClSato", { img: SATOP, quote: "Si tapas un olor, ahora tienes dos." }),
  S(41, "", "bi", "b_woodycologne", { p: BI("A heavy dark glass men's cologne bottle with a plain blank label on a wooden dresser next to a wristwatch and a comb, in a bedroom.") }),
  S(41, "El que se acerca no huele tu perfume", "bi", "b_lean", { q: "people talking close", p: BI("Two coworkers in their fifties talking close in an office corridor, one leaning slightly back with a polite smile.") }),
  S(41, "Y eso es lo que recuerda de ti", "av", ""),
  S(42, "", "bi", "b_grandpa", { p: BI("An old framed photograph of a Latin American grandfather in a suit and hat, on a living room shelf next to a cologne bottle with a blank label.") }),
  S(43, "", "bi", "b_jpoffice", { q: "japanese office workers", p: BI("A quiet Japanese office with people working at desks in white shirts, neat and calm, daylight from tall windows.") }),
  S(44, "", "av", ""),
  C(44, "que sea poco y cítrico", "ClDoDont", { yes: { label: "Poco y cítrico", img: I + "b_citrus.jpg" }, no: { label: "Amaderado encima", img: I + "b_woodycologne.jpg" } }),
  S(45, "", "bi", "b_perfumeroom", { p: BI(`A room of ${HOTEL} with the window wide open and a housekeeper in a navy uniform shaking out a curtain, an air of a heavy perfume being aired out.`) }),
  S(45, "Y debajo, a nuca", "cl", "c_nape", { p: CLP(`He points to the back of his own neck in ${HOUSE} with a knowing half smile at the camera.`) }),
];
