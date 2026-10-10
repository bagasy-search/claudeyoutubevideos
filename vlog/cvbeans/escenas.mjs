// Dirección del VLOG CONTINUO cvbeans (Claudio Vaquero #2, frijoles de olla). Por escena: set (lib SETS), la foto base (= 1er cuadro)
// y por clip [UNA acción simple durante el clip, cómo queda el cuadro al FINAL (= ancla K_i)]. Plano = lo que se dice.
// STOCK = metraje real (consulta 2-3 palabras) · DET = plano detalle de comida sin cara (agnes_img_pro first + keyframe con sonido).
// Continuidad de la olla: pintos secos → enjuagados → olla con agua → hervor 2 min → tapa 1 h → hinchados → ham hock/cebolla/chiles/sal →
// hervor perezoso tapa entreabierta → caldo rojo espeso → ham hock desmenuzado → tazón con tortillas → Rusty prueba.
const POT = "a heavy black cast-iron Dutch oven with a heavy black lid that has a visible dent in it";
const BEANS_DONE = "whole creamy pinto beans in a thick red-brown broth with bits of smoked ham";
export const ESC = {
  S00: { set: "A1", base: `stands at the black range with one hand on the dented lid of ${POT} on the burner, a little steam escaping from under the lid, looking straight at the camera.`,
    clips: {
      c01: ["lifts the dented lid off the pot with one hand, a cloud of steam rising, and points at the beans with the other", `the lid held up beside the pot, steam rising from ${BEANS_DONE}, his finger pointing into the pot`] } },
  S01: { set: "A1", base: `stands at the black range beside ${POT} sitting on the back of the stove, one hand resting on the stove edge, talking to the camera.`,
    clips: {
      c02: ["glances back at the pot and points at it with his thumb", "his thumb pointing back over his shoulder at the dented Dutch oven on the stove"],
      c03: ["counts on his fingers, one, two, three, with a doubtful face", "three fingers raised, eyebrows lifted, looking at the camera"],
      c04: ["mimes dumping water out of an imaginary pot, then shakes his head", "both hands lowered, shaking his head slowly with a tired half smile"],
      c05: ["wags his finger 'no' at the camera", "his index finger raised, a firm look"],
      c06: ["smiles and touches his chest with his open hand", "his right hand flat on his chest, a warm smile"],
      c07: ["holds up four fingers then spreads both hands wide to show a big crowd", "both hands spread wide apart at chest height"],
      c08: ["taps the lid of the dented pot twice with his knuckles", "his knuckles resting on the dented lid of the pot, nodding"],
      c09: ["laughs a little and shrugs", "a crooked grin, shoulders relaxed, looking at the camera"] } },
  S02: { set: "A2", base: `stands in front of the wall of hanging cast-iron skillets holding ${POT} by its handle with both hands at chest height.`,
    clips: {
      c10: ["turns the pot so the dented lid faces the camera and taps the dent with a finger", "his finger on the dent in the black lid, the pot held toward the camera"],
      c11: ["sets the heavy pot down on a wooden shelf in front of him with both hands", "the Dutch oven resting on the shelf, both his hands on the lid"],
      c12: ["knocks on the thick iron side of the pot with his knuckles", "his knuckles against the thick black side of the pot, he looks at the camera"],
      c13: ["shrugs and opens one palm, reassuring", "an open palm turned up, a kind half smile"] } },
  S03: { set: "A3", base: `stands at the wooden plank table holding a clear plastic two-pound bag of dry pinto beans up in one hand, a white enamel plate on the table in front of him.`,
    clips: {
      c14: ["pours the dry pinto beans from the bag onto the white enamel plate", "a pile of speckled dry pinto beans on the white plate, the empty bag in his hand"],
      c15: ["spreads the beans out across the plate with his fingertips, looking closely", "his fingertips moving the beans apart on the plate, he picks out a tiny stone"],
      c16: ["holds up a tiny stone between two fingers and grimaces, tapping his jaw", "the little stone held up close to the camera between his fingers, he grins"] } },
  S04: { set: "A3", base: `stands at the wooden plank table holding a metal colander full of dry pinto beans over a big enamel basin, a pitcher of water beside it.`,
    clips: {
      c17: ["pours water from the pitcher over the beans in the colander and rubs them with his hand", "the wet shiny beans in the colander, water dripping into the basin"] } },
  S05: { set: "A3", base: `sits at the wooden plank table with an old stained crew notebook open in front of him, a handful of dry pinto beans in a small bowl beside it.`,
    clips: {
      c18: ["picks up one dry bean and holds it up between two fingers", "a single hard dry pinto bean held up close to the camera"],
      c19: ["drops the bean into a glass of water on the table", "the bean at the bottom of the glass of water, he points at it"],
      c20: ["taps his temple with a finger, 'you have to remember'", "his finger on his temple, a knowing look"],
      c21: ["mimes stirring a pot hard and fast, then stops", "his hand stopped mid-air, a disappointed face"],
      c22: ["shakes his head 'no' and holds up a pinch of salt between his fingers", "a pinch of coarse salt held up between thumb and finger"],
      c23: ["lets the salt fall back into a little salt dish and raises one finger", "his finger raised, a serious look at the camera"],
      c24: ["makes a fist and knocks it gently against the table twice, then opens his hand slowly", "his open hand lying flat and calm on the table"] } },
  S06: { set: "A3", base: `sits at the wooden plank table with the old crew notebook open in front of him, one hand flat on the page.`,
    clips: {
      c25: ["closes the notebook slowly and smiles, remembering", "the notebook closed under his hand, a nostalgic smile"] } },
  S07: { set: "A1", base: `stands at the black range; ${POT} sits on the burner with the lid off, dry pinto beans in the bottom, a big enamel pitcher of water in his hand.`,
    clips: {
      c26: ["pours the water from the pitcher into the pot over the beans", "the pot full of water almost to the top, the empty pitcher in his hand, he looks at the camera"] } },
  S09: { set: "A1", base: `stands at the black range; ${POT} on the burner, the water inside boiling hard with big bubbles, steam rising, an old wind-up kitchen timer on the stove beside it.`,
    clips: {
      c28: ["sets the heavy dented lid on the boiling pot", "the lid on the pot, his hand pulling back, the kitchen timer beside it"],
      c29: ["points at the closed pot and holds up one finger, 'one hour'", "his index finger raised beside the closed pot"],
      c30: ["looks at his watch and grins", "a satisfied grin at the camera, his wrist with an old watch raised"] } },
  S11: { set: "A3", base: `stands at the wooden plank table; on a cutting board in front of him: a smoked ham hock, a large white onion, a head of garlic, two dried dark red ancho chiles, a small can of lard and a box of kosher salt.`,
    clips: {
      c35: ["holds up the smoked ham hock in one hand, then cuts the onion in half with a big knife", "the onion cut in two halves on the board, the ham hock lying beside it"],
      c36: ["smashes a garlic clove with the flat side of the knife", "the smashed garlic cloves on the board, his palm on the flat of the knife"],
      c37: ["pulls the stem off a dried ancho chile and shakes the seeds out", "the opened dark red chile in his hand, seeds on the board"],
      c38: ["holds up the dried chile toward the camera and smiles", "the dark red dried chile held up next to his face, a small smile"] } },
  S12: { set: "A1", base: `stands at the black range with ${POT} on the burner, the dented lid on, an old wind-up kitchen timer beside it.`,
    clips: {
      c39: ["lifts the dented lid off the pot and looks inside", "the lid held up, swollen pinto beans in cloudy light-brown water in the pot, a little steam rising"] } },
  S13: { set: "A1", base: `stands at the black range holding ${POT} by both handles with the lid off, the swollen beans in cloudy brown water inside, as if about to tip it toward the sink, but he does not tip it.`,
    clips: {
      c40: ["sets the pot back down on the burner and wags his finger 'no'", "the pot back on the burner, his finger wagging, a grin"],
      c41: ["points out the window with his thumb toward the windmill outside", "his thumb pointing over his shoulder, a knowing look at the camera"] } },
  S14: { set: "A1", base: `stands at the black range; ${POT} on the burner full of swollen beans in brown water; beside the stove a plate with a smoked ham hock, two onion halves, smashed garlic and two dried red chiles.`,
    clips: {
      c42: ["drops the ham hock, the two onion halves and the smashed garlic into the pot", "the ham hock and the onion halves floating among the beans, his hand pulling back"],
      c43: ["sprinkles two teaspoons of salt from a little measuring spoon into the pot", "the salt falling into the pot, he looks at the camera with a calm nod"] } },
  S15: { set: "A1", base: `stands at the black range turning the burner knob down; ${POT} on the burner, beans and broth just starting to bubble gently, the ham hock and onion halves floating.`,
    clips: {
      c45: ["sets the dented lid on the pot leaving a gap of about an inch open", "the lid resting cracked open an inch, a thin line of steam escaping from the gap"] } },
  S16: { set: "A1", base: `stands at the black range holding a long wooden spoon over ${POT} with the lid off, the beans simmering in a red-brown broth, a dented steel kettle on the back of the stove.`,
    clips: {
      c46: ["stirs the beans slowly from the bottom of the pot with the wooden spoon", "the wooden spoon resting in the pot, the beans moving gently in the broth"],
      c47: ["pours hot water from the steel kettle into the pot", "the kettle lifted away from the pot, steam rising from the kettle spout"] } },
  S17: { set: "A4", base: `stands by the deep window holding a chipped enamel cup of black coffee, the dusty corral and two horses outside behind him.`,
    clips: {
      c48: ["takes a sip of coffee and looks out the window, then back at the camera", "the cup lowered, a relaxed smile at the camera, the horses outside"] } },
  S18: { set: "A3", base: `stands at the wooden plank table holding a big spoon with five cooked pinto beans in it, a white enamel bowl of beans in broth beside him.`,
    clips: {
      c49: ["holds up the spoon with one bean, then shakes his head", "one bean on the spoon held up, he shakes his head with a frown"],
      c50: ["counts five beans into his palm from the spoon and blows on them", "five beans in his open palm, held toward the camera"],
      c51: ["bites one bean in half and looks closely at the inside", "half a bean held up between his fingers showing the creamy inside, he nods"] } },
  S19: { set: "A1", base: `stands at the black range; beside ${POT} a white enamel plate with the cooked smoked ham hock on it, a fork in his hand.`,
    clips: {
      c52: ["pulls the tender meat off the ham hock bone with a fork", "a pile of shredded ham on the plate, the bare bone pushed aside"],
      c53: ["lifts a soft cooked onion half out of the pot with a slotted spoon", "the soft onion half on the slotted spoon held over the pot, dripping"] } },
  S20: { set: "A3", base: `stands at the wooden plank table holding a wooden spoon of red-brown bean broth up to his mouth, the pot on a trivet in front of him, a small dish of salt beside it.`,
    clips: {
      c54: ["blows on the broth and tastes it from the spoon, thinking", "the spoon lowered, he tilts his head, considering, a pinch of salt between his fingers"] } },
  S21: { set: "A3", base: `sits at the wooden plank table in front of a white enamel bowl of ${BEANS_DONE}, a spoon in his hand, a stack of warm flour tortillas beside it.`,
    clips: {
      c55: ["eats a spoonful of beans and broth slowly, savoring it", "chewing with his eyes closed, the spoon lowered, a happy nod"] } },
  S22: { set: "A3", rusty: true, base: `stands at the wooden plank table with a white enamel bowl of ${BEANS_DONE} and a stack of warm flour tortillas, turning toward the open kitchen door.`,
    clips: {
      c56: ["waves someone over toward the table", "his hand raised in a wave toward the door, smiling"] } },
  S23: { set: "A3", rusty: true, base: `stands at the wooden plank table; next to him the other man sits eating a bowl of ${BEANS_DONE} with a spoon, a flour tortilla in his other hand.`,
    clips: {
      c57: ["points at the man eating and laughs", "Claudio's hand on the man's shoulder, both of them smiling, the man holding up his empty bowl for more"] } },
  S24: { set: "A1", base: `stands at the black range wiping a wooden spoon with a dish towel, ${POT} behind him on the stove.`,
    clips: {
      c58: ["hangs the towel on the stove rail and raises one finger", "his finger raised, a serious look at the camera"] } },
  S25: { set: "A3", base: `sits at the wooden plank table with the old crew notebook open to a handwritten page, a pencil beside it, a glass jar of dry pinto beans and a small box of baking soda on the table.`,
    clips: {
      c59: ["runs his finger down a handwritten list in the notebook", "his finger stopped on a line of old handwriting, he looks up"],
      c60: ["picks up the jar of dry beans and turns it, looking at them", "the jar of beans held up toward the light"],
      c61: ["sets the jar down and taps the lid twice", "his hand resting on the jar lid"],
      c63: ["holds a tiny pinch of baking soda between his fingers and wags a finger of the other hand", "a tiny pinch held up, the other finger raised in warning"],
      c64: ["pushes an imaginary pot halfway off a burner with both hands", "both hands stopped mid-push on the table edge"],
      c65: ["points at the notebook and nods", "his finger on the notebook page, nodding"],
      c66: ["mimes pouring from one pot into another carefully, leaving the bottom behind", "his hands tilted in the air as if pouring, a careful look"] } },
  S26: { set: "A3", base: `stands at the wooden plank table with three small white bowls of dry beans in front of him: speckled pinto beans, shiny black beans and dark red kidney beans.`,
    clips: {
      c67: ["points at the bowl of black beans, then the white beans, nodding", "his finger pointing at the bowl of black beans"],
      c68: ["holds up the bowl of red kidney beans and raises ten fingers", "the bowl of red kidney beans held up, a serious warning look"] } },
  S27: { set: "A3", base: `stands at the wooden plank table holding a smoked ham hock in butcher paper, a package of thick-cut bacon and a slab of salt pork on the table.`,
    clips: {
      c69: ["unwraps the butcher paper and shows the smoked ham hock to the camera", "the dark smoked ham hock held up in the open paper"],
      c70: ["puts down the ham hock and picks up the package of thick bacon", "the package of thick bacon held up beside his face"],
      c71: ["sets the bacon down and holds up a small tin of smoked paprika", "the tin of smoked paprika held up, a small shrug"] } },
  S28: { set: "A3", base: `stands at the wooden plank table filling a plastic freezer bag with beans and broth from a ladle, the pot on a trivet beside him, three filled flat bags already on the table.`,
    clips: {
      c72: ["finishes ladling beans into the bag", "the full bag of beans and broth held up, the ladle back in the pot"],
      c73: ["seals the bag and lays it flat on top of the others, pressing it flat", "a neat flat stack of four freezer bags of beans on the table"],
      c74: ["taps the stack of bags and smiles", "his hand resting on the stack of bags, a satisfied smile"] } },
  S31: { set: "A1", base: `stands at the black range with a big wooden spoon in ${POT} full of ${BEANS_DONE}, the lid off.`,
    clips: {
      c80: ["presses a spoonful of beans against the inside wall of the pot with the back of the spoon", "a smear of mashed beans on the inside wall of the pot, the spoon pressing"],
      c81: ["stirs the mashed beans back into the broth slowly", "the broth thicker and creamy, the spoon lifted, he nods at the camera"] } },
  S35: { set: "A1", base: `stands at the black range with two big black cast-iron pots side by side on the burners, steam rising from both.`,
    clips: {
      c91: ["holds up two fingers and points at each pot", "two fingers raised, the two pots side by side"],
      c92: ["lifts the lid of one pot to look inside, then sets it back", "the lid back on, both his hands resting on the stove rail"] } },
  S37: { set: "A2", base: `stands in front of the wall of hanging cast-iron skillets holding a long wooden spoon, an old pressure cooker and an electric slow cooker on the shelf beside him.`,
    clips: {
      c95: ["holds up a dried red chile and shrugs", "the dried chile held up, a relaxed shrug"],
      c96: ["points the wooden spoon at the pressure cooker, then the slow cooker", "the spoon pointing at the slow cooker"],
      c97: ["nods slowly, then tilts his hand side to side, 'so-so'", "his flat hand tilted, a half smile"],
      c98: ["holds up two fingers, then one finger", "one finger raised, a firm look"],
      c99: ["picks up a can of beans from the shelf and looks at it, unimpressed", "the can of beans held at arm's length, an unimpressed face"] } },
  S38: { set: "A3", base: `stands at the wooden plank table holding up a clear plastic two-pound bag of dry pinto beans in both hands.`,
    clips: {
      c100: ["turns the bag of beans slowly in his hands, looking closely through the plastic", "the bag held close to the camera, smooth speckled pink-and-brown pinto beans visible through the plastic"] } },
  S39: { set: "A3", base: `stands at the wooden plank table holding a salt shaker over ${POT} sitting on a trivet, shaking his head.`,
    clips: {
      c103: ["shakes his head slowly, salt shaker held still", "the shaker held still over the pot, a skeptical look"],
      c104: ["sets the shaker down and holds up two fingers, 'two pots'", "two fingers held up, remembering"],
      c105: ["nods and smiles, pointing at the pot", "his finger pointing into the pot, a proud smile"],
      c106: ["counts three fingers, one by one", "three fingers raised, a serious look"],
      c107: ["holds up a tomato and shakes it 'not yet'", "the tomato held up, a small grin"] } },
  S41: { set: "A3", base: `stands at the wooden plank table holding a white enamel bowl of ${BEANS_DONE} in one hand and a spoon in the other.`,
    clips: {
      c112: ["laughs and shrugs, a little embarrassed", "a wide grin at the camera, the bowl held steady"],
      c113: ["takes a spoonful of beans and eats it", "chewing, nodding with satisfaction"],
      c114: ["holds up five fingers", "five fingers raised beside the bowl, a firm nod"] } },
  S42: { set: "A3", base: `stands at a deep white enamel sink filled with cold water, ${POT} sitting in the water, a wooden spoon in his hand, shallow glass containers on the counter beside him.`,
    clips: {
      c115: ["stirs the beans in the pot sitting in the cold water", "the spoon resting in the pot, cold water around it"],
      c116: ["ladles beans into a shallow glass container", "a shallow container full of beans on the counter"],
      c117: ["snaps a lid onto the container and taps it", "the closed container under his hand, a firm nod"] } },
  S43: { set: "A3", base: `sits at the wooden plank table with the old crew notebook in front of him, its pages stained with grease and coffee, turning a page.`,
    clips: {
      c118: ["turns a stained page and smiles at a handwritten recipe", "his finger on an old handwritten recipe, smiling"],
      c119: ["closes the notebook and picks up a printed cookbook with a leather-brown cover", "the printed cookbook held up in both hands toward the camera"] } },
  S44: { set: "A3", base: `stands at the wooden plank table holding a thick printed cookbook open with both hands, a photo of a pot of pinto beans on the open page.`,
    clips: {
      c120: ["turns the open book toward the camera and taps the bean photo", "his finger on the photo of the beans on the open page"],
      c121: ["flips a few pages forward, then closes the book", "the closed cookbook held in one hand against his chest"],
      c122: ["points down at the bottom of the screen", "his finger pointing down, a warm smile"] } },
  S45: { set: "A1", base: `stands at the black range with one hand on the dented lid of ${POT}, a big covered roasting pan on the stove beside it.`,
    clips: {
      c123: ["sets the lid on the pot and holds up two fingers", "two fingers raised beside the closed pot, a grin"],
      c124: ["taps the roasting pan, then waves goodbye at the camera", "his hand raised in a goodbye wave, smiling"] } },
};
export const STOCK = {
  c17: "rinsing beans", c27: "boiling pot",
  c24: "boiling beans", 
  c31: "cattle roundup", c32: "cowboys horses", c33: "cattle herd", c34: "cowboy horse",
  c44: "beans simmering", c62: "faucet water",
  c75: "refried beans", c76: "pinto beans", c77: "eggs tortilla",
  c78: "bean soup", c79: "bowl soup",
  c82: "frying bacon", c83: "chopping jalapeno", c84: "chopping cilantro",
  c85: "ranch sunset", c86: "horses sunset",
  c87: "pinto beans", c88: "dry beans", c89: "family dinner", c90: "old ranch",
  c93: "dutch oven campfire", c94: "campfire cooking",
  c101: "dried beans", c102: "grocery store",
  c108: "branding cattle", c109: "mule", c110: "campfire pot", c111: "mule farm",
};
export const STOCK2 = {
  c17: "washing beans", c27: "boiling water",
  c24: "beans boiling pot", 
  c31: "cowboys cattle", c32: "riding horses", c33: "ranch cattle", c34: "ranch horses",
  c44: "simmering pot", c62: "kitchen faucet",
  c75: "frying beans", c76: "cooked beans", c77: "breakfast tacos",
  c78: "beans bowl", c79: "tortillas",
  c82: "bacon skillet", c83: "chopping tomato", c84: "fresh cilantro",
  c85: "corral sunset", c86: "ranch horses",
  c87: "beans bag", c88: "ham hock", c89: "tortillas", c90: "ranch kitchen",
  c93: "cast iron campfire", c94: "campfire coals",
  c101: "beans pantry", c102: "supermarket aisle",
  c108: "cowboy campfire", c109: "donkey", c110: "campfire coals", c111: "old mule",
};
const STOVE = "an old black cast-iron wood-burning cook stove, whitewashed adobe wall darkened with soot behind it";
export const DET = {}; // los 5 DET de agnes-image salieron sartén/huevos/mortadela → pasaron a STOCK real
const _DET_VIEJO = {
  c39: { first: `Close view from above into ${POT} on ${STOVE}, the lid just lifted off: plump swollen pinto beans in cloudy light-brown water, a little steam rising. Nobody in the frame, no hands.`,
         prompt: "The heavy lid lifts away and steam drifts up off the swollen beans in the cloudy water; nothing else moves." },
  c42: { first: `Close view from above into ${POT} on ${STOVE}: swollen pinto beans in brown water, a smoked ham hock and two halves of a white onion just dropped in, two dried red chiles floating.`,
         prompt: "A weathered hand drops smashed garlic cloves and a spoon of lard into the pot; they sink among the beans, the onion halves bob." },
  c55: { first: `Close view of a white enamel bowl on a long scarred wooden plank table full of ${BEANS_DONE}, a spoon resting in it, a stack of warm flour tortillas beside it, steam rising. Nobody in the frame, no hands, no people.`,
         prompt: "A spoon lifts a spoonful of creamy beans and broth out of the bowl, steam rising, and lowers it back." },
  c100: { first: `Close view of a clear plastic one-pound bag of dry pinto beans lying on a long scarred wooden plank table: smooth, slightly shiny beans speckled pink and brown, all about the same size, a few loose beans spilled on the boards beside the bag. Nobody in the frame, no hands, no people.`,
         prompt: "A few loose pinto beans roll slowly across the wooden boards and come to rest beside the bag; nothing else moves." },
  c24: { first: `Close view into ${POT} on ${STOVE}: pinto beans tumbling in a hard rolling boil, big bubbles, some bean skins split. Nobody in the frame, no hands, no people.`,
         prompt: "The beans tumble and knock against each other in the hard rolling boil, big bubbles bursting." },
};
export const TOPIC = "pinto beans (frijoles de olla)";
