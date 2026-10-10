# Genera ESC de escenas.mjs (cvpotatoes) — dirección por clip [acción, cuadro final]. python vlog/cvpotatoes/mk_esc.py
import json
SK = "a big black twelve-inch cast-iron skillet"
CUT = "small gold and red potatoes cut in half"
GOLD = "halved small potatoes with deep golden crisp cut sides, soft onion slices and chopped green chile"
BOOK = "a thick printed cookbook with a worn brown cover"
E = {}
def sc(k, st, base, clips, rusty=False): E[k] = dict(set=st, base=base, clips=clips, rusty=rusty)
sc("S00", "A1", f"stands at the black range tipping a spoon of melted bacon fat over {CUT} lying cut side down in {SK} on the burner.", {"c01": ["pours the spoonful of bacon fat over the potatoes, it sizzles", "the fat glistening around the potatoes, he looks up at the camera"]})
sc("S01", "A1", f"stands at the black range beside {SK} full of {GOLD}, a metal spatula in his hand.", {
 "c02": ["points the spatula at the skillet", "the spatula pointing at the golden potatoes"],
 "c03": ["picks up a raw potato from a bowl beside the stove and holds it up", "a raw potato held up beside his face"],
 "c04": ["mimes dropping the potato into a big pot, shaking his head", "his hand open over an empty pot, a doubtful face"],
 "c05": ["mimes pouring water down a drain with both hands", "both hands tilted as if pouring, a sour face"],
 "c06": ["holds up a closed fist and frowns", "his fist raised, eyebrows up"],
 "c07": ["drops the raw potato into the hot skillet beside the others", "the raw potato in the skillet, his hand pulling back"],
 "c08": ["holds up two fingers and taps the heavy lid", "two fingers raised, his other hand on the lid"],
 "c09": ["picks up a golden potato with his fingers and blows on it", "the golden potato held up close to the camera"],
 "c10": ["eats the potato and smiles, chewing", "chewing, a warm smile at the camera"]})
sc("S02", "A2", f"stands in front of the wall of hanging cast-iron skillets lifting {SK} off its hook with one hand, its heavy lid in the other.", {
 "c11": ["holds the skillet and lid up toward the camera", "the skillet and lid held up at chest height"],
 "c12": ["sets the lid on the skillet and taps it", "the lid sitting on the skillet, his knuckles on top"]})
sc("S03", "A1", "stands at the black range holding a raw potato over a big pot of boiling water on the burner.", {
 "c13": ["drops the potato into the boiling water and shakes his head", "the potato bobbing in the cloudy boiling water, a doubtful face"]})
sc("S04", "A3", "sits at the long plank table with an old stained crew notebook open in front of him, a basket of small potatoes beside it.", {
 "c17": ["taps the notebook page and lifts one potato from the basket", "a small potato held up in his fingers, a knowing smile"]})
sc("S05", "A3", f"stands at the long plank table with a knife and a wooden cutting board full of {CUT}.", {
 "c20": ["lines up the cut potato halves by size on the board", "rows of even potato halves on the board, the knife set down"],
 "c21": ["scrubs a whole potato under water in an enamel basin with his hands", "the clean wet potato held up, the skin still on"]})
sc("S06", "A3", f"stands at the long plank table patting {CUT} dry with a kitchen towel.", {
 "c22": ["pats the potato halves dry with the towel", "the towel folded beside the dry potatoes"]})
sc("S07", "A1", f"stands at the black range spooning white lard into {SK} on the burner.", {
 "c23": ["drops a spoon of lard into the skillet, it starts to melt", "the lard melting in the skillet"],
 "c24": ["tilts the skillet so the melted fat coats the bottom", "the shiny melted fat covering the bottom of the skillet"]})
sc("S08", "A1", f"stands at the black range placing {CUT} one by one cut side down in {SK} with shiny hot fat.", {
 "c25": ["places potato halves one by one cut side down in the pan", "a single layer of potato halves cut side down"],
 "c26": ["turns one potato that was lying on its round side flat side down", "his finger on the flat potato, all of them cut side down"],
 "c27": ["holds up one finger", "his index finger raised, a serious look"]})
sc("S09", "A1", f"stands at the black range over {SK} with one layer of potato halves, a pinch of kosher salt between his fingers and a spoon of water in the other hand.", {
 "c28": ["sprinkles the salt over the potatoes and splashes the spoon of water around them", "a puff of steam rising, the empty spoon in his hand"]})
sc("S10", "A1", f"stands at the black range holding the heavy lid over {SK} of potato halves, steam rising.", {
 "c29": ["sets the heavy lid on the skillet", "the lid on, a little steam escaping at the edge"],
 "c30": ["taps the lid and points at the steam escaping", "his finger pointing at the wisp of steam"],
 "c31": ["bends a little to listen to the sizzle under the lid", "his head tilted toward the skillet, a satisfied look"]})
sc("S11", "A4", "stands by the deep window holding a tin mug of coffee, the corral outside.", {
 "c32": ["wags his finger, then sips his coffee", "the mug at his lips, looking at the camera"],
 "c33": ["looks out the window, remembering", "looking out at the corral, a faint smile"],
 "c34": ["mimes tipping a big pot out the door with both hands", "both hands raised as if tipping a pot, eyebrows up"],
 "c35": ["laughs quietly and shakes his head", "a quiet laugh, the mug in his hand"]})
sc("S12", "A1", f"stands at the black range lifting the heavy lid off {SK}, a cloud of steam rising off the potato halves.", {
 "c36": ["pokes a potato with the tip of a small knife", "the knife tip in a soft potato, steam rising"]})
sc("S13", "A1", f"stands at the black range beside {SK} where the potato halves fry cut side down with the lid off, a metal spatula in his hand.", {
 "c37": ["sets the lid aside and folds his arms, waiting", "his arms folded, looking at the skillet"],
 "c38": ["holds his open hand still over the skillet", "his flat palm held over the pan"],
 "c39": ["lifts one potato with the spatula to show the golden bottom", "the deep golden cut side shown on the spatula"]})
sc("S15", "A1", f"stands at the black range flipping potato halves in {SK} with a metal spatula.", {
 "c41": ["flips the potatoes golden side up with the spatula", "the potatoes golden side up in the skillet"]})
sc("S16", "A1", f"stands at the black range with {SK} of golden potatoes, a small bowl of sliced onion and chopped green chile in his hand.", {
 "c42": ["tips the onion and green chile into the skillet and stirs them in", "the onion and chile mixed around the golden potatoes"]})
sc("S17", "A1", f"stands at the black range over {SK} of {GOLD}, a small dish of thin garlic slices in his hand.", {
 "c43": ["scatters the garlic slices over the potatoes", "the garlic slices on the potatoes, he smells the steam"]})
sc("S18", "A3", f"stands at the long plank table with {SK} of {GOLD} on a trivet, a small knife in his hand.", {
 "c44": ["slides the knife into the biggest potato with no push", "the knife standing in the soft potato"]})
sc("S19", "A3", f"stands at the long plank table over {SK} of {GOLD}, a pinch of chopped cilantro in his fingers.", {
 "c45": ["sprinkles the cilantro over the potatoes", "green cilantro over the golden potatoes, his hands open"]})
sc("S20", "A3", f"stands at the long plank table holding one golden potato half over {SK} of {GOLD}.", {
 "c46": ["breaks the potato open with his fingers, steam rising", "the creamy inside of the potato shown to the camera"],
 "c47": ["eats the potato and nods", "chewing, nodding, eyes half closed"]})
sc("S21", "A3", "stands at the long plank table with two plates of potatoes in front of him, one pale and broken, one golden and crisp.", {
 "c48": ["points at the two plates", "his finger between the two plates"],
 "c49": ["touches the pale plate, then the golden one", "his hand on the golden plate"]})
sc("S22", "A3", "stands at the long plank table holding a pale, broken, watery boiled potato on a fork over a plate.", {
 "c50": ["squeezes the boiled potato with the fork, it falls apart", "the mushy potato fallen apart on the plate, a sour face"]})
sc("S23", "A3", "stands at the long plank table holding a golden skillet potato cut in half on a fork.", {
 "c51": ["shows the golden crust and the creamy inside to the camera", "the potato half close to the camera, a proud smile"],
 "c52": ["holds up six fingers and laughs", "six fingers raised, laughing"]})
sc("S24", "A3", f"stands at the long plank table beside {SK} of {GOLD}; Rusty reaches in and grabs a potato with his fingers.", {
 "c53": ["points at Rusty grabbing a potato and laughs", "Rusty holding the hot potato, Claudio laughing"]}, rusty=True)
sc("S25", "A3", "stands at the long plank table watching Rusty blow on a hot potato held in his fingers.", {
 "c54": ["warns Rusty with a raised finger", "Rusty wincing with the hot potato in his mouth, Claudio grinning"]}, rusty=True)
sc("S26", "A1", "stands at the black range wiping a metal spatula with a cloth.", {
 "c55": ["finishes wiping the spatula and hangs it on a hook", "the spatula on its hook, looking at the camera"]})
sc("S27", "A3", "sits at the long plank table with the old stained crew notebook open in front of him.", {
 "c56": ["taps the notebook page", "his finger on the page, a serious look"],
 "c57": ["holds up one finger", "his finger raised"],
 "c58": ["makes a sour face and shakes his head", "a sour face, head tilted"],
 "c59": ["holds his flat hand up and lowers it a notch", "his flat hand lowered, nodding"]})
sc("S28", "A3", "stands at the long plank table with a small bowl of red smoked paprika and a jar of bacon fat.", {
 "c60": ["holds up the bowl of smoked paprika", "the red paprika held up toward the camera"],
 "c61": ["sprinkles a pinch of paprika into his palm and smiles", "a pinch of red paprika in his palm, smiling"]})
sc("S29", "A3", "stands at the long plank table with a brown paper bag of potatoes and a yellow onion.", {
 "c65": ["moves the onion far away from the paper bag of potatoes", "the onion at the other end of the table, his hand on the bag"]})
sc("S30", "A3", f"stands at the long plank table with a glass dish of leftover {GOLD}.", {
 "c66": ["shakes his head and raises his palm", "his palm raised, a firm look"]})
sc("S31", "A1", f"stands at the black range warming leftover golden potatoes in a dry {SK}.", {
 "c67": ["turns the potatoes once with the spatula", "the potatoes crisp again in the dry skillet"]})
sc("S33", "A3", "stands at the long plank table with a glass jar of coarse seasoning mix with a lid.", {
 "c71": ["holds up the jar of seasoning", "the jar held up next to his face"],
 "c72": ["shakes the closed jar hard", "the jar shaken, the mix blurred inside"],
 "c73": ["laughs and sets the jar down", "the jar on the table, a laugh"]})
sc("S34", "A1", f"stands at the black range over {SK} with browned crumbled chorizo and red fat.", {
 "c75": ["lifts the chorizo out with a slotted spoon, leaving the red fat", "the red fat in the skillet, the chorizo on a plate"],
 "c76": ["stirs the chorizo back in with crisp red potatoes", "red crisp potatoes and chorizo in the skillet"]})
sc("S35", "A4", "stands by the deep window, a burlap sack of potatoes leaning against the wall beside him.", {
 "c79": ["pats the burlap sack and smiles", "his hand on the sack, a nostalgic smile"]})
sc("S36", "A3", "stands at the long plank table; laid out in front of him a bag of small potatoes, half an onion, two green chiles, a head of garlic and a jar of lard.", {
 "c80": ["points at the potatoes, the onion and the chiles one by one", "his finger on the chiles"]})
sc("S37", "A1", "stands at the black range wearing oven mitts with two sheet pans of halved potatoes on the stovetop.", {
 "c82": ["lifts one sheet pan toward the oven", "the sheet pan held at the oven door"],
 "c84": ["slides the pan into the oven and closes the door", "his mitt on the closed oven door"]})
sc("S38", "A1", "stands at the black range with a smaller ten-inch cast-iron skillet holding a few halved potatoes.", {
 "c85": ["sets the lid on the small skillet", "the lid on the small skillet, he nods"]})
sc("S40", "A2", "stands in front of the wall of hanging cast-iron skillets holding a metal spatula.", {
 "c89": ["hangs the spatula on a nail", "the spatula on the nail, he turns to the camera"],
 "c90": ["holds up a sweet potato", "the orange sweet potato held up"],
 "c91": ["holds up a big brown russet potato", "the big russet held up"],
 "c92": ["taps a heavy cast-iron skillet on the wall", "his hand on the skillet"],
 "c93": ["holds his hand flat and lowers it a notch", "his flat hand lowered"]})
sc("S41", "A3", "stands at the long plank table with a plate of steamed potato halves cooling, a sheet of plastic wrap in his hands.", {
 "c94": ["spreads the potato halves out on the plate", "the halves spread out on the plate"],
 "c95": ["covers the plate with plastic wrap", "the plate covered, his hands smoothing the wrap"],
 "c96": ["sets the covered plate in an old ice box and closes it", "his hand on the closed ice box"],
 "c97": ["holds up a bag of frozen diced potatoes", "the frozen bag held up, a doubtful face"],
 "c98": ["shrugs and sets the bag down", "a shrug, a half smile"],
 "c99": ["holds up a baked potato in foil and shakes his head", "the foil potato held up, a crooked grin"]})
sc("S42", "A4", "stands by the deep window in the blue light just before dawn, a tin mug of coffee in his hand.", {
 "c100": ["looks out the dark window and sips his coffee", "looking out at the dawn, the mug lowered"]})
sc("S43", "A3", "stands at the long plank table holding a potato with green patches on its skin and a small knife.", {
 "c104": ["turns the potato to show the green patch", "the green patch shown to the camera"],
 "c106": ["drops the green potato into a tin bucket", "his hand over the bucket, a firm nod"]})
sc("S44", "A3", "stands at the long plank table with sweet potatoes cut in chunks on a board.", {
 "c108": ["lines up the sweet potato chunks by size", "rows of even orange chunks"],
 "c109": ["sprinkles chili powder over the chunks", "red chili powder on the orange chunks"]})
sc("S45", "A4", "stands by the deep window in the morning light, telling a story.", {
 "c110": ["rubs his eyes and laughs at himself", "a sheepish laugh"],
 "c111": ["holds up one finger", "one finger raised, eyebrows up"],
 "c112": ["holds up four fingers", "four fingers raised"],
 "c113": ["opens his hands wide, relieved", "both hands open, a big smile"],
 "c114": ["nods slowly", "a slow nod, a proud look"]})
sc("S46", "A3", f"stands at the long plank table with {CUT} drying cut side down on a kitchen towel, a bowl of water beside them.", {
 "c116": ["pats the cut sides dry with the towel", "the dry potato halves on the towel"]})
sc("S47", "A3", "stands at the long plank table holding a brown paper bag of potatoes.", {
 "c118": ["sets the paper bag on the table and pats it", "his hand on the bag, a shrug"]})
sc("S48", "A3", f"stands at the long plank table with a plate of {GOLD} next to a seared steak and green beans.", {
 "c120": ["pushes the plate toward the camera", "the full plate in front of him, his hands open"]})
sc("S49", "A3", f"sits at the long plank table with the old stained crew notebook and {BOOK} beside it.", {
 "c121": ["turns a page of the notebook and smiles", "his hand on the notebook, smiling"],
 "c122": ["holds up the printed cookbook", "the cookbook held up next to his face"]})
sc("S50", "A3", f"stands at the long plank table with {BOOK} open in front of him.", {
 "c123": ["turns a page of the cookbook and taps it", "his finger on the open page"],
 "c124": ["closes the book and pats the cover", "his hand flat on the closed book"],
 "c125": ["points down below the camera, then at the camera", "his finger pointing at the camera"]})
sc("S51", "A1", f"stands at the black range beside {SK}, a thick raw ribeye steak wrapped in butcher paper on the table beside him.", {
 "c126": ["taps the skillet lid", "his hand on the lid, nodding"],
 "c127": ["holds up the wrapped steak and waves goodbye", "the steak in one hand, the other waving, smiling"]})
P = "D:/Proyectos/video2-wt/cvpotatoes/vlog/cvpotatoes/escenas.mjs"
js = "export const ESC = {\n" + "\n".join(f'  {k}: {{ set: "{v["set"]}",{" rusty: true," if v["rusty"] else ""} base: {json.dumps(v["base"])},\n    clips: {{\n' + ",\n".join(f"      {c}: {json.dumps(a)}" for c, a in v["clips"].items()) + " } }," for k, v in E.items()) + "\n};\n"
s = open(P, encoding="utf8").read()
import re
s = re.sub(r"export const ESC = \{.*?\n\};\n|export const ESC = \{\};\n", lambda m: js, s, count=1, flags=re.S)
open(P, "w", encoding="utf8").write(s); print(len(E), "escenas", sum(len(v["clips"]) for v in E.values()), "clips")
