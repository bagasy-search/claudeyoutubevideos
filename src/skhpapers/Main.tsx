// skhpapers · EL VIDEO ENTERO (0 → END) en un solo hilo: avatar ⇄ la casa de papel de Osaka, SIEMPRE por la tinta.
// La base se arma sola desde avwin.json: antes de cada ventana la tinta se esparce hacia Sachiko; al terminar, la tinta abre
// otra vez la casa (o una foto). Las fotos se anclan a la frase que las nombra (SHOTS) y nunca pisan una ventana del avatar.
// Encima, las piezas de cada regla (papers_fx + rest_fx), todas con at("frase"). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { A, R, RE, RECAP, OPEN_FIRST } from "./tl";
import { BRUSH, COL, Hanko, SvgDefs, BigNum, at, atEnd, ei } from "./lib";
import { AVP, Avatar, Chip, Clip, InkLine, InkPortal, LowerThird, World, WIN } from "./ink";
import { CheckList, CommentBox, Counter, Dialogue, Enso, Hourglass, Subscribe, Swap, YearFlip, Snow, Order } from "./rest_fx";
import {
  BagFill, BagsVsLines, BlueFolder, DaysCross, ElevenList, Funnel, KeepGo, MailSort, Mistake, MotherList, NextVideo, OpenFirst, PileGrow, Quote,
  RuleCard, RuleTrack, Sticky, Ticket, Timer15, Week, BLUE,
} from "./papers_fx";

export const END = Math.min(2233.6, Math.ceil((WIN.length ? Math.max(WIN[WIN.length - 1].me, atEnd("see you next week")) : atEnd("see you next week")) + 2.0));  // tope = largo de skhpapers_mix.wav (2233,70 s)
type Pt = { x: number; y: number };
const AW = WIN;

// ---------- fotos a cuadro completo, cada una en la frase que la nombra ----------
type ShotIn = { p: string; after?: number; d: number; img: string; from?: Pt };
const SHOT_IN: ShotIn[] = [
  { p: "the kitchen drawer that does not close", d: 4.0, img: "f_drawer" },
  { p: "she will sit on the floor with a garbage", d: 3.6, img: "n_closet" },
  { p: "my brother and i carried out", d: 4.0, img: "n_41bags", from: { x: 1300, y: 640 } },
  { p: "and somewhere in those bags", d: 4.0, img: "n_osakahouse" },
  { p: "the one blue folder that matters", d: 3.2, img: "n_bluefolder" },
  { p: "what is the oldest piece of paper", d: 3.6, img: "n_ticket58" },
  { p: "i have kept this little house", d: 3.4, img: "n_teapot" },
  { p: "paper sliding doors", d: 3.6, img: "n_tansu" },
  { p: "newspapers folded in four", d: 4.0, img: "n_newspapers" },
  { p: "manuals for a rice cooker", d: 3.2, img: "n_manualdrawer" },
  { p: "furniture you call a truck", d: 3.6, img: "f_stacks" },
  // regla 1
  { p: "magazines catalogs flyers from the grocery", d: 3.6, img: "n_catalogs" },
  { p: "my mother kept the asahi", d: 4.0, img: "n_newspapers" },
  { p: "one grocery bag", d: 3.4, img: "f_bags" },
  { p: "a kitchen timer for fifteen", d: 3.4, img: "f_timer" },
  { p: "the bag goes straight to the recycling", d: 3.8, img: "f_recycle", from: { x: 1500, y: 700 } },
  { p: "tear out the one page right now", d: 3.6, img: "f_tearpage" },
  // regla 2
  { p: "i open the mail standing at the door", d: 3.8, img: "f_mailgenkan" },
  { p: "by the door i keep three things", d: 4.0, img: "n_mailbasket" },
  { p: "on sunday afternoon i sit down with the basket", d: 4.0, img: "f_basket" },
  { p: "an unopened letter from her own sister", d: 4.2, img: "n_unopened", from: { x: 760, y: 600 } },
  { p: "a yellow sticky note that says", d: 3.4, img: "f_sticky" },
  { p: "on sunday i call my son", d: 3.4, img: "f_phoneson" },
  { p: "i am a grandmother with a shredder", d: 3.0, img: "n_shredder" },
  // regla 3
  { p: "there is a drawer of instruction books", d: 3.6, img: "n_manualdrawer" },
  { p: "i counted mine the first time", d: 3.6, img: "f_manuals56" },
  { p: "with the manual for a washing machine", d: 4.0, img: "n_washmanual" },
  { p: "like a waitress with a tray", d: 3.6, img: "f_manualtray" },
  { p: "he wrote the model numbers", d: 3.8, img: "f_modellist" },
  { p: "i staple the receipt to the front page", d: 3.4, img: "f_staple" },
  { p: "cardboard boxes in the garage", d: 3.8, img: "f_garagebox" },
  // regla 4
  { p: "the ink had faded to nothing", d: 3.8, img: "n_receipts64" },
  { p: "on my refrigerator i have one clear", d: 3.8, img: "f_fridge" },
  { p: "into the shredder", d: 3.0, img: "f_shred" },
  { p: "one accordion folder", d: 3.8, img: "f_accordion" },
  { p: "the mistake here is the shoebox", d: 4.0, img: "f_shoebox" },
  // regla 5
  { p: "we send cards called nengajo", d: 3.6, img: "n_nengajo" },
  { p: "they were tied in bundles with red string", d: 4.0, img: "n_nengajo", from: { x: 900, y: 500 } },
  { p: "kneeling on the tatami with those bundles", d: 3.4, img: "f_cards" },
  { p: "i say thank you out loud", d: 3.6, img: "f_thankcard" },
  { p: "i copy into one small address book", d: 3.6, img: "f_addressbook" },
  { p: "my friend michiko in kobe", d: 4.2, img: "f_michiko", from: { x: 1300, y: 500 } },
  // regla 6
  { p: "we spent the first four days", d: 3.8, img: "n_tidydrawer" },
  { p: "look for the blue folder in the top drawer", d: 3.8, img: "f_bluefolder" },
  { p: "on my page there is a list", d: 3.6, img: "f_onepage" },
  { p: "and then i call my son and my daughter", d: 3.6, img: "f_callkids" },
  // regla 7
  { p: "letters are the hardest paper", d: 3.6, img: "f_letters" },
  { p: "a hundred and eighty letters", d: 3.8, img: "n_letters180" },
  { p: "we argued in the garden", d: 3.2, img: "n_kiribox" },
  { p: "once a week on a quiet evening", d: 3.8, img: "f_letters" },
  { p: "those ten go in a paulownia box", d: 3.8, img: "f_kiri" },
  { p: "the letters that leave i thank them", d: 3.8, img: "f_bundlethanks" },
  { p: "doris told me the first evening", d: 4.0, img: "f_doris" },
  { p: "and now i am doing it with my father's", d: 3.8, img: "f_fatherletter" },
  // regla 8
  { p: "every mother has this box", d: 3.6, img: "n_drawings" },
  { p: "my school notebooks", d: 3.6, img: "n_notebook" },
  { p: "i found it on the tatami", d: 4.0, img: "f_ticket" },
  { p: "take the box of each child", d: 3.6, img: "f_kidsbox" },
  { p: "and give it to them", d: 3.6, img: "f_envelopegift" },
  { p: "my son laughed for an hour", d: 3.6, img: "f_sondrawings" },
  // regla 9
  { p: "the japanese household notebook", d: 3.8, img: "n_kakeibo" },
  { p: "inside the first notebook", d: 3.4, img: "n_oneletterlist" },
  { p: "in the old iron drum", d: 4.0, img: "n_drum", from: { x: 1500, y: 640 } },
  { p: "i kept my diaries from the year", d: 3.6, img: "f_diaries" },
  { p: "i wrote a note on the box", d: 3.6, img: "f_notebox" },
  // regla 10
  { p: "pile was three boxes", d: 3.8, img: "f_someday" },
  { p: "the same recipe for lemon cake", d: 3.8, img: "n_recipes4" },
  { p: "gets a date written in the corner", d: 3.6, img: "f_pencildate" },
  { p: "the lemon cake recipe i baked it", d: 3.6, img: "f_lemoncake" },
  { p: "i invited doris and two other", d: 3.8, img: "f_cakeneighbors" },
  { p: "i kept the alaska brochure", d: 4.0, img: "f_alaska" },
  // errores, la madre, la regla 11
  { p: "and then the phone rings", d: 3.6, img: "f_stacks" },
  { p: "people buy a scanner", d: 3.6, img: "f_scanner" },
  { p: "my little shredder", d: 3.2, img: "n_shredder" },
  { p: "every free calendar from the fish shop", d: 3.2, img: "n_mailbasket" },
  { p: "i have one letter written by hand", d: 4.0, img: "f_letterwrite" },
  { p: "it lives on top of the blue folder", d: 3.6, img: "f_openfirst" },
  { p: "my mother's wooden rice paddle", d: 3.6, img: "n_ricepaddle" },
  { p: "inside was one sheet of paper", d: 4.2, img: "n_oneletterlist", from: { x: 960, y: 500 } },
  { p: "her sewing box for the neighbor", d: 3.6, img: "n_sewingbox" },
  { p: "the teapot with the chipped lid", d: 3.6, img: "f_teapot" },
  { p: "now my daughter wants that teapot", d: 3.6, img: "f_daughter" },
  // cierre
  { p: "open that drawer the one we opened together", d: 3.8, img: "f_closedrawer" },
];
// la ventana del avatar manda: si la foto cae dentro, arranca cuando sale Sachiko; si choca con la próxima, se corta antes
type Shot = { a: number; b: number; img: string; from?: Pt };
const SHOTS: Shot[] = SHOT_IN.map((s) => {
  let a = at(s.p, s.after ?? 0), b = a + s.d;
  const inW = AW.find((w) => a >= w.ms - 0.4 && a < w.me); if (inW) a = inW.me;
  const nx = AW.find((w) => w.ms - 0.4 > a && w.ms - 0.4 < b); if (nx) b = nx.ms - 0.4;
  return { a, b, img: s.img, from: s.from };
}).filter((s) => s.b - s.a >= 1.6).sort((x, y) => x.a - y.a)
  .filter((s, i, arr) => i === 0 || s.a >= arr[i - 1].b + 0.6);
const near = (x: number, ys: number[]) => ys.some((y) => Math.abs(x - y) < 0.06);
const AV_END = AW.map((w) => w.me), AV_START = AW.map((w) => w.ms - 0.4);
const INK_AV = [AVP.shoji, AVP.cup, AVP.frame, AVP.window, AVP.hands];

const WorldOrShot: React.FC<{ t: number }> = ({ t }) => {
  const sh = SHOTS.find((x) => t >= x.a && t < x.b + 0.5);
  if (!sh) return <World t={t} />;
  const clip = <Clip k={"x_" + sh.img} img={sh.img} t={t} a={sh.a} />;
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
  if (t >= w.me - 0.4 && i < AW.length - 1) { const p = [{ x: 960, y: 900 }, { x: 1500, y: 500 }, { x: 420, y: 520 }][i % 3]; return <><Avatar t={t} /><InkPortal x={p.x} y={p.y} r={ei(t, w.me - 0.4, w.me)} seed={i + 60}><WorldOrShot t={t} /></InkPortal></>; }
  return <Avatar t={t} />;
};

const RULE_T = ["No story first", "Decide at the door", "The manuals go", "Receipts live short", "The person, not the pile", "One blue folder", "Read once, choose ten", "Give it back now", "Decide your diaries", "One shelf, one date", "Open this first"];

export const Main: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  // un Chip (arriba a la izquierda) que cae sobre el avatar le pisa el pelo → durante TODA su vida va abajo a la izquierda
  const O = (k: string, n: React.ReactNode) => {
    if (React.isValidElement(n) && n.type === Chip) {
      const p = n.props as { at: number; out: number; y?: number };
      if (p.y === undefined && AW.some((w) => w.ms < p.out && w.me > p.at)) n = React.cloneElement(n as React.ReactElement<{ y: number }>, { y: 960 });
    }
    // la lista numerada (≈1000 px de ancho) sobre el avatar le tapa la cara → se apoya abajo, sobre el delantal
    if (React.isValidElement(n) && n.type === Order) {
      const p = n.props as { out: number; items: { at: number }[] };
      if (AW.some((w) => w.ms < p.out && w.me > p.items[0].at)) n = React.cloneElement(n as React.ReactElement<{ y: number }>, { y: 1040 - p.items.length * 72 });
    }
    L.push(<React.Fragment key={k}>{n}</React.Fragment>);
  };
  const a = at, z = atEnd;

  // ================= GANCHO (2ª persona: el cajón, tu hija, 9 de cada 10) =================
  O("drw", <Chip t={t} at={a("the kitchen drawer")} out={a("now imagine your daughter") - 0.2} text="THE DRAWER THAT DOESN'T CLOSE" col={COL.red} />);
  O("imp", <Sticky t={t} at={a("says important in your own")} out={a("now imagine your daughter")} text="IMPORTANT" sub="(20 years ago)" x={1440} y={430} />);
  O("dgt", <InkLine t={t} a={a("now imagine your daughter")} b={z("after you are gone")} out={a("she will sit on the floor")} y={880} size={70} hot={["daughter"]} />);
  O("910", <Funnel t={t} at={a("nine out of every ten")} cut={a("will go into that bag") } out={a("i know this because") + 0.6} n={40} keep={4} top="EVERY PIECE OF PAPER" bot="read" x={1420} y={500} />);
  O("didit", <Hanko t={t} at={a("i did it to my mother")} text="I DID IT TO MY MOTHER" x={1380} y={330} out={a("in osaka in two weeks")} size={58} />);
  O("2wk", <Chip t={t} at={a("in osaka in two weeks")} out={a("from a house of three") + 2.5} text="OSAKA · 2 WEEKS · 3 SMALL ROOMS" col={COL.indigo} />);
  O("41", <BagFill t={t} at={a("forty-one bags of paper")} out={a("and somewhere in those bags")} n={41} dur={2.4} x={1400} y={560} />);
  O("lost", <InkLine t={t} a={a("the one thing i lost")} b={z("inside the mess")} out={a("so today i am going") - 0.2} y={870} size={80} hot={["lost"]} />);
  O("wake", <Hanko t={t} at={a("still wakes me up")} text="SOME NIGHTS" x={1440} y={320} out={a("not the mess") } size={60} rot={4} />);
  // promesa
  O("trk0", <RuleTrack t={t} at={a("eleven japanese rules i follow")} out={a("where to start") + 1.5} cur={0} />);
  O("80", <Counter t={t} at={a("i follow at eighty")} out={a("where to start")} to={80} dur={0.8} label="MY AGE · MY RULES" x={1440} y={460} size={240} />);
  O("prm", <CheckList t={t} out={a("rule number seven is the one") - 0.2} title="TODAY" x={1380} y={560} col={COL.red} items={[{ at: a("where to start"), text: "where to start" }, { at: a("what to keep"), text: "what to keep" }, { at: a("the one blue folder"), text: "the one blue folder" }, { at: a("the letters you cannot throw"), text: "the letters you can't throw" }]} />);
  O("r7p", <Chip t={t} at={a("rule number seven is the one")} out={a("and rule number eleven") - 0.1} text="RULE 7 · DORIS DIDN'T BELIEVE IT" col={COL.gold} />);
  O("r11p", <Hanko t={t} at={a("and rule number eleven")} text="RULE 11 · ALMOST NOBODY DOES IT" x={1300} y={820} out={a("before we start dear") - 0.1} size={52} rot={-3} />);
  // CTA 1: suscribirse + campanita + la pregunta
  O("sub1", <Subscribe t={t} at={a("press subscribe and the little bell") - 0.3} press={a("subscribe")} out={a("and i want to ask you") } x={1400} y={780} />);
  O("cm1", <CommentBox t={t} at={a("what is the oldest piece of paper")} typeAt={a("what is the oldest piece of paper") + 0.8} out={a("now let us open the drawer") - 0.2} y={880} text="Mine is my mother's recipe card, 1961" />);
  O("tk1", <Ticket t={t} at={a("mine is a train ticket")} out={a("i will tell you about it later") + 1.2} x={1440} y={330} />);

  // ================= HISTORIA (seizen seiri, la tansu, el sobre marrón) =================
  O("me", <LowerThird t={t} at={a("i am sachiko")} out={a("in japan we have a word")} name="Sachiko" l2="80 · AMERICA SINCE 1970" l2at={a("i came to america")} />);
  O("sz", <BigNum t={t} at={a("seizen seiri")} text="seizen seiri" font={BRUSH} size={130} x={420} y={330} out={a("it is not a sad word")} col={COL.cream} edge="#3a2f24" sub="PUTTING YOUR THINGS IN ORDER WHILE YOU ARE ALIVE" />);
  O("kind", <Swap t={t} at={a("it is not a sad word")} neuAt={a("it is a kind word")} out={a("my mother fumiko") - 0.2} old="a sad word" neu="a kind word" y={820} />);
  O("fum", <Chip t={t} at={a("my mother fumiko")} out={a("it had tatami mats")} text="MY MOTHER, FUMIKO · 62 YEARS IN ONE HOUSE" col={COL.indigo} />);
  O("tns", <Hanko t={t} at={a("we call a tansu")} text="TANSU" x={1460} y={330} out={a("when she passed")} size={96} />);
  O("2003", <YearFlip t={t} at={a("when she passed")} out={a("every drawer was paper")} from={1941} to={2003} label="she passed" x={1440} y={440} />);
  O("dpp", <CheckList t={t} out={a("and under all of it") } title="EVERY DRAWER" x={1400} y={540} col={COL.indigo} items={[{ at: a("newspapers folded in four"), text: "newspapers, folded in four" }, { at: a("new year cards tied"), text: "New Year cards, tied" }, { at: a("electric bills from the"), text: "electric bills, 1960s" }, { at: a("manuals for a rice cooker"), text: "a rice cooker she gave away" }]} />);
  O("env", <Chip t={t} at={a("a brown envelope that said nothing")} out={a("here is what i learned") - 0.2} text="A BROWN ENVELOPE · NOTHING ON THE FRONT" col={COL.red} />);
  O("alm", <Hanko t={t} at={a("i almost put it in the bag")} text="ALMOST IN THE BAG" x={1420} y={830} out={a("here is what i learned") } size={56} rot={-4} />);
  O("hvy", <InkLine t={t} a={a("paper is the heaviest thing")} b={z("we leave behind")} out={a("not the furniture") + 0.8} y={860} size={78} hot={["heaviest"]} />);
  O("trk", <Swap t={t} at={a("furniture you call a truck")} neuAt={a("paper must be read")} out={a("because one page in a thousand") + 2} old="furniture: one afternoon" neu="paper: one page at a time" y={820} />);
  O("1k", <Funnel t={t} at={a("one page in a thousand")} cut={a("one page in a thousand") + 1.0} out={a("that is why your children")} n={100} keep={1} top="ONE PAGE IN A THOUSAND" bot="matters" x={1420} y={480} />);
  O("90", <Counter t={t} at={a("ninety percent of it")} out={a("they do not have the time")} to={90} dur={0.9} label="THROWN AWAY" x={1440} y={430} size={260} pre="" />);
  O("why", <CheckList t={t} out={a("so they throw it all") + 1.5} title="WHY THEY THROW IT ALL" x={1380} y={560} col={COL.red} items={[{ at: a("they do not have the time"), text: "no time to read it" }, { at: a("they are afraid of it"), text: "afraid of it" }, { at: a("they are grieving"), text: "grieving" }]} />);
  O("10r", <InkLine t={t} a={a("is the right ten percent")} b={z("the right ten percent")} out={R[0] - 0.3} y={880} size={84} hot={["right"]} />);

  // ================= las 11 reglas: tarjeta + casilleros de progreso =================
  R.forEach((r, i) => {
    O("rc" + i, <RuleCard t={t} at={r + 0.2} out={r + 3.6} n={i + 1} text={RULE_T[i]} />);
    O("rt" + i, <RuleTrack t={t} at={r} out={r + 4.2} cur={i + 1} />);
  });

  // ---------- 1 · empezar por el papel sin historia ----------
  const r1 = R[0];
  O("hard", <Chip t={t} at={a("most people start with the hardest", r1)} out={a("they sit down at the table") } text="WRONG START: THE HARDEST BOX" col={COL.red} />);
  O("2h", <Hourglass t={t} at={a("two hours later they are crying")} out={a("paper with a story stops you") } label="2 hours · nothing left the house" />);
  O("stop", <InkLine t={t} a={a("paper with a story stops you")} b={z("paper with a story stops you")} out={a("so you begin with paper") } y={860} size={80} hot={["stops"]} />);
  O("nost", <KeepGo t={t} out={a("my mother kept the asahi") - 0.2} left="STORY" right="NO STORY" items={[{ at: a("the box of letters from their husband"), text: "his letters", keep: true }, { at: a("the children's report cards"), text: "report cards", keep: true }, { at: a("magazines catalogs"), text: "magazines", keep: false }, { at: a("catalogs flyers from"), text: "catalogs", keep: false }, { at: a("flyers from the grocery store"), text: "grocery flyers", keep: false }, { at: a("old newspapers you were saving"), text: "old newspapers", keep: false }, { at: a("envelopes from the bank that"), text: "bank advertising", keep: false }]} />);
  O("gnk", <Chip t={t} at={a("the genkan the little entry")} out={a("a stack as tall as my knee")} text="GENKAN · WHERE WE LEAVE OUR SHOES" col={COL.indigo} />);
  O("knee", <PileGrow t={t} at={a("a stack as tall as my knee")} out={a("here is how i do it now") - 0.3} label="40 years of the Asahi" dur={4} />);
  O("10t", <Hanko t={t} at={a("she wrapped maybe ten things")} text="10 THINGS A YEAR" x={1000} y={300} out={a("the stack grew for forty") + 1.5} size={58} />);
  O("t15", <Timer15 t={t} at={a("a kitchen timer for fifteen")} ring={a("when the timer rings")} out={a("the bag goes straight to the recycling") + 1.2} />);
  O("dno", <CheckList t={t} out={a("if i start reading i lose") + 1.4} title="DON'T" x={560} y={420} col={COL.red} items={[{ at: a("i do not open them"), text: "open them" }, { at: a("i do not read the cover"), text: "read the cover" }]} />);
  O("lose", <Hanko t={t} at={a("if i start reading i lose")} text="IF I READ, I LOSE" x={1300} y={820} out={a("when the timer rings")} size={60} rot={-3} />);
  O("out", <Order t={t} out={a("that same minute") + 1.2} x={1380} y={480} items={[{ at: a("not to the garage"), n: "✗", text: "the garage", dim: true }, { at: a("not to the porch"), n: "✗", text: "the porch", dim: true }, { at: a("outside that same minute"), n: "✓", text: "OUTSIDE · NOW" }]} />);
  O("3bg", <BagFill t={t} at={a("i filled three bags")} out={a("ten years younger") + 1.5} n={3} dur={1.5} x={1420} y={560} />);
  O("10y", <Hanko t={t} at={a("ten years younger")} text="10 YEARS YOUNGER" x={1400} y={260} out={a("the mistake almost everybody makes") } size={62} rot={4} />);
  O("m1", <Mistake t={t} at={a("the mistake almost everybody makes here")} out={a("dear if you want one page") } n={0} text="“for one recipe”" />);
  O("toread", <Quote t={t} at={a("a single folder called")} out={a("be honest with yourself")} text="to read" who="ONE FOLDER, ONE PAGE" x={1420} y={460} w={520} size={90} />);
  O("hon", <InkLine t={t} a={a("i was not honest for many years")} b={z("for many years")} out={R[1] - 0.3} y={880} size={66} hot={["honest"]} />);

  // ---------- 2 · el papel no cruza el genkan sin decisión ----------
  O("line", <InkLine t={t} a={a("the genkan is the line between")} b={z("and your home")} out={a("you take off your shoes")} y={860} size={62} hot={["line"]} />);
  O("door", <Hanko t={t} at={a("i open the mail standing at the door")} text="AT THE DOOR" x={1440} y={330} out={a("i do not carry it") + 1} size={70} />);
  O("10ys", <InkLine t={t} a={a("the kitchen table is where paper")} b={z("for ten years")} out={a("by the door i keep") - 0.2} y={870} size={64} hot={["sleep"]} />);
  O("3th", <CheckList t={t} out={a("advertising goes into the paper bag") - 0.1} title="BY THE DOOR" x={1420} y={540} col={COL.indigo} items={[{ at: a("a small basket"), text: "a small basket" }, { at: a("a paper bag for recycling"), text: "a paper bag" }, { at: a("a letter opener my husband"), text: "Tom's letter opener, 1980" }]} />);
  O("ms", <MailSort t={t} at={a("advertising goes into the paper bag") - 0.2} out={a("two minutes a day") + 0.6} items={[{ at: a("advertising goes into"), text: "50% OFF!", to: 0 }, { at: a("without opening"), text: "Free catalog", to: 0 }, { at: a("envelopes i must answer"), text: "Water bill", to: 1 }, { at: a("go into the basket"), text: "Letter from Doris", to: 1 }]} />);
  O("2m", <Counter t={t} at={a("two minutes a day", R[1])} out={a("on sunday afternoon")} to={2} dur={0.4} label="MINUTES A DAY" x={1440} y={430} size={260} />);
  O("gm", <Chip t={t} at={a("a cup of genmaicha")} out={a("empty again for monday") + 0.8} text="SUNDAY · GENMAICHA · EMPTY BASKET" col={COL.gold} />);
  O("nob", <Hanko t={t} at={a("my mother had no basket")} text="NO BASKET" x={1440} y={320} out={a("her mail went everywhere") + 3} size={80} />);
  O("evw", <CheckList t={t} out={a("when we cleaned her house")} title="HER MAIL WENT…" x={1400} y={560} col={COL.red} items={[{ at: a("on the shoe shelf"), text: "on the shoe shelf" }, { at: a("under the telephone"), text: "under the telephone" }, { at: a("inside the rice bowl cupboard"), text: "in the rice bowl cupboard" }]} />);
  O("1991", <YearFlip t={t} at={a("from her own sister")} out={a("her sister had passed") + 2} from={1991} to={1991} label="unopened" x={1440} y={440} />);
  O("rd", <InkLine t={t} a={a("only about the weather")} b={z("a new grandchild")} out={a("but my mother never read it") + 1.4} y={870} size={64} />);
  O("2mg", <InkLine t={t} a={a("two minutes at the door would")} b={z("given her that letter")} out={a("and here is what i do now at eighty") - 0.2} y={880} size={62} hot={["letter"]} />);
  O("ask", <Sticky t={t} at={a("a yellow sticky note that says")} out={a("on sunday i call my son") + 1.5} text="ask" x={1440} y={420} />);
  O("bk3", <CheckList t={t} out={a("i do not guess") + 0.6} title="IF I DON'T UNDERSTAND IT" x={1380} y={560} col={COL.indigo} items={[{ at: a("a letter from the bank"), text: "the bank" }, { at: a("from the insurance"), text: "the insurance" }, { at: a("from the city"), text: "the city" }]} />);
  O("law", <Swap t={t} at={a("i am not a lawyer")} neuAt={a("i am a grandmother with a shredder")} out={a("the people whose job") + 0.4} old="a lawyer · an accountant" neu="a grandmother with a shredder" y={820} />);
  O("lost2", <InkLine t={t} a={a("i only know how to make sure")} b={z("does not get lost")} out={a("now rules one and two") - 0.2} y={880} size={60} hot={["lost"]} />);
  // re-gancho 1
  O("rh1", <Chip t={t} at={a("now rules one and two")} out={a("rule three empties half") } text="NEW PAPER: STOPPED · NOW THE OLD DRAWER" col={COL.indigo} />);
  O("half", <Hanko t={t} at={a("empties half of it in one afternoon")} text="HALF THE DRAWER · ONE AFTERNOON" x={1060} y={330} out={R[2] - 0.3} size={44} />);

  // ---------- 3 · los manuales se van ----------
  O("56", <Counter t={t} at={a("fifty-six manuals dear")} out={a("for maybe twenty machines") + 2} to={56} dur={1.0} label="MANUALS" x={1440} y={420} size={260} />);
  O("20m", <Swap t={t} at={a("for maybe twenty machines")} neuAt={a("for maybe twenty machines") + 1.0} out={a("my mother had the same drawer") - 0.2} old="56 manuals" neu="20 machines" y={820} />);
  O("1985", <YearFlip t={t} at={a("she threw away in nineteen")} out={a("she kept the manual for thirty") + 2.2} from={1985} to={2015} label="manual, no machine" x={1440} y={440} />);
  O("inc", <Quote t={t} at={a("he said in case")} out={a("here is how i sort them") - 0.2} text="In case." who="THE VOICE OF PAPER" x={1420} y={460} w={560} size={110} />);
  O("srt", <Order t={t} out={a("i keep only two kinds of manuals") - 0.2} x={1380} y={480} items={[{ at: a("first any manual for a machine"), n: "1", text: "no machine → bag" }, { at: a("second for the machines i still"), n: "2", text: "online, for free" }, { at: a("one line per machine"), n: "3", text: "one sheet of model numbers" }]} />);
  O("web", <Chip t={t} at={a("on the company website")} out={a("he wrote the model numbers")} text="ON THE COMPANY WEBSITE · FREE" col={COL.indigo} />);
  O("bgo", <Hanko t={t} at={a("the books go")} text="THE BOOKS GO" x={1440} y={320} out={a("i keep only two kinds") + 0.5} size={78} />);
  O("2k", <KeepGo t={t} out={a("the mistake people make with manuals") - 0.2} left="KEEP" right="GO" items={[{ at: a("like the furnace"), text: "the furnace", keep: true }, { at: a("or the smoke alarm"), text: "the smoke alarm", keep: true }, { at: a("the little card that has the warranty"), text: "under warranty", keep: true }, { at: a("when the warranty ends"), text: "warranty over", keep: false }]} />);
  O("bx", <Mistake t={t} at={a("the mistake people make with manuals")} out={a("please do not make them do that") + 1.2} n={0} text="keeping the box, too" fix="nothing will be inside" fixAt={a("and nothing will be inside")} />);

  // ---------- 4 · el recibo vive poco ----------
  O("1964", <YearFlip t={t} at={a("receipts from nineteen sixty-four")} out={a("the ink had faded") + 2.8} from={1964} to={1964} label="faded to nothing" x={1440} y={440} />);
  O("dl", <InkLine t={t} a={a("curled like a dry leaf")} b={z("like a dry leaf")} out={a("she kept every one")} y={870} size={76} hot={["leaf"]} />);
  O("prf", <Order t={t} out={a("i understand her") + 0.3} x={1380} y={480} items={[{ at: a("paper meant proof"), n: "→", text: "paper = proof" }, { at: a("and proof meant safety"), n: "→", text: "proof = safety" }]} />);
  O("pk", <Chip t={t} at={a("one clear plastic pocket")} out={a("and the basket from the") } text="ONE CLEAR POCKET · ON THE FRIDGE" col={COL.indigo} />);
  O("3s", <Counter t={t} at={a("for three seconds")} out={a("is it for something i might return") + 0.2} to={3} dur={0.3} label="SECONDS EACH" x={1440} y={430} size={240} />);
  O("q4", <Dialogue t={t} out={a("into the shredder", R[3]) + 1.5} lines={[{ at: a("is it for something i might return"), text: "Something I might return?" }, { at: a("it stays one more month"), text: "→ one more month", me: true }, { at: a("is it for something with a warranty"), text: "A warranty?" }, { at: a("it gets stapled to the manual"), text: "→ staple it to the manual", me: true }, { at: a("is it for groceries"), text: "Groceries, gas, coffee?" }, { at: a("into the shredder", R[3]), text: "→ the shredder", me: true }]} />);
  O("acc", <Chip t={t} at={a("a question for your accountant")} out={a("what i can tell you is how") } text="TAXES & LAW → ASK YOUR ACCOUNTANT" col={COL.red} />);
  O("nyt", <Hanko t={t} at={a("a grandmother on youtube told you")} text="NOT FROM A GRANDMOTHER ON YOUTUBE" x={1300} y={820} out={a("how long to keep them") + 1.5} size={44} rot={-2} />);
  O("acd", <CheckList t={t} out={a("no sorting the same paper twice") + 1} title="ONE ACCORDION FOLDER" x={1400} y={560} col={COL.indigo} items={[{ at: a("one pocket per year"), text: "one pocket per year" }, { at: a("in big black numbers"), text: "the year, big and black" }, { at: a("the whole pocket goes into the shredder"), text: "a year goes → all at once" }]} />);
  O("sbx", <Mistake t={t} at={a("the mistake here is the shoebox")} out={a("it is only weight") + 1} n={0} text="one shoebox → four" fix="a receipt you can't find = no receipt" fixAt={a("a receipt that cannot be found")} />);
  // re-gancho 2
  O("rh2", <CheckList t={t} out={a("rule five is where most people stop") + 0.4} title="CLEARED" x={1420} y={540} col={COL.indigo} items={[{ at: a("so far we have cleared magazines"), text: "magazines" }, { at: a("mail manuals and receipts") , text: "mail" }, { at: a("manuals and receipts"), text: "manuals" }, { at: a("and receipts", a("so far we have cleared")), text: "receipts" }]} />);
  O("faces", <InkLine t={t} a={a("the paper starts to have faces")} b={z("faces on it")} out={a("and i want to show you how")} y={870} size={72} hot={["faces"]} />);

  // ---------- 5 · la persona, no la pila de tarjetas ----------
  O("nen", <Chip t={t} at={a("we send cards called nengajo")} out={a("the post office keeps them")} text="NENGAJO · NEW YEAR CARDS" col={COL.red} />);
  O("jan1", <Hanko t={t} at={a("on the morning of january")} text="JANUARY 1 · ALL AT ONCE" x={1400} y={330} out={a("it is a beautiful tradition")} size={56} />);
  O("mtn", <PileGrow t={t} at={a("and it is a mountain of paper")} out={a("she received for over fifty") + 3} label="a mountain of paper" dur={1.6} />);
  O("50y", <Counter t={t} at={a("for over fifty years")} out={a("they were tied in bundles") + 1.5} to={50} dur={0.8} label="YEARS OF CARDS" x={1440} y={430} size={240} />);
  O("dog", <Hanko t={t} at={a("the neighbor's dog started barking")} text="WOOF" x={1460} y={320} out={a("but here is what i discovered")} size={90} rot={8} />);
  O("prt", <KeepGo t={t} out={a("those handwritten lines were") + 2.5} left="BY HAND" right="PRINTED" items={[{ at: a("most of the cards were printed"), text: "printed picture", keep: false }, { at: a("the same greeting"), text: "printed greeting", keep: false }, { at: a("a printed name"), text: "printed name", keep: false }, { at: a("your plum tree must be blooming"), text: "“Your plum tree must be blooming soon.”", keep: true }, { at: a("i think of your mother every winter"), text: "“I think of your mother every winter.”", keep: true }]} />);
  O("po", <InkLine t={t} a={a("the rest was the post office")} b={z("the post office")} out={a("so this is my rule now")} y={880} size={72} />);
  O("ty", <Quote t={t} at={a("i say thank you out loud")} out={a("if it has handwriting")} text="Thank you." who="OUT LOUD · THEN RECYCLING" x={1420} y={460} w={560} size={100} />);
  O("1pp", <Swap t={t} at={a("not one card per year")} neuAt={a("one card per person", R[4] + 20)} out={a("i keep them in a single box") + 1} old="one card per year" neu="one card per person" y={820} />);
  O("box1", <Order t={t} out={a("and the addresses") } x={1380} y={480} items={[{ at: a("in a single box the size of a shoebox"), n: "1", text: "one shoebox, no bigger" }, { at: a("a new card can come in only"), n: "↔", text: "one in, one out" }]} />);
  O("adb", <Chip t={t} at={a("one small address book")} out={a("the mistake is thinking that throwing") } text="ADDRESSES → ONE LITTLE BOOK" col={COL.indigo} />);
  O("frn", <Swap t={t} at={a("throwing away the card is throwing")} neuAt={a("it is not", a("throwing away the card is throwing"))} out={a("my friend michiko") - 0.2} old="the card = the friend" neu="the card is only paper" y={820} />);
  O("1966", <YearFlip t={t} at={a("every year since nineteen sixty-six")} out={a("i keep one card from her") + 1} from={1966} to={2026} label="Michiko, Kobe" x={1440} y={440} />);
  O("mq", <Quote t={t} at={a("now you must eat for both")} out={a("the other forty-nine cards") + 1.5} text="Now you must eat for both of you." who="MICHIKO, KOBE" x={1360} y={480} />);

  // ---------- 6 · una carpeta azul ----------
  O("imp6", <Hanko t={t} at={a("this is the most important paper")} text="THE MOST IMPORTANT PAPER" x={1330} y={600} out={a("when my mother died") } size={46} />);
  O("srch", <CheckList t={t} out={a("we spent the first four days") } title="WE DIDN'T KNOW…" x={1400} y={560} col={COL.red} items={[{ at: a("which bank"), text: "which bank" }, { at: a("which insurance"), text: "which insurance" }, { at: a("where the papers for the house"), text: "the house papers" }, { at: a("who to call about the pension"), text: "who to call" }]} />);
  O("4d", <DaysCross t={t} at={a("we spent the first four days")} out={a("four days i should have spent") + 3} n={4} label="searching, not grieving" />);
  O("acct", <Quote t={t} at={a("i am her daughter i am sorry")} out={a("four days dear")} text="I am her daughter, I am sorry, I do not know her account number." x={1360} y={480} size={52} />);
  O("blu", <BigNum t={t} at={a("it is blue because blue")} text="blue" font={BRUSH} size={200} x={470} y={420} out={a("everybody can find blue") + 1.2} col={BLUE} edge="#0d1f3d" sub="EASY TO SAY ON THE TELEPHONE" />);
  O("nmo", <Chip t={t} at={a("inside the folder is not money advice")} out={a("inside the folder is a map") } text="NOT MONEY ADVICE" col={COL.red} />);
  O("map", <Swap t={t} at={a("inside the folder is a map")} neuAt={a("just the places")} out={a("on my page there is a list") - 0.2} old="the secrets" neu="just the places" y={820} />);
  O("bf", <BlueFolder t={t} at={a("on my page there is a list") - 0.3} open={a("on my page there is a list") + 0.4} out={a("which papers are important and how") - 0.2} items={[{ at: a("the names of the people who"), text: "doctor · accountant · lawyer · agent" }, { at: a("the names of the companies"), text: "companies (names only)" }, { at: a("not the passwords"), text: "no passwords, no numbers" }, { at: a("where the original important papers"), text: "where the originals are" }, { at: a("the sheet with the model numbers"), text: "the model-number sheet" }, { at: a("the name of the person i trust most"), text: "the person I trust most" }]} />);
  O("lw6", <Chip t={t} at={a("that is a question for a lawyer")} out={a("i am only telling you about the folder") + 1} text="WHICH PAPERS → ASK A LAWYER IN YOUR STATE" col={COL.red} />);
  O("2x", <CheckList t={t} out={a("ten minutes", R[5]) + 1.2} title="TWICE A YEAR" x={1400} y={540} col={BLUE} items={[{ at: a("on new year's day and on my birthday"), text: "New Year's Day" }, { at: a("my birthday in june"), text: "my birthday, June" }, { at: a("i fix what changed"), text: "fix what changed" }]} />);
  O("same", <Quote t={t} at={a("the blue folder is in the same place")} out={a("they roll their eyes") + 1.5} text="The blue folder is in the same place." who="TO MY SON & DAUGHTER" x={1360} y={480} size={58} />);
  O("fat", <Mistake t={t} at={a("the mistake with the blue folder")} out={a("the first page tells everything") + 1} n={0} text="a fat blue folder" fix="a map, not the treasure · 10 pages max" fixAt={a("a map not the treasure")} />);
  // re-gancho 3 + CTA 2
  O("d83", <Chip t={t} at={a("she is my neighbor eighty-three")} out={a("and when i told her rule seven") } text="DORIS, 83 · A BASEMENT FULL OF LETTERS" col={COL.gold} />);
  O("cru", <Quote t={t} at={a("sachiko that is cruel")} out={a("two weeks later she called") } text="Sachiko, that is cruel." who="DORIS" x={1380} y={460} size={72} w={640} />);
  O("cant", <Quote t={t} at={a("i cannot stop doing it")} out={a("but first one second dear") } text="I cannot stop doing it." who="DORIS · 2 WEEKS LATER" x={1380} y={460} size={72} w={640} rot={3} />);
  O("sub2", <Subscribe t={t} at={a("press subscribe and the little bell", 300) - 0.3} press={a("subscribe", a("if these rules are helping you"))} out={a("and tell me in the comments who") } x={1400} y={780} />);
  O("nxw", <Chip t={t} at={a("next week i will show you")} out={a("and tell me in the comments who") } text="NEXT WEEK · A WHOLE CLOSET, ONE WEEKEND" col={COL.indigo} />);
  O("cm2", <CommentBox t={t} at={a("and tell me in the comments who")} typeAt={a("just their first name")} out={R[6] - 0.3} text="My granddaughter, Emma" />);

  // ---------- 7 · leer una vez más y elegir diez ----------
  O("hrd", <CheckList t={t} out={a("you cannot throw them away") } title="THE HARDEST PAPER" x={1400} y={560} col={COL.red} items={[{ at: a("love letters"), text: "love letters" }, { at: a("letters from your mother"), text: "from your mother" }, { at: a("from a son in the army"), text: "from a son in the army" }, { at: a("from a friend who moved away"), text: "from a friend far away" }]} />);
  O("300", <Funnel t={t} at={a("a box of three hundred letters")} cut={a("will be thrown away whole")} out={a("so they will read none") + 1} n={300} keep={0} top="300 LETTERS" bot="read" x={1420} y={480} />);
  O("nag", <Chip t={t} at={a("worked in nagoya")} out={a("a hundred and eighty letters") + 2.5} text="MY FATHER · 2 YEARS IN NAGOYA" col={COL.indigo} />);
  O("180", <Counter t={t} at={a("a hundred and eighty letters")} out={a("we found them in the tansu") + 1.5} to={180} dur={1.0} label="LETTERS" x={1440} y={430} size={240} />);
  O("brn", <Swap t={t} at={a("my brother wanted to burn them")} neuAt={a("i wanted to keep them all")} out={a("we argued in the garden") + 2} old="Kenji: burn them all" neu="Sachiko: keep them all" y={820} />);
  O("afr", <InkLine t={t} a={a("and a hundred and eighty letters i kept")} b={z("i am afraid to open")} out={a("so here is rule seven") - 0.2} y={880} size={60} hot={["afraid"]} />);
  O("wk", <CheckList t={t} out={a("at the end i keep no more") } title="ONCE A WEEK" x={1400} y={560} col={COL.indigo} items={[{ at: a("a quiet evening i read some letters"), text: "a quiet evening" }, { at: a("slowly with tea"), text: "slowly, with tea" }, { at: a("i choose the letters that sound most"), text: "the ones that sound like them" }]} />);
  O("10l", <Counter t={t} at={a("no more than ten letters from each")} out={a("those ten go in a paulownia") + 0.5} to={10} dur={0.5} label="FROM EACH PERSON · THE BEST TEN" x={1440} y={430} size={260} />);
  O("kiri", <Chip t={t} at={a("a kiri box")} out={a("the letters that leave i thank them") } text="KIRI · PAULOWNIA KEEPS OUT DAMP & INSECTS" col={COL.gold} />);
  O("cer", <CheckList t={t} out={a("i do a very small one") + 1} title="WE THANK OLD THINGS" x={1400} y={560} col={COL.red} items={[{ at: a("dolls", R[6]), text: "dolls" }, { at: a("needles", R[6]), text: "needles" }, { at: a("brushes", R[6]), text: "brushes" }]} />);
  O("tk7", <Quote t={t} at={a("thank you for keeping this for me")} out={a("not the trash the shredder") } text="Thank you for keeping this for me." x={1360} y={480} size={64} />);
  O("shr", <Swap t={t} at={a("not the trash the shredder")} neuAt={a("the shredder because they are private")} out={a("doris told me the first evening") - 0.2} old="the trash" neu="the shredder (private)" y={820} />);
  O("3ev", <Order t={t} out={a("that is the difference") + 0.5} x={1380} y={480} items={[{ at: a("the first evening she cried"), n: "1", text: "she cried" }, { at: a("the second evening she laughed"), n: "2", text: "she laughed" }, { at: a("the third evening she read"), n: "3", text: "she read ten to her granddaughter" }]} />);
  O("10v", <Swap t={t} at={a("ten letters get read")} neuAt={a("three hundred letters get thrown")} out={a("and now i am doing it with my father's") - 0.2} old="10 letters → read" neu="300 letters → thrown" y={820} />);
  O("20m7", <Chip t={t} at={a("twenty letters a month")} out={a("in one of them he says")} text="20 A MONTH · 8 CHOSEN SO FAR" col={COL.indigo} />);
  O("bird", <Quote t={t} at={a("like a small bird walking")} out={a("i did not know my father") + 2.5} text="Your handwriting is like a small bird walking in the snow." who="MY FATHER, NAGOYA" x={1360} y={480} size={58} />);
  O("snw", <Snow t={t} at={a("like a small bird walking")} out={a("i did not know my father") + 2.5} />);

  // ---------- 8 · devolverles la infancia ahora ----------
  O("box8", <CheckList t={t} out={a("we keep these because") } title="EVERY MOTHER HAS THIS BOX" x={1400} y={560} col={COL.gold} items={[{ at: a("the drawings with the purple sun"), text: "the purple sun" }, { at: a("the report cards"), text: "report cards" }, { at: a("swimming twenty-five meters"), text: "swimming, 25 meters" }, { at: a("to the best mama in the world"), text: "“best Mama in the wrold”" }]} />);
  O("kanji", <Chip t={t} at={a("one hundred times the same kanji")} out={a("my first calligraphy") + 1} text="100 TIMES THE SAME KANJI · RED CIRCLES" col={COL.red} />);
  O("tk8", <Ticket t={t} at={a("my first train ticket alone")} out={a("i found it on the tatami") } />);
  O("day", <CheckList t={t} out={a("and i thought why did she not") } title="THE WHOLE DAY" x={1400} y={560} col={COL.indigo} items={[{ at: a("the cold window"), text: "the cold window" }, { at: a("the rice ball my mother wrapped"), text: "her rice ball" }]} />);
  O("why8", <InkLine t={t} a={a("why did she not give me this")} b={z("while she was alive")} out={a("i would have loved to hear") } y={870} size={66} hot={["alive"]} />);
  O("qs8", <Dialogue t={t} out={a("instead of receiving it") + 1.2} lines={[{ at: a("what was she thinking"), text: "What was she thinking at the station?" }, { at: a("was she afraid"), text: "Was she afraid?" }, { at: a("i will never know because"), text: "I will never know.", me: true }]} />);
  O("rcv", <Swap t={t} at={a("i found the ticket instead")} neuAt={a("instead of receiving it")} out={R[7] - 0.3} old="found it" neu="received it" y={820} />);
  O("r8", <Order t={t} out={a("watch their faces") + 1} x={1380} y={480} items={[{ at: a("choose the best things maybe twenty"), n: "1", text: "the best ~20 pieces" }, { at: a("put them in a big envelope"), n: "2", text: "one envelope, their name" }, { at: a("and give it to them"), n: "3", text: "give it · in person" }, { at: a("and tell them the stories"), n: "4", text: "tell the stories" }]} />);
  O("drew", <Quote t={t} at={a("you drew this the week")} out={a("watch their faces") } text="You drew this the week your grandfather visited." x={440} y={300} size={56} />);
  O("kids", <Dialogue t={t} out={a("so i did", R[7]) + 1} lines={[{ at: a("my son laughed for an hour"), text: "my son: laughed for an hour" }, { at: a("my daughter cried"), text: "my daughter: cried, then photos for her kids" }, { at: a("mom keep only what you love"), text: "“Mom, keep only what you love.”", me: true }]} />);
  O("wait", <Mistake t={t} at={a("the mistake is waiting")} out={a("a box opened without you is homework") + 1.5} n={0} text="waiting for “after”" fix="with you: a gift · without you: homework" fixAt={a("a box opened with you is a gift")} />);
  // re-gancho 4
  O("rh4", <CheckList t={t} out={a("rule nine is about my mother's notebooks") } title="3 RULES LEFT · ONLY YOURS" x={1400} y={560} col={COL.red} items={[{ at: a("your diaries your someday"), text: "your diaries" }, { at: a("your someday pile"), text: "your someday pile" }, { at: a("the one letter almost nobody writes"), text: "the one letter" }]} />);

  // ---------- 9 · decidí vos qué pasa con tus diarios ----------
  O("hv9", <Hanko t={t} at={a("it is too heavy for them")} text="TOO HEAVY FOR THEM" x={1400} y={330} out={a("my mother kept a small notebook") } size={60} />);
  O("kak", <Chip t={t} at={a("the japanese household notebook")} out={a("fifty notebooks in a row") } text="KAKEIBO · THE HOUSEHOLD NOTEBOOK" col={COL.gold} />);
  O("kak2", <CheckList t={t} out={a("fifty notebooks in a row") } title="EVERY DAY SHE WROTE" x={1400} y={560} col={COL.gold} items={[{ at: a("on rice", R[8]), text: "rice" }, { at: a("on fish", R[8]), text: "fish" }, { at: a("on school shoes"), text: "school shoes" }, { at: a("a few lines about how the month"), text: "how the month went" }]} />);
  O("note9", <Quote t={t} at={a("kenji and sachiko keep the notebooks")} out={a("so we did exactly that") + 0.5} text="Keep the notebooks from the year each of you was born, and the year your father died. Burn the rest. I love you." who="FUMIKO" x={1360} y={480} size={46} w={860} />);
  O("50k", <Funnel t={t} at={a("we kept three notebooks")} cut={a("we kept three notebooks") + 0.3} out={a("because she told us") + 2} n={50} keep={3} top="50 NOTEBOOKS" bot="kept" x={1420} y={480} />);
  O("nof", <CheckList t={t} out={a("we burned the others") } title="BECAUSE SHE TOLD US" x={1400} y={560} col={COL.indigo} items={[{ at: a("there was no fighting"), text: "no fighting" }, { at: a("no guilt"), text: "no guilt" }, { at: a("no box in my closet"), text: "no box I'm afraid of" }]} />);
  O("cab", <Quote t={t} at={a("the price of cabbage is a scandal")} out={a("we laughed until we cried") + 1.4} text="March 1972. The price of cabbage is a scandal." who="FUMIKO'S KAKEIBO" x={1360} y={460} size={58} />);
  O("3c", <Order t={t} out={a("i chose two", R[8]) + 1.5} x={1380} y={480} items={[{ at: a("keep them and write on the box"), n: "1", text: "keep · write on the box" }, { at: a("choose the few that matter"), n: "2", text: "choose a few · let go of the rest" }, { at: a("if they are very private"), n: "3", text: "very private → your own hands" }]} />);
  O("two", <Hanko t={t} at={a("i chose two", R[8])} text="I CHOSE TWO" x={1380} y={830} out={a("i kept my diaries from the year") + 1.5} size={60} />);
  O("eve", <Chip t={t} at={a("one per evening last winter")} out={a("the mistake is to think") } text="ONE PER EVENING · LAST WINTER" col={COL.indigo} />);
  O("wpp", <Mistake t={t} at={a("the mistake is to think they will want")} out={a("saves them twenty years") + 1.4} n={0} text="“they'll want to read everything”" fix="a note on the box: 2 minutes, saves 20 years" fixAt={a("a note on the box takes two minutes")} />);

  // ---------- 10 · el estante del algún día, con fecha ----------
  O("sdy", <CheckList t={t} out={a("pile was three boxes") } title="THE SOMEDAY PILE" x={1400} y={560} col={COL.gold} items={[{ at: a("recipes cut from the newspaper"), text: "recipes from the paper" }, { at: a("instructions for a quilt"), text: "a quilt pattern" }, { at: a("a brochure for a cruise to alaska"), text: "a cruise to Alaska" }, { at: a("articles about vitamins"), text: "vitamins, gardening…" }]} />);
  O("3bx", <BagFill t={t} at={a("three boxes in the spare room")} out={a("when i finally sat down") + 0.5} n={3} dur={1.0} label="boxes" />);
  O("4x", <Counter t={t} at={a("cut out four times")} out={a("i had forgotten i already") + 2} to={4} dur={0.5} label="SAME LEMON CAKE RECIPE" x={1440} y={430} size={260} />);
  O("nvr", <InkLine t={t} a={a("and i never baked it")} b={z("and i never baked it")} out={a("that told me everything") + 2} y={880} size={76} hot={["never"]} />);
  O("dt", <Sticky t={t} at={a("with a pencil the day i put it there")} out={a("on new year's day and on my birthday the same") } text="Oct 24" sub="(pencil)" x={1440} y={420} rot={-4} />);
  O("1yr", <Swap t={t} at={a("it was not someday")} neuAt={a("it was never")} out={a("and then i did something") - 0.2} old="someday" neu="never" y={820} />);
  O("bake", <Hanko t={t} at={a("i baked it")} text="I BAKED IT" x={1440} y={330} out={a("that same week") + 1.5} size={80} rot={-5} />);
  O("doit", <Order t={t} out={a("some days the best way to clean") + 1.4} x={1380} y={480} items={[{ at: a("can i do this this month"), n: "?", text: "this month?" }, { at: a("if yes do it"), n: "✓", text: "yes → do it" }, { at: a("if no let it go"), n: "✗", text: "no → let it go" }]} />);
  O("cln", <InkLine t={t} a={a("the best way to clean a paper")} b={z("do what it says")} out={a("the mistake is keeping some") - 0.2} y={880} size={60} hot={["do"]} />);
  O("9y", <Counter t={t} at={a("brochure for nine years")} out={a("i am not going to alaska") } to={9} dur={0.6} label="YEARS · ONE BROCHURE" x={1440} y={430} size={240} />);
  O("cst", <Swap t={t} at={a("the brochure was not a plan")} neuAt={a("it was a costume")} out={a("and now rule eleven") - 0.2} old="a plan" neu="a costume" y={820} />);
  O("knees", <Hanko t={t} at={a("my knees prefer my garden")} text="MY KNEES PREFER MY GARDEN" x={1300} y={330} out={a("the brochure was not a plan")} size={50} rot={3} />);
  // re-gancho 5
  O("rh5", <Chip t={t} at={a("and now rule eleven")} out={a("but first i want to give you the five") } text="RULE 11 · THE ONE THAT SAVES 2 WEEKS" col={COL.red} />);
  O("5m", <Hanko t={t} at={a("the five mistakes i see the most")} text="5 MISTAKES" x={1440} y={330} out={A.mistakes - 0.2} size={80} />);

  // ================= 5 errores =================
  O("e1", <Mistake t={t} at={A.mistakes} out={a("a stack only grows") + 1} n={1} text="stacks on the floor" fix="bags and boxes, never stacks" fixAt={a("use bags and boxes")} />);
  O("3mo", <Chip t={t} at={a("stay on the floor for three months")} out={a("use bags and boxes") } text="3 MONTHS ON THE FLOOR" col={COL.red} />);
  O("e2", <Mistake t={t} at={a("mistake number two")} out={a("you must be more patient") + 1} n={2} text="everything in one weekend" fix="15 minutes a day" fixAt={a("fifteen minutes a day is better")} />);
  O("pat", <InkLine t={t} a={a("paper is patient")} b={z("you must be more patient")} out={a("mistake number three") - 0.2} y={300} size={70} hot={["patient"]} />);
  O("e3", <Mistake t={t} at={a("mistake number three")} out={a("your children cannot find") + 1} n={3} text="scanning everything" fix="only a few precious things" fixAt={a("scanning is good for a few")} />);
  O("sc3", <Counter t={t} at={a("they scan three hundred pages")} out={a("scanning is good for a few") } to={300} dur={1.0} label="PAGES NOBODY CAN OPEN" x={1440} y={330} size={200} />);
  O("e4", <Mistake t={t} at={a("mistake number four")} out={a("after doris") + 1} n={4} text="private papers in the trash" fix="name · address · numbers → shredder" fixAt={a("goes into the shredder", a("mistake number four"))} />);
  O("30d", <Hanko t={t} at={a("my little shredder")} text="$30 · MY BEST FRIEND (AFTER DORIS)" x={1300} y={300} out={a("mistake number five") - 0.2} size={46} rot={-3} />);
  O("e5", <Mistake t={t} at={a("mistake number five")} out={a("where the door is") + 1} n={5} text="doing it in secret" fix="tell your children · tell one person" fixAt={a("tell your children")} />);
  O("dr5", <InkLine t={t} a={a("the best order in the world")} b={z("where the door is")} out={A.never - 0.2} y={300} size={58} hot={["door"]} />);
  // lo que mamá nunca hizo
  O("nv", <CheckList t={t} out={a("except one time") } title="MY MOTHER NEVER…" x={1400} y={560} col={COL.red} items={[{ at: a("she never said no to paper"), text: "said no at the door" }, { at: a("she never asked for help"), text: "asked for help" }, { at: a("she never told us what was important"), text: "told us what mattered" }]} />);
  O("20y", <Hanko t={t} at={a("alone with the tansu for twenty")} text="ALONE · 20 YEARS" x={1440} y={320} out={a("and she never told us") } size={60} />);
  O("1env", <Hanko t={t} at={a("one brown envelope")} text="ONE BROWN ENVELOPE" x={1400} y={620} out={R[10] - 0.3} size={62} rot={-4} />);

  // ================= 11 · la carta "ábrela primero" =================
  O("end", <Chip t={t} at={a("what we call an ending note")} out={a("the lawyer does the legal part") } text="ENDING NOTE · A NOTEBOOK, NOT A LEGAL PAPER" col={COL.indigo} />);
  O("hum", <Swap t={t} at={a("the lawyer does the legal part")} neuAt={a("the ending note does the human part")} out={a("i do not have a fancy notebook") - 0.2} old="the lawyer: the legal part" neu="the ending note: the human part" y={820} />);
  O("of", <OpenFirst t={t} at={OPEN_FIRST} out={a("it lives on top of the blue folder") + 2.5} />);
  O("2pg", <Chip t={t} at={a("written by hand two pages")} out={OPEN_FIRST} text="ONE LETTER · BY HAND · TWO PAGES" col={COL.red} />);
  O("90b", <Funnel t={t} at={a("my children will throw away ninety")} cut={a("i am at peace with that")} out={a("my letter tells them which ten") + 1.5} n={50} keep={5} top="EVERYTHING" bot="the right ten percent" x={1420} y={480} />);
  O("10k", <CheckList t={t} out={a("it tells them what they can let go") - 0.2} title="WHAT TO KEEP" x={1420} y={540} col={COL.red} items={[{ at: a("with the ten letters from tom"), text: "the kiri box · Tom's 10" }, { at: a("notebooks of my mother"), text: "3 kakeibo notebooks" }, { at: a("my train ticket from nineteen fifty-eight"), text: "the 1958 ticket + its story" }, { at: a("the one card from michiko"), text: "Michiko's one card" }, { at: a("my mother's wooden rice paddle"), text: "the rice paddle" }]} />);
  O("rd4u", <Quote t={t} at={a("you can throw away everything else")} out={a("when i wrote that sentence") + 1} text="You can throw away everything else. You do not need to read it. I already read it for you." x={1360} y={480} size={50} w={860} />);
  O("shk", <InkLine t={t} a={a("my hand was shaking")} b={z("my hand was shaking")} out={a("to read that sentence on the floor") + 1} y={880} size={74} hot={["shaking"]} />);
  // el sobre marrón: la revelación
  O("ins", <Chip t={t} at={A.whatIn} out={a("inside was one sheet of paper") } text="THE BROWN ENVELOPE" col={COL.red} />);
  O("ml", <MotherList t={t} x={1500} at={a("it was a list")} out={a("we found it on day nine") + 0.2} lost={[{ at: a("her sewing box went to a donation"), i: 2 }, { at: a("went to the curb in a bag"), i: 3 }]} lines={[
    { at: a("the tansu for kenji"), text: "the tansu → Kenji" }, { at: a("the kimono with the cranes"), text: "kimono with cranes → Sachiko" }, { at: a("her sewing box for the neighbor"), text: "sewing box → Mrs. Ueda" },
    { at: a("the little buddhist altar"), text: "the umbrella → her niece" }, { at: a("the little buddhist altar") + 0.6, text: "the altar → Kenji's son" }, { at: a("eleven things", A.whatIn), text: "…" }, { at: a("eleven things", A.whatIn) + 0.2, text: "…" },
    { at: a("eleven things", A.whatIn) + 0.4, text: "…" }, { at: a("eleven things", A.whatIn) + 0.6, text: "…" }, { at: a("eleven lines", A.whatIn), text: "…" }, { at: a("eleven lines", A.whatIn) + 0.2, text: "…" }]} />);
  O("once", <InkLine t={t} a={a("the only time my mother told us")} b={z("what mattered")} out={A.day9 - 0.2} y={300} size={60} hot={["mattered"]} />);
  O("d9", <DaysCross t={t} at={A.day9} out={a("her sewing box went to a donation") - 0.2} n={9} label="found on day nine" x={960} y={480} />);
  O("2of11", <Counter t={t} at={a("two of eleven gone")} out={a("that is why dear") } to={2} dur={0.3} label="OF 11 · ALREADY GONE" x={1440} y={430} size={260} col={COL.red} />);
  O("top", <CheckList t={t} out={a("this is what i do at eighty", A.day9)} title="THE LETTER MUST" x={1400} y={560} col={COL.red} items={[{ at: a("the letter must say open this first"), text: "say “open this first”" }, { at: a("and it must be on top"), text: "be on top" }, { at: a("your children must know where"), text: "be known" }]} />);
  O("bd", <Chip t={t} at={a("every year on my birthday i read my letter")} out={a("last year i wrote about the teapot") } text="EVERY BIRTHDAY · ONE NEW STORY" col={COL.gold} />);
  O("1976", <YearFlip t={t} at={a("tom chipped it in")} out={a("now my daughter wants") } from={1976} to={1976} label="Tom, afraid for a week" x={1440} y={440} />);
  O("stay", <Swap t={t} at={a("before the letter it was a chipped teapot")} neuAt={a("now it has a story")} out={A.routine - 0.2} old="a chipped teapot" neu="a teapot with a story" y={820} />);

  // ================= la semana de papel =================
  O("wk7", <Week t={t} out={a("in one month you will not recognize") + 2.5} y={560} days={[
    { at: a("monday fifteen minutes"), d: "MON", text: "magazines · one bag" }, { at: a("tuesday fifteen minutes"), d: "TUE", text: "the manual drawer" }, { at: a("wednesday receipts"), d: "WED", text: "receipts · shredder" },
    { at: a("thursday cards"), d: "THU", text: "cards · one per person" }, { at: a("friday the someday shelf"), d: "FRI", text: "someday shelf" }, { at: a("saturday rest"), d: "SAT", text: "rest · bake the cake" }, { at: a("sunday the basket"), d: "SUN", text: "basket · tea · folder" }]} />);
  O("2md", <Chip t={t} at={a("every day of the week two minutes")} out={a("in one month you will not recognize") + 2.5} text="EVERY DAY · 2 MINUTES AT THE DOOR" col={COL.indigo} />);
  // comentarios
  O("mg", <Quote t={t} at={a("margaret wrote")} out={a("dear margaret start with") } text="Sachiko, my husband will not let me throw away anything with his name on it." who="MARGARET" x={1360} y={480} size={50} w={860} />);
  O("mg2", <Swap t={t} at={a("start with your own papers")} neuAt={a("he will ask you how you did it")} out={a("that is how tom started") + 1} old="his papers" neu="your own drawer first" y={820} />);
  O("tm", <Chip t={t} at={a("he asked for his own grocery bag")} out={a("and linda wrote") } text="TOM: HIS OWN BAG, HIS OWN TIMER" col={COL.gold} />);
  O("ld", <Quote t={t} at={a("and linda wrote")} out={a("ask them to come and choose") } text="What if my children say they want everything?" who="LINDA" x={1360} y={480} size={56} />);
  O("ld2", <Order t={t} out={A.recap - 0.3} x={1380} y={480} items={[{ at: a("ask them to come and choose now"), n: "1", text: "come and choose · now" }, { at: a("one saturday with lunch"), n: "2", text: "one Saturday, with lunch" }, { at: a("take three things"), n: "3", text: "they take 3 things" }, { at: a("write them in your letter"), n: "4", text: "→ into your letter" }]} />);

  // ================= el repaso: las 11 en una hoja =================
  O("rcp", <ElevenList t={t} out={A.close - 0.3} x={1150} y={40} sc={0.82} items={RECAP.map((r, i) => ({ at: r, text: ["Start with paper that has no story.", "Decide at the door (the genkan).", "Manuals go — except safety & warranty.", "Receipts live short · ask your accountant.", "One card per person.", "One thin blue folder: a map.", "Read once more · keep ten per person.", "Give the children their childhood now.", "Decide your own diaries.", "Someday: one shelf, one date.", "“Open this first”: which 10% to keep."][i] }))} />);
  O("env2", <Hanko t={t} at={a("on the back of an envelope")} text="ON THE BACK OF AN ENVELOPE" x={1420} y={900} out={RECAP[0] + 2} size={46} rot={-3} />);

  // ================= cierre =================
  O("bvl", <BagsVsLines t={t} at={A.close} flip={a("forty-one lines and one bag")} out={a("means to me now") + 1.5} />);
  O("rem", <Swap t={t} at={a("not searching for you") - 2.6} neuAt={a("not searching for you")} out={A.tonight - 0.2} old="searching for you" neu="remembering you" y={820} />);
  O("tn", <CheckList t={t} out={a("write your letter", A.tonight) + 1.5} title="TONIGHT · ONE THING" x={1400} y={560} col={COL.red} items={[{ at: a("open that drawer", A.tonight), text: "open that drawer" }, { at: a("take out one piece of paper"), text: "one paper, no story → go" }, { at: a("tomorrow two minutes at the door"), text: "tomorrow: 2 min at the door" }, { at: a("on your next birthday write your letter"), text: "next birthday: your letter" }]} />);
  O("cm3", <CommentBox t={t} at={A.comment} typeAt={a("just one thing", A.comment)} out={a("i will choose some for my next video") + 1} text="My grandmother's sewing box" />);
  O("nxt", <NextVideo t={t} at={A.next} out={a("thank you for staying with me") } title={<>11 Japanese rules for <span style={{ color: COL.gold }}>the whole house</span></>} sub="it's right here on the screen" />);
  O("thx", <LowerThird t={t} at={a("thank you for staying with me")} out={a("now go open the drawer") } name="Sachiko" l2="THANK YOU FOR STAYING WITH ME" l2at={a("thank you for staying with me") + 0.3} />);
  O("go", <InkLine t={t} a={a("now go open the drawer")} b={z("now go open the drawer")} out={a("i will see you next week") } y={880} size={84} hot={["drawer"]} />);
  O("enso", <Enso t={t} at={a("i will see you next week")} out={END + 5} text="see you next week" />);

  return <AbsoluteFill style={{ background: "#0b0a09" }}><SvgDefs /><Base t={t} />{L}</AbsoluteFill>;
};
