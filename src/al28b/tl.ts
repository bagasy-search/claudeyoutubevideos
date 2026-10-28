// al28b · LÍNEA DE TIEMPO del mundo (segundos de la LOCUCIÓN, anclados a frases del ASR de Groq por plan.py).
// KEYS = la única cámara (sin cortes): los tramos de plan.json (cam) → un encuadre con nombre y un empuje lento.
// ST(t) = el estado del baño y la cocina de Doña Marta: el moho, el aluminio, el vinagre, la pintura, el extractor, la aureola de la cocina, la terraza y el techo gigante en corte.
import PLAN from "./plan.json";

export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

// encuadres con nombre (pared de afuera en z -2,9; baño x -4/0 con la ducha en la esquina x -4/-2,9; cocina x 0/4; losa en y 2,5; terraza arriba; techo gigante en corte adelante en z 1,3)
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  wide: { p: [0.0, 2.3, 6.6], l: [0.0, 1.35, -1.6], fov: 50 },
  bath: { p: [-2.0, 1.55, 2.0], l: [-2.3, 1.6, -2.9], fov: 48 },
  door: { p: [-0.5, 1.6, 0.6], l: [-3.1, 2.0, -2.5], fov: 50 },
  corner: { p: [-2.55, 1.25, -1.15], l: [-3.55, 2.5, -2.65], fov: 48 },
  foil: { p: [-3.05, 1.7, -1.95], l: [-3.4, 2.5, -2.55], fov: 42 },
  shower: { p: [-2.2, 1.25, -0.5], l: [-3.4, 1.35, -2.4], fov: 46 },
  window: { p: [-1.45, 1.6, -1.2], l: [-1.8, 1.95, -2.9], fov: 44 },
  fan: { p: [-2.6, 1.75, -1.55], l: [-3.35, 2.2, -2.9], fov: 42 },
  kitchen: { p: [2.0, 1.6, 2.0], l: [2.0, 1.4, -2.9], fov: 48 },
  ring: { p: [2.3, 1.05, -0.85], l: [2.65, 2.5, -2.2], fov: 46 },
  pot: { p: [1.1, 1.45, -1.2], l: [1.2, 1.0, -2.5], fov: 44 },
  terrace: { p: [3.6, 4.7, 0.9], l: [2.5, 2.6, -2.1], fov: 46 },
  drain: { p: [3.7, 3.95, -0.8], l: [2.85, 2.66, -2.4], fov: 42 },
  giant: { p: [1.25, 1.3, 3.9], l: [0.0, 1.3, 1.3], fov: 40 },
  giantV: { p: [0.0, 1.15, 2.85], l: [0.0, 1.25, 1.3], fov: 36 },
  giantTop: { p: [1.5, 2.45, 3.7], l: [0.0, 1.3, 1.3], fov: 40 },
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
  grow: number; moldGlow: number; mold: number; wetV: number; spray: number; brush: number; rag: number; bleach: number; fij: number; paint: number; paint2: number;
  steam: number; drops: number; foil: number; foilDrops: number; peel: number; ladder: number; winOpen: number; door: number; clothes: number; fan: number; fanOn: number; insul: number;
  ringGlow: number; ring3: number; ring4: number; drip: number; foilK: number; wetK: number; leaves: number; puddle: number; path: number; hose: number; bulge: number; paintK: number;
  giant: number; cond: number; roots: number; bleachG: number; vin: number; sponge: number; anti: number; insulG: number; filt: number; foilG: number; side: number; cold: number;
  book: number; open: number; hi: number[];
};

type PlanSt = { st: Record<string, [number, number][]> };
const PS = PLAN as unknown as PlanSt;
export const ST = (t: number): Estado => {
  const W = (key: string, r = 0.5) => (PS.st[key] ? wins(t, PS.st[key], r) : 0);
  const D = (key: string, r = 0.6) => from(t, PS.st[key], r);
  // el moho: aparece al «Y está así», se limpia con el vinagre (queda una sombra) y la pintura lo tapa del todo
  const grow = D("grow", 2.2), clean = D("clean", 3.0), paint = D("paint", 1.4);
  return {
    grow, moldGlow: W("moldGlow"), mold: grow * (1 - 0.85 * clean) * (1 - paint), wetV: W("wetV", 1.0), spray: W("spray", 0.4), brush: W("brush", 0.6), rag: W("rag", 0.6),
    bleach: W("bleach", 0.8), fij: Math.max(W("fij", 1.0), D("fijD", 1.0) * 0.5) * (1 - paint * 0.9), paint, paint2: D("paint2", 0.6),
    steam: W("steam", 1.2), drops: W("drops", 1.0), foil: W("foil", 0.6), foilDrops: W("foilDrops", 1.0), peel: W("peel", 0.8), ladder: W("ladder", 0.8),
    winOpen: W("winOpen", 0.8), door: W("door", 0.8), clothes: W("clothes", 0.8), fan: D("fan", 1.0), fanOn: W("fanOn", 0.8), insul: W("insul", 0.9),
    ringGlow: W("ringGlow"), ring3: D("ring3", 1.2), ring4: W("ring4", 1.0), drip: W("drip", 0.6), foilK: W("foilK", 0.6), wetK: W("wetK", 1.0),
    leaves: 1 - D("unclog", 1.5), puddle: W("puddle", 1.0) * (1 - D("unclog", 2.5)), path: W("path", 0.8), hose: W("hose", 0.6), bulge: W("bulge", 1.0), paintK: D("paintK", 1.2),
    giant: W("giant", 0.9), cond: W("cond", 0.8), roots: W("roots", 0.8), bleachG: W("bleachG", 0.8), vin: W("vin", 0.8), sponge: W("sponge", 0.8), anti: W("anti", 0.8),
    insulG: W("insulG", 0.8), filt: W("filt", 0.8), foilG: W("foilG", 0.6), side: W("side", 0.6), cold: W("cold", 0.8),
    book: W("book", 0.9), open: W("open", 0.7), hi: [W("hi0", 0.4), W("hi1", 0.4), W("hi2", 0.4)],
  };
};
