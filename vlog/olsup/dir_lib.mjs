// DIRECTOR de olsup — helpers. Cada toma: S(p, frase, kind, name, opts)
//   p = índice de párrafo (_v3/olsup_paras.json) · frase = palabras donde CORTA (dentro del párrafo; "" = inicio)
//   kind: av (avatar InfiniteTalk) · vl (clip agnes 2.5 hablado) · kf (detalle agnes 2.5 con foley)
//         ole (foto gpt con Ole, /edits) · bi (foto gpt b-roll sin Ole) · st (STOCK real Pexels) · ar (foto de ARCHIVO real, dominio público)
//         c (componente Ole*)
//   opts: { p: prompt, q: query stock, props, ov: overlay sobre la toma, anim: movimiento agnes v2 para bi }
import { WHO, KIT } from "./lib.mjs";
export const S = (p, at, kind, name, o = {}) => ({ ...o, prompt: o.p, p, at, kind, name });
const TAIL = " One ordinary frame from a normal handheld video shot at eye level with a phone, casual slightly imperfect framing, something cut by the edge of the frame. Almost everything in focus, nothing blurred out: the background stays readable with ordinary everyday objects. Only the light the place really has, correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real materials with wear and use. No text, no letters, no labels, no logos.";
export const BI = (scene) => scene + TAIL;
export const OLEP = (scene) => `${WHO}, in ${KIT}. ${scene} His face is the face of the reference image: same face, same age, same white beard, not younger, not prettier.` + TAIL;
export const ST = (q, o = {}) => ({ q, ...o });
