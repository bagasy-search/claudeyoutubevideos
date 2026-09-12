// Piezas.tsx — vlog aloebrazo. Clip (OffthreadVideo + audio NATIVO ducked), Foto (ken-burns),
// y overlays del CTA. ⛔ SIEMPRE OffthreadVideo, NUNCA <Video> (lag en el render).
import React from "react";
import { AbsoluteFill, OffthreadVideo, Audio, Img, staticFile, useCurrentFrame, interpolate } from "remotion";

const BG = "#0A0B08";

// Clip a pantalla completa: video sin audio (OffthreadVideo) + su audio NATIVO por separado, ducked
// bajo la voz (el creador lo pidió: los sonidos de los clips dan realismo).
export const Clip: React.FC<{ src: string; vol?: number }> = ({ src, vol = 0.1 }) => {
  const f = useCurrentFrame();
  const s = 1.02 + Math.sin(f / 700) * 0.012;
  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)})` }}
      />
      <Audio src={staticFile(src)} volume={vol} />
    </AbsoluteFill>
  );
};

// Foto a pantalla completa con push lento (nunca estática).
export const Foto: React.FC<{ src: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const s = 1.04 + Math.sin(f / 650) * 0.02;
  const dx = Math.sin(f / 900) * 0.5;
  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)}) translateX(${dx.toFixed(3)}%)` }}
      />
    </AbsoluteFill>
  );
};

// —— CTA ————————————————————————————————————————————————————————————
// Lower-third discreto "cantidades en la descripción 👇"
export const LowerThird: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 96, opacity: op }}>
      <div style={{
        background: "rgba(10,11,8,0.82)", color: "#F4F1E8", fontFamily: "Inter, sans-serif",
        fontWeight: 700, fontSize: 40, letterSpacing: 0.3, padding: "16px 30px", borderRadius: 14,
        borderLeft: "6px solid #12B3AE",
      }}>{text}</div>
    </AbsoluteFill>
  );
};

// Lámina full-screen (el libro de recetas) con marco suave y push
export const Lamina: React.FC<{ src: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const s = 1.02 + Math.sin(f / 600) * 0.012;
  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)})` }} />
    </AbsoluteFill>
  );
};

// Tarjeta de QR + dominio, abajo a la derecha, sobre lo que haya
export const QrCard: React.FC<{ qr: string; domain: string }> = ({ qr, domain }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const dy = interpolate(f, [0, 12], [30, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-end", padding: 64, opacity: op }}>
      <div style={{
        transform: `translateY(${dy}px)`, background: "#F4F1E8", borderRadius: 20, padding: 20,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10, boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
      }}>
        <Img src={staticFile(qr)} style={{ width: 220, height: 220, borderRadius: 8 }} />
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 30, color: "#0A0B08", letterSpacing: 0.4 }}>{domain}</div>
      </div>
    </AbsoluteFill>
  );
};
