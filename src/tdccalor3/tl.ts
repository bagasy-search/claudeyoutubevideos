// tdccalor3 · LÍNEA DE TIEMPO del mundo (segundos de la LOCUCIÓN, anclados a palabras del ASR de Groq; el gancho LTX va ANTES, fuera de esta cuenta).
// KEYS = la única cámara (sin cortes). ST(t) = el estado del taller en ese instante (tambor, batería, reloj, termómetro, ladrillo gigante…).
export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

// encuadres con nombre (el tambor está en x 1,4 · z -1,6; la batería a los lados; el ladrillo gigante adelante a la izquierda)
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  drumFront: { p: [1.4, 0.8, 0.7], l: [1.4, 0.38, -1.4], fov: 40 },
  drumDoor: { p: [1.45, 0.42, -0.3], l: [1.4, 0.3, -1.3], fov: 36 },
  drumLow: { p: [1.9, 0.18, -0.4], l: [1.4, 0.12, -1.6], fov: 40 },
  battery: { p: [0.05, 1.15, 0.35], l: [1.15, 0.35, -1.6], fov: 44 },
  batteryR: { p: [2.9, 1.1, 0.2], l: [1.75, 0.35, -1.6], fov: 44 },
  gap: { p: [0.7, 0.72, -0.62], l: [1.05, 0.32, -1.5], fov: 34 },
  top: { p: [1.4, 2.6, -0.2], l: [1.4, 0.3, -1.6], fov: 46 },
  window: { p: [-1.85, 1.4, -1.3], l: [-2.6, 1.65, -3], fov: 42 },
  thermo: { p: [-0.55, 1.7, 0.4], l: [-0.55, 1.7, -3], fov: 44 },
  thermoClock: { p: [-0.9, 1.95, 0.9], l: [-0.9, 1.95, -3], fov: 48 },
  clock: { p: [-1.45, 2.45, -1.2], l: [-1.45, 2.5, -3], fov: 40 },
  wide: { p: [0.2, 2.0, 6.2], l: [0.2, 1.1, -1.4], fov: 50 },
  pipe: { p: [2.9, 1.7, 1.0], l: [1.4, 2.3, -1.86], fov: 54 },
  pipeTop: { p: [3.6, 4.4, 2.8], l: [1.4, 4.7, -1.86], fov: 50 },
  giant: { p: [-1.3, 0.62, 3.7], l: [-1.35, 0.55, 1.15], fov: 42 },
  giantClose: { p: [-0.6, 0.6, 2.6], l: [-0.8, 0.55, 1.4], fov: 40 },
  damp: { p: [2.7, 0.55, 0.15], l: [2.1, 0.1, -0.8], fov: 40 },
  bookRow: { p: [-3.2, 1.95, -0.15], l: [-3.2, 0.94, -1.9], fov: 48 },
  book: { p: [-3.23, 1.32, -1.4], l: [-3.24, 0.95, -1.78], fov: 35 },
  chair: { p: [-1.6, 1.35, 1.0], l: [0.4, 0.5, -1.3], fov: 46 },
  reflector: { p: [0.2, 1.3, -0.4], l: [1.4, 0.8, -2.85], fov: 48 },
  door: { p: [2.0, 1.45, 2.45], l: [4.9, 0.72, 0.1], fov: 54 },
  bucket: { p: [2.6, 0.9, 2.6], l: [3.6, 0.25, 1.1], fov: 44 },
};
const k = (t: number, n: string, dz = 0, arc?: number): Key => {
  const f = F[n];
  // dz > 0: la cámara ya se acercó un poco hacia lo que mira (empuje lento dentro del tramo)
  const p = f.p.map((v, i) => v + (f.l[i] - v) * dz);
  return { t, p, l: f.l, fov: f.fov - dz * 6, arc };
};

// ===== MINUTO 1 (0 → 153,5) =====
const MIN1: Key[] = [
  k(0, "window"), k(4.2, "window", 0.04),
  // portal por la boca del tambor: la estufa apagada, la escarcha por dentro
  k(4.4, "drumFront"), k(6.0, "drumFront", 0.08), k(6.9, "window", 0, 0.05), k(11.3, "window", 0.12),
  k(16.2, "window", 0.14),
  // "la estufa había estado prendida cuatro horas" → el tambor encendido → el reloj y el termómetro
  k(20.7, "drumFront"), k(24.2, "drumFront", 0.1), k(25.3, "thermoClock", 0, 0.04), k(32.4, "thermoClock", 0.08),
  // "te acuestas calentito y te despiertas helado" · "no es la leña, no es la estufa" · "nada que guarde"
  k(36.3, "wide"), k(41.8, "wide", 0.08), k(42.6, "drumFront"), k(44.1, "drumFront", 0.06), k(45.0, "battery", 0, 0.05), k(46.5, "battery", 0.05),
  // "hoy te muestro los ladrillos que sí lo guardan": la batería cae en su lugar
  k(52.0, "battery"), k(55.4, "batteryR", 0, 0.06), k(60.3, "batteryR", 0.08), k(61.4, "gap"), k(64.7, "gap", 0.1),
  // "y lo mido todo": termómetro, pistola, la hora
  k(69.6, "thermoClock"), k(73.0, "thermoClock", 0.06), k(75.8, "thermoClock", 0.1),
  // "el ladrillo que nunca tiene que estar al lado del fuego"
  k(77.8, "damp"), k(80.8, "damp", 0.12), k(85.0, "damp", 0.14),
  // "soy Claudio y este es mi taller" · parte 3 · parte 1 · parte 2
  k(87.6, "wide", 0, 0.06), k(97.2, "wide", 0.12),
  // "una paredcita de ladrillos" · "me llovieron preguntas"
  k(103.1, "battery"), k(107.8, "battery", 0.05), k(108.6, "top", 0, 0.05), k(115.3, "top", 0.1),
  // CTA1: la guía sobre el banco → Manual 1 → página 74
  k(120.0, "bookRow", 0, 0.08), k(126.8, "bookRow", 0.1), k(128.9, "book", 0, 0.03), k(130.7, "book", 0.04),
  k(135.8, "book", 0.05), k(145.7, "book", 0.12), k(149.0, "bookRow"),
  // "vamos al banco": vuelta al tambor
  k(151.5, "drumFront"), k(153.5, "drumFront", 0.05),
];

// ===== EL RESTO (lo completa el plan del resto): tramos [desde, hasta, encuadre] =====
export const SHOTS: [number, number, string][] = [
  // la masa: el ladrillo gigante se llena de calor y lo larga
  [153.5, 156.5, "drumFront"], [156.6, 170.6, "giant"], [179.3, 186.0, "wide"], [186.1, 197.4, "battery"],
  // secreto 1: macizo / hueco / húmedo
  [197.5, 207.9, "giant"], [213.6, 221.2, "giantClose"], [221.3, 229.9, "giant"], [230.0, 238.1, "damp"],
  [281.8, 297.9, "drumFront"],
  // secreto 2: la estufa
  [298.0, 312.0, "drumFront"], [346.4, 350.5, "drumDoor"], [357.0, 362.7, "drumLow"], [373.2, 377.8, "pipe"], [377.9, 380.8, "drumLow"],
  [380.9, 396.2, "pipeTop"], [396.3, 414.5, "thermoClock"], [414.6, 430.7, "drumFront"],
  // secreto 3: la batería
  [427.0, 430.7, "top"], [430.8, 450.3, "gap"], [450.4, 457.4, "gap"], [457.5, 468.0, "battery"], [468.0, 474.8, "pipe"],
  [479.2, 491.3, "battery"], [491.4, 495.5, "top"], [495.6, 513.6, "batteryR"], [513.7, 529.0, "thermoClock"], [529.1, 539.0, "battery"],
  // secreto 4: cuántos
  [539.1, 547.3, "wide"], [547.4, 563.5, "bookRow"], [563.6, 577.6, "battery"], [577.7, 595.8, "drumFront"],
  // secreto 5: cómo se carga
  [595.9, 612.0, "drumDoor"], [612.0, 628.3, "pipeTop"], [628.4, 646.4, "drumDoor"], [646.5, 669.6, "batteryR"],
  // la noche con reloj
  [680.2, 700.3, "thermoClock"], [710.5, 728.6, "window"], [728.7, 744.7, "battery"],
  // CTA 2: Manual 1, página 71
  [761.2, 768.5, "bookRow"], [768.6, 803.0, "book"],
  // secreto 6: dónde te pones
  [794.7, 813.0, "chair"], [823.8, 829.1, "chair"], [829.2, 843.2, "reflector"], [843.3, 861.4, "door"],
  // secreto 7 y lo que no hace
  [861.5, 899.9, "battery"], [899.9, 912.0, "wide"], [912.1, 932.5, "thermoClock"], [932.6, 945.7, "door"],
  // seguridad
  [945.8, 961.9, "damp"], [962.0, 976.0, "drumFront"], [976.1, 994.2, "pipe"], [1010.4, 1026.7, "batteryR"], [1026.8, 1044.8, "bucket"],
  // errores
  [1044.9, 1060.2, "gap"], [1060.3, 1074.0, "battery"], [1074.1, 1094.7, "drumFront"],
  // recibo · salamandra · tarea · cierre
  [1094.8, 1127.0, "wide"], [1143.2, 1159.5, "drumFront"], [1159.6, 1177.6, "battery"], [1193.1, 1211.3, "thermoClock"], [1211.4, 1229.0, "window"],
];
function REST_KEYS(): Key[] {
  const out: Key[] = [];
  for (const [a, b, n] of SHOTS) {
    const prev = out.length ? out[out.length - 1].t : 153.5;
    const arr = Math.max(prev + 0.3, a - prev > 0.05 ? a : a + Math.min(1.8, (b - a) * 0.4));
    out.push(k(arr, n)); out.push(k(Math.max(b, arr + 0.3), n, 0.1));
  }
  return out;
}
export const KEYS: Key[] = [...MIN1, ...REST_KEYS(), { ...k(5000, "wide") }];

const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
/** sube de 0 a 1 entre a y b */
export const up = (t: number, a: number, b: number) => sm((t - a) / (b - a));
/** 1 entre a y b (con rampas de r segundos) */
export const win = (t: number, a: number, b: number, r = 0.4) => up(t, a - r, a) * (1 - up(t, b, b + r));
// valor por tramos: [[t, v], …] con rampas de 0,8 s
const steps = (t: number, pts: [number, number][], r = 0.8) => { let v = pts[0][1]; for (let i = 1; i < pts.length; i++) v += (pts[i][1] - pts[i - 1][1]) * up(t, pts[i][0], pts[i][0] + r); return v; };

export type Estado = {
  fire: number; temp: number; frost: number; dawn: number; clock: number; clockOn: number; ghost: number; ghostTemp: number;
  drum: number; legs: number; drumHot: number; doorCut: number; doorOpen: number; measure: number; grate: number; holes: number; pipe: number;
  smoke: number; smokeBlack: number; leakUp: number; gapFlow: number; release: number;
  battery: number; charge: number[]; strip: number; ruler: number; cup: number; reflector: number; chair: number; dist: number;
  giant: number; lava: number; lavaOut: number; lavaIn: number; hollow: number; damp: number; boom: number; lid: number;
  lamp: number; warm: number;
  books: number; row: number; hero: number; open: number; set: "p74" | "p71"; hi: number[];
};

export const ST = (t: number): Estado => (t < 153.5 ? ST1(t) : ST2(t));
const ST1 = (t: number): Estado => {
  // MINUTO 1: la noche SIN ladrillos (fuego 20,7-27,7; a las 3 se apagó) → la batería aparece en 52,7
  const fire = Math.max(win(t, 20.6, 27.6, 0.8), win(t, 85.0, 108.0, 0.8), up(t, 150.0, 152.0));
  // el reloj: 3 de la mañana al principio; 22 h al prender; corre hasta las 3 (27,8)
  const clock = t < 24.3 ? 27 : t < 27.7 ? 22 : t < 36 ? 22 + 5 * up(t, 27.7, 29.2) : t < 70 ? 27 : 22 + 0.3 * up(t, 70, 76);
  const temp = steps(t, [[0, 4], [24.4, 20], [27.9, 4], [69.5, 4], [71.8, 14]], 1.2);
  const battery = t < 52.6 ? 0 : t < 103.0 ? up(t, 52.6, 55.6) : t < 103.2 ? 1 : t < 108.4 ? 16 / 48 : 1;
  const charge0 = win(t, 60.3, 64.6, 0.6) * 0.5 + up(t, 151.0, 153.5) * 0.3;
  return {
    fire, temp,
    frost: 0.55 + 0.45 * up(t, 6.2, 8.4),
    dawn: 0,
    clock, clockOn: up(t, 24.2, 24.8) * (1 - up(t, 36.2, 36.6)) + up(t, 75.6, 76.2) * (1 - up(t, 77.6, 78.0)),
    ghost: 0, ghostTemp: 4,
    drum: 1, legs: 1, drumHot: fire * 0.6 + up(t, 24.3, 25.2) * (1 - up(t, 27.8, 29.5)) * 0.6, doorCut: 1, doorOpen: 0.5, measure: 0, grate: 1, holes: 1, pipe: 1,
    smoke: fire * 0.6, smokeBlack: 0, leakUp: win(t, 28.6, 33.0, 0.6) + win(t, 46.5, 52.0, 0.5) * 0.6, gapFlow: win(t, 60.3, 64.6, 0.6) + up(t, 151.0, 153.5),
    release: 0,
    battery, charge: [charge0, charge0 * 0.6, charge0 * 0.35], strip: up(t, 108.6, 110.0), ruler: win(t, 61.6, 69.0, 0.4),
    cup: 0, reflector: 0, chair: 0, dist: 0,
    giant: 0, lava: 0, lavaOut: 0, lavaIn: 0, hollow: 0,
    damp: win(t, 77.8, 86.0, 0.5), boom: up(t, 83.5, 84.6), lid: 1,
    lamp: 0.25 + 0.75 * up(t, 87.6, 88.4), warm: 0.15 * fire,
    books: up(t, 122.6, 123.8) * (1 - up(t, 150.0, 151.0)), row: up(t, 123.4, 125.4), hero: up(t, 128.8, 130.0), open: up(t, 130.0, 131.4),
    set: "p74", hi: [up(t, 135.9, 136.5), up(t, 136.9, 137.8), up(t, 138.6, 139.6)],
  };
};

// ===== EL RESTO (153,5 → final) =====
const wins = (t: number, ab: [number, number][], r = 0.5) => Math.max(0, ...ab.map(([a, b]) => win(t, a, b, r)));
const ST2 = (t: number): Estado => {
  // fuego: vivo salvo la prueba SIN ladrillos (se apaga 415) y la noche (se apaga 686,5)
  const fire = steps(t, [[150, 1], [401.5, 0], [407.8, 1], [415.2, 0], [455.5, 1], [686.3, 0], [760.5, 1], [1214, 0.35]], 1.2);
  // la batería desaparece para la prueba sin ladrillos y se vuelve a armar: 2 de alto (16) → 3 filas (48)
  const battery = t < 401.5 ? 1 : t < 457.5 ? 1 - up(t, 401.5, 403) : t < 505.8 ? up(t, 457.5, 461.5) * 16 / 48 : 16 / 48 + up(t, 505.8, 512.5) * 32 / 48;
  const night = t >= 684 && t < 761;
  const temp = t < 401 ? 18 : t < 432 ? steps(t, [[401, 6], [409.8, 20], [416.1, 4]], 1.0) : !night ? 18
    : steps(t, [[684, 20], [694.2, 16], [715.1, 13], [720.7, 11]], 1.0);
  const clock = t < 401 ? 21 : t < 432 ? steps(t, [[401, 18], [409.8, 22], [416.1, 27]], 1.0) : !night ? 21
    : steps(t, [[684, 22], [694.2, 25], [699.7, 27], [720.7, 30], [747.6, 30.5]], 1.0);
  const c = night ? 0.85 - 0.45 * up(t, 690, 757) : t >= 646 && t < 684 ? up(t, 649.7, 653.8) * 0.95 : t < 401.5 || t > 520 ? 0.55 * fire : 0.15 * fire;
  const dawn = up(t, 716, 728) * (1 - up(t, 760, 762)) + up(t, 1216, 1222);
  return {
    fire, temp, frost: 0.6 - 0.5 * dawn, dawn,
    clock, clockOn: wins(t, [[405.6, 428.2], [684.2, 760.5], [1183.4, 1211.3]]),
    ghost: wins(t, [[690.8, 728.5]]), ghostTemp: steps(t, [[690, 9], [699.6, 6], [720.6, 4]], 1.0),
    drum: 1, legs: 1, drumHot: fire * 0.6, doorCut: 1, doorOpen: 0.5 + 0.4 * wins(t, [[634.3, 639.3]]) - 0.4 * wins(t, [[610, 620]]),
    measure: wins(t, [[346.4, 362.7]]), grate: 1, holes: 1, pipe: 1,
    smoke: fire * 0.6, smokeBlack: wins(t, [[612, 625.6], [644.7, 646.4]]), leakUp: wins(t, [[419.2, 430.7]]) + wins(t, [[450.6, 457.4]]) * 0.6,
    gapFlow: wins(t, [[438.0, 450.3], [1049.8, 1060.2]]) + fire * battery * 0.4,
    release: wins(t, [[733.6, 760.5], [861.5, 899.9]]) * battery,
    battery, charge: [c, c * 0.66, c * 0.44], strip: t < 401.5 ? 1 : t < 491.4 ? 0 : up(t, 491.4, 493.2),
    ruler: wins(t, [[432.5, 457.4], [1043.6, 1059.2]]), cup: wins(t, [[747.0, 761.0]]),
    reflector: up(t, 827.4, 829.2) * (1 - up(t, 860, 861)), chair: wins(t, [[805, 843.2], [1189, 1211]]), dist: wins(t, [[814.8, 829.1]]),
    giant: wins(t, [[156.4, 186.0], [203.0, 236.0]]), lava: up(t, 160.5, 165.5), lavaOut: up(t, 165.9, 170.5) * (1 - up(t, 200, 203)),
    lavaIn: wins(t, [[160.5, 165.6]]), hollow: up(t, 221.3, 222.8) * (1 - up(t, 236, 237)),
    damp: wins(t, [[230, 248.1], [948, 962]]), boom: t < 600 ? up(t, 240.0, 241.0) : up(t, 958.7, 959.6), lid: 1 - wins(t, [[1029.6, 1034.4]]),
    lamp: 1, warm: 0.15 * fire + 0.12 * wins(t, [[733.6, 760.5]]),
    books: wins(t, [[547.4, 563.5], [766.8, 803.0]]), row: up(t, 547.6, 549.4) * (1 - up(t, 563, 564)) + up(t, 767.4, 769.2), hero: up(t, 770.4, 771.6), open: up(t, 771.6, 773.0),
    set: "p71", hi: [up(t, 772.6, 773.4), up(t, 777.9, 778.6), up(t, 784.3, 785.2)],
  };
};
