# escenas.mjs de cvsteak (formato híbrido): ESC = dirección por clip hablado [acción, cuadro final]; STOCK/STOCK2 = Pexels (2-3 palabras).
# c103-c104 (descongelar, repite y contradice c99) se CORTAN en cortes.json (ver cortar_c103.py): van a stock barato.
#   python vlog/cvsteak/mk_esc.py
import json
SK = "a big black twelve-inch cast-iron skillet"
RIB = "a thick raw ribeye steak an inch and a half thick, deep red with white streaks of marbling and a strip of fat along the edge"
CRUST = "a thick ribeye steak with a dark brown crackling crust"
SLICED = "a sliced ribeye steak on a wooden cutting board, the slices pink from edge to edge under a dark brown crust"
BOOK = "a thick printed cookbook with a worn brown cover"
NOTE = "an old stained crew notebook"
THERMO = "a small digital meat thermometer"
E = {}
def sc(k, st, base, clips, rusty=False): E[k] = dict(set=st, base=base, clips=clips, rusty=rusty)
TALK = lambda a, b: [a, b]
sc("S00", "A3", f"stands at the long plank table behind {SLICED}, a knife in his hand.", {
 "c01": ["lifts one pink slice with the knife tip toward the camera", "the pink slice held up on the knife, he looks at the camera"]})
sc("S01", "A1", f"stands at the black range holding {SK} up with both hands.", {
 "c02": ["raises the skillet a little toward the camera", "the skillet held at chest height"],
 "c03": ["sets the skillet on the burner and taps its rim", "his hand on the skillet rim"],
 "c04": ["holds up one finger", "one finger raised, eyebrows up"],
 "c05": ["shrugs with both hands open", "both hands open, a doubtful face"],
 "c06": ["shows a small gap between thumb and finger", "thumb and finger apart, a sour face"],
 "c07": ["shakes his head slowly", "a slow head shake"],
 "c08": ["rubs his thumb against his fingers like counting money", "his fingers rubbed together, eyebrows up"],
 "c09": ["spreads his hands flat, edge to edge", "both hands spread wide"],
 "c10": ["makes a small fist and smiles", "a closed fist, a confident smile"],
 "c11": ["taps the skillet and touches his chest", "his hand on his chest, a warm smile"],
 "c12": ["points out the window toward the corral", "his arm pointing outside, a serious look"]})
sc("S02", "A3", f"stands at the long plank table with {RIB} on a wooden cutting board.", {
 "c16": ["draws a slow circle in the air over the steak", "his hand open over the steak"],
 "c17": ["claps his hands once, quick", "both hands together, a grin"],
 "c18": ["mimes slow with a flat hand, then fast with a quick flick", "his hand flicked, a grin"]})
sc("S03", "A3", f"sits at the long plank table with {NOTE} open in front of him.", {
 "c19": ["turns a page of the notebook", "the notebook open, he looks up"],
 "c20": ["laughs and waves a hand at the door", "a big laugh, his hand open"]})
sc("S04", "A3", f"stands at the long plank table holding {RIB} flat on his open palm.", {
 "c21": ["holds the steak up edge-on to show its thickness", "the thick steak held edge-on near the camera"],
 "c22": ["holds his thumb and finger apart beside the steak edge", "his fingers measuring the thickness"]})
sc("S05", "A3", f"stands at the long plank table sprinkling coarse kosher salt from his fingers over {RIB} on a cutting board.", {
 "c25": ["sprinkles salt over the steak from high up", "white salt crystals all over the red steak"]})
sc("S06", "A3", f"stands at the long plank table beside {RIB} sitting on a wire rack over a white plate, its surface salted.", {
 "c27": ["points at the beads of wet juice on the salted steak", "his finger pointing at the shiny wet surface"],
 "c28": ["touches the dry surface of the steak with a fingertip", "his fingertip on the dry dark-red surface"],
 "c29": ["taps the rack and nods", "a knowing nod"]})
sc("S07", "A1", f"stands at the black range beside {RIB} on a wire rack over a sheet pan, a pepper grinder in his hand.", {
 "c30": ["turns the oven dial on the old range", "his hand on the oven dial"],
 "c31": ["grinds black pepper over the steak", "coarse black pepper on the steak"]})
sc("S08", "A1", "crouches at the open oven door of the black range sliding a sheet pan with a ribeye on a wire rack inside.", {
 "c32": ["slides the pan in and closes the oven door", "the oven door shut, his hand on the handle"]})
sc("S09", "A1", f"stands at the black range holding {THERMO} near {RIB} on a wire rack.", {
 "c33": ["pushes the thermometer probe into the side of the steak", "the thermometer sticking out of the steak side"],
 "c34": ["points at the thickest part of the steak", "his finger on the center of the steak"]})
sc("S10", "A4", "stands by the deep window in the afternoon light, talking seriously.", {
 "c35": ["puts his hand on his chest", "his hand on his chest, an honest look"],
 "c36": ["holds up one finger", "one finger raised"],
 "c37": ["opens his hands toward the camera", "both hands open, your call"],
 "c38": ["nods slowly", "a slow nod, a serious look"]})
sc("S11", "A4", "stands by the deep window in the afternoon light, telling a story.", {
 "c39": ["looks out the window, remembering", "looking out at the corral"],
 "c40": ["covers his face with one hand and laughs", "a sheepish laugh"],
 "c41": ["mimes chewing slowly with a straight face", "a deadpan face"],
 "c42": ["holds up two fingers, slow then fast", "two fingers raised, a proud smile"]})
sc("S12", "A1", f"stands at the black range reading {THERMO} stuck in a ribeye on a sheet pan just out of the oven.", {
 "c43": ["leans in and reads the thermometer", "the thermometer close to the camera, he nods"]})
sc("S13", "A1", f"stands at the black range over {SK} on a high flame, a thin wisp of smoke rising from it.", {
 "c45": ["waves the smoke away and points at the window", "his finger pointing at the window, a grin"]})
sc("S14", "A1", f"stands at the black range dropping a spoon of white lard into {SK} on a high flame.", {
 "c46": ["drops the lard in, it melts and shimmers", "the shiny melted fat smoking in the skillet"]})
sc("S17", "A1", f"stands at the black range holding {CRUST} on its side with metal tongs, the fat edge pressed into {SK}.", {
 "c49": ["holds the steak on its fat edge in the pan", "the fat edge sizzling golden against the pan"],
 "c50": ["sets the steak down flat and points at the golden fat edge", "his finger pointing at the crisp golden edge"]})
sc("S18", "A1", f"stands at the black range dropping butter, smashed garlic cloves and a rosemary sprig into {SK} beside {CRUST}.", {
 "c51": ["drops the butter and garlic into the pan", "butter melting around the garlic and rosemary"]})
sc("S19", "A1", f"stands at the black range tilting {SK} toward himself, a big spoon in his hand, {CRUST} in foaming butter.", {
 "c53": ["spoons foaming butter over the steak again and again", "the steak glossy with brown butter"]})
sc("S20", "A3", f"stands at the long plank table beside {CRUST} resting on a wooden cutting board.", {
 "c54": ["sets the tongs down and holds up five fingers", "five fingers raised beside the resting steak"],
 "c55": ["points at the steak and smiles", "his finger pointing at the steak"]})
sc("S23", "A1", f"stands at the black range holding a chipped enamel coffee pot over {SK} with garlic and brown bits in it.", {
 "c59": ["tips most of the fat out of the skillet into a tin can", "the skillet with garlic and brown bits, the can set aside"],
 "c60": ["pours black coffee into the hot skillet, steam bursts up", "a cloud of steam over the dark liquid"],
 "c61": ["scrapes the bottom of the skillet with a wooden spoon", "dark glossy sauce bubbling in the skillet"],
 "c63": ["spoons the dark sauce over pink steak slices on a board", "the slices glossy with dark sauce"]})
sc("S24", "A3", f"stands at the long plank table beside {SLICED}, waving someone over.", {
 "c64": ["waves toward the door", "his hand waving, looking off to the side"]}, rusty=True)
sc("S25", "A3", f"stands at the long plank table beside {SLICED}.", {
 "c65": ["watches Rusty chew a slice with his eyes closed, smiling", "Rusty chewing with eyes closed, Claudio grinning"]}, rusty=True)
sc("S26", "A1", f"stands at the black range wiping out {SK} with a paper towel.", {
 "c66": ["wipes the skillet and looks up at the camera", "the clean skillet, a warm smile"]})
sc("S27", "A3", f"sits at the long plank table with {NOTE} open in front of him, a pencil in his hand.", {
 "c67": ["taps the pencil on the notebook", "the pencil tapping the page"],
 "c68": ["holds up one finger", "one finger raised"],
 "c69": ["holds up a small digital meat thermometer", "the thermometer held up beside his face"],
 "c70": ["waves at imaginary smoke and laughs", "a laugh, his hand waving"],
 "c71": ["draws a line across his palm with a finger", "his finger across his palm"]})
sc("S28", "A3", f"sits at the long plank table writing on a small card with a pencil, {THERMO} beside it.", {
 "c72": ["writes numbers on the card", "the card with pencil numbers"],
 "c73": ["holds up the card toward the camera", "the handwritten card held up"]})
sc("S29", "A1", f"stands at the black range rubbing a little oil into {SK} with a paper towel, the skillet on a low flame.", {
 "c74": ["scrubs the skillet with a stiff brush under hot water at the sink", "the clean black skillet dripping"],
 "c75": ["sets the wet skillet on the burner, the water steams off", "the skillet dry on the burner"],
 "c76": ["rubs oil inside the skillet with a paper towel", "the skillet shiny and black"],
 "c77": ["holds up the shiny skillet proudly", "the black skillet held up, a proud smile"]})
sc("S30", "A3", f"stands at the long plank table with three raw steaks on a board: a ribeye, a leaner sirloin and a smaller chuck-eye steak.", {
 "c78": ["points at the leaner sirloin", "his finger on the sirloin"],
 "c79": ["lifts the small chuck-eye steak and shows it", "the chuck-eye held up beside his face"],
 "c80": ["sets it down and taps it twice", "his hand on the chuck-eye, nodding"]})
sc("S34", "A3", f"stands at the long plank table with {RIB}, a stick of butter, a garlic head, a rosemary sprig and a tin of lard lined up in a row.", {
 "c88": ["touches each ingredient in the row", "his hand at the end of the row"],
 "c89": ["holds up three fingers", "three fingers raised"],
 "c90": ["shrugs and smiles", "a satisfied smile"]})
sc("S35", "A1", "crouches at the open oven of the black range checking one of three steaks on wire racks with a digital thermometer.", {
 "c92": ["lifts one steak out with tongs onto a plate", "a steak on the plate, the others still in the oven"]})
sc("S37", "A3", f"sits at the long plank table beside {SK}, answering questions.", {
 "c99": ["holds up two fingers", "two fingers raised"],
 "c100": ["tilts his hand side to side", "his hand flat, a shrug"]})
sc("S38", "A3", "stands at the long plank table with a thin steak beside a thick ribeye on a wooden board.", {
 "c101": ["holds the thin steak up next to the thick one", "two steaks side by side, the thin one in his hand"],
 "c102": ["sets the thin steak down and holds up two fingers", "two fingers raised"]})
sc("S40", "A3", "stands at the long plank table with two raw steaks side by side on a board, one darker and leaner with yellowish fat.", {
 "c107": ["points at the leaner darker steak", "his finger pointing at the lean steak"]})
sc("S41", "A3", f"stands at the long plank table beside {RIB} on a wire rack, shaking his head.", {
 "c109": ["shakes his head and wags a finger", "a finger wag"],
 "c110": ["mimes sliding a pan into an oven", "his hands pushing forward"]})
sc("S42", "A4", "stands by the deep window in the afternoon light, telling a story.", {
 "c111": ["holds up four fingers", "four fingers raised"],
 "c112": ["shakes his head, ashamed", "a sheepish look down"],
 "c113": ["puts his own hand on his shoulder", "his hand on his shoulder, a grateful look"]})
sc("S43", "A3", "stands at the long plank table beside a raw steak, pressing his palm with a finger.", {
 "c114": ["presses the base of his thumb with a finger", "his finger on his palm"],
 "c115": ["shakes his head and laughs", "a laugh"],
 "c116": ["holds up a small digital meat thermometer", "the thermometer held up"]})
sc("S44", "A1", f"stands at the black range beside two black cast-iron skillets, one with one small steak, the other with two steaks with space between them.", {
 "c118": ["moves one steak from the crowded pan to the other", "each pan with space between the steaks"]})
sc("S45", "A3", "stands at the long plank table beside a small cast-iron skillet with pink steak slices and a little water, its lid in his hand.", {
 "c120": ["puts the lid on the skillet", "the lid on, his hand on top"],
 "c121": ["lifts the lid and shows the pink slices", "the pink slices in the pan"]})
sc("S46", "A3", f"stands at the long plank table holding metal tongs, {CRUST} on a board.", {
 "c123": ["holds up the tongs and shakes his head at a fork", "the tongs up, a fork set aside"]})
sc("S47", "A3", f"sits at the long plank table with {NOTE} and {BOOK} beside it.", {
 "c124": ["turns a page of the notebook and smiles", "his hand on the notebook"],
 "c125": ["holds up the printed cookbook", "the cookbook held up next to his face"]})
sc("S48", "A3", f"stands at the long plank table with {BOOK} open in front of him.", {
 "c126": ["turns a page and taps it", "his finger on the open page"],
 "c127": ["closes the book and pats the cover", "his hand flat on the closed book"],
 "c128": ["points down below the camera, then at the camera", "his finger pointing at the camera"]})
sc("S49", "A1", f"stands at the black range beside {SK}, a green cabbage on the table beside him.", {
 "c129": ["counts on his fingers", "his fingers counting"],
 "c130": ["picks up the cabbage and holds it up", "the cabbage held up, a grin"],
 "c131": ["waves goodbye with the cabbage in one hand", "waving, smiling"]})
STOCK = {"c13": "steak frying pan", "c14": "grilled steak", "c15": "thick steak", "c23": "marbled beef", "c24": "ribeye steak", "c26": "salting steak",
 "c44": "cast iron pan", "c47": "steak searing", "c48": "seared steak", "c52": "basting steak", "c56": "slicing steak", "c57": "cutting meat",
 "c58": "medium rare steak", "c62": "coffee pot", "c81": "butcher shop", "c82": "meat counter", "c83": "steakhouse dinner", "c84": "frying eggs",
 "c85": "breakfast taco", "c86": "cowboy breakfast", "c87": "steak salad", "c91": "steaks oven", "c93": "campfire", "c94": "campfire coals",
 "c95": "dutch oven", "c96": "campfire cooking", "c97": "grilling steak", "c98": "grill marks", "c103": "frozen meat", "c104": "oven steak",
 "c105": "cattle grazing", "c106": "cattle feedlot", "c108": "raw steak", "c117": "cast iron steak", "c119": "steak sandwich", "c122": "tongs steak"}
STOCK2 = {"c13": "pan seared steak", "c14": "steak grill", "c15": "raw beef", "c23": "beef marbling", "c24": "raw ribeye", "c26": "seasoning meat",
 "c44": "hot skillet", "c47": "sizzling steak", "c48": "steak crust", "c52": "butter steak", "c56": "steak knife", "c57": "carving beef",
 "c58": "steak slices", "c62": "pouring coffee", "c81": "butcher", "c82": "butcher meat", "c83": "steak restaurant", "c84": "steak eggs",
 "c85": "tortilla", "c86": "cowboys", "c87": "beef salad", "c91": "roasting meat", "c93": "camp fire", "c94": "embers",
 "c95": "campfire pot", "c96": "cooking fire", "c97": "barbecue steak", "c98": "steak grill", "c103": "freezer", "c104": "meat thermometer",
 "c105": "cows pasture", "c106": "beef cattle", "c108": "beef steak", "c117": "steak pan", "c119": "beef sandwich", "c122": "kitchen tongs"}
js = "export const ESC = {\n" + "\n".join(f'  {k}: {{ set: "{v["set"]}",{" rusty: true," if v["rusty"] else ""} base: {json.dumps(v["base"])},\n    clips: {{\n' + ",\n".join(f"      {c}: {json.dumps(a)}" for c, a in v["clips"].items()) + " } }," for k, v in E.items()) + "\n};\n"
js += "export const STOCK = " + json.dumps(STOCK, indent=1) + ";\nexport const STOCK2 = " + json.dumps(STOCK2, indent=1) + ";\nexport const DET = {};\nexport const TOPIC = \"steak\";\n"
open("D:/Proyectos/video2-wt/cvsteak/vlog/cvsteak/escenas.mjs", "w", encoding="utf8").write(js)
print(len(E), "escenas", sum(len(v["clips"]) for v in E.values()), "clips ·", len(STOCK), "stock")
