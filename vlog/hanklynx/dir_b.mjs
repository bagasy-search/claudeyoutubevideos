// DIRECTOR B — los dos lados: el pastor de ovejas, la mujer del café, las preguntas difíciles, los castores del Tay,
// los gatos monteses legales (p15-35)
import { S, BI, HZP, ROAD, RANCH, FARM, COAST, FOREST } from "./dir_lib.mjs";
import { LYNX } from "./dir_a.mjs";
const FARMER = "a big white Scottish sheep farmer in his sixties with a grey beard, a flat cap and a waxed jacket";
const ADVOCATE = "a white Scottish woman in her forties with red hair in a ponytail, a fleece jacket and a scarf";
export const SHOTS = [
  S(15, "", "av", "av"),
  // ── EL PASTOR
  S(16, "", "bi", "b_farmer", { p: BI(`${FARMER} standing at a gate in ${RANCH.split(":")[0]}, two border collies sitting at his boots watching a field full of ewes, grey sky.`), anim: "the collies' heads turn toward the sheep" }),
  S(16, "He walked me out to a field full of ewes", "st", "st_sheep.2"),
  S(17, "", "av", "av"),
  S(17, "the eagles already take some of our lambs", "c", "ElCoolerBoard", { props: { title: "a hill farmer's year", rows: [{ item: "low prices" }, { item: "hard weather" }, { item: "eagles take lambs" }, { item: "+ a predator gone 1,000 years?", hi: true }], every: 28, bed: "b_farmer" } }),
  S(17, "The people who want them back don't have to pay for it", "bi", "b_farmer2", { p: BI(`Close view of ${FARMER} leaning on a stone wall, looking out over the hill with a hard face, wind in his beard.`), anim: "the farmer squints into the wind" }),
  S(18, "", "av", "av"),
  // ── LA DEFENSORA
  S(19, "", "bi", "b_cafe", { p: BI(`${ADVOCATE} sitting at a wooden table in ${COAST.split(":")[0]}, hands around a big mug of tea, talking, steamed-up windows behind her.`), anim: "she gestures with one hand while talking" }),
  S(20, "", "av", "av"),
  S(20, "It put the animals through misery", "bi", "b_cafe2", { p: BI(`Close view of ${ADVOCATE} in a Highland café, frowning and shaking her head slightly, a mug of tea in front of her.`), anim: "she shakes her head slowly" }),
  S(21, "", "st", "st_deer.2"),
  S(21, "like parts of Switzerland, France and Germany", "st", "st_alps.1"),
  S(22, "", "av", "av"),
  S(22, "ospreys, eagles, red squirrels and beavers", "st", "st_squirrel.1"),
  S(22, "tourists don't pay for my dead lambs", "av", "av"),
  S(23, "", "bi", "b_swissign", { p: BI("A little Swiss mountain village with wooden chalets and a painted sign at the edge of town with a picture of a lynx on it, snowy peaks behind."), anim: "snow drifts past the sign" }),
  S(24, "", "c", "ElLabelLine", { props: { line: "healthy wild lynx vs. people", means: "no recorded killings · they're afraid of us", good: true, bed: "b_lynxportrait" } }),
  S(25, "", "c", "FieldNote", { props: { lines: ["what she wants:", "a legal, careful trial", "wild lynx · collars · monitoring", "pay farmers · ask the locals"], bed: "b_cafe" } }),
  // ── LAS PREGUNTAS
  S(26, "", "av", "av"),
  S(27, "", "st", "st_pineforest.1"),
  S(27, "a few hundred lynx", "av", "av"),
  S(28, "", "st", "st_deer.3"),
  S(28, "People will still have to manage the deer", "av", "av"),
  S(29, "", "bi", "b_lambs", { p: BI("Ewes and young lambs grazing on a Highland hillside at the edge of a pine forest in spring, a stone wall running across the slope."), anim: "a lamb runs to its mother" }),
  S(29, "is losing money he doesn't have", "av", "av"),
  S(30, "", "av", "av"),
  S(30, "That's not a return of the wild", "c", "ElCoolerBoard", { props: { title: "captive-raised + dumped in winter", rows: [{ item: "don't know how to hunt" }, { item: "too comfortable near people" }, { item: "cars · starving · shot", hi: true }], every: 30, bed: "b_roadlynx" } }),
  S(31, "", "av", "av"),
  S(31, "a plan to put lynx back in a forest near the Scottish border", "st", "st_pineforest.2"),
  // ── CASTORES Y GATOS MONTESES
  S(32, "", "bi", "b_beaverdam", { p: BI("A beaver dam of sticks and mud across a small burn on farmland in Perthshire, Scotland, a flooded field behind it, a gnawed tree stump in the foreground."), anim: "water trickles over the dam" }),
  S(32, "Beavers had been gone from Scotland for centuries too", "st", "st_beaver.1"),
  S(33, "", "c", "HkGoneSince", { props: { title: "two that came back", items: [{ name: "beaver", gone: "centuries", back: "nobody asked · now protected", good: false }, { name: "wildcat", gone: "nearly", back: "the slow, legal way", good: true }], every: 20 } }),
  S(33, "Somebody breaks the rules, and the rest of us have to live with it forever", "av", "av"),
  S(34, "", "bi", "b_wildcat", { p: BI("A Scottish wildcat, like a big heavy tabby cat with a thick blunt ringed tail, crouching among heather and pine roots in the Cairngorms, wearing a thin radio collar."), anim: "the wildcat's tail flicks" }),
  S(34, "Some of those cats have even had kittens in the wild", "av", "av"),
  S(35, "", "av", "av"),
  S(35, "it's the only way that lasts", "c", "ElLabelLine", { props: { line: "slow, boring, legal", means: "the only way that lasts", good: true, bed: "b_wildcat" } }),
];
export const BEDS = [];
