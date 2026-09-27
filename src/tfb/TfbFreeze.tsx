// TfbFreeze — congelado + anotación: el plano se detiene en `at` (cuadro del medio), se desatura y oscurece apenas
// alrededor, empuja un poco hacia `focus`, y encima van las anotaciones (children). Un borde de "pausa" confirma el truco.
import React from "react";
import { Freeze, interpolate, useCurrentFrame } from "remotion";
import { C, F, clamp, ease, easeIn } from "./theme";

export type TfbFreezeProps = { dur: number; media: React.ReactNode; at: number; focus?: [number, number]; push?: number; tag?: string; children?: React.ReactNode };
export const TfbFreeze: React.FC<TfbFreezeProps> = ({ dur, media, at, focus = [960, 540], push = 1.12, tag, children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: ease });
  const out = interpolate(f, [dur - 6, dur], [1, 0], { ...clamp, easing: easeIn });
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${focus[0]}px ${focus[1]}px`, transform: `scale(${1 + (push - 1) * p})`, filter: `saturate(${1 - 0.45 * p}) brightness(${1 - 0.1 * p})` }}>
        <Freeze frame={at}>{media}</Freeze>
      </div>
      <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 ${10 * p}px ${C.yellow}`, opacity: out }} />
      {tag ? <div style={{ position: "absolute", right: 60, top: 50, opacity: p * out, display: "flex", alignItems: "center", gap: 12, fontFamily: F.ui, fontWeight: 900, fontSize: 30, letterSpacing: 4, color: C.ink, background: C.yellow, padding: "8px 18px" }}><span style={{ display: "inline-flex", gap: 6 }}><span style={{ width: 8, height: 26, background: C.ink }} /><span style={{ width: 8, height: 26, background: C.ink }} /></span>{tag}</div> : null}
      <div style={{ position: "absolute", inset: 0, opacity: out }}>{children}</div>
    </div>
  );
};
