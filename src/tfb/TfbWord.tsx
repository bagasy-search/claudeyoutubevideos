// TfbWord — golpe de texto de 1 a 4 palabras con la gramática de las miniaturas: Anton en mayúsculas, caja amarilla
// con texto negro, caja roja con texto blanco, o blanco con contorno negro. Entra con "punch" (escala con rebote +
// un leve giro) y un barrido de brillo; la segunda línea (opcional) entra un poco después, más chica.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EIO, F_DISPLAY, F_SANS, lin, outline, pop } from "./theme";

export type WordProps = {
  dur: number; text: string; sub?: string;
  variant?: "yellow" | "red" | "white";
  x?: number; y?: number;          // centro en % (default 50 / 78)
  size?: number; rot?: number; align?: "center" | "left" | "right";
  strike?: boolean;                 // tacha el texto con una raya roja (para "PEGAMENTO", "SILICONA"…)
};

export const TfbWord: React.FC<WordProps> = ({ dur, text, sub, variant = "yellow", x = 50, y = 78, size = 118, rot = -2, align = "center", strike = false }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = pop(f, fps, 0, 260, 12), s2 = pop(f, fps, 6, 220, 14);
  const out = lin(f, [dur - 7, dur], [1, 0], EIO);
  const bg = variant === "yellow" ? C.yellow : variant === "red" ? C.red : "transparent";
  const fg = variant === "yellow" ? C.ink : C.white;
  const shine = lin(f, [4, 16], [-40, 140]);
  const tx = align === "center" ? "-50%" : align === "left" ? "0%" : "-100%";
  const st = lin(f, [10, 18], [0, 1]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: `translate(${tx},-50%) rotate(${rot}deg) scale(${(0.4 + 0.6 * s).toFixed(4)})`,
        display: "flex", flexDirection: "column", alignItems: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center", gap: 10 }}>
        <div style={{ position: "relative", overflow: "hidden", backgroundColor: bg, padding: variant === "white" ? 0 : "6px 26px 2px", borderRadius: 10,
          boxShadow: variant === "white" ? undefined : "0 14px 34px rgba(0,0,0,0.45)" }}>
          <div style={{ fontFamily: F_DISPLAY, fontSize: size, lineHeight: 1.02, color: fg, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap",
            textShadow: variant === "white" ? outline(6) : undefined }}>{text}</div>
          {variant !== "white" ? <div style={{ position: "absolute", top: 0, bottom: 0, left: `${shine}%`, width: "18%", transform: "skewX(-20deg)", background: "rgba(255,255,255,0.35)" }} /> : null}
          {strike ? <div style={{ position: "absolute", left: "-4%", top: "50%", height: size * 0.12, width: `${108 * st}%`, backgroundColor: C.red, transform: "rotate(-6deg)", borderRadius: 8, boxShadow: "0 3px 0 rgba(0,0,0,0.4)" }} /> : null}
        </div>
        {sub ? <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: size * 0.36, color: C.white, textTransform: "uppercase", letterSpacing: 2, textShadow: outline(3),
          transform: `translateY(${(1 - s2) * 20}px)`, opacity: Math.max(0, s2) }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
