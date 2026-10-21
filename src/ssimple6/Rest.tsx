// ssimple6 · DEL MINUTO 2 AL FINAL (129,5 s → 1053 s). Mismo hilo que el minuto 1: avatar ⇄ la casa de Osaka, SIEMPRE por la tinta.
// La base se arma sola desde las ventanas del avatar (avwin.json): antes de cada ventana la tinta se esparce hacia Sachiko; al final de la
// ventana la tinta abre otra vez la casa (o una foto/toma). Las fotos entran y salen por la tinta desde un punto del mundo.
// Encima, las piezas NUEVAS de cada minuto (rest_fx.tsx), todas con at("frase"). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PT, screenOf } from "./osaka3d";
import { MIN1_END, NUM_AT, RECAP, RING2 } from "./tl";
import { BRUSH, COL, Hanko, SvgDefs, Tag, BigNum, at, atEnd, ei } from "./lib";
import { AVP, Avatar, Chip, Clip, Desc, InkLine, InkPortal, LowerThird, RingWaves, World, WIN } from "./ink";
import {
  Ball, BagOff, Balance, Bucket, CallsUp, CatWalk, CheckList, ColdHour, CommentBox, Counter, Dialogue, Distance, Enso, EveryDay, Gift, Gossip,
  Halfway, HelpLoop, Hourglass, KindNo, LoseWin, Armor, Needle, NextUp, NineList, Notes, Order, Paws, PriceTag, Said, ShouldRain, Shrink, Snow,
  Song, Sorry2, SorryFall, Stones, Subscribe, SundayGrid, Swap, Tally, Tanzaku, TatamiPlan, Topics, TwoWays, WordCard, WordFan, YearDial, YearFlip, YesPile,
} from "./rest_fx";

export const END = 1053.0;
type Pt = { x: number; y: number };
const AW = WIN.filter((w) => w.ms >= MIN1_END - 0.01);

// fotos/tomas a cuadro completo dentro de los tramos de mundo (a-b), entran por la tinta desde `from`
type Shot = { a: number; b: number; img: string; k?: string; from?: Pt };
const SHOTS: Shot[] = [
  { a: 133.3, b: 137.6, img: "r_walk", k: "m2_walk" },
  { a: 137.7, b: 140.5, img: "r_house", from: { x: 960, y: 420 } },
  { a: 150.9, b: 154.2, img: "r_visitors" },
  { a: 166.5, b: 169.1, img: "r_sharp" },
  { a: 184.3, b: 186.3, img: "r_bucket" },
  { a: 200.0, b: 204.6, img: "r_class" },
  { a: 234.3, b: 238.6, img: "r_hallway" },
  { a: 314.2, b: 317.3, img: "r_cushion" },
  { a: 347.1, b: 352.1, img: "r_tired" },
  { a: 382.8, b: 385.0, img: "r_hem" },
  { a: 428.5, b: 430.8, img: "r_stairs" },
  { a: 464.4, b: 467.8, img: "r_grocery" },
  { a: 535.7, b: 539.4, img: "r_grandkids", from: { x: 760, y: 700 } },
  { a: 612.6, b: 618.4, img: "r_cupsbox" },
  { a: 634.7, b: 640.4, img: "r_gasman", from: { x: 1100, y: 640 } },
  { a: 647.4, b: 650.3, img: "r_kintsugi" },
  { a: 711.9, b: 715.4, img: "r_garden", k: "m2_garden", from: { x: 1500, y: 600 } },
  { a: 740.7, b: 744.1, img: "r_gate" },
  { a: 766.4, b: 769.7, img: "r_baby", from: { x: 960, y: 640 } },
  { a: 829.8, b: 832.5, img: "r_step", from: { x: 1600, y: 760 } },
  { a: 887.3, b: 889.5, img: "r_rice" },
  { a: 893.3, b: 899.8, img: "r_100", from: { x: 1000, y: 640 } },
  { a: 905.0, b: 909.4, img: "r_choir", from: { x: 800, y: 500 } },
  { a: 1002.0, b: 1006.4, img: "r_ohio", from: { x: 960, y: 500 } },
  { a: 1042.0, b: 1044.1, img: "r_goodcups" },
];
const near = (x: number, ys: number[]) => ys.some((y) => Math.abs(x - y) < 0.06);
const AV_END = AW.map((w) => w.me), AV_START = AW.map((w) => w.ms);
const INK_AV = [AVP.shoji, AVP.cup, AVP.frame, AVP.window, AVP.hands];

const WorldOrShot: React.FC<{ t: number }> = ({ t }) => {
  const sh = SHOTS.find((x) => t >= x.a && t < x.b + 0.5);
  if (!sh) return <World t={t} />;
  const clip = <Clip k={sh.k ?? "x_" + sh.img} img={sh.img} t={t} a={sh.a} />;
  const soft0 = !near(sh.a, AV_END), soft1 = !near(sh.b, AV_START);
  if (t >= sh.b) return soft1 ? <><AbsoluteFill>{clip}</AbsoluteFill><InkPortal x={960} y={560} r={ei(t, sh.b, sh.b + 0.5)} seed={Math.round(sh.a) + 7}><World t={t} /></InkPortal></> : <AbsoluteFill>{clip}</AbsoluteFill>;
  if (soft0 && t < sh.a + 0.5) { const f = sh.from ?? { x: 960, y: 540 }; return <><World t={t} /><InkPortal x={f.x} y={f.y} r={ei(t, sh.a, sh.a + 0.5)} seed={Math.round(sh.a)}>{clip}</InkPortal></>; }
  return <AbsoluteFill>{clip}</AbsoluteFill>;
};

const Base: React.FC<{ t: number }> = ({ t }) => {
  const i = AW.findIndex((w) => t >= w.ms - 0.4 && t < w.me);
  if (i < 0) return <WorldOrShot t={t} />;
  const w = AW[i];
  if (t < w.ms) { const p = INK_AV[i % INK_AV.length]; return <><WorldOrShot t={t} /><InkPortal x={p.x} y={p.y} r={ei(t, w.ms - 0.4, w.ms)} seed={i + 30}><Avatar t={t} /></InkPortal></>; }
  if (t >= w.me - 0.4) { const p = [{ x: 960, y: 900 }, { x: 1500, y: 500 }, { x: 420, y: 520 }][i % 3]; return <><Avatar t={t} /><InkPortal x={p.x} y={p.y} r={ei(t, w.me - 0.4, w.me)} seed={i + 60}><WorldOrShot t={t} /></InkPortal></>; }
  return <Avatar t={t} />;
};

export const Rest: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const O = (k: string, n: React.ReactNode) => L.push(<React.Fragment key={k}>{n}</React.Fragment>);
  const ph = screenOf(t, PT.phone);

  // ---------- su casa, su gente (min 2) ----------
  O("war", <Chip t={t} at={130.4} out={133.0} text="THE WAR · THE HUNGRY YEARS" col={COL.indigo} />);
  O("nl", <Hanko t={t} at={at("never lonely")} text="NEVER LONELY" x={1440} y={330} out={137.5} size={66} />);
  O("tp", <TatamiPlan t={t} at={140.6} out={146.3} gardenAt={at("bed sheet") - 0.2} who={[
    { at: at("a neighbor"), text: "a neighbor", u: 0.3, v: 0.3 }, { at: at("a question", 140) + 0.1, text: "a question", u: 0.72, v: 0.55 },
    { at: 145.0, text: "a grandchild", u: 0.45, v: 0.8 }]} />);
  O("tea", <InkLine t={t} a={at("they came for her tea")} b={atEnd("for her mouth")} out={157.2} y={880} size={60} hot={["mouth"]} />);
  O("bal", <Balance t={t} at={at("lighter not heavier") - 1.0} out={161.3} x={1360} y={560} />);
  O("acc", <Hanko t={t} at={161.8} text="NOT BY ACCIDENT" x={1450} y={300} out={166.3} size={60} />);
  O("knife", <Chip t={t} at={at("kitchen knife")} out={169.0} text="A TONGUE LIKE A KITCHEN KNIFE" col={COL.red} />);
  O("dist", <Distance t={t} at={at("from the train station") - 0.6} out={172.8} />);
  O("61", <Counter t={t} at={at("when she was 61")} out={177.2} from={0} to={61} dur={0.9} label="AFTER MY FATHER DIED" x={1440} y={430} size={240} />);
  O("bk", <Bucket t={t} at={at("words are like water")} tip={at("once you throw them")} out={184.2} />);
  O("tl", <InkLine t={t} a={at("so i will throw less")} b={atEnd("so i will throw less")} out={186.2} y={860} size={84} hot={["less"]} />);
  O("sit", <Chip t={t} at={at("come and sit with me")} out={191.6} text="SIT WITH ME ON THE TATAMI" col={COL.gold} />);

  // ---------- los números: el ema de cada uno + la frase que dejó de decir ----------
  NUM_AT.forEach((a, i) => O("nt" + i, <Tag t={t} at={a + 0.15} x={screenOf(t, PT.ema(i)).x} y={screenOf(t, PT.ema(i)).y} dx={i % 2 ? -240 : 240} dy={200} text={`NUMBER ${i + 1}`} col={COL.red} out={a + 3.0} size={58} />));

  // #1 I'm too old for that → I have never tried that
  O("s1", <Said t={t} n={1} at={at("i'm too old for that", 192)} out={198.0} text="I'm too old for that" strike={1e9} />);
  O("c64", <Counter t={t} at={at("was 64", 195)} out={199.8} to={64} dur={0.7} label="CALLIGRAPHY · THURSDAYS" x={1440} y={420} size={220} />);
  O("hs", <InkLine t={t} a={at("oh no i'm too old")} b={atEnd("my hands shake")} out={211.0} y={870} size={64} hot={["old", "shake"]} />);
  O("hm", <InkLine t={t} a={at("i heard myself say it")} b={atEnd("the sound")} out={219.7} y={880} size={58} />);
  O("door", <Hanko t={t} at={at("closing a door")} text="SLAM." x={1460} y={330} out={222.5} size={90} rot={-8} />);
  O("yes", <Hanko t={t} at={at("and she said yes")} text="YES" x={1450} y={360} out={226.0} size={110} rot={5} />);
  O("31", <Counter t={t} at={at("for 31 years")} out={230.2} to={31} dur={1.2} label="YEARS IN THAT CLASS" x={1420} y={430} size={300} />);
  O("paw", <Paws t={t} at={at("a cat walked")} out={234.3} />);
  O("art", <Hanko t={t} at={at("who the artist was")} text="WHO IS THE ARTIST?" x={1380} y={830} out={238.5} size={56} rot={3} />);
  O("one", <InkLine t={t} a={at("she just changed one sentence")} b={atEnd("one sentence")} out={244.4} y={860} size={74} hot={["one"]} />);
  O("sw1", <Swap t={t} at={at("instead of i'm too old", 240)} neuAt={at("i have never tried that")} out={251.6} old="I'm too old for that" neu="I have never tried that" y={880} x={1300} />);
  O("wall", <Hanko t={t} at={at("is a wall")} text="A WALL" x={1420} y={360} out={253.7} size={96} />);
  O("dr", <Hanko t={t} at={at("is a door")} text="A DOOR, A LITTLE OPEN" x={1380} y={360} out={257.0} size={70} rot={4} />);

  // #2 so, you finally called → I am so happy to hear your voice
  O("s2", <Said t={t} n={2} at={at("you finally called", 257)} out={263.0} text="So, you finally called" />);
  O("hurt", <InkLine t={t} a={at("when she is hurt")} b={atEnd("to feel it too")} out={269.0} y={880} size={58} hot={["hurt"]} />);
  O("yrs", <Chip t={t} at={at("for years", 268)} out={271.3} text="FOR YEARS" col={COL.indigo} />);
  O("nd", <Needle t={t} at={at("the little needle")} hello={at("and then the hello")} out={276.4} />);
  O("rule", <Hanko t={t} at={at("she made a rule")} text="A RULE" x={1460} y={300} out={279.0} size={80} />);
  O("sw2", <Swap t={t} at={279.2} neuAt={at("i am so happy to hear")} out={287.9} old="So, you finally called" neu="I am so happy to hear your voice" y={780} />);
  O("ord", <Order t={t} out={296.4} x={1380} y={480} items={[{ at: at("you can be angry later") - 0.3, n: "1", text: "happy first" }, { at: at("angry later") , n: "2", text: "angry later", dim: true }]} />);
  O("cu", <CallsUp t={t} at={at("we called her more")} out={304.9} />);
  O("sg", <SundayGrid t={t} at={at("every sunday at 7")} out={311.6} />);
  O("rw2", <RingWaves t={t} x={ph.x} y={ph.y} on={t >= RING2[0] && t < RING2[1] ? 1 : 0} />);
  O("57", <Chip t={t} at={317.4} out={RING2[0]} text="5 TO 7 · SUNDAY" col={COL.indigo} />);
  O("pun", <Hanko t={t} at={at("do not punish them")} text="DON'T PUNISH LATE CALLS" x={1360} y={300} out={323.2} size={52} />);
  O("thk", <InkLine t={t} a={at("thank them for calling")} b={atEnd("at all", 323)} out={325.3} y={860} size={80} hot={["thank"]} />);

  // #3 yes to everything → no, kindly
  O("s3", <Said t={t} n={3} at={at("saying yes to everything")} out={334.4} text="Yes, to everything" />);
  O("40", <Counter t={t} at={at("for 40 years")} out={337.0} to={40} dur={0.8} label="YEARS OF YES" x={1440} y={430} size={260} />);
  O("yp", <YesPile t={t} out={347.0} items={[{ at: at("i will watch the baby"), text: "I will watch the baby" }, { at: at("i will cook for the funeral"), text: "I will cook for the funeral" }, { at: at("i will lend you the money"), text: "I will lend you the money" }, { at: at("i will sew your daughter's"), text: "I will sew the dress by Friday" }]} />);
  O("tir", <Hanko t={t} at={at("and she was tired")} text="TIRED" x={1500} y={300} out={352.2} size={90} />);
  O("kn", <KindNo t={t} at={at("she learned to say no")} wrap={at("but she said it kindly")} out={360.6} />);
  O("tz", <Tanzaku t={t} out={381.0} items={[{ at: at("let me think about it"), text: "Let me think about it.", sub: "ONE NIGHT" }, { at: at("thank you for asking me"), text: "Thank you for asking me. I cannot this time.", sub: "ONCE · PLAINLY" }, { at: at("one small thing she could"), text: "I can do the hem.", sub: "ONE SMALL THING" }]} />);
  O("srt", <Sorry2 t={t} at={at("one sorry is kind")} at2={at("two sorries")} out={392.6} />);
  O("p45", <Chip t={t} at={398.4} out={409.4} text="PAGE 45 · THE 101 DAY" col={COL.red} />);
  O("p45b", <InkLine t={t} a={at("her three sentences are there")} b={atEnd("always say no")} out={404.6} y={890} size={54} />);
  O("bag", <BagOff t={t} at={at("a heavy bag")} out={416.2} />);

  // #4 sorry → thank you
  O("s4", <Said t={t} n={4} at={at("i'm sorry for things")} out={421.6} text="I'm sorry" />);
  O("sf", <SorryFall t={t} out={432.4} items={[{ at: at("sorry for the small house"), text: "for the small house" }, { at: at("sorry the tea"), text: "the tea is not hot" }, { at: at("sorry i am slow on"), text: "I am slow on the stairs" }, { at: at("sorry for being a bother"), text: "for being a bother" }]} />);
  O("wf", <WordFan t={t} at={at("we have a word")} out={440.4} word="sumimasen" means={[{ at: at("it means sorry"), text: "sorry" }, { at: at("and excuse me"), text: "excuse me" }, { at: at("and thank you all at once"), text: "thank you" }]} />);
  O("ta", <Tally t={t} at={at("she said it 50 times")} out={446.4} />);
  O("tn", <Chip t={t} at={at("tanaka told her")} out={448.0} text="HER FRIEND, MRS. TANAKA" col={COL.indigo} />);
  O("sh", <Shrink t={t} at={at("every time you say sorry")} gone={at("nobody will see you")} out={454.4} />);
  O("sw4", <Swap t={t} at={at("instead of sorry i am slow")} neuAt={at("thank you for waiting for me")} out={462.6} old="Sorry I am slow" neu="Thank you for waiting for me" y={780} />);
  O("sw4b", <Swap t={t} at={at("instead of sorry the house")} neuAt={at("thank you for coming all")} out={468.0} old="Sorry the house is small" neu="Thank you for coming all this way" y={780} />);
  O("tw", <TwoWays t={t} at={at("it is the same moment")} at2={at("the other one makes")} out={474.4} />);

  // #5 in my day → do you want to hear something funny?
  O("s5", <Said t={t} n={5} at={at("in my day things were better", 477)} out={481.0} text="In my day, things were better" />);
  O("cat", <CatWalk t={t} at={481.7} out={487.0} />);
  O("imd1", <InkLine t={t} a={at("in my day the children")} b={atEnd("were polite")} out={489.3} y={300} size={64} />);
  O("10y", <PriceTag t={t} at={at("bread cost 10 yen")} out={492.0} top="BREAD · IN MY DAY" big="10 yen" />);
  O("imd3", <InkLine t={t} a={at("in my day people worked")} b={atEnd("worked hard")} out={494.0} y={300} size={64} />);
  O("song", <Song t={t} at={at("like a song")} out={501.6} text="“in my day…” ♪ (all together)" />);
  O("st5", <Hanko t={t} at={at("and she stopped", 501)} text="SHE STOPPED" x={1450} y={330} out={504.0} size={70} />);
  O("wl", <InkLine t={t} a={at("their days are worth less")} b={atEnd("than mine")} out={511.2} y={870} size={66} hot={["less"]} />);
  O("wr", <InkLine t={t} a={at("the wrong life")} b={atEnd("the wrong life")} out={515.6} y={860} size={84} hot={["wrong"]} />);
  O("clv", <Chip t={t} at={at("something clever")} out={522.0} text="SAME STORIES · NEW FIRST LINE" col={COL.gold} />);
  O("sw5", <Swap t={t} at={at("instead of in my day")} neuAt={at("do you want to hear something")} out={528.8} old="In my day, things were better" neu="Want to hear something funny?" y={780} />);
  O("gift", <Gift t={t} at={at("the same story but")} wrap={at("a gift not a complaint")} out={535.6} />);
  O("hw", <Halfway t={t} at={at("we are at the middle")} out={543.1} done={5} />);

  // CTA2 · pág. 4: las 8 palabras de su casa → MAKERU GA KACHI → los 5 libritos → la descripción → suscribirse
  O("p4", <Chip t={t} at={547.8} out={552.6} text="PAGE 4 · 8 WORDS FROM HER HOUSE" col={COL.red} />);
  O("mk", <WordCard t={t} at={at("makeru ga kachi", 550)} mean={at("to lose is to win", 553)} out={559.5} word="makeru ga kachi" en="to lose is to win" x={1340} y={330} />);
  O("n7", <Chip t={t} at={at("in number 7")} out={563.4} text="YOU'LL HEAR IT AGAIN · NUMBER 7" col={COL.gold} />);
  O("set", <BigNum t={t} at={at("the whole set")} text="The Osaka Way" font={BRUSH} size={130} y={170} out={573.0} col={COL.cream} edge="#3a2f24" sub="5 LITTLE BOOKS" />);
  O("five", <CheckList t={t} out={575.6} title="THE OSAKA WAY" x={1500} y={560} col={COL.indigo} items={[{ at: at("her day", 564), text: "her day" }, { at: at("her walk", 564), text: "her walk" }, { at: at("her money notebook"), text: "her money notebook" }, { at: at("her winter"), text: "her winter" }, { at: at("her small plates"), text: "her small plates" }]} />);
  O("ds", <Desc t={t} at={at("in the first line of the description", 572)} out={581.4} x={1140} y={600} scale={0.78} />);
  O("sub", <Subscribe t={t} at={at("please press subscribe") - 0.3} press={at("subscribe", 584)} out={588.0} />);

  // #6 I'm saving it for a special day → use the good cups
  O("s6", <Said t={t} n={6} at={at("saying i'm saving it")} out={593.0} text="I'm saving it for a special day" />);
  O("wed", <Chip t={t} at={at("from her wedding")} out={600.3} text="HER WEDDING CUPS · WHITE, A BLUE LINE" col={COL.indigo} />);
  O("yf", <YearFlip t={t} at={at("for 30 years")} out={606.2} from={1946} to={1976} label="in the cupboard" />);
  O("snow", <Snow t={t} at={at("then one winter")} out={612.4} />);
  O("unw", <Hanko t={t} at={at("she unwrapped her cups")} text="THAT SAME NIGHT" x={1450} y={300} out={622.6} size={64} />);
  O("ed", <EveryDay t={t} at={at("every day that i wake up")} out={626.2} />);
  O("gc", <Chip t={t} at={at("she used the good cups every morning")} out={634.5} text="THE GOOD CUPS · EVERY MORNING" col={COL.gold} />);
  O("gm", <Hanko t={t} at={at("did not know what to say")} text="THE GAS MAN, SPEECHLESS" x={1380} y={830} out={640.2} size={52} rot={3} />);
  O("11", <Counter t={t} at={at("eleven years later")} out={645.0} to={11} dur={0.6} label="YEARS LATER · ONE CUP BROKE" x={1440} y={430} size={220} />);
  O("kin", <WordCard t={t} at={650.4} mean={651.5} out={655.6} word="kintsugi" en="the glue line made it more beautiful" x={1300} y={300} />);
  O("sv", <InkLine t={t} a={at("my life today is not")} b={atEnd("good enough yet")} out={658.6} y={880} size={60} hot={["today"]} />);
  O("tdy", <CheckList t={t} out={666.5} title="TODAY" items={[{ at: at("unwrap the cups"), text: "Unwrap the cups" }, { at: at("wear the nice sweater"), text: "The nice sweater, on a Tuesday" }, { at: at("use the perfume"), text: "Use the perfume" }]} />);
  O("tdy2", <InkLine t={t} a={at("today is the day you")} b={atEnd("saving it for", 663)} out={666.5} y={900} size={58} hot={["today"]} />);

  // #7 did you hear about? → I hope they are all right
  O("s7", <Said t={t} n={7} at={at("saying did you hear about")} out={670.6} text="Did you hear about…?" />);
  O("st", <Chip t={t} at={at("in a small street")} out={675.4} text="A SMALL STREET IN OSAKA" col={COL.indigo} />);
  O("dl7", <Dialogue t={t} out={687.2} lines={[{ at: at("did you hear about mrs"), text: "Did you hear about Mrs. Ono's son?" }, { at: at("did you hear what the baker's"), text: "…what the baker's wife said?" }, { at: at("it was entertainment"), text: "(entertainment)", me: true }, { at: at("like the radio"), text: "like the radio 📻", me: true }]} />);
  O("gs", <Gossip t={t} at={691.6} back={at("the same women who carried") + 0.5} out={696.0} />);
  O("mo", <InkLine t={t} a={at("a person who talks about others")} b={atEnd("about you with others")} out={701.2} y={300} size={60} hot={["you"]} />);
  O("mouth", <Hanko t={t} at={at("it is the same", 700)} text="THE SAME MOUTH" x={1440} y={760} out={702.6} size={66} />);
  O("sw7", <Swap t={t} at={708.9} neuAt={at("oh i hope they are")} out={712.0} old="Did you hear about…?" neu="Oh, I hope they are all right" y={780} />);
  O("tp7", <Topics t={t} out={719.9} items={[{ at: at("to the garden"), text: "the garden", icon: "leaf" }, { at: at("or the weather"), text: "the weather", icon: "cloud" }, { at: at("the price of fish"), text: "price of fish", icon: "fish" }]} />);
  O("ball", <Ball t={t} at={at("pick up the ball") - 0.4} out={723.0} />);
  O("mk7", <WordCard t={t} at={at("makeru ga kachi", 720)} mean={at("to lose is to win", 723)} out={726.8} word="makeru ga kachi" en="to lose is to win" x={1300} y={300} />);
  O("lw", <LoseWin t={t} out={740.4} lost={[{ at: at("she lost the juicy"), text: "the juicy story" }, { at: at("being the first to know"), text: "being first to know" }]} won={{ at: at("everybody on that street trusted"), text: "TRUST" }} />);
  O("tr", <InkLine t={t} a={at("a sick husband")} b={atEnd("a child in debt")} out={742.6} y={880} size={60} />);
  O("gt", <Hanko t={t} at={at("my mother's gate")} text="HER GATE" x={1440} y={300} out={748.6} size={80} />);

  // #8 you should → what do you think you will do?
  O("s8", <Said t={t} n={8} at={at("saying you should")} out={753.6} text="You should…" />);
  O("rain", <ShouldRain t={t} at={at("advice like rain") - 0.2} out={766.2} />);
  O("wet", <Hanko t={t} at={at("everybody got wet")} text="EVERYBODY GOT WET" x={1420} y={300} out={766.2} size={60} />);
  O("hw8", <InkLine t={t} a={at("how to hold it")} b={atEnd("to put it to sleep")} out={769.5} y={300} size={52} />);
  O("yd", <YearDial t={t} at={at("stopped visiting for")} out={784.7} />);
  O("ly", <InkLine t={t} a={at("the longest year of her life")} b={atEnd("of her life", 780)} out={784.7} y={880} size={66} hot={["longest"]} />);
  O("sw8", <Swap t={t} at={at("she stopped saying you should", 784)} neuAt={at("what do you think you will")} out={790.2} old="You should…" neu="What do you think you will do?" y={780} />);
  O("hg", <Hourglass t={t} at={at("and then she waited")} out={796.0} />);
  O("wid", <InkLine t={t} a={at("this is what i did")} b={atEnd("what i did", 799)} out={800.8} y={880} size={64} hot={["did"]} />);
  O("dish", <Hanko t={t} at={at("like a dish on the table")} text="TAKE IT OR LEAVE IT" x={1420} y={300} out={804.4} size={58} />);

  // #9 I'm fine → the truth, a little
  O("tw9", <Chip t={t} at={at("two-word sentence i promised")} out={809.1} text="THE TWO-WORD SENTENCE" col={COL.gold} />);
  O("s9", <Said t={t} n={9} at={at("saying i'm fine", 808)} out={811.7} text="I'm fine" />);
  O("dl9", <Dialogue t={t} out={821.3} lines={[{ at: at("how are you mother"), text: "How are you, mother?" }, { at: at("i'm fine", 813), text: "I'm fine.", me: true }, { at: at("do you need anything"), text: "Do you need anything?" }, { at: at("no i'm fine"), text: "No, I'm fine.", me: true }, { at: at("is your knee hurting"), text: "Is your knee hurting?" }, { at: at("i'm fine i'm fine"), text: "I'm fine, I'm fine.", me: true }]} />);
  O("arm", <Armor t={t} at={at("were her armor") - 0.6} crack={1e9} out={829.6} />);
  O("73", <Counter t={t} at={at("when she was 73")} out={832.3} to={73} dur={0.6} label="ONE WINTER · THE ICY STEP" x={1440} y={430} size={220} />);
  O("snow9", <Snow t={t} at={829.8} out={850.2} />);
  O("nb", <Hanko t={t} at={at("nothing broken")} text="NOTHING BROKEN" x={1400} y={300} out={837.0} size={60} />);
  O("ch", <ColdHour t={t} at={at("for almost an hour")} out={843.0} />);
  O("bm", <Chip t={t} at={at("the bicycle man")} out={843.0} text="UNTIL THE BICYCLE MAN CAME BY" col={COL.indigo} />);
  O("bth", <InkLine t={t} a={at("i did not want to bother you")} b={atEnd("i was fine")} out={850.2} y={880} size={64} hot={["fine"]} />);
  O("arm2", <Armor t={t} at={at("that was the last time")} crack={at("the last time") + 0.4} out={854.2} />);
  O("nts", <Notes t={t} out={868.4} items={[{ at: at("my knee is stiff today"), text: "My knee is stiff today." }, { at: at("i am a little lonely"), text: "I am a little lonely this week." }, { at: at("could you carry this bag"), text: "Could you carry this bag up?" }]} />);
  O("ot", <WordCard t={t} at={at("otagai-sama") - 0.1} mean={at("we are all in this together")} out={872.0} word="otagai-sama" en="we are all in this together" x={1300} y={330} />);
  O("hl", <HelpLoop t={t} at={at("you ask for help")} out={876.5} />);
  O("kd", <InkLine t={t} a={at("you take away a chance")} b={atEnd("to be kind")} out={881.1} y={880} size={62} hot={["kind"]} />);
  O("sat", <Chip t={t} at={at("carrying her rice")} out={889.6} text="HER RICE · EVERY SATURDAY" col={COL.gold} />);
  O("crn", <Hanko t={t} at={at("paper cranes")} text="PAPER CRANES" x={1450} y={300} out={893.1} size={66} />);
  O("100", <Counter t={t} at={at("when she turned 100")} out={899.6} to={100} dur={1.0} label="SHE CAME BACK TO SING" x={1440} y={420} size={260} />);
  O("79", <Counter t={t} at={at("i am 79", 899)} out={903.5} to={79} dur={0.5} label="ME, TODAY" x={1440} y={420} size={200} />);
  O("drv", <InkLine t={t} a={at("i am nervous about driving")} b={atEnd("at night now")} out={909.2} y={880} size={58} />);
  O("dv", <Hanko t={t} at={at("then i will drive you")} text="“I WILL DRIVE YOU”" x={1420} y={300} out={912.2} size={60} />);
  O("hm9", <InkLine t={t} a={at("would have kept me home")} b={atEnd("kept me home")} out={916.0} y={880} size={72} hot={["home"]} />);

  // ---------- el repaso: los 9 ema se encienden uno por uno ----------
  O("nine", <NineList t={t} out={978.8} x={1130} y={60} items={[
    { at: RECAP[0], text: "I have never tried that." }, { at: RECAP[1], text: "I am so happy to hear your voice." }, { at: RECAP[2], text: "No — once, kindly — and one small thing." },
    { at: RECAP[3], text: "Thank you (instead of sorry)." }, { at: RECAP[4], text: "Want to hear something funny?" }, { at: RECAP[5], text: "She used the good cups." },
    { at: RECAP[6], text: "I hope they are all right." }, { at: RECAP[7], text: "What do you think you will do?" }, { at: RECAP[8], text: "The truth, a little. Let people help." }]} />);
  O("$", <Hanko t={t} at={at("not one of these costs")} text="$0" x={1440} y={360} out={983.2} size={120} />);
  O("stn", <Stones t={t} at={at("like taking stones")} out={995.0} />);
  O("one2", <InkLine t={t} a={at("one sentence at a time")} b={atEnd("one sentence at a time")} out={990.5} y={880} size={78} hot={["one"]} />);
  O("cm", <CommentBox t={t} at={at("please answer me in the comments")} typeAt={at("tell me yours")} out={1014.0} text="Number 4. I'm 72." />);
  O("q", <InkLine t={t} a={at("which of these nine")} b={atEnd("say the most")} out={1001.8} y={300} size={70} hot={["most"]} />);
  O("fin", <Chip t={t} at={at("with my one finger")} out={1016.2} text="ONE FINGER · THIS LITTLE TELEPHONE" col={COL.indigo} />);
  O("nx", <NextUp t={t} at={at("in the next video")} out={1027.8} />);
  O("cta", <BigNum t={t} at={at("it is all in the osaka way")} text="The Osaka Way" font={BRUSH} size={120} y={170} out={1036.6} col={COL.cream} edge="#3a2f24" sub="LINK IN THE FIRST LINE OF THE DESCRIPTION" />);
  O("pgs", <CheckList t={t} out={1036.6} title="HER PAGES" x={1500} y={600} col={COL.red} items={[{ at: at("the words", 1030), text: "the words" }, { at: at("the kind no"), text: "the kind no" }, { at: at("her day", 1032), text: "her day" }, { at: at("her week"), text: "her week" }]} />);
  O("lk", <Hanko t={t} at={at("the link is in the first", 1036)} text="FIRST LINE OF THE DESCRIPTION" x={1300} y={880} out={1041.8} size={50} rot={-3} />);
  O("ty", <LowerThird t={t} at={1040.0} out={1041.8} name="Sachiko" l2="THANK YOU FOR SITTING WITH ME" l2at={1040.2} />);
  O("ugc", <InkLine t={t} a={at("go and use the good cups")} b={atEnd("the good cups", 1042)} out={1046.3} y={880} size={80} hot={["good"]} />);
  O("tru", <InkLine t={t} a={at("tell them the truth")} b={atEnd("the truth", 1046)} out={1049.0} y={880} size={80} hot={["truth"]} />);
  O("enso", <Enso t={t} at={1048.4} out={1060} text="see you next time" />);

  return <AbsoluteFill style={{ background: "#0b0a09" }}><SvgDefs /><Base t={t} />{L}</AbsoluteFill>;
};
