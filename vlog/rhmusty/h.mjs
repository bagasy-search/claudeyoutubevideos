// Helpers del DIRECTOR de rhmusty (mismas reglas que rhgrout): fotos SIN cara = agnes-image gratis (prompt = sólo lo que se ve) ·
// CON la cara de Rhonda = gpt-image /edits low Batch (RHP) · clips agnes para todo plano con `anim` · kf = agnes 2.5-flash con su sonido.
import { S, RHP } from "../rhonda/lib.mjs";
export const KIT = "a tidy 1990s kitchen in an Ohio house with oak cabinets, a white refrigerator, a white stove, beige vinyl floor and a small rug in front of the sink, daylight from a window over the sink";
export const HOUSE = "a tidy, clean older Ohio house with beige carpet, a sofa, framed photos and daylight from the windows";
export const SINKCAB = "the open cabinet under a kitchen sink, with the white curved drain pipe and two supply lines, a particle board floor";
const STILL = "the light shifts slowly; nothing else moves";
export const B = (p, at, name, scene, anim = STILL, o = {}) => S(p, at, "bi", name, { p: scene, anim, ...o });
export const BS = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: scene, ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: scene, ...o });
export const K = (p, at, name, scene, d1, d2, sound, o = {}) => S(p, at, "kf", name, { p: scene, d1, d2, sound, ...o });
export const R = (p, at, name, scene, anim, o = {}) => S(p, at, "rh", name, { p: RHP(scene), ...(anim ? { anim } : {}), ...o });
export const A = (p, at = "", o = {}) => S(p, at, "av", "", o);
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const I = (n) => `img/rhmusty/${n}.jpg`;
