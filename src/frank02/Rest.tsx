// frank02 · DEL 1:33,9 AL FINAL (93,9 → 930,4 s) con el kit yanqui3d. Una base por frase (avatar / toma agnes-LTX / el bloque gigante
// en corte y el banco de pruebas 3D) con transición siempre; piezas 2.5D en su capa, ancladas a la palabra con at(). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill } from "remotion";
import { setDurs, setSlug, COL, BigNum, Chips, Tag, Receipt, FONT, extrude, e } from "../kits/yanqui3d/lib";
import { makeVideo, Stamp, Price, Beat, Tr } from "../kits/yanqui3d/engine";
import { StepTitle, Timer, Words, Versus, CheckList, MistakesDeal, Mistake, NextCard } from "../kits/yanqui3d/pieces";
import { Vid } from "../kits/yanqui3d/lib";
import { World, T0 } from "./Min1";
import { screenOf, PT } from "./block3d";
import { RS as R } from "./states";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

setSlug("frank02");
setDurs((AVAIL as { dur?: Record<string, number> }).dur);
export const TEND = 930.39;
export const FULL_FRAMES = Math.ceil(TEND * 30);
const WINS = (AVW as { win: { ms: number; me: number; off: number }[] }).win.map((w) => [w.ms, w.me, w.off]);
const HAS = AVAIL as { clips: string[]; imgs: string[] };
// la toma LTX si llegó; si no, la foto de la que salió
const pk = (a: string, b: string) => (HAS.clips.includes(a) ? a : b);

// base: el mundo 3D (bloque gigante en corte + banco de pruebas)
const W = (a: number, tr: Tr, p?: [number, number]): Beat => ({ a, tr, p, r: (t) => <World t={t} /> });

export const rest = makeVideo({
  caps: CAPS as [string, number][], avwin: WINS, avail: HAS, T0, TEND,
  beats: ({ AV, CL }) => [
    // ---- lo que promete el video ----
    W(T0, "cut"),
    AV(97.26, "whip"),
    CL(101.5, "s01", "push"),
    CL(108.6, "s02", "portal", [960, 600], [1.0, 1.15]),
    AV(113.78, "whipL", { spans: [[117.4, 119.0]] }),
    W(119.4, "zoom"),
    CL(123.4, "s03", "portal", [960, 640]),
    W(127.0, "zoom"),
    // ---- qué es el concreto ----
    AV(130.27, "whip", { spans: [[132.2, 134.0]] }),
    CL(135.2, "s04", "whip"),
    W(138.6, "zoom"),
    AV(146.61, "whipL"),
    W(150.3, "zoom"),
    CL(158.6, "s05", "push"),
    AV(162.29, "whip", { spans: [[164.2, 167.0]] }),
    CL(168.2, "s06", "whip"),
    W(171.5, "zoom"),
    AV(178.72, "whipL"),
    W(184.9, "zoom"),
    CL(190.4, "s07", "portal", [960, 560]),
    CL(194.0, "s08", "whip"),
    // ---- el pedacito de verdad: el aire ----
    AV(197.04, "whip"),
    W(201.5, "zoom"),
    CL(208.3, "s09", "portal", [960, 540]),
    AV(213.58, "whipL"),
    CL(217.1, "s10", "whip"),
    W(223.3, "zoom"),
    AV(230.07, "whip"),
    W(233.6, "zoom"),
    CL(242.9, "s12", "whip"),
    AV(245.76, "whipL"),
    W(250.5, "zoom"),
    CL(256.6, "s11", "push"),
    // ---- los laboratorios ----
    AV(262.14, "whip"),
    CL(267.2, "s13", "portal", [960, 600]),
    W(274.0, "zoom"),
    AV(279.11, "whipL"),
    CL(282.9, "s15", "flip"),
    CL(288.6, "s14", "push"),
    AV(294.8, "whip"),
    W(300.7, "zoom"),
    AV(311.91, "whipL"),
    CL(317.0, "s16", "push"),
    // ---- lo que hice: tres bloques ----
    CL(320.5, "s17", "whip"),
    CL(324.1, "s18", "push"),
    AV(328.02, "whip"),
    W(332.0, "zoom"),
    CL(336.4, "s19", "whip"),
    W(340.2, "zoom"),
    AV(343.54, "whipL"),
    W(349.7, "push"),
    W(355.0, "zoom"),
    AV(361.58, "whip"),
    W(366.3, "zoom"),
    CL(370.6, "s22", "portal", [960, 500]),
    AV(376.97, "whipL", { spans: [[378.3, 381.0]] }),
    CL(382.8, "s23", "whip"),
    CL(388.4, "s52", "push"),
    AV(394.83, "whip"),
    CL(399.2, "s24", "whip"),
    CL(403.1, "s25", "push"),
    CL(407.4, "s26", "whip"),
    AV(411.62, "whipL", { spans: [[412.6, 415.6]] }),
    CL(416.3, "s27", "whip"),
    // ---- prueba 1: mirar y tocar ----
    CL(420.3, "s56", "push"),
    CL(424.4, "s28", "portal", [960, 600]),
    AV(428.41, "whip", { spans: [[429.0, 432.5]] }),
    CL(433.9, "s29", "whip"),
    CL(438.2, "s30", "portal", [960, 640]),
    AV(443.14, "whipL"),
    // ---- prueba 2: agua ----
    W(446.6, "zoom"),
    CL(453.4, "s31", "whip"),
    AV(459.85, "whip"),
    CL(463.8, pk("p02", "s32"), "push"),
    W(468.0, "zoom"),
    AV(473.64, "whipL", { spans: [[475.6, 477.2]] }),
    CL(477.4, "s33", "whip"),
    W(482.0, "zoom"),
    // ---- prueba 3: la llave ----
    AV(490.16, "whip", { spans: [[490.4, 493.8]] }),
    CL(495.8, "s34", "whip"),
    CL(500.6, "s35", "push"),
    AV(507.26, "whipL"),
    // ---- prueba 4: el martillo ----
    CL(512.9, "s36", "whip"),
    W(517.0, "zoom"),
    AV(523.01, "whip", { spans: [[525.5, 527.0]] }),
    CL(527.9, pk("p01", "s37"), "push"),
    W(531.4, "zoom"),
    CL(535.9, "t01", "flip"),
    CL(539.2, "s37", "push", undefined, [1.0, 1.16]),
    AV(541.4, "whipL", { spans: [[542.2, 545.6]] }),
    // ---- prueba 5: el freezer ----
    W(546.2, "zoom"),
    CL(550.6, "s38", "whip"),
    CL(554.2, "s39", "push"),
    AV(557.37, "whip"),
    CL(563.3, "s40", "whip"),
    W(568.0, "zoom"),
    AV(574.47, "whipL"),
    CL(579.8, "s41", "portal", [960, 600]),
    W(585.0, "zoom"),
    // ---- lo que aprendí ----
    AV(591.93, "whip"),
    W(595.4, "zoom"),
    CL(602.6, "s42", "whip"),
    AV(606.91, "whipL", { spans: [[607.4, 610.6]] }),
    W(611.0, "zoom"),
    W(618.0, "push"),
    AV(624.32, "whip", { spans: [[624.9, 628.2]] }),
    W(628.5, "zoom"),
    CL(633.6, "s43", "whip"),
    // ---- la historia de Sal ----
    AV(641.11, "whipL"),
    CL(647.2, "s53", "whip"),
    W(652.0, "zoom"),
    AV(657.93, "whip"),
    W(662.8, "zoom"),
    W(669.4, "push"),
    AV(676.28, "whipL", { spans: [[677.7, 680.4]] }),
    W(680.8, "zoom"),
    AV(692.65, "whip"),
    W(698.5, "zoom"),
    // ---- el único lugar del aceite: los moldes ----
    AV(707.12, "whipL"),
    CL(711.3, "s45", "flip"),
    CL(719.5, "s44", "push"),
    AV(724.5, "whip", { spans: [[725.0, 729.0]] }),
    W(729.6, "zoom"),
    AV(742.28, "whipL", { spans: [[745.6, 746.4]] }),
    W(747.0, "push"),
    // ---- el aceite usado envenena ----
    AV(759.19, "whip"),
    CL(763.0, "s46", "flip"),
    CL(771.0, "s47", "whip"),
    AV(775.24, "whipL"),
    W(781.4, "zoom"),
    AV(791.89, "whip"),
    CL(798.3, "s49", "push"),
    // ---- qué hacer: 3 cosas ----
    W(803.0, "zoom"),
    AV(811.29, "whipL"),
    CL(815.6, "s20", "whip"),
    CL(823.8, "s50", "push"),
    AV(828.68, "whip"),
    CL(833.6, "s51", "push"),
    W(839.0, "zoom"),
    AV(843.57, "whipL"),
    W(848.1, "zoom"),
    W(855.2, "push"),
    AV(861.29, "whip"),
    W(865.9, "zoom"),
    // ---- veredicto ----
    AV(876.61, "whipL"),
    W(881.7, "zoom"),
    AV(893.05, "whip", { spans: [[894.5, 896.8]] }),
    W(897.0, "zoom"),
    CL(899.8, "s54", "whip"),
    W(903.0, "zoom"),
    CL(906.2, "s48", "push"),
    AV(909.59, "whipL"),
    W(915.0, "zoom"),
    AV(926.28, "whip"),
  ],
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    const sp = (q: [number, number, number]) => screenOf(t, q);
    // ---- lo que promete ----
    L.push(<Chips key="cl0" t={t} at={T0 + 0.3} items={["STRONGER", "WATERPROOF", "NO CRACKS", "SMOOTHER"]} out={97.1} y={820} />);
    L.push(<Words key="w0" t={t} items={[{ at: R.pourOilR, txt: "IT CHANGES RIGHT IN FRONT OF YOU", col: COL.amber }]} out={107.6} y={860} size={78} />);
    L.push(<Chips key="cl1" t={t} at={107.9} items={["SLIPPERY", "FLOWS BETTER", "DARKER"]} out={110.6} y={200} />);
    L.push(<Words key="w1" t={t} items={[{ at: 112.6, txt: "LIKE A WAXED CAR", col: COL.ice }]} out={113.7} y={860} size={96} />);
    L.push(<Words key="w2" t={t} items={[{ at: R.looks, txt: "SO IT LOOKS LIKE IT WORKED" }]} out={119.2} y={880} size={78} />);
    L.push(<BigNum key="y5" t={t} at={R.year5} text="YEAR 5" x={1380} y={330} size={200} col={COL.ice2} edge="#24506e" out={127.0} sub="FIVE WINTERS LATER" />);
    // ---- qué es ----
    L.push(<Words key="w3" t={t} items={[{ at: 132.4, txt: "IT DOESN'T DRY", col: COL.red }]} out={134.9} y={860} size={110} />);
    L.push(<Words key="w4" t={t} items={[{ at: R.reaction, txt: "A CHEMICAL REACTION", col: COL.amber }]} out={142.6} y={880} size={90} />);
    { const g = sp(PT.grain);
      L.push(<Tag key="tcr" t={t} at={R.crystals} x={g.x} y={g.y} dx={240} dy={-180} text="CRYSTALS" sub="MILLIONS OF THEM" col={COL.ice2} out={146.5} />);
      L.push(<Tag key="tgr" t={t} at={R.grabOn} x={g.x} y={g.y} dx={-240} dy={-160} text="THEY GRAB ON" col={COL.amber} out={157.4} />); }
    L.push(<Words key="w5" t={t} items={[{ at: R.knit, txt: "ONE PIECE OF ROCK", col: COL.amber }]} out={158.4} y={880} size={96} />);
    L.push(<Timer key="tm1" t={t} at={R.harder} out={162.2} secs={28} unit="" label="DAYS · STILL GETTING HARDER" />);
    L.push(<Words key="w6" t={t} items={[{ at: R.stone, txt: "WATER → STONE", col: COL.ice }]} out={166.6} y={200} size={110} />);
    // ---- el aceite ----
    L.push(<Words key="w7" t={t} items={[{ at: R.dontMix, txt: "OIL + WATER DON'T MIX", col: COL.amber }]} out={171.4} y={860} size={90} />);
    { const g = sp(PT.grain);
      L.push(<Tag key="tco" t={t} at={R.coats} x={g.x} y={g.y} dx={240} dy={-170} text="IT COATS EVERYTHING" col={COL.amber} out={178.6} />); }
    L.push(<Words key="w8" t={t} items={[{ at: R.neverReacts, txt: "SOME CEMENT NEVER REACTS", col: COL.red }]} out={190.3} y={880} size={84} />);
    L.push(<Words key="w9" t={t} items={[{ at: R.raincoat, txt: "A RAINCOAT OF OIL", col: COL.amber }]} out={193.9} y={200} size={96} />);
    L.push(<Words key="w10" t={t} items={[{ at: R.gloves, txt: "HOLDING HANDS WITH GLOVES ON" }]} out={196.9} y={880} size={78} />);
    // ---- el aire ----
    L.push(<Stamp key="st0" t={t} at={R.truthR} text="THE PIECE OF TRUTH" x={1380} y={760} out={203.6} rot={-5} size={74} />);
    L.push(<Words key="w11" t={t} items={[{ at: R.airBub, txt: "TINY AIR BUBBLES", col: COL.ice2 }]} out={213.4} y={860} size={100} />);
    L.push(<Words key="w12" t={t} items={[{ at: R.entrain, txt: "AIR ENTRAINMENT", col: COL.amber }]} out={223.2} y={200} size={110} />);
    { const f = sp(PT.face);
      L.push(<Tag key="tch" t={t} at={R.channels} x={f.x} y={f.y} dx={240} dy={-180} text="LITTLE CHANNELS" col={COL.ice} out={231.2} />); }
    L.push(<BigNum key="9p" t={t} at={R.grows9} text="+9%" x={1400} y={360} size={260} col={COL.ice2} edge="#24506e" out={237.8} sub="WATER → ICE" />);
    { const ft = sp(PT.faceTop);
      L.push(<Tag key="tpo" t={t} at={R.pops} x={ft.x} y={ft.y} dx={-240} dy={-160} text="POPS THE SURFACE OFF" col={COL.red} out={242.8} />); }
    L.push(<Words key="w13" t={t} items={[{ at: R.flaking, txt: "THE FLAKING ON OLD STEPS", col: COL.red }]} out={245.6} y={880} size={84} />);
    L.push(<Tag key="trm" t={t} at={250.8} x={960} y={540} dx={240} dy={-200} text="EMPTY ROOMS" sub="THE ICE PUSHES IN HERE" col={COL.ice2} out={256.4} />);
    L.push(<Words key="w14" t={t} items={[{ at: R.moreWinters, txt: "A LOT MORE WINTERS", col: COL.ice }]} out={262.0} y={880} size={96} />);
    // ---- laboratorios ----
    L.push(<Chips key="cl2" t={t} at={R.beirut} items={["BEIRUT · 2003", "MALAYSIA · LATER"]} out={274.0} y={200} />);
    L.push(<BigNum key="fr" t={t} at={R.fraction} text="< 1%" x={1400} y={330} size={220} col={COL.amber} out={279.0} sub="OF THE CEMENT" />);
    L.push(<BigNum key="sl" t={t} at={R.slump} text="+20–40%" x={1380} y={330} size={170} col="#9df0b4" edge="#1f5a36" out={288.4} sub="FLOWS EASIER" />);
    L.push(<BigNum key="wk" t={t} at={R.weaker - 0.6} text="-20%" x={1400} y={360} size={240} col={COL.red} edge="#5a1a14" out={294.7} sub="UP TO A FIFTH WEAKER" />);
    L.push(<Stamp key="trd" t={t} at={R.trade} text="IT'S A TRADE" x={1400} y={760} out={300.6} rot={-6} size={90} />);
    { const d = sp(PT.dose);
      L.push(<Tag key="tts" t={t} at={R.tbsp} x={d.x} y={d.y} dx={-60} dy={-190} text="A FEW TABLESPOONS" sub="WHAT THE LABS TESTED" col={COL.ice2} out={310.6} />);
      L.push(<Tag key="tqt" t={t} at={R.quart} x={d.x + 260} y={d.y - 120} dx={220} dy={-150} text="A WHOLE QUART" sub="THE VIRAL VIDEO" col={COL.red} out={311.9} />); }
    L.push(<Stamp key="mst" t={t} at={R.mistake} text="A MISTAKE" x={1380} y={760} out={320.4} rot={-6} size={100} />);
    // ---- lo que hice ----
    L.push(<BigNum key="3f" t={t} at={R.forms3} text="3 FORMS" x={1380} y={330} size={180} out={328.0} sub="8 INCHES A SIDE" />);
    L.push(<Words key="w15" t={t} items={[{ at: R.split, txt: "ONE BATCH · SPLIT 3 WAYS" }]} out={343.5} y={880} size={80} />);
    { const b = sp(PT.b1);
      L.push(<Tag key="tb1" t={t} at={R.b1} x={b.x} y={b.y} dx={-200} dy={-200} text="#1 PLAIN" sub="LIKE THICK OATMEAL" col={COL.ink} out={343.5} />); }
    L.push(<Words key="w16" t={t} items={[{ at: R.b2, txt: "#2 · THE VIRAL WAY", col: COL.red }]} out={355.0} y={200} size={96} />);
    L.push(<Tag key="tcup" t={t} at={R.cup} x={960} y={540} dx={240} dy={-200} text="ABOUT A CUP" sub="SAME RATE AS THE VIDEO" col={COL.amber} out={361.5} />);
    L.push(<Chips key="cl3" t={t} at={R.soup} items={["LIKE SOUP", "DARK BROWN", "A SMELL", "FOAM"]} out={376.8} y={820} />);
    L.push(<Words key="w17" t={t} items={[{ at: R.smooth - 1.2, txt: "\"LOOK HOW SMOOTH\"" }]} out={381.0} y={200} size={90} />);
    L.push(<Words key="w18" t={t} items={[{ at: R.b3, txt: "#3 · THE RIGHT WAY", col: "#9df0b4" }]} out={386.0} y={200} size={96} />);
    L.push(<Tag key="tadm" t={t} at={R.admix} x={960} y={500} dx={-240} dy={-180} text="AIR-ENTRAINING ADMIXTURE" sub="MASONRY SUPPLY" col={COL.ice2} out={394.6} size={42} />);
    L.push(<Words key="w19" t={t} items={[{ at: R.ounce, txt: "~1 OZ PER BAG · FOLLOW THE BOTTLE", col: COL.ice }]} out={403.0} y={880} size={74} />);
    L.push(<Words key="w20" t={t} items={[{ at: R.covered, txt: "PLASTIC · LEAVE IT ALONE" }]} out={411.5} y={880} size={80} />);
    L.push(<Timer key="tm2" t={t} at={R.days28 - 0.3} out={419.6} secs={28} unit="" label="DAYS" />);
    // ---- prueba 1 ----
    L.push(<StepTitle key="t1" t={t} at={R.test1} n={1} name="LOOK & TOUCH" out={R.test1 + 2.4} />);
    L.push(<Words key="w21" t={t} items={[{ at: R.cantTell, txt: "#1 = #3", col: "#9df0b4" }]} out={428.3} y={200} size={130} />);
    L.push(<Words key="w22" t={t} items={[{ at: R.blotchy, txt: "DARK · BLOTCHY", col: COL.red }, { at: R.greasy, txt: "GREASY", col: COL.amber }]} out={438.0} y={880} size={90} />);
    L.push(<Words key="w23" t={t} items={[{ at: R.sweated, txt: "THE OIL SWEATS BACK OUT", col: COL.amber }]} out={443.0} y={880} size={84} />);
    // ---- prueba 2 ----
    L.push(<StepTitle key="t2" t={t} at={R.test2} n={2} name="WATER" out={R.test2 + 2.4} col={COL.ice} />);
    { const b1 = sp(PT.b1), b2 = sp(PT.b2), b3 = sp(PT.b3);
      L.push(<Tag key="tsk1" t={t} at={452.2} x={b1.x} y={b1.y - 60} dx={-120} dy={-170} text="SOAKS IN" col={COL.ice} out={453.3} size={40} />);
      L.push(<Tag key="tsk3" t={t} at={452.6} x={b3.x} y={b3.y - 60} dx={120} dy={-170} text="SOAKS IN" col={COL.ice} out={453.3} size={40} />);
      L.push(<Tag key="tbd" t={t} at={468.4} x={b2.x} y={b2.y - 60} dx={220} dy={-180} text="BEADS UP" sub="THE ONE THING THE VIDEO GOT RIGHT" col={COL.amber} out={473.5} />); }
    L.push(<Words key="w24" t={t} items={[{ at: R.wax, txt: "WAX ON A CAR · NOT THE CONCRETE", col: COL.ice }]} out={477.3} y={880} size={74} />);
    L.push(<CheckList key="ck1" t={t} title="NOTHING GRABS OIL" rows={[{ at: 485.4, txt: "PAINT" }, { at: 486.2, txt: "SEALER" }, { at: 486.9, txt: "MORTAR · NEW CONCRETE" }]} out={490.0} />);
    // ---- prueba 3 ----
    L.push(<StepTitle key="t3" t={t} at={R.test3} n={3} name="THE KEY" out={R.test3 + 2.4} />);
    L.push(<Words key="w25" t={t} items={[{ at: R.silver, txt: "A SILVER LINE · THAT'S IT", col: "#9df0b4" }]} out={500.4} y={880} size={80} />);
    L.push(<Words key="w26" t={t} items={[{ at: R.dugIn, txt: "IT DUG IN", col: COL.red }]} out={507.0} y={200} size={120} />);
    // ---- prueba 4 ----
    L.push(<StepTitle key="t4" t={t} at={R.test4} n={4} name="THE HAMMER" out={R.test4 + 2.2} />);
    L.push(<Words key="w27" t={t} items={[{ at: R.fourLb, txt: "4 LB · SAME SWING · COUNT THE HITS" }]} out={522.9} y={880} size={72} />);
    { const b1 = sp(PT.b1), b3 = sp(PT.b3);
      L.push(<Tag key="th1" t={t} at={R.beating} x={b1.x} y={b1.y - 40} dx={-160} dy={-190} text="HELD" col="#9df0b4" out={531.2} />);
      L.push(<Tag key="th3" t={t} at={529.6} x={b3.x} y={b3.y - 40} dx={160} dy={-190} text="ABOUT THE SAME" col={COL.ice} out={531.2} size={40} />); }
    L.push(<Stamp key="fh" t={t} at={R.firstHit} text="FIRST GOOD HIT" x={1380} y={240} out={535.8} rot={-6} size={84} />);
    L.push(<Words key="w28" t={t} items={[{ at: R.streaks, txt: "GREASY STREAKS INSIDE", col: COL.amber }, { at: R.pulledOut, txt: "STONES PULLED OUT CLEAN", col: COL.red }]} out={541.3} y={880} size={78} />);
    // ---- prueba 5 ----
    L.push(<StepTitle key="t5" t={t} at={R.test5} n={5} name="THE FREEZER" out={R.test5 + 2.4} col={COL.ice} />);
    L.push(<BigNum key="30x" t={t} at={R.times30} text="30×" x={1400} y={330} size={260} col={COL.ice2} edge="#24506e" out={571.2} sub="FREEZE · THAW" />);
    { const b2 = sp(PT.b2), b3 = sp(PT.b3);
      L.push(<Tag key="tf3" t={t} at={R.airLooks - 0.4} x={b3.x} y={b3.y - 60} dx={160} dy={-190} text="LIKE NEW" col="#9df0b4" out={574.4} />);
      L.push(<Tag key="tf2" t={t} at={572.6} x={b2.x} y={b2.y - 60} dx={-160} dy={-200} text="FLAKING · SANDY" col={COL.red} out={574.4} />); }
    { const b1 = sp(PT.b1), b2 = sp(PT.b2), b3 = sp(PT.b3);
      L.push(<Tag key="sc1" t={t} at={586.4} x={b1.x} y={b1.y - 120} dx={0} dy={-230} text="PLAIN" sub="GOOD" col={COL.ink} out={591.8} size={40} />);
      L.push(<Tag key="sc2" t={t} at={586.8} x={b2.x} y={b2.y - 120} dx={0} dy={-230} text="MOTOR OIL" sub="LOSES" col={COL.red} out={591.8} size={40} />);
      L.push(<Tag key="sc3" t={t} at={587.2} x={b3.x} y={b3.y - 120} dx={0} dy={-230} text="RIGHT AIR" sub="BEST" col="#9df0b4" out={591.8} size={40} />); }
    L.push(<Words key="w29" t={t} items={[{ at: R.canceled, txt: "THE WEAKNESS CANCELED IT OUT", col: COL.red }]} out={591.8} y={880} size={76} />);
    L.push(<Versus key="vs1" t={t} at={596.0} out={602.4} L={{ label: "BUBBLES", val: "GOOD", h: 0.35, col: COL.ice2, mark: "ok" }} R={{ label: "WEAK, GREASY", val: "WINS", h: 0.8, col: COL.red, mark: "x" }} />);
    // ---- no se puede medir ----
    L.push(<Words key="w30" t={t} items={[{ at: R.cantMeasure, txt: "YOU CAN'T MEASURE IT", col: COL.amber }]} out={611.0} y={880} size={90} />);
    L.push(<Chips key="cl4" t={t} at={R.lawnmower} items={["LAWNMOWER", "DIESEL TRUCK", "10,000 MILES"]} out={617.8} y={200} />);
    L.push(<Words key="w31" t={t} items={[{ at: R.noIdea, txt: "NO IDEA HOW MUCH AIR", col: COL.red }]} out={628.4} y={880} size={84} />);
    L.push(<Words key="w32" t={t} items={[{ at: R.tooMuch, txt: "TOO MUCH = TOO LITTLE", col: COL.red }]} out={633.4} y={200} size={100} />);
    L.push(<Words key="w33" t={t} items={[{ at: R.truck, txt: "TESTED ON THE TRUCK", col: COL.ice }]} out={641.0} y={880} size={90} />);
    // ---- Sal ----
    L.push(<Chips key="cl5" t={t} at={647.4} items={["THE 80s", "A SPLASH OF DIESEL", "\"LIKE BUTTER\""]} out={651.9} y={200} />);
    L.push(<Words key="w34" t={t} items={[{ at: R.threeWinters - 6, txt: "3 WINTERS LATER", col: COL.ice }]} out={657.8} y={200} size={100} />);
    L.push(<Versus key="vs2" t={t} at={663.2} out={669.2} L={{ label: "SAL'S PATIO", val: "FLAKING", h: 0.25, col: COL.red, mark: "x" }} R={{ label: "NEXT DOOR", val: "LIKE NEW", h: 0.85, col: "#9df0b4", mark: "ok" }} />);
    L.push(<Chips key="cl6" t={t} at={670.0} items={["SAME WEATHER", "SAME GROUND", "SAME CREW"]} out={676.2} y={790} />);
    L.push(<Words key="w35" t={t} items={[{ at: R.onlyDiff, txt: "ONLY THE WHEELBARROW", col: COL.amber }]} out={680.7} y={880} size={90} />);
    L.push(<Stamp key="tf" t={t} at={R.tore} text="TORN OUT · POURED AGAIN FREE" x={960} y={760} out={685.0} rot={-4} size={72} />);
    L.push(<Words key="w36" t={t} items={[{ at: R.expensive, txt: "THE EXPENSIVE PART", col: COL.red }]} out={690.9} y={200} size={100} />);
    L.push(<Versus key="vs3" t={t} at={698.8} out={706.9} L={{ label: "1 BOTTLE ADMIXTURE", val: "DOZENS OF BAGS", h: 0.85, col: "#9df0b4", mark: "ok" }} R={{ label: "2 QUARTS OF OIL", val: "SAME PRICE", h: 0.3, col: COL.red, mark: "x" }} />);
    // ---- moldes ----
    L.push(<Words key="w37" t={t} items={[{ at: R.onForms, txt: "ON THE FORMS", col: "#9df0b4" }]} out={716.4} y={200} size={120} />);
    L.push(<Words key="w38" t={t} items={[{ at: R.cleanOff, txt: "COMES OFF CLEAN", col: COL.ice }]} out={724.4} y={880} size={90} />);
    { const b2 = sp(PT.b2);
      L.push(<Tag key="tst" t={t} at={R.stains} x={b2.x} y={b2.y} dx={240} dy={-180} text="IT STAINS" sub="AND SOAKS INTO THE GROUND" col={COL.red} out={739.6} />); }
    L.push(<Price key="pr1" t={t} at={R.release} x={560} y={240} item="FORM RELEASE OIL" $={8} out={742.2} />);
    L.push(<Words key="w39" t={t} items={[{ at: R.thinFilm, txt: "A THIN FILM · NOT A PUDDLE", col: COL.amber }]} out={751.0} y={880} size={80} />);
    L.push(<Stamp key="rl" t={t} at={R.actuallyReal} text="THE REAL TRICK ✓" x={1380} y={260} out={756.6} rot={-5} size={80} />);
    // ---- veneno ----
    L.push(<Chips key="cl7" t={t} at={R.metals} items={["METALS", "CHEMICALS"]} out={768.9} y={200} />);
    L.push(<Words key="w40" t={t} items={[{ at: 770.4, txt: "EVERY TIME IT RAINS", col: COL.ice }]} out={775.1} y={880} size={90} />);
    L.push(<BigNum key="1g" t={t} at={R.million - 1.2} text="1 GALLON" x={1400} y={300} size={170} col={COL.red} edge="#5a1a14" out={791.6} sub="CAN FOUL 1,000,000 GALLONS OF WATER" />);
    L.push(<Words key="w41" t={t} items={[{ at: R.law, txt: "AGAINST THE LAW", col: COL.red }]} out={791.7} y={880} size={90} />);
    L.push(<Stamp key="fre" t={t} at={798.6} text="PARTS STORE · FREE" x={1380} y={760} out={802.9} rot={-5} size={74} />);
    // ---- 3 cosas ----
    L.push(<CheckList key="ck2" t={t} title="WHAT IT PROMISED" rows={[{ at: 804.6, txt: "STRONGER" }, { at: 805.6, txt: "DOESN'T CRACK" }, { at: 806.5, txt: "SURVIVES WINTER" }]} out={811.1} />);
    L.push(<StepTitle key="r1" t={t} at={815.7} n={1} name="LESS WATER" out={819.6} col={COL.ice} />);
    L.push(<Words key="w42" t={t} items={[{ at: R.soupNot - 1.4, txt: "OATMEAL ✓", col: "#9df0b4" }, { at: R.soupNot, txt: "SOUP ✗", col: COL.red }]} out={825.3} y={880} size={100} />);
    L.push(<Words key="w43" t={t} items={[{ at: R.slumpsFlat, txt: "SLUMPS FLAT = TOO WET", col: COL.red }]} out={828.6} y={200} size={90} />);
    L.push(<StepTitle key="r2" t={t} at={833.7} n={2} name="CURE IT" out={837.6} col={COL.ice} />);
    L.push(<Timer key="tm3" t={t} at={834.0} out={838.3} secs={7} unit="" label="DAYS · DAMP + COVERED" />);
    L.push(<Words key="w44" t={t} items={[{ at: R.hose - 1.6, txt: "PLASTIC + A GARDEN HOSE", col: COL.amber }]} out={843.4} y={880} size={84} />);
    L.push(<StepTitle key="r3" t={t} at={848.2} n={3} name="THE RIGHT AIR" out={852.4} col={COL.ice} />);
    L.push(<Chips key="cl8" t={t} at={R.followDose - 1.2} items={["ADMIXTURE · FOLLOW THE DOSE", "OUTDOOR BAGGED MIX", "\"AIR-ENTRAINED\" ON THE TRUCK"]} out={861.2} y={780} />);
    L.push(<CheckList key="ck3" t={t} title="THE WHOLE RECIPE" rows={[{ at: 866.6, txt: "LESS WATER" }, { at: 867.6, txt: "A GOOD CURE" }, { at: 868.8, txt: "THE RIGHT AIR" }]} out={871.5} />);
    L.push(<BigNum key="40y" t={t} at={872.0} text="40+ YEARS" x={1340} y={320} size={170} out={876.5} sub="NEVER ONCE POURED OIL IN" />);
    // ---- veredicto ----
    L.push(<Stamp key="hr" t={t} at={R.halfReal} text="HALF REAL" x={960} y={220} out={889.4} rot={-5} size={130} />);
    { const b2 = sp(PT.b2), b3 = sp(PT.b3);
      L.push(<Tag key="vd3" t={t} at={R.fewDrops} x={b3.x} y={b3.y - 60} dx={110} dy={-40} text="A FEW DROPS = AIR" col="#9df0b4" out={889.4} size={34} />);
      L.push(<Tag key="vd2" t={t} at={R.wholeJug - 0.8} x={b2.x} y={b2.y - 60} dx={-200} dy={-170} text="A WHOLE JUG" col={COL.red} out={892.9} />); }
    L.push(<CheckList key="ck4" t={t} title="A WHOLE JUG MAKES IT" rows={[{ at: 894.6, txt: "WEAKER" }, { at: 895.3, txt: "GREASY · UGLY" }, { at: 896.0, txt: "WON'T TAKE PAINT" }, { at: R.poison, txt: "LEAKS POISON" }]} out={902.4} />);
    L.push(<Words key="w45" t={t} items={[{ at: R.dump, txt: "BLOCK #2 → THE DUMP", col: COL.red }]} out={R.dontDo + 0.8} y={200} size={100} />);
    L.push(<Words key="w46" t={t} items={[{ at: R.backJug, txt: "OIL BACK IN THE JUG → PARTS STORE", col: COL.amber }]} out={909.4} y={880} size={70} />);
    // ---- CTA: suscribirse + campanita + una pregunta ----
    L.push(<NextCard key="nx" t={t} at={R.subscribe} subAt={R.bell} out={918.8} title="NEXT: A PITTED, FLAKING DRIVEWAY"><Vid id={HAS.clips.includes("s55") ? "ltx_s55" : "img_s55"} at={R.subscribe} /></NextCard>);
    L.push(<Question key="q" t={t} at={R.comments} out={926.1} />);
    L.push(<Words key="w47" t={t} items={[{ at: R.endLine, txt: "TAKE CARE OF YOUR HOUSE", col: COL.amber }]} out={930.2} y={880} size={80} />);
    return L;
  },
});

// la pregunta para los comentarios (sin guía en este canal)
const Question: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = e(t, at, at + 0.3) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const k = Math.min(1, Math.max(0, (t - at) * 3));
  return (
    <AbsoluteFill style={{ opacity: o, alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.35)" }}>
      <div style={{ transform: `translateY(${(1 - k) * 60}px)`, background: "rgba(20,16,12,.92)", border: `6px solid ${COL.amber}`, borderRadius: 28, padding: "40px 60px", maxWidth: 1400, fontFamily: FONT, textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,.5)" }}>
        <div style={{ fontWeight: 800, fontSize: 40, color: COL.amber, letterSpacing: 4, marginBottom: 18 }}>💬 TELL ME IN THE COMMENTS</div>
        <div style={{ fontWeight: 900, fontSize: 72, color: COL.ink, lineHeight: 1.15, textShadow: extrude(4, "rgba(0,0,0,.6)") }}>Have you ever seen anybody do the oil trick on a real job?</div>
      </div>
    </AbsoluteFill>
  );
};

export const Rest: React.FC = () => <rest.Body />;
