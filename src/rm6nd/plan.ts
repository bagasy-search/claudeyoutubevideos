// plo29 · PLAN genérico del plomero: los planos salen de plan_t.json (frases ya resueltas a segundos por resolver.py).
//   "w:<vista>" = el mundo 3D (baño + cocina con la tarja y el sifón + lavamanos); el estado cambia con `st`
//   "i:<id>"    = foto/toma real (clip Veo si ya llegó) con su empuje propio
// El avatar NO va acá: entra solo en sus ventanas pagadas (avwin.json), con corte seco.
import PLAN from "./plan_t.json";

export type St = {
  xray?: number; plug?: number; level?: number; pour?: number; hot?: number; bucket?: number; flush?: number; tank?: number; film?: number; plunger?: number;
  wipes?: number; crack?: number; flow?: number; stuck?: number; steam?: number; boil?: number; valve?: number; vent?: number;
  kx?: number; grasa?: number; tl?: number; nata?: number; trap?: number; sonda?: number; agua?: number; rejilla?: number; bico?: number; copa?: number;
  lx?: number; pelo?: number; ll?: number; botella?: number;
};
export type Beat = { a: number; kind: "w" | "i"; arg: string; st: St };
type V3 = [number, number, number];
export const VIEW: Record<string, { p: V3; l: V3; fov: number }> = {
  todo: { p: [1.8, 2.7, 5.4], l: [1.4, 0.2, -0.4], fov: 46 },
  bano: { p: [0.9, 1.5, 1.9], l: [-0.2, 0.6, -0.9], fov: 44 },
  taza: { p: [0.55, 1.05, 0.25], l: [0, 0.4, -0.85], fov: 36 },
  tazatop: { p: [0.05, 1.55, -0.25], l: [0, 0.4, -0.85], fov: 36 },
  sifonx: { p: [0.95, 0.45, -0.9], l: [0, 0.22, -1.0], fov: 32 },
  tanque: { p: [0.35, 1.45, -0.65], l: [0, 0.88, -1.38], fov: 34 },
  llave: { p: [0.2, 0.5, -0.9], l: [-0.24, 0.16, -1.58], fov: 32 },
  cano: { p: [1.4, -0.3, 3.1], l: [1.2, -0.9, 1.5], fov: 40 },
  camara: { p: [3.3, 0.25, 2.7], l: [2.6, -0.7, 1.4], fov: 38 },
  vent: { p: [-0.5, 2.5, 3.3], l: [-1.6, 2.4, 1.45], fov: 40 },
  lavamanos: { p: [-0.75, 1.35, -0.45], l: [-1.2, 0.85, -1.38], fov: 36 },
  lavax: { p: [-0.55, 0.6, -0.55], l: [-1.2, 0.42, -1.45], fov: 36 },
  cocina: { p: [3.6, 1.7, 1.6], l: [3.3, 0.8, -1.2], fov: 44 },
  tarja: { p: [3.05, 1.55, -0.5], l: [3.02, 0.88, -1.22], fov: 36 },
  tarjatop: { p: [3.02, 1.95, -0.9], l: [3.02, 0.88, -1.26], fov: 38 },
  bajo: { p: [3.3, 0.62, -0.05], l: [3.0, 0.4, -1.2], fov: 38 },
  sifonk: { p: [3.4, 0.45, -0.5], l: [3.0, 0.36, -1.2], fov: 30 },
  pava: { p: [4.0, 1.3, -0.45], l: [4.25, 1.0, -1.2], fov: 34 },
};

export const BEATS: Beat[] = (PLAN as { beats: Beat[] }).beats;
export const REST0 = -1;

// estado del mundo: cada plano de mundo trae el suyo; entre planos se funde en 0,8 s
const WB = BEATS.filter((b) => b.kind === "w");
const KEYS_ST: (keyof St)[] = ["xray", "plug", "level", "pour", "hot", "bucket", "flush", "tank", "film", "plunger", "wipes", "crack", "flow", "stuck", "steam", "boil", "valve", "vent",
  "kx", "grasa", "tl", "nata", "trap", "sonda", "agua", "rejilla", "bico", "copa", "lx", "pelo", "ll", "botella"];
const DEF: Required<St> = Object.fromEntries(KEYS_ST.map((k) => [k, 0])) as Required<St>;
export const estado = (t: number): Required<St> => {
  let i = -1; while (i < WB.length - 1 && WB[i + 1].a <= t) i++;
  if (i < 0) return { ...DEF };
  const now = { ...DEF, ...WB[i].st }, prev = i > 0 ? { ...DEF, ...WB[i - 1].st } : now;
  const k = Math.max(0, Math.min(1, (t - WB[i].a) / 0.8)), r = { ...DEF };
  for (const key of KEYS_ST) r[key] = prev[key] + (now[key] - prev[key]) * k;
  return r;
};
// segundos desde que arrancó el plano de mundo actual (para acciones con movimiento: copa, chorro, sonda)
export const desde = (t: number) => { let i = -1; while (i < WB.length - 1 && WB[i + 1].a <= t) i++; return i < 0 ? t : t - WB[i].a; };
// cámara: llega a la vista del plano en 0,9 s y después deriva despacito (órbita propia por plano)
export const KEYS2: { t: number; p: V3; l: V3; fov?: number; arc?: number }[] = WB.flatMap((b, i) => {
  const v = VIEW[b.arg] ?? VIEW.bano, end = (WB[i + 1]?.a ?? b.a + 8) - 0.05, sgn = i % 2 ? 1 : -1;
  const d = (x: V3, k: number): V3 => [x[0] + sgn * 0.12 * k, x[1] + 0.03 * k, x[2] + 0.06 * k];
  return [{ t: b.a + 0.9, p: v.p, l: v.l, fov: v.fov }, { t: Math.max(b.a + 1.0, end), p: d(v.p, 1), l: v.l, fov: v.fov - 2 }];
});
