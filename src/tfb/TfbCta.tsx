// TfbCta — tarjeta de CTA casual: PORTADA real de la colección + QR real sobre BLANCO puro, sin Ken-Burns, sin rotación
// y a tamaño fijo (tiene que decodificar en cualquier cuadro). Entra deslizando desde abajo a la derecha y se queda
// quieta; sólo el borde amarillo "respira" (el QR no se mueve). Texto corto por props.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EIO, F_DISPLAY, F_SANS, lin, pop } from "./theme";

export const TfbCta: React.FC<{ dur: number; qr: string; cover: string; kicker?: string; line?: string; side?: "right" | "left"; qrSize?: number }> = ({ dur, qr, cover, kicker, line, side = "right", qrSize = 330 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inn = pop(f, fps, 0, 150, 18), out = lin(f, [dur - 10, dur], [1, 0], EIO);
  const settled = f > 14; // a partir de acá, el QR queda absolutamente quieto
  const ty = settled ? 0 : (1 - Math.max(0, inn)) * 420;
  const glow = 0.5 + 0.5 * Math.sin((f / fps) * Math.PI * 1.4);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <div style={{ position: "absolute", [side]: 60, bottom: 60, transform: `translateY(${ty}px)`, display: "flex", gap: 26, alignItems: "center",
        backgroundColor: "rgba(15,15,15,0.92)", borderRadius: 28, padding: 22, border: `5px solid rgba(255,210,31,${0.55 + 0.45 * glow})`, boxShadow: "0 20px 60px rgba(0,0,0,0.55)" }}>
        <Img src={staticFile(cover)} style={{ height: qrSize + 60, borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          {kicker ? <div style={{ fontFamily: F_SANS, fontWeight: 900, fontSize: 24, letterSpacing: 4, color: C.yellow }}>{kicker}</div> : null}
          <div style={{ backgroundColor: "#FFFFFF", padding: 18, borderRadius: 14 }}>
            <Img src={staticFile(qr)} style={{ width: qrSize, height: qrSize, display: "block", imageRendering: "pixelated" }} />
          </div>
          {line ? <div style={{ fontFamily: F_DISPLAY, fontSize: 36, color: C.white, letterSpacing: 1 }}>{line}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
