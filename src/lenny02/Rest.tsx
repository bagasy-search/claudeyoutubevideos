// lenny02 · DEL 1:24 AL FINAL (84,5 → 1191,4 s) con el motor del kit: una base por frase (toma agnes/LTX / inodoro 3D en corte /
// avatar) y CERO cortes secos; las piezas 2.5D viven en una capa aparte que cruza las transiciones. Todo anclado a la palabra
// con at("frase") sobre la voz real (caps.json). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill } from "remotion";
import { makeVideo, makeAt, Stamp, Beat, Tr } from "../kits/yanqui3d/engine";
import { BigNum, COL, Chips, DrawX, Flash, Tag, e } from "../kits/yanqui3d/lib";
import { CheckList, NextCard, StepTitle, Versus, Words } from "../kits/yanqui3d/pieces";
import { K, FX, PT, project } from "./toilet3d";
import { CAM, kf, kf3 } from "./cams";
import { W3, Banner, Take, WallClock } from "./bits";
import { T_MIN1 } from "./Min1";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

export const T0 = T_MIN1, TEND = 1191.4;
const at = makeAt(CAPS as [string, number][]);

// ---------- anclas ----------
const A = {
  stop: at("stop flushing"), mistake: at("number one mistake"), again: at("flush again"), nowhere: at("nowhere to put it"), ceiling: at("through the ceiling"),
  lid: at("Take the lid off"), flapper: at("That's the flapper"), pushDown: at("Push it down"), stops: at("Water stops"), valve: at("oval valve"), supply: at("water supply"), time: at("all the time in the world"),
  level: at("get the water level down"), cantP: at("you can't plunge it"), cup: at("plastic cup"), half: at("half a bowl"), towels: at("old towels"), gloves: at("rubber gloves"), cheap: at("cheap one"),
  okay: at("Okay, the plunger"), red: at("red rubber cup"), sinkP: at("sink plunger"), seal: at("doesn't seal"), round: at("round hole"), leaks: at("leaks air"), air: at("moving air"),
  toiletP: at("toilet plunger"), flange: at("the flange", 214), bellows: at("bellows plunger"), harder: at("pushes a lot harder"), d15: at("best $15"), buy: at("buy the right one"),
  how: at("Here's how you plunge"), hotW: at("under hot water"), softer: at("Warm rubber"), angle: at("at an angle"), squish: at("doesn't squish"), fit: at("fit the flange"), gentle: at("first push is gentle"),
  go: at("Then you go"), hardP: at("Hard push"), keepSeal: at("Keep the seal"), pullImp: at("The pull is just as important"), shoves: at("shoves the clog"), rocks: at("rocks it backward"), times: at("15 or 20 times"),
  gulpP: at("big gulp"), slowR: at("another round"), nothing: at("and nothing", 300), sits: at("just sits there"), cantFix: at("a plunger can't fix", 309), solid: at("something solid"), stopP: at("you stop plunging"), waxS: at("wax seal"),
  s2: at("step two"), simple: at("sounds too simple"), quarter: at("quarter cup"), sink: at("Let it sink"), cuts: at("cut grease"), loosens: at("loosens it up"), hot: at("Then hot water"), listen: at("listen carefully"),
  notB: at("Not boiling."), never: at("Never pour boiling"), porc: at("A toilet is porcelain"), mug: at("big coffee mug"), crack: at("it can crack"), month: at("a month later"), waxR: at("wax ring under there"),
  tub: at("bathtub tap"), f120: at("around 120"), perfect: at("Perfect."), bucket: at("Fill a bucket"), waist: at("about waist high"), force: at("with some force"), weight: at("weight of water"), untilN: at("normal flush"),
  walk: at("walk away"), m20: at("20 to 30 minutes"), dont: at("Don't touch it"), coffee: at("cup of coffee"), soaking: at("soaking into that clog"), dropped: at("already dropped"), letGo: at("letting go"), pumps: at("a few pumps"),
  s3: at("step three"), closet: at("closet auger"), word: at("old plumber's word"), rod: at("metal rod"), cable: at("steel cable"), sleeve: at("rubber sleeve", 455), d25: at("about $25"), own: at("you should own one"),
  hanger: at("Don't use a coat hanger"), free: at("because it's free"), scratches: at("scratches the porcelain"), gray: at("turn gray"), bends: at("around the bends"), tighter: at("push the clog in tighter"),
  use: at("how you use the auger"), crankUp: at("crank handle all the way up"), setB: at("set the bent end"), hold: at("Hold the tube still"), clockwise: at("turn the crank clockwise"), follows: at("follows the bends"),
  hit: at("you've hit the clog"), keepT: at("Keep turning"), grabs: at("grabs the clog"), back: at("crank it back up"), hooked: at("hooked on the end"), bag: at("Have a bag ready"), againA: at("do it again"),
  waterOn: at("Put the water back on"), swirl: at("nice strong swirl"), d30: at("$30"), kept: at("kept your $300"), allThree: at("done all three"), twoDays: at("two days later"), nobody: at("almost nobody tells you"),
  showW: at("how a toilet actually works"), handle: at("push that handle"), notTop: at("doesn't just pour in"), row: at("row of small holes"), n15: at("15, 20"), rimJets: at("rim jets"), washes: at("washes down the sides"),
  bigger: at("one bigger hole"), siphonJ: at("That's the siphon jet"), fires: at("fires a strong jet"), secret: at("whole secret"), pulls: at("it pulls it out"), hose: at("garden hose"), whoosh: at("big whoosh"),
  work: at("siphon is doing the work"), start: at("just there to start it"), problem: at("here's the problem", 648), minerals: at("tiny bit of minerals"), calcium: at("Calcium"), chicago: at("hard water"),
  years: at("Over 5"), artery: at("clogged artery"), crust: at("Hard white or orange crust"), oneHole: at("One hole closes up"), weak: at("your flush is weak"), trickles: at("just trickles"), late: at("starts late"),
  halfP: at("pulls half"), keeps: at("keeps clogging", 700), notYou: at("It's not you"), holesI: at("it's those holes"), check: at("how you check"), mirror: at("hand mirror"), look: at("look up at the holes"),
  healthy: at("round and clean"), crustS: at("white or brownish crust"), finger: at("feel with your finger"), sand: at("like sandpaper"), test2: at("another test"), sheet: at("even sheet"), dry: at("dry spots"),
  streaks: at("dark streaks"), closed: at("the holes are closed"), fix: at("Now the fix"), d3: at("about $3.00"), vinegar: at("Plain white vinegar"), acid: at("mild acid"), slowly: at("Slowly, but"), wont: at("won't hurt your porcelain"),
  offV: at("turn off the water at that valve"), dryR: at("dry under the rim"), tape: at("tape over all the holes"), around: at("Go all the way around"), dam: at("making a dam"), openT: at("open the tank"),
  tube: at("tall tube"), overflow: at("That's the overflow tube"), warm: at("Warm up about a quart"), pour: at("pour it slowly down"), hollow: at("hollow rim"), keepsT: at("The tape keeps it there"),
  hour: at("at least an hour"), overnight: at("Overnight is better"), cupB: at("cup of vinegar right into the bottom"), morning: at("In the morning"), poke: at("poke every single hole"), soft: at("The scale will be soft"),
  crunch: at("crunch"), flakes: at("white flakes"), jetB: at("Then do the siphon jet"), thumb: at("size of your thumb"), brush: at("small brush"), flushV: at("Then turn the water back on and flush"),
  believe: at("you won't believe it"), different: at("It sounds different"), swirls: at("It swirls"), roars: at("It roars"), breathing: at("breathing again"), twice: at("do it twice"), year: at("Once a year"),
  two: at("check two more things"), levelT: at("first the water level"), line: at("there's usually a line"), inch: at("about an inch below"), lower: at("If it's lower"), save: at("to save water"), noSav: at("no savings"),
  screw: at("screw or a clip"), turnUp: at("Turn it up"), second: at("Second, the flapper"), fast: at("drops shut too fast"), dial: at("little dial"), slack: at("half an inch of slack"),
  healthyT: at("your toilet is healthy"), bucketT: at("The bucket test"), gallon: at("gallon and a half"), allOnce: at("all at once"), whooshB: at("with a big whoosh"), clear: at("your pipes are clear"), further: at("further down the line"),
  goes: at("what goes down your toilet"), paper: at("Toilet paper is made"), nothingE: at("Almost nothing else"), wipes: at("say flushable"), thousands: at("pulled thousands"), rope: at("into a rope"),
  towelsP: at("Paper towels"), noneB: at("None of those"), only3: at("Only three things"), n1: at("Number one", 1032), trash: at("little trash can"), half2: at("half of these problems"),
  surprises: at("surprises people"), lowF: at("low-flow"), g16: at("1.6 gallons"), g35: at("3.5 gallons"), spare: at("water to spare"), middle: at("flush in the middle"), twoSmall: at("Two small flushes"),
  when: at("when do you stop and call"), gurgles: at("gurgles or bubbles"), tubUp: at("comes up in the bathtub"), basement: at("basement floor drain"), notT: at("That's not a toilet clog"), main: at("main sewer line"),
  roots: at("tree roots"), broken: at("broken pipe"), belly: at("a belly"), noP: at("No plunger, no auger"), lowest: at("lowest drain"), machine: at("big machine"), worth: at("worth every penny"),
  tonight: at("won't go down tonight"), short: at("the whole thing, short"), r1: at("Stop flushing and push down"), r2: at("Use a flange plunger"), r3: at("Push and pull", 1130), r4: at("a quarter cup of dish soap", 1130),
  r5: at("a closet auger, never"), r6: at("look under the rim"), three: at("Three dollars"), day: at("the day it was put in"), hear: at("I want to hear from you"), old: at("How old is the toilet"),
  comments: at("in the comments"), subscribe: at("hit subscribe"), bell: at("little bell"), next: at("Next time"), soda: at("baking soda and vinegar"), instead: at("what I use instead"), lenny: at("I'm Lenny"),
};

// ---------- helpers de beats ----------
type TB = Beat & { need?: number };
const S3 = (a: number, tr: Tr, kfs: K[], fx: (t: number) => FX, p?: [number, number], extra?: (t: number) => React.ReactNode, blur = 0): TB =>
  ({ a, tr, p, r: (t) => <AbsoluteFill><W3 t={t} kf={kfs} fx={fx(t)} blur={blur} dark={blur > 0 ? 0.3 : 0} />{extra?.(t)}</AbsoluteFill> });
const TK = (a: number, k: string, tr: Tr, p?: [number, number], z?: [number, number], from = 0): TB => {
  const b: TB = { a, tr, p, k, r: (t) => <AbsoluteFill><Take t={t} k={k} a={a} need={b.need ?? 5} z={z} from={from} /></AbsoluteFill> };
  return b;
};
const C: [number, number] = [960, 540];

// cámaras de cada tramo 3D
const K1 = kf(T0 - 0.2, 87.8, CAM.wide2, CAM.bowl);
const K2 = kf(92.0, 96.2, CAM.bowl, CAM.rim);
const K3 = kf(99.8, 103.3, CAM.rim, CAM.wide);
const K4 = kf(107.6, 111.5, CAM.wide, CAM.tankW);
const K5 = kf(115.7, 124.3, CAM.tankW, CAM.tank);
const K6 = kf(125.8, 128.8, CAM.tank, CAM.tankW);
const K7 = kf(136.0, 145.3, CAM.valve, CAM.wide);
const K8 = kf(149.2, 154.3, CAM.wide, CAM.bowl);
const K9 = kf(164.1, 176.7, CAM.bowl, CAM.trap);
const K10 = kf(196.7, 208.1, CAM.trap, CAM.crest);
const K11 = kf(217.4, 222.1, CAM.trap, CAM.bowl);
const K12 = kf(257.0, 258.7, CAM.bowl, CAM.trap);
const K13 = kf(266.3, 272.6, CAM.trap, CAM.crest);
const K14 = kf(280.2, 290.0, CAM.crest, CAM.trap);
const K15 = kf(297.8, 301.1, CAM.trap, CAM.bowl);
const K16 = kf(318.5, 323.2, CAM.crest, CAM.trap);
const K17 = kf(328.0, 333.1, CAM.wide, CAM.floor);
const K18 = kf3(352.8, 358.0, 366.0, CAM.bowl, CAM.trap, CAM.crest);
const K19 = kf(366.0, 374.3, CAM.crest, CAM.wide);
const K20 = kf(381.5, 385.6, CAM.bowl, CAM.rim);
const K21 = kf(390.2, 392.6, CAM.wide, CAM.floor);
const K22 = kf(415.5, 421.3, CAM.bowl, CAM.trap);
const K23 = kf(430.9, 436.4, CAM.trap, CAM.crest);
const K24 = kf(438.5, 444.6, CAM.crest, CAM.wide);
const K25 = kf(460.0, 462.0, CAM.bowl, CAM.trap);
const K26 = kf(487.0, 496.7, CAM.trap, CAM.crest);
const K27 = kf(500.4, 505.2, CAM.bowl, CAM.trap);
const K28 = kf3(520.7, 526.0, 530.5, CAM.trap, CAM.crest, CAM.crest);
const K29 = kf(535.0, 536.6, CAM.crest, CAM.trap);
const K30 = kf(558.7, 562.2, CAM.trap, CAM.wide);
const K31 = kf(566.9, 579.6, CAM.wide, CAM.wide2);
const K32 = kf3(584.2, 589.5, 595.2, CAM.wide, CAM.tankW, CAM.bowl);
const K33 = kf(604.3, 609.0, CAM.under, CAM.bowl);
const K34 = kf3(620.7, 625.8, 630.3, CAM.jetc, CAM.trap, CAM.crest);
const K35 = kf(641.1, 646.7, CAM.trap, CAM.wide);
const K36 = kf(652.0, 659.3, CAM.rim, CAM.under);
const K37 = kf(663.5, 666.2, CAM.under, CAM.under);
const K38 = kf3(673.4, 677.0, 681.2, CAM.under, CAM.jetc, CAM.jetc);
const K39 = kf3(687.0, 693.0, 698.7, CAM.bowl, CAM.trap, CAM.crest);
const K40 = kf(703.6, 708.2, CAM.crest, CAM.trap);
const K41 = kf(726.5, 732.7, CAM.rim, CAM.under);
const K42 = kf(740.5, 749.6, CAM.bowl, CAM.rim);
const K43 = kf(775.0, 779.8, CAM.under, CAM.rim);
const K44 = kf(783.8, 789.4, CAM.rim, CAM.wide);
const K45 = kf(808.8, 813.8, CAM.under, CAM.rim);
const K46 = kf3(821.5, 824.5, 827.1, CAM.tank, CAM.tankW, CAM.rim);
const K47 = kf(838.1, 844.9, CAM.rim, CAM.under);
const K48 = kf(867.4, 875.2, CAM.under, CAM.rim, 0.15);
const K49 = kf(884.0, 889.9, CAM.jetc, CAM.trap);
const K50 = kf3(896.1, 900.6, 906.1, CAM.bowl, CAM.trap, CAM.wide);
const K51 = kf(911.8, 917.8, CAM.tankW, CAM.tank);
const K52 = kf(929.2, 941.2, CAM.tank, CAM.tankW);
const K53 = kf(966.5, 974.9, CAM.tank, CAM.tankW);
const K54 = kf(986.0, 992.3, CAM.bowl, CAM.trap);
const K55 = kf(996.7, 1009.2, CAM.drainP, CAM.bowl);
const K56 = kf(1063.3, 1075.0, CAM.wide, CAM.trap);
const K57 = kf3(1095.5, 1100.0, 1100.9, CAM.drainP, CAM.main, CAM.main);
const K58 = kf(1119.6, 1125.8, CAM.wide2, CAM.wide);
const K59 = kf(1130.7, 1134.8, CAM.trap, CAM.crest);
const K59b = kf(1134.7, 1142.2, CAM.bowl, CAM.trap, 0.1);
const K60 = kf(1146.8, 1157.3, CAM.under, CAM.bowl);
const K61 = kf(1176.3, 1191.5, CAM.wide, CAM.wide2, 0.2);

const dirtyFull = (): FX => ({ bowl: 0.95, dirty: 0.9, paper: 1, clog: 1 });

export const V = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: AVAIL as { clips: string[]; imgs: string[] }, T0, TEND, flashAtStart: false,
  beats: ({ AV }) => {
    const B: TB[] = [
      // 1 · antes que nada: dejá de tirar la cadena (tanque, flapper, llave de paso)
      S3(T0, "cut", K1, (t) => ({ ...dirtyFull(), bowl: 0.92 + 0.06 * e(t, 85, 87) })),
      TK(87.7, "s01", "whip"),
      S3(92.0, "zoom", K2, (t) => ({ ...dirtyFull(), bowl: 0.96 + 0.04 * e(t, A.again, A.again + 2), flush: e(t, A.again, A.again + 0.6) * (1 - e(t, 95, 96)) }), C),
      AV(96.0, "whipL"),
      S3(99.84, "light", K3, (t) => ({ ...dirtyFull(), bowl: 1, flush: 0.4 })),
      TK(103.2, "s02", "push"),
      S3(107.7, "zoom", K4, () => ({ ...dirtyFull(), lid: 1, tank: 1 }), C),
      AV(111.29, "whip"),
      S3(115.73, "light", K5, (t) => ({ ...dirtyFull(), lid: 0, tank: 0.8, flap: 1 - e(t, A.pushDown, A.pushDown + 0.6), flush: 1 - e(t, A.pushDown, A.stops) })),
      TK(124.1, "s04", "whipL"),
      S3(125.9, "zoom", K6, () => ({ ...dirtyFull(), lid: 0, tank: 0.3, flap: 0 }), C),
      AV(128.57, "whip"),
      TK(132.01, "s05", "push"),
      S3(136.1, "zoom", K7, () => ({ ...dirtyFull(), lid: 0, tank: 0.3, supply: 0 }), C),
      AV(145.16, "light"),
      S3(149.29, "whip", K8, (t) => ({ ...dirtyFull(), bowl: 0.98 })),
      TK(154.1, "s06", "push"),
      AV(159.03, "whipL"),
      S3(164.2, "zoom", K9, (t) => ({ bowl: 0.5, dirty: 0.8, paper: 0.6, clog: 1, plunger: e(t, 165, 166) }), C),
      AV(176.56, "whip"),
      // 2 · el sopapo correcto
      TK(180.49, "s07", "push"),
      AV(191.75, "light"),
      S3(196.79, "zoom", K10, () => ({ bowl: 0.5, dirty: 0.8, clog: 1, flat: 1, pump: 1 }), C),
      AV(207.91, "whipL"),
      TK(212.35, "s09", "push"),
      S3(217.5, "zoom", K11, () => ({ bowl: 0.5, dirty: 0.8, clog: 1, plunger: 1 }), C),
      TK(221.9, "s10", "whip"),
      AV(224.84, "portal", { p: [960, 520] }),
      TK(228.46, "s11", "push"),
      TK(238.0, "s08", "whip"),
      AV(239.22, "light"),
      TK(245.48, "s12", "push"),
      TK(251.8, "s13", "whip"),
      S3(257.1, "zoom", K12, () => ({ bowl: 0.55, dirty: 0.8, clog: 1, plunger: 1 }), C),
      AV(258.48, "whipL"),
      TK(263.32, "s14", "push"),
      S3(266.4, "zoom", K13, (t) => ({ bowl: 0.55, dirty: 0.8, clog: 1, plunger: 1, pump: 0.3 }), C),
      TK(272.5, "s15", "whip"),
      AV(274.44, "light"),
      S3(280.3, "zoom", K14, () => ({ bowl: 0.55, dirty: 0.8, clog: 1, plunger: 1, pump: 1 }), C),
      AV(289.86, "whip"),
      TK(294.15, "s16", "push"),
      S3(297.9, "zoom", K15, (t) => ({ bowl: 0.5, dirty: 0.7, clog: 1, plunger: 1, pump: 0.6, letgo: 0.3 }), C),
      TK(301.0, "s17", "whipL"),
      AV(307.13, "light"),
      TK(311.77, "s18", "push"),
      S3(318.6, "zoom", K16, () => ({ bowl: 0.6, dirty: 0.8, clog: 1, plunger: 1, pump: 1 }), C),
      AV(323.03, "whip"),
      S3(328.02, "zoom", K17, (t) => ({ bowl: 0.6, dirty: 0.8, clog: 1, wax: e(t, A.waxS, A.waxS + 1) }), C),
      TK(333.0, "s19", "push"),
      // 3 · PASO 2: detergente + agua caliente (nunca hirviendo)
      TK(337.2, "s20", "whip"),
      AV(340.22, "light"),
      TK(345.55, "s21", "push"),
      S3(352.9, "zoom", K18, (t) => ({ bowl: 0.6, dirty: 0.8, clog: 1, soap: e(t, 352.9, 356) }), C),
      AV(357.81, "whipL"),
      S3(362.73, "zoom", K19, (t) => ({ bowl: 0.6, dirty: 0.8, clog: 1, soap: 1, hot: e(t, A.hot, A.hot + 1) * (1 - e(t, A.notB, A.notB + 0.5)) }), C),
      AV(374.19, "whip"),
      TK(378.32, "s22", "push"),
      S3(381.6, "zoom", K20, (t) => ({ bowl: 0.6, dirty: 0.6, clog: 1, hot: 1, crack: e(t, A.crack, A.crack + 1.2) }), C),
      TK(385.5, "s23", "whip"),
      S3(390.3, "zoom", K21, (t) => ({ bowl: 0.6, dirty: 0.6, clog: 1, hot: 1, wax: e(t, A.waxR, A.waxR + 1.2) }), C),
      AV(392.49, "light"),
      TK(398.49, "s24", "push"),
      TK(405.2, "s25", "whip"),
      AV(410.32, "whipL"),
      S3(415.59, "zoom", K22, (t) => ({ bowl: 0.85, dirty: 0.5, clog: 1, soap: 1, hot: 0.8 }), C),
      TK(421.2, "s26", "push"),
      AV(425.12, "light"),
      S3(430.96, "zoom", K23, (t) => ({ bowl: 0.85 - 0.4 * e(t, A.dropped, A.dropped + 2), dirty: 0.5, clog: 1, soap: 1, letgo: 0.4 * e(t, A.letGo - 0.4, A.letGo + 0.6) }), C),
      TK(436.3, "s27", "whip"),
      S3(441.3, "push", K24, (t) => ({ bowl: 0.45, dirty: 0.4, clog: 1, letgo: 1, flush: e(t, 441.5, 442.3), plunger: 0 })),
      AV(444.46, "whipL"),
      // 4 · PASO 3: la sonda de inodoro (closet auger)
      TK(449.66, "s28", "push"),
      S3(460.0, "zoom", K25, (t) => ({ bowl: 0.6, dirty: 0.7, clog: 1, auger: 0.15 }), C),
      AV(461.82, "whip"),
      TK(466.71, "s29", "push"),
      TK(477.9, "s30", "whip"),
      AV(479.39, "light"),
      TK(483.83, "s31", "push"),
      S3(487.0, "zoom", K26, (t) => ({ bowl: 0.6, dirty: 0.7, clog: 1 }), C),
      AV(496.59, "whipL"),
      S3(500.43, "zoom", K27, (t) => ({ bowl: 0.6, dirty: 0.7, clog: 1, auger: 0.05 }), C),
      TK(505.1, "s32", "push"),
      AV(512.13, "whip"),
      TK(518.05, "s33", "push"),
      S3(520.8, "zoom", K28, (t) => ({ bowl: 0.6, dirty: 0.7, clog: 1, auger: 0.05 + 0.85 * e(t, A.follows, A.hit + 0.2) }), C),
      AV(530.45, "whipL"),
      S3(534.99, "zoom", K29, (t) => ({ bowl: 0.6, dirty: 0.6, clog: 1, auger: 0.9 - 0.9 * e(t, A.back, A.back + 1.5) }), C),
      TK(536.6, "s34", "push"),
      AV(546.48, "light"),
      TK(550.8, "s35", "whip"),
      TK(552.1, "s36", "push"),
      TK(558.8, "s41", "whip"),
      AV(562.14, "light"),
      // 5 · por qué se tapa siempre: cómo funciona un inodoro
      S3(566.96, "zoom", K31, (t) => ({ bowl: 0.5 + 0.4 * e(t, A.twoDays, A.twoDays + 1.5), dirty: 0.6 * e(t, A.twoDays, A.twoDays + 1.5), clog: e(t, A.twoDays, A.twoDays + 1.2), scale: 0.8, jetScale: 0.7 }), C, undefined, 0),
      AV(579.55, "whip"),
      S3(584.23, "zoom", K32, (t) => ({ bowl: 0.3, tank: 1 - 0.8 * e(t, A.handle + 0.4, A.handle + 3), flap: e(t, A.handle, A.handle + 0.4), flush: e(t, A.handle + 0.3, A.handle + 1), lid: 0.5 }), C),
      AV(595.2, "light"),
      TK(600.3, "s37", "push"),
      S3(604.4, "zoom", K33, (t) => ({ bowl: 0.3, jets: 1, flush: 0.5 }), C),
      TK(608.9, "s38", "whip"),
      AV(613.9, "whipL"),
      TK(617.59, "s39", "push"),
      S3(620.8, "zoom", K34, (t) => ({ bowl: 0.3, jet: 1, jets: 1, flush: 1, siphon: e(t, A.fires + 1, A.fires + 3) }), C),
      AV(630.29, "light"),
      TK(636.24, "s40", "push"),
      S3(641.2, "zoom", K35, (t) => ({ bowl: 0.3, jet: 1, jets: 1, flush: 1, siphon: 1 }), C),
      AV(646.62, "whip"),
      S3(652.05, "zoom", K36, (t) => ({ bowl: 0.3, scale: 0.1 + 0.3 * e(t, A.minerals, A.calcium + 2), jets: 0.6 }), C),
      TK(659.2, "s43", "push"),
      S3(663.6, "zoom", K37, (t) => ({ bowl: 0.3, scale: 0.4 + 0.4 * e(t, 663.6, 666.2), jets: 0.5 }), C),
      AV(666.18, "whipL"),
      TK(670.64, "s42", "push"),
      S3(673.5, "zoom", K38, (t) => ({ bowl: 0.3, scale: 0.8 + 0.15 * e(t, A.oneHole, A.oneHole + 3), jetScale: e(t, 677, 680), jets: 0.4, jet: 0.4 }), C),
      TK(681.1, "s44", "whip"),
      AV(683.02, "light"),
      S3(687.08, "zoom", K39, (t) => ({ bowl: 0.4, scale: 0.95, jetScale: 1, siphon: 0.4 * (1 - e(t, A.late + 1.5, A.late + 2.5)), flush: 0.4, dirty: 0.4 * e(t, A.halfP, A.halfP + 2), clog: e(t, A.halfP + 2, A.halfP + 8) }), C),
      AV(698.67, "whip"),
      S3(703.66, "zoom", K40, (t) => ({ bowl: 0.5, dirty: 0.6, clog: 1, scale: 0.95, jetScale: 1 }), C),
      TK(708.1, "s45", "push"),
      AV(715.93, "light"),
      // 6 · cómo revisarlo: espejito, dedo, la descarga y las vetas
      TK(720.34, "s46", "push"),
      S3(726.6, "zoom", K41, (t) => ({ bowl: 0.3, scale: 0.85 }), C),
      AV(732.61, "whipL"),
      TK(738.25, "s47", "push"),
      S3(740.6, "zoom", K42, (t) => ({ bowl: 0.3, scale: 0.85, jets: e(t, 743, 744), flush: 0.6 }), C),
      AV(749.58, "whip"),
      TK(754.02, "s48", "push"),
      AV(764.9, "light"),
      // 7 · el arreglo de $3: vinagre por el tubo de rebalse
      TK(768.74, "s49", "push"),
      S3(775.0, "zoom", K43, (t) => ({ bowl: 0.3, scale: 0.85 - 0.25 * e(t, A.acid, A.slowly + 1.5), vinegar: 0.6 }), C),
      AV(779.76, "whipL"),
      S3(783.81, "zoom", K44, (t) => ({ bowl: 0.3, scale: 0.85 }), C),
      TK(789.3, "s50", "whip"),
      AV(797.44, "light"),
      TK(801.49, "s51", "push"),
      TK(803.6, "s52", "whip"),
      TK(807.2, "s53", "push"),
      S3(808.9, "zoom", K45, (t) => ({ bowl: 0.3, scale: 0.85, tape: 1 }), C),
      AV(813.73, "whip"),
      TK(819.06, "s54", "push"),
      S3(821.6, "zoom", K46, (t) => ({ bowl: 0.3, scale: 0.85, tape: 1, lid: 0, tank: 0, vinegar: e(t, 823, 826) }), C),
      TK(827.0, "s55", "whipL"),
      AV(828.88, "light"),
      TK(832.14, "s56", "push"),
      S3(838.2, "zoom", K47, (t) => ({ bowl: 0.3, scale: 0.85, tape: 1, vinegar: 1 }), C),
      AV(844.91, "whip"),
      TK(849.12, "s58", "push"),
      TK(852.4, "s57", "whip"),
      TK(856.5, "s59", "push"),
      AV(858.77, "light"),
      TK(862.59, "s60", "push"),
      S3(867.5, "zoom", K48, (t) => ({ bowl: 0.3, scale: 0.85 - 0.6 * e(t, A.crunch, A.flakes + 2), vinegar: 0.4, flakes: e(t, A.crunch, A.crunch + 0.6) }), C),
      AV(875.19, "whipL"),
      TK(879.63, "s62", "push"),
      S3(884.1, "zoom", K49, (t) => ({ bowl: 0.3, scale: 0.2, jetScale: 1 - e(t, 884.5, 888.5), jet: 0.4 }), C),
      TK(889.8, "s63", "whip"),
      AV(892.43, "light"),
      S3(896.12, "zoom", K50, (t) => ({ bowl: 0.3, jets: 1, jet: 1, flush: 1, siphon: e(t, A.swirls, A.roars + 0.5) }), C),
      TK(900.6, "s61", "whip"),
      AV(906.08, "whipL"),
      // 8 · nivel del tanque y flapper
      S3(911.88, "zoom", K51, (t) => ({ bowl: 0.3, lid: 0, tank: 0.6 }), C),
      TK(917.7, "s64", "push"),
      AV(923.74, "light"),
      S3(929.24, "zoom", K52, (t) => ({ bowl: 0.3, lid: 0, tank: 0.6 + 0.4 * e(t, 937, 940), siphon: 0.3, flush: 0.3 }), C),
      AV(941.21, "whip"),
      TK(945.31, "s65", "push"),
      TK(949.7, "s66", "whip"),
      AV(956.37, "light"),
      TK(962.21, "s67", "push"),
      S3(966.6, "zoom", K53, (t) => ({ bowl: 0.3, lid: 0, tank: 1, flap: 0.5 }), C),
      AV(974.97, "whipL"),
      // 9 · la prueba del balde
      TK(980.93, "s68", "push"),
      S3(986.0, "zoom", K54, (t) => ({ bowl: 0.3 + 0.6 * (1 - e(t, 986.5, 988.5)), flush: e(t, 986.3, 987) * (1 - e(t, 991, 992)), siphon: e(t, 986.6, 987.5) }), C),
      AV(992.2, "whip"),
      S3(996.72, "zoom", K55, (t) => ({ bowl: 0.3, main: e(t, A.further, A.further + 1.5) * (1 - e(t, 999, 1000)), paper: e(t, A.paper - 0.3, A.paper) }), C),
      AV(1009.15, "light"),
      // 10 · qué va al inodoro
      TK(1012.48, "s69", "push"),
      TK(1017.8, "s70", "whip"),
      AV(1025.26, "whipL"),
      TK(1030.23, "s71", "push"),
      TK(1038.1, "s72", "whip"),
      AV(1040.99, "light"),
      TK(1045.0, "s73", "push"),
      TK(1048.1, "s74", "whip"),
      AV(1058.26, "whipL"),
      S3(1063.32, "zoom", K56, (t) => ({ bowl: 0.3, jets: 1, flush: 0.7, siphon: 0.6 }), C),
      AV(1074.99, "whip"),
      // 11 · cuándo llamar al plomero
      TK(1079.06, "s75", "push"),
      TK(1084.5, "s76", "whip"),
      AV(1089.32, "light"),
      S3(1095.52, "zoom", K57, (t) => ({ bowl: 0.5, dirty: 0.6, main: 1 }), C),
      TK(1100.8, "s77", "push"),
      AV(1109.76, "whipL"),
      TK(1114.75, "s78", "push"),
      // 12 · el resumen y el cierre
      S3(1119.7, "light", K58, (t) => ({ ...dirtyFull(), bowl: 0.9, lid: 1 })),
      AV(1125.76, "whip"),
      S3(1130.74, "zoom", K59, (t) => ({ bowl: 0.5, dirty: 0.6, clog: 1, plunger: 1, pump: 1 }), C),
      S3(1134.7, "whip", K59b, (t) => ({ bowl: 0.85 - 0.4 * e(t, 1138, 1141), dirty: 0.5, clog: 1 - 0.7 * e(t, 1139, 1142), soap: 1, hot: e(t, 1135.5, 1137) })),
      AV(1142.13, "light"),
      S3(1146.81, "zoom", K60, (t) => ({ bowl: 0.3, scale: 0.85 - 0.8 * e(t, 1150, 1156), tape: e(t, 1148, 1149) * (1 - e(t, 1153, 1154)), vinegar: e(t, 1149, 1151) * (1 - e(t, 1155, 1156)), flakes: e(t, 1153, 1154) }), C),
      TK(1154.5, "s79", "push"),
      AV(1158.06, "whipL"),
      TK(1161.37, "s80", "push"),
      AV(1172.48, "whip"),
      S3(1176.35, "light", K61, () => ({ bowl: 0.3, jets: 1, flush: 0.4 }), undefined, undefined, 9),
    ];
    B.forEach((b, i) => { if (b.k) (b as TB).need = (B[i + 1]?.a ?? TEND) - b.a; });
    return B;
  },
  pieces: (t) => {
    const pj = (q: number[], kfs: K[]) => project(t, q, kfs);
    const flap5 = pj(PT.flap, K5), valve7 = pj(PT.valve, K7), crest10 = pj(PT.crest, K10), crest14 = pj(PT.crest, K14), wax17 = pj(PT.wax, K17), crest18 = pj(PT.crest, K18);
    const crest28 = pj(PT.crest, K28), jet34 = pj(PT.jet, K34), crest39 = pj(PT.crest, K39), tube46 = pj(PT.overflow, K46), line51 = pj(PT.line, K51), main57 = pj([1.2, -0.35, 0], K57);
    return [
      // 1 · dejar de tirar la cadena
      <Stamp key="stop" t={t} at={A.stop} text="STOP FLUSHING" x={1380} y={300} out={87.4} rot={-7} size={84} />,
      <Banner key="m1" t={t} at={A.mistake} out={91.7} text="THE #1 MISTAKE" col={COL.red} y={110} size={74} />,
      <Words key="again" t={t} items={[{ at: A.again, txt: "FLUSH AGAIN?", col: COL.red }]} out={95.8} y={150} size={92} />,
      <Banner key="nowh" t={t} at={A.nowhere} out={103.0} text="NOWHERE TO PUT IT" col={COL.amber} y={110} size={70} />,
      <Tag key="ceil" t={t} at={A.ceiling} x={960} y={300} dx={220} dy={150} text="THROUGH THE CEILING" col={COL.red} out={107.5} />,
      <StepTitle key="sw" t={t} at={107.9} n={1} name="SHUT IT DOWN" out={A.lid - 0.3} y={300} />,
      <Tag key="flap" t={t} at={A.flapper} x={flap5.x} y={flap5.y} dx={-240} dy={-140} text="THE FLAPPER" col={COL.amber} out={124.0} size={48} />,
      <Words key="stops" t={t} items={[{ at: A.stops, txt: "WATER STOPS", col: "#5ee38f" }]} out={128.4} y={150} size={84} />,
      <Tag key="valve" t={t} at={136.3} x={valve7.x} y={valve7.y} dx={-220} dy={-150} text="WATER SUPPLY" sub="CLOCKWISE" col={COL.ice} out={141.8} />,
      <Banner key="time" t={t} at={A.time} out={145.0} text="ALL THE TIME IN THE WORLD" col="#5ee38f" y={110} size={64} />,
      <Words key="cant" t={t} items={[{ at: A.cantP, txt: "FULL TO THE RIM = CAN'T PLUNGE", col: COL.red }]} out={154.0} y={150} size={60} />,
      <Banner key="half" t={t} at={A.half} out={163.9} text="LEAVE ABOUT HALF A BOWL" col={COL.ice} y={880} size={64} />,
      <CheckList key="prep" t={t} title="BEFORE YOU START" rows={[{ at: A.half, txt: "HALF A BOWL" }, { at: A.towels, txt: "OLD TOWELS DOWN" }, { at: A.gloves, txt: "RUBBER GLOVES" }]} out={176.3} />,
      // 2 · el sopapo correcto
      <StepTitle key="pl" t={t} at={A.okay} n={2} name="THE RIGHT PLUNGER" out={180.3} y={300} />,
      <Tag key="sinkp" t={t} at={A.sinkP} x={960} y={520} dx={240} dy={-170} text="SINK PLUNGER" sub="FLAT CUP" col={COL.amber} out={191.5} />,
      <Words key="seal" t={t} items={[{ at: A.seal, txt: "ON A TOILET: NO SEAL", col: COL.red }]} out={196.5} y={880} size={66} />,
      <Tag key="leak" t={t} at={A.leaks} x={crest10.x} y={crest10.y} dx={-240} dy={-160} text="LEAKS AIR" sub="ALL THE WAY AROUND" col={COL.red} out={207.6} />,
      <Words key="air" t={t} items={[{ at: A.air, txt: "MOVING AIR, NOT WATER", col: COL.ice }]} out={207.6} y={880} size={66} />,
      <Tag key="fl" t={t} at={A.flange} x={960} y={600} dx={240} dy={-170} text="THE FLANGE" col={COL.amber} out={217.3} size={52} />,
      <Words key="seals" t={t} items={[{ at: 217.6, txt: "SEALS THE HOLE", col: "#5ee38f" }]} out={221.7} y={150} size={84} />,
      <Tag key="bel" t={t} at={A.bellows} x={960} y={480} dx={250} dy={-150} text="BELLOWS" sub="EVEN BETTER" col={COL.ice} out={224.6} />,
      <BigNum key="d15" t={t} at={A.d15} text="$15" x={1500} y={420} size={220} col="#9df0b4" edge="#1f5a36" out={238.0} sub="BEST $15 YOU'LL SPEND" />,
      <Versus key="vp" t={t} at={A.buy - 0.3} out={242.0} title="FOR A TOILET" L={{ label: "FLAT CUP", val: "SINK", h: 0.45, col: COL.red, mark: "x" }} R={{ label: "FLANGE", val: "TOILET", h: 0.7, col: "#5ee38f", mark: "ok" }} />,
      <StepTitle key="hw" t={t} at={A.how} n={3} name="PLUNGE IT RIGHT" out={245.3} y={300} />,
      <Words key="warm" t={t} items={[{ at: A.hotW, txt: "HOT WATER · 1 MINUTE", col: COL.amber }, { at: A.softer, txt: "SOFTER = BETTER SEAL", col: COL.ice }]} out={251.6} y={880} size={60} />,
      <Words key="angle" t={t} items={[{ at: A.angle, txt: "IN AT AN ANGLE", col: COL.ice }]} out={256.9} y={150} size={80} />,
      <Words key="sq" t={t} items={[{ at: A.squish, txt: "WATER DOESN'T SQUISH", col: COL.ice }, { at: A.squish + 1.2, txt: "AIR DOES", col: COL.red }]} out={258.3} y={880} size={66} />,
      <Words key="gent" t={t} items={[{ at: A.gentle, txt: "FIRST PUSH: GENTLE", col: COL.ice }]} out={272.3} y={150} size={76} />,
      <Words key="pp" t={t} items={[{ at: A.hardP, txt: "PUSH" }, { at: A.hardP + 1.0, txt: "PULL", col: COL.amber }, { at: A.keepSeal, txt: "KEEP THE SEAL", col: COL.ice }]} out={280.1} y={880} size={84} />,
      <Tag key="rock" t={t} at={A.shoves} x={crest14.x} y={crest14.y} dx={-240} dy={-150} text="PUSH SHOVES IT" col={COL.ice} out={A.rocks - 0.1} />,
      <Tag key="rock2" t={t} at={A.rocks} x={crest14.x} y={crest14.y} dx={240} dy={140} text="PULL ROCKS IT BACK" sub="IT BREAKS APART" col={COL.amber} out={289.6} />,
      <BigNum key="15x" t={t} at={A.times} text="15–20×" x={1480} y={760} size={170} col={COL.ink} edge="#333" out={293.9} />,
      <Words key="gulp" t={t} items={[{ at: A.gulpP, txt: "BIG GULP = GOT IT", col: "#5ee38f" }]} out={297.7} y={150} size={80} />,
      <Banner key="cf" t={t} at={A.cantFix} out={318.4} text="THE CLOG A PLUNGER CAN'T FIX" col={COL.red} y={110} size={66} />,
      <Words key="sol" t={t} items={[{ at: A.solid, txt: "WIPES · A TOY · PACKED TIGHT", col: COL.amber }]} out={325.8} y={880} size={60} />,
      <Stamp key="stopP" t={t} at={A.stopP} text="STOP PLUNGING" x={1380} y={820} out={327.9} rot={-6} size={70} />,
      <Tag key="wax" t={t} at={A.waxS} x={wax17.x} y={wax17.y} dx={-250} dy={-150} text="WAX SEAL BREAKS" sub="LEAK INTO THE FLOOR" col={COL.red} out={336.9} />,
      // 3 · paso 2: detergente y agua caliente
      <StepTitle key="s2" t={t} at={A.s2} n={4} name="DISH SOAP + HOT WATER" out={A.simple + 1.5} y={300} />,
      <BigNum key="q" t={t} at={A.quarter} text="¼ CUP" x={1480} y={760} size={150} col={COL.ink} edge="#2b5a3e" out={351.6} sub="PLAIN DISH SOAP" />,
      <Tag key="slip" t={t} at={A.loosens} x={crest18.x} y={crest18.y} dx={-240} dy={-150} text="SLIPPERY" sub="IT LOOSENS UP" col="#5ee38f" out={365.7} />,
      <Stamp key="nb" t={t} at={A.notB} text="NOT BOILING" x={1380} y={300} out={374.0} rot={-7} size={84} />,
      <Tag key="cr" t={t} at={A.crack} x={960} y={560} dx={250} dy={-160} text="IT CAN CRACK" col={COL.red} out={385.3} />,
      <Words key="mon" t={t} items={[{ at: A.month, txt: "A MONTH LATER: WATER ON THE FLOOR", col: COL.red }]} out={390.1} y={880} size={54} />,
      <Words key="waxR" t={t} items={[{ at: A.waxR, txt: "AND IT SOFTENS THE WAX", col: COL.amber }]} out={392.3} y={150} size={70} />,
      <BigNum key="f120" t={t} at={A.f120} text="120–140°F" x={1460} y={760} size={140} col={COL.amber} edge="#5a3a10" out={404.9} sub="HOTTEST TAP WATER" />,
      <Words key="wst" t={t} items={[{ at: A.waist, txt: "FROM WAIST HIGH", col: COL.ice }, { at: A.force, txt: "WITH SOME FORCE", col: COL.amber }]} out={410.1} y={150} size={70} />,
      <Banner key="nf" t={t} at={A.untilN} out={421.0} text="UNTIL IT'S NORMAL-FULL · THEN STOP" col={COL.ice} y={880} size={56} />,
      <WallClock key="wc" t={t} at={A.m20} out={430.7} label="20–30 MINUTES" x={1500} y={460} />,
      <Words key="dt" t={t} items={[{ at: A.dont, txt: "DON'T TOUCH IT", col: COL.red }]} out={430.7} y={880} size={72} />,
      <Tag key="soak" t={t} at={A.soaking} x={960} y={500} dx={-240} dy={-150} text="SOAKING IN" col={COL.ice} out={436.0} />,
      <Words key="drop" t={t} items={[{ at: A.letGo, txt: "YOUR CLOG LETTING GO", col: "#5ee38f" }]} out={441.1} y={150} size={74} />,
      // 4 · paso 3: la sonda
      <StepTitle key="s3" t={t} at={A.s3} n={5} name="THE CLOSET AUGER" out={A.closet + 1.2} y={300} />,
      <Tag key="cw" t={t} at={A.word} x={960} y={520} dx={240} dy={-160} text="CLOSET = TOILET" sub="OLD PLUMBER'S WORD" col={COL.ice} out={459.8} />,
      <Words key="cab" t={t} items={[{ at: A.cable, txt: "3 FT STEEL CABLE" }, { at: A.sleeve, txt: "RUBBER SLEEVE", col: COL.ice }]} out={461.6} y={880} size={66} />,
      <BigNum key="d25" t={t} at={A.d25} text="$25–40" x={1480} y={420} size={170} col="#9df0b4" edge="#1f5a36" out={477.5} sub="OWN ONE" />,
      <Stamp key="hang" t={t} at={A.hanger} text="NEVER A COAT HANGER" x={1300} y={300} out={483.6} rot={-7} size={70} />,
      <Tag key="scr" t={t} at={A.gray} x={960} y={620} dx={240} dy={-170} text="GRAY FOREVER" col={COL.red} out={486.8} />,
      <Words key="tgt" t={t} items={[{ at: A.bends, txt: "CAN'T TURN THE BENDS", col: COL.amber }, { at: A.tighter, txt: "PACKS IT TIGHTER", col: COL.red }]} out={496.3} y={880} size={62} />,
      <CheckList key="aug" t={t} title="THE AUGER" rows={[{ at: A.crankUp, txt: "CABLE ALL THE WAY UP" }, { at: A.setB, txt: "BEND INTO THE HOLE" }, { at: A.hold, txt: "HOLD THE TUBE STILL" }, { at: A.clockwise, txt: "CRANK CLOCKWISE + PUSH" }]} out={520.6} />,
      <Tag key="hit" t={t} at={A.hit} x={crest28.x} y={crest28.y} dx={-240} dy={-150} text="YOU HIT THE CLOG" col={COL.red} out={530.3} />,
      <Words key="kt" t={t} items={[{ at: A.keepT, txt: "DON'T FORCE IT · KEEP TURNING", col: COL.ice }]} out={530.3} y={880} size={58} />,
      <Words key="bag" t={t} items={[{ at: A.bag, txt: "HAVE A BAG READY", col: COL.amber }]} out={550.6} y={880} size={70} />,
      <Tag key="hand" t={t} at={A.waterOn + 1.0} x={1100} y={420} dx={240} dy={-150} text="HAND ON THE FLAPPER" col={COL.ice} out={558.6} />,
      <BigNum key="d30" t={t} at={A.d30} text="$30" x={560} y={420} size={200} col="#9df0b4" edge="#1f5a36" out={566.7} sub="20 MINUTES" />,
      <BigNum key="k300" t={t} at={A.kept} text="$300" x={1400} y={760} size={170} col={COL.ink} edge="#333" out={566.7} sub="KEPT" />,
      // 5 · cómo funciona
      <Banner key="ag" t={t} at={A.twoDays} out={576.2} text="CLOGGED AGAIN TWO DAYS LATER?" col={COL.red} y={110} size={60} />,
      <Stamp key="nob" t={t} at={A.nobody} text="NOBODY TELLS YOU THIS" x={1380} y={820} out={579.4} rot={-6} size={64} />,
      <Words key="notTop" t={t} items={[{ at: A.notTop, txt: "NOT JUST FROM THE TOP", col: COL.amber }]} out={595.0} y={880} size={66} />,
      <Words key="row" t={t} items={[{ at: A.n15, txt: "15–20 HOLES", col: COL.ice }, { at: A.rimJets, txt: "RIM JETS", col: COL.amber }]} out={608.7} y={150} size={84} />,
      <Tag key="sj" t={t} at={A.siphonJ + 1.0} x={jet34.x} y={jet34.y} dx={-240} dy={-150} text="SIPHON JET" col={COL.amber} out={625.7} size={50} />,
      <Words key="sec" t={t} items={[{ at: A.secret, txt: "THE WHOLE SECRET", col: COL.amber }]} out={630.1} y={150} size={80} />,
      <Words key="pull" t={t} items={[{ at: A.pulls - 1.2, txt: "IT DOESN'T PUSH" }, { at: A.pulls, txt: "IT PULLS", col: "#5ee38f" }]} out={636.0} y={880} size={84} />,
      <Words key="whoosh" t={t} items={[{ at: A.whoosh, txt: "WHOOSH", col: COL.ice }, { at: A.work, txt: "THE SIPHON DOES THE WORK", col: COL.amber }]} out={646.4} y={150} size={72} />,
      <Words key="min" t={t} items={[{ at: A.calcium, txt: "CALCIUM" }, { at: A.calcium + 0.7, txt: "LIME", col: COL.ice }, { at: A.calcium + 1.4, txt: "IRON", col: COL.amber }]} out={659.0} y={880} size={84} />,
      <BigNum key="yrs" t={t} at={A.years} text="5·10·15 YRS" x={960} y={820} size={130} col={COL.ink} edge="#333" out={666.0} sub="LIKE A CLOGGED ARTERY" />,
      <Words key="one" t={t} items={[{ at: A.oneHole, txt: "1 HOLE" }, { at: A.oneHole + 1.4, txt: "3 HOLES", col: COL.amber }, { at: A.oneHole + 2.6, txt: "HALF OF THEM", col: COL.red }]} out={681.0} y={150} size={80} />,
      <Words key="wk" t={t} items={[{ at: A.weak, txt: "WEAK FLUSH", col: COL.red }]} out={686.9} y={150} size={90} />,
      <Tag key="half" t={t} at={A.halfP} x={crest39.x} y={crest39.y} dx={-240} dy={-150} text="PULLS ONLY HALF" sub="THE REST SITS IN THE TRAP" col={COL.red} out={698.4} />,
      <Words key="keep" t={t} items={[{ at: A.keeps, txt: "THE TOILET THAT KEEPS CLOGGING", col: COL.red }]} out={710.4} y={150} size={60} />,
      <Stamp key="holes" t={t} at={A.holesI} text="IT'S THOSE HOLES" x={1380} y={820} out={715.7} rot={-6} size={72} />,
      // 6 · revisarlo (la escena de la miniatura)
      <StepTitle key="chk" t={t} at={A.check} n={6} name="CHECK THE RIM" out={A.mirror - 0.2} y={300} />,
      <Banner key="hide" t={t} at={A.look} out={726.3} text="THE REAL CLOG IS HIDING HERE" col={COL.amber} y={110} size={64} />,
      <Stamp key="nd" t={t} at={A.look + 1.5} text="NOT THE DRAIN" x={1420} y={820} out={726.3} rot={-6} size={66} />,
      <Versus key="vh" t={t} at={A.healthy - 0.2} out={732.4} title="UNDER THE RIM" L={{ label: "HEALTHY", val: "ROUND · CLEAN", h: 0.6, col: "#5ee38f", mark: "ok" }} R={{ label: "CLOGGED", val: "CRUSTED", h: 0.6, col: COL.red, mark: "x" }} />,
      <Words key="sand" t={t} items={[{ at: A.sand, txt: "FEELS LIKE SANDPAPER", col: COL.amber }]} out={740.4} y={880} size={70} />,
      <Words key="sh" t={t} items={[{ at: A.sheet, txt: "SHOULD BE AN EVEN SHEET", col: COL.ice }, { at: A.dry, txt: "DRY SPOTS = DEAD HOLES", col: COL.red }]} out={749.4} y={150} size={64} />,
      <Tag key="str" t={t} at={A.streaks} x={960} y={520} dx={240} dy={-170} text="STREAKS = HOLES THAT WORK" col={COL.amber} out={764.7} />,
      // 7 · el arreglo de $3
      <BigNum key="d3" t={t} at={A.d3} text="$3" x={1500} y={400} size={240} col="#9df0b4" edge="#1f5a36" out={774.8} sub="WHITE VINEGAR" />,
      <Words key="ac" t={t} items={[{ at: A.acid, txt: "MILD ACID", col: COL.ice }, { at: A.acid + 1.6, txt: "DISSOLVES SCALE", col: COL.amber }]} out={779.6} y={880} size={70} />,
      <CheckList key="safe" t={t} title="VINEGAR WON'T HURT" rows={[{ at: A.wont, txt: "PORCELAIN" }, { at: A.wont + 2.5, txt: "RUBBER PARTS" }, { at: A.wont + 5.5, txt: "YOUR PIPES" }]} out={789.1} />,
      <CheckList key="vin" t={t} title="THE $3 FIX" rows={[{ at: A.offV, txt: "WATER OFF · TANK EMPTY" }, { at: A.dryR, txt: "DRY UNDER THE RIM" }, { at: A.tape, txt: "TAPE OVER THE HOLES" }]} out={813.5} />,
      <Words key="dam" t={t} items={[{ at: A.dam, txt: "A DAM FOR THE VINEGAR", col: COL.ice }]} out={813.5} y={150} size={70} />,
      <Tag key="ov" t={t} at={A.overflow} x={tube46.x} y={tube46.y} dx={-240} dy={-150} text="OVERFLOW TUBE" sub="STRAIGHT INTO THE RIM" col={COL.amber} out={826.8} />,
      <Words key="wq" t={t} items={[{ at: A.warm, txt: "1 QUART · WARM, NOT BOILING", col: COL.amber }]} out={832.0} y={880} size={60} />,
      <Words key="hol" t={t} items={[{ at: A.hollow, txt: "SITS RIGHT IN THE HOLES", col: COL.ice }]} out={844.7} y={150} size={70} />,
      <WallClock key="ovn" t={t} at={A.overnight} out={852.2} label="OVERNIGHT" x={1500} y={420} />,
      <Words key="morn" t={t} items={[{ at: A.morning, txt: "IN THE MORNING", col: COL.amber }]} out={858.6} y={150} size={80} />,
      <Words key="crunch" t={t} items={[{ at: A.crunch, txt: "CRUNCH", col: COL.ice }, { at: A.flakes, txt: "FLAKES FALL OUT", col: COL.amber }]} out={875.0} y={150} size={80} />,
      <Words key="thumb" t={t} items={[{ at: A.thumb + 4.5, txt: "BREAK UP THE CRUST", col: COL.amber }]} out={889.6} y={880} size={66} />,
      <Words key="roar" t={t} items={[{ at: A.different, txt: "SOUNDS DIFFERENT" }, { at: A.swirls, txt: "SWIRLS", col: COL.ice }, { at: A.roars, txt: "ROARS", col: COL.amber }]} out={900.4} y={150} size={80} />,
      <Banner key="br" t={t} at={A.breathing} out={906.0} text="A TOILET THAT'S BREATHING AGAIN" col="#5ee38f" y={880} size={58} />,
      // 8 · tanque y flapper
      <Tag key="line" t={t} at={A.line} x={line51.x} y={line51.y} dx={-240} dy={-150} text="THE LINE" sub="1 INCH BELOW THE TOP" col={COL.amber} out={923.6} />,
      <Stamp key="ns" t={t} at={A.noSav} text="NO SAVINGS AT ALL" x={1380} y={300} out={941.0} rot={-7} size={70} />,
      <Words key="fast" t={t} items={[{ at: A.fast, txt: "SHUTS TOO FAST = HALF A FLUSH", col: COL.red }]} out={956.2} y={880} size={58} />,
      <BigNum key="sl" t={t} at={A.slack} text="½ INCH" x={1480} y={760} size={150} col={COL.amber} edge="#5a3a10" out={970.0} sub="CHAIN SLACK" />,
      // 9 · la prueba del balde
      <StepTitle key="bt" t={t} at={A.bucketT} n={7} name="THE BUCKET TEST" out={A.gallon - 0.2} y={300} />,
      <Words key="all" t={t} items={[{ at: A.allOnce, txt: "1½ GALLONS · ALL AT ONCE", col: COL.ice }]} out={986.0} y={880} size={60} />,
      <Words key="wb" t={t} items={[{ at: A.whooshB, txt: "WHOOSH = PIPES CLEAR", col: "#5ee38f" }]} out={992.0} y={150} size={70} />,
      <Words key="fur" t={t} items={[{ at: A.further, txt: "SLOW? FURTHER DOWN THE LINE", col: COL.red }]} out={999.2} y={880} size={58} />,
      // 10 · qué va al inodoro
      <Words key="tp" t={t} items={[{ at: A.paper, txt: "PAPER FALLS APART", col: "#5ee38f" }, { at: A.nothingE, txt: "NOTHING ELSE DOES", col: COL.red }]} out={1009.0} y={150} size={70} />,
      <Stamp key="fla" t={t} at={A.thousands} text={"\"FLUSHABLE\"? NO."} x={1380} y={820} out={1017.6} rot={-6} size={66} />,
      <Tag key="rope" t={t} at={A.rope} x={960} y={540} dx={240} dy={-160} text="A ROPE OF WIPES" col={COL.red} out={1024.0} />,
      <Words key="only" t={t} items={[{ at: A.n1, txt: "#1" }, { at: A.n1 + 1.0, txt: "#2", col: COL.amber }, { at: A.n1 + 2.2, txt: "TOILET PAPER", col: "#5ee38f" }]} out={1037.9} y={150} size={90} />,
      <Words key="tc" t={t} items={[{ at: A.half2, txt: "HALF THE PROBLEMS GONE", col: "#5ee38f" }]} out={1044.8} y={880} size={62} />,
      <Versus key="lf" t={t} at={A.g16 - 0.2} out={1063.1} title="GALLONS PER FLUSH" L={{ label: "NEW LOW-FLOW", val: "1.6", h: 0.32, col: COL.ice }} R={{ label: "OLD", val: "3.5–5", h: 0.8, col: COL.amber }} />,
      <Banner key="mid" t={t} at={A.middle} out={1074.8} text="BIG JOB? FLUSH IN THE MIDDLE" col={COL.amber} y={110} size={62} />,
      <Words key="2s" t={t} items={[{ at: A.twoSmall, txt: "2 SMALL FLUSHES > 1 BIG CLOG", col: COL.ice }]} out={1074.8} y={880} size={58} />,
      // 11 · cuándo llamar
      <CheckList key="call" t={t} title="CALL A PLUMBER IF" rows={[{ at: A.gurgles, txt: "IT GURGLES WITH THE SINK" }, { at: A.tubUp, txt: "THE TUB BACKS UP" }, { at: A.tubUp + 3, txt: "MORE THAN ONE DRAIN" }, { at: A.basement, txt: "BASEMENT DRAIN BACKS UP" }]} out={1095.3} />,
      <Tag key="main" t={t} at={A.main} x={main57.x} y={main57.y} dx={-240} dy={-160} text="MAIN SEWER LINE" sub="OUT TO THE STREET" col={COL.amber} out={1100.6} />,
      <Words key="rt" t={t} items={[{ at: A.roots, txt: "ROOTS" }, { at: A.broken, txt: "BROKEN PIPE", col: COL.red }, { at: A.belly, txt: "A BELLY", col: COL.amber }]} out={1105.7} y={150} size={80} />,
      <Stamp key="noP" t={t} at={A.noP} text="NO PLUNGER · NO AUGER · NO VINEGAR" x={1000} y={820} out={1109.6} rot={-4} size={50} />,
      <Words key="mach" t={t} items={[{ at: A.machine, txt: "BIG MACHINE + CAMERA", col: COL.ice }, { at: A.worth, txt: "WORTH EVERY PENNY", col: "#5ee38f" }]} out={1119.5} y={150} size={64} />,
      // 12 · resumen y cierre
      <CheckList key="sum" t={t} title="THE WHOLE THING" rows={[{ at: A.r1, txt: "STOP FLUSHING · FLAPPER DOWN" }, { at: A.r2, txt: "FLANGE PLUNGER · PUSH & PULL" }, { at: A.r4, txt: "SOAP + HOT TAP WATER · 20 MIN" }, { at: A.r5, txt: "CLOSET AUGER · NO HANGER" }, { at: A.r6, txt: "VINEGAR UNDER THE RIM" }]} out={1157.0} />,
      <BigNum key="d3b" t={t} at={A.three} text="$3" x={560} y={420} size={220} col="#9df0b4" edge="#1f5a36" out={1161.2} sub="FLUSHES LIKE NEW" />,
      <Banner key="old" t={t} at={A.old} out={1172.3} text="HOW OLD IS YOUR TOILET?" col={COL.amber} y={110} size={74} />,
      <Words key="com" t={t} items={[{ at: A.comments, txt: "TELL ME IN THE COMMENTS", col: COL.ice }]} out={1172.3} y={880} size={64} />,
      <Chips key="sub" t={t} at={A.subscribe} items={["SUBSCRIBE", "🔔 THE BELL"]} out={1179.5} />,
      <NextCard key="nx" t={t} at={A.next} subAt={A.next + 1.5} out={1186.8} title="NEVER POUR BAKING SODA + VINEGAR"><div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#2a1d12,#0d0a07)", fontSize: 72, fontWeight: 900, color: "#f4efe2", letterSpacing: 4, textAlign: "center", lineHeight: 1.1 }}>BAKING SODA<br />+ VINEGAR<br /><span style={{ color: "#e2483a", fontSize: 54 }}>WHY I DON'T</span></div></NextCard>,
      <Banner key="lenny" t={t} at={A.lenny} out={1191.0} text="I'M LENNY · TAKE CARE OF YOUR HOUSE" col={COL.ink} y={880} size={58} />,
      <Flash key="flE" t={t} at={1176.4} peak={0.4} />,
    ];
  },
});
export const Rest: React.FC = () => <V.Body />;
export const FULL_FRAMES = V.FRAMES;
