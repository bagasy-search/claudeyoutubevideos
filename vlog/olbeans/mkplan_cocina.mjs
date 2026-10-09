// Plan agnes 2.5-flash del resto del video (hablados m6-m9 + detalles de manos con foley). node vlog/olbeans/mkplan_cocina.mjs
import fs from "node:fs";
import { R, WHO, KIT, A, act, plan } from "./lib.mjs";
const T = R + "vlog/olbeans/tramos/";
const POT = "a big black cast iron Dutch oven";
const HANDS = "an old man's weathered hands with age spots, his dark green plaid flannel sleeve rolled to the forearm";
const OUT = "outside behind the log cook shack of an old north-woods logging camp in winter: deep snow, a mound of fresh dirt, pine woods behind, grey early morning light";
const anchors = [
  A("C0", ["k0"], `Same cabin, same light. ${WHO} stands at the black wood cookstove of ${KIT}, ${POT} open and gently steaming in front of him, and he lifts a wooden spoon with a few cooked pinto beans out of it, looking at the camera, talking. Medium shot, the stove and his upper body in frame.`),
  A("C1", ["C0"], "A few seconds later, same place: he holds the wooden spoon close to his face with one single bean on it and blows on it, lips pursed, eyes on the bean, steam curling."),
  A("C2", ["C1"], "Same place a few seconds later: he pinches the single cooked bean between thumb and finger right in front of the camera, the skin curling back and peeling, eyebrows raised, looking at the camera."),
  A("C3", ["C2"], "Same place: he chews with his mouth closed, nodding slowly and satisfied, the wooden spoon back in the pot, one hand on the stove rail."),
  A("C4", ["k0"], `Same cabin, same light. ${WHO} at the black wood cookstove of ${KIT} lifts a halved cooked onion out of ${POT} with a slotted spoon, a bay leaf stuck to it, steam rising, glancing at the camera while talking.`),
  A("C5", ["C4"], "Same place a few seconds later: he pours a little cider vinegar from a small plain glass bottle into a tablespoon held over the pot, concentrating, the onion now on a tin plate beside the stove."),
  A("C6", ["k0"], `${WHO} stands ${OUT}, leaning on a long-handled shovel stuck in the snow next to the dirt mound, grinning at the camera, his breath steaming in the cold. Medium shot, the cook shack wall and a stovepipe with smoke behind him.`),
  A("C7", ["C6"], "A few seconds later, same place: he points down at the dirt mound with his free hand, eyebrows raised with a mischievous grin, still holding the shovel."),
  A("C8", ["k0"], `Same cabin, same light. ${WHO} sits at the rough plank table by the snowy window of ${KIT}, a blue enamel mug of coffee in his hand, a pot of beans and a tin plate on the table, talking warmly to the camera.`),
  A("C9", ["C8"], "Same place a few seconds later: he raises the blue enamel mug toward the camera like a small toast, with a warm wink and a smile."),
  A("E1a", ["k0"], `Close view on the rough plank table of the cabin: dry pinto beans spread out on an old tin pie plate, and ${HANDS} sort through them, pushing a few small stones and shriveled broken beans to one side with a finger.`),
  A("E1b", ["E1a"], "Same close view a few seconds later: a little pile of pebbles, a dirt clod and broken beans sits apart at the rim of the plate, the good beans spread clean."),
  A("E2a", ["k0"], `Close view straight into ${POT} on the wood cookstove at a hard rolling boil, pinto beans tumbling, grayish foam gathering on the surface, and ${HANDS} bringing a big metal spoon toward the foam.`),
  A("E2b", ["E2a"], "Same close view a few seconds later: the spoon lifts a scoop of gray foam off the boiling beans, the surface much clearer."),
  A("E3a", ["k0"], `Close view of ${POT} on the wood cookstove at a very gentle simmer, one lazy bubble, and ${HANDS} holding the heavy lid by its handle with a folded rag just above the pot.`),
  A("E3b", ["E3a"], "Same close view a few seconds later: the lid now sits on the pot a little crooked, leaving a thin gap at one side, and a thin wisp of steam escapes from the crack."),
  A("E4a", ["k0"], `Close view of ${POT} of pinto beans on the wood cookstove with the broth level low, the beans peeking out, and ${HANDS} tilting a dented white enamel kettle to pour steaming hot water into it.`),
  A("E4b", ["E4a"], "Same close view a few seconds later: the broth level is higher and covers the beans again, the kettle lifting away."),
  A("E5a", ["k0"], `Close view of ${POT} with cold water and dry pinto beans on the wood cookstove, and ${HANDS} holding a small pinch of white baking soda between thumb and finger right above the water.`),
  A("E5b", ["E5a"], "Same close view a few seconds later: the pinch of baking soda has dropped into the water and tiny fizzy bubbles rise where it fell."),
  A("E6a", ["k0"], `Close view on the plank table: a wedge of golden skillet cornbread in a blue enamel bowl, and ${HANDS} holding a ladle of cloudy, savory bean broth right above it, steam.`),
  A("E6b", ["E6a"], "Same close view a few seconds later: the broth has been poured and the cornbread is soaked dark and glistening, a little pool of pot liquor around it."),
  A("E7a", ["k0"], `Close view looking into an empty big black cast iron bean pot on the plank table, and ${HANDS} dropping thick chunks of salt pork onto its bottom.`),
  A("E7b", ["E7a"], "Same close view a few seconds later: half-cooked pinto beans are being ladled over the salt pork, filling the pot halfway."),
  A("E8a", ["k0"], `Close view ${OUT}: at the bottom of a dug-open dirt pit the dirty lid and wire bail of a black cast iron bean pot show, and a long iron hook held by ${HANDS} catches the bail.`),
  A("E8b", ["E8a"], "Same close view a few seconds later: the heavy iron pot is lifted up out of the pit on the hook, dirt falling off it, a thick cloud of steam rising into the cold air."),
  A("E9a", ["k0"], `Close view ${OUT}: the heavy black cast iron bean pot sits on the trampled snow, its lid still crusted with a dry flour paste seal and dirt, and ${HANDS} with a rag gripping the lid handle.`),
  A("E9b", ["E9a"], "Same close view a few seconds later: the lid is lifted off and a burst of steam reveals deep mahogany brown baked beans, every bean whole, glossy with molasses, a chunk of salt pork on top."),
];
const D = (id, a, b, prompt, d1, d2, sound) => ({ id, prompt: prompt + ". He stays silent, focused on his hands.", a, b, detail: true, secs: 4, d1, d2, sound });
const clips = [
  { id: "m6a", a: "C0", b: "C1", audio: T + "m6a.wav", text: "Now I'll tell you how you know when it's done. Take one bean out on a spoon and blow on it.", action: act("He lifts the spoon of beans from the pot talking to the camera, then brings it close and blows on one bean.") },
  { id: "m6b", a: "C2", b: "C3", audio: T + "m6b.wav", text: "If the skin curls back and peels, you're close. Then squeeze it against the roof of your mouth with your tongue.", action: act("He pinches the bean showing the peeling skin to the camera, then pops it in his mouth and nods, chewing.") },
  { id: "m7", a: "C4", b: "C5", audio: T + "m7.wav", text: "So, once they're tender, fish out the onion and the bay leaf, stir in a tablespoon or two of cider vinegar, and taste it for salt.", action: act("He lifts the onion out of the pot with a slotted spoon talking, then pours a little vinegar into a tablespoon over the pot.") },
  { id: "m8", a: "C6", b: "C7", audio: T + "m8.wav", text: "Alright. The hole in the ground. Bean-hole beans.", action: act("Outside in the snow he leans on the shovel grinning at the camera, then points at the dirt mound.") },
  { id: "m9", a: "C8", b: "C9", audio: T + "m9.wav", text: "And where are you cooking from tonight? I read every one of 'em. Now go put a pot on.", action: act("Sitting at the table with his enamel mug he asks the camera warmly, then raises the mug in a small toast and winks.") },
  D("d_sort", "E1a", "E1b", "his fingers push the small stones and broken beans aside on the tin plate", "fingers sort dry beans on a tin plate", "stones set aside", "dry beans rattling and sliding on a tin plate"),
  D("d_skim", "E2a", "E2b", "the spoon skims the gray foam off the boiling beans", "foam on a pot of boiling beans", "a spoon lifts the foam off", "a pot boiling hard and a metal spoon scraping the rim"),
  D("d_lid", "E3a", "E3b", "he sets the heavy lid on the pot a little crooked and a wisp of steam escapes from the gap", "a lid held above a simmering pot", "the lid sits crooked with steam escaping", "a heavy iron lid clanking onto a pot and a soft simmer"),
  D("d_kettle", "E4a", "E4b", "he pours hot water from the enamel kettle into the pot until the beans are covered", "a kettle pours hot water into a pot of beans", "the beans are covered again", "hot water pouring into a pot"),
  D("d_soda", "E5a", "E5b", "he drops the pinch of baking soda into the water and tiny bubbles fizz up", "a pinch of baking soda above the water", "it fizzes in the water", "a faint fizz in water"),
  D("d_liquor", "E6a", "E6b", "he pours the ladle of bean broth over the cornbread until it soaks", "a ladle of broth above cornbread", "the cornbread is soaked with broth", "broth pouring and soaking into bread"),
  D("d_layer", "E7a", "E7b", "he drops salt pork into the empty iron pot and then ladles beans over it", "salt pork dropped into an iron pot", "beans ladled over the pork", "salt pork thudding into an iron pot and beans pouring"),
  D("d_liftpot", "E8a", "E8b", "the hook lifts the heavy iron pot up out of the dirt pit in a cloud of steam", "a hook catches a pot buried in a pit", "the pot rises out of the pit steaming", "dirt falling and a heavy iron pot creaking on a hook"),
  D("d_lidoff", "E9a", "E9b", "he lifts the sealed lid off the iron pot and steam reveals glossy dark baked beans", "a sealed iron pot on the snow", "the lid comes off over mahogany beans", "a crusted iron lid scraping open and a whoosh of steam"),
];
fs.mkdirSync(R + "vlog/olbeans/COCINA", { recursive: true });
fs.writeFileSync(R + "vlog/olbeans/COCINA/plan.json", JSON.stringify(plan("vlog/olbeans/COCINA", anchors, clips), null, 1));
console.log("plan COCINA:", anchors.length, "anclas,", clips.length, "clips");
