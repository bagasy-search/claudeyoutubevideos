// hector · EL VIDEO ENTERO, genérico para los 7 videos del canal. Cada video (src/enhcXX/Main.tsx) le pasa sus JSON:
// segs (la base: mundo / avatar / foto-clip / fondo de piezas, cada uno anclado con at() a la frase de ese segundo),
// ov (piezas 2D encima), cam + ev (cámara y eventos del mundo de la concesionaria), avwin + avail (reel y clips).
// Unión por portal / iris / barrido / zoom. Avatar, fotos y clips con cámara a mano; el mundo con manoCam en su cámara.
// Audio fuera de Remotion (encfin mezcla voz + foley). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World, PT, screenOf, Key, Ev, PtK } from "./dealer3d";
import { BigNum, DrawX, Flash, LowerThird, Chips, P, Portal, Tag, e, ei, s } from "./lib";
import { GuideCTA, QChapter, SayThis, FourSquare, LoanCompare, BuyersOrder, TilaBox, MiamiMap, YearStamp, QuoteCard, MoneyCounter, MenuBoard, Calc, Notebook, Checklist, LotClock, EndCard } from "./piezas";
import { CamaraMano } from "../kits/camara/CamaraMano";

export type Avail = { reel: boolean; reelLen: number; clips: string[]; clipLen?: Record<string, number>; rate?: Record<string, number>; off?: Record<string, number>; src?: Record<string, string>; end: number };
export type Win = { ms: number; me: number; off: number };
type Tr = "cut" | "swipeL" | "swipeR" | "up" | "down" | "portal" | "iris" | "zoom" | "fade" | "wipe";
export type SegJ = { a: number; k: "w" | "av" | "img" | "bk"; id?: string; tr?: Tr; px?: number; py?: number; pt?: PtK; z?: [number, number]; ox?: number; oy?: number };
export type O = { k: string; a: number; b: number; [x: string]: unknown };
export type Data = { segs: SegJ[]; ov: O[]; cam: Key[]; ev: Ev; win: Win[]; av: Avail };
const D = 0.36;

const Avatar: React.FC<{ t: number; d: Data }> = ({ t, d }) => {
  const W = d.win, cur = W.findIndex((w) => t >= w.ms - 0.02 && t < w.me);
  const vis = cur >= 0 ? cur : W.findIndex((w) => t >= w.ms - 0.4 && t < w.me + 0.8);
  const RL = d.av.reelLen;
  const face = d.av.reel ? <>{W.map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 12)} durationInFrames={s(w.me - w.ms) + 12 + 26} layout="none">
      <AbsoluteFill style={{ opacity: i === vis ? 1 : 0 }}><Freeze frame={s(RL) - Math.max(0, s(w.off) - 12)} active={(f) => f > s(RL) - Math.max(0, s(w.off) - 12)}><OffthreadVideo src={staticFile("av/" + P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 12)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><CamaraMano intensidad={0.8} seed={3}>{face}</CamaraMano></AbsoluteFill>;
};

const Shot: React.FC<{ id: string; t: number; a: number; d: Data; z?: [number, number]; ox?: number; oy?: number }> = ({ id, t, a, d, z = [1.03, 1.13], ox = 0, oy = 0 }) => {
  const q = e(t, a, a + 8), sc = z[0] + (z[1] - z[0]) * q;
  const clip = d.av.clips.includes(id), L = d.av.clipLen?.[id] ?? 3;
  const media = clip
    ? <Sequence from={s(a) - 12} layout="none"><Freeze frame={s(L) - 2} active={(f) => f > s(L) - 2}><OffthreadVideo src={staticFile(P + "c_" + (d.av.src?.[id] ?? id) + ".mp4")} startFrom={s(d.av.off?.[id] ?? 0)} playbackRate={d.av.rate?.[id] ?? 1} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze></Sequence>
    : <Img src={staticFile(P + "i_" + id + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#0b0e12" }}><CamaraMano intensidad={0.9} seed={Math.round(a)}><AbsoluteFill style={{ transform: `scale(${sc}) translate(${ox * q}px, ${oy * q}px)` }}>{media}</AbsoluteFill></CamaraMano></AbsoluteFill>;
};

const Base: React.FC<{ g: SegJ; t: number; d: Data }> = ({ g, t, d }) => {
  if (g.k === "w") return <World t={t} keys={d.cam} ev={d.ev} />;
  if (g.k === "av") return <Avatar t={t} d={d} />;
  if (g.k === "img") return <Shot id={g.id!} t={t} a={g.a} d={d} z={g.z} ox={g.ox} oy={g.oy} />;
  // fondo de piezas: el mismo mundo casi quieto y oscurecido (sin blur)
  return <AbsoluteFill><World t={g.a + Math.max(0, t - g.a) * 0.15} keys={d.cam} ev={d.ev} /><AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(8,14,24,.5), rgba(4,8,14,.88) 75%)" }} /></AbsoluteFill>;
};

const Trans: React.FC<{ t: number; g: SegJ; d: Data; from: React.ReactNode; to: React.ReactNode }> = ({ t, g, d, from, to }) => {
  const k = ei(t, g.a, g.a + D), tr = g.tr ?? "fade";
  let px = g.px ?? 960, py = g.py ?? 540;
  if (g.pt) { const q = screenOf(d.cam, g.a, PT[g.pt]); px = Math.max(80, Math.min(1840, q.x)); py = Math.max(80, Math.min(1000, q.y)); }
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

const Piece: React.FC<{ o: O; t: number; d: Data }> = ({ o, t, d }) => {
  const p = o as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  switch (o.k) {
    case "tag": { const q = p.pt ? screenOf(d.cam, t, PT[p.pt as PtK]) : { x: p.x, y: p.y }; return <Tag t={t} at={o.a} out={o.b} x={q.x} y={q.y} dx={p.dx ?? 140} dy={p.dy ?? -110} text={p.text} sub={p.sub} col={p.col} size={p.size ?? 50} />; }
    case "big": return <BigNum t={t} at={o.a} out={o.b} text={p.text} sub={p.sub} x={p.x} y={p.y} size={p.size ?? 220} col={p.col} />;
    case "q": return <QChapter t={t} at={o.a} out={o.b} n={p.n} q={p.q} sAt={p.sAt} label={p.label} stamp={p.stamp} low={p.low} />;
    case "say": return <SayThis t={t} at={o.a} out={o.b} text={p.text} head={p.head} y={p.y} />;
    case "four": return <FourSquare t={t} at={o.a} out={o.b} cells={p.cells} hl={p.hl} hlAt={p.hlAt} x={p.x} y={p.y} />;
    case "loan": return <LoanCompare t={t} at={o.a} out={o.b} a={p.la} b={p.lb} totAt={p.totAt} diffAt={p.diffAt} head={p.head} />;
    case "order": return <BuyersOrder t={t} out={o.b} rows={p.rows} xAt={p.xAt} totalAt={p.totalAt} x={p.x} y={p.y} title={p.title} />;
    case "tila": return <TilaBox t={t} at={o.a} out={o.b} v={p.v} hl={p.hl} hlAt={p.hlAt} />;
    case "map": return <MiamiMap t={t} at={o.a} out={o.b} pins={p.pins} />;
    case "year": return <YearStamp t={t} at={o.a} out={o.b} year={p.year} place={p.place} x={p.x} y={p.y} />;
    case "quote": return <QuoteCard t={t} at={o.a} out={o.b} text={p.text} who={p.who} x={p.x} y={p.y} w={p.w} />;
    case "money": return <MoneyCounter t={t} at={o.a} out={o.b} from={p.from} to={p.to} label={p.label} sub={p.sub} dur={p.dur} col={p.col} x={p.x} y={p.y} />;
    case "menu": return <MenuBoard t={t} at={o.a} out={o.b} pk={p.pk} hl={p.hl} hlAt={p.hlAt} />;
    case "calc": return <Calc t={t} at={o.a} out={o.b} keys={p.keys} res={p.res} resAt={p.resAt} note={p.note} x={p.x} y={p.y} />;
    case "note": return <Notebook t={t} at={o.a} out={o.b} title={p.title} rows={p.rows} x={p.x} y={p.y} />;
    case "check": return <Checklist t={t} out={o.b} head={p.head} rows={p.rows} x={p.x} y={p.y} w={p.w} />;
    case "clock": return <LotClock t={t} at={o.a} out={o.b} from={p.from} to={p.to} dur={p.dur} label={p.label} x={p.x} y={p.y} />;
    case "guia": return <GuideCTA t={t} at={o.a} out={o.b} pag={p.pag} note={p.note} />;
    case "end": return <EndCard t={t} at={o.a} out={o.b} q={p.q} next={p.next} qAt={p.qAt} nAt={p.nAt} />;
    case "chips": return <Chips t={t} at={o.a} out={o.b} items={p.items} y={p.y} />;
    case "lower": return <LowerThird t={t} at={o.a} out={o.b} name={p.name} l2={p.l2} l2at={o.a + 0.5} />;
    case "x": return <DrawX t={t} at={o.a} x={p.x} y={p.y} w={p.w} h={p.h} />;
    default: return null;
  }
};

export const HectorVideo: React.FC<{ d: Data }> = ({ d }) => {
  const t = useCurrentFrame() / 30, SG = d.segs;
  let i = 0; while (i < SG.length - 1 && SG[i + 1].a <= t) i++;
  const g = SG[i], prev = SG[Math.max(0, i - 1)];
  const inTr = i > 0 && t < g.a + D && g.tr !== "cut";
  return (
    <AbsoluteFill style={{ background: "#0b0e12" }}>
      {inTr ? <Trans t={t} g={g} d={d} from={<Base g={prev} t={t} d={d} />} to={<Base g={g} t={t} d={d} />} /> : <Base g={g} t={t} d={d} />}
      {d.ov.filter((o) => t >= o.a - 0.3 && t < o.b + 0.6 && !((o.gaps as [number, number][] | undefined) || []).some(([a, b]) => t >= a && t < b)).map((o, j) => <Piece key={j} o={o} t={t} d={d} />)}
      <AbsoluteFill style={{ background: "#000", opacity: e(t, d.av.end - 0.9, d.av.end), pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
