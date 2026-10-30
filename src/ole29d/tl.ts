// ole29d · LÍNEA DE TIEMPO del mundo (la cocina del campamento): KEYS = la única cámara, armada con los tramos de plan.json (cam);
// ST(t) = el estado de la cocina (fuego, vapor de la olla, farol, nieve, amanecer) desde las ventanas plan.st.
import PLAN from "./plan.json";

export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

// encuadres con nombre (la cocina a leña atrás a la derecha, la mesa larga adelante a la izquierda, la ventana atrás a la izquierda)
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  wide: { p: [0.2, 1.9, 5.6], l: [0.1, 1.0, -1.2], fov: 50 },
  range: { p: [2.1, 1.35, 0.1], l: [1.55, 0.75, -2.1], fov: 40 },
  pot: { p: [1.85, 1.38, -1.05], l: [1.42, 0.95, -2.15], fov: 36 },
  firebox: { p: [1.7, 0.6, -0.55], l: [1.5, 0.42, -1.85], fov: 38 },
  table: { p: [-1.3, 1.7, 2.4], l: [-1.2, 0.8, 0.1], fov: 44 },
  plates: { p: [-0.3, 1.2, 1.2], l: [-1.5, 0.82, 0.2], fov: 40 },
  window: { p: [-0.2, 1.6, 1.5], l: [-1.6, 1.0, -1.6], fov: 46 },   // 29-oct: la mesa con la ventana nevada atrás (antes: pared sola)
  shelf: { p: [-0.6, 1.5, 0.6], l: [1.4, 0.9, -2.1], fov: 44 },      // 29-oct: la cocina a leña vista desde la mesa (antes: estante vacío)
  lantern: { p: [-1.0, 2.6, 2.2], l: [-1.2, 0.8, 0.0], fov: 46 },    // 29-oct: la mesa desde arriba, bajo el farol (antes: techo)
  duo: { p: [0.4, 1.45, 2.7], l: [0.5, 0.8, -1.6], fov: 46 },
  sack: { p: [3.5, 1.05, 0.3], l: [2.9, 0.5, -1.7], fov: 42 },
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

export type Estado = { fire: number; steam: number; lamp: number; dawn: number; lid: number; plates: number; books: number };
type PlanSt = { st: Record<string, [number, number][]> };
const PS = PLAN as unknown as PlanSt;
export const ST = (t: number): Estado => {
  const W = (key: string, r = 0.5) => (PS.st?.[key] ? wins(t, PS.st[key], r) : 0);
  return { fire: 0.75 + 0.25 * W("fireHi", 1.2), steam: 0.6 + 0.4 * W("steam", 0.8), lamp: 1, dawn: 0.6 * W("dawn", 1.5), lid: W("lidOff", 0.6), plates: 0.4 + 0.6 * W("plates", 0.8), books: W("books", 0.8) };
};
