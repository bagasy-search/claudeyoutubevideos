// RkspareLandingCard.tsx — captura real de la landing (morning) en un marco de celular que entra
// desde la derecha con un scroll lento. Sólo se usa en el CTA de rkspare (canal Ray Kessler).
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const RkspareLandingCard: React.FC<{ src: string; kicker?: string; qr?: string }> = ({ src, kicker, qr }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f, fps, config: { damping: 200 }, durationInFrames: 22 });
  const x = interpolate(enter, [0, 1], [520, 0]);
  const scroll = interpolate(f, [0, 360], [0, -260], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-end", paddingRight: 90, pointerEvents: "none" }}>
      <div style={{ transform: `translateX(${x}px)`, display: "flex", alignItems: "center", gap: 28 }}>
        {qr ? (
          <div style={{ background: "#fff", borderRadius: 18, padding: 18, width: 260, textAlign: "center", boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
            <Img src={staticFile(qr)} style={{ width: 224, height: 224 }} />
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 19, color: "#111", marginTop: 8 }}>SCAN: THE COMPLETE EDITION</div>
          </div>
        ) : null}
        <div style={{ width: 380, height: 760, borderRadius: 42, background: "#0b0b0b", padding: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 28, overflow: "hidden", background: "#fff", position: "relative" }}>
            <Img src={staticFile(src)} style={{ width: "100%", transform: `translateY(${scroll}px)` }} />
          </div>
        </div>
      </div>
      {kicker ? (
        <div style={{ position: "absolute", top: 70, right: 90, fontFamily: "Arial Black, Arial, sans-serif", fontSize: 26, color: "#f5c542", letterSpacing: 2 }}>{kicker}</div>
      ) : null}
    </AbsoluteFill>
  );
};

export default RkspareLandingCard;
