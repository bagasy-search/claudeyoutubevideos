// frank01 · DEL 1:24,6 AL FINAL (84,58 → 574,56 s) con el kit yanqui3d. Una base por frase (avatar / toma agnes / la vereda 3D
// en corte / tarjeta) con transición siempre; piezas 2.5D en su capa, ancladas a la palabra con at(). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill } from "remotion";
import { setDurs, setSlug, COL, BigNum, Chips, Tag, Receipt, Vid, FONT, extrude, e } from "../kits/yanqui3d/lib";
import { makeVideo, Stamp, Price, Beat, Tr } from "../kits/yanqui3d/engine";
import { StepTitle, Timer, Words, Versus, CheckList, MistakesDeal, Mistake, NextCard } from "../kits/yanqui3d/pieces";
import { World, T0 } from "./Min1";
import { screenOf, PT } from "./slab3d";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

setSlug("frank01");
setDurs((AVAIL as { dur?: Record<string, number> }).dur);
export const TEND = 574.555;
export const FULL_FRAMES = Math.ceil(TEND * 30);
const WINS = (AVW as { win: { ms: number; me: number; off: number }[] }).win.map((w) => [w.ms, w.me, w.off]);

// base: la vereda 3D
const W = (a: number, tr: Tr, p?: [number, number]): Beat => ({ a, tr, p, r: (t) => <World t={t} /> });
// base: tarjeta sobre la maqueta desenfocada
const CARD = (a: number, tr: Tr, wt: number): Beat => ({ a, tr, r: () => <AbsoluteFill><AbsoluteFill style={{ filter: "blur(14px) brightness(.45)", transform: "scale(1.06)" }}><World t={wt} /></AbsoluteFill></AbsoluteFill> });

export const rest = makeVideo({
  caps: CAPS as [string, number][], avwin: WINS, avail: AVAIL as { clips: string[]; imgs: string[] }, T0, TEND,
  beats: ({ AV, CL, Avatar }) => {
    const AVat = (a: number, tr: Tr, spans: [number, number][] = []): Beat => ({ a, tr, r: (t) => <Avatar t={t} blur={spans.some(([x, y]) => t >= x && t < y) ? 12 : 0} dark={spans.some(([x, y]) => t >= x && t < y) ? 0.35 : 0} /> });
    return [
      AV(84.577, "cut", { spans: [[86.4, 88.7]] }),
      CL(88.72, "s40", "whip"),
      CL(92.5, "s01", "push", undefined, [1.02, 1.1]),
      W(97.62, "zoom"),
      AV(100.77, "whipL"),
      CL(102.6, "s02", "portal", [1300, 420], [1.0, 1.18]),
      W(105.7, "light"),
      CL(111.4, "s03", "portal", [960, 300]),
      CL(115.5, "s04", "whip"),
      AV(117.96, "whipL", { spans: [[119.8, 121.9]] }),
      W(121.92, "zoom"),
      AV(133.88, "whip", { spans: [[135.0, 137.5]] }),
      W(137.59, "zoom"),
      CL(141.4, "s06", "portal", [960, 640]),
      W(144.1, "zoom"),
      AV(147.68, "whipL", { spans: [[148.4, 151.4]], edge: true }),
      CL(152.49, "s07", "push"),
      W(157.0, "zoom"),
      AV(165.67, "whip", { spans: [[166.0, 169.0]], edge: true }),
      CL(170.28, "s09", "light"),
      W(173.7, "zoom"),
      AV(181.52, "whipL"),
      W(185.37, "zoom"),
      CL(190.5, "s43", "portal", [960, 600]),
      AV(195.64, "whip", { spans: [[196.5, 199.5]], edge: true }),
      W(201.66, "light"),
      CL(207.0, "s10", "portal", [960, 500]),
      AV(215.16, "whipL", { spans: [[215.4, 218.4]], edge: true }),
      CL(220.73, "s11", "push"),
      CL(226.0, "s12", "whip"),
      AV(230.3, "whipL", { spans: [[232.3, 235.3]], edge: true }),
      W(235.76, "zoom"),
      W(241.5, "push"),
      AV(247.34, "whip", { spans: [[248.0, 251.0]] }),
      CL(251.85, "s44", "flip"),
      CL(257.5, "s17", "whip"),
      CL(260.0, "s14", "portal", [960, 640]),
      AV(264.22, "whipL"),
      CL(267.98, "s15", "push"),
      W(269.2, "zoom"),
      CL(274.5, "s16", "portal", [960, 640]),
      AV(279.12, "whip", { spans: [[280.0, 283.0]], edge: true }),
      CL(284.48, "s18", "flip"),
      CL(288.3, "s19", "whip"),
      W(294.0, "zoom"),
      AV(299.04, "whipL", { spans: [[302.6, 304.4]] }),
      CL(304.46, "s20", "flip"),
      CL(310.5, "s21", "push"),
      AV(315.43, "whip"),
      CL(319.56, "s22", "portal", [960, 600]),
      W(324.5, "zoom"),
      AV(329.8, "whipL", { spans: [[331.5, 334.5]], edge: true }),
      CL(335.13, "s23", "flip"),
      CL(343.0, "s24", "push"),
      AV(348.57, "whip"),
      CL(352.39, "s36", "whipL"),
      CL(356.8, "s13", "push"),
      AV(363.56, "whip", { spans: [[364.4, 367.4]], edge: true }),
      CL(368.12, "s25", "flip"),
      CL(373.2, "s26", "whip"),
      CL(376.3, "s27", "whip"),
      W(379.7, "zoom"),
      AVat(381.9, "whipL"),
      W(384.1, "zoom"),
      CL(390.6, "s28", "portal", [960, 640]),
      AV(397.05, "whipL", { spans: [[398.2, 401.1]], edge: true }),
      CL(401.12, "s29", "flip"),
      W(407.0, "zoom"),
      AV(412.15, "whip", { spans: [[413.4, 416.4]], edge: true }),
      W(418.17, "zoom"),
      CL(424.2, "s30", "portal", [960, 600]),
      CL(427.7, "s31", "push"),
      AV(430.37, "whipL", { spans: [[431.0, 434.0]], edge: true }),
      CL(435.73, "s32", "light"),
      W(441.0, "zoom"),
      AV(447.58, "whip"),
      CL(451.31, "s33", "flip"),
      CL(456.5, "s34", "push"),
      AV(461.24, "whipL", { spans: [[461.4, 464.4]], edge: true }),
      W(466.17, "zoom"),
      CARD(472.4, "push", 472.4),
      AV(478.65, "whip", { spans: [[478.8, 481.8]], edge: true }),
      CL(484.18, "s35", "flip"),
      W(487.5, "zoom"),
      W(492.3, "push"),
      AV(496.93, "whipL", { spans: [[497.5, 500.4]] }),
      CL(500.48, "s37", "flip"),
      CL(504.6, "s39", "whip"),
      CL(508.5, "s38", "push"),
      AV(512.38, "whipL", { spans: [[512.6, 515.6]], edge: true }),
      W(516.82, "zoom"),
      W(522.6, "push"),
      AV(528.49, "whip", { spans: [[529.0, 532.0]], edge: true }),
      W(534.3, "zoom"),
      W(539.0, "push"),
      AV(544.25, "whipL", { spans: [[545.6, 548.6]], edge: true }),
      W(549.36, "zoom"),
      CL(556.9, "s41", "flip"),
      AV(562.62, "whip", { spans: [[562.9, 565.9]], edge: true }),
    ];
  },
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    const sp = (q: [number, number, number]) => screenOf(t, q);
    // ---- por qué se raja ----
    L.push(<Words key="w1" t={t} items={[{ at: at("all concrete cracks"), txt: "ALL CONCRETE CRACKS", col: COL.amber }]} out={at("when it's poured") - 0.2} y={860} size={96} />);
    L.push(<Tag key="t1" t={t} at={at("full of water")} x={960} y={600} dx={-220} dy={-200} text="FULL OF WATER" col={COL.ice} out={98.6} />);
    L.push(<Words key="w2" t={t} items={[{ at: at("the slab shrinks"), txt: "IT SHRINKS", col: COL.ice2 }]} out={100.6} y={200} size={110} />);
    L.push(<BigNum key="dime" t={t} at={at("thickness of a dime")} text="A DIME" x={1380} y={330} size={170} out={107.4} sub="10 FT SLAB GETS THIS MUCH SHORTER" />);
    L.push(<Stamp key="st1" t={t} at={at("that's normal")} text="NORMAL" x={1400} y={760} out={110.4} rot={-6} size={90} />);
    { const j = sp(PT.joint); L.push(<Tag key="tj" t={t} at={at("we cut those lines")} x={j.x} y={j.y} dx={200} dy={-160} text="CONTROL JOINTS" sub="TELL THE CRACK WHERE TO GO" col={COL.amber} out={111.35} />); }
    L.push(<Words key="w3" t={t} items={[{ at: at("water is the problem"), txt: "WATER IS THE PROBLEM", col: COL.ice }]} out={120.7} y={860} size={90} />);
    L.push(<Words key="w4" t={t} items={[{ at: at("an open door"), txt: "AN OPEN DOOR", col: COL.amber }]} out={122.3} y={860} size={120} />);
    { const c = sp(PT.crackSec), u = sp(PT.under);
      L.push(<Tag key="tw1" t={t} at={at("water goes in")} x={c.x} y={c.y} dx={220} dy={-180} text="WATER IN" col={COL.ice} out={125.0} />);
      L.push(<Tag key="tw2" t={t} at={at("it washes the gravel")} x={u.x} y={u.y} dx={240} dy={120} text="WASHES OUT THE GRAVEL" col={COL.amber} out={131.0} size={40} />);
      L.push(<Tag key="tw3" t={t} at={at("loses its support")} x={u.x} y={u.y} dx={-240} dy={130} text="NO SUPPORT" col={COL.red} out={133.6} size={44} />); }
    L.push(<BigNum key="9p" t={t} at={at("about 9%")} text="+9%" x={1400} y={360} size={260} col={COL.ice2} edge="#24506e" out={137.4} sub="WATER → ICE" />);
    L.push(<Words key="w5" t={t} items={[{ at: at("split rock"), txt: "ENOUGH TO SPLIT ROCK", col: COL.ice2 }]} out={141.2} y={200} size={90} />);
    L.push(<Words key="w6" t={t} items={[{ at: at("every single winter"), txt: "EVERY WINTER", col: COL.red }]} out={144.0} y={860} size={100} />);
    L.push(<Stamp key="st2" t={t} at={at("a crack that's sealed")} text="SEALED = DOESN'T GROW" x={960} y={830} out={147.5} rot={-4} size={74} />);
    L.push(<Words key="w7" t={t} items={[{ at: at("not fixing concrete"), txt: "NOT FIXING CONCRETE" }, { at: at("closing the door"), txt: "CLOSING THE DOOR", col: COL.amber }]} out={152.3} y={540} size={100} />);
    // ---- masilla y parche ----
    L.push(<Price key="pc" t={t} at={at("tube of gray caulk")} x={1500} y={260} item="GRAY CAULK" $={9} out={156.8} />);
    L.push(<Tag key="tsum" t={t} at={at("one summer")} x={960} y={500} dx={-200} dy={-170} text="ONE SUMMER" col={COL.amber} out={161.9} />);
    { const c = sp(PT.crackTop);
      L.push(<Tag key="tsun" t={t} at={at("the sun cooks it")} x={c.x} y={c.y} dx={220} dy={-170} text="SUN COOKS IT" col={COL.amber} out={163.9} />);
      L.push(<Tag key="tshr" t={t} at={at("it peels away")} x={c.x} y={c.y} dx={-240} dy={-150} text="SHRINKS · PEELS" col={COL.red} out={165.5} />); }
    L.push(<Words key="w8" t={t} items={[{ at: at("a rubber strip"), txt: "A RUBBER STRIP" }, { at: at("holding water"), txt: "HOLDING WATER", col: COL.ice }]} out={170.1} y={860} size={90} />);
    { const c = sp(PT.crackTop);
      L.push(<Tag key="tscab" t={t} at={at("like a scab")} x={c.x} y={c.y} dx={220} dy={-170} text="A SCAB" col={COL.amber} out={177.2} />);
      L.push(<Tag key="tpop" t={t} at={at("pops it right off")} x={c.x} y={c.y - 40} dx={-200} dy={-170} text="POP!" col={COL.red} out={178.8} size={64} />); }
    L.push(<Words key="w9" t={t} items={[{ at: at("they just sit on it"), txt: "THEY JUST SIT ON IT", col: COL.red }]} out={185.2} y={860} size={96} />);
    // ---- la lechada ----
    L.push(<Words key="w10" t={t} items={[{ at: at("it's called a slurry"), txt: "SLURRY", col: COL.amber }, { at: at("call it a grout"), txt: "GROUT", col: COL.dim }]} out={192.6} y={190} size={120} />);
    L.push(<Chips key="c1" t={t} at={at("bonds to cement")} items={["BONDS TO CEMENT", "MOVES WITH THE SLAB", "RUNS TO THE BOTTOM"]} out={201.4} />);
    { const c = sp(PT.crackSec);
      L.push(<Tag key="tbot" t={t} at={at("all the way down")} x={c.x} y={c.y + 40} dx={240} dy={120} text="ALL THE WAY DOWN" col={COL.ice2} out={205.4} />);
      L.push(<Tag key="tbri" t={t} at={at("instead of bridging")} x={c.x} y={c.y - 60} dx={-240} dy={-140} text="NOT BRIDGING OVER" col={COL.amber} out={206.8} size={40} />); }
    // ---- la receta ----
    L.push(<StepTitle key="rec" t={t} at={at("here's the recipe")} n={0} name="THE RECIPE" out={207.2} />);
    L.push(<CheckList key="cl" t={t} title="THE RECIPE" rows={[{ at: at("one part plain portland"), txt: "1 PART PORTLAND CEMENT" }, { at: at("one part fine sand"), txt: "1 PART FINE SAND" }, { at: at("half water and half"), txt: "½ WATER + ½ WHITE GLUE" }]} out={230.1} />);
    L.push(<Words key="w11" t={t} items={[{ at: at("not the mix"), txt: "NOT THE MIX" }, { at: at("not the patch"), txt: "NOT THE PATCH" }]} out={at("plain gray powder") + 0.6} y={860} size={80} />);
    L.push(<Price key="pb" t={t} at={at("15 bucks")} x={560} y={240} item="94 LB BAG" $={15} out={220.5} />);
    L.push(<Tag key="tss" t={t} at={at("school glue")} x={960} y={420} dx={-220} dy={-170} text="CHEAP SCHOOL GLUE" sub="OR PVA WOOD GLUE" col={COL.amber} out={232.2} />);
    L.push(<Stamp key="sec" t={t} at={at("glue is the secret")} text="THE SECRET" x={1400} y={780} out={235.5} rot={-7} size={96} />);
    L.push(<Price key="pba" t={t} at={at("bonding agent")} x={1500} y={240} item="BONDING AGENT" $={20} out={240.6} />);
    { const c = sp(PT.crackSec);
      L.push(<Tag key="tgr" t={t} at={at("grab the old concrete")} x={c.x} y={c.y} dx={240} dy={-170} text="GRABS LIKE IT'S ALIVE" col={COL.amber} out={244.0} size={42} />);
      L.push(<Tag key="tdr" t={t} at={at("from drying out")} x={c.x} y={c.y} dx={-240} dy={140} text="WON'T DRY TOO FAST" col={COL.ice} out={247.2} size={42} />); }
    L.push(<BigNum key="2b" t={t} at={at("about $2", 240)} text="$2" x={1400} y={360} size={300} col="#9df0b4" edge="#1f5a36" out={251.6} sub="A BATCH" />);
    // ---- paso 1: abrir ----
    L.push(<StepTitle key="s1" t={t} at={at("step 1")} n={1} name="OPEN THE CRACK" out={at("step 1") + 2.6} />);
    L.push(<Words key="w12" t={t} items={[{ at: at("sounds backwards"), txt: "SOUNDS BACKWARDS", col: COL.amber }]} out={257.4} y={860} size={86} />);
    L.push(<Chips key="c2" t={t} at={at("cold chisel")} items={["COLD CHISEL + HAMMER", "OR A GRINDER"]} out={267.8} />);
    { const c = sp(PT.crackSec);
      L.push(<Tag key="tv" t={t} at={at("into a little v")} x={c.x} y={c.y - 30} dx={240} dy={-160} text="A LITTLE V" col={COL.amber} out={274.3} />);
      L.push(<Tag key="tth" t={t} at={at("as wide as my thumb")} x={c.x} y={c.y - 30} dx={-240} dy={-140} text="THUMB WIDE" out={274.3} size={42} />);
      L.push(<Tag key="tq" t={t} at={at("a quarter inch")} x={c.x} y={c.y + 40} dx={-240} dy={140} text="¼ – ½ INCH DEEP" col={COL.ice2} out={274.4} size={42} />); }
    L.push(<CheckList key="cl2" t={t} title="PULL OUT" rows={[{ at: at("every weed"), txt: "EVERY WEED" }, { at: at("every root"), txt: "EVERY ROOT" }, { at: at("every bit of loose"), txt: "LOOSE CONCRETE" }]} out={284.3} />);
    // ---- paso 2: limpiar ----
    L.push(<StepTitle key="s2" t={t} at={at("step two")} n={2} name="CLEAN IT OUT" out={at("step two") + 2.6} />);
    L.push(<Chips key="c3" t={t} at={at("a shop vac")} items={["SHOP VAC", "LEAF BLOWER", "A STRAW"]} out={293.8} />);
    { const c = sp(PT.crackSec);
      L.push(<Tag key="tdu" t={t} at={at("dust is what the slurry sticks to")} x={c.x} y={c.y + 30} dx={240} dy={140} text="DUST" sub="THE SLURRY STICKS TO IT" col={COL.red} out={299.0} />); }
    L.push(<Words key="w13" t={t} items={[{ at: at("the dust lets go"), txt: "AND THE DUST LETS GO", col: COL.red }]} out={304.8} y={860} size={86} />);
    // ---- paso 3: mojar ----
    L.push(<StepTitle key="s3" t={t} at={at("step three")} n={3} name="WET THE CRACK" out={at("step three") + 2.2} col={COL.ice} />);
    L.push(<Words key="w14" t={t} items={[{ at: at("everybody skips"), txt: "EVERYBODY SKIPS IT", col: COL.red }]} out={309.5} y={860} size={86} />);
    L.push(<Timer key="tm1" t={t} at={at("about 10 minutes")} out={319.4} secs={10} unit="" label="MINUTES" />);
    L.push(<Words key="tdp" t={t} items={[{ at: at("looks damp"), txt: "DAMP · NO PUDDLE", col: COL.ice }]} out={321.8} y={200} size={86} />);
    L.push(<Words key="w15" t={t} items={[{ at: at("dry concrete is thirsty"), txt: "DRY CONCRETE IS THIRSTY", col: COL.amber }]} out={324.3} y={860} size={86} />);
    { const c = sp(PT.crackSec);
      L.push(<Tag key="tsu" t={t} at={at("sucks the water")} x={c.x} y={c.y} dx={240} dy={-170} text="SUCKS THE WATER OUT" col={COL.ice} out={329.6} size={42} />);
      L.push(<Words key="tch" t={t} items={[{ at: at("chalky line"), txt: "WEAK · CHALKY", col: COL.red }]} out={333.8} y={200} size={90} />); }
    L.push(<Words key="w16" t={t} items={[{ at: at("damp, not wet"), txt: "DAMP, NOT WET", col: COL.ice }]} out={335.1} y={860} size={110} />);
    // ---- paso 4: la mezcla ----
    L.push(<StepTitle key="s4" t={t} at={at("step 4")} n={4} name="THE MIX" out={at("step 4") + 2.4} />);
    L.push(<Words key="w17" t={t} items={[{ at: at("dry first"), txt: "DRY FIRST" }, { at: at("a little at a time", 340), txt: "LIQUID: A LITTLE AT A TIME", col: COL.ice }]} out={345.0} y={860} size={76} />);
    L.push(<Stamp key="pan" t={t} at={at("pancake batter")} text="PANCAKE BATTER" x={1340} y={260} out={352.2} rot={-6} size={84} />);
    L.push(<Stamp key="thick" t={t} at={at("it's too thick")} text="TOO THICK" x={1300} y={300} out={357.6} rot={6} size={96} />);
    L.push(<Timer key="tm2" t={t} at={at("about 20 minutes")} out={363.4} secs={20} unit="" label="MINUTES" />);
    // ---- paso 5: volcar ----
    L.push(<StepTitle key="s5" t={t} at={at("step 5")} n={5} name="POUR IT" out={at("step 5") + 2.3} />);
    L.push(<Words key="tdeep" t={t} items={[{ at: at("more than about half an inch"), txt: "DEEPER THAN ½ INCH?", col: COL.amber }]} out={368.0} y={200} size={86} />);
    L.push(<Words key="w18" t={t} items={[{ at: at("dry sand down"), txt: "DRY SAND FIRST" }, { at: at("filling a cave"), txt: "DON'T FILL A CAVE", col: COL.amber }]} out={373.0} y={860} size={84} />);
    { const c = sp(PT.crackSec);
      L.push(<Tag key="tbub" t={t} at={at("little bubbles come up")} x={c.x} y={c.y} dx={240} dy={-160} text="BUBBLES" sub="AIR COMING OUT" col={COL.ice2} out={381.9} />); }
    L.push(<Tag key="thi" t={t} at={at("slightly higher than the surface")} x={960} y={540} dx={240} dy={-170} text="A HAIR HIGHER" col={COL.amber} out={390.4} />);
    // ---- paso 6: enrasar ----
    L.push(<StepTitle key="s6" t={t} at={at("step 6")} n={6} name="STRIKE IT OFF" out={at("step 6") + 2.3} />);
    L.push(<Timer key="tm3" t={t} at={at("about half an hour")} out={401.0} secs={30} unit="" label="MINUTES" />);
    L.push(<Words key="w19" t={t} items={[{ at: at("barely damp"), txt: "OLD BRUSH, BARELY DAMP" }]} out={406.8} y={860} size={80} />);
    L.push(<Words key="w20" t={t} items={[{ at: at("barely see the repair"), txt: "YOU CAN BARELY SEE IT", col: COL.amber }]} out={412.1} y={190} size={96} />);
    // ---- paso 7: curar ----
    L.push(<StepTitle key="s7" t={t} at={at("step 7")} n={7} name="CURE IT" out={at("step 7") + 2.4} col={COL.ice} />);
    L.push(<Words key="w21" t={t} items={[{ at: at("cement doesn't dry"), txt: "IT DOESN'T DRY" }, { at: at("it cures"), txt: "IT CURES", col: COL.ice }]} out={421.0} y={860} size={100} />);
    L.push(<BigNum key="3d" t={t} at={at("three days. three days")} text="3 DAYS" x={1400} y={360} size={220} col={COL.ice2} edge="#24506e" out={430.2} sub="KEEP IT DAMP" />);
    L.push(<Words key="w22" t={t} items={[{ at: at("half the strength"), txt: "-50% STRENGTH", col: COL.red }]} out={435.7} y={860} size={100} />);
    // ---- la prueba ----
    L.push(<BigNum key="30d" t={t} at={at("thirty days later")} text="30 DAYS LATER" x={960} y={220} size={130} out={441.0} />);
    { const c = sp(PT.crackTop);
      L.push(<Tag key="tsh" t={t} at={at("just sheets across")} x={c.x} y={c.y} dx={240} dy={-170} text="SHEETS ACROSS" col={COL.ice} out={447.4} />); }
    L.push(<Stamp key="dc" t={t} at={at("the door is closed")} text="DOOR CLOSED ✓" x={960} y={820} out={447.4} rot={-5} size={90} />);
    L.push(<Words key="tdis" t={t} items={[{ at: at("disappear into the line"), txt: "DISAPPEARS? DO IT AGAIN", col: COL.red }]} out={451.2} y={860} size={80} />);
    L.push(<BigNum key="29" t={t} at={at("for 29 years")} text="29 YEARS" x={1340} y={330} size={190} out={460.4} sub="PASSED EVERY SPRING" />);
    // ---- la cuenta ----
    L.push(<Receipt key="rc" t={t} rows={[{ at: at("portland cement, a few cups"), item: "CEMENT (A FEW CUPS)", $: 0.5 }, { at: at("play sand, a few cups"), item: "PLAY SAND", $: 0.25 }, { at: at("white glue, a couple"), item: "WHITE GLUE", $: 1.25 }, { at: at("wire brush and a putty knife"), item: "BRUSH + PUTTY KNIFE", $: 0 }]} totalAt={at("call it $2")} x={1200} y={190} out={474.5} sc={1.25} title="ONE CRACK" />);
    L.push(<Versus key="vs" t={t} at={474.6} out={478.5} L={{ label: "MY SLURRY", val: "$2", h: 0.06, col: "#9df0b4", mark: "ok" }} R={{ label: "THE JACKHAMMER", val: "$4,000", h: 0.8, col: COL.red, mark: "x" }} />);
    // ---- los errores ----
    L.push(<MistakesDeal key="md" t={t} at={at("now the mistakes")} out={480.0} />);
    L.push(<Mistake key="m1" t={t} at={at("number one")} n={1} txt="POURING INTO A DIRTY CRACK" out={484.0} />);
    L.push(<Mistake key="m2" t={t} at={at("pouring into a dry crack") - 0.3} n={2} txt="POURING INTO A DRY CRACK" out={489.0} />);
    L.push(<Mistake key="m3" t={t} at={at("making it too thick") - 0.3} n={3} txt="MAKING IT TOO THICK" out={496.8} />);
    L.push(<Tag key="tpb" t={t} at={at("like peanut butter")} x={960} y={420} dx={-200} dy={-150} text="PEANUT BUTTER = NEVER REACHES THE BOTTOM" col={COL.amber} out={496.6} size={38} />);
    L.push(<Mistake key="m4" t={t} at={at("doing it in the hot sun") - 0.3} n={4} txt="HOT SUN · FREEZE COMING" out={504.4} />);
    L.push(<Words key="w23" t={t} items={[{ at: at("cool, cloudy day"), txt: "COOL, CLOUDY DAY", col: COL.ice }]} out={507.0} y={190} size={96} />);
    L.push(<Mistake key="m5" t={t} at={at("using this on the wrong crack") - 0.3} n={5} txt="THE WRONG CRACK" out={512.2} />);
    // ---- la grieta equivocada ----
    L.push(<Stamp key="hon" t={t} at={at("be straight with you")} text="STRAIGHT WITH YOU" x={1400} y={760} out={516.6} rot={-5} size={70} />);
    L.push(<CheckList key="cl3" t={t} title="NOT FOR THIS" rows={[{ at: at("one side of the crack is higher"), txt: "ONE SIDE HIGHER" }, { at: at("the slab is sinking"), txt: "SINKING / TILTING" }, { at: at("wider than your finger"), txt: "WIDER THAN A FINGER" }]} out={528.3} />);
    { const u = sp(PT.under);
      L.push(<Tag key="tgp" t={t} at={at("that's a ground problem")} x={u.x} y={u.y} dx={-240} dy={140} text="A GROUND PROBLEM" col={COL.red} out={528.3} />); }
    L.push(<Words key="w24" t={t} items={[{ at: at("the thin cracks"), txt: "THIN" }, { at: at("the ones that are flat"), txt: "FLAT" }, { at: at("letting water in"), txt: "LETTING WATER IN", col: COL.ice }]} out={539.7} y={190} size={96} />);
    L.push(<BigNum key="90" t={t} at={at("that's 90%")} text="90%" x={1400} y={380} size={260} col="#9df0b4" edge="#1f5a36" out={543.0} sub="OF WHAT I SEE" />);
    L.push(<Chips key="c4" t={t} at={at("cement, sand", 540)} items={["CEMENT", "SAND", "WATER", "GLUE", "PATIENCE"]} out={549.2} />);
    L.push(<Tag key="tnb" t={t} at={at("my neighbor paid")} x={960} y={420} dx={-240} dy={-150} text="MY NEIGHBOR" sub="PAID A COMPANY" col={COL.amber} out={554.6} />);
    L.push(<Stamp key="his" t={t} at={at("his is cracked again")} text="HIS: CRACKED AGAIN" x={700} y={800} out={556.7} rot={-6} size={70} />);
    L.push(<GreenStamp key="mine" t={t} at={at("mine isn't")} out={562.4} />);
    L.push(<NextCard key="nx" t={t} at={at("next time")} subAt={at("piece of plywood")} out={572.0} title="NEXT: CRUMBLING STEPS"><Vid id={(AVAIL as { clips: string[] }).clips.includes("s42") ? "ltx_s42" : "img_s42"} at={at("next time")} /></NextCard>);
    L.push(<Words key="w25" t={t} items={[{ at: at("take care of your house"), txt: "TAKE CARE OF YOUR HOUSE", col: COL.amber }]} out={574.3} y={880} size={80} />);
    return L;
  },
});

const GreenStamp: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const k = Math.min(1, Math.max(0, (t - at) * 5));
  return <div style={{ position: "absolute", left: 1300, top: 300, opacity: o, transform: `translate(-50%,-50%) rotate(-6deg) scale(${2.2 - 1.2 * k})`, border: "10px solid #5ee38f", borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: 92, color: "#5ee38f", background: "rgba(0,30,10,.45)", boxShadow: "0 0 30px rgba(94,227,143,.45)", textShadow: extrude(4, "rgba(0,0,0,.5)"), whiteSpace: "nowrap" }}>MINE ISN'T ✓</div>;
};

export const Rest: React.FC = () => <rest.Body />;
