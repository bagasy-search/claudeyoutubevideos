// DIRECTOR A — mecbebe (Claudio el Mecánico #5, "El auto de Doña Elena" ep. 5: el aceite de bebé en el auto, dónde sí y dónde no):
// MINUTO 1 (el frasco rosa junto al faro brillante → "la mitad es verdad" → la nieta con el trapo en todo el auto → el freno: loop → promesa
// 7 sí / 6 no + antes/después de la calcomanía → credibilidad + 3 pruebas → capítulo) + la cochera (polaroid del ep. 4), el reflejo, las gomas
// pegajosas, los pedales · qué es el aceite de bebé · la regla de oro · lo que hay que comprar (mención 1, pág. 13) (párrafos 0-19).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const BABY = "a small pink plastic bottle of baby oil with a blank label";
export const RAG = "a folded light-blue microfiber cloth";
export const GIRL = "Elena's granddaughter, a 16-year-old Latin American girl with long dark hair in a ponytail, wearing a gray hoodie and jeans";
export const GH = "a teenage girl's hands with chipped pink nail polish";
export const GAUGE = "the plain black analog instrument cluster of an ordinary 2012 compact sedan";
export const SIL = "a plain spray can of silicone rubber protectant with a blank label";
const I = "img/mecbebe/";
export const SHOTS = [
  // ── 0:00 · el frasco rosa junto al faro
  S(0, "", "bi", "b_babyfaro0", { p: BI(`Close view of ${BABY} standing on the front bumper of ${CAR} right next to a glossy, freshly wiped headlight shining in the afternoon sun.`), ov: { c: "ClStampOv", props: { text: "¿TODO EL AUTO?" } } }),
  S(0, "y tu auto parece recién salido de la agencia", "av", ""),
  S(0, "Eso dice internet", "bi", "st_phonescroll", { q: "scrolling phone video", p: BI("Close view of a thumb scrolling short videos on a smartphone.") }),
  S(0, "Y la mitad es verdad", "bi", "b_stickeroff0", { p: BI(`Extreme close view of ${H} rolling off a strip of old sticker glue from the paint of a car trunk with a ${RAG}.`) }),
  S(0, "La otra mitad te puede costar un susto en una esquina", "kf", "k_footslip0", { p: BI(`Low view inside an ordinary car, close on the driver's footwell: an elderly woman's foot in a beige flat shoe slipping sideways off a glossy, oil-wet black rubber brake pedal, gray carpet around it, only the foot and the ankle in the frame.`), d1: "the shoe presses down on the shiny pedal", d2: "the shoe slips sideways off the pedal", sound: "a rubber squeak" }),
  // ── la nieta
  S(1, "", "bi", "b_girlphone", { p: BI(`${GIRL} sitting on the low white wall of ${DRIVE} watching a video on her phone, ${CAR} parked behind her.`) }),
  S(1, "quiso darle una sorpresa a su abuela", "bi", "b_girlsmile", { p: BI(`${GIRL} grinning and holding up ${BABY} and a rag next to ${CAR} in ${DRIVE}.`) }),
  S(1, "Una tarde entera con un frasco rosa y un trapo", "kf", "k_girlwipe", { p: BI(`Close view of ${GH} pouring baby oil from ${BABY} onto a rag next to the open door of ${CAR}.`), d1: "the oil drips onto the rag", d2: "the hands start rubbing the rag", sound: "a soft squeeze of a plastic bottle" }),
  S(1, "Los faros, el tablero", "bi", "b_girldash", { p: BI(`Close view of ${GH} wiping the dashboard of ${CABIN} with an oily rag, the plastic left glossy.`) }),
  S(1, "las gomas de las puertas", "bi", "b_girlseal", { p: BI(`Close view of ${GH} rubbing an oily rag along the black rubber door seal of ${CAR}.`) }),
  S(1, "el volante, la palanca", "bi", "b_girlwheel", { p: BI(`Close view of ${GH} wiping the steering wheel of ${CABIN} with a glossy oily rag.`) }),
  S(1, "Y los pedales", "bi", "b_girlpedal", { p: BI(`Low view inside the driver's footwell of ${CABIN}: ${GH} wiping the black rubber brake pedal with an oily cloth.`), rev: 1 }),
  // ── el freno
  S(2, "", "bi", "b_shinycar", { p: BI(`The whole side of ${CAR} in ${DRIVE} at sunset, glossy and shining, the tires and rubber trims wet-looking.`) }),
  S(2, "Y a la mañana siguiente", "bi", "b_morningdrive", { p: BI(`Early morning, ${CAR} in ${DRIVE} with its reverse lights on, starting to back out toward the street.`) }),
  S(2, "y pisó el freno", "bi", "b_footbrake", { p: BI(`Low close view inside ${CABIN} of an old woman's flat shoe pressing a glossy brake pedal.`) }),
  S(2, "pasó algo que la dejó temblando", "bi", "b_elenashock", { p: BI(`${ELENA} at the wheel of ${CAR} with both hands gripping the wheel, eyes wide, frightened.`) }),
  S(2, "Te lo cuento en un rato", "av", ""),
  // ── la promesa
  S(3, "", "c", "ClOilMap13", { props: { all: true } }),
  S(3, "Siete donde sí sirve", "bi", "b_yesrag", { p: BI(`Close view of ${H} folding ${RAG} with a few drops of baby oil on it.`), ov: { c: "ClChip", props: { text: "7 · SÍ" } } }),
  S(3, "Y seis donde no tiene que ir nunca", "bi", "b_nopedal", { p: BI(`Close view inside the driver's footwell of an ordinary car: a black rubber brake pedal glistening wet with oil, the gray carpet around it.`), ov: { c: "ClChip", props: { text: "6 · NO", alert: true } } }),
  S(3, "aunque lo veas en todos lados", "bi", "st_phonevideo2", { q: "watching phone video", p: BI("Hands holding a phone playing a video.") }),
  S(3, "Así estaba la calcomanía pegada en el baúl de Elena", "bi", "b_stickerbefore", { p: BI(`The rear trunk lid of ${CAR}, an old faded round dealership sticker half peeled off with a black ring of dirty glue around it, no letters on it.`), ov: { c: "ClChip", props: { text: "Así estaba", alert: true } } }),
  S(3, "Y así salió", "bi", "b_stickerafter", { p: BI(`The rear trunk lid of ${CAR}, clean and shiny, no sticker and no marks, in a carport in daylight.`), ov: { c: "ClChip", props: { text: "Así salió" } } }),
  // ── credibilidad
  S(4, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "35 años de mecánico" } } }),
  S(4, "Y al final te doy", "bi", "b_cardnight", { p: BI(`Night, a flattened cardboard sheet under the front of ${CAR} on a cement floor, lit by a flashlight.`) }),
  S(4, "de diez minutos", "bi", "b_lightswall", { p: BI(`Evening, the front of ${CAR} with a plain grille without any emblem, facing a white wall with its headlights on.`), ov: { c: "ClChip", props: { text: "$0 · 10 minutos" } } }),
  S(4, "a cualquier taller", "bi", "st_shopstreet", { q: "car repair shop", p: BI("An ordinary small car repair shop seen from the street.") }),
  C(5, "", "ClChapter", { n: 1, title: "Lo que encontré en la cochera", sub: "olía a talco" }),
  // ── polaroid del ep. 4
  C(6, "", "ClVideoRef", { thumb: I + "th_mecvinagre.jpg", title: "El truco de vinagre de 1 dólar", tag: "VIDEO ANTERIOR" }),
  S(6, "el sedán plateado del 2012", "bi", "b_carside", { p: BI(`The whole side of ${CAR} parked in ${DRIVE} in daylight.`) }),
  S(6, "le lavamos el radiador con vinagre", "bi", "b_jarlast", { p: BI("A clean glass jar of tea-colored liquid with white flakes held up against daylight in a carport.") }),
  S(6, "y la aguja de la temperatura volvió al medio", "bi", "b_gaugemid", { p: BI(`Extreme close view of the round temperature gauge of an old car dashboard, marked C and H, the orange needle pointing exactly to the middle.`) }),
  S(6, "Te dejo ese video aquí", "av", ""),
  // ── la cochera
  S(7, "", "bi", "b_shinyfromstreet", { p: BI(`${CAR} parked in ${DRIVE} seen from the sidewalk through the green metal gate, the paint and tires glistening unnaturally.`) }),
  S(7, "olía a talco", "bi", "b_dooropen", { p: BI(`Close view of ${H} opening the driver's door of ${CAR}, the interior plastics glossy and wet-looking.`) }),
  S(7, "El tablero parecía mojado", "bi", "b_wetdash", { p: BI(`Close view of the dashboard of ${CABIN} with an oily wet-looking sheen and fingerprint smears.`) }),
  S(7, "El volante también", "bi", "b_wetwheel", { q: "steering wheel", p: BI(`Extreme close view of the steering wheel of ${CABIN} glistening with oil.`) }),
  S(7, "La nieta estaba orgullosa", "bi", "b_girlproud", { p: BI(`${GIRL} standing next to ${CAR} in ${DRIVE} with her arms crossed, smiling proudly.`) }),
  S(8, "", "cl", "c_sitwheel", { p: CLP(`He sits in the driver's seat of ${CABIN} with the door open, squinting at the windshield.`) }),
  S(8, "el tablero reflejado en el parabrisas", "c", "ClGlare", { props: { mode: "oil" } }),
  S(8, "Con el sol de la tarde, casi no se veía la calle", "bi", "b_glarestreet", { q: "windshield glare", p: BI(`View from the driver's seat of ${CABIN} through the windshield: a bright hazy reflection of the dashboard covering the lower half of the glass, the street barely visible.`) }),
  S(9, "", "bi", "b_sealtouch", { p: BI(`Extreme close view of ${H} pressing a fingertip on a glossy oily black rubber door seal of ${CAR}.`) }),
  S(9, "y pegajosas al tacto", "bi", "b_sealsticky", { q: "car door rubber seal", q2: "car door", p: BI(`Extreme close view of a fingertip pulling away from a sticky oily car door seal, dust stuck to it.`) }),
  S(9, "los pedales relucían como si fueran nuevos", "bi", "b_pedalsshine", { p: BI(`Low close view of the three rubber pedals of ${CABIN} glistening with oil.`) }),
  S(9, "Ahí me empecé a preocupar", "av", ""),
  S(10, "", "av", ""),
  S(10, "Hay videos con millones de vistas", "bi", "st_phonevideo", { q: "watching video smartphone", p: BI("Close view of a phone screen playing a video in someone's hand.") }),
  S(10, "Algunas cosas son verdad", "bi", "b_babyshelf", { q: "baby oil bottle", p: BI(`${BABY} on a bathroom shelf next to a cotton-swab box.`) }),
  S(10, "Hoy te lo digo yo, una por una", "av", ""),
  // ── qué es
  C(11, "", "ClChapter", { n: 2, title: "Qué es el aceite de bebé", sub: "y por qué engaña" }),
  S(12, "", "bi", "b_babypour", { q: "pouring oil cloth", q2: "pouring oil", p: BI(`Extreme close view of clear baby oil pouring from ${BABY} onto ${RAG}.`) }),
  S(12, "disuelve la grasa", "bi", "b_greasehands", { p: BI(`Close view of ${H} black with engine grease rubbing in baby oil.`) }),
  S(12, "deja una capa finita que protege el metal del agua", "bi", "b_waterbead", { p: BI("Extreme close view of a chrome license plate screw lightly oiled, water drops on it."), d1: "a water drop sits on the oiled chrome", d2: "the drop rolls off leaving the metal dry", sound: "a tiny water drip" }),
  S(13, "", "av", ""),
  S(13, "Sigue ahí, resbalosa, juntando polvo", "bi", "b_dustydash", { q: "dusty car dashboard", p: BI(`Extreme close view of a glossy oily car dashboard with a layer of dust stuck to it, a fingertip drawing a line through it.`) }),
  S(13, "las ablanda y las hincha", "c", "ClSealSwell", { props: { mode: "oil" } }),
  S(14, "", "bi", "st_phonefilm", { q: "filming car phone", p: BI("Someone filming a shiny car with a smartphone.") }),
  S(14, "El daño se ve al año", "bi", "b_sealold", { p: BI("Extreme close view of an old swollen deformed car door rubber seal, soft and cracked, a gap between it and the door.") }),
  S(14, "Y nadie vuelve a filmar el auto un año después", "av", ""),
  S(15, "", "av", ""),
  S(15, "Unas gotas en el paño, nunca directo sobre la pieza", "bi", "b_drops", { p: BI(`Extreme close view of ${BABY} tipped over ${RAG} held in ${H}.`), d1: "two drops of oil fall onto the cloth", d2: "the hand closes the bottle", sound: "two soft drips" }),
  S(15, "Un frasco chico te dura años", "bi", "b_babysmall", { p: BI(`${BABY} standing on the workbench of ${SHOP} next to a wrench.`) }),
  S(16, "", "av", ""),
  S(16, "Es seguro, es barato", "bi", "st_babyoil", { q: "baby oil bottle", p: BI("A bottle of baby oil on a shelf.") }),
  S(16, "El problema nunca es el frasco", "bi", "b_babyhand", { p: BI(`Close view of ${EH} holding ${BABY}.`) }),
  S(16, "Es dónde lo pones", "av", ""),
  // ── lo que hay que comprar
  C(17, "", "ClChapter", { n: 3, title: "Lo que tienes que comprar", sub: "en la farmacia o la refaccionaria" }),
  S(18, "", "bi", "st_pharmacy", { q: "pharmacy shelf", p: BI("An ordinary pharmacy shelf.") }),
  S(18, "un frasco de aceite mineral o de bebé", "c", "ClReceipt", { props: { head: "LO QUE PIDES", lines: [["Aceite mineral o de bebé", "1 frasco chico"], ["Paños de microfibra", "2 o 3"], ["Protector de silicona", "para las gomas"]], total: ["Para las gomas", "silicona, no aceite"] } }),
  S(18, "un protector de silicona para hules", "bi", "b_silicone", { q: "spray can shop", p: BI(`${SIL} on the counter of a small auto parts store next to ${RAG}.`) }),
  S(18, "En el Manual del Mecánico te dejé esa frase exacta", "c", "ClBookPage", { props: { page: I + "page13.jpg", pageNo: 13, stamp: "La frase, en la página" } }),
  S(19, "", "av", ""),
  S(19, "Y unos dos o tres paños de microfibra", "bi", "st_microfiber", { q: "microfiber cloth", p: BI("A stack of microfiber cloths.") }),
  S(19, "Todo junto, menos que un lavado en la agencia", "bi", "st_carwash", { q: "car wash", p: BI("A car being washed at a car wash.") }),
];
