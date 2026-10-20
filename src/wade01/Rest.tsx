// wade01 · DEL 1:12 AL FINAL (72,1 → 567,12 s) con el kit yanqui3d. Una base por frase (toma agnes / sótano 3D / avatar),
// cero cortes secos (cada cambio es latigazo, portal desde el objeto, zoom o empuje) y las piezas en una capa que cruza.
// Todo anclado a la palabra con at("palabra", después_de). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill } from "remotion";
import { makeVideo, Stamp, Price, type Beat, type Tr } from "../kits/yanqui3d/engine";
import { BigNum, COL, DrawX, FONT, Tag, e, extrude, spr, setSlug } from "../kits/yanqui3d/lib";
import { CheckList, JugFill, NextCard, StepTitle, TimeBars, Timer, Toggle, Versus, Words } from "../kits/yanqui3d/pieces";
import { World, Gauge } from "./Min1";
import { PT, screenOf } from "./basement3d";
import CAPS from "./caps.json";
import AVW from "./avwin_k.json";
import AVAIL from "./avail.json";

setSlug("wade01");
export const T0 = 72.1, TEND = 567.12;

// texto grande con extrusión
const Big: React.FC<{ t: number; at: number; out: number; text: string; y?: number; size?: number; col?: string }> = ({ t, at, out, text, y = 150, size = 92, col = COL.ink }) => {
  const o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 8, color: col, textShadow: extrude(9, "rgba(0,0,0,.6)"), transform: `scale(${0.92 + 0.08 * Math.min(1, spr(t, at))})` }}>{text}</div>;
};
type P3 = [number, number, number];
// rótulo anclado a un punto del sótano 3D (sigue a la cámara)
const T3: React.FC<{ t: number; at: number; out: number; pt: P3; text: string; sub?: string; dx?: number; dy?: number; col?: string; size?: number }> = ({ t, pt, ...r }) => {
  if (t < r.at - 0.1 || t > r.out + 0.4) return null;
  const q = screenOf(t, pt);
  return <Tag t={t} x={q.x} y={q.y} {...r} />;
};

export const rest = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: AVAIL, T0, TEND,
  beats: ({ AV, CL }) => {
    const W = (a: number, tr: Tr, p?: [number, number]): Beat => ({ a, tr, p, r: (t) => <World t={t} /> });
    const from3d = (a: number, pt: P3): [number, number] => { const q = screenOf(a, pt); return [q.x, q.y]; };
    return [
      CL(72.1, "s09", "cut"),
      AV(78.99, "whip"),
      W(83.88, "portal"),
      AV(93.89, "whipL"),
      W(99.56, "zoom"),
      CL(104.5, "s10", "portal", from3d(104.5, PT.wallR)),
      CL(110.6, "s11", "push"),
      AV(112.82, "whip"),
      W(118.23, "portal"),
      AV(130.32, "whip"),
      CL(136.63, "s12", "zoom"),
      AV(146.97, "whipL"),
      CL(150.37, "s13", "whip"),
      CL(158.4, "s14", "push"),
      AV(163.07, "whip", { spans: [[163.4, 168.7]] }),
      CL(168.99, "s39", "whip"),
      W(176.9, "portal", [960, 620]),
      AV(180.03, "whip"),
      W(185.01, "portal"),
      CL(189.4, "s15", "zoom"),
      AV(197.27, "whip"),
      CL(201.67, "s16", "whipL"),
      CL(209.6, "s17", "push"),
      AV(215.01, "whip", { spans: [[215.01, 218.3]] }),
      W(218.48, "portal"),
      CL(226.2, "s18", "portal", from3d(226.2, PT.bucketTop)),
      AV(229.68, "whip"),
      W(233.06, "portal"),
      CL(238.7, "s19", "portal", from3d(238.7, PT.bucketTop)),
      AV(246.32, "whip"),
      W(250.45, "portal"),
      AV(262.58, "whip"),
      CL(267.42, "s20", "whipL"),
      W(271.2, "zoom"),
      AV(277.03, "whip"),
      CL(280.78, "s21", "whipL"),
      W(291.7, "portal", [960, 600]),
      AV(293.95, "whip", { spans: [[294.9, 299.3]] }),
      W(299.43, "portal"),
      CL(307.2, "s22", "portal", from3d(307.2, PT.corner)),
      AV(311.2, "whip"),
      W(315.84, "portal"),
      CL(320.05, "s23", "whip"),
      AV(326.91, "whip"),
      CL(331.68, "s42", "whipL"),
      CL(338.2, "s40", "push"),
      AV(344.85, "whip"),
      W(349.14, "portal"),
      CL(354.6, "s24", "portal", from3d(354.6, PT.hygro)),
      AV(359.65, "whip"),
      W(365.04, "portal"),
      CL(369.6, "s25", "portal", from3d(369.6, PT.pellets)),
      W(372.45, "zoom"),
      AV(378.95, "whip"),
      CL(383.91, "s26", "whipL"),
      CL(386.2, "s07", "push"),
      AV(394.39, "whip"),
      CL(399.3, "s36", "whipL"),
      CL(403.3, "s28", "push"),
      AV(408.92, "whip"),
      CL(412.17, "s43", "whipL"),
      CL(416.4, "s29", "push"),
      AV(425.44, "whip"),
      CL(431.59, "s37", "whipL"),
      W(438.4, "portal", [1100, 700]),
      AV(444.16, "whip"),
      CL(449.28, "s30", "whipL"),
      AV(461.03, "whip", { spans: [[461.7, 466.6]] }),
      W(466.74, "portal"),
      CL(472.0, "s31", "portal", from3d(472.0, PT.foil)),
      AV(477.55, "whip"),
      CL(481.24, "s38", "whipL"),
      W(486.0, "zoom"),
      CL(489.5, "s32", "portal", from3d(489.5, PT.gutter)),
      AV(492.0, "whip"),
      W(495.84, "portal"),
      CL(499.1, "s33", "portal", from3d(499.1, PT.spoutOut)),
      CL(504.9, "s34", "push"),
      AV(507.89, "whip"),
      CL(511.2, "s35", "whipL"),
      W(519.5, "zoom"),
      AV(523.15, "whip", { spans: [[523.3, 527.0]] }),
      W(527.05, "portal"),
      AV(536.91, "whip", { spans: [[536.95, 540.4]] }),
      W(540.55, "portal"),
      CL(547.1, "s06", "whipL"),
      AV(553.19, "whip", { spans: [[553.4, 558.9]] }),
      CL(559.02, "s41", "whipL"),
    ];
  },
  pieces: (t, { at: at0 }) => {
    // at seguro: si la palabra no aparece, el respaldo (nunca rompe el render)
    const at = (w: string, after: number, fb?: number) => { try { return at0(w, after); } catch { return fb ?? after; } };
    if (t < T0) return [];
    const L: React.ReactNode[] = [];
    const add = (a: number, b: number, n: React.ReactNode) => { if (t > a - 0.5 && t < b + 0.6) L.push(n); };

    // 72-84 · el agua es lo que arruina una casa
    add(74, 78.6, <BigNum key="n1" t={t} at={at("number", 74)} text="#1" x={1500} y={330} size={240} col={COL.ice2} edge="#1d4a6e" out={78.4} sub="HOUSE KILLER: WATER" />);
    add(78, 81.3, <Words key="nf" t={t} items={[{ at: at("fire", 77.5), txt: "NOT FIRE", col: COL.amber }, { at: at("termites", 78.5), txt: "NOT TERMITES", col: COL.amber }, { at: at("water", 79.5), txt: "WATER", col: COL.ice }]} out={81.2} y={830} size={96} />);
    add(81.3, 83.8, <Words key="sq" t={t} items={[{ at: at("slow", 81), txt: "SLOW" }, { at: at("quiet", 81.5), txt: "QUIET" }, { at: at("every", 82), txt: "EVERY DAY", col: COL.ice }]} out={83.6} y={830} size={96} />);
    // 84-94 · el sótano en la tierra: tierra fría y mojada → paredes frías
    add(85, 93.8, <Big key="und" t={t} at={at("understand", 84)} out={87.4} text="WHAT'S GOING ON" y={110} />);
    add(88, 93.8, <T3 key="soil" t={t} at={at("cool", 90)} out={93.7} pt={PT.soil} text="COOL + WET DIRT" sub="MOST OF THE YEAR" col={COL.ice} dx={-80} dy={-260} />);
    add(93, 93.9, <T3 key="wc" t={t} at={at("walls", 93)} out={93.85} pt={PT.wallFoot} text="COOL WALLS" col={COL.ice2} dx={-300} dy={-160} />);
    // 96-110 · aire tibio que entra y transpira
    add(97, 104.4, <T3 key="win" t={t} at={at("windows", 97)} out={104.3} pt={PT.window} text="WINDOWS" col={COL.amber} dx={-60} dy={-150} size={42} />);
    add(98, 104.4, <T3 key="ven" t={t} at={at("dryer", 98)} out={104.3} pt={PT.vent} text="DRYER VENT" col={COL.amber} dx={160} dy={-140} size={42} />);
    add(100, 104.4, <T3 key="dor" t={t} at={at("cracks", 100)} out={104.3} pt={PT.door} text="DOOR CRACKS" col={COL.amber} dx={200} dy={120} size={42} />);
    add(103, 104.5, <T3 key="cw" t={t} at={at("cool", 103)} out={104.4} pt={PT.wallR} text="WARM AIR + COOL WALL" col={COL.ice} dx={-380} dy={-160} size={42} />);
    add(109, 110.6, <Big key="sw" t={t} at={at("sweats", 109)} out={110.5} text="IT SWEATS" y={800} size={120} col={COL.ice2} />);
    add(111, 112.8, <Big key="oa" t={t} at={at("comes", 110.5)} out={112.7} text="WATER · OUT OF THE AIR" y={800} size={80} col={COL.ice} />);
    add(116, 118.2, <Stamp key="hs" t={t} at={at("sponge", 116)} text="HARD SPONGE" x={1450} y={330} out={118.0} rot={6} size={84} />);
    // 118-130 · capilaridad, 70-80 %, moho
    add(118, 122.5, <T3 key="wk" t={t} at={at("wicks", 118.4)} out={122.4} pt={PT.wallFoot} text="WICKS UP" sub="FROM THE GROUND" col={COL.ice} dx={-360} dy={-200} />);
    add(123, 127.3, <Gauge key="g1" t={t} at={at("70", 123)} out={127.2} from={55} to={78} x={480} y={330} />);
    add(127, 130.2, <T3 key="md" t={t} at={at("mold", 127)} out={130.1} pt={PT.corner} text="MOLD" sub="LOVES ANYTHING > 60%" col="#9fe08a" dx={-380} dy={-160} />);
    add(133, 136.6, <BigNum key="tg" t={t} at={at("30", 133)} text="30–50%" x={1460} y={360} size={170} col="#9df0b4" edge="#1f5a36" out={136.4} sub="THE TARGET" />);
    add(139, 141.3, <Price key="hy" t={t} at={at("10", 139)} x={1500} y={200} item="HYGROMETER" $={10} out={141.2} />);
    add(144, 146.9, <Words key="hn" t={t} items={[{ at: at("65", 144), txt: "65%", col: COL.red }, { at: at("70", 145), txt: "70%", col: COL.red }, { at: at("80", 145.5), txt: "80%", col: COL.red }]} out={146.8} y={860} size={110} />);
    add(149, 150.4, <Big key="tr" t={t} at={at("trick", 149.5)} out={150.3} text="THE TRICK" y={800} size={120} col={COL.amber} />);
    // 150-163 · cloruro de calcio = el que se vende para derretir hielo
    add(151, 158.3, <Big key="cc" t={t} at={at("calcium", 151)} out={158.2} text="CALCIUM CHLORIDE" y={110} size={84} col={COL.ice2} />);
    add(156, 163, <Tag key="im" t={t} at={at("ice", 156)} x={900} y={600} dx={-260} dy={180} text="WINTER ICE MELT" sub="PELLETS OR FLAKES" col={COL.ice} out={162.9} />);
    add(163, 171.3, <CheckList key="bag" t={t} title="READ THE BAG" rows={[{ at: at("calcium", 163.6), txt: "CALCIUM CHLORIDE" }, { at: at("rock", 165), txt: "NOT ROCK SALT" }, { at: at("sodium", 166.5), txt: "NOT SODIUM CHLORIDE" }, { at: at("pet", 168.5), txt: "NOT PET-FRIENDLY" }]} out={171.2} />);
    add(172, 176.8, <BigNum key="pr" t={t} at={at("15", 172.5)} text="$15–20" x={1460} y={330} size={170} col="#ffe7a3" edge="#6e5a1d" out={175.4} sub="20 LB BAG" />);
    add(176, 176.9, <Big key="ss" t={t} at={at("season", 176)} out={176.8} text="LASTS A WHOLE SEASON" y={820} size={74} />);
    add(178, 180, <Big key="sp" t={t} at={at("special", 178)} out={179.9} text="WHAT MAKES IT SPECIAL" y={120} size={78} col={COL.amber} />);
    add(181, 185, <Stamp key="th" t={t} at={at("thirsty", 181)} text="THIRSTY" x={1460} y={300} out={184.8} rot={-7} size={110} />);
    add(185, 189.3, <T3 key="pa" t={t} at={at("pulls", 185)} out={188.0} pt={PT.pellets} text="PULLS WATER" sub="STRAIGHT OUT OF THE AIR" col={COL.ice} dx={-420} dy={-220} />);
    add(188, 189.4, <T3 key="lq" t={t} at={at("liquid", 188.5)} out={189.3} pt={PT.pellets} text="→ LIQUID" col={COL.ice2} dx={360} dy={180} size={60} />);
    add(193, 196, <Big key="dq" t={t} at={at("diliquescent", 193)} out={195.9} text="DELIQUESCENT" y={110} size={100} col={COL.ice2} />);
    add(195, 197.2, <Stamp key="hg" t={t} at={at("hungry", 195.5)} text="HUNGRY SALT" x={960} y={820} out={197.1} rot={-5} size={110} />);
    add(201, 209.5, <Price key="tb" t={t} at={at("10", 201.5)} x={1480} y={170} item="EACH · STORE TUB" $={10} out={205.2} />);
    add(204, 206.4, <Big key="fm" t={t} at={at("month", 204.5)} out={206.4} text="FULL IN A MONTH" y={830} size={84} col={COL.red} />);
    add(206, 209.5, <Big key="bb" t={t} at={at("big", 207)} out={209.5} text="BUILD A BIG ONE" y={830} size={84} col="#9df0b4" />);
    // 209-220 · lo que hace falta
    add(210, 220.3, <CheckList key="ne" t={t} title="YOU NEED" rows={[{ at: at("two", 210.5), txt: "2 × 5-GAL BUCKETS" }, { at: at("drill", 212.5), txt: "DRILL + 1/4\" BIT" }, { at: at("screen", 215), txt: "SCREEN OR OLD T-SHIRT" }, { at: at("bag", 217.5), txt: "CALCIUM CHLORIDE" }]} out={220.2} />);
    // pasos
    add(220, 223.6, <StepTitle key="s1" t={t} at={at("step", 220)} n={1} name="THE TOP BUCKET" out={223.5} />);
    add(225, 226.2, <T3 key="ud" t={t} at={at("upside", 225)} out={226.1} pt={PT.bucketTop} text="UPSIDE DOWN" col={COL.amber} dx={-340} dy={-160} />);
    add(229, 232.4, <BigNum key="ho" t={t} at={at("20", 229.5)} text="20–30 HOLES" x={960} y={830} size={120} col={COL.ink} edge="#333" out={232.3} sub="1/4 INCH EACH" />);
    add(233, 235.4, <Big key="st" t={t} at={at("strainer", 233)} out={235.3} text="A STRAINER" y={110} size={96} col={COL.amber} />);
    add(235, 237.4, <DrawX key="dx" t={t} at={at("sides", 235.4)} x={1180} y={360} w={260} h={300} />);
    add(235, 237.4, <Big key="bo" t={t} at={at("bottom", 236.5)} out={237.3} text="BOTTOM ONLY" y={880} size={80} col="#9df0b4" />);
    add(237, 240.6, <StepTitle key="s2" t={t} at={at("step", 237.3)} n={2} name="SCREEN OR T-SHIRT" out={240.5} />);
    add(245, 246.3, <Words key="pd" t={t} items={[{ at: at("pellets", 245), txt: "PELLETS STAY", col: COL.ink }, { at: at("drip", 247, 245.8), txt: "WATER DRIPS", col: COL.ice }]} out={248.9} y={860} size={80} />);
    add(248, 250.4, <StepTitle key="s3" t={t} at={at("step", 248)} n={3} name="NEST THE BUCKETS" out={250.3} />);
    add(255, 259.2, <Big key="nd" t={t} at={at("nest", 256)} out={259.1} text="THEY NEST TOO DEEP" y={110} size={84} col={COL.red} />);
    add(260, 262.5, <T3 key="ow" t={t} at={at("own", 260.5)} out={262.4} pt={PT.bucketLow} text="SITS IN ITS OWN WATER" col={COL.red} dx={-420} dy={-150} />);
    add(263, 267.3, <Words key="cn" t={t} items={[{ at: at("soup", 263.5), txt: "SOUP CANS", col: COL.ink }, { at: at("scraps", 265.5), txt: "OR 2×4 SCRAPS", col: COL.amber }]} out={267.3} y={860} size={84} />);
    add(273, 277, <BigNum key="6i" t={t} at={at("6", 273.5)} text={'6"'} x={1500} y={330} size={230} col={COL.amber} edge="#6e4a1d" out={276.8} sub="OF SPACE TO CATCH WATER" />);
    add(277, 280.7, <StepTitle key="s4" t={t} at={at("step", 277.3)} n={4} name="CALCIUM CHLORIDE" out={280.6} />);
    add(281, 285.6, <Words key="5l" t={t} items={[{ at: at("5", 281), txt: "5 LBS", col: COL.ink }, { at: at("third", 283.5), txt: "≈ 1/3 BUCKET", col: COL.ice2 }]} out={285.5} y={860} size={90} />);
    add(285, 291.6, <Words key="fl" t={t} items={[{ at: at("spread", 285.3), txt: "SPREAD FLAT", col: "#9df0b4" }, { at: at("pack", 286.8), txt: "DON'T PACK IT", col: COL.red }]} out={291.5} y={860} size={90} />);
    add(291, 293.9, <StepTitle key="s5" t={t} at={at("step", 291.5)} n={5} name="LID OFF" out={293.8} />);
    add(295, 299.4, <Words key="no" t={t} items={[{ at: at("cord", 295.5), txt: "NO CORD" }, { at: at("switch", 296.5), txt: "NO SWITCH" }, { at: at("filter", 297.4), txt: "NO FILTER" }, { at: at("noise", 298.5), txt: "NO NOISE", col: "#9df0b4" }]} out={299.3} y={540} size={96} />);
    // dónde ponerlo
    add(300, 307.2, <Big key="wh" t={t} at={at("where", 299.8)} out={303.8} text="WHERE MATTERS" y={110} size={90} col={COL.amber} />);
    add(304, 307.2, <Big key="lc" t={t} at={at("low", 305)} out={307.1} text="LOW, STILL CORNERS" y={110} size={84} col={COL.ice2} />);
    add(309, 311.2, <Tag key="dc" t={t} at={at("dampest", 309.5)} x={960} y={700} dx={-300} dy={-260} text="THE DAMPEST CORNER" sub="THE ONE THAT SMELLS WORST" col={COL.amber} out={311.1} />);
    add(313, 315.7, <Big key="ft" t={t} at={at("foot", 313.8)} out={315.6} text="1 FOOT OFF THE WALL" y={820} size={84} col={COL.amber} />);
    add(316, 320, <T3 key="ft3" t={t} at={316} out={317.5} pt={PT.scale} text="1 FT" col="#ffd166" dx={200} dy={-120} size={60} />);
    add(318, 323.2, <Big key="pc" t={t} at={at("two", 319.5)} out={323.1} text="2–3 BUCKETS · ONE PER CORNER" y={110} size={70} />);
    add(324, 326.9, <Stamp key="kd" t={t} at={at("kids", 324.5)} text="KIDS & DOG: AWAY" x={1300} y={820} out={326.8} rot={-5} size={74} />);
    add(330, 333, <Stamp key="br" t={t} at={at("brine", 330.5)} text="BRINE" x={1450} y={300} out={332.9} rot={7} size={120} />);
    add(333, 338.1, <Words key="mt" t={t} items={[{ at: at("sting", 333), txt: "STINGS A CUT", col: COL.amber }, { at: at("metal", 335), txt: "EATS METAL", col: COL.red }]} out={338.0} y={860} size={84} />);
    add(337, 344.7, <CheckList key="kp" t={t} title="KEEP IT" rows={[{ at: at("wood", 337.5), txt: "OFF WOOD FLOORS" }, { at: at("heater", 339), txt: "AWAY FROM WATER HEATER" }, { at: at("tools", 340), txt: "AWAY FROM TOOLS" }, { at: at("gloves", 341.8), txt: "WEAR GLOVES" }]} out={344.6} />);
    // la prueba
    add(345, 349.1, <Big key="kx" t={t} at={at("knoxville", 347.5)} out={349.0} text="KNOXVILLE, TN" y={830} size={90} col={COL.amber} />);
    add(352, 354.6, <T3 key="74" t={t} at={at("74", 353)} out={354.5} pt={PT.hygro} text="74%" sub="BEFORE" col={COL.red} dx={-260} dy={-140} size={70} />);
    add(356, 359.6, <Tag key="we" t={t} at={at("weighed", 355.6)} x={1000} y={700} dx={-300} dy={-280} text="WEIGH THE EMPTY BUCKET" sub="SUBTRACT IT LATER" col={COL.ice2} out={359.5} />);
    add(360, 363.7, <BigNum key="7d" t={t} at={at("seven", 361)} text="7 DAYS" x={1460} y={330} size={170} col={COL.ink} edge="#333" out={363.6} sub="WALKED AWAY" />);
    // time-lapse: rótulos de día
    const days: [string, number][] = [["DAY 1", at("day", 363.5, 363.8)], ["DAY 2", at("day", 369.5, 370.5)], ["DAY 3", at("day", 372.5, 373.6)], ["DAY 7", at("seven", 377, 377.6)]];
    days.forEach(([d, a], i) => add(a, (days[i + 1]?.[1] ?? 380) - 0.1, <BigNum key={"dy" + i} t={t} at={a} text={d} x={360} y={200} size={120} out={(days[i + 1]?.[1] ?? 380.0) - 0.15} />));
    add(366, 369.5, <T3 key="ws" t={t} at={at("wet", 366)} out={369.4} pt={PT.pellets} text="WET & SHINY" col={COL.ice2} dx={-380} dy={-180} />);
    add(371, 372.4, <Big key="cl" t={t} at={at("clump", 371)} out={372.4} text="CLUMPING" y={820} size={96} col={COL.ice2} />);
    add(374, 378.9, <T3 key="pu" t={t} at={at("puddle", 374)} out={378.8} pt={PT.bucketLow} text="A PUDDLE" sub="IN THE BOTTOM BUCKET" col={COL.ice} dx={-400} dy={-120} />);
    add(379, 383.8, <Gauge key="g2" t={t} at={at("hygrometer", 379)} out={383.7} from={74} to={52} x={1500} y={330} />);
    add(386, 389.3, <BigNum key="w3" t={t} at={at("three", 386.5)} text="3 LB 6 OZ" x={960} y={250} size={190} col={COL.ice2} edge="#1d4a6e" out={389.2} sub="OF WATER" />);
    add(389, 390.6, <Big key="oa2" t={t} at={at("out", 389)} out={390.5} text="OUT OF THE AIR" y={160} size={100} col={COL.ice} />);
    add(390, 394.3, <JugFill key="jg" t={t} at={at("half", 390.8)} out={394.2} x={1480} y={540} />);
    add(391, 394.3, <Big key="hg2" t={t} at={at("half", 390.8)} out={394.2} text="≈ ½ GALLON" y={160} size={100} col={COL.ice2} />);
    add(393, 397.4, <Words key="wk2" t={t} items={[{ at: at("week", 392.5), txt: "1 WEEK" }, { at: at("bucket", 393.8), txt: "1 BUCKET" }, { at: at("power", 395.5), txt: "NO POWER", col: "#9df0b4" }]} out={397.3} y={860} size={84} />);
    add(401, 403.3, <Big key="bre" t={t} at={at("breathe", 401.5)} out={403.2} text="YOU COULD BREATHE" y={820} size={84} col="#9df0b4" />);
    add(405, 412, <CheckList key="dr" t={t} title="THE BRINE" rows={[{ at: at("utility", 405.5), txt: "UTILITY SINK / FLOOR DRAIN" }, { at: at("rinse", 408.5), txt: "RINSE WITH FRESH WATER" }]} out={411.9} />);
    add(412, 416.3, <Stamp key="ny" t={t} at={at("yard", 412.5)} text="NOT ON THE LAWN" x={1260} y={300} out={416.2} rot={-6} size={84} />);
    add(417, 425.3, <Tag key="to" t={t} at={at("top", 417)} x={960} y={620} dx={-320} dy={-300} text="TOP OFF THE PELLETS" col={COL.ice2} out={420.9} />);
    add(421, 431.4, <TimeBars key="tbs" t={t} rows={[{ at: at("july", 421.5), label: "JULY", val: "EVERY 2–3 WEEKS", frac: 0.35, col: COL.amber }, { at: at("fall", 425.4), label: "FALL", val: "ONCE A MONTH", frac: 0.8, col: COL.ice }]} out={431.3} />);
    // honesto: no arregla una filtración → prueba del papel aluminio
    add(435, 438.4, <Words key="gd" t={t} items={[{ at: at("great", 435.5), txt: "DAMP AIR ✓", col: "#9df0b4" }]} out={438.3} y={860} size={90} />);
    add(438, 441.1, <Stamp key="nl" t={t} at={at("leak", 439.8)} text="NOT A LEAK FIX" x={960} y={180} out={441.0} rot={-5} size={100} />);
    add(442, 444.1, <T3 key="sc" t={t} at={at("folks", 441.5)} out={444.0} pt={PT.wallFoot} text="STILL COMING" sub="THROUGH THE WALL" col={COL.ice} dx={-440} dy={-200} />);
    add(447, 449.3, <Big key="ft2" t={t} at={at("difference", 447.5)} out={449.2} text="THE FOIL TEST" y={820} size={110} col={COL.ice2} />);
    add(450, 458, <Words key="fo" t={t} items={[{ at: at("square", 450.5), txt: "1 FT × 1 FT" }, { at: at("four", 455.5), txt: "TAPE ALL 4 SIDES", col: COL.amber }]} out={457.9} y={860} size={80} />);
    add(458, 461, <Timer key="tm" t={t} at={at("two", 458.3)} out={460.9} secs={2} label="LEAVE IT 2 DAYS" />);
    add(461.5, 477.4, <Toggle key="tg2" t={t} at={at("outside", 462.5)} flipAt={at("back", 469.8)} out={477.3} a={["ROOM SIDE", "= THE AIR"]} b={["BACK SIDE", "= THE DIRT"]} x={1500} />);
    add(466, 472, <T3 key="fz" t={t} at={466.9} out={471.8} pt={PT.foil} text="FOIL" col={COL.ink} dx={-240} dy={-150} size={44} />);
    add(475, 477.5, <T3 key="dt" t={t} at={at("dirt", 475.5)} out={477.4} pt={PT.foil} text="FROM THE DIRT" col={COL.ice} dx={-320} dy={160} />);
    add(478, 481.2, <Stamp key="nb" t={t} at={at("world", 478.8)} text="NO BUCKET CAN KEEP UP" x={960} y={830} out={481.1} rot={-4} size={76} />);
    // canaletas, caño, pendiente
    add(483, 486, <Big key="lu" t={t} at={at("up", 483.8)} out={485.9} text="LOOK UP FIRST" y={120} size={100} col={COL.amber} />);
    add(486, 489.4, <BigNum key="90" t={t} at={at("90", 486)} text="90%" x={460} y={330} size={210} col={COL.ice2} edge="#1d4a6e" out={489.3} sub="START AT THE GUTTERS" />);
    add(488.6, 489.5, <T3 key="gt" t={t} at={488.8} out={489.4} pt={PT.gutter} text="OVERFLOW" col={COL.ice} dx={-300} dy={-80} size={44} />);
    add(490, 492, <Big key="cg" t={t} at={at("clogged", 490.5)} out={491.9} text="RIGHT AGAINST THE FOUNDATION" y={830} size={66} col={COL.red} />);
    add(495.5, 499.1, <T3 key="ds" t={t} at={at("empties", 495.8, 496)} out={499.0} pt={PT.spoutOut} text="DUMPS AT THE WALL" col={COL.red} dx={-420} dy={170} />);
    add(499.5, 504.8, <BigNum key="46" t={t} at={at("4", 502.5, 503)} text="4–6 FT" x={1460} y={300} size={180} col="#9df0b4" edge="#1f5a36" out={504.8} sub="AWAY FROM THE HOUSE" />);
    add(505, 507.8, <Price key="ex" t={t} at={at("10", 505.3, 506)} x={1460} y={180} item="EXTENSION" $={10} out={507.7} />);
    add(508, 511.1, <Words key="sl" t={t} items={[{ at: at("slope", 508.5), txt: "SLOPE AWAY ✓", col: "#9df0b4" }, { at: at("toward", 510, 510.3), txt: "NOT TOWARD ✗", col: COL.red }]} out={511.0} y={860} size={80} />);
    add(511, 519.4, <Words key="cs" t={t} items={[{ at: at("standing", 511.8), txt: "STANDING WATER", col: COL.red }, { at: at("crack", 516), txt: "WIDENING CRACK", col: COL.red }]} out={519.3} y={180} size={80} />);
    add(517, 519.4, <Stamp key="cs2" t={t} at={at("call", 517.8)} text="CALL SOMEBODY" x={960} y={820} out={519.3} rot={-5} size={100} />);
    // resumen y cierre
    add(519.5, 523, <Big key="at" t={t} at={at("together", 519.8)} out={522.9} text="ALL TOGETHER" y={110} size={100} />);
    add(521, 527, <Words key="r1" t={t} items={[{ at: at("musty", 522), txt: "MUSTY", col: "#b9d39a" }, { at: at("60", 524.5), txt: "+ OVER 60%", col: COL.red }, { at: at("build", 525.5), txt: "→ BUCKET", col: "#9df0b4" }]} out={526.9} y={540} size={96} />);
    add(527, 536.8, <CheckList key="lk" t={t} title="IF IT'S A LEAK" rows={[{ at: at("foil", 527.3), txt: "1 · FOIL TEST" }, { at: at("gutters", 531), txt: "2 · GUTTERS + DOWNSPOUTS" }, { at: at("then", 532.5), txt: "3 · THEN THE BUCKET" }]} out={536.7} />);
    add(535, 540.5, <Versus key="vs" t={t} at={at("20", 535)} out={540.4} L={{ label: "THE BUCKET", val: "$20", h: 0.12, col: "#5ee38f", mark: "ok" }} R={{ label: "DEHUMIDIFIER", val: "$300", h: 1, col: COL.red, mark: "x" }} />);
    add(541, 545.6, <BigNum key="20y" t={t} at={at("20", 541.5)} text="20 YEARS" x={1420} y={300} size={170} col={COL.amber} edge="#6e4a1d" out={545.5} sub="TO ROT A SILL PLATE" />);
    add(542, 547, <T3 key="sil" t={t} at={542.5} out={546.9} pt={PT.sill} text="SILL PLATE" col={COL.amber} dx={-320} dy={-150} />);
    add(545.5, 547.1, <Big key="ns" t={t} at={at("sound", 545.8)} out={547.0} text="NEVER A SOUND" y={830} size={90} col={COL.ink} />);
    add(548, 553.1, <Words key="we2" t={t} items={[{ at: at("weekend", 548.5), txt: "THIS WEEKEND", col: COL.amber }, { at: at("corner", 550), txt: "SMELL THAT CORNER" }, { at: at("bucket", 551.5), txt: "BUILD A BUCKET", col: "#9df0b4" }]} out={553.0} y={860} size={70} />);
    add(553, 559, <NextCard key="nx" t={t} at={at("next", 552.8)} subAt={at("$3", 554)} out={558.9} title="WATER RISING UP THE WALL"><div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, #33465a, #0b1018)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 130, color: "#ffe7a3", textShadow: extrude(10, "rgba(0,0,0,.7)") }}>THE $3 FIX</div></NextCard>);
    add(559, 567, <Stamp key="np" t={t} at={at("paint", 563.5)} text="NEVER PAINT OVER IT" x={960} y={830} out={566.5} rot={-4} size={84} />);
    return L;
  },
});
export const Rest: React.FC = () => <AbsoluteFill><rest.Body /></AbsoluteFill>;
export const FULL_FRAMES = rest.FRAMES;
