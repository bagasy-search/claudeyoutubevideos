// Planos base: foto a pantalla completa, ficha (foto chica sobre su propio desenfoque) y video.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, useCurrentFrame, interpolate } from "remotion";
import { sf, clamp, ease, C, MONO } from "./lib";

export type Shot = {
  f0: number; f1: number; kind: "img" | "card" | "vid" | "g"; file?: string; mv?: string; rate?: number; from?: number;
  tag?: string; stat?: [string, string]; statF?: number; ch?: [string, string]; item?: string; stamp?: string; title?: string;
  g?: any; tl?: number; chem?: boolean; react?: boolean; w?: number; h?: number; name?: string;
};

// movimiento de cámara sobre la foto (escala, x %, y %) de p=0 a p=1
const MV: Record<string, [number, number, number, number, number, number]> = {
  in: [1.02, 0, 0, 1.13, 0, 0],
  out: [1.14, 0, 0, 1.03, 0, 0],
  left: [1.12, 3.2, 0, 1.12, -3.2, 0],
  right: [1.12, -3.2, 0, 1.12, 3.2, 0],
  up: [1.12, 0, 3, 1.12, 0, -3],
  down: [1.12, 0, -3, 1.12, 0, 3],
  pan3: [1.32, 11, 0, 1.32, -11, 0],
  still: [1.04, 0, 0, 1.09, 0, 0],
};

export const Cam: React.FC<{ dur: number; mv?: string; children: React.ReactNode }> = ({ dur, mv = "still", children }) => {
  const f = useCurrentFrame();
  const m = MV[mv] || MV.still;
  const p = interpolate(f, [0, dur], [0, 1], clamp);
  const e = mv === "pan3" ? p : ease(p) * 0.35 + p * 0.65;
  const s = m[0] + (m[3] - m[0]) * e, x = m[1] + (m[4] - m[1]) * e, y = m[2] + (m[5] - m[2]) * e;
  return <AbsoluteFill style={{ transform: `translate(${x}%, ${y}%) scale(${s})` }}>{children}</AbsoluteFill>;
};

export const FullImg: React.FC<{ s: Shot }> = ({ s }) => (
  <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
    <Cam dur={s.f1 - s.f0} mv={s.mv}>
      <Img src={sf(s.file!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Cam>
  </AbsoluteFill>
);

// Ficha: foto de archivo (chica o de otra proporción) enmarcada sobre su propio desenfoque.
export const Card: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame();
  const dur = s.f1 - s.f0;
  const ar = (s.w || 16) / (s.h || 9);
  const maxW = 1500, maxH = 860;
  let w = maxW, h = maxW / ar;
  if (h > maxH) { h = maxH; w = maxH * ar; }
  const p = interpolate(f, [0, dur], [0, 1], clamp);
  const sc = 0.985 + 0.05 * p;
  const dx = (s.mv === "left" ? -1 : s.mv === "right" ? 1 : 0) * 20 * p;
  const br = 0.22 + 0.06 * Math.sin(p * 3);
  const corner = (st: React.CSSProperties) => <div style={{ position: "absolute", width: 34, height: 34, ...st }} />;
  const L = `3px solid ${C.cyan}`;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.35 + 0.08 * p})`, filter: `blur(38px) brightness(${br}) saturate(1.2)` }}>
        <Img src={sf(s.file!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(4,7,12,0) 30%, rgba(4,7,12,0.75) 100%)" }} />
      <div style={{ position: "absolute", left: 960 - w / 2 + dx, top: 520 - h / 2, width: w, height: h, transform: `scale(${sc})`,
        boxShadow: "0 30px 80px rgba(0,0,0,0.7)", outline: "1px solid rgba(255,255,255,0.18)" }}>
        <Img src={sf(s.file!)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        {corner({ left: -12, top: -12, borderLeft: L, borderTop: L })}
        {corner({ right: -12, top: -12, borderRight: L, borderTop: L })}
        {corner({ left: -12, bottom: -12, borderLeft: L, borderBottom: L })}
        {corner({ right: -12, bottom: -12, borderRight: L, borderBottom: L })}
      </div>
    </AbsoluteFill>
  );
};

export const Vid: React.FC<{ s: Shot; farm?: boolean }> = ({ s }) => (
  <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
    <Cam dur={s.f1 - s.f0} mv={s.mv || "still"}>
      <OffthreadVideo src={sf(s.file!)} muted playbackRate={s.rate || 1} startFrom={s.from || 0}
        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Cam>
  </AbsoluteFill>
);

export const monoStyle: React.CSSProperties = { fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" };
