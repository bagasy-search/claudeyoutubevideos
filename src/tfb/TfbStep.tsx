// TfbStep — contador de pasos del arreglo: ficha en la esquina superior izquierda con "PASO n" grande, el total en
// puntos (los hechos en amarillo, el actual latiendo) y una etiqueta corta del paso. Entra deslizando, el número hace
// un flip desde el anterior.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EIO, EO, F_DISPLAY, F_SANS, lin, pop } from "./theme";

export const TfbStep: React.FC<{ dur: number; n: number; total: number; label: string; kicker?: string }> = ({ dur, n, total, label, kicker = "PASO" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = pop(f, fps, 0, 170, 16), out = lin(f, [dur - 8, dur], [1, 0], EIO);
  const flip = lin(f, [4, 14], [90, 0], EO);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 60, top: 56, transform: `translateX(${(1 - inn) * -420}px)`, opacity: out, display: "flex", alignItems: "stretch",
        filter: "drop-shadow(0 12px 26px rgba(0,0,0,0.45))" }}>
        <div style={{ backgroundColor: C.yellow, padding: "10px 22px 4px", borderRadius: "14px 0 0 14px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 22, letterSpacing: 4, color: C.ink }}>{kicker}</div>
          <div style={{ fontFamily: F_DISPLAY, fontSize: 96, lineHeight: 1, color: C.ink, transform: `perspective(400px) rotateX(${flip}deg)` }}>{n}</div>
        </div>
        <div style={{ backgroundColor: "rgba(17,17,17,0.88)", padding: "14px 26px", borderRadius: "0 14px 14px 0", display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
          <div style={{ fontFamily: F_DISPLAY, fontSize: 52, color: C.white, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap",
            clipPath: `inset(0 ${100 - lin(f, [6, 18], [0, 100], EO)}% 0 0)` }}>{label}</div>
          <div style={{ display: "flex", gap: 10 }}>
            {Array.from({ length: total }, (_, i) => {
              const cur = i === n - 1, done = i < n - 1;
              const pulse = cur ? 1 + 0.18 * Math.sin((f / fps) * Math.PI * 3) : 1;
              return <div key={i} style={{ width: cur ? 30 : 18, height: 12, borderRadius: 6, backgroundColor: done || cur ? C.yellow : "rgba(255,255,255,0.28)", transform: `scaleY(${pulse})` }} />;
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
