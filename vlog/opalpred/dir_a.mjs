// DIRECTOR A — minuto 1 (tres gallinas muertas, la cabeza de Pearl) + Opal + mirar antes de limpiar + los sospechosos (p0-16)
// ⚠️ Tono: nada gráfico. Gallinas muertas = plumas sueltas, una pata asomando bajo la paja, el gallinero en silencio.
import { S, BI, HZP, COOP, YARD, BARN, KITCHEN, STORE, HENS } from "./dir_lib.mjs";
export const SUSPECTS = [{ who: "Raccoon", clue: "head & crop eaten, by the wire" }, { who: "Opossum", clue: "one bird, eaten from behind" }, { who: "Skunk", clue: "eggs opened at one end" }, { who: "Fox", clue: "one hen gone, feather trail" }, { who: "Hawk", clue: "circle of plucked feathers" }, { who: "Mink", clue: "many killed, bite at the neck" }];
export const FOUR = [{ t: "How many are dead", cost: "1" }, { t: "Where the bodies are", cost: "2" }, { t: "What was eaten", cost: "3" }, { t: "How it got in", cost: "4" }];
export const SHOTS = [
  // ── MINUTO 1
  S(0, "", "vl", "m1"),
  S(0, "and three of my hens were dead", "bi", "b_corner", { p: BI(`Early morning inside ${COOP}: the dim back corner with a heap of loose reddish-brown and speckled feathers on the pine shavings and straw, a still hen's foot just visible under the straw, grey light from the open door, nothing gory.`), anim: "a few loose feathers stir in the draft from the door" }),
  S(0, "Pearl, June, and a little speckled hen", "bi", "b_roostscared", { p: BI(`${COOP} in the early morning: all the remaining ${HENS} huddled tight together up on the highest roost bar, wide-eyed and frozen, none on the floor, loose feathers on the shavings below.`), anim: "the hens on the roost shift nervously and press closer together" }),
  S(0, "And Pearl's head was gone", "vl", "m2"),
  S(0, "And the other hens were up on the roost", "st", "st_roost.1"),
  S(0, "piled together", "st", "st_roost.2"),
  S(0, "and none of them would come down", "st", "st_coop.3"),
  S(1, "", "av", "av"),
  S(1, "before I even touched them", "bi", "b_doorway", { p: BI(`Seen from inside ${COOP} looking out: an older woman's silhouette in a navy flowered dress standing still in the open coop doorway in the grey early morning, a feed scoop hanging from her hand.`), anim: "the woman stands still in the doorway, the scoop swaying slightly" }),
  S(1, "By that afternoon I knew for sure", "bi", "b_vent", { p: BI("Close view of a small low vent on the side of a red wooden chicken coop near the door, covered with old chicken wire whose corner has come loose and curled back, leaving a small gap, tiny muddy five-toed tracks on the board below."), anim: "the loose corner of the chicken wire trembles in the wind" }),
  S(1, "And by the next night, I had it on camera", "bi", "b_trailcam", { p: BI("A small camouflage trail camera strapped to a wooden fence post with a nylon strap, pointed at the side of a red chicken coop, dusk light, mud and straw on the ground."), anim: "the little red light on the trail camera blinks on" }),
  S(1, "in fifty years", "st", "st_autumn.2"),
  S(2, "", "av", "av"),
  S(2, "Because every predator leaves", "c", "OpSuspects", { props: { cards: SUSPECTS, culprit: -1, every: 6, title: "every predator leaves a calling card" } }),
  S(2, "How the bird was killed", "c", "OpChecklist", { props: { items: FOUR, every: 8, title: "what I look at", bed: "b_corner" } }),
  S(2, "Once you know how to read it", "av", "av"),
  S(3, "", "bi", "b_hardware", { p: BI(`On a workbench in a farm shed: a roll of heavy galvanized half inch welded wire hardware cloth partly unrolled next to a roll of flimsy hexagonal chicken wire, tin snips and a box of screws with washers.`), anim: "a gloved hand unrolls a little more of the hardware cloth" }),
  S(3, "and the one thing almost everybody uses", "st", "st_chickenwire.1"),
  // ── OPAL
  S(4, "", "av", "av", { ov: { c: "OpNameTag", props: { name: "Opal", line: "50 years of hens · Indiana" } } }),
  S(4, "What went wrong, what I checked", "st", "st_hens.1"),
  S(4, "Every week I tell you", "st", "st_coop.4"),
  // ── PRIMERO, MIRAR
  S(5, "", "av", "av"),
  S(5, "Take a few pictures with your phone", "hz", "h_phone", { p: HZP("She crouches in the coop doorway in the early morning holding up a phone to take a picture of the back corner of the coop, her face serious and sad.", COOP) }),
  S(5, "Then look", "st", "st_coop.1"),
  S(5, "I know it's awful", "st", "st_hens.5"),
  S(5, "But the scene tells you everything", "av", "av"),
  S(6, "", "c", "OpChecklist", { props: { items: FOUR, every: 30, title: "what I look at", bed: "b_doorway" } }),
  // ── RACCOON
  S(7, "", "c", "OpSuspects", { props: { cards: SUSPECTS, culprit: -1, every: 2, title: "the suspects" } }),
  S(7, "It'll reach right through chicken wire", "bi", "b_raccoonwire", { p: BI("Night on a farm lit by a flashlight: a raccoon standing on its hind legs reaching one hand through the hexagonal chicken wire of a run, its other hand gripping the wire, eyes shining."), anim: "the raccoon's hand reaches and feels through the wire" }),
  S(7, "Raccoons often eat the head", "st", "st_raccoon.1"),
  S(7, "A lot of times you'll find a hen dead by the wire", "st", "st_raccoon.2"),
  S(8, "", "bi", "b_hook", { p: BI("Close view of a simple hook-and-eye latch hanging open on a weathered coop door at night in a flashlight beam, little muddy hand prints on the wood around it."), anim: "the open hook swings slightly in the flashlight beam" }),
  S(8, "And if there's a water dish", "bi", "b_waterdish", { p: BI("A galvanized chicken waterer base in the morning with muddy water and a few feathers floating in it, small raccoon hand prints in the mud around it."), anim: "a feather floats slowly across the muddy water" }),
  // ── OPOSSUM / SKUNK
  S(9, "", "st", "st_opossum.1"),
  S(9, "And often the possum is still in the coop", "bi", "b_possumnest", { p: BI(`${COOP} in the morning: an opossum curled up in a straw nest box with its eyes closed, broken eggshells beside it.`), anim: "the opossum's nose twitches in the nest box" }),
  S(9, "If a possum does kill a hen", "av", "av"),
  S(10, "", "bi", "b_skunkeggs", { p: BI("Several brown eggshells on the ground near a coop, each opened at one end with the insides licked clean, a few skunk tracks in the dirt."), anim: "a breeze rolls one empty eggshell slightly" }),
  S(10, "And you'll usually smell it, honey", "st", "st_skunk.1"),
  S(10, "A skunk can kill a hen now and then", "av", "av"),
  // ── FOX / COYOTE
  S(11, "", "st", "st_fox.1"),
  S(11, "and maybe a trail of feathers", "bi", "b_feathertrail", { p: BI(`A trail of scattered reddish-brown feathers leading across the grass from ${YARD.split(":")[0]} toward the edge of the woods, early morning dew.`), anim: "the feathers along the trail stir in the breeze" }),
  S(11, "especially in the fall", "st", "st_autumn.1"),
  S(11, "Foxes will come in the daytime too", "st", "st_fox.2"),
  S(12, "", "st", "st_coyote.1"),
  S(12, "and they'll go right over a short fence", "av", "av"),
  // ── HAWK / OWL
  S(13, "", "st", "st_hawk.1"),
  S(13, "with a circle of plucked feathers", "c", "OpSignCard", { props: { bed: "b_featherring", see: "a circle of plucked feathers in the open", means: "a hawk", ok: false } }),
  S(13, "If a hawk gets a hen", "st", "st_hawk.2"),
  S(14, "", "st", "st_owl.1"),
  S(14, "If your hens roost outside", "bi", "b_openrun", { p: BI(`A chicken run with no roof at dusk on a small farm, ${HENS} roosting on a low branch inside it in the open, a big bare tree overhead against the purple sky.`), anim: "the dusk light fades over the open run" }),
  S(14, "You'll often find a hen with the head and neck eaten", "st", "st_owl.2"),
  // ── DOGS
  S(15, "", "av", "av"),
  S(15, "A dog kills for the fun of it", "bi", "b_dogaftermath", { p: BI(`${YARD} the morning after: feathers scattered all over the grass and mud, the wire fence pushed over at one corner, a fresh hole dug under it, an empty quiet yard, nothing gory.`), anim: "feathers drift across the empty yard in the wind" }),
  S(15, "Holes dug under the fence", "st", "st_dog.1"),
  S(15, "It's a terrible thing to find", "av", "av"),
  S(15, "Feathers all over the yard", "st", "st_dog.2"),
  S(16, "", "st", "st_snake.1"),
  S(16, "Rats take chicks and eggs", "st", "st_rat.1"),
];
