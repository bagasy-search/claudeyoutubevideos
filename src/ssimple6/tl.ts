// ssimple6 · LÍNEA DE TIEMPO del mundo (segundos GLOBALES de la locución, anclados a palabras con at()).
// KEYS = la única cámara (sin cortes). ST(t) = el estado de la casa en ese instante.
import { at, atEnd } from "./lib";
export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

// encuadres con nombre
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  phoneClose: { p: [-1.5, 0.72, -0.62], l: [-2.12, 0.4, -1.3], fov: 40 },
  phoneIn: { p: [-1.66, 0.62, -0.82], l: [-2.12, 0.42, -1.3], fov: 38 },
  phoneMid: { p: [-0.95, 1.0, 0.2], l: [-2.0, 0.45, -1.25], fov: 44 },
  wideNight: { p: [0.9, 1.55, 3.9], l: [-0.3, 0.75, -1.2], fov: 46 },
  tansu: { p: [-1.55, 1.15, 1.05], l: [-2.5, 1.05, 0.55], fov: 40 },
  desk: { p: [-0.48, 1.05, -0.78], l: [-0.62, 0.3, -1.62], fov: 42 },
  wideDay: { p: [0.4, 1.7, 3.7], l: [-0.1, 0.9, -1.4], fov: 48 },
  ema: { p: [-0.77, 1.45, 0.05], l: [-0.77, 1.72, -2.1], fov: 54 },
  ema3: { p: [-1.38, 1.5, -1.05], l: [-1.51, 1.72, -2.1], fov: 44 },
  table: { p: [1.35, 0.95, 1.35], l: [0.35, 0.36, 0.05], fov: 42 },
  booksTop: { p: [0.78, 1.18, 0.9], l: [0.33, 0.34, -0.02], fov: 40 },
  page: { p: [0.34, 0.93, 0.38], l: [0.33, 0.335, 0.07], fov: 36 },
  garden: { p: [1.4, 1.35, 2.7], l: [3.9, 0.8, -0.5], fov: 46 },
  // ---- del resto ----
  high: { p: [0.3, 2.3, 2.9], l: [-0.1, 0.1, -0.7], fov: 52 },
  tatamiLow: { p: [1.5, 0.55, 1.75], l: [-0.6, 0.35, -0.9], fov: 46 },
  deskClose: { p: [-0.5, 0.78, -1.2], l: [-0.62, 0.3, -1.6], fov: 38 },
  fusuma: { p: [-0.5, 1.15, 0.3], l: [-2.78, 1.0, -0.4], fov: 44 },
  phoneClock: { p: [-0.85, 1.12, 0.15], l: [-2.5, 0.95, -1.1], fov: 48 },
  cups: { p: [0.85, 0.68, 0.65], l: [0.35, 0.36, 0.05], fov: 36 },
  gate: { p: [3.2, 1.15, 1.9], l: [5.8, 0.8, 1.05], fov: 44 },
  step: { p: [2.9, 0.8, 2.2], l: [3.75, 0.12, 1.2], fov: 40 },
  engawa: { p: [1.9, 1.05, 2.4], l: [3.8, 0.6, 0.0], fov: 46 },
  tokonoma: { p: [1.35, 1.2, -0.7], l: [1.85, 1.3, -2.55], fov: 42 },
  ...Object.fromEntries(Array.from({ length: 9 }, (_, i) => ["emaI" + i, { p: [-2.25 + i * 0.37, 1.5, -1.05], l: [-2.25 + i * 0.37, 1.7, -2.1], fov: 40 }])),
};
const K = (t: number, n: string, push = 0, arc?: number): Key => {
  const f = F[n]; const p = f.p.map((v, i) => v + (f.l[i] - v) * push);
  return { t, p, l: f.l, fov: f.fov - push * 6, arc };
};

// ---- anclas (palabras) del minuto 1 ----
export const A = {
  rings: 0,
  hear: at("you hear yourself say it"),
  oh: at("oh so you finally"),
  quiet: at("and the line goes quiet"),
  missed: at("you missed him"),
  came: at("but that is what came out"),
  m1976: at("my mother said that exact"),
  y1976: at("1976"),
  silence: at("she heard the silence"),
  osaka: at("in osaka"),
  never: at("that she would never say it again"),
  neverDid: at("and she never did"),
  lived: at("she lived to 101"),
  sixty: at("after she turned 60"),
  nine: at("she stopped saying nine things"),
  every: at("every single day"),
  allNine: at("all nine"),
  two: at("two-word sentence"),
  mailman: at("to the mailman"),
  honest: at("one honest thing"),
  promise: at("i cannot promise you"),
  nobody: at("nobody can"),
  clinic: at("not advice from a clinic"),
  talked: at("one old woman talked"),
  coming: at("kept coming back"),
  lastYear: at("the very last year"),
  wrote: at("my mother wrote many"),
  setOf: at("set of books"),
  osakaWay: at("the osaka way"),
  day101: at("the 101 day"),
  p45: at("on page 45"),
  noKindly: at("saying no kindly"),
  exact: at("the exact words"),
  asked: at("asked too much"),
  matters: at("why that page matters"),
  n3: at("number 3"),
  link: at("the link is in"),
  first: at("first line"),
  youKnow: at("you know me"),
  born: at("i was born in osaka"),
  fourth: at("the fourth of five"),
  america: at("came to america"),
  y1970: at("1970"),
  s79: at("i am 79"),
  y1915: at("born in 1915"),
};
export const MIN1_END = 129.5;

export const KEYS: Key[] = [
  // la llamada (noche): el teléfono suena en su mesita
  K(0, "phoneClose"), K(3.96, "phoneClose"), K(A.hear, "phoneIn"), K(A.oh, "phoneIn", 0.04),
  K(A.oh + 2.6, "phoneMid"), K(16.8, "phoneMid", 0.06),
  // (avatar) → toda la casa de noche
  K(21.75, "wideNight"), K(A.m1976, "wideNight", 0.08),
  K(A.m1976 + 1.0, "tansu"), K(A.silence - 0.05, "tansu", 0.1),
  K(A.silence + 1.1, "phoneMid", 0.05), K(33.58, "phoneMid", 0.12),
  // (avatar) → el escritorio de caligrafía: la frase se tacha
  K(37.72, "desk"), K(A.lived - 0.1, "desk", 0.12),
  // amanece: los 101
  K(A.lived + 2.2, "wideDay", 0, 0.05), K(49.47, "wideDay", 0.1),
  // (avatar) → los 9 ema
  K(55.31, "ema"), K(A.two, "ema", 0.06), K(66.56, "ema", 0.1),
  // (avatar) → la mesa del té
  K(71.53, "table"), K(82.29, "table", 0.14),
  // (avatar) → CTA1: escritorio → los libritos → la pág. 45
  K(85.83, "desk", 0.05), K(A.setOf - 0.2, "desk", 0.12), K(A.setOf + 1.0, "booksTop"), K(A.day101, "booksTop", 0.08),
  K(A.p45 + 0.9, "page"), K(99.29, "page", 0.04),
  K(103.73, "page", 0.06), K(A.matters, "page", 0.12), K(A.n3, "ema3"), K(A.link + 0.5, "ema3", 0.06),
  K(A.first + 1.0, "booksTop", 0.05), K(115.84, "booksTop", 0.1),
  // (avatar) → el jardín: la línea de su vida
  K(119.29, "garden"), K(MIN1_END, "garden", 0.1),
  // ===== EL RESTO (cada tramo de mundo arranca 0,45 s antes de que termine la ventana del avatar: la tinta ya lo muestra) =====
  K(132.85, "wideDay"), K(140.4, "high"), K(146.5, "high", 0.1),
  K(150.45, "table"), K(161.5, "table", 0.12),
  K(166.05, "wideDay"), K(172.8, "wideDay", 0.08), K(173.8, "tansu"), K(176.9, "tansu", 0.08), K(177.9, "garden"), K(178.9, "garden", 0.04),
  K(183.85, "garden", 0.04), K(186.4, "tatamiLow"), K(191.4, "tatamiLow", 0.06), K(192.2, "emaI0"), K(195.3, "emaI0", 0.08),
  K(199.55, "desk"), K(211, "desk", 0.1),
  K(214.75, "fusuma"), K(222.8, "fusuma", 0.06), K(224.5, "desk", 0.04), K(228.6, "desk", 0.1),
  K(238.6, "deskClose"), K(244.5, "deskClose", 0.1),
  K(249.15, "fusuma"), K(256.6, "fusuma", 0.08), K(257.4, "emaI1"), K(259, "emaI1", 0.06),
  K(262.75, "phoneMid"), K(269.0, "phoneMid", 0.1), K(276.6, "phoneIn"),
  K(279.55, "phoneMid", 0.05), K(291.9, "phoneMid", 0.18),
  K(296.25, "wideDay"), K(304.8, "wideDay", 0.1), K(305.6, "phoneClock"), K(309.8, "phoneClock", 0.08),
  K(317.3, "phoneClock"), K(324.8, "phoneClock", 0.12), K(325.6, "emaI2"), K(326.3, "emaI2", 0.04),
  K(330.55, "wideDay"), K(341.5, "wideDay", 0.14),
  K(352.1, "table"), K(360.9, "table", 0.12),
  K(365.15, "deskClose"), K(377.4, "deskClose", 0.12),
  K(385.0, "table"), K(392.7, "table", 0.12),
  K(397.75, "page"), K(403.5, "page", 0.06), K(404.5, "booksTop"), K(409.7, "booksTop", 0.08),
  K(414.05, "garden", 0.05), K(416.2, "emaI3"), K(419.5, "emaI3", 0.06), K(420.5, "wideDay"), K(424.3, "wideDay", 0.08),
  K(430.8, "high"), K(440.6, "high", 0.1),
  K(446.15, "tansu"), K(453.8, "tansu", 0.1), K(454.6, "table"), K(459.8, "table", 0.1),
  K(467.8, "wideDay"), K(474.0, "wideDay", 0.08), K(474.6, "emaI4"), K(476, "emaI4", 0.04),
  K(481.25, "high"), K(494, "high", 0.1),
  K(499.05, "tatamiLow"), K(511.4, "tatamiLow", 0.12),
  K(515.35, "table"), K(525.9, "table", 0.14),
  K(530.75, "tatamiLow", 0.05), K(535.6, "tatamiLow", 0.1), K(539.4, "ema"), K(543.3, "ema", 0.06),
  K(547.15, "page"), K(559.8, "page", 0.08),
  K(563.15, "booksTop"), K(575.9, "booksTop", 0.1),
  K(581.25, "wideDay"), K(587.8, "wideDay", 0.08), K(588.6, "emaI5"), K(593.2, "emaI5", 0.06),
  K(597.45, "cups"), K(605.8, "cups", 0.1), K(606.6, "garden"), K(608.4, "garden", 0.04),
  K(618.4, "cups"), K(626.4, "cups", 0.12),
  K(631.55, "table"), K(634.6, "table", 0.05), K(640.4, "cups"), K(643.3, "cups", 0.08),
  K(650.3, "cups", 0.08), K(655.8, "cups", 0.16),
  K(659.55, "wideDay"), K(666.2, "wideDay", 0.06), K(666.9, "emaI6"), K(669.8, "emaI6", 0.05), K(670.8, "gate"), K(672.7, "gate", 0.04),
  K(676.85, "gate"), K(687.4, "gate", 0.1),
  K(691.15, "engawa"), K(701.0, "engawa", 0.08), K(702.7, "gate"),
  K(708.35, "gate", 0.06), K(711.9, "gate", 0.1), K(715.4, "garden"), K(720.1, "garden", 0.08),
  K(724.85, "wideDay"), K(735.6, "wideDay", 0.14),
  K(744.1, "gate"), K(748.4, "gate", 0.06), K(749.1, "emaI7"), K(753.8, "emaI7", 0.06),
  K(756.85, "high"), K(766.4, "high", 0.1),
  K(773.55, "tansu"), K(784.9, "tansu", 0.12),
  K(788.55, "table"), K(801, "table", 0.14),
  K(805.85, "emaI8"), K(810.0, "emaI8", 0.06), K(811.0, "phoneMid"), K(817.7, "phoneMid", 0.12),
  K(821.05, "wideDay"), K(829.8, "wideDay", 0.1),
  K(836.65, "step"), K(850.4, "step", 0.12),
  K(853.55, "wideDay"), K(863.7, "wideDay", 0.1),
  K(868.35, "engawa"), K(882.9, "engawa", 0.12),
  K(889.5, "cups"), K(893.3, "cups", 0.08),
  K(903.25, "phoneMid"), K(905.0, "phoneMid", 0.05), K(909.4, "wideDay"), K(912.4, "wideDay", 0.06),
  K(915.55, "ema"), K(927.3, "ema", 0.05),
  K(931.05, "ema", 0.05), K(942.2, "ema", 0.1),
  K(945.35, "ema", 0.1), K(959, "ema", 0.14),
  K(964.05, "ema", 0.14), K(976.7, "ema", 0.18),
  K(981.25, "tokonoma"), K(990.7, "tokonoma", 0.12),
  K(994.65, "wideDay"), K(1002.0, "wideDay", 0.05), K(1006.4, "wideDay", 0.06), K(1009.8, "wideDay", 0.1),
  K(1013.75, "phoneIn"), K(1016.4, "phoneMid"), K(1024.1, "phoneMid", 0.1),
  K(1027.55, "booksTop"), K(1031.8, "booksTop", 0.06), K(1032.6, "page"), K(1036.9, "page", 0.06),
  K(1044.1, "cups"), K(1046.3, "table"), K(1048.0, "table", 0.05), K(1053.5, "wideDay", -0.15),
  { t: 5000, ...F.wideDay },
];

const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
/** sube de 0 a 1 entre a y b */
export const up = (t: number, a: number, b: number) => sm((t - a) / (b - a));
/** 1 entre a y b (con rampas de r segundos) */
export const win = (t: number, a: number, b: number, r = 0.4) => up(t, a - r, a) * (1 - up(t, b, b + r));

export type Estado = {
  day: number; lamp: number; phoneLight: number; ring: number; lift: number;
  ema: number[]; emaAt: number[]; ema9: number; emaHi: number[]; steam: number; guests: number;
  books: number; row: number; shade: number; hero: number; open: number; hi: number[];
  spread: number; emaF: number[]; door: number; clock: number; wrap: number; kin: number; ice: number; cranes: number;
};
// los libritos vuelven 3 veces en el resto: pág. 45 (repaso), pág. 4 (CTA2) y el cierre
const BW = [{ a: 393.0, b: 409.7, sp: 0 }, { a: 543.3, b: 575.9, sp: 1 }, { a: 1028.0, b: 1036.9, sp: 0 }];
// cuándo se presenta cada número; cuándo da vuelta cada ema (muestra la frase NUEVA): al presentar el siguiente; el 9 cuando dice la verdad
export const NUM_AT = [192.0, 257.1, 325.4, 416.8, 476.5, 588.3, 666.8, 748.9, 804.7];
const FLIP_AT = [257.6, 325.7, 416.9, 474.9, 588.9, 667.2, 749.3, 806.6, 856.0];
export const RECAP = [919, 926, 930, 940, 946, 954, 960, 966, 972].map((a, i) => at(i === 0 ? "one" : String(i + 1), a));
// la llamada del domingo a las 7 (el teléfono vuelve a sonar)
export const RING2: [number, number] = [318.9, 323.6];
const EMA_AT = Array.from({ length: 9 }, (_, i) => A.allNine - 1.6 + i * 0.24);

export const ST = (t: number): Estado => ({
  day: up(t, A.lived - 0.3, A.lived + 2.8),
  lamp: 1 - 0.55 * up(t, A.lived, A.lived + 3),
  phoneLight: win(t, 0, 16.8, 0.5) + win(t, A.silence, 33.6, 0.5),
  ring: t < A.hear + 1.2 || (t >= RING2[0] && t < RING2[1]) ? 1 : 0,
  lift: up(t, A.hear + 1.25, A.hear + 1.9) * (1 - up(t, A.silence + 3.5, A.silence + 4.2)),
  ema: EMA_AT.map((a) => up(t, a, a + 0.5)),
  emaAt: EMA_AT,
  ema9: up(t, A.two - 0.1, A.two + 0.7) * (1 - up(t, 67.0, 67.6)),
  emaHi: Array.from({ length: 9 }, (_, i) => Math.min(1, (i === 8 ? win(t, A.two, 66.5, 0.4) : 0) + (i === 2 ? win(t, A.n3, A.link + 0.6, 0.4) : 0)
    + win(t, NUM_AT[i] - 0.4, NUM_AT[i] + 5, 0.4) + win(t, RECAP[i], RECAP[i] + 5.5, 0.3))),
  steam: 1,
  shade: Math.min(1, win(t, 55.0, 67.0, 0.6) + win(t, A.n3 - 0.6, A.first + 1.2, 0.6) + NUM_AT.reduce((m, a) => m + win(t, a - 1.2, a + 3.2, 0.5), 0) + win(t, 915.0, 977.0, 0.6)),
  guests: up(t, A.coming, A.coming + 1.6),
  ...bookSt(t),
  hi: [up(t, 103.9, 104.5), up(t, A.asked - 0.3, A.asked + 0.4), up(t, A.asked + 0.5, A.asked + 1.2), up(t, A.matters, A.matters + 0.8)],
  emaF: FLIP_AT.map((a) => up(t, a, a + 0.8)),
  // la fusuma: abierta -> se cierra de golpe ("cerrarse una puerta en la cara") -> la reabre (dijo que si) · despues: pared / puerta entreabierta
  door: t < 240 ? 0.55 * (1 - up(t, 219.95, 220.15)) + 0.55 * up(t, 222.7, 223.6) : 0.32 * up(t, 253.9, 255.0),
  clock: up(t, 317.4, 319.0),
  wrap: t < 619 ? up(t, 592.0, 593.0) : 1 - up(t, 619.0, 620.6),
  kin: Math.min(2, up(t, 642.4, 642.6) + up(t, 650.4, 651.6)),
  ice: win(t, 829.0, 851.0, 0.8),
  cranes: up(t, 889.9, 891.4),
});
function bookSt(t: number) {
  if (t < 125) return { books: up(t, A.setOf, A.setOf + 0.9) * (1 - up(t, 119.0, 119.4)), row: up(t, A.osakaWay - 0.2, A.osakaWay + 0.8), hero: up(t, A.day101, A.day101 + 1.0), open: up(t, A.p45 + 0.2, A.p45 + 1.2), spread: 0 };
  const w = BW.find((x) => t >= x.a - 1 && t < x.b + 1);
  if (!w) return { books: 0, row: 0, hero: 0, open: 0, spread: 0 };
  return { books: up(t, w.a, w.a + 0.9) * (1 - up(t, w.b + 0.05, w.b + 0.5)), row: up(t, w.a + 0.3, w.a + 1.2), hero: up(t, w.a + 1.3, w.a + 2.3), open: up(t, w.a + 2.4, w.a + 3.4), spread: w.sp };
}
