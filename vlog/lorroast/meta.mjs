// public/lorroast_meta.json (título literal de la tarjeta + descripción value-first + comentario fijado; capítulos = tiempos reales). node vlog/lorroast/meta.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/lor3/", P = JSON.parse(fs.readFileSync(R + "_v3/lorroast_paras.json", "utf8"));
const ts = (s) => { s = Math.floor(s); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const CH = [[0, "Softer than butter, with just a fork"], [4, "Sunday pot roast before church"], [8, "Why the oven dries it out"], [10, "The cut to buy (and the ones to skip)"], [13, "What you need"], [14, "Salt it, flour it, brown it dark"], [18, "Trick 1: vegetables on the bottom"], [20, "Bernice's secret: one cup of black coffee"], [23, "Trick 2: don't drown it"], [25, "Trick 3 and 4: low, and don't lift the lid"], [27, "How to know it's done"], [29, "The gravy"], [31, "Loretta's recipe card"], [33, "Eight slow cookers for a funeral dinner"], [37, "Frozen roast? Leftovers?"], [39, "One roast, three suppers"], [43, "Mistakes and how to fix them"], [46, "Your questions: onion soup mix, before work"], [49, "Mr. Petersen's last roast"], [53, "The six things to remember"]];
const chapters = CH.map(([i, t]) => `${ts(P[i].s)} ${t}`).join("\n");
const title = "NEVER Make Pot Roast in the Oven Again — Try This Old Church Crockpot Trick";
const trick = "A roast in a hurry (only 5 hours): cut the chuck roast into 3 or 4 big pieces before you salt and brown it. More browned sides means more flavor, and the smaller pieces get tender faster. Same vegetables on the bottom, same cup of coffee, then cook on HIGH for about 5 hours, and start checking with the fork twist at 4 1/2. Low is still better when you have the time.";
const description = `Come sit a while in my kitchen, honey. I'm Loretta. I've cooked for our little country church in Iowa for sixty years, and for forty of them my oven pot roast came out like shoe leather. Then Bernice brought her slow cooker to church in 1974 and showed me her secret. Here is the whole thing.

BERNICE'S CHURCH POT ROAST (feeds 6-8)
- 3 to 4 lb CHUCK roast (chuck, shoulder or 7-bone roast; look for the white lines of fat)
- about 2 tsp salt + plenty of pepper
- 2-3 tbsp flour, for dusting
- 2 tbsp oil
- 2 onions, thick slices
- 1 lb carrots, 2-inch chunks
- 1 1/2 lb small potatoes, halved
- 3 cloves garlic
- 1 cup strong BLACK COFFEE
- 1 cup beef broth
- 1 tbsp Worcestershire sauce
- 2 bay leaves

1. Pat the roast dry. Salt and pepper every side. Dust it in flour.
2. BROWN IT DARK in a very hot heavy skillet with the oil, 4-5 minutes a side and the edges. Don't touch it while it browns.
3. VEGETABLES ON THE BOTTOM: onions first, then carrots and potatoes. The roast goes on top.
4. BERNICE'S SECRET: pour the cup of black coffee into the hot skillet and scrape up all the brown bits. Pour it over the roast. It does not taste like coffee; it makes the gravy dark and rich.
5. Add the broth, Worcestershire, garlic and bay leaves. DON'T DROWN IT: the liquid only comes halfway up the vegetables.
6. LOW for 8-9 hours. Not high. DON'T LIFT THE LID (every peek costs about 20 minutes).
7. DONE = push a fork in and twist; it falls apart. Still tough? It isn't done. One more hour. (Chuck turns tender at about 200°F inside.)

THE GRAVY: lift out the meat and vegetables and cover with foil. Pour the juice into a saucepan, let the fat rise and skim it. Stir 2 tbsp cornstarch into 1/4 cup cold water, whisk it in, and let it bubble 2 minutes. Taste for salt.

ONE ROAST, THREE SUPPERS
Sunday: the roast, the vegetables, the gravy and rolls.
Monday: HOT BEEF SANDWICHES. Two slices of white bread, leftover roast warmed in the gravy on top, mashed potatoes beside it, gravy over everything.
Wednesday: VEGETABLE BEEF SOUP. The last bits of roast, the last of the gravy, 1 can tomatoes, 1 bag frozen mixed vegetables, a handful of barley, water. 1 hour on the stove.

FIX IT: tough = not done, one more hour on low. Dry and stringy = lean cut or cooked on high. Mushy vegetables = cut too small (2 inches). Hard vegetables = they were on top. Thin, tasteless gravy = boil the juice down 10 minutes before thickening, add a spoon of Worcestershire.
ONION SOUP MIX: yes, one packet; leave out the salt. BEFORE WORK: brown it the night before and refrigerate; in the morning everything in the pot on low, 8-10 hours is fine.
SAFETY: never put a FROZEN roast in a slow cooker; thaw it in the refrigerator (about 2 days for 4 lb). Never start a roast on "warm". Nothing out more than 2 hours. Leftovers in the refrigerator within 2 hours, 3-4 days.
FOR A FUNERAL DINNER OF 60: 8 roasts in 8 slow cookers, in at 6 in the morning on low, switched to warm when done.

THE LITTLE TRICK I MENTIONED
${trick}

CHAPTERS
${chapters}

Now tell me, honey: what was Sunday dinner at your house after church? Did your mother make her pot roast in the oven, or in the slow cooker?`;
const pinned = `The little trick I mentioned: ${trick} Now tell me, what was Sunday dinner at your house after church? I read every one.`;
fs.writeFileSync(R + "public/lorroast_meta.json", JSON.stringify({ title, description, pinned_comment: pinned }, null, 1));
console.log("meta:", description.length, "chars ·", CH.length, "capítulos");
