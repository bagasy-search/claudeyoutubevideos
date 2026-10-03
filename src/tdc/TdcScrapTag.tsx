// TdcScrapTag — etiqueta de inventario que CUELGA de una chatarra con un hilo y se balancea: nombre + de dónde salió + costo.
// Pensada para el inventario de desechos ("rotomartillo · volquete · $0"). `at` = punto de enganche en % del cuadro.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F_DISPLAY, F_UI, clamp, ease, inOut, pop } from "./theme";

export const TdcScrapTag: React.FC<{ dur: number; name: string; origin: string; cost?: string; at: [number, number]; swing?: number }> = ({ dur, name, origin, cost = "$0", at, swing = 5 }) => {
  const f = useCurrentFrame(), { fps, width: W, height: H } = useVideoConfig();
  const o = inOut(f, dur, 4, 8), s = pop(f, fps, 0, 9);
  const rot = Math.sin(f * 0.16) * swing * Math.exp(-f / 60) + Math.sin(f * 0.09) * 1.2 + (1 - s) * -24;
  const drop = interpolate(f, [0, 10], [-60, 0], { ...clamp, easing: ease });
  const X = (at[0] / 100) * W, Y = (at[1] / 100) * H;
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: X, top: Y + drop, transformOrigin: "50% 0", transform: `translateX(-50%) rotate(${rot}deg)` }}>
        <div style={{ width: 4, height: 46, background: "#d9d0b8", margin: "0 auto" }} />
        <div style={{ width: 380, background: C.cream, borderRadius: "10px 10px 18px 18px", padding: "16px 22px 18px", border: `4px solid ${C.espresso}`, boxShadow: "0 18px 40px rgba(0,0,0,0.55)", position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: -12, width: 22, height: 22, borderRadius: 11, background: "#1a1a1a", border: `4px solid ${C.espresso}`, transform: "translateX(-50%)" }} />
          <div style={{ fontFamily: F_DISPLAY, fontSize: 54, lineHeight: 1.02, color: C.ink, textTransform: "uppercase", marginTop: 8 }}>{name}</div>
          <div style={{ fontFamily: F_UI, fontWeight: 800, fontSize: 28, color: C.espresso, textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>{origin}</div>
          <div style={{ fontFamily: F_DISPLAY, fontSize: 64, color: C.red, marginTop: 6, textAlign: "right", transform: `scale(${0.7 + 0.3 * pop(f, fps, 12, 8)})`, transformOrigin: "100% 50%" }}>{cost}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
