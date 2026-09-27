// TfbStepCounter — contador de pasos: número grande que golpea (amarillo), el título del paso que se escribe con barrido
// y una fila de puntos de progreso (hechos / actual / pendientes). Arriba a la izquierda, fuera de la cara.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, clamp, ease, easeIn, pop, textShadow } from "./theme";

export type TfbStepCounterProps = { n: number; total: number; title: string; dur: number; x?: number; y?: number; word?: string };
export const TfbStepCounter: React.FC<TfbStepCounterProps> = ({ n, total, title, dur, x = 90, y = 80, word = "PASO" }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const s = pop(f, fps, 0, 9, 0.6);
  const slam = interpolate(s, [0, 1], [2.2, 1]);
  const wipe = interpolate(f, [6, 16], [0, 100], { ...clamp, easing: ease });
  const out = interpolate(f, [dur - 8, dur], [1, 0], { ...clamp, easing: easeIn });
  const shake = f < 10 ? Math.sin(f * 2.3) * (10 - f) * 0.9 : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 26, opacity: out, transform: `translate(${shake}px, ${-shake * 0.5}px)` }}>
      <div style={{ width: 150, height: 150, borderRadius: 999, background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.45), inset 0 -6px 0 rgba(0,0,0,0.12)", transform: `scale(${slam})` }}>
        <div style={{ fontFamily: F.impact, fontSize: 108, color: C.ink, lineHeight: 1, marginTop: 6 }}>{n}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontFamily: F.ui, fontWeight: 900, fontSize: 30, letterSpacing: 6, color: C.yellow, textShadow, opacity: s }}>{word} {n} / {total}</div>
        <div style={{ clipPath: `inset(-20px ${100 - wipe}% -20px 0)`, fontFamily: F.impact, fontSize: 76, color: C.white, textShadow, textTransform: "uppercase", lineHeight: 1 }}>{title}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          {Array.from({ length: total }, (_, i) => {
            const d = pop(f, fps, 8 + i * 2, 12);
            const on = i + 1 < n, cur = i + 1 === n;
            return <div key={i} style={{ width: cur ? 46 : 18, height: 18, borderRadius: 9, background: cur ? C.yellow : on ? C.white : "rgba(255,255,255,0.28)", transform: `scale(${d})`, boxShadow: "0 3px 8px rgba(0,0,0,0.4)" }} />;
          })}
        </div>
      </div>
    </div>
  );
};
