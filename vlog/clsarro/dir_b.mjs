// DIRECTOR B — clsarro: POR QUÉ EL CEPILLO NO PUEDE (dos capas: el corte 3D de la taza con las capas por día, la pava, el cepillo que
// resbala) · EL COLOR DEL ANILLO (muestrario) · LA PIEDRA SECA (paga el loop 2: el compañero nuevo, 3 reglas, la uña) · EL BAÑO DE
// VISITAS (lo que nadie le dice) · EL GERENTE Y LOS TRES INODOROS (paga el loop 3: libreta, tiras de vinagre, luna → sol, tacha
// "cambiar", la llave del depósito) · el porqué del vinagre · NUNCA con cloro · CTA 2 (párrafos 20-47).
import { S, BI, CLP, BATH } from "../claudio/lib.mjs";
import { RING, PUMICE } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const G = "a hand in a blue nitrile glove";
const I = "img/clsarro/";
const NEWGUY = "a young hotel maintenance worker in his early twenties with short dark hair and a navy work polo";
const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie";
export const SHOTS = [
  // ── 4:00 · por qué el cepillo nunca puede (paga el loop 1)
  C(20, "", "ClChapter", { n: 2, title: "Por qué el cepillo no puede", sub: "son dos capas, no una" }),
  S(20, "Porque ese anillo no es una cosa", "av", ""),
  C(21, "", "ClBowl3D", { mode: "layers", days: 365, labels: { ring: "Una capa por día" } }),
  S(21, "Calcio magnesio", "bi", "st_tapwater", { q: "tap water glass filling", p: BI("Tap water running into a clear drinking glass at a kitchen sink.") }),
  S(21, "Y en la línea del agua", "bi", "b_waterline", { p: BI("Extreme close view of the waterline inside a white toilet bowl: the still water surface meeting the porcelain, a faint pale mineral line just above it, tiny reflections on the water.") , anim: "the water surface trembles very slightly; nothing else moves" }),
  S(21, "Una capa finita por día", "bi", "b_ringlines", { p: BI("Extreme close view of the inside of a white toilet bowl just above the water: several thin parallel pale gray mineral lines stacked one above the other like the rings of a tree, the top ones turning tan.") }),
  S(21, "Como la costra blanca de la pava", "bi", "st_kettlescale", { q: "limescale kettle", p: BI("Looking into an old electric kettle with thick white limescale crust on the bottom and heating element.") }),
  // ── la capa marrón
  S(22, "", "bi", "b_ringrough", { p: BI(`Extreme macro of ${RING}: the rough, porous surface of the mineral crust with brown grime caught in every pit, like a close-up of sandstone.`), anim: "the camera drifts very slowly across the rough surface" }),
  S(22, "Eso le da el color", "bi", "st_rustwater", { q: "rusty water stain", p: BI("Orange rust stains running down a white porcelain sink under an old faucet.") }),
  S(22, "Por eso la mancha es marrón", "av", ""),
  // ── el cepillo resbala
  C(23, "", "ClBowl3D", { mode: "brush", labels: { ring: "El cepillo resbala" } }),
  S(23, "como pasa la mano por una pared", "bi", "st_handwall", { q: "hand touching wall texture", p: BI("A hand sliding flat across a rough painted wall.") }),
  S(23, "en una semana la mancha vuelve", "bi", "b_ringback", { p: BI(`Looking down into a white toilet bowl that was brushed a week ago: ${RING} back exactly where it was, a toilet brush in its holder beside the toilet.`) }),
  // ── dos partes
  S(24, "", "av", ""),
  C(24, "La pasta saca la capa de arriba", "ClSplit", { img: I + "b_ringdirty.jpg", left: ["LA PASTA", "saca la capa de arriba"], right: ["PIEDRA Y VINAGRE", "sacan la de abajo"] }),
  S(24, "Si saca una sola vuelve", "av", ""),
  // ── agua dura: la pava, la flor de la ducha
  S(25, "", "bi", "st_showerhead", { q: "limescale shower head", p: BI("Close view of a chrome shower head with white limescale crust clogging the nozzles.") }),
  S(25, "Si tiene costra blanca", "bi", "st_kettle2", { q: "kettle limescale inside", p: BI("Looking into a kettle with white limescale on the bottom.") }),
  S(25, "No es que usted limpie mal", "av", ""),
  // ── 5:15 · el color del anillo
  C(26, "", "ClChapter", { n: 3, title: "Lea el color del anillo", sub: "le dice qué tiene" }),
  S(26, "Después de ciento veinte inodoros", "cl", "c_flashlight", { p: CLP(`He kneels beside a white toilet in ${BATH} shining a small flashlight into the bowl and squinting at the waterline like a doctor reading an x-ray.`) }),
  C(27, "", "ClColorCode", { pick: 0, items: [{ c: "#E6E1D3", name: "Blanco o gris", what: "Calcio solo", fix: "Vinagre + piedra" }, { c: "#8A5A2B", name: "Marrón o naranja", what: "Piedra con óxido", fix: "Pasta + piedra" }, { c: "#4F8C7A", name: "Verdoso", what: "Cobre de caños viejos", fix: "Vinagre" }, { c: "#1C1A14", name: "Negro baboso", what: "Está vivo", fix: "El video del borde" }] }),
  C(28, "", "ClColorCode", { pick: 1, items: [{ c: "#E6E1D3", name: "Blanco o gris", what: "Calcio solo", fix: "Vinagre + piedra" }, { c: "#8A5A2B", name: "Marrón o naranja", what: "Piedra con óxido", fix: "Pasta + piedra" }, { c: "#4F8C7A", name: "Verdoso", what: "Cobre de caños viejos", fix: "Vinagre" }, { c: "#1C1A14", name: "Negro baboso", what: "Está vivo", fix: "El video del borde" }] }),
  S(28, "Ése es el de hoy", "bi", "b_ringorange", { p: BI(`Close view looking down into a white toilet bowl at ${RING}, rust-orange streaks under it.`) }),
  C(29, "", "ClColorCode", { pick: 2, items: [{ c: "#E6E1D3", name: "Blanco o gris", what: "Calcio solo", fix: "Vinagre + piedra" }, { c: "#8A5A2B", name: "Marrón o naranja", what: "Piedra con óxido", fix: "Pasta + piedra" }, { c: "#4F8C7A", name: "Verdoso", what: "Cobre de caños viejos", fix: "Vinagre" }, { c: "#1C1A14", name: "Negro baboso", what: "Está vivo", fix: "El video del borde" }] }),
  S(29, "Eso suele ser el cobre", "bi", "b_greenstain", { p: BI("Close view inside a white toilet bowl: a blue-green stain streak running down the porcelain from under the rim to the water, typical of copper from old pipes.") }),
  S(29, "los caños tienen años", "bi", "st_oldpipes", { q: "old copper pipes", p: BI("Old copper water pipes with green patina under a sink.") }),
  C(30, "", "ClColorCode", { pick: 3, items: [{ c: "#E6E1D3", name: "Blanco o gris", what: "Calcio solo", fix: "Vinagre + piedra" }, { c: "#8A5A2B", name: "Marrón o naranja", what: "Piedra con óxido", fix: "Pasta + piedra" }, { c: "#4F8C7A", name: "Verdoso", what: "Cobre de caños viejos", fix: "Vinagre" }, { c: "#1C1A14", name: "Negro baboso", what: "Está vivo", fix: "El video del borde" }] }),
  C(30, "y es otro arreglo", "ClVideoRef", { thumb: I + "th_clborde.jpg", title: "El borde del inodoro" }),
  // ── 6:00 · la piedra seca (paga el loop 2)
  C(31, "", "ClChapter", { n: 4, label: "ERROR", title: "La piedra seca", sub: "raya para siempre", alert: true }),
  S(31, "la piedra pómez seca", "bi", "b_pumicedry", { p: BI(`${PUMICE}, bone dry and pale, lying on the rim of a white toilet in a hotel bathroom, gray dust on the porcelain beside it.`) }),
  S(32, "", "bi", "b_newguy", { p: BI(`${NEWGUY} kneeling at a white toilet in a hotel bathroom scrubbing the inside of the bowl hard with a dry pumice stone, elbow high, gray dust in the air, his face set with effort.`), anim: "he scrubs hard back and forth with the dry stone" }),
  C(32, "Quedó lleno de rayitas finas", "ClPumiceTest", { only: "dry" }),
  S(32, "Y en cada rayita", "bi", "b_scratchdirt", { p: BI("Extreme close view of the inside of a white toilet bowl covered in fine dull scratch marks, gray grime settled inside every scratch.") }),
  S(32, "Lo terminamos cambiando", "bi", "b_oldtoiletout", { p: BI("An old white toilet unbolted and set on a dolly in a hotel service hallway beside a trash cart, a new toilet box behind it.") }),
  // las 3 reglas
  S(33, "", "av", ""),
  S(33, "Siempre mojada", "bi", "b_pumicewet2", { p: BI(`${G} holding ${PUMICE} dripping water over a white toilet bowl, the porcelain wet and shiny.`), anim: "drops of water fall from the stone" }),
  S(33, "Suave", "kf", "k_pumicesoft", { p: BI(`Close view inside a white toilet bowl: ${G} gliding ${PUMICE}, dripping wet, lightly over a brown mineral stain with no pressure, two fingers only on the handle.`), d1: "two gloved fingers rest lightly on the stone's handle", d2: "the wet stone glides gently and the stain fades behind it", sound: "a soft wet gritty glide" }),
  C(33, "Y sólo en la porcelana blanca", "ClDoDont", { yes: { label: "La taza blanca", img: I + "b_whitebowl.jpg" }, no: { label: "Asiento, color, plástico", img: I + "b_coloredtoilet.jpg" } }),
  S(34, "", "bi", "b_testspot", { p: BI(`Low close view at the back of a white toilet near the beige tile floor: ${G} testing a wet pumice stone on a small hidden spot of the porcelain base.`) }),
  // las líneas grises y la uña
  S(35, "", "bi", "b_graylines", { p: BI("Extreme close view of clean white porcelain inside a toilet bowl with a few faint gray pencil-like marks left by a pumice stone.") }),
  S(35, "Pase un poco de pasta", "bi", "b_spongegray", { p: BI(`${G} wiping faint gray pumice marks off white porcelain with an old sponge and a little white paste; behind the sponge the porcelain is spotless.`), anim: "the sponge wipes slowly and the gray marks disappear" }),
  S(35, "Si con la uña no siente nada", "bi", "b_fingernail", { p: BI("Extreme close view of a bare fingernail sliding over smooth clean white porcelain inside a toilet bowl to feel for scratches.") }),
  // ── 7:03 · lo que nadie le dice: el baño de visitas
  S(36, "", "av", ""),
  S(36, "Es el del baño de visitas", "bi", "b_guestbath", { p: BI("A small, neat guest half-bath in a home, a hand towel folded on the sink, the toilet lid up showing a thick brown mineral ring at the waterline, a little dust on the tank lid.") , ov: { c: "ClStampOv", props: { text: "EL PEOR" } } }),
  S(37, "", "bi", "b_evaporate", { p: BI("Extreme close view of the waterline inside a white toilet bowl: several thin stepped mineral lines just above the water where the water level dropped little by little.") }),
  C(37, "En el hotel las habitaciones que estaban cerradas", "ClHallway3D", { total: 18, floor: 3, title: "cerradas", sub: "en temporada baja" }),
  S(37, "tire la cadena una vez por semana", "bi", "st_flush3", { q: "flushing toilet hand", p: BI("A hand pushing the flush handle of a white toilet.") }),
  // ── 7:32 · EL GERENTE (paga el loop 3)
  C(38, "", "ClChapter", { n: 5, title: "Los tres inodoros", sub: "y una sola noche" }),
  S(38, "Un año cambió la administración", "bi", "st_hotellobby", { q: "hotel lobby reception", p: BI("A hotel lobby with a reception desk and a few guests checking in.") }),
  S(38, "el gerente nuevo recorrió el tercer piso", "bi", "b_managerwalk", { p: BI(`${MANAGER} walking down a hotel corridor with navy patterned carpet, writing in a small spiral notebook as he walks, glancing at the room numbers.`), anim: "he keeps walking slowly down the corridor writing" }),
  S(38, "Entró a la trescientos doce", "bi", "b_managerbath", { p: BI(`${MANAGER} standing in the doorway of a hotel guest bathroom looking down at a white toilet with an ugly brown mineral ring in the bowl, lips pressed together, notebook in hand.`) }),
  C(38, "y anotó", "ClNotebook", { rows: [{ k: "312", v: "cambiar" }, { k: "314", v: "cambiar" }, { k: "318", v: "cambiar" }] }),
  S(38, "con el plomero", "bi", "st_plumber", { q: "plumber installing toilet", p: BI("A plumber installing a new toilet in a bathroom.") }),
  S(39, "", "cl", "c_asknight", { p: CLP(`He stands in a hotel corridor facing ${MANAGER}, one hand raised with a single finger up as if asking for one chance, a calm confident little smile; the manager looks at him skeptically.`) }),
  S(39, "este conserje está loco", "bi", "b_managerskeptic", { p: BI(`${MANAGER} in a hotel corridor raising one eyebrow and tilting his head skeptically, arms folded, notebook under his arm.`) }),
  S(39, "Y me dio la noche", "av", ""),
  // la tarde: sólo vinagre
  S(40, "", "bi", "st_vinegarjug", { q: "white vinegar bottle", p: BI("A big plastic jug of plain white vinegar with a blank label on a bathroom floor.") }),
  S(40, "Pero lo usé como casi nadie lo usa", "av", ""),
  // las tiras como una venda
  S(41, "", "bi", "b_tearstrips", { p: BI(`${G} tearing long strips of toilet paper from a roll over a hotel bathroom counter, a bowl of clear vinegar beside the roll.`), anim: "the hands tear off another long strip slowly" }),
  S(41, "las empapé en vinagre", "bi", "b_soakstrips", { p: BI(`${G} dipping a long strip of toilet paper into a bowl of clear vinegar until it goes limp and translucent.`), anim: "the paper strip sinks slowly into the vinegar" }),
  S(41, "y las pegué encima del anillo", "kf", "k_strips", { p: BI(`Close view inside a white toilet bowl with the water lowered: ${G} pressing a soaked strip of toilet paper flat onto ${RING}, other strips already stuck beside it.`), d1: "the gloved hand holds a soaked paper strip against the ring", d2: "the hand presses the strip flat along the ring next to the others", sound: "a soft wet paper press on porcelain" }),
  C(41, "Así el vinagre se queda apoyado", "ClBowl3D", { mode: "vinegar", labels: { ring: "Apoyado toda la noche" } }),
  // el fondo, la tapa, el cartel
  S(42, "", "bi", "b_vinegarbottom", { p: BI("Looking down into a white toilet bowl with its water lowered, paper strips stuck all around the waterline, clear vinegar being poured from a measuring cup into the bottom.") , anim: "the vinegar keeps pouring into the bottom" }),
  S(42, "La tapa bajada", "bi", "st_lidclose", { q: "closing toilet lid", p: BI("A hand closing the lid of a white toilet.") }),
  S(42, "y un cartel en la puerta", "bi", "b_doorsign", { p: BI("The outside of a hotel guest room bathroom door, a sheet of paper taped to it with a handwritten note, a housekeeping cart in the corridor, night light.") }),
  // a la mañana
  C(43, "", "ClTimer30", { overnight: true }),
  S(43, "una pasada de piedra mojada", "bi", "b_chalky", { p: BI(`Close view inside a white toilet bowl in morning light: ${G} running a wet pumice stone over a softened mineral ring that crumbles away like wet chalk, white porcelain showing.`), anim: "the stone glides and the soft crust crumbles away" }),
  S(43, "Abrí el agua", "bi", "st_flush4", { q: "toilet flush clean", p: BI("Clean water rushing into a white toilet bowl during a flush.") }),
  S(43, "Los tres blancos", "cl", "c_threewhite", { p: CLP(`He stands in a hotel corridor in front of three open guest-room doors numbered 312, 314 and 318, arms crossed, smiling proudly, a bucket and a pumice stone at his feet.`) }),
  // el gerente tacha "cambiar"
  C(44, "", "ClNotebook", { rows: [{ k: "312", v: "cambiar" }, { k: "314", v: "cambiar" }, { k: "318", v: "cambiar" }], strike: true }),
  S(44, "No me dijo nada", "av", ""),
  S(44, "la llave del depósito nuevo", "bi", "b_keys", { p: BI(`${G} catching a heavy ring of brass hotel keys with a round brass tag, a storeroom door with shelves of cleaning supplies behind.`) }),
  // por qué funciona
  S(45, "", "av", ""),
  C(45, "Y la piedra del agua", "ClBowl3D", { mode: "vinegar", lupa: true, labels: { ring: "El ácido la disuelve" } }),
  S(45, "un chorrito que pasa no hace nada", "bi", "st_pourquick", { q: "pouring liquid toilet", p: BI("Liquid splashing into a white toilet bowl and running straight down into the water.") }),
  // NUNCA con cloro
  S(46, "", "av", ""),
  C(46, "Nunca juntos en la misma botella", "ClNeverMix", { a: "Vinagre", b: "Agua oxigenada", verdict: "Nunca juntos", short: true }),
  C(46, "vinagre donde hubo cloro", "ClNeverMix", { a: "Vinagre", b: "Cloro", verdict: "Gas tóxico" }),
  // ── CTA 2
  S(47, "", "av", ""),
  C(47, "está en la página diez", "ClBookPage", { page: I + "book_p10.jpg", pageNo: 10, qr: I + "qr.jpg", stamp: "Se la regalo" }),
  C(47, "Apunte al código", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "la página 10, gratis" }),
  S(47, "Y en la misma página", "av", ""),
];
