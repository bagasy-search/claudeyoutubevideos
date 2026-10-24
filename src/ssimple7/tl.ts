// ssimple7 · LÍNEA DE TIEMPO del mundo (segundos GLOBALES de la locución, anclados a palabras con at()).
// UNA cámara: los tramos de mundo salen de los huecos entre ventanas del avatar (avwin.json). Cada sección del guion
// tiene su lista de encuadres; la cámara VIAJA mientras habla el avatar (no se ve) y empuja lento mientras se ve el mundo.
// FORCE = encuadres obligados en frases puntuales (CTA, el número de cada ema, el cajón…). ST(t) = el estado de la casa.
import { at } from "./lib";
import AVW from "./avwin.json";
export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };
export const END = 1804.9;

export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  phoneIn: { p: [-1.66, 0.62, -0.82], l: [-2.12, 0.42, -1.3], fov: 38 },
  phoneMid: { p: [-0.95, 1.0, 0.2], l: [-2.0, 0.45, -1.25], fov: 44 },
  wideNight: { p: [0.9, 1.55, 3.9], l: [-0.3, 0.75, -1.2], fov: 46 },
  tansu: { p: [-1.55, 1.15, 1.05], l: [-2.5, 1.05, 0.55], fov: 40 },
  desk: { p: [-0.48, 1.05, -0.78], l: [-0.62, 0.3, -1.62], fov: 42 },
  deskClose: { p: [-0.5, 0.78, -1.2], l: [-0.62, 0.3, -1.6], fov: 38 },
  wideDay: { p: [0.4, 1.7, 3.7], l: [-0.1, 0.9, -1.4], fov: 48 },
  ema: { p: [-0.77, 1.45, 0.05], l: [-0.77, 1.72, -2.1], fov: 54 },
  table: { p: [1.35, 0.95, 1.35], l: [0.35, 0.36, 0.05], fov: 42 },
  booksTop: { p: [0.78, 1.18, 0.9], l: [0.33, 0.34, -0.02], fov: 40 },
  page: { p: [0.34, 0.93, 0.38], l: [0.33, 0.335, 0.07], fov: 36 },
  garden: { p: [1.4, 1.35, 2.7], l: [3.9, 0.8, -0.5], fov: 46 },
  high: { p: [0.3, 2.3, 2.9], l: [-0.1, 0.1, -0.7], fov: 52 },
  tatamiLow: { p: [1.5, 0.55, 1.75], l: [-0.6, 0.35, -0.9], fov: 46 },
  fusuma: { p: [-0.5, 1.15, 0.3], l: [-2.78, 1.0, -0.4], fov: 44 },
  cups: { p: [0.85, 0.68, 0.65], l: [0.35, 0.36, 0.05], fov: 36 },
  gate: { p: [3.2, 1.15, 1.9], l: [5.8, 0.8, 1.05], fov: 44 },
  step: { p: [2.9, 0.8, 2.2], l: [3.75, 0.12, 1.2], fov: 40 },
  engawa: { p: [1.9, 1.05, 2.4], l: [3.8, 0.6, 0.0], fov: 46 },
  tokonoma: { p: [1.35, 1.2, -0.7], l: [1.85, 1.3, -2.55], fov: 42 },
  // ---- NUEVOS de ssimple7: el futón con la caja laqueada, la radio marrón, el espejo redondo, el cajón, el reloj ----
  futonWide: { p: [0.35, 1.45, 2.7], l: [-1.55, 0.2, 0.55], fov: 46 },
  futonBox: { p: [-0.62, 0.62, 0.78], l: [-1.12, 0.2, 0.12], fov: 36 },
  futonTop: { p: [-1.25, 1.75, 1.35], l: [-1.6, 0.12, 0.55], fov: 44 },
  radio: { p: [-1.62, 1.22, 1.2], l: [-2.42, 1.08, 0.9], fov: 36 },
  mirror: { p: [-1.45, 1.32, 1.75], l: [-2.74, 1.32, 1.45], fov: 40 },
  drawer: { p: [-1.45, 0.95, 1.05], l: [-2.25, 0.55, 0.55], fov: 42 },
  clock: { p: [-1.95, 1.45, -0.55], l: [-2.74, 1.5, -1.0], fov: 34 },
  ...Object.fromEntries(Array.from({ length: 9 }, (_, i) => ["emaI" + i, { p: [-2.25 + i * 0.37, 1.5, -1.05], l: [-2.25 + i * 0.37, 1.7, -2.1], fov: 40 }])),
};
const K = (t: number, n: string, push = 0, arc?: number): Key => {
  const f = F[n]; const p = f.p.map((v, i) => v + (f.l[i] - v) * push);
  return { t, p, l: f.l, fov: f.fov - push * 6, arc };
};

// ---- anclas ----
export const A = {
  lived: at("she lived to 101"),
  nine: at("the nine things my mother"),
  setOf: at("little set of books"),
  day101: at("the book called the 101 day"),
  p38: at("on page 38"),
  twoLines: at("the exact two lines"),
  link1: at("the link is in the first"),
  n1: at("number one she stopped"),
  night1: at("ten minutes before she put"),
  light1: at("and turned off the light"),
  n2: at("number 2 she stopped"), n3: at("number three she stopped"), n4: at("number 4"), n5: at("number five"),
  n6: at("number 6 she stopped"), n7: at("number seven she stopped"), n8: at("number eight she stopped"), n9: at("number nine she stopped"),
  kakebo: at("my mother kept that money"), p72: at("on page 72", 800), link2: at("the link is in the first", 840),
  orange: at("when the light went orange"), day: at("so let me take you through"), four: at("and then at four"),
  seven: at("at seven the news"), lights: at("lights out by ten"), nevers: at("four things my mother never"),
  recap: at("let me give you the nine again"), dollar: at("not one of these costs"), osakaEnd: at("it is all in the osaka way"),
  tonight: at("tonight before you turn off"),
};
// cuándo se presenta cada número (el ema se agranda) y cuándo da vuelta (muestra la frase nueva)
export const NUM_AT = [A.n1, A.n2, A.n3, A.n4, A.n5, A.n6, A.n7, A.n8, A.n9];
const FLIP_AT = [A.n2 - 6, A.n3 - 6, A.n4 - 6, A.n5 - 6, A.n6 - 6, A.n7 - 6, A.n8 - 6, A.n9 - 6, at("now you can go", 1380)];
export const RECAP = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n, i) => at(i === 0 ? "1 she stopped" : (["2", "3", "4", "5", "6", "seven", "eight", "and nine"][i - 1]) + " she stopped", A.recap));

// ---- las secciones: qué encuadres recorre la cámara en cada tramo de mundo ----
const SECT: [number, string[]][] = [
  [0, ["futonWide", "clock", "futonTop", "futonBox", "wideNight"]],
  [A.lived - 1, ["wideDay", "ema", "table", "cups"]],
  [A.setOf - 2, ["booksTop", "page", "booksTop"]],
  [125, ["tansu", "garden", "high", "gate", "table"]],
  [A.n1 - 1, ["futonBox", "futonTop", "clock", "futonWide", "desk", "futonBox", "wideNight", "futonTop"]],
  [A.n2 - 1, ["engawa", "gate", "high", "garden", "wideDay", "tatamiLow"]],
  [A.n3 - 1, ["step", "tatamiLow", "high", "cups", "engawa", "table"]],
  [A.n4 - 1, ["mirror", "tansu", "garden", "mirror", "engawa"]],
  [A.n5 - 1, ["phoneMid", "table", "cups", "phoneIn", "desk", "table", "booksTop", "page"]],
  [A.n6 - 1, ["radio", "wideDay", "tatamiLow", "gate", "radio", "high"]],
  [A.n7 - 1, ["drawer", "tansu", "tatamiLow", "drawer", "high", "fusuma"]],
  [A.n8 - 1, ["wideDay", "gate", "engawa", "phoneMid", "garden", "step"]],
  [A.n9 - 1, ["desk", "deskClose", "gate", "futonBox", "tokonoma", "wideDay", "futonTop"]],
  [A.day - 1, ["garden", "tatamiLow", "table", "gate", "clock", "cups", "radio", "futonBox"]],
  [A.nevers - 1, ["wideNight", "cups", "table", "phoneMid", "fusuma"]],
  [A.recap - 1, ["ema"]],
  [A.dollar - 1, ["cups", "booksTop", "futonBox", "wideNight"]],
];
// encuadres OBLIGADOS (frase → encuadre, push final)
const FORCE: [number, string, number][] = [
  [A.day101 - 0.2, "booksTop", 0.06], [A.p38 + 0.8, "page", 0.05],
  ...NUM_AT.map((a, i) => [a - 0.1, "emaI" + i, 0.06] as [number, string, number]),
  [A.kakebo, "booksTop", 0.06], [A.p72 + 0.7, "page", 0.05],
  [A.osakaEnd, "booksTop", 0.08],
];

const WINS = (AVW as unknown as { win: { ms: number; me: number }[] }).win;
export const SEGS: [number, number][] = [];
{ let prev = 0; for (const w of WINS) { if (w.ms - prev > 0.6) SEGS.push([prev, w.ms]); prev = w.me; } if (END - prev > 0.6) SEGS.push([prev, END]); }
const sectOf = (t: number) => { let i = 0; while (i < SECT.length - 1 && SECT[i + 1][0] <= t) i++; return i; };
const build = (): Key[] => {
  const ks: Key[] = []; const cnt: Record<number, number> = {};
  for (const [a0, b] of SEGS) {
    const a = Math.max(0, a0 - 0.45);
    const forced = FORCE.filter(([ft]) => ft >= a0 - 0.6 && ft < b - 0.8);
    if (forced.length) {
      let t0 = a;
      forced.forEach(([ft, n, push], j) => {
        const tEnd = j + 1 < forced.length ? forced[j + 1][0] - 0.8 : b;
        ks.push(K(Math.max(t0, ft - 0.6), n), K(Math.max(t0 + 0.5, tEnd), n, push)); t0 = tEnd + 0.1;
      });
      continue;
    }
    const si = sectOf(a0 + 0.5), fr = SECT[si][1], j = cnt[si] ?? 0;
    const n1 = fr[j % fr.length];
    if (b - a0 > 9.5 && fr.length > 1) {
      const n2 = fr[(j + 1) % fr.length], mid = (a0 + b) / 2;
      ks.push(K(a, n1), K(mid - 0.4, n1, 0.07), K(mid + 0.9, n2), K(b, n2, 0.09)); cnt[si] = j + 2;
    } else { ks.push(K(a, n1), K(b, n1, 0.1)); cnt[si] = j + 1; }
  }
  ks.sort((x, y) => x.t - y.t);
  const out: Key[] = [];
  for (const k of ks) { if (out.length && k.t <= out[out.length - 1].t + 0.05) k.t = out[out.length - 1].t + 0.05; out.push(k); }
  out.push({ t: 9999, ...F.wideNight });
  return out;
};
export const KEYS: Key[] = build();

const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
export const up = (t: number, a: number, b: number) => sm((t - a) / (b - a));
export const win = (t: number, a: number, b: number, r = 0.4) => up(t, a - r, a) * (1 - up(t, b, b + r));

export type Estado = {
  day: number; dusk: number; lamp: number; phoneLight: number; ring: number; lift: number;
  ema: number[]; emaAt: number[]; ema9: number; emaHi: number[]; steam: number; guests: number;
  books: number; row: number; shade: number; hero: number; open: number; hi: number[]; heroI: number;
  spread: number; emaF: number[]; door: number; clock: number; wrap: number; kin: number; ice: number; cranes: number;
  // nuevos
  hour: number; nbOpen: number; pencil: number; andon: number; radio: number; radioBroken: number; mirror: number;
  drawer: number; env: number; bowl: number; cards: number; blanket: number;
};
// los libritos: CTA1 (The 101 Day, págs. 37-38), CTA2 (el Kakeibo, págs. 71-72), cierre
const BW = [{ a: A.setOf, b: A.link1 + 4.5, hero: 3, sp: 0 }, { a: A.kakebo, b: A.link2 + 3.0, hero: 2, sp: 1 }, { a: A.osakaEnd - 0.4, b: A.tonight - 0.3, hero: 3, sp: 0 }];
const EMA_AT = Array.from({ length: 9 }, (_, i) => A.nine + 0.3 + i * 0.24);
// la noche: el gancho (3 de la mañana), la rutina del cuaderno (#1), la noche del día de la madre, el cierre
const NIGHTS: [number, number][] = [[-5, A.lived], [A.night1 - 4, A.light1 + 30], [A.lights - 12, A.nevers + 20], [A.tonight - 3, 9999]];

export const ST = (t: number): Estado => {
  const night = NIGHTS.reduce((m, [a, b]) => Math.max(m, win(t, a, b, 1.6)), 0);
  const day = 1 - night;
  const dusk = win(t, A.orange - 2, A.orange + 14, 1.5);
  const bk = bookSt(t);
  return {
    day, dusk, lamp: 0.45 + 0.55 * night,
    phoneLight: win(t, A.n5 + 30, A.n5 + 62, 0.6),
    ring: 0, lift: 0,
    ema: EMA_AT.map((a) => up(t, a, a + 0.5)), emaAt: EMA_AT, ema9: 0,
    emaHi: Array.from({ length: 9 }, (_, i) => Math.min(1, win(t, NUM_AT[i] - 0.4, NUM_AT[i] + 6, 0.4) + win(t, RECAP[i] - 0.2, RECAP[i] + 5.5, 0.3))),
    steam: 1,
    shade: Math.min(1, NUM_AT.reduce((m, a) => m + win(t, a - 1.2, a + 3.2, 0.5), 0) + win(t, A.recap - 0.5, A.dollar - 1, 0.6)),
    guests: up(t, at("they remember if you were happy"), at("they remember if you were happy") + 1.6),
    ...bk,
    hi: [win(t, A.twoLines, A.link1 + 2, 0.5), win(t, A.p72 + 2.5, A.link2, 0.5), 0, 0],
    emaF: FLIP_AT.map((a) => up(t, a, a + 0.8)),
    door: 0, clock: 0, wrap: 0, kin: 0, ice: 0, cranes: up(t, at("she never made a big decision"), at("she never made a big decision") + 1.4),
    // el reloj: 3:00 (el gancho y el #1) → la tarde de la madre (4:00 → 7:00 → 10:00)
    hour: t < A.day ? 3 : t < A.four ? 6 + 10 * up(t, A.day, A.four - 1) : t < A.seven ? 16 + 3 * up(t, A.four + 20, A.seven) : 19 + 3 * up(t, A.seven + 8, A.lights),
    nbOpen: Math.max(win(t, 40.5, 49, 0.4), win(t, A.night1 + 6, at("then she closed the notebook"), 0.4), win(t, at("she sat up opened the notebook"), at("and she lay back down"), 0.3),
      win(t, at("she wrote the same line"), at("she mailed it"), 0.4), win(t, at("and before bed the notebook"), A.lights, 0.3), win(t, A.tonight, at("close the notebook", A.tonight) + 0.4, 0.3)),
    pencil: up(t, at("put the pencil on top"), at("put the pencil on top") + 0.6),
    andon: night,
    radio: win(t, A.n6 + 2, at("the radio broke"), 0.3) + win(t, at("when the new radio came"), A.n7 - 2, 0.4) + win(t, A.seven - 0.3, A.seven + 9, 0.3),
    radioBroken: win(t, at("the radio broke"), at("when the new radio came"), 0.3),
    mirror: win(t, A.n4, A.n5 - 2, 0.5),
    drawer: win(t, at("every month on the first sunday"), at("then she stopped thinking about it"), 0.6),
    env: win(t, at("and in the top drawer"), at("he opened that envelope") + 6, 0.5),
    bowl: win(t, at("every friday she went and ate"), at("the noodle shop lasted") + 4, 0.5) + win(t, at("on friday she ate"), at("and every sunday"), 0.4),
    cards: up(t, at("her plan of three"), at("her plan of three") + 1) * (1 - up(t, A.four - 1, A.four)),
    blanket: night,
  };
};
function bookSt(t: number) {
  const w = BW.find((x) => t >= x.a - 1 && t < x.b + 1);
  if (!w) return { books: 0, row: 0, hero: 0, open: 0, spread: 0, heroI: 3 };
  return { books: up(t, w.a, w.a + 0.9) * (1 - up(t, w.b + 0.05, w.b + 0.5)), row: up(t, w.a + 0.3, w.a + 1.2), hero: up(t, w.a + 2.0, w.a + 3.0),
    open: up(t, w.a + 3.2, w.a + 4.2), spread: w.sp, heroI: w.hero };
}
