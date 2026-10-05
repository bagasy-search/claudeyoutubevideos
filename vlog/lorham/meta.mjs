// public/lorham_meta.json = título (literal de la tarjeta) + descripción value-first + comentario fijado. Capítulos con los tiempos REALES
// del máster (= línea de tiempo del MP4 final): _v3/lorham_paras.json. node vlog/lorham/meta.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/lorham/";
const P = JSON.parse(fs.readFileSync(R + "_v3/lorham_paras.json", "utf8"));
const ts = (s) => { s = Math.floor(s); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, "0")}`; };
const CH = [[0, "The four things that keep a ham from drying out"], [4, "Who I am, and what you asked me"], [8, "The old way: why a ham comes out dry"], [14, "Which ham do you have? (spiral, bone-in, country)"],
  [18, "How much ham, and the one tool you need"], [20, "Thing 1: go low, 275°F"], [23, "Thing 2: cut side down, a cup of juice, foil sealed tight"], [28, "Thing 3: the glaze, and when"],
  [38, "Thing 4: pull it at 140°F and rest it 20 minutes"], [43, "Carving a spiral ham and a bone-in ham"], [46, "Loretta's Spiral Ham Card"], [47, "A clock for a 10 lb ham"], [51, "Scoring the fat and the cloves"],
  [54, "Your questions: slow cooker, frozen, boneless, store-glazed"], [58, "The first ham I ever baked (1965)"], [61, "How a church fed 200: the math and the two-hour rule"], [70, "Four more church-supper glazes"],
  [76, "Seven mistakes, and how to save a dry ham"], [85, "Leftovers: ham salad, ham bone soup, scalloped potatoes"], [89, "Mrs. Halvorsen's last secret"], [94, "The whole thing in one breath, and your turn"]];
const chapters = CH.map(([i, t]) => `${ts(P[i].s)} ${t}`).join("\n");
const title = "NEVER Bake Your Ham the Old Way Again — Try This Church Supper Trick";
const trick = "Keep leftover ham juicy: slice it, lay the slices in a container with 2 tablespoons of the strained pan juices, and cover it tight. Reheat the slices covered with foil at 300°F for 10 to 15 minutes, or in a skillet over low heat with a splash of the juices, only until warm. Eat the leftovers within 3 or 4 days, or freeze them wrapped tight for a month or two.";
const description = `Come sit a while in my kitchen, honey. I'm Loretta. I've cooked for our little country church in Iowa for sixty years, and this is the way every ham came out of that church basement: juicy, shiny, never dry, never burnt, and gone before the potatoes. Here is the whole thing, with every temperature and every minute.

THE FOUR THINGS: bake it low and slow, put it cut side down with a cup of juice and foil crimped tight, glaze it late in two coats, and pull it at 140°F and let it rest. Then spoon the pan juices over the slices.

LORETTA'S SPIRAL HAM, NEVER DRY (for a fully cooked ham; about 1/2 lb per person with the bone in)
- 1 fully cooked spiral ham, 8 to 10 lb
- 1 cup pineapple juice, apple juice or water, for the pan
1. Take the ham out of the refrigerator 1 hour before it goes in the oven (never more than 2 hours out in total). Remove any plastic disk and glaze packet.
2. Oven at 275°F. Put the ham cut side down in a roasting pan, pour in the cup of juice, and crimp a big sheet of foil tight all around the rim. Bake about 15 minutes per pound, without opening the door.
3. Put a thermometer probe in the thickest part, not touching the bone. At about 120°F, peel the foil back, turn the oven up to 375°F, and brush on half of the glaze, working it down between the slices.
4. Ten minutes later brush on the rest and bake 10 to 15 minutes more. If the top gets too dark, lay a loose piece of foil over it.
5. Pull the ham at 140°F (a fresh or cook-before-eating ham needs 145°F and a 3 minute rest). Rest it 20 minutes under a loose foil tent before carving.
6. Strain the pan juices into a small saucepan, add 1 tablespoon of butter and a spoonful of glaze, warm it (don't boil) and spoon a little over each row of slices.

THE CLASSIC GLAZE: 1 cup packed brown sugar, 1/4 cup honey, 1/4 cup yellow mustard, 1/2 cup pineapple juice, 1/4 teaspoon ground cloves. Simmer 5 minutes, until it's like warm syrup.

FOUR MORE GLAZES (same two coats, last 20 to 30 minutes)
- Cola: 12 oz can of cola + 1/2 cup brown sugar, boiled down 15 minutes until thick.
- Maple and orange: 1/2 cup real maple syrup, 1/4 cup orange juice, 1 tablespoon Dijon mustard, simmered 5 minutes.
- Apricot and mustard: 1 cup apricot preserves + 2 tablespoons mustard, warmed until loose.
- The fifties: pineapple rings pinned on with toothpicks, a cherry in each ring, brushed with the classic glaze.

A 10 LB HAM FOR 5 O'CLOCK: out of the refrigerator at 12:30, in the oven at 1:30 (150 minutes at 275°F), glaze at about 4:00, rest at 4:30, serve at 5:00.

SAFETY, SAID PLAIN: ham sits out no more than 2 hours total. Keep it at 140°F or above, or 40°F or below. Leftovers go in the refrigerator within 2 hours and are good 3 to 4 days.

THE LEFTOVERS
- Ham salad: 2 cups ground or finely chopped ham, 1/4 cup mayonnaise, 2 tablespoons sweet pickle relish, 1 teaspoon yellow mustard.
- Ham bone soup: the bone, 1 lb navy beans (soaked overnight), 1 onion, 2 carrots, 2 celery stalks, a bay leaf, water to cover, simmer about 2 hours, salt at the end.
- Scalloped potatoes and ham: 4 lb potatoes sliced thin, 2 cups diced ham, a sauce of 3 tablespoons butter, 3 tablespoons flour and 2 1/2 cups milk; 350°F covered 1 hour, uncovered 30 minutes.

THE LITTLE TRICK I MENTIONED
${trick}

CHAPTERS
${chapters}

Now tell me, honey: what did YOUR church table bring? And who in your church made the ham nobody could match?`;
const pinned = `The little trick I mentioned: ${trick} And tell me, what did YOUR church table bring? I read every one.`;
fs.writeFileSync(R + "public/lorham_meta.json", JSON.stringify({ title, description, pinned_comment: pinned }, null, 1));
console.log("meta:", description.length, "chars ·", CH.length, "capítulos");
