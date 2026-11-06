// ck5nd · piezas ancladas a la palabra (anclas.json = D:/rtmp/ck5n_anclas.py sobre la voz). Un componente distinto por momento
// (kitD.tsx; registro de la tanda en D:/rtmp/ck5n_COMPONENTES.md) + zócalo abajo-izq para pasos, errores y notas.
// Los objetos viven a la derecha y no se pisan: cada uno sale antes de que entre el siguiente (out recortado al próximo).
import React from "react";
import { Kit } from "../kits/yanqui3d/engine";
import { ZItem, ZocaloStack } from "./ui";
import * as N from "./kitD";
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
  PL(A.phone7 + 0.3, A.thiscard - 0.3, (t, o) => <N.WallPhone7 t={t} a={A.phone7 + 0.3} out={o} m={[A.pastor, A.thursday11, A.fifty0, A.twodays]} />);
  PL(A.thiscard - 0.2, A.imlor - 0.3, (t, o) => <N.Card7Reveal t={t} a={A.thiscard - 0.2} out={o} m={[A.yellow, A.l7, A.y1971]} />);
  Z("name", A.imlor, A.imlor + 6, "name", "LORETTA · 81", "60 years in the church basement kitchen", { sub: "SMALL-TOWN IOWA" });
  Z("plan", A.everyline, A.everyline + 9, "note", "TODAY", "Every line · what it costs · the 2-day schedule");
  PL(A.cents12 - 1, A.p7 - 0.3, (t, o) => <N.HundredMiles t={t} a={A.cents12 - 1} out={o} m={[A.cents12, A.miles100, A.end]} />);
  PL(A.p7 - 0.2, A.link0 + 3, (t, o) => <N.CrowdChart t={t} a={A.p7 - 0.2} out={o} m={[A.crowd, A.mostused, A.fifty]} />);
  BOOK("cta1", A.link0, A.committee - 0.3, "CROWD CHART P. 7 · 50 RECIPES · LINK IN THE 1ST LINE");

  // ===== cómo funcionaba =====
  PL(A.committee - 0.2, A.bring - 0.3, (t, o) => <N.PhoneTree t={t} a={A.committee - 0.2} out={o} m={[A.eight, A.calledfirst, A.halfhour, A.number3, A.hernum]} />);
  PL(A.bring - 0.2, A.three5 - 0.3, (t, o) => <N.WhatBring t={t} a={A.bring - 0.2} out={o} m={[A.bring, A.work]} />);
  PL(A.three5 - 0.3, A.sat - 0.3, (t, o) => <N.Winter71 t={t} a={A.three5 - 0.3} out={o} m={[A.three5, A.twopotato, A.noveg, A.ranout]} />);
  PL(A.sat - 0.2, A.line1 - 0.3, (t, o) => <N.CupboardDoor t={t} a={A.sat - 0.2} out={o} m={[A.sat, A.inorder, A.cupboard]} />);

  // ===== renglón 1 · jamón =====
  Z("l1", A.line1, A.line1 + 7, "tip", "LINE 1", "Ham");
  PL(A.line1 - 0.2, A.howmuch - 0.3, (t, o) => <N.HamWhy t={t} a={A.line1 - 0.2} out={o} m={[A.cooked, A.slices, A.home, A.november]} />);
  PL(A.howmuch - 0.2, A.d275 - 0.5, (t, o) => <N.HamMath t={t} a={A.howmuch - 0.2} out={o} m={[A.twenty24, A.use20, A.twohams, A.d149, A.c2980]} />);
  Z("p38", A.p38, A.p38 + 6, "note", "PAGE 38", "The ham · low and slow");
  PL(A.d275 - 0.4, A.glaze - 0.3, (t, o) => <N.LowSlow t={t} a={A.d275 - 0.4} out={o} m={[A.d275, A.halfwater, A.perlb, A.twohalf, A.athome]} />);
  PL(A.glaze - 0.2, A.t140 - 0.3, (t, o) => <N.GlazeLast t={t} a={A.glaze - 0.2} out={o} m={[A.brownsugar, A.d400, A.sticky, A.burns, A.c320]} />);
  Z("safe", A.t140, A.t140 + 9, "warn", "SAFE TEMP", "Warm it to 140°F · keep it at 140°F or above", { sub: "FOOD SAFETY · PAGE 9" });
  PL(A.shingles - 0.4, A.line2 - 0.3, (t, o) => <N.Shingles t={t} a={A.shingles - 0.4} out={o} m={[A.shingles, A.juice, A.thick, A.thin3, A.feelmore]} />);

  // ===== renglón 2 · papas =====
  Z("l2", A.line2, A.line2 + 7, "tip", "LINE 2", "Funeral potatoes");
  PL(A.line2 - 0.2, A.p33 - 0.3, (t, o) => <N.FourNames t={t} a={A.line2 - 0.2} out={o} m={[A.funpot, A.names, A.dropped, A.spoon]} />);
  PL(A.p33 - 0.2, A.trick - 0.3, (t, o) => <N.PotatoList t={t} a={A.p33 - 0.2} out={o} m={[A.i1, A.i2, A.i3, A.i4, A.i5, A.i6, A.i7]} />);
  PL(A.trick - 0.2, A.mix - 0.3, (t, o) => <N.WringTowel t={t} a={A.trick - 0.2} out={o} m={[A.towel, A.wring, A.amazed, A.soup, A.skipped]} />);
  STEP("s1", A.towel, A.towel + 9, 1, "Thaw the hash browns · wring them in a towel");
  PL(A.mix - 0.2, A.scoops - 0.3, (t, o) => <N.FlakeRain t={t} a={A.mix - 0.2} out={o} m={[A.fold, A.toss, A.bake350, A.golden]} />);
  STEP("s2", A.bake350, A.bake350 + 8, 2, "350°F · uncovered · 50 to 55 minutes");
  PL(A.scoops - 0.2, A.onepan - 0.3, (t, o) => <N.ScoopPans t={t} a={A.scoops - 0.2} out={o} m={[A.scoops, A.halfcup, A.fourpans]} />);
  PL(A.onepan - 0.2, A.nightb - 0.3, (t, o) => <N.PanCost t={t} a={A.onepan - 0.2} out={o} m={[A.pc1, A.pc3, A.pc4, A.pc5, A.pc6, A.pc7, A.c1125, A.c45]} />);
  PL(A.nightb - 0.2, A.line3 - 0.3, (t, o) => <N.FridgeNight t={t} a={A.nightb - 0.2} out={o} m={[A.nightb, A.topbag, A.ten]} />);

  // ===== renglón 3 · chauchas =====
  Z("l3", A.line3, A.line3 + 7, "tip", "LINE 3", "Green beans");
  PL(A.line3 - 0.2, A.frozen - 0.3, (t, o) => <N.HeavyPlate t={t} a={A.line3 - 0.2} out={o} m={[A.added, A.heavy, A.lbs10]} />);
  PL(A.frozen - 0.2, A.line4 - 0.3, (t, o) => <N.BaconFat t={t} a={A.frozen - 0.2} out={o} m={[A.noboil, A.bacon, A.onion, A.shiny, A.c1250]} />);

  // ===== renglón 4 · gelatina =====
  Z("l4", A.line4, A.line4 + 7, "tip", "LINE 4", "Jello salad");
  PL(A.line4 - 0.2, A.green - 0.5, (t, o) => <N.OvenFull t={t} a={A.line4 - 0.2} out={o} m={[A.ahead, A.nooven, A.full, A.waiting]} />);
  PL(A.green - 0.4, A.quarts6 - 0.3, (t, o) => <N.LayerSalad t={t} a={A.green - 0.4} out={o} m={[A.green, A.watergate, A.crust, A.creamc, A.strawb, A.gonefirst]} />);
  PL(A.quarts6 - 0.3, A.safety - 0.3, (t, o) => <N.SixQuarts t={t} a={A.quarts6 - 0.3} out={o} m={[A.quarts6, A.c18 - 6, A.c18]} />);
  PL(A.safety - 0.2, A.line5 - 0.3, (t, o) => <N.IceNestCold t={t} a={A.safety - 0.2} out={o} m={[A.d40, A.ice, A.twohr, A.ninety]} />);

  // ===== renglón 5 · panes =====
  Z("l5", A.line5, A.line5 + 7, "tip", "LINE 5", "Rolls");
  PL(A.line5 - 0.2, A.softb - 0.3, (t, o) => <N.SixDozen t={t} a={A.line5 - 0.2} out={o} m={[A.onehalf, A.r72, A.threebatch, A.c1056, A.bakery, A.folded]} />);
  Z("p56", A.p56, A.p56 + 6, "note", "PAGE 56", "Dinner rolls made with potato water");
  PL(A.softb - 0.2, A.line6 - 0.3, (t, o) => <N.SoftButter t={t} a={A.softb - 0.2} out={o} m={[A.softb, A.tearing]} />);

  // ===== renglón 6 · barras =====
  Z("l6", A.line6, A.sheetcake - 0.3, "list", "LINE 6", "Bars", { items: [{ at: A.fingers, txt: "FINGER FOOD · NO FORKS" }, { at: A.onesq, txt: "1 SQUARE A PERSON" }, { at: A.twokinds, txt: "2 KINDS" }] });
  PL(A.sheetcake - 0.3, A.lemon - 0.3, (t, o) => <N.RulerCake t={t} a={A.sheetcake - 0.3} out={o} m={[A.p65, A.warm, A.fudgy, A.fivecuts, A.ruler, A.eyeball]} />);
  PL(A.lemon - 0.2, A.pieces88 - 1.5, (t, o) => <N.LemonSnow t={t} a={A.lemon - 0.2} out={o} m={[A.p64, A.hotcrust, A.wetknife, A.bake24, A.little48, A.snow]} />);
  PL(A.pieces88 - 1.3, A.line7 - 0.3, (t, o) => <N.EightyEight t={t} a={A.pieces88 - 1.3} out={o} m={[A.pieces88, A.never, A.c1550, A.third, A.scotch]} />);

  // ===== renglón 7 · café =====
  Z("l7", A.line7, A.line7 + 7, "tip", "LINE 7", "Coffee");
  PL(A.line7 - 0.2, A.cupahalf - 0.3, (t, o) => <N.AroundUrn t={t} a={A.line7 - 0.2} out={o} m={[A.notdrink, A.urnmen, A.weather, A.sorry, A.laugh]} />);
  PL(A.cupahalf - 0.2, A.scand - 0.3, (t, o) => <N.TwoUrns t={t} a={A.cupahalf - 0.2} out={o} m={[A.cupahalf, A.cups75, A.urn40, A.twourns, A.cost9, A.cents12b]} />);
  Z("egg", A.scand, A.recipe - 0.3, "note", "EGG COFFEE", "Clear as amber · never bitter · from the cheapest can");
  PL(A.recipe - 0.3, A.scrape - 0.3, (t, o) => <N.EggCoffeeA t={t} a={A.recipe - 0.3} out={o} m={[A.recipe, A.cupcoffee, A.crack, A.crush, A.wetsand]} />);
  STEP("e1", A.gallon, A.gallon + 9, 1, "1 gallon of water to a boil · 1 cup of coffee + 1 egg, shell and all");
  PL(A.scrape - 0.2, A.batch5 - 0.3, (t, o) => <N.RaftSink t={t} a={A.scrape - 0.2} out={o} m={[A.scrape, A.boil34, A.raft, A.coldcup, A.sink, A.clearas]} />);
  STEP("e2", A.boil34, A.boil34 + 9, 2, "Boil 3 to 4 minutes · off the heat · 1 cup cold water · settle 10 min");
  PL(A.batch5 - 0.2, A.mostimp - 0.3, (t, o) => <N.UrnHalf t={t} a={A.batch5 - 0.2} out={o} m={[A.batch5, A.rule, A.oldshoe, A.halfempty]} />);
  PL(A.mostimp - 0.2, A.grocery - 0.3, (t, o) => <N.EverybodyHome t={t} a={A.mostimp - 0.2} out={o} m={[A.runham, A.runcoffee]} />);

  // ===== la cuenta =====
  PL(A.grocery - 0.2, A.under40 - 0.3, (t, o) => <N.SevenBars t={t} a={A.grocery - 0.2} out={o} m={[A.grocery, A.total, A.perplate, A.three]} />);
  PL(A.under40 - 0.2, A.fund - 0.3, (t, o) => <N.CatererVs t={t} a={A.under40 - 0.2} out={o} m={[A.under40, A.c69, A.caterer, A.sixteen, A.eighthundred, A.noname]} />);
  PL(A.fund - 0.2, A.signup - 0.3, (t, o) => <N.FundLove t={t} a={A.fund - 0.2} out={o} m={[A.fund, A.onepanea, A.fiftyd, A.love]} />);
  PL(A.signup - 0.2, A.order - 0.3, (t, o) => <N.SignupSheet t={t} a={A.signup - 0.2} out={o} m={[A.bulletin, A.leftside, A.names2, A.tenpct, A.cousin, A.plan55]} />);

  // ===== el día =====
  PL(A.order - 0.2, A.family - 0.3, (t, o) => <N.LineOrder t={t} a={A.order - 0.2} out={o} m={[A.o1, A.o2, A.o3, A.o4, A.o5, A.o6, A.separate, A.across]} />);
  PL(A.family - 0.2, A.never1 - 0.5, (t, o) => <N.FamilyTable t={t} a={A.family - 0.2} out={o} m={[A.downfirst, A.round, A.realplates, A.twous]} />);
  PL(A.never1 - 0.4, A.lefthome - 0.3, (t, o) => <N.PanRelay t={t} a={A.never1 - 0.4} out={o} m={[A.never1, A.keephot, A.getlow, A.smaller, A.twohours]} />);
  Z("two", A.twohours, A.twohours + 8, "warn", "THE 2-HOUR RULE", "Hot stays 140°F · cold stays 40°F · then it's done");
  PL(A.lefthome - 0.2, A.mistakes - 0.3, (t, o) => <N.LeftoverTray t={t} a={A.lefthome - 0.2} out={o} m={[A.alupans, A.tape, A.date, A.fridge2, A.shallow, A.deep]} />);
  PL(A.mistakes - 0.2, A.twod - 0.3, (t, o) => <N.DominoFive t={t} a={A.mistakes - 0.2} out={o} m={[A.m1, A.m2, A.m3, A.m4, A.m5]} />);
  MIS("m1", A.m1, A.m2 - 0.3, 1, "Planning for exactly 50 · always plan 10% more");
  MIS("m2", A.m2, A.m3 - 0.3, 2, "One big pan on the line");
  MIS("m3", A.m3, A.m4 - 0.3, 3, "Starting the coffee last");
  MIS("m4", A.m4, A.m5 - 0.3, 4, "Making the Jello the same day");
  MIS("m5", A.m5, A.twod - 0.3, 5, "Making the family stand in line");
  PL(A.twod - 0.2, A.strict - 0.3, (t, o) => <N.ThreeDayRail t={t} a={A.twod - 0.2} out={o} m={[A.tue, A.wed, A.thu, A.t6, A.t9, A.t10, A.t1030, A.t1045, A.t11, A.t1145]} />);

  // ===== el cierre =====
  PL(A.strict - 0.2, A.thirdfun - 0.3, (t, o) => <N.NeverFive t={t} a={A.strict - 0.2} out={o} m={[A.n1, A.n2, A.n3, A.n4, A.n5, A.sitwith]} />);
  PL(A.thirdfun - 0.2, A.sevenlines - 0.3, (t, o) => <N.DahlOrgan t={t} a={A.thirdfun - 0.2} out={o} m={[A.dahl, A.organ41, A.wholetown, A.covered, A.hat, A.likedcoffee]} />);
  PL(A.sevenlines - 0.2, A.qs - 0.3, (t, o) => <N.PencilMargin t={t} a={A.sevenlines - 0.2} out={o} m={[A.pencil, A.y1974, A.neverchanged]} />);
  PL(A.qs - 0.2, A.again - 0.3, (t, o) => <N.Double100 t={t} a={A.qs - 0.2} out={o} m={[A.q100, A.d1, A.d2, A.d3, A.makers, A.chicken, A.pieces100]} />);
  PL(A.again - 0.2, A.bookcta - 0.3, (t, o) => <N.CardAgain t={t} a={A.again - 0.2} out={o} m={[A.r1, A.r2, A.r3, A.r4, A.r5, A.r6, A.r7, A.sum]} />);
  BOOK("cta2", A.bookcta, A.your - 0.3, "EGG COFFEE · CROWD CHART P. 7 · LINK IN THE 1ST LINE");
  PL(A.your - 0.2, A.ringagain + 4, (t, o) => <N.RingAgain t={t} a={A.your - 0.2} out={o} m={[A.your, A.still, A.ringagain]} />);


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
