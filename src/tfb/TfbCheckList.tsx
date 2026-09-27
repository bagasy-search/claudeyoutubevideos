// TfbCheckList — lista de SÍ / NO sobre el footage (sin placa): cada renglón entra con un sello (✓ verde o ✗ rojo)
// que golpea, texto en blanco con contorno. Para "cuándo NO sirve", "lo que necesitas", etc. ≤ 12 palabras en total.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, INTER, TFB, clamp, outro, pop, strokeText } from "./theme";

export type CheckRow = { t: string; ok: boolean; at: number };
export const TfbCheckList: React.FC<{ dur: number; title?: string; rows: CheckRow[]; side?: "left" | "right"; titleColor?: "red" | "yellow" }> = ({ dur, title, rows, side = "left", titleColor = "red" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const o = outro(f, dur, 7);
  const x: React.CSSProperties = side === "left" ? { left: 90 } : { right: 90, alignItems: "flex-end" };
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: side === "left" ? "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 70%)" : "linear-gradient(270deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 70%)",
        opacity: interpolate(f, [0, 8], [0, 1], clamp) }} />
      <div style={{ position: "absolute", top: 170, display: "flex", flexDirection: "column", gap: 30, ...x }}>
        {title && (() => { const p = pop(f, fps, 0, 11, 0.6); return <div style={{ transform: `scale(${interpolate(p, [0, 1], [1.6, 1])}) rotate(-2deg)`, opacity: p, transformOrigin: side === "left" ? "0 50%" : "100% 50%" }}>
          <span style={{ fontFamily: ANTON, fontSize: 74, color: titleColor === "red" ? TFB.white : TFB.ink, background: titleColor === "red" ? TFB.red : TFB.yellow, padding: "2px 24px 6px", borderRadius: 12, boxShadow: "0 8px 0 rgba(0,0,0,0.35)" }}>{title}</span></div>; })()}
        {rows.map((r, i) => { const p = pop(f, fps, r.at, 12, 0.6), s = pop(f, fps, r.at + 5, 9, 0.5); return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, opacity: p, transform: `translateX(${(1 - p) * (side === "left" ? -60 : 60)}px)`, flexDirection: side === "left" ? "row" : "row-reverse" }}>
            <div style={{ width: 78, height: 78, borderRadius: 39, background: r.ok ? TFB.green : TFB.red, display: "flex", alignItems: "center", justifyContent: "center",
              transform: `scale(${interpolate(s, [0, 1], [2.4, 1])})`, boxShadow: "0 6px 0 rgba(0,0,0,0.35)" }}>
              <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 50, color: TFB.white, lineHeight: 1 }}>{r.ok ? "✓" : "✕"}</span>
            </div>
            <span style={{ fontFamily: ANTON, fontSize: 60, color: TFB.white, textTransform: "uppercase", ...strokeText(4) }}>{r.t}</span>
          </div>); })}
      </div>
    </AbsoluteFill>
  );
};
