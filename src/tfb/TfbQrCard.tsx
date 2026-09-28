// TfbQrCard — tarjeta de la guía: portada REAL + QR REAL sobre blanco (sin Ken-Burns, sin escala animada en el
// QR: entra con opacidad y desplazamiento y queda quieto y nítido para que el teléfono lo lea). Esquina o centro.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, F_UI, clamp, ease } from "./theme";

export const TfbQrCard: React.FC<{ dur: number; qr: string; portada: string; caption: string; pos?: "br" | "center"; qrSize?: number }> = ({ dur, qr, portada, caption, pos = "br", qrSize = 300 }) => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: ease }), out = interpolate(f, [dur - 10, dur], [1, 0], clamp);
  const o = Math.min(inn, out);
  return (
    <AbsoluteFill style={{ justifyContent: pos === "center" ? "center" : "flex-end", alignItems: pos === "center" ? "center" : "flex-end", padding: pos === "center" ? 0 : "0 64px 64px 0", opacity: o, pointerEvents: "none" }}>
      <div style={{ display: "flex", gap: 28, alignItems: "center", backgroundColor: "#F6EFDD", borderRadius: 26, padding: 24, border: `4px solid ${C.gold}`,
        boxShadow: "0 22px 60px rgba(0,0,0,0.45)", transform: `translateY(${(1 - inn) * 50}px)` }}>
        <Img src={staticFile(portada)} style={{ height: qrSize + 60, borderRadius: 8, boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ backgroundColor: "#FFFFFF", padding: 18, borderRadius: 10 }}>
            <Img src={staticFile(qr)} style={{ width: qrSize, height: qrSize, display: "block", imageRendering: "pixelated" }} />
          </div>
          <div style={{ fontFamily: F_UI, fontWeight: 800, fontSize: 30, color: C.espresso, textAlign: "center", maxWidth: qrSize + 40 }}>{caption}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
