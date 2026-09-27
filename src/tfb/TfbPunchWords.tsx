// TfbPunchWords — frase cinética de ≤6 palabras que cae palabra por palabra (cada una con su cuadro de entrada, anclado
// a la palabra dicha), con golpe de escala y las palabras clave sobre caja AMARILLA (o ROJA si tone="warn"). Sombra
// fuerte para leerse sobre footage. Posición: "center" | "low" | "high".
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TFB, F_DISPLAY, EASE_OUT, clamp } from "./theme";

export type TfbPunchWordsProps = { words: { t: string; hl?: boolean; at?: number }[]; dur: number; perWord?: number; pos?: "center" | "low" | "high"; tone?: "info" | "warn"; size?: number };

export const TfbPunchWords: React.FC<TfbPunchWordsProps> = ({ words, dur, perWord = 5, pos = "low", tone = "info", size = 104 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = interpolate(f, [dur - 7, dur], [0, 1], { ...clamp, easing: EASE_OUT });
  const top = pos === "center" ? "42%" : pos === "high" ? "12%" : "70%";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 80, right: 80, top, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", gap: "6px 22px", opacity: 1 - out, transform: `translateY(${out * -20}px)` }}>
        {words.map((w, i) => {
          const at = w.at ?? i * perWord;
          const s = spring({ frame: f - at, fps, config: { damping: 11, stiffness: 220, mass: 0.6 } });
          if (f < at) return null;
          const bg = w.hl ? (tone === "warn" ? TFB.red : TFB.yellow) : "transparent";
          const col = w.hl ? (tone === "warn" ? "#fff" : TFB.ink) : "#fff";
          return (
            <span key={i} style={{ fontFamily: F_DISPLAY, fontSize: size, lineHeight: 1.08, color: col, background: bg, padding: w.hl ? "0 18px 6px" : 0, borderRadius: 10, textShadow: w.hl ? "none" : TFB.textShadow,
              boxShadow: w.hl ? TFB.shadow : "none", transform: `scale(${0.4 + 0.6 * s}) rotate(${(1 - s) * (i % 2 ? 6 : -6)}deg)`, display: "inline-block", letterSpacing: 1 }}>{w.t}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
