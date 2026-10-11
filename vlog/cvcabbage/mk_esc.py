# escenas.mjs de cvcabbage (formato híbrido): ESC = dirección por clip hablado [acción, cuadro final]; STOCK/STOCK2 = Pexels (2-3 palabras).
#   python vlog/cvcabbage/mk_esc.py
import json
POT = "a big black cast-iron Dutch oven"
CAB = "a whole round green cabbage"
RIB = "green cabbage cut in one-inch ribbons"
FRIED = "glossy fried cabbage with golden-brown edges, soft onion and bits of crisp bacon"
NOTE = "an old stained crew notebook"
BOOK = "a thick printed cookbook with a worn brown cover"
E = {}
def sc(k, st, base, clips, rusty=False): E[k] = dict(set=st, base=base, clips=clips, rusty=rusty)
sc("S00", "A1", f"stands at the black range tipping a spoon of amber bacon fat over {RIB} in {POT} on the burner.", {
 "c01": ["pours the bacon fat over the cabbage, it sizzles", "the fat shining on the cabbage, he looks up at the camera"]})
sc("S01", "A1", f"stands at the black range beside {POT}, {CAB} on the counter next to him.", {
 "c02": ["points back at the stove with his thumb", "his thumb pointing back, a grin"],
 "c03": ["picks up the cabbage and holds it up", "the cabbage held up beside his face"],
 "c04": ["sets the cabbage down and pats it", "his hand on the cabbage, a proud look"],
 "c06": ["pinches his nose and makes a face", "pinching his nose, eyes squeezed"],
 "c08": ["wags a finger", "one finger raised"],
 "c09": ["mimes tossing the pan with one hand", "his hand mid-toss"],
 "c10": ["holds up one finger, then two", "two fingers raised, a knowing smile"],
 "c11": ["touches his chest", "his hand on his chest, a warm smile"],
 "c12": ["looks out toward the window", "looking out, remembering"]})
sc("S02", "A2", f"stands in front of the wall of hanging cast-iron skillets lifting {POT} off its hook.", {
 "c13": ["lifts the heavy pot off the wall with both hands", "the pot held at chest height"]})
sc("S03", "A3", f"stands at the long plank table with {CAB} on a wooden cutting board.", {
 "c17": ["holds a pot lid up and shakes his head", "the lid held up, a doubtful face"]})
sc("S04", "A3", f"sits at the long plank table with {NOTE} open in front of him.", {
 "c20": ["taps the notebook and laughs", "a big laugh, his hand on the notebook"]})
sc("S05", "A3", f"stands at the long plank table with chopped bacon pieces, a sliced onion, {CAB}, a small bottle of apple cider vinegar and a dish of red chile flakes.", {
 "c22": ["touches the chile flakes, the butter and the vinegar bottle", "his hand on the vinegar bottle"]})
sc("S06", "A3", "stands at the long plank table with a slab of smoked bacon and a knife on a wooden board.", {
 "c25": ["cuts a thick slice off the slab of bacon", "the knife resting, a slice of bacon cut"]})
sc("S07", "A3", f"stands at the long plank table cutting {CAB} into quarters on a wooden board with a big knife.", {
 "c27": ["cuts the hard white core out of a quarter with one angled cut", "the white core triangle lying beside the quarter"]})
sc("S08", "A3", f"stands at the long plank table slicing a cabbage quarter into one-inch ribbons with a big knife.", {
 "c28": ["slices the quarter across into wide ribbons", "a pile of inch-wide ribbons on the board"],
 "c29": ["separates the layers with his fingers", "loose ribbons of cabbage in his hands"]})
sc("S10", "A1", f"stands at the black range lifting crisp bacon pieces out of {POT} with a slotted spoon.", {
 "c31": ["lifts the bacon onto a paper towel on a plate", "crisp bacon on the paper towel, fat shining in the pot"],
 "c32": ["tilts the pot to show the fat", "the melted fat pooled in the pot"]})
sc("S11", "A1", f"stands at the black range stirring sliced onion in bacon fat in {POT} with a wooden spoon.", {
 "c33": ["stirs the onion in the fat", "the onion soft and golden at the edges"]})
sc("S12", "A1", f"stands at the black range dropping a big double handful of {RIB} into {POT}.", {
 "c34": ["turns the knob up on the range", "his hand on the knob"],
 "c35": ["tosses the cabbage with metal tongs", "the pot piled to the top with cabbage"]})
sc("S13", "A1", f"stands at the black range over {POT} with the cabbage wilted down to half.", {
 "c36": ["points at how far the cabbage has dropped", "his finger pointing at the wilted cabbage"]})
sc("S14", "A1", f"stands at the black range adding the rest of the {RIB} to {POT}.", {
 "c37": ["sprinkles salt, pepper and chile flakes over the cabbage", "the cabbage speckled with red flakes"]})
sc("S15", "A1", f"stands at the black range tossing {FRIED} in {POT} with metal tongs, no lid anywhere.", {
 "c38": ["tosses the cabbage and shakes his head at the lid on the counter", "the lid sitting off to the side"],
 "c40": ["leaves the tongs resting and waits", "his hands off the pot, the cabbage browning"]})
sc("S16", "A1", f"stands at the black range tasting a piece of cabbage from {POT} held in tongs.", {
 "c41": ["blows on the piece and tastes it", "chewing, nodding slowly"]})
sc("S18", "A1", f"stands at the black range turning off the burner under {POT} of {FRIED}.", {
 "c46": ["turns the knob off", "his hand on the knob, the flame gone"]})
sc("S19", "A1", f"stands at the black range dropping a pat of butter and crisp bacon pieces into {POT} of {FRIED}.", {
 "c47": ["drops the butter and bacon in and tosses", "the butter melted through the cabbage"]})
sc("S20", "A1", f"stands at the black range tipping a spoon of apple cider vinegar over {POT} of {FRIED}, a little steam rising.", {
 "c48": ["pours the vinegar over the top and tosses", "a puff of steam over the glossy cabbage"],
 "c49": ["tastes a piece and smiles", "a satisfied smile"],
 "c50": ["holds up one finger", "one finger raised"]})
sc("S21", "A3", f"stands at the long plank table behind a bowl of {FRIED}.", {
 "c51": ["leans in and smells the bowl", "eyes closed, smelling the bowl"]})
sc("S22", "A3", f"stands at the long plank table beside a bowl of {FRIED}, waving someone over.", {
 "c52": ["waves toward the door", "his hand waving, looking to the side"]}, rusty=True)
sc("S23", "A3", f"stands at the long plank table beside a bowl of {FRIED}.", {
 "c53": ["watches Rusty eat a forkful from the bowl, smiling", "Rusty chewing, Claudio grinning"]}, rusty=True)
sc("S24", "A4", "stands by the deep window in the afternoon light, telling a story.", {
 "c54": ["laughs and shakes his head", "a laugh"], "c55": ["holds up five fingers", "five fingers raised"],
 "c56": ["mimes eating and asking for more", "his hand holding an invisible bowl out"], "c57": ["laughs hard", "a big laugh"]})
sc("S25", "A3", f"stands at the long plank table with a plate of pork chop, {FRIED} and beans.", {
 "c58": ["points at the cabbage on the plate", "his finger on the cabbage"],
 "c59": ["pushes the plate toward the camera", "the plate in front of him"],
 "c60": ["nods at the plate", "a slow nod"]})
sc("S26", "A1", "stands at the black range wiping metal tongs with a kitchen towel.", {
 "c61": ["wipes the tongs and looks up", "the towel over his shoulder, a smile"]})
sc("S27", "A3", f"sits at the long plank table with {NOTE} open in front of him, a pencil in his hand.", {
 "c62": ["taps the pencil on the page", "the pencil on the page"], "c63": ["holds up one finger", "one finger raised"],
 "c64": ["mimes a pinch of salt", "his fingers pinched"], "c65": ["flattens his hand, keep it moving", "his hand flat, a shrug"]})
sc("S28", "A3", f"stands at the long plank table weighing {CAB} in his hand.", {
 "c68": ["sets the cabbage down and pats it", "his hand on the cabbage"]})
sc("S31", "A3", "stands at the long plank table holding up half a raw green cabbage, the cut side toward the camera.", {
 "c75": ["turns the half cabbage to show the cut side", "the cut side facing the camera"]})
sc("S32", "A3", "stands at the long plank table squeezing thin-sliced cabbage with salt in a big bowl with his hands.", {
 "c79": ["lifts a forkful of slaw and tastes it", "chewing, a satisfied nod"]})
sc("S33", "A3", "sits at the long plank table with a bowl of raw chopped cabbage and a glass of water.", {
 "c80": ["holds up a handful of raw cabbage", "the cabbage in his hand"], "c82": ["shrugs and smiles", "a smile"]})
sc("S34", "A3", f"stands at the long plank table eating {FRIED} cold from a small container with a fork.", {
 "c83": ["takes a forkful and chews, a little guilty", "chewing, a sheepish grin"]})
sc("S35", "A1", "stands at the black range beside a pot of cabbage soup with sausage and potato cubes, steam rising.", {
 "c86": ["ladles soup into a bowl", "a steaming bowl in his hand"], "c87": ["sets the bowl down and nods", "the bowl on the counter"]})
sc("S36", "A1", f"stands at the black range over a black cast-iron skillet of {FRIED} with two eggs cracked into wells.", {
 "c89": ["lifts the lid to show the set eggs", "two eggs set in the cabbage"]})
sc("S38", "A3", f"stands at the long plank table with {CAB}, a pack of bacon, an onion, butter and a vinegar bottle in a row.", {
 "c91": ["touches each item in the row", "his hand at the end of the row"], "c92": ["holds up six fingers", "six fingers raised"],
 "c93": ["opens his hands and smiles", "both hands open"]})
sc("S39", "A1", f"stands at the black range with a big roasting pan across two burners full of {FRIED}.", {
 "c94": ["holds up two fingers", "two fingers raised"], "c95": ["tosses the cabbage in the roasting pan", "the cabbage spread thin in the big pan"],
 "c96": ["slides a dish into the oven", "the oven door closed"]})
sc("S40", "A1", f"stands at the black range beside a twelve-inch cast-iron skillet with half a head of cabbage in ribbons.", {
 "c97": ["drops the ribbons into the skillet", "the skillet full of cabbage"], "c98": ["wraps the other half cabbage in plastic", "the wrapped half on the counter"]})
sc("S42", "A2", "stands in front of the wall of hanging cast-iron skillets hanging a slotted spoon on a nail, answering questions.", {
 "c101": ["hangs the spoon and nods", "the spoon on its nail"], "c102": ["holds his thumb and finger close together", "a small pinch, a smile"],
 "c103": ["shrugs", "a shrug"], "c104": ["holds up a small bottle of apple cider vinegar", "the bottle held up"]})
sc("S43", "A3", "stands at the long plank table with smoked turkey wings, a piece of salt pork and a bottle of oil beside a green cabbage.", {
 "c106": ["picks up the salt pork and shows it", "the salt pork held up"], "c107": ["sets it down and picks up the oil bottle", "the oil bottle held up"]})
sc("S44", "A3", f"sits at the long plank table with a bowl of {FRIED} and a cast-iron skillet of cornbread.", {
 "c109": ["crumbles cornbread into the bowl", "crumbs over the cabbage, a grin"]})
sc("S45", "A3", "stands at the long plank table wrapping half a green cabbage tight in plastic wrap.", {
 "c110": ["wraps the cut side tight", "the wrapped half on the table"]})
sc("S46", "A4", "stands by the deep window in the afternoon light, telling a story, a grey winter corral outside.", {
 "c111": ["looks out the window", "looking out at the corral"], "c112": ["holds up both hands spread wide", "both hands open, eyebrows up"],
 "c113": ["laughs and shakes his head", "a laugh"], "c114": ["smiles proudly", "a proud smile"]})
sc("S48", "A1", f"stands at the black range holding the lid over {POT} piled high with cabbage.", {
 "c118": ["sets the lid on for a moment", "the lid on, his hand on top"], "c119": ["takes the lid off and sets it aside", "the lid off to the side, cabbage browning"]})
sc("S49", "A3", "stands at the long plank table folding a warm tortilla around fried cabbage, beans and a fried egg.", {
 "c121": ["holds up the folded tortilla", "the tortilla held up, a grin"]})
sc("S50", "A3", f"sits at the long plank table with {NOTE} and {BOOK} beside it.", {
 "c122": ["turns a page of the notebook", "his hand on the notebook"], "c123": ["holds up the printed cookbook", "the cookbook beside his face"]})
sc("S51", "A3", f"stands at the long plank table with {BOOK} open in front of him.", {
 "c124": ["turns a page and taps it", "his finger on the page"], "c125": ["points below the camera, then at the camera", "his finger pointing at the camera"]})
sc("S52", "A1", f"stands at the black range beside {POT}, a tray of raw chicken thighs on the counter.", {
 "c126": ["counts on his fingers", "fingers counting"], "c127": ["points at the chicken thighs and waves goodbye", "waving, smiling"]})
STOCK = {"c05": "boiling cabbage", "c07": "boiled cabbage", "c14": "green cabbage", "c15": "cabbage field", "c16": "boiling pot",
 "c18": "frying cabbage", "c19": "frying onions", "c21": "raw bacon", "c23": "bacon strips", "c24": "cutting bacon", "c26": "cutting cabbage",
 "c30": "frying bacon", "c39": "sauteed cabbage", "c42": "snowy ranch", "c43": "snow road", "c44": "root cellar", "c45": "lettuce",
 "c66": "cabbage market", "c67": "vegetable market", "c69": "red cabbage", "c70": "napa cabbage", "c71": "smoked sausage", "c72": "frying sausage",
 "c73": "sausage cabbage", "c74": "cornbread", "c76": "shredding cabbage", "c77": "squeezing lime", "c78": "coleslaw", "c81": "sailing ship",
 "c84": "soup pot", "c85": "diced potatoes", "c88": "fried eggs", "c90": "tacos", "c99": "dutch oven", "c100": "cowboys campfire",
 "c105": "smoked turkey", "c108": "skillet cornbread", "c115": "cabbage leaves", "c116": "rinsing vegetables", "c117": "vegetable garden", "c120": "breakfast burrito"}
STOCK2 = {"c05": "cabbage pot", "c07": "cooked cabbage", "c14": "cabbage", "c15": "cabbage farm", "c16": "steaming pot",
 "c18": "cabbage pan", "c19": "onions pan", "c21": "bacon", "c23": "bacon package", "c24": "slicing bacon", "c26": "chopping cabbage",
 "c30": "bacon pan", "c39": "stir fry cabbage", "c42": "winter farm", "c43": "snowy road", "c44": "pantry shelves", "c45": "fresh lettuce",
 "c66": "grocery produce", "c67": "supermarket vegetables", "c69": "savoy cabbage", "c70": "chinese cabbage", "c71": "sausage", "c72": "sausage pan",
 "c73": "sausage skillet", "c74": "tortillas", "c76": "sliced cabbage", "c77": "chopping cilantro", "c78": "cabbage salad", "c81": "old ship",
 "c84": "vegetable soup", "c85": "potatoes cubes", "c88": "eggs skillet", "c90": "tortilla", "c99": "campfire cooking", "c100": "campfire",
 "c105": "turkey leg", "c108": "cornbread", "c115": "peeling cabbage", "c116": "washing vegetables", "c117": "cabbage garden", "c120": "tortilla eggs"}
js = "export const ESC = {\n" + "\n".join(f'  {k}: {{ set: "{v["set"]}",{" rusty: true," if v["rusty"] else ""} base: {json.dumps(v["base"])},\n    clips: {{\n' + ",\n".join(f"      {c}: {json.dumps(a)}" for c, a in v["clips"].items()) + " } }," for k, v in E.items()) + "\n};\n"
js += "export const STOCK = " + json.dumps(STOCK, indent=1) + ";\nexport const STOCK2 = " + json.dumps(STOCK2, indent=1) + ";\nexport const DET = {};\nexport const TOPIC = \"cabbage\";\n"
open("D:/Proyectos/video2-wt/cvcabbage/vlog/cvcabbage/escenas.mjs", "w", encoding="utf8").write(js)
print(len(E), "escenas", sum(len(v["clips"]) for v in E.values()), "clips ·", len(STOCK), "stock")
