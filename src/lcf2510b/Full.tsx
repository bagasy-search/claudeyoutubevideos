// lcf2510b · el video ENTERO, vara gary01: una base por frase —Loretta en cámara / su toma LTX haciendo lo que cuenta /
// su mundo 3D (la mesa para uno, la sartén de 8" con la cena de turno, la tapa, el horno, la silla de Harold)— y CERO cortes secos.
// Orden y anclas de las bases: beats.json (D:/rtmp_lcf2510b/mk_beats.py). Piezas 2.5D clavadas a la palabra con at().
// Audio fuera de Remotion (mezcla). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { LorettaWorld, sceneOf, screenOf, camSpeed, PT, V3 } from "./pan3d";
import { BigNum, COL, Chips, LowerThird, Tag, setSlug } from "../kits/yanqui3d/lib";
import { makeVideo, Stamp, Beat, Tr } from "../kits/yanqui3d/engine";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { CheckList, Mistake, MistakesDeal, StepTitle, TimeBars, Timer, Versus, Words } from "../kits/yanqui3d/pieces";
import { CoolClock, OvenDial, PieBadge, PieTitle, RecipeCard, Stat, ZItem, ZocaloStack } from "./ui";
import CAPS from "./caps.json";
import AVW from "./avw.json";
import AVAIL from "./avail.json";
import BJ from "./beats.json";

setSlug("lcf2510b");
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
    // 26-oct · nivel nuevo (pedido del creador, molde ck2510d/ui.tsx): las piezas de abajo se escriben como antes y P() las
    // traduce: todo texto → ZÓCALO de noticiero abajo-izq (crema/vino/dorado, apilable); números → Stat dorado / perilla del horno;
    // listas largas y checklists → ficha de receta a la derecha; cada cena → título dorado + insignia arriba-der. Nada sobre la cara.
    const L: React.ReactNode[] = [];
    const Z: ZItem[] = [];
    const SUP: { a: number; n: number; name: string }[] = [];
    const zl = (txt: string, tone: ZItem["tone"]) => tone === "warn" ? "WATCH OUT" : tone === "note" ? "LORETTA" : /[$¢]/.test(txt) ? "WHAT IT COSTS" : "LORETTA'S TIP";
    const P = (n: React.ReactNode) => {
      if (!React.isValidElement(n)) return;
      const q = n.props as any, key = String(n.key);
      if (n.type === Words) { const it = q.items[0], tone: ZItem["tone"] = it.col === COL.red ? "warn" : it.txt.startsWith("“") ? "note" : "tip"; Z.push({ key, a: it.at, out: cut(q.out), tone, label: zl(it.txt, tone), txt: it.txt }); return; }
      if (n.type === Stamp) { Z.push({ key, a: q.at, out: q.out, tone: "tip", label: /#9|MISTAKE|STIRS/.test(q.text) ? "THE MISTAKE" : "REMEMBER THIS", txt: q.text }); return; }
      if (n.type === LowerThird) { Z.push({ key, a: q.at, out: q.out, tone: "name", label: "YOUR HOST", txt: "Loretta", sub: q.l2 }); return; }
      if (n.type === Chips) {
        const its = (q.items as string[]);
        if (its.join(" · ").length <= 40) Z.push({ key, a: q.at, out: q.out, tone: "list", label: "IN ONE LINE", txt: "", items: its.map((x, i) => ({ at: q.at + i * 0.25, txt: x })) });
        else L.push(<RecipeCard key={key} t={t} title="What You Need" rows={its.map((x, i) => ({ at: q.at + i * 0.3, txt: x }))} out={q.out} />);
        return;
      }
      if (n.type === CheckList) { L.push(<RecipeCard key={key} t={t} title={q.title} rows={q.rows} out={q.out} />); return; }
      if (n.type === TimeBars) { L.push(<RecipeCard key={key} t={t} title="The Numbers" rows={q.rows.map((r: any) => ({ at: r.at, txt: `${r.label} — ${r.val}` }))} out={q.out} />); return; }
      if (n.type === Versus) {
        const nm = (x: any) => `${x.label}: ${x.val}`;
        Z.push({ key: key + "L", a: q.at, out: q.out, tone: q.L.mark === "x" ? "warn" : "tip", label: q.title ?? "THE DIFFERENCE", txt: nm(q.L) });
        Z.push({ key: key + "R", a: q.at + 0.9, out: q.out, tone: q.R.mark === "x" ? "warn" : "tip", label: q.title ?? "THE DIFFERENCE", txt: nm(q.R) });
        return;
      }
      if (n.type === Timer) { L.push(<CoolClock key={key} t={t} at={q.at} out={q.out} label={`${q.secs} ${q.label}`} />); return; }
      if (n.type === BigNum) {
        const oven = /^(3\d\d|4\d\d)°F$/.test(q.text) && /OVEN|^$/.test(q.sub ?? "");
        L.push(oven ? <OvenDial key={key} t={t} at={q.at} out={q.out} text={q.text} sub={q.sub} /> : <Stat key={key} t={t} at={q.at} out={q.out} text={q.text} sub={q.sub} size={q.text.length > 6 ? 150 : 210} />);
        return;
      }
      if (n.type === StepTitle) { SUP.push({ a: q.at, n: q.n, name: q.name }); L.push(<PieTitle key={key} t={t} at={q.at} out={q.out} n={q.n} name={q.name} />); return; }
      L.push(n);
    };
    const W1 = (key: string, a: number, txt: string, col?: string, d = 3.4, size = 80) => P(<Words key={key} t={t} items={[{ at: a, txt, col }]} out={a + d} y={900} size={size} />);
    const PIN = (key: string, k: string, q: V3, a: number, text: string, col: string, d = 3.5, dx = 300, dy = -150) => {
      if (inB(t, k)) { const s = pin(t, k, q); P(<Tag key={key} t={t} at={a} x={s.x} y={s.y} dx={dx} dy={dy} text={text} col={col} size={36} out={a + d} />); }
    };
    // ---------- gancho ----------
    P(<BigNum key="520" t={t} at={at("20 minutes past five", 0)} text="5:20 PM" x={1340} y={300} size={170} col={COL.amber} sub="ONE LITTLE PAN" out={cut(at("20 minutes past five", 0) + 3.4)} />);
    P(<BigNum key="8in" t={t} at={at("Eight inches across", 0)} text={'8"'} x={1340} y={300} size={220} col={COL.amber} sub="BLACK ON THE BOTTOM" out={cut(at("Eight inches across", 0) + 3.6)} />);
    P(<Chips key="tbl" t={t} at={at("one fork", 14)} items={["1 PLATE", "1 FORK", "1 GLASS OF MILK", "1 NAPKIN"]} out={cut(at("one fork", 14) + 4.6)} y={880} />);
    W1("15m", at("in 15 minutes", 14), "15 MINUTES → HAMBURGER STEAK", COL.amber, 3.4, 78);
    P(<Stamp key="nts" t={t} at={at("nothing to scrub", 28)} text="NOTHING TO SCRUB" x={960} y={250} size={96} out={cut(at("nothing to scrub", 28) + 3.2)} />);
    P(<BigNum key="81" t={t} at={at("I'm 81 years old", 42)} text="81" x={1340} y={300} size={230} col={COL.amber} sub="ONE SMALL PAN" out={cut(at("I'm 81 years old", 42) + 3.6)} />);
    P(<BigNum key="10" t={t} at={at("10 of them", 42)} text="10" x={1340} y={300} size={230} col={COL.amber} sub="SUPPERS TONIGHT" out={cut(at("10 of them", 42) + 3.0)} />);
    W1("225", at("less than two dollars", 42), "EVERY ONE UNDER $2.25 A PLATE", GREEN, 4.0, 80);
    P(<Stamp key="n9" t={t} at={at("to number nine", 57)} text="WAIT FOR #9" x={960} y={250} size={100} out={cut(at("to number nine", 57) + 3.4)} />);
    W1("50y", at("I did it myself for 50 years", 57), "I DID IT FOR 50 YEARS", COL.red, 3.4, 84);
    P(<LowerThird key="lt" t={t} at={at("I'm Loretta", 71)} out={at("I'm Loretta", 71) + 6.5} name="LORETTA" l2="81 · 60 YEARS IN THE CHURCH BASEMENT KITCHEN · IOWA" l2at={at("I'm Loretta", 71) + 0.4} />);
    P(<Chips key="fw" t={t} at={at("Funeral dinners for 200", 71)} items={["FUNERAL DINNERS FOR 200", "WEDDING SUPPERS", "WEDNESDAY CHILI"]} out={cut(at("Funeral dinners for 200", 71) + 4.6)} y={880} />);
    W1("12in", at("the 12-inch one", 99), "THE 12-INCH SKILLET · ONE PORK CHOP", COL.red, 3.8, 72);
    W1("scr", at("scrubbing for 20 minutes", 114), "20 MINUTES SCRUBBING", COL.red, 3.2, 84);
    P(<BigNum key="11" t={t} at={at("eleven dollars", 128)} text="$11" x={1340} y={300} size={220} col={COL.amber} sub="A LITTLE 8-INCH SKILLET" out={cut(at("eleven dollars", 128) + 3.6)} />);
    P(<Stamp key="knows" t={t} at={at("Get a pan that knows it", 142)} text="GET A PAN THAT KNOWS IT" x={960} y={250} size={84} out={cut(at("Get a pan that knows it", 142) + 3.4)} />);
    W1("p85", at("page 85 of my", 142), "PAGE 85 · THE LITTLE SKILLET", COL.amber, 3.8, 80);
    P(<Chips key="1p" t={t} at={at("One pan, one plate", 156)} items={["1 PAN", "1 PLATE", "15 MINUTES"]} out={cut(at("One pan, one plate", 156) + 4)} y={880} />);
    P(<CheckList key="ten" t={t} title="10 SUPPERS · 1 PAN" rows={[
      { at: at("A hamburger steak with onion gravy", 170), txt: "HAMBURGER STEAK" }, { at: at("a chicken cutlet in 15", 170), txt: "CHICKEN CUTLET" },
      { at: at("my mother's fried potatoes", 170), txt: "FRIED POTATOES" }, { at: at("a fish filet in butter", 170), txt: "FISH IN BUTTER" },
      { at: at("a sloppy joe that makes", 170), txt: "SLOPPY JOE" }, { at: at("eggs and tomato", 170), txt: "EGGS IN TOMATO" },
      { at: at("smothered chicken thighs", 184), txt: "SMOTHERED THIGHS" }, { at: at("a little frittata", 184), txt: "LITTLE FRITTATA" },
      { at: at("a pot roast hash", 184), txt: "POT ROAST HASH" }, { at: at("and fried rice from", 184), txt: "FRIED RICE" },
    ]} out={cut(at("I'll tell you exactly", 184) + 2)} />);
    W1("dish", at("it's the dishes", 199), "IT'S NOT THE COOKING. IT'S THE DISHES.", COL.red, 3.8, 70);
    P(<Stamp key="wash" t={t} at={at("that's all you'll wash", 227)} text="1 PAN = ALL YOU WASH" x={960} y={250} size={90} out={cut(at("that's all you'll wash", 227) + 3)} />);
    W1("book", at("Supper for One, 140", 227), "SUPPER FOR ONE · 140 SMALL SUPPERS", COL.amber, 3.4, 74);
    W1("cta", at("The link is in the", 227), "LINK IN THE 1ST LINE OF THE DESCRIPTION", COL.amber, 4.6, 70);
    // ---------- las 3 reglas (página 85) ----------
    P(<Stamp key="3r" t={t} at={at("three things at the top", 241)} text="3 RULES · PAGE 85" x={960} y={250} size={96} out={cut(at("three things at the top", 241) + 3.6)} />);
    P(<CheckList key="rules" t={t} title="THE 3 RULES" rows={[{ at: at("First, heat the skillet", 255), txt: "1 · HEAT THE PAN FIRST" }, { at: at("Second, don't crowd it", 255), txt: "2 · DON'T CROWD IT" }, { at: at("Third, make the pan sauce", 270), txt: "3 · MAKE THE PAN SAUCE" }]} out={cut(at("Let me tell you why", 270) + 2)} />);
    P(<Timer key="t2" t={t} at={at("wait two minutes", 284)} out={cut(at("wait two minutes", 284) + 3.6)} secs={2} label="MINUTES · MEDIUM HIGH" />);
    W1("hand", at("Hold your hand flat", 284), "HAND 2 INCHES OVER IT → FEEL THE WARMTH", COL.amber, 4.4, 66);
    P(<Versus key="cold" t={t} at={at("If the meat goes into a cold pan", 299)} out={cut(at("lets go of the pan by itself", 313) + 2)} title="THE MEAT GOES INTO…" L={{ label: "A COLD PAN", val: "BOILS · GRAY", h: 0.5, col: COL.red, mark: "x" }} R={{ label: "A HOT PAN", val: "SIZZLES · BROWNS", h: 0.85, col: COL.amber, mark: "ok" }} />);
    P(<Chips key="crowd" t={t} at={at("In a big skillet", 327)} items={["BIG PAN → THE EMPTY SPACE BURNS", "CROWDED → EVERYTHING STEAMS"]} out={cut(at("In a big skillet", 327) + 5.5)} y={880} />);
    W1("flav", at("that's the flavor", 356), "BROWN BITS = THE FLAVOR", COL.amber, 3.0, 92);
    W1("broth", at("half a cup of broth", 356), "½ CUP BROTH + A WOODEN SPOON", undefined, 3.6, 78);
    P(<Stamp key="wws" t={t} at={at("washing the pan with supper", 385)} text="WASHING THE PAN WITH SUPPER" x={960} y={250} size={78} out={cut(at("washing the pan with supper", 385) + 3.4)} />);
    W1("lid", at("A glass lid is the best", 399), "A GLASS LID THAT FITS", COL.ice, 3.4, 86);
    W1("splat", at("the splatters behind the stove", 413), "NO SPLATTERS BEHIND THE STOVE", undefined, 2.8, 76);
    // ---------- cena 1 ----------
    P(<StepTitle key="s1" t={t} at={at("Supper number one", 413)} n={1} name="HAMBURGER STEAK WITH ONION GRAVY" out={cut(at("Supper number one", 413) + 2.8)} />);
    P(<BigNum key="c1" t={t} at={at("$1.60", 413)} text="$1.60" x={1340} y={300} size={190} col={COL.amber} sub="PAGE 87" out={cut(at("$1.60", 413) + 3.4)} />);
    P(<Chips key="i1" t={t} at={at("quarter pound of ground beef, half", 443)} items={["¼ LB GROUND BEEF", "½ ONION", "1 TSP FLOUR", "½ CUP BEEF BROTH", "WORCESTERSHIRE"]} out={cut(at("Shape the beef", 458) - 0.05)} y={880} />);
    P(<Timer key="t4" t={t} at={at("Brown it four minutes", 472)} out={cut(at("Brown it four minutes", 472) + 4)} secs={4} label="MINUTES · DON'T TOUCH IT" />);
    W1("poke", at("Don't poke it", 472), "DON'T POKE. DON'T PRESS. DON'T MOVE IT.", COL.red, 3.8, 70);
    W1("thin", at("Watch it go from thin", 516), "THIN → GRAVY", COL.amber, 3.0, 96);
    P(<Stamp key="dent" t={t} at={at("press a little dent", 530)} text="A THUMB DENT IN THE MIDDLE" x={960} y={250} size={80} out={cut(at("press a little dent", 530) + 3.6)} />);
    P(<BigNum key="160a" t={t} at={at("160 degrees", 544)} text="160°F" x={1340} y={300} size={180} col={COL.ice} sub="GROUND BEEF · THE MIDDLE" out={cut(at("160 degrees", 544) + 3.6)} />);
    P(<BigNum key="c1b" t={t} at={at("One dollar and sixty cents", 601)} text="$1.60" x={1340} y={300} size={190} col={GREEN} sub="THAT'S WHAT IT COST" out={cut(at("One dollar and sixty cents", 601) + 3.4)} />);
    W1("sq", at("Divide it into quarter pound", 615), "¼-LB SQUARES · FREEZE THEM FLAT", COL.ice, 4.0, 76);
    // ---------- cena 2 ----------
    P(<StepTitle key="s2" t={t} at={at("Supper number two", 629)} n={2} name="CHICKEN CUTLET IN 15 MINUTES" out={cut(at("Supper number two", 629) + 2.8)} />);
    P(<BigNum key="c2" t={t} at={at("$1.30", 643)} text="$1.30" x={1340} y={300} size={190} col={COL.amber} sub="PAGE 88" out={cut(at("$1.30", 643) + 3.2)} />);
    W1("2s", at("One chicken breast makes two", 643), "1 BREAST = 2 SUPPERS", COL.amber, 3.4, 92);
    P(<Chips key="i2" t={t} at={at("boneless chicken breast, two", 657)} items={["1 CHICKEN BREAST", "2 TBSP FLOUR", "OIL + BUTTER", "½ LEMON", "PAPRIKA"]} out={cut(at("Lay the chicken breast flat", 657) - 0.05)} y={880} />);
    W1("bk", at("like you're opening a book", 671), "CUT IT OPEN LIKE A BOOK", COL.amber, 3.4, 86);
    P(<TimeBars key="tb2" t={t} rows={[{ at: at("3 minutes on the first side", 700), label: "FIRST SIDE · GOLDEN", val: "3 MIN", frac: 0.5, col: COL.amber }, { at: at("3 minutes on the second side", 714), label: "SECOND SIDE", val: "3 MIN", frac: 0.5, col: COL.amber }]} out={cut(at("3 minutes on the second side", 714) + 3.6)} />);
    P(<Versus key="thick" t={t} at={at("A thick chicken breast", 729)} out={cut(at("A thin cutlet is done", 743) + 4)} title="CHICKEN BREAST" L={{ label: "THICK", val: "DRY · STRINGY", h: 0.85, col: COL.red, mark: "x" }} R={{ label: "THIN CUTLET", val: "6 MIN · JUICY", h: 0.4, col: COL.amber, mark: "ok" }} />);
    P(<BigNum key="165a" t={t} at={at("165 degrees", 757)} text="165°F" x={1340} y={300} size={180} col={COL.ice} sub="CHICKEN" out={cut(at("165 degrees", 757) + 3.4)} />);
    W1("agn", at("I've been cooking 60 years", 786), "“NOBODY EVER TOLD ME THAT”", COL.amber, 4.0, 80);
    W1("gb", at("frozen green beans", 814), "FROZEN GREEN BEANS · SAME PAN", GREEN, 3.6, 78);
    // ---------- cena 3 ----------
    P(<StepTitle key="s3" t={t} at={at("Supper number three", 828)} n={3} name="SKILLET FRIED POTATOES AND ONIONS" out={cut(at("Supper number three", 828) + 2.8)} />);
    P(<BigNum key="c3" t={t} at={at("40 cents", 842)} text="40¢" x={1340} y={300} size={220} col={COL.amber} sub="PAGE 89" out={cut(at("40 cents", 842) + 3.4)} />);
    P(<Stamp key="typo" t={t} at={at("That's not a typo", 842)} text="NOT A TYPO" x={960} y={250} size={110} out={cut(at("That's not a typo", 842) + 3)} />);
    P(<Chips key="i3" t={t} at={at("two cooked potatoes", 856)} items={["2 COOKED POTATOES", "½ ONION", "OIL OR BACON GREASE", "PAPRIKA"]} out={cut(at("two cooked potatoes", 856) + 6)} y={880} />);
    P(<Timer key="t5" t={t} at={at("not for five minutes", 884)} out={cut(at("not for five minutes", 884) + 4)} secs={5} label="MINUTES · DON'T TOUCH THEM" />);
    W1("egg3", at("crack an egg in the empty", 912), "+ AN EGG = A WHOLE SUPPER", GREEN, 3.4, 84);
    P(<Versus key="pot" t={t} at={at("cooked potatoes fry better", 920)} out={cut(at("boil two extra", 941) - 0.05)} title="IN THE SKILLET" L={{ label: "RAW POTATO", val: "BURNS OUTSIDE", h: 0.6, col: COL.red, mark: "x" }} R={{ label: "COLD COOKED", val: "CRISP · GOLDEN", h: 0.85, col: COL.amber, mark: "ok" }} />);
    W1("x2", at("boil two extra", 941), "BOIL 2 EXTRA = TOMORROW'S SUPPER", COL.amber, 3.6, 78);
    W1("fri", at("Friday potatoes", 984), "“FRIDAY POTATOES”", COL.amber, 3.4, 100);
    P(<TimeBars key="tb3" t={t} rows={[{ at: at("about 20 cents", 998), label: "2 POTATOES", val: "20¢", frac: 0.3, col: COL.amber }, { at: at("about 10 cents", 998), label: "½ ONION", val: "10¢", frac: 0.15, col: COL.amber }, { at: at("40 cents", 1000), label: "THE WHOLE SUPPER", val: "40¢", frac: 0.6, col: GREEN }, { at: at("it's 65", 1008), label: "+ AN EGG", val: "65¢", frac: 1, col: GREEN }]} out={cut(at("There isn't a frozen dinner", 1012) + 1.5)} />);
    W1("fd65", at("There isn't a can of soup", 1012), "NO FROZEN DINNER FOR 65¢", COL.red, 3.4, 80);
    // ---------- cena 4 ----------
    P(<StepTitle key="s4" t={t} at={at("Supper number four", 1012)} n={4} name="FISH FILLET IN BUTTER AND LEMON" out={cut(at("Supper number four", 1012) + 2.8)} />);
    P(<BigNum key="c4" t={t} at={at("$1.60", 1012)} text="$1.60" x={1340} y={300} size={190} col={COL.amber} sub="PAGE 91" out={cut(at("$1.60", 1012) + 3.2)} />);
    W1("8m", at("cooked in eight minutes", 1029), "A FROZEN FILLET · 8 MINUTES", COL.ice, 3.4, 80);
    P(<Chips key="i4" t={t} at={at("one fish fillet thawed", 1043)} items={["1 FISH FILLET", "1 TBSP FLOUR", "1 TBSP BUTTER", "½ LEMON", "PARSLEY"]} out={cut(at("one fish fillet thawed", 1043) + 7)} y={880} />);
    P(<Stamp key="dry" t={t} at={at("pat it very dry", 1071)} text="PAT IT VERY DRY" x={960} y={250} size={100} out={cut(at("pat it very dry", 1071) + 3.2)} />);
    P(<Timer key="t3" t={t} at={at("cook it three minutes without", 1086)} out={cut(at("cook it three minutes without", 1086) + 3.8)} secs={3} label="MINUTES · DON'T TOUCH IT" />);
    W1("ntop", at("not on top", 1100), "LEMON AROUND THE FISH · NOT ON TOP", COL.amber, 3.6, 72);
    W1("dry2", at("dry it with a paper towel twice", 1128), "DRY IT TWICE", COL.amber, 3.2, 100);
    P(<BigNum key="145" t={t} at={at("145 degrees", 1143)} text="145°F" x={1340} y={300} size={180} col={COL.ice} sub="FISH · IT FLAKES" out={cut(at("145 degrees", 1143) + 3.6)} />);
    P(<Versus key="burn" t={t} at={at("The butter burned black", 1171)} out={cut(at("The small pan is what makes", 1200) + 2.5)} title="SAME FISH · SAME BUTTER" L={{ label: "BIG PAN", val: "BURNED BLACK", h: 0.8, col: COL.red, mark: "x" }} R={{ label: "LITTLE PAN", val: "FOAMS · BROWNS", h: 0.6, col: COL.amber, mark: "ok" }} />);
    W1("peas", at("bag of frozen peas", 1200), "FROZEN PEAS · SAME LEMON BUTTER", GREEN, 3.6, 76);
    P(<TimeBars key="tb4" t={t} rows={[{ at: at("about a dollar ten", 1228), label: "THE FISH", val: "$1.10", frac: 0.18, col: COL.amber }, { at: at("the butter the lemon", 1228), label: "BUTTER · LEMON · FLOUR", val: "50¢", frac: 0.09, col: COL.amber }, { at: at("six dollars now", 1242), label: "DRIVE-THRU FISH SANDWICH", val: "$6", frac: 1, col: COL.red }]} out={cut(at("six dollars now", 1242) + 3.2)} />);
    // ---------- cena 5 ----------
    P(<StepTitle key="s5" t={t} at={at("supper number five", 1242)} n={5} name="SLOPPY JOE FOR ONE · MAKES 2" out={cut(at("supper number five", 1242) + 2.8)} />);
    P(<BigNum key="c5" t={t} at={at("one dollar and 30 cents", 1242)} text="$1.30" x={1340} y={300} size={190} col={COL.amber} sub="PAGE 92 · 2 SANDWICHES" out={cut(at("one dollar and 30 cents", 1242) + 3.4)} />);
    P(<Chips key="i5" t={t} at={at("quarter pound of ground beef, two", 1257)} items={["¼ LB GROUND BEEF", "2 TBSP ONION", "¼ CUP KETCHUP", "MUSTARD", "BROWN SUGAR"]} out={cut(at("quarter pound of ground beef, two", 1257) + 7)} y={880} />);
    W1("grs", at("Don't pour grease down the sink", 1285), "NEVER POUR GREASE DOWN THE SINK", COL.red, 3.6, 76);
    P(<Timer key="t5b" t={t} at={at("let it simmer five minutes", 1299)} out={cut(at("let it simmer five minutes", 1299) + 3.8)} secs={5} label="MINUTES · LOW · THICK AND SHINY" />);
    W1("nd", at("write sloppy joe on it", 1313), "NAME + DATE · FREEZE IT FLAT", COL.ice, 3.2, 80);
    P(<Stamp key="bun" t={t} at={at("toast the bun", 1313)} text="TOAST THE BUN FIRST" x={960} y={250} size={96} out={cut(at("toast the bun", 1313) + 3.4)} />);
    P(<BigNum key="160b" t={t} at={at("Ground beef to 160", 1342)} text="160°F" x={1340} y={300} size={180} col={COL.ice} sub="NO PINK ANYWHERE" out={cut(at("Ground beef to 160", 1342) + 3.4)} />);
    W1("3mo", at("It keeps three months", 1356), "FREEZER · KEEPS 3 MONTHS", COL.ice, 3.0, 84);
    W1("600", at("600 children", 1370), "600 CHILDREN · SLOPPY JOE THURSDAYS", COL.amber, 3.8, 72);
    P(<Versus key="fz" t={t} at={at("$3.50 or $4.00", 1412)} out={cut(at("You just made two suppers", 1412) + 4)} title="2 SUPPERS" L={{ label: "FROZEN DINNER", val: "$3.50–$4 EACH", h: 0.9, col: COL.red, mark: "x" }} R={{ label: "THE LITTLE PAN", val: "$1.30 FOR BOTH", h: 0.3, col: GREEN, mark: "ok" }} />);
    // ---------- cena 6 ----------
    P(<StepTitle key="s6" t={t} at={at("Supper number six", 1427)} n={6} name="EGGS IN TOMATO SAUCE" out={cut(at("Supper number six", 1427) + 2.8)} />);
    P(<BigNum key="c6" t={t} at={at("90 cents", 1427)} text="90¢" x={1340} y={300} size={220} col={COL.amber} sub="PAGE 69 · MONTH'S END" out={cut(at("90 cents", 1427) + 3.6)} />);
    P(<Chips key="i6" t={t} at={at("a cup of canned crushed", 1441)} items={["1 CUP CRUSHED TOMATOES", "¼ ONION", "1 GARLIC CLOVE", "2 EGGS", "BREAD"]} out={cut(at("a cup of canned crushed", 1441) + 7)} y={880} />);
    W1("nest", at("like two nests", 1484), "2 LITTLE NESTS", COL.amber, 3.0, 96);
    P(<Timer key="t8" t={t} at={at("leave it alone six to eight", 1498)} out={cut(at("leave it alone six to eight", 1498) + 4)} secs={8} label="MINUTES · LID ON · LOW" />);
    W1("keep", at("That's where the lid earns", 1498), "THE LID EARNS ITS KEEP", COL.ice, 3.4, 86);
    W1("wipe6", at("the bread has wiped the pan", 1528), "THE BREAD WIPES THE PAN", GREEN, 3.2, 86);
    W1("flat6", at("Freeze the rest flat", 1528), "FREEZE THE REST FLAT · LIKE A BOOK", COL.ice, 3.6, 72);
    W1("wht", at("cook those whites all the way", 1557), "COOK THE WHITES ALL THE WAY", COL.red, 3.2, 80);
    // ---------- cena 7 ----------
    P(<StepTitle key="s7" t={t} at={at("Supper number seven", 1614)} n={7} name="SMOTHERED CHICKEN THIGHS · 2 PLATES" out={cut(at("Supper number seven", 1614) + 2.8)} />);
    P(<BigNum key="c7" t={t} at={at("two dollars and twenty cents", 1614)} text="$2.20" x={1340} y={300} size={190} col={COL.amber} sub="PAGE 94 · 2 PLATES" out={cut(at("two dollars and twenty cents", 1614) + 3.4)} />);
    P(<Chips key="i7" t={t} at={at("two boneless chicken thighs", 1642)} items={["2 BONELESS THIGHS", "½ CUP MUSHROOMS", "½ CUP BROTH", "2 TBSP SOUR CREAM", "THYME"]} out={cut(at("two boneless chicken thighs", 1642) + 7)} y={880} />);
    P(<TimeBars key="tb7" t={t} rows={[{ at: at("five minutes a side", 1657), label: "BROWN THE THIGHS", val: "5 MIN A SIDE", frac: 0.5, col: COL.amber }, { at: at("cook them five minutes", 1671), label: "MUSHROOMS + ONION", val: "5 MIN", frac: 0.5, col: COL.amber }, { at: at("let it simmer 10 minutes", 1685), label: "LID ON · LOW", val: "10 MIN", frac: 1, col: COL.ice }]} out={cut(at("let it simmer 10 minutes", 1685) + 3.4)} />);
    P(<Stamp key="off" t={t} at={at("stir the sour cream", 1685)} text="OFF THE HEAT → SOUR CREAM" x={960} y={250} size={80} out={cut(at("stir the sour cream", 1685) + 3.6)} />);
    P(<Versus key="thigh" t={t} at={at("Thighs stay juicy", 1699)} out={cut(at("A breast would be shoe leather", 1714) + 2.5)} title="5 MINUTES TOO LONG" L={{ label: "BREAST", val: "SHOE LEATHER", h: 0.45, col: COL.red, mark: "x" }} R={{ label: "THIGH", val: "STILL JUICY", h: 0.85, col: COL.amber, mark: "ok" }} />);
    P(<BigNum key="165b" t={t} at={at("Chicken to 165", 1728)} text="165°F" x={1340} y={300} size={180} col={COL.ice} sub="CHICKEN" out={cut(at("Chicken to 165", 1728) + 3.2)} />);
    W1("aff", at("I eat what I can afford", 1756), "“I EAT WHAT I CAN AFFORD”", COL.amber, 3.4, 80);
    W1("never", at("I've never once scrubbed", 1785), "NEVER ONCE SCRUBBED AFTER THIS ONE", GREEN, 3.6, 74);
    // ---------- cena 8 ----------
    P(<StepTitle key="s8" t={t} at={at("Supper number eight", 1799)} n={8} name="THE LITTLE FRITTATA · 2 PLATES" out={cut(at("Supper number eight", 1799) + 2.8)} />);
    P(<BigNum key="c8" t={t} at={at("one dollar and forty cents", 1799)} text="$1.40" x={1340} y={300} size={190} col={COL.amber} sub="PAGE 68 · 2 PLATES" out={cut(at("one dollar and forty cents", 1799) + 3.4)} />);
    P(<Chips key="i8" t={t} at={at("three eggs, two tablespoons", 1813)} items={["3 EGGS", "1 COOKED POTATO", "¼ ONION", "1 SLICE HAM", "¼ CUP CHEESE"]} out={cut(at("three eggs, two tablespoons", 1813) + 7)} y={880} />);
    P(<BigNum key="375" t={t} at={at("Heat the oven to 375", 1828)} text="375°F" x={1340} y={300} size={180} col={COL.amber} sub="OVEN FIRST" out={cut(at("Heat the oven to 375", 1828) + 3.2)} />);
    P(<Timer key="t12" t={t} at={at("into the oven 10 to 12", 1857)} out={cut(at("into the oven 10 to 12", 1857) + 4)} secs={12} label="MINUTES · IN THE OVEN" />);
    P(<Stamp key="ph" t={t} at={at("leave it there", 1871)} text="POTHOLDER STAYS ON THE HANDLE" x={960} y={250} size={74} out={cut(at("leave it there", 1871) + 3.6)} />);
    P(<Versus key="hdl" t={t} at={at("Use a skillet with a metal handle", 1885)} out={cut(at("Use a skillet with a metal handle", 1885) + 6)} title="THE HANDLE" L={{ label: "PLASTIC", val: "MELTS IN THE OVEN", h: 0.5, col: COL.red, mark: "x" }} R={{ label: "ALL METAL", val: "DOES EVERYTHING", h: 0.85, col: COL.amber, mark: "ok" }} />);
    W1("pie", at("A wedge of cold egg pie", 1913), "“A WEDGE OF COLD EGG PIE”", COL.amber, 3.4, 80);
    W1("warp", at("never cold water in a hot pan", 1970), "NEVER COLD WATER IN A HOT PAN", COL.red, 3.0, 78);
    // ---------- cena 9 · el error ----------
    P(<StepTitle key="s9" t={t} at={at("Supper number nine", 1970)} n={9} name="POT ROAST HASH" out={cut(at("Supper number nine", 1970) + 2.8)} />);
    P(<BigNum key="c9" t={t} at={at("80 cents", 1985)} text="80¢" x={1340} y={300} size={220} col={COL.amber} sub="PAGE 153" out={cut(at("80 cents", 1985) + 3.2)} />);
    P(<Stamp key="mis" t={t} at={at("everybody makes the mistake", 1985)} text="#9 · THE MISTAKE" x={960} y={250} size={100} out={cut(at("everybody makes the mistake", 1985) + 3.4)} />);
    P(<Chips key="i9" t={t} at={at("one cup of leftover pot roast", 1999)} items={["1 CUP POT ROAST + POTATOES", "¼ ONION", "1 TSP OIL", "1 EGG"]} out={cut(at("one cup of leftover pot roast", 1999) + 6)} y={880} />);
    P(<Timer key="t5c" t={t} at={at("Now leave it five minutes", 2013)} out={cut(at("Now leave it five minutes", 2013) + 4)} secs={5} label="MINUTES · DON'T STIR" />);
    P(<Stamp key="stir" t={t} at={at("Everybody stirs", 2028)} text="EVERYBODY STIRS" x={960} y={250} size={120} out={cut(at("Everybody stirs", 2028) + 3.6)} />);
    W1("frnd", at("Let it make friends with the pan", 2042), "“LET IT MAKE FRIENDS WITH THE PAN”", COL.amber, 3.6, 74);
    P(<Versus key="hash" t={t} at={at("When you stir, the food", 2042)} out={cut(at("the pan underneath is clean", 2084) + 2.5)} title="THE HASH" L={{ label: "STIR IT", val: "GRAY · MUSHY · BURNED ON", h: 0.45, col: COL.red, mark: "x" }} R={{ label: "LEAVE IT ALONE", val: "BROWN CRUST · CLEAN PAN", h: 0.9, col: COL.amber, mark: "ok" }} />);
    W1("sec", at("Heat the pan, put", 2084), "HEAT THE PAN · FOOD IN · LEAVE IT ALONE", COL.amber, 5.0, 70);
    W1("grv", at("a spoonful of the leftover gravy", 2112), "+ A SPOONFUL OF LEFTOVER GRAVY", COL.amber, 3.4, 76);
    W1("dbt", at("when in doubt throw", 2141), "WHEN IN DOUBT, THROW IT OUT", COL.red, 3.4, 80);
    W1("p32", at("pot roast for one on page", 2155), "POT ROAST FOR ONE · PAGE 32", COL.amber, 3.8, 80);
    // ---------- cena 10 ----------
    P(<StepTitle key="s10" t={t} at={at("Supper number 10", 2184)} n={10} name="FRIED RICE FROM YESTERDAY'S RICE" out={cut(at("Supper number 10", 2184) + 2.8)} />);
    P(<BigNum key="c10" t={t} at={at("One dollar", 2186)} text="$1" x={1340} y={300} size={230} col={COL.amber} sub="PAGE 95" out={cut(at("One dollar", 2186) + 3.4)} />);
    P(<Chips key="i10" t={t} at={at("one cup of cold cooked rice", 2198)} items={["1 CUP COLD RICE", "1 EGG", "½ CUP PEAS + CARROTS", "1 GREEN ONION", "1 TBSP SOY SAUCE"]} out={cut(at("one cup of cold cooked rice", 2198) + 7)} y={880} />);
    P(<Stamp key="high" t={t} at={at("the only one that goes on high", 2226)} text="THE ONLY ONE ON HIGH" x={960} y={250} size={96} out={cut(at("the only one that goes on high", 2226) + 3.2)} />);
    W1("ustir", at("Fried rice is the one you stir", 2226), "THIS ONE YOU STIR", COL.amber, 3.0, 96);
    P(<Versus key="rice" t={t} at={at("The rice has to be cold", 2269)} out={cut(at("make extra on purpose", 2283) + 2.5)} title="THE RICE" L={{ label: "FRESH + HOT", val: "PASTE · STICKS", h: 0.5, col: COL.red, mark: "x" }} R={{ label: "COLD FROM THE FRIDGE", val: "EVERY GRAIN FRIES", h: 0.9, col: COL.amber, mark: "ok" }} />);
    W1("1h", at("within an hour of cooking", 2298), "FRIDGE WITHIN 1 HOUR · EAT IN 3 DAYS", COL.red, 4.0, 72);
    W1("anniv", at("happy anniversary", 2341), "“HAPPY ANNIVERSARY, HAROLD”", COL.amber, 3.6, 82);
    // ---------- las 10 ----------
    P(<CheckList key="all" t={t} title="ALL 10 · ONE 8-INCH PAN" rows={[
      { at: at("Hamburger steak with", 2356), txt: "HAMBURGER STEAK · $1.60" }, { at: at("chicken cutlet in 15", 2366), txt: "CHICKEN CUTLET · $1.30" },
      { at: at("fried potatoes and onions", 2366), txt: "FRIED POTATOES · 40¢" }, { at: at("fish and butter", 2366), txt: "FISH IN BUTTER · $1.60" },
      { at: at("sloppy joe", 2366), txt: "SLOPPY JOE · $1.30" }, { at: at("eggs and tomato sauce", 2366), txt: "EGGS IN TOMATO · 90¢" },
      { at: at("smothered chicken thighs", 2366), txt: "SMOTHERED THIGHS · $2.20" }, { at: at("the little frittata", 2366), txt: "LITTLE FRITTATA · $1.40" },
      { at: at("pot roast hash", 2366), txt: "POT ROAST HASH · 80¢" }, { at: at("and fried rice", 2366), txt: "FRIED RICE · $1" },
    ]} out={cut(at("every one under $2.25", 2380) - 0.05)} />);
    P(<BigNum key="u225" t={t} at={at("every one under $2.25", 2380)} text="UNDER $2.25" x={1340} y={300} size={140} col={GREEN} sub="EVERY ONE" out={cut(at("every one under $2.25", 2380) + 3.4)} />);
    // ---------- dos semanas ----------
    W1("trip", at("One trip to the store", 2398), "1 TRIP TO THE STORE ≈ 14 SUPPERS", COL.amber, 3.6, 76);
    P(<CheckList key="cart" t={t} title="THE CART · PAGE 162" rows={[
      { at: at("Two pounds of ground beef", 2398), txt: "2 LB GROUND BEEF" }, { at: at("boneless chicken breasts", 2412), txt: "CHICKEN BREASTS + THIGHS" },
      { at: at("frozen fish fillets", 2412), txt: "FROZEN FISH FILLETS" }, { at: at("a dozen and a half eggs", 2426), txt: "18 EGGS" },
      { at: at("a ham steak", 2426), txt: "A HAM STEAK" }, { at: at("a bag of potatoes", 2426), txt: "POTATOES + ONIONS" },
      { at: at("a bag of rice", 2426), txt: "RICE · PEAS · TOMATOES" },
    ]} out={cut(at("And on page 163", 2440) - 0.05)} />);
    W1("nm", at("Every bag gets a name", 2455), "EVERY BAG: NAME + DATE", COL.amber, 3.4, 88);
    P(<TimeBars key="tbm" t={t} rows={[{ at: at("frozen dinner is $3.50", 2470), label: "FROZEN DINNER", val: "$3.50–$5", frac: 0.45, col: COL.red }, { at: at("The drive-thru is", 2483), label: "DRIVE-THRU", val: "$9–$11", frac: 1, col: COL.red }, { at: at("about $1.30 a plate", 2483), label: "THE LITTLE SKILLET", val: "$1.30", frac: 0.12, col: GREEN }]} out={cut(at("Seven suppers a week", 2483) - 0.05)} />);
    P(<Versus key="wk" t={t} at={at("Seven suppers a week", 2483)} out={cut(at("more than $80 a month", 2498) - 0.05)} title="7 SUPPERS A WEEK" L={{ label: "FROZEN DINNERS", val: "$25–$35", h: 0.9, col: COL.red, mark: "x" }} R={{ label: "THE LITTLE SKILLET", val: "$9–$10", h: 0.3, col: GREEN, mark: "ok" }} />);
    P(<BigNum key="80" t={t} at={at("more than $80 a month", 2498)} text="$80+" x={1340} y={300} size={210} col={GREEN} sub="A MONTH" out={cut(at("more than $80 a month", 2498) + 4)} />);
    W1("salt", at("a little tray of salt", 2512), "A FROZEN DINNER = A LITTLE TRAY OF SALT", COL.red, 3.6, 68);
    // ---------- la limpieza ----------
    P(<CheckList key="cln" t={t} title="THE WHOLE CLEANUP" rows={[
      { at: at("pour in a little hot water from the kettle", 2540), txt: "HOT WATER FROM THE KETTLE" }, { at: at("Let it sit while you eat", 2540), txt: "LET IT SIT WHILE YOU EAT" },
      { at: at("wipe it with a dish", 2540), txt: "ONE WIPE" }, { at: at("dry it on the burner", 2554), txt: "DRY IT ON THE BURNER" }, { at: at("hang it back up", 2554), txt: "HANG IT BACK UP" },
    ]} out={cut(at("Two minutes. That's my", 2554) - 0.05)} />);
    P(<BigNum key="2m" t={t} at={at("Two minutes. That's my", 2554)} text="2 MIN" x={1340} y={300} size={200} col={GREEN} sub="MY WHOLE KITCHEN CLEANUP" out={cut(at("Two minutes. That's my", 2554) + 3.4)} />);
    // ---------- preguntas ----------
    W1("q1", at("what kind of skillet should I buy", 2568), "“WHAT SKILLET SHOULD I BUY?”", COL.amber, 3.0, 84);
    P(<Chips key="buy" t={t} at={at("eight inches across with a metal", 2568)} items={["8 INCHES", "METAL HANDLE", "A LID THAT FITS"]} out={cut(at("eight inches across with a metal", 2568) + 5)} y={880} />);
    W1("ns", at("never put the non-stick one on high", 2583), "NON-STICK: NEVER ON HIGH WHEN EMPTY", COL.red, 3.4, 72);
    W1("stool", at("put a kitchen stool by the stove", 2597), "A TALL STOOL BY THE STOVE", COL.amber, 3.4, 84);
    W1("big", at("what if I only have a big skillet", 2611), "ONLY A BIG SKILLET? THE SMALLEST BURNER", undefined, 3.8, 70);
    P(<BigNum key="w11" t={t} at={at("You're worth $11", 2640)} text="$11" x={1340} y={300} size={220} col={GREEN} sub="YOU'RE WORTH IT" out={cut(at("You're worth $11", 2640) + 3.2)} />);
    P(<Stamp key="sit" t={t} at={at("Sit down to eat it", 2640)} text="SIT DOWN TO EAT IT" x={960} y={250} size={100} out={cut(at("Sit down to eat it", 2640) + 3.4)} />);
    W1("mat", at("like a person who matters", 2668), "LIKE A PERSON WHO MATTERS", COL.amber, 3.6, 88);
    W1("tog", at("Two people eating alone together", 2697), "TWO PEOPLE EATING ALONE TOGETHER AREN'T ALONE", undefined, 4.6, 64);
    // ---------- cierre ----------
    P(<Chips key="bk2" t={t} at={at("in the little skillet chapter", 2712)} items={["SUPPER FOR ONE", "140 SUPPERS", "THE LITTLE SKILLET · PAGE 85"]} out={cut(at("The link is in the first line", 2726) - 0.05)} y={880} />);
    W1("cta2", at("The link is in the first line", 2726), "LINK IN THE 1ST LINE OF THE DESCRIPTION", COL.amber, 4.6, 70);
    W1("ask", at("what's in your skillet tonight", 2726), "WHAT'S IN YOUR SKILLET TONIGHT?", COL.amber, 4.0, 80);
    W1("next", at("Next time on this channel", 2754), "NEXT: 10 SUPPERS IN ONE PIE PLATE", COL.amber, 4.2, 76);
    W1("place", at("set a place for yourself", 2783), "SET A PLACE FOR YOURSELF TONIGHT", COL.amber, 4.4, 80);
    // insignia de la cena en curso (arriba-der) desde que termina su título hasta que empieza la siguiente / el repaso
    const END = at("So there they are", 2350);
    SUP.forEach((x, i) => L.push(<PieBadge key={"bdg" + x.n} t={t} at={x.a + 3.2} out={(SUP[i + 1]?.a ?? END) - 0.3} n={x.n} name={x.name.split(" · ")[0]} />));
    L.push(<ZocaloStack key="zoc" t={t} items={Z} />);
    return L;
  },
});

export const Full: React.FC = () => {
  useCurrentFrame();
  return <AbsoluteFill style={{ background: "#05070b" }}><M.Body /></AbsoluteFill>;
};
export const clipPlan = M.clipPlan;
export const beatTable = M.beatTable;
