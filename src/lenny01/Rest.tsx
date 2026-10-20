// lenny01 · DEL 1:16 AL FINAL (76,6 → 598,3 s) con el motor del kit: una base por frase (toma agnes / sifón 3D en corte /
// avatar) y CERO cortes secos; las piezas 2.5D viven en una capa aparte que cruza las transiciones. Todo anclado a la palabra
// con at("frase") sobre la voz real (caps.json). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill } from "remotion";
import { makeVideo, makeAt, Stamp, Beat, Tr } from "../kits/yanqui3d/engine";
import { BigNum, COL, Chips, DrawX, Flash, Tag, e } from "../kits/yanqui3d/lib";
import { CheckList, Mistake, MistakesDeal, NextCard, StepTitle, Versus, Words } from "../kits/yanqui3d/pieces";
import { K, FX, project } from "./pipe3d";
import { CAM, kf, kf3 } from "./cams";
import { W3, Clock15, Recipe, Pencil, Banner, Take } from "./bits";
import { T_MIN1 } from "./Min1";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

export const T0 = T_MIN1, TEND = 598.3;
const at = makeAt(CAPS as [string, number][]);

// ---------- anclas ----------
const A = {
  first: at("First you have to know"), think: at("what people think", 77), pipeU: at("letter U", 81), trap: at("the trap", 83), water: at("a little water", 85), gas: at("sewer gas", 86), kitchen: at("into your kitchen", 87),
  bend: at("low bend", 90), settles: at("settles", 91), night: at("Every night", 94), bacon: at("Bacon fat", 96), butter: at("butter", 97), oil: at("the oil", 97), hot: at("Hot", 100), liquid: at("liquid", 100),
  cold: at("cold pipe", 102), wax: at("white wax", 104), walls: at("sticks to the walls", 105), soap: at("soap scum", 108), hair: at("hair and coffee", 111), rice: at("rice", 112),
  year: at("Year after year", 115), thicker: at("thicker", 116), pencil: at("pencil", 118), clog: at("That's your clog", 120), rock: at("not a rock", 122), candle: at("it's a candle", 123), beat: at("you don't beat", 125),
  heat: at("with heat", 127), cuts: at("cuts the grease", 128),
  cup: at("here's the cup", 130), soda: at("baking soda", 132), salt: at("coarse salt", 134), table: at("Table salt", 136), kosher: at("Kosher salt", 138), mix: at("Mix them dry", 140), recipe: at("whole recipe", 143),
  alk: at("mildly alkaline", 146), cutsG: at("cuts grease", 148), soapy: at("soapy", 149), coarse: at("The salt is coarse", 152), scrubs: at("scrubs the walls", 153), chew: at("chew into", 157),
  neither: at("Neither one", 161), plastic: at("Not plastic", 162), steel: at("not old steel", 163), copper: at("not copper", 164), iron: at("cast iron", 165), matters: at("That matters", 168),
  s1: at("Step 1", 171), standing: at("standing water", 172), full: at("If your sink is full", 174), dissolves: at("dissolves in the sink", 178), mug: at("take a mug", 181), bucket: at("bucket", 183), low: at("as low as you can", 186),
  double: at("double sink", 188), rag: at("wet rag", 189), mind: at("Keep that in mind", 192), later: at("comes back later", 194),
  s2: at("Step 2", 196), melt: at("Melt it first", 197), squirt: at("Squirt", 198), dish: at("dish soap", 199), kettle: at("kettle of hot water", 202), listen: at("listen carefully", 203), hurt: at("get hurt", 207),
  whiteBlack: at("white or black plastic", 210), boiling: at("boiling water straight", 213), rated: at("rated for", 218), f140: at("140", 219), f212: at("212", 221), soften: at("soften the joints", 223), leak: at("start to leak", 225),
  sit: at("let the kettle sit", 227), tap: at("hottest water from your tap", 230), metal: at("pipes are metal", 234), hotter: at("go hotter", 235), slow: at("Pour it slow", 237), middle: at("middle of the drain", 239), ring: at("soften the grease ring", 242), work: at("get to work", 245),
  s3: at("Step 3", 247), pourDry: at("Pour the dry mix", 249), spoon: at("spoon", 252), oneMore: at("one more cup", 257), carry: at("carry it down", 261), notWhole: at("Not a whole kettle", 263), sitBend: at("sit right in that bend", 265), thick: at("thick and salty", 267), onTop: at("on top of the clog", 268),
  s4: at("Step 4", 270), wait: at("Now you wait", 271), fifteen: at("Fifteen minutes", 273), timer: at("Set a timer", 274), faucet: at("Don't run the faucet", 276), peek: at("Don't peek", 277), coffee: at("cup of coffee", 279), trick: at("the whole trick", 281),
  soaking: at("soaking into the grease", 284), grip: at("loosening its grip", 287), dump: at("Most people dump", 289), twoSec: at("two seconds later", 292), why: at("That's why", 294),
  s5: at("Step 5", 296), flushHard: at("Flush Hard", 297), fullK: at("full kettle", 299), same: at("The same rule", 303), hotTap: at("hot tap on full", 307), minute: at("a good minute", 309),
  hear: at("you'll hear it", 310), gulp: at("a gulp", 312), gurgle: at("a gurgle", 312), drops: at("water just drops", 314), letGo: at("letting go", 315), slowM: at("slow but moving", 318), oneMoreT: at("one more time", 320), twoRounds: at("Two rounds", 321),
  s6: at("Step 6", 325), stuck: at("still stuck", 327), plunger: at("grab the plunger", 328), right: at("the right one", 330), flat: at("flat cup plunger", 334), flange: at("the flange", 336), twoIn: at("2 inches of water", 339), covered: at("cup is covered", 341),
  remember: at("remember that rag", 343), tight: at("Hold it down tight", 345), bath: at("bathroom sink", 348), overflow: at("overflow hole", 350), another: at("another opening", 354), escapes: at("escapes out of it", 356), nothing: at("nothing hits the clog", 358),
  gently: at("Push down gently", 359), air: at("get the air out", 361), pump: at("pump hard", 362), straight: at("straight up and down", 363), ten: at("10 or 15", 365), pull: at("Pull it off fast", 367), runHot: at("run the hot water again", 369),
  bathrooms: at("Now bathroom sinks", 372), kitG: at("In the kitchen it's grease", 376), bathH: at("In the bathroom it's hair", 377), soapH: at("held together by soap", 379), net: at("like a net", 383), stopper: at("pull the stopper out", 384),
  lift: at("just lift out", 387), nutRod: at("holds the rod", 390), rope: at("slimy rope of hair", 393), know: at("I know", 395), disg: at("disgusting", 397), towel: at("paper towel", 399),
  strips: at("barbed drain strips", 402), three: at("three dollars", 404), push: at("push it down", 406), twist: at("twist and pull", 407), amazed: at("You'll be amazed", 409), cupAgain: at("Then do the cup", 410), soapHeld: at("the soap that held", 413),
  mistakes: at("Now the mistakes", 416), houses: at("people's houses", 419), m1: at("Mistake number one", 422), caustic: at("caustic drain cleaner", 423), lye: at("lye or acid", 427), newPl: at("new plastic line", 429), galv: at("galvanized steel", 433), chrome: at("chrome trap", 435), eat: at("eat that metal", 437), inside: at("from the inside", 438),
  crumbled: at("crumbled in my hand", 442), burns: at("burns your skin", 448), arms: at("put his arms in it", 451), charge: at("So I charge more", 453), every: at("Every plumber does", 454),
  m2: at("Mistake number two", 456), mixing: at("mixing things", 458), bleach: at("bleach on top", 462), brand: at("another brand", 464), gasB: at("make gas", 466), breathe: at("never breathe", 467), oneP: at("one product at a time", 468), dontPlunge: at("don't plunge", 472), splashes: at("It splashes", 474),
  m3: at("Mistake number three", 475), wrong: at("wrong place", 478), told: at("I already told you", 479), toilet: at("into a toilet", 483), crack: at("crack from the shock", 486), buying: at("buying a toilet", 488),
  m4: at("Mistake number four", 490), jar: at("grease jar", 491), comes: at("comes back", 494), fat: at("pouring fat", 495), can: at("old can or jar", 497), cool: at("Let the grease cool", 500), trash: at("with the trash", 504), wipe: at("Wipe greasy pans", 505), habit: at("That one habit", 509), money: at("more money", 511),
  mine: at("here's what I do", 514), dont: at("drains don't clog", 517), month: at("a month", 519), sunday: at("Sunday night", 520), soapK: at("Soap and a kettle", 523), cupR: at("the cup, 15", 525), flushR: at("flush.", 526), twoMin: at("two minutes of actual work", 527), never: at("never gets a chance", 530), snake: at("never had to snake", 534),
  call: at("call somebody", 539), moreOne: at("more than one drain", 541), gurglesT: at("toilet gurgles", 545), tub: at("comes up in the tub", 547), notSink: at("not a sink clog", 549), mainL: at("your main line", 552), street: at("toward the street", 553), roots: at("tree roots", 555), brokenP: at("broken pipe", 556),
  noCup: at("No cup is going", 557), flood: at("flood your basement", 560), real: at("real plumber", 563), camera: at("with a camera", 564),
  slowS: at("the slow sink", 566), kitchenW: at("won't drain", 568), hairS: at("full of hair", 570), oneCup: at("One cup", 571), half: at("Half baking soda", 572), meltF: at("Melt it first", 574), give: at("give it 15", 575), flushIt: at("flush it hard", 577),
  cents: at("10 cents", 579), keep: at("keep your $500", 580), saved: at("saved you a service call", 582), like: at("hit like", 584), subscribe: at("subscribe", 585), next: at("Next time", 588), toiletC: at("toilet clog", 589), instead: at("the trick I use instead", 591),
  imLenny: at("I'm Lenny", 593), house: at("Take care of your house", 594), seeYou: at("see you next time", 595),
};

// ---------- niveles del sifón por frase (la historia del tapón) ----------
const G0 = (t: number) => 0.15 + 0.3 * e(t, A.wax, A.walls + 1) + 0.25 * e(t, A.soap, A.hair + 1) + 0.3 * e(t, A.year, A.pencil + 0.6);

// ---------- helpers de beats ----------
type TB = Beat & { need?: number };
const S3 = (a: number, tr: Tr, kfs: K[], fx: (t: number) => FX, p?: [number, number], extra?: (t: number) => React.ReactNode, blur = 0): TB =>
  ({ a, tr, p, r: (t) => <AbsoluteFill><W3 t={t} kf={kfs} fx={fx(t)} blur={blur} dark={blur > 0 ? 0.3 : 0} />{extra?.(t)}</AbsoluteFill> });
const TKs: TB[] = [];
const TK = (a: number, k: string, tr: Tr, p?: [number, number], z?: [number, number], extra?: (t: number) => React.ReactNode): TB => {
  const b: TB = { a, tr, p, k, r: (t) => <AbsoluteFill><Take t={t} k={k} a={a} need={b.need ?? 5} z={z} />{extra?.(t)}</AbsoluteFill> };
  TKs.push(b); return b;
};

// cámaras de cada tramo 3D
const K1 = kf3(T0 - 0.2, 79.0, 79.5, CAM.trapL, CAM.trap, CAM.trap);
const K2 = kf3(84.0, 88.5, 94.3, CAM.under, CAM.trap, CAM.bend);
const K3 = kf3(100.2, 106.0, 112.4, CAM.drain, CAM.trapL, CAM.bend);
const K4 = kf(116.3, 122.8, CAM.bend, CAM.trap);
const K5 = kf(125.0, 127.8, CAM.trap, CAM.trapL);
const K6 = kf3(145.7, 152.5, 158.9, CAM.trapL, CAM.bend, CAM.trap);
const K7 = kf(171.5, 174.5, CAM.wide, CAM.basin);
const K8 = kf(177.9, 181.4, CAM.basin, CAM.surf);
const K9 = kf(185.8, 188.3, CAM.basin, CAM.wide2);
const K10 = kf(193.0, 199.0, CAM.right, CAM.under);
const K11 = kf(214.8, 220.7, CAM.under, CAM.nut);
const K12 = kf(225.5, 228.7, CAM.nut, CAM.trapL);
const K13 = kf3(241.7, 244.5, 247.4, CAM.trapL, CAM.bend, CAM.trap);
const K14 = kf(261.4, 267.7, CAM.drain, CAM.bend);
const K15 = kf(282.9, 286.1, CAM.bend, CAM.trap);
const K16 = kf(294.2, 297.6, CAM.trap, CAM.trapL);
const K17 = kf3(310.2, 313.8, 317.6, CAM.trapL, CAM.bend, CAM.arm);
const K18 = kf(355.6, 360.0, CAM.under, CAM.trap);
const K19 = kf(364.0, 367.5, CAM.trap, CAM.trapL);
const K20 = kf(410.6, 413.7, CAM.trap, CAM.bend);
const K21 = kf(426.4, 429.0, CAM.trapL, CAM.trap);
const K22 = kf(433.5, 440.1, CAM.trap, CAM.bend);
const K23 = kf(461.0, 464.3, CAM.arm, CAM.trap);
const K24 = kf(475.5, 479.7, CAM.under, CAM.nut);
const K25 = kf(490.0, 497.6, CAM.drain, CAM.trap);
const K26 = kf(523.6, 530.3, CAM.wide, CAM.trap);
const K27 = kf3(535.5, 540.8, 541.2, CAM.stack, CAM.main, CAM.main);
const K28 = kf(545.4, 548.5, CAM.house, CAM.base);
const K29 = kf3(551.9, 554.8, 557.6, CAM.main, CAM.rootsW, CAM.roots);
const K30 = kf(565.5, 571.3, CAM.wide, CAM.trapL);
const K31 = kf(571.0, 579.1, CAM.trap, CAM.bend);
const K32 = kf(593.4, 598.4, CAM.trap, CAM.wide, 0.2);

const fxBase = (t: number): FX => ({ grease: 1, scum: 0.6, debris: 0.9 });

export const V = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: AVAIL as { clips: string[]; imgs: string[] }, T0, TEND, flashAtStart: false,
  beats: ({ AV }) => {
    const B: TB[] = [
      // 1 · qué estás peleando: el sifón, el sello de agua, la grasa que se vuelve cera
      S3(T0, "cut", K1, () => ({ grease: 0.85, scum: 0.5, debris: 0.8 })),
      AV(78.84, "whip", { spans: [[A.pipeU - 0.2, 84.1]] }),
      S3(84.1, "zoom", K2, (t) => ({ grease: 0.2, gas: e(t, A.gas - 0.2, A.gas + 0.4) * (1 - e(t, 90.5, 91.2)), seal: 1 })),
      AV(94.11, "whipL", { spans: [[A.bacon - 0.2, 98.8]] }),
      TK(98.8, "s01", "portal", [960, 640]),
      S3(100.4, "zoom", K3, (t) => ({ grease: 0.15 + 0.35 * e(t, A.wax, A.walls + 1) + 0.15 * e(t, A.soap, A.hair), drip: 1 - e(t, A.soap - 0.3, A.soap + 0.4), scum: e(t, A.soap, A.soap + 0.8), debris: e(t, A.hair - 0.2, A.rice + 0.3) }), [960, 540]),
      AV(112.13, "light", { spans: [[A.year - 0.2, 116.5]] }),
      S3(116.5, "zoom", K4, (t) => ({ grease: G0(t), scum: 0.6, debris: 1 }), [960, 540]),
      TK(A.rock - 0.4, "s02", "flip"),
      S3(125.2, "whip", K5, (t) => ({ grease: 1, scum: 0.6, debris: 1, hot: e(t, A.heat - 0.2, A.heat + 0.5) })),
      AV(127.54, "portal", { p: [960, 420] }),
      // 2 · la taza: bicarbonato + sal gruesa
      TK(131.29, "s03", "whip"),
      TK(A.salt - 0.3, "s04", "push"),
      AV(140.73, "light", { spans: [[140.73, 145.9]] }),
      S3(145.9, "zoom", K6, (t) => ({ grease: 1 - 0.15 * e(t, A.chew - 1, A.chew + 1), scum: 0.6 - 0.4 * e(t, A.cutsG, A.soapy + 1), debris: 0.8, mix: 1, fizz: e(t, A.cutsG - 0.2, A.cutsG + 0.4), scrub: e(t, A.scrubs - 0.3, A.scrubs + 0.3) }), [960, 540]),
      AV(158.69, "whipL", { spans: [[A.plastic - 0.2, 163.6]] }),
      TK(163.6, "s05", "portal", [960, 700]),
      // 3 · PASO 1: sacar el agua
      S3(171.6, "light", K7, (t) => ({ basin: 0.95, grease: 1, scum: 0.6 })),
      AV(174.32, "whip"),
      S3(178.0, "zoom", K8, (t) => ({ basin: 0.95, grease: 1, mix: 0 }), [960, 540]),
      TK(A.mug - 0.3, "s06", "whipL"),
      S3(A.low - 0.25, "push", K9, (t) => ({ basin: 0.95 - 0.75 * e(t, A.low, A.low + 1.8), grease: 1 })),
      TK(A.double - 1.0, "s07", "whip"),
      AV(189.38, "portal", { p: [1100, 600], spans: [[A.mind - 0.2, 193.1]] }),
      S3(193.1, "zoom", K10, (t) => ({ rag: 1, grease: 1, basin: 0.2 }), [960, 540]),
      // 4 · PASO 2: derretir primero (jabón + agua caliente) y la regla del plástico
      TK(A.squirt - 0.3, "s08", "flip"),
      TK(A.kettle - 0.3, "s09", "whip"),
      AV(205.98, "light", { spans: [[A.whiteBlack - 0.2, 209.8]] }),
      TK(209.8, "s10", "push"),
      S3(214.9, "zoom", K11, (t) => ({ grease: 1, hot: 0.4 + 0.6 * e(t, A.f212 - 0.5, A.f212), soften: 0 }), [960, 540]),
      AV(220.48, "whipL", { spans: [[220.48, 223.2]] }),
      S3(225.6, "zoom", K12, (t) => ({ grease: 1, hot: 1, soften: e(t, 225.6, A.leak + 0.4) }), [960, 540]),
      TK(A.sit - 0.3, "s11", "whip"),
      TK(A.metal - 0.3, "s12", "light"),
      AV(237.98, "portal", { p: [960, 500], spans: [[A.ring - 0.2, 241.8]] }),
      S3(241.8, "zoom", K13, (t) => ({ grease: 1 - 0.2 * e(t, 242, 246), scum: 0.6 - 0.4 * e(t, 242, 246), hot: 1, seal: 1 }), [960, 540]),
      // 5 · PASO 3: la taza por el desagüe
      TK(A.pourDry - 0.3, "s13", "whipL"),
      AV(251.98, "whip", { spans: [[A.spoon - 0.2, 257.3]] }),
      TK(257.3, "s14", "push"),
      S3(A.carry - 0.6, "zoom", K14, (t) => ({ grease: 0.8, scum: 0.2, mix: e(t, A.carry - 0.4, A.sitBend + 0.5), hot: 0.4 }), [960, 540]),
      AV(267.52, "light", { spans: [[A.s4 - 0.2, 273.1]] }),
      // 6 · PASO 4: esperar 15 minutos
      TK(273.1, "s15", "whip"),
      TK(A.coffee - 0.4, "s16", "flip"),
      S3(A.trick + 1.9, "zoom", K15, (t) => ({ grease: 0.8 - 0.1 * e(t, A.soaking, A.grip + 1), scum: 0.2, mix: 1, fizz: 0.8 }), [960, 540]),
      AV(285.93, "whipL", { spans: [[A.dump - 0.2, 289.7]] }),
      TK(289.7, "s17", "push"),
      S3(A.why - 0.3, "zoom", K16, (t) => ({ grease: 0.8, scum: 0.3, flush: e(t, A.why - 0.3, A.why + 0.4) }), [960, 540]),
      // 7 · PASO 5: la descarga fuerte
      TK(A.flushHard - 0.15, "s18", "whip"),
      AV(300.69, "light", { spans: [[A.same - 0.2, 305.1]] }),
      TK(305.1, "s19", "push"),
      S3(A.hear - 0.4, "zoom", K17, (t) => ({ grease: 0.8, scum: 0.2, hot: 1, flush: e(t, A.hear - 0.4, A.hear + 0.4), letgo: e(t, A.gulp, A.letGo + 0.6), gurgle: e(t, A.gurgle - 0.2, A.gurgle) * (1 - e(t, A.drops, A.drops + 0.4)) }), [960, 540]),
      AV(317.35, "whipL", { spans: [[A.twoRounds - 0.2, 321.5]] }),
      TK(321.5, "s20", "portal", [960, 600]),
      // 8 · PASO 6: el sopapo correcto y la presión que se escapa
      TK(A.plunger - 0.4, "s21", "whip"),
      AV(334.08, "light", { spans: [[334.08, 338.9]] }),
      TK(338.9, "s22", "push"),
      TK(A.remember - 0.2, "s23", "whip"),
      TK(A.bath - 0.3, "s24", "zoom", [960, 540]),
      AV(349.66, "whipL", { spans: [[A.another - 0.2, 355.7]] }),
      S3(355.7, "zoom", K18, (t) => ({ grease: 0.85, plunge: 1, escape: 1 - e(t, A.nothing + 0.5, A.nothing + 1.2), rag: e(t, A.nothing + 0.4, A.nothing + 1.0), basin: 0.25 }), [960, 540]),
      TK(359.8, "s25", "whip"),
      S3(A.ten - 0.2, "push", K19, (t) => ({ grease: 0.85 * (1 - 0.6 * e(t, A.pull - 0.3, A.pull + 0.5)), plunge: 1 - e(t, A.pull - 0.2, A.pull), letgo: e(t, A.pull - 0.3, A.pull + 0.6), rag: 1, escape: 0 })),
      TK(A.pull + 0.3, "s26", "whip"),
      AV(369.83, "light", { spans: [[A.bathrooms - 0.2, 373.2]] }),
      // 9 · baño: el pelo
      TK(373.2, "s27", "push"),
      TK(A.soapH + 0.5, "s28", "whip"),
      AV(384.01, "whipL", { spans: [[A.lift - 0.2, 388.3]] }),
      TK(388.3, "s29", "zoom", [960, 540]),
      TK(A.rope + 0.3, "s30", "whip"),
      AV(396.83, "light"),
      S3(400.7, "push", kf(400.7, 407.9, CAM.drain, CAM.trapL), () => ({ grease: 0.4, scum: 0.6, debris: 1 })),
      TK(A.twist + 0.2, "s32", "whip"),
      S3(A.cupAgain - 0.3, "zoom", K20, (t) => ({ grease: 0.5, scum: 0.5 - 0.4 * e(t, A.soapHeld, A.soapHeld + 1.2), mix: 1, fizz: 1, debris: 0.4 }), [960, 540]),
      AV(413.52, "whipL", { spans: [[A.mistakes - 0.2, 417.6]] }),
      // 10 · los errores
      S3(417.6, "flip", kf(417.6, 422.5, CAM.wide, CAM.wide2), () => ({ grease: 0.8 }), undefined, undefined, 10),
      TK(422.4, "s33", "push"),
      S3(426.5, "zoom", K21, (t) => ({ grease: 0.7, metal: 1, rust: 0.2 + 0.5 * e(t, 426.5, 428.8) }), [960, 540]),
      AV(428.84, "whip", { spans: [[A.galv - 0.2, 433.6]] }),
      S3(433.6, "zoom", K22, (t) => ({ grease: 0.7, metal: 1, rust: 0.7 + 0.3 * e(t, A.eat, A.inside + 0.6) }), [960, 540]),
      TK(439.9, "s34", "flip"),
      AV(444.99, "light", { spans: [[A.burns - 0.2, 450.8]] }),
      TK(450.8, "s35", "push"),
      TK(456.7, "s36", "whip"),
      S3(461.0, "zoom", K23, (t) => ({ grease: 0.7, gas: e(t, 461.0, 462.0) }), [960, 540]),
      AV(464.13, "whipL", { spans: [[A.gasB - 0.2, 468.8]] }),
      S3(468.8, "light", kf(468.8, 472.6, CAM.trap, CAM.arm), () => ({ grease: 0.7, gas: 1 })),
      TK(472.4, "s37", "whip"),
      S3(475.6, "zoom", K24, (t) => ({ grease: 0.6, hot: 1, soften: e(t, A.told - 0.5, A.told + 0.4) }), [960, 540]),
      AV(479.5, "whip", { spans: [[A.toilet - 0.2, 484.6]] }),
      TK(484.6, "s38", "push"),
      S3(490.1, "zoom", K25, (t) => ({ grease: 0.2 + 0.7 * e(t, A.comes, A.fat + 1.2), drip: 1, pan: 1 }), [960, 540]),
      AV(497.43, "light", { spans: [[A.can - 0.2, 501.8]] }),
      TK(501.8, "s40", "push"),
      TK(A.wipe - 0.2, "s41", "whip"),
      TK(A.habit - 0.2, "s39", "zoom", [960, 540], [1.05, 1.18]),
      AV(513.86, "whipL", { spans: [[A.mine - 0.2, 518.8]] }),
      // 11 · lo que hago yo: una vez por mes
      TK(518.8, "s42", "push"),
      S3(523.7, "zoom", K26, (t) => ({ grease: 0.08, scum: 0, seal: 1 }), [960, 540]),
      AV(530.09, "portal", { p: [960, 520], spans: [[A.snake - 0.2, 535.6]] }),
      // 12 · cuándo llamar a alguien: el caño principal
      S3(535.6, "zoom", K27, (t) => ({ grease: 0.3, backup: 0.2 * e(t, 538, 541) }), [960, 540]),
      TK(A.moreOne - 0.3, "s43", "whip"),
      S3(545.5, "push", K28, (t) => ({ grease: 0.3, backup: 0.2 + 0.8 * e(t, 545.5, 548.3), roots: 0.6, crack: 1 })),
      AV(548.28, "whip", { spans: [[A.mainL - 0.2, 552.0]] }),
      S3(552.0, "zoom", K29, (t) => ({ grease: 0.3, backup: 1, roots: 0.4 + 0.6 * e(t, A.roots - 0.6, A.roots + 0.8), crack: e(t, A.brokenP - 0.3, A.brokenP + 0.3) }), [960, 540]),
      TK(A.noCup + 0.1, "s44", "push"),
      AV(561.98, "light", { spans: [[A.real - 0.2, 565.6]] }),
      // 13 · el resumen y el cierre
      S3(565.6, "zoom", K30, (t) => ({ grease: 0.9, scum: 0.5, debris: 0.8 }), [960, 540]),
      S3(571.1, "light", K31, (t) => ({ grease: 0.9 * (1 - 0.8 * e(t, A.flushIt - 0.3, A.flushIt + 1.2)), mix: e(t, A.half, A.half + 1) * (1 - e(t, A.flushIt - 0.3, A.flushIt + 0.5)), hot: e(t, A.meltF - 0.2, A.meltF + 0.3), letgo: e(t, A.flushIt - 0.2, A.flushIt + 1.2), flush: e(t, A.flushIt - 0.3, A.flushIt + 0.4), fizz: e(t, A.give - 0.2, A.give + 0.3) * (1 - e(t, A.flushIt - 0.3, A.flushIt)) })),
      AV(578.92, "whip", { spans: [[A.cents - 0.2, 582.2]] }),
      TK(582.2, "s45", "push"),
      S3(A.next - 0.3, "whip", kf(587.7, 593.5, CAM.trapL, CAM.trap), () => ({ grease: 0, seal: 1 }), undefined, undefined, 9),
      S3(593.5, "light", K32, () => ({ grease: 0, seal: 1 })),
    ];
    B.forEach((b, i) => { if (b.k) (b as TB).need = (B[i + 1]?.a ?? TEND) - b.a; });
    return B;
  },
  pieces: (t, { at: _at }) => {
    const pj = (q: number[], kfs: K[]) => project(t, q, kfs);
    const trap2 = pj([-0.19, 0.345, 0], K2), seal2 = pj([-0.13, 0.44, 0], K2), arm2 = pj([0.25, 0.48, 0], K2);
    const bend4 = pj([-0.19, 0.35, 0], K4), nut11 = pj([-0.25, 0.43, 0], K11), nut12 = pj([-0.25, 0.43, 0], K12);
    const bend14 = pj([-0.19, 0.35, 0], K14), rt29 = pj([8.3, -2.6, 0], K29), main27 = pj([5, -2.6, 0], K27), arm17 = pj([0.1, 0.48, 0], K17);
    return [
      // qué estás peleando
      <Tag key="u" t={t} at={A.pipeU} x={1250} y={460} dx={-120} dy={-150} text="SHAPED LIKE A U" col={COL.ice} out={84.0} />,
      <Tag key="trap" t={t} at={Math.max(84.4, A.trap)} x={trap2.x} y={trap2.y} dx={-260} dy={130} text="THE TRAP" col={COL.amber} out={93.8} size={56} />,
      <Tag key="seal" t={t} at={A.water} x={seal2.x} y={seal2.y} dx={250} dy={130} text="WATER SEAL" sub="ON PURPOSE" col={COL.ice} out={93.8} />,
      <Tag key="gas" t={t} at={A.gas} x={arm2.x} y={arm2.y} dx={180} dy={-150} text="SEWER GAS" sub="CAN'T GET PAST" col="#9fd34a" out={90.6} />,
      <Banner key="settle" t={t} at={A.settles} out={94.0} text="WHERE EVERYTHING SETTLES" col={COL.amber} y={110} size={64} />,
      <Words key="fats" t={t} items={[{ at: A.bacon, txt: "BACON FAT" }, { at: A.butter, txt: "BUTTER" }, { at: A.oil, txt: "PAN OIL", col: COL.amber }]} out={100.2} y={820} size={86} />,
      <Words key="liq" t={t} items={[{ at: A.hot, txt: "HOT = LIQUID", col: COL.amber }]} out={A.cold - 0.2} y={160} size={90} />,
      <Banner key="wax" t={t} at={A.wax} out={A.soap - 0.3} text="COLD PIPE → SOFT WHITE WAX" col={COL.ink} y={110} size={64} />,
      <Words key="trap3" t={t} items={[{ at: A.soap, txt: "+ SOAP SCUM", col: COL.dim }, { at: A.hair, txt: "+ HAIR" }, { at: A.hair + 0.6, txt: "+ COFFEE" }, { at: A.rice, txt: "+ RICE", col: COL.ice2 }]} out={112.0} y={900} size={64} />,
      <Pencil key="pen" t={t} at={A.pencil - 0.2} out={A.clog + 1.0} x={1400} y={880} />,
      <Tag key="clog" t={t} at={A.clog} x={bend4.x} y={bend4.y} dx={-240} dy={-150} text="YOUR CLOG" col={COL.red} out={122.6} size={60} />,
      <Words key="candle" t={t} items={[{ at: A.rock, txt: "NOT A ROCK" }, { at: A.candle, txt: "A CANDLE", col: COL.amber }]} out={125.0} y={150} size={96} />,
      <Words key="beat" t={t} items={[{ at: A.heat, txt: "HEAT", col: COL.amber }, { at: A.cuts, txt: "+ GREASE CUTTER", col: COL.ice }]} out={131.0} y={860} size={84} />,
      // la taza
      <Recipe key="rec" t={t} at={A.soda - 0.1} at2={A.salt} at3={A.mix} out={145.6} x={1400} y={520} />,
      <Words key="salts" t={t} items={[{ at: A.table, txt: "TABLE SALT ✓", col: COL.dim }, { at: A.kosher, txt: "KOSHER / ROCK ★", col: COL.amber }]} out={140.5} y={150} size={64} />,
      <Words key="chem" t={t} items={[{ at: A.alk, txt: "ALKALINE", col: COL.ice }, { at: A.cutsG, txt: "CUTS GREASE" }, { at: A.soapy, txt: "→ SOAPY", col: "#5ee38f" }]} out={152.4} y={160} size={76} />,
      <Words key="scr" t={t} items={[{ at: A.scrubs, txt: "SALT SCRUBS", col: COL.ink }, { at: A.chew, txt: "CHEWS THE RING", col: COL.amber }]} out={158.5} y={880} size={72} />,
      <Chips key="pipes" t={t} at={A.plastic} items={["PLASTIC ✓", "OLD STEEL ✓", "COPPER ✓", "CAST IRON ✓"]} out={170.5} y={880} />,
      // paso 1
      <StepTitle key="s1" t={t} at={A.s1} n={1} name="GET THE WATER OUT" out={A.full - 0.1} y={300} />,
      <Tag key="cant" t={t} at={A.full + 0.3} x={1400} y={300} dx={-80} dy={-110} text="THE CUP CAN'T REACH" col={COL.red} out={178.0} size={44} />,
      <Banner key="diss" t={t} at={A.dissolves} out={181.0} text="IT JUST DISSOLVES UP HERE" col={COL.red} y={120} size={64} />,
      <Banner key="low" t={t} at={A.low} out={188.0} text="AS LOW AS YOU CAN" col={COL.ice} y={120} size={64} />,
      <Stamp key="mind" t={t} at={A.mind} text="REMEMBER THE RAG" x={1420} y={820} out={192.9} rot={-6} size={64} />,
      // paso 2
      <StepTitle key="s2" t={t} at={A.s2} n={2} name="MELT IT FIRST" out={A.squirt + 0.4} y={300} />,
      <Words key="care" t={t} items={[{ at: A.listen, txt: "LISTEN CAREFULLY", col: COL.red }]} out={205.9} y={170} size={90} />,
      <Banner key="nob" t={t} at={A.boiling} out={214.7} text="PLASTIC PIPE? NO BOILING WATER" col={COL.red} y={120} size={64} />,
      <Versus key="vt" t={t} at={A.rated} out={223.2} title="YOUR PLASTIC PIPE" L={{ label: "RATED", val: "140°F", h: 0.45, col: COL.ice, mark: "ok" }} R={{ label: "BOILING", val: "212°F", h: 0.72, col: COL.red, mark: "x" }} />,
      <Tag key="joint" t={t} at={A.leak - 0.4} x={nut12.x} y={nut12.y} dx={240} dy={-140} text="JOINT SOFTENS" sub="AND LEAKS" col={COL.red} out={228.6} />,
      <Tag key="nut" t={t} at={215.4} x={nut11.x} y={nut11.y} dx={-240} dy={-130} text="PVC JOINT" col={COL.dim} out={A.rated - 0.1} size={40} />,
      <Words key="alt" t={t} items={[{ at: A.sit, txt: "OFF THE HEAT A FEW MINUTES", col: COL.ice }, { at: A.tap, txt: "OR HOTTEST TAP", col: COL.ice2 }]} out={234.1} y={900} size={56} />,
      <Words key="met" t={t} items={[{ at: A.metal, txt: "METAL PIPES → HOTTER", col: COL.amber }]} out={237.9} y={170} size={70} />,
      <Words key="slow" t={t} items={[{ at: A.slow, txt: "SLOW · STEADY · CENTER" }]} out={A.ring - 0.3} y={900} size={64} />,
      <Banner key="soft" t={t} at={A.ring + 0.3} out={247.0} text="THE RING SOFTENS" col={COL.amber} y={120} size={64} />,
      // paso 3
      <StepTitle key="s3" t={t} at={A.s3} n={3} name="THE CUP" out={A.pourDry + 0.5} y={300} />,
      <Words key="one" t={t} items={[{ at: A.oneMore, txt: "+ 1 CUP HOT WATER", col: COL.ice }]} out={A.notWhole + 0.6} y={170} size={80} />,
      t < A.sitBend - 0.2 ? <DrawX key="nk" t={t} at={A.notWhole} x={1300} y={280} w={420} h={300} /> : null,
      <Words key="nk2" t={t} items={[{ at: A.notWhole, txt: "NOT A WHOLE KETTLE", col: COL.red }]} out={A.sitBend - 0.2} y={880} size={64} />,
      <Tag key="sitb" t={t} at={A.sitBend} x={bend14.x} y={bend14.y} dx={-260} dy={-150} text="SITS IN THE BEND" sub="THICK AND SALTY" col={COL.amber} out={267.4} />,
      // paso 4
      <StepTitle key="s4" t={t} at={A.s4} n={4} name="NOW YOU WAIT" out={A.fifteen - 0.1} y={300} />,
      <Clock15 key="c15" t={t} at={A.fifteen} run={[A.timer, A.trick + 2.4]} out={A.trick + 2.6} x={1480} y={480} />,
      <Words key="dont" t={t} items={[{ at: A.faucet, txt: "DON'T RUN THE FAUCET", col: COL.red }, { at: A.peek, txt: "DON'T PEEK", col: COL.red }]} out={279.0} y={900} size={58} />,
      <Banner key="trick" t={t} at={A.trick} out={283.6} text="THE WHOLE TRICK" col={COL.amber} y={120} size={70} />,
      <Words key="soak" t={t} items={[{ at: A.soaking, txt: "SOAKING IN", col: COL.ice }, { at: A.grip, txt: "LOOSENING ITS GRIP", col: COL.amber }]} out={285.8} y={880} size={64} />,
      <Stamp key="2s" t={t} at={A.twoSec} text="2 SECONDS LATER?" x={1380} y={300} out={294.2} rot={-7} size={70} />,
      <Banner key="why" t={t} at={A.why} out={296.3} text="THAT'S WHY IT DOESN'T WORK" col={COL.red} y={120} size={60} />,
      // paso 5
      <StepTitle key="s5" t={t} at={A.s5} n={5} name="FLUSH HARD" out={A.fullK - 0.2} y={300} />,
      <Words key="same" t={t} items={[{ at: A.same, txt: "SAME RULE: NO BOILING FOR PLASTIC", col: COL.red }]} out={305.0} y={880} size={52} />,
      <Words key="min" t={t} items={[{ at: A.hotTap, txt: "HOT TAP · FULL · 1 MINUTE", col: COL.amber }]} out={310.0} y={170} size={64} />,
      <Words key="glug" t={t} items={[{ at: A.gulp, txt: "GULP", col: COL.ice }, { at: A.gurgle, txt: "GURGLE", col: COL.ice2 }, { at: A.drops, txt: "DROP!", col: "#5ee38f" }]} out={315.3} y={180} size={100} />,
      <Tag key="lg" t={t} at={A.letGo} x={arm17.x} y={arm17.y} dx={-200} dy={-150} text="THE RING LETTING GO" col="#5ee38f" out={317.3} />,
      <Words key="2r" t={t} items={[{ at: A.slowM, txt: "SLOW? DO THE CUP AGAIN", col: COL.ice }, { at: A.twoRounds, txt: "2 ROUNDS", col: COL.amber }]} out={325.6} y={880} size={60} />,
      // paso 6
      <StepTitle key="s6" t={t} at={A.s6} n={6} name="THE PLUNGER" out={A.plunger + 0.3} y={300} />,
      <Versus key="vp" t={t} at={A.flat - 0.2} out={338.7} title="FOR A SINK" L={{ label: "FLAT CUP", val: "SINK", h: 0.55, col: "#5ee38f", mark: "ok" }} R={{ label: "FLANGE", val: "TOILET", h: 0.55, col: COL.red, mark: "x" }} />,
      <Words key="2in" t={t} items={[{ at: A.twoIn, txt: "2 INCHES OF WATER", col: COL.ice }]} out={342.7} y={170} size={72} />,
      <Stamp key="tight" t={t} at={A.tight} text="HOLD IT TIGHT" x={1420} y={820} out={347.7} rot={-6} size={70} />,
      <Words key="ovf" t={t} items={[{ at: A.overflow, txt: "COVER THE OVERFLOW", col: COL.amber }]} out={349.5} y={170} size={72} />,
      <Banner key="esc" t={t} at={A.escapes} out={A.nothing + 1.4} text="ANOTHER OPENING = PUSH ESCAPES" col={COL.red} y={110} size={60} />,
      <Words key="pump" t={t} items={[{ at: A.gently, txt: "GENTLY" }, { at: A.pump, txt: "THEN HARD", col: COL.amber }, { at: A.ten, txt: "10–15×", col: COL.ice }]} out={367.1} y={880} size={80} />,
      <Words key="pull" t={t} items={[{ at: A.pull, txt: "PULL OFF FAST", col: "#5ee38f" }]} out={369.6} y={170} size={80} />,
      // baño
      <Versus key="vh" t={t} at={A.kitG - 0.1} out={381.0} title="WHAT CLOGS IT" L={{ label: "KITCHEN", val: "GREASE", h: 0.6, col: COL.amber }} R={{ label: "BATHROOM", val: "HAIR", h: 0.6, col: COL.ice }} />,
      <Words key="net" t={t} items={[{ at: A.net, txt: "HAIR IS A NET", col: COL.ice }]} out={383.9} y={880} size={80} />,
      <Words key="disg" t={t} items={[{ at: A.know, txt: "I KNOW." }, { at: A.disg, txt: "DISGUSTING.", col: "#9fd34a" }]} out={400.4} y={880} size={84} />,
      <BigNum key="3d" t={t} at={A.three} text="$3" x={1560} y={300} size={220} col="#9df0b4" edge="#1f5a36" out={407.0} sub="BARBED STRIP" />,
      <Words key="amz" t={t} items={[{ at: A.amazed, txt: "YOU'LL BE AMAZED", col: COL.amber }]} out={410.6} y={160} size={80} />,
      <Words key="cupb" t={t} items={[{ at: A.cupAgain, txt: "THEN THE CUP + 15 MIN", col: COL.ice }]} out={413.4} y={880} size={64} />,
      // errores
      <MistakesDeal key="md" t={t} at={417.7} out={422.2} n={4} />,
      <Mistake key="m1" t={t} at={A.m1} n={1} txt="CAUSTIC CLEANER IN OLD PIPES" out={428.6} />,
      <Words key="lye" t={t} items={[{ at: A.lye, txt: "LYE · ACID", col: COL.red }]} out={428.6} y={170} size={80} />,
      <Words key="galv" t={t} items={[{ at: A.galv, txt: "GALVANIZED STEEL" }, { at: A.chrome, txt: "CHROME TRAP", col: COL.ice2 }]} out={433.4} y={880} size={64} />,
      <Banner key="eat" t={t} at={A.eat} out={439.7} text="EATS THE METAL FROM INSIDE" col={COL.red} y={110} size={64} />,
      <Tag key="cr" t={t} at={A.crumbled - 0.3} x={900} y={560} dx={260} dy={-180} text="CRUMBLED IN MY HAND" col={COL.amber} out={444.8} />,
      <Words key="burn" t={t} items={[{ at: A.burns, txt: "BURNS YOUR SKIN", col: COL.red }]} out={450.6} y={880} size={72} />,
      <Stamp key="chg" t={t} at={A.charge} text="SO I CHARGE MORE" x={1380} y={300} out={456.5} rot={-7} size={70} />,
      <Mistake key="m2" t={t} at={A.m2} n={2} txt="MIXING THINGS" out={461.0} />,
      <Banner key="gas" t={t} at={A.gasB} out={468.6} text="TOXIC GAS — NEVER BREATHE IT" col="#9fd34a" y={110} size={60} />,
      <Words key="one1" t={t} items={[{ at: A.oneP, txt: "ONE PRODUCT AT A TIME", col: COL.ice }, { at: A.dontPlunge, txt: "USED A CHEMICAL? DON'T PLUNGE", col: COL.red }]} out={474.3} y={880} size={52} />,
      <Mistake key="m3" t={t} at={A.m3} n={3} txt="BOILING WATER IN THE WRONG PLACE" out={479.3} />,
      <Tag key="crk" t={t} at={A.crack} x={1000} y={600} dx={260} dy={-160} text="PORCELAIN CRACKS" sub="FROM THE SHOCK" col={COL.red} out={489.9} />,
      <Mistake key="m4" t={t} at={A.m4} n={4} txt="THE GREASE JAR YOU DON'T HAVE" out={497.2} />,
      <CheckList key="jar" t={t} title="THE GREASE CAN" rows={[{ at: A.cool, txt: "LET IT COOL" }, { at: A.cool + 1.6, txt: "INTO THE CAN" }, { at: A.trash, txt: "TRASH WHEN FULL" }, { at: A.wipe, txt: "WIPE THE PAN" }]} out={509.7} />,
      <BigNum key="hab" t={t} at={A.money - 0.3} text="#1 SAVER" x={960} y={760} size={170} col="#9df0b4" edge="#1f5a36" out={513.6} sub="THAT ONE HABIT" />,
      // lo mío
      <Tag key="sun" t={t} at={A.sunday} x={700} y={300} dx={-120} dy={-110} text="ONCE A MONTH" sub="SUNDAY NIGHT" col={COL.amber} out={523.5} />,
      <CheckList key="rt" t={t} title="MY ROUTINE" rows={[{ at: A.soapK, txt: "SOAP + KETTLE" }, { at: A.cupR, txt: "THE CUP" }, { at: A.cupR + 0.6, txt: "15 MINUTES" }, { at: A.flushR, txt: "FLUSH" }]} out={530.0} />,
      <Words key="2m" t={t} items={[{ at: A.twoMin, txt: "2 MINUTES OF WORK", col: COL.ice }]} out={529.9} y={900} size={64} />,
      <Stamp key="nev" t={t} at={A.snake} text="NEVER SNAKED IT" x={1400} y={820} out={535.4} rot={-6} size={68} />,
      // llamar al plomero
      <Banner key="call" t={t} at={A.call} out={541.0} text="WHEN TO CALL SOMEBODY" col={COL.amber} y={110} size={70} />,
      <CheckList key="sig" t={t} title="NOT A SINK CLOG" rows={[{ at: A.moreOne, txt: "MORE THAN ONE DRAIN" }, { at: A.gurglesT, txt: "TOILET GURGLES" }, { at: A.tub, txt: "TUB BACKS UP" }]} out={548.0} />,
      <Tag key="ml" t={t} at={552.3} x={main27.x} y={main27.y} dx={-120} dy={-160} text="YOUR MAIN LINE" col={COL.amber} out={553.4} />,
      <Tag key="roots" t={t} at={A.roots} x={rt29.x} y={rt29.y} dx={-260} dy={-160} text="TREE ROOTS" col="#d8b07a" out={557.2} />,
      <Tag key="brk" t={t} at={A.brokenP} x={rt29.x} y={rt29.y} dx={240} dy={140} text="BROKEN PIPE" col={COL.red} out={557.2} />,
      <Banner key="flood" t={t} at={A.flood} out={561.8} text="PUSHING HARDER CAN FLOOD IT" col={COL.red} y={110} size={60} />,
      <Words key="cam" t={t} items={[{ at: A.real, txt: "A REAL PLUMBER", col: COL.ink }, { at: A.camera, txt: "WITH A CAMERA", col: COL.amber }]} out={565.4} y={880} size={64} />,
      // resumen
      <Words key="rs" t={t} items={[{ at: A.slowS, txt: "SLOW SINK" }, { at: A.kitchenW, txt: "KITCHEN", col: COL.amber }, { at: A.hairS, txt: "HAIR", col: COL.ice }]} out={570.9} y={170} size={80} />,
      <Recipe key="rec2" t={t} at={A.half - 0.1} at2={A.half + 0.9} out={578.7} x={1420} y={460} sc={0.85} />,
      <Words key="st" t={t} items={[{ at: A.meltF, txt: "MELT" }, { at: A.give, txt: "15 MIN", col: COL.amber }, { at: A.flushIt, txt: "FLUSH", col: COL.ice }]} out={578.8} y={900} size={72} />,
      <BigNum key="10c" t={t} at={A.cents} text="10¢" x={560} y={500} size={240} col="#9df0b4" edge="#1f5a36" out={582.0} sub="KEEP YOUR $500" />,
      <NextCard key="nx" t={t} at={A.next} subAt={A.subscribe > A.next ? A.next + 1.5 : A.next + 1.5} out={593.3} title="THE TOILET CLOG A PLUNGER CAN'T FIX"><Take t={t} k="s46" a={A.next - 0.3} need={6} /></NextCard>,
      <Chips key="sub" t={t} at={A.like} items={["👍 LIKE", "SUBSCRIBE"]} out={587.8} />,
      <Banner key="lenny" t={t} at={A.imLenny} out={597.6} text="I'M LENNY · TAKE CARE OF YOUR HOUSE" col={COL.ink} y={880} size={58} />,
      <Flash key="flE" t={t} at={593.5} peak={0.4} />,
    ];
  },
});
export const Rest: React.FC = () => <V.Body />;
export const FULL_FRAMES = V.FRAMES;
