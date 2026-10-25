// enrm05 · «6 Rules for 300,000 Miles» · EL VIDEO ENTERO (un solo hilo). La base es la lista de planos (segs.json) que
// plan_enrm05.py arma a mano anclando cada plano a la frase de ese segundo (at() sobre words.json): el taller 3D de Ramón
// (Treviño Auto Repair), el avatar en cada ventana del reel, las fotos de Ramón haciendo lo que cuenta, los clips LTX y los de
// agnes, unidos por portal / barrido / iris / zoom. Encima, las piezas 2D (ov.json) de su frase. Todo con cámara a mano.
// Audio fuera de Remotion (voz + sonido nativo de los clips + foley suave se mezclan en mix_enrm.py → encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, screenOf } from "./taller3d";
import { BigNum, COL, Chips, DrawX, Flash, LowerThird, P, Portal, Tag, e, ei, s } from "./lib";
import { Comment } from "./rest2d";
import { GuideCTA } from "./guia";
import { Stamp } from "./piezas";
import { MapaSA, Contador } from "./ramon2d";
import { Chapter, LotPrice, Cardboard, ThreeParts, CVT, DCT, Rings, Quarts, Puddles, DotCode, Scanner, WebCard, FloodLine, FloodRoute, Quote, TenMin, PriceDrop, DriveTimer } from "./piezas_r4";
import { Notebook, Schedules, BoilPoint, HalfLife, MoneyBars, TireTemp } from "./piezas_r5";
import { CamaraMano } from "../kits/camara/CamaraMano";
import SEGS from "./segs.json";
import OV from "./ov.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

const AV = AVAIL as { reel: boolean; reelLen: number; end: number };
export const FULL_END = AV.end;
export const WIN: { ms: number; me: number; off: number }[] = (AVW as { win: { ms: number; me: number; off: number }[] }).win;

// ---------- avatar (una Sequence por ventana del reel; la vecina queda montada en las transiciones → nunca cuadro negro) ----------
export const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const cur = WIN.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : WIN.findIndex((w) => t >= w.ms - 0.4 && t < w.me + 0.8);
  const RL = AV.reelLen;
  const face = AV.reel ? <>{WIN.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 12)} durationInFrames={s(w.me - w.ms) + 12 + 26} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><Freeze frame={s(RL) - Math.max(0, s(w.off) - 12)} active={(f) => f > s(RL) - Math.max(0, s(w.off) - 12)}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 12)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><CamaraMano intensidad={0.8} seed={3}>{face}</CamaraMano></AbsoluteFill>;
};

// foto (empuje lento) o clip (LTX / agnes) que corre desde su cuadro 0 al entrar; si el plano dura más que el clip, queda en su último cuadro
const Shot: React.FC<{ g: SegJ; t: number }> = ({ g, t }) => {
  const a = g.a, z = g.z ?? [1.03, 1.12], q = e(t, a, a + 8), sc = z[0] + (z[1] - z[0]) * q;
  const media = g.k === "clip"
    ? <Sequence from={s(a) - 10} layout="none"><Freeze frame={s(g.len ?? 5) - 2} active={(f) => f > s(g.len ?? 5) - 2}><OffthreadVideo src={staticFile(g.src!)} startFrom={s(g.from ?? 0)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></Sequence>
    : <Img src={staticFile(g.src!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#0b0e12" }}><CamaraMano intensidad={0.9} seed={Math.round(a)}><AbsoluteFill style={{ transform: `scale(${sc}) translate(${(g.ox ?? 0) * q}px, ${(g.oy ?? 0) * q}px)` }}>{media}</AbsoluteFill></CamaraMano></AbsoluteFill>;
};

type Tr = "cut" | "swipeL" | "swipeR" | "up" | "down" | "portal" | "iris" | "zoom" | "fade" | "wipe";
type SegJ = { a: number; k: "w" | "av" | "img" | "clip" | "bk"; src?: string; len?: number; from?: number; tr?: Tr; px?: number; py?: number; pt?: keyof typeof PT; z?: [number, number]; ox?: number; oy?: number };
const SG = SEGS as SegJ[];
const D = 0.36;

const Base: React.FC<{ g: SegJ; t: number }> = ({ g, t }) => {
  if (g.k === "w") return <WorldRaw t={t} />;
  if (g.k === "av") return <Avatar t={t} />;
  if (g.k === "img" || g.k === "clip") return <Shot g={g} t={t} />;
  // fondo de las piezas grandes: una foto REAL del taller, empuje lento y oscurecida (sin blur)
  const q = Math.min(1, Math.max(0, (t - g.a) / 14));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0b0e12" }}>
      {g.src ? <Img src={staticFile(g.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.06 * q})` }} /> : <WorldRaw t={g.a + Math.max(0, t - g.a) * 0.15} />}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(8,12,20,.45), rgba(4,6,10,.86) 75%)" }} />
    </AbsoluteFill>
  );
};

const Trans: React.FC<{ t: number; g: SegJ; from: React.ReactNode; to: React.ReactNode }> = ({ t, g, from, to }) => {
  const k = ei(t, g.a, g.a + D), tr = g.tr ?? "fade";
  let px = g.px ?? 960, py = g.py ?? 540;
  if (g.pt) { const q = screenOf(g.a, PT[g.pt]); px = Math.max(80, Math.min(1840, q.x)); py = Math.max(80, Math.min(1000, q.y)); }
  if (tr === "swipeL" || tr === "swipeR" || tr === "up" || tr === "down") {
    const dir = tr === "swipeL" || tr === "up" ? 1 : -1, ax = tr === "up" || tr === "down" ? "Y" : "X", DD = ax === "Y" ? 1080 : 1920;
    return <AbsoluteFill><AbsoluteFill style={{ transform: `translate${ax}(${-dir * k * DD}px)` }}>{from}</AbsoluteFill><AbsoluteFill style={{ transform: `translate${ax}(${dir * (1 - k) * DD}px)` }}>{to}</AbsoluteFill></AbsoluteFill>;
  }
  if (tr === "portal") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><Portal x={px} y={py} r={k}>{to}</Portal></AbsoluteFill>;
  if (tr === "iris") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><AbsoluteFill style={{ clipPath: `circle(${k * 1150}px at ${px}px ${py}px)` }}>{to}</AbsoluteFill><Flash t={t} at={g.a + 0.02} col="#fff1cf" peak={0.3} w={0.3} /></AbsoluteFill>;
  if (tr === "wipe") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><AbsoluteFill style={{ clipPath: `inset(0 0 ${(1 - k) * 100}% 0)` }}>{to}</AbsoluteFill></AbsoluteFill>;
  if (tr === "zoom") return <AbsoluteFill><AbsoluteFill style={{ transform: `scale(${0.94 + 0.06 * k})` }}>{to}</AbsoluteFill><AbsoluteFill style={{ opacity: 1 - k, transform: `scale(${1 + k * 0.35})` }}>{from}</AbsoluteFill></AbsoluteFill>;
  if (tr === "cut") return <>{to}</>;
  return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><AbsoluteFill style={{ opacity: k }}>{to}</AbsoluteFill></AbsoluteFill>;
};

// ---------- piezas encima (ov.json) ----------
type O = { k: string; a: number; b: number; [x: string]: unknown };
const OVS = OV as O[];
const Piece: React.FC<{ o: O; t: number }> = ({ o, t }) => {
  const p = o as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  switch (o.k) {
    case "tag": { const q = p.pt ? screenOf(t, PT[p.pt as keyof typeof PT]) : { x: p.x, y: p.y }; return <Tag t={t} at={o.a} out={o.b} x={q.x} y={q.y} dx={p.dx ?? 140} dy={p.dy ?? -110} text={p.text} sub={p.sub} col={p.col} size={p.size ?? 50} />; }
    case "big": return <BigNum t={t} at={o.a} out={o.b} text={p.text} sub={p.sub} x={p.x} y={p.y} size={p.size ?? 220} col={p.col} />;
    case "stamp": return <Stamp t={t} at={o.a} out={o.b} text={p.text} x={p.x ?? 960} y={p.y ?? 540} size={p.size ?? 100} col={p.col} rot={p.rot} />;
    case "chips": return <Chips t={t} at={o.a} out={o.b} items={p.items} y={p.y} />;
    case "guia": return <GuideCTA t={t} at={o.a} out={o.b} pag={p.pag} note={p.note} />;
    case "comment": return <Comment t={t} at={o.a} typeAt={p.typeAt ?? o.a + 0.4} out={o.b} text={p.text} x={p.x ?? 960} y={p.y ?? 860} />;
    case "lower": return <LowerThird t={t} at={o.a} out={o.b} name={p.name} l2={p.l2} l2at={o.a + 0.5} />;
    case "x": return <DrawX t={t} at={o.a} x={p.x} y={p.y} w={p.w} h={p.h} />;
    case "map": return <MapaSA t={t} at={o.a} out={o.b} pins={p.pins} route={p.route} x={p.x} y={p.y} sc={p.sc} title={p.title} />;
    case "count": return <Contador t={t} at={o.a} out={o.b} from={p.from} to={p.to} dur={p.dur} pre={p.pre} suf={p.suf} sub={p.sub} x={p.x} y={p.y} size={p.size} col={p.col} />;
    case "chapter": return <Chapter t={t} at={o.a} out={o.b} n={p.n} title={p.title} sub={p.sub} kicker={p.kicker} />;
    case "lotprice": return <LotPrice t={t} at={o.a} out={o.b} price={p.price} items={p.items} x={p.x} y={p.y} />;
    case "cardboard": return <Cardboard t={t} at={o.a} out={o.b} rows={p.rows} totalAt={p.totalAt} total={p.total} carAt={p.carAt} car={p.car} x={p.x} y={p.y} />;
    case "threeparts": return <ThreeParts t={t} at={o.a} out={o.b} items={p.items} rentAt={p.rentAt} />;
    case "cvt": return <CVT t={t} at={o.a} out={o.b} heatAt={p.heatAt} slipAt={p.slipAt} x={p.x} y={p.y} sc={p.sc} />;
    case "dct": return <DCT t={t} at={o.a} out={o.b} dryAt={p.dryAt} x={p.x} y={p.y} />;
    case "rings": return <Rings t={t} at={o.a} out={o.b} clogAt={p.clogAt} oilAt={p.oilAt} x={p.x} y={p.y} />;
    case "quarts": return <Quarts t={t} at={o.a} out={o.b} dur={p.dur} x={p.x} y={p.y} />;
    case "puddles": return <Puddles t={t} out={o.b} items={p.items} />;
    case "dot": return <DotCode t={t} at={o.a} out={o.b} code={p.code} splitAt={p.splitAt} ruleAt={p.ruleAt} />;
    case "scanner": return <Scanner t={t} at={o.a} out={o.b} monAt={p.monAt} notAt={p.notAt} x={p.x} y={p.y} />;
    case "web": return <WebCard t={t} at={o.a} out={o.b} url={p.url} title={p.title} lines={p.lines} x={p.x} y={p.y} />;
    case "flood": return <FloodLine t={t} at={o.a} out={o.b} riseAt={p.riseAt} dryAt={p.dryAt} x={p.x} y={p.y} />;
    case "route": return <FloodRoute t={t} at={o.a} out={o.b} countAt={p.countAt} goAt={p.goAt} />;
    case "quote": return <Quote t={t} at={o.a} out={o.b} text={p.text} who={p.who} x={p.x} y={p.y} w={p.w} />;
    case "tenmin": return <TenMin t={t} at={o.a} out={o.b} rows={p.rows} title={p.title} />;
    case "drop": return <PriceDrop t={t} at={o.a} out={o.b} v={p.v} label={p.label} col={p.col} x={p.x} y={p.y} />;
    case "notebook": return <Notebook t={t} at={o.a} out={o.b} rows={p.rows} title={p.title} x={p.x} y={p.y} rot={p.rot} />;
    case "schedules": return <Schedules t={t} at={o.a} out={o.b} items={p.items} pickAt={p.pickAt} />;
    case "boil": return <BoilPoint t={t} at={o.a} out={o.b} capAt={p.capAt} weakAt={p.weakAt} x={p.x} y={p.y} />;
    case "halflife": return <HalfLife t={t} at={o.a} out={o.b} hotAt={p.hotAt} x={p.x} y={p.y} />;
    case "money": return <MoneyBars t={t} at={o.a} out={o.b} newAt={p.newAt} />;
    case "tiretemp": return <TireTemp t={t} at={o.a} out={o.b} hotAt={p.hotAt} x={p.x} y={p.y} />;
    case "drive": return <DriveTimer t={t} at={o.a} out={o.b} from={p.from} to={p.to} flipAt={p.flipAt} x={p.x} y={p.y} />;
    default: return null;
  }
};

export const Main: React.FC = () => {
  const t = useCurrentFrame() / 30;
  let i = 0; while (i < SG.length - 1 && SG[i + 1].a <= t) i++;
  const g = SG[i], prev = SG[Math.max(0, i - 1)];
  const inTr = i > 0 && t < g.a + D && g.tr !== "cut";
  return (
    <AbsoluteFill style={{ background: "#0b0e12" }}>
      {inTr ? <Trans t={t} g={g} from={<Base g={prev} t={t} />} to={<Base g={g} t={t} />} /> : <Base g={g} t={t} />}
      {OVS.filter((o) => t >= o.a - 0.3 && t < o.b + 0.6).map((o, j) => <Piece key={j} o={o} t={t} />)}
      <AbsoluteFill style={{ background: "#000", opacity: e(t, FULL_END - 0.9, FULL_END), pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
export { COL };
