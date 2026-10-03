// DIRECTOR B — cómo darte cuenta (bolsa, frente, precio), por qué lo hacen, la prueba de los dedos y de la sartén,
// descongelar y secar (p10-19)
import { S, BI, HZP, SHED, HARBOR, DECK, STORE, KITCHEN } from "./dir_lib.mjs";
export const SHOTS = [
  // ── LA BOLSA
  S(15, "", "c", "ElBag3D", { props: { title: "WILD GULF", lines: ["Ingredients: shrimp.", "Contains: shellfish (shrimp).", "Wild caught · Product of USA", "Keep frozen"], hi: [0], zoom: "Ingredients: shrimp.", verdict: "one ingredient", flipAt: 8, caption: "turn it over" } }),
  S(15, "Maybe salt", "c", "ElIngredients", { props: { title: "INGREDIENTS:", items: ["Shrimp", "water", "salt", "sodium tripolyphosphate"], bad: 3, stamp: "put it back", bed: "st_frozen.4" } }),
  S(15, "If you see sodium bisulfite", "av", "av"),
  S(16, "", "bi", "b_front", { p: BI(`In ${STORE.split(":")[0]}: an older dark-skinned hand holding a frozen bag of shell-on shrimp, the front printed with a small green badge reading NO ADDED PHOSPHATES under a drawing of a shrimp boat.`), anim: "the hand turns the bag so the badge catches the light" }),
  S(16, "no added phosphates", "c", "ElLabelLine", { props: { line: "no added phosphates", means: "worth looking for", good: true, bed: "b_front" } }),
  S(17, "", "c", "ElCoolerBoard", { props: { title: "price per pound", rows: [{ item: "bag A", price: "$11.99" }, { item: "bag B", price: "$6.49", hi: true }], every: 40, bed: "b_pricebags" } }),
  S(17, "Sometimes the answer is water", "av", "av"),
  // ── POR QUÉ
  S(18, "", "av", "av"),
  S(18, "Shrimp are sold by weight", "bi", "b_boxes", { p: BI("A cold storage warehouse aisle with tall stacks of waxed cardboard boxes of frozen shrimp on wooden pallets, a pallet jack, frost on the metal shelves, cold white light."), anim: "a forklift slides a pallet out of the stack" }),
  S(18, "And water is the cheapest thing in the world", "st", "st_water.1"),
  S(18, "That somebody isn't you", "av", "av"),
  S(19, "", "av", "av"),
  S(19, "But I froze shrimp on my boat", "st", "st_shrimpboat.2"),
  S(19, "Cold, fast, and clean", "bi", "b_brine", { p: BI(`${DECK}: a deckhand in orange rubber overalls shoveling crushed ice over a hatch full of fresh shrimp, steam of cold air rising.`), anim: "the shovel throws crushed ice over the shrimp" }),
  // ── LOS DEDOS
  S(22, "", "av", "av"),
  S(22, "Thaw a few shrimp in a bowl", "bi", "b_bowl", { p: BI(`In ${KITCHEN.split(":")[0]}: a glass bowl of frozen raw shrimp on a refrigerator shelf next to a carton of eggs and a jug of tea, the fridge light on.`), anim: "the fridge door swings open and the light hits the bowl" }),
  S(22, "and rub it between your fingers", "hz", "h_rub", { p: HZP("He holds one thawed raw shrimp between his thumb and finger close to the camera and rubs it, studying it with a squint.", KITCHEN) }),
  S(23, "", "bi", "b_sticky", { p: BI("Extreme close view of an older dark-skinned thumb and finger pinching a firm, matte, grey-pink raw shrimp, the shrimp slightly sticking to the skin as the fingers part."), anim: "the fingers part and the shrimp clings to the thumb" }),
  S(23, "A soaked shrimp feels slick", "bi", "b_slick", { p: BI("Extreme close view of a glassy, swollen, almost see-through raw shrimp slipping out from between two wet fingers over a white bowl."), anim: "the shrimp slips out from between the fingers" }),
  S(23, "A soaked shrimp looks glassy", "av", "av"),
  S(23, "A good raw shrimp is a little gray", "st", "st_rawshrimp.1"),
  // ── LA SARTÉN
  S(24, "", "st", "st_pan.1"),
  S(24, "A good shrimp hits that pan", "bi", "b_sear", { p: BI(`Top view of a black cast iron skillet on ${KITCHEN.split(":")[0]} stove: big shrimp searing in a little oil, edges turning golden brown, tiny oil bubbles around them.`), anim: "the oil sizzles and the shrimp edges brown" }),
  S(24, "A soaked one goes quiet", "av", "av"),
  S(24, "Once you see it", "st", "st_pan.2"),
  // ── DESCONGELAR Y SECAR
  S(25, "", "av", "av"),
  S(25, "Best way, put the bag in the refrigerator", "st", "st_fridge.1"),
  S(25, "run cold water over it", "bi", "b_coldwater", { p: BI(`The sink of ${KITCHEN.split(":")[0]}: a zip plastic bag of frozen shrimp under a stream of cold tap water in a white enamel sink, the window over the sink behind.`), anim: "the cold water runs over the bag" }),
  S(25, "Never hot water, and never the microwave", "c", "ElCoolerBoard", { props: { title: "thawing", rows: [{ item: "fridge overnight", price: "best" }, { item: "cold water, 20 min", price: "ok" }, { item: "hot water · microwave", price: "mush", hi: true }], every: 30, bed: "b_coldwater" } }),
  S(26, "", "bi", "b_paper", { p: BI(`On the counter of ${KITCHEN.split(":")[0]}: raw peeled shrimp laid in a row on paper towels, an older hand patting them dry with another paper towel.`), anim: "the hand pats the shrimp dry" }),
  S(26, "A dry shrimp sears", "av", "av"),
];
export const BEDS = [
  { name: "b_pricebags", p: BI(`In ${STORE.split(":")[0]}: two different frozen shrimp bags side by side on a freezer shelf, each with a yellow shelf price tag below it, one tag much lower than the other.`) },
];
