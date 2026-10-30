// scr29 · LÍNEA DE TIEMPO del garage (segundos de la LOCUCIÓN, anclados a frases del ASR de Groq por tandaB_mkplan + piezas.py).
// KEYS = la única cámara (sin cortes): los tramos de plan.json (cam) → un encuadre con nombre y un empuje lento.
// ST(t) = el estado del garage: la estufa armándose (no_<pieza> = todavía no está), el fuego y su color, el corte en rayos X,
// el goteo, la chimenea, el serpentín y el balde, el estante de botas, el ventilador solar, el termómetro y el reloj.
import PLAN from "./plan.json";

export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

// encuadres con nombre (la estufa en x 0,6 · z -1,3 sobre ladrillos; termómetro en la pared del fondo a la derecha; ventana a la izquierda)
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  wide: { p: [0.2, 1.9, 4.6], l: [0.2, 1.0, -1.4], fov: 50 },
  stove: { p: [0.6, 1.1, 0.6], l: [0.6, 0.55, -1.3], fov: 42 },
  stoveLow: { p: [1.5, 0.55, 0.3], l: [0.6, 0.45, -1.3], fov: 42 },
  stoveL: { p: [-0.5, 1.0, 0.2], l: [0.6, 0.5, -1.3], fov: 42 },
  door: { p: [0.65, 0.45, -0.35], l: [0.6, 0.3, -1.3], fov: 38 },
  top: { p: [1.3, 1.6, -0.5], l: [0.6, 0.8, -1.3], fov: 40 },
  cut: { p: [0.9, 0.8, 0.2], l: [0.6, 0.45, -1.3], fov: 36 },
  chimney: { p: [2.2, 2.2, 0.4], l: [0.6, 2.2, -1.3], fov: 48 },
  coil: { p: [1.5, 1.4, -0.4], l: [0.6, 1.15, -1.3], fov: 40 },
  bucket: { p: [2.3, 0.9, 0.4], l: [1.4, 0.3, -1.0], fov: 42 },
  rack: { p: [-0.6, 0.9, -0.2], l: [0.3, 0.6, -1.3], fov: 42 },
  bench: { p: [-2.4, 1.6, -0.6], l: [-3.1, 0.95, -2.6], fov: 46 },
  window: { p: [-1.2, 1.6, -1.0], l: [-1.7, 1.7, -3], fov: 44 },
  thermo: { p: [2.2, 1.6, -1.2], l: [2.4, 1.6, -3], fov: 44 },
  clock: { p: [-0.5, 2.2, -1.4], l: [-0.6, 2.4, -3], fov: 40 },
  floor: { p: [1.2, 0.5, -0.2], l: [0.6, 0.05, -1.3], fov: 44 },
  jug: { p: [-0.6, 1.4, -1.0], l: [-0.15, 1.2, -2.9], fov: 42 }, // de costado: el vuelo desde la estufa ya no atraviesa el serpentín
  sidedoor: { p: [2.6, 1.5, 1.6], l: [5.0, 1.0, 0.9], fov: 50 },
  panel: { p: [1.8, 2.6, 0.6], l: [3.1, 3.3, -2.1], fov: 48 },
  ctrl: { p: [3.9, 1.2, -0.6], l: [4.88, 1.0, -1.2], fov: 40 },
  fan: { p: [0.4, 0.6, 0.0], l: [0.0, 0.15, -1.0], fov: 42 },
  duo: { p: [0.3, 1.25, 1.55], l: [0.3, 0.45, -1.2], fov: 46 },
};
const k = (t: number, n: string, dz = 0, arc?: number): Key => {
  const f = F[n] ?? F.wide;
  const p = f.p.map((v, i) => v + (f.l[i] - v) * dz);
  return { t, p, l: f.l, fov: f.fov - dz * 6, arc };
};
type Plan = { cam: [number, number, string][]; end: number };
const CAM = (PLAN as unknown as Plan).cam;
// el «wide» genérico rota entre planos limpios de la estufa para no repetir
const ALT = ["duo", "stoveL", "stoveLow"];
let altI = 0;
for (const c of CAM) if (c[2] === "wide") c[2] = ALT[altI++ % ALT.length];
function buildKeys(): Key[] {
  let lastName = CAM[0]?.[2] ?? "duo";
  const out: Key[] = [k(0, lastName)];
  for (const [a, b, n] of CAM) {
    const prev = out[out.length - 1].t;
    if (n === lastName) { out.push(k(Math.max(prev + 0.3, b), n, 0.12)); continue; }
    const arr = Math.max(prev + 0.35, Math.min(a + 1.1, b - 0.2));
    out.push(k(Math.max(prev + 0.05, a), lastName, 0.12));
    out.push(k(arr, n, 0, 0.04));
    out.push(k(Math.max(arr + 0.3, b), n, 0.12));
    lastName = n;
  }
  out.push(k(99999, lastName, 0.12));
  return out.sort((x, y) => x.t - y.t);
}
export const KEYS: Key[] = buildKeys();

const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
export const up = (t: number, a: number, b: number) => sm((t - a) / (b - a));
export const win = (t: number, a: number, b: number, r = 0.4) => up(t, a - r, a) * (1 - up(t, b, b + r));
const wins = (t: number, ab: [number, number][], r = 0.5) => Math.max(0, ...ab.map(([a, b]) => win(t, a, b, r)));

export type Estado = {
  fire: number; blue: number; smokeBlack: number; smoke: number; cut: number; radiate: number; air: number;
  temp: number; frost: number; dawn: number; clock: number; lamp: number; warm: number;
  stove: number; top: number; plate: number; plateHot: number; kettle: number; tube: number; bowl: number; door: number; doorOpen: number;
  pipe: number; damper: number; damperAng: number; jug: number; oil: number; drip: number; dripRate: number;
  coil: number; bucket: number; flow: number; waterHot: number; rack: number; boots: number; doorAir: number;
  fan: number; fanOn: number; batt: number; knob: number; shutter: number; sawdust: number; wick: number; hole: number; lid: number; lidOpen: number; gasket: number;
  panel: number; tilt: number; sun: number; ctrl: number; charge: number; cable: number;
};

// ===== tiempos: TODO sale de plan.json → st = ventanas [a,b] por estado; «no_<pieza>» = ventanas donde esa pieza TODAVÍA no está
// (al final de la ventana la pieza entra con su rampa); los «on» (fire, cut, blue…) valen 1 dentro de sus ventanas.
type PlanSt = { st: Record<string, [number, number][]>; clock?: [number, number][] };
const PS = PLAN as unknown as PlanSt;
export const ST = (t: number): Estado => {
  const W = (key: string, r = 0.5) => (PS.st[key] ? wins(t, PS.st[key], r) : 0);
  const has = (x: string, r = 0.8) => 1 - W("no_" + x, r);           // pieza armada salvo en sus ventanas «no_»
  const fire = W("fire", 1.2), dawn = 0.6 * W("dawn", 1.5), heat = W("heat", 3);
  let clock = 5.5; for (const [a, v] of PS.clock ?? []) if (t >= a) clock = v + Math.min(0.25, (t - a) / 240);
  return {
    fire, blue: W("blue", 1.0), smokeBlack: W("smokeBlack", 0.8), smoke: fire * (0.35 + 0.5 * W("smokeBlack", 0.8)) * has("pipe"),
    cut: W("cut", 0.7), radiate: W("radiate", 0.8), air: W("air", 0.6) * Math.max(0.4, fire),
    temp: 34 + 34 * heat, frost: 0.75 - 0.6 * Math.max(heat, dawn), dawn, clock,
    lamp: 0.35 + 0.65 * up(t, 2.0, 3.0), warm: 0.25 * heat + 0.1 * fire,
    stove: has("stove", 1.0), top: has("top"), plate: has("plate"), plateHot: W("plateHot", 0.8), kettle: has("kettle"),
    tube: has("tube"), bowl: has("bowl"), door: has("door", 0.6), doorOpen: W("doorOpen", 0.5),
    pipe: has("pipe", 1.2), damper: has("damper"), damperAng: W("damperShut", 0.6),
    jug: has("jug"), oil: 0.4 + 0.6 * has("oil", 1.5), drip: W("drip", 0.6), dripRate: 0.6 + 2.4 * W("dripFast", 0.6),
    coil: has("coil", 1.2), bucket: has("bucket"), flow: W("flow", 0.8), waterHot: up(t, (PS.st.flow?.[0]?.[0] ?? 9e9), (PS.st.flow?.[0]?.[0] ?? 9e9) + 40) * has("bucket"),
    rack: has("rack"), boots: has("boots"), doorAir: W("doorAir", 0.8),
    fan: has("fan"), fanOn: W("fanOn", 0.6), batt: has("batt"), knob: W("knob", 0.6), shutter: W("shutter", 0.6),
    sawdust: has("sawdust", 1.2), wick: W("wick", 1.0), hole: has("hole"), lid: has("lid"), lidOpen: W("lidOpen", 0.5), gasket: has("gasket"),
    panel: has("panel", 1.0), tilt: W("tilt", 0.8), sun: W("sun", 1.0), ctrl: has("ctrl"), charge: W("charge", 0.6), cable: has("cable", 1.0),
  };
};
