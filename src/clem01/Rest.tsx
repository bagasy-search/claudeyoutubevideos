// clem01 · DEL 1:13 AL FINAL (73,5 → 548,8 s). Misma vara que el minuto 1: una base por frase (toma agnes de Clem /
// la granja 3D / avatar) y CERO cortes secos; las piezas 2.5D viven encima y cruzan las transiciones.
// La granja 3D es UNA sola escena con UNA cámara (farm3d.tsx): cada "Use number N" es un vuelo a ese rincón de la casa.
// Todo anclado a la palabra con at("frase") sobre caps.json. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill } from "remotion";
import { screenOf, PT, BOTTLE } from "./farm3d";
import { World, DayCounter, MIN1_END } from "./Min1";
import { BigNum, COL, Chips, DrawX, FONT, LowerThird, Receipt, Tag, e, extrude, setSlug, spr } from "../kits/yanqui3d/lib";
import { makeVideo, Stamp, Price, Beat } from "../kits/yanqui3d/engine";
import { CheckList, Mistake, MistakesDeal, NextCard, StepTitle, Versus, Words } from "../kits/yanqui3d/pieces";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

setSlug("clem01");
export const T0 = MIN1_END, TEND = 548.8;
export const FULL_FRAMES = Math.ceil(TEND * 30);

// rótulo "USE N" que nace del punto 3D del uso y se va arriba a la izquierda (queda como chip mientras dura el uso)
const UseChip: React.FC<{ t: number; at: number; n: number; name: string; out: number }> = ({ t, at, n, name, out }) => {
  const k = Math.min(1.08, spr(t, at, 0.9)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const big = 1 - e(t, at + 1.6, at + 2.2);
  const x = 960 + (210 - 960) * (1 - big), y = 470 + (120 - 470) * (1 - big), sc = 0.42 + 0.58 * big;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc * k})`, perspective: 1100 }}>
      <div style={{ transform: `rotateY(${(1 - Math.min(1, k)) * -60}deg)`, display: "flex", alignItems: "center", gap: 26, padding: "20px 40px 20px 22px", borderRadius: 26, background: "linear-gradient(180deg, rgba(30,24,14,.94), rgba(14,11,6,.94))", boxShadow: `0 30px 60px rgba(0,0,0,.6), 0 0 0 3px ${COL.amber}66`, whiteSpace: "nowrap" }}>
        <div style={{ width: 150, height: 150, borderRadius: 75, background: "radial-gradient(circle at 40% 35%, #e1b85a, #9b5a16)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 100, color: "#fff7e6", textShadow: extrude(5, "#5a3208") }}>{n}</div>
        <div style={{ fontFamily: FONT }}>
          <div style={{ fontWeight: 800, fontSize: 34, letterSpacing: 10, color: COL.amber }}>USE {n}</div>
          <div style={{ fontWeight: 900, fontSize: 84, color: COL.ink, letterSpacing: 2, textShadow: extrude(6, "rgba(0,0,0,.6)") }}>{name}</div>
        </div>
      </div>
    </div>
  );
};

const V = makeVideo({
  caps: CAPS as [string, number][], avwin: AVW as number[][], avail: AVAIL as { clips: string[]; imgs: string[] }, T0, TEND,
  beats: ({ at, AV, CL }) => {
    const W = (a: number, tr: Beat["tr"], p?: [number, number], blur = 0): Beat => ({ a, tr, p, r: (t) => <World t={t} blur={blur} /> });
    return [
      // ===== LA RECETA =====
      W(T0, "cut"),                                                    // "First, the jar": órbita al frasco vacío
      CL(at("Any glass jar") + 1.0, "s01", "light"),
      AV(79.395, "whip", { spans: [[at("Don't use metal"), 82.8]] }),
      CL(82.905, "s02", "push", undefined, [1.03, 1.12]),
      CL(at("Wash it") - 0.1, "s03", "whipL"),
      AV(93.798, "light"),
      CL(98.654, "s04", "whip"),
      CL(at("Rinse it") - 1.5, "s05", "zoom", [960, 540]),
      AV(111.856, "portal", { p: [960, 480], spans: [[at("A wet sprig") + 0.2, 118]] }),
      CL(118.216, "s06", "push"),
      W(at("You'll smell it") - 2.0, "zoom", [960, 540]),               // macro: el aceite de las agujas
      AV(131.171, "whipL", { spans: [[at("Stuff the sprigs") - 0.1, 137.4]] }),
      CL(137.58, "s07", "flip"),
      AV(147.511, "zoom", { p: [960, 520] }),
      CL(152.743, "s08", "whip"),
      W(at("the hardest part") - 0.1, "light"),                         // "You wait."
      CL(at("Put the jar in a dark") , "s09", "portal", [960, 540]),
      AV(166.614, "whip", { spans: [[at("shake") - 0.1, 170.6]] }),
      W(170.778, "zoom", [960, 540]),                                    // time-lapse en la alacena
      CL(at("By the end of the first"), "s10", "portal", [700, 450]),
      W(at("By the end of the second") - 0.1, "portal", [1100, 470]),
      AV(183.254, "whip", { spans: [[at("That's when it's ready") - 0.1, 188.9]] }),
      W(188.987, "flip"),                                                 // dos frascos: 1 semana vs 2 semanas
      CL(at("Strain it"), "s11", "zoom", [960, 560]),
      AV(199.054, "light"),
      W(203.751, "whip"),                                                 // "keeps for a year in the cupboard"
      CL(at("For almost everything") - 0.05, "s12", "portal", [900, 520]),
      W(at("Use number one") - 0.05, "zoom", [960, 540]),
      // ===== LOS 10 USOS =====
      AV(217.003, "whip"),
      CL(222.3, "s13", "push"),
      AV(234.113, "whipL", { spans: [[234.3, 238.8]] }),
      CL(238.855, "s14", "light"),
      W(at("Use number two") - 0.1, "zoom", [960, 540]),
      CL(at("Spray it straight") + 0.1, "s15", "portal", [1400, 520]),
      AV(251.648, "whip"),
      W(255.693, "zoom", [960, 540]),                                     // la ventana del oeste ya limpia
      CL(at("Our farmhouse had") - 0.05, "s16", "portal", [1300, 500]),
      W(at("Use number three") - 0.1, "whip"),
      AV(268.036, "zoom", { p: [1400, 480] }),
      CL(271.885, "s17", "whipL"),
      AV(282.904, "push", { spans: [[at("Use number four") - 0.1, 287.9]] }),
      W(287.987, "flip"),                                                 // la olla con vapor
      CL(at("Pour a cup") - 0.1, "s18", "portal", [960, 420]),
      AV(300.75, "light"),
      CL(304.296, "s19", "whip"),
      W(at("Use number five") - 0.1, "zoom", [960, 540]),                 // la fila de hormigas
      AV(315.22, "whipL", { spans: [[at("Ants follow") - 0.1, 320.4]] }),
      CL(320.494, "s20", "push"),
      AV(330.631, "zoom", { p: [960, 540], spans: [[at("Use number six") - 0.1, 335.2]] }),
      CL(335.288, "s21", "whip"),
      CL(at("My father had") - 0.05, "s22", "light"),
      AV(348.048, "whipL", { spans: [[at("Use number seven") - 0.1, 353.8]] }),
      W(353.874, "portal", [960, 540]),                                   // la canilla con sarro
      CL(at("Soak a rag") - 0.1, "s23", "zoom", [960, 560]),
      AV(365.644, "whip"),
      CL(369.447, "s24", "push"),
      W(at("Use number eight") - 0.1, "whipL"),                           // el tacho
      AV(381.707, "zoom", { p: [1300, 560] }),
      CL(386.245, "s25", "whip"),
      CL(at("On the farm we did") - 0.05, "s26", "light"),
      W(at("Use number nine") - 0.1, "zoom", [960, 540]),                 // el gallinero
      AV(398.234, "portal", { p: [700, 600] }),
      CL(401.843, "s27", "whipL"),
      CL(at("chickens drink more") - 0.1, "s28", "light"),
      AV(413.219, "whip", { spans: [[at("Use number 10") - 0.1, 417.6]] }),
      CL(417.681, "s29", "push"),
      CL(at("Pour it on the weeds") - 0.05, "s30", "whip"),
      AV(430.824, "light", { spans: [[at("Only use it") - 0.1, 434.9]] }),
      W(434.964, "zoom", [960, 540]),                                     // los yuyos del camino y la huerta que NO se toca
      // ===== LOS 3 ERRORES =====
      W(at("Now the three mistakes") - 0.05, "whip", undefined, 6),
      AV(446.724, "flip", { spans: [[at("Mistake number one") - 0.1, 451.9]] }),
      CL(451.998, "s31", "push", undefined, [1.04, 1.14]),
      AV(460.672, "whip", { spans: [[at("For stone") - 0.1, 465.3]] }),
      CL(465.413, "s32", "light"),
      W(at("Mistake number two") - 0.1, "zoom", [960, 540]),              // la lavandina bajo la pileta
      AV(477.305, "whipL", { spans: [[477.4, 481.1]] }),
      CL(481.223, "s33", "push"),
      CL(at("Mistake number three") - 0.1, "s34", "flip"),
      AV(492.574, "whip", { spans: [[at("plain scrubbed pine") - 0.1, 497.8]] }),
      CL(497.898, "s35", "light"),
      // ===== LAS CUENTAS Y EL CIERRE =====
      W(at("So let's add it up") - 0.1, "zoom", [960, 540]),
      AV(511.242, "portal", { p: [960, 500] }),
      W(515.16, "light"),                                                 // el frasco al atardecer; la casa que se aleja
      AV(526.481, "zoom", { p: [960, 540], edge: true }),
      CL(531.947, "s36", "light", undefined, [1.02, 1.08]),
      AV(541.354, "whip"),
      W(545.814, "light"),
    ];
  },
  pieces: (t, { at, Clip }) => {
    const L: React.ReactNode[] = [];
    const tag = (key: string, a: number, q: [number, number, number], text: string, o: { dx?: number; dy?: number; sub?: string; col?: string; out: number; size?: number }) => {
      if (t < a - 0.05 || t > o.out + 0.4) return;
      const p = screenOf(t, q);
      L.push(<Tag key={key} t={t} at={a} x={p.x} y={p.y} dx={o.dx ?? 160} dy={o.dy ?? -130} text={text} sub={o.sub} col={o.col} out={o.out} size={o.size} />);
    };
    // ===== receta =====
    L.push(<StepTitle y={250} key="st1" t={t} at={at("First, the jar")} n={1} name="THE JAR" out={at("Any glass jar") + 0.9} col={COL.amber} />);
    tag("tj", at("tight lid"), PT.jarTable, "TIGHT LID", { dx: -200, dy: -150, out: at("Any glass jar") + 0.9 });
    L.push(<Words key="qt" t={t} items={[{ at: at("A quart"), txt: "A QUART CANNING JAR" }]} out={79.2} y={900} size={70} />);
    L.push(<Versus key="mg" t={t} at={at("plastic jug") - 0.2} out={at("Glass only") + 1.1} title="WHAT TO STEEP IT IN" L={{ label: "METAL / PLASTIC", val: "NO", h: 0.3, col: COL.red, mark: "x" }} R={{ label: "GLASS", val: "ONLY", h: 0.9, col: "#8fd6ff", mark: "ok" }} />);
    L.push(<Words key="up" t={t} items={[{ at: at("upside down") - 0.1, txt: "DRY UPSIDE DOWN" }]} out={93.6} y={160} size={84} />);
    L.push(<StepTitle y={250} key="st2" t={t} at={at("Now the rosemary")} n={2} name="THE ROSEMARY" out={93.7} col="#9df0b4" />);
    L.push(<Chips key="sp" t={t} at={at("six or seven")} items={["6-7 SPRIGS", "HAND-LONG", "FRESH"]} out={102.7} y={760} />);
    L.push(<Words key="st" t={t} items={[{ at: at("store, that works") - 0.2, txt: "STORE-BOUGHT WORKS TOO" }]} out={105.8} y={170} size={74} />);
    L.push(<Stamp key="dry" t={t} at={at("Dry it completely")} text="DRY IT COMPLETELY" x={960} y={200} rot={-5} size={92} out={111.7} />);
    L.push(<Words key="tw" t={t} items={[{ at: at("on a towel"), txt: "ON A TOWEL · 1 HOUR", col: "#9df0b4" }]} out={111.7} y={900} size={70} />);
    L.push(<Versus key="wd" t={t} at={at("A wet sprig") + 0.2} out={118.0} title="WHAT GOES IN THE JAR" L={{ label: "WET SPRIG", val: "CLOUDY + SOUR", h: 0.35, col: COL.red, mark: "x" }} R={{ label: "DRY SPRIG", val: "STRONG", h: 0.9, col: "#9df0b4", mark: "ok" }} />);
    L.push(<StepTitle y={250} key="st3" t={t} at={at("Then you bruise it")} n={3} name="BRUISE IT" out={121.1} col="#9df0b4" />);
    L.push(<Chips key="br" t={t} at={at("roll each sprig")} items={["ROLL IN PALMS", "OR TAP WITH A SPOON"]} out={126.7} y={800} />);
    tag("oil", at("the oil inside") + 0.1, [PT.jarTable[0] + 0.01, 0.86, PT.jarTable[2] + 0.02], "THE OIL", { sub: "INSIDE THE NEEDLES", col: "#cfe86a", dx: 200, dy: -160, out: 131.0 });
    L.push(<Words key="pk" t={t} items={[{ at: at("nice and tight"), txt: "PACKED TIGHT" }, { at: at("all the way"), txt: "TO THE BOTTOM", col: "#9df0b4" }]} out={137.4} y={880} size={84} />);
    L.push(<StepTitle y={250} key="st4" t={t} at={at("Now pour in") - 0.05} n={4} name="THE VINEGAR" out={at("Now pour in") + 1.9} col="#e9f1ec" />);
    L.push(<Price key="5p" t={t} at={at("the 5%") - 0.1} x={1520} y={200} item="5% WHITE VINEGAR" $={3} out={144.4} />);
    L.push(<Words key="un" t={t} items={[{ at: at("every needle") - 0.1, txt: "EVERY NEEDLE UNDER", col: "#8fd6ff" }]} out={147.3} y={170} size={84} />);
    L.push(<Stamp key="bn" t={t} at={at("turn brown") - 0.1} text="STICKS OUT = SPOILS" x={960} y={850} rot={-4} size={80} out={152.5} />);
    L.push(<Words key="wx" t={t} items={[{ at: at("wax paper") - 0.1, txt: "WAX PAPER" }, { at: at("never touches"), txt: "VINEGAR ≠ METAL", col: COL.amber }]} out={161.0} y={170} size={84} />);
    L.push(<BigNum key="yw" t={t} at={at("You wait")} text="YOU WAIT." x={960} y={300} size={170} out={163.4} />);
    L.push(<Words key="cb" t={t} items={[{ at: at("dark cupboard") - 0.1, txt: "DARK CUPBOARD" }, { at: at("away from the stove"), txt: "AWAY FROM THE STOVE", col: COL.amber }]} out={166.4} y={900} size={68} />);
    L.push(<Chips key="sk" t={t} at={at("Every two or three")} items={["EVERY 2-3 DAYS", "SHAKE IT"]} out={170.6} y={760} />);
    L.push(<DayCounter key="dc" t={t} from={170.85} out={183.1} />);
    if (t > 170.8 && t < 183.3) {
      tag("w0", at("nothing seems"), PT.jarShelf, "NOTHING… YET", { dx: -250, dy: -140, out: 174.0 });
      tag("w2", at("dark honey", 170), PT.jarShelf, "WEEK 2", { sub: "DARK HONEY", col: COL.amber, dx: -260, dy: 130, out: 183.0 });
      tag("lid", at("open the lid"), [PT.jarShelf[0], PT.jarShelf[1] + 0.1, PT.jarShelf[2]], "SMELLS LIKE ROSEMARY", { sub: "NOT VINEGAR", col: "#cfe86a", dx: 230, dy: -150, out: 183.0 });
    }
    L.push(<Words key="w1" t={t} items={[{ at: at("pale green gold") - 0.1, txt: "WEEK 1 · PALE GREEN GOLD", col: "#e1d77a" }]} out={178.0} y={900} size={74} />);
    if (t > 188.9 && t < 195.3) {
      tag("j1", at("I've tried one"), PT.jarTable2, "1 WEEK", { sub: "SOUR WATER", col: "#e1d77a", dx: -230, dy: -150, out: 195.0 });
      tag("j2", at("Two weeks, not one"), PT.jarTable, "2 WEEKS", { sub: "READY", col: COL.amber, dx: 230, dy: -150, out: 195.0 });
    }
    L.push(<Words key="cp" t={t} items={[{ at: at("compost") - 0.1, txt: "OLD SPRIGS → COMPOST", col: "#9df0b4" }]} out={199.0} y={900} size={70} />);
    L.push(<BigNum key="cc" t={t} at={at("That's your concentrate")} text="CONCENTRATE" x={960} y={330} size={130} col={COL.amber} edge="#5a3208" out={203.6} />);
    tag("yr", at("keeps for a year"), PT.jarShelf, "KEEPS 1 YEAR", { col: COL.amber, dx: 230, dy: -140, out: 205.8 });
    L.push(<Versus key="hh" t={t} at={at("Half rosemary")} out={215.5} title="THE SPRAY BOTTLE" L={{ label: "ROSEMARY VINEGAR", val: "½", h: 0.5, col: COL.amber }} R={{ label: "WATER", val: "½", h: 0.5, col: "#8fd6ff" }} />);
    // ===== usos =====
    const U: [string, number, string, number][] = [
      ["Use number one", 1, "THE COUNTER", 243.2], ["Use number two", 2, "WINDOWS", 266.7], ["Use number three", 3, "THE FRIDGE", 286.4], ["Use number four", 4, "SMELLS", 309.6],
      ["Use number five", 5, "ANTS", 330.8], ["Use number six", 6, "CUTTING BOARDS", 352.1], ["Use number seven", 7, "HARD WATER", 376.9], ["Use number eight", 8, "THE TRASH CAN", 396.7],
      ["Use number nine", 9, "THE WATERER", 415.8], ["Use number 10", 10, "WEEDS", 440.9],
    ];
    U.forEach(([ph, n, name, out]) => L.push(<UseChip key={"u" + n} t={t} at={at(ph)} n={n} name={name} out={out} />));
    tag("sp1", at("Use number one") + 0.5, PT.spray, "HALF & HALF", { col: COL.amber, dx: 200, dy: -160, out: 216.95 });
    L.push(<Chips key="u1" t={t} at={at("cuts the grease")} items={["GREASE", "DRIED SPOTS", "CLEAN SMELL"]} out={234.0} y={780} />);
    L.push(<Chips key="tb" t={t} at={at("where you eat")} items={["EAT", "THE BOOKS", "CLEAN A CHICKEN"]} out={238.7} y={760} />);
    L.push(<Stamp key="en" t={t} at={at("every single night")} text="EVERY SINGLE NIGHT" x={960} y={860} rot={-4} size={78} out={243.3} />);
    tag("dw", at("Use number two") + 0.4, PT.westWin, "HARVEST DUST", { col: "#e1c99a", dx: -260, dy: -150, out: 246.6 });
    L.push(<Versus key="np" t={t} at={at("Not a paper towel") - 0.1} out={251.5} title="WIPE WITH" L={{ label: "PAPER TOWEL", val: "STREAKS", h: 0.3, col: COL.red, mark: "x" }} R={{ label: "OLD NEWSPAPER", val: "NO STREAKS", h: 0.9, col: "#8fd6ff", mark: "ok" }} />);
    tag("cw", 255.9, PT.westWin, "NOT ONE STREAK", { col: "#8fd6ff", dx: -260, dy: -160, out: 258.7 });
    tag("fr", at("Use number three") + 0.4, PT.fridge, "OLD SMELLS", { col: "#e8f4ff", dx: -250, dy: -150, out: 267.9 });
    L.push(<Words key="tk" t={t} items={[{ at: at("Take everything out"), txt: "EVERYTHING OUT" }, { at: at("spray the shelves"), txt: "SPRAY · WIPE", col: COL.amber }]} out={275.3} y={170} size={84} />);
    L.push(<Versus key="cv" t={t} at={at("takes out the old") - 0.1} out={281.2} title="OLD SMELLS" L={{ label: "SPRAY CLEANER", val: "COVERS IT", h: 0.35, col: COL.red, mark: "x" }} R={{ label: "VINEGAR", val: "TAKES IT OUT", h: 0.9, col: COL.amber, mark: "ok" }} />);
    L.push(<Stamp key="sf" t={t} at={at("safe around food")} text="SAFE AROUND FOOD" x={960} y={860} rot={-4} size={80} out={286.4} />);
    tag("po", at("When the kitchen smells") , PT.pot, "FISH · BURNT BACON", { col: COL.amber, dx: -240, dy: -170, out: 292.2 });
    L.push(<CheckList key="sm" t={t} title="SIMMER POT" rows={[{ at: at("a cup of the concentrate"), txt: "1 CUP CONCENTRATE" }, { at: at("two cups of water"), txt: "2 CUPS WATER" }, { at: at("on low"), txt: "LOW · 30 MIN" }]} out={300.6} />);
    L.push(<Words key="st2" t={t} items={[{ at: at("The steam carries"), txt: "THE WHOLE HOUSE", col: "#cfe86a" }]} out={304.1} y={880} size={84} />);
    L.push(<Chips key="dg" t={t} at={at("grandkids")} items={["GRANDKIDS OVER", "WET DOG"]} out={309.6} y={780} />);
    tag("an", at("When a line of ants"), PT.ants, "SCENT TRAIL", { col: COL.red, dx: -220, dy: -160, out: 315.1 });
    L.push(<Words key="sw" t={t} items={[{ at: at("wipes it out") - 0.2, txt: "TRAIL WIPED OUT", col: COL.amber }]} out={320.4} y={880} size={84} />);
    L.push(<Chips key="dr" t={t} at={at("the doorway")} items={["DOORWAY", "WINDOWSILL"]} out={326.1} y={800} />);
    L.push(<Words key="3d" t={t} items={[{ at: at("two or three days", 320), txt: "2-3 DAYS IN A ROW" }]} out={330.5} y={170} size={84} />);
    L.push(<Chips key="5m" t={t} at={at("spray the board")} items={["SPRAY", "SIT 5 MIN", "HOT RINSE"]} out={342.3} y={780} />);
    L.push(<Words key="on" t={t} items={[{ at: at("the onion smell") - 0.1, txt: "ONION SMELL — GONE", col: COL.amber }]} out={345.4} y={170} size={84} />);
    L.push(<Words key="bb" t={t} items={[{ at: at("older than me"), txt: "OLDER THAN ME" }]} out={347.9} y={880} size={84} />);
    tag("cr", at("white crust") - 0.1, PT.faucet, "WHITE CRUST", { sub: "WELL WATER", col: "#f2efe6", dx: -260, dy: -150, out: 361.0 });
    L.push(<CheckList key="rg" t={t} title="FAUCET" rows={[{ at: at("Soak a rag"), txt: "RAG + STRAIGHT CONCENTRATE" }, { at: at("wrap it around"), txt: "WRAP THE FAUCET" }, { at: at("leave it an hour"), txt: "1 HOUR" }]} out={365.5} />);
    L.push(<Words key="wo" t={t} items={[{ at: at("wipes right off"), txt: "WIPES RIGHT OFF", col: "#8fd6ff" }]} out={369.3} y={880} size={84} />);
    L.push(<Chips key="sh" t={t} at={at("plastic bag")} items={["BAG", "RUBBER BAND", "OVERNIGHT"]} out={377.0} y={780} />);
    tag("tr", at("Spray the inside") , PT.trash, "SPRAY · AIR DRY", { col: COL.amber, dx: -260, dy: -150, out: 381.6 });
    L.push(<Words key="ns" t={t} items={[{ at: at("No more smell"), txt: "NO MORE SMELL" }]} out={388.4} y={170} size={92} />);
    L.push(<Stamp key="hg" t={t} at={at("if it works on that")} text="IF IT WORKS ON THAT…" x={960} y={860} rot={-4} size={74} out={396.8} />);
        L.push(<CheckList key="ww" t={t} title="ONCE A WEEK" rows={[{ at: at("empty it"), txt: "EMPTY" }, { at: at("scrub it"), txt: "SCRUB · HALF & HALF" }, { at: at("rinse it well"), txt: "RINSE WELL" }]} out={405.1} />);
    L.push(<Words key="gs" t={t} items={[{ at: at("green slime"), txt: "NO GREEN SLIME", col: "#9df0b4" }]} out={410.9} y={170} size={84} />);
    L.push(<Words key="lw" t={t} items={[{ at: at("all winter long") - 0.4, txt: "LAID ALL WINTER" }]} out={413.1} y={880} size={84} />);
    L.push(<CheckList key="wd2" t={t} title="WEED KILLER" rows={[{ at: at("straight concentrate", 418), txt: "STRAIGHT CONCENTRATE" }, { at: at("handful of salt"), txt: "+ BIG HANDFUL OF SALT" }, { at: at("hot, sunny day"), txt: "HOT SUNNY DAY" }]} out={430.6} />);
    L.push(<Words key="nx" t={t} items={[{ at: at("By the next evening"), txt: "BROWN BY NEXT EVENING", col: "#c49a5a" }]} out={433.2} y={170} size={78} />);
    if (t > 434.9 && t < 441.3) {
      tag("gv", 435.4, PT.weeds, "GRAVEL ONLY", { col: COL.amber, dx: 200, dy: -170, out: 441.0 });
      const g = screenOf(t, PT.garden);
      L.push(<Tag key="gn" t={t} at={at("never near the garden")} x={g.x} y={g.y} dx={-220} dy={-150} text="NEVER THE GARDEN" sub="THE SALT STAYS" col={COL.red} out={441.0} />);
      if (t > at("never near the garden") + 0.2) L.push(<DrawX key="gx" t={t} at={at("never near the garden") + 0.2} x={g.x - 110} y={g.y - 80} w={220} h={160} />);
    }
    // ===== errores =====
    L.push(<MistakesDeal key="md" t={t} at={at("Now the three mistakes")} out={at("And these matter") + 1.2} n={3} title="THE 3 MISTAKES" />);
    L.push(<BigNum key="ac" t={t} at={at("vinegar is an acid")} text="ACID" x={960} y={360} size={230} col="#cfe86a" edge="#3a4a10" sub="DOESN'T CARE WHAT YOU PAID" out={446.5} />);
    L.push(<Mistake key="m1" t={t} at={at("Mistake number one") + 0.1} n={1} txt="GRANITE · MARBLE · STONE" out={at("For stone") + 3.2} />);
    L.push(<Tag key="dl" t={t} at={at("dull spots")} x={980} y={560} dx={220} dy={-160} text="DULL FOREVER" col={COL.red} out={460.5} />);
    L.push(<Words key="ni" t={t} items={[{ at: at("in one afternoon") - 0.3, txt: "ONE AFTERNOON", col: COL.red }]} out={465.3} y={170} size={92} />);
    L.push(<Words key="sw2" t={t} items={[{ at: at("soap and warm water") - 0.1, txt: "STONE = SOAP + WARM WATER", col: "#8fd6ff" }]} out={468.8} y={170} size={70} />);
    L.push(<Mistake key="m2" t={t} at={at("Mistake number two") + 0.1} n={2} txt="NEVER WITH BLEACH" out={481.0} />);
    if (t > 468.9 && t < 477.5) {
      tag("bl", at("Never mix it with bleach"), BOTTLE(5), "BLEACH", { col: "#ffffff", dx: 200, dy: -170, out: 477.2 });
      L.push(<Words key="nb" t={t} items={[{ at: at("Not in the bottle"), txt: "NOT IN THE BOTTLE" }, { at: at("not in the bucket"), txt: "NOT IN THE BUCKET", col: COL.amber }, { at: at("one after the other"), txt: "NOT ONE AFTER THE OTHER", col: COL.red }]} out={477.2} y={150} size={70} />);
    }
    L.push(<Stamp key="gs2" t={t} at={at("make a gas")} text="TOXIC GAS" x={1250} y={430} rot={-5} size={110} out={481.0} />);
    L.push(<Words key="ob" t={t} items={[{ at: at("in one bottle") - 0.2, txt: "ONE BOTTLE · NO BLEACH", col: "#9df0b4" }]} out={488.0} y={170} size={78} />);
    L.push(<Mistake key="m3" t={t} at={at("Mistake number three") + 0.1} n={3} txt="WAXED OR OILED WOOD" out={503.4} />);
    L.push(<Words key="cl" t={t} items={[{ at: at("strips the finish"), txt: "STRIPS THE FINISH", col: COL.red }]} out={495.3} y={170} size={84} />);
    L.push(<Tag key="pp" t={t} at={at("plain scrubbed pine") + 0.3} x={960} y={600} dx={200} dy={-160} text="PLAIN SCRUBBED PINE" col={COL.amber} out={503.4} />);
    L.push(<Stamp key="sh2" t={t} at={at("has a shine")} text="SHINY? NO VINEGAR" x={960} y={860} rot={-4} size={74} out={503.4} />);
    // ===== cuentas =====
    L.push(<Receipt key="rc" t={t} title="UNDER THE SINK" rows={[{ at: at("Six cleaners"), item: "6 CLEANERS / MO", $: 40 }]} totalAt={at("almost $500")} x={1150} y={120} sc={1.35} out={511.0} />);
    L.push(<BigNum key="5h" t={t} at={at("almost $500") + 0.3} text="$500" x={600} y={330} size={210} col={COL.red} edge="#4a0d08" sub="A YEAR" out={511.0} />);
    L.push(<BigNum key="2d" t={t} at={at("about $2", 505)} text="$2" x={1440} y={330} size={240} col={COL.amber} edge="#5a3208" sub="A WHOLE SEASON" out={515.0} />);
    L.push(<Words key="kn" t={t} items={[{ at: at("buying it"), txt: "BUYING IT" }, { at: at("knowing how"), txt: "VS. KNOWING HOW", col: COL.amber }]} out={520.8} y={880} size={84} />);
    // la frase de la madre: renglón por palabra, sobre el frasco al atardecer
    if (t > at("My mother used to say") - 0.1 && t < 526.6) {
      const a1 = at("a farm doesn't"), a2 = at("it runs on knowing");
      L.push(<div key="q" style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: "#fff3dc", textShadow: "0 4px 24px rgba(0,0,0,.7)", opacity: 1 - e(t, 526.0, 526.4) }}>
        <div style={{ fontSize: 76, opacity: e(t, a1, a1 + 0.4), transform: `translateY(${(1 - e(t, a1, a1 + 0.5)) * 20}px)` }}>“A farm doesn’t run on money.</div>
        <div style={{ fontSize: 88, color: "#ffd38a", marginTop: 8, opacity: e(t, a2, a2 + 0.4), transform: `translateY(${(1 - e(t, a2, a2 + 0.5)) * 20}px)` }}>It runs on knowing things.”</div>
      </div>);
    }
    L.push(<Chips key="go" t={t} at={at("Go make your jar")} items={["THIS WEEK", "THE CUPBOARD", "2 WEEKS"]} out={531.7} y={780} />);
    L.push(<NextCard key="nc" t={t} at={at("And if you want to see")} subAt={at("the bathroom")} out={541.1} title="ONE JAR OF VINEGAR IN EVERY ROOM"><AbsoluteFill style={{ background: "#111" }}><Clip k="s36" a={531.947} z={[1.0, 1.06]} /></AbsoluteFill></NextCard>);
    L.push(<LowerThird key="lt" t={t} at={at("I'll see you there") - 0.3} out={TEND - 0.6} name="CLEM" l2="OLD CLEM'S FARM TRICKS" l2at={at("see you there")} />);
    return L;
  },
});

export const Rest: React.FC = () => <V.Body />;
export const clipPlan = V.clipPlan;
export const beatTable = V.beatTable;
