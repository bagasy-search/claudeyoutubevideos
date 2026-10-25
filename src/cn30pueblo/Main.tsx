// cn30pueblo · EL VIDEO ENTERO (un solo hilo). La base es una lista de segmentos (segs.json) que plan.py arma anclando cada
// plano a la frase que se dice en ese segundo (at() sobre words.json): el pueblo 3D de Chencho, el avatar en cada ventana
// del reel, las fotos de Chencho haciendo lo que cuenta y los clips, unidos por portal / barrido / iris / zoom. Encima,
// las piezas 2D (ov.json), cada una con su frase. Avatar, fotos y clips con cámara a mano; el mundo con la cámara 3D
// por llaves (cam.json). Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World, PT, screenOf, setKeys, Key } from "./pueblo3d";
import { BigNum, Chips, DrawX, Flash, LowerThird, P, Portal, Tag, e, ei, s } from "./lib";
import { Comment, ErrorCard, KitTray, MaxTimer, Recap, Routine, StepPlate } from "./rest2d";
import { Billete, Cuenta, Guia, Pestana, Precio, Sello } from "./cn";
import { CamaraMano } from "./CamaraMano";
import SEGS from "./segs.json";
import OV from "./ov.json";
import CAM from "./cam.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";

setKeys((CAM as { keys: Key[] }).keys);
const AV = AVAIL as { reelLen: number; clips: string[]; clipLen?: Record<string, number>; end: number };
export const FULL_END = AV.end;
const CLIPS = new Set(AV.clips);
const REEL = "av/cn30pueblo/reel0.mp4";
export const WIN: { ms: number; me: number; off: number }[] = (AVW as { win: { ms: number; me: number; off: number }[] }).win;

// ---------- avatar (una Sequence por ventana del reel; la vecina queda montada en las transiciones → nunca cuadro negro) ----------
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  const cur = WIN.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : WIN.findIndex((w) => t >= w.ms - 0.4 && t < w.me + 0.8);
  const RL = AV.reelLen;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><CamaraMano intensidad={0.8} seed={3}>{WIN.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 12)} durationInFrames={s(w.me - w.ms) + 12 + 26} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><Freeze frame={s(RL) - Math.max(0, s(w.off) - 12)} active={(f) => f > s(RL) - Math.max(0, s(w.off) - 12) - 1}><OffthreadVideo src={staticFile(REEL)} startFrom={Math.max(0, s(w.off) - 12)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></AbsoluteFill>
    </Sequence>))}</CamaraMano></AbsoluteFill>;
};

// foto (cuadro clave) o clip con empuje lento propio
const Shot: React.FC<{ id: string; t: number; a: number; z?: [number, number]; ox?: number; oy?: number }> = ({ id, t, a, z = [1.03, 1.13], ox = 0, oy = 0 }) => {
  const q = e(t, a, a + 8), sc = z[0] + (z[1] - z[0]) * q;
  const clip = CLIPS.has(id), L = AV.clipLen?.[id] ?? 3;
  const media = clip
    ? <Sequence from={s(a) - 12} layout="none"><Freeze frame={s(L) - 2} active={(f) => f > s(L) - 2}><OffthreadVideo src={staticFile(P + "c_" + id + ".mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></Sequence>
    : <Img src={staticFile(P + "i_" + id + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#0b0907" }}><CamaraMano intensidad={0.9} seed={Math.round(a)}><AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q}px, ${oy * q}px)` }}>{media}</AbsoluteFill></CamaraMano></AbsoluteFill>;
};

type Tr = "cut" | "swipeL" | "swipeR" | "up" | "down" | "portal" | "iris" | "zoom" | "fade" | "wipe";
type WP = { porton?: number; dusk?: number; bell?: number; stones?: number };
type SegJ = { a: number; k: "w" | "av" | "img" | "bk"; id?: string; tr?: Tr; pt?: keyof typeof PT; z?: [number, number]; ox?: number; oy?: number; wp?: WP };
const SG = SEGS as SegJ[];
const D = 0.36;

const Base: React.FC<{ g: SegJ; t: number }> = ({ g, t }) => {
  if (g.k === "w") return <World t={t} {...(g.wp ?? {})} />;
  if (g.k === "av") return <Avatar t={t} />;
  if (g.k === "img") return <Shot id={g.id!} t={t} a={g.a} z={g.z} ox={g.ox} oy={g.oy} />;
  // fondo de las piezas grandes: el mismo pueblo, cámara casi quieta y oscurecida (sin blur)
  return <AbsoluteFill>
    <World t={g.a + Math.max(0, t - g.a) * 0.15} {...(g.wp ?? {})} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(20,12,6,.45), rgba(10,6,3,.85) 75%)" }} />
  </AbsoluteFill>;
};

const Trans: React.FC<{ t: number; g: SegJ; from: React.ReactNode; to: React.ReactNode }> = ({ t, g, from, to }) => {
  const k = ei(t, g.a, g.a + D), tr = g.tr ?? "fade";
  let px = 960, py = 540;
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
    case "big": return <BigNum t={t} at={o.a} out={o.b} text={p.text} sub={p.sub} x={p.x} y={p.y} size={p.size ?? 200} col={p.col} />;
    case "sello": return <Sello t={t} at={o.a} out={o.b} text={p.text} x={p.x} y={p.y} size={p.size} col={p.col} rot={p.rot} />;
    case "step": return <StepPlate t={t} at={o.a} out={o.b} n={p.n} tx={p.tx} x={p.x} y={p.y} />;
    case "err": return <ErrorCard t={t} at={o.a} out={o.b} n={p.n} tx={p.tx} />;
    case "timer": return <MaxTimer t={t} at={o.a} out={o.b} x={p.x ?? 1500} y={p.y ?? 300} label={p.label} sub={p.sub} col={p.col} />;
    case "kit": return <KitTray t={t} out={o.b} items={p.items} y={p.y} />;
    case "chips": return <Chips t={t} at={o.a} out={o.b} items={p.items} y={p.y} />;
    case "recap": return <Recap t={t} out={o.b} rows={p.rows} />;
    case "routine": return <Routine t={t} out={o.b} rows={p.rows} hl={-1} />;
    case "comment": return <Comment t={t} at={o.a} typeAt={o.a + 0.4} out={o.b} text={p.text} x={p.x ?? 960} y={p.y ?? 860} />;
    case "lower": return <LowerThird t={t} at={o.a} out={o.b} name={p.name} l2={p.l2} l2at={o.a + 0.5} />;
    case "x": return <DrawX t={t} at={o.a} x={p.x} y={p.y} w={p.w} h={p.h} />;
    case "pest": return <Pestana t={t} at={o.a} out={o.b} n={p.n} title={p.title} kicker={p.kicker} />;
    case "precio": return <Precio t={t} at={o.a} out={o.b} yo={p.yo} afuera={p.afuera} lyo={p.lyo} lafuera={p.lafuera} x={p.x} y={p.y} />;
    case "cuenta": return <Cuenta t={t} at={o.a} out={o.b} title={p.title} rows={p.rows} total={p.total} totalAt={p.totalAt} x={p.x} y={p.y} sc={p.sc} />;
    case "guia": return <Guia t={t} at={o.a} out={o.b} libro={p.libro} page={p.page} openAt={p.openAt} zoomAt={p.zoomAt} pg={p.pg} />;
    case "billete": return <Billete t={t} at={o.a} out={o.b} v={p.v} resta={p.resta} x={p.x} y={p.y} />;
    default: return null;
  }
};

export const Main: React.FC = () => {
  const t = useCurrentFrame() / 30;
  let i = 0; while (i < SG.length - 1 && SG[i + 1].a <= t) i++;
  const g = SG[i], prev = SG[Math.max(0, i - 1)];
  const inTr = i > 0 && t < g.a + D && g.tr !== "cut";
  return (
    <AbsoluteFill style={{ background: "#0b0907" }}>
      {inTr ? <Trans t={t} g={g} from={<Base g={prev} t={t} />} to={<Base g={g} t={t} />} /> : <Base g={g} t={t} />}
      {OVS.filter((o) => t >= o.a - 0.3 && t < o.b + 0.6).map((o, j) => <Piece key={j} o={o} t={t} />)}
      <AbsoluteFill style={{ background: "#000", opacity: e(t, FULL_END - 0.9, FULL_END), pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
