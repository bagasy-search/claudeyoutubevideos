// Helpers del DIRECTOR de rhmattress (mismas reglas que rhgrout): fotos SIN cara = agnes-image gratis (prompt = sÃ³lo lo que se ve) Â·
// CON la cara de Rhonda = gpt-image /edits low Batch (RHP) Â· clips agnes para todo plano con `anim` Â· kf = agnes 2.5-flash con su sonido.
import { S, RHP } from "../rhonda/lib.mjs";
export const ROOM = "a modest bedroom in an older Ohio house with a wooden bed frame, a nightstand with a lamp, beige carpet, a window with plain white curtains and soft daylight";
export const MATT = "a bare white quilted mattress with no sheets on a wooden bed frame";
export const STAIN = "a bare white quilted mattress with large pale yellow sweat stains near the top where the pillows go";
export const KIT = "a tidy 1990s kitchen in an Ohio house with oak cabinets, a white refrigerator, a white stove and beige vinyl floor, daylight from a window over the sink";
const STILL = "the light shifts slowly; nothing else moves";
export const B = (p, at, name, scene, anim = STILL, o = {}) => S(p, at, "bi", name, { p: scene, anim, ...o });
export const BS = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: scene, ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: scene, ...o });
export const K = (p, at, name, scene, d1, d2, sound, o = {}) => S(p, at, "kf", name, { p: scene, d1, d2, sound, ...o });
export const R = (p, at, name, scene, anim, o = {}) => S(p, at, "rh", name, { p: RHP(scene), ...(anim ? { anim } : {}), ...o });
export const A = (p, at = "", o = {}) => S(p, at, "av", "", o);
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const I = (n) => `img/rhmattress/${n}.jpg`;
