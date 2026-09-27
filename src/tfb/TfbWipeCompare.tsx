// TfbWipeCompare — ANTES / DESPUÉS con una cortina DIAGONAL que barre la pantalla (la gramática de la miniatura):
// dos fuentes (foto o video) a pantalla completa, un filo blanco con brillo que cruza en ángulo, rótulos que caen.
// Opcional: `hold` deja la cortina quieta en `rest` (0-1) para ver las dos mitades a la vez.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, TFB, clamp, easeInOut, outro, pop, strokeText } from "./theme";

export type WipeSrc = { src: string; video?: boolean; startFrom?: number; zoom?: number };
const Layer: React.FC<{ s: WipeSrc; f: number }> = ({ s, f }) => {
  const z = (s.zoom ?? 1.04) + f * 0.0004;
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` };
  return s.video ? <OffthreadVideo src={staticFile(s.src)} startFrom={s.startFrom ?? 0} muted style={st} /> : <Img src={staticFile(s.src)} style={st} />;
};
export const TfbWipeCompare: React.FC<{
  dur: number; before: WipeSrc; after: WipeSrc; beforeLabel?: string; afterLabel?: string;
  angle?: number; sweepFrom?: number; sweepFrames?: number; rest?: number;
}> = ({ dur, before, after, beforeLabel = "ANTES", afterLabel = "DESPUÉS", angle = 18, sweepFrom = 6, sweepFrames = 34, rest = 0.5 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const o = outro(f, dur, 6);
  // posición del filo: de fuera de cuadro (izq) a `rest` con una pequeña sobre-oscilación
  const t = interpolate(f, [sweepFrom, sweepFrom + sweepFrames], [0, 1], { ...clamp, easing: easeInOut });
  const over = Math.sin(Math.min(1, Math.max(0, (f - sweepFrom - sweepFrames) / 14)) * Math.PI) * 0.025;
  const pos = -0.25 + (rest + 0.25) * t + over; // fracción del ancho
  const W = 1920, H = 1080, sk = Math.tan((angle * Math.PI) / 180) * H;
  const xTop = pos * W + sk / 2, xBot = pos * W - sk / 2;
  const clip = `polygon(0px 0px, ${xTop}px 0px, ${xBot}px ${H}px, 0px ${H}px)`;
  const pa = pop(f, fps, sweepFrom + sweepFrames - 6, 11, 0.6), pb = pop(f, fps, sweepFrom + sweepFrames, 11, 0.6);
  return (
    <AbsoluteFill style={{ opacity: o, backgroundColor: "#000" }}>
      <AbsoluteFill><Layer s={before} f={f} /></AbsoluteFill>
      <AbsoluteFill style={{ clipPath: clip }}><Layer s={after} f={f} /></AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs><filter id="wc-glow"><feGaussianBlur stdDeviation="7" /></filter></defs>
        <line x1={xTop} y1={-10} x2={xBot} y2={H + 10} stroke={TFB.yellow} strokeWidth={22} opacity={0.55} filter="url(#wc-glow)" />
        <line x1={xTop} y1={-10} x2={xBot} y2={H + 10} stroke={TFB.white} strokeWidth={9} />
      </svg>
      <div style={{ position: "absolute", left: Math.max(60, xBot - 520), bottom: 70, transform: `scale(${interpolate(pa, [0, 1], [1.8, 1])}) rotate(-3deg)`, opacity: pa,
        fontFamily: ANTON, fontSize: 96, color: TFB.white, ...strokeText(6) }}>{afterLabel}</div>
      <div style={{ position: "absolute", right: 70, top: 60, transform: `scale(${interpolate(pb, [0, 1], [1.8, 1])}) rotate(3deg)`, opacity: pb }}>
        <span style={{ fontFamily: ANTON, fontSize: 70, color: TFB.white, background: TFB.red, padding: "2px 24px 6px", borderRadius: 12, boxShadow: "0 8px 0 rgba(0,0,0,0.35)" }}>{beforeLabel}</span>
      </div>
    </AbsoluteFill>
  );
};
