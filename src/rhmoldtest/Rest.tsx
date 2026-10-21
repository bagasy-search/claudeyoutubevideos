// rhmoldtest · EL RESTO (82,7 s → final). Un solo hilo: el avatar en sus 57 ventanas (reel único de RunPod) y entre ventana y ventana
// el MISMO baño 3D (con su microscopio y la guía en el pasillo) o la toma real de lo que se dice EN ESE SEGUNDO.
// Transiciones: barrido (sin desenfoque sobre el avatar) o portal cuando se entra al mundo. Cada pieza nace con SU palabra (AT).
// ⛔ Avatar SIN desenfoque. Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PT, screenOf, pagePt } from "./moho3d";
import WORDS from "./words.json";
import { BigNum, COL, FONT, Flash, LowerThird, Portal, Tag, e, ei } from "./lib";
import { Avatar, ChipsAt, Desc, Mag, Shot, Stamp, Swipe, VideoCall, WIN, World, clip } from "./Min1";
import { Board3, Bottles, Chem, Clock, Comment, Cycle, Depth, Drop, Guarantee, Kit, Meter, Mistake, NoMix, PaintOver, Pin, ProList, Ratio, Recap, Ring, Route, Rules, Saturdays, Scale, SqPlate, Steps, Tabs, Verdict, BottleLight } from "./restfx";

export const REST_START = 82.72;
export const END = 1029.3;

// ---------- palabras: AT("frase", desde) = segundo exacto en que arranca la frase ----------
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9$]/g, "");
// algunas "palabras" del ASR traen dos ("is $27"): se parten y comparten el segundo
const NW = (WORDS as [string, number, number][]).flatMap(([w, a]) => w.split(/\s+/).map((x) => [norm(x), a] as [string, number])).filter(([x]) => x);
export const MISS: string[] = [];
export const AT = (ph: string, from = 82): number => {
  const tk = ph.split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i < NW.length; i++) {
    if (NW[i][1] < from - 0.3) continue;
    let ok = true;
    for (let j = 0; j < tk.length; j++) if (!NW[i + j] || NW[i + j][0] !== tk[j]) { ok = false; break; }
    if (ok) return NW[i][1];
  }
  MISS.push(ph + "@" + from);
  return from;
};

// ---------- la línea de tiempo: qué se ve entre ventana y ventana del avatar ----------
// "w" = el mundo 3D (la cámara la manejan las llaves de moho3d); cualquier otra = toma real (LTX si llegó, si no el cuadro clave)
const FILL: [number, string][] = [
  [86.73, "l_flash"], [92.5, "w"], [95.74, "l_mildew"],
  [104.51, "w"], [111.74, "l_mold"],
  [122.34, "l_drywall"], [125.7, "w"],
  [138.47, "w"], [145.0, "l_dark"],
  [156.32, "t_kit"], [162.4, "w"],
  [172.89, "t_pour"],
  [185.75, "t_dab"], [191.7, "w"], [195.0, "t_wait"],
  [202.54, "w"], [206.0, "t_lighter"], [208.6, "t_same"],
  [220.53, "w"], [228.8, "t_rinse"],
  [238.83, "w"], [245.2, "c_book"], [249.8, "w"],
  [255.75, "w"],
  [271.01, "w"], [275.1, "p_stopper"], [282.9, "w"],
  [289.0, "p_window"], [294.6, "w"], [298.0, "p_behind"],
  [306.14, "p_fan"], [312.0, "w"],
  [320.01, "p_washer"], [326.0, "w"],
  [337.97, "h_threecups"], [343.8, "w"],
  [355.52, "w"],
  [371.5, "w"], [378.5, "e1_air"],
  [389.69, "w"], [393.3, "e1_mist"],
  [404.77, "e2_sponge"], [414.5, "h_spores"],
  [421.4, "e2_trash"],
  [438.87, "w"], [443.5, "e3_bleach"],
  [454.53, "w"],
  [471.3, "e3_back"], [476.4, "w"],
  [486.18, "e1_brush"], [492.0, "w"],
  [505.1, "e4_caulk"], [510.1, "h_ceiling"],
  [521.28, "e4_bubble"], [522.9, "w"], [529.3, "f_cut"],
  [535.94, "w"], [542.4, "e5_fan"],
  [553.09, "w"], [555.2, "e5_vent"], [560.0, "e5_vac"],
  [570.35, "w"],
  [583.56, "w"], [590.0, "f_spray"],
  [599.83, "f_wipe"], [605.4, "w"], [608.3, "f_soak"],
  [617.47, "f_foam"], [621.0, "f_brush"], [624.0, "f_dry"], [628.2, "w"],
  [633.86, "w"], [639.8, "f_tear"], [642.9, "f_soakstrip"],
  [651.8, "f_wrap"], [654.0, "w"], [657.1, "f_peel"],
  [668.35, "w"], [675.6, "w"],
  [686.85, "w"], [693.3, "w"],
  [704.66, "w"], [711.0, "w"],
  [721.3, "w"], [726.5, "w"],
  [740.06, "z_tape"], [744.9, "z_neighbor"],
  [756.03, "c_quote"], [757.8, "z_stick"], [763.0, "w"],
  [772.4, "w"],
  [790.35, "w"],
  [803.93, "k_soft"], [807.5, "k_flood"], [811.5, "k_duct"], [815.5, "w"],
  [823.63, "k_pro"], [829.5, "w"],
  [838.04, "w"],
  [851.58, "w"], [855.2, "w_tp"], [860.0, "w"],
  [867.41, "w"], [871.8, "w_towel"],
  [885.01, "w_curtain"], [890.4, "w"],
  [900.56, "s_lady"], [906.4, "w"], [911.7, "s_spots"],
  [918.47, "w"], [924.4, "s_chair"],
  [935.15, "w_fanfix"], [939.9, "w"],
  [952.93, "w"],
  [969.94, "w"], [974.0, "w"],
  [982.66, "w"],
  [1000.31, "w"],
  [1016.27, "w"], [1024.5, "z_close"],
];
type Seg = { a: number; b: number; k: string; i: number };
const SEGS: Seg[] = (() => {
  const av = WIN.filter((w) => w.ms >= REST_START - 0.01).map((w) => ({ a: w.ms, b: w.me, k: "av" }));
  const all: { a: number; b: number; k: string }[] = [...av];
  FILL.forEach(([a, k], i) => {
    const nf = i + 1 < FILL.length ? FILL[i + 1][0] : END;
    const na = av.find((w) => w.a > a + 0.01)?.a ?? END;
    const aa = av.find((w) => Math.abs(w.b - a) < 0.3)?.b ?? a; // pega al fin de la ventana
    all.push({ a: aa, b: Math.min(nf, na), k });
  });
  return all.sort((x, y) => x.a - y.a).map((s, i) => ({ ...s, i }));
})();
// transición en cada borde: [ta, tb] y tipo
type Tr = { ta: number; tb: number; kind: "swipe" | "portal" | "ww"; dir: number; vert: boolean };
const TR: Tr[] = SEGS.slice(1).map((s, j) => {
  const p = SEGS[j], B = s.a;
  if (s.k === "av") return { ta: B, tb: B + 0.3, kind: "swipe", dir: j % 2 ? 1 : -1, vert: false };
  if (p.k === "av") return { ta: B - 0.3, tb: B, kind: "swipe", dir: j % 2 ? -1 : 1, vert: false };
  if (p.k === "w" && s.k === "w") return { ta: B, tb: B + 0.42, kind: "ww", dir: 1, vert: false };
  if (s.k === "w") return { ta: B - 0.12, tb: B + 0.33, kind: "portal", dir: 1, vert: false };
  return { ta: B - 0.16, tb: B + 0.18, kind: "swipe", dir: j % 2 ? 1 : -1, vert: j % 3 === 0 };
});

const Layer: React.FC<{ s: Seg; t: number; freeze?: number }> = ({ s, t, freeze }) => {
  if (s.k === "av") return <Avatar t={t} />;
  if (s.k === "w") return <World t={freeze ?? t} />;
  const z: [number, number] = s.i % 2 ? [1.03, 1.13] : [1.13, 1.04];
  const ox = (s.i % 3 - 1) * 30, oy = (s.i % 2 ? -1 : 1) * 14;
  const lt = clip(s.k).startsWith("ltx_");
  return <Shot k={s.k} t={t} a={lt ? s.a - 0.35 : s.a} z={z} ox={ox} oy={oy} dur={s.b - s.a + 0.4} />;
};

const Base: React.FC<{ t: number }> = ({ t }) => {
  for (let j = 0; j < TR.length; j++) {
    const r = TR[j];
    if (t >= r.ta && t < r.tb) {
      const from = SEGS[j], to = SEGS[j + 1];
      if (r.kind === "swipe") return <Swipe t={t} a={r.ta} b={r.tb} dir={r.dir} vert={r.vert} mbFrom={from.k !== "av"} mbTo={to.k !== "av"} from={<Layer s={from} t={t} />} to={<Layer s={to} t={t} />} />;
      const k = ei(t, r.ta, r.tb), c = { x: 960, y: 560 };
      return (
        <AbsoluteFill>
          <Layer s={from} t={t} freeze={r.kind === "ww" ? to.a - 0.12 : undefined} />
          <Portal x={c.x} y={c.y} r={k}><Layer s={to} t={Math.max(t, to.a)} /></Portal>
          {r.kind === "ww" && <Flash t={t} at={r.ta + 0.05} peak={0.3} />}
        </AbsoluteFill>
      );
    }
  }
  const s = SEGS.find((x) => t >= x.a && t < x.b) ?? SEGS[SEGS.length - 1];
  return <Layer s={s} t={t} />;
};

// ---------- piezas sobre la imagen, cada una con SU palabra ----------
const vis = (t: number, ws: [number, number][]) => Math.max(0, ...ws.map(([a, b]) => e(t, a, a + 0.25) * (1 - e(t, b - 0.3, b))));
const avw = (from: number, n = 1): [number, number][] => WIN.filter((w) => w.ms >= from - 0.01).slice(0, n).map((w) => [w.ms, w.me]);
const sc = (t: number, p: [number, number, number]) => screenOf(t, p);

const Over: React.FC<{ t: number }> = ({ t }) => {
  const L: React.ReactNode[] = [];
  const on = (a: number, b: number) => t >= a - 0.05 && t < b + 0.6;
  // ================= MIN 2 · la mirada de 10 segundos · moho / hongo / mugre =================
  if (on(82.8, 86.6)) L.push(<BigNum key="l10" t={t} at={AT("First, the 10 second look")} text="THE 10-SECOND LOOK" size={92} x={1450} y={150} out={86.4} />);
  if (on(86.7, 95.8)) {
    L.push(<Tag key="fl" t={t} at={AT("Bring a flashlight")} x={980} y={560} dx={-320} dy={-240} text="🔦 FLASHLIGHT" col={COL.amber} out={92.3} size={50} />);
    L.push(<Tag key="lw" t={t} at={AT("hold it low sideways")} x={1100} y={640} dx={320} dy={160} text="LOW & SIDEWAYS" sub="THE LIGHT SKIMS THE WALL" col={COL.ice} out={95.6} size={50} />);
  }
  if (on(95.7, 99.7)) {
    L.push(<BigNum key="mf" t={t} at={AT("Mildew is flat")} text="MILDEW = FLAT" size={110} y={170} col="#d9d9d9" edge="#3a3a3a" out={99.5} />);
    L.push(<Tag key="ash" t={t} at={97.3} x={960} y={620} dx={300} dy={180} text="LIKE ASH ON TOP" col="#e8e8e8" out={99.5} size={48} />);
  }
  const C3 = [
    { at: AT("Mildew is flat"), head: "MILDEW", c: "#d9d9d9", rows: [{ at: AT("It's gray or white"), tx: "GRAY / WHITE" }, { at: AT("looks like powder"), tx: "POWDER" }, { at: AT("It lives on the surface"), tx: "ON TOP" }] },
    { at: AT("Mold Mold is different"), head: "MOLD", c: "#ff8a7a", rows: [{ at: AT("Mold is fuzzy or slimy"), tx: "FUZZY / SLIMY" }, { at: AT("black, dark green, or brown"), tx: "BLACK · GREEN" }, { at: AT("It grows into things"), tx: "GROWS INTO" }] },
    { at: AT("And dirt, honey"), head: "DIRT", c: "#c9b08a", rows: [{ at: AT("Soap film and dead skin"), tx: "SOAP + SKIN" }, { at: AT("gray and greasy"), tx: "GREASY" }, { at: AT("where your hands and feet"), tx: "WHERE YOU TOUCH" }] },
  ];
  const bv = vis(t, [...avw(99.6, 1), ...avw(117.4, 1), ...avw(132.5, 1), ...avw(151.7, 1)]);
  if (bv > 0.01) L.push(<Board3 key="b3" t={t} cols={C3} vis={bv} />);
  if (on(104.5, 111.8)) {
    const sl = sc(t, [-1.56, 1.33, 0.27]);
    L.push(<Tag key="ws" t={t} at={AT("It's on the windowsill")} x={sl.x} y={sl.y} dx={260} dy={-200} text="WINDOWSILL" col="#e8e8e8" out={111.5} size={50} />);
    L.push(<ChipsAt key="ws2" t={t} out={111.5} num={false} y={830} items={[{ at: AT("the shower curtain"), tx: "CURTAIN", c: "#e8e8e8" }, { at: AT("the top of the tile"), tx: "TILE TOP", c: "#e8e8e8" }, { at: AT("the edge of the tub"), tx: "TUB EDGE", c: "#e8e8e8" }]} />);
  }
  if (on(111.7, 117.5)) {
    L.push(<BigNum key="mo" t={t} at={AT("Mold is fuzzy or slimy")} text="MOLD = FUZZY" size={110} y={170} col="#ff8a7a" edge="#4a100d" out={117.3} />);
    L.push(<ChipsAt key="sw" t={t} out={117.3} num={false} y={840} items={[{ at: AT("black, dark green"), tx: "BLACK", c: "#9a9a9a" }, { at: AT("dark green, or brown"), tx: "DARK GREEN", c: "#6fbf5a" }, { at: AT("or brown") , tx: "BROWN", c: "#c9a27a" }]} />);
  }
  if (on(122.3, 125.7)) L.push(<Spread122 key="in" t={t} />);
  if (on(125.7, 132.6)) {
    L.push(<Mag key="m3" t={t} at={125.9} out={132.3} to={500} />);
    const rt = sc(t, PT.roots);
    L.push(<Tag key="ins" t={t} at={AT("inside the caulk instead of on it")} x={rt.x} y={rt.y} dx={300} dy={140} text="INSIDE IT · NOT ON IT" col="#9cff8a" out={132.3} size={50} />);
    L.push(<Stamp key="thm" t={t} at={AT("that's mold", 128)} text="THAT'S MOLD" x={560} y={240} out={132.3} rot={-8} size={84} />);
  }
  if (on(138.4, 145.1)) {
    const tb = sc(t, [0.5, 0.02, -1.0]);
    L.push(<Tag key="dt" t={t} at={138.6} x={tb.x} y={tb.y} dx={-300} dy={-220} text="FLOOR AROUND THE TOILET" sub="GRAY & GREASY = DIRT" col="#c9b08a" out={144.8} size={48} />);
  }
  if (on(145.0, 153.6)) {
    L.push(<BigNum key="drk" t={t} at={AT("in a dark bathroom")} text="DARK BATHROOM · END OF THE DAY" size={70} y={170} out={150.5} col="#cfe0ff" edge="#0a2a40" />);
    L.push(<BigNum key="smg" t={t} at={AT("all three of them look like")} text="SAME BLACK SMUDGE?" size={100} y={180} out={153.4} />);
    L.push(<ChipsAt key="q3" t={t} out={153.4} num={false} y={820} items={[{ at: AT("all three of them"), tx: "MOLD?", c: "#ff8a7a" }, { at: AT("all three of them") + 0.3, tx: "MILDEW?", c: "#d9d9d9" }, { at: AT("all three of them") + 0.6, tx: "DIRT?", c: "#c9b08a" }]} />);
  }
  if (on(151.7, 156.3)) L.push(<Stamp key="tst" t={t} at={AT("you test")} text="DON'T GUESS · TEST" x={460} y={760} out={156.1} rot={-7} size={74} col="#ffd60a" />);
  // ================= MIN 3 · el test =================
  if (on(156.3, 162.5)) L.push(<Kit key="kit" t={t} at={156.4} out={162.3} items={[{ at: AT("A cotton swab"), tx: "COTTON SWAB", ic: "🦯" }, { at: AT("a small cup"), tx: "SMALL CUP", ic: "🥛" }, { at: AT("gloves, and regular"), tx: "GLOVES", ic: "🧤" }, { at: AT("regular household bleach"), tx: "PLAIN BLEACH", ic: "🧴" }]} />);
  if (on(162.4, 168.1)) L.push(<Bottles key="bt" t={t} out={167.9} y={700} items={[{ at: AT("Plain bleach, not"), tx: "PLAIN", ok: true }, { at: AT("not the splashless"), tx: "SPLASHLESS", ok: false }, { at: AT("the fresh scent"), tx: "FRESH SCENT", ok: false }]} />);
  if (on(168.0, 172.9)) L.push(<ChipsAt key="gl" t={t} out={172.7} num={false} x-y={0} y={800} items={[{ at: AT("Gloves on."), tx: "🧤 GLOVES ON", c: "#ffd60a" }, { at: AT("Open the window"), tx: "🪟 WINDOW OPEN", c: COL.ice }, { at: AT("turn on the fan"), tx: "🌀 FAN ON", c: COL.ice }]} />);
  if (on(172.8, 181.3)) {
    L.push(<Ratio key="rt" t={t} at={172.95} water={AT("Put one cup of water")} tbsp={AT("then one tablespoon of bleach")} ratio={AT("one part bleach to 16")} out={181.1} />);
    L.push(<Stamp key="wf" t={t} at={AT("Water first")} text="WATER FIRST" x={420} y={250} out={177.2} rot={-8} size={80} col={COL.ice} />);
  }
  if (on(181.2, 185.8)) L.push(<BigNum key="wk" t={t} at={AT("Weak.")} text="WEAK ON PURPOSE" sub="WE'RE ASKING IT A QUESTION" size={84} x={460} y={200} out={185.6} col="#ffd60a" edge="#5a4500" />);
  if (on(185.7, 191.8)) {
    L.push(<ChipsAt key="dab" t={t} out={191.6} num={false} y={840} items={[{ at: AT("Dip the swab"), tx: "DIP", c: COL.ice }, { at: AT("Dab it right on"), tx: "DAB", c: "#ffd60a" }, { at: AT("Two or three little dabs"), tx: "× 2-3", c: "#ffd60a" }]} />);
    L.push(<Stamp key="nr" t={t} at={AT("Don't rub")} text="DON'T RUB" x={1450} y={260} out={191.6} rot={8} size={96} />);
  }
  if (on(191.7, 195.1)) L.push(<Ring key="r10" t={t} at={AT("That's the 10 seconds")} dur={1.2} out={194.9} label="10 s" sub="THAT'S THE TEST" x={1560} y={320} />);
  if (on(195.0, 198.5)) {
    L.push(<Ring key="r2" t={t} at={AT("One to two minutes")} dur={3.3} out={198.3} label="1-2'" sub="DON'T TOUCH IT" x={1560} y={330} col={COL.ice} r={130} />);
    L.push(<Tag key="fold" t={t} at={AT("Go fold a towel")} x={760} y={560} dx={-260} dy={200} text="GO FOLD A TOWEL" col="#ffd08a" out={198.3} size={46} />);
  }
  const VR = [
    { at: AT("If the spot got lighter"), a: "GOT LIGHTER", b: "ALIVE", c: "#1c9b4a" },
    { at: AT("If it stayed exactly"), a: "STAYED SAME", b: "DIRT", c: "#8a6f4e" },
    { at: AT("but it came back dark"), a: "BACK IN 1-2 DAYS", b: "ROOTS", c: "#b3261e" },
  ];
  const vv = vis(t, [...avw(198.3, 1), [208.6, 214.69], ...avw(214.6, 1)]);
  if (vv > 0.01) L.push(<Verdict key="vd" t={t} vis={vv} rows={VR} />);
  if (on(202.5, 206.1)) {
    const d = sc(t, PT.dab);
    L.push(<Tag key="lit" t={t} at={202.9} x={d.x} y={d.y} dx={-300} dy={-200} text="IT GOT LIGHTER" sub="IT'S ALIVE" col="#9fffb0" out={205.9} size={54} />);
  }
  if (on(206.0, 208.6)) L.push(<BigNum key="mm" t={t} at={AT("It's mold or mildew")} text="MOLD OR MILDEW" size={96} y={170} col="#9fffb0" edge="#123d1a" out={208.4} />);
  if (on(208.6, 214.7)) L.push(<Stamp key="dc" t={t} at={AT("Soap, scum, and grime")} text="DOESN'T CARE ABOUT BLEACH" x={1240} y={880} out={214.5} rot={-5} size={58} col="#c9b08a" />);
  if (on(220.5, 228.9)) {
    L.push(<Mag key="m4" t={t} at={220.7} out={228.6} to={600} />);
    const rt = sc(t, PT.roots);
    L.push(<Tag key="no" t={t} at={AT("That's not on the caulk")} x={rt.x} y={rt.y} dx={-320} dy={-180} text="NOT ON THE CAULK…" col="#ffd08a" out={228.6} size={50} />);
    L.push(<BigNum key="in2" t={t} at={AT("That's in it")} text="IN IT" size={170} x={1450} y={760} col="#9cff8a" edge="#123d1a" out={228.6} />);
  }
  if (on(228.8, 233.8)) {
    L.push(<BigNum key="sk" t={t} at={AT("Now the step people skip")} text="THE STEP PEOPLE SKIP" size={80} y={150} out={233.6} />);
    L.push(<ChipsAt key="rn" t={t} out={233.6} num={false} y={830} items={[{ at: AT("rinse that spot with plain water"), tx: "RINSE", c: COL.ice }, { at: AT("wait until tomorrow"), tx: "WAIT TILL TOMORROW", c: "#ffd60a" }]} />);
  }
  // ================= MIN 4 · nunca mezclar · los 5 lugares =================
  if (on(238.8, 245.3)) L.push(<NoMix key="nm" t={t} at={238.9} out={245.0} rows={[{ at: AT("Not in the bottle"), tx: "NOT IN THE BOTTLE" }, { at: AT("not in the cup"), tx: "NOT IN THE CUP" }, { at: AT("and not on the wall"), tx: "NOT ON THE WALL" }]} />);
  if (on(245.2, 249.9)) L.push(<BigNum key="ob" t={t} at={AT("the only place in my whole book")} text="THE ONLY BLEACH" sub="IN THE WHOLE BOOK" size={100} x={1380} y={200} out={249.7} col="#ffd08a" edge="#5a3a10" />);
  const PL: { at: number; p: [number, number, number]; tx: string; dx?: number }[] = [
    { at: AT("One, the bottom row"), p: [-1.45, 0.62, -1.47], tx: "BOTTOM ROW & CORNERS" },
    { at: AT("Two, under the rim"), p: [-1.45, 0.75, -1.44], tx: "SPOUT & DRAIN" },
    { at: AT("The window.", 283), p: [-1.59, 1.42, 0.25], tx: "WINDOW TRACK", dx: -1 },
    { at: AT("Behind the toilet"), p: [0.5, 0.42, -1.45], tx: "BEHIND THE TOILET" },
    { at: AT("The fan cover on the ceiling"), p: PT.vent, tx: "FAN COVER", dx: -1 },
  ];
  if (on(255.7, 261.9)) {
    L.push(<BigNum key="5p" t={t} at={AT("Here are the five places")} text="5 PLACES IT HIDES" size={90} x={1250} y={150} out={261.6} />);
    const pv: [number, number, number][] = [[-1.45, 0.62, -1.47], [-1.36, 0.15, -1.14], [-1.59, 1.42, 0.25], [0.5, 0.42, -1.45], PT.vent];
    pv.forEach((p, i) => { const q = sc(t, p); L.push(<Pin key={"pp" + i} t={t} at={AT("Here are the five places") + 0.9 + i * 0.45} out={261.6} x={q.x} y={q.y} n={i + 1} tx="" />); });
  }
  if (on(255.7, 320.1)) L.push(<Meter key="mt5" t={t} at={256.0} out={319.8} title="PLACES" marks={PL.map((p) => p.at)} />);
  PL.forEach((p, i) => {
    const ws: [number, number][] = [[261.8, 265.2], [271.0, 275.1], [282.9, 284.5], [294.6, 298.0], [312.0, 316.3]];
    const [a, b] = ws[i];
    if (on(a, b)) { const q = sc(t, p.p); L.push(<Pin key={"pl" + i} t={t} at={Math.max(a + 0.15, p.at)} out={b - 0.2} x={q.x} y={q.y} n={i + 1} tx={p.tx} dx={p.dx ?? 1} />); }
  });
  if (on(265.1, 271.1)) L.push(<BigNum key="910" t={t} at={AT("nine times out of ten")} text="9 OUT OF 10" sub="IT STARTS HERE" size={120} x={1420} y={220} out={270.9} col="#ffd60a" edge="#5a4500" />);
  if (on(275.1, 282.9)) {
    L.push(<Tag key="stp" t={t} at={AT("Pull the stopper out")} x={960} y={600} dx={-300} dy={-240} text="PULL THE STOPPER" col={COL.ice} out={282.7} size={48} />);
    L.push(<Stamp key="bath" t={t} at={AT("rinsing into your bath water")} text="IN YOUR BATH WATER" x={1300} y={860} out={282.7} rot={-6} size={64} />);
  }
  if (on(289.0, 294.6)) L.push(<ChipsAt key="stm" t={t} out={294.4} num={false} y={830} items={[{ at: AT("Steam hits that cold glass"), tx: "STEAM", c: COL.ice }, { at: AT("runs down", 289), tx: "RUNS DOWN", c: COL.ice }, { at: AT("sits in the track all day"), tx: "SITS ALL DAY", c: "#ff8a7a" }]} />);
  if (on(298.0, 301.3)) L.push(<BigNum key="nb" t={t} at={AT("Nobody looks back there")} text="NOBODY LOOKS" size={100} x={1400} y={200} out={301.1} />);
  if (on(306.1, 312.1)) L.push(<Stamp key="nd" t={t} at={AT("that's not dust, honey")} text="NOT DUST" x={1420} y={760} out={311.9} rot={-8} size={96} />);
  if (on(312.0, 316.4)) L.push(<BigNum key="np" t={t} at={AT("the fan isn't pulling")} text="THE FAN ISN'T PULLING" size={86} y={170} col="#ff8a7a" edge="#4a100d" out={316.2} />);
  if (on(320.0, 332.7)) L.push(<ChipsAt key="any" t={t} out={332.4} num={false} y={830} items={[{ at: AT("The rubber seal on the front load"), tx: "WASHER SEAL", c: COL.ice }, { at: AT("refrigerator door gasket"), tx: "FRIDGE GASKET", c: COL.ice }, { at: AT("the window sills in the bedroom"), tx: "BEDROOM SILLS", c: COL.ice }, { at: AT("the back corner of a closet"), tx: "CLOSET WALL", c: COL.ice }]} />);
  if (on(326.0, 332.7)) L.push(<BigNum key="dd" t={t} at={AT("Anywhere it's dark and it stays damp")} text="DARK + DAMP" size={130} y={200} col="#9fd0ff" edge="#0a2a40" out={332.4} />);
  if (on(332.6, 338.0)) L.push(<ChipsAt key="wr" t={t} out={337.8} num={false} y={830} items={[{ at: AT("Write down what you found"), tx: "📝 WHAT", c: "#ffd08a" }, { at: AT("and where"), tx: "📍 WHERE", c: "#ffd08a" }, { at: AT("where the water is"), tx: "💧 = THE WATER", c: COL.ice }]} />);
  if (on(337.9, 343.9)) L.push(<BigNum key="nk" t={t} at={AT("So now you know what you've got")} text="NOW YOU KNOW" size={110} y={170} out={343.6} />);
  // ================= MIN 5-9 · los 5 errores =================
  const MK = [AT("Mistake number one"), AT("Mistake number two"), AT("Mistake number three"), AT("Mistake number four"), AT("Mistake number five")];
  if (on(343.8, 350.0)) {
    L.push(<BigNum key="5m" t={t} at={AT("this is where most people go wrong")} text="5 MISTAKES" sub="THAT SPREAD IT" size={170} y={480} col="#ff8a7a" edge="#4a100d" out={349.5} />);
  }
  if (on(349.6, 580.0)) L.push(<Meter key="mtm" t={t} at={349.8} out={579.6} title="MISTAKES" marks={MK} col="#ff4a3d" x={1320} />);
  const MT = ["SCRUBBING IT DRY", "THE ONE RAG", "BLEACH ON CAULK & GROUT", "COVERING IT UP", "BLOWING IT AROUND"];
  MK.forEach((m, i) => { if (on(m, m + 4.2)) L.push(<Mistake key={"mk" + i} t={t} at={m} out={m + 4.0} n={i + 1} tx={MT[i]} />); });
  if (on(355.5, 367.8)) {
    L.push(<Mag key="m5" t={t} at={355.7} out={367.5} to={800} />);
    const rt = sc(t, PT.roots), co = sc(t, PT.colony), sp = sc(t, PT.spore);
    L.push(<BigNum key="fo" t={t} at={AT("It's a little forest")} text="A LITTLE FOREST" size={100} x={1300} y={170} col="#9cff8a" edge="#123d1a" out={363.2} />);
    L.push(<Tag key="th" t={t} at={AT("Thin threads running down")} x={rt.x} y={rt.y} dx={300} dy={150} text="THREADS" sub="DOWN INTO THE SILICONE" col="#9cff8a" out={367.5} size={46} />);
    L.push(<Tag key="sk2" t={t} at={AT("tiny stalks holding up")} x={co.x} y={co.y} dx={-280} dy={-160} text="STALKS" col={COL.ink} out={367.5} size={46} />);
    L.push(<Tag key="bl" t={t} at={AT("little balls")} x={sp.x} y={sp.y + 120} dx={260} dy={-120} text="SPORE BALLS" col={COL.amber} out={367.5} size={46} />);
  }
  if (on(367.7, 371.6)) L.push(<BigNum key="ld" t={t} at={AT("Each one is lighter than dust")} text="LIGHTER THAN DUST" size={80} x={1420} y={180} out={371.4} />);
  if (on(371.5, 378.6)) {
    L.push(<Mag key="m6" t={t} at={371.6} out={378.3} to={800} />);
    L.push(<Stamp key="snap" t={t} at={AT("every bristle snaps")} text="SNAP" x={1400} y={300} out={377.0} rot={-10} size={120} />);
    L.push(<BigNum key="up" t={t} at={AT("the spores go up into the air")} text="UP INTO THE AIR" size={86} y={900} col={COL.amber} edge="#5a3500" out={378.3} />);
  }
  if (on(378.5, 384.5)) L.push(<Tag key="hr" t={t} at={AT("They float around the bathroom for hours")} x={1000} y={420} dx={300} dy={-180} text="FLOATS FOR HOURS" col={COL.amber} out={384.3} size={50} />);
  if (on(384.4, 389.7)) L.push(<ChipsAt key="lnd" t={t} out={389.5} num={false} y={830} items={[{ at: AT("The ceiling over the shower"), tx: "CEILING", c: "#ff8a7a" }, { at: AT("the back of the toilet"), tx: "BACK OF TOILET", c: "#ff8a7a" }, { at: AT("the grout on the other wall"), tx: "OTHER WALL", c: "#ff8a7a" }]} />);
  if (on(389.6, 393.4)) L.push(<BigNum key="wb" t={t} at={AT("turns into a whole bathroom")} text="ONE SPOT → WHOLE BATHROOM" size={74} y={150} out={393.2} />);
  if (on(393.3, 400.5)) {
    L.push(<Stamp key="wet" t={t} at={AT("So you always wet it first")} text="WET IT FIRST" x={1420} y={260} out={400.3} rot={-7} size={96} col="#1c9b4a" />);
    L.push(<Tag key="stay" t={t} at={AT("Wet spores stay put")} x={900} y={640} dx={-280} dy={180} text="WET SPORES STAY PUT" col="#9fffb0" out={400.3} size={48} />);
  }
  if (on(400.5, 404.8)) L.push(<BigNum key="cloth" t={t} at={AT("they come off with the cloth")} text="OFF WITH THE CLOTH" size={74} x={1430} y={200} out={404.6} col="#9fffb0" edge="#123d1a" />);
  if (on(404.7, 416.7)) L.push(<Route key="rte" t={t} out={416.4} nodes={[{ at: AT("clean the shower corner"), tx: "SHOWER", ic: "🚿" }, { at: AT("wipe the sink"), tx: "SINK", ic: "🚰" }, { at: AT("and then the windowsill"), tx: "WINDOWSILL", ic: "🪟" }]} />);
  if (on(414.5, 416.7)) L.push(<Stamp key="pln" t={t} at={AT("you're planting")} text="YOU'RE PLANTING" x={960} y={760} out={416.4} rot={-6} size={96} />);
  if (on(416.6, 421.5)) L.push(<BigNum key="bus" t={t} at={AT("like passengers on a bus")} text="🚌 A FREE RIDE" size={90} x={1430} y={200} out={421.3} />);
  if (on(421.4, 433.9)) L.push(<Rules key="rg" t={t} out={433.7} rows={[{ at: AT("Use paper towels on mold"), tx: "PAPER TOWELS", ok: true }, { at: AT("an old rag you throw in the hot wash"), tx: "OLD RAG → HOT WASH, ALONE", ok: true }, { at: AT("It goes in the trash"), tx: "THE SPONGE → TRASH", ok: false }]} />);
  if (on(433.9, 438.9)) L.push(<BigNum key="hs" t={t} at={AT("A sponge is a wet, warm, dark")} text="WET · WARM · DARK" sub="MOLD'S FAVORITE HOUSE" size={90} x={470} y={220} out={438.7} />);
  if (on(438.8, 443.6)) {
    const d = sc(t, PT.dab);
    L.push(<Tag key="1d" t={t} at={AT("the test is one drop")} x={d.x} y={d.y} dx={-300} dy={-200} text="THE TEST = 1 DROP" sub="TO READ THE COLOR" col="#9fffb0" out={443.3} size={50} />);
  }
  if (on(443.5, 448.8)) L.push(<Stamp key="ce" t={t} at={AT("Cleaning with it is something else")} text="CLEANING WITH IT ✗" x={1350} y={820} out={448.6} rot={-6} size={70} />);
  if (on(448.7, 454.6)) L.push(<BigNum key="col" t={t} at={AT("taking the color out")} text="TAKES THE COLOR OUT" size={74} x={1400} y={190} out={454.4} col="#ffd60a" edge="#5a4500" />);
  if (on(454.5, 467.3)) {
    L.push(<Mag key="m7" t={t} at={454.7} out={467.0} to={600} />);
    L.push(<ChipsAt key="gw" t={t} out={459.3} num={false} y={850} items={[{ at: AT("the black turns gray"), tx: "BLACK", c: "#9a9a9a" }, { at: AT("then white"), tx: "→ WHITE", c: "#ffffff" }, { at: AT("you think it's gone"), tx: "GONE?", c: "#ffd60a" }]} />);
    L.push(<Depth key="dp" t={t} at={AT("But silicone and grout are porous")} deep={AT("The threads down inside")} out={467.0} />);
    L.push(<BigNum key="por" t={t} at={AT("are porous")} text="POROUS" size={110} x={560} y={180} out={462.0} col={COL.ice} edge="#0a2a40" />);
  }
  if (on(467.2, 471.3)) L.push(<BigNum key="wk2" t={t} at={AT("it looks perfect for a week")} text="PERFECT… FOR A WEEK" size={74} x={1420} y={190} out={471.1} />);
  if (on(471.3, 476.5)) L.push(<Stamp key="ss" t={t} at={AT("in the very same spot", 471)} text="SAME LINE · SAME SPOT" x={960} y={180} out={476.2} rot={-4} size={76} />);
  if (on(476.4, 482.2)) L.push(<BigNum key="rp" t={t} at={AT("I call that repainting it")} text="REPAINTING IT" sub="NOT CLEANING IT" size={110} y={180} out={482.0} col="#ff8a7a" edge="#4a100d" />);
  if (on(482.1, 499.4)) L.push(<Cycle key="cy" t={t} at={482.3} out={499.2} nodes={[{ at: AT("Every time it comes back"), tx: "COMES BACK" }, { at: AT("people spray more bleach"), tx: "MORE BLEACH" }, { at: AT("they scrub harder"), tx: "SCRUB HARDER" }, { at: AT("throws more spores"), tx: "MORE SPORES" }]} />);
  if (on(492.0, 499.4)) L.push(<ChipsAt key="cw" t={t} out={499.2} num={false} y={860} items={[{ at: AT("the corner never gets better"), tx: "CORNER: NEVER BETTER", c: "#ffd60a" }, { at: AT("slowly gets worse"), tx: "BATHROOM: WORSE", c: "#ff8a7a" }]} />);
  if (on(499.3, 505.2)) L.push(<ChipsAt key="cv" t={t} out={505.0} num={false} y={830} items={[{ at: AT("painting over a mold spot"), tx: "🖌️ PAINT", c: "#ff8a7a" }, { at: AT("running a new bead of caulk"), tx: "🧴 NEW CAULK", c: "#ff8a7a" }, { at: Math.min(503.8, AT("hanging a towel over it")), tx: "🧺 A TOWEL", c: "#ff8a7a" }]} />);
  if (on(505.1, 510.2)) L.push(<Tag key="ncb" t={t} at={505.4} x={980} y={640} dx={300} dy={-220} text="CAULK ON TOP OF MOLD" col="#ff8a7a" out={510.0} size={48} />);
  if (on(510.1, 516.3)) L.push(<PaintOver key="po" t={t} at={AT("I have seen every one")} back={AT("Mold under paint keeps growing")} out={516.1} />);
  if (on(516.2, 521.3)) L.push(<ChipsAt key="dw" t={t} out={521.1} num={false} y={830} items={[{ at: AT("It eats the paper on the drywall"), tx: "EATS THE DRYWALL PAPER", c: "#ff8a7a" }, { at: AT("the paint bubbles"), tx: "PAINT BUBBLES", c: "#ff8a7a" }]} />);
  if (on(522.9, 529.4)) {
    L.push(<Mag key="m8" t={t} at={523.0} out={529.0} to={400} />);
    L.push(<Tag key="sl" t={t} at={AT("just seals the forest in")} x={960} y={420} dx={320} dy={-160} text="SEALED IN" sub="WITH ITS WATER" col={COL.ice} out={529.0} size={52} />);
    L.push(<Stamp key="gh" t={t} at={AT("perfect little greenhouse")} text="A GREENHOUSE" x={560} y={820} out={529.0} rot={-6} size={84} col="#9cff8a" />);
  }
  if (on(529.3, 536.0)) L.push(<Rules key="cr" t={t} out={535.8} x={1200} y={230} w={600} rows={[{ at: AT("it comes out all the way"), tx: "OUT ALL THE WAY", ok: true }, { at: AT("cleaned and dried a full day"), tx: "CLEAN + DRY 1 DAY", ok: true }, { at: AT("and then new caulk"), tx: "THEN NEW CAULK", ok: true }]} />);
  if (on(535.9, 542.5)) L.push(<BigNum key="tf" t={t} at={AT("before you try the fix")} text="TRY THE FIX FIRST" sub="IT SAVES YOU THE JOB" size={90} y={170} col="#9fffb0" edge="#123d1a" out={542.3} />);
  if (on(546.0, 553.1)) L.push(<Stamp key="can" t={t} at={AT("That fan is a spore cannon")} text="SPORE CANNON" x={1400} y={260} out={552.9} rot={-8} size={96} />);
  if (on(553.0, 560.1)) L.push(<ChipsAt key="out" t={t} out={559.9} num={false} y={840} items={[{ at: AT("Use the bathroom exhaust fan"), tx: "🌀 EXHAUST FAN", c: "#9fffb0" }, { at: AT("or open a window"), tx: "🪟 WINDOW", c: "#9fffb0" }, { at: AT("out, not around"), tx: "OUT ↗ NOT AROUND", c: "#ffd60a" }]} />);
  if (on(560.0, 564.7)) L.push(<Stamp key="nv" t={t} at={AT("don't vacuum it")} text="NO VACUUM" x={1420} y={250} out={564.5} rot={-8} size={100} />);
  if (on(564.6, 570.4)) L.push(<BigNum key="bo" t={t} at={AT("blow the fine stuff right out the back")} text="OUT THE BACK" sub="WIPE IT DAMP INSTEAD" size={100} x={480} y={220} out={570.2} />);
  if (on(570.3, 583.6)) L.push(<Rules key="r5" t={t} out={583.3} x={70} y={150} w={700} rows={[{ at: AT("dry scrubbing"), tx: "DRY SCRUBBING", ok: false }, { at: AT("the one rag", 572), tx: "THE ONE RAG", ok: false }, { at: AT("bleach on porous stuff"), tx: "BLEACH ON POROUS", ok: false }, { at: AT("covering it up", 572), tx: "COVERING IT UP", ok: false }, { at: AT("and blowing it around"), tx: "BLOWING IT AROUND", ok: false }]} />);
  if (on(579.8, 583.6)) L.push(<BigNum key="sb" t={t} at={AT("Every one of them takes a small spot")} text="SMALL → BIG" size={120} x={1400} y={200} out={583.4} col="#ff8a7a" edge="#4a100d" />);
  // ================= MIN 10-11 · cómo limpiarlo según el test =================
  if (on(583.5, 675.7)) L.push(<Tabs key="tb" t={t} at={583.7} out={675.4} tabs={[{ at: AT("If it was mildew"), tx: "MILDEW" }, { at: AT("If it was mold on tile"), tx: "MOLD ON TILE" }, { at: AT("if it was mold in the caulk"), tx: "MOLD IN CAULK" }]} />);
  if (on(587.6, 596.1)) {
    const b = sc(t, [2.02, 1.0, 0.24]);
    L.push(<Tag key="hp" t={t} at={AT("3% hydrogen peroxide")} x={b.x} y={b.y} dx={-320} dy={-160} text="3% HYDROGEN PEROXIDE" sub="THE BROWN BOTTLE" col="#ffd08a" out={589.8} size={48} />);
    L.push(<Stamp key="fs" t={t} at={AT("full strength, straight from the bottle")} text="FULL STRENGTH" x={1400} y={820} out={595.9} rot={-6} size={80} col="#ffd60a" />);
  }
  if (on(596.0, 605.5)) L.push(<Ring key="r10m" t={t} at={AT("Wait 10 minutes")} dur={3.6} out={605.2} label="10'" sub="WATCH IT FIZZ" x={1600} y={360} col="#ffd60a" r={120} />);
  if (on(605.4, 608.4)) L.push(<BigNum key="ot" t={t} at={AT("Mildew sits on top")} text="ON TOP → OFF ON TOP" size={80} y={900} out={608.2} />);
  if (on(608.3, 617.5)) L.push(<ChipsAt key="sk3" t={t} out={617.3} num={false} y={850} items={[{ at: AT("same bottle, full strength"), tx: "FULL STRENGTH", c: "#ffd60a" }, { at: AT("until it's soaking wet"), tx: "SOAKING WET", c: COL.ice }, { at: AT("until it's running a little"), tx: "RUNNING A LITTLE", c: COL.ice }]} />);
  if (on(617.4, 628.3)) L.push(<Steps key="st1" t={t} at={617.5} out={628.0} steps={[{ at: AT("10 minutes, no touching"), tx: "10 MIN · NO TOUCHING" }, { at: AT("Then a soft brush"), tx: "SOFT BRUSH · CIRCLES" }, { at: AT("Rinse and dry it with a towel"), tx: "RINSE + DRY" }]} />);
  if (on(628.2, 633.9)) {
    const c = sc(t, PT.corner);
    L.push(<Tag key="ro" t={t} at={AT("the spray just runs right off")} x={c.x} y={c.y} dx={-300} dy={-220} text="SPRAY RUNS RIGHT OFF" col="#ff8a7a" out={629.75} size={50} />);
    L.push(<BigNum key="trk" t={t} at={AT("Here's the trick")} text="HERE'S THE TRICK" size={90} x={1400} y={200} out={633.7} col="#ffd60a" edge="#5a4500" />);
  }
  if (on(633.8, 639.9)) L.push(<BigNum key="an" t={t} at={AT("you keep it wet all night")} text="🌙 WET ALL NIGHT" size={110} y={180} out={639.6} col="#cfe0ff" edge="#0a2a40" />);
  if (on(639.7, 662.5)) L.push(<Steps key="st2" t={t} at={639.85} out={662.2} x={1250} y={180} steps={[{ at: AT("Tear paper towels into strips"), tx: "TEAR 2\" STRIPS" }, { at: AT("Soak them in peroxide"), tx: "SOAK TILL THEY DRIP" }, { at: AT("Press the strips along"), tx: "PRESS ON THE CAULK" }, { at: AT("cover them with plastic wrap"), tx: "PLASTIC WRAP" }, { at: AT("and go to bed"), tx: "GO TO BED" }]} />);
  if (on(642.9, 645.7)) L.push(<BigNum key="1c" t={t} at={AT("About one cup for a whole tub")} text="1 CUP = WHOLE TUB" size={74} x={600} y={180} out={645.5} />);
  if (on(651.7, 657.2)) L.push(<Clock key="ck" t={t} at={AT("At least eight hours")} out={657.0} x={460} y={360} />);
  if (on(657.1, 662.5)) L.push(<ChipsAt key="mn" t={t} out={662.2} num={false} y={860} items={[{ at: AT("peel them off"), tx: "PEEL", c: "#ffd60a" }, { at: AT("scrub lightly with an old toothbrush"), tx: "LIGHT SCRUB", c: "#ffd60a" }, { at: AT("and rinse", 659), tx: "RINSE", c: COL.ice }]} />);
  if (on(662.4, 668.4)) L.push(<BigNum key="lk" t={t} at={AT("Look at that line")} text="LOOK AT THAT LINE!" size={84} x={1400} y={190} out={668.2} col="#9fffb0" edge="#123d1a" />);
  if (on(668.3, 675.7)) {
    L.push(<Mag key="m9" t={t} at={668.5} out={675.3} to={600} top={150} />);
    L.push(<Tag key="lf" t={t} at={AT("lifting those threads out")} x={960} y={600} dx={320} dy={160} text="LIFTS THE THREADS OUT" sub="FROM INSIDE" col="#ffffff" out={675.3} size={48} />);
  }
  if (on(675.6, 682.2)) {
    L.push(<BigNum key="wp" t={t} at={AT("Why peroxide and not something stronger")} text="WHY PEROXIDE?" size={110} y={170} out={682.0} col="#ffd08a" edge="#5a3a10" />);
    L.push(<Tag key="tw" t={t} at={AT("Because it's thin, like water")} x={sc(t, PT.corner).x} y={sc(t, PT.corner).y} dx={300} dy={200} text="THIN LIKE WATER" sub="GOES WHERE THE WATER WENT" col={COL.ice} out={682.0} size={48} />);
  }
  if (on(682.1, 693.4)) L.push(<Chem key="ch" t={t} at={AT("When it touches the mold")} o2={AT("that fizz is oxygen")} water={AT("what's left is water")} out={693.1} />);
  if (on(693.3, 699.3)) L.push(<Rules key="sf" t={t} out={699.1} x={1180} y={240} w={640} rows={[{ at: AT("No fumes that knock you over"), tx: "NO FUMES", ok: true }, { at: AT("Nothing to rinse off your grandkids"), tx: "SAFE FOR BATH TOYS", ok: true }]} />);
  if (on(699.2, 711.1)) L.push(<BottleLight key="bl2" t={t} at={AT("Keep it in the brown bottle")} out={710.8} />);
  if (on(704.6, 711.1)) L.push(<Tag key="nz" t={t} at={AT("Screw a spray nozzle")} x={sc(t, [2.0, 1.12, 0.24]).x} y={sc(t, [2.0, 1.12, 0.24]).y} dx={-320} dy={-150} text="SCREW THE NOZZLE ON" sub="STRONG FOR MONTHS" col="#ffd08a" out={710.8} size={46} />);
  if (on(711.0, 715.3)) {
    L.push(<BigNum key="2n" t={t} at={AT("after two nights")} text="AFTER 2 NIGHTS…" size={80} x={1400} y={170} out={715.1} />);
    L.push(<Tag key="un" t={t} at={AT("underneath the silicone")} x={sc(t, PT.roots).x} y={sc(t, PT.roots).y} dx={-300} dy={160} text="UNDER THE SILICONE" col="#ff8a7a" out={715.1} size={48} />);
  }
  if (on(715.2, 726.6)) L.push(<ChipsAt key="rc" t={t} out={726.3} num={false} y={850} items={[{ at: AT("That's when the caulk comes out"), tx: "CAULK OUT", c: "#ff8a7a" }, { at: AT("Clean the joint with peroxide"), tx: "CLEAN THE JOINT", c: "#ffd60a" }, { at: AT("Let it dry a full day"), tx: "DRY 1 DAY", c: COL.ice }, { at: AT("and re-caulk"), tx: "RE-CAULK", c: "#9fffb0" }]} />);
  // ================= MIN 12 · el tamaño · la vecina · la pág. 20 =================
  if (on(726.5, 734.7)) L.push(<BigNum key="tb2" t={t} at={AT("when is it too big for me")} text="TOO BIG FOR ME?" size={100} y={160} out={730.0} />);
  if (on(730.2, 750.7)) L.push(<SqPlate key="sq" t={t} at={AT("about 10 square feet")} plate={AT("about the size of a dinner plate")} out={750.4} />);
  if (on(734.6, 745.0)) L.push(<ChipsAt key="ho" t={t} out={744.8} num={false} y={830} items={[{ at: AT("on a hard surface", 734), tx: "HARD SURFACE", c: "#9fffb0" }, { at: AT("with the window open"), tx: "WINDOW OPEN", c: "#9fffb0" }, { at: AT("and gloves on"), tx: "GLOVES ON", c: "#9fffb0" }]} />);
  if (on(750.6, 757.9)) L.push(<BigNum key="3k" t={t} at={AT("quoted her $3,000")} text="$3,000" sub="FOR A DINNER PLATE" size={150} x={470} y={260} col="#ff8a7a" edge="#4a100d" out={757.6} />);
  if (on(757.8, 763.1)) L.push(<ChipsAt key="fx" t={t} out={762.9} num={false} y={850} items={[{ at: AT("Peroxide, 10 minutes"), tx: "PEROXIDE · 10 MIN", c: "#ffd08a" }, { at: AT("a sponge on a stick"), tx: "SPONGE ON A STICK", c: "#ffd08a" }, { at: AT("a fan that actually worked"), tx: "A FAN THAT WORKS", c: "#9fffb0" }]} />);
  if (on(763.0, 767.7)) {
    L.push(<Stamp key="nb2" t={t} at={AT("It never came back")} text="NEVER CAME BACK" x={960} y={200} out={764.5} rot={-6} size={84} col="#1c9b4a" />);
    L.push(<BigNum key="p20" t={t} at={AT("page 20 of my book")} text="PAGE 20" size={120} x={1560} y={150} out={767.5} col="#ffd60a" edge="#5a4500" />);
  }
  if (on(767.6, 772.5)) L.push(<VideoCall key="vc2" t={t} at={767.65} out={772.2} x={70} y={250} w={720} />);
  if (on(772.4, 785.4)) {
    const a = sc(t, pagePt(0.27, 0.495)), m = sc(t, pagePt(0.38, 0.523)), f = sc(t, pagePt(0.4, 0.785)), s2 = sc(t, pagePt(0.3, 0.69));
    L.push(<Tag key="fs2" t={t} at={772.6} x={a.x} y={a.y} dx={-300} dy={-160} text="FULL STRENGTH" col="#ff9f43" out={777.6} size={40} />);
    L.push(<Tag key="10m" t={t} at={772.9} x={m.x} y={m.y} dx={300} dy={-120} text="10 MINUTES" col="#ff9f43" out={777.6} size={40} />);
    L.push(<Tag key="drp" t={t} at={AT("without dripping it in your eyes")} x={s2.x} y={s2.y} dx={300} dy={60} text="NO DRIPS IN YOUR EYES" col="#9fd0ff" out={777.6} size={40} />);
    L.push(<Tag key="fr" t={t} at={AT("the fan rule")} x={f.x} y={f.y} dx={-300} dy={140} text="THE FAN RULE" col="#9fffb0" out={777.6} size={40} />);
    L.push(<Scale key="scl" t={t} at={AT("The book is $27")} heavy={AT("one phone call to a mold company")} out={785.1} />);
    L.push(<BigNum key="100x" t={t} at={AT("a hundred times over")} text="PAID FOR ITSELF 100×" size={70} y={150} out={785.1} col="#9fffb0" edge="#123d1a" />);
  }
  if (on(785.3, 790.4)) L.push(<Desc key="d2" t={t} at={AT("The link is in the first line", 785)} out={788.2} top={850} />);
  if (on(790.3, 800.4)) {
    L.push(<BigNum key="p53" t={t} at={AT("Page 53")} text="PAGE 53 · CALL A PRO" size={80} x={1380} y={140} out={800.1} col="#ff8a7a" edge="#4a100d" />);
    L.push(<Tag key="hn" t={t} at={AT("and I mean it")} x={sc(t, pagePt(0.35, 0.11)).x} y={sc(t, pagePt(0.35, 0.11)).y} dx={-300} dy={-120} text="I MEAN IT" col="#ffd08a" out={800.1} size={44} />);
  }
  // ================= MIN 13 · cuándo llamar · el agua =================
  if (on(796.6, 823.7)) L.push(<ProList key="pr" t={t} at={803.95} out={823.4} rows={[{ at: AT("bigger than about 10 square feet", 796), tx: "BIGGER THAN 10 SQ FT" }, { at: AT("if the drywall is soft"), tx: "SOFT / STAINED DRYWALL" }, { at: AT("if it came after a flood"), tx: "FLOOD · SEWER · LEAK" }, { at: AT("inside the air ducts"), tx: "AIR DUCTS / FURNACE" }, { at: AT("has asthma"), tx: "ASTHMA / GETS SICK" }]} />);
  if (on(803.9, 811.6)) L.push(<Stamp key="wiw" t={t} at={AT("that's water inside the wall")} text="WATER INSIDE THE WALL" x={1350} y={860} out={807.4} rot={-5} size={64} />);
  if (on(823.6, 829.6)) L.push(<BigNum key="cs" t={t} at={AT("will tell you what caused it")} text="WHAT CAUSED IT?" size={90} x={1380} y={180} out={829.4} />);
  if (on(829.5, 834.6)) L.push(<Stamp key="aw" t={t} at={AT("ask them about the water")} text="ASK ABOUT THE WATER" x={960} y={220} out={834.4} rot={-6} size={84} col={COL.ice} />);
  if (on(834.5, 845.4)) L.push(<Drop key="dr" t={t} at={AT("Water is the problem")} out={845.1} x={1500} y={430} tx="WATER IS THE PROBLEM" />);
  if (on(838.0, 845.4)) {
    const c = sc(t, PT.corner);
    L.push(<Tag key="sw2" t={t} at={AT("a spot that stays wet too long")} x={c.x} y={c.y} dx={-320} dy={-200} text="STAYS WET TOO LONG" col={COL.ice} out={844.8} size={50} />);
  }
  const TH = [AT("The fan.", 846), AT("The bottom corners"), AT("Three, the curtain and the mat")];
  if (on(845.3, 890.5)) L.push(<Meter key="mt3" t={t} at={845.5} out={890.2} title="FIND THE WATER" marks={TH} col={COL.ice} />);
  if (on(845.3, 851.6)) L.push(<ChipsAt key="3t" t={t} out={851.4} num items={[{ at: TH[0], tx: "THE FAN" }, { at: TH[0] + 0.6, tx: "THE CORNERS" }, { at: TH[0] + 1.2, tx: "CURTAIN & MAT" }]} />);
  if (on(851.5, 855.3)) L.push(<Ring key="r20" t={t} at={AT("It runs during every shower")} dur={3.2} out={855.1} label="+20'" sub="AFTER EVERY SHOWER" x={1560} y={330} col={COL.ice} r={120} />);
  if (on(855.2, 860.1)) L.push(<Tag key="tp" t={t} at={AT("hold a square of toilet paper")} x={960} y={420} dx={300} dy={-160} text="THE TOILET PAPER TEST" col="#ffffff" out={859.9} size={48} />);
  if (on(860.0, 863.3)) {
    const v = sc(t, PT.vent);
    L.push(<Tag key="tpl" t={t} at={860.3} x={v.x} y={v.y + 60} dx={-300} dy={160} text="HANGS LOOSE = FAN'S DEAD" col="#ff8a7a" out={863.1} size={48} />);
    L.push(<Stamp key="hl" t={t} at={AT("Have it looked at")} text="HAVE IT LOOKED AT" x={1400} y={250} out={863.1} rot={-6} size={70} col="#ffd60a" />);
  }
  if (on(867.4, 871.9)) {
    const c = sc(t, [-1.3, 0.6, -1.5]);
    L.push(<Tag key="sd" t={t} at={867.6} x={c.x} y={c.y} dx={260} dy={-220} text="SITS IN THE CORNERS" sub="THE LONGEST" col={COL.ice} out={871.6} size={50} />);
  }
  if (on(871.8, 879.2)) {
    L.push(<Ring key="r30" t={t} at={AT("30 seconds with an old towel")} dur={3} out={879.0} label="30 s" sub="AFTER THE LAST SHOWER" x={1580} y={330} col="#9fffb0" r={120} />);
    L.push(<BigNum key="ntd" t={t} at={AT("mold has nothing to drink")} text="NOTHING TO DRINK" size={90} x={600} y={200} out={879.0} col="#9fffb0" edge="#123d1a" />);
  }
  if (on(879.1, 890.5)) L.push(<Rules key="cm" t={t} out={890.2} x={1180} y={240} w={640} rows={[{ at: AT("Spread the shower curtain out"), tx: "CURTAIN SPREAD FLAT", ok: true }, { at: AT("not bunched up"), tx: "BUNCHED UP, WET", ok: false }, { at: AT("hang the bath mat over the tub"), tx: "MAT OVER THE TUB", ok: true }]} />);
  if (on(890.4, 897.0)) L.push(<BigNum key="11y" t={t} at={AT("in 11 years")} text="11 YEARS" sub="NOT ONE BLACK LINE" size={170} y={480} col="#9fffb0" edge="#123d1a" out={896.8} />);
  // ================= MIN 14 · la señora de Lakewood =================
  if (on(897.0, 900.6)) L.push(<BigNum key="os" t={t} at={AT("one more story")} text="ONE MORE STORY" size={80} x={1420} y={170} out={900.4} />);
  if (on(900.5, 906.5)) L.push(<LowerThird key="lw" t={t} at={AT("A lady out in Lakewood")} out={906.2} name="LAKEWOOD, OHIO" l2="A DARK LINE AROUND HER TUB · FOR YEARS" l2at={AT("She had a dark line")} />);
  if (on(906.4, 911.8)) L.push(<Saturdays key="sat" t={t} at={AT("every Saturday, hard")} out={911.6} y={790} />);
  if (on(911.7, 917.6)) L.push(<ChipsAt key="spt" t={t} out={917.4} num={false} y={850} items={[{ at: AT("on the ceiling", 911), tx: "CEILING", c: "#ff8a7a" }, { at: AT("on the window frame"), tx: "WINDOW", c: "#ff8a7a" }, { at: AT("the back of the bathroom door"), tx: "DOOR", c: "#ff8a7a" }]} />);
  if (on(918.4, 924.5)) {
    const d = sc(t, PT.dab);
    L.push(<Tag key="mr" t={t} at={AT("Mold with roots", 918)} x={d.x} y={d.y} dx={-300} dy={-200} text="MOLD WITH ROOTS" col="#ff8a7a" out={921.5} size={52} />);
    L.push(<BigNum key="2nt" t={t} at={AT("Two nights", 918)} text="🌙🌙 2 NIGHTS" size={100} x={1400} y={190} out={924.2} />);
  }
  if (on(924.4, 929.7)) L.push(<Stamp key="nth" t={t} at={AT("Nothing!", 924)} text="NOTHING!" x={1450} y={300} out={929.5} rot={-10} size={130} />);
  if (on(929.6, 935.2)) L.push(<BigNum key="6y" t={t} at={AT("dead for six years")} text="DEAD 6 YEARS" sub="IT STILL MADE A NOISE" size={110} x={470} y={250} col="#ff8a7a" edge="#4a100d" out={935.0} />);
  if (on(935.1, 939.95)) L.push(<BigNum key="90" t={t} at={AT("She got the fan fixed for $90")} text="$90" sub="THE LINE NEVER CAME BACK" size={170} x={1450} y={260} col="#9fffb0" edge="#123d1a" out={939.7} />);
  if (on(939.9, 945.1)) L.push(<Tag key="drs" t={t} at={AT("That was just the dry brush")} x={sc(t, PT.ceil).x} y={sc(t, PT.ceil).y} dx={300} dy={200} text="THE DRY BRUSH" sub="EVERY SATURDAY" col="#ff8a7a" out={944.8} size={52} />);
  // ================= MIN 15-16 · el repaso · la guía · cierre =================
  const RC = [
    { head: "LOOK", c: "#ffd08a", rows: [{ at: AT("Look first with the light sideways"), tx: "LIGHT SIDEWAYS" }, { at: AT("Flat and powdery is mildew"), tx: "FLAT = MILDEW" }, { at: AT("Fuzzy or slimy and dark is mold"), tx: "FUZZY = MOLD" }, { at: AT("Greasy and gray is dirt"), tx: "GREASY = DIRT" }] },
    { head: "TEST", c: "#ffd60a", rows: [{ at: AT("One tablespoon of bleach in one cup", 955), tx: "1 TBSP : 1 CUP" }, { at: AT("Wait two minutes"), tx: "DAB · WAIT 2 MIN" }, { at: AT("Lighter means alive"), tx: "LIGHTER = ALIVE" }, { at: AT("Same means dirt"), tx: "SAME = DIRT" }, { at: AT("Back in a day means roots"), tx: "BACK = ROOTS" }, { at: AT("Then rinse it and wait till tomorrow"), tx: "RINSE · TOMORROW" }] },
    { head: "NEVER", c: "#ff8a7a", rows: [{ at: AT("Never scrub it dry"), tx: "SCRUB IT DRY" }, { at: AT("Never use the same rag"), tx: "THE SAME RAG" }, { at: AT("Don't bleach the caulk"), tx: "BLEACH THE CAULK" }, { at: AT("Don't cover it up"), tx: "COVER IT UP" }, { at: AT("Don't blow it around"), tx: "BLOW IT AROUND" }] },
    { head: "CLEAN", c: "#9fffb0", rows: [{ at: AT("Peroxide, full strength, 10 minutes"), tx: "PEROXIDE · 10 MIN" }, { at: AT("all night under the strips"), tx: "CAULK: STRIPS ALL NIGHT" }] },
    { head: "CALL", c: "#ff4a3d", rows: [{ at: AT("Bigger than 10 square feet", 980), tx: "> 10 SQ FT · FLOOD" }, { at: AT("then find the water"), tx: "FIND THE WATER" }] },
  ];
  if (on(945.0, 991.6)) L.push(<Recap key="rcp" t={t} at={945.1} out={991.4} groups={RC} />);
  if (on(945.0, 948.8)) L.push(<BigNum key="omt" t={t} at={AT("one more time")} text="ONE MORE TIME" size={90} x={1400} y={170} out={948.6} />);
  if (on(991.5, 1000.4)) {
    L.push(<BigNum key="p23b" t={t} at={AT("is on page 23")} text="PAGE 23" size={120} x={1560} y={150} out={996.6} col="#ffd60a" edge="#5a4500" />);
    L.push(<Tag key="bbb" t={t} at={AT("Rhonda's Brown Bottle Book", 990)} x={sc(t, [PT.book[0] - 0.12, PT.book[1] + 0.04, PT.book[2]]).x} y={sc(t, [PT.book[0] - 0.12, PT.book[1] + 0.04, PT.book[2]]).y} dx={260} dy={-200} text="RHONDA'S BROWN BOTTLE BOOK" col="#ffd08a" out={996.55} size={44} />);
    L.push(<BigNum key="91" t={t} at={AT("91 more fixes")} text="+ 91 MORE FIXES" sub="ROOM BY ROOM" size={90} x={1450} y={880} out={1000.1} col="#ffd08a" edge="#5a3a10" />);
  }
  if (on(1000.3, 1007.9)) {
    L.push(<Desc key="d3" t={t} at={AT("The link is in the first line", 1000)} out={1003.2} top={850} />);
    L.push(<Guarantee key="gu" t={t} at={AT("7-day money back guarantee")} out={1007.6} x={1580} y={760} />);
    L.push(<Stamp key="dp2" t={t} at={AT("don't pay")} text="DON'T PAY" x={600} y={880} out={1007.6} rot={-6} size={84} col="#1c9b4a" />);
  }
  if (on(1007.8, 1016.3)) {
    L.push(<BigNum key="tn" t={t} at={AT("Go dab that spot tonight")} text="DAB IT TONIGHT" size={96} x={1400} y={170} out={1012.3} />);
    L.push(<Comment key="cm2" t={t} at={AT("tell me in the comments")} out={1016.1} />);
    L.push(<ChipsAt key="mmd" t={t} out={1016.1} num={false} y={930} items={[{ at: AT("Mold, mildew, or dirt", 1010), tx: "MOLD?", c: "#ff8a7a" }, { at: AT("Mold, mildew, or dirt", 1010) + 0.4, tx: "MILDEW?", c: "#d9d9d9" }, { at: AT("Mold, mildew, or dirt", 1010) + 0.8, tx: "DIRT?", c: "#c9b08a" }]} />);
  }
  if (on(1016.2, END)) L.push(<NextCard key="nx" t={t} at={AT("watch the video on your screen next")} out={1028.9} />);
  if (on(1024.5, END)) L.push(<LowerThird key="bye" t={t} at={AT("I'm Rhonda", 1025)} out={1028.9} name="RHONDA" l2="THANKS FOR CLEANING WITH ME" l2at={AT("Thanks for cleaning with me")} />);
  return <>{L}</>;
};

// "Into the caulk, into the grout, into the paint, into the drywall": capas que se apilan
const Spread122: React.FC<{ t: number }> = ({ t }) => {
  const it = [["THE CAULK", AT("Into the caulk")], ["THE GROUT", AT("into the grout")], ["THE PAINT", AT("into the paint")], ["THE DRYWALL", AT("into the drywall")]] as [string, number][];
  return <ChipsAt t={t} out={125.5} num={false} y={830} items={it.map(([tx, at]) => ({ at: Math.max(122.4, at), tx: "↓ " + tx, c: "#ff8a7a" }))} />;
};

// pantalla final: "el video que sigue" en una tarjeta que flota sobre el baño limpio
const NextCard: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = Math.min(1.1, Math.max(0, 1 - Math.exp(-(t - at) * 5) * Math.cos((t - at) * 9))), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01 || t < at) return null;
  return (
    <div style={{ position: "absolute", left: 1060, top: 200, opacity: o, perspective: 1500 }}>
      <div style={{ width: 760, transform: `rotateY(${-14 + (1 - Math.min(1, k)) * -50}deg) translateZ(${(1 - Math.min(1, k)) * -400}px)`, borderRadius: 22, overflow: "hidden", boxShadow: "0 60px 110px rgba(0,0,0,.7), 0 0 0 6px #fff" }}>
        <div style={{ position: "relative", height: 427 }}>
          <Shot k="f_after" t={t} a={at} z={[1.02, 1.1]} dur={12} />
          <div style={{ position: "absolute", left: 20, bottom: 18, padding: "8px 16px", borderRadius: 10, background: "rgba(0,0,0,.75)", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff" }}>WHY BLEACH NEVER KILLS IT ▶</div>
        </div>
      </div>
      <div style={{ marginTop: 18, textAlign: "center", fontWeight: 900, fontSize: 46, color: "#ffd60a", textShadow: "0 4px 12px #000", fontFamily: FONT }}>WATCH THIS NEXT ➜</div>
    </div>
  );
};

export const Rest: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return (
    <AbsoluteFill style={{ background: "#0b0e13" }}>
      <Base t={t} />
      <Over t={t} />
    </AbsoluteFill>
  );
};
