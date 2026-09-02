// Piezas.tsx — vlog feettingle (Dr. Federer — The Nightly Remedy, EN).
// Clip (OffthreadVideo + audio nativo ducked), Foto (ken-burns), LaminaZoom (recorrido por filas),
// LowerThird + QrCard (CTA). ⛔ SIEMPRE OffthreadVideo, NUNCA <Video> (lag en el render).
import React from "react";
import { AbsoluteFill, OffthreadVideo, Img, staticFile, useCurrentFrame, interpolate } from "remotion";

const BG = "#0A0B08";

// Clip i2v: b-roll con movimiento sutil. loop para llenar el slot sin congelar; silencioso (la
// narración va en el Main). ⛔ SIEMPRE OffthreadVideo, NUNCA <Video>.
export const Clip: React.FC<{ src: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const s = 1.02 + Math.sin(f / 700) * 0.012;
  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted loop style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)})` }} />
    </AbsoluteFill>
  );
};

// Foto full-screen con push lento (nunca estática).
export const Foto: React.FC<{ src: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const s = 1.04 + Math.sin(f / 650) * 0.02;
  const dx = Math.sin(f / 900) * 0.5;
  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)}) translateX(${dx.toFixed(3)}%)` }} />
    </AbsoluteFill>
  );
};

// Lámina full-screen con ZOOM al punto que se está explicando (focus por fila).
const FOCUS: Record<string, { x: number; y: number; z: number }> = {
  full:  { x: 50, y: 50, z: 1.06 },
  left:  { x: 28, y: 55, z: 1.34 },
  right: { x: 72, y: 55, z: 1.34 },
  r1:    { x: 50, y: 40, z: 1.5 },
  r2:    { x: 50, y: 54, z: 1.5 },
  r3:    { x: 50, y: 68, z: 1.5 },
  r4:    { x: 50, y: 82, z: 1.5 },
};
export const LaminaZoom: React.FC<{ src: string; focus?: string }> = ({ src, focus = "full" }) => {
  const f = useCurrentFrame();
  const p = FOCUS[focus] || FOCUS.full;
  const s = p.z + Math.sin(f / 700) * 0.012;          // micro-push vivo
  const drift = focus === "full" ? Math.sin(f / 800) * 0.4 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#FBF8F2", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{
        width: "100%", height: "100%", objectFit: "cover",
        transformOrigin: `${p.x}% ${p.y}%`,
        transform: `scale(${s.toFixed(4)}) translateX(${drift.toFixed(3)}%)`,
      }} />
    </AbsoluteFill>
  );
};

// —— CTA ——
export const LowerThird: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 96, opacity: op }}>
      <div style={{
        background: "rgba(6,59,64,0.92)", color: "#F4F1E8", fontFamily: "Inter, sans-serif",
        fontWeight: 700, fontSize: 40, letterSpacing: 0.3, padding: "16px 30px", borderRadius: 14,
        borderLeft: "6px solid #C9A867",
      }}>{text}</div>
    </AbsoluteFill>
  );
};

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
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 30, color: "#063B40", letterSpacing: 0.4 }}>{domain}</div>
      </div>
    </AbsoluteFill>
  );
};
