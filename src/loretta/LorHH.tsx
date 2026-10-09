// Kit de Loretta's House Hacks (temporada 1): página REAL del libro con su marca, tarjeta QR del CTA 2 y línea verde BE CAREFUL.
//   LorPage  {src, page, half?}  página renderizada del PDF a 1920 de ancho; paneo vertical lento (top: 0→45 %, low: 50→100 %)
//   LorQR    {src, cover}        QR grande + tapa del libro + "point your phone camera at the square"
//   LorCareful {text}            overlay: franja verde abajo con BE CAREFUL + el límite de seguridad de la página
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { LOR, SERIF, HAND, gingham } from "./LorTheme";

const PAGE_H = 1920 * 792 / 612; // la página del libro a 1920 de ancho (carta, 612x792 pt)

export const LorPage: React.FC<{ src: string; page: number; half?: string }> = ({ src, page, half }) => {
  const f = useCurrentFrame(); const { durationInFrames, fps } = useVideoConfig();
  const over = PAGE_H - 1080;
  const [a, b] = half === "low" ? [0.5, 1.0] : [0.0, 0.45];
  const k = interpolate(f, [0, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const y = -over * (a + (b - a) * k);
  const inn = interpolate(f, [0, 10], [1.04, 1], { extrapolateRight: "clamp" });
  const tag = spring({ frame: f - 8, fps, config: { damping: 15, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ backgroundColor: LOR.paper, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: y, width: 1920, height: PAGE_H, scale: String(inn), transformOrigin: "50% 0%" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(59,42,30,0.10) 0%, rgba(0,0,0,0) 12%, rgba(0,0,0,0) 86%, rgba(59,42,30,0.14) 100%)" }} />
      <div style={{ position: "absolute", right: 56, top: 44, translate: `${(1 - tag) * 420}px 0`, background: LOR.gingham, color: LOR.white, fontFamily: SERIF, fontWeight: 900, fontSize: 40, letterSpacing: 3, padding: "14px 30px", borderRadius: 6, boxShadow: `0 10px 24px ${LOR.shadow}` }}>
        PAGE {page} · THE HOUSE BOOK
      </div>
    </AbsoluteFill>
  );
};

export const LorQR: React.FC<{ src: string; cover: string }> = ({ src, cover }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 14, stiffness: 110 } });
  const pulse = 1 + 0.015 * Math.sin(f / 9);
  const out = interpolate(f, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ ...gingham(LOR.gingham, 56, 0.35), opacity: out }}>
      <div style={{ position: "absolute", left: 150, top: 120, width: 760, scale: String((0.85 + 0.15 * p) * pulse), background: LOR.white, borderRadius: 24, padding: 40, boxShadow: `0 24px 60px ${LOR.shadow}`, textAlign: "center" }}>
        <Img src={staticFile(src)} style={{ width: 680, height: 680 }} />
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: LOR.ink, marginTop: 6 }}>point your phone camera at the square</div>
      </div>
      <div style={{ position: "absolute", right: 170, top: 150, width: 640, rotate: "3deg", translate: `${(1 - p) * 700}px 0` }}>
        <Img src={staticFile(cover)} style={{ width: 640, borderRadius: 8, boxShadow: `0 30px 70px rgba(0,0,0,0.35)` }} />
        <div style={{ marginTop: 26, fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: LOR.ink, textAlign: "center", background: LOR.white, borderRadius: 12, padding: "12px 18px" }}>133 tricks · one a page</div>
      </div>
    </AbsoluteFill>
  );
};

export const LorCareful: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = spring({ frame: f - 4, fps, config: { damping: 16, stiffness: 130 } });
  const out = interpolate(f, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const size = text.length > 150 ? 34 : text.length > 95 ? 38 : 44;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 56, opacity: out, translate: `0 ${(1 - p) * 140}px`, display: "flex", alignItems: "stretch", borderRadius: 14, overflow: "hidden", boxShadow: `0 16px 40px rgba(0,0,0,0.35)` }}>
        <div style={{ background: LOR.greenDeep, color: LOR.white, fontFamily: SERIF, fontWeight: 900, fontSize: 40, letterSpacing: 3, padding: "22px 30px", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>BE CAREFUL</div>
        <div style={{ background: "rgba(255,253,247,0.96)", borderTop: `6px solid ${LOR.green}`, color: LOR.ink, fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1.22, padding: "18px 30px", flex: 1, display: "flex", alignItems: "center" }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};
