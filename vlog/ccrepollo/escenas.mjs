// Dirección del VLOG CONTINUO ccrepollo (Claudio Cocina, la fonda). Por escena: set (maestra M1-M4 de vlog/cc/lib.mjs), estado de
// la comida en ESA escena (tabla abajo; nunca se contradice entre escenas) y por clip [acción durante el clip, cuadro FINAL = ancla].
// Acciones simplísimas (agnes): un gesto por clip, manos visibles, nada que aparezca de la nada.
//
// TABLA DE ESTADO (orden de la historia)
//   retoma     M1  hornillas apagadas; la olla de barro del café a un lado; un repollo verde entero en la barra.
//   salon      M4  mesas con manteles de flores; el pizarrón con letra de gis.
//   mesa_ama   M2  un plato hondo de barro vacío y un repollo entero.
//   mesa_ing   M2  repollo verde entero; tazón con tocino picado; cebolla blanca; platitos de sal, pimienta y chile de árbol molido;
//                  barra de mantequilla en platito; botella de vinagre de manzana.
//   tabla      M2  tabla con un montón de repollo en tiras; sartén grande de fierro negro vacío al lado.
//   estufa_a   M1  sartén de fierro con tocino dorado (c16) → plato con el tocino a un lado, cebolla en la grasa (c17).
//   estufa_b   M1  sartén con la primera tanda de repollo brillante bajando; tazón de barro con el resto de repollo crudo.
//   estufa_c   M1  sartén lleno de repollo a medio cocer, pinzas de metal.
//   estufa_d   M1  repollo con orillas doradas en el sartén, pinzas, latita de manteca.
//   estufa_e   M1  lumbre APAGADA; repollo dorado en el sartén; plato con tocino crujiente; platito de mantequilla.
//   servir     M2  plato blanco con repollo dorado y tocino; (c31) junto a una chuleta y frijoles de olla.
//   mesa_cmp   M2  dos platos: repollo hervido pálido y aguado / repollo dorado.
//   mesa_res   M2  el sartén de fierro con el repollo dorado sobre un trapo.
//   mesa_cta1  M2  la libreta abierta, página escrita a mano.
//   taco       M2  tortillas en un trapo bordado, molcajete con salsa verde, plato de repollo dorado.
//   mercado    M2  tres repollos verdes enteros sobre la mesa.
//   preguntas  M3  ventana: en la repisa un platito de repollo dorado.
//   costo      M2  en fila: repollo entero, tocino, cebolla, mantequilla, botella de vinagre.
//   costo_b    M2  el sartén con el repollo dorado y un plato servido.
const PAN = "a big round black cast-iron frying pan";
const CAB = "a whole round green cabbage";
const GOLD = "green cabbage strips with golden brown edges and crispy bacon bits";
export const ESC = {
  retoma: { set: "M1", light: "early morning daylight from a side window",
    base: `stands at the old white gas stove with all burners off; the clay olla of coffee sits to one side and ${CAB} rests on the counter; he talks to the camera`,
    clips: {
      c01: ["rests one hand on top of the green cabbage and smiles", "his hand on top of the cabbage, smiling at the camera"],
      c02: ["picks up the cabbage with both hands and shows it to the camera", "the cabbage held in both hands toward the camera"] } },
  salon: { set: "M4", light: "ordinary morning daylight from the open street door",
    base: "stands in the small dining room of the fonda between the wooden tables with flowered oilcloth tablecloths, next to the small blackboard with chalk handwriting, talking to the camera",
    clips: {
      c03: ["points at the blackboard with one finger", "his finger pointing at the blackboard"],
      c04: ["shrugs with open hands, then nods", "open hands, a small nod"],
      c05: ["taps the blackboard twice with his knuckle", "his knuckle resting on the blackboard"],
      c06: ["shakes his head with a small laugh", "a small laugh, looking at the camera"],
      c08: ["holds up his hands as if holding a round cabbage between them", "both hands curved around an imaginary ball"],
      c09: ["holds up six fingers with both hands", "six fingers held up"] } },
  mesa_ama: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table with an empty clay bowl and ${CAB} in front of him, talking to the camera`,
    clips: {
      c07: ["puts one hand on the green cabbage and nods slowly with a warm smile", "his hand resting on the cabbage, a warm look"] } },
  mesa_ing: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table; on the table ${CAB}, a small clay bowl of chopped raw bacon, a white onion, three tiny clay dishes with salt, black pepper and red chile powder, a stick of butter on a saucer and a bottle of apple cider vinegar`,
    clips: {
      c10: ["touches the cabbage, then the bowl of bacon, then the onion", "his hand resting beside the onion"],
      c11: ["points at the tiny dishes one by one, then at the vinegar bottle", "his finger on the vinegar bottle"] } },
  tabla: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table with a big wooden cutting board heaped with green cabbage strips and ${PAN} empty beside it`,
    clips: {
      c12: ["pulls apart a handful of cabbage strips with his fingers and lets them fall on the pile", "his hands resting on the pile of cabbage strips"],
      c13: ["lifts the empty cast-iron pan a little by its handle and sets it down", "his hand on the pan handle"],
      c14: ["points at the pan, then at the cabbage", "his finger pointing at the cabbage pile"],
      c15: ["shakes his finger no while looking at the camera", "one finger raised, serious face"] } },
  estufa_a: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove with ${PAN} on a medium blue flame, a small white plate on the counter beside it`,
    clips: {
      c16: ["lifts golden crispy bacon bits out of the pan with a slotted spoon onto the white plate", "the plate of crispy bacon on the counter, the spoon over it"],
      c17: ["turns the stove knob higher, the flame grows under the pan of softened onion", "his hand on the stove knob, the pan of onion on a high flame"] } },
  estufa_b: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; in ${PAN} on a high flame the first batch of cabbage strips glossy with fat, a wide clay bowl of raw cabbage strips on the counter`,
    clips: {
      c18: ["stirs the cabbage once with a wooden spoon and watches it shrink", "the wooden spoon resting on the pan edge"],
      c19: ["tips the clay bowl and the rest of the raw cabbage falls into the pan", "the empty clay bowl in his hand over the pan"] } },
  estufa_c: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; ${PAN} heaped with half-cooked cabbage strips on a high flame, metal tongs in his hand`,
    clips: {
      c20: ["sprinkles a pinch of black pepper from a tiny clay dish over the cabbage", "the tiny dish lowered beside the pan"],
      c21: ["holds the tongs still and waits, watching the pan, then lifts the cabbage once from the bottom", "the tongs resting on the pan edge"] } },
  estufa_d: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; in ${PAN} cabbage strips with golden brown edges, metal tongs, a small tin of lard on the counter`,
    clips: {
      c22: ["adds a small spoon of lard at the edge of the pan", "the small spoon lowered beside the pan"],
      c23: ["picks up one cabbage strip with the tongs, blows on it and tastes it, then nods", "chewing with a small nod"] } },
  estufa_e: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the old white gas stove with the flame off; ${PAN} full of green cabbage strips with golden brown edges, a small plate of crispy bacon bits and a saucer with butter on the counter`,
    clips: {
      c24: ["drops a spoon of butter into the pan, then tips the plate of crispy bacon over the cabbage", "the empty plate in his hand over the pan"],
      c25: ["points at the pan while talking", "his finger pointing at the golden cabbage"] } },
  servir: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table with a white plate of ${GOLD} in front of him`,
    clips: {
      c26: ["turns the plate slightly toward the camera and smiles", "the plate turned toward the camera, proud smile"],
      c31: ["slides a plate with a pork chop and a small clay bowl of beans next to the cabbage", "both plates side by side, his hand pulling back"] } },
  mesa_cmp: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands behind the thick worn wooden work table with two white plates in front of him: on the left pale watery limp boiled cabbage pieces, on the right green cabbage strips with golden brown edges",
    clips: {
      c27: ["points at the pale boiled cabbage, then at the golden cabbage", "his finger pointing at the golden cabbage"] } },
  mesa_res: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table with ${PAN} full of ${GOLD} resting on a folded cloth`,
    clips: {
      c28: ["counts slowly on his fingers while talking", "he holds up four fingers"],
      c29: ["shakes one finger no, then points at the pan", "his hand beside the pan, nodding"] } },
  mesa_cta1: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands at the thick worn wooden work table with the thick grease-stained recipe notebook open on the table, handwritten pages",
    clips: {
      c30: ["turns one page of the notebook and taps it with his finger", "his finger resting on the handwritten page"] } },
  taco: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table with corn tortillas in an embroidered cloth, a black stone molcajete of green salsa and a plate of ${GOLD}`,
    clips: {
      c32: ["puts a spoon of the golden cabbage on a tortilla", "the tortilla with cabbage in his hand"],
      c33: ["spoons a little green salsa on the taco and takes a bite", "chewing, the taco in his hand, nodding"] } },
  mercado: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands behind the thick worn wooden work table with three whole round green cabbages in front of him",
    clips: {
      c34: ["lifts one cabbage in one hand, weighing it up and down", "the cabbage held in one hand, weighing it"],
      c35: ["squeezes the cabbage with both hands, then turns it to show the white stem end", "the white stem end of the cabbage toward the camera"] } },
  preguntas: { set: "M3", light: "soft daylight from the window",
    base: "stands by the kitchen window; on the windowsill a small plate of golden cabbage; he talks to the camera",
    clips: {
      c36: ["raises one finger, then shakes his head", "one finger raised"],
      c37: ["raises two fingers", "two fingers raised"],
      c38: ["raises three fingers and nods", "three fingers raised"],
      c39: ["shakes his head slowly with a kind smile", "a kind smile"],
      c40: ["raises four fingers", "four fingers raised"],
      c41: ["raises one open hand with five fingers", "five fingers raised"],
      c42: ["points at the plate on the windowsill and smiles", "his finger pointing at the plate, smiling"] } },
  costo: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands at the thick worn wooden work table; on the table in a row ${CAB}, a small clay bowl of chopped bacon, a white onion, a stick of butter on a saucer and a bottle of apple cider vinegar; he talks to the camera`,
    clips: {
      c43: ["taps the cabbage twice", "his hand on the cabbage"],
      c44: ["touches the onion, the butter and the vinegar one after another", "his hand on the vinegar bottle"],
      c45: ["raises both hands with six fingers up over the ingredients", "six fingers held up over the ingredients"] } },
  costo_b: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands at the thick worn wooden work table with ${PAN} of ${GOLD} and a served white plate in front of him`,
    clips: {
      c46: ["picks up the plate and raises it slightly toward the camera with a warm smile", "the plate raised toward the camera, warm smile"] } },
};
