// DIRECTOR A — rhtoiletrim: MINUTO 1 (tráiler: espejo → "It's alive" → dueña horrorizada → promesa → ráfaga → "It's WHITE!" → loop)
// + EL ARREGLO COMPLETO (antes de 2:30) + CTA 1 (párrafos 0-14).
//   kf = detalle agnes 2.5-flash desde foto base (foley nativo) · vl = Rhonda hablando con SU voz (agnes 2.5, ancla) · rh = foto con Rhonda
//   bi = foto gpt (stock real si q; anim = movimiento agnes v2.0) · c = componente Rh* · av = avatar
import { S, BI, RHP, WHO, BATH, BOTTLE } from "../rhonda/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const RIM = "the underside of the rim of an ordinary white toilet, a row of small round flush holes along it";
export const SHOTS = [
  // ── 0:00 · el espejo bajo el borde
  S(0, "", "kf", "k_mirror", { p: BI(`Close view of a gloved hand in a bright yellow rubber glove sliding a small round hand mirror up under the rim of a white toilet; the mirror shows ${RIM}, thick black slime streaks running down out of the holes. The toilet seat is up, the white bowl and a bit of the black-and-white hexagon floor are visible.`), d1: "the yellow-gloved hand slides the little mirror up under the rim", d2: "the mirror tilts and the black slime dripping out of the rim holes fills it", sound: "a small plastic tap on porcelain and a quiet drip of water" }),
  S(0, "See that black gunk", "vl", "m1", { a: `kneels on the hexagon tile floor beside the open white toilet, holding the small round hand mirror up near her face toward the camera, eyebrows raised, a dead-serious little smile, in ${BATH}.`, act: "She holds up the little mirror toward the camera and says it plainly, eyebrows raised, a small serious nod on the last words.", b: "she has lowered the little mirror to her chest and gives the camera a slow, serious nod, mouth closed, eyebrows still raised." }),
  S(0, "running down out of the holes", "bi", "b_mirrorgunk", { p: BI(`Extreme close view of a small round hand mirror held under a toilet rim: in the reflection, ${RIM}, every hole crusted with black slime and long black streaks running down the white porcelain toward the water.`), anim: "the mirror tilts very slightly; nothing else moves" }),
  S(0, "That's not dirt honey", "vl", "m1"),
  // ── la dueña de casa (la miniatura)
  S(1, "", "bi", "b_homeowner", { p: BI(`In the open doorway of ${BATH}, a middle-aged homeowner woman in a beige cardigan and jeans stands frozen with both hands covering her mouth in horror, eyes wide, looking down at the toilet; in the foreground the toilet seat is up and a yellow rubber glove rests on the rim.`), anim: "she presses both hands tighter over her mouth and leans back a little; nothing else moves" }),
  S(1, "and it's right back by Thursday", "bi", "b_thursday", { p: BI(`Close view of ${RIM} seen from a low angle with a flashlight: thin black streaks are starting again under three of the holes, the rest of the rim still white.`), anim: "the flashlight beam drifts slowly along the rim; nothing else moves" }),
  // ── la promesa
  S(2, "", "av", "", { ov: { c: "RhNameTag", props: { name: "Rhonda", sub: "34 years cleaning other people's houses" } } }),
  S(2, "other people's bathrooms", "rh", "r_caddy", { p: RHP(`She walks into a stranger's small blue-tiled bathroom carrying a gray cleaning caddy full of brushes and spray bottles, glancing at the toilet with a knowing look, a bath mat and a shampoo bottle on the tub edge.`) }),
  S(2, "in Ohio", "bi", "st_ohio", { q: "suburban street houses autumn", p: BI("A quiet suburban street in small-town Ohio in the fall: two-story wooden houses with porches, maple trees with orange leaves, a parked minivan, a mailbox at the curb.") }),
  S(2, "and the bleach never once", "bi", "st_bleach", { q: "pouring bleach toilet", p: BI("A gloved hand pouring clear liquid from a plain white plastic jug with a blank label into a white toilet bowl, a splash in the water.") }),
  S(2, "It just made it hide", "bi", "b_grayholes", { p: BI(`Close view of ${RIM} after bleach: the holes look pale gray instead of black, faint dark shadows still deep inside each hole.`), anim: "a drop of water slowly forms and falls from one hole; nothing else moves" }),
  C(2, "So watch what a", "RhBottle3D", { title: "One brown bottle", sub: "the regular drugstore kind", tag: "$1" }),
  // ── la ráfaga
  S(3, "", "kf", "k_pour", { p: BI(`Close view inside the open tank of a white toilet, the porcelain lid set aside: the tall open overflow tube stands in the middle, and a yellow-gloved hand tips a clear glass measuring cup, pouring a thin stream of clear liquid right down into the top of the tube.`), d1: "the gloved hand tips the measuring cup over the overflow tube", d2: "the clear liquid runs down into the tube", sound: "a thin stream of liquid pouring into a pipe" }),
  C(3, "in the tank you've probably", "RhToiletCutaway3D", { mode: "flow", labels: { tube: "Overflow tube" }, orbit: 0.5, start: 2 }),
  S(3, "A good spray up under the rim", "kf", "k_spray", { p: BI(`Low close view under the rim of a white toilet: a yellow-gloved hand holds ${BOTTLE} with a white trigger sprayer pointed up under the rim at the row of black-crusted holes.`), d1: "the sprayer points up under the rim", d2: "a fine mist hits the holes and they turn wet and drip", sound: "two quick squirts of a trigger spray bottle" }),
  S(3, "It starts to fizz", "kf", "k_fizz", { p: BI(`Extreme close view of ${RIM}: every hole is wet and covered with white foam bubbling up out of the black slime, tiny bubbles running down the porcelain.`), d1: "white foam starts to bubble out of the holes", d2: "the foam grows and runs down over the black streaks", sound: "a soft continuous fizzing and popping of bubbles" }),
  C(3, "Thirty minutes", "RhTimer30", { minutes: 30, fast: true }),
  S(3, "a little brush", "bi", "st_toothbrush", { q: "scrubbing toothbrush cleaning", p: BI(`A yellow-gloved hand scrubbing ${RIM} with an old toothbrush, white foam on the bristles.`) }),
  S(3, "one flush", "bi", "st_flush", { q: "toilet flushing water", p: BI("Looking down into a white toilet bowl at the moment of flushing: clear water swirling down, a gloved hand on the handle at the edge of the frame.") }),
  // ── 0:34 · el grito
  S(4, "", "vl", "m2", { a: `kneels beside the white toilet holding the small round hand mirror under the rim, looking into it, her mouth open in delight, in ${BATH}.`, act: "She looks into the mirror, then turns to the camera beaming, eyes wide, laughing with excitement, holding the mirror up.", b: "she is turned toward the camera, laughing with delight, holding the little mirror up beside her face, eyes wide." }),
  S(4, "It's WHITE", "kf", "k_white", { p: BI(`Extreme close view of a small round hand mirror held under a toilet rim: in the reflection ${RIM}, every hole perfectly clean and bright white, a few drops of clear water.`), d1: "the mirror shows the clean white holes", d2: "the mirror tilts along the rim showing more clean white holes", sound: "a drop of water and a soft plastic tap" }),
  // ── el loop abierto
  S(5, "", "vl", "m2"),
  S(5, "it's back in a week", "bi", "b_backweek", { p: BI(`Close view of ${RIM}: fresh black streaks have come back under every hole, as if they had never been cleaned, a toilet brush leaning against the bowl.`), anim: "a thin black drip slowly creeps down from one hole; nothing else moves" }),
  C(5, "Because the part that feeds it", "RhToiletCutaway3D", { mode: "dirty", labels: { channel: "The hidden channel" }, orbit: 0.4 }),
  S(5, "So let me show you the whole thing", "vl", "m3", { a: `stands in ${BATH} next to the toilet, pulling the cuff of one yellow rubber glove tight over her wrist, looking at the camera with a let's-get-to-work grin.`, act: "She snaps the glove cuff tight on her wrist and talks to the camera, nodding toward the toilet, warm and direct.", b: "she stands with both yellow-gloved hands on her hips beside the toilet, smiling at the camera, ready to work." }),
  S(5, "and then I'll show you where it's hiding", "bi", "b_peektank", { q: "toilet tank lid", p: BI("A yellow-gloved hand lifting the white porcelain lid of a toilet tank a few inches, a dark gap showing the water and the top of the overflow tube inside."), anim: "the gloved hand lifts the tank lid a little higher" }),
  // ── 0:47 · EL ARREGLO
  C(6, "", "RhChapter", { n: 1, title: "The whole fix", sub: "start to finish" }),
  S(6, "Rubber gloves on", "kf", "k_gloves", { p: BI(`Close view at chest height in ${BATH}: two hands pulling on bright yellow rubber gloves, the right hand tugging the cuff of the left glove up the wrist, the light-blue short sleeve of a cleaning tunic at the edge.`), d1: "the hand tugs the yellow glove cuff up", d2: "the cuff snaps against the wrist", sound: "the stretch and snap of a rubber glove" }),
  S(6, "crack a window", "bi", "st_window", { q: "opening window curtain", p: BI("A yellow-gloved hand pushing up the lower sash of a white double-hung bathroom window behind a white café curtain, daylight and green leaves outside.") }),
  S(6, "and grab the brown bottle", "bi", "b_grab", { q: "cleaning supplies under sink", p: BI(`The open cabinet under a bathroom sink: a yellow-gloved hand reaching in and picking up ${BOTTLE} from among a pack of toilet paper, a sponge and a plastic bucket.`), anim: "the gloved hand lifts the brown bottle slowly out of the cabinet" }),
  C(6, "Plain three percent", "RhBottle3D", { title: "3% hydrogen peroxide", sub: "the regular drugstore kind" }),
  S(6, "the regular drugstore kind", "bi", "st_drugstore", { q: "pharmacy aisle shopping", p: BI("A woman with a shopping basket picking a small bottle off a drugstore shelf in an ordinary pharmacy aisle.") }),
  S(6, "That's it", "av", ""),
  S(6, "nothing you have to order", "bi", "st_package", { q: "package delivery doorstep", p: BI("A cardboard delivery box sitting on a front doorstep beside a doormat.") }),
  // ── la pastilla afuera
  S(7, "", "av", ""),
  S(7, "fish it out first", "bi", "b_fishout", { p: BI("A yellow-gloved hand lifting a soggy blue tablet out of the blue water of an open toilet tank, drops of blue water falling from it.") , anim: "the gloved hand lifts the dripping blue tablet slowly out of the water" }),
  S(7, "and flush two or three times", "bi", "st_flush2", { q: "flushing toilet handle", p: BI("A hand pressing the chrome flush handle of a white toilet, the tank lid off.") }),
  C(7, "Some of those have bleach", "RhNeverMix", { a: "Bleach tablet", b: "Anything else", verdict: "Never together", short: true }),
  // ── el tubo de rebalse
  S(8, "", "rh", "r_tanklid", { p: RHP(`She lifts the heavy white porcelain lid off the toilet tank with both gloved hands and sets it down on a folded towel on the hexagon floor, looking down into the tank.`) }),
  S(8, "See that tall open pipe", "bi", "b_overflow", { q: "inside toilet tank", p: BI("Looking down into the open tank of a white toilet: clear water, the tall open plastic overflow tube standing up in the middle with the thin refill hose clipped to it, the fill valve on the left, the flapper at the bottom.") }),
  C(8, "That's the overflow tube", "RhToiletCutaway3D", { mode: "flow", labels: { tube: "Overflow tube", channel: "Rim channel", holes: "Every hole" , amount: "½ cup" }, orbit: 0.45 }),
  S(8, "and comes out of every one of those little holes", "bi", "b_holesdrip", { p: BI(`Extreme close view of ${RIM}: clear liquid running out of every hole and down the porcelain in thin wet lines, a few bubbles starting on the black gunk.`), anim: "the clear liquid keeps running out of the holes" }),
  S(8, "That's the part no brush can reach", "av", ""),
  // ── espejo y espray
  S(9, "", "bi", "st_spraybath", { q: "spray bottle cleaning toilet", p: BI(`A yellow-gloved hand spraying ${BOTTLE} under the rim of a white toilet, mist in the air.`) }),
  C(9, "until every one of them is wet", "RhRimJets", { mode: "spray", label: "Spray until they drip" }),
  C(9, "That's about another half cup", "RhMeasureCup", { fill: 0.5, label: "½ cup", where: "under the rim" }),
  C(9, "And one cup goes straight into the bowl", "RhMeasureCup", { fill: 1, label: "1 cup", where: "in the bowl" }),
  S(9, "No mirror", "bi", "b_phonebag", { p: BI("A smartphone sealed inside a clear zip sandwich bag held under the rim of a white toilet by a yellow-gloved hand, its screen showing the camera view of the rim holes.") , anim: "the hand tilts the bagged phone slightly; nothing else moves" }),
  // ── 30 minutos
  C(10, "", "RhTimer30", { minutes: 30, label: "No flushing" }),
  S(10, "Go have your coffee", "rh", "r_coffee", { p: RHP(`She sits on the closed lid of a laundry hamper just outside the bathroom door, still in her yellow gloves, holding a white coffee mug with both hands and glancing at the toilet with a satisfied little smile.`) }),
  S(10, "You'll see it fizz", "bi", "b_fizzbowl", { q: "cleaning foam toilet", p: BI(`Close view of ${RIM} and the inside of the bowl: white foam fizzing on every dark spot, small bubbles clinging to the porcelain and a ring of foam on the water.`), anim: "the foam bubbles grow and pop very slowly" }),
  // ── cepillo, palito
  S(11, "", "bi", "st_scrubholes", { q: "toothbrush cleaning toilet", p: BI(`A yellow-gloved hand scrubbing ${RIM} with a small stiff brush while the other hand holds a small mirror underneath.`) }),
  S(11, "while you look in the mirror", "rh", "r_mirrorscrub", { p: RHP(`She kneels at the toilet, one gloved hand holding the small round mirror under the rim, the other scrubbing the holes with an old toothbrush, squinting at the reflection with concentration.`) }),
  S(11, "Then flush", "bi", "st_flush3", { q: "toilet flush swirl", p: BI("Clear water swirling down a clean white toilet bowl right after a flush.") }),
  S(12, "", "bi", "b_stirrer", { p: BI(`Extreme close view of ${RIM}: a yellow-gloved hand gently poking a thin white plastic coffee stirrer into one rim hole that is still plugged with black gunk.`), anim: "the stirrer pushes gently a little deeper into the hole" }),
  C(12, "Never a metal tool", "RhDoDont", { yes: { label: "Plastic stirrer", img: "img/rhtoiletrim/b_stirrer.jpg" }, no: { label: "Metal tools", img: "img/rhtoiletrim/b_metal.jpg" } }),
  S(12, "Metal scratches the porcelain", "bi", "b_metal", { p: BI("Extreme close view of a scratched white porcelain toilet rim: thin gray scratch lines around one hole, a screwdriver tip resting next to it.") }),
  S(12, "and a scratch is just", "av", ""),
  // ── el resumen
  C(13, "", "RhCheck", { title: "The whole fix", items: ["½ cup down the overflow tube", "Spray the holes till they drip", "1 cup in the bowl", "30 minutes, no flushing", "Brush, then flush"] }),
  // ── CTA 1
  S(14, "", "av", ""),
  C(14, "in my book", "RhBookPage", { page: "img/rhtoiletrim/book_p9.jpg", stamp: "Page from Rhonda's book" }),
  C(14, "or just point your phone camera", "RhQRCard", { qr: "img/rhtoiletrim/qr.png", cover: "img/rhtoiletrim/book_cover.jpg" }),
];
