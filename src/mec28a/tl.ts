// mec28a · LÍNEA DE TIEMPO del mundo (segundos de la LOCUCIÓN, anclados a frases del ASR de Groq por plan.py).
// KEYS = la única cámara (sin cortes): los tramos de plan.json (cam) → un encuadre con nombre y un empuje lento.
// ST(t)(clave) = el estado del garaje: la caja de fusibles, el tablero o el turbo de cada video.
import PLAN from "./plan.json";

export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

// encuadres con nombre (el auto en x -1,3 z -0,8 mirando a +z con el vano del motor en z 0,6; el banco en x 1,6 z -0,95 con la pieza
// del video en x 1,55; el panel de herramientas atrás en z -1,45; el banquito con el manual en x 0,35 z 0,95; el portón a la izquierda)
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  wide: { p: [1.5, 1.75, 3.7], l: [-0.2, 0.85, -0.8], fov: 52 },
  car: { p: [-0.3, 1.5, 3.0], l: [-1.3, 0.8, 0.4], fov: 44 },
  engine: { p: [-1.05, 1.7, 1.75], l: [-1.25, 0.8, 0.5], fov: 40 },
  efuse: { p: [-0.55, 1.35, 1.2], l: [-0.8, 0.9, 0.42], fov: 34 },
  turboCar: { p: [-1.4, 1.3, 1.2], l: [-1.68, 0.86, 0.32], fov: 32 },
  door: { p: [-0.4, 1.5, 2.6], l: [-3.6, 1.2, 0.2], fov: 46 },
  bench: { p: [1.6, 1.65, 1.25], l: [1.6, 1.0, -1.05], fov: 44 },
  prop: { p: [1.55, 1.35, 0.15], l: [1.55, 1.1, -1.05], fov: 36 },
  propC: { p: [1.5, 1.22, -0.35], l: [1.5, 1.12, -1.05], fov: 30 },
  propL: { p: [1.0, 1.25, -0.25], l: [0.95, 1.05, -1.0], fov: 32 },
  propR: { p: [2.2, 1.25, -0.25], l: [2.3, 1.02, -0.95], fov: 32 },
  board: { p: [1.6, 1.7, 0.3], l: [1.6, 1.6, -1.45], fov: 44 },
  clock: { p: [2.75, 1.95, -0.6], l: [2.75, 1.95, -1.42], fov: 34 },
  book: { p: [0.5, 1.05, 1.6], l: [0.35, 0.36, 0.95], fov: 38 },
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
    // viaje largo (>1,6 m) = CORTE SECO: a mitad del vuelo la cámara mira el piso o una pared vacía (mec28a 1762/2002)
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
// ST(t)(clave) = cuánto está prendido ese estado (0-1) en t
const R: Record<string, number> = { blown: 0.6, lid: 0.8, heat: 0.9, radio: 0.5, lampOn: 0.25, click: 0.3, hot: 0.9, cool: 1.2, spin: 0.8, smoke: 0.9, night: 0.9, hazard: 0.3, ign: 0.4, allOn: 0.3, sweep: 0.2 };
export const ST = (t: number) => (key: string) => {
  if (key.endsWith("K")) return prog(t, PS.st[key.slice(0, -1)], 0.5);
  return PS.st[key] ? wins(t, PS.st[key], R[key] ?? 0.5) : 0;
};
