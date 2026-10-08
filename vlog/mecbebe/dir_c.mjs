// DIRECTOR C — mecbebe: los 6 lugares donde nunca va (pedales, volante y palanca + alfombrilla, tablero, gomas de puertas → silicona,
// parabrisas y escobillas, frenos y llantas) · cómo sacamos el aceite (agua tibia + jabón para platos, el orden, las gomas con silicona, el
// parabrisas con papel de diario, "la mitad del video no sabía de autos") · los 4 errores (párrafos 38-58).
import { S, BI, CLP, ELENA, CAR, CABIN, SHOP, DRIVE, H, EH } from "../claudio/lib.mjs";
import { BABY, RAG, GIRL, GH, GAUGE, SIL } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const SHOTS = [
  C(38, "", "ClChapter", { n: 6, title: "Los 6 lugares donde nunca va", sub: "la lista más importante", alert: true }),
  // ── 8 pedales
  S(39, "", "c", "ClOilMap13", { props: { upto: 13, n: 8 } }),
  S(39, "Ni aceite, ni silicona, ni nada que brille", "bi", "b_pedalsoily", { q: "car pedals", p: BI(`Low close view of the oily glistening pedals of ${CABIN}.`), ov: { c: "ClChip", props: { text: "8 · NO", alert: true } } }),
  S(39, "Los pedales tienen que agarrar", "c", "ClGrip", { props: { mode: "dry" } }),
  S(39, "Se limpian con agua y jabón, y se secan bien", "bi", "b_pedalwash", { q: "car floor cleaning", p: BI(`Low close view of ${H} scrubbing a rubber brake pedal of ${CABIN} with a soapy cloth.`) }),
  // ── 9 volante
  S(40, "", "c", "ClOilMap13", { props: { upto: 13, n: 9 } }),
  S(40, "Un volante aceitado resbala en las manos", "bi", "b_wheelslip", { p: BI(`Close view of ${EH} on a glossy oily steering wheel of ${CABIN}, the fingers sliding.`) }),
  S(40, "justo cuando necesitas girar rápido", "bi", "st_steering", { q: "hands turning steering wheel", p: BI("Hands turning a steering wheel while driving.") }),
  S(40, "se le escapaba entre los dedos", "kf", "k_wheelslip", { p: BI(`Close view of ${EH} turning the oily steering wheel of ${CABIN} to park.`), d1: "the hands turn the wheel", d2: "the wheel slides through the fingers", sound: "a soft squeak of skin on plastic" }),
  S(41, "", "bi", "b_mat", { p: BI(`Low close view of the rubber floor mat on the driver's side of ${CABIN}, glossy with shine spray, slid forward under the pedals.`) }),
  S(41, "Una alfombrilla que resbala se corre debajo de los pedales", "bi", "b_matunder", { q: "car floor mat", p: BI(`Extreme close view of the edge of a rubber floor mat bunched up under the brake pedal of ${CABIN}.`), ov: { c: "ClChip", props: { text: "Pedal trabado", alert: true } } }),
  S(41, "y un pedal trabado es igual de peligroso", "av", ""),
  // ── 10 tablero
  S(42, "", "c", "ClOilMap13", { props: { upto: 13, n: 10 } }),
  S(42, "el aceite junta polvo y deja el plástico pegajoso", "bi", "b_dashdust", { q: "cleaning car dashboard", p: BI(`Extreme close view of dust and lint stuck to a glossy oily dashboard of ${CABIN}.`) }),
  S(42, "El tablero se limpia con un paño apenas húmedo", "bi", "b_dashwipe", { q: "wiping car dashboard", p: BI(`Close view of ${H} wiping the dashboard of ${CABIN} with a damp microfiber cloth.`), d1: "the cloth wipes across the dashboard", d2: "the plastic is left matte and clean", sound: "a cloth wiping plastic" }),
  S(42, "que diga mate, sin brillo", "bi", "b_matteproduct", { q: "car interior cleaning spray", q2: "spray bottle", p: BI("A plain spray bottle of interior plastic cleaner with a blank label on the seat of a car next to a cloth.") }),
  // ── 11 gomas
  S(43, "", "c", "ClOilMap13", { props: { upto: 13, n: 11 } }),
  S(43, "Ésta es la que más se ve en internet", "av", ""),
  S(43, "El aceite mineral hincha las gomas con el tiempo", "c", "ClSealSwell", { props: { mode: "oil" } }),
  S(43, "y empieza a entrar agua y ruido de viento", "bi", "st_rainwindow", { q: "rain car window", p: BI("Rain running down a car side window.") }),
  S(44, "", "bi", "b_silspray", { p: BI(`Close view of ${H} spraying ${SIL} onto ${RAG} next to the open door of ${CAR}.`) }),
  S(44, "dos veces por año", "c", "ClSealSwell", { props: { mode: "silicone" } }),
  S(44, "Por eso en la frase de la refaccionaria lo pedí aparte", "av", ""),
  // ── 12 parabrisas
  S(45, "", "c", "ClOilMap13", { props: { upto: 13, n: 12 } }),
  S(45, "El aceite en el vidrio deja una película", "bi", "b_glassfilm", { q: "dirty windshield", p: BI("Extreme close view of a car windshield with an oily rainbow film smeared across the glass.") }),
  S(45, "Y en las escobillas, hace que salten y dejen rayas", "kf", "k_wiper", { p: BI(`Close view of the wiper blades of ${CAR} resting on a wet windshield.`), d1: "the wiper starts to sweep", d2: "the wiper chatters and leaves streaks", sound: "a wiper chattering on glass" }),
  S(45, "De noche, con las luces de los otros autos", "bi", "st_nightrain", { q: "night rain windshield", p: BI("Night driving in the rain seen through a windshield, oncoming headlights.") }),
  // ── 13 frenos y llantas
  S(46, "", "c", "ClOilMap13", { props: { upto: 13, n: 13 } }),
  S(46, "aceite cerca de los discos o de las pastillas de freno", "bi", "st_brakedisc", { q: "car brake disc", p: BI("A car brake disc and caliper behind a wheel.") }),
  S(46, "Un freno con aceite no frena", "av", ""),
  S(47, "", "bi", "b_tireshine", { p: BI(`Close view of a glossy oily black tire sidewall on ${CAR}.`) }),
  S(47, "la parte que toca el piso, la llanta pierde agarre", "bi", "b_tread", { q: "tire tread wet road", p: BI("Extreme close view of a car tire tread with an oily sheen on it on wet asphalt.") }),
  S(47, "la rueda tira gotitas de aceite a la pintura", "bi", "b_splatter", { p: BI(`Extreme close view of tiny oily dark specks on the silver paint just behind the front wheel of ${CAR}.`) }),
  S(47, "Para las llantas, agua, jabón y un cepillo", "bi", "st_tirebrush", { q: "cleaning car tire brush", p: BI("A brush scrubbing a car tire with soap.") }),
  // ── cómo lo sacamos
  C(48, "", "ClChapter", { n: 7, title: "Cómo lo sacamos", sub: "de donde no iba" }),
  S(49, "", "bi", "b_bucket", { p: BI(`Close view of ${EH} squeezing a few drops of dish soap into a bucket of warm water in ${DRIVE}.`) }),
  S(49, "Un paño apenas húmedo, nunca empapado", "bi", "b_wring", { q: "wringing cloth bucket", q2: "wringing cloth", p: BI(`Close view of ${H} wringing out a microfiber cloth over a bucket.`) }),
  S(49, "y después otro paño seco", "av", ""),
  S(50, "", "bi", "b_wheelwash", { q: "cleaning steering wheel", p: BI(`Close view of ${H} wiping the steering wheel of ${CABIN} with a damp soapy cloth.`) }),
  S(50, "Dos pasadas con jabón y secado", "bi", "b_pedaldry", { p: BI(`Low close view of ${H} drying a rubber brake pedal of ${CABIN} with a dry cloth.`) }),
  S(50, "Después la palanca, el tablero y los botones", "bi", "b_gearwipe", { p: BI(`Close view of ${GH} wiping the gear shift knob of ${CABIN} with a damp cloth.`) }),
  S(50, "El reflejo en el parabrisas desapareció con la segunda pasada", "c", "ClGlare", { props: { mode: "clean" } }),
  S(51, "", "bi", "b_sealwash", { p: BI(`Close view of ${H} wiping a black rubber door seal of ${CAR} with a damp soapy cloth.`) }),
  S(51, "y les pusimos la silicona", "bi", "b_silrub", { p: BI(`Close view of ${H} rubbing a cloth with silicone protectant along the rubber door seal of ${CAR}.`), d1: "the cloth slides along the seal", d2: "the rubber is left dark and dry-looking", sound: "a cloth on rubber" }),
  S(51, "no alcanzó a hacerles daño", "av", ""),
  S(52, "", "bi", "b_newspaper", { p: BI(`Close view of ${H} polishing the windshield of ${CAR} with crumpled newspaper, a spray bottle of glass cleaner on the hood.`) }),
  S(52, "como lo hacía mi papá", "cl", "c_newspaper", { p: CLP(`He polishes the windshield of ${CAR} in ${DRIVE} with crumpled newspaper, smiling a little.`) }),
  S(52, "Hasta que el sol de la tarde dejó de hacer manchón", "bi", "b_clearglass", { q: "driving view windshield", p: BI(`View from the driver's seat of ${CABIN} through a perfectly clear windshield onto a sunny street.`) }),
  S(53, "", "bi", "b_girlhelp", { p: BI(`${GIRL} wiping a car door with a cloth in ${DRIVE}, ${ELENA} watching beside her.`) }),
  S(53, "entonces la mitad del video era mentira", "bi", "b_girlask", { p: BI(`${GIRL} holding up her phone toward someone off-frame in ${DRIVE}, with a skeptical face.`) }),
  S(53, "No mentira, le dije", "av", ""),
  // ── errores
  C(54, "", "ClChapter", { n: 8, title: "Los errores que más veo", sub: "con el aceite de bebé", alert: true }),
  S(55, "", "bi", "b_err1", { p: BI(`Close view of a hand squeezing ${BABY} straight onto a car dashboard, a puddle of oil forming.`), ov: { c: "ClChip", props: { text: "1 · Directo a la pieza", alert: true } } }),
  S(55, "Siempre en el paño, unas gotas", "av", ""),
  S(56, "", "bi", "b_err2", { p: BI(`Extreme close view of silver car paint with a greasy oily smear catching the light and dust stuck in it.`), ov: { c: "ClChip", props: { text: "2 · Aceite en la pintura", alert: true } } }),
  S(56, "siempre jabón para autos", "bi", "st_carwash2", { q: "hand washing car", p: BI("Someone washing a car by hand with a soapy sponge.") }),
  S(57, "", "bi", "b_err3", { p: BI(`Close view of the very glossy oily dashboard of ${CABIN}.`), ov: { c: "ClChip", props: { text: "3 · Brillante ≠ limpio", alert: true } } }),
  S(57, "Está aceitado", "av", ""),
  S(58, "", "bi", "b_err4", { q: "car door rubber", p: BI(`Close view of a hand rubbing an oily rag along a car door rubber seal.`), ov: { c: "ClChip", props: { text: "4 · Gomas cada mes", alert: true } } }),
  S(58, "Así se arruinan las gomas", "av", ""),
];
