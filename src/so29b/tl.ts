// ssl29 · LÍNEA DE TIEMPO del mundo (segundos de la LOCUCIÓN, anclados a frases del ASR de Groq por plan.py).
// KEYS = la única cámara (sin cortes): los tramos de plan.json (cam) → un encuadre con nombre y un empuje lento.
// ST(t) = el estado de la casa de Sachiko: la pila de zabuton, el chabudai, la radio, el timer, el sillón que se va, la ropa, la guía.
import PLAN from "./plan.json";

export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

// encuadres con nombre (pared del fondo z -2,9; shoji x -3/-1,4; chabudai -1,2/-0,9; pila de zabuton -0,15/-0,45; rincón -3,45/-2,45; repisa x 0,1-1,1; dormitorio x 1,2-4)
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  wide: { p: [0.0, 2.3, 6.2], l: [0, 1.0, -1.4], fov: 50 },
  living: { p: [-1.3, 1.5, 2.6], l: [-1.4, 0.7, -1.6], fov: 46 },
  tatami: { p: [-0.6, 0.7, 2.0], l: [-1.8, 0.1, -1.2], fov: 46 },
  cane: { p: [-2.9, 0.9, 1.9], l: [-3.9, 0.55, 0.7], fov: 40 },
  timer: { p: [0.7, 1.25, -1.5], l: [0.7, 1.08, -2.72], fov: 40 },
  timerC: { p: [0.85, 1.12, -2.25], l: [0.85, 1.07, -2.72], fov: 34 },
  shelf: { p: [0.6, 1.3, -1.2], l: [0.6, 1.05, -2.72], fov: 44 },
  radio: { p: [0.3, 1.3, -1.6], l: [0.35, 1.12, -2.72], fov: 36 },
  clock: { p: [-0.35, 1.9, -2.0], l: [-0.35, 2.05, -2.88], fov: 36 },
  window: { p: [-2.2, 1.4, -0.9], l: [-2.2, 1.35, -2.9], fov: 44 },
  table: { p: [-0.6, 1.1, 0.6], l: [-1.2, 0.3, -0.9], fov: 42 },
  tableHand: { p: [-0.75, 0.6, -0.15], l: [-1.05, 0.33, -0.75], fov: 38 },
  fingers: { p: [-0.75, 0.65, -0.45], l: [-0.88, 0.33, -0.7], fov: 30 },
  meal: { p: [-0.9, 0.85, -0.35], l: [-1.25, 0.34, -0.95], fov: 36 },
  cushion: { p: [0.4, 0.9, 0.7], l: [-0.15, 0.15, -0.45], fov: 40 },
  cushion2: { p: [0.3, 0.6, 0.4], l: [-0.15, 0.2, -0.45], fov: 38 },
  cushionM: { p: [0.55, 0.4, 0.15], l: [0.1, 0.18, -0.35], fov: 34 },
  wallsit: { p: [-2.6, 1.0, -1.2], l: [-3.5, 0.4, -2.5], fov: 42 },
  count4: { p: [-0.4, 1.4, 1.2], l: [-0.75, 0.1, -0.4], fov: 42 },
  noseToes: { p: [0.0, 0.7, 0.3], l: [-0.45, 0.3, -0.4], fov: 40 },
  noHands: { p: [-1.0, 1.3, 2.0], l: [-1.9, 0.2, 0.35], fov: 44 },
  recliner: { p: [-1.6, 1.2, 3.0], l: [-2.9, 0.5, 1.2], fov: 44 },
  book: { p: [-0.85, 0.95, -0.25], l: [-0.98, 0.34, -0.78], fov: 40 },
  book2: { p: [-0.6, 0.75, -0.45], l: [-0.98, 0.34, -0.8], fov: 36 },
  bookOpen: { p: [-0.98, 0.95, -0.62], l: [-0.98, 0.33, -0.8], fov: 34 },
  bed: { p: [2.6, 1.4, 1.2], l: [2.7, 0.4, -1.9], fov: 44 },
  laundry: { p: [3.0, 1.5, 1.4], l: [3.1, 1.6, -0.3], fov: 42 },
  recap: { p: [-0.8, 2.6, 3.4], l: [-1.3, 0.3, -1.0], fov: 46 },
  subscribe: { p: [-1.2, 1.6, 3.2], l: [-1.4, 0.6, -1.0], fov: 44 },
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
    // viaje largo (>2,2 m) = CORTE SECO: el viaje en línea recta atravesaba paredes (destellos de al28a 28-oct)
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
// "desde": sube al empezar la 1ª ventana y queda (estados que no vuelven atrás: el testigo pegado, la pared arreglada)
const from = (t: number, ab: [number, number][] | undefined, r = 0.6) => (ab && ab.length ? up(t, ab[0][0] - r, ab[0][0]) : 0);

export type Estado = {
  eve: number; spot: number[]; spotK: number;
  cush: number; cushGlow: number; fold: number; ruler: number; table: number; fingers: number; meal: number; wall: number;
  count: number; nose: number; noHands: number; timer: number; timerRun: number; radio: number; cane: number; caneX: number;
  recl: number; reclGlow: number; bed: number; laundry: number; socks: number; shirts: number;
  book: number; open: number; hi: number[];
};

type PlanSt = { st: Record<string, [number, number][]> };
const PS = PLAN as unknown as PlanSt;
// avance dentro de la ventana activa (0..1): el timer que gira, los 4 tiempos que se encienden de a uno
const frac = (t: number, ab: [number, number][] | undefined) => { for (const [a, b] of ab ?? []) if (t >= a && t <= b + 0.6) return cl((t - a) / Math.max(0.5, b - a)); return 0; };
// dónde apunta el foco cálido: a lo que se está nombrando
const SPOTS: [string, number[]][] = [["table", [-1.2, 0, -0.9]], ["cushGlow", [-0.15, 0, -0.45]], ["wall", [-3.45, 0, -2.45]], ["nose", [-0.45, 0, -0.35]], ["noHands", [-1.9, 0, 0.35]], ["count", [-0.7, 0, -0.2]], ["laundry", [3.0, 0, -0.3]], ["bed", [2.7, 0, -1.9]]];
export const ST = (t: number): Estado => {
  const W = (key: string, r = 0.5) => (PS.st[key] ? wins(t, PS.st[key], r) : 0);
  const D = (key: string, r = 0.6) => from(t, PS.st[key], r);
  const e: Omit<Estado, "spot" | "spotK"> = {
    eve: D("eve", 3),
    cush: 1 + D("cush2", 0.8) + D("cush3", 0.8) - D("cushLess", 0.8) - D("cushLess2", 0.8) - D("cushNone", 0.8),
    cushGlow: W("cushGlow"), fold: W("fold", 0.3), ruler: W("ruler", 0.6), table: W("table"), fingers: W("fingers", 0.4), meal: W("meal", 0.8), wall: W("wall"),
    count: frac(t, PS.st.count) * W("count", 0.3), nose: W("nose", 0.6), noHands: W("noHands"), timer: W("timer"), timerRun: frac(t, PS.st.timer),
    radio: W("radio", 0.8), cane: W("cane"), caneX: D("caneX", 0.5), recl: D("recl", 2.5), reclGlow: W("reclGlow"),
    bed: W("bed"), laundry: W("laundry"), socks: D("socks", 4), shirts: D("shirts", 3),
    book: W("book", 0.9), open: W("open", 0.7), hi: [W("hi0", 0.4), W("hi1", 0.4), W("hi2", 0.4)],
  };
  let best = 0, spot = [-1.2, 0, -0.9];
  for (const [k, p] of SPOTS) { const v = (e as unknown as Record<string, number>)[k]; if (v > best) { best = v; spot = p; } }
  return { ...e, spot, spotK: best };
};
