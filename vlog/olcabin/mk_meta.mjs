// public/olcabin_meta.json para deliver_card: título LITERAL de la tarjeta ole2026092507, guía ARRIBA, contenido útil,
// capítulos con los tiempos REALES (el audio no cambia entre renders: mismo máster → mismos tiempos).
// node vlog/olcabin/mk_meta.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/olcabin/";
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/olcabin_shots.json", "utf8"));
const ts = (s) => { s = Math.max(0, Math.floor(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const Wd = JSON.parse(fs.readFileSync(R + "_v3/olcabin_wordms.json", "utf8"));
const nz = (x) => x.toLowerCase().replace(/[^a-z0-9']/g, "");
const flat = Wd.map((w) => nz(w.w));
let cursor = 0;
const at = (phrase) => { const q = phrase.split(/\s+/).map(nz).filter(Boolean); for (let i = cursor; i + q.length <= flat.length; i++) if (q.every((t, k) => flat[i + k] === t)) { cursor = i + 1; return Wd[i].s; } throw new Error("sin frase " + phrase); };
const W = JSON.parse(fs.readFileSync(R + "_v3/olcabin_wordms.json", "utf8"));
const qi = W.findIndex((w, i) => /^quick$/i.test(w.w) && /^word/i.test(W[i + 1]?.w)); const quick = W[qi].s;
const N = [
  ["Number twenty-five", 25, "Egg coffee"], ["Number twenty-four", 24, "Fattigmann"], ["Number twenty-three", 23, "Pickled herring"], ["Number twenty-two", 22, "Fruit soup"],
  ["Number twenty-one", 21, "Krumkake"], ["Number twenty", 20, "Leipäjuusto"], ["Number nineteen", 19, "Nisu"], ["Number eighteen", 18, "Rice porridge"],
  ["Number seventeen", 17, "Dried-apple pie"], ["Number sixteen", 16, "Potato sausage"], ["Number fifteen", 15, "Bannock"], ["Number fourteen", 14, "Kringle"],
  ["Number thirteen", 13, "Sausage and sauerkraut"], ["Number twelve", 12, "Mojakka"], ["Number eleven", 11, "Wild rice hotdish"], ["Number ten", 10, "Swedish meatballs"],
  ["Number nine", 9, "Lanttulaatikko"], ["Number eight", 8, "Pannukakku"], ["Number seven", 7, "Lutefisk"], ["Number six", 6, "Limpa"], ["Number five", 5, "Salt-pork fish chowder"],
  ["Number four", 4, "Rømmegrøt"], ["Number three", 3, "The pasty"], ["Number two", 2, "Booyah"], ["And now, number one", 1, "Lefse"],
];
const CH = [[0, "The tin box"], [quick, "A quick word about the cookbook"], ...N.map(([p, n, name]) => [at(p), `#${n} ${name}`])];
cursor = 0; CH.push([at("That's the whole box, friend"), "The whole box"]);
const chapters = CH.sort((a, b) => a[0] - b[0]).map(([t, n]) => `${ts(t)} ${n}`).join("
");
const description = `📖 Ole's Logging Camp Cookbook — 50 old camp recipes with exact measures, the trick and the common mistakes on every page (five of the dishes in this video are written out in it): 👉 https://ole-camp-cookbook.vercel.app/?src=ole-olcabin

Come sit down, friend. Here's the whole tin box, and the recipe for number one written out so you can keep it.

THE 25, IN ORDER
25 Egg coffee: a raw egg mixed into the grounds, boiled until the foam settles, then half a cup of cold water
24 Fattigmann: egg yolks, cream, sugar and a splash of brandy, fried at about 350°F
23 Pickled herring: vinegar, sugar, water, allspice and peppercorns over herring with red onion and lemon
22 Fruit soup: prunes, dried apricots, raisins and dried apples with tapioca and cinnamon
21 Krumkake: a thin batter on a patterned iron, rolled on a cone
20 Leipäjuusto: Finnish bread cheese, baked or broiled until freckled
19 Nisu: Finnish cardamom bread, braided
18 Rice porridge (in the cookbook, page 60): 1/2 cup rice, 4 cups whole milk, 1/3 cup sugar
17 Dried-apple pie (page 59): 8 oz dried apples in 2 cups cider, two lard crusts, 400°F
16 Potato sausage: pork, beef, potatoes, onion and allspice
15 Bannock (page 23): flour, baking powder, salt, lard and water in a skillet
14 Kringle: Danish butter pastry from Racine, Wisconsin
13 Sausage and sauerkraut (page 43): smoked sausage, onion, two apples, caraway and kraut
12 Mojakka: Finnish-American beef or fish stew
11 Wild rice hotdish
10 Swedish meatballs with cream gravy
9 Lanttulaatikko: Finnish rutabaga casserole
8 Pannukakku: baked custard pancake
7 Lutefisk
6 Limpa: Swedish rye with molasses
5 Salt-pork fish chowder (page 34): 4 oz salt pork, 1 1/2 lb potatoes, 1 1/2 lb white fish, 3 cups milk, 1 cup cream. Do not boil it.
4 Rømmegrøt: sour cream porridge, crowned with its own butter
3 The pasty: beef, potato, rutabaga and onion in a lard crust, 400°F for 15 minutes then 350°F for about 45
2 Booyah: a stewing chicken and 2 lb of beef shank, simmered about 3 hours
1 Lefse

NUMBER ONE: LEFSE (Norwegian potato flatbread)
1. Boil about 1 3/4 lb russet potatoes and push them through a ricer while still hot.
2. Stir in 5 Tbsp butter, 1/4 cup heavy cream, 2 tsp sugar and 1 1/2 tsp salt.
3. The one way to ruin it: rolling it before it's cold. Chill the dough overnight, cold all the way through.
4. Next day, work in 1 1/2 cups flour, quickly. Roll each ball paper thin with a grooved lefse pin.
5. Slide a lefse stick under it and lay it on a hot dry griddle, about a minute a side, until it has little brown freckles. Stack between clean towels so it stays soft.
6. Butter and sugar, roll it up, and eat it right there.

Tell me in the comments which of these your family made, and which one you'll try first.

CHAPTERS
${chapters}

Ole's Camp Kitchen
(Ole is the channel's cook-character; the recipes are traditional methods adapted and tested for home kitchens. Archival photos: public domain via Wikimedia Commons; stock footage: Pexels.)`;
const meta = {
  title: "25 Forgotten Northwoods Recipes From Grandma's Cabin",
  description,
  pinned_comment: "Five of the dishes from my own kitchen that showed up on this list (rice porridge, dried-apple pie, bannock, sausage and sauerkraut, fish chowder) are written out in my cookbook, with every measure 💛 https://ole-camp-cookbook.vercel.app/?src=ole-olcabin — and tell me: which one did your family make?",
};
fs.writeFileSync(R + "public/olcabin_meta.json", JSON.stringify(meta, null, 2));
console.log(chapters);
