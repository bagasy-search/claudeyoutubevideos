// TdcLabel — rótulo de objeto/dato sobre el footage (≤6 palabras): chip que entra con resorte desde un punto,
// con línea guía que se traza hasta el objeto (x,y en %), y subtítulo opcional más chico. Estilos: yellow / white / red.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F_DISPLAY, F_UI, clamp, ease, inOut, pop } from "./theme";

export const TdcLabel: React.FC<{ dur: number; text: string; sub?: string; at: [number, number]; to?: [number, number]; tone?: "yellow" | "white" | "red"; size?: number }> = ({ dur, text, sub, at, to, tone = "yellow", size = 64 }) => {
  const f = useCurrentFrame(), { fps, width: W, height: H } = useVideoConfig();
  const o = inOut(f, dur, 4, 8), s = pop(f, fps, 0, 12);
  const bg = tone === "yellow" ? C.yellow : tone === "red" ? C.red : C.white, fg = tone === "red" ? C.white : C.ink;
  const lp = interpolate(f, [4, 16], [0, 1], { ...clamp, easing: ease });
  const X = (at[0] / 100) * W, Y = (at[1] / 100) * H;
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      {to && (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <line x1={X} y1={Y} x2={X + ((to[0] / 100) * W - X) * lp} y2={Y + ((to[1] / 100) * H - Y) * lp} stroke={bg} strokeWidth={6} strokeLinecap="round" />
          <circle cx={(to[0] / 100) * W} cy={(to[1] / 100) * H} r={14 * lp} fill={bg} stroke="rgba(0,0,0,0.35)" strokeWidth={4} />
        </svg>
      )}
      <div style={{ position: "absolute", left: X, top: Y, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * s}) rotate(${(1 - s) * -6}deg)`,
        background: bg, color: fg, padding: "10px 28px 12px", borderRadius: 14, boxShadow: "0 14px 36px rgba(0,0,0,0.5)", textAlign: "center" }}>
        <div style={{ fontFamily: F_DISPLAY, fontSize: size, lineHeight: 1.05, textTransform: "uppercase", whiteSpace: "nowrap" }}>{text}</div>
        {sub && <div style={{ fontFamily: F_UI, fontWeight: 800, fontSize: size * 0.42, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1 }}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};
