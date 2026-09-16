// FileStamp.tsx — OVERLAY de expediente: una ficha de papel entra desde abajo a la izquierda con un
// renglón tipeado y un SELLO de goma golpea encima (TRUE / MYTH / CHECK / NOTE). Va ENCIMA del plano
// (no dibuja fondo completo). Sin texto por defecto con contenido.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { V, F_DISPLAY, rgba, CL, ramp } from "./RoweDepth";

const PAPER = "#F3EEE2";
const INK = "#1D2733";
const MONO = "'Courier New', Courier, monospace";

export const FileStamp: React.FC<{
  line?: string;
  stamp?: string;
  tone?: "ok" | "danger" | "brass";
  stampAt?: number;
  durationInFrames?: number;
}> = ({ line = "", stamp = "", tone = "brass", stampAt = 16, durationInFrames = 90 }) => {
  const frame = useCurrentFrame();
  const inK = ramp(frame, 0, 10);
  const outK = ramp(frame, durationInFrames - 8, durationInFrames);
  const chars = Math.floor(interpolate(frame, [4, 4 + Math.max(10, line.length * 0.9)], [0, line.length], CL));
  const st = frame - stampAt;
  const col = tone === "ok" ? V.ok : tone === "danger" ? V.danger : "#2F6D9A";
  const sc = st >= 0 ? interpolate(st, [0, 5, 9], [2.2, 0.95, 1], CL) : 2.2;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 90, bottom: 90, opacity: inK * (1 - outK), transform: `translateY(${((1 - inK) * 60 + outK * 30).toFixed(1)}px) rotate(-1.5deg)` }}>
        <div style={{ position: "relative", background: PAPER, borderRadius: 6, padding: "26px 40px 30px", minWidth: 560, maxWidth: 900, boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 10, background: rgba("#D9B878", 0.9), borderRadius: "6px 6px 0 0" }} />
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: "#6A7480", marginTop: 4 }}>THE ROWE FILES</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 44, lineHeight: 1.15, color: INK, marginTop: 6 }}>{line.slice(0, chars)}</div>
          {stamp ? (
            <div style={{ position: "absolute", right: -40, top: -44, padding: "6px 22px", border: `6px solid ${col}`, borderRadius: 10, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 54, letterSpacing: 4, color: col, background: rgba(PAPER, 0.35), opacity: st >= 0 ? 0.95 : 0, transform: `rotate(8deg) scale(${sc.toFixed(3)})` }}>{stamp}</div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
