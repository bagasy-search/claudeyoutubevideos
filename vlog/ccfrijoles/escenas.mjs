// Dirección del VLOG CONTINUO ccfrijoles (Claudio Cocina, la fonda). Por escena: set (maestra M1-M4 de vlog/cc/lib.mjs), estado de
// la comida en ESA escena (tabla abajo; nunca se contradice entre escenas) y por clip [acción durante el clip, cuadro FINAL = ancla].
// Acciones simplísimas (agnes): un gesto por clip, manos visibles, nada que aparezca de la nada.
//
// TABLA DE ESTADO DE LA COMIDA (orden de la historia)
//   salon       M4  sin cocina: mesas vacías con manteles de flores, salón abierto de mañana.
//   mesa_*      M2  bolsa transparente de 1 kg de frijol pinto SECO cerrada sobre la mesa + la libreta.
//   mesa_limpia M2  el kilo de pinto seco desparramado en una charola de lámina; media cebolla blanca, 3 dientes de ajo,
//                   cazuelita de barro con manteca blanca, cazuelita de sal gruesa, rama de epazote; frasco de vidrio con piedritas.
//   estufa_a    M1  olla de barro VACÍA y seca en la hornilla apagada → frijol enjuagado (colador) + agua → fuego alto.
//   estufa_b    M1  la olla HIERVE fuerte, agua turbia con espuma; temporizador blanco de cuerda junto a la estufa.
//   estufa_c    M1  apaga el fuego, tapa de barro puesta.
//   pica        M2  tabla con cebolla y jitomates picándose (la olla tapada NO se ve: está en la estufa).
//   estufa_d    M1  tapa fuera: frijol hinchado, liso, agua café oscura; entra media cebolla, ajo, manteca, sal; fuego bajo, tapa entreabierta.
//   estufa_e    M1  hierve bajito, tapa entreabierta, caldo café; tetera de peltre azul calentando en la hornilla de al lado; cucharón de madera;
//                   al final entra la rama de epazote.
//   servir      M4  en una mesa: plato hondo de barro con frijoles de olla y bastante caldo; cazuelitas con cebolla picada, cilantro,
//                   serrano picado, queso fresco; tortillas en una servilleta bordada; jarrito de barro con caldo.
//   estufa_res  M1  olla terminada destapada, caldo espeso café brillante.
//   mesa_cta1   M2  la libreta abierta.
//   chuy        M4  don Chuy sentado en su mesa con un plato hondo de frijoles de olla y tortillas.
//   preguntas   M3  junto a la ventana: cazuelita de barro con frijoles cocidos y un tenedor en la repisa.
//   sarten_*    M1  sartén de fierro negro con mango en la hornilla de adelante (la olla de barro atrás, tapada): manteca → cebolla
//                   dorada → frijoles → machacados con machacador de madera, jarrito de caldo al lado; queso fresco al final.
//   costo*      M2  sobre la mesa: bolsa de 1 kg de pinto, media cebolla, ajo, cazuelita de manteca, rama de epazote.
const OLLA = "the big reddish clay olla de barro with two handles";
const BAG = "a clear plastic one-kilo bag of dry speckled beige-and-brown pinto beans";
const PAN = "a heavy black cast-iron frying pan with a handle";
export const ESC = {
  salon: { set: "M4", light: "ordinary morning daylight from the open street door",
    base: "stands in the small dining room of the fonda between the wooden tables with flowered oilcloth tablecloths, the tables still empty, a short wooden stool in the corner by the counter, talking to the camera with one hand open",
    clips: {
      c01: ["walks slowly between the empty tables talking to the camera and gestures around the room with his open hand", "he stands between two tables, his open hand gesturing at the dining room"],
      c02: ["points with his finger at the short wooden stool in the corner by the counter, smiling", "he points at the short wooden stool in the corner, smiling at the camera"],
      c03: ["lowers his hand and counts on his fingers while he talks", "he holds up three fingers, counting"],
      c04: ["taps the edge of a table with two fingers, serious", "his hand rests flat on a flowered tablecloth, he looks at the camera"],
      c05: ["nods toward the kitchen door behind the counter", "he looks toward the kitchen door, then back at the camera"],
      c06: ["shakes his head with a small smile", "he shakes his head, a half smile"],
      c07: ["pulls a painted wooden chair a little out from a table by the window and rests his hand on its back", "his hand on the back of a painted wooden chair by the window table"],
      c08: ["pats the back of the chair twice, smiling", "he smiles with his hand on the chair back"],
      c09: ["lets go of the chair and puts his hand on his chest", "his right hand flat on his chest, sure of himself"],
      c10: ["raises one finger as if quoting his mother", "he holds up one finger, eyebrows raised"],
      c11: ["lowers his hand and taps his wrist where a watch would be", "he taps his bare wrist with two fingers"],
      c12: ["walks two steps toward the counter, talking over his shoulder", "he stands at the tiled counter, half turned to the camera"],
      c13: ["leans one hand on the tiled counter and nods", "he leans on the counter with one hand, nodding"],
      c14: ["holds up two fingers toward the camera", "he holds up two fingers"],
      c15: ["turns his hand palm down and lowers it slowly, as if turning down a flame", "his flat hand low and still, palm down"],
      c16: ["opens both arms toward the empty tables, smiling", "both arms open toward the tables, smiling"],
      c17: ["crosses his arms and tilts his head", "he stands with his arms crossed, head tilted"],
      c18: ["rubs his eyes with one hand as if tired, then lowers it", "he lowers his hand from his face, eyebrows raised"],
      c19: ["wags his index finger slowly 'no', firm", "his index finger raised, firm face"] } },
  mesa_err: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table, ${BAG} lying closed on the table next to the recipe notebook, talking to the camera`,
    clips: { c20: ["picks up the bag of dry pinto beans and holds it up to the camera, then shrugs kindly", "he holds the bag of dry pinto beans up at chest height, a kind half smile"] } },
  mesa_hist: { set: "M2", light: "soft morning daylight from a side window",
    base: `leans with both hands on the thick worn wooden work table, ${BAG} lying closed on the table next to the recipe notebook, looking at the camera`,
    clips: {
      c21: ["leans on the table with both hands and looks down for a moment, remembering, then looks up", "he leans on the table with both hands, looking up at the camera with a sheepish smile"],
      c22: ["straightens up and imitates someone tasting a bean with two fingers, then looks at the camera seriously", "he stands straight with his eyebrows raised, two fingers near his mouth"],
      c23: ["laughs quietly and shakes his head, tapping the notebook with his finger", "his finger on the closed recipe notebook, smiling and shaking his head"] } },
  mesa_limpia: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands behind the thick worn wooden work table; on the table a flat dented metal tray covered with a single layer of dry speckled beige-and-brown pinto beans, half a white onion, three garlic cloves, a small clay bowl of white lard, a small clay bowl of coarse salt, a sprig of green epazote, and a small glass jar with little gray stones in it; he talks to the camera with his hands on the table",
    clips: {
      c24: ["points at the tray of beans and then at the half onion while he talks", "his finger points at the half white onion on the table"],
      c25: ["touches the garlic cloves, the bowl of lard and the salt one after another, then picks up the epazote sprig", "he holds the green epazote sprig up to the camera"],
      c26: ["puts the sprig down and picks up a few dry beans from the tray in his open palm, showing them", "a few dry pinto beans in his open palm held toward the camera"],
      c27: ["lets the beans fall back onto the tray and talks with his hands open", "his hands open over the tray of beans, explaining"],
      c28: ["passes his flat hand slowly over the beans in the tray, spreading them, looking down at them", "his flat hand spreading the dry beans in the tray, his eyes on them"],
      c29: ["picks a tiny gray stone out of the beans with two fingers, shows it to the camera and drops it into the small glass jar", "the tiny stone held between his fingertips over the glass jar of little stones"] } },
  estufa_a: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the old white gas stove with all burners off; on the front burner ${OLLA} sits empty and dry with its clay lid beside it; on the counter next to the stove a metal colander full of wet rinsed pinto beans and a big plastic jug of water; he rests one hand on the rim of the olla and talks to the camera`,
    clips: {
      c30: ["pats the round belly of the empty clay olla with his palm, proud", "his hand on the side of the empty clay olla, proud smile"],
      c31: ["tilts the empty olla a little toward the camera so the dark glazed inside shows, then sets it straight", "the empty clay olla set straight on the burner, he points inside it"],
      c32: ["wags his finger and makes a cracking gesture with both hands", "both hands held apart as if something cracked, serious face"],
      c33: ["tips the colander of wet beans into the olla and then pours water from the jug over them", "the olla full of water with the beans under it, the empty colander and jug on the counter"],
      c34: ["turns the knob of the burner and a tall blue gas flame lights under the olla", "a strong blue flame under the clay olla full of water and beans, his hand on the knob"] } },
  estufa_b: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; on the front burner ${OLLA} boils hard on a strong blue flame, cloudy water bubbling with a little beige foam, steam rising; a small white wind-up kitchen timer sits on the stove edge; he looks at the camera`,
    clips: {
      c35: ["picks up the small white kitchen timer, turns its dial and holds up two fingers", "he holds the white kitchen timer in one hand and two fingers up with the other, the olla boiling"],
      c36: ["sets the timer down and points at the boiling water with the wooden spoon", "the wooden spoon pointing at the boiling beans, steam rising"],
      c37: ["nods calmly looking at the olla", "he looks into the boiling olla, nodding"] } },
  estufa_c: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the old white gas stove; ${OLLA} on the front burner full of hot cloudy water with beans, steam rising, a blue flame under it; the clay lid on the counter beside the stove`,
    clips: {
      c38: ["turns the knob and the flame goes out, then puts the clay lid on the olla", "the olla covered with its clay lid, no flame, his hand on the lid"] } },
  pica: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands at the thick worn wooden work table chopping a white onion on the wooden cutting board with a big kitchen knife, two red tomatoes and a pile of chopped onion beside the board",
    clips: {
      c39: ["chops the onion with the knife, looks up at the camera and back down at the board", "a small pile of chopped white onion on the board, the knife in his hand, he looks at the camera"] } },
  estufa_d: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the old white gas stove, the flame off; ${OLLA} on the front burner uncovered, its clay lid on the counter, full of plump smooth pinto beans under dark brown cooking water; on the counter half a white onion, three garlic cloves, a small clay bowl of white lard and a small bowl of coarse salt; he holds the wooden spoon`,
    clips: {
      c40: ["scoops a few beans with the wooden spoon, picks one and bites it, chewing", "he holds a half-bitten bean between two fingers, the spoon in the other hand"],
      c41: ["tilts the spoon so the dark brown water runs back into the olla, pointing at the water", "the spoon over the olla, dark brown water dripping, his finger pointing at it"],
      c42: ["drops the half onion and the garlic cloves into the olla, then a spoonful of white lard and a pinch of coarse salt", "the onion half floating among the beans in the brown water, a little lard melting, his hand over the olla"],
      c43: ["stirs once gently with the wooden spoon, then puts a hand on his heart", "his hand on his heart, the spoon resting on the olla rim"],
      c44: ["turns the knob to a small low blue flame and sets the clay lid on the olla slightly open to one side", "the lid slightly ajar with a thin wisp of steam, a small low blue flame under the olla"] } },
  estufa_e: { set: "M1", light: "morning daylight from a side window and a small blue gas flame",
    base: `stands at the old white gas stove; ${OLLA} on the front burner simmering gently on a small low flame, its clay lid slightly ajar, a thin wisp of steam; on the back burner a blue enamel kettle on a low flame; he holds the long wooden spoon`,
    clips: {
      c45: ["lifts the lid aside and stirs slowly from the bottom with the long wooden spoon, looking at the camera", "the lid in one hand, the wooden spoon in the brown broth, beans visible"],
      c46: ["keeps stirring very gently, then points at the beans at the surface", "the spoon still, his finger pointing at the beans just under the broth"],
      c47: ["takes the blue enamel kettle from the back burner and pours a thin stream of hot water into the olla", "the blue kettle tilted over the olla, a little steam, his eyes on it"],
      c48: ["puts the kettle back and scoops a few beans in a big metal spoon", "five beans in the big metal spoon held over the olla"],
      c49: ["blows on the beans in the spoon and squeezes one between his thumb and finger", "a squashed creamy bean between his thumb and finger, he looks at it closely"],
      c50: ["nods, drops the spoon in the olla and picks up a sprig of green epazote from the counter", "he holds the epazote sprig over the olla"],
      c51: ["drops the epazote into the broth, scoops a little broth with the wooden spoon and tastes it", "the wooden spoon at his lips, eyes half closed, tasting"],
      c52: ["nods satisfied and sets the lid back slightly open", "the lid ajar, a satisfied smile at the camera"] } },
  servir: { set: "M4", light: "ordinary morning daylight from the open street door",
    base: "stands at a wooden table with a flowered oilcloth in the dining room; on the table a deep clay bowl of whole pinto beans swimming in brown broth, small clay bowls with chopped white onion, chopped cilantro, chopped green serrano chile and a piece of white queso fresco, warm corn tortillas wrapped in an embroidered cloth napkin, and a small clay jarrito",
    clips: {
      c53: ["points at the deep bowl of beans and then at the little bowls of onion, cilantro and chile one by one", "his finger points at the bowl of chopped serrano chile next to the beans"],
      c54: ["unfolds the cloth napkin showing the tortillas, then lifts the small clay jarrito", "he holds the small clay jarrito up, the tortillas uncovered on the table"],
      c55: ["puts the jarrito down and pats his stomach, smiling", "his hand on his stomach, smiling at the camera"] } },
  estufa_res: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the old white gas stove, flame off; ${OLLA} on the front burner uncovered, full of finished pinto beans in thick shiny brown broth; he holds the wooden spoon`,
    clips: {
      c56: ["counts on his fingers while he talks, the spoon in the other hand", "he holds up four fingers, the spoon in the other hand"],
      c57: ["lowers his hand flat as a low flame, then holds up five fingers", "five fingers held up toward the camera, the olla in front of him"] } },
  mesa_cta1: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands at the thick worn wooden work table with the thick hardcover recipe notebook open in front of him, handwritten pages",
    clips: {
      c58: ["turns a page of the open notebook and taps the handwriting with his finger, then looks up at the camera", "his finger on a handwritten page of the open notebook, he looks at the camera"] } },
  chuy: { set: "M4", light: "ordinary morning daylight from the open street door", chuy: true,
    base: "stands next to a wooden table with a flowered oilcloth where Don Chuy sits with a deep clay bowl of pinto beans in broth and tortillas in a cloth napkin in front of him; Claudio rests his hand on the back of Don Chuy's chair and talks to the camera",
    clips: {
      c59: ["Don Chuy tastes a spoonful of beans and nods slowly with his eyes closed; Claudio smiles and puts his hand on Don Chuy's shoulder", "Claudio's hand on Don Chuy's shoulder, both smiling, Don Chuy holding the spoon"] } },
  preguntas: { set: "M3", light: "morning daylight coming in sideways through the window",
    base: "stands by the kitchen window with the blue-painted frame, talking to the camera; on the wooden shelf next to him a small clay bowl of cooked pinto beans with a fork in it",
    clips: {
      c60: ["holds up one finger and raises his eyebrows", "one finger raised, eyebrows up, half smile"],
      c61: ["rubs his stomach in a small circle and shrugs", "his hand on his stomach, a small shrug"],
      c62: ["holds up two fingers", "two fingers raised, he tilts his head"],
      c63: ["mimes pouring from a kettle with one hand, explaining", "his hand tilted as if pouring, explaining"],
      c64: ["holds up three fingers and shakes his head 'no'", "three fingers raised, shaking his head"],
      c65: ["picks up the small clay bowl and mashes a few beans with the fork", "the fork pressing mashed beans in the small clay bowl in his hands"],
      c66: ["puts the bowl back on the shelf and nods", "the bowl on the shelf, he nods at the camera"] } },
  sarten_a: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; on the front burner ${PAN}, empty, on a medium blue flame; ${OLLA} with its lid on the back burner; on the counter a bowl of drained cooked pinto beans, a small clay jarrito of brown bean broth, a small clay bowl of white lard, a small pile of finely chopped white onion on a board and a piece of white queso fresco`,
    clips: {
      c67: ["points at the bowl of cooked beans and then at the empty frying pan", "his finger points at the empty black frying pan on the flame"],
      c68: ["touches the bowl of beans, the jarrito of broth and the bowl of lard one by one", "his hand on the bowl of lard next to the stove"],
      c69: ["scoops lard into the hot frying pan where it melts shining, then slides the chopped onion in from the board", "chopped onion sizzling in melted lard in the black frying pan, the edges turning golden"] } },
  sarten_b: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; on the front burner ${PAN} full of cooked pinto beans frying in lard with golden onion on a medium flame; he holds a wooden bean masher; a small clay jarrito of brown broth on the counter; ${OLLA} with its lid on the back burner`,
    clips: {
      c70: ["mashes the beans in the pan with the wooden masher, then pours a little broth from the jarrito and mashes again", "half-mashed beans in the pan, the masher in his hand, the jarrito in the other"],
      c71: ["keeps mashing slowly, shaking his head 'no' at the camera", "chunky mashed beans with whole pieces, the masher resting in the pan"],
      c72: ["tilts the frying pan by the handle and the refried beans slide away from the side in one creamy mass", "the pan tilted, creamy refried beans pulling away from the side"],
      c73: ["sets the pan flat and crumbles white queso fresco over the beans with his fingers", "white crumbled queso fresco on top of the brown refried beans in the pan"],
      c74: ["picks up a corn tortilla, folds it and mimes dipping it, talking", "he holds a folded corn tortilla over the pan"],
      c75: ["puts the tortilla down and makes a gesture of cutting strips with his hand", "his flat hand cutting the air in strips, the pan in front of him"],
      c76: ["smiles and lifts both hands, satisfied", "both hands lifted, satisfied smile, the refried beans with cheese in the pan"] } },
  costo: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands at the thick worn wooden work table; on the table ${BAG}, half a white onion, three garlic cloves, a small clay bowl of white lard and a sprig of green epazote, laid out in a row; he talks to the camera`,
    clips: {
      c77: ["taps the bag of beans and then the onion and garlic, counting", "his hand on the onion and garlic"],
      c78: ["touches the bowl of lard and the epazote, then holds up four fingers", "four fingers held up over the ingredients"],
      c79: ["counts nine on his fingers, then makes a small 'less than' gesture with thumb and finger", "his thumb and finger almost touching, a small amount, he looks at the camera"] } },
  costo_b: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands at the thick worn wooden work table with ${BAG} in front of him, both hands resting on the table`,
    clips: {
      c80: ["picks up the bag of beans, looks at it fondly and puts it back down", "his hand resting on the bag of beans, a warm smile at the camera"] } },
};
