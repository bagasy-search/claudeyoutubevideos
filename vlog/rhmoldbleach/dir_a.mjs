// DIRECTOR A — rhmoldbleach: MINUTO 1 (tráiler: "Bleach did not kill this mold" → mismo rincón día 1 / día 9 → promesa con números
// → ráfaga del arreglo → antes/después con escurridor → 3 loops abiertos → Rhonda) + EL ARREGLO COMPLETO (antes de 2:30) + CTA 1 (p0-14).
//   kf = detalle agnes 2.5-flash desde foto base (foley nativo) · vl = Rhonda hablando con SU voz (agnes 2.5, ancla) · rh = foto con Rhonda
//   bi = foto gpt (stock real si q; anim = movimiento agnes v2.0) · c = componente Rh* · av = avatar
import { S, BI, RHP, WHO, BOTTLE } from "../rhonda/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const SHOWER = "a small white bathroom with a white tub and shower combo, white subway tile walls with light gray grout lines, a white silicone caulk bead along the tub edge, a chrome shower head, a clear shower curtain liner pushed to one side, a small window with a white café curtain";
export const CORNER = "the inside bottom corner of a white tub and shower combo where two white subway tile walls meet the tub edge, light gray grout lines and a white silicone caulk bead along the joint";
const DOTS = "clusters of small black mold dots spotting the grout lines and the caulk bead";
const I = (n) => `img/rhmoldbleach/${n}.jpg`;
export const SHOTS = [
  // ── 0:00 · la frase más fuerte, a cámara
  S(0, "", "vl", "m1", { a: `stands in ${SHOWER}, one yellow-gloved hand holding a plain white plastic jug with a blank label, the other pointing down at the tub corner, her lips pressed in annoyance.`, act: "She points at the corner and says it flatly to the camera, annoyed, giving the white jug a little shake; then her face turns to disgust as she says day nine.", b: "she lowers the white jug and looks at the camera with a tight, annoyed little smile, mouth closed." }),
  // ── el mismo rincón: día 1 blanco / día 9 negro (en el segundo 2)
  C(0, "It just hid it", "RhMoldCalendar", { mode: "split", a: I("b_day1"), b: I("b_day9"), la: "Day 1", lb: "Day 9" }),
  S(1, "Day one", "bi", "b_day1", { p: BI(`Close view of ${CORNER}: everything bright white and wet, the grout spotless, a plain white bleach jug with a blank label standing on the tub edge, a few drops on the tile.`), anim: "a single drop of water runs slowly down the white tile; nothing else moves" }),
  S(1, "white as a wedding dress", "kf", "k_whitewipe", { p: BI(`Close view of a yellow-gloved hand wiping ${CORNER} with a folded white cloth: the grout and caulk look bright white.`), d1: "the gloved hand wipes along the white grout line", d2: "the cloth lifts away and the corner shines white", sound: "a soft cloth wiping wet tile" }),
  S(1, "Day nine", "vl", "m1"),
  S(1, "the same black dots", "bi", "b_day9", { p: BI(`Close view of exactly the same ${CORNER}, nine days later: ${DOTS}, worst in the bottom row, the same plain white bleach jug on the tub edge.`), anim: "the black dots seem to spread very slightly along the grout line; nothing else moves" }),
  S(1, "in the very same spots", "kf", "k_dots", { p: BI(`Extreme close view of one grout line between white subway tiles: ${DOTS}, tiny fuzzy black specks sunk into the gray grout, a yellow-gloved fingertip pointing at them from the edge of the frame.`), d1: "the gloved fingertip points at the black dots", d2: "the finger traces slowly along the dotted grout line", sound: "a faint drip of water in a quiet bathroom" }),
  // ── la promesa con números
  S(2, "", "kf", "k_bottle", { p: BI(`Close view on the white tub edge in ${SHOWER}: a yellow-gloved hand sets down ${BOTTLE} with a white trigger sprayer, the dotted grout corner behind it.`), d1: "the gloved hand sets the brown bottle down on the tub edge", d2: "the hand lets go and the bottle stands there", sound: "a plastic bottle set down on porcelain" }),
  S(2, "about a dollar", "rh", "r_dollar", { p: RHP(`She stands in ${SHOWER} holding ${BOTTLE} up beside her face with one yellow-gloved hand and a crumpled one dollar bill in the other, eyebrows raised, a small told-you-so smile.`) }),
  C(2, "Fifteen minutes on the grout", "RhTimer30", { minutes: 15, fast: true, label: "Hands off" }),
  S(2, "And when I'm done", "bi", "b_whiteafter", { p: BI(`Close view of ${CORNER}, clean, dry and bright white, the grout lines even and light gray, a folded towel on the tub edge and ${BOTTLE} beside it.`), anim: "a soft daylight shimmer moves slowly across the dry white tile; nothing else moves" }),
  C(2, "not for nine days", "RhMoldCalendar", { mode: "months", img: I("b_whiteafter") }),
  // ── la ráfaga del arreglo
  S(3, "", "kf", "k_rinse", { p: BI(`Close view of ${CORNER} with ${DOTS}; a handheld chrome shower head held by a yellow-gloved hand sprays clear water onto the corner.`), d1: "the shower head sprays water onto the dotted corner", d2: "water sheets down the tile and runs along the caulk", sound: "a handheld shower spraying water on tile" }),
  S(3, "full strength until", "kf", "k_spray", { p: BI(`Close view of ${CORNER} with ${DOTS}, wet: a yellow-gloved hand aims ${BOTTLE} with a white trigger sprayer at the grout line.`), d1: "the trigger sprayer points at the dotted grout", d2: "a fine mist hits the grout and it turns dark and wet", sound: "three quick squirts of a trigger spray bottle" }),
  S(3, "Watch it fizz", "kf", "k_fizz", { p: BI(`Extreme close view of one wet grout line between white subway tiles with ${DOTS}: tiny white bubbles foaming up out of the black specks.`), d1: "tiny white bubbles start to foam up out of the black dots", d2: "the foam grows along the grout line and turns white", sound: "a soft continuous fizzing and popping of tiny bubbles" }),
  C(3, "down in the lines", "RhGroutPore3D", { mode: "peroxide", short: true }),
  S(3, "Fifteen minutes", "bi", "b_eggtimer", { q: "kitchen timer", p: BI(`Close view of a small round white wind-up kitchen egg timer with a red dial standing on the white edge of a bathtub, right in front of a tiled shower corner covered in white foam; the timer fills a third of the frame.`), anim: "the timer dial turns very slowly; nothing else moves" }),
  S(3, "a little brush", "kf", "k_brush", { p: BI(`Close view of a yellow-gloved hand scrubbing a foamy grout line in ${CORNER} with an old toothbrush in small circles, white foam on the bristles.`), d1: "the toothbrush scrubs the foamy grout in small circles", d2: "the black lifts out into the white foam", sound: "a toothbrush scrubbing wet grout" }),
  S(3, "a rinse", "bi", "st_rinse", { q: "rinsing shower wall water", p: BI("Water from a handheld shower head rinsing white bathroom wall tiles, water running down the grout lines.") }),
  C(3, "and look at that grout", "RhWipeReveal", { before: I("b_day9"), after: I("b_whiteafter"), lb: "Before", la: "After" }),
  // ── 3 loops abiertos
  S(4, "But stay with me", "vl", "m2", { a: `leans in close toward the camera in ${SHOWER}, holding ${BOTTLE} near her chest, eyes narrowed like she is about to tell a secret.`, act: "She leans in close to the camera and says it quietly, like a secret, tapping the brown bottle with one gloved finger.", b: "she is still leaning in close with the brown bottle at her chest, eyebrows raised, mouth closed, a knowing look." }),
  S(4, "one mistake almost everybody makes", "bi", "b_halfwater", { p: BI(`A clear plastic spray bottle under a running bathroom sink faucet being filled with tap water, ${BOTTLE} lying open on the counter beside it.`), anim: "the tap water keeps pouring into the clear spray bottle; nothing else moves" }),
  S(4, "with this bottle", "vl", "m2"),
  S(4, "that makes it do nothing at all", "bi", "b_nofizz", { p: BI(`Close view of a wet grout line with ${DOTS}, sprayed but completely flat: no bubbles at all, the black dots unchanged.`), anim: "one drop of liquid slowly runs down over the black dots; nothing else moves" }),
  S(4, "There's a five second test", "kf", "k_swab", { p: BI(`Extreme close view of a yellow-gloved hand pressing a white cotton swab onto a black mold spot in a grout line between white tiles.`), d1: "the cotton swab presses on the black spot", d2: "the swab lifts away and the hand turns it to look at the tip", sound: "a tiny soft tap on tile" }),
  C(4, "tells you if the mold", "RhSwabTest", { mode: "tease" }),
  S(4, "And there's the thirty seconds", "kf", "k_squeegee", { p: BI(`Close view of a yellow-gloved hand pulling a rubber squeegee down a wet white subway tile wall in ${SHOWER}, water streaming ahead of the blade.`), d1: "the squeegee blade pulls down the wet tile", d2: "the tile behind the blade is left clean and dry", sound: "a rubber squeegee squeaking down wet tile" }),
  S(4, "after every shower", "bi", "st_shower", { q: "shower head water running", q2: "shower water stream", p: BI("Water pouring from a chrome shower head in an ordinary home bathroom.") }),
  S(4, "so I haven't seen a black dot", "rh", "r_ownbath", { p: RHP(`She stands with her arms crossed beside a spotless white tub and shower in her own small cozy bathroom with a seashell soap dish and a yellow towel, proud and smiling.`) }),
  C(4, "in eleven years", "RhFogMirror", { img: I("b_fogmirror"), lines: ["11 years", "not one dot"] }),
  // ── quién soy
  S(5, "", "av", "", { ov: { c: "RhNameTag", props: { name: "Rhonda", sub: "34 years cleaning other people's houses" } } }),
  S(5, "houses in Ohio", "bi", "st_ohiohouses", { q: "suburban houses street autumn", p: BI("A quiet small-town Ohio street in the fall: two-story wooden houses with porches, maple trees, a parked car.") }),
  S(5, "for thirty four years", "rh", "r_caddy2", { p: RHP(`She walks up the front steps of a white two-story Ohio house with a porch, carrying her gray cleaning caddy full of brushes and spray bottles, autumn leaves on the steps.`) }),
  S(5, "I must have bleached", "bi", "b_bleachjugs", { p: BI("The open cabinet under a bathroom sink packed with a row of plain white bleach jugs with blank labels, a pair of yellow rubber gloves draped over one."), anim: "the cabinet door swings open a little wider; nothing else moves" }),
  S(5, "before I figured this out", "vl", "m3", { a: `stands in ${SHOWER} tugging the cuff of one yellow rubber glove tight over her wrist, a let's-get-to-work grin.`, act: "She snaps the glove cuff tight and talks to the camera, nodding toward the shower corner, warm and direct.", b: "she stands with both yellow-gloved hands on her hips by the tub, smiling at the camera, ready to work." }),
  // ── 0:56 · EL ARREGLO
  C(6, "", "RhChapter", { n: 1, title: "The whole fix", sub: "start to finish" }),
  S(6, "Gloves on", "bi", "st_gloves", { q: "putting on yellow rubber gloves", p: BI("Two hands pulling on bright yellow rubber cleaning gloves in a bathroom.") }),
  S(6, "turn on the fan", "bi", "b_fanswitch", { q: "bathroom light switch", p: BI(`A yellow-gloved finger flipping up a white wall switch next to the bathroom door, a ceiling exhaust fan grille visible above.`), anim: "the finger flips the switch up; nothing else moves" }),
  S(6, "crack a window", "bi", "st_window2", { q: "opening bathroom window", p: BI("A hand opening a small bathroom window a few inches, daylight coming in.") }),
  S(6, "Grab the brown bottle", "rh", "r_grab", { p: RHP(`She reaches into a gray cleaning caddy on the bathroom floor and lifts out ${BOTTLE}.`) }),
  C(6, "Plain three percent", "RhBottle3D", { title: "3% hydrogen peroxide", sub: "the regular drugstore kind", tag: "$1" }),
  S(6, "Screw a spray nozzle", "bi", "b_nozzle", { q: "spray bottle nozzle", p: BI(`Close view of yellow-gloved hands screwing a white trigger spray nozzle straight onto the neck of ${BOTTLE} over a white bathroom counter.`), anim: "the hands twist the sprayer onto the bottle; nothing else moves" }),
  S(6, "where the light can't get to it", "bi", "b_brownlight", { p: BI(`${BOTTLE} with a white trigger sprayer standing on a sunny bathroom windowsill, the sunlight hitting the brown plastic.`), anim: "the sunlight shimmers slowly over the brown bottle; nothing else moves" }),
  S(7, "", "av", ""),
  S(7, "rinse the corner with plain water", "bi", "st_rinse2", { q: "rinsing bathtub with shower head", q2: "rinsing bathtub", p: BI(`A handheld shower head rinsing the corner of a white bathtub with water.`) }),
  S(7, "You're just washing off the soap film", "bi", "b_soapfilm", { p: BI(`Extreme close view of one gray grout line between two white subway tiles, filmed straight on: a dull cloudy white soap scum film coats the tiles and the grout, a few small black mold dots show through it, water drops sliding down. Nothing else in the frame.`), anim: "water drops slide slowly down over the soap film; nothing else moves" }),
  S(8, "", "rh", "r_spray", { p: RHP(`She kneels on a bath mat beside the tub and sprays ${BOTTLE} with a trigger sprayer right into the bottom corner of the shower where the grout has black dots.`) }),
  S(8, "Do not water it down", "c", "RhDoDont", { props: { yes: { label: "Straight from the bottle", img: I("b_fullbottle") }, no: { label: "Half and half with water", img: I("b_halfwater") } } }),
  S(8, "", "bi", "b_fullbottle", { p: BI(`${BOTTLE} with a white trigger sprayer held by a yellow-gloved hand, nothing added, in front of a white tile wall.`), skip: true }),
  S(8, "until it's running a little", "bi", "b_soaking", { p: BI(`Close view of ${CORNER} with ${DOTS}, soaking wet with clear liquid, a thin trickle running down the tile onto the tub.`), anim: "a thin trickle runs down the tile into the tub; nothing else moves" }),
  C(8, "On a shower corner", "RhMeasureCup", { fill: 0.25, label: "¼ cup", where: "on one shower corner" }),
  S(9, "", "av", ""),
  C(9, "Fifteen minutes, ten at the very least", "RhTimer30", { minutes: 15, label: "Don't scrub yet" }),
  S(9, "You'll see it start to fizz", "bi", "st_fizz", { q: "fizzing bubbles close up", q2: "effervescent tablet water", p: BI("Extreme close view of tiny white bubbles fizzing and popping on a wet surface.") }),
  C(9, "That fizz is it working", "RhGroutPore3D", { mode: "peroxide", labels: { pore: "The pores", roots: "The roots" } }),
  S(10, "", "kf", "k_brush2", { p: BI(`Close view of a narrow stiff grout brush in a yellow-gloved hand scrubbing a foamy grout line between white tiles in small circles.`), d1: "the grout brush scrubs the foamy line", d2: "the foam turns gray and the grout underneath shows light", sound: "a stiff brush scrubbing wet grout" }),
  S(10, "Not hard", "bi", "st_scrubtile", { q: "scrubbing tile grout brush", q2: "scrubbing grout", p: BI("A hand scrubbing bathroom tile grout lines with a small brush.") }),
  S(10, "Then rinse it with plain water", "bi", "b_rinsefoam", { q: "rinsing foam shower", p: BI(`Close view of clear water washing gray foam off a grout corner in ${CORNER}, the grout underneath light and clean.`), anim: "the foam washes down off the grout with the water; nothing else moves" }),
  S(11, "", "vl", "m4", { a: `kneels beside the tub in ${SHOWER} holding an old folded towel up toward the camera, eyebrows raised, serious.`, act: "She holds up the towel and tells the camera this is the step everybody skips, firm and a little teasing.", b: "she has lowered the towel to her lap and gives the camera a slow serious nod, mouth closed." }),
  S(11, "Take an old towel", "bi", "st_towelwipe", { q: "wiping bathroom tiles towel dry", q2: "drying tiles towel", p: BI("A hand drying white bathroom tiles with a towel.") }),
  C(11, "Mold can't come back without water", "RhGroutPore3D", { mode: "dry", labels: { pore: "No water, no mold" } }),
  S(11, "Dry is half the fix", "rh", "r_dry", { p: RHP(`She runs a gloved fingertip along the dry white grout corner of the tub, checking it like a white-glove inspection, satisfied.`) }),
  // ── el antes y después real (2:13)
  C(12, "", "RhWipeReveal", { before: I("b_before2"), after: I("b_after2"), lb: "Before", la: "After", squeegee: true }),
  S(12, "", "bi", "b_before2", { p: BI(`Straight-on view of ${CORNER} with heavy ${DOTS}, the bottom row of grout nearly black.`), skip: true }),
  S(12, "", "bi", "b_after2", { p: BI(`Straight-on view of exactly the same ${CORNER}, after cleaning: the grout light gray and even, the caulk bright white, nothing replaced.`), skip: true }),
  S(12, "And on day nine", "bi", "b_day9clean", { p: BI(`Close view of ${CORNER}, still clean and white, a paper wall calendar hanging on the bathroom door in the background, a towel on the tub edge.`), anim: "a soft shimmer of daylight moves over the clean tile; nothing else moves" }),
  C(13, "", "RhCheck", { title: "The whole fix", items: ["Rinse the corner", "Spray full strength till soaking", "15 minutes, hands off", "Scrub, then rinse", "Dry it"] }),
  // ── CTA 1
  C(14, "", "RhBookPage", { page: I("book_p10"), stamp: "Page 10 · Rhonda's book" }),
  C(14, "and Fix number one is free on the page", "RhQRCard", { qr: I("qr"), cover: I("book_cover") }),
];
