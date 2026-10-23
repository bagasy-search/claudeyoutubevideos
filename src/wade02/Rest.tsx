// wade02 · DEL 1:10 AL FINAL (70,5 → 938,55 s) con el kit yanqui3d. Una base por frase (toma agnes / pared 3D / avatar) según plan.json,
// cero cortes secos (cada cambio es latigazo, portal, zoom o empuje) y las piezas en una capa que cruza.
// Todo anclado a la palabra con at("palabra", después_de). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill } from "remotion";
import { makeVideo, Stamp, Price, type Beat, type Tr } from "../kits/yanqui3d/engine";
import { BigNum, Chips, COL, FONT, LowerThird, Receipt, Tag, e, extrude, spr, setSlug } from "../kits/yanqui3d/lib";
import { CheckList, Mistake, NextCard, StepTitle, Timer, Toggle, Versus, Words } from "../kits/yanqui3d/pieces";
import { World, Big, T3 } from "./Min1";
import { PT, screenOf } from "./wall3d";
import CAPS from "./caps.json";
import AVW from "./avwin_k.json";
import AVAIL from "./avail.json";
import PLAN from "./plan.json";

setSlug("wade02");
export const T0 = 70.5, TEND = 938.55;
const HAS = AVAIL as { clips: string[]; imgs: string[] };
// tomas LTX que todavía no llegaron → la foto del primer cuadro
const FALL: Record<string, string> = { s64: "s01", s65: "s26", s66: "s36", s67: "s54" };
const kOf = (k: string) => (HAS.clips.includes(k) || HAS.imgs.includes(k) ? k : FALL[k] ?? k);
type P3 = [number, number, number];
const GREEN = "#9df0b4";

// avatar desenfocado mientras hay una pieza pesada encima
const SPANS: Record<number, [number, number][]> = {
  252.4: [[255.0, 264.0]], 321.9: [[321.9, 327.6]], 339.3: [[339.3, 344.9]], 468.1: [[468.1, 471.6]], 627.1: [[628.5, 633.4]],
  699.2: [[702.5, 707.8]], 764.4: [[764.4, 768.8]], 796.4: [[796.4, 800.8]], 813.3: [[815.5, 817.9]], 829.3: [[829.6, 833.2]],
  864.6: [[866.5, 870.1]], 879.2: [[879.2, 884.5]], 913.4: [[915.3, 918.0]], 931.0: [[931.0, 936.4]],
};
// portales a la pared 3D desde un punto (si no, el lado libre junto al avatar)
const W_PORTAL: Record<number, P3> = { 141.7: PT.cut, 158.6: PT.cut, 194.5: PT.cutIn, 264.2: PT.side, 327.9: PT.foilLo, 523.2: PT.gutter, 606.9: PT.mulch, 709.5: PT.cut, 902.9: PT.cut };

// SUSCRIBITE + campanita (sin links en pantalla)
const SubBell: React.FC<{ t: number; at: number; bellAt: number; out: number }> = ({ t, at, bellAt, out }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const k = Math.min(1.05, spr(t, at)), press = e(t, at + 0.7, at + 0.85) * (1 - e(t, at + 0.95, at + 1.1));
  const subbed = t > at + 0.9, ring = t > bellAt ? Math.sin((t - bellAt) * 28) * 22 * Math.max(0, 1 - (t - bellAt) / 1.4) : 0;
  return (
    <div style={{ position: "absolute", left: 960, top: 800, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, display: "flex", alignItems: "center", gap: 34 }}>
      <div style={{ padding: "26px 60px", borderRadius: 20, background: subbed ? "#3a3f46" : "#e0261b", transform: `scale(${1 - press * 0.08})`, fontFamily: FONT, fontWeight: 900, fontSize: 64, letterSpacing: 4, color: "#fff", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>{subbed ? "SUBSCRIBED" : "SUBSCRIBE"}</div>
      <div style={{ opacity: e(t, bellAt - 0.2, bellAt), transform: `rotate(${ring}deg)`, transformOrigin: "50% 10%", width: 120, height: 120, borderRadius: 60, background: "rgba(14,22,36,.92)", boxShadow: `0 20px 40px rgba(0,0,0,.6), 0 0 0 3px ${COL.amber}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={70} height={70} viewBox="0 0 24 24"><path d="M12 22a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 0 0-5.5-6.8V3a1.5 1.5 0 0 0-3 0v1.2A7 7 0 0 0 5 11v5l-2 2v1h18v-1z" fill={COL.amber} /></svg>
      </div>
    </div>
  );
};
// la pregunta para comentar
const Ask: React.FC<{ t: number; at: number; chipsAt: number; out: number }> = ({ t, at, chipsAt, out }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <>
      <div style={{ position: "absolute", left: 960, top: 300, opacity: o, transform: `translate(-50%,-50%) perspective(1400px) rotateX(${(1 - Math.min(1, spr(t, at))) * 50}deg)`, padding: "30px 56px", borderRadius: 26, background: "linear-gradient(180deg, rgba(20,32,52,.95), rgba(10,16,28,.95))", boxShadow: `0 40px 80px rgba(0,0,0,.7), 0 0 0 3px ${COL.ice}66`, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 6, color: COL.ice }}>TELL ME IN THE COMMENTS</div>
        <div style={{ fontWeight: 900, fontSize: 70, letterSpacing: 2, color: COL.ink, textShadow: extrude(6, "#000"), marginTop: 6 }}>HOW HIGH DOES YOUR WHITE LINE GO?</div>
      </div>
      <Chips t={t} at={chipsAt} items={["1 FOOT", "2 FEET", "ALL THE WAY UP"]} out={out} y={640} />
    </>
  );
};

export const rest = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: AVAIL, T0, TEND,
  beats: ({ AV, CL }) => {
    const plan = (PLAN as { a: number; k: string }[]).filter((b) => b.a >= T0 - 0.01);
    const W = (a: number, tr: Tr, p?: [number, number]): Beat => ({ a, tr, p, r: (t) => <World t={t} /> });
    const from3d = (a: number, pt: P3): [number, number] => { const q = screenOf(a + 0.3, pt); return [q.x, q.y]; };
    const r1 = (x: number) => Math.round(x * 10) / 10;
    let nAV = 0, nCL = 0;
    return plan.map((b, i): Beat => {
      const prev = plan[i - 1]?.k ?? "", pW = prev.startsWith("W"), pAV = prev === "AV";
      const a = i === 0 ? T0 : b.a;
      if (b.k === "AV") return AV(a, i === 0 ? "cut" : nAV++ % 2 ? "whipL" : "whip", { spans: SPANS[r1(b.a)] });
      if (b.k.startsWith("W")) {
        const pt = W_PORTAL[r1(b.a)];
        return pW ? W(a, "cut") : pAV ? W(a, "portal", pt ? from3d(a, pt) : [1420, 380]) : W(a, "zoom", pt ? from3d(a, pt) : [960, 540]);
      }
      return CL(a, kOf(b.k), pW ? "zoom" : pAV ? (nCL++ % 2 ? "whip" : "whipL") : nCL++ % 3 === 2 ? "light" : "push");
    });
  },
  pieces: (t, { at: at0 }) => {
    // at seguro: la palabra tiene que caer cerca (≤ 6 s) del respaldo; si no, el respaldo (nunca rompe el render)
    const at = (w: string, after: number) => { try { const x = at0(w, after - 0.6); return x - after < 6 ? x : after; } catch { return after; } };
    if (t < T0) return [];
    const L: React.ReactNode[] = [];
    const add = (a: number, b: number, n: React.ReactNode) => { if (t > a - 0.6 && t < b + 0.6) L.push(n); };

    // 70-86 · Wade, 40 años; la semana pasada el balde; hoy el agua DENTRO de la pared
    add(70.5, 76.6, <LowerThird key="lt" t={t} at={70.7} out={76.2} name="WADE" l2="ROOFER · TENNESSEE · 40 YEARS" l2at={72.7} />);
    add(77.7, 81.6, <Big key="lw" t={t} at={at("last", 77.7)} out={81.4} text="LAST WEEK: THE BUCKET" y={130} size={78} />);
    add(81.7, 85.4, <Big key="iw" t={t} at={at("inside", 82.5)} out={85.2} text="THE WATER INSIDE THE WALL" y={800} size={80} col={COL.ice} />);
    // 86-102 · Earl, 1979
    add(87, 89.6, <BigNum key="79" t={t} at={at("1979", 88.5)} text="1979" x={1440} y={320} size={190} col={COL.amber} edge="#5a3510" out={89.4} sub="SUMMER" />);
    add(90, 93.2, <Big key="kx" t={t} at={at("roofing", 90.5)} out={93.1} text="A ROOFING CREW · KNOXVILLE" y={820} size={70} />);
    add(93.3, 102.1, <Words key="earl" t={t} items={[{ at: at("earl", 94.5), txt: "EARL", col: COL.amber }, { at: at("60", 95.7), txt: "~60 YEARS OLD" }, { at: at("toothpick", 97), txt: "A TOOTHPICK" }, { at: at("10", 100.2), txt: "10 WORDS BEFORE LUNCH", col: COL.ice2 }]} out={102.0} y={820} size={70} />);
    // 102-123 · la señora, la costra, "your wall is a wick"
    add(108.4, 110.7, <Big key="sc" t={t} at={at("same", 108.5)} out={110.6} text="THE SAME WHITE CRUST" y={130} size={80} />);
    add(109.5, 114.3, <Tag key="3f" t={t} at={at("three", 109.8)} x={960} y={640} dx={-320} dy={-200} text="3 FEET UP" sub="ALL THE WAY AROUND" col={COL.amber} out={114.2} size={56} />);
    add(114.4, 119.5, <BigNum key="2x" t={t} at={at("twice", 115)} text="2×" x={1460} y={320} size={210} out={119.4} sub="PAINTED IT TWICE" />);
    add(116.4, 119.9, <Big key="10s" t={t} at={at("ten", 117)} out={119.5} text="10 SECONDS" y={820} size={80} col={COL.ice2} />);
    add(119.6, 121.9, <Stamp key="nw" t={t} at={at("wet", 120.5)} text="ISN'T WET" x={1450} y={300} out={121.8} rot={6} size={100} />);
    add(122, 123.6, <BigNum key="wk" t={t} at={at("wick", 122.4)} text="A WICK" x={1440} y={320} size={190} col={COL.ice2} edge="#1d4a6e" out={123.5} />);
    // 123-162 · el ascensor: poros que suben solos
    add(124, 128.2, <Big key="sy" t={t} at={at("save", 125.5)} out={128.0} text="LET ME SAVE YOU THE YEARS" y={120} size={74} />);
    add(129.5, 133.8, <Words key="mat" t={t} items={[{ at: 129.6, txt: "BLOCK" }, { at: at("brick", 130.5), txt: "BRICK" }, { at: at("poured", 131.2), txt: "CONCRETE" }, { at: at("mortar", 132.5), txt: "MORTAR" }]} out={133.7} y={820} size={86} />);
    add(135.5, 136.3, <Stamp key="ns" t={t} at={at("not", 135.6)} text="NOT SOLID" x={960} y={300} out={136.25} rot={-6} size={110} />);
    add(137, 141.6, <Big key="hr" t={t} at={at("hair", 139.2)} out={141.5} text="SMALLER THAN A HAIR" y={130} size={80} col={COL.ice2} />);
    add(142, 147.6, <T3 key="cl" t={t} at={at("climbs", 142.6)} out={147.5} pt={PT.cutTop} text="IT CLIMBS" sub="ALL BY ITSELF" col={COL.ice} dx={-420} dy={-120} size={58} />);
    add(147.7, 153, <Big key="pt" t={t} at={at("paper", 148.5)} out={152.9} text="LIKE A PAPER TOWEL IN A PUDDLE" y={130} size={70} />);
    add(153.1, 155.8, <Words key="np" t={t} items={[{ at: 153.2, txt: "NOBODY PUSHES IT" }, { at: at("climbs", 154.6), txt: "IT JUST CLIMBS", col: COL.ice }]} out={155.7} y={820} size={80} />);
    add(156, 158.5, <BigNum key="ca" t={t} at={at("capillary", 156.3)} text="CAPILLARY ACTION" x={1300} y={320} size={96} col={COL.ice2} edge="#1d4a6e" out={158.4} />);
    add(158.8, 161.9, <T3 key="ew" t={t} at={at("wick", 159.5)} out={161.8} pt={PT.cut} text="EARL: A WICK" col={COL.amber} dx={-380} dy={-200} size={58} />);
    // 162-184 · la base en la tierra mojada, 24 h, 2-4 pies
    add(162.5, 169.1, <Tag key="ft" t={t} at={at("footing", 164.5)} x={960} y={760} dx={-280} dy={-260} text="THE FOOTING" sub="DOWN IN THE DIRT" col={COL.amber} out={169.0} size={54} />);
    add(167, 173.5, <Big key="wd" t={t} at={at("wet", 167.8)} out={170.5} text="WET MOST OF THE YEAR" y={130} size={76} col={COL.ice} />);
    add(171, 176.1, <BigNum key="24" t={t} at={at("24", 171.4)} text="24 H" x={1460} y={320} size={190} out={176.0} sub="SIPPING · EVERY DAY" />);
    add(177, 184.2, <Words key="ft2" t={t} items={[{ at: at("two", 178.5), txt: "2 FT" }, { at: at("three", 179), txt: "3 FT" }, { at: at("four", 180.5), txt: "~4 FT", col: COL.amber }]} out={184.1} y={820} size={110} />);
    add(184.4, 186.9, <Big key="wc" t={t} at={184.6} out={186.8} text="WHERE THE WHITE CRUST COMES FROM" y={110} size={66} />);
    // 187-218 · minerales, sal, la evaporación, eflorescencia
    add(187.2, 191.9, <Words key="min" t={t} items={[{ at: at("minerals", 188), txt: "MINERALS" }, { at: at("salts", 189), txt: "SALTS", col: "#f6f5ee" }]} out={191.8} y={820} size={110} />);
    add(191.5, 194.4, <Big key="car" t={t} at={at("carries", 191.5)} out={194.3} text="THE WATER CARRIES THE SALT" y={130} size={74} />);
    add(196, 200.1, <T3 key="ev" t={t} at={at("dries", 197)} out={200.0} pt={PT.cutIn} text="WATER → THE AIR" col={COL.ice} dx={-420} dy={-220} size={54} />);
    add(200.2, 203.6, <T3 key="st" t={t} at={at("salt", 200.4)} out={203.5} pt={PT.cutIn} text="THE SALT STAYS" col="#f6f5ee" dx={-380} dy={160} size={58} />);
    add(204, 208.4, <Big key="dd" t={t} at={at("day", 205)} out={208.3} text="DAY AFTER DAY" y={820} size={90} />);
    add(208.6, 211.5, <BigNum key="ef" t={t} at={at("efflorescence", 209)} text="EFFLORESCENCE" x={960} y={300} size={110} col="#f6f5ee" edge="#6c6a60" out={211.4} />);
    add(214, 218.8, <Words key="eb" t={t} items={[{ at: 214.1, txt: "EVERY BIT OF WHITE" }, { at: at("came", 216), txt: "= WATER CAME OUT HERE", col: COL.ice }]} out={218.7} y={820} size={74} />);
    add(219, 222.2, <Stamp key="map" t={t} at={at("map", 219.3)} text="IT'S A MAP" x={1450} y={300} out={222.1} rot={6} size={110} />);
    add(223.5, 230.1, <BigNum key="10" t={t} at={at("10", 224.2)} text="10 SEC" x={1460} y={320} size={170} out={227.4} sub="ALL EARL NEEDED" />);
    add(227, 230.1, <Big key="wk2" t={t} at={at("which", 227.5)} out={230.0} text="WHICH KIND OF WATER PROBLEM" y={820} size={70} col={COL.amber} />);
    // 230-286 · leer el mapa: franja = de abajo; manchas = de costado; todo mojado = el aire
    add(230.3, 233.4, <Big key="rm" t={t} at={230.5} out={233.3} text="READ THE MAP" y={130} size={100} col={COL.amber} />);
    add(233.5, 240.1, <Words key="bd" t={t} items={[{ at: at("band", 233.4), txt: "A BAND · LOW" }, { at: at("same", 236.5), txt: "SAME HEIGHT ALL AROUND" }, { at: at("bathtub", 239), txt: "A BATHTUB RING", col: COL.amber }]} out={240.0} y={820} size={70} />);
    add(241, 245.3, <T3 key="rd" t={t} at={at("rising", 241.5)} out={245.2} pt={PT.tide} text="RISING DAMP" sub="FROM THE BOTTOM" col={COL.ice} dx={-380} dy={-220} size={60} />);
    add(245.4, 249.6, <T3 key="tm" t={t} at={at("tide", 246)} out={249.5} pt={PT.tide} text="THE TIDE MARK" sub="BROWN / YELLOW EDGE" col={COL.amber} dx={-360} dy={-220} size={60} />);
    add(252.7, 264.0, <CheckList key="pa" t={t} title="PATCHES UP HIGH" rows={[{ at: at("one", 255.5), txt: "IN ONE SPOT" }, { at: at("window", 257.5), txt: "UNDER A WINDOW" }, { at: at("gutter", 259.5), txt: "WHERE THE GUTTER OVERFLOWS" }, { at: at("worse", 261.5), txt: "WORSE AFTER A RAIN" }]} out={263.9} />);
    add(264.5, 269.3, <T3 key="sw" t={t} at={at("sideways", 266)} out={269.2} pt={PT.side} text="SIDEWAYS" sub="FROM THE DIRT OUTSIDE" col={COL.amber} dx={-380} dy={-200} size={60} />);
    add(270, 272.6, <Big key="df" t={t} at={at("different", 270.8)} out={272.5} text="A DIFFERENT FIX" y={820} size={86} />);
    add(273, 282.3, <Words key="cd" t={t} items={[{ at: at("top", 274), txt: "TOP TO BOTTOM" }, { at: at("july", 276.2), txt: "JULY", col: COL.amber }, { at: at("crust", 278.3), txt: "NO CRUST" }, { at: at("beads", 279.8), txt: "JUST BEADS", col: COL.ice }]} out={282.2} y={820} size={74} />);
    add(282.4, 286.6, <BigNum key="cn" t={t} at={at("condensation", 282.5)} text="CONDENSATION" x={960} y={300} size={110} col={COL.ice2} edge="#1d4a6e" out={284.6} />);
    add(284.5, 286.8, <Big key="bk" t={t} at={at("bucket", 284.3)} out={286.7} text="→ LAST WEEK'S BUCKET" y={820} size={78} col={GREEN} />);
    // 286-357 · la prueba del papel aluminio
    add(287, 288.5, <Big key="ng" t={t} at={at("guess", 287.5)} out={288.4} text="DON'T GUESS" y={130} size={96} />);
    add(288.6, 294.6, <BigNum key="5c" t={t} at={at("nickel", 290.3)} text="5¢" x={1460} y={320} size={220} col={COL.amber} edge="#5a3510" out={294.5} sub="THE FOIL TEST" />);
    add(295, 304.8, <Words key="fo" t={t} items={[{ at: at("foot", 296.5), txt: "1 FT × 1 FT" }, { at: at("tape", 299), txt: "TAPE IT FLAT" }, { at: at("four", 303.5), txt: "ALL 4 SIDES", col: COL.amber }]} out={304.7} y={820} size={80} />);
    add(307, 309.3, <BigNum key="2d" t={t} at={at("two", 307.8)} text="2 DAYS" x={1460} y={320} size={180} out={309.2} />);
    add(309.5, 311.4, <Big key="pl" t={t} at={at("peel", 309.6)} out={311.3} text="PEEL IT OFF" y={130} size={90} />);
    add(311.5, 327.7, <Toggle key="tg" t={t} at={at("room", 312.5)} flipAt={at("back", 318.4)} out={327.6} a={["ROOM SIDE", "= FROM THE AIR"]} b={["BACK SIDE", "= FROM THE WALL"]} x={1480} />);
    add(322, 327.7, <Big key="dk" t={t} at={at("darker", 322.5)} out={327.5} text="BLOCK DARKER BEHIND IT" y={820} size={70} col={COL.ice} />);
    add(329, 335.5, <T3 key="lo" t={t} at={at("low", 329.6)} out={335.4} pt={PT.foilLo} text="LOW" sub="A FEW INCHES UP" col={COL.ice} dx={-300} dy={140} size={56} />);
    add(332, 335.5, <T3 key="hi" t={t} at={at("high", 331.5)} out={335.4} pt={PT.foilHi} text="HIGH" sub="~5 FT UP" col={COL.amber} dx={-300} dy={-140} size={56} />);
    add(335.7, 341.9, <Words key="lw2" t={t} items={[{ at: at("low", 336), txt: "LOW WET + HIGH DRY" }, { at: at("wicking", 339.3), txt: "= WICKING UP", col: COL.ice }]} out={341.8} y={820} size={78} />);
    add(342, 346.7, <Words key="bw" t={t} items={[{ at: at("both", 342.3), txt: "BOTH WET AFTER RAIN" }, { at: at("side", 345), txt: "= FROM THE SIDE", col: COL.amber }]} out={346.6} y={820} size={78} />);
    add(346.8, 350.1, <CheckList key="wd2" t={t} title="WRITE DOWN" rows={[{ at: at("find", 348), txt: "WHAT YOU FOUND" }, { at: at("date", 349.4), txt: "THE DATE" }]} out={350.0} />);
    add(352, 357.3, <Price key="150" t={t} at={at("150", 353.7)} x={1460} y={260} item="CONTRACTOR VISIT" $={150} out={357.2} />);
    // 357-414 · el arreglo, PASO 1: cepillo en seco
    add(358, 360.5, <Big key="fx" t={t} at={at("fix", 358.8)} out={360.4} text="NOW THE FIX" y={130} size={100} col={COL.amber} />);
    add(361.5, 364.0, <Stamp key="om" t={t} at={at("order", 362.3)} text="THE ORDER MATTERS" x={1300} y={820} out={363.9} rot={-5} size={80} />);
    add(364, 366.4, <StepTitle key="s1" t={t} at={364.0} n={1} name="DRY BRUSH" out={366.3} />);
    add(367, 375.8, <Words key="br" t={t} items={[{ at: at("nylon", 369.5), txt: "NYLON SCRUB BRUSH" }, { at: at("wire", 371.8), txt: "OR A WIRE BRUSH", col: COL.amber }]} out={375.7} y={820} size={76} />);
    add(375.5, 378.4, <Big key="bd2" t={t} at={at("dry", 376)} out={378.3} text="BRUSH IT OFF DRY" y={130} size={96} col={COL.amber} />);
    add(378.5, 386.1, <CheckList key="fi" t={t} title="FIRST" rows={[{ at: at("drop", 379.5), txt: "DROP CLOTH / CARDBOARD" }, { at: at("safety", 382.5), txt: "SAFETY GLASSES" }]} out={386.0} />);
    add(386.2, 391.0, <Words key="bst" t={t} items={[{ at: 386.3, txt: "BRUSH" }, { at: at("sweep", 386.8), txt: "SWEEP" }, { at: at("throw", 387.5), txt: "THROW IT AWAY" }]} out={390.9} y={820} size={90} />);
    add(392, 400.0, <Mistake key="m1" t={t} at={at("wrong", 393)} n={1} txt="WASHING IT OFF WITH WATER" out={399.9} />);
    add(398.8, 400.1, <Stamp key="dn" t={t} at={at("don't", 398.8)} text="DON'T" x={1450} y={300} out={400.0} rot={7} size={130} />);
    add(401, 407.0, <Big key="sw2" t={t} at={at("pushed", 403)} out={406.9} text="SALTY WATER → BACK INTO THE WALL" y={130} size={66} col={COL.red} />);
    add(407.2, 411.2, <Big key="2w" t={t} at={407.3} out={411.1} text="2 WEEKS LATER: IT'S BACK" y={820} size={80} col={COL.red} />);
    add(411.3, 413.9, <Stamp key="ad" t={t} at={at("always", 412.3)} text="ALWAYS DRY FIRST" x={960} y={300} out={413.9} rot={-5} size={104} />);
    // 414-485 · PASO 2: vinagre blanco
    add(414, 416.0, <StepTitle key="s2" t={t} at={414.0} n={2} name="WHITE VINEGAR" out={415.9} />);
    add(416, 420.5, <Price key="vn" t={t} at={at("$3", 416)} x={1460} y={260} item="A JUG OF VINEGAR" $={3} out={420.4} />);
    add(421, 424.1, <BigNum key="50" t={t} at={at("half", 421.4)} text="50/50" x={1460} y={320} size={190} col={COL.ice2} edge="#1d4a6e" out={424.0} sub="VINEGAR + WATER" />);
    add(424.3, 426.5, <Big key="sp" t={t} at={424.4} out={426.4} text="SPRAY IT" y={130} size={100} />);
    add(426.6, 430.5, <Timer key="tm5" t={t} at={at("5", 427.4)} out={430.4} secs={5} label="MINUTES · THEN SCRUB" />);
    add(431.2, 434.9, <T3 key="ac" t={t} at={at("acid", 431.6)} out={434.8} pt={[3.99, -2.12, -0.1]} text="A MILD ACID" sub="BREAKS UP THE LAST SALT" col={GREEN} dx={-420} dy={-200} size={56} />);
    add(436.5, 443.1, <Words key="rg" t={t} items={[{ at: at("damp", 438), txt: "DAMP RAG ✓", col: GREEN }, { at: at("soaking", 439.2), txt: "NOT SOAKING ✗", col: COL.red }]} out={443.0} y={820} size={84} />);
    add(443.2, 447.5, <Big key="fan" t={t} at={at("fan", 445.2)} out={447.4} text="LET IT DRY · A FAN FOR A DAY" y={130} size={70} />);
    add(448.5, 454.4, <Receipt key="rc" t={t} rows={[{ at: at("vinegar", 448.8), item: "VINEGAR", $: 3 }, { at: at("brush", 451.5), item: "THE BRUSH YOU OWN", $: 0 }]} totalAt={at("own", 452.8)} x={1440} y={330} out={454.3} title="STEPS 1 + 2" />);
    add(455, 461.0, <BigNum key="mu" t={t} at={at("muriatic", 456.8)} text="MURIATIC ACID?" x={960} y={300} size={110} col={COL.red} edge="#5a1510" out={460.9} />);
    add(463, 471.7, <CheckList key="ma" t={t} title="MURIATIC ACID" rows={[{ at: at("skin", 464.6), txt: "BURNS YOUR SKIN" }, { at: at("lungs", 466), txt: "BURNS YOUR LUNGS" }, { at: at("eats", 468), txt: "EATS THE BLOCK" }]} out={471.6} />);
    add(472, 475.9, <Big key="er" t={t} at={at("emergency", 473.5)} out={475.8} text="THE EMERGENCY ROOM" y={130} size={86} col={COL.red} />);
    add(476, 480.5, <Big key="vj" t={t} at={at("vinegar", 478.3)} out={480.4} text="VINEGAR DOES THE JOB" y={130} size={86} col={GREEN} />);
    add(481, 484.8, <Stamp key="pr" t={t} at={at("pros", 482.8)} text="PROS ONLY" x={1450} y={300} out={484.7} rot={6} size={110} />);
    // 485-626 · PASO 3: afuera (canaletas, caños, pendiente, mulch)
    add(485, 487.5, <StepTitle key="s3" t={t} at={485.1} n={3} name="THE OUTSIDE" out={487.4} />);
    add(490.5, 494.4, <Stamp key="ws" t={t} at={at("wrong", 491.5)} text="THE WRONG SIDE OF THE WALL" x={960} y={820} out={494.3} rot={-4} size={74} />);
    add(496, 501.9, <Words key="sy2" t={t} items={[{ at: at("clean", 496.6), txt: "CLEANING THE CRUST" }, { at: at("symptom", 498.4), txt: "= ONLY THE SYMPTOM", col: COL.amber }]} out={501.8} y={130} size={74} />);
    add(504.5, 510.9, <T3 key="lw3" t={t} at={at("cut", 506)} out={510.8} pt={PT.soil} text="LESS WATER" sub="AGAINST THE WALL" col={COL.ice} dx={-60} dy={-280} size={58} />);
    add(512.5, 517.4, <Big key="rf" t={t} at={at("roof", 513.4)} out={517.3} text="IT STARTED AT THE ROOF" y={130} size={86} col={COL.amber} />);
    add(517.5, 523.1, <Words key="go" t={t} items={[{ at: 517.6, txt: "GO OUTSIDE" }, { at: at("look", 520.6), txt: "LOOK UP", col: COL.amber }]} out={523.0} y={820} size={96} />);
    add(523.3, 526.6, <T3 key="rl" t={t} at={at("roof", 524)} out={526.5} pt={PT.gutter} text="A ROOF LEAK" sub="THAT TOOK THE LONG WAY DOWN" col={COL.amber} dx={-460} dy={-60} size={56} />);
    add(526.7, 532.4, <Words key="gu" t={t} items={[{ at: 526.8, txt: "OVERFLOWING GUTTERS" }, { at: at("downspout", 529.5), txt: "DOWNSPOUTS AT THE CORNER" }]} out={532.3} y={820} size={70} />);
    add(532.4, 537.9, <Big key="hg" t={t} at={at("hundreds", 532.6)} out={537.8} text="HUNDREDS OF GALLONS" y={130} size={90} col={COL.ice} />);
    add(538, 543.5, <BigNum key="1k" t={t} at={at("thousand", 540.5)} text="1,000+ GAL" x={1440} y={320} size={150} col={COL.ice2} edge="#1d4a6e" out={543.4} sub="FROM 1 INCH OF RAIN" />);
    add(543.6, 548.8, <Stamp key="dr" t={t} at={at("drink", 546.5)} text="IT DRINKS IT" x={1450} y={300} out={548.7} rot={6} size={100} />);
    add(548.9, 553.2, <CheckList key="og" t={t} title="OUTSIDE" rows={[{ at: at("clean", 549.2), txt: "CLEAN THE GUTTERS" }, { at: at("downspout", 551.3), txt: "CHECK EVERY DOWNSPOUT" }]} out={553.1} />);
    add(555, 561.8, <BigNum key="46" t={t} at={at("four", 558.5)} text="4–6 FT" x={1440} y={320} size={190} col={GREEN} edge="#1f5a36" out={561.7} sub="AWAY FROM THE HOUSE" />);
    add(562, 565.2, <Price key="ex" t={t} at={at("ten", 563)} x={1460} y={260} item="EXTENSION" $={10} out={565.0} />);
    add(565, 567.6, <Price key="sb" t={t} at={at("splash", 565.2)} x={1460} y={260} item="SPLASH BLOCK" $={10} out={567.5} />);
    add(567.7, 573.4, <T3 key="sl" t={t} at={at("slope", 570.5)} out={573.3} pt={PT.grade} text="SLOPE AWAY" sub="FROM THE WALL" col={GREEN} dx={-60} dy={-260} size={58} />);
    add(573.5, 578.4, <BigNum key="6i" t={t} at={at("6", 576.2)} text={'6" / 10 FT'} x={960} y={250} size={130} col={COL.amber} edge="#5a3510" out={578.3} sub="THE DROP" />);
    add(578.8, 581.7, <Big key="lv" t={t} at={at("level", 580)} out={581.6} text="A BOARD + A LEVEL" y={820} size={86} />);
    add(582, 591.0, <Big key="lo2" t={t} at={at("low", 584.5)} out={590.9} text="A LOW SPOT = WHERE YOUR WALL DRINKS" y={130} size={64} col={COL.red} />);
    add(591.1, 596.6, <Words key="fd" t={t} items={[{ at: at("plain", 592.3), txt: "PLAIN DIRT ✓", col: GREEN }, { at: at("mulch", 593.3), txt: "NOT MULCH ✗", col: COL.red }, { at: at("pack", 594.4), txt: "PACK IT DOWN" }]} out={596.5} y={820} size={78} />);
    add(599.7, 606.8, <Big key="mu2" t={t} at={at("mulch", 600.8)} out={606.7} text="MULCH PILED UP AGAINST THE HOUSE" y={130} size={66} />);
    add(607, 610.1, <T3 key="spg" t={t} at={at("sponge", 608.3)} out={610.0} pt={PT.mulch} text="A SPONGE" sub="AGAINST YOUR WALL" col={COL.amber} dx={-80} dy={-260} size={60} />);
    add(610.4, 614.8, <Words key="pb" t={t} items={[{ at: 610.5, txt: "PULL IT BACK" }, { at: at("sprinklers", 612.3), txt: "SPRINKLERS OFF THE HOUSE", col: COL.ice }]} out={614.7} y={820} size={74} />);
    add(616, 623.6, <Words key="ce" t={t} items={[{ at: at("extension", 617.5), txt: "A DOWNSPOUT EXTENSION" }, { at: at("wheelbarrow", 619), txt: "+ A WHEELBARROW OF DIRT", col: COL.amber }]} out={623.5} y={820} size={70} />);
    add(620.5, 623.6, <Big key="pr2" t={t} at={at("product", 621.5)} out={623.5} text="BEAT EVERY PRODUCT ON THE SHELF" y={130} size={64} col={GREEN} />);
    add(623.7, 626.1, <Stamp key="ht" t={t} at={623.8} text="THE HONEST TRUTH" x={960} y={300} out={626.0} rot={-5} size={96} />);
    // 626-693 · PASO 4: nunca pintar encima; por qué la pintura se ampolla
    add(626.2, 628.4, <StepTitle key="s4" t={t} at={at("four", 626.6)} n={4} name="TREAT THE WALL" out={628.3} />);
    add(628.5, 633.4, <CheckList key="ff" t={t} title="ONLY AFTER" rows={[{ at: at("outside", 629.2), txt: "THE OUTSIDE IS FIXED" }, { at: at("clean", 631), txt: "THE WALL IS CLEAN + DRY" }]} out={633.3} />);
    add(637, 639.5, <Stamp key="nv" t={t} at={637.2} text="NEVER PAINT OVER THE CRUST" x={960} y={300} out={639.4} rot={-5} size={84} />);
    add(639.6, 645.8, <Words key="np2" t={t} items={[{ at: at("regular", 640.2), txt: "NO WALL PAINT ✗", col: COL.red }, { at: at("oil", 641.6), txt: "NO OIL PAINT ✗", col: COL.red }, { at: at("skin", 644), txt: "NOTHING THAT MAKES A SKIN", col: COL.amber }]} out={645.7} y={780} size={66} />);
    add(646.1, 651.8, <Big key="cw" t={t} at={at("clean", 647.5)} out={651.7} text="NOT EVEN ON A CLEAN WALL" y={130} size={76} />);
    add(652, 654.5, <Big key="why" t={t} at={652.0} out={654.4} text="HERE'S WHY" y={130} size={100} col={COL.amber} />);
    add(654.6, 658.4, <T3 key="sk" t={t} at={at("skin", 655)} out={658.3} pt={PT.cutIn} text="PAINT = A SKIN" col="#fffbe9" dx={-420} dy={-220} size={58} />);
    add(658.5, 662.0, <T3 key="ps" t={t} at={at("pushes", 660.5)} out={661.9} pt={PT.cutIn} text="IT PUSHES" col={COL.ice} dx={-380} dy={160} size={64} />);
    add(662, 664.4, <T3 key="bh" t={t} at={at("behind", 663)} out={664.3} pt={PT.cutIn} text="SALT DRIES BEHIND THE PAINT" col="#f6f5ee" dx={-460} dy={-200} size={50} />);
    add(666, 672.0, <Big key="ph" t={t} at={at("hard", 668)} out={671.9} text="SALT CRYSTALS PUSH HARD" y={130} size={80} col={COL.amber} />);
    add(672.2, 674.4, <T3 key="bb" t={t} at={672.3} out={674.3} pt={PT.blister} text="THE BUBBLE YOU POPPED" col={COL.ice} dx={-420} dy={-220} size={54} />);
    add(674.5, 676.8, <T3 key="pe" t={t} at={674.6} out={676.7} pt={PT.blister} text="THE PEELING" col={COL.amber} dx={-380} dy={-220} size={58} />);
    add(677, 682.0, <Stamp key="tr" t={t} at={at("trapped", 678.8)} text="YOU TRAPPED IT" x={960} y={820} out={681.9} rot={-4} size={100} />);
    add(682.1, 687.0, <Words key="pd" t={t} items={[{ at: at("plastic", 682.8), txt: "PLASTIC SHEET ✗", col: COL.red }, { at: at("drywall", 684.7), txt: "DRYWALL ON BARE BLOCK ✗", col: COL.red }]} out={686.9} y={820} size={70} />);
    add(687.2, 693.0, <Big key="hm" t={t} at={at("mold", 690.3)} out={692.9} text="HIDDEN WATER · HIDDEN MOLD" y={130} size={74} col={COL.red} />);
    // 693-785 · el sellador penetrante de silicato
    add(693.1, 695.2, <Big key="in" t={t} at={693.2} out={695.1} text="SO WHAT INSTEAD?" y={130} size={96} col={COL.amber} />);
    add(695.3, 699.1, <BigNum key="ps2" t={t} at={at("penetrating", 696.5)} text="PENETRATING SILICATE SEALER" x={960} y={300} size={76} col={GREEN} edge="#1f5a36" out={699.0} />);
    add(702.2, 707.8, <CheckList key="lb" t={t} title="ON THE LABEL" rows={[{ at: at("concrete", 703.2), txt: "MASONRY DENSIFIER" }, { at: at("penetrating", 705.8), txt: "PENETRATING SEALER" }]} out={707.7} />);
    add(707.9, 709.4, <Big key="lw4" t={t} at={at("water", 708.6)} out={709.3} text="LOOKS LIKE WATER" y={820} size={86} col={COL.ice2} />);
    add(709.5, 711.7, <Big key="nt" t={t} at={709.6} out={711.6} text="NOT ON TOP LIKE PAINT" y={130} size={80} />);
    add(712, 715.4, <T3 key="so" t={t} at={at("soaks", 712)} out={715.3} pt={PT.cut} text="SOAKS INTO THE CHANNELS" col={COL.amber} dx={-460} dy={-220} size={52} />);
    add(716, 720.8, <Big key="gl" t={t} at={at("glassy", 717.5)} out={720.7} text="HARD + GLASSY · INSIDE THE HOLES" y={130} size={70} col={COL.amber} />);
    add(721.7, 728.0, <T3 key="nr" t={t} at={at("narrower", 722.5)} out={727.9} pt={PT.cut} text="NARROWER CHANNELS" col={COL.amber} dx={-440} dy={-240} size={54} />);
    add(724, 728.0, <Words key="ls" t={t} items={[{ at: at("less", 724.1), txt: "LESS WATER", col: COL.ice }, { at: at("less", 725.9), txt: "LESS SALT", col: "#f6f5ee" }]} out={727.9} y={820} size={90} />);
    add(728.1, 732.1, <T3 key="iw2" t={t} at={at("inside", 729.5)} out={732.0} pt={PT.cut} text="INSIDE THE WALL" sub="NOT ON TOP OF IT" col={GREEN} dx={-420} dy={-220} size={56} />);
    add(732.4, 735.0, <Stamp key="nsk" t={t} at={732.5} text="NO SKIN = NO PEEL" x={1450} y={300} out={734.9} rot={6} size={90} />);
    add(735.1, 737.6, <Big key="br2" t={t} at={at("breathe", 736)} out={737.5} text="THE WALL STILL BREATHES" y={820} size={80} col={GREEN} />);
    add(737.7, 742.3, <BigNum key="30" t={t} at={at("$30", 737.7)} text="$30–40" x={1440} y={320} size={190} col="#ffe7a3" edge="#6e5a1d" out={742.2} sub="A GALLON" />);
    add(742.3, 748.2, <BigNum key="100" t={t} at={at("100", 742.4)} text="~100 SQ FT" x={1440} y={320} size={150} out={748.1} sub="PER GALLON ON BLOCK" />);
    add(748.5, 753.9, <Big key="1g" t={t} at={at("gallon", 751.5)} out={753.8} text="1 GALLON GOES A LONG WAY" y={130} size={76} col={GREEN} />);
    add(754, 767.2, <CheckList key="how" t={t} title="HOW" rows={[{ at: at("sprayer", 755.6), txt: "GARDEN SPRAYER / BIG BRUSH" }, { at: at("clean", 757.8), txt: "CLEAN, DRY WALL" }, { at: at("soak", 759.8), txt: "LET IT SOAK IN" }, { at: at("second", 762.5), txt: "2ND COAT WHILE DAMP" }]} out={767.1} />);
    add(767.3, 768.8, <Words key="npr" t={t} items={[{ at: 767.4, txt: "NO PRIMER" }, { at: at("topcoat", 768), txt: "NO TOPCOAT", col: GREEN }]} out={768.7} y={820} size={90} />);
    add(769, 774.6, <Big key="ww" t={t} at={at("wait", 771.5)} out={774.5} text="WANT IT WHITE? WAIT A FEW WEEKS" y={130} size={70} />);
    add(774.6, 778.9, <Big key="mp" t={t} at={at("masonry", 775.3)} out={778.8} text="MASONRY PAINT THAT BREATHES" y={130} size={74} col={GREEN} />);
    add(779.2, 785.6, <Big key="bare" t={t} at={at("bare", 782)} out={785.5} text="OR JUST LEAVE IT BARE" y={820} size={86} />);
    // 785-833 · cuando nada de esto alcanza
    add(786, 790.4, <Stamp key="ne" t={t} at={at("none", 788.6)} text="WHEN IT'S NOT ENOUGH" x={960} y={300} out={790.3} rot={-5} size={90} />);
    add(790.5, 802.1, <CheckList key="st2" t={t} title="IF YOU STILL GET" rows={[{ at: at("foil", 791.5), txt: "FOIL SAYS: THE SIDE" }, { at: at("gutters", 794.8), txt: "GUTTERS + DIRT FIXED" }, { at: at("floor", 798.8), txt: "WATER ON THE FLOOR" }]} out={802.0} />);
    add(802.2, 805.6, <Big key="up" t={t} at={at("pressure", 804)} out={805.5} text="WATER UNDER PRESSURE" y={130} size={86} col={COL.red} />);
    add(805.7, 808.5, <Stamp key="wh" t={t} at={at("hold", 806.8)} text="A SEALER WON'T HOLD IT" x={960} y={820} out={808.4} rot={-4} size={80} />);
    add(808.6, 814.8, <Words key="dj" t={t} items={[{ at: at("drainage", 809.3), txt: "OUTSIDE DRAINAGE" }, { at: at("sump", 811.5), txt: "OR DRAIN + SUMP PUMP" }, { at: at("call", 813.2), txt: "CALL SOMEBODY", col: COL.amber }]} out={814.7} y={780} size={70} />);
    add(815, 824.3, <CheckList key="stp" t={t} title="STOP IF" rows={[{ at: at("wider", 816.3), txt: "A CRACK GETS WIDER" }, { at: at("dime", 818.3), txt: "A DIME SLIDES IN" }, { at: at("bowing", 820.3), txt: "THE WALL BOWS IN" }]} out={824.2} />);
    add(824.3, 826.8, <Words key="dsp" t={t} items={[{ at: at("seal", 824.3), txt: "DON'T SEAL", col: COL.red }, { at: at("paint", 824.9), txt: "DON'T PAINT", col: COL.red }, { at: at("patch", 825.7), txt: "DON'T PATCH", col: COL.red }]} out={826.7} y={780} size={80} />);
    add(826.9, 829.4, <BigNum key="se" t={t} at={826.95} text="STRUCTURAL ENGINEER" x={960} y={300} size={96} col={COL.amber} edge="#5a3510" out={829.3} sub="FIRST" />);
    add(829.6, 833.2, <Versus key="vs" t={t} at={at("hundred", 830.2)} out={833.1} L={{ label: "THE ENGINEER", val: "$300", h: 0.12, col: "#5ee38f", mark: "ok" }} R={{ label: "THE WALL", val: "$10,000s", h: 1, col: COL.red, mark: "x" }} />);
    // 833-904 · dale tiempo; el resumen; "your wall is a wick"
    add(833.3, 838.6, <Big key="gt" t={t} at={at("time", 836.5)} out={838.5} text="GIVE IT TIME" y={130} size={100} col={COL.amber} />);
    add(838.7, 846.7, <T3 key="ss" t={t} at={at("season", 843.4)} out={846.6} pt={PT.tide} text="A WHOLE SEASON" sub="THE TIDE MARK DROPS" col={GREEN} dx={-380} dy={-240} size={58} />);
    add(839, 843.3, <BigNum key="20" t={t} at={at("20", 839.9)} text="20 YEARS WET" x={1300} y={260} size={110} out={843.2} />);
    add(846.9, 851.5, <Words key="kb" t={t} items={[{ at: at("brushing", 847.6), txt: "DRY BRUSH EVERY FEW WEEKS" }, { at: at("tide", 849.6), txt: "WATCH THE TIDE MARK", col: COL.amber }]} out={851.4} y={820} size={70} />);
    add(851.6, 854.1, <Big key="win" t={t} at={at("dropping", 852.3)} out={854.0} text="LINE DROPPING = YOU'RE WINNING" y={130} size={70} col={GREEN} />);
    add(854.2, 859.2, <Words key="sm" t={t} items={[{ at: at("salt", 857.2), txt: "IT'S SALT", col: "#f6f5ee" }, { at: at("map", 858.4), txt: "IT'S A MAP", col: COL.amber }]} out={859.1} y={820} size={100} />);
    add(859.4, 863.3, <T3 key="r1" t={t} at={859.6} out={863.2} pt={PT.tide} text="BAND LOW" sub="= FROM THE BOTTOM" col={COL.ice} dx={-360} dy={-220} size={58} />);
    add(863.4, 864.5, <T3 key="r2" t={t} at={863.5} out={864.4} pt={PT.side} text="PATCHES HIGH" sub="= FROM THE SIDE" col={COL.amber} dx={-360} dy={-200} size={58} />);
    add(866.5, 889.7, <CheckList key="fix" t={t} title="THE WHOLE FIX" rows={[{ at: at("foil", 867.9), txt: "FOIL TELLS YOU" }, { at: at("brush", 870.1), txt: "BRUSH IT OFF DRY" }, { at: at("three", 873.2), txt: "$3 OF VINEGAR" }, { at: at("outside", 876.6), txt: "FIX THE OUTSIDE" }, { at: at("seal", 884.5), txt: "SEAL FROM INSIDE" }]} out={889.6} />);
    add(889.8, 893.0, <Stamp key="nv2" t={t} at={at("never", 889.9)} text="NEVER PAINT OVER IT" x={760} y={820} out={892.9} rot={-4} size={96} />);
    add(895, 899.8, <Big key="fp" t={t} at={at("bubbling", 897.8)} out={899.7} text="FRESH PAINT BUBBLING OFF" y={130} size={76} />);
    add(901.3, 902.8, <Big key="iw3" t={t} at={901.4} out={902.7} text="YOUR WALL ISN'T WET." y={820} size={90} />);
    add(902.9, 905.2, <T3 key="wk3" t={t} at={903.0} out={905.1} pt={PT.cut} text="YOUR WALL IS A WICK" col={COL.amber} dx={-440} dy={-220} size={60} />);
    // 904-938 · CTA: suscribite + campanita + UNA pregunta; la próxima: el ático
    add(905.3, 913.3, <SubBell key="sub" t={t} at={at("subscribe", 905.6)} bellAt={at("bell", 907.2)} out={913.2} />);
    add(915.3, 926.0, <Ask key="ask" t={t} at={at("comments", 915.6)} chipsAt={at("one", 921.0)} out={925.9} />);
    add(926, 936.4, <NextCard key="nx" t={t} at={at("next", 926)} subAt={at("flashlight", 928.8)} out={936.3} title="NEXT WEEK: THE ATTIC"><div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, #33465a, #0b1018)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 84, lineHeight: 1.1, color: "#ffe7a3", textShadow: extrude(10, "rgba(0,0,0,.7)") }}>WHERE YOUR ROOF LEAK<br />REALLY IS</div></NextCard>);
    return L;
  },
});
export const Rest: React.FC = () => <AbsoluteFill><rest.Body /></AbsoluteFill>;
export const FULL_FRAMES = rest.FRAMES;
