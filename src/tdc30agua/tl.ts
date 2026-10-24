// tdc30agua · LÍNEA DE TIEMPO del mundo (segundos de la LOCUCIÓN, anclados a frases del ASR de Groq por plan.py).
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
  books: number; row: number; hero: number; open: number; set: "p55" | "p65"; hb: number; hi: number[];
  pot: number; potTap: number; tank: number; flow: number; coilIn: number; coil: number; wool: number; bidon: number; hay: number; hayOpen: number;
};

// ===== tiempos (de las frases del ASR) =====
const CTA1: [number, number] = [94.06, 126.7], CTA2: [number, number] = [1356.1, 1406.85], CTA3: [number, number] = [2292.6, 2297.5];
export const ST = (t: number): Estado => {
  // la salamandra: a las 6 de la mañana está apagada; se prende cuando se habla de lo que quema; queda prendida (el taller en invierno)
  const fire = Math.max(up(t, 24.2, 26.0) * (1 - up(t, 50.0, 52.0)), up(t, 433.2, 436.0) * (1 - up(t, 1103.1, 1105.0)), up(t, 1626.0, 1628.0));
  // de día (los colectores de sol) el taller tiene luz de la mañana por la ventana
  const dawn = 0.55 * wins(t, [[128.0, 433.0], [1104.0, 1356.0], [1407.0, 1626.0], [1936.0, 2004.0]], 1.2);
  const books = wins(t, [CTA1, CTA2, CTA3], 0.8);
  const hb = t < 1000 ? 1 : 3;
  const hero = t < 1000 ? win(t, 114.0, 126.0, 0.9) : t < 2000 ? win(t, 1379.9, 1405.5, 0.9) : 0;
  return {
    fire, temp: 6 + 10 * fire, frost: 0.6 - 0.4 * dawn, dawn,
    clock: 6, clockOn: 0, ghost: 0, ghostTemp: 4,
    drum: 1, legs: 1, drumHot: fire * 0.6, doorCut: 1, doorOpen: 0.5, measure: 0, grate: 1, holes: 1, pipe: 1,
    smoke: fire * 0.6, smokeBlack: wins(t, [[920.4, 933.0]]), leakUp: win(t, 24.4, 33.0, 0.6) * 0.8 + wins(t, [[817.1, 828.0]]) * 0.8, gapFlow: 0, release: 0,
    battery: 0, charge: [0, 0, 0], strip: 0, ruler: 0, cup: 0, reflector: 0, chair: 0, dist: 0,
    giant: 0, lava: 0, lavaOut: 0, lavaIn: 0, hollow: 0, damp: 0, boom: 0, lid: 1,
    lamp: 0.35 + 0.65 * up(t, 54.0, 55.0), warm: 0.15 * fire,
    books, row: books, hero, open: 0, set: t < 1000 ? "p55" : "p65", hb, hi: [0, 0, 0],
    pot: up(t, 448.2, 449.6), potTap: up(t, 562.0, 563.0), tank: up(t, 589.3, 591.5),
    flow: wins(t, [[643.3, 662.0], [670.6, 675.5], [791.5, 810.0], [1889.5, 1905.0]], 0.8) * fire,
    coilIn: wins(t, [[612.2, 623.0], [654.5, 662.0], [736.9, 752.0], [1889.5, 1901.0]], 0.6),
    coil: up(t, 849.2, 852.2), wool: up(t, 878.3, 879.6), bidon: up(t, 866.2, 867.4),
    hay: up(t, 965.5, 966.8), hayOpen: wins(t, [[981.1, 999.0], [1059.7, 1066.0], [1083.9, 1093.0]], 0.6),
  };
};
