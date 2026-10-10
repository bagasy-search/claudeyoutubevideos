// Dirección del VLOG CONTINUO cvporkchops (Claudio Vaquero, piloto). Por escena: set (lib SETS), la foto base (= 1er cuadro)
// y por clip [UNA acción simple durante el clip, cómo queda el cuadro al FINAL (= ancla K_i)]. Plano = lo que se dice.
// STOCK = metraje real (consulta 2-3 palabras) · DET = plano detalle de comida sin cara (agnes_img_pro first/last + keyframe con sonido).
// Estado de la comida por escena (continuidad): crudas → salmuera → secas → sartén (manteca) → selladas → vuelta → cebolla/chile →
// caldo → tapa → termómetro → plato con manteca → cortada rosada → salsa encima → Rusty prueba → sartén limpia.
const CHOPS_RAW = "four thick raw bone-in pork rib chops, pale pink with a white fat edge and a curved rib bone";
const SEARED = "four thick bone-in pork chops with a deep golden-brown crust";
export const ESC = {
  S01: { set: "A1", base: `stands at the black cast-iron range with an empty black cast-iron skillet on the burner in front of him, one hand resting on the skillet handle, talking to the camera.`,
    clips: {
      c02: ["taps the rim of the empty skillet twice with his finger while talking", "his finger rests on the rim of the empty skillet, he looks at the camera"],
      c03: ["shrugs and opens one hand toward the empty skillet, questioning", "his open palm turned up toward the skillet, eyebrows raised"],
      c04: ["shakes his head slowly with a small grimace", "he looks at the camera with a tired half smile, both hands on the edge of the stove"],
      c05: ["holds up two fingers then lowers his hand", "he leans a little toward the camera, one hand on the skillet handle"],
      c06: ["smiles and nods while he talks", "a warm confident smile toward the camera"],
      c07: ["touches his chest with his open hand as he says his name", "his right hand flat on his chest, nodding"],
      c08: ["laughs a little, then slides the empty skillet off the burner with both hands", "he holds the skillet by the handle at his side, turning toward the wall of skillets"] } },
  S02: { set: "A2", base: `stands in front of the wall of hanging cast-iron skillets and lifts a heavy 12-inch black cast-iron skillet off its nail with one hand, looking at the camera.`,
    clips: {
      c09: ["holds the heavy black skillet up toward the camera with both hands", "the black 12-inch cast-iron skillet held up at chest height, its seasoned surface toward the camera"],
      c10: ["turns the skillet slowly in his hands, showing its worn black bottom", "he holds the skillet against his apron, smiling"],
      c11: ["takes a heavy black lid from a nail and holds it up next to the skillet", "skillet in one hand, its heavy lid in the other, raised toward the camera"] } },
  S03: { set: "A3", base: `stands behind the wooden plank table; on a sheet of brown butcher paper in front of him lie ${CHOPS_RAW}. He rests both hands on the table edge and talks to the camera.`,
    clips: {
      c12: ["shakes his head gently and points at the raw chops", "his finger points down at the raw chops on the butcher paper"],
      c16: ["holds up one finger, remembering his mother, then lowers it", "he looks at the camera with a nostalgic half smile"],
      c17: ["picks up a small digital meat thermometer from the table and shows it", "the small digital thermometer held up beside his face"],
      c18: ["holds the thermometer up and taps it with one finger", "the thermometer lowered in his hand, he looks seriously at the camera"],
      c19: ["puts the thermometer down on the table next to the chops", "both his hands on the table on either side of the raw chops"] } },
  S04: { set: "A3", base: `sits at the wooden plank table with an old stained notebook open in front of him, its pages yellowed and spotted with grease, a pencil beside it, glancing from the notebook to the camera.`,
    clips: {
      c20: ["runs his finger down a handwritten page of the notebook", "his finger stops on a line of old handwriting, he looks up at the camera"],
      c21: ["closes the notebook slowly and smiles", "the notebook closed under his hand, he smiles at the camera"] } },
  S05: { set: "A3", base: `stands at the wooden table with a big glass mixing bowl, a glass pitcher of water, a box of kosher salt and a small bag of brown sugar in front of him.`,
    clips: {
      c22: ["pours water from the pitcher into the glass bowl", "the glass bowl now half full of water, the pitcher set down beside it, a wooden spoon in the water"],
      c23: ["stirs the water in the bowl slowly with a wooden spoon", "the water in the bowl is clear, he holds the spoon still and looks at the camera"] } },
  S06: { set: "A3", base: `stands at the wooden table; ${CHOPS_RAW} are submerged in clear salty water in a big glass bowl in front of him.`,
    clips: {
      c24: ["presses one chop down under the water with two fingers", "all four chops under the water in the glass bowl, his wet hand lifted"],
      c25: ["wipes his wet hand on his apron while he talks", "he looks at the camera, hands on his apron"],
      c26: ["wags his finger 'no' and sets an old wind-up kitchen timer next to the bowl", "an old metal kitchen timer beside the glass bowl, he points at it"] } },
  S07: { set: "A1", base: `stands at the black range holding up a small digital meat thermometer, smiling, the empty skillet on the burner behind him.`,
    clips: {
      c27: ["holds his thumb and finger about an inch apart to show the thickness", "his thumb and finger held an inch apart close to the camera"] } },
  S08: { set: "A3", base: `stands at the wooden table; four thick bone-in pork chops lie on a sheet pan lined with paper towels, wet and glistening, a roll of paper towels beside them.`,
    clips: {
      c31: ["presses a folded paper towel down on top of a chop with his palm", "the paper towels on the chops dark with water, his palm pressing down"],
      c32: ["sprinkles black pepper over the chops from a small tin", "the chops dry and dotted with black pepper and red ancho chile powder"],
      c33: ["holds up the box of salt and shakes his head 'no', then sets it aside", "the salt box pushed away to the edge of the table, he grins at the camera"] } },
  S09: { set: "A1", base: `stands at the black range; the black cast-iron skillet sits on the burner with a spoonful of white lard melting in it, a coffee can of bacon grease beside the burner.`,
    clips: {
      c34: ["scoops a spoon of bacon grease from the coffee can into the skillet", "the melted fat in the skillet shining, the coffee can beside the stove"],
      c35: ["tilts the skillet slightly so the shimmering fat runs across it, then points at it", "his finger points at the shimmering hot fat in the skillet"] } },
  S10: { set: "A1", base: `stands at the black range; ${SEARED.replace("with a deep golden-brown crust", "just laid in")} the black cast-iron skillet, sizzling, a little smoke rising.`,
    clips: {
      c36: ["holds his hands up away from the sizzling skillet, not touching it", "both his hands raised open beside the sizzling skillet, he looks at the camera"] } },
  S12: { set: "A1", base: `stands at the black range; in the cast-iron skillet lie ${SEARED}, just flipped, a metal spatula in his hand.`,
    clips: {
      c42: ["puts the spatula down on the stove and holds up one finger", "the spatula resting on the stove, his finger raised, the chops sizzling"] } },
  S13: { set: "A1", base: `stands at the black range; ${SEARED} are pushed to one side of the cast-iron skillet, a cutting board with a sliced onion and chopped roasted green chiles beside the stove.`,
    clips: {
      c43: ["slides the sliced onion from the cutting board into the empty side of the skillet", "sliced onion and green chile sizzling in the skillet next to the chops"],
      c44: ["stirs the onions slowly with a wooden spoon", "the onions softened and golden in the skillet, he looks at the camera"] } },
  S14: { set: "A1", base: `stands at the black range; the skillet holds a bed of soft golden onions and green chile in a little broth, steam rising, ${SEARED} on a plate beside the stove.`,
    clips: {
      c46: ["lays the chops one by one with tongs on top of the onions", "the four seared chops lying on top of the bed of onions in the skillet, tongs in his hand"] } },
  S16: { set: "A1", base: `stands at the black range holding the heavy black lid over the skillet where four seared chops lie on a bed of onions.`,
    clips: {
      c47: ["sets the lid down on the skillet and turns the stove knob down", "the lid on the skillet, a thin wisp of steam at its edge, his hand on the knob"],
      c48: ["rests his hand on the lid handle and talks to the camera", "his hand on the lid handle, steam escaping softly"],
      c49: ["glances at an old round clock on the wall, then reaches into his apron pocket", "he takes a small digital thermometer out of his apron pocket"] } },
  S18: { set: "A1", base: `stands at the black range with the lid off, a small digital meat thermometer in his hand over the skillet of seared chops on onions.`,
    clips: {
      c50: ["holds the thermometer up and shrugs with a small embarrassed smile", "the thermometer held at chest height, he smiles sheepishly"],
      c51: ["slides the thermometer probe into the side of the thickest chop", "the thermometer stuck in the side of a chop, its little screen facing the camera"] } },
  S19: { set: "A3", base: `stands at the wooden table; ${SEARED} rest on a white enamel plate, each with a square pat of butter melting on top.`,
    clips: {
      c52: ["puts a pat of butter on the last chop with a knife", "a pat of butter melting on each chop on the white enamel plate"],
      c53: ["folds his arms and waits, looking at the plate", "arms folded over his apron, he looks at the camera, patient"],
      c54: ["nods and unfolds his arms", "his hands resting on the table beside the plate"] } },
  S20: { set: "A3", base: `stands at the wooden table with a chop on a wooden board, cut open next to the bone, a knife and fork in his hands.`,
    clips: {
      c56: ["lifts the cut slice with his fork toward the camera", "the slice held on the fork, juicy and faintly pink inside"],
      c57: ["puts the fork down and holds up one finger", "his finger raised, the cut chop on the board in front of him"] } },
  S21: { set: "A3", base: `stands at the wooden table spooning soft onions and pan juices from the cast-iron skillet over the chops on the white plate.`,
    clips: {
      c59: ["sets the spoon down in the skillet and smiles", "the chops on the plate glossy with onions and sauce, he smiles at the camera"] } },
  S22: { set: "A3", base: `stands at the wooden table next to the plate of chops; behind him the kitchen door is open to the bright yard.`, rusty: true,
    clips: {
      c60: ["waves Rusty over; Rusty walks in, takes a bite of chop with a fork and nods slowly", `Rusty stands beside him chewing with a fork in his hand and a small approving nod, Claudio grinning at the camera`] } },
  S24: { set: "A1", base: `stands at the black range wiping the inside of the black cast-iron skillet with a folded kitchen towel.`,
    clips: {
      c61: ["keeps wiping the skillet slowly with the towel while he talks", "he hangs the towel over his shoulder, the clean skillet on the stove"] } },
  S25: { set: "A3", base: `sits at the wooden plank table reading the old stained crew notebook open in front of him, one finger on the page.`,
    clips: {
      c62: ["turns a page of the notebook", "his finger on a new page of old handwriting, he looks up at the camera"],
      c63: ["holds up the small digital thermometer from the table", "the thermometer held up beside the notebook"],
      c64: ["taps the table three times slowly with his finger", "his finger resting on the table, he looks at the camera"],
      c65: ["shakes his head and turns another page", "he reads the page, then looks up"],
      c66: ["lowers his flat hand slowly, as if turning down the heat", "his flat hand low over the table, the notebook open"] } },
  S26: { set: "A3", base: `stands at the wooden table with a supermarket foam tray of six thin pale pork chops in plastic wrap in front of him.`,
    clips: {
      c67: ["picks up the foam tray and shows how thin the chops are", "the tray tilted toward the camera, thin chops visible"],
      c68: ["puts the tray down and pushes it aside", "the tray at the side of the table, his hands open"] } },
  S27: { set: "A1", base: `stands at the black range with a small 10-inch cast-iron skillet holding two seared pork chops.`,
    clips: {
      c69: ["holds up two fingers, then points at the small skillet", "his finger points at the two chops in the small skillet"] } },
  S28: { set: "A1", base: `stands beside the black range with a big dented roasting pan full of seared pork chops lying on onions and green chile, a roll of aluminum foil beside it.`,
    clips: {
      c70: ["spreads his arms wide over the roasting pan", "his arms open over the big pan of chops"],
      c71: ["tears a sheet of foil from the roll", "he holds a sheet of foil over the roasting pan"],
      c72: ["lays the foil over the pan and presses it down at the edges", "the roasting pan sealed with foil, his hand on top"] } },
  S29: { set: "A3", base: `stands at the wooden table; on it: a package of four thick pork chops, an onion, a small can of green chiles, a carton of chicken broth and a stick of butter, a pencil and a scrap of paper.`,
    clips: {
      c74: ["touches the onion, then the can of chiles, counting", "his finger on the can of green chiles"],
      c75: ["writes a number on the scrap of paper with the pencil and looks up", "the pencil down on the paper, he looks at the camera satisfied"] } },
  S31: { set: "A1", base: `stands at the black range; a single cooked pork chop sits in the small cast-iron skillet with a splash of broth, the lid in his hand.`,
    clips: {
      c77: ["puts the lid on the small skillet", "the lid on the small skillet, a thread of steam escaping"],
      c78: ["lifts the lid; steam comes out over the hot chop", "the lid raised, steam rising from the chop"] } },
  S32: { set: "A3", base: `stands at the wooden table with a cold cooked pork chop on a cutting board, a stack of flour tortillas and a bowl of red salsa beside it.`,
    clips: {
      c79: ["slices the cold chop into thin strips with a knife", "thin strips of pork on the board, the knife set down"],
      c80: ["puts pork strips and onions in a tortilla and folds it", "a folded tortilla full of pork and onion in his hand, he grins"] } },
  S33: { set: "A3", base: `stands at the wooden table with two white enamel plates side by side, each holding one cooked pork chop: the left one dry and gray, the right one golden and juicy.`,
    clips: {
      c81: ["points at the left plate, then the right one", "his finger between the two plates, he looks at the camera"],
      c82: ["mimes flipping something over and over with his hand above the left plate", "his hand resting on the table beside the juicy chop on the right"] } },
  S35: { set: "A3", base: `stands at the wooden table with two cut pork chops on white plates side by side: the left one gray and dry inside, the right one moist with juice pooling by the bone.`,
    clips: {
      c84: ["laughs and shrugs", "he smiles at the camera, hands open"] } },
  S37: { set: "A1", base: `stands at the black range with a cooked pork chop on a plate beside the stove, pressing the meat with his index finger.`,
    clips: {
      c90: ["presses the soft part of his open palm under his thumb with a finger", "his open left palm toward the camera, a finger of his right hand pressing below the thumb"],
      c91: ["touches his thumb to his middle finger and presses his palm again", "his thumb touching his middle finger, pressing the palm below it"],
      c92: ["touches the tip of his nose and laughs", "his finger on the tip of his nose, laughing"] } },
  S39: { set: "A3", base: `stands at the wooden table with a full plate in front of him: a pork chop with onion sauce, a scoop of pinto beans, fried cabbage and a stack of warm flour tortillas.`,
    clips: {
      c96: ["points at the beans, then the tortillas on the plate", "his finger above the plate, he looks at the camera"],
      c97: ["spoons a little onion sauce over the whole plate", "the full plate glossy with sauce, he smiles"] } },
  S40: { set: "A1", base: `stands at the black range; the cast-iron skillet holds diced potatoes browning in grease, a cutting board with cubes of pork and green chile beside the stove.`,
    clips: {
      c98: ["slides the pork cubes from the board into the potatoes", "pork cubes and potatoes together in the skillet"],
      c99: ["stirs the hash with a wooden spoon", "the hash browned and steaming, the spoon resting on the skillet edge"],
      c100: ["cracks an egg into a well in the hash", "two eggs sitting in wells in the hash, he puts the lid on"] } },
  S41: { set: "A2", base: `stands in front of the wall of hanging cast-iron skillets holding the clean black 12-inch skillet, about to hang it on its nail.`,
    clips: {
      c101: ["holds the skillet and nods while he answers", "the skillet held at his side, he looks at the camera"],
      c102: ["shrugs, then raises one finger", "his finger raised, the skillet in his other hand"],
      c103: ["knocks twice on the thick bottom of the skillet with his knuckles", "his knuckles on the skillet bottom"],
      c104: ["touches a dried red chile hanging from the string beside him", "his hand on the string of dried red chiles"],
      c105: ["hangs the skillet back on its nail and smiles", "the skillet hanging on the wall, he smiles at the camera"] } },
  S42: { set: "A3", base: `stands at the wooden table with three different raw bone-in pork chops side by side on butcher paper.`,
    clips: {
      c106: ["points at each of the three raw chops in turn", "his finger on the first chop, the one with the curved rib bone"],
      c111: ["holds up a pale boneless pork chop and shakes his head a little", "the boneless chop held up, he looks at the camera"] } },
  S43: { set: "A4", base: `stands by the deep window with the peeling green frame, a tin coffee cup in his hand, looking out at the corral, then turning to the camera.`,
    clips: {
      c112: ["turns from the window to the camera and starts the story", "he faces the camera, the corral and horses visible through the window"],
      c116: ["looks down into his coffee cup and smiles quietly", "he looks out the window again, the cup at his chest"] } },
  S44: { set: "A3", base: `stands at the wooden table with one raw pork chop on butcher paper, his open palm held beside it.`,
    clips: {
      c117: ["shakes his head and waves his open hand 'no'", "his hand lowered beside the raw chop, he looks serious"],
      c118: ["holds up two fingers", "two fingers raised next to the raw chop"] } },
  S46: { set: "A1", base: `stands at the black range with his hand on the handle of the lid of the cast-iron skillet.`,
    clips: {
      c122: ["lifts the lid a little; a cloud of steam comes out", "the lid lifted, steam rising over the chops on the onions"],
      c123: ["puts the lid back down and taps it", "the lid closed, his hand on the handle, he winks at the camera"] } },
  S47: { set: "A3", base: `stands at the wooden table with a glass jar of homemade applesauce and a cooked pork chop on a plate.`,
    clips: {
      c124: ["opens the jar of applesauce", "the open jar in his hand, he smells it and smiles"],
      c125: ["spoons a little applesauce next to the chop", "a spoon of applesauce on the plate beside the chop"] } },
  S48: { set: "A3", base: `stands at the wooden table holding the old crew notebook, its pages yellowed, stained with grease and coffee, one page wrinkled from rain.`,
    clips: {
      c126: ["flips slowly through the stained pages", "the notebook open on a wrinkled stained page toward the camera"],
      c127: ["closes the notebook and puts it down", "his hand flat on the closed notebook, he looks at the camera"] } },
  S49: { set: "A3", base: `stands at the wooden table holding a thick printed cookbook open with both hands, a photo of a pork chop recipe on the open page.`,
    clips: {
      c128: ["turns the open book toward the camera", "the open printed cookbook facing the camera"],
      c129: ["turns a few pages of the book", "the book held open, he looks at the camera"],
      c130: ["closes the book and points down toward the bottom of the frame", "his finger pointing down, the book under his arm"] } },
  S50: { set: "A1", base: `stands at the black range; a big dented pot sits on the back burner behind him.`,
    clips: {
      c131: ["points over his shoulder at the pot on the back burner", "his thumb pointing back at the pot, he grins"],
      c132: ["waves goodbye to the camera", "his hand raised in a wave, smiling"] } },
};
export const STOCK = {
  c01: "pork chops skillet", c45: "deglazing pan", c58: "pork chops sauce", c83: "juicy pork chop",
  c13: "raw pork chops", c14: "pork chop frying", c15: "meat thermometer",
  c28: "pork chop bone", c29: "butcher counter", c30: "butcher cutting meat",
  c38: "cowboys ranch", c39: "ranch kitchen cooking", c40: "cowboy working horse",
  c73: "grocery meat aisle", c76: "microwave leftovers",
  c85: "raw pork chops", c86: "pork marbling", c87: "meat package label", c88: "supermarket meat", c89: "pork chops seasoning",
  c93: "dutch oven campfire", c94: "campfire coals", c95: "cattle roundup",
  c107: "pork loin chop", c108: "raw pork meat", c109: "butcher pork", c110: "pork shoulder",
  c113: "ranch cattle", c114: "cowboys riding", c115: "ranch sunset",
  c111: "boneless pork chops", c117: "raw meat counter",
  c119: "kosher salt", c120: "salt spoon", c121: "salt shaker",
};
const PAN = "a black cast-iron skillet on an old black cast-iron wood-burning cook stove, whitewashed adobe wall darkened with soot behind it";
export const DET = {
  c01: { first: `Close view of ${PAN}: four thick bone-in pork chops with a deep golden-brown crust sizzling in hot fat, sliced onion and green chile around them. Nobody in the frame, no hands, nothing touching the skillet.`,
         last: `The same close view a few seconds later: golden chicken broth has just been poured into the skillet around the seared pork chops, a big cloud of steam rising, the onions bubbling.`,
         prompt: "Golden chicken broth is poured from a measuring cup into the hot skillet around the seared pork chops; loud sizzle, a cloud of steam rises." },
  c37: { first: `Close view of ${PAN}: four thick raw-looking bone-in pork chops just laid in shimmering hot fat, the edges starting to turn white, small bubbles of fat around them.`,
         last: `The same close view a few seconds later: the edges of the pork chops turning pale, fat bubbling and spitting around them, nobody touches them.`,
         prompt: "The pork chops sit still in the hot fat and sizzle; the fat bubbles around them, nothing moves them." },
  c41: { first: `Close view of ${PAN}: a metal spatula lifting the edge of a thick bone-in pork chop, showing a deep golden-brown crust underneath.`,
         last: `The same close view: the pork chop flipped over, its deep golden-brown seared crust facing up, sizzling, the other chops beside it still raw on top.`,
         prompt: "A metal spatula flips the pork chop over, revealing the deep golden-brown crust; it sizzles." },
  c45: { first: `Close view of ${PAN}: soft golden onions and green chile on one side, seared pork chops pushed to the other side, a hand holding a measuring cup of chicken broth above the pan.`,
         last: `The same close view: the broth sizzling and bubbling in the skillet, steam rising, a wooden spatula scraping the brown bits from the bottom.`,
         prompt: "Chicken broth is poured into the skillet; it sizzles and steams and a wooden spatula scrapes the bottom." },
  c55: { first: `Close view from above of a thick seared bone-in pork chop on a worn wooden cutting board on a long scarred wooden plank table, a clean steel knife lying on the board beside it and a fork stuck upright in the meat. No hands in the frame, nobody touching it.`,
         last: `The same close view: the pork chop cut open next to the bone, the inside juicy and faintly pink right by the bone, a little clear juice on the board.`,
         prompt: "The spatula lifts away. A weathered hand with a small kitchen knife cuts into the browned pork chop in the skillet right next to the bone and gently opens the cut: the inside is moist and juicy, pale with a faint rosy blush by the bone, clear juice runs into the pan." },
  c58: { first: `Close view of a white enamel plate on a long scarred wooden plank table with four seared pork chops topped with melting butter, a large spoon full of soft onions and pan juices coming over them.`,
         last: `The same close view: the onions and pan juices spooned over the chops, glossy sauce running down the sides onto the plate.`,
         prompt: "A spoon pours soft onions and pan juices over the chops; the sauce runs down the sides." },
  c83: { first: `Close view of a seared bone-in pork chop on a white enamel plate on a long scarred wooden plank table, a knife and fork starting to cut it.`,
         last: `The same close view: the pork chop cut, clear juice running out along the cut and pooling by the bone on the plate.`,
         prompt: "The knife cuts into the pork chop and juice runs out of the cut and pools by the bone." },
};
export const STOCK2 = {
  c01: "pouring broth pan", c45: "pouring broth skillet", c58: "spooning sauce meat", c83: "pork chop plate",
  c13: "pork loin raw", c14: "frying pan meat", c15: "pork chop plate",
  c28: "thick pork chop", c29: "meat display case", c30: "butcher shop",
  c38: "ranch horses", c39: "cowboy hat", c40: "ranch barn",
  c73: "grocery shopping", c76: "leftovers fridge",
  c85: "fresh pork", c86: "raw pork closeup", c87: "meat packaging", c88: "meat counter", c89: "seasoning meat",
  c93: "cast iron campfire", c94: "campfire cooking", c95: "cowboys cattle",
  c107: "pork tenderloin", c108: "pork cuts", c109: "cutting pork", c110: "pork shoulder raw",
  c111: "pork loin slices", c117: "meat cutting board",
  c113: "cowboy riding", c114: "cattle herd", c115: "horses sunset",
  c119: "salt flakes", c120: "table salt", c121: "salt bowl",
};
