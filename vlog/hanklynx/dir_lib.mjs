// DIRECTOR de hanklynx — helpers. Cada toma: S(p, frase, kind, name, opts)
//   kind: av (avatar InfiniteTalk) · vl (clip agnes 2.5 hablado, minuto 1) · bi (foto gpt sin Earl → clip agnes v2.0)
//         hz (foto gpt CON Earl, /edits con su cara; Ken-Burns) · st (stock Pexels "st_<base>.<n>") · c (componente El*)
export const S = (p, at, kind, name, o = {}) => ({ ...o, prompt: o.p, p, at, kind, name });

export const WHO = "Hank, a 62-year-old white man from Louisiana with a short grey beard and stubble, a worn olive green bucket hat, a faded red plaid flannel shirt open over a grey t-shirt, reading glasses hanging on a cord around his neck, weathered sunburned skin with deep lines";
export const ROAD = "a narrow single-track road in the Cairngorms in the Scottish Highlands on a cold damp winter day: brown heather on rolling hills, a low dry stone wall, sheep, a forest of old Scots pines in the valley, snow-streaked mountains under low clouds";
export const RANCH = "a hill sheep farm in the Scottish Highlands: a stone farmhouse and stone sheds, sheep pens, rough grazing on heather hills, a quad bike, two border collies";
export const FARM = "a Highland village in the Cairngorms: grey stone cottages with slate roofs, a little café with steamed-up windows, a church, pine-covered hills behind";
export const COAST = "a cozy café in a Highland village: wooden tables, steamed-up windows, mugs of tea, a woodburning stove";
export const FOREST = "an old Caledonian pine forest in the Cairngorms: tall twisted Scots pines, heather and blaeberry on the ground, mist, a deer fence running through it";
export const AXIS = "a Eurasian lynx, a big wild cat with long legs, big furry paws, a short stubby black-tipped tail, spotted tawny-grey fur, a facial ruff and long black tufts on its ears";
const TAIL = " One ordinary frame pulled from a normal handheld video shot at eye level with a consumer camera, simply recording what happens, casual slightly imperfect framing with something cut by the edge of the frame. Almost everything is in focus, nothing blurred out: the background stays readable with ordinary everyday objects. Only the light the place really has, correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real materials with wear, water and use. People, if any, are caught mid-action, unposed. No real brand names or logos.";
export const BI = (scene) => scene + TAIL;
export const HZP = (scene, where = ROAD) => `${WHO}, in ${where}. ${scene} His face is the face of the reference image: same face, same age, same grey beard, not younger. He wears the same olive bucket hat and faded red plaid flannel shirt over a grey t-shirt.` + TAIL;
