// frank01 · estados del mundo de la vereda + cámara, TODO anclado a la voz (caps.json) con at("frase").
// El mundo aparece en tramos (SEG): cada tramo tiene su estado (grieta, agua, hielo, lechada…) y sus llaves de cámara.
// Fuera de un tramo vale el último estado (sirve para la cola de la transición de salida).
import CAPS from "./caps.json";

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9$°]/g, "");
const WORDS = (CAPS as [string, number][]).flatMap(([w, ms]) => w.split(/\s+/).map((x, j) => ({ w: norm(x), t: ms / 1000 + j * 0.3 }))).filter((x) => x.w);
export const at = (phrase: string, after = 0): number => {
  const ws = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i < WORDS.length; i++) {
    if (WORDS[i].t < after - 0.01) continue;
    let ok = true;
    for (let j = 0; j < ws.length; j++) if (!WORDS[i + j] || WORDS[i + j].w !== ws[j]) { ok = false; break; }
    if (ok) return WORDS[i].t;
  }
  throw new Error(`at(): no encuentro "${phrase}" después de ${after}`);
};

const cl = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
/** 0→1 entre a y b (suave) */
const E = (t: number, a: number, b: number) => sm((t - a) / Math.max(1e-3, b - a));

// ---------------- anclas de la voz ----------------
export const ST = {
  // minuto 1
  sidewalk: at("in the sidewalk"), crack: at("there's a crack"), thin: at("a thin one"), pencil: at("pencil line"),
  half: at("last fall"), runs: at("now it runs"), steps: at("almost to the steps"), cantSee: at("what you can't see"),
  rains: at("every time it rains"), runsDown: at("runs down into"), sits: at("sits under"), freezes: at("freezes at night"),
  grows: at("ice grows"), pushes: at("it pushes"), spring: at("by next spring"), crumbling: at("edges are crumbling"), lift: at("starting to lift"),
  twoDollars: at("about $2", 60), d2: at("$2 a batch"), mix: at("how i mix it"), putIn: at("how i put it in"), mistakes: at("the mistakes"), pop: at("pop right back out"),
  // resto
  poured: at("when it's poured"), leaves: at("as that water leaves"), shrinks: at("the slab shrinks"), give: at("something has to give"), soCracks: at("so it cracks"),
  lines: at("we cut those lines"), tellCrack: at("tell the crack where"),
  goesIn: at("water goes in"), washes: at("it washes the gravel"), support: at("loses its support"),
  enough: at("enough force"), splitRock: at("split rock"), sealed: at("a crack that's sealed"), wholeGame: at("that's the whole game"),
  sunCooks: at("the sun cooks it"), itShrinks: at("it shrinks", 160), peels: at("it peels away"), holding: at("holding water"),
  scab: at("like a scab"), firstFreeze: at("the first freeze"), popsOff: at("pops it right off"),
  allTheWay: at("all the way down"), bridging: at("instead of bridging"),
  openV: at("into a little v"), thumb: at("as wide as my thumb"), notDeep: at("not deep"), quarter: at("a quarter inch"),
  deep: at("if the crack is deep"), drySand: at("dry sand down"), cave: at("filling a cave"),
  pourV: at("pour the slurry right along"), workIt: at("work it in"), pushDown: at("push it down"), bubbles: at("little bubbles come up"), airOut: at("that's air coming out"),
  higher: at("slightly higher than the surface"), strike: at("i strike it off"), level: at("so it's level"),
  cures: at("it cures"), needsWater: at("it needs water to get hard"), wetCloth: at("strip of wet cloth"), damp3: at("keep it damp for three days"),
  thirty: at("thirty days later"), hose: at("i take the hose"), runWater: at("run water right over"), sheets: at("just sheets across"), doorClosed: at("the door is closed"),
  disappear: at("disappear into the line"), gotGap: at("got a gap"),
  higherSide: at("one side of the crack is higher"), sinking: at("the slab is sinking"), tilting: at("tilting toward your house"), wider: at("wider than your finger"), groundProb: at("that's a ground problem"),
  neighbor: at("my neighbor paid"), sameYear: at("the same year i sealed"), hisIs: at("his is cracked again"), mineIsnt: at("mine isn't"),
};

// ---------------- estado ----------------
export type S = {
  len: number; ghost: number; ghostO: number; pencil: number; front: number;
  gap: number; vee: number; water: number; ice: number; lens: number; wash: number; lift: number; sink: number;
  rain: number; night: number; vapor: number; joints: number;
  sand: number; slurry: number; slurryHump: number; cured: number; pour: number; bubbles: number;
  crumb: number; caulk: number; peel: number; shrinkCaulk: number; patch: number; pop: number; cloth: number; sheet: number;
};
const BASE: S = {
  len: 1, ghost: 0, ghostO: 0, pencil: 0, front: 0,
  gap: 0.012, vee: 0, water: 0, ice: 0, lens: 0, wash: 0, lift: 0, sink: 0,
  rain: 0, night: 0, vapor: 0, joints: 0,
  sand: 0, slurry: 0, slurryHump: 0, cured: 0, pour: 0, bubbles: 0,
  crumb: 0, caulk: 0, peel: 0, shrinkCaulk: 0, patch: 0, pop: 0, cloth: 0, sheet: 0,
};
type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };
type Seg = { a: number; b: number; st: (t: number) => Partial<S>; keys: Key[] };

// vistas tipo (se reusan en varios tramos)
const SEC = { p: [1.75, 0.55, 4.7], l: [0.05, -0.38, 1.5], fov: 34 };          // corte en 3/4
const SEC_CLOSE = { p: [0.85, 0.16, 3.35], l: [0.1, -0.16, 1.85], fov: 30 };    // la grieta en el corte, de cerca
const UNDER = { p: [0.9, -0.05, 3.45], l: [0.15, -0.3, 1.9], fov: 32 };       // bajo la losa
const TOP_LOW = { p: [0.42, 0.34, 3.3], l: [0.1, 0.03, 1.6], fov: 34 };         // a ras sobre la grieta, desde el corte
const HIGH = { p: [0.6, 3.0, 4.2], l: [0.05, 0, -0.8], fov: 40 };               // toda la vereda desde arriba
const DIOR = { p: [7.5, 4.6, 12.5], l: [0, 0.2, -2.4], fov: 38 };               // la maqueta entera con la casa
const k = (t: number, v: { p: number[]; l: number[]; fov: number }, dp: number[] = [0, 0, 0], arc?: number): Key => ({ t, p: [v.p[0] + dp[0], v.p[1] + dp[1], v.p[2] + dp[2]], l: v.l, fov: v.fov, arc });

const S_ = ST;
// mitad de la grieta (otoño pasado) → creciendo hasta los escalones
const lenMin1 = (t: number) => (t < S_.half ? 0.62 : t < S_.runs ? 0.62 - 0.3 * E(t, S_.half, S_.half + 0.8) : 0.32 + 0.68 * E(t, S_.runs + 0.3, S_.steps + 0.9));

export const SEG: Seg[] = [
  // ===== MIN 1 · W1: la vereda real, la grieta como línea de lápiz, el otoño pasado, crece hasta los escalones =====
  {
    a: S_.sidewalk - 0.5, b: S_.cantSee + 0.2,
    st: (t) => ({ front: 1, len: lenMin1(t), gap: 0.003, pencil: E(t, S_.pencil - 0.3, S_.pencil + 0.1) * (1 - E(t, 13.2, 13.25)),
      ghost: t >= S_.half ? 0.62 : 0, ghostO: E(t, S_.half, S_.half + 0.4) * (1 - E(t, S_.steps + 1.2, S_.steps + 1.8)) }),
    keys: [
      { t: S_.sidewalk - 0.6, p: [-0.9, 1.15, 9.3], l: [-0.6, 0.3, 4.0], fov: 40 },
      { t: S_.crack, p: [0.55, 0.42, 4.6], l: [0.4, 0.04, 2.9], fov: 36 },
      { t: S_.thin, p: [0.3, 0.17, 3.1], l: [0.12, 0.05, 2.25], fov: 28 },
      { t: S_.pencil + 1.2, p: [0.24, 0.14, 2.75], l: [0.1, 0.05, 1.9], fov: 26 },
      { t: S_.half + 0.2, p: [0.5, 2.6, 4.6], l: [0.05, 0, -0.4], fov: 40, arc: 0.4 },
      { t: S_.steps + 1.6, p: [0.9, 2.2, 3.4], l: [0.0, 0, -1.8], fov: 42 },
      { t: S_.cantSee + 1, p: [0.95, 2.1, 3.2], l: [0.0, 0, -1.9], fov: 42 },
    ],
  },
  // ===== MIN 1 · W2: lo que no se ve — el corte. llueve, el agua baja, queda bajo la losa, se congela, empuja =====
  {
    a: S_.cantSee + 0.3, b: S_.spring + 1.9,
    st: (t) => ({ len: 1, gap: 0.012 + 0.02 * E(t, S_.pushes, S_.spring + 0.6), rain: E(t, S_.rains - 0.3, S_.rains + 0.4) * (1 - E(t, S_.freezes - 0.4, S_.freezes)),
      water: 0.35 * E(t, S_.runsDown, S_.sits) * (1 - E(t, S_.spring, S_.spring + 1)),
      lens: E(t, S_.sits - 0.2, S_.sits + 0.9), night: E(t, S_.freezes - 0.5, S_.freezes + 0.4) * (1 - E(t, S_.spring - 0.3, S_.spring + 0.4)),
      ice: E(t, S_.freezes, S_.grows + 0.8) * (1 - E(t, S_.spring + 0.4, S_.spring + 1.2)), lift: E(t, S_.pushes, S_.pushes + 0.9),
      wash: 0.6 * E(t, S_.sits, S_.freezes) }),
    keys: [
      k(S_.cantSee + 0.2, SEC, [0.5, 0.4, 1.2]),
      k(S_.rains + 0.3, SEC),
      k(S_.runsDown + 0.6, SEC_CLOSE),
      k(S_.sits + 0.7, UNDER),
      k(S_.grows + 0.3, UNDER, [-0.08, 0.02, -0.12]),
      k(S_.pushes + 0.8, SEC_CLOSE, [0.15, 0.06, 0.25]),
      k(S_.spring + 2.5, SEC, [0.2, 0.15, 0.4]),
    ],
  },
  // ===== MIN 1 · W3: la losa levantada y desgranada (de día) =====
  {
    a: S_.crumbling - 0.6, b: S_.lift + 1.4,
    st: (t) => ({ len: 1, gap: 0.03, vee: 0.012, lift: 1, wash: 0.6 + 0.2 * E(t, S_.crumbling, S_.lift), lens: 0.4, crumb: E(t, S_.crumbling - 0.5, S_.crumbling + 0.8) }),
    keys: [k(S_.crumbling - 0.7, TOP_LOW, [0.3, 0.1, 0.4]), k(S_.lift + 2, TOP_LOW, [-0.1, -0.08, -0.4])],
  },
  // ===== MIN 1 · W4: $2 — la lechada llena la grieta desde el fondo =====
  {
    a: S_.twoDollars - 1.0, b: S_.twoDollars + 2.6,
    st: (t) => ({ len: 1, gap: 0.012, vee: 0.01, pour: E(t, S_.twoDollars - 0.9, S_.twoDollars - 0.5), slurry: E(t, S_.twoDollars - 0.6, S_.twoDollars + 1.8), bubbles: E(t, S_.twoDollars - 0.4, S_.twoDollars) }),
    keys: [k(S_.twoDollars - 1.1, SEC_CLOSE, [0.1, 0.05, 0.3]), k(S_.twoDollars + 3.2, SEC_CLOSE, [-0.05, -0.02, -0.15])],
  },
  // ===== MIN 1 · W5: la maqueta entera; MIX / PUT IN / MISTAKES; el parche salta =====
  {
    a: S_.mix - 1.0, b: S_.pop + 1.6,
    st: (t) => ({ len: 1, gap: 0.006, patch: 1, pop: E(t, S_.pop, S_.pop + 0.9) }),
    keys: [k(S_.mix - 1.1, SEC, [0.3, 0.3, 0.8]), k(S_.mistakes, DIOR, [-1.5, -1.2, -3.0]), k(S_.pop - 0.3, TOP_LOW, [0.25, 0.25, 0.6]), k(S_.pop + 2.0, TOP_LOW, [0.2, 0.3, 0.7])],
  },

  // ===== RESTO · A: losa recién hecha que pierde agua (vapor) y se achica =====
  {
    a: S_.leaves - 0.7, b: S_.shrinks + 4.0,
    st: (t) => ({ len: 0, gap: 0.0, vapor: E(t, S_.leaves - 0.6, S_.leaves) * (1 - E(t, S_.shrinks + 2.5, S_.shrinks + 3.6)) }),
    keys: [k(S_.leaves - 0.8, HIGH, [1.0, 0.6, 1.0]), k(S_.shrinks + 4.5, HIGH, [0.2, -0.6, -0.5])],
  },
  // ===== RESTO · B: "algo tiene que ceder" — la grieta se abre de golpe; las juntas que le dicen por dónde ir =====
  {
    a: S_.give - 0.6, b: S_.tellCrack + 1.2,
    st: (t) => ({ len: E(t, S_.soCracks - 0.1, S_.soCracks + 0.5), gap: 0.004, joints: E(t, S_.lines, S_.lines + 0.5) }),
    keys: [k(S_.give - 0.7, TOP_LOW, [0.25, 0.4, 0.8]), k(S_.soCracks + 0.6, TOP_LOW, [0.05, 0.05, 0.1]), k(S_.lines + 0.3, HIGH, [0.3, -0.4, -0.2]), k(S_.tellCrack + 1.8, HIGH, [0.6, -0.2, 0.1])],
  },
  // ===== RESTO · C: la puerta abierta — el agua entra y se lava la grava de abajo =====
  {
    a: S_.goesIn - 0.7, b: S_.support + 1.3,
    st: (t) => ({ gap: 0.008, rain: E(t, S_.goesIn - 0.6, S_.goesIn) * (1 - E(t, S_.support, S_.support + 0.6)), water: 0.4 * E(t, S_.goesIn, S_.goesIn + 1.2),
      lens: E(t, S_.goesIn + 0.8, S_.washes), wash: E(t, S_.washes, S_.support + 0.5), sink: 0.25 * E(t, S_.support - 0.3, S_.support + 0.6) }),
    keys: [k(S_.goesIn - 0.8, SEC, [0.4, 0.2, 0.7]), k(S_.goesIn + 1.3, SEC_CLOSE), k(S_.washes + 0.5, UNDER, [0.25, 0, 0.1]), k(S_.support + 1.8, SEC, [0.1, 0, 0.2])],
  },
  // ===== RESTO · D: el hielo crece y raja (de noche) =====
  {
    a: S_.enough - 0.9, b: S_.splitRock + 2.2,
    st: (t) => ({ gap: 0.008 + 0.02 * E(t, S_.splitRock - 0.2, S_.splitRock + 0.4), water: 0.4, lens: 1, night: 1, ice: E(t, S_.enough - 0.9, S_.enough), lift: E(t, S_.enough, S_.splitRock + 0.4) }),
    keys: [k(S_.enough - 1.0, UNDER, [0.15, 0.03, 0.3]), k(S_.splitRock + 2.6, SEC_CLOSE, [0.1, 0.05, 0.2])],
  },
  // ===== RESTO · E: la grieta sellada no deja pasar nada =====
  {
    a: S_.sealed - 0.6, b: S_.wholeGame + 3.2,
    st: (t) => ({ gap: 0.01, vee: 0.01, slurry: 1, cured: 1, rain: E(t, S_.sealed - 0.5, S_.sealed + 0.2), sheet: 0 * t }),
    keys: [k(S_.sealed - 0.7, SEC, [0.3, 0.25, 0.6]), k(S_.wholeGame + 3.6, SEC_CLOSE, [0.2, 0.1, 0.3])],
  },
  // ===== RESTO · F: la masilla: va lisa, el sol la cocina, se achica y se despega =====
  {
    a: 157.0, b: 165.9,
    st: (t) => ({ gap: 0.01, caulk: E(t, 157.2, 158.6), shrinkCaulk: E(t, S_.itShrinks - 0.2, S_.itShrinks + 0.6), peel: E(t, S_.peels, S_.peels + 0.8), water: 0.35 * E(t, S_.holding - 0.8, S_.holding + 0.2) }),
    keys: [k(156.9, TOP_LOW, [0.4, 0.2, 0.9]), k(S_.sunCooks - 1.0, TOP_LOW, [0.2, 0.15, 0.5]), k(S_.peels + 0.3, TOP_LOW, [-0.05, -0.12, -0.6]), k(S_.holding + 1.5, SEC_CLOSE, [0.1, 0.12, 0.2])],
  },
  // ===== RESTO · G: el parche como una costra; la primera helada lo hace saltar =====
  {
    a: S_.scab - 1.2, b: S_.popsOff + 1.5,
    st: (t) => ({ gap: 0.008, patch: 1, night: E(t, S_.firstFreeze - 0.3, S_.firstFreeze + 0.3), ice: E(t, S_.firstFreeze, S_.popsOff), water: 0.35, lens: 0.5,
      pop: E(t, S_.popsOff, S_.popsOff + 0.9) }),
    keys: [k(S_.scab - 1.3, TOP_LOW, [0.3, 0.1, 0.4]), k(S_.popsOff - 0.2, TOP_LOW, [0, 0.05, 0]), k(S_.popsOff + 2.0, TOP_LOW, [0.25, 0.35, 0.8])],
  },
  // ===== RESTO · H: líquida baja hasta el fondo (no puentea arriba) =====
  {
    a: S_.allTheWay - 0.8, b: S_.bridging + 2.4,
    st: (t) => ({ gap: 0.012, vee: 0.01, pour: E(t, S_.allTheWay - 0.7, S_.allTheWay - 0.3), slurry: E(t, S_.allTheWay - 0.3, S_.bridging + 1.5), bubbles: E(t, S_.allTheWay, S_.allTheWay + 0.5) }),
    keys: [k(S_.allTheWay - 0.9, SEC_CLOSE, [0.05, 0.08, 0.3]), k(S_.bridging + 2.8, SEC_CLOSE, [0.05, -0.03, -0.1])],
  },
  // ===== RESTO · I: abrir la grieta en V del ancho de un pulgar, no profunda =====
  {
    a: S_.openV - 0.7, b: S_.quarter + 2.2,
    st: (t) => ({ gap: 0.006, vee: 0.024 * E(t, S_.openV - 0.4, S_.thumb + 0.3) }),
    keys: [k(S_.openV - 0.8, SEC_CLOSE, [0.2, 0.15, 0.5]), k(S_.notDeep, SEC_CLOSE, [-0.08, -0.01, -0.2]), k(S_.quarter + 2.6, SEC_CLOSE, [-0.12, -0.03, -0.3])],
  },
  // ===== RESTO · K: grieta honda: arena seca primero (no llenar una cueva) =====
  {
    a: S_.deep - 0.6, b: S_.cave + 1.4,
    st: (t) => ({ gap: 0.024, vee: 0.024, sand: 0.55 * E(t, S_.drySand - 0.2, S_.cave) }),
    keys: [k(S_.deep - 0.7, SEC_CLOSE, [0.1, 0.05, 0.3]), k(S_.cave + 1.8, SEC_CLOSE, [-0.05, -0.02, -0.15])],
  },
  // ===== RESTO · L: volcar a lo largo de la V, empujar, suben las burbujas =====
  {
    a: S_.pourV - 0.6, b: S_.airOut + 1.4,
    st: (t) => ({ gap: 0.024, vee: 0.024, sand: 0.55, pour: E(t, S_.pourV - 0.4, S_.pourV) * (1 - E(t, S_.pushDown - 0.4, S_.pushDown)), slurry: 0.55 + 0.4 * E(t, S_.pourV, S_.bubbles), bubbles: E(t, S_.bubbles - 0.3, S_.bubbles + 0.3) }),
    keys: [k(S_.pourV - 0.7, SEC_CLOSE, [0.15, 0.1, 0.35]), k(S_.bubbles, SEC_CLOSE, [-0.1, -0.04, -0.3]), k(S_.airOut + 1.8, SEC_CLOSE, [-0.12, -0.05, -0.35])],
  },
  // ===== RESTO · M: un poco más alto que la superficie → enrasar =====
  {
    a: S_.higher - 0.6, b: S_.level + 1.6,
    st: (t) => ({ gap: 0.024, vee: 0.024, sand: 0.55, slurry: 1, slurryHump: 1 - E(t, S_.strike, S_.level) }),
    keys: [k(S_.higher - 0.7, SEC_CLOSE, [0.05, 0.12, 0.3]), k(S_.level + 2.0, TOP_LOW, [0.1, 0.05, 0.3])],
  },
  // ===== RESTO · N: no seca, CURA — necesita agua; trapo mojado tres días =====
  {
    a: 418.0, b: 424.4,
    st: (t) => ({ gap: 0.024, vee: 0.024, sand: 0.55, slurry: 1, cured: E(t, S_.needsWater, S_.damp3 + 2), cloth: E(t, S_.wetCloth, S_.wetCloth + 1.0) }),
    keys: [k(417.9, SEC_CLOSE, [0.2, 0.1, 0.4]), k(S_.wetCloth + 0.4, TOP_LOW, [0.15, 0.1, 0.3]), k(S_.damp3 + 3.0, TOP_LOW, [0.3, 0.3, 0.8])],
  },
  // ===== RESTO · O: la prueba de la manguera a los 30 días: corre por arriba, la puerta está cerrada =====
  {
    a: 435.6, b: 448.4,
    st: (t) => ({ gap: 0.024, vee: 0.024, sand: 0.55, slurry: 1, cured: 1, sheet: E(t, S_.runWater, S_.sheets + 0.6) }),
    keys: [k(435.5, DIOR, [-3, -2.5, -5.5]), k(S_.runWater - 0.3, SEC, [0.4, 0.2, 0.6]), k(S_.doorClosed + 2.0, SEC_CLOSE, [0.15, 0.12, 0.3])],
  },
  // ===== RESTO · Q: la grieta equivocada: un lado más alto, la losa se hunde hacia la casa =====
  {
    a: S_.higherSide - 0.6, b: S_.groundProb + 1.6,
    st: (t) => ({ gap: 0.006 + 0.03 * E(t, S_.wider - 0.3, S_.wider + 0.5), sink: E(t, S_.higherSide, S_.sinking + 0.6), wash: E(t, S_.sinking, S_.groundProb), lens: 0 }),
    keys: [k(S_.higherSide - 0.7, SEC, [0.2, 0.1, 0.4]), k(S_.tilting, SEC_CLOSE, [0.2, 0.05, 0.2]), k(S_.groundProb + 2.0, UNDER, [0.2, 0.0, 0.3])],
  },
  // ===== RESTO · R: el vecino rompió la suya; la de Frank sigue cerrada — la maqueta entera =====
  {
    a: S_.neighbor - 0.6, b: S_.mineIsnt + 1.8,
    st: () => ({ gap: 0.024, vee: 0.024, sand: 0.55, slurry: 1, cured: 1 }),
    keys: [k(S_.neighbor - 0.7, TOP_LOW, [0.2, 0.2, 0.5]), k(S_.hisIs, DIOR, [-2.5, -1.8, -4.5]), k(S_.mineIsnt + 2.2, DIOR)],
  },
  // ===== tramos extra del resto =====
  // la lechada: se vuelve parte del concreto
  { a: 185.3, b: 190.7, st: (t) => ({ gap: 0.02, vee: 0.02, pour: E(t, 185.4, 185.9) * (1 - E(t, 189.0, 189.4)), slurry: E(t, 185.8, 189.2), bubbles: E(t, 186.2, 186.8) }),
    keys: [k(185.2, SEC_CLOSE, [0.25, 0.15, 0.5]), k(191.2, SEC_CLOSE, [-0.05, -0.02, -0.1])] },
  // la cola: agarra el concreto viejo y no deja que se seque rápido
  { a: 235.6, b: 247.5, st: (t) => ({ gap: 0.02, vee: 0.02, slurry: 1, cured: 0.15 * E(t, 241, 247), bubbles: 0.5 * (1 - E(t, 238, 241)) }),
    keys: [k(235.5, TOP_LOW, [0.3, 0.2, 0.6]), k(241.4, SEC_CLOSE, [0.05, 0.02, 0.05]), k(248.0, SEC_CLOSE, [-0.12, -0.04, -0.3])] },
  // el polvo: la lechada se pega al polvo y el polvo se suelta
  { a: 293.8, b: 299.2, st: (t) => ({ gap: 0.024, vee: 0.024, sand: 0.12, slurry: 0.12 + 0.75 * E(t, 294.5, 297.5) }),
    keys: [k(293.7, SEC_CLOSE, [0.15, 0.05, 0.3]), k(299.6, UNDER, [0.1, 0.12, 0.1])] },
  // el concreto seco chupa el agua: línea débil y calcárea
  { a: 324.3, b: 330.0, st: (t) => ({ gap: 0.024, vee: 0.024, slurry: 1, cured: E(t, 325.5, 328.5), crumb: 0.5 * E(t, 328.0, 329.5) }),
    keys: [k(324.2, SEC_CLOSE, [0.2, 0.1, 0.4]), k(330.4, TOP_LOW, [0.05, 0.0, 0.1])] },
  // la textura de escoba: casi no se ve la reparación
  { a: 406.9, b: 412.4, st: () => ({ gap: 0.024, vee: 0.024, sand: 0.55, slurry: 1, cured: 1 }),
    keys: [k(406.8, TOP_LOW, [0.5, 0.25, 0.9]), k(412.8, TOP_LOW, [-0.1, 0.0, -1.2])] },
  // la cuenta: $2 contra $4.000
  { a: 466.0, b: 472.7, st: () => ({ gap: 0.024, vee: 0.024, sand: 0.55, slurry: 1, cured: 1 }),
    keys: [k(465.9, DIOR, [-2.0, -1.5, -4.0]), k(473.1, DIOR, [1.0, 0.4, 0.5])] },
  // los errores (la maqueta gira)
  { a: 487.3, b: 497.1, st: () => ({ gap: 0.024, vee: 0.024, sand: 0.55, slurry: 1, cured: 1 }),
    keys: [k(487.2, HIGH, [1.5, 0.3, 0.8]), k(492.3, HIGH, [-1.2, 0.2, 0.4]), k(497.5, HIGH, [-1.8, -0.4, -0.6])] },
  // las finas, planas, que sólo dejan entrar agua: el 90 %
  { a: 534.2, b: 544.5, st: (t) => ({ gap: 0.012, slurry: E(t, 541.5, 543.5), rain: E(t, 535.5, 536) * (1 - E(t, 541, 541.6)), water: 0.3 * E(t, 536, 537) * (1 - E(t, 541, 542)) }),
    keys: [k(534.1, TOP_LOW, [0.3, 0.2, 0.6]), k(539.0, SEC, [0.2, 0.1, 0.2]), k(544.9, SEC_CLOSE, [0.1, 0.05, 0.2])] },
];

// cámara: todas las llaves, en orden
SEG.sort((x, y) => x.a - y.a);
export const KEYS: Key[] = SEG.flatMap((s) => s.keys).sort((a, b) => a.t - b.t);

export const stateAt = (t: number): S => {
  let seg = SEG[0];
  for (const s of SEG) if (s.a - 0.8 <= t) seg = s; // el tramo vigente (con la cola de salida incluida)
  return { ...BASE, ...seg.st(Math.min(t, seg.b + 0.8)) };
};
// tramos del mundo (para el plan de beats y los rangos del farm)
export const WORLD = SEG.map((s) => [+s.a.toFixed(2), +s.b.toFixed(2)]);
