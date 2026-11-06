// ck5nc · piezas ancladas a la palabra (anclas.json = D:/rtmp/ck5n_anclas.py sobre la voz). Un componente distinto por momento
// (kitC.tsx; registro de la tanda en D:/rtmp/ck5n_COMPONENTES.md) + zócalo abajo-izq para pasos, errores y notas.
// Los objetos viven a la derecha y no se pisan: cada uno sale antes de que entre el siguiente (out recortado al próximo).
import React from "react";
import { Kit } from "../kits/yanqui3d/engine";
import { ZItem, ZocaloStack } from "./ui";
import * as N from "./kitC";
import EDL from "./edl.json";
import AN from "./anclas.json";

const A = AN as Record<string, number>;
type P = { a: number; out: number; r: (t: number, out: number) => React.ReactNode };
let BUILT: { P: P[]; Z: ZItem[] } | null = null;

const build = (): { P: P[]; Z: ZItem[] } => {
  const L: P[] = [], ZS: ZItem[] = [];
  const P = (a: number, out: number, r: P["r"]) => L.push({ a, out: Math.min(out, a + 9), r });
  const PL = (a: number, out: number, r: P["r"]) => L.push({ a, out, r });
  const Z = (key: string, a: number, out: number, tone: ZItem["tone"], label: string, txt: string, x: Partial<ZItem> = {}) => ZS.push({ key, a, out, tone, label, txt, ...x });
  const STEP = (key: string, a: number, out: number, n: number, txt: string) => Z(key, a, out, "tip", `STEP ${n}`, txt);
  const MIS = (key: string, a: number, out: number, n: number, txt: string) => Z(key, a, out, "warn", "MISTAKE", txt, { n });
  const BOOK = (key: string, a: number, out: number, sub: string) => Z(key, a, out, "book", "MY COOKBOOK", "Loretta's Church Supper Cookbook", { sub });


  // ===== gancho =====
  PL(A.organ - 0.5, A.halfgone - 0.3, (t, o) => <N.ClockUrns t={t} a={A.organ - 0.5} out={o} m={[A.fortybuns, A.fiftyfive]} />);
  PL(A.halfgone - 0.2, A.everyiowa - 0.3, (t, o) => <N.GoneEarly t={t} a={A.halfgone - 0.2} out={o} m={[A.halfgone, A.pallb0, A.pastorw0, A.director0]} />);
  Z("name", A.imlor, A.imlor + 6, "name", "LORETTA · 81", "60 years in the church basement kitchen", { sub: "SMALL-TOWN IOWA" });
  PL(A.sixty - 0.3, A.onepan - 0.3, (t, o) => <N.Tally600 t={t} a={A.sixty - 0.3} out={o} m={[A.sixty, A.six100]} />);
  PL(A.toforty, A.p38 - 0.3, (t, o) => <N.WrongTeaser t={t} a={A.toforty} out={o} m={[A.arlene0, A.wrong0, A.disappear]} />);
  PL(A.p38 - 0.3, A.link0 + 3, (t, o) => <N.CookbookTabs t={t} a={A.p38 - 0.3} out={o} m={[A.p38, A.p41, A.fifty]} />);
  BOOK("cta1", A.link0, A.feb61 - 0.3, "HAM BUNS P. 38 · HAM BALLS P. 41 · LINK IN THE 1ST LINE");

  // ===== 1961 =====
  PL(A.feb61 - 0.3, A.flu - 0.3, (t, o) => <N.MilkTruck61 t={t} a={A.feb61 - 0.3} out={o} m={[A.sixteen, A.milktruck, A.chocmilk]} />);
  PL(A.plain - 0.3, A.twopans - 0.3, (t, o) => <N.PlainBun61 t={t} a={A.plain - 0.3} out={o} m={[A.mustard0, A.dry, A.roaster, A.nosecond]} />);
  PL(A.twopans - 0.2, A.hamstart - 0.3, (t, o) => <N.TwoPansFamily t={t} a={A.twopans - 0.2} out={o} m={[A.anything, A.notone, A.setaside]} />);
  Z("rule1", A.setaside, A.setaside + 7, "note", "MY MOTHER'S RULE", "Always set one pan aside for the family");

  // ===== jamón =====
  PL(A.twoways, A.deli - 0.3, (t, o) => <N.HamOven t={t} a={A.twoways} out={o} m={[A.d275, A.perlb, A.pull140]} />);
  PL(A.deli - 0.2, A.howmuch - 0.3, (t, o) => <N.ShavedThick t={t} a={A.deli - 0.2} out={o} m={[A.shaved, A.newspaper, A.shoe, A.tears]} />);
  PL(A.howmuch - 0.2, A.buns - 0.3, (t, o) => <N.OunceMath t={t} a={A.howmuch - 0.2} out={o} m={[A.q34, A.oneoz, A.forty25]} />);

  // ===== armar =====
  PL(A.sheet - 0.5, A.howdo - 0.3, (t, o) => <N.SlabSheet t={t} a={A.sheet - 0.5} out={o} m={[A.sheet, A.dontpull, A.sideways, A.halfhour]} />);
  STEP("s1", A.howdo, A.howdo + 9, 1, "Cut the whole slab in half sideways · don't separate");
  PL(A.howdo - 0.2, A.fold - 0.3, (t, o) => <N.FlatHand t={t} a={A.howdo - 0.2} out={o} m={[A.serrated, A.flathand, A.slide, A.scar]} />);
  STEP("s2", A.fold, A.fold + 9, 2, "Fold the ham like an accordion · edge to edge");
  PL(A.fold - 0.2, A.cheese - 0.3, (t, o) => <N.AccordionFold t={t} a={A.fold - 0.2} out={o} m={[A.accordion, A.pockets, A.blanket, A.edge]} />);
  STEP("s3", A.cheese, A.cheese + 9, 3, "6 thin slices of Swiss · top half back on");
  PL(A.cheese - 0.2, A.arlene1978 - 0.3, (t, o) => <N.CheeseTiles t={t} a={A.cheese - 0.2} out={o} m={[A.sixslices, A.thinsame, A.rubbery, A.topback]} />);

  // ===== Arlene y el glaseado =====
  PL(A.arlene1978 - 0.2, A.potof - 0.3, (t, o) => <N.Arlene78 t={t} a={A.arlene1978 - 0.2} out={o} m={[A.cedar, A.tractor, A.card7, A.poppy0]} />);
  PL(A.potof - 0.2, A.cardhere - 0.3, (t, o) => <N.PourBetween t={t} a={A.potof - 0.2} out={o} m={[A.instead, A.spooned, A.ruined, A.shiny, A.gone40]} />);
  PL(A.cardhere - 0.2, A.g1 - 0.3, (t, o) => <N.ArleneCard t={t} a={A.cardhere - 0.2} out={o} m={[A.stain, A.between, A.twice]} />);
  PL(A.g1 - 0.2, A.trick1 - 0.3, (t, o) => <N.GlazeFive t={t} a={A.g1 - 0.2} out={o} m={[A.g1, A.g2, A.yellowok, A.g3, A.g4, A.g5]} />);
  STEP("s4", A.melt, A.melt + 9, 4, "Melt the butter · onion in for 1 minute first");
  PL(A.trick1 - 0.2, A.wrongplace - 0.3, (t, o) => <N.OnionSponge t={t} a={A.trick1 - 0.2} out={o} m={[A.melt, A.oneminute, A.sponges, A.swell, A.golden]} />);
  PL(A.wrongplace - 0.2, A.wait - 0.3, (t, o) => <N.BrushSpoon t={t} a={A.wrongplace - 0.2} out={o} m={[A.brushtop, A.drybread, A.spoonnot, A.downlines, A.tobottom]} />);
  STEP("s5", A.downlines, A.downlines + 10, 5, "Spoon it down the cracks, both ways · the rest on top");
  PL(A.wait - 0.2, A.nightbefore - 0.3, (t, o) => <N.TenRest t={t} a={A.wait - 0.2} out={o} m={[A.ten, A.drink, A.heavier]} />);
  PL(A.nightbefore - 0.2, A.bake - 0.3, (t, o) => <N.NightBefore t={t} a={A.nightbefore - 0.2} out={o} m={[A.visitation, A.allnight, A.monday, A.tuesdaym]} />);

  // ===== hornear =====
  STEP("s6", A.bake, A.bake + 10, 6, "350°F · covered in foil 20 min · then 5 uncovered");
  PL(A.bake - 0.2, A.foiloff - 0.3, (t, o) => <N.FoilSteam t={t} a={A.bake - 0.2} out={o} m={[A.d350, A.crimp, A.tw20, A.steamroom, A.scorch]} />);
  PL(A.foiloff - 0.2, A.hotall - 0.3, (t, o) => <N.FarSide t={t} a={A.foiloff - 0.2} out={o} m={[A.farside, A.burns, A.five, A.toast]} />);
  PL(A.hotall - 0.2, A.onetoforty - 0.3, (t, o) => <N.CenterCold t={t} a={A.hotall - 0.2} out={o} m={[A.coldest, A.pushit, A.want140, A.if120]} />);
  Z("safe", A.p9, A.p9 + 8, "warn", "FOOD SAFETY · PAGE 9", "140°F in the center bun · and keep it there");

  // ===== de una a cuarenta =====
  PL(A.howmany - 0.3, A.fullmeal - 0.3, (t, o) => <N.HeadCount t={t} a={A.howmany - 0.3} out={o} m={[A.obit, A.cars, A.maybe60, A.perperson]} />);
  Z("p7", A.p7, A.p7 + 6, "note", "PAGE 7", "My chart for feeding a crowd");
  Z("meal", A.fullmeal, A.math - 0.3, "list", "HOW MANY BUNS", "", { items: [{ at: A.fullmeal + 0.5, txt: "FULL MEAL · 1 PER PERSON" }, { at: A.twoper, txt: "BUNS ARE THE MAIN DISH · 2" }] });
  PL(A.math - 0.5, A.fourpk - 0.3, (t, o) => <N.PanMath t={t} a={A.math - 0.5} out={o} m={[A.twelvepan, A.third, A.fourpans, A.fortyeight, A.extra8]} />);
  PL(A.fourpk - 0.2, A.cost - 0.3, (t, o) => <N.TimesFour t={t} a={A.fourpk - 0.2} out={o} m={[A.fourpk, A.oz48, A.slices24, A.sticks4, A.tbsp6, A.tbsp4o, A.tsp4]} />);
  PL(A.cost - 0.2, A.oneoven - 0.3, (t, o) => <N.Receipt57 t={t} a={A.cost - 0.2} out={o} m={[A.r1, A.r2, A.r3, A.r4, A.r5, A.total, A.perbun, A.y1978, A.fund]} />);
  PL(A.oneoven - 0.2, A.where - 0.3, (t, o) => <N.RackSwap t={t} a={A.oneoven - 0.2} out={o} m={[A.sidebyside, A.switch, A.browns]} />);

  // ===== la línea, la incursión y la caja =====
  PL(A.where - 0.2, A.pallb - 0.3, (t, o) => <N.BuffetLine t={t} a={A.where - 0.2} out={o} m={[A.l1, A.l2, A.l3, A.l4, A.l5, A.l6, A.attheend, A.ontop]} />);
  PL(A.pallb - 0.2, A.notcooking - 0.3, (t, o) => <N.KitchenRaid t={t} a={A.pallb - 0.2} out={o} m={[A.grandsons, A.hand1, A.hb2, A.hb3, A.hb4, A.panfirst]} />);
  PL(A.notcooking - 0.2, A.mistakes - 0.3, (t, o) => <N.FamilyBox t={t} a={A.notcooking - 0.2} out={o} m={[A.eightof, A.wrapfoil, A.tape, A.marker, A.six, A.nine]} />);

  // ===== errores, reglas, preguntas =====
  PL(A.mistakes - 0.2, A.rules - 0.3, (t, o) => <N.FiveRuined t={t} a={A.mistakes - 0.2} out={o} m={[A.m1, A.m2, A.m3, A.m4, A.m5]} />);
  MIS("m1", A.m1, A.m1 + 9, 1, "Dry bread on the bottom · spoon it into the cracks");
  MIS("m2", A.m2, A.m2 + 12, 2, "Soggy bottom · never an hour warm before baking");
  MIS("m3", A.m3, A.m3 + 7, 3, "Cheese that won't melt · thin slices");
  MIS("m4", A.m4, A.m4 + 9, 4, "Burnt poppy seeds · foil on for the first 20");
  MIS("m5", A.m5, A.m5 + 10, 5, "Cold in the middle · thermometer in the center bun");
  PL(A.rules - 0.2, A.qs - 0.3, (t, o) => <N.NeverStamps t={t} a={A.rules - 0.2} out={o} m={[A.n1, A.n2, A.n3, A.n4, A.n5]} />);
  PL(A.qs - 0.2, A.q3 - 0.3, (t, o) => <N.AheadFreeze t={t} a={A.qs - 0.2} out={o} m={[A.q1, A.h24, A.q2, A.beforeglaze, A.month]} />);
  PL(A.q3 - 0.2, A.q5 - 0.3, (t, o) => <N.SwapCards t={t} a={A.q3 - 0.2} out={o} m={[A.q3, A.q4, A.sesame]} />);
  PL(A.q5 - 0.2, A.scraps - 0.3, (t, o) => <N.SmallPans t={t} a={A.q5 - 0.2} out={o} m={[A.twohours, A.days34, A.smallpans, A.onepanline, A.downto]} />);
  Z("two", A.includes, A.includes + 8, "warn", "THE 2-HOUR RULE", "The time on the serving line counts too");
  PL(A.scraps - 0.2, A.theclock - 0.3, (t, o) => <N.HamBalls t={t} a={A.scraps - 0.2} out={o} m={[A.grinder, A.hb1, A.graham, A.golf, A.t160, A.castiron]} />);
  Z("p41", A.p41b, A.p41b + 6, "note", "PAGE 41", "Iowa ham balls · 160°F in the middle");

  // ===== el reloj y el cierre =====
  PL(A.theclock - 0.2, A.y1989 - 0.3, (t, o) => <N.ClockMorning t={t} a={A.theclock - 0.2} out={o} m={[A.t1030, A.t11, A.t1115, A.t1130, A.t12]} />);
  PL(A.y1989 - 0.3, A.together - 0.3, (t, o) => <N.CardInBox t={t} a={A.y1989 - 0.3} out={o} m={[A.y1989, A.y2019, A.nf91, A.cardbox]} />);
  PL(A.together - 0.2, A.forty40 + 3, (t, o) => <N.ExplodedBun t={t} a={A.together - 0.2} out={o} m={[A.ra, A.rb, A.rc, A.rd, A.rf, A.rg]} />);
  Z("forty", A.forty40, A.bookcta - 0.3, "list", "FOR 40 PEOPLE", "", { items: [{ at: A.forty40 + 0.4, txt: "4 PANS · 48 BUNS" }, { at: A.forty40 + 2, txt: "8 FOR THE FAMILY BOX" }] });
  BOOK("cta2", A.bookcta, A.hear - 0.3, "HAM BALLS P. 41 · CROWD CHART P. 7 · LINK IN THE 1ST LINE");
  PL(A.hear - 0.2, A.foilend + 4, (t, o) => <N.LastFoil t={t} a={A.hear - 0.2} out={o} m={[A.yourarlene, A.bighand, A.foilend]} />);

  // un objeto a la vez: cada uno se va antes de que entre el siguiente
  L.sort((p, q) => p.a - q.a).forEach((p, i, arr) => { const nx = arr[i + 1]; if (nx) p.out = Math.min(p.out, nx.a - 1.05); });
  // nada encima de Loretta: cada objeto termina su salida antes de que entre la ventana del avatar
  const AVS = (EDL as { shots: { a: number; b: number; k: string }[] }).shots.filter((x) => x.k === "av").map((x) => x.a);
  L.forEach((p) => { const nx = AVS.find((v) => v > p.a + 0.5); if (nx !== undefined) p.out = Math.min(p.out, nx - 1.05); });
  return { P: L, Z: ZS };
};

export const pieces = (t: number, _h: Kit, _TEND: number): React.ReactNode[] => {
  if (!BUILT) BUILT = build();
  const out: React.ReactNode[] = [];
  BUILT.P.forEach((p, i) => { if (t >= p.a - 0.3 && t <= p.out + 1) out.push(<React.Fragment key={"p" + i}>{p.r(t, p.out)}</React.Fragment>); });
  out.push(<ZocaloStack key="zs" t={t} items={BUILT.Z} />);
  return out;
};
