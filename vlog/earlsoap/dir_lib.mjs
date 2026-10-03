// DIRECTOR de earlsoap — helpers. Cada toma: S(p, frase, kind, name, opts)
//   kind: av (avatar InfiniteTalk) · vl (clip agnes 2.5 hablado, minuto 1) · bi (foto gpt sin Earl → clip agnes v2.0)
//         hz (foto gpt CON Earl, /edits con su cara; Ken-Burns) · st (stock Pexels "st_<base>.<n>") · c (componente El*)
export const S = (p, at, kind, name, o = {}) => ({ ...o, prompt: o.p, p, at, kind, name });

export const WHO = "Earl, a 70-year-old African American man with short white hair, a short white mustache and a few days of grey stubble, a faded light-blue denim work shirt worn open over a navy blue t-shirt, white rubber shrimper boots, weathered dark skin with deep lines";
export const SHED = "his open-sided seafood shed on a Gulf Coast dock in Mississippi: corrugated metal walls, white plastic coolers and trays of raw Gulf shrimp on crushed ice, a hanging scale, fluorescent tube lights, blue plastic barrels, shrimp boats with tall green outriggers moored right behind";
export const HARBOR = "a small working shrimp boat harbor on the Mississippi Gulf Coast: weathered wooden docks, white and blue shrimp trawlers with tall outrigger booms and hanging green nets, pelicans on the pilings, grey-green water";
export const DECK = "the back deck of an old wooden Gulf shrimp trawler at night: bright work lights on the rigging, wet deck boards, a sorting table heaped with the catch, nets hanging from the booms, black sea around";
export const STORE = "the frozen seafood aisle of an ordinary American supermarket: glass freezer doors, stacked plastic bags of frozen shrimp with colorful labels, price tags on the shelf edge, bright fluorescent light";
export const KITCHEN = "a small Gulf Coast home kitchen: an old gas stove with a big aluminum pot, a window over the sink with a view of live oaks, a table covered with newspaper, a roll of paper towels";

const TAIL = " One ordinary frame pulled from a normal handheld video shot at eye level with a consumer camera, simply recording what happens, casual slightly imperfect framing with something cut by the edge of the frame. Almost everything is in focus, nothing blurred out: the background stays readable with ordinary everyday objects. Only the light the place really has, correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real materials with wear, water and use. People, if any, are caught mid-action, unposed. No real brand names or logos.";
export const BI = (scene) => scene + TAIL;
export const HZP = (scene, where = SHED) => `${WHO}, in ${where}. ${scene} His face is the face of the reference image: same face, same age, same white hair and mustache, not younger. He wears the same faded denim shirt over a navy t-shirt.` + TAIL;
