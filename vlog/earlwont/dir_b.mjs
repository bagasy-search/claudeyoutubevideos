// DIRECTOR B — #4 red snapper, #5 orange roughy, #6 tiburón, resumen (p16-27)
import { S, BI, HZP, SHED, HARBOR, DECK, STORE, KITCHEN } from "./dir_lib.mjs";
import { SIX } from "./dir_a.mjs";
export const SHOTS = [
  S(16, "", "av", "av"),
  S(16, "the boats around here catch it in season", "bi", "b_snapperboat", { p: BI(`${HARBOR}: a fisherman on a small charter boat at the dock holding up a big bright pinkish-red red snapper by the gills, smiling, a cooler of more snapper behind him.`), anim: "the fisherman lifts the red snapper higher" }),
  S(16, "testing has found that a lot of fish sold as red snapper", "c", "ElClipping", { props: { kicker: "SEAFOOD TESTING", headline: "Much of the fish sold as \"red snapper\" in U.S. stores and restaurants turned out to be another fish", bed: "b_labels" } }),
  S(16, "Cheaper fish, with a more expensive name", "st", "st_fillets.2"),
  S(17, "", "av", "av"),
  S(17, "Buy it whole, with the head and the skin on", "bi", "b_wholesnapper", { p: BI(`A whole fresh red snapper on crushed ice in ${SHED.split(":")[0]}, pinkish red all over with a red eye and a pointed face, an older dark-skinned finger pointing at its eye.`), anim: "the finger points at the snapper's red eye" }),
  S(17, "Once it's a skinless white fillet", "bi", "b_whitefillet", { p: BI("A skinless white fish fillet in a supermarket tray labeled Red Snapper Fillet with a price sticker reading 5.99 lb, under plastic wrap."), anim: "the light glints across the plastic wrap" }),
  S(17, "A real red snapper is a pretty pinkish red", "st", "st_snapper.2"),
  S(17, "you're trusting the label", "av", "av"),
  S(18, "", "c", "ElCoolerBoard", { props: { title: "\"red snapper\" fillets", rows: [{ item: "real red snapper", price: "never cheap" }, { item: "fillets for $6 a pound", price: "not snapper", hi: true }], every: 40, bed: "b_whitefillet" } }),
  S(19, "", "st", "st_snapper.1"),
  S(19, "Or other Gulf snappers and groupers", "bi", "b_grouper", { p: BI(`Whole Gulf grouper and vermilion snapper on ice in ${SHED.split(":")[0]} with handwritten tags naming each fish, a hanging scale behind.`), anim: "a gloved hand adjusts the name tag on the grouper" }),
  // ── 5 · ORANGE ROUGHY
  S(20, "", "bi", "b_roughy", { p: BI("A frozen orange roughy fillet package on a supermarket freezer shelf next to a picture card of the deep-sea orange fish with big eyes, frost on the glass."), anim: "the freezer door opens and the frost clears" }),
  S(20, "it can live more than a hundred years", "c", "ElCoolerBoard", { props: { title: "orange roughy", rows: [{ item: "can live", price: "100+ years", hi: true }, { item: "grows slow, has young late" }, { item: "mercury list", price: "go easy", hi: true }], every: 40, bed: "st_deepsea.1" } }),
  S(20, "It's on that same list", "st", "st_deepsea.2"),
  S(20, "And second, a fish that old", "av", "av"),
  S(21, "", "av", "av"),
  S(21, "But it doesn't sit right with me", "hz", "h_shake", { p: HZP("He stands at the edge of his shed looking out at the boats with his hands on his hips, shaking his head slowly, thoughtful.") }),
  S(21, "so somebody can have a mild white fillet", "st", "st_fillets.4"),
  S(22, "", "bi", "b_flounder", { p: BI(`Fresh whole Gulf flounder, black drum and sheepshead laid out on crushed ice in ${SHED.split(":")[0]}, glistening, a handwritten price sign leaning on the cooler.`), anim: "a gloved hand straightens the flounder on the ice" }),
  S(22, "Mild, white, flaky, and plentiful", "st", "st_fishmarket.1"),
  // ── 6 · TIBURÓN
  S(23, "", "st", "st_shark.1"),
  S(23, "Shark is one of the fish highest in mercury", "c", "ElLabelLine", { props: { line: "Shark steak", means: "high in mercury", good: false, bed: "b_sharksteak" } }),
  S(23, "Sharks don't get rid of waste", "av", "av"),
  S(23, "the meat can turn and smell like ammonia", "hz", "h_sniffshark", { p: HZP("He holds a shark steak wrapped in butcher paper up near his nose and pulls back with a disgusted face, in his seafood shed.") }),
  S(23, "If a shark isn't bled and iced", "st", "st_shark.4"),
  S(24, "", "bi", "b_releaseshark", { p: BI(`${DECK}: a deckhand sliding a small shark from the sorting table back over the rail into the dark water under the work lights.`), anim: "the shark slides over the rail into the water" }),
  S(24, "I won't sell shark meat in my shed", "av", "av"),
  S(25, "", "bi", "b_mahi", { p: BI(`Thick fresh mahi-mahi and cobia steaks on crushed ice in ${SHED.split(":")[0]}, an older dark-skinned hand lifting one, a grill visible outside the shed.`), anim: "the hand lifts the steak off the ice" }),
  S(25, "great on the grill", "st", "st_grill.2"),
  // ── RESUMEN
  S(26, "", "c", "ElCoolerBoard", { props: { title: "6 fish I won't sell", rows: SIX, every: 18, stamp: "not in my shed", bed: "st_market.3" } }),
  S(27, "", "av", "av"),
  S(27, "But you deserve to know what you're buying", "st", "st_seafoodcounter.3"),
];
