// ck2510a · DEL 1:26 AL FINAL. Misma vara que el minuto 1 (gary01): una base por frase —toma de Loretta haciendo lo que cuenta /
// el salón 3D / el avatar— y CERO cortes secos; las piezas 2.5D viven encima y cruzan las transiciones. El salón es UNA sola escena
// 3D (hall3d.tsx): cada "W" es la cámara en un rincón (la fuente de turno destapándose, su tarjetita, la página REAL del libro, la
// fila de las 7, la mesa de la familia, la escalera). Orden y anclas: beats.json (mk_beats.py desde tomas.py). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { HallWorld, sceneOf, screenOfScene, PT } from "./hall3d";
import { MIN1_END, vid } from "./Min1";
import { BigNum, COL, Chips, FONT, LowerThird, Vid, e, extrude, setSlug, spr } from "../kits/yanqui3d/lib";
import { makeVideo, Stamp, Beat } from "../kits/yanqui3d/engine";
import { CheckList, Mistake, NextCard, StepTitle, Timer, Words } from "../kits/yanqui3d/pieces";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import RB from "./beats.json";

setSlug("ck2510a");
export const T0 = MIN1_END, TEND = RB.TEND;
export const FULL_FRAMES = Math.ceil(TEND * 30);

// ---------------- el nombre del libro + "link en la 1ª línea" (NUNCA una URL en pantalla) ----------------
const BookCTA: React.FC<{ t: number; at: number; out: number; sub?: string; y?: number }> = ({ t, at, out, sub = "LINK IN THE 1ST LINE OF THE DESCRIPTION", y = 820 }) => {
  if (at < 0 || t < at - 0.05 || t > out + 0.4) return null;
  const k = Math.min(1.06, spr(t, at, 0.8)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.35));
  return (
    <div style={{ position: "absolute", left: 960, top: y, transform: `translate(-50%,-50%) scale(${k})`, opacity: o, textAlign: "center", padding: "22px 54px 24px", borderRadius: 26, background: "linear-gradient(180deg, rgba(58,32,82,.96), rgba(30,16,44,.96))", boxShadow: `0 30px 60px rgba(0,0,0,.6), 0 0 0 3px ${COL.amber}88`, whiteSpace: "nowrap" }}>
      <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 700, fontSize: 72, color: "#fff4dc", textShadow: extrude(4, "rgba(0,0,0,.55)") }}>Loretta's Church Supper Cookbook</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 5, color: COL.amber, marginTop: 6, opacity: e(t, at + 0.5, at + 0.8) }}>{sub}</div>
    </div>
  );
};
// "PAGE 30 · DORIS KETTLESON" chiquito arriba a la derecha mientras dura la cazuela (la página real del libro)
const PageChip: React.FC<{ t: number; at: number; out: number; page: number; name: string }> = ({ t, at, out, page, name }) => {
  if (at < 0 || t < at - 0.05 || t > out + 0.4) return null;
  const o = e(t, at, at + 0.3) * (1 - e(t, out, out + 0.35));
  return (
    <div style={{ position: "absolute", right: 60, top: 54, opacity: o, transform: `translateY(${(1 - e(t, at, at + 0.4)) * -30}px)`, display: "flex", alignItems: "center", gap: 18, padding: "12px 26px 12px 14px", borderRadius: 18, background: "rgba(20,14,10,.82)", boxShadow: `0 14px 30px rgba(0,0,0,.5), 0 0 0 2px ${COL.amber}55` }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#20140a", background: COL.amber, borderRadius: 10, padding: "4px 12px" }}>PAGE {page}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: COL.ink }}>{name}</div>
    </div>
  );
};

const V = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: AVAIL as { clips: string[]; imgs: string[] }, T0, TEND, flashAtStart: false,
  beats: ({ AV, CL }) => (RB.beats as { a: number; kind: string; k?: string; scene?: string; tr: Beat["tr"]; from?: number }[]).filter((b) => b.a >= T0 - 0.01).map((b) =>
    b.kind === "AV" ? AV(b.a, b.tr)
      // la toma LTX que el avatar cortó sigue desde el cuadro donde quedó (`from`): 19 s de acción continua, nunca repetida
      : b.kind === "CL" && b.from ? ({ a: b.a, tr: b.tr, r: () => <AbsoluteFill style={{ transform: "scale(1.04)" }}><Vid id={vid(b.k as string)} at={b.a} from={b.from} /></AbsoluteFill> } as Beat)
      : b.kind === "CL" ? CL(b.a, b.k as string, b.tr, undefined, [1.02, 1.1])
        : ({ a: b.a, tr: b.tr, p: [960, 540], r: (t: number) => <HallWorld t={t} sc={sceneOf(b.scene as string, t - b.a)} /> } as Beat)),
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    // ancla segura: si Groq lo transcribió distinto, la pieza no sale (nunca rompe el render)
    const A = (ph: string, after = T0 - 1) => { try { return at(ph, after); } catch { return -1; } };
    const ok = (...xs: number[]) => xs.every((x) => x >= 0);
    const W = (key: string, a: number, txt: string, out: number, o: { y?: number; size?: number; col?: string } = {}) => ok(a) && L.push(<Words key={key} t={t} items={[{ at: a, txt, col: o.col }]} out={out} y={o.y ?? 880} size={o.size ?? 80} />);
    const N = (key: string, a: number, text: string, out: number, o: { sub?: string; col?: string; edge?: string; x?: number; y?: number; size?: number } = {}) => ok(a) && L.push(<BigNum key={key} t={t} at={a} text={text} sub={o.sub} x={o.x ?? 1440} y={o.y ?? 320} size={Math.min(o.size ?? 180, 200)} col={o.col ?? COL.amber} edge={o.edge ?? "#5a3208"} out={out} />);
    const C = (key: string, a: number, items: string[], out: number, y = 860) => ok(a) && L.push(<Chips key={key} t={t} at={a} items={items} out={out} y={y} />);
    const ING = (key: string, title: string, rows: [number, string][], out: number) => { const r = rows.filter(([a]) => a >= 0); if (r.length) L.push(<CheckList key={key} t={t} title={title} rows={r.map(([a, txt]) => ({ at: a, txt }))} out={out} />); };
    const OVEN = (key: string, a: number, temp: string, out: number) => N(key, a, temp, out, { sub: "OVEN", col: "#ffb35a", edge: "#5a1e08", x: 480, y: 320, size: 170 });
    const MK = (key: string, a: number, n: number, txt: string, out: number) => ok(a) && L.push(<Mistake key={key} t={t} at={a} n={n} txt={txt} out={out} />);
    const STAMP = (key: string, a: number, text: string, out: number, y = 340) => ok(a) && L.push(<Stamp key={key} t={t} at={a} text={text} x={960} y={y} rot={-4} size={86} out={out} />);
    const SUP = (n: number, name: string, page: number, who: string, a: number, end: number) => {
      if (!ok(a)) return;
      L.push(<StepTitle key={"st" + n} t={t} at={a} n={n} name={name} out={a + 3.6} y={300} />);
      L.push(<PageChip key={"pc" + n} t={t} at={a + 3.6} out={end} page={page} name={who} />);
    };
    // una tarjetita con el nombre de la señora, pegada a su fuente cuando la cámara está en el salón
    const WHO = (key: string, a: number, k: number, txt: string, out: number) => ok(a) && t >= a && t < out + 0.5 && L.push(<Words key={key} t={t} items={[{ at: a, txt, col: COL.amber }]} out={out} y={170} size={78} />);
    const S = [A("Casserole number one"), A("Casserole number two"), A("Casserole number three"), A("Casserole number four"), A("Casserole number five"), A("Casserole number six"), A("number seven", A("Casserole number six") + 30), A("a little hard for me")];

    // ===== Loretta, la iglesia, por qué una fuente =====
    if (ok(A("Loretta.", 100))) L.push(<LowerThird key="lt0" t={t} at={A("Loretta.", 100)} out={A("Loretta.", 100) + 4.5} name="LORETTA" l2="81 · 60 YEARS IN THE CHURCH BASEMENT · IOWA" l2at={A("Loretta.", 100) + 0.3} />);
    C("fw", A("Funerals,"), ["FUNERALS", "WEDDINGS", "WEDNESDAY SUPPERS"], A("200 plates") - 0.1);
    N("200", A("200 plates"), "200", A("200 plates") + 3.2, { sub: "PLATES AT A TIME" });
    W("cfix", A("You can't fix it."), "YOU CAN'T FIX IT.", A("So you bring a pan") - 0.1);
    W("bring", A("So you bring a pan"), "SO YOU BRING A PAN.", A("So you bring a pan") + 3.4, { col: COL.amber, size: 92 });
    W("reason", A("had a reason"), "EVERY ONE HAD A REASON", A("One was for the children") - 0.1, { y: 170 });
    C("rs", A("One was for the children"), ["THE CHILDREN", "THE OLD MEN", "FRIDAYS", "THE LONG DRIVE"], A("and one, just one") > 0 ? A("and one, just one") : A("one was for the people") + 3);
    STAMP("again", A("asked for again"), "THE ONE THEY ASKED FOR AGAIN", A("asked for again") + 3.4);
    L.push(<BookCTA key="cta0" t={t} at={A("It's called Loretta's")} out={A("It's called Loretta's") + 4.2} sub="50 OLD CHURCH SUPPER RECIPES" />);
    N("cr", A("for a crowd and how", 150), "CROWD · OR 1-2", A("for a crowd and how", 150) + 3.4, { sub: "EVERY RECIPE, BOTH WAYS", size: 110 });
    W("p28", A("Page 28"), "PAGE 28 · HOTDISH & CASSEROLES", A("Page 28") + 4, { y: 940, size: 56 });
    ING("hd", "WHAT MAKES A HOTDISH", [[A("Meat, a starch"), "MEAT"], [A("a starch"), "A STARCH"], [A("a vegetable", 200), "A VEGETABLE"], [A("creamy sauce"), "A CREAMY SAUCE · ONE PAN"]], A("creamy sauce") + 4);
    C("bsf", A("a baby, a surgery"), ["A BABY", "A SURGERY", "A FUNERAL"], A("a baby, a surgery") + 3.5);
    L.push(<BookCTA key="cta1" t={t} at={A("The cookbook is in the first line")} out={A("The cookbook is in the first line") + 3.6} />);
    W("all7", A("all seven recipes are written out"), "ALL 7 RECIPES · RIGHT BELOW IT", A("all seven recipes are written out") + 3.6, { y: 170, size: 70 });
    W("trav", A("It had to travel"), "IT HAD TO TRAVEL", A("It had to travel") + 3.2, { y: 170, size: 92 });
    W("buick", A("back seat of a Buick"), "BACK SEAT · ON A TOWEL", A("back seat of a Buick") + 3, { y: 880 });
    C("hold", A("No sauce that breaks"), ["NO SAUCE THAT BREAKS", "NO SOGGY TOPPING", "BUILT TO HOLD"], A("Every one of these seven is built") + 2.5);
    N("140", A("140 degrees"), "140°F+", A("140 degrees") + 3.2, { sub: "HOT FOOD STAYS HOT", col: "#ff8a5a", edge: "#5a1508" });
    N("2h", A("two hours", A("140 degrees")), "2 HRS", A("two hours", A("140 degrees")) + 3.2, { sub: "MAX ON THE TABLE", x: 480 });

    // ===== 1 · potato puff hotdish · p.30 · Doris Kettleson =====
    SUP(1, "POTATO PUFF HOTDISH", 30, "DORIS KETTLESON", S[0], S[1] - 0.5);
    WHO("w1", A("Doris brought it for the children"), 0, "FOR THE CHILDREN", A("Doris brought it for the children") + 3.4);
    STAMP("dc", A("if the children eat"), "“IF THE CHILDREN EAT, THE MOTHER CAN BREATHE”", A("if the children eat") + 4.5, 330);
    C("t1", A("It serves eight in a 9 by 13", S[0]) > 0 ? A("It serves eight in a 9 by 13", S[0]) : A("serves eight", S[0]), ["SERVES 8 · 9×13", "15 MIN WORK", "45 MIN OVEN"], A("You need a pound and a half", S[0]));
    ING("i1", "YOU'LL NEED", [[A("a pound and a half of ground beef", S[0]), "1½ LB GROUND BEEF · 1 ONION"], [A("Worcestershire", S[0]), "SALT · PEPPER · WORCESTERSHIRE"], [A("cream of mushroom", S[0]), "1 CAN CREAM OF MUSHROOM"], [A("cream of chicken", S[0]), "1 CAN CREAM OF CHICKEN · ½ CUP MILK"], [A("frozen green beans", S[0]), "3 CUPS FROZEN GREEN BEANS"], [A("shredded cheddar", S[0]), "1½ CUPS CHEDDAR"], [A("frozen potato puffs", S[0] + 30), "1 BAG FROZEN POTATO PUFFS"]], A("Turn your oven to 375", S[0]) + 0.2);
    OVEN("o1", A("Turn your oven to 375", S[0]), "375°F", A("Turn your oven to 375", S[0]) + 3.5);
    N("160a", A("160 degrees", S[0]), "160°F", A("160 degrees", S[0]) + 3, { sub: "NO PINK LEFT", col: "#ff8a5a", edge: "#5a1508" });
    W("rows", A("neat rows", S[0]), "NEAT ROWS · SHOULDER TO SHOULDER", A("neat rows", S[0]) + 4, { col: COL.amber, size: 72 });
    N("45m", A("40 to 45 minutes", S[0]), "40–45 MIN", A("40 to 45 minutes", S[0]) + 3.6, { sub: "UNCOVERED", col: "#ffb35a", edge: "#5a1e08", size: 120, x: 480 });
    STAMP("fz1", A("The potatoes go on frozen", S[0]), "THEY GO ON FROZEN", A("The potatoes go on frozen", S[0]) + 4);
    W("crunch", A("Crunchy on top", S[0]), "CRUNCHY ON TOP · SOFT UNDERNEATH", A("Crunchy on top", S[0]) + 3.2, { y: 170, size: 70 });
    MK("m11", A("A soggy top", S[0]), 1, "SOGGY TOP → THAWED OR COVERED", A("Too salty", S[0]) - 0.1);
    MK("m12", A("Too salty", S[0]), 2, "TOO SALTY → TASTE FIRST", A("And pale", S[0]) - 0.1);
    MK("m13", A("And pale", S[0]), 3, "PALE → OVEN TOO COOL", A("And pale", S[0]) + 4.5);
    C("cr1", A("For a crowd", S[0]), ["CROWD: 3 PANS · 24", "1-2 OF YOU: 8×8, HALF", "WARM IN THE OVEN"], S[1] - 0.6);

    // ===== 2 · chicken and rice hotdish · p.31 · Loretta =====
    SUP(2, "CHICKEN AND RICE HOTDISH", 31, "LORETTA", S[1], S[2] - 0.5);
    STAMP("mine", A("This one was mine", S[1]), "THIS ONE WAS MINE", A("This one was mine", S[1]) + 3.2);
    N("22", A("22 years old", S[1]), "22", A("22 years old", S[1]) + 3, { sub: "MY FIRST FUNERAL" });
    W("dcare", A("doesn't care what time it is", S[1]), "“SOMETHING THAT DOESN'T CARE WHAT TIME IT IS”", A("doesn't care what time it is", S[1]) + 4.2, { y: 170, size: 58, col: COL.amber });
    ING("i2", "YOU'LL NEED", [[A("long grain white rice", S[1]), "1¼ CUPS RAW LONG-GRAIN RICE"], [A("cream of chicken", S[1]), "CREAM OF CHICKEN + MUSHROOM"], [A("chicken broth", S[1]), "2½ CUPS CHICKEN BROTH"], [A("celery", S[1]), "1 ONION · 2 RIBS CELERY"], [A("thyme", S[1]), "SALT · PEPPER · THYME"], [A("chicken thighs", S[1]), "8 BONE-IN THIGHS · PAPRIKA"]], A("Heat your oven to 350", S[1]) + 0.2);
    OVEN("o2", A("Heat your oven to 350", S[1]), "350°F", A("Heat your oven to 350", S[1]) + 3.4);
    W("once", A("Stir it once", S[1]), "STIR IT ONCE. JUST ONCE.", A("Stir it once", S[1]) + 3.4, { col: COL.amber });
    STAMP("crimp", A("Crimp it all the way around", S[1]), "CRIMP IT ALL THE WAY AROUND", A("Crimp it all the way around", S[1]) + 3.6);
    C("tm2", A("Bake it one hour covered", S[1]), ["1 HOUR COVERED", "25–30 MIN UNCOVERED", "165°F · THIGHS 175°F"], A("Bake it one hour covered", S[1]) + 6);
    W("steam", A("That rice is cooking in steam", S[1]), "THE RICE COOKS IN STEAM", A("That rice is cooking in steam", S[1]) + 3.5, { y: 170 });
    MK("m21", A("Crunchy rice", S[1] + 60), 1, "CRUNCHY RICE → LOOSE FOIL", A("Gummy rice", S[1]) - 0.1);
    MK("m22", A("Gummy rice", S[1]), 2, "GUMMY RICE → STIRRED AT 30 MIN", A("pale chicken", S[1]) - 0.1);
    MK("m23", A("pale chicken", S[1]), 3, "PALE CHICKEN → FOIL NEVER CAME OFF", A("pale chicken", S[1]) + 4.5);
    C("cr2", A("If you're feeding a crowd", S[1]), ["2 PANS: +15 MIN", "1-2: 8×8 · 4 THIGHS", "BONELESS: 45 MIN COVERED"], A("Nobody called them") - 0.5);
    // las mujeres
    W("nc", A("Nobody called them"), "NOBODY CALLED THEM", A("Nobody called them") + 3, { size: 90 });
    C("np", A("no phone tree"), ["NO PHONE TREE", "NO SIGN-UP SHEET"], A("no phone tree") + 3.4);
    STAMP("lost", A("That's what we lost"), "KNOWING IT'S YOUR JOB", A("That's what we lost") + 5, 340);

    // ===== 3 · friday tuna noodle · p.32 · Marlys Ohnstad =====
    SUP(3, "FRIDAY TUNA NOODLE", 32, "MARLYS OHNSTAD", S[2], S[3] - 0.5);
    N("1960", A("1960", S[2]), "1960", A("1960", S[2]) + 3, { sub: "A CATHOLIC HUSBAND · NO MEAT ON FRIDAYS", size: 150 });
    STAMP("hung", A("nobody should go hungry", S[2]), "“NOBODY GOES HUNGRY AT A FUNERAL”", A("nobody should go hungry", S[2]) + 4, 330);
    ING("i3", "YOU'LL NEED", [[A("egg noodles", S[2]), "8 OZ EGG NOODLES"], [A("tablespoons of butter", S[2]), "3 TBSP BUTTER · 3 TBSP FLOUR"], [A("mushrooms", S[2]), "1 ONION · 1 CUP MUSHROOMS"], [A("cups of milk", S[2]), "2 CUPS MILK"], [A("shredded cheddar", S[2]), "1½ CUPS CHEDDAR"], [A("cans of tuna", S[2]), "2 CANS TUNA · 1 CUP FROZEN PEAS"], [A("potato chips", S[2]), "1 CUP CRUSHED POTATO CHIPS"]], A("Heat your oven to 375", S[2]) + 0.2);
    OVEN("o3", A("Heat your oven to 375", S[2]), "375°F", A("Heat your oven to 375", S[2]) + 3.4);
    W("2ms", A("2 minutes short", S[2]), "NOODLES 2 MINUTES SHORT", A("2 minutes short", S[2]) + 3.2, { y: 170 });
    W("slow", A("whisk in the milk", S[2]), "WHISK THE MILK IN · SLOWLY", A("whisk in the milk", S[2]) + 3.2, { col: COL.amber });
    STAMP("ws", A("A quick white sauce", S[2]), "WHITE SAUCE · NOT A CAN", A("A quick white sauce", S[2]) + 3.8);
    N("5m", A("5 extra minutes", S[2]), "+5 MIN", A("5 extra minutes", S[2]) + 3, { sub: "TASTES LIKE SUPPER" });
    MK("m31", A("A dry casserole", S[2]), 1, "DRY → NOODLES COOKED ALL THE WAY", A("A lumpy sauce", S[2]) - 0.1);
    MK("m32", A("A lumpy sauce", S[2]), 2, "LUMPY → COLD MILK ALL AT ONCE", A("gray peas", S[2]) - 0.1);
    MK("m33", A("gray peas", S[2]), 3, "GRAY PEAS → COOKED FIRST", A("gray peas", S[2]) + 4.5);
    C("cr3", A("For a crowd, triple it", S[2]), ["CROWD: TRIPLE · 18", "1-2: 1-QUART DISH", "SALMON OR CHICKEN WORK"], S[3] - 0.6);

    // ===== 4 · funeral potatoes · p.33 · Arlene Thorson =====
    SUP(4, "FUNERAL POTATOES", 33, "ARLENE THORSON", S[3], S[4] - 0.5);
    STAMP("tho", A("And this is the one", S[3]), "THE ONE THEY ASKED FOR AGAIN", A("And this is the one", S[3]) + 3.2);
    W("2wk", A("For two weeks", S[3]), "2 WEEKS OF CASSEROLES…", A("And then it stops", S[3]) - 0.1, { y: 170 });
    W("stop", A("And then it stops", S[3]), "…AND THEN IT STOPS.", A("And then it stops", S[3]) + 3, { y: 170, col: COL.amber });
    N("4wk", A("the fourth week", S[3]), "WEEK 4", A("the fourth week", S[3]) + 3.4, { sub: "THE HARDEST ONE" });
    STAMP("wait", A("So Arlene would wait", S[3]), "ARLENE WAITED A MONTH", A("So Arlene would wait", S[3]) + 4);
    ING("i4", "YOU'LL NEED", [[A("30-ounce bag", S[3]), "30 OZ FROZEN HASH BROWNS, THAWED"], [A("cream of chicken", S[3]), "1 CAN CREAM OF CHICKEN"], [A("sour cream", S[3]), "2 CUPS SOUR CREAM"], [A("melted", S[3]), "½ CUP BUTTER, MELTED · SPLIT"], [A("onion, chopped fine", S[3]), "½ CUP ONION"], [A("sharp cheddar", S[3]), "2 CUPS SHARP CHEDDAR"], [A("corn flakes", S[3]), "2 CUPS CRUSHED CORN FLAKES"]], A("Heat your oven to 350", S[3]) + 0.2);
    OVEN("o4", A("Heat your oven to 350", S[3]), "350°F", A("Heat your oven to 350", S[3]) + 3.4);
    STAMP("tw", A("twist it and squeeze it", S[3]), "WRING THEM DRY", A("twist it and squeeze it", S[3]) + 3.6);
    N("50m", A("50 to 55 minutes", S[3]), "50–55 MIN", A("50 to 55 minutes", S[3]) + 3.4, { sub: "UNCOVERED", col: "#ffb35a", edge: "#5a1e08", size: 120, x: 480 });
    MK("m41", A("A watery pan", S[3]), 1, "WATERY → WRING THE POTATOES", A("A soggy topping", S[3]) - 0.1);
    MK("m42", A("A soggy topping", S[3]), 2, "SOGGY TOP → FLAKES TOO EARLY · FOIL", A("And bland", S[3]) - 0.1);
    MK("m43", A("And bland", S[3]), 3, "BLAND → USE SHARP CHEDDAR", A("And bland", S[3]) + 4.5);
    C("cr4", A("For a crowd, a 9 by 13", S[3]), ["CROWD: 12–15 SCOOPS", "MAKE IT THE NIGHT BEFORE", "FREEZES 3 MONTHS · + HAM = SUPPER"], A("if there's one thing in this video", S[3]) - 0.2);
    W("lm", A("Not last week", S[3]), "NOT LAST WEEK. LAST MONTH.", A("Not last week", S[3]) + 3.6, { y: 170, col: COL.amber });
    STAMP("door", A("when nobody else is coming", S[3]), "WHEN NOBODY ELSE IS COMING", A("when nobody else is coming", S[3]) + 3.6);

    // ===== 5 · scalloped potatoes and ham · p.34 · Verna Lindgren =====
    SUP(5, "SCALLOPED POTATOES & HAM", 34, "VERNA LINDGREN", S[4], S[5] - 0.5);
    W("eh", A("What to do with the Easter ham", S[4]), "WHAT TO DO WITH THE EASTER HAM", A("What to do with the Easter ham", S[4]) + 3.4, { y: 170, size: 70 });
    W("om", A("the old men went for", S[4]), "THE PAN THE OLD MEN WENT FOR", A("the old men went for", S[4]) + 3.6, { col: COL.amber, size: 74 });
    ING("i5", "YOU'LL NEED", [[A("russet potatoes", S[4]), "3 LB RUSSETS · ⅛ INCH SLICES"], [A("cooked ham", S[4]), "2 CUPS DICED HAM · 1 ONION"], [A("tablespoons of butter", S[4]), "4 TBSP BUTTER · 4 TBSP FLOUR"], [A("whole milk", S[4]), "3 CUPS WHOLE MILK, WARMED"], [A("dry mustard", S[4]), "SALT · PEPPER · DRY MUSTARD"], [A("shredded cheddar", S[4]), "1½ CUPS CHEDDAR"]], A("Heat your oven to 350", S[4]) + 0.2);
    OVEN("o5", A("Heat your oven to 350", S[4]), "350°F", A("Heat your oven to 350", S[4]) + 3.4);
    C("lay", A("Now you layer", S[4]), ["POTATOES", "HAM", "ONION", "SAUCE · ×3"], A("Now you layer", S[4]) + 6);
    C("tm5", A("Cover it with foil", S[4]), ["50 MIN COVERED", "+ CHEESE · 25–30 UNCOVERED", "REST 15 MIN"], A("Cover it with foil", S[4]) + 7);
    if (ok(A("let it rest 15", S[4]))) L.push(<Timer key="r5" t={t} at={A("let it rest 15", S[4])} out={A("let it rest 15", S[4]) + 3.4} secs={15} label="REST 15 MIN" />);
    STAMP("wm", A("Warm milk, foil on, patience", S[4]), "WARM MILK · FOIL ON · PATIENCE", A("Warm milk, foil on, patience", S[4]) + 3.6);
    MK("m51", A("Hard potatoes", S[4]), 1, "HARD → SLICED TOO THICK / UNEVEN", A("A curdled sauce", S[4]) - 0.1);
    MK("m52", A("A curdled sauce", S[4]), 2, "CURDLED → COLD MILK · HEAT TOO HIGH", A("And runny", S[4]) - 0.1);
    MK("m53", A("And runny", S[4]), 3, "RUNNY → REST 15 MINUTES", A("And runny", S[4]) + 4.5);
    W("mand", A("mind your fingers", S[4]), "MIND YOUR FINGERS, HONEY", A("mind your fingers", S[4]) + 3, { y: 170, col: COL.red });
    C("cr5", A("For a crowd, two pans", S[4]), ["CROWD: 2 PANS · 16", "1-2: 8×8 · ~1 HOUR", "PORK ROAST WORKS TOO"], A("about the table itself") - 0.3);
    // la mesa
    W("tab", A("about the table itself"), "THE FUNERAL TABLE", A("about the table itself") + 3.2, { y: 170, size: 90 });
    W("line", A("Nobody who just buried somebody"), "THE FAMILY NEVER STANDS IN LINE", A("Nobody who just buried somebody") + 3.8, { col: COL.amber, size: 72 });
    ING("tbl", "DOWN THE LONG TABLE", [[A("Ham buns at one end"), "HAM BUNS"], [A("the salads and the jello"), "SALADS · JELLO"], [A("the seven hot pans"), "THE 7 HOT PANS"], [A("the bars and the cakes"), "BARS · CAKES"], [A("the big coffee pot"), "THE BIG COFFEE POT"]], A("the big coffee pot") + 4);
    STAMP("ep", A("No empty pan on the funeral table"), "NO EMPTY PAN. EVER.", A("No empty pan on the funeral table") + 3.6);
    N("0", A("Not one pan got lost"), "0", A("Not one pan got lost") + 3.4, { sub: "PANS LOST IN 60 YEARS", size: 200 });

    // ===== 6 · church supper goulash · p.35 · Hazel Brekke =====
    SUP(6, "CHURCH SUPPER GOULASH", 35, "HAZEL BREKKE", S[5], S[6] - 0.5);
    N("6k", A("Hazel had six children", S[5]), "6", A("Hazel had six children", S[5]) + 3, { sub: "CHILDREN · NOT MUCH MONEY", size: 200 });
    STAMP("fe", A("first pot empty", S[5]), "FIRST POT EMPTY · EVERY TIME", A("first pot empty", S[5]) + 3.6);
    W("pb", A("pallbearers", S[5]), "FOR THE PALLBEARERS", A("pallbearers", S[5]) + 3.4, { y: 170, col: COL.amber, size: 84 });
    ING("i6", "YOU'LL NEED", [[A("pound and a half of ground beef", S[5]), "1½ LB GROUND BEEF"], [A("green pepper", S[5]), "1 ONION · 1 GREEN PEPPER · 3 GARLIC"], [A("diced tomatoes", S[5]), "2 CANS DICED TOMATOES"], [A("tomato sauce", S[5]), "1 CAN TOMATO SAUCE · 2½ CUPS WATER"], [A("paprika", S[5]), "PAPRIKA · ITALIAN · 1 TSP SUGAR"], [A("elbow macaroni", S[5]), "2 CUPS RAW ELBOW MACARONI"], [A("shredded cheddar", S[5]), "1 CUP CHEDDAR"]], A("In a Dutch oven", S[5]) + 0.2);
    STAMP("raw", A("add the macaroni, raw", S[5]) > 0 ? A("add the macaroni, raw", S[5]) : A("macaroni raw", S[5]), "THE MACARONI GOES IN RAW", (A("add the macaroni, raw", S[5]) > 0 ? A("add the macaroni, raw", S[5]) : A("macaroni raw", S[5])) + 3.4);
    C("tm6", A("simmer on low 20 minutes", S[5]) > 0 ? A("simmer on low 20 minutes", S[5]) : A("20 minutes", S[5]), ["COVERED · LOW · 20 MIN", "STIR NOW AND THEN", "LID OFF · 5 MIN MORE"], A("Hazel's trick", S[5]) - 0.2);
    W("1pot", A("you only wash one pot", S[5]), "ONE POT TO WASH", A("you only wash one pot", S[5]) + 3.2, { y: 170 });
    MK("m61", A("A burnt bottom", S[5]), 1, "BURNT BOTTOM → STIR EVERY 5 MIN", A("Mushy macaroni", S[5]) - 0.1);
    MK("m62", A("Mushy macaroni", S[5]), 2, "MUSHY → TASTE AT 20 MIN", A("And sour", S[5]) - 0.1);
    MK("m63", A("And sour", S[5]), 3, "SOUR → 1 TSP SUGAR", A("And sour", S[5]) + 4.5);
    C("cr6", A("For a crowd, double it", S[5]), ["CROWD: STOCKPOT · 16", "KEEP IT 140°F+", "BETTER THE NEXT DAY"], S[6] - 0.6);

    // ===== 7 · calico beans · p.36 · Evelyn Sorensen =====
    const E0 = A("two more pans", S[6]), EB = A("before I let you go", S[6]), E1 = A("Funeral Pie", E0), E2 = A("The second pan that went to the house", E0);
    SUP(7, "CALICO BEANS", 36, "EVELYN SORENSEN", S[6], EB - 0.8);
    N("20mi", A("20 miles from town", S[6]), "20 MILES", A("20 miles from town", S[6]) + 3.4, { sub: "OF GRAVEL ROAD · AT DAWN", size: 150 });
    W("ev", A("where's Evelyn", S[6]), "“WHERE'S EVELYN? IS THE ROAD BAD?”", A("where's Evelyn", S[6]) + 3.4, { y: 170, size: 66, col: COL.amber });
    ING("i7", "YOU'LL NEED", [[A("pound of ground beef", S[6]), "1 LB GROUND BEEF · 1 ONION"], [A("pound of bacon", S[6]), "½ LB BACON, CHOPPED"], [A("pork and beans", S[6]), "28 OZ PORK AND BEANS"], [A("kidney beans", S[6]), "KIDNEY + BUTTER BEANS, DRAINED"], [A("ketchup", S[6]), "½ CUP KETCHUP · ½ CUP BROWN SUGAR"], [A("cider vinegar", S[6]), "2 TBSP CIDER VINEGAR"], [A("yellow mustard", S[6]), "1 TBSP YELLOW MUSTARD"]], A("Heat your oven to 350", S[6]) + 0.2);
    OVEN("o7", A("Heat your oven to 350", S[6]), "350°F", A("Heat your oven to 350", S[6]) + 3.4);
    C("tm7", A("Bake it uncovered one hour", S[6]), ["1 HOUR UNCOVERED", "OR 4 HRS LOW · SLOW COOKER"], A("Bake it uncovered one hour", S[6]) + 5);
    STAMP("vin", A("The first is the vinegar", S[6]), "#1 · THE VINEGAR", A("The first is the vinegar", S[6]) + 4);
    W("dsk", A("Don't skip it", S[6]), "DON'T SKIP IT.", A("Don't skip it", S[6]) + 2.6, { col: COL.amber, size: 96 });
    STAMP("bac", A("Keep half the bacon for the top", S[6]), "#2 · HALF THE BACON ON TOP", A("Keep half the bacon for the top", S[6]) + 4);
    W("fs", A("The first scoop", S[6] + 60), "THE FIRST SCOOP", A("The first scoop", S[6] + 60) + 3, { y: 170, size: 90 });
    MK("m71", A("Soupy beans", S[6]), 1, "SOUPY → BAKED COVERED", A("Too sweet", S[6]) - 0.1);
    MK("m72", A("Too sweet", S[6]), 2, "TOO SWEET → THE VINEGAR", A("And greasy", S[6]) - 0.1);
    MK("m73", A("And greasy", S[6]), 3, "GREASY → DRAIN THE FAT", A("And greasy", S[6]) + 4.5);
    C("cr7", A("For a crowd, double it", S[6]), ["CROWD: ROASTER · 25", "TRAVELS IN A SLOW COOKER", "FREEZE SINGLE PORTIONS"], EB - 0.9);

    // ===== las 2 fuentes que iban a la CASA, un mes después (bloque agregado para llegar a 40-50 min) =====
    W("x2", E0, "2 MORE PANS", E0 + 3, { y: 170, size: 96, col: COL.amber });
    STAMP("xh", A("these two went to the house", E0), "THESE TWO WENT TO THE HOUSE", A("these two went to the house", E0) + 3.6);
    N("xm", A("a month later", E0), "1 MONTH LATER", A("a month later", E0) + 3.4, { sub: "THE 4TH WEEK IS THE HARDEST", size: 130 });
    if (ok(E1)) { L.push(<StepTitle key="stx1" t={t} at={E1} n={1} name="FUNERAL PIE" out={E1 + 3.6} y={300} col="#ffb35a" />); L.push(<PageChip key="pcx1" t={t} at={E1 + 3.6} out={E2 - 0.5} page={17} name="RUTH HALVORSEN" />); }
    W("xk", A("It keeps", E1), "“IT KEEPS.”", A("That was all", E1) + 1.5, { y: 170, size: 100, col: COL.amber });
    C("xk2", A("Back before everybody had a refrigerator", E1), ["NO FRIDGE NEEDED", "2 DAYS ON THE COUNTER", "IT WAITS FOR THEM"], A("Back before everybody had a refrigerator", E1) + 6);
    ING("ix1", "YOU'LL NEED", [[A("A double crust", E1), "DOUBLE CRUST · 9-INCH"], [A("Two cups of raisins", E1), "2 CUPS RAISINS · 2 CUPS WATER"], [A("packed brown sugar", E1), "½ CUP BROWN + ½ CUP WHITE SUGAR"], [A("Three tablespoons of cornstarch", E1), "3 TBSP CORNSTARCH"], [A("cinnamon", E1), "½ TSP CINNAMON · ¼ TSP SALT"], [A("lemon juice", E1), "2 TBSP LEMON JUICE + 1 TSP PEEL"], [A("two tablespoons of butter", E1), "2 TBSP BUTTER"], [A("one egg beaten", E1), "1 EGG + 1 TBSP MILK"]], A("Put the raisins in a saucepan", E1));
    W("xg", A("thick and glossy", E1), "THICK AND GLOSSY · LIKE JAM", A("thick and glossy", E1) + 3.2);
    STAMP("xt1", A("Let that filling cool", E1), "LET THE FILLING COOL · 20 MIN", A("Let that filling cool", E1) + 4);
    OVEN("ox1", A("Heat your oven to 400", E1), "400°F", A("Heat your oven to 400", E1) + 3.4);
    W("x5s", A("cut five good slits", E1), "5 GOOD SLITS", A("cut five good slits", E1) + 3, { y: 170 });
    C("xtm1", A("Bake it 40 to 45 minutes", E1), ["40–45 MIN", "DEEP GOLDEN · JUICE BUBBLING", "COOL 2 HOURS"], A("Bake it 40 to 45 minutes", E1) + 6.5);
    MK("mx11", A("Leaking juice", E1), 1, "LEAKING → SLITS TOO SMALL", A("A pale top", E1) - 0.1);
    MK("mx12", A("A pale top", E1), 2, "PALE TOP → NO EGG WASH", A("And too sweet", E1) - 0.1);
    MK("mx13", A("And too sweet", E1), 3, "TOO SWEET → DON'T SKIP THE LEMON", A("And too sweet", E1) + 4.5);
    C("crx1", A("it freezes beautifully", E1), ["CROWD: KEEP 2 IN THE FREEZER", "1-2: 8 HAND PIES", "EAT 2 · FREEZE 6"], E2 - 0.6);
    if (ok(E2)) { L.push(<StepTitle key="stx2" t={t} at={E2} n={2} name="OVERNIGHT EGG BAKE" out={E2 + 3.6} y={300} col="#ffb35a" />); L.push(<PageChip key="pcx2" t={t} at={E2 + 3.6} out={S[7] - 0.5} page={60} name="IDA NELSON" />); }
    W("xfm", A("the worst part was the first morning", E2), "THE WORST PART: THE FIRST MORNING", A("the worst part was the first morning", E2) + 3.8, { y: 170, size: 70, col: COL.amber });
    W("x1p", A("what to make for one person", E2), "“I DIDN'T KNOW WHAT TO MAKE FOR ONE PERSON”", A("what to make for one person", E2) + 4, { y: 880, size: 60 });
    N("xcard", A("write the time on the card", E2), "350°F · 55 MIN", A("write the time on the card", E2) + 4, { sub: "WRITTEN ON THE CARD · SO NOBODY HAS TO THINK", size: 110 });
    ING("ix2", "YOU'LL NEED", [[A("A pound of pork sausage", E2), "1 LB PORK SAUSAGE, BROWNED"], [A("eight slices of bread", E2), "8 SLICES BREAD, CUBED"], [A("2 cups of shredded cheddar", E2), "2 CUPS CHEDDAR"], [A("10 eggs", E2), "10 EGGS · 2½ CUPS MILK"], [A("dry mustard", E2), "1 TSP DRY MUSTARD"], [A("teaspoon of salt", E2), "SALT · PEPPER"], [A("green onion", E2), "½ CUP GREEN ONION"]], A("Butter your pan", E2));
    W("xpr", A("press the bread down", E2), "PRESS IT DOWN · EVERY PIECE WET", A("press the bread down", E2) + 3.4, { col: COL.amber });
    STAMP("xt2", A("the overnight soak", E2), "THE OVERNIGHT SOAK", A("the overnight soak", E2) + 4);
    C("xtm2", A("set it out on the counter", E2), ["30 MIN ON THE COUNTER", "350°F · 50–55 MIN UNCOVERED", "160°F · REST 10 MIN"], A("Let it rest 10 minutes", E2) + 1.5);
    MK("mx21", A("a runny middle", E2), 1, "RUNNY → STRAIGHT FROM THE FRIDGE", A("Dry edges", E2) - 0.1);
    MK("mx22", A("Dry edges", E2), 2, "DRY EDGES → CHECK AT 50 MIN", A("leaving out the dry mustard", E2) - 1.2);
    MK("mx23", A("leaving out the dry mustard", E2) - 1, 3, "BLAND → THE DRY MUSTARD", A("leaving out the dry mustard", E2) + 3.5);
    C("crx2", A("two pans feed 24", E2), ["CROWD: 2 PANS · 24", "1-2: LOAF PAN · ⅓", "FRIDGE 3 DAYS"], A("And honey, if you're making it", E2) - 0.2);
    W("xsq", A("cut it in squares before you bring it", E2), "CUT IN SQUARES · A FEW FOR THE FREEZER", A("cut it in squares before you bring it", E2) + 4, { y: 170, size: 64 });
    const X355 = A("one of the young mothers", E2);
    if (ok(X355)) L.push(<div key="x355" style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 76, color: "#ffd38a", textShadow: "0 4px 24px rgba(0,0,0,.7)", opacity: e(t, X355 + 2.5, X355 + 2.9) * (1 - e(t, X355 + 7.4, X355 + 7.8)) }}>“350°F. 55 minutes.”</div>);

    // ===== Harold · la tarjetita · el cierre =====
    N("11y", A("Eleven years ago", S[7]) > 0 ? A("Eleven years ago", S[7]) : A("11 years ago", S[7]), "11 YEARS AGO", (A("Eleven years ago", S[7]) > 0 ? A("Eleven years ago", S[7]) : A("11 years ago", S[7])) + 3.6, { sub: "MARCH · A LATE SNOW", size: 130 });
    W("fam", A("as the family", S[7]), "THIS TIME, I WAS THE FAMILY", A("as the family", S[7]) + 3.6, { y: 170, col: COL.amber, size: 74 });
    W("nr", A("without reading a card", S[7]), "I KNEW EVERY PAN WITHOUT A CARD", A("without reading a card", S[7]) + 3.6, { y: 880, size: 70 });
    if (ok(A("we know, Loretta", S[7]))) L.push(<div key="wk" style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 76, color: "#fff3dc", textShadow: "0 4px 24px rgba(0,0,0,.7)", opacity: e(t, A("we know, Loretta", S[7]), A("we know, Loretta", S[7]) + 0.4) * (1 - e(t, A("we know, Loretta", S[7]) + 4.4, A("we know, Loretta", S[7]) + 4.8)) }}>“We know, Loretta. We're here.”</div>);
    STAMP("wm2", A("Mom always waited a month", S[7]), "“MOM ALWAYS WAITED A MONTH”", A("Mom always waited a month", S[7]) + 4.2, 330);
    if (ok(A("So that somebody's daughter", S[7]))) L.push(<div key="sd" style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 70, color: "#ffd38a", textShadow: "0 4px 24px rgba(0,0,0,.7)", opacity: e(t, A("So that somebody's daughter", S[7]), A("So that somebody's daughter", S[7]) + 0.4) * (1 - e(t, A("So that somebody's daughter", S[7]) + 4.6, A("So that somebody's daughter", S[7]) + 5)) }}>“…will know to wait a month.”</div>);
    W("wc", A("Write the card", S[7]), "WRITE THE CARD", A("Write the card", S[7]) + 3, { size: 100, col: COL.amber });
    C("why", A("Two reasons", S[7]), ["SO THE PAN COMES HOME", "SO THEY CAN THANK YOU"], A("A pan with no card") - 0.1);
    STAMP("nc2", A("A pan with no card"), "A PAN WITH NO CARD = A KINDNESS NOBODY CAN THANK", A("A pan with no card") + 4.4, 330);
    W("back", A("on the back of the card"), "ON THE BACK: WHAT IT IS · HOW TO WARM IT", A("on the back of the card") + 4.2, { y: 170, size: 62 });
    W("flw", A("nobody ever ate flowers"), "NOBODY EVER ATE FLOWERS", A("nobody ever ate flowers") + 3.2, { size: 92, col: COL.amber });
    W("whose", A("they remember whose pan it was"), "THEY REMEMBER WHOSE PAN IT WAS", A("they remember whose pan it was") + 3.8, { y: 170, size: 74 });
    C("plan", A("Make one"), ["MAKE ONE", "TWO 8×8 PANS", "BAKE ONE · FREEZE ONE", "NAME ON THE FOIL"], A("Make one") + 9);
    W("cm", A("come down to the comments"), "WHICH ONE DID YOUR CHURCH BRING?", A("come down to the comments") + 5, { y: 170, size: 70 });
    L.push(<BookCTA key="cta3" t={t} at={A("is in the first line of the description", S[7] + 200)} out={A("is in the first line of the description", S[7] + 200) + 5} sub="50 RECIPES · LINK IN THE 1ST LINE OF THE DESCRIPTION" />);
    if (ok(A("And next time"))) L.push(<AbsoluteFill key="ncw" style={{ transform: "scale(0.84)", transformOrigin: "1900px 150px" }}><NextCard key="nc" t={t} at={A("And next time")} subAt={A("the funeral ham buns")} out={A("And next time") + 7} title="NEXT: THE FUNERAL HAM BUNS"><AbsoluteFill style={{ background: "#efe7d6", alignItems: "center", justifyContent: "center" }}><Img src={staticFile("ck2510a/book_p028.jpg")} style={{ height: "100%", objectFit: "contain" }} /></AbsoluteFill></NextCard></AbsoluteFill>);
    if (ok(A("Now go find a pan"))) L.push(<LowerThird key="lt" t={t} at={A("Now go find a pan") - 0.3} out={TEND - 0.6} name="LORETTA" l2="SOMEBODY OUT THERE NEEDS ONE" l2at={A("Somebody out there")} />);
    return L;
  },
});

export const Rest: React.FC = () => <V.Body />;
export const clipPlan = V.clipPlan;
export const beatTable = V.beatTable;
