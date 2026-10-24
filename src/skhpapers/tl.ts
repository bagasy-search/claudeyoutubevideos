// skhpapers · LÍNEA DE TIEMPO del mundo (segundos GLOBALES de la locución, anclados a palabras con at()).
// KEYS = la única cámara (sin cortes). ST(t) = el estado de la casa de papel en ese instante.
import { at } from "./lib";
import { PILES } from "./piles";
export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };

const pileF = (i: number) => {
  const q = PILES[i].p;
  return { p: [q[0] + 0.5, 0.72, q[2] + 0.95], l: [q[0], 0.22, q[2]], fov: 40 };
};
// encuadres con nombre
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  wideDusk: { p: [0.9, 1.55, 3.9], l: [-0.3, 0.75, -1.2], fov: 46 },
  wideDay: { p: [0.4, 1.7, 3.7], l: [-0.1, 0.9, -1.4], fov: 48 },
  high: { p: [0.3, 2.3, 2.9], l: [-0.1, 0.1, -0.7], fov: 52 },
  tatamiLow: { p: [1.5, 0.55, 1.75], l: [-0.6, 0.35, -0.9], fov: 46 },
  tansu: { p: [-1.45, 1.05, 1.15], l: [-2.4, 0.6, 0.5], fov: 42 },
  tansuClose: { p: [-1.75, 0.75, 0.75], l: [-2.3, 0.45, 0.5], fov: 40 },
  envelope: { p: [-1.85, 1.25, 0.65], l: [-2.27, 1.0, 0.32], fov: 36 },
  desk: { p: [-0.48, 1.05, -0.78], l: [-0.62, 0.3, -1.62], fov: 42 },
  folder: { p: [-0.6, 0.78, -1.1], l: [-0.68, 0.3, -1.6], fov: 38 },
  table: { p: [1.35, 0.95, 1.35], l: [0.35, 0.36, 0.05], fov: 42 },
  kiri: { p: [0.85, 0.72, 0.6], l: [0.42, 0.36, 0.1], fov: 36 },
  cups: { p: [0.75, 0.68, 0.45], l: [0.15, 0.36, -0.2], fov: 38 },
  garden: { p: [1.4, 1.35, 2.7], l: [3.9, 0.8, -0.5], fov: 46 },
  drum: { p: [3.4, 1.05, 2.3], l: [4.65, 0.55, 0.95], fov: 42 },
  basket: { p: [2.55, 0.85, 2.35], l: [3.35, 0.3, 1.45], fov: 40 },
  engawa: { p: [1.9, 1.05, 2.4], l: [3.8, 0.6, 0.0], fov: 46 },
  phone: { p: [-1.5, 0.72, -0.62], l: [-2.12, 0.4, -1.3], fov: 40 },
  tokonoma: { p: [1.35, 1.2, -0.7], l: [1.85, 1.3, -2.55], fov: 42 },
  fusuma: { p: [-0.5, 1.15, 0.3], l: [-2.78, 1.0, -0.4], fov: 44 },
  ema: { p: [-0.75, 1.45, 0.25], l: [-0.95, 1.72, -2.1], fov: 58 },
  ...Object.fromEntries(Array.from({ length: 11 }, (_, i) => ["emaI" + i, { p: [-2.6 + i * 0.33, 1.5, -1.05], l: [-2.6 + i * 0.33, 1.7, -2.1], fov: 40 }])),
  ...Object.fromEntries(Array.from({ length: 11 }, (_, i) => ["pile" + i, pileF(i)])),
};
const K = (t: number, n: string, push = 0, arc?: number): Key => {
  const f = F[n]; const p = f.p.map((v, i) => v + (f.l[i] - v) * push);
  return { t, p, l: f.l, fov: f.fov - push * 6, arc };
};

// ---- anclas ----
const W = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven"];
export const R = W.map((w) => at("rule number " + w, 150));       // arranque de cada regla
export const A = {
  daughter: at("now imagine your daughter"),
  nine: at("nine out of every ten"),
  osaka: at("in osaka in two weeks"),
  bags41: at("forty-one bags of paper"),
  lost: at("the one thing i lost"),
  eleven: at("eleven japanese rules i follow"),
  blue: at("the one blue folder"),
  doris: at("my neighbor doris did not believe"),
  subscribe: at("press subscribe and the little bell"),
  oldest: at("what is the oldest piece of paper"),
  open: at("let us open the drawer"),
  seizen: at("seizen seiri"),
  fumiko: at("my mother fumiko"),
  tansu: at("we call a tansu"),
  everyDrawer: at("every drawer was paper"),
  envelope: at("a brown envelope that said nothing"),
  heaviest: at("paper is the heaviest thing"),
  ninety: at("will throw away ninety percent of it"),
  rightTen: at("the right ten percent"),
  folder: at("so i have one folder"),
  kiri: at("a kiri box"),
  burned: at("we burned the others in the garden"),
  invited: at("i invited doris"),
  mistakes: at("mistake number one"),
  never: at("let me tell you three things my mother never did"),
  whatIn: at("what was in the brown envelope"),
  day9: at("we found it on day nine"),
  routine: at("let me give you my whole paper week"),
  comments: at("some of you asked me questions"),
  recap: at("so here are the eleven rules again"),
  close: at("my mother left us forty-one bags"),
  tonight: at("so tonight only one thing dear"),
  comment: at("and tell me in the comments what is the one thing"),
  next: at("if you want the next step"),
};
export const OPEN_FIRST = at("open this first", A.recap - 400);
export const RECAP = ["one start with", "two paper does", "three the manuals", "four a receipt", "five keep the person", "six one blue", "seven read the letters", "eight give the", "nine decide yourself", "ten the", "and eleven write"].map((p) => at(p, A.recap));
// fin aproximado de cada regla = arranque de la siguiente (la 11 termina en los errores)
export const RE = [...R.slice(1), A.mistakes];

// ---- la cámara ----
const keys: Key[] = [];
const push = (t: number, n: string, hold: number, pz = 0.1, arc?: number) => { keys.push(K(t, n, 0, arc), K(t + hold, n, pz)); };
// gancho: el cajón / la casa al atardecer
push(0, "tansuClose", 4.0, 0.08); push(A.daughter, "tansu", 4.5, 0.1); push(A.nine, "high", 4, 0.08);
push(A.osaka, "wideDusk", 5, 0.1, 0.03); push(A.bags41 + 1.5, "garden", 4, 0.06); push(A.lost, "envelope", 4, 0.12);
push(A.eleven, "ema", 6, 0.06); push(A.blue - 1.0, "desk", 4, 0.1); push(A.doris, "table", 5, 0.1);
push(A.subscribe, "cups", 5, 0.1); push(A.oldest, "tokonoma", 5, 0.08); push(A.open, "tansuClose", 3, 0.12);
// historia
push(A.seizen, "wideDay", 6, 0.08, 0.04); push(A.fumiko, "fusuma", 5, 0.08); push(A.tansu, "tansu", 6, 0.08);
push(A.everyDrawer, "tansuClose", 7, 0.12); push(A.envelope, "envelope", 5, 0.14); push(A.heaviest, "high", 7, 0.1);
push(A.ninety, "wideDay", 6, 0.08); push(A.rightTen, "ema", 4, 0.05);
// cada regla: el ema que gira → su pila → el resto del tramo alterna planos del tema
const THEME: string[][] = [
  ["pile0", "basket", "wideDay", "engawa", "high"],          // 1 revistas
  ["basket", "pile1", "engawa", "table", "phone"],            // 2 genkan / correo
  ["pile2", "tatamiLow", "high", "pile2", "wideDay"],         // 3 manuales
  ["pile3", "cups", "desk", "pile3", "tatamiLow"],            // 4 recibos
  ["pile4", "tansu", "tokonoma", "pile4", "wideDay"],         // 5 tarjetas
  ["folder", "pile5", "desk", "folder", "phone"],             // 6 carpeta azul
  ["pile6", "kiri", "table", "kiri", "tatamiLow"],            // 7 cartas
  ["pile7", "tansuClose", "table", "pile7", "high"],          // 8 los chicos
  ["pile8", "drum", "garden", "pile8", "wideDay"],            // 9 diarios
  ["pile9", "cups", "table", "pile9", "garden"],              // 10 algún día
  ["envelope", "folder", "tansu", "envelope", "wideDay"],     // 11 la carta
];
R.forEach((r, i) => {
  const end = RE[i], seg = end - r;
  push(r - 0.2, "emaI" + i, 3.4, 0.06);
  const n = THEME[i].length, step = (seg - 4) / n;
  THEME[i].forEach((f, j) => push(r + 3.6 + j * step, f, step * 0.92, 0.12, j % 2 ? 0.03 : undefined));
});
push(A.mistakes, "high", 9, 0.1); push(A.mistakes + 10, "tatamiLow", 9, 0.1); push(A.mistakes + 20, "pile10", 9, 0.12); push(A.mistakes + 30, "desk", 9, 0.1);
push(A.never, "tansu", 8, 0.1); push(A.whatIn, "envelope", 10, 0.16); push(A.day9, "tansuClose", 8, 0.1);
push(A.routine, "wideDay", 10, 0.08, 0.04); push(A.routine + 11, "basket", 9, 0.1); push(A.routine + 21, "high", 9, 0.1);
push(A.comments, "table", 10, 0.1); push(A.comments + 11, "cups", 10, 0.1);
push(A.recap - 0.3, "ema", A.close - A.recap - 1, 0.16);
push(A.close, "wideDay", 8, 0.1, 0.03); push(A.close + 9, "garden", 7, 0.08); push(A.tonight, "tansuClose", 8, 0.12);
push(A.comment, "table", 7, 0.1); push(A.next, "wideDay", 12, -0.15);
keys.sort((a, b) => a.t - b.t);
// dos claves casi juntas se pisan: se queda la más nueva
export const KEYS: Key[] = keys.filter((k, i) => i === keys.length - 1 || keys[i + 1].t - k.t > 0.15).concat([{ t: 5000, ...F.wideDay }]);

const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
/** sube de 0 a 1 entre a y b */
export const up = (t: number, a: number, b: number) => sm((t - a) / (b - a));
/** 1 entre a y b (con rampas de r segundos) */
export const win = (t: number, a: number, b: number, r = 0.4) => up(t, a - r, a) * (1 - up(t, b, b + r));

export type Estado = {
  day: number; lamp: number; ema: number[]; emaAt: number[]; emaF: number[]; emaHi: number[]; shade: number; steam: number; guests: number;
  piles: number[]; pileHi: number[]; drawer: number; drawerEmpty: number; env: number; envHi: number; envOpen: number;
  folder: number; folderHi: number; openFirst: number; openFirstHi: number; kiri: number; kiriHi: number; kiriLid: number; fire: number;
};
const EMA_AT = Array.from({ length: 11 }, (_, i) => A.eleven - 0.4 + i * 0.2);
export const ST = (t: number): Estado => {
  const day = 0.2 + 0.8 * up(t, A.seizen - 2, A.seizen + 4);
  return {
    day, lamp: 1 - 0.5 * day,
    ema: EMA_AT.map((a) => up(t, a, a + 0.5)), emaAt: EMA_AT,
    emaF: R.map((r) => up(t, r + 1.0, r + 1.8)),
    emaHi: R.map((r, i) => Math.min(1, win(t, r - 0.4, r + 4.5, 0.4) + win(t, RECAP[i], RECAP[i] + 4, 0.3))),
    shade: Math.min(1, win(t, A.eleven - 0.5, A.eleven + 6, 0.6) + R.reduce((m, r) => m + win(t, r - 0.8, r + 3.2, 0.5), 0) + win(t, A.recap, A.close - 1, 0.6)),
    steam: 1,
    guests: win(t, A.invited, A.invited + 20, 1.2),
    // la pila de cada regla se va achicando mientras se cuenta la regla; la 11 (todo lo demás) en el cierre
    piles: R.map((r, i) => (i === 10 ? 1 - up(t, A.close, A.tonight) : 1 - up(t, r + 6, RE[i] - 4))),
    pileHi: R.map((r) => win(t, r + 3.4, r + 9, 0.5)),
    // el cajón del gancho se entreabre; con "every drawer was paper" se abren los 4
    drawer: Math.max(0.35 * up(t, 0.2, 1.4), up(t, A.everyDrawer - 0.5, A.everyDrawer + 1.5)),
    drawerEmpty: up(t, A.close, A.tonight),
    env: up(t, A.envelope - 0.3, A.envelope + 0.8),
    envHi: Math.min(1, win(t, A.envelope, A.envelope + 6, 0.5) + win(t, A.whatIn, A.day9 + 6, 0.6)),
    envOpen: up(t, A.whatIn + 2, A.whatIn + 4),
    folder: Math.max(up(t, A.folder - 0.5, A.folder + 0.6), win(t, A.blue - 0.8, A.blue + 4, 0.5)),
    folderHi: Math.min(1, win(t, A.folder - 0.2, A.folder + 8, 0.5) + win(t, A.blue - 0.5, A.blue + 4, 0.5) + win(t, RECAP[5], RECAP[5] + 4, 0.4)),
    openFirst: up(t, OPEN_FIRST - 0.4, OPEN_FIRST + 0.6),
    openFirstHi: win(t, OPEN_FIRST - 0.3, OPEN_FIRST + 6, 0.5),
    kiri: up(t, A.kiri - 0.6, A.kiri + 0.6),
    kiriHi: win(t, A.kiri - 0.4, A.kiri + 6, 0.5),
    kiriLid: win(t, A.kiri + 0.8, A.kiri + 5, 0.6),
    fire: win(t, A.burned, A.burned + 22, 1.0),
  };
};
