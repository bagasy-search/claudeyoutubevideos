// Dirección del VLOG CONTINUO ccmuslos (Claudio Cocina, la fonda). Por escena: set (maestra M1-M4 de vlog/cc/lib.mjs), estado de
// la comida en ESA escena (tabla abajo; nunca se contradice entre escenas) y por clip [acción durante el clip, cuadro FINAL = ancla].
// Acciones simplísimas (agnes): un gesto por clip, manos visibles, nada que aparezca de la nada.
//
// TABLA DE ESTADO (orden de la historia)
//   retoma     M1  hornillas apagadas; sartén de fierro negro vacío en la hornilla; un plato con muslos crudos tapado con un trapo.
//   salon      M4  mesas con manteles de flores; pizarrón con letra de gis.
//   mesa_ama   M2  plato blanco con dos muslos crudos con piel.
//   mesa_ing   M2  plato con 8 muslos crudos con piel; platitos de sal y pimienta; tazón de barro con salsa roja de guajillo;
//                  media cebolla blanca; manojo de cilantro.
//   tabla      M2  muslos crudos sobre la tabla, ya secos; papel de cocina doblado.
//   estufa_a   M1  sartén de fierro FRÍO, vacío, sin aceite, hornilla apagada; plato de muslos crudos al lado.
//   estufa_b   M1  muslos piel abajo en el sartén, fuego medio, grasa dorada juntándose; pinzas de metal en la barra.
//   estufa_c   M1  muslos piel abajo con orillas doradas; pinzas en la mano.
//   estufa_d   M1  muslos volteados (piel dorada arriba) → plato blanco con los muslos al lado; frasco de vidrio para la grasa.
//   estufa_e   M1  muslos piel arriba sobre salsa roja de guajillo con cebolla, sin tapa; tabla con cilantro picado.
//   servir     M2  plato blanco: muslo de piel dorada y crujiente sobre salsa roja; (c34) junto a arroz rojo y frijoles.
//   mesa_cmp   M2  dos platos: muslo de piel pálida bañado en salsa / muslo de piel dorada con la salsa alrededor.
//   mesa_res   M2  el sartén de fierro con los muslos en salsa, sobre un trapo.
//   mesa_cta1  M2  la libreta abierta, página escrita a mano.
//   salsa      M2  tazón de barro con chiles guajillo remojando en agua; licuadora vieja de vidrio; jitomates, ajo, cebolla; colador.
//   taco       M2  tortillas en trapo bordado; plato con muslo en salsa.
//   mercado    M2  charola de muslos crudos con piel sobre papel de carnicería.
//   preguntas  M3  ventana: en la repisa un plato con un muslo dorado.
//   costo      M2  en fila: plato de muslos crudos, tazón de salsa de guajillo, media cebolla, manojo de cilantro.
//   costo_b    M2  frasco de vidrio con grasa de pollo dorada y el sartén con los muslos en salsa.
const PAN = "a big round black cast-iron frying pan";
const RAW = "raw chicken thighs with pale skin";
const GOLDT = "chicken thighs with deep golden crisp skin sitting in red guajillo sauce with onion, the skin above the sauce";
export const ESC = {
  retoma: { set: "M1", light: "early morning daylight from a side window",
    base: `stands at the old white gas stove with all burners off; ${PAN} sits empty on a burner and a plate of ${RAW} rests on the counter; he talks to the camera`,
    clips: {
      c01: ["rests one hand on the edge of the empty cast-iron pan and smiles", "his hand on the pan edge, smiling at the camera"],
      c02: ["points at the plate of raw chicken thighs and nods", "his finger pointing at the plate of chicken"] } },
  salon: { set: "M4", light: "ordinary morning daylight from the open street door",
    base: "stands in the small dining room of the fonda between the wooden tables with flowered oilcloth tablecloths, next to the small blackboard with chalk handwriting, talking to the camera",
    clips: {
      c03: ["taps the blackboard twice with his knuckle", "his knuckle resting on the blackboard"],
      c06: ["holds up both hands with fingers spread, then lowers them", "both hands lowered, nodding"],
      c07: ["shrugs with open hands and a small laugh", "open hands, a small laugh"],
      c08: ["points one finger up as if remembering, then smiles", "one finger raised, smiling"] } },
  mesa_ama: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table with a white plate of two ${RAW} in front of him, talking to the camera`,
    clips: {
      c04: ["points at the chicken thighs on the plate", "his finger pointing at the thighs"],
      c05: ["shakes his head with a warm smile", "a warm smile at the camera"] } },
  mesa_ing: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table; on the table a plate of eight ${RAW}, two tiny clay dishes with salt and black pepper, a clay bowl of smooth red guajillo sauce, half a white onion and a bunch of cilantro`,
    clips: {
      c09: ["touches the plate of chicken, then the tiny dishes of salt and pepper", "his hand beside the salt dish"],
      c10: ["points at the bowl of red sauce, then the onion, then the cilantro", "his finger on the bunch of cilantro"] } },
  tabla: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table with four ${RAW} on a wooden cutting board and a folded paper towel beside them`,
    clips: {
      c11: ["tucks the loose edge of skin over one chicken thigh with his fingers", "his fingers resting on the tucked skin"],
      c12: ["holds up one finger while talking, then points at the thighs", "one finger raised, serious face"] } },
  estufa_a: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the old white gas stove with all burners off; ${PAN} sits empty and dry on a burner, a plate of ${RAW} on the counter`,
    clips: {
      c13: ["touches the inside of the cold empty pan with his palm and shows it to the camera", "his open palm toward the camera beside the cold pan"] } },
  estufa_b: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; in ${PAN} on a medium blue flame chicken thighs lie skin side down side by side, clear golden fat gathering around them; metal tongs on the counter`,
    clips: {
      c14: ["holds both hands up away from the pan and shakes his head", "both hands raised away from the pan"],
      c15: ["puts his hands behind his back and watches the pan, smiling", "hands behind his back, smiling at the camera"],
      c16: ["leans over the pan and smells the steam with closed eyes", "leaning over the pan, smiling"] } },
  estufa_c: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; in ${PAN} chicken thighs skin side down with golden brown edges in their own fat, metal tongs in his hand`,
    clips: {
      c17: ["nudges one thigh with the tongs and it slides free from the pan", "the tongs holding the loose thigh at the pan edge"] } },
  estufa_d: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; in ${PAN} chicken thighs turned with golden crisp skin up in clear golden fat, a white plate and an empty glass jar on the counter`,
    clips: {
      c18: ["lifts the chicken thighs one by one with the tongs onto the white plate, skin side up", "the plate of golden thighs on the counter"],
      c19: ["tips the pan and pours the golden fat into the glass jar", "the glass jar of golden fat on the counter"] } },
  estufa_e: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; in ${PAN} on a low flame ${GOLDT}, no lid; a small board with chopped cilantro on the counter`,
    clips: {
      c20: ["shakes his finger no and points at the open pan", "his finger pointing at the open pan"],
      c21: ["moves a little sauce around the thighs with a spoon, without touching the skin", "the spoon resting on the pan edge"],
      c22: ["turns the stove knob a little lower", "his hand on the stove knob"],
      c23: ["holds up a small kitchen thermometer toward the camera", "the small thermometer held up beside the pan"],
      c24: ["pierces one thigh near the bone with a small knife and looks at it", "the small knife lowered beside the pan"],
      c25: ["sprinkles chopped cilantro over the sauce around the thighs", "his hand pulling back over the pan"] } },
  servir: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands behind the thick worn wooden work table with a white plate of one chicken thigh with deep golden crisp skin on red guajillo sauce",
    clips: {
      c26: ["cuts the crisp skin with a knife and smiles", "the knife resting on the plate, proud smile"],
      c34: ["slides a plate of red rice and a clay bowl of beans next to the chicken", "the plates side by side, his hand pulling back"] } },
  mesa_cmp: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands behind the thick worn wooden work table with two white plates in front of him: on the left a chicken thigh with pale soft skin covered in red sauce, on the right a chicken thigh with deep golden crisp skin with the sauce around it",
    clips: {
      c27: ["points at the pale soggy thigh, then at the golden crisp thigh", "his finger pointing at the golden thigh"] } },
  mesa_res: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table with ${PAN} of ${GOLDT} resting on a folded cloth`,
    clips: {
      c28: ["counts slowly on his fingers while talking", "he holds up four fingers"],
      c29: ["points at the sauce around the thighs, then nods", "his hand beside the pan, nodding"] } },
  mesa_cta1: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands at the thick worn wooden work table with the thick grease-stained recipe notebook open on the table, handwritten pages",
    clips: {
      c30: ["turns one page of the notebook and taps it with his finger", "his finger resting on the handwritten page"] } },
  salsa: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands behind the thick worn wooden work table with a clay bowl of dried red guajillo chiles soaking in water, an old glass blender, two red tomatoes, a garlic clove, a piece of white onion and a metal strainer",
    clips: {
      c31: ["lifts one soft guajillo chile out of the water and shows it", "the soft red chile held up toward the camera"],
      c32: ["drops the tomatoes and chiles into the glass blender jar", "his hand on the blender lid"],
      c33: ["pours the red sauce from the blender through the strainer into a clay bowl", "the clay bowl of smooth red sauce, the strainer above it"] } },
  taco: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands behind the thick worn wooden work table with corn tortillas in an embroidered cloth and a plate with a chicken thigh with golden crisp skin in red sauce",
    clips: {
      c35: ["tears a piece of crisp skin and meat and puts it on a tortilla", "the tortilla with chicken in his hand"],
      c36: ["spoons red sauce from the plate over the taco and takes a bite", "chewing, the taco in his hand, nodding"] } },
  mercado: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table with a tray of ${RAW} on white butcher paper`,
    clips: {
      c37: ["picks up one raw thigh and shows the skin side to the camera", "the raw thigh held up, skin toward the camera"],
      c38: ["turns the thigh to show the bone side, then puts it down", "his hand resting beside the tray"] } },
  preguntas: { set: "M3", light: "soft daylight from the window",
    base: "stands by the kitchen window; on the windowsill a small plate with a golden chicken thigh; he talks to the camera",
    clips: {
      c39: ["raises one finger, then shakes his head", "one finger raised"],
      c40: ["raises two fingers", "two fingers raised"],
      c41: ["raises three fingers and nods", "three fingers raised"],
      c42: ["raises four fingers", "four fingers raised"],
      c43: ["raises one open hand with five fingers", "five fingers raised"],
      c44: ["points at the plate on the windowsill and smiles", "his finger pointing at the plate, smiling"] } },
  costo: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands at the thick worn wooden work table; on the table in a row a plate of ${RAW}, a clay bowl of red guajillo sauce, half a white onion and a bunch of cilantro; he talks to the camera`,
    clips: {
      c45: ["taps the plate of chicken twice", "his hand beside the plate of chicken"],
      c46: ["touches the sauce bowl, the onion and the cilantro one after another", "his hand on the cilantro"],
      c47: ["raises four fingers over the ingredients", "four fingers held up"],
      c48: ["raises two fingers and nods", "two fingers raised, nodding"] } },
  costo_b: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands at the thick worn wooden work table with a glass jar of golden chicken fat and ${PAN} of ${GOLDT}`,
    clips: {
      c49: ["picks up the glass jar of golden fat and shows it to the camera", "the jar of golden fat held toward the camera"],
      c50: ["puts the jar down and opens his hand over the pan with a warm smile", "his open hand over the pan, warm smile"] } },
};
