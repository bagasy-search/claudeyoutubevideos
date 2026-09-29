// DIRECTOR C — #17 → #1 + cierre (párrafos 20-45). Héroes: #14 boiled dinner, #12 sourdough, #5 stew, #4 flapjacks, #2 pot beans, #1 beanhole.
import { S, BI, OLEP } from "./dir_lib.mjs";
const CD = (n, name, sub, book) => ({ ov: { c: "OleCountdown", props: { n, name, sub, book } } });
const CDH = (n, name, sub) => ({ n, name, sub });
export const SHOTS = [
  // ── #17 bread pudding (p20)
  S(20, "", "av", "", CD(17, "Bread pudding", "molasses sauce", 61)),
  S(20, "Stale bread was never thrown", "st", "st_stalebread", { q: "cutting stale bread into cubes on board" }),
  S(20, "It went into a pan with milk", "st", "st_breadpud_mix", { q: "bread pudding mixture eggs milk in baking dish" }),
  S(20, "and came out of the oven", "st", "st_breadpud", { q: "baked bread pudding golden dish" }),
  S(20, "The molasses sauce goes over", "st", "st_molasses_pour", { q: "pouring dark syrup sauce over dessert" }),
  S(20, "And the raisins should soak", "st", "st_raisins_soak", { q: "raisins soaking in hot water bowl" }),
  S(20, "Little thing", "av", ""),

  // ── #16 corned beef hash (p21)
  S(21, "", "av", "", CD(16, "Corned beef hash", "", 40)),
  S(21, "Get the potatoes cooked first", "st", "st_hash_prep", { q: "chopping corned beef potatoes for hash" }),
  S(21, "and press the whole thing down", "st", "st_hash_press", { q: "pressing hash flat in cast iron skillet spatula" }),
  S(21, "Then leave it", "kf", "d_cakes"),
  S(21, "When the bottom is dark brown", "st", "st_hash_flip", { q: "flipping crispy hash in skillet" }),
  S(21, "Patience is the whole secret", "av", ""),
  S(21, "A cook I knew in Wisconsin", "ar", "ar_bigcook", { arch: "bigcook", cap: "A camp cook at his range", credit: "Wikimedia Commons · public domain" }),
  S(21, "I thought about that", "ole", "o_hashthought", { p: OLEP("He stands looking down at the skillet of hash on the black stove with his arms crossed and a thoughtful, faraway expression, a spatula in one hand, steam rising, stove glow on his face.") }),

  // ── #15 prune pie (p22)
  S(22, "", "av", "", CD(15, "Prune pie", "", null)),
  S(22, "Sounds funny to you", "st", "st_prunes", { q: "dried prunes in bowl rustic wooden table" }),
  S(22, "But dried prunes were a staple", "bi", "b_prunesack", { p: BI("A burlap sack of wrinkled dried prunes standing open on the floor of a log camp storeroom, a scoop, a wooden crate of dried apples beside it, tins on shelves, a lantern, a cook's hand holding a fistful of prunes."), anim: "dust drifts in the lantern light" }),
  S(22, "and a pie made from them", "st", "st_prunepie", { q: "prune pie or plum pie slice on plate" }),
  S(22, "Dried fruit was how a camp", "bi", "b_storeshelf", { p: BI("Long rough wooden shelves in a camp storehouse lined with sacks of flour, sugar, salt, dried apples, dried prunes, barrels and tin cans, a lantern hanging from a beam, frost on the small window, a cook counting with a pencil."), anim: "dust drifts in the lantern light" }),
  S(22, "Simmer them soft", "st", "st_lemonpeel", { q: "lemon peel strip in simmering fruit pot" }),
  S(22, "Nobody wants a tooth cracked", "av", ""),

  // ── #14 boiled dinner — HÉROE (p23, p24)
  S(23, "", "c", "OleCountdownCard", { props: CDH(14, "Sunday boiled dinner", "the first big one"), bed: "img/olsup/b_boiled_bed.jpg" }),
  S(23, "Now we're at the first big one", "av", ""),
  S(23, "Sunday was boiled dinner", "ar", "ar_sundaydinner", { arch: "sundaydinner", cap: "Sunday dinner in camp", credit: "Kinsey / Wikimedia Commons · public domain" }),
  S(23, "A whole corned beef went", "st", "st_cornedbeef_pot", { q: "corned beef brisket in large pot boiling" }),
  S(23, "with water to cover", "bi", "b_kettle_first", { p: BI("A gigantic black iron kettle on a wood range at first light, a whole raw corned beef submerged in cold water inside, a cook in a khaki apron pouring in a last pail of water, a small window with faint blue dawn, lantern still lit, steam starting."), anim: "steam begins to rise from the kettle" }),
  S(23, "About three hours in", "st", "st_veg_add", { q: "adding cabbage carrots potatoes to big pot" }),
  S(23, "Everything cooked together", "st", "st_boiled_dinner", { q: "boiled dinner corned beef cabbage carrots potatoes plate" }),
  S(23, "The vegetables get their flavor", "c", "OleTwoCards", { props: { a: { title: "The beef", lines: ["gives the vegetables", "its salty flavor"], mark: "→" }, b: { title: "The vegetables", lines: ["give the beef", "their sweetness"], mark: "←" } }, bed: "img/olsup/b_boiled_bed.jpg" }),
  S(23, "And then here's what the cook", "st", "st_leftovers_hash", { q: "leftover corned beef hash frying next day" }),
  S(23, "So nothing in that kitchen", "av", ""),
  S(24, "", "av", ""),
  S(24, "never let it boil hard", "c", "OleTrick", { props: { title: "Cook's trick", text: "Never let it boil hard. Just trembling." }, bed: "img/olsup/b_boiled_bed.jpg" }),
  S(24, "A hard boil toughens", "st", "st_hardboil", { q: "rolling boil big pot vigorous bubbling" }),
  S(24, "You want the water just trembling", "st", "st_simmer", { q: "gentle simmer barely bubbling pot close up" }),
  S(24, "And you add the vegetables", "c", "OleSupperCard", { props: { n: 14, title: "Boiled dinner", items: ["corned beef · first, at first light", "carrots + potatoes · early", "turnips · in the middle", "cabbage · last, 20 min"], why: "everything ready in the same minute" } }),
  S(24, "Twenty minutes for the cabbage", "st", "st_cabbage_wedges", { q: "cabbage wedges cooking in pot steam" }),

  // ── #13 tourtière (p25)
  S(25, "", "av", "", CD(13, "Tourtière", "French Canadian meat pie", null)),
  S(25, "This is a French Canadian meat pie", "st", "st_meatpie", { q: "meat pie golden crust whole pie rustic" }),
  S(25, "pork and onion and spices", "st", "st_porkonion", { q: "ground pork and onion cooking in pan spices" }),
  S(25, "and it was a favorite in the Maine and Quebec camps", "ar", "ar_northcamp", { arch: "northcamp", cap: "A northern logging camp", credit: "Wikimedia Commons · public domain" }),
  S(25, "A little clove", "st", "st_clove", { q: "whole cloves and cinnamon sticks spices" }),
  S(25, "Lard makes the crust", "st", "st_lardcrust", { q: "cutting cold lard into flour for pie crust" }),
  S(25, "Butter is lovely", "st", "st_flakycrust", { q: "flaky pie crust cut with fork layers" }),
  S(25, "And cold. Everything cold", "av", ""),

  // ── #12 sourdough biscuits — HÉROE (p26)
  S(26, "", "c", "OleCountdownCard", { props: CDH(12, "Sourdough biscuits", "this one is a hero"), bed: "img/olsup/b_sourdough_bed.jpg" }),
  S(26, "This one is a hero", "av", ""),
  S(26, "Every camp cook had a crock", "st", "st_starter_crock", { q: "sourdough starter jar bubbling" }),
  S(26, "and he guarded it like it was money", "ole", "o_starter", { p: OLEP("He hugs a big stoneware crock of sourdough starter against his chest with both arms, glaring protectively at the camera, the crock with a cloth over the top, the warm stove behind him, funny and stern.") }),
  S(26, "The starter lived by the stove", "bi", "b_crock_stove", { p: BI("A stoneware crock with a cloth tied over it standing on a wooden stool right next to a warm black wood stove in a log cook shack, a folded wool blanket around it, a wisp of warmth shimmer, a lantern, a bread board with flour behind."), anim: "the cloth over the crock puffs slightly" }),
  S(26, "and if the fire died overnight", "bi", "b_crock_frozen", { p: BI("The same stoneware crock now cracked open with frost on its sides and a frozen grey block of starter inside, the black stove behind it cold with dead gray ashes, frost on the small window, a cook's hand in a fingerless glove touching the frozen crock in dismay."), anim: "cold breath mist and frost sparkle" }),
  S(26, "You mix the starter with flour", "st", "st_biscuit_mix", { q: "mixing flour and sourdough starter dough in bowl" }),
  S(26, "and you roll it thick", "st", "st_biscuit_roll", { q: "rolling biscuit dough thick and cutting rounds" }),
  S(26, "Bake it hot, in a heavy pan", "st", "st_biscuit_pan", { q: "biscuits touching in cast iron skillet baked" }),
  S(26, "They rise up together", "st", "st_biscuit_rise", { q: "golden biscuits baked in cast iron pan close up steam" }),
  S(26, "The recipe for a camp sourdough", "c", "OleBookPage", { props: { page: "img/olsup/book_p26.jpg", pageNo: 26, keys: [[0, 0.5, 0.5, 1], [1.4, 0.5, 0.2, 1.9], [5.4, 0.28, 0.5, 2.1]], caption: "Camp Sourdough" } }),
  S(26, "And here's something the old cooks knew", "av", ""),
  S(26, "The sour in the starter", "st", "st_biscuit_butter", { q: "buttered biscuit pulled apart steaming" }),

  // ── #11 pot roast (p27)
  S(27, "", "av", "", CD(11, "Pot roast", "with root vegetables", 38)),
  S(27, "A chuck roast, browned hard", "st", "st_roast_brown", { q: "browning beef chuck roast in dutch oven" }),
  S(27, "Then a cup of black coffee", "st", "st_coffee_pot_roast", { q: "pouring black coffee into pot" }),
  S(27, "and I'll tell you, the gravy", "c", "OleTrick", { props: { title: "Cook's trick", text: "A cup of black coffee makes the gravy dark and rich." }, bed: "img/olsup/b_roast_bed.jpg" }),
  S(27, "That trick came from an old cook", "ole", "o_coffee_trick", { p: OLEP("He tips a blue enamel mug of black coffee over a black Dutch oven full of pot roast at the table, glancing sideways at the camera with a conspiratorial grin, steam rising, the lid held in his other hand.") }),

  // ── #10 dried apple pie (p28)
  S(28, "", "av", "", CD(10, "Dried apple pie", "", 59)),
  S(28, "Dried apples were soaked", "st", "st_driedapples", { q: "dried apple slices soaking in water bowl" }),
  S(28, "then sweetened with molasses", "st", "st_apple_filling", { q: "apple pie filling cinnamon spoon pot" }),
  S(28, "and baked under a lard crust", "st", "st_applepie_bake", { q: "apple pie with lattice or top crust fresh from oven" }),
  S(28, "When fresh apples were gone", "bi", "b_applecellar", { p: BI("A wooden apple crate in a root cellar almost empty with only a few wrinkled apples left at the bottom, strings of dried apple rings hanging from a beam above, a lantern, a cook's hand taking down a dried string."), anim: "dust drifts in the lantern light" }),
  S(28, "In the winter you didn't get", "st", "st_applepie_slice", { q: "slice of apple pie on tin plate rustic" }),

  // ── #9 ham hock navy bean soup (p29)
  S(29, "", "av", "", CD(9, "Ham hock & navy bean soup", "", 14)),
  S(29, "The day after the beans", "st", "st_hamhock", { q: "smoked ham hock in pot with beans" }),
  S(29, "A ham hock in a pot of water", "st", "st_beansoup_pot", { q: "navy bean soup simmering in pot" }),
  S(29, "and left to simmer half the afternoon", "bi", "b_soup_back", { p: BI("A large iron pot of bean soup simmering at the back of a big black wood range at late afternoon, low golden light through a small window, a cook's ladle resting on the pot rim, a loaf of bread on the board beside it, steam."), anim: "steam drifts through the window light" }),
  S(29, "Nothing wasted", "st", "st_soupbowl", { q: "bowl of ham and bean soup with spoon" }),

  // ── re-enganche mitad (p30)
  S(30, "", "av", ""),
  S(30, "past the halfway mark", "c", "OleCookhouse3D", { props: { focusN: 9, camTo: 1, dishes: [{ n: 30, kind: "pancakes", at: 0 }, { n: 29, kind: "beans", at: 0 }, { n: 28, kind: "bread", at: 0 }, { n: 27, kind: "pie", at: 0 }, { n: 26, kind: "soup", at: 0 }, { n: 25, kind: "roast", at: 0 }, { n: 24, kind: "stew", at: 0 }, { n: 23, kind: "hash", at: 0 }, { n: 22, kind: "fried", at: 0 }, { n: 21, kind: "cookies", at: 0 }, { n: 20, kind: "pudding", at: 0 }, { n: 19, kind: "bread", at: 0 }, { n: 18, kind: "soup", at: 0 }, { n: 17, kind: "pudding", at: 0 }, { n: 16, kind: "hash", at: 0 }, { n: 15, kind: "pie", at: 0 }, { n: 14, kind: "roast", at: 0 }, { n: 13, kind: "pie", at: 0 }, { n: 12, kind: "bread", at: 0 }, { n: 11, kind: "roast", at: 0 }, { n: 10, kind: "pie", at: 0 }, { n: 9, kind: "soup", at: 0 }] } }),
  S(30, "And coming up at number five", "st", "st_stew_teaser", { q: "beef stew steaming pot close up winter" }),

  // ── #8 roast pork + turnips (p31)
  S(31, "", "av", "", CD(8, "Roast pork", "with mashed turnips", null)),
  S(31, "A camp menu from Maine", "c", "OleFact", { props: { big: "1923", unit: "a Maine camp menu", text: "roast pork · turnips · peas · beans · bread", source: "documented lumber camp menu" } }),
  S(31, "Now that's a lot of plate", "st", "st_bigplate", { q: "heaping plate roast pork mashed potatoes vegetables" }),
  S(31, "Roast the pork with the fat side up", "st", "st_roastpork", { q: "roast pork loin fat cap in roasting pan" }),
  S(31, "and mash the turnips", "st", "st_mash_turnip", { q: "mashing turnips or rutabaga with butter" }),

  // ── #7 cornbread (p32)
  S(32, "", "av", "", CD(7, "Skillet cornbread", "", 22)),
  S(32, "Cornbread was the quick bread", "st", "st_cornmeal_bowl", { q: "cornbread batter in bowl cornmeal" }),
  S(32, "just needed a hot cast iron pan", "st", "st_cornbread_pour", { q: "pouring cornbread batter into hot cast iron skillet" }),
  S(32, "That sizzle is your crust", "kf", "d_beans"),
  S(32, "It comes out in about twenty minutes", "st", "st_cornbread", { q: "golden cornbread in cast iron skillet cut" }),
  S(32, "and it's good with beans", "st", "st_cornbread_milk", { q: "cornbread crumbled in glass of milk or bowl of beans" }),

  // ── #6 stock kettle (p33)
  S(33, "", "av", "", CD(6, "The stock kettle", "the pot that never stopped", 36)),
  S(33, "This is the pot that never stopped", "bi", "b_stockkettle", { p: BI("A very large black iron stock kettle at the back of a cast iron wood range, bones and onion skins and a bay leaf visible under the surface of a cloudy broth, a long-handled dipper hanging on the rim, steam, other pots in front, a log wall."), anim: "the broth barely bubbles and steam rises" }),
  S(33, "Every bone from every meal", "st", "st_bones_pot", { q: "beef bones in stock pot simmering" }),
  S(33, "from Monday to Saturday", "c", "OleDayClock", { props: { startH: 6, endH: 18, marks: [{ h: 6, label: "Mon" }, { h: 9, label: "Tue" }, { h: 12, label: "Wed–Fri" }, { h: 18, label: "Sat" }], week: true } }),
  S(33, "Whatever the cook needed", "st", "st_ladle_broth", { q: "ladle dipping into pot of broth steam" }),
  S(33, "Best pot in the kitchen", "ole", "o_stockpot", { p: OLEP("He affectionately pats the side of a huge black iron stock kettle on the stove with one big hand like patting a horse, looking at the camera with a proud smile, steam rising around him.") }),

  // ── #5 beef & barley stew — HÉROE (p34)
  S(34, "", "c", "OleCountdownCard", { props: CDH(5, "Beef & barley stew", "the coldest night of the year"), bed: "img/olsup/b_stew_bed.jpg" }),
  S(34, "Now we're into the heavy hitters", "av", ""),
  S(34, "Beef chuck, cut in big chunks", "st", "st_beefchunks", { q: "cutting beef chuck into big chunks knife" }),
  S(34, "and browned a few pieces at a time", "st", "st_brownbeef", { q: "browning beef pieces in dutch oven pot" }),
  S(34, "because if you crowd the pot", "c", "OleTwoCards", { props: { a: { title: "A few at a time", lines: ["browns", "deep flavor"], mark: "✓" }, b: { title: "Crowded pot", lines: ["steams", "gray meat"], mark: "✗" } }, bed: "img/olsup/b_stew_bed.jpg" }),
  S(34, "Then onions, carrots, and pearl barley", "st", "st_barley", { q: "pearl barley pouring into stew pot vegetables" }),
  S(34, "cooked in beef broth for two hours", "st", "st_stew_simmer", { q: "beef stew simmering slowly in dutch oven steam" }),
  S(34, "The barley thickens", "st", "st_stew_spoon", { q: "thick beef barley stew lifted with spoon bowl" }),
  S(34, "It's on page twentynine", "c", "OleBookPage", { props: { page: "img/olsup/book_p29.jpg", pageNo: 29, keys: [[0, 0.5, 0.5, 1], [1.2, 0.5, 0.15, 1.9], [4.0, 0.3, 0.5, 2.1]], caption: "Lumberjack Beef & Barley Stew" } }),
  S(34, "And ya know what makes it special", "av", ""),
  S(34, "Some nights a turnip", "st", "st_parsnip", { q: "chopped parsnips and turnips on board root vegetables" }),
  S(34, "The bones stayed the same", "st", "st_stew_bowl_night", { q: "bowl of beef stew on wooden table night warm light" }),

  // ── #4 flapjacks — HÉROE (p35)
  S(35, "", "c", "OleCountdownCard", { props: CDH(4, "Flapjacks at supper", "the one they fought over"), bed: "img/olsup/b_flap_bed.jpg" }),
  S(35, "I promised you", "av", ""),
  S(35, "In a camp of eighty men", "c", "OleFact", { props: { big: "400–500", unit: "pancakes in one meal", text: "in a camp of eighty men", source: "Minnesota Historical Society" } }),
  S(35, "That's right", "st", "st_pancakes_pile", { q: "huge pile of pancakes on platter" }),
  S(35, "One griddle wasn't enough", "bi", "b_biggriddle", { p: BI("A huge flat iron griddle the size of a door set over a long firebox in a log cook shack, a dozen round pancakes cooking on it, two young cookees with long flat paddles at each side and a cook in an apron with a ladle of batter, steam and lantern light, chaotic busy scene."), anim: "the cookees flip pancakes with long paddles, steam rises" }),
  S(35, "and the cookees flipped them", "kf", "d_cakes"),
  S(35, "Buttermilk batter", "st", "st_buttermilk_batter", { q: "pouring buttermilk pancake batter into bowl whisk" }),
  S(35, "The batter has to rest", "st", "st_batter_bubbles", { q: "pancake batter bubbles resting close up" }),
  S(35, "And, ya know, a stack of them", "st", "st_stack_syrup", { q: "stack of pancakes pouring dark syrup rustic" }),
  S(35, "was a supper a man never forgot", "ole", "o_flapjack", { p: OLEP("He sits at the worn table with a tall stack of pancakes on a tin plate in front of him, dark syrup running down, a slab of fried salt pork beside it, leaning back with a blissful, faraway smile toward the camera.") }),

  // ── re-enganche tres (p36)
  S(36, "", "av", ""),
  S(36, "Two of them are beans", "st", "st_beanpot_close", { q: "pot of baked beans close up bubbling" }),
  S(36, "because it was buried in the ground", "bi", "b_buried_tease", { p: BI("A round patch of freshly dug dark earth in snow behind a log cookhouse at dusk, a little wisp of smoke rising from the ground, a long-handled shovel stuck in the dirt beside it, a lantern on a post."), anim: "smoke curls up from the buried pit" }),

  // ── #3 split pea soup (p37)
  S(37, "", "av", "", CD(3, "Split pea soup", "with smoked ham", 15)),
  S(37, "Peas and beans were what", "bi", "b_stores", { p: BI("Wooden barrels and burlap sacks of dried peas, dry beans, flour, sugar and salt stacked in a log camp supply shed, a scoop and a scale, a lantern, a cook's hand tying off a sack, snowy light through the door."), anim: "dust drifts in the light" }),
  S(37, "Green peas simmered", "st", "st_peasoup_pot", { q: "split pea soup simmering in pot with ham bone" }),
  S(37, "thick enough to hold a spoon", "st", "st_peasoup_spoon", { q: "thick split pea soup spoon standing bowl" }),
  S(37, "It's a cheap soup", "c", "OleFact", { props: { big: "Dried peas", unit: "cost next to nothing", text: "the ham bone gave it the taste", source: "camp stores: beans, peas, flour, sugar, salt" } }),
  S(37, "You stir it now and then", "st", "st_stir_bottom", { q: "stirring thick soup bottom of pot wooden spoon" }),

  // ── #2 pot beans — casi héroe (p38)
  S(38, "", "av", "", CD(2, "Pot beans & salt pork", "the staple", 12)),
  S(38, "The old records say", "ar", "ar_beans_camp", { arch: "beanscamp", cap: "Beans were served at least twice a day", credit: "Wikimedia Commons · public domain" }),
  S(38, "Three times", "c", "OleFact", { props: { big: "3×", unit: "a day", text: "pork and beans, the camp staple", source: "Minnesota Historical Society" } }),
  S(38, "No wonder the cookees", "bi", "b_bean_barrel", { p: BI("A wooden barrel of dry navy beans with a tin scoop and two young cookees in aprons sorting beans by hand at a long plank table, a tin pail beside each of them, a cook checking a giant pot behind, lantern light."), anim: "hands sort the beans" }),
  S(38, "Beans, a big chunk of salt pork", "st", "st_beans_saltpork", { q: "beans with salt pork in a heavy pot" }),
  S(38, "and a boil for the first ten minutes", "c", "OleTrick", { props: { title: "Ole's bean method", text: "Salt from the start. Boil hard 10 min. Then a whisper." }, bed: "img/olsup/b_beans_bed.jpg" }),
  S(38, "That method is on page seven", "c", "OleBookPage", { props: { page: "img/olsup/book_p07.jpg", pageNo: 7, keys: [[0, 0.5, 0.5, 1], [1.2, 0.5, 0.2, 1.8], [3.6, 0.5, 0.6, 1.8]], caption: "The Bean Method" } }),
  S(38, "I could cook you a good bean", "ole", "o_beansleep", { p: OLEP("He sits at the table with both eyes closed and his arms crossed and a small confident smile as if asleep, a black Dutch oven of beans steaming in front of him, the stove glowing behind, one eyelid cracked open toward the camera.") }),

  // ── #1 beanhole beans — GRAN PAGO (p39-p42)
  S(39, "", "c", "OleCountdownCard", { props: CDH(1, "Beanhole beans", "the one every man fought over"), bed: "img/olsup/b_beanhole_bed.jpg" }),
  S(40, "", "c", "OleBeanhole3D", { props: { steps: ["Dig the hole", "Build the fire", "Coals for a bed", "Pot goes in", "Bury it", "Wait all night", "Dig it up"], stepEvery: 130 } }),
  S(40, "Then a big cast iron pot", "bi", "b_pot_raw", { p: BI("A black cast iron pot with its lid off held by two work-worn hands over a pit of glowing red coals in the ground at night, the pot full of parboiled beans with chunks of salt pork and a sliced onion on top and a dark ribbon of molasses, a lantern beside the pit, sparks."), anim: "sparks rise from the pit and the steam curls up" }),
  S(40, "got set right down", "st", "st_castiron_coals", { q: "cast iron dutch oven on hot coals campfire" }),
  S(40, "The cook covered it", "c", "OleBeanhole3D", { props: { steps: ["Dig the hole", "Build the fire", "Coals for a bed", "Pot goes in", "Bury it", "Wait all night", "Dig it up"], stepEvery: 130, startStep: 4 } }),
  S(40, "No stirring", "av", ""),
  S(40, "You left it, the whole night", "st", "st_night_fire", { q: "campfire embers at night smoke" }),
  S(41, "", "av", ""),
  S(41, "Beans so tender they melted", "st", "st_beans_dark", { q: "dark baked beans in cast iron pot with molasses sauce bubbling" }),
  S(41, "with the salt pork gone soft", "st", "st_beans_ladle", { q: "ladle of baked beans with pork spooned" }),
  S(41, "The camp cooks I knew never wrote down", "bi", "b_smell", { p: BI("An old cook in a khaki apron bending over an open cast iron pot just lifted from the ground, eyes closed, sniffing the rising steam with a blissful expression, dirt still clinging to the pot rim, embers glowing in a pit behind him, night with a lantern."), anim: "steam rises from the pot into the lantern light" }),
  S(41, "And those beans are the reason", "ar", "ar_bunkhouse", { arch: "bunkhouse", cap: "Men came back to the camp with the good cook", credit: "Wikimedia Commons · public domain" }),
  S(42, "", "av", ""),
  S(42, "Simmer the beans first", "st", "st_beans_simmer", { q: "navy beans simmering in pot water" }),
  S(42, "Then stir in the molasses", "st", "st_molasses_beans", { q: "stirring molasses and brown sugar into beans" }),
  S(42, "and bake them covered", "c", "OleSupperCard", { props: { n: 1, title: "Camp Baked Beans", items: ["1 lb navy beans, simmered nearly tender", "molasses · brown sugar · mustard · vinegar", "Dutch oven, covered, 300°F", "about 4 hours, check every 45 min"], why: "sweet and sour go in last", note: "Ole's cookbook · page 13" } }),
  S(42, "The recipe for camp baked beans", "c", "OleBookPage", { props: { page: "img/olsup/book_p13.jpg", pageNo: 13, keys: [[0, 0.5, 0.5, 1], [1.2, 0.3, 0.55, 2.0], [4.0, 0.5, 0.82, 2.0], [7.0, 0.5, 0.5, 1]], caption: "Camp Baked Beans" } }),
  S(42, "The sweet and the sour go in only after", "av", ""),

  // ── CIERRE (p43-p45)
  S(43, "", "av", ""),
  S(43, "Every night, after the last plate", "ar", "ar_cookdoor", { arch: "cookdoor", cap: "The cook at the end of the long table", credit: "Wikimedia Commons · public domain" }),
  S(43, "and he didn't eat", "ole", "o_notEat", { p: OLEP("He stands at the far end of the long dim cookhouse table with his apron on and his arms at his sides, looking out over rows of empty tin plates and cups, a single lantern lighting the room, seen from a low side angle, quiet and moved.") }),
  S(43, "A cook doesn't get thanked", "av", ""),
  S(43, "And he looked down that table", "c", "OleCookhouse3D", { props: { focusN: 30, camTo: 1, dishes: [{ n: 30, kind: "empty", at: 0 }, { n: 29, kind: "empty", at: 0 }, { n: 28, kind: "empty", at: 0 }, { n: 27, kind: "empty", at: 0 }, { n: 26, kind: "empty", at: 0 }, { n: 25, kind: "empty", at: 0 }, { n: 24, kind: "empty", at: 0 }, { n: 23, kind: "empty", at: 0 }, { n: 22, kind: "empty", at: 0 }, { n: 21, kind: "empty", at: 0 }, { n: 20, kind: "empty", at: 0 }] } }),
  S(44, "", "av", ""),
  S(44, "None of those suppers was fancy", "st", "st_simple_ingredients", { q: "salt pork potatoes beans cabbage on rustic table simple ingredients" }),
  S(44, "But it was cooked with care", "bi", "b_cooktired", { p: BI("An old cook in a khaki apron at the end of a long day sitting on an upturned crate by the black wood stove, hands hanging between his knees, looking into the fire, tired and content, dirty pots stacked behind him, lantern and coal glow."), anim: "the fire flickers on his face" }),
  S(44, "And that's the part", "av", ""),
  S(45, "", "vl", "m6", { ov: { c: "OleNameTag", props: { name: "Ole", sub: "Ole's Camp Kitchen" } } }),
  S(45, "The link is in the description", "c", "OleCTA", { props: { cover: "img/olsup/portada.png", qr: "qr_ole_suppers.png", line1: "Ole's Logging Camp Cookbook", line2: "link in the description" } }),
  S(45, "And I want to hear from you", "av", "", { ov: { c: "OleComments", props: { items: [{ at: 1.0, text: "My grandpa ate beans and cornbread." }, { at: 3.5, text: "Salt pork and eggs!" }, { at: 6.0, text: "Boiled dinner every Sunday." }] } } }),
  S(45, "And if you liked sitting", "av", "", { ov: { c: "OleSubscribe", props: { text: "Subscribe", sub: "for the next supper" } } }),
];
