// hdc28a · LÍNEA DE TIEMPO del mundo (segundos de la LOCUCIÓN, anclados a frases del ASR de Groq por plan.py).
// KEYS = la única cámara (sin cortes): los tramos de plan.json (cam) → un encuadre con nombre y un empuje lento.
// ST(t) = el estado del patio: los dientes recién plantados, el brote, las hojas, la cabeza que engorda, la vara con rulo y su corte, el riego y la cosecha.
import PLAN from "./plan.json";

const SOILY = 0.56;
export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

// encuadres con nombre (el cajón en corte de x -0,55 a 0,55 con la tierra a 0,56 y la cara del corte en z 0; la maceta chica en x -1,35;
// la mesa de trabajo en x 1,55 z -0,35 (vaso en 1,95); la ristra en la pared x -0,4 y 1,95; el libro en la mesita x 0,7 z 1,15)
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  wide: { p: [0.2, 1.55, 3.6], l: [0.15, 0.7, -0.6], fov: 50 },
  box: { p: [0.0, 0.75, 1.55], l: [0.0, 0.45, -0.1], fov: 44 },
  cut: { p: [-0.05, 0.5, 0.85], l: [-0.05, 0.42, -0.05], fov: 40 },
  cutC: { p: [0.02, 0.5, 0.68], l: [0.02, 0.44, -0.05], fov: 36 },
  depth: { p: [0.42, 0.52, 0.42], l: [0.38, 0.46, 0.0], fov: 36 },
  top: { p: [0.0, 1.55, 0.55], l: [0.0, SOILY, -0.16], fov: 42 },
  leaves: { p: [0.35, 1.05, 1.25], l: [0.0, 0.8, -0.15], fov: 42 },
  scape: { p: [0.05, 0.92, 0.6], l: [-0.08, 0.85, -0.05], fov: 36 },
  chive: { p: [-1.05, 0.75, 0.75], l: [-1.35, 0.42, 0.1], fov: 40 },
  table: { p: [1.6, 1.35, 0.75], l: [1.6, 0.8, -0.35], fov: 42 },
  heads: { p: [1.4, 1.02, 0.25], l: [1.38, 0.84, -0.3], fov: 34 },
  cloves: { p: [1.32, 1.08, 0.3], l: [1.3, 0.8, -0.25], fov: 34 },
  glass: { p: [2.05, 0.98, 0.25], l: [1.95, 0.86, -0.25], fov: 32 },
  mix: { p: [1.95, 1.05, 0.15], l: [1.85, 0.8, -0.52], fov: 34 },
  braid: { p: [-0.1, 1.75, -1.4], l: [-0.3, 1.75, -2.5], fov: 42 },
  cure: { p: [0.95, 1.5, -1.3], l: [0.9, 1.28, -2.45], fov: 40 },
  sun: { p: [-1.6, 0.6, 2.6], l: [0.3, 1.2, -1.2], fov: 52 },
  book: { p: [0.65, 1.32, 1.6], l: [0.58, 0.78, 1.15], fov: 38 },
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
    // viaje largo (>1,6 m) = CORTE SECO: a mitad del vuelo la cámara mira el piso o una pared vacía (hdc28a 1762/2002)
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
export const ST = (t: number) => {
  const W = (key: string, r = 0.5) => (PS.st[key] ? wins(t, PS.st[key], r) : 0);
  return {
    bare: W("bare", 0.4), sprout: W("sprout", 0.8), roots: W("roots", 0.8), rootHi: W("rootHi", 0.6), cloveHi: W("cloveHi", 0.5),
    upside: W("upside", 0.3), deep: W("deep", 0.6), shallow: W("shallow", 0.6), depth: W("depth", 0.5), rot: W("rot", 0.6), puddle: W("puddle", 0.8),
    bulb: W("bulb", 1.5), bulbHi: W("bulbHi", 0.6), purple: W("purple", 0.8), overripe: W("overripe", 0.8), lift: prog(t, PS.st.lift, 0.4) * W("lift", 0.4),
    yellow: W("yellow", 1.0), thin: W("thin", 0.8), lush: W("lush", 0.8), trim: W("trim", 0.5),
    scape: Math.max(W("scape", 0.9), W("scapeHi", 0.9)), scapeHi: W("scapeHi", 0.5), scapeCut: W("scapeCut", 0.3),
    wet: W("wet", 0.9), dry: W("dry", 0.9), pour: W("pour", 0.6), drain: W("drain", 0.6), feed: W("feed", 0.6), finger: W("finger", 0.5), mulch: W("mulch", 1.2),
    glow: W("glow", 0.6), sunHi: W("sunHi", 0.8), shade: W("shade", 0.9),
    chive: Math.max(0.35, W("chiveTall", 0.8)), chiveCut: W("chiveCut", 0.3), regrow: prog(t, PS.st.chiveCut, 1.5), snip: W("snip", 0.4), chiveHi: W("chiveHi", 0.5),
    split: W("split", 0.4), bigHi: W("bigHi", 0.5), smallHi: W("smallHi", 0.5), superHi: W("superHi", 0.5), feriaHi: W("feriaHi", 0.5),
    glassRoots: W("glassRoots", 0.8), glassTip: W("glassTip", 0.8), bag: W("bag", 0.5), mix: W("mix", 0.6), mixHi: W("mixHi", 0.5),
    braid: Math.max(W("braid", 0.9), from(t, PS.st.braid, 1.6)), braidHi: W("braidHi", 0.6), cure: Math.max(W("cure", 0.9), from(t, PS.st.cure, 1.6)),
    book: W("book", 0.9), open: W("open", 0.7), hi: [W("hi0", 0.4), W("hi1", 0.4)],
  };
};
