// DIRECTOR A — rhcaulk: MINUTO 1 ("Stop. Put that knife down" + el cúter a punto de cortar en el segundo 1,3 → antes/después →
// la promesa (tiras + botella + film + 8 h) → ráfaga → 3 loops → Rhonda) + EL ARREGLO + CTA 1 (p0-18).
// Sin clips hablados de agnes (cola 2.5-flash saturada): Rhonda habla con el avatar y aparece en fotos haciendo la acción.
// Minuto 1: nunca dos planos blancos seguidos (el corte no se siente): se alternan con Rhonda y componentes de color.
import { S, BI, RHP, BOTTLE } from "../rhonda/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const TUB = "a small white bathroom with white subway tile walls, a white bathtub with a shower, a clear shower curtain liner pushed aside and a window with a white café curtain";
export const CAULK = "the white silicone caulk bead along the joint where the white subway tile wall meets the edge of a white bathtub";
const MOLDY = "black mold spots and streaks all along the caulk bead";
const I = (n) => `img/rhcaulk/${n}.jpg`;
export const SHOTS = [
  // ── 0:00 · STOP + el cúter
  S(0, "", "av", ""),
  C(0, "knife down", "RhKnifeStop", { img: I("b_knife") }),
  S(0, "", "bi", "b_knife", { p: BI(`Close view of a hand holding an open utility knife with the blade touching ${CAULK}, ${MOLDY}, about to cut.`), skip: true }),
  C(0, "That caulk comes back white", "RhWipeReveal", { before: I("b_caulkbefore"), after: I("b_caulkafter"), lb: "Tonight", la: "Tomorrow" }),
  S(0, "", "bi", "b_caulkbefore", { p: BI(`Straight-on close view of ${CAULK}, ${MOLDY}, the tile above clean.`), skip: true }),
  S(0, "", "bi", "b_caulkafter", { p: BI(`Straight-on close view of exactly the same ${CAULK}, now clean and bright white, no black at all, nothing replaced.`), skip: true }),
  // ── "I know"
  S(1, "", "rh", "r_sympathy", { ov: { c: "RhPromise", dur: 9.0, props: { img: I("b_caulkafter"), items: ["Strips + 1 brown bottle", "Plastic wrap on top", "8 hours of sleep", "White again. No knife."] } }, p: RHP(`She kneels beside a white bathtub with black-spotted caulk, holding a scrub brush, giving the camera a sympathetic, knowing look.`) }),
  S(1, "It's black, it's ugly", "kf", "k_blackcaulk", { p: BI(`Extreme close view of ${CAULK} with ${MOLDY}, a yellow-gloved fingertip pointing at the worst spot.`), d1: "the gloved fingertip points at the black caulk", d2: "the finger runs along the black streaks", sound: "a faint drip in a quiet bathroom" }),
  S(1, "and you've scrubbed it", "bi", "b_scrubtired", { q: "scrubbing bathtub", p: BI(`A tired woman in a gray sweatshirt kneeling at a white bathtub scrubbing the black caulk line with a brush, her other hand on her lower back.`), anim: "she scrubs and then stops to rub her arm; nothing else moves" }),
  S(1, "So you figure", "av", ""),
  S(1, "cut it all out", "kf", "k_cutter", { p: BI(`Extreme close view of the blade of a utility knife sliding along the edge of a black-spotted silicone caulk bead at a white bathtub.`), d1: "the knife blade touches the caulk", d2: "the blade slides a little along the edge", sound: "a utility knife blade clicking out" }),
  S(1, "and start over", "bi", "b_caulktubes", { p: BI("A caulk gun and three new tubes of white silicone caulk lying on a towel on the edge of a white bathtub, a utility knife beside them."), anim: "the light shifts slowly over the tubes; nothing else moves" }),
  S(1, "Most of the time", "rh", "r_wag", { p: RHP(`She stands in ${TUB}, wagging one yellow-gloved finger at the camera with a small smile, the other hand on her hip.`) }),
  // ── la promesa (13,9 s)
  S(2, "", "kf", "k_tearstrip", { p: BI("Close view of yellow-gloved hands tearing a long strip off a roll of white paper towels on a bathroom counter."), d1: "the gloved hands grip the paper towel", d2: "a long strip tears off", sound: "paper towel tearing" }),
  C(2, "one brown bottle", "RhBottle3D", { title: "3% hydrogen peroxide", sub: "the regular drugstore kind", tag: "$1" }),
  S(2, "a sheet of plastic wrap", "kf", "k_wrapbox", { p: BI("Close view of a hand pulling clear plastic wrap out of its box on a kitchen counter."), d1: "the hand pulls the plastic wrap out of the box", d2: "a long clear sheet stretches out", sound: "plastic wrap crinkling" }),
  C(2, "and eight hours of sleep", "RhOvernight", {}),
  S(2, "No knife", "bi", "b_knifedrawer", { q: "kitchen drawer tools", p: BI("A hand dropping a utility knife into an open kitchen drawer full of tools."), anim: "the drawer slides closed; nothing else moves" }),
  S(2, "no new tube of caulk", "bi", "st_caulkgun", { q: "caulking gun", p: BI("A caulking gun on a workbench.") }),
  S(2, "no weekend gone", "rh", "r_weekend", { p: RHP(`She sits on a porch swing in front of an Ohio house on a sunny Saturday with a mug of coffee, relaxed and smiling.`) }),
  // ── la ráfaga
  S(3, "", "kf", "k_drycaulk", { p: BI(`Close view of a yellow-gloved hand wiping ${CAULK} dry with an old striped towel, ${MOLDY}.`), d1: "the towel wipes along the black caulk", d2: "the caulk is left dry", sound: "a towel wiping tile" }),
  S(3, "Soak the strips", "kf", "k_soakstrips", { p: BI("Close view of yellow-gloved hands dunking strips of white paper towel into a white bowl of clear liquid on a bathroom counter."), d1: "the strips go down into the liquid", d2: "the strips come up dripping wet", sound: "wet paper dunked in liquid" }),
  S(3, "Press them flat", "kf", "k_pressstrip", { p: BI(`Close view of a yellow-gloved hand pressing a soaked white paper towel strip flat along ${CAULK}, ${MOLDY}.`), d1: "the gloved hand presses the wet strip onto the caulk", d2: "the strip sticks flat along the line", sound: "a wet paper towel pressed onto tile" }),
  S(3, "Wrap it up", "kf", "k_wrapover", { p: BI(`Close view of yellow-gloved hands smoothing clear plastic wrap over soaked paper towel strips lying along ${CAULK}.`), d1: "the hands smooth the plastic wrap over the strips", d2: "the plastic lies flat and shiny", sound: "plastic wrap smoothed down" }),
  S(3, "bed", "bi", "b_bedroom", { q: "dark bedroom night", p: BI("A dark cozy bedroom at night, a bedside lamp just switched off, a quilt on the bed, moonlight through the curtains."), anim: "the last glow of the lamp fades; nothing else moves" }),
  S(3, "peel it back", "kf", "k_peel", { p: BI(`Close view of a yellow-gloved hand peeling soaked paper towel strips off ${CAULK} in the morning, the caulk underneath bright white.`), d1: "the gloved hand peels the strip away", d2: "the clean white caulk is revealed", sound: "wet paper peeling off" }),
  S(3, "and look at that line", "rh", "r_delight", { p: RHP(`She kneels beside a white bathtub pointing at the clean white caulk line with one gloved hand, laughing with delight at the camera.`) }),
  // ── 3 loops
  S(4, "", "av", ""),
  C(4, "one reason your spray never worked", "RhCaulkSection3D", { mode: "spray", labels: { bead: "Slick and round" } }),
  S(4, "once you see it", "rh", "r_seeit", { p: RHP(`She leans close to a bathtub caulk line, pointing at it with one yellow-gloved finger, eyebrows raised, in a bright bathroom.`) }),
  S(4, "you'll never spray caulk again", "rh", "r_spraydown", { p: RHP(`She sets a spray bottle down on the edge of the tub and shakes her head at the camera, done with it.`) }),
  C(4, "There's a two night rule", "RhTwoNightRule", { a: I("b_night1"), b: I("b_night2"), verdict: "saved" }),
  S(4, "", "bi", "b_night1", { p: BI(`Close view of ${CAULK} after one night of treatment: mostly white, a few faint gray shadows left.`), skip: true }),
  S(4, "", "bi", "b_night2", { p: BI(`Close view of the same ${CAULK} after two nights: clean bright white.`), skip: true }),
  S(4, "or if it really has to go", "bi", "b_blackunder", { p: BI("Extreme close side view of a semi-clear silicone caulk bead along a tub with dark black mold visible UNDER the silicone, like through a dirty window."), anim: "the view creeps slowly along the caulk; nothing else moves" }),
  S(4, "And if it does have to go", "av", ""),
  S(4, "one step everybody skips", "bi", "b_hairdryer", { p: BI("A hand pointing a hair dryer at a bare, damp tub joint where the old caulk was removed, a new caulk tube waiting on the tub edge."), anim: "the hair dryer moves slowly along the joint; nothing else moves" }),
  S(4, "everybody skips", "rh", "r_skip", { p: RHP(`She holds up a hair dryer in one yellow-gloved hand next to a bathtub, giving a knowing look to the camera.`) }),
  S(4, "turn black in a month", "bi", "b_newblack", { p: BI("Close view of a fresh-looking smooth white caulk bead along a tub already showing small black spots coming up from underneath."), anim: "the camera creeps slowly toward the black spots; nothing else moves" }),
  // ── quién soy
  S(5, "", "av", "", { ov: { c: "RhNameTag", props: { name: "Rhonda", sub: "34 years cleaning other people's houses" } } }),
  S(5, "houses in Ohio", "bi", "st_ohio3", { q: "ohio neighborhood houses", p: BI("A quiet Ohio neighborhood with houses and trees.") }),
  S(5, "and I've talked more people", "rh", "r_wrist", { p: RHP(`She gently holds the wrist of a middle-aged man who is holding a utility knife over the caulk of a bathtub, with an urgent "wait" face.`) }),
  S(5, "ripping out caulk", "bi", "b_ripstrip", { p: BI("Close view of a hand ripping a long strip of old moldy caulk out of a bathtub joint."), anim: "the strip pulls away slowly; nothing else moves" }),
  S(5, "than I can count", "bi", "b_oldtubes", { p: BI("A bathroom trash can stuffed with old squeezed-out caulk tubes and long strips of ripped-out moldy caulk."), anim: "the light shifts slowly; nothing else moves" }),
  S(5, "So let me show you", "av", ""),
  // ── 1:01 · EL ARREGLO
  C(6, "", "RhChapter", { n: 1, title: "The whole fix", sub: "one night, no knife" }),
  S(6, "Gloves on", "bi", "st_gloves", { q: "yellow rubber gloves", p: BI("Hands putting on yellow rubber gloves.") }),
  S(6, "The brown bottle", "rh", "r_supplies", { p: RHP(`She stands at a bathroom counter with ${BOTTLE}, a roll of paper towels, a box of plastic wrap and an old towel laid out in a row, presenting them with one gloved hand.`) }),
  S(6, "A roll of plastic wrap", "bi", "b_wraproll", { q: "plastic wrap roll kitchen", p: BI("A box of plastic wrap on a counter.") }),
  S(7, "", "av", ""),
  S(7, "Wipe it with the towel", "bi", "b_towelcaulk", { p: BI(`Close view of an old striped towel pressed along ${CAULK}, blotting it dry.`), anim: "the towel slides along the caulk; nothing else moves" }),
  S(7, "Wet caulk under the strips", "av", ""),
  S(8, "", "bi", "b_strips", { q: "paper towels", p: BI("Long torn strips of white paper towel laid out side by side on a bathroom counter, ragged edges."), anim: "daylight shifts slowly across the strips; nothing else moves" }),
  S(8, "Torn edges are fine", "av", ""),
  S(9, "", "bi", "b_bowlpour", { p: BI(`A white bowl on a bathroom counter with paper towel strips soaking in clear liquid, ${BOTTLE} standing next to it, capped.`), anim: "the strips settle slowly into the liquid; nothing else moves" }),
  C(9, "that's about one cup", "RhMeasureCup", { fill: 1, label: "1 cup", where: "for a whole tub" }),
  S(10, "", "kf", "k_press2", { p: BI(`Close view of yellow-gloved fingers pressing a dripping paper towel strip into ${CAULK}, smoothing out an air bubble.`), d1: "the fingers press the wet strip into the corner", d2: "the air bubble is pushed out", sound: "wet paper pressed on tile" }),
  S(10, "Every black spot covered", "bi", "b_covered", { p: BI(`Close view of ${CAULK} completely covered by soaked white paper towel strips, all the way along the tub.`), anim: "the view slides slowly along the strips; nothing else moves" }),
  S(11, "", "bi", "b_vertical", { p: BI("A vertical inside corner of a white tiled shower where two walls meet, soaked paper towel strips pressed into the caulk and clear plastic wrap held up at the top with two pieces of blue painter's tape."), anim: "the plastic wrap ripples slightly; nothing else moves" }),
  S(11, "a couple of pieces of painter's tape", "kf", "k_tape", { p: BI("Close view of a hand pressing a piece of blue painter's tape onto clear plastic wrap at the top of a tiled shower corner."), d1: "the hand presses the blue tape", d2: "the tape holds the plastic to the tile", sound: "tape pressed onto tile" }),
  S(12, "", "bi", "b_cottonpads", { q: "cotton pads", p: BI("A row of soaked white cotton pads pressed along the caulk at the back of a white bathroom sink, clear plastic wrap over them."), anim: "the light shifts softly over the pads; nothing else moves" }),
  S(13, "", "av", ""),
  C(13, "That plastic keeps them wet all night", "RhCaulkSection3D", { mode: "strips", labels: { strip: "Wet all night", roots: "Roots fade" } }),
  S(13, "instead of drying up in ten minutes", "bi", "b_drystrip", { p: BI("Close view of a dried-out stiff paper towel strip curling off a tub caulk line, no plastic on it."), anim: "the dry strip curls a little more; nothing else moves" }),
  C(14, "", "RhOvernight", {}),
  S(15, "", "kf", "k_peel2", { p: BI(`Close view of yellow-gloved hands pulling off clear plastic wrap and wet paper towel strips from ${CAULK} in morning light.`), d1: "the hands pull the plastic and strips away", d2: "the white caulk underneath shows", sound: "plastic and wet paper peeling" }),
  S(15, "Take an old toothbrush", "kf", "k_toothbrush", { p: BI(`Close view of an old toothbrush lightly scrubbing a now-white caulk bead along a tub.`), d1: "the toothbrush scrubs lightly along the caulk", d2: "the caulk shines clean white", sound: "a toothbrush scrubbing lightly" }),
  S(15, "rinse it with plain water", "bi", "st_rinsetub", { q: "rinsing bathtub shower", p: BI("Rinsing a bathtub with a shower head.") }),
  // ── el antes y después real (2:50)
  C(16, "", "RhWipeReveal", { before: I("b_caulkbefore2"), after: I("b_caulkafter2"), lb: "Before", la: "After", squeegee: true }),
  S(16, "", "bi", "b_caulkbefore2", { p: BI(`Wide-ish view of a white bathtub and tile wall, ${MOLDY} along the whole back edge.`), skip: true }),
  S(16, "", "bi", "b_caulkafter2", { p: BI(`Exactly the same white bathtub and tile wall, same angle, the caulk along the whole back edge clean and bright white.`), skip: true }),
  S(16, "And the black is gone", "rh", "r_cleantub", { p: RHP(`She sits on the edge of a gleaming white bathtub with clean white caulk, arms crossed, proud smile at the camera.`) }),
  C(17, "", "RhCheck", { title: "The whole fix", items: ["Dry the caulk", "Soak strips in peroxide", "Press them flat", "Plastic wrap on top", "8 hours, then peel", "Light scrub, rinse"] }),
  // ── CTA 1
  C(18, "", "RhBookPage", { page: I("book_p12"), stamp: "Page 12 · Rhonda's book" }),
  C(18, "and Fix number one is free on the page", "RhQRCard", { qr: I("qr"), cover: I("book_cover") }),
];
