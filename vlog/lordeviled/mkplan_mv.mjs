// Plan agnes 2.5-flash de los MOMENTOS VLOG de los pasos clave (Loretta HACIENDO el paso, hablando con su voz) + detalles con foley.
// node vlog/lordeviled/mkplan_mv.mjs   (los textos salen de _v3/lordeviled_m1.json: vlog/lordeviled/m1_tramos.mjs)
import fs from "node:fs";
import { R, WHO, KIT, A, act, plan } from "./lib.mjs";
const T = R + "vlog/lordeviled/tramos/";
const M = JSON.parse(fs.readFileSync(R + "_v3/lordeviled_m1.json", "utf8"));
const IN = "Same kitchen, same light, same moment of the day. ";
const anchors = [
  A("K11", ["k0"], `${IN}${WHO} stands at the white enamel stove of ${KIT}, a heavy aluminum pot of eggs on the burner in front of her, one hand resting on a pot lid, looking at the camera and talking. Medium shot from about one and a half meters, the stove, the yellow checked curtain and the rooster in frame.`),
  A("K12", ["K11"], "A few seconds later, same place: the lid is now on the pot and her other hand turns the dial of an old white wind-up kitchen timer on the counter beside the stove, her eyes on the timer, a satisfied little nod."),
  A("K21", ["k0"], `${IN}${WHO} sits at the floury wooden table of ${KIT}. In front of her a big metal bowl of ice water full of ice cubes, and she holds a slotted spoon with three white eggs above it, looking at the camera and talking. Medium shot from about one and a half meters.`),
  A("K22", ["K21"], "A few seconds later, same place: the eggs are lowered into the bowl of ice water with the slotted spoon, a small splash, she looks up at the camera with a calm, certain expression."),
  A("K31", ["k0"], `${IN}${WHO} stands at the white farmhouse sink of ${KIT} and holds a cooked egg cracked all over in her hands under a thin stream of running water from the faucet, looking at the camera and talking, a bowl of shells on the drain board.`),
  A("K32", ["K31"], "A few seconds later, same place: the egg in her fingers is now perfectly smooth and peeled, big pieces of shell lying in the sink, and she holds it up toward the camera with a mock-modest smile."),
  A("K41", ["k0"], `${IN}${WHO} sits at the floury wooden table of ${KIT}. A fine metal sieve is held over a glass bowl with golden cooked yolks in it, and she holds the back of a big spoon against the yolks, looking at the camera and talking. Medium shot from about one and a half meters.`),
  A("K42", ["K41"], "A few seconds later, same place: she presses the back of the spoon down into the sieve, fine golden yolk falling through into the bowl below, she looks down at it, pleased and delighted."),
  A("K51", ["k0"], `${IN}${WHO} sits at the floury wooden table of ${KIT}. In front of her a glass bowl of sieved golden yolks with a jar of yellow mustard, a jar of dill pickles and a tiny bowl of salt and sugar lined up beside it, and she holds a fork in the bowl, looking at the camera and talking.`),
  A("K52", ["K51"], "A few seconds later, same place: the yolks in the bowl are now a thick yellow paste and she lifts the fork from it, then looks up and out the window at the left with a patient, waiting expression."),
  A("K61", ["k0"], `${IN}${WHO} sits at the floury wooden table of ${KIT}. She levels a metal half-cup measure heaped with mayonnaise with the flat of a table knife held over the bowl of seasoned yolk paste, looking at the camera and talking.`),
  A("K62", ["K61"], "A few seconds later, same place: she folds a big spoonful of mayonnaise into the golden yolk paste in the glass bowl, looking down at the bowl with concentration, the empty measure beside it."),
  A("K71", ["k0"], `${IN}${WHO} sits at the floury wooden table of ${KIT}. In front of her a glass Pyrex dish of white egg halves, and she holds one spoon heaped with golden filling above the dish and a second spoon in her other hand, looking at the camera and talking.`),
  A("K72", ["K71"], "A few seconds later, same place: she pushes the golden filling off the first spoon into a white egg half with the second spoon, the egg now topped with a high rounded mound, a smile, a few filled eggs in the dish."),
  A("K81", ["k0"], `${IN}${WHO} sits at the floury wooden table of ${KIT}. In front of her a plain cardboard egg carton with its lid cut off and a glass dish of finished deviled eggs, and she holds the carton up slightly toward the camera, looking at it and talking.`),
  A("K82", ["K81"], "A few seconds later, same place: she sets one deviled egg half into one of the little cups of the carton, other halves already sitting in the cups, looking down at it with satisfaction."),
  A("K91", ["k0"], `${IN}${WHO} sits at the floury wooden table of ${KIT}, her hands folded on the table next to a dish of deviled eggs, leaning a little toward the camera with a warm, curious, inviting expression, mid-sentence.`),
  A("K92", ["K91"], "A few seconds later, same place: she tilts her head with a warm smile and opens both hands toward the camera as if asking a friend to answer, the dish of deviled eggs in front of her."),
  // detalles con foley (sólo sus manos de 81 años entrando por el borde)
  A("K1001", ["k0"], "Close view on the floury wooden table of her kitchen: a big metal bowl of ice water full of ice cubes and an old hand with age spots and a lilac cardigan sleeve holding a slotted spoon with three white hard-boiled eggs just above the water."),
  A("K1002", ["K1001"], "Same close view a moment later: the three white eggs have been lowered into the ice water, ice cubes shifting around them, water still rippling, the slotted spoon lifting away."),
  A("K1101", ["k0"], "Close view on the floury wooden table: a wooden cutting board with one peeled white hard-boiled egg and an old hand with a lilac sleeve holding a thin sharp knife with its blade just touching the top of the egg."),
  A("K1102", ["K1101"], "Same close view a moment later: the knife has cut the egg lengthwise and the two halves lie open side by side showing a perfect shiny golden yolk, the knife blade resting beside them."),
  A("K1201", ["k0"], "Close view on the floury wooden table: a zip-top bag of pale-yellow filling with a snipped corner held in old hands with age spots and a lilac sleeve just above a white egg half in a glass dish, a dozen empty white halves waiting beside it."),
  A("K1202", ["K1201"], "Same close view a moment later: a neat swirl of pale-yellow filling has been piped into the egg white half and the bag is lifting away leaving a small peak, the next white half waiting."),
  A("K1301", ["k0"], "Close view on the floury wooden table: an old hand with a lilac sleeve holds a small fine sieve of red paprika above a glass dish of filled deviled eggs, the tin of paprika open beside the dish."),
  A("K1302", ["K1301"], "Same close view a moment later: a fine even dusting of red paprika has fallen over the pale-yellow filling of the deviled eggs, a few red specks still falling from the sieve."),
];
const txt = (k) => M[k].text;
const V = (id, a, b, action) => ({ id, a, b, audio: T + id + ".wav", text: txt(id), action: act(action) });
const clips = [
  V("v_cook", "K11", "K12", "She talks to her grandson behind the camera while she puts the lid on the pot of eggs and turns the dial of the kitchen timer, matter-of-fact and sure of herself."),
  V("v_ice", "K21", "K22", "She talks to her grandson while she lowers the eggs into the bowl of ice water with the slotted spoon, calm and certain."),
  V("v_peel", "K31", "K32", "She talks to her grandson while she peels the egg under the running water and its shell slides off in big pieces, then holds the smooth egg up with a mock-modest smile."),
  V("v_sieve", "K41", "K42", "She talks to her grandson while she presses the yolks through the sieve with the back of the spoon and the fine yolk falls into the bowl below, delighted."),
  V("v_season", "K51", "K52", "She talks to her grandson while she stirs the seasoning into the yolks into a thick paste, then looks out of the window waiting patiently."),
  V("v_mayo", "K61", "K62", "She talks to her grandson while she levels the measure of mayonnaise and folds a big spoonful into the yolk paste, careful and unhurried."),
  V("v_fill", "K71", "K72", "She talks to her grandson while she pushes golden filling off one spoon into a white egg half with the second spoon, mounding it high, pleased."),
  V("v_carton", "K81", "K82", "She talks to her grandson while she holds up the cut egg carton and sets a deviled egg half into one of its little cups, satisfied."),
  V("v_close", "K91", "K92", "She leans toward the camera and asks her grandson's audience a warm question, then opens both hands inviting an answer with a smile."),
  { id: "d_ice", prompt: "the slotted spoon lowers three white eggs into the ice water and ice cubes shift. She stays silent, focused on her hands.", a: "K1001", b: "K1002", detail: true, secs: 8, d1: "a slotted spoon holds three white eggs above a bowl of ice water", d2: "the eggs sink into the ice water, ice cubes shifting", sound: "a splash of eggs into ice water and ice cubes clinking against a metal bowl" },
  { id: "d_cut", prompt: "the knife slices the peeled egg lengthwise and the halves open showing a golden yolk. She stays silent, focused on her hands.", a: "K1101", b: "K1102", detail: true, secs: 8, d1: "a thin knife touches the top of a peeled egg on a wooden board", d2: "the egg halves lie open showing a perfect golden yolk", sound: "the soft crisp slice of a knife through a cooked egg and the knife tapping the wooden board" },
  { id: "d_pipe", prompt: "the bag pipes a neat swirl of pale-yellow filling into the egg white half. She stays silent, focused on her hands.", a: "K1201", b: "K1202", detail: true, secs: 10, d1: "a bag of pale-yellow filling above a white egg half in a glass dish", d2: "a neat swirl of filling piped into the egg white half", sound: "the soft squeeze of a bag and filling piping out, a spoon tapping glass" },
  { id: "d_pap", prompt: "red paprika dusts evenly down through the small sieve over the deviled eggs. She stays silent, focused on her hands.", a: "K1301", b: "K1302", detail: true, secs: 7, d1: "a small sieve of red paprika above a dish of filled deviled eggs", d2: "a fine dusting of red paprika covers the filling", sound: "a soft dry tapping of a sieve and fine powder falling" },
];
fs.mkdirSync(R + "vlog/lordeviled/MV", { recursive: true });
fs.writeFileSync(R + "vlog/lordeviled/MV/plan.json", JSON.stringify(plan("vlog/lordeviled/MV", anchors, clips), null, 1));
console.log("plan MV:", anchors.length, "anclas,", clips.length, "clips");
