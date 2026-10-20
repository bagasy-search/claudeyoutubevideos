// gary01 · DEL 1:10 AL FINAL (70,2 → 506,8 s). Misma vara que el minuto 1: una base por frase (toma agnes / heladera 3D /
// avatar) y CERO cortes secos — cada cambio de base es una transición (latigazo, portal desde el objeto, zoom a través,
// giro de tarjeta, empuje vertical, fogonazo) y las piezas 2.5D viven en una capa aparte que CRUZA las transiciones.
// Todo anclado a la palabra con at("frase") sobre los tiempos reales de la voz (caps.json). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FridgeCut, K, FX } from "./fridge3d";
import { BigNum, COL, Chips, DrawX, Flash, FONT, HeatHaze, LowerThird, P, Portal, Receipt, Tag, Thermo, Vid, e, ei, extrude, s, spr } from "./lib";
import { Stamp, Price } from "./Min1";
import { CheckList, ColdBattery, DoorCounter, JugFill, MistakesDeal, Mistake, NextCard, RuleCard, StepTitle, TempChart, TimeBars, Timer, Toggle, Versus, Words } from "./comps2";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./rest_avail.json";

export const T0 = 70.2, TEND = 506.85;
export const FULL_FRAMES = Math.ceil(TEND * 30);

// ---------- at("frase", después_de): segundo exacto en que la voz dice la frase ----------
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9$°]/g, "");
const WORDS = (CAPS as [string, number][]).flatMap(([w, ms]) => w.split(/\s+/).map((x, j) => ({ w: norm(x), t: ms / 1000 + j * 0.3 }))).filter((x) => x.w);
const at = (phrase: string, after = 0): number => {
  const ws = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i < WORDS.length; i++) {
    if (WORDS[i].t < after - 0.01) continue;
    let ok = true;
    for (let j = 0; j < ws.length; j++) if (!WORDS[i + j] || WORDS[i + j].w !== ws[j]) { ok = false; break; }
    if (ok) return WORDS[i].t;
  }
  throw new Error(`at(): no encuentro "${phrase}" después de ${after}`);
};

// ---------- tomas: mp4 de agnes si llegó; si no la foto; si no un fondo ----------
const HAS = AVAIL as { clips: string[]; imgs: string[] };
const Clip: React.FC<{ k: string; a: number; z?: [number, number]; dur?: number; style?: React.CSSProperties }> = ({ k, a, z = [1.03, 1.11], dur = 8, style }) => {
  const t = useCurrentFrame() / 30, sc = z[0] + (z[1] - z[0]) * e(t, a, a + dur);
  const inner = HAS.clips.includes(k) ? <Vid id={"ltx_" + k} at={a} /> : HAS.imgs.includes(k) ? <Vid id={"img_" + k} /> :
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#1b2430,#0b0f14)", color: "#556", fontFamily: FONT, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{k}</AbsoluteFill>;
  return <AbsoluteFill style={{ transform: `scale(${sc})`, ...style }}>{inner}</AbsoluteFill>;
};

// ---------- avatar: TODAS las ventanas pagadas del reel (preroll 10 cuadros, cola 0,6 s para salir con transición) ----------
const WINS = (AVW as number[][]).map(([ms, me, off]) => ({ ms, me, off }));
const Avatar: React.FC<{ t: number; blur?: number; dark?: number; edge?: number }> = ({ t, blur = 0, dark = 0, edge = 0 }) => {
  const face = WINS.filter((w) => w.ms >= T0 - 1).map((w, i) => (
    <Sequence key={i} from={s(w.ms) - 10} durationInFrames={s(w.me - w.ms) + 30} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me + 0.65 ? 1 : 0 }}>
        <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
  ));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(${1 - dark})` : dark > 0 ? `brightness(${1 - dark})` : undefined, transform: blur > 0.2 ? "scale(1.05)" : undefined }}>{face}</AbsoluteFill>
      {edge > 0.01 && <AbsoluteFill style={{ filter: `blur(${14 * edge}px) brightness(.7)`, transform: "scale(1.04)", WebkitMaskImage: "radial-gradient(ellipse 46% 52% at 50% 42%, transparent 55%, #000 100%)" } as React.CSSProperties}>{face}</AbsoluteFill>}
    </AbsoluteFill>
  );
};
// blur del avatar mientras hay una pieza pesada encima: tramos [desde, hasta]
const soft = (t: number, spans: [number, number][], amt = 14) => spans.reduce((m, [a, b]) => Math.max(m, e(t, a, a + 0.35) * (1 - e(t, b, b + 0.35))), 0) * amt;

// ---------- heladera 3D con otra cámara ----------
const FC: React.FC<{ t: number; kf: K[]; fx: FX; blur?: number }> = ({ t, kf, fx, blur = 0 }) => (
  <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px) brightness(.8)` : undefined }}><FridgeCut t={t} kf={kf} fx={fx} /></AbsoluteFill>
);

// ---------- transiciones entre bases ----------
type Tr = "whip" | "whipL" | "portal" | "zoom" | "flip" | "push" | "light" | "cut";
const DUR: Record<Tr, number> = { whip: 0.5, whipL: 0.5, portal: 0.6, zoom: 0.55, flip: 0.6, push: 0.55, light: 0.5, cut: 0 };
const HB: React.FC<{ id: string; x: number; y: number }> = ({ id, x, y }) => <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={`${x} ${y}`} /></filter></svg>;
const transition = (tr: Tr, k: number, prev: React.ReactNode, cur: React.ReactNode, p: [number, number]) => {
  const L: React.ReactNode[] = [];
  if (tr === "whip" || tr === "whipL") {
    const out = k < 0.5, k2 = out ? k * 2 : (1 - k) * 2, b = Math.round(90 * k2), d = tr === "whip" ? -1 : 1, id = `wb${b}`;
    L.push(<AbsoluteFill key="w" style={{ transform: `translateX(${(out ? d : -d) * k2 * 300}px) scale(${1 + k2 * 0.32})`, filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={b} y={0} /> : null}{out ? prev : cur}</AbsoluteFill>);
    if (k2 > 0.4) L.push(<AbsoluteFill key="wl" style={{ background: "linear-gradient(90deg, transparent 20%, rgba(255,226,170,.5) 50%, transparent 80%)", opacity: (k2 - 0.4) / 0.6, mixBlendMode: "screen" }} />);
  } else if (tr === "portal") {
    L.push(<AbsoluteFill key="pp">{prev}</AbsoluteFill>);
    L.push(<Portal key="pc" x={p[0]} y={p[1]} r={ei(k, 0, 1) * 0.999 + 0.001}>{cur}</Portal>);
  } else if (tr === "zoom") {
    const z = ei(k, 0, 1), b = Math.round(22 * Math.sin(Math.PI * k)), id = `zb${b}`;
    L.push(<AbsoluteFill key="zc" style={{ transform: `scale(${1.35 - 0.35 * z})` }}>{cur}</AbsoluteFill>);
    L.push(<AbsoluteFill key="zp" style={{ transformOrigin: `${p[0]}px ${p[1]}px`, transform: `scale(${1 + 3.2 * z})`, opacity: 1 - e(k, 0.35, 0.9), filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={b} y={b} /> : null}{prev}</AbsoluteFill>);
  } else if (tr === "flip") {
    const out = k < 0.5, a = out ? ei(k * 2, 0, 1) * 90 : (1 - ei((k - 0.5) * 2, 0, 1)) * -90;
    L.push(<AbsoluteFill key="fb" style={{ background: "radial-gradient(ellipse at 50% 50%, #1a222c, #05070a)" }} />);
    L.push(<AbsoluteFill key="ff" style={{ perspective: 2200 }}><AbsoluteFill style={{ transform: `translateZ(${-Math.sin(Math.PI * k) * 500}px) rotateY(${a}deg)`, borderRadius: 30 * Math.sin(Math.PI * k), overflow: "hidden", boxShadow: "0 60px 120px rgba(0,0,0,.8)" }}>{out ? prev : cur}</AbsoluteFill></AbsoluteFill>);
  } else if (tr === "push") {
    const z = ei(k, 0, 1), b = Math.round(60 * Math.sin(Math.PI * k)), id = `pb${b}`;
    L.push(<AbsoluteFill key="up" style={{ transform: `translateY(${-z * 1080}px)`, filter: b ? `url(#${id})` : undefined }}>{b ? <HB id={id} x={0} y={b} /> : null}{prev}</AbsoluteFill>);
    L.push(<AbsoluteFill key="uc" style={{ transform: `translateY(${(1 - z) * 1080}px)`, filter: b ? `url(#${id})` : undefined }}>{cur}</AbsoluteFill>);
  } else if (tr === "light") {
    L.push(<AbsoluteFill key="lp">{prev}</AbsoluteFill>);
    L.push(<AbsoluteFill key="lc" style={{ opacity: e(k, 0.25, 0.75) }}>{cur}</AbsoluteFill>);
    const g = Math.sin(Math.PI * k);
    L.push(<AbsoluteFill key="ll" style={{ background: `radial-gradient(ellipse 80% 70% at ${30 + 40 * k}% 45%, rgba(255,236,200,${0.95 * g}), rgba(255,170,90,${0.35 * g}) 50%, transparent 80%)`, mixBlendMode: "screen" }} />);
  } else L.push(<AbsoluteFill key="c">{cur}</AbsoluteFill>);
  return L;
};

// ---------- cámaras de la heladera para cada frase ----------
const KA: K[] = [{ t: 70.2, p: [-1.2, 1.7, 3.3], l: [0, 0.95, 0], fov: 34 }, { t: 74.6, p: [-2.4, 1.25, 1.7], l: [0, 0.8, -0.1], fov: 34 }, { t: 78.6, p: [-1.55, 0.5, 0.15], l: [0.15, 0.22, -0.45], fov: 40 }, { t: 83.4, p: [-3.1, 1.7, 2.7], l: [0, 0.9, 0], fov: 36 }];
const KB: K[] = [{ t: 90, p: [0.7, 1.15, 3.5], l: [0, 0.95, 0], fov: 34 }, { t: 99, p: [0.3, 1.0, 2.5], l: [0, 0.95, 0], fov: 34 }];
const KC: K[] = [{ t: 109, p: [-2.9, 1.35, 2.3], l: [0, 0.85, 0], fov: 36 }, { t: 116, p: [-2.1, 1.2, 1.5], l: [0, 0.85, 0], fov: 36 }];
const KD: K[] = [{ t: 118.6, p: [-1.4, 1.65, 0.7], l: [-0.04, 1.42, 0], fov: 36 }, { t: 125.5, p: [-0.95, 1.5, 0.3], l: [-0.04, 1.42, 0], fov: 34 }];
const KE: K[] = [{ t: 173, p: [-1.6, 1.95, 1.25], l: [0, 1.4, 0], fov: 36 }, { t: 181, p: [-2.3, 1.5, 1.9], l: [0, 1.3, 0], fov: 36 }];
const KF_: K[] = [{ t: 253.3, p: [1.6, 1.5, 3.3], l: [0, 0.95, 0], fov: 36 }, { t: 259.3, p: [-1.5, 1.2, 3.0], l: [0.15, 0.8, 0.2], fov: 40 }];
const KG: K[] = [{ t: 307.5, p: [-1.55, 1.1, 0.55], l: [0.1, 0.8, 0], fov: 38 }, { t: 313.6, p: [-1.25, 0.95, 0.35], l: [0.1, 0.75, 0], fov: 38 }];
const KH: K[] = [{ t: 318.6, p: [-2.0, 1.35, 1.45], l: [0, 0.95, 0], fov: 36 }, { t: 324.2, p: [-1.65, 1.2, 0.95], l: [0.05, 0.95, 0], fov: 36 }];
const KI: K[] = [{ t: 351.5, p: [-3.0, 1.45, 2.8], l: [0, 0.9, 0], fov: 36 }, { t: 356.5, p: [-2.7, 1.35, 2.4], l: [0, 0.9, 0], fov: 36 }];
const KL: K[] = [{ t: 467.1, p: [-2.6, 1.5, 2.4], l: [0, 0.9, 0], fov: 36 }, { t: 477.5, p: [1.7, 1.45, 3.0], l: [0, 0.9, 0], fov: 36 }];

// ---------- anclas (segundo exacto de cada frase) ----------
const A = {
  coldBox: at("cold box", 70), notIt: at("It's not", 72), leaky: at("leaky box", 72), motor: at("motor that", 72), stops: at("motor stops", 75), heat: at("heat starts", 78),
  walls: at("through the walls", 82), seal: at("door seal", 82), top: at("through the top", 86), four: at("four hours", 88), twoDays: at("two days", 90), oneDay: at("one day", 95),
  opens: at("opens that door", 99), bucket: at("bucket", 103), three: at("three things", 106), store: at("Store more", 108), slow: at("slow down", 110), stop: at("stop the cold", 113),
  step1: at("Step one", 118), thermal: at("thermal battery", 118), water: at("It's just water", 120), jugs: at("milk jugs", 122), nine: at("nine-tenths", 128),
  salt: at("rock salt per gallon", 133), colder: at("freezes colder", 137), melts: at("melts colder", 139), longer: at("down longer", 142), plain: at("plain water", 145),
  fill: at("fill every", 148), empty: at("Empty space", 150), air: at("Air holds", 152), waterH: at("Water holds", 154), packed: at("A packed freezer", 156),
  five: at("five dollars", 160), nothing: at("cost nothing", 162), before: at("before the storm", 167), during: at("not during", 169), six: at("six jugs", 171),
  sit: at("They just sit", 175), stored: at("couple of days", 180), batt: at("like a battery", 182),
  step2: at("Step two", 185), jacket: at("the jacket", 185), surprised: at("surprised everybody", 187), wrap: at("I wrap", 189), silver: at("silver bubble", 191), roll: at("in a roll", 194), d25: at("$25", 196),
  cut: at("I cut it", 200), tape: at("I tape it", 203), hang: at("I hang", 205), d12: at("About $12", 208), ridic: at("looks ridiculous", 209), wife: at("My wife laughed", 210),
  coat: at("without a coat", 216), noCoat: at("no coat on", 222), elec: at("electrician talking", 226), onlyOn: at("only goes on", 231), comesBack: at("power comes back", 233), off: at("comes off", 235),
  breathe: at("needs to breathe", 238), coils: at("The coils", 240), cook: at("cook the compressor", 243), pOut: at("Power out,", 246), jOn: at("jacket on", 248), pBack: at("Power back", 249), jOff: at("jacket off", 250),
  step3: at("3 is the door rule", 252), spills: at("cold air spills", 258), warm: at("warm air rushes", 262), ten: at("Ten openings", 266), thrown: at("thrown away", 268),
  cooler: at("foam coolers", 271), d10: at("about $10", 272), morning: at("Every morning", 274), oneTime: at("one time", 275), milk: at("Milk, eggs", 280), eggs: at("eggs, lunch", 280), lunch: at("lunch meat", 281),
  yogurt: at("yogurt", 284), insulin: at("insulin", 285), inCooler: at("It goes in the cooler", 286), close: at("Then I close", 289), oneOpen: at("One opening", 293), tenSec: at("10 seconds", 294),
  becomes: at("The cooler becomes", 296), step4: at("Step four", 298), second: at("On the second morning", 300), topShelf: at("top shelf", 305), falls: at("Cold falls", 307),
  spare: at("can spare it", 313), boost: at("a boost", 318), third: at("On the third morning", 319), thermo: at("is a thermometer", 322), probe: at("wire probe", 324), d8: at("8 bucks", 329),
  wire: at("thin wire", 330), without: at("without ever opening", 334), never: at("You never open", 337), real: at("my real numbers", 340), wentOut: at("When the power went out", 343),
  t37: at("37 degrees", 346), t38: at("38.", 349), t39: at("39.", 351), t40: at("40.", 353), line: at("Right on the line", 354), hard: at("freezer was still hard", 355), milkCold: at("milk was cold", 357),
  frozen: at("frozen solid", 360), t58: at("at 58", 363), kept: at("kept opening", 367), funny: at("funny thing", 370), killed: at("Checking it is what killed", 371), addUp: at("add it all up", 374),
  rSalt: at("Rock salt, $5", 376), rSilver: at("silver insulation, $25", 378), rBlanket: at("moving blanket, $12", 381), rCooler: at("foam cooler, $10", 383), rThermo: at("thermometer, $8", 385), r60: at("$60.", 386),
  gen: at("cheap generator", 387), gas: at("plus gas", 390), noise: at("plus the noise", 391), fumes: at("plus the fumes", 392), inverter: at("battery and inverter", 396), more: at("more than that", 399),
  never2: at("never breaks down", 400), mistakes: at("Now the mistakes", 403), m1: at("Number one", 404), dont: at("don't do it", 408), readWire: at("Read the wire", 411), m2: at("Number two", 413),
  heater: at("little heater", 416), m3: at("Number three", 419), m4: at("Number four", 425), grows: at("Water grows", 429), split: at("split jug", 432),
  m5: at("number five", 435), radio: at("on the radio", 437), storesOut: at("stores are out", 440), calm: at("calm day", 444), oneMore: at("one more thing", 446),
  over40: at("over 40 degrees", 451), twoHrs: at("two hours", 453), trash: at("go in the trash", 455), smells: at("how good it smells", 458), doubt: at("When in doubt", 460), throwOut: at("throw it out", 461),
  myRule: at("not my rule", 463), theRule: at("That's the rule", 464), neverGet: at("never get there", 468), wWater: at("Water, salt", 470), wSalt: at("salt, a coat", 471), wCoat: at("a coat", 471), wCooler: at("a cooler", 472), wDisc: at("discipline", 472),
  bought: at("bought a generator", 474), garage: at("sitting in his garage", 479), started: at("never once started", 481), sameSix: at("same six jugs", 483), subscribe: at("hit subscribe", 487),
  nextTime: at("next time", 488), truck: at("battery out of my", 492), nothingBreak: at("nothing to break", 499), imGary: at("I'm Gary", 500), family: at("Take care of your family", 501), seeYou: at("see you in the next", 502),
};

// ---------- LA LÍNEA DE TIEMPO DE BASES ----------
type Beat = { a: number; tr: Tr; p?: [number, number]; k?: string; r: (t: number) => React.ReactNode };
const av = (ms: number) => WINS.reduce((b, w) => (Math.abs(w.ms - ms) < Math.abs(b.ms - ms) ? w : b)).ms;
const AV = (ms: number, tr: Tr, opt: { spans?: [number, number][]; edge?: boolean; p?: [number, number] } = {}): Beat => ({
  a: av(ms), tr, p: opt.p, r: (t) => <Avatar t={t} blur={soft(t, opt.spans ?? [])} dark={soft(t, opt.spans ?? [], 0.35)} edge={opt.edge ? 0.8 : 0} />,
});
const CL = (a: number, k: string, tr: Tr, p?: [number, number], z?: [number, number], extra?: (t: number) => React.ReactNode): Beat => ({ a, tr, p, k, r: (t) => <AbsoluteFill><Clip k={k} a={a} z={z} />{extra?.(t)}</AbsoluteFill> });

const BEATS: Beat[] = [
  // 1 · qué es una heladera de verdad: caja que pierde + motor que achica (3D)
  { a: T0, tr: "cut", r: (t) => <FC t={t} kf={KA} fx={{ unplug: 0, lightOn: 0, cold: 1, leak: 0.55 * e(t, A.leaky, A.leaky + 0.5), motor: 1 - e(t, A.stops, A.stops + 0.3), heat: e(t, A.heat - 0.2, A.heat + 0.6) }} /> },
  AV(82.79, "whip", { spans: [[82.79, 86.6]], edge: true }),
  CL(86.93, "s01", "portal", [960, 300], [1.04, 1.14], (t) => <HeatHaze t={t} amt={0.7}><AbsoluteFill /></HeatHaze>),
  { a: A.four - 0.55, tr: "zoom", p: [960, 300], r: (t) => <FC t={t} kf={KB} fx={{ cold: 1, heat: 0.5, leak: 0 }} blur={7} /> },
  AV(98.33, "light", { spans: [[98.33, A.opens - 0.2]] }),
  CL(103.67, "s02", "portal", [1180, 560], [1.03, 1.1]),
  { a: A.three - 0.3, tr: "flip", r: (t) => <FC t={t} kf={KC} fx={{ cold: 1, heat: 0.8 * e(t, A.slow, A.slow + 0.4), leak: 0.7 * e(t, A.stop - 0.3, A.stop + 0.3) }} /> },
  AV(115.32, "zoom", { spans: [[115.32, 117.6]], p: [960, 540] }),
  // 2 · PASO 1: batería térmica
  { a: av(115.32) + 3.34, tr: "push", r: (t) => <FC t={t} kf={KD} fx={{ cold: 1, jugs: 0.4 + 0.6 * e(t, A.thermal, A.thermal + 0.5) }} /> },
  CL(A.jugs - 0.6, "s03", "whip"),
  AV(131.02, "portal", { p: [960, 420] }),
  CL(135.42, "s04", "push"),
  { a: A.melts - 0.2, tr: "light", r: (t) => <FC t={t} kf={KD} fx={{ cold: 1, jugs: 1 }} blur={6} /> },
  AV(145.61, "whipL", { spans: [[145.61, 147.2]] }),
  CL(150.76, "s05", "zoom", [960, 540]),
  CL(A.packed - 0.4, "s06", "light"),
  AV(162.37, "whip", { edge: true }),
  CL(167.72, "s08", "flip"),
  { a: A.six + 0.4, tr: "portal", p: [700, 360], r: (t) => <FC t={t} kf={KE} fx={{ cold: 1, jugs: 0.7 + 0.3 * Math.sin(t * 3) }} /> },
  AV(180.26, "zoom", { spans: [[180.26, A.batt + 1.6]], p: [800, 380] }),
  // 3 · PASO 2: la campera
  CL(186.36, "s09", "push"),
  CL(A.silver - 0.3, "s41", "whip"),
  AV(197.98, "light"),
  CL(201.75, "s10", "whipL"),
  CL(A.hang - 0.3, "s11", "whip"),
  CL(A.ridic + 0.3, "s12", "light"),
  AV(214.52, "portal", { p: [380, 420] }),
  CL(219.37, "s13", "zoom", [960, 540], [1.02, 1.12], (t) => <HeatHaze t={t} amt={0.55}><AbsoluteFill /></HeatHaze>),
  CL(A.elec - 1.4, "s14", "flip"),
  AV(231.36, "whip", { spans: [[A.onlyOn, 236.6]] }),
  CL(236.76, "s15", "push"),
  CL(A.coils - 0.3, "s16", "zoom", [960, 700], [1.04, 1.16], (t) => <HeatHaze t={t} amt={e(t, A.cook - 0.4, A.cook + 0.6)}><AbsoluteFill /></HeatHaze>),
  AV(248.52, "whipL", { spans: [[248.52, 253.2]] }),
  // 4 · PASO 3: la regla de la puerta
  { a: 253.4, tr: "flip", r: (t) => <FC t={t} kf={KF_} fx={{ cold: 1, door: ei(t, A.step3 + 2.6, A.step3 + 3.6), leak: e(t, A.step3 + 3.2, A.step3 + 3.9) }} /> },
  CL(A.spills - 0.5, "s17", "zoom", [960, 820]),
  AV(264.61, "light", { spans: [[A.ten - 0.2, 269.4]] }),
  CL(269.55, "s18", "push"),
  CL(A.morning - 0.2, "s19", "whip"),
  AV(280.31, "portal", { p: [1240, 560], spans: [[A.milk - 0.3, 284.8]] }),
  CL(284.99, "s20", "zoom", [960, 540]),
  CL(A.close - 0.3, "s21", "whipL"),
  AV(297.17, "flip", { spans: [[A.step4 - 0.2, 302]] }),
  // 5 · PASO 4: el cambio de jarra + termómetro
  CL(302.14, "s22", "push"),
  { a: A.falls - 0.3, tr: "portal", p: [960, 300], r: (t) => <FC t={t} kf={KG} fx={{ cold: 0.8, fall: e(t, A.falls - 0.2, A.falls + 0.4), jugs: 0.6 }} /> },
  AV(313.26, "zoom", { p: [960, 360] }),
  { a: 318.7, tr: "whip", r: (t) => <FC t={t} kf={KH} fx={{ cold: 0.9, fall: 1, jugs: 1 }} /> },
  CL(A.thermo - 0.3, "s23", "light"),
  AV(329.6, "portal", { p: [980, 640] }),
  CL(334.06, "s24", "zoom", [960, 540], [1.03, 1.16]),
  CL(A.never - 0.4, "s25", "whip"),
  AV(347.21, "light", { spans: [[347.21, 351.5]] }),
  { a: 351.6, tr: "cut", r: (t) => <FC t={t} kf={KI} fx={{ cold: 1, jugs: 0.7 }} blur={8} /> },
  CL(A.hard - 0.3, "s26", "push"),
  AV(361.88, "whipL", { spans: [[A.t58 - 0.9, 367.6]] }),
  CL(367.72, "s27", "zoom", [960, 540]),
  CL(A.addUp - 0.3, "s42", "flip"),
  AV(379.19, "push", { spans: [[379.19, 384.0]] }),
  CL(384.13, "s43", "whip"),
  CL(A.gen - 0.3, "s28", "zoom", [960, 540], [1.04, 1.12]),
  AV(396.95, "light", { edge: true }),
  CL(401.88, "s44", "portal", [960, 540], [1.05, 1.2]),
  { a: A.mistakes - 0.15, tr: "zoom", p: [960, 540], r: () => <AbsoluteFill /> },   // las losas tienen su propio fondo (capa de piezas)
  CL(A.m1 - 0.2, "s29", "flip"),
  AV(412.58, "whip", { spans: [[A.m2 - 0.2, 416.7]] }),
  CL(416.89, "s30", "push", undefined, undefined, (t) => <HeatHaze t={t} amt={0.6}><AbsoluteFill /></HeatHaze>),
  CL(A.m3 - 0.25, "s31", "whipL"),
  CL(A.m4 - 0.25, "s32", "whip"),
  AV(430.08, "zoom", { spans: [[430.08, 435.5]], p: [960, 540] }),
  CL(435.67, "s33", "flip"),
  CL(A.calm - 2.2, "s34", "light"),
  AV(447.65, "push"),
  { a: 452.46, tr: "zoom", p: [960, 540], r: () => <AbsoluteFill style={{ background: "#120905" }} /> },  // fondo de la regla
  CL(A.smells - 1.2, "s35", "whip"),
  AV(462.98, "light", { spans: [[A.myRule - 0.1, 467]], edge: true }),
  { a: 467.16, tr: "portal", p: [960, 540], r: (t) => <FC t={t} kf={KL} fx={{ cold: 1, jugs: 1, fall: 0.6 }} blur={soft(t, [[A.wWater - 0.3, A.bought - 0.6]], 6)} /> },
  CL(A.bought - 1.4, "s36", "whip"),
  AV(480.23, "zoom", { p: [960, 540] }),
  CL(484.56, "s37", "push"),
  CL(A.nextTime - 0.2, "s38", "flip"),
  AV(496.05, "light", { spans: [[496.05, 498.5]] }),
  CL(501.09, "s39", "portal", [960, 540], [1.03, 1.08]),
];

// ---------- LA CAPA DE PIEZAS (cruza las transiciones) ----------
const pieces = (t: number) => [
  // 1
  <BigNum key="cb" t={t} at={A.coldBox} text="A COLD BOX?" x={960} y={180} size={110} out={A.notIt + 0.35} />,
  t < A.leaky - 0.05 ? <DrawX key="cbx" t={t} at={A.notIt} x={560} y={110} w={800} h={150} /> : null,
  <Words key="lk" t={t} items={[{ at: A.leaky, txt: "A LEAKY BOX" }, { at: A.motor, txt: "+ A MOTOR BAILING", col: COL.ice }]} out={A.stops - 0.2} y={150} size={92} />,
  <Words key="ms" t={t} items={[{ at: A.stops, txt: "MOTOR STOPS", col: COL.red }, { at: A.heat, txt: "→ HEAT PUSHES IN", col: COL.amber }]} out={82.6} y={150} size={92} />,
  <Tag key="tw" t={t} at={A.walls} x={500} y={520} dx={-150} dy={-120} text="WALLS" col={COL.amber} out={86.7} />,
  <Tag key="ts" t={t} at={A.seal} x={1380} y={760} dx={150} dy={60} text="DOOR SEAL" col={COL.amber} out={86.7} />,
  <Tag key="tt" t={t} at={A.top + 0.15} x={960} y={330} dx={170} dy={-110} text="WARM AIR COLLECTS" sub="ON TOP" col={COL.amber} out={A.four - 0.6} />,
  <TimeBars key="tb" t={t} rows={[{ at: A.four, label: "FRIDGE · DOOR SHUT", val: "4 HRS", frac: 0.12, col: COL.amber }, { at: A.twoDays, label: "FULL FREEZER", val: "2 DAYS", frac: 1 }, { at: A.oneDay, label: "HALF-EMPTY FREEZER", val: "1 DAY", frac: 0.5, col: "#b9c7d6" }]} out={A.opens - 0.4} x={250} y={250} />,
  <Words key="bk" t={t} items={[{ at: A.bucket - 0.15, txt: "LIKE WATER" }, { at: A.bucket + 0.1, txt: "OUT OF A BUCKET", col: COL.ice }]} out={A.three - 0.5} y={150} size={96} />,
  <Chips key="c3" t={t} at={A.store} items={["STORE COLD", "SLOW HEAT", "STOP SPILLS"]} out={117.4} y={700} />,
  // 2
  <StepTitle key="st1" t={t} at={A.step1} n={1} name="THE THERMAL BATTERY" out={A.water + 0.6} />,
  <Words key="jw" t={t} items={[{ at: A.water, txt: "IT'S JUST WATER", col: COL.ice }]} out={A.jugs - 0.7} y={880} size={96} />,
  <JugFill key="jf" t={t} at={A.nine - 0.2} out={135.2} />,
  <Tag key="rs" t={t} at={A.salt + 0.1} x={980} y={520} dx={180} dy={-150} text="1 HEAPING CUP" sub="ROCK SALT PER GALLON" out={A.colder - 0.3} />,
  <Versus key="vs" t={t} at={A.colder - 0.1} out={A.plain - 0.2} title="FREEZES AT" L={{ label: "PLAIN WATER", val: "32°F", h: 0.55, col: "#b9c7d6" }} R={{ label: "SALT WATER", val: "~26°F", h: 0.85, col: COL.ice, mark: "ok" }} />,
  <Words key="es" t={t} items={[{ at: A.empty, txt: "EMPTY SPACE", col: COL.red }, { at: A.empty + 0.5, txt: "= YOUR ENEMY" }]} out={A.air - 0.25} y={160} size={96} />,
  <Versus key="aw" t={t} at={A.air - 0.1} out={A.packed - 0.35} title="HOLDS COLD" L={{ label: "AIR", val: "1×", h: 0.06, col: "#b9c7d6", mark: "x" }} R={{ label: "WATER", val: "3,500×", h: 0.95, col: COL.ice, mark: "ok" }} />,
  <Tag key="pk" t={t} at={A.packed + 0.4} x={1000} y={520} dx={200} dy={-180} text="PACKED = KEEPS GOING" col={COL.ice} out={162.3} />,
  <Price key="p5" t={t} at={A.five - 0.2} x={1480} y={300} item="ROCK SALT" $={5} out={167.4} />,
  <Price key="p0" t={t} at={A.nothing - 0.3} x={1720} y={420} item="OLD JUGS" $={0} out={167.4} />,
  <Versus key="bd" t={t} at={A.before - 0.1} out={A.six + 0.3} title="WHEN TO DO IT" L={{ label: "BEFORE THE STORM", val: "NOW", h: 0.8, col: "#45d17f", mark: "ok" }} R={{ label: "DURING IT", val: "TOO LATE", h: 0.25, col: COL.red, mark: "x" }} />,
  <BigNum key="6j" t={t} at={A.six + 0.45} text="6 JUGS" x={1420} y={220} size={130} col={COL.ice2} edge="#1d3a52" sub="ALL WINTER" out={A.sit + 1.2} />,
  <ColdBattery key="cbat" t={t} at={A.sit + 0.6} out={A.batt + 1.7} label="2 DAYS OF COLD" />,
  // 3
  <StepTitle key="st2" t={t} at={A.step2} n={2} name="THE JACKET" out={A.surprised + 1.1} />,
  <Price key="p25" t={t} at={A.d25 - 0.1} x={1500} y={260} item="SILVER BUBBLE WRAP" $={25} out={201.6} />,
  <Tag key="sd" t={t} at={A.cut + 0.4} x={1100} y={420} dx={180} dy={-130} text="2 SIDES + TOP" out={A.hang - 0.4} />,
  <Price key="p12" t={t} at={A.d12 - 0.1} x={1520} y={240} item="MOVING BLANKET" $={12} out={A.ridic + 0.2} />,
  <Words key="ri" t={t} items={[{ at: A.ridic, txt: "LOOKS RIDICULOUS" }]} out={A.wife + 0.4} y={900} size={84} />,
  <Words key="nc" t={t} items={[{ at: A.noCoat - 0.6, txt: "NO COAT ON", col: COL.amber }]} out={A.elec - 1.5} y={180} size={110} />,
  <Stamp key="el" t={t} at={A.elec - 0.6} text="⚡ ELECTRICIAN'S RULE" x={960} y={180} rot={-4} size={80} out={231.2} />,
  <Toggle key="tg1" t={t} at={A.onlyOn} flipAt={A.comesBack + 0.2} out={236.5} a={["POWER OUT", "JACKET ON"]} b={["POWER BACK", "JACKET OFF"]} />,
  <Tag key="br" t={t} at={A.breathe} x={1100} y={500} dx={180} dy={-160} text="IT HAS TO BREATHE" col={COL.ice} out={A.coils - 0.4} />,
  <Tag key="co" t={t} at={A.coils + 0.3} x={900} y={560} dx={-200} dy={-170} text="COILS DUMP HEAT" col={COL.amber} out={248.3} />,
  <Stamp key="ck" t={t} at={A.cook + 0.2} text="COOKED COMPRESSOR" x={960} y={860} rot={-6} size={84} out={248.3} />,
  <Toggle key="tg2" t={t} at={A.pOut - 0.15} flipAt={A.pBack - 0.1} out={253.2} a={["POWER OUT", "JACKET ON"]} b={["POWER BACK", "JACKET OFF"]} x={1440} />,
  // 4
  <StepTitle key="st3" t={t} at={A.step3 + 0.15} n={3} name="THE DOOR RULE" out={A.step3 + 2.5} />,
  <Tag key="sp" t={t} at={A.spills + 0.2} x={960} y={780} dx={200} dy={-150} text="COLD SPILLS OUT" col={COL.ice} out={264.4} />,
  <DoorCounter key="dc" t={t} at={A.ten} out={A.thrown + 1.6} />,
  <Price key="p10" t={t} at={A.d10 - 0.1} x={1500} y={260} item="FOAM COOLER" $={10} out={A.morning - 0.3} />,
  <Words key="ot" t={t} items={[{ at: A.oneTime - 0.1, txt: "ONCE A DAY", col: COL.ice }]} out={280.2} y={170} size={100} />,
  <CheckList key="cl" t={t} title="TODAY'S COOLER" rows={[{ at: A.milk, txt: "MILK" }, { at: A.eggs + 0.2, txt: "EGGS" }, { at: A.lunch, txt: "LUNCH MEAT" }, { at: A.yogurt, txt: "YOGURT" }, { at: A.insulin, txt: "INSULIN" }, { at: A.inCooler + 0.6, txt: "1 FRIDGE JUG" }]} out={A.close - 0.2} />,
  <Timer key="tm" t={t} at={A.oneOpen - 0.1} out={297} label="ONE OPENING" />,
  <Words key="bc" t={t} items={[{ at: A.becomes + 0.2, txt: "COOLER = TODAY'S FRIDGE" }]} out={A.step4 - 0.3} y={900} size={78} />,
  <StepTitle key="st4" t={t} at={A.step4 + 0.05} n={4} name="THE SWAP" out={302.0} col={COL.ice} />,
  <Tag key="ts2" t={t} at={A.topShelf} x={1000} y={360} dx={200} dy={-120} text="TOP SHELF" col={COL.ice} out={A.falls - 0.4} />,
  <Words key="cf" t={t} items={[{ at: A.falls, txt: "COLD FALLS ↓", col: COL.ice }]} out={313.1} y={150} size={110} />,
  <Words key="dd" t={t} items={[{ at: A.second, txt: "MORNING 2" }, { at: A.third, txt: "MORNING 3", col: COL.ice }]} out={A.thermo - 0.4} y={160} size={96} />,
  <Price key="p8" t={t} at={A.d8 - 0.6} x={1500} y={260} item="WIRE THERMOMETER" $={8} out={333.9} />,
  <Tag key="wi" t={t} at={A.without - 0.6} x={900} y={560} dx={-180} dy={-160} text="THIN WIRE" sub="THROUGH THE SEAL" col={COL.ice} out={A.never - 0.4} />,
  <Stamp key="nv" t={t} at={A.never + 0.2} text="NEVER OPEN TO CHECK" x={960} y={880} rot={-5} size={78} out={A.real - 0.2} />,
  <TempChart key="tc" t={t} at={A.real} pts={[{ at: A.t37, v: 37, lab: "POWER OUT" }, { at: A.t38, v: 38, lab: "DAY 1" }, { at: A.t39, v: 39, lab: "DAY 2" }, { at: A.t40, v: 40, lab: "DAY 3" }]} nb={{ at: A.t58, v: 58 }} out={367.6} />,
  <Tag key="sf" t={t} at={A.hard + 0.2} x={980} y={520} dx={200} dy={-150} text="STILL FROZEN SOLID" col={COL.ice} out={361.7} />,
  // 5
  <BigNum key="58" t={t} at={A.kept - 0.1} text="58°F" x={1500} y={280} size={160} col={COL.red} edge="#4a0d08" sub="NEIGHBOR · DAY 1" out={A.killed + 1.2} />,
  <Receipt key="rc" t={t} rows={[{ at: A.rSalt, item: "ROCK SALT", $: 5 }, { at: A.rSilver, item: "SILVER WRAP", $: 25 }, { at: A.rBlanket, item: "BLANKET", $: 12 }, { at: A.rCooler, item: "FOAM COOLER", $: 10 }, { at: A.rThermo, item: "THERMOMETER", $: 8 }]} totalAt={A.r60} x={1170} y={95} sc={1.4} out={A.gen - 0.35} />,
  <BigNum key="500" t={t} at={A.gen + 0.3} text="$400-500" x={1380} y={250} size={140} col={COL.red} edge="#4a0d08" sub="CHEAP GENERATOR" out={396.8} />,
  <Chips key="gn" t={t} at={A.gas} items={["+ GAS", "+ NOISE", "+ FUMES"]} out={396.8} y={760} />,
  <BigNum key="mt" t={t} at={A.more - 0.3} text="EVEN MORE" x={1400} y={300} size={110} col={COL.amber} sub="BATTERY + INVERTER" out={401.7} />,
  <Words key="nb" t={t} items={[{ at: A.never2, txt: "NOTHING TO BREAK", col: COL.ice }]} out={A.mistakes - 0.2} y={540} size={120} />,
  <MistakesDeal key="md" t={t} at={A.mistakes} out={A.m1 - 0.25} />,
  <Mistake key="m1" t={t} at={A.m1 + 0.2} n={1} txt="OPENING TO CHECK" out={A.readWire + 0.6} />,
  <Mistake key="m2" t={t} at={A.m2 + 0.2} n={2} txt="PUTTING WARM FOOD IN" out={A.m3 - 0.3} />,
  <Tag key="lh" t={t} at={A.heater - 0.3} x={960} y={440} dx={200} dy={-140} text="A LITTLE HEATER" col={COL.amber} out={A.m3 - 0.3} />,
  <Mistake key="m3" t={t} at={A.m3 + 0.2} n={3} txt="JACKET ON, POWER BACK" out={A.m4 - 0.3} />,
  <Mistake key="m4" t={t} at={A.m4 + 0.2} n={4} txt="JUGS FILLED TO THE TOP" out={435.4} />,
  <Words key="gr" t={t} items={[{ at: A.grows, txt: "WATER GROWS ~9%", col: COL.ice }, { at: A.split, txt: "→ SPLIT JUG", col: COL.red }]} out={435.4} y={170} size={84} />,
  <Mistake key="m5" t={t} at={A.m5 + 0.2} n={5} txt="WAITING FOR THE STORM" out={A.calm - 0.4} />,
  <Stamp key="dn" t={t} at={A.calm - 0.1} text="DO IT NOW" x={1440} y={260} rot={-7} size={110} out={447.5} />,
  <RuleCard key="rl" t={t} at={A.over40 - 0.1} at2={A.twoHrs} at3={A.trash} out={A.smells - 1.2} />,
  <Stamp key="wd" t={t} at={A.doubt} text="WHEN IN DOUBT, THROW IT OUT" x={960} y={180} rot={-4} size={66} out={A.myRule - 0.2} />,
  <Words key="tr" t={t} items={[{ at: A.myRule, txt: "NOT MY RULE." }, { at: A.theRule, txt: "THE RULE.", col: COL.red }]} out={466.9} y={880} size={84} />,
  <Chips key="rcp" t={t} at={A.wWater - 0.05} items={["WATER", "SALT", "A COAT", "A COOLER", "DISCIPLINE"]} out={A.bought - 1.6} y={720} />,
  <Words key="ng" t={t} items={[{ at: A.neverGet - 0.1, txt: "NEVER GET THERE" }]} out={A.wWater - 0.3} y={170} size={100} />,
  <Words key="ns" t={t} items={[{ at: A.started - 0.1, txt: "NEVER STARTED", col: COL.amber }]} out={484.4} y={880} size={84} />,
  <BigNum key="s6" t={t} at={A.sameSix} text="SAME 6 JUGS" x={1400} y={230} size={100} col={COL.ice2} edge="#1d3a52" out={A.subscribe - 0.2} />,
  <NextCard key="nx" t={t} at={A.subscribe - 0.1} subAt={A.subscribe + 0.1} out={498.6}><AbsoluteFill style={{ background: "#111" }}><Clip k="s38" a={A.nextTime - 0.2} z={[1.0, 1.06]} /></AbsoluteFill></NextCard>,
  <LowerThird key="lt" t={t} at={A.imGary - 0.1} out={TEND - 0.6} name="GARY" l2="SEE YOU IN THE NEXT ONE" l2at={A.seeYou} />,
];

// tabla para revisar (scripts/gary_beats.mts): base, inicio, largo
// tomas para la mezcla: cada CL arranca su audio nativo en `a` y suena hasta el próximo beat
export const clipPlan = () => BEATS.map((b, i) => ({ k: b.k, a: +b.a.toFixed(3), dur: +((BEATS[i + 1]?.a ?? TEND) - b.a).toFixed(3) })).filter((x) => x.k);
export const beatTable = () => BEATS.map((b, i) => ({ i, a: +b.a.toFixed(2), dur: +((BEATS[i + 1]?.a ?? TEND) - b.a).toFixed(2), tr: b.tr, src: String(b.r).match(/k: "?(s\d+)|"(s\d+)"/)?.[0] ?? "" }));

export const Rest: React.FC = () => {
  const t = useCurrentFrame() / 30;
  if (t < T0 - 0.001) return null;
  let i = 0; while (i < BEATS.length - 1 && BEATS[i + 1].a <= t) i++;
  const b = BEATS[i], D = DUR[b.tr], k = D > 0 ? (t - b.a) / D : 1;
  const base = i > 0 && k < 1 ? transition(b.tr, k, BEATS[i - 1].r(t), b.r(t), b.p ?? [960, 540]) : [<AbsoluteFill key="b">{b.r(t)}</AbsoluteFill>];
  const fin = 1 - e(t, TEND - 0.7, TEND - 0.05);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fin }}>
        {base}
        {pieces(t)}
      </AbsoluteFill>
      <Flash t={t} at={T0 + 0.02} peak={0.7} w={0.35} />
    </AbsoluteFill>
  );
};
