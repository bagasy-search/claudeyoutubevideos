// FileChapter.tsx — separador de capítulo de THE ROWE FILES: una ficha de índice de papel entra girando sobre la
// foto real desenfocada, pestaña manila con el número, título tipeado y subrayado a mano. Sale por zoom-through.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, ramp, spr, Atmosphere, Finish, SegmentShell } from "./RoweDepth";

export const FileChapter: React.FC<{
  number?: string;
  title?: string;
  eyebrow?: string;
  tone?: "brass" | "danger";
  bed?: string;
  durationInFrames?: number;
}> = ({ number = "", title = "", eyebrow = "", tone = "brass", bed, durationInFrames = 96 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = spr(frame, fps, 0, 120, 0.8);
  const chars = Math.floor(Math.max(0, frame - 8) * 2.2);
  const line = ramp(frame, 14 + title.length / 2.2, 30 + title.length / 2.2);
  const col = tone === "danger" ? V.danger : V.brass;
  return (
    <SegmentShell frame={frame} dur={durationInFrames}>
      <Atmosphere frame={frame} img={bed} blur={18} dim={0.7} bokeh={8} seed={71} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{
          position: "relative", width: 1240, height: 560, background: "#F3EAD6", borderRadius: 10,
          boxShadow: "0 60px 120px rgba(0,0,0,0.7)", transform: `rotate(${interpolate(k, [0, 1], [-9, -1.5]).toFixed(2)}deg) scale(${interpolate(k, [0, 1], [0.8, 1]).toFixed(3)})`, opacity: k,
          backgroundImage: `repeating-linear-gradient(0deg, transparent 0 69px, ${rgba("#7A9CC0", 0.25)} 69px 71px)`,
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: rgba("#B8342B", 0.55) }} />
          <div style={{ position: "absolute", top: -70, left: 70, height: 80, padding: "0 40px", borderRadius: "14px 14px 0 0", background: col, display: "flex", alignItems: "center", fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 46, color: "#2B2418", letterSpacing: 3 }}>{number}</div>
          <div style={{ position: "absolute", left: 90, top: 90, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: 6, color: "#8A6A30", textTransform: "uppercase" }}>{eyebrow}</div>
          <div style={{ position: "absolute", left: 90, right: 90, top: 170, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 104, lineHeight: 1.02, color: "#23201B", textTransform: "uppercase" }}>
            {title.slice(0, chars)}
          </div>
          <svg style={{ position: "absolute", left: 90, bottom: 80, width: 900, height: 40, overflow: "visible" }} viewBox="0 0 900 40">
            <path d="M4 26 C 200 10, 420 34, 640 18 S 860 22, 896 14" fill="none" stroke={tone === "danger" ? "#B8342B" : "#B48A3E"} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - line} />
          </svg>
          <div style={{ position: "absolute", right: 60, bottom: 40, fontFamily: F_BODY, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: rgba("#23201B", 0.5) }}>THE ROWE FILES</div>
        </div>
      </AbsoluteFill>
      <Finish frame={frame} seed={73} motes={10} />
    </SegmentShell>
  );
};
