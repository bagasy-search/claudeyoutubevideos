// Escenas sobre fotos de stan12c (D:/rtmp/stan12c/ideas.md). Escritas de cero: sólo React y Remotion, sin SVG.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };

// cámara que lleva el punto (cx,cy) de la foto al centro con escala s, sin dejar bordes vacíos
const cover = (cx: number, cy: number, s: number) => Math.max(s, 960 / cx, 960 / (1920 - cx), 540 / cy, 540 / (1080 - cy), 1);
const cam = (cx: number, cy: number, s: number): React.CSSProperties => {
  const k = cover(cx, cy, s);
  return { transformOrigin: "0 0", transform: `translate(${960 - cx * k}px, ${540 - cy * k}px) scale(${k})` };
};
const camT = (cx: number, cy: number, s: number, t: number) => cam(lerp(cx, 960, t), lerp(cy, 540, t), lerp(s, 1, t));

const damp = (t: number, tau: number, per: number) => (t <= 0 ? 0 : 1 - Math.exp(-t / tau) * Math.cos((t / per) * Math.PI * 2));
const seg = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...CL, easing: io });

// ── Escena 1 · la foto bascula como el astil de una balanza con el eje en el gancho real (975,60): la media res se hunde
export const EscBalanza: React.FC<{ src: string; fRib: number; fSlice: number; fFight: number; dur: number }> = ({ src, fRib, fSlice, fFight, dur }) => {
  const f = useCurrentFrame();
  const HX = 975, HY = 60;
  const b = seg(f, fRib - 8, fRib + 34);            // baja a mirar el plato
  const hsx = lerp(1150, 960, b), hsy = lerp(-40, -250, b);
  const k = 1.5 + 0.12 * seg(f, fFight, dur);
  const th = -6.5 * damp(f - fSlice, 16, 34);        // el lado izquierdo (la res) baja, oscila y se queda
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1b1a18" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${HX}px ${HY}px`, transform: `translate(${hsx - HX}px, ${hsy - HY}px) scale(${k}) rotate(${th}deg)` }}>
        <Img src={staticFile(src)} style={FULL} />
      </div>
    </AbsoluteFill>
  );
};

// ── Escena 4 · las dos mitades del tri-tip giran como patas de compás en la costura real (1010,300) hasta acostar sus fibras
export const EscCompas: React.FC<{ src: string; fOne: number; fOther: number; fCut: number; fSlice: number; dur: number }> = ({ src, fOne, fOther, fCut, fSlice, dur }) => {
  const f = useCurrentFrame();
  const PX = 1010, PY = 300, ANG = 40;
  const open = damp(f - fCut, 12, 60) * (f >= fCut ? 1 : 0);
  const o = Math.min(1.06, open);
  // cámara: recorre de la punta al extremo gordo y después se aleja para que entren las dos mitades abiertas
  const cx = lerp(lerp(lerp(960, 640, seg(f, fOne - 6, fOne + 30)), 1330, seg(f, fOther - 6, fOther + 30)), 1010, seg(f, fCut - 14, fCut + 10));
  const cy = lerp(lerp(520, 420, seg(f, fOne - 6, fOne + 30)), 640, seg(f, fCut - 14, fCut + 16));
  const s = lerp(lerp(1.12, 1.32, seg(f, fOne - 6, fOne + 30)), 0.74, seg(f, fCut - 14, fCut + 16)) + 0.05 * seg(f, fSlice, dur);
  const stage: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${960 - cx * s}px, ${540 - cy * s}px) scale(${s})` };
  const half = (left: boolean): React.CSSProperties => ({ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${PX}px ${PY}px`, transform: `rotate(${(left ? -1 : 1) * ANG * o}deg)`,
    clipPath: left ? `polygon(0px 0px, ${PX}px 0px, ${PX}px 935px, 0px 935px)` : `polygon(${PX}px 0px, 1920px 0px, 1920px 935px, ${PX}px 935px)` });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#d79a8c" }}>
      {/* fondo: el mismo papel rosa de la foto, ampliado */}
      <Img src={staticFile(src)} style={{ ...FULL, transformOrigin: "330px 700px", transform: "scale(4.2)" }} />
      <div style={stage}>
        {f < fCut - 14 && <Img src={staticFile(src)} style={FULL} />}
        <div style={half(true)}><Img src={staticFile(src)} style={FULL} /></div>
        <div style={half(false)}><Img src={staticFile(src)} style={FULL} /></div>
      </div>
    </AbsoluteFill>
  );
};

// ── Escena 7 · comparador de parpadeo: en cada "Same" la foto cambia de golpe por el otro bife puesto en el mismo lugar
export const EscParpadeo: React.FC<{ src: string; fSame: number[]; fTags: number; dur: number }> = ({ src, fSame, fTags, dur }) => {
  const f = useCurrentFrame();
  const DX = -695, DY = -20;
  let n = 0; for (const x of fSame) if (f >= x) n++;
  const b = n % 2 === 1 && f < fTags - 6;           // capa B = el ribeye corrido sobre el chuck eye
  const out = seg(f, fTags - 6, fTags + 34);
  const cx = lerp(640, 960, out), cy = lerp(610, 430, out), s0 = lerp(2.05 + 0.12 * Math.min(1, f / Math.max(1, fTags)), 1.18, out);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2a1a12" }}>
      <AbsoluteFill style={cam(cx, cy, s0)}>
        <Img src={staticFile(src)} style={{ ...FULL, transform: b ? `translate(${DX}px, ${DY}px)` : undefined }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Escena 8 · falla de terreno: la foto se corta por la línea real entre la 5ª y la 6ª costilla y el lado del ribeye queda un escalón más arriba
export const EscFalla: React.FC<{ src: string; fStop: number; fCut: number; dur: number }> = ({ src, fStop, fCut, dur }) => {
  const f = useCurrentFrame();
  const STEP = 88;
  const t = seg(f, fStop - 10, Math.max(fStop + 40, fCut - 12));
  const cx = lerp(lerp(1540, 1500, f / Math.max(1, fStop)), 760, t), cy = lerp(640, 600, t), s = lerp(1.5, 1.42, t) + 0.05 * seg(f, fCut, dur);
  const up = STEP * damp(f - fCut, 9, 40) * (f >= fCut ? 1 : 0);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2a1a12" }}>
      <AbsoluteFill style={cam(cx, cy, s)}>
        <Img src={staticFile(src)} style={FULL} />
        {/* lado derecho de la línea 505,330 → 560,840 (costillas 6 a 12): sube un escalón */}
        <Img src={staticFile(src)} style={{ ...FULL, transform: `translateY(${-up}px)`, clipPath: "polygon(470px 0px, 1920px 0px, 1920px 1080px, 586px 1080px, 560px 840px, 505px 330px)" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
