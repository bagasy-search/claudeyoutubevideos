// ActChip.tsx — OVERLAY: la pestaña "FILE 05 · PART 3 — THE RELEASE" arriba a la izquierda en cada acto.
// Va en cfg.OVERLAY (encima del avatar o del b-roll, no tapa la base). Entra, se queda ~5 s y se va.
// ⛔ Usarla SOLO en el cambio de acto (6-8 por video), no como cartel permanente.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { W, F_TYPE, rgba } from "./Stage";

export const ActChip: React.FC<{ fileNo: string | number; part: string; durationInFrames?: number }> = ({ fileNo, part, durationInFrames }) => {
  const f = useCurrentFrame();
  const { durationInFrames: seq } = useVideoConfig();
  const D = durationInFrames ?? seq;
  const a = interpolate(f, [0, 10, D - 12, D], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 40, top: 36, opacity: a, transform: `translateY(${((1 - a) * -14).toFixed(1)}px)`, display: "flex", alignItems: "stretch", boxShadow: "0 8px 22px rgba(0,0,0,.5)" }}>
        <div style={{ background: W.manila, padding: "9px 16px", fontFamily: F_TYPE, fontSize: 26, letterSpacing: 2, color: W.ink0 }}>FILE {String(fileNo).padStart(2, "0")}</div>
        <div style={{ background: rgba(W.ink0, 0.78), padding: "9px 18px", fontFamily: F_TYPE, fontSize: 26, letterSpacing: 2, color: W.white, borderRight: `5px solid ${W.red}` }}>{part}</div>
      </div>
    </AbsoluteFill>
  );
};
