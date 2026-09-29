// DIRECTOR B — cuenta regresiva 30 → 18 (párrafos 6-19). Ítems rápidos (~30-45 s): avatar abre con la placa OleCountdown,
// el resto = lo que se dice en ese segundo (stock real / archivo / imagen / componente).
import { S, BI, OLEP } from "./dir_lib.mjs";
const CD = (n, name, sub, book) => ({ ov: { c: "OleCountdown", props: { n, name, sub, book } } });
export const SHOTS = [
  // ── #30 mush (p6)
  S(6, "", "av", "", CD(30, "Fried cornmeal mush", "with molasses", 51)),
  S(6, "This was the bottom of the menu", "bi", "b_mush_menu", { p: BI("A hand-lettered scrap of brown paper tacked to a log wall in a cook shack showing a rough menu of the week with a pencil, a lantern beside it, a cook's flour-dusted forearm pointing to the bottom line, no readable words on the paper, only pencil scribbles."), anim: "the lantern light flickers on the paper" }),
  S(6, "The cook boiled coarse cornmeal", "st", "st_mush_stir", { q: "stirring cornmeal porridge in pot with wooden spoon" }),
  S(6, "poured it into a pan", "bi", "b_mush_pans", { p: BI("Rows of flat metal baking pans on a rough wooden shelf in a cold shed, each pan filled with pale yellow set cornmeal mush, a dusting of frost on the shelf edge, a lantern hanging beside, a cook's hand sliding one pan in."), anim: "cold breath mist drifts over the pans" }),
  S(6, "At supper it came back sliced", "st", "st_mush_fry", { q: "frying polenta slices in cast iron skillet" }),
  S(6, "and drowned in molasses", "st", "st_molasses", { q: "pouring molasses syrup on food dark" }),
  S(6, "Cheap, hot", "av", ""),
  S(6, "Now, I'll tell you what", "ole", "o_mush", { p: OLEP("He sits at the worn wooden table holding a fork with a golden fried slice of cornmeal mush on it, a cast iron skillet with more slices in front of him, looking at the camera with a wry half smile as if telling a secret.") }),
  S(6, "Nothing on that table", "ar", "ar_emptyplates", { arch: "emptyplates", cap: "Nothing was thrown out", credit: "Kinsey / Wikimedia Commons · public domain" }),
  S(6, "and the cook knew the price", "bi", "b_ledger", { p: BI("A cook's worn pencil ledger book open on a rough plank table beside a wooden barrel of yellow cornmeal with a tin scoop in it, a stub of pencil, a lantern, in a cold storeroom of a log camp, flour dust in the light."), anim: "flour dust drifts in the lantern light" }),

  // ── #29 salt pork + potatoes in cream gravy (p7)
  S(7, "", "av", "", CD(29, "Salt pork & potatoes", "in cream gravy", 45)),
  S(7, "Salt pork was the meat", "st", "st_saltpork", { q: "slab of salt pork bacon on cutting board" }),
  S(7, "It sat in a barrel", "bi", "b_barrel", { p: BI("An open wooden barrel packed with thick white slabs of salt pork under a layer of coarse salt in a frosty log storehouse, a cook's hand lifting one slab out by a loop of twine, a lantern, snow light through a crack in the wall."), anim: "cold vapor drifts off the barrel" }),
  S(7, "You'd slice it", "st", "st_bacon_fry", { q: "frying bacon slices in cast iron pan" }),
  S(7, "and then you'd stir flour", "st", "st_roux", { q: "stirring flour into hot fat roux pan whisk" }),
  S(7, "and pour in milk", "st", "st_milkgravy", { q: "pouring milk into skillet gravy" }),
  S(7, "Poured over boiled potatoes", "st", "st_potgravy", { q: "boiled potatoes covered with white cream gravy plate" }),
  S(7, "And there was a second job", "bi", "b_fatcrock", { p: BI("A brown stoneware crock of white rendered pork fat with a wooden spoon standing in it on a shelf beside a black wood stove, a cook's hand spooning hot fat from a skillet into it, jars and tin cups on the shelf."), anim: "hot fat drips into the crock" }),
  S(7, "In a camp kitchen", "ole", "o_fatbanker", { p: OLEP("He stands at the black wood stove pouring hot fat from an iron skillet into a stoneware crock, glancing at the camera with a proud stern expression, steam rising, his apron dusted with flour.") }),

  // ── #28 skillet cabbage & bacon (p8)
  S(8, "", "av", "", CD(28, "Skillet cabbage", "with bacon", 56)),
  S(8, "Cabbage kept in a root cellar", "st", "st_rootcellar", { q: "root cellar shelves cabbages vegetables old" }),
  S(8, "The trick is to let the bacon", "st", "st_bacon_crisp", { q: "crispy bacon strips in cast iron skillet" }),
  S(8, "then throw in the cabbage", "st", "st_cabbage_skillet", { q: "cabbage cooking in cast iron skillet" }),
  S(8, "Stir it too much", "bi", "b_graycabbage", { p: BI("Two cast iron skillets side by side on a black stove top: on the left cabbage browned with crisp golden edges, on the right a sad gray steamed pile of limp cabbage, a wooden spoon lying between them, a cook's floury forearm at the edge."), anim: "steam rises from the gray pile" }),
  S(8, "Nobody wants gray cabbage", "av", ""),
  S(8, "The old fellows liked it", "st", "st_vinegar_splash", { q: "splash of vinegar into hot pan sizzling" }),
  S(8, "It cut through all that", "ar", "ar_wintermen", { arch: "wintermen", cap: "Winter work, 20° below", credit: "Wikimedia Commons · public domain" }),

  // ── #27 oatmeal with dried fruit (p9)
  S(9, "", "av", "", CD(27, "Oatmeal with dried fruit", "at supper", 50)),
  S(9, "Oatmeal porridge shows up", "st", "st_oatmeal_pot", { q: "oatmeal porridge cooking in pot stirring" }),
  S(9, "but a cook with dried apples", "st", "st_driedfruit", { q: "dried apples and raisins in wooden bowl rustic" }),
  S(9, "would stew them right into the pot", "bi", "b_oats_fruit", { p: BI("A big dented iron pot of thick oatmeal on a wood stove with dried apple slices and dark raisins being dropped in by a cook's hand, a wooden paddle standing in the pot, steam rising, a log wall and a lantern behind."), anim: "the dried fruit drops into the oats and steam rises" }),
  S(9, "Sweet, warm", "st", "st_oats_bowl", { q: "bowl of oatmeal with raisins steaming spoon" }),
  S(9, "A camp cook always figured", "ole", "o_oats", { p: OLEP("He sits at the worn table with a tin bowl of oatmeal with raisins in front of him, tapping his own belly with one big hand and smiling at the camera, the black Dutch oven and the enamel mug beside the bowl.") }),

  // ── #26 fried potatoes & onions (p10)
  S(10, "", "av", "", CD(26, "Fried potatoes & onions", "", 55)),
  S(10, "Here's one small thing", "st", "st_slicepotato", { q: "slicing potatoes with knife on wooden board" }),
  S(10, "Rinse the sliced potatoes", "st", "st_rinsepotato", { q: "rinsing sliced potatoes under water in bowl" }),
  S(10, "Do that, and they turn crisp", "st", "st_friedpotato", { q: "crispy fried potatoes and onions in cast iron skillet" }),
  S(10, "Skip it, and you get glue", "bi", "b_glue", { p: BI("A cast iron skillet holding a pale sticky gluey clump of half-fried potato slices stuck together and stuck to the pan, a spatula lifting a mushy wad, an unhappy cook's floury hand, a wood stove behind."), anim: "steam rises from the sticky potatoes" }),
  S(10, "Hot fat, big pan", "kf", "d_stove"),
  S(10, "And salt them near the end", "st", "st_salt", { q: "sprinkling salt over frying potatoes" }),
  S(10, "Little things like that", "ole", "o_potfinger", { p: OLEP("He holds up one crisp fried potato slice between two fingers toward the camera with a knowing grin and raised eyebrows, a black iron skillet of fried potatoes and onions on the table in front of him.") }),

  // ── #25 molasses cookies (p11)
  S(11, "", "av", "", CD(25, "Molasses cookies", "", 58)),
  S(11, "The camp cook baked them", "st", "st_cookies_tray", { q: "molasses cookies baking sheet fresh baked" }),
  S(11, "and the cookee carried them", "bi", "b_cookee_sack", { p: BI("A skinny young cookee in a too-big wool coat and knit cap trudging through deep snow between tall pine trunks with a heavy cloth flour sack over his shoulder and a steaming tin pail in his hand, headed toward men working far off among felled logs."), anim: "the cookee trudges through the snow, breath puffing" }),
  S(11, "Big, soft, and spiced with ginger", "st", "st_cookie_close", { q: "big soft ginger molasses cookie close up" }),
  S(11, "A man could put three", "bi", "b_pocket", { p: BI("A logger's big wool-mittened hand pushing three round molasses cookies into the pocket of a thick plaid wool coat on a frosty morning, breath clouds, the coat button and stitching visible."), anim: "the mitten pushes the cookies into the pocket" }),
  S(11, "And the cookies were the one thing", "ole", "o_cookee", { p: OLEP("He leans toward the camera with a mischievous smile and a finger against the side of his nose, an apron pocket with a cookie sticking out, a tray of molasses cookies on the table.") }),

  S(11, "Every cookee I ever knew", "bi", "b_cookeepocket", { p: BI("A young cookee in a big khaki apron with a round molasses cookie sticking out of his apron pocket, a stern older cook behind him at the stove pretending not to see it and stirring a pot, log cook shack, steam and lantern light, seen from the side."), anim: "the cook glances sideways and looks away" }),
  S(11, "He'd done the same", "av", ""),
  // ── #24 vinegar pie (p12)
  S(12, "", "av", "", CD(24, "Vinegar pie", "", null)),
  S(12, "Now this sounds strange", "bi", "b_vinegarbottle", { p: BI("A brown glass bottle of cider vinegar with a cork on a rough plank shelf next to a bag of sugar, eggs in a wooden bowl and a butter crock, a lantern, a wood stove edge, an old recipe-free kitchen table with flour dust."), anim: "lantern light flickers" }),
  S(12, "when the apples ran out", "st", "st_emptyshelf", { q: "old wooden pantry shelf jars winter empty rustic" }),
  S(12, "the cook made a pie", "st", "st_custardmix", { q: "whisking eggs sugar butter in bowl for custard pie" }),
  S(12, "It tastes like a lemon custard", "st", "st_custardpie", { q: "slice of yellow custard pie on plate" }),
  S(12, "That is the whole idea", "av", ""),
  S(12, "Bake it in a lard crust", "st", "st_piebake", { q: "custard pie in oven baking golden" }),
  S(12, "and the middle still wobbles", "st", "st_wobble", { q: "custard pie wobbling jiggle gently" }),

  // ── #23 liver and onions (p13)
  S(13, "", "av", "", CD(23, "Liver & onions", "", null)),
  S(13, "When a beef was butchered", "ar", "ar_butcher", { arch: "butcher", cap: "Camp meat, cut on the spot", credit: "Wikimedia Commons · public domain" }),
  S(13, "because it doesn't keep", "bi", "b_liver", { p: BI("Fresh dark red beef liver on a cold wooden butcher block in a frosty log storehouse next to a big knife and a tin pail of onions, a lantern, breath-cold air, a cook's floury hands wiping the knife."), anim: "cold breath mist drifts" }),
  S(13, "Slice it thin", "st", "st_slice_liver", { q: "slicing raw liver thin with knife" }),
  S(13, "fry it hot and fast", "st", "st_fry_liver", { q: "frying liver and onions in skillet" }),
  S(13, "Overcooked liver is a boot", "bi", "b_boot", { p: BI("A worn leather logger's boot resting on a plank table next to a plate holding a grey shriveled overcooked piece of liver that looks just like the boot sole, a fork stuck in it, a lantern, a puzzled cook's hand at the edge of the frame."), anim: "steam curls up from the plate" }),
  S(13, "And sweet onions", "st", "st_onions_pan", { q: "caramelized onions in frying pan" }),
  S(13, "One more thing about liver", "st", "st_milksoak", { q: "soaking meat in milk in bowl" }),

  S(13, "I learned that from a cook", "ar", "ar_cookportrait", { arch: "cookportrait", cap: "Camp cooks kept the crews fed", credit: "Wikimedia Commons · public domain" }),
  S(13, "and he said his liver", "av", ""),
  // ── #22 rice pudding (p14)
  S(14, "", "av", "", CD(22, "Rice pudding", "", 60)),
  S(14, "Rice, milk, sugar", "st", "st_rice_milk", { q: "rice pudding cooking milk pot stirring cinnamon" }),
  S(14, "It was the softest thing", "st", "st_ricepudding", { q: "bowl of creamy rice pudding cinnamon" }),
  S(14, "The old teamsters", "bi", "b_teamster", { p: BI("A weathered old teamster in a fur cap and wool coat leading a pair of huge draft horses harnessed to a loaded log sleigh along a snowy ice road between tall pines at dawn, frost on the horses' backs and his beard, steam from their nostrils."), anim: "the horses walk forward, breath steaming" }),
  S(14, "Their teeth weren't", "ole", "o_teeth", { p: OLEP("He points at his own mouth with one finger and gives the camera an exaggerated toothless-looking grin, a bowl of rice pudding with a spoon in it on the table in front of him, the stove glowing behind.") }),
  S(14, "Grate a little nutmeg", "st", "st_nutmeg", { q: "grating nutmeg over dessert" }),

  // ── #21 red flannel hash (p15)
  S(15, "", "av", "", CD(21, "Red flannel hash", "", null)),
  S(15, "Leftover corned beef", "st", "st_cornedbeef_chop", { q: "chopping corned beef and potatoes on board" }),
  S(15, "The beets turn the whole pan", "st", "st_beets", { q: "red beets chopped in skillet cooking hash" }),
  S(15, "which is exactly how it got", "bi", "b_redflannel", { p: BI("A cast iron skillet of deep red beet-stained hash next to a folded red plaid wool flannel shirt of exactly the same color on a rough table, a fork in the hash, a lantern, the two reds side by side."), anim: "steam rises from the red hash" }),
  S(15, "The whole thing was made from", "ole", "o_sundayleft", { p: OLEP("He stands at the black stove scraping leftover corned beef and potatoes from a big pot into a skillet with a wooden spoon, looking at the camera with a satisfied nod, the cabin kitchen around him.") }),
  S(15, "And a word about that dish", "bi", "b_shingle", { p: BI("A slice of toast on a tin plate covered with creamy gray-white chipped beef gravy sitting on top of a thin wooden roof shingle propped up like a serving plate on a rough table, a fork beside it, a lantern glow, a funny deliberate composition."), anim: "steam rises from the creamy beef" }),
  S(15, "Let's just say it involved", "av", ""),

  // ── #20 sauerkraut & sausage (p16)
  S(16, "", "av", "", CD(20, "Sauerkraut & sausage", "in a skillet", 43)),
  S(16, "Sauerkraut was cabbage", "st", "st_kraut_crock", { q: "fermenting sauerkraut in stoneware crock" }),
  S(16, "vitamin C", "c", "OleFact", { props: { big: "Vitamin C", unit: "in the dead of winter", text: "kraut kept the men healthy" } }),
  S(16, "Brown the sausage first", "st", "st_sausage_brown", { q: "browning sausages in cast iron skillet" }),
  S(16, "then let the kraut cook down", "st", "st_kraut_skillet", { q: "sauerkraut and sausage cooking skillet" }),
  S(16, "Some folks rinse the kraut", "av", ""),
  S(16, "Serve it with boiled potatoes", "st", "st_kraut_plate", { q: "sausage sauerkraut boiled potatoes dark bread plate rustic" }),
  S(16, "that would carry a man", "ar", "ar_northnight", { arch: "northnight", cap: "A Minnesota night in the pines", credit: "Wikimedia Commons · public domain" }),

  // ── #19 doughnuts (p17)
  S(17, "", "av", "", CD(19, "Doughnuts", "fried in lard", null)),
  S(17, "The cook fried them in lard", "st", "st_donut_fry", { q: "doughnuts frying in hot oil pot" }),
  S(17, "The historical records say", "ar", "ar_cakebox", { arch: "pastries", cap: "Pies and breads on the mess tables, ca 1930", credit: "Kinsey / Wikimedia Commons · public domain" }),
  S(17, "A cook could not let", "bi", "b_cakebox", { p: BI("A big open wooden cake box on a log cook shack shelf packed with round sugared doughnuts, a cook's floury hand reaching to refill it from a wire rack of fresh ones, an empty gap at the front, lantern light."), anim: "a hand takes a doughnut from the box" }),
  S(17, "a doughnut in a coat pocket", "bi", "b_donutpocket", { p: BI("A gloved hand pulling a sugary doughnut out of a plaid wool coat pocket at dawn in deep snow beside an axe stuck in a stump, breath cloud, first blue light, pine trunks behind."), anim: "breath puffs and the hand lifts the doughnut" }),
  S(17, "There's a reason the lard", "st", "st_hotoil", { q: "hot oil bubbling in pot frying test dough" }),
  S(17, "Too hot, and the outside", "bi", "b_burntdonut", { p: BI("Two doughnuts lifted out of hot lard side by side on a slotted spoon over a black iron pot: the left one pale and raw-looking, the right one burnt black, a cook's floury hand holding the spoon and a grimace at the edge, steam and lantern light."), anim: "grease drips from the doughnuts" }),
  S(17, "If it sizzled and floated", "st", "st_donut_float", { q: "doughnut floating and turning in hot oil" }),
  S(17, "No thermometer", "ole", "o_nothermo", { p: OLEP("He holds a small scrap of dough over a big iron pot of hot lard at the black stove, watching it with narrowed eyes, no thermometer anywhere, steam and a shimmer over the fat, the camera behind the pot.") }),

  // ── re-enganche (p18)
  S(18, "", "av", ""),
  S(18, "But the one at number four", "st", "st_pancake_stack", { q: "tall stack of pancakes with syrup" }),
  S(18, "you'll want to see how they got", "st", "st_griddle_many", { q: "many pancakes cooking on large griddle" }),
  S(18, "So stay with me", "av", ""),

  // ── #18 fish chowder (p19)
  S(19, "", "av", "", CD(18, "Fish chowder", "with salt pork", 34)),
  S(19, "In the camps near a lake", "st", "st_frozenlake", { q: "frozen lake ice fishing winter pine trees" }),
  S(19, "a fisherman would bring in", "bi", "b_fishcatch", { p: BI("A bearded man in a fur cap and heavy wool coat carrying a string of fresh lake fish and a tin pail through deep snow to the door of a log cookhouse, smoke rising from the chimney behind him, blue dusk light."), anim: "the man walks toward the cookhouse door, snow crunching" }),
  S(19, "and the cook would render", "st", "st_render", { q: "rendering salt pork cubes in pot" }),
  S(19, "add onions, potatoes, and milk", "st", "st_chowder_pot", { q: "fish chowder simmering in pot potatoes milk" }),
  S(19, "and lay the fish on top", "bi", "b_fishontop", { p: BI("Thick white fish fillets laid on top of a creamy potato and onion chowder in a big iron pot, a cook's hand with a ladle hovering, steam, lantern light, a pinch of black pepper visible."), anim: "steam swirls over the chowder" }),
  S(19, "Don't stir it much", "av", ""),
  S(19, "And crackers on the side", "st", "st_crackers_chowder", { q: "crushing crackers into bowl of chowder soup" }),
];
