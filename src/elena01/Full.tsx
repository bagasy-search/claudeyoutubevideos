// elena01 · el video ENTERO (0 → 1049 s), vara gary01: una base por frase —Elena en cámara / su toma haciendo lo que
// cuenta (LTX, plano fijo) / su mundo 3D (la despensa infinita, la olla y el frasco en corte)— y CERO cortes secos.
// Orden y anclas de las bases: beats.json (D:/rtmp_elena01/mk_beats.py). Piezas 2.5D clavadas a la palabra con at().
// Audio fuera de Remotion (mezcla.py). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PantryWorld, sceneOf, screenOf, camSpeed, PT, V3 } from "./pantry3d";
import { BigNum, COL, Chips, DrawX, LowerThird, Tag, Thermo, setSlug } from "../kits/yanqui3d/lib";
import { makeVideo, Stamp, Beat, Tr } from "../kits/yanqui3d/engine";
import { CheckList, Mistake, MistakesDeal, NextCard, StepTitle, TimeBars, Timer, Versus, Words } from "../kits/yanqui3d/pieces";
import CAPS from "./caps.json";
import AVW from "./avw.json";
import AVAIL from "./avail.json";
import BJ from "./beats.json";

setSlug("elena01");
export const TEND = BJ.TEND;
export const FULL_FRAMES = Math.ceil(TEND * 30);
type BB = { a: number; k: string; tr: Tr };
const BEATS = BJ.beats as BB[];
// segundo en que entra cada base del mundo 3D (para clavar etiquetas a un punto del mundo)
const startOf = (k: string) => BEATS.find((b) => b.k === k)!.a;

// el mundo con blur de movimiento real (sólo el mundo, nunca el avatar)
const World: React.FC<{ t: number; name: string; a: number }> = ({ t, name, a }) => {
  const u = t - a, v0 = camSpeed(name, u), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><PantryWorld t={t} sc={sceneOf(name, u)} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
// etiqueta pegada a un punto del mundo mientras esa base está en pantalla
const pin = (t: number, k: string, q: V3) => { const a = startOf(k); return screenOf(k.slice(2), t - a, q); };
const inB = (t: number, k: string) => { const i = BEATS.findIndex((b) => b.k === k); return t >= BEATS[i].a && t < (BEATS[i + 1]?.a ?? TEND); };

const M = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: AVAIL as { clips: string[]; imgs: string[] }, T0: 0, TEND, flashAtStart: false,
  beats: ({ AV, CL }) => BEATS.map((b): Beat => {
    if (b.k === "AV") return { ...AV(b.a, b.tr), a: b.a };
    if (b.k.startsWith("W:")) return { a: b.a, tr: b.tr, p: [960, 470], r: (t) => <World t={t} name={b.k.slice(2)} a={b.a} /> };
    return CL(b.a, b.k, b.tr, [960, 470], [1.0, 1.06]);
  }),
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    const P = (n: React.ReactNode) => L.push(n);
    // ---------- gancho ----------
    P(<Tag key="crk" t={t} at={at("lost its bottom")} x={960} y={560} dx={300} dy={-200} text="THE BOTTOM JUST LET GO" col={COL.red} out={at("Syrup") + 1.2} />);
    P(<Words key="w6" t={t} items={[{ at: at("other six jars"), txt: "6 JARS STANDING IN IT" }]} out={16.3} y={900} size={76} />);
    if (inB(t, "W:canner:cold")) P(<Tag key="cj" t={t} at={at("cold.", 20)} x={pin(t, "W:canner:cold", PT.thermo).x} y={pin(t, "W:canner:cold", PT.thermo).y} dx={-320} dy={-120} text="70°F JAR → HOT WATER" col={COL.ice} out={at("So tell me") - 0.1} />);
    P(<BigNum key="500a" t={t} at={at("500 jars")} text="500" x={1450} y={300} size={210} col={COL.amber} sub="JARS EVERY SUMMER" out={at("not lose") - 0.05} />);
    P(<Words key="nl" t={t} items={[{ at: at("not lose"), txt: "…AND NOT LOSE ONE" }]} out={32.3} y={900} size={84} />);
    P(<Chips key="50y" t={t} at={at("every trick")} items={["50 YEARS OF TRICKS"]} out={38.2} y={880} />);
    P(<Stamp key="pen" t={t} at={at("penny")} text="COSTS $0" x={1350} y={300} size={96} out={at("And the third") - 0.05} />);
    P(<Words key="ar" t={t} items={[{ at: at("third one"), txt: "#3 STARTS A FAMILY ARGUMENT", col: COL.amber }]} out={at("You don't know") - 0.05} y={900} size={72} />);
    P(<LowerThird key="lt" t={t} at={at("I'm Elena")} out={at("Tomatoes, peaches") - 0.1} name="ELENA" l2="74 · CANNING SINCE SHE WAS 24 · THE FARM KITCHEN" l2at={at("I'm Elena") + 0.4} />);
    P(<Chips key="crops" t={t} at={at("Tomatoes, peaches")} items={["TOMATOES", "PEACHES", "GREEN BEANS", "PICKLES", "JAM", "APPLESAUCE"]} out={at("My mother-in-law") - 0.05} y={880} />);
    P(<Tag key="chip" t={t} at={at("chip on the")} x={960} y={420} dx={300} dy={-120} text="SAME OLD CANNER · CHIPPED LID" col={COL.ink} out={71.0} size={40} />);
    P(<BigNum key="40" t={t} at={at("40 jars")} text="40" x={1440} y={330} size={230} col={COL.red} sub="JARS OF PEACHES LOST" out={at("So let's do") - 0.1} />);
    P(<DrawX key="x40" t={t} at={at("40.", 72) + 0.4} x={1300} y={180} w={300} h={300} out={at("So let's do") - 0.1} />);
    P(<Words key="nev" t={t} items={[{ at: at("never happen"), txt: "NEVER AGAIN." }]} out={at("So let's do") - 0.1} y={900} size={90} />);
    // ---------- truco 1 ----------
    P(<StepTitle key="s1" t={t} at={at("Trick number one")} n={1} name="WHAT'S ALLOWED IN THE BATH" out={at("This is the one") + 1.6} />);
    P(<BigNum key="212a" t={t} at={at("212")} text="212°F" x={1460} y={300} size={170} col={COL.amber} sub="AS HOT AS BOILING WATER GETS" out={at("plenty for") - 0.1} />);
    P(<Words key="hia" t={t} items={[{ at: at("high acid food"), txt: "HIGH ACID = OK", col: "#9df0b4" }]} out={at("peaches apples") - 0.05} y={160} size={84} />);
    P(<Chips key="hac" t={t} at={at("peaches apples")} items={["PEACHES", "APPLES", "BERRIES", "JAM", "PICKLES", "TOMATOES + ACID"]} out={117.6} y={880} />);
    P(<Words key="loa" t={t} items={[{ at: at("those are low acid"), txt: "LOW ACID", col: COL.red }]} out={132.8} y={160} size={110} />);
    P(<Chips key="lac" t={t} at={at("green beans corn")} items={["GREEN BEANS", "CORN", "CARROTS", "POTATOES", "SOUP", "MEAT", "BEANS"]} out={at("those are low") - 0.05} y={880} />);
    P(<Words key="bot" t={t} items={[{ at: at("botulism"), txt: "BOTULISM SPORES", col: COL.red }]} out={138.2} y={900} size={84} />);
    P(<BigNum key="240" t={t} at={at("240")} text="240°F" x={1460} y={300} size={170} col={COL.red} sub="TO KILL THE SPORES" out={at("my neighbor") - 0.1} />);
    if (inB(t, "W:jar:press")) { const q = pin(t, "W:jar:press", PT.jarMid); P(<Tag key="pc" t={t} at={startOf("W:jar:press") + 1.2} x={q.x} y={q.y} dx={-300} dy={-160} text="PRESSURE CANNER: SPORES DIE" col="#9df0b4" size={34} out={at("my neighbor") - 0.1} />); }
    if (inB(t, "W:jar:water")) { const q = pin(t, "W:jar:water", PT.jarMid); P(<Tag key="wb" t={t} at={startOf("W:jar:water") + 1.0} x={q.x} y={q.y} dx={-300} dy={-160} text="WATER BATH: THEY SURVIVE" col={COL.red} size={34} out={150.5} />); }
    P(<Stamp key="3h" t={t} at={at("three hours three")} text="3 HOURS ≠ SAFE" x={1350} y={280} size={92} out={156.1} />);
    P(<Words key="tf" t={t} items={[{ at: at("time does not fix"), txt: "TIME DOESN'T FIX TEMPERATURE" }, { at: at("still 212"), txt: "STILL 212°F", col: COL.amber }]} out={at("So here's my rule") - 0.1} y={900} size={74} />);
    P(<Stamp key="rule1" t={t} at={at("So here's my rule")} text="MY ONE RULE" x={960} y={480} size={150} out={at("sweet or sour") - 0.05} />);
    P(<Versus key="vs1" t={t} at={at("sweet or sour")} out={175.0} title="MY ONE RULE" L={{ label: "SWEET OR SOUR", val: "SWIMS", h: 0.55, col: COL.amber, mark: "ok" }} R={{ label: "PLAIN", val: "PRESSURE", h: 0.9, col: COL.red }} />);
    // ---------- truco 2 ----------
    P(<StepTitle key="s2" t={t} at={at("Trick number two")} n={2} name="TOMATOES ALWAYS GET ACID" out={at("Every jar") + 1.2} />);
    P(<Words key="ne" t={t} items={[{ at: at("Every jar"), txt: "EVERY JAR." }, { at: at("No exceptions"), txt: "NO EXCEPTIONS.", col: COL.amber }]} out={at("I know") - 0.05} y={900} size={84} />);
    P(<Words key="ln" t={t} items={[{ at: at("on the line"), txt: "SWEETER = RIGHT ON THE LINE" }, { at: at("can't taste where"), txt: "YOU CAN'T TASTE IT", col: COL.red }]} out={202.2} y={900} size={70} />);
    P(<TimeBars key="lem" t={t} rows={[
      { at: at("two tablespoons"), label: "QUART", val: "2 TBSP LEMON", frac: 1, col: "#f2e27a" },
      { at: at("one tablespoon"), label: "PINT", val: "1 TBSP LEMON", frac: 0.5, col: "#f2e27a" },
      { at: at("half a teaspoon"), label: "QUART", val: "½ TSP CITRIC", frac: 0.5, col: COL.ice },
      { at: at("quarter teaspoon"), label: "PINT", val: "¼ TSP CITRIC", frac: 0.25, col: COL.ice }]} out={219.3} />);
    if (inB(t, "W:jar:acid")) { const q = pin(t, "W:jar:acid", PT.jarBot); P(<Tag key="bt" t={t} at={startOf("W:jar:acid") + 0.6} x={q.x} y={q.y} dx={-320} dy={-60} text="IN THE EMPTY JAR · FIRST" col="#f2e27a" out={at("and it has to be") - 0.05} />); }
    P(<Stamp key="btl" t={t} at={at("bottled lemon juice not")} text="BOTTLED — NOT FRESH" x={1340} y={260} size={86} out={233.0} />);
    P(<Words key="sug" t={t} items={[{ at: at("pinch of sugar"), txt: "+ A PINCH OF SUGAR" }]} out={at("trick number three") - 0.05} y={900} size={76} />);
    // ---------- truco 3 ----------
    P(<StepTitle key="s3" t={t} at={at("trick number three")} n={3} name="NO COLD JARS IN HOT WATER" out={251.4} />);
    if (inB(t, "W:canner:crack")) { const q = pin(t, "W:canner:crack", PT.canLids); P(<Tag key="ts" t={t} at={at("sudden jump")} x={q.x} y={q.y + 120} dx={330} dy={-200} text="OUTSIDE HOT · INSIDE COLD" col={COL.red} out={267.0} />); }
    P(<Words key="tsh" t={t} items={[{ at: at("thermal shock"), txt: "THERMAL SHOCK", col: COL.red }]} out={at("So I keep") - 0.05} y={160} size={110} />);
    P(<CheckList key="hot" t={t} title="EVERY TIME" rows={[{ at: at("hot jars hot"), txt: "HOT JARS" }, { at: at("hot food hot"), txt: "HOT FOOD" }, { at: at("hot water every"), txt: "HOT WATER" }]} out={287.0} />);
    P(<BigNum key="140" t={t} at={at("140")} text="140°F" x={460} y={300} size={150} col={COL.amber} sub="RAW PACK" out={299.3} />);
    P(<BigNum key="180" t={t} at={at("180")} text="180°F" x={1460} y={300} size={150} col={COL.red} sub="HOT PACK" out={299.3} />);
    P(<DrawX key="ovx" t={t} at={at("Don't", 307) + 0.1} x={560} y={240} w={800} h={560} out={at("heats glass unevenly") - 0.1} />);
    P(<Words key="ovw" t={t} items={[{ at: at("heats glass unevenly"), txt: "DRY HEAT = WEAK GLASS", col: COL.red }]} out={316.4} y={900} size={80} />);
    P(<Words key="wyf" t={t} items={[{ at: at("Water is your friend"), txt: "WATER IS YOUR FRIEND", col: COL.ice }]} out={at("Trick number four") - 0.05} y={900} size={84} />);
    // ---------- truco 4 ----------
    P(<StepTitle key="s4" t={t} at={at("Trick number four")} n={4} name="HEADSPACE" out={at("between the food") - 0.2} />);
    if (inB(t, "W:jar:fill")) { const q = pin(t, "W:jar:fill", PT.head); P(<Tag key="hs" t={t} at={at("empty room")} x={q.x} y={q.y} dx={300} dy={-120} text="HEADSPACE" col={COL.amber} out={335.8} />); }
    P(<TimeBars key="hsb" t={t} rows={[{ at: at("quarter of an inch"), label: "JAM · JELLY", val: "¼ INCH", frac: 0.5, col: COL.amber }, { at: at("half an inch", 340), label: "FRUIT · TOMATOES · PICKLES", val: "½ INCH", frac: 1, col: COL.amber }]} out={at("I use this") - 0.05} />);
    P(<Stamp key="thb" t={t} at={at("first crease")} text="TIP → 1ST CREASE ≈ ½″" x={1330} y={260} size={74} out={356.5} />);
    if (inB(t, "W:jar:over")) { const q = pin(t, "W:jar:over", PT.rim); P(<Tag key="ov" t={t} at={at("bubbles right up")} x={q.x} y={q.y} dx={320} dy={-140} text="FOOD ON THE SEAL" col={COL.red} out={367.3} />); }
    P(<Versus key="hs2" t={t} at={at("that jar will not seal") - 0.2} out={383.8} title="HEADSPACE" L={{ label: "TOO LITTLE", val: "NO SEAL", h: 0.4, col: COL.red, mark: "x" }} R={{ label: "TOO MUCH", val: "BROWN · NO PULL", h: 0.8, col: COL.red, mark: "x" }} />);
    P(<Words key="hh" t={t} items={[{ at: at("Half an inch, honey"), txt: "½ INCH. NOT MORE, NOT LESS.", col: COL.amber }]} out={at("Trick number five") - 0.05} y={900} size={76} />);
    // ---------- truco 5 ----------
    P(<StepTitle key="s5" t={t} at={at("Trick number five")} n={5} name="CHASE THE BUBBLES · WIPE THE RIM" out={399.9} />);
    P(<Words key="ap" t={t} items={[{ at: at("pockets of air"), txt: "TRAPPED AIR", col: COL.ice }]} out={404.8} y={160} size={96} />);
    P(<Words key="lv" t={t} items={[{ at: at("level drops"), txt: "THE LEVEL DROPS → TOP IT OFF" }]} out={at("Then wipe the rim") - 0.05} y={900} size={74} />);
    P(<Chips key="rim" t={t} at={at("One seed")} items={["ONE SEED", "ONE DRIP", "ONE BIT OF SKIN"]} out={439.3} y={880} />);
    P(<Stamp key="vin" t={t} at={at("vinegar")} text="FAT OR SALT → VINEGAR" x={1330} y={260} size={80} out={at("this takes") - 0.05} />);
    P(<Timer key="5s" t={t} at={at("five seconds a jar")} out={449.8} secs={5} label="PER JAR" />);
    P(<Versus key="sf" t={t} at={at("difference between")} out={454.6} L={{ label: "WIPED", val: "SEAL", h: 0.7, col: "#9df0b4", mark: "ok" }} R={{ label: "SKIPPED", val: "FRIDGE", h: 0.45, col: COL.red, mark: "x" }} />);
    // ---------- truco 6 ----------
    P(<StepTitle key="s6" t={t} at={at("number six")} n={6} name="FINGERTIP TIGHT. NOT ONE BIT MORE." out={at("Here's what's happening") - 0.1} />);
    if (inB(t, "W:jar:air")) { const q = pin(t, "W:jar:air", PT.lid); P(<Tag key="ai" t={t} at={at("pushes up past")} x={q.x} y={q.y} dx={330} dy={-120} text="AIR GETS OUT" col={COL.ice} out={472.0} />); }
    if (inB(t, "W:jar:pop")) { const q = pin(t, "W:jar:pop", PT.lid), a = startOf("W:jar:pop"); P(<Tag key="vac" t={t} at={at("That's your vacuum")} x={q.x} y={q.y} dx={-330} dy={-140} text="VACUUM = YOUR SEAL" col={COL.amber} out={482.8} />); P(<Stamp key="pop1" t={t} at={a + 2.05} text="POP!" x={q.x + 260} y={q.y - 160} size={120} rot={-8} out={a + 3.6} />); }
    if (inB(t, "W:jar:tight")) { const q = pin(t, "W:jar:tight", PT.lid); P(<Tag key="bd" t={t} at={at("bends the lid")} x={q.x} y={q.y} dx={320} dy={-140} text="NO WAY OUT → LID BENDS" col={COL.red} out={497.6} />); }
    P(<Stamp key="wal" t={t} at={at("Walter")} text="“WALTER, GO MILK SOMETHING.”" x={1200} y={260} size={70} rot={-5} out={at("and the lids") - 0.05} />);
    P(<Chips key="lids" t={t} at={at("new flat lids")} items={["FLAT LIDS: NEW EVERY TIME", "RINGS: 20 YEARS", "JARS: 20 YEARS"]} out={518.2} y={880} />);
    P(<Words key="once" t={t} items={[{ at: at("seals well once"), txt: "THE RED RING SEALS ONCE", col: COL.red }]} out={at("and you don't have") - 0.05} y={900} size={76} />);
    P(<Stamp key="nob" t={t} at={at("don't have to boil")} text="NO NEED TO BOIL LIDS" x={1330} y={270} size={82} out={529.4} />);
    // ---------- truco 7 ----------
    P(<StepTitle key="s7" t={t} at={at("Trick number seven")} n={7} name="THE CLOCK STARTS AT THE BOIL" out={546.0} />);
    P(<Words key="rk" t={t} items={[{ at: at("on the rack"), txt: "ON THE RACK — NEVER THE BOTTOM" }]} out={551.6} y={900} size={70} />);
    if (inB(t, "W:canner:load|2")) { const q = pin(t, "W:canner:load|2", PT.canWater); P(<Tag key="1in" t={t} at={at("cover the lids")} x={q.x} y={q.y} dx={300} dy={-150} text="1–2″ OVER THE LIDS" col={COL.ice} out={at("If it's low") - 0.05} />); }
    P(<Words key="kt" t={t} items={[{ at: at("from the kettle"), txt: "ADD HOT WATER — NEVER COLD", col: COL.amber }]} out={564.0} y={900} size={70} />);
    P(<Words key="tm" t={t} items={[{ at: at("do not start your timer"), txt: "✗ WHEN THE JARS GO IN" }, { at: at("few little bubbles"), txt: "✗ AT A FEW BUBBLES" }, { at: at("full, rolling boil"), txt: "✓ FULL ROLLING BOIL", col: "#9df0b4" }]} out={579.0} y={900} size={70} />);
    P(<Timer key="tmr" t={t} at={at("set the timer")} out={at("If the boil stops") - 0.05} secs={25} label="MINUTES · AT THE BOIL" />);
    P(<Stamp key="zero" t={t} at={at("start your time over")} text="BOIL STOPS = START OVER" x={1300} y={270} size={78} out={at("Pints of peaches") - 0.05} />);
    P(<TimeBars key="tt" t={t} rows={[{ at: at("Pints of peaches"), label: "PEACHES · PINTS", val: "25 MIN", frac: 0.55, col: COL.amber }, { at: at("crushed tomatoes"), label: "CRUSHED TOMATOES · QUARTS", val: "45 MIN", frac: 1, col: COL.red }]} out={at("Always look up") + 2.5} />);
    P(<Stamp key="aunt" t={t} at={at("not from your aunt")} text="TESTED RECIPE ONLY" x={1330} y={260} size={84} out={at("Trick number eight") - 0.05} />);
    // ---------- truco 8 ----------
    P(<StepTitle key="s8" t={t} at={at("Trick number eight")} n={8} name="WHERE YOU LIVE CHANGES THE TIME" out={613.0} />);
    P(<BigNum key="sea" t={t} at={at("At sea level")} text="212°F" x={460} y={300} size={150} col={COL.amber} sub="SEA LEVEL" out={626.9} />);
    P(<BigNum key="mtn" t={t} at={at("202")} text="202°F" x={1460} y={300} size={150} col={COL.ice} sub="UP IN THE MOUNTAINS" out={626.9} />);
    P(<TimeBars key="alt" t={t} rows={[
      { at: at("add 5"), label: "1,000–3,000 FT", val: "+5 MIN", frac: 0.25, col: COL.ice },
      { at: at("add 10"), label: "3,000–6,000 FT", val: "+10 MIN", frac: 0.5, col: COL.ice },
      { at: at("add 15"), label: "6,000–8,000 FT", val: "+15 MIN", frac: 0.75, col: COL.amber },
      { at: at("add 20"), label: "ABOVE 8,000 FT", val: "+20 MIN", frac: 1, col: COL.red }]} out={at("my sister") + 0.5} />);
    P(<BigNum key="col" t={t} at={at("Colorado")} text="5,000 FT" x={1450} y={300} size={140} col={COL.ice} sub="HER SISTER · COLORADO" out={at("10 more") - 0.05} />);
    P(<BigNum key="10m" t={t} at={at("10 more")} text="+10 MIN" x={960} y={420} size={190} col={COL.amber} sub="THAT'S ALL IT WAS" out={at("trick number nine") - 0.05} />);
    // ---------- truco 9 ----------
    P(<StepTitle key="s9" t={t} at={at("trick number nine")} n={9} name="5 MINUTES, THEN STRAIGHT UP" out={at("when the timer rings") - 0.05} />);
    P(<Timer key="w5" t={t} at={at("wait five minutes")} out={680.0} secs={5} label="MINUTES · LID OFF, HEAT OFF" />);
    P(<Words key="sy" t={t} items={[{ at: at("blow out under"), txt: "SYRUP BLOWS OUT = LOST SEAL", col: COL.red }]} out={at("after five minutes lift") - 0.05} y={900} size={74} />);
    P(<Stamp key="su" t={t} at={at("straight up don't")} text="STRAIGHT UP" x={1350} y={260} size={100} out={at("set it on") - 0.05} />);
    P(<CheckList key="cool" t={t} title="COOLING" rows={[{ at: at("folded towel"), txt: "FOLDED TOWEL" }, { at: at("inch or two"), txt: "1–2″ APART" }, { at: at("out of a draft"), txt: "NO DRAFT" }, { at: at("touch them not"), txt: "HANDS OFF 12–24 H" }]} out={at("you'll hear it") - 0.05} />);
    P(<Words key="pp" t={t} items={[{ at: at("pop pop"), txt: "POP… POP… POP…", col: COL.amber }]} out={at("when I was young") + 0.6} y={900} size={96} />);
    // ---------- truco 10 ----------
    P(<StepTitle key="s10" t={t} at={at("trick number 10")} n={10} name="CHECK EVERY SEAL · RINGS OFF" out={at("the next morning") + 1.4} />);
    P(<Words key="fgt" t={t} items={[{ at: at("press the middle") + 1.35, txt: "THE FINGER TEST", col: "#9df0b4" }]} out={at("it's down and") - 0.1} y={160} size={96} />);
    P(<Versus key="seal" t={t} at={at("it's down and")} out={at("That's not a failure") - 0.05} L={{ label: "DOWN, DOESN'T MOVE", val: "SEALED", h: 0.75, col: "#9df0b4", mark: "ok" }} R={{ label: "FLEXES & CLICKS", val: "FRIDGE", h: 0.45, col: COL.red, mark: "x" }} />);
    P(<Words key="bf" t={t} items={[{ at: at("That's breakfast"), txt: "THAT'S BREAKFAST.", col: COL.amber }]} out={756.1} y={900} size={96} />);
    P(<Words key="why" t={t} items={[{ at: at("pops right up"), txt: "RING OFF → A BAD LID SHOWS" }, { at: at("fool you"), txt: "RING ON → IT FOOLS YOU", col: COL.red }]} out={774.6} y={900} size={72} />);
    P(<Thermo key="th" t={t} at={at("between 50 and 70")} x={1500} y={480} from={50} to={70} out={at("eat them within") + 1.5} />);
    P(<Chips key="st" t={t} at={at("cool and dark")} items={["COOL", "DARK", "50–70°F", "EAT WITHIN A YEAR"]} out={792.0} y={880} />);
    // ---------- 3 errores ----------
    P(<MistakesDeal key="md" t={t} at={at("three mistakes")} out={at("mistake one") - 0.05} title="MY 3 MISTAKES" n={3} />);
    P(<Mistake key="m1" t={t} at={at("mistake one")} n={1} txt="OPEN KETTLE CANNING" out={at("open kettle") + 3.0} />);
    P(<Words key="mo" t={t} items={[{ at: at("mold can grow"), txt: "MOLD UNDER THE SEAL", col: COL.red }]} out={823.0} y={900} size={80} />);
    P(<Mistake key="m2" t={t} at={at("paraffin")} n={2} txt="PARAFFIN WAX ON JAM" out={at("Lids and a water") - 0.05} />);
    P(<Mistake key="m3" t={t} at={at("Mistake three")} n={3} txt="TIGHTENING RINGS AFTER" out={at("Leave it alone") + 1.2} />);
    P(<Chips key="bad" t={t} at={at("lid is bulging")} items={["BULGING LID", "SPURTS OUT", "SMELLS WRONG", "MOLD"]} out={at("Don't taste it") - 0.05} y={880} />);
    P(<Stamp key="dt" t={t} at={at("Don't taste it")} text="DON'T TASTE IT" x={1330} y={270} size={96} out={at("Put it in a bag") - 0.05} />);
    P(<Words key="wid" t={t} items={[{ at: at("When in doubt"), txt: "WHEN IN DOUBT, THROW IT OUT.", col: COL.amber }]} out={873.6} y={900} size={84} />);
    P(<Words key="worth" t={t} items={[{ at: at("worth more"), txt: "YOU'RE WORTH MORE THAN THAT." }]} out={at("Now, 500") - 0.05} y={900} size={80} />);
    // ---------- el sistema de los 500 ----------
    P(<BigNum key="500b" t={t} at={at("Now, 500")} text="500" x={1450} y={300} size={210} col={COL.amber} sub="JARS · ONE WOMAN · ONE SUMMER" out={887.1} />);
    P(<Words key="sys" t={t} items={[{ at: at("It's a system"), txt: "IT'S A SYSTEM.", col: COL.amber }]} out={at("First, I never") - 0.05} y={900} size={96} />);
    P(<Words key="eq" t={t} items={[{ at: at("Three canner loads"), txt: "3 LOADS A DAY" }, { at: at("25 jars"), txt: "≈ 25 JARS A DAY", col: COL.amber }, { at: at("20 days"), txt: "× 20 DAYS = 500", col: "#9df0b4" }]} out={at("Every week") + 1.0} y={160} size={84} />);
    P(<Chips key="line" t={t} at={at("left to right")} items={["WASH & CUT", "HOT JARS", "FUNNEL · BUBBLES · RIM", "CANNER", "TOWELS"]} out={at("goes backwards") + 0.8} y={880} />);
    P(<Words key="nx" t={t} items={[{ at: at("start the next"), txt: "FILL THE NEXT LOAD DURING THE BOIL", col: COL.amber }]} out={951.0} y={900} size={68} />);
    P(<Stamp key="nb" t={t} at={at("Fifty years of notebooks")} text="50 YEARS OF NOTEBOOKS" x={1330} y={260} size={80} out={966.9} />);
    P(<Versus key="pr" t={t} at={at("the arithmetic")} out={990.4} title="ONE QUART OF PEACHES" L={{ label: "STORE", val: "$3–4", h: 0.9, col: COL.red, mark: "x" }} R={{ label: "ELENA'S", val: "30¢ LID", h: 0.15, col: "#9df0b4", mark: "ok" }} />);
    P(<Tag key="1980" t={t} at={at("since 1980")} x={960} y={600} dx={-330} dy={-200} text="SAME JAR SINCE 1980" col={COL.ink} out={at("when the ice storm") - 0.05} />);
    P(<BigNum key="11" t={t} at={at("11 days")} text="11 DAYS" x={1450} y={300} size={160} col={COL.ice} sub="NO POWER · ICE STORM" out={at("We ate like") + 1.2} />);
    P(<Words key="kg" t={t} items={[{ at: at("store once"), txt: "NOT ONE TRIP TO THE STORE" }]} out={1003.4} y={900} size={76} />);
    // ---------- tarea + cierre ----------
    P(<CheckList key="hw" t={t} title="YOUR HOMEWORK" rows={[{ at: at("Keep your jars hot"), txt: "HOT JARS IN THE WATER" }, { at: at("start your timer only"), txt: "TIMER ONLY AT THE FULL BOIL" }]} out={1018.8} />);
    P(<Words key="sub" t={t} items={[{ at: at("subscribe"), txt: "SUBSCRIBE" }, { at: at("ring that little bell"), txt: "+ RING THE BELL", col: COL.amber }]} out={at("Next week") - 0.05} y={900} size={84} />);
    P(<NextCard key="nw" t={t} at={at("Next week")} subAt={at("beef stew")} out={at("And tell me") - 0.05} title="NEXT CANNING DAY"><div style={{ fontSize: 58 }}>PRESSURE-CANNED BEEF STEW</div></NextCard>);
    P(<Words key="q" t={t} items={[{ at: at("And tell me"), txt: "THE CANNING MISTAKE", col: COL.amber }, { at: at("nobody in your family"), txt: "NOBODY IN YOUR FAMILY KNOWS?" }]} out={1041.5} y={160} size={76} />);
    P(<Words key="mine" t={t} items={[{ at: at("Forty jars"), txt: "HERS: 40 JARS OF PEACHES" }, { at: at("your turn"), txt: "YOUR TURN ↓", col: COL.amber }]} out={TEND} y={900} size={80} />);
    return L;
  },
});

export const Full: React.FC = () => {
  useCurrentFrame();
  return <AbsoluteFill style={{ background: "#05070b" }}><M.Body /></AbsoluteFill>;
};
export const clipPlan = M.clipPlan;
export const beatTable = M.beatTable;
