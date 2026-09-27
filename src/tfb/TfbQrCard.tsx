// TfbQrCard — la tarjeta del QR REAL: fondo blanco, QR nítido y QUIETO (sin Ken-Burns: tiene que escanearse desde
// el televisor), la portada real inclinada al lado y dos renglones cortos. Entra con un solo resorte y se queda fija.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, INTER, TFB, clamp, outro, pop } from "./theme";

export const TfbQrCard: React.FC<{ dur: number; qr: string; cover?: string; kicker: string; line?: string; url?: string; side?: "right" | "left"; dimBg?: number }> = ({ dur, qr, cover, kicker, line, url, side = "right", dimBg = 0.25 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const o = outro(f, dur, 8), p = pop(f, fps, 0, 16, 0.8), pc = pop(f, fps, 6, 14, 0.7);
  const settled = f > 18; // a partir de acá, NADA se mueve (el QR tiene que leerse)
  const s = settled ? 1 : interpolate(p, [0, 1], [0.85, 1]);
  const pos: React.CSSProperties = side === "right" ? { right: 80 } : { left: 80 };
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${dimBg * interpolate(f, [0, 10], [0, 1], clamp)})` }} />
      <div style={{ position: "absolute", top: 150, ...pos, display: "flex", alignItems: "center", gap: 36, flexDirection: side === "right" ? "row" : "row-reverse",
        opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `scale(${s})`, transformOrigin: side === "right" ? "100% 50%" : "0% 50%" }}>
        {cover && <Img src={staticFile(cover)} style={{ height: 520, borderRadius: 10, boxShadow: "0 24px 60px rgba(0,0,0,0.6)", transform: `rotate(${settled ? -5 : interpolate(pc, [0, 1], [-16, -5])}deg)`, opacity: pc }} />}
        <div style={{ background: "#FFFFFF", borderRadius: 30, padding: 34, boxShadow: "0 24px 70px rgba(0,0,0,0.55)", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 520 }}>
          <div style={{ fontFamily: INTER, fontWeight: 900, fontSize: 30, color: TFB.ink, letterSpacing: 1, textTransform: "uppercase", textAlign: "center" }}>{kicker}</div>
          <Img src={staticFile(qr)} style={{ width: 440, height: 440, display: "block", imageRendering: "pixelated" }} />
          {line && <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 26, color: "#333", textAlign: "center", lineHeight: 1.2 }}>{line}</div>}
          {url && <div style={{ fontFamily: ANTON, fontSize: 38, color: TFB.red, letterSpacing: 0.5 }}>{url}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};
