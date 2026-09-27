// TfbStepCounter — contador de pasos del método: bloque "PASO n" que entra desde la izquierda con una barra amarilla,
// el rótulo del paso (≤4 palabras) se escribe detrás, y abajo los puntitos de progreso (n de total) se llenan.
// Esquina superior izquierda, no tapa la acción. Uso: <TfbStepCounter n={2} total={5} label="VINAGRE CALIENTE" dur={120} />
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TFB, F_DISPLAY, F_SANS, EASE_OUT, clamp } from "./theme";

export type TfbStepCounterProps = { n: number; total: number; label: string; dur: number; word?: string; corner?: "tl" | "bl" };

export const TfbStepCounter: React.FC<TfbStepCounterProps> = ({ n, total, label, dur, word = "PASO", corner = "tl" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 15, stiffness: 160 } });
  const b = spring({ frame: f - 6, fps, config: { damping: 18, stiffness: 120 } });
  const out = interpolate(f, [dur - 10, dur], [0, 1], { ...clamp, easing: EASE_OUT });
  const chars = Math.round(interpolate(f, [8, 8 + label.length * 1.2], [0, label.length], clamp));
  const pos = corner === "tl" ? { top: 64 } : { bottom: 110 };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 64, ...pos, transform: `translateX(${(-520 * (1 - a)) - 520 * out}px)`, opacity: 1 - out }}>
        <div style={{ display: "flex", alignItems: "stretch", boxShadow: TFB.shadow, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ background: TFB.yellow, color: TFB.ink, padding: "8px 22px 4px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: F_SANS, fontWeight: 800, fontSize: 26, letterSpacing: 4, lineHeight: 1 }}>{word}</div>
            <div style={{ fontFamily: F_DISPLAY, fontSize: 96, lineHeight: 0.95, transform: `scale(${0.6 + 0.4 * b})` }}>{n}</div>
          </div>
          <div style={{ background: "rgba(16,17,20,0.88)", color: TFB.white, padding: "14px 28px", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 380 }}>
            <div style={{ fontFamily: F_DISPLAY, fontSize: 56, letterSpacing: 1, lineHeight: 1.05, whiteSpace: "nowrap" }}>{label.slice(0, chars)}<span style={{ opacity: chars < label.length ? 1 : 0, color: TFB.yellow }}>|</span></div>
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              {Array.from({ length: total }, (_, i) => {
                const fill = i < n - 1 ? 1 : i === n - 1 ? interpolate(f, [14, 26], [0, 1], clamp) : 0;
                return <div key={i} style={{ width: 46, height: 10, borderRadius: 5, background: `linear-gradient(90deg, ${TFB.yellow} ${fill * 100}%, rgba(255,255,255,0.22) ${fill * 100}%)` }} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
