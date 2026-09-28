// TfbStepCounter — contador de pasos en la esquina: "PASO 3 / 6" (o "TRUCO", con `kicker`) + título corto, con píldoras de progreso que se
// llenan y un tic al completar. Entra deslizando desde el borde y sale igual.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, INTER, TFB, clamp, easeOut, pop } from "./theme";

export const TfbStepCounter: React.FC<{ n: number; total: number; title: string; dur: number; corner?: "tl" | "tr"; kicker?: string }> = ({ n, total, title, dur, corner = "tl", kicker = "PASO" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: easeOut }), out = interpolate(f, [dur - 10, dur], [0, 1], { ...clamp, easing: easeOut });
  const dx = (1 - inn + out) * (corner === "tl" ? -560 : 560);
  const fill = interpolate(f, [8, 22], [0, 1], clamp);
  const numP = pop(f, fps, 4, 10, 0.6);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 64, [corner === "tl" ? "left" : "right"]: 64, transform: `translateX(${dx}px)`, display: "flex", alignItems: "stretch",
        filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.45))" } as React.CSSProperties}>
        <div style={{ background: TFB.yellow, color: TFB.ink, fontFamily: ANTON, padding: "10px 22px 6px", borderRadius: "16px 0 0 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 22, letterSpacing: 3 }}>{kicker}</div>
          <div style={{ fontSize: 84, lineHeight: 0.95, transform: `scale(${interpolate(numP, [0, 1], [1.8, 1])})` }}>{n}</div>
        </div>
        <div style={{ background: "rgba(16,16,16,0.88)", padding: "16px 28px 16px 24px", borderRadius: "0 16px 16px 0", display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
          <div style={{ fontFamily: ANTON, fontSize: 54, color: TFB.white, textTransform: "uppercase", lineHeight: 1, whiteSpace: "nowrap" }}>{title}</div>
          <div style={{ display: "flex", gap: 8 }}>
            {Array.from({ length: total }).map((_, i) => {
              const done = i < n - 1 ? 1 : i === n - 1 ? fill : 0;
              return (
                <div key={i} style={{ width: 46, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.22)", overflow: "hidden" }}>
                  <div style={{ width: `${done * 100}%`, height: "100%", background: i === n - 1 ? TFB.yellow : TFB.white }} />
                </div>
              );
            })}
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 20, color: "rgba(255,255,255,0.7)", marginLeft: 6, lineHeight: "10px" }}>{n}/{total}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
