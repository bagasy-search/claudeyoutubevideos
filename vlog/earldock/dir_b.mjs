// DIRECTOR B — la parte honesta (importado de criadero), leer la bolsa, el conteo, restoranes, cómo pagar menos
// (1-6), el cartel de "fresh" (p18-32)
import { S, BI, HZP, SHED, HARBOR, DECK, STORE, KITCHEN } from "./dir_lib.mjs";
import { LADY } from "./dir_a.mjs";
export const SHOTS = [
  S(18, "", "av", "av"),
  S(19, "", "av", "av"),
  S(19, "this is where you can get taken", "st", "st_store.2"),
  S(20, "", "c", "ElNineOfTen", { props: { n: 9, of: 10, tag: "imported", odd: "US", caption: "most shrimp eaten in America is imported" } }),
  S(20, "farmed in big ponds and shipped here frozen", "st", "st_shrimpfarm.1"),
  S(20, "with a picture of a shrimp boat on the bag", "bi", "b_boatbag", { p: BI("Close view of a hand holding a bag of frozen shrimp in a grocery store aisle, the front of the bag printed with a painting of a shrimp boat at sunset, the freezer case behind."), anim: "the hand turns the bag toward the light" }),
  S(21, "", "c", "ElBagReader", { props: { title: "turn the bag over", lines: [{ k: "country of origin", v: "Product of USA" }, { k: "wild caught or farm raised", v: "Wild caught" }, { k: "ingredients: shrimp", v: "Ingredients: shrimp, salt" }, { k: "the count", v: "16/20 per lb" }], every: 40, bed: "b_boatbag" } }),
  S(21, "you're paying wild prices for farmed shrimp", "av", "av"),
  S(22, "", "c", "ElLabelLine", { props: { line: "ingredients:", means: "shrimp. that's it.", good: true, bed: "b_boatbag" } }),
  S(22, "Watery shrimp shrink in the pan", "bi", "b_shrink", { p: BI(`A skillet on a stove in ${KITCHEN.split(":")[0]} with a handful of small shrimp swimming in a pool of milky water, steam rising.`), anim: "the water bubbles around the shrimp" }),
  S(23, "", "c", "ElCountSize", { props: { counts: [{ c: "16/20", note: "16 to 20 per pound" }, { c: "26/30", note: "26 to 30 per pound" }, { c: "41/50", note: "small" }], every: 36, bed: "st_shrimp.3" } }),
  S(24, "", "av", "av"),
  S(24, "A plate of fried shrimp", "bi", "b_friedplate", { p: BI("A plate of golden fried shrimp with french fries, coleslaw and hush puppies on a red checkered paper liner in a coastal seafood restaurant, a sweet tea beside it."), anim: "steam rises from the fried shrimp" }),
  S(24, "ask them where the shrimp came from", "av", "av"),
  // ── PAGAR MENOS
  S(25, "", "av", "av"),
  S(26, "", "c", "ElCoolerBoard", { props: { title: "pay less, get better", rows: [{ item: "1 · buy at the dock" }, { item: "2 · buy in bulk, in season" }, { item: "3 · inland: frozen, USA, wild" }, { item: "4 · frozen, not thawed" }, { item: "5 · do the math on heads on" }, { item: "6 · read the bag with your hands", hi: true }], every: 30, bed: "b_dockbuy" } }),
  S(26, "Call ahead and ask when the boats come in", "bi", "b_dockbuy", { p: BI(`On a shrimp dock in Biloxi: a young couple buying shrimp from a fisherman, the shrimp poured from a basket into a plastic bag on a hanging scale, ice chests on the dock.`), anim: "the shrimp pour into the bag" }),
  S(26, "best gumbo you ever had", "st", "st_gumbo.1"),
  S(27, "", "st", "st_harbor.1"),
  S(27, "That's when you buy ten or twenty pounds", "bi", "b_bulk", { p: BI(`The back of an SUV parked at a Gulf Coast seafood market with two big ice chests open, full of heads-on shrimp on ice, a man closing one lid.`), anim: "the man closes the cooler lid" }),
  S(28, "", "bi", "b_shipbox", { p: BI(`On a kitchen table: a styrofoam shipping cooler opened, with wisps of dry ice vapor, and bags of frozen wild Gulf shrimp inside.`), anim: "dry ice vapor drifts out of the box" }),
  S(29, "", "bi", "b_thawed", { p: BI(`${STORE}: a seafood counter with a mound of thawed shrimp on crushed ice behind the glass, a small card on a plastic pick.`), anim: "an employee scoops shrimp from the pile" }),
  S(29, "take it home, and thaw it yourself", "av", "av"),
  S(30, "", "av", "av"),
  S(31, "", "bi", "b_bagfeel", { p: BI("Close view of two hands squeezing a bag of frozen shrimp in a grocery store freezer aisle, the individual frozen shrimp moving loose inside the bag."), anim: "the hands squeeze the bag and the shrimp shift" }),
  S(31, "White, dry looking spots on the shrimp are freezer burn", "st", "st_frozen.1"),
  S(32, "", "bi", "b_freshsign", { p: BI(`${STORE}: a seafood counter with a hand-lettered sign stuck in the shrimp that says FRESH, the shrimp looking pale on the ice.`), anim: "the shrimp glisten under the light" }),
  S(32, "previously frozen", "av", "av"),
];
export const BEDS = [];
