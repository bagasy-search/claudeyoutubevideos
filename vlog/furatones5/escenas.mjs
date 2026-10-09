// Dirección del VLOG CONTINUO furatones5: por escena, la foto base (= primer cuadro del 1er clip) y por clip
// [acción que hace durante el clip, cómo queda el cuadro al FINAL del clip (= ancla K_i)]. Todo descrito como lo ve
// la cámara de un compañero: manos, material, desgaste, luz real del lugar. Sin vocabulario de cine.
const JORGE = "Jorge Ramírez, a stocky 40-year-old Latin American man with short black hair and a trimmed mustache, wearing a navy zip-up jacket over a navy polo shirt";
const LUCIA = "Lucía Ramírez, a 38-year-old Latin American woman with long dark wavy hair in a low ponytail, a gray long-sleeve t-shirt and jeans";
const SOFIA = "Sofía, a 9-year-old Latin American girl with two braids and a pink sweater";
const DOG = "Bruno, a medium-sized short-haired caramel-colored mixed-breed dog with floppy ears";
const FERRE = "the shopkeeper, a Latin American man about 60 with short gray hair and reading glasses, in a red-and-black plaid flannel shirt";
const COIN = "a small silver coin about 18 millimeters wide";
const WOOL = "a pad of coarse gray steel wool";
const KITCHEN = "the kitchen of a modest one-story Latin American family house: white wall tiles with a blue-and-white patterned tile strip, a speckled gray granite counter, wooden kitchen cabinets, an older white refrigerator with children's crayon drawings held by magnets, a stainless double sink under a window with white iron bars";
export const ESC = {
  lav: { light: "afternoon daylight from a small high window plus a bare ceiling bulb",
    base: `kneels on the white ceramic floor of a small laundry room behind a white front-loading washing machine pulled a little away from the white-painted wall; a yellow-painted steel gas pipe comes out of the wall through a ragged hole much wider than the pipe, dark inside. He holds a small black flashlight in his left hand pointed at the hole and, with the fingertips of his right hand, holds ${COIN} at the edge of the dark gap around the pipe, looking at the camera over his shoulder. A plastic laundry basket with clothes beside the machine.`,
    clips: {
      c01: ["kneels behind the washing machine, the flashlight beam on the gap around the yellow gas pipe, and slowly pushes the coin into the dark gap while talking to the camera", "the coin has slid halfway into the dark gap around the yellow gas pipe, only its edge visible, held between his fingertips, the flashlight beam on it, he looks at the camera"],
      c02: ["lets go and the coin slides all the way through the gap and disappears into the dark hole; he points at the hole with the flashlight and looks at the camera, serious", "his fingers empty next to the ragged hole around the yellow gas pipe, the coin gone through, the flashlight beam lighting the empty dark gap, he looks straight at the camera, serious"] } },
  frente: { light: "gray overcast late autumn afternoon outdoors, soft even daylight, wind",
    base: `stands on the cement path in front of a modest one-story Latin American family house with a cream stucco front wall, a dark green metal front door and white iron window bars; a small front yard with a thin leafless tree, dry brown and yellow autumn leaves covering the path and the grass, gray cloudy sky. He talks to the camera, wind moving his curly hair and the leaves. ${JORGE} stands a few steps behind him near the door, hands in his jacket pockets.`,
    clips: {
      c03: ["stands in front of the house, gestures back at the house with his open hand, dry leaves blow across the path", "he half-turns toward the house pointing at the front door with his thumb, Jorge by the door, leaves on the path"],
      c04: ["kicks a little pile of dry leaves off the cement path with the side of his boot, then nods toward Jorge, who walks up", "Jorge has walked up beside him on the path, both facing the camera, dry leaves around their feet"],
      c05: ["listens while Jorge rubs his hands from the cold and looks worried, Claudio nodding", "Jorge with his arms crossed looking worried, Claudio beside him nodding at the camera"],
      c06: ["holds up his open hand with five fingers spread to the camera, then counts with his fingers", "he holds up his hand with all five fingers spread toward the camera, Jorge beside him"],
      c07: ["lowers his hand and points with one finger toward the side of the house where the garage is, raising his eyebrows", "he points with his index finger toward the side of the house, toward the garage door, looking at the camera with raised eyebrows"],
      c08: ["shakes his head 'no' with a small frown, then takes a small black flashlight out of his shirt pocket and shows it", "he holds up the small black flashlight in his right hand close to the camera"],
      c09: ["switches the flashlight on and off once, and shows a small silver coin between two fingers of the other hand", `he holds the flashlight in one hand and ${COIN} between thumb and finger of the other, both raised toward the camera`],
      c10: ["lowers both hands, his face becomes very serious, he says it slowly, then puts a hand on his chest", "he has his right hand flat on his chest, a warm confident half smile, Jorge behind him"],
      c11: ["waves Jorge closer with his hand, Jorge steps in, Claudio puts a hand on his shoulder", "Claudio with his hand on Jorge's shoulder, both facing the camera, Jorge starting to talk"],
      c12: ["Jorge explains with his hands, making a small scratching gesture with his fingers; Claudio listens and nods", "Jorge holds his thumb and finger a few millimeters apart showing something tiny, Claudio watching him"],
      c13: ["Jorge mimes opening a cupboard and shows with his hands the corner of a bag being bitten; Claudio grimaces", "Claudio facing the camera again, Jorge beside him shaking his head, the house behind"],
      c14: ["walks a few steps with Jorge toward the front door, pointing at the door, talking over his shoulder to the camera", "both stand at the dark green front door, Claudio looks back over his shoulder at the camera"],
      c15: ["stands at the door rubbing his arms from the cold, a gust blows leaves against the bottom of the door; he points at the leaves", "he crouches slightly pointing at the gap under the green front door where dry leaves are piled"],
      c16: [`stands up holding ${COIN} up to the camera between thumb and index finger, very close`, `${COIN} held very close to the camera between his thumb and index finger, his face behind it`],
      c17: ["holds the coin in one hand and the flashlight in the other, raises both, then lowers them and taps the coin with the flashlight", "he holds the coin and the flashlight together in his hands at chest height, looking at the camera"],
      c18: ["turns to Jorge who holds up three fingers; Claudio shakes his head and points at the house wall", "Claudio points firmly at the cream stucco wall of the house, Jorge beside him with three fingers raised"] } },
  ferre: { light: "white fluorescent tube light inside the shop plus daylight from the open front door",
    base: `stands at the worn wooden counter of a small neighborhood hardware store, the counter has a scratched glass top with screws and small parts under it; shelves behind full of boxes of screws, rolls of rope, cans of paint, brooms, tools hanging on a pegboard. ${FERRE} stands behind the counter. Claudio leans on the counter looking at the camera.`,
    clips: {
      c19: ["leans on the counter talking to the camera, then turns to the shopkeeper and speaks to him, counting four items on his fingers", "Claudio turned toward the shopkeeper counting on his fingers; the shopkeeper nods and reaches toward a shelf"],
      c20: [`the shopkeeper puts on the counter two pads of steel wool in a plastic bag, a spray can of polyurethane foam, a rolled door draft brush and a small roll of fine metal mesh; Claudio picks up ${WOOL} and shows it to the camera`, `Claudio holds ${WOOL} close to the camera in his open hand, the other items on the counter`],
      c21: ["pulls the steel wool a little apart with his fingers showing how coarse it is, then puts it down and picks up the spray can of polyurethane foam and shakes it", "he holds the yellow spray can of polyurethane foam up next to his face, the steel wool on the counter"],
      c22: ["puts the can down and unrolls the door draft strip on the counter, a long aluminum strip with a rubber brush, running his thumb along the brush", "the door draft strip lies unrolled along the counter, his hand on the rubber brush, the roll of fine metal mesh next to it"],
      c23: ["takes his phone out of his pocket and shows the screen to the camera with a list written on it, then puts a pair of work gloves on the pile; the shopkeeper smiles", "all the items in a pile on the counter with a pair of gray work gloves on top, Claudio paying the shopkeeper with a banknote"] } },
  puerta: { light: "inside the house, daylight from a small window next to the door and a warm ceiling bulb",
    base: `stands in the small entrance hall inside the house, next to the inside of the dark green metal front door: beige ceramic floor tiles, a coat rack with jackets, a light switch on the wall, ${DOG} lying on a mat nearby. He holds the rolled door draft strip and the flashlight, talking to the camera.`,
    clips: {
      c24: ["puts the draft strip down, gets down on one knee by the closed door and switches on the flashlight, aiming it at the floor line under the door", "he kneels by the closed green door, the flashlight on the floor, looking at the bottom edge of the door"],
      c25: ["the hall light goes off; in the dim hall a thin bright line of daylight shows under the door along the floor; he points at it", "the dim hall, a bright thin line of daylight shining under the bottom of the door across the tiles, his finger pointing at it"],
      c26: [`slides ${COIN} standing on its edge into the gap under the door, it goes through without touching; Bruno the dog comes and sniffs his hand`, "the coin standing upright in the gap under the door, Bruno sniffing his hand, he smiles at the dog"],
      c27: ["the light is back on; he measures the width of the door with a yellow tape measure, then cuts the aluminum draft strip with a small hacksaw on the floor", "he holds the cut draft strip up against the bottom of the door, the tape measure on the floor"],
      c28: ["wipes the bottom edge of the door with a cloth, peels the backing tape off the strip and presses it onto the inside bottom of the door, the rubber brush touching the floor", "the draft strip stuck along the bottom of the green door, its rubber brush touching the tiles, his hand pressing it"],
      c29: ["opens and closes the door to test it, the brush sweeps the floor; the light goes off again and there is no line of light under the door anymore; he tries the coin and it does not go in", "dim hall, no light under the door, the coin lying flat on the floor against the brush, he points at it pleased"],
      c30: ["walks to the back patio door, a white door with a glass pane, kneels and puts his finger in a wide gap under it", "he kneels at the white patio door with his index finger inside the wide gap under the door"] } },
  cocina: { light: "daylight from the window and a warm ceiling bulb",
    base: `stands in ${KITCHEN}, next to the closed wooden cabinet under the sink, talking to the camera.`,
    clips: {
      c31: ["opens the wooden cabinet doors under the sink, takes out bottles of cleaning products and puts them on the floor, kneels with the flashlight", "he kneels in front of the open cabinet under the sink, cleaning bottles on the floor, the flashlight pointing inside"],
      c32: ["leans into the cabinet, the flashlight lighting the back wall where the gray drain pipe goes into the wall through a ragged hole much bigger than the pipe", "inside the cabinet: the gray drain pipe entering the back wall through a ragged hole much wider than the pipe, lit by his flashlight, his face beside it"],
      c33: [`pushes ${COIN} through the gap beside the pipe, it falls through; he takes a pair of gray work gloves and pulls them on`, "he pulls on the second gray work glove, kneeling at the open cabinet"],
      c34: [`tears a piece off ${WOOL}, rolls it into a thick sausage and pushes it into the gap around the pipe with a flathead screwdriver, pressing hard`, "close view inside the cabinet: his gloved hand pressing the steel wool into the gap around the drain pipe with the screwdriver, knuckles tense"],
      c35: ["keeps stuffing more steel wool with the screwdriver until the gap is packed tight, then tugs at it with his fingers to show it does not come out", "the gap around the drain pipe packed tight with gray steel wool, his gloved fingers tugging at it"],
      c36: ["shakes the yellow spray can of polyurethane foam and sprays a thin bead around the steel wool; the pale yellow foam swells slowly", "a ring of pale yellow foam swelling around the drain pipe over the steel wool, the can in his gloved hand"],
      c37: ["stands up and with Jorge pulls the old white refrigerator out from the wall; behind it, the wall with a water pipe hole and dust on the floor", `the refrigerator pulled out, ${JORGE.replace("wearing a navy zip-up jacket over", "in")} holding it, Claudio crouching behind it with the flashlight`],
      c38: ["points the flashlight at a small closed plastic bottle cap on the floor in the corner behind the refrigerator, does not touch it", "the flashlight beam on a small closed white plastic cap sitting on the floor in the corner behind the refrigerator, his finger pointing at it without touching"] } },
  lav2: { light: "afternoon daylight from a small high window plus a bare ceiling bulb",
    base: `kneels on the white ceramic floor of a small laundry room behind a white front-loading washing machine pulled away from the white-painted wall, wearing gray work gloves; a yellow-painted steel gas pipe comes out of the wall through a ragged hole much wider than the pipe. He holds ${WOOL} and a flathead screwdriver, looking at the camera.`,
    clips: {
      c39: ["presses the steel wool into the gap around the yellow gas pipe with the screwdriver, packing it tight, then sprays a thin bead of pale yellow foam around it", "the hole around the yellow gas pipe packed with steel wool and a thin ring of pale yellow foam, his gloved hand resting on the wall"],
      c40: ["touches the hole edge and holds his hand away from the pipe, shaking his finger 'no' toward the pipe", "his gloved hand held open near the sealed hole without touching the yellow pipe, he looks at the camera, serious"] } },
  patio: { light: "gray overcast autumn daylight outdoors",
    base: `walks out into the narrow side patio of the house: cement floor with dry leaves, a cream stucco exterior wall with a low rectangular louvered metal vent grille near the ground, and further along a small round-holed vent grille next to a yellow gas pipe and a gas meter; potted plants along the wall. He carries the roll of fine metal mesh and tin snips.`,
    clips: {
      c41: ["crouches in front of the low rectangular louvered vent grille and shines the flashlight between the slats: there is nothing behind them, just a dark hole", "he crouches at the louvered vent grille, the flashlight beam between the slats showing the empty dark hole behind"],
      c42: [`pushes ${COIN} between the slats of the grille and it falls inside`, "his fingers at the slats of the grille, the coin gone inside, he looks at the camera"],
      c43: ["unrolls the fine metal mesh on the cement and cuts a square bigger than the grille with tin snips, then folds the sharp edges inward with his gloved fingers", "a square of fine metal mesh with folded edges in his gloved hands, the tin snips on the cement"],
      c44: ["unscrews the two screws of the grille with a screwdriver, puts the mesh behind it and screws the grille back on", "the louvered grille screwed back on the wall with fine metal mesh visible behind the slats"],
      c45: ["walks along the wall and stops at the small round-holed vent grille next to the yellow gas pipe and the gas meter, pointing at it", "he stands by the round-holed gas vent grille next to the gas meter, pointing at it with a stern face"],
      c46: ["holds his open hand in front of the gas vent feeling the air, then shows a small piece of mesh and shakes his head at a roll of tape", "his open hand in front of the round-holed gas vent grille, the vent open and uncovered, he looks at the camera calmly"] } },
  mesa: { light: "daylight from the window and a warm ceiling bulb",
    base: `sits at a small wooden table in ${KITCHEN}, with a white mug of coffee in front of him; ${LUCIA} pours coffee from a pot into his mug, smiling.`,
    clips: {
      c47: ["thanks Lucía, then opens a printed spiral-bound manual on the table and turns it toward the camera, pointing at a page", "the printed manual lies open on the table, his finger on a page with a heading and numbered steps, the coffee mug next to it"],
      c48: [`runs his finger down the page; ${SOFIA} sits down across the table with a cup of hot chocolate and asks him something`, "Sofía sitting across the table looking at him, Claudio turned to her, the open manual between them"],
      c49: ["explains gently to Sofía, Bruno the dog puts his head on the table edge; Claudio scratches the dog's head", "Claudio scratching Bruno's head at the table, Sofía smiling, the manual and the mugs on the table"] } },
  sala: { light: "daylight from a window with light curtains, a lamp on",
    base: `stands in the modest living room of the house: a beige fabric sofa, a wooden TV stand with a flat TV, family photos on the wall, a white split air-conditioner unit high on the wall with a white cable running down into a hole in the wall. He talks to the camera.`,
    clips: {
      c50: ["climbs two steps of a small aluminum ladder and shines the flashlight at the hole where the air-conditioner cable goes through the wall, a gap around it showing daylight", "close to the wall: the white cable going into a hole much bigger than the cable, a sliver of daylight around it, his flashlight on it"],
      c51: [`gets down, pulls the TV stand a little from the wall and pushes ${COIN} into the gap where the TV cable enters the wall near the floor`, "behind the TV stand: his fingers at the gap around the black TV cable at the bottom of the wall, the coin gone in"],
      c52: ["wearing gloves, pushes steel wool around the cable with the screwdriver without scratching it, sprays a little foam, then trims the dried foam flush with a box cutter", "the TV cable hole neatly sealed with foam trimmed flush with the wall, the box cutter in his gloved hand"] } },
  garaje: { light: "a single bare bulb plus daylight from a half-open roller door",
    base: `stands in a concrete-floored garage that is also the laundry area: gray concrete block walls, a white electric water heater tank mounted in the corner, metal shelves with paint cans and cardboard boxes, a bicycle, a utility sink. He holds the flashlight and the coin, talking to the camera.`,
    clips: {
      c53: ["walks along the shelves pointing at the bottom corners of the walls", "he gets down on one knee near the bottom corner of the concrete wall, flashlight in hand"],
      c54: ["lays the flashlight almost flat on the concrete floor and sweeps the beam slowly along the bottom of the wall, long shadows of every crack", "the flashlight lying almost flat on the floor, its beam raking along the bottom of the wall, his face low near the floor"],
      c55: ["crawls to the corner behind the white water heater and lights a hole at the bottom of the wall filled with old yellowed foam; a ragged tunnel is chewed through the middle of the foam", "close view: an old yellowed lump of foam in a hole at the bottom of the wall behind the water heater, chewed ragged with a tunnel through the middle, lit by the flashlight"],
      c56: ["picks at the chewed foam edge with the tip of the screwdriver, then points the flashlight at the floor beside it: small black shiny droppings like grains of rice", "the flashlight beam on small black droppings on the concrete next to the chewed foam, the screwdriver tip pointing at them"],
      c57: ["takes a small cardboard box with a coin-sized hole cut in one side, puts a snap mouse trap inside and places the box against the wall next to the hole", "a closed cardboard box with a small round hole in its side placed against the wall next to the chewed foam"],
      c58: ["stands up and shows his phone to the camera with a photo of the trap", "he holds his phone close to the camera, the screen shows the cardboard box opened with a trap inside"],
      c59: ["kneels at the hole again with gloves, pulls out the old chewed foam, packs steel wool deep with the screwdriver and sprays fresh foam over it", "the hole behind the water heater packed with steel wool and fresh pale yellow foam, his gloved hand next to it"],
      c60: ["moves to the corner where the washing machine drain hose goes into the wall, tries the coin, packs steel wool and foam, then stands up wiping his hands", "he stands in the garage pulling off his gloves, smiling at the camera"] } },
  noche: { light: "night, lights off, only the beam of his flashlight and faint bluish light from the window",
    base: `stands in the dark ${KITCHEN} at night with the lights off; he holds the flashlight switched off, ${JORGE} beside him, both whispering.`,
    clips: {
      c61: ["switches the flashlight on suddenly and sweeps it over the floor; then crouches and lights the gap behind the refrigerator: clean floor, nothing", "the flashlight beam on the clean floor behind the refrigerator, nothing there, his face lit from below"],
      c62: ["opens the cabinet under the sink with the light: clean; then looks at Jorge and gives a thumbs up; Lucía in the doorway smiling", "in the dark kitchen Claudio gives a thumbs up to the camera, the flashlight in his other hand, Lucía smiling in the doorway"] } },
  techo: { light: "dusk outdoors, last blue daylight, a porch light on",
    base: `stands in the small back yard of the house at dusk, looking up at the edge of the clay tile roof where a long tree branch touches the tiles; ${JORGE} beside him holding a pruning saw.`,
    clips: {
      c63: ["talks seriously to the camera, then traces with his finger in the air a path up the wall to the roof", "he points up the cream wall toward the edge of the clay tile roof"],
      c64: ["points at the tree branch touching the roof tiles; Jorge climbs a ladder and saws the branch, it falls on the grass", "the cut branch lying on the grass, Jorge coming down the ladder with the saw, Claudio smiling"],
      c65: ["holds up the flashlight and the coin to the camera one last time, then puts them in his shirt pocket", "he pats his shirt pocket where the flashlight sticks out, looking at the camera warmly"] } },
  cierre: { light: "daylight from the window and a warm ceiling bulb",
    base: `stands in ${KITCHEN} holding the small black flashlight, talking to the camera.`,
    clips: {
      c66: ["switches off the ceiling light by the door; the kitchen gets darker; he switches the flashlight on and points it at the floor", "the kitchen dimmer, his flashlight beam on the floor in front of the refrigerator"],
      c67: ["sweeps the flashlight under the sink and along the bottom of the cabinets, counting places on his fingers", "the flashlight beam along the bottom of the cabinets, his other hand counting on his fingers"],
      c68: ["switches the ceiling light back on and holds up a printed sheet of paper with a table on it", "the kitchen bright again, he holds up a printed sheet of paper with a table of rows and checkboxes"],
      c69: ["shows the printed sheet to the camera close, pointing at three sections with his finger", "the printed sheet held close to the camera, his finger on the third section"],
      c70: ["kneels at the open cabinet under the sink and tapes the sheet on the inside of the cabinet door with strips of tape", "the printed sheet taped on the inside of the open cabinet door under the sink, his hand smoothing it"],
      c71: ["stands up and points his phone toward the camera as if scanning, then puts it away", "he stands by the sink, smiling, the cabinet door open with the sheet taped inside"],
      c72: ["leans on the counter talking calmly, holding up the printed spiral-bound manual", "he holds the printed manual closed against his chest, leaning on the counter"],
      c73: [`${LUCIA} opens the window over the sink wide; three big black flies fly in buzzing around the window`, "Lucía at the open window, three big black flies in the air over the sink, Claudio looking at them"],
      c74: [`${JORGE.replace("wearing a navy zip-up jacket over", "in")} comes in with an aerosol can; Claudio raises his hand and stops him, shaking his head, then smiles at the camera`, "Claudio's hand on Jorge's arm holding the aerosol can down, Claudio smiling at the camera"],
      c75: ["talks to the camera, raising the coin between two fingers", "he holds the coin up between two fingers, smiling at the camera"],
      c76: ["says goodbye with a warm smile and a small wave of his hand", "he waves at the camera with a warm smile, the kitchen behind him"] } },
};
