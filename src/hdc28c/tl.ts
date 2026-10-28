// hdc28c · LÍNEA DE TIEMPO del mundo (segundos de la LOCUCIÓN, anclados a frases del ASR de Groq por plan.py).
// KEYS = la única cámara (sin cortes): los tramos de plan.json (cam) → un encuadre con nombre y un empuje lento.
// ST(t) = el estado del patio: los limones (4 → 60), las flores y los limoncitos, la hoja amarilla con vena verde, la maceta en corte, la mezcla del mes y la poda.
import PLAN from "./plan.json";

export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

// encuadres con nombre (la maceta de 40 L en corte en x 0 z -0,3 con la tierra a 0,46 y la copa centrada en y 1,32; la maceta chica en x -1,1;
// la mesa de la mezcla en x 1,5 z -0,35; el calendario en la pared x -0,9; el libro en la mesita x -1,72 z 0,6)
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  wide: { p: [0.3, 1.5, 3.4], l: [0.3, 0.9, -0.5], fov: 50 },
  pot: { p: [0.0, 1.0, 2.2], l: [0.0, 0.85, -0.3], fov: 46 },
  canopy: { p: [0.2, 1.35, 1.3], l: [0.0, 1.3, -0.3], fov: 42 },
  leaf: { p: [0.25, 1.5, 0.45], l: [0.12, 1.45, -0.05], fov: 34 },
  flowers: { p: [-0.15, 1.3, 0.62], l: [-0.08, 1.25, -0.05], fov: 34 },
  lemons: { p: [0.35, 0.82, 0.95], l: [0.2, 0.74, -0.2], fov: 38 },
  cut: { p: [0.0, 0.33, 0.6], l: [0.0, 0.28, -0.3], fov: 40 },
  cutC: { p: [0.1, 0.3, 0.15], l: [0.1, 0.27, -0.3], fov: 36 },
  rim: { p: [0.0, 0.98, 0.3], l: [0.0, 0.47, -0.36], fov: 40 },
  bottom: { p: [0.45, 0.24, 0.75], l: [0.05, 0.05, -0.3], fov: 40 },
  trunk: { p: [0.1, 0.62, 0.32], l: [0.0, 0.56, -0.3], fov: 34 },
  small: { p: [-0.9, 0.62, 1.0], l: [-1.1, 0.35, -0.2], fov: 42 },
  table: { p: [1.55, 1.3, 0.6], l: [1.55, 0.8, -0.35], fov: 42 },
  tableL: { p: [1.2, 1.08, 0.18], l: [1.2, 0.8, -0.35], fov: 34 },
  tableR: { p: [1.88, 1.08, 0.18], l: [1.88, 0.8, -0.35], fov: 34 },
  sun: { p: [-1.6, 0.6, 2.6], l: [0.3, 1.4, -1.2], fov: 52 },
  book: { p: [-1.65, 1.32, 1.05], l: [-1.72, 0.78, 0.6], fov: 38 },
  cal: { p: [-0.9, 1.55, -1.5], l: [-0.9, 1.55, -2.55], fov: 40 },
};
const k = (t: number, n: string, dz = 0, arc?: number): Key => {
  const f = F[n] ?? F.wide;
  const p = f.p.map((v, i) => v + (f.l[i] - v) * dz);
  return { t, p, l: f.l, fov: f.fov - dz * 6, arc };
};
type Plan = { cam: [number, number, string][]; end: number };
const CAM = (PLAN as unknown as Plan).cam;

function buildKeys(): Key[] {
  let lastName = CAM[0]?.[2] ?? "wide";
  const out: Key[] = [k(0, lastName)];
  for (const [a, b, n] of CAM) {
    const prev = out[out.length - 1].t;
    if (n === lastName) { out.push(k(Math.max(prev + 0.3, b), n, 0.12)); continue; }
    // viaje largo (>1,6 m) = CORTE SECO: a mitad del vuelo la cámara mira el piso o una pared vacía (hdc28c 1762/2002)
    const fa = F[lastName] ?? F.wide, fb = F[n] ?? F.wide;
    if (Math.hypot(fa.p[0] - fb.p[0], fa.p[1] - fb.p[1], fa.p[2] - fb.p[2]) > 1.6) {
      const c = Math.max(prev + 0.05, a);
      out.push(k(c, lastName, 0.12)); out.push(k(c + 0.001, n, 0)); out.push(k(Math.max(c + 0.3, b), n, 0.12));
      lastName = n; continue;
    }
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
// "desde": sube al empezar la 1ª ventana y queda (estados que no vuelven atrás: el testigo pegado, la pared arreglada)
const from = (t: number, ab: [number, number][] | undefined, r = 0.6) => (ab && ab.length ? up(t, ab[0][0] - r, ab[0][0]) : 0);

type PlanSt = { st: Record<string, [number, number][]> };
const PS = PLAN as unknown as PlanSt;
// avance (0-1) dentro de la ventana que contiene t (la jeringa que se vacía, el taladro que entra)
const prog = (t: number, ab: [number, number][] | undefined, lead = 0.5) => {
  if (!ab) return 0;
  for (const [a, b] of ab) if (t >= a && t <= b + 0.5) return cl((t - a - lead) / Math.max(1, b - a - lead - 0.8));
  return 0;
};
export const ST = (t: number) => {
  const W = (key: string, r = 0.5) => (PS.st[key] ? wins(t, PS.st[key], r) : 0);
  const P = (key: string, lead = 0.5) => prog(t, PS.st[key], lead);
  return {
    // el árbol y la luz
    few: W("few", 0.9), load: W("load", 1.2), topLemons: W("topLemons", 0.8), lemonHi: W("lemonHi", 0.5), lush: 0.5,
    low: W("low", 0.9), bend: Math.max(W("bend", 1.2), W("load", 1.2)), bendHi: W("bendHi", 0.5), bendFlower: W("bendFlower", 0.8), tie: W("tie", 0.6), lowHi: W("lowHi", 0.5),
    sunHi: W("sunHi", 0.8), sunLeaf: W("sunLeaf", 0.6), shade: 0, shadeNet: W("shadeNet", 0.8), heat: W("heat", 0.9), frost: W("frost", 0.9),
    closed: W("closed", 1.0), closedHi: W("closedHi", 0.5), openUp: W("openUp", 0.6), cross: W("cross", 0.5), chupon: W("chupon", 0.8), chuponHi: W("chuponHi", 0.5),
    snip: W("snip", 0.4), third: W("third", 0.5), graftHi: W("graftHi", 0.5), sucker: W("sucker", 0.6), suckerCut: W("suckerCut", 0.3),
    chlor: W("chlor", 0.9), regreen: P("regreen", 0.6) * W("regreen", 0.6), nitroLow: W("nitroLow", 0.8), leafHi: W("leafHi", 0.5),
    flower: W("flower", 1.0), flowerHi: W("flowerHi", 0.5), drop: W("drop", 0.6), dropK: P("drop", 0.6), set: W("set", 0.9), setDrop: W("setDrop", 0.6),
    thinout: W("thinout", 0.5), thinK: P("thinout", 0.8), thinoutHi: W("thinoutHi", 0.5), brush: W("brush", 0.5),
    // la maceta, la tierra y las raíces
    cutLight: W("cutLight", 0.6), sizeHi: W("sizeHi", 0.6), wheels: W("wheels", 0.6), turn: W("turn", 0.4), turnK: P("turn", 0.6), saucer: W("saucer", 0.6),
    bricksHi: W("bricksHi", 0.5), holes: W("holes", 0.5), gravelHi: W("gravelHi", 0.5), puddle: W("puddle", 0.9), rot: W("rot", 0.9), rootHi: W("rootHi", 0.5),
    shallowRoots: W("shallowRoots", 0.3), circle: W("circle", 0.8), circleHi: W("circleHi", 0.5), cutIron: W("cutIron", 0.6), small: W("small", 0.6),
    wet: W("wet", 0.9), dry: W("dry", 0.9), drain: W("drain", 0.6), pour: W("pour", 0.6), pourIron: W("pourIron", 0.3), sip: W("sip", 0.5), finger: W("finger", 0.5),
    ring: W("ring", 0.8), ringHi: W("ringHi", 0.5), trunkFeed: W("trunkFeed", 0.6), feed: W("feed", 0.6), fork: W("fork", 0.5),
    mulch: W("mulch", 1.0), mulchRing: W("mulchRing", 0.5), bottle: W("bottle", 0.6), bottleHi: W("bottleHi", 0.5), bottleK: P("bottle", 1.0), stain: W("stain", 0.6),
    // la mesa de la mezcla (las cosas quedan siempre; se iluminan cuando se nombran)
    banana: 1, peelDry: W("peelDry", 1.2), bananaJar: 1, spoonHi: W("spoonHi", 0.5), ash: 1, ashHi: W("ashHi", 0.5), ashNo: W("ashNo", 0.5), coffee: 1, egg: 1, eggHi: W("eggHi", 0.8),
    compost: 1, mix111: W("mix", 0.8), sulfate: 1, sulfateHi: W("sulfateHi", 0.5), chelate: 1, bag: 1, bagHalf: W("bagHalf", 0.5), grass: W("grass", 0.6), seedTree: W("seedTree", 0.6),
    calendar: W("calendar", 0.8),
    book: W("book", 0.9), open: W("open", 0.7), hi: [W("hi0", 0.4), W("hi1", 0.4)],
  };
};
