// ck2510d · «9 Church Pies Your Grandmother Took to the Grave» · el video ENTERO (0 → final) con la vara de lcf01:
// una base por frase —toma de Loretta haciendo lo que cuenta (LTX) / la cocina 3D / el avatar— y CERO cortes secos;
// las piezas 2.5D viven encima y cruzan las transiciones. La cocina es UNA escena 3D (kitchen3d.tsx): cada "W" es la
// cámara en un rincón (la fila de los 9 pasteles con el de turno resaltado, el horno con ese pastel, el plato, el libro
// abierto en su página REAL —p.12 la masa, p.18 el crumble—, la perilla). Cuadro 0 = la miniatura sin texto.
// Orden y anclas de las bases: beats.json (D:/rtmp_ck2510d/mk_beats.py). Piezas ancladas a la palabra con at().
// Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { KitchenWorld, Scene, BOOK } from "./kitchen3d";
import { COL, e, setSlug } from "../kits/yanqui3d/lib";
import { makeVideo, Beat } from "../kits/yanqui3d/engine";
import { CoolClock, OvenDial, PieBadge, PieTitle, Quote, RecipeCard, Stat, ZItem, ZocaloStack } from "./ui";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import RB from "./beats.json";

setSlug("ck2510d");
export const T0 = 0, TEND = RB.TEND;
export const FULL_FRAMES = Math.ceil(TEND * 30);

// ---------------- cámaras de la cocina por escena (u = segundos desde que entra la toma) ----------------
type V3 = [number, number, number];
const mix = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const sm = (x: number) => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };
const drift = (p0: V3, p1: V3, l0: V3, l1: V3, f0: number, f1: number, u: number, dur = 9) => {
  const k = sm(u / dur);
  return { p: mix(p0, p1, k), l: mix(l0, l1, k), fov: f0 + (f1 - f0) * k };
};
const PLATE: V3 = [-0.08, 0.8, -0.45], OVENWIN: V3 = [1.18, 0.4, -2.35], KNOB: V3 = [1.25, 1.02, -2.28];
const BK: V3 = [BOOK[0] - 0.02, BOOK[1] + 0.02, BOOK[2]];
const ROWZ = (n: number) => -1.6 + (n - 1) * 0.355;   // = DISH_ROW de kitchen3d

const sceneOf = (name: string, u: number): Scene => {
  const [kind, arg = ""] = name.split(":");
  const n = parseInt(arg) || 0, side = n % 2 ? 1 : -1;
  if (kind === "book") {
    const pg = arg.slice(0, 3), v = arg.slice(3);
    const top = drift([BK[0] + 0.05, BK[1] + 0.42, BK[2] + 0.3], [BK[0] - 0.04, BK[1] + 0.3, BK[2] + 0.12], [BK[0] - 0.03, BK[1], BK[2] - 0.01], [BK[0] - 0.01, BK[1], BK[2] - 0.01], 34, 30, u, 8);
    if (pg === "001") {
      // la tapa: entra (001), la vuelve a mostrar a mitad de camino (001b) o la mesa se aleja al final (001c)
      if (v === "c") return { cam: drift([BK[0] + 0.1, BK[1] + 0.3, BK[2] + 0.28], [1.4, 1.35, 0.8], BK, [0.3, 0.8, -0.45], 32, 40, u, 11), book: { open: 0, page: "012" }, st: { plateDish: true }, kind: 9 };
      return { cam: top, book: { open: v === "b" ? sm((u - 1.2) / 1.3) : 0, page: "012" } };
    }
    if (pg === "012") return { cam: top, book: v === "b" ? { open: 1, page: "012" } : { open: 1, page: "012", from: "011", turn: sm((u - 0.6) / 1.2) } };
    // p.18 (el crumble del pastel de manzana): la hoja pasa de la 12 a la 18
    return { cam: drift([BK[0] + 0.0, BK[1] + 0.4, BK[2] + 0.16], [BK[0] + 0.02, BK[1] + 0.3, BK[2] + 0.07], [BK[0] - 0.02, BK[1], BK[2] - 0.01], [BK[0] + 0.02, BK[1], BK[2] - 0.01], 34, 30, u, 9), book: { open: 1, page: pg, from: "012", turn: sm((u - 0.3) / 1.2) } };
  }
  if (kind === "oven") {
    // la puerta se abre, el calor en la cara y sale el pastel de turno
    const open = sm((u - 0.4) / 0.9), out = sm((u - 1.8) / 1.3);
    return { cam: drift([1.2 + 0.04 * side, 0.64, -1.42], [1.18, 0.84, -1.6], [1.18, 0.42, -2.4], [1.18, 0.36, -2.14], 38, 33, u, 4.5), st: { door: open, dishOut: out, heat: open * (1 - sm((u - 4) / 1.2)) }, kind: n };
  }
  if (kind === "bake") {
    // la puerta cerrada, la luz del horno y el pastel burbujeando del otro lado del vidrio
    return { cam: drift([1.24 + 0.05 * side, 0.6, -1.5], [1.2, 0.48, -1.85], OVENWIN, [1.18, 0.38, -2.4], 34, 27, u, 8), kind: n };
  }
  if (kind === "plate") {
    return { cam: drift([0.05 + 0.32 * side, 1.18, 0.35], [-0.12 + 0.12 * side, 1.02, 0.02], PLATE, [PLATE[0], 0.79, PLATE[2]], 36, 29, u, 8), st: { plateDish: true }, kind: n };
  }
  if (kind === "row") {
    // n = el pastel de turno: la cámara baja hasta él (los demás se apagan un poco); sin n = la mesa entera de punta a punta
    if (n) { const z = ROWZ(n); return { cam: drift([-1.85, 1.42, z + 0.55 * side], [-2.12, 1.17, z + 0.18 * side], [-2.72, 0.95, z + 0.2 * side], [-2.72, 0.95, z], 38, 29, u, 6), st: { row: true, rowDim: sm((u - 0.6) / 0.8) }, rowHi: n }; }
    return { cam: drift([-1.55, 1.5, -1.95], [-1.72, 1.38, 0.95], [-2.72, 0.95, -1.4], [-2.72, 0.95, 1.1], 40, 36, u, 10), st: { row: true } };
  }
  if (kind === "dial") {
    return { cam: drift([1.32, 1.1, -1.88], [1.26, 1.05, -2.02], KNOB, KNOB, 30, 24, u, 5), dial: 0.72 * sm((u - 0.5) / 1.1), st: { ovenLight: sm((u - 1.4) / 0.6) } };
  }
  return { cam: drift([2.0, 1.5, 1.45], [1.62, 1.4, 1.0], [0.35, 0.8, -0.45], [0.3, 0.8, -0.45], 40, 37, u) };
};

// cuadro 0: la miniatura elegida sin texto (si todavía no está, arranca directo con la toma del gancho)
const Thumb0: React.FC<{ t: number }> = ({ t }) => (AVAIL.imgs.includes("thumb0") && t < 0.9 ?
  <AbsoluteFill style={{ opacity: 1 - e(t, 0.55, 0.9) }}><Img src={staticFile("ck2510d/img_thumb0.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill> : null);

type AvWin = { ms: number; me: number; off: number };
const V = makeVideo({
  caps: CAPS as [string, number][], avwin: ((AVW as unknown as { win: AvWin[] }).win).map((w) => [w.ms, w.me, w.off]), avail: AVAIL as { clips: string[]; imgs: string[] }, T0, TEND, flashAtStart: false,
  beats: ({ AV, CL, Clip }) => (RB.beats as { a: number; kind: string; k?: string; at?: number; rate?: number; scene?: string; tr: Beat["tr"] }[]).map((b) =>
    b.kind === "AV" ? AV(b.a, b.tr)
      // ventana 0 del reel (0 → ~3,5 s): el motor la desfasa 10 cuadros al empezar en 0 → se monta acá, reel desde el cuadro 0
      : b.kind === "AV0" ? ({ a: b.a, tr: b.tr, r: () => <AbsoluteFill style={{ background: "#000" }}><Sequence from={0} durationInFrames={150} layout="none"><OffthreadVideo src={staticFile("ck2510d/reel0.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence></AbsoluteFill> } as Beat)
      : b.kind === "CL" && b.at != null ? ({ a: b.a, tr: b.tr, k: b.k, r: () => <AbsoluteFill><Clip k={b.k as string} a={b.at as number} dur={28} z={[1.02, 1.1]} rate={b.rate} /></AbsoluteFill> } as Beat)   // la toma larga de Loretta sigue después del avatar
      // toma más larga que su clip de 10 s → cámara lenta suave (rate ≥ 0,7, mk_beats.py) en vez de congelar el último cuadro
      : b.kind === "CL" && b.rate ? ({ a: b.a, tr: b.tr, k: b.k, r: () => <AbsoluteFill><Clip k={b.k as string} a={b.a} dur={14} z={[1.02, 1.1]} rate={b.rate} /></AbsoluteFill> } as Beat)
      : b.kind === "CL" ? CL(b.a, b.k as string, b.tr, undefined, [1.02, 1.1])
        : ({ a: b.a, tr: b.tr, p: [960, 540], r: (t: number) => <KitchenWorld t={t} sc={sceneOf(b.scene as string, t - b.a)} /> } as Beat)),
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    const A = (ph: string, after = 0) => at(ph, after);
    // 2ª pasada: TODO el texto va al zócalo de noticiero (abajo-izq); la pestaña dice de qué parte del video estamos
    const ZS: ZItem[] = []; let sec = "SUNDAY · JUNE 1962";
    const Z = (key: string, a: number, out: number, tone: ZItem["tone"], label: string, txt: string, x: Partial<ZItem> = {}) => ZS.push({ key, a, out, tone, label, txt, ...x });
    const W = (key: string, a: number, txt: string, out: number, o: { y?: number; size?: number; col?: string } = {}) =>
      o.col === COL.amber ? Z(key, a, out, "tip", "LORETTA'S TIP", txt) : o.col === "#ff8a6a" ? Z(key, a, out, "warn", "WATCH OUT", txt) : Z(key, a, out, "note", sec, txt);
    const TIP = (key: string, a: number, txt: string, out: number) => Z(key, a, out, "tip", "LORETTA'S TRICK", txt);
    const CHIPS = (key: string, a: number, items: string[], out: number, label = sec) => Z(key, a, out, "list", label, "", { items: items.map((txt, i) => ({ at: a + i * 0.45, txt })) });
    const BOOK = (key: string, a: number, out: number, sub = "LINK IN THE 1ST LINE OF THE DESCRIPTION") => Z(key, a, out, "book", "MY COOKBOOK", "Loretta's Church Supper Cookbook", { sub });
    const N = (key: string, a: number, text: string, out: number, o: { sub?: string } = {}) => L.push(<Stat key={key} t={t} at={a} out={out} text={text} sub={o.sub} />);
    const ING = (key: string, title: string, rows: [number, string][], out: number) => L.push(<RecipeCard key={key} t={t} title={title} rows={rows.map(([a, txt]) => ({ at: a, txt }))} out={out} />);
    const OVEN = (key: string, a: number, temp: string, out: number, sub = "OVEN") => L.push(<OvenDial key={key} t={t} at={a} out={out} text={temp} sub={sub} x={1600} y={400} />);
    const COOL = (key: string, a: number, label: string, out: number) => L.push(<CoolClock key={key} t={t} at={a} out={out} label={label} />);
    // título del pastel (número dorado a la izquierda) + la ficha con la dueña que se queda mientras dura su pastel
    const PIE = (n: number, name: string, owner: string, a: number, titleOut: number, out: number) => {
      sec = `PIE ${n} · ${name.replace(/ PIE$/, "")}`;
      L.push(<PieTitle key={"st" + n} t={t} at={a} n={n} name={name} out={titleOut} />);
      L.push(<PieBadge key={"pc" + n} t={t} at={titleOut} out={out} n={n} name={owner} />);
    };
    const WHO = (key: string, a: number, name: string, l2: string, out: number) => Z(key, a, out, "name", "SHE BAKED IT", name, { sub: l2 });
    const MIS = (key: string, a: number, n: number, txt: string, out: number) => Z(key, a, out, "warn", "THE MISTAKE", txt, { n });

    // ===== el gancho: el sótano de la iglesia, 1962, treinta pasteles =====
    CHIPS("when", A("It's a Sunday in June"), ["SUNDAY · JUNE 1962", "A LITTLE WHITE CHURCH", "IOWA"], A("You come down the basement") + 2.5);
    N("30", A("on it are thirty pies"), "30", A("Every woman in that church"), { sub: "PIES ON ONE TABLE", y: 330 });
    W("hz", A("The gooseberry was Hazel's"), "GOOSEBERRY · HAZEL'S", A("The grape pie was Ruth's"), { y: 170 });
    W("rt", A("The grape pie was Ruth's"), "GRAPE · RUTH'S", A("The one that looked like plain water"), { y: 170 });
    W("lb", A("The one that looked like plain water"), "WATER PIE · MRS. ALBRECHT'S", A("Well, honey, I'm eighty-one") , { y: 170, size: 74 });
    CHIPS("who", A("I'm eighty-one years old"), ["81 YEARS OLD", "STILL BAKES EVERY ONE"], A("Nine of them.") + 1.6);
    N("9", A("Nine of them."), "9", A("Pie plant custard, the spring one"), { sub: "PIES THAT WENT TO THE GRAVE", y: 330 });
    TIP("nb", A("almost nobody alive has ever tasted"), "ALMOST NOBODY ALIVE HAS TASTED IT", A("I'll give you every measurement") - 0.2);
    CHIPS("prom", A("I'll give you every measurement"), ["EVERY MEASUREMENT", "EVERY OVEN TEMPERATURE", "THE WHISPERED TRICK"], A("And stay with me all the way") - 0.2);
    W("mis9", A("there's a mistake in it"), "THE MISTAKE IN #9 THAT RUINED THE MOST PIES", A("so get your coffee"), { y: 170, size: 64, col: "#ff8a6a" });

    // ===== quién es, la primera vez, el libro y la masa · p.12 =====
    sec = "MY NEVER-FAIL CRUST";
    W("19", A("I was nineteen the first time"), "19 · MY FIRST CHURCH PIE", A("nobody touched mine") + 3, { y: 170 });
    W("10y", A("It took me ten years"), "TEN YEARS OF WATCHING", A("look at this page right here") - 0.2, { y: 170 });
    W("egg", A("Butter the size of an egg"), "\u201CBUTTER THE SIZE OF AN EGG\u201D", A("Butter the size of an egg") + 4.5, { y: 170, size: 74 });
    BOOK("cta0", A("Loretta's Church Supper Cookbook"), A("Two and a half cups of flour") - 0.1, "MY CRUST · PAGE 12");
    ING("crust", "MY NEVER-FAIL CRUST", [[A("Two and a half cups of flour"), "2½ CUPS FLOUR"], [A("one teaspoon of salt"), "1 TSP SALT · 1 TBSP SUGAR"], [A("half a cup of cold butter"), "½ CUP COLD BUTTER"], [A("half a cup of cold lard"), "½ CUP COLD LARD"]], A("you cut that in") + 4);
    W("vin", A("Stir one teaspoon of white vinegar"), "1 TSP VINEGAR IN 6 TBSP ICE WATER", A("Stir one teaspoon of white vinegar") + 6, { col: COL.amber, size: 74 });
    W("str", A("never stretch it to fit"), "NEVER STRETCH IT TO FIT", A("never stretch it to fit") + 4, { y: 170 });
    BOOK("cta1", A("The link is in the first line"), A("Number one is pie plant pie") - 0.2);

    // ===== 1 · pie plant (rhubarb) custard · Edna Voss =====
    const p1 = A("Number one is pie plant pie"), p2 = A("Number two is gooseberry pie");
    PIE(1, "PIE PLANT PIE", "EDNA VOSS", p1, p1 + 3.2, p2 - 0.3);
    W("pp", A("That's what my grandmother called rhubarb"), "PIE PLANT = RHUBARB", A("Because that's all anybody"), { y: 170 });
    WHO("ed", A("was Edna Voss"), "EDNA VOSS", "THE BEST RHUBARB PIE AT CHURCH", A("was Edna Voss") + 5);
    ING("i1", "PIE PLANT CUSTARD", [[A("You need three cups of rhubarb"), "3 CUPS RHUBARB · ½ IN"], [A("Three eggs."), "3 EGGS"], [A("One and a half cups of sugar", p1), "1½ CUPS SUGAR"], [A("Three tablespoons of flour", p1), "3 TBSP FLOUR"], [A("A quarter teaspoon of nutmeg"), "¼ TSP NUTMEG"], [A("Two tablespoons of milk"), "2 TBSP MILK · 1 TBSP BUTTER"]], A("Heat your oven to four hundred", p1));
    OVEN("o1", A("Heat your oven to four hundred", p1), "400°F", A("Heat your oven to four hundred", p1) + 4.5, "LOW RACK");
    TIP("lat", A("She always put a lattice on top"), "LATTICE · NEVER A FULL CRUST", A("The lattice lets the steam out") + 1.5);
    W("soup", A("You get rhubarb soup in a crust"), "OR YOU GET RHUBARB SOUP", A("You get rhubarb soup in a crust") + 3, { col: "#ff8a6a" });
    N("5060", A("for fifty to sixty minutes"), "50–60", A("for fifty to sixty minutes") + 5, { sub: "MINUTES", col: "#ffb35a", edge: "#5a1e08", y: 330 });
    COOL("c1", A("At least two hours, honey"), "COOL 2 HOURS", A("At least two hours, honey") + 3.5);
    MIS("m1", A("The mistake most people make is too much rhubarb"), 1, "TOO MUCH RHUBARB · 3 CUPS, NOT 6", A("Three cups.", A("The mistake most people make is too much rhubarb")) + 2.5);
    W("3d1", A("It keeps three days in the refrigerator"), "KEEPS 3 DAYS · ALWAYS COLD", A("It keeps three days in the refrigerator") + 4, { y: 170 });

    // ===== 2 · gooseberry · Hazel Ostrander =====
    const p3 = A("Number three is a pie most people");
    PIE(2, "GOOSEBERRY PIE", "HAZEL OSTRANDER", p2, p2 + 3.2, p3 - 0.3);
    W("cry", A("the one that made me cry at nineteen"), "THE ONE THAT MADE ME CRY AT 19", A("Have you ever eaten a gooseberry"), { y: 170, size: 70 });
    W("ear", A("striped like a tiny watermelon"), "STRIPED LIKE A TINY WATERMELON", A("striped like a tiny watermelon") + 3.5, { y: 170, size: 70 });
    ING("i2", "GOOSEBERRY PIE", [[A("You need four cups of gooseberries"), "4 CUPS GOOSEBERRIES"], [A("One and a half cups of sugar", p2), "1½ CUPS SUGAR"], [A("Three tablespoons of quick-cooking tapioca"), "3 TBSP QUICK TAPIOCA"], [A("A quarter teaspoon of salt", p2), "¼ TSP SALT · 1 TBSP BUTTER"]], A("Here's Hazel's trick"));
    TIP("hz1", A("take one cup of those gooseberries"), "COOK 1 CUP FIRST", A("Then take it off the heat") + 0.5);
    W("sauce", A("makes a sweet, thick sauce"), "A SWEET SAUCE THE OTHERS COOK IN", A("makes a sweet, thick sauce") + 4, { col: COL.amber, size: 72 });
    OVEN("o2", A("Bake it at four hundred and twenty-five"), "425°F", A("then turn it down to three seventy-five", p2) - 0.1, "15 MIN");
    OVEN("o2b", A("then turn it down to three seventy-five", p2), "375°F", A("then turn it down to three seventy-five", p2) + 4.5, "35–40 MIN");
    MIS("m2", A("The mistake is cutting it warm"), 2, "CUTTING IT WARM", A("Fruit pie needs at least two hours") + 1);
    COOL("c2", A("Fruit pie needs at least two hours"), "SET 2 HOURS", A("Fruit pie needs at least two hours") + 4);

    // ===== 3 · ground cherry · Martha Hinrichs =====
    const p4 = A("Number four is Concord grape pie");
    PIE(3, "GROUND CHERRY PIE", "MARTHA HINRICHS", p3, p3 + 3.2, p4 - 0.3);
    W("lan", A("grows inside a papery husk"), "IN A LITTLE PAPER LANTERN", A("grows inside a papery husk") + 3.5, { y: 170 });
    W("fall", A("Only gather the ones that have fallen"), "ONLY THE ONES THAT FELL", A("Only gather the ones that have fallen") + 3.5, { col: COL.amber });
    ING("i3", "GROUND CHERRY PIE", [[A("about three cups of ground cherries"), "3 CUPS GROUND CHERRIES"], [A("Half a cup of packed brown sugar", p3), "½ CUP BROWN SUGAR"], [A("One tablespoon of flour", p3), "1 TBSP FLOUR"], [A("Three tablespoons of water"), "3 TBSP WATER"], [A("And one tablespoon of lemon juice", p3), "1 TBSP LEMON JUICE"]], A("Martha's trick was the lemon juice") - 0.2);
    TIP("lem", A("Martha's trick was the lemon juice"), "1 SPOON OF LEMON WAKES THEM UP", A("That one tablespoon of lemon") + 2.5);
    OVEN("o3", A("Bake it at four twenty-five", p3), "425°F", A("then turn it down to three-fifty", p3) - 0.1, "15 MIN");
    OVEN("o3b", A("then turn it down to three-fifty", p3), "350°F", A("Cool it two hours"), "25–30 MIN");
    COOL("c3", A("Cool it two hours"), "COOL 2 HOURS", A("The mistake is husking them days ahead") - 0.1);
    MIS("m3", A("The mistake is husking them days ahead"), 3, "HUSKING THEM DAYS AHEAD", A("The mistake is husking them days ahead") + 5);

    // ===== 4 · concord grape · Ruth Petersen =====
    const p5 = A("Number five is elderberry pie");
    PIE(4, "CONCORD GRAPE PIE", "RUTH PETERSEN", p4, p4 + 3.2, p5 - 0.3);
    W("1h", A("this is the one-hour pie"), "THE ONE-HOUR PIE", A("It takes some patience") + 1.5, { y: 170 });
    ING("i4", "CONCORD GRAPE PIE", [[A("four cups of Concord grapes"), "4 CUPS CONCORD GRAPES"], [A("One cup of sugar", p4), "1 CUP SUGAR"], [A("A quarter cup of flour", p4), "¼ CUP FLOUR"], [A("One tablespoon of lemon juice", p4), "1 TBSP LEMON JUICE"], [A("An eighth of a teaspoon of salt"), "⅛ TSP SALT · 1 TBSP BUTTER"]], A("take each grape and pinch it") - 0.1);
    W("pin", A("take each grape and pinch it"), "PINCH · SKINS IN ONE BOWL, PULP IN A PAN", A("take each grape and pinch it") + 5, { y: 170, size: 60 });
    TIP("skin", A("The skins go back in"), "THE SKINS GO BACK IN", A("The hot pulp softens them") + 2);
    OVEN("o4", A("Bake it at four hundred, low rack"), "400°F", A("Bake it at four hundred, low rack") + 5, "40–45 MIN");
    MIS("m4", A("The mistake is skipping the sieve"), 4, "SKIPPING THE SIEVE", A("The mistake is skipping the sieve") + 5);

    // ===== 5 · elderberry · mother =====
    const p6 = A("Number six is Bob Andy pie");
    PIE(5, "ELDERBERRY PIE", "MY MOTHER", p5, p5 + 3.2, p6 - 0.3);
    W("ditch", A("this one comes from the roadside ditch"), "FROM THE ROADSIDE DITCH", A("Every gravel road in Iowa") + 2.5, { y: 170 });
    W("purp", A("My arms would be purple to the elbows"), "PURPLE TO THE ELBOWS", A("My arms would be purple to the elbows") + 3.5, { y: 170 });
    W("ck", A("they are always cooked"), "ALWAYS COOKED · NEVER RAW", A("they are always cooked") + 4, { col: "#ff8a6a" });
    TIP("frz", A("was the freezer"), "FREEZE THE CLUSTERS 1 HOUR", A("run a fork down the cluster") + 3.5);
    ING("i5", "ELDERBERRY PIE", [[A("three and a half cups of stemmed"), "3½ CUPS ELDERBERRIES"], [A("One cup of sugar", p5), "1 CUP SUGAR"], [A("A third of a cup of flour"), "⅓ CUP FLOUR"], [A("A quarter teaspoon of salt", p5), "¼ TSP SALT"], [A("And three tablespoons of lemon juice"), "3 TBSP LEMON OR VINEGAR"]], A("Now for the top") - 0.1);
    ING("cr5", "CRUMB TOP · PAGE 18", [[A("Three quarters of a cup of flour"), "¾ CUP FLOUR"], [A("half a cup of packed brown sugar", A("Three quarters of a cup of flour") - 1), "½ CUP BROWN SUGAR"], [A("half a cup of rolled oats"), "½ CUP ROLLED OATS"], [A("six tablespoons of cold butter"), "6 TBSP COLD BUTTER"]], A("Squeeze the crumb into clumps") - 0.1);
    W("clmp", A("Squeeze the crumb into clumps"), "SQUEEZE IT INTO CLUMPS", A("If you sprinkle it like sand") + 2.5, { col: COL.amber });
    OVEN("o5", A("Bake at four hundred for twenty minutes"), "400°F", A("then turn it down to three seventy-five", p5) - 0.1, "20 MIN");
    OVEN("o5b", A("then turn it down to three seventy-five", p5), "375°F", A("Cool two hours"), "30–35 MIN");
    MIS("m5", A("The mistake people make is picking elderberries"), 5, "PICKING THEM TOO EARLY", A("The mistake people make is picking elderberries") + 5);
    BOOK("cta2", A("The book has fifty church supper recipes"), A("Number six is Bob Andy pie") - 0.3, "50 RECIPES · LINK IN THE 1ST LINE OF THE DESCRIPTION");

    // ===== 6 · bob andy · the Mennonite ladies =====
    const p7 = A("Number seven is lemon sponge pie");
    PIE(6, "BOB ANDY PIE", "THE MENNONITE LADIES", p6, p6 + 3.2, p7 - 0.3);
    W("who6", A("Who in the world is Bob Andy"), "WHO IN THE WORLD IS BOB ANDY?", A("Well, honey, I've heard about four"), { y: 170, size: 74 });
    W("mul", A("Bob and Andy were his two best mules"), "BOB AND ANDY = HIS TWO BEST MULES", A("Bob and Andy were his two best mules") + 4.5, { y: 170, size: 66 });
    ING("i6", "BOB ANDY PIE", [[A("one cup of sugar", p6), "1 CUP SUGAR · 2 TBSP FLOUR"], [A("Half a teaspoon of cinnamon"), "½ TSP CINNAMON"], [A("A quarter teaspoon of ground cloves"), "¼ TSP CLOVES"], [A("Two eggs, separated"), "2 EGGS, SEPARATED"], [A("One tablespoon of butter, melted"), "1 TBSP MELTED BUTTER"], [A("one and a quarter cups of milk"), "1¼ CUPS MILK"]], A("Now here's the trick", p6) - 0.1);
    W("pk", A("beat the egg whites until they hold soft peaks"), "WHITES TO SOFT PEAKS", A("Then fold them gently"), { col: COL.amber });
    TIP("fold", A("Fold, honey, don't stir"), "FOLD · DON'T STIR", A("Do it again.", p6) + 1.5);
    OVEN("o6", A("Bake it at four twenty-five for ten minutes"), "425°F", A("Bake it at four twenty-five for ten minutes") + 3.5, "10 MIN");
    OVEN("o6b", A("then turn it down to three-fifty", p6), "350°F", A("then turn it down to three-fifty", p6) + 4.5, "35–45 MIN");
    MIS("m6", A("The mistake is a cold bowl"), 6, "A SPECK OF YOLK IN THE WHITES", A("you've only lost one egg") + 1);

    // ===== 7 · lemon sponge · Dorothy Kauffman =====
    const p8 = A("Number eight is the one that sounds like a joke");
    PIE(7, "LEMON SPONGE PIE", "DOROTHY KAUFFMAN", p7, p7 + 3.2, p8 - 0.3);
    W("2l", A("It separates in the oven into two layers"), "TWO LAYERS · ALL BY ITSELF", A("A creamy lemon custard on the bottom") + 3, { y: 170 });
    ING("i7", "LEMON SPONGE PIE", [[A("one cup of sugar", p7), "1 CUP SUGAR · 3 TBSP FLOUR"], [A("Two tablespoons of soft butter"), "2 TBSP SOFT BUTTER"], [A("Three eggs, separated"), "3 EGGS, SEPARATED"], [A("The grated peel and the juice of one lemon"), "1 LEMON · PEEL + JUICE"], [A("one and a half cups of milk", p7), "1½ CUPS MILK"]], A("Beat in the egg yolks one at a time") - 0.1);
    TIP("lfirst", A("put the lemon juice in before the milk"), "LEMON FIRST · THEN THE MILK", A("Lemon first, then the milk slowly") + 2);
    OVEN("o7", A("Bake it on the lower third of the oven"), "40–45", A("Bake it on the lower third of the oven") + 5, "MIN · LOWER THIRD");
    MIS("m7", A("The mistake is opening the oven door"), 7, "PEEKING IN THE FIRST 20 MIN", A("The mistake is opening the oven door") + 5);

    // ===== 8 · water pie · Lena Albrecht =====
    const p9 = A("Number nine. The one I've been telling you");
    PIE(8, "WATER PIE", "LENA ALBRECHT", p8, p8 + 3.2, p9 - 0.3);
    W("nm", A("not one egg in it, and not one drop of milk"), "NO EGGS · NO MILK", A("Water pie comes from the hard years"), { y: 170 });
    W("30s", A("Water pie comes from the hard years"), "THE 1930s · THE HARD YEARS", A("Water pie comes from the hard years") + 4, { y: 170 });
    ING("i8", "WATER PIE", [[A("One and a half cups of hot water"), "1½ CUPS HOT TAP WATER"], [A("One cup of sugar", p8), "1 CUP SUGAR"], [A("Four tablespoons of flour"), "4 TBSP FLOUR"], [A("One teaspoon of vanilla"), "1 TSP VANILLA"], [A("five tablespoons of butter"), "5 TBSP BUTTER, THIN SLICES"]], A("Heat your oven to four hundred", p8) + 3);
    TIP("nost", A("Don't stir it.", p8), "DON'T STIR IT · NOT EVEN ONCE", A("The sugar sinks, the flour floats") + 3);
    OVEN("o8", A("bake it at four hundred for thirty minutes"), "400°F", A("Then turn it down to three seventy-five for thirty", p8) - 0.1, "30 MIN");
    OVEN("o8b", A("Then turn it down to three seventy-five for thirty", p8), "375°F", A("Then turn it down to three seventy-five for thirty", p8) + 4, "30 MIN MORE");
    COOL("c8", A("Let it cool on the counter at least three hours"), "COOL 3 HOURS", A("Let it cool on the counter at least three hours") + 4);
    MIS("m8", A("The mistake is the one I made the first time"), 8, "ADDING AN EGG \u201CTO BE SAFE\u201D", A("tough and rubbery") + 1.5);

    // ===== 9 · real mincemeat · grandmother Ida · EL ERROR =====
    const end9 = A("Last Thanksgiving, I made my grandmother's");
    PIE(9, "REAL MINCEMEAT PIE", "GRANDMOTHER IDA", p9, p9 + 3.2, end9 - 0.3);
    W("bf", A("With beef in it"), "WITH REAL BEEF IN IT", A("Now, I know.", p9), { y: 170, col: COL.amber });
    W("mm", A("That's why it's called mincemeat"), "MINCEMEAT = MINCED MEAT", A("Minced meat.") + 2, { y: 170 });
    N("51", A("every Thanksgiving for fifty-one years"), "51", A("every Thanksgiving for fifty-one years") + 4, { sub: "THANKSGIVINGS", y: 330 });
    N("1964", A("in nineteen sixty-four"), "1964", A("It took my mother three years"), { sub: "NOBODY KNEW HOW", y: 330 });
    ING("i9", "REAL MINCEMEAT", [[A("A quarter pound of beef suet"), "¼ LB BEEF SUET"], [A("Four cups of tart apples"), "4 CUPS TART APPLES"], [A("One and a half cups of raisins"), "1½ CUPS RAISINS · 1 CUP CURRANTS"], [A("One and a half cups of packed brown sugar"), "1½ CUPS BROWN SUGAR"], [A("One cup of apple cider"), "1 CUP CIDER · ½ CUP MOLASSES"], [A("One teaspoon of cinnamon"), "CINNAMON · CLOVES · NUTMEG · ALLSPICE"]], A("First, put the beef in a pot") - 0.1);
    W("2h", A("simmer it until it's fork-tender"), "SIMMER THE BEEF · ABOUT 2 HOURS", A("Let it cool, then chop it very fine"), { y: 170, size: 70 });
    W("ls", A("cook it low and slow"), "LOW AND SLOW · 1 TO 1½ HOURS", A("cook it low and slow") + 5, { y: 170, size: 70 });
    W("nb9", A("so there was never any brandy in it"), "NO BRANDY · CIDER INSTEAD", A("She used cider instead") + 3, { y: 170 });
    MIS("m9", A("It's this.", A("here's the mistake I promised you")), 9, "BAKING IT THE SAME DAY, STILL WARM", A("Mincemeat has to rest") - 0.2);
    TIP("rest", A("Mincemeat has to rest"), "REST IT 2 DAYS · A WEEK IS BETTER", A("In those days the flavors marry") + 4);
    OVEN("o9", A("Bake it at four twenty-five for fifteen minutes", p9), "425°F", A("then turn it down to three seventy-five for thirty", p9) - 0.1, "15 MIN");
    OVEN("o9b", A("then turn it down to three seventy-five for thirty", p9), "375°F", A("Let it cool some"), "30 MIN MORE");
    W("chs", A("with a slice of sharp cheese on the side"), "WARM · WITH SHARP CHEESE", A("with a slice of sharp cheese on the side") + 3.5, { col: COL.amber });

    // ===== la servilleta, el repaso de la mesa, el libro, la pregunta, el cierre =====
    sec = "BEFORE YOU GO";
    W("nap", A("It's me writing it out on a napkin for you"), "WRITTEN ON A NAPKIN · FOR YOU", A("It's me writing it out on a napkin for you") + 4, { y: 170 });
    const rc = A("Number one, pie plant pie"), RC: [string, string][] = [["Number one, pie plant pie", "1 · PIE PLANT · LATTICE"], ["Number two, gooseberry", "2 · GOOSEBERRY · 1 CUP FIRST"], ["Number three, ground cherry", "3 · GROUND CHERRY · LEMON"], ["Number four, Concord grape", "4 · GRAPE · SKINS BACK IN"], ["Number five, elderberry", "5 · ELDERBERRY · FREEZE"], ["Number six, Bob Andy pie", "6 · BOB ANDY · FOLD"], ["Number seven, lemon sponge", "7 · LEMON SPONGE · LEMON FIRST"], ["Number eight, water pie", "8 · WATER PIE · DON'T STIR"], ["And number nine, real mincemeat", "9 · MINCEMEAT · REST 2 DAYS"]];
    RC.forEach(([ph, txt], i) => { const a = A(ph, rc - 0.5), b = i < 8 ? A(RC[i + 1][0], rc - 0.5) - 0.1 : a + 5.5; Z("rc" + i, a, b, i === 8 ? "warn" : "note", "THE NINE PIES", txt); });
    { const a1 = A("Every one of them was somebody's"), a2 = A("Now they're written down"); const nw = RB.beats.find((x) => x.kind === "W" && x.a >= a1 - 0.3), avUntil = nw && nw.a < a2 + 2.6 ? nw.a : a2 + 9;   // abajo hasta que entra la toma del libro
      L.push(<Quote key="q" t={t} a1={a1} a2={a2} out={a2 + 2.6} avUntil={avUntil} l1="Every one of them was somebody's." l2="Now they're written down." />); }
    BOOK("cta3", A("Fifty church supper recipes, one per page"), A("The link is in the first line", A("Fifty church supper recipes, one per page")) + 4, "50 RECIPES · LINK IN THE 1ST LINE OF THE DESCRIPTION");
    W("16", A("you'll have sixteen between them"), "7 + 9 = 16 CHURCH PIES", A("you'll have sixteen between them") + 3.5, { y: 170 });
    W("ask", A("What was the pie your grandmother was known for"), "WHAT WAS YOUR GRANDMOTHER'S PIE?", A("Write it down below") - 0.1, { y: 170, size: 72 });
    W("nm2", A("Write it down below"), "TELL ME IN THE COMMENTS · AND HER NAME", A("Danny reads every single one") + 2, { y: 170, size: 64, col: COL.amber });
    W("gone", A("Because a pie that's baked is never really gone"), "A PIE THAT'S BAKED IS NEVER REALLY GONE", A("The Lord bless you") - 0.1, { y: 900, size: 66 });
    L.push(<ZocaloStack key="zs" t={t} items={ZS} />);
    return L;
  },
});

const Thumb0Layer: React.FC = () => <Thumb0 t={useCurrentFrame() / 30} />;
export const Full: React.FC = () => <><V.Body /><Thumb0Layer /></>;
export const clipPlan = V.clipPlan;
export const beatTable = V.beatTable;
