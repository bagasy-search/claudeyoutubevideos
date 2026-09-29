// DIRECTOR de olpots — helpers. Cada toma: S(p, frase, kind, name, opts)
//   p = índice de párrafo (_v3/olpots_paras.json) · frase = palabras donde CORTA (dentro del párrafo; "" = inicio)
//   kind: av (avatar InfiniteTalk) · vl (clip agnes 2.5 hablado) · kf (detalle agnes 2.5 con foley)
//         st (stock REAL de Pexels: name = "st<idx del pool aprobado>") · ar (foto de ARCHIVO real, dominio público)
//         ole (foto gpt con Ole, /edits) · bi (foto gpt b-roll sin Ole) · c (componente Ole*)
//   opts: { p: prompt, props, ov: overlay sobre la toma {c, props}, anim: movimiento agnes v2 para bi }
import { WHO, KIT } from "./lib.mjs";
export const S = (p, at, kind, name, o = {}) => ({ ...o, prompt: o.p, p, at, kind, name });
const TAIL = " One ordinary frame from a normal home video shot at eye level with a consumer camera, casual slightly imperfect framing, something cut by the edge of the frame. Almost everything in focus, nothing blurred out: the background stays readable with ordinary everyday objects. Only the light the place really has, bright and correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real materials with wear and use. No text, no letters, no labels, no logos.";
export const BI = (scene) => scene + TAIL;
export const CAMP = (scene) => `Inside ${KIT}. ${scene}` + TAIL;
export const OLEP = (scene) => `${WHO}, in ${KIT}. ${scene} His face is the face of the reference image: same face, same age, same white beard, not younger.` + TAIL;
// snapshot de época HECHO con IA (ilustrativo, nunca presentado como foto real de alguien): 1960s, color desvaído
export const SNAP = (scene) => `A faded color snapshot photograph taken around 1963 at a logging camp in the snowy north woods of Minnesota with an ordinary family snapshot camera: ${scene} Faded warm colors of old print film, slightly soft print, casual snapshot of ordinary working men caught mid-action, nobody posing, someone cut by the edge of the frame, nothing blurred out. No text, no letters, no signs, no logos.`;
