// DIRECTOR A — fboxido (El Constructor Libre): MINUTO 1 (la llave brillante que a la mañana está naranja = sello "ERROR" en el seg 0 →
// la pinza trabada del galpón → PROMESA: gris, abre suave, sin lijar, < $1 → el vecino ("milagro de internet") → ráfaga → "¡mira cómo
// sale el óxido!" → 3 loops) + LA RECETA (1 taza vinagre · ½ harina · 2 cdas sal, fuego hasta engrudo, untar grueso, film, 2-12 h,
// cepillar, bicarbonato, calor, aceite) + LA CUENTA + CTA 1 = QR (párrafos 0-30).
import { S, BI, CLP } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fboxido/";
export const SHED = "a wooden workbench in a small backyard shed in Latin America, a pegboard with hand tools on the wall, daylight from a small window";
export const PLIERS = "an old pair of steel pliers";
export const RUSTYP = "an old pair of steel pliers covered in thick orange rust, jammed shut";
export const CLEANP = "an old pair of steel pliers cleaned back to plain gray steel, lightly oiled";
export const GEL = "a thick beige homemade paste like wallpaper glue";
export const HANDS = "working hands in blue nitrile gloves of a man in an olive-green shirt with rolled sleeves";
export const NEIGHBOR = "a sturdy 65-year-old Latin American neighbour, bald on top with gray hair at the sides, a thick gray mustache, a short-sleeved light-blue checked shirt with a pen in the pocket, glasses hanging on a cord";
export const SHOTS = [
  // ── 0:00 · el error en el segundo 0
  S(0, "", "bi", "b_flashrust", { p: BI(`Close view of a freshly cleaned steel wrench lying wet on a kitchen counter, covered in a fuzz of new orange rust.`), ov: { c: "ClStampOv", props: { text: "ERROR" } } }),
  S(0, "el gel de vinagre para el óxido", "bi", "b_gelpot", { p: BI(`${GEL} in an old dented pot with a spoon, a bottle of white vinegar and a bag of flour beside it on ${SHED}.`) }),
  S(0, "no te saltes el último paso", "av", ""),
  S(0, "Ése es el error del video que viste", "bi", "b_phonevideo", { p: BI(`A phone propped on a workbench playing a video of a shiny cleaned wrench, rusty tools beside it.`) }),
  S(0, "la herramienta sale brillante", "bi", "b_shinywrench", { p: BI(`A clean shiny gray steel wrench held up under running water in a sink.`) }),
  S(0, "está naranja otra vez", "bi", "b_orangeagain", { p: BI(`The same steel wrench the next morning on a counter, dotted all over with fresh orange rust.`) }),
  // ── la pinza trabada
  S(1, "", "bi", "b_rustypliers", { p: BI(`${RUSTYP} on ${SHED}.`) }),
  S(1, "Estaba en el fondo del galpón", "bi", "b_shedcorner", { p: BI(`A dusty corner at the back of a backyard shed with an old toolbox and rusty tools in a crate.`) }),
  S(1, "naranja entera, trabada", "bi", "b_jammed", { p: BI(`Close view of the rust-seized pivot of old pliers, orange flakes around it.`) }),
  S(1, "que no abría ni con las dos manos", "cl", "c_struggle", { p: CLP(`He strains with both hands trying to open a pair of rusted-shut pliers in a backyard shed, grimacing at the camera.`) }),
  S(1, "Y esta llave, y este serrucho", "bi", "b_rustytools", { q: "rusty hand tools", p: BI(`A rusty adjustable wrench and a rusty hand saw on ${SHED}.`) }),
  S(1, "Todo herrumbrado", "bi", "b_rustmacro", { p: BI(`Extreme close view of thick orange rust scale on the jaws of old pliers.`) }),
  // ── 0:12 · LA PROMESA
  S(2, "", "bi", "b_cleanpliers", { q: "pliers workbench", p: BI(`${CLEANP} on ${SHED}, daylight on the steel.`) }),
  S(2, "y abre y cierra suave", "bi", "b_openclose", { p: BI(`A hand opening and closing a clean gray pair of pliers easily.`), anim: "the pliers open and close" }),
  S(2, "Ni una mancha naranja", "bi", "b_nospot", { p: BI(`Extreme close view of the clean gray jaws of old pliers, no rust anywhere.`) }),
  S(2, "Sin lijar ni una vez", "bi", "st_sandpaper", { q: "sandpaper metal rust", p: BI(`Sandpaper on rusty metal.`) }),
  S(2, "Vinagre y harina", "bi", "b_twoingr", { p: BI(`A bottle of white vinegar with a plain label and a paper bag of flour side by side on ${SHED}.`) }),
  S(2, "Menos de un dólar", "c", "ClReceipt", { props: { lines: [["Vinagre blanco, 1 taza", "≈ 0,30"], ["Harina, ½ taza", "menos"], ["Sal, bicarbonato, aceite", "de la cocina"]], total: ["Todo el cajón", "< 1 dólar"] } }),
  C(2, "para todo el cajón de herramientas", "ClBeforeAfter", { before: I + "b_rustypliers.jpg", after: I + "b_cleanpliers.jpg", note: "gel de vinagre + harina, y el final" }),
  // ── el vecino
  S(3, "", "bi", "b_neighborlook", { p: BI(`${NEIGHBOR} at the door of a backyard shed holding up a pair of clean gray pliers, squinting at them, skeptical.`) }),
  S(3, "que eso era un milagro de internet", "bi", "b_neighborscoff", { p: BI(`${NEIGHBOR} waving a hand dismissively in front of a backyard shed, laughing skeptically.`) }),
  S(3, "que el óxido no sale sin amoladora", "bi", "st_grinder", { q: "angle grinder sparks", p: BI(`An angle grinder throwing sparks.`) }),
  S(3, "Le dije que me trajera", "av", ""),
  S(3, "la peor herramienta que tuviera", "bi", "b_worsttool", { p: BI(`${NEIGHBOR} handing over a pair of pincers caked in thick orange rust, grinning.`) }),
  // ── 0:22 · RÁFAGA
  S(4, "", "bi", "b_pourvinegar", { q: "pouring vinegar", p: BI(`White vinegar poured from a bottle into an old pot with flour.`), anim: "the vinegar pours" }),
  S(4, "Al fuego, revolviendo", "bi", "b_stirfire", { p: BI(`A spoon stirring a cloudy mix of vinegar and flour in an old pot on a gas flame.`), anim: "the spoon stirs" }),
  S(4, "Espesa como engrudo", "bi", "b_thick", { p: BI(`A spoon lifted out of an old pot with ${GEL} holding on it, not dripping.`) }),
  S(4, "Lo unto grueso", "bi", "b_brushon", { p: BI(`${HANDS} brushing ${GEL} thickly over rusty pliers with an old paintbrush.`) }),
  S(4, "Film encima", "bi", "b_filmpliers", { p: BI(`Gloved hands wrapping clear plastic cling film around a pair of old steel pliers covered in thick beige paste, on a workbench.`) }),
  S(4, "Unas horas", "bi", "b_nightwindow", { p: BI(`A shed window at night, a wrapped bundle of tools on the workbench under a lamp.`) }),
  S(4, "Cepillo", "bi", "b_scrubwater", { q: "wire brush cleaning rust", p: BI(`${HANDS} scrubbing pliers with a wire brush under running water, brown sludge washing off.`), anim: "the brush scrubs under water" }),
  // ── el grito
  S(5, "", "bi", "b_rustoff", { p: BI(`Extreme close view of brown rust sludge washing off the jaws of pliers under a wire brush, gray steel appearing.`), anim: "the rust washes away" }),
  S(5, "mira cómo sale el óxido", "cl", "c_wow", { p: CLP(`He holds up a pair of pliers dripping with water in a backyard shed, pointing at the clean gray steel, open-mouthed delighted grin, looking at the camera.`) }),
  // ── 0:40 · 3 loops
  S(6, "", "av", ""),
  S(6, "Por qué al otro día se oxida de nuevo", "bi", "b_fuzz", { p: BI(`Extreme close view of fine orange rust fuzz spreading on freshly cleaned wet steel.`), ov: { c: "ClChip", props: { text: "1 · Por qué vuelve", alert: true } } }),
  S(6, "Por qué tiene que ser gel", "bi", "b_gelvsliquid", { p: BI(`Two rusty wrenches propped upright: one with thick beige paste staying on it, the other with plain vinegar running off into a puddle.`), ov: { c: "ClChip", props: { text: "2 · Gel, no vinagre solo" } } }),
  S(6, "cuando el vecino dejó las herramientas en la pileta", "bi", "b_neighborsink", { p: BI(`Wet freshly cleaned tools left piled in a laundry sink at night.`), ov: { c: "ClChip", props: { text: "3 · Lo del vecino", alert: true } } }),
  // ── RECETA
  C(7, "", "ClChapter", { n: 1, title: "La receta entera", sub: "vinagre + harina, y el final" }),
  S(7, "Lo que necesitas", "c", "ClCheck", { props: { title: "Lo que necesitas", items: ["Vinagre blanco de alcohol", "Harina común", "Sal fina (2 cucharadas)", "Film o una bolsa", "Cepillo de alambre", "Bicarbonato + unas gotas de aceite"] } }),
  S(7, "Film de cocina o una bolsa", "bi", "b_kit", { p: BI(`A bottle of white vinegar, a bag of flour, a salt shaker, a roll of cling film, a wire brush, a box of baking soda and a small oil can on ${SHED}.`) }),
  S(8, "", "av", ""),
  S(8, "El vinagre es el que se come el óxido", "c", "ClSplit", { props: { img: I + "b_roles.jpg", left: ["VINAGRE", "se come el óxido"], right: ["HARINA", "lo deja quieto"] } }),
  S(8, "en vez de escurrirse al piso", "bi", "b_runoff", { p: BI(`Plain vinegar running off a rusty wrench and dripping onto a concrete floor.`) }),
  S(9, "", "c", "ClPasteRecipe", { props: { a: 2, b: 1, aLabel: "vinagre", bLabel: "harina", note: "1 taza · ½ taza · + 2 cucharadas de sal" } }),
  S(9, "Para un cajón de herramientas como éste", "bi", "b_toolbox", { q: "old toolbox", p: BI(`An open metal toolbox full of old rusty hand tools on ${SHED}.`) }),
  S(10, "", "bi", "b_oldpot", { q: "old pot stove", p: BI(`An old dented aluminium pot used only for the workshop, with vinegar, flour and salt in it.`) }),
  S(10, "hasta que no quede ningún grumo", "bi", "b_fork", { p: BI(`A fork whisking flour into vinegar in an old pot until smooth.`), anim: "the fork whisks" }),
  S(11, "", "bi", "b_flame", { q: "pot on gas stove low flame", p: BI(`An old pot on a small blue gas flame, a spoon stirring a cloudy liquid.`) }),
  S(11, "Al principio parece agua sucia", "bi", "b_dirtywater", { p: BI(`Top view of a thin cloudy gray liquid in an old pot.`) }),
  S(11, "empieza a espesar", "bi", "b_thickening", { p: BI(`Close view of a spoon dragging through a thickening beige paste in a pot, the trail staying open.`), anim: "the spoon drags a trail" }),
  S(12, "", "bi", "b_paste", { p: BI(`${GEL} in an old pot, glossy and thick.`) }),
  S(12, "como el de pegar papeles de la escuela", "bi", "st_glue", { q: "paper glue school craft", p: BI(`Children's paper crafts with glue.`) }),
  S(12, "se quede ahí y no chorree", "bi", "b_spoonhold", { p: BI(`A spoon held sideways with a lump of thick beige paste staying on it.`) }),
  S(13, "", "bi", "b_lumps", { p: BI(`A fork beating small lumps out of a beige paste in a pot off the heat.`), anim: "the fork beats the lumps" }),
  S(14, "", "bi", "b_degrease", { q: "cleaning wrench rag", p: BI(`A rag wiping grease off a rusty wrench on ${SHED}.`) }),
  S(14, "y la tierra con un cepillo", "bi", "b_dirtbrush", { p: BI(`A small brush sweeping dirt off rusty garden shears.`) }),
  S(15, "", "bi", "b_butter", { p: BI(`${HANDS} spreading a thick layer of beige paste over rusty pliers with an old brush, like butter on bread.`) }),
  S(15, "Las bisagras de la pinza, por los dos lados", "bi", "b_hinge", { p: BI(`Extreme close view of the pivot of rusty pliers covered on both sides with thick beige paste.`) }),
  S(16, "", "bi", "b_wraptight", { p: BI(`${HANDS} wrapping cling film tightly around tools coated in beige paste.`) }),
  S(16, "Si se seca, deja de trabajar", "bi", "b_drycrust", { p: BI(`A cracked dry crust of flour paste on a rusty wrench, flaking.`) }),
  S(17, "", "bi", "st_clock", { q: "clock time", p: BI(`A clock on a wall.`), ov: { c: "ClStampOv", props: { text: "2 A 12 HORAS" } } }),
  S(17, "toda la noche", "bi", "b_overnight", { p: BI(`Film-wrapped tools on a workbench in a dark shed lit by moonlight from a small window.`) }),
  S(18, "", "bi", "b_peek", { p: BI(`A fingertip lifting a corner of cling film off pasted pliers and a fingernail scraping the rust.`) }),
  S(18, "sale blando, como barro", "bi", "b_mud", { p: BI(`Extreme close view of a fingernail pushing soft brown rust sludge off steel.`) }),
  S(19, "", "bi", "b_scrape", { p: BI(`A putty knife scraping brown paste off pliers into an old pot.`) }),
  S(19, "Mira cómo sale", "bi", "b_brushwater", { p: BI(`${HANDS} scrubbing a wrench with a wire brush under a running tap, brown water running off.`) }),
  S(19, "abajo aparece el metal gris", "bi", "b_graysteel", { q: "pliers closeup", p: BI(`Close view of clean gray steel on the jaws of pliers, water beading on it.`) }),
  S(20, "", "bi", "b_bucketsoda", { p: BI(`Baking soda being spooned into a bucket of water.`) }),
  S(20, "Meto las herramientas un par de minutos", "bi", "b_dunk", { p: BI(`Cleaned tools being lowered into a bucket of water with baking soda.`) }),
  S(20, "Eso apaga el vinagre", "c", "ClPins", { props: { img: I + "b_steps.jpg", pins: [{ x: 0.2, y: 0.5, label: "bicarbonato: apaga el ácido" }, { x: 0.5, y: 0.5, label: "calor: saca el agua" }, { x: 0.8, y: 0.5, label: "aceite: la protege" }] } }),
  S(21, "", "bi", "b_ragdry", { q: "drying tools rag", p: BI(`A rag drying a wrench right after the bath.`) }),
  S(21, "El secador de pelo", "bi", "b_hairdryer", { p: BI(`A hair dryer blowing hot air on a pair of pliers on a workbench.`), anim: "hot air blows" }),
  S(21, "Que no quede ni una gota en las bisagras", "bi", "b_dryhinge", { p: BI(`Extreme close view of the dry pivot of clean pliers.`) }),
  S(22, "", "bi", "b_oildrops", { p: BI(`A few drops of oil from a small oil can falling on the pivot of clean pliers.`) }),
  S(22, "lo esparzo con un trapo", "bi", "b_oilrag", { p: BI(`A rag wiping a thin film of oil over a clean steel wrench.`), anim: "the rag wipes the oil" }),
  S(22, "Abro y cierro la pinza diez veces", "cl", "c_pliers", { p: CLP(`He opens and closes a pair of clean oiled pliers in a backyard shed, smiling with satisfaction.`) }),
  // ── el final
  S(23, "", "bi", "b_finalpliers", { q: "pliers on table", p: BI(`${CLEANP} lying open on ${SHED}.`) }),
  S(23, "La misma pinza que no abría", "bi", "b_onefinger", { p: BI(`One finger opening a pair of clean gray pliers.`) }),
  S(24, "", "c", "ClCheck", { props: { title: "Repaso", items: ["Vinagre + harina + sal, en frío", "Al fuego hasta engrudo", "Untar grueso + film", "2 a 12 horas", "Cepillar bajo el agua", "Bicarbonato", "Secar con calor + aceite"] } }),
  // ── LA CUENTA
  C(25, "", "ClChapter", { n: 2, title: "La cuenta", sub: "menos de un dólar" }),
  S(25, "quiero que veas de dónde sale", "av", ""),
  S(26, "", "bi", "st_supermarket", { q: "supermarket aisle bottles", p: BI(`A supermarket aisle.`) }),
  S(26, "Y el film, un par de vueltas del rollo", "bi", "b_filmroll", { p: BI(`A roll of cling film on a kitchen counter, a short piece torn off.`) }),
  S(27, "", "bi", "b_alltools", { q: "hand tools workbench", p: BI(`Cleaned gray pliers, two wrenches, a hand saw, pruning shears and a handful of screws laid out on ${SHED}.`) }),
  S(28, "", "bi", "st_hardware", { q: "hardware store tools", p: BI(`Tools in a hardware store.`) }),
  S(28, "eran de mi viejo", "cl", "c_father", { p: CLP(`He holds an old cleaned hand plane in his hands in a backyard shed, looking at it with quiet affection.`) }),
  // ── CTA 1: el regalo
  S(29, "", "av", ""),
  S(29, "La del cemento que parece granito", "bi", "b_granitetop", { p: BI(`A cement tabletop polished to look exactly like dark speckled granite on a backyard table in the sun.`) }),
  S(29, "la del aflojatodo para la reja", "bi", "b_blackgate", { p: BI(`A front iron gate of vertical bars freshly painted glossy black in front of a small house, sunny.`) }),
  S(29, "la de la silicona con cemento para la grieta", "bi", "b_grayline", { p: BI(`A crack in a cream-colored plastered wall neatly filled flush with a smooth gray putty line.`) }),
  C(30, "", "ClQRCard", { qr: I + "qr.jpg", cover: I + "regalo_phone.jpg", text: "las 10 mezclas con medidas, gratis" }),
  S(30, "Guárdala", "av", ""),
];
