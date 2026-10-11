# escenas.mjs de cvgreenbeans (formato híbrido): ESC = dirección por clip hablado [acción, cuadro final]; STOCK/STOCK2 = Pexels (2-3 palabras).
#   python vlog/cvgreenbeans/mk_esc.py
import json
SK = "a big black twelve-inch cast-iron skillet"
GB = "bright green fresh green beans"
DONE = "bright green beans blistered in bacon fat with bits of bacon, tomato and garlic"
NOTE = "an old stained crew notebook"
BOOK = "a thick printed cookbook with a worn brown cover"
E = {}
def sc(k, st, base, clips, rusty=False): E[k] = dict(set=st, base=base, clips=clips, rusty=rusty)
sc("S00", "A1", f"stands at the black range pouring water from a clay jug into {SK} full of {GB}, steam rising.", {
 "c01": ["pours the water, it hisses and steams", "steam rising over the green beans"]})
sc("S01", "A1", f"stands at the black range beside {SK} of {DONE}.", {
 "c02": ["holds up a measuring cup with a little water", "the cup held up"], "c03": ["points at the skillet", "his finger on the skillet"],
 "c04": ["shakes his head with a sour face", "a sour face"], "c05": ["lifts a few beans with tongs", "shiny beans held up"],
 "c06": ["sets a lid on the skillet", "the lid on the skillet"], "c07": ["lifts the lid away", "the lid in his hand"],
 "c08": ["tosses the beans with tongs", "the beans tossed and shiny"], "c09": ["touches his chest and smiles", "his hand on his chest"]})
sc("S02", "A2", "stands in front of the wall of hanging cast-iron skillets lifting a big skillet and its lid off the hooks.", {
 "c10": ["lifts the skillet and the lid down", "the skillet and lid held at chest height"]})
sc("S03", "A3", f"stands at the long plank table beside a woven basket of {GB}.", {
 "c11": ["holds up a single green bean", "the bean held up to the window light"], "c15": ["holds up four fingers", "four fingers raised"]})
sc("S04", "A3", f"sits at the long plank table with {NOTE} open in front of him.", {
 "c16": ["taps the notebook and laughs", "a laugh, his hand on the notebook"]})
sc("S05", "A3", f"stands at the long plank table snapping the stem ends off {GB} over a wooden board.", {
 "c17": ["snaps the end off a bean", "a snapped bean in his fingers"]})
sc("S06", "A3", "stands at the long plank table with chopped bacon, a sliced half onion, a chopped Roma tomato and sliced garlic on a wooden board.", {
 "c20": ["touches the bacon, the onion and the tomato", "his hand beside the tomato"], "c21": ["holds up a small cup of water", "the cup held up"]})
sc("S07", "A1", f"stands at the black range stirring chopped bacon frying in {SK} with a wooden spoon.", {
 "c22": ["stirs the bacon", "the bacon almost crisp in its fat"]})
sc("S08", "A1", f"stands at the black range dropping sliced onion into the bacon fat in {SK}.", {
 "c23": ["stirs the onion into the fat", "the onion softening"]})
sc("S09", "A1", f"stands at the black range tipping a big bowl of {GB} into {SK} with bacon and onion.", {
 "c24": ["tosses the beans with tongs", "every bean shiny with fat"], "c25": ["lifts a shiny bean with the tongs", "the shiny bean held up"]})
sc("S10", "A1", f"stands at the black range pouring a little water from a cup into {SK} of green beans, steam bursting up.", {
 "c26": ["pours the water, it hisses", "a cloud of steam"]})
sc("S11", "A1", f"stands at the black range setting a heavy lid on {SK}, a kitchen timer in his other hand.", {
 "c27": ["sets the lid on and starts the timer", "the lid on, the timer in his hand"], "c28": ["listens to the pan with his head tilted", "head tilted, listening"]})
sc("S12", "A4", "stands by the deep window in the morning light, a summer vegetable garden outside with green bean vines climbing a fence of cedar posts.", {
 "c29": ["looks out the window and smiles", "a warm smile"], "c32": ["nods slowly, remembering", "a soft smile"]})
sc("S13", "A3", "stands at the long plank table beside glass jars of home-canned green beans, an old pressure canner with a gauge on the shelf behind him.", {
 "c35": ["taps the lid of a jar", "his hand on the jar"]})
sc("S14", "A1", f"stands at the black range lifting the lid off {SK}, steam rising off {GB}.", {
 "c36": ["lifts the lid away", "the bright green beans in the pan"]})
sc("S15", "A1", f"stands at the black range dropping chopped tomato and sliced garlic into {SK} of {GB}.", {
 "c37": ["tosses everything together with tongs", "tomato and garlic through the beans"]})
sc("S16", "A1", f"stands at the black range tossing {GB} with tongs in {SK}, the water gone, the beans sizzling.", {
 "c38": ["tosses the beans", "the pan almost dry"], "c39": ["points at a brown blister on a bean", "his finger at the pan"],
 "c40": ["stirs the tomato through the beans", "the beans coated"]})
sc("S17", "A3", "stands at the long plank table biting a cooked green bean held in his fingers.", {
 "c41": ["bites the bean, it snaps", "chewing, a nod"]})
sc("S18", "A3", f"stands at the long plank table beside a white plate of {DONE}.", {
 "c42": ["slides the plate toward the camera", "the full plate in front of him"]})
sc("S19", "A3", f"stands at the long plank table beside a plate of {DONE}, waving someone over.", {
 "c43": ["waves toward the door", "his hand waving"]}, rusty=True)
sc("S20", "A3", f"stands at the long plank table beside a plate of {DONE}.", {
 "c44": ["watches Rusty eat green beans with his fingers, saying nothing", "Rusty chewing, Claudio holding back a grin"]}, rusty=True)
sc("S21", "A4", "stands by the deep window in the evening light, telling a story.", {
 "c45": ["laughs", "a big laugh"], "c48": ["shrugs and smiles", "a smile"]})
sc("S22", "A3", "stands at the long plank table with a plate of a crisp chicken thigh in red chile sauce, green beans and a warm tortilla.", {
 "c49": ["points at the red and the green on the plate", "his finger at the plate"], "c50": ["sets a small pot of pinto beans beside the plate", "the pot beside the plate"]})
sc("S23", "A1", "stands at the black range wiping metal tongs with a kitchen towel.", {
 "c51": ["wipes the tongs and looks up", "the towel over his shoulder, a smile"]})
sc("S24", "A3", f"sits at the long plank table with {NOTE} open in front of him, a pencil in his hand.", {
 "c52": ["taps the pencil on the page", "the pencil on the page"], "c53": ["holds up two fingers", "two fingers raised"],
 "c54": ["mimes tipping a pan", "his hands tilted"], "c55": ["wags a finger", "a finger wag"]})
sc("S25", "A3", f"stands at the long plank table bending a fresh green bean until it snaps, a paper bag of {GB} beside him.", {
 "c58": ["puts the beans into a plastic bag", "the bag held up"]})
sc("S26", "A3", "stands at the long plank table holding a bag of frozen green beans.", {
 "c60": ["tips the frozen beans into a skillet", "the frozen beans in the pan"]})
sc("S27", "A3", "stands at the long plank table beside a quart jar of pickled green beans standing up with garlic, a dried red chile and dill.", {
 "c64": ["pours hot brine from a small pot into the jar", "the beans covered in brine"], "c65": ["pulls a pickled bean out of the jar and bites it", "chewing, grinning"]})
sc("S28", "A1", f"stands at the black range over {SK} of {GB} with chopped green chile.", {
 "c66": ["spoons a little lard into the skillet", "the lard melting"], "c68": ["holds up the finished pan", "the light green dish"]})
sc("S29", "A3", "stands at the long plank table wrapping trimmed green beans in a dry paper towel beside a plastic container of sliced onion.", {
 "c70": ["sets the container on the bag", "the prepped things stacked"]})
sc("S30", "A3", "stands at the long plank table with leftover green beans in a glass container.", {
 "c71": ["lifts the lid and shrugs", "the lid in his hand"]})
sc("S31", "A1", f"stands at the black range over {SK} of chopped green beans and potatoes, pouring beaten eggs over the top.", {
 "c72": ["pours the eggs over the hash", "the eggs spreading"]})
sc("S32", "A3", "stands at the long plank table with a bag of green beans, a package of bacon, half an onion, a Roma tomato and garlic in a row.", {
 "c74": ["touches each item in the row", "his hand at the end of the row"], "c75": ["holds up one finger", "one finger raised"]})
sc("S33", "A1", "stands at the black range beside two cast-iron skillets of green beans side by side.", {
 "c76": ["tosses one skillet, then the other", "both pans of green beans"]})
sc("S34", "A1", "stands at the black range beside a small ten-inch cast-iron skillet with a handful of green beans.", {
 "c77": ["holds up two fingers", "two fingers raised"]})
sc("S36", "A2", "stands in front of the wall of hanging cast-iron skillets, answering questions.", {
 "c80": ["holds up a small dish of slivered almonds", "the dish held up"], "c81": ["holds up a yellow wax bean and a green bean", "the two beans held up"],
 "c82": ["holds up a small potato", "the potato held up"], "c83": ["holds up a Roma tomato", "the tomato held up"]})
sc("S37", "A3", "stands at the long plank table with yellow wax beans, flat Romano beans and green beans in three piles.", {
 "c86": ["bites a bean and nods", "a nod"]})
sc("S38", "A3", "stands at the long plank table beside a big serving bowl of bright green beans with bacon.", {
 "c89": ["slides the bowl toward the camera", "the bowl in front of him"]})
sc("S39", "A4", "stands by the deep window in the summer light, a corral outside.", {
 "c90": ["shakes his head", "a small laugh"], "c91": ["sets a bowl of green beans on the long table", "the bowl on the table"],
 "c92": ["grins", "a grin"], "c93": ["holds up a pot lid", "the lid held up"]})
sc("S40", "A3", "stands at the long plank table sprinkling a pinch of salt over a skillet of green beans.", {
 "c94": ["tastes a bean, then adds a pinch of salt", "his fingers pinching salt"]})
sc("S41", "A3", "stands at the long plank table beside a bowl of dull olive-gray canned green beans next to a bowl of bright green skillet green beans.", {
 "c96": ["points at the bright green bowl", "his finger at the bright bowl"], "c97": ["points at the gray bowl", "his finger at the gray bowl"],
 "c98": ["lifts a bright bean and snaps it", "the snapped bean"]})
sc("S42", "A4", "stands by the deep window in the afternoon light, telling a story.", {
 "c102": ["smiles softly, remembering", "a soft smile"]})
sc("S43", "A3", f"stands at the long plank table snapping the end of a garden green bean and pulling the string down the seam.", {
 "c103": ["pulls the string down the seam", "the thin string held up"], "c105": ["drops the string and shrugs", "a shrug"]})
sc("S44", "A3", "stands at the long plank table beside a glass bowl of ice water full of bright green beans.", {
 "c108": ["lifts a handful of beans out of the ice water", "the dripping beans"]})
sc("S45", "A3", "stands at the long plank table holding a single green bean.", {
 "c109": ["holds up the green bean", "the bean held up"], "c110": ["holds up a strip of bacon beside a big bowl of beans", "the bacon held up"],
 "c111": ["squeezes half a lime over a skillet of beans", "the lime squeezed"]})
sc("S46", "A3", f"stands at the long plank table beside a skillet of {DONE}.", {
 "c113": ["pretends not to see a small hand reaching into the skillet", "a sideways look, a grin"], "c114": ["laughs", "a laugh"]})
sc("S47", "A1", f"stands at the black range over {SK} of green beans, a wooden spoon in his hand.", {
 "c115": ["stirs and stirs, then stops and shakes his head", "the spoon still"], "c116": ["lets the beans sit and sizzle, hands off", "the beans sizzling, brown spots"]})
sc("S48", "A3", f"sits at the long plank table with {NOTE} and {BOOK} beside it.", {
 "c117": ["holds up the printed cookbook", "the cookbook beside his face"]})
sc("S49", "A3", f"stands at the long plank table with {BOOK} open in front of him.", {
 "c118": ["turns a page and taps it", "his finger on the page"], "c119": ["closes the book and pats it", "his hand on the book"],
 "c120": ["points below the camera, then at the camera", "his finger pointing at the camera"]})
sc("S50", "A1", "stands at the black range beside a chunk of beef chuck on butcher paper.", {
 "c121": ["counts on his fingers", "fingers counting"], "c122": ["taps the butcher paper and waves goodbye", "waving, smiling"]})
STOCK = {"c12": "green beans cooking", "c13": "boiling vegetables", "c14": "pot boiling water", "c18": "cutting green beans", "c19": "colander vegetables",
 "c30": "bean vines", "c31": "picking green beans", "c33": "preserved vegetables jars", "c34": "home canning", "c46": "potluck dinner", "c47": "baked casserole",
 "c56": "fresh green beans", "c57": "green beans market", "c59": "frozen vegetables bag", "c61": "canned green beans", "c62": "pickles",
 "c63": "pouring vinegar", "c67": "squeezing lime", "c69": "chopping bacon", "c73": "breakfast hash", "c78": "campfire skillet", "c79": "cooking over fire",
 "c84": "green beans variety", "c85": "yellow beans", "c87": "thanksgiving dinner", "c88": "thanksgiving table", "c95": "black pepper grinder",
 "c99": "vegetable garden", "c100": "watering garden", "c101": "green beans bowl", "c104": "green beans", "c106": "blanching vegetables",
 "c107": "ice water bowl", "c112": "kids eating dinner"}
STOCK2 = {"c12": "string beans pan", "c13": "pot of vegetables", "c14": "boiling water", "c18": "chopping beans", "c19": "washing vegetables",
 "c30": "climbing beans", "c31": "harvesting beans", "c33": "jars shelf", "c34": "canning jars", "c46": "church dinner", "c47": "casserole",
 "c56": "green beans", "c57": "vegetable market", "c59": "freezer vegetables", "c61": "canned vegetables", "c62": "pickled vegetables",
 "c63": "pickling", "c67": "lime juice", "c69": "raw bacon", "c73": "potato hash", "c78": "cast iron fire", "c79": "camp cooking",
 "c84": "string beans", "c85": "wax beans", "c87": "family dinner", "c88": "holiday table", "c95": "pepper mill",
 "c99": "garden vegetables", "c100": "watering can", "c101": "snapping beans", "c104": "fresh beans", "c106": "ice bath vegetables",
 "c107": "ice water", "c112": "family dinner kids"}
js = "export const ESC = {\n" + "\n".join(f'  {k}: {{ set: "{v["set"]}",{" rusty: true," if v["rusty"] else ""} base: {json.dumps(v["base"])},\n    clips: {{\n' + ",\n".join(f"      {c}: {json.dumps(a)}" for c, a in v["clips"].items()) + " } }," for k, v in E.items()) + "\n};\n"
js += "export const STOCK = " + json.dumps(STOCK, indent=1) + ";\nexport const STOCK2 = " + json.dumps(STOCK2, indent=1) + ";\nexport const DET = {};\nexport const TOPIC = \"green beans\";\n"
open("D:/Proyectos/video2-wt/cvgreenbeans/vlog/cvgreenbeans/escenas.mjs", "w", encoding="utf8").write(js)
segs = json.load(open("D:/Proyectos/video2-wt/cvgreenbeans/vlog/cvgreenbeans/segs.json", encoding="utf8"))
have = {c for v in E.values() for c in v["clips"]} | set(STOCK)
print(len(E), "escenas", sum(len(v["clips"]) for v in E.values()), "clips ·", len(STOCK), "stock · faltan", [s["id"] for s in segs if s["id"] not in have])
