// DIRECTOR A — cllavadora: MINUTO 1 (Claudio a cámara + el dedo que tira de la goma y el pliegue negro en el seg 1 → "huelen a
// sótano" → PROMESA con antes/después de la goma → números (1 taza, ciclo caliente, 3 lugares) → el sótano del hotel, 6 lavadoras,
// 400 toallas → ráfaga del arreglo → "¡A nada!" → 3 loops (por qué las toallas, el error del jabón, el anillo en el filtro) →
// capítulo) + EL ARREGLO ENTERO (goma, cajón, filtro, ciclo) + CTA 1 página 11 (párrafos 0-19).
import { S, BI, CLP } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const G = "a hand in a blue nitrile glove";
const I = "img/cllavadora/";
export const SEAL = "the gray rubber door seal of a white front-loading washing machine";
export const FOLD = "the deep fold at the bottom of the gray rubber door seal of a white front-loading washing machine, packed with black slimy mold spots, gray gunk, lint and hairs";
export const LAUNDRY = "a hotel basement laundry room with a row of big white front-loading washing machines, white-painted cinder block walls, a stainless steel folding table with stacks of white towels, laundry carts and fluorescent ceiling light";
export const BOTTLE = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
export const SHOTS = [
  // ── 0:00 · Claudio a cámara → el dedo tira de la goma y aparece el pliegue negro
  S(0, "", "av", ""),
  S(0, "Ahí", "kf", "k_peel", { p: BI(`Close view of ${G} hooking one finger under ${SEAL} and pulling the bottom lip of the seal back toward the camera, revealing ${FOLD}.`), d1: "the gloved finger hooks under the lip of the rubber seal", d2: "the finger pulls the lip back and the black moldy fold appears", sound: "a soft rubbery stretch" }),
  S(0, "Eso negro", "bi", "b_foldmacro", { p: BI(`Extreme close view of ${FOLD}, wet and glistening, a few drops of gray water in the bottom of the fold.`), anim: "the camera pushes in very slowly toward the black fold", ov: { c: "ClStampOv", props: { text: "ESTÁ VIVO" } } }),
  S(0, "sus toallas", "bi", "st_towelstack", { q: "folded white towels stack", p: BI("A stack of folded white bath towels on a shelf.") }),
  // ── huelen a sótano
  S(1, "", "bi", "st_sniff", { q: "smelling towel bad smell", p: BI("A woman lifting a freshly washed towel to her nose and wrinkling her nose in disgust.") }),
  S(1, "huelen a sótano", "bi", "b_basement", { p: BI("A damp dim basement corner with a concrete wall stained by moisture, an old cardboard box and a mop bucket, a bare light bulb.") }),
  // ── 0:05 · LA PROMESA con el antes/después
  C(2, "", "ClBeforeAfter", { before: I + "b_sealdirty.jpg", after: I + "b_sealclean_ab.jpg", note: "una tarde" }),
  S(2, "Una taza del frasco marrón", "bi", "b_cuppour", { p: BI(`${G} pouring a glass measuring cup of clear liquid straight into the empty stainless steel drum of a white front-loading washing machine through the open door, ${BOTTLE} on top of the machine.`), anim: "the clear liquid keeps pouring into the drum" }),
  S(2, "el ciclo más caliente", "bi", "b_dialhot", { p: BI(`Close view of ${G} turning the program dial of a white washing machine to the hottest setting, the small display lit, the panel buttons with blank icons.`) }),
  S(2, "tres lugares que nadie limpia", "bi", "b_threespots", { p: BI("A white front-loading washing machine seen from the front in a laundry room with its round door open, its detergent drawer pulled out at the top left and the small filter access panel at the bottom left flipped open.") }),
  S(2, "Así estaba", "cl", "c_before", { p: CLP(`He kneels in front of a white front-loading washing machine in ${LAUNDRY}, pulling back the rubber door seal with one gloved finger to show the black moldy fold, his face screwed up in disgust, looking at the camera.`), ov: { c: "ClChip", props: { text: "Antes", alert: true } } }),
  S(2, "Así quedó", "cl", "c_after", { p: CLP(`He kneels in front of the same white front-loading washing machine in ${LAUNDRY}, pulling back the rubber door seal to show the fold now clean and gray, grinning and giving a thumbs-up to the camera.`), ov: { c: "ClChip", props: { text: "Después" } } }),
  // ── 0:14 · el hotel, el sótano, 6 lavadoras, 400 toallas
  S(3, "", "cl", "c_basement", { p: CLP(`He walks down the concrete stairs into ${LAUNDRY}, carrying a toolbox, glancing at the camera.`), anim: "he keeps walking slowly down the last steps", ov: { c: "ClNameTag", props: { name: "Claudio", sub: "30 años de conserje de hotel" } } }),
  S(3, "Seis lavadoras grandes", "bi", "st_laundromat", { q: "row of washing machines laundromat", p: BI("A row of front-loading washing machines in a laundry room.") }),
  S(3, "trabajando todo el día", "bi", "st_drumspin", { q: "washing machine drum spinning clothes", p: BI("Clothes tumbling inside a washing machine drum seen through the round glass door.") }),
  S(3, "el olor a perro mojado", "bi", "st_wetdog", { q: "wet dog shaking", p: BI("A wet dog standing in a backyard after a bath.") }),
  S(3, "cuatrocientas toallas nuevas", "bi", "b_towelpile", { p: BI(`A huge pile of white hotel towels heaped on a stainless steel folding table and spilling out of two laundry carts in ${LAUNDRY}.`) }),
  // ── 0:25 · la ráfaga
  S(4, "", "av", ""),
  S(4, "Tiro de la goma", "bi", "b_peel2", { p: BI(`${G} pulling back ${SEAL} all the way around, the black moldy fold showing under it.`), anim: "the gloved fingers pull the rubber lip further back" }),
  S(4, "Rocío adentro del pliegue", "kf", "k_spray", { p: BI(`Close view of ${G} holding ${BOTTLE} fitted with a white trigger sprayer, spraying into the open fold of ${SEAL} while the other gloved hand holds the lip back.`), d1: "the sprayer points into the open rubber fold", d2: "a fine mist hits the black fold and it turns wet and starts to foam", sound: "two quick squirts of a trigger spray bottle" }),
  S(4, "Un cepillo de dientes viejo", "bi", "b_toothbrushfold", { p: BI(`Extreme close view of an old toothbrush held by ${G} scrubbing inside the wet fold of ${SEAL}, white foam lifting the black gunk.`), anim: "the toothbrush scrubs back and forth in the fold" }),
  S(4, "El cajón del jabón", "bi", "b_drawerout", { p: BI(`${G} pulling the detergent drawer all the way out of a white front-loading washing machine, the drawer compartments crusted with gray detergent sludge and black spots.`) }),
  S(4, "al agua caliente", "bi", "b_drawersoak", { p: BI("A plastic washing machine detergent drawer soaking in a sink full of steaming hot water, gray sludge floating off it.") , anim: "steam rises slowly from the hot water" }),
  S(4, "El filtro de abajo", "kf", "k_filter", { p: BI(`Low close view at the bottom front of a white front-loading washing machine: ${G} unscrewing the round filter cap behind the small open access panel, a shallow metal baking tray on the floor below, old towels around it.`), d1: "the gloved hand grips the round filter cap", d2: "the cap turns out and gray water runs into the tray", sound: "a plastic cap turning and water trickling into a metal tray" }),
  S(4, "Una taza en el tambor vacío", "bi", "b_cuppour2", { p: BI(`Looking into the empty stainless steel drum of a front-loading washing machine through the open door as clear liquid splashes in from a glass measuring cup held by ${G}.`) }),
  S(4, "el ciclo más caliente", "bi", "st_washerstart", { q: "pressing washing machine start button", p: BI("A finger pressing the start button on a washing machine panel.") }),
  S(5, "", "cl", "c_sniff", { p: CLP(`He kneels in front of a white front-loading washing machine in ${LAUNDRY}, holding a clean white towel up to his nose with both gloved hands, eyes closed, a big satisfied smile.`) }),
  // ── 0:42 · los 3 loops
  S(6, "", "av", ""),
  S(6, "Por qué huelen justo las toallas", "bi", "b_towelhang", { p: BI("Freshly washed white towels hanging on a drying rack in a small laundry room, a woman's hand sniffing the corner of one, a front-loading washing machine behind.") }),
  C(6, "El error con el jabón", "ClDoseCap", {}),
  S(6, "Y lo que encontré un día", "bi", "b_filterglint", { p: BI("Extreme close view of a washing machine pump filter just pulled out, wrapped in gray lint and a hair tie, a small gold ring glinting caught in the lint, drops of water.") }),
  S(6, "que hizo llorar a una huésped", "bi", "b_guestcry", { p: BI("A woman in her sixties at a hotel reception desk covering her mouth with one hand, tears in her eyes, a receptionist in a navy blazer across the desk.") }),
  C(6, "Primero el arreglo entero", "ClChapter", { n: 1, title: "El arreglo entero", sub: "una tarde, tres lugares" }),
  // ── 1:02 · la cadena con los videos del inodoro
  S(7, "", "av", ""),
  C(7, "Si vio mis videos del inodoro", "ClVideoRef", { thumb: I + "th_clsarro.jpg", title: "El sarro del inodoro" }),
  S(7, "Estaba en el sótano", "bi", "b_stairsdown", { p: BI("Concrete stairs leading down into a hotel basement laundry room, the sound of machines implied by a glimpse of a row of washers at the bottom, fluorescent light.") }),
  // ── lo que necesita
  C(8, "", "ClCheck", { title: "Lo que necesita", items: ["Agua oxigenada 3 %", "Un trapo", "Cepillo de dientes viejo", "Toallas viejas y bandeja", "Guantes"] }),
  // ── la goma
  C(9, "", "ClChapter", { n: 1, label: "LUGAR", title: "La goma", sub: "y su pliegue" }),
  S(9, "abra la puerta", "bi", "st_washeropen", { q: "opening washing machine door", p: BI("A hand opening the round door of a front-loading washing machine.") }),
  C(9, "y tire de la goma hacia usted", "ClWasher3D", { mode: "peel", labels: { a: "El pliegue" } }),
  S(9, "Ahí está", "bi", "b_foldside", { p: BI(`Close side view of ${FOLD}, the lip of the seal held back by a gloved thumb.`) }),
  // sacar lo que se ve
  S(10, "", "bi", "b_lintout", { p: BI(`${G} pulling a clump of gray lint, hair and a coin out of the fold of ${SEAL} with a folded paper towel.`), anim: "the gloved hand pulls the clump out slowly" }),
  S(10, "nada de tirar al tambor", "bi", "b_papertowel", { p: BI(`A crumpled paper towel full of gray lint, hair and black gunk held in ${G} over a small trash can beside a washing machine.`) }),
  // rociar, cepillo, espuma, 10 minutos
  S(11, "", "bi", "st_sprayseal", { q: "spraying washing machine rubber seal", p: BI("Spraying cleaner on the rubber door seal of a washing machine.") }),
  C(11, "y frote con el cepillo de dientes", "ClWasher3D", { mode: "spray", labels: { a: "Rocío adentro", b: "Hace espuma" } }),
  S(11, "Ésa es la mugre que se suelta", "bi", "b_foamfold", { p: BI(`Extreme close view of white foam bubbling up out of the black gunk in the fold of ${SEAL}, the foam turning gray as it lifts the dirt.`), anim: "the foam bubbles grow slowly" }),
  C(11, "Déjela diez minutos", "ClTimer30", { minutes: 10, fast: true }),
  S(11, "páselo con el trapo húmedo", "bi", "b_wipefold", { p: BI(`${G} wiping the fold of ${SEAL} with a damp white cloth, the rubber now clean gray behind the cloth.`), anim: "the cloth wipes along the fold" }),
  // el cajón
  C(12, "", "ClChapter", { n: 2, label: "LUGAR", title: "El cajón del jabón", sub: "y el hueco de atrás" }),
  S(12, "apretando una traba", "bi", "b_drawertab", { p: BI(`Close view of ${G} pressing the small release tab inside the detergent drawer of a white washing machine while pulling the drawer out.`) }),
  S(12, "mire atrás donde estaba metido", "bi", "b_drawercavity", { p: BI("Looking into the empty slot of a washing machine detergent drawer with a flashlight: the inside walls and ceiling of the cavity crusted with black mold and gray soap sludge.") , anim: "the flashlight beam moves slowly inside the dark slot" }),
  S(12, "Ponga el cajón quince minutos", "bi", "b_drawersoak2", { p: BI(`A detergent drawer submerged in a laundry sink of hot water, ${G} scrubbing a compartment with an old toothbrush.`), anim: "the toothbrush scrubs in the water" }),
  S(12, "y a ese hueco de atrás", "bi", "b_cavityspray", { p: BI(`${G} spraying from ${BOTTLE} into the empty slot of a washing machine detergent drawer.`) }),
  // el filtro
  C(13, "", "ClChapter", { n: 3, label: "LUGAR", title: "El filtro", sub: "el que nadie conoce" }),
  S(13, "hay una tapita", "bi", "b_filterpanel", { p: BI("Low close view of the bottom front corner of a white front-loading washing machine with the small square filter access panel, a gloved fingertip prying it open.") }),
  C(13, "Ahí atrás está el filtro de la bomba", "ClWasher3D", { mode: "filter", labels: { a: "El filtro", b: "La bandeja" } }),
  S(14, "", "bi", "b_trayfloor", { p: BI("Old towels spread on a laundry room floor in front of a washing machine with a shallow metal baking tray placed under the open filter panel.") }),
  S(14, "una manguerita al lado", "bi", "b_drainhose", { p: BI(`${G} pulling a small black emergency drain hose out next to the filter of a washing machine and unplugging its end over a shallow tray, gray water running out.`), anim: "the gray water keeps running into the tray" }),
  S(14, "afloje el filtro despacito", "bi", "b_filterturn", { p: BI(`${G} slowly turning the round filter cap of a washing machine counterclockwise, a little gray water seeping around it into a tray.`) }),
  S(15, "", "bi", "b_filterbrush", { p: BI(`A washing machine pump filter held in ${G} under a running laundry sink faucet, being scrubbed clean of gray lint with an old toothbrush.`), anim: "the toothbrush scrubs the filter under the water" }),
  S(15, "vuelva a ponerlo bien apretado", "bi", "b_filtertight", { p: BI(`${G} screwing a clean filter cap firmly back into a white washing machine, turning it clockwise.`) }),
  S(15, "le moja el piso", "bi", "b_wetfloor", { p: BI("A puddle of water spreading on a laundry room tile floor from under the bottom front of a white washing machine.") }),
  // el ciclo
  S(16, "", "av", ""),
  C(16, "una taza de agua oxigenada", "ClWasher3D", { mode: "cycle", temp: "El más caliente" }),
  S(16, "Que dé la vuelta entera", "bi", "st_washerrun", { q: "washing machine running water", p: BI("A front-loading washing machine running, water sloshing behind the round glass door.") }),
  // mientras
  S(17, "", "bi", "b_glasswipe", { p: BI(`${G} wiping the inside of the round glass door of a front-loading washing machine with a cloth, the glass becoming clear.`), anim: "the cloth wipes the glass slowly" }),
  S(17, "abra la puerta y huela", "cl", "c_sniffdrum", { p: CLP(`He leans in toward the open door of a white front-loading washing machine in ${LAUNDRY}, sniffing the drum carefully with his eyes half closed, one gloved hand on the door.`) }),
  S(17, "Si todavía huele", "av", ""),
  // repaso
  C(18, "", "ClCheck", { title: "El arreglo entero", items: ["La goma y su pliegue", "El cajón y su hueco", "El filtro de abajo", "1 taza, ciclo caliente"], fast: true }),
  // CTA 1
  S(19, "", "av", ""),
  C(19, "en la página once", "ClBookPage", { page: I + "book_p11.jpg", pageNo: 11, qr: I + "qr.jpg", stamp: "Gratis en la página" }),
  C(19, "Apunte el celular", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "la página 11 entera, gratis" }),
];
