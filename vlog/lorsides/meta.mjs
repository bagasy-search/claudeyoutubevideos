// public/lorsides_meta.json = título (literal de la tarjeta) + descripción value-first + comentario fijado. Capítulos con los tiempos REALES
// del máster (= línea de tiempo del MP4 final). SLUG=lorsides node vlog/lorsides/meta.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/lor3/";
const P = JSON.parse(fs.readFileSync(R + "_v3/lorsides_paras.json", "utf8"));
const ts = (s) => { s = Math.floor(s); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, "0")}`; };
const CH = [[0, "25 sides nobody makes anymore"], [4, "Who I am"], [8, "25-21 Pennies, cucumbers, beet eggs, wilted lettuce, slaw"], [18, "20-16 Bean, pea, macaroni, seven layer, German potato"], [28, "Keeping it safe on a long table"], [31, "15-10 The gelatin and fluff salads"], [43, "The make-ahead card"], [44, "9-6 Beans and corn"], [52, "5-2 Green beans, sweet potatoes, cheesy potatoes, glorified rice"], [61, "1 Scalloped pineapple"], [65, "Your turn"]];
const chapters = CH.map(([i, t]) => `${ts(P[i].s)} ${t}`).join("\n");
const title = "25 Church Supper Side Dishes We Need to Bring Back";
const trick = "Cheesy potatoes for a crowd without the soggy middle: spread the potatoes in TWO 9x13 pans instead of one deep roaster, and put the cornflakes on only for the last 20 minutes of baking. Shallow pans heat through evenly, and the topping stays crunchy all the way down the serving line. If you make them the night before, keep the cornflakes in a bag and add them in the morning.";
const description = `Come sit a while in my kitchen, honey. I'm Loretta. I've cooked for our little country church in Iowa for sixty years, and these are the side dishes every lady in our basement could make with her eyes closed. Here are all twenty-five, with every measurement (c = cup).

SAFETY: mayo, sour cream and egg dishes stay cold on ice; nothing sits out over 2 hours.

25 COPPER PENNIES: 2 lb carrot coins boiled 5 min · onion, green pepper · boil 1 can tomato soup, 1/2 c oil, 3/4 c vinegar, 1 c sugar, 1 tsp mustard, 1 tsp Worcestershire; pour hot, overnight.
24 CREAMED CUCUMBERS: 2 cucumbers sliced + 1 tsp salt, 30 min, SQUEEZE dry · 1/2 c sour cream, 1 tbsp vinegar, 1 tsp sugar, dill, onion.
23 RED BEET EGGS: beet juice + 1/2 c sugar + 1/2 c vinegar, hot, over beets · peeled hard boiled eggs in, 1-2 days.
22 WILTED LETTUCE: 4 slices bacon · in 2 tbsp drippings: 1/4 c vinegar, 1 tbsp sugar, 2 tbsp water; pour hot over leaf lettuce.
21 24-HOUR SLAW: 1 cabbage, onion, pepper · boil 1 c vinegar, 1 c sugar, 3/4 c oil, 1 tsp celery seed, 1 tsp dry mustard; pour hot, 24 h.
20 THREE BEAN: green, wax, kidney beans · 1/2 c sugar, 2/3 c vinegar, 1/3 c oil.
19 PEA SALAD: 1 lb frozen peas THAWED, not cooked · 1 c cheddar cubes · 1/4 c onion · 2 eggs · 1/2 c mayo · bacon.
18 MACARONI SALAD: 2 c elbows, celery, onion, 1/2 c sweet pickle, 3 eggs · 1 c mayo, 2 tbsp mustard, 1 tbsp sugar, 2 tbsp pickle juice.
17 SEVEN LAYER: lettuce, celery, onion, frozen peas · 2 c mayo to the edges · 1 tbsp sugar · 2 c cheddar · 1 lb bacon. Overnight.
16 HOT GERMAN POTATO: 2 lb red potatoes · 6 bacon · onion + 1 tbsp flour, 1/3 c vinegar, 2 tbsp sugar, 1/2 c water. Warm.
15 LIME SALAD: 3 oz lime gelatin + 1 c boiling water, cool till thick · 1 c cottage cheese, 8 oz crushed pineapple, 1 c whipped topping, 1/2 c walnuts.
14 CRANBERRY SALAD: 12 oz cranberries + 1 orange + 1 apple, ground · 1 c sugar · 3 oz red gelatin + 1 c boiling water · celery, nuts.
13 FIVE CUP: 1 c each mandarin oranges, pineapple, coconut, marshmallows, sour cream. Overnight.
12 WATERGATE: 3.4 oz instant pistachio pudding (dry) + 20 oz crushed pineapple with juice · 8 oz whipped topping · 1 c marshmallows · 1/2 c pecans.
11 FROG EYE: 1 c acini di pepe · custard of pineapple juice, 1/2 c sugar, 1 tbsp flour, 1 egg · overnight · pineapple, 2 cans mandarins, whipped topping, marshmallows.
10 TAFFY APPLE: pineapple juice + 1 egg + 1/2 c sugar + 1 tbsp flour + 1 1/2 tbsp vinegar, cooked thick · 8 oz whipped topping · 20 oz pineapple · 3-4 apples · 1 1/2 c salted peanuts.
9 CALICO BEANS: 1 lb beef + onion · 1/2 lb bacon · pork & beans, kidney, butter beans · 1/2 c brown sugar, 1/2 c ketchup, 1 tbsp vinegar, 1 tsp mustard · 350°F 1 h.
8 CHURCH BAKED BEANS: 1 lb navy beans soaked, simmered 1 h · 1/3 c molasses, 1/2 c brown sugar, 1 tsp dry mustard, 1 onion, 1/4 lb salt pork · 300°F 5-6 h.
7 CORN PUDDING: 2 c corn, 3 eggs, 2 tbsp sugar, 2 tbsp flour, 2 c milk, 2 tbsp butter · 350°F 45-60 min, middle jiggles a little.
6 SCALLOPED CORN: cream corn + whole corn · 2 eggs · 1/2 c milk · 1 c crushed saltines · 350°F about 1 h.
5 GREEN BEAN CASSEROLE: 2 lb fresh beans boiled 5 min · 1 can cream of mushroom · 1 tsp soy sauce · 1 c fried onions in, 1/2 c on top last 5 min · 350°F 30 min.
4 SWEET POTATO: 3 c mashed, 1/2 c sugar, 2 eggs, 1/2 c milk, 1/3 c butter, vanilla · top: 1 c brown sugar, 1/3 c flour, 1/3 c butter, 1 c pecans · 350°F 25-30 min.
3 CHEESY POTATOES: 2 lb hash browns, 1 can cream of chicken, 2 c sour cream, 2 c cheddar, 1/2 c butter, onion · 2 c cornflakes + 1/4 c butter · 350°F 45-55 min.
2 GLORIFIED RICE: 3 c cooked rice, cold · 20 oz pineapple, drained · 2 c marshmallows · 1 c cream whipped with 2 tbsp sugar · chill 4 h.
1 SCALLOPED PINEAPPLE: 4 c bread cubes · 1/2 c butter, 3/4 c sugar, 3 eggs · 20 oz crushed pineapple with juice · 350°F 40 min.

THE LITTLE TRICK I MENTIONED
${trick}

CHAPTERS
${chapters}

Now tell me, honey: what did YOUR church table bring? Which side dish did your grandma make that nobody makes anymore?`;
const pinned = `The little trick I mentioned: ${trick} Now tell me, what did YOUR church table bring? I read every one.`;
fs.writeFileSync(R + "public/lorsides_meta.json", JSON.stringify({ title, description, pinned_comment: pinned }, null, 1));
console.log("meta:", description.length, "chars ·", CH.length, "capítulos");
