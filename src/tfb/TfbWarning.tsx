// TfbWarning — advertencia de seguridad: banda con franjas de obra que entra barriendo, ícono dibujado
// (gafas / guantes / ojo) que late, y el texto corto (≤8 palabras). Rojo o amarillo.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F_DISPLAY, F_UI, clamp, ease, inOut, pop } from "./theme";

const Icon: React.FC<{ kind: "goggles" | "gloves" | "eye" | "alert"; color: string }> = ({ kind, color }) => (
  <svg width={120} height={120} viewBox="0 0 120 120">
    <circle cx={60} cy={60} r={56} fill={color} />
    {kind === "goggles" && <g fill="none" stroke={C.ink} strokeWidth={7} strokeLinejoin="round"><rect x={18} y={44} width={36} height={30} rx={12} /><rect x={66} y={44} width={36} height={30} rx={12} /><path d="M 54 56 Q 60 50 66 56" /><path d="M 18 58 L 8 54 M 102 58 L 112 54" /></g>}
    {kind === "gloves" && <path d="M 42 96 L 42 58 L 36 40 Q 34 32 41 32 Q 46 32 48 40 L 50 50 L 50 26 Q 50 20 56 20 Q 62 20 62 26 L 62 48 L 64 24 Q 65 18 71 19 Q 76 20 75 27 L 73 50 L 78 34 Q 80 28 85 30 Q 90 32 88 38 L 82 66 L 80 96 Z" fill="none" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />}
    {kind === "eye" && <g fill="none" stroke={C.ink} strokeWidth={7}><path d="M 14 60 Q 60 20 106 60 Q 60 100 14 60 Z" /><circle cx={60} cy={60} r={14} fill={C.ink} /></g>}
    {kind === "alert" && <g><path d="M 60 22 L 100 94 L 20 94 Z" fill="none" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" /><rect x={56} y={46} width={8} height={26} fill={C.ink} /><rect x={56} y={78} width={8} height={8} fill={C.ink} /></g>}
  </svg>
);
export const TfbWarning: React.FC<{ dur: number; text: string; icons?: ("goggles" | "gloves" | "eye" | "alert")[]; tone?: "red" | "yellow"; pos?: "top" | "bottom" }> = ({ dur, text, icons = ["alert"], tone = "red", pos = "bottom" }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  const o = inOut(f, dur, 6, 10);
  const wipe = interpolate(f, [0, 12], [0, 100], { ...clamp, easing: ease });
  const col = tone === "red" ? C.red : C.yellow, ink = tone === "red" ? C.white : C.ink;
  return (
    <AbsoluteFill style={{ opacity: o, justifyContent: pos === "top" ? "flex-start" : "flex-end", pointerEvents: "none" }}>
      <div style={{ margin: pos === "top" ? "56px 0 0" : "0 0 56px", display: "flex", justifyContent: "center" }}>
        <div style={{ clipPath: `inset(0 ${100 - wipe}% 0 0)`, display: "flex", alignItems: "center", gap: 22, background: col, padding: "16px 40px 16px 20px", borderRadius: 18,
          boxShadow: "0 18px 50px rgba(0,0,0,0.5)", backgroundImage: `repeating-linear-gradient(-45deg, rgba(0,0,0,0.0) 0 26px, rgba(0,0,0,0.12) 26px 52px)` }}>
          {icons.map((k, i) => <div key={k} style={{ transform: `scale(${pop(f, fps, 6 + i * 5, 9) * (1 + 0.05 * Math.sin((f - i * 5) / 4))})` }}><Icon kind={k} color={C.white} /></div>)}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: F_UI, fontWeight: 800, fontSize: 26, letterSpacing: 5, color: ink, opacity: 0.85 }}>{tone === "red" ? "CUIDADO" : "OJO"}</div>
            <div style={{ fontFamily: F_DISPLAY, fontSize: 66, color: ink, lineHeight: 1.05, textTransform: "uppercase", whiteSpace: "nowrap" }}>{text}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
