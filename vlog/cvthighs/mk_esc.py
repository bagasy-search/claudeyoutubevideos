# escenas.mjs de cvthighs (formato híbrido): ESC = dirección por clip hablado [acción, cuadro final]; STOCK/STOCK2 = Pexels (2-3 palabras).
#   python vlog/cvthighs/mk_esc.py
import json
SK = "a big black twelve-inch cast-iron skillet"
RAW = "eight raw bone-in skin-on chicken thighs"
CRISP = "bone-in chicken thighs with deep golden crackling skin"
SAUCE = "dark red chile sauce"
NOTE = "an old stained crew notebook"
BOOK = "a thick printed cookbook with a worn brown cover"
E = {}
def sc(k, st, base, clips, rusty=False): E[k] = dict(set=st, base=base, clips=clips, rusty=rusty)
sc("S00", "A3", f"stands at the long plank table lifting one of the {CRISP} with a fork from {SK}.", {
 "c01": ["lifts the thigh and taps the skin with the fork, it cracks", "the crisp thigh held up on the fork, he looks at the camera"]})
sc("S01", "A1", f"stands at the black range beside {SK} sitting cold on the burner.", {
 "c02": ["points at the skillet", "his finger pointing at the skillet"], "c03": ["points back over his shoulder with his thumb", "his thumb pointing back"],
 "c04": ["holds up one raw chicken thigh", "the thigh held up beside his face"], "c08": ["shakes his head", "a slow head shake"],
 "c09": ["holds a flat hand over the cold skillet", "his hand flat over the cold pan"], "c10": ["draws a circle around the pan with his finger", "his finger circling"],
 "c11": ["touches his chest and smiles", "his hand on his chest"]})
sc("S02", "A2", f"stands in front of the wall of hanging cast-iron skillets lifting {SK} off its hook.", {
 "c12": ["lifts the heavy skillet down with both hands", "the skillet held at chest height"]})
sc("S03", "A3", f"stands at the long plank table with {RAW} on a wooden board.", {
 "c14": ["lifts the skin edge of a thigh with a fingertip", "the loose skin edge lifted, the fat layer under it"],
 "c16": ["shakes his head", "a sour face"], "c17": ["lays a flat hand over the thighs", "his hand flat"], "c18": ["taps his wrist where a watch would be", "his finger on his wrist, a patient smile"]})
sc("S04", "A3", f"sits at the long plank table with {NOTE} open in front of him.", {
 "c19": ["taps the notebook and laughs", "a laugh, his hand on the notebook"]})
sc("S05", "A3", "stands at the long plank table beside an old enamel sink, shaking his head, a plate of raw chicken thighs beside him.", {
 "c20": ["wags his finger at the sink", "his finger raised"], "c22": ["pats a thigh dry with a paper towel", "the crumpled towel tossed aside"]})
sc("S06", "A3", f"stands at the long plank table pressing paper towels on {RAW} on a board.", {
 "c23": ["presses the towels down on the skin", "the skin dry and matte"], "c24": ["holds up a damp paper towel", "the damp towel held up"]})
sc("S07", "A3", f"stands at the long plank table beside {RAW} on a wire rack over a plate, salted and peppered.", {
 "c26": ["touches the dry skin with a fingertip", "his fingertip on the dry skin"]})
sc("S08", "A3", f"stands at the long plank table trimming a flap of skin off a raw chicken thigh with kitchen scissors.", {
 "c27": ["lifts the hanging flap of skin", "the flap held up"], "c28": ["snips the flap off and pats the skin flat", "the skin lying flat on the thigh"]})
sc("S09", "A1", f"stands at the black range laying {RAW} skin side down in {SK} on the unlit burner.", {
 "c29": ["lays a thigh skin side down in the cold pan", "the thighs skin down in the cold pan"], "c30": ["fits the last thigh in snug", "eight thighs packed in the skillet"]})
sc("S10", "A1", f"stands at the black range turning the burner knob under {SK} full of chicken thighs.", {
 "c31": ["turns the knob to medium", "a low blue flame, his hand on the knob"]})
sc("S11", "A1", f"stands at the black range beside {SK} of chicken thighs skin side down, the fat starting to melt around them.", {
 "c32": ["steps back from the stove with his hands raised", "his hands off, stepping back"]})
sc("S12", "A1", f"stands at the black range beside {SK} of sizzling chicken thighs in their own melted fat, a kitchen timer in his hand.", {
 "c33": ["sets the timer and keeps his hands away", "the timer on the counter"], "c34": ["turns the knob down a little", "his hand on the knob"],
 "c35": ["listens to the pan with his head tilted", "head tilted, listening"]})
sc("S13", "A4", "stands by the deep window in the afternoon light, hens scratching in the yard outside.", {
 "c39": ["nods and smiles", "a warm smile"]})
sc("S14", "A1", f"stands at the black range lifting one of the {CRISP} from {SK} with metal tongs.", {
 "c40": ["lifts a thigh to show the golden skin", "the deep golden skin facing the camera"], "c41": ["sets it back down", "the tongs resting on the pan"]})
sc("S15", "A1", f"stands at the black range flipping {CRISP} skin side up in {SK} with tongs.", {
 "c42": ["flips the thighs one by one", "all the thighs skin side up"]})
sc("S16", "A1", f"stands at the black range tipping {SK} to pour the golden chicken fat into a tin can, holding the thighs back with tongs.", {
 "c43": ["pours the fat into the can", "the can of golden fat on the counter"], "c44": ["holds up the can of fat", "the can held up, a grin"]})
sc("S17", "A1", f"stands at the black range dropping sliced onion in around {CRISP} in {SK}.", {
 "c45": ["scatters the onion between the thighs", "onion slices softening around the chicken"]})
sc("S18", "A3", f"stands at the long plank table holding a glass jar of {SAUCE}.", {
 "c46": ["holds the jar up to the window light", "the dark red jar held up"]})
sc("S20", "A1", f"stands at the black range pouring {SAUCE} from a jar into the spaces between {CRISP} in {SK}.", {
 "c52": ["pours the sauce carefully around the thighs", "red sauce between the thighs, the skin still dry"], "c53": ["points at the dry crisp skin above the sauce", "his finger pointing at the skin"]})
sc("S21", "A1", f"stands at the black range over {SK} of {CRISP} sitting in gently bubbling {SAUCE}.", {
 "c54": ["turns the knob down to medium-low", "the sauce barely bubbling"]})
sc("S22", "A1", f"stands at the black range pushing a digital thermometer into the thickest part of a chicken thigh in {SK} of red sauce.", {
 "c55": ["reads the thermometer", "the thermometer close to the camera"], "c56": ["holds up one finger", "one finger raised"],
 "c57": ["nods at the thermometer", "a satisfied nod"]})
sc("S23", "A3", f"stands at the long plank table sprinkling chopped cilantro over {SK} of {CRISP} in {SAUCE}.", {
 "c58": ["sprinkles the cilantro", "green cilantro over the chicken"]})
sc("S24", "A3", f"stands at the long plank table cutting into one of the {CRISP} on a plate with red sauce.", {
 "c59": ["cuts through the skin, it cracks, and pulls the meat off the bone", "juicy meat off the bone, sauce on the plate"]})
sc("S25", "A3", f"stands at the long plank table beside {SK} of {CRISP} in red sauce, waving someone over.", {
 "c60": ["waves toward the door", "his hand waving"]}, rusty=True)
sc("S26", "A3", f"stands at the long plank table beside {SK} of {CRISP} in red sauce.", {
 "c61": ["watches Rusty bite into a thigh held in his hand, grinning", "Rusty chewing, Claudio grinning"]}, rusty=True)
sc("S27", "A4", "stands by the deep window at dusk, telling a story.", {
 "c62": ["looks up at the ceiling like listening to rain", "looking up"], "c64": ["laughs", "a big laugh"]})
sc("S28", "A3", f"stands at the long plank table with a plate of {CRISP} in red sauce, beans and warm tortillas.", {
 "c66": ["sets a small bowl of slaw beside the plate", "the full plate in front of him"]})
sc("S29", "A1", "stands at the black range wiping metal tongs with a kitchen towel.", {
 "c67": ["wipes the tongs and looks up", "the towel over his shoulder, a smile"]})
sc("S30", "A3", f"sits at the long plank table with {NOTE} open in front of him, a pencil in his hand.", {
 "c68": ["taps the pencil on the page", "the pencil on the page"], "c69": ["mimes a pan lifting off by itself", "his hand rising slowly"],
 "c70": ["turns an imaginary knob down", "his fingers turning"], "c71": ["wags a finger", "a finger wag"], "c72": ["holds up one finger", "one finger raised"]})
sc("S31", "A3", "stands at the long plank table holding a tray of raw bone-in skin-on chicken thighs wrapped in plastic.", {
 "c75": ["tilts the tray to look at the skin", "the tray tilted toward the camera"]})
sc("S32", "A3", f"stands at the long plank table beside a jar of green tomatillo salsa and {SK} of {CRISP}.", {
 "c76": ["holds up the jar of green salsa", "the green jar held up"], "c77": ["sets the jar down and smiles", "a smile"]})
sc("S33", "A3", "stands at the long plank table with leftover chicken thighs in a glass container.", {
 "c78": ["lifts the lid and shrugs", "the lid in his hand, a shrug"]})
sc("S34", "A1", f"stands at the black range laying leftover chicken thighs skin side down in a dry {SK}.", {
 "c79": ["lays the thighs skin side down", "the thighs in the dry pan"], "c80": ["spoons warm red sauce around a thigh on a plate", "sauce around the thigh, skin crisp"]})
sc("S35", "A3", "stands at the long plank table beside a baking dish of rolled tortillas covered in red sauce and melted cheese.", {
 "c83": ["sets the dish down and smiles", "the dish in front of him"]})
sc("S36", "A3", f"stands at the long plank table with a package of chicken thighs, a can of red sauce, half an onion and cilantro in a row.", {
 "c84": ["touches each item in the row", "his hand at the end of the row"], "c85": ["holds up four fingers", "four fingers raised"]})
sc("S37", "A1", "stands at the black range beside two cast-iron skillets of chicken thighs and a sheet pan lined with foil.", {
 "c87": ["slides the sheet pan into the oven", "the oven door closed"], "c88": ["stirs a small pot of red sauce", "the sauce pot steaming"]})
sc("S38", "A1", "stands at the black range beside a small ten-inch cast-iron skillet with four chicken thighs.", {
 "c89": ["holds up four fingers", "four fingers raised"]})
sc("S40", "A2", "stands in front of the wall of hanging cast-iron skillets, answering questions.", {
 "c94": ["holds his thumb and finger close together", "a small pinch"], "c95": ["holds up one finger", "one finger raised"], "c96": ["holds up a small jar of golden chicken fat", "the jar held up"]})
sc("S41", "A3", "stands at the long plank table separating a raw chicken leg quarter at the joint with a big knife.", {
 "c98": ["bends the leg to show the joint", "the joint line showing"], "c100": ["sets the thigh and drumstick side by side", "two pieces on the board"]})
sc("S42", "A3", "stands at the long plank table with a dry sliced chicken breast beside a juicy chicken thigh on a board.", {
 "c101": ["presses the dry breast with a fork", "the dry breast crumbling"], "c102": ["lifts the juicy thigh", "the thigh held up"], "c103": ["smiles and shrugs", "a smile"]})
sc("S43", "A1", "stands at the black range beside a small jar of golden chicken fat and a skillet of potatoes frying in it.", {
 "c105": ["spoons a little fat into the skillet", "the potatoes sizzling"]})
sc("S44", "A3", "stands at the long plank table holding a boneless skinless chicken thigh.", {
 "c106": ["shows the boneless thigh and shrugs", "a shrug"], "c107": ["holds up three fingers", "three fingers raised"]})
sc("S45", "A4", "stands by the deep window in the afternoon light, telling a story.", {
 "c108": ["smiles softly, remembering", "a soft smile"], "c109": ["shakes his head at himself", "a sheepish laugh"],
 "c110": ["mimes taking a skillet off the wall", "his hands raised"], "c111": ["puts his hand on his heart", "his hand on his heart"]})
sc("S46", "A3", "stands at the long plank table reading the date on a package of raw chicken thighs.", {
 "c113": ["tilts the package to show the liquid", "the package tilted"], "c114": ["sets the package on a plate", "the package on a plate"]})
sc("S47", "A3", "stands at the long plank table with two cutting boards, one with raw chicken, one with an onion.", {
 "c117": ["moves the onion board away from the chicken board", "the two boards apart"]})
sc("S48", "A1", f"stands at the black range pouring a splash of water into {SK} with brown bits, steam rising.", {
 "c118": ["scrapes the bottom with a wooden spoon", "the brown bits loosened"], "c119": ["pours the red sauce into the pan", "the sauce turning dark"]})
sc("S49", "A3", f"stands at the long plank table with a plate of {CRISP} with lime wedges, no sauce.", {
 "c121": ["picks up a thigh with his hand and bites, it crunches", "chewing, grinning"]})
sc("S50", "A3", f"sits at the long plank table with {NOTE} and {BOOK} beside it.", {
 "c122": ["holds up the printed cookbook", "the cookbook beside his face"]})
sc("S51", "A3", f"stands at the long plank table with {BOOK} open in front of him.", {
 "c123": ["turns a page and taps it", "his finger on the page"], "c124": ["closes the book and pats it", "his hand on the book"],
 "c125": ["points below the camera, then at the camera", "his finger pointing at the camera"]})
sc("S52", "A1", f"stands at the black range beside {SK}, a handful of fresh green beans in his hand.", {
 "c126": ["counts on his fingers", "fingers counting"], "c127": ["holds up the green beans and waves goodbye", "waving, smiling"]})
STOCK = {"c05": "frying chicken", "c06": "oil splatter", "c07": "chicken skin", "c13": "raw chicken thighs", "c15": "chicken thighs skillet",
 "c21": "washing chicken", "c25": "seasoning chicken", "c36": "hens yard", "c37": "backyard chickens", "c38": "stew pot", "c47": "enchilada sauce",
 "c48": "dried chiles", "c49": "toasting chiles", "c50": "blender sauce", "c51": "pouring red sauce", "c63": "campfire rain", "c65": "rice beans",
 "c73": "grocery chicken", "c74": "raw chicken thighs", "c81": "shredded chicken", "c82": "enchiladas", "c86": "roast chicken oven",
 "c90": "campfire skillet", "c91": "cooking over fire", "c92": "chicken drumsticks", "c93": "chicken breast", "c97": "chicken legs",
 "c99": "cutting chicken", "c104": "pouring oil jar", "c112": "meat package", "c115": "raw chicken board", "c116": "chopping onion", "c120": "squeezing lime"}
STOCK2 = {"c05": "chicken oil", "c06": "hot oil", "c07": "fried chicken", "c13": "raw chicken", "c15": "frying chicken skin",
 "c21": "kitchen sink", "c25": "salt pepper", "c36": "chickens farm", "c37": "hens", "c38": "simmering pot", "c47": "red sauce",
 "c48": "chili peppers", "c49": "dry chiles pan", "c50": "blender", "c51": "tomato sauce", "c63": "campfire night", "c65": "tortillas",
 "c73": "meat aisle", "c74": "chicken thighs", "c81": "pulled chicken", "c82": "baking enchiladas", "c86": "baked chicken",
 "c90": "cast iron fire", "c91": "campfire pan", "c92": "drumsticks pan", "c93": "raw chicken breast", "c97": "chicken leg quarters",
 "c99": "butchering chicken", "c104": "strainer", "c112": "grocery store", "c115": "cutting raw chicken", "c116": "onion", "c120": "lime"}
js = "export const ESC = {\n" + "\n".join(f'  {k}: {{ set: "{v["set"]}",{" rusty: true," if v["rusty"] else ""} base: {json.dumps(v["base"])},\n    clips: {{\n' + ",\n".join(f"      {c}: {json.dumps(a)}" for c, a in v["clips"].items()) + " } }," for k, v in E.items()) + "\n};\n"
js += "export const STOCK = " + json.dumps(STOCK, indent=1) + ";\nexport const STOCK2 = " + json.dumps(STOCK2, indent=1) + ";\nexport const DET = {};\nexport const TOPIC = \"chicken thighs\";\n"
open("D:/Proyectos/video2-wt/cvthighs/vlog/cvthighs/escenas.mjs", "w", encoding="utf8").write(js)
print(len(E), "escenas", sum(len(v["clips"]) for v in E.values()), "clips ·", len(STOCK), "stock")
