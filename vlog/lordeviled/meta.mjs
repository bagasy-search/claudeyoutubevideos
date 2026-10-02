// public/lordeviled_meta.json = título (literal de la tarjeta) + descripción value-first + comentario fijado. Capítulos con los tiempos REALES
// del máster (= línea de tiempo del MP4 final): _v3/lordeviled_paras.json. node vlog/lordeviled/meta.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/lordeviled/";
const P = JSON.parse(fs.readFileSync(R + "_v3/lordeviled_paras.json", "utf8"));
const ts = (s) => { s = Math.floor(s); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, "0")}`; };
const CH = [[0, "The church basement trick (and what's wrong with the old way)"], [4, "Who I am, and what you asked me"], [9, "The old way: four things that go wrong"], [18, "The trick: sieve it, season it, mayonnaise last"], [20, "Loretta's Deviled Egg Card (pause and take a picture)"],
  [22, "Step 1: the eggs (why older eggs peel)"], [25, "Step 2: cold water, hard boil, lid on, heat off"], [29, "The ice water"], [31, "Step 3: peeling"], [34, "Step 4: cutting, drying the whites"], [37, "Step 5: the sieve"], [41, "Step 6: season the yolks first"],
  [44, "Step 7: mayonnaise last"], [47, "Step 8: filling and paprika"], [51, "Sugar or no sugar, mayonnaise or Miracle Whip"], [53, "The potluck: why 'deviled', how many to make"], [58, "Keeping them safe: the two-hour rule"], [62, "Carrying them without a disaster"],
  [69, "Five more church-table versions"], [77, "What goes wrong, and how to save it"], [86, "Mrs. Halvorsen's two-day schedule"], [93, "The whole thing in one breath, and your turn"]];
const chapters = CH.map(([i, t]) => `${ts(P[i].s)} ${t}`).join("\n");
const title = "NEVER Make Deviled Eggs the Old Way Again — Try This Church Potluck Trick";
const trick = "Monday Egg Salad from the leftover eggs: take about six leftover deviled egg halves (filling and all, and eat them within two days of when they were made), mash them together with a fork, add 1 teaspoon of the dill pickle juice, 1 tablespoon of finely chopped celery and a pinch of pepper, and spread it on soft white bread with a little butter. The filling is already seasoned, so you will not need salt. That's what Dottie and I ate on the Monday after every church supper.";
const description = `Come sit a while in my kitchen, honey. I'm Loretta. I've cooked for our little country church in Iowa for sixty years, and this is the way we made deviled eggs in that basement: smooth, never watery, never gray, and the plate was always the first one empty. Here is the whole thing, with every measurement.

THE CHURCH BASEMENT TRICK: sieve the yolks, season them first, and put the mayonnaise in last. And use eggs that are a week or two old.

LORETTA'S DEVILED EGGS (one dozen eggs = 24 halves)
- 12 large eggs, a week or two old
- 1/2 cup mayonnaise
- 2 teaspoons yellow mustard
- 1 tablespoon dill pickle juice
- 1 teaspoon sugar (leave it out if you like)
- 1/2 teaspoon salt, 1/4 teaspoon pepper
- paprika for the top
1. Put the eggs in one layer in a pot, cover with cold water by an inch, bring to a rolling boil. Turn the heat off, lid on, and leave 13 minutes (large eggs; medium 12, extra large 14). Then into ice water for 15 minutes.
2. Tap, roll and peel under a little running water, starting at the fat end. Cut lengthwise with a thin sharp knife wiped on a damp towel.
3. Pop the yolks into a bowl. Set the whites cut side down on paper towels for a few minutes. Shave a very thin slice off each rounded bottom so they sit flat.
4. Press the yolks through a fine sieve (chop the white trimmings very fine and stir them in). Stir in the mustard, pickle juice, sugar, salt and pepper into a thick paste and let it sit 2 minutes.
5. Add the mayonnaise in three big spoonfuls, stirring, until the filling holds a soft peak on the spoon. Too loose: one more sieved yolk. Too stiff: a teaspoon of pickle juice. Taste it, a little brighter than you think, because cold dulls flavor.
6. Fill the whites with a spoon (or a zip bag with the corner snipped), then dust the paprika through a little sieve.

THE FIVE OTHER CHURCH-TABLE VERSIONS (same 12 eggs, same sieved yolks)
- Sweet pickle: 3 tablespoons sweet relish, drained hard, 1 tablespoon sweet pickle juice, 2 teaspoons mustard, 1/2 cup mayonnaise, 1/4 teaspoon salt, no sugar.
- Ham and egg: 1/2 cup finely ground cooked ham, 1 tablespoon sweet relish, 2 teaspoons mustard, 1/2 cup mayonnaise, no salt (taste first).
- Paprika and dill: 6 tablespoons mayonnaise + 2 tablespoons sour cream, 2 tablespoons fresh dill (or 2 teaspoons dried), 1 teaspoon lemon juice, 1 teaspoon smoked paprika, no sugar.
- Angel eggs: 1/2 cup Miracle Whip instead of mayonnaise, 2 teaspoons mustard, 1/4 teaspoon salt, pinch of pepper, no sugar.
- The hot ones (Dottie's): the classic plus 1/2 teaspoon prepared horseradish, 4-5 shakes of hot sauce and a pinch of cayenne.

SAFETY, SAID PLAIN: deviled eggs sit out no more than 2 hours (1 hour if it's over 90°F). Keep the fridge at 40°F or colder, write the time on masking tape under the dish, and set the dish in a pan of ice on the table. Carry them in a clean egg carton, one half to a cup. If you don't know how long they've been out, throw them out.

THE LITTLE TRICK I MENTIONED
${trick}

CHAPTERS
${chapters}

Now tell me, honey: what did YOUR church table bring? And who in your church made the eggs nobody could match?`;
const pinned = `The little trick I mentioned: ${trick} And tell me, what did YOUR church table bring? I read every one.`;
fs.writeFileSync(R + "public/lordeviled_meta.json", JSON.stringify({ title, description, pinned_comment: pinned }, null, 1));
console.log("meta:", description.length, "chars ·", CH.length, "capítulos");
