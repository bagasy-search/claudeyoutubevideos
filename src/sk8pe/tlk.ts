// so29 · LÍNEA DE TIEMPO de la COCINA de Sachiko (segundos de la LOCUCIÓN, anclados a frases del ASR por tandaB_mkplan.py).
// KEYS = la única cámara: los tramos de plan.json (cam) → un encuadre con nombre y un empuje lento; viaje largo = corte seco.
// ST(t) = el estado de la cocina: lo que hay en la tabla, la sartén que chisporrotea, el freezer abierto, la panera, el vapor.
import PLAN from "./plan.json";

export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

// medidas (cocina3d): pared del fondo z -2,9 · mesada alto 0,9 (z -2,6) · pileta x -1,4 · hornalla x 0 · tabla x 1,0 · panera x 1,75
// · heladera x 2,75 (freezer arriba, y 1,25-1,8) · estante y 1,6 · mesita (-1,6, 0,5) · noren x -3,4
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  wide: { p: [-0.2, 2.0, 4.4], l: [0.0, 1.0, -1.8], fov: 50 },
  kitchen: { p: [0.4, 1.6, 2.2], l: [0.4, 1.0, -2.4], fov: 46 },
  counter: { p: [0.9, 1.45, -0.6], l: [0.9, 0.95, -2.55], fov: 44 },
  board: { p: [1.0, 1.55, -1.45], l: [1.0, 0.93, -2.5], fov: 40 },
  boardC: { p: [1.0, 1.32, -1.95], l: [1.0, 0.93, -2.52], fov: 34 },
  boardHand: { p: [0.55, 1.15, -1.9], l: [1.0, 0.93, -2.5], fov: 34 },
  stove: { p: [0.05, 1.6, -1.2], l: [0.05, 0.95, -2.6], fov: 42 },
  pan: { p: [0.2, 1.45, -1.75], l: [0.15, 0.95, -2.55], fov: 36 },
  panC: { p: [0.18, 1.25, -2.05], l: [0.15, 0.95, -2.55], fov: 30 },
  sink: { p: [-1.4, 1.5, -1.2], l: [-1.4, 1.0, -2.6], fov: 42 },
  window: { p: [-1.4, 1.6, -1.0], l: [-1.4, 1.55, -2.9], fov: 44 },
  rice: { p: [-1.85, 1.35, -1.75], l: [-2.15, 1.0, -2.65], fov: 36 },
  bread: { p: [1.75, 1.4, -1.6], l: [1.75, 1.0, -2.65], fov: 38 },
  breadOpen: { p: [1.7, 1.55, -1.9], l: [1.75, 0.95, -2.62], fov: 32 },
  shelf: { p: [1.3, 1.65, -1.3], l: [1.3, 1.65, -2.8], fov: 40 },
  fridge: { p: [2.2, 1.5, -0.4], l: [2.75, 1.1, -2.5], fov: 44 },
  freezer: { p: [2.1, 1.55, -0.6], l: [2.75, 1.4, -2.5], fov: 42 },
  freezerIn: { p: [2.6, 1.62, -1.05], l: [2.75, 1.5, -2.55], fov: 30 },
  table: { p: [-0.6, 1.3, 1.9], l: [-1.6, 0.75, 0.5], fov: 42 },
  tableC: { p: [-1.1, 1.05, 1.25], l: [-1.6, 0.76, 0.45], fov: 34 },
  noren: { p: [-2.6, 1.4, -0.6], l: [-3.4, 1.4, -2.85], fov: 44 },
  clock: { p: [-1.4, 2.1, -1.8], l: [-1.4, 2.3, -2.86], fov: 34 },
  calendar: { p: [-2.4, 1.6, -1.8], l: [-2.55, 1.6, -2.86], fov: 34 },
  recap: { p: [0.6, 2.6, 3.4], l: [0.2, 0.9, -1.6], fov: 48 },
  subscribe: { p: [-0.9, 1.5, 3.0], l: [-1.4, 0.9, -0.2], fov: 44 },
};
const k = (t: number, n: string, dz = 0, arc?: number): Key => {
  const f = F[n] ?? F.wide;
  const p = f.p.map((v, i) => v + (f.l[i] - v) * dz);
  return { t, p, l: f.l, fov: f.fov - dz * 6, arc };
};
type Plan = { cam: [number, number, string][]; end: number };
const CAM = (PLAN as unknown as Plan).cam ?? [];

function buildKeys(): Key[] {
  let lastName = CAM[0]?.[2] ?? "wide";
  const out: Key[] = [k(0, lastName)];
  for (const [a, b, n] of CAM) {
    const prev = out[out.length - 1].t;
    if (n === lastName) { out.push(k(Math.max(prev + 0.3, b), n, 0.12)); continue; }
    // viaje largo (>2,2 m) = CORTE SECO: el viaje en línea recta atraviesa la mesada
    const fa = F[lastName] ?? F.wide, fb = F[n] ?? F.wide;
    if (Math.hypot(fa.p[0] - fb.p[0], fa.p[1] - fb.p[1], fa.p[2] - fb.p[2]) > 2.2) {
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
const from = (t: number, ab: [number, number][] | undefined, r = 0.6) => (ab && ab.length ? up(t, ab[0][0] - r, ab[0][0]) : 0);
const frac = (t: number, ab: [number, number][] | undefined) => { for (const [a, b] of ab ?? []) if (t >= a && t <= b + 0.6) return cl((t - a) / Math.max(0.5, b - a)); return 0; };

// lo que puede estar sobre la tabla (uno por vez; el del video va por defecto)
export const ITEMS = ["salmon", "pork", "bread", "ginger", "rice", "meat"] as const;
export type Item = (typeof ITEMS)[number];
export type Estado = {
  eve: number; spot: number[]; spotK: number;
  item: Item; itemK: number; slices: number;
  sizzle: number; panFood: number; steam: number; freezer: number; frost: number; breadBox: number; jar: number;
  kettle: number; clock: number; calendar: number; noren: number; table: number; plates: number;
};

type PlanSt = { st: Record<string, [number, number][]>; tema?: Item };
const PS = PLAN as unknown as PlanSt;
const SPOTS: [string, number[]][] = [["board", [1.0, 0.9, -2.5]], ["sizzle", [0.15, 0.9, -2.55]], ["freezer", [2.75, 1.2, -2.3]], ["breadBox", [1.75, 0.9, -2.65]], ["steam", [-2.15, 0.9, -2.65]], ["jar", [1.35, 0.9, -2.7]], ["table", [-1.6, 0.72, 0.5]]];
export const ST = (t: number): Estado => {
  const st = PS.st ?? {};
  const W = (key: string, r = 0.5) => (st[key] ? wins(t, st[key], r) : 0);
  const D = (key: string, r = 0.6) => from(t, st[key], r);
  // qué hay en la tabla: el ítem cuya ventana está viva; si ninguna, el tema del video
  let item: Item = PS.tema ?? "salmon", itemK = 0;
  for (const it of ITEMS) { const v = W(it, 0.4); if (v > itemK) { itemK = v; item = it; } }
  const e: Omit<Estado, "spot" | "spotK"> = {
    eve: D("eve", 3), item, itemK, slices: frac(t, st.slice) * W("slice", 0.3) + D("sliced", 0.5),
    sizzle: W("sizzle", 0.6), panFood: Math.max(W("sizzle", 0.6), W("panFood", 0.5)), steam: W("steam", 0.8),
    freezer: W("freezer", 0.6), frost: W("frost", 0.8), breadBox: W("breadBox", 0.5), jar: W("jar", 0.6),
    kettle: W("kettle", 0.8), clock: W("clock"), calendar: W("calendar"), noren: W("noren", 0.8), table: W("table"), plates: W("plates", 0.6),
  };
  let best = 0, spot = [1.0, 0.9, -2.5];
  const boardK = Math.max(itemK, W("board"));
  const vals: Record<string, number> = { ...(e as unknown as Record<string, number>), board: boardK };
  for (const [kk, p] of SPOTS) { const v = vals[kk]; if (v > best) { best = v; spot = p; } }
  return { ...e, spot, spotK: best };
};
