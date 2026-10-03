// DIRECTOR de opalpred — helpers. Cada toma: S(p, frase, kind, name, opts)
//   p = índice de párrafo (_v3/opalpred_paras.json) · frase = palabras donde ARRANCA la toma dentro del párrafo ("" = inicio)
//   kind: av (avatar InfiniteTalk) · vl (clip agnes 2.5 hablado, minuto 1)
//         bi (foto gpt sin Opal → clip agnes v2.0 `anim`) · hz (foto gpt CON Opal, /edits con su cara; Ken-Burns)
//         st (stock Pexels real: "st_<base>.<n>" = n-ésimo tile bueno del juez) · c (componente Op*)
//   opts: { p: prompt, anim: movimiento agnes v2.0, props, ov: overlay {c, props} }
export const S = (p, at, kind, name, o = {}) => ({ ...o, prompt: o.p, p, at, kind, name });

export const WHO = "Opal, a 68-year-old farm woman with grey hair pulled back in a loose low bun with stray strands, a navy blue long-sleeved cotton dress with a tiny pink and white flower print and small buttons, a grey and white pinstriped cotton pinafore apron over it, natural older skin with lines and age spots, no jewelry";
export const COOP = "the inside of her small red-painted wooden chicken coop on an Indiana farm: a row of wooden nest boxes with straw, pine shavings on the floor, wooden roost bars, a galvanized hanging feeder, a small window with chicken wire, daylight through the open door";
export const YARD = "the muddy chicken yard of a small Indiana farm: a red wooden coop with white trim, a galvanized poultry waterer on a stand, straw and mud on the ground, a wire fence, a weathered grey barn behind, bare autumn trees";
export const BARN = "the inside of an old weathered wooden barn on an Indiana farm: rough grey plank walls, light through gaps in the boards, old square hay bales stacked in a corner with loose hay on the dirt floor, an old wheelbarrow";
export const KITCHEN = "an old Indiana farmhouse kitchen: a worn wooden table with a checked oilcloth, a white enamel sink under a window looking out on the chicken yard, a paper wall calendar, egg cartons on the counter";
export const STORE = "a small rural feed store in Indiana: stacked paper feed sacks on wooden pallets, metal shelves with galvanized feeders and waterers, a worn concrete floor, fluorescent ceiling lights";
export const HENS = "reddish-brown hens with bright red combs";

const TAIL = " One ordinary frame pulled from a normal handheld video shot at eye level with a consumer camera, simply recording what happens, casual slightly imperfect framing with something cut by the edge of the frame. Almost everything is in focus, nothing blurred out: the background stays readable with ordinary everyday objects. Only the light the place really has, correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real materials with wear, dirt and use. Animals and people, if any, are caught mid-action, unposed.";
export const BI = (scene) => scene + TAIL;
export const HZP = (scene, where = YARD) => `${WHO}, in ${where}. ${scene} Her face is the face of the reference image: same face, same age, same grey hair, not younger, not prettier. She wears the same navy flowered dress and grey pinstriped apron.` + TAIL;
