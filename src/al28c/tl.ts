// al28c · LÍNEA DE TIEMPO del mundo (segundos de la LOCUCIÓN, anclados a frases del ASR de Groq por plan.py).
// KEYS = la única cámara (sin cortes): los tramos de plan.json (cam) → un encuadre con nombre y un empuje lento.
// ST(t) = el estado de la pared de azulejos de Doña Marta: el golpecito, la cinta, la jeringa, el rascador, el repuesto de la caja, la lechada y la pared gigante en corte.
import PLAN from "./plan.json";

export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

// encuadres con nombre (pared de azulejos en z -1,2; mesada a 0,9; la estufa x -1,8/-1,05; la pileta x 0,7/1,25; la esquina bajo la ventana x 2,5;
// la pared gigante en corte adelante en z 1,45; el garaje en x 7,5; el manual en la mesita x 1,55 z 1,05)
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  wide: { p: [0.0, 1.75, 4.6], l: [0.0, 1.25, -1.2], fov: 50 },
  wall: { p: [-0.2, 1.45, 1.6], l: [-0.2, 1.35, -1.2], fov: 48 },
  tap: { p: [-0.35, 1.4, 0.75], l: [-0.35, 1.3, -1.2], fov: 46 },
  tapC: { p: [-1.25, 1.3, -0.35], l: [-1.45, 1.22, -1.2], fov: 40 },
  stove: { p: [-0.95, 1.55, 0.6], l: [-1.42, 1.15, -1.2], fov: 44 },
  tileS: { p: [-1.3, 1.27, -0.6], l: [-1.45, 1.2, -1.2], fov: 36 },
  sink: { p: [1.3, 1.45, 0.2], l: [1.0, 1.12, -1.2], fov: 42 },
  sinkC: { p: [1.08, 1.25, -0.5], l: [1.0, 1.14, -1.2], fov: 38 },
  corner: { p: [2.0, 1.35, -0.1], l: [2.5, 1.02, -1.2], fov: 40 },
  cornerC: { p: [2.25, 1.12, -0.55], l: [2.5, 1.0, -1.2], fov: 38 },
  back: { p: [1.9, 1.3, -0.5], l: [1.9, 0.93, -0.85], fov: 38 },
  damp: { p: [0.98, 1.3, 0.45], l: [0.98, 1.05, -1.2], fov: 44 },
  crack: { p: [-0.4, 1.4, 0.7], l: [-0.4, 1.35, -1.2], fov: 44 },
  giant: { p: [1.7, 1.55, 5.1], l: [0.15, 0.95, 1.45], fov: 34 },
  giantTop: { p: [1.0, 3.1, 4.4], l: [0.2, 0.95, 1.45], fov: 36 },
  giantV: { p: [2.3, 1.2, 4.6], l: [0.25, 0.95, 1.45], fov: 34 },
  garage: { p: [7.5, 1.5, 1.6], l: [7.5, 1.3, -0.6], fov: 46 },
  garageC: { p: [7.7, 1.45, 0.55], l: [7.7, 1.2, -0.4], fov: 40 },
  book: { p: [1.5, 1.32, 1.5], l: [1.43, 0.78, 1.05], fov: 38 },
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

type PlanSt = { st: Record<string, [number, number][]> };
const PS = PLAN as unknown as PlanSt;
// avance (0-1) dentro de la ventana que contiene t (la jeringa que se vacía, el taladro que entra)
const prog = (t: number, ab: [number, number][] | undefined, lead = 0.5) => {
  if (!ab) return 0;
  for (const [a, b] of ab) if (t >= a && t <= b + 0.5) return cl((t - a - lead) / Math.max(1, b - a - lead - 0.8));
  return 0;
};
export const ST = (t: number) => {
  const W = (key: string, r = 0.5) => (PS.st[key] ? wins(t, PS.st[key], r) : 0);
  const D = (key: string, r = 0.6) => from(t, PS.st[key], r);
  const box = D("boxOpen", 0.8);
  return {
    giant: W("giant", 0.9), blob: W("blob", 0.8), heat: W("heat", 0.8), loose: W("loose", 0.8), old: W("old", 0.7), sil: W("sil", 0.7), wet: W("wet", 0.9),
    comb: W("comb", 0.7), combIn: prog(t, PS.st.combIn, 1.0), inj: W("inj", 0.6), injK: Math.max(prog(t, PS.st.inj, 0.8), prog(t, PS.st.inject, 0.8)),
    drill: W("drill", 0.5), drillIn: prog(t, PS.st.drill, 0.5), gap: W("gap", 0.6),
    tap: W("tap", 0.4), tapC: W("tapC", 0.3), tapCorner: W("tapCorner", 0.3), glow: W("glow", 0.5),
    tape: D("tape", 0.6), tapeOff: D("tapeOff", 0.8), push: W("push", 0.5),
    outK: D("outK", 2.0), suction: W("suction", 0.5), brokeK: D("broke", 0.25), newT: D("newT", 1.2), slide: W("slide", 0.6), tapeNew: D("tapeNew", 0.6),
    cleanW: D("cleanW", 1.5), combW: D("combW", 1.2), cross: W("cross", 0.5), holes: D("holes", 0.5), fill: D("fill", 0.5), groutK: D("groutK", 1.0),
    inject: W("inject", 0.5), spacer: W("spacer", 0.5) * (1 - D("tapeOff", 0.5)), drillW: W("drillW", 0.5), brace: W("brace", 0.6), scrape: W("scrape", 0.5),
    pry: W("pry", 0.5), combT: W("combT", 0.5), level: W("level", 0.5), grout: W("grout", 0.5), haze: W("haze", 0.8), crack: W("crack", 0.9),
    boxK: D("boxK", 1.6), boxOpen: box, boxLeft: D("boxLeft", 0.1) > 0.5 ? 11 : 12,
    book: W("book", 0.9), open: W("open", 0.7), hi: [W("hi0", 0.4), W("hi1", 0.4), W("hi2", 0.4)],
  };
};
