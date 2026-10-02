// DIRECTOR D — los errores que cortan la receta y cómo salvarla + el cronograma de Mrs. Halvorsen + el cierre (párrafos 77-95)
import { S, BI, LORP, EI } from "./dir_lib.mjs";
const FIX = (p, at, n, title, text, bed) => S(p, at, "c", "LorTrick", { props: { title: `Problem ${n}`, text, stamp: title, bed } });
export const SHOTS = [
  S(77, "", "av", ""),
  S(77, "I didn't", "ei", "e_firsttime", { p: EI("1967", "a young woman in an apron holding up a flat, sunken, failed cake in a farmhouse kitchen while an older neighbor in a flowered apron stands beside her with a comforting hand on her shoulder, a bowl of batter and a rolling pin on the counter, a calendar on the wall.") }),
  S(77, "So here are", "bi", "b_notebookerrors", { p: BI("A spiral recipe notebook open on a floury table with a pencil lying across the page and a small pile of ruined eggs on a plate beside it: a cratered peeled egg, a gray-ringed yolk, a bowl of lumpy filling, an old woman's hand reaching to tap the notebook."), anim: "the hand taps the notebook page" }),
  // ── 1 aguado
  S(78, "", "bi", "b_loosefill", { p: BI("A big spoon of loose watery yellow egg filling tipping and running off a spoon back into a glass bowl in a long thin stream, a floury table, a jar of mayonnaise, the yellow checked curtain behind and an old woman's frowning reflection in the bowl."), anim: "the filling runs off the spoon in a stream" }),
  FIX(78, "And the fix is easy", 1, "Too loose", "Boil one more egg. Sieve the yolk in.", "img/lordeviled/b_loosefill.jpg"),
  S(78, "That's why I always", "bi", "b_extrayolk", { p: BI("A small saucepan on a white enamel stove with two extra eggs boiling in it set apart from the main pot of a dozen, an old woman's hand holding a kitchen timer, a pencil note on a paper beside the stove, the yellow checked curtain behind."), anim: "the extra eggs bob in the small pan" }),
  S(78, "And if you don't have", "av", ""),
  // ── 2 duro
  S(79, "", "bi", "b_stifffill", { p: BI("A crumbly stiff mound of egg yolk filling heaped in a glass bowl standing up in a dry lump around a spoon with cracks across it, an old woman's hand holding the spoon, a jar of dill pickles and a tablespoon on the floury table."), anim: "the spoon cracks the stiff mound" }),
  FIX(79, "Add a teaspoon", 2, "Too stiff", "A teaspoon of pickle juice. Let it drink.", "img/lordeviled/b_stifffill.jpg"),
  S(79, "Don't dump it in", "bi", "b_teaspoon", { p: BI("A teaspoon dripping one single drop of pickle juice from a jar into a bowl of filling, an old woman's careful hand, the glass jar of dill pickles with its lid off and a dish towel on the floury table."), anim: "one drop falls into the filling" }),
  // ── 3 anillo gris
  S(80, "", "bi", "b_grayring2", { p: BI("A halved hard boiled egg on a white saucer with a thin gray-green ring around the yolk held up between an old woman's finger and thumb to the window light, a pot of eggs and a bowl of ice water in the background, the yellow checked curtain."), anim: "the egg turns slowly in the light" }),
  FIX(80, "If it's just a thin ring", 3, "Gray ring", "Sieve it. A little more mustard.", "img/lordeviled/b_grayring2.jpg"),
  S(80, "And next time", "av", ""),
  // ── 4 claras rotas
  S(81, "", "bi", "b_tornwhite", { p: BI("A torn egg white half with a gaping hole lying on a floury cutting board next to a perfect one, an old woman's finger tracing the tear, a bowl of golden sieved yolks and a spoon behind them, a dish towel."), anim: "the finger traces the tear" }),
  S(81, "You chop it", "bi", "b_chopnstir", { p: BI("An old woman's knife chopping a torn piece of egg white very fine on a wooden board and her hand sweeping it into a glass bowl of golden filling, a spoon stirring, the other white halves lined up neatly beside the board."), anim: "the chopped white sweeps into the bowl" }),
  S(81, "A good mound", "lor", "l_mound", { p: LORP("She mounds a heaped spoon of golden filling high over a slightly torn egg white on a glass dish with a wink toward the camera, a dish of other neat deviled eggs beside it on the floury table.") }),
  // ── 5 soso
  S(82, "", "lor", "l_flat", { p: LORP("She tastes the filling from a spoon and pulls a face, tongue slightly out, shaking her head as if it is flat, a salt cellar and a jar of mustard waiting beside the bowl on the floury table.") }),
  FIX(82, "If it's flat", 5, "Tastes flat", "Salt. Pickle juice. Mustard. Taste again.", "img/lordeviled/l_flat.jpg"),
  S(82, "You can't season", "av", ""),
  // ── 6 grumos
  S(83, "", "bi", "b_lumpy2", { p: BI("A bowl of egg filling that is smooth in the middle but full of dry yellow lumps around the edges where the mayonnaise has been stirred in, an old woman's hand holding a fork above it, sieve and wooden spoon beside the bowl on the floury table."), anim: "the fork lifts a stubborn lump" }),
  S(83, "But if you've already", "bi", "b_resieve", { p: BI("An old woman pressing a bowl of already mixed filling through a fine metal sieve with the back of a big spoon into a clean glass bowl below, a smooth pale-yellow ribbon of filling coming through, flour dust, a dish towel."), anim: "smooth filling presses through the mesh" }),
  S(83, "I have rescued", "lor", "l_rescue", { p: LORP("She stands at the kitchen counter early in the morning pressing a bowl of filling through a sieve with a determined jaw, the window behind her pale with dawn, a kitchen clock showing six, cartons of eggs on the counter.") }),
  // ── 7 resbalan
  S(84, "", "bi", "b_sliding", { p: BI("Deviled eggs sliding around on a smooth glass plate with one tipped over, an old woman's hand rocking the plate and the eggs skating across it, a red checked cloth beneath, a few smeared yellow marks on the glass."), anim: "the plate rocks and the eggs slide" }),
  FIX(84, "If you really want", 7, "They slide", "A dab of filling under each egg. Like glue.", "img/lordeviled/b_sliding.jpg"),
  S(84, "That's a trick", "ei", "e_olddays", { p: EI("1959", "a young church lady in an apron putting a dab of filling from a spoon onto a glass plate before setting down a deviled egg half, a row of identical eggs already glued neatly in place along the plate, a church kitchen counter and a coffee urn behind her.") }),
  S(85, "", "av", ""),
  S(85, "And if something", "bi", "b_notebookclose", { p: BI("An old woman's hand closing the cover of a worn spiral recipe notebook on a floury kitchen table, a pencil and reading glasses on top, a plate of finished deviled eggs and a cup of tea beside it, warm daylight through the yellow checked curtain."), anim: "the cover closes slowly" }),
  // ── el cierre
  S(86, "", "lor", "l_promised", { p: LORP("She leans in toward the camera with a knowing look and a raised finger as if about to reveal a secret, a spiral recipe book with a faded index card tucked in its back pages on the floury table beside her.") }),
  S(86, "And I'll tell you why", "av", ""),
  S(87, "", "av", ""),
  S(87, "Because when you do it", "bi", "b_rushmorning", { p: BI("A frantic morning kitchen with an old woman at the counter hurrying, two pots steaming, a cutting board of torn eggs, a bowl of lumpy filling, a kitchen timer going and a church calendar on the wall, the wall clock showing a few minutes before ten, bright window light."), anim: "steam rises and the clock hand ticks" }),
  S(88, "", "bi", "b_thursday", { p: BI("A wall calendar of a church with the Thursday square circled in pencil hanging next to an old white refrigerator, an old woman's finger tapping the circled day, a bowl of boiled eggs in their shells on the counter beneath it."), anim: "the finger taps the circled day" }),
  S(88, "On Thursday", "c", "LorSchedule", { props: { title: "Mrs. Halvorsen's schedule", days: [{ day: "Thursday", sub: "two days before", items: ["boil 13 minutes", "ice bath 15", "chill in the shell"] }], perDay: 40 } }),
  S(88, "in the shell will keep", "av", ""),
  S(89, "", "bi", "b_friday", { p: BI("A kitchen table in the evening lamplight with a dozen peeled hard boiled eggs, a cutting board, a bowl of golden sieved yolks and a tray of white halves on paper towels, an old woman's hands working, the dark window with yellow curtains behind."), anim: "lamplight flickers on the eggs" }),
  S(89, "And then she kept", "bi", "b_apart", { p: BI("A refrigerator shelf holding a tray of egg white halves covered tight with plastic wrap on paper towels and beside it a zip-top bag of golden filling with the air pressed out, a note card taped to the shelf with no readable writing, a jug of milk."), anim: "the refrigerator light hums on the shelf" }),
  S(89, "And the filling in", "bi", "b_fillingbag", { p: BI("A zip-top bag of golden filling with the air pressed out lying flat next to a covered tray of egg whites on a refrigerator shelf, an old woman's hand pressing the bag flat, a jug of milk and a jar of pickles beside them, cool light from the open door."), anim: "the hand presses the air out of the bag" }),
  S(89, "Both in the refrigerator", "c", "LorSchedule", { props: { title: "Mrs. Halvorsen's schedule", days: [{ day: "Thursday", items: ["boil, ice, chill in the shell"] }, { day: "Friday", sub: "night before", items: ["peel and cut", "sieve the yolks", "whites and filling apart"] }], perDay: 40 } }),
  S(90, "", "av", ""),
  S(90, "And on Saturday", "c", "LorSchedule", { props: { title: "Mrs. Halvorsen's schedule", days: [{ day: "Thursday", items: ["boil, ice, chill in the shell"] }, { day: "Friday", items: ["peel, sieve, season"] }, { day: "Saturday", sub: "supper day", items: ["snip the bag, fill", "paprika", "ten minutes"], mark: true }], perDay: 40 } }),
  S(90, "And her eggs always", "ei", "e_halvdish", { p: EI("1969", "a proud stout church lady in a flowered apron and cat-eye glasses setting down a perfect glass dish of paprika-dusted deviled eggs on a long church supper table, the other ladies admiring it, a hand-lettered banner without legible words and a coffee urn behind them.") }),
  S(91, "", "lor", "l_honest", { p: LORP("She looks at the camera with a frank, honest expression, tapping two fingers on the floury table for emphasis, a plate of deviled eggs under plastic wrap beside her.") }),
  S(91, "If you fill them", "bi", "b_eatthatday", { p: BI("A plate of deviled eggs under plastic wrap on a church supper table at the end of the evening, a woman's hand sliding the last few eggs onto a small dish to take to the refrigerator, a calendar page showing the weekend in the background."), anim: "the hand covers the eggs with wrap" }),
  S(91, "I don't take chances", "av", ""),
  S(92, "", "lor", "l_fridgedoor2", { p: LORP("She stands at the open old white refrigerator door with her hand on it and glances back at the camera with a teasing smile, the shelves inside holding trays of eggs, jars and a pitcher of tea.") }),
  S(92, "Something I do", "bi", "b_leftoverplate", { p: BI("A plate of leftover deviled eggs and a sandwich made on soft white bread with chopped egg salad filling cut in half on a floury kitchen table, a cup of tea and a dish towel, an old woman's hand setting a knife down beside the sandwich, afternoon window light."), anim: "steam rises from the cup of tea" }),
  S(92, "I've written it down", "lor", "l_pointdown", { p: LORP("She points downward with one finger toward the bottom of the frame and nods firmly with a smile, as if indicating the description below, the floury table and the dish of deviled eggs beside her.") }),
  S(93, "", "av", ""),
  S(93, "Eggs a week", "c", "LorRecipeCard", { props: { title: "The whole thing, in one breath", kicker: "Church Basement Trick", lines: ["Eggs a week or two old", "Cold water, hard boil, lid on, heat off: 13 minutes", "Ice water: 15 minutes", "Peel under a little running water", "Dry the whites on paper towels", "Sieve the yolks", "Season first. Mayonnaise last.", "Never out more than two hours"], note: "sieve it · season it · mayonnaise last", bed: "img/lordeviled/b_setout.jpg", perLine: 52, start: 10 } }),
  S(93, "Sieve it, season it", "av", ""),
  S(94, "", "av", ""),
  S(94, "What did your", "vl", "v_close", { ov: { c: "LorAsk", props: { text: "What did YOUR church table bring?", sub: "tell me in the comments" } } }),
  S(94, "I read every", "av", ""),
  S(95, "", "lor", "l_pushcard2", { p: LORP("She slides a handwritten recipe card across the floury table toward the camera with a warm smile, eyes on her grandson, a cup of tea and the dish of deviled eggs beside her, afternoon light.") }),
  S(95, "do press that", "av", "", { ov: { c: "LorSubscribe", props: { sub: "so you don't miss the next one" } } }),
  S(95, "The tea's on me", "lor", "l_wave", { p: LORP("She gives a small friendly wave to the camera with a warm tired smile, a glass dish of finished deviled eggs and a cup of tea on the floury table in front of her, the yellow checked curtains glowing behind her.") }),
];
