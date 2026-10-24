// sgardensquirrel · EL VIDEO ENTERO (0 → fin). Un solo hilo: Sachiko ⇄ el jardín 3D ⇄ las fotos, SIEMPRE por la tinta.
// La base se arma sola desde las ventanas del avatar (avwin.json) y las fotos (shots.ts). Encima, las piezas: todas con at("frase").
// Cámara a mano virtual sobre todo el cuadro (balanceo lento, no temblor). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { PT, screenOf } from "./garden3d";
import { A, END_T, setShade } from "./tl";
import { SHOTS } from "./shots";
import { COL, Hanko, SvgDefs, Tag, BigNum, at, atEnd, ei } from "./lib";
import { Avatar, Chip, Clip, InkLine, InkPortal, LowerThird, World, WIN, Weeks } from "./ink";
import { CheckList, CommentBox, Counter, Halfway, Hourglass, NextUp, PriceTag, Subscribe, Swap, WordCard, YearFlip, Snow } from "./rest_fx";
import { AirLetter, DayClock, DayDots, GolfHole, MistakeCard, NoSign, RecipeCard, Ruler, SeasonWheel, Spoon } from "./garden_fx";

export const END = END_T;
type Pt = { x: number; y: number };
const near = (x: number, ys: number[]) => ys.some((y) => Math.abs(x - y) < 0.06);
const AV_END = WIN.map((w) => w.me), AV_START = WIN.map((w) => w.ms);
// puntos de la foto de Sachiko en el jardín (ref 1672x941 escalada a 1920x1080) por donde entra/sale la tinta
const INK_AV: Pt[] = [{ x: 1500, y: 300 }, { x: 330, y: 760 }, { x: 960, y: 900 }, { x: 1650, y: 820 }, { x: 260, y: 260 }];

const WorldOrShot: React.FC<{ t: number }> = ({ t }) => {
  const sh = SHOTS.find((x) => t >= x.a && t < x.b + 0.5);
  if (!sh) return <World t={t} />;
  const clip = <Clip k={"c_" + sh.img} img={sh.img} t={t} a={sh.a} />;
  const soft0 = !near(sh.a, AV_END), soft1 = !near(sh.b + 0.45, AV_START);
  const seed = Math.round(sh.a);
  if (t >= sh.b) return soft1 ? <><AbsoluteFill>{clip}</AbsoluteFill><InkPortal x={960} y={560} r={ei(t, sh.b, sh.b + 0.5)} seed={seed + 7}><World t={t} /></InkPortal></> : <AbsoluteFill>{clip}</AbsoluteFill>;
  if (soft0 && t < sh.a + 0.5) { const f = [{ x: 960, y: 540 }, { x: 1400, y: 420 }, { x: 520, y: 640 }][seed % 3]; return <><World t={t} /><InkPortal x={f.x} y={f.y} r={ei(t, sh.a, sh.a + 0.5)} seed={seed}>{clip}</InkPortal></>; }
  return <AbsoluteFill>{clip}</AbsoluteFill>;
};

const Base: React.FC<{ t: number }> = ({ t }) => {
  const i = WIN.findIndex((w) => t >= w.ms - 0.4 && t < w.me);
  if (i < 0) return <WorldOrShot t={t} />;
  const w = WIN[i];
  if (i === 0 && t < 0.01) return <Avatar t={t} />;
  if (t < w.ms) { const p = INK_AV[i % INK_AV.length]; return <><WorldOrShot t={t} /><InkPortal x={p.x} y={p.y} r={ei(t, w.ms - 0.4, w.ms)} seed={i + 30}><Avatar t={t} /></InkPortal></>; }
  if (t >= w.me - 0.4) { const p = [{ x: 960, y: 900 }, { x: 1500, y: 500 }, { x: 420, y: 520 }][i % 3]; return <><Avatar t={t} /><InkPortal x={p.x} y={p.y} r={ei(t, w.me - 0.4, w.me)} seed={i + 60}><WorldOrShot t={t} /></InkPortal></>; }
  return <Avatar t={t} />;
};

// tramos con piezas grandes: el mundo baja un poco la luz
setShade([[A.recipe, A.careful], [A.back, A.when], [A.how, A.honesty], [A.year, A.final], [A.list, A.final], [A.recap, A.close]]);

export const Main: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const O = (k: string, n: React.ReactNode) => L.push(<React.Fragment key={k}>{n}</React.Fragment>);
  const S = (q: [number, number, number]) => screenOf(t, q);
  const a = (ph: string, after: number) => at(ph, after - 0.5);

  // ================= GANCHO =================
  O("oct", <Chip t={t} at={a("a cold morning in october", 0)} out={A.dug + 1.5} text="OCTOBER · 7 AM" col={COL.leaf} />);
  O("holes", <Tag t={t} at={a("little holes everywhere", 0)} x={S(PT.tulips).x} y={S(PT.tulips).y} dx={140} dy={-120} text="DUG UP" sub="last weekend's bulbs" out={A.bite + 2.2} />);
  O("bite", <InkLine t={t} a={A.bite} b={atEnd("half-eaten apple")} out={A.fence} y={880} hot={["bite"]} />);
  O("notafraid", <Hanko t={t} at={a("not afraid", A.fence)} text="NOT AFRAID" x={1420} y={300} out={A.night} size={60} />);
  O("scr", <InkLine t={t} a={A.scratch} b={atEnd("marbles in your attic")} out={A.call} y={860} hot={["scratch", "marbles"]} />);
  O("20min", <Chip t={t} at={a("twenty minutes", A.call)} out={A.four} text="20 MINUTES · ONE LOOK" col={COL.indigo} />);
  O("400", <PriceTag t={t} at={A.four} out={A.never} top="ONE VISIT" big="$400" x={1440} y={420} />);
  O("lindapaid", <Tag t={t} at={A.linda} x={1100} y={700} dx={160} dy={-80} text="LINDA" sub="next door · last fall" out={A.never} />);
  O("notyen", <Hanko t={t} at={a("not one yen", A.never)} text="¥0" sub="NOT ONE YEN" x={1500} y={330} out={A.three + 0.4} size={90} />);
  O("three", <CheckList t={t} out={A.sit} title="FROM THE PANTRY" items={[{ at: A.redChili, text: "red chili" }, { at: A.plainSoap, text: "plain dish soap" }, { at: A.pepp, text: "peppermint" }]} />);
  O("items", <Tag t={t} at={A.redChili + 0.3} x={S(PT.chili).x} y={S(PT.chili).y} dx={-160} dy={-130} text="CHILI" out={A.sit} size={36} />);
  O("each", <InkLine t={t} a={a("exactly what she did", A.sit)} b={atEnd("how much and where")} out={A.last} y={880} hot={["exactly", "much", "where"]} />);
  O("lastthing", <Hanko t={t} at={A.last} text="THE LAST STEP" sub="almost nobody does it" x={1420} y={300} out={A.youKnow} size={56} />);
  O("every", <Chip t={t} at={a("every single year", A.last)} out={A.youKnow + 0.3} text="THEY COME BACK EVERY YEAR" col={COL.red} />);
  // ================= INTRO / CTA1 =================
  O("lt", <LowerThird t={t} at={A.youKnow} out={A.channel} name="SACHIKO" l2="79 · OSAKA → AMERICA, 1970" l2at={A.y1970} />);
  O("y79", <BigNum t={t} at={A.s79} text="79" x={1520} y={430} size={230} out={A.y1970} sub="YEARS OLD" />);
  O("y70", <YearFlip t={t} at={A.y1970} out={A.channel + 1} from={1946} to={1970} label="CAME TO AMERICA" />);
  O("places", <CheckList t={t} out={A.osakaHouse} title="WE GO OUTSIDE" col={COL.leaf} items={[{ at: a("the yard", A.channel), text: "the yard" }, { at: a("the garden", A.channel), text: "the garden" }, { at: a("the shed", A.channel), text: "the shed" }, { at: a("and the roof", A.channel), text: "and the roof" }]} />);
  O("osk", <Chip t={t} at={A.osakaHouse} out={A.cta1} text="OSAKA · PERSIMMON · DAIKON · STRAW" col={COL.indigo} />);
  O("smell", <InkLine t={t} a={a("i can still smell it", A.osakaHouse)} b={atEnd("i can still smell it")} out={A.cta1} y={880} />);
  O("sub1", <Subscribe t={t} at={A.subscribe1 - 0.3} press={A.subscribe1 + 0.6} out={A.question1} />);
  O("q1", <CommentBox t={t} at={A.question1} typeAt={A.question1 + 0.5} out={A.started} text="My tulips. All of them." />);
  O("q1b", <CheckList t={t} out={A.started} title="WHAT DID THEY TAKE?" x={560} y={480} items={[{ at: a("your tulips", A.question1), text: "tulips?" }, { at: a("your tomatoes", A.question1), text: "tomatoes?" }, { at: a("the bird seed", A.question1), text: "bird seed?" }]} />);
  O("read", <Hanko t={t} at={a("i read every comment", A.question1)} text="I READ EVERY ONE" x={1500} y={240} out={A.started} size={44} />);
  // ================= HISTORIA =================
  O("risu", <WordCard t={t} at={A.risu} mean={A.risu + 0.8} out={A.tanuki} word="栗鼠" en="risu · the mountain squirrel" />);
  O("thieves", <CheckList t={t} out={A.rule} title="OSAKA'S THIEVES" col={COL.indigo} items={[{ at: a("crows", A.risu), text: "crows" }, { at: a("rats", A.risu), text: "rats" }, { at: A.tanuki, text: "a tanuki (once a year)" }]} />);
  O("rule", <InkLine t={t} a={A.guest} b={atEnd("does not want to stay")} out={A.america} y={860} hot={["guest", "stay"]} />);
  O("rent", <Tag t={t} at={A.oakRental} x={S(PT.oak).x} y={S(PT.oak).y} dx={-200} dy={-60} text="FIRST HOUSE · RENTED" sub="a big oak in the back" out={A.twelve} />);
  O("12", <Counter t={t} at={A.twelve} out={A.pink} to={12} dur={0.8} label="TOMATO PLANTS" x={1500} y={420} size={220} />);
  O("onebite", <Hanko t={t} at={a("one bite", A.pink)} text="ONE BITE" sub="each one" x={1450} y={330} out={A.cried + 0.5} size={64} />);
  O("23", <BigNum t={t} at={a("i was 23", A.cried)} text="23" x={1500} y={460} size={200} out={A.letter} sub="AND FAR FROM HOME" />);
  O("2w", <Weeks t={t} at={A.twoWeeks} out={A.tin} />);
  O("air", <AirLetter t={t} at={A.blue} out={A.understand} words={[{ at: A.togarashi1, jp: "togarashi", en: "red chili" }, { at: a("soap", A.togarashi1), jp: "sekken", en: "soap" }, { at: A.hakka1 - 1.0, jp: "hakka", en: "mint" }]} line={{ at: A.closeDoor1 + 0.4, text: "…and close the door, Sachiko." }} />);
  O("last400", <InkLine t={t} a={a("it is the part that saves you", A.understand)} b={atEnd("it is the part that saves you")} out={A.knowGuest} y={880} hot={["saves"]} />);
  O("guest2", <Hanko t={t} at={A.knowGuest} text="KNOW YOUR GUEST" x={960} y={300} out={A.busy} size={70} />);
  // ================= CONOCER A LA ARDILLA =================
  O("busy", <Swap t={t} at={a("squirrel is not a bad animal", A.knowGuest)} out={A.thousands} old="BAD ANIMAL" neu="BUSY ANIMAL" neuAt={A.busy + 0.3} />);
  O("1000s", <Counter t={t} at={A.thousands} out={A.softest} from={0} to={3000} dur={1.4} label="NUTS BURIED IN ONE FALL" x={1440} y={420} size={170} />);
  O("soft", <Tag t={t} at={A.softest} x={S(PT.tulips).x} y={S(PT.tulips).y} dx={160} dy={-140} text="SOFTEST SOIL" sub="you just dug it" out={A.perfect + 1} />);
  O("perf", <InkLine t={t} a={A.perfect} b={atEnd("the perfect place")} out={A.atticSame} y={880} hot={["perfect"]} />);
  O("nest", <Tag t={t} at={A.insulation} x={S(PT.nest).x} y={S(PT.nest).y} dx={-180} dy={-110} text="SOFT, DRY, NO WIND" sub="the insulation" out={A.hotel + 1} />);
  O("hotel", <PriceTag t={t} at={A.hotel} out={A.calendar} top="HOTEL ATTIC" big="$0 / NIGHT" x={1450} y={400} />);
  O("cal", <Hanko t={t} at={A.calendar} text="IT IS THE CALENDAR" x={960} y={300} out={A.clock} size={58} />);
  O("clock", <DayClock t={t} at={A.clock} out={A.signs} marks={[{ at: A.clock, h: 12, text: "listen to the clock" }, { at: a("early in the morning", A.dayWork), h: 6.5, text: "sunrise → squirrel" }, { at: a("before dark", A.dayWork), h: 18, text: "before dark → squirrel" }, { at: A.mice - 1.2, h: 1, text: "midnight → mice, rats" }, { at: A.raccoon - 1.4, h: 2.5, text: "heavy steps → raccoon" }]} />);
  O("golf1", <GolfHole t={t} at={A.golf1} out={A.crumbs} />);
  O("hole1", <Tag t={t} at={A.signs + 1.0} x={S(PT.hole).x} y={S(PT.hole).y} dx={-200} dy={-90} text="WHERE GUTTER MEETS WOOD" out={A.golf1} size={36} />);
  O("teeth", <Chip t={t} at={a("little teeth marks", A.golf1)} out={A.gardenSigns} text="FRESH WOOD · TEETH MARKS · CRUMBS" col={COL.leaf} />);
  O("gsigns", <CheckList t={t} out={A.notebook} title="GARDEN SIGNS" items={[{ at: a("the little holes", A.gardenSigns), text: "little holes" }, { at: a("the bulbs thrown out", A.gardenSigns), text: "bulbs thrown out" }, { at: a("the tomatoes with one bite", A.gardenSigns), text: "one bite tomatoes" }, { at: a("green tomatoes", A.gardenSigns), text: "green ones on the fence" }]} />);
  O("nb", <RecipeCard t={t} out={A.rehook1} title="GARDEN NOTEBOOK" x={1440} items={[{ at: A.dateSaw, text: "date" }, { at: a("what she saw", A.dateSaw), text: "what I saw" }, { at: a("what she did", A.dateSaw), text: "what I did" }]} />);
  O("earlier", <Swap t={t} at={a("you are not faster", A.dateSaw)} out={A.rehook1} old="FASTER" neu="EARLIER" neuAt={A.earlier + 0.3} x={560} y={300} />);
  // ================= REENGANCHE 1 + AJÍ =================
  O("rh1", <Halfway t={t} at={A.rehook1} out={A.n1} done={0} />);
  O("surp", <Hanko t={t} at={A.surprised} text="THE SURPRISE: SOAP" x={1420} y={320} out={A.n1} size={52} />);
  O("n1", <BigNum t={t} at={A.n1} text="1" x={520} y={300} size={260} out={A.capsaicin} sub="TOGARASHI · RED CHILI" />);
  O("pizza", <CheckList t={t} out={A.strings} title="ANY HOT RED PEPPER" items={[{ at: a("ground cayenne", A.anyHot), text: "ground cayenne" }, { at: a("red pepper flakes", A.anyHot), text: "red pepper flakes" }]} />);
  O("shedT", <Tag t={t} at={A.strings + 0.4} x={S(PT.shed).x + 80} y={S(PT.shed).y} dx={-160} dy={-150} text="DRIED UNDER THE SHED ROOF" out={A.pestle + 1} size={36} />);
  O("cap", <WordCard t={t} at={A.capsaicin} mean={A.capsaicin + 0.9} out={A.burns + 1.5} word="CAPSAICIN" en="the heat lives here" />);
  O("nopo", <CheckList t={t} out={A.learns + 2} title="WHAT IT DOES" col={COL.leaf} items={[{ at: a("it does not hurt the animal", A.burns), text: "does not hurt" }, { at: A.noPoison1, text: "no poison" }, { at: a("it just teaches it", A.noPoison1), text: "just teaches" }]} />);
  O("birds", <Swap t={t} at={A.birds} out={A.scientists + 2} old="SQUIRREL: BURNS" neu="BIRDS: NOTHING" neuAt={A.sensors} />);
  O("sci", <Chip t={t} at={A.scientists} out={A.recipe} text="TESTED · BIRDS DON'T FEEL CHILI HEAT" col={COL.indigo} />);
  O("spray", <RecipeCard t={t} out={A.careful} title="CHILI SPRAY" items={[{ at: A.quart, n: "1 qt", text: "water (4 cups)" }, { at: A.twoTbsp, n: "2 Tbsp", text: "red pepper flakes" }, { at: A.oneTbsp, n: "or 1", text: "Tbsp ground cayenne" }, { at: A.simmer, n: "15 min", text: "simmer, tiny bubbles" }, { at: A.overnight, n: "night", text: "covered, rest" }, { at: A.filter, n: "strain", text: "coffee filter" }]} />);
  O("boil", <Hourglass t={t} at={A.fifteen} out={A.window + 1} x={480} y={460} label="15 minutes" />);
  O("win", <Chip t={t} at={A.window} out={A.overnight + 1} text="OPEN THE WINDOW" col={COL.red} />);
  O("noz", <Hanko t={t} at={A.nozzle} text="ONE FLAKE = BLOCKED NOZZLE" x={560} y={300} out={A.sprayBottle + 0.5} size={40} />);
  O("sp1", <Tag t={t} at={A.sprayBottle + 0.6} x={S(PT.table).x} y={S(PT.table).y} dx={160} dy={-150} text="+ SOAP (number two)" out={A.careful} size={36} />);
  O("safe", <CheckList t={t} out={A.husband} title="BE CAREFUL" items={[{ at: A.gloves, text: "gloves" }, { at: A.eyes, text: "never your eyes" }, { at: A.wind, text: "wind behind you" }, { at: A.children, text: "away from children" }, { at: A.writeChili, text: "write CHILI on it" }]} />);
  O("once", <InkLine t={t} a={A.husband} b={atEnd("he only did it once")} out={A.bulbsNow} y={880} hot={["once"]} />);
  O("bag", <RecipeCard t={t} out={A.badRest + 1} title="BULBS" items={[{ at: A.bag, n: "bag", text: "paper bag" }, { at: A.tbsp20, n: "1 Tbsp", text: "cayenne / 20 bulbs" }, { at: A.shake, n: "shake", text: "like fried chicken" }, { at: A.plant, n: "plant", text: "the normal way" }]} />);
  O("rest", <Hanko t={t} at={A.badRest} text="BAD RESTAURANT" x={560} y={300} out={A.line1} size={60} />);
  O("line", <Tag t={t} at={A.line1 + 0.6} x={S(PT.tulips).x - 60} y={S(PT.tulips).y + 20} dx={-180} dy={-120} text="A THIN LINE" sub="like salting rice" out={A.bamboo} />);
  O("wire", <Tag t={t} at={A.wire + 0.8} x={S(PT.tulips).x} y={S(PT.tulips).y} dx={170} dy={-140} text="CHICKEN WIRE, FLAT" sub="a stone on each corner" out={A.spring1} />);
  O("noone", <InkLine t={t} a={a("in march you can take", A.spring1)} b={atEnd("nobody sees it")} out={A.feeder1} y={880} hot={["nobody"]} />);
  O("seed", <RecipeCard t={t} out={A.funny + 1.5} title="BIRD SEED" items={[{ at: A.fourCups, n: "4 cups", text: "bird seed" }, { at: A.oil, n: "1 Tbsp", text: "vegetable oil" }, { at: A.twoCay, n: "2 Tbsp", text: "cayenne" }]} />);
  O("stick", <Chip t={t} at={A.stick} out={A.cardinals} text="THE OIL MAKES THE CHILI STICK" col={COL.gold} />);
  O("fdT", <Tag t={t} at={A.cardinals} x={S(PT.feeder).x} y={S(PT.feeder).y} dx={170} dy={-110} text="CARDINALS · CHICKADEES" sub="like nothing happened" out={A.rubs} size={36} />);
  O("rain", <InkLine t={t} a={A.rains} b={atEnd("it is in the gutter now")} out={A.nextRain + 1} y={880} hot={["gutter"]} />);
  O("2w2", <DayDots t={t} at={A.twoThree} out={A.second1} n={3} label="weeks · after every rain" every={0.4} />);
  O("teach", <Swap t={t} at={A.teach} out={A.second1} old="TWO WEEKS: TEACH" neu="AFTER: THEY REMEMBER" neuAt={a("after that they remember", A.teach)} x={960} y={300} />);
  O("fruit", <Tag t={t} at={A.leavesStems} x={S(PT.tomato).x} y={S(PT.tomato).y} dx={-190} dy={-120} text="LEAVES · STEMS · SOIL" sub="not the fruit" out={A.lesson + 1} />);
  O("wash", <Chip t={t} at={A.wash} out={A.rehook2} text="WASH IT BEFORE YOU EAT" col={COL.red} />);
  // ================= JABÓN =================
  O("rh2", <Halfway t={t} at={A.rehook2} out={A.n2} done={1} />);
  O("nc", <Hanko t={t} at={A.noCare} text="SQUIRRELS DON'T CARE ABOUT SOAP" x={960} y={280} out={A.n2} size={44} />);
  O("n2", <BigNum t={t} at={A.n2} text="2" x={520} y={300} size={260} out={A.secret} sub="PLAIN DISH SOAP" />);
  O("nob", <NoSign t={t} at={A.noBleach} out={A.laundry} text="BLEACH" />);
  O("glue", <Swap t={t} at={A.drops} out={A.keeps + 2} old="DROPS ROLL OFF" neu="SPREADS FLAT, HOLDS" neuAt={A.flat} />);
  O("glue2", <Hanko t={t} at={A.glue} text="GLUE FOR THE CHILI" x={560} y={300} out={A.back} size={56} />);
  O("tsp", <Spoon t={t} at={A.tsp} out={A.bubbles} n="1 tsp" label="IN 1 QUART · NOT MORE" />);
  O("slow", <InkLine t={t} a={A.upside} b={atEnd("two or three times")} out={A.realSpray} y={880} hot={["slowly"]} />);
  O("real", <Hanko t={t} at={A.realSpray} text="THE REAL SPRAY" x={1450} y={300} out={A.whyNot} size={60} />);
  O("test", <DayDots t={t} at={A.oneLeaf} out={A.plants} n={1} label="spray one leaf · wait one day · look" />);
  O("happy", <CheckList t={t} out={A.when} title="HAPPY PLANTS" col={COL.leaf} items={[{ at: A.plants, text: "tomatoes" }, { at: a("peppers", A.plants), text: "peppers" }, { at: a("sunflowers", A.plants), text: "sunflowers" }, { at: a("roses", A.plants), text: "roses" }, { at: A.seedlings, text: "seedlings: careful" }]} />);
  O("when", <CheckList t={t} out={A.pots} title="WHEN TO SPRAY" items={[{ at: A.morningEve, text: "morning or evening" }, { at: A.dryDay, text: "a dry day" }, { at: A.rim, text: "leaves, stems, pot rims" }, { at: A.week, text: "new bottle every week" }]} />);
  O("fridge", <Tag t={t} at={A.fridge} x={700} y={640} dx={-160} dy={-140} text="FRIDGE DOOR" sub="one week, then it smells" out={A.pots} />);
  O("pots", <InkLine t={t} a={a("a squirrel puts its hands on the rim", A.paste1)} b={atEnd("it goes away")} out={A.mistakeS} y={880} hot={["chili", "licks"]} />);
  O("squirt", <Swap t={t} at={A.squirt} out={A.degreaser} old="A BIG SQUIRT" neu="ONE TEASPOON" neuAt={A.remember} />);
  O("degr", <NoSign t={t} at={A.degreaser} out={A.cheapest + 1} text="DEGREASER" x={480} y={460} />);
  O("cheap", <Hanko t={t} at={A.cheapest} text="THE CHEAPEST ONE" x={1450} y={330} out={A.cta2} size={56} />);
  // ================= CTA2 =================
  O("half", <Halfway t={t} at={A.cta2} out={A.question2} done={2} />);
  O("sub2", <Subscribe t={t} at={A.subscribe2 - 0.3} press={A.subscribe2 + 0.8} out={A.question2 + 1} />);
  O("q2", <CheckList t={t} out={A.rehook3} title="WHERE DO THEY GO FIRST?" x={560} y={480} items={[{ at: a("the garden", A.where2), text: "the garden" }, { at: a("the bird feeder", A.where2), text: "the bird feeder" }, { at: a("or the roof", A.where2), text: "the roof" }]} />);
  O("q2c", <CommentBox t={t} at={A.where2 + 0.5} typeAt={A.where2 + 1.2} out={A.rehook3} text="The bird feeder. Every morning." />);
  O("next", <NextUp t={t} at={A.nextTime} out={A.rehook3} />);
  // ================= MENTA =================
  O("rh3", <Tag t={t} at={A.forAttic} x={S(PT.nest).x} y={S(PT.nest).y} dx={-200} dy={-100} text="FOR THE ATTIC" out={A.alone} />);
  O("alone", <Hanko t={t} at={A.alone} text="ALONE IT DOES NOT DO THE JOB" x={960} y={300} out={A.n3} size={42} />);
  O("n3", <BigNum t={t} at={A.n3} text="3" x={520} y={300} size={260} out={A.corners} sub="HAKKA · MINT" />);
  O("hk", <WordCard t={t} at={A.hokkaido} mean={A.hokkaido + 0.8} out={A.drawer + 1.5} word="薄荷" en="hakka · Hokkaido mint" />);
  O("100x", <BigNum t={t} at={A.nose} text="100×" x={1480} y={440} size={200} out={A.pharmacy} sub="A BETTER NOSE" />);
  O("pure", <CheckList t={t} out={A.how} title="YOU NEED" col={COL.leaf} items={[{ at: A.pure, text: "pure peppermint oil" }, { at: a("not the perfume", A.pure), text: "not perfume, not candy" }, { at: A.cottonBag, text: "cotton balls" }]} />);
  O("how", <RecipeCard t={t} out={A.important} title="PEPPERMINT" items={[{ at: a("put on gloves", A.how), n: "gloves", text: "first" }, { at: A.tenFifteen, n: "10–15", text: "drops per cotton ball" }, { at: A.lid, n: "lid", text: "so it won't stain" }, { at: A.place, n: "where", text: "noise, hole, edges" }, { at: A.fourFive, n: "4–5", text: "for a normal attic" }]} />);
  O("3d", <DayDots t={t} at={A.threeDays} out={A.works3 + 2} n={7} label="strong 3 days · gone in a week" />);
  O("chg", <Chip t={t} at={A.change} out={A.honesty} text="CHANGE EVERY 3–4 DAYS" col={COL.red} />);
  O("wall", <Swap t={t} at={A.notWall} out={A.rightTime} old="A WALL" neu="A MESSAGE" neuAt={A.message} />);
  O("mom", <Hanko t={t} at={A.mother} text="NOT WITH BABIES" x={1450} y={320} out={A.notWall} size={56} />);
  O("cat", <NoSign t={t} at={A.sick} out={A.dogs + 1} text="CATS" />);
  O("mochi", <Tag t={t} at={A.mochi} x={1000} y={640} dx={180} dy={-100} text="MOCHI" sub="never in the attic" out={A.realMint + 0.5} />);
  O("pot", <InkLine t={t} a={A.inPot} b={atEnd("your whole garden is mint")} out={A.crushed} y={880} hot={["pot", "mint"]} />);
  O("crush", <Tag t={t} at={A.crushed + 0.6} x={S(PT.tulips).x} y={S(PT.tulips).y} dx={170} dy={-120} text="CRUSHED MINT + CHILI" out={A.rehook4} size={36} />);
  // ================= REENGANCHE 4 · JARDÍN =================
  O("10", <PriceTag t={t} at={A.tenDollars} out={A.together} top="WHOLE SEASON" big="~$10" x={1440} y={420} />);
  O("plan", <CheckList t={t} out={A.gardenS} title="STILL TO COME" col={COL.indigo} items={[{ at: a("first in the garden", A.together), text: "the garden" }, { at: a("and then in the roof", A.together), text: "the roof" }, { at: A.fiveMist, text: "five mistakes" }, { at: a("the last step", A.fiveMist), text: "the last step" }]} />);
  O("fall", <CheckList t={t} out={A.daff} title="THE FALL PLAN" items={[{ at: A.dusted, text: "bulbs dusted red" }, { at: A.wireTop, text: "wire flat on top" }, { at: A.line2, text: "chili line after rain" }]} />);
  O("daffT", <Tag t={t} at={A.daff + 0.8} x={S(PT.tulips).x + 120} y={S(PT.tulips).y} dx={170} dy={-130} text="DAFFODILS" sub="bitter · left alone" out={A.guards + 1.5} />);
  O("guards", <InkLine t={t} a={A.guards - 2.8} b={atEnd("like a fence of guards")} out={A.garlic} y={880} hot={["guards"]} />);
  O("alliT", <Tag t={t} at={A.alliums + 0.8} x={S(PT.tulips).x - 80} y={S(PT.tulips).y - 20} dx={-170} dy={-140} text="ALLIUMS" sub="the onion family" out={A.neighbor} />);
  O("sorry", <Hanko t={t} at={A.sorryLinda} text="SORRY, LINDA" x={1450} y={320} out={A.summer} size={56} rot={5} />);
  O("glass", <Swap t={t} at={A.thirsty} out={A.dish} old="FOOD" neu="A GLASS OF WATER" neuAt={A.glass} />);
  O("dishT", <Tag t={t} at={A.dish + 0.8} x={S(PT.dish).x} y={S(PT.dish).y} dx={-200} dy={-110} text="FAR END OF THE YARD" sub="change it every day" out={A.pickEarly} />);
  O("pink", <Chip t={t} at={A.blush} out={A.persimmons} text="PICK AT THE FIRST PINK" col={COL.red} />);
  O("hosh", <WordCard t={t} at={A.hoshigaki} mean={A.hoshigaki + 0.8} out={A.third} word="干し柿" en="hoshigaki · dried persimmons" />);
  O("tom3", <CheckList t={t} out={A.feederS} title="SUMMER: 3 TOGETHER" col={COL.leaf} items={[{ at: a("water dish", A.threeTogether), text: "water dish" }, { at: a("early picking", A.threeTogether), text: "early picking" }, { at: a("and the spray", A.threeTogether), text: "the spray" }]} />);
  O("two", <Counter t={t} at={A.two} out={A.feederS} from={100} to={2} dur={1.2} label="TOMATOES LOST · OUT OF 100" x={560} y={420} size={200} />);
  O("8ft", <Ruler t={t} at={A.eightFeet} out={A.pole} a={S([PT.oak[0] - 1.5, 3.2, PT.oak[2]])} b={S(PT.feeder)} label="8 FT JUMP" />);
  O("pole", <Tag t={t} at={A.pole + 0.6} x={S([PT.feeder[0], 0.9, PT.feeder[2]]).x} y={S([PT.feeder[0], 0.9, PT.feeder[2]]).y} dx={170} dy={-60} text="METAL POLE" sub="10 ft from any branch" out={A.riceSacks} />);
  // ================= EL TECHO =================
  O("400r", <PriceTag t={t} at={A.where400} out={A.slowly + 2} top="THE ROOF" big="$400" x={1440} y={420} />);
  O("door", <Hanko t={t} at={A.findDoor} text="FIND THE DOOR" x={960} y={300} out={A.walk} size={64} />);
  O("look", <CheckList t={t} out={A.roundHole} title="LOOK UP AT" items={[{ at: A.cornersR, text: "roof corners" }, { at: a("where the gutter is", A.cornersR), text: "the gutter edge" }, { at: A.vents, text: "the vents" }, { at: A.chimneyMeets, text: "the chimney" }, { at: A.branchTouches, text: "tree branches" }]} />);
  O("golf2", <GolfHole t={t} at={A.roundHole + 0.6} out={A.stain} x={560} y={480} />);
  O("holeT", <Tag t={t} at={A.chewed} x={S(PT.hole).x} y={S(PT.hole).y} dx={-200} dy={-80} text="CHEWED EDGES" sub="dark stain around it" out={A.watch} />);
  O("30m", <Hourglass t={t} at={A.watch} out={A.patient + 1} label="half an hour" />);
  O("pat", <InkLine t={t} a={a("the animal shows you its door", A.goesIn)} b={atEnd("if you are patient")} out={A.beforeClose} y={880} hot={["door", "patient"]} />);
  O("bq", <Hanko t={t} at={A.babiesQ} text="BABIES INSIDE?" x={960} y={300} out={A.twoTimes + 1} size={70} />);
  O("yr", <SeasonWheel t={t} at={A.twoTimes} out={A.chewNew} hi={[A.twoTimes + 0.5, A.febMar - 1.4, A.febMar, A.augSep - 1.4, A.augSep]} />);
  O("bill", <InkLine t={t} a={A.chewNew} b={atEnd("a real repair bill")} out={A.babiesStay} y={880} hot={["new", "bill"]} />);
  O("sq", <Tag t={t} at={A.squeaks} x={S(PT.nest).x} y={S(PT.nest).y} dx={-200} dy={-100} text="HIGH SQUEAKS" sub="like tiny birds = babies" out={A.wait + 1} />);
  O("wait", <Hanko t={t} at={A.wait} text="THEN YOU WAIT" x={1450} y={300} out={A.tenTwelve} size={58} />);
  O("1012", <BigNum t={t} at={A.tenTwelve} text="10–12" x={1450} y={440} size={180} out={A.mintNest} sub="WEEKS OLD, THEY LEAVE" />);
  O("radio", <Tag t={t} at={A.radio + 0.5} x={S(PT.radio).x} y={S(PT.radio).y} dx={-190} dy={-110} text="TALK RADIO, QUIETLY" out={A.carry} />);
  O("carry", <InkLine t={t} a={A.carry - 2.2} b={atEnd("to a quieter place")} out={A.doorS} y={880} hot={["babies", "quieter"]} />);
  O("cl", <Hanko t={t} at={A.lastLine} text="CLOSE THE DOOR LAST" x={960} y={300} out={A.sure} size={64} />);
  O("ow", <Tag t={t} at={A.oneway + 0.4} x={S(PT.hole).x} y={S(PT.hole).y} dx={-210} dy={-90} text="ONE-WAY DOOR" sub="out yes · back in no" out={A.twoThreeDays + 1} />);
  O("23d", <DayDots t={t} at={A.twoThreeDays} out={A.forGood} n={3} label="days · until it is quiet" />);
  O("foam", <NoSign t={t} at={A.foam} out={A.hcloth + 1} text="FOAM" x={480} y={460} />);
  O("seal", <RecipeCard t={t} out={A.touch} title="SEAL IT" items={[{ at: A.hcloth, n: "metal", text: "hardware cloth" }, { at: A.halfInch, n: "½ in", text: "squares" }, { at: A.twoInches, n: "+2 in", text: "past the hole, every side" }, { at: A.screws, n: "fix", text: "screws + washers" }, { at: A.pretty, n: "paint", text: "the color of the house" }]} />);
  O("paste", <RecipeCard t={t} out={A.hollow + 2} title="CHILI PASTE" w={640} items={[{ at: a("a tablespoon of cayenne", A.paste), n: "1 Tbsp", text: "cayenne" }, { at: A.vaseline, n: "+", text: "petroleum jelly or oil" }]} />);
  O("fire", <Hanko t={t} at={A.fire} text="A MOUTHFUL OF FIRE" x={560} y={300} out={A.hollow + 1} size={50} />);
  O("8b", <Ruler t={t} at={A.eight} out={A.ladder} a={S([PT.oak[0] - 1.2, 3.9, PT.oak[2] - 0.8])} b={S(PT.branch)} label="< 8 FT? CUT IT" col={COL.red} />);
  O("ladder", <InkLine t={t} a={A.ladder} b={atEnd("at our age please")} out={A.wrist} y={880} hot={["alone"]} />);
  O("help", <Hanko t={t} at={A.help} text="ASK FOR HELP" x={1450} y={300} out={A.otherDoors} size={64} />);
  O("other", <CheckList t={t} out={A.yours} title="THE OTHER DOORS" items={[{ at: A.cap, text: "chimney cap with mesh" }, { at: A.ventsC, text: "roof & side vents" }, { at: A.gaps, text: "gutter gaps" }]} />);
  O("thumb", <Chip t={t} at={A.thumb} out={A.yours + 1} text="BIGGER THAN YOUR THUMB = A DOOR" col={COL.red} />);
  O("capT", <Tag t={t} at={A.cap + 0.6} x={S(PT.chimney).x} y={S(PT.chimney).y} dx={170} dy={-80} text="CAP + MESH" out={A.ventsC + 1} size={36} />);
  // ================= 5 ERRORES =================
  O("5m", <BigNum t={t} at={A.rehook5} text="5" x={1450} y={440} size={260} out={A.m1} sub="MISTAKES" />);
  O("m1", <MistakeCard t={t} at={A.m1} out={A.m2} n={1} text="doing it once" />);
  O("allday", <InkLine t={t} a={A.allDay} b={atEnd("and so do i")} out={A.m2} y={880} hot={["all", "day"]} />);
  O("m2", <MistakeCard t={t} at={A.m2} out={A.m3} n={2} text="feeding them by accident" />);
  O("food", <CheckList t={t} out={A.m3} title="TAKE AWAY THE DINNER" x={1440} y={560} items={[{ at: A.catFood, text: "cat food on the porch" }, { at: A.fallen, text: "seed under the feeder" }, { at: A.compost, text: "open compost" }, { at: A.apples, text: "fallen fruit" }]} />);
  O("m3", <MistakeCard t={t} at={A.m3} out={A.m4} n={3} text="too much soap" />);
  O("fault", <Hanko t={t} at={A.notFault} text="NOT YOUR FAULT" x={1450} y={400} out={A.m4} size={56} />);
  O("m4", <MistakeCard t={t} at={A.m4} out={A.sixWeeks + 4} n={4} text="closing it too early" />);
  O("lindaT", <LowerThird t={t} at={A.lindaM} out={A.babiesIn} name="LINDA'S MISTAKE" l2="March · a board nailed the same afternoon" l2at={A.board} />);
  O("babies", <Hanko t={t} at={A.babiesIn} text="BABIES INSIDE" x={1450} y={300} out={A.crying + 2} size={60} />);
  O("400m", <PriceTag t={t} at={A.four2} out={A.sixWeeks + 4} top="OPEN THE WALL" big="$400" x={1440} y={460} />);
  O("6w", <Weeks t={t} at={A.sixWeeks} out={A.m5} x={480} y={520} />);
  O("m5", <MistakeCard t={t} at={A.m5} out={A.neverDid} n={5} text="fixing the hole, not the bridge" />);
  O("basket", <InkLine t={t} a={A.basket} b={atEnd("a second hole close by")} out={A.neverDid} y={880} hot={["basket", "second"]} />);
  // ================= LO QUE NUNCA HIZO =================
  O("poison", <NoSign t={t} at={A.poison} out={A.owl} text="POISON" />);
  O("chain", <CheckList t={t} out={A.owl + 1} title="POISON GOES ON" x={560} y={500} items={[{ at: a("into your wall", A.poison), text: "dies in your wall" }, { at: A.smell, text: "weeks of smell" }, { at: A.hawk, text: "the hawk, the owl, the cat" }]} />);
  O("owl", <InkLine t={t} a={A.owl - 0.6} b={atEnd("for no pay")} out={A.trapped} y={880} hot={["owl"]} />);
  O("trap", <NoSign t={t} at={A.trapped} out={A.village + 2} text="TRAP & MOVE" />);
  O("village", <InkLine t={t} a={a("do not carry your problem", A.survive)} b={atEnd("goes home by itself")} out={A.commentsS} y={880} hot={["problem", "home"]} />);
  // ================= COMENTARIOS =================
  O("cm1", <CommentBox t={t} at={A.margaret} typeAt={A.margaret + 0.4} out={A.robert} text="Margaret: will the chili hurt my dog?" />);
  O("sneeze", <Chip t={t} at={A.sneeze} out={A.robert} text="A SNEEZE, AND A LESSON" col={COL.leaf} />);
  O("cm2", <CommentBox t={t} at={A.robert} typeAt={A.robert + 0.4} out={A.susan} text="Robert: does it hurt the birds?" />);
  O("cm3", <CommentBox t={t} at={A.susan} typeAt={A.susan + 0.4} out={A.year} text="Susan: how long until it works?" />);
  O("1w", <DayDots t={t} at={a("in the garden usually", A.susan)} out={A.year} n={2} label="weeks garden · <1 week attic" every={0.4} />);
  // ================= EL AÑO =================
  O("pic", <Chip t={t} at={A.picture} out={A.fall + 1} text="TAKE A PICTURE OF THE SCREEN" col={COL.gold} />);
  O("wheel", <SeasonWheel t={t} at={A.year} out={A.list} hi={[A.fall, A.winter, A.spring, A.summerS]} x={360} y={540} R={230} />);
  O("sFall", <CheckList t={t} out={A.winter} title="FALL · THE GARDEN" x={1380} y={520} col="#c9562f" items={[{ at: a("bulbs dusted", A.fall), text: "bulbs dusted red" }, { at: a("chicken wire", A.fall), text: "wire on top" }, { at: a("bird seed with oil", A.fall), text: "seed + oil + cayenne" }, { at: a("walk around the house once", A.fall), text: "look at the roof" }]} />);
  O("sWin", <CheckList t={t} out={A.spring} title="WINTER · LISTEN" x={1380} y={520} col="#6f8ca6" items={[{ at: A.listen, text: "listen to the ceiling" }, { at: a("check the outside for a hole", A.listen), text: "find the hole" }, { at: a("one-way door right away", A.listen), text: "close before February" }]} />);
  O("best", <Hanko t={t} at={A.bestTime} text="BEFORE FEBRUARY" x={1380} y={180} out={A.spring} size={50} />);
  O("snow", <Snow t={t} at={A.winter} out={A.spring} />);
  O("sSpr", <CheckList t={t} out={A.summerS} title="SPRING · CAREFUL" x={1380} y={520} col="#7fae4c" items={[{ at: a("if you hear babies wait", A.spring), text: "babies? wait" }, { at: a("when the attic is quiet", A.spring), text: "quiet 3 days → door" }, { at: a("and cut the tree branches", A.spring), text: "cut the branches" }]} />);
  O("sSum", <CheckList t={t} out={A.septAgain} title="SUMMER · VEGETABLES" x={1380} y={520} col={COL.gold} items={[{ at: a("the water dish", A.summerS), text: "water dish" }, { at: a("pick the tomatoes", A.summerS), text: "pick at first pink" }, { at: a("the chili and soap spray", A.summerS), text: "spray after rain" }, { at: A.endAug, text: "listen to the roof again" }]} />);
  O("4j", <InkLine t={t} a={A.fourJobs} b={atEnd("no man no truck")} out={A.list} y={880} hot={["four", "no"]} />);
  // ================= LA LISTA =================
  O("lSpray", <RecipeCard t={t} out={A.forBulbs} title="CHILI SPRAY" x={1400} items={[{ at: a("1 quart of water", A.forSpray), n: "1 qt", text: "water" }, { at: a("2 tablespoons", A.forSpray), n: "2 Tbsp", text: "flakes (or 1 cayenne)" }, { at: a("simmer 15 minutes", A.forSpray), n: "15 min", text: "simmer, rest overnight" }, { at: a("1 teaspoon of plain dish soap", A.forSpray), n: "1 tsp", text: "plain dish soap" }, { at: a("new bottle every week", A.forSpray), n: "7 days", text: "fridge door" }]} />);
  O("lBulb", <RecipeCard t={t} out={A.forSeed} title="BULBS" x={1400} items={[{ at: A.forBulbs + 0.6, n: "1 Tbsp", text: "cayenne / 20 bulbs" }, { at: a("shake", A.forBulbs), n: "shake", text: "plant" }, { at: a("chicken wire flat", A.forBulbs), n: "wire", text: "stones on the corners" }]} />);
  O("lSeed", <RecipeCard t={t} out={A.forAttic2} title="BIRD SEED" x={1400} items={[{ at: a("4 cups of seed", A.forSeed), n: "4 cups", text: "seed" }, { at: a("1 tablespoon of vegetable oil", A.forSeed), n: "1 Tbsp", text: "oil" }, { at: a("2 tablespoons of cayenne", A.forSeed), n: "2 Tbsp", text: "cayenne" }]} />);
  O("lAtt", <RecipeCard t={t} out={A.forDoor} title="ATTIC" x={1400} items={[{ at: a("10 to 15 drops", A.forAttic2), n: "10–15", text: "drops per ball" }, { at: a("four or five cotton balls", A.forAttic2), n: "4–5", text: "cotton balls" }, { at: a("changed every three", A.forAttic2), n: "3–4 d", text: "change them" }, { at: a("never where a cat", A.forAttic2), n: "never", text: "where a cat can reach" }]} />);
  O("lDoor", <RecipeCard t={t} out={A.final} title="CLOSE THE DOOR" x={1400} items={[{ at: a("find the hole", A.forDoor), n: "find", text: "golf-ball hole" }, { at: a("listen for babies", A.forDoor), n: "listen", text: "babies? wait" }, { at: a("one-way door for two", A.forDoor), n: "2–3 d", text: "one-way door" }, { at: a("then hardware cloth", A.forDoor), n: "½ in", text: "mesh, +2 in, screws" }, { at: a("cut every branch", A.forDoor), n: "8 ft", text: "cut the branches" }]} />);
  // ================= EL FINAL =================
  O("nob2", <Hanko t={t} at={A.nobody} text="THE STEP NOBODY DOES" x={960} y={300} out={A.closeLast + 0.3} size={60} />);
  O("cdl", <InkLine t={t} a={A.closeLast} b={atEnd("close the door last")} out={A.older} y={880} size={96} hot={["last"]} />);
  O("first", <Swap t={t} at={A.first} out={A.uncomfortable} old="CLOSE THE DOOR FIRST" neu="= LOCK THE PROBLEM IN" neuAt={A.lock} />);
  O("order", <CheckList t={t} out={A.neverFight + 2} title="MY MOTHER'S ORDER" items={[{ at: A.uncomfortable, text: "1 · make it uncomfortable" }, { at: A.letGuest, text: "2 · let the guest leave" }, { at: A.empty, text: "3 · then close the door" }]} />);
  O("dec", <Chip t={t} at={A.december} out={A.everyClosed} text="EVERY DECEMBER · TEN MINUTES · ONE CUP OF TEA" col={COL.indigo} />);
  O("10m", <Hourglass t={t} at={A.tenMin} out={A.everyClosed + 1} label="ten minutes" />);
  O("belong", <InkLine t={t} a={A.everyClosed} b={atEnd("where they belong")} out={A.recap} y={880} hot={["closed", "belong"]} />);
  // ================= REPASO + CIERRE =================
  O("recap", <CheckList t={t} out={A.close} title="ONE MORE TIME" items={[{ at: A.rChili, text: "chili: bad food" }, { at: A.rSoap, text: "1 tsp soap: it stays" }, { at: A.rMint, text: "mint, every 3 days" }, { at: A.rDaff, text: "daffodils & onions" }, { at: A.rWater, text: "water dish, early tomatoes" }, { at: A.rNo, text: "no poison, no traps" }, { at: A.rClose, text: "close the door LAST" }]} />);
  O("91", <BigNum t={t} at={A.ninetyOne} text="91" x={1480} y={440} size={200} out={A.laughed + 1} sub="OSAKA" />);
  O("od", <InkLine t={t} a={a("the animal is not the problem", A.laughed)} b={atEnd("the open door is the problem")} out={A.stillLetter} y={880} hot={["open", "door"]} />);
  O("air2", <AirLetter t={t} at={A.stillLetter} out={A.subscribe3} words={[{ at: A.stillLetter + 0.6, jp: "togarashi", en: "red chili" }, { at: A.stillLetter + 1.0, jp: "sekken", en: "soap" }, { at: A.stillLetter + 1.4, jp: "hakka", en: "mint" }]} line={{ at: A.threeWords, text: "…and close the door last." }} />);
  O("sub3", <Subscribe t={t} at={A.subscribe3 + 0.4} press={A.subscribe3 + 1.4} out={A.where3} />);
  O("q3", <CheckList t={t} out={A.thanks} title="WHERE DO YOURS GO FIRST?" x={560} y={480} items={[{ at: a("the garden", A.where3), text: "the garden" }, { at: a("the feeder", A.where3), text: "the feeder" }, { at: a("or the roof", A.where3), text: "the roof" }]} />);
  O("tea", <Hanko t={t} at={A.teaTomorrow} text="WITH MY TEA, TOMORROW" x={1450} y={300} out={A.thanks} size={46} />);
  O("bye", <InkLine t={t} a={A.closeLast2} b={atEnd("close the door last", A.closeLast2 - 0.5)} out={END_T + 5} y={880} size={92} hot={["last"]} />);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SvgDefs />
      <CamaraMano intensidad={0.8}>
        <Base t={t} />
        {L}
      </CamaraMano>
    </AbsoluteFill>
  );
};
