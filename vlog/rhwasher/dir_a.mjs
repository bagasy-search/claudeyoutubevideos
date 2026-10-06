// DIRECTOR A — rhwasher: MINUTO 1 ("your clothes come out smelling like this" + el pliegue abierto con la mugre en el segundo 2 →
// tarjeta-promesa con números desde el 3,6 → ráfaga → 3 loops (techo del cajón, tapita de abajo, el hábito) → Rhonda) + EL ARREGLO + CTA 1.
// Sin clips hablados de agnes; minuto 1 alternando planos blancos con Rhonda y componentes de color.
import { S, BI, RHP, BOTTLE } from "../rhonda/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const LAUNDRY = "a small home laundry room with a white front-loading washing machine and a matching dryer, a shelf with detergent jugs with blank labels, a laundry basket and a small window";
export const SEAL = "the gray rubber door seal of a white front-loading washing machine, the bottom of the seal pulled back to show the fold";
const GUNK = "black slimy mold, gray standing water, lint and hair packed inside the fold";
const I = (n) => `img/rhwasher/${n}.jpg`;
export const SHOTS = [
  // ── 0:00 · la frase + el pliegue abierto
  S(0, "", "av", ""),
  S(0, "smelling like this", "kf", "k_foldopen", { p: BI(`Close view of a yellow-gloved finger pulling back ${SEAL}: ${GUNK}.`), d1: "the gloved finger pulls the rubber seal back", d2: "the black gunk and gray water inside the fold are revealed", sound: "rubber stretching" }),
  // ── el pliegue (3D) + la promesa con números a la vista desde el 3,6
  C(1, "", "RhGasketFold3D", { mode: "fold", labels: { fold: "The fold", water: "Standing water" } }, { ov: { c: "RhPromise", dur: 10, props: { img: I("b_sealclean"), items: ["1 cup in the empty drum", "Hottest cycle", "About 20 minutes", "Towels smell like nothing"] } } }),
  S(1, "", "bi", "b_sealclean", { p: BI(`Close view of the gray rubber door seal of a white front-loading washer, the fold pulled back and completely clean and dry.`), skip: true }),
  S(1, "right here", "rh", "r_pointfold", { p: RHP(`She kneels in front of a white front-loading washing machine in ${LAUNDRY}, pulling back the rubber door seal with one yellow-gloved hand and wrinkling her nose in disgust at the camera.`) }),
  S(1, "and there it is", "bi", "b_flashseal", { p: BI(`A flashlight beam shining into the pulled-back bottom fold of a gray washer door seal in a dim laundry room, black gunk glistening.`), anim: "the flashlight beam moves slowly along the fold; nothing else moves" }),
  S(1, "Black gunk", "bi", "b_gunkmacro", { p: BI(`Extreme close view inside the fold of a washing machine rubber door seal: ${GUNK}.`), anim: "the view creeps slowly along the fold; nothing else moves" }),
  S(1, "gray water", "kf", "k_graywater", { p: BI(`Close view of a yellow-gloved fingertip touching gray murky water sitting in the bottom fold of a washer door seal, a ripple spreading.`), d1: "the fingertip touches the gray water", d2: "a ripple spreads across the dirty water", sound: "a small wet tap" }),
  S(1, "hair, lint", "bi", "b_lint", { q: "lint from washing machine", p: BI("A yellow-gloved hand holding up a clump of gray lint, hair and a hair tie pulled out of a washer door seal."), anim: "the clump dangles and sways slightly; nothing else moves" }),
  S(1, "It's been sitting in that fold", "av", ""),
  S(1, "every load you wash", "bi", "st_washerspin", { q: "washing machine spinning", p: BI("Clothes spinning inside a front-loading washing machine.") }),
  S(1, "right past it", "bi", "b_drumtowels", { q: "towels in washing machine", p: BI("Looking through the glass door of a front-loading washer at white towels tumbling past the gray rubber seal."), anim: "the towels tumble past the seal; nothing else moves" }),
  // ── la promesa hablada
  C(2, "", "RhBottle3D", { title: "3% hydrogen peroxide", sub: "the regular drugstore kind", tag: "$1" }),
  S(2, "one old toothbrush", "bi", "b_toothbrush", { p: BI("An old worn toothbrush lying on top of a white front-loading washing machine next to a folded cloth."), anim: "the light shifts slowly; nothing else moves" }),
  C(2, "and one hot cycle", "RhCycleThermo", { bed: I("b_laundryroom") }),
  S(2, "About twenty minutes", "rh", "r_watchwasher", { p: RHP(`She leans on a white front-loading washer in ${LAUNDRY}, checking her wristwatch with a relaxed smile, the machine running.`) }),
  S(2, "", "bi", "b_laundryroom", { p: BI(`Wide view of ${LAUNDRY}.`), skip: true }),
  S(2, "and your towels come out", "rh", "r_sniff", { p: RHP(`She holds a fresh fluffy white towel up to her face in ${LAUNDRY}, smiling with her eyes closed, smelling it.`) }),
  S(2, "smelling like nothing at all", "bi", "b_freshtowels", { p: BI("A neat stack of fluffy fresh white towels on top of a clean white dryer in soft window light."), anim: "the window light shifts slowly; nothing else moves" }),
  // ── la ráfaga
  S(3, "", "kf", "k_peel", { p: BI(`Close view of yellow-gloved fingers peeling back the bottom of ${SEAL}, gray slime inside.`), d1: "the gloved fingers peel the seal back", d2: "the dirty inside of the fold shows", sound: "rubber stretching" }),
  S(3, "Wipe out the gunk", "kf", "k_wipegunk", { p: BI(`Close view of a yellow-gloved hand wiping black slime out of the fold of a washer door seal with a paper towel.`), d1: "the paper towel wipes into the fold", d2: "the towel comes out black", sound: "a paper towel wiping rubber" }),
  S(3, "Scrub it", "kf", "k_scrubfold", { p: BI(`Close view of an old toothbrush scrubbing inside the fold of a gray washer door seal, white foam on the bristles.`), d1: "the toothbrush scrubs inside the fold", d2: "the black lifts into the foam", sound: "a toothbrush scrubbing rubber" }),
  S(3, "Pull the soap drawer", "kf", "k_drawerpull", { p: BI("Close view of a yellow-gloved hand pulling the detergent drawer all the way out of a white front-loading washer, gunk in the corners."), d1: "the hand pulls the soap drawer out", d2: "the drawer slides free of the machine", sound: "a plastic drawer sliding" }),
  S(3, "Open the little door at the bottom", "kf", "k_filterdoor", { p: BI("Close view of a yellow-gloved finger popping open the small square access panel at the bottom front corner of a white front-loading washer, old towels and a baking pan on the floor."), d1: "the finger pops the little panel", d2: "the panel swings open showing the filter cap", sound: "a plastic panel clicking open" }),
  S(3, "One cup in the drum", "kf", "k_cupdrum", { p: BI(`Close view of a glass measuring cup of clear liquid being poured into the empty stainless steel drum of a front-loading washer.`), d1: "the measuring cup tips at the drum opening", d2: "the clear liquid pours into the drum", sound: "liquid poured into a metal drum" }),
  S(3, "hottest cycle", "bi", "b_dialhot", { p: BI("Close view of a yellow-gloved hand turning the dial of a white washing machine to the hottest sanitize setting."), anim: "the dial turns slowly; nothing else moves" }),
  S(3, "and smell that towel", "rh", "r_sniff2", { p: RHP(`She buries her face in a stack of fresh white towels in ${LAUNDRY}, then laughs at the camera, delighted.`) }),
  // ── 3 loops
  S(4, "", "av", ""),
  C(4, "only one of three places", "RhPins", { img: I("b_washerwide"), pins: [{ x: 0.5, y: 0.62, label: "The fold" }, { x: 0.25, y: 0.13, label: "The soap drawer" }, { x: 0.82, y: 0.92, label: "The little door" }] }),
  S(4, "", "bi", "b_washerwide", { p: BI(`Straight-on view of a white front-loading washing machine in ${LAUNDRY}, the door open, the soap drawer at top left, the small access panel at the bottom right corner.`), skip: true }),
  C(4, "There's a spot inside the soap drawer", "RhDrawerFlashlight", { img: I("b_drawerhole") }),
  S(4, "", "bi", "b_drawerhole", { p: BI("Close view up inside the empty slot of a front-loading washer where the soap drawer goes, the ceiling of the slot covered in black mold and soap gunk."), skip: true }),
  S(4, "where you can't see it", "bi", "b_drawerdark", { p: BI("A dark laundry room, the empty soap drawer slot of a white washer seen as a black opening, a flashlight lying on top of the machine."), anim: "the flashlight switches on; nothing else moves" }),
  S(4, "that's worse than the fold", "bi", "b_gunkdrawer", { p: BI("Close view of a white washer soap drawer pulled half out, its compartments crusted with black mold and gray soap gunk."), anim: "the view creeps slowly over the gunk; nothing else moves" }),
  S(4, "There's a little door at the bottom", "bi", "b_filterpanel", { p: BI("Close view of the bottom front corner of a white front-loading washing machine with its small square access panel, on a laundry room floor."), anim: "a light glints slowly on the panel; nothing else moves" }),
  S(4, "most people don't even know", "rh", "r_surprise", { p: RHP(`She crouches at the bottom of a white front-loading washer pointing at the small access panel, eyebrows raised in surprise at the camera.`) }),
  S(4, "And there's one habit", "av", ""),
  S(4, "that takes two seconds", "bi", "b_doorajar", { p: BI("A white front-loading washer in a tidy laundry room with its round door left open just a few inches."), anim: "the door sways a tiny bit; nothing else moves" }),
  C(4, "keeps all of it from ever coming back", "RhDoorCrack", {}),
  // ── quién soy
  S(5, "", "av", "", { ov: { c: "RhNameTag", props: { name: "Rhonda", sub: "34 years cleaning other people's houses" } } }),
  S(5, "houses in Ohio", "bi", "st_ohio4", { q: "ohio town houses", p: BI("A small Ohio town street with houses.") }),
  S(5, "and I've opened more stinky washers", "rh", "r_nose", { p: RHP(`She kneels at an open front-loading washer in a client's laundry room pinching her nose with one yellow-gloved hand, half laughing.`) }),
  S(5, "So let me show you", "av", ""),
  // ── 1:09 · EL ARREGLO
  C(6, "", "RhChapter", { n: 1, title: "The whole fix", sub: "start to finish" }),
  S(6, "Gloves on", "bi", "st_gloves", { q: "yellow rubber gloves", p: BI("Hands putting on yellow rubber gloves.") }),
  S(6, "Grab the brown bottle", "rh", "r_supplies", { p: RHP(`She stands at a white front-loading washer with ${BOTTLE}, an old toothbrush, a cloth, two old towels and a shallow baking pan laid out on top of the machine.`) }),
  S(6, "a shallow baking pan", "bi", "b_pan", { q: "baking pan", p: BI("A shallow metal baking pan and old towels on a laundry room floor.") }),
  S(7, "", "av", ""),
  S(7, "pull it back toward you", "kf", "k_pullseal", { p: BI(`Close view of yellow-gloved fingers pulling back the top of a gray washer door seal and working around it.`), d1: "the fingers pull the seal back", d2: "the fingers move around the ring", sound: "rubber squeaking" }),
  S(7, "Look especially at the bottom", "bi", "b_bottomfold", { p: BI(`Close view of the bottom of a gray washer door seal pulled back, with ${GUNK}.`), anim: "the camera creeps slowly into the fold; nothing else moves" }),
  S(8, "", "rh", "r_smelltest", { p: RHP(`She holds up a paper towel she just wiped inside a washer seal, smelling it at arm's length with a disgusted face.`) }),
  S(8, "If it smells like a wet dog", "bi", "st_wetdog", { q: "wet dog", p: BI("A wet dog shaking off water.") }),
  S(9, "", "kf", "k_wipeout", { p: BI(`Close view of a yellow-gloved hand pulling a wad of gray lint, hair and a small sock out of the fold of a washer seal with a paper towel.`), d1: "the hand reaches into the fold", d2: "a wad of lint and a small sock come out", sound: "a wet wad pulled out" }),
  S(9, "little socks, coins", "bi", "b_coins", { p: BI("A small pile of coins, a hair tie and a tiny sock on a paper towel on top of a white washing machine."), anim: "the light shifts slowly; nothing else moves" }),
  S(9, "or you're just smearing it around", "av", ""),
  S(10, "", "kf", "k_sprayfold", { p: BI(`Close view of ${BOTTLE} with a white trigger sprayer spraying into the fold of a gray washer door seal.`), d1: "the sprayer mists into the fold", d2: "the fold turns wet and shiny", sound: "two squirts of a trigger spray" }),
  C(10, "take the toothbrush and scrub inside the fold", "RhGasketFold3D", { mode: "clean", labels: { fold: "Spray, scrub, wipe" } }),
  S(10, "Wipe it with the cloth", "bi", "b_wipecloth", { p: BI(`A yellow-gloved hand wiping the inside of a gray washer door seal clean with a white cloth.`), anim: "the cloth wipes along the seal; nothing else moves" }),
  S(11, "", "av", ""),
  S(11, "and don't scrub so hard you stretch it", "bi", "b_tornseal", { p: BI("Close view of a small tear in the bottom of a gray washer door seal, a drop of water at its edge."), anim: "a drop of water forms at the tear; nothing else moves" }),
  S(11, "a tear in it means a leak", "bi", "st_leakfloor", { q: "water puddle floor", p: BI("A puddle of water on a laundry room floor.") }),
  S(12, "", "kf", "k_cupdrum2", { p: BI("Close view of a glass measuring cup tipping clear liquid into an empty stainless steel washer drum, no clothes inside."), d1: "the cup tips over the drum", d2: "the liquid splashes into the empty drum", sound: "liquid poured into a metal drum" }),
  C(12, "Pick the hottest cycle", "RhCycleThermo", { bed: I("b_laundryroom") }),
  S(12, "and let it run", "bi", "st_washerrun", { q: "front load washer running", p: BI("A front-loading washer running.") }),
  C(13, "", "RhCheck", { title: "The main fix", items: ["Peel back the fold", "Wipe out the gunk", "Spray, toothbrush, wipe", "1 cup, empty drum", "Hottest cycle"] }),
  // ── el antes y después real (2:46)
  C(14, "", "RhWipeReveal", { before: I("b_sealbefore"), after: I("b_sealclean"), lb: "Before", la: "After", squeegee: true }),
  S(14, "", "bi", "b_sealbefore", { p: BI(`Close view of the gray rubber door seal of a white front-loading washer, the fold pulled back, ${GUNK}.`), skip: true }),
  S(14, "And the towels from the next load", "rh", "r_towels", { p: RHP(`She folds a stack of fresh white towels on top of a clean white washing machine, smiling at the camera.`) }),
  // ── CTA 1
  C(15, "", "RhBookPage", { page: I("book_p13"), stamp: "Page 13 · Rhonda's book" }),
  C(15, "and Fix number one is free on the page", "RhQRCard", { qr: I("qr"), cover: I("book_cover") }),
];
