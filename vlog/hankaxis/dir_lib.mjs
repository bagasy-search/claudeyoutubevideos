// DIRECTOR de hankaxis — helpers. Cada toma: S(p, frase, kind, name, opts)
//   kind: av (avatar InfiniteTalk) · vl (clip agnes 2.5 hablado, minuto 1) · bi (foto gpt sin Earl → clip agnes v2.0)
//         hz (foto gpt CON Earl, /edits con su cara; Ken-Burns) · st (stock Pexels "st_<base>.<n>") · c (componente El*)
export const S = (p, at, kind, name, o = {}) => ({ ...o, prompt: o.p, p, at, kind, name });

export const WHO = "Hank, a 62-year-old white man from Louisiana with a short grey beard and stubble, a worn olive green bucket hat, a faded red plaid flannel shirt open over a grey t-shirt, reading glasses hanging on a cord around his neck, weathered sunburned skin with deep lines";
export const ROAD = "a narrow country road in Upcountry Maui, Hawaii: rolling green and golden pasture, wire ranch fences, eucalyptus trees, the long slope of Haleakala volcano under clouds";
export const RANCH = "a cattle ranch in Upcountry Maui, Hawaii: dry golden pasture, a weathered wooden corral, a dusty pickup truck, cattle in the distance, eucalyptus windbreaks";
export const FARM = "a small vegetable and flower farm in Kula, Maui: rows of crops on red volcanic soil, an eight-foot deer fence of wire mesh around the field, a farmhouse with a tin roof";
export const COAST = "the west coast of Maui, Hawaii: a sandy beach, clear turquoise water over coral reef, a small boat, bare reddish hills behind the town";
export const FOREST = "a native Hawaiian mountain forest on the slopes of Maui: ohia trees with red blossoms, tree ferns, mist, a tall wire fence line running through it";
export const AXIS = "axis deer (chital), small reddish-brown deer with white spots all over their bodies, the bucks with tall three-point antlers";
const TAIL = " One ordinary frame pulled from a normal handheld video shot at eye level with a consumer camera, simply recording what happens, casual slightly imperfect framing with something cut by the edge of the frame. Almost everything is in focus, nothing blurred out: the background stays readable with ordinary everyday objects. Only the light the place really has, correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real materials with wear, water and use. People, if any, are caught mid-action, unposed. No real brand names or logos.";
export const BI = (scene) => scene + TAIL;
export const HZP = (scene, where = ROAD) => `${WHO}, in ${where}. ${scene} His face is the face of the reference image: same face, same age, same grey beard, not younger. He wears the same olive bucket hat and faded red plaid flannel shirt over a grey t-shirt.` + TAIL;
