// TfbStepCounter — contador de pasos de obra en la esquina: número grande que "cae" con golpe, nombre del paso,
// y una fila de casilleros (uno por paso) que se van llenando. Para procesos en orden (picar → … → curar).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, INTER, TFB, clamp, outro, pop, strokeText } from "./theme";

export const TfbStepCounter: React.FC<{ dur: number; step: number; total: number; label: string; corner?: "tl" | "tr" | "bl" }> = ({ dur, step, total, label, corner = "tl" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const o = outro(f, dur, 6), p = pop(f, fps, 0, 10, 0.55), q = pop(f, fps, 5, 14, 0.7);
  const pos: React.CSSProperties = corner === "tl" ? { left: 64, top: 56 } : corner === "tr" ? { right: 64, top: 56, alignItems: "flex-end" } : { left: 64, bottom: 70 };
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <div style={{ position: "absolute", display: "flex", flexDirection: "column", gap: 10, ...pos }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 150, height: 150, borderRadius: 22, background: TFB.yellow, display: "flex", alignItems: "center", justifyContent: "center",
            transform: `scale(${interpolate(p, [0, 1], [1.9, 1])}) rotate(${interpolate(p, [0, 1], [-14, -4])}deg)`, boxShadow: "0 9px 0 rgba(0,0,0,0.35)" }}>
            <span style={{ fontFamily: ANTON, fontSize: 112, color: TFB.ink, lineHeight: 1 }}>{step}</span>
          </div>
          <div style={{ opacity: q, transform: `translateX(${(1 - q) * -30}px)` }}>
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 32, color: TFB.yellow, letterSpacing: 3, textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>PASO {step} DE {total}</div>
            <div style={{ fontFamily: ANTON, fontSize: 84, color: TFB.white, textTransform: "uppercase", lineHeight: 1.02, ...strokeText(4) }}>{label}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 7, marginTop: 4 }}>
          {Array.from({ length: total }).map((_, i) => { const on = i < step, cur = i === step - 1; const g = cur ? interpolate(f, [4, 14], [0, 1], clamp) : 1;
            return <div key={i} style={{ width: 44, height: 12, borderRadius: 5, background: on ? (cur ? `rgba(255,210,26,${g})` : TFB.yellow) : "rgba(255,255,255,0.35)", boxShadow: "0 2px 6px rgba(0,0,0,0.5)" }} />; })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
