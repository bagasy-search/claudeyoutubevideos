// DIRECTOR de hankwolf — helpers. Cada toma: S(p, frase, kind, name, opts)
//   kind: av (avatar InfiniteTalk) · vl (clip agnes 2.5 hablado, minuto 1) · bi (foto gpt sin Earl → clip agnes v2.0)
//         hz (foto gpt CON Earl, /edits con su cara; Ken-Burns) · st (stock Pexels "st_<base>.<n>") · c (componente El*)
export const S = (p, at, kind, name, o = {}) => ({ ...o, prompt: o.p, p, at, kind, name });

export const WHO = "Hank, a 62-year-old white man from Louisiana with a short grey beard and stubble, a worn olive green bucket hat, a faded red plaid flannel shirt open over a grey t-shirt, reading glasses hanging on a cord around his neck, weathered sunburned skin with deep lines";
export const ROAD = "a gravel ranch road in Grand County, Colorado, early on a cold autumn morning: frost on grey-green sagebrush, a barbed wire fence on wooden posts, black cattle grazing in a big pasture below, snowy Rocky Mountain peaks behind";
export const RANCH = "a working cattle ranch in Grand County, Colorado: a weathered wooden barn and corrals, a dusty pickup truck, hay bales, black Angus cattle, sagebrush hills and snowy mountains behind";
export const FARM = "a sheep ranch in the mountains of western Colorado: a band of white sheep on a sagebrush hillside, a sheepherder's camp trailer, a big white guard dog";
export const COAST = "a small Colorado mountain town (Kremmling): a wide main street with old brick and wood storefronts, pickup trucks parked diagonally, a diner with a neon sign, mountains behind";
export const FOREST = "a Colorado mountain forest in snow: lodgepole pines and aspens, a frozen creek, deep snow, grey winter light";
export const AXIS = "wild gray wolves, big wolves with thick grey, tan and black fur, long legs and bushy tails";
const TAIL = " One ordinary frame pulled from a normal handheld video shot at eye level with a consumer camera, simply recording what happens, casual slightly imperfect framing with something cut by the edge of the frame. Almost everything is in focus, nothing blurred out: the background stays readable with ordinary everyday objects. Only the light the place really has, correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real materials with wear, water and use. People, if any, are caught mid-action, unposed. No real brand names or logos.";
export const BI = (scene) => scene + TAIL;
export const HZP = (scene, where = ROAD) => `${WHO}, in ${where}. ${scene} His face is the face of the reference image: same face, same age, same grey beard, not younger. He wears the same olive bucket hat and faded red plaid flannel shirt over a grey t-shirt.` + TAIL;
