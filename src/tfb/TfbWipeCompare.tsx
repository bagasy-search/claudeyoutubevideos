// TfbWipeCompare — pantalla partida ANTES/DESPUÉS con una CORTINA que barre: el "después" se revela detrás de una
// línea luminosa que viaja de izquierda a derecha (y puede volver a mitad para quedarse partido). Fuentes = video
// (OffthreadVideo con startFrom) o imagen. Rótulos por props.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F_UI, clamp, ease, inOut } from "./theme";

export type Src = { src: string; startFrom?: number; kind?: "video" | "image"; zoom?: number; x?: number; y?: number };
const Layer: React.FC<{ s: Src }> = ({ s }) => {
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.zoom ?? 1})`, transformOrigin: `${s.x ?? 50}% ${s.y ?? 50}%` };
  return s.kind === "image" ? <Img src={staticFile(s.src)} style={st} /> : <OffthreadVideo src={staticFile(s.src)} startFrom={s.startFrom ?? 0} muted style={st} />;
};
export const TfbWipeCompare: React.FC<{ dur: number; before: Src; after: Src; beforeLabel: string; afterLabel: string; settle?: number; startAt?: number }> = ({ dur, before, after, beforeLabel, afterLabel, settle = 50, startAt = 12 }) => {
  const f = useCurrentFrame(), { width } = useVideoConfig();
  const o = inOut(f, dur, 6, 8);
  // barre 0→100 y vuelve a `settle`
  const x = interpolate(f, [startAt, startAt + 26, startAt + 44], [0, 100, settle], { ...clamp, easing: ease });
  const px = (x / 100) * width;
  const lab = (t: string, side: "l" | "r", show: number) => (
    <div style={{ position: "absolute", top: 60, [side === "l" ? "left" : "right"]: 60, opacity: show, transform: `translateY(${(1 - show) * -20}px)`,
      background: side === "l" ? "rgba(20,20,20,0.85)" : C.yellow, color: side === "l" ? C.white : C.ink, fontFamily: F_UI, fontWeight: 800, fontSize: 46,
      padding: "10px 26px", borderRadius: 12, letterSpacing: 2, textTransform: "uppercase", boxShadow: "0 10px 30px rgba(0,0,0,0.45)" }}>{t}</div>
  ) as React.ReactElement;
  return (
    <AbsoluteFill style={{ opacity: o, backgroundColor: "#000" }}>
      <AbsoluteFill><Layer s={before} /></AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}><Layer s={after} /></AbsoluteFill>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: px - 3, width: 6, background: C.white, boxShadow: `0 0 30px 8px rgba(255,210,31,0.75)`, opacity: x > 0.5 && x < 99.5 ? 1 : 0 }} />
      <div style={{ position: "absolute", top: "50%", left: px, width: 74, height: 74, marginLeft: -37, marginTop: -37, borderRadius: 37, background: C.yellow,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)", opacity: x > 0.5 && x < 99.5 ? 1 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={44} height={44} viewBox="0 0 44 44"><path d="M 16 10 L 6 22 L 16 34 M 28 10 L 38 22 L 28 34" stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      {lab(beforeLabel, "l", interpolate(f, [4, 14], [0, 1], clamp) * (x < 92 ? 1 : 0.0))}
      {lab(afterLabel, "r", interpolate(f, [startAt + 10, startAt + 22], [0, 1], clamp))}
    </AbsoluteFill>
  );
};
