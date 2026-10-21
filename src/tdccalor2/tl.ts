// tdccalor2 · LÍNEA DE TIEMPO del mundo (segundos GLOBALES de la locución, anclados a palabras del ASR de Groq).
// KEYS = la única cámara (sin cortes). ST(t) = el estado del taller en ese instante (qué está armado, cuánto marca el termómetro…).
// Tramos de voz: A 0-92,1 · CTA1 92,56-122,74 · B 123,19-446,48 · CTA2 446,93-469,73 · C 470,18-1195,1
export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

// ===== el RESTO (123,3 → final): encuadres con nombre; la cámara llega al encuadre al empezar cada tramo de mundo
// y se acerca despacio mientras dura (entre tramos viaja SIN CORTE, mientras se ve el avatar o una toma) =====
const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  door: { p: [2.0, 1.45, 2.45], l: [4.9, 0.72, 0.1], fov: 54 },
  doorLow: { p: [2.85, 0.75, 2.7], l: [4.95, 0.25, 0.8], fov: 48 },
  leaks: { p: [0.9, 1.9, 4.2], l: [0.6, 1.3, -1.4], fov: 50 },
  window: { p: [-1.8, 1.35, -1.35], l: [-2.6, 1.25, -3], fov: 42 },
  thermo: { p: [-0.6, 1.75, 0.7], l: [-0.6, 1.7, -3], fov: 46 },
  stove: { p: [3.85, 1.0, 0.45], l: [2.7, 0.5, -1.5], fov: 44 },
  flue: { p: [4.3, 1.7, 1.2], l: [2.7, 1.9, -1.6], fov: 54 },
  flueTop: { p: [4.1, 2.3, 1.1], l: [2.7, 3.0, -1.6], fov: 52 },
  bricks: { p: [3.95, 1.45, 0.5], l: [2.7, 0.45, -1.5], fov: 46 },
  book: { p: [0.02, 1.32, -1.42], l: [0.01, 0.95, -1.8], fov: 35 },
  bookRow: { p: [0.35, 1.95, -0.15], l: [0.35, 0.94, -1.9], fov: 48 },
  wide: { p: [0.1, 2.1, 6.4], l: [0, 1.3, -1.4], fov: 48 },
  solar: { p: [-2.75, 1.45, -0.35], l: [-4.0, 1.2, -2.6], fov: 44 },
  jugs: { p: [-1.75, 1.05, -0.95], l: [-2.7, 0.35, -2.6], fov: 44 },
  cot: { p: [-1.5, 1.65, 3.0], l: [-3.4, 0.8, 1.2], fov: 44 },
  drum: { p: [3.0, 1.2, -0.3], l: [4.3, 0.5, -2.45], fov: 42 },
};
// [desde, hasta, encuadre] de cada tramo en que se VE el mundo
export const SHOTS: [number, number, string][] = [
  [123.3, 131.5, "door"], [141.2, 147.0, "doorLow"], [152.4, 157.6, "leaks"], [157.6, 164.7, "doorLow"], [169.4, 176.3, "leaks"],
  [188.0, 190.8, "doorLow"], [203.8, 207.8, "window"], [207.8, 215.9, "thermo"], [223.6, 232.4, "flue"], [240.9, 246.2, "flueTop"],
  [252.2, 265.5, "flue"], [286.0, 298.2, "flue"], [303.4, 309.3, "flue"], [319.4, 326.4, "flueTop"], [326.4, 330.0, "thermo"],
  [336.2, 339.0, "stove"], [339.0, 346.5, "thermo"], [346.5, 349.5, "stove"], [369.6, 379.9, "wide"], [384.4, 398.2, "bricks"],
  [407.5, 415.4, "bricks"], [419.3, 429.2, "bricks"], [440.2, 446.5, "thermo"], [450.5, 453.3, "bookRow"], [453.3, 461.2, "book"], [465.8, 470.2, "bookRow"],
  [470.2, 478.2, "wide"], [482.4, 495.6, "solar"], [499.1, 506.0, "solar"], [532.3, 538.5, "solar"], [565.3, 577.9, "solar"],
  [587.0, 594.0, "thermo"], [599.9, 604.8, "solar"], [617.5, 628.6, "wide"], [663.7, 692.8, "wide"], [697.6, 704.4, "jugs"],
  [713.1, 724.6, "jugs"], [730.5, 743.8, "wide"], [748.3, 759.4, "cot"], [765.2, 771.0, "cot"], [778.8, 784.0, "cot"],
  [790.0, 792.7, "cot"], [802.8, 808.4, "thermo"], [817.7, 823.4, "cot"], [828.6, 841.3, "stove"], [845.0, 856.5, "stove"],
  [884.2, 893.2, "thermo"], [899.1, 909.5, "thermo"], [913.4, 927.1, "flue"], [931.2, 942.5, "stove"], [948.0, 959.5, "flue"],
  [971.3, 977.1, "window"], [981.5, 991.8, "flueTop"], [1004.2, 1009.4, "wide"], [1031.4, 1039.8, "bricks"], [1043.8, 1055.7, "wide"],
  [1059.3, 1069.7, "door"], [1092.3, 1103.8, "wide"], [1126.6, 1139.9, "wide"], [1144.5, 1150.0, "door"], [1150.0, 1156.1, "bricks"],
  [1177.0, 1182.8, "wide"], [1182.8, 1186.0, "drum"], [1194.5, 1197.0, "wide"],
];
function REST_KEYS(): Key[] {
  const out: Key[] = [];
  for (const [a, b, n] of SHOTS) {
    const f = F[n], k = 0.1; // se acerca un 10 % hacia lo que mira
    const p2 = f.p.map((v, i) => v + (f.l[i] - v) * k);
    const prev = out.length ? out[out.length - 1].t : -1;
    // tramo pegado al anterior: la cámara VIAJA del encuadre anterior a este (sin salto) en ~1,8 s
    const arr = a - prev > 0.05 ? a : a + Math.min(1.8, (b - a) * 0.4);
    out.push({ t: arr, p: f.p, l: f.l, fov: f.fov });
    out.push({ t: b, p: p2, l: f.l, fov: f.fov - 1 });
  }
  out.push({ t: 2000, p: out[out.length - 1].p, l: out[out.length - 1].l, fov: 46 });
  return out;
}

export const KEYS: Key[] = [
  // --- gancho: la estufa apagada, la escarcha, el calor que se fue ---
  { t: 0, p: [1.5, 1.0, 1.4], l: [2.7, 0.5, -1.5], fov: 38 },
  { t: 4.5, p: [1.55, 0.98, 1.25], l: [2.7, 0.5, -1.5], fov: 38 },
  { t: 7.3, p: [1.8, 0.85, 0.6], l: [2.7, 0.5, -1.5], fov: 36 },
  { t: 8.7, p: [-1.85, 1.7, -1.2], l: [-2.6, 1.75, -3], fov: 42, arc: 0.08 },
  { t: 10.9, p: [-2.1, 1.72, -1.7], l: [-2.6, 1.75, -3], fov: 40 },
  { t: 19.4, p: [0.3, 2.0, 6.4], l: [0, 1.2, -1.5], fov: 46 },
  { t: 26.2, p: [0.1, 1.9, 5.2], l: [0, 1.3, -1.6], fov: 44 },
  { t: 27.7, p: [-0.2, 1.62, -0.7], l: [-0.2, 1.55, -3], fov: 40 },
  { t: 30.7, p: [-0.6, 1.65, -0.9], l: [-1.4, 1.7, -3], fov: 40 },
  { t: 31.9, p: [-1.7, 1.7, -1.0], l: [-2.6, 1.75, -3], fov: 42 },
  { t: 33.0, p: [-1.75, 1.7, -1.1], l: [-2.6, 1.75, -3], fov: 42 },
  // --- "lo voy a subir hasta veinte" · los siete calores ---
  { t: 38.2, p: [-0.2, 1.95, -0.55], l: [-0.2, 2.3, -3], fov: 40 },
  { t: 39.9, p: [-0.2, 1.9, -0.65], l: [-0.2, 2.25, -3], fov: 40 },
  { t: 42.6, p: [0, 2.2, 6.8], l: [0, 1.4, -1.2], fov: 48 },
  { t: 47.6, p: [0.4, 2.0, 6.0], l: [0, 1.3, -1.4], fov: 46 },
  // --- la pregunta del comentario: el termómetro sube y vuelve a 4 ---
  { t: 54.25, p: [0.3, 1.5, -0.2], l: [0.4, 1.5, -3], fov: 46 },
  { t: 62.6, p: [0.25, 1.52, -0.4], l: [0.35, 1.5, -3], fov: 45 },
  { t: 64.6, p: [0, 2.1, 6.6], l: [0, 1.3, -1.4], fov: 48 },
  // --- cada calor tiene su banco: travelling por los puestos ---
  { t: 70.3, p: [4.0, 1.6, 3.6], l: [3.6, 1.2, 0.4], fov: 42 },
  { t: 73.2, p: [-1.0, 1.7, 2.4], l: [-2.6, 1.2, -1.0], fov: 44 },
  { t: 76.4, p: [-0.2, 1.7, -0.5], l: [-0.2, 1.6, -3], fov: 42 },
  { t: 81.8, p: [-0.1, 1.65, -0.85], l: [-0.2, 1.6, -3], fov: 41 },
  { t: 83.5, p: [1.6, 0.9, 0.4], l: [2.7, 0.55, -1.5], fov: 36 },
  { t: 87.0, p: [1.7, 0.85, 0.5], l: [2.7, 0.5, -1.5], fov: 36 },
  { t: 92.5, p: [1.75, 0.85, 0.35], l: [2.7, 0.5, -1.5], fov: 35 },
  // --- CTA1: la guía sobre el banco, Manual 2 pág. 55 ---
  { t: 95.0, p: [0.45, 1.75, -0.55], l: [0.4, 0.94, -1.85], fov: 40, arc: 0.06 },
  { t: 98.7, p: [0.42, 1.68, -0.7], l: [0.4, 0.94, -1.85], fov: 40 },
  { t: 101.66, p: [0.1, 1.45, -1.0], l: [0.0, 0.94, -1.72], fov: 40 },
  { t: 104.3, p: [-0.16, 1.58, -1.22], l: [-0.17, 0.95, -1.74], fov: 38 },
  { t: 108.4, p: [-0.02, 1.36, -1.36], l: [0.0, 0.95, -1.78], fov: 36 },
  { t: 116.9, p: [0.02, 1.32, -1.42], l: [0.01, 0.95, -1.8], fov: 35 },
  // --- "vamos al primer banco": la puerta ---
  { t: 119.13, p: [1.2, 1.7, 3.0], l: [4.2, 0.8, 0.9], fov: 46 },
  { t: 123.3, p: [2.6, 1.3, 2.6], l: [4.95, 0.55, 0.9], fov: 44 },
  ...REST_KEYS(),
];

const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
/** sube de 0 a 1 entre a y b */
export const up = (t: number, a: number, b: number) => sm((t - a) / (b - a));
/** 1 entre a y b (con rampas de r segundos) */
export const win = (t: number, a: number, b: number, r = 0.4) => up(t, a - r, a) * (1 - up(t, b, b + r));

export type Estado = {
  fire: number; temp: number; frost: number; coldIn: number; snake: number; hose: number; leakWin: number; leakFlue: number;
  goal: number; fins: number; finHeat: number; bricks: number; brickHeat: number; brickFlow: number; brick7: number; brick7Heat: number;
  solar: number; cans: number; paint: number; glass: number; solarFlow: number; jugs: number; tent: number; blankets: number; warmBed: number;
  signs: number[]; signHi: number[]; lamp: number; warm: number;
  // la guía
  books: number; row: number; hero: number; open: number; set: "m2" | "m1"; hi: number[]; mini: number;
};

// el TERMÓMETRO GIGANTE: 4 → 18 → 4 en el comentario; después cada calor lo sube: 6 (rendijas) · 9 (aletas) · cae a 5 al apagarse
// · 12 a la mañana (ladrillos) · 15 (sol) · 16 (bidones) · 18 (cuarto tibio) · y en el repaso vuelve a subir de 4 a 20
const STEPS: [number, number, number][] = [
  [210.0, 212.0, 6], [329.0, 331.5, 9], [339.6, 341.6, 5], [436.0, 438.5, 12], [585.0, 587.5, 15], [716.0, 718.0, 16], [805.5, 807.5, 18],
  // repaso (887,7 "empezamos en 4")
  [887.7, 888.6, 4], [891.6, 892.4, 6], [892.9, 893.6, 9], [895.4, 896.2, 12], [897.6, 898.4, 15], [900.0, 900.8, 16], [905.2, 906.8, 20],
];
const tempAt = (t: number) => {
  let v = 4;
  v += 14 * up(t, 59.0, 60.4) * (1 - up(t, 61.0, 62.3));
  for (const [a, b, to] of STEPS) if (t >= a) v = t >= b ? to : v + (to - v) * up(t, a, b);
  return v;
};
// qué puesto está "en escena" (su cartel se ilumina)
const BANCO: [number, number][] = [[120.0, 228.0], [228.0, 346.5], [346.5, 478.0], [478.0, 628.5], [628.5, 738.5], [738.5, 834.5], [834.5, 884.0]];

export const ST = (t: number): Estado => {
  const signs = Array.from({ length: 7 }, (_, i) => up(t, 40.3 + i * 0.42, 40.65 + i * 0.42));
  const signHi = Array.from({ length: 7 }, (_, i) => win(t, 70.5 + i * 0.38, 71.0 + i * 0.38, 0.25) + win(t, BANCO[i][0], BANCO[i][1], 0.5)
    + win(t, 886.0 + i * 0.5, 912.0, 0.3) * 0.8);
  const leaks = Math.max(win(t, 20.6, 26.0, 0.6), win(t, 44.6, 47.5, 0.4), win(t, 62.6, 64.8, 0.3) * 1.3);
  const snake = up(t, 188.2, 190.4);
  const fins = up(t, 286.2, 289.8), bricks = up(t, 407.6, 411.0);
  const fire = Math.max(win(t, 57.6, 60.5, 0.6), win(t, 86.9, 92.4, 0.5), win(t, 119.2, 124.5, 1.0), win(t, 219.4, 336.6, 0.8), win(t, 384.0, 426.2, 0.8), win(t, 845.0, 862.0, 0.8), win(t, 913.0, 1000.0, 0.8));
  const f1 = 0.35 + 0.65 * up(t, 8.2, 10.6);
  return {
    fire,
    temp: tempAt(t),
    frost: f1 * (1 - 0.3 * up(t, 209, 213)) * (1 - 0.35 * up(t, 436, 440)) * (1 - 0.6 * up(t, 905, 909)),
    coldIn: (0.55 + 0.45 * win(t, 62.6, 64.8, 0.3) + 0.45 * win(t, 141.0, 157.0, 0.5)) * (1 - 0.95 * snake),
    snake, hose: up(t, 203.9, 205.6),
    leakWin: Math.max(leaks, win(t, 150.0, 157.5, 0.5) * (1 - snake)), leakFlue: Math.max(leaks, win(t, 223.6, 266.0, 0.6), win(t, 286, 336.5, 0.5) * 0.35, win(t, 913.0, 1000.0, 0.6) * 0.5),
    goal: up(t, 38.9, 39.8),
    fins, finHeat: fins * win(t, 288.0, 336.5, 0.6) + fins * win(t, 913.0, 1000.0, 0.6) * 0.6,
    bricks, brickHeat: bricks * (up(t, 412.0, 425.0) * (1 - 0.45 * up(t, 426.0, 446.0))), brickFlow: bricks * win(t, 411.5, 425.5, 0.6),
    brick7: up(t, 850.8, 851.8), brick7Heat: up(t, 851.5, 856.0) * (1 - up(t, 862.0, 863.0)),
    solar: up(t, 503.6, 505.6), cans: up(t, 532.4, 535.4), paint: up(t, 535.6, 538.4), glass: up(t, 541.9, 543.3),
    solarFlow: win(t, 565.5, 578.0, 0.6),
    jugs: up(t, 697.8, 700.6), tent: up(t, 768.0, 771.0), blankets: up(t, 778.9, 782.5), warmBed: up(t, 797.0, 806.0),
    signs, signHi,
    lamp: 0.7 + 0.3 * up(t, 92.6, 94.5),
    warm: 0.25 * win(t, 57.6, 61.0, 0.8) + 0.5 * cl((tempAt(t) - 5) / 15) * (t > 120 ? 1 : 0),
    // la guía: CTA1 (Manual 2 pág. 55) y CTA2 (Manual 1 pág. 71)
    books: up(t, 92.6, 93.6) * (1 - up(t, 119.0, 119.6)) + up(t, 450.5, 451.3) * (1 - up(t, 469.6, 470.2)),
    row: t < 300 ? up(t, 96.7, 98.2) : up(t, 451.3, 452.3),
    hero: t < 300 ? up(t, 101.7, 102.8) : up(t, 452.3, 453.3),
    open: t < 300 ? up(t, 104.0, 105.0) * (1 - up(t, 118.0, 118.9)) : up(t, 453.3, 454.3) * (1 - up(t, 466.0, 467.0)),
    set: t < 300 ? "m2" : "m1",
    hi: t < 300 ? [up(t, 106.1, 106.6), up(t, 109.3, 109.8), up(t, 111.8, 112.3), up(t, 114.8, 115.3)] : [up(t, 454.6, 455.3), up(t, 456.9, 457.6), up(t, 458.6, 459.3), 0],
    mini: t < 300 ? up(t, 114.8, 116.9) : 0,
  };
};
