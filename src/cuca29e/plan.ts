// cuca30 · PLAN genérico: los planos salen de plan_t.json (frases ya resueltas a segundos por resolver.py).
//   "w:<vista>" = el mundo 3D (la cámara vuela a esa vista; el comal/olla cambia de estado con `st`)
//   "i:<id>"    = foto/toma real (clip agnes si ya llegó) con su empuje propio
// El avatar NO va acá: entra solo en sus ventanas pagadas (avwin.json) y tapa lo que haya debajo.
import PLAN from "./plan_t.json";

export type St = { cal?: number; ash?: number; heat?: number; tatem?: number; dark?: number; gotas?: number; grieta?: number; zonas?: number;
  pepitas?: number; nopal?: number; chiles?: number; tomatillo?: number; sal?: number; comal2?: number; humo?: number; puff?: number; tort?: number };
export type Beat = { a: number; kind: "w" | "i"; arg: string; st: St };
type V3 = [number, number, number];
export const VIEW: Record<string, { p: V3; l: V3; fov: number }> = {
  top: { p: [0.75, 1.78, -1.12], l: [0.75, 0.93, -1.72], fov: 34 },
  side: { p: [1.55, 1.32, -0.95], l: [0.78, 0.93, -1.68], fov: 36 },
  low: { p: [0.15, 1.1, -0.95], l: [0.78, 0.94, -1.72], fov: 33 },
  front: { p: [0.95, 1.42, -0.62], l: [0.74, 0.93, -1.7], fov: 36 },
  left: { p: [-0.15, 1.45, -0.75], l: [0.74, 0.93, -1.7], fov: 33 },
  fogon: { p: [0.75, 0.7, 0.75], l: [0.75, 0.38, -1.3], fov: 42 },
  orilla: { p: [1.75, 0.95, -0.45], l: [0.75, 0.6, -1.5], fov: 38 },
  cocina: { p: [1.8, 1.75, 1.9], l: [-1.4, 0.85, -0.9], fov: 44 },
  mesa: { p: [-0.9, 1.55, 1.0], l: [-1.9, 0.85, -0.45], fov: 38 },
  clavo: { p: [-1.9, 1.7, 1.45], l: [-3.42, 1.68, 0.95], fov: 38 },
  patio: { p: [6.6, 2.5, 2.6], l: [15.0, 1.8, 0.6], fov: 40 },
  chayo: { p: [9.2, 2.1, 3.0], l: [15.5, 2.0, 0.5], fov: 34 },
  salida: { p: [4.2, 2.4, 4.4], l: [-0.6, 1.0, -1.4], fov: 44 },
  // vistas nuevas de la tanda de 30 min: la olla de la hornilla, la repisa de ollas y el molcajete de la mesa
  olla: { p: [0.35, 1.45, -0.9], l: [-0.3, 1.1, -1.85], fov: 34 },
  ollatop: { p: [-0.3, 1.95, -1.3], l: [-0.3, 1.12, -1.85], fov: 36 },
  ollalow: { p: [-0.75, 1.0, -1.05], l: [-0.3, 1.1, -1.85], fov: 36 },
  repisa: { p: [0.5, 1.8, -0.6], l: [0.5, 1.72, -2.5], fov: 44 },
  repisa2: { p: [1.6, 1.75, -1.2], l: [-0.4, 1.75, -2.5], fov: 40 },
  molca: { p: [-1.15, 1.32, 0.15], l: [-1.65, 0.88, -0.55], fov: 32 },
  molcatop: { p: [-1.62, 1.62, -0.3], l: [-1.65, 0.85, -0.55], fov: 34 },
  molcalow: { p: [-2.25, 1.02, -0.05], l: [-1.65, 0.9, -0.55], fov: 34 },
};

export const BEATS: Beat[] = (PLAN as { beats: Beat[] }).beats;
export const REST0 = -1;

// estado del mundo: cada plano de mundo trae el suyo; entre planos se funde en 0,8 s
const WB = BEATS.filter((b) => b.kind === "w");
const KEYS_ST: (keyof St)[] = ["cal", "ash", "heat", "tatem", "dark", "gotas", "grieta", "zonas", "pepitas", "nopal", "chiles", "tomatillo", "sal", "comal2", "humo", "puff", "tort"];
const DEF: Required<St> = { cal: 0, ash: 0, heat: 0, tatem: 0, dark: 0, gotas: 0, grieta: 0, zonas: 0, pepitas: 0, nopal: 0, chiles: 0, tomatillo: 0, sal: 0, comal2: 0, humo: 0, puff: 0, tort: 1 };
export const estado = (t: number): Required<St> => {
  let i = -1; while (i < WB.length - 1 && WB[i + 1].a <= t) i++;
  if (i < 0) return { ...DEF };
  const now = { ...DEF, ...WB[i].st }, prev = i > 0 ? { ...DEF, ...WB[i - 1].st } : now;
  const k = Math.max(0, Math.min(1, (t - WB[i].a) / 0.8)), r = { ...DEF };
  for (const key of KEYS_ST) r[key] = prev[key] + (now[key] - prev[key]) * k;
  return r;
};
// cámara: llega a la vista del plano en 0,9 s y después deriva despacito (órbita propia por plano)
export const KEYS2: { t: number; p: V3; l: V3; fov?: number; arc?: number }[] = WB.flatMap((b, i) => {
  const v = VIEW[b.arg] ?? VIEW.top, end = (WB[i + 1]?.a ?? b.a + 8) - 0.05, sgn = i % 2 ? 1 : -1;
  const d = (x: V3, k: number): V3 => [x[0] + sgn * 0.12 * k, x[1] + 0.03 * k, x[2] + 0.06 * k];
  return [{ t: b.a + 0.9, p: v.p, l: v.l, fov: v.fov }, { t: Math.max(b.a + 1.0, end), p: d(v.p, 1), l: v.l, fov: v.fov - 2 }];
});
