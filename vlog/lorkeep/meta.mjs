// public/lorkeep_meta.json (título literal de la tarjeta + descripción value-first + comentario fijado; capítulos = tiempos reales). node vlog/lorkeep/meta.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/lor3/", P = JSON.parse(fs.readFileSync(R + "_v3/lorkeep_paras.json", "utf8"));
const ts = (s) => { s = Math.floor(s); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const CH = [[0, "What Danny threw in the trash"], [4, "Use it up, wear it out"], [7, "12. Bread bags and twist ties"], [10, "11. Butter wrappers (and the foil)"], [13, "10. Brown paper bags"], [15, "9. Glass jars"], [18, "8. Church lady Tupperware"], [20, "7. Eggshells and coffee grounds"], [23, "6. Bread heels: bread pudding"], [26, "5. Pickle juice"], [29, "4. Potato water"], [32, "3. The coffee can by the stove"], [35, "2. Bones and scraps: broth and bean soup"], [38, "Your questions"], [41, "What it adds up to"], [42, "The card for your refrigerator"], [44, "1. Flour sacks"], [48, "My feed sack Easter dress, 1951"], [52, "What to remember"]];
const chapters = CH.map(([i, t]) => `${ts(P[i].s)} ${t}`).join("\n");
const title = "12 Things Church Ladies Never Threw Away (That You Toss Every Week)";
const trick = "The 13th thing: the button tin. Before a worn-out shirt or dress went to the rag bag, my mother cut off every button and put it in an old round cookie tin by her sewing machine. Every Easter dress she ever made me had buttons from that tin, and so did half the coats in our church. Cut them off before anything goes in the rags, thread the matching ones together on a safety pin, and you will never buy a card of buttons again.";
const description = `Come sit a while in my kitchen, honey. I'm Loretta. I've cooked for our little country church in Iowa for sixty years, and I was raised by a mother who lived through the Depression. Here are the 12 things the church ladies never threw away, and exactly what we did with each one.

12. BREAD BAGS + TWIST TIES: sandwiches and leftover rolls; over the children's socks inside their boots in winter. Twist ties hold up tomato vines and close the flour and sugar bags.
11. BUTTER WRAPPERS: fold and freeze; rub one inside a cake pan or a 9x13 to grease it. Clean foil and wax paper: wipe, smooth flat, fold, reuse.
10. BROWN PAPER BAGS: drain fried chicken, cover school books, wrap Christmas presents with a red ribbon.
9. GLASS JARS: beans, rice, buttons, nails, drinking glasses, soup to send home. Never use store jars (mayonnaise etc.) for canning: they can crack. Real canning jars only.
8. PLASTIC TUBS (whipped topping, margarine, cottage cheese): "church lady Tupperware" for sending leftovers home.
7. EGGSHELLS + COFFEE GROUNDS: rinsed, dried and crushed shells around the tomato plants; a little coffee grounds worked into the dirt around tomatoes and roses.
6. BREAD HEELS + DRY BREAD: a bag in the freezer.
   BREAD PUDDING: 6 cups torn dry bread, 3 eggs, 2 cups milk, 1/2 cup sugar, 1 tsp cinnamon, a little vanilla, a handful of raisins. Soak 20 min, bake 350°F about 45 min.
   Or crush it with a rolling pin for breadcrumbs: meatloaf, hotdish tops, stuffing.
5. PICKLE JUICE: keep it in the refrigerator. Pickled eggs (peeled hard boiled eggs, a few days), quick pickles (thin cucumber and onion overnight), a spoonful in potato salad or deviled eggs. Use it ONCE, then it goes.
4. POTATO WATER: use it instead of plain water in bread dough and dinner rolls (softer, higher, stays soft for days), or in gravy and soup. Refrigerator 2-3 days, or freeze it.
3. BACON GREASE: cool a little, strain into a jar, keep it in the REFRIGERATOR (about 3 months). A spoonful for frying eggs, the cornbread skillet, green beans, fried potatoes, gravy. A little goes a long way. If it ever smells sour, throw it out.
2. BONES + SCRAPS: a freezer bag for the chicken carcass, the ham bone, onion ends, carrot peels, celery leaves. Simmer 3-4 hours for broth and strain.
   HAM AND BEAN SOUP: 1 lb navy beans soaked overnight, the ham bone, 1 onion, 2 carrots.
   Cool broth fast in a sink of cold water and get it in the refrigerator within 2 hours.
1. FLOUR SACKS: dish towels that dry glasses with no lint and get softer every wash; aprons; dresses (3 sacks of the same print for one dress).

THE HOUSE RULE: if you keep it, you use it within the month. If you don't use it, it goes.

THE 13TH THING I MENTIONED
${trick}

CHAPTERS
${chapters}

Now tell me, honey: what did your grandma never throw away? What do you still keep today?`;
const pinned = `${trick} Now tell me, what did your grandma never throw away? I read every one.`;
fs.writeFileSync(R + "public/lorkeep_meta.json", JSON.stringify({ title, description, pinned_comment: pinned }, null, 1));
console.log("meta:", description.length, "chars ·", CH.length, "capítulos");
