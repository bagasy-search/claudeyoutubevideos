// Dirección del VLOG CONTINUO cccostillas (Claudio Cocina, la fonda). Por escena: set (maestra M1-M4 de vlog/cc/lib.mjs), estado de
// la comida en ESA escena (tabla abajo; nunca se contradice entre escenas) y por clip [acción durante el clip, cuadro FINAL = ancla].
// Acciones simplísimas (agnes): un gesto por clip, manos visibles, nada que aparezca de la nada.
//
// TABLA DE ESTADO DE LA COMIDA (orden de la historia)
//   retoma     M1  olla de barro VACÍA y limpia en la hornilla apagada, tapa de barro al lado; comal negro en la otra hornilla.
//   salon      M4  sin comida: mesas vacías con manteles de flores, pizarrón con "JUEVES: COSTILLAS".
//   mesa_err   M2  charola de lámina con costillas de cerdo CRUDAS (rosadas, trozos de 3 huesos) + la libreta.
//   mesa_ing   M2  costillas crudas en la charola; cazuelitas de sal gruesa y comino molido; 6 guajillos secos; 5 dientes de ajo;
//                  3 naranjas; cono de piloncillo; botella de vinagre de manzana; taza medidora de vidrio con agua.
//   rallar     M2  rallador de caja sobre un plato: ralladura naranja; 3 naranjas (una ya rallada, pálida); exprimidor de vidrio.
//   salar      M2  costillas en la charola, sal y comino frotados (pasan de rosadas a rosadas con puntitos cafés).
//   chiles     M2  guajillos secos enteros a un lado, abiertos y sin semillas al otro; semillas en un plato.
//   comal      M1  comal negro caliente en la hornilla delantera, guajillos abiertos tostándose; tazón de barro con agua caliente al lado.
//   licuar     M2  licuadora de vidrio con los chiles remojados, ajo, jugo; luego salsa ROJO OSCURO lisa; colador de malla y tazón.
//   olla_a     M1  olla de barro destapada en la hornilla: costillas crudas acomodadas, salsa roja encima hasta LA MITAD.
//   olla_b     M1  olla tapada a fuego bajo; al destapar: costillas rojo oscuro, cocidas, salsa burbujeando bajito; pinzas de metal.
//   olla_c     M1  olla destapada: costillas tiernas que se sacan con pinzas a una charola de lámina junto a la estufa.
//   reducir    M1  olla destapada a fuego medio alto: salsa roja burbujeando fuerte, sin costillas; charola con costillas al lado.
//   glasear    M1  charola junto a la estufa con costillas; tazón con glaseado espeso y brillante; brocha de cocina.
//   comal_b    M1  costillas glaseadas sobre el comal negro muy caliente, glaseado burbujeando en las orillas; pinzas.
//   mesa_res   M2  platón de barro con costillas glaseadas brillosas, oscuras de las orillas.
//   mesa_cta1  M2  la libreta abierta, página escrita a mano.
//   servir     M4  plato con 3-4 costillas glaseadas, arroz rojo, frijoles de olla, tortillas en servilleta bordada; cazuelita de cebolla
//                  morada desflemada con limón.
//   chuy       M4  don Chuy en su mesa, plato de costillas, come con la mano; un hueso limpio en el plato.
//   servir_b   M4  jarra de vidrio con agua de jamaica (rojo oscuro) y jarrito de barro con café de olla junto al plato de costillas.
//   preguntas  M3  ventana: en la repisa un plato chico de barro con dos costillas glaseadas.
//   tacos_a    M2  tazón con costillas sobrantes; dos tenedores deshebran la carne; tazón de glaseado.
//   tacos_b    M1  comal con carne deshebrada dorándose y tortillas calentando; cazuelitas de cebolla picada, cilantro, limones;
//                  tazón con huesos limpios; luego bolillo abierto en el comal, refritos, aguacate, rajas de jalapeño.
//   costo      M2  sobre la mesa: costillas crudas en papel de carnicería, 6 guajillos, 3 naranjas, ajo, vinagre, piloncillo.
//   costo_b    M2  platón de costillas glaseadas.
const OLLA = "the big reddish clay olla de barro with two handles";
const COMAL = "the big black cast-iron comal";
const RAW = "a dented metal tray with raw pale pink pork spare ribs cut in pieces of three bones";
const GLAZED = "glossy dark red glazed pork ribs, darker and caramelized at the edges";
export const ESC = {
  retoma: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the old white gas stove with all burners off; on the front burner ${OLLA} sits empty and clean with its clay lid beside it; ${COMAL} on another burner; he rests one hand on the rim of the olla and talks to the camera`,
    clips: {
      c01: ["pats the round belly of the empty clay olla with his palm, smiling", "his hand on the side of the empty clay olla, smiling at the camera"],
      c02: ["lifts the clay lid a little, looks into the empty olla and sets the lid down beside it, raising his eyebrows", "his hand on the clay lid beside the olla, eyebrows raised"] } },
  salon: { set: "M4", light: "ordinary morning daylight from the open street door",
    base: "stands in the small dining room of the fonda between the wooden tables with flowered oilcloth tablecloths, the tables still empty, the small blackboard on the wall behind with chalk handwriting, talking to the camera with one hand open",
    clips: {
      c03: ["walks slowly between the empty tables talking and points at the small blackboard on the wall", "he points at the small blackboard with chalk handwriting"],
      c04: ["gestures at all the empty tables with his open hand, then taps his bare wrist", "he taps his bare wrist with two fingers, eyebrows raised"],
      c05: ["puts his hand on his chest and nods", "his right hand flat on his chest"],
      c06: ["counts four on his fingers", "he holds up four fingers"],
      c07: ["opens both arms toward the street door, smiling", "both arms open toward the street door, smiling"],
      c08: ["crosses his arms and imitates a serious man shaking his head", "arms crossed, shaking his head with mock seriousness"],
      c09: ["uncrosses his arms and points toward the kitchen door behind the counter, laughing", "his thumb pointing toward the kitchen door, a laugh"],
      c10: ["raises one finger as if remembering", "one finger raised, eyebrows up"],
      c11: ["mimes choosing something with his fingers, picking the best one", "his fingers pinched together as if holding something small, he looks at the camera"],
      c12: ["shrugs with a small smile", "a small shrug, half smile"],
      c13: ["taps his wrist and holds up ten fingers", "both hands up with all ten fingers"],
      c14: ["mimes pressing the button of a blender with one finger", "his finger pressing down on an invisible button"],
      c15: ["lowers his flat hand slowly as if turning down a flame, then smiles", "his flat hand low and still, palm down, smiling"] } },
  mesa_err: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table with ${RAW} in front of him and the recipe notebook beside it, talking to the camera`,
    clips: {
      c16: ["picks up one raw rib piece by the bone, shows it to the camera, puts it back and shrugs kindly", "he puts the raw rib back on the tray, a kind half smile"] } },
  mesa_ing: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table; on the table ${RAW}, a small clay bowl of coarse salt, a small clay bowl of ground cumin, six dried dark red guajillo chiles, five garlic cloves, three oranges, a brown cone of piloncillo, a bottle of apple cider vinegar and a glass measuring cup of water; he talks to the camera with his hands on the table`,
    clips: {
      c17: ["points at the tray of raw ribs, then at the bowls of salt and cumin", "his finger points at the small bowl of ground cumin"],
      c18: ["touches the guajillo chiles, the garlic and then picks up one orange", "he holds one orange up to the camera"],
      c19: ["puts the orange down and taps the piloncillo cone and the measuring cup of water", "his hand resting next to the piloncillo cone and the measuring cup"] } },
  rallar: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands at the thick worn wooden work table with a metal box grater standing on a white plate, three oranges beside it and a glass orange juicer; he holds one orange",
    clips: {
      c20: ["rubs the orange slowly against the box grater, a little orange zest falling on the plate", "a small pile of bright orange zest on the plate, the orange in his hand"],
      c21: ["keeps grating slowly, then raises his eyebrows and points at the zest", "his finger points at the orange zest on the plate"],
      c22: ["lifts his fingers to his nose and smells them, smiling", "his fingertips near his nose, eyes half closed, smiling"] } },
  salar: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands at the thick worn wooden work table with ${RAW} in front of him, a small clay bowl of coarse salt and a small clay bowl of ground cumin beside it`,
    clips: {
      c23: ["sprinkles coarse salt from his fingers over the raw ribs, then rubs a pinch of cumin into the meat with his hand", "his hand rubbing the raw ribs on the tray, tiny brown specks of cumin on the meat"],
      c24: ["holds up one finger, then makes a 'too much' gesture with both hands, smiling", "one finger raised, a knowing smile"] } },
  chiles: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands at the thick worn wooden work table with a small pile of dried dark red guajillo chiles on the wooden board and a white plate beside it",
    clips: {
      c25: ["breaks the stem off one dried guajillo chile, opens it with his fingers and shakes the seeds onto the plate", "the opened guajillo chile in his hands, pale seeds on the plate"],
      c26: ["bends a whole guajillo chile slowly between his fingers to show it does not break", "the guajillo chile bent in a curve between his fingers, he looks at the camera"] } },
  comal: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; ${COMAL} heats on the front burner over a medium blue flame with opened guajillo chiles lying flat on it; a clay bowl of hot water on the counter beside the stove`,
    clips: {
      c27: ["presses a chile flat on the hot comal with his fingertips and flips it over", "opened guajillo chiles on the black comal, slightly darker, his hand above them"],
      c28: ["pats the edge of the black comal with his palm, proud, then drops the toasted chiles into the bowl of water", "the toasted chiles floating in the clay bowl of hot water"],
      c29: ["pushes the chiles under the water with a spoon", "the chiles submerged in the bowl, the spoon resting on the rim"] } },
  licuar: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands at the thick worn wooden work table with a glass blender on it; next to it a clay bowl of soaked soft guajillo chiles, five garlic cloves, a glass of orange juice, a little plate of orange zest, the bottle of apple cider vinegar and a little grated piloncillo",
    clips: {
      c30: ["drops the soaked chiles, the garlic and the orange zest into the glass blender, then pours in the orange juice", "the blender jar full of chiles and orange juice, the empty glass in his hand"],
      c31: ["puts the lid on and presses the button; the blender whirls the sauce dark red; he lets go", "the glass blender full of smooth dark red sauce"],
      c32: ["pours the dark red sauce through a wire mesh strainer into a bowl, pressing it with a spoon", "the strainer over the bowl, dark red sauce, a few chile skins left in the mesh"],
      c33: ["dips a spoon in the sauce and tastes it, nodding", "the spoon near his lips, he nods"] } },
  olla_a: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the old white gas stove; on the front burner ${OLLA} uncovered, raw seasoned pork ribs arranged inside in an even layer; on the counter a bowl of dark red chile sauce and the glass blender jar with a little water`,
    clips: {
      c34: ["pours the bowl of dark red sauce over the ribs in the olla, then the water from the blender jar", "the ribs in the olla half covered by dark red sauce"],
      c35: ["points with his finger at the line of the sauce halfway up the ribs, then puts the clay lid on", "the clay lid on the olla, his hand resting on it"],
      c36: ["turns the knob down to a small low blue flame", "a small low blue flame under the covered clay olla, his hand on the knob"] } },
  olla_b: { set: "M1", light: "morning daylight from a side window and a small blue gas flame",
    base: `stands at the old white gas stove; ${OLLA} on the front burner covered with its clay lid on a small low flame, a thin wisp of steam; metal kitchen tongs on the counter`,
    clips: {
      c37: ["lifts the clay lid and turns the dark red cooked ribs with the metal tongs, steam rising", "the lid in one hand, tongs in the other, dark red ribs in the gently bubbling sauce"],
      c38: ["puts the lid back on and wags his finger 'no'", "the lid on the olla, his index finger raised, firm face"],
      c39: ["taps the lid twice with his knuckle and points at the bone of his own wrist, smiling", "he points at his wrist bone, smiling at the camera"] } },
  olla_c: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the old white gas stove; ${OLLA} on the front burner uncovered, full of tender dark red ribs in thick red sauce; an empty dented metal tray on the counter beside the stove`,
    clips: {
      c40: ["lifts one tender rib out of the olla with the tongs, carefully, and lays it on the metal tray", "two dark red cooked ribs on the metal tray, the tongs in his hand"] } },
  reducir: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; ${OLLA} on the front burner uncovered on a medium-high flame, dark red sauce bubbling hard with no ribs in it; on the counter a metal tray of cooked dark red ribs`,
    clips: {
      c41: ["points with the wooden spoon at the bubbling sauce, then turns the knob up", "the red sauce bubbling hard in the open olla, the spoon in his hand"],
      c42: ["tilts the olla slightly by its handle with a towel and skims a little fat off the top with a big spoon", "the big spoon with a little orange fat held over the olla, the olla tilted"] } },
  glasear: { set: "M1", light: "morning daylight from a side window",
    base: "stands at the counter beside the old white gas stove with a metal tray of cooked dark red pork ribs and a clay bowl of thick glossy dark red glaze; he holds a kitchen brush",
    clips: {
      c43: ["dips the brush in the thick glaze and paints it over the ribs on the tray", "the ribs on the tray shiny with fresh glaze, the brush in his hand"] } },
  comal_b: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; on ${COMAL}, very hot on a strong flame, four glazed pork ribs sizzle, the glaze bubbling at the edges, a little smoke; he holds metal tongs`,
    clips: {
      c44: ["presses a rib on the hot comal with the tongs, then raises three fingers", "three fingers raised, the ribs sizzling on the black comal"],
      c45: ["leans in and watches the ribs closely, very serious, the tongs ready", "he leans over the comal watching the ribs, tongs in hand"] } },
  mesa_res: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands at the thick worn wooden work table with a clay platter of ${GLAZED} in front of him`,
    clips: {
      c46: ["counts on his fingers while he talks, glancing at the platter", "he holds up four fingers over the platter of glazed ribs"],
      c47: ["lowers his hand and points at the glazed ribs, nodding", "his finger pointing at the glazed ribs, nodding"] } },
  mesa_cta1: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands at the thick worn wooden work table with the thick hardcover recipe notebook open in front of him, handwritten pages",
    clips: {
      c48: ["turns a page of the open notebook and taps the handwriting with his finger, then looks up at the camera", "his finger on a handwritten page of the open notebook, he looks at the camera"] } },
  servir: { set: "M4", light: "ordinary midday daylight from the open street door",
    base: `stands at a wooden table with a flowered oilcloth in the dining room; on the table a plate with three ${GLAZED}, red rice and pinto beans in broth, warm corn tortillas in an embroidered cloth napkin, and a small clay bowl of thin pink pickled red onion with lime halves`,
    clips: {
      c49: ["points at the ribs on the plate, then at the rice, the beans and the tortillas", "his finger points at the small bowl of pink pickled onion"],
      c50: ["picks up a lime half and squeezes it over the bowl of pink onion", "the squeezed lime half in his hand over the pink onions"] } },
  chuy: { set: "M4", light: "ordinary midday daylight from the open street door", chuy: true,
    base: `stands next to a wooden table with a flowered oilcloth where Don Chuy sits with a plate of ${GLAZED} and tortillas in front of him; Claudio rests his hand on the back of Don Chuy's chair and talks to the camera`,
    clips: {
      c51: ["Don Chuy picks up a rib with his fingers; Claudio smiles and nods toward him", "Don Chuy holding a glazed rib in his fingers, Claudio smiling"],
      c52: ["Don Chuy pulls the meat off the bone with his teeth and puts the clean bone on the plate; Claudio laughs and pats his shoulder", "a clean bone on Don Chuy's plate, Claudio's hand on his shoulder, both smiling"] } },
  servir_b: { set: "M4", light: "ordinary midday daylight from the open street door",
    base: `stands at a wooden table with a flowered oilcloth; on the table a plate of ${GLAZED}, a glass jug of dark red agua de jamaica with ice and a small clay jarrito of coffee`,
    clips: {
      c53: ["lifts the glass jug of agua de jamaica a little, then touches the clay jarrito", "his hand on the small clay jarrito next to the jug of jamaica"] } },
  preguntas: { set: "M3", light: "morning daylight coming in sideways through the window",
    base: "stands by the kitchen window with the blue-painted frame, talking to the camera; on the wooden shelf next to him a small clay plate with two glossy dark red glazed pork ribs",
    clips: {
      c54: ["holds up one finger and raises his eyebrows", "one finger raised, eyebrows up, half smile"],
      c55: ["makes a small whistling gesture with his hand above his head, then shrugs", "his hand open, a small shrug"],
      c56: ["holds up two fingers", "two fingers raised, he tilts his head"],
      c57: ["balances his two hands like a scale, then holds up three fingers", "three fingers raised, eyebrows up"],
      c58: ["mimes lifting something off the top with a spoon, then nods", "his hand tilted as if lifting with a spoon, nodding"],
      c59: ["points at the plate of glazed ribs on the shelf, then holds up four fingers", "four fingers raised, the plate of ribs beside him"],
      c60: ["tilts his head side to side, weighing it, then shakes his head with a smile", "shaking his head with a smile"],
      c61: ["picks up the plate of ribs from the shelf and shows it to the camera, proud", "the clay plate of glazed ribs held up in his hands, proud smile"] } },
  tacos_a: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands at the thick worn wooden work table with a clay bowl of leftover glazed pork ribs and an empty bowl beside it; two forks; a small bowl of thick red glaze",
    clips: {
      c62: ["pulls the meat off a rib bone with two forks; it comes off easily into the empty bowl", "a little pile of shredded red pork in the bowl, a clean bone and two forks in his hands"],
      c63: ["spoons a little red glaze over the shredded pork and mixes it with a fork", "the shredded pork shiny with red glaze in the bowl"] } },
  tacos_b: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; on ${COMAL} shredded red pork browns crispy at the edges next to two corn tortillas warming; on the counter small clay bowls of chopped white onion, chopped cilantro and lime halves, and a bowl of clean rib bones`,
    clips: {
      c64: ["lays a warm tortilla on his palm, fills it with crispy pork, onion and cilantro, and squeezes a lime over it", "a finished taco in his hand, the lime half in the other"],
      c65: ["puts the taco on a plate and points at the bowl of clean bones", "his finger pointing at the bowl of clean rib bones"],
      c66: ["lays an opened bolillo roll face down on the hot comal", "the opened bolillo toasting on the comal, his hand above it"],
      c67: ["spreads refried beans on the toasted bolillo with a spoon and adds shredded glazed pork", "the bolillo with refried beans and red shredded pork on a plate"],
      c68: ["adds slices of avocado and pickled jalapeño strips, closes the torta and shows it", "he holds the finished torta up toward the camera"] } },
  costo: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands at the thick worn wooden work table; on the table raw pork ribs on open brown butcher paper, six dried guajillo chiles, three oranges, a head of garlic, a bottle of apple cider vinegar and a brown cone of piloncillo, laid out in a row; he talks to the camera",
    clips: {
      c69: ["taps the raw ribs on the butcher paper, then the guajillo chiles, counting", "his hand on the guajillo chiles"],
      c70: ["touches the oranges, the garlic and the vinegar one after another", "his hand on the bottle of vinegar"],
      c71: ["holds up five fingers over the ingredients", "five fingers held up over the ingredients"],
      c72: ["makes a small 'just a little' gesture with thumb and finger, smiling", "his thumb and finger almost touching, smiling at the camera"] } },
  costo_b: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands at the thick worn wooden work table with a clay platter of ${GLAZED} in front of him, both hands resting on the table`,
    clips: {
      c73: ["looks at the platter of ribs fondly and nods slowly", "his hands resting on the table beside the platter, a warm smile at the camera"] } },
};
