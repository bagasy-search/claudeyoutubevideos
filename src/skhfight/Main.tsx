// skhfight · EL VIDEO ENTERO (0 → END, ~29,6 min). Un solo hilo: avatar ⇄ la casa de Osaka, SIEMPRE por la tinta.
// La base se arma sola desde las ventanas del avatar (avwin.json); las fotos/tomas entran en los tramos de mundo
// (recortadas a ese tramo); encima, las piezas de cada regla, todas ancladas a una frase. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PT, screenOf } from "./osaka3d";
import { END, RECAP_AT, RULE_AT } from "./tl";
import { BRUSH, COL, Hanko, SvgDefs, Tag, BigNum, at, atEnd, ei } from "./lib";
import { AVP, Avatar, Chip, Clip, Desc, InkLine, InkPortal, LowerThird, RingWaves, World, WIN } from "./ink";
import { CheckList, CommentBox, Counter, Dialogue, Enso, Hourglass, Notes, Subscribe, Swap, Tanzaku, WordCard, YearFlip, Snow, Order } from "./rest_fx";
import { CupSplit, KitchenCard, NewYearCards, NextCard, Notebook, OceanCall, Progress11, Question, RuleCard, RuleList, Scale, StoryTag, TenPercent, WarmHands, WeekPlan } from "./fight_fx";
import { CamaraMano } from "../kits/camara/CamaraMano";

export { END };
type Pt = { x: number; y: number };

// ---------- tramos de mundo y fotos ----------
const STR: [number, number][] = [];
{ let c = 0; for (const w of WIN) { if (w.ms - c > 0.5) STR.push([c, w.ms]); c = w.me; } if (END - c > 0.5) STR.push([c, END]); }
// [foto, frase donde entra, segundos]; se recorta al tramo de mundo donde cae (si queda < 1,8 s, no entra)
const SH: [string, string, number, number?][] = [
  ["n_table_item", "on the table there is one small thing", 4], ["n_watch_scratch", "your watch", 3], ["f_two_sons", "two of your children are looking", 4],
  ["n_osaka_house", "when my mother passed in osaka", 4.5], ["n_bags_curb", "nine bags out of ten went to the curb", 4], ["n_sewingbox", "we found her sewing box", 4],
  ["n_keepsakes", "the small things with a story", 4], ["f_dinner_quiet", "without starting a war at the dinner table", 4],
  ["n_mother_sewing", "katami means a keepsake", 4.5], ["n_shrine_tags", "after a funeral the family shares", 4],
  ["n_thimble", "your mother's thimble is worth", 4], ["f_walk_notebook", "i take a small notebook", 4.5], ["f_hand_cups", "i put my hand on things", 4], ["f_watch_palm", "would one of my children be sad", 4],
  ["f_tokonoma", "with my father's calligraphy", 4], ["f_doll", "a wooden doll from my daughter's", 4], ["f_list", "you cannot protect what you have never named", 3.5],
  ["f_comments", "if this is your first time here", 3.5],
  ["f_dinner_quiet", "all my children were home for dinner", 4.5], ["f_phone_listen", "on a walk on the telephone", 4], ["f_radio", "old radio the one he listened", 4.5], ["n_radio_porch", "every summer evening", 4], ["f_notebook_names", "write down what each child says", 4],
  ["n_ice", "fell on the ice carrying our daughter", 4.5], ["n_watch_scratch", "the scratch is a defect", 3.5], ["n_shrine_tags", "at shrines on gifts", 3.5], ["f_tag_write", "i take a little card of washi", 4.5], ["f_tag_tie", "i tie it with a cotton string", 4],
  ["n_train_cups", "carried them in her lap on the train", 5], ["f_tag_cups", "those are my mother on a train", 3.5], ["f_story_grandkid", "when a grandchild picks something up", 4],
  ["f_door_neighbor", "came to my door and asked me", 3.5],
  ["f_give_tea", "while you are still here to see their face", 4], ["f_pearls_give", "you put the ring in your granddaughter's hand", 4.5], ["f_wedding", "she wore my mother's pearls", 5],
  ["n_mother_sewing", "sewing his school uniform", 4], ["n_mother_apron", "to sew my first apron", 4], ["f_give_tea", "give it on a normal day", 3.5],
  ["f_dishes_tatami", "i took my good dishes out", 4.5], ["f_jubako", "we call jubako", 4], ["f_newyear", "they bring their cups", 4.5],
  ["f_two_sons", "i have said it to both sons", 4.5], ["f_pen", "old fountain pen", 4], ["f_radio", "from his baseball summers", 3.5],
  ["f_comments", "tell me about it in the comments", 3.5],
  ["f_notebook_write", "with your own hand", 4], ["f_notebook_write", "i write it by hand", 4], ["n_cameo", "a cameo brooch", 4], ["f_door_neighbor", "came to my door the next day", 3.5], ["f_neighbor_write", "we wrote her first lines together", 4.5],
  ["n_tansu_bag", "a little cloth bag with two gold rings", 5], ["f_drawer_pearls", "did you know about this", 3.5], ["f_showing", "i lay them on the load table", 4.5], ["f_pearls_little", "let the little ones hold the pearls", 4],
  ["f_inlaws", "i give it to my son and his wife", 4.5], ["n_keepsakes", "a little wooden top", 4], ["f_abacus", "my old abacus", 3.5], ["n_abacus_desk", "sits on his desk at college", 4.5],
  ["n_futons", "6 guest futons", 4], ["n_jars", "100 jars", 3.5], ["n_bags_curb", "the bags at the curb are not only", 4], ["f_bags_door", "every drawer you empty now", 4], ["f_drawer_pearls", "in a nearly empty drawer", 4],
  ["f_knees_daughter", "sit with them one at a time", 4.5], ["n_mother_sewing", "she just never said it out loud", 4], ["n_cards", "new year cards short and polite", 4.5],
  ["f_phone_cry", "we both cried on the telephone", 5], ["f_sewingbox_shelf", "it sits on the shelf right behind me", 4.5], ["f_videocall", "on a video call", 4.5],
  ["f_call_child", "ask the gentle question again", 4], ["f_tag_tie", "a tag waits patiently", 3.5], ["f_knees_daughter", "say the last sentence before anything else", 4],
  ["n_hospital_hall", "later becomes a hospital", 3.5], ["n_knife_mochi", "the old kitchen knife", 4.5], ["f_bags_door", "because they live closest", 3.5],
  ["f_week_tea", "walk the house with your tea", 4], ["f_call_child", "call one child", 3.5], ["f_tag_write", "write three story tags", 3.5], ["f_give_tea", "give one small thing away", 3.5], ["f_phone_listen", "make one phone call", 3.5],
  ["f_hour_tea", "watch it together", 4], ["f_close", "a house can be light", 4],
];
const near = (x: number, ys: number[]) => ys.some((y) => Math.abs(x - y) < 0.06);
type Shot = { a: number; b: number; img: string };
const SHOTS: Shot[] = (() => {
  const r: Shot[] = []; let last = -1;
  for (const [img, ph, d] of SH) {
    let a0: number; try { a0 = at(ph); } catch { continue; }
    const st = STR.find(([x, y]) => a0 >= x - 0.6 && a0 < y);
    if (!st) continue;
    const a = Math.max(a0, st[0] + 0.5, last + 0.3), b = Math.min(a + d, st[1] - 0.1);
    if (b - a < 1.8) continue;
    r.push({ a, b, img }); last = b;
  }
  return r;
})();
const AV_END = WIN.map((w) => w.me), AV_START = WIN.map((w) => w.ms);
const INK_AV = [AVP.shoji, AVP.cup, AVP.frame, AVP.window, AVP.hands];

const WorldOrShot: React.FC<{ t: number }> = ({ t }) => {
  const sh = SHOTS.find((x) => t >= x.a && t < x.b + 0.5);
  if (!sh) return <World t={t} />;
  const clip = <Clip k={sh.img} img={sh.img} t={t} a={sh.a} />;
  const soft0 = !near(sh.a, AV_END), soft1 = !near(sh.b, AV_START);
  if (t >= sh.b) return soft1 ? <><AbsoluteFill>{clip}</AbsoluteFill><InkPortal x={960} y={560} r={ei(t, sh.b, sh.b + 0.5)} seed={Math.round(sh.a) + 7}><World t={t} /></InkPortal></> : <AbsoluteFill>{clip}</AbsoluteFill>;
  if (soft0 && t < sh.a + 0.5) return <><World t={t} /><InkPortal x={960} y={540} r={ei(t, sh.a, sh.a + 0.5)} seed={Math.round(sh.a)}>{clip}</InkPortal></>;
  return <AbsoluteFill>{clip}</AbsoluteFill>;
};

const Base: React.FC<{ t: number }> = ({ t }) => {
  const i = WIN.findIndex((w) => t >= w.ms - 0.4 && t < w.me);
  if (i < 0) return <WorldOrShot t={t} />;
  const w = WIN[i];
  if (t < w.ms && w.ms > 0.3) { const p = INK_AV[i % INK_AV.length]; return <><WorldOrShot t={t} /><InkPortal x={p.x} y={p.y} r={ei(t, w.ms - 0.4, w.ms)} seed={i + 30}><Avatar t={t} /></InkPortal></>; }
  if (t >= w.me - 0.4) { const p: Pt = [{ x: 960, y: 900 }, { x: 1500, y: 500 }, { x: 420, y: 520 }][i % 3]; return <><Avatar t={t} /><InkPortal x={p.x} y={p.y} r={ei(t, w.me - 0.4, w.me)} seed={i + 60}><WorldOrShot t={t} /></InkPortal></>; }
  return <Avatar t={t} />;
};

const RT = ["Find your 10%", "Ask each child alone", "Give every thing its story", "Give with warm hands", "Split the sets", "One watch, two sons",
  "One notebook, by hand", "Show everything, hide nothing", "The ones not at the table", "Let go of the 90% now", "Say it out loud"];

export const Main: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];
  const O = (k: string, n: React.ReactNode) => L.push(<React.Fragment key={k}>{n}</React.Fragment>);
  const ph = screenOf(t, PT.phone);
  const A = (p: string, after = 0) => at(p, after), E = (p: string, after = 0) => atEnd(p, after);

  // ======== HOOK ========
  O("h1", <InkLine t={t} a={A("picture yourself a few years")} b={E("your children")} out={A("they are standing")} y={880} size={66} hot={["children"]} />);
  O("h2", <CheckList t={t} out={A("two of your children are looking") + 0.4} title="ONE SMALL THING ON THE TABLE" items={[{ at: A("your watch"), text: "your watch" }, { at: A("mother's pearls"), text: "your mother's pearls" }, { at: A("the good teacups"), text: "the good teacups" }]} />);
  O("h3", <InkLine t={t} a={A("that silence is the beginning")} b={E("last ten years")} out={E("last ten years") + 1.2} y={880} size={62} hot={["silence", "ten"]} />);
  O("h4", <Hanko t={t} at={A("i know that silence")} text="I LIVED IT" x={1440} y={300} out={A("when my mother passed")} size={64} />);
  O("h5", <Chip t={t} at={A("my brother kenji")} out={A("nine bags")} text="MY BROTHER KENJI · OSAKA" col={COL.indigo} />);
  O("h6", <Counter t={t} at={A("in two weeks")} out={A("and we did not argue once") + 1.5} to={2} dur={0.5} label="WEEKS · NOT ONE ARGUMENT" x={1440} y={430} size={220} />);
  O("h7", <Counter t={t} at={A("nine bags out of ten")} out={A("and then at the very end")} from={0} to={9} dur={0.8} label="BAGS OUT OF 10 · TO THE CURB" x={1440} y={430} size={220} />);
  O("h8", <Chip t={t} at={A("a little black lacquer box")} out={A("did not speak to each other")} text="A LITTLE BLACK LACQUER BOX" col={COL.red} />);
  O("h9", <Counter t={t} at={A("did not speak to each other for two years")} out={A("so here is the truth") + 0.2} to={2} dur={0.6} label="YEARS OF SILENCE" x={1440} y={430} size={260} col="#ff9a84" />);
  O("h10", <Order t={t} out={A("10 of your house") - 0.1} x={1380} y={480} items={[{ at: A("over the sofa"), n: "✕", text: "the sofa", dim: true }, { at: A("the bed or the washing machine"), n: "✕", text: "the bed", dim: true }, { at: A("or the washing machine") + 0.4, n: "✕", text: "the washing machine", dim: true }]} />);
  O("h11", <TenPercent t={t} at={A("10 of your house") - 0.3} dim={A("the small things with a story")} out={A("and the good news")} />);
  O("h12", <InkLine t={t} a={A("you can stop that fight today")} b={E("here to stop it")} out={E("here to stop it") + 0.8} y={880} size={66} hot={["today"]} />);

  // ======== PROMISE ========
  O("p1", <BigNum t={t} at={A("11 japanese rules")} text="11 rules" font={BRUSH} size={170} y={190} out={A("how to find the 10")} col={COL.cream} edge="#3a2f24" sub="I FOLLOW AT 80" />);
  O("p2", <CheckList t={t} out={A("and rule number 11 is the one") - 0.2} title="IN THIS VIDEO" x={1400} y={540} items={[{ at: A("how to find the 10"), text: "find the 10%" }, { at: A("how to ask each child"), text: "ask without a war" }, { at: A("how to split a set"), text: "split a set of dishes" }, { at: A("one watch and two sons"), text: "one watch, two sons" }, { at: A("warm hands", 80), text: "warm hands" }]} />);
  O("p3", <Hanko t={t} at={A("almost nobody does")} text="#11 · ALMOST NOBODY DOES IT" x={1360} y={320} out={A("it is the one my mother forgot")} size={52} />);
  O("p4", <InkLine t={t} a={A("it is the one my mother forgot")} b={E("lost two years")} out={E("lost two years") + 0.8} y={880} size={60} hot={["forgot"]} />);
  O("p5", <Chip t={t} at={A("how that sewing box story ended")} out={A("you know me")} text="THE SEWING BOX · AT THE VERY END" col={COL.gold} />);

  // ======== STORY ========
  O("s1", <LowerThird t={t} at={A("i am sachiko")} out={A("in my last video about the house")} name="Sachiko" l2="50 YEARS IN THIS LITTLE HOUSE" l2at={A("i have kept this little house")} />);
  O("s2", <YearFlip t={t} at={A("came to this country")} out={A("i have kept this little house") + 1.5} from={1970} to={2026} label="in this little house" />);
  O("s3", <Chip t={t} at={A("two sons and a daughter")} out={A("in my last video about the house")} text="3 CHILDREN · 2 SONS, 1 DAUGHTER" col={COL.indigo} />);
  O("s4", <WordCard t={t} at={A("kiri wood")} mean={A("the light polonia wood")} out={A("and the list she left")} word="kiri" en="light paulownia, for precious things" x={1500} y={330} />);
  O("s5", <Hanko t={t} at={A("that were not on her list")} text="NOT ON HER LIST" x={1440} y={300} out={A("that is what this video is about") + 1.2} size={64} />);
  O("s6", <WordCard t={t} at={A("katami wake")} mean={A("katami means a keepsake")} out={A("wake means sharing it out")} word="katami" en="a keepsake · a thing that carries a person" x={1500} y={330} />);
  O("s7", <WordCard t={t} at={A("wake means sharing it out")} mean={A("sharing it out") + 0.3} out={A("it is a beautiful custom")} word="wake" en="sharing it out" x={1500} y={330} />);
  O("s8", <InkLine t={t} a={A("when nobody planned it")} b={E("where families break")} out={E("where families break") + 0.8} y={880} size={64} hot={["break"]} />);
  O("s9", <Hanko t={t} at={A("i am not a lawyer")} text="NOT A LAWYER · NOT ABOUT MONEY" x={1340} y={300} out={A("this is about the cups")} size={48} />);
  O("s10", <CheckList t={t} out={E("mean everything") + 1} title="THIS VIDEO IS ABOUT" items={[{ at: A("this is about the cups"), text: "the cups" }, { at: A("the rings", 160), text: "the rings" }, { at: A("the watch", 160), text: "the watch" }, { at: A("the box", 165), text: "the box" }]} />);
  O("s11", <InkLine t={t} a={A("the things that cost little")} b={E("mean everything")} out={E("mean everything") + 1.0} y={880} size={70} hot={["little", "everything"]} />);

  // ======== las 11 tarjetas de regla + la etiqueta en el ema ========
  RULE_AT.forEach((a, i) => {
    O("rc" + i, <RuleCard t={t} at={a + 0.1} out={a + 4.6} n={i + 1} title={RT[i]} />);
    O("rt" + i, <Tag t={t} at={a + 0.5} x={screenOf(t, PT.ema(i)).x} y={screenOf(t, PT.ema(i)).y} dx={i < 5 ? 220 : -220} dy={230} text={`RULE ${i + 1}`} col={COL.red} out={a + 4.2} size={52} />);
  });

  // ======== ONE ========
  O("o1", <Scale t={t} at={A("everybody can see what a car is worth")} out={A("so here is what i do")} left="the car" right="the thimble" even={false} title="WHAT IT IS WORTH" />);
  O("o2", <Chip t={t} at={A("once a year")} out={A("i put my hand on things")} text="ONCE A YEAR · A QUIET MORNING" col={COL.indigo} />);
  O("o3", <InkLine t={t} a={A("only the things that someone")} b={E("might cry over")} out={E("might cry over") + 0.8} y={880} size={64} hot={["cry"]} />);
  O("o4", <InkLine t={t} a={A("if this broke tomorrow")} b={E("be sad")} out={A("if the answer is yes")} y={300} size={70} hot={["sad"]} />);
  O("o5", <Notebook t={t} out={E("that is the 10") + 1.2} title="THE WALK · MY LIST" rows={[{ at: A("my mother's teacups"), what: "my mother's teacups", where: "alcove", who: "?", why: "the train from Kyoto" }, { at: A("my husband's watch"), what: "my husband's watch", where: "drawer", who: "?", why: "40 years on his wrist" }, { at: A("the ring from my wedding"), what: "my wedding ring", where: "box", who: "?", why: "Osaka" }]} />);
  O("o6", <WordCard t={t} at={A("the tokonoma")} mean={A("with my father's calligraphy")} out={A("a wooden doll")} word="tokonoma" en="the little alcove for the scroll" x={1500} y={300} />);
  O("o7", <Hanko t={t} at={A("that is the 10")} text="THE 10%" x={1480} y={330} out={A("last year my list")} size={90} />);
  O("o8", <Counter t={t} at={A("31 things on it")} out={A("that surprised me") + 0.8} to={31} dur={1.0} label="THINGS · IN 50 YEARS" x={1440} y={430} size={260} />);
  O("o9", <TenPercent t={t} at={A("everything else the sofa") - 0.2} dim={A("will not fight over", 200)} out={A("and now i know exactly")} label="31 things with a story" label2="the sofa, the lamps, the pots: let them go" />);
  O("o10", <Tanzaku t={t} out={E("never named") + 1.0} items={[{ at: A("do this walk with a cup of tea"), text: "Walk with a cup of tea.", sub: "SLOWLY" }, { at: A("do not decide anything yet"), text: "Do not decide yet.", sub: "ONLY LOOK" }, { at: A("just find them"), text: "Just find them.", sub: "AND NAME THEM" }]} />);
  O("o11", <InkLine t={t} a={A("you cannot protect what")} b={E("never named")} out={E("never named") + 1.2} y={880} size={72} hot={["named"]} />);

  // ======== CTA1 ========
  O("c1", <Subscribe t={t} at={A("press subscribe") - 0.3} press={A("and the little bell")} out={A("one more japanese way") + 2} />);
  O("c2", <KitchenCard t={t} at={A("sachiko's kitchen")} out={A("all 11 rules are written")} />);
  O("c3", <Desc t={t} at={A("all 11 rules are written")} out={A("now back to the list") + 0.6} x={1150} y={600} scale={0.78} />);

  // ======== TWO ========
  O("t1", <Hanko t={t} at={A("this is the mistake i made first")} text="MY FIRST MISTAKE" x={1440} y={300} out={A("one sunday")} size={62} />);
  O("t2", <Dialogue t={t} out={A("nobody said the truth")} lines={[{ at: A("i want to know what each of you"), text: "What would each of you like to have one day?", me: true }, { at: A("oh mom anything is fine"), text: "Oh, Mom, anything is fine." }, { at: A("my daughter looked at her plate"), text: "(looks at her plate)" }, { at: A("my younger son made a joke"), text: "(a joke)" }]} />);
  O("t3", <InkLine t={t} a={A("at a table children are polite")} b={E("not the truth")} out={E("not the truth") + 1.0} y={880} size={66} hot={["polite", "truth"]} />);
  O("t4", <CheckList t={t} out={A("and i ask in a very gentle way")} title="ONLY THE TWO OF US" items={[{ at: A("on a walk"), text: "on a walk" }, { at: A("on the telephone", 330), text: "on the telephone" }, { at: A("in the car", 330), text: "in the car" }]} />);
  O("t5", <Swap t={t} at={A("i do not say what do you want")} neuAt={A("when you think of this house")} out={A("that question opens the heart") + 1.2} old="What do you want when I die?" neu="What is the one thing you see?" y={780} />);
  O("t6", <Hanko t={t} at={A("that question opens the heart")} text="IT OPENS THE HEART" x={1420} y={300} out={A("my older son the one")} size={56} />);
  O("t7", <StoryTag t={t} at={A("old radio")} out={A("i had that radio on my list")} who="Dad's old radio" when="every summer evening" story="the baseball games" />);
  O("t8", <Hanko t={t} at={A("on my list to give away")} text="ALMOST GIVEN AWAY" x={1440} y={300} out={E("in a bag") + 0.8} size={56} rot={5} />);
  O("t9", <Notebook t={t} out={E("a chance to grow") + 1.0} title="WHAT EACH ONE SAID · IN THEIR WORDS" rows={[{ at: A("in their words"), what: "older son: the radio", where: "on the phone", who: "(not told yet)", why: "baseball summers" }, { at: A("with the date"), what: "daughter: the teacups", where: "on a walk", who: "(not told yet)", why: "she makes tea the old way" }]} />);
  O("t10", <Hanko t={t} at={A("you are not making promises")} text="ONLY LISTENING" x={1440} y={260} out={A("when i put the three answers")} size={56} />);

  // ======== THREE ========
  O("r1", <InkLine t={t} a={A("a watch without a story")} b={E("only a watch")} out={A("your children will look at it")} y={880} size={74} hot={["story"]} />);
  O("r2", <Counter t={t} at={A("for 40 years")} out={A("and the crystal has")} to={40} dur={0.8} label="YEARS ON HIS WRIST" x={1440} y={430} size={240} />);
  O("r3", <Snow t={t} at={A("fell on the ice")} out={A("if my children do not know")} />);
  O("r4", <Swap t={t} at={A("the scratch is a defect")} neuAt={A("the scratch is the best part")} out={E("the best part") + 1.2} old="a defect" neu="the best part" y={780} />);
  O("r5", <StoryTag t={t} at={A("i write three things on it")} out={E("with the thing") + 0.8} who="Who: my husband" when="When: 1968, a gift" story="the scratch from the ice" />);
  O("r6", <CheckList t={t} out={E("with the thing") + 0.6} title="THE TAG SAYS" x={600} y={620} col={COL.indigo} items={[{ at: A("who it belonged to"), text: "who it belonged to" }, { at: A("when it came into the family"), text: "when it came in" }, { at: A("and one short story"), text: "one short story" }]} />);
  O("r7", <StoryTag t={t} at={A("for the teacups the tag says")} out={E("on a train") + 1.0} who="Mother's teacups" when="Kyoto, 1951" story="on her lap, on the train" rot={-4} />);
  O("r8", <InkLine t={t} a={A("now those are not cups")} b={E("on a train")} out={E("on a train") + 1.0} y={880} size={70} hot={["mother"]} />);
  O("r9", <InkLine t={t} a={A("a story told three times")} b={E("stays in the family")} out={E("stays in the family") + 1.0} y={880} size={68} hot={["three"]} />);

  // ======== REHOOK 1 ========
  O("rh1", <Progress11 t={t} at={A("now rule number four is the one")} out={A("but first the custom")} done={3} label="3 done · 8 to go" />);
  O("rh2", <Hanko t={t} at={A("would have saved my brother and me")} text="#4 · IT WOULD HAVE SAVED US" x={1380} y={300} out={A("and rule seven is the one")} size={52} />);
  O("rh3", <Hanko t={t} at={A("my neighbor laughed at")} text="#7 · MY NEIGHBOR LAUGHED" x={1380} y={300} out={A("but first the custom")} size={52} rot={5} />);

  // ======== FOUR ========
  O("f1", <WarmHands t={t} at={A("it is better to give with warm hands")} warm={A("warm hands means now")} out={A("katami wake usually happens") + 0.4} />);
  O("f2", <InkLine t={t} a={A("i think it is the wisest thing")} b={E("we ever did")} out={E("we ever did") + 0.8} y={880} size={66} hot={["wisest"]} />);
  O("f3", <InkLine t={t} a={A("nobody can argue about what you meant")} b={E("standing right there")} out={A("you put the ring")} y={300} size={60} hot={["argue"]} />);
  O("f4", <Dialogue t={t} out={A("nobody at that table")} lines={[{ at: A("this was my mother's and now"), text: "This was my mother's. And now it is yours.", me: true }]} />);
  O("f5", <Hanko t={t} at={A("they saw you give it")} text="THEY SAW YOU GIVE IT" x={1420} y={300} out={A("and you get the best part")} size={56} />);
  O("f6", <Chip t={t} at={A("two springs ago")} out={A("if i had kept those pearls")} text="HER WEDDING · MY MOTHER'S PEARLS" col={COL.gold} />);
  O("f7", <InkLine t={t} a={A("i would have missed the happiest")} b={E("of my old age")} out={E("of my old age") + 1.0} y={880} size={60} hot={["happiest"]} />);
  O("f8", <InkLine t={t} a={A("giving things away felt to her")} b={E("like saying goodbye")} out={E("like saying goodbye") + 0.8} y={880} size={60} hot={["goodbye"]} />);
  O("f9", <Hanko t={t} at={A("the sewing box had no owner")} text="NO OWNER" x={1440} y={300} out={A("my brother remembered")} size={86} />);
  O("f10", <Scale t={t} at={A("my brother remembered")} out={A("and nobody had given it")} left="his story" right="my story" even title="BOTH TRUE" />);
  O("f11", <Tanzaku t={t} out={E("watch their face") + 1.0} items={[{ at: A("one thing this month"), text: "One thing this month.", sub: "START SMALL" }, { at: A("give it on a normal day"), text: "A normal day, with tea.", sub: "NO CEREMONY" }, { at: A("and watch their face"), text: "Watch their face.", sub: "WARM HANDS" }]} />);

  // ======== FIVE ========
  O("v1", <Counter t={t} at={A("our good dishes come in sets of five")} out={A("five small plates") + 2} to={5} dur={0.5} label="A JAPANESE SET" x={1440} y={430} size={260} />);
  O("v2", <WordCard t={t} at={A("five not six")} mean={A("odd numbers were lucky")} out={A("my mother had a set")} word="5, not 6" en="odd numbers were lucky for a house" x={1500} y={300} />);
  O("v3", <Hanko t={t} at={A("the most dangerous thing")} text="THE MOST DANGEROUS THING" x={1360} y={300} out={A("because a set feels")} size={50} />);
  O("v4", <InkLine t={t} a={A("only one child can take it home")} b={E("take it home")} out={E("take it home") + 0.8} y={880} size={66} hot={["one"]} />);
  O("v5", <Hanko t={t} at={A("on purpose")} text="ON PURPOSE" x={1460} y={300} out={A("i took my good dishes out")} size={78} />);
  O("v6", <CupSplit t={t} at={A("then i made three small groups") - 0.3} split={A("two teacups for one")} out={A("a lacquer box for each") + 2.5} />);
  O("v7", <InkLine t={t} a={A("each child has a piece of the table")} b={E("all sat around")} out={E("all sat around") + 0.6} y={300} size={60} hot={["piece"]} />);
  O("v8", <WordCard t={t} at={A("family puzzle")} mean={A("family puzzle") + 0.4} out={A("and if your set is very precious")} word="the family puzzle" en="5 cups, 3 homes, 1 table at New Year" x={1500} y={300} />);
  O("v9", <InkLine t={t} a={A("what you must never do")} b={E("of their lives")} out={E("of their lives") + 1.0} y={880} size={56} hot={["never", "worst"]} />);

  // ======== SIX ========
  O("x1", <CheckList t={t} out={A("you cannot cut a watch")} title="CANNOT BE SPLIT" items={[{ at: A("one ring"), text: "one ring" }, { at: A("one clock"), text: "one clock" }, { at: A("one kimono"), text: "one kimono" }, { at: A("one scroll"), text: "one scroll" }]} />);
  O("x2", <Hanko t={t} at={A("you cannot cut a watch in half")} text="NOT IN HALF" x={1440} y={300} out={A("and this is where most families")} size={70} />);
  O("x3", <Swap t={t} at={A("the children can decide among themselves")} neuAt={A("grief makes everybody")} out={E("a child again") + 1.0} old="They will decide among themselves" neu="Grief makes us children again" y={780} />);
  O("x4", <Order t={t} out={A("not a hint")} x={1380} y={480} items={[{ at: A("the parent decides"), n: "1", text: "the parent decides" }, { at: A("and the parent says why"), n: "2", text: "and says why" }]} />);
  O("x5", <StoryTag t={t} at={A("goes to my younger son")} out={A("that is the reason")} who="Dad's watch → younger son" when="every Sunday morning" story="he wound it when Dad's hands got stiff" />);
  O("x6", <Hanko t={t} at={A("because the reason was true")} text="THE REASON WAS TRUE" x={1400} y={300} out={A("he was there on those sundays")} size={54} />);
  O("x7", <Scale t={t} at={A("not the same price")} out={A("my older son is getting")} left="same price" right="same weight" even={false} title="IN THE HEART" />);
  O("x8", <CheckList t={t} out={A("when the reason is true")} title="MY OLDER SON" items={[{ at: A("the radio from his baseball"), text: "the radio · baseball summers" }, { at: A("old fountain pen"), text: "Dad's fountain pen" }]} />);
  O("x9", <InkLine t={t} a={A("what they cannot carry")} b={E("is a mystery")} out={E("is a mystery") + 1.2} y={880} size={74} hot={["mystery"]} />);

  // ======== CTA2 ========
  O("k1", <CommentBox t={t} at={A("tell me about it in the comments")} typeAt={A("i read every one")} out={A("and if this is helping you")} text="One kimono and two daughters…" />);
  O("k2", <Subscribe t={t} at={A("and if this is helping you subscribe") - 0.2} press={A("subscribe", 815)} out={A("rule 7 is next") + 0.4} />);
  O("k3", <Progress11 t={t} at={A("rule 7 is next")} out={E("my neighbor laughed at", 820) + 0.6} done={6} label="halfway · 6 of 11" />);

  // ======== SEVEN ========
  O("e1", <WordCard t={t} at={A("an ending note")} mean={A("a simple notebook for the family")} out={A("i told you about mine")} word="ending note" en="a simple notebook for the family" x={1500} y={300} />);
  O("e2", <Hanko t={t} at={A("this is not a legal paper")} text="NOT A LEGAL PAPER · A FAMILY PAPER" x={1300} y={300} out={A("it is the voice of your heart")} size={44} />);
  O("e3", <InkLine t={t} a={A("it is the voice of your heart")} b={E("have to guess")} out={E("have to guess") + 0.8} y={880} size={62} hot={["heart"]} />);
  O("e4", <Notebook t={t} out={A("i write it by hand") - 0.1} rows={[{ at: A("the teacups the alcove cabinet"), what: "the teacups", where: "alcove cabinet, top shelf", who: "my daughter", why: "she makes tea the old way" }, { at: A("the radio the hall closet"), what: "the radio", where: "hall closet", who: "my older son", why: "the baseball summers" }]} />);
  O("e5", <Swap t={t} at={A("a typed list feels like an office")} neuAt={A("a handwritten list feels like")} out={E("like their mother") + 1.0} old="a typed list: an office" neu="a handwritten list: their mother" y={780} />);
  O("e6", <Dialogue t={t} out={A("two months later", 900)} lines={[{ at: A("she said sachiko my kids"), text: "Sachiko, my kids are not like that." }, { at: A("they will never fight"), text: "They will never fight." }]} />);
  O("e7", <Hanko t={t} at={A("two months later", 900)} text="TWO MONTHS LATER" x={1440} y={300} out={A("her sister's two daughters")} size={60} />);
  O("e8", <Chip t={t} at={A("a cameo brooch")} out={A("my neighbor came to my door the next day")} text="A CAMEO BROOCH · A BOX OF LETTERS" col={COL.red} />);
  O("e9", <Dialogue t={t} out={A("i made her a cup of tea")} lines={[{ at: A("show me your notebook"), text: "Show me your notebook." }]} />);
  O("e10", <InkLine t={t} a={A("every line you write")} b={E("will never have")} out={E("will never have") + 1.2} y={880} size={62} hot={["line", "never"]} />);

  // ======== EIGHT ========
  O("g1", <Hanko t={t} at={A("this one is about trust")} text="TRUST" x={1460} y={300} out={A("in my mother's house the real")} size={100} />);
  O("g2", <WordCard t={t} at={A("her tansu")} mean={A("the tall wooden chest")} out={A("under her winter kimono") + 1} word="tansu" en="the tall wooden chest of drawers" x={1500} y={300} />);
  O("g3", <CheckList t={t} out={A("nobody knew it was there") + 1} title="IN A LITTLE CLOTH BAG" items={[{ at: A("two gold rings"), text: "two gold rings" }, { at: A("an old coral hairpin"), text: "an old coral hairpin" }]} />);
  O("g4", <InkLine t={t} a={A("everybody wonders what else is hidden")} b={E("already took something")} out={E("already took something") + 0.8} y={880} size={58} hot={["hidden"]} />);
  O("g5", <Dialogue t={t} out={A("and i heard in his voice")} lines={[{ at: A("did you know about this"), text: "Did you know about this?" }]} />);
  O("g6", <InkLine t={t} a={A("that question hurt more")} b={E("that month")} out={E("that month") + 0.8} y={880} size={62} hot={["hurt"]} />);
  O("g7", <WordCard t={t} at={A("the showing")} mean={A("not to give them")} out={A("i tell one story")} word="the showing" en="every New Year · show, don't give" x={1500} y={300} />);
  O("g8", <Counter t={t} at={A("it takes half an hour")} out={A("everybody knows what exists")} to={30} dur={0.7} label="MINUTES · ONCE A YEAR" x={1440} y={430} size={220} />);
  O("g9", <CheckList t={t} out={E("a surprise in a drawer") + 0.8} title="AFTER THE SHOWING" items={[{ at: A("everybody knows what exists"), text: "everybody knows what exists" }, { at: A("everybody knows where it lives"), text: "everybody knows where it lives" }, { at: A("and nothing will ever be a surprise"), text: "no surprise in a drawer" }]} />);
  O("g10", <InkLine t={t} a={A("you can keep a secret from the house")} b={E("from the notebook")} out={E("from the notebook") + 1.2} y={880} size={60} hot={["house", "notebook"]} />);

  // ======== REHOOK 2 ========
  O("rr1", <Progress11 t={t} at={A("now the next rule surprises")} out={A("rule number nine is")} done={8} label="8 done · the last 3" />);
  O("rr2", <Hanko t={t} at={A("is not your child at all")} text="NOT YOUR CHILD" x={1420} y={300} out={A("and after that i will tell")} size={64} />);

  // ======== NINE ========
  O("n1", <CheckList t={t} out={A("and sometimes on the drive home")} title="NOT AT YOUR TABLE" items={[{ at: A("they have husbands and wives"), text: "husbands and wives" }, { at: A("and so they protect them"), text: "who protect them" }]} />);
  O("n2", <Dialogue t={t} out={A("she is not a bad person")} lines={[{ at: A("on the drive home after"), text: "(the car ride home)" }, { at: A("your sister already has the good china"), text: "Your sister already has the good china…" }, { at: A("why does she also get the kimono"), text: "…why does she also get the kimono?" }]} />);
  O("n3", <InkLine t={t} a={A("the fight begins in the car")} b={E("not in the living room")} out={E("not in the living room") + 1.0} y={880} size={64} hot={["car"]} />);
  O("n4", <Hanko t={t} at={A("so i include them")} text="I INCLUDE THEM" x={1440} y={300} out={A("when i do the showing at new year")} size={64} />);
  O("n5", <Dialogue t={t} out={A("and i have one more custom")} lines={[{ at: A("this is for your family"), text: "This is for your family.", me: true }]} />);
  O("n6", <CheckList t={t} out={A("small things nothing of value") + 1} title="ONE FOR EACH GRANDCHILD" items={[{ at: A("a little wooden top"), text: "a little wooden top" }, { at: A("a folding fan"), text: "a folding fan" }, { at: A("my old abacus"), text: "my old abacus" }]} />);
  O("n7", <InkLine t={t} a={A("when everybody has been seen")} b={E("to be seen")} out={E("to be seen") + 1.2} y={880} size={66} hot={["seen"]} />);

  // ======== TEN ========
  O("q1", <TenPercent t={t} at={A("let go of the 90 now") - 0.2} dim={A("so the 10 can shine")} out={A("in my last video i told you")} label="so the 10% can shine" label2="let the 90% go, now" />);
  O("q2", <Hanko t={t} at={A("tired children fight")} text="TIRED CHILDREN FIGHT" x={1380} y={300} out={A("think about it")} size={60} />);
  O("q3", <CheckList t={t} out={A("we had not slept well")} title="THE SECOND WEEK" items={[{ at: A("6 guest futons"), text: "6 guest futons" }, { at: A("years of box towels"), text: "40 years of towels" }, { at: A("100 jars"), text: "100 jars" }, { at: A("bags inside bags"), text: "bags inside bags" }]} />);
  O("q4", <InkLine t={t} a={A("the smallest thing became")} b={E("in the world")} out={E("in the world") + 1.0} y={880} size={60} hot={["smallest", "biggest"]} />);
  O("q5", <Swap t={t} at={A("two calm days in her house")} neuAt={A("two calm days to sit")} out={E("grabbing at it") + 0.8} old="2 exhausting weeks" neu="2 calm days" y={780} />);
  O("q6", <InkLine t={t} a={A("they are a kindness to the people")} b={E("grieve you")} out={E("grieve you") + 0.8} y={880} size={60} hot={["kindness"]} />);
  O("q7", <InkLine t={t} a={A("every drawer you empty now")} b={E("will have later")} out={E("will have later") + 0.8} y={880} size={56} hot={["patience"]} />);
  O("q8", <Swap t={t} at={A("look like a treasure")} neuAt={A("look like one more thing")} out={E("more thing to sort") + 1.0} old="pearls in an empty drawer: a treasure" neu="in a tangled drawer: one more thing" y={780} />);

  // ======== ELEVEN ========
  O("l1", <Hanko t={t} at={A("the one my mother forgot", 1200)} text="THE ONE MY MOTHER FORGOT" x={1360} y={300} out={A("say it with your own voice")} size={50} />);
  O("l2", <Swap t={t} at={A("not on paper")} neuAt={A("out loud to each child")} out={A("sit with them one at a time")} old="on paper · in the notebook" neu="out loud, in their eyes" y={780} />);
  O("l3", <CheckList t={t} out={A("that last sentence is the one") + 2} title="THREE THINGS" x={1300} items={[{ at: A("this is yours", 1240), text: "This is yours." }, { at: A("this is why", 1240), text: "This is why." }, { at: A("and i love all of you the same"), text: "And I love all of you the same." }]} />);
  O("l4", <InkLine t={t} a={A("the fight over the sewing box was never")} b={E("never about the sewing box")} out={E("never about the sewing box") + 0.8} y={880} size={60} hot={["never"]} />);
  O("l5", <InkLine t={t} a={A("did she love me as much")} b={E("as she loved you")} out={E("as she loved you") + 1.4} y={300} size={70} hot={["love", "loved"]} />);
  O("l6", <Swap t={t} at={A("your notebook can tell them")} neuAt={A("only your voice can tell them")} out={E("loved the same") + 1.0} old="the notebook: where the watch goes" neu="your voice: loved the same" y={780} />);
  O("l7", <InkLine t={t} a={A("so she left us a list")} b={E("the most important line")} out={E("the most important line") + 1.2} y={880} size={60} hot={["important"]} />);
  O("l8", <NewYearCards t={t} at={A("for two years my brother and i")} out={A("and then one winter")} />);
  O("l9", <RingWaves t={t} x={ph.x} y={ph.y} on={t >= A("my brother called me") - 0.3 && t < A("my brother called me") + 1.6 ? 1 : 0} />);
  O("l10", <Dialogue t={t} out={A("and we both cried")} lines={[{ at: A("he said sachiko i was looking"), text: "In every photo where she sews, you are next to her." }, { at: A("the box is yours"), text: "The box is yours. Keep it." }, { at: A("and i said kenji"), text: "Kenji… every uniform she mends is yours.", me: true }]} />);
  O("l11", <OceanCall t={t} at={A("and we both cried")} out={A("i kept the box")} left="Kenji" right="me" />);
  O("l12", <StoryTag t={t} at={A("there is a small paper now")} out={A("i told her myself")} who="Mother's sewing box" when="→ Kenji's granddaughter" story="she just started to sew" />);
  O("l13", <InkLine t={t} a={A("that is what warm hands can do")} b={E("across an ocean")} out={E("across an ocean") + 1.4} y={880} size={66} hot={["warm", "ocean"]} />);

  // ======== QUESTIONS ========
  O("u1", <Question x={1480} t={t} at={A("the first question was")} out={A("dear many children say that")} n={1} text="What if my children say they want nothing?" />);
  O("u2", <InkLine t={t} a={A("most of them do not mean it")} b={E("do not mean it")} out={A("so do not argue")} y={880} size={66} hot={["not"]} />);
  O("u3", <Hanko t={t} at={A("a tag waits patiently")} text="A TAG WAITS" x={1440} y={300} out={A("one day when they are older")} size={70} />);
  O("u4", <Question x={1480} t={t} at={A("the second question was")} out={A("then the 10 still matters")} n={2} text="What if I have one child, or none?" />);
  O("u5", <CheckList t={t} out={A("so your child does not have to be") + 2} title="WRITE IT DOWN" items={[{ at: A("the friend who gets your tea bowl"), text: "the friend → the tea bowl" }, { at: A("the niece who gets the brooch"), text: "the niece → the brooch" }]} />);
  O("u6", <Hanko t={t} at={A("the best year of her life")} text="THE BEST YEAR OF HER LIFE" x={1360} y={300} out={A("and the third question")} size={50} />);
  O("u7", <Question x={1480} t={t} at={A("and the third question")} out={A("then start with rule 11 first")} n={3} text="What if they are already fighting?" />);
  O("u8", <Swap t={t} at={A("then start with rule 11 first")} neuAt={A("not rule 1")} out={A("sit with each one alone")} old="start with rule 1" neu="start with rule 11" y={780} />);
  O("u9", <InkLine t={t} a={A("fights about things are almost always")} b={E("fights about love")} out={A("your voice can", 1470)} y={880} size={62} hot={["love"]} />);

  // ======== MISTAKES ========
  O("m0", <CheckList t={t} out={A("and the fifth mistake") + 8} title="5 MISTAKES I SEE MOST" x={1380} y={520} items={[{ at: A("the first mistake"), text: "the same thing to two people" }, { at: A("the second mistake"), text: "“I will decide later”" }, { at: A("the third mistake"), text: "dividing by price" }, { at: A("the fourth mistake"), text: "one child takes it early" }, { at: A("and the fifth mistake"), text: "“my children are different”" }]} />);
  O("m1", <Hanko t={t} at={A("check the notebook")} text="CHECK THE NOTEBOOK" x={600} y={300} out={A("the second mistake")} size={54} />);
  O("m2", <InkLine t={t} a={A("later is the most dangerous word")} b={E("in an old house")} out={A("decide one thing this week") + 1.0} y={880} size={60} hot={["later"]} />);
  O("m3", <Hanko t={t} at={A("ask do not calculate")} text="ASK. DON'T CALCULATE." x={600} y={300} out={A("the fourth mistake")} size={50} />);
  O("m4", <Hanko t={t} at={A("show the others")} text="SAY IT OUT LOUD" x={600} y={300} out={A("and the fifth mistake")} size={54} />);
  O("m5", <InkLine t={t} a={A("that is exactly why it hurts them")} b={E("when they fight")} out={E("when they fight") + 1.2} y={880} size={56} hot={["hurts"]} />);

  // ======== WEEK ========
  O("w1", <WeekPlan t={t} out={E("will never happen") + 1.0} y={560} days={[{ at: A("on the first day"), text: "walk & find the 10%" }, { at: A("on the second day"), text: "call one child" }, { at: A("on the third day"), text: "call the next one" }, { at: A("on the fourth day"), text: "3 story tags" }, { at: A("on the fifth day"), text: "5 lines in the notebook" }, { at: A("on the sixth day"), text: "give one thing, warm hands" }, { at: A("and on the seventh day"), text: "rest · “I love you”" }]} />);

  // ======== RECAP ========
  O("z1", <RuleList t={t} out={A("now tell me in the comments")} title="THE 11 RULES" x={60} y={40} items={RECAP_AT.map((a, i) => ({ at: a, text: RT[i] }))} />);

  // ======== COMMENT · CTA3 · OTHER · NEXT · CLOSE ========
  O("y1", <CommentBox t={t} at={A("now tell me in the comments")} typeAt={A("tell me what it is")} out={A("if this helped you press subscribe")} text="My grandmother's sewing scissors…" />);
  O("y2", <Subscribe t={t} at={A("if this helped you press subscribe") - 0.2} press={A("subscribe", 1725)} out={A("watch it together")} />);
  O("y3", <InkLine t={t} a={A("send this video to your brother")} b={E("or your sister")} out={A("watch it together")} y={880} size={62} hot={["brother", "sister"]} />);
  O("y4", <KitchenCard t={t} at={A("sachiko's kitchen", 1700)} out={A("next week i will show you")} />);
  O("y5", <NextCard t={t} at={A("next week i will show you")} out={A("a house can be light")} title={<>my <span style={{ color: COL.gold }}>story tags</span>, with washi</>} sub="make your first one with me" />);
  O("y6", <InkLine t={t} a={A("give with warm hands", 1700)} b={E("not the fight")} out={A("take care of yourself")} y={880} size={58} hot={["warm", "voice"]} />);
  O("y7", <LowerThird t={t} at={A("take care of yourself")} out={END} name="Sachiko" l2="THANK YOU FOR SITTING WITH ME" l2at={A("take care of yourself") + 0.3} />);
  O("y8", <Enso t={t} at={END - 2.2} out={END + 2} text="see you next week" />);

  return <AbsoluteFill style={{ background: "#0b0a09" }}><SvgDefs /><CamaraMano intensidad={0.6} seed={5}><Base t={t} /></CamaraMano>{L}</AbsoluteFill>;
};
