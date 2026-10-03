// DIRECTOR A — minuto 1 (el restorán de $42 con el nieto) + Earl + la olla + el camarón + qué más va (p0-14)
import { S, BI, HZP, SHED, HARBOR, DECK, STORE, KITCHEN } from "./dir_lib.mjs";
export const RESTO = "a busy seafood boil restaurant in a city: long tables covered in brown paper, plastic bags of shrimp in red butter sauce, people wearing plastic bibs, a neon sign on a brick wall";
export const YARD = "Earl's backyard on the Mississippi Gulf Coast: a live oak with Spanish moss, a propane burner with a big aluminum boil pot, a picnic table covered in newspaper, a wooden fence";
const GRANDSON = "a young African American man in his twenties in a baseball cap and a t-shirt";
export const SHOTS = [
  S(0, "", "av", "av"),
  S(0, "You know the kind", "bi", "b_resto", { p: BI(`${RESTO}: a plastic bag of shrimp in red butter sauce being dumped onto the paper table, people in plastic bibs reaching in.`), anim: "the shrimp spill out of the bag onto the paper" }),
  S(0, "He was so proud to treat me", "bi", "b_grandson", { p: BI(`${GRANDSON} smiling proudly across a paper-covered table at ${RESTO.split(":")[0]}, wearing a plastic bib, holding up a shrimp.`), anim: "he holds up the shrimp and grins" }),
  S(1, "", "av", "av"),
  S(1, "All the flavor was sitting on the outside", "c", "ElFlavorInside", { props: { left: "restaurant: sauce on the outside", right: "the boat: soaked in", title: "where the flavor goes", bed: "b_resto" } }),
  S(2, "", "av", "av"),
  S(2, "On the boat, we seasoned the water", "bi", "b_deckpot", { p: BI(`${DECK}: a big dented aluminum pot steaming on a camp burner on the wet deck, red seasoning swirling in the boiling water, lemons floating.`), anim: "the seasoned water boils and steams" }),
  S(3, "", "av", "av"),
  S(3, "the one step restaurants skip", "st", "st_shrimp.1"),
  S(3, "You can do this in your backyard this weekend", "bi", "b_yardsetup", { p: BI(`${YARD}: the big aluminum pot on the propane burner just lit, blue flame, a cooler of shrimp and a sack of potatoes beside it.`), anim: "the blue flame flickers under the pot" }),
  S(4, "", "av", "av", { ov: { c: "ElNameTag", props: { name: "Earl", line: "31 years on a shrimp boat · Biloxi" } } }),
  S(4, "Birthdays, the end of a long trip", "bi", "b_family", { p: BI(`${YARD}: a big family of all ages gathered around a picnic table covered in newspaper with a huge pile of boiled shrimp, corn and potatoes, laughing, string lights in the oak.`), anim: "hands reach into the pile and people laugh" }),
  S(5, "", "bi", "b_basket", { p: BI("A big aluminum boil pot with a perforated basket being lifted out by its handle, steam pouring off, water draining back into the pot, in a backyard."), anim: "the basket lifts and water pours out" }),
  S(5, "You lift the basket out", "hz", "h_basket", { p: HZP("He lifts a steaming boil basket out of a big aluminum pot with both hands, squinting through the steam and grinning at the camera.", YARD) }),
  S(6, "", "av", "av"),
  S(6, "Set it up outside on flat ground", "bi", "b_burner", { p: BI(`A propane burner stand with a big pot set up on flat concrete in ${YARD.split(":")[0]}, the propane tank a few feet away, a garden hose coiled nearby, kids' toys well back on the lawn.`), anim: "the flame burns steady under the pot" }),
  S(7, "", "c", "ElLabelLine", { props: { line: "ingredients: shrimp", means: "heads on, shells on", good: true, bed: "b_headson" } }),
  S(8, "", "bi", "b_headson", { p: BI(`Raw heads-on shell-on Gulf shrimp heaped on crushed ice in ${SHED.split(":")[0]}, long whiskers, shiny shells, water droplets.`), anim: "a gloved hand scoops up a handful" }),
  S(8, "the shell protects the meat", "av", "av"),
  S(9, "", "c", "ElCountSize", { props: { counts: [{ c: "16/20", note: "16 to 20 per pound · great for a boil" }, { c: "21/25", note: "a little smaller · still good" }, { c: "U10", note: "giant · easy to undercook" }], every: 40, bed: "st_shrimp.2" } }),
  S(10, "", "av", "av"),
  S(11, "", "bi", "b_ingredients", { p: BI("On a wooden picnic table: small red potatoes, corn on the cob broken in halves, chunks of smoked sausage, halved onions, whole garlic heads cut across, and a pile of halved lemons, all ready for a boil."), anim: "a hand sets down the last lemon" }),
  S(11, "And lemons. Lots of lemons", "st", "st_lemon.1"),
  S(12, "", "av", "av"),
  S(13, "", "c", "ElIngredients", { props: { title: "THE BOAT SEASONING:", items: ["salt (a lot)", "cayenne", "black pepper", "paprika", "bay leaves", "mustard + coriander seed"], bad: -1, stamp: "taste like the Gulf", bed: "b_spices" } }),
  S(13, "Taste the water before anything goes in", "hz", "h_taste", { p: HZP("He dips a big wooden spoon into a steaming pot of red seasoned water and tastes it, nodding thoughtfully.", YARD) }),
  S(13, "If it tastes like soup", "bi", "b_spices", { p: BI("Handfuls of coarse salt, red cayenne, paprika and bay leaves being tossed into a big pot of boiling water in a backyard, the spices swirling."), anim: "the spices swirl into the boiling water" }),
  S(14, "", "bi", "b_lemonsqueeze", { p: BI("An older dark-skinned hand squeezing a lemon half over a big pot of boiling seasoned water, then dropping the rind in, halved onions and garlic heads floating."), anim: "the lemon juice drips into the pot" }),
  S(14, "You'll smell it from across the yard", "av", "av"),
  S(14, "The neighbors will start finding reasons to walk by", "bi", "b_neighbor", { p: BI(`A neighbor in a straw hat leaning over the wooden fence of ${YARD.split(":")[0]}, sniffing the air and smiling, steam rising from the pot in the foreground.`), anim: "the neighbor sniffs the air and smiles" }),
];
export const BEDS = [];
