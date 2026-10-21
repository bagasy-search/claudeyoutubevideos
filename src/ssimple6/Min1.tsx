// ssimple6 · MINUTO 1 + LA GUÍA (0-129,5 s). Un solo hilo visual, sin cortes secos: el avatar (Sachiko en su cuarto de tatami)
// y UN mundo 3D (la casa de su madre en Osaka). Se pasa de uno a otro SIEMPRE por la TINTA que se esparce (InkPortal).
// 0 avatar "el teléfono suena un domingo a la noche" → el teléfono negro tiembla en su mesita → 3 semanas sin llamar
// → la mano levanta el tubo (LTX) → la frase escrita a pincel "Oh, so you finally remembered you have a mother." → la línea se queda muda
// → avatar → "you missed him" → la foto de 1976 sale del portarretratos → el silencio del otro lado (sepia) → avatar
// → el escritorio: la frase se TACHA con sumi → amanece: 101 → avatar + 9 ema → los 9 ema cuelgan del kamoi; el 9 da vuelta: 2 WORDS
// → avatar + el cartero → "no es consejo de clínica" → el té (LTX) → los almohadones de la gente que volvía → avatar
// → CTA1: los 5 libritos de The Osaka Way caen en abanico; The 101 Day avanza y se abre en la pág. 45 (real) → avatar con la página
// → subrayados de pincel → el ema 3 → la descripción → avatar "I'm Sachiko" → el jardín: la línea de su vida 1915 · 1948 · 1970 · 79.
// Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PT, screenOf } from "./osaka3d";
import { A, MIN1_END, ST } from "./tl";
import { BigNum, BRUSH, COL, Flash, Hanko, SvgDefs, Tag, e, ei, s } from "./lib";
import { AVP, Avatar, BrushStrike, Chip, Clip, Desc, EmaRow, Flatline, InkLine, InkPortal, LifeLine, LowerThird, PageCard, PhotoFly, RingWaves, Weeks, World } from "./ink";

export const MIN1_FRAMES = s(MIN1_END);
type Pt = { x: number; y: number };
// transición por tinta: `from` abajo, `to` se esparce desde (x,y) entre a y b
const Ink: React.FC<{ t: number; a: number; b: number; at: Pt; from: React.ReactNode; to: React.ReactNode; seed?: number }> = ({ t, a, b, at, from, to, seed = 1 }) => {
  const r = ei(t, a, b);
  return <>{r < 1 && <AbsoluteFill>{from}</AbsoluteFill>}<InkPortal x={at.x} y={at.y} r={r} seed={seed}>{to}</InkPortal></>;
};

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const st = ST(t);
  const ph = screenOf(t, PT.phone);

  // ===== 0-3,96 · avatar "The telephone rings on a Sunday night. It is your son." → la tinta abre la casa de noche =====
  if (t < 3.97) {
    L.push(<Ink key="i0" t={t} a={3.45} b={3.96} at={AVP.shoji} seed={1} from={<Avatar t={t} />} to={<World t={Math.max(3.45, t)} />} />);
    L.push(<Chip key="sun" t={t} at={0.35} out={3.3} text="SUNDAY · NIGHT" col={COL.indigo} />);
  }
  // ===== 3,96-16,8 · el teléfono suena; 3 semanas; la mano levanta el tubo; la frase a pincel; la línea muda =====
  if (t >= 3.96 && t < 16.8) {
    const handA = A.hear - 0.1, handB = A.oh - 0.05;
    if (t < handA + 0.5 || t >= handB) L.push(<World key="w1" t={t} />);
    L.push(<RingWaves key="rw" t={t} x={ph.x} y={ph.y} on={st.ring * (1 - e(t, A.hear + 1.0, A.hear + 1.3)) * e(t, 3.96, 4.2)} />);
    L.push(<Tag key="son" t={t} at={4.25} x={ph.x} y={ph.y - 20} dx={260} dy={-200} text="YOUR SON" sub="SUNDAY · 7 PM" col={COL.indigo} out={5.6} size={52} />);
    L.push(<Weeks key="wk" t={t} at={5.6} out={A.hear - 0.3} />);
    // la mano levanta el tubo (LTX) — entra por la tinta desde el teléfono, sale por la tinta desde el tubo
    if (t >= handA && t < handB + 0.5) {
      const r = ei(t, handA, handA + 0.5), r2 = ei(t, handB, handB + 0.5);
      const shot = <Clip k="m1_phone" img="img_phone" t={t} a={handA} />;
      if (r2 <= 0) L.push(<InkPortal key="ph" x={ph.x} y={ph.y} r={r} seed={2}>{shot}</InkPortal>);
      else L.push(<React.Fragment key="ph2"><AbsoluteFill>{shot}</AbsoluteFill><InkPortal x={960} y={540} r={r2} seed={3}><World t={t} /></InkPortal></React.Fragment>);
    }
    L.push(<InkLine key="il" t={t} a={A.oh} b={A.quiet - 0.05} out={A.quiet + 0.25} y={850} size={74} hot={["finally", "mother"]} />);
    L.push(<Flatline key="fl" t={t} at={A.quiet + 0.3} out={16.6} y={420} w={1000} label="silence." />);
  }
  // ===== 16,8-21,75 · avatar "You did not mean it." =====
  if (t >= 16.4 && t < 21.75) {
    L.push(<Ink key="i1" t={t} a={16.4} b={16.8} at={{ x: 960, y: 420 }} seed={4} from={<World t={t} />} to={<Avatar t={t} />} />);
    L.push(<Hanko key="dm" t={t} at={20.45} text="SHE DIDN'T MEAN IT" x={1400} y={300} out={21.5} size={54} rot={-5} />);
  }
  // ===== 21,75-33,58 · la casa de noche → la foto de 1976 → el silencio del otro lado (sepia) =====
  if (t >= 21.3 && t < 33.58) {
    const sep = e(t, A.y1976, A.y1976 + 0.8);
    const w = <World t={t} sepia={sep * 0.85} />;
    if (t < 21.75) L.push(<Ink key="i2" t={t} a={21.3} b={21.75} at={AVP.hands} seed={5} from={<Avatar t={t} />} to={w} />);
    else L.push(<React.Fragment key="w2">{w}</React.Fragment>);
    L.push(<InkLine key="il2" t={t} a={A.missed} b={A.m1976 - 0.05} out={A.m1976 + 0.1} y={880} size={66} hot={["missed"]} />);
    const pf = screenOf(t, PT.photo);
    L.push(<Tag key="mom" t={t} at={A.m1976 + 1.0} x={pf.x} y={pf.y} dx={220} dy={-150} text="MY MOTHER" sub="TO MY BROTHER" out={A.y1976 - 0.2} size={50} />);
    L.push(<PhotoFly key="pf" t={t} at={A.y1976 - 0.15} out={A.silence + 0.2} id="img_mother1976" from={screenOf(A.y1976, PT.photo)} to={{ x: 1180, y: 500 }} label="Osaka · 1976" />);
    L.push(<BigNum key="76" t={t} at={A.y1976} text="1976" font={BRUSH} size={200} x={470} y={300} out={A.silence} />);
    L.push(<Flatline key="fl2" t={t} at={A.silence + 0.5} out={33.3} x={ph.x + 380} y={ph.y - 260} w={560} label="…" />);
  }
  // ===== 33,58-37,72 · avatar "at the little telephone table in our house in Osaka" =====
  if (t >= 33.2 && t < 37.72) {
    L.push(<Ink key="i3" t={t} a={33.2} b={33.58} at={ph} seed={6} from={<World t={t} sepia={0.85} />} to={<Avatar t={t} />} />);
    L.push(<Chip key="tt" t={t} at={36.3} out={37.6} text="THE LITTLE TELEPHONE TABLE" />);
  }
  // ===== 37,72-49,47 · el escritorio: la frase escrita y TACHADA → amanece: 101 → después de los 60 =====
  if (t >= 37.35 && t < 49.47) {
    if (t < 37.72) L.push(<Ink key="i4" t={t} a={37.35} b={37.72} at={AVP.window} seed={7} from={<Avatar t={t} />} to={<World t={t} />} />);
    else L.push(<World key="w4" t={t} />);
    L.push(<Chip key="os" t={t} at={A.osaka} out={A.never + 1.4} text="OSAKA · 1976" col={COL.red} />);
    const pp = screenOf(t, PT.paper);
    if (t < A.lived + 0.3) {
      L.push(<InkLine key="il3" t={t} a={11.4} b={14.9} out={A.lived} x={pp.x} y={pp.y - 40} size={44} maxW={820} rot={-3} />);
      // la línea se muestra entera (es la misma frase, escrita en su papel)
    }
    L.push(<BrushStrike key="bs" t={t} at={A.neverDid + 0.1} out={A.lived} x={pp.x} y={pp.y - 40} w={760} rot={-6} th={38} />);
    L.push(<Hanko key="na" t={t} at={A.neverDid + 0.6} text="NEVER AGAIN" x={pp.x + 330} y={pp.y + 90} out={A.lived + 0.2} size={56} />);
    L.push(<BigNum key="101" t={t} at={A.lived + 0.6} text="101" font={BRUSH} size={330} y={430} out={A.sixty + 2.4} col={COL.ink} edge="#a8957a" />);
    L.push(<Hanko key="h101" t={t} at={A.lived + 1.2} text="101 YEARS" x={1290} y={600} out={A.sixty + 2.4} size={70} />);
    L.push(<Chip key="60" t={t} at={A.sixty + 0.2} out={49.2} text="AFTER 60" col={COL.gold} />);
    L.push(<InkLine key="nw" t={t} a={46.9} b={49.3} out={49.2} y={860} size={58} hot={["not"]} />);
  }
  // ===== 49,47-55,31 · avatar "She stopped saying nine things" + los 9 ema =====
  if (t >= 49.1 && t < 55.31) {
    L.push(<Ink key="i5" t={t} a={49.1} b={49.47} at={{ x: 960, y: 430 }} seed={8} from={<World t={t} />} to={<Avatar t={t} />} />);
    L.push(<EmaRow key="er" t={t} at={50.3} out={55.1} />);
    L.push(<BigNum key="9s" t={t} at={52.0} text="9 SENTENCES" size={92} x={1450} y={170} out={55.0} col={COL.cream} edge="#3a2f24" />);
  }
  // ===== 55,31-66,56 · los 9 ema cuelgan del kamoi; el 9 da vuelta: 2 WORDS =====
  if (t >= 54.9 && t < 66.56) {
    if (t < 55.31) L.push(<Ink key="i6" t={t} a={54.9} b={55.31} at={{ x: 960, y: 930 }} seed={9} from={<Avatar t={t} />} to={<World t={t} />} />);
    else L.push(<World key="w6" t={t} />);
    L.push(<Chip key="wt" t={t} at={55.5} out={57.3} text="EVERY DAY · WITHOUT THINKING" />);
    L.push(<BigNum key="a9" t={t} at={A.allNine} text="all nine" font={BRUSH} size={130} y={180} out={A.two - 0.4} col={COL.ink} edge="#a8957a" />);
    const e9 = screenOf(t, PT.ema(8));
    L.push(<Tag key="n9" t={t} at={A.two - 1.4} x={e9.x} y={e9.y} dx={-260} dy={230} text="NUMBER 9" sub="TWO WORDS" col={COL.red} out={66.3} size={54} />);
    L.push(<InkLine key="tm" t={t} a={64.82} b={66.5} out={66.4} y={880} size={62} hot={["morning"]} />);
  }
  // ===== 66,56-71,53 · avatar + el cartero; "I cannot promise you 101" =====
  if (t >= 66.15 && t < 71.53) {
    const e9 = screenOf(66.15, PT.ema(8));
    L.push(<Ink key="i7" t={t} a={66.15} b={66.56} at={e9} seed={10} from={<World t={t} />} to={<Avatar t={t} />} />);
    L.push(<PhotoFly key="mb" t={t} at={66.7} out={70.0} id="img_mailbox" from={{ x: 1900, y: 300 }} to={{ x: 1420, y: 470 }} w={560} label="to the mailman" rot={-3} />);
    L.push(<BigNum key="101q" t={t} at={A.promise + 0.4} text="101?" font={BRUSH} size={200} x={1460} y={360} out={71.45} col={COL.cream} edge="#3a2f24" />);
  }
  // ===== 71,53-82,29 · la mesa del té: no es consejo de clínica → el té (LTX) → la gente que volvía a su mesa =====
  if (t >= 71.15 && t < 82.29) {
    const teaA = A.talked - 1.25, teaB = A.coming - 0.9;
    const pot = screenOf(t, PT.pot);
    if (t < 71.53) L.push(<Ink key="i8" t={t} a={71.15} b={71.53} at={{ x: 1420, y: 470 }} seed={11} from={<Avatar t={t} />} to={<World t={t} />} />);
    else if (t < teaA + 0.5 || t >= teaB) L.push(<World key="w8" t={t} />);
    L.push(<Hanko key="nb" t={t} at={A.nobody} text="NOBODY CAN" x={1420} y={260} out={A.clinic - 0.1} size={64} rot={4} />);
    L.push(<Hanko key="cl" t={t} at={A.clinic + 0.5} text="NOT CLINIC ADVICE" x={960} y={820} out={teaA + 0.4} size={62} />);
    if (t >= teaA && t < teaB + 0.5) {
      const r = ei(t, teaA, teaA + 0.5), r2 = ei(t, teaB, teaB + 0.5);
      const shot = <Clip k="m1_tea" img="img_tea" t={t} a={teaA} />;
      if (r2 <= 0) L.push(<InkPortal key="tea" x={pot.x} y={pot.y} r={r} seed={12}>{shot}</InkPortal>);
      else L.push(<React.Fragment key="tea2"><AbsoluteFill>{shot}</AbsoluteFill><InkPortal x={1100} y={700} r={r2} seed={13}><World t={t} /></InkPortal></React.Fragment>);
      L.push(<InkLine key="ow" t={t} a={A.talked - 1.2} b={A.coming - 0.05} out={teaB} y={880} size={60} hot={["talked"]} />);
    }
    L.push(<Tag key="ht" t={t} at={A.coming + 0.2} x={screenOf(t, PT.cups).x} y={screenOf(t, PT.cups).y} dx={240} dy={-170} text="HER TABLE" sub="FULL UNTIL THE LAST YEAR" out={82.2} size={50} />);
  }
  // ===== 82,29-85,83 · avatar "until the very last year" =====
  if (t >= 81.9 && t < 85.83) {
    L.push(<Ink key="i9" t={t} a={81.9} b={82.29} at={screenOf(81.9, PT.cups)} seed={14} from={<World t={t} />} to={<Avatar t={t} />} />);
    L.push(<Chip key="ly" t={t} at={A.lastYear} out={85.6} text="UNTIL THE VERY LAST YEAR" col={COL.gold} />);
  }
  // ===== 85,83-99,29 · CTA1: escritorio → los 5 libritos de The Osaka Way → The 101 Day → pág. 45 =====
  if (t >= 85.45 && t < 99.29) {
    if (t < 85.83) L.push(<Ink key="i10" t={t} a={85.45} b={85.83} at={AVP.cup} seed={15} from={<Avatar t={t} />} to={<World t={t} />} />);
    else L.push(<World key="w10" t={t} />);
    const pp = screenOf(t, PT.paper);
    L.push(<InkLine key="sd" t={t} a={A.wrote} b={A.wrote + 2.4} out={A.setOf - 0.4} x={pp.x} y={pp.y - 60} size={50} maxW={900} rot={-3} hot={["down"]} />);
    L.push(<BigNum key="ow" t={t} at={A.osakaWay} text="The Osaka Way" font={BRUSH} size={130} y={170} out={A.day101 - 0.1} col={COL.cream} edge="#3a2f24" sub="5 LITTLE BOOKS" />);
    L.push(<Chip key="d1" t={t} at={A.day101 + 0.2} out={A.p45} text="BOOK 4 · THE 101 DAY" col={COL.indigo} />);
    L.push(<Hanko key="p45" t={t} at={A.p45 + 0.9} text="PAGE 45" x={1560} y={230} out={99.2} size={80} rot={6} />);
    L.push(<Flash key="fo" t={t} at={A.p45 + 1.0} col="#fff4dc" peak={0.25} w={0.35} />);
  }
  // ===== 99,29-103,73 · avatar + la página real flotando: "Saying No Kindly" =====
  if (t >= 98.9 && t < 103.73) {
    L.push(<Ink key="i11" t={t} a={98.9} b={99.29} at={screenOf(98.9, PT.book)} seed={16} from={<World t={t} />} to={<Avatar t={t} />} />);
    L.push(<PageCard key="pc" t={t} at={99.45} out={103.5} id="day_p61" hiAt={A.noKindly} />);
  }
  // ===== 103,73-115,84 · la página de cerca: subrayados → el ema 3 → la descripción =====
  if (t >= 103.35 && t < 115.84) {
    if (t < 103.73) L.push(<Ink key="i12" t={t} a={103.35} b={103.73} at={{ x: 1460, y: 540 }} seed={17} from={<Avatar t={t} />} to={<World t={t} />} />);
    else L.push(<World key="w12" t={t} />);
    L.push(<Chip key="ex" t={t} at={104.0} out={A.matters - 0.2} text="HER EXACT WORDS" col={COL.red} />);
    const e3 = screenOf(t, PT.ema(2));
    L.push(<Tag key="n3" t={t} at={A.n3 + 0.1} x={e3.x} y={e3.y} dx={250} dy={-140} text="NUMBER 3" sub="YOU'LL SEE WHY" col={COL.red} out={A.link + 0.4} size={56} />);
    L.push(<Desc key="ds" t={t} at={A.link + 0.6} out={115.6} x={1140} y={600} scale={0.78} />);
  }
  // ===== 115,84-119,29 · avatar "You know me. I'm Sachiko." =====
  if (t >= 115.45 && t < 119.29) {
    L.push(<Ink key="i13" t={t} a={115.45} b={115.84} at={{ x: 1140, y: 600 }} seed={18} from={<World t={t} />} to={<Avatar t={t} />} />);
    L.push(<LowerThird key="lt" t={t} at={115.95} out={119.1} name="Sachiko" l2="OSAKA 1948  →  AMERICA 1970" l2at={A.born} />);
  }
  // ===== 119,29-129,5 · el jardín: la línea de su vida =====
  if (t >= 118.9) {
    if (t < 119.29) L.push(<Ink key="i14" t={t} a={118.9} b={119.29} at={{ x: 360, y: 900 }} seed={19} from={<Avatar t={t} />} to={<World t={t} />} />);
    else if (t < MIN1_END - 0.4) L.push(<World key="w14" t={t} />);
    else L.push(<Ink key="i15" t={t} a={MIN1_END - 0.4} b={MIN1_END} at={screenOf(MIN1_END - 0.4, PT.maple)} seed={20} from={<World t={t} />} to={<Avatar t={t} />} />);
    L.push(<Chip key="4o5" t={t} at={A.fourth} out={A.america - 0.2} text="4TH OF 5 CHILDREN" col={COL.gold} />);
    L.push(<LifeLine key="ll" t={t} at={119.5} out={MIN1_END - 0.45} marks={[
      { at: 119.6, u: 0.38, top: "1948", bot: "born in Osaka" },
      { at: A.y1970, u: 0.62, top: "1970", bot: "to America" },
      { at: A.s79 + 0.3, u: 0.95, top: "79", bot: "today" },
      { at: A.y1915 + 0.3, u: 0.05, top: "1915", bot: "my mother", red: true },
    ]} />);
  }

  return <AbsoluteFill style={{ background: "#0b0a09" }}><SvgDefs />{L}</AbsoluteFill>;
};
