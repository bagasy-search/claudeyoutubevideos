// hal01 · minutos 2-15 (MIN1_END → fin). UNA sola toma: cada tramo entra por un PORTAL desde un punto del tramo anterior
// (teléfono, libreta, taza del avatar; un objeto del mundo 3D; el centro de la foto). Todo anclado con at("frase").
// Render SÓLO en el farm; en local sólo stills.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COL, FONT, Portal, Tag, Card3D, BigNum, Chips, Flash, Vid, at, e, ei, extrude } from "./lib";
import { EV, KEYS, PT, TABLE_Y, screenOf } from "./kitchen3d";
import { Avatar, AVP, World, WIN, Stamp, Bubble, Shot, MIN1_END } from "./Min1";
import IMGS from "./imgs.json";
import {
  CallCard, CallNo, Reply, SwapWord, Hurry, WaitSplit, NameSlot, LoveLogic, VoiceClone, AddressBook, Curtain, CourierMap,
  FakeBill, DataLeak, CardFlip, Statement, PressOne, Cake, Chain, Tally, Spoof, CodeKey, SafeAcct, Hours4, RuleCard,
  ScareWords, PayWall, NeverList, Countdown, Notices, ColdTemp, Popup, Remote, Prizes, PayToWin, PayList, Refund, YesRec,
  NumValue, OneRing, Bait, FirstHour, FixList, GiftBack, ReportSite, CaseBoard, Triad, Comments, SubBell,
} from "./comps2";

// q("frase", ~segundo): busca la frase desde 4 s antes del segundo aproximado del guion (evita agarrar una anterior)
const q = (p: string, approx: number) => at(p, approx - 4);
const WV = WIN as { ms: number; me: number }[];
export const END = 923.0;

// ---------- foto (gpt) con zoom lento; si todavía no llegó, placa oscura con el nombre (sólo para stills) ----------
const HAVE = new Set(IMGS as string[]);
const Ph: React.FC<{ k: string; t: number; a: number; z?: [number, number]; dark?: number }> = ({ k, t, a, z = [1.04, 1.13], dark = 0 }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 9);
  return (
    <AbsoluteFill style={{ background: "#0b0f17", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${sc})`, filter: dark ? `brightness(${1 - dark})` : undefined }}>
        {HAVE.has(k) ? <Vid id={"img_" + k} /> : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#2c3546" }}>[{k}]</div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Dark: React.FC<{ c?: string }> = ({ c = "radial-gradient(circle at 50% 45%,#141b28,#05070b)" }) => <AbsoluteFill style={{ background: c }} />;

// ---------- cámara del mundo: poses con nombre ----------
type V = [number, number, number];
const padZ = (i: number) => 0.1 - 0.176 + 0.352 * ((160 + i * 70) / 1050);
const POSE = {
  padWide: { p: [0.35, 1.7, 1.0] as V, l: [-0.12, 0.76, 0.08] as V, fov: 38 },
  padTop: { p: [-0.12, 1.5, 0.3] as V, l: [-0.14, 0.76, 0.08] as V, fov: 34 },
  line: (i: number) => ({ p: [-0.13, 1.02, padZ(i) + 0.12] as V, l: [-0.147, 0.76, padZ(i)] as V, fov: 30 }),
  lineL: (i: number) => ({ p: [-0.42, 1.06, padZ(i) + 0.1] as V, l: [-0.13, 0.76, padZ(i)] as V, fov: 30 }),
  phone: { p: [0.8, 1.08, 0.66] as V, l: [0.3, 0.84, 0.01] as V, fov: 30 },
  phoneL: { p: [-0.25, 1.1, 0.55] as V, l: [0.32, 0.84, 0.0] as V, fov: 30 },
  phoneTop: { p: [0.36, 1.45, 0.2] as V, l: [0.34, 0.8, 0.0] as V, fov: 30 },
  wide: { p: [3.1, 2.9, 3.6] as V, l: [-0.5, 1.0, -1.0] as V, fov: 40 },
  wideL: { p: [-2.2, 2.4, 2.6] as V, l: [0.1, 0.9, -0.8] as V, fov: 42 },
  jack: { p: [0.9, 0.5, -1.3] as V, l: [0.45, 0.32, -2.17] as V, fov: 40 },
  pole: { p: [-4.2, 3.2, 1.5] as V, l: [-6.2, 6.5, -1.4] as V, fov: 45 },
  wire: { p: [-5.4, 6.4, -12] as V, l: [-6.6, 4.8, -34] as V, fov: 50 },
  cc: { p: [-2.7, 2.6, -35.8] as V, l: [-6.2, 1.0, -40] as V, fov: 44 },
  ccDesk: { p: [-4.6, 1.5, -37] as V, l: [-4.9, 1.0, -37.8] as V, fov: 40 },
};
const K = (t: number, pose: { p: V; l: V; fov: number }, x: { arc?: number; lin?: boolean } = {}) => KEYS.push({ t, ...pose, ...x });

// ---------- tiempos de la voz ----------
const W = (i: number) => WV[i];
const T = {
  old: q("old or slow", 77), pros: q("These people are professionals", 80), foolish: q("make you foolish", 86), polite: q("it makes you polite", 87.4),
  counting: q("counting on", 89), rule: q("my one rule", 91), hurry: q("the scammer is always", 96), wait: q("can all wait", 103), cant: q("scammer can't so", 105),
  notime: q("there's no time", 108), pads: q("pads", 112), one: q("number one the grandson", 113.5), grandpa1: q("some version of", 118.7),
  missing: q("Notice what's missing", 121.7), tommy: q("You say, Tommy", 124.3), trouble: q("Then comes the trouble", 127.1), car: q("A car accident", 129.8),
  jail: q("A jail cell", 130.5), nose: q("A broken nose", 131.9), mom: q("Please don't tell mom", 136), love: q("Love moves faster", 139), these: q("these days they", 141.3),
  few: q("A few seconds", 144.1), copy: q("a computer can copy", 147.4), which: q("which grandson", 151.5), already: q("the number I already have", 154.1),
  code: q("pick a code word", 157.8), silly: q("Something silly", 161.8), dog: q("Mine is a dog", 165.2), nocode: q("No code word", 167.7), act: q("watch for the second act", 168),
  newv: q("a new voice", 173), lawyer: q("a lawyer", 176.4), bail: q("the bail is", 179), scares: q("the part that scares me", 184), wire: q("They don't even ask", 186.6),
  courier: q("A courier", 189.6), know: q("Now they know your face", 194.6), noreal: q("lawyer no real", 198.4), nocourt: q("no real court", 199), nojail: q("no real jail", 199.5),
  two: q("Number 2", 203.5), medi: q("Hi, I'm calling from Medicare", 205.5), friendly: q("Sounds friendly", 213.6), official: q("Sounds official", 214.5), notcall: q("does not call you", 215.8),
  have: q("They already have it", 220.3), anyone: q("Anyone who calls", 222.7), wheel: q("wheelchairs", 226), brace: q("braces", 227.8), lab: q("and lab", 228),
  knowthings: q("already know things", 230), name: q("Your name", 233.6), addr: q("your address", 234.5), bday: q("your birthday", 235), doctor: q("even your doctor", 236),
  sold: q("sold online", 239), prepared: q("It just makes them prepared", 244), myself: q("I'll call Medicare myself", 247), back: q("The real number is printed", 252.3),
  stmt: q("check your Medicare statements", 255.2), knee: q("knee brace", 258.9), three: q("Number three", 262.8), robot: q("robot voice first", 265.2),
  ssn: q("Your social security number has", 268), press: q("Press one to speak", 271.9), stop: q("Stop right there", 274), cannot: q("cannot be suspended", 276.5),
  nosuch: q("There's no such thing", 279.2), bday2: q("birthday got canceled", 280.5), scary: q("sounds scary", 283), once: q("Once you press 1", 287.5),
  person: q("a real person picks up", 288), badge: q("badge number", 292.7), move: q("unless you move it", 294), nopress: q("I don't press anything", 296.6),
  nocallback: q("I don't call back", 298), never1: q("never once", 303), four: q("Number 4", 307.9), twice: q("Write this one down twice", 310.6), fraud: q("this is the fraud department", 312),
  deadly: q("makes it deadly", 318), callerid: q("Look at the caller ID", 320.3), faking: q("faking caller ID", 325.6), minute: q("about a minute", 328),
  helpful: q("they're so helpful", 330), charge: q("They read you a charge", 335.1), notme: q("that's not me", 338), block: q("We'll block it", 341), sending: q("I'm sending a code", 342.9),
  key: q("That code, my friend", 346.7), worse: q("the worse version", 349.6), safe: q("There is no safe account", 357), theirs: q("It's their account", 359.1),
  eng: q("retired engineer", 360), hours: q("four hours", 364.3), proud: q("He was proud", 369.5), callback: q("I'll call you back", 371.9), turn: q("I turn my card over", 374.2),
  still: q("they'll still know", 378.7), oldtrick: q("a trick from the old days", 381.6), diff: q("from a different phone", 383), stay: q("stay on the line", 386.4),
  ruleB: q("Write this rule on your pad", 392.3), readcode: q("read back a code", 394), moveit: q("move your money to protect", 397.3), never2: q("Never. Number 5", 400.5),
  irs: q("this is the IRS", 403.5), angry: q("deep, angry voice", 409.2), words: q("Lots of words like", 410), letter: q("starts with a letter", 413.2), threaten: q("threaten to send the police", 418),
  giveaway: q("the biggest giveaway", 421.5), strange: q("strange way", 426.5), gift: q("Gift cards, a wire", 431.5), cashc: q("a cash courier", 432.5), machine: q("a machine at the gas", 434.5),
  nogov: q("No real government office", 439.2), midsent: q("you hang up mid-sentence", 444.3), goodbye: q("You don't owe them a goodbye", 447.4), six: q("Number 6", 449.5),
  pretend: q("pretend they to", 452), sgt: q("this is Sergeant", 454.7), jury: q("You missed jury duty", 459.2), realname: q("real sounding name", 462.8), clear: q("clear it up today", 468),
  job: q("I did this job for 31 years", 472.4), ahead: q("We don't call ahead", 477), payment: q("We don't take payment", 478.5), judge: q("no judge anywhere", 480.8),
  arrested: q("I arrested a lot of people", 484.6), first: q("called them first", 487.2), knock: q("they knock", 491), badgeQ: q("give me and your name", 493.3),
  every: q("every time", 497.5), seven: q("Number 7", 499.9), elec: q("this is your electric company", 502.1), min45: q("45 minutes", 506), clock: q("That clock is the whole trick", 510.2),
  january: q("Chicago a January", 517.8), cold: q("sit in the cold", 521.1), notices: q("Real utilities send notices", 523.3), bill: q("and the number on your bill", 530.5), drawer: q("the one in the drawer", 532.6),
  eight: q("Number 8", 536.4), tech: q("I'm calling from technical support", 538.8), nobody: q("Nobody's sitting in an office", 549.3), warning: q("a big loud warning", 552.2),
  letin: q("let them into your computer", 559.4), see: q("they can see everything", 563.3), bankE: q("Your bank, your email", 565.6), email: q("your email", 566), pics: q("your pictures", 566.6),
  fix: q("the fix costs money", 567.9), noone: q("I don't let anyone into my computer", 571), freezes: q("If your screen ever freezes", 574.3), offon: q("You turn the computer off", 578.6),
  nine: q("Number nine", 580.9), won: q("congratulations, you've won", 583), sweep: q("A sweepstakes", 587.4), lottery: q("a lottery", 588), car2: q("a new car", 589), check: q("a big check", 590),
  catch_: q("comes the catch", 592), taxes: q("pay the taxes", 595), fee: q("processing fee", 597), ship: q("the shipping", 599.7), know2: q("Here's what you need to know", 600),
  law: q("against the law", 602.2), paywin: q("If you have to pay to win", 606.2), ugly: q("the folks who pay once", 609.5), list: q("a list of people who pay", 614.9),
  takefee: q("take the fee out of my winnings", 615.5), neverdo: q("They never do", 619.7), ten: q("Number 10", 619.9), order: q("The order you didn't place", 622), charged: q("has been charged", 625),
  press1b: q("press 1", 630.3), clever: q("That's a clever one", 632.7), agent: q("a nice agent", 636.8), oops: q("Then, oops", 642.3), diffback: q("send the difference back", 647.2),
  nocharge: q("There was no charge", 650.5), login: q("log into my account", 657), eleven: q("number 11", 661), hear: q("can just you hear", 665.7), yes: q("the polite thing is to say", 671),
  test: q("that call is a test", 682), checking: q("They're checking", 684.4), lists: q("goes on more lists", 688.6), noyes: q("I don't say yes to strangers", 692.5), who: q("I say, who's calling", 695.2),
  letring: q("number I ring", 699.9), message: q("will leave a message", 703.1), twelve: q("Number 12", 706), rings1: q("The phone rings once", 709.5), missed: q("look at the missed call", 711.7),
  country: q("from another country", 715.3), callb: q("So you call back", 718.6), bait: q("It's bait", 734.6), firsth: q("the first hour matters", 739), med2: q("If you gave out your Medicare", 743),
  readc: q("If you read a code", 753.2), tonight: q("right now, tonight", 758.5), lock: q("lock the account", 761), giftc: q("If you bought gift cards", 764), keep: q("Keep the cards", 768.7),
  fast: q("if you're fast enough", 773.3), unplug: q("unplug it from the internet", 776.1), device: q("from a different device", 781.4), bankf: q("your bank first", 783), emailT: q("then your email", 784),
  ftc: q("takes reports online", 788), ic3: q("called IC3", 794), police: q("call your local", 796), pile: q("every goes report into", 801.1), lady: q("a single report from one retired lady", 808.8),
  that12: q("So, that's 12", 813.8), three3: q("all come down to three things", 815), trust: q("Somebody you trust", 819.5), act2: q("A reason you have to act", 821.8), strange2: q("a strange way to pay", 823),
  thw: q("Trust, hurry", 825.7), hundred: q("a hundred times", 829), doweek: q("what I want you to actually do", 833.2), not12: q("Not 12 things", 836), tape: q("take a little card and tape", 838.3),
  write: q("Write on it", 842), fourw: q("Those four words", 845.2), two2: q("Number two, sit down", 848.8), three4: q("And number three, tell somebody", 852.4), church: q("A friend from church", 855),
  silence: q("These people count on silence", 857.4), embar: q("they're embarrassed", 862), tellme: q("Tell me. Tell your kids", 864.3), sent: q("If you already sent money", 866.8), faster: q("The faster you call", 870.9),
  subscribe: q("hit subscribe", 875), bell: q("little bell", 876.5), hearYou: q("I want to hear from you", 879.6), bet: q("I bet half of you", 884.7), shame: q("No shame in it", 889.6), oneless: q("one less person", 891),
  nextw: q("Next week", 894.2), water: q("the water company", 899.4), dog2: q("the lost dog", 900), survey: q("the survey", 900.5), dontmiss: q("You don't want to miss", 904.6),
  spent: q("I spent 31 years catching", 907), rather: q("I'd much rather catch them before", 910.9), nexttime: q("So the next time that phone rings", 912.9), say: q("I'll call you back", 916),
  care: q("Take care of yourself", 918.5),
};

// ---------- el mundo: cámara y eventos de los minutos 2-15 (siempre en t creciente, después de los del minuto 1) ----------
EV.ring.push([T.rings1 - 0.1, T.rings1 + 0.7], [T.nexttime + 0.4, T.say - 0.3]);
const HL: [number, number][] = [[T.pads + 0.3, 0], [T.two, 1], [T.three - 1.3, 2], [T.four, 3], [T.never2 + 0.6, 4], [T.six + 1.3, 5], [T.seven, 6], [T.eight, 7], [T.nine + 2.1, 8], [T.ten, 9], [W(41 - 1).me, 10], [T.twelve, 11]];
HL.forEach(([t, i]) => { EV.hl.push([t, i]); if (i > 0) EV.done.push([t - 0.05, i - 1]); });
EV.done.push([T.that12 + 0.2, 11]);

// tramos con mundo: la cámara llega a la pose al empezar el tramo y se mueve durante él
K(MIN1_END - 0.1, POSE.wide);
K(T.old + 0.4, POSE.pole, { arc: 0.3 });
K(T.pros - 0.2, POSE.wire);
K(W(5).ms, POSE.cc);
K(W(5).me, POSE.ccDesk);
K(T.notime + 0.6, POSE.padWide);
K(W(7).ms, POSE.line(0));
K(T.two - 0.6, POSE.padTop);
K(T.medi, POSE.line(1));
K(W(13).ms, POSE.phone);
K(T.four - 0.8, POSE.padWide);
K(T.twice - 0.2, POSE.lineL(3));
K(T.fraud + 0.5, POSE.phoneL);
K(W(19).ms, POSE.phone);
K(T.proud - 0.3, POSE.wideL);
K(T.callback + 0.2, POSE.phoneTop);
K(T.diff + 0.6, POSE.phoneL);
K(T.stay + 0.2, POSE.jack, { arc: 0.25 });
K(T.ruleB - 0.1, POSE.padTop);
K(W(24).ms, POSE.line(4));
K(T.irs, POSE.lineL(4));
K(T.six + 1.1, POSE.padWide);
K(T.pretend + 0.5, POSE.line(5));
K(T.every + 0.3, POSE.padTop);
K(T.elec, POSE.line(6));
K(T.eight - 0.2, POSE.padWide);
K(T.tech, POSE.lineL(7));
K(T.nine + 1.9, POSE.padTop);
K(T.won, POSE.line(8));
K(T.neverdo + 0.2, POSE.padWide);
K(T.order, POSE.lineL(9));
K(W(41 - 1).me - 0.2, POSE.padTop);
K(T.hear, POSE.line(10));
K(T.noyes - 0.1, POSE.phoneL);
K(W(42).ms, POSE.phone);
K(T.twelve - 0.4, POSE.padWide);
K(T.rings1 - 0.6, POSE.phoneTop);
K(W(43).ms, POSE.phone);
K(T.that12 + 0.1, POSE.padWide);
K(T.trust - 0.2, POSE.padTop);
K(T.fourw - 0.2, POSE.phoneTop);
K(T.two2, POSE.phoneL);
K(T.nexttime - 0.1, POSE.phone);
K(T.say, POSE.phoneL, { arc: 0.2 });
K(END, POSE.wide, { arc: 0.3 });

// ---------- piezas de la toma ----------
type Pt = { x: number; y: number };
type Part = { a: number; bg: (t: number) => React.ReactNode; pt?: (t: number) => Pt };
const C: Pt = { x: 960, y: 540 };
const wpt = (p: V) => (t: number) => screenOf(t, p);
const padPt = (i: number): V => [-0.147, TABLE_Y + 0.009, padZ(i)];
const AVPTS = [AVP.phone, AVP.pad, AVP.mug];
const world = (t: number) => <World t={t} />;
const ph = (k: string, a: number, dark = 0) => (t: number) => <Ph k={k} t={t} a={a} dark={dark} />;
const dark = () => <Dark />;

const PARTS: Part[] = [];
const P = (a: number, bg: Part["bg"], pt?: Part["pt"]) => PARTS.push({ a, bg, pt });
// ventanas del avatar 5..55 como piezas (el portal de salida sale del teléfono, la libreta o la taza, en rueda)
const AV = (i: number) => P(W(i).ms, (t) => <Avatar t={t} />, () => AVPTS[i % 3]);
// placa de un tramo hecho entero con componentes (fondo propio)
// placa de componentes: la cocina 3D sigue viva DEBAJO (oscurecida), así nunca hay un fondo muerto y la toma no se corta
const comp = (bgC = "radial-gradient(circle at 50% 45%,#141b28,#05070b)") => (t: number) => <AbsoluteFill><World t={t} /><AbsoluteFill style={{ background: bgC, opacity: 0.6 }} /></AbsoluteFill>;

P(MIN1_END, world, wpt(PT.cc));                                         // g5 · la cámara sale por el cable hasta la sala de llamadas
AV(5);
P(W(5).me, world, wpt([-4.9, 1.0, -37.8]));                             // g6 · el escritorio del estafador
P(T.foolish - 0.3, ph("polite", T.foolish - 0.3, 0.35));
P(T.rule - 0.2, ph("rule", T.rule - 0.2));
P(T.hurry - 0.2, comp("#0b0202"));
AV(6);
P(W(6).me, comp());                                                     // g7 · real vs estafador
P(T.notime + 0.4, world, wpt(padPt(0)));                                // la libreta: renglón 1
AV(7);
P(W(7).me, ph("grandframe", W(7).me));                                  // g8 · "Grandpa, it's me"
P(T.missing - 0.2, ph("grandframe2", T.missing - 0.2, 0.55));
AV(8);
P(W(8).me, (t) => <Shot k="pickup" t={t} a={W(8).me - 0.5} />);          // g9 (toma LTX) · don't tell mom → amor vs lógica → voz clonada
P(T.love - 0.2, comp("rgba(8,10,16,1)"));
P(T.these - 0.1, comp());
AV(9);
P(W(9).me, world, wpt(padPt(0)));                                       // g10 · which grandson / agenda / palabra clave
P(T.code - 0.2, ph("codeword", T.code - 0.2));
AV(10);
P(W(10).me, comp());                                                    // g11 · acto II: el abogado
P(T.newv - 0.2, ph("lawyerphone", T.newv - 0.2, 0.5));
AV(11);
P(W(11).me, ph("courier", W(11).me));                                   // g12 · el mensajero
P(T.know - 1.4, comp());
AV(12);
P(W(12).me, world, wpt(padPt(1)));                                      // g13 · #2 Medicare
AV(13);
P(W(13).me, comp());                                                    // g14 · la tarjeta + factura falsa
P(T.anyone - 0.2, comp("radial-gradient(circle at 30% 50%,#1b2433,#06080c)"));
AV(14);
P(W(14).me, comp());                                                    // g15 · filtración de datos
P(T.prepared - 2.4, comp());
AV(15);
P(W(15).me, comp());                                                    // g16 · la tarjeta al revés + el resumen
P(T.stmt - 0.2, ph("statement", T.stmt - 0.2, 0.35));
AV(16);
P(W(16).me, ph("robot", W(16).me, 0.4));                                // g17 · robollamada del SSN
P(T.cannot - 0.2, comp("radial-gradient(circle at 50% 45%,#2a1a2e,#07050b)"));
AV(17);
P(W(17).me, comp());                                                    // g18 · la cadena
AV(18);
P(W(18).me, ph("letters", W(18).me, 0.3));                              // g19 · cartas reales → #4
P(T.four - 0.6, world, wpt(padPt(3)));
P(T.twice + 1.3, ph("twice", T.twice + 1.3, 0.35));
AV(19);
P(W(19).me, comp());                                                    // g20 · el identificador falso
AV(20);
P(W(20).me, ph("cardnum", W(20).me, 0.4));                              // g21 · "that's not me" → el código = la llave
P(T.block - 0.2, comp());
AV(21);
P(W(21).me, comp());                                                    // g22 · cuenta segura
P(T.theirs + 0.6, ph("engineer", T.theirs + 0.6));
AV(22);
P(W(22).me, world, wpt(PT.phone));                                      // g23 · orgulloso de su calma → "I'll call you back" → la tarjeta
P(T.turn - 0.2, ph("cardback", T.turn - 0.2));
AV(23);
P(W(23).me, ph("cellphone", W(23).me));                                 // g24 · otro teléfono → la línea abierta → regla
P(T.stay - 0.3, world, wpt(PT.jack));
P(T.ruleB - 0.3, comp("#2a1d10"));
AV(24);
P(W(24).me, world, wpt(padPt(4)));                                      // g25 · #5 IRS
P(T.irs - 0.2, comp("linear-gradient(180deg,#1a0504,#050101)"));
AV(25);
P(W(25).me, world, wpt(PT.phone));                                      // g26 · no llaman para amenazar → la gran pista
P(T.giveaway - 0.2, ph("giftcards", T.giveaway - 0.2, 0.5));
AV(26);
P(W(26).me, comp());                                                    // g27 · las 4 formas de pagar → cortar a la mitad
P(W(27).ms - 3.0, ph("slam", W(27).ms - 3.0));       // antes del avatar: si arranca después lo tapa entero
AV(27);
P(W(27).me, world, wpt(padPt(5)));                                      // g28 · #6 la orden de arresto
P(T.pretend + 0.8, ph("oldphoto", T.pretend + 0.8));
P(T.sgt - 0.1, comp("linear-gradient(180deg,#0a1222,#03060c)"));
AV(28);
P(W(28).me, comp());                                                    // g29 · cómo funciona de verdad
P(T.job - 0.2, comp("radial-gradient(circle at 50% 40%,#162236,#05080e)"));
AV(29);
P(W(29).me, comp());                                                    // g30 · arrestos / golpean la puerta
P(T.knock - 0.3, ph("knock", T.knock - 0.3));
AV(30);
P(W(30).me, world, wpt(padPt(6)));                                      // g31 · #7 la luz
AV(31);
P(W(31).me, ph("snow", W(31).me));                                      // g32 · enero en Chicago → avisos en papel
P(T.notices - 0.2, comp());
AV(32);
P(W(32).me, ph("drawer", W(32).me));                                    // g33 · el cajón → #8
P(T.eight - 0.3, world, wpt(padPt(7)));
AV(33);
P(W(33).me, ph("laptop", W(33).me, 0.25));                              // g34 · el cartel de virus
AV(34);
P(W(34).me, comp());                                                    // g35 · acceso remoto → apagar y prender
P(T.noone - 0.2, comp("radial-gradient(circle at 50% 45%,#141b28,#05070b)"));
P(T.freezes - 0.2, ph("power", T.freezes - 0.2));
AV(35);
P(W(35).me, world, wpt(padPt(8)));                                      // g36 · #9 ganaste
P(T.won + 2.6, ph("prize", T.won + 2.6, 0.55));
AV(36);
P(W(36).me, comp());                                                    // g37 · pagar para ganar → la lista
P(W(37).ms - 3.0, ph("list", W(37).ms - 3.0, 0.55));  // antes del avatar
AV(37);
P(W(37).me, world, wpt(padPt(9)));                                      // g38 · #10 el pedido que no hiciste
AV(38);
P(W(38).me, comp());                                                    // g39 · el reembolso
AV(39);
P(W(39).me, comp());                                                    // g40 · era tu plata → entro yo mismo
P(T.login - 0.3, ph("bankonline", T.login - 0.3, 0.3));
AV(40);
P(W(40).me, world, wpt(padPt(10)));                                     // g41 · #11 ¿me escucha?
P(T.yes - 0.2, comp());
AV(41);
P(W(41).me, comp());                                                    // g42 · tu número vale más
P(T.noyes - 0.3, world, wpt(PT.phone));
AV(42);
P(W(42).me, ph("letring", W(42).me));                                   // g43 · que suene → #12 un timbre
P(T.twelve - 0.5, world, wpt(PT.phone));
AV(43);
P(W(43).me, comp());                                                    // g44 · llamada perdida → taxímetro
AV(44);
P(W(44).me, comp());                                                    // g45 · carnada → la primera hora
P(T.firsth - 0.4, comp());
AV(45);
P(W(45).me, comp("linear-gradient(180deg,#e9ecf0,#cfd6df)"));           // g46 · si ya te agarró
P(T.tonight - 0.2, ph("night", T.tonight - 0.2));
AV(46);
P(W(46).me, comp());                                                    // g47 · gift cards: guardá todo
AV(47);
P(W(47).me, ph("unplug", W(47).me));                                    // g48 · desenchufá → contraseñas → denuncia
P(T.device - 0.2, comp());
P(T.ftc - 0.3, comp("radial-gradient(circle at 50% 40%,#1b2433,#06080c)"));
AV(48);
P(W(48).me, ph("station", W(48).me));                                   // g49 · la policía → la pila de denuncias
P(T.pile - 0.3, comp());
AV(49);
P(W(49).me, world, wpt(PT.pad));                                        // g50 · las 12 tildadas → tres cosas
P(T.trust - 0.2, comp());
AV(50);
P(W(50).me, comp());                                                    // g51 · tres cosas esta semana
P(T.tape - 0.2, ph("tape", T.tape - 0.2));
AV(51);
P(W(51).me, world, wpt(PT.phone));                                      // g52 · la ficha junto al teléfono → palabra clave → contale a alguien
P(T.church - 0.2, ph("church", T.church - 0.2));
AV(52);
P(W(52).me, ph("fence", W(52).me));                                     // g53 · que no te dé vergüenza
P(T.sent - 0.2, comp());
AV(53);
P(W(53).me, world, wpt(PT.phone));                                      // g54 · suscribirse + campanita → comentarios
P(T.hearYou - 0.2, comp());
AV(54);
P(W(54).me, comp());                                                    // g55 · una persona menos → la semana que viene
P(T.nextw - 0.2, ph("doorchain", T.nextw - 0.2, 0.3));
AV(55);
P(W(55).me, ph("porch", W(55).me));                                     // g56 · cierre: suena una vez más
P(T.nexttime - 0.2, world, wpt(PT.phone));
PARTS.sort((x, y) => x.a - y.a);

// ---------- encima: piezas nuevas ancladas a la voz ----------
const ov = (t: number): React.ReactNode[] => {
  const L: React.ReactNode[] = [];
  const add = (n: React.ReactNode) => L.push(n);
  const scr = (p: V) => screenOf(t, p);
  // g5 · no es por viejo / profesionales
  add(<Stamp key="nos" t={t} at={T.old} text="NOT OLD · NOT SLOW" x={960} y={250} out={T.pros - 0.2} size={96} rot={-6} />);
  { const c = scr(PT.cc); add(<Tag key="pro" t={t} at={T.pros} x={c.x} y={c.y} dx={260} dy={-200} text="PROFESSIONALS" sub="OVERSEAS CALL CENTER" col={COL.amber} out={W(5).ms - 0.3} />); }
  // W5 · turnos, guiones, supervisor
  add(<Chips key="sh" t={t} at={q("in shifts", 80.5)} items={["SHIFTS", "SCRIPTS", "A SUPERVISOR"]} out={W(5).me - 0.3} y={880} />);
  // g6
  { const c = scr([-4.9, 1.0, -37.8]); add(<Tag key="scr" t={t} at={W(5).me} x={c.x} y={c.y} dx={-320} dy={-180} text="SCRIPT v7" sub="“GRANDPA, IT'S ME”" col={COL.ink} out={T.foolish - 0.4} />); }
  add(<SwapWord key="sw" t={t} a={T.foolish} b={T.polite} out={T.rule - 0.4} from="FOOLISH" to="POLITE" />);
  add(<Tag key="cnt" t={t} at={T.counting} x={960} y={720} dx={0} dy={60} text="…EXACTLY WHAT THEY COUNT ON" col={COL.amber} out={T.rule - 0.4} size={46} />);
  add(<Stamp key="rule" t={t} at={T.rule + 0.2} text="ONE RULE" x={1440} y={260} out={T.hurry - 0.4} rot={6} size={110} col="#f6e27a" />);
  add(<Hurry key="hur" t={t} at={T.hurry} out={W(6).ms + 0.2} />);
  // W6
  add(<Chips key="real" t={t} at={q("always a real a bank", 98)} items={["REAL BANK", "REAL GRANDSON", "REAL GOVERNMENT"]} out={W(6).me - 0.2} y={880} />);
  // g7
  add(<WaitSplit key="ws" t={t} a={W(6).me - 0.2} b={T.cant} out={T.notime + 0.6} />);
  add(<Stamp key="nt" t={t} at={T.notime} text="“NO TIME!” = HANG UP" x={960} y={260} out={W(7).ms - 0.3} size={90} />);
  { const c = scr(padPt(0)); add(<Tag key="pad1" t={t} at={T.pads + 0.4} x={c.x} y={c.y} dx={330} dy={-150} text="PADS OPEN" sub="LET'S GO" col="#f6e27a" out={W(7).ms - 0.3} />); }
  // W7 · #1
  add(<CallNo key="n1" t={t} at={T.one} out={W(7).me - 0.3} n={1} title="THE GRANDSON IN JAIL" />);
  // g8
  add(<CallCard key="cc1" t={t} at={W(7).me + 0.2} out={T.missing - 0.4} kind="lcd" who="UNKNOWN" line="Grandpa, it's me." y={300} />);
  add(<NameSlot key="nsl" t={t} a={T.missing} you={T.tommy + 0.9} out={W(8).ms + 0.2} />);
  // W8
  add(<Chain key="tr" t={t} steps={[["CAR ACCIDENT", T.car], ["JAIL CELL", T.jail], ["BROKEN NOSE", T.nose]]} out={W(8).me - 0.4} col={COL.red} />);
  // g9
  add(<Stamp key="mom" t={t} at={T.mom} text="“DON'T TELL MOM.”" x={960} y={300} out={T.love - 0.3} size={110} />);
  { const c = { x: 1250, y: 560 }; add(<Tag key="give" t={t} at={T.mom + 0.6} x={c.x} y={c.y} dx={-360} dy={140} text="THE GIVEAWAY" col={COL.red} out={T.love - 0.3} />); }
  add(<LoveLogic key="ll" t={t} at={T.love} out={T.these + 0.2} />);
  add(<VoiceClone key="vc" t={t} a={T.these} copy={T.few + 1.6} out={W(9).ms + 0.3} />);
  // W9
  add(<Tag key="bad" t={t} at={W(9).ms + 0.4} x={1500} y={760} dx={0} dy={-80} text="FOOLS YOU ON A BAD LINE" col={COL.amber} out={W(9).me - 0.4} size={44} />);
  // g10
  add(<Reply key="r1" t={t} at={W(9).me + 0.2} out={T.code - 0.4} text="Which grandson?" x={700} y={560} />);
  add(<AddressBook key="ab" t={t} at={T.already} out={T.code - 0.4} />);
  add(<Stamp key="cw" t={t} at={T.code + 0.3} text="CODE WORD" x={960} y={240} out={W(10).ms - 0.3} size={110} col="#6fe39a" />);
  add(<Chips key="sil" t={t} at={T.silly} items={["SILLY", "NO STRANGER COULD GUESS"]} out={W(10).ms - 0.3} y={880} />);
  // W10 · el perro de 1982
  { const o = e(t, T.dog, T.dog + 0.3) * (1 - e(t, T.nocode - 0.2, T.nocode + 0.1)); add(<Card3D key="dog" id={HAVE.has("dogphoto") ? "img_dogphoto" : "img_codeword"} x={1290} y={250} w={520} h={390} ry={-12} rz={4} o={o} label="1982" />); }
  add(<Stamp key="ncw" t={t} at={T.nocode} text="NO CODE WORD = NO MONEY" x={960} y={220} out={W(10).me - 0.3} size={80} />);
  // g11 · acto II
  add(<Curtain key="cur" t={t} a={W(10).me - 0.3} out={T.newv - 0.1} />);
  add(<CallCard key="law" t={t} at={T.lawyer - 0.2} out={W(11).ms + 0.3} kind="bank" who="“PUBLIC DEFENDER”" line="Very calm. Very professional. Bail is set." />);
  add(<BigNum key="bail" t={t} at={T.bail + 0.6} text="$8,000–$9,000" sub="“BAIL”" x={960} y={760} size={130} col="#f6e27a" edge="#5a4a10" out={T.scares - 0.3} />);
  add(<Stamp key="scr2" t={t} at={T.scares + 0.3} text="THE SCARY PART" x={1460} y={260} out={W(11).me - 0.3} rot={7} size={90} />);
  // g12
  add(<DrawXLite key="nw" t={t} at={T.wire + 0.4} out={T.courier - 0.2} text="WIRE IT" />);
  add(<Tag key="nym" t={t} at={T.courier + 0.4} x={960} y={620} dx={300} dy={-200} text="A NICE YOUNG MAN" sub="IN A CAR · AT YOUR DOOR" col={COL.amber} out={T.know - 1.5} />);
  add(<CourierMap key="cm" t={t} a={T.know - 1.4} know={T.know} out={W(12).ms + 0.3} />);
  // W12
  add(<Chips key="nr" t={t} at={T.noreal} items={["NO REAL LAWYER", "NO REAL COURT", "NO REAL JAIL"]} out={W(12).me - 0.3} y={880} />);
  // g13 · #2
  add(<CallNo key="n2" t={t} at={T.two} out={T.medi - 0.3} n={2} title="MEDICARE" />);
  add(<CallCard key="cc2" t={t} at={T.medi} out={W(13).ms + 0.2} kind="lcd" who="“MEDICARE”" line="We're sending out new cards. I just need to verify your number." y={290} />);
  // W13
  add(<Chips key="fo" t={t} at={T.friendly} items={["FRIENDLY", "OFFICIAL"]} out={W(13).me - 0.3} y={880} />);
  // g14
  add(<Stamp key="dnc" t={t} at={T.notcall + 0.4} text="MEDICARE DOESN'T CALL" x={960} y={220} out={T.anyone - 0.3} size={90} />);
  add(<CardFlip key="cf1" t={t} a={T.notcall + 0.8} out={T.anyone - 0.3} front="MEDICARE · YOUR CARD" back="THEY ALREADY HAVE IT" col="#2b4f7e" />);
  add(<FakeBill key="fb" t={t} a={T.anyone} times={[T.wheel, T.brace, T.lab]} out={W(14).ms + 0.3} />);
  add(<Tag key="col" t={t} at={T.anyone + 0.5} x={300} y={540} dx={60} dy={-160} text="READ IT BACK?" sub="THEY BILL UNDER IT" col={COL.red} out={W(14).ms} />);
  // W14
  add(<Tag key="kt" t={t} at={T.knowthings} x={1500} y={760} dx={0} dy={-80} text="THEY KNOW THINGS" col={COL.amber} out={W(14).me - 0.3} size={50} />);
  // g15
  add(<DataLeak key="dl" t={t} a={W(14).me - 0.2} times={[T.name, T.addr, T.bday, T.doctor]} sold={T.sold} out={T.prepared - 2.2} />);
  add(<SwapWord key="sw2" t={t} a={T.prepared - 2.4} b={T.prepared + 0.4} out={W(15).ms + 0.2} from="MEDICARE" to="PREPARED" />);
  // W15
  add(<Bubble key="b15" t={t} at={T.myself + 0.2} text={"“I'll call Medicare myself.”"} x={1360} y={300} out={W(15).me - 0.2} />);
  // g16
  add(<CardFlip key="cf2" t={t} a={W(15).me - 0.2} out={T.stmt - 0.3} front="MEDICARE" back="1-800-MEDICARE" col="#2b4f7e" />);
  add(<Statement key="st" t={t} at={T.stmt} hi={T.knee} out={W(16).ms + 0.3} />);
  add(<CallNo key="n3" t={t} at={T.three} out={W(16).me - 0.3} n={3} title="SOCIAL SECURITY" />);
  // g17
  add(<CallCard key="cc3" t={t} at={W(16).me} out={T.stop - 0.2} kind="robot" who="AUTOMATED" line="Your Social Security number has been suspended. Press 1." y={300} />);
  add(<PressOne key="p1" t={t} at={T.press} out={T.stop + 0.6} />);
  add(<Stamp key="stp" t={t} at={T.stop} text="STOP." x={960} y={700} out={T.cannot - 0.2} size={150} />);
  add(<SwapWord key="sw3" t={t} a={T.cannot} b={T.nosuch} out={W(17).ms + 0.6} from="“SUSPENDED”" to="NO SUCH THING" y={300} />);
  add(<Cake key="cake" t={t} at={T.bday2 - 0.4} out={T.scary - 0.2} />);
  // W17
  add(<Chips key="sc" t={t} at={T.scary} items={["A SCARY WORD", "A GOVERNMENT-SOUNDING ROBOT"]} out={W(17).me - 0.3} y={880} />);
  // g18
  add(<Chain key="ch" t={t} steps={[["ROBOT", W(17).me], ["YOU PRESS 1", T.once], ["“OFFICER” + BADGE #", T.badge - 0.6], ["MOVE YOUR MONEY", T.move]]} out={W(18).ms + 0.3} />);
  // W18
  add(<Chips key="np" t={t} at={T.nopress} items={["I DON'T PRESS ANYTHING", "I DON'T CALL BACK"]} out={W(18).me - 0.3} y={880} />);
  // g19 · #4
  add(<Tally key="ts" t={t} at={T.never1 - 0.6} out={T.four - 0.6} lab="TIMES MY NUMBER WAS SUSPENDED" to={0} x={1400} y={330} />);
  add(<CallNo key="n4" t={t} at={T.four} out={T.twice + 1.2} n={4} title="THE BANK'S FRAUD DEPT." />);
  add(<Stamp key="tw" t={t} at={T.twice + 0.2} text="WRITE IT DOWN TWICE" x={960} y={220} out={T.fraud - 0.2} size={84} col="#f6e27a" />);
  add(<CallCard key="cc4" t={t} at={T.fraud} out={W(19).ms + 0.3} kind="bank" who="“YOUR BANK”" line="This is the fraud department. We've noticed a suspicious charge." y={330} />);
  // W19
  add(<Stamp key="dd" t={t} at={T.deadly} text="DEADLY" x={1460} y={280} out={W(19).me - 0.3} rot={8} size={110} />);
  // g20
  add(<Spoof key="sp" t={t} a={W(19).me - 0.2} peel={T.faking} out={T.helpful - 0.2} />);
  add(<Stamp key="hp" t={t} at={T.helpful} text="“WE'RE ON YOUR SIDE”" x={960} y={540} out={W(20).ms + 0.2} size={90} col="#6fe39a" />);
  // W20
  add(<Tag key="chg" t={t} at={T.charge} x={1500} y={760} dx={0} dy={-80} text="A BIG CHARGE · ANOTHER STATE" col={COL.amber} out={W(20).me - 0.3} size={44} />);
  // g21
  add(<Bubble key="nm" t={t} at={T.notme} text={"“That's not me!”"} x={960} y={420} out={T.block - 0.3} />);
  add(<CodeKey key="ck" t={t} a={T.block - 0.1} key_={T.key} out={W(21).ms + 0.3} />);
  // W21
  add(<Tag key="wv" t={t} at={T.worse} x={1500} y={760} dx={0} dy={-80} text="THE WORSE VERSION" col={COL.red} out={W(21).me - 0.3} size={50} />);
  // g22
  add(<SafeAcct key="sa" t={t} a={W(21).me - 0.2} flip={T.theirs} out={T.theirs + 0.9} />);
  add(<Tag key="eng" t={t} at={T.eng} x={960} y={600} dx={330} dy={-220} text="RETIRED ENGINEER" sub="SHARP AS A TACK" col={COL.ink} out={W(22).ms + 0.2} />);
  // W22
  add(<Hours4 key="h4" t={t} a={T.hours - 0.2} out={W(22).me - 0.2} />);
  // g23
  add(<Stamp key="calm" t={t} at={T.proud + 0.2} text="“SO CALM.”" x={960} y={260} out={T.callback - 0.3} size={110} col={COL.ink} />);
  add(<Reply key="r2" t={t} at={T.callback} out={T.turn - 0.3} text="I'll call you back." x={960} y={600} />);
  add(<Tag key="bk" t={t} at={T.turn + 0.5} x={960} y={560} dx={330} dy={-200} text="THE NUMBER ON THE BACK" col="#f6e27a" out={W(23).ms + 0.2} />);
  // W23
  add(<Tag key="sk" t={t} at={T.still} x={1500} y={760} dx={0} dy={-80} text="THEY'LL STILL KNOW" col="#6fe39a" out={W(23).me - 0.3} size={50} />);
  // g24
  add(<Tag key="dp" t={t} at={W(23).me} x={960} y={560} dx={300} dy={-200} text="A DIFFERENT PHONE" col={COL.amber} out={T.stay - 0.4} />);
  { const c = scr(PT.jack); add(<Tag key="lo" t={t} at={T.stay + 0.6} x={c.x} y={c.y} dx={-380} dy={-220} text="THE LINE STAYS OPEN" sub="THEY'RE STILL THERE" col={COL.red} out={T.ruleB - 0.3} />); }
  add(<RuleCard key="rc" t={t} at={T.ruleB} out={W(24).ms + 0.3} title="A REAL BANK WILL NEVER…" rows={["ask you to read back a code", "ask you to move your money"]} times={[T.readcode, T.moveit]} />);
  // W24 · #5
  add(<Stamp key="nv" t={t} at={T.never2} text="NEVER." x={1460} y={300} out={T.never2 + 1.0} size={120} />);
  add(<CallNo key="n5" t={t} at={T.never2 + 1.0} out={W(24).me - 0.2} n={5} title="THE IRS" />);
  // g25
  add(<CallCard key="cc5" t={t} at={T.irs} out={W(25).ms + 0.3} kind="angry" who="“IRS”" line="You owe back taxes. There's a warrant out in your name." y={320} />);
  add(<ScareWords key="sw5" t={t} a={T.words + 0.4} out={W(25).ms + 0.2} words={["FEDERAL", "IMMEDIATELY", "WARRANT", "TODAY"]} />);
  // W25 · la carta en papel
  { const o = e(t, T.letter, T.letter + 0.3) * (1 - e(t, W(25).me - 0.4, W(25).me)); add(<Card3D key="mail" id={HAVE.has("mailbox") ? "img_mailbox" : "img_write"} x={1260} y={230} w={560} h={420} ry={-14} rz={3} o={o} label="REAL PAPER · REAL ENVELOPE" />); }
  // g26
  add(<Stamp key="thr" t={t} at={W(25).me} text="THEY DON'T CALL TO THREATEN" x={960} y={260} out={T.giveaway - 0.3} size={76} />);
  add(<BigNum key="gv" t={t} at={T.giveaway + 0.3} text="THE BIGGEST GIVEAWAY" sub="HOW THEY WANT TO BE PAID" x={960} y={520} size={110} col="#f6e27a" edge="#5a4a10" out={W(26).ms + 0.2} />);
  // W26
  add(<Chips key="sw6" t={t} at={T.strange} items={["A STRANGE WAY TO PAY"]} out={W(26).me - 0.3} y={880} />);
  // g27
  add(<PayWall key="pw" t={t} times={[W(26).me - 0.2, W(26).me + 0.1, T.cashc, T.machine]} none={T.nogov + 1.2} out={T.midsent - 0.3} />);
  add(<Stamp key="ms" t={t} at={T.midsent + 0.3} text="HANG UP MID-SENTENCE" x={960} y={240} out={W(27).ms + 0.2} size={84} />);
  // W27 · #6
  add(<Tag key="gb" t={t} at={T.goodbye} x={1500} y={760} dx={0} dy={-80} text="NO GOODBYE NEEDED" col={COL.amber} out={T.six - 0.2} size={48} />);
  add(<CallNo key="n6" t={t} at={T.six} out={W(27).me - 0.2} n={6} title="THE WARRANT" />);
  // g28
  add(<Tag key="pm" t={t} at={T.pretend + 1.0} x={960} y={560} dx={300} dy={-220} text="THEY PRETEND TO BE ME" col={COL.red} out={T.sgt - 0.3} />);
  add(<CallCard key="cc6" t={t} at={T.sgt} out={W(28).ms + 0.3} kind="badge" who="“SGT. ________”" line="You missed jury duty. There's a warrant for your arrest." y={330} />);
  // W28
  add(<Tag key="rn" t={t} at={T.realname} x={1500} y={760} dx={0} dy={-80} text="A REAL OFFICER'S NAME · FOUND ONLINE" col={COL.amber} out={W(28).me - 0.3} size={40} />);
  // g29
  add(<Stamp key="pt" t={t} at={W(28).me} text="“PAY TODAY. IT'S CLEARED.”" x={960} y={480} out={T.job - 0.3} size={86} col="#ffd37a" />);
  add(<BigNum key="31" t={t} at={T.job + 0.4} text="31 YEARS" sub="HOW IT REALLY WORKS" x={560} y={520} size={150} col="#ffd37a" edge="#4a3000" out={W(29).me - 0.3} />);
  add(<NeverList key="nl" t={t} title="REAL POLICE:" rows={[["We don't call ahead", T.ahead], ["We don't take payment by phone", T.payment], ["No judge takes a gift card", T.judge]]} out={W(29).me - 0.3} x={1380} />);
  // g30
  add(<Tally key="ar" t={t} at={W(29).me - 0.1} out={T.knock - 0.4} lab="ARRESTS · 31 YEARS" to={1100} x={560} y={500} col="#ffd37a" />);
  add(<Tally key="cf" t={t} at={T.first} out={T.knock - 0.4} lab="CALLED FIRST TO ASK FOR MONEY" to={0} x={1360} y={500} col={COL.red} />);
  add(<Stamp key="kn" t={t} at={T.knock + 0.2} text="THEY KNOCK." x={1400} y={300} out={W(30).ms + 0.2} size={120} />);
  // W30
  add(<Bubble key="bn" t={t} at={T.badgeQ} text={"“Name and badge number. I'll call the station.”"} x={1300} y={280} out={W(30).me - 0.2} />);
  // g31 · #7
  add(<Stamp key="ev" t={t} at={T.every - 0.1} text="CLICK. EVERY TIME." x={960} y={260} out={T.seven - 0.2} size={90} col={COL.amber} />);
  add(<CallNo key="n7" t={t} at={T.seven} out={T.elec + 1.8} n={7} title="THE POWER COMPANY" />);
  add(<CallCard key="cc7" t={t} at={T.elec + 2.0} out={W(31).ms + 0.3} kind="utility" who="“ELECTRIC CO.”" line="Your account is past due. Power shut off in 45 minutes." y={300} />);
  add(<Countdown key="cd" t={t} at={T.min45} out={W(31).me - 0.3} x={1500} y={760} />);
  // W31
  add(<Tag key="pn" t={t} at={T.clock + 2} x={420} y={760} dx={0} dy={-80} text="JUST ENOUGH TIME TO PANIC" col={COL.red} out={W(31).me - 0.3} size={44} />);
  // g32
  add(<ColdTemp key="ct" t={t} at={W(31).me} out={T.notices - 0.3} />);
  add(<Notices key="nt2" t={t} a={T.notices} out={W(32).ms + 0.3} />);
  // W32
  add(<Tag key="yb" t={t} at={T.bill} x={1500} y={760} dx={0} dy={-80} text="THE NUMBER ON YOUR BILL" col="#6fe39a" out={W(32).me - 0.3} size={46} />);
  // g33 · #8
  add(<Tag key="dr" t={t} at={W(32).me} x={960} y={560} dx={300} dy={-200} text="YOUR REAL BILL" sub="NOT THEIR NUMBER" col="#6fe39a" out={T.eight - 0.4} />);
  add(<CallNo key="n8" t={t} at={T.eight} out={T.tech - 0.2} n={8} title="COMPUTER SUPPORT" />);
  add(<CallCard key="cc8" t={t} at={T.tech} out={W(33).ms + 0.3} kind="tech" who="“TECH SUPPORT”" line="Your computer has been sending us error messages." y={320} />);
  // W33
  add(<Stamp key="nb" t={t} at={T.nobody} text="NOBODY'S WATCHING IT" x={1440} y={280} out={W(33).me - 0.2} size={80} col={COL.amber} />);
  // g34
  add(<Popup key="pop" t={t} at={T.warning} out={W(34).ms + 0.3} />);
  // W34
  add(<Tag key="li" t={t} at={T.letin} x={1500} y={760} dx={0} dy={-80} text="LET THEM IN = THEY SEE EVERYTHING" col={COL.red} out={W(34).me - 0.3} size={40} />);
  // g35
  add(<Remote key="rm" t={t} a={W(34).me - 0.2} times={[T.bankE, T.email + 0.3, T.pics]} fee={T.fix + 0.6} out={T.noone - 0.3} />);
  add(<Reply key="r3" t={t} at={T.noone} out={T.freezes - 0.3} text="Nobody gets in unless I called first." x={960} y={560} />);
  add(<Stamp key="oo" t={t} at={T.freezes + 1.2} text="OFF. ON. THAT'S IT." x={960} y={250} out={W(35).ms + 0.3} size={96} col="#6fe39a" />);
  // W35 · #9
  add(<CallNo key="n9" t={t} at={T.nine} out={W(35).me - 0.2} n={9} title="YOU WON" />);
  // g36
  add(<CallCard key="cc9" t={t} at={T.won} out={T.won + 2.4} kind="win" who="PRIZE DEPT." line="Congratulations, you've won!" y={300} />);
  add(<Prizes key="pz" t={t} times={[T.sweep, T.lottery, T.car2, T.check]} out={T.catch_ - 0.3} />);
  add(<Stamp key="cat" t={t} at={T.catch_ + 0.2} text="THE CATCH" x={960} y={540} out={W(36).ms + 0.2} size={130} />);
  // W36
  add(<Chips key="fees" t={t} at={T.taxes} items={["TAXES", "PROCESSING FEE", "SHIPPING"]} out={W(36).me - 0.2} y={880} />);
  // g37
  add(<PayToWin key="ptw" t={t} a={W(36).me - 0.2} eq={T.paywin} out={T.ugly - 0.2} />);
  add(<PayList key="pl" t={t} a={T.ugly + 0.3} out={W(37).ms + 0.3} />);
  // W37
  add(<Bubble key="tf" t={t} at={T.takefee} text={"“Take the fee out of my winnings.”"} x={1300} y={280} out={W(37).me - 0.2} />);
  // g38 · #10
  add(<Stamp key="nd" t={t} at={T.neverdo} text="THEY NEVER DO." x={960} y={260} out={T.order - 0.3} size={100} col={COL.amber} />);
  add(<CallNo key="n10" t={t} at={T.ten + 0.3} out={T.order + 1.2} n={10} title="THE ORDER YOU DIDN'T PLACE" />);
  add(<CallCard key="cc10" t={t} at={T.order + 1.2} out={W(38).ms + 0.3} kind="robot" who="AUTOMATED" line="Your account has been charged $849.99 for a new phone." y={320} />);
  // W38
  add(<PressOne key="p1b" t={t} at={T.press1b} out={W(38).me - 0.2} x={1560} y={600} />);
  // g39
  add(<Refund key="rf" t={t} a={W(38).me - 0.2} oops={T.oops + 0.6} reveal={1e9} out={W(39).ms + 0.3} />);
  // W39
  add(<Tag key="sd" t={t} at={T.diffback} x={1500} y={760} dx={0} dy={-80} text="“SEND THE DIFFERENCE BACK”" col={COL.red} out={W(39).me - 0.3} size={44} />);
  // g40
  add(<Refund key="rf2" t={t} a={W(39).me - 0.2} oops={W(39).me - 1.4} reveal={T.nocharge + 0.4} out={T.login - 0.3} />);
  add(<Reply key="r4" t={t} at={T.login} out={W(40).ms + 0.3} text="I log in myself." x={960} y={600} />);
  // W40 · #11
  add(<CallNo key="n11" t={t} at={T.eleven} out={W(40).me - 0.2} n={11} title="THE TINY QUESTION" />);
  // g41
  add(<CallCard key="cc11" t={t} at={W(40).me + 0.2} out={T.yes - 0.3} kind="lcd" who="UNKNOWN" line="Can you hear me?" y={330} />);
  add(<YesRec key="yr" t={t} a={T.yes} out={W(41).ms + 0.3} />);
  // W41
  add(<Stamp key="tst" t={t} at={T.test} text="IT'S A TEST" x={1440} y={280} out={W(41).me - 0.2} size={100} col={COL.amber} />);
  // g42
  add(<NumValue key="nv2" t={t} a={W(41).me - 0.2} lists={T.lists} out={T.noyes - 0.2} />);
  { const c = scr(PT.phone); add(<Tag key="ny" t={t} at={T.noyes + 0.3} x={c.x} y={c.y} dx={-380} dy={-200} text="NO “YES” TO STRANGERS" col="#6fe39a" out={W(42).ms + 0.2} />); }
  // W42
  add(<Bubble key="wc" t={t} at={T.who} text={"“Who's calling?”"} x={1360} y={300} out={W(42).me - 0.2} />);
  // g43 · #12
  add(<Tag key="lr" t={t} at={W(42).me} x={960} y={560} dx={300} dy={-200} text="LET IT RING" sub="THEY'LL LEAVE A MESSAGE" col="#6fe39a" out={T.twelve - 0.6} />);
  add(<CallNo key="n12" t={t} at={T.twelve} out={T.rings1 - 0.3} n={12} title="ONE RING" />);
  { const c = scr(PT.phone); add(<Tag key="r1x" t={t} at={T.rings1} x={c.x} y={c.y} dx={-300} dy={-200} text="RING… (STOP)" col="#ffd27a" out={W(43).ms + 0.2} size={56} />); }
  // W43 · la llamada perdida
  { const o = e(t, T.country - 0.6, T.country - 0.3) * (1 - e(t, W(43).me - 0.4, W(43).me)); add(<Card3D key="mis" id={HAVE.has("missed") ? "img_missed" : "img_listen"} x={1260} y={240} w={560} h={420} ry={-14} rz={3} o={o} label="+232 · ANOTHER COUNTRY" />); }
  // g44
  add(<OneRing key="or" t={t} a={W(43).me - 0.2} call={T.callb + 0.4} out={W(44).ms + 0.3} />);
  // g45
  add(<Bait key="bt" t={t} at={T.bait - 0.1} out={T.firsth - 0.4} />);
  add(<FirstHour key="fh" t={t} at={T.firsth - 0.2} out={W(45).ms + 0.3} />);
  // W45
  add(<Chips key="mss" t={t} at={T.med2 + 0.5} items={["MEDICARE #", "SOCIAL SECURITY #", "→ CALL THEM YOURSELF"]} out={W(45).me - 0.2} y={880} />);
  // g46
  add(<FixList key="fl" t={t} rows={[["MEDICARE / SSN #", "Call them · watch statements", W(45).me + 0.1], ["READ A CODE / BANK INFO", "Call the back of your card", T.readc]]} out={T.tonight - 0.3} />);
  add(<Stamp key="tn" t={t} at={T.tonight + 0.3} text="TONIGHT. NOT TOMORROW." x={960} y={250} out={W(46).ms + 0.2} size={90} />);
  // W46
  add(<Tag key="lk" t={t} at={T.lock} x={1500} y={760} dx={0} dy={-80} text="“IT'S FRAUD. LOCK IT.”" col="#6fe39a" out={W(46).me - 0.3} size={48} />);
  // g47
  add(<GiftBack key="gb2" t={t} at={W(46).me - 0.2} out={W(47).ms + 0.3} />);
  // W47
  add(<Tag key="fs" t={t} at={T.fast} x={1500} y={760} dx={0} dy={-80} text="FAST = MAYBE NOT SPENT YET" col="#6fe39a" out={W(47).me - 0.3} size={44} />);
  // g48
  add(<Tag key="up" t={t} at={W(47).me + 0.2} x={960} y={560} dx={300} dy={-200} text="UNPLUG IT FIRST" col={COL.amber} out={T.device - 0.3} />);
  add(<Chain key="pw2" t={t} steps={[["A DIFFERENT DEVICE", T.device], ["BANK PASSWORD", T.bankf], ["THEN EMAIL", T.emailT]]} out={T.ftc - 0.3} col="#6fe39a" />);
  add(<ReportSite key="ftc" t={t} at={T.ftc} url="reportfraud.ftc.gov" lab="FEDERAL TRADE COMMISSION · REPORT ONLINE" out={W(48).ms + 0.3} />);
  // W48
  add(<Chips key="ic3" t={t} at={T.ic3} items={["FBI · IC3", "LOCAL POLICE REPORT"]} out={W(48).me - 0.2} y={880} />);
  // g49
  add(<Tag key="rp" t={t} at={W(48).me + 0.2} x={960} y={560} dx={300} dy={-200} text="A REPORT WITH YOUR NAME" col={COL.ink} out={T.pile - 0.4} />);
  add(<CaseBoard key="cb" t={t} a={T.pile} lady={T.lady + 0.6} out={W(49).ms + 0.3} />);
  // W49
  add(<Stamp key="t12" t={t} at={T.that12} text="THAT'S 12." x={1440} y={280} out={W(49).me - 0.2} size={110} col="#6fe39a" />);
  // g50
  { const c = scr(PT.pad); add(<Tag key="3t" t={t} at={W(49).me + 0.2} x={c.x} y={c.y} dx={330} dy={-180} text="ALL 12 →" sub="3 THINGS" col="#f6e27a" out={T.trust - 0.3} />); }
  add(<Triad key="tri" t={t} times={[T.trust, T.act2, T.strange2]} all={W(50).ms - 1.2} out={W(50).ms + 0.3} />);
  // W50
  add(<Stamp key="100" t={t} at={T.hundred} text="SCAM · 100 / 100" x={1440} y={280} out={W(50).me - 0.2} size={90} />);
  // g51
  add(<BigNum key="j3" t={t} at={T.not12} text="NOT 12 THINGS. JUST 3." x={960} y={500} size={120} col="#f6e27a" edge="#5a4a10" out={T.tape - 0.3} />);
  add(<Tag key="tp" t={t} at={T.tape + 0.4} x={960} y={560} dx={300} dy={-200} text="#1 · TAPE IT BY THE PHONE" col="#f6e27a" out={W(51).ms + 0.2} />);
  // W51
  add(<Bubble key="icb" t={t} at={T.write} text={"“I'll call you back.”"} x={1360} y={300} out={W(51).me - 0.2} />);
  // g52
  add(<Reply key="r5" t={t} at={W(51).me + 0.1} out={T.two2 - 0.2} text="I'll call you back." x={700} y={560} rot={-5} />);
  { const c = scr(PT.phone); add(<Tag key="4w" t={t} at={T.fourw + 0.4} x={c.x} y={c.y} dx={-200} dy={-260} text="4 WORDS BEAT EVERY CALL" col="#6fe39a" out={T.two2 - 0.2} />); }
  add(<Stamp key="cw2" t={t} at={T.two2 + 0.3} text="#2 · THE CODE WORD" x={960} y={260} out={T.church - 0.3} size={90} col="#6fe39a" />);
  add(<Tag key="tl" t={t} at={T.three4} x={960} y={700} dx={0} dy={80} text="#3 · TELL SOMEBODY" col="#f6e27a" out={T.church - 0.3} size={54} />);
  add(<Chips key="nb2" t={t} at={T.church + 0.2} items={["CHURCH FRIEND", "NEIGHBOR", "SISTER"]} out={W(52).ms + 0.2} y={880} />);
  // W52
  add(<Stamp key="sil" t={t} at={T.silence + 0.4} text="THEY COUNT ON SILENCE" x={1440} y={280} out={W(52).me - 0.2} size={76} />);
  // g53
  add(<Tag key="em" t={t} at={T.embar - 0.4} x={960} y={560} dx={300} dy={-200} text="DON'T BE EMBARRASSED" col={COL.ink} out={T.sent - 0.3} />);
  add(<Chain key="snt" t={t} steps={[["SENT MONEY?", T.sent], ["1 · YOUR BANK", T.sent + 1.2], ["2 · THE POLICE", T.sent + 2.2]]} out={W(53).ms + 0.3} col={COL.amber} />);
  // W53
  add(<Tag key="fb2" t={t} at={T.faster} x={1500} y={760} dx={0} dy={-80} text="FASTER = BETTER CHANCE" col="#6fe39a" out={W(53).me - 0.3} size={48} />);
  // g54 · CTA: suscribirse + campanita → la pregunta para comentar
  add(<SubBell key="cta" t={t} a={W(53).me - 0.1} press={T.subscribe + 0.25} bell={T.bell + 0.1} out={T.hearYou - 0.2} />);
  add(<Comments key="cm" t={t} a={T.hearYou} out={W(54).ms + 0.3} />);
  // W54
  add(<Tag key="sh2" t={t} at={T.shame} x={1500} y={760} dx={0} dy={-80} text="NO SHAME IN IT" col="#6fe39a" out={W(54).me - 0.3} size={50} />);
  // g55
  add(<BigNum key="ol" t={t} at={W(54).me} text="ONE LESS PERSON" sub="EVERY STORY YOU SHARE" x={960} y={500} size={120} col="#6fe39a" edge="#0f4a26" out={T.nextw - 0.3} />);
  add(<Stamp key="nw2" t={t} at={T.nextw + 0.2} text="NEXT WEEK" x={960} y={220} out={W(55).ms + 0.2} size={100} col="#f6e27a" />);
  add(<Chips key="dor" t={t} at={T.water} items={["THE WATER COMPANY", "THE LOST DOG", "THE SURVEY"]} out={W(55).ms + 0.2} y={880} />);
  // W55
  add(<Tag key="dm" t={t} at={T.dontmiss} x={1500} y={760} dx={0} dy={-80} text="DON'T OPEN THE DOOR" col={COL.amber} out={W(55).me - 0.3} size={50} />);
  // g56 · cierre
  add(<Tag key="31b" t={t} at={W(55).me + 0.2} x={960} y={560} dx={300} dy={-220} text="31 YEARS · AFTER THE MONEY WAS GONE" col={COL.ink} out={T.rather - 0.2} size={44} />);
  add(<Stamp key="bf" t={t} at={T.rather + 0.3} text="CATCH THEM BEFORE." x={960} y={260} out={T.nexttime - 0.3} size={96} col="#6fe39a" />);
  add(<Reply key="r6" t={t} at={T.say} out={END} text="I'll call you back." x={600} y={560} rot={-4} />);
  add(<Flash key="fl" t={t} at={T.stop} peak={0.3} w={0.18} />);
  add(<FadeOut key="fo" t={t} a={END - 1.4} />);
  return L;
};

// pequeñas piezas locales
const DrawXLite: React.FC<{ t: number; at: number; out: number; text: string }> = ({ t, at: a, out, text }) => {
  const o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const c = e(t, a + 0.4, a + 0.7);
  return (
    <div style={{ position: "absolute", left: 960, top: 260, transform: "translate(-50%,-50%)", opacity: o }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: COL.ink, textShadow: extrude(9, "rgba(0,0,0,.6)"), position: "relative" }}>{text}
        <span style={{ position: "absolute", left: -20, right: -20, top: "50%", height: 16, background: COL.red, transformOrigin: "0 50%", transform: `scaleX(${c}) rotate(-4deg)` }} /></div>
    </div>
  );
};
const FadeOut: React.FC<{ t: number; a: number }> = ({ t, a }) => { const o = e(t, a, a + 1.2); return o > 0.005 ? <AbsoluteFill style={{ background: "#000", opacity: o }} /> : null; };

// ---------- motor de la toma única: pieza actual + portal desde la anterior ----------
const PORTAL_IN = 0.45, PORTAL_OUT = 0.1;
export const Rest: React.FC<{ base?: number }> = ({ base = 0 }) => {
  const t = useCurrentFrame() / 30 + base;
  let i = PARTS.length - 1;
  while (i > 0 && PARTS[i].a > t + PORTAL_IN) i--;
  const cur = PARTS[i], prev = PARTS[i - 1];
  const r = ei(t, cur.a - PORTAL_IN, cur.a + PORTAL_OUT);
  const L: React.ReactNode[] = [];
  if (r < 1 && prev) {
    L.push(<AbsoluteFill key={"p" + (i - 1)}>{prev.bg(t)}</AbsoluteFill>);
    const p = prev.pt ? prev.pt(t) : C;
    L.push(<Portal key={"q" + i} x={p.x} y={p.y} r={r}>{cur.bg(t)}</Portal>);
  } else L.push(<AbsoluteFill key={"p" + i}>{cur.bg(t)}</AbsoluteFill>);
  // el primer tramo entra por un portal desde el centro del saldo en $0 (el minuto 1 sigue debajo)
  return <AbsoluteFill>{i === 0 ? <Portal x={960} y={540} r={r}>{cur.bg(t)}</Portal> : L}{ov(t)}</AbsoluteFill>;
};
export const REST_START = MIN1_END - PORTAL_IN;
