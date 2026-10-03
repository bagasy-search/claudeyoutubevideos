// DIRECTOR A — minuto 1 (el camarón con gusto a jabón en el asado del vecino) + Earl + qué es el fosfato + el remojo (p0-9)
import { S, BI, HZP, SHED, HARBOR, DECK, STORE, KITCHEN } from "./dir_lib.mjs";
const YARD = "a small backyard cookout in a Mississippi neighborhood: a folding table with a checkered plastic tablecloth, paper plates, a charcoal grill smoking, lawn chairs, a live oak and a wooden fence";
const NEIGH = "a heavyset white man in his forties with a red baseball cap and a grey t-shirt";
export const SHOTS = [
  // ── MINUTO 1
  S(0, "", "vl", "m1"),
  S(0, "Big, pretty, pink shrimp", "bi", "b_plate", { p: BI(`Close view of a paper plate on ${YARD.split(":")[0]}: a heap of big shiny pink peeled cooked shrimp, plump and glossy, a lemon wedge and a plastic fork, the grill smoking behind.`), anim: "a hand reaches in and picks up one glossy shrimp" }),
  S(0, "I took one bite", "hz", "h_bite", { p: HZP(`He sits at the cookout table and bites into one pink shrimp, his face starting to sour, a paper plate of shrimp in front of him.`, YARD) }),
  S(0, "and I put it down", "st", "st_cookout.1"),
  S(0, "Earl, what's wrong with it", "bi", "b_neighbor", { p: BI(`${NEIGH} standing at ${YARD.split(":")[0]} with grill tongs in one hand, palms up, a puzzled half-laughing face, looking at someone off camera, smoke from the grill behind him.`), anim: "the man shrugs with the tongs, puzzled" }),
  S(0, "these taste like soap", "vl", "m2"),
  S(1, "", "bi", "b_neighborbite", { p: BI(`${NEIGH} at ${YARD.split(":")[0]} chewing a shrimp, his laugh freezing into a frown, one eyebrow up, a paper plate in his hand.`), anim: "he stops chewing and frowns" }),
  S(1, "Because once you know that taste", "av", "av"),
  S(1, "Slick on your tongue", "st", "st_shrimp.1"),
  S(1, "and the shrimp is soft and rubbery", "bi", "b_rubbery", { p: BI("Extreme close view of a fork pressing into a pale, glossy, swollen cooked shrimp on a paper plate; the shrimp bends like rubber instead of breaking."), anim: "the fork presses and the shrimp bounces back like rubber" }),
  S(2, "", "av", "av"),
  S(2, "That shrimp was soaked in something", "c", "ElLabelLine", { props: { line: "soaked before the store", means: "not your cooking", good: false, bed: "st_frozen.1" } }),
  S(2, "what it is", "av", "av"),
  S(2, "why they do it", "st", "st_fishmarket.4"),
  S(2, "the one line on the bag that tells you", "st", "st_frozen.2"),
  S(2, "a five second check you can do", "bi", "b_fingers", { p: BI(`In ${KITCHEN.split(":")[0]}: an older dark-skinned hand holding one thawed raw shrimp between thumb and finger over a white bowl of thawed shrimp, the sink and window behind.`), anim: "the fingers rub the shrimp slowly" }),
  S(2, "and the way we kept shrimp", "st", "st_shrimpboat.1"),
  // ── EARL
  S(3, "", "av", "av", { ov: { c: "ElNameTag", props: { name: "Earl", line: "31 years on a shrimp boat · Biloxi" } } }),
  S(3, "and now I sell what comes off the boats", "hz", "h_shed", { p: HZP("He scoops raw Gulf shrimp from a cooler of crushed ice into a plastic bag for a customer, glancing at the camera.") }),
  S(3, "And I'll tell you the truth", "av", "av"),
  S(3, "They think shrimp is supposed to taste like that", "st", "st_seafoodcounter.1"),
  // ── QUÉ ES
  S(6, "", "av", "av"),
  S(6, "The most common one has a long name", "c", "ElCoolerBoard", { props: { title: "look for these words", rows: [{ item: "sodium tripolyphosphate", hi: true }, { item: "sodium phosphate" }, { item: "anything with \"phosphate\"" }], every: 30, bed: "st_frozen.3" } }),
  S(7, "", "av", "av"),
  S(7, "It's used in a lot of foods", "st", "st_grocery.1"),
  S(7, "and here's why it's in there", "av", "av"),
  // ── EL REMOJO
  S(8, "", "c", "ElSoakSwell", { props: { bed: "b_tank", title: "what the soak does", tank: "phosphate soak", scaleLabel: "you pay by the pound", tag: "+ water" } }),
  S(8, "It looks plump and shiny", "bi", "b_case", { p: BI(`A supermarket seafood case under bright light: a tray of very plump, shiny, glassy raw peeled shrimp on crushed ice with a small price card, the glass front reflecting the aisle.`), anim: "the light glints across the shiny shrimp" }),
  S(9, "", "av", "av"),
  S(9, "Water that was put there on purpose", "bi", "b_scale", { p: BI("A digital kitchen scale on a counter holding a clear plastic bag of thawed raw shrimp, a little pool of cloudy water collected in the corner of the bag."), anim: "the bag settles and the water slides to the corner" }),
  S(10, "", "av", "av"),
  S(10, "You put soaked shrimp in a hot pan", "c", "ElPanDuel", { props: { bed: "b_stove", left: "untreated", right: "soaked", meter: "sizzle" } }),
  S(10, "They boil in their own juice", "bi", "b_milky", { p: BI(`Top view of a black cast iron skillet on ${KITCHEN.split(":")[0]} stove: pale curled shrimp sitting in a shallow puddle of milky white bubbling liquid, no browning at all, steam rising.`), anim: "the milky liquid bubbles around the pale shrimp" }),
  S(10, "And that's where the soapy taste comes from", "av", "av"),
  S(12, "", "av", "av"),
  S(12, "A sulfite, usually sodium bisulfite", "c", "ElLabelLine", { props: { line: "sodium bisulfite", means: "stops black spots", good: false, bed: "b_blackspot" } }),
  S(12, "A little black on the shell", "bi", "b_blackspot", { p: BI("Close view of a few raw shell-on Gulf shrimp on crushed ice, one of them with small dark black spots along the shell segments, water droplets on the shells."), anim: "melting ice shifts under the shrimp" }),
  S(12, "But some people are sensitive to sulfites", "av", "av"),
];
export const BEDS = [
  { name: "b_tank", p: BI("A big clear plastic tub of cloudy water on a stainless steel table in a seafood processing room, raw peeled shrimp floating in it, white tiled walls.") },
  { name: "b_stove", p: BI(`An old gas stove top in ${KITCHEN.split(":")[0]} with two black cast iron skillets on the burners, blue flames, a dish towel on the oven handle.`) },
];
