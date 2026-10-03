// DIRECTOR C — qué hacer en cualquier tienda, cómo elegir pescado entero, los baratos que sí, la cocina, el vendedor otra vez, CTA (p28-35)
import { S, BI, HZP, SHED, HARBOR, DECK, STORE, KITCHEN } from "./dir_lib.mjs";
export const SHOTS = [
  S(28, "", "c", "ElCoolerBoard", { props: { title: "at any store", rows: [{ item: "country + wild or farm raised" }, { item: "honest names, not made-up ones" }, { item: "buy whole when you can" }, { item: "too cheap? it usually is", hi: true }], every: 50, bed: "b_labels" } }),
  // ── ELEGIR PESCADO ENTERO
  S(29, "", "av", "av"),
  S(29, "Look at the eyes first", "c", "ElLabelLine", { props: { line: "Clear, bright, bulging eyes", means: "fresh", good: true, bed: "b_eye" } }),
  S(29, "Lift the gill cover", "bi", "b_gills", { p: BI("Close view of an older dark-skinned thumb lifting the gill cover of a fresh whole fish on ice, revealing bright red gills."), anim: "the thumb lifts the gill cover open" }),
  S(29, "Press the side with your finger", "bi", "b_press", { p: BI("Close view of a finger pressing the side of a fresh whole fish on crushed ice, the firm flesh springing back."), anim: "the finger presses and the flesh springs back" }),
  S(29, "And smell it", "av", "av"),
  S(29, "A good fish man will let you look", "st", "st_fishmarket.2"),
  S(29, "Cloudy, sunken eyes", "st", "st_fishmarket.5"),
  // ── LOS BARATOS QUE SÍ
  S(30, "", "av", "av"),
  S(30, "Mullet", "bi", "b_mullet", { p: BI(`A pile of fresh silver striped mullet on crushed ice in ${SHED.split(":")[0]}, a handwritten sign reading MULLET $2.99 LB stuck in the ice.`), anim: "a hand lifts one mullet off the pile" }),
  S(30, "or smoked over pecan wood", "bi", "b_smokedmullet", { p: BI("Split mullet fillets golden brown on the rack of an old backyard smoker, wisps of smoke rising, pecan wood chunks beside it."), anim: "smoke curls up around the golden fillets" }),
  S(31, "", "bi", "b_sheepshead", { p: BI("Close view of a sheepshead fish on ice with its black vertical stripes and its funny human-like teeth showing, an older dark-skinned hand holding its jaw open."), anim: "the hand opens the fish's mouth showing the teeth" }),
  S(31, "Crabs and barnacles off the pilings", "st", "st_pilings.1"),
  S(31, "And black drum, the smaller ones", "st", "st_fishmarket.3"),
  S(31, "Ugly as sin", "av", "av"),
  S(31, "Ask for those at a Gulf fish market", "av", "av"),
  // ── LA COCINA
  S(32, "", "hz", "h_cook", { p: HZP("At an old gas stove in his small coast kitchen, he lays a white fish fillet into a hot cast iron skillet with butter, steam and sizzle, glancing at the camera with a smile.", KITCHEN) }),
  S(32, "Three minutes a side", "bi", "b_skillet", { p: BI(`A golden-brown seared white fish fillet in a black cast iron skillet with butter on an old gas stove in ${KITCHEN.split(":")[0]}, a lemon half beside it.`), anim: "the butter bubbles around the golden fillet" }),
  S(32, "and eat it with a pile of rice", "bi", "b_plate", { p: BI(`A plate on a newspaper-covered kitchen table in ${KITCHEN.split(":")[0]}: a golden fish fillet with a lemon wedge, a pile of white rice and collard greens, a glass of iced tea.`), anim: "a fork cuts into the flaky fish" }),
  S(32, "Salt, pepper", "st", "st_cooking.2"),
  S(32, "That's a Tuesday night on the coast", "av", "av"),
  // ── EL VENDEDOR VUELVE
  S(33, "", "bi", "b_truck2", { p: BI(`${HARBOR}: the same white refrigerated box truck back at the seafood shed, the salesman in a navy polo laughing and shrugging with an open box of pink fillets.`), anim: "the salesman shrugs and laughs" }),
  S(33, "I told him the same thing", "av", "av"),
  S(33, "that's why the folks keep coming back", "st", "st_customers.1"),
  // ── CTA
  S(34, "", "av", "av", { ov: { c: "ElSubscribe", props: { line: "next: a whole fish, head and all" } } }),
  S(35, "", "av", "av"),
  S(35, "have you ever ordered a fish", "av", "av2", { ov: { c: "ElAsk", props: { question: "Ever ordered a fish and got something else?" } } }),
  S(35, "I'll see you on the dock", "st", "st_harbor.1"),
];
export const BEDS = [
  { name: "b_menucatfish", p: BI("A paper menu on a Southern restaurant table listing Fried Catfish Plate $9.99 among other dishes, a basket of fried fish beside it.") },
  { name: "b_sharksteak", p: BI("Thick pale shark steaks on crushed ice in a seafood case with a handwritten label card reading Shark Steak, under bright light.") },
  { name: "b_eye", p: BI("Extreme close view of the clear, bright, bulging eye of a very fresh whole fish on crushed ice.") },
];
