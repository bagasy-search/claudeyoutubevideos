// DIRECTOR B — cllavadora: POR QUÉ HUELEN LAS TOALLAS (lugar mojado, el pliegue nunca se seca, cadena al video del borde) · LA PRUEBA
// DE LA NARIZ (Rosa, cadena al video 1) · EL ERROR DEL JABÓN (paga el loop 2: pegajoso, la rayita, polvo, suavizante, pastillas) ·
// EL GERENTE Y LAS 400 TOALLAS (cadena al video 2) · EL ANILLO EN EL FILTRO (paga el loop 3) · sarro en la lavadora (cadena al video 2)
// · CTA 2 (párrafos 20-41).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { SEAL, FOLD, LAUNDRY, BOTTLE } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const G = "a hand in a blue nitrile glove";
const I = "img/cllavadora/";
const ROSA = "a hotel laundry worker in her fifties, Rosa, with dark hair pulled back in a bun, a gray uniform with a white collar and pink rubber gloves";
const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie";
export const SHOTS = [
  // ── 4:00 · por qué huelen las toallas (paga el loop 1)
  C(20, "", "ClChapter", { n: 2, title: "Por qué huelen las toallas", sub: "recién lavadas" }),
  S(20, "Porque la lavadora no es un lugar limpio", "av", ""),
  S(20, "Es un lugar mojado", "bi", "b_wetdrum", { p: BI("Looking into the drum of a front-loading washing machine right after a wash with the door just opened: water droplets beading all over the steel drum and pooled in the bottom fold of the gray rubber seal.") }),
  S(21, "", "bi", "b_folddamp", { p: BI(`Extreme close view of ${FOLD}, a little pool of cloudy gray water sitting in the bottom of the fold with lint floating in it.`), anim: "a tiny ripple crosses the gray water in the fold" }),
  C(21, "todo a oscuras con la puerta cerrada", "ClWasher3D", { mode: "peel", labels: { a: "Agua tibia y a oscuras" } }),
  C(21, "Es la misma familia de lo que vive", "ClVideoRef", { thumb: I + "th_clborde.jpg", title: "El borde del inodoro" }),
  S(22, "", "bi", "st_washwater", { q: "washing machine water rinse", p: BI("Water swirling with clothes inside a washing machine drum.") }),
  S(22, "Las toallas son las que más lo agarran", "bi", "st_thicktowel", { q: "thick white towel close up", p: BI("Close view of a thick white terry cloth towel.") }),
  S(22, "ese olor sube con la humedad de su piel", "bi", "st_drying_face", { q: "drying face with towel", p: BI("A man drying his face with a white towel in a bathroom.") }),
  S(23, "", "bi", "st_softener", { q: "pouring fabric softener", p: BI("Pouring blue fabric softener from a bottle into a cap.") }),
  S(23, "y encima le da más de comer", "av", ""),
  // ── la prueba de la nariz
  S(24, "", "av", ""),
  C(24, "acerque la nariz a tres lugares", "ClSmellTest", {}),
  S(24, "ése es el que le está arruinando la ropa", "bi", "b_sniffdrawer", { p: BI("A woman leaning down to sniff the open detergent drawer slot of a white washing machine, her face wrinkling in disgust.") }),
  // Rosa
  S(25, "", "bi", "b_rosa", { p: BI(`${ROSA} standing at a stainless steel folding table in ${LAUNDRY}, holding a freshly washed white towel up to her nose with her eyes closed, concentrating.`) }),
  C(25, "Se acuerda de Rosa", "ClVideoRef", { thumb: I + "th_clborde.jpg", title: "Rosa, la de la 314" }),
  S(25, "Tenía una nariz de sabueso", "bi", "b_rosasniff", { p: BI(`${ROSA} sniffing a white towel and pulling a face, turning her head to point with her chin at one particular washing machine in a row of big front-loaders in ${LAUNDRY}.`) }),
  S(25, "la tres está podrida", "bi", "b_machine3", { p: BI(`The third big white front-loading washing machine in a row in ${LAUNDRY}, its door open, a dark grimy line visible in the rubber seal.`) }),
  S(25, "Y era la tres", "cl", "c_rosanod", { p: CLP(`He kneels at the third washing machine in a row in ${LAUNDRY}, pulling back the rubber seal to show a black moldy fold, looking up over his shoulder at the camera with raised eyebrows and a little nod of respect.`) }),
  // ── 5:20 · el error del jabón (paga el loop 2)
  C(26, "", "ClChapter", { n: 3, label: "ERROR", title: "El jabón", sub: "lo que le da de comer", alert: true }),
  S(26, "el primer año que nos pasamos al jabón líquido", "bi", "st_liquiddetergent", { q: "pouring liquid laundry detergent", p: BI("Pouring liquid laundry detergent into a measuring cap.") }),
  S(26, "son pegajosos", "bi", "b_sticky", { p: BI(`Extreme close view of ${G} pressing two fingertips together and pulling them apart, a sticky string of blue liquid detergent stretching between them, a washing machine behind.`) }),
  S(26, "se queda pegado en la goma", "bi", "b_residue", { p: BI(`Close view of ${SEAL} with a sticky film of bluish detergent residue and gray gunk stuck in its fold.`) }),
  C(27, "", "ClDoseCap", { good: "la rayita", bad: "lo que sobra se queda adentro" }),
  S(28, "", "bi", "b_measure", { p: BI(`${G} filling a detergent measuring cap only up to the first line printed inside it, over a white washing machine.`) }),
  S(28, "lave con jabón en polvo", "bi", "st_powder", { q: "laundry powder detergent scoop", p: BI("A scoop of white powder laundry detergent.") }),
  S(29, "", "bi", "st_softener2", { q: "fabric softener bottle", p: BI("A bottle of fabric softener on a washing machine.") }),
  S(29, "y las toallas secaban mejor", "bi", "st_fluffytowels", { q: "fluffy white towels", p: BI("Fluffy clean white towels folded on a shelf.") }),
  // las pastillas
  S(30, "", "bi", "b_tablets", { p: BI("A box of washing machine cleaning tablets with a blank label next to a white front-loading washing machine, one tablet dropped into the empty drum.") }),
  C(30, "Pero no llegan al pliegue de la goma", "ClPins", { img: I + "b_wholewasher.jpg", pins: [{ x: 0.5, y: 0.66, label: "El pliegue" }, { x: 0.25, y: 0.13, label: "El hueco del cajón" }, { x: 0.18, y: 0.9, label: "El filtro" }] }),
  S(30, "y el olor sigue", "av", ""),
  // ── 6:25 · el gerente y las 400 toallas (cadena al video 2)
  C(31, "", "ClChapter", { n: 4, title: "Las 400 toallas", sub: "y el gerente de la libreta" }),
  C(31, "Se acuerda del gerente de la libreta", "ClVideoRef", { thumb: I + "th_clsarro.jpg", title: "Los tres inodoros" }),
  S(31, "los huéspedes empezaron a quejarse", "bi", "b_complaint", { p: BI("A hotel guest in a bathrobe at the reception desk holding out a white towel and complaining, the receptionist leaning back slightly.") }),
  S(32, "", "bi", "b_managernote", { p: BI(`${MANAGER} standing in ${LAUNDRY} writing in a small spiral notebook, frowning at a pile of towels.`) }),
  C(32, "y anotó", "ClNotebook", { title: "Lavandería", rows: [{ k: "Toallas", v: "400 nuevas" }, { k: "Lavadoras", v: "cambiar" }] }),
  S(33, "", "cl", "c_askday", { p: CLP(`He stands in a hotel corridor facing ${MANAGER}, holding up one finger and smiling calmly; the manager is already nodding and handing him a key.`) }),
  S(33, "Me dio el día directo", "av", ""),
  // el sótano
  S(34, "", "cl", "c_firstwasher", { p: CLP(`He kneels at the first big white front-loading washing machine in ${LAUNDRY}, pulling back the rubber door seal and jerking his head back in disgust, the fold black all the way around.`) }),
  S(34, "El pliegue estaba negro en toda la vuelta", "bi", "b_foldblackall", { p: BI(`Close view of ${SEAL} pulled back all the way around by two gloved hands: the fold is black with mold in the entire circle.`) }),
  S(35, "", "bi", "b_sixwashers", { p: BI(`A row of six big white front-loading washing machines in ${LAUNDRY}, all with their doors open and their detergent drawers pulled out, a bucket and a spray bottle on the floor.`) }),
  S(35, "La goma el cajón el filtro", "bi", "b_claudiowork", { p: BI(`Close view of ${G} scrubbing the fold of ${SEAL} of a big commercial washing machine with an old toothbrush.`), anim: "the toothbrush scrubs the fold" }),
  S(35, "cambiamos el jabón y la medida", "bi", "b_powderbox", { p: BI("A big box of powder laundry detergent with a blank label and a measuring scoop on a stainless steel table in a hotel laundry room.") }),
  S(36, "", "bi", "b_towelsfolded", { p: BI(`Tall stacks of clean, fluffy folded white towels on a stainless steel table in ${LAUNDRY}, a laundry worker's hands squaring a stack.`) }),
  S(36, "El gerente no compró ni una toalla", "bi", "b_managersmile", { p: BI(`${MANAGER} smelling a fresh white towel in ${LAUNDRY}, eyebrows raised in surprise.`) }),
  C(36, "Tachó la palabra de la libreta", "ClNotebook", { title: "Lavandería", rows: [{ k: "Toallas", v: "400 nuevas" }, { k: "Lavadoras", v: "cambiar" }], strike: true }),
  // ── 7:22 · el anillo en el filtro (paga el loop 3)
  C(37, "", "ClChapter", { n: 5, title: "Lo que había en el filtro", sub: "lo que le prometí" }),
  C(37, "cuando abrí el filtro", "ClFilterFind", {}),
  S(37, "Un anillo de casamiento", "bi", "b_ringpalm", { p: BI(`Extreme close view of a gold wedding ring resting in the palm of ${G}, a few wet gray strands of lint still stuck to it, drops of water.`), anim: "the ring glints as the hand tilts slightly" }),
  S(38, "", "bi", "b_reception", { p: BI("A gold wedding ring placed on a hotel reception desk on a folded white cloth, a receptionist in a navy blazer picking up the phone.") }),
  S(38, "adentro de una funda de almohada", "bi", "st_pillowcase", { q: "white pillowcase bed", p: BI("A white pillowcase on a hotel bed.") }),
  S(38, "Volvió al hotel a buscarlo", "bi", "b_guestreturn", { p: BI("A woman in her sixties in a coat walking into a hotel lobby, anxious and hopeful.") }),
  S(38, "volvió a llorar pero de la otra manera", "bi", "b_guestjoy", { p: BI("A woman in her sixties at a hotel reception desk holding a small gold ring to her chest, crying and smiling at the same time, a receptionist smiling across the desk.") }),
  S(39, "", "av", ""),
  S(39, "Monedas horquillas a veces una llave", "bi", "b_filterjunk", { p: BI("Coins, hair pins, a small key and gray lint laid out on an old towel next to a washing machine pump filter.") }),
  S(39, "la ropa sale empapada", "bi", "st_wetclothes", { q: "wet clothes washing machine", p: BI("Soaking wet clothes being pulled out of a washing machine.") }),
  // sarro en la lavadora (cadena al video 2)
  C(40, "", "ClVideoRef", { thumb: I + "th_clsarro.jpg", title: "El sarro del inodoro" }),
  S(40, "En la resistencia que calienta el agua", "bi", "b_heater", { p: BI("A washing machine heating element taken out, crusted with thick white limescale, held over a laundry sink.") }),
  S(40, "dos tazas de vinagre blanco", "bi", "st_vinegar", { q: "white vinegar pouring", p: BI("White vinegar being poured into a measuring cup.") }),
  C(40, "nunca el mismo día que el agua oxigenada", "ClNeverMix", { a: "Vinagre", b: "Agua oxigenada", verdict: "Días distintos", short: true }),
  // CTA 2
  S(41, "", "av", ""),
  C(41, "está en la página once", "ClBookPage", { page: I + "book_p11.jpg", pageNo: 11, qr: I + "qr.jpg", stamp: "Se la regalo" }),
  C(41, "El código está acá", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "la página 11, gratis" }),
];
