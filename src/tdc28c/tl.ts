// tdc28c (desde tdc30agua) · LÍNEA DE TIEMPO del mundo (segundos de la LOCUCIÓN, anclados a frases del ASR de Groq por plan.py).
// KEYS = la única cámara (sin cortes): los tramos de plan.json (cam) → un encuadre con nombre y un empuje lento.
// ST(t) = el estado del taller: el fuego, la olla, el tanque con el serpentín, el serpentín del caño, la caja de heno, la guía.
import PLAN from "./plan.json";

export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

// encuadres con nombre (el tambor-salamandra en x 1,4 · z -1,6; el tanque de la pared atrás a la derecha; la caja de heno adelante a la izquierda)
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  drumFront: { p: [1.4, 0.8, 0.7], l: [1.4, 0.38, -1.4], fov: 40 },
  drumDoor: { p: [1.45, 0.42, -0.3], l: [1.4, 0.3, -1.3], fov: 36 },
  window: { p: [-1.85, 1.4, -1.3], l: [-2.6, 1.65, -3], fov: 42 },
  thermoClock: { p: [-0.9, 1.95, 0.9], l: [-0.9, 1.95, -3], fov: 48 },
  wide: { p: [0.2, 2.0, 6.2], l: [0.2, 1.1, -1.4], fov: 50 },
  pipeTop: { p: [3.6, 4.4, 2.8], l: [1.4, 4.7, -1.86], fov: 50 },
  bookRow: { p: [-3.2, 1.95, -0.15], l: [-3.2, 0.94, -1.9], fov: 48 },
  book: { p: [-3.23, 1.32, -1.4], l: [-3.24, 0.95, -1.78], fov: 35 },
  door: { p: [2.0, 1.45, 2.45], l: [4.9, 0.72, 0.1], fov: 54 },
  pot: { p: [2.05, 1.25, -0.55], l: [1.32, 0.85, -1.42], fov: 40 },
  tank: { p: [0.45, 1.6, 1.0], l: [1.95, 1.3, -2.2], fov: 50 },
  coilIn: { p: [1.45, 0.62, -0.25], l: [1.4, 0.41, -1.6], fov: 42 },
  coil: { p: [2.55, 1.55, -0.4], l: [1.4, 1.35, -1.86], fov: 44 },
  hay: { p: [-0.2, 1.05, 0.45], l: [-0.8, 0.28, -0.85], fov: 44 },
  // tdc28c · el rincón de las briquetas (brique3d.tsx: palé en x -1,4 z 1,0 · malla x 0,85 z 1,35 · latas x 2,35 z 1,25 · cartel en la pared)
  bqBench: { p: [-1.15, 1.45, 2.85], l: [-1.2, 0.3, 0.8], fov: 46 },
  bqDust: { p: [-1.75, 1.2, 2.25], l: [-1.75, 0.35, 0.95], fov: 40 },
  bqClay: { p: [-0.95, 1.2, 2.25], l: [-0.95, 0.4, 0.95], fov: 40 },
  bqMix: { p: [-1.4, 1.35, 2.4], l: [-1.4, 0.35, 1.0], fov: 38 },
  bqPress: { p: [-0.95, 1.0, 1.8], l: [-1.4, 0.45, 0.78], fov: 42 },
  bqDry: { p: [1.2, 0.75, 2.25], l: [0.8, 0.1, 1.3], fov: 40 },
  bqBurn: { p: [2.35, 0.82, 1.8], l: [2.35, 0.08, 1.18], fov: 38 },
  bqSign: { p: [0.72, 1.62, -1.72], l: [0.75, 1.72, -2.92], fov: 44 },
};
const k = (t: number, n: string, dz = 0, arc?: number): Key => {
  const f = F[n] ?? F.wide;
  // dz > 0: la cámara ya se acercó un poco hacia lo que mira (empuje lento dentro del tramo)
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
    if (n === lastName) {
      // mismo encuadre: sigue el empuje lento
      out.push(k(Math.max(prev + 0.3, b), n, 0.12));
      continue;
    }
    // viaje al encuadre nuevo (~1,1 s, con un arco chico) y después empuje lento hasta el final del tramo
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
/** sube de 0 a 1 entre a y b */
export const up = (t: number, a: number, b: number) => sm((t - a) / (b - a));
/** 1 entre a y b (con rampas de r segundos) */
export const win = (t: number, a: number, b: number, r = 0.4) => up(t, a - r, a) * (1 - up(t, b, b + r));
const wins = (t: number, ab: [number, number][], r = 0.5) => Math.max(0, ...ab.map(([a, b]) => win(t, a, b, r)));

export type Estado = {
  fire: number; temp: number; frost: number; dawn: number; clock: number; clockOn: number; ghost: number; ghostTemp: number;
  drum: number; legs: number; drumHot: number; doorCut: number; doorOpen: number; measure: number; grate: number; holes: number; pipe: number;
  smoke: number; smokeBlack: number; leakUp: number; gapFlow: number; release: number;
  battery: number; charge: number[]; strip: number; ruler: number; cup: number; reflector: number; chair: number; dist: number;
  giant: number; lava: number; lavaOut: number; lavaIn: number; hollow: number; damp: number; boom: number; lid: number;
  lamp: number; warm: number;
  pour: number; chorizo: number; mix: number; press: number; dry: number; dried: number; turn: number; burn: number; burnLow: number; co: number;
  books: number; row: number; hero: number; open: number; set: "p55" | "p65"; hb: number; hi: number[];
  pot: number; potTap: number; tank: number; flow: number; coilIn: number; coil: number; wool: number; bidon: number; hay: number; hayOpen: number;
};

// ===== tiempos: TODO sale de plan.json (st = ventanas [a,b] por estado; hb = libro elegido desde t) =====
type PlanSt = { st: Record<string, [number, number][]>; hb?: [number, number][] };
const PS = PLAN as unknown as PlanSt;
export const ST = (t: number): Estado => {
  const W = (key: string, r = 0.5) => (PS.st[key] ? wins(t, PS.st[key], r) : 0);
  const fire = W("fire", 1.2), dawn = 0.55 * W("dawn", 1.2), books = W("books", 0.8);
  let hb = 1; for (const [a, v] of PS.hb ?? []) if (t >= a) hb = v;
  return {
    fire, temp: 6 + 10 * fire, frost: 0.6 - 0.4 * dawn, dawn,
    clock: 6, clockOn: 0, ghost: 0, ghostTemp: 4,
    drum: 1, legs: 1, drumHot: fire * 0.6, doorCut: 1, doorOpen: 0.5 - 0.5 * W("doorShut") + 0.5 * W("doorOpen"), measure: W("measure"), grate: 1, holes: 1, pipe: 1,
    smoke: fire * 0.6, smokeBlack: W("smokeBlack"), leakUp: W("leakUp") * 0.8, gapFlow: 0, release: 0,
    battery: 0, charge: [0, 0, 0], strip: W("strip"), ruler: W("ruler"), cup: 0, reflector: W("reflector"), chair: W("chair"), dist: W("dist"),
    giant: 0, lava: 0, lavaOut: 0, lavaIn: 0, hollow: 0, damp: W("damp"), boom: W("boom", 0.2), lid: 1,
    lamp: 0.35 + 0.65 * up(t, 3.0, 4.0), warm: 0.15 * fire,
    books, row: books, hero: W("hero", 0.9), open: 0, set: "p55", hb, hi: [0, 0, 0],
    pot: W("pot", 0.7), potTap: 0, tank: W("tank", 0.8), flow: W("flow", 0.8) * fire,
    coilIn: W("coilIn", 0.6), coil: W("coil", 0.8), wool: W("wool"), bidon: W("bidon"),
    hay: W("hay", 0.7), hayOpen: W("hayOpen", 0.6),
    pour: W("pour", 0.8), chorizo: W("chorizo", 0.8), mix: W("mix", 1.5), press: W("press", 0.6), dry: W("dry", 1.0), dried: W("dried", 2.0), turn: W("turn", 0.6),
    burn: W("burn", 1.0), burnLow: W("burnLow", 3.0), co: W("co", 0.8),
  };
};
