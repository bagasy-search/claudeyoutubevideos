// Helpers del DIRECTOR de rhgrout (regla 8-oct): fotos SIN cara = agnes-image gratis (prompt = SÓLO lo que se ve, sin vocabulario
// de imagen) · fotos CON la cara de Rhonda = gpt-image /edits low Batch (RHP, fórmula ultra-real) · clips agnes v2.0 para todo plano
// con `anim` (acción simplísima) · kf = agnes 2.5-flash con su sonido real (spray, cepillo, espuma, chorro).
import { S, RHP } from "../rhonda/lib.mjs";
export const KIT = "a small 1990s kitchen with oak cabinets, a white stove, a white fridge and beige square ceramic floor tiles with dirty gray grout lines, daylight from a window over the sink";
export const FLOOR = "beige square ceramic floor tiles with dark gray dirty grout lines";
export const SHOWER = "a small bathroom shower with white square wall tiles and a white tub";
const STILL = "the light shifts slowly; nothing else moves";
export const B = (p, at, name, scene, anim = STILL, o = {}) => S(p, at, "bi", name, { p: scene, anim, ...o });
export const BS = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: scene, ...o });          // foto quieta (o cama de componente con skip)
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: scene, ...o });    // stock real (Pexels) con su foto de respaldo
export const K = (p, at, name, scene, d1, d2, sound, o = {}) => S(p, at, "kf", name, { p: scene, d1, d2, sound, ...o });
export const R = (p, at, name, scene, anim, o = {}) => S(p, at, "rh", name, { p: RHP(scene), ...(anim ? { anim } : {}), ...o });
export const A = (p, at = "", o = {}) => S(p, at, "av", "", o);
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const I = (n) => `img/rhgrout/${n}.jpg`;
