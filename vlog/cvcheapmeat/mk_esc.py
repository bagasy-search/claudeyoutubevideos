# escenas.mjs de cvcheapmeat (formato híbrido): ESC = dirección por clip hablado [acción, cuadro final]; STOCK/STOCK2 = Pexels (2-3 palabras).
#   python vlog/cvcheapmeat/mk_esc.py
import json
DO = "a heavy black dented cast-iron Dutch oven"
BRAISE = "dark braised beef chunks falling apart in a thick dark sauce with potatoes and carrots"
RAW = "big three-inch chunks of raw beef chuck and two cross-cut beef shanks with the round bone"
NOTE = "an old stained crew notebook"
BOOK = "a thick printed cookbook with a worn brown cover"
E = {}
def sc(k, st, base, clips, rusty=False): E[k] = dict(set=st, base=base, clips=clips, rusty=rusty)
sc("S00", "A3", f"stands at the long plank table pressing a fork into {BRAISE} in {DO}.", {
 "c01": ["presses the fork, the beef falls apart", "the beef pulled apart on the fork"]})
sc("S01", "A3", "stands at the long plank table holding up a raw cross-cut beef shank with the round bone, butcher paper on the table.", {
 "c02": ["holds the shank up beside his face", "the shank held up"], "c03": ["taps the shank with a fork", "the fork on the shank"],
 "c04": ["sets the shank down on the paper", "his hand on the paper"], "c05": ["points at the camera", "his finger pointing"],
 "c06": ["holds up a raw chuck roast", "the chuck roast held up"], "c07": ["shakes his head", "a sour face"],
 "c08": ["mimes chewing and chewing", "a tired chew"], "c09": ["wags a finger", "a finger wag"],
 "c10": ["spreads his hands over the cheap cuts", "his hands over the meat"], "c11": ["shakes his head with a little smile", "a sly smile"],
 "c12": ["holds up a brown bottle of dark beer", "the bottle held up"], "c13": ["touches his chest and smiles", "his hand on his chest"]})
sc("S02", "A2", f"stands in front of the wall of hanging cast-iron skillets lifting {DO} off its hook.", {
 "c14": ["lifts the heavy pot down with both hands", "the Dutch oven held at chest height"]})
sc("S03", "A3", f"stands at the long plank table with {RAW} on butcher paper.", {
 "c18": ["pulls a piece of beef apart to show the white gristle", "the white gristle between his fingers"], "c19": ["holds up one finger", "one finger raised"],
 "c22": ["shakes his head and smiles", "a knowing smile"]})
sc("S04", "A3", f"sits at the long plank table with {NOTE} open in front of him.", {
 "c23": ["taps his wrist where a watch would be", "his finger on his wrist"], "c24": ["taps the notebook and laughs", "a laugh, his hand on the notebook"]})
sc("S05", "A3", "stands at the long plank table cutting a raw beef chuck roast into big three-inch chunks with a big knife on a wooden board.", {
 "c27": ["scoops marrow out of a shank bone with a small spoon", "the spoon held up, a grin"]})
sc("S06", "A3", f"stands at the long plank table sprinkling kosher salt and black pepper over {RAW} on a tray.", {
 "c28": ["salts every piece from high up", "the meat salted all over"]})
sc("S07", "A1", f"stands at the black range laying chunks of raw beef into shimmering lard in {DO}, space between the pieces.", {
 "c29": ["lays the pieces in one by one, spaced apart", "five chunks spaced apart, sizzling"], "c30": ["turns a chunk with tongs to show a deep brown crust", "the dark brown side facing up"]})
sc("S08", "A1", f"stands at the black range lifting deeply browned beef chunks out of {DO} onto a plate with tongs.", {
 "c31": ["sets a browned chunk on the plate", "the plate of browned beef"], "c32": ["points at the dark crust", "his finger at the crust"]})
sc("S09", "A1", f"stands at the black range stirring sliced onion, garlic and torn dried ancho chiles in the brown drippings of {DO} with a wooden spoon.", {
 "c33": ["drops the torn chiles into the pot", "the chiles in with the onion"], "c34": ["scrapes the brown bits off the bottom with the spoon", "the bottom scraped clean"]})
sc("S10", "A3", "stands at the long plank table with a brown bottle of dark beer and a small bottle of cider vinegar.", {
 "c35": ["holds up the beer, then the vinegar", "both bottles on the table"]})
sc("S11", "A1", f"stands at the black range pouring dark beer from a bottle into {DO}, foam rising over the onions.", {
 "c36": ["pours the beer, it foams up", "the foam rising"], "c38": ["shakes his head and smiles", "a smile"], "c40": ["shrugs", "a shrug"]})
sc("S12", "A1", f"stands at the black range putting browned beef chunks back into {DO} of dark liquid.", {
 "c41": ["sets the chunks back in, the liquid halfway up the meat", "the meat half covered by the sauce"], "c42": ["holds his flat hand at the halfway mark", "his hand level"]})
sc("S13", "A1", f"stands at the black range sliding {DO} with its lid on into the open oven.", {
 "c43": ["pushes the pot into the oven", "the oven door closing"]})
sc("S14", "A1", "stands in front of the closed oven of the black range with his arms crossed.", {
 "c44": ["shakes his head, arms crossed", "arms crossed, stern"], "c45": ["points toward the door", "his finger pointing away"]})
sc("S15", "A4", "stands by the deep window at dusk, horses in the corral outside.", {
 "c46": ["looks out the window", "a serious face"], "c49": ["laughs", "a big laugh"]})
sc("S16", "A1", f"stands at the black range lifting the lid off {DO}, steam rising off dark braised beef.", {
 "c50": ["lifts the lid and breathes in the steam", "his eyes closed, smiling"], "c51": ["tucks halved potatoes and carrot chunks around the meat", "the vegetables tucked in"]})
sc("S17", "A4", "stands by the deep window with a tin cup of coffee in his hand.", {
 "c52": ["sips the coffee", "the cup lowered, a smile"]})
sc("S18", "A1", f"stands at the black range pushing a fork into a chunk of {BRAISE} in {DO}.", {
 "c53": ["twists the fork, the meat falls apart", "the meat apart on the fork"], "c54": ["puts the lid back on", "the lid on"]})
sc("S19", "A3", f"stands at the long plank table beside a deep bowl of {BRAISE}, steam rising.", {
 "c55": ["slides the bowl toward the camera", "the steaming bowl in front of him"]})
sc("S20", "A1", f"stands at the black range stirring dark sauce boiling down in {DO} on the burner.", {
 "c56": ["tastes the sauce from the spoon", "a nod"]})
sc("S21", "A3", f"stands at the long plank table beside a bowl of {BRAISE} and warm tortillas, waving someone over.", {
 "c57": ["waves toward the door", "his hand waving"]}, rusty=True)
sc("S22", "A3", f"stands at the long plank table beside a bowl of {BRAISE}.", {
 "c58": ["watches Rusty scoop beef with a folded tortilla, grinning", "Rusty eating, Claudio grinning"]}, rusty=True)
sc("S23", "A1", "stands at the black range wiping a wooden spoon with a kitchen towel.", {
 "c59": ["wipes the spoon and looks up", "the towel over his shoulder, a smile"]})
sc("S24", "A3", f"sits at the long plank table with {NOTE} open in front of him, a pencil in his hand.", {
 "c60": ["taps the pencil on the page", "the pencil on the page"], "c61": ["holds up two fingers", "two fingers raised"],
 "c62": ["holds his flat hand at a halfway mark", "his hand level"], "c63": ["wags a finger", "a finger wag"]})
sc("S26", "A3", "stands at the long plank table filling zip freezer bags with braised beef and dark sauce.", {
 "c69": ["presses the air out of a bag", "the flat bag on the table"]})
sc("S28", "A3", "stands at the long plank table with a chuck roast, a bottle of dark beer, an onion, two dried chiles, potatoes and carrots in a row.", {
 "c72": ["touches each item in the row", "his hand at the end of the row"], "c73": ["holds up six fingers", "six fingers raised"], "c74": ["holds up three fingers", "three fingers raised"]})
sc("S29", "A1", "stands at the black range beside two big cast-iron Dutch ovens on the burners.", {
 "c76": ["lifts one lid and smiles", "the lid in his hand"]})
sc("S30", "A1", f"stands at the black range beside {DO} of braised beef and two flat freezer bags.", {
 "c77": ["holds up the two freezer bags", "the bags held up"]})
sc("S32", "A2", "stands in front of the wall of hanging cast-iron skillets, answering questions.", {
 "c83": ["holds up two dried ancho chiles", "the chiles held up"]})
sc("S33", "A1", f"stands at the black range tipping {DO} and spooning orange fat off the top of the dark sauce.", {
 "c84": ["points at the layer of fat", "his finger at the fat"], "c85": ["spoons the fat off", "the spoon full of orange fat"],
 "c86": ["lifts a hard white disc of beef fat off a cold pot", "the white disc held up"]})
sc("S34", "A3", "stands at the long plank table holding up a fork with dry, stringy shreds of overcooked beef.", {
 "c87": ["shows the dry strings on the fork", "a sour face"], "c88": ["holds up three fingers", "three fingers raised"], "c89": ["wags a finger", "a finger wag"]})
sc("S35", "A3", "stands at the long plank table spooning leftover braised beef out of a big pot into three shallow glass containers.", {
 "c92": ["sets the lids on the containers", "three containers in a row"]})
sc("S36", "A4", "stands by the deep window in the afternoon light, telling a story.", {
 "c93": ["smiles, remembering", "a sheepish smile"], "c94": ["wags a finger the way the old man did", "a finger raised"],
 "c95": ["puts his hand on his heart", "his hand on his heart"], "c96": ["nods", "a nod"]})
sc("S37", "A3", "stands at the long plank table with raw beef cuts in a row on butcher paper: chuck roast, cross-cut shank, oxtail, short ribs.", {
 "c101": ["holds up a lean pale eye of round and shakes his head", "a head shake"]})
sc("S38", "A3", f"stands at the long plank table with a plate of braised beef over mashed potatoes, dark sauce poured over the top.", {
 "c104": ["sets a little dish of sliced onion and pickled jalapeños beside the plate", "the dish beside the plate"]})
sc("S40", "A3", "stands at the long plank table laying salted raw beef chunks on a wire rack over a plate.", {
 "c108": ["salts the chunks", "the salted meat on the rack"], "c109": ["slides the plate onto a fridge shelf", "the plate in the fridge"],
 "c110": ["pats a chunk dry with a paper towel", "the towel tossed aside"], "c111": ["holds up one finger", "one finger raised"]})
sc("S41", "A3", "stands at the long plank table dusting raw beef chunks with flour on a tray.", {
 "c113": ["shrugs and smiles", "a smile"], "c114": ["shakes off the extra flour", "the floured chunks"]})
sc("S42", "A1", f"stands at the black range lifting the lid of {DO} and looking at the liquid level.", {
 "c115": ["pours a little hot water into the pot", "the liquid halfway up the meat"], "c116": ["puts the lid back and walks off", "the lid on"]})
sc("S43", "A3", f"stands at the long plank table pushing a fork into a chunk of beef that won't give, {DO} open beside him.", {
 "c117": ["pushes the fork, it won't go in", "the fork stuck"], "c118": ["points at the oven behind him", "his thumb pointing back"],
 "c119": ["twists the fork in a tender chunk, it comes apart", "the meat apart"]})
sc("S44", "A3", f"sits at the long plank table with {NOTE} and {BOOK} beside it.", {
 "c120": ["taps the old notebook", "his hand on the notebook"], "c121": ["holds up the printed cookbook", "the cookbook beside his face"]})
sc("S45", "A3", f"stands at the long plank table with {BOOK} open in front of him.", {
 "c122": ["turns a page and taps it", "his finger on the page"], "c123": ["closes the book and pats it", "his hand on the book"],
 "c124": ["points below the camera, then at the camera", "his finger pointing at the camera"]})
sc("S46", "A1", "stands at the black range beside a cardboard carton of brown eggs and a small skillet.", {
 "c125": ["counts on his fingers", "fingers counting"], "c126": ["holds up an egg and waves goodbye", "waving, smiling"]})
STOCK = {"c15": "chuck roast", "c16": "beef shank", "c17": "raw beef", "c20": "grilling steak", "c21": "boiling meat", "c25": "cutting beef",
 "c26": "bone marrow", "c37": "dark beer", "c39": "beef broth", "c47": "butcher shop", "c48": "beef shanks", "c64": "meat counter",
 "c65": "raw beef shank", "c66": "butcher cutting meat", "c67": "butcher", "c68": "freezer bags", "c70": "shredded beef", "c71": "beef tacos",
 "c75": "roasting pan", "c78": "dutch oven coals", "c79": "campfire cooking", "c80": "slow cooker", "c81": "pressure cooker", "c82": "pouring red wine",
 "c90": "refrigerator", "c91": "food containers", "c97": "raw beef cuts", "c98": "short ribs", "c99": "oxtail", "c100": "brisket",
 "c102": "mashed potatoes", "c103": "egg noodles", "c105": "black coffee", "c106": "chipotle peppers", "c107": "cinnamon stick", "c112": "flouring meat"}
STOCK2 = {"c15": "beef roast", "c16": "beef shin", "c17": "beef chunks", "c20": "steak pan", "c21": "boiling pot", "c25": "butchering beef",
 "c26": "marrow bones", "c37": "pouring beer", "c39": "broth pot", "c47": "butcher", "c48": "raw meat", "c64": "meat department",
 "c65": "beef shin", "c66": "butcher knife", "c67": "meat market", "c68": "frozen food", "c70": "pulled beef", "c71": "tacos",
 "c75": "dutch oven", "c78": "dutch oven campfire", "c79": "cooking fire", "c80": "crockpot", "c81": "instant pot", "c82": "red wine",
 "c90": "fridge", "c91": "meal prep containers", "c97": "beef cuts", "c98": "beef short ribs", "c99": "oxtail stew", "c100": "beef brisket",
 "c102": "mashed potato", "c103": "noodles", "c105": "coffee pot", "c106": "chipotle", "c107": "orange peel", "c112": "flour meat"}
js = "export const ESC = {\n" + "\n".join(f'  {k}: {{ set: "{v["set"]}",{" rusty: true," if v["rusty"] else ""} base: {json.dumps(v["base"])},\n    clips: {{\n' + ",\n".join(f"      {c}: {json.dumps(a)}" for c, a in v["clips"].items()) + " } }," for k, v in E.items()) + "\n};\n"
js += "export const STOCK = " + json.dumps(STOCK, indent=1) + ";\nexport const STOCK2 = " + json.dumps(STOCK2, indent=1) + ";\nexport const DET = {};\nexport const TOPIC = \"braised beef\";\n"
open("D:/Proyectos/video2-wt/cvcheapmeat/vlog/cvcheapmeat/escenas.mjs", "w", encoding="utf8").write(js)
segs = json.load(open("D:/Proyectos/video2-wt/cvcheapmeat/vlog/cvcheapmeat/segs.json", encoding="utf8"))
have = {c for v in E.values() for c in v["clips"]} | set(STOCK)
print(len(E), "escenas", sum(len(v["clips"]) for v in E.values()), "clips ·", len(STOCK), "stock · faltan", [s["id"] for s in segs if s["id"] not in have])
