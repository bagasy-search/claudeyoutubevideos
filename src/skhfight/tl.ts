// skhfight · LÍNEA DE TIEMPO del mundo (segundos de la locución, anclados a palabras con at()).
// KEYS = la única cámara (sin cortes): un encuadre por tramo de mundo; el viaje de un encuadre al otro pasa
// mientras está el avatar (escondido por la tinta) o, dentro de un tramo, en ~1,4 s. ST(t) = el estado de la casa.
import { at, atEnd } from "./lib";
import AVW from "./avwin.json";
export type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };
type Wn = { ms: number; me: number; off: number };
const WIN: Wn[] = (AVW as unknown as { win: Wn[] }).win;

// encuadres con nombre
export const F: Record<string, { p: number[]; l: number[]; fov: number }> = {
  phoneClose: { p: [-1.5, 0.72, -0.62], l: [-2.12, 0.4, -1.3], fov: 40 },
  phoneIn: { p: [-1.66, 0.62, -0.82], l: [-2.12, 0.42, -1.3], fov: 38 },
  phoneMid: { p: [-0.95, 1.0, 0.2], l: [-2.0, 0.45, -1.25], fov: 44 },
  wideNight: { p: [0.9, 1.55, 3.9], l: [-0.3, 0.75, -1.2], fov: 46 },
  tansu: { p: [-1.55, 1.15, 1.05], l: [-2.5, 1.05, 0.55], fov: 40 },
  drawer: { p: [-1.75, 1.25, 0.95], l: [-2.3, 0.86, 0.5], fov: 38 },
  desk: { p: [-0.48, 1.05, -0.78], l: [-0.62, 0.3, -1.62], fov: 42 },
  deskClose: { p: [-0.5, 0.78, -1.2], l: [-0.62, 0.3, -1.6], fov: 38 },
  wideDay: { p: [0.4, 1.7, 3.7], l: [-0.1, 0.9, -1.4], fov: 48 },
  ema: { p: [-0.8, 1.45, 0.25], l: [-0.8, 1.72, -2.1], fov: 58 },
  table: { p: [1.35, 0.95, 1.35], l: [0.35, 0.36, 0.05], fov: 42 },
  cups: { p: [0.85, 0.68, 0.65], l: [0.35, 0.36, 0.05], fov: 36 },
  cupsTop: { p: [0.42, 1.25, 0.62], l: [0.36, 0.33, 0.04], fov: 40 },
  watch: { p: [0.2, 0.62, 0.62], l: [0.05, 0.34, 0.27], fov: 32 },
  pearls: { p: [0.78, 0.62, 0.62], l: [0.65, 0.34, 0.27], fov: 32 },
  sbox: { p: [0.62, 0.72, 0.5], l: [0.37, 0.38, 0.0], fov: 34 },
  garden: { p: [1.4, 1.35, 2.7], l: [3.9, 0.8, -0.5], fov: 46 },
  high: { p: [0.3, 2.3, 2.9], l: [-0.1, 0.1, -0.7], fov: 52 },
  tatamiLow: { p: [1.5, 0.55, 1.75], l: [-0.6, 0.35, -0.9], fov: 46 },
  fusuma: { p: [-0.5, 1.15, 0.3], l: [-2.78, 1.0, -0.4], fov: 44 },
  gate: { p: [3.2, 1.15, 1.9], l: [5.8, 0.8, 1.05], fov: 44 },
  step: { p: [2.9, 0.8, 2.2], l: [3.75, 0.12, 1.2], fov: 40 },
  engawa: { p: [1.9, 1.05, 2.4], l: [3.8, 0.6, 0.0], fov: 46 },
  tokonoma: { p: [1.35, 1.2, -0.7], l: [1.85, 1.3, -2.55], fov: 42 },
  ...Object.fromEntries(Array.from({ length: 11 }, (_, i) => ["emaI" + i, { p: [-2.45 + i * 0.33, 1.52, -1.15], l: [-2.45 + i * 0.33, 1.7, -2.1], fov: 38 }])),
};
const K = (t: number, n: string, push = 0, arc?: number): Key => {
  const f = F[n]; const p = f.p.map((v, i) => v + (f.l[i] - v) * push);
  return { t, p, l: f.l, fov: f.fov - push * 6, arc };
};

// las reglas: cuándo se dice "rule number X" (el ema de esa regla se enciende y se da vuelta: muestra la regla)
export const RULE_AT = [at("rule number one is"), at("rule number 2 is"), at("rule number three is"), at("rule number four is to give"), at("rule number five is"), at("rule number six is"),
  at("rule number 7 is to"), at("rule number eight is"), at("rule number nine is"), at("rule number 10 is"), at("and now rule number 11")];
export const RECAP_AT = [at("1 find your 10"), at("2 ask each child alone"), at("3 give everything its story"), at("4 give some treasures"), at("5 split the sets"),
  at("6 for one watch"), at("7 write it all"), at("8 show everything"), at("9 remember the husbands"), at("10 let go of the 90"), at("and 11 say it out loud")];
export const END = atEnd("take care of your home") + 1.2;

// el plan de encuadres: [segundo, encuadre]. Cada tramo de mundo usa el último que empezó (si uno cae a mitad de tramo, viaja ahí).
const PLAN: [number, string][] = [
  [0, "table"], [at("one small thing"), "cups"], [at("your watch"), "watch"], [at("mother's pearls"), "pearls"], [at("the good teacups"), "cups"],
  [at("when my mother passed"), "wideNight"], [at("nine bags out of ten"), "garden"], [at("we found her sewing box"), "sbox"],
  [at("so here is the truth"), "wideDay"], [at("10 of your house"), "high"], [at("the small things with a story"), "table"],
  [at("11 japanese rules"), "ema"], [at("one watch and two sons", 72)], [at("warm hands", 72), "table"], [at("rule number 11 is the one"), "ema"],
  [at("i am sachiko"), "wideDay"], [at("small box of kiri wood"), "tansu"], [at("katami wake"), "tokonoma"], [at("i am not a lawyer"), "wideDay"],
  [RULE_AT[0], "emaI0"], [RULE_AT[0] + 6, "high"], [at("i walk through my house slowly"), "tatamiLow"], [at("my mother's teacups"), "cups"], [at("my husband's watch"), "watch"],
  [at("the scroll in our little alcove"), "tokonoma"], [at("31 things on it"), "wideDay"], [at("cup of tea dear"), "table"],
  [at("quick while i have you"), "wideDay"], [at("sachiko's kitchen"), "engawa"], [at("now back to the list"), "ema"],
  [RULE_AT[1], "emaI1"], [RULE_AT[1] + 6, "table"], [at("the table went very quiet"), "high"], [at("i ask each one alone"), "phoneMid"], [at("on the telephone that he sees"), "phoneIn"],
  [at("old radio"), "fusuma"], [at("write down what each child says"), "desk"],
  [RULE_AT[2], "emaI2"], [RULE_AT[2] + 6, "watch"], [at("fell on the ice"), "step"], [at("story tags"), "desk"], [at("for the teacups the tag says"), "cups"], [at("tell the story out loud too"), "table"],
  [at("now rule number four is the one"), "ema"], [at("my neighbor laughed"), "gate"],
  [RULE_AT[3], "emaI3"], [RULE_AT[3] + 6, "garden"], [at("here is why"), "table"], [at("she wore my mother's pearls"), "pearls"], [at("my mother did not do this"), "tansu"], [at("the sewing box had no owner"), "sbox"], [at("so start small"), "table"],
  [RULE_AT[4], "emaI4"], [RULE_AT[4] + 6, "cupsTop"], [at("so i broke the rule of the set"), "tatamiLow"], [at("then i made three small groups"), "cupsTop"], [at("family puzzle"), "cups"], [at("and if your set is very precious"), "wideDay"],
  [RULE_AT[5], "emaI5"], [RULE_AT[5] + 6, "watch"], [at("so here is my rule"), "table"], [at("wound it for his father"), "watch"], [at("same weight in the heart"), "fusuma"], [at("what they cannot carry"), "high"],
  [at("by the way if your family"), "wideDay"], [at("rule 7 is next"), "ema"],
  [RULE_AT[6], "emaI6"], [RULE_AT[6] + 6, "desk"], [at("here is how my lines look"), "deskClose"], [at("when i told my neighbor"), "gate"], [at("show me your notebook"), "desk"],
  [RULE_AT[7], "emaI7"], [RULE_AT[7] + 6, "tansu"], [at("in the back of her tansu"), "drawer"], [at("so i do the opposite"), "table"], [at("and if there is something you truly"), "drawer"],
  [at("now the next rule surprises"), "ema"],
  [RULE_AT[8], "emaI8"], [RULE_AT[8] + 6, "gate"], [at("so i include them"), "table"], [at("each grandchild gets one small thing"), "tatamiLow"],
  [RULE_AT[9], "emaI9"], [RULE_AT[9] + 6, "garden"], [at("tired children fight"), "high"], [at("if my mother had let go"), "wideDay"], [at("so the bags at the curb"), "gate"], [at("when the house is light"), "drawer"],
  [RULE_AT[10], "emaI10"], [RULE_AT[10] + 6, "wideDay"], [at("this is yours this is why"), "table"], [at("my brother was not fighting"), "sbox"], [at("she left us a list"), "tansu"],
  [at("how the sewing box story ended"), "wideNight"], [at("my brother called me"), "phoneIn"], [at("i kept the box"), "sbox"], [at("on a video call"), "table"],
  [at("after my last video about the house many"), "wideDay"], [at("only have one child"), "tatamiLow"], [at("already fighting"), "high"],
  [at("let me tell you the five mistakes"), "wideDay"], [at("the second mistake"), "tokonoma"], [at("the fourth mistake"), "gate"], [at("believing your children are different"), "high"],
  [at("here is a plan for just one week"), "wideDay"],
  [at("let me say all 11 again"), "ema"], [at("now tell me in the comments"), "table"], [at("if this helped you press subscribe"), "wideDay"], [at("over on my kitchen channel"), "engawa"],
  [at("next week i will show you"), "desk"], [at("a house can be light"), "garden"],
].filter((x): x is [number, string] => x.length === 2);

const frameAt = (t: number) => { let f = PLAN[0][1]; for (const [a, n] of PLAN) if (a <= t) f = n; return f; };
// tramos de mundo = lo que queda entre ventanas del avatar
const STRETCH: [number, number][] = [];
{ let c = 0; for (const w of WIN) { if (w.ms - c > 0.5) STRETCH.push([c, w.ms]); c = w.me; } if (END - c > 0.5) STRETCH.push([c, END]); }

export const KEYS: Key[] = (() => {
  const K2: Key[] = [];
  for (const [a, b] of STRETCH) {
    const a0 = Math.max(0, a - 0.45);
    // cambios de encuadre dentro del tramo
    const cuts = PLAN.filter(([x]) => x > a + 0.8 && x < b - 1.2).map(([x]) => x);
    let cur = a0, f = frameAt(a + 0.3), push0 = 0;
    for (const c of cuts) {
      K2.push(K(cur, f, push0)); K2.push(K(c - 0.1, f, push0 + 0.06));
      f = frameAt(c + 0.01); cur = c + 1.3; push0 = 0;
    }
    K2.push(K(cur, f, push0)); K2.push(K(b, f, push0 + Math.min(0.14, (b - cur) * 0.012)));
  }
  K2.push({ t: 99999, ...F.wideDay });
  return K2.sort((x, y) => x.t - y.t);
})();

const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
/** sube de 0 a 1 entre a y b */
export const up = (t: number, a: number, b: number) => sm((t - a) / (b - a));
/** 1 entre a y b (con rampas de r segundos) */
export const win = (t: number, a: number, b: number, r = 0.4) => up(t, a - r, a) * (1 - up(t, b, b + r));

export type Estado = {
  day: number; lamp: number; phoneLight: number; ring: number; lift: number;
  ema: number[]; emaAt: number[]; emaHi: number[]; emaF: number[]; steam: number; guests: number; shade: number;
  door: number; clock: number; ice: number; cranes: number;
  sbox: number; sbOpen: number; sbTag: number; watch: number; pearls: number; split: number; drawer: number;
};
const A = {
  dusk: at("so here is the truth"), eleven: at("11 japanese rules"),
  sb1: at("we found her sewing box"), sb1e: atEnd("did not speak to each other for two years"),
  sb2: at("the sewing box had no owner"), sb2o: at("with that box open on her knees"), sb2e: at("so start small"),
  sb3: at("when my brother and i found that sewing box"), sb3e: at("if my mother had let go"),
  sb4: at("my brother was not fighting"), sb5: at("how the sewing box story ended"), sbO: at("and in that box there is a small paper"), sbT: at("with a story tag", 1290),
  ring: at("my brother called me"), ice: at("fell on the ice"),
  w1: at("your watch"), w2: at("a watch without a story"), w2e: at("so i make what i call story tags"), w3: RULE_AT[5], w3e: at("by the way if your family"),
  p1: at("mother's pearls"), p1e: at("two of your children are looking"), p2: at("she wore my mother's pearls"), p2e: at("my mother did not do this"),
  p3: at("let the little ones hold the pearls"), p3e: at("and if there is something you truly"), p4: at("my mother's pearls in a nearly empty drawer"),
  split: at("then i made three small groups"), unsplit: at("the set comes together again"), drawer: at("in the back of her tansu"), drawerE: at("so i do the opposite"),
  drawer2: at("and if there is something you truly"), drawer2e: at("now the next rule surprises"), drawer3: at("when the house is light"), drawer3e: RULE_AT[10],
  show: at("the showing"), showE: at("now the next rule surprises"), recap: at("let me say all 11 again"), recapE: at("now tell me in the comments"),
};
const EMA_AT = Array.from({ length: 11 }, (_, i) => A.eleven - 0.8 + i * 0.2);

export const ST = (t: number): Estado => ({
  day: up(t, A.dusk - 0.5, A.dusk + 2.5),
  lamp: 1 - 0.55 * up(t, A.dusk, A.dusk + 3),
  phoneLight: win(t, A.ring - 1, A.ring + 12, 0.6),
  ring: t >= A.ring - 0.3 && t < A.ring + 1.6 ? 1 : 0,
  lift: up(t, A.ring + 1.7, A.ring + 2.3) * (1 - up(t, A.ring + 20, A.ring + 20.6)),
  ema: EMA_AT.map((a) => up(t, a, a + 0.5)),
  emaAt: EMA_AT,
  emaHi: RULE_AT.map((a, i) => Math.min(1, win(t, a - 0.4, a + 6, 0.4) + win(t, RECAP_AT[i], RECAP_AT[i] + 4, 0.3))),
  emaF: RULE_AT.map((a) => up(t, a + 0.6, a + 1.4)),
  steam: 1,
  guests: win(t, A.show - 1, A.showE, 0.8),
  shade: Math.min(1, RULE_AT.reduce((m, a) => m + win(t, a - 1.0, a + 3.5, 0.5), 0) + win(t, A.recap, A.recapE, 0.6)),
  door: 0.3,
  clock: 0,
  ice: win(t, A.ice - 2, A.ice + 8, 0.8),
  cranes: 0,
  sbox: win(t, A.sb1 - 0.2, A.sb1e, 0.6) + win(t, A.sb2 - 0.2, A.sb2e, 0.6) + win(t, A.sb3 - 0.2, A.sb3e, 0.6) + up(t, A.sb4 - 0.2, A.sb4 + 0.6) * (1 - up(t, A.sb4 + 18, A.sb4 + 18.6)) + up(t, A.sb5 - 0.2, A.sb5 + 0.6) * (1 - up(t, A.recap - 30, A.recap - 29)),
  sbOpen: win(t, A.sb2o, A.sb2e, 0.6) + up(t, A.sbO - 0.3, A.sbO + 0.8),
  sbTag: up(t, A.sbT, A.sbT + 0.8),
  watch: win(t, A.w1 - 0.2, A.p1e, 0.5) + win(t, A.w2 - 0.2, A.w2e, 0.5) + win(t, A.w3 - 0.2, A.w3e, 0.5),
  pearls: win(t, A.p1 - 0.2, A.p1e + 2, 0.5) + win(t, A.p2 - 0.2, A.p2e, 0.5) + win(t, A.p3 - 0.2, A.p3e, 0.5) + win(t, A.p4 - 0.2, A.p4 + 6, 0.5),
  split: up(t, A.split, A.split + 1.4) * (1 - up(t, A.unsplit, A.unsplit + 1.4)),
  drawer: win(t, A.drawer, A.drawerE, 0.9) + win(t, A.drawer2, A.drawer2e, 0.9) + win(t, A.drawer3, A.drawer3e, 0.9),
});
