// ck5na · piezas ancladas a la palabra (anclas.json = D:/rtmp/ck5n_anclas.py sobre la voz). Un componente distinto por minuto
// (kit.tsx / kit2.tsx / ui.tsx; registro de la tanda en D:/rtmp/ck5n_COMPONENTES.md) + zócalo abajo-izq para pasos y errores.
// Los objetos viven a la derecha y no se pisan: cada uno sale antes de que entre el siguiente (out recortado al próximo).
import React from "react";
import { Kit } from "../kits/yanqui3d/engine";
import { ZItem, ZocaloStack } from "./ui";


import * as N from "./kit3";
import AN from "./anclas.json";

const A = AN as Record<string, number>;
type P = { a: number; out: number; r: (t: number, out: number) => React.ReactNode };
let BUILT: { P: P[]; Z: ZItem[] } | null = null;

const build = (): { P: P[]; Z: ZItem[] } => {
  const L: P[] = [], ZS: ZItem[] = [];
  const P = (a: number, out: number, r: P["r"]) => L.push({ a, out: Math.min(out, a + 9), r });   // un objeto suelto no se queda más de 9 s (más largo = cuadros iguales)
  const PL = (a: number, out: number, r: P["r"]) => L.push({ a, out, r });                          // los que van llenando renglones con la voz
  const Z = (key: string, a: number, out: number, tone: ZItem["tone"], label: string, txt: string, x: Partial<ZItem> = {}) => ZS.push({ key, a, out, tone, label, txt, ...x });
  const STEP = (key: string, a: number, out: number, n: number, txt: string) => Z(key, a, out, "tip", `STEP ${n}`, txt);
  const MIS = (key: string, a: number, out: number, n: number, txt: string) => Z(key, a, out, "warn", "MISTAKE", txt, { n });
  const BOOK = (key: string, a: number, out: number, sub: string) => Z(key, a, out, "book", "MY COOKBOOK", "Loretta's Church Supper Cookbook", { sub });

  // ===== gancho =====
  P(A.bag - 0.2, A.turn - 0.2, (t, o) => <N.ShelfTag t={t} a={A.bag - 0.2} out={o} split={A.p479 + 1.4} />);
  P(A.turn, A.well - 0.1, (t, o) => <N.LabelScroll t={t} a={A.turn} out={o} />);
  P(A.since - 0.3, A.receipt0 - 0.2, (t, o) => <N.YearFlip t={t} a={A.since - 0.3} out={o} from={1962} to={2026} />);
  Z("name", A.imlor, A.imlor + 6, "name", "LORETTA · 81", "60 years in the church basement kitchen", { sub: "SMALL-TOWN IOWA" });
  P(A.fourdays, A.onebowl - 0.2, (t, o) => <N.FourDayStrip t={t} a={A.fourdays} out={o} />);
  P(A.onebowl, A.mist0 - 0.3, (t, o) => <N.FiveBreadShelf t={t} a={A.onebowl} out={o} />);
  P(A.mist0, A.book0 - 0.2, (t, o) => <N.LoupeTeaser t={t} a={A.mist0} out={o} />);
  BOOK("cta1", A.book0, A.flour0 - 0.2, "CROWD CHART P. 7 · BUNS P. 42 · LINK IN THE 1ST LINE");

  // ===== 1962 · Hazel =====
  P(A.march - 0.2, A.hazel - 0.3, (t, o) => <N.Snapshot62 t={t} a={A.march - 0.2} out={o} line1="Loretta, 17" line2="church basement · March 1962" />);
  P(A.hazel, A.watched, (t, o) => <N.HazelCard t={t} a={A.hazel} out={o} />);
  P(A.q1 - 0.3, A.nextm - 0.3, (t, o) => <N.InkQuote t={t} a={A.q1 - 0.3} out={o} l1="The dough doesn't tell me when to bake." l2="I tell the dough." a2={A.q2} />);
  // r5 fuera: PL(A.nextm, A.icebox - 0.2, (t, o) => <N.BowlWeek t={t} a={A.nextm} marks={[A.nextm + 0.4, A.mon, A.tue, A.wed]} />);
  Z("ice", A.icebox, A.mymom, "note", "WHAT IT'S CALLED", "Icebox rolls · refrigerator dough");
  Z("since", A.always, A.always + 5, "note", "EVERY WEEK", "A bowl in the refrigerator since 1962");
  P(A.cold - 0.2, A.need - 0.3, (t, o) => <N.SleepyYeast t={t} a={A.cold - 0.2} out={o} />);
  Z("why", A.busy, A.need - 0.3, "tip", "WHY IT WORKS", "You decide when it bakes, not the dough");

  // ===== la receta =====
  PL(A.need, A.s1 - 0.2, (t, o) => <N.Ingredients t={t} title="ONE BOWL · 24 ROLLS" out={o} rows={[
    { at: A.r1, txt: "1 CUP MILK" }, { at: A.r2, txt: "1 STICK BUTTER (½ CUP)" }, { at: A.r3, txt: "½ CUP SUGAR" }, { at: A.r4, txt: "1½ TSP SALT" },
    { at: A.r5, txt: "2 PACKETS ACTIVE DRY YEAST" }, { at: A.r6, txt: "½ CUP WARM WATER" }, { at: A.r7, txt: "2 EGGS" }, { at: A.r8, txt: "ABOUT 6 CUPS FLOUR" }]} />);
  STEP("s1", A.s1, A.truth - 0.2, 1, "Warm milk, butter, sugar, salt · just until the butter melts");
  P(A.scald, A.wrist - 0.4, (t, o) => <N.MilkPans t={t} at={A.scald} out={o} />);
  P(A.wrist - 0.2, A.s2 - 0.2, (t, o) => <N.WristThermo t={t} a={A.wrist - 0.2} out={o} />);
  STEP("s2", A.s2, A.ten - 0.2, 2, "½ cup warm water · sprinkle in the yeast");
  // r5 fuera: P(A.ten, A.m1 - 0.3, (t, o) => <N.EggTimer t={t} a={A.ten} out={o} mins={10} label="FOAMY & CREAMY = ALIVE" />);
  MIS("m1", A.m1, A.s3 - 0.2, 1, "Hot milk kills the yeast · 110°F, warm on your wrist");
  STEP("s3", A.s3, A.strings - 0.2, 3, "Yeast + milk + 2 eggs + 3 cups flour");
  P(A.beat, A.strings - 0.3, (t, o) => <N.BeatClock t={t} at={A.beat} out={o} label="BEAT 2 FULL MINUTES" />);
  P(A.strings - 0.2, A.s4 - 0.2, (t, o) => <N.StringySpoon t={t} a={A.strings - 0.2} out={o} />);
  P(A.s4, A.knead - 0.2, (t, o) => <N.FlourRange t={t} a={A.s4} out={o} />);
  Z("knead", A.knead, A.m2 - 0.2, "tip", "STEP 4", "Knead only 5 minutes · push, fold, quarter turn");
  MIS("m2", A.m2, A.s5 - 0.2, 2, "Too much flour · a stiff dough is a rock");
  P(A.m2, A.s5 - 0.3, (t, o) => <N.DoughToRock t={t} a={A.m2} out={o} at3={A.rock} />);
  STEP("s5", A.s5, A.eight - 0.2, 5, "Butter the bowl · turn the dough once · cover TIGHT");
  // r5 fuera: P(A.fridge - 0.3, A.m3 - 0.3, (t, o) => <N.FridgeMap t={t} a={A.fridge - 0.3} out={o} door={A.door} shelf={A.fridge + 0.6} />);
  Z("8h", A.eight, A.m3 - 0.2, "note", "IN THE COLD", "At least 8 hours · keeps up to 4 days");
  MIS("m3", A.m3, A.check - 0.2, 3, "A loose cover · a dish towel is not a lid");
  P(A.check, A.promised - 0.3, (t, o) => <N.PunchDown t={t} a={A.check} out={o} hit={A.fist + 0.3} />);

  // ===== el recibo =====
  PL(A.promised, A.honest - 0.2, (t, o) => <N.Receipt62 t={t} out={o} sumAt={A.c_83} ovenAt={A.c_ov} totAt={A.c_98} perAt={A.c_4} rows={[
    { at: A.c_fl, item: "FLOUR, 1⅔ LB", c: 19 }, { at: A.c_ye, item: "YEAST, 2 PKT", c: 16 }, { at: A.c_mi, item: "MILK, 1 CUP", c: 7 }, { at: A.c_bu, item: "BUTTER, ½ CUP", c: 19 },
    { at: A.c_br, item: "BUTTER, TOPS", c: 9 }, { at: A.c_eg, item: "EGGS, 2", c: 9 }, { at: A.c_su, item: "SUGAR", c: 3 }, { at: A.c_sa, item: "SALT", c: 1 }]} />);
  PL(A.honest, A.aisle - 0.2, (t, o) => <N.CoinStack t={t} out={o} totAt={A.d_516} perAt={A.d_21} rows={[
    { at: A.d_fl, item: "FLOUR", c: 99 }, { at: A.d_ye, item: "YEAST", c: 100 }, { at: A.d_mi, item: "MILK", c: 24 }, { at: A.d_bu, item: "BUTTER", c: 112 },
    { at: A.d_br, item: "BUTTER, TOPS", c: 42 }, { at: A.d_eg, item: "EGGS", c: 50 }, { at: A.d_su, item: "SUGAR", c: 16 }, { at: A.d_sa, item: "SALT", c: 1 }, { at: A.d_ov, item: "OVEN", c: 72 }]} />);
  Z("jar", A.jar, A.aisle - 0.2, "tip", "LORETTA'S TRICK", "Yeast in the jar · about 19¢ a roll");
  PL(A.aisle, A.mist1 - 0.2, (t, o) => <N.PerRollTags t={t} a={A.t29 - 0.2} b={A.t40} c={A.half} out={o} s={A.aisle} />);
  PL(A.mist1, A.slept - 0.2, (t, o) => <N.YeastRefund t={t} a={A.mist1} strike={A.x3 + 0.6} back={A.back8} gum={A.gum} out={o} />);

  // ===== cada día · los cinco panes =====
  PL(A.every, A.day1 - 0.2, (t, o) => <N.DailyRail t={t} out={o} marks={[A.pinch, A.shapec, A.rise, A.o375, A.brush]} />);
  Z("d1", A.day1, A.pan913 - 0.2, "name", "DAY 1", "Sunday pan rolls", { sub: "2 OZ EACH · SMOOTH LIKE A BALLOON" });
  PL(A.pan913 - 0.2, A.gaps + 5, (t, o) => <N.PanGrid t={t} a={A.pan913 - 0.2} out={o} rise={A.gaps - 0.6} />);
  Z("d2", A.day2, A.stack - 0.2, "name", "DAY 2", "Butterflake rolls · fan-tans", { sub: "⅛ INCH THIN · 1½ INCH STRIPS" });
  PL(A.muffin - 4, A.fan + 3.5, (t, o) => <N.StripTower t={t} a={A.muffin - 4} out={o} fan={A.fan} mu={A.muffin} />);
  Z("d3", A.day3, A.garlic - 0.2, "name", "DAY 3", "Knots · tuck the end under");
  P(A.rope - 0.2, A.garlic - 0.3, (t, o) => <N.RopeRuler t={t} a={A.rope - 0.2} out={o} knot={A.knot} />);
  Z("garl", A.garlic, A.day4 - 0.2, "tip", "THE KNIGHTS OF COLUMBUS", "Garlic butter on the hot knots");
  Z("d4", A.day4, A.hb2 - 0.2, "name", "DAY 4", "Butterhorns · for the 50th anniversaries");
  P(A.circle - 0.2, A.hb2 - 0.3, (t, o) => <N.TwelveWedges t={t} a={A.circle - 0.2} out={o} roll={A.wide} />);
  // r5 fuera: P(A.hb2 - 0.2, A.losing - 0.2, (t, o) => <N.HoneyButter t={t} a={A.hb2 - 0.2} b={A.hb1} out={o} />);
  P(A.estate - 0.3, A.p42 - 0.2, (t, o) => <N.EstateSale t={t} a={A.estate - 0.3} out={o} />);
  BOOK("cta2", A.whywrote, A.fifthb - 0.2, "LOOSE-MEAT BUNS P. 42 · CROWD CHART P. 7");
  Z("d5", A.fifthb, A.bazaar + 4, "name", "THE FIFTH BREAD", "The bazaar bun");
  P(A.nine - 0.3, A.three + 3, (t, o) => <N.BazaarClock t={t} a={A.nine - 0.3} out={o} gone={A.gone} />);
  PL(A.press - 3.8, A.press + 3.5, (t, o) => <N.PressDisk t={t} a={A.press - 3.8} out={o} press={A.press} tennis={A.tennis} />);
  Z("bun", A.eggw, A.cool - 0.2, "tip", "THE SHINY TOP", "Egg + 1 tbsp water · 375°F · about 18 min");
  Z("b14", A.b14, A.nov - 0.2, "note", "HOW MANY", "1 bowl ≈ 14 buns · 3 bowls ≈ 40");

  // ===== cocina fría · errores 4 y 5 =====
  PL(A.lowest - 0.2, A.water + 4, (t, o) => <N.ProofOven t={t} a={A.lowest - 0.2} light={A.light} water={A.water} out={o} />);
  Z("melt", A.melted, A.m4 - 0.2, "warn", "BEFORE YOU BAKE", "Take the rolls out first");
  MIS("m4", A.m4, A.m5 - 0.2, 4, "Rushing cold dough · wait for the dimple");
  P(A.finger - 0.2, A.m5 - 0.3, (t, o) => <N.DimpleTest t={t} a={A.finger - 0.2} out={o} ok={A.dimple} />);
  // r5: minutos 25, 29 y 30
  PL(A.sun4 - 1.2, A.fresh4 + 2.6, (t, o) => <N.FourANight t={t} a={A.sun4 - 1.2} out={o} d1={A.sun4} d2={A.mon4} d3={A.tue4} fresh={A.fresh4} />);
  PL(A.wk - 0.5, A.tempt + 2.6, (t, o) => <N.WeekNo t={t} a={A.wk - 0.5} out={o} no={A.nofour} tempt={A.tempt} />);
  PL(A.rcmilk - 0.4, A.rcbeat + 2.4, (t, o) => <N.IntoTheBowl t={t} a={A.rcmilk - 0.4} out={o} at={[A.rcmilk, A.rcbut, A.rcsug, A.rcsalt, A.rcyeast, A.rcegg, A.rcflour]} warm={A.rcsalt + 1.6} beat={A.rcbeat} />);
  MIS("m5", A.m5, A.allfive - 0.2, 5, "Shaping it warm · shape it cold");
  Z("five", A.allfive, A.howmuch - 0.2, "list", "THE 5 MISTAKES", "", { items: [
    { at: A.f1, txt: "HOT MILK" }, { at: A.f2, txt: "TOO MUCH FLOUR" }, { at: A.f3, txt: "LOOSE LID" }, { at: A.f4, txt: "RUSHING COLD DOUGH" }, { at: A.f5, txt: "SHAPING WARM" }] });

  // ===== cuánto, cuánto dura, la semana =====
  PL(A.perp - 0.3, A.twohalf + 5, (t, o) => <N.CrowdMath t={t} a={A.perp} b={A.forty} c={A.twohalf} out={o} />);
  Z("12", A.oneortwo, A.keep4 - 0.2, "tip", "FOR 1 OR 2 PEOPLE", "Bake 4 a night · nothing goes stale");
  Z("4d", A.keep4, A.freeze - 0.2, "warn", "THE RULE", "4 days in the refrigerator · raw eggs");
  P(A.freeze - 0.2, A.week - 0.3, (t, o) => <N.FreezerSteps t={t} a={A.freeze - 0.2} bag={A.fbag} month={A.month} out={o} />);
  PL(A.week, A.never - 0.2, (t, o) => <N.WeekBoard t={t} out={o} rows={[
    { at: A.w_sat, d: "Sat", w: "make the bowl · 15 min" }, { at: A.w_sun, d: "Sun", w: "pan rolls" }, { at: A.w_mon, d: "Mon", w: "4 butterflakes" },
    { at: A.w_tue, d: "Tue", w: "garlic knots" }, { at: A.w_wed, d: "Wed", w: "butterhorns or buns" }, { at: A.w_wedn, d: "Wed pm", w: "freeze the rest" }, { at: A.w_new, d: "Sat", w: "a new bowl" }]} />);
  PL(A.n1 - 0.2, A.qa - 0.2, (t, o) => <N.NeverCard t={t} out={o} notyet={A.notyet} rows={[
    { at: A.n1, txt: "a towel in the refrigerator" }, { at: A.n2, txt: "the bowl in the door" }, { at: A.n3, txt: "a floured counter" },
    { at: A.n4, txt: "a bowl past 4 days" }, { at: A.n5, txt: "a roll that hadn't risen" }]} />);
  PL(A.qa1 - 0.3, A.together - 0.2, (t, o) => <N.AskMail t={t} out={o} rows={[
    { at: A.qa1, q: "Instant yeast?", ans: "Yes · 4 tsp, skip the foam" }, { at: A.qa2, q: "No eggs?", ans: "+¼ cup milk · keeps 5 days" },
    { at: A.qa3, q: "Bread machine?", ans: "Dough setting, then the fridge" }, { at: A.qa4, q: "Bread flour?", ans: "Yes · a little chewier" },
    { at: A.qa5, q: "Knots came untied?", ans: "Tuck the end under" }, { at: A.qa6, q: "A whole week in the fridge?", ans: "No, honey. Four days." }]} />);

  // ===== cierre =====
  Z("all", A.together, A.everyday - 0.2, "list", "THE WHOLE BOWL", "", { items: [
    { at: A.together + 3, txt: "WARM, NOT HOT" }, { at: A.together + 8, txt: "FOAM THE YEAST" }, { at: A.together + 13, txt: "BEAT 2 MIN" }, { at: A.together + 19, txt: "SOFT · KNEAD 5" }, { at: A.together + 24, txt: "COVER TIGHT · 8 H–4 DAYS" }] });
  P(A.l62 - 0.3, A.died - 0.3, (t, o) => <N.KitchenScale t={t} a={A.l62 - 0.3} b={A.ltoday} c={A.ltoday + 3.2} out={o} />);
  P(A.still - 0.2, A.ask - 0.2, (t, o) => <N.KeptBowl t={t} a={A.still - 0.2} b={A.funeral - 0.3} out={o} />);
  Z("ask", A.ask, A.book3 - 0.2, "note", "TELL ME", "What bread did your church make? · and where");
  BOOK("cta3", A.book3, A.go + 3, "LINK IN THE 1ST LINE OF THE DESCRIPTION");

  // un objeto a la vez: cada uno se va antes de que entre el siguiente
  L.sort((p, q) => p.a - q.a).forEach((p, i, arr) => { const nx = arr[i + 1]; if (nx) p.out = Math.min(p.out, nx.a - 0.75); });
  return { P: L, Z: ZS };
};

export const pieces = (t: number, _h: Kit, _TEND: number): React.ReactNode[] => {
  if (!BUILT) BUILT = build();
  const out: React.ReactNode[] = [];
  BUILT.P.forEach((p, i) => { if (t >= p.a - 0.3 && t <= p.out + 1) out.push(<React.Fragment key={"p" + i}>{p.r(t, p.out)}</React.Fragment>); });
  out.push(<ZocaloStack key="zs" t={t} items={BUILT.Z} />);
  return out;
};
