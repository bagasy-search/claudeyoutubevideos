// DIRECTOR C — volver al amanecer, descargar en el muelle, la cuenta, por qué se amarran los barcos, comprarle a los
// barcos, cierre (p26-37)
import { S, BI, HZP, SHED, HARBOR, DECK, STORE, KITCHEN } from "./dir_lib.mjs";
export const SHOTS = [
  S(26, "", "bi", "b_comehome", { p: BI(`Sunrise over the channel into a Gulf Coast shrimp harbor: a loaded shrimp trawler riding low coming in toward the docks, pelicans on the pilings, other boats behind, golden mist on the water.`), anim: "the trawler glides in through the golden mist" }),
  S(26, "Pelicans on the pilings", "st", "st_pelican.1"),
  S(26, "That's my favorite part", "hz", "h_dawn", { p: HZP("At sunrise he stands at the stern rail of his trawler coming into the harbor holding a mug of coffee in both hands, looking out at the pelicans and the docks with a quiet tired smile.", DECK.replace("at night", "at sunrise")) }),
  // ── EL MUELLE
  S(27, "", "bi", "b_unload", { p: BI(`${HARBOR} early morning: baskets of iced shrimp being swung up out of a trawler's hold onto the dock by a small crane, a dock worker stacking them beside a big scale.`), anim: "a basket of shrimp swings up out of the hold onto the dock" }),
  S(27, "and they get weighed and graded", "st", "st_market.1"),
  S(27, "The dock pays by the pound", "bi", "b_dockboard", { p: BI("A worn whiteboard on the wall of a shrimp dock office listing today's prices per pound by shrimp size count, heads on, written in marker, a clipboard and a calculator on a desk below."), anim: "a hand writes a new number on the whiteboard" }),
  // ── LA CUENTA
  S(28, "", "av", "av"),
  S(28, "That's about forty-two hundred dollars", "c", "ElCoolerBoard", { props: { title: "a good night", rows: [{ item: "1,200 lb, heads on" }, { item: "x $3.50 a pound" }, { item: "at the dock", price: "$4,200" }], every: 30, bed: "st_shrimp.3" } }),
  S(28, "Sounds pretty good, doesn't it", "av", "av"),
  S(28, "Let's say we brought in", "st", "st_market.2"),
  S(28, "Let's say three and a half", "av", "av"),
  S(29, "", "st", "st_fuel.2"),
  S(29, "At three fifty a gallon", "c", "ElMoneyFall", { props: { start: { label: "1,200 lb at the dock", amount: 4200 }, minus: [{ label: "fuel, 300 gallons", amount: 1050 }, { label: "ice", amount: 200 }, { label: "groceries, nets, repairs", amount: 250 }, { label: "two strikers' shares", amount: 1300 }], endLabel: "for the boat, the payments & the captain", every: 75, title: "a good night · the math" } }),
  S(30, "", "av", "av"),
  S(30, "And whatever's left goes to the boat", "av", "av"),
  S(30, "On a bad night, you lost money", "av", "av"),
  S(31, "", "av", "av"),
  S(31, "Then somebody processes them", "bi", "b_plant", { p: BI("Inside a shrimp processing plant: workers in white aprons and hairnets heading and peeling shrimp at a long stainless table, conveyor belts, boxes being packed and frozen."), anim: "the workers' hands peel shrimp quickly at the table" }),
  S(31, "and the store puts them out", "bi", "b_storeprice", { p: BI(`In ${STORE}: a shelf price tag reading 15.99 lb under bags of frozen peeled shrimp, fluorescent light, a shopper's hand reaching in.`), anim: "the shopper's hand takes a bag from the shelf" }),
  S(31, "Out of every one of those dollars", "c", "ElCoolerBoard", { props: { title: "every dollar you pay", rows: [{ item: "the store, the truck, the plant" }, { item: "the man who caught it", price: "a small slice", hi: true }], every: 40, bed: "b_storeprice" } }),
  S(32, "", "av", "av"),
  S(32, "a lot of these boats are tied up for good", "bi", "b_tiedup", { p: BI(`${HARBOR}: a row of old shrimp trawlers tied up and unused, peeling paint, rust, nets rotting on the booms, weeds growing on the dock, a FOR SALE sign hanging on one rail.`), anim: "the old boats creak and sway slightly at their moorings" }),
  S(32, "the imported shrimp from the big ponds", "st", "st_harbor.3"),
  S(32, "There used to be hundreds of boats", "av", "av"),
  // ── COMPRARLE A LOS BARCOS
  S(33, "", "bi", "b_buyboat", { p: BI(`${HARBOR}: a fisherman on the back of a moored shrimp boat handing a bag of fresh heads-on shrimp down to a smiling older couple on the dock, a hand-written SHRIMP FOR SALE sign on the rail.`), anim: "the fisherman hands the bag down to the couple" }),
  S(33, "If you're inland, look for wild caught", "c", "ElLabelLine", { props: { line: "Product of USA · Wild Caught", means: "that's a boat like mine", good: true, bed: "b_handful" } }),
  S(34, "", "av", "av"),
  S(34, "And it keeps those turtle grids", "st", "st_turtle.2"),
  S(34, "and somebody sorting by hand", "st", "st_catch.3"),
  // ── CIERRE
  S(35, "", "c", "ElNightClock", { props: { from: "3:30 pm", to: "7:00 am", label: "ice · fuel · coffee · nets · luck" } }),
  S(36, "", "av", "av", { ov: { c: "ElSubscribe", props: {} } }),
  S(37, "", "av", "av"),
  S(37, "I'd love to hear where", "av", "av2", { ov: { c: "ElAsk", props: { question: "Ever bought shrimp right off a boat? Where?" } } }),
  S(37, "I'll see you on the dock", "st", "st_sunrise.2"),
];
export const BEDS = [];
