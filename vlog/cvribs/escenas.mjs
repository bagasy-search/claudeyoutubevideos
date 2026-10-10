// Dirección del VLOG CONTINUO cvribs (Claudio Vaquero #3, costillas braseadas). Por escena: set (lib SETS), la foto base (= 1er cuadro)
// y por clip [UNA acción simple durante el clip, cómo queda el cuadro al FINAL (= ancla K_i)]. Plano = lo que se dice.
// STOCK = metraje real (consulta 2-3 palabras). Sin DET: agnes-image no dibuja comida cocida (cvbeans: sartén/huevos/mortadela).
// Continuidad de las costillas: costillar crudo en papel → trozos de 3 huesos → membrana → sal+comino → de pie en el Dutch oven con salsa roja →
// tapa, horno → 2 h, carne retraída de los huesos → bandeja con aluminio → salsa reducida → pincelado → gratinado brillante → hueso limpio.
const POT = "a heavy black cast-iron Dutch oven with a heavy black lid that has a visible dent in it";
const RAW = "pieces of raw pork spare ribs three bones wide, pink meat with white fat";
const BRAISED = "braised pork rib pieces in a dark red sauce, the meat pulled back from the ends of the bones";
const GLAZED = "pork spare rib pieces with a sticky shiny dark brick-red glaze, charred a little at the edges";
const BOOK = "a thick printed cookbook with a worn brown cover";
export const ESC = {
  S00: { set: "A3", base: `stands at the long plank table holding one glazed rib piece in both hands over a wooden board piled with ${GLAZED}.`,
    clips: {
      c01: ["pulls the clean bone out of the glazed rib with his fingers", "the clean white bone held up in one hand, the glazed meat in the other"] } },
  S01: { set: "A3", base: `stands at the long plank table holding a clean white rib bone up in one hand, a wooden board of ${GLAZED} in front of him, a black pot of beans at the end of the table.`,
    clips: {
      c02: ["turns the clean bone slowly in his fingers toward the camera", "the clean white bone held close to the camera"],
      c03: ["sets the bone down on the board and points at the black pot of beans at the end of the table", "his finger pointing at the pot of beans"],
      c04: ["picks up a glazed rib piece from the board and shows it", "a glazed rib piece held up toward the camera"],
      c05: ["shakes his head and waves his free hand", "his hand mid-wave, shaking his head with a half smile"],
      c06: ["holds up two fingers", "two fingers raised, a wry face"],
      c07: ["rests his hand on the lid of a black Dutch oven at the end of the table", "his hand flat on the dented lid of the Dutch oven"],
      c08: ["picks up an orange from the table and holds it up", "the orange held up beside his face"],
      c09: ["sets the orange down and touches his chest with his open hand", "his hand flat on his chest, smiling"],
      c10: ["opens both hands at his sides, proud", "both hands open, a warm grin at the camera"] } },
  S02: { set: "A2", base: `stands in front of the wall of hanging cast-iron skillets holding ${POT} by its handles with both hands at chest height.`,
    clips: {
      c11: ["lifts the lid of the pot to show the inside, then puts it back", "the lid back on the pot, his hand on top"],
      c12: ["points at a big black roasting pan hanging on the wall", "his finger pointing at the roasting pan on the wall"] } },
  S03: { set: "A3", base: `stands at the long plank table, a whole rack of raw pork spare ribs on white butcher paper in front of him.`,
    clips: {
      c18: ["presses a finger into the raw meat between two bones", "his finger resting on the raw meat between the bones, looking at the camera"] } },
  S04: { set: "A3", base: `sits at the long plank table with an old stained crew notebook open in front of him.`,
    clips: {
      c19: ["turns a page of the notebook and smiles", "his hand on the open page, a nostalgic smile"],
      c20: ["rests his cheek on his folded hands like a nap, then laughs", "his cheek on his folded hands, laughing"] } },
  S05: { set: "A3", base: `stands at the long plank table with a whole rack of raw pork spare ribs on white butcher paper and a big butcher knife in his hand.`,
    clips: {
      c21: ["lifts one end of the raw rack a little with his free hand", "the raw rack lifted a few inches off the paper"],
      c22: ["cuts down between the bones with the big knife", `${RAW} lying apart on the paper, the knife in his hand`] } },
  S06: { set: "A3", base: `stands at the long plank table; ${RAW} bone side up on the butcher paper, a butter knife and a paper towel beside them.`,
    clips: {
      c23: ["slides a butter knife under the thin shiny membrane at one end of a rib piece", "the edge of the membrane lifted on the knife"],
      c24: ["pulls the membrane off with a paper towel in one long sheet", "the thin membrane hanging from the paper towel in his hand"] } },
  S07: { set: "A3", base: `stands at the long plank table; ${RAW} in a big white enamel pan, a small bowl of coarse salt and a small bowl of ground cumin beside it.`,
    clips: {
      c25: ["sprinkles salt and cumin over the ribs and rubs it in with his hands", "the ribs dusted with salt and cumin, his hands on them"],
      c26: ["covers the pan with a clean cloth", "the pan covered with the cloth, his hands on its edge"] } },
  S08: { set: "A3", base: `stands at the long plank table holding a handful of long, smooth, deep red dried guajillo chiles.`,
    clips: {
      c27: ["holds one long dried guajillo chile up to the camera", "one smooth deep red chile held up close to the camera"],
      c28: ["smells the chile and smiles", "the chile under his nose, eyes closed, smiling"] } },
  S09: { set: "A3", base: `stands at the long plank table; dried guajillo chiles on a wooden cutting board, a pair of kitchen scissors in his hand.`,
    clips: {
      c30: ["snips the stem off a chile with the scissors and shakes the seeds out onto the board", "the opened chile in his hand, seeds on the board"] } },
  S10: { set: "A1", base: `stands at the black range with a dry black cast-iron skillet on the burner, three dried guajillo chiles lying flat in it, a metal spatula in his hand.`,
    clips: {
      c32: ["presses a chile flat in the dry skillet with the spatula", "the chile flat under the spatula, a faint wisp of smoke"],
      c33: ["lifts a blackened chile out of the skillet with tongs and drops it in a tin bucket, shaking his head", "the empty tongs held up, a rueful grin"] } },
  S11: { set: "A3", base: `stands at the long plank table; toasted guajillo chiles in a white enamel bowl, a dented steel kettle in his hand.`,
    clips: {
      c34: ["pours hot water from the kettle over the chiles and presses a small plate on top", "the plate holding the chiles under the hot water in the bowl"] } },
  S12: { set: "A3", base: `stands at the long plank table; in front of him a glass of orange juice, an orange, a head of garlic, a bottle of cider vinegar, a small bowl of brown sugar, a brown cone of piloncillo and an old glass blender.`,
    clips: {
      c35: ["grates the orange skin on a small grater over a bowl", "orange zest in the bowl, the half-grated orange in his hand"],
      c36: ["drops peeled garlic cloves into the blender jar", "his hand over the blender jar, garlic inside"],
      c37: ["holds up the hard brown cone of piloncillo", "the brown cone of piloncillo held up to the camera"] } },
  S13: { set: "A3", base: `stands at the long plank table beside an old glass blender full of smooth dark brick-red chile sauce, a white bowl and a spoon beside it.`,
    clips: {
      c39: ["pours sauce from the blender into the bowl and tastes it with the spoon, making a face", "the spoon at his lips, a sour face, the bowl of red sauce in front of him"],
      c40: ["shrugs and waves the spoon, reassuring", "the spoon raised, a calm smile"] } },
  S14: { set: "A1", base: `stands at the black range; ${POT} on the burner with the lid off, a pan of seasoned raw rib pieces and the blender jar of red sauce beside it.`,
    clips: {
      c41: ["stands rib pieces up on their ends inside the Dutch oven", "the rib pieces standing upright packed in the pot"],
      c42: ["pours the red sauce from the blender over the ribs in the pot", "the ribs half covered in dark red sauce, the empty blender jar in his hand"] } },
  S15: { set: "A1", base: `stands at the black range looking down into ${POT}, the rib pieces standing in dark red sauce that comes halfway up them.`,
    clips: {
      c43: ["points into the pot at the sauce line halfway up the ribs", "his finger pointing at the sauce line on the ribs"],
      c44: ["pours a little water from an enamel pitcher into the pot", "the pitcher lifted away, the sauce halfway up the ribs"] } },
  S16: { set: "A1", base: `stands at the black range holding the dented lid over ${POT} full of ribs in red sauce.`,
    clips: {
      c45: ["sets the heavy lid on the pot and slides it into the oven of the range", "the oven door closed, his hand on its handle"] } },
  S17: { set: "A4", base: `stands by the deep window holding a tin mug of coffee, the corral outside.`,
    clips: {
      c46: ["holds up three fingers, then wags his finger 'no'", "his index finger raised, a firm look"],
      c47: ["sips his coffee and looks out the window at the corral", "the mug lowered, looking out the window, remembering"] } },
  S18: { set: "A4", base: `leans on the deep window frame with a tin mug of coffee, the corral outside in the late afternoon light.`,
    clips: {
      c50: ["laughs and shakes his head", "a wide laugh, eyes crinkled, the mug in his hand"] } },
  S19: { set: "A1", base: `stands at the black range wearing thick oven mitts, ${POT} just out of the oven on the stovetop, lid on.`,
    clips: {
      c51: ["lifts the heavy lid off the pot, steam rising, and looks in", `the lid held up, steam rising from ${BRAISED}`] } },
  S20: { set: "A1", base: `stands at the black range with metal tongs over ${POT} full of ${BRAISED}, the lid off.`,
    clips: {
      c52: ["grabs a bone with the tongs and gives it a little twist", "the tongs holding a bone that turns freely in the meat"],
      c53: ["puts the lid back on the pot and holds up three fingers", "the lid on, three fingers raised"],
      c54: ["taps the lid twice and winks", "his hand on the lid, a wink at the camera"] } },
  S21: { set: "A3", base: `stands at the long plank table; ${POT} full of ${BRAISED} and a sheet pan lined with foil, metal tongs in his hand.`,
    clips: {
      c55: ["lifts a rib piece out of the pot with the tongs and lays it bone side down on the sheet pan", "braised ribs on the foil-lined sheet pan, the tongs in his hand"] } },
  S22: { set: "A1", base: `stands at the black range stirring the dark red sauce boiling in ${POT} with a wooden spoon.`,
    clips: {
      c57: ["stirs the boiling sauce slowly with the wooden spoon", "the sauce thick and shiny around the spoon"],
      c58: ["dips a metal spoon in the sauce, pulls it out and draws a line on the back with his finger", "the back of the spoon coated in glaze with a clean line through it"] } },
  S23: { set: "A3", base: `stands at the long plank table; a foil-lined sheet pan of braised rib pieces, a bowl of thick shiny red glaze and a pastry brush.`,
    clips: {
      c59: ["brushes thick glaze over the ribs", "the ribs coated in shiny red glaze, the brush in his hand"] } },
  S24: { set: "A1", base: `stands at the black range holding a sheet pan of glazed rib pieces with oven mitts, the oven door open.`,
    clips: {
      c61: ["slides the sheet pan into the oven and bends down to watch through the half-open door", "bent down, watching closely at the half-open oven door"] } },
  S25: { set: "A3", base: `stands at the long plank table behind a wooden board piled with ${GLAZED}.`,
    clips: {
      c62: ["turns the board a little to show the glossy ribs", "the board of glossy glazed ribs turned toward the camera"] } },
  S26: { set: "A3", base: `stands at the long plank table holding a glazed rib piece over a wooden board piled with ${GLAZED}.`,
    clips: {
      c63: ["pulls a clean bone out of the glazed rib", "the clean bone held up toward the camera"] } },
  S27: { set: "A3", rusty: true, base: `stands at the long plank table behind a wooden board piled with ${GLAZED}, looking toward the open door where Rusty is coming in.`,
    clips: {
      c64: ["waves Rusty over with his hand", "his hand beckoning, Rusty walking toward the table"] } },
  S28: { set: "A3", rusty: true, base: `stands beside the long plank table where Rusty sits eating a glazed rib with both hands, sauce on his fingers, a board of ${GLAZED} in front of him.`,
    clips: {
      c65: ["points at Rusty's sticky hands and laughs", "Claudio grinning at the camera, Rusty chewing with sauce on his fingers"] } },
  S29: { set: "A1", base: `stands by the black range wiping a wooden cutting board with a cloth.`,
    clips: {
      c66: ["finishes wiping the board and throws the cloth over his shoulder", "the cloth on his shoulder, looking at the camera"] } },
  S30: { set: "A3", base: `sits at the long plank table with the old stained crew notebook open in front of him.`,
    clips: {
      c67: ["taps a page of the notebook with his finger", "his finger on the page, a serious look"],
      c68: ["holds a flat hand up and lowers it a notch", "his flat hand lowered, eyebrows raised"],
      c69: ["makes a sour face and shakes his head", "a sour face, head tilted"],
      c70: ["tosses something imaginary over his shoulder", "his hand over his shoulder, a shrug"],
      c71: ["presses his palm flat down on the notebook like sealing a lid", "his palm pressed flat on the notebook, nodding"] } },
  S31: { set: "A3", base: `stands at the long plank table; on a cutting board a big beef back rib, two thick beef short ribs and a few meaty country-style pork ribs, all raw.`,
    clips: {
      c72: ["picks up the big beef back rib and shows it", "the big beef rib held up to the camera"],
      c73: ["picks up a thick country-style pork rib", "the thick meaty strip held up, a pleased look"] } },
  S33: { set: "A3", base: `stands at the long plank table; a glass dish of ${BRAISED} and a box of freezer bags.`,
    clips: {
      c77: ["spoons ribs and sauce into a freezer bag and seals it", "the filled freezer bag lying sealed on the table"],
      c79: ["pats the freezer bag and smiles", "his hand on the freezer bag, smiling"] } },
  S34: { set: "A1", base: `stands at the black range; a black skillet on the burner with pulled rib meat in red glaze, corn tortillas warming on a flat iron comal beside it, two forks in his hands.`,
    clips: {
      c80: ["pulls rib meat off a bone with the two forks in the skillet", "shredded rib meat in the skillet, the clean bone set aside"],
      c82: ["folds a tortilla around some meat and takes a bite", "chewing, the taco in his hand, nodding"] } },
  S35: { set: "A3", base: `stands at the long plank table; a red onion, a glass jar, two limes and a knife on a cutting board.`,
    clips: {
      c83: ["holds up the red onion", "the red onion held up to the camera"],
      c85: ["screws the lid on the jar of sliced onions and shakes it", "the jar of bright pink sliced onions held up"] } },
  S36: { set: "A1", base: `stands at the black range with a wooden spoon over ${POT} holding thick shiny red glaze.`,
    clips: {
      c86: ["tastes the glaze from the spoon and sprinkles a pinch of salt into the pot", "his fingers over the pot after the pinch of salt"],
      c87: ["tastes again and nods happily", "the spoon lowered, a satisfied nod"] } },
  S37: { set: "A4", base: `stands by the deep window holding a brown cone of piloncillo and a small knife over a small bowl on the windowsill.`,
    clips: {
      c88: ["shaves a little piloncillo off the cone with the knife into the bowl", "brown sugar shavings in the bowl"],
      c89: ["sets the cone on the windowsill and smiles", "the cone on the windowsill, a warm smile"] } },
  S38: { set: "A3", base: `stands at the long plank table holding a full plate: glazed ribs, a spoon of pinto beans, fried cabbage and a warm tortilla.`,
    clips: {
      c91: ["sets the full plate down toward the camera", "the full plate on the table in front of him, his hands open"] } },
  S39: { set: "A3", base: `stands at the long plank table; laid out in front of him raw pork ribs on butcher paper, dried guajillo chiles, an orange, garlic, a bottle of vinegar and a little bowl of sugar.`,
    clips: {
      c92: ["points at the ribs, then the chiles, then the orange", "his finger on the orange"],
      c93: ["counts on his fingers", "four fingers raised, adding it up"] } },
  S40: { set: "A1", base: `stands at the black range wearing oven mitts, a big roasting pan covered tight with foil on top of the stove.`,
    clips: {
      c96: ["pulls a sheet pan of glazed ribs out of the oven", "holding the hot pan with the mitts, a grin"] } },
  S42: { set: "A2", base: `stands in front of the wall of hanging cast-iron skillets beside a long string of dried red chiles.`,
    clips: {
      c101: ["takes a dark wrinkled ancho chile off the string", "the dark ancho chile held up"],
      c102: ["holds up one tiny skinny red chile de arbol", "the tiny red chile held up between two fingers"],
      c103: ["fans his mouth with his hand, 'hot'", "his hand fanning his mouth, a grin"],
      c104: ["taps a big cast-iron skillet on the wall", "his hand on the skillet, nodding"] } },
  S43: { set: "A4", base: `stands by the deep window in the late afternoon light, the corral outside, telling a story.`,
    clips: {
      c108: ["laughs and pats the window frame", "his hand on the window frame, laughing"] } },
  S44: { set: "A3", base: `stands at the long plank table; a braised rib piece on a cutting board, an instant-read meat thermometer in his hand.`,
    clips: {
      c109: ["pushes the thermometer probe into the meat between two bones", "the thermometer in the rib, he looks at the dial"],
      c111: ["pulls the thermometer out and twists a bone free with his fingers", "the bone free in his fingers"] } },
  S45: { set: "A3", base: `stands at the long plank table; a glass dish of ${BRAISED}, a lid, a roll of tape and a marker.`,
    clips: {
      c112: ["presses the lid onto the dish and writes on a strip of tape", "the dish closed, the marker in his hand"],
      c113: ["lifts a sheet of hard white fat off the top of the cold sauce with a spoon", "the white fat on the spoon"],
      c114: ["spreads his arms, relaxed, and laughs", "arms open, laughing"] } },
  S46: { set: "A3", base: `stands at the long plank table beside the old glass blender; dried ancho chiles, guajillo chiles and a small can of chipotle peppers in adobo in front of him.`,
    clips: {
      c115: ["holds up the small can of chipotle in adobo", "the small can held up"],
      c116: ["drops three anchos and three guajillos into the blender", "his hand over the blender full of chiles"],
      c117: ["holds up a jar of red chili powder", "the jar of chili powder held up"] } },
  S47: { set: "A1", base: `stands at the black range; a big black pot of pinto beans on the burner and a plate of clean rib bones in his hand.`,
    clips: {
      c118: ["drops the rib bones into the pot of beans", "the bones sunk in the beans, the empty plate in his hand"],
      c119: ["stirs the beans with a wooden spoon and smells the steam", "eyes closed, smelling the steam, smiling"] } },
  S48: { set: "A3", base: `stands at the long plank table; one raw pork rib piece bone side up on a cutting board, a paper towel and a small knife beside it.`,
    clips: {
      c120: ["grabs the edge of the membrane with the paper towel", "the membrane edge pinched in the paper towel"],
      c121: ["pulls the membrane slowly off at an angle", "the membrane peeled off in one sheet"],
      c122: ["cuts a few slits across the bone side with the small knife", "slits across the bone side, the knife set down"] } },
  S49: { set: "A3", base: `sits at the long plank table with the old stained crew notebook and ${BOOK} beside it.`,
    clips: {
      c123: ["closes the notebook and holds up the printed cookbook", "the cookbook held up next to his face, smiling"] } },
  S50: { set: "A3", base: `stands at the long plank table with ${BOOK} open in front of him.`,
    clips: {
      c124: ["turns a page of the cookbook and taps it", "his finger on the open page"],
      c125: ["closes the book and pats the cover", "his hand flat on the closed book"],
      c126: ["points down below the camera, then at the camera", "his finger pointing at the camera, a warm smile"] } },
  S51: { set: "A1", base: `stands at the black range beside ${POT}, a paper sack of potatoes on the stove edge.`,
    clips: {
      c127: ["taps the lid of the Dutch oven", "his hand on the lid, nodding"],
      c128: ["picks a potato out of the sack, holds it up and waves goodbye", "a potato in one hand, the other waving, smiling"] } },
};
export const STOCK = {
  c13: "raw pork ribs", c14: "braised ribs", c15: "grilling ribs", c16: "burnt ribs", c17: "bbq smoker",
  c29: "dried chiles", c31: "toasting chiles", c38: "blender sauce",
  c48: "cowboys campfire", c49: "cowboys eating", c56: "simmering sauce", c60: "oven broiler",
  c74: "butcher counter", c75: "butcher cutting ribs", c76: "rib tips", c78: "freezer bag",
  c81: "pork tacos", c82: "cowboy fence", c84: "slicing red onion", c90: "beans tortillas", c94: "bbq ribs plate",
  c95: "roasting pan", c97: "dutch oven coals", c98: "campfire coals", c99: "ribs campfire",
  c100: "slow cooker", c105: "family barbecue", c106: "new grill", c107: "grill fire", c110: "meat thermometer",
};
export const STOCK2 = {
  c13: "pork spare ribs", c14: "slow cooked ribs", c15: "ribs grill", c16: "grill flames", c17: "smoker pit",
  c29: "guajillo chiles", c31: "dried chiles skillet", c38: "chili sauce",
  c48: "ranch dinner", c49: "outdoor dinner", c56: "red sauce boiling", c60: "ribs oven",
  c74: "meat counter", c75: "butcher ribs", c76: "pork ribs", c78: "frozen meat",
  c81: "corn tortillas", c82: "cowboy riding", c84: "pickled onions", c90: "mexican dinner", c94: "glazed ribs",
  c95: "aluminum foil pan", c97: "campfire dutch oven", c98: "charcoal coals", c99: "grilling ribs coals",
  c100: "crock pot", c105: "fourth july", c106: "gas grill", c107: "burnt grill", c110: "thermometer meat",
};
export const DET = {};
export const TOPIC = "pork ribs";
