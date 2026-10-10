// Dirección del VLOG CONTINUO cccarne (Claudio Cocina, la fonda: carne de olla, chambarete 3 horas). Por escena: set (maestra
// M1-M4 de vlog/cc/lib.mjs), estado de la comida en ESA escena (tabla abajo; nunca se contradice) y por clip [acción, cuadro FINAL].
// Sólo las escenas que quedan como VLOG (las de "a cámara" — salón, preguntas, costo, resumen, amá — van al 2º /run del avatar, av2).
//
// TABLA DE ESTADO (orden de la historia)
//   retoma     M1  hornillas apagadas; la cazuela grande de barro a un lado.
//   mesa_ing   M2  trozos de chambarete crudo en charola; sal, pimienta, latita de manteca; cebolla, 4 ajos, 2 chiles ancho secos;
//                  2 jitomates; botella de vinagre; botella de cerveza oscura; papas y zanahorias.
//   tabla      M2  tabla con trozos de chambarete crudo con nervios blancos y un poco de grasa; cuchillo.
//   estufa_a   M1  sartén de fierro negro vacío en la hornilla; la cazuela grande de barro al lado (apagada).
//   estufa_b   M1  sartén con trozos de carne dorada café oscuro; plato con la primera tanda dorada.
//   estufa_c   M1  sartén/olla con cebolla, ajo y tiras de chile en la grasa; cuchara de palo.
//   estufa_d   M1  cazuela de barro con la carne dorada en salsa roja oscura que llega a la MITAD de la carne; tapa de barro.
//   tabla_b    M2  tabla con papas peladas en trozos grandes y zanahorias en trozos de tres dedos.
//   estufa_e   M1  cazuela destapada: carne oscura brillante, salsa espesa, papas y zanahorias hundidas.
//   estufa_f   M1  igual, salsa espesa, cuchara de madera.
//   servir     M2  plato hondo de barro con carne deshebrándose, papas, zanahoria y salsa oscura; (c34-36) arroz, tortillas, bolillo.
//   mesa_cmp   M2  dos platos: bistec gris seco y duro / carne de olla oscura que se deshace.
//   mesa_cta1  M2  la libreta abierta, página escrita a mano.
//   mercado    M2  sobre papel de carnicería, dos rodajas crudas de chambarete con su hueso redondo en el centro.
const OLLA = "a big wide brown clay cazuela";
const RAW = "large raw beef shank chunks with white sinew and a little fat";
const STEW = "dark glossy beef chunks in a thick dark red chile sauce with potato and carrot pieces";
export const ESC = {
  retoma: { set: "M1", light: "early morning daylight from a side window",
    base: `stands at the old white gas stove with all burners off; ${OLLA} with its clay lid sits on the counter beside him; he talks to the camera`,
    clips: {
      c02: ["rests one hand on the clay lid of the cazuela and holds up three fingers with the other", "three fingers raised, his other hand on the clay lid"] } },
  mesa_ing: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table; on the table a metal tray with ${RAW}, three tiny clay dishes with salt and black pepper, a small tin of lard, a white onion, four garlic cloves, two dried dark red ancho chiles, two red tomatoes, a bottle of apple cider vinegar, a brown bottle of dark beer, potatoes and carrots`,
    clips: {
      c09: ["lifts one raw beef chunk from the tray with his fingers and shows it to the camera", "the raw beef chunk held toward the camera"],
      c10: ["touches the tiny dishes, then the tin of lard, then the dried chiles", "his hand resting beside the dried chiles"],
      c11: ["points at the tomatoes, the vinegar and the beer bottle one after another", "his finger on the beer bottle"] } },
  tabla: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table with a big wooden cutting board holding ${RAW} and a kitchen knife`,
    clips: {
      c12: ["turns one raw beef chunk with his fingers to show the white sinew to the camera", "his finger pointing at the white sinew on the beef"] } },
  estufa_a: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the old white gas stove; a heavy black cast-iron frying pan sits empty on a burner and ${OLLA} with its lid sits on the next burner, flames off`,
    clips: {
      c13: ["lifts the clay lid of the cazuela, shows it and puts it back", "his hand resting on the clay lid"],
      c14: ["taps the side of the clay cazuela with his knuckle", "his hand flat on the side of the cazuela"],
      c15: ["points at the cast-iron pan, then at the cazuela", "his finger pointing at the cazuela"] } },
  estufa_b: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: "stands at the old white gas stove; in a heavy black cast-iron frying pan on a medium-high flame beef chunks with a dark brown crust, a white plate beside it",
    clips: {
      c16: ["moves the browned beef chunks one by one with metal tongs onto the white plate", "the plate of browned beef, the tongs over it"] } },
  estufa_c: { set: "M1", light: "morning daylight from a side window and the blue gas flame",
    base: "stands at the old white gas stove; in a heavy black cast-iron pan on a medium flame onion pieces, garlic and strips of dark red dried chile in the fat, a wooden spoon in his hand",
    clips: {
      c17: ["scrapes the bottom of the pan slowly with the wooden spoon", "the wooden spoon scraping the pan bottom"],
      c18: ["stirs the onion and chile once and leans in to smell", "leaning over the pan, smelling, a small nod"],
      c19: ["raises one finger in warning while looking at the camera", "one finger raised, serious face"] } },
  estufa_d: { set: "M1", light: "morning daylight from a side window and a tiny blue gas flame",
    base: `stands at the old white gas stove; ${OLLA} with browned beef chunks in a dark red sauce that reaches only halfway up the meat, the clay lid on the counter`,
    clips: {
      c20: ["points into the cazuela at the level of the sauce on the meat", "his finger pointing at the sauce line on the beef"],
      c21: ["puts the clay lid on the cazuela and lifts both hands away from it", "both hands raised away from the lidded cazuela"] } },
  tabla_b: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands behind the thick worn wooden work table with a wooden cutting board holding large peeled potato chunks and carrots cut in thick pieces, a knife",
    clips: {
      c22: ["picks up one potato chunk and shows its size to the camera", "the potato chunk held up toward the camera"],
      c23: ["lays three fingers next to a carrot piece to show its length", "three fingers resting beside the carrot piece"] } },
  estufa_e: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the old white gas stove; ${OLLA} uncovered with ${STEW}, the clay lid in his hand`,
    clips: {
      c24: ["points at the dark glossy meat in the cazuela", "his finger pointing at the dark glossy meat"],
      c25: ["leans over the cazuela, smells the steam and closes his eyes with a smile, then puts the lid on", "the clay lid on the cazuela, his hand on it"] } },
  estufa_f: { set: "M1", light: "morning daylight from a side window",
    base: `stands at the old white gas stove; ${OLLA} uncovered with ${STEW}, a wooden spoon in his hand`,
    clips: {
      c26: ["tastes a little sauce from the wooden spoon and nods", "chewing, a small nod, the spoon lowered"],
      c27: ["tilts the cazuela a little and skims the surface with a big spoon", "the big spoon lifted over the cazuela"] } },
  servir: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table with a deep clay bowl of ${STEW}, a small plate of white rice, corn tortillas in an embroidered cloth and a bolillo roll`,
    clips: {
      c28: ["presses a beef chunk in the bowl with a fork and it falls apart", "the fork resting in the shredded beef"],
      c29: ["turns the bowl slightly toward the camera and smiles", "the bowl turned toward the camera, proud smile"],
      c34: ["slides the plate of white rice next to the bowl", "the rice plate beside the bowl, his hand pulling back"],
      c35: ["sprinkles chopped onion and cilantro over the bowl", "his fingers lifted over the bowl"],
      c36: ["tears a piece of the bolillo and wipes up the sauce", "the piece of bread with sauce in his hand"] } },
  mesa_cmp: { set: "M2", light: "soft morning daylight from a side window",
    base: `stands behind the thick worn wooden work table with two white plates in front of him: on the left a gray dry tough pan-fried beef steak, on the right a deep portion of ${STEW} falling apart`,
    clips: {
      c30: ["points at the gray steak, shakes his head, then points at the dark stew", "his finger pointing at the dark stew"] } },
  mesa_cta1: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands at the thick worn wooden work table with the thick grease-stained recipe notebook open on the table, handwritten pages",
    clips: {
      c33: ["turns one page of the notebook and taps it with his finger", "his finger resting on the handwritten page"] } },
  mercado: { set: "M2", light: "soft morning daylight from a side window",
    base: "stands behind the thick worn wooden work table with two thick raw beef shank slices on white butcher paper, each with a round marrow bone in the center",
    clips: {
      c37: ["lifts one raw beef shank slice and shows the round bone in the center to the camera", "the shank slice held up, bone toward the camera"],
      c38: ["points at the marrow in the center of the bone and smiles", "his finger pointing at the marrow, smiling"] } },
};
