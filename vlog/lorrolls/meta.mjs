// public/lorrolls_meta.json (título literal de la tarjeta + descripción value-first + comentario fijado; capítulos = tiempos reales). node vlog/lorrolls/meta.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/lor3/", P = JSON.parse(fs.readFileSync(R + "_v3/lorrolls_paras.json", "utf8"));
const ts = (s) => { s = Math.floor(s); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const CH = [[0, "Soft on Monday: the church dinner roll"], [4, "Who I am, and what you asked me"], [8, "Irene, the roll lady"], [10, "The old way, and why it fails"], [13, "Irene's secret: potato water"], [16, "The recipe, step by step"], [23, "Kneading, and how sticky is right"], [26, "Refrigerator rolls: make the dough days ahead"], [28, "Loretta's recipe card"], [30, "Shaping 24 rolls"], [34, "Baking, butter and the towel"], [36, "Cloverleaf, Parker House, crescents, cinnamon rolls"], [39, "Rolls for 200"], [42, "Five things that go wrong"], [45, "Freezing, and your questions"], [49, "Thanksgiving schedule"], [50, "The last rolls Irene made"], [53, "The five things to remember"]];
const chapters = CH.map(([i, t]) => `${ts(P[i].s)} ${t}`).join("\n");
const title = "NEVER Buy Dinner Rolls Again — My 1950s Church Kitchen Recipe";
const trick = "Irene's honey butter for Thanksgiving: beat 1/2 cup soft salted butter with 3 tablespoons honey and a pinch of cinnamon until fluffy, about 2 minutes. Pile it in a little dish and set it out at room temperature so it spreads on a warm roll without tearing it. Make it the day before and keep it in the refrigerator; take it out an hour before dinner.";
const description = `Come sit a while in my kitchen, honey. I'm Loretta. I made the rolls at our little country church in Iowa for most of sixty years, and this is the roll that's still soft on Monday. The secret is the water you boil your potatoes in.

LORETTA'S CHURCH DINNER ROLLS (2 dozen)
- 1 medium potato, peeled
- 2 1/4 tsp active dry yeast (1 packet)
- 1 cup milk
- 1/3 cup sugar
- 1/3 cup butter (or shortening, or lard)
- 1 egg
- 1 1/2 tsp salt
- 4 1/2 to 5 cups all-purpose flour (spoon it into the cup and level it; don't scoop)

1. Boil the potato in about 2 cups of water until soft, 15-20 min. SAVE THE WATER. Mash the potato smooth and measure 1/2 cup. Cool 1/2 cup of the potato water to warm.
2. Warm the milk with the butter and sugar until the butter melts, then cool to warm, about 110°F (like a baby's bath on your wrist). Above about 130°F the yeast dies.
3. Sprinkle the yeast over the warm potato water with a pinch of sugar. Wait 10 minutes. It must foam; if it doesn't, get new yeast.
4. Stir together the yeast, milk, egg, mashed potato and salt. Add flour a cup at a time until a soft dough pulls from the bowl.
5. Knead 8-10 minutes (or 6-7 min with a dough hook). Keep it a little tacky, like the back of a postage stamp. It's ready when it springs back when poked.
6. Buttered bowl, turn once, cover tight, refrigerator overnight or up to 3 days.
7. Shape cold: cut into 24 pieces, pull each one tight on top and roll into a ball. Buttered 9x13 pan, 4 rows of 6, just touching. Cover and rise until doubled, 1 to 1 1/2 hours (oven off, light on, if your kitchen is cold).
8. Bake at 375°F for 18-20 min, deep golden, about 190°F inside or hollow when tapped. Brush with melted butter right away and cover with a clean towel for 5 minutes.

SHAPES: Cloverleaf = 3 walnut-size balls per muffin cup. Parker House = 1/2 inch thick circles, buttered, folded in half. Crescents = a big circle cut in 12 wedges, rolled from the wide end. Cinnamon rolls = a rectangle spread with soft butter, 1/2 cup brown sugar and 2 tsp cinnamon, rolled and sliced, 375°F about 25 min.

FOR 200: the recipe x 8 (8 potatoes, 8 packets yeast, 8 cups milk, about 40 cups flour).
INSTANT YEAST: same amount, can go right in the flour. NO POTATO: 2 tbsp instant potato flakes in 1/2 cup hot water + plain warm water. WHOLE WHEAT: swap up to 1 cup.
FREEZE: bake, cool, freezer bag, about 2 months. Warm wrapped in foil at 350°F about 15 min.
THANKSGIVING AT 2:00: dough Tuesday night · shape Thursday at 10:00 · oven on 12:45 · rolls in at 1:00, out at 1:20.

THE LITTLE TRICK I MENTIONED
${trick}

CHAPTERS
${chapters}

Now tell me, honey: who made the rolls in YOUR family, and what did she call them?`;
const pinned = `The little trick I mentioned: ${trick} Now tell me, who made the rolls in YOUR family? I read every one.`;
fs.writeFileSync(R + "public/lorrolls_meta.json", JSON.stringify({ title, description, pinned_comment: pinned }, null, 1));
console.log("meta:", description.length, "chars ·", CH.length, "capítulos");
