// lcf2510a · «10 Dump and Bake Suppers for ONE Under $2». Video entero con el motor yanqui3d (vara gary01, sin cortes secos):
// cada base = Loretta HACIENDO lo que cuenta (LTX, cámara fija) / la cocina 3D de lcf01 (horno, plato, libro con la página REAL,
// heladera, perilla) / el avatar. Orden y anclas: rest_beats.json (D:/rtmp_lcf2510a/mk_plan.py desde tomas.py).
// Piezas ancladas a la palabra (A); si una frase no está en caps la pieza no sale (nunca rompe el render). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill } from "remotion";
import { KitchenWorld, Scene, BOOK } from "./kitchen3d";
import { COL, setSlug } from "../kits/yanqui3d/lib";
import { makeVideo, Beat } from "../kits/yanqui3d/engine";
import { CoolClock, OvenDial, PieTitle, RecipeCard, Stat, SupBadge, ZItem, ZocaloStack } from "./ui";
import { VersusS } from "./VersusS";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import RB from "./rest_beats.json";

setSlug("lcf2510a");
export const TEND = RB.TEND;
export const FULL_FRAMES = Math.ceil(TEND * 30);

type V3 = [number, number, number];
const mix = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const sm = (x: number) => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };
const drift = (p0: V3, p1: V3, l0: V3, l1: V3, f0: number, f1: number, u: number, dur = 9) => {
  const k = sm(u / dur);
  return { p: mix(p0, p1, k), l: mix(l0, l1, k), fov: f0 + (f1 - f0) * k };
};
const PLATE: V3 = [-0.08, 0.8, -0.45], OVENWIN: V3 = [1.18, 0.4, -2.35], KNOB: V3 = [1.25, 1.02, -2.28], LIST: V3 = [-2.24, 1.0, -2.09];
const BK: V3 = [BOOK[0] - 0.02, BOOK[1] + 0.02, BOOK[2]];
// cena n del video → la fuentecita 3D que más se le parece (las de lcf01: 1 loaf oscuro, 7 ziti, 10 tetrazzini, 2-6/9 cazuelas)
const DISH = [0, 2, 1, 6, 10, 5, 7, 7, 4, 9, 10];

const sceneOf = (name: string, u: number): Scene => {
  const [kind, arg = ""] = name.split(":");
  const n = parseInt(arg) || 0, side = n % 2 ? 1 : -1, dk = DISH[n] ?? 0;
  if (kind === "table") {
    return arg === "warm"
      ? { cam: drift([0.75, 1.32, 0.55], [0.25, 1.14, 0.18], PLATE, PLATE, 36, 32, u), st: { plateDish: true }, kind: 0 }
      : { cam: drift([2.0, 1.5, 1.45], [1.62, 1.4, 1.0], [0.35, 0.8, -0.45], [0.3, 0.8, -0.45], 40, 37, u) };
  }
  if (kind === "book") {
    const pg = arg.slice(0, 3), v = arg.slice(3);
    const top = drift([BK[0] + 0.05, BK[1] + 0.42, BK[2] + 0.3], [BK[0] - 0.04, BK[1] + 0.3, BK[2] + 0.12], [BK[0] - 0.03, BK[1], BK[2] - 0.01], [BK[0] - 0.01, BK[1], BK[2] - 0.01], 34, 30, u, 8);
    if (pg === "001") {
      if (v === "c") return { cam: drift([BK[0] + 0.1, BK[1] + 0.3, BK[2] + 0.28], [1.4, 1.35, 0.8], BK, [0.3, 0.8, -0.45], 32, 40, u, 11), book: { open: 0, page: "003" }, st: { plateDish: true }, kind: 0 };
      if (v === "b") return { cam: top, book: { open: sm((u - 0.5) / 1.3), page: "003" } };
      return { cam: top, book: { open: 0, page: "003" } };
    }
    // la página de la cena se da vuelta desde la 3 (la del secreto)
    return { cam: drift([BK[0] + 0.0, BK[1] + 0.4, BK[2] + 0.16], [BK[0] + 0.02, BK[1] + 0.3, BK[2] + 0.07], [BK[0] - 0.02, BK[1], BK[2] - 0.01], [BK[0] + 0.02, BK[1], BK[2] - 0.01], 34, 30, u, 9), book: { open: 1, page: pg, from: "003", turn: sm((u - 0.3) / 1.2) } };
  }
  if (kind === "fridge") {
    if (arg === "list") return { cam: drift([-2.05, 1.12, -1.4], [-2.22, 1.04, -1.68], [-2.2, 1.02, -2.09], LIST, 36, 30, u), list: true, st: { night: 1, warm: 1 } };
    return { cam: drift([-1.95, 1.05, -1.3], [-2.08, 0.95, -1.7], [-2.17, 0.8, -2.55], [-2.16, 0.78, -2.6], 44, 38, u), st: { fridge: 1 }, fridgeFood: true };
  }
  if (kind === "bake") {
    // puerta cerrada, la luz del horno y la cena burbujeando del otro lado del vidrio
    return { cam: drift([1.24 + 0.05 * side, 0.6, -1.5], [1.2, 0.48, -1.85], OVENWIN, [1.18, 0.38, -2.4], 34, 27, u, 8), kind: DISH[n - 1] ?? 0 };
  }
  if (kind === "plate") {
    return { cam: drift([0.05 + 0.32 * side, 1.18, 0.35], [-0.12 + 0.12 * side, 1.02, 0.02], PLATE, [PLATE[0], 0.79, PLATE[2]], 36, 29, u, 8), st: { plateDish: true }, kind: DISH[n - 1] ?? dk };
  }
  if (kind === "row") {
    if (arg === "0b") return { cam: drift([-2.05, 1.22, 0.2], [-1.45, 1.5, -1.9], [-2.72, 0.95, -0.1], [-2.72, 0.95, -1.2], 32, 40, u, 10), st: { row: true } };
    return { cam: drift([-1.55, 1.5, -1.95], [-1.72, 1.38, 0.4], [-2.72, 0.95, -1.3], [-2.72, 0.95, 0.9], 40, 36, u, 10), st: { row: true } };
  }
  if (kind === "dial") {
    return { cam: drift([1.32, 1.1, -1.88], [1.26, 1.05, -2.02], KNOB, KNOB, 30, 24, u, 5), dial: 0.67 * sm((u - 0.5) / 1.1), st: { ovenLight: sm((u - 1.4) / 0.6) } };
  }
  return { cam: drift([2.0, 1.5, 1.45], [1.62, 1.4, 1.0], [0.35, 0.8, -0.45], [0.3, 0.8, -0.45], 40, 37, u) };
};

// 26-oct (pedido del creador): piezas al nivel nuevo del molde ck2510d (ui.tsx): todo texto en el zócalo abajo-izq,
// números dorados a los costados, nada sobre la cara. El libro + "link en la 1ª línea" va en el zócalo del libro (nunca una URL).
const GREEN = "#9df0b4", GEDGE = "#14401f";
const V = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: AVAIL as { clips: string[]; imgs: string[] }, T0: 0, TEND, flashAtStart: false,
  beats: ({ AV, CL }) => (RB.beats as { a: number; kind: string; k?: string; scene?: string; tr: Beat["tr"] }[]).map((b) =>
    b.kind === "AV" ? AV(b.a, b.tr)
      : b.kind === "CL" ? CL(b.a, b.k as string, b.tr, undefined, [1.0, 1.06])
        : ({ a: b.a, tr: b.tr, p: [960, 540], r: (t: number) => <KitchenWorld t={t} sc={sceneOf(b.scene as string, t - b.a)} /> } as Beat)),
  pieces: (t, { at }) => {
    const L: React.ReactNode[] = [];
    // ancla segura: frase que no está en la voz → -1 y la pieza no sale
    const A = (ph: string, after = 0) => { try { return at(ph, after); } catch { return -1; } };
    const ok = (...xs: number[]) => xs.every((x) => x >= 0);
    const ZS: ZItem[] = []; let sec = "DUMP & BAKE FOR ONE";
    const Z = (key: string, a: number, out: number, tone: ZItem["tone"], label: string, txt: string, x: Partial<ZItem> = {}) => ZS.push({ key, a, out, tone, label, txt, ...x });
    const W = (key: string, ph: string, txt: string, d = 3.2, o: { y?: number; size?: number; col?: string; after?: number; label?: string } = {}) => {
      const a = A(ph, o.after); if (!ok(a)) return;
      if (o.col === COL.amber) Z(key, a, a + d, "tip", o.label ?? "LORETTA'S TIP", txt);
      else if (o.col === COL.red) Z(key, a, a + d, "warn", o.label ?? "WATCH OUT", txt);
      else if (o.col === GREEN) Z(key, a, a + d, "note", o.label ?? "WHAT IT COSTS", txt);
      else Z(key, a, a + d, "note", o.label ?? sec, txt);
    };
    // número dorado a un costado (izq por defecto; x>960 = der), nunca al centro: baja de tamaño si es largo y x se corre para que no se corte
    const N = (key: string, ph: string, text: string, d: number, o: { sub?: string; col?: string; edge?: string; x?: number; y?: number; size?: number; after?: number } = {}) => {
      const a = A(ph, o.after); if (!ok(a)) return;
      const size = Math.min(o.size ?? 230, text.length > 5 ? 140 : text.length > 3 ? 180 : 230);
      const half = Math.max(text.length * size * 0.27, ((o.sub?.length ?? 0) * 15 + 210) / 2) + 40, x0 = o.x ?? 330;
      const x = x0 > 960 ? Math.min(x0, 1920 - half) : Math.max(x0, half);
      L.push(<Stat key={key} t={t} at={a} out={a + d} text={text} sub={o.sub} x={x} y={o.y ?? 320} size={size} />);
    };
    const PRICE = (key: string, ph: string, $: string, sub: string, d = 3.5, after = 0) => N(key, ph, $, d, { sub, after });
    const OVEN = (key: string, ph: string, temp: string, d = 3, after = 0) => { const a = A(ph, after); if (ok(a)) L.push(<OvenDial key={key} t={t} at={a} out={a + Math.max(d, 3.5)} text={temp} sub="OVEN" x={300} y={430} />); };
    const ING = (key: string, title: string, rows: [string, string][], after: number, pad = 2.5) => {
      const r = rows.map(([ph, txt]) => ({ at: A(ph, after), txt })).filter((x) => x.at >= 0);
      if (r.length) L.push(<RecipeCard key={key} t={t} title={title} rows={r} out={r[r.length - 1].at + pad} />);
    };
    const VS = (key: string, ph: string, d: number, title: string, l: [string, string], r: [string, string], after = 0) => {
      const a = A(ph, after); if (!ok(a)) return;
      L.push(<VersusS key={key} t={t} at={a} out={a + d} title={title} L={{ label: l[0], val: l[1], h: 0.85, col: COL.red, mark: "x" }} R={{ label: r[0], val: r[1], h: 0.35, col: GREEN, mark: "ok" }} />);
    };
    const CHIPS = (key: string, ph: string, items: string[], d: number, after = 0, label?: string) => { const a = A(ph, after); if (ok(a)) Z(key, a, a + d, "list", label ?? sec, "", { items: items.map((txt, i) => ({ at: a + i * 0.45, txt })) }); };
    const STAMP = (key: string, ph: string, text: string, d = 2.6, after = 0, label = "REMEMBER") => { const a = A(ph, after); if (ok(a)) Z(key, a, a + Math.max(d, 3), "warn", label, text); };
    const CTA = (key: string, ph: string, d: number, sub = "LINK IN THE 1ST LINE OF THE DESCRIPTION", after = 0) => { const a = A(ph, after); if (ok(a)) Z(key, a, a + d, "book", "MY COOKBOOK", "Supper for One", { sub }); };
    const COOL = (key: string, ph: string, label: string, d: number, after = 0) => { const a = A(ph, after); if (ok(a)) L.push(<CoolClock key={key} t={t} at={a} out={a + d} label={label} />); };
    // cada cena: título grande → chip de página + precio por plato hasta la próxima
    const S = [0, ...["one", "2", "3", "four", "five", "six", "seven", "eight", "nine", "10"].map((w) => A("supper number " + w))];
    const SUP = (n: number, name: string, page: number, price: string) => {
      const a = S[n]; if (!ok(a)) return;
      const out = (n < 10 && S[n + 1] > 0 ? S[n + 1] : A("walk back through them")) - 0.4, titleOut = a + 4.2;
      sec = `SUPPER ${n} · ${name}`;
      L.push(<PieTitle key={"st" + n} t={t} at={a} n={n} name={name} out={titleOut} />);
      L.push(<SupBadge key={"pc" + n} t={t} at={titleOut} out={out > 0 ? out : a + 60} n={n} name={name} page={page} price={price} />);
    };

    // ===== gancho =====
    STAMP("nok", "there's no knife", "NO KNIFE · NO CUTTING BOARD", 3.0, 0, "TONIGHT");
    W("one", "one chicken thigh", "ONE THIGH · ONE CAN · ONE DISH", 3.4, { y: 170 });
    N("5pm", "five o'clock", "5:00", 3.0, { sub: "PM · YOUR HANDS ACHE", col: COL.ink, x: 1450 });
    W("crk", "box of crackers", "…THAT'S SUPPER?", 2.6, { y: 170, col: COL.red });
    CHIPS("pour", "you open a can", ["OPEN", "POUR", "COVER", "SIT DOWN"], 6.5);
    N("40", "forty minutes later", "40 MIN", 3.0, { sub: "SMELLS LIKE A CHURCH SUPPER", col: "#ffb35a", edge: "#5a1e08" });
    CHIPS("no3", "no knife no cutting board", ["NO KNIFE", "NO CUTTING BOARD", "NO LEFTOVERS"], 5);
    N("u2", "less than two dollars", "<$2", 4, { sub: "EVERY PLATE", col: GREEN, edge: GEDGE, x: 1450 });
    W("paid", "not a guess", "NOT A GUESS · WHAT I PAID THIS FALL", 3.4, { y: 170, size: 70 });
    N("10s", "ten dump and bake", "10", 3.5, { sub: "DUMP & BAKE SUPPERS · FOR ONE", y: 340 });
    W("mk7", "stay with me", "#7 · THE MISTAKE ALMOST EVERYBODY MAKES", 4.5, { y: 170, size: 64, col: COL.amber });
    STAMP("nvr", "it was never you", "IT WAS ONE CUP OF WATER", 3.4);
    // ===== quién es =====
    CHIPS("who", "81 years old", ["81 YEARS OLD", "60 YEARS · CHURCH BASEMENT", "SMALL TOWN, IOWA"], 6);
    N("100", "a hundred people", "100", 3.5, { sub: "PEOPLE AT A TIME · 9×13 PANS", y: 360 });
    N("51", "51 years", "51 YEARS", 3.0, { sub: "WITH HAROLD", col: COL.ink, size: 150 });
    W("first", "the first one for just me", "THE FIRST ONE FOR JUST ME", 3.5);
    CHIPS("ocp", "open pour cover", ["OPEN", "POUR", "COVER", "LET THE OVEN WORK"], 5);
    VS("two", "the same two things", 9, "WHAT YOU WROTE ME", ["MY HANDS", "CAN'T HOLD A KNIFE"], ["4 DAYS", "SAME CASSEROLE"]);
    CHIPS("1or2", "one plate or two", ["1 PLATE TONIGHT", "MAYBE LUNCH TOMORROW", "THEN IT'S GONE"], 6);
    // ===== el libro (página 4) =====
    CTA("cta0", "it's called supper for one", 4.5, "MY BOOK · 140 LITTLE SUPPERS");
    N("140", "140 little suppers", "140", 3.5, { sub: "SUPPERS · EACH WITH WHAT IT COST" });
    VS("p4", "seven suppers a week", 9, "ONE WEEK · PAGE 4", ["FROZEN DINNERS", "$25–35"], ["THIS BOOK", "$15–18"]);
    W("2wk", "pays for itself", "PAYS FOR ITSELF IN ~2 WEEKS", 4, { y: 170, col: GREEN });
    CTA("cta1", "link is in the first line", 5, "+ THE FREEZER FOR ONE · GROCERIES FOR ONE");
    // ===== lo que hace falta =====
    const kit = A("here's everything you need");
    ING("kit", "THE WHOLE KITCHEN TONIGHT", [["one small baking dish", "SMALL BAKING DISH · 2 CUPS"], ["one little loaf pan", "LITTLE LOAF PAN · 8×4"], ["heavy foil", "HEAVY FOIL"]], kit);
    ING("pan", "THE PANTRY", [["cream of mushroom", "CREAM OF MUSHROOM SOUP"], ["spaghetti sauce", "SPAGHETTI SAUCE"], ["diced tomatoes", "DICED TOMATOES"], ["onion soup mix", "DRY ONION SOUP MIX"], ["dried minced onion", "DRIED MINCED ONION"], ["garlic powder", "GARLIC POWDER"]], kit);
    ING("frz", "THE FREEZER · PAGE 3", [["chicken thighs two", "CHICKEN THIGHS · 2 A BAG"], ["quarter pound squares", "¼ LB BEEF SQUARES"], ["frozen meatballs", "FROZEN MEATBALLS"]], kit);
    W("coat", "before you even take your coat off", "DIVIDE IT BEFORE YOUR COAT IS OFF", 3.5, { y: 170, size: 68 });
    // ===== 3 reglas =====
    const r1 = A("rule number one"), r2 = A("rule number two"), r3 = A("rule number three");
    if (ok(r1)) Z("r1", r1, r1 + 4, "tip", "RULE 1", "THE SMALL DISH");
    N("50c", "fifty cents", "50¢", 3, { sub: "THRIFT STORE PYREX", col: GREEN, edge: GEDGE, after: r1 });
    if (ok(r2)) Z("r2", r2, r2 + 4, "tip", "RULE 2", "FOIL ON TIGHT");
    VS("cvr", "covered to cook", 6, "SAY IT WITH ME", ["COVERED", "TO COOK"], ["UNCOVERED", "TO BROWN"], r2);
    if (ok(r3)) Z("r3", r3, r3 + 4, "tip", "RULE 3", "DRY NEEDS WET");
    W("meas", "we're measuring for one", "MEASURED FOR ONE · NOT THE WHOLE CAN", 4, { y: 170, size: 68 });

    // ===== 1 · smothered chicken · p.94 =====
    SUP(1, "SMOTHERED CHICKEN THIGH", 94, "$1.10");
    OVEN("o1", "turn your oven to", "375°F", 3, S[1]);
    VS("thb", "breasts don't forgive", 6, "PAGE 94 · THE TRICK", ["BREAST", "DRIES OUT"], ["THIGH", "STAYS JUICY"], S[1]);
    ING("i1", "YOU'LL NEED", [["one boneless chicken thigh", "1 BONELESS THIGH"], ["salt and pepper on top", "SALT · PEPPER · THYME"], ["tip about half", "½ CAN CREAM OF MUSHROOM"], ["two tablespoons of milk", "2 TBSP MILK"]], S[1]);
    W("pinch", "pinch it tight", "PINCH THE FOIL TIGHT", 3, { col: COL.amber, after: S[1] });
    N("t1", "bake it covered", "35 + 10", 3.5, { sub: "MIN · COVERED + UNCOVERED", col: "#ffb35a", edge: "#5a1e08", size: 150, after: S[1] });
    N("165", "has to be 165", "165°F", 3, { sub: "IN THE MIDDLE", col: "#ff8a5a", edge: "#5a1508", after: S[1] });
    W("half", "don't you dare throw it out", "THE OTHER HALF CAN → SUPPER #10", 4, { y: 170, size: 70, col: COL.amber, after: S[1] });
    VS("v1", "frozen chicken dinner", 6, "PAGE 4", ["FROZEN CHICKEN DINNER", "$3.50–5"], ["MY THIGH", "$1.10"], S[1]);

    // ===== 2 · hamburger steak · p.87 =====
    SUP(2, "HAMBURGER STEAK & ONION GRAVY", 87, "$1.60");
    W("oval", "press it into an oval", "PRESS IT RIGHT ON THE WRAPPER", 3.2, { after: S[2] });
    W("dent", "with your thumb", "A THUMB DENT · STAYS FLAT", 3.2, { col: COL.amber, after: S[2] });
    ING("i2", "YOU'LL NEED", [["quarter pound squares of ground beef", "¼ LB GROUND BEEF"], ["one tablespoon of the dry onion", "1 TBSP ONION SOUP MIX"], ["a half cup of water", "½ CUP WATER · AROUND IT"], ["worcestershire", "DASH OF WORCESTERSHIRE"]], S[2]);
    N("20c", "twenty cents", "20¢", 3, { sub: "THE ONION YOU DON'T CHOP", col: GREEN, edge: GEDGE, after: S[2] });
    OVEN("o2", "foil on tight", "375°F", 3, S[2]);
    W("flr", "stir one teaspoon of flour", "1 TSP FLOUR + COLD WATER = GRAVY", 4, { y: 170, size: 70, after: S[2] });
    N("160", "has to be 160", "160°F", 3, { sub: "GROUND BEEF", col: "#ff8a5a", edge: "#5a1508", after: S[2] });
    VS("v2", "drive-thru supper", 6, "PAGE 4", ["DRIVE-THROUGH", "$9–11"], ["MY DINER PLATE", "$1.60"], S[2]);
    W("small", "small victories", "SMALL VICTORIES, HONEY", 3, { y: 170, after: S[2] });

    // ===== 3 · meatballs · p.13 =====
    SUP(3, "MEATBALLS & GLAZED CARROTS", 13, "$1.90");
    STAMP("nth", "even need to thaw", "NO THAWING", 2.4, S[3]);
    ING("i3", "YOU'LL NEED", [["baby carrots", "8–10 BABY CARROTS"], ["one teaspoon of butter", "1 TSP BUTTER · 1 TSP HONEY"], ["five frozen meatballs", "5 FROZEN MEATBALLS"]], S[3]);
    OVEN("o3", "turn the oven to 400", "400°F", 3, S[3]);
    VS("gj", "grape jelly and chili sauce", 6, "THE CHURCH POTLUCK SAUCE", ["NOBODY", "EVER GUESSES"], ["1 TBSP JELLY", "+ 1 TBSP CHILI SAUCE"], S[3]);
    if (ok(S[3])) { const a = A("five meatballs is about", S[3]), b = A("the carrots are about", S[3]); if (ok(a)) Z("c3", a, (ok(b) ? b : a) + 4, "list", "WHAT IT COSTS", "", { items: ["MEATBALLS · 75¢", "CARROTS · 40¢", "THE REST · 75¢"].map((txt, i) => ({ at: a + i * 0.45, txt })) }); }
    N("80", "80 meatballs", "80 → 16", 3.5, { sub: "MEATBALLS · SUPPERS", size: 150, after: S[3] });

    // ===== 4 · enchiladas · p.136 =====
    SUP(4, "CHEESE ENCHILADAS IN A LOAF PAN", 136, "$1.40");
    ING("i4", "YOU'LL NEED", [["four small tortillas", "4 SMALL TORTILLAS"], ["one cup of shredded cheese", "1 CUP SHREDDED CHEESE"], ["one cup of red enchilada sauce", "1 CUP ENCHILADA SAUCE"], ["a teaspoon of that dried minced", "1 TSP DRIED MINCED ONION"]], S[4]);
    W("gift", "is a gift", "PRE-SHREDDED = A GIFT FOR BAD HANDS", 3.5, { y: 170, size: 66, after: S[4] });
    VS("tor", "crack when they're cold", 6, "PAGE 136 · THE TRICK", ["COLD TORTILLA", "CRACKS"], ["DAMP TOWEL · 20 SEC", "BENDS"], S[4]);
    OVEN("o4", "bake it 20 minutes uncovered until", "375°F", 3, S[4]);
    COOL("tm4", "let it sit five minutes", "REST 5 MIN", 4, S[4]);
    PRICE("p4", "two plates for $2.80", "$2.80", "TWO PLATES · $1.40 EACH", 3.5, S[4]);
    // ===== comentarios =====
    W("cmt", "come down to the comments", "WHERE ARE YOU WATCHING FROM?", 4, { y: 170 });
    W("sub", "tap subscribe", "NEW SUPPERS FOR ONE · EVERY WEEK", 3.5, { y: 170, size: 70, col: COL.amber });

    // ===== 5 · ham · p.93 =====
    SUP(5, "HAM STEAK WITH PINEAPPLE", 93, "$0.90");
    W("cheap", "cheapest real meat supper", "THE CHEAPEST MEAT SUPPER IN THE BOOK", 3.5, { y: 170, size: 66, after: S[5] });
    STAMP("ncut", "no knife tonight", "DON'T CUT IT · BAKE IT WHOLE", 3, S[5]);
    ING("i5", "YOU'LL NEED", [["put the whole ham steak", "1 HAM STEAK"], ["two pineapple rings", "2 PINEAPPLE RINGS"], ["one teaspoon of brown sugar", "1 TSP BROWN SUGAR"], ["little pat of butter", "A PAT OF BUTTER"]], S[5]);
    N("15m", "15 minutes in the oven", "15 MIN", 3, { sub: "NO FOIL · 375°F", col: "#ffb35a", edge: "#5a1e08", after: S[5] });
    W("thu", "wrap the other half", "THE OTHER HALF → THURSDAY", 3.5, { y: 170, after: S[5] });
    W("rings", "leftover pineapple rings", "FREEZE THE RINGS FLAT · ONE AT A TIME", 4, { y: 170, size: 66, after: S[5] });
    VS("v5", "4 little cubes", 5, "HAM SUPPER", ["FROZEN DINNER", "4 LITTLE CUBES"], ["MINE", "90¢"], S[5]);
    // guarniciones sin cuchillo
    const sd = A("what do you put beside it");
    ING("sides", "NO-KNIFE SIDES", [["canned green beans", "CANNED GREEN BEANS"], ["frozen peas straight", "FROZEN PEAS"], ["creamed peas", "CREAMED PEAS · P.142 · 45¢"], ["applesauce", "APPLESAUCE"], ["canned peach half", "COTTAGE CHEESE + PEACH · P.139"], ["bread and butter", "BREAD AND BUTTER"]], sd, 3);

    // ===== 6 · ziti · p.113 =====
    SUP(6, "BAKED ZITI IN A LOAF PAN", 113, "$1.50");
    W("boil", "most dangerous thing", "A POT OF BOILING WATER", 3, { y: 170, col: COL.red, after: S[6] });
    STAMP("raw", "the pasta goes in raw", "THE PASTA GOES IN RAW", 3, S[6]);
    ING("i6", "YOU'LL NEED", [["four ounces of dry ziti", "4 OZ DRY ZITI"], ["one and a half cups of spaghetti sauce", "1½ CUPS SPAGHETTI SAUCE"], ["one cup of hot water", "1 CUP HOT WATER"]], S[6]);
    W("under", "every piece is under", "EVERY PIECE UNDER THE SAUCE", 3.4, { col: COL.amber, after: S[6] });
    N("t6", "bake it covered 40", "40 + 10", 3.5, { sub: "MIN · COVERED + UNCOVERED", col: "#ffb35a", edge: "#5a1e08", size: 150, after: S[6] });
    VS("rk", "cottage cheese works", 6, "PAGE 113 · THE TRICK", ["RICOTTA", "COSTS MORE"], ["COTTAGE CHEESE", "JUST AS GOOD"], S[6]);
    COOL("tm6", "let it sit 10 minutes", "REST 10 MIN", 4, S[6]);
    PRICE("p6", "two plates three dollars", "$1.50", "A PLATE · TWO PLATES", 3.5, S[6]);

    // ===== 7 · goulash · p.110 · EL ERROR =====
    SUP(7, "IOWA GOULASH", 110, "$1.20");
    W("1pot", "one pot to wash", "NOW: ONE DISH · DON'T STIR IT ONCE", 3.5, { y: 170, size: 70, after: S[7] });
    const mk = A("here's the mistake", S[7]);
    if (ok(mk)) Z("mk7", mk, mk + 6, "warn", "THE MISTAKE", "NO WATER FOR THE DRY PASTA", { n: 7 });
    W("crn", "crunchy noodles", "CRUNCHY NOODLES · DRY RED CRUST", 3, { y: 170, col: COL.red, after: S[7] });
    STAMP("1cup", "that's the whole mistake", "ONE CUP OF WATER", 3.2, S[7]);
    VS("wet", "they're not", 4, "TOMATOES AREN'T ENOUGH", ["JUST THE CAN", "CRUNCHY"], ["+ 1 CUP WATER", "SOFT · PLUMP"], S[7]);
    ING("i7", "YOU'LL NEED", [["dry elbow macaroni", "¾ CUP DRY MACARONI"], ["pinch it into little pieces", "¼ LB BEEF · PINCHED RAW"], ["dried minced onion", "1 TSP DRIED ONION · ½ TSP PAPRIKA"], ["whole can of diced tomatoes", "1 CAN DICED TOMATOES"], ["and now the cup of water", "1 CUP WATER"]], S[7]);
    N("t7", "bake it covered 45", "45 + 5", 3.5, { sub: "MIN · COVERED + CHEESE", col: "#ffb35a", edge: "#5a1e08", size: 150, after: S[7] });
    W("name", "a bag with no name", "A BAG WITH NO NAME = THROWN AWAY", 3.5, { y: 170, size: 68, col: COL.red, after: S[7] });
    PRICE("p7", "one dollar and twenty cents a plate", "$1.20", "A PLATE", 3.5, A("a bag with no name", S[7]));
    // la carta + herramientas
    W("86", "she was 86", "86 · HANDS THAT SHAKE", 3.4, { y: 170 });
    W("2y", "first hot supper", "\"THE FIRST HOT SUPPER IN TWO YEARS\"", 4, { y: 170, size: 66, col: COL.amber });
    const tl = A("a rubber jar opener");
    ING("tools", "3 THINGS THAT KEEP ME COOKING", [["a rubber jar opener", "RUBBER JAR OPENER · ~$1"], ["an electric can opener", "ELECTRIC CAN OPENER"], ["kitchen scissors", "GOOD KITCHEN SCISSORS"]], tl, 3);

    // ===== 8 · alfredo · p.112 =====
    SUP(8, "CHICKEN ALFREDO FOR ONE", 112, "$1.80");
    W("cc", "cream cheese makes alfredo", "CREAM CHEESE · DOESN'T BREAK", 3.5, { col: COL.amber, after: S[8] });
    ING("i8", "YOU'LL NEED", [["two ounces of fettuccine", "2 OZ FETTUCCINE · BROKEN"], ["half a cup of cooked chicken", "½ CUP CHICKEN · TORN"], ["two tablespoons of cream cheese", "2 TBSP CREAM CHEESE"], ["a third of a cup of milk", "⅓ CUP MILK + ¾ CUP BROTH"], ["quarter cup of grated parmesan", "¼ CUP PARMESAN"]], S[8]);
    W("rem7", "remember number seven", "REMEMBER #7 · PASTA NEEDS WATER", 3.4, { y: 170, after: S[8] });
    N("t8", "35 minutes covered", "35 MIN", 3, { sub: "COVERED · THEN STIR", col: "#ffb35a", edge: "#5a1e08", after: S[8] });
    VS("v8", "frozen alfredo dinners", 6, "PAGE 4", ["FROZEN ALFREDO", "$3.50–5"], ["MINE", "$1.80"], S[8]);

    // ===== 9 · spanish rice · p.115 =====
    SUP(9, "SPANISH RICE WITH BEEF", 115, "$1.10");
    STAMP("peek", "the steam runs out", "DON'T PEEK", 2.6, S[9]);
    ING("i9", "YOU'LL NEED", [["long grain white rice", "½ CUP LONG GRAIN RICE"], ["pinch in your quarter pound", "¼ LB BEEF · PINCHED RAW"], ["frozen chopped peppers", "FROZEN PEPPERS & ONIONS"], ["chili powder", "½ TSP CHILI POWDER"], ["half a cup of water", "1 CAN TOMATOES + ½ CUP WATER"]], S[9]);
    N("t9", "bake it 50 minutes", "50 MIN", 3, { sub: "COVERED · DON'T LIFT IT", col: "#ffb35a", edge: "#5a1e08", after: S[9] });
    COOL("tm9", "rest five minutes with the lid", "REST 5 MIN · FOIL ON", 4, S[9]);
    N("950", "nine suppers so far", "9 PLATES", 4.5, { sub: "ABOUT $12.50 · ALL TOGETHER", col: GREEN, edge: GEDGE, size: 150, after: S[9] });
    CTA("cta2", "every one of these is on its own page", 5, undefined, S[9]);

    // ===== 10 · tetrazzini · p.156 =====
    SUP(10, "TURKEY TETRAZZINI", 156, "$1.40");
    W("hc", "that half can", "THE HALF CAN FROM #1", 3.4, { y: 170, col: COL.amber, after: S[10] });
    ING("i10", "YOU'LL NEED", [["quarter pound of roast turkey", "¼ LB DELI TURKEY · TORN"], ["three ounces of spaghetti", "3 OZ SPAGHETTI · IN THIRDS"], ["half a can of cream of mushroom", "½ CAN CREAM OF MUSHROOM"], ["a third of a cup of milk", "⅓ CUP MILK + ¾ CUP WATER"], ["two tablespoons of bread crumbs", "2 TBSP BREAD CRUMBS"]], A("here's what you need", S[10]));
    N("t10", "foil tight 40 minutes", "40 + 10", 3.5, { sub: "MIN · COVERED + CRUMBS", col: "#ffb35a", edge: "#5a1e08", size: 150, after: S[10] });
    N("st", "stuffing for one", "90¢", 3.5, { sub: "STUFFING FOR ONE · TWO SERVINGS", col: GREEN, edge: GEDGE, after: S[10] });

    // ===== el plan del freezer · p.163 =====
    W("2wk2", "two easy weeks", "10 SUPPERS → 2 EASY WEEKS", 3.5, { y: 170 });
    CHIPS("frz5", "all five freeze", ["ZITI", "GOULASH", "ENCHILADAS", "RICE", "TETRAZZINI"], 6);
    W("163", "my freezer plan", "PAGE 163 · MY FREEZER PLAN", 3, { y: 940, size: 60 });
    CHIPS("lid", "right on the lid", ["NAME", "DATE", "375°F · COVERED · 2× AS LONG"], 6);
    W("nth2", "no thawing", "STRAIGHT FROM FROZEN · NO THAWING", 3.5, { y: 170, size: 66 });
    W("ahead", "it's cooking small", "COOK SMALL · COOK AHEAD", 4, { y: 170, col: COL.amber });

    // ===== repaso: las 10 con su precio =====
    const rv = A("walk back through them");
    if (ok(rv)) {
      const rows: [string, string, number][] = [["number one", "SMOTHERED CHICKEN", 1.1], ["number two", "HAMBURGER STEAK", 1.6], ["number three", "MEATBALLS & CARROTS", 1.9], ["number four", "CHEESE ENCHILADAS", 1.4], ["number five", "HAM & PINEAPPLE", 0.9], ["number six", "BAKED ZITI", 1.5], ["number seven", "IOWA GOULASH", 1.2], ["number eight", "CHICKEN ALFREDO", 1.8], ["number nine", "SPANISH RICE", 1.1], ["number ten", "TURKEY TETRAZZINI", 1.4]];
      let after = rv; const r: { at: number; txt: string }[] = [];
      for (const [ph, name, $] of rows) { const a = A(ph, after); if (a < 0) continue; after = a + 0.5; r.push({ at: a, txt: `${name} · $${$.toFixed(2)}` }); }
      const tot = A("all 10 plates", rv);
      if (r.length) L.push(<RecipeCard key="rv" t={t} title="All 10 · No Knife" rows={r} out={(ok(tot) ? tot : r[r.length - 1].at) + 1} />);
      if (ok(tot)) L.push(<Stat key="tot" t={t} at={tot} text="$13.90" sub="ALL 10 PLATES" x={400} y={360} size={180} out={tot + 4} />);
    }
    CHIPS("start", "if your hands are bad", ["BAD HANDS → #5", "SICK OF CHICKEN → #4", "SUNDAY → #1, THEN #10"], 9);
    CHIPS("tbl", "use the good plate", ["THE GOOD PLATE", "SIT DOWN", "THE RADIO ON", "CALL SOMEBODY"], 7);
    const q1 = A("cooking for one isn't sad");
    if (ok(q1)) {
      const q2 = A("eating crackers over the sink is sad", q1);
      Z("q1", q1, q1 + 5, "name", "LORETTA SAYS", "\u201CCooking for one isn\u2019t sad.\u201D");
      if (ok(q2)) Z("q2", q2, q1 + 5, "tip", "BUT", "CRACKERS OVER THE SINK IS SAD");
    }
    CTA("cta3", "is in the first line of the description", 5, "140 SUPPERS · LINK IN THE 1ST LINE OF THE DESCRIPTION", q1);
    W("gl", "chop suey", "GOULASH · CHOP SUEY · SLUMGULLION? · COMMENTS", 4.5, { y: 170, size: 58 });
    const nw = A("now go turn that oven on");
    if (ok(nw)) Z("lt", nw - 0.3, TEND - 0.6, "name", "SUPPER FOR ONE", "Loretta", { sub: "THAT'S SUPPER, HONEY" });
    L.push(<ZocaloStack key="zs" t={t} items={ZS} />);
    return L;
  },
});

export const Full: React.FC = () => <AbsoluteFill><V.Body /></AbsoluteFill>;
export const clipPlan = V.clipPlan;
export const beatTable = V.beatTable;
