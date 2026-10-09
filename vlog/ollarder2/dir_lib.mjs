// DIRECTOR — helpers. Cada toma: S(p, frase, kind, name, opts)
//   p = índice de párrafo (_v3/<slug>_paras.json) · frase = palabras donde CORTA (dentro del párrafo; "" = inicio)
//   kind: av (avatar InfiniteTalk) · vl (clip agnes 2.5 hablado, SÓLO minuto 1) · st (stock REAL Pexels: opts.q = consulta
//         del pool; el resolvedor elige el mejor aprobado sin repetir) · ar (foto de ARCHIVO real PD: name = tag del pool)
//         ole (foto gpt-image con la cara de Ole, /edits) · bi (foto agnes-image SIN cara, gratis) · c (componente)
//   opts: { p: prompt, props, ov: overlay {c, props}, anim: movimiento agnes v2.0 (2 s a 0,5x) para bi/ole }
// ⛔ "frase": sin palabras con guion (el anclaje las pega: "thirtyfour"), y que exista tal cual en el párrafo.
import { WHO, KIT } from "./lib.mjs";
export const S = (p, at, kind, name, o = {}) => ({ ...o, prompt: o.p, p, at, kind, name });
// gpt-image (con cara): fórmula de fotograma accidental
const TAIL = " One ordinary frame pulled from a normal home video shot by his grandson at eye level with a consumer camera, casual slightly imperfect framing, something cut by the edge of the frame. Almost everything in focus, nothing blurred out: the background stays readable with ordinary everyday objects. Only the light the place really has, bright and correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real skin with pores and age spots, flannel and canvas with creases and soot marks. No text, no letters, no labels, no logos.";
export const OLEP = (scene) => `${WHO}, in ${KIT}. ${scene} His face is the face of the reference image: same face, same age, same white beard, not younger.` + TAIL;
export const OLEX = (place, scene) => `${WHO}, ${place}. ${scene} His face is the face of the reference image: same face, same age, same white beard, not younger.` + TAIL;
// agnes-image (sin cara): SÓLO lo que se ve, hechos concretos, cero vocabulario de imagen
export const AG = (scene) => scene + " Ordinary worn things, real wear and use, daylight or the light the place really has, nobody posing. No text, no letters, no labels, no logos.";
export const CAMP = (scene) => AG(`Inside the log cabin cook shack of an old north-woods logging camp in winter (weathered log walls, a black cast iron wood cookstove, a snowy window, plank tables). ${scene}`);
export const HANDS = "an old man's weathered hands with age spots, his dark green and black plaid flannel sleeves rolled to the forearm";
// snapshot de época HECHO con IA (ilustrativo, nunca presentado como foto real de alguien)
export const SNAP = (scene) => AG(`A faded color snapshot from around 1965 at a logging camp in the snowy north woods of Minnesota, taken with an ordinary family snapshot camera: ${scene} Faded warm colors of old print film, ordinary working men caught mid-action, someone cut by the edge of the frame.`);
