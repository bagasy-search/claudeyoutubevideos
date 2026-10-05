// DIRECTOR de lorham — helpers. Cada toma: S(p, frase, kind, name, opts)
//   p = índice de párrafo (_v3/lorham_paras.json) · frase = palabras donde CORTA (dentro del párrafo; "" = inicio)
//   kind: av (avatar InfiniteTalk) · vl (clip agnes 2.5 hablado) · kf (detalle agnes 2.5 con foley)
//         lor (foto gpt con Loretta, /edits) · bi (foto gpt b-roll sin Loretta) · ei (snapshot de época) · c (componente Lor*)
//   opts: { p: prompt, props, ov: overlay sobre la toma, anim: movimiento agnes v2 para bi/ei }
import { WHO, KIT } from "./lib.mjs";
export const S = (p, at, kind, name, o = {}) => ({ ...o, prompt: o.p, p, at, kind, name });
const TAIL = " One ordinary frame from a normal home video shot at eye level with a consumer camera, casual slightly imperfect framing, something cut by the edge of the frame. Almost everything in focus, nothing blurred out: the background stays readable with ordinary everyday objects. Only the light the place really has, correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real materials with wear and use. No text, no letters, no labels, no logos.";
export const BI = (scene) => scene + TAIL;
export const LORP = (scene) => `${WHO}, in ${KIT}. ${scene} Her face is the face of the reference image: same face, same age, same glasses, not younger, not prettier.` + TAIL;
export const EI = (year, scene) => `A faded color snapshot photograph taken around ${year} in small-town rural Iowa with an ordinary family snapshot camera: ${scene} Faded warm colors of old print film, slightly soft print, casual family snapshot of ordinary Midwestern people caught mid-action, nobody posing for a professional, someone cut by the edge of the frame, the room around them readable, nothing blurred out. No text, no letters, no signs, no logos.`;
// escenarios recurrentes (descritos IGUAL siempre, glosario del video)
export const BSMT = "a church basement fellowship hall with long folding tables covered in red checked paper tablecloths, gray metal folding chairs, a kitchen pass-through window with a roll-up shutter, a big steel coffee urn, painted cinder-block walls and humming fluorescent ceiling lights";
export const HAM = "a whole spiral-sliced bone-in ham with a glossy amber brown-sugar glaze, the thin slices fanning open around the bone";
export const HAMPAN = "a big dented aluminum roasting pan holding a spiral ham cut side down, the surface glistening with glaze";
export const KIDS = "Loretta's grandson stays almost out of frame, only his sleeve or the edge of the camera shows";
