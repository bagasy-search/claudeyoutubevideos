// sgardenwasps · EL VIDEO ENTERO (0 → END). Un solo hilo: Sachiko en su porche ⇄ el patio 3D (una cámara, sin cortes) ⇄ fotos, SIEMPRE por la tinta.
// La base se arma sola desde las ventanas del avatar (avwin.json); las fotos (shots.ts) entran por la tinta desde un punto del mundo.
// Encima, las piezas de cada frase, todas con at("frase"). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PT, screenOf } from "./garden3d";
import { A } from "./tl";
import { COL, Hanko, SvgDefs, Tag, BigNum, at, atEnd, ei } from "./lib";
import { AVP, Avatar, Chip, Clip, Desc, InkLine, InkPortal, LowerThird, World, WIN, BrushStrike } from "./ink";
import { CheckList, CommentBox, Counter, Enso, Hourglass, NextUp, Order, PriceTag, Said, Subscribe, Swap } from "./rest_fx";
import { SHOTS } from "./shots";

export const END = 1967.4;
type Pt = { x: number; y: number };
const AW = WIN;

const near = (x: number, ys: number[]) => ys.some((y) => Math.abs(x - y) < 0.06);
const AV_END = AW.map((w) => w.me), AV_START = AW.map((w) => w.ms);
const INK_AV = [AVP.tree, AVP.shed, AVP.beds, AVP.bench, AVP.door];
const FROM: Pt[] = [{ x: 960, y: 540 }, { x: 1500, y: 420 }, { x: 520, y: 640 }, { x: 1200, y: 760 }, { x: 760, y: 360 }];

const WorldOrShot: React.FC<{ t: number }> = ({ t }) => {
  const j = SHOTS.findIndex((x) => t >= x.a && t < x.b + 0.5);
  if (j < 0) return <World t={t} />;
  const sh = SHOTS[j];
  const clip = <Clip k={"x_" + sh.img} img={sh.img} t={t} a={sh.a} />;
  const soft0 = !near(sh.a, AV_END), soft1 = !near(sh.b, AV_START);
  if (t >= sh.b) return soft1 ? <><AbsoluteFill>{clip}</AbsoluteFill><InkPortal x={960} y={560} r={ei(t, sh.b, sh.b + 0.5)} seed={Math.round(sh.a) + 7}><World t={t} /></InkPortal></> : <AbsoluteFill>{clip}</AbsoluteFill>;
  if (soft0 && t < sh.a + 0.5) { const f = FROM[j % FROM.length]; return <><World t={t} /><InkPortal x={f.x} y={f.y} r={ei(t, sh.a, sh.a + 0.5)} seed={Math.round(sh.a)}>{clip}</InkPortal></>; }
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

export const Main: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const O = (k: string, n: React.ReactNode) => L.push(<React.Fragment key={k}>{n}</React.Fragment>);
  const nest = screenOf(t, PT.nest);
  // rótulo pegado a un punto del patio (sólo si el punto cae en cuadro)
  const T = (k: string, a: number, out: number, p: Pt, text: string, sub?: string, dx = 160, dy = -120, col: string = COL.ink) => {
    if (AW.some((w) => t > w.ms - 0.6 && t < w.me + 0.3)) return;
    if (p.x > 60 && p.x < 1860 && p.y > 60 && p.y < 1020) O(k, <Tag t={t} at={a} out={out} x={p.x} y={p.y} dx={dx} dy={dy} text={text} sub={sub} col={col} />);
  };

  // ---------- HOOK · vos estás ahí ----------
  O("pov", <Chip t={t} at={0.4} out={at("you hear it") - 0.2} text="YOUR BACK PORCH · A SUMMER MORNING" col={COL.gold} />);
  O("bz", <Hanko t={t} at={at("that dry little buzz")} text="bzzz…" x={1460} y={330} out={at("you look up")} size={80} rot={-8} />);
  T("lem", at("the size of a lemon"), at("your heart jumps"), nest, "SIZE OF A LEMON", "and 10 wasps on it");
  O("who", <InkLine t={t} a={at("who do i call")} b={atEnd("who do i call")} out={at("last summer my neighbor") - 0.1} y={860} size={96} hot={["call"]} />);
  O("400", <PriceTag t={t} at={at("asked her")} out={at("my mother kept wasps") - 0.2} top="10 MINUTES OF SPRAY" big="$400" />);
  O("yen", <BigNum t={t} at={at("never paid anyone")} text="¥0" sub="60 YEARS · NOT ONE YEN" x={1420} y={460} size={220} out={at("she used three things") - 0.1} />);
  O("three", <CheckList t={t} out={at("come sit with me") - 0.2} title="3 THINGS FROM THE KITCHEN" items={[
    { at: at("a bottle of soapy water"), text: "a bottle of soapy water" }, { at: at("a small jar of cloves"), text: "a small jar of cloves" }, { at: at("and a brown paper bag"), text: "a brown paper bag" }]} />);
  O("np", <Hanko t={t} at={at("no poison")} text="NO POISON" x={1450} y={250} out={at("come sit with me")} size={70} />);
  O("third", <InkLine t={t} a={at("the third one is the one")} b={atEnd("almost nobody does")} out={A.notYou - 0.2} y={880} size={70} hot={["nobody"]} />);

  // ---------- no es tu culpa ----------
  O("dirty", <Said t={t} at={at("it is not because your house is dirty")} out={at("it was never you") + 1.4} text="My house is dirty" strike={at("it was never you")} x={960} y={820} />);
  O("why", <CheckList t={t} out={at("and every one of those reasons") - 0.1} title="WHY SHE PICKED YOUR PORCH" col={COL.indigo} items={[
    { at: at("it is dry"), text: "it is dry" }, { at: at("it is high"), text: "it is high" }, { at: at("it is quiet"), text: "it is quiet" }, { at: at("nobody chased her away in april"), text: "nobody chased her in April" }]} />);
  O("coffee", <InkLine t={t} a={at("costs less than a cup of coffee")} b={atEnd("costs less than a cup of coffee")} out={A.promise - 0.2} y={880} size={74} hot={["less"]} />);

  // ---------- promesa ----------
  O("pr", <Order t={t} out={at("quick while i have you") - 0.3} x={1400} y={480} items={[
    { at: at("with the exact measures"), n: "1", text: "the exact measures" }, { at: at("where the cloves go"), n: "2", text: "where the cloves go" },
    { at: at("how to fold the paper bag"), n: "3", text: "the paper bag + the month" }, { at: at("the five mistakes"), n: "5", text: "mistakes that make them angry" },
    { at: at("the whole year of"), n: "12", text: "months of her routine" }, { at: at("the honest part"), n: "!", text: "when to pay the $400", dim: true }]} />);

  // ---------- CTA 1 ----------
  O("desc", <Desc t={t} at={at("i wrote all three things in the description")} out={at("and if you like the old ways") - 0.1} />);
  O("sub1", <Subscribe t={t} at={at("please subscribe")} press={at("press the little bell")} out={at("this is my garden channel") + 2.5} />);
  O("gc", <Chip t={t} at={at("this is my garden channel")} out={at("now back to the wasps")} text="THE YARD · THE PORCH · THE SHED · THE GARAGE" col={COL.leaf} />);

  // ---------- Osaka ----------
  O("lt", <LowerThird t={t} at={at("you know me")} out={at("behind our small wooden house") - 0.3} name="SACHIKO" l2="my mother's garden ways · Osaka" l2at={at("you know me") + 0.6} />);
  O("bed", <Chip t={t} at={at("a yard the size")} out={at("a persimmon tree") + 2.4} text="OSAKA · A YARD THE SIZE OF A BEDSHEET" col={COL.indigo} />);
  T("tr", at("a persimmon tree"), at("three rows of daikon") + 1.8, screenOf(t, PT.tree), "THE PERSIMMON TREE");
  T("shd", at("a little wooden shed"), at("the shed had a deep roof") + 3, screenOf(t, PT.shed), "FATHER'S SHED", "bicycle and tools", -260, -140);
  T("roof", at("hung out over the door"), at("every spring under that roof") + 3, nest, "UNDER THIS ROOF", "every spring", 140, 160, COL.red);
  O("ash", <BigNum t={t} at={at("ashinaga bachi")} text="足長蜂" sub="ASHINAGABACHI · THE LONG-LEGGED BEE" x={1380} y={440} size={170} out={at("you see them hanging") + 2} />);
  O("suz", <BigNum t={t} at={at("suzume bachi")} text="雀蜂" sub="SUZUMEBACHI · THE GIANT HORNET" x={1380} y={440} size={170} out={at("to walk away slowly") + 1} col={COL.red} />);
  O("resp", <Hanko t={t} at={at("so my mother respected wasps")} text="RESPECT" x={1440} y={300} out={at("she said a wasp") + 0.5} size={72} />);
  O("farm", <InkLine t={t} a={at("she said a wasp")} b={at("she said a wasp") + 3.2} out={at("she wanted them at the back") - 0.2} y={880} size={66} hot={["farmer", "caterpillars"]} />);
  O("back", <Swap t={t} at={at("she wanted them at the back")} neuAt={at("not over the door")} out={at("far from the door") + 2} old="wasps gone forever" neu="wasps far from the door" y={800} />);

  // ---------- el año de un avispero ----------
  O("y1", <Hanko t={t} at={A.year} text="ONE YEAR" sub="a nest lives once" x={1440} y={300} out={A.year + 5} size={80} />);
  O("q", <Chip t={t} at={at("the queens leave in the fall")} out={A.spring1 - 0.3} text="FALL → ONLY THE QUEENS SURVIVE" col={COL.indigo} />);
  T("crk", at("the queens leave in the fall") + 1.5, A.spring1 - 0.4, screenOf(t, PT.crack), "A QUEEN SLEEPS HERE", "all winter", 160, -120);
  O("sp", <Chip t={t} at={A.spring1} out={A.june - 0.3} text="SPRING · ONE QUEEN, ALONE" col={COL.leaf} />);
  T("thim", at("she builds a tiny nest"), A.june - 0.3, nest, "SIZE OF A THIMBLE", "one queen · a few cells", 140, 150);
  O("jun", <Chip t={t} at={A.june} out={A.late - 0.2} text="JUNE · HER FIRST DAUGHTERS" col={COL.gold} />);
  O("aug", <Counter t={t} at={A.late} out={A.picture - 0.2} from={1} to={200} dur={2.2} label="WASPS BY LATE AUGUST" x={1420} y={430} size={230} />);
  O("pic", <InkLine t={t} a={A.picture} b={atEnd("so remember this picture") + 4} out={A.one - 0.3} y={880} size={62} hot={["april", "spring"]} />);

  // ---------- Nº 1 · agua con jabón ----------
  O("n1", <Hanko t={t} at={A.one} text="Nº 1" sub="SOAPY WATER" x={1420} y={330} out={A.one + 4.5} size={110} />);
  O("brth", <InkLine t={t} a={at("a wasp does not breathe")} b={at("a wasp does not breathe") + 4} out={at("a wasp does not breathe") + 6} y={880} size={66} hot={["breathe", "soap"]} />);
  O("m1", <CheckList t={t} out={at("use a spray bottle") + 1} title="THE MEASURE" items={[
    { at: at("plain dish soap"), text: "plain dish soap" }, { at: at("the measure two tablespoons"), text: "2 tablespoons" }, { at: at("quart of water", 395), text: "in 1 quart of water" }]} />);
  T("bot", at("use a spray bottle"), at("if the nest is a little higher") - 0.2, screenOf(t, PT.bottle), "STRAIGHT STREAM", "not mist", 160, -130);
  O("ev", <Hourglass t={t} at={A.evening} out={at("cold wasps cannot fly well") + 4} label="wait for dusk" />);
  O("dk", <Chip t={t} at={at("cold wasps cannot fly well")} out={at("she did it like this")} text="DUSK · ALL HOME · TOO COLD TO FLY" col={COL.indigo} />);
  O("gear", <CheckList t={t} out={at("you stand to the side") - 0.2} title="HOW SHE DRESSED" col={COL.indigo} items={[
    { at: at("long sleeves"), text: "long sleeves" }, { at: at("hat", 470), text: "a hat" }, { at: at("gloves", 470), text: "gloves" }]} />);
  O("red", <Hanko t={t} at={A.red} text="RED LIGHT" sub="they cannot see red" x={1420} y={320} out={A.red + 6} size={70} rot={5} />);
  O("side", <Chip t={t} at={at("you stand to the side")} out={A.spray} text="STAND TO THE SIDE · NEVER UNDER IT" col={COL.red} />);
  T("soak", A.spray + 0.6, A.walk, nest, "SOAK IT", "until it drips", -280, 120, COL.red);
  O("calm", <InkLine t={t} a={A.walk} b={atEnd("then walk away calmly")} out={A.next - 0.2} y={880} size={84} hot={["calmly"]} />);
  O("nxt", <Chip t={t} at={A.next} out={A.wash - 0.2} text="THE NEXT EVENING" col={COL.indigo} />);
  O("rent", <InkLine t={t} a={at("now the room is not for rent")} b={atEnd("now the room is not for rent")} out={A.size - 0.2} y={880} size={84} hot={["rent"]} />);
  O("fist", <Swap t={t} at={A.size} neuAt={at("if the nest is bigger than your fist")} out={A.rehook1 - 0.3} old="any nest, any size" neu="smaller than your fist" y={820} />);

  // ---------- re-gancho 1 → Nº 2 ----------
  O("rh1", <InkLine t={t} a={A.rehook1} b={A.rehook1 + 5} out={A.two - 0.3} y={880} size={60} hot={["spice", "drawer", "queen"]} />);
  O("n2", <Hanko t={t} at={A.two} text="Nº 2" sub="CLOVES" x={1420} y={330} out={A.two + 4.5} size={110} />);
  O("sci", <Chip t={t} at={at("some years ago scientists")} out={at("my mother did not need a scientist")} text="CLOVE OIL · EUGENOL · WASPS STAY AWAY" col={COL.gold} />);
  O("bagc", <CheckList t={t} out={A.water - 0.2} title="WAY 1 · THE LITTLE BAG" items={[
    { at: A.bagC, text: "1 tbsp crushed cloves" }, { at: at("cloth", A.bagC), text: "in a cloth bag" }, { at: A.hang, text: "one in each corner" }, { at: at("every two weeks squeeze"), text: "squeeze every 2 weeks" }]} />);
  T("sach", A.hang + 0.5, A.water - 0.3, screenOf(t, PT.sachet), "ONE IN EACH CORNER", undefined, 150, -120);
  O("cw", <CheckList t={t} out={A.lemon - 0.4} title="WAY 2 · CLOVE WATER" col={COL.indigo} items={[
    { at: A.water + 1.5, text: "2 tbsp cloves · 2 cups water" }, { at: A.boil, text: "simmer 15 minutes" }, { at: A.pour, text: "+ 1 tsp soap · spray bottle" },
    { at: at("in spring once a week spray"), text: "spray once a week" }, { at: at("keep it in the refrigerator"), text: "fridge · new every 2 weeks" }]} />);
  O("lem", <Counter t={t} at={A.lemon + 1} out={at("it is not magic") - 0.2} from={0} to={12} dur={1.6} label="CLOVES IN HALF A LEMON" x={1420} y={430} size={230} />);
  O("hc", <Swap t={t} at={A.honestC} neuAt={at("the clove is for the spring")} out={at("before i show you number three") - 0.3} old="cloves kill the nest" neu="cloves are for spring" y={820} />);
  O("rule", <InkLine t={t} a={at("my mother said soap is for this year")} b={atEnd("my mother said soap is for this year") + 2.2} out={at("before i show you number three") - 0.3} y={300} size={70} hot={["soap", "clove"]} />);

  // ---------- CTA del medio ----------
  O("mid", <CommentBox t={t} at={at("the mailbox the grill")} typeAt={at("the mailbox the grill") + 0.5} out={A.three3 - 0.3} text="under the grill lid!" />);

  // ---------- Nº 3 · la bolsa de papel ----------
  O("n3", <Hanko t={t} at={A.three3} text="Nº 3" sub="A PAPER BAG" x={1420} y={330} out={A.three3 + 4.5} size={110} />);
  T("rice", A.hungShed, A.hungShed + 5, screenOf(t, PT.bag2), "THE OLD RICE BAG", undefined, -260, -120);
  O("fake", <Hanko t={t} at={at("a fake nest")} text="A FAKE NEST" x={1440} y={300} out={at("a fake nest") + 4} size={78} rot={5} />);
  O("idea", <InkLine t={t} a={at("she looks for an empty room")} b={at("she looks for an empty room") + 4} out={at("now i want to be honest") - 0.2} y={880} size={66} hot={["empty", "taken"]} />);
  O("tim", <Chip t={t} at={at("it only works if you hang it")} out={A.make - 0.3} text="ONLY BEFORE THE QUEEN CHOOSES" col={COL.red} />);
  O("mk", <CheckList t={t} out={at("where and when") - 0.2} title="HOW TO MAKE IT" items={[
    { at: A.make + 1, text: "stuff it (grapefruit size)" }, { at: at("twist", A.make), text: "twist the top" }, { at: at("string", A.make), text: "tie a string" }, { at: at("then crumple the whole bag"), text: "crumple it all" }]} />);
  O("art", <Hanko t={t} at={at("she said the wasp is not an art teacher")} text="NOT AN ART TEACHER" x={1400} y={820} out={at("where and when")} size={52} rot={3} />);
  T("bagdoor", at("it must hang in the shade"), at("and the month is everything"), screenOf(t, PT.bag), "IN THE SHADE", "under the eave", 160, 130);
  O("mon", <BigNum t={t} at={at("and the month is everything")} text="APRIL" sub="WHEN THE FORSYTHIA BLOOMS" x={1420} y={440} size={190} out={at("and keep it dry") - 0.2} col={COL.gold} />);
  O("dry", <Chip t={t} at={at("and keep it dry")} out={at("the store sells a plastic one") - 0.2} text="KEEP IT DRY · A WET BAG IS NOTHING" col={COL.indigo} />);
  O("15", <PriceTag t={t} at={at("the store sells a plastic one")} out={A.rehook2 - 0.3} top="THE STORE ONE" big="$15" />);

  // ---------- 5 errores ----------
  O("r2", <InkLine t={t} a={A.rehook2} b={atEnd("because of five little mistakes")} out={A.m1 - 0.3} y={880} size={64} hot={["five", "mistakes"]} />);
  const MIS = [[A.m1, "ATTACKING AT NOON"], [at("mistake number two swatting"), "SWATTING"], [A.m3, "THE TRAP BY THE DOOR"], [A.m4, "FIRE AND GASOLINE"], [A.m5, "THE LADDER"]] as [number, string][];
  MIS.forEach(([a, txt], i) => {
    O("mx" + i, <Hanko t={t} at={a + 0.1} text={`MISTAKE ${i + 1}`} sub={txt} x={1420} y={300} out={a + 4.5} size={72} rot={i % 2 ? 5 : -6} />);
    O("mxs" + i, <BrushStrike t={t} at={a + 1.2} out={a + 4.5} x={1420} y={300} w={520} col={COL.red} />);
  });
  O("guest", <InkLine t={t} a={at("you do not hit a guest")} b={atEnd("you do not hit a guest")} out={at("you do not hit a guest") + 4} y={880} size={84} hot={["guest"]} />);
  O("far", <Chip t={t} at={at("put it far away")} out={A.m4 - 0.3} text="A TRAP? 20 STEPS FROM THE DOOR" col={COL.indigo} />);
  O("never", <Hanko t={t} at={at("never pour gasoline")} text="NEVER" sub="gasoline · fire" x={1420} y={320} out={A.m4hole} size={90} />);
  O("feet", <InkLine t={t} a={at("keep both feet on the ground")} b={atEnd("keep both feet on the ground")} out={A.never - 0.2} y={880} size={84} hot={["ground"]} />);
  O("nv", <CheckList t={t} out={A.routine - 0.3} title="SHE NEVER…" col={COL.indigo} items={[
    { at: at("she never left a can of soda"), text: "left a soda can open" }, { at: A.persim, text: "left fallen persimmons" }, { at: at("and she never wore bright yellow"), text: "wore bright yellow" }]} />);

  // ---------- el año de mamá ----------
  const SEAS: [number, string, string][] = [[A.rSpring, "MARCH · APRIL", COL.leaf], [A.rSummer, "MAY · JUNE · JULY", COL.gold], [A.rLate, "AUGUST · SEPTEMBER", COL.red], [A.rFall, "OCTOBER · NOVEMBER", COL.leaf], [A.rWinter, "DECEMBER → FEBRUARY", COL.indigo]];
  SEAS.forEach(([a, txt, c], i) => O("se" + i, <Chip t={t} at={a} out={(SEAS[i + 1]?.[0] ?? A.rehook3) - 0.3} text={txt} col={c} />));
  O("rsp", <CheckList t={t} out={A.rSummer - 0.3} title="EARLY SPRING" col={COL.leaf} items={[
    { at: at("make your paper bags and hang them"), text: "hang the paper bags" }, { at: at("make your clove water"), text: "clove water · weekly" }, { at: at("and walk around the house once a week"), text: "walk around once a week" }]} />);
  O("rsu", <CheckList t={t} out={A.rLate - 0.3} title="LOOK UNDER…" col={COL.gold} items={[
    { at: at("grill", 1340), text: "the grill lid" }, { at: at("mailbox", 1340), text: "the mailbox" }, { at: at("swing", 1340), text: "the swing set" }]} />);
  O("rest", <InkLine t={t} a={at("instead close the restaurant")} b={atEnd("instead close the restaurant")} out={at("pick up fallen fruit") + 2} y={880} size={84} hot={["restaurant"]} />);
  O("rfa", <Hanko t={t} at={at("now finally you can take down")} text="EMPTY" sub="now you can take it down" x={1420} y={320} out={at("this is also the time to remember") + 1} size={84} />);
  O("rwi", <CheckList t={t} out={A.rehook3 - 0.3} title="WINTER" col={COL.indigo} items={[
    { at: at("so in winter my mother fixed the cracks"), text: "fill the cracks" }, { at: at("she kept the firewood away"), text: "firewood away from the wall" }]} />);

  // ---------- seguridad: cuándo pagar ----------
  O("r3", <InkLine t={t} a={A.rehook3} b={A.rehook3 + 5} out={A.safety - 0.3} y={880} size={64} hot={["hole", "lawn"]} />);
  O("pay", <CheckList t={t} out={A.questions - 0.3} title="PAY THE $400 WHEN…" col={COL.red} items={[
    { at: A.safety, text: "the nest is in the ground" }, { at: A.football, text: "a closed gray 'football'" }, { at: A.crack, text: "they go into the wall" }, { at: A.fourth, text: "someone is allergic" }]} x={1390} y={520} />);
  T("rib", A.stick + 0.3, A.football - 0.3, screenOf(t, PT.hole), "MARK IT · STAY AWAY", undefined, 150, -140, COL.red);
  T("fb", A.football + 0.4, A.crack - 0.3, screenOf(t, PT.football), "HORNETS · CALL", undefined, -260, -150, COL.red);
  O("sting", <CheckList t={t} out={A.questions - 0.3} title="IF YOU GET STUNG" col={COL.indigo} x={480} y={420} items={[
    { at: at("and if you get stung"), text: "walk away · cold cloth" }, { at: at("my mother put a slice"), text: "a slice of raw potato" }, { at: at("but if the face or the throat"), text: "face or throat → 911" }]} />);

  // ---------- preguntas ----------
  O("q1", <Chip t={t} at={at("will the soapy water hurt my plants")} out={at("someone else asked") - 0.3} text="ROSEMARY · OHIO" col={COL.gold} />);
  O("q2", <Chip t={t} at={at("and dorothy asked")} out={A.memory - 0.3} text="DOROTHY · ABOUT THE BEES" col={COL.gold} />);
  O("bees", <Swap t={t} at={at("if you see a ball of bees")} neuAt={at("if you see a ball of bees") + 2.4} out={A.memory - 0.3} old="spray them" neu="call a beekeeper" y={820} />);

  // ---------- el recuerdo ----------
  O("osk", <Chip t={t} at={A.memory} out={A.morning} text="OSAKA · ONE EVENING · I WAS EIGHT" col={COL.indigo} />);
  T("cup", A.cupNest, A.sunGone, nest, "SIZE OF A SMALL CUP", "over father's bicycle", 140, 150);
  O("cups", <Counter t={t} at={A.threw} out={A.threw + 5} from={0} to={3} dur={1.6} label="CUPS OF SOAPY WATER" x={1420} y={430} size={230} />);
  O("ll", <Hanko t={t} at={A.landlord + 3} text="THE LANDLORD" x={1420} y={300} out={A.money - 0.3} size={74} rot={5} />);
  T("ll2", A.landlord + 3, A.money - 0.3, screenOf(t, PT.bag2), "ROOM TAKEN", undefined, -250, -110);

  // ---------- la cuenta ----------
  O("mo1", <PriceTag t={t} at={A.money + 1} out={at("my mother's way") - 0.1} top="THE EXTERMINATOR" big="$400" x={1420} y={330} />);
  O("mo2", <PriceTag t={t} at={at("my mother's way")} out={at("and something better than the money") - 0.2} top="SOAP · CLOVES · A BAG" big="<$10" x={1420} y={700} />);
  O("mo3", <Enso t={t} at={at("and something better than the money")} out={A.recap - 0.3} x={1420} y={480} R={200} text="calm" />);

  // ---------- resumen ----------
  O("rc", <CheckList t={t} out={A.comment - 0.3} title="EVERYTHING · ONE MORE TIME" items={[
    { at: at("soapy water", 1820), text: "1 · soap water at dusk" }, { at: at("cloves a tablespoon", 1820), text: "2 · cloves for spring" }, { at: at("number three the paper bag"), text: "3 · the paper landlord" },
    { at: at("and the rules around them"), text: "the 5 mistakes" }, { at: at("and the ground nests"), text: "when to pay" }]} />);

  // ---------- tarea + comentario + cierre ----------
  O("hw", <Hanko t={t} at={A.comment} text="HOMEWORK" x={1420} y={260} out={A.comment + 6} size={74} />);
  O("cb", <CommentBox t={t} at={at("and tell me in the comments")} typeAt={at("and tell me in the comments") + 0.6} out={A.next2 - 0.2} text="I found 3 old nests!" />);
  O("sub2", <Subscribe t={t} at={at("and tell me in the comments") + 3} press={at("and tell me in the comments") + 4.2} out={A.next2 - 0.2} x={480} y={820} />);
  O("nu", <NextUp t={t} at={A.next2} out={A.close - 0.3} />);
  O("cl", <InkLine t={t} a={at("soap for this year")} b={atEnd("a paper landlord over the door")} out={END} y={860} size={70} hot={["soap", "clove", "landlord"]} />);

  return <AbsoluteFill style={{ background: "#000" }}>
    <SvgDefs />
    <Base t={t} />
    {L}
  </AbsoluteFill>;
};
