// DIRECTOR A — minuto 1 (la señora del recibo de $16) + Earl + el barco y el precio de muelle + las cabezas +
// planta, frío, camión, mayorista, súper + la suma (p0-17)
import { S, BI, HZP, SHED, HARBOR, DECK, STORE, KITCHEN } from "./dir_lib.mjs";
export const LADY = "a white woman in her fifties with short blonde hair, a blue windbreaker and reading glasses pushed up on her head";
export const PLANT = "a shrimp processing plant on the Mississippi Gulf Coast: long stainless steel tables under bright lights, workers in white aprons, hairnets and rubber gloves, plastic tubs of shrimp and ice, a wet concrete floor";
export const SHOTS = [
  // ── MINUTO 1 (abre con Earl)
  S(0, "", "av", "av"),
  S(0, "with a grocery receipt in her hand", "bi", "b_receipt", { p: BI(`${LADY} standing on a weathered wooden shrimp dock holding up a long paper grocery receipt toward the camera, a shrimp boat tied up behind her, morning light.`), anim: "she shakes the receipt a little" }),
  S(0, "sixteen dollars a pound", "c", "ElCoolerBoard", { props: { title: "her receipt", rows: [{ item: "shrimp, 2 lb", price: "$16 / lb" }, { item: "off the boat in Biloxi", price: "$5 / lb", hi: true }], every: 26, bed: "b_receipt" } }),
  S(0, "Are y'all getting rich off me", "av", "av"),
  S(1, "", "av", "av"),
  S(1, "Where does the other eleven dollars go", "st", "st_shrimp.1"),
  S(2, "", "bi", "b_icechest", { p: BI(`On a shrimp dock in Biloxi: ${LADY} sitting on a big white ice chest, listening, while an older African American man in a denim shirt gestures with his hands, shrimp boats behind them.`), anim: "the man gestures as he talks" }),
  S(2, "Every hand that shrimp passes through", "st", "st_seafood.1"),
  S(3, "", "av", "av"),
  S(3, "Who's honest, who isn't", "st", "st_store.1"),
  S(3, "even if you live a thousand miles from the water", "av", "av"),
  // ── EARL
  S(4, "", "av", "av", { ov: { c: "ElNameTag", props: { name: "Earl", line: "31 years on a shrimp boat · Biloxi" } } }),
  S(4, "I sold off my own dock", "hz", "h_dock", { p: HZP("He stands behind a table of shrimp on ice at his dock, weighing a scoop of shrimp on a hanging scale for a customer, smiling.", HARBOR) }),
  // ── EL BARCO
  S(5, "", "st", "st_shrimpboat.1"),
  S(6, "", "av", "av"),
  S(6, "heads on, straight out of the hold", "bi", "b_hold", { p: BI(`${DECK}: a crewman in rubber boots shoveling whole heads-on shrimp and crushed ice out of the hold into plastic baskets at dawn, the harbor behind.`), anim: "the shovel lifts shrimp and ice" }),
  S(6, "Big shrimp bring more, small shrimp bring less", "st", "st_shrimp.2"),
  S(7, "", "c", "ElCoolerBoard", { props: { title: "before the shrimp hits the ice", rows: [{ item: "diesel (a lot)" }, { item: "ice" }, { item: "nets to mend" }, { item: "the crew's share" }, { item: "insurance + repairs", hi: true }], every: 26, bed: "b_hold" } }),
  S(7, "a lot of boats just stay tied up at the dock", "bi", "b_tiedup", { p: BI(`${HARBOR}: three shrimp boats tied up at the dock with their nets hoisted and nobody aboard, gulls on the rigging, an overcast afternoon.`), anim: "the boats rock gently at the dock" }),
  S(8, "", "av", "av"),
  // ── LAS CABEZAS
  S(9, "", "av", "av"),
  S(10, "", "c", "ElHeadsOff", { props: { title: "heads off", whole: "$5.00", tails: "$7.50", wholeW: "1 lb whole", tailsW: "≈ ⅔ lb of tails", note: "nobody cheated you — that's the head", bed: "b_hold" } }),
  S(12, "", "bi", "b_plant", { p: BI(`${PLANT}, workers heading shrimp by hand at the long tables.`), anim: "the workers' hands snap the heads off" }),
  S(12, "Then they get sorted by size", "bi", "b_sorter", { p: BI(`${PLANT}: a stainless steel shrimp grading machine with rollers, shrimp tumbling down into different bins by size.`), anim: "the shrimp tumble down the rollers" }),
  S(12, "Peeled and deveined shrimp cost a lot more", "st", "st_peel.1"),
  S(13, "", "bi", "b_freezer", { p: BI(`${PLANT}: white boxes of frozen shrimp stacked on pallets inside a big walk-in freezer, frost on everything, a worker in a heavy coat.`), anim: "cold fog drifts across the boxes" }),
  S(13, "But freezing costs money", "av", "av"),
  S(14, "", "bi", "b_truck", { p: BI("A white refrigerated tractor-trailer pulling out of a seafood plant onto a two-lane Mississippi highway at dusk, its marker lights on."), anim: "the truck pulls out onto the highway" }),
  S(14, "a warehouse somewhere charging rent", "st", "st_warehouse.1"),
  S(15, "", "st", "st_warehouse.2"),
  S(15, "People love to hate the middleman", "av", "av"),
  S(16, "", "bi", "b_case", { p: BI(`${STORE}: a long frozen seafood case with glass doors full of bags of frozen shrimp, price tags on the shelf edges.`), anim: "a hand opens a freezer door" }),
  S(16, "Seafood is one of the places a lot of stores make good money", "av", "av"),
  S(17, "", "c", "ElPriceChain", { props: { title: "where your $16 goes", stops: [{ label: "the dock", price: "$5" }, { label: "heads off", price: "$7.50" }, { label: "plant + freezer", price: "$9" }, { label: "trucks", price: "$10.50" }, { label: "wholesaler", price: "$12" }, { label: "the store", price: "$16" }], every: 40, final: "the shrimper gets the smallest slice", bed: "b_case" } }),
];
export const BEDS = [];
