// ssimple7 · EL VIDEO ENTERO (0 → 1804,9 s). Un solo hilo: Sachiko en su cuarto ⇄ la casa de su madre en Osaka, SIEMPRE por la tinta.
// La base se arma sola desde las ventanas del avatar (avwin.json): antes de cada ventana la tinta se esparce hacia Sachiko; al final
// de la ventana la tinta abre otra vez la casa (o una foto). Las fotos se anclan a la FRASE (shot()) y se corren solas fuera del avatar.
// Encima, las piezas de cada número (fx7 + rest_fx), todas con at("frase"). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PT, screenOf } from "./osaka3d";
import { A, NUM_AT, RECAP } from "./tl";
import { BRUSH, COL, Hanko, SvgDefs, Tag, BigNum, at, atEnd, ei } from "./lib";
import { AVP, Avatar, Chip, Clip, Desc, InkLine, InkPortal, LifeLine, LowerThird, PageCard, World, WIN } from "./ink";
import { BagOff, CheckList, CommentBox, Counter, Dialogue, Enso, Halfway, Hourglass, NineList, Order, Said, ShouldRain, Stones } from "./rest_fx";
import { AgeGap, DayRing, Drafts, Drip, Envelope, HeadPaper, LetGo, MirrorCheck, NetWeek, NewsClock, NotePage, OneCorner, PhotoGrid, Record, Rooms, Stage, Thursday, WhatIf, WorryList } from "./fx7";

export const END = 1804.9;
type Pt = { x: number; y: number };
const AW = WIN;

// ---------- las fotos: ancladas a la frase; si caen dentro del avatar se corren al final de la ventana y nunca la pisan ----------
type Shot = { a: number; b: number; img: string; k: string; from?: Pt };
const inWin = (x: number) => AW.find((w) => x >= w.ms - 0.4 && x < w.me);
const nextWin = (x: number) => AW.find((w) => w.ms - 0.4 > x);
const RAW: [string, number, string, number, Pt?][] = [
  // [frase, después de, foto, segundos, punto de tinta]
  ["you are lying on your back", 0, "n_3am", 3.2], ["the bill you forgot", 0, "n_bill", 2.6], ["the noise the car made", 0, "s_nervous", 2.8],
  ["my mother had that list too", 0, "s_mother_photo", 3.2, { x: 700, y: 500 }], ["she did something about it", 0, "n_lacquer", 2.6], ["one worry at a time", 0, "n_nb_hands", 3.0],
  ["until i was 75", 0, "s_75_alone", 3.4], ["pour yourself some tea", 0, "s_pour_tea", 3.0, { x: 960, y: 700 }],
  ["a woman at the public bath", 0, "n_bath", 3.4], ["she sat up on her futon", 0, "s_bed_write", 3.2], ["then she closed the notebook", 0, "s_close_nb", 3.0],
  ["the first week", 300, "s_list11", 3.0], ["i laugh a little", 0, "s_laugh_nb", 3.0],
  ["the laundry hung", 0, "n_laundry", 3.0], ["the summer festival came", 0, "n_bon", 4.0, { x: 960, y: 420 }], ["bright scarf to the market", 0, "s_scarf", 3.0],
  ["a little beer at lunch", 0, "n_beer", 3.0], ["am i doing this for me", 0, "s_ask_self", 3.2], ["in a yellow hat", 0, "s_yellowhat", 3.4], ["three mothers asked me", 0, "s_3mothers", 3.2],
  ["she swept the entrance", 0, "n_genkan", 3.4], ["the dust on top", 0, "n_dust", 2.8], ["saturday morning", 0, "s_saturday", 3.2],
  ["my one clean corner is", 0, "s_corner", 3.4], ["i just put the kettle on", 0, "s_kettle", 3.4],
  ["dyed her hair black", 0, "n_dye", 3.2], ["the man who sold tofu", 0, "n_tofu", 3.2], ["my face is clean", 600, "s_mirror3", 3.0], ["then she walked", 630, "s_mirror_go", 2.6],
  ["take her picture every birthday", 0, "s_bday_photo", 3.2], ["a little noodle shop", 0, "n_shopfront", 3.6], ["her own little money book", 0, "s_kakeibo", 3.4],
  ["every friday she went", 0, "s_noodles", 3.4], ["my son is 50", 0, "s_phone_son", 3.0], ["made my own envelope", 0, "s_envelope", 3.0],
  ["the news every hour", 0, "n_radio", 3.2], ["humming while she cut", 0, "n_cutveg", 3.4], ["a coin in the jar", 0, "n_coinbox", 3.0], ["brought her a sweet potato", 0, "n_potato", 3.0],
  ["i can fix thursday", 0, "s_neighbor_soup", 3.0], ["then i turn it off", 0, "s_tv_off", 2.4], ["call a", 970, "s_call_friend", 2.6],
  ["a tansu from her own mother", 0, "n_tansu", 3.4], ["she took out everything", 0, "n_drawer_out", 3.0], ["granddaughter's wedding", 0, "n_wedding", 3.2],
  ["on the front she wrote", 0, "n_envtop", 3.0], ["sat down on the floor", 0, "n_brother", 3.2], ["my own one drawer", 0, "s_drawer", 3.0], ["my mother's tea bowls", 0, "s_teabowls", 3.4],
  ["was five o'clock", 0, "n_5pm", 3.0], ["school crossing", 0, "n_crossing", 3.2], ["wrote one letter by hand", 0, "n_letter", 3.0],
  ["tuesday choir", 0, "s_choir", 2.2], ["coffee with the ladies", 0, "s_library", 2.2], ["sunday phone calls", 0, "s_dawn_call", 2.6],
  ["he fixed my lamp", 0, "s_daniel_lamp", 2.4], ["to make rice balls", 0, "s_riceballs", 2.2], ["grandma sachiko", 0, "s_wave_daniel", 2.4],
  ["like old photographs", 0, "s_letters", 3.2], ["nine drafts", 0, "n_drafts", 3.0], ["she stood at the gate", 1340, "n_gate", 3.4], ["two old trees", 0, "n_twosisters", 3.0],
  ["at the train station", 1400, "n_platform", 3.4], ["and i wrote my lesson", 0, "s_lesson_line", 3.0], ["every time i hang up", 0, "s_hangup", 2.2], ["every time somebody leaves", 0, "s_goodbye", 2.6],
  ["she opened the window", 0, "s_window", 3.2], ["buy fish", 1500, "n_card3", 3.0], ["the market walk", 0, "n_market", 3.4], ["fifteen minutes at", 1540, "n_tea4", 3.0],
  ["a walk around the block", 0, "n_walk", 3.2], ["her sister her neighbor", 0, "s_call_friend", 0], ["the priest at the temple", 0, "n_cranes", 2.8],
  ["for me it was number nine", 0, "s_crumple", 3.0], ["with my one finger", 0, "s_onefinger", 2.8], ["write your list", 1780, "s_list3", 3.0],
];
const SHOTS: Shot[] = (() => {
  const out: Shot[] = [];
  for (const [ph, af, img, d, from] of RAW) {
    if (d <= 0) continue;
    let a = at(ph, af) - 0.15;
    const w = inWin(a); if (w) a = w.me;
    const nw = nextWin(a), prev = out[out.length - 1];
    if (prev && a < prev.b + 0.5) a = prev.b + 0.5;
    const b = Math.min(a + d, nw ? nw.ms - 0.4 : END);
    if (b - a < 1.4) continue;   // no entra: queda el mundo
    out.push({ a, b, img: "img/" + img, k: "x_" + img, from });
  }
  return out;
})();
const near = (x: number, ys: number[]) => ys.some((y) => Math.abs(x - y) < 0.45);
const AV_END = AW.map((w) => w.me), AV_START = AW.map((w) => w.ms - 0.4);
const INK_AV = [AVP.shoji, AVP.cup, AVP.frame, AVP.window, AVP.hands];

const WorldOrShot: React.FC<{ t: number }> = ({ t }) => {
  const sh = SHOTS.find((x) => t >= x.a && t < x.b + 0.5);
  if (!sh) return <World t={t} />;
  const clip = <Clip k={sh.k} img={sh.img} t={t} a={sh.a} />;
  const soft0 = !near(sh.a, AV_END), soft1 = !near(sh.b, AV_START);
  if (t >= sh.b) return soft1 ? <><AbsoluteFill>{clip}</AbsoluteFill><InkPortal x={960} y={560} r={ei(t, sh.b, sh.b + 0.5)} seed={Math.round(sh.a) + 7}><World t={t} /></InkPortal></> : <AbsoluteFill>{clip}</AbsoluteFill>;
  if (soft0 && t < sh.a + 0.5) { const f = sh.from ?? { x: 960, y: 540 }; return <><World t={t} /><InkPortal x={f.x} y={f.y} r={ei(t, sh.a, sh.a + 0.5)} seed={Math.round(sh.a)}>{clip}</InkPortal></>; }
  return <AbsoluteFill>{clip}</AbsoluteFill>;
};

const Base: React.FC<{ t: number }> = ({ t }) => {
  const i = AW.findIndex((w) => t >= w.ms - 0.4 && t < w.me);
  if (i < 0) return <WorldOrShot t={t} />;
  const w = AW[i];
  if (t < w.ms && w.ms > 0.5) { const p = INK_AV[i % INK_AV.length]; return <><WorldOrShot t={t} /><InkPortal x={p.x} y={p.y} r={ei(t, w.ms - 0.4, w.ms)} seed={i + 30}><Avatar t={t} /></InkPortal></>; }
  if (t >= w.me - 0.4) { const p = [{ x: 960, y: 900 }, { x: 1500, y: 500 }, { x: 420, y: 520 }][i % 3]; return <><Avatar t={t} /><InkPortal x={p.x} y={p.y} r={ei(t, w.me - 0.4, w.me)} seed={i + 60}><WorldOrShot t={t} /></InkPortal></>; }
  return <Avatar t={t} />;
};

export const Rest: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const O = (k: string, n: React.ReactNode) => L.push(<React.Fragment key={k}>{n}</React.Fragment>);

  // ================= EL GANCHO: las 3 de la mañana · la lista que vuelve a empezar =================
  O("3am", <Chip t={t} at={0.3} out={3.4} text="3:00 A.M." col={COL.indigo} />);
  O("wl", <WorryList t={t} out={at("like an old record") + 0.2} loop={at("it just starts again")} items={[
    { at: at("the bill you forgot"), text: "the bill I forgot to mail" }, { at: at("the thing your daughter said"), text: "what my daughter said" },
    { at: at("the noise the car made"), text: "the noise the car made" }, { at: at("what the neighbor meant"), text: "the neighbor's little smile" }]} />);
  O("rec", <Record t={t} at={at("like an old record") - 0.2} out={at("my mother had that list") - 0.1} />);
  O("cat", <InkLine t={t} a={at("like a cat that would not")} b={atEnd("would not get off")} out={at("and then after she turned") - 0.1} y={880} size={60} hot={["cat"]} />);
  O("60", <Counter t={t} at={at("after she turned 60")} out={at("she did something about it") - 0.1} to={60} dur={0.7} label="HER LITTLE WOODEN HOUSE · OSAKA" x={1440} y={430} size={240} />);
  O("put", <Hanko t={t} at={at("and she put it down")} text="PUT IT DOWN" x={1440} y={330} out={A.lived - 0.2} size={70} />);
  O("101", <Counter t={t} at={A.lived} out={at("in her last 40 years") + 1.4} to={101} dur={1.1} label="SHE LIVED TO" x={1440} y={430} size={280} />);
  O("calm", <InkLine t={t} a={at("she was the calmest woman")} b={atEnd("on the street", 55)} out={A.nine - 0.1} y={870} size={70} hot={["calmest"]} />);
  O("nine", <Tag t={t} at={A.nine + 0.6} x={960} y={300} dx={0} dy={0} text="9 THINGS SHE STOPPED WORRYING ABOUT" col={COL.red} out={A.nine + 4.2} size={54} />);
  O("nopill", <CheckList t={t} out={at("and the last one") - 0.2} title="NOT PILLS · NOT MONEY" x={1460} y={540} col={COL.indigo} items={[
    { at: at("little habits"), text: "little habits" }, { at: at("a notebook", 62), text: "a notebook" }, { at: at("a teapot", 62), text: "a teapot" }, { at: at("a few sentences she said") , text: "a few sentences" }]} />);
  O("n9h", <Hanko t={t} at={at("number nine is the one almost")} text="NUMBER 9 · ALMOST NOBODY LETS GO" x={1300} y={300} out={at("i held on to it") + 1.5} size={46} />);
  O("cl", <Hanko t={t} at={at("this is not advice from a clinic")} text="NOT CLINIC ADVICE" x={1420} y={300} out={at("how she spent her days") + 0.5} size={56} rot={-3} />);
  O("sleep", <InkLine t={t} a={at("learned to sleep at night")} b={atEnd("than the rest of us")} out={A.setOf - 0.6} y={880} size={58} hot={["sleep", "lighter"]} />);

  // ================= CTA 1: The Osaka Way → The 101 Day, pág. 38 (la libreta de la almohada) =================
  O("set", <BigNum t={t} at={at("the osaka way", 100)} text="The Osaka Way" font={BRUSH} size={120} y={170} out={A.day101 + 1.0} col={COL.cream} edge="#3a2f24" sub="5 LITTLE BOOKS" />);
  O("p38c", <Chip t={t} at={A.p38} out={A.link1 + 4} text="PAGE 38 · GOING TO SLEEP WITH WORRIES" col={COL.red} />);
  O("p38", <PageCard t={t} at={A.twoLines - 0.4} out={A.link1 + 0.2} id="day_p38" x={1480} y={560} h={860} hiAt={A.twoLines + 0.4} />);
  O("n1s", <Hanko t={t} at={at("because it is number one")} text="THAT'S NUMBER 1" x={480} y={300} out={A.link1 + 0.2} size={58} />);
  O("ds1", <Desc t={t} at={A.link1} out={A.link1 + 4.6} x={1140} y={600} scale={0.78} />);

  // ================= quién soy · la vida de la madre =================
  O("me", <LowerThird t={t} at={at("i'm sachiko", 120)} out={at("i am 79 now") + 2.0} name="Sachiko" l2="OSAKA 1948 · AMERICA 1970 · 79 TODAY" l2at={at("i was born in osaka")} />);
  O("life", <LifeLine t={t} at={at("my mother was born in 1915") - 0.3} out={at("she had every reason") + 1.0} marks={[
    { at: at("my mother was born in 1915"), u: 0.05, top: "1915", bot: "born" }, { at: at("through the war"), u: 0.3, top: "1940s", bot: "the war" },
    { at: at("the hungry years"), u: 0.42, top: "after", bot: "hungry years" }, { at: at("a widow at 61"), u: 0.72, top: "61", bot: "a widow", red: true }]} />);
  O("late", <Hanko t={t} at={at("ten minutes late from school")} text="10 MINUTES LATE" x={1440} y={330} out={at("if it rained", 155) - 0.1} size={60} />);
  O("wash", <Chip t={t} at={at("if it rained", 155)} out={at("but something changed") - 0.1} text="RAIN ON WASHING DAY" col={COL.indigo} />);
  O("umb", <ShouldRain t={t} at={at("worry is like carrying") - 0.2} umb={at("an umbrella on")} out={at("it only makes your arm") + 1.4} />);
  O("arm", <InkLine t={t} a={at("it does not stop the rain")} b={atEnd("your arm tired")} out={at("so come and sit") - 0.1} y={880} size={60} hot={["arm"]} />);
  O("sit", <Chip t={t} at={at("so come and sit")} out={A.n1 - 0.3} text="SIT WITH ME AT THE LOW TABLE" col={COL.gold} />);

  // los números: el ema de cada uno se agranda en la pared
  NUM_AT.forEach((a, i) => O("nt" + i, <Tag t={t} at={a + 0.15} x={screenOf(t, PT.ema(i)).x} y={screenOf(t, PT.ema(i)).y} dx={i % 2 ? -240 : 240} dy={200} text={`NUMBER ${i + 1}`} col={COL.red} out={a + 3.0} size={58} />));

  // ================= #1 el mañana, de noche =================
  O("s1", <Said t={t} n={1} at={A.n1 + 0.4} out={A.n1 + 4.6} text="Tomorrow, at night" />);
  O("prom", <Chip t={t} at={at("this is the one i promised")} out={at("my mother did too") + 1} text="THE ONE I PROMISED YOU" col={COL.gold} />);
  O("34", <Hanko t={t} at={at("at 3 or 4")} text="3 O'CLOCK · 4 O'CLOCK" x={1420} y={330} out={at("the rent the roof") - 0.2} size={56} />);
  O("wl2", <WorryList t={t} out={at("radio she could not switch off") + 1.6} x={1400} items={[
    { at: at("the rent the roof"), text: "the rent" }, { at: at("the roof", 200), text: "the roof" }, { at: at("a letter she had not"), text: "a letter, not answered" }]} />);
  O("62", <Counter t={t} at={at("when she was 62")} out={at("a woman at the public bath") - 0.1} to={62} dur={0.7} label="ONE WINTER" x={1440} y={430} size={240} />);
  O("40y", <Counter t={t} at={at("for almost 40 years")} out={at("here is exactly what") + 1.2} to={40} dur={0.9} label="YEARS · EVERY NIGHT" x={1440} y={430} size={240} />);
  O("box", <Tag t={t} at={at("in a lacquer box") + 0.2} x={screenOf(t, [-1.12, 0.2, 0.12]).x} y={screenOf(t, [-1.12, 0.2, 0.12]).y} dx={260} dy={-200} text="NOTEBOOK · PENCIL · LACQUER BOX" col={COL.red} out={A.night1 - 0.2} size={44} />);
  O("10m", <Hanko t={t} at={A.night1} text="10 MINUTES BEFORE THE LIGHT" x={1400} y={300} out={A.night1 + 3.5} size={50} />);
  O("np", <NotePage t={t} out={atEnd("turned off the light") + 0.3} close={at("then she closed the notebook")} rows={[
    { at: at("each one on its own short line") , w: "the landlord", sAt: at("call the landlord"), step: "call him" },
    { at: at("even the silly ones"), w: "a letter", sAt: at("buy a stamp"), step: "buy a stamp" },
    { at: at("next to each worry"), w: "my son", sAt: at("ask my son on sunday"), step: "ask on Sunday" },
    { at: at("if there was no step"), w: "the roof", sAt: at("not tonight", 250), step: "not tonight" }]} />);
  O("nt", <Hanko t={t} at={at("not tonight", 250) + 0.1} text="NOT TONIGHT" x={500} y={300} out={at("then she closed the notebook")} size={70} rot={-4} />);
  O("hp", <HeadPaper t={t} at={at("a worry that stays in your head")} at2={at("on paper it has edges")} out={at("and if she woke") - 0.1} />);
  O("chk", <Dialogue t={t} out={at("and she lay back down") + 1.6} lines={[{ at: at("is it already written"), text: "Is it already written?" }, { at: at("yes", 281), text: "Yes.", me: true }, { at: at("then it can wait until morning"), text: "Then it can wait until morning.", me: true }]} />);
  O("mst1", <Hanko t={t} at={at("here is the mistake almost")} text="THE MISTAKE" x={1440} y={300} out={at("my mother was very strict") - 0.1} size={70} />);
  O("rr", <InkLine t={t} a={at("we read them again")} b={atEnd("making them bigger")} out={at("my mother was very strict")} y={880} size={58} hot={["bigger"]} />);
  O("wcs", <CheckList t={t} out={at("i started doing this at 75") - 0.1} title="HER RULE" x={1460} y={520} col={COL.red} items={[{ at: at("write close switch off"), text: "write" }, { at: at("close", 300), text: "close" }, { at: at("switch off", 300), text: "switch off" }]} />);
  O("drw", <InkLine t={t} a={at("the notebook is a drawer")} b={atEnd("not a television")} out={at("i started doing this at 75") + 0.2} y={880} size={66} hot={["drawer"]} />);
  O("113", <Counter t={t} at={at("my list was 11")} out={at("now it is usually 3") + 2.4} to={11} dur={0.6} label="LINES · THE FIRST WEEK" x={1460} y={430} size={220} />);
  O("3l", <Hanko t={t} at={at("now it is usually 3")} text="NOW: 3" x={1440} y={760} out={at("i laugh a little") - 0.1} size={80} />);

  // ================= #2 lo que diga la calle =================
  O("s2", <Said t={t} n={2} at={A.n2 + 0.4} out={A.n2 + 4.6} text="What will the neighbors say?" />);
  O("st2", <Dialogue t={t} out={at("that was me by the way") + 1.6} lines={[{ at: at("who came home late"), text: "Who came home late?" }, { at: at("whose daughter"), text: "Whose daughter married a foreigner?" }, { at: at("that was me by the way"), text: "(that was me)", me: true }]} />);
  O("rt", <CheckList t={t} out={at("then when she was 64") - 0.1} title="FOR THE STREET" x={1460} y={520} col={COL.indigo} items={[{ at: at("the right apron"), text: "the right apron" }, { at: at("the right greeting"), text: "the right greeting" }, { at: at("the laundry hung"), text: "laundry in the right order" }, { at: at("the good towels in front"), text: "good towels in front" }]} />);
  O("64", <Counter t={t} at={at("when she was 64")} out={at("the summer festival came") + 0.6} to={64} dur={0.6} label="THE SUMMER FESTIVAL" x={1440} y={430} size={220} />);
  O("bon", <Chip t={t} at={at("the one with the drums")} out={at("my aunt") - 0.1} text="DRUMS · LANTERNS · AN OLD BLUE ROBE · A RED SCARF" col={COL.red} />);
  O("bad", <Hanko t={t} at={at("badly with her arms")} text="BADLY." x={1460} y={330} out={at("my aunt") + 0.6} size={90} rot={-6} />);
  O("look", <Dialogue t={t} out={at("that became") - 0.1} lines={[{ at: at("everybody is looking at you"), text: "Everybody is looking at you." }, { at: at("good let them look"), text: "Good. Let them look.", me: true }]} />);
  O("thu", <Thursday t={t} at={at("they will forget by thursday") - 0.1} out={at("her sentence") + 2.2} />);
  O("thu2", <Hanko t={t} at={at("they will forget by thursday", 390)} text="…BY THURSDAY" x={1440} y={330} out={at("and ordered a little beer") - 0.1} size={64} />);
  O("thu3", <Hanko t={t} at={at("they will forget by thursday", 399)} text="…BY THURSDAY" x={500} y={330} out={at("and here is what she did") - 0.1} size={64} rot={3} />);
  O("q2", <InkLine t={t} a={at("am i doing this for me")} b={atEnd("or for the street")} out={at("if the answer was") + 2.5} y={880} size={66} hot={["me", "street"]} />);
  O("busy", <InkLine t={t} a={at("they are busy worrying")} b={atEnd("what we think of them")} out={at("my mother used to say", 420) + 0.6} y={880} size={58} />);
  O("stage", <Stage t={t} at={at("standing on a stage") - 0.3} seats={at("nobody is sitting in the seats")} out={at("i am 79", 430) - 0.1} />);
  O("ma", <Dialogue t={t} out={at("they did not actually") + 1.4} lines={[{ at: at("mom really"), text: "Mom, really?" }, { at: at("and i said they will forget"), text: "They will forget by Thursday.", me: true }, { at: at("they did not actually"), text: "(they did not, actually)", me: true }]} />);
  O("stay7", <Chip t={t} at={at("but i want you to stay")} out={at("ten years later", 460) + 1.5} text="STAY FOR NUMBER 7 · YOUR CLOSETS AND DRAWERS" col={COL.gold} />);
  O("thk", <Hanko t={t} at={at("he was the one who thanked her")} text="10 YEARS LATER · HE THANKED HER" x={1380} y={330} out={A.n3 - 0.1} size={48} />);

  // ================= #3 la casa perfecta → un rincón limpio =================
  O("s3", <Said t={t} n={3} at={A.n3 + 0.4} out={A.n3 + 4.6} text="A perfect house" />);
  O("6t", <Chip t={t} at={at("six tatami")} out={at("and for most of her life", 470) - 0.1} text="6 TATAMI · A TINY KITCHEN · A PAPER DOOR" col={COL.indigo} />);
  O("sw", <CheckList t={t} out={at("if a guest was coming") + 2.6} title="EVERY MORNING" x={1460} y={520} col={COL.indigo} items={[{ at: at("she swept the floor"), text: "swept the floor" }, { at: at("wiped the tatami"), text: "wiped the tatami" }, { at: at("wiped the wooden posts"), text: "wiped the posts" }, { at: at("polished the low table"), text: "polished the table" }]} />);
  O("2d", <Hanko t={t} at={at("she cleaned for two days")} text="2 DAYS FOR 1 GUEST" x={500} y={330} out={at("after 60", 495) - 0.1} size={52} />);
  O("mus", <InkLine t={t} a={at("i am tired of living in a museum")} b={atEnd("the only guard")} out={at("so she made a new rule") - 0.1} y={880} size={62} hot={["museum", "guard"]} />);
  O("oc", <OneCorner t={t} at={at("so she made a new rule")} lit={at("one clean corner")} out={at("every morning", 505) + 2.0} />);
  O("cc", <CheckList t={t} out={at("nobody ever looked") - 0.1} title="ONE CLEAN CORNER" x={1460} y={520} col={COL.red} items={[{ at: at("a clean step"), text: "a clean step" }, { at: at("a cushion and a cup waiting"), text: "a cushion" }, { at: at("a cup waiting"), text: "a cup, waiting" }]} />);
  O("1h", <Hanko t={t} at={at("for one hour with the radio on")} text="1 HOUR · SATURDAY · RADIO ON" x={1380} y={330} out={at("when the hour was over") + 1.6} size={50} />);
  O("stp", <Hanko t={t} at={at("she stopped even")} text="SHE STOPPED." x={1440} y={760} out={at("the mistake most of us make", 538) - 0.1} size={70} rot={-4} />);
  O("gst", <InkLine t={t} a={at("cleaning for guests who never come")} b={atEnd("the guests who do come")} out={at("my mother said people") - 0.1} y={880} size={56} hot={["never", "do"]} />);
  O("flr", <InkLine t={t} a={at("people do not remember your floor")} b={atEnd("happy to see them")} out={at("i live in a small apartment") + 0.4} y={880} size={62} hot={["floor", "happy"]} />);
  O("2h", <Hanko t={t} at={at("we talked for two hours")} text="2 HOURS. NOT ONE LOOK AT THE FLOOR" x={1340} y={330} out={A.n4 - 0.1} size={46} />);

  // ================= #4 el espejo =================
  O("s4", <Said t={t} n={4} at={A.n4 + 0.4} out={A.n4 + 4.6} text="Getting old in the mirror" />);
  O("45", <Counter t={t} at={at("from the time she was 45")} out={at("she hated the gray") + 1.6} to={45} dur={0.6} label="DYED BLACK · EVERY MONTH" x={1440} y={430} size={220} />);
  O("63", <Counter t={t} at={at("when she was 63")} out={at("nothing serious") + 1.6} to={63} dur={0.6} label="A BROKEN WRIST · THE ICE" x={1440} y={430} size={220} />);
  O("wh", <InkLine t={t} a={at("white at the roots")} b={atEnd("the way", 610)} out={at("and one morning the man") - 0.1} y={880} size={64} hot={["white"]} />);
  O("snow", <InkLine t={t} a={at("you look like a snow mountain")} b={atEnd("very handsome")} out={at("and she went home") + 1.0} y={880} size={60} hot={["snow", "handsome"]} />);
  O("nd", <Hanko t={t} at={at("she never dyed it again")} text="NEVER DYED AGAIN" x={1440} y={330} out={at("she changed what she did") + 1.0} size={58} />);
  O("mc", <MirrorCheck t={t} out={at("away", 640) + 0.6} items={[{ at: at("my face is clean"), text: "face, clean" }, { at: at("my hair is combed"), text: "hair, combed" }, { at: at("my eyes are awake"), text: "eyes, awake" }]} />);
  O("cj", <InkLine t={t} a={at("the mirror is for checking")} b={atEnd("not for judging")} out={at("and she started wearing") - 0.1} y={880} size={66} hot={["checking", "judging"]} />);
  O("cour", <InkLine t={t} a={at("when you are young color")} b={atEnd("color is courage")} out={at("the mistake most of us make", 655) - 0.1} y={880} size={58} hot={["courage"]} />);
  O("yng", <InkLine t={t} a={at("someday i will look at a photo")} b={atEnd("young i was")} out={at("so she let my nephew") + 0.6} y={880} size={56} hot={["young"]} />);
  O("pg", <PhotoGrid t={t} at={at("we have 38")} out={at("i stopped coloring") - 0.1} />);
  O("70", <Hanko t={t} at={at("i stopped coloring my hair at 70")} text="ME · NO DYE SINCE 70" x={1420} y={330} out={at("it takes 10 seconds") - 0.1} size={52} />);
  O("10s", <Counter t={t} at={at("it takes 10 seconds")} out={at("then i go and make my tea") + 1.4} to={10} dur={0.5} label="SECONDS" x={1460} y={430} size={240} />);
  O("hw", <Halfway t={t} at={at("we are almost halfway")} out={A.n5 - 0.5} done={4} />);
  O("cmt", <Chip t={t} at={at("because i read your comments")} out={A.n5 - 0.2} text="YOU ASKED · GROWN CHILDREN AND MONEY" col={COL.gold} />);

  // ================= #5 el dinero de los hijos → el sobre =================
  O("s5", <Said t={t} n={5} at={A.n5 + 0.4} out={A.n5 + 4.6} text="My children's money" />);
  O("q5", <Dialogue t={t} out={at("then when my mother was 66") - 0.1} lines={[{ at: at("how much did that cost"), text: "How much did that cost?" }, { at: at("you saving anything"), text: "Are you saving anything?" }, { at: at("why did you buy a car"), text: "Why did you buy a car?" }]} />);
  O("66", <Counter t={t} at={at("when my mother was 66")} out={at("a little noodle shop") - 0.1} to={66} dur={0.6} label="HE QUIT THE BANK" x={1440} y={430} size={220} />);
  O("sick", <Hanko t={t} at={at("my mother was sick with worry")} text="EVERY NIGHT: “A MISTAKE”" x={1380} y={330} out={at("and one night he said") - 0.1} size={50} />);
  O("fail", <InkLine t={t} a={at("every time you call i feel")} b={atEnd("eat my noodles")} out={at("she told me she sat with") + 0.6} y={880} size={52} hot={["failing", "noodles"]} />);
  O("r12", <Order t={t} out={at("she put it in an envelope") - 0.2} x={1400} y={520} items={[{ at: at("rule one"), n: "1", text: "say the worry once" }, { at: at("rule two"), n: "2", text: "decide the amount first" }]} />);
  O("aq", <InkLine t={t} a={at("i am afraid for you")} b={atEnd("now i will be quiet")} out={at("and she was", 780) + 1.2} y={880} size={54} hot={["love", "quiet"]} />);
  O("env", <Envelope t={t} at={at("she put it in an envelope")} seal={at("gave it once")} cut={at("a gift with no string")} out={at("and every friday") - 0.1} />);
  O("22", <Counter t={t} at={at("the noodle shop lasted")} out={at("the mistake most of us make", 812) - 0.1} to={22} dur={0.8} label="YEARS · THE NOODLE SHOP" x={1440} y={430} size={240} />);
  O("tw", <InkLine t={t} a={at("worrying about it twice")} b={atEnd("once for ourselves")} out={A.kakebo - 0.1} y={880} size={58} hot={["twice"]} />);
  // CTA 2: el Kakeibo, pág. 72
  O("kk", <Chip t={t} at={A.kakebo + 0.4} out={A.link2 + 3} text="MY MOTHER'S KAKEIBO · THE OSAKA WAY" col={COL.red} />);
  O("p72", <PageCard t={t} at={A.p72 + 1.0} out={A.link2 + 0.2} id="kak_p72" x={1480} y={560} h={860} hiAt={A.p72 + 3.0} />);
  O("p72c", <Hanko t={t} at={A.p72 + 0.1} text="PAGE 72" x={480} y={300} out={A.link2 + 0.2} size={70} />);
  O("ds2", <Desc t={t} at={A.link2} out={A.link2 + 4.0} x={1140} y={600} scale={0.78} />);
  O("xm", <Hanko t={t} at={at("last christmas")} text="ONCE · LAST CHRISTMAS" x={1420} y={330} out={at("made my own envelope") - 0.1} size={54} />);
  O("bag", <BagOff t={t} at={at("like putting down a heavy bag") - 0.3} out={A.n6 - 0.2} />);

  // ================= #6 el mundo entero → la radio una vez al día =================
  O("s6", <Said t={t} n={6} at={A.n6 + 0.4} out={A.n6 + 4.6} text="The whole world" />);
  O("rd", <Tag t={t} at={at("a big brown one") + 0.1} x={screenOf(t, [-2.47, 0.96, 0.92]).x} y={screenOf(t, [-2.47, 0.96, 0.92]).y} dx={-260} dy={-160} text="THE KITCHEN RADIO" sub="ON ALL DAY" col={COL.indigo} out={at("the news every hour") + 2} size={48} />);
  O("fix", <InkLine t={t} a={at("people she would never meet")} b={atEnd("could never fix")} out={at("then one morning when") - 0.1} y={880} size={56} hot={["never"]} />);
  O("3w", <Hanko t={t} at={at("for three weeks")} text="3 WEEKS · QUIET" x={1440} y={330} out={at("she said she noticed") + 0.4} size={60} />);
  O("hum", <InkLine t={t} a={at("she was humming")} b={atEnd("since she was a girl")} out={at("when the new radio came") - 0.1} y={880} size={56} hot={["humming"]} />);
  O("nc", <NewsClock t={t} at={at("the news one time a day")} out={at("then the radio went to music") + 0.4} />);
  O("sit6", <CheckList t={t} out={at("then the radio went to music") + 0.4} title="THE NEWS" x={480} y={560} col={COL.indigo} items={[{ at: at("sitting at the table with tea"), text: "sitting, with tea" }, { at: at("not standing at the stove"), text: "not at the stove" }, { at: at("not in bed"), text: "not in bed" }]} />);
  O("sm", <InkLine t={t} a={at("one small thing she could do")} b={atEnd("on her own street")} out={at("if she heard about a flood") - 0.1} y={880} size={58} hot={["small"]} />);
  O("fl", <Order t={t} out={at("she said i cannot fix") - 0.1} x={1420} y={520} items={[{ at: at("a flood somewhere"), n: "↓", text: "a coin at the temple" }, { at: at("lonely old people"), n: "↓", text: "a sweet potato for Mrs. Tanaka" }]} />);
  O("tk", <InkLine t={t} a={at("i cannot fix the world")} b={atEnd("for mrs tanaka")} out={at("mistake most of us make is keeping") - 0.1} y={880} size={60} hot={["thursday"]} />);
  O("drip", <Drip t={t} at={at("like a dripping faucet")} out={at("i have a television") + 0.4} />);
  O("tv", <CheckList t={t} out={at("so i do what my mother did") + 0.4} title="BAD NEWS, ALL DAY" x={1460} y={520} col={COL.red} items={[{ at: at("a television"), text: "a television" }, { at: at("a phone", 965), text: "a phone" }, { at: at("a tablet"), text: "a tablet" }]} />);
  O("6c", <NewsClock t={t} at={at("the news once at six")} out={at("then i turn it off")} hour={6} label="6:00 · SITTING DOWN" />);

  // ================= #7 sus cosas → un cajón por mes + el sobre de arriba =================
  O("s7", <Said t={t} n={7} at={A.n7 + 0.4} out={A.n7 + 4.6} text="What will happen to my things?" />);
  O("lau", <Chip t={t} at={at("the one my brother laughed at")} out={at("my mother had a big wooden chest") + 0.6} text="THE ONE MY BROTHER LAUGHED AT" col={COL.gold} />);
  O("30y", <Hanko t={t} at={at("not worn in 30 years")} text="KIMONOS · 30 YEARS UNWORN" x={1400} y={330} out={at("and she worried about it") - 0.1} size={50} />);
  O("qk", <Dialogue t={t} out={at("some nights it was on") - 0.1} lines={[{ at: at("who will get the kimono"), text: "Who will get the kimono?" }, { at: at("will they fight over it"), text: "Will they fight over it?" }, { at: at("will they just throw"), text: "Will they throw it all away?" }]} />);
  O("3t", <Hanko t={t} at={at("three times", 1005)} text="3 TIMES IN ONE NOTEBOOK" x={1420} y={330} out={at("when she was 70") - 0.1} size={52} />);
  O("70m", <Counter t={t} at={at("when she was 70")} out={at("every month on the first sunday") - 0.1} to={70} dur={0.6} label="STOP WORRYING · START GIVING" x={1440} y={430} size={220} />);
  O("fs", <Chip t={t} at={at("every month on the first sunday")} out={at("she took out everything") + 0.6} text="THE FIRST SUNDAY · ONE DRAWER" col={COL.red} />);
  O("3q", <CheckList t={t} out={at("and whatever she did not need") + 2.4} title="3 QUESTIONS" x={1460} y={520} col={COL.indigo} items={[{ at: at("do i use this"), text: "Do I use this?" }, { at: at("does it make me happy"), text: "Does it make me happy?" }, { at: at("who would love it right now"), text: "Who would love it right now?" }]} />);
  O("fc", <InkLine t={t} a={at("while she was still alive")} b={atEnd("see their faces")} out={at("she gave my sister") + 0.4} y={880} size={60} hot={["faces"]} />);
  O("fo", <InkLine t={t} a={at("for my children open after")} b={atEnd("open after")} out={at("inside", 1050) + 0.4} y={300} size={70} hot={["after"]} />);
  O("el", <CheckList t={t} out={at("she showed us the envelope") + 2.0} title="INSIDE" x={1460} y={520} col={COL.red} items={[{ at: at("what is where"), text: "What is where" }, { at: at("who gets the tansu"), text: "Who gets the tansu" }, { at: at("the name of the temple"), text: "The temple" }, { at: at("a short letter"), text: "A short letter" }]} />);
  O("ny", <Hanko t={t} at={at("every new year")} text="EVERY NEW YEAR" x={500} y={330} out={at("then she stopped thinking") + 1.0} size={60} />);
  O("hs", <InkLine t={t} a={at("you are giving away your house")} b={atEnd("drawer at a time")} out={at("ten years later", 1070) - 0.1} y={880} size={56} hot={["drawer"]} />);
  O("nf", <InkLine t={t} a={at("there was nothing to fight about")} b={atEnd("in her handwriting")} out={at("the mistake most of us make", 1085) - 0.1} y={880} size={56} hot={["nothing", "kindly"]} />);
  O("76", <Hanko t={t} at={at("at 76")} text="ME · ONE DRAWER A MONTH · 76" x={1380} y={330} out={at("i have given away") + 0.6} size={48} />);
  O("2l", <Chip t={t} at={at("now we have two left")} out={A.n8 + 0.5} text="TWO LEFT · BEING ALONE · THE PAST" col={COL.gold} />);

  // ================= #8 estar sola → la red chica =================
  O("s8", <Said t={t} n={8} at={A.n8 + 0.4} out={A.n8 + 4.6} text="Being alone" />);
  O("eve", <Hanko t={t} at={at("not of burglars")} text="NOT BURGLARS · THE EVENINGS" x={1380} y={330} out={at("the hardest hour") - 0.1} size={50} />);
  O("5", <Counter t={t} at={at("was five o'clock")} out={A.orange + 3.4} to={5} dur={0.4} label="O'CLOCK · THE HARDEST HOUR" x={1460} y={430} size={240} />);
  O("wt", <Hourglass t={t} at={at("she just waited for the phone")} out={at("then she decided waiting") + 2.4} label="waiting is not a plan" />);
  O("net", <NetWeek t={t} out={at("me very often") + 1.4} items={[{ at: at("on monday"), day: "MONDAY", text: "the bath, 4:00" }, { at: at("on wednesday"), day: "WEDNESDAY", text: "the school crossing" }, { at: at("on friday she ate"), day: "FRIDAY", text: "the noodle shop" }, { at: at("and every sunday", 1170), day: "SUNDAY", text: "one letter by hand" }]} />);
  O("me8", <Hanko t={t} at={at("me very often")} text="(ME. VERY OFTEN.)" x={1440} y={760} out={at("and she had a rule") - 0.1} size={52} rot={-3} />);
  O("1f", <Hanko t={t} at={at("one new friend a year")} text="ONE NEW FRIEND A YEAR" x={1400} y={330} out={at("after 60 your friends") + 0.6} size={56} />);
  O("lv", <CheckList t={t} out={at("so every", 1195) - 0.1} title="FRIENDS LEAVE" x={1460} y={520} col={COL.indigo} items={[{ at: at("some move"), text: "some move" }, { at: at("some get sick"), text: "some get sick" }, { at: at("some go before you"), text: "some go before you" }]} />);
  O("emp", <InkLine t={t} a={at("one day the net is empty")} b={atEnd("the net is empty")} out={at("so every", 1195) + 0.6} y={880} size={66} hot={["empty"]} />);
  O("ag", <AgeGap t={t} at={at("when she was 95")} at2={at("her newest friend was 31")} out={at("the mistake most of us make", 1205) - 0.1} />);
  O("dr", <InkLine t={t} a={at("loneliness is a door")} b={atEnd("from the inside", 1215)} out={at("my net is in america") - 0.1} y={880} size={60} hot={["door", "inside"]} />);
  O("mynet", <NetWeek t={t} out={at("and this year my new friend") + 0.2} items={[{ at: at("tuesday choir"), day: "TUESDAY", text: "choir" }, { at: at("thursday coffee"), day: "THURSDAY", text: "coffee, the library ladies" }, { at: at("sunday phone calls"), day: "SUNDAY", text: "my sister in Osaka" }, { at: at("early morning for me"), day: "(6 A.M. · 7 P.M.)", text: "her evening" }]} />);
  O("dan", <LowerThird t={t} at={at("a young man named daniel")} out={A.n9 - 0.3} name="Daniel" l2="ACROSS THE HALL · MY NEW FRIEND" l2at={at("who lives across the hall")} />);

  // ================= #9 el pasado → "gracias, ya te podés ir" =================
  O("s9", <Said t={t} n={9} at={A.n9 + 0.4} out={A.n9 + 4.6} text="The past" />);
  O("yd", <CheckList t={t} out={at("like old photographs") - 0.1} title="YESTERDAY" x={1460} y={520} col={COL.indigo} items={[{ at: at("the things we said"), text: "the things we said" }, { at: at("the things we did not say") , text: "…did not say" }, { at: at("the people we hurt"), text: "the people we hurt" }, { at: at("the chances we missed"), text: "the chances we missed" }, { at: at("the letter we never sent"), text: "the letter never sent" }]} />);
  O("38", <Counter t={t} at={at("when she was 38")} out={at("about money") + 1.4} to={38} dur={0.6} label="A FIGHT · HER SISTER FUMIKO" x={1440} y={430} size={220} />);
  O("24", <Counter t={t} at={at("for 24 years")} out={at("they lived two train") - 0.1} to={24} dur={1.0} label="YEARS · NOT ONE WORD" x={1440} y={430} size={260} />);
  O("2s", <Hanko t={t} at={at("two train stations apart")} text="2 TRAIN STATIONS APART" x={1400} y={330} out={at("at weddings and funerals") + 2.4} size={52} />);
  O("stn", <Stones t={t} at={at("like a stone in a river") - 0.3} out={at("and when she was 62") - 0.1} n={1} />);
  O("fum", <InkLine t={t} a={at("fumiko and next to it")} b={atEnd("right to her")} out={at("it took her three weeks")} y={300} size={64} hot={["write"]} />);
  O("dft", <Drafts t={t} at={at("in the end the letter")} out={at("she mailed it") + 0.4} />);
  O("tea", <InkLine t={t} a={at("would you come for tea")} b={atEnd("on sunday", 1325)} out={at("she mailed it") + 0.2} y={900} size={58} />);
  O("lg", <InkLine t={t} a={at("she let go of the answer")} b={atEnd("of the answer")} out={at("she said i did my part") - 0.1} y={880} size={66} hot={["answer"]} />);
  O("part", <Order t={t} out={at("fumiko came on sunday") - 0.1} x={1420} y={520} items={[{ at: at("i did my part"), n: "✓", text: "my part" }, { at: at("what fumiko does is"), n: "·", text: "Fumiko's part", dim: true }]} />);
  O("29", <Counter t={t} at={at("they had 29 more years")} out={at("but my mother told me the letter") - 0.1} to={29} dur={0.8} label="MORE YEARS · TOGETHER" x={1440} y={430} size={240} />);
  O("rl", <InkLine t={t} a={at("the real lesson was what")} b={atEnd("the chance is gone")} out={at("for", 1370) + 0.6} y={880} size={50} />);
  O("lgo", <LetGo t={t} at={at("thank you you taught me something", 1370)} fly={at("now you can go", 1380) + 0.6} out={at("then she wrote one line") + 0.4} text="thank you · you taught me something · now you can go" />);
  O("les", <CheckList t={t} out={at("she said the past is") - 0.1} title="THE LESSON, NOT THE REGRET" x={1460} y={520} col={COL.red} items={[{ at: at("be gentle with money talk"), text: "be gentle with money talk" }, { at: at("visit while you can"), text: "visit while you can" }, { at: at("say it now"), text: "say it now" }]} />);
  O("tj", <InkLine t={t} a={at("the past is a teacher")} b={atEnd("not a jailer")} out={at("you go to school") + 2.6} y={880} size={72} hot={["teacher", "jailer"]} />);
  O("nk", <InkLine t={t} a={at("punishing herself every night")} b={atEnd("not know better yet")} out={at("now here is why i carried") - 0.1} y={880} size={52} hot={["punishing"]} />);
  O("70y", <Counter t={t} at={at("i was 22")} out={at("for 50 years i thought") - 0.1} to={22} dur={0.6} label="1970 · I LEFT ANGRY" x={1440} y={430} size={240} />);
  O("50y", <Counter t={t} at={at("for 50 years i thought")} out={at("even after we made peace") - 0.1} to={50} dur={1.0} label="YEARS · THAT PLATFORM" x={1440} y={430} size={260} />);
  O("lgo2", <LetGo t={t} at={at("thank you you taught me something", 1440)} fly={at("now you can go", 1445) + 0.6} out={at("and i wrote my lesson") + 0.4} text="thank you · now you can go" />);
  O("bye", <InkLine t={t} a={at("say goodbye kindly")} b={atEnd("are angry", 1450)} out={at("now i do") + 0.6} y={880} size={60} hot={["kindly"]} />);
  O("byes", <Hanko t={t} at={at("goodbye i love you")} text="GOODBYE · I LOVE YOU · BE CAREFUL" x={1300} y={330} out={at("so those are the") + 0.6} size={46} />);

  // ================= el día de la madre a los 80 =================
  O("day", <Chip t={t} at={at("what did her day look like")} out={A.day + 3} text="HER DAY · AT 80 · MORNING TO NIGHT" col={COL.gold} />);
  O("ring", <DayRing t={t} out={A.lights + 2.0} marks={[
    { at: at("she got up at six"), h: 6, text: "up" }, { at: at("she opened the window"), h: 6.2, text: "the window" }, { at: at("then she did the radio exercise"), h: 6.5, text: "radio exercise" },
    { at: at("her plan of three"), h: 8, text: "plan of three" }, { at: at("the market walk"), h: 10, text: "the market" }, { at: A.four, h: 16, text: "worry time" },
    { at: A.seven, h: 19, text: "the news" }, { at: at("a walk around the block"), h: 19.5, text: "a walk" }, { at: at("a warm bath"), h: 20.5, text: "a bath" }, { at: at("and before bed the notebook"), h: 21.5, text: "the notebook" }]} x={1500} y={560} />);
  O("gm", <InkLine t={t} a={at("good morning to the garden")} b={atEnd("of a bed sheet")} out={at("then a glass of water") + 0.4} y={880} size={56} />);
  O("63c", <Hanko t={t} at={at("at 6.30")} text="6:30 · THE WHOLE COUNTRY" x={500} y={330} out={at("after breakfast") - 0.1} size={52} />);
  O("p3", <CheckList t={t} out={at("she told me if you write ten") - 0.1} title="PLAN OF THREE" x={480} y={540} col={COL.red} items={[{ at: at("buy fish"), text: "buy fish" }, { at: at("write to sachiko"), text: "write to Sachiko" }, { at: at("fix the button"), text: "fix the button" }]} />);
  O("q3", <InkLine t={t} a={at("if you write three")} b={atEnd("feel like a queen")} out={at("then the market walk") - 0.1} y={880} size={58} hot={["queen"]} />);
  O("ppl", <CheckList t={t} out={at("and then at four") - 0.1} title="THE MARKET · THE PEOPLE" x={480} y={540} col={COL.indigo} items={[{ at: at("the fish man"), text: "the fish man" }, { at: at("the tofu man"), text: "the tofu man" }, { at: at("lady with the pickles"), text: "the pickle lady" }]} />);
  O("4", <Hanko t={t} at={at("her worry time")} text="4:00 · WORRY TIME · 15 MIN" x={480} y={330} out={at("most days when four") + 0.4} size={52} />);
  O("app", <InkLine t={t} a={at("not now you have an appointment")} b={atEnd("at four", 1555)} out={at("and at four she sat") + 2} y={880} size={60} hot={["four"]} />);
  O("gone", <InkLine t={t} a={at("the worry had already gone")} b={atEnd("drank her tea")} out={A.seven - 0.1} y={880} size={58} hot={["gone"]} />);
  O("ten", <Hanko t={t} at={A.lights} text="LIGHTS OUT BY 10" x={500} y={330} out={at("that was her day") + 1.2} size={56} />);
  O("cheap", <Chip t={t} at={at("nothing fancy")} out={at("but do you see") + 0.4} text="NOTHING FANCY · NOTHING EXPENSIVE" col={COL.gold} />);
  O("rooms", <Rooms t={t} out={at("and they had to stay in them") + 1.4} items={[{ at: at("the morning card"), text: "the morning card" }, { at: at("the four o'clock tea"), text: "4 o'clock tea" }, { at: at("the seven o'clock news"), text: "7 o'clock news" }, { at: at("the notebook by the pillow"), text: "the pillow notebook" }]} />);

  // ================= 4 cosas que nunca hacía =================
  O("4n", <Chip t={t} at={A.nevers} out={at("she said a worry you say") + 3} text="4 THINGS SHE NEVER DID" col={COL.red} />);
  O("nv", <CheckList t={t} out={at("so let me give you the nine") - 0.2} title="SHE NEVER…" x={1460} y={520} col={COL.red} items={[
    { at: at("she never made a big decision"), text: "decided big things at night" }, { at: at("she never worried on an empty"), text: "worried on an empty stomach" },
    { at: at("she never worried alone"), text: "worried alone more than 3 days" }, { at: at("she never said what if"), text: "said “what if”" }]} />);
  O("dk", <InkLine t={t} a={at("at night everything looks darker")} b={atEnd("wait for breakfast")} out={at("2 she never worried") - 0.1} y={880} size={54} hot={["darker", "breakfast"]} />);
  O("hb", <InkLine t={t} a={at("a hungry body tells")} b={atEnd("terrible stories")} out={at("3", 1636) + 0.3} y={880} size={60} hot={["hungry"]} />);
  O("hh", <InkLine t={t} a={at("a worry you say out loud")} b={atEnd("half as heavy")} out={at("4 she never said") - 0.1} y={880} size={60} hot={["half"]} />);
  O("wi", <WhatIf t={t} at={at("what if is a door")} at2={at("then is a door with a plan")} out={A.recap - 0.2} />);

  // ================= el repaso: los 9 ema se encienden =================
  O("nine9", <NineList t={t} out={A.dollar - 0.2} x={1130} y={60} items={[
    { at: RECAP[0], text: "Write the worry · one next step · close it." }, { at: RECAP[1], text: "They will forget by Thursday." }, { at: RECAP[2], text: "One clean corner · a cushion and a cup." },
    { at: RECAP[3], text: "Face clean · hair combed · eyes awake." }, { at: RECAP[4], text: "Say it once · the envelope · eat their noodles." }, { at: RECAP[5], text: "The news once · one small kindness." },
    { at: RECAP[6], text: "One drawer a month · one envelope." }, { at: RECAP[7], text: "A small net · one new friend a year." }, { at: RECAP[8], text: "Thank you · now you can go." }]} />);
  O("$", <Hanko t={t} at={A.dollar} text="$0" x={1440} y={360} out={at("you do not need to buy") + 1.6} size={120} />);
  O("need", <CheckList t={t} out={at("now i want to ask you") + 0.2} title="YOU NEED" x={1460} y={560} col={COL.indigo} items={[{ at: at("a notebook", 1740), text: "a notebook" }, { at: at("a pencil", 1740), text: "a pencil" }, { at: at("a teapot", 1740), text: "a teapot" }, { at: at("a little courage"), text: "a little courage" }]} />);
  O("q", <InkLine t={t} a={at("which of these nine worries")} b={atEnd("awake the most")} out={at("for me it was number nine") - 0.1} y={300} size={62} hot={["most"]} />);
  O("cm", <CommentBox t={t} at={at("please answer me in the comments")} typeAt={at("tell me yours")} out={at("with my one finger") - 0.1} text="Number 1. I'm 74." />);
  O("50", <Hanko t={t} at={at("for 50 years", 1755)} text="ME: NUMBER 9 · 50 YEARS" x={1400} y={330} out={at("tell me yours") - 0.1} size={52} />);
  O("fin", <Chip t={t} at={at("with my one finger")} out={A.osakaEnd - 0.4} text="ONE FINGER · THIS LITTLE TELEPHONE" col={COL.indigo} />);
  O("cta", <BigNum t={t} at={A.osakaEnd} text="The Osaka Way" font={BRUSH} size={120} y={170} out={A.osakaEnd + 7} col={COL.cream} edge="#3a2f24" sub="LINK IN THE FIRST LINE OF THE DESCRIPTION" />);
  O("pgs", <CheckList t={t} out={A.osakaEnd + 7} title="HER PAGES" x={1500} y={600} col={COL.red} items={[{ at: at("the worry notebook"), text: "the worry notebook" }, { at: at("the envelope rule"), text: "the envelope rule" }, { at: at("her day from morning"), text: "her day, morning to night" }]} />);
  O("ty", <LowerThird t={t} at={at("thank you for sitting with me")} out={A.tonight - 0.1} name="Sachiko" l2="THANK YOU FOR SITTING WITH ME" l2at={at("thank you for sitting with me") + 0.3} />);
  O("ton", <CheckList t={t} out={at("the worries will still be") + 0.4} title="TONIGHT" x={1460} y={540} col={COL.indigo} items={[{ at: at("write your list"), text: "write your list" }, { at: at("write one next step"), text: "one next step" }, { at: at("close the notebook", A.tonight), text: "close the notebook" }]} />);
  O("sml", <InkLine t={t} a={at("most of them you will see")} b={atEnd("much smaller")} out={at("take care of yourself") + 0.4} y={880} size={66} hot={["smaller"]} />);
  O("enso", <Enso t={t} at={at("take care of yourself")} out={END + 1} text="see you next time" />);

  return <AbsoluteFill style={{ background: "#0b0a09" }}><SvgDefs /><Base t={t} />{L}</AbsoluteFill>;
};
