// frank02 · estados del mundo (bloque gigante en corte + banco de pruebas) + cámara, TODO anclado a la voz (caps.json) con at("frase").
// El mundo aparece en tramos (SEG): cada tramo tiene su estado y sus llaves de cámara. Fuera de un tramo vale el último estado.
import CAPS from "./caps.json";
import type { S } from "./block3d";

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
  seen: at("you've seen this one"), wheel: at("a wheelbarrow full"), picks: at("he picks up"), pours: at("pours the whole thing"), glug: at("glug"),
  mixes: at("he mixes it"), dark: at("turns dark and shiny"), caption: at("the caption says"), billions: at("billions of people"),
  stronger: at("stronger", 20), waterproof: at("waterproof", 20), never: at("never cracks"), youCome: at("here's where you come in"),
  fence: at("a fence post"), pad: at("a little pad"), garage: at("out in the garage"), free: at("just sitting there"), whyNot: at("why not"), harm: at("what's the harm"),
  tellYou: at("i'll tell you what the harm"), didIt: at("because i did it"), exactly: at("exactly like that video"), cure: at("i let it cure"), hammer: at("hit it with a hammer"),
  name: at("my name is frank"), forty: at("more than 40 years"), sidewalks: at("sidewalks"), wheelbarrows: at("more wheelbarrows"), notTell: at("i'm not going to tell"), show: at("show you what happened"),
  three: at("three blocks"), sameBag: at("same bag of cement"), sameDay: at("same day"), plain: at("one plane"), withOil: at("one with motor oil"), stuff: at("one with the stuff"),
  surprised: at("surprised even me"), notLie: at("isn't a complete lie"), truth: at("a little piece of truth"), notPiece: at("just not the piece"), start: at("so let's start with"),
};

// resto del video (93,9 → 930,4 s)
export const RS = {
  pourOilR: at("when you pour oil into wet", 93), looks: at("so it looks like it worked", 93), year5: at("in year five", 93), reaction: at("is a chemical reaction", 93), crystals: at("growing tiny crystals", 93),
  needles: at("like needles", 93), grabOn: at("they grab on", 93), knit: at("they knit everything", 93), harder: at("keeps getting harder", 93), stone: at("turning into stone", 93),
  oilDo: at("now what does oil do", 93), dontMix: at("don't mix", 93), coats: at("it coats things", 93), wraps: at("it wraps around the grains", 93), neverReacts: at("never reacts", 93),
  raincoat: at("little raincoat of oil", 93), gloves: at("holding hands with gloves", 93), truthR: at("here's the piece of truth", 93), airBub: at("tiny air bubbles", 93), wantBub: at("we actually want those", 93),
  entrain: at("it's called air entrainment", 93), channels: at("full of little channels", 93), freezes: at("when it freezes", 93), grows9: at("about 9%", 93), pushes: at("it pushes", 93),
  pops: at("it pops the surface", 93), flaking: at("that's the flaking", 93), rooms: at("empty rooms", 93), pushesInto: at("pushes into the bubbles", 93), moreWinters: at("a lot more winters", 93),
  univ: at("universities have actually tested", 93), beirut: at("in beirut", 93), malaysia: at("in malaysia", 93), fraction: at("a fraction of 1%", 93), slump: at("20 to 40%", 93),
  weaker: at("up to about a fifth", 93), trade: at("it's a trade", 93), problem: at("here's the problem with the video", 93), ounces: at("a couple of ounces", 93), tbsp: at("a few tablespoons", 93),
  quart: at("a whole quart", 93), manyTimes: at("many times the dose", 93), mistake: at("that's a mistake", 93), showDid: at("let me show you what i did", 93), forms3: at("three little forms", 93),
  oiledForms: at("i oiled the inside", 93), split: at("split it three ways", 93), b1: at("block number one", 93), oatmeal: at("thick oatmeal", 93), b2: at("block number two", 93),
  cup: at("about a cup", 93), soup: at("like soup", 93), darkBrown: at("it went dark brown", 93), foam: at("started to foam", 93), smooth: at("how smooth that is", 93),
  b3: at("block number three", 93), admix: at("training admixture", 93), ounce: at("an ounce or so", 93), intoForms: at("went into the forms", 93), tapped: at("i tapped the sides", 93),
  covered: at("covered them with plastic", 93), days28: at("about 28 days", 93), apart: at("took them apart", 93), test1: at("test number one", 93), grayHard: at("is gray, hard", 93),
  cantTell: at("can't tell them apart", 93), blotchy: at("dark and blotchy", 93), greasy: at("feels greasy", 93), sweated: at("oil sweated right back", 93), neverLeaving: at("is never really leaving", 93),
  test2: at("test number two", 93), soaksIn: at("soaks in slowly", 93), beads: at("beads up and sits", 93), gotRight: at("the one thing that video got right", 93), wax: at("like wax on a car", 93),
  paint: at("want to paint it", 93), nothingGrabs: at("nothing grabs onto oil", 93), notPaint: at("not paint, not sealer", 93), test3: at("test number three", 93), silver: at("little silver line", 93),
  dugIn: at("the key dug in", 93), soft: at("the surface is soft", 93), tires: at("takes the tires", 93), test4: at("test number four", 93), fourLb: at("four-pound hammer", 93),
  counted: at("counted the hits", 93), beating: at("took a beating", 93), firstHit: at("on the first good hit", 93), brokeOpen: at("when it broke open", 93), streaks: at("greasy streaks", 93),
  pulledOut: at("pulled out clean", 93), raincoat2: at("that's the raincoat", 93), test5: at("test number five", 93), soaked: at("i soaked all three", 93), chest: at("chest freezer", 93),
  times30: at("30 times", 93), mildNJ: at("a mild new jersey winter", 93), airLooks: at("looking like the day i made it", 93), rough: at("a little rough", 93), flakeCrumble: at("started to flake and crumble", 93),
  sandy: at("went sandy", 93), canceled: at("canceled it out", 93), learned: at("here's what i learned", 93), bubblesGood: at("bubbles are good", 93), weakWins: at("the weak part wins", 93),
  another: at("another problem nobody", 93), cantMeasure: at("you can't measure it", 93), lawnmower: at("oil from a lawnmower", 93), diesel: at("a diesel truck", 93), miles: at("10,000 miles", 93),
  measuredDrops: at("carefully measured drops", 93), noIdea: at("no idea how much air", 93), tooMuch: at("too much is just as bad", 93), takesStrength: at("takes strength away", 93), truck: at("tested on the truck", 93),
  story: at("a quick story", 93), sal: at("we called him sal", 93), butter: at("finish like butter", 93), clifton: at("in clifton", 93), threeWinters: at("three winters later", 93),
  sunburn: at("like a bad sunburn", 93), nextDoor: at("right next door", 93), brandNew: at("looked brand new", 93), onlyDiff: at("the only difference", 93), tore: at("we tore sal's", 93),
  free2: at("poured it again for free", 93), expensive: at("the expensive part", 93), notExp: at("isn't even expensive", 93), bottle: at("a bottle of air", 93), dozens: at("dozens of", 93),
  gambling: at("gambling with your patio", 93), onePlace: at("one place oil really does belong", 700), onForms: at("on the forms", 93), wipe: at("you wipe the inside", 93), cleanOff: at("they come off clean", 93),
  oldGuys: at("the old guys used", 93), stains: at("it stains the concrete", 93), release: at("form release oil", 93), cooking: at("plain cooking oil", 93), thinFilm: at("a thin film", 93),
  actuallyReal: at("actually real", 93), straight: at("be straight with you", 93), metals: at("metals and chemicals", 93), soil: at("into the soil", 93), kids: at("where the kids play", 93),
  million: at("a million gallons", 93), law: at("against the law", 93), goodNews: at("here's the good news", 93), partsStore: at("auto parts store", 93), backJug1: at("pour it back in the jug", 93),
  whatDo: at("so what should you do", 93), threeThings: at("three things, and none", 93), lessWater: at("one, less water", 93), bigOne: at("this is the big one", 93), soupNot: at("not like soup", 93),
  slumpsFlat: at("slumps flat", 93), cure: at("two, cure it", 93), week: at("at least a week", 93), hose: at("a garden hose", 93), air3: at("3. get the air", 93),
  followDose: at("follow the dose", 93), bagged: at("a bagged mix", 93), airEnt: at("air-entrained concrete", 93), recipe: at("that's the whole recipe", 93), neverOnce: at("never once poured", 93),
  verdict: at("the verdict", 93), halfReal: at("half real", 93), fewDrops: at("a few drops", 93), wholeJug: at("a whole jug", 93), weakerList: at("weaker, greasy, ugly", 93),
  poison: at("leaks poison", 93), dump: at("going to the dump", 93), dontDo: at("don't do it", 93), backJug: at("put the oil back", 93), subscribe: at("hit subscribe", 93),
  bell: at("ring the bell", 93), nextTime: at("next time i'm going", 93), pitted: at("pitted and flaking", 93), comments: at("down in the comments", 93), hearAbout: at("i want to hear about it", 93),
  imFrank: at("i'm frank", 93), endLine: at("take care of your house", 93),
};

type Key = { t: number; p: number[]; l: number[]; fov?: number; arc?: number };
type Seg = { a: number; b: number; st: (t: number) => Partial<S>; keys: Key[] };

const BASE: S = {
  macro: 0, water: 0, hyd: 0, grab: 0, oil: 0, veins: 0, bub: 0, ice: 0, push: 0, relief: 0, flake: 0,
  wheel: 0, pourOil: 0, swirl: 0, dose: 0, forms: 0, fill: 0, plastic: 0, demold: 0, blocks: 0,
  drops: 0, scratch: 0, hammer: 0, frost: 0, crumble: 0, dump: 0, bars: [0, 0, 0], barsOn: 0, hi: 0,
};

// vistas tipo
const WHEEL = { p: [4.55, 2.15, 6.0], l: [4.0, 0.75, 3.6], fov: 38 };        // la carretilla desde arriba-adelante
const WHEEL_CLOSE = { p: [4.25, 1.55, 4.6], l: [4.0, 0.74, 3.6], fov: 34 };  // el remolino negro, de cerca
const BENCH = { p: [7.2, 2.25, 4.4], l: [7.2, 1.25, 0.6], fov: 38 };        // los 3 bloques en la balanza
const BENCH_LOW = { p: [7.2, 1.6, 3.2], l: [7.2, 1.25, 0.6], fov: 34 };      // a la altura de los bloques
const MACRO = { p: [0, 1.55, 6.2], l: [0, 1.5, 1.5], fov: 36 };              // la cara entera del corte
const MACRO_CLOSE = { p: [0.35, 1.75, 2.75], l: [0.25, 1.65, 1.5], fov: 32 }; // granos y burbujas de cerca
const WIDE = { p: [3.6, 4.6, 12.5], l: [4.2, 1.0, 0.2], fov: 40 };           // todo el patio: el bloque gigante y el banco
const DOSE = { p: [6.0, 2.35, 4.2], l: [6.15, 1.2, 1.0], fov: 34 };       // la cucharada contra el bidón
const B2_CLOSE = { p: [7.45, 1.55, 1.95], l: [7.2, 1.2, 0.6], fov: 30 };     // el bloque 2 de cerca
const DUMP = { p: [8.6, 2.9, 6.6], l: [9.4, 0.9, -0.9], fov: 40 };           // banco + volquete
const k = (t: number, v: { p: number[]; l: number[]; fov: number }, dp: number[] = [0, 0, 0], arc?: number): Key => ({ t, p: [v.p[0] + dp[0], v.p[1] + dp[1], v.p[2] + dp[2]], l: v.l, fov: v.fov, arc });

const s_ = ST;
const R = RS;
const SEG: Seg[] = [
  // ===== minuto 1 · la carretilla del video viral (3,0 → 6,1) =====
  { a: 0, b: s_.picks + 0.3, st: (t) => ({ wheel: E(t, s_.wheel - 0.4, s_.wheel + 0.6) }),
    keys: [k(0, WIDE), k(s_.wheel + 0.2, WHEEL, [0.3, 0.4, 0.8]), k(s_.picks + 0.3, WHEEL_CLOSE)] },
  // ===== "¿qué daño hace?" — el chorro y el remolino, desde arriba (37,6 → 41,7) =====
  { a: s_.free + 1.0, b: s_.tellYou + 0.4, st: (t) => ({ wheel: 1, pourOil: E(t, s_.whyNot - 0.6, s_.harm + 1.4), swirl: E(t, s_.whyNot + 0.4, s_.tellYou) }),
    keys: [k(s_.free + 1.0, WHEEL), k(s_.tellYou + 0.4, WHEEL_CLOSE, [0, 0.1, 0])] },
  // ===== los 3 bloques en la balanza de pruebas (68,5 → 78,2) =====
  { a: s_.show + 1.2, b: s_.stuff + 2.6, st: (t) => ({
      blocks: E(t, s_.three - 0.3, s_.three + 0.6), barsOn: 0,
      hi: t >= s_.stuff ? 3 : t >= s_.withOil ? 2 : t >= s_.plain ? 1 : 0,
    }),
    keys: [k(s_.show + 1.2, WIDE), k(s_.three + 0.8, BENCH, [0, 0.6, 1.2]), k(s_.sameDay, BENCH), k(s_.plain, BENCH_LOW, [-0.5, 0, 0]), k(s_.stuff + 2.6, BENCH_LOW, [0.6, 0, 0])] },
  // ===== "un pedacito de verdad": la cara del bloque gigante (84,5 → 93,9) =====
  { a: s_.surprised - 0.6, b: s_.start + 0.6, st: (t) => ({
      macro: E(t, s_.surprised - 0.6, s_.surprised + 0.8), hyd: 0.45, grab: 0.3,
      bub: E(t, s_.truth - 0.2, s_.truth + 1.2) * 0.6,
      oil: E(t, s_.notPiece - 0.3, s_.notPiece + 0.8) * 0.85, veins: E(t, s_.notPiece - 0.2, s_.start),
    }),
    keys: [k(s_.surprised - 0.6, WIDE), k(s_.surprised + 1.2, MACRO, [0, 0.4, 1.2]), k(s_.truth, MACRO), k(s_.notPiece + 0.3, MACRO_CLOSE), k(s_.start + 0.6, MACRO_CLOSE, [-0.15, 0, -0.1])] },
  // ================= RESTO =================
  // hidratación: el agua toca el cemento, crecen las agujas y agarran la arena (127 → 165)
  { a: 127.0, b: R.stone + 1, st: (t) => ({ macro: 1, water: E(t, 127.2, 129.5) * (1 - E(t, R.knit, R.stone)),
      hyd: E(t, R.crystals - 0.3, R.knit + 0.5), grab: E(t, R.grabOn - 0.4, R.knit + 1.2) }),
    keys: [k(127.0, MACRO, [0, 0.3, 1.0]), k(R.crystals, MACRO), k(R.needles + 0.5, MACRO_CLOSE), k(R.knit + 0.5, MACRO_CLOSE, [-0.2, 0, 0]), k(R.stone + 1, MACRO, [0.2, 0, 0.4])] },
  // el aceite envuelve los granos: impermeable de aceite (171 → 197)
  { a: 171.5, b: R.gloves + 2, st: (t) => ({ macro: 1, hyd: 0.8, grab: 0.9 - 0.75 * E(t, R.neverReacts - 0.5, R.raincoat),
      oil: E(t, R.coats - 0.4, R.wraps + 1.4), veins: E(t, R.wraps, R.raincoat + 0.5) }),
    keys: [k(171.5, MACRO, [0, 0.2, 0.6]), k(R.wraps, MACRO_CLOSE), k(R.raincoat, MACRO_CLOSE, [0.25, -0.05, -0.15]), k(R.gloves + 2, MACRO_CLOSE, [-0.2, 0.05, 0])] },
  // un poquito de aceite = burbujitas de aire (201 → 213,6)
  { a: 201.4, b: 213.6, st: (t) => ({ macro: 1, hyd: 0.8, grab: 0.8, oil: 0.2, bub: E(t, R.airBub - 0.4, R.airBub + 1.6) }),
    keys: [k(201.4, MACRO, [0, 0.3, 0.8]), k(R.airBub, MACRO), k(213.6, MACRO_CLOSE)] },
  // canales, hielo +9 %, empuja, salta la superficie (223 → 245,8)
  { a: 223.3, b: 245.8, st: (t) => ({ macro: 1, hyd: 0.8, grab: 0.8, water: E(t, R.channels - 0.3, R.channels + 1) * (1 - E(t, R.freezes, R.grows9)),
      ice: E(t, R.freezes - 0.3, R.grows9 + 1.0), push: E(t, R.pushes - 0.3, R.pops + 1.2), flake: E(t, R.pops, R.flaking + 1.5) }),
    keys: [k(223.3, MACRO, [0, 0.4, 1.2]), k(R.channels, MACRO), k(R.grows9, MACRO_CLOSE), k(R.pops + 0.5, MACRO, [0, 0.4, 0.2]), k(245.8, MACRO, [0.3, 0.6, 0.6])] },
  // las burbujas son cuartos vacíos: el hielo entra ahí y no empuja (250,4 → 262)
  { a: 250.4, b: 262.1, st: (t) => ({ macro: 1, hyd: 0.8, grab: 0.8, bub: 1, ice: 1, relief: E(t, 250.6, R.pushesInto + 1.6) }),
    keys: [k(250.4, MACRO_CLOSE, [0.1, 0, 0.3]), k(R.pushesInto + 1, MACRO_CLOSE), k(262.1, MACRO, [0, 0.2, 0.3])] },
  // la dosis de laboratorio (274 → 279)
  { a: 274.0, b: 279.2, st: (t) => ({ dose: E(t, 274.0, 275.0) }),
    keys: [k(274.0, BENCH, [-1.6, 0.3, 1.0]), k(279.2, DOSE)] },
  // cucharadas contra un cuarto entero (300,6 → 312)
  { a: 300.6, b: 312.0, st: () => ({ dose: 1 }),
    keys: [k(300.6, DOSE, [0.3, 0.2, 0.6]), k(R.tbsp, DOSE, [-0.35, -0.1, -0.3]), k(R.quart, DOSE, [0.45, 0.1, 0.2]), k(312.0, DOSE)] },
  // los moldes aceitados y el bloque 1 lleno (332 → 343,6)
  { a: 332.0, b: 343.6, st: (t) => ({ forms: E(t, 332.0, 333.2), fill: E(t, R.b1 - 0.3, R.b1 + 1.5) }),
    keys: [k(332.0, BENCH, [0, 0.5, 1.2]), k(R.b1, BENCH_LOW), k(343.6, BENCH_LOW, [0.4, 0, 0])] },
  // el bloque 2 a lo viral: chorro y remolino en la carretilla (355 → 370,5)
  { a: 355.0, b: 370.5, st: (t) => ({ wheel: 1, pourOil: E(t, 355.2, 358.8), swirl: E(t, 357.4, 368.0) }),
    keys: [k(355.0, WHEEL, [0.2, 0.3, 0.6]), k(359.5, WHEEL_CLOSE), k(366.3, WHEEL_CLOSE, [0.1, 0.05, -0.1]), k(370.5, WHEEL_CLOSE, [-0.2, -0.05, -0.3])] },
  // prueba 2: el agua — se absorbe en 1 y 3, se hace bolitas en 2 (446,6 → 473,6)
  { a: 446.6, b: 473.6, st: (t) => ({ forms: 1, demold: 1, blocks: 1, drops: E(t, R.test2 + 0.4, R.test2 + 3.2), hi: t >= 468 ? 2 : 0 }),
    keys: [k(446.6, BENCH, [0, 0.4, 0.8]), k(R.test2 + 1, BENCH_LOW), k(468.0, B2_CLOSE, [0.2, 0.1, 0.3]), k(473.6, B2_CLOSE)] },
  // pintura/sellador no agarran · prueba 3: la llave (482 → 490,2)
  { a: 482.0, b: 490.2, st: (t) => ({ forms: 1, demold: 1, blocks: 1, drops: 1 - E(t, 485.5, 486.5), scratch: E(t, 487.4, 489.8), hi: 2 }),
    keys: [k(482.0, B2_CLOSE, [0.3, 0.2, 0.5]), k(486.5, BENCH_LOW), k(490.2, B2_CLOSE)] },
  // prueba 4: el martillo — cuenta golpes (517 → 523)
  { a: 517.0, b: 523.0, st: (t) => ({ forms: 1, demold: 1, blocks: 1, scratch: 1, hammer: 0.42 * E(t, 517.2, 519.5) * (0.6 + 0.4 * Math.sin(t * 6)) }),
    keys: [k(517.0, BENCH, [0.2, 0.3, 0.6]), k(523.0, BENCH_LOW)] },
  // primer golpe bueno: la esquina del bloque 2 salta (527,9 → 541,4)
  { a: 527.9, b: 541.4, st: (t) => ({ forms: 1, demold: 1, blocks: 1, scratch: 1, hammer: 0.42 + 0.58 * E(t, R.firstHit - 1.2, R.firstHit + 0.9), hi: 2 }),
    keys: [k(527.9, BENCH_LOW, [0.4, 0.1, 0.3]), k(R.firstHit - 0.6, B2_CLOSE), k(541.4, B2_CLOSE, [-0.15, 0, -0.2])] },
  // prueba 5: el freezer (546,2 → 557,4)
  { a: 546.2, b: 557.4, st: (t) => ({ forms: 1, demold: 1, blocks: 1, hammer: 1, frost: E(t, R.test5, R.test5 + 2.5) }),
    keys: [k(546.2, BENCH, [0, 0.5, 1.0]), k(557.4, BENCH_LOW)] },
  // 30 heladas: el 3 intacto, el 2 se desgrana (568 → 574,5)
  { a: 568.0, b: 574.5, st: (t) => ({ forms: 1, demold: 1, blocks: 1, hammer: 1, frost: 1 - E(t, 568.2, 569.6), crumble: E(t, 569.4, 574.3), hi: t >= R.airLooks ? 3 : 0 }),
    keys: [k(568.0, BENCH_LOW), k(574.5, BENCH_LOW, [0.5, 0, 0])] },
  // el marcador (585 → 606,9)
  { a: 585.0, b: 606.9, st: (t) => { const b = E(t, 586.0, 588.0); return { forms: 1, demold: 1, blocks: 1, hammer: 1, crumble: 1, barsOn: E(t, 585.2, 586.0), bars: [0.7 * b, 0.22 * b, 0.86 * b], hi: t >= R.weakWins ? 2 : 0 }; },
    keys: [k(585.0, BENCH, [0, 0.6, 1.4]), k(595.4, BENCH, [0, 0.3, 0.6]), k(606.9, BENCH)] },
  // los laboratorios medían gotas (611 → 618)
  { a: 611.0, b: 618.0, st: () => ({ dose: 1 }),
    keys: [k(611.0, DOSE, [0.4, 0.2, 0.5]), k(618.0, DOSE, [-0.3, -0.1, -0.2])] },
  // en la carretilla, a ojo (618 → 624,3)
  { a: 618.0, b: 624.3, st: (t) => ({ wheel: 1, pourOil: E(t, 618.4, 621.4), swirl: E(t, 620.0, 624.3) }),
    keys: [k(618.0, WHEEL, [0.3, 0.3, 0.5]), k(624.3, WHEEL_CLOSE)] },
  // demasiado aire también le saca fuerza (628,5 → 633,5)
  { a: 628.5, b: 633.5, st: (t) => ({ macro: 1, hyd: 0.8, grab: 0.8 - 0.4 * E(t, R.takesStrength - 1, R.takesStrength + 1), bub: 1 }),
    keys: [k(628.5, MACRO, [0, 0.2, 0.5]), k(633.5, MACRO_CLOSE)] },
  // el patio de Sal: se descascara (652 → 658)
  { a: 652.0, b: 657.9, st: (t) => ({ macro: 1, hyd: 0.8, grab: 0.5, oil: 0.6, ice: 1, push: 1, flake: E(t, 652.4, 657.0) }),
    keys: [k(652.0, MACRO, [0, 0.5, 0.8]), k(657.9, MACRO, [0.3, 0.7, 0.3])] },
  // el de al lado, nuevo: misma obra, lo único distinto, la carretilla (662,8 → 676,3)
  { a: 662.8, b: 676.3, st: (t) => ({ forms: 1, demold: 1, blocks: 1, hammer: 1, crumble: 1, hi: t >= R.brandNew ? 3 : 2 }),
    keys: [k(662.8, BENCH, [0, 0.4, 0.9]), k(R.brandNew, BENCH_LOW, [0.8, 0, 0]), k(676.3, BENCH_LOW)] },
  // lo caro: reponerlo gratis (680,8 → 692,6)
  { a: 680.8, b: 692.6, st: () => ({ forms: 1, demold: 1, blocks: 1, hammer: 1, crumble: 1, hi: 2 }),
    keys: [k(680.8, WIDE), k(692.6, BENCH, [0, 0.4, 0.6])] },
  // una botella de aditivo vs dos cuartos de aceite (698,5 → 707,1)
  { a: 698.5, b: 707.1, st: () => ({ dose: 1 }),
    keys: [k(698.5, DOSE, [0.5, 0.3, 0.6]), k(707.1, DOSE)] },
  // el aceite mancha y se va al suelo (729,6 → 742,3)
  { a: 729.6, b: 742.3, st: () => ({ forms: 1, demold: 1, blocks: 1, hammer: 1, crumble: 1, hi: 2 }),
    keys: [k(729.6, B2_CLOSE, [0.3, 0.2, 0.5]), k(742.3, B2_CLOSE, [-0.2, -0.05, -0.2])] },
  // las 3 reglas sobre el banco (803 → 811,3)
  { a: 803.0, b: 811.3, st: () => ({ forms: 1, demold: 1, blocks: 1, hammer: 1, crumble: 1, hi: 3 }),
    keys: [k(803.0, WIDE), k(811.3, BENCH, [0, 0.3, 0.6])] },
  // veredicto: medio real (881,7 → 893)
  { a: 881.7, b: 893.0, st: (t) => { const b = E(t, 882.5, 884.5); return { forms: 1, demold: 1, blocks: 1, hammer: 1, crumble: 1, barsOn: E(t, 881.8, 882.6), bars: [0.7 * b, 0.22 * b, 0.86 * b], hi: t >= R.wholeJug ? 2 : 3 }; },
    keys: [k(881.7, BENCH, [0, 0.5, 1.1]), k(893.0, B2_CLOSE, [0, 0.2, 0.6])] },
  // el bloque 2 al volquete (903 → 909,6)
  { a: 903.0, b: 909.6, st: (t) => ({ forms: 1, demold: 1, blocks: 1, hammer: 1, crumble: 1, dump: E(t, 903.2, 906.4) }),
    keys: [k(903.0, BENCH, [0.4, 0.3, 0.6]), k(909.6, DUMP)] },
];

export const KEYS: Key[] = SEG.flatMap((s) => s.keys).sort((a, b) => a.t - b.t);
export const stateAt = (t: number): S => {
  let seg = SEG[0];
  for (const s of SEG) if (t >= s.a) seg = s;
  return { ...BASE, ...seg.st(Math.min(t, seg.b)) };
};
