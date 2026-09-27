// TfbQRCard — tarjeta del CTA: QR REAL (quieto, fondo blanco, sin Ken-Burns: tiene que decodificar en cualquier cuadro),
// la portada real al lado y dos líneas cortas. Entra con fundido (el QR nunca se escala ni se mueve).
import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, F, clamp, easeIn } from "./theme";

export type TfbQRCardProps = { dur: number; qr: string; cover?: string; line1: string; line2?: string; side?: "right" | "left" };
export const TfbQRCard: React.FC<TfbQRCardProps> = ({ dur, qr, cover, line1, line2, side = "right" }) => {
  const f = useCurrentFrame();
  const o = Math.min(interpolate(f, [0, 7], [0, 1], clamp), interpolate(f, [dur - 7, dur], [1, 0], { ...clamp, easing: easeIn }));
  return (
    <div style={{ position: "absolute", [side]: 64, bottom: 64, opacity: o, display: "flex", alignItems: "stretch", gap: 0, borderRadius: 26, overflow: "hidden", boxShadow: "0 16px 50px rgba(0,0,0,0.5)" }}>
      {cover ? <div style={{ width: 300, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}><Img src={staticFile(cover)} style={{ width: 264, height: "auto", display: "block", boxShadow: "0 6px 18px rgba(0,0,0,0.5)" }} /></div> : null}
      <div style={{ background: C.white, padding: "26px 30px 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <Img src={staticFile(qr)} style={{ width: 380, height: 380, display: "block", imageRendering: "pixelated" }} />
        <div style={{ fontFamily: F.ui, fontWeight: 900, fontSize: 30, color: C.ink, textAlign: "center" }}>{line1}</div>
        {line2 ? <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 24, color: "#444", textAlign: "center" }}>{line2}</div> : null}
      </div>
    </div>
  );
};
