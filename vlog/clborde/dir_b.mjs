// DIRECTOR B — clborde: POR QUÉ VUELVE (agujeros, canal = el agujero escondido, húmedo, biopelícula con MICROSCOPIO, agua dura = ancla,
// la escobilla no llega, la señora Rosa y la 314) · EL CLORO (sólo color: pantalla partida; nunca con vinagre; el huésped) ·
// LA PASTILLA AZUL · LEER EL COLOR EN EL ESPEJO (párrafos 16-40).
import { S, BI, CLP, BATH, BOTTLE, RIM } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const G = "a hand in a blue nitrile glove";
const I = "img/clborde/";
const ROSA = "a hotel chambermaid in her fifties, Rosa, with dark hair pulled back in a bun, a gray housekeeping uniform with a white collar and pink rubber gloves";
export const SHOTS = [
  // ── 3:09 · POR QUÉ VUELVE
  C(16, "", "ClChapter", { n: 2, title: "Por qué vuelve siempre", sub: "lo que usted nunca ve" }),
  S(16, "Porque lo que usted ve", "av", ""),
  S(16, "Le muestro lo que hay", "cl", "c_pointrim", { p: CLP(`He kneels by the toilet in ${BATH} and points one gloved finger up under the rim at the holes, looking back at the camera over his shoulder with raised eyebrows, the small mirror in his other hand.`) }),
  C(17, "", "ClRimJets", { mode: "dirty", label: "Una fila de agujeritos" }),
  S(17, "Algunos tienen una docena", "bi", "b_holesrow", { q: "toilet rim close up", p: BI(`Very low close view looking straight up at ${RIM} lit by a flashlight: a long curved row of evenly spaced holes disappearing around the bend of the bowl.`), anim: "the flashlight beam slides slowly along the row of holes" }),
  S(17, "Cuando tira la cadena", "bi", "st_flushrim", { q: "toilet flush water close", p: BI("Close view of clean water rushing out from under the rim of a white toilet and sheeting down the sides of the bowl during a flush.") }),
  S(17, "Ése es todo su trabajo", "av", ""),
  // el canal = el agujero escondido (paga el loop 2)
  C(18, "", "ClRimCutaway3D", { mode: "alive", labels: { holes: "Las puertas", channel: "Canal hueco", tube: "Por acá come" }, orbit: 0.5 }),
  S(18, "Ése es el agujero escondido", "bi", "b_tubetop", { p: BI(`Extreme close view looking down into the open top of the plastic overflow tube inside a toilet tank, a dark round opening with a little water glinting deep inside, ${G} pointing at it.`), anim: "the gloved fingertip moves slowly toward the opening" }),
  S(18, "Por eso echamos por el tubo", "bi", "b_pourtube2", { p: BI(`Looking down into the open tank of a white toilet: ${G} slowly pouring clear liquid from ${BOTTLE} straight into the top of the tall overflow tube.`), anim: "a thin stream of clear liquid keeps pouring into the tube" }),
  S(18, "es la puerta de atrás", "av", ""),
  // húmedo y oscuro
  S(19, "", "bi", "b_darkchannel", { p: BI("A white toilet sawn clean in half lengthwise on a workshop table, showing the hollow channel inside the rim: a dark, damp tunnel lined with black slime and gray mineral crust, a flashlight lying beside it.") , anim: "the flashlight beam drifts slowly into the dark channel" }),
  S(19, "recibe un traguito de agua", "bi", "st_drip", { q: "water dripping close", p: BI("Close view of a single drop of water hanging from a toilet rim hole and falling.") }),
  S(19, "y nadie lo limpió jamás", "av", ""),
  S(19, "ni el plomero", "bi", "st_plumber", { q: "plumber working toilet", p: BI("A plumber in a work shirt kneeling at a toilet with a wrench, his toolbox open on the bathroom floor.") }),
  S(19, "Es una casita perfecta", "av", ""),
  // biopelícula: el microscopio entra por un agujero
  C(20, "", "ClMicroscope3D", { label: "Bacterias y moho, juntos", zoomTo: 400 }),
  S(20, "y después sale por la puerta de adelante", "bi", "b_creep", { p: BI(`Close view of ${RIM}: thick black slime oozing out of one hole and running down the white porcelain in a thin black streak, droplets of water on it.`), anim: "the black streak creeps slowly down the porcelain" }),
  S(20, "que vio en el espejo", "bi", "b_mirror2", { q: "hand mirror", p: BI(`A small round hand mirror lying on the beige tile floor beside a white toilet, reflecting ${RIM} with black streaks.`) }),
  // agua dura = ancla
  S(21, "", "av", ""),
  S(21, "Cada descarga deja una costrita", "bi", "b_crust", { q: "limescale close up", p: BI(`Extreme close view of ${RIM}: around each hole a rough ring of chalky white-gray mineral crust, black slime caught in the rough crust.`), anim: "a drop of water slowly runs over the crust; nothing else moves" }),
  S(21, "como una lija", "bi", "st_sandpaper", { q: "sandpaper texture close", p: BI("Close view of a sheet of coarse sandpaper on a workbench.") }),
  C(21, "y la baba se agarra ahí", "ClRimCutaway3D", { mode: "crust", labels: { holes: "El ancla: costra mineral" }, orbit: 0.3 }),
  S(21, "La baba es el inquilino", "av", ""),
  // la escobilla no llega
  S(22, "", "bi", "st_brushbowl", { q: "toilet brush cleaning bowl", p: BI("A toilet brush scrubbing around the inside of a white toilet bowl.") }),
  S(22, "pero nunca se mete en un agujero", "bi", "b_brushmiss", { q: "toilet brush close up", p: BI(`Close view from below: the bristles of a toilet brush pressing against the underside of a toilet rim, sliding past ${RIM} without going into any of the holes, black gunk still inside them.`), anim: "the brush bristles slide slowly past the holes" }),
  S(22, "Entonces usted refriega", "cl", "c_shrug", { p: CLP(`He stands beside the toilet in ${BATH} holding a toilet brush up in one gloved hand and shrugs at the camera with a lopsided, knowing smile.`) }),
  S(22, "a los tres días", "bi", "b_back3", { p: BI(`Close view of ${RIM}: black streaks under the holes again on an otherwise clean toilet, a cleaning spray bottle on the tank.`) }),
  // la señora Rosa y la 314
  S(23, "", "bi", "b_rosa", { q: "hotel housekeeper cleaning", p: BI(`${ROSA} pushing her housekeeping cart along a hotel corridor with navy carpet and numbered wooden doors, a stack of white towels on the cart.`), anim: "she pushes the cart slowly forward" }),
  S(23, "Limpiaba los baños del tercer piso", "bi", "b_rosascrub", { q: "housekeeper cleaning bathroom", p: BI(`${ROSA} kneeling and scrubbing a white toilet with a brush in a hotel bathroom with beige tiles, a spray bottle beside her.`), anim: "she keeps scrubbing slowly with the brush" }),
  S(23, "en la habitación trescientos catorce", "bi", "b_door314", { p: BI("A hotel room door of dark wood in a corridor with navy carpet, a polished brass plaque with the number 314 on it, a do-not-disturb hanger on the handle with no words.") }),
  S(23, "ahí estaban otra vez las rayas negras", "bi", "b_rosastreaks", { p: BI(`Close view of ${RIM} in a hotel bathroom with beige tiles: black streaks under the holes again.`) }),
  S(23, "Ella le decía el inodoro embrujado", "av", ""),
  S(24, "", "bi", "b_rosapour", { p: BI(`Close view of ${G} pouring from ${BOTTLE} into the tall overflow tube of an open toilet tank in a hotel bathroom with beige tiles.`), anim: "the liquid keeps pouring into the tube" }),
  S(24, "y vio los agujeros hacer espuma", "bi", "b_rosafizz", { p: BI(`Close view of ${RIM}: white foam bubbling out of every hole over the black slime.`), anim: "the foam bubbles slowly grow" }),
  S(24, "se sentó en el borde de la bañera", "bi", "b_rosasit", { q: "woman sitting bathtub surprised", p: BI(`${ROSA} sitting down on the edge of a white bathtub in a hotel bathroom with one gloved hand on her chest, mouth open in amazement, looking at the toilet.`), anim: "she slowly lowers her hand to her lap, still amazed" }),
  S(24, "Tantos años limpiando", "av", ""),
  // ── 5:23 · EL CLORO (paga el loop 1)
  C(25, "", "ClChapter", { n: 3, title: "El mito del cloro", sub: "por qué vuelve tan rápido" }),
  S(25, "Claudio y por qué no le echo cloro", "av", ""),
  S(26, "", "bi", "st_bleach2", { q: "bleach cleaning bathroom", p: BI("A plain white jug of bleach with a blank label on a bathroom floor next to a toilet, a blue nitrile glove on top of it.") }),
  S(26, "Usted lo echa", "bi", "b_bleachbowl", { q: "pouring cleaner toilet bowl", p: BI(`${G} pouring clear liquid from a plain white jug with a blank label into a white toilet bowl, the water splashing.`), anim: "the liquid keeps pouring into the bowl" }),
  C(26, "lo negro se pone gris", "ClSplit", { img: I + "b_rimdirty.jpg" }),
  S(26, "Pero sacarle el color", "av", ""),
  C(27, "", "ClRimCutaway3D", { mode: "bleach", labels: { channel: "Abajo sigue vivo" }, orbit: 0.35 }),
  S(27, "Déle una semana", "bi", "b_regrow", { q: "mold close up", p: BI(`Close view of ${RIM}: pale gray holes with fresh black creeping back out of them.`), anim: "the black slowly darkens around the holes" }),
  S(28, "", "cl", "c_bleachagain", { p: CLP(`He holds up a plain white bleach jug with a blank label in one gloved hand in ${BATH}, eyebrows up, a tired, amused look at the camera.`) }),
  S(28, "No lo está limpiando", "av", ""),
  // agua oxigenada distinta
  S(29, "", "bi", "b_fizzlift", { q: "foam bubbles close up", p: BI(`Extreme close view of a white porcelain rim hole crusted with black slime, white bubbles pushing out of it and lifting black flakes away into the foam.`), anim: "the white bubbles slowly rise and lift the black flakes" }),
  C(29, "y esa espuma la levanta", "ClRimJets", { mode: "fizz", label: "La espuma la despega" }),
  C(29, "Y como la mandamos por el tubo", "ClRimCutaway3D", { mode: "flow", labels: { channel: "Donde el cloro no llega" }, orbit: 0.35 }),
  // nunca cloro + vinagre
  S(30, "", "av", ""),
  C(30, "Nunca jamás mezcle cloro con vinagre", "ClNeverMix", { a: "Cloro", b: "Vinagre", verdict: "Gas cloro" }),
  S(30, "Si usó cloro ahí", "bi", "st_rinse", { q: "rinsing bathroom water", p: BI(`${G} pressing the flush handle of a white toilet, the bathroom window wide open.`) }),
  S(30, "y espere hasta el otro día", "cl", "c_nextday", { p: CLP(`He switches off the light of a hotel bathroom at the door, his blue gloves hanging from his jacket pocket, looking back at the toilet with a firm, no-nonsense look.`) }),
  // el huésped
  S(31, "", "bi", "b_guest", { q: "hotel guest room", p: BI("A middle-aged hotel guest in a polo shirt standing in the doorway of a hotel bathroom holding a jug of white vinegar with a blank label, looking pleased with himself, an unmade hotel bed behind him.") }),
  S(31, "así que echó una botella entera arriba", "bi", "b_vinpour", { q: "pouring vinegar", p: BI("A man pouring a jug of clear vinegar with a blank label into a white toilet bowl in a hotel bathroom, bubbles forming in the water.") , anim: "the vinegar keeps pouring into the bowl" }),
  S(31, "Me llamaron porque estaba tosiendo", "bi", "b_coughing", { q: "man coughing hallway", p: BI("A middle-aged man in a polo shirt coughing into his elbow in a hotel corridor with navy carpet, a chambermaid in a gray uniform beside him fanning the air with a folded towel.") , anim: "the chambermaid fans the air with the towel" }),
  S(31, "Abrimos todas las ventanas del piso", "bi", "st_windows", { q: "opening window fresh air", p: BI("A hand pushing open a tall window at the end of a hotel corridor, curtains blowing in.") }),
  S(31, "y lo sacamos al aire una hora", "cl", "c_balcony", { p: CLP(`He stands on a hotel terrace beside a middle-aged guest in a polo shirt who sits on a bench breathing fresh air, both looking a little shaken, the hotel windows wide open behind them.`) }),
  S(31, "pero la cara de ese hombre", "av", ""),
  // ── 7:07 · LA PASTILLA AZUL
  C(32, "", "ClChapter", { n: 4, title: "La pastilla azul", sub: "y por qué vuelve igual" }),
  S(32, "yo tengo la pastilla azul", "bi", "b_bluebowl", { q: "blue water toilet", p: BI("Looking down into a white toilet bowl full of bright blue water, the seat up, a white bath mat on the beige tile floor.") }),
  S(33, "", "av", ""),
  C(33, "Esa pastilla está en el fondo del tanque", "ClRimCutaway3D", { mode: "tablet", labels: { tank: "La pastilla, abajo", holes: "La baba queda" }, orbit: 0.4 }),
  S(33, "Un chorrito de agua de color", "bi", "b_bluesplash", { p: BI(`Close view of ${RIM}: thin blue water trickling out of the holes over black slime that is still there underneath.`), anim: "the blue water trickles down over the black slime" }),
  S(33, "Deja linda la taza", "av", ""),
  S(34, "", "cl", "c_secret", { p: CLP(`He leans in close to the camera beside the open toilet tank in ${BATH}, one gloved hand cupped at the side of his mouth as if telling a secret.`) }),
  S(34, "la válvula de descarga y los sellos", "bi", "b_flapper", { q: "toilet tank repair", p: BI("Close view inside an open toilet tank of the round rubber flapper at the bottom, the rubber swollen and warped at the edge, blue water around it.") }),
  S(34, "pierde agua toda la noche", "bi", "st_running", { q: "toilet tank water running", p: BI("Close view of water trickling constantly down the back of a white toilet bowl at night, a dim bathroom.") }),
  S(34, "y le sube la cuenta", "bi", "b_bill", { q: "paying bills kitchen table", p: BI("A water bill envelope lying open on a kitchen counter next to a coffee mug and reading glasses, the page face-down.") }),
  S(35, "", "cl", "c_tabletout", { p: CLP(`He holds a soggy blue tablet up between two blue-gloved fingers over the open toilet tank in ${BATH}, wrinkling his nose at it.`) }),
  S(35, "Media taza por el tubo cada semana", "bi", "b_weeklypour", { q: "measuring cup pouring water", p: BI(`${G} pouring a half-full glass measuring cup of clear liquid into the overflow tube of an open toilet tank.`), anim: "the liquid keeps pouring into the tube" }),
  S(35, "y por lo menos usted lo ve trabajar", "av", ""),
  // ── 8:04 · LEER EL COLOR
  C(36, "", "ClChapter", { n: 5, title: "Lea el color", sub: "le dice contra qué pelea" }),
  S(36, "porque el color de lo que ve", "cl", "c_mirrorcolor", { p: CLP(`He kneels at the toilet in ${BATH} holding the small round mirror under the rim and studies the reflection closely, head tilted, like a doctor reading an x-ray.`) }),
  S(36, "como el pronóstico del tiempo", "av", ""),
  C(37, "", "ClColorCode", { pick: 0 }),
  S(37, "Eso es lo vivo", "bi", "b_smear", { p: BI(`Extreme close view of ${RIM}: the tip of an old toothbrush smearing a streak of black slime across the white porcelain.`), anim: "the toothbrush tip drags the black slime a little further" }),
  C(38, "", "ClColorCode", { pick: 1 }),
  S(38, "en el desagüe de la ducha", "bi", "b_pinkdrain", { q: "shower drain", p: BI("Close view of a white shower floor drain with a pink slimy ring around it.") }),
  C(39, "", "ClColorCode", { pick: 2 }),
  S(39, "Eso casi siempre es hierro", "bi", "b_orange", { q: "rust stain", p: BI("Close view of a white toilet bowl with rusty orange-brown streaks running down from under the rim to the waterline, the stain smooth and set into the glaze.") }),
  S(39, "No le voy a mentir", "av", ""),
  C(40, "", "ClColorCode", { pick: 3 }),
  S(40, "Eso es mineral", "bi", "b_whitecrust", { p: BI(`Extreme close view of ${RIM}: rough chalky white-gray mineral crust built up around the holes like hard little volcano rims.`) }),
  S(40, "Y eso me lleva a la que engaña", "av", ""),
];
