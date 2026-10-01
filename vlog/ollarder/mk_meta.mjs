import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/ollarder/";
const title = "How Logging Camps Kept 100 Men's Food From Freezing and Rotting All Winter (No Electricity)";
const L = "https://ole-camp-cookbook.vercel.app/?src=ole-ollarder";
const description = `📖 Ole's Logging Camp Cookbook — 50 old camp recipes with exact measures, the trick and the common mistakes on every page (the Root-Cellar Shelf, Small-Batch Sauerkraut and Rendering Lard from this video are in the Larder chapter): 👉 ${L}

Come sit down, friend. Here is the whole system a camp cook used to keep a hundred men's food from freezing solid and from rotting, written out so you can keep it.

THE THREE ZONES
ZONE 1 · THE COLD SIDE: meat stays frozen on purpose. Food held steady at 0°F is safe, but freezing only puts the germs to sleep: the clock starts the moment it thaws. Thaw in the refrigerator or in cold water you change as it warms, never on the counter, and cook it right after. Nothing wet (potatoes, jars, cans) belongs here: ice tears the cells and cracks the glass.
ZONE 2 · THE CELLAR (cold, never freezing) — numbers from the book:
• Potatoes 38–45°F, dark, 85–90% humidity (colder turns starch to sugar; warm them up for a week or two to fix it)
• Onions 32–40°F, dry, 65–70% humidity, cured, in a braid or mesh bag
• Carrots 32–40°F, very humid, layered in damp sand or sawdust
• Apples 30–40°F, 85–90% humidity, firm, wrapped in paper
• Cabbage 32–40°F, 90% humidity, whole heads on a shelf
Keep apples away from potatoes and carrots: the gas they give off makes potatoes sprout and carrots bitter.
ZONE 3 · THE DRY SIDE: flour, sugar, molasses, baking soda, tea, coffee, dry beans and dried fruit. Off the floor, covered, nothing wet near them.

THE FIVE-SECOND RULE: wet inside → keep it above freezing · meat → frozen or salted · dry → keep it dry.

SET UP YOUR SHELF
1. Sort: bruised, cut or soft goes to the kitchen now, only firm and sound goes down.
2. Cure onions and potatoes 1–2 weeks in a dry, shaded, airy spot.
3. Don't wash them: brush off loose dirt, wash right before cooking.
4. Look every week or two and pull anything soft: one rotten apple does spoil the bunch.
Hang a cheap thermometer where the food sits. A few degrees decides whether potatoes last until spring or sprout in December. Never eat green or shriveled potatoes; when in doubt, throw it out. No cellar? A cool, dark basement corner works for onions and potatoes; the refrigerator crisper suits carrots, apples and cabbage.

RENDERING LARD: chill the fat, cut it small, heat on the lowest heat or in a 250°F oven 1½ to 2 hours until clear and golden, strain through cheesecloth into clean jars. Refrigerator up to 3 months, freezer up to 6, bacon fat 1 month. Throw it out if it smells sour or like old paint.
SMALL-BATCH SAUERKRAUT: 2 lb shredded cabbage + salt at 2% of the weight (about 18 g), knead 5–10 minutes until it makes its own brine, pack tight, keep every shred under the brine, 65–72°F out of the sun, taste after a week (up to 4 weeks), then refrigerate up to 4 months. Fuzzy mold or slime: throw it out.
REFRIGERATOR PICKLES (not canning): pour the brine on hot; chill cucumbers in ice water for an hour and trim the blossom end. Keep them in the refrigerator: onions up to 3 weeks, cucumbers up to 1 month.

Tell me in the comments: what's the coldest place in your house, and what's living in it right now?

CHAPTERS
0:00 A hundred men, five months, no refrigerator
0:55 Why the food had to be there before winter
1:29 The cookbook
2:25 The three zones
2:57 Zone 1 · the cold side
5:55 Zone 2 · the cellar
8:29 The page from the book
9:27 The cheapest tool on the shelf
10:58 Zone 3 · the dry side
12:25 Salt pork and the bean hole
13:19 Lard
14:45 Sauerkraut
16:49 Pickles (an honest word)
17:20 A day in the cook shack
18:19 The three zones in your house
19:47 Your homework
20:14 The whole idea

NOTES & SOURCES
Ole is the cook-character of this channel and the scenes are illustrative. Historical details come from public accounts of north-woods logging camps (Millinocket Historical Society, Recollection Wisconsin, Maine Forestry, Gatineau Valley Historical Society). Food-safety and storage facts: USDA FSIS "Freezing and Food Safety", Missouri Extension (MP562), Idaho Potato Commission. Temperatures are approximate and vary by food and variety. Archival photographs are public domain via Wikimedia Commons (Clark Kinsey, Eric A. Hegg, Joseph John Kirkbride and others). These traditional methods are written for cooking at home: follow the temperatures and use good sense.

Ole's Winter Larder`;
fs.writeFileSync(R + "public/ollarder_meta.json", JSON.stringify({ title, description }, null, 1));
console.log(description.length, "chars");
