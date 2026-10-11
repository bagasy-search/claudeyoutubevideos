# escenas.mjs de cveggs (formato híbrido): ESC = dirección por clip hablado [acción, cuadro final]; STOCK/STOCK2 = Pexels (2-3 palabras).
#   python vlog/cveggs/mk_esc.py
import json
SK = "a big black glassy-smooth cast-iron skillet"
EGGS = "two fried eggs with soft white tops and tall runny yolks, no brown edges"
NOTE = "an old stained crew notebook"
BOOK = "a thick printed cookbook with a worn brown cover"
E = {}
def sc(k, st, base, clips, rusty=False): E[k] = dict(set=st, base=base, clips=clips, rusty=rusty)
sc("S00", "A1", f"stands at the black range lowering a lid over {SK} with two eggs inside, steam rising.", {
 "c01": ["sets the lid down over the eggs", "the lid on, steam at the rim"]})
sc("S01", "A1", f"stands at the black range holding a brown egg over {SK}.", {
 "c02": ["holds the egg up", "the egg beside his face"], "c03": ["holds up an empty oil bottle and shakes his head", "the bottle set aside"],
 "c04": ["taps the clean black pan", "his finger on the pan"], "c05": ["shakes his head", "a small head shake"],
 "c06": ["holds up three fingers", "three fingers raised"], "c07": ["counts on his fingers", "a laugh"],
 "c08": ["mimes pouring oil", "his hand tilted"], "c09": ["flinches back from the stove", "a grimace"],
 "c10": ["taps a hard brown egg edge on a plate", "a sour face"], "c11": ["mimes flipping with a spatula", "a shrug"],
 "c12": ["shakes his head", "a sour face"], "c13": ["holds up a small cup of water and a lid", "the cup and lid held up"],
 "c14": ["touches his chest and smiles", "his hand on his chest"]})
sc("S02", "A2", f"stands in front of the wall of hanging cast-iron skillets lifting {SK} off its hook.", {
 "c15": ["tilts the pan to show the smooth black surface", "the glassy surface catching the light"], "c16": ["holds up one finger", "one finger raised"]})
sc("S03", "A3", "stands at the long plank table with a carton of brown eggs, a glass of water and a pot lid.", {
 "c20": ["lifts an egg out of the carton", "the egg held up"], "c21": ["holds up two fingers", "two fingers raised"],
 "c23": ["holds the lid over an imaginary pan", "the lid held flat"], "c24": ["sets the lid down and smiles", "a smile"]})
sc("S04", "A3", f"sits at the long plank table with {NOTE} open in front of him.", {
 "c25": ["mimes wiping a pan with a rag", "his hand flat"], "c26": ["taps the notebook and laughs", "a laugh, his hand on the notebook"]})
sc("S05", "A1", f"stands at the black range setting {SK} empty on a burner with a medium flame.", {
 "c27": ["holds up two eggs", "the eggs held up"], "c28": ["turns the knob to medium", "a medium blue flame"], "c29": ["holds up two fingers", "two fingers raised"]})
sc("S06", "A1", f"stands at the black range flicking drops of water from wet fingers into {SK}, the drops dancing.", {
 "c30": ["flicks water into the pan", "drops sitting and bubbling"], "c31": ["points at drops skating across the pan", "beads of water dancing"],
 "c32": ["lifts the pan off the heat", "the pan held aside"], "c33": ["points at a dancing drop", "his finger at the pan"]})
sc("S07", "A1", f"stands at the black range cracking an egg low over {SK}.", {
 "c34": ["cracks two eggs in, close together", "two eggs side by side in the pan"], "c35": ["slides an egg in from a little cup", "the cup empty"]})
sc("S08", "A1", f"stands at the black range watching two eggs in {SK}, the edges of the whites turning opaque.", {
 "c36": ["points at the white edge", "the edges white, the middle clear"]})
sc("S09", "A1", f"stands at the black range pouring a spoon of water into the empty part of {SK} around two eggs, steam bursting.", {
 "c37": ["pours the water around the eggs", "steam rising around the eggs"]})
sc("S10", "A1", f"stands at the black range setting a lid on {SK}.", {
 "c38": ["sets the lid on", "the lid on"]})
sc("S11", "A1", f"stands at the black range beside {SK} with a glass lid, two eggs steaming under it, a kitchen timer in his hand.", {
 "c39": ["holds up the timer", "the timer held up"], "c40": ["holds up three fingers", "three fingers raised"]})
sc("S12", "A1", f"stands at the black range lifting the lid off {SK}, steam rising off {EGGS}.", {
 "c41": ["lifts the lid away", "the perfect eggs in the pan"]})
sc("S13", "A1", f"stands at the black range sliding {EGGS} out of {SK} onto a plate with a thin spatula.", {
 "c42": ["slides the eggs out, nothing sticks", "the eggs on the plate, the pan clean"]})
sc("S14", "A3", f"stands at the long plank table with a plate of {EGGS} on two warm corn tortillas with red salsa.", {
 "c43": ["spoons red salsa over the eggs", "salsa on the eggs"], "c44": ["picks up a tortilla with the egg and takes a bite", "chewing, grinning"]})
sc("S15", "A3", f"stands at the long plank table holding out a plate of {EGGS} on tortillas.", {
 "c45": ["hands the plate to Rusty in his hat", "Rusty holding the plate"]}, rusty=True)
sc("S16", "A3", "stands at the long plank table.", {
 "c46": ["watches Rusty eat standing up, the yolk running onto the tortilla", "Rusty chewing, Claudio smiling"]}, rusty=True)
sc("S17", "A1", f"stands at the black range wiping {SK} with a rag.", {
 "c47": ["wipes the pan and looks up", "the rag over his shoulder, a smile"]})
sc("S18", "A3", f"sits at the long plank table with {NOTE} open in front of him, a pencil in his hand.", {
 "c48": ["taps the pencil on the page", "the pencil on the page"], "c49": ["holds up two fingers", "two fingers raised"],
 "c50": ["mimes pouring around, not on top", "his hand circling"], "c51": ["holds up one finger", "one finger raised"]})
sc("S19", "A1", f"stands at the black range swirling a small spoon of melting butter in {SK}.", {
 "c53": ["holds up one teaspoon of butter", "the spoon held up"], "c54": ["swirls the butter in the pan", "the butter melted"], "c55": ["shrugs and smiles", "a smile"]})
sc("S20", "A4", "stands by the deep window before dawn, blue light outside, a tin cup of coffee in his hand.", {
 "c56": ["looks out the window", "a serious face"], "c57": ["shakes his head", "a small laugh"],
 "c58": ["holds up three fingers", "three fingers raised"], "c59": ["puts his hand on his heart", "his hand on his heart"]})
sc("S22", "A1", "stands at the black range beside a small skillet with one fried egg.", {
 "c63": ["holds up one finger", "one finger raised"]})
sc("S24", "A3", "stands at the long plank table beside a tall glass of water with an egg lying on the bottom.", {
 "c69": ["drops a second egg in, it floats, and he shakes his head", "the floating egg"]})
sc("S26", "A3", "stands at the long plank table, speaking to the camera, serious.", {
 "c72": ["holds up a fried egg on a plate", "the plate held up"], "c73": ["holds up one finger", "one finger raised"],
 "c74": ["shows a firm-yolk egg on a plate", "the firm yolk"], "c75": ["holds up a carton of pasteurized eggs", "the carton held up"],
 "c76": ["shakes his head", "a small head shake"]})
sc("S28", "A3", f"stands at the long plank table with {SK} of crisp chopped potatoes and shredded beef hash, four eggs steaming in holes in the hash.", {
 "c81": ["cracks an egg into a hole in the hash", "four eggs in the hash"], "c82": ["sets the skillet on a board", "the skillet in front of him"]})
sc("S29", "A3", "stands at the long plank table with a carton of eggs, two corn tortillas and a jar of salsa in a row.", {
 "c84": ["holds up an empty oil bottle and sets it aside", "the bottle set aside"]})
sc("S31", "A2", "stands in front of the wall of hanging cast-iron skillets, answering questions.", {
 "c88": ["holds up a stainless steel skillet", "the skillet held up"], "c89": ["shakes his head", "a small head shake"],
 "c90": ["mimes a gentle flip with a thin spatula", "the spatula held up"], "c91": ["shrugs", "a shrug"],
 "c92": ["rubs the black pan with a rag", "the pan shining"]})
sc("S32", "A1", "stands at the black range stacking warm corn tortillas inside a folded kitchen towel.", {
 "c96": ["folds the towel over the stack", "the towel bundle on the counter"]})
sc("S34", "A4", "stands by the deep window with a tin cup in his hand, telling a story.", {
 "c100": ["smiles, remembering", "a sheepish smile"], "c101": ["shakes his head at himself", "a sheepish laugh"],
 "c102": ["raises the cup a little", "a smile"]})
sc("S35", "A3", "stands at the long plank table holding two brown eggs.", {
 "c103": ["holds up three fingers, then four", "four fingers, a grin"], "c104": ["sets the eggs back in the carton", "the carton in front of him"]})
sc("S37", "A1", f"stands at the black range rubbing a drop of oil into {SK} with a paper towel.", {
 "c108": ["rubs the oil in", "the pan glossy"], "c109": ["holds up the shining pan", "the pan held up"],
 "c110": ["slides an egg across the pan", "the egg sliding"]})
sc("S38", "A4", "stands by the deep window at night with a tin cup in his hand, rain on the glass.", {
 "c113": ["nods slowly", "a nod"], "c114": ["counts on his fingers", "four fingers raised"]})
sc("S39", "A3", "stands at the long plank table beside a plate of soft scrambled eggs next to a plate of fried eggs.", {
 "c117": ["wags a finger", "a finger wag"]})
sc("S40", "A3", "stands at the long plank table holding an egg with a little dirt on the shell in one hand and a dry towel in the other.", {
 "c118": ["shakes his head at the sink", "a head shake"], "c119": ["wipes the egg with the dry towel", "the clean egg"]})
sc("S41", "A3", "stands at the long plank table holding a plate of two fried eggs on rice with salsa and beans.", {
 "c121": ["holds the plate up", "the plate held up, a smile"]})
sc("S42", "A3", f"sits at the long plank table with {NOTE} and {BOOK} beside it.", {
 "c122": ["taps the old notebook", "his hand on the notebook"], "c123": ["holds up the printed cookbook", "the cookbook beside his face"]})
sc("S43", "A3", f"stands at the long plank table with {BOOK} open in front of him.", {
 "c124": ["turns a page and taps it", "his finger on the page"], "c125": ["flips through the pages", "the pages fanning"],
 "c126": ["points below the camera, then at the camera", "his finger pointing at the camera"]})
sc("S44", "A1", f"stands at the black range hanging {SK} back on its hook.", {
 "c127": ["counts on his fingers", "fingers counting"]})
sc("S45", "A4", "stands by the deep window at dawn with a tin cup of coffee, the corral outside.", {
 "c128": ["raises the cup", "a warm smile"], "c129": ["tips his hat", "waving goodbye"]})
STOCK = {"c17": "cracking egg", "c18": "egg white cooking", "c19": "egg stuck pan", "c22": "frying egg oil", "c52": "broken yolk",
 "c60": "sheet pan oven", "c61": "baked eggs", "c62": "eggs skillet", "c64": "egg aisle", "c65": "brown white eggs",
 "c66": "chickens pasture", "c67": "egg carton", "c68": "egg glass water", "c70": "eggs refrigerator", "c71": "egg carton fridge",
 "c77": "breakfast plate", "c78": "refried beans", "c79": "corn tortillas", "c80": "breakfast hash", "c83": "dozen eggs",
 "c85": "campfire skillet", "c86": "campfire coals", "c87": "campfire cooking", "c93": "tortilla comal", "c94": "heating tortilla",
 "c95": "tortillas towel", "c97": "tomatoes jalapeno", "c98": "charred tomatoes", "c99": "salsa jar", "c105": "fresh eggs",
 "c106": "boiled eggs", "c107": "peeling egg", "c111": "storm night", "c112": "rain fire", "c115": "scrambled eggs",
 "c116": "scrambling eggs pan", "c120": "rice and eggs"}
STOCK2 = {"c17": "egg bowl", "c18": "frying egg", "c19": "burnt egg", "c22": "fried egg pan", "c52": "egg yolk",
 "c60": "oven tray", "c61": "eggs oven", "c62": "fried eggs", "c64": "grocery eggs", "c65": "eggs basket",
 "c66": "free range hens", "c67": "eggs box", "c68": "egg float test", "c70": "fridge eggs", "c71": "eggs fridge",
 "c77": "mexican breakfast", "c78": "beans skillet", "c79": "tortillas", "c80": "potato hash", "c83": "eggs carton",
 "c85": "cast iron fire", "c86": "hot coals", "c87": "camp cooking", "c93": "tortillas pan", "c94": "tortilla",
 "c95": "warm tortillas", "c97": "tomatoes onion", "c98": "roasting vegetables", "c99": "salsa", "c105": "eggs",
 "c106": "hard boiled eggs", "c107": "egg shell", "c111": "thunderstorm", "c112": "fire rain", "c115": "scrambled egg",
 "c116": "cooking eggs", "c120": "fried rice egg"}
js = "export const ESC = {\n" + "\n".join(f'  {k}: {{ set: "{v["set"]}",{" rusty: true," if v["rusty"] else ""} base: {json.dumps(v["base"])},\n    clips: {{\n' + ",\n".join(f"      {c}: {json.dumps(a)}" for c, a in v["clips"].items()) + " } }," for k, v in E.items()) + "\n};\n"
js += "export const STOCK = " + json.dumps(STOCK, indent=1) + ";\nexport const STOCK2 = " + json.dumps(STOCK2, indent=1) + ";\nexport const DET = {};\nexport const TOPIC = \"fried eggs\";\n"
open("D:/Proyectos/video2-wt/cveggs/vlog/cveggs/escenas.mjs", "w", encoding="utf8").write(js)
segs = json.load(open("D:/Proyectos/video2-wt/cveggs/vlog/cveggs/segs.json", encoding="utf8"))
have = {c for v in E.values() for c in v["clips"]} | set(STOCK)
print(len(E), "escenas", sum(len(v["clips"]) for v in E.values()), "clips ·", len(STOCK), "stock · faltan", [s["id"] for s in segs if s["id"] not in have])
