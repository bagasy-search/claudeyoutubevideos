// al28a · LÍNEA DE TIEMPO del mundo (segundos de la LOCUCIÓN, anclados a frases del ASR de Groq por plan.py).
// KEYS = la única cámara (sin cortes): los tramos de plan.json (cam) → un encuadre con nombre y un empuje lento.
// ST(t) = el estado de la casa de Doña Marta: grietas resaltadas, testigos, moneda, la pared gigante y cada capa del arreglo.
import PLAN from "./plan.json";

export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

// encuadres con nombre (pared del fondo en z -2,9; ventana del living x -2,3/-0,9; dormitorio x 1,2-4; pared gigante en x -0,4 z 1,25)
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  wide: { p: [0.1, 2.2, 6.4], l: [0.1, 1.2, -1.6], fov: 50 },
  living: { p: [-1.3, 1.6, 1.6], l: [-1.3, 1.5, -2.9], fov: 46 },
  window: { p: [-1.1, 1.75, -0.6], l: [-1.4, 1.75, -2.9], fov: 44 },
  corner: { p: [-0.65, 2.3, -1.85], l: [-0.75, 2.3, -2.9], fov: 36 },
  hair: { p: [0.45, 1.35, -1.85], l: [0.45, 1.35, -2.9], fov: 40 },
  horiz: { p: [0.25, 2.2, -1.3], l: [0.25, 2.55, -2.9], fov: 44 },
  low: { p: [-2.9, 0.7, -1.2], l: [-3.0, 0.25, -2.9], fov: 44 },
  bedroom: { p: [2.6, 1.6, 1.4], l: [2.7, 1.4, -2.9], fov: 48 },
  diag: { p: [2.85, 1.75, -1.3], l: [2.85, 1.7, -2.9], fov: 44 },
  coin: { p: [3.05, 1.95, -2.45], l: [3.05, 1.95, -2.9], fov: 34 },
  testigo: { p: [2.95, 1.8, -2.5], l: [2.95, 1.8, -2.9], fov: 32 },
  placard: { p: [2.4, 1.4, 0.2], l: [3.7, 1.2, -1.2], fov: 46 },
  outside: { p: [7.6, 2.0, -0.4], l: [4.3, 1.1, -3.2], fov: 48 },
  found: { p: [6.0, -0.22, -1.1], l: [4.2, -0.32, -3.1], fov: 52 },
  giant: { p: [-0.4, 1.55, 4.1], l: [-0.4, 0.7, 1.25], fov: 42 },
  giantV: { p: [-0.4, 1.25, 2.75], l: [-0.4, 0.85, 1.4], fov: 34 },
  giantTop: { p: [-0.1, 2.3, 2.6], l: [-0.4, 0.9, 1.25], fov: 40 },
  book: { p: [2.5, 1.32, 1.05], l: [2.42, 0.78, 0.6], fov: 38 },
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
// "desde": sube al empezar la 1ª ventana y queda (estados que no vuelven atrás: el testigo pegado, la pared arreglada)
const from = (t: number, ab: [number, number][] | undefined, r = 0.6) => (ab && ab.length ? up(t, ab[0][0] - r, ab[0][0]) : 0);

export type Estado = {
  dark: number; flash: number;
  hairVis: number; hairGlow: number; cornerVis: number; cornerGlow: number; diagGlow: number; horizGlow: number; lowGlow: number;
  testigo: number; split: number; coin: number; coinIn: number; placard: number;
  rain: number; wet: number; fixed: number; found: number;
  giant: number; layers: number; move: number; v: number; old: number; dust: number; brush: number; fij: number;
  rigid: number; rigidCrack: number; seal: number; sealGlow: number; malla: number; end: number; sand: number; paint: number; paint2: number;
  book: number; open: number; hi: number[];
};

type PlanSt = { st: Record<string, [number, number][]> };
const PS = PLAN as unknown as PlanSt;
export const ST = (t: number): Estado => {
  const W = (key: string, r = 0.5) => (PS.st[key] ? wins(t, PS.st[key], r) : 0);
  const D = (key: string, r = 0.6) => from(t, PS.st[key], r);
  // la grieta de la esquina: visible hasta que la pared queda pintada (el arreglo del living)
  const paint = D("paint", 1.2), fixedWall = D("done", 1.5);
  const giant = W("giant", 0.9);
  return {
    dark: W("dark", 0.8), flash: W("flash", 0.6),
    hairVis: 0.85, hairGlow: W("hair"), cornerVis: 1 - fixedWall, cornerGlow: W("corner"), diagGlow: W("diag"), horizGlow: W("horiz"), lowGlow: W("low"),
    testigo: D("testigo", 0.8), split: Math.max(W("splitShow", 0.6), up(t, (PS.st.split?.[0]?.[0] ?? 1e9), (PS.st.split?.[0]?.[0] ?? 1e9) + 2.5)),
    coin: W("coin", 0.5), coinIn: W("coinIn", 0.8), placard: W("placard", 0.6),
    rain: W("rain", 0.8), wet: Math.max(W("rain", 2.5), W("wet", 1)), fixed: D("fixed", 2.0), found: W("found", 0.8),
    giant, layers: W("layers", 0.6) * giant, move: W("move", 0.8), v: D("v", 1.2),
    old: W("old", 0.4), dust: W("dust", 0.6), brush: W("brush", 1.2), fij: Math.max(W("fij", 1.0), D("seal", 1) * 0.6),
    rigid: W("rigid", 0.8), rigidCrack: W("rigidCrack", 1.4), seal: D("seal", 1.2), sealGlow: W("seal", 0.8), malla: D("malla", 1.2),
    end: D("end", 1.2), sand: W("sand", 0.6), paint, paint2: D("paint2", 0.5),
    book: W("book", 0.9), open: W("open", 0.7), hi: [W("hi0", 0.4), W("hi1", 0.4), W("hi2", 0.4)],
  };
};
