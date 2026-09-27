// TfbList — lista corta que se arma sobre el footage (columna izquierda, fondo oscuro translúcido): un titular y
// hasta 4 renglones que entran cada uno en su cuadro `at`, con número grande o ícono ✓ / ✗. El renglón activo se
// resalta en amarillo; los anteriores quedan atenuados. Para "los 3 errores", "cuándo cambiar el tanque", etc.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EIO, EO, F_DISPLAY, F_SANS, lin, pop } from "./theme";

export type ListRow = { text: string; at: number; mark?: "num" | "x" | "check" };

export const TfbList: React.FC<{ dur: number; title: string; rows: ListRow[]; accent?: string; side?: "left" | "right" }> = ({ dur, title, rows, accent = C.red, side = "left" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = lin(f, [0, 12], [0, 1], EO), out = lin(f, [dur - 10, dur], [1, 0], EIO);
  const cur = rows.filter((r) => r.at <= f).length - 1;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <div style={{ position: "absolute", [side]: 0, top: 0, bottom: 0, width: 880, background: `linear-gradient(${side === "left" ? 90 : 270}deg, rgba(0,0,0,0.82) 60%, rgba(0,0,0,0))`, opacity: inn }} />
      <div style={{ position: "absolute", [side]: 90, top: 150, width: 720, display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ fontFamily: F_DISPLAY, fontSize: 82, color: C.white, letterSpacing: 2, lineHeight: 1, transform: `translateX(${(1 - inn) * -60}px)`, opacity: inn }}>{title}</div>
        <div style={{ height: 8, width: 160 * inn, backgroundColor: accent, borderRadius: 4 }} />
        {rows.map((r, i) => {
          const s = pop(f, fps, r.at, 200, 16); if (f < r.at) return null;
          const active = i === cur;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, transform: `translateX(${(1 - Math.max(0, s)) * -80}px)`, opacity: active ? 1 : 0.55 }}>
              <div style={{ minWidth: 76, height: 76, borderRadius: 14, backgroundColor: r.mark === "check" ? C.green : active ? accent : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: F_DISPLAY, fontSize: 54, color: C.white }}>
                {r.mark === "x" ? "✕" : r.mark === "check" ? "✓" : i + 1}
              </div>
              <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 44, lineHeight: 1.12, color: active ? C.yellow : C.white }}>{r.text}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
