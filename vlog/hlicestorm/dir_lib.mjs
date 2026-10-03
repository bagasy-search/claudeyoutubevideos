// DIRECTOR de hlicestorm — helpers. Cada toma: S(p, frase, kind, name, opts)
//   kind: av (avatar InfiniteTalk) · vl (clip agnes 2.5 hablado, minuto 1) · bi (foto gpt sin Earl → clip agnes v2.0)
//         hz (foto gpt CON Earl, /edits con su cara; Ken-Burns) · st (stock Pexels "st_<base>.<n>") · c (componente El*)
export const S = (p, at, kind, name, o = {}) => ({ ...o, prompt: o.p, p, at, kind, name });

export const WHO = "Harlan, a 66-year-old white retired utility lineman with a grey mustache and short grey hair, a weathered scuffed white hard hat pushed back on his head, a brown canvas work jacket over a grey hooded sweatshirt, deep lines on his face";
export const GARAGE = "his cluttered home garage workshop on a winter evening: a frosted window with ice on the glass, a lineman's leather climbing belt on a pegboard, coils of wire, a battery lantern, plastic storage totes on shelves";
export const HOUSE = "an ordinary older two-story house in a small Kentucky town during a winter ice storm: bare trees glazed with ice, power lines coated in ice, a front porch, a driveway";
export const KITCH = "an ordinary small American kitchen in winter: a white refrigerator, a gas stove, a window with frost on it, a wooden table";
export const STORM = "a rural road during an ice storm at night: trees bent and glazed with ice, power poles with sagging iced lines, a utility bucket truck with amber flashing lights";
const TAIL = " One ordinary frame pulled from a normal handheld video shot at eye level with a consumer camera, simply recording what happens, casual slightly imperfect framing with something cut by the edge of the frame. Almost everything is in focus, nothing blurred out: the background stays readable with ordinary everyday objects. Only the light the place really has, correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real materials with wear, water and use. People, if any, are caught mid-action, unposed. No real brand names or logos.";
export const BI = (scene) => scene + TAIL;
export const HZP = (scene, where = GARAGE) => `${WHO}, in ${where}. ${scene} His face is the face of the reference image: same face, same age, same grey mustache, not younger. He wears the same scuffed white hard hat and brown canvas work jacket over a grey hoodie.` + TAIL;
