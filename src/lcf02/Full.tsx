// lcf02 · el video ENTERO, vara gary01: una base por frase —Loretta en cámara / su toma haciendo lo que cuenta (LTX) /
// su mundo 3D (la cocina para uno, el molde de 12 con las cenas, el horno, la silla de Harold)— y CERO cortes secos.
// Orden y anclas de las bases: beats.json (D:/rtmp_lcf02/mk_beats.py). Piezas 2.5D clavadas a la palabra con at().
// Audio fuera de Remotion (mezcla). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { LorettaWorld, sceneOf, screenOf, camSpeed, PT, V3 } from "./tin3d";
import { BigNum, COL, Chips, LowerThird, Tag, setSlug } from "../kits/yanqui3d/lib";
import { makeVideo, Stamp, Beat, Tr } from "../kits/yanqui3d/engine";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { CheckList, Mistake, MistakesDeal, StepTitle, TimeBars, Timer, Versus, Words } from "../kits/yanqui3d/pieces";
import CAPS from "./caps.json";
import AVW from "./avw.json";
import AVAIL from "./avail.json";
import BJ from "./beats.json";

setSlug("lcf02");
export const TEND = BJ.TEND;
export const FULL_FRAMES = Math.ceil(TEND * 30);
type BB = { a: number; k: string; tr: Tr };
const BEATS = BJ.beats as BB[];
const startOf = (k: string) => BEATS.find((b) => b.k === k)!.a;
const GREEN = "#9df0b4";
// las piezas grandes nunca tapan a Loretta: si entra una ventana del avatar antes de su salida, salen justo antes
const AVS = (AVW as number[][]).map((w) => w[0]);
const cut = (out: number) => { const w = AVS.find((ms) => ms < out && ms > out - 9.5); return w === undefined ? out : Math.min(out, w - 0.1); };

// el mundo con blur de movimiento real (sólo el mundo, nunca el avatar)
const World: React.FC<{ t: number; name: string; a: number }> = ({ t, name, a }) => {
  const u = t - a, v0 = camSpeed(name, u), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><LorettaWorld t={t} sc={sceneOf(name, u)} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
const pin = (t: number, k: string, q: V3) => { const a = startOf(k); return screenOf(k.slice(2), t - a, q, t); };
const inB = (t: number, k: string) => { const i = BEATS.findIndex((b) => b.k === k); return t >= BEATS[i].a && t < (BEATS[i + 1]?.a ?? TEND); };

const M = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: AVAIL as { clips: string[]; imgs: string[] }, T0: 0, TEND, flashAtStart: false,
  beats: ({ AV, CL }) => BEATS.map((b): Beat => {
    // cámara a mano (vara 23-oct): avatar y tomas envueltos en CamaraMano; el mundo la lleva en su cámara 3D (nunca dos capas)
    const mano = (x: Beat): Beat => ({ ...x, r: (t) => <CamaraMano seed={2}>{x.r(t)}</CamaraMano> });
    if (b.k === "AV") return mano({ ...AV(b.a, b.tr), a: b.a });
    if (b.k.startsWith("W:")) return { a: b.a, tr: b.tr, p: [960, 470], r: (t) => <World t={t} name={b.k.slice(2)} a={b.a} /> };
    return mano(CL(b.a, b.k, b.tr, [960, 470], [1.0, 1.06]));
  }),
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    const P = (n: React.ReactNode) => L.push(n);
    const W1 = (key: string, a: number, txt: string, col?: string, d = 3.4, size = 80) => P(<Words key={key} t={t} items={[{ at: a, txt, col }]} out={a + d} y={900} size={size} />);
    const PIN = (key: string, k: string, q: V3, a: number, text: string, col: string, d = 3.5, dx = 300, dy = -150) => {
      if (inB(t, k)) { const s = pin(t, k, q); P(<Tag key={key} t={t} at={a} x={s.x} y={s.y} dx={dx} dy={dy} text={text} col={col} size={36} out={a + d} />); }
    };
    // ---------- gancho ----------
    W1("fan", at("oven fan", 3), "THE ONLY SOUND: THE OVEN FAN", undefined, 3.2, 70);
    W1("bub", at("still bubbling", 18), "STILL BUBBLING", COL.amber, 3.0, 96);
    P(<BigNum key="one" t={t} at={at("Exactly one", 37)} text="1" x={1460} y={300} size={230} col={COL.amber} sub="SUPPER. EXACTLY ONE." out={cut(at("Exactly one", 37) + 3.6)} />);
    P(<Stamp key="nts" t={t} at={at("nothing to scrub", 37)} text="NOTHING TO SCRUB" x={960} y={250} size={96} out={cut(at("nothing to scrub", 37) + 3.2)} />);
    W1("crk", at("crackers over the sink", 53), "A WHOLE YEAR OF CRACKERS OVER THE SINK", COL.red, 3.6, 70);
    P(<BigNum key="10" t={t} at={at("Ten forgotten", 53)} text="10" x={1460} y={300} size={230} col={COL.amber} sub="FORGOTTEN CHURCH SUPPERS" out={cut(at("Ten forgotten", 53) + 4.2)} />);
    P(<BigNum key="1d" t={t} at={at("under a dollar", 70)} text="UNDER $1" x={1440} y={300} size={150} col={COL.amber} sub="A CUP" out={cut(at("under a dollar", 70) + 3.4)} />);
    W1("2c", at("two cups is", 70), "2 CUPS = A REAL SUPPER", undefined, 3.0, 84);
    P(<Stamp key="n9" t={t} at={at("to number nine", 70)} text="WAIT FOR #9" x={960} y={250} size={100} out={cut(at("to number nine", 70) + 3.4)} />);
    W1("scr", at("Spend half an hour", 85), "30 MINUTES SCRUBBING BAKED-ON CHEESE", COL.red, 4.2, 70);
    P(<LowerThird key="lt" t={t} at={at("I'm Loretta", 99)} out={at("I'm Loretta", 99) + 6.5} name="LORETTA" l2="81 · 60 YEARS IN THE CHURCH BASEMENT KITCHEN · IOWA" l2at={at("I'm Loretta", 99) + 0.4} />);
    P(<Chips key="fw" t={t} at={at("Funerals", 99)} items={["FUNERALS", "WEDDINGS"]} out={cut(at("Funerals", 99) + 4)} y={880} />);
    P(<BigNum key="5pm" t={t} at={at("It's five", 116)} text="5:00 PM" x={1440} y={300} size={170} col={COL.amber} sub="EVERY SINGLE DAY" out={cut(at("It's five", 116) + 4.6)} />);
    W1("mom", at("my mother's old", 133), "MY MOTHER'S OLD MUFFIN TIN", COL.amber, 3.6, 80);
    PIN("har", "W:chair", PT.chair, at("Harold's chair", 149), "HAROLD'S CHAIR", COL.ink, 3.6);
    PIN("crs", "W:cloth", PT.cross, at("little cross", 149), "THE LITTLE CROSS · CHURCH BASEMENT", COL.amber, 3.6, -320);
    P(<Stamp key="sfo" t={t} at={at("It's called", 167)} text="SUPPER FOR ONE" x={960} y={250} size={100} out={cut(at("It's called", 167) + 3.6)} />);
    W1("p41", at("12 suppers in", 181), "PAGE 41 · 12 SUPPERS IN 1 HOUR", COL.amber, 4.0, 76);
    W1("cta", at("The link is in", 199), "LINK IN THE 1ST LINE OF THE DESCRIPTION", COL.amber, 4.6, 70);
    // ---------- lo que hace falta + las 3 reglas ----------
    P(<CheckList key="kit" t={t} title="THE WHOLE KITCHEN" rows={[{ at: at("paper liners", 232) - 0.5, txt: "1 REGULAR 12-CUP TIN" }, { at: at("paper liners", 232), txt: "PLAIN PAPER LINERS" }, { at: at("gallon freezer bag", 232), txt: "GALLON FREEZER BAG" }, { at: at("and a marker", 232), txt: "A MARKER" }]} out={cut(at("three rules", 232) - 0.05)} />);
    P(<Chips key="tin1" t={t} at={at("One regular", 216)} items={["1 REGULAR 12-CUP MUFFIN TIN", "OLD AND DARK = EVEN BETTER"]} out={cut(at("One regular", 216) + 8)} y={880} />);
    P(<Stamp key="3r" t={t} at={at("three rules", 232)} text="3 RULES · NOTHING TO SCRUB" x={960} y={250} size={84} out={cut(at("three rules", 232) + 3.6)} />);
    PIN("gtop", "W:grease", PT.tinEdge, at("grease the flat top", 250), "GREASE THE FLAT TOP TOO", COL.amber, 4.0);
    W1("forg", at("Everybody forgets the top", 250), "EVERYBODY FORGETS THE TOP", COL.red, 3.2, 84);
    PIN("glue", "W:over|1", PT.tinEdge, at("That's where the cheese", 250), "BAKES ON LIKE GLUE", COL.red, 3.4);
    W1("r2", at("Rule 2", 250), "RULE 2 · THREE QUARTERS FULL", COL.amber, 4.0, 80);
    PIN("full", "W:fill:full", PT.cup(6), startOf("W:fill:full") + 1.2, "FULL = IT SPILLS OVER", COL.red, 3.4);
    W1("r3", at("Rule 3", 266), "RULE 3 · LET THEM REST", COL.amber, 3.0, 84);
    P(<Timer key="t10" t={t} at={at("let the cups rest", 266)} out={cut(at("let the cups rest", 266) + 4.6)} secs={10} label="MINUTES · THEN LIFT" />);
    W1("soap", at("you fill the empty tin", 283), "EMPTY TIN → HOT SOAPY WATER", COL.ice, 4.0, 80);
    P(<Chips key="pst" t={t} at={at("A paste of baking soda", 302)} items={["BAKING SODA", "A LITTLE WATER", "OVERNIGHT"]} out={cut(at("A paste of baking soda", 302) + 6.5)} y={880} />);
    P(<Versus key="lin" t={t} at={at("paper sticks to eggs", 316)} out={cut(at("paper sticks to eggs", 316) + 5.5)} title="PAPER LINERS" L={{ label: "MEAT · CORNBREAD", val: "YES", h: 0.7, col: GREEN, mark: "ok" }} R={{ label: "EGGS", val: "NO PAPER", h: 0.5, col: COL.red, mark: "x" }} />);
    W1("thu", at("by Thursday", 334), "BY THURSDAY IT GOES IN THE TRASH", COL.red, 3.4, 76);
    PIN("nd", "W:bag|1", PT.bag, at("Not leftovers", 350) - 0.2, "NAME + DATE ON THE BAG", COL.amber, 3.4);
    W1("nl", at("Not leftovers", 350), "NOT LEFTOVERS.", undefined, 3.0, 96);
    P(<BigNum key="2m" t={t} at={at("two minutes in the microwave", 364)} text="2 MIN" x={1460} y={300} size={170} col={COL.ice} sub="SUPPER ON THE TABLE" out={cut(at("two minutes in the microwave", 364) + 3.6)} />);
    P(<TimeBars key="rh" t={t} rows={[{ at: at("paper towel keeps", 381), label: "MICROWAVE · DAMP PAPER TOWEL", val: "2 MIN", frac: 0.25, col: COL.ice }, { at: at("15 minutes in a 350", 381), label: "350°F OVEN · ON FOIL", val: "15 MIN", frac: 1, col: COL.amber }]} out={cut(at("15 minutes in a 350", 381) + 4.5)} />);
    // ---------- cena 1 ----------
    P(<StepTitle key="s1" t={t} at={at("Supper number one", 396)} n={1} name="12 LITTLE MEATLOAVES" out={cut(at("Supper number one", 396) + 2.8)} />);
    P(<Versus key="ml" t={t} at={at("big meatloaf takes", 413)} out={cut(at("big meatloaf takes", 413) + 6.5)} title="MEATLOAF" L={{ label: "ONE BIG ONE", val: "1 H 15 MIN", h: 0.9, col: COL.red, mark: "x" }} R={{ label: "ONE LITTLE CUP", val: "25 MIN", h: 0.35, col: COL.amber, mark: "ok" }} />);
    P(<Chips key="mli" t={t} at={at("One cup of quick oats", 432)} items={["1 CUP QUICK OATS", "2 EGGS", "½ CUP MILK", "½ ONION", "SALT + PEPPER"]} out={cut(at("Turn your oven", 432) - 0.05)} y={880} />);
    P(<BigNum key="375a" t={t} at={at("Turn your oven to 375", 432)} text="375°F" x={1460} y={300} size={170} col={COL.amber} out={cut(at("Turn your oven to 375", 432) + 3.4)} />);
    W1("nos", at("not one second more", 448), "MIX IT. NOT ONE SECOND MORE.", COL.red, 3.2, 78);
    P(<BigNum key="25a" t={t} at={at("Bake 25 to 30", 467)} text="25–30 MIN" x={1440} y={300} size={140} col={COL.amber} out={cut(at("Bake 25 to 30", 467) + 3.4)} />);
    W1("u2", at("under two dollars", 482), "A WHOLE SUPPER · UNDER $2", GREEN, 3.4, 80);
    // ---------- cena 2 ----------
    P(<StepTitle key="s2" t={t} at={at("Supper number two", 515)} n={2} name="LITTLE SHEPHERD'S PIES" out={cut(at("Supper number two", 515) + 2.8)} />);
    P(<BigNum key="400" t={t} at={at("Oven to 400", 546)} text="400°F" x={1460} y={300} size={170} col={COL.amber} out={cut(at("Oven to 400", 546) + 3.2)} />);
    W1("rid", at("The ridges are", 579), "FORK RIDGES = CRISPY TIPS", COL.amber, 3.4, 80);
    P(<Timer key="t10b" t={t} at={at("Let them rest 10", 579)} out={cut(at("Let them rest 10", 579) + 4)} secs={10} label="MINUTES · REST" />);
    // ---------- cena 3 ----------
    P(<StepTitle key="s3" t={t} at={at("Supper number three", 615)} n={3} name="CHICKEN POT PIE IN A BISCUIT CUP" out={cut(at("Supper number three", 615) + 2.8)} />);
    P(<Chips key="bis" t={t} at={at("refrigerated biscuits", 632)} items={["1 CAN OF BISCUITS · 8", "¾ CUP COOKED CHICKEN"]} out={cut(at("refrigerated biscuits", 632) + 5)} y={880} />);
    W1("hot", at("The filling has to be hot", 666), "THE FILLING GOES IN HOT", COL.red, 4.0, 84);
    P(<BigNum key="60a" t={t} at={at("about 60 cents", 682)} text="60¢" x={1460} y={300} size={200} col={COL.amber} sub="EACH" out={cut(at("about 60 cents", 682) + 3.4)} />);
    // ---------- cena 4 ----------
    P(<StepTitle key="s4" t={t} at={at("Supper number four", 699)} n={4} name="CRISPY-EDGED MAC AND CHEESE" out={cut(at("Supper number four", 699) + 2.8)} />);
    P(<Chips key="mac" t={t} at={at("2 cups of elbow", 731)} items={["2 CUPS ELBOWS", "2 TBSP BUTTER", "2 TBSP FLOUR", "1½ CUPS MILK", "2 CUPS CHEDDAR"]} out={cut(at("2 cups of elbow", 731) + 7)} y={880} />);
    P(<Stamp key="egg" t={t} at={at("skip it", 764)} text="DON'T SKIP THE EGG" x={960} y={250} size={90} out={cut(at("skip it", 764) + 3.6)} />);
    W1("soup", at("Without the egg", 764), "NO EGG = MAC AND CHEESE SOUP", COL.red, 3.4, 78);
    P(<Timer key="t10c" t={t} at={at("The cheese sets", 782)} out={cut(at("The cheese sets", 782) + 3.6)} secs={10} label="MINUTES · THE CHEESE SETS" />);
    P(<BigNum key="50a" t={t} at={at("50 cents each", 782)} text="50¢" x={460} y={300} size={200} col={COL.amber} sub="EACH" out={cut(at("50 cents each", 782) + 3.4)} />);
    // ---------- cena 5 ----------
    P(<StepTitle key="s5" t={t} at={at("Supper number five", 815)} n={5} name="TATER TOT HOT DISH CUPS" out={cut(at("Supper number five", 815) + 2.8)} />);
    W1("hd", at("a hot dish is a casserole", 815), "HOT DISH = A CASSEROLE", undefined, 3.4, 84);
    P(<Stamp key="tots" t={t} at={at("Stand the tots up", 845)} text="STAND THE TOTS UP" x={960} y={250} size={92} out={cut(at("Stand the tots up", 845) + 3.6)} />);
    P(<BigNum key="11" t={t} at={at("11 tater tot", 894)} text="11" x={1460} y={300} size={220} col={COL.amber} sub="HOT DISHES ON ONE TABLE" out={cut(at("11 tater tot", 894) + 4.2)} />);
    W1("sc", at("A spoonful of sour cream", 911), "MY SECRET: A SPOONFUL OF SOUR CREAM", COL.amber, 4.0, 72);
    // ---------- cena 6 ----------
    P(<StepTitle key="s6" t={t} at={at("Supper number six", 911)} n={6} name="HAM AND CHEESE EGG MUFFINS" out={cut(at("Supper number six", 911) + 2.8)} />);
    P(<BigNum key="350" t={t} at={at("Oven to 350", 945)} text="350°F" x={1460} y={300} size={170} col={COL.amber} out={cut(at("Oven to 350", 945) + 3.2)} />);
    W1("gw", at("You grease six cups well", 963), "GREASE WELL · OR SILICONE CUPS", undefined, 3.8, 76);
    P(<Stamp key="34e" t={t} at={at("three quarters full, not", 977)} text="¾ FULL · THEY PUFF" x={960} y={250} size={92} out={cut(at("three quarters full, not", 977) + 3.6)} />);
    P(<BigNum key="30s" t={t} at={at("30 seconds", 995)} text="30 SEC" x={1460} y={300} size={160} col={COL.ice} sub="FROM THE FREEZER" out={cut(at("30 seconds", 995) + 3.2)} />);
    // ---------- cena 7 ----------
    P(<StepTitle key="s7" t={t} at={at("Supper number seven", 1023)} n={7} name="LITTLE TUNA NOODLE CUPS" out={cut(at("Supper number seven", 1023) + 2.8)} />);
    W1("lem", at("A teaspoon of lemon", 1060), "+ 1 TSP LEMON JUICE", COL.amber, 3.4, 90);
    P(<BigNum key="18" t={t} at={at("bake about 18 minutes", 1076)} text="18 MIN" x={1460} y={300} size={170} col={COL.amber} out={cut(at("bake about 18 minutes", 1076) + 3.2)} />);
    // ---------- cena 8 ----------
    P(<StepTitle key="s8" t={t} at={at("Supper number eight", 1108)} n={8} name="STUFFED PEPPER CUPS" out={cut(at("Supper number eight", 1108) + 2.8)} />);
    W1("sits", at("just sits there", 1156), "IT STANDS UP ON ITS OWN", GREEN, 3.2, 84);
    P(<BigNum key="55" t={t} at={at("about 55 cents", 1172)} text="55¢" x={1460} y={300} size={200} col={COL.amber} sub="EACH" out={cut(at("about 55 cents", 1172) + 3.4)} />);
    // ---------- cena 9 · el error ----------
    P(<StepTitle key="s9" t={t} at={at("Supper number nine", 1204)} n={9} name="LITTLE BAKED ZITI · THE MISTAKE" col={COL.red} out={cut(at("Supper number nine", 1204) + 2.8)} />);
    PIN("cem", "W:mess|1", PT.tinEdge, at("welded itself", 1238), "WELDED ON LIKE CEMENT", COL.red, 3.4);
    W1("fell", at("The ziti fell apart", 1238), "THE ZITI FELL APART", COL.red, 3.0, 90);
    P(<MistakesDeal key="md" t={t} at={at("It's three things together", 1255)} out={cut(at("Too full", 1255) - 0.05)} title="IT'S 3 THINGS TOGETHER" n={3} />);
    P(<Mistake key="m1" t={t} at={at("Too full", 1255)} n={1} txt="TOO FULL" out={cut(at("So here's how", 1255) - 0.05)} x={420} />);
    P(<Mistake key="m2" t={t} at={at("a bare top", 1255)} n={2} txt="A BARE TOP" out={cut(at("So here's how", 1255) - 0.05)} />);
    P(<Mistake key="m3" t={t} at={at("too hot to lift", 1255)} n={3} txt="TOO HOT TO LIFT" out={cut(at("So here's how", 1255) - 0.05)} x={1500} />);
    W1("34z", at("three quarters, no more", 1287), "¾ FULL. NO MORE.", COL.amber, 3.2, 96);
    P(<Timer key="t10d" t={t} at={at("you wait 10", 1305)} out={cut(at("you wait 10", 1305) + 4)} secs={10} label="MINUTES ON THE STOVE" />);
    P(<CheckList key="3r2" t={t} title="SAY IT WITH ME" rows={[{ at: at("3 quarters full, grease", 1339), txt: "¾ FULL" }, { at: at("grease the top, wait", 1339), txt: "GREASE THE TOP" }, { at: at("wait 10 minutes", 1339), txt: "WAIT 10 MINUTES" }]} out={cut(at("the whole secret", 1350) + 2.5)} />);
    // ---------- cena 10 + la de regalo ----------
    P(<StepTitle key="s10" t={t} at={at("Supper number 10", 1357)} n={10} name="CHURCH CHILI WITH A CORNBREAD TOP" out={cut(at("Supper number 10", 1357) + 2.8)} />);
    P(<BigNum key="cb" t={t} at={at("costs about a dollar", 1373)} text="$1" x={1460} y={300} size={200} col={COL.amber} sub="BOX OF CORNBREAD MIX" out={cut(at("costs about a dollar", 1373) + 3.6)} />);
    W1("lay", at("Spoon a little cornbread", 1390), "CORNBREAD · CHILI · CORNBREAD", COL.amber, 4.6, 78);
    P(<BigNum key="15" t={t} at={at("bake about 15 minutes", 1406)} text="15 MIN" x={1460} y={300} size={170} col={COL.amber} out={cut(at("bake about 15 minutes", 1406) + 3.2)} />);
    P(<Stamp key="b11" t={t} at={at("here's a little one", 1421)} text="+1 FOR AFTER" x={960} y={250} size={100} out={cut(at("here's a little one", 1421) + 3.6)} />);
    P(<Chips key="pie" t={t} at={at("one refrigerated pie crust", 1438)} items={["1 PIE CRUST", "1 CUP PUMPKIN", "⅓ CUP SUGAR", "1 EGG"]} out={cut(at("one refrigerated pie crust", 1438) + 6.5)} y={880} />);
    W1("wid", at("Give two to", 1471), "GIVE TWO TO THE WIDOW DOWN THE ROAD", COL.amber, 4.0, 72);
    // ---------- repaso ----------
    P(<Words key="rc1" t={t} items={[{ at: at("Number one", 1471), txt: "#1 MEATLOAVES" }, { at: at("little shepherd's pies with", 1480), txt: "#2 SHEPHERD'S PIES" }, { at: at("Number three", 1487), txt: "#3 POT PIE" }, { at: at("Number four", 1487), txt: "#4 MAC & CHEESE", col: COL.amber }]} out={at("Number four", 1487) + 4} y={900} size={58} />);
    P(<Words key="rc2" t={t} items={[{ at: at("6 the ham", 1503), txt: "#6 EGG MUFFINS" }, { at: at("Number 7", 1503), txt: "#7 TUNA NOODLE" }, { at: at("Number 8", 1503), txt: "#8 STUFFED PEPPER" }, { at: at("Number 9", 1503), txt: "#9 ZITI", col: COL.red }]} out={at("Number 9", 1503) + 3.5} y={900} size={58} />);
    P(<Stamp key="1t" t={t} at={at("10 suppers", 1521)} text="10 SUPPERS · 1 TIN" x={960} y={250} size={96} out={cut(at("10 suppers", 1521) + 4)} />);
    // ---------- el plan del freezer ----------
    W1("163", at("Page 163", 1537), "PAGE 163 · MY FREEZER PLAN", COL.amber, 3.4, 80);
    P(<BigNum key="4s" t={t} at={at("Cook 4 things", 1537)} text="4" x={1460} y={300} size={220} col={COL.amber} sub="THINGS ON SUNDAY = A MONTH" out={cut(at("Cook 4 things", 1537) + 4.2)} />);
    W1("nn", at("A bag with no name", 1569), "A BAG WITH NO NAME = A BAG IN THE TRASH", COL.red, 4.0, 68);
    // ---------- la plata ----------
    P(<Versus key="mny" t={t} at={at("The frozen dinner", 1601)} out={cut(at("that's around", 1610) - 0.05)} title="ONE SUPPER" L={{ label: "2 CUPS FROM THE TIN", val: "≈ $1", h: 0.3, col: COL.amber, mark: "ok" }} R={{ label: "FROZEN DINNER", val: "$3.50–4.50", h: 0.9, col: COL.red, mark: "x" }} />);
    P(<BigNum key="12w" t={t} at={at("that's around", 1610)} text="$12" x={460} y={300} size={200} col={GREEN} sub="A WEEK YOU KEEP" out={cut(at("that's around", 1610) + 9)} />);
    P(<BigNum key="600" t={t} at={at("more than", 1615)} text="$600+" x={1460} y={300} size={180} col={GREEN} sub="A YEAR" out={cut(at("more than", 1615) + 6)} />);
    W1("gp", at("put them on the good plate", 1632), "THE GOOD PLATE. NOT THE SINK.", COL.amber, 4.0, 80);
    // ---------- tarea + cierre ----------
    W1("try", at("try one tin", 1651), "THIS WEEK: TRY ONE TIN", COL.amber, 3.4, 84);
    P(<Stamp key="com" t={t} at={at("come down to the comments", 1651)} text="TELL ME IN THE COMMENTS" x={960} y={250} size={84} out={cut(at("come down to the comments", 1651) + 5)} />);
    W1("o2", at("Tell me what goes", 1666), "WHAT GOES IN THE OTHER TWO CUPS?", undefined, 5.0, 76);
    W1("end", at("all 140 suppers", 1680), "140 SUPPERS · LINK IN THE 1ST LINE OF THE DESCRIPTION", COL.amber, 5.5, 60);
    return L;
  },
});

export const Full: React.FC = () => {
  useCurrentFrame();
  return <AbsoluteFill style={{ background: "#05070b" }}><M.Body /></AbsoluteFill>;
};
export const clipPlan = M.clipPlan;
export const beatTable = M.beatTable;
