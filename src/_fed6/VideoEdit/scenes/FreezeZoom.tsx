import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Media } from "../components/Media";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── FreezeZoom — congela una foto y hace ZOOM a un detalle con etiqueta ──────
// Pattern interrupt + énfasis: la imagen se ve entera, luego empuja hacia un punto
// {x,y} (0..1), aparece un círculo/etiqueta señalando el detalle.

const INTER = loadInter().fontFamily;
const TEAL = "#12B3AE", CREAM = "#F5F9FA", INK = "#0E1B22";

export const FreezeZoom: React.FC<{
  durationInFrames: number;
  image: string;
  x?: number; y?: number;   // punto del detalle (0..1)
  label?: string;
  zoom?: number;            // magnitud del zoom (default 1.9)
  tone?: "teal" | "warn";
}> = ({ durationInFrames, image, x = 0.5, y = 0.45, label, zoom = 1.9, tone = "teal" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = tone === "warn" ? "#E4141B" : TEAL;

  // empuje al detalle: se ve entera ~10 frames, luego zoom in
  const z = interpolate(frame, [10, 34], [1, zoom], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const originX = interpolate(frame, [10, 34], [50, x * 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const originY = interpolate(frame, [10, 34], [50, y * 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 130 } });
  const labelSp = spring({ frame: frame - 38, fps, config: { damping: 18, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ fontFamily: INTER, backgroundColor: INK, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${originX}% ${originY}%` }}>
        <Media src={image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>

      {/* reticón sobre el detalle */}
      <div style={{ position: "absolute", left: `${x * 100}%`, top: `${y * 100}%`, transform: "translate(-50%,-50%)", opacity: ring }}>
        <div style={{ width: 200, height: 200, borderRadius: 110, border: `5px solid ${accent}`, boxShadow: `0 0 0 8px ${accent}22, 0 0 40px ${accent}66`, transform: `scale(${interpolate(ring, [0, 1], [1.5, 1])})` }} />
      </div>

      {/* etiqueta */}
      {label && (
        <div style={{ position: "absolute", left: "50%", bottom: 120, transform: `translateX(-50%) translateY(${(1 - labelSp) * 18}px)`, opacity: labelSp }}>
          <div style={{ background: "rgba(12,22,28,0.92)", border: `1px solid ${accent}55`, borderRadius: 16, padding: "18px 34px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
            <span style={{ fontSize: 44, fontWeight: 900, color: CREAM }}>{label}</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
