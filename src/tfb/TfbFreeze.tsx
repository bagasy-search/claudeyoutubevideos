// TfbFreeze — CONGELADO + anotación: el cuadro se congela con un flash blanco corto, un leve push-in y viñeta; encima
// va un círculo dibujado a mano sobre el punto y un rótulo (≤3 palabras). `children` = el footage ya posicionado en el
// cuadro que se congela (el que llama pasa <OffthreadVideo startFrom=…> y esto lo envuelve en <Freeze frame={0}>).
import React from "react";
import { AbsoluteFill, Freeze, interpolate, useCurrentFrame } from "remotion";
import { TFB, F_DISPLAY, EASE_IN, clamp } from "./theme";
import { TfbStroke } from "./TfbStroke";

export type TfbFreezeProps = { children: React.ReactNode; point: { x: number; y: number }; r?: { x: number; y: number }; label?: string; dur: number; labelPos?: { x: number; y: number } };

export const TfbFreeze: React.FC<TfbFreezeProps> = ({ children, point, r = { x: 0.09, y: 0.13 }, label, dur, labelPos }) => {
  const f = useCurrentFrame();
  const flash = interpolate(f, [0, 2, 7], [0, 0.85, 0], clamp);
  const push = 1 + interpolate(f, [0, dur], [0, 0.07], clamp);
  const lab = interpolate(f, [10, 20], [0, 1], { ...clamp, easing: EASE_IN });
  const lp = labelPos || { x: point.x, y: Math.min(0.88, point.y + r.y + 0.1) };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: `${point.x * 100}% ${point.y * 100}%`, filter: "saturate(0.85) contrast(1.05)" }}>
        <Freeze frame={0}>{children}</Freeze>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)" }} />
      <TfbStroke kind="circle" a={point} b={r} drawAt={4} drawDur={12} color={TFB.yellow} width={11} seed={7} />
      {label && (
        <div style={{ position: "absolute", left: lp.x * 1920, top: lp.y * 1080, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * lab})`, opacity: lab }}>
          <span style={{ fontFamily: F_DISPLAY, fontSize: 70, color: TFB.ink, background: TFB.yellow, padding: "2px 22px 8px", borderRadius: 10, boxShadow: TFB.shadow, whiteSpace: "nowrap" }}>{label}</span>
        </div>
      )}
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};
