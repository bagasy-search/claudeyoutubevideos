// TdcStepCounter — contador de pasos en la esquina: "PASO 3 / 6" con segmentos de progreso que se llenan
// y el nombre corto del paso (≤5 palabras) que entra deslizando. Reusable para cualquier procedimiento.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F_DISPLAY, F_UI, clamp, ease, inOut, pop } from "./theme";

export const TdcStepCounter: React.FC<{ dur: number; step: number; total: number; title: string; word?: string; corner?: "tl" | "tr" }> = ({ dur, step, total, title, word = "PASO", corner = "tl" }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const o = inOut(f, dur, 8, 10), s = pop(f, fps, 0, 12);
  const fill = interpolate(f, [6, 22], [step - 1, step], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 50, [corner === "tl" ? "left" : "right"]: 56, display: "flex", alignItems: "stretch",
        transform: `translateX(${(1 - s) * (corner === "tl" ? -80 : 80)}px)`, boxShadow: "0 14px 40px rgba(0,0,0,0.5)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ background: C.yellow, padding: "10px 22px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: F_UI, fontWeight: 800, fontSize: 22, color: C.ink, letterSpacing: 3 }}>{word}</div>
          <div style={{ fontFamily: F_DISPLAY, fontSize: 70, lineHeight: 1, color: C.ink }}>{step}<span style={{ fontSize: 34, opacity: 0.6 }}>/{total}</span></div>
        </div>
        <div style={{ background: "rgba(14,14,14,0.86)", padding: "14px 26px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
          <div style={{ fontFamily: F_UI, fontWeight: 800, fontSize: 40, color: C.white, textTransform: "uppercase", whiteSpace: "nowrap",
            opacity: interpolate(f, [8, 18], [0, 1], clamp), transform: `translateX(${interpolate(f, [8, 18], [24, 0], { ...clamp, easing: ease })}px)` }}>{title}</div>
          <div style={{ display: "flex", gap: 8 }}>
            {Array.from({ length: total }, (_, i) => (
              <div key={i} style={{ width: 46, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.22)", overflow: "hidden" }}>
                <div style={{ width: `${Math.max(0, Math.min(1, fill - i)) * 100}%`, height: "100%", background: C.yellow }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
