// fe02 · «Después de 40 años de funerario, estas son las 9 cosas que nunca pagaría» (Don Ernesto) · EL VIDEO ENTERO (un solo hilo).
// La base fuera del avatar es el MUNDO 3D (mundo3d.tsx: Funerales Navarro en corte) con UNA cámara que vuela entre estaciones;
// "bk" = el mismo mundo desenfocado y oscurecido detrás de una pieza grande. Encima, las piezas 2D/2.5D (ov.json) de su frase.
// ⛔ Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BigNum, COL, Chips, DrawX, Flash, LowerThird, P, Portal, Tag, e, ei, s } from "./lib";
import { Comment } from "./rest2d";
import { MundoFE, camBlur } from "./mundo3d";
import { Etiqueta, PlumaTacha, Balanza, Sobre, Lista } from "./piezas_fe02";
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
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><Freeze frame={s(RL) - Math.max(0, s(w.off) - 12)} active={(f) => f > s(RL) - Math.max(0, s(w.off) - 12)}><OffthreadVideo src={staticFile("av/fe02/reel0.mp4")} startFrom={Math.max(0, s(w.off) - 12)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><CamaraMano intensidad={0.8} seed={3}>{face}</CamaraMano></AbsoluteFill>;
};

// el MUNDO: un solo lienzo 3D; desenfoque por velocidad de cámara (tope 16 px) y, en "bk", desenfoque + oscurecido animados
const Mundo: React.FC<{ t: number; bk: number }> = ({ t, bk }) => {
  const mb = camBlur(t), bl = Math.min(16, mb * 0.6 + bk * 9);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1a1420" }}>
      <AbsoluteFill style={{ filter: bl > 0.15 ? `blur(${bl.toFixed(2)}px)` : undefined, transform: bk > 0 ? `scale(${1 + 0.04 * bk})` : undefined }}><MundoFE t={t} /></AbsoluteFill>
      {bk > 0 && <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(18,12,6,${0.35 * bk}), rgba(10,7,4,${0.78 * bk}) 75%)` }} />}
    </AbsoluteFill>
  );
};

type Tr = "cut" | "swipeL" | "swipeR" | "up" | "down" | "portal" | "iris" | "zoom" | "fade" | "wipe";
type SegJ = { a: number; k: "av" | "w" | "bk"; st?: string; tr?: Tr; fly?: number; px?: number; py?: number };
const SG = SEGS as SegJ[];
const D = 0.36;

// cuánto "bk" tiene el mundo en t (rampa de 0,5 s entre w y bk, sin segundo lienzo)
const bkAt = (t: number, i: number) => {
  const g = SG[i], p = SG[i - 1], on = g.k === "bk" ? 1 : 0;
  if (!p || p.k === "av") return on;
  const was = p.k === "bk" ? 1 : 0, k = e(t, g.a, g.a + 0.5);
  return was + (on - was) * k;
};
const Base: React.FC<{ g: SegJ; t: number; i: number }> = ({ g, t, i }) => g.k === "av" ? <Avatar t={t} /> : <Mundo t={t} bk={bkAt(t, i)} />;

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
    case "etiqueta": return <Etiqueta t={t} at={o.a} out={o.b} flipAt={p.flipAt} front={p.front} back={p.back} sub={p.sub} note={p.note} x={p.x} y={p.y} w={p.w} />;
    case "pluma": return <PlumaTacha t={t} at={o.a} out={o.b} title={p.title} rows={p.rows} total={p.total} x={p.x} y={p.y} w={p.w} />;
    case "balanza": return <Balanza t={t} at={o.a} out={o.b} left={p.left} right={p.right} lv={p.lv} rv={p.rv} tiltAt={p.tiltAt} x={p.x} y={p.y} w={p.w} />;
    case "sobre": return <Sobre t={t} at={o.a} out={o.b} text={p.text} who={p.who} openAt={p.openAt} x={p.x} y={p.y} w={p.w} />;
    case "lista": return <Lista t={t} at={o.a} out={o.b} title={p.title} sub={p.sub} rows={p.rows} hi={p.hi} hiAt={p.hiAt} x={p.x} y={p.y} w={p.w} />;
    default: return null;
  }
};

export const Main: React.FC = () => {
  const t = useCurrentFrame() / 30;
  let i = 0; while (i < SG.length - 1 && SG[i + 1].a <= t) i++;
  const g = SG[i], prev = SG[Math.max(0, i - 1)];
  // mundo→mundo nunca tiene transición 2D (la cámara vuela); sólo entre el avatar y el mundo
  const inTr = i > 0 && t < g.a + D && g.tr !== "cut" && (g.k === "av" || prev.k === "av");
  return (
    <AbsoluteFill style={{ background: "#0f0d0b" }}>
      {inTr ? <Trans t={t} g={g} from={<Base g={prev} t={t} i={i - 1} />} to={<Base g={g} t={t} i={i} />} /> : <Base g={g} t={t} i={i} />}
      {OVS.filter((o) => t >= o.a - 0.3 && t < o.b + 0.6).map((o, j) => <Piece key={j} o={o} t={t} />)}
      <AbsoluteFill style={{ background: "#000", opacity: e(t, FULL_END - 0.9, FULL_END), pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
export { COL };
