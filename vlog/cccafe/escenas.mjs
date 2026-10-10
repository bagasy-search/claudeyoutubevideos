// Dirección del VLOG CONTINUO cccafe (Claudio Cocina, la fonda). Por escena: set (maestra M1-M4 de vlog/cc/lib.mjs), estado de
// la comida en ESA escena (tabla abajo; nunca se contradice entre escenas) y por clip [acción durante el clip, cuadro FINAL = ancla].
// Acciones simplísimas (agnes): un gesto por clip, manos visibles, nada que aparezca de la nada.
//
// TABLA DE ESTADO (orden de la historia)
//   retoma     M1  hornillas apagadas; olla de barro VACÍA con su tapa de barro al lado; bolsa de papel de café molido.
//   salon      M4  madrugada: mesas vacías con manteles de flores, puerta a medio abrir, fila de jarritos colgados en la pared.
//   mesa_ama   M2  una olla de barro vieja y ennegrecida + un jarrito.
//   mesa_ing   M2  olla de barro con tapa; jarra de barro con agua; cono de piloncillo; rajas de canela; platito con 2 clavos;
//                  una naranja con un pelador; bolsa de papel de café molido grueso con taza medidora.
//   estufa_a   M1  olla de barro en lumbre alta con agua, piloncillo y canela adentro; platito con 2 clavos en la mano.
//   estufa_b   M1  olla de barro hirviendo suave, agua color ámbar oscuro, cuchara de palo.
//   estufa_c   M1  lumbre APAGADA; café molido flotando en la olla; cuchara de palo.
//   jarritos   M1  olla TAPADA con la tapa de barro, lumbre apagada; 4 jarritos de barro en la barra; tetera.
//   colar      M1  colador forrado de manta sobre una jarra de barro; café oscuro bajando.
//   probar     M2  jarrito con café de olla humeante; el colador con la canela y los clavos usados.
//   mesa_cmp   M2  dos tazas de vidrio: una turbia y lodosa, otra oscura y transparente.
//   mesa_res   M2  jarrito de café de olla humeante.
//   mesa_cta1  M2  la libreta abierta, página escrita a mano.
//   chuy       M4  don Chuy en su mesa con dos jarritos y un pan dulce.
//   preguntas  M3  ventana: en la repisa un jarrito de café.
//   costo      M2  en fila: bolsa de café, cono de piloncillo, rajas de canela, platito de clavos, una naranja.
//   costo_b    M2  la olla de barro tapada y un jarrito de café.
const OLLA = "a round brown clay olla with two small handles";
const LID = "its round clay lid";
const JARS = "small brown glazed clay jarritos";
const PIL = "a dark reddish-brown cone of piloncillo";
const CAN = "thin rolled sticks of soft cinnamon bark";
const BAG = "a brown paper bag of coarse ground dark coffee";
export const ESC = {
  retoma: { set: "M1", light: "early morning daylight from a side window",
    base: `stands at the old white gas stove with all burners off; on the front burner ${OLLA} sits empty with ${LID} beside it and ${BAG} on the counter; he talks to the camera`,
    clips: {
      c01: ["rests one hand on the rim of the empty clay olla and smiles", "his hand on the rim of the clay olla, smiling at the camera"],
      c02: ["taps the paper bag of coffee with two fingers and nods", "his fingers on the paper bag of coffee, a small nod"] } },
  salon: { set: "M4", light: "pale early morning light from the half-open street door",
    base: `stands in the small dining room of the fonda between the wooden tables with flowered oilcloth tablecloths, the tables still empty, a row of ${JARS} hanging from hooks on the wall behind him, talking to the camera`,
    clips: {
      c03: ["walks slowly between the empty tables and gestures at them with his open hand", "his open hand toward the empty tables"],
      c04: ["points back toward the kitchen with his thumb and smiles", "his thumb pointing back over his shoulder, smiling"],
      c05: ["turns his head toward the kitchen door and smiles, then looks back at the camera", "a calm smile at the camera"],
      c06: ["puts his hand on his chest and nods slowly", "his right hand flat on his chest"],
      c07: ["shrugs, then waves one hand toward the street door", "his hand toward the half-open street door"],
      c08: ["holds up both hands with fingers spread, then lowers them", "both hands up with fingers spread"],
      c09: ["taps one finger on a table top while talking", "his finger resting on the flowered tablecloth"],
      c10: ["takes one clay jarrito off its hook and shows it to the camera", "the small clay jarrito in his hand toward the camera"] } },
  mesa_ama: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table with an old blackened ${OLLA} and one clay jarrito in front of him, talking to the camera`,
    clips: {
      c11: ["holds his hand flat at hip height as if showing a small boy, then shakes his head with a smile", "shaking his head with a small smile"],
      c12: ["puts one hand on the old clay olla and nods slowly", "his hand resting on the old clay olla, a warm look"] } },
  mesa_ing: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table; on the table ${OLLA} with ${LID}, a clay jug of water, ${PIL}, ${CAN}, a tiny clay dish with two cloves, one orange with a vegetable peeler, ${BAG} with a measuring cup`,
    clips: {
      c13: ["touches the clay jug, then the piloncillo cone, then the cinnamon sticks", "his hand resting on the cinnamon sticks"],
      c14: ["picks up the orange and turns it in his hand, then puts it down next to the coffee bag", "his hand on the paper bag of coffee"],
      c15: ["lifts the clay lid off the olla and sets it beside it", "the clay lid beside the open olla, his hand on it"] } },
  estufa_a: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; on a high blue flame ${OLLA} with water, a piloncillo cone and cinnamon sticks inside; a wooden spoon on the counter`,
    clips: {
      c16: ["holds up a tiny clay dish with two cloves and drops them into the olla", "the empty tiny dish in his hand over the olla"],
      c17: ["points into the olla with one finger while talking", "his finger pointing into the olla"],
      c18: ["turns the stove knob a little lower and holds up seven fingers", "seven fingers held up beside the stove"] } },
  estufa_b: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; ${OLLA} simmers gently on a medium flame, the water dark amber like strong tea, a cinnamon stick floating, a wooden spoon in his hand`,
    clips: {
      c19: ["leans over the olla and looks at the amber water, then smells the steam", "leaning over the olla, smiling at the camera"],
      c20: ["blows on a little liquid in the wooden spoon and tastes it, then nods", "the wooden spoon lowered, nodding"] } },
  estufa_c: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the old white gas stove with the flame turned off; in ${OLLA} dark ground coffee floats on the amber water, the wooden spoon in his hand`,
    clips: {
      c21: ["stirs once slowly around the olla with the wooden spoon and the coffee sinks", "the wooden spoon resting across the olla rim"] } },
  jarritos: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the old white gas stove with the flame off; ${OLLA} beside him; on the counter four ${JARS} in a row and an old enamel kettle`,
    clips: {
      c22: ["sets the round clay lid on the olla and rests his hand on it", "his hand flat on the clay lid of the olla"],
      c23: ["moves the four clay jarritos into a neat row on the counter", "the four jarritos in a row, his hand pulling back"],
      c24: ["pours a little hot water from the kettle into one jarrito", "the kettle lowered beside the jarrito"] } },
  colar: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the counter by the stove holding ${OLLA} tilted over a cloth-lined strainer set on a clay jug, dark coffee running slowly through the cloth`,
    clips: {
      c25: ["keeps pouring slowly, then sets the olla upright on the counter", "the olla upright, the strainer on the clay jug"] } },
  probar: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands behind the thick worn wooden work table with a steaming clay jarrito of dark coffee in front of him and a cloth-lined strainer with used cinnamon sticks and cloves on a plate",
    clips: {
      c26: ["points at the used cinnamon and cloves in the strainer, then picks up the jarrito", "the jarrito in both hands"],
      c27: ["takes a slow sip from the jarrito and closes his eyes", "eyes closed, the jarrito near his chin"],
      c28: ["lowers the jarrito and nods with a warm smile", "the jarrito on the table, warm smile at the camera"] } },
  mesa_cmp: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands behind the thick worn wooden work table with two clear glass cups of coffee in front of him: on the left cloudy and muddy with grounds at the bottom; on the right dark, clear and shiny",
    clips: {
      c29: ["points at the cloudy cup, then at the clear cup", "his finger pointing at the clear dark cup"] } },
  mesa_res: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands behind the thick worn wooden work table with a steaming clay jarrito of coffee in front of him, talking to the camera",
    clips: {
      c30: ["counts slowly on his fingers while talking", "he holds up five fingers"],
      c31: ["shakes one finger no, then points at the jarrito", "his hand beside the jarrito, nodding"] } },
  mesa_cta1: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands at the thick worn wooden work table with the thick grease-stained recipe notebook open on the table, handwritten pages",
    clips: {
      c32: ["turns back to the first page of the notebook and taps it with his finger", "his finger resting on the handwritten page"] } },
  chuy: { set: "M4", light: "ordinary morning daylight from the open street door",
    base: "in the dining room, the old man don Chuy sits at his table with two clay jarritos of coffee and a sweet bread on a plate; Claudio stands beside the table",
    clips: {
      c33: ["Claudio fills one jarrito from a clay jug while don Chuy waits", "the jarrito full, Claudio holding the clay jug"],
      c34: ["don Chuy sips and shrugs while Claudio smiles and puts a finger to his lips", "Claudio with one finger on his lips, smiling"] } },
  preguntas: { set: "M3", light: "soft daylight from the window",
    base: "stands by the kitchen window; on the windowsill a small clay jarrito of coffee; he talks to the camera",
    clips: {
      c35: ["raises one finger, then shrugs with a small nod", "one finger raised, a small nod"],
      c36: ["shakes his head slowly with a kind smile", "a kind smile, shaking his head"],
      c37: ["raises two fingers", "two fingers raised"],
      c38: ["raises three fingers and nods", "three fingers raised"],
      c39: ["raises four fingers", "four fingers raised"],
      c40: ["raises one open hand with five fingers", "five fingers raised"],
      c41: ["raises both hands with six fingers up", "six fingers raised with both hands"],
      c42: ["points at the jarrito on the windowsill and smiles", "his finger pointing at the jarrito, smiling"] } },
  costo: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands at the thick worn wooden work table; on the table in a row ${BAG}, ${PIL}, ${CAN}, a tiny clay dish of cloves and one orange; he talks to the camera`,
    clips: {
      c43: ["taps the paper bag of coffee twice", "his hand on the paper bag of coffee"],
      c44: ["touches the piloncillo, the cinnamon and the cloves one after another", "his hand on the tiny dish of cloves"],
      c45: ["touches the orange, then opens both hands over everything", "both hands open over the ingredients"],
      c46: ["raises both hands with six fingers up over the ingredients", "six fingers held up over the ingredients"] } },
  costo_b: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands at the thick worn wooden work table with ${OLLA} covered with ${LID} and a steaming clay jarrito of coffee in front of him`,
    clips: {
      c47: ["taps the table with one finger while talking", "his finger on the table, serious face"],
      c48: ["picks up the jarrito and raises it slightly toward the camera with a warm smile", "the jarrito raised toward the camera, warm smile"] } },
};
