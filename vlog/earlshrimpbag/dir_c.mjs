// DIRECTOR C — el otro lado (importado no es veneno), inspección, mercurio, lo que Earl se lleva a casa, el boil sin
// hervir (C vs O), cierre con las 3 líneas, comprarle a los barcos, CTA (p34-47)
import { S, BI, HZP, SHED, HARBOR, DECK, STORE, KITCHEN } from "./dir_lib.mjs";
export const SHOTS = [
  S(34, "", "av", "av"),
  S(34, "Some of those farms do a good job", "st", "st_shrimpfarm.5"),
  S(34, "If imported is what fits your budget", "st", "st_grocery.1"),
  S(34, "You're not doing anything wrong", "av", "av"),
  S(35, "", "av", "av"),
  S(35, "Only a small slice of the seafood", "st", "st_container.2"),
  S(35, "A percent or two", "c", "ElCoolerBoard", { props: { title: "imported seafood", rows: [{ item: "checked by an inspector", price: "1–2%", hi: true }, { item: "just goes on through", price: "the rest" }], every: 40, bed: "st_container.3" } }),
  S(35, "So you're trusting the farm", "av", "av"),
  S(36, "", "av", "av", { ov: { c: "ElAsk", props: { question: "What does the bag in YOUR freezer say?" } } }),
  S(36, "Shrimp is about as low in mercury", "bi", "b_shrimpplate", { p: BI(`On a table covered with newspaper in ${KITCHEN.split(":")[0]}: a big platter of boiled pink Gulf shrimp with lemon wedges and a little bowl of cocktail sauce, a glass of iced tea.`), anim: "a hand reaches in and takes a shrimp from the platter" }),
  // ── LO QUE EARL SE LLEVA A CASA
  S(37, "", "hz", "h_homebag", { p: HZP("He takes a plain frosty frozen block of shrimp out of a chest freezer in the back of the shed and holds it up toward the camera with a knowing look.") }),
  S(37, "I take the frozen ones", "bi", "b_frozenatsea", { p: BI(`${DECK} at night: a crewman sliding flat frozen blocks of shrimp into a hold freezer on board, frost billowing out, work lights above.`), anim: "frost billows out as the frozen blocks slide into the freezer" }),
  S(37, "are better than fresh shrimp that sat on ice", "bi", "b_oldice", { p: BI("A supermarket seafood counter late in the day: a tired-looking pile of raw peeled shrimp sitting in half-melted ice water behind the glass, a few dull grey shrimp, a price card."), anim: "the melted ice water drips slowly at the edge of the pile" }),
  S(38, "", "c", "ElCoolerBoard", { props: { title: "Earl's bag", rows: [{ item: "frozen at sea" }, { item: "wild caught" }, { item: "product of USA" }, { item: "ingredients: shrimp", hi: true }], every: 26, stamp: "that's my bag", stampGood: true, bed: "b_usabag" } }),
  S(38, "And I buy them with the heads on", "bi", "b_headson", { p: BI(`A pile of whole raw heads-on Gulf white shrimp with long antennae on crushed ice in ${SHED.split(":")[0]}, glistening, very fresh.`), anim: "the antennae of the shrimp shift as ice settles" }),
  S(38, "the heads make the best stock", "bi", "b_stock", { p: BI(`On an old gas stove in ${KITCHEN.split(":")[0]}: a big pot of shrimp heads and shells simmering in water with an onion, celery and bay leaves, steam rising.`), anim: "the stock simmers and steam rises from the pot" }),
  // ── EL BOIL SIN HERVIR
  S(39, "", "av", "av"),
  S(39, "Everybody thinks we fry everything", "st", "st_fried.1"),
  S(39, "The best way to eat a good shrimp", "st", "st_boil.1"),
  S(39, "because they boil the shrimp", "av", "av"),
  S(40, "", "hz", "h_pot", { p: HZP("He stands at the old gas stove dropping a halved lemon and bay leaves into a big steaming aluminum pot, a bag of crab boil seasoning open on the counter, looking at the camera.", KITCHEN) }),
  S(40, "and your crab boil seasoning", "bi", "b_seasoning", { p: BI(`Close view of a big aluminum pot of water on a gas burner in ${KITCHEN.split(":")[0]}: an older dark hand pouring a heavy stream of red crab boil seasoning powder into the water, lemon halves and bay leaves floating.`), anim: "the red seasoning pours into the pot and swirls" }),
  S(40, "Bring it to a hard boil", "st", "st_pot.1"),
  S(41, "", "av", "av"),
  S(41, "Turn the fire off", "bi", "b_knob", { p: BI("Close view of an older dark-skinned man's hand turning the knob of an old gas stove to off, the blue flame under a big aluminum pot going out, steam rolling over the rim."), anim: "the hand turns the knob and the blue flame goes out" }),
  S(41, "Then drop the shrimp in", "bi", "b_drop", { p: BI(`${KITCHEN}: a colander full of raw grey heads-on Gulf shrimp being tipped into the big steaming pot of red seasoned water, splash and steam.`), anim: "the raw shrimp slide from the colander into the steaming water" }),
  S(41, "Let them sit in that hot water", "c", "ElCO3D", { props: { cAt: 30, oAt: 600, title: "Mama's rule" } }),
  S(42, "", "c", "ElCO3D", { props: { cAt: -40, oAt: 4, title: "Mama's rule" } }),
  S(42, "That's how my mama taught me", "av", "av"),
  S(43, "", "bi", "b_icetray", { p: BI(`${KITCHEN.split(":")[0]}: a slotted spoon dumping steaming bright pink boiled shrimp onto a sheet pan heaped with ice cubes, lemon pieces mixed in.`), anim: "the steaming pink shrimp spill onto the ice" }),
  S(43, "Peel them at the table", "hz", "h_peel", { p: HZP("He sits at a kitchen table covered with newspaper peeling a pink boiled shrimp, a big pile of boiled shrimp and lemon wedges in front of him, laughing toward someone off camera.", KITCHEN) }),
  S(43, "and call your family in", "st", "st_family.1"),
  // ── CIERRE
  S(44, "", "av", "av"),
  S(44, "turn it over", "c", "ElCoolerBoard", { props: { title: "3 lines · 10 seconds", rows: [{ item: "1. the country" }, { item: "2. wild or farm raised" }, { item: "3. ingredients: one word", hi: true }], every: 40, bed: "st_freezer.9" } }),
  S(45, "", "st", "st_harbor.4"),
  S(45, "Every pound you buy off a boat", "hz", "h_dockwave", { p: HZP("He stands on the wooden dock beside a moored shrimp trawler at sunset, one hand resting on a piling, looking out at the boats, then toward the camera.", HARBOR) }),
  S(45, "There aren't many of us left", "st", "st_gulfsunset.1"),
  S(46, "", "av", "av", { ov: { c: "ElSubscribe", props: {} } }),
  S(47, "", "av", "av"),
  S(47, "Turn the bag over, and tell me", "av", "av2", { ov: { c: "ElAsk", props: { question: "Country, and wild or farmed?" } } }),
  S(47, "I'll see you on the dock", "st", "st_shrimpboat.4"),
];
export const BEDS = [
  { name: "b_pelicanbag", p: BI("Close view of the back of a frozen shrimp bag printed with a small pelican logo and the line Packed in Louisiana, and much smaller below it Product of Vietnam, Farm Raised, frost on the plastic.") },
];
