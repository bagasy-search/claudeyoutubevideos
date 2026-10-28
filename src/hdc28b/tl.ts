// hdc28b · LÍNEA DE TIEMPO del mundo (segundos de la LOCUCIÓN, anclados a frases del ASR de Groq por plan.py).
// KEYS = la única cámara (sin cortes): los tramos de plan.json (cam) → un encuadre con nombre y un empuje lento.
// ST(t) = el estado de la cocina: la fresa y sus semillas, el frío, la bandeja sembrada que brota, el trasplante y la planta madre con su estolón.
import PLAN from "./plan.json";

export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

// encuadres con nombre (la mesa de la cocina con la tapa en y 0,78; la bandeja en corte en x ±0,3 con el sustrato a 0,85 y el corte en z 0;
// la tabla de la fresa en x -0,72; licuadora y vaso atrás a la izquierda; sobre y frasco en x 0,58; el vasito del trasplante en x 0,68 z 0,2;
// la heladera al fondo a la derecha (x 2,25 z -1,95); el banco de la ventana con la planta madre en x -2,05 y la maceta del estolón en -1,58)
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  wide: { p: [0.1, 1.6, 2.9], l: [-0.35, 0.8, -0.6], fov: 50 },
  tray: { p: [0.0, 1.15, 0.95], l: [0.0, 0.84, -0.12], fov: 40 },
  cut: { p: [0.0, 0.9, 0.55], l: [0.0, 0.83, -0.05], fov: 34 },
  cutC: { p: [0.05, 0.88, 0.36], l: [0.04, 0.84, -0.06], fov: 30 },
  top: { p: [0.0, 1.45, 0.25], l: [0.0, 0.85, -0.13], fov: 40 },
  seeds: { p: [0.04, 1.02, 0.16], l: [0.0, 0.85, -0.1], fov: 28 },
  berry: { p: [-0.68, 1.08, 0.62], l: [-0.74, 0.83, 0.1], fov: 34 },
  napkin: { p: [-0.68, 1.12, 0.72], l: [-0.68, 0.79, 0.3], fov: 32 },
  glass: { p: [-0.86, 1.0, 0.25], l: [-0.88, 0.88, -0.38], fov: 34 },
  env: { p: [0.6, 1.04, 0.3], l: [0.6, 0.84, -0.3], fov: 32 },
  fridge: { p: [1.45, 1.3, 0.45], l: [2.2, 0.85, -1.6], fov: 44 },
  window: { p: [-0.5, 1.35, 1.3], l: [-1.7, 1.25, -2.3], fov: 48 },
  plant: { p: [-1.72, 1.08, 0.6], l: [-1.9, 0.72, -0.85], fov: 40 },
  runner: { p: [-1.45, 0.98, 0.15], l: [-1.75, 0.7, -0.82], fov: 36 },
  fruit: { p: [-1.92, 0.86, -0.3], l: [-2.03, 0.68, -0.85], fov: 34 },
  lift: { p: [0.24, 0.95, 0.35], l: [0.22, 0.88, -0.06], fov: 30 },
  cup: { p: [0.7, 0.98, 0.58], l: [0.68, 0.86, 0.2], fov: 30 },
  book: { p: [0.0, 1.35, 0.85], l: [0.0, 0.8, 0.3], fov: 38 },
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
    if (Math.hypot(fa.p[0] - fb.p[0], fa.p[1] - fb.p[1], fa.p[2] - fb.p[2]) > 1.2 || lastName === "fridge" || n === "fridge") {
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
    // la fresa, la licuadora y el vaso
    berryHi: W("berryHi", 0.5), strip: W("strip", 0.4), napkin: Math.max(W("napkin", 0.5), W("dryStrip", 0.5)), dryStrip: W("dryStrip", 1.0), plate: W("plate", 0.5),
    blend: Math.max(W("blend", 0.5), W("spin", 0.5)), spin: W("spin", 0.3), glass: Math.max(W("glass", 0.5), W("settle", 0.5)), settle: prog(t, PS.st.settle, 0.4) * W("settle", 0.4) + W("clean", 0.4), clean: W("clean", 0.6), sieve: W("sieve", 0.5), seedHi: W("seedHi", 0.5),
    // el frío
    env: W("env", 0.5), fridge: W("fridge", 0.6), jarIn: W("jarIn", 0.4), frost: W("frost", 0.8),
    // la bandeja
    bare: W("bare", 0.4), sow: Math.max(W("sow", 1.2), W("bare", 0.4) * 0.999), buried: W("buried", 0.6), sand: W("sand", 1.0), pick: W("pick", 0.4), press: W("press", 0.5),
    wet: W("wet", 0.9), dry: W("dry", 0.9), bottom: W("bottom", 0.6), bottomUp: prog(t, PS.st.bottom, 0.6) * W("bottom", 0.5), spray: W("spray", 0.5),
    film: Math.max(W("film", 0.6), W("drops", 0.6), W("vent", 0.6)), drops: Math.max(W("drops", 1.2), W("vent", 0.6)), vent: W("vent", 0.8), fuzz: W("fuzz", 0.8),
    germ: W("germ", 1.2), cotyHi: W("cotyHi", 0.5), trueLeaf: W("trueLeaf", 1.2), leggy: W("leggy", 1.0), damp: W("damp", 0.8), pale: W("pale", 1.0), thin: W("thin", 0.3),
    glow: W("glow", 0.6), sunHi: W("sunHi", 0.8),
    // el trasplante
    cup: Math.max(W("cup", 0.5), W("crownHi", 0.5), W("crownDeep", 0.5), W("crownHigh", 0.5)), lift: W("lift", 0.6), crownHi: W("crownHi", 0.5), crownDeep: W("crownDeep", 0.6), crownHigh: W("crownHigh", 0.6),
    // la planta madre
    flower: Math.max(W("flower", 0.9), W("flowerHi", 0.9), W("snipFlower", 0.9)), flowerHi: W("flowerHi", 0.5), snipFlower: W("snipFlower", 0.4),
    fruit: Math.max(W("fruit", 0.9), W("fruitHi", 0.9), W("net", 0.9), W("disc", 0.9), W("snail", 0.9)), fruitHi: W("fruitHi", 0.5), ripe: Math.max(W("ripe", 1.0), W("fruitHi", 1.0)),
    straw: Math.max(W("straw", 1.2), from(t, PS.st.straw, 1.2) * (1 - W("winter", 0.5))), winter: W("winter", 1.0), winterCut: W("winterCut", 0.4), leafHi: W("leafHi", 0.5),
    runner: Math.max(W("runner", 1.2), W("pin", 0.9), W("snip", 0.9), W("runnerHi", 0.9)), runnerHi: W("runnerHi", 0.5), pin: Math.max(W("pin", 0.6), W("snip", 0.6)), snip: W("snip", 0.4), cutRunner: W("cutRunner", 0.3),
    snail: W("snail", 0.6), shell: W("shell", 1.0), net: W("net", 0.8), disc: W("disc", 0.6), banana: W("banana", 0.5), tea: W("tea", 0.5),
    book: W("book", 0.9), open: W("open", 0.7), hi: [W("hi0", 0.4), W("hi1", 0.4)],
  };
};
