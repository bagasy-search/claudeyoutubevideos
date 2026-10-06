// DIRECTOR A — rhtoiletring: MINUTO 1 ("not dirt, it's rock with bacteria" + antes/después del anillo en el segundo 1 → por qué el
// cepillo no lo saca → promesa 3+1+20 min+piedra mojada → ráfaga → antes/después real → 3 loops → Rhonda) + EL ARREGLO + CTA 1 (p0-17).
// ⛔ nada de líquido saliendo de la botella marrón en clips (agnes lo tiñe): esas tomas son foto.
import { S, BI, RHP, BOTTLE } from "../rhonda/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const TBATH = "a small white bathroom with white subway tile walls, a black-and-white hexagon mosaic floor, a white toilet with the seat up, a pedestal sink and a window with a white café curtain";
export const RING = "a white toilet bowl seen from above with the water level lowered: a thick brown and gray ring stuck to the porcelain at the old water line, rough and crusty";
const I = (n) => `img/rhtoiletring/${n}.jpg`;
export const SHOTS = [
  // ── 0:00 · la frase más fuerte + el anillo antes/después en el segundo 1
  S(0, "", "av", ""),
  C(0, "It's rock", "RhWipeReveal", { before: I("b_ringbefore"), after: I("b_ringafter"), lb: "Before", la: "After" }),
  S(0, "", "bi", "b_ringbefore", { p: BI(`Looking straight down into ${RING}.`), skip: true }),
  S(0, "", "bi", "b_ringafter", { p: BI("Looking straight down into exactly the same white toilet bowl, the water lowered, the porcelain completely clean and bright white at the old water line, no ring at all."), skip: true }),
  C(0, "with bacteria living on top", "RhBowlSection3D", { mode: "layers", labels: { crust: "Rock", film: "Bacteria" } }),
  S(0, "on top of it", "bi", "b_filmmacro", { p: BI("Extreme macro view of a slimy brown film glistening on top of a rough chalky mineral crust on white porcelain."), anim: "the slimy film glistens as the light moves; nothing else moves" }),
  // ── por qué el cepillo no lo saca
  S(1, "", "kf", "k_brushslide", { p: BI(`Close view of a toilet brush in a yellow-gloved hand scrubbing back and forth over a brown ring at the water line of a white toilet bowl, the ring staying exactly the same.`), d1: "the toilet brush scrubs over the brown ring", d2: "the brush lifts away and the ring is still there", sound: "a toilet brush scrubbing" }),
  S(1, "the brush slides right over it", "bi", "b_slideover", { p: BI("Extreme close view of white toilet brush bristles sliding over a rough brown ring on white porcelain, the ring untouched."), anim: "the bristles slide slowly over the ring; nothing else moves" }),
  S(1, "and the next morning", "bi", "b_morningring", { p: BI(`Early morning light through a bathroom window falling into a white toilet bowl, a brown ring sitting right at the water line.`), anim: "the morning light slowly brightens; nothing else moves" }),
  S(1, "the brown line is still sitting there", "av", ""),
  // ── la promesa con números (13,6 s)
  C(2, "", "RhPasteMix", {}),
  S(2, "one spoon of peroxide", "bi", "b_spoonperox", { p: BI(`A tablespoon held over a small white bowl of baking soda on a bathroom counter, ${BOTTLE} standing beside it, the spoon full of clear liquid.`) }),
  S(2, "twenty minutes", "bi", "b_timerlid", { p: BI(`A white wind-up kitchen timer with a red dial standing on the closed lid of a toilet tank in ${TBATH}.`), anim: "the timer dial turns slowly; nothing else moves" }),
  S(2, "and a wet pumice stone", "kf", "k_pumicedip", { p: BI("Close view of a yellow-gloved hand dipping a gray pumice stone made for toilets into a bucket of clean water, the stone dripping."), d1: "the gloved hand dips the pumice stone into the water", d2: "the stone comes up dripping wet", sound: "a stone dipped in a bucket of water" }),
  S(2, "And it comes off", "bi", "b_bowlwhite", { p: BI("Looking down into a bright clean white toilet bowl with clear water, sparkling, a yellow rubber glove resting on the rim."), anim: "the water surface shimmers slightly; nothing else moves" }),
  C(2, "without one single scratch", "RhPumiceWetDry", {}),
  // ── la ráfaga
  S(3, "", "kf", "k_valve", { p: BI("Close view of a yellow-gloved hand turning the small oval chrome shutoff valve on the water line behind a white toilet, clockwise."), d1: "the gloved hand grips the little valve", d2: "the hand turns the valve to the right until it stops", sound: "a small metal valve squeaking as it turns" }),
  S(3, "Flush it low", "bi", "st_flush", { q: "toilet flush water swirl", p: BI("Looking down into a white toilet bowl as it flushes, water swirling down.") }),
  S(3, "Paste on the ring", "kf", "k_pasteon", { p: BI(`Close view of an old toothbrush in a yellow-gloved hand spreading thick white paste over the brown ring in ${RING}.`), d1: "the toothbrush spreads white paste over the brown ring", d2: "the ring is covered by a thick white layer of paste", sound: "a toothbrush spreading a thick paste" }),
  S(3, "Twenty minutes", "bi", "b_coffee20", { p: BI(`A coffee mug steaming on the edge of a bathroom sink next to a white kitchen timer, the toilet with the seat up in the background.`), anim: "steam curls up slowly from the mug; nothing else moves" }),
  S(3, "A wet stone", "kf", "k_pumice", { p: BI(`Close view of a yellow-gloved hand rubbing a wet gray pumice stone gently back and forth on the ring line of a white toilet bowl with the water lowered, wet paste and water around it.`), d1: "the wet pumice stone rubs gently along the ring", d2: "the ring line turns clean white behind the stone", sound: "a wet stone rubbing on porcelain" }),
  S(3, "nice and easy", "bi", "b_gentle", { p: BI(`Close view of a yellow-gloved hand holding a wet gray pumice stone lightly with two fingers against a white toilet bowl, barely pressing.`), anim: "the stone moves gently a little; nothing else moves" }),
  S(3, "and look at that bowl", "vl", "m2", { a: `kneels beside the white toilet in ${TBATH}, looking down into the bowl with her mouth open in delight, both yellow-gloved hands on the rim.`, act: "She looks into the bowl, turns to the camera laughing with delight, then leans in close and lowers her voice like she is telling a secret.", b: "she is leaning in close to the camera, eyebrows raised, one finger to her lips, mouth closed." }),
  // ── 3 loops abiertos
  S(4, "that scratches your toilet for good", "bi", "b_scratches", { p: BI("Extreme close view of the glaze of a white toilet bowl with fine gray scratch lines scuffed into it, under bright light."), anim: "the light glints slowly over the scratches; nothing else moves" }),
  S(4, "There's a color test", "bi", "b_colors", { p: BI("Four small white saucers on a bathroom counter in a row, each with a little smear of a different stain: brown, chalky white, rusty orange and black, an old toothbrush beside them."), anim: "the view slides slowly along the four saucers; nothing else moves" }),
  S(4, "which ring you've got", "c", "RhRingColors", { props: { pick: -1 } }),
  S(4, "because one of them isn't even yours", "av", ""),
  S(4, "it's your water", "bi", "st_faucet", { q: "tap water running glass", p: BI("Tap water running into a clear glass at a kitchen sink.") }),
  S(4, "And there's the one cup a week", "rh", "r_cup", { p: RHP(`She holds up a glass measuring cup next to ${BOTTLE} on a bathroom counter, smiling at the camera like it is the easiest thing in the world.`) }),
  S(4, "that keeps it from ever coming back", "bi", "b_whitebowl3", { p: BI("A sparkling clean white toilet bowl in morning light, a glass measuring cup resting on the closed tank lid."), anim: "the morning light shimmers softly; nothing else moves" }),
  // ── quién soy
  S(5, "", "av", "", { ov: { c: "RhNameTag", props: { name: "Rhonda", sub: "34 years cleaning other people's houses" } } }),
  S(5, "I cleaned other people's houses", "rh", "r_caddy3", { p: RHP(`She carries her gray cleaning caddy through the front door of a brick ranch house in Ohio, a homeowner holding the door open for her.`) }),
  S(5, "in Ohio", "bi", "st_ohio2", { q: "small town street houses", p: BI("A quiet small-town Ohio street with wooden houses and porches.") }),
  S(5, "and I've met that ring", "vl", "m4", { a: `stands in ${TBATH} tugging the cuff of one yellow rubber glove tight over her wrist, a knowing grin.`, act: "She shakes her head with a knowing grin, then snaps the glove cuff tight and talks to the camera, nodding toward the toilet.", b: "she stands with both yellow-gloved hands on her hips beside the toilet, smiling, ready to work." }),
  S(5, "in just about every one", "bi", "b_rings3", { p: BI("Three different white toilet bowls side by side in three different bathrooms, each with a brown ring at the water line, like photos on a wall."), anim: "the view drifts slowly from left to right; nothing else moves" }),
  S(5, "So let me show you", "vl", "m4"),
  // ── 0:57 · EL ARREGLO
  C(6, "", "RhChapter", { n: 1, title: "The whole fix", sub: "start to finish" }),
  S(6, "Gloves on", "bi", "st_gloves", { q: "rubber gloves putting on", p: BI("Hands pulling on yellow rubber gloves.") }),
  S(6, "crack a window", "bi", "st_window", { q: "opening window", p: BI("A hand opening a window a few inches.") }),
  S(6, "and grab two things", "bi", "b_soda", { p: BI(`An open box of baking soda with a plain blank white label and ${BOTTLE} side by side on a bathroom counter.`), anim: "daylight shifts slowly across the counter; nothing else moves" }),
  C(6, "Plain three percent", "RhBottle3D", { title: "3% hydrogen peroxide", sub: "the regular drugstore kind", tag: "$1" }),
  S(7, "", "av", ""),
  C(7, "get the water out of the way", "RhWaterLevel", { img: I("b_bathwide") }),
  S(7, "", "bi", "b_bathwide", { p: BI(`Wide view of ${TBATH}.`), skip: true }),
  S(7, "then flush", "bi", "st_flush2", { q: "flushing toilet", p: BI("A hand pressing a toilet flush handle.") }),
  S(8, "", "bi", "b_oldvalve", { p: BI("Close view of an old crusty corroded chrome shutoff valve behind a toilet, green and white mineral crust on it."), anim: "the light glints slowly on the valve; nothing else moves" }),
  S(8, "Just push the water down the drain with a plunger", "kf", "k_plunger", { p: BI("Close view of a plunger pushing down into the water of a white toilet bowl, the water level dropping."), d1: "the plunger pushes down into the bowl", d2: "the water level drops lower", sound: "a plunger pushing water" }),
  S(9, "", "kf", "k_scoop", { p: BI("Close view of a yellow-gloved hand scooping water out of the bottom of a white toilet bowl with a clear plastic cup into a bucket."), d1: "the plastic cup scoops water from the bottom of the bowl", d2: "the cup lifts out full of water", sound: "water scooped with a plastic cup" }),
  S(9, "until that ring is sitting high and dry", "bi", "b_highdry", { p: BI(`Looking down into ${RING}, the bowl nearly empty, the ring dry and plainly visible.`), anim: "the camera creeps slowly closer to the ring; nothing else moves" }),
  S(9, "The water just washes your paste away", "av", ""),
  C(10, "", "RhPasteMix", {}),
  S(10, "Stir it until it's like toothpaste", "kf", "k_stir", { p: BI("Close view of a spoon stirring a thick white paste of baking soda in a small white bowl on a bathroom counter."), d1: "the spoon stirs the white paste", d2: "the paste turns thick and smooth like toothpaste", sound: "a spoon stirring a thick paste in a ceramic bowl" }),
  S(10, "Thick enough to stay where you put it", "bi", "b_pastespoon", { p: BI("A spoon held up over a small white bowl, a thick white paste sitting on it without dripping."), anim: "the spoon tilts slightly and the paste stays put; nothing else moves" }),
  S(11, "", "kf", "k_spread", { p: BI(`Close view of an old toothbrush spreading thick white paste all the way around the brown ring in ${RING}.`), d1: "the toothbrush spreads the paste along the ring", d2: "the ring disappears under a thick white layer", sound: "a toothbrush spreading paste" }),
  C(11, "Twenty minutes", "RhTimer30", { minutes: 20, label: "Go have your coffee" }),
  S(12, "", "av", ""),
  C(12, "Because the peroxide needs time", "RhBowlSection3D", { mode: "paste", labels: { film: "The slime lifts" } }),
  S(12, "In twenty, the slime lifts", "bi", "b_fizzpaste", { p: BI(`Extreme close view of white paste on a toilet ring line, tiny bubbles fizzing up through it.`), anim: "tiny bubbles fizz up through the paste; nothing else moves" }),
  S(13, "", "rh", "r_pumice", { p: RHP(`She kneels beside the toilet holding a wet gray pumice stone over a bucket of water, showing it to the camera.`) }),
  S(13, "Wet the stone", "kf", "k_wetstone", { p: BI("Close view of a gray pumice stone held under a running bathtub faucet by a yellow-gloved hand, water pouring over it."), d1: "the water pours over the pumice stone", d2: "the stone turns dark and dripping wet", sound: "water running over a stone" }),
  S(13, "Then rub the ring gently", "kf", "k_pumice2", { p: BI(`Close view of a wet gray pumice stone rubbing back and forth along the ring line of a white toilet bowl, wet paste smearing away, the porcelain white underneath.`), d1: "the wet stone rubs along the ring", d2: "the porcelain shows white where the stone passed", sound: "a wet pumice stone rubbing porcelain" }),
  C(13, "You'll feel it go from rough to smooth", "RhBowlSection3D", { mode: "pumice", labels: { stone: "Wet stone", crust: "The rock" } }),
  S(14, "", "bi", "b_tankfill", { p: BI("Looking into an open white toilet tank as it refills with clear water, the float rising."), anim: "the tank slowly fills with water; nothing else moves" }),
  S(14, "and flush", "bi", "st_flush3", { q: "toilet flushing close", p: BI("A white toilet bowl flushing, close.") }),
  // ── el antes y después real (2:41)
  C(15, "", "RhWipeReveal", { before: I("b_ringbefore2"), after: I("b_ringafter2"), lb: "Before", la: "After", squeegee: true }),
  S(15, "", "bi", "b_ringbefore2", { p: BI(`A white toilet in ${TBATH} seen from the front at a slight angle, seat up, a heavy brown ring around the bowl at the water line.`), skip: true }),
  S(15, "", "bi", "b_ringafter2", { p: BI(`Exactly the same white toilet in ${TBATH}, same angle, seat up, the bowl perfectly clean and white at the water line, no ring.`), skip: true }),
  S(15, "And a week later", "bi", "b_weeklater", { p: BI(`A clean white toilet bowl with clear water, a small paper wall calendar hanging on the bathroom door behind it with one week crossed off.`), anim: "the light shifts softly over the bowl; nothing else moves" }),
  C(16, "", "RhCheck", { title: "The whole fix", items: ["Water off, flush it low", "Paste: 3 soda + 1 peroxide", "On the ring, 20 minutes", "Wet stone, light hands", "Water on, flush"] }),
  // ── CTA 1
  C(17, "", "RhBookPage", { page: I("book_p11"), stamp: "Page 11 · Rhonda's book" }),
  C(17, "and Fix number one is free on the page", "RhQRCard", { qr: I("qr"), cover: I("book_cover") }),
];
