// ck5nb · piezas ancladas a la palabra (anclas.json = D:/rtmp/ck5n_anclas.py sobre la voz). Un componente distinto por momento
// (kitB.tsx; registro de la tanda en D:/rtmp/ck5n_COMPONENTES.md) + zócalo abajo-izq para pasos, errores y notas.
// Los objetos viven a la derecha y no se pisan: cada uno sale antes de que entre el siguiente (out recortado al próximo).
import React from "react";
import { Kit } from "../kits/yanqui3d/engine";
import { ZItem, ZocaloStack } from "./ui";
import * as N from "./kitB";
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
  PL(A.chair - 0.2, A.dozen4 - 0.3, (t, o) => <N.ChairWhisk t={t} a={A.chair - 0.2} out={o} m={[A.whisk, A.dontstop, A.choir]} />);
  PL(A.dozen4 - 0.2, A.pantry + 4, (t, o) => <N.DishpanEggs t={t} a={A.dozen4 - 0.2} out={o} m={[A.nomayo, A.pantry]} />);
  P(A.tangier - 0.3, A.imlor - 0.2, (t, o) => <N.SecretPan t={t} a={A.tangier - 0.3} out={o} m={[A.peak, A.plate, A.secret]} />);
  Z("name", A.imlor, A.imlor + 6, "name", "LORETTA · 81", "60 years in the church basement kitchen", { sub: "SMALL-TOWN IOWA" });
  PL(A.before - 1.2, A.six - 0.3, (t, o) => <N.ModernVsBefore t={t} a={A.before - 1.2} out={o} m={[A.before, A.thick, A.exact]} />);
  PL(A.six - 0.2, A.firstempty + 4, (t, o) => <N.SixPlates t={t} a={A.six - 0.2} out={o} m={[A.decorah, A.firstempty]} />);
  BOOK("cta1", A.p20, A.why - 0.2, "DEVILED EGGS P. 20 · FOOD SAFETY P. 9 · LINK IN THE 1ST LINE");

  // ===== por qué no había mayonesa =====
  PL(A.first - 0.3, A.second - 0.3, (t, o) => <N.StorePrice t={t} a={A.first - 0.3} out={o} m={[A.first, A.c39, A.chickens, A.c9]} />);
  PL(A.second - 0.2, A.third - 0.3, (t, o) => <N.IceboxDoor t={t} a={A.second - 0.2} out={o} m={[A.cupboard, A.week0]} />);
  Z("names", A.boiled - 0.4, A.setup, "list", "WHAT WE CALLED IT", "", { items: [{ at: A.boiled, txt: "BOILED DRESSING" }, { at: A.cream, txt: "SALAD CREAM" }, { at: A.eggsauce, txt: "EGG SAUCE" }] });
  PL(A.war - 0.2, A.need - 0.2, (t, o) => <N.DentedStairs t={t} a={A.war - 0.2} out={o} m={[A.y1931 - 1.6, A.y1931 + 0.1]} />);

  // ===== el aderezo =====
  PL(A.onecup - 0.3, A.s1 - 0.3, (t, o) => <N.IngredientGrid t={t} a={A.onecup - 0.3} out={o} m={[A.i1, A.i2, A.i3, A.i4, A.i5, A.i6, A.i7, A.i8, A.i3b, A.thatsit]} />);
  STEP("s1", A.s1, A.s1 + 9, 1, "Dry things in the pan first · whisk them together, dry");
  PL(A.skip - 1.5, A.s2 - 0.3, (t, o) => <N.FlourLumps t={t} a={A.skip - 1.5} out={o} m={[A.skip, A.dumpl, A.separ]} />);
  STEP("s2", A.s2, A.s2 + 8, 2, "Whisk in the egg · then the milk");
  PL(A.s2 - 0.2, A.s3 - 0.3, (t, o) => <N.EggCrack t={t} a={A.s2 - 0.2} out={o} m={[A.paste, A.milkin]} />);
  STEP("s3", A.s3, A.s3 + 10, 3, "Vinegar last · slowly, whisking the whole time");
  PL(A.s3 - 0.2, A.important - 0.3, (t, o) => <N.VinegarCushion t={t} a={A.s3 - 0.2} out={o} m={[A.knuck, A.vlast, A.curdle, A.cushion]} />);
  Z("safe", A.important, A.d160 + 4, "warn", "MOST IMPORTANT", "Raw egg inside · it's done at 160°F, not when it looks thick");
  PL(A.raw - 0.3, A.same - 0.3, (t, o) => <N.CandyThermo t={t} a={A.raw - 0.3} out={o} m={[A.d160, A.pg9b]} />);
  PL(A.same - 0.3, A.s4 - 0.3, (t, o) => <N.SameNumber t={t} a={A.same - 0.3} out={o} m={[A.byeye, A.candy, A.eight]} />);
  STEP("s4", A.s4, A.s4 + 12, 4, "Medium-low · stir in a figure 8, don't stop");
  PL(A.s4 - 0.2, A.nothing - 0.3, (t, o) => <N.KnobFig8 t={t} a={A.s4 - 0.2} out={o} m={[A.notmed, A.stir, A.fig8, A.corners]} />);
  PL(A.nothing - 0.2, A.dip - 0.3, (t, o) => <N.SpoonDrip t={t} a={A.nothing - 0.2} out={o} m={[A.allonce, A.coat]} />);
  PL(A.dip - 0.2, A.check - 0.3, (t, o) => <N.NappeLine t={t} a={A.dip - 0.2} out={o} m={[A.finger, A.nappe, A.holds]} />);
  PL(A.check - 0.2, A.quick - 0.3, (t, o) => <N.DialRead t={t} a={A.check - 0.2} out={o} m={[A.only150, A.butter, A.glossy]} />);
  STEP("s5", A.s5, A.s5 + 10, 5, "Cool it fast · ice bath, plastic pressed on top");
  PL(A.setin - 1.5, A.fifteen + 4, (t, o) => <N.IceNest t={t} a={A.setin - 1.5} out={o} m={[A.setin, A.wrap, A.skin, A.fifteen]} />);
  PL(A.daybefore - 0.2, A.pudding - 0.3, (t, o) => <N.WeekendPegs t={t} a={A.daybefore - 0.2} out={o} m={[A.fri, A.sat, A.sun, A.sched, A.monday]} />);
  PL(A.pudding - 0.2, A.five + 1.0, (t, o) => <N.YearStamp t={t} a={A.pudding - 0.2} out={o} m={[A.tastes, A.five - 1.0]} />);

  // ===== cinco errores =====
  PL(A.five + 1.6, A.r5 + 8, (t, o) => <N.FivePans t={t} a={A.five + 1.6} out={o} m={[A.r1, A.r2, A.r3, A.phone, A.r4, A.r5]} />);
  MIS("m1", A.r1, A.r1 + 6, 1, "Vinegar first · it curdles");
  MIS("m2", A.r2, A.r2 + 9, 2, "Heat too high · the egg scrambles on the bottom");
  MIS("m3", A.r3, A.r3 + 9, 3, "Stopped stirring · it scorches · let the phone ring");
  MIS("m4", A.r4, A.r4 + 9, 4, "Stopping at 150°F · use the thermometer");
  MIS("m5", A.r5, A.r5 + 9, 5, "Cooling it slow, uncovered · it grows a skin");
  PL(A.rescue - 0.2, A.eggs0 - 0.3, (t, o) => <N.StrainerRescue t={t} a={A.rescue - 0.2} out={o} m={[A.strain, A.cottage]} />);

  // ===== los huevos =====
  Z("comm", A.three, A.three + 7, "note", "FROM YOUR COMMENTS", "3 tips I didn't tell you last time");
  PL(A.side - 1.2, A.hens - 0.3, (t, o) => <N.CartonSide t={t} a={A.side - 1.2} out={o} m={[A.side, A.drifts, A.eleven]} />);
  PL(A.steam - 1.5, A.saltw + 5, (t, o) => <N.SteamBasket t={t} a={A.steam - 1.5} out={o} m={[A.steam, A.t13, A.icewater, A.saltw]} />);
  PL(A.eggsalad - 0.2, A.dozen - 0.3, (t, o) => <N.TornToSalad t={t} a={A.eggsalad - 0.2} out={o} m={[A.garbage]} />);
  PL(A.dozen - 0.2, A.base - 0.3, (t, o) => <N.MashSand t={t} a={A.dozen - 0.2} out={o} m={[A.sand]} />);
  PL(A.base - 0.2, A.diff - 0.3, (t, o) => <N.BaseFormula t={t} a={A.base - 0.2} out={o} m={[A.third3, A.ymust, A.white, A.specks]} />);
  PL(A.slumps - 6, A.matte + 6, (t, o) => <N.PeakRuler t={t} a={A.slumps - 6} out={o} m={[A.slumps, A.matte]} />);

  // ===== los seis rellenos =====
  Z("f1", A.f1, A.f1 + 7, "note", "FILLING 1 · AMES METHODIST", "Pimento & sharp cheddar");
  PL(A.velma - 0.2, A.orange + 6, (t, o) => <N.GraterCascade t={t} a={A.velma - 0.2} out={o} m={[A.jeal, A.pim, A.ched, A.finegr, A.orange, A.married]} />);
  Z("f2", A.f2, A.f2 + 7, "note", "FILLING 2 · MENNONITE, KALONA", "Red beet eggs");
  PL(A.dutch - 1, A.flowers + 6, (t, o) => <N.BeetSoak t={t} a={A.dutch - 1} out={o} m={[A.dutch, A.wedding, A.pour, A.overnight, A.magenta, A.flowers]} />);
  Z("f3", A.f3, A.f3 + 7, "note", "FILLING 3 · PRESBYTERIAN", "Curry & chutney");
  PL(A.slides - 1.2, A.exotic + 4, (t, o) => <N.SlideProjector t={t} a={A.slides - 1.2} out={o} m={[A.slides, A.ruth, A.curry, A.chutney, A.apricot, A.exotic]} />);
  Z("f4", A.f4, A.f4 + 7, "note", "FILLING 4 · PARSONAGE GARDEN", "Radish & chive");
  PL(A.garden - 1, A.f5 - 0.3, (t, o) => <N.RadishPull t={t} a={A.garden - 1} out={o} m={[A.garden, A.social, A.grate, A.squeeze, A.chive, A.june, A.aug]} />);
  Z("f5", A.f5, A.f5 + 7, "note", "FILLING 5 · HARVEST SUPPER", "Chow-chow");
  PL(A.relish - 0.5, A.picca + 2.5, (t, o) => <N.JarRow t={t} a={A.relish - 0.5} out={o} m={[A.relish, A.sept, A.jars20, A.twotb, A.picca]} />);
  Z("f6", A.f6, A.f6 + 7, "note", "FILLING 6 · LADIES' AID, DECORAH", "Horseradish & bacon");
  PL(A.f6 - 0.2, A.horse - 0.3, (t, o) => <N.BulletinRecipe t={t} a={A.f6 - 0.2} out={o} m={[A.hb, A.marlys, A.gone4, A.gotone, A.agnes, A.bulletin]} />);
  PL(A.horse - 0.2, A.works - 0.3, (t, o) => <N.BaconDust t={t} a={A.horse - 0.2} out={o} m={[A.bacon, A.dust]} />);
  PL(A.works - 0.2, A.thats6 - 0.3, (t, o) => <N.ThreeHits t={t} a={A.works - 0.2} out={o} m={[A.tangy, A.sharp, A.salty, A.cantone, A.prayer]} />);

  // ===== llevar, rellenar y la seguridad =====
  PL(A.split - 2.5, A.carry - 0.3, (t, o) => <N.SplitPlate t={t} a={A.split - 2.5} out={o} m={[A.split, A.twelve]} />);
  PL(A.carry - 0.2, A.bag - 0.3, (t, o) => <N.CarryCurve t={t} a={A.carry - 0.2} out={o} m={[A.neverhome, A.atchurch, A.curve]} />);
  PL(A.bag - 0.2, A.cannot - 0.3, (t, o) => <N.ZipSnip t={t} a={A.bag - 0.2} out={o} m={[A.snip, A.swirl, A.nowash]} />);
  PL(A.cannot - 0.2, A.jelly - 0.3, (t, o) => <N.Hourglass t={t} a={A.cannot - 0.2} out={o} m={[A.f40, A.two, A.f90]} />);
  PL(A.jelly - 0.2, A.clock - 0.3, (t, o) => <N.IceTraySwap t={t} a={A.jelly - 0.2} out={o} m={[A.crushed, A.ontop, A.forty8, A.swap]} />);
  PL(A.clock - 0.2, A.hard - 0.3, (t, o) => <N.ClockTrash t={t} a={A.clock - 0.2} out={o} m={[A.trash, A.nobody]} />);
  PL(A.july - 0.2, A.rule + 6, (t, o) => <N.Picnic57 t={t} a={A.july - 0.2} out={o} m={[A.f94, A.t11, A.t2, A.sick, A.rule]} />);
  Z("rule", A.rule, A.show - 0.3, "list", "THE LADIES' AID RULE", "", { items: [{ at: A.rule + 0.6, txt: "ON ICE" }, { at: A.rule + 1.6, txt: "IN THE SHADE" }, { at: A.rule + 2.6, txt: "ONE PLATE AT A TIME" }, { at: A.watch, txt: "WATCH THE CLOCK" }] });
  PL(A.twoplates - 0.2, A.decor - 0.3, (t, o) => <N.OneHourTest t={t} a={A.twoplates - 0.2} out={o} m={[A.storemayo, A.sidebyside, A.hour, A.softened, A.oilring, A.same2, A.bothtrash, A.flourcook, A.oilegg]} />);
  PL(A.decor - 0.2, A.weekend - 0.3, (t, o) => <N.OliveEye t={t} a={A.decor - 0.2} out={o} m={[A.olive, A.eye, A.paprika, A.baconon, A.nothingbeet]} />);

  // ===== el fin de semana, lo que nunca hacía, preguntas =====
  Z("wk", A.weekend, A.sat2 - 0.3, "list", "THE WHOLE WEEKEND", "", { items: [{ at: A.fri2, txt: "FRIDAY · DRESSING (15 MIN)" }, { at: A.sat2 - 6, txt: "BEET EGGS SOAK OVERNIGHT" }] });
  PL(A.sat2 - 0.2, A.thorsnever - 0.3, (t, o) => <N.Conveyor t={t} a={A.sat2 - 0.2} out={o} m={[A.sun2]} />);
  PL(A.thorsnever - 0.2, A.questions - 0.3, (t, o) => <N.Drawer t={t} a={A.thorsnever - 0.2} out={o} m={[A.n1, A.n2, A.n3, A.n4, A.n5]} />);
  PL(A.questions - 0.2, A.miracle - 0.3, (t, o) => <N.FreezeEraser t={t} a={A.questions - 0.2} out={o} m={[A.freeze, A.eraser, A.noegg]} />);
  PL(A.miracle - 0.2, A.crowd - 0.3, (t, o) => <N.CousinTree t={t} a={A.miracle - 0.2} out={o} m={[A.cousin, A.thirties]} />);
  Z("crowd", A.crowd, A.cheaper - 0.3, "note", "PAGE 20", "2 dozen eggs = 48 halves · feeds a supper of 40");
  PL(A.cheaper - 0.2, A.church - 0.3, (t, o) => <N.RegisterTotal t={t} a={A.cheaper - 0.2} out={o} m={[A.egg25, A.milk12, A.vin8, A.rest25, A.c70, A.mayo110]} />);

  // ===== cierre =====
  PL(A.rd - 0.2, A.rs - 0.3, (t, o) => <N.RecipeCardHand t={t} a={A.rd - 0.2} out={o} m={[]} lines={[
    { at: A.rd + 0.6, txt: "2 tbsp sugar · 1 tbsp flour" }, { at: A.rd + 3.2, txt: "1 tsp dry mustard · ½ tsp salt" }, { at: A.rd + 7.6, txt: "whisk in 1 egg, then ½ cup milk" },
    { at: A.rd + 10.6, txt: "¼ cup cider vinegar, last & slow" }, { at: A.rd + 13.8, txt: "medium-low, a figure 8, to 160°" }, { at: A.rd + 22, txt: "off the heat: 1 tbsp butter" },
    { at: A.rd + 25, txt: "ice bath, plastic on top" }, { at: A.re, txt: "eggs: carton on its side · steam" }, { at: A.rb, txt: "base: 12 yolks + ⅓ cup dressing" }]} />);
  PL(A.rs - 0.2, A.still - 0.3, (t, o) => <N.SixTray t={t} a={A.rs - 0.2} out={o} m={[]} step={3.1} names={["PIMENTO & CHEDDAR · AMES", "RED BEET · KALONA", "CURRY & CHUTNEY · MISSIONARY CIRCLE", "RADISH & CHIVE · PARSONAGE", "CHOW-CHOW · HARVEST SUPPER", "HORSERADISH & BACON · DECORAH"]} />);
  Z("carry", A.rc, A.still - 0.3, "list", "AT THE CHURCH", "", { items: [{ at: A.rc + 0.5, txt: "CARRY THEM SEPARATE" }, { at: A.rc + 3, txt: "FILL IN THE KITCHEN" }, { at: A.rc + 5, txt: "ON ICE · ONE PLATE OUT" }, { at: A.rc + 8, txt: "2 HOURS, NO MORE" }] });
  PL(A.still - 0.2, A.hear - 0.3, (t, o) => <N.PanOnNail t={t} a={A.still - 0.2} out={o} m={[A.y1969, A.papersack, A.neverstop, A.nail]} />);
  Z("ask", A.hear, A.link1 - 0.2, "note", "TELL ME", "What did your church call it? · and where");
  BOOK("cta3", A.link1, A.go + 3, "LINK IN THE 1ST LINE OF THE DESCRIPTION");

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
