// ben29 · PLAN genérico: los planos salen de plan_t.json (frases ya resueltas a segundos por resolver.py).
//   "w:<vista>" = el mundo 3D (la cámara vuela a esa vista; horno/masa/pan cambian de estado con `st`)
//   "i:<id>"    = foto/toma real (clip Veo si ya llegó) con su empuje propio
// El avatar NO va acá: entra solo en sus ventanas pagadas (avwin.json), con corte seco.
import PLAN from "./plan_t.json";

export type St = { fire?: number; glow?: number; heat?: number; pot?: number; loafin?: number; lid?: number; spring?: number; crust?: number; steam?: number; probe?: number; sparkle?: number;
  dough?: number; rise?: number; lump?: number; cover?: number; dent?: number; flour?: number; yeast?: number; die?: number; net?: number; water?: number; torn?: number; gas?: number; align?: number;
  dawn?: number; snow?: number; smoke?: number; hot?: number; cups?: number; weigh?: number; slice?: number; brick?: number; prod?: number; bake?: number };
export type Beat = { a: number; kind: "w" | "i"; arg: string; st: St };
type V3 = [number, number, number];
export const PROD: "loaf" | "rolls" | "focaccia" | "baguette" = ((PLAN as { prod?: string }).prod ?? "loaf") as "loaf";
export const VIEW: Record<string, { p: V3; l: V3; fov: number }> = {
  wide: { p: [2.2, 2.3, 6.6], l: [-1.6, 1.1, -1.4], fov: 42 },
  wide2: { p: [-0.4, 1.9, 4.6], l: [-2.8, 1.15, -1.5], fov: 40 },
  dawn: { p: [2.6, 2.6, 7.4], l: [-1.4, 1.2, -1.4], fov: 44 },
  table: { p: [3.6, 1.95, 3.4], l: [1.4, 0.95, 0.25], fov: 36 },
  table2: { p: [2.7, 1.6, 2.6], l: [1.3, 0.95, 0.3], fov: 34 },
  bowl: { p: [1.6, 1.69, 1.95], l: [1.2, 1.04, 0.45], fov: 32 },
  bowlclose: { p: [1.32, 1.34, 1.47], l: [1.2, 1.04, 0.45], fov: 28 },
  bowltop: { p: [1.4, 1.97, 1.45], l: [1.2, 1.02, 0.45], fov: 30 },
  loaf: { p: [2.92, 1.14, 0.8], l: [2.6, 0.98, 0.05], fov: 30 },
  loafclose: { p: [2.72, 1.04, 0.51], l: [2.6, 0.975, 0.05], fov: 28 },
  cups: { p: [2.1, 1.22, 1.73], l: [2.1, 0.98, 0.78], fov: 28 },
  scale: { p: [0.75, 1.34, 0.9], l: [0.4, 1.18, -0.15], fov: 30 },
  oven: { p: [-2.9, 2.4, 3.6], l: [-4.2, 1.55, -1.6], fov: 40 },
  ovenclose: { p: [-3.75, 1.5, 0.15], l: [-4.2, 1.18, -1.6], fov: 34 },
  pot: { p: [-3.7, 1.55, -0.2], l: [-4.2, 1.15, -1.55], fov: 32 },
  potclose: { p: [-3.9, 1.48, -0.55], l: [-4.2, 1.18, -1.55], fov: 28 },
  macro: { p: [40.6, 2.4, 7.0], l: [40, 2, 0], fov: 42 },
  macroclose: { p: [39.3, 2.15, 4.0], l: [40, 2, 0], fov: 40 },
  window: { p: [0.4, 1.85, -1.2], l: [-0.4, 1.9, -3.95], fov: 40 },
  shelf: { p: [3.6, 2.0, -1.2], l: [3.4, 1.95, -3.75], fov: 40 },
  sacks: { p: [-5.0, 1.3, 3.2], l: [-6.6, 0.5, 0.9], fov: 40 },
  peel: { p: [-0.6, 1.9, -1.4], l: [-1.6, 1.9, -3.75], fov: 40 },
  prod: { p: [2.4, 1.43, 1.57], l: [2.05, 1.0, 0.62], fov: 30 },
  prodclose: { p: [2.25, 1.18, 1.12], l: [2.05, 1.0, 0.62], fov: 28 },
  prodtop: { p: [2.1, 1.9, 1.0], l: [2.05, 0.98, 0.6], fov: 32 },
};

export const BEATS: Beat[] = (PLAN as { beats: Beat[] }).beats;

// estado del mundo: cada plano de mundo trae el suyo; entre planos se funde en 0,8 s
const WB = BEATS.filter((b) => b.kind === "w");
const DEF: Required<St> = { fire: 1, glow: 0.6, heat: 0, pot: 0, loafin: 0, lid: 1, spring: 0, crust: 0, steam: 0, probe: 0, sparkle: 0,
  dough: 1, rise: 0.5, lump: 0, cover: 0, dent: 0, flour: 0, yeast: 0, die: 0, net: 0.6, water: 0, torn: 0, gas: 0.4, align: 0,
  dawn: 0, snow: 0, smoke: 0, hot: 0, cups: 0, weigh: 1, slice: 0, brick: 0, prod: 1, bake: 1 };
const KEYS_ST = Object.keys(DEF) as (keyof St)[];
export const estado = (t: number): Required<St> => {
  let i = -1; while (i < WB.length - 1 && WB[i + 1].a <= t) i++;
  if (i < 0) return { ...DEF, ...(WB[0]?.st ?? {}) };
  const now = { ...DEF, ...WB[i].st }, prev = i > 0 ? { ...DEF, ...WB[i - 1].st } : now;
  const k = Math.max(0, Math.min(1, (t - WB[i].a) / 0.8)), r = { ...DEF };
  for (const key of KEYS_ST) r[key] = prev[key] + (now[key] - prev[key]) * k;
  return r;
};
// cámara: llega a la vista del plano en 0,9 s y después deriva despacito (órbita propia por plano)
export const KEYS2: { t: number; p: V3; l: V3; fov?: number; arc?: number }[] = WB.flatMap((b, i) => {
  const v = VIEW[b.arg] ?? VIEW.wide, end = (WB[i + 1]?.a ?? b.a + 8) - 0.05, sgn = i % 2 ? 1 : -1;
  const sc = v.p[0] > 30 ? 4 : 1; // el macro es grande: deriva más
  const d = (x: V3, k: number): V3 => [x[0] + sgn * 0.12 * k * sc, x[1] + 0.03 * k * sc, x[2] + 0.06 * k * sc];
  return [{ t: b.a + 0.9, p: v.p, l: v.l, fov: v.fov }, { t: Math.max(b.a + 1.0, end), p: d(v.p, 1), l: v.l, fov: v.fov - 2 }];
});
