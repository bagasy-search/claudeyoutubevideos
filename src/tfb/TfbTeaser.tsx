// TfbTeaser — el "loop abierto" a la vista: ficha que entra por la derecha con un ícono de reproducción adelantada,
// un kicker ("AL FINAL") y una promesa corta; late suave mientras dura y se va con un barrido.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EIO, F_DISPLAY, F_SANS, lin, pop } from "./theme";

export const TfbTeaser: React.FC<{ dur: number; kicker: string; text: string; y?: number }> = ({ dur, kicker, text, y = 12 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = pop(f, fps, 0, 170, 15), out = lin(f, [dur - 8, dur], [0, 1], EIO);
  const beat = 1 + 0.03 * Math.sin((f / fps) * Math.PI * 2 * 1.1);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 60, top: `${y}%`, transform: `translateX(${(1 - Math.max(0, inn)) * 700 + out * 800}px) scale(${beat})`, transformOrigin: "100% 50%",
        display: "flex", alignItems: "center", gap: 20, backgroundColor: "rgba(17,17,17,0.9)", borderRadius: 18, padding: "16px 28px 16px 18px", border: `4px solid ${C.yellow}`, boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
        <div style={{ width: 86, height: 86, borderRadius: 14, backgroundColor: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="58" height="58" viewBox="0 0 100 100"><path d="M18 20 L50 50 L18 80 Z M52 20 L84 50 L52 80 Z" fill="#fff" /></svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 26, letterSpacing: 5, color: C.yellow }}>{kicker}</div>
          <div style={{ fontFamily: F_DISPLAY, fontSize: 56, color: C.white, lineHeight: 1.05, maxWidth: 820 }}>{text}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
