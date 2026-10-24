// sgardensquirrel · LÍNEA DE TIEMPO del mundo (segundos GLOBALES de la locución, anclados a palabras con at()).
// KEYS = la única cámara (sin cortes), armada sola desde CAM (frase → encuadre). ST(t) = el estado del jardín en ese instante.
import { at } from "./lib";
export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };
type V = [number, number, number];

// encuadres con nombre
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  wide: { p: [7.6, 3.6, 5.6], l: [1.4, 1.0, -1.4], fov: 50 },
  wideLow: { p: [6.2, 1.25, 3.05], l: [1.4, 1.2, -1.8], fov: 56 },
  high: { p: [3.2, 10.5, 6.2], l: [2.4, 0, -0.6], fov: 50 },
  tulips: { p: [3.2, 1.6, 2.8], l: [3.2, 0.1, 0.45], fov: 42 },
  tulipsLow: { p: [2.6, 0.62, 1.75], l: [3.3, 0.06, 0.45], fov: 38 },
  tulipsTop: { p: [3.25, 2.6, 1.1], l: [3.2, 0.05, 0.55], fov: 40 },
  fence: { p: [5.3, 1.35, 1.0], l: [6.6, 1.3, 3.3], fov: 40 },
  roof: { p: [4.4, 2.0, 0.2], l: [2.2, 2.9, -2.95], fov: 34 },
  roofWide: { p: [6.2, 2.2, 3.6], l: [0.8, 2.6, -3.2], fov: 46 },
  attic: { p: [4.6, 3.25, -4.35], l: [0.6, 2.95, -4.5], fov: 48 },
  atticNest: { p: [3.4, 3.15, -4.2], l: [1.2, 2.82, -4.65], fov: 40 },
  porch: { p: [1.3, 1.55, -0.45], l: [1.2, 0.98, -1.95], fov: 40 },
  table: { p: [1.22, 1.22, -1.22], l: [1.2, 1.0, -1.95], fov: 34 },
  tomato: { p: [4.1, 1.35, 1.0], l: [5.6, 0.8, -0.6], fov: 40 },
  tomatoClose: { p: [4.7, 1.0, 0.25], l: [5.6, 0.85, -0.6], fov: 34 },
  feeder: { p: [1.2, 1.85, 1.5], l: [2.6, 1.72, 3.2], fov: 38 },
  oak: { p: [4.4, 2.0, -1.4], l: [7.2, 3.0, 1.6], fov: 48 },
  branch: { p: [6.4, 4.4, -4.8], l: [3.4, 3.8, -1.6], fov: 46 },
  persimmon: { p: [0.2, 1.75, 3.05], l: [-3.0, 1.5, 0.6], fov: 50 },
  shed: { p: [-2.4, 1.5, 0.6], l: [-3.6, 1.2, -0.4], fov: 38 },
  dish: { p: [6.8, 0.85, 0.3], l: [8.0, 0.1, -1.6], fov: 38 },
  chimney: { p: [2.2, 5.4, -0.6], l: [-2.9, 4.6, -4.4], fov: 40 },
  side: { p: [5.0, 1.7, 2.4], l: [0.0, 2.4, -3.4], fov: 48 },
  step: { p: [3.0, 0.9, 0.6], l: [1.6, 0.4, -1.6], fov: 44 },
};
const K = (t: number, n: string, push = 0, arc?: number): Key => {
  const f = F[n]; const p = f.p.map((v, i) => v + (f.l[i] - v) * push);
  return { t, p, l: f.l, fov: f.fov - push * 6, arc };
};

// ---- anclas (frases del guion, en orden: cada una se busca DESPUÉS de la anterior) ----
const ORDER: [string, string][] = [
  ["dug", "somebody dug it with a spoon"], ["bite", "one bulb with a bite"], ["fence", "and on the fence"], ["night", "and that night"],
  ["scratch", "scratch scratch"], ["call", "so you call a man"], ["roofLook", "he looks up at the roof"], ["four", "four hundred dollars"],
  ["linda", "my neighbor linda paid"], ["never", "my mother never paid anybody"], ["three", "with three things from the pantry"],
  ["redChili", "red chili"], ["plainSoap", "plain dish soap"], ["pepp", "and peppermint"], ["sit", "come sit with me"], ["last", "the last thing i show you"],
  ["youKnow", "you know me"], ["s79", "i am 79"], ["y1970", "in 1970"], ["channel", "on this channel"], ["osakaHouse", "behind our little wooden house"],
  ["cta1", "before we start"], ["subscribe1", "press subscribe"], ["question1", "what did the squirrels take"], ["started", "how this all started"],
  ["risu", "the risu"], ["tanuki", "a tanuki"], ["rule", "my mother had one rule"], ["guest", "you do not fight the guest"],
  ["america", "then i came to america"], ["oakRental", "big oak tree in the back"], ["twelve", "twelve plants"], ["pink", "the day it turned pink"], ["cried", "i cried"],
  ["letter", "so i wrote a letter"], ["twoWeeks", "two weeks to cross the ocean"], ["tin", "in a tin box"], ["blue", "thin blue paper"], ["togarashi1", "togarashi the red chili"],
  ["hakka1", "the mint and at the bottom"], ["closeDoor1", "at the bottom she wrote"], ["understand", "i did not understand that last line"], ["knowGuest", "you have to know your guest"],
  ["busy", "it is a very busy animal"], ["thousands", "thousands of nuts"], ["softest", "the softest soil"], ["perfect", "you made it the perfect place"],
  ["atticSame", "and the attic is the same idea"], ["babiesK", "to have her babies"], ["insulation", "a soft pile of insulation"], ["hotel", "a hotel with no price"], ["calendar", "it is the calendar"],
  ["clock", "listen to the clock"], ["dayWork", "squirrels work in the day"], ["mice", "more likely mice or rats"], ["raccoon", "that is a raccoon"],
  ["signs", "then look for the signs"], ["golf1", "the size of a golf ball"], ["crumbs", "wood crumbs"], ["gardenSigns", "in the garden the signs"],
  ["notebook", "write down what you find"], ["dateSaw", "date what she saw"], ["earlier", "you are earlier"],
  ["rehook1", "so three things"], ["surprised", "surprised me most"], ["useless", "almost useless"],
  ["n1", "number one togarashi"], ["anyHot", "any hot red pepper"], ["strings", "she hung them on a string"], ["pestle", "wooden pestle"], ["cheapJar", "the big cheap jar of cayenne"],
  ["capsaicin", "is called capsaicin"], ["burns", "it burns"], ["noPoison1", "it does not poison it"], ["learns", "a squirrel learns quickly"],
  ["birds", "birds do not feel the heat"], ["sensors", "little sensors"], ["oneBite", "a squirrel takes one bite and runs"], ["scientists", "scientists have tested this"],
  ["recipe", "the recipe for the chili spray"], ["quart", "one quart of water"], ["twoTbsp", "2 tablespoons of red pepper flakes"], ["oneTbsp", "1 tablespoon of ground cayenne"],
  ["boil", "bring it to a boil"], ["simmer", "let it simmer"], ["fifteen", "for 15 minutes"], ["window", "open the window"],
  ["overnight", "covered overnight"], ["orange", "the water is orange-red"], ["strain", "now strain it"], ["filter", "a coffee filter in a funnel"], ["nozzle", "it blocks the nozzle"],
  ["sprayBottle", "pour the clear red water into a spray bottle"], ["soapIn", "and that is the soap"],
  ["careful", "please be careful with this"], ["gloves", "wear gloves"], ["eyes", "never your eyes"], ["wind", "with the wind behind you"], ["children", "away from children"],
  ["writeChili", "write chili on it"], ["husband", "my husband once used"], ["once", "he only did it once"],
  ["bulbsNow", "now the bulbs"], ["bag", "put your bulbs in a paper bag"], ["tbsp20", "for about 20 bulbs"], ["shake", "close the bag and shake it"], ["redDusty", "comes out red and dusty"],
  ["plant", "plant them the normal way"], ["badRest", "a bad restaurant"], ["line1", "a thin line"], ["rice", "salting a big plate of rice"], ["bamboo", "old bamboo blinds"],
  ["wire", "a piece of chicken wire"], ["stones", "a few stones on the corners"], ["spring1", "in the spring the tulips grow"], ["march1", "in march you can take the wire off"],
  ["feeder1", "then the bird feeder"], ["friends", "they bring their friends"], ["fourCups", "four cups of bird seed"], ["oil", "one tablespoon of plain vegetable oil"], ["shiny", "a little shiny"],
  ["twoCay", "then two tablespoons of cayenne"], ["stick", "the oil makes the chili stick"], ["cardinals", "the cardinals and the chickadees"], ["rubs", "rubs its face"], ["funny", "it is a little funny"],
  ["mistakeC", "the most common mistake with chili"], ["rains", "it rains"], ["gutter1", "it is in the gutter now"], ["nextRain", "until the next rain"], ["twoThree", "for about two or three weeks"],
  ["teach", "the first two weeks you teach"], ["second1", "and a second mistake"], ["tomPick", "that you will pick tomorrow"], ["leavesStems", "spray the leaves and the stems"], ["wash", "wash it well"], ["lesson", "the same lesson as the squirrel"],
  ["rehook2", "so that is the chili"], ["strange", "the strange one"], ["noCare", "a squirrel does not care about soap"], ["letterN2", "it was number two"],
  ["n2", "number two soap"], ["sink", "the one next to your sink"], ["noBleach", "no bleach"], ["laundry", "plain white laundry soap"], ["shaved", "she shaved little pieces"],
  ["secret", "here is the secret"], ["waterOil", "water and oil do not like each other"], ["heatOil", "lives in the oil of the pepper"], ["drops", "it makes little drops"], ["roll", "the drops roll off"],
  ["fewDrops", "a few drops of soap"], ["flat", "spread flat on the leaf"], ["glue", "it is like glue for the chili"], ["keeps", "the soap keeps the chili"],
  ["back", "back to our spray bottle"], ["tsp", "and one teaspoon of dish soap"], ["notMore", "one teaspoon not more"], ["bubbles", "a bottle full of bubbles"], ["upside", "upside down slowly"], ["realSpray", "now you have the real spray"],
  ["whyNot", "why not more soap"], ["burnLeaves", "it can burn them"], ["test", "and always test first"], ["oneLeaf", "spray one leaf"], ["plants", "tomatoes peppers sunflowers roses"], ["seedlings", "young seedlings"],
  ["when", "when do you spray"], ["morningEve", "in the morning or in the evening"], ["dryDay", "on a dry day"], ["rim", "the rim of the pots"], ["week", "one bottle lasts me about a week"], ["fridge", "in the refrigerator door"],
  ["pots", "the pots"], ["digPots", "squirrels love to dig in flower pots"], ["clay", "her clay pots with soapy water"], ["paste1", "a little chili paste on the rim"], ["licks", "it licks its hands"],
  ["mistakeS", "the mistake with soap"], ["squirt", "a big squirt of soap"], ["brown", "brown spots"], ["remember", "remember the teaspoon"], ["degreaser", "the strong degreaser kind"], ["cheapest", "the cheapest one is always the best"],
  ["cta2", "let me stop here for one second"], ["subscribe2", "please press subscribe so this channel"], ["question2", "here is my question for you today"], ["where2", "where do the squirrels go first"], ["nextTime", "next time i will make the video"],
  ["rehook3", "now number three the peppermint"], ["forAttic", "this is the one for the attic"], ["honest1", "very honest with you about it"], ["alone", "peppermint alone does not do the job"],
  ["n3", "number 3 hakka"], ["hokkaido", "from hokkaido"], ["drawer", "in the kitchen drawer"], ["handkerchief", "a drop on a handkerchief"], ["corners", "a few drops in the corners of the roof space"], ["nose", "a nose a hundred times better"], ["screams", "screams to them"],
  ["pharmacy", "in any pharmacy"], ["pure", "get the pure peppermint oil"], ["cottonBag", "a bag of cotton balls"],
  ["how", "here is how"], ["tenFifteen", "10 to 15 drops"], ["lid", "a little open jar lid"], ["place", "then place them in the attic"], ["fourFive", "four or five cotton balls"],
  ["important", "now the important part"], ["threeDays", "strong for about three days"], ["oneWeek", "after one week it is almost nothing"], ["change", "change the cotton balls every three or four days"], ["works3", "it works for three days"],
  ["honesty", "and here is my honesty"], ["mother", "a mother does not leave her babies"], ["notWall", "peppermint is not a wall"], ["message", "it is a message"], ["visiting", "that is just visiting"], ["rightTime", "has to be done at the right time"],
  ["cat", "if you have a cat"], ["sick", "can make cats sick"], ["onlyAttic", "keep the cotton balls only in the attic"], ["dogs", "for dogs"], ["mochi", "i have a cat mochi"],
  ["realMint", "also planted real mint"], ["potMint", "a pot of mint next to the door"], ["inPot", "plant mint in a pot"], ["allMint", "your whole garden is mint"], ["crushed", "crushed mint leaves on the soil"], ["wonderful", "it smells wonderful to you"],
  ["rehook4", "so chili soap and peppermint"], ["tenDollars", "maybe ten dollars"], ["together", "how my mother put them together"], ["fiveMist", "and then the five mistakes"],
  ["gardenS", "let us start with the garden"], ["fallPlan", "the plan for the fall is simple"], ["dusted", "bulbs dusted with cayenne"], ["wireTop", "chicken wire flat on top"], ["line2", "a thin line of chili on the soil"],
  ["daff", "daffodils"], ["bitter", "the bulb is bitter"], ["guards", "like a fence of guards"], ["garlic", "garlic and the onion family"], ["alliums", "alliums"], ["neighbor", "goes to the neighbor"], ["sorryLinda", "i am sorry linda"],
  ["summer", "then the summer the tomatoes"], ["rememberTom", "remember my 12 tomato plants"], ["thirsty", "it is thirsty"], ["glass", "it is a glass of water"], ["dish", "put a shallow dish of water"], ["everyDay", "change it every day"],
  ["pickEarly", "pick the tomatoes early"], ["blush", "the first blush of pink"], ["windowsill", "the kitchen windowsill"], ["persimmons", "picked the persimmons early too"], ["hoshigaki", "hoshigaki"], ["candy", "the best candy of my childhood"],
  ["third", "and third spray the chili"], ["threeTogether", "with these three together"], ["two", "i lost two tomatoes"], ["hundred", "out of maybe a hundred"],
  ["feederS", "for the bird feeder the chili seed"], ["eightFeet", "about eight feet"], ["pole", "hang the feeder on a metal pole"], ["tenFeet", "at least ten feet"], ["riceSacks", "the rice sacks in the shed"],
  ["roofS", "now the roof"], ["where400", "this is where"], ["slowly", "here i go slowly"], ["findDoor", "the first job is to find the door"], ["oneHole", "came in through one hole"],
  ["walk", "walk around your house in the morning"], ["lookUp", "and look up"], ["cornersR", "look at the corners of the roof"], ["vents", "the vents"], ["chimneyMeets", "where the chimney meets the roof"], ["branchTouches", "where a tree branch touches the house"],
  ["roundHole", "you are looking for a round hole"], ["chewed", "with chewed edges"], ["stain", "a dark stain around it"], ["watch", "sit and watch it in the morning"], ["goesIn", "if a squirrel goes in or comes out"], ["patient", "if you are patient"],
  ["beforeClose", "before you close anything"], ["babiesQ", "are there babies inside"], ["twoTimes", "two times a year"], ["febMar", "around february and march"], ["augSep", "around august and september"],
  ["chewNew", "the mother will chew a new hole"], ["repairBill", "a real repair bill"], ["babiesStay", "or the babies stay inside"],
  ["squeaks", "little high squeaks"], ["wait", "then you wait"], ["tenTwelve", "10 to 12 weeks"], ["mintNest", "near the nest but not on it"], ["radio", "leave a small radio"], ["voices", "do not like people voices"], ["carry", "carry her babies out"],
  ["doorS", "and now the door"], ["lastLine", "my mother's last line"], ["sure", "when you are sure no babies are inside"], ["oneway", "a one-way door"], ["tube", "a small tube of wire mesh"], ["pushOut", "the squirrel can push out"],
  ["hardware1", "at the hardware store"], ["twoThreeDays", "leave it two or three days"],
  ["forGood", "then you close it for good"], ["foam", "a squirrel chews foam like candy"], ["hcloth", "you use hardware cloth"], ["halfInch", "half an inch"], ["twoInches", "at least two inches bigger"], ["screws", "with screws and washers"], ["pretty", "if you want it pretty"],
  ["touch", "my mother's touch"], ["paste", "a little chili paste around the edges"], ["vaseline", "petroleum jelly"], ["fire", "a mouthful of fire"], ["hollow", "a hollow tree"],
  ["bridge", "then cut the bridge"], ["fromTree", "from a tree branch"], ["eight", "closer than 8 feet"], ["cutBack", "cut it back"], ["ladder", "never climb a ladder alone"], ["wrist", "broke her wrist"], ["help", "ask for help"],
  ["otherDoors", "check the other doors"], ["cap", "put a cap with a mesh on the chimney"], ["ventsC", "check the vents"], ["gaps", "the gaps where the gutter meets the roof"], ["thumb", "bigger than your thumb"], ["yours", "the attic is yours again"],
  ["rehook5", "now five mistakes"], ["fourthL", "the fourth one is the one"],
  ["m1", "mistake number one"], ["patientM", "you must be more patient"], ["allDay", "a squirrel has all day"],
  ["m2", "mistake number two"], ["catFood", "a bowl of cat food on the porch"], ["fallen", "fallen bird seed"], ["compost", "a compost pile"], ["apples", "fallen fruit on the grass"], ["dinner", "take away the dinner"],
  ["m3", "mistake number 3"], ["notFault", "it is not your fault"],
  ["m4", "mistake number four"], ["lindaM", "this is linda's mistake"], ["march", "she heard the noise in march"], ["board", "nailed a board on the hole"], ["babiesIn", "there were babies inside"], ["soffit", "right through the soffit"],
  ["crying", "the babies were crying in the wall"], ["openWall", "he had to open the wall"], ["four2", "and fix the"], ["sixWeeks", "if she had waited six weeks"],
  ["m5", "mistake number five"], ["oakBranch", "if the oak branch still touches"], ["basket", "a house is like a basket"],
  ["neverDid", "what my mother never did"], ["poison", "she never used poison"], ["smell", "the smell lasts for weeks"], ["hawk", "eaten by a hawk"], ["owl", "the owl is the best worker"],
  ["trapped", "she never trapped an animal"], ["allowed", "it is not even allowed"], ["survive", "usually does not survive"], ["village", "to the next village"],
  ["commentsS", "some of you asked me questions"], ["margaret", "margaret asked"], ["sneeze", "it will sneeze"], ["robert", "robert asked"], ["chickadeesC", "the chickadees eat my red seed"], ["susan", "and susan asked"], ["lessWeek", "in less than a week"],
  ["year", "now let me give you my whole year"], ["picture", "take a picture of the screen"], ["fall", "in the fall september to november"], ["winter", "in winter december to february"], ["listen", "listen to the ceiling"],
  ["bestTime", "this is the best time to close the door"], ["spring", "in spring march to may"], ["summerS", "in summer june to august"], ["endAug", "at the end of august"], ["septAgain", "the year starts again"], ["fourJobs", "four seasons four small jobs"], ["noMan", "no man no truck"],
  ["list", "let me say the list slowly"], ["forSpray", "for the chili spray"], ["forBulbs", "for the bulbs"], ["forSeed", "for the bird seed"], ["forAttic2", "for the attic"], ["forDoor", "for closing the door"], ["everything", "that is everything"],
  ["final", "and now the last thing"], ["nobody", "the one almost nobody does"], ["closeLast", "close the door last"], ["older", "when i was older"],
  ["first", "everybody wants to close the door first"], ["lock", "you lock the problem inside your house"], ["uncomfortable", "first you make the house uncomfortable"], ["letGuest", "then you let the guest leave"], ["empty", "when the house is empty"], ["neverFight", "never have to fight again"],
  ["stepNobody", "that is the step nobody does"], ["comesBack", "comes back at the end of winter"], ["december", "every year in december"], ["tenMin", "ten minutes"], ["everyClosed", "they find every door closed"], ["oakBack", "back to the oak tree"],
  ["recap", "so one more time very fast"], ["rChili", "red chili to teach"], ["rSoap", "dish soap one teaspoon"], ["rMint", "and peppermint changed"], ["rDaff", "daffodils and onions"], ["rWater", "water dish and early tomatoes"], ["rNo", "no poison no traps"], ["rClose", "the door last after the guest"],
  ["close", "my mother never saw an american squirrel"], ["ninetyOne", "was 91"], ["laughed", "she laughed so much"], ["openDoor", "the open door is the problem"], ["stillLetter", "i still have her letter"], ["threeWords", "three words in one line"],
  ["subscribe3", "if this helped you"], ["where3", "where do your squirrels go first"], ["teaTomorrow", "with my tea tomorrow morning"], ["thanks", "thank you for sitting with me"], ["closeLast2", "and close the door last"],
];
export const A: Record<string, number> = {};
{ let prev = 0; for (const [k, ph] of ORDER) { prev = at(ph, prev); A[k] = prev; } }
export const END_T = A.closeLast2 + 4.5;

// ---- la cámara: en cada frase va a un encuadre (viaje de 1,5 s que arranca con la palabra) y se acerca despacio hasta el siguiente ----
const CAM: [string, string][] = [
  ["dug", "tulipsLow"], ["fence", "fence"], ["night", "attic"], ["call", "roofWide"], ["four", "roof"], ["never", "wide"], ["three", "porch"], ["sit", "wideLow"],
  ["channel", "wide"], ["osakaHouse", "persimmon"], ["cta1", "porch"], ["started", "wide"],
  ["tanuki", "persimmon"], ["guest", "wideLow"], ["oakRental", "oak"], ["twelve", "tomato"], ["pink", "tomatoClose"], ["letter", "porch"], ["togarashi1", "table"], ["closeDoor1", "roof"],
  ["knowGuest", "wide"], ["softest", "tulipsTop"], ["atticSame", "attic"], ["insulation", "atticNest"], ["clock", "roofWide"], ["signs", "roof"], ["crumbs", "side"], ["gardenSigns", "tulips"], ["notebook", "step"],
  ["rehook1", "porch"], ["n1", "table"], ["strings", "shed"], ["cheapJar", "table"], ["capsaicin", "fence"], ["birds", "feeder"], ["scientists", "feeder"],
  ["recipe", "table"], ["sprayBottle", "table"], ["careful", "porch"], ["bulbsNow", "tulips"], ["plant", "tulipsLow"], ["line1", "tulipsTop"], ["wire", "tulips"], ["spring1", "tulipsLow"],
  ["feeder1", "feeder"], ["rubs", "fence"], ["mistakeC", "tulips"], ["second1", "tomato"],
  ["rehook2", "porch"], ["n2", "table"], ["secret", "tomatoClose"], ["back", "table"], ["test", "tomatoClose"], ["when", "tomato"], ["fridge", "porch"], ["pots", "porch"], ["mistakeS", "tomatoClose"],
  ["cta2", "wide"], ["rehook3", "roofWide"], ["n3", "table"], ["corners", "attic"], ["pharmacy", "table"], ["place", "atticNest"], ["important", "attic"], ["honesty", "atticNest"],
  ["cat", "porch"], ["realMint", "porch"], ["crushed", "tulipsTop"],
  ["rehook4", "high"], ["gardenS", "tulips"], ["daff", "tulipsTop"], ["alliums", "tulipsLow"], ["summer", "tomato"], ["dish", "dish"], ["pickEarly", "tomatoClose"], ["persimmons", "persimmon"], ["third", "tomato"],
  ["feederS", "feeder"], ["pole", "feeder"], ["riceSacks", "shed"],
  ["roofS", "roofWide"], ["walk", "side"], ["chimneyMeets", "chimney"], ["branchTouches", "branch"], ["roundHole", "roof"], ["watch", "step"],
  ["babiesQ", "atticNest"], ["chewNew", "roof"], ["squeaks", "atticNest"], ["radio", "attic"], ["carry", "roof"],
  ["doorS", "roof"], ["forGood", "roof"], ["touch", "roof"], ["hollow", "oak"], ["bridge", "branch"], ["ladder", "side"], ["otherDoors", "chimney"], ["ventsC", "roofWide"], ["yours", "attic"],
  ["rehook5", "wide"], ["m1", "tulips"], ["m2", "porch"], ["compost", "wideLow"], ["m3", "tomatoClose"], ["m4", "roof"], ["babiesIn", "atticNest"], ["soffit", "roof"], ["m5", "branch"], ["basket", "roofWide"],
  ["neverDid", "wide"], ["owl", "oak"], ["trapped", "wideLow"],
  ["commentsS", "porch"], ["margaret", "tulips"], ["robert", "feeder"], ["susan", "attic"],
  ["year", "high"], ["fall", "tulips"], ["winter", "roofWide"], ["spring", "tulipsLow"], ["summerS", "tomato"], ["septAgain", "high"],
  ["list", "table"], ["forBulbs", "tulipsTop"], ["forSeed", "feeder"], ["forAttic2", "atticNest"], ["forDoor", "roof"],
  ["final", "roof"], ["uncomfortable", "atticNest"], ["empty", "attic"], ["neverFight", "roof"], ["december", "side"], ["everyClosed", "roofWide"], ["oakBack", "oak"],
  ["recap", "porch"], ["rDaff", "tulips"], ["rWater", "tomato"], ["rClose", "roof"], ["close", "persimmon"], ["openDoor", "roof"], ["stillLetter", "porch"], ["subscribe3", "wide"], ["thanks", "wideLow"],
];
export const KEYS: Key[] = (() => {
  const k: Key[] = [K(0, "tulips")];
  let prevF = "tulips", prevT = 0;
  for (const [a, f] of CAM) {
    const t = A[a]; if (t === undefined) throw new Error("CAM sin ancla " + a);
    const t0 = Math.max(prevT + 0.5, t - 0.2);
    k.push(K(t0, prevF, Math.min(0.14, (t0 - prevT) * 0.012)));
    k.push(K(t0 + 1.5, f, 0, f === "high" || prevF === "high" ? 0.08 : 0));
    prevF = f; prevT = t0 + 1.5;
  }
  k.push(K(END_T + 30, prevF, 0.1));
  return k;
})();

const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
/** sube de 0 a 1 entre a y b */
export const up = (t: number, a: number, b: number) => sm((t - a) / (b - a));
/** 1 entre a y b (con rampas de r segundos) */
export const win = (t: number, a: number, b: number, r = 0.4) => up(t, a - r, a) * (1 - up(t, b, b + r));

// ---- la ardilla: estaciones (frase → lugar, giro, pose). Entre una y otra corre 1,4 s. pose 0 sentada · 1 cava · 2 corre · 3 se frota la cara ----
type Sq = { p: V; rot: number; pose: number; on: number; cheek: number };
const SQ0: [string, V, number, number][] = [
  ["dug", [3.6, 0.09, 0.7], -1.2, 1], ["fence", [6.6, 1.43, 3.4], 2.6, 0], ["night", [1.6, 2.78, -4.3], 1.6, 2], ["never", [7.0, 0.0, 2.2], 2.0, 0],
  ["softest", [3.0, 0.09, 0.4], -0.6, 1], ["atticSame", [2.0, 2.78, -3.9], 1.4, 0], ["signs", [2.25, 2.96, -2.86], 0, 0], ["gardenSigns", [3.4, 0.09, 0.8], -1.0, 1],
  ["capsaicin", [6.6, 1.43, 3.4], 2.6, 3], ["birds", [3.0, 0.0, 2.8], 2.2, 0], ["badRest", [3.9, 0.09, 0.3], -1.6, 3], ["spring1", [6.6, 1.43, 3.4], 2.6, 0],
  ["fourCups", [2.2, 0.0, 3.0], 1.4, 0], ["rubs", [6.6, 1.43, 3.4], 2.6, 3], ["second1", [4.9, 0.0, 0.2], -0.8, 0],
  ["secret", [7.2, 0.0, 1.6], 2.0, 0], ["licks", [1.9, 0.33, -1.5], 1.2, 3], ["corners", [1.6, 2.78, -4.1], 1.4, 0], ["visiting", [2.25, 2.96, -2.86], 0, 0],
  ["crushed", [3.8, 0.09, 0.2], -1.4, 1], ["neighbor", [9.0, 0.0, 2.0], 0.4, 2], ["summer", [5.0, 0.38, -0.3], -0.6, 0], ["glass", [5.0, 0.38, -0.3], -0.6, 1], ["dish", [7.8, 0.0, -1.3], -2.2, 0],
  ["pole", [2.6, 0.0, 2.9], 1.2, 0], ["roofS", [3.4, 3.62, -2.0], 2.4, 0], ["goesIn", [2.25, 2.96, -2.86], 0, 0], ["squeaks", [1.4, 2.8, -4.4], 1.4, 0],
  ["pushOut", [2.25, 2.96, -2.7], 3.1, 0], ["fire", [2.35, 2.96, -2.8], 3.1, 3], ["hollow", [7.4, 2.2, 1.4], 2.4, 0], ["bridge", [4.6, 3.7, -0.6], 2.6, 2],
  ["m2", [1.9, 0.33, -1.2], 1.2, 0], ["m4", [2.25, 2.96, -2.8], 3.1, 0], ["neverDid", [7.0, 0.0, 2.2], 2.0, 0], ["margaret", [6.6, 1.43, 3.4], 2.6, 0],
  ["fall", [3.4, 0.09, 0.8], -1.0, 1], ["winter", [2.25, 2.96, -2.86], 0, 0], ["summerS", [5.0, 0.38, -0.3], -0.6, 0],
  ["everyClosed", [2.45, 2.96, -2.7], 3.1, 0], ["oakBack", [7.4, 2.2, 1.4], 2.4, 0], ["recap", [6.6, 1.43, 3.4], 2.6, 0],
];
// la segunda ardilla ("traen a sus amigos") en el comedero y la mamá con los bebés
const SQ1: [string, V, number, number, number][] = [
  ["friends", [2.4, 0.0, 3.6], 1.0, 0, 1], ["cardinals", [2.4, 0.0, 3.6], 1.0, 3, 1], ["mistakeC", [2.4, 0.0, 3.6], 1.0, 0, 0],
  ["carry", [2.25, 2.96, -2.8], 3.1, 2, 1], ["doorS", [2.25, 2.96, -2.8], 3.1, 0, 0],
];
const sqAt = (t: number): Sq => {
  let i = -1; for (let j = 0; j < SQ0.length; j++) if (A[SQ0[j][0]] <= t) i = j;
  if (i < 0) return { p: SQ0[0][1], rot: SQ0[0][2], pose: SQ0[0][3], on: 0, cheek: 0 };
  const [k, p, r, pose] = SQ0[i]; const t0 = A[k];
  if (i > 0 && t < t0 + 1.4) { const [, pp, pr] = SQ0[i - 1]; const u = sm((t - t0) / 1.4);
    return { p: [pp[0] + (p[0] - pp[0]) * u, pp[1] + (p[1] - pp[1]) * u, pp[2] + (p[2] - pp[2]) * u], rot: pr + (r - pr) * u, pose: 2, on: 1, cheek: 0 }; }
  return { p, rot: r, pose, on: 1, cheek: pose === 3 ? 1 : 0 };
};
const sq1At = (t: number): Sq => {
  let i = -1; for (let j = 0; j < SQ1.length; j++) if (A[SQ1[j][0]] <= t) i = j;
  if (i < 0) return { p: [0, 0, 0], rot: 0, pose: 0, on: 0, cheek: 0 };
  const [k, p, r, pose, on] = SQ1[i]; const t0 = A[k];
  return { p, rot: r, pose, on: on ? up(t, t0, t0 + 0.4) : 1 - up(t, t0, t0 + 0.4), cheek: pose === 3 ? 1 : 0 };
};

export type Estado = {
  season: number; frost: number; dawn: number; shade: number; attic: number; hole: number; cap: number; nest: number; babies: number;
  cotton: number; mintAir: number; radio: number; items: number[]; spray: number; holes: number; bulbs: number; red: number; line: number; wire: number;
  bloom: number; daff: number; allium: number; mintCrush: number; tom: number; ripe: number; dish: number; branchCut: number; feedRed: number; birds: number; sq: Sq[];
};

// tramos con piezas grandes encima: el mundo se oscurece un poco
let SHADE: [number, number][] = [];
export const setShade = (w: [number, number][]) => { SHADE = w; };

export const ST = (t: number): Estado => {
  // estación: otoño salvo los tramos de primavera/verano/invierno
  const season = t < A.spring1 ? 0 : t < A.march1 + 3 ? 2.5 : t < A.summer ? 0 : t < A.feederS ? 3.5 : t < A.winter ? 0 : t < A.spring ? 1.5 : t < A.summerS ? 2.5 : t < A.septAgain ? 3.5 : 0;
  const bloomW = win(t, A.spring1, A.march1 + 3, 0.8) + win(t, A.spring, A.summerS, 0.8);
  return {
    season,
    frost: win(t, A.winter, A.spring, 1) + win(t, A.december, A.tenMin + 2, 1),
    dawn: win(t, A.clock, A.signs, 1) + win(t, A.walk, A.roundHole, 1) + win(t, A.watch, A.beforeClose, 1),
    shade: Math.min(1, SHADE.reduce((m, [a, b]) => m + win(t, a, b, 0.6), 0)),
    attic: win(t, A.night, A.call, 0.5) + win(t, A.atticSame, A.clock, 0.5) + win(t, A.corners, A.pharmacy, 0.5) + win(t, A.place, A.cat, 0.5) + win(t, A.squeaks, A.carry, 0.5),
    // el agujero: 0 abierto · 1 puerta de un solo sentido · 2 malla · 3 tapado y pintado (y vuelve a abrirse en los errores de Linda)
    hole: t < A.oneway ? 0 : t < A.hcloth ? 1 : t < A.pretty ? 2 : t < A.board ? 3 : t < A.m5 ? 0 : t < A.forDoor ? 3 : t < A.oneway + 1e6 ? 3 : 3,
    cap: up(t, A.cap, A.cap + 1.2),
    nest: up(t, A.insulation, A.insulation + 1),
    babies: win(t, A.babiesQ, A.carry + 2, 0.5) + win(t, A.babiesIn, A.openWall, 0.5),
    cotton: up(t, A.place, A.place + 2.5) * (1 - up(t, A.cat, A.cat + 1)) + win(t, A.mintNest, A.carry, 0.6) + win(t, A.forAttic2, A.forDoor, 0.6),
    mintAir: win(t, A.threeDays, A.oneWeek, 0.8),
    radio: win(t, A.radio, A.carry + 3, 0.5),
    items: [up(t, A.redChili, A.redChili + 0.6), up(t, A.plainSoap, A.plainSoap + 0.6), up(t, A.pepp, A.pepp + 0.6)],
    spray: up(t, A.sprayBottle, A.sprayBottle + 0.8),
    holes: up(t, A.dug - 1.5, A.dug + 1.5) * (1 - up(t, A.bag, A.bag + 1)) + win(t, A.gardenSigns, A.notebook, 0.6) + win(t, A.mistakeC, A.second1, 0.6) * 0.5,
    bulbs: win(t, A.bag, A.plant + 1.5, 0.6),
    red: up(t, A.redDusty, A.redDusty + 0.8),
    line: up(t, A.line1, A.line1 + 1.5) * (1 - up(t, A.rains, A.rains + 1.2)) + win(t, A.line2, A.daff, 0.6) + win(t, A.fall, A.winter, 0.6),
    wire: up(t, A.wire, A.wire + 1) * (1 - up(t, A.march1 + 2, A.march1 + 3)) + win(t, A.wireTop, A.summer, 0.6) + win(t, A.fall, A.winter, 0.6),
    bloom: bloomW,
    daff: up(t, A.daff, A.daff + 1.2) * (1 - up(t, A.summer, A.summer + 1)) + win(t, A.spring, A.summerS, 0.8) + win(t, A.rDaff, A.rWater, 0.6),
    allium: up(t, A.alliums, A.alliums + 1.2) * (1 - up(t, A.summer, A.summer + 1)) + win(t, A.spring, A.summerS, 0.8) + win(t, A.rDaff, A.rWater, 0.6),
    mintCrush: win(t, A.crushed, A.rehook4, 0.6),
    tom: 1,
    ripe: win(t, A.pink, A.letter, 0.5) + win(t, A.blush, A.persimmons, 0.5) * 0.5 + win(t, A.summerS, A.septAgain, 0.8) * 0.4,
    dish: up(t, A.dish, A.dish + 0.8),
    branchCut: up(t, A.cutBack, A.cutBack + 1.5) * (1 - up(t, A.oakBranch, A.oakBranch + 0.4)) + up(t, A.basket, A.basket + 1),
    feedRed: up(t, A.twoCay, A.twoCay + 1),
    birds: win(t, A.birds, A.recipe, 0.5) + win(t, A.cardinals, A.mistakeC, 0.5) + win(t, A.chickadeesC, A.susan, 0.5),
    sq: [sqAt(t), sq1At(t)],
  };
};
