// Dirección del VLOG CONTINUO ccejotes (Claudio Cocina, la fonda). Por escena: set (maestra M1-M4 de vlog/cc/lib.mjs), estado de
// la comida en ESA escena (tabla abajo; nunca se contradice entre escenas) y por clip [acción durante el clip, cuadro FINAL = ancla].
// Acciones simplísimas (agnes): un gesto por clip, manos visibles, nada que aparezca de la nada.
//
// TABLA DE ESTADO DE LA COMIDA (orden de la historia)
//   retoma     M1  sartén ancho de hierro VACÍO con su tapa de metal al lado en la hornilla apagada; jarrito de barro chico al lado.
//   salon      M4  sin comida: mesas vacías con manteles de flores, pizarrón con tiza.
//   mesa_ama   M2  canasta con ejotes CRUDOS enteros (verde claro mate) + unas vainas abiertas mostrando frijolitos.
//   mesa_err   M2  canasta con ejotes crudos enteros + la libreta.
//   mesa_ing   M2  ejotes crudos enteros en canasta; tocino en tira sobre papel; media cebolla blanca; 2 jitomates; 2 ajos; 1 chile serrano;
//                  jarrito de barro chico con agua; cazuelita de sal.
//   limpiar    M2  tabla de madera: ejotes ya sin puntas, cortados en trozos de 5 cm; colador de metal; tazón.
//   sarten_a   M1  sartén ancho de hierro VACÍO y frío con su tapa; en la tabla tocino picado en cuadritos.
//   tocino     M1  sartén con tocino dorándose; luego cebolla en tiras transparente en la grasa. Sin ejotes todavía.
//   ejotes     M1  ejotes crudos verde claro en el sartén con el tocino y la cebolla; luego TAPA de metal puesta; tabla con jitomate.
//   jitomate   M1  sartén destapado: ejotes VERDE BRILLANTE + tocino; se agrega jitomate picado, ajo, chile; tapa a un lado.
//   listos     M1  sartén destapado: ejotes verde brillante con manchitas doradas, tocino crujiente, jitomate pegado, sartén seco.
//   mesa_cmp   M2  dos platos: ejotes hervidos verde olivo grisáceo y blandos / ejotes del sartén verde brillante con tocino.
//   mesa_res   M2  plato de barro con los ejotes del sartén.
//   mesa_cta1  M2  la libreta abierta, página escrita a mano.
//   servir     M4  plato con costilla glaseada + ejotes con tocino, tortillas en servilleta bordada, cazuelita de salsa, queso fresco.
//   chuy       M4  don Chuy en su mesa con plato de ejotes con tocino y tortillas.
//   preguntas  M3  ventana: en la repisa un plato chico de barro con ejotes.
//   huevo_a    M1  sartén caliente vacío; tazón con 2 huevos batidos y plato de ejotes sobrantes al lado.
//   huevo_b    M1  sartén con ejotes con huevo revuelto suave; luego plato con refritos, tortillas, salsa roja; taco de ejotes.
//   costo      M2  en fila: 1 kg ejotes en bolsa de mercado, tocino en papel, media cebolla, 2 jitomates, ajo, chile serrano.
//   costo_b    M2  plato de barro con los ejotes del sartén.
const PAN = "a wide black cast-iron frying pan";
const LID = "a dented round metal lid";
const JAR = "a small brown clay jarrito";
const RAWB = "a woven basket of whole raw green beans, pale matte green";
const DONE = "bright glossy green beans with crispy bacon bits, chopped tomato clinging to them and small golden browned spots";
export const ESC = {
  retoma: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the old white gas stove with all burners off; on the front burner ${PAN} sits empty with ${LID} beside it and ${JAR} next to the stove; he talks to the camera`,
    clips: {
      c01: ["rests one hand on the handle of the empty frying pan and smiles", "his hand on the pan handle, smiling at the camera"],
      c02: ["taps the metal lid with two fingers and nods", "his fingers on the metal lid, a small nod"] } },
  salon: { set: "M4", light: "ordinary morning daylight from the open street door",
    base: "stands in the small dining room of the fonda between the wooden tables with flowered oilcloth tablecloths, the tables still empty, the small blackboard on the wall behind with chalk handwriting, talking to the camera",
    clips: {
      c03: ["walks slowly between the empty tables and gestures at them with his open hand", "his open hand toward the empty tables"],
      c04: ["holds up both hands with fingers spread, then lowers them", "both hands up with fingers spread"],
      c05: ["puts his hand on his chest and nods slowly", "his right hand flat on his chest"],
      c06: ["shrugs, then raises one finger", "one finger raised, eyebrows up"],
      c07: ["smiles and opens one hand toward the camera", "his open palm toward the camera, smiling"],
      c08: ["points at himself, then waves his hand toward the street door", "his hand toward the open street door"],
      c09: ["counts slowly on his fingers", "he holds up four fingers, smiling"] } },
  mesa_ama: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table with ${RAWB} in front of him and two green bean pods split open on the table showing small white beans inside`,
    clips: {
      c10: ["picks up one split pod and shows the tiny beans inside to the camera", "the split green bean pod held up, tiny white beans visible inside"],
      c11: ["puts the pod down and holds up two fingers", "two fingers raised over the basket"],
      c12: ["smiles and shakes his head slowly", "a warm smile, shaking his head slightly"] } },
  mesa_err: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table with ${RAWB} in front of him and the recipe notebook beside it, talking to the camera`,
    clips: {
      c13: ["picks up a handful of raw green beans, shows them and puts them back, shrugging kindly", "his hand resting on the basket, a kind half smile"] } },
  mesa_ing: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table; on the table ${RAWB}, strips of raw bacon on brown paper, half a white onion, two red tomatoes, two garlic cloves, one green serrano chile, ${JAR} with water and a small clay bowl of coarse salt; he talks to the camera with his hands on the table`,
    clips: {
      c14: ["points at the basket of green beans, then at the strips of bacon", "his finger points at the raw bacon strips"],
      c15: ["touches the onion, the tomatoes and the serrano chile, then taps the clay jarrito", "his hand resting on the small clay jarrito"] } },
  limpiar: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands at the thick worn wooden work table with a wooden cutting board covered with trimmed green beans, a kitchen knife, a metal colander and a clay bowl",
    clips: {
      c16: ["slowly cuts a small bundle of green beans into short pieces with the knife", "short pieces of green beans on the board, the knife resting beside them"],
      c17: ["shakes the metal colander full of wet green bean pieces gently over the bowl", "the colander of rinsed green bean pieces resting on the bowl"] } },
  sarten_a: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the old white gas stove; on the front burner ${PAN}, empty and cold, with ${LID} beside it; next to the stove a small cutting board with finely diced raw bacon`,
    clips: {
      c18: ["lifts the empty frying pan a little by its handle to show its width, and sets it down", "the empty frying pan back on the burner, his hand on the handle"],
      c19: ["puts the metal lid on the empty pan and lifts it off again", "the lid in his hand above the pan"],
      c20: ["points at the small cubes of diced bacon on the board", "his finger pointing at the diced bacon"] } },
  tocino: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; in ${PAN} on a medium blue flame diced bacon is frying, turning golden, with clear melted fat around it`,
    clips: {
      c21: ["stirs the bacon slowly with a wooden spoon, then drops in a handful of sliced white onion", "sliced onion and bacon in the pan, the wooden spoon resting in it"],
      c22: ["stirs the onion in the bacon fat slowly, the onion turning translucent", "translucent onion and golden bacon glistening with fat"],
      c23: ["tilts the pan slightly to show the melted fat pooling at the side", "the pan tilted a little, a small pool of clear fat at its edge"],
      c24: ["lowers the flame knob a little and watches the pan", "his hand on the stove knob, looking at the gently sizzling pan"] } },
  ejotes: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; in ${PAN} on a medium flame bacon and translucent onion; ${LID} beside the stove; a cutting board next to the stove with two red tomatoes`,
    clips: {
      c25: ["tips a bowl of raw green bean pieces into the pan and stirs them with the wooden spoon so they shine", "raw pale green beans glistening with fat in the pan, the spoon in them"],
      c26: ["with the lid on the pan, chops a tomato slowly on the board next to the stove", "chopped tomato on the board, the lid closed on the pan behind"] } },
  jitomate: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; in the uncovered ${PAN} bright green beans with bacon, the metal lid set aside; a board with chopped tomato, garlic and serrano chile`,
    clips: {
      c27: ["slides the chopped tomato from the board into the pan with the knife", "chopped red tomato on top of the bright green beans"],
      c28: ["stirs the beans and tomato slowly with the wooden spoon", "the tomato clinging to the bright green beans, the spoon resting in the pan"] } },
  listos: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove; in the uncovered ${PAN} ${DONE}; the pan is dry`,
    clips: {
      c29: ["points at the tomato in the pan and raises one finger", "one finger raised over the pan"],
      c30: ["picks up one green bean with his fingers, blows on it and bites it", "he chews, nodding, half a green bean in his fingers"],
      c31: ["gently shakes the pan, then gestures at it with an open hand", "his open hand over the pan of finished green beans"] } },
  mesa_cmp: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands behind the thick worn wooden work table with two white plates in front of him: on the left soft boiled green beans, dull olive grey-green and limp; on the right bright glossy green beans with crispy bacon and tomato",
    clips: {
      c32: ["lifts a limp grey-green bean from the left plate with a fork, it bends, then he points at the bright plate", "his fork pointing at the plate of bright green beans"] } },
  mesa_res: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table with a clay plate of ${DONE} in front of him, talking to the camera`,
    clips: {
      c33: ["counts slowly on his fingers while talking", "he holds up four fingers"],
      c34: ["points at the plate of green beans and nods", "his hand beside the clay plate, nodding"] } },
  mesa_cta1: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands at the thick worn wooden work table with the thick grease-stained recipe notebook open on the table, handwritten pages",
    clips: {
      c35: ["turns one page of the notebook slowly and taps it with his finger", "his finger resting on the handwritten page"] } },
  servir: { set: "M4", light: "ordinary morning daylight from the open street door",
    base: "stands at a table in the dining room with flowered oilcloth; on the table a plate with a glazed pork rib and green beans with bacon, corn tortillas in an embroidered napkin, a small clay bowl of red salsa and a piece of fresh white cheese",
    clips: {
      c36: ["puts a spoonful of green beans beside the rib on the plate", "the plate with the rib and the green beans, his hand pulling back"],
      c37: ["takes a warm tortilla from the napkin and fills it with green beans", "the green bean taco in his hand"],
      c38: ["crumbles fresh white cheese over the green beans on the plate", "white cheese crumbs on the green beans"] } },
  chuy: { set: "M4", light: "ordinary morning daylight from the open street door",
    base: "in the dining room, the old man don Chuy sits at his table with a plate of green beans with bacon and tortillas; Claudio stands beside the table",
    clips: {
      c39: ["don Chuy eats a forkful of green beans and shrugs while Claudio laughs and raises his hands", "Claudio with his hands raised, laughing, don Chuy chewing"] } },
  preguntas: { set: "M3", light: "soft daylight from the window",
    base: "stands by the kitchen window; on the windowsill a small clay plate of green beans with bacon; he talks to the camera",
    clips: {
      c40: ["raises one finger, then shrugs with a small nod", "one finger raised, a small nod"],
      c41: ["raises two fingers", "two fingers raised"],
      c42: ["shakes his head slowly with a kind smile", "a kind smile, shaking his head"],
      c43: ["raises three fingers", "three fingers raised"],
      c44: ["raises four fingers and nods", "four fingers raised"],
      c45: ["raises one open hand, then mimes squeezing a lime", "his fingers pinched as if squeezing a lime"],
      c46: ["raises both hands with six fingers up", "six fingers raised with both hands"],
      c47: ["points at the plate of green beans on the windowsill and smiles", "his finger pointing at the plate on the windowsill, smiling"] } },
  huevo_a: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: `stands at the old white gas stove with ${PAN} on a medium flame, a clay bowl of two beaten eggs and a plate of leftover green beans with bacon beside the stove`,
    clips: {
      c48: ["points at the bowl of beaten eggs and smiles", "his finger pointing at the bowl of beaten eggs"],
      c49: ["tips the leftover green beans from the plate into the hot pan and spreads them with the wooden spoon", "the green beans spread in the pan, the spoon resting"] } },
  huevo_b: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the old white gas stove; in ${PAN} green beans with soft scrambled eggs; on the counter a plate, refried beans, corn tortillas in a napkin and a small clay bowl of red salsa`,
    clips: {
      c50: ["turns off the flame knob and spoons the eggs with green beans onto the plate next to refried beans", "the plate with eggs, green beans and refried beans"],
      c51: ["lays a tortilla on his palm, adds green beans and crumbled cheese, and folds it", "the folded taco in his hand"],
      c52: ["takes a bite of the taco and nods, chewing", "chewing, nodding, the taco in his hand"],
      c53: ["puts the taco on the plate and dusts off his hands", "his hands together, smiling at the camera"] } },
  costo: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands at the thick worn wooden work table; on the table in a row a plastic market bag with green beans, raw bacon on brown paper, half a white onion, two red tomatoes, a head of garlic and a green serrano chile; he talks to the camera",
    clips: {
      c54: ["taps the bag of green beans, then the bacon, then the onion", "his hand on the half onion"],
      c55: ["touches the tomatoes, the garlic and the chile one after another", "his hand on the serrano chile"],
      c56: ["raises both hands with six fingers up over the ingredients", "six fingers held up over the ingredients"] } },
  costo_b: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands at the thick worn wooden work table with a clay plate of ${DONE} in front of him, both hands resting on the table`,
    clips: {
      c57: ["taps the table with one finger three times while talking", "his finger on the table, serious face"],
      c58: ["shakes his head slowly, one hand raised", "shaking his head, one hand raised"],
      c59: ["looks at the plate of green beans and nods slowly with a warm smile", "his hands resting beside the plate, warm smile at the camera"] } },
};
