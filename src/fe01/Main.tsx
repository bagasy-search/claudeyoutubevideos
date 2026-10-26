// fe01 · «Lo que pasa en el panteón cuando todos se van del entierro» (Don Ernesto, el Funerario) · EL VIDEO ENTERO (un solo hilo). La base es la lista de planos (segs.json) que
// plan_fe01.py arma a mano anclando cada plano a la frase de ese segundo (at() sobre words.json): el avatar en cada ventana del reel, las fotos de Ramón haciendo lo que cuenta, los clips LTX y los de
// agnes, unidos por portal / barrido / iris / zoom. Encima, las piezas 2D (ov.json) de su frase. Todo con cámara a mano.
// Audio fuera de Remotion (voz + sonido nativo de los clips + foley suave se mezclan en mix_fe01.py → encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BigNum, COL, Chips, DrawX, Flash, LowerThird, P, Portal, Tag, e, ei, s } from "./lib";
import { Comment } from "./rest2d";
import { GuideCTA } from "./guia";
import { Stamp } from "./piezas";
import { Ficha, Mapa, Recibo, Refrendo, Cuenta, FotoVieja, Capitulo, Dicho, Lugar } from "./funerario";
import { Quote } from "./piezas_r4";
import { Recap } from "./rest2d";
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
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><Freeze frame={s(RL) - Math.max(0, s(w.off) - 12)} active={(f) => f > s(RL) - Math.max(0, s(w.off) - 12)}><OffthreadVideo src={staticFile("av/fe01/reel0.mp4")} startFrom={Math.max(0, s(w.off) - 12)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><CamaraMano intensidad={0.8} seed={3}>{face}</CamaraMano></AbsoluteFill>;
};

// foto (empuje lento) o clip (LTX / agnes) que corre desde su cuadro 0 al entrar; si el plano dura más que el clip, queda en su último cuadro
const Shot: React.FC<{ g: SegJ; t: number }> = ({ g, t }) => {
  const a = g.a, z = g.z ?? [1.03, 1.12], q = e(t, a, a + 8), sc = z[0] + (z[1] - z[0]) * q;
  const media = g.k === "clip"
    ? <Sequence from={s(a) - 10} layout="none"><Freeze frame={s(g.len ?? 5) - 2} active={(f) => f > s(g.len ?? 5) - 2}><OffthreadVideo src={staticFile(g.src!)} startFrom={s(g.from ?? 0)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></Sequence>
    : <Img src={staticFile(g.src!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#0f0d0b" }}><CamaraMano intensidad={0.9} seed={Math.round(a)}><AbsoluteFill style={{ transform: `scale(${sc}) translate(${(g.ox ?? 0) * q}px, ${(g.oy ?? 0) * q}px)` }}>{media}</AbsoluteFill></CamaraMano></AbsoluteFill>;
};

type Tr = "cut" | "swipeL" | "swipeR" | "up" | "down" | "portal" | "iris" | "zoom" | "fade" | "wipe";
type SegJ = { a: number; k: "av" | "img" | "clip" | "bk"; src?: string; len?: number; from?: number; tr?: Tr; px?: number; py?: number; z?: [number, number]; ox?: number; oy?: number };
const SG = SEGS as SegJ[];
const D = 0.36;

const Base: React.FC<{ g: SegJ; t: number }> = ({ g, t }) => {
  if (g.k === "av") return <Avatar t={t} />;
  if (g.k === "img" || g.k === "clip") return <Shot g={g} t={t} />;
  // fondo de las piezas grandes: una foto REAL del taller, empuje + balanceo lento y oscurecida (sin blur); nunca queda quieto aunque la pieza ya esté armada
  const u = Math.min(9, Math.max(0, t - g.a)), fl = 0.035 * Math.sin(u * 2.3) + 0.02 * Math.sin(u * 5.1 + 1.3);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0f0d0b" }}>
      {g.src ? <CamaraMano intensidad={0.9} seed={Math.round(g.a)}><Img src={staticFile(g.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 + 0.02 * u}) translate(${-20 * u}px, ${-8 * u}px)` }} /></CamaraMano> : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(18,12,6,.45), rgba(10,7,4,.86) 75%)", opacity: 0.93 + fl }} />
    </AbsoluteFill>
  );
};

const Trans: React.FC<{ t: number; g: SegJ; from: React.ReactNode; to: React.ReactNode }> = ({ t, g, from, to }) => {
  const k = ei(t, g.a, g.a + D), tr = g.tr ?? "fade";
  let px = g.px ?? 960, py = g.py ?? 540;
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
    case "tag": return <Tag t={t} at={o.a} out={o.b} x={p.x} y={p.y} dx={p.dx ?? 140} dy={p.dy ?? -110} text={p.text} sub={p.sub} col={p.col} size={p.size ?? 50} />;
    case "big": return <BigNum t={t} at={o.a} out={o.b} text={p.text} sub={p.sub} x={p.x} y={p.y} size={p.size ?? 220} col={p.col} />;
    case "stamp": return <Stamp t={t} at={o.a} out={o.b} text={p.text} x={p.x ?? 960} y={p.y ?? 540} size={p.size ?? 100} col={p.col} rot={p.rot} />;
    case "chips": return <Chips t={t} at={o.a} out={o.b} items={p.items} y={p.y} />;
    case "guia": return <GuideCTA t={t} at={o.a} out={o.b} pag={p.pag} note={p.note} />;
    case "comment": return <Comment t={t} at={o.a} typeAt={p.typeAt ?? o.a + 0.4} out={o.b} text={p.text} x={p.x ?? 960} y={p.y ?? 860} />;
    case "lower": return <LowerThird t={t} at={o.a} out={o.b} name={p.name} l2={p.l2} l2at={o.a + 0.5} />;
    case "x": return <DrawX t={t} at={o.a} x={p.x} y={p.y} w={p.w} h={p.h} />;
    case "quote": return <Quote t={t} at={o.a} out={o.b} text={p.text} who={p.who} x={p.x} y={p.y} w={p.w} />;
    case "recap": return <Recap t={t} rows={p.rows} out={o.b} />;
    case "ficha": return <Ficha t={t} at={o.a} out={o.b} kicker={p.kicker} title={p.title} dato={p.dato} sub={p.sub} x={p.x} y={p.y} w={p.w} />;
    case "mapa": return <Mapa t={t} at={o.a} out={o.b} city={p.city} pins={p.pins} route={p.route} x={p.x} y={p.y} sc={p.sc} title={p.title} />;
    case "recibo": return <Recibo t={t} at={o.a} out={o.b} title={p.title} folio={p.folio} rows={p.rows} total={p.total} sello={p.sello} x={p.x} y={p.y} w={p.w} rot={p.rot} />;
    case "refrendo": return <Refrendo t={t} at={o.a} out={o.b} from={p.from} years={p.years} venceAt={p.venceAt} title={p.title} label={p.label} x={p.x} y={p.y} />;
    case "cuenta": return <Cuenta t={t} at={o.a} out={o.b} from={p.from} to={p.to} dur={p.dur} pre={p.pre} suf={p.suf} sub={p.sub} x={p.x} y={p.y} size={p.size} col={p.col} />;
    case "foto": return <FotoVieja t={t} at={o.a} out={o.b} src={p.src} pie={p.pie} x={p.x} y={p.y} w={p.w} rot={p.rot} />;
    case "cap": return <Capitulo t={t} at={o.a} out={o.b} n={p.n} title={p.title} sub={p.sub} kicker={p.kicker} />;
    case "dicho": return <Dicho t={t} at={o.a} out={o.b} text={p.text} who={p.who} x={p.x} y={p.y} w={p.w} />;
    case "lugar": return <Lugar t={t} at={o.a} out={o.b} tx={p.tx} sub={p.sub} />;
    default: return null;
  }
};

// luz de veladora sobre las piezas grandes: resplandor cálido que tiembla suave (la escala no queda nunca en un cuadro quieto)
const Veladora: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const u = t - a, fl = 0.5 + 0.22 * Math.sin(u * 11.3) + 0.16 * Math.sin(u * 17.9 + 2.1) + 0.12 * Math.sin(u * 4.7 + 0.6);
  const x = 30 + 4 * Math.sin(u * 0.9), y = 62 + 3 * Math.sin(u * 1.3 + 1);
  return <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "soft-light", opacity: 0.55 * fl * Math.min(1, u / 0.6),
    background: `radial-gradient(ellipse 70% 80% at ${x}% ${y}%, rgba(255,176,90,.9), rgba(255,150,60,.25) 55%, rgba(0,0,0,0) 85%)` }} />;
};

export const Main: React.FC = () => {
  const t = useCurrentFrame() / 30;
  let i = 0; while (i < SG.length - 1 && SG[i + 1].a <= t) i++;
  const g = SG[i], prev = SG[Math.max(0, i - 1)];
  const inTr = i > 0 && t < g.a + D && g.tr !== "cut";
  return (
    <AbsoluteFill style={{ background: "#0f0d0b" }}>
      {inTr ? <Trans t={t} g={g} from={<Base g={prev} t={t} />} to={<Base g={g} t={t} />} /> : <Base g={g} t={t} />}
      {OVS.filter((o) => t >= o.a - 0.3 && t < o.b + 0.6).map((o, j) => g.k === "bk"
        // pieza grande sobre fondo: la cámara se sigue acercando al documento mientras se lee (nunca queda un cuadro quieto)
        ? <AbsoluteFill key={j} style={{ transform: `scale(${1 + 0.011 * Math.min(5, Math.max(0, t - o.a))})` }}><Piece o={o} t={t} /></AbsoluteFill>
        : <Piece key={j} o={o} t={t} />)}
      {g.k === "bk" ? <Veladora t={t} a={g.a} /> : null}
      <AbsoluteFill style={{ background: "#000", opacity: e(t, FULL_END - 0.9, FULL_END), pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
export { COL };
