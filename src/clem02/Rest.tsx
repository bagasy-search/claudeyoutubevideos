// clem02 · RESTO (76,8 s → fin): el recorrido por la casa con el frasco del abuelo, cuarto por cuarto.
// Cada plano = lo que se dice en ese segundo; avatar en TODAS las ventanas pagadas; el mundo 3D vuelve en cada cambio de cuarto.
// Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { screenOf, PT } from "./house3d";
import { World, DayCounter, vid, MIN1_END } from "./Min1";
import { BigNum, COL, Chips, FONT, Receipt, Tag, e, setSlug, spr } from "../kits/yanqui3d/lib";
import { makeVideo, Stamp } from "../kits/yanqui3d/engine";
import { CheckList, Mistake, Versus, Words } from "../kits/yanqui3d/pieces";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

setSlug("clem02");
const TEND = 906.6;
export const FULL_FRAMES = Math.ceil(TEND * 30);
const HAS = AVAIL as { clips: string[]; imgs: string[] };
const ORANGE = "#ffa94d";
void vid;

// botón de suscripción + campanita (CTA: suscribirse + campana + UNA pregunta)
const SubBell: React.FC<{ t: number; at: number; bell: number; out: number }> = ({ t, at, bell, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const k = Math.min(1.08, spr(t, at)), pressed = t >= at + 0.9, ring = t >= bell ? Math.sin((t - bell) * 22) * 18 * Math.exp(-(t - bell) * 2.2) : 0;
  return (
    <div style={{ position: "absolute", left: 960, top: 860, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, display: "flex", alignItems: "center", gap: 28, fontFamily: FONT }}>
      <div style={{ padding: "22px 54px", borderRadius: 16, background: pressed ? "#3a3a3a" : "#cc0000", color: "#fff", fontWeight: 900, fontSize: 56, letterSpacing: 3, boxShadow: "0 24px 50px rgba(0,0,0,.55)" }}>{pressed ? "SUBSCRIBED" : "SUBSCRIBE"}</div>
      <div style={{ width: 104, height: 104, borderRadius: 52, background: "#f4efe6", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 50px rgba(0,0,0,.55)", opacity: e(t, bell - 0.3, bell) }}>
        <svg width={62} height={62} viewBox="0 0 24 24" style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 10%" }}><path fill="#1c1c1c" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1Z" /></svg>
      </div>
    </div>
  );
};

const M = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: HAS, T0: MIN1_END, TEND, flashAtStart: false,
  beats: ({ AV, CL }) => {
    const W = (a: number, tr: "whip" | "whipL" | "zoom" | "light" | "push" | "portal" | "flip" = "whipL", p?: [number, number]) => ({ a, tr, p, r: (t: number) => <World t={t} /> });
    // avatar en TODAS las ventanas pagadas desde el minuto 1 (las que traen pieza pesada encima, con blur)
    const SOFT: Record<number, [number, number][]> = { 134.14: [[134.4, 138.3]], 757: [[757.3, 766]], 766.22: [[766.4, 769.9]], 781.72: [[782, 785.4]], 794.39: [[794.6, 798.6]], 893.08: [[893.4, 897]] };
    const avs = (AVW as number[][]).filter(([ms]) => ms > MIN1_END).map(([ms], i) => AV(ms, i % 3 === 0 ? "whip" : i % 3 === 1 ? "push" : "light", { spans: SOFT[ms] ?? (Object.entries(SOFT).find(([k]) => Math.abs(+k - ms) < 0.5)?.[1]) }));
    const shots = [
      CL(MIN1_END, "s01", "whip"),
      CL(85.89, "m_peels", "whipL"), CL(90.7, "s02", "flip"),
      W(103.04, "zoom", [960, 520]), CL(110.4, "s03", "light"),
      CL(122.66, "s04", "whipL"), CL(128.0, "s05", "flip"),
      W(138.47, "zoom"), CL(142.6, "s06", "whip"), CL(146.0, "s07", "push"),
      CL(153.89, "s08", "whipL"), W(161.2, "whip"),
      W(168.8, "zoom"), CL(174.0, "s09", "whipL"),
      CL(183.2, "s10", "whipL"), CL(186.8, "s11", "flip"), CL(190.9, "x_grease", "zoom"),
      W(200.64, "whipL"), CL(204.4, "s12", "whip"),
      CL(218.22, "s13", "zoom"), CL(225.5, "s14", "whipL"),
      CL(235.37, "s15", "whipL"), CL(240.5, "s16", "zoom"),
      CL(250.87, "s17", "whipL"), CL(258.3, "s18", "flip"),
      CL(267.51, "s19", "whipL"), CL(273.9, "s20", "push"), CL(278.5, "s21", "whip"),
      W(286.89, "zoom"), CL(290.2, "s22", "flip"),
      CL(304.61, "s23", "whipL"), CL(309.5, "s24", "push"),
      CL(321.41, "s25", "whipL"), W(328.0, "light"),
      W(339.75, "whip"), CL(345.7, "s27", "whipL"),
      CL(353.62, "s28", "whipL"), CL(359.9, "s29", "light"),
      CL(370.35, "s30", "whipL"), CL(378.5, "s31", "push"),
      CL(388.0, "s32", "whipL"), CL(393.0, "s33", "whip"),
      W(405.46, "zoom"),
      W(425.33, "portal", [1300, 420]), CL(428.9, "s35", "light"),
      W(443.17, "whip"), CL(446.3, "s37", "whipL"),
      CL(458.3, "s38", "whipL"), CL(463.5, "s39", "push"),
      CL(478.19, "s40", "whipL"), CL(484.5, "s41", "zoom"),
      CL(492.35, "s42", "whipL"), CL(497.8, "s43", "push"),
      W(509.89, "whip"), CL(515.0, "s44", "zoom"),
      CL(525.89, "s45", "whipL"), CL(531.5, "s46", "push"),
      CL(540.62, "s47", "light"), CL(546.7, "s48", "whipL"),
      CL(557.66, "s49", "whipL"), W(565.0, "zoom"),
      CL(573.64, "s50", "whipL"), CL(579.2, "s51", "push"),
      W(588.67, "portal", [960, 600]), CL(594.1, "s52", "whipL"), CL(600.0, "s53", "zoom"),
      W(607.45, "whip"), CL(612.9, "s54", "flip"),
      W(622.54, "zoom"), CL(628.3, "s55", "whipL"),
      CL(638.59, "s56", "whipL"), CL(642.3, "x_rust", "zoom"), CL(646.3, "s57", "push"),
      CL(656.62, "s58", "whipL"), CL(660.6, "s59", "zoom"),
      CL(672.59, "s60", "whipL"), W(677.5, "whip"), CL(682.0, "s61", "push"),
      CL(690.86, "s62", "whipL"), W(699.3, "zoom"),
      W(706.8, "light"), CL(710.9, "s63", "flip"),
      CL(720.87, "s64", "whipL"), CL(724.3, "s65", "flip"),
      CL(739.56, "s66", "whipL"), CL(741.8, "s67", "flip"),
      W(755.47, "zoom"), W(770.04, "whip"), CL(785.55, "s68", "whipL"), W(798.79, "whip"),
      CL(815.97, "s70", "light"), W(823.7, "whipL"),
      W(831.75, "zoom"), W(846.78, "whip"),
      CL(864.59, "s71", "whipL"), CL(872.7, "s72", "light"),
      W(879.99, "zoom"), W(897.15, "whip"),
    ];
    return [...avs, ...shots].sort((a, b) => a.a - b.a);
  },
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    const tag = (k: string, a: number, q: keyof typeof PT, text: string, col: string, out: number, dx = 200, dy = -170, sub?: string) => {
      if (t < a - 0.3 || t > out + 0.4) return;
      const p = screenOf(t, PT[q]);
      L.push(<Tag key={k} t={t} at={a} x={p.x} y={p.y} dx={dx} dy={dy} text={text} sub={sub} col={col} out={out} />);
    };
    // ---- EL FRASCO: la receta ----
    L.push(<Words key="ct" t={t} items={[{ at: at("Christmas treat"), txt: "A CHRISTMAS TREAT" }]} out={85.7} y={880} size={84} />);
    L.push(<Tag key="hg" t={t} at={at("half-gallon")} x={1100} y={520} dx={260} dy={-200} text="HALF-GALLON JAR" col={ORANGE} out={90.5} />);
    L.push(<Words key="5p" t={t} items={[{ at: at("white vinegar"), txt: "PLAIN WHITE VINEGAR" }, { at: at("five percent"), txt: "5%", col: COL.amber }]} out={97.4} y={180} size={92} />);
    L.push(<BigNum key="2w" t={t} at={at("two weeks")} text="2 WEEKS" x={960} y={360} size={180} col={ORANGE} sub="BACK OF THE COUNTER" out={102.8} />);
    L.push(<DayCounter key="dy" t={t} from={103.5} out={110.2} />);
    tag("oil", at("pulls the oil"), "jar", "ORANGE OIL", ORANGE, 110.2, -240, -150);
    L.push(<Chips key="2j" t={t} at={at("cuts grease")} items={["CUTS GREASE", "SMELLS LIKE ORANGES"]} out={116.2} y={800} />);
    L.push(<Stamp key="ss" t={t} at={at("strong stuff")} text="THE STRONG STUFF" x={960} y={860} rot={-5} size={84} out={127.6} />);
    L.push(<BigNum key="hh" t={t} at={at("half and half")} text="50 / 50" x={1400} y={330} size={170} col={COL.ink} sub="HALF JAR · HALF WATER" out={138.3} />);
    // ---- COCINA ----
    L.push(<Words key="k" t={t} items={[{ at: at("the kitchen"), txt: "1 · THE KITCHEN", col: COL.amber }]} out={142.4} y={180} size={100} />);
    L.push(<Tag key="1m" t={t} at={at("about a minute")} x={1150} y={560} dx={200} dy={-180} text="WAIT 1 MINUTE" col={COL.ice} out={153.7} />);
    L.push(<Words key="nf" t={t} items={[{ at: at("No streaks"), txt: "NO STREAKS" }, { at: at("no film"), txt: "NO FILM", col: COL.ice }]} out={161.0} y={880} size={86} />);
    tag("lm", at("laminate", 160), "jar", "LAMINATE ✓", "#9df0b4", 165.1, 260, -120);
    L.push(<Stamp key="gr" t={t} at={at("granite or marble")} text="GRANITE? STOP" x={960} y={300} rot={-6} size={100} out={168.7} />);
    tag("bg", at("Bacon grease"), "stove", "STICKY BACON GREASE", COL.amber, 178.4);
    L.push(<Tag key="st" t={t} at={at("jar straight, no water")} x={960} y={540} dx={0} dy={-300} text="STRAIGHT · NO WATER" col={COL.red} out={183.0} />);
    L.push(<BigNum key="5m" t={t} at={at("five minutes", 182)} text="5 MIN" x={1450} y={300} size={170} col={COL.ink} out={186.6} />);
    L.push(<Words key="fz" t={t} items={[{ at: at("fizz", 191), txt: "THE FIZZ ISN'T MAGIC" }]} out={194.4} y={180} size={92} />);
    L.push(<Stamp key="dm" t={t} at={at("don't mix them")} text="DON'T PREMIX IN A BOTTLE" x={960} y={300} rot={-5} size={80} out={204.2} />);
    tag("soda", at("one after the other"), "stove", "SODA → THEN VINEGAR", "#d9f3ff", 204.2, -240, -160);
    L.push(<BigNum key="79" t={t} at={at("1979")} text="1979" x={1450} y={300} size={170} col={COL.amber} sub="OUR FIRST MICROWAVE" out={211.7} />);
    L.push(<Words key="mw" t={t} items={[{ at: at("one cup of water"), txt: "1 CUP WATER" }, { at: at("quarter cup"), txt: "+ ¼ CUP JAR", col: ORANGE }]} out={218.0} y={880} size={80} />);
    L.push(<Words key="m5" t={t} items={[{ at: at("five minutes", 218), txt: "5 MIN ON" }, { at: at("five more"), txt: "+ 5 MIN CLOSED", col: COL.ice }]} out={225.3} y={180} size={86} />);
    L.push(<Stamp key="ns" t={t} at={at("No scrubbing")} text="NO SCRUBBING" x={960} y={860} rot={-5} size={90} out={235.2} />);
    L.push(<Words key="hw" t={t} items={[{ at: at("well water"), txt: "KANSAS WELL WATER" }, { at: at("is hard"), txt: "= HARD", col: COL.ice }]} out={240.3} y={880} size={80} />);
    L.push(<Tag key="wc" t={t} at={at("white crust", 240)} x={960} y={560} dx={240} dy={-200} text="MINERAL CRUST" col="#f4efe6" out={246.6} />);
    L.push(<Words key="cm" t={t} items={[{ at: at("Fill the water tank"), txt: "HALF JAR · HALF WATER" }, { at: at("no coffee"), txt: "ONE CYCLE · NO COFFEE", col: COL.amber }]} out={258.1} y={180} size={76} />);
    L.push(<Chips key="rn" t={t} at={at("two or three")} items={["RINSE", "RINSE", "RINSE"]} out={261.8} y={820} />);
    L.push(<Stamp key="vc" t={t} at={at("vinegar coffee")} text="NO VINEGAR COFFEE" x={960} y={300} rot={-6} size={90} out={267.3} />);
    L.push(<Words key="dr" t={t} items={[{ at: at("Half a cup of baking soda"), txt: "½ CUP BAKING SODA" }, { at: at("a cup of the jar"), txt: "+ 1 CUP JAR", col: ORANGE }]} out={278.3} y={180} size={80} />);
    L.push(<BigNum key="15" t={t} at={at("15 minutes")} text="15 MIN" x={1450} y={300} size={160} col={COL.ink} sub="THEN A KETTLE OF HOT WATER" out={281.0} />);
    tag("sm", at("for smell"), "drain", "SMELL + LIGHT BUILDUP", "#9df0b4", 290.0, -200, -170);
    L.push(<Stamp key="cl" t={t} at={at("real clog")} text="NOT FOR A REAL CLOG" x={960} y={860} rot={-5} size={84} out={300.0} />);
    L.push(<Words key="fr" t={t} items={[{ at: at("bowl of the jar"), txt: "A BOWL OVERNIGHT" }]} out={315.8} y={880} size={84} />);
    L.push(<Tag key="on" t={t} at={at("onions")} x={1200} y={500} dx={200} dy={-180} text="SOAKS UP THE ONIONS" col={COL.amber} out={315.8} />);
    L.push(<Words key="np" t={t} items={[{ at: at("old newspaper"), txt: "+ OLD NEWSPAPER" }, { at: at("microfiber"), txt: "OR DRY MICROFIBER", col: COL.ice }]} out={332.6} y={180} size={84} />);
    // ---- BAÑO ----
    L.push(<Words key="b" t={t} items={[{ at: at("Now the bathroom"), txt: "2 · THE BATHROOM", col: COL.ice }]} out={334.2} y={180} size={100} />);
    tag("wc1", at("White crust"), "sinkBath", "WHITE CRUST", "#f4efe6", 345.4, 140, -230);
    tag("gr1", at("gray ring"), "toilet", "GRAY RING", "#c8c0b0", 345.4, 200, -200);
    tag("sp1", at("spots all over"), "showerDoor", "SPOTS", COL.ice, 345.4, 180, -120);
    L.push(<Tag key="sw" t={t} at={at("sideways")} x={960} y={500} dx={250} dy={-180} text="FULL OF MINERALS" col={COL.ice} out={349.5} />);
    L.push(<Words key="bb" t={t} items={[{ at: at("bread bag"), txt: "A BREAD BAG" }, { at: at("rubber band"), txt: "+ A RUBBER BAND", col: COL.amber }]} out={359.7} y={880} size={84} />);
    L.push(<BigNum key="ov" t={t} at={at("Leave it overnight")} text="OVERNIGHT" x={1400} y={300} size={140} col={COL.ink} out={362.0} />);
    L.push(<Words key="kf" t={t} items={[{ at: at("kitchen faucet"), txt: "SAME ON THE KITCHEN FAUCET" }]} out={370.1} y={880} size={72} />);
    L.push(<Words key="2c" t={t} items={[{ at: at("two cups"), txt: "2 CUPS · STRAIGHT" }, { at: at("at least an hour"), txt: "1 HOUR +", col: COL.amber }, { at: at("Overnight is better"), txt: "OVERNIGHT = BETTER", col: "#9df0b4" }]} out={378.3} y={180} size={78} />);
    L.push(<Tag key="pm" t={t} at={at("pumice stone")} x={960} y={520} dx={-240} dy={-180} text="PUMICE · FOR TOILETS · WET" col={COL.amber} out={388.0} />);
    L.push(<BigNum key="10m" t={t} at={at("10 minutes")} text="10 MIN" x={1450} y={300} size={160} col={COL.ink} sub="THEN A SOFT SPONGE" out={399.8} />);
    L.push(<Words key="ds" t={t} items={[{ at: at("dish soap", 396), txt: "+ A DROP OF DISH SOAP" }]} out={399.8} y={880} size={78} />);
    // la lavandina: el que puede lastimarte
    L.push(<Stamp key="nb" t={t} at={at("Never ever")} text="NEVER WITH BLEACH" x={960} y={300} rot={-6} size={110} out={419.8} />);
    L.push(<Words key="nb2" t={t} items={[{ at: at("same bucket"), txt: "NOT THE SAME BUCKET" }, { at: at("one after the other", 413), txt: "NOT ONE AFTER THE OTHER", col: COL.red }]} out={417.4} y={880} size={74} />);
    L.push(<BigNum key="cg" t={t} at={at("chlorine gas")} text="= CHLORINE GAS" x={960} y={820} size={130} col={COL.red} out={419.8} />);
    tag("bl", at("bleach lived"), "barn", "BLEACH → BARN", COL.red, 428.7, 220, -100);
    L.push(<Chips key="ab" t={t} at={at("open the window")} items={["OPEN THE WINDOW", "RINSE WITH WATER", "WAIT TILL TOMORROW"]} out={436.6} y={800} />);
    // ---- LAVADERO ----
    L.push(<Words key="l" t={t} items={[{ at: at("the laundry"), txt: "3 · THE LAUNDRY", col: "#d9f3ff" }]} out={443.0} y={180} size={100} />);
    tag("j2", at("Two jobs"), "washer", "2 JOBS", COL.amber, 446.2, 220, -200);
    L.push(<Words key="rs" t={t} items={[{ at: at("half cup of the jar"), txt: "½ CUP · SOFTENER SLOT" }]} out={454.3} y={880} size={80} />);
    L.push(<Chips key="tw" t={t} at={at("towels come out softer")} items={["SOFTER TOWELS", "NO STIFFNESS"]} out={454.3} y={800} />);
    L.push(<Stamp key="nsm" t={t} at={at("won't smell")} text="NO VINEGAR SMELL" x={960} y={300} rot={-5} size={90} out={463.3} />);
    L.push(<Words key="mo" t={t} items={[{ at: at("Once a month"), txt: "ONCE A MONTH" }, { at: at("two cups of the jar"), txt: "EMPTY HOT CYCLE + 2 CUPS", col: COL.amber }]} out={471.8} y={180} size={76} />);
    L.push(<Tag key="rb" t={t} at={at("dry rubber out")} x={960} y={540} dx={260} dy={-200} text="DON'T SOAK THE RUBBER" col={COL.red} out={484.3} />);
    L.push(<Tag key="sl" t={t} at={at("white lines")} x={960} y={600} dx={-250} dy={-200} text="ROAD SALT" col="#f4efe6" out={492.2} />);
    L.push(<Words key="bt" t={t} items={[{ at: at("they disappear")
    , txt: "HALF & HALF ON A RAG" }]} out={497.6} y={880} size={80} />);
    L.push(<Chips key="dry" t={t} at={at("dry slow")} items={["DRY SLOW", "AWAY FROM THE STOVE", "A LITTLE OIL"]} out={504.2} y={800} />);
    // ---- LIVING ----
    L.push(<Words key="lv" t={t} items={[{ at: at("the living room"), txt: "4 · THE LIVING ROOM", col: COL.amber }]} out={512.6} y={180} size={96} />);
    tag("so", at("black with soot"), "wstove", "BLACK WITH SOOT", "#c8c0b0", 514.9, 220, -200);
    L.push(<Stamp key="cd" t={t} at={at("completely cold")} text="COMPLETELY COLD" x={960} y={300} rot={-5} size={96} out={527.1} />);
    L.push(<Words key="as" t={t} items={[{ at: at("dip it in the cold white ash"), txt: "JAR + COLD WHITE ASH" }]} out={536.0} y={880} size={84} />);
    L.push(<Tag key="sf" t={t} at={at("soft scrub")} x={960} y={560} dx={240} dy={-200} text="ASH = SOFT SCRUB" col="#f4efe6" out={540.4} />);
    L.push(<Words key="bn" t={t} items={[{ at: at("brand new"), txt: "BRAND NEW" }]} out={546.5} y={180} size={100} />);
    L.push(<Words key="dg" t={t} items={[{ at: at("Then the dog"), txt: "THEN THE DOG", col: ORANGE }]} out={553.8} y={180} size={96} />);
    L.push(<Tag key="bt2" t={t} at={at("blotted it up")} x={960} y={600} dx={-240} dy={-180} text="BLOT FIRST" col={COL.ice} out={557.5} />);
    L.push(<BigNum key="dd" t={t} at={at("ten minutes")} text="10 MIN" x={1450} y={300} size={150} col={COL.ink} sub="THEN BLOT AGAIN" out={564.8} />);
    tag("dgs", at("takes the smell out"), "dog", "NO COMING BACK", "#9df0b4", 569.8, 200, -200);
    L.push(<Stamp key="tc" t={t} at={at("Test it first")} text="TEST A HIDDEN CORNER" x={960} y={300} rot={-5} size={84} out={579.0} />);
    // ---- PORCHE ----
    L.push(<Words key="pc" t={t} items={[{ at: at("out to the porch"), txt: "5 · THE PORCH", col: "#9df0b4" }]} out={588.5} y={180} size={100} />);
    tag("gv", at("gravel path"), "weeds", "THE GRAVEL PATH", "#e6dccb", 594.0, 220, -200);
    L.push(<Chips key="hs" t={t} at={at("hot sunny day")} items={["STRAIGHT", "HOT & SUNNY", "NO WIND"]} out={599.8} y={800} />);
    L.push(<BigNum key="12" t={t} at={at("a day or two")} text="1-2 DAYS" x={1450} y={300} size={150} col={COL.amber} sub="LEAVES TURN BROWN" out={602.4} />);
    tag("rt", at("deep roots"), "weeds", "ROOTS SURVIVE", COL.red, 612.7, -220, -180);
    L.push(<Stamp key="ng" t={t} at={at("never in the garden")} text="NEVER IN THE GARDEN" x={960} y={860} rot={-5} size={86} out={622.3} />);
    L.push(<Words key="gr2" t={t} items={[{ at: at("only for gravel"), txt: "GRAVEL · CRACKS · FENCE LINES", col: "#9df0b4" }]} out={622.3} y={180} size={70} />);
    // ---- GRANERO ----
    L.push(<Words key="br" t={t} items={[{ at: at("Then the barn"), txt: "6 · THE BARN", col: COL.red }]} out={628.1} y={180} size={100} />);
    L.push(<Words key="ru" t={t} items={[{ at: at("Overnight for light rust"), txt: "OVERNIGHT · LIGHT RUST" }, { at: at("full day"), txt: "1 DAY · HEAVY RUST", col: COL.amber }]} out={642.1} y={880} size={76} />);
    L.push(<Stamp key="mf" t={t} at={at("most people forget")} text="WHAT MOST PEOPLE FORGET" x={960} y={300} rot={-5} size={80} out={650.6} />);
    L.push(<Chips key="sp" t={t} at={at("spoon of baking soda")} items={["SODA RINSE", "DRY", "OIL"]} out={656.4} y={800} />);
    L.push(<Tag key="rw" t={t} at={at("rusts again")} x={960} y={540} dx={250} dy={-200} text="RUSTS AGAIN IN A WEEK" col={COL.red} out={660.4} />);
    L.push(<Words key="ws" t={t} items={[{ at: at("green slime"), txt: "GREEN SLIME" }, { at: at("white mineral crust"), txt: "+ MINERAL CRUST", col: "#f4efe6" }]} out={666.5} y={880} size={84} />);
    L.push(<Tag key="rwl" t={t} at={at("rinse it really well")} x={960} y={560} dx={-240} dy={-200} text="RINSE REALLY WELL" col={COL.ice} out={677.3} />);
    L.push(<Chips key="sc" t={t} at={at("feed scoops")} items={["FEED SCOOPS", "EGG BASKETS", "THE TRUCK"]} out={681.8} y={800} />);
    L.push(<Words key="wwf" t={t} items={[{ at: at("windshield washer"), txt: "1 CUP IN THE WASHER FLUID" }]} out={690.6} y={180} size={76} />);
    L.push(<BigNum key="30y" t={t} at={at("thirty years")} text="30 YEARS" x={1400} y={300} size={150} col={COL.ink} sub="STILL CLEAR GLASS" out={699.1} />);
    // ---- DÓNDE NUNCA ----
    L.push(<Words key="nv" t={t} items={[{ at: at("never to use it"), txt: "WHERE NEVER TO USE IT", col: COL.red }]} out={702.6} y={180} size={96} />);
    L.push(<Stamp key="bl1" t={t} at={at("Bleach is the first")} text="BLEACH · THE DANGEROUS ONE" x={960} y={300} rot={-5} size={76} out={706.6} />);
    L.push(<Words key="hy" t={t} items={[{ at: at("hurt your house"), txt: "THESE HURT YOUR HOUSE" }]} out={710.7} y={880} size={84} />);
    L.push(<Mistake key="n1" t={t} at={at("Granite and marble")} n={1} txt="GRANITE & MARBLE" out={720.6} />);
    L.push(<Tag key="dl" t={t} at={at("dull spots")} x={960} y={520} dx={240} dy={-200} text="DULL FOR GOOD" col={COL.red} out={720.6} />);
    L.push(<Words key="st2" t={t} items={[{ at: at("For stone"), txt: "STONE: WARM WATER + DISH SOAP", col: "#9df0b4" }]} out={724.1} y={180} size={70} />);
    L.push(<Mistake key="n2" t={t} at={at("Second, real wood")} n={2} txt="WAXED OR OILED WOOD" out={733.2} />);
    L.push(<Mistake key="n3" t={t} at={at("Third, cast iron")} n={3} txt="CAST IRON" out={741.6} />);
    L.push(<Tag key="sea" t={t} at={at("eats the seasoning")} x={960} y={520} dx={240} dy={-200} text="EATS THE SEASONING" col={COL.red} out={741.6} />);
    L.push(<Mistake key="n4" t={t} at={at("Fourth, the screen")} n={4} txt="PHONE · TV · COMPUTER SCREENS" out={750.5} />);
    L.push(<Mistake key="n5" t={t} at={at("And fifth")} n={5} txt="SOAKING RUBBER SEALS" out={755.2} />);
    // ---- LAS CUENTAS ----
    L.push(<Words key="sv" t={t} items={[{ at: at("what does all this save"), txt: "WHAT DOES IT SAVE?" }, { at: at("honestly"), txt: "HONESTLY", col: COL.amber }]} out={766.0} y={180} size={92} />);
    L.push(<Receipt key="rc" t={t} title="HIS SHELF · A YEAR" x={1260} y={110} sc={0.9} out={781.4} totalAt={at("$200")}
      rows={[{ at: at("Glass cleaner", 760), item: "GLASS CLEANER", $: 30 }, { at: at("bathroom spray", 760), item: "BATHROOM SPRAY", $: 36 }, { at: at("stove cleaner"), item: "STOVE CLEANER", $: 28 }, { at: at("hard water remover"), item: "HARD WATER REMOVER", $: 40 }, { at: at("washing machine cleaner", 760), item: "WASHER CLEANER", $: 30 }, { at: at("weed spray"), item: "WEED SPRAY", $: 36 }, { at: at("rust remover"), item: "RUST REMOVER", $: 25 }]} />);
    L.push(<BigNum key="200" t={t} at={at("$200")} text="$200-250" x={560} y={820} size={130} col={COL.red} sub="A YEAR AT STORE PRICES" out={781.4} />);
    L.push(<Words key="gal" t={t} items={[{ at: at("A gallon of white vinegar"), txt: "1 GALLON = $3-4" }, { at: at("one gallon a month"), txt: "≈ 1 GALLON A MONTH", col: COL.amber }]} out={794.2} y={180} size={84} />);
    L.push(<Versus key="vs" t={t} at={at("$45")} out={798.5} title="A YEAR" L={{ label: "THE SHELF", val: "$200-250", h: 0.85, col: COL.red, mark: "x" }} R={{ label: "THE JAR", val: "≈ $45", h: 0.2, col: ORANGE, mark: "ok" }} />);
    L.push(<BigNum key="kp" t={t} at={798.9} text="$150-200" x={960} y={330} size={190} col="#9df0b4" edge="#1f5a36" sub="A YEAR IN HIS POCKET" out={806.0} />);
    L.push(<Words key="10b" t={t} items={[{ at: at("ten bottles"), txt: "10 BOTTLES" }, { at: at("one jar and one spray bottle"), txt: "→ 1 JAR + 1 SPRAY", col: ORANGE }]} out={811.4} y={880} size={84} />);
    L.push(<Words key="pf" t={t} items={[{ at: at("cloud of perfume"), txt: "NO CLOUD OF PERFUME" }]} out={823.5} y={180} size={84} />);
    tag("or", at("smelled like oranges"), "jar", "ORANGES · THEN NOTHING", ORANGE, 827.4, 240, -150);
    // ---- REPASO ----
    L.push(<Words key="rp" t={t} items={[{ at: at("one last time"), txt: "ONE LAST WALK", col: ORANGE }]} out={836.8} y={180} size={96} />);
    L.push(<Chips key="r1" t={t} at={at("Orange peels in a jar")} items={["PEELS", "WHITE VINEGAR", "2 WEEKS"]} out={842.0} y={820} />);
    L.push(<Words key="r2" t={t} items={[{ at: at("half and half in a spray bottle"), txt: "50/50: COUNTERS · FRIDGE · WINDOWS · BOOTS" }]} out={848.8} y={880} size={60} />);
    L.push(<Words key="r3" t={t} items={[{ at: at("Straight for the shower head"), txt: "STRAIGHT: SHOWER HEAD · TOILET · STOVE · DRAIN · WEEDS · RUST", col: COL.amber }]} out={857.6} y={180} size={52} />);
    L.push(<CheckList key="nv2" t={t} title="NEVER" out={866.2} x={1300} y={170} rows={[{ at: at("never with bleach"), txt: "✗ WITH BLEACH" }, { at: at("never on stone"), txt: "✗ ON STONE" }, { at: at("never on waxed wood"), txt: "✗ ON WAXED WOOD" }, { at: at("never in cast iron"), txt: "✗ IN CAST IRON" }, { at: at("never on a screen"), txt: "✗ ON A SCREEN" }]} />);
    L.push(<Words key="yp" t={t} items={[{ at: at("this year's peels"), txt: "THIS YEAR'S PEELS", col: ORANGE }]} out={872.5} y={880} size={84} />);
    // ---- CTA: suscribirse + campanita + UNA pregunta ----
    L.push(<SubBell key="sb" t={t} at={at("hit subscribe")} bell={at("ring the little bell")} out={890.8} />);
    L.push(<BigNum key="60" t={t} at={at("60 years of these")} text="60 YEARS OF FARM TRICKS" x={960} y={300} size={90} col={COL.amber} out={890.8} />);
    L.push(<Words key="q" t={t} items={[{ at: at("the one cleaner under your sink"), txt: "WHAT CLEANER WOULD YOU STOP BUYING?", col: ORANGE }]} out={899.5} y={860} size={66} />);
    return L;
  },
});

export const Rest: React.FC = () => {
  useCurrentFrame();
  return <AbsoluteFill style={{ background: "#05070b" }}><M.Body /></AbsoluteFill>;
};
export const restClipPlan = M.clipPlan;
export const restBeatTable = M.beatTable;
