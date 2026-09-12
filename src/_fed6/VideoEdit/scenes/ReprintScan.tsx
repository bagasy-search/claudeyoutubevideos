import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { Media } from "../components/Media";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── ReprintScan — "your skin keeps RE-PRINTING the spot" ─────────────────────
// Concept-visual del canal: sobre un macro real de piel con una mancha, una
// BARRA DE ESCÁNER de impresora barre en vertical y, en cada pasada, la mancha
// se "re-imprime" más oscura (pulso de opacidad). Aesthetic de impresión: leve
// desfase de registro RGB en los bordes + ticker "RE-PRINTING…". Reutilizable
// para cualquier reframe "tu piel/tu cuerpo sigue haciendo X".
//
// Props:
//   image      macro real de piel con mancha (stock)
//   spot       {x,y,r} centro y radio de la mancha en la imagen (0..1)
//   label      caption inferior
//   passes     cuántas pasadas de escáner (default 3)

const INTER = loadInter().fontFamily;
const TEAL = "#12B3AE";
const CREAM = "#F5F9FA";
const INK = "#0A151A";

export const ReprintScan: React.FC<{
  durationInFrames: number;
  image: string;
  spot?: { x: number; y: number; r: number };
  label?: string;
  passes?: number;
  tone?: "teal" | "warn";
}> = ({ durationInFrames, image, spot = { x: 0.5, y: 0.48, r: 0.17 }, label, passes = 3, tone = "teal" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const accent = tone === "warn" ? "#E4141B" : TEAL;

  // push-in lento sobre la mancha (ken-burns)
  const z = interpolate(frame, [0, durationInFrames], [1.06, 1.2], { extrapolateRight: "clamp" });

  // ciclo del escáner: sweep vertical repetido
  const cycle = Math.max(24, Math.floor((durationInFrames - 20) / passes));
  const local = frame % cycle;
  const scanY = interpolate(local, [0, cycle * 0.85], [-8, 108], { extrapolateRight: "clamp" });
  const passIx = Math.floor(frame / cycle);

  // la mancha se "re-imprime": cada vez que el escáner cruza su centro, sube un escalón de oscuridad
  const spotCy = spot.y * 100;
  const crossed = Math.min(passes, passIx + (scanY >= spotCy ? 1 : 0));
  const reink = interpolate(crossed, [0, passes], [0.15, 0.92], { extrapolateRight: "clamp" });
  // pulso justo cuando cruza
  const near = 1 - Math.min(1, Math.abs(scanY - spotCy) / 14);
  const stampPulse = near * near;

  const labelSp = spring({ frame: frame - 22, fps, config: { damping: 18, stiffness: 120 } });
  const tickerSp = spring({ frame: frame - 8, fps, config: { damping: 20, stiffness: 140 } });

  const spotPx = { left: `${spot.x * 100}%`, top: `${spot.y * 100}%`, w: spot.r * 2 * height, };

  return (
    <AbsoluteFill style={{ fontFamily: INTER, backgroundColor: INK, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${spot.x * 100}% ${spot.y * 100}%` }}>
        <Media src={image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

        {/* mancha re-impresa: mancha oscura extra que se intensifica pasada a pasada */}
        <div style={{
          position: "absolute", left: spotPx.left, top: spotPx.top, transform: "translate(-50%,-50%)",
          width: spotPx.w, height: spotPx.w * 0.82, borderRadius: "50%",
          background: `radial-gradient(ellipse at 50% 45%, rgba(60,34,18,${reink}) 0%, rgba(74,44,24,${reink * 0.75}) 42%, rgba(74,44,24,0) 72%)`,
          filter: "blur(2px)",
          mixBlendMode: "multiply",
          opacity: 0.5 + 0.5 * reink,
        }} />
        {/* desfase de registro (impresión mal alineada) al re-imprimir */}
        <div style={{
          position: "absolute", left: spotPx.left, top: spotPx.top, transform: `translate(calc(-50% + ${stampPulse * 6}px), -50%)`,
          width: spotPx.w * 0.9, height: spotPx.w * 0.74, borderRadius: "50%",
          border: `2px solid rgba(18,179,174,${stampPulse * 0.5})`,
          boxShadow: `0 0 24px rgba(18,179,174,${stampPulse * 0.4})`,
        }} />
      </AbsoluteFill>

      {/* viñeta */}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 220px rgba(0,0,0,0.72)", pointerEvents: "none" }} />

      {/* BARRA DE ESCÁNER */}
      <div style={{ position: "absolute", left: 0, right: 0, top: `${scanY}%`, height: 4, background: accent, boxShadow: `0 0 26px 6px ${accent}cc`, opacity: local < cycle * 0.85 ? 0.95 : 0 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: `${scanY}%`, height: 120, transform: "translateY(-120px)", background: `linear-gradient(to bottom, ${accent}00, ${accent}22)`, opacity: local < cycle * 0.85 ? 1 : 0 }} />

      {/* ticker RE-PRINTING */}
      <div style={{ position: "absolute", top: 54, left: 60, display: "flex", alignItems: "center", gap: 14, opacity: tickerSp }}>
        <div style={{ width: 13, height: 13, borderRadius: 7, background: accent, boxShadow: `0 0 16px ${accent}`, opacity: 0.5 + 0.5 * Math.abs(Math.sin(frame / 6)) }} />
        <span style={{ fontSize: 27, fontWeight: 800, letterSpacing: 3, color: CREAM, textTransform: "uppercase" }}>Re-printing</span>
        <span style={{ fontSize: 27, fontWeight: 800, color: accent }}>{"·".repeat(1 + (Math.floor(frame / 8) % 3))}</span>
        <span style={{ fontSize: 22, fontWeight: 700, color: "rgba(245,249,250,0.55)", marginLeft: 8 }}>pass {Math.min(passes, passIx + 1)} / {passes}</span>
      </div>

      {/* caption inferior */}
      {label && (
        <div style={{ position: "absolute", left: "50%", bottom: 96, transform: `translateX(-50%) translateY(${(1 - labelSp) * 20}px)`, opacity: labelSp, maxWidth: 1500 }}>
          <div style={{ background: "rgba(10,21,26,0.9)", border: `1px solid ${accent}55`, borderRadius: 18, padding: "22px 40px", boxShadow: "0 24px 70px rgba(0,0,0,0.6)", textAlign: "center" }}>
            <span style={{ fontSize: 50, fontWeight: 900, color: CREAM, lineHeight: 1.12 }}>{label}</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
