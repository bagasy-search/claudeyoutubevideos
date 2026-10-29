// lou29 · LÍNEA DE TIEMPO del mundo (segundos de la LOCUCIÓN, anclados a frases del ASR por plan_lou.py).
// KEYS = la única cámara (sin cortes): cada tramo del mundo en plan.json (cam) → un encuadre con nombre y un empuje lento.
// ST(t) = el estado del diner: reloj de pared, plancha chisporroteando, taburetes que giran, el camión en la ventana.
// BOARD = lo que dice el tablero de letras (el número que se cuenta y su precio). MOOD = 0 noche … 1 pleno día.
import PLAN from "./plan.json";

export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };
type Plan = { cam: [number, number, string][]; end: number; st: Record<string, [number, number][]>; board: [number, string[]][]; mood: number; clock: [number, number] };
const PL = PLAN as unknown as Plan;
export const BOARD = PL.board;
export const MOOD = PL.mood;

// encuadres con nombre (barra a lo largo de x en z≈0,35; la plancha atrás a la izquierda; el tablero en la pared del fondo)
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  wide: { p: [0.0, 1.9, 5.2], l: [0, 1.2, -1.2], fov: 50 },
  counter: { p: [-1.2, 1.45, 2.3], l: [0.4, 1.0, 0.0], fov: 42 },
  stools: { p: [3.6, 0.95, 2.6], l: [-0.5, 0.75, 0.9], fov: 44 },
  griddle: { p: [-1.0, 1.6, -0.6], l: [-1.6, 1.0, -2.2], fov: 46 },
  rail: { p: [-1.2, 1.65, -0.4], l: [-1.7, 1.65, -1.86], fov: 38 },
  board: { p: [0.2, 1.75, 0.4], l: [0.2, 2.2, -2.9], fov: 44 },
  pie: { p: [2.2, 1.45, 1.35], l: [3.0, 1.35, 0.1], fov: 36 },
  coffee: { p: [1.4, 1.35, -1.1], l: [2.0, 1.1, -2.35], fov: 40 },
  window: { p: [-2.6, 1.6, 1.4], l: [-4.9, 1.5, -0.6], fov: 46 },
  register: { p: [-2.6, 1.5, 1.5], l: [-3.4, 1.15, 0.1], fov: 40 },
  clock: { p: [2.0, 2.0, -0.6], l: [2.6, 2.4, -2.9], fov: 38 },
};
const k = (t: number, n: string, dz = 0, arc?: number): Key => {
  const f = F[n] ?? F.wide;
  // dz > 0: la cámara ya se acercó un poco hacia lo que mira (empuje lento dentro del tramo)
  const p = f.p.map((v, i) => v + (f.l[i] - v) * dz);
  return { t, p, l: f.l, fov: f.fov - dz * 6, arc };
};
function buildKeys(): Key[] {
  const CAM = PL.cam;
  let last = CAM[0]?.[2] ?? "wide";
  const out: Key[] = [k(0, last)];
  for (const [a, b, n] of CAM) {
    const prev = out[out.length - 1].t;
    if (n === last) { out.push(k(Math.max(prev + 0.3, b), n, 0.14)); continue; }
    // viaje al encuadre nuevo (~1,2 s, en arco) y después empuje lento hasta el final del tramo
    const arr = Math.max(prev + 0.35, Math.min(a + 1.2, b - 0.2));
    out.push(k(Math.max(prev + 0.05, a), last, 0.14));
    out.push(k(arr, n, 0, 0.05));
    out.push(k(Math.max(arr + 0.3, b), n, 0.14));
    last = n;
  }
  out.push(k(99999, last, 0.14));
  return out.sort((x, y) => x.t - y.t);
}
export const KEYS: Key[] = buildKeys();

const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
export const up = (t: number, a: number, b: number) => sm((t - a) / (b - a));
export const win = (t: number, a: number, b: number, r = 0.4) => up(t, a - r, a) * (1 - up(t, b, b + r));
const wins = (t: number, ab: [number, number][], r = 0.5) => Math.max(0, ...ab.map(([a, b]) => win(t, a, b, r)));

export type Estado = { clock: number; sizzle: number; spin: number; truck: number };
export const ST = (t: number): Estado => {
  const W = (key: string, r = 0.5) => (PL.st[key] ? wins(t, PL.st[key], r) : 0);
  // el reloj avanza de la hora de arranque a la de cierre a lo largo del video (lou29a: 22 h → 6 h)
  const [h0, h1] = PL.clock;
  // el giro de los taburetes se integra (posición, no velocidad) para que nunca salte
  let spin = 0; for (const [a, b] of PL.st.spin ?? []) spin += Math.max(0, Math.min(t, b + 1) - a) * 0.9;
  return { clock: h0 + (h1 - h0) * cl(t / PL.end), sizzle: W("sizzle", 0.8), spin, truck: W("truck", 1.0) };
};
