// TfbQRCard — tarjeta del QR REAL (sin Ken-Burns: quieto y nítido para que el teléfono lo lea) sobre fondo BLANCO, con la
// portada REAL al lado y dos líneas (≤6 palabras c/u) por props. Entra con un deslizamiento corto y queda FIJA.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TFB, F_DISPLAY, F_SANS, clamp } from "./theme";

export type TfbQRCardProps = { qr: string; cover?: string; line1: string; line2?: string; dur: number; side?: "right" | "left" };

export const TfbQRCard: React.FC<TfbQRCardProps> = ({ qr, cover, line1, line2, dur, side = "right" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 20, stiffness: 140 } });
  const out = interpolate(f, [dur - 8, dur], [0, 1], clamp);
  const pos = side === "right" ? { right: 64 } : { left: 64 };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", bottom: 64, ...pos, display: "flex", gap: 26, alignItems: "flex-end", opacity: (1 - out) * Math.min(1, a * 1.4), transform: `translateY(${(1 - a) * 60}px)` }}>
        {cover && <Img src={cover} style={{ height: 420, borderRadius: 10, boxShadow: "0 16px 40px rgba(0,0,0,.5)", border: "4px solid #fff" }} />}
        <div style={{ background: "#fff", borderRadius: 22, padding: "22px 22px 16px", boxShadow: "0 16px 40px rgba(0,0,0,.45)", display: "flex", flexDirection: "column", alignItems: "center", borderTop: `10px solid ${TFB.yellow}` }}>
          <Img src={qr} style={{ width: 380, height: 380, display: "block", imageRendering: "pixelated" }} />
          <div style={{ fontFamily: F_DISPLAY, fontSize: 40, color: TFB.ink, marginTop: 8, letterSpacing: 1 }}>{line1}</div>
          {line2 && <div style={{ fontFamily: F_SANS, fontWeight: 700, fontSize: 28, color: "#333" }}>{line2}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};
