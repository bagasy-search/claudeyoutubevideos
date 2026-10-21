// lcf01 · DEL 1:27 AL FINAL (87,31 → 1773,8 s). Misma vara que el minuto 1 (gary01): una base por frase —toma de
// Loretta haciendo lo que cuenta / la cocina 3D / el avatar— y CERO cortes secos; las piezas 2.5D viven encima y cruzan
// las transiciones. La cocina es UNA sola escena 3D (kitchen3d.tsx): cada "W" es la cámara en un rincón (el horno con la
// cena de turno, el plato de la mesa para uno, el libro abierto en su página REAL, la heladera, la perilla, la fila de las 10).
// Orden y anclas de las bases: rest_beats.json (mk_rest.py). Piezas ancladas a la palabra con at(). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { KitchenWorld, Scene, BOOK } from "./kitchen3d";
import { MIN1_END } from "./Min1";
import { BigNum, COL, Chips, FONT, LowerThird, Receipt, e, extrude, setSlug, spr } from "../kits/yanqui3d/lib";
import { makeVideo, Stamp, Beat } from "../kits/yanqui3d/engine";
import { CheckList, Mistake, NextCard, StepTitle, Timer, Words } from "../kits/yanqui3d/pieces";
import { VersusS } from "./VersusS";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import RB from "./rest_beats.json";

setSlug("lcf01");
export const T0 = MIN1_END, TEND = RB.TEND;
export const FULL_FRAMES = Math.ceil(TEND * 30);

// ---------------- cámaras de la cocina por escena (u = segundos desde que entra la toma) ----------------
type V3 = [number, number, number];
const mix = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const sm = (x: number) => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };
const drift = (p0: V3, p1: V3, l0: V3, l1: V3, f0: number, f1: number, u: number, dur = 9) => {
  const k = sm(u / dur);
  return { p: mix(p0, p1, k), l: mix(l0, l1, k), fov: f0 + (f1 - f0) * k };
};
const PLATE: V3 = [-0.08, 0.8, -0.45], OVENWIN: V3 = [1.18, 0.4, -2.35], KNOB: V3 = [1.25, 1.02, -2.28], LIST: V3 = [-2.24, 1.0, -2.09];
const BK: V3 = [BOOK[0] - 0.02, BOOK[1] + 0.02, BOOK[2]];

const sceneOf = (name: string, u: number): Scene => {
  const [kind, arg = ""] = name.split(":");
  const n = parseInt(arg) || 0, side = n % 2 ? 1 : -1;
  if (kind === "table") {
    return arg === "warm"
      ? { cam: drift([0.75, 1.32, 0.55], [0.25, 1.14, 0.18], PLATE, PLATE, 36, 32, u), st: { plateDish: true }, kind: 0 }
      : { cam: drift([2.0, 1.5, 1.45], [1.62, 1.4, 1.0], [0.35, 0.8, -0.45], [0.3, 0.8, -0.45], 40, 37, u) };
  }
  if (kind === "book") {
    const pg = arg.slice(0, 3), v = arg.slice(3);
    const top = drift([BK[0] + 0.05, BK[1] + 0.42, BK[2] + 0.3], [BK[0] - 0.04, BK[1] + 0.3, BK[2] + 0.12], [BK[0] - 0.03, BK[1], BK[2] - 0.01], [BK[0] - 0.01, BK[1], BK[2] - 0.01], 34, 30, u, 8);
    if (pg === "001") {
      // tapa cerrada: entra (001), la vuelve a mostrar con todo el set (001b) o la mesa se aleja al final (001c)
      if (v === "c") return { cam: drift([BK[0] + 0.1, BK[1] + 0.3, BK[2] + 0.28], [1.4, 1.35, 0.8], BK, [0.3, 0.8, -0.45], 32, 40, u, 11), book: { open: 0, page: "019" }, st: { plateDish: true }, kind: 0 };
      return { cam: top, book: { open: 0, page: "019" } };
    }
    if (pg === "019") return { cam: top, book: { open: v === "b" ? 1 : sm((u - 0.5) / 1.3), page: "019" } };
    // páginas que se dan vuelta: 019 → 020 · 019 → 004 · 004 → 162 (la de las compras, para la próxima)
    const from = pg === "162" ? "004" : "019";
    return { cam: drift([BK[0] + 0.0, BK[1] + 0.4, BK[2] + 0.16], [BK[0] + 0.02, BK[1] + 0.3, BK[2] + 0.07], [BK[0] - 0.02, BK[1], BK[2] - 0.01], [BK[0] + 0.02, BK[1], BK[2] - 0.01], 34, 30, u, 9), book: { open: 1, page: pg, from, turn: sm((u - 0.3) / 1.2) } };
  }
  if (kind === "fridge") {
    if (arg === "list") return { cam: drift([-2.05, 1.12, -1.4], [-2.22, 1.04, -1.68], [-2.2, 1.02, -2.09], LIST, 36, 30, u), list: true, st: { night: 1, warm: 1 } };
    return { cam: drift([-1.95, 1.05, -1.3], [-2.08, 0.95, -1.7], [-2.17, 0.8, -2.55], [-2.16, 0.78, -2.6], 44, 38, u), st: { fridge: 1 }, fridgeFood: true };
  }
  if (kind === "oven") {
    // la puerta se abre, el calor en la cara y sale la fuentecita (como el minuto 1, con la cena de turno)
    if (arg === "2b") return { cam: drift([1.22, 0.58, -1.55], [1.2, 0.5, -1.86], OVENWIN, OVENWIN, 34, 28, u), kind: 2 };
    const open = sm((u - 0.4) / 0.9), out = sm((u - 1.8) / 1.3);
    return { cam: drift([1.2 + 0.04 * side, 0.64, -1.42], [1.18, 0.84, -1.6], [1.18, 0.42, -2.4], [1.18, 0.36, -2.14], 38, 33, u, 4.5), st: { door: open, dishOut: out, heat: open * (1 - sm((u - 4) / 1.2)) }, kind: n };
  }
  if (kind === "bake") {
    // la puerta cerrada, la luz del horno y la cena burbujeando del otro lado del vidrio
    return { cam: drift([1.24 + 0.05 * side, 0.6, -1.5], [1.2, 0.48, -1.85], OVENWIN, [1.18, 0.38, -2.4], 34, 27, u, 8), kind: n };
  }
  if (kind === "plate") {
    return { cam: drift([0.05 + 0.32 * side, 1.18, 0.35], [-0.12 + 0.12 * side, 1.02, 0.02], PLATE, [PLATE[0], 0.79, PLATE[2]], 36, 29, u, 8), st: { plateDish: true }, kind: n };
  }
  if (kind === "row") {
    if (n === 9) return { cam: drift([-1.7, 1.38, 0.55], [-2.05, 1.2, 0.76], [-2.72, 0.95, 0.95], [-2.72, 0.95, 0.94], 36, 29, u, 6), st: { row: true }, rowHi: 9 };
    if (arg === "0b") return { cam: drift([-2.05, 1.22, 0.2], [-1.45, 1.5, -1.9], [-2.72, 0.95, -0.1], [-2.72, 0.95, -1.2], 32, 40, u, 10), st: { row: true } };
    return { cam: drift([-1.55, 1.5, -1.95], [-1.72, 1.38, 0.4], [-2.72, 0.95, -1.3], [-2.72, 0.95, 0.9], 40, 36, u, 10), st: { row: true } };
  }
  if (kind === "dial") {
    const to = arg === "on" ? 0.67 : 0.67;
    return { cam: drift([1.32, 1.1, -1.88], [1.26, 1.05, -2.02], KNOB, KNOB, 30, 24, u, 5), dial: to * sm((u - 0.5) / 1.1), st: { ovenLight: sm((u - 1.4) / 0.6) } };
  }
  return { cam: drift([2.0, 1.5, 1.45], [1.62, 1.4, 1.0], [0.35, 0.8, -0.45], [0.3, 0.8, -0.45], 40, 37, u) };
};

// ---------------- el nombre del libro + "link en la 1ª línea" (NUNCA una URL en pantalla) ----------------
const BookCTA: React.FC<{ t: number; at: number; out: number; sub?: string; y?: number }> = ({ t, at, out, sub = "LINK IN THE 1ST LINE OF THE DESCRIPTION", y = 820 }) => {
  if (t < at - 0.05 || t > out + 0.4) return null;
  const k = Math.min(1.06, spr(t, at, 0.8)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.35));
  return (
    <div style={{ position: "absolute", left: 960, top: y, transform: `translate(-50%,-50%) scale(${k})`, opacity: o, textAlign: "center", padding: "22px 54px 24px", borderRadius: 26, background: "linear-gradient(180deg, rgba(58,32,82,.96), rgba(30,16,44,.96))", boxShadow: `0 30px 60px rgba(0,0,0,.6), 0 0 0 3px ${COL.amber}88`, whiteSpace: "nowrap" }}>
      <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 700, fontSize: 82, color: "#fff4dc", textShadow: extrude(4, "rgba(0,0,0,.55)") }}>Supper for One</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 5, color: COL.amber, marginTop: 6, opacity: e(t, at + 0.5, at + 0.8) }}>{sub}</div>
    </div>
  );
};
// "PAGE 20" chiquito arriba a la derecha mientras dura la cena (el número de página real del libro)
const PageChip: React.FC<{ t: number; at: number; out: number; page: number; name: string }> = ({ t, at, out, page, name }) => {
  if (t < at - 0.05 || t > out + 0.4) return null;
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
  beats: ({ AV, CL }) => (RB.beats as { a: number; kind: string; k?: string; scene?: string; tr: Beat["tr"] }[]).map((b) =>
    b.kind === "AV" ? AV(b.a, b.tr)
      : b.kind === "CL" ? CL(b.a, b.k as string, b.tr, undefined, [1.02, 1.1])
        : ({ a: b.a, tr: b.tr, p: [960, 540], r: (t: number) => <KitchenWorld t={t} sc={sceneOf(b.scene as string, t - b.a)} /> } as Beat)),
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    const A = (ph: string, after = 0) => at(ph, after);
    const W = (key: string, a: number, txt: string, out: number, o: { y?: number; size?: number; col?: string } = {}) => L.push(<Words key={key} t={t} items={[{ at: a, txt, col: o.col }]} out={out} y={o.y ?? 880} size={o.size ?? 84} />);
    const N = (key: string, a: number, text: string, out: number, o: { sub?: string; col?: string; edge?: string; x?: number; y?: number; size?: number } = {}) => L.push(<BigNum key={key} t={t} at={a} text={text} sub={o.sub} x={o.x ?? 480} y={o.y ?? 330} size={Math.min(o.size ?? 200, 200)} col={o.col ?? COL.amber} edge={o.edge ?? "#5a3208"} out={out} />);
    const ING = (key: string, title: string, rows: [number, string][], out: number) => L.push(<CheckList key={key} t={t} title={title} rows={rows.map(([a, txt]) => ({ at: a, txt }))} out={out} />);
    const SUP = (n: number, name: string, page: number, a: number, titleOut: number, out: number) => {
      L.push(<StepTitle key={"st" + n} t={t} at={a} n={n} name={name} out={titleOut} y={300} />);
      L.push(<PageChip key={"pc" + n} t={t} at={titleOut} out={out} page={page} name={name} />);
    };
    const OVEN = (key: string, a: number, temp: string, out: number) => N(key, a, temp, out, { sub: "OVEN", col: "#ffb35a", edge: "#5a1e08", x: 1500, y: 330, size: 170 });
    const PRICE = (key: string, a: number, $: string, sub: string, out: number) => N(key, a, $, out, { sub, col: "#9df0b4", edge: "#14401f", x: 480, y: 330, size: 200 });

    // ===== quién es, el libro, las fuentes y cómo compra =====
    L.push(<Chips key="who" t={t} at={A("81 years old")} items={["81 YEARS OLD", "60 YEARS · CHURCH BASEMENT", "SMALL TOWN, IOWA"]} out={95.0} y={860} />);
    N("100", A("a hundred people"), "100", 101.8, { sub: "PEOPLE AT A TIME · 9×13 PANS", y: 360 });
    W("first", A("the first one for just me"), "THE FIRST ONE FOR JUST ME", 108.5);
    L.push(<VersusS key="hab" t={t} at={A("I cooked for two")} out={114.7} title="THAT FIRST YEAR" L={{ label: "COOKED FOR TWO", val: "½ THROWN AWAY", h: 0.8, col: COL.red, mark: "x" }} R={{ label: "DIDN'T COOK", val: "CRACKERS", h: 0.35, col: COL.red, mark: "x" }} />);
    L.push(<Chips key="small" t={t} at={A("One pan, one pot")} items={["ONE PAN", "ONE POT", "ONE LITTLE LOAF PAN"]} out={127.2} y={860} />);
    W("frozen", A("less than the frozen dinners"), "LESS THAN THE FROZEN DINNERS", 127.2, { y: 170 });
    W("cross", A("the little cross"), "THE OLD CHURCH TABLECLOTH", 138.6);
    W("crk", A("crackers over the sink"), "NO MORE CRACKERS OVER THE SINK", 147.0, { y: 170, size: 74 });
    L.push(<BookCTA key="cta0" t={t} at={A("It's called Supper for One")} out={149.8} sub="MY BOOK · 140 LITTLE SUPPERS" y={860} />);
    N("140", A("140 little suppers"), "140", 154.2, { sub: "LITTLE SUPPERS · EACH WITH ITS PRICE", y: 330 });
    W("pg19", A("Page 19"), "CHAPTER 2 · LOAF PANS AND LITTLE CASSEROLES", 167.0, { y: 940, size: 56 });
    W("same", A("the same casseroles, sized for one"), "SAME CASSEROLES · SIZED FOR ONE", 172.5, { y: 170, size: 74 });
    L.push(<BookCTA key="cta1" t={t} at={A("The link is in the first line")} out={183.2} />);
    W("paid", A("Not a guess"), "NOT A GUESS · WHAT I PAID", 200.1, { y: 170, size: 74 });
    ING("pans", "THE ONLY PANS YOU NEED", [[A("A small loaf pan"), "SMALL LOAF PAN · 8×4 IN"], [A("two little two-cup"), "TWO 2-CUP BAKING DISHES"]], 211.5);
    L.push(<VersusS key="two" t={t} at={A("Most of these suppers make two plates")} out={222.6} title="EVERY SUPPER MAKES TWO" L={{ label: "BAKE ONE", val: "TONIGHT", h: 0.8, col: COL.amber, mark: "ok" }} R={{ label: "FREEZE ONE", val: "UNBAKED", h: 0.8, col: "#8fd6ff", mark: "ok" }} />);
    W("pan", A("you need a smaller pan"), "YOU NEED A SMALLER PAN", 228.6, { y: 170 });
    W("p3", A("this is page three"), "PAGE 3 · THE WHOLE SECRET", 239.2, { y: 940, size: 60 });
    ING("buy", "BUY BIG · FREEZE SMALL", [[A("Buy the big pack"), "BIG PACK OF GROUND BEEF"], [A("quarter pound squares"), "¼ LB SQUARES, FLAT"], [A("Chicken thighs, two"), "CHICKEN THIGHS · 2 A BAG"], [A("The bread goes"), "BREAD IN THE FREEZER"]], 260.0);
    W("egg", A("half an egg"), "HALF AN EGG? FREEZE THE OTHER HALF", 268.5, { y: 170, size: 70 });

    // ===== 1 · meatloaf · p.20 =====
    SUP(1, "LOAF-PAN MEATLOAF", 20, A("Supper number one"), 286.0, 431.0);
    W("q", A("a quarter of the meat"), "A QUARTER OF THE MEAT", 293.0, { y: 170 });
    ING("i1", "YOU'LL NEED", [[A("Half a pound of ground beef"), "½ LB GROUND BEEF"], [A("quick oats"), "¼ CUP QUICK OATS"], [A("one egg yolk"), "1 EGG YOLK"], [A("two tablespoons of milk"), "2 TBSP MILK"], [A("chopped onion"), "2 TBSP ONION"]], 316.5);
    OVEN("o1", A("Turn your oven to 350"), "350°F", 324.0);
    W("hold", A("just until it holds together"), "JUST UNTIL IT HOLDS", 330.4, { col: COL.amber });
    ING("tp1", "THE TOPPING", [[A("Two tablespoons of ketchup"), "2 TBSP KETCHUP"], [A("one teaspoon of brown sugar"), "1 TSP BROWN SUGAR"], [A("a half teaspoon of mustard"), "½ TSP MUSTARD"]], 343.0);
    L.push(<VersusS key="yolk" t={t} at={A("Now why only the yolk")} out={364.7} title="WHY ONLY THE YOLK" L={{ label: "WHOLE EGG", val: "SLUMPS", h: 0.4, col: COL.red, mark: "x" }} R={{ label: "JUST THE YOLK", val: "TENDER", h: 0.9, col: COL.amber, mark: "ok" }} />);
    N("t1", A("Into the oven 35"), "35–40", 371.0, { sub: "MINUTES", col: "#ffb35a", edge: "#5a1e08", y: 330 });
    L.push(<Timer key="rest" t={t} at={A("let it rest 10 minutes")} out={380.4} secs={10} label="REST 10 MIN" />);
    N("160", A("Ground beef has to reach"), "160°F", 384.1, { sub: "IN THE MIDDLE", col: "#ff8a5a", edge: "#5a1508", y: 330 });
    PRICE("p1", A("That's two plates for"), "$2.40", "TWO PLATES", 392.0);
    W("sand", A("Cut a cold slice"), "TOMORROW: FRIED MEATLOAF SANDWICH", 403.0, { y: 170, size: 66 });
    ING("car", "GLAZED CARROTS · PAGE 145", [[A("Two carrots"), "2 CARROTS"], [A("a teaspoon of butter"), "1 TSP BUTTER"], [A("a teaspoon of brown sugar", 409), "1 TSP BROWN SUGAR"], [A("eight minutes"), "COVERED · 8 MIN"]], 423.5);
    N("30c", A("30 cents"), "30¢", 426.8, { sub: "THE CARROTS", y: 330, col: "#9df0b4", edge: "#14401f", size: 200 });

    // ===== 2 · chicken and noodles · p.21 =====
    SUP(2, "CHICKEN AND NOODLES", 21, A("Supper number two"), 440.0, 573.4);
    PRICE("p2", A("$1.60"), "$1.60", "TWO PLATES", 451.0);
    ING("i2", "YOU'LL NEED", [[A("One cup of cooked chicken"), "1 CUP COOKED CHICKEN"], [A("A cup and a half"), "1½ CUPS EGG NOODLES"], [A("One cup of chicken broth"), "1 CUP CHICKEN BROTH"], [A("a quarter cup of milk"), "¼ CUP MILK"], [A("one tablespoon of butter"), "1 TBSP BUTTER · 1 TBSP FLOUR"]], 470.0);
    W("same", A("in that same pot"), "SAME POT: BUTTER · FLOUR · BROTH", 478.7, { y: 170, size: 70 });
    OVEN("o2", A("bake it 15 minutes at 350"), "350°F", 503.0);
    W("15", A("until the crumbs are gold"), "15 MIN · CRUMBS GOLD", 503.0, { y: 900 });
    L.push(<VersusS key="fix2" t={t} at={A("A splash more milk")} out={511.6} title="SAUCE NOT RIGHT?" L={{ label: "TOO THICK", val: "+ MILK", h: 0.7, col: "#8fd6ff", mark: "ok" }} R={{ label: "TOO THIN", val: "+1 MIN", h: 0.7, col: COL.amber, mark: "ok" }} />);
    W("ruin", A("You can't really ruin"), "YOU CAN'T REALLY RUIN THIS ONE", 519.0, { y: 170, size: 74 });
    L.push(<Stamp key="frz2" t={t} at={A("Freeze half before you bake")} text="FREEZE HALF · UNBAKED" x={960} y={340} rot={-4} size={90} out={535.0} />);
    W("best", A("this one reheats the best"), "REHEATS THE BEST", 539.0, { col: COL.amber });
    L.push(<Chips key="fz" t={t} at={A("covered with foil, at 350")} items={["COVERED · 350°F", "ABOUT TWICE AS LONG", "FOIL OFF · LAST 15 MIN"]} out={549.0} y={860} />);
    W("peas", A("page 142"), "PAGE 142 · MOTHER'S CREAMED PEAS", 562.0, { y: 170, size: 66 });

    // ===== 3 · tuna noodle · p.22 =====
    SUP(3, "TUNA NOODLE FOR ONE", 22, A("Supper number three"), 579.0, 691.0);
    ING("i3", "YOU'LL NEED", [[A("One small can of tuna"), "1 SMALL CAN TUNA"], [A("One cup of egg noodles"), "1 CUP EGG NOODLES"], [A("Half a cup of frozen peas"), "½ CUP FROZEN PEAS"], [A("One cup of white sauce"), "1 CUP WHITE SAUCE"], [A("a quarter cup of shredded cheddar"), "¼ CUP CHEDDAR"], [A("crushed crackers for the top"), "2 TBSP CRUSHED CRACKERS"]], 606.5);
    OVEN("o3", A("Oven at 375"), "375°F", 612.0);
    L.push(<VersusS key="pz" t={t} at={A("don't thaw the peas")} out={620.6} title="THE PEAS" L={{ label: "THAWED", val: "DULL", h: 0.4, col: COL.red, mark: "x" }} R={{ label: "FROZEN", val: "GREEN · POP", h: 0.9, col: "#9df0b4", mark: "ok" }} />);
    W("brk", A("the broken ones at the bottom"), "THE BROKEN ONES AT THE BOTTOM", 638.8, { y: 170, size: 70 });
    N("20m3", A("20 minutes until it's bubbling"), "20 MIN", 643.2, { sub: "UNTIL IT BUBBLES", col: "#ffb35a", edge: "#5a1e08", y: 330, size: 200 });
    W("lem", A("One teaspoon of lemon juice"), "1 TSP LEMON JUICE IN THE SAUCE", 654.2, { col: COL.amber, size: 74 });
    L.push(<VersusS key="fd3" t={t} at={A("$1.70 for two plates")} out={667.8} title="TONIGHT" L={{ label: "TUNA NOODLE · 2 PLATES", val: "$1.70", h: 0.35, col: "#9df0b4", mark: "ok" }} R={{ label: "ONE FROZEN DINNER", val: "MORE", h: 0.8, col: COL.red, mark: "x" }} />);
    W("3d", A("it keeps three days"), "KEEPS 3 DAYS IN THE FRIDGE", 672.0, { y: 170 });
    W("spn", A("A spoon of milk"), "A SPOON OF MILK · CREAMY AGAIN", 681.0, { y: 900, size: 72 });

    // ===== 4 · shepherd's pie · p.23 =====
    SUP(4, "SHEPHERD'S PIE", 23, A("Supper number four"), 698.0, 801.0);
    ING("i4", "YOU'LL NEED", [[A("A quarter pound of ground beef", 700)], [A("half a cup of frozen mixed vegetables")], [A("a quarter cup of beef broth")], [A("one cup of mashed potatoes")]].map((r, i) => [r[0], ["¼ LB GROUND BEEF", "½ CUP FROZEN MIXED VEG", "¼ CUP BROTH + 1 TSP FLOUR", "1 CUP MASHED POTATOES"][i]] as [number, string]), 719.4);
    OVEN("o4", A("Oven at 400"), "400°F", 725.0);
    W("edge", A("all the way to the edges"), "POTATOES ALL THE WAY TO THE EDGES", 735.9, { y: 170, size: 66 });
    W("fork", A("Take a fork and run it"), "A FORK ACROSS · LITTLE RIDGES", 746.0, { col: COL.amber, size: 76 });
    W("1p", A("Peel one potato"), "1 POTATO · 15 MIN · MASH", 766.0, { y: 170 });
    W("other", A("a supper made out of other suppers"), "A SUPPER MADE OF OTHER SUPPERS", 778.0, { y: 170, size: 70 });
    PRICE("p4", A("Two dollars, two plates"), "$2.00", "TWO PLATES · FREEZES", 786.0);
    W("158", A("Page 158"), "PAGE 158 · THE SUNDAY ROAST VERSION", 801.7, { y: 170, size: 64 });

    // ===== las cuentas · p.4 =====
    W("arith", A("it does arithmetic"), "THIS HOUSE DOES ARITHMETIC", 810.0, { y: 170 });
    L.push(<VersusS key="v4a" t={t} at={A("A frozen meat loaf dinner")} out={821.7} title="MEATLOAF · PAGE 4" L={{ label: "FROZEN · 1 TRAY", val: "$3.50–4.50", h: 0.85, col: COL.red, mark: "x" }} R={{ label: "MY LOAF PAN · 2 PLATES", val: "$2.40", h: 0.45, col: "#9df0b4", mark: "ok" }} />);
    L.push(<VersusS key="v4b" t={t} at={A("Frozen chicken and noodles")} out={828.5} title="CHICKEN AND NOODLES" L={{ label: "FROZEN", val: "$3–4", h: 0.8, col: COL.red, mark: "x" }} R={{ label: "MINE · 2 PLATES", val: "$1.60", h: 0.35, col: "#9df0b4", mark: "ok" }} />);
    L.push(<VersusS key="v4c" t={t} at={A("Seven suppers a week")} out={839.4} title="ONE WEEK · 7 SUPPERS" L={{ label: "FROZEN DINNERS", val: "$25–35", h: 0.9, col: COL.red, mark: "x" }} R={{ label: "THIS BOOK", val: "$15–18", h: 0.5, col: "#9df0b4", mark: "ok" }} />);
    N("500", A("more than $500"), "$500+", 846.0, { sub: "A YEAR", col: "#9df0b4", edge: "#14401f", y: 330 });
    L.push(<VersusS key="v4d" t={t} at={A("Chicken and potatoes from the drive-thru")} out={854.0} title="CHICKEN AND POTATOES" L={{ label: "DRIVE-THRU", val: "$9–11", h: 0.95, col: COL.red, mark: "x" }} R={{ label: "MINE", val: "$2.10", h: 0.25, col: "#9df0b4", mark: "ok" }} />);
    W("15wk", A("$15 a week"), "$10–15 A WEEK · EVERY WEEK", 862.0, { y: 170, col: "#9df0b4" });
    L.push(<BookCTA key="cta2" t={t} at={A("The whole book")} out={869.6} sub="+ 4 MORE BOOKS · LINK IN THE 1ST LINE OF THE DESCRIPTION" />);

    // ===== 5 · tater tot hot dish · p.26 =====
    SUP(5, "TATER TOT HOT DISH", 26, A("Supper number five"), 876.0, 1000.0);
    ING("i5", "YOU'LL NEED", [[A("a quarter pound of ground beef", 875), "¼ LB GROUND BEEF"], [A("a quarter of an onion"), "¼ ONION"], [A("half a cup of frozen green beans"), "½ CUP FROZEN GREEN BEANS"], [A("a third of a cup of cream"), "⅓ CUP CREAM OF MUSHROOM"], [A("15 frozen tater tots"), "15 FROZEN TATER TOTS"], [A("a quarter cup of shredded cheese", 890), "¼ CUP SHREDDED CHEESE"]], 897.0);
    OVEN("o5", A("Oven at 375", 895), "375°F", 903.6);
    W("rows", A("up in rows"), "STAND THEM UP · IN ROWS", 919.0, { col: COL.amber });
    W("lid", A("the tots are the lid"), "THE TOTS ARE THE LID", 935.0, { y: 170 });
    L.push(<VersusS key="pile" t={t} at={A("If you pile them on")} out={945.0} title="15 TOTS, ONE LAYER" L={{ label: "PILED ON", val: "SOGGY · BURNT", h: 0.4, col: COL.red, mark: "x" }} R={{ label: "ONE LAYER, STANDING", val: "CRISP", h: 0.9, col: COL.amber, mark: "ok" }} />);
    W("drain", A("drain that beef"), "DRAIN THE BEEF", 951.6, { y: 170, col: COL.red });
    N("30m", A("30 minutes and"), "30 MIN", 956.5, { sub: "CHEESE THE LAST 5", col: "#ffb35a", edge: "#5a1e08", y: 330, size: 200 });
    PRICE("p5", A("$2.10, two plates"), "$2.10", "TWO PLATES", 966.0);
    L.push(<Chips key="keeps" t={t} at={A("Every single thing in it keeps")} items={["TOTS + BEANS · FREEZER", "SOUP · CUPBOARD", "BEEF · YOUR LITTLE SQUARE"]} out={985.2} y={860} />);

    // ===== 6 · stuffed pepper bake · p.28 =====
    SUP(6, "STUFFED PEPPER BAKE", 28, A("Supper number six"), 1002.0, 1126.0);
    W("none", A("none of the stuffing"), "NONE OF THE STUFFING", 1010.0, { y: 170 });
    ING("i6", "YOU'LL NEED", [[A("1 quarter pound of ground beef"), "¼ LB GROUND BEEF"], [A("1 bell pepper"), "1 BELL PEPPER, CHOPPED"], [A("1 half cup of cooked rice"), "½ CUP COOKED RICE"], [A("1 half cup of canned"), "½ CUP DICED TOMATOES"], [A("1 quarter cup of shredded cheese"), "¼ CUP SHREDDED CHEESE"]], 1027.0);
    OVEN("o6", A("Oven at 375", 1025), "375°F", 1034.4);
    N("20m6", A("15 to 20 minutes in the oven"), "15–20 MIN", 1045.0, { sub: "UNTIL THE EDGES SIZZLE", col: "#ffb35a", edge: "#5a1e08", y: 330, size: 120, x: 420 });
    W("frzp", A("freeze them flat in a bag"), "ON SALE? CHOP · FREEZE FLAT", 1056.4, { y: 170, size: 74 });
    L.push(<VersusS key="pep" t={t} at={A("Green peppers are the cheapest")} out={1066.0} title="PEPPERS" L={{ label: "GREEN", val: "CHEAPEST", h: 0.5, col: "#9df0b4", mark: "ok" }} R={{ label: "RED · YELLOW", val: "SWEETER", h: 0.7, col: COL.amber, mark: "ok" }} />);
    W("rice", A("I freeze it flat in a bag"), "RICE: 1-CUP BAGS IN THE FREEZER", 1078.0, { y: 170, size: 70 });
    PRICE("p6", A("Two dollars and twenty cents"), "$2.20", "TWO PLATES", 1082.0);
    ING("rc", "RICE · PAGE 114", [[A("One cup of rice"), "1 CUP RICE"], [A("one and three quarter cups"), "1¾ CUPS WATER"], [A("a half teaspoon of salt"), "½ TSP SALT · 1 TSP BUTTER"], [A("turn it to low"), "LOW · 18 MIN · LID ON"]], 1104.0);
    N("45c", A("45 cents"), "45¢", 1116.0, { sub: "3 CUPS COOKED · 3 SUPPERS", col: "#9df0b4", edge: "#14401f", y: 330, size: 210 });

    // ===== 7 · baked ziti · p.113 =====
    SUP(7, "BAKED ZITI IN A LOAF PAN", 113, A("Supper number seven"), 1128.0, 1257.0);
    ING("i7", "YOU'LL NEED", [[A("Four ounces of ziti"), "4 OZ ZITI OR PENNE"], [A("cup and a half of spaghetti sauce"), "1½ CUPS SPAGHETTI SAUCE"], [A("A third of a cup of ricotta"), "⅓ CUP RICOTTA"], [A("Half a cup of shredded mozzarella"), "½ CUP MOZZARELLA"], [A("two tablespoons of parmesan"), "2 TBSP PARMESAN"]], 1149.0);
    OVEN("o7", A("oven at 375", 1140), "375°F", 1159.0);
    W("2min", A("two minutes less than the box"), "PASTA: 2 MINUTES LESS", 1159.0, { col: COL.amber });
    W("grease", A("grease that loaf pan"), "GREASE THE LOAF PAN · CORNERS", 1192.8, { y: 170, size: 70 });
    L.push(<VersusS key="rk" t={t} at={A("cottage cheese works just as well")} out={1210.0} title="LET THEM ARGUE" L={{ label: "RICOTTA", val: "MORE $", h: 0.75, col: COL.red, mark: "x" }} R={{ label: "COTTAGE CHEESE", val: "JUST AS GOOD", h: 0.75, col: "#9df0b4", mark: "ok" }} />);
    PRICE("p7", A("a dollar fifty a plate"), "$1.50", "A PLATE", 1216.0);
    ING("gb", "ROASTED GREEN BEANS · PAGE 141", [[A("a big handful of green beans"), "A BIG HANDFUL"], [A("a teaspoon of oil"), "1 TSP OIL · SALT · PEPPER"], [A("a pinch of garlic"), "PINCH OF GARLIC POWDER"], [A("in a hot oven 12"), "HOT OVEN · 12–15 MIN"]], 1248.0);
    N("50c", A("50 cents"), "50¢", 1251.6, { sub: "THE GREEN BEANS", col: "#9df0b4", edge: "#14401f", y: 330, size: 200 });

    // ===== 8 · baked cod · p.131 =====
    SUP(8, "BAKED COD WITH CRUMBS", 131, A("Supper number eight"), 1262.0, 1364.0);
    W("20f", A("20 minutes from the freezer bag"), "20 MIN · FREEZER BAG TO PLATE", 1272.1, { y: 170, size: 70 });
    ING("i8", "YOU'LL NEED", [[A("One cod or haddock"), "1 COD OR HADDOCK FILLET"], [A("two tablespoons of crushed crackers", 1272), "2 TBSP CRUSHED CRACKERS"], [A("one tablespoon of melted butter"), "1 TBSP MELTED BUTTER"], [A("a pinch of paprika"), "PAPRIKA · PARSLEY"], [A("and a lemon"), "A LEMON"]], 1288.4);
    OVEN("o8", A("Oven at 400", 1280), "400°F", 1296.0);
    N("12m", A("12 to 15 minutes", 1290), "12–15 MIN", 1305.7, { sub: "UNTIL IT FLAKES", col: "#ffb35a", edge: "#5a1e08", y: 330, size: 120, x: 420 });
    N("145", A("is done at 145"), "145°F", 1312.0, { sub: "FISH IS DONE", col: "#ff8a5a", edge: "#5a1508", y: 330 });
    L.push(<VersusS key="flk" t={t} at={A("If it comes apart in big white flakes")} out={1329.0} title="THE FORK TEST" L={{ label: "BIG WHITE FLAKES", val: "DONE", h: 0.85, col: "#9df0b4", mark: "ok" }} R={{ label: "SHINY · HOLDS", val: "+2 MIN", h: 0.5, col: COL.amber, mark: "x" }} />);
    W("chk", A("start checking at 12 minutes"), "START CHECKING AT 12", 1334.0, { y: 170, col: COL.amber });
    W("pat", A("pat it dry"), "THAW OVERNIGHT · PAT DRY", 1343.0, { y: 900 });
    PRICE("p8", A("$2.20, and it tastes"), "$2.20", "ONE PLATE", 1347.7);
    W("1pan", A("that's one pan to wash"), "ONE PAN TO WASH", 1353.6, { y: 170 });

    // ===== 9 · chicken pot pie · p.27 · EL ERROR =====
    SUP(9, "POT PIE WITH A BISCUIT LID", 27, A("Supper number nine"), 1372.0, 1500.0);
    ING("i9", "YOU'LL NEED", [[A("Three quarters of a cup"), "¾ CUP COOKED CHICKEN"], [A("Half a cup of frozen mixed", 1370), "½ CUP FROZEN MIXED VEG"], [A("Half a cup of white sauce"), "½ CUP WHITE SAUCE OR GRAVY"], [A("one biscuit"), "1 BISCUIT FROM THE TUBE"]], 1392.0);
    OVEN("o9", A("Oven at 400", 1385), "400°F", 1397.4);
    L.push(<Mistake key="mk9" t={t} at={A("because this is the mistake")} n={1} txt="COLD FILLING UNDER THE BISCUIT" out={1413.0} />);
    W("raw", A("raw dough, gummy"), "THE BOTTOM: RAW DOUGH", 1413.0, { y: 170, col: COL.red });
    L.push(<Stamp key="nv9" t={t} at={A("It was never you", 1400)} text="IT WAS NEVER YOU" x={960} y={360} rot={-4} size={100} out={1417.2} />);
    L.push(<VersusS key="hot" t={t} at={A("The filling has to be hot")} out={1430.0} title="THE FIX" L={{ label: "COLD FILLING", val: "GUMMY", h: 0.4, col: COL.red, mark: "x" }} R={{ label: "HOT FILLING FIRST", val: "COOKED THROUGH", h: 0.9, col: COL.amber, mark: "ok" }} />);
    N("15m9", A("15 to 18 minutes"), "15–18 MIN", 1435.0, { sub: "HEAT FROM UNDERNEATH", col: "#ffb35a", edge: "#5a1e08", y: 330, size: 120, x: 420 });
    PRICE("p9", A("Two", 1462), "$2.30", "ONE PLATE · JUST FOR YOU", 1468.0);
    W("8pp", A("one tube of biscuits is eight"), "1 TUBE = 8 POT PIES", 1482.2, { y: 170, col: COL.amber });
    W("any", A("any cooked chicken works"), "ANY COOKED CHICKEN · OR GRAVY", 1494.0, { y: 900 });

    // ===== 10 · turkey tetrazzini · p.156 =====
    SUP(10, "TURKEY TETRAZZINI", 156, A("Supper number 10"), 1506.0, 1601.0);
    ING("i10", "YOU'LL NEED", [[A("3 ounces of spaghetti"), "3 OZ SPAGHETTI, IN THIRDS"], [A("1 cup of leftover turkey"), "1 CUP LEFTOVER TURKEY"], [A("can of cream of mushroom soup"), "½ CAN CREAM OF MUSHROOM"], [A("cup of milk", 1517), "⅓ CUP MILK"], [A("cup of parmesan"), "¼ CUP PARMESAN"], [A("2 tablespoons of breadcrumbs"), "2 TBSP BREADCRUMBS"]], 1527.0);
    OVEN("o10", A("Oven at 375", 1520), "375°F", 1534.3);
    W("half", A("the other half doesn't go in the trash"), "THE OTHER HALF CAN → SUPPER #5", 1550.4, { y: 170, size: 70, col: COL.amber });
    W("thirds", A("break the spaghetti in thirds"), "BREAK IT IN THIRDS", 1560.0, { y: 900 });
    PRICE("p10", A("$1.40 a plate"), "$1.40", "A PLATE", 1567.0);
    W("151", A("Page 151"), "PAGE 151 · LEFTOVERS", 1579.0, { y: 940, size: 60 });
    L.push(<Chips key="bird" t={t} at={A("One cooked bird")} items={["SUNDAY · ROAST", "MONDAY · TETRAZZINI", "WEDNESDAY · POT PIE"]} out={1592.0} y={860} />);
    W("chg", A("Change the sauce"), "CHANGE THE SAUCE · NEW SUPPER", 1595.0, { y: 170, size: 74 });

    // ===== el freezer, la mesa, el cierre =====
    N("10", A("So that's ten"), "10", 1604.0, { sub: "SUPPERS", y: 340 });
    L.push(<VersusS key="mk2" t={t} at={A("Make two at once")} out={1614.0} title="PAGE 19 · MAKE TWO" L={{ label: "BAKE ONE", val: "TONIGHT", h: 0.8, col: COL.amber, mark: "ok" }} R={{ label: "FREEZE ONE", val: "FOIL · UNBAKED", h: 0.8, col: "#8fd6ff", mark: "ok" }} />);
    W("name", A("A bag with no name"), "A BAG WITH NO NAME = THROWN AWAY", 1622.0, { y: 170, size: 70, col: COL.red });
    L.push(<Chips key="frz" t={t} at={A("you bake it straight from frozen")} items={["COVERED · 350°F", "ABOUT TWICE AS LONG", "FOIL OFF · LAST 15 MIN"]} out={1633.7} y={860} />);
    N("6s", A("six suppers sitting"), "3 → 6", 1645.0, { sub: "ONE SUNDAY · SIX SUPPERS", y: 340 });
    W("open", A("just open the oven door"), "JUST OPEN THE OVEN DOOR", 1652.0, { col: COL.amber });
    L.push(<Receipt key="163" t={t} title="PAGE 163 · FREEZER PLAN" rows={[{ at: A("muffin tin meatloaves"), item: "12 MEATLOAVES", $: 12 }, { at: A("four soups"), item: "4 SOUPS", $: 4 }, { at: A("4", 1675), item: "4 PLATES", $: 4 }, { at: A("3 chilies"), item: "3 CHILIS", $: 3 }]} totalAt={A("and I write every single")} x={1150} y={120} sc={1.2} out={1679.4} />);
    L.push(<Chips key="lst" t={t} at={A("a list taped to the freezer door")} items={["EVERY BAG ON THE LIST", "CROSS IT OFF", "SHORT LIST = COOKING SUNDAY"]} out={1691.2} y={860} />);
    L.push(<Chips key="tbl" t={t} at={A("Use the good plate")} items={["THE GOOD PLATE", "SIT DOWN", "A CANDLE", "CALL SOMEBODY"]} out={1720.0} y={860} />);
    if (t > A("Cooking for one isn't sad") - 0.1 && t < 1724.5) {
      const a1 = A("Cooking for one isn't sad"), a2 = A("eating crackers over the sink is sad");
      L.push(<div key="q" style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: "#fff3dc", textShadow: "0 4px 24px rgba(0,0,0,.7)", opacity: 1 - e(t, 1724.0, 1724.4) }}>
        <div style={{ fontSize: 80, opacity: e(t, a1, a1 + 0.4), transform: `translateY(${(1 - e(t, a1, a1 + 0.5)) * 20}px)` }}>“Cooking for one isn’t sad.</div>
        <div style={{ fontSize: 80, color: "#ffd38a", marginTop: 8, opacity: e(t, a2, a2 + 0.4), transform: `translateY(${(1 - e(t, a2, a2 + 0.5)) * 20}px)` }}>Crackers over the sink is sad.”</div>
      </div>);
    }
    W("one", A("I only want you to try one"), "THIS WEEK · TRY JUST ONE", 1733.0, { y: 170 });
    W("hd", A("a casserole and not a hot dish"), "CASSEROLE OR HOT DISH? · COMMENTS", 1745.4, { y: 170, size: 66 });
    L.push(<BookCTA key="cta3" t={t} at={A("Supper for one is in the first line")} out={1753.0} sub="140 SUPPERS · LINK IN THE 1ST LINE OF THE DESCRIPTION" />);
    L.push(<AbsoluteFill key="ncw" style={{ transform: "scale(0.84)", transformOrigin: "1900px 150px" }}><NextCard key="nc" t={t} at={A("And next time")} subAt={A("One trip to the store")} out={1766.0} title="ONE TRIP · 14 SUPPERS · ABOUT $84"><AbsoluteFill style={{ background: "#efe7d6", alignItems: "center", justifyContent: "center" }}><Img src={staticFile("lcf01/book_p162.jpg")} style={{ height: "100%", objectFit: "contain" }} /></AbsoluteFill></NextCard></AbsoluteFill>);
    L.push(<LowerThird key="lt" t={t} at={A("Now go turn that oven on") - 0.3} out={TEND - 0.6} name="LORETTA" l2="THAT'S SUPPER, HONEY" l2at={A("That's supper, honey")} />);
    return L;
  },
});

export const Rest: React.FC = () => <V.Body />;
export const clipPlan = V.clipPlan;
export const beatTable = V.beatTable;
