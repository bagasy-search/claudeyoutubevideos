// public/lorhotdish_meta.json (título literal de la tarjeta + descripción value-first + comentario fijado; capítulos = tiempos reales). node vlog/lorhotdish/meta.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/lor3/", P = JSON.parse(fs.readFileSync(R + "_v3/lorhotdish_paras.json", "utf8"));
const ts = (s) => { s = Math.floor(s); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const CH = [[0, "200 people for $20"], [4, "What is a hotdish?"], [8, "The 1962 receipt"], [11, "How the church ladies stretched it"], [13, "The family hotdish, step by step"], [17, "The noodle secret: 3 minutes short"], [20, "Saucy, the crunch, covered then uncovered"], [24, "What goes on the plate with it"], [25, "Loretta's recipe card"], [27, "How we made it for 200"], [31, "A crowd on a budget today"], [33, "Tater tot, chow mein, tuna noodle, wild rice"], [37, "Mistakes and how to save it"], [40, "Your questions: turkey, slow cooker"], [43, "Make it ahead and freeze it"], [46, "The blizzard of 1962"], [49, "The five things to remember"]];
const chapters = CH.map(([i, t]) => `${ts(P[i].s)} ${t}`).join("\n");
const title = "The Church Basement Hotdish That Fed 200 People for $20";
const trick = "Mrs. Halvorsen's cream sauce instead of the cans: melt 4 tablespoons butter, stir in 4 tablespoons flour for 1 minute, then whisk in 1 cup milk and 1 cup beef or chicken broth. Simmer until it coats a spoon, 3-4 minutes, and season with 1/2 teaspoon salt, pepper and a pinch of onion powder. Add 1 cup of mushrooms cooked in butter if you like. It replaces both cans and the 1/2 cup of milk.";
const description = `Come sit a while in my kitchen, honey. I'm Loretta. I've cooked for our little country church in Iowa for sixty years, and this is the hotdish that fed two hundred people in our basement in 1962 for $20.11. Here is the family size, the church size, and four more.

LORETTA'S CHURCH HOTDISH (one 9x13 pan, feeds 10-12)
- 1 lb ground beef, 1 onion, 2 stalks celery
- 1 tsp salt, 1/2 tsp pepper, 1 tsp Worcestershire
- 8 oz WIDE egg noodles
- 1 can cream of mushroom soup + 1 can cream of chicken soup
- 1/2 cup milk
- 1 can corn, drained (or 1 1/2 cups thawed, drained peas)
- 1 cup cheddar, shredded from the block
- 1 sleeve saltines (or 1 cup potato chips), crushed, + 2 tbsp melted butter

1. Brown the beef with the onion and celery; season it while it cooks. DRAIN THE FAT.
2. THE NOODLE SECRET: cook the noodles 3 minutes LESS than the package says (8 → 5), then rinse them cold. They finish in the oven.
3. Stir beef, noodles, both soups, milk, corn and half the cheese gently. It should look a little too saucy.
4. Buttered 9x13, rest of the cheese, then the buttery crumbs.
5. 350°F: 20 min covered with foil, then 15 min uncovered until brown and bubbling.
6. Rest 10 minutes before cutting.

FOR 200 (the family pan x about 17): 20 lb hamburger, 12 lb egg noodles, 16 cans cream soup, onions, celery, 4 big cans corn, 5 lb cheese, crackers.
TATER TOT: same beef and soup, green beans instead of corn, no noodles; tots in rows on top; 375°F about 45 min.
CHOW MEIN: beef, lots of celery, onion, 1 cup uncooked rice, 2 cans soup, 1 can water, 2 tbsp soy sauce; covered 1 hour; chow mein noodles on top at the end.
TUNA NOODLE: 2 cans tuna instead of beef, peas instead of corn, same short-cooked noodles.
WILD RICE: cooked wild rice instead of noodles, chicken or beef, mushrooms.

SAVE IT: mushy = noodles cooked too long. Dry = 1/2 cup warm milk or broth around the edges, cover, 10 more minutes. Watery = drain the vegetables and the fat.
TURKEY: add 1 tbsp oil and a little more seasoning. SLOW COOKER: brown the beef first; beef, soup, milk and vegetables on low 3 hours; short-cooked noodles for the last 30 minutes.
MAKE AHEAD: refrigerate overnight and add about 15 minutes. FREEZE unbaked, wrapped tight and dated, about 3 months; thaw overnight, bake 45-50 minutes.
SAFETY: hot food at 140°F or above; nothing out more than 2 hours.

THE LITTLE TRICK I MENTIONED
${trick}

CHAPTERS
${chapters}

Now tell me, honey: hotdish or casserole? Where are you from, and what was in your church's hotdish?`;
const pinned = `The little trick I mentioned: ${trick} Now tell me, hotdish or casserole? I read every one.`;
fs.writeFileSync(R + "public/lorhotdish_meta.json", JSON.stringify({ title, description, pinned_comment: pinned }, null, 1));
console.log("meta:", description.length, "chars ·", CH.length, "capítulos");
